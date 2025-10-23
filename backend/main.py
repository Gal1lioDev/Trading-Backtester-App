from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from io import StringIO
import pandas as pd
import numpy as np
from scipy.stats import sharpe_ratio

# Global in-memory storage for the DataFrame
data_storage: dict[str, pd.DataFrame] = {}
DATA_KEY = "market_data"

# Initialize FastAPI app
app = FastAPI(title="Backtesting API MVP")

# Configure CORS to allow the frontend
origins = [
    "http://localhost:3000",  # Allow the React frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Response Models ---

class UploadResponse(BaseModel):
    filename: str
    rows: int
    status: str

class Metrics(BaseModel):
    total_return: float
    sharpe_ratio: float
    total_trades: int

class BacktestResult(BaseModel):
    equity_curve: list[dict]
    metrics: Metrics

# --- Endpoints ---

@app.post("/upload_csv", response_model=UploadResponse)
async def upload_csv(file: UploadFile):
    """Accepts a CSV, parses it, and stores it in memory."""
    try:
        # Read file contents
        content = await file.read()
        csv_data = StringIO(content.decode('utf-8'))
        
        # Read with Pandas
        df = pd.read_csv(csv_data)
        
        # Validate required columns
        required_cols = ['Date', 'Open', 'High', 'Low', 'Close']
        if not all(col in df.columns for col in required_cols):
            raise ValueError(f"CSV must contain columns: {', '.join(required_cols)}")

        # Clean and prepare data
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.set_index('Date').sort_index()

        # Store in global memory
        data_storage[DATA_KEY] = df
        
        return UploadResponse(
            filename=file.filename,
            rows=len(df),
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"File upload failed: {str(e)}")


@app.get("/run_backtest", response_model=BacktestResult)
async def run_backtest():
    """Runs a simple SMA crossover strategy on the stored data."""
    if DATA_KEY not in data_storage:
        raise HTTPException(status_code=404, detail="No data uploaded. Please upload a CSV first.")

    df = data_storage[DATA_KEY].copy()
    initial_cash = 1000.0

    # 1. Strategy Calculation: SMA Crossover (5 vs 20)
    df['SMA_Short'] = df['Close'].rolling(window=5).mean()
    df['SMA_Long'] = df['Close'].rolling(window=20).mean() # Window might be shorter than data

    # 2. Generate Signals
    # Buy signal: Short SMA crosses above Long SMA (Long entry)
    df['Signal'] = 0.0
    df['Signal'][5:] = np.where(df['SMA_Short'][5:] > df['SMA_Long'][5:], 1.0, 0.0)

    # Position: 1 for Long, 0 for Flat/Short (simple long-only strategy)
    df['Position'] = df['Signal'].diff()

    # 3. Calculate Equity Curve
    df['Returns'] = df['Close'].pct_change()
    df['Strategy_Returns'] = df['Returns'] * df['Signal'].shift(1)
    df['Equity'] = initial_cash * (1 + df['Strategy_Returns']).cumprod()
    df['Equity'].fillna(initial_cash, inplace=True) # Fill initial values

    # 4. Calculate Metrics
    final_equity = df['Equity'].iloc[-1]
    total_return = (final_equity / initial_cash - 1) * 100
    
    # Calculate trades (Approximate as position changes from -1 or 1)
    total_trades = int(df['Position'].abs().sum())
    
    # Calculate Sharpe Ratio (simplified)
    daily_returns = df['Strategy_Returns'].dropna()
    sharpe = (daily_returns.mean() / daily_returns.std()) * np.sqrt(252) if daily_returns.std() != 0 else 0
    
    # 5. Prepare Output
    equity_data = df[['Close', 'Equity']].reset_index().rename(columns={'Date': 'date', 'Close': 'price', 'Equity': 'equity'})
    
    return BacktestResult(
        equity_curve=equity_data.to_dict('records'),
        metrics=Metrics(
            total_return=round(total_return, 2),
            sharpe_ratio=round(sharpe, 2),
            total_trades=total_trades
        )
    )
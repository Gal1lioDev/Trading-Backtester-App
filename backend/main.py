from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from io import StringIO
import pandas as pd
import numpy as np
from pathlib import Path

data_storage: dict[str, pd.DataFrame] = {}
DATA_KEY = "market_data"

app = FastAPI(title="Backtesting API")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UploadResponse(BaseModel):
    filename: str
    rows: int
    status: str
    message: str

class Metrics(BaseModel):
    total_return: float
    sharpe_ratio: float
    total_trades: int

class EquityPoint(BaseModel):
    date: str
    price: float
    equity: float

class BacktestResult(BaseModel):
    equity_curve: list[EquityPoint]
    metrics: Metrics


@app.get("/")
async def root():
    return {"message": "Backtesting API is running", "status": "ok"}

@app.get("/sample_data")
async def load_sample_data():
    """Load the dummy_data.csv file into memory"""
    try:
        csv_path = Path(__file__).parent / "dummy_data.csv"
        df = pd.read_csv(csv_path)
        
        required_cols = ['Date', 'Open', 'High', 'Low', 'Close']
        if not all(col in df.columns for col in required_cols):
            raise ValueError(f"CSV must contain: {', '.join(required_cols)}")

        df['Date'] = pd.to_datetime(df['Date'])
        df = df.set_index('Date').sort_index()
        data_storage[DATA_KEY] = df
        
        return UploadResponse(
            filename="dummy_data.csv",
            rows=len(df),
            status="success",
            message=f"Sample data loaded with {len(df)} rows"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/upload_csv")
async def upload_csv(file: UploadFile):
    """Upload and parse CSV file"""
    try:
        content = await file.read()
        csv_data = StringIO(content.decode('utf-8'))
        df = pd.read_csv(csv_data)
        
        required_cols = ['Date', 'Open', 'High', 'Low', 'Close']
        if not all(col in df.columns for col in required_cols):
            raise ValueError(f"CSV must contain: {', '.join(required_cols)}")

        df['Date'] = pd.to_datetime(df['Date'])
        df = df.set_index('Date').sort_index()
        data_storage[DATA_KEY] = df
        
        return UploadResponse(
            filename=file.filename,
            rows=len(df),
            status="success",
            message=f"Uploaded {len(df)} rows successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/run_backtest")
async def run_backtest():
    """Run SMA crossover strategy"""
    if DATA_KEY not in data_storage:
        raise HTTPException(
            status_code=404, 
            detail="No data loaded. Load sample data or upload CSV first."
        )

    df = data_storage[DATA_KEY].copy()
    initial_cash = 10000.0

    df['SMA_Short'] = df['Close'].rolling(window=5).mean()
    df['SMA_Long'] = df['Close'].rolling(window=20).mean()

    df['Signal'] = 0.0
    df.loc[df['SMA_Short'] > df['SMA_Long'], 'Signal'] = 1.0
    df['Position'] = df['Signal'].diff()

    df['Returns'] = df['Close'].pct_change()
    df['Strategy_Returns'] = df['Returns'] * df['Signal'].shift(1)
    df['Equity'] = initial_cash * (1 + df['Strategy_Returns']).cumprod()
    df['Equity'].fillna(initial_cash, inplace=True)

    final_equity = df['Equity'].iloc[-1]
    total_return = ((final_equity / initial_cash) - 1) * 100
    total_trades = int(df['Position'].abs().sum())
    
    daily_returns = df['Strategy_Returns'].dropna()
    sharpe = (daily_returns.mean() / daily_returns.std()) * np.sqrt(252) if daily_returns.std() != 0 else 0
    
    equity_data = df[['Close', 'Equity']].reset_index()
    equity_data['Date'] = equity_data['Date'].dt.strftime('%Y-%m-%d')
    
    equity_points = [
        EquityPoint(
            date=row['Date'],
            price=float(row['Close']),
            equity=float(row['Equity'])
        )
        for _, row in equity_data.iterrows()
    ]
    
    return BacktestResult(
        equity_curve=equity_points,
        metrics=Metrics(
            total_return=round(total_return, 2),
            sharpe_ratio=round(sharpe, 2),
            total_trades=total_trades
        )
    )
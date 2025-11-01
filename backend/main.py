import io
import json
from typing import Annotated, Any, Dict, List

import numpy as np
import pandas as pd
import ast
import operator as _op
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# ----------------------------------------------------------------------
# 1. Pydantic Models for Input and Output
# ----------------------------------------------------------------------

class TradeLog(BaseModel):
    """Defines the structure for individual trade entries."""
    date: str = Field(..., description="Date of the trade")
    type: str = Field(..., description="Trade type: BUY or SELL")
    price: float = Field(..., description="Trade price")
    pnl: float = Field(..., alias="P&L", description="Profit/Loss for the trade (0 for BUY)")
    cumulative_pnl: float = Field(..., alias="Cumulative P&L", description="Cumulative P&L up to this trade")


class EquityPoint(BaseModel):
    """Defines the structure for a single point on the equity curve graph."""
    date: str = Field(..., description="Date of the equity point")
    value: float = Field(..., description="Equity value at this point")


class BacktestResult(BaseModel):
    """Defines the structure for the backtesting output (JSON response)."""
    start_time: str = Field(..., description="Start date of the backtest.")
    end_time: str = Field(..., description="End date of the backtest.")
    equity_final: float = Field(..., description="Final equity value.")
    return_percent: float = Field(..., alias="Return(%)", description="Total percentage return over the period.")
    volatility_percent: float = Field(..., alias="Volatility(%)", description="Annualized volatility of returns.")
    sharpe_ratio: float = Field(..., description="Sharpe Ratio (using risk-free rate of 0).")
    max_trade_duration: str = Field(..., description="Maximum duration of a single trade.")
    avg_trade_duration: str = Field(..., alias="Avg. Trade Duration", description="Average duration of all trades.")
    no_of_trades: int = Field(..., alias="No. of trades", description="Total number of executed trades.")
    win_rate_percent: float = Field(..., alias="Win Rate(%)", description="Percentage of trades that were profitable.")
    strategy: str = Field(..., description="A summary of the strategy used.")
    trade_log: List[TradeLog] = Field(..., description="Detailed log of all trades executed.")
    equity_curve: List[EquityPoint] = Field(..., description="Array of equity curve points for graphing.")


# ----------------------------------------------------------------------
# 2. Backtesting Core Logic (Enhanced to support multiple indicators)
# ----------------------------------------------------------------------

def calculate_rsi(df: pd.DataFrame, window: int = 14) -> pd.Series:
    """Calculates the Relative Strength Index (RSI)."""
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    # Using the formula: RSI = 100 - (100 / (1 + RS))
    return 100 - (100 / (1 + rs))

def calculate_ema(df: pd.DataFrame, window: int) -> pd.Series:
    """Calculates the Exponential Moving Average (EMA)."""
    # Uses Pandas EWM (Exponential Weighted Moving) window for calculation
    return df['Close'].ewm(span=window, adjust=False).mean()

def calculate_macd(df: pd.DataFrame, fast_period: int, slow_period: int, signal_period: int) -> pd.DataFrame:
    """Calculates the Moving Average Convergence Divergence (MACD)."""
    ema_fast = df['Close'].ewm(span=fast_period, adjust=False).mean()
    ema_slow = df['Close'].ewm(span=slow_period, adjust=False).mean()
    
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal_period, adjust=False).mean()
    macd_histogram = macd_line - signal_line
    
    df['MACD'] = macd_line
    df['MACD_Signal'] = signal_line
    df['MACD_Hist'] = macd_histogram
    return df

def execute_strategy(
    df: pd.DataFrame, 
    buy_condition: str, 
    sell_condition: str,
    sma_short_period: int, 
    sma_long_period: int, 
    rsi_window: int, 
    macd_fast_period: int, 
    macd_slow_period: int, 
    macd_signal_period: int
) -> pd.DataFrame:
    """
    Simulates a strategy execution and calculates daily portfolio returns.
    Applies indicators based on provided periods and uses keywords in conditions
    to determine the trade signal logic.
    """
    
    # 1. Calculate Indicators
    df[f'SMA_{sma_short_period}'] = df['Close'].rolling(window=sma_short_period).mean()
    df[f'SMA_{sma_long_period}'] = df['Close'].rolling(window=sma_long_period).mean()
    df['RSI'] = calculate_rsi(df, window=rsi_window) 
    
    # Calculate EMA for the same periods as SMA for flexibility if user requests EMA
    df[f'EMA_{sma_short_period}'] = calculate_ema(df, sma_short_period)
    df[f'EMA_{sma_long_period}'] = calculate_ema(df, sma_long_period)
    
    # Calculate MACD
    df = calculate_macd(df, macd_fast_period, macd_slow_period, macd_signal_period)
    # --- Dynamic Trade Signal Generation ---
    # We'll evaluate the buy/sell condition strings per-row using a safe AST evaluator
    df['Signal'] = np.nan
    strategy_summary = f"Buy:{buy_condition} | Sell:{sell_condition}"

    sma_short = df[f'SMA_{sma_short_period}']
    sma_long = df[f'SMA_{sma_long_period}']

    # Safe AST evaluator helpers
    _ALLOWED_OPS = {
        ast.Add: _op.add,
        ast.Sub: _op.sub,
        ast.Mult: _op.mul,
        ast.Div: _op.truediv,
        ast.Pow: _op.pow,
        ast.BitXor: _op.xor,
        ast.USub: _op.neg,
        ast.Eq: _op.eq,
        ast.NotEq: _op.ne,
        ast.Lt: _op.lt,
        ast.LtE: _op.le,
        ast.Gt: _op.gt,
        ast.GtE: _op.ge,
        ast.And: lambda a, b: a and b,
        ast.Or: lambda a, b: a or b,
        ast.Not: lambda a: (not a),
    }

    def _eval_node(node, names):
        if isinstance(node, ast.Expression):
            return _eval_node(node.body, names)
        if isinstance(node, ast.BoolOp):
            val = _eval_node(node.values[0], names)
            for v in node.values[1:]:
                val = _ALLOWED_OPS[type(node.op)](val, _eval_node(v, names))
            return val
        if isinstance(node, ast.BinOp):
            left = _eval_node(node.left, names)
            right = _eval_node(node.right, names)
            return _ALLOWED_OPS[type(node.op)](left, right)
        if isinstance(node, ast.UnaryOp):
            return _ALLOWED_OPS[type(node.op)](_eval_node(node.operand, names))
        if isinstance(node, ast.Compare):
            left = _eval_node(node.left, names)
            for opn, comp in zip(node.ops, node.comparators):
                right = _eval_node(comp, names)
                if not _ALLOWED_OPS[type(opn)](left, right):
                    return False
                left = right
            return True
        if isinstance(node, ast.Name):
            return names.get(node.id, False)
        if isinstance(node, ast.Num):
            return node.n
        if isinstance(node, ast.Constant):
            return node.value
        raise ValueError(f"Unsupported expression element: {ast.dump(node)}")

    def evaluate_bool_expr(expr: str, names: dict) -> bool:
        try:
            parsed = ast.parse(expr, mode='eval')
            return bool(_eval_node(parsed, names))
        except Exception:
            return False

    def evaluate_condition(cond_str: str, df_local: pd.DataFrame, row_idx: int) -> bool:
        """
        Evaluate a condition string for a specific row index (integer index in df_local).
        Supports tokens like MACD_cross_over and MACD_cross_under plus comparisons between
        MACD, SIGNAL, RSI, CLOSE, and SMA_N columns.
        """
        cond = (cond_str or "").strip()
        if not cond:
            return False

        # Work on a copy of the condition to substitute cross tokens
        work = cond

        # Handle MACD cross tokens by looking at current and previous rows
        try:
            if 'MACD_cross_over' in work:
                if row_idx > 0:
                    cur_macd = df_local.iloc[row_idx]['MACD']
                    cur_sig = df_local.iloc[row_idx]['MACD_Signal']
                    prev_macd = df_local.iloc[row_idx - 1]['MACD']
                    prev_sig = df_local.iloc[row_idx - 1]['MACD_Signal']
                    cross = (cur_macd > cur_sig) and (prev_macd <= prev_sig)
                else:
                    cross = False
                work = work.replace('MACD_cross_over', str(bool(cross)))

            if 'MACD_cross_under' in work:
                if row_idx > 0:
                    cur_macd = df_local.iloc[row_idx]['MACD']
                    cur_sig = df_local.iloc[row_idx]['MACD_Signal']
                    prev_macd = df_local.iloc[row_idx - 1]['MACD']
                    prev_sig = df_local.iloc[row_idx - 1]['MACD_Signal']
                    cross = (cur_macd < cur_sig) and (prev_macd >= prev_sig)
                else:
                    cross = False
                work = work.replace('MACD_cross_under', str(bool(cross)))
        except Exception:
            # If MACD columns are missing or NaN, fail safe
            return False

        # Build names mapping for AST evaluation (uppercase keys expected)
        names = {}
        # Numeric indicator mappings
        try:
            row = df_local.iloc[row_idx]
        except Exception:
            return False

        # Common tokens
        if 'MACD' in df_local.columns:
            names['MACD'] = float(row.get('MACD', 0.0)) if not pd.isna(row.get('MACD', np.nan)) else 0.0
        if 'MACD_Signal' in df_local.columns:
            names['SIGNAL'] = float(row.get('MACD_Signal', 0.0)) if not pd.isna(row.get('MACD_Signal', np.nan)) else 0.0
        if 'RSI' in df_local.columns:
            names['RSI'] = float(row.get('RSI', 0.0)) if not pd.isna(row.get('RSI', np.nan)) else 0.0
        names['CLOSE'] = float(row.get('Close', 0.0)) if not pd.isna(row.get('Close', np.nan)) else 0.0

        # Add any SMA_N or EMA_N columns to names as uppercase (e.g., SMA_10)
        for col in df_local.columns:
            if col.upper().startswith('SMA') or col.upper().startswith('EMA'):
                try:
                    names[col.upper()] = float(row.get(col, 0.0)) if not pd.isna(row.get(col, np.nan)) else 0.0
                except Exception:
                    names[col.upper()] = 0.0

        # Evaluate final boolean expression safely
        return evaluate_bool_expr(work, names)

    # Apply conditions per-row to determine whether to be long (1) or flat (0)
    for i in range(len(df)):
        try:
            buy_hit = evaluate_condition(buy_condition, df, i)
            sell_hit = evaluate_condition(sell_condition, df, i)
        except Exception:
            buy_hit = False
            sell_hit = False

        if buy_hit:
            df.iloc[i, df.columns.get_loc('Signal')] = 1.0
        elif sell_hit:
            df.iloc[i, df.columns.get_loc('Signal')] = 0.0

    # Carry forward last known signal (hold until changed), and default to flat
    df['Signal'] = df['Signal'].ffill().fillna(0.0)

    # --- Portfolio Simulation ---
    df['Daily_Return'] = np.log(df['Close'] / df['Close'].shift(1))
    # We shift the signal by 1 row so signals are acted on the next bar
    df['Strategy_Return'] = df['Daily_Return'] * df['Signal'].shift(1)
    df['Equity_Curve'] = np.exp(df['Strategy_Return'].cumsum())

    # Drop rows with NaN produced by indicator windows
    df.dropna(inplace=True)
    df.attrs['strategy_summary'] = strategy_summary

    return df

def generate_trade_log(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Generates a detailed trade log with BUY/SELL entries, prices, P&L, and cumulative P&L.
    """
    df['Position'] = df['Signal'].apply(lambda x: 1 if x > 0 else 0)
    
    # Identify trade events
    entries = df[df['Position'].diff() == 1].index
    exits = df[df['Position'].diff() == -1].index
    
    trade_log = []
    cumulative_pnl = 0.0
    
    # Adjust if last trade is still open
    if len(entries) > len(exits):
        entries = entries[:-1]
    
    if len(entries) == len(exits) and len(entries) > 0:
        for entry_date, exit_date in zip(entries, exits):
            entry_price = df.loc[entry_date, 'Close']
            exit_price = df.loc[exit_date, 'Close']
            pnl = exit_price - entry_price
            
            # BUY entry
            trade_log.append({
                'date': entry_date.strftime('%Y-%m-%d'),
                'type': 'BUY',
                'price': round(entry_price, 2),
                'P&L': 0.0,
                'Cumulative P&L': round(cumulative_pnl, 2)
            })
            
            # SELL exit
            cumulative_pnl += pnl
            trade_log.append({
                'date': exit_date.strftime('%Y-%m-%d'),
                'type': 'SELL',
                'price': round(exit_price, 2),
                'P&L': round(pnl, 2),
                'Cumulative P&L': round(cumulative_pnl, 2)
            })
    
    return trade_log

def generate_equity_curve(df: pd.DataFrame, initial_capital: float = 100000, max_points: int = 100) -> List[Dict[str, Any]]:
    """
    Generates equity curve points for graphing the strategy performance over time.
    Intelligently samples the data to return a maximum of max_points for efficient plotting.
    """
    total_rows = len(df)
    
    # If data is already small enough, return all points
    if total_rows <= max_points:
        equity_points = []
        for index, row in df.iterrows():
            equity_value = initial_capital * row['Equity_Curve']
            equity_points.append({
                'date': index.strftime('%Y-%m-%d'),
                'value': round(equity_value, 2)
            })
        return equity_points
    
    # Calculate sampling interval to get approximately max_points
    sample_interval = total_rows // max_points
    
    equity_points = []
    df_reset = df.reset_index()
    
    # Sample at regular intervals
    for i in range(0, total_rows, sample_interval):
        row = df_reset.iloc[i]
        equity_value = initial_capital * row['Equity_Curve']
        equity_points.append({
            'date': row['Date'].strftime('%Y-%m-%d'),
            'value': round(equity_value, 2)
        })
    
    # Always include the last point to show final equity
    if equity_points[-1]['date'] != df.index[-1].strftime('%Y-%m-%d'):
        last_row = df.iloc[-1]
        equity_value = initial_capital * last_row['Equity_Curve']
        equity_points.append({
            'date': df.index[-1].strftime('%Y-%m-%d'),
            'value': round(equity_value, 2)
        })
    
    return equity_points

def calculate_metrics(df: pd.DataFrame, initial_capital: float = 100000, max_equity_points: int = 100) -> Dict[str, Any]:
    """
    Calculates the required performance metrics from the strategy returns.
    Includes a check for an empty DataFrame to prevent NaTType errors.
    """

    # CRITICAL CHECK: If the DataFrame is empty after drops, return safe defaults.
    if df.empty:
        return {
            'start_time': 'N/A',
            'end_time': 'N/A',
            'equity_final': initial_capital,
            'Return(%)': 0.0,
            'Volatility(%)': 0.0,
            'sharpe_ratio': 0.0,
            'max_trade_duration': 'N/A',
            'Avg. Trade Duration': 'N/A', 
            'No. of trades': 0, 
            'Win Rate(%)': 0.0, 
            'strategy': 'No Trades Executed - Insufficient Data or Signal',
            'trade_log': [],
            'equity_curve': []
        }


    # 1. Basic Metrics
    start_time = df.index.min().strftime('%Y-%m-%d')
    end_time = df.index.max().strftime('%Y-%m-%d')
    equity_final = initial_capital * df['Equity_Curve'].iloc[-1]
    total_return = (df['Equity_Curve'].iloc[-1] - 1) * 100
    daily_returns = df['Strategy_Return']
    annual_volatility = daily_returns.std() * np.sqrt(252) * 100
    
    # Avoid division by zero if daily_returns.std() is 0 (i.e., flat price data)
    annual_return = np.exp(daily_returns.mean() * 252) - 1
    std_dev_annualized = daily_returns.std() * np.sqrt(252)
    sharpe_ratio = annual_return / std_dev_annualized if std_dev_annualized else 0.0


    # 2. Trade Analysis (Enhanced to calculate P&L, Duration, and Win Rate)
    # Position: 1 for long, 0 for cash/no position
    df['Position'] = df['Signal'].apply(lambda x: 1 if x > 0 else 0)
    
    # Identify trade events (Entry when position goes from 0 to 1, Exit when 1 to 0)
    entries = df[df['Position'].diff() == 1]['Close'].index
    exits = df[df['Position'].diff() == -1]['Close'].index
    
    trades = []
    trade_durations = []
    
    # Adjust exits if the last trade is still open
    if len(entries) > len(exits):
        entries = entries[:-1]
    
    if len(entries) == len(exits) and len(entries) > 0:
        for entry_date, exit_date in zip(entries, exits):
            # Price logic
            entry_price = df.loc[entry_date, 'Close']
            exit_price = df.loc[exit_date, 'Close']
            pnl = exit_price - entry_price
            trades.append(pnl)
            
            # Duration Calculation
            duration = exit_date - entry_date
            trade_durations.append(duration.total_seconds() / (60*60*24)) # Duration in days

    no_of_trades = len(trades)
    winning_trades = sum(1 for pnl in trades if pnl > 0)
    
    win_rate_percent = (winning_trades / no_of_trades) * 100 if no_of_trades > 0 else 0.0

    # 3. Trade Duration Metrics
    if trade_durations:
        max_duration_days = np.max(trade_durations)
        avg_duration_days = np.mean(trade_durations)
        
        # Format duration for output (Days if >= 1, Hours if < 1)
        max_trade_duration = f"{int(max_duration_days)} Days" if max_duration_days >= 1 else f"{round(max_duration_days*24, 2)} Hours"
        avg_trade_duration = f"{int(avg_duration_days)} Days" if avg_duration_days >= 1 else f"{round(avg_duration_days*24, 2)} Hours"
    else:
        max_trade_duration = 'N/A'
        avg_trade_duration = 'N/A'
    
    # Get strategy summary from DataFrame attributes
    strategy_summary = df.attrs.get('strategy_summary', 'Crossover (Default)')

    # 4. Generate Trade Log
    trade_log = generate_trade_log(df)

    # 5. Generate Equity Curve Points
    equity_curve = generate_equity_curve(df, initial_capital, max_equity_points)

    return {
        'start_time': start_time,
        'end_time': end_time,
        'equity_final': round(equity_final, 2),
        'Return(%)': round(total_return, 2),
        'Volatility(%)': round(annual_volatility, 2),
        'sharpe_ratio': round(sharpe_ratio, 3),
        'max_trade_duration': max_trade_duration,
        'Avg. Trade Duration': avg_trade_duration,
        'No. of trades': no_of_trades,
        'Win Rate(%)': round(win_rate_percent, 2),
        'strategy': strategy_summary,
        'trade_log': trade_log,
        'equity_curve': equity_curve
    }

# ----------------------------------------------------------------------
# 3. FastAPI Setup and Endpoint
# ----------------------------------------------------------------------

app = FastAPI(title="Quick Backtesting API")

@app.post("/backtest", response_model=BacktestResult)
async def run_strategy_backtest(
    file: Annotated[UploadFile, File(description="CSV file with Date, Open, High, Low, Close.")],
    buy_condition: Annotated[str, Form(description="e.g., 'SMA_10 > SMA_50' or include MACD/RSI keywords")],
    sell_condition: Annotated[str, Form(description="e.g., 'RSI < 30' or include MACD/RSI keywords")],
    stock_symbol: Annotated[str, Form(description="e.g., AAPL")],
    period_start: Annotated[str, Form(description="e.g., 2020-01-01")],
    period_end: Annotated[str, Form(description="e.g., 2023-12-31")],
    # Indicator period parameters
    sma_short_period: Annotated[int, Form(description="Short MA period (e.g., 10)")] = 10,
    sma_long_period: Annotated[int, Form(description="Long MA period (e.g., 50)")] = 50,
    rsi_window: Annotated[int, Form(description="RSI lookback period (e.g., 14)")] = 14,
    macd_fast_period: Annotated[int, Form(description="MACD fast EMA (e.g., 12)")] = 12,
    macd_slow_period: Annotated[int, Form(description="MACD slow EMA (e.g., 26)")] = 26,
    macd_signal_period: Annotated[int, Form(description="MACD signal line EMA (e.g., 9)")] = 9,
    initial_capital: Annotated[float, Form(description="Initial investment capital (e.g., 100000)")] = 100000,
    max_equity_points: Annotated[int, Form(description="Maximum number of equity curve points to return (e.g., 100)")] = 100,
):
    """
    Receives CSV data and strategy conditions, executes the backtest, and returns
    key performance metrics in JSON format with detailed trade log and equity curve points.
    """
    try:
        # Read the uploaded CSV file content
        contents = await file.read()
        csv_data = io.StringIO(contents.decode('utf-8'))

        # Load data into DataFrame
        df = pd.read_csv(csv_data)
        df['Date'] = pd.to_datetime(df['Date'])
        df.set_index('Date', inplace=True)

        # Apply filtering for time period (if necessary)
        df_filtered = df[(df.index >= period_start) & (df.index <= period_end)].copy()

        if df_filtered.empty:
            raise ValueError("No data found for the specified period.")

        # 1. Execute the strategy (applies indicators and simulates returns)
        df_results = execute_strategy(
            df_filtered, 
            buy_condition, 
            sell_condition,
            sma_short_period, 
            sma_long_period, 
            rsi_window, 
            macd_fast_period, 
            macd_slow_period, 
            macd_signal_period
        )

        # 2. Calculate final metrics (including trade log and equity curve)
        metrics = calculate_metrics(df_results, initial_capital, max_equity_points)

        # 3. Package results for response
        return BacktestResult(**metrics)

    except ValueError as e:
        # Handle data/period errors
        return JSONResponse(
            status_code=400,
            content={"message": f"Data processing error: {e}"}
        )
    except Exception as e:
        # Handle unexpected errors
        print(f"An unexpected error occurred: {e}")
        return JSONResponse(
            status_code=500,
            content={"message": f"Internal server error during backtest: {e}"}
        )

<<<<<<< HEAD
import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Target, Activity, Briefcase } from "lucide-react";
import StockCard from "@/components/StockCard";
import { useTrading } from "@/contexts/TradingContext";

const Portfolio = () => {
  const { trades, portfolioValue } = useTrading();
  const [timeframe, setTimeframe] = useState<"monthly" | "quarterly" | "yearly">("monthly");

  const performanceData = {
    monthly: [
      { date: "Jan", value: 100000 },
      { date: "Feb", value: 105000 },
      { date: "Mar", value: 108000 },
      { date: "Apr", value: 112000 },
      { date: "May", value: 115000 },
      { date: "Jun", value: 118000 },
      { date: "Jul", value: 120000 },
      { date: "Aug", value: 122500 },
    ],
    quarterly: [
      { date: "Q1", value: 108000 },
      { date: "Q2", value: 118000 },
      { date: "Q3", value: 122500 },
    ],
    yearly: [
      { date: "2023", value: 100000 },
      { date: "2024", value: 122500 },
    ],
  };

  const watchlist = [
    { symbol: "AAPL", name: "Apple Inc.", price: 178.42, change: 4.12, changePercent: 2.36 },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 495.22, change: 12.34, changePercent: 2.55 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, change: 5.62, changePercent: 1.51 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: 1.15, changePercent: 0.82 },
  ];

  const portfolioStats = useMemo(() => {
    const initialValue = 100000;
    const currentValue = portfolioValue || 122500;
    const totalReturn = ((currentValue - initialValue) / initialValue) * 100;
    const winningTrades = trades.filter((t) => t.pnl && t.pnl > 0).length;
    const totalTrades = trades.length || 45;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 65.8;

    return {
      portfolioValue: currentValue,
      totalReturn,
      winRate,
      sharpeRatio: 1.85,
      maxDrawdown: 8.5,
    };
  }, [trades, portfolioValue]);

  const stats = [
    { label: "Average Win", value: "+$284.50", icon: TrendingUp, color: "text-success" },
    { label: "Average Loss", value: "-$142.30", icon: TrendingDown, color: "text-destructive" },
    { label: "Profit Factor", value: "2.00", icon: Target, color: "text-primary" },
    { label: "Total Trades", value: "45", icon: Activity, color: "text-accent" },
  ];
=======
import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useBacktest } from "../context/BacktestContext";
import { useTrading } from "../contexts/TradingContext";

const Portfolio: React.FC = () => {
  const { result } = useBacktest();
  const { portfolioValue, trades } = useTrading();

  // Derive performance series from backtest equity_curve if available
  const performanceData = useMemo(() => {
    if (!result || !result.equity_curve) return [];
    return result.equity_curve.map((p) => ({ date: p.date, value: p.value }));
  }, [result]);

  const summary = useMemo(() => {
    if (!result) return null;
    return {
      equity_final: result.equity_final,
      return_pct: result['Return(%)'],
      sharpe: result.sharpe_ratio,
      trades: result['No. of trades'],
      win_rate: result['Win Rate(%)'],
    };
  }, [result]);
>>>>>>> fc6f704 (Modified Trade.tsx)

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
<<<<<<< HEAD
        <div className="card-glass rounded-xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 ring-4 ring-accent/20">
              <AvatarFallback className="bg-accent/20 text-accent text-3xl font-bold">
                <Briefcase className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">Portfolio & Profile</h1>
              <p className="text-muted-foreground mb-3">Active since January 2024</p>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{portfolioStats.winRate.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{portfolioStats.sharpeRatio.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${portfolioStats.totalReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {portfolioStats.totalReturn >= 0 ? '+' : ''}{portfolioStats.totalReturn.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Total Return</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card-glass rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Value</p>
            <p className="text-3xl font-bold font-mono text-success">
              ${portfolioStats.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="card-glass rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Return</p>
            <p className={`text-3xl font-bold font-mono ${portfolioStats.totalReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
              {portfolioStats.totalReturn >= 0 ? '+' : ''}{portfolioStats.totalReturn.toFixed(2)}%
            </p>
          </div>
          <div className="card-glass rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
            <p className="text-3xl font-bold font-mono text-accent">{portfolioStats.winRate.toFixed(1)}%</p>
          </div>
          <div className="card-glass rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Sharpe Ratio</p>
            <p className="text-3xl font-bold font-mono text-accent">{portfolioStats.sharpeRatio.toFixed(2)}</p>
=======
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">Live report from the last backtest</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="card-glass p-4">
            <p className="text-sm text-muted-foreground">Portfolio Value (Global)</p>
            <p className="text-2xl font-bold">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="card-glass p-4">
            <p className="text-sm text-muted-foreground">Final Equity (Backtest)</p>
            <p className="text-2xl font-bold">{summary ? `$${summary.equity_final.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}</p>
          </div>
          <div className="card-glass p-4">
            <p className="text-sm text-muted-foreground">Return</p>
            <p className="text-2xl font-bold">{summary ? `${summary.return_pct.toFixed(2)}%` : '—'}</p>
          </div>
          <div className="card-glass p-4">
            <p className="text-sm text-muted-foreground">Sharpe</p>
            <p className="text-2xl font-bold">{summary ? `${summary.sharpe.toFixed(2)}` : '—'}</p>
          </div>
          <div className="card-glass p-4">
            <p className="text-sm text-muted-foreground">Trades / Win%</p>
            <p className="text-2xl font-bold">{summary ? `${summary.trades} / ${summary.win_rate.toFixed(2)}%` : '—'}</p>
          </div>
          <div className="card-glass p-4">
            <p className="text-sm text-muted-foreground">Total Trades (Global)</p>
            <p className="text-2xl font-bold">{trades.length}</p>
>>>>>>> fc6f704 (Modified Trade.tsx)
          </div>
        </div>

        <div className="card-glass rounded-xl p-6 mb-8">
<<<<<<< HEAD
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Performance Chart</h2>
            <div className="flex gap-2">
              <Button
                variant={timeframe === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={timeframe === "quarterly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("quarterly")}
              >
                Quarterly
              </Button>
              <Button
                variant={timeframe === "yearly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("yearly")}
              >
                Yearly
              </Button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceData[timeframe]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Watchlist</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {watchlist.map((stock) => (
              <StockCard key={stock.symbol} {...stock} />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card-glass rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className={`text-3xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-glass rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Trading Statistics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Average Win</span>
                  <span className="text-sm font-mono text-success">+$284.50</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[70%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Average Loss</span>
                  <span className="text-sm font-mono text-destructive">-$142.30</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-destructive w-[35%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Profit Factor</span>
                  <span className="text-sm font-mono text-accent">2.00</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[65%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="card-glass rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Risk Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Max Drawdown</span>
                <span className="font-mono font-bold text-destructive">-{portfolioStats.maxDrawdown.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Recovery Factor</span>
                <span className="font-mono font-bold text-accent">2.65</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Risk/Reward Ratio</span>
                <span className="font-mono font-bold text-success">1:2.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expectancy</span>
                <span className="font-mono font-bold text-success">$142.20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Calmar Ratio</span>
                <span className="font-mono font-bold text-accent">2.45</span>
              </div>
            </div>
          </div>
=======
          <h2 className="text-2xl font-bold mb-4">Equity Curve</h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip formatter={(value: any) => (typeof value === 'number' ? `$${value.toLocaleString()}` : value)} />
                <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-glass rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Trades</h2>
          {result && result.trade_log && result.trade_log.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-muted-foreground">
                    <th>Date</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>P&L</th>
                    <th>Cum. P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trade_log.map((t, idx) => (
                    <tr key={idx} className="border-t border-dashed">
                      <td className="py-2">{t.date}</td>
                      <td className="py-2">{t.type}</td>
                      <td className="py-2">${t.price.toFixed(2)}</td>
                      <td className="py-2">${t['P&L'].toFixed(2)}</td>
                      <td className="py-2">${t['Cumulative P&L'].toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Run a backtest from the Trade page to populate trades.</p>
          )}
>>>>>>> fc6f704 (Modified Trade.tsx)
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

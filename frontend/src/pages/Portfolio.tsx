import React, { useEffect, useMemo, useState } from 'react';
import { useBacktest } from '../context/BacktestContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

type Holding = {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
};

const COLORS = ['#FDB022', '#667EEA', '#764BA2', '#FF6B6B', '#4BC0C0', '#9966FF'];

const Portfolio: React.FC = () => {
  const { result } = useBacktest();
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    try {
      const saved = localStorage.getItem('portfolioStocks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    localStorage.setItem('portfolioStocks', JSON.stringify(holdings));
  }, [holdings]);

  // When a backtest result arrives, optionally do something: for now we update summary cards
  useEffect(() => {
    if (result) {
      // Optionally auto-add a holding or show a toast — keeping passive: UI reads from `result`
      console.info('Backtest result received in Portfolio page', result);
    }
  }, [result]);

  const totalInvested = useMemo(() => {
    return holdings.reduce((s, h) => s + h.buyPrice * h.quantity, 0);
  }, [holdings]);

  // Current value: if backtest equity curve exists use last equity value; otherwise fallback to invested
  const currentValue = useMemo(() => {
    if (result && result.equity_curve && result.equity_curve.length > 0) {
      return result.equity_curve[result.equity_curve.length - 1].value;
    }
    return totalInvested;
  }, [result, totalInvested]);

  const totalGainLoss = useMemo(() => currentValue - totalInvested, [currentValue, totalInvested]);
  const returnPercent = useMemo(() => (totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0), [totalGainLoss, totalInvested]);

  function handleAddHolding(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!symbol || !name || quantity <= 0) return;
    setHoldings(prev => {
      const idx = prev.findIndex(p => p.symbol === symbol.toUpperCase());
      if (idx >= 0) {
        const copy = [...prev];
        const existing = copy[idx];
        const totalQty = existing.quantity + quantity;
        const newAvg = ((existing.buyPrice * existing.quantity) + (existing.buyPrice * quantity)) / totalQty;
        copy[idx] = { ...existing, quantity: totalQty, buyPrice: newAvg };
        return copy;
      }
      return [{ id: Date.now(), symbol: symbol.toUpperCase(), name, quantity, buyPrice: 0 }, ...prev];
    });
    setSymbol('');
    setName('');
    setQuantity(1);
  }

  function removeHolding(id: number) {
    if (!confirm('Remove holding?')) return;
    setHoldings(prev => prev.filter(h => h.id !== id));
  }

  // Prepare equity data for line chart
  const equityData = useMemo(() => {
    if (!result || !result.equity_curve) return [];
    return result.equity_curve.map(pt => ({ name: pt.date, value: pt.value }));
  }, [result]);

  const allocation = useMemo(() => {
    if (holdings.length === 0) return [];
    const total = holdings.reduce((s, h) => s + h.buyPrice * h.quantity, 0) || 1;
    return holdings.map((h, i) => ({ name: h.symbol, value: h.buyPrice * h.quantity, color: COLORS[i % COLORS.length] }));
  }, [holdings]);

  return (
    <div className="container mx-auto p-6 text-white">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">📈 My Portfolio</h1>
        <p className="text-sm opacity-90">Track your investments and performance</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm">Total Invested</h3>
          <p className="text-xl font-bold">${totalInvested.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm">Current Value</h3>
          <p className="text-xl font-bold">${currentValue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm">Total Gain/Loss</h3>
          <p className={`text-xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>${totalGainLoss.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm">Return %</h3>
          <p className={`text-xl font-bold ${returnPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>{returnPercent.toFixed(2)}%</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-lg mb-4">Add Stock to Portfolio</h2>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={handleAddHolding}>
          <input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="Symbol (e.g. AAPL)" className="p-2 rounded bg-gray-900" />
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Company Name" className="p-2 rounded bg-gray-900" />
          <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min={1} className="p-2 rounded bg-gray-900" />
          <div>
            <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold">Add Stock</button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 min-h-[300px]">
          <h3 className="mb-3">Portfolio Value Over Time</h3>
          {equityData.length === 0 ? (
            <div className="text-yellow-300">No backtest equity data available. Run a backtest to see equity curve.</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={equityData}>
                <XAxis dataKey="name" tick={{ fill: '#ddd' }} />
                <YAxis tick={{ fill: '#ddd' }} />
                <Tooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} />
                <Line type="monotone" dataKey="value" stroke="#FDB022" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-4 min-h-[300px]">
          <h3 className="mb-3">Asset Allocation</h3>
          {allocation.length === 0 ? (
            <div className="text-yellow-300">No holdings yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={allocation} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {allocation.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="mb-4">Your Holdings</h2>
        {holdings.length === 0 ? (
          <div className="text-gray-300">No stocks added yet. Add your first stock above!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-200">
                  <th>Symbol</th>
                  <th>Company</th>
                  <th>Quantity</th>
                  <th>Buy Price</th>
                  <th>Total Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map(h => (
                  <tr key={h.id} className="border-t border-gray-700">
                    <td className="py-3">{h.symbol}</td>
                    <td>{h.name}</td>
                    <td>{h.quantity}</td>
                    <td>${h.buyPrice.toFixed(2)}</td>
                    <td>${(h.buyPrice * h.quantity).toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeHolding(h.id)} className="bg-red-500 px-3 py-1 rounded text-white">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-400">
        <div>Backtest summary (if available):</div>
        {result ? (
          <div className="mt-2">
            <div>Strategy: {result.strategy}</div>
            <div>Period: {result.start_time} — {result.end_time}</div>
            <div>Final Equity: ${result.equity_final}</div>
            <div>Return: {result['Return(%)']}%</div>
            <div>Sharpe: {result.sharpe_ratio}</div>
            <div>Trades: {result['No. of trades']}</div>
          </div>
        ) : (
          <div className="mt-2">No backtest run yet.</div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";
import CandlestickChart from "../components/CandlestickChart";
// using native controls to avoid missing ui component dependencies
import { Upload, Database, Play } from "lucide-react";
import { CandlestickData, loadSampleData, parseCSV } from "../components/ui/csvParser";
import { useBacktest } from '../context/BacktestContext';

const Trade = () => {
  const [data, setData] = useState<CandlestickData[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [strategy, setStrategy] = useState("sma_crossover");
  const [isLoading, setIsLoading] = useState(false);
  // lightweight toast fallback (replaceable by your app-wide toast)
  const toast = ({ title, description, variant }: { title: string; description?: string; variant?: string }) => {
    if (variant === 'destructive') {
      alert(`${title}\n${description || ''}`);
    } else {
      console.log(title, description || '');
    }
  };
  const { result, setResult } = useBacktest();

  // Indicator parameters
  const [smaShort, setSmaShort] = useState<number>(5);
  const [smaLong, setSmaLong] = useState<number>(20);
  const [macdFast, setMacdFast] = useState<number>(12);
  const [macdSlow, setMacdSlow] = useState<number>(26);
  const [macdSignal, setMacdSignal] = useState<number>(9);
  const [rsiWindow, setRsiWindow] = useState<number>(14);

  const [augData, setAugData] = useState<any[]>([]);

  // Indicator calculation helpers
  const calcSMA = (vals: number[], window: number) => {
    const out: (number | null)[] = [];
    for (let i = 0; i < vals.length; i++) {
      if (i + 1 < window) {
        out.push(null);
        continue;
      }
      let sum = 0;
      for (let j = i + 1 - window; j <= i; j++) sum += vals[j];
      out.push(sum / window);
    }
    return out;
  };

  const calcEMA = (vals: number[], window: number) => {
    const out: (number | null)[] = [];
    const alpha = 2 / (window + 1);
    let prev: number | null = null;
    for (let i = 0; i < vals.length; i++) {
      const v = vals[i];
      if (prev === null) {
        prev = v; // seed with first value
        out.push(prev);
        continue;
      }
      prev = alpha * v + (1 - alpha) * prev;
      out.push(prev);
    }
    return out;
  };

  const calcMACD = (vals: number[], fast: number, slow: number, signal: number) => {
    const emaFast = calcEMA(vals, fast).map(v => v === null ? 0 : v);
    const emaSlow = calcEMA(vals, slow).map(v => v === null ? 0 : v);
    const macd = vals.map((v, i) => (emaFast[i] || 0) - (emaSlow[i] || 0));
    const signalLine = calcEMA(macd, signal).map(v => v === null ? 0 : v);
    return { macd, signalLine };
  };

  const calcRSI = (vals: number[], window: number) => {
    const out: (number | null)[] = [];
    const gains: number[] = [];
    const losses: number[] = [];
    for (let i = 0; i < vals.length; i++) {
      if (i === 0) {
        out.push(null);
        continue;
      }
      const change = vals[i] - vals[i - 1];
      gains.push(Math.max(0, change));
      losses.push(Math.max(0, -change));
      if (gains.length < window) {
        out.push(null);
        continue;
      }
      // simple average
      const avgGain = gains.slice(-window).reduce((s, n) => s + n, 0) / window;
      const avgLoss = losses.slice(-window).reduce((s, n) => s + n, 0) / window;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      out.push(100 - 100 / (1 + rs));
    }
    return out;
  };

  // Recompute augmented data when raw data or indicator params change
  useEffect(() => {
    if (!data || data.length === 0) {
      setAugData([]);
      return;
    }
    const closes = data.map(d => d.close);
    const smaShortArr = calcSMA(closes, smaShort);
    const smaLongArr = calcSMA(closes, smaLong);
    const { macd, signalLine } = calcMACD(closes, macdFast, macdSlow, macdSignal);
    const rsiArr = calcRSI(closes, rsiWindow);

    const out = data.map((d, i) => ({
      ...d,
      ['SMA_' + smaShort]: smaShortArr[i] ?? null,
      ['SMA_' + smaLong]: smaLongArr[i] ?? null,
      MACD: macd[i] ?? null,
      MACD_Signal: signalLine[i] ?? null,
      RSI: rsiArr[i] ?? null,
    }));

    setAugData(out);
  }, [data, smaShort, smaLong, macdFast, macdSlow, macdSignal, rsiWindow]);

  // markers derived from backtest result
  const markers = (result && result.trade_log) ? result.trade_log.map((t: any) => ({ date: t.date, type: t.type, price: t.price })) : [];


  const handleLoadSampleData = async () => {
    setIsLoading(true);
    try {
      const sampleData = await loadSampleData();
      setData(sampleData);
      // try to fetch raw CSV for posting to backend
      try {
        const r = await fetch('/dummydata.csv');
        if (r.ok) {
          const csvText = await r.text();
          const f = new File([csvText], 'sample.csv', { type: 'text/csv' });
          setUploadedFile(f);
        } else {
          setUploadedFile(null);
        }
      } catch (e) {
        setUploadedFile(null);
      }
      toast({
        title: "Sample data loaded",
        description: `Loaded ${sampleData.length} days of market data`,
      });
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Failed to load sample data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
  const parsedData = parseCSV(text);
  setData(parsedData);
  setUploadedFile(file);
        toast({
          title: "Data uploaded",
          description: `Loaded ${parsedData.length} days of market data`,
        });
      } catch (error) {
        toast({
          title: "Error parsing CSV",
          description: "Please check your file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleRunBacktest = async () => {
    if (data.length === 0) {
      toast({
        title: "No data loaded",
        description: "Please load data before running backtest",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    toast({ title: 'Backtest running', description: `Processing ${data.length} days with ${strategy} strategy` });

    try {
      const form = new FormData();

      // prepare file: either uploadedFile or build from parsed data
      let fileToSend: File | null = uploadedFile;
      if (!fileToSend) {
        // build CSV from data
        const headers = ['Date','Open','High','Low','Close','Volume'];
        const csvRows = [headers.join(',')];
        for (const row of data) {
          const line = [row.date, row.open, row.high, row.low, row.close, row.volume].join(',');
          csvRows.push(line);
        }
        const csvText = csvRows.join('\n');
        fileToSend = new File([csvText], 'generated.csv', { type: 'text/csv' });
      }

      form.append('file', fileToSend as Blob);

      // derive period start/end from data dates
      const parseDate = (s: string) => {
        const d = new Date(s);
        if (isNaN(d.getTime())) return null;
        return d.toISOString().slice(0,10);
      };
  const start = parseDate(data[0].date);
  const end = parseDate(data[data.length - 1].date);
  if (start) form.append('period_start', start);
  if (end) form.append('period_end', end);

      // map strategy to conditions and params
      let buy_condition = '';
      let sell_condition = '';
      // defaults
      form.append('stock_symbol', 'UPLOAD');
      form.append('initial_capital', '100000');
      form.append('max_equity_points', '200');

      if (strategy === 'sma_crossover') {
        buy_condition = 'SMA_5 > SMA_20';
        sell_condition = 'SMA_5 < SMA_20';
        form.append('sma_short_period', '5');
        form.append('sma_long_period', '20');
      } else if (strategy === 'rsi') {
        buy_condition = 'RSI < 30';
        sell_condition = 'RSI > 70';
        form.append('rsi_window', '14');
      } else if (strategy === 'macd') {
        buy_condition = 'MACD_cross_over';
        sell_condition = 'MACD_cross_under';
        form.append('macd_fast_period', '12');
        form.append('macd_slow_period', '26');
        form.append('macd_signal_period', '9');
      } else {
        buy_condition = 'SMA_5 > SMA_20';
        sell_condition = 'SMA_5 < SMA_20';
        form.append('sma_short_period', '5');
        form.append('sma_long_period', '20');
      }

      form.append('buy_condition', buy_condition);
      form.append('sell_condition', sell_condition);

      // send to backend (absolute address to backend dev server)
      const resp = await fetch('http://localhost:8000/backtest', {
        method: 'POST',
        body: form,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ message: resp.statusText }));
        toast({ title: 'Backtest failed', description: err.message || 'Server error', variant: 'destructive' });
        setIsLoading(false);
        return;
      }

      const json = await resp.json();
      // set into shared Backtest context so Portfolio and any other listeners update
      setResult(json);
      toast({ title: 'Backtest complete', description: 'Results available in Portfolio' });
    } catch (e: any) {
      toast({ title: 'Backtest error', description: e?.message || String(e), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Strategy Backtester</h1>
          <p className="text-muted-foreground">Test your trading strategies with historical data</p>
        </div>

        <GlassCard className="mb-8">
          <h2 className="text-2xl font-bold mb-6">1. Choose Data Source</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <label className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-primary/5">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-lg mb-2">Upload Your Data</h3>
              <p className="text-sm text-muted-foreground mb-4">CSV format required</p>
              <p className="text-xs text-muted-foreground/60">Format: Date, Open, High, Low, Close, Volume</p>
            </label>
            
            <div 
              onClick={handleLoadSampleData}
              className="border-2 border-dashed border-border hover:border-secondary/50 rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-secondary/5"
            >
              <Database className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="font-bold text-lg mb-2">Use Sample Data</h3>
              <p className="text-sm text-muted-foreground mb-4">Pre-loaded demo data</p>
              <p className="text-xs text-muted-foreground/60">21 days of simulated market data</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Price Chart</h2>
          <CandlestickChart data={augData.length ? augData : data} indicatorKeys={[`SMA_${smaShort}`, `SMA_${smaLong}`, 'MACD', 'MACD_Signal']} markers={markers} />
        </GlassCard>

        <GlassCard className="mb-8">
          <h2 className="text-2xl font-bold mb-6">2. Choose Strategy</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Trading Strategy</label>
              <select value={strategy} onChange={e => setStrategy(e.target.value)} className="w-full p-2 rounded bg-gray-900">
                <option value="sma_crossover">SMA Crossover (5/20)</option>
                <option value="rsi">RSI Strategy</option>
                <option value="macd">MACD Strategy</option>
                <option value="bollinger">Bollinger Bands</option>
              </select>
              <p className="text-xs text-muted-foreground mt-2">
                {strategy === "sma_crossover" && "Buy when SMA(5) crosses above SMA(20), sell when it crosses below"}
                {strategy === "rsi" && "Buy when RSI < 30 (oversold), sell when RSI > 70 (overbought)"}
                {strategy === "macd" && "Buy/sell based on MACD line crossing signal line"}
                {strategy === "bollinger" && "Buy at lower band, sell at upper band"}
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs mb-1">SMA Short</label>
                  <input type="number" value={smaShort} onChange={e => setSmaShort(Number(e.target.value))} className="p-2 rounded bg-gray-900 w-full" />
                </div>
                <div>
                  <label className="block text-xs mb-1">SMA Long</label>
                  <input type="number" value={smaLong} onChange={e => setSmaLong(Number(e.target.value))} className="p-2 rounded bg-gray-900 w-full" />
                </div>
                <div>
                  <label className="block text-xs mb-1">RSI Window</label>
                  <input type="number" value={rsiWindow} onChange={e => setRsiWindow(Number(e.target.value))} className="p-2 rounded bg-gray-900 w-full" />
                </div>
                <div>
                  <label className="block text-xs mb-1">MACD Fast</label>
                  <input type="number" value={macdFast} onChange={e => setMacdFast(Number(e.target.value))} className="p-2 rounded bg-gray-900 w-full" />
                </div>
                <div>
                  <label className="block text-xs mb-1">MACD Slow</label>
                  <input type="number" value={macdSlow} onChange={e => setMacdSlow(Number(e.target.value))} className="p-2 rounded bg-gray-900 w-full" />
                </div>
                <div>
                  <label className="block text-xs mb-1">MACD Signal</label>
                  <input type="number" value={macdSignal} onChange={e => setMacdSignal(Number(e.target.value))} className="p-2 rounded bg-gray-900 w-full" />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-8">
          <h2 className="text-2xl font-bold mb-6">3. Set Risk Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Initial Capital ($)</label>
              <input type="number" defaultValue={100000} className="p-2 rounded bg-gray-900 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position Size (%)</label>
              <input type="number" defaultValue={10} className="p-2 rounded bg-gray-900 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stop Loss (%)</label>
              <input type="number" defaultValue={5} className="p-2 rounded bg-gray-900 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Take Profit (%)</label>
              <input type="number" defaultValue={15} className="p-2 rounded bg-gray-900 w-full" />
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-center">
          <button
            className="bg-yellow-400 text-black px-6 py-3 rounded font-semibold flex items-center gap-2"
            onClick={handleRunBacktest}
            disabled={isLoading}
          >
            <Play className="w-5 h-5" />
            {isLoading ? 'Loading...' : 'Run Backtest'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Trade;

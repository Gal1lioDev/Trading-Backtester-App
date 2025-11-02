import { useState, useRef } from "react";
import { Upload, Play, Trash2, Plus, Database } from "lucide-react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
>>>>>>> fc6f704 (Modified Trade.tsx)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useTrading, Trade as TradeType } from "@/contexts/TradingContext";
<<<<<<< HEAD
=======
import { useBacktest } from "../context/BacktestContext";
>>>>>>> fc6f704 (Modified Trade.tsx)

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StrategyRule {
  id: number;
  name: string;
  indicator1: string;
  condition: string;
  indicator2: string;
  action: "BUY" | "SELL";
}

const Trade = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
  const { addTrades, setPortfolioValue } = useTrading();
  const [dataSource, setDataSource] = useState<"none" | "upload" | "sample">("none");
=======
  const { addTrades, setPortfolioValue, portfolioValue } = useTrading();
  const { result, setResult } = useBacktest();
  const [dataSource, setDataSource] = useState<"none" | "upload" | "sample2">("none");
>>>>>>> fc6f704 (Modified Trade.tsx)
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([]);
  const [fileName, setFileName] = useState("");
  const [backtestRun, setBacktestRun] = useState(false);
  const [strategySymbol, setStrategySymbol] = useState("AAPL");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [indicators, setIndicators] = useState({
    sma: true,
    ema: false,
    rsi: false,
    macd: false,
    bollingerBands: true,
  });
  const [rules, setRules] = useState<StrategyRule[]>([
<<<<<<< HEAD
    { id: 1, name: "Buy Signal", indicator1: "SMA(5)", condition: "crosses-above", indicator2: "SMA(20)", action: "BUY" },
    { id: 2, name: "Sell Signal", indicator1: "SMA(5)", condition: "crosses-below", indicator2: "SMA(20)", action: "SELL" },
  ]);
  const [nextRuleId, setNextRuleId] = useState(3);

  const sampleData: CandlestickData[] = [
    { date: "2023-01-01", open: 100.00, high: 101.00, low: 99.50, close: 100.50, volume: 1200000 },
    { date: "2023-01-02", open: 100.50, high: 101.50, low: 100.00, close: 101.20, volume: 1350000 },
    { date: "2023-01-03", open: 101.20, high: 102.00, low: 101.00, close: 101.80, volume: 1100000 },
    { date: "2023-01-04", open: 101.80, high: 103.00, low: 101.50, close: 102.50, volume: 1250000 },
    { date: "2023-01-05", open: 102.50, high: 103.50, low: 102.00, close: 103.00, volume: 1400000 },
    { date: "2023-01-06", open: 103.00, high: 104.00, low: 102.50, close: 103.50, volume: 1500000 },
    { date: "2023-01-09", open: 103.50, high: 104.50, low: 103.00, close: 104.20, volume: 1300000 },
    { date: "2023-01-10", open: 104.20, high: 105.00, low: 104.00, close: 104.80, volume: 1200000 },
    { date: "2023-01-11", open: 104.80, high: 105.50, low: 104.50, close: 105.10, volume: 1350000 },
    { date: "2023-01-12", open: 105.10, high: 106.00, low: 105.00, close: 105.50, volume: 1600000 },
    { date: "2023-01-13", open: 105.50, high: 106.50, low: 105.50, close: 106.00, volume: 1200000 },
    { date: "2023-01-16", open: 106.00, high: 107.00, low: 106.00, close: 106.50, volume: 1350000 },
    { date: "2023-01-17", open: 106.50, high: 107.50, low: 106.50, close: 107.20, volume: 1100000 },
    { date: "2023-01-18", open: 107.20, high: 108.00, low: 107.00, close: 107.80, volume: 1250000 },
    { date: "2023-01-19", open: 107.80, high: 108.50, low: 107.50, close: 108.30, volume: 1400000 },
    { date: "2023-01-20", open: 108.30, high: 109.00, low: 108.00, close: 108.80, volume: 1500000 },
    { date: "2023-01-23", open: 108.80, high: 109.50, low: 108.50, close: 109.20, volume: 1300000 },
    { date: "2023-01-24", open: 109.20, high: 110.00, low: 109.00, close: 109.80, volume: 1200000 },
    { date: "2023-01-25", open: 109.80, high: 110.50, low: 109.50, close: 110.30, volume: 1350000 },
    { date: "2023-01-26", open: 110.30, high: 111.00, low: 110.00, close: 110.80, volume: 1600000 },
    { date: "2023-01-27", open: 110.80, high: 111.50, low: 110.50, close: 111.20, volume: 1400000 },
  ];

  const equityData = [
    { date: "2020-01", equity: 10000, price: 95 },
    { date: "2020-04", equity: 12000, price: 98 },
    { date: "2020-07", equity: 11500, price: 102 },
    { date: "2020-10", equity: 14000, price: 108 },
    { date: "2021-01", equity: 15500, price: 115 },
    { date: "2021-04", equity: 18000, price: 120 },
    { date: "2021-07", equity: 20000, price: 125 },
    { date: "2023-12", equity: 22500, price: 130 },
  ];

  const trades = [
    { date: "2023-01-15", type: "BUY" as const, price: "105.50", pnl: "-", cumulative: "-", color: "text-muted-foreground" },
    { date: "2023-02-01", type: "SELL" as const, price: "110.25", pnl: "+4.75", cumulative: "+4.75", color: "text-success" },
    { date: "2023-02-15", type: "BUY" as const, price: "108.00", pnl: "-", cumulative: "+4.75", color: "text-muted-foreground" },
    { date: "2023-03-01", type: "SELL" as const, price: "113.50", pnl: "+5.50", cumulative: "+10.25", color: "text-success" },
    { date: "2023-03-20", type: "BUY" as const, price: "115.00", pnl: "-", cumulative: "+10.25", color: "text-muted-foreground" },
    { date: "2023-04-10", type: "SELL" as const, price: "112.00", pnl: "-3.00", cumulative: "+7.25", color: "text-destructive" },
  ];
=======
    { id: 1, name: "Buy Signal", indicator1: "SMA(3)", condition: "crosses-above", indicator2: "SMA(7)", action: "BUY" },
    { id: 2, name: "Sell Signal", indicator1: "SMA(3)", condition: "crosses-below", indicator2: "SMA(7)", action: "SELL" },
  ]);
  const [nextRuleId, setNextRuleId] = useState(3);
  const [smaShortPeriod, setSmaShortPeriod] = useState(3);
  const [smaLongPeriod, setSmaLongPeriod] = useState(7);
  const [rsiWindow, setRsiWindow] = useState(14);
  const [macdFastPeriod, setMacdFastPeriod] = useState(12);
  const [macdSlowPeriod, setMacdSlowPeriod] = useState(26);
  const [macdSignalPeriod, setMacdSignalPeriod] = useState(9);

  const sampleData2: CandlestickData[] = [
    { date: "2023-02-01", open: 150.00, high: 151.00, low: 149.00, close: 150.50, volume: 2000000 },
    { date: "2023-02-02", open: 150.50, high: 151.50, low: 149.50, close: 151.00, volume: 2100000 },
    { date: "2023-02-03", open: 151.00, high: 152.00, low: 150.00, close: 151.50, volume: 1900000 },
    { date: "2023-02-06", open: 151.50, high: 152.50, low: 150.50, close: 152.00, volume: 2200000 },
    { date: "2023-02-07", open: 152.00, high: 153.00, low: 151.00, close: 152.50, volume: 1800000 },
    { date: "2023-02-08", open: 152.50, high: 153.50, low: 151.50, close: 153.00, volume: 2000000 },
    { date: "2023-02-09", open: 153.00, high: 154.00, low: 152.00, close: 153.50, volume: 1950000 },
    { date: "2023-02-10", open: 153.50, high: 154.50, low: 152.50, close: 154.00, volume: 2100000 },
    { date: "2023-02-13", open: 154.00, high: 155.00, low: 153.00, close: 154.50, volume: 2050000 },
    { date: "2023-02-14", open: 154.50, high: 155.50, low: 153.50, close: 155.00, volume: 1900000 },
    { date: "2023-02-15", open: 155.00, high: 156.50, low: 154.50, close: 156.00, volume: 2200000 },
    { date: "2023-02-16", open: 156.00, high: 157.50, low: 155.50, close: 157.00, volume: 2150000 },
    { date: "2023-02-17", open: 157.00, high: 158.00, low: 156.50, close: 157.50, volume: 2000000 },
    { date: "2023-02-20", open: 157.50, high: 158.50, low: 157.00, close: 158.00, volume: 2250000 },
    { date: "2023-02-21", open: 158.00, high: 159.00, low: 157.50, close: 158.50, volume: 2100000 },
    { date: "2023-02-22", open: 158.50, high: 159.00, low: 156.50, close: 157.00, volume: 2300000 },
    { date: "2023-02-23", open: 157.00, high: 157.50, low: 155.50, close: 156.00, volume: 2150000 },
    { date: "2023-02-24", open: 156.00, high: 156.50, low: 154.50, close: 155.00, volume: 2200000 },
    { date: "2023-02-27", open: 155.00, high: 155.50, low: 153.50, close: 154.00, volume: 2350000 },
    { date: "2023-02-28", open: 154.00, high: 154.50, low: 152.50, close: 153.00, volume: 2400000 },
    { date: "2023-03-01", open: 153.00, high: 154.00, low: 152.50, close: 153.50, volume: 2250000 },
    { date: "2023-03-02", open: 153.50, high: 154.50, low: 153.00, close: 154.00, volume: 2300000 },
    { date: "2023-03-03", open: 154.00, high: 155.00, low: 153.50, close: 154.50, volume: 2350000 },
    { date: "2023-03-06", open: 154.50, high: 155.50, low: 154.00, close: 155.00, volume: 2400000 },
    { date: "2023-03-07", open: 155.00, high: 156.00, low: 154.50, close: 155.50, volume: 2450000 },
    { date: "2023-03-08", open: 155.50, high: 156.50, low: 155.00, close: 156.00, volume: 2500000 },
    { date: "2023-03-09", open: 156.00, high: 157.00, low: 155.50, close: 156.50, volume: 2550000 },
    { date: "2023-03-10", open: 156.50, high: 157.50, low: 156.00, close: 157.00, volume: 2600000 },
    { date: "2023-03-13", open: 157.00, high: 158.00, low: 156.50, close: 157.50, volume: 2650000 },
    { date: "2023-03-14", open: 157.50, high: 158.50, low: 157.00, close: 158.00, volume: 2700000 },
    { date: "2023-03-15", open: 158.00, high: 159.00, low: 157.50, close: 158.50, volume: 2750000 },
    { date: "2023-03-16", open: 158.50, high: 159.50, low: 158.00, close: 159.00, volume: 2800000 },
    { date: "2023-03-17", open: 159.00, high: 160.00, low: 158.50, close: 159.50, volume: 2850000 },
    { date: "2023-03-20", open: 159.50, high: 160.50, low: 159.00, close: 160.00, volume: 2900000 },
    { date: "2023-03-21", open: 160.00, high: 161.00, low: 159.50, close: 160.50, volume: 2950000 },
    { date: "2023-03-22", open: 160.50, high: 161.50, low: 160.00, close: 161.00, volume: 3000000 },
    { date: "2023-03-23", open: 161.00, high: 162.00, low: 160.50, close: 161.50, volume: 3050000 },
    { date: "2023-03-24", open: 161.50, high: 162.50, low: 161.00, close: 162.00, volume: 3100000 },
  ];

>>>>>>> fc6f704 (Modified Trade.tsx)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const data: CandlestickData[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(",");
          if (values.length >= 6) {
            data.push({
              date: values[0],
              open: parseFloat(values[1]),
              high: parseFloat(values[2]),
              low: parseFloat(values[3]),
              close: parseFloat(values[4]),
              volume: parseInt(values[5]),
            });
          }
        }

        setCandlestickData(data);
        setFileName(file.name);
        setDataSource("upload");
<<<<<<< HEAD
=======
        setResult(null);
        setBacktestRun(false);
>>>>>>> fc6f704 (Modified Trade.tsx)
        toast.success(`Successfully loaded ${data.length} data points from ${file.name}`);
      } catch (error) {
        toast.error("Error parsing CSV file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

<<<<<<< HEAD
  const handleUseSampleData = () => {
    setCandlestickData(sampleData);
    setDataSource("sample");
    toast.success(`Sample data loaded: ${sampleData.length} data points`);
=======
  const handleUseSampleData2 = () => {
    setCandlestickData(sampleData2);
    setDataSource("sample2");
    setStrategySymbol("MSFT");
    setRules([
      { id: 1, name: "Buy Signal", indicator1: "RSI(14)", condition: "crosses-above", indicator2: "SMA(5)", action: "BUY" },
      { id: 2, name: "Sell Signal", indicator1: "RSI(14)", condition: "crosses-below", indicator2: "SMA(5)", action: "SELL" },
    ]);
    setIndicators({
      sma: true,
      ema: false,
      rsi: true,
      macd: true,
      bollingerBands: false,
    });
    setSmaShortPeriod(5);
    setSmaLongPeriod(15);
    setRsiWindow(14);
    setMacdFastPeriod(12);
    setMacdSlowPeriod(26);
    setMacdSignalPeriod(9);
    setResult(null);
    setBacktestRun(false);
    toast.success(`Sample Data 2 loaded: ${sampleData2.length} data points (RSI + SMA(5/15) Strategy)`);
>>>>>>> fc6f704 (Modified Trade.tsx)
  };

  const handleAddRule = () => {
    const newRule: StrategyRule = {
      id: nextRuleId,
      name: `Rule ${nextRuleId}`,
      indicator1: "SMA(5)",
      condition: "crosses-above",
      indicator2: "SMA(20)",
      action: "BUY",
    };
    setRules([...rules, newRule]);
    setNextRuleId(nextRuleId + 1);
    toast.success("New rule added");
  };

  const handleDeleteRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast.success("Rule deleted");
  };

<<<<<<< HEAD
  const handleRunBacktest = () => {
=======
  const handleRunBacktest = async () => {
>>>>>>> fc6f704 (Modified Trade.tsx)
    if (dataSource === "none") {
      toast.error("Please select a data source first");
      return;
    }
<<<<<<< HEAD
    setIsLoading(true);
    toast({ title: 'Backtest running', description: `Processing ${data.length} days with ${strategy} strategy` });

    setBacktestRun(true);
    toast.success("Backtest completed successfully!");

    const simulatedTrades: TradeType[] = trades.map((trade) => ({
      date: trade.date,
      type: trade.type,
      symbol: strategySymbol,
      price: parseFloat(trade.price),
      shares: 100,
      pnl: trade.pnl !== "-" ? parseFloat(trade.pnl.replace("+", "")) : undefined,
      cumulativePnl: trade.cumulative !== "-" ? parseFloat(trade.cumulative.replace("+", "")) : undefined,
    }));

    addTrades(simulatedTrades);
    setPortfolioValue(122500);

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
=======

    toast(`Backtest running — Processing ${candlestickData.length} rows for ${strategySymbol}`);

    try {
      const form = new FormData();

      const uploadedFile = fileInputRef.current?.files?.[0];
      if (dataSource === 'upload' && uploadedFile) {
        form.append('file', uploadedFile, uploadedFile.name);
      } else {
        const header = 'Date,Open,High,Low,Close,Volume\n';
        const rows = candlestickData.map(d => `${d.date},${d.open},${d.high},${d.low},${d.close},${d.volume}`).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        form.append('file', blob, `${strategySymbol || 'sample'}.csv`);
      }

      let buyCondition = "";
      let sellCondition = "";
      
      if (indicators.rsi && indicators.sma) {
        buyCondition = "SMA RSI";
        sellCondition = "SMA RSI";
      } else if (indicators.macd) {
        buyCondition = "MACD";
        sellCondition = "MACD";
      } else {
        buyCondition = "SMA";
        sellCondition = "SMA";
      }
      form.append('sma_short_period', smaShortPeriod.toString());
      form.append('sma_long_period', smaLongPeriod.toString());
      form.append('rsi_window', rsiWindow.toString());
      form.append('macd_fast_period', macdFastPeriod.toString());
      form.append('macd_slow_period', macdSlowPeriod.toString());
      form.append('macd_signal_period', macdSignalPeriod.toString());
      
      const strategyPayload = {
        symbol: strategySymbol,
        rules,
        indicators,
        buy_condition: buyCondition,
        sell_condition: sellCondition,
        sma_short_period: smaShortPeriod,
        sma_long_period: smaLongPeriod,
        rsi_window: rsiWindow,
        macd_fast_period: macdFastPeriod,
        macd_slow_period: macdSlowPeriod,
        macd_signal_period: macdSignalPeriod,
      };
      form.append('strategy', JSON.stringify(strategyPayload));
      form.append('buy_condition', strategyPayload.buy_condition);
      form.append('sell_condition', strategyPayload.sell_condition);
      form.append('stock_symbol', strategySymbol);

      const resp = await fetch('http://localhost:8000/backtest', {
        method: 'POST',
        body: form,
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Backtest failed: ${resp.status} ${text}`);
      }

      const json = await resp.json();
      
      console.log('Backtest response:', json);
      console.log('Trade log length:', json.trade_log?.length || 0);
      console.log('Equity curve length:', json.equity_curve?.length || 0);

      setResult(json as any);
      setBacktestRun(true);
      toast.success(`Backtest completed: ${json['No. of trades'] || 0} trades, ${json.equity_curve?.length || 0} equity points`);

      if (Array.isArray((json as any).trade_log) && (json as any).trade_log.length > 0) {
        const mapped: TradeType[] = (json as any).trade_log.map((t: any) => ({
          date: t.date,
          type: (t.type ?? t.side ?? 'BUY').toUpperCase() as "BUY" | "SELL",
          symbol: strategySymbol,
          price: Number(t.price ?? t.fill_price ?? t['Price'] ?? 0),
          shares: Number(t.shares ?? 100),
          pnl: typeof t['P&L'] === 'number' ? t['P&L'] : (typeof t.pnl === 'number' ? t.pnl : undefined),
          cumulativePnl: typeof t['Cumulative P&L'] === 'number' ? t['Cumulative P&L'] : (typeof t.cumulative === 'number' ? t.cumulative : undefined),
        }));
        addTrades(mapped);
        toast.success(`Added ${mapped.length} trades to portfolio`);
      }

      if (typeof (json as any).equity_final === 'number') {
        setPortfolioValue(Number((json as any).equity_final));
        toast.success(`Portfolio value updated to $${Number((json as any).equity_final).toLocaleString()}`);
      }

      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    } catch (err: any) {
      console.error('Backtest error', err);
      toast.error(err?.message ?? 'Backtest failed');
    }
>>>>>>> fc6f704 (Modified Trade.tsx)
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Strategy Backtester</h1>
          <p className="text-muted-foreground">Test your trading strategies with historical data</p>
        </div>

        <div className="card-glass rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">1. Choose Data Source</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
<<<<<<< HEAD
         
=======
>>>>>>> fc6f704 (Modified Trade.tsx)
            <div className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
              dataSource === "upload" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
            }`}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                className="hidden"
              />
              <div onClick={() => fileInputRef.current?.click()}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Upload Your Data</h3>
                    <p className="text-sm text-muted-foreground">CSV format required</p>
                  </div>
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors">
                  <p className="text-sm mb-2">Drag & Drop CSV file or click to browse</p>
                  <p className="text-xs text-muted-foreground">Format: Date, Open, High, Low, Close, Volume</p>
                </div>
                {dataSource === "upload" && fileName && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-success text-sm">
                    <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                      <span className="text-success-foreground text-xs">✓</span>
                    </div>
                    <span>{fileName} uploaded successfully</span>
                  </div>
                )}
              </div>
            </div>

            <div 
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
<<<<<<< HEAD
                dataSource === "sample" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
              }`}
              onClick={handleUseSampleData}
=======
                dataSource === "sample2" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
              }`}
              onClick={handleUseSampleData2}
>>>>>>> fc6f704 (Modified Trade.tsx)
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Database className="w-6 h-6 text-accent" />
                </div>
                <div>
<<<<<<< HEAD
                  <h3 className="font-bold text-lg">Use Sample Data</h3>
                  <p className="text-sm text-muted-foreground">Pre-loaded demo data</p>
                </div>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors">
                <p className="text-sm mb-2">Click to load sample stock data</p>
                <p className="text-xs text-muted-foreground">21 days of simulated market data</p>
              </div>
              {dataSource === "sample" && (
=======
                  <h3 className="font-bold text-lg">Sample Data 2</h3>
                  <p className="text-sm text-muted-foreground">Volatile data</p>
                </div>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent/50 transition-colors">
                <p className="text-sm mb-1 font-medium">RSI + SMA Strategy</p>
                <p className="text-xs text-muted-foreground mb-2">30 days • MSFT</p>
                <p className="text-xs text-muted-foreground">Default: RSI + SMA(5/15)</p>
              </div>
              {dataSource === "sample2" && (
>>>>>>> fc6f704 (Modified Trade.tsx)
                <div className="mt-4 flex items-center justify-center gap-2 text-success text-sm">
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                    <span className="text-success-foreground text-xs">✓</span>
                  </div>
<<<<<<< HEAD
                  <span>Sample data loaded successfully</span>
=======
                  <span>Sample Data 2 loaded</span>
>>>>>>> fc6f704 (Modified Trade.tsx)
                </div>
              )}
            </div>
          </div>
        </div>

        {dataSource !== "none" && candlestickData.length > 0 && (
          <div className="card-glass rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Price Chart with Indicators</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={candlestickData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))" 
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  style={{ fontSize: '12px' }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                  name="Close Price"
                />
                {indicators.sma && (
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke="hsl(var(--success))"
                    strokeWidth={1}
                    dot={false}
                    name="SMA"
                    strokeDasharray="5 5"
                  />
                )}
                {indicators.bollingerBands && (
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke="hsl(var(--primary))"
                    strokeWidth={1}
                    dot={false}
                    name="Bollinger Bands"
                    strokeDasharray="3 3"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="card-glass rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">2. Define Entry & Exit Rules</h2>
          
          <Button 
            variant="outline" 
            className="mb-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            onClick={handleAddRule}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Rule
          </Button>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-secondary/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">{rule.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-muted-foreground">WHEN</span>
                  <Input className="w-32" placeholder="SMA(5)" defaultValue={rule.indicator1} />
                  <Select defaultValue={rule.condition}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crosses-above">crosses above</SelectItem>
                      <SelectItem value="crosses-below">crosses below</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input className="w-32" placeholder="SMA(20)" defaultValue={rule.indicator2} />
                  <span className="text-muted-foreground">THEN</span>
                  <Button className={rule.action === "BUY" ? "btn-trade" : "btn-sell"} size="sm">
                    {rule.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">3. Set Parameters</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Stock Symbol</Label>
                <Input 
                  type="text" 
                  value={strategySymbol}
                  onChange={(e) => setStrategySymbol(e.target.value.toUpperCase())}
                  placeholder="AAPL"
                />
              </div>
              <div>
                <Label>Short SMA Period</Label>
<<<<<<< HEAD
                <Input type="number" defaultValue="5" />
              </div>
              <div>
                <Label>Long SMA Period</Label>
                <Input type="number" defaultValue="20" />
=======
                <Input 
                  type="number" 
                  value={smaShortPeriod}
                  onChange={(e) => setSmaShortPeriod(parseInt(e.target.value) || 5)}
                  min="1"
                />
              </div>
              <div>
                <Label>Long SMA Period</Label>
                <Input 
                  type="number" 
                  value={smaLongPeriod}
                  onChange={(e) => setSmaLongPeriod(parseInt(e.target.value) || 20)}
                  min="1"
                />
              </div>
              <div>
                <Label>RSI Window</Label>
                <Input 
                  type="number" 
                  value={rsiWindow}
                  onChange={(e) => setRsiWindow(parseInt(e.target.value) || 14)}
                  min="1"
                />
              </div>
              <div>
                <Label>MACD Fast Period</Label>
                <Input 
                  type="number" 
                  value={macdFastPeriod}
                  onChange={(e) => setMacdFastPeriod(parseInt(e.target.value) || 12)}
                  min="1"
                />
              </div>
              <div>
                <Label>MACD Slow Period</Label>
                <Input 
                  type="number" 
                  value={macdSlowPeriod}
                  onChange={(e) => setMacdSlowPeriod(parseInt(e.target.value) || 26)}
                  min="1"
                />
              </div>
              <div>
                <Label>MACD Signal Period</Label>
                <Input 
                  type="number" 
                  value={macdSignalPeriod}
                  onChange={(e) => setMacdSignalPeriod(parseInt(e.target.value) || 9)}
                  min="1"
                />
>>>>>>> fc6f704 (Modified Trade.tsx)
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">4. Select Indicators</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <Label htmlFor="sma" className="cursor-pointer">SMA (Simple Moving Average)</Label>
                <Switch
                  id="sma"
                  checked={indicators.sma}
                  onCheckedChange={(checked) => setIndicators({ ...indicators, sma: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <Label htmlFor="ema" className="cursor-pointer">EMA (Exponential Moving Average)</Label>
                <Switch
                  id="ema"
                  checked={indicators.ema}
                  onCheckedChange={(checked) => setIndicators({ ...indicators, ema: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <Label htmlFor="rsi" className="cursor-pointer">RSI (Relative Strength Index)</Label>
                <Switch
                  id="rsi"
                  checked={indicators.rsi}
                  onCheckedChange={(checked) => setIndicators({ ...indicators, rsi: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <Label htmlFor="macd" className="cursor-pointer">MACD</Label>
                <Switch
                  id="macd"
                  checked={indicators.macd}
                  onCheckedChange={(checked) => setIndicators({ ...indicators, macd: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <Label htmlFor="bb" className="cursor-pointer">Bollinger Bands</Label>
                <Switch
                  id="bb"
                  checked={indicators.bollingerBands}
                  onCheckedChange={(checked) => setIndicators({ ...indicators, bollingerBands: checked })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card-glass rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">5. Run Backtest</h2>
              <p className="text-muted-foreground">
<<<<<<< HEAD
                Strategy: SMA Crossover {dataSource !== "none" && `• Data: ${dataSource === "upload" ? fileName : "Sample Data"}`}
=======
                Strategy: {dataSource === "sample2" ? "RSI + SMA" : "SMA Crossover"} 
                {dataSource !== "none" && ` • Data: ${
                  dataSource === "upload" ? fileName : 
                  dataSource === "sample2" ? "Sample Data 2" : ""
                }`}
>>>>>>> fc6f704 (Modified Trade.tsx)
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={handleRunBacktest} 
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={dataSource === "none"}
            >
              <Play className="w-5 h-5" />
              Run Strategy Backtest
            </Button>
          </div>
        </div>

        {backtestRun && (
          <>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
             
              <div className="card-glass rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Key Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Final Equity</span>
<<<<<<< HEAD
                    <span className="font-mono font-bold text-success">$22,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Return</span>
                    <span className="font-mono font-bold text-success">+125.00%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Trades</span>
                    <span className="font-mono font-bold text-accent">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-mono font-bold text-accent">1.85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="font-mono font-bold text-destructive">-8.5%</span>
=======
                    <span className="font-mono font-bold text-success">
                      ${result?.equity_final ? result.equity_final.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Portfolio Value (Global)</span>
                    <span className="font-mono font-bold text-accent">
                      ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Return</span>
                    <span className="font-mono font-bold text-success">{result ? (Number(result['Return(%)']).toFixed(2) + '%') : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Trades</span>
                    <span className="font-mono font-bold text-accent">{result?.['No. of trades'] ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-mono font-bold text-accent">{result?.sharpe_ratio ? Number(result.sharpe_ratio).toFixed(2) : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="font-mono font-bold text-destructive">{(result as any)?.max_drawdown ?? '—'}</span>
>>>>>>> fc6f704 (Modified Trade.tsx)
                  </div>
                </div>
              </div>

              <div className="card-glass rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Equity Curve</h3>
<<<<<<< HEAD
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={equityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '10px' }} />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '10px' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '10px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="equity" stroke="hsl(var(--success))" strokeWidth={3} />
                    <Line yAxisId="right" type="monotone" dataKey="price" stroke="hsl(var(--accent))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
=======
                {result && result.equity_curve && result.equity_curve.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={result.equity_curve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '10px' }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '10px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Equity']}
                      />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--success))" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <p>No equity curve data available</p>
                  </div>
                )}
>>>>>>> fc6f704 (Modified Trade.tsx)
              </div>
            </div>

            <div className="card-glass rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Trade Log</h3>
<<<<<<< HEAD
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Price</th>
                      <th className="text-left py-3 px-4 font-medium">P&L</th>
                      <th className="text-left py-3 px-4 font-medium">Cumulative P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-3 px-4 font-mono text-sm">{trade.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            trade.type === "BUY" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                          }`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{trade.price}</td>
                        <td className={`py-3 px-4 font-mono text-sm ${trade.color}`}>{trade.pnl}</td>
                        <td className={`py-3 px-4 font-mono text-sm ${trade.color}`}>{trade.cumulative}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
=======
              {result && result.trade_log && result.trade_log.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="text-left py-3 px-4 font-medium">Price</th>
                        <th className="text-left py-3 px-4 font-medium">P&L</th>
                        <th className="text-left py-3 px-4 font-medium">Cumulative P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.trade_log.map((trade, i) => {
                        const pnl = typeof trade['P&L'] === 'number' ? trade['P&L'] : 0;
                        const cumPnl = typeof trade['Cumulative P&L'] === 'number' ? trade['Cumulative P&L'] : 0;
                        const isBuy = (trade.type || '').toUpperCase() === 'BUY';
                        const isPositive = pnl > 0;
                        const pnlColor = isBuy ? "text-muted-foreground" : (isPositive ? "text-success" : "text-destructive");
                        return (
                          <tr key={i} className="border-b border-border/50">
                            <td className="py-3 px-4 font-mono text-sm">{trade.date}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                isBuy ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                              }`}>
                                {trade.type || 'BUY'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-sm">${typeof trade.price === 'number' ? trade.price.toFixed(2) : trade.price}</td>
                            <td className={`py-3 px-4 font-mono text-sm ${pnlColor}`}>
                              {isBuy ? '-' : (isPositive ? '+' : '')}{typeof pnl === 'number' ? pnl.toFixed(2) : '-'}
                            </td>
                            <td className={`py-3 px-4 font-mono text-sm ${pnlColor}`}>
                              {cumPnl > 0 ? '+' : ''}{typeof cumPnl === 'number' ? cumPnl.toFixed(2) : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No trades executed in this backtest</p>
                </div>
              )}
>>>>>>> fc6f704 (Modified Trade.tsx)
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Trade;

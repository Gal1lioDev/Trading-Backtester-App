import { useState } from "react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import CandlestickChart from "@/components/CandlestickChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Database, Play } from "lucide-react";
import { CandlestickData, loadSampleData, parseCSV } from "@/lib/csvParser";
import { useToast } from "@/hooks/use-toast";

const Trade = () => {
  const [data, setData] = useState<CandlestickData[]>([]);
  const [strategy, setStrategy] = useState("sma_crossover");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLoadSampleData = async () => {
    setIsLoading(true);
    try {
      const sampleData = await loadSampleData();
      setData(sampleData);
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

  const handleRunBacktest = () => {
    if (data.length === 0) {
      toast({
        title: "No data loaded",
        description: "Please load data before running backtest",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Backtest running",
      description: `Processing ${data.length} days with ${strategy} strategy`,
    });

    setTimeout(() => {
      toast({
        title: "Backtest complete",
        description: "Check the results in your portfolio",
      });
    }, 2000);
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
          <CandlestickChart data={data} />
        </GlassCard>

        <GlassCard className="mb-8">
          <h2 className="text-2xl font-bold mb-6">2. Choose Strategy</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Trading Strategy</label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sma_crossover">SMA Crossover (5/20)</SelectItem>
                  <SelectItem value="rsi">RSI Strategy</SelectItem>
                  <SelectItem value="macd">MACD Strategy</SelectItem>
                  <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                {strategy === "sma_crossover" && "Buy when SMA(5) crosses above SMA(20), sell when it crosses below"}
                {strategy === "rsi" && "Buy when RSI < 30 (oversold), sell when RSI > 70 (overbought)"}
                {strategy === "macd" && "Buy/sell based on MACD line crossing signal line"}
                {strategy === "bollinger" && "Buy at lower band, sell at upper band"}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-8">
          <h2 className="text-2xl font-bold mb-6">3. Set Risk Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Initial Capital ($)</label>
              <Input type="number" defaultValue="100000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position Size (%)</label>
              <Input type="number" defaultValue="10" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stop Loss (%)</label>
              <Input type="number" defaultValue="5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Take Profit (%)</label>
              <Input type="number" defaultValue="15" />
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="gap-2 text-lg px-8"
            onClick={handleRunBacktest}
            disabled={isLoading}
          >
            <Play className="w-5 h-5" />
            {isLoading ? "Loading..." : "Run Backtest"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Trade;

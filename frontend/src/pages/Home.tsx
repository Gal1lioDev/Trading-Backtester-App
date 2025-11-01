import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { Briefcase, LineChart, TrendingUp, TrendingDown } from "lucide-react";
//import { Button } from "../components/ui/button";

const Home = () => {
  const trendingStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 178.42, change: 2.36, icon: TrendingUp },
    { symbol: "TSLA", name: "Tesla Inc.", price: 242.84, change: -1.21, icon: TrendingDown },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 495.22, change: 2.55, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 py-12">
      
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">
            <span className="gradient-text">Backtest</span> Your Trading Strategies
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional-grade backtesting platform for data-driven traders
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Link to="/portfolio">
            <GlassCard hover className="text-center border-2 border-primary/20 hover:border-primary/40">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Portfolio</h3>
              <p className="text-muted-foreground">View Performance</p>
            </GlassCard>
          </Link>
          
          <Link to="/trade">
            <GlassCard hover className="text-center border-2 border-accent/20 hover:border-accent/40">
              <LineChart className="w-16 h-16 mx-auto mb-4 text-accent" />
              <h3 className="text-2xl font-bold mb-2">Trade</h3>
              <p className="text-muted-foreground">Backtest Strategies</p>
            </GlassCard>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Trending Stocks</h2>
          <p className="text-muted-foreground mb-6">Real-time market movers</p>
          
          <div className="grid md:grid-cols-3 gap-4">
            {trendingStocks.map((stock) => (
              <GlassCard key={stock.symbol} hover>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-mono font-bold text-lg">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <stock.icon className={`w-6 h-6 ${stock.change > 0 ? "text-success" : "text-destructive"}`} />
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold font-mono-tabular">${stock.price}</div>
                  <div
                    className={`font-mono-tabular font-bold ${
                      stock.change > 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {stock.change > 0 ? "+" : ""}{stock.change}%
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

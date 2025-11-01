import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, BarChart3, Target, Zap, Shield } from "lucide-react";

const Basics = () => {
  const sections = [
    {
      icon: BookOpen,
      title: "What is Backtesting?",
      content: "Backtesting is a method of evaluating a trading strategy by applying it to historical data to see how it would have performed. It's an essential tool for traders to validate their strategies before risking real capital in the market. By simulating trades on past market data, you can assess the viability of your strategy and make data-driven decisions.",
    },
    {
      icon: TrendingUp,
      title: "Understanding the Stock Market",
      content: "The stock market is a platform where shares of publicly traded companies are bought and sold. Prices fluctuate based on supply and demand, influenced by company performance, economic indicators, and market sentiment. Understanding market dynamics, including trends, volatility, and liquidity, is crucial for developing effective trading strategies.",
    },
    {
      icon: BarChart3,
      title: "Key Technical Indicators",
      content: `Technical indicators are mathematical calculations based on price, volume, or open interest. Common indicators include:

• SMA (Simple Moving Average): Average price over a specific period
• EMA (Exponential Moving Average): Weighted average giving more importance to recent prices
• RSI (Relative Strength Index): Momentum oscillator measuring speed and magnitude of price changes
• MACD (Moving Average Convergence Divergence): Trend-following momentum indicator
• Bollinger Bands: Volatility indicator showing price range relative to moving average`,
    },
    {
      icon: Target,
      title: "How to Backtest Effectively",
      content: `Effective backtesting requires:

1. Quality Data: Use accurate, complete historical data
2. Clear Rules: Define precise entry and exit criteria
3. Risk Management: Include position sizing and stop losses
4. Realistic Assumptions: Account for slippage, commissions, and market impact
5. Out-of-Sample Testing: Validate on data not used in strategy development
6. Multiple Market Conditions: Test across bull, bear, and sideways markets
7. Statistical Significance: Ensure sufficient trades for meaningful results`,
    },
    {
      icon: Zap,
      title: "Common Backtesting Pitfalls",
      content: `Avoid these common mistakes:

• Over-optimization: Curve-fitting to historical data
• Look-ahead bias: Using information not available at the time
• Survivorship bias: Only testing on stocks that still exist
• Ignoring transaction costs: Forgetting commissions and slippage
• Unrealistic assumptions: Assuming perfect execution
• Small sample size: Drawing conclusions from too few trades`,
    },
    {
      icon: Shield,
      title: "How StockPlay Helps",
      content: `StockPlay provides a professional backtesting platform designed to help you:

• Upload and analyze historical market data easily
• Build custom trading strategies with intuitive rule builders
• Visualize performance with interactive charts and metrics
• Test multiple indicators simultaneously
• Generate comprehensive performance reports
• Avoid common backtesting mistakes with built-in safeguards
• Make informed decisions based on statistical evidence

Our platform combines powerful analysis tools with an easy-to-use interface, making professional backtesting accessible to traders of all levels.`,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 max-w-4xl">
     
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Basics of Backtesting</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn the fundamentals of backtesting and how to validate your trading strategies with historical data
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {sections.map((section, index) => (
            <GlassCard key={index}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mt-2">{section.title}</h2>
              </div>
              <div className="pl-16">
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="text-center border-2 border-primary/20">
     
          <div className="flex gap-4 justify-center">
            <Link to="/trade">
              <Button size="lg">Start Backtesting</Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" size="lg">View Portfolio</Button>
            </Link>
          </div>
        </GlassCard>
      </main>
    </div>
  );
};

export default Basics;

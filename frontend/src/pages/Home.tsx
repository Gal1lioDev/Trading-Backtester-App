import { useNavigate } from 'react-router-dom';
import { Briefcase, TrendingUp, ArrowUp, ArrowDown, BookOpen } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const trendingStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.25, change: 2.34, changePercent: 1.33 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 372.89, change: -1.45, changePercent: -0.39 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 3.21, changePercent: 2.32 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.35, change: 4.67, changePercent: 2.69 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -2.11, changePercent: -0.86 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 12.45, changePercent: 1.44 },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Cards */}
      <div style={styles.heroSection}>
        <div 
          style={styles.card}
          onClick={() => navigate('/portfolio')}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Briefcase size={48} color="#FDB022" />
          <h2 style={styles.cardTitle}>Portfolio</h2>
          <p style={styles.cardDesc}>Track and analyze your investment performance</p>
        </div>
        
        <div 
          style={styles.card}
          onClick={() => navigate('/trade')}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <TrendingUp size={48} color="#FDB022" />
          <h2 style={styles.cardTitle}>Trade</h2>
          <p style={styles.cardDesc}>Build and backtest trading strategies</p>
        </div>
      </div>

      {/* Basics Section */}
      <div 
        style={styles.basicsCard}
        onClick={() => navigate('/basics')}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <BookOpen size={32} color="#FDB022" />
        <div>
          <h3 style={styles.basicsTitle}>Learn the Basics of Backtesting</h3>
          <p style={styles.basicsDesc}>Understand how to test trading strategies with historical data</p>
        </div>
      </div>

      {/* Trending Stocks */}
      <div style={styles.trendingSection}>
        <h2 style={styles.sectionTitle}>Trending Stocks</h2>
        <div style={styles.stocksGrid}>
          {trendingStocks.map((stock) => (
            <div key={stock.symbol} style={styles.stockCard}>
              <div style={styles.stockHeader}>
                <div>
                  <h3 style={styles.stockSymbol}>{stock.symbol}</h3>
                  <p style={styles.stockName}>{stock.name}</p>
                </div>
                <div style={styles.stockPrice}>${stock.price.toFixed(2)}</div>
              </div>
              <div style={styles.stockChange}>
                {stock.change >= 0 ? (
                  <ArrowUp size={16} color="#00ff88" />
                ) : (
                  <ArrowDown size={16} color="#ff4444" />
                )}
                <span style={{
                  ...styles.changeText,
                  color: stock.change >= 0 ? '#00ff88' : '#ff4444'
                }}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
  },
  heroSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  },
  card: {
    background: 'rgba(30, 30, 30, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(253, 176, 34, 0.2)',
    borderRadius: '16px',
    padding: '3rem 2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cardTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
  },
  cardDesc: {
    fontSize: '1rem',
    color: '#aaaaaa',
    textAlign: 'center' as const,
    margin: 0,
  },
  basicsCard: {
    background: 'rgba(253, 176, 34, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(253, 176, 34, 0.3)',
    borderRadius: '12px',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    cursor: 'pointer',
    marginBottom: '3rem',
    transition: 'all 0.3s ease',
  },
  basicsTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#FDB022',
    margin: '0 0 0.5rem 0',
  },
  basicsDesc: {
    fontSize: '0.95rem',
    color: '#cccccc',
    margin: 0,
  },
  trendingSection: {
    marginTop: '3rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '1.5rem',
    borderLeft: '4px solid #FDB022',
    paddingLeft: '1rem',
  },
  stocksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  stockCard: {
    background: 'rgba(30, 30, 30, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
  },
  stockHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  stockSymbol: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 0.3rem 0',
  },
  stockName: {
    fontSize: '0.85rem',
    color: '#888888',
    margin: 0,
  },
  stockPrice: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#FDB022',
  },
  stockChange: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  changeText: {
    fontSize: '0.95rem',
    fontWeight: '600',
  },
};

export default Home;
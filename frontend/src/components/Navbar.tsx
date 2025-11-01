import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <TrendingUp size={28} color="#FDB022" />
          <span style={styles.logoText}>StockPlay</span>
        </Link>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/trade" style={styles.navLink}>Trade</Link>
          <Link to="/portfolio" style={styles.navLink}>Portfolio</Link>
          <Link to="/profile" style={styles.navLink}>Profile</Link>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'rgba(20, 20, 20, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(253, 176, 34, 0.1)',
    padding: '1rem 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    transition: 'transform 0.2s',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#FDB022',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'color 0.2s',
    position: 'relative' as const,
  },
};

export default Navbar;
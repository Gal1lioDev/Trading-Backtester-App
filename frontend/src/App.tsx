import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#000000' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trade" element={<div style={{ color: 'white', textAlign: 'center', padding: '3rem' }}>Trade Page - Coming Soon</div>} />
          <Route path="/portfolio" element={<div style={{ color: 'white', textAlign: 'center', padding: '3rem' }}>Portfolio Page - Coming Soon</div>} />
          <Route path="/profile" element={<div style={{ color: 'white', textAlign: 'center', padding: '3rem' }}>Profile Page - Coming Soon</div>} />
          <Route path="/basics" element={<div style={{ color: 'white', textAlign: 'center', padding: '3rem' }}>Basics Page - Coming Soon</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
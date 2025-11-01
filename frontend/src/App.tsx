import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Trade from './pages/Trade';
import Portfolio from './pages/Portfolio';
import { BacktestProvider } from './context/BacktestContext';

function App() {
  return (
    <Router>
      <BacktestProvider>
        <div className="min-h-screen bg-black">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/news" element={<div className="text-white text-center p-12">News Page - Coming Soon</div>} />
            <Route path="/basics" element={<div className="text-white text-center p-12">Basics Page - Coming Soon</div>} />
          </Routes>
        </div>
      </BacktestProvider>
    </Router>
  );
}

export default App;
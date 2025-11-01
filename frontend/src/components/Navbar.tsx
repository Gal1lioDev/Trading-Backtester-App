import { Link, useLocation } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/trade", label: "Trade" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/news", label: "News" },
    { path: "/basics", label: "Basics" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="w-6 h-6 text-primary" />
            <span className="gradient-text">StockPlay</span>
          </Link>
          
          <ul className="flex gap-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

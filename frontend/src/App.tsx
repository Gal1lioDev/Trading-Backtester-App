<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { TradingProvider } from "./contexts/TradingContext";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
>>>>>>> fc6f704 (Modified Trade.tsx)
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Trade from "./pages/Trade";
import Portfolio from "./pages/Portfolio";
import Basics from "./pages/Basics";
import NotFound from "./pages/NotFound";
<<<<<<< HEAD
=======
import { BacktestProvider } from "./context/BacktestContext";
import { TradingProvider } from "./contexts/TradingContext";

// richer UI providers (local implementations)
import { Toaster as LocalToaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
>>>>>>> fc6f704 (Modified Trade.tsx)

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
<<<<<<< HEAD
      <TradingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
=======
      <BacktestProvider>
        <TradingProvider>
          <TooltipProvider>
          <LocalToaster />
          <SonnerToaster />
>>>>>>> fc6f704 (Modified Trade.tsx)
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trade" element={<Trade />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/basics" element={<Basics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
<<<<<<< HEAD
        </TooltipProvider>
      </TradingProvider>
=======
          </TooltipProvider>
        </TradingProvider>
      </BacktestProvider>
>>>>>>> fc6f704 (Modified Trade.tsx)
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
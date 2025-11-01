import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Trade from "./pages/Trade";
import Portfolio from "./pages/Portfolio";
import Basics from "./pages/Basics";
import NotFound from "./pages/NotFound";
import { BacktestProvider } from "./context/BacktestContext";
import { TradingProvider } from "./contexts/TradingContext";

// richer UI providers (local implementations)
import { Toaster as LocalToaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <BacktestProvider>
        <TradingProvider>
          <TooltipProvider>
          <LocalToaster />
          <SonnerToaster />
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
          </TooltipProvider>
        </TradingProvider>
      </BacktestProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
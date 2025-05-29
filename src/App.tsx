import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import MyBook from "./pages/MyBook";
import ComingSoon from "./pages/ComingSoon";
import Subscribe from "./pages/Subscribe";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Carica CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css";
    document.head.appendChild(link);

    // Carica script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js";
    script.onload = () => {
      // @ts-ignore
      window.cookieconsent.initialise({
        palette: {
          popup: { background: "#002b45" },
          button: { background: "#00c2a8" }
        },
        theme: "classic",
        content: {
          message: "Utilizziamo i cookie per migliorare la tua esperienza sul sito.",
          dismiss: "Accetta",
          link: "Leggi di più",
          href: "/cookies"
        }
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/history" element={<History />} />
            <Route path="/my-book" element={<MyBook />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/subscribe" element={<subscribe />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

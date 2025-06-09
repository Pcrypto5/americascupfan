import AllArticles from "./pages/all-articles";
import ArticlePage from "./pages/articles/ArticlePage";  // <-- importa il nuovo componente
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

const GA_MEASUREMENT_ID = "G-8DPCRZ2JVX";
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// --- Analytics + Consent Mode ---
const loadGoogleAnalytics = () => {
  window.dataLayer = window.dataLayer || [];

  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }

  gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted"
  });

  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}  
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  `;
  document.head.appendChild(script2);
};

// --- Tracciamento dinamico delle pageview ---
const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname
      });
    }
  }, [location.pathname]);

  // Traccia scroll oltre il 50%
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition / pageHeight > 0.5) {
        if (window.gtag) {
          window.gtag("event", "scroll_50", {
            event_category: "Engagement",
            event_label: location.pathname,
          });
        }

        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
};

const AppRoutes = () => {
  usePageTracking();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/history" element={<History />} />
      <Route path="/my-book" element={<MyBook />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      <Route path="/subscribe" element={<Subscribe />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/all-articles" element={<AllArticles />} /> {/* ✅ Aggiunta pagina elenco articoli */}
      <Route path="/articles/:slug" element={<ArticlePage />} /> {/* ✅ Aggiunta pagina dettaglio articolo */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css";
    document.head.appendChild(link);

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
        },
        onInitialise: function (status: string) {
          if (status === "allow") loadGoogleAnalytics();
        },
        onStatusChange: function (status: string) {
          if (status === "allow") loadGoogleAnalytics();
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
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

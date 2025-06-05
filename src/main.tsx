import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Inserimento dinamico del Google Tag
const GA_MEASUREMENT_ID = 'G-8DPCRZ2JVX';

(function loadGoogleAnalytics() {
  // Script 1: carica gtag.js
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Script 2: inizializza GA
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  `;
  document.head.appendChild(script2);
})();

createRoot(document.getElementById("root")!).render(<App />);

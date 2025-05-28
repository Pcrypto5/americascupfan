// src/components/Footer.tsx
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom'; // if you're using react-router

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-americas-navy text-white py-12">
      <div className="container-padding max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">AmericasCupFan</h3>
          <p className="text-white/80 max-w-xs">
            Your ultimate destination for America's Cup sailing updates, history, and exclusive content.
          </p>
        </div>

        <div>
          <h4 className="text-americas-teal font-bold mb-2">Navigation</h4>
          <ul className="space-y-1">
            <li><a href="/" className="hover:underline">Watch & Read</a></li>
            <li><a href="/history" className="hover:underline">History</a></li>
            <li><a href="/mybook" className="hover:underline">My Book</a></li>
            <li><a href="/comingsoon" className="hover:underline">Coming Soon</a></li>
            <li><a href="/subscribe" className="hover:underline">Subscribe</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-americas-teal font-bold mb-2">Follow Us</h4>
          <ul className="space-y-1">
            <li><span className="cursor-not-allowed text-white/50">Instagram (Coming Soon)</span></li>
            <li><span className="cursor-not-allowed text-white/50">X (Coming Soon)</span></li>
            <li><span className="cursor-not-allowed text-white/50">YouTube (Coming Soon)</span></li>
            <li><span className="cursor-not-allowed text-white/50">TikTok (Coming Soon)</span></li>
          </ul>
        </div>

        <div>
  <h4 className="text-americas-teal font-bold mb-2">Contact Us</h4>
  <ul className="space-y-1 text-sm">
    <li>
      <span className="text-white/80">Interested in sponsoring?</span><br />
      <a href="mailto:info@americascupfan.com" className="hover:underline text-white">americascupfan@bstac.tech</a>
    </li>
  </ul>
</div>

<div>
  <h4 className="text-americas-teal font-bold mb-2">Legal</h4>
  <ul className="space-y-1">
    <li><a href="/terms" className="hover:underline">Terms</a></li>
    <li><a href="/privacy" className="hover:underline">Privacy</a></li>
    <li><a href="/cookies" className="hover:underline">Cookies</a></li>
  </ul>
</div>

      </div>

      {/* Footer bottom bar */}
      <div className="mt-12 pt-8 border-t border-white/20 text-sm opacity-70 container-padding max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p>© {currentYear} AmericasCupFan. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Created by a sailing enthusiast.</p>
      </div>
    </footer>
  );
};

export default Footer;

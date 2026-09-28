import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);

    const isHomePage = window.location.pathname === '/';

    // If on a different page (like /about)
    if (!isHomePage) {
      window.history.pushState({}, '', `/${href}`);
      window.dispatchEvent(new Event('pushstate'));

      // Allow the home page DOM to mount before triggering the smooth scroll
      setTimeout(() => {
        if (href === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.querySelector(href);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 150);
      return;
    }

    // Already on the home page
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md py-3 shadow-md shadow-orange-950/5 border-b border-orange-100/50'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Bigger Logo */}
          <motion.div
            className="flex items-center cursor-pointer"
            onClick={() => scrollTo('#home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src="/logo.png"
              alt="Aravind Sports Academy Logo"
              className="h-14 sm:h-16 md:h-18 w-auto object-contain drop-shadow-[0_2px_10px_rgba(249,115,22,0.25)]"
            />
          </motion.div>

          {/* Desktop Navigation Links (Centered) */}
          <div className="hidden lg:flex items-center justify-center gap-3 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <motion.button
                key={link.label}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="relative px-4 py-2 text-base font-bold text-zinc-800 hover:text-orange-600 transition-colors group cursor-pointer"
                whileHover={{ y: -1 }}
              >
                {link.label}
                <span className="absolute bottom-0.5 left-1/2 w-0 h-0.5 bg-orange-500 rounded-full group-hover:w-3/4 group-hover:left-[12.5%] transition-all duration-300" />
              </motion.button>
            ))}
          </div>

          {/* Right Side: Glowing Orange CTA Button */}
          <div className="hidden lg:flex items-center">
            <motion.button
              type="button"
              onClick={() => scrollTo('#contact')}
              className="relative px-7 py-2.5 rounded-full overflow-hidden text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase cursor-pointer shadow-lg shadow-orange-500/40"
              style={{
                backgroundColor: '#f97316',
                backgroundImage: 'linear-gradient(135deg, #FF6B00 0%, #FF8C38 50%, #ea580c 100%)',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 6px 28px rgba(249, 115, 22, 0.65)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                  width: '50%',
                  transform: 'skewX(-25deg)',
                }}
                animate={{ left: ['-120%', '220%'] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatDelay: 0.8,
                }}
              />
              <span className="relative z-10 drop-shadow-sm">Join Now</span>
            </motion.button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="lg:hidden text-zinc-800 hover:text-orange-600 transition-colors p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl lg:hidden flex flex-col items-center justify-center gap-6 px-6"
          >
            <img
              src="/logo.png"
              alt="Aravind Sports Academy"
              className="h-20 w-auto object-contain mb-2"
            />

            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="font-bold text-2xl text-zinc-800 hover:text-orange-600 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => scrollTo('#contact')}
              className="mt-3 w-full max-w-xs py-3.5 rounded-full text-white font-bold text-base tracking-wider uppercase shadow-lg shadow-orange-500/40 cursor-pointer"
              style={{
                backgroundColor: '#f97316',
                backgroundImage: 'linear-gradient(135deg, #FF6B00 0%, #ea580c 100%)',
              }}
            >
              Join Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
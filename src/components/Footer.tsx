import { motion } from 'framer-motion';
import { Activity, Phone, MapPin, Mail, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  return (
    <footer className="relative bg-primary-dark border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center glow-accent">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="font-display font-extrabold text-lg">
                <span className="text-white">Aravind</span>
                <span className="block text-accent text-[0.6rem] tracking-[0.2em] font-semibold">SPORTS ACADEMY</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Train like a champion. Expert coaching in Yoga, Martial Arts & Sports in Hosur, Tamil Nadu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-white/50 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/50 text-sm">
                <Phone className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <a href="tel:+919894828541" className="hover:text-accent transition-colors">+91 98948 28541</a>
              </li>
              <li className="flex items-start gap-2 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                Hosur, Tamil Nadu, India
              </li>
              <li className="flex items-start gap-2 text-white/50 text-sm">
                <Mail className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                info@Aravindsportsacademy.in
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'YouTube' },
                { icon: Twitter, label: 'Twitter' },
              ].map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-accent hover:border-accent/30 transition-all"
                  whileHover={{ y: -4, scale: 1.1 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Aravind Sports & Cultural Academy. All rights reserved.
          </p>
          <a href="/admin" className="text-white/30 hover:text-accent text-xs transition-colors">
            Admin Login
          </a>
        </div>
      </div>
    </footer>
  );
}

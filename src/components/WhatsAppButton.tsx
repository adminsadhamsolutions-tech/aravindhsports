import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Phone, ChevronDown } from 'lucide-react';
import { buildWhatsAppLink, buildEnquiryWhatsAppLink, ACADEMY_PHONE } from '@/lib/supabase';
import { usePrograms } from '@/hooks/usePrograms';

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', program: '', message: '' });
  const [programs] = usePrograms();

  const handleQuickClick = () => {
    window.open(buildWhatsAppLink('Hi, I\'m interested in joining Aravind Sports Academy. Please share details.'), '_blank');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.program) return;
    window.open(buildEnquiryWhatsAppLink(form.name, form.phone, form.program, form.message), '_blank');
    setForm({ name: '', phone: '', program: '', message: '' });
    setOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Chat on WhatsApp"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {open ? <X className="w-7 h-7 text-white relative z-10" /> : <MessageCircle className="w-7 h-7 text-white relative z-10" />}
      </motion.button>

      {/* Popup panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] p-5 rounded-2xl glass-dark border border-white/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm">Quick Enquiry</h3>
                <p className="text-xs text-white/40">Send via WhatsApp</p>
              </div>
            </div>

            {/* Quick chat button */}
            <button
              onClick={handleQuickClick}
              className="w-full mb-4 px-4 py-2.5 rounded-xl bg-[#25D366]/15 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/25 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Quick Chat
            </button>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-accent focus:outline-none transition-colors"
                  placeholder="Your Name"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-accent focus:outline-none transition-colors"
                  placeholder="Phone Number"
                />
              </div>
              <div className="relative">
                <select
                  value={form.program}
                  onChange={(e) => setForm({ ...form, program: e.target.value })}
                  required
                  className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-accent focus:outline-none transition-colors appearance-none"
                >
                  <option value="" className="bg-primary-dark">Select Program</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.title} className="bg-primary-dark">{p.title}</option>
                  ))}
                  <option value="General" className="bg-primary-dark">General Enquiry</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              </div>
              <div className="relative">
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-accent focus:outline-none transition-colors resize-none"
                  placeholder="Message (optional)"
                />
              </div>
              <motion.button
                type="submit"
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-semibold text-sm flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-4 h-4" />
                Send via WhatsApp
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

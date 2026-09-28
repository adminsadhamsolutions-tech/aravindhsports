import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Mail, Send, User, MessageSquare, Loader2, CheckCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { supabase, buildEnquiryWhatsAppLink } from '@/lib/supabase';
import { usePrograms } from '@/hooks/usePrograms';

type ContactInfo = {
  phone: string;
  address: string;
  email: string;
};

const defaultContact: ContactInfo = {
  phone: '+91 98948 28541',
  address: 'Hosur, Tamil Nadu, India',
  email: 'info@aravindsportsacademy.in',
};

export default function Contact({ showButton = true }: { showButton?: boolean }) {
  const [info, setInfo] = useState<ContactInfo>(defaultContact);
  const [form, setForm] = useState({ name: '', phone: '', program: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [programs] = usePrograms();

  useEffect(() => {
    supabase
      .from('site_content')
      .select('value')
      .eq('key', 'contact')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setInfo({ ...defaultContact, ...data.value });
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setStatus('loading');
    const { error } = await supabase.from('enquiries').insert({
      name: form.name,
      phone: form.phone,
      program: form.program || 'General',
      message: form.message,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      window.open(buildEnquiryWhatsAppLink(form.name, form.phone, form.program || 'General', form.message), '_blank');
      setForm({ name: '', phone: '', program: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const handleOpenContactPage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.history.pushState({}, '', '/contact');
    window.dispatchEvent(new Event('pushstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const contactItems = [
    { icon: Phone, label: 'Phone', value: info.phone, href: `tel:${info.phone.replace(/\s/g, '')}` },
    { icon: MapPin, label: 'Address', value: info.address },
    { icon: Mail, label: 'Email', value: info.email, href: `mailto:${info.email}` },
  ];

  return (
    <section 
      id="contact" 
      className="relative min-h-screen w-full flex flex-col justify-center py-12 md:py-16 overflow-hidden bg-slate-50 text-slate-700"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Background ambient orange glows */}
      <div className="absolute top-10 left-1/3 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            Contact Us
          </span>
          <h2 className="text-2xl sm:text-3xl text-slate-800 tracking-tight leading-snug mt-2 mb-1 font-bold">
            Get in Touch with <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Aravind Sports Academy</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            Reach out via phone, email, or send an enquiry directly to WhatsApp.
          </p>
        </div>

        {/* Form and Contact Cards */}
        <div className="grid md:grid-cols-12 gap-5 mb-5 items-stretch">
          
          {/* Contact Details (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-2.5">
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">{label}</div>
                  {href ? (
                    <a href={href} className="text-sm text-slate-700 hover:text-orange-600 transition-colors truncate block">
                      {value}
                    </a>
                  ) : (
                    <div className="text-sm text-slate-700 truncate">{value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form (7 cols) */}
          <div className="md:col-span-7">
            <form 
              onSubmit={handleSubmit} 
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 uppercase tracking-wider mb-1">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all text-xs sm:text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all text-xs sm:text-sm"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 uppercase tracking-wider mb-1">Select Program</label>
                <div className="relative">
                  <select
                    value={form.program}
                    onChange={(e) => setForm({ ...form, program: e.target.value })}
                    className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white focus:border-orange-500 focus:outline-none transition-all appearance-none text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="" className="bg-white text-slate-600">Choose a discipline...</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.title} className="bg-white text-slate-700">
                        {p.title}
                      </option>
                    ))}
                    <option value="General" className="bg-white text-slate-700">General Enquiry</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 uppercase tracking-wider mb-1">Your Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={2}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all resize-none text-xs sm:text-sm"
                    placeholder="Ask about training batches or timings"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                style={{
                  backgroundColor: '#f97316',
                  backgroundImage: 'linear-gradient(135deg, #FF6B00 0%, #ea580c 100%)',
                }}
                className="w-full py-2.5 rounded-xl text-white text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/25"
                whileTap={{ scale: 0.98 }}
              >
                {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === 'success' && <CheckCircle className="w-4 h-4" />}
                {status === 'idle' && (<><Send className="w-4 h-4" /> Send & WhatsApp</>)}
                {status === 'loading' && 'Submitting...'}
                {status === 'success' && 'Sent! Check WhatsApp'}
                {status === 'error' && 'Try Again'}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Button to Full Page */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-8"
          >
            <motion.button
              type="button"
              onClick={handleOpenContactPage}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-xs sm:text-sm tracking-wider uppercase cursor-pointer shadow-lg shadow-orange-500/30"
              style={{
                backgroundColor: '#f97316',
                backgroundImage: 'linear-gradient(135deg, #FF6B00 0%, #ea580c 100%)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View Full Contact Page</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

      </div>
    </section>
  );
}
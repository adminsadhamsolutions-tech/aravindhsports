import { motion } from 'framer-motion';
import { Trophy, ShieldCheck, Target, HeartHandshake, ArrowRight } from 'lucide-react';

const reasons = [
  {
    icon: Trophy,
    title: 'Certified Master Trainers',
    desc: 'Led by national-level medalists and certified masters with deep discipline experience.',
  },
  {
    icon: Target,
    title: 'Tournament & Stage Focus',
    desc: 'Structured training regimens designed for competitive championships and belt gradings.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Modern Arena',
    desc: 'Fully padded safety mats, high-grade sparring gear, and dedicated practice zones.',
  },
  {
    icon: HeartHandshake,
    title: 'Character & Mindset',
    desc: 'Balancing physical power with focus, respect, patience, and mental endurance.',
  },
];

export default function WhyChooseUs() {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="why-us" 
      className="relative py-20 md:py-28 overflow-hidden bg-slate-50 text-slate-800"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-bold tracking-wider uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Why <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Aravind Sports Academy</span> is the Best
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mt-3">
            We don't just teach techniques—we build discipline, confidence, and championship performance.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-5 text-orange-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-orange-600">
                  <span>Standard 0{idx + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <button
            onClick={scrollToContact}
            style={{
              backgroundColor: '#f97316',
              backgroundImage: 'linear-gradient(135deg, #FF6B00 0%, #ea580c 100%)',
            }}
            className="px-8 py-3.5 rounded-full text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Start Training With Us
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
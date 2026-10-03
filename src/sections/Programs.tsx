import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Program } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

const defaultPrograms: Program[] = [
  {
    id: '1',
    title: 'Yoga',
    description: 'Find inner calm, core posture, and mental clarity with master yogis.',
    icon: '',
    image_url: 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788958021/Gemini_Generated_Image_qvhabaqvhabaqvha-removebg-preview.png',
    display_order: 1,
    created_at: '',
  },
  {
    id: '2',
    title: 'Karate & Kung Fu',
    description: 'Ancient martial disciplines for speed, defensive blocks, and explosive strikes.',
    icon: '',
    image_url: 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788934736/Gemini_Generated_Image_w6auuvw6auuvw6au.png',
    display_order: 2,
    created_at: '',
  },
  {
    id: '3',
    title: 'Boxing & Sparring',
    description: 'High-intensity footwork, counter-striking combinations, and championship power.',
    icon: '',
    image_url: 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788934734/Gemini_Generated_Image_m35onkm35onkm35o.png',
    display_order: 3,
    created_at: '',
  },
  {
    id: '4',
    title: 'Archery Mastery',
    description: 'Olympic recurve precision, breath synchronization, and bullseye patience.',
    icon: '',
    image_url: 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788934739/Gemini_Generated_Image_de5la6de5la6de5l.png',
    display_order: 4,
    created_at: '',
  },
  {
    id: '5',
    title: 'Taekwondo',
    description: 'Aravind aerial kicking techniques, reflex drills, and tournament sparring.',
    icon: '',
    image_url: 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788934726/Gemini_Generated_Image_w99nf3w99nf3w99n.png',
    display_order: 5,
    created_at: '',
  },
  {
    id: '6',
    title: 'Gymnastics & Agility',
    description: 'Acrobatic flexibility, floor stunts, balance control, and bodily poise.',
    icon: '',
    image_url: 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788958021/Gemini_Generated_Image_qvhabaqvhabaqvha-removebg-preview.png',
    display_order: 6,
    created_at: '',
  },
  {
    id: '7',
    title: 'Cultural Dance',
    description: 'Rhythmic coordination, stage performance confidence, and cultural heritage.',
    icon: '',
    image_url: 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788934736/Gemini_Generated_Image_w6auuvw6auuvw6au.png',
    display_order: 7,
    created_at: '',
  },
  {
    id: '8',
    title: 'Shooting & Focus',
    description: 'Professional target acquisition, trigger control, and pinpoint accuracy.',
    icon: '',
    image_url: 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788934739/Gemini_Generated_Image_de5la6de5la6de5l.png',
    display_order: 8,
    created_at: '',
  },
];

export default function Programs({ showButton = true }: { showButton?: boolean }) {
  const [programs, setPrograms] = useState<Program[]>(defaultPrograms);

  useEffect(() => {
    supabase
      .from('programs')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const merged = data.map((item, idx) => ({
            ...item,
            image_url: item.image_url || defaultPrograms[idx % defaultPrograms.length].image_url,
          }));
          setPrograms(merged);
        }
      });
  }, []);

  const scrollToContact = () => {
    const isHomePage = window.location.pathname === '/';
    if (!isHomePage) {
      window.history.pushState({}, '', '/#contact');
      window.dispatchEvent(new Event('pushstate'));
      setTimeout(() => {
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenProgramsPage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.history.pushState({}, '', '/programs');
    window.dispatchEvent(new Event('pushstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <section
      id="programs"
      className="relative py-24 md:py-36 overflow-hidden bg-slate-50 text-slate-900"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Soft Ambient Background Elements */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[30rem] h-[30rem] bg-amber-400/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs sm:text-sm font-bold mb-4 tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            Academy Disciplines
          </span>
          <h2 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight mb-4">
            Train at <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">Aravind Sports Academy</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Certified coaching across martial arts, meditative arts, and Olympic disciplines built for all age groups.
          </p>
        </motion.div>

        {/* Big Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 md:gap-8">
          {programs.map((program, i) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.25, 1, 0.5, 1] }}
              whileHover={{ y: -10 }}
              onClick={scrollToContact}
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-md shadow-slate-200/50 hover:shadow-xl hover:shadow-orange-500/15 hover:border-orange-300 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Radial aura on card hover */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-400/0 group-hover:bg-orange-400/20 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

              {/* Character Stage */}
              <div className="relative w-full h-56 sm:h-64 flex items-center justify-center my-2">
                <motion.img
                  src={program.image_url || defaultPrograms[0].image_url!}
                  alt={program.title}
                  className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] select-none pointer-events-none transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content & Action */}
              <div className="relative z-10 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-orange-600 transition-colors">
                    {program.title}
                  </h3>
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-200/60">
                    0{i + 1}
                  </span>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-4 font-normal">
                  {program.description}
                </p>

                {/* Hover CTA Link */}
                <div className="flex items-center gap-2 text-orange-600 text-sm font-bold group-hover:translate-x-1 transition-transform duration-300">
                  <span>Enquire Now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Bottom CTA Button */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-16"
          >
            <motion.button
              type="button"
              onClick={handleOpenProgramsPage}
              style={{
                backgroundColor: '#f97316',
                backgroundImage: 'linear-gradient(135deg, #FF6B00 0%, #FF8C38 50%, #ea580c 100%)',
                boxShadow: '0 8px 30px rgba(249, 115, 22, 0.45)',
              }}
              className="relative px-10 py-4 rounded-full overflow-hidden text-white font-extrabold text-base tracking-wider uppercase cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 38px rgba(249, 115, 22, 0.65)' }}
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
              <span className="relative z-10 drop-shadow-sm">Explore All Programs</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
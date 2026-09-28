import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Dumbbell, Calendar, Flame, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ABOUT_PNG = 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788934736/Gemini_Generated_Image_w6auuvw6auuvw6au.png';

type Stat = { label: string; value: string };
type AboutContent = {
  heading: string;
  text: string;
  stats: Stat[];
};

const defaultAbout: AboutContent = {
  heading: 'About Aravind Sports Academy',
  text: 'Aravind Sports Academy provides expert training in Yoga, Karate, Kung Fu, Taekwondo, Gymnastics, Archery and more. Our certified coaches are dedicated to nurturing champions both on and off the field.',
  stats: [
    { label: 'Students Trained', value: '500+' },
    { label: 'Expert Coaches', value: '15+' },
    { label: 'Disciplines', value: '8+' },
    { label: 'Years of Excellence', value: '10+' },
  ],
};

const statIcons = [Users, Award, Dumbbell, Calendar];

export default function AboutSection({ showButton = true }: { showButton?: boolean }) {
  const [content, setContent] = useState<AboutContent>(defaultAbout);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('value')
      .eq('key', 'about')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setContent({ ...defaultAbout, ...data.value });
      });
  }, []);

  const handleNavigateToAbout = () => {
    window.history.pushState({}, '', '/about');
    window.dispatchEvent(new Event('pushstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section 
      id="about" 
      className="relative py-20 md:py-36 overflow-hidden bg-slate-50 text-slate-800"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 w-96 md:w-[38rem] h-96 md:h-[38rem] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 md:w-[32rem] h-80 md:h-[32rem] bg-amber-400/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: Graphic Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 35 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:col-span-7 flex items-center justify-center order-2 lg:order-1"
          >
            <motion.div 
              className="absolute inset-0 m-auto w-72 h-72 sm:w-[26rem] sm:h-[26rem] md:w-[34rem] md:h-[34rem] bg-gradient-to-tr from-orange-500/25 via-amber-500/20 to-transparent rounded-full blur-3xl pointer-events-none"
              animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.6, 0.85, 0.6] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              className="relative z-10 w-full max-w-[440px] sm:max-w-[540px] md:max-w-[640px] lg:max-w-[700px] flex items-center justify-center"
              animate={{ 
                y: [0, -18, 0],
                rotate: [0, 0.5, 0, -0.5, 0]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src={ABOUT_PNG}
                alt="Aravind Sports Academy Champion"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_25px_60px_rgba(249,115,22,0.28)]"
              />
            </motion.div>

            {/* Floating badge: 10+ Years */}
            <motion.div
              className="absolute top-4 right-2 sm:right-6 md:right-10 z-20 px-5 py-3 rounded-full bg-white/90 backdrop-blur-md border border-orange-200/80 shadow-xl shadow-orange-500/10 flex items-center gap-3"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              <div>
                <span className="font-black text-lg sm:text-xl text-slate-900 block leading-none">10+ Years</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wider uppercase">Excellence</span>
              </div>
            </motion.div>

            {/* Floating badge: 500+ Students */}
            <motion.div
              className="absolute bottom-2 left-2 sm:left-6 md:left-10 z-20 px-5 py-3 rounded-full bg-white/90 backdrop-blur-md border border-orange-200/80 shadow-xl shadow-orange-500/10 flex items-center gap-3"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <Award className="w-5 h-5 text-orange-500" />
              <div>
                <span className="font-black text-lg sm:text-xl text-slate-900 block leading-none">500+</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wider uppercase">Champions</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="lg:col-span-5 order-1 lg:order-2"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs sm:text-sm font-bold mb-4 tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              Who We Are
            </span>

            <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 mb-6 leading-tight tracking-tight">
              {content.heading}
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 font-normal">
              {content.text}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5 mb-8">
              {content.stats.map((stat, i) => {
                const Icon = statIcons[i % statIcons.length];
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all cursor-default"
                    whileHover={{ y: -3 }}
                  >
                    <Icon className="w-5 h-5 text-orange-500 mb-2" />
                    <div className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">{stat.value}</div>
                    <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Button to Full Page */}
            {showButton && (
              <button
                type="button"
                onClick={handleNavigateToAbout}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-orange-500/25 transition-all group cursor-pointer"
              >
                <span>Read Full Academy Story</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
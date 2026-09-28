import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Trainer } from '@/lib/supabase';

const defaultTrainers: Trainer[] = [
  { id: '1', name: 'Master Suresh', specialization: 'Yoga & Meditation', bio: '20+ years of experience in traditional yoga and mindfulness practices.', image_url: null, display_order: 1, created_at: '' },
  { id: '2', name: 'Sensei Ravi', specialization: 'Karate & Defense', bio: '5th Dan Black Belt with international championship coaching experience.', image_url: null, display_order: 2, created_at: '' },
  { id: '3', name: 'Master Li', specialization: 'Kung Fu & Forms', bio: 'Expert in traditional Shaolin Kung Fu with 15+ years of teaching mastery.', image_url: null, display_order: 3, created_at: '' },
  { id: '4', name: 'Coach Priya', specialization: 'Gymnastics & Agility', bio: 'National-level gymnast turned coach with a passion for youth development.', image_url: null, display_order: 4, created_at: '' },
];

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>(defaultTrainers);

  useEffect(() => {
    supabase
      .from('trainers')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setTrainers(data);
      });
  }, []);

  return (
    <section 
      id="trainers" 
      className="relative py-20 md:py-28 overflow-hidden bg-slate-50 text-slate-800"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-bold tracking-wider uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            Academy Faculty
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Meet the <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Expert Coaches</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Dedicated master trainers committed to building championship mindset and athletic excellence.
          </p>
        </motion.div>

        {/* Clean Light-Themed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer, i) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image / Avatar Box */}
                <div className="relative h-60 w-full overflow-hidden bg-gradient-to-b from-orange-50 to-slate-100 flex items-center justify-center">
                  {trainer.image_url ? (
                    <img
                      src={trainer.image_url}
                      alt={trainer.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white border border-orange-200/80 shadow-sm flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                      <User className="w-10 h-10" />
                    </div>
                  )}

                  {/* Specialization Badge */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-orange-200/80 text-orange-600 text-xs font-bold shadow-sm">
                    {trainer.specialization}
                  </div>
                </div>

                {/* Trainer Information */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {trainer.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {trainer.bio}
                  </p>
                </div>
              </div>

              {/* Bottom Coach Credential Strip */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-orange-600">
                <Award className="w-4 h-4 text-orange-500" />
                <span>Certified Academy Coach</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
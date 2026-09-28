import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Testimonial } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

const defaultTestimonials: Testimonial[] = [
  { id: '1', name: 'Rajesh Kumar', rating: 5, text: 'My son has been training here for 2 years. The coaches are excellent and the discipline he has learned is remarkable.', image_url: null, display_order: 1, created_at: '' },
  { id: '2', name: 'Priya Sharma', rating: 5, text: 'The yoga classes have transformed my life. I feel more flexible and peaceful than ever before.', image_url: null, display_order: 2, created_at: '' },
  { id: '3', name: 'Arun Mohan', rating: 5, text: 'Best sports and martial arts academy in Hosur. My daughter earned her black belt here. Highly recommended!', image_url: null, display_order: 3, created_at: '' },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const active = testimonials[current];

  return (
    <section 
      id="testimonials" 
      className="relative py-20 md:py-28 overflow-hidden bg-slate-50 text-slate-800"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-6 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-bold tracking-wider uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            What Our <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Students & Parents Say</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mt-2.5">
            Real stories and feedback from champions and families at Aravind Sports Academy.
          </p>
        </motion.div>

        {/* Carousel Card */}
        <div className="relative">
          <div className="relative min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.id}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full"
              >
                <div className="relative p-7 sm:p-10 md:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50 text-center">
                  
                  {/* Subtle Orange Quote Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-5 text-orange-500">
                    <Quote className="w-6 h-6" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex justify-center gap-1.5 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < active.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-slate-600 text-base sm:text-lg md:text-xl leading-relaxed mb-7 font-normal max-w-2xl mx-auto">
                    "{active.text}"
                  </p>

                  {/* Author / Student Info */}
                  <div className="flex items-center justify-center gap-3">
                    {active.image_url ? (
                      <img
                        src={active.image_url}
                        alt={active.name}
                        loading="lazy"
                        className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/40 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white text-base shadow-sm">
                        {active.name.charAt(0)}
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-bold text-base text-slate-900 leading-snug">{active.name}</div>
                      <div className="text-xs text-slate-400 font-medium">Student / Parent</div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls: Prev, Indicator Dots, Next */}
          <div className="flex items-center justify-center gap-4 mt-7">
            <button
              onClick={goPrev}
              aria-label="Previous Testimonial"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-orange-600 hover:border-orange-300 transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === current ? 'w-7 bg-orange-500' : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              aria-label="Next Testimonial"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-orange-600 hover:border-orange-300 transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
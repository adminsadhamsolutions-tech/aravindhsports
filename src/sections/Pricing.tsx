import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Pricing } from '@/lib/supabase';

const defaultPricing: Pricing[] = [
  { id: '1', program: 'Yoga', price: '800', period: 'month', features: ['3 sessions per week', 'Morning & evening batches', 'Personal guidance', 'Flexible timing'], is_popular: false, display_order: 1, created_at: '' },
  { id: '2', program: 'Karate', price: '1000', period: 'month', features: ['4 sessions per week', 'Belt grading system', 'Self-defense training', 'Competition prep'], is_popular: true, display_order: 2, created_at: '' },
  { id: '3', program: 'Kung Fu', price: '1200', period: 'month', features: ['4 sessions per week', 'Weapons training', 'Forms & sparring', 'Certification program'], is_popular: false, display_order: 3, created_at: '' },
  { id: '4', program: 'Gymnastics', price: '1500', period: 'month', features: ['3 sessions per week', 'Equipment training', 'Flexibility coaching', 'Competition prep'], is_popular: false, display_order: 4, created_at: '' },
];

export default function Pricing() {
  const [plans, setPlans] = useState<Pricing[]>(defaultPricing);

  useEffect(() => {
    supabase
      .from('pricing')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map((d) => ({ ...d, features: Array.isArray(d.features) ? d.features : JSON.parse(d.features || '[]') }));
          setPlans(mapped);
        }
      });
  }, []);

  const scrollToContact = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="pricing" className="relative py-24 md:py-32 overflow-hidden bg-primary">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-accent text-sm font-semibold mb-4">
            PRICING
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Affordable training plans for every discipline. No hidden charges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative p-6 rounded-2xl transition-all duration-500 ${
                plan.is_popular
                  ? 'glass-dark border-2 border-accent/50 glow-accent'
                  : 'glass-dark hover:border-accent/30'
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-accent to-accent-dark text-white text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  POPULAR
                </div>
              )}

              <h3 className="font-display font-bold text-xl text-white mb-2">{plan.program}</h3>
              <div className="mb-6">
                <span className="font-display font-black text-4xl text-white">₹{plan.price}</span>
                <span className="text-white/40 text-sm">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm text-white/60">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={scrollToContact}
                className={`w-full px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  plan.is_popular
                    ? 'bg-gradient-to-r from-accent to-accent-dark text-white glow-accent'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

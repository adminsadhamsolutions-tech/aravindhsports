import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Layers, Image, Star, MessageSquare, TrendingUp, Calendar, UserCog, IndianRupee, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    programs: 0,
    gallery: 0,
    testimonials: 0,
    enquiries: 0,
    schedules: 0,
    trainers: 0,
    pricing: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('programs').select('*', { count: 'exact', head: true }),
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }),
      supabase.from('schedules').select('*', { count: 'exact', head: true }),
      supabase.from('trainers').select('*', { count: 'exact', head: true }),
      supabase.from('pricing').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(5),
    ]).then(([p, g, t, e, s, tr, pr, recent]) => {
      setStats({
        programs: p.count || 0,
        gallery: g.count || 0,
        testimonials: t.count || 0,
        enquiries: e.count || 0,
        schedules: s.count || 0,
        trainers: tr.count || 0,
        pricing: pr.count || 0,
      });
      setRecentEnquiries(recent.data || []);
    });
  }, []);

  const cards = [
    { label: 'Programs', value: stats.programs, icon: Layers, color: 'from-accent to-accent-dark' },
    { label: 'Enquiries', value: stats.enquiries, icon: MessageSquare, color: 'from-green-500 to-green-700' },
    { label: 'Gallery', value: stats.gallery, icon: Image, color: 'from-blue-500 to-blue-700' },
    { label: 'Testimonials', value: stats.testimonials, icon: Star, color: 'from-yellow-500 to-orange-600' },
    { label: 'Schedules', value: stats.schedules, icon: Calendar, color: 'from-purple-500 to-purple-700' },
    { label: 'Trainers', value: stats.trainers, icon: UserCog, color: 'from-cyan-500 to-cyan-700' },
    { label: 'Pricing Plans', value: stats.pricing, icon: IndianRupee, color: 'from-pink-500 to-rose-700' },
  ];

  return (
    <div>
      <h1 className="font-display font-black text-3xl text-white mb-2">Dashboard Overview</h1>
      <p className="text-white/40 mb-8">Welcome back! Here's what's happening with your academy.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl glass-dark hover:border-accent/20 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-display font-black text-3xl text-white">{card.value}</div>
              <div className="text-sm text-white/40 mt-1">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl glass-dark">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h2 className="font-display font-bold text-xl text-white">Recent Enquiries</h2>
        </div>

        {recentEnquiries.length === 0 ? (
          <p className="text-white/30 text-center py-8">No enquiries yet.</p>
        ) : (
          <div className="space-y-3">
            {recentEnquiries.map((enq) => (
              <div key={enq.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white text-sm font-bold">
                      {enq.name.charAt(0)}
                    </div>
                    <span className="font-medium text-white text-sm">{enq.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-xs">{enq.program}</span>
                  </div>
                  <span className="text-xs text-white/30">{new Date(enq.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-white/50 text-sm pl-10">{enq.message || 'No message'}</p>
                <p className="text-accent/70 text-xs pl-10 mt-1">{enq.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

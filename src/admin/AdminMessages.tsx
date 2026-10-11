import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Phone, MessageSquare, User, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Enquiry } from '@/lib/supabase';

export default function AdminMessages() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enquiries:', error);
    } else if (data) {
      setEnquiries(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (!error) {
      loadEnquiries();
    } else {
      alert('Failed to delete message.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/40 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading messages...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-2">Student Enquiries & Messages</h1>
          <p className="text-white/40">Leads submitted from the contact section and WhatsApp forms.</p>
        </div>
        <button
          onClick={loadEnquiries}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Refresh List
        </button>
      </div>

      {enquiries.length === 0 ? (
        <div className="p-16 rounded-3xl glass-dark border border-white/10 text-center">
          <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-white font-bold text-lg">No Messages Yet</h3>
          <p className="text-white/40 text-sm mt-1">New student enquiries submitted from the website will appear here instantly.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq, i) => (
            <motion.div
              key={enq.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-6 rounded-2xl glass-dark border border-white/10 group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {enq.name ? enq.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-base">{enq.name}</h3>
                    <a
                      href={`tel:${enq.phone}`}
                      className="flex items-center gap-1.5 text-accent text-xs font-semibold hover:underline mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5" /> {enq.phone}
                    </a>
                  </div>
                </div>

                {enq.message && (
                  <p className="text-white/70 text-sm bg-white/5 border-l-2 border-accent pl-3 py-1.5 rounded-r-xl max-w-2xl">
                    "{enq.message}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold mb-1">
                    {enq.program || 'General Enquiry'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-white/40">
                    <Calendar className="w-3 h-3" />
                    {enq.created_at ? new Date(enq.created_at).toLocaleString() : 'Recent'}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(enq.id)}
                  className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer"
                  title="Delete Message"
                  aria-label="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
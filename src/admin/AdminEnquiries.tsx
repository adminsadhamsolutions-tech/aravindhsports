import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Phone, MessageSquare, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Enquiry } from '@/lib/supabase';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = () => {
    supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setEnquiries(data);
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    await supabase.from('enquiries').delete().eq('id', id);
    loadEnquiries();
  };

  if (loading) return <div className="text-white/40">Loading...</div>;

  return (
    <div>
      <h1 className="font-display font-black text-3xl text-white mb-2">Enquiries</h1>
      <p className="text-white/40 mb-8">Lead generation enquiries from the website and WhatsApp form.</p>

      {enquiries.length === 0 ? (
        <div className="p-12 rounded-2xl glass-dark text-center">
          <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/30">No enquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq, i) => (
            <motion.div
              key={enq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl glass-dark group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold">
                    {enq.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white">{enq.name}</h3>
                    <a href={`tel:${enq.phone}`} className="flex items-center gap-1 text-accent text-sm hover:text-accent-light">
                      <Phone className="w-3.5 h-3.5" /> {enq.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">{enq.program}</span>
                  <span className="text-xs text-white/30">{new Date(enq.created_at).toLocaleString()}</span>
                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {enq.message && (
                <p className="text-white/50 text-sm border-l-2 border-accent/20 pl-4 mt-2">{enq.message}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

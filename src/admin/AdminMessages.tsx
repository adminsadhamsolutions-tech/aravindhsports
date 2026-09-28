import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Phone, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ContactMessage } from '@/lib/supabase';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setMessages(data);
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    loadMessages();
  };

  if (loading) return <div className="text-white/40">Loading...</div>;

  return (
    <div>
      <h1 className="font-display font-black text-3xl text-white mb-2">Messages</h1>
      <p className="text-white/40 mb-8">Contact form submissions from website visitors.</p>

      {messages.length === 0 ? (
        <div className="p-12 rounded-2xl glass-dark text-center">
          <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/30">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl glass-dark group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white">{msg.name}</h3>
                    <a href={`tel:${msg.phone}`} className="flex items-center gap-1 text-accent text-sm hover:text-accent-light">
                      <Phone className="w-3.5 h-3.5" /> {msg.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30">{new Date(msg.created_at).toLocaleString()}</span>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {msg.message && (
                <p className="text-white/50 text-sm pl-13 mt-2 border-l-2 border-accent/20 pl-4">
                  {msg.message}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Loader2, X, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Testimonial } from '@/lib/supabase';

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data);
        setLoading(false);
      });
  };

  const handleSave = async () => {
    if (!editing || !editing.name) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from('testimonials').update({
        name: editing.name,
        rating: editing.rating,
        text: editing.text,
        image_url: editing.image_url,
        display_order: editing.display_order,
      }).eq('id', editing.id);
    } else {
      await supabase.from('testimonials').insert({
        name: editing.name,
        rating: editing.rating,
        text: editing.text,
        image_url: editing.image_url,
        display_order: editing.display_order || items.length + 1,
      });
    }
    setSaving(false);
    setEditing(null);
    loadItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    loadItems();
  };

  if (loading) return <div className="text-white/40">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-2">Testimonials</h1>
          <p className="text-white/40">Manage student and parent testimonials.</p>
        </div>
        <button
          onClick={() => setEditing({ id: '', name: '', rating: 5, text: '', image_url: '', display_order: items.length + 1, created_at: '' })}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold"
        >
          <Plus className="w-5 h-5" /> Add Testimonial
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl glass-dark flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold shrink-0">
              {item.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-display font-bold text-white">{item.name}</h3>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'text-accent fill-accent' : 'text-white/20'}`} />
                  ))}
                </div>
              </div>
              <p className="text-white/40 text-sm line-clamp-2">{item.text}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => setEditing(item)} className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-accent">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg p-8 rounded-3xl glass-dark"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-white">{editing.id ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Name</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setEditing({ ...editing, rating: n })}
                        className="p-2"
                      >
                        <Star className={`w-6 h-6 ${n <= editing.rating ? 'text-accent fill-accent' : 'text-white/20'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Testimonial Text</label>
                  <textarea
                    value={editing.text}
                    onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Image URL (optional)</label>
                  <input
                    type="text"
                    value={editing.image_url || ''}
                    onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={editing.display_order}
                    onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving || !editing.name}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

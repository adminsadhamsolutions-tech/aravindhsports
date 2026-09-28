import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Loader2, X, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Trainer } from '@/lib/supabase';

const emptyTrainer: Trainer = {
  id: '', name: '', specialization: '', image_url: null, bio: '', display_order: 0, created_at: '',
};

export default function AdminTrainers() {
  const [items, setItems] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    supabase.from('trainers').select('*').order('display_order', { ascending: true }).then(({ data }) => {
      if (data) setItems(data);
      setLoading(false);
    });
  };

  const handleSave = async () => {
    if (!editing || !editing.name) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from('trainers').update({
        name: editing.name, specialization: editing.specialization, image_url: editing.image_url,
        bio: editing.bio, display_order: editing.display_order,
      }).eq('id', editing.id);
    } else {
      await supabase.from('trainers').insert({
        name: editing.name, specialization: editing.specialization, image_url: editing.image_url,
        bio: editing.bio, display_order: editing.display_order || items.length + 1,
      });
    }
    setSaving(false);
    setEditing(null);
    loadItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trainer?')) return;
    await supabase.from('trainers').delete().eq('id', id);
    loadItems();
  };

  if (loading) return <div className="text-white/40">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-2">Trainers</h1>
          <p className="text-white/40">Manage trainer profiles shown on the website.</p>
        </div>
        <button onClick={() => setEditing({ ...emptyTrainer })}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold">
          <Plus className="w-5 h-5" /> Add Trainer
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((trainer) => (
          <motion.div key={trainer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl glass-dark group">
            <div className="flex items-start gap-4">
              {trainer.image_url ? (
                <img src={trainer.image_url} alt={trainer.name} className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                  <User className="w-8 h-8 text-accent" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-white">{trainer.name}</h3>
                <p className="text-accent text-sm">{trainer.specialization}</p>
                <p className="text-white/40 text-xs mt-1 line-clamp-2">{trainer.bio}</p>
              </div>
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(trainer)} className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-accent"><Save className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(trainer.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg p-8 rounded-3xl glass-dark" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-white">{editing.id ? 'Edit Trainer' : 'New Trainer'}</h2>
                <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Name</label>
                  <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Specialization</label>
                  <input type="text" value={editing.specialization} onChange={(e) => setEditing({ ...editing, specialization: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" placeholder="e.g. Yoga & Meditation" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Image URL (optional)</label>
                  <input type="text" value={editing.image_url || ''} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" placeholder="https://..." />
                  {editing.image_url && <img src={editing.image_url} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-xl" />}
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Bio</label>
                  <textarea value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Display Order</label>
                  <input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" />
                </div>
                <button onClick={handleSave} disabled={saving || !editing.name}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
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

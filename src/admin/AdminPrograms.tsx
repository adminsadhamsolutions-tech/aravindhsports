import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Loader2, X, GripVertical } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Program } from '@/lib/supabase';

const iconOptions = ['Flower2', 'Swords', 'Zap', 'Target', 'PersonStanding', 'Music', 'Crosshair', 'Activity', 'Dumbbell', 'Trophy', 'Medal', 'Flame'];

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Program | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = () => {
    supabase
      .from('programs')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data) setPrograms(data);
        setLoading(false);
      });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from('programs').update({
        title: editing.title,
        description: editing.description,
        icon: editing.icon,
        image_url: editing.image_url,
        display_order: editing.display_order,
      }).eq('id', editing.id);
    } else {
      await supabase.from('programs').insert({
        title: editing.title,
        description: editing.description,
        icon: editing.icon,
        image_url: editing.image_url,
        display_order: editing.display_order || programs.length + 1,
      });
    }
    setSaving(false);
    setEditing(null);
    loadPrograms();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this program?')) return;
    await supabase.from('programs').delete().eq('id', id);
    loadPrograms();
  };

  if (loading) return <div className="text-white/40">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-2">Programs</h1>
          <p className="text-white/40">Manage training programs offered by the academy.</p>
        </div>
        <button
          onClick={() => setEditing({ id: '', title: '', description: '', icon: 'Activity', image_url: '', display_order: programs.length + 1, created_at: '' })}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold"
        >
          <Plus className="w-5 h-5" /> Add Program
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((program) => {
          const Icon = (Icons as any)[program.icon] || Icons.Activity;
          return (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl glass-dark group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditing(program)}
                    className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-accent"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-1">{program.title}</h3>
              <p className="text-white/40 text-sm line-clamp-2">{program.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Edit modal */}
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
                <h2 className="font-display font-bold text-xl text-white">
                  {editing.id ? 'Edit Program' : 'New Program'}
                </h2>
                <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Title</label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Description</label>
                  <textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Icon</label>
                  <div className="grid grid-cols-6 gap-2">
                    {iconOptions.map((name) => {
                      const Icon = (Icons as any)[name];
                      return (
                        <button
                          key={name}
                          onClick={() => setEditing({ ...editing, icon: name })}
                          className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                            editing.icon === name
                              ? 'bg-accent/20 border border-accent/50 text-accent'
                              : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
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
                  disabled={saving}
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

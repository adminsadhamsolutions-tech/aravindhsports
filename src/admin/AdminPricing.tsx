import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Loader2, X, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Pricing } from '@/lib/supabase';

const emptyPricing: Pricing = {
  id: '', program: '', price: '0', period: 'month', features: [], is_popular: false, display_order: 0, created_at: '',
};

export default function AdminPricing() {
  const [items, setItems] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Pricing | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    supabase.from('pricing').select('*').order('display_order', { ascending: true }).then(({ data }) => {
      if (data) {
        const mapped = data.map((d: any) => ({
          ...d,
          features: Array.isArray(d.features) ? d.features : JSON.parse(d.features || '[]'),
        }));
        setItems(mapped);
      }
      setLoading(false);
    });
  };

  const handleSave = async () => {
    if (!editing || !editing.program) return;
    setSaving(true);
    const payload = {
      program: editing.program, price: editing.price, period: editing.period,
      features: editing.features, is_popular: editing.is_popular, display_order: editing.display_order,
    };
    if (editing.id) {
      await supabase.from('pricing').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('pricing').insert({ ...payload, display_order: editing.display_order || items.length + 1 });
    }
    setSaving(false);
    setEditing(null);
    loadItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this pricing plan?')) return;
    await supabase.from('pricing').delete().eq('id', id);
    loadItems();
  };

  const updateFeature = (index: number, value: string) => {
    if (!editing) return;
    const features = [...editing.features];
    features[index] = value;
    setEditing({ ...editing, features });
  };

  const addFeature = () => {
    if (!editing) return;
    setEditing({ ...editing, features: [...editing.features, ''] });
  };

  const removeFeature = (index: number) => {
    if (!editing) return;
    setEditing({ ...editing, features: editing.features.filter((_, i) => i !== index) });
  };

  if (loading) return <div className="text-white/40">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-2">Pricing</h1>
          <p className="text-white/40">Manage pricing plans for programs.</p>
        </div>
        <button onClick={() => setEditing({ ...emptyPricing, features: [] })}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold">
          <Plus className="w-5 h-5" /> Add Plan
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((plan) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl glass-dark group relative ${plan.is_popular ? 'border-2 border-accent/40' : ''}`}>
            {plan.is_popular && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent text-white text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" /> POPULAR
              </div>
            )}
            <h3 className="font-display font-bold text-white text-lg">{plan.program}</h3>
            <div className="my-3">
              <span className="font-display font-black text-2xl text-white">₹{plan.price}</span>
              <span className="text-white/40 text-sm">/{plan.period}</span>
            </div>
            <ul className="space-y-1 mb-4">
              {plan.features.slice(0, 3).map((f, i) => (
                <li key={i} className="text-white/50 text-xs">• {f}</li>
              ))}
            </ul>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditing(plan)} className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-accent"><Save className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(plan.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
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
              className="w-full max-w-lg p-8 rounded-3xl glass-dark max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-white">{editing.id ? 'Edit Plan' : 'New Plan'}</h2>
                <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Program</label>
                  <input type="text" value={editing.program} onChange={(e) => setEditing({ ...editing, program: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" placeholder="e.g. Yoga" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Price (₹)</label>
                    <input type="text" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" placeholder="800" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Period</label>
                    <input type="text" value={editing.period} onChange={(e) => setEditing({ ...editing, period: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" placeholder="month" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-white/60">Features</label>
                    <button onClick={addFeature} className="text-accent text-sm hover:text-accent-light flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
                  </div>
                  <div className="space-y-2">
                    {editing.features.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={f} onChange={(e) => updateFeature(i, e.target.value)}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-accent focus:outline-none transition-colors" placeholder="Feature description" />
                        <button onClick={() => removeFeature(i)} className="p-2 rounded-lg bg-red-500/10 text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={editing.is_popular} onChange={(e) => setEditing({ ...editing, is_popular: e.target.checked })}
                      className="w-5 h-5 rounded accent-accent" />
                    <span className="text-sm text-white/60">Mark as Popular (highlighted on website)</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Display Order</label>
                  <input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" />
                </div>
                <button onClick={handleSave} disabled={saving || !editing.program}
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

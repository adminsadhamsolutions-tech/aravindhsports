import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Loader2, X, Calendar, Clock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Schedule } from '@/lib/supabase';

const emptySchedule: Schedule = {
  id: '', program: '', time_slot: '', days: '', trainer_name: '', display_order: 0, created_at: '',
};

export default function AdminSchedules() {
  const [items, setItems] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    supabase.from('schedules').select('*').order('display_order', { ascending: true }).then(({ data }) => {
      if (data) setItems(data);
      setLoading(false);
    });
  };

  const handleSave = async () => {
    if (!editing || !editing.program || !editing.time_slot) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from('schedules').update({
        program: editing.program, time_slot: editing.time_slot, days: editing.days,
        trainer_name: editing.trainer_name, display_order: editing.display_order,
      }).eq('id', editing.id);
    } else {
      await supabase.from('schedules').insert({
        program: editing.program, time_slot: editing.time_slot, days: editing.days,
        trainer_name: editing.trainer_name, display_order: editing.display_order || items.length + 1,
      });
    }
    setSaving(false);
    setEditing(null);
    loadItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this schedule entry?')) return;
    await supabase.from('schedules').delete().eq('id', id);
    loadItems();
  };

  if (loading) return <div className="text-white/40">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-2">Class Schedule</h1>
          <p className="text-white/40">Manage weekly class timings and trainers.</p>
        </div>
        <button
          onClick={() => setEditing({ ...emptySchedule })}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold"
        >
          <Plus className="w-5 h-5" /> Add Schedule
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl glass-dark">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-sm font-semibold text-accent">Program</th>
              <th className="text-left p-4 text-sm font-semibold text-accent">Time</th>
              <th className="text-left p-4 text-sm font-semibold text-accent">Days</th>
              <th className="text-left p-4 text-sm font-semibold text-accent">Trainer</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="p-4 font-medium text-white">{s.program}</td>
                <td className="p-4 text-white/60 text-sm">{s.time_slot}</td>
                <td className="p-4 text-white/60 text-sm">{s.days}</td>
                <td className="p-4 text-white/60 text-sm">{s.trainer_name}</td>
                <td className="p-4 text-right">
                  <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditing(s)} className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-accent"><Save className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg p-8 rounded-3xl glass-dark" onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-white">{editing.id ? 'Edit Schedule' : 'New Schedule'}</h2>
                <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Program</label>
                  <input type="text" value={editing.program} onChange={(e) => setEditing({ ...editing, program: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" placeholder="e.g. Yoga" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Time Slot</label>
                  <input type="text" value={editing.time_slot} onChange={(e) => setEditing({ ...editing, time_slot: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" placeholder="e.g. 6:00 AM - 7:30 AM" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Days</label>
                  <input type="text" value={editing.days} onChange={(e) => setEditing({ ...editing, days: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" placeholder="e.g. Mon, Wed, Fri" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Trainer Name</label>
                  <input type="text" value={editing.trainer_name} onChange={(e) => setEditing({ ...editing, trainer_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" placeholder="e.g. Master Suresh" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Display Order</label>
                  <input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors" />
                </div>
                <button onClick={handleSave} disabled={saving || !editing.program || !editing.time_slot}
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

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Stat = { label: string; value: string };

export default function AdminAbout() {
  const [content, setContent] = useState({
    heading: 'About Our Academy',
    text: '',
    stats: [] as Stat[],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('value')
      .eq('key', 'about')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setContent({ ...content, ...data.value });
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from('site_content')
      .upsert({ key: 'about', value: content }, { onConflict: 'key' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="text-white/40">Loading...</div>;

  return (
    <div>
      <h1 className="font-display font-black text-3xl text-white mb-2">About Section</h1>
      <p className="text-white/40 mb-8">Edit the about content and statistics.</p>

      <div className="max-w-2xl space-y-5">
        <div>
          <label className="block text-sm text-white/60 mb-2">Heading</label>
          <input
            type="text"
            value={content.heading}
            onChange={(e) => setContent({ ...content, heading: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Description</label>
          <textarea
            value={content.text}
            onChange={(e) => setContent({ ...content, text: e.target.value })}
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Stats editor */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm text-white/60">Statistics</label>
            <button
              onClick={() => setContent({ ...content, stats: [...content.stats, { label: '', value: '' }] })}
              className="flex items-center gap-1 text-accent text-sm hover:text-accent-light"
            >
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          </div>
          <div className="space-y-3">
            {content.stats.map((stat, i) => (
              <div key={i} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Value (e.g. 500+)"
                  value={stat.value}
                  onChange={(e) => {
                    const stats = [...content.stats];
                    stats[i] = { ...stat, value: e.target.value };
                    setContent({ ...content, stats });
                  }}
                  className="w-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Students Trained)"
                  value={stat.label}
                  onChange={(e) => {
                    const stats = [...content.stats];
                    stats[i] = { ...stat, label: e.target.value };
                    setContent({ ...content, stats });
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
                />
                <button
                  onClick={() => setContent({ ...content, stats: content.stats.filter((_, idx) => idx !== i) })}
                  className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold flex items-center gap-2 disabled:opacity-60"
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>
    </div>
  );
}

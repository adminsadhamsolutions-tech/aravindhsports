import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminHero() {
  const [content, setContent] = useState({
    heading: 'Train Like a Champion',
    subtext: 'Yoga, Martial Arts & Sports Training in Hosur',
    primary_button: 'Join Now',
    secondary_button: 'Call Now',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('value')
      .eq('key', 'hero')
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
      .upsert({ key: 'hero', value: content }, { onConflict: 'key' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="text-white/40">Loading...</div>;

  return (
    <div>
      <h1 className="font-display font-black text-3xl text-white mb-2">Hero Section</h1>
      <p className="text-white/40 mb-8">Edit the main banner content visitors see first.</p>

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
          <label className="block text-sm text-white/60 mb-2">Subtext</label>
          <input
            type="text"
            value={content.subtext}
            onChange={(e) => setContent({ ...content, subtext: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Primary Button</label>
            <input
              type="text"
              value={content.primary_button}
              onChange={(e) => setContent({ ...content, primary_button: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Secondary Button</label>
            <input
              type="text"
              value={content.secondary_button}
              onChange={(e) => setContent({ ...content, secondary_button: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
            />
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

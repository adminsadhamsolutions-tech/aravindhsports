import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminContact() {
  const [content, setContent] = useState({
    phone: '+91 98948 28541',
    address: 'Hosur, Tamil Nadu, India',
    email: 'info@dynamicsportsacademy.in',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('value')
      .eq('key', 'contact')
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
      .upsert({ key: 'contact', value: content }, { onConflict: 'key' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="text-white/40">Loading...</div>;

  return (
    <div>
      <h1 className="font-display font-black text-3xl text-white mb-2">Contact Information</h1>
      <p className="text-white/40 mb-8">Update the contact details shown on the website.</p>

      <div className="max-w-2xl space-y-5">
        <div>
          <label className="block text-sm text-white/60 mb-2">Phone Number</label>
          <input
            type="text"
            value={content.phone}
            onChange={(e) => setContent({ ...content, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Address</label>
          <input
            type="text"
            value={content.address}
            onChange={(e) => setContent({ ...content, address: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Email</label>
          <input
            type="email"
            value={content.email}
            onChange={(e) => setContent({ ...content, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
          />
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

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Loader2, X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { GalleryImage } from '@/lib/supabase';

// Standard 8 Programs as Main Categories
const STANDARD_CATEGORIES = [
  'Yoga',
  'Karate',
  'Kung Fu',
  'Taekwondo',
  'Gymnastics',
  'Archery',
  'Dance',
  'Air Gun Training',
];

// Standard Sub-categories mapping for each main category
const STANDARD_SUB_CATEGORIES: Record<string, string[]> = {
  Yoga: ['Kids Yoga', 'Elders Yoga', 'Hatha Yoga', 'Power Yoga', 'General'],
  Karate: ['Kata', 'Kumite', 'Self Defense', 'Belt Training', 'General'],
  'Kung Fu': ['Forms', 'Weapons', 'Sparring', 'General'],
  Taekwondo: ['Poomsae', 'Kyorugi', 'Kicks', 'General'],
  Gymnastics: ['Floor Exercise', 'Balance Beam', 'Vault', 'Flexibility', 'General'],
  Archery: ['Target Practice', 'Outdoor Archery', 'Youth Archery', 'General'],
  Dance: ['Classical', 'Western', 'Folk', 'General'],
  'Air Gun Training': ['Precision Shooting', 'Target Focus', 'General'],
  Training: ['General'],
  Events: ['General'],
};

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data) setImages(data);
        setLoading(false);
      });
  };

  // Get available sub-categories for currently selected editing category
  const currentSubCategories = editing?.category
    ? STANDARD_SUB_CATEGORIES[editing.category] || ['General']
    : ['General'];

  // Handle Cloudinary Single/Bulk Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const newImagesData = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          newImagesData.push({
            title: file.name.substring(0, file.name.lastIndexOf('.')) || 'Gallery Image',
            image_url: data.secure_url,
            category: editing?.category || 'Yoga',
            sub_category: editing?.sub_category || 'General',
            display_order: images.length + i + 1,
          });
        }
      } catch (err) {
        console.error('Upload failed for file:', file.name, err);
      }
    }

    if (newImagesData.length > 0) {
      await supabase.from('gallery').insert(newImagesData);
      loadImages();
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!editing || !editing.image_url) return;
    setSaving(true);

    const payload = {
      title: editing.title || 'Gallery Image',
      image_url: editing.image_url,
      category: editing.category || 'Yoga',
      sub_category: editing.sub_category || 'General',
      display_order: Number(editing.display_order) || images.length + 1,
    };

    if (editing.id) {
      const { error } = await supabase.from('gallery').update(payload).eq('id', editing.id);
      if (error) console.error('Update error:', error);
    } else {
      const { error } = await supabase.from('gallery').insert(payload);
      if (error) console.error('Insert error:', error);
    }

    setSaving(false);
    setEditing(null);
    loadImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    await supabase.from('gallery').delete().eq('id', id);
    loadImages();
  };

  if (loading) return <div className="text-white/40">Loading gallery manager...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-2">Gallery Management</h1>
          <p className="text-white/40">Manage standard program categories, sub-categories, and gallery photos.</p>
        </div>
        <button
          onClick={() =>
            setEditing({
              id: '',
              title: '',
              image_url: '',
              category: 'Yoga',
              sub_category: 'General',
              display_order: images.length + 1,
            })
          }
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Add Image
        </button>
      </div>

      {/* Grid of existing images */}
      <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img: any) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative rounded-2xl overflow-hidden glass-dark border border-white/10"
          >
            <img src={img.image_url} alt={img.title} className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded text-[10px] bg-accent text-white font-bold">{img.category}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-white/20 text-white">{img.sub_category || 'General'}</span>
              </div>
              <div>
                <div className="text-white text-sm font-medium truncate">{img.title}</div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setEditing({ ...img })}
                    className="px-3 py-1.5 rounded-lg bg-white/25 text-white text-xs font-bold cursor-pointer hover:bg-white/40"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 cursor-pointer hover:bg-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg p-8 rounded-3xl glass-dark border border-white/10 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-white">
                  {editing.id ? 'Edit Image Details' : 'Add Image / Bulk Upload'}
                </h2>
                <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Bulk/Single File Upload (Only for new entries) */}
                {!editing.id && (
                  <div className="p-5 rounded-xl border-2 border-dashed border-white/20 text-center bg-white/5">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="bulk-upload"
                    />
                    <label htmlFor="bulk-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                      ) : (
                        <Upload className="w-8 h-8 text-accent" />
                      )}
                      <span className="text-sm text-white font-medium">
                        {uploading ? 'Uploading to Cloudinary...' : 'Click to Upload Images'}
                      </span>
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-white/60 mb-1">Title</label>
                  <input
                    type="text"
                    value={editing.title || ''}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editing.image_url || ''}
                    onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none"
                    placeholder="https://..."
                  />
                  {editing.image_url && (
                    <img src={editing.image_url} alt="Preview" className="mt-3 w-full h-36 object-cover rounded-xl" />
                  )}
                </div>

                {/* Main Category Dropdown (Standard Programs) */}
                <div>
                  <label className="block text-sm text-white/60 mb-1">Main Category (Program)</label>
                  <select
                    value={editing.category || 'Yoga'}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const defaultSub = (STANDARD_SUB_CATEGORIES[newCat] || ['General'])[0];
                      setEditing({ ...editing, category: newCat, sub_category: defaultSub });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-accent focus:outline-none"
                  >
                    {STANDARD_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-Category Dropdown (Dynamic based on selected category) */}
                <div>
                  <label className="block text-sm text-white/60 mb-1">Sub-Category</label>
                  <select
                    value={editing.sub_category || 'General'}
                    onChange={(e) => setEditing({ ...editing, sub_category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:border-accent focus:outline-none"
                  >
                    {currentSubCategories.map((sub) => (
                      <option key={sub} value={sub} className="bg-slate-900 text-white">
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editing.display_order || 0}
                    onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving || !editing.image_url}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
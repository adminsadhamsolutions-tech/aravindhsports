import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Loader2, X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { GalleryImage } from '@/lib/supabase';

const defaultCategories = ['Training', 'Martial Arts', 'Yoga', 'Events'];

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Dynamic list of categories gathered from existing images + defaults
  const categories = Array.from(
    new Set([...defaultCategories, ...images.map((img) => img.category)])
  );

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
            category: editing?.category || 'Training',
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
    if (editing.id) {
      await supabase.from('gallery').update({
        title: editing.title,
        image_url: editing.image_url,
        category: editing.category,
        display_order: editing.display_order,
      }).eq('id', editing.id);
    } else {
      await supabase.from('gallery').insert({
        title: editing.title,
        image_url: editing.image_url,
        category: editing.category,
        display_order: editing.display_order || images.length + 1,
      });
    }
    setSaving(false);
    setEditing(null);
    loadImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    await supabase.from('gallery').delete().eq('id', id);
    loadImages();
  };

  if (loading) return <div className="text-white/40">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-2">Gallery</h1>
          <p className="text-white/40">Manage gallery images shown on the website.</p>
        </div>
        <button
          onClick={() => setEditing({ id: '', title: '', image_url: '', category: 'Training', display_order: images.length + 1, created_at: '' })}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Add Image
        </button>
      </div>

      <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative rounded-2xl overflow-hidden glass-dark"
          >
            <img src={img.image_url} alt={img.title} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <div>
                <div className="text-white text-sm font-medium">{img.title}</div>
                <div className="text-accent text-xs">{img.category}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(img)} className="p-2 rounded-lg bg-white/10 text-white cursor-pointer">
                  <Save className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(img.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
              className="w-full max-w-lg p-8 rounded-3xl glass-dark max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-white">
                  {editing.id ? 'Edit Image' : 'Add Image / Bulk Upload'}
                </h2>
                <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Bulk/Single File Upload Field */}
                {!editing.id && (
                  <div className="p-4 rounded-xl border-2 border-dashed border-white/20 text-center">
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
                        {uploading ? 'Uploading to Cloudinary...' : 'Click to Upload Single or Multiple Images'}
                      </span>
                    </label>
                  </div>
                )}

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
                  <label className="block text-sm text-white/60 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={editing.image_url}
                    onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
                    placeholder="https://..."
                  />
                  {editing.image_url && (
                    <img src={editing.image_url} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-xl" />
                  )}
                </div>

                {/* Category Dropdown + Free Typing Input */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Category (Select or Type New)</label>
                  <input
                    type="text"
                    list="category-list"
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
                    placeholder="Type or select category..."
                  />
                  <datalist id="category-list">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
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
                  disabled={saving || !editing.image_url}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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
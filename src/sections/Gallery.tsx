import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ArrowRight, ChevronDown } from 'lucide-react';
import type { GalleryImage } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

// Standard 8 Main Categories to always display
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

const STANDARD_SUB_CATEGORIES: Record<string, string[]> = {
  Yoga: ['Kids Yoga', 'Elders Yoga', 'Hatha Yoga', 'Power Yoga', 'General'],
  Karate: ['Kata', 'Kumite', 'Self Defense', 'Belt Training', 'General'],
  'Kung Fu': ['Forms', 'Weapons', 'Sparring', 'General'],
  Taekwondo: ['Poomsae', 'Kyorugi', 'Kicks', 'General'],
  Gymnastics: ['Floor Exercise', 'Balance Beam', 'Vault', 'Flexibility', 'General'],
  Archery: ['Target Practice', 'Outdoor Archery', 'Youth Archery', 'General'],
  Dance: ['Classical', 'Western', 'Folk', 'General'],
  'Air Gun Training': ['Precision Shooting', 'Target Focus', 'General'],
};

export default function Gallery({ showButton = true }: { showButton?: boolean }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setImages(data);
        }
      });
  }, []);

  // Main Categories list starting with 'All'
  const categories = useMemo(() => {
    return ['All', ...STANDARD_CATEGORIES];
  }, []);

  // Sub-categories list for active category
  const subCategories = useMemo(() => {
    if (activeCategory === 'All') return [];
    const subs = STANDARD_SUB_CATEGORIES[activeCategory] || ['General'];
    return ['All', ...subs];
  }, [activeCategory]);

  // Filtered images based on selection
  const filtered = useMemo(() => {
    return images.filter((img: any) => {
      const matchCat = activeCategory === 'All' || img.category === activeCategory;
      const matchSub = activeSubCategory === 'All' || (img.sub_category || 'General') === activeSubCategory;
      return matchCat && matchSub;
    });
  }, [images, activeCategory, activeSubCategory]);

  const displayedImages = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubCategory('All');
    setVisibleCount(8);
  };

  const handleOpenGalleryPage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.history.pushState({}, '', '/gallery');
    window.dispatchEvent(new Event('pushstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <section id="gallery" className="relative py-24 md:py-32 overflow-hidden bg-primary-dark">
      <div className="absolute inset-0 grid-pattern opacity-15" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-accent text-sm font-semibold mb-4">
            GALLERY
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Moments of <span className="gradient-text">Excellence</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Explore our training programs, martial arts, yoga sessions, and championships.
          </p>
        </motion.div>

        {/* Main Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-start md:justify-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-none px-2"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? 'bg-accent text-white glow-accent'
                  : 'glass text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Sub-Category Filter Pills */}
        {subCategories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-start md:justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none px-2"
          >
            <span className="text-white/40 text-xs uppercase tracking-wider mr-2">Filter Sub:</span>
            {subCategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  setActiveSubCategory(sub);
                  setVisibleCount(8);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeSubCategory === sub
                    ? 'bg-white text-primary-dark font-bold'
                    : 'bg-white/5 text-white/50 hover:text-white border border-white/10'
                }`}
              >
                {sub}
              </button>
            ))}
          </motion.div>
        )}

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
          {displayedImages.map((img: any, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.1 }}
              className="group relative overflow-hidden rounded-2xl glass-dark cursor-pointer h-52 sm:h-64 md:h-72 border border-white/10"
              onClick={() => setLightbox(img.image_url)}
            >
              <img
                src={img.image_url}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <div className="text-accent text-xs font-semibold">{img.sub_category || img.category}</div>
                  <div className="text-white text-sm font-bold">{img.title}</div>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-12">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full glass text-white font-semibold text-sm hover:bg-white/10 transition-all cursor-pointer border border-white/10"
            >
              <span>Load More</span>
              <ChevronDown className="w-4 h-4 text-accent" />
            </button>
          </div>
        )}

        {/* View Full Gallery Page Button */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-16"
          >
            <motion.button
              type="button"
              onClick={handleOpenGalleryPage}
              className="relative inline-flex items-center gap-2 px-10 py-4 rounded-full overflow-hidden text-white font-extrabold text-base tracking-wider uppercase cursor-pointer shadow-lg shadow-orange-500/45"
              style={{
                backgroundColor: '#f97316',
                backgroundImage: 'linear-gradient(135deg, #FF6B00 0%, #FF8C38 50%, #ea580c 100%)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">View Full Gallery</span>
              <ArrowRight className="relative z-10 w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-dark/95 backdrop-blur-md p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label="Close image preview"
              className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:text-accent transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={lightbox}
              alt="Gallery preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
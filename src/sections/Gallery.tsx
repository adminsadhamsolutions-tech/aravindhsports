import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ArrowRight, ChevronDown } from 'lucide-react';
import type { GalleryImage } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

const placeholderImages = [
  'https://images.pexels.com/photos/704554/pexels-photo-704554.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/28080/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8637912/pexels-photo-8637912.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4046718/pexels-photo-4046718.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4498574/pexels-photo-4498574.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const placeholderCats = ['Training', 'Martial Arts', 'Yoga', 'Events'];

export default function Gallery({ showButton = true }: { showButton?: boolean }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8); // 8 items: 4 rows on mobile (2 cols), 2 rows on desktop (4 cols)

  useEffect(() => {
    supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setImages(data);
        } else {
          const seeded: GalleryImage[] = placeholderImages.map((url, i) => ({
            id: `seed-${i}`,
            title: `Gallery ${i + 1}`,
            image_url: url,
            category: placeholderCats[i % placeholderCats.length],
            display_order: i,
            created_at: '',
          }));
          setImages(seeded);
        }
      });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(images.map((img) => img.category));
    return ['All', ...Array.from(cats)];
  }, [images]);

  // Filter images first based on category
  const filtered = useMemo(() => {
    return activeCategory === 'All' ? images : images.filter((img) => img.category === activeCategory);
  }, [images, activeCategory]);

  // Then limit the displayed items according to visibleCount
  const displayedImages = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(8); // Reset back to initial 8 items on category switch
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
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-accent text-sm font-semibold mb-4">
            GALLERY
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Moments of <span className="gradient-text">Excellence</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Glimpses of our champions in training and competition.
          </p>
        </motion.div>

        {/* Category filter with horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-start md:justify-center gap-3 mb-10 overflow-x-auto pb-3 scrollbar-none px-2"
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

        {/* Responsive Grid: 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
          {displayedImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.1 }}
              className="group relative overflow-hidden rounded-2xl glass-dark cursor-pointer h-52 sm:h-64 md:h-72"
              onClick={() => setLightbox(img.image_url)}
            >
              <img
                src={img.image_url}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button - Only shows if there are more filtered images left to display */}
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

        {/* Bottom Button to View Full Gallery Page */}
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
              whileHover={{ scale: 1.05, boxShadow: '0 10px 38px rgba(249, 115, 22, 0.65)' }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                  width: '50%',
                  transform: 'skewX(-25deg)',
                }}
                animate={{ left: ['-120%', '220%'] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatDelay: 0.8,
                }}
              />
              <span className="relative z-10 drop-shadow-sm">View Full Gallery</span>
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
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
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
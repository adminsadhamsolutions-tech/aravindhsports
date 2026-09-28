import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ScrollProgress from '@/components/ScrollProgress';
import Loader from '@/components/Loader';
import Hero from '@/sections/Hero';
import { SectionSkeleton } from '@/components/Skeletons';

const AboutFullPage = lazy(() => import('@/pages/AboutFullPage'));
const ProgramsFullPage = lazy(() => import('@/pages/ProgramsFullPage'));
const GalleryFullPage = lazy(() => import('@/pages/GalleryFullPage'));
const ContactFullPage = lazy(() => import('@/pages/ContactFullPage'));

const About = lazy(() => import('@/sections/About'));
const Programs = lazy(() => import('@/sections/Programs'));
const Gallery = lazy(() => import('@/sections/Gallery'));
const Testimonials = lazy(() => import('@/sections/Testimonials'));
const Contact = lazy(() => import('@/sections/Contact'));
const Schedule = lazy(() => import('@/sections/Schedule'));
const Trainers = lazy(() => import('@/sections/Trainers'));
const Pricing = lazy(() => import('@/sections/Pricing'));

const AdminLogin = lazy(() => import('@/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/admin/AdminDashboard'));

function AppContent() {
  const { session, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => setRoute(window.location.pathname);

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (route === '/' && window.location.hash) {
      const timer = setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [route]);

  const isAdmin = route.startsWith('/admin');
  const isAboutPage = route === '/about' || route === '/about/';
  const isProgramsPage = route === '/programs' || route === '/programs/';
  const isGalleryPage = route === '/gallery' || route === '/gallery/';
  const isContactPage = route === '/contact' || route === '/contact/';

  if (loading && !showLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 1. Admin Route
  if (isAdmin) {
    return (
      <AnimatePresence mode="wait">
        {showLoader ? (
          <Loader key="loader" />
        ) : (
          <Suspense key="admin" fallback={<div className="min-h-screen flex items-center justify-center bg-primary-dark"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
            {session ? <AdminDashboard /> : <AdminLogin />}
          </Suspense>
        )}
      </AnimatePresence>
    );
  }

  // 2. Full About Page (/about)
  if (isAboutPage) {
    return (
      <AnimatePresence mode="wait">
        {showLoader ? (
          <Loader key="loader" />
        ) : (
          <motion.div
            key="about-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<SectionSkeleton />}>
              <AboutFullPage />
            </Suspense>
            <WhatsAppButton />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // 3. Full Programs Page (/programs)
  if (isProgramsPage) {
    return (
      <AnimatePresence mode="wait">
        {showLoader ? (
          <Loader key="loader" />
        ) : (
          <motion.div
            key="programs-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<SectionSkeleton />}>
              <ProgramsFullPage />
            </Suspense>
            <WhatsAppButton />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // 4. Full Gallery Page (/gallery)
  if (isGalleryPage) {
    return (
      <AnimatePresence mode="wait">
        {showLoader ? (
          <Loader key="loader" />
        ) : (
          <motion.div
            key="gallery-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<SectionSkeleton />}>
              <GalleryFullPage />
            </Suspense>
            <WhatsAppButton />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // 5. Full Contact Page (/contact)
  if (isContactPage) {
    return (
      <AnimatePresence mode="wait">
        {showLoader ? (
          <Loader key="loader" />
        ) : (
          <motion.div
            key="contact-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<SectionSkeleton />}>
              <ContactFullPage />
            </Suspense>
            <WhatsAppButton />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // 6. Default Home Page (/)
  return (
    <AnimatePresence mode="wait">
      {showLoader ? (
        <Loader key="loader" />
      ) : (
        <motion.div
          key="home-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ScrollProgress />
          <Navbar />
          <main>
            <Hero />
            <Suspense fallback={<SectionSkeleton />}><About /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Programs /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Schedule /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Trainers /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Gallery /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Testimonials /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Contact /></Suspense>
          </main>
          <Footer />
          <WhatsAppButton />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
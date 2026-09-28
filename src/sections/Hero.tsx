import { motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useLowPerfDevice } from '@/hooks/useLowPerfDevice';
import { supabase } from '@/lib/supabase';

// Cloudinary Hosted Assets
const YOGA_LEFT_IMG = 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788958021/Gemini_Generated_Image_qvhabaqvhabaqvha-removebg-preview.png';
const YOGA_RIGHT_IMG = 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788957839/Gemini_Generated_Image_2uavp22uavp22uav-removebg-preview.png';
const BUDDHA_IMG = 'https://res.cloudinary.com/wri5mjzw/image/upload/v1790573195/12bad824-17e2-48f9-ad42-edb1d5d84fb7.png';
const BOXING_IMG = 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788934734/Gemini_Generated_Image_m35onkm35onkm35o.png';
const SPARROW_IMG = 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788934739/Gemini_Generated_Image_de5la6de5la6de5l.png';
const SILAMBAM_IMG = 'https://res.cloudinary.com/wri5mjzw/image/upload/v1790578399/Gemini_Generated_Image_3uhoat3uhoat3uho-removebg-preview.png';
const GYMNASTICS_IMG = 'https://res.cloudinary.com/wri5mjzw/image/upload/v1790577769/Gemini_Generated_Image_w5gq4tw5gq4tw5gq-removebg-preview.png';
const CLOUD_IMG = 'https://res.cloudinary.com/bvu3yzmo/image/upload/v1788948634/pngwing.com_3.png';

const Hero3D = lazy(() => import('@/components/Hero3D'));

type HeroContent = {
  heading: string;
  subtext: string;
  primary_button: string;
  secondary_button: string;
};

const defaultContent: HeroContent = {
  heading: 'Train Like a Champion',
  subtext: 'Yoga, Martial Arts & Sports Training in Hosur',
  primary_button: 'Join Now',
  secondary_button: 'Call Now',
};

function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-100">
      <img
        src={BUDDHA_IMG}
        alt="Buddha"
        className="w-[90vw] h-[85vh] object-contain opacity-85 pointer-events-none"
      />
    </div>
  );
}

export default function Hero() {
  const isLowPerf = useLowPerfDevice();
  const [content, setContent] = useState<HeroContent>(defaultContent);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('value')
      .eq('key', 'hero')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setContent({ ...defaultContent, ...data.value });
      });
  }, []);

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-sky-100 select-none pt-16 pb-24 sm:py-0"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* 🌟 Base 3D Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {isLowPerf ? (
          <HeroFallback />
        ) : (
          <Suspense fallback={<HeroFallback />}>
            <Hero3D />
          </Suspense>
        )}
      </div>

      {/* 🧘 Center Buddha Hero */}
      <motion.div
        className="absolute inset-0 m-auto z-10 flex items-center justify-center w-[85vw] sm:w-[98vw] h-[65vh] sm:h-[90vh] pointer-events-none"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.img
          src={BUDDHA_IMG}
          alt="Buddha Hero"
          className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
      </motion.div>

      {/* 🕊️ TOP-LEFT: Sparrow */}
      <motion.div
        className="absolute left-[2%] sm:left-[8%] md:left-[12%] top-[8%] sm:top-[12%] z-20 w-[22vw] sm:w-[22vw] md:w-[16vw] max-w-[280px] h-[15vh] sm:h-[25vh] pointer-events-none flex items-center justify-center"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        <motion.img
          src={SPARROW_IMG}
          alt="Sparrow"
          className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
          animate={{ y: [0, -10, 0], x: [0, 4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
      </motion.div>

      {/* 🥊 TOP-RIGHT: Boxing */}
      <motion.div
        className="absolute right-[2%] sm:right-[8%] md:right-[12%] top-[8%] sm:top-[12%] z-20 w-[22vw] sm:w-[22vw] md:w-[16vw] max-w-[280px] h-[15vh] sm:h-[25vh] pointer-events-none flex items-center justify-center"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        <motion.img
          src={BOXING_IMG}
          alt="Boxing"
          className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
          animate={{ y: [0, 10, 0], x: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
      </motion.div>

      {/* ⚔️ MID-LEFT: Silambam (Pushed slightly down) */}
      <motion.div
        className="absolute left-[1%] sm:left-[5%] md:left-[9%] top-[32%] sm:top-[38%] z-20 w-[24vw] sm:w-[24vw] md:w-[18vw] max-w-[300px] h-[18vh] sm:h-[28vh] pointer-events-none flex items-center justify-center"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        <motion.img
          src={SILAMBAM_IMG}
          alt="Silambam"
          className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
          animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
      </motion.div>

      {/* 🤸 MID-RIGHT: Gymnastics (Pushed slightly down) */}
      <motion.div
        className="absolute right-[1%] sm:right-[5%] md:right-[9%] top-[32%] sm:top-[38%] z-20 w-[24vw] sm:w-[24vw] md:w-[18vw] max-w-[300px] h-[18vh] sm:h-[28vh] pointer-events-none flex items-center justify-center"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        <motion.img
          src={GYMNASTICS_IMG}
          alt="Gymnastics"
          className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
          animate={{ y: [0, 8, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
      </motion.div>

      {/* 🧘 BOTTOM-LEFT: Yoga Pose 1 */}
      <motion.div
        className="absolute left-0 bottom-0 z-20 w-[38vw] sm:w-[32vw] md:w-[26vw] max-w-[400px] h-[36vh] sm:h-[52vh] md:h-[60vh] pointer-events-none flex items-end justify-start"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        <motion.img
          src={YOGA_LEFT_IMG}
          alt="Yoga Pose Left"
          className="w-full h-full object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.32)]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
      </motion.div>

      {/* 🧘 BOTTOM-RIGHT: Yoga Pose 2 */}
      <motion.div
        className="absolute right-0 bottom-0 z-20 w-[38vw] sm:w-[32vw] md:w-[26vw] max-w-[400px] h-[36vh] sm:h-[52vh] md:h-[60vh] pointer-events-none flex items-end justify-end"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        <motion.img
          src={YOGA_RIGHT_IMG}
          alt="Yoga Pose Right"
          className="w-full h-full object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.32)]"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
      </motion.div>

      {/* ☁️ + 🏷️ CLOUD & TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
        className="absolute bottom-2 sm:bottom-4 md:bottom-6 z-30 flex flex-col items-center justify-center text-center px-4 max-w-xs sm:max-w-xl md:max-w-2xl mx-auto pointer-events-auto"
      >
        {/* ☁️ Cloud Image Behind The Text */}
        <motion.div
          className="absolute inset-0 -inset-x-8 sm:-inset-x-20 -inset-y-6 sm:-inset-y-16 -z-10 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.95, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={CLOUD_IMG}
            alt="Cloud Backdrop"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(255,255,255,0.9)]"
            animate={{ y: [0, -4, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ willChange: 'transform' }}
          />
        </motion.div>

        {/* Heading */}
        <h1 className="relative z-10 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(249,115,22,0.2)]">
          {content.heading}
        </h1>

        {/* Subtext */}
        <p className="relative z-10 mt-1 text-[11px] sm:text-sm md:text-base font-semibold text-slate-700 max-w-xs sm:max-w-md drop-shadow-sm">
          {content.subtext}
        </p>

        {/* Action Buttons */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-4 mt-2.5 sm:mt-4">
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: '#f97316',
              backgroundImage: 'linear-gradient(135deg, #FF6B00 0%, #FF8C38 50%, #ea580c 100%)',
              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.45)',
            }}
            className="px-4 sm:px-7 py-2 sm:py-2.5 rounded-full text-white text-[11px] sm:text-sm font-extrabold uppercase tracking-wider cursor-pointer transition-all"
          >
            {content.primary_button}
          </motion.button>

          <motion.a
            href="tel:+919894828541"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 sm:px-7 py-2 sm:py-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-orange-200 text-orange-600 text-[11px] sm:text-sm font-extrabold uppercase tracking-wider hover:bg-orange-50 cursor-pointer shadow-sm transition-all"
          >
            {content.secondary_button}
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Floating depth orbs */}
      <motion.div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-400/10 blur-3xl pointer-events-none"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-orange-500/10 blur-3xl pointer-events-none"
        animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-orange-300/10 blur-3xl pointer-events-none"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Main 3D stage */}
      <div style={{ perspective: '1000px' }} className="relative flex items-center justify-center">
        <motion.div
          className="relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateX: [0, 8, 0, -8, 0], rotateY: [0, -10, 0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Subtle orange track */}
          <div className="absolute inset-0 border-[6px] border-orange-500/15 rounded-full" />

          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 border-[6px] border-transparent border-t-orange-500 border-r-orange-500 rounded-full"
            style={{ transform: 'rotateX(55deg)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          />

          {/* Middle rotating ring */}
          <motion.div
            className="absolute inset-6 border-[5px] border-transparent border-b-orange-400 border-l-orange-400 rounded-full"
            style={{ transform: 'rotateX(-55deg)' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner rotating ring */}
          <motion.div
            className="absolute inset-12 border-[4px] border-transparent border-t-orange-300 rounded-full"
            style={{ transform: 'rotateY(60deg)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          />

          {/* Soft glow */}
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-orange-400/25 blur-2xl"
            animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Centered logo container */}
          <motion.div
            className="relative z-10 flex items-center justify-center w-36 h-36 sm:w-40 sm:h-40"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ scale: [0.95, 1.08, 0.95], rotateY: [0, 12, 0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src="/logo.png"
              alt="Aravind Sports Academy Logo"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Updated Academy Branding Text */}
      <motion.p
        className="mt-8 font-extrabold text-xl sm:text-2xl tracking-wider text-zinc-900 text-center uppercase"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        Aravind Sports Academy
      </motion.p>
      
      <motion.p
        className="mt-1 text-xs sm:text-sm tracking-[0.3em] font-bold text-orange-600 text-center uppercase"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.2, ease: 'easeInOut' }}
      >
        Excellence in Discipline
      </motion.p>
    </motion.div>
  );
}
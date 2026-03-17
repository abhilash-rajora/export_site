import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

return (
  <AnimatePresence>
    {visible && (
      <div className="fixed bottom-4 inset-x-0 flex justify-center z-50">
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full border border-white/30 shadow-md flex items-center justify-center backdrop-blur-md"
          style={{
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(10px) saturate(140%)',
            WebkitBackdropFilter: 'blur(10px) saturate(140%)',
          }}
        >
          <ArrowUp className="w-4 h-4 text-navy-900" />
        </motion.button>
      </div>
    )}
  </AnimatePresence>
);
}
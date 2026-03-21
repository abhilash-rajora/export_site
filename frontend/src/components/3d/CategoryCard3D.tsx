// frontend/src/components/3d/CategoryCard3D.tsx
// Glassmorphism + 3D tilt — iOS water drop style

import { useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, useSpring, useTransform } from 'framer-motion';

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: React.ElementType;
  desc: string;
  color: string;
}

const accentMap: Record<string, string> = {
  'Agriculture':      '#4ade80',
  'Textiles':         '#c084fc',
  'Minerals':         '#94a3b8',
  'Electronics':      '#60a5fa',
  'Food & Beverages': '#fb923c',
  'Handicrafts':      '#fbbf24',
};

export default function CategoryCard3D({ name, slug, icon: Icon, desc }: CategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const accent  = accentMap[name] ?? '#D4A017';

  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(y, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-12deg', '12deg']);
  const glareX  = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glareY  = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top)  / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ perspective: '800px' }}>
      <Link to="/products/$category" params={{ category: slug }}>
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            background: 'rgba(255, 255, 255, 0.09)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="group relative flex flex-col items-center p-4 rounded-2xl text-center cursor-pointer overflow-hidden"
        >
          {/* Top edge glare */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />

          {/* Mouse-follow glare */}
          <motion.div
            style={{ background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.12) 0%, transparent 60%)` }}
            className="absolute inset-0 pointer-events-none rounded-2xl z-10"
          />

          {/* Hover accent glow from top */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `radial-gradient(circle at 50% 0%, ${accent}25 0%, transparent 70%)` }} />

          {/* Icon — lifted in Z */}
          <motion.div style={{ translateZ: 20 }} className="relative z-20 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              style={{
                background: `${accent}20`,
                border: `1px solid ${accent}40`,
                boxShadow: `0 0 20px ${accent}30`,
              }}>
              <Icon className="w-5 h-5" style={{ color: accent }} />
            </div>
          </motion.div>

          {/* Text — slightly lifted */}
          <motion.div style={{ translateZ: 10 }} className="relative z-20">
            <span className="font-semibold text-sm text-white leading-snug block mb-0.5">{name}</span>
            <span className="text-xs text-white/50 leading-snug block">{desc}</span>
          </motion.div>

          {/* Bottom reflection line */}
          <div className="absolute bottom-0 left-2 right-2 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
        </motion.div>
      </Link>
    </div>
  );
}
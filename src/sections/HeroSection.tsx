import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { BalloonsHeartsScene } from '../three/BalloonsHeartsScene';
import { BalloonsHeartsFallback } from '../three/BalloonsHeartsFallback';
import { useWebGLSupport } from '../lib/hooks/useWebGLSupport';
import { useReducedMotion } from '../lib/hooks/useReducedMotion';

interface HeroSectionProps {
  herName: string;
  heroMessage: string;
  heroSubtitle?: string;
  primaryColor?: string;
  onScrollDown: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  herName,
  heroMessage,
  heroSubtitle = "To the person who makes every ordinary day feel like magic.",
  primaryColor = "#e11d48",
  onScrollDown,
}) => {
  const hasWebGL = useWebGLSupport();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-center text-center px-4 pt-12 pb-8 overflow-hidden">
      {/* 3D Scene or 2D Fallback */}
      {hasWebGL && !prefersReducedMotion ? (
        <BalloonsHeartsScene primaryColor={primaryColor} />
      ) : (
        <BalloonsHeartsFallback primaryColor={primaryColor} />
      )}

      {/* Hero Typography Content */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        {/* Birthday Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-medium mb-4 shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>A Celebration of You</span>
        </motion.div>

        {/* Recipient Name in Luxury Serif */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-white mb-3"
        >
          <span className="block text-rose-100">{heroMessage}</span>
          <span
            className="block mt-2 font-handwriting text-5xl sm:text-7xl md:text-8xl text-glow"
            style={{ color: primaryColor }}
          >
            {herName}
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        {heroSubtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-xl text-rose-200/90 font-light max-w-xl mx-auto leading-relaxed mt-2"
          >
            {heroSubtitle}
          </motion.p>
        )}

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 sm:mt-16"
        >
          <button
            onClick={onScrollDown}
            className="flex flex-col items-center gap-2 text-rose-300/80 hover:text-white transition-colors group cursor-pointer"
            aria-label="Scroll down to explore story"
          >
            <span className="text-xs uppercase tracking-widest font-medium group-hover:text-rose-200">
              Scroll to explore our story
            </span>
            <div className="w-9 h-9 rounded-full glass-panel border border-rose-500/30 flex items-center justify-center group-hover:border-rose-400 transition-colors animate-bounce">
              <ChevronDown className="w-4 h-4 text-rose-400 group-hover:text-white" />
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

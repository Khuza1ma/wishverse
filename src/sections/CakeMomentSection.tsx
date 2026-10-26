import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CakeScene } from '../three/CakeScene';
import { CakeFallback } from '../three/CakeFallback';
import { useWebGLSupport } from '../lib/hooks/useWebGLSupport';
import { useReducedMotion } from '../lib/hooks/useReducedMotion';
import { Sparkles, Heart, Flame } from 'lucide-react';

interface CakeMomentSectionProps {
  herName: string;
  primaryColor?: string;
}

export const CakeMomentSection: React.FC<CakeMomentSectionProps> = ({
  herName,
  primaryColor = '#e11d48',
}) => {
  const [isBlown, setIsBlown] = useState(false);
  const hasWebGL = useWebGLSupport();
  const prefersReducedMotion = useReducedMotion();

  // Launch celebration confetti burst and falling petals
  const triggerConfetti = useCallback(() => {
    if (prefersReducedMotion) return;

    // Heart and star shapes confetti burst
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#e11d48', '#f43f5e', '#fda4af', '#fbbf24', '#ffffff', '#be123c'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    // Secondary delayed burst for dramatic celebration
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#e11d48', '#fda4af', '#f59e0b'],
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#e11d48', '#fda4af', '#f59e0b'],
      });
    }, 400);
  }, [prefersReducedMotion]);

  const handleBlowOut = () => {
    if (isBlown) return;
    setIsBlown(true);
    triggerConfetti();
  };

  const handleRelight = () => {
    setIsBlown(false);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>The Birthday Ritual</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3">
          Make a Wish, {herName}
        </h2>
        <p className="text-sm sm:text-base text-rose-200/80 max-w-md mx-auto">
          {isBlown
            ? "Your wish is now written in the stars!"
            : "Close your eyes, make the sweetest wish from the bottom of your heart, and blow out the candles."}
        </p>
      </motion.div>

      {/* 3D Cake or 2D Fallback */}
      <div className="relative my-4">
        {hasWebGL && !prefersReducedMotion ? (
          <CakeScene
            isBlown={isBlown}
            onBlowOut={handleBlowOut}
            primaryColor={primaryColor}
          />
        ) : (
          <CakeFallback
            isBlown={isBlown}
            onBlowOut={handleBlowOut}
            primaryColor={primaryColor}
          />
        )}
      </div>

      {/* Interactive Controls & Post-blow Celebration Message */}
      <div className="flex flex-col items-center mt-4">
        <AnimatePresence>
          {!isBlown ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={handleBlowOut}
              className="px-8 py-3.5 rounded-full text-white font-medium text-sm sm:text-base shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2.5"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, #f43f5e)`,
                boxShadow: `0 0 30px ${primaryColor}77`,
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Blow Out the Candles</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-4 max-w-lg mx-auto"
            >
              {/* Celebration Card */}
              <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-rose-500/40 shadow-2xl">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-rose-600/30 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-rose-400 fill-rose-400 animate-bounce" />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                  Happy Birthday, My Love!
                </h3>
                <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed font-light">
                  May this upcoming year bring you unimaginable joy, continuous laughter, and every little dream you hold dear.
                </p>
              </div>

              {/* Relight button */}
              <button
                onClick={handleRelight}
                className="text-xs text-rose-300/80 hover:text-white underline underline-offset-4 transition-colors pt-2"
              >
                Light candles again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

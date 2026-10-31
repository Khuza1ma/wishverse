import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, HelpCircle } from 'lucide-react';

interface LoveReasonsSectionProps {
  reasons: string[];
  herName: string;
  reasonsSubtitle?: string;
  primaryColor?: string;
}

export const LoveReasonsSection: React.FC<LoveReasonsSectionProps> = ({
  reasons,
  herName,
  reasonsSubtitle,
  primaryColor = '#e11d48',
}) => {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isGridOfThree = reasons.length % 3 === 0;

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto text-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Little Things I Adore</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3">
          Reasons Why I Love You
        </h2>
        <p className="text-sm sm:text-base text-rose-200/90 max-w-xl mx-auto leading-relaxed">
          {reasonsSubtitle || `Just a few of the million reasons why my heart chose you, ${herName}. Tap any card to flip.`}
        </p>
      </motion.div>

      {/* Flip Cards Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          isGridOfThree ? 'lg:grid-cols-3 max-w-5xl' : 'lg:grid-cols-4'
        } gap-4 sm:gap-6 mx-auto`}
      >
        {reasons.map((reason, index) => {
          const isFlipped = Boolean(flippedCards[index]);

          return (
            <div
              key={index}
              onClick={() => toggleFlip(index)}
              className="h-56 sm:h-64 cursor-pointer perspective-1000 select-none group"
              style={{ perspective: '1000px' }}
            >
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', damping: 20, stiffness: 100 }}
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* FRONT OF CARD */}
                <div
                  className="absolute inset-0 w-full h-full glass-panel rounded-3xl p-6 flex flex-col items-center justify-between border border-rose-500/20 group-hover:border-rose-400 group-hover:shadow-lg group-hover:shadow-rose-900/30 transition-all"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="w-full flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wider text-rose-400 font-semibold">
                      Reason #{index + 1}
                    </span>
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/30" />
                  </div>

                  <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-500/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-8 h-8 text-rose-300" />
                  </div>

                  <span className="text-xs text-rose-300/80 font-medium group-hover:text-rose-200">
                    Tap to reveal
                  </span>
                </div>

                {/* BACK OF CARD */}
                <div
                  className="absolute inset-0 w-full h-full glass-panel-glow rounded-3xl p-6 flex flex-col items-center justify-center border border-rose-400 text-center shadow-xl overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-rose-500/20 blur-xl pointer-events-none" />
                  
                  <p className="font-handwriting text-xl sm:text-2xl text-rose-100 leading-snug px-2">
                    "{reason}"
                  </p>

                  <span className="text-[11px] text-rose-300/60 uppercase tracking-widest mt-3">
                    Reason #{index + 1}
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

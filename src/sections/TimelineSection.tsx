import React from 'react';
import { motion } from 'framer-motion';
import { Milestone } from '../lib/types';
import { getPhotoUrl } from '../lib/loadContent';
import { Calendar, Heart, Sparkles } from 'lucide-react';
import { useReducedMotion } from '../lib/hooks/useReducedMotion';

interface TimelineSectionProps {
  milestones: Milestone[];
  onSelectPhoto: (photoUrl: string, caption: string) => void;
  primaryColor?: string;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  milestones,
  onSelectPhoto,
  primaryColor = '#e11d48',
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 sm:mb-24"
      >
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Our Story So Far</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3">
          Timeline of Us
        </h2>
        <p className="text-sm sm:text-base text-rose-200/80 max-w-lg mx-auto">
          From that first serendipitous hello to every unforgettable chapter we have written together.
        </p>
      </motion.div>

      {/* Timeline track container */}
      <div className="relative">
        {/* Central Glowing Line (Desktop) */}
        <div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-rose-500/20 via-rose-500/60 to-rose-500/20 pointer-events-none"
          aria-hidden="true"
        />

        {/* Milestone Cards */}
        <div className="space-y-12 sm:space-y-20">
          {milestones.map((milestone, index) => {
            const isEven = index % 2 === 0;
            const photoUrl = getPhotoUrl(milestone.photo);

            return (
              <motion.div
                key={index}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: isEven ? -40 : 40, y: 20 }
                }
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col md:flex-row items-center gap-6 sm:gap-10 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Center Node Indicator (Desktop) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full items-center justify-center glass-panel border border-rose-400 shadow-lg shadow-rose-900/40">
                  <Heart
                    className="w-4 h-4 fill-rose-500 text-rose-500"
                    style={{ color: primaryColor }}
                  />
                </div>

                {/* Milestone Photo Card */}
                <div className="w-full md:w-1/2">
                  <div
                    onClick={() =>
                      onSelectPhoto(
                        photoUrl,
                        milestone.date && milestone.date.trim().length > 0
                          ? `${milestone.title} - ${milestone.date}`
                          : milestone.title
                      )
                    }
                    className="group relative cursor-pointer overflow-hidden rounded-3xl glass-panel border border-rose-500/20 shadow-xl transition-all duration-300 hover:border-rose-400 hover:scale-[1.02]"
                  >
                    <div className="aspect-[16/10] sm:aspect-[16/11] overflow-hidden bg-rose-950/30">
                      <img
                        src={photoUrl}
                        alt={milestone.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {/* Hover hint */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs text-rose-100 bg-black/60 px-3 py-1.5 rounded-full border border-white/20">
                        Tap to enlarge photo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestone Text Narrative */}
                <div
                  className={`w-full md:w-1/2 flex flex-col ${
                    isEven ? 'md:pl-4 text-left' : 'md:pr-4 text-left'
                  }`}
                >
                  {/* Badge & Optional Date */}
                  {(milestone.badge || (milestone.date && milestone.date.trim().length > 0)) && (
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {milestone.badge && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-sm"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {milestone.badge}
                        </span>
                      )}
                      {milestone.date && milestone.date.trim().length > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-rose-300 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-rose-400" />
                          {milestone.date}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 leading-snug">
                    {milestone.title}
                  </h3>

                  {/* Text */}
                  {milestone.text && (
                    <p className="text-sm sm:text-base text-rose-100/80 leading-relaxed font-light">
                      {milestone.text}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FinalLetterConfig } from '../lib/types';
import { getPhotoUrl } from '../lib/loadContent';
import { TypewriterText } from '../components/TypewriterText';
import { Heart, Sparkles, Feather } from 'lucide-react';

interface FinalLetterSectionProps {
  finalLetter: string | FinalLetterConfig;
  herName: string;
  yourName: string;
  primaryColor?: string;
}

export const FinalLetterSection: React.FC<FinalLetterSectionProps> = ({
  finalLetter,
  herName,
  yourName,
  primaryColor = '#e11d48',
}) => {
  const [isTypingDone, setIsTypingDone] = useState(false);

  // Normalize finalLetter whether it's a string or an object
  const isObject = typeof finalLetter === 'object' && finalLetter !== null;
  const salutation = isObject
    ? finalLetter.salutation || `My Dearest ${herName},`
    : `My Dearest ${herName},`;
  const bodyText = isObject ? finalLetter.body : finalLetter;
  const signOff = isObject
    ? finalLetter.signOff || `Forever & Always,\n${yourName}`
    : `Forever & Always,\n${yourName}`;
  const closingPhotoUrl = isObject && finalLetter.closingPhoto
    ? getPhotoUrl(finalLetter.closingPhoto)
    : null;

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          <Feather className="w-4 h-4" />
          <span>From My Heart to Yours</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-2">
          A Letter For You
        </h2>
      </motion.div>

      {/* Parchment / Glass Letter Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative glass-panel-glow rounded-3xl p-8 sm:p-14 border border-rose-500/30 shadow-2xl overflow-hidden"
      >
        {/* Soft Ambient Rose Corner Glows */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />

        {/* Salutation */}
        <h3 className="font-handwriting text-3xl sm:text-4xl text-rose-300 mb-6 tracking-wide">
          {salutation}
        </h3>

        {/* Typewriter Body */}
        <div className="text-base sm:text-lg text-rose-100/90 leading-relaxed font-light mb-8 font-serif">
          <TypewriterText
            text={bodyText}
            speed={24}
            delay={400}
            onComplete={() => setIsTypingDone(true)}
          />
        </div>

        {/* Sign Off */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isTypingDone ? 1 : 0.4 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-end text-right mt-10 pt-6 border-t border-rose-500/20"
        >
          <p className="font-handwriting text-2xl sm:text-3xl text-rose-200 whitespace-pre-line leading-relaxed">
            {signOff}
          </p>
        </motion.div>

        {/* Closing Couple Photo (if provided) */}
        {closingPhotoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <div className="relative max-w-sm rounded-2xl overflow-hidden glass-panel border border-rose-500/30 p-2 shadow-2xl">
              <img
                src={closingPhotoUrl}
                alt="Us forever"
                className="rounded-xl w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="p-3 text-center">
                <span className="font-handwriting text-xl text-rose-200">
                  Forever and always &hearts;
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Romantic Footer */}
      <footer className="mt-20 text-center text-xs text-rose-300/60 pb-12 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span>Made with all my heart for</span>
          <span className="text-rose-200 font-semibold">{herName}</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        </div>
        <p className="text-[11px] text-rose-400/40">
          Happy Birthday, my whole world.
        </p>
      </footer>
    </section>
  );
};

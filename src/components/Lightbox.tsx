import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export interface LightboxPhoto {
  url: string;
  caption: string;
  location?: string;
}

interface LightboxProps {
  photos: LightboxPhoto[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < photos.length;
  const currentPhoto = isOpen ? photos[currentIndex] : null;

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && currentPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl select-none"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close photo view"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Photo Container */}
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center rounded-2xl overflow-hidden glass-panel border border-rose-500/20 shadow-2xl"
          >
            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption || 'Couple memory'}
              className="max-h-[68vh] w-auto object-contain rounded-t-xl"
              loading="lazy"
            />

            {/* Caption & Location bar */}
            <div className="w-full p-4 sm:p-5 bg-gradient-to-t from-black via-zinc-950 to-zinc-900/90 text-center">
              {currentPhoto.location && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-300 font-medium mb-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{currentPhoto.location}</span>
                </div>
              )}
              <p className="text-sm sm:text-base text-rose-100 font-serif max-w-xl mx-auto">
                {currentPhoto.caption}
              </p>
              <span className="text-[11px] text-zinc-400 mt-2 block tracking-wider uppercase">
                {currentIndex! + 1} of {photos.length}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

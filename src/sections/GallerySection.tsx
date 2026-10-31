import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GalleryItem } from '../lib/types';
import { getPhotoUrl } from '../lib/loadContent';
import { PhotoCarouselScene } from '../three/PhotoCarouselScene';
import { PhotoGalleryFallback } from '../three/PhotoGalleryFallback';
import { useWebGLSupport } from '../lib/hooks/useWebGLSupport';
import { useReducedMotion } from '../lib/hooks/useReducedMotion';
import { Camera, LayoutGrid, Rotate3d } from 'lucide-react';

interface GallerySectionProps {
  items: GalleryItem[];
  onOpenLightbox: (index: number) => void;
  primaryColor?: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  items,
  onOpenLightbox,
  primaryColor = '#e11d48',
}) => {
  const hasWebGL = useWebGLSupport();
  const prefersReducedMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(
    hasWebGL && !prefersReducedMotion ? '3d' : '2d'
  );

  const photoList = items.map((item) => ({
    url: getPhotoUrl(item.photo),
    caption: item.caption,
    location: item.location,
  }));

  const photoUrls = photoList.map((p) => p.url);

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto text-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          <Camera className="w-4 h-4" />
          <span>Captured Moments</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3">
          Memories With You
        </h2>
        <p className="text-sm sm:text-base text-rose-200/80 max-w-lg mx-auto">
          A glimpse into the countless adventures, laughs, and quiet moments that mean the world to me.
        </p>

        {/* View Mode Switcher */}
        {hasWebGL && !prefersReducedMotion && (
          <div className="inline-flex items-center p-1 rounded-full glass-panel border border-rose-500/20 mt-6 shadow-md">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === '3d'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-rose-300 hover:text-white'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>3D Carousel</span>
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === '2d'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-rose-300 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Gallery Canvas or 2D Slider */}
      <div className="relative w-full">
        {viewMode === '3d' && hasWebGL && !prefersReducedMotion ? (
          <PhotoCarouselScene photos={photoUrls} onSelectPhoto={onOpenLightbox} />
        ) : (
          <PhotoGalleryFallback photos={photoList} onSelectPhoto={onOpenLightbox} />
        )}
      </div>
    </section>
  );
};

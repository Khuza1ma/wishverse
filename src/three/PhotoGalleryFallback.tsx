import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryFallbackProps {
  photos: { url: string; caption: string; location?: string }[];
  onSelectPhoto: (index: number) => void;
}

export const PhotoGalleryFallback: React.FC<PhotoGalleryFallbackProps> = ({
  photos,
  onSelectPhoto,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full py-4 select-none">
      {/* Scroll controls for desktop */}
      <div className="hidden sm:flex justify-end gap-2 mb-3 px-4">
        <button
          onClick={() => scroll('left')}
          className="p-2 rounded-full glass-panel hover:bg-rose-500/20 text-rose-200 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="p-2 rounded-full glass-panel hover:bg-rose-500/20 text-rose-200 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Swipeable track with snap */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 pb-4 focus:outline-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {photos.map((item, index) => (
          <div
            key={index}
            onClick={() => onSelectPhoto(index)}
            className="flex-shrink-0 w-[260px] sm:w-[300px] snap-center cursor-pointer group"
          >
            <div className="glass-panel rounded-2xl overflow-hidden border border-rose-500/20 transition-all duration-300 group-hover:border-rose-400 group-hover:scale-[1.02] shadow-xl">
              <div className="aspect-[4/5] overflow-hidden bg-rose-950/40 relative">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs text-rose-200 font-medium">Tap to enlarge</span>
                </div>
              </div>
              <div className="p-3 bg-zinc-950/80">
                {item.location && (
                  <span className="text-[11px] text-rose-400 font-medium block truncate">
                    {item.location}
                  </span>
                )}
                <p className="text-xs text-rose-100/90 truncate font-serif mt-0.5">
                  {item.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-rose-300/60 mt-2 sm:hidden">
        Swipe left or right to explore &bull; Tap to view
      </p>
    </div>
  );
};

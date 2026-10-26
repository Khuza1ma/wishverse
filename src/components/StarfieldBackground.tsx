import React, { useMemo } from 'react';

export const StarfieldBackground: React.FC = () => {
  // Generate random twinkling stars
  const stars = useMemo(() => {
    return Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deep atmospheric radial glows */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-rose-950/20 blur-[130px]" />
      <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-950/15 blur-[120px]" />
      <div className="absolute top-[75%] -right-[10%] w-[600px] h-[600px] rounded-full bg-rose-900/15 blur-[140px]" />

      {/* Floating starry dust */}
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-rose-100 animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}
    </div>
  );
};

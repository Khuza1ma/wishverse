import React from 'react';

export const BalloonsHeartsFallback: React.FC<{ primaryColor?: string }> = ({
  primaryColor = '#e11d48',
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Soft background glows */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-[100px] opacity-25"
        style={{ backgroundColor: primaryColor }}
      />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[120px] bg-rose-400/20" />

      {/* Floating 2D CSS Hearts */}
      <div className="absolute top-[18%] left-[10%] animate-float-slow opacity-80">
        <svg width="48" height="48" viewBox="0 0 24 24" fill={primaryColor}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      <div className="absolute top-[22%] right-[12%] animate-float-reverse opacity-75">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="#f43f5e">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      <div className="absolute bottom-[28%] left-[15%] animate-float-reverse opacity-60">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="#fb7185">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Floating 2D Balloons */}
      <div className="absolute top-[35%] right-[6%] animate-float-slow opacity-85">
        <div className="w-14 h-18 bg-gradient-to-br from-rose-400 to-rose-600 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] shadow-lg shadow-rose-900/40 relative">
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-2 h-1.5 bg-rose-700 rounded-sm" />
          <div className="absolute top-2 left-2.5 w-3 h-5 bg-white/40 rounded-full blur-[1px] transform -rotate-12" />
        </div>
      </div>

      <div className="absolute top-[30%] left-[8%] animate-float-reverse opacity-80">
        <div className="w-12 h-15 bg-gradient-to-br from-pink-400 to-rose-500 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] shadow-lg shadow-pink-900/40 relative">
          <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-1.5 bg-rose-600 rounded-sm" />
          <div className="absolute top-2 left-2 w-2.5 h-4 bg-white/40 rounded-full blur-[1px] transform -rotate-12" />
        </div>
      </div>
    </div>
  );
};

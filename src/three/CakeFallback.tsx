import React from 'react';
import { Sparkles } from 'lucide-react';

interface CakeFallbackProps {
  isBlown: boolean;
  onBlowOut: () => void;
  primaryColor?: string;
}

export const CakeFallback: React.FC<CakeFallbackProps> = ({
  isBlown,
  onBlowOut,
  primaryColor = '#e11d48',
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-6 select-none">
      <div
        onClick={() => {
          if (!isBlown) onBlowOut();
        }}
        className="relative cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 group"
      >
        <svg
          width="260"
          height="240"
          viewBox="0 0 260 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cake Stand Base */}
          <ellipse cx="130" cy="215" rx="100" ry="12" fill="#d97706" />
          <path d="M100 215 L120 185 L140 185 L160 215 Z" fill="#b45309" />
          <ellipse cx="130" cy="185" rx="85" ry="10" fill="#f59e0b" />

          {/* Bottom Cake Tier */}
          <rect x="55" y="130" width="150" height="50" rx="8" fill="#fff1f2" />
          <ellipse cx="130" cy="130" rx="75" ry="10" fill="#fce7f3" />
          <path
            d="M55 140 Q 75 155 95 140 T 135 140 T 175 140 T 205 140 L 205 130 L 55 130 Z"
            fill={primaryColor}
          />

          {/* Top Cake Tier */}
          <rect x="80" y="85" width="100" height="42" rx="6" fill="#fff1f2" />
          <ellipse cx="130" cy="85" rx="50" ry="8" fill="#fce7f3" />
          <path
            d="M80 95 Q 95 105 110 95 T 140 95 T 170 95 T 180 95 L 180 85 L 80 85 Z"
            fill={primaryColor}
          />

          {/* Candles */}
          {/* Candle 1 */}
          <rect x="100" y="55" width="6" height="28" rx="2" fill="#fda4af" />
          <line x1="103" y1="55" x2="103" y2="48" stroke="#475569" strokeWidth="2" />
          {!isBlown && (
            <ellipse
              cx="103"
              cy="43"
              rx="4"
              ry="7"
              fill="#f59e0b"
              className="animate-pulse"
              style={{ transformOrigin: '103px 43px' }}
            />
          )}

          {/* Candle 2 (Center) */}
          <rect x="127" y="50" width="6" height="33" rx="2" fill="#fb7185" />
          <line x1="130" y1="50" x2="130" y2="42" stroke="#475569" strokeWidth="2" />
          {!isBlown && (
            <ellipse
              cx="130"
              cy="36"
              rx="5"
              ry="8"
              fill="#f59e0b"
              className="animate-pulse"
              style={{ transformOrigin: '130px 36px', animationDelay: '0.2s' }}
            />
          )}

          {/* Candle 3 */}
          <rect x="154" y="55" width="6" height="28" rx="2" fill="#fda4af" />
          <line x1="157" y1="55" x2="157" y2="48" stroke="#475569" strokeWidth="2" />
          {!isBlown && (
            <ellipse
              cx="157"
              cy="43"
              rx="4"
              ry="7"
              fill="#f59e0b"
              className="animate-pulse"
              style={{ transformOrigin: '157px 43px', animationDelay: '0.4s' }}
            />
          )}

          {/* Smoke Puffs when blown out */}
          {isBlown && (
            <g opacity="0.6">
              <circle cx="103" cy="40" r="3" fill="#cbd5e1" className="animate-ping" />
              <circle cx="130" cy="33" r="4" fill="#cbd5e1" className="animate-ping" />
              <circle cx="157" cy="40" r="3" fill="#cbd5e1" className="animate-ping" />
            </g>
          )}
        </svg>

        {/* Ambient glow behind cake */}
        <div
          className="absolute inset-0 -z-10 rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      {!isBlown ? (
        <button
          onClick={onBlowOut}
          className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm shadow-lg shadow-rose-900/40 flex items-center gap-2 transition-transform active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tap to Blow Out Candles</span>
        </button>
      ) : (
        <p className="mt-4 text-sm text-rose-300 font-serif italic animate-fade-in">
          Your wish is on its way to the stars!
        </p>
      )}
    </div>
  );
};

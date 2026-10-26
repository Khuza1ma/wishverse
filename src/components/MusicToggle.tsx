import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

interface MusicToggleProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  songTitle: string;
  artist?: string;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (vol: number) => void;
}

export const MusicToggle: React.FC<MusicToggleProps> = ({
  isPlaying,
  isMuted,
  volume,
  songTitle,
  artist,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <aside
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 select-none"
      role="region"
      aria-label="Background music controls"
    >
      {/* Animated Floating Pill */}
      <div className="glass-panel rounded-full px-3.5 py-2 flex items-center gap-3 shadow-2xl border border-rose-500/30 backdrop-blur-xl transition-all duration-300 hover:border-rose-400">
        
        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlay}
          className="relative w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-rose-900/40"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}

          {/* Equalizer animation ring when playing */}
          {isPlaying && (
            <span className="absolute -inset-1 rounded-full border border-rose-400/50 animate-ping opacity-60 pointer-events-none" />
          )}
        </button>

        {/* Song Info & Equalizer Bars */}
        <div className="flex flex-col max-w-[130px] sm:max-w-[180px]">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Music className={`w-3 h-3 text-rose-400 shrink-0 ${isPlaying ? 'animate-bounce' : ''}`} />
            <span className="text-xs font-medium text-rose-100 truncate">
              {songTitle}
            </span>
          </div>
          {artist && (
            <span className="text-[10px] text-rose-300/70 truncate pl-4">
              {artist}
            </span>
          )}
        </div>

        {/* Animated Equalizer Waveform Indicator */}
        <div className="flex items-end gap-0.5 h-4 px-1" aria-hidden="true">
          {[40, 90, 60, 100, 50].map((h, i) => (
            <span
              key={i}
              className={`w-0.5 bg-rose-400 rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-pulse' : 'opacity-30'
              }`}
              style={{
                height: isPlaying ? `${h}%` : '20%',
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>

        {/* Mute / Volume Button */}
        <button
          onClick={onToggleMute}
          onMouseEnter={() => setShowVolumeSlider(true)}
          className="p-1 text-rose-300 hover:text-white transition-colors"
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4 text-rose-400/80" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Floating Volume Slider on Desktop Hover */}
      {showVolumeSlider && (
        <div
          onMouseLeave={() => setShowVolumeSlider(false)}
          className="glass-panel px-3 py-2 rounded-2xl flex items-center gap-2 border border-rose-500/30 shadow-xl"
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1.5 accent-rose-500 bg-rose-950/60 rounded-lg cursor-pointer"
            aria-label="Music volume"
          />
        </div>
      )}
    </aside>
  );
};

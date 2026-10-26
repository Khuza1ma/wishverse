import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudio(audioUrl: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Audio
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';

    audio.addEventListener('error', (e) => {
      console.warn('Audio element error, falling back:', e);
      setError('Audio failed to load');
    });

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [audioUrl]);

  // Volume synchronization
  const setVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clamped;
    }
  }, [isMuted]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      return next;
    });
  }, [volume]);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().then(() => {
        setIsUnlocked(true);
      }).catch((err) => {
        console.warn('Playback prevented:', err);
      });
    }
  }, [isPlaying]);

  // Unlock and start playback on user gesture (Intro gate tap)
  const unlockAndPlay = useCallback(() => {
    setIsUnlocked(true);
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn('Autoplay unlock notice:', err);
      });
    }
  }, []);

  return {
    isPlaying,
    isMuted,
    volume,
    isUnlocked,
    error,
    togglePlay,
    toggleMute,
    setVolume,
    unlockAndPlay,
  };
}

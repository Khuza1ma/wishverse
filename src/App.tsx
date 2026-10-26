import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { config } from './lib/loadContent';
import { getAudioUrl, getPhotoUrl } from './lib/loadContent';
import { useAudio } from './lib/hooks/useAudio';

import { StarfieldBackground } from './components/StarfieldBackground';
import { MusicToggle } from './components/MusicToggle';
import { Lightbox, LightboxPhoto } from './components/Lightbox';

import { IntroGate } from './sections/IntroGate';
import { HeroSection } from './sections/HeroSection';
import { DaysCounterSection } from './sections/DaysCounterSection';
import { TimelineSection } from './sections/TimelineSection';
import { GallerySection } from './sections/GallerySection';
import { CakeMomentSection } from './sections/CakeMomentSection';
import { LoveReasonsSection } from './sections/LoveReasonsSection';
import { FinalLetterSection } from './sections/FinalLetterSection';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  // Audio setup
  const audioUrl = getAudioUrl(config.music.file);
  const {
    isPlaying,
    isMuted,
    volume,
    togglePlay,
    toggleMute,
    setVolume,
    unlockAndPlay,
  } = useAudio(audioUrl);

  // Set Theme Colors as CSS Variables dynamically
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (config.theme?.primary) {
      root.style.setProperty('--color-primary', config.theme.primary);
      root.style.setProperty('--color-primary-hover', config.theme.primaryHover || config.theme.primary);
    }
    if (config.theme?.secondary) {
      root.style.setProperty('--color-secondary', config.theme.secondary);
    }
    if (config.theme?.accent) {
      root.style.setProperty('--color-accent', config.theme.accent);
    }
    if (config.theme?.background) {
      root.style.setProperty('--color-bg', config.theme.background);
    }
  }, []);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    if (!hasEntered) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [hasEntered]);

  // Handle Intro Gate open (unlocks sound & reveals main page)
  const handleOpenGate = () => {
    setHasEntered(true);
    unlockAndPlay();
  };

  // Scroll smoothly from Hero down to the Story
  const handleScrollToStory = () => {
    if (storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Prepare full list of photos for Lightbox
  const allLightboxPhotos: LightboxPhoto[] = [
    ...config.gallery.map((g) => ({
      url: getPhotoUrl(g.photo),
      caption: g.caption,
      location: g.location,
    })),
    ...config.timeline.map((m) => ({
      url: getPhotoUrl(m.photo),
      caption: `${m.title} — ${m.date}: ${m.text}`,
      location: m.badge,
    })),
  ];

  // Callback to open lightbox from timeline
  const handleSelectTimelinePhoto = (photoUrl: string) => {
    const idx = allLightboxPhotos.findIndex((p) => p.url === photoUrl);
    if (idx !== -1) {
      setLightboxIndex(idx);
    } else {
      setLightboxIndex(0);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0b0b14] text-white selection:bg-rose-500 selection:text-white">
      {/* 1. Intro Gate (Fullscreen unlock & music trigger) */}
      {!hasEntered && (
        <IntroGate
          herName={config.herName}
          title={config.intro.title}
          subtitle={config.intro.subtitle}
          buttonText={config.intro.buttonText}
          passcode={config.intro.passcode}
          onOpen={handleOpenGate}
          primaryColor={config.theme.primary}
        />
      )}

      {/* Main Website (rendered once gate is entered or preloaded underneath) */}
      {hasEntered && (
        <>
          {/* Subtle Starry Atmospheric Dust & Background Glow */}
          <StarfieldBackground />

          {/* Persistent Floating Music Toggle */}
          <MusicToggle
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            songTitle={config.music.title}
            artist={config.music.artist}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onVolumeChange={setVolume}
          />

          {/* Fullscreen Photo Lightbox Modal */}
          <Lightbox
            photos={allLightboxPhotos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={(newIdx) => setLightboxIndex(newIdx)}
          />

          {/* 2. 3D Hero Section */}
          <HeroSection
            herName={config.herName}
            heroMessage={config.heroMessage}
            heroSubtitle={config.heroSubtitle}
            primaryColor={config.theme.primary}
            onScrollDown={handleScrollToStory}
          />

          {/* Content sections anchor */}
          <div ref={storyRef}>
            {/* 3. Days Together Counter */}
            {config.togetherSince && (
              <DaysCounterSection
                togetherSince={config.togetherSince}
                label={config.togetherCounterLabel}
                herName={config.herName}
                primaryColor={config.theme.primary}
              />
            )}

            {/* 4. Timeline of Us */}
            {config.timeline && config.timeline.length > 0 && (
              <TimelineSection
                milestones={config.timeline}
                onSelectPhoto={handleSelectTimelinePhoto}
                primaryColor={config.theme.primary}
              />
            )}

            {/* 5. 3D Photo Gallery */}
            {config.gallery && config.gallery.length > 0 && (
              <GallerySection
                items={config.gallery}
                onOpenLightbox={(idx) => setLightboxIndex(idx)}
                primaryColor={config.theme.primary}
              />
            )}

            {/* 6. Birthday Cake & Candle Blow Moment */}
            <CakeMomentSection
              herName={config.herName}
              primaryColor={config.theme.primary}
            />

            {/* 7. Reasons I Love You */}
            {config.reasons && config.reasons.length > 0 && (
              <LoveReasonsSection
                reasons={config.reasons}
                herName={config.herName}
                primaryColor={config.theme.primary}
              />
            )}

            {/* 8. Final Love Letter */}
            {config.finalLetter && (
              <FinalLetterSection
                finalLetter={config.finalLetter}
                herName={config.herName}
                yourName={config.yourName}
                primaryColor={config.theme.primary}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;

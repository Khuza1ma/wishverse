import { SiteConfig } from '../src/lib/types';

/**
 * 🎁 Birthday Website Configuration (Template & Example)
 * -------------------------------------------------------------
 * Anyone forking this repository can copy this file to:
 *   content/config.ts
 *
 * All personal content in `content/` is strictly GIT-IGNORED.
 * The website will automatically use `content/config.ts` if it exists,
 * or gracefully fall back to this example file for public demos.
 */
export const config: SiteConfig = {
  // Names
  herName: "Sophia",
  yourName: "Alex",

  // Birthday date (YYYY-MM-DD or readable format)
  birthday: "2026-11-15",

  // Visual Theme Colors
  theme: {
    primary: "#e11d48",       // Romantic rose/ruby
    primaryHover: "#be123c",
    secondary: "#fda4af",     // Soft blush pink
    accent: "#f43f5e",        // Vibrant glow
    background: "#0b0b14",    // Deep starry midnight
  },

  // Intro Gate Screen
  intro: {
    title: "A Little Surprise For You",
    subtitle: "Turn on your volume, find a cozy spot, and step inside...",
    buttonText: "Tap to open",
    // Optional passcode (leave empty or remove to allow immediate entry)
    passcode: "",
  },

  // 3D Hero Section
  heroMessage: "Happy Birthday, My Love!",
  heroSubtitle: "To the person who makes every ordinary day feel like magic.",

  // Background Music
  // Place your audio file in `content/audio/` (or `content-example/audio/`)
  music: {
    file: "demo-song.mp3",
    title: "Can't Help Falling in Love",
    artist: "Acoustic Melody",
  },

  // Date since you started dating or met (YYYY-MM-DD)
  togetherSince: "2023-04-14",
  togetherCounterLabel: "Days of Loving You",

  // Scroll-driven Love Story Milestones
  timeline: [
    {
      date: "April 14, 2023",
      title: "The Coffee Shop Serendipity",
      text: "We ordered the exact same hazelnut latte at 8:15 AM. You turned around, smiled, and my entire world quietly rearranged itself.",
      photo: "milestone-1.jpg",
      badge: "Chapter 1",
    },
    {
      date: "August 22, 2023",
      title: "First Road Trip to the Coast",
      text: "Windows rolled down, singing terrible harmonies at the top of our lungs as the sun dipped beneath the Pacific horizon.",
      photo: "milestone-2.jpg",
      badge: "Adventure",
    },
    {
      date: "December 31, 2023",
      title: "Midnight in the Rain",
      text: "We lost our umbrella right before the countdown, yet neither of us cared. Best New Year's kiss of my life.",
      photo: "milestone-3.jpg",
      badge: "A New Year",
    },
    {
      date: "October 10, 2024",
      title: "Moving In Together",
      text: "Unpacking endless cardboard boxes and eating takeout pizza on the living room floor of our very first home.",
      photo: "milestone-4.jpg",
      badge: "Our Home",
    },
    {
      date: "Today",
      title: "Another Beautiful Year of You",
      text: "Watching you grow, laugh, and inspire everyone around you is the greatest privilege of my life.",
      photo: "milestone-5.jpg",
      badge: "Today",
    },
  ],

  // 3D Photo Gallery items
  gallery: [
    {
      photo: "gallery-1.jpg",
      caption: "Sunset at Big Sur wind in your hair, pure happiness.",
      location: "Big Sur, CA",
    },
    {
      photo: "gallery-2.jpg",
      caption: "Our spontaneous picnic date with too many pastries.",
      location: "Botanical Gardens",
    },
    {
      photo: "gallery-3.jpg",
      caption: "That cozy rainy Sunday morning when neither of us left bed.",
      location: "Home sweet home",
    },
    {
      photo: "gallery-4.jpg",
      caption: "Strolling under the lanterns during the autumn festival.",
      location: "Old Town",
    },
    {
      photo: "gallery-5.jpg",
      caption: "You caught me looking at you like you're the whole universe.",
      location: "Rooftop Stargazing",
    },
    {
      photo: "gallery-6.jpg",
      caption: "Forever my favorite travel partner, teammate, and best friend.",
      location: "Lake Louise",
    },
  ],

  // Flip cards / Floating notes of affection
  reasonsSubtitle: "Just a few of the million reasons why my heart chose you. Tap any card to flip.",
  reasons: [
    "The way your eyes crinkle into happy half-moons when you truly laugh.",
    "How you always remember how everyone takes their morning tea or coffee.",
    "Your quiet resilience and the graceful way you conquer whatever life throws at you.",
    "The silly little dance you do in the kitchen whenever food arrives.",
    "How safe and completely at home my heart feels whenever I hold your hand.",
    "The way you believe in me even on days when I struggle to believe in myself.",
    "Your genuine kindness to strangers, animals, and every little living thing.",
    "That you still give me butterflies every single time you walk into the room.",
  ],

  // Final Heartfelt Letter
  finalLetter: {
    salutation: "My Dearest Sophia,",
    body: `Happy Birthday, my sweet love.\n\nFrom the very moment you entered my life, you turned the mundane into poetry and every small moment into a cherished memory. I love who you are, who you have been, and every version of who you will become.\n\nThank you for loving me with patience, laughing at my terrible jokes, and holding my hand through every storm. Today isn't just about celebrating your birthday it's about celebrating the immense blessing of your existence in this world.\n\nMay this year bring you all the warmth, peace, deep laughter, and wild adventures you so richly deserve. I promise to be by your side cheering you on through every second of it.`,
    signOff: "Forever & Always Yours,\nAlex",
    closingPhoto: "closing-love.jpg",
  },
};

export default config;

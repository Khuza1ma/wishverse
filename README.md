# 🎂 Romantic 3D Birthday Website

A single-page, mobile-first interactive birthday website designed for your partner, featuring immersive 3D scenes (floating balloons and hearts, interactive 3D photo carousel, birthday cake with blowable candles and confetti celebration), scroll-driven timeline milestones, flip memory cards, and a typewriter love letter.

Built with **Vite**, **React**, **TypeScript**, **React Three Fiber (Three.js)**, **Drei**, **Tailwind CSS**, **Framer Motion**, **GSAP (ScrollTrigger)**, and **Lenis**.

---

## ✨ Features

- **Intro Gate**: Fullscreen "Tap to open" envelope/seal that seamlessly unlocks background music (bypassing browser autoplay blocks). Includes optional passcode protection.
- **3D Hero**: React Three Fiber scene with glossy floating balloons and 3D hearts reacting to touch and pointer movement, plus responsive 2D fallback.
- **Days Together Counter**: Live real-time counter tracking days, hours, minutes, and seconds since your journey began.
- **Timeline of Us**: Scroll-driven milestone story with dates, photos, chapter badges, and romantic narratives.
- **3D Photo Gallery**: Draggable, rotating cylindrical 3D carousel with full-screen Lightbox modal, plus a 2D swipeable slider and grid view toggle.
- **Birthday Cake Moment**: Interactive 3D birthday cake with flickering candle flames. Tap or click to blow out the candles, which triggers smoke particles and an explosive celebratory confetti & petal burst (`canvas-confetti`).
- **Reasons Why I Love You**: Interactive 3D flip cards revealing handwritten affectionate reasons from your config.
- **Typewriter Love Letter**: Emotional, personal love letter typed out character-by-character with a soft blinking cursor, ending with a closing couple photo and wax seal signature.
- **Global Music Widget**: Floating glassmorphic audio player with play/pause, volume control, mute, and animated equalizer bars.
- **100% Private Git-Ignored Content**: All real names, photos, songs, and letters live inside `content/`, which is completely git-ignored. Anyone can fork this repo and use their own content without leaking personal data.

---

## 🚀 Quick Start Guide

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd wishverse
npm install
```

### 2. Run Setup

Run the automated setup script to create your private `content/` workspace:

```bash
npm run setup
```

This will:
- Create `content/photos/` and `content/audio/`
- Copy `content-example/config.example.ts` into `content/config.ts`

### 3. Add Your Personal Content

1. Open `content/config.ts` in your code editor and fill in your partner's name, your name, special dates, messages, and reasons.
2. Drop your favorite photos into `content/photos/`:
   - e.g., `milestone-1.jpg`, `milestone-2.jpg`, etc.
   - e.g., `gallery-1.jpg`, `gallery-2.jpg`, etc.
   - e.g., `closing-love.jpg`
3. (Optional) Place your background song in `content/audio/` (e.g., `song.mp3`).
4. Run the photo optimization script to compress images and strip EXIF location data for privacy:

```bash
npm run optimize-photos
```

### 4. Preview in Browser

```bash
npm run dev
```

Open `http://localhost:3000` (or the URL printed in the terminal) on your computer or mobile phone.

### 5. Build & Deploy

Because your real photos and config are git-ignored, you build the production bundle locally:

```bash
npm run build
```

This compiles your private content into the static `dist/` directory.

Deploy `dist/` to any free static host:
- **Vercel**: Run `npx vercel deploy --prebuilt` or drag & drop `dist/` in the Vercel dashboard.
- **Netlify**: Drag & drop the `dist/` folder into the Netlify Drop app.
- **Cloudflare Pages**: Drag & drop `dist/` into Cloudflare Pages.

> 🔒 **Privacy Note**: The site includes a `robots.txt` disallowing crawlers and a `noindex` meta tag. Share the unlisted URL only with your partner.

---

## 🎨 Customization

### Changing Theme Colors
In `content/config.ts`, customize the `theme` object:

```typescript
theme: {
  primary: "#e11d48",       // Main romantic accent (rose/ruby)
  primaryHover: "#be123c",
  secondary: "#fda4af",     // Soft blush
  accent: "#f43f5e",        // Glow highlights
  background: "#0b0b14",    // Midnight starry backdrop
}
```

### Changing Fonts
Google fonts are imported in `index.html`:
- Luxury Serif: `Playfair Display`
- Clean Sans: `Plus Jakarta Sans`
- Handwritten script: `Caveat`

To change fonts, update the `<link>` in `index.html` and the `fontFamily` mapping in `tailwind.config.js`.

### Reordering or Toggling Sections
In `src/App.tsx`, sections are mounted under `<div ref={storyRef}>`. You can reorder, duplicate, or conditionally render any section.

---

## 📂 Project Architecture

```
wishverse/
├── content/                    # 🔒 PRIVATE, git-ignored
│   ├── .gitkeep
│   ├── config.ts               # Your real personal config
│   ├── photos/                 # Your real photos
│   └── audio/                  # Your real song
├── content-example/            # 🌐 COMMITTED public demo content
│   ├── config.example.ts       # Template config with demo details
│   ├── photos/                 # Demo photographic assets
│   └── audio/                  # Royalty-free demo melody
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── sections/               # IntroGate, Hero, DaysCounter, Timeline, Gallery, Cake, Reasons, Letter
│   ├── three/                  # 3D Scenes (R3F) & 2D Fallbacks (Balloons, Carousel, Cake)
│   ├── components/             # MusicToggle, Lightbox, Typewriter, Starfield
│   ├── lib/
│   │   ├── loadContent.ts      # Automatic loader with fallback
│   │   ├── types.ts            # TypeScript interface definitions
│   │   └── hooks/              # useReducedMotion, useIsMobile, useAudio, useWebGLSupport
│   └── styles/                 # Tailwind & Glassmorphism styles
├── scripts/
│   ├── setup.mjs               # Initializer script
│   ├── optimize-photos.mjs     # Sharp compression & EXIF stripper
│   └── generate-demo-assets.mjs# Demo media generator
├── index.html
├── package.json
└── README.md
```

---

## 📜 License
MIT License. Free to fork, customize, and share the love.

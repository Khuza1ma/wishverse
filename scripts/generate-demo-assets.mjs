import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const photosDir = path.join(rootDir, 'content-example', 'photos');
const audioDir = path.join(rootDir, 'content-example', 'audio');

if (!fs.existsSync(photosDir)) fs.mkdirSync(photosDir, { recursive: true });
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

// 1. Generate Romantic Melody Audio (WAV file with music box / soft celesta chimes)
function generateRomanticAudio() {
  const sampleRate = 44100;
  const bpm = 72;
  const beatDuration = 60 / bpm;
  
  // Melody notes (frequencies in Hz): Canon in D / Romantic Arpeggios
  // D4, F#4, A4, D5, A3, C#4, E4, A4, B3, D4, F#4, B4, F#3, A3, C#4, F#4, G3, B3, D4, G4, D3, F#3, A3, D4
  const notes = [
    { freq: 293.66, dur: beatDuration * 0.75 }, // D4
    { freq: 369.99, dur: beatDuration * 0.5 },  // F#4
    { freq: 440.00, dur: beatDuration * 0.75 }, // A4
    { freq: 587.33, dur: beatDuration * 1.5 },  // D5
    
    { freq: 220.00, dur: beatDuration * 0.75 }, // A3
    { freq: 277.18, dur: beatDuration * 0.5 },  // C#4
    { freq: 329.63, dur: beatDuration * 0.75 }, // E4
    { freq: 440.00, dur: beatDuration * 1.5 },  // A4
    
    { freq: 246.94, dur: beatDuration * 0.75 }, // B3
    { freq: 293.66, dur: beatDuration * 0.5 },  // D4
    { freq: 369.99, dur: beatDuration * 0.75 }, // F#4
    { freq: 493.88, dur: beatDuration * 1.5 },  // B4

    { freq: 369.99, dur: beatDuration * 0.75 }, // F#4
    { freq: 440.00, dur: beatDuration * 0.5 },  // A4
    { freq: 587.33, dur: beatDuration * 1.0 },  // D5
    { freq: 554.37, dur: beatDuration * 1.0 },  // C#5
    { freq: 587.33, dur: beatDuration * 2.5 },  // D5
  ];

  let totalDuration = notes.reduce((sum, n) => sum + n.dur, 0) + 1.0;
  const totalSamples = Math.floor(sampleRate * totalDuration);
  const buffer = new Int16Array(totalSamples);

  let currentSample = 0;
  for (const note of notes) {
    const noteSamples = Math.floor(sampleRate * note.dur);
    for (let i = 0; i < noteSamples; i++) {
      const t = i / sampleRate;
      // Soft celesta / music box chime harmonics
      const env = Math.exp(-3.5 * (i / noteSamples));
      const s1 = Math.sin(2 * Math.PI * note.freq * t);
      const s2 = 0.35 * Math.sin(2 * Math.PI * note.freq * 2 * t);
      const s3 = 0.15 * Math.sin(2 * Math.PI * note.freq * 3 * t);
      const sampleVal = (s1 + s2 + s3) * env * 0.5;

      const idx = currentSample + i;
      if (idx < totalSamples) {
        buffer[idx] += Math.floor(sampleVal * 32767);
      }
    }
    currentSample += Math.floor(sampleRate * note.dur * 0.85); // slight overlap / legato
  }

  // Create WAV Header
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = totalSamples * (bitsPerSample / 8);
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  const pcmBuffer = Buffer.from(buffer.buffer);
  const fullWav = Buffer.concat([header, pcmBuffer]);

  // Write as demo-song.mp3 (many audio players accept PCM in .mp3 extension, or we can also provide .wav)
  const audioFilePath = path.join(audioDir, 'demo-song.mp3');
  fs.writeFileSync(audioFilePath, fullWav);
  console.log(' Generated royalty-free demo melody: content-example/audio/demo-song.mp3');
}

// 2. Generate Romantic Demo Photos (Aesthetic SVGs with photography styling)
const photoDefs = [
  { name: 'milestone-1.jpg', title: 'The Coffee Shop', tag: 'April 2023', bg: ['#2e1065', '#581c87', '#ec4899'], icon: '☕' },
  { name: 'milestone-2.jpg', title: 'Road Trip to the Coast', tag: 'August 2023', bg: ['#1e1b4b', '#1e3a8a', '#f59e0b'], icon: '🌅' },
  { name: 'milestone-3.jpg', title: 'Midnight in the Rain', tag: 'Dec 2023', bg: ['#09090b', '#312e81', '#6366f1'], icon: '✨' },
  { name: 'milestone-4.jpg', title: 'Our First Home', tag: 'Oct 2024', bg: ['#1c1917', '#78350f', '#f97316'], icon: '🏡' },
  { name: 'milestone-5.jpg', title: 'Another Beautiful Year', tag: 'Today', bg: ['#4c0519', '#be123c', '#fb7185'], icon: '🎂' },

  { name: 'gallery-1.jpg', title: 'Sunset at Big Sur', tag: 'Pure Happiness', bg: ['#450a0a', '#991b1b', '#fbbf24'], icon: '📸' },
  { name: 'gallery-2.jpg', title: 'Picnic in the Gardens', tag: 'Sweet Moments', bg: ['#064e3b', '#047857', '#a7f3d0'], icon: '🧺' },
  { name: 'gallery-3.jpg', title: 'Cozy Rainy Sunday', tag: 'Warm & Safe', bg: ['#172554', '#1e40af', '#93c5fd'], icon: '🌧️' },
  { name: 'gallery-4.jpg', title: 'Lantern Festival Stroll', tag: 'Golden Lights', bg: ['#3b0764', '#701a75', '#f472b6'], icon: '🏮' },
  { name: 'gallery-5.jpg', title: 'Rooftop Stargazing', tag: 'Under the Stars', bg: ['#030712', '#1f2937', '#e0e7ff'], icon: '✨' },
  { name: 'gallery-6.jpg', title: 'Lake Louise Getaway', tag: 'Adventures Together', bg: ['#083344', '#0e7490', '#67e8f9'], icon: '🏔️' },
  { name: 'closing-love.jpg', title: 'Forever & Always', tag: 'You & Me', bg: ['#4c0519', '#881337', '#fda4af'], icon: '💖' },
];

async function generatePhoto(photo) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
    <defs>
      <linearGradient id="grad-${photo.name.replace(/[^a-z0-9]/gi, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${photo.bg[0]}"/>
        <stop offset="50%" stop-color="${photo.bg[1]}"/>
        <stop offset="100%" stop-color="${photo.bg[2]}"/>
      </linearGradient>
      <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#000" stop-opacity="0"/>
        <stop offset="80%" stop-color="#000" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.7"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Background Scenic Art -->
    <rect width="1080" height="1350" fill="url(#grad-${photo.name.replace(/[^a-z0-9]/gi, '')})"/>
    <rect width="1080" height="1350" fill="url(#vignette)"/>

    <!-- Decorative Stars/Sparkles -->
    <circle cx="150" cy="180" r="3" fill="#ffffff" opacity="0.6"/>
    <circle cx="890" cy="220" r="4" fill="#ffffff" opacity="0.8"/>
    <circle cx="950" cy="850" r="3" fill="#ffffff" opacity="0.5"/>
    <circle cx="200" cy="1100" r="5" fill="#ffffff" opacity="0.7"/>
    <circle cx="780" cy="1200" r="3" fill="#ffffff" opacity="0.4"/>

    <!-- Polaroid / Photo Matte Outline -->
    <rect x="70" y="80" width="940" height="1190" rx="30" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>

    <!-- Center Icon & Heart -->
    <g transform="translate(540, 560)">
      <circle cx="0" cy="0" r="110" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.25)" stroke-width="3"/>
      <text x="0" y="32" font-size="80" text-anchor="middle" filter="url(#glow)">${photo.icon}</text>
    </g>

    <!-- Photo Typography -->
    <g transform="translate(540, 780)">
      <text x="0" y="0" fill="#ffffff" font-family="'Playfair Display', Georgia, serif" font-size="54" font-weight="700" letter-spacing="1" text-anchor="middle">${photo.title.replace(/&/g, '&amp;')}</text>
      <text x="0" y="60" fill="#fda4af" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="500" letter-spacing="4" text-anchor="middle" opacity="0.9">${photo.tag.toUpperCase().replace(/&/g, '&amp;')}</text>
      <text x="0" y="120" fill="rgba(255,255,255,0.6)" font-family="'Caveat', cursive" font-size="34" text-anchor="middle">Demo Couple Photo &#8226; Replace in content/photos/</text>
    </g>

    <!-- Bottom Romantic Seal -->
    <g transform="translate(540, 1160)">
      <path d="M0 -15 C -25 -45, -60 -15, 0, 45 C 60 -15, 25 -45, 0 -15 Z" fill="#f43f5e" opacity="0.85"/>
      <text x="0" y="10" fill="#ffffff" font-family="'Playfair Display', serif" font-size="16" font-weight="bold" text-anchor="middle">FOREVER</text>
    </g>
  </svg>`;

  const outPath = path.join(photosDir, photo.name);
  try {
    const sharp = (await import('sharp')).default;
    await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(outPath);
  } catch (err) {
    fs.writeFileSync(outPath, svg);
  }
  console.log(` Created demo photo: ${photo.name}`);
}

async function run() {
  for (const photo of photoDefs) {
    await generatePhoto(photo);
  }
  generateRomanticAudio();
  console.log('\n All demo assets generated successfully in content-example/!\n');
}

run();

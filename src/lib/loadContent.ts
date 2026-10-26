import { SiteConfig } from './types';
import { config as fallbackConfig } from '../../content-example/config.example';

// 1. Resolve Config
// Check if private content/config.ts exists, else fallback to content-example/config.example.ts
const realConfigModules = import.meta.glob<{ default?: SiteConfig; config?: SiteConfig }>(
  '/content/config.ts',
  { eager: true }
);

let activeConfig: SiteConfig = fallbackConfig;
let isUsingRealContent = false;

for (const path in realConfigModules) {
  const mod = realConfigModules[path];
  if (mod && (mod.config || mod.default)) {
    activeConfig = mod.config || mod.default!;
    isUsingRealContent = true;
    break;
  }
}

// 2. Resolve Photos
// Glob both real and example photo directories
const realPhotos = import.meta.glob<string>(
  '/content/photos/*.{jpg,jpeg,png,webp,svg,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' }
);

const examplePhotos = import.meta.glob<string>(
  '/content-example/photos/*.{jpg,jpeg,png,webp,svg,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' }
);

// Helper to look up a photo URL by its filename
export function getPhotoUrl(filename: string): string {
  if (!filename) return createPlaceholderPhoto('No Photo');
  
  // If it's already an absolute URL or data URL
  if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('data:')) {
    return filename;
  }

  // Clean filename of any directory prefixes
  const cleanName = filename.split('/').pop() || filename;

  // 1. Check real photos first if using real content
  for (const path in realPhotos) {
    if (path.endsWith(`/${cleanName}`) || path.endsWith(`/${cleanName.replace(/\.[^.]+$/, '.webp')}`)) {
      return realPhotos[path];
    }
  }

  // 2. Check example photos
  for (const path in examplePhotos) {
    if (path.endsWith(`/${cleanName}`) || path.endsWith(`/${cleanName.replace(/\.[^.]+$/, '.webp')}`)) {
      return examplePhotos[path];
    }
  }

  // 3. Fallback placeholder if missing
  return createPlaceholderPhoto(cleanName);
}

// 3. Resolve Audio
const realAudios = import.meta.glob<string>(
  '/content/audio/*.{mp3,wav,ogg,m4a,aac,MP3,WAV,OGG}',
  { eager: true, query: '?url', import: 'default' }
);

const exampleAudios = import.meta.glob<string>(
  '/content-example/audio/*.{mp3,wav,ogg,m4a,aac,MP3,WAV,OGG}',
  { eager: true, query: '?url', import: 'default' }
);

export function getAudioUrl(filename: string): string | null {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('data:')) {
    return filename;
  }

  const cleanName = filename.split('/').pop() || filename;

  // Real audio
  for (const path in realAudios) {
    if (path.endsWith(`/${cleanName}`)) {
      return realAudios[path];
    }
  }

  // Example audio
  for (const path in exampleAudios) {
    if (path.endsWith(`/${cleanName}`)) {
      return exampleAudios[path];
    }
  }

  // If none found in directory, check public folder or fallback
  return null;
}

// Romantic SVG gradient placeholder if an image is missing
function createPlaceholderPhoto(label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e112a"/>
        <stop offset="50%" stop-color="#3b122d"/>
        <stop offset="100%" stop-color="#140f2b"/>
      </linearGradient>
      <radialGradient id="h" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#f43f5e" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="1000" fill="url(#g)"/>
    <rect width="800" height="1000" fill="url(#h)"/>
    <g transform="translate(400, 460) scale(3.5)" fill="#f43f5e">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" transform="translate(-12, -12)"/>
    </g>
    <text x="400" y="580" fill="#fbcfe8" font-family="'Playfair Display', serif" font-size="28" font-weight="600" text-anchor="middle">${label}</text>
    <text x="400" y="620" fill="#fda4af" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" opacity="0.8" text-anchor="middle">Add photo in content/photos/</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export { activeConfig as config, isUsingRealContent };

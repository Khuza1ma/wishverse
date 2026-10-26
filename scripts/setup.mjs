import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contentDir = path.join(rootDir, 'content');
const contentPhotosDir = path.join(contentDir, 'photos');
const contentAudioDir = path.join(contentDir, 'audio');

const exampleConfigFile = path.join(rootDir, 'content-example', 'config.example.ts');
const targetConfigFile = path.join(contentDir, 'config.ts');

console.log('\n🌸 ===============================================');
console.log('   BIRTHDAY WEBSITE SETUP: PERSONAL CONTENT SETUP');
console.log('===================================================\n');

// 1. Ensure private content folders exist
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
  console.log(' Created directory: content/');
}

if (!fs.existsSync(contentPhotosDir)) {
  fs.mkdirSync(contentPhotosDir, { recursive: true });
  console.log(' Created directory: content/photos/');
}

if (!fs.existsSync(contentAudioDir)) {
  fs.mkdirSync(contentAudioDir, { recursive: true });
  console.log(' Created directory: content/audio/');
}

// 2. Copy config.example.ts to content/config.ts if it does not already exist
if (!fs.existsSync(targetConfigFile)) {
  if (fs.existsSync(exampleConfigFile)) {
    fs.copyFileSync(exampleConfigFile, targetConfigFile);
    console.log(' Copied config.example.ts -> content/config.ts');
  } else {
    console.error(' Error: content-example/config.example.ts not found!');
  }
} else {
  console.log('ℹ️  content/config.ts already exists. Keeping your existing personal config.');
}

console.log('\n Next Steps:');
console.log('  1. Open content/config.ts to customize names, dates, colors, and love letters.');
console.log('  2. Drop your favorite photos into content/photos/ (e.g. milestone-1.jpg, gallery-1.jpg).');
console.log('  3. (Optional) Place your special song into content/audio/ (e.g. song.mp3).');
console.log('  4. Run "npm run optimize-photos" to automatically compress and resize photos to WebP.');
console.log('  5. Run "npm run dev" to launch the 3D romantic experience in your browser!');
console.log('\n🔒 Reminder: All files in content/ are git-ignored and stay 100% private on your machine.\n');

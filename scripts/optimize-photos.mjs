import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function processDirectory(dirName) {
  const dirPath = path.join(rootDir, dirName);
  if (!fs.existsSync(dirPath)) return;

  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (err) {
    console.warn('⚠️  Sharp is not installed or available yet. Skipping optimization.');
    return;
  }

  const files = fs.readdirSync(dirPath);
  const imageExtensions = ['.jpg', '.jpeg', '.png'];

  console.log(`\n📸 Optimizing photos in ${dirName}...`);
  let count = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.includes(ext)) continue;

    const baseName = path.basename(file, ext);
    const inputPath = path.join(dirPath, file);
    const outputPath = path.join(dirPath, `${baseName}.webp`);

    try {
      // Resize to max 1600px on long edge, convert to high-efficiency WebP, strip EXIF metadata
      await sharp(inputPath)
        .rotate() // auto-orient based on EXIF before stripping
        .resize({
          width: 1600,
          height: 1600,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 82, effort: 4 })
        .toFile(outputPath);

      console.log(`  ✓ Converted: ${file} -> ${baseName}.webp (EXIF stripped for privacy)`);
      count++;
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
    }
  }

  console.log(`🎉 Finished optimizing ${count} photos in ${dirName}.`);
}

async function run() {
  console.log('\n=============================================');
  console.log('   PHOTO OPTIMIZER & PRIVACY STRIPPER        ');
  console.log('=============================================');

  // Process both example photos and private content photos
  await processDirectory(path.join('content-example', 'photos'));
  await processDirectory(path.join('content', 'photos'));

  console.log('\n✨ Optimization complete! Ready for web deployment.\n');
}

run();

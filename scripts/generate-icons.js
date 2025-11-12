const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const svgPath = path.join(__dirname, '..', 'app', 'icon.svg');
  const publicPath = path.join(__dirname, '..', 'public');

  // Read SVG file
  const svgBuffer = fs.readFileSync(svgPath);

  // Icon sizes to generate
  const sizes = [
    { size: 180, name: 'apple-icon.png' },
    { size: 192, name: 'icon-192.png' },
    { size: 512, name: 'icon-512.png' }
  ];

  console.log('🔥 Generating PicForge icons from SVG...\n');

  for (const { size, name } of sizes) {
    try {
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(path.join(publicPath, name));

      console.log(`✅ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${name}:`, error.message);
    }
  }

  console.log('\n🎉 Icon generation complete!');
  console.log('📱 Icons ready for iOS, Android, and PWA');
}

generateIcons().catch(console.error);

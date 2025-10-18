const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  try {
    console.log('🔄 Generating favicons from camera icon SVG...');

    const svgPath = path.join(__dirname, '..', 'public', 'camera-icon.svg');

    if (!fs.existsSync(svgPath)) {
      console.error('❌ Error: camera-icon.svg not found');
      process.exit(1);
    }

    const publicDir = path.join(__dirname, '..', 'public');

    // Generate favicon.ico (32x32 PNG, browsers accept PNG as ICO)
    await sharp(svgPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('✅ Generated favicon.ico (32x32)');

    // Generate 16x16 favicon
    await sharp(svgPath)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16.png'));
    console.log('✅ Generated favicon-16.png');

    // Generate 32x32 favicon
    await sharp(svgPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32.png'));
    console.log('✅ Generated favicon-32.png');

    // Generate icon-192.png (for PWA)
    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✅ Generated icon-192.png');

    // Generate icon-512.png (for PWA)
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✅ Generated icon-512.png');

    // Generate apple-icon.png (180x180 for iOS)
    await sharp(svgPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-icon.png'));
    console.log('✅ Generated apple-icon.png');

    // Copy SVG as icon.svg
    fs.copyFileSync(svgPath, path.join(publicDir, 'icon.svg'));
    console.log('✅ Updated icon.svg');

    console.log('');
    console.log('🎉 All favicon files generated successfully!');
    console.log('📁 Files created:');
    console.log('   - public/favicon.ico');
    console.log('   - public/favicon-16.png');
    console.log('   - public/favicon-32.png');
    console.log('   - public/icon-192.png');
    console.log('   - public/icon-512.png');
    console.log('   - public/apple-icon.png');
    console.log('   - public/icon.svg');

  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();

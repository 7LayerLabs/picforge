const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  try {
    console.log('🔄 Generating favicon.ico from camera icon...');

    const inputPath = path.join(__dirname, '..', 'public', 'camera-icon.png');
    const outputPath = path.join(__dirname, '..', 'public', 'favicon.ico');

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('❌ Error: camera-icon.png not found in public folder');
      console.log('📝 Please save the camera icon as public/camera-icon.png first');
      process.exit(1);
    }

    // Read the image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    console.log(`📐 Input image: ${metadata.width}x${metadata.height}`);

    // Generate 32x32 favicon (ICO standard size)
    await image
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(outputPath.replace('.ico', '-32.png'));

    console.log('✅ Generated favicon-32.png');

    // Generate 16x16 favicon
    await sharp(inputPath)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(outputPath.replace('.ico', '-16.png'));

    console.log('✅ Generated favicon-16.png');

    // Generate standard sizes
    await sharp(inputPath)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'icon-192.png'));

    console.log('✅ Generated icon-192.png');

    await sharp(inputPath)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'icon-512.png'));

    console.log('✅ Generated icon-512.png');

    await sharp(inputPath)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'apple-icon.png'));

    console.log('✅ Generated apple-icon.png');

    // For actual ICO file, we'll use the 32x32 PNG and rename it
    // Modern browsers support PNG favicons just fine
    fs.copyFileSync(
      outputPath.replace('.ico', '-32.png'),
      path.join(__dirname, '..', 'public', 'favicon.ico')
    );

    console.log('✅ Generated favicon.ico');
    console.log('');
    console.log('🎉 All favicon files generated successfully!');
    console.log('📁 Files created:');
    console.log('   - public/favicon.ico (32x32)');
    console.log('   - public/favicon-16.png');
    console.log('   - public/favicon-32.png');
    console.log('   - public/icon-192.png');
    console.log('   - public/icon-512.png');
    console.log('   - public/apple-icon.png');

  } catch (error) {
    console.error('❌ Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();

const fs = require('fs');
const path = require('path');

/**
 * Generate favicon.ico from SVG using SVG to ICO conversion
 * This script creates a basic favicon.ico file from the icon.svg
 */

// Simple SVG to ICO conversion function
function svgToIco(svgPath, icoPath) {
  try {
    // Try using sharp if available
    const sharp = require('sharp');

    sharp(svgPath)
      .resize(32, 32)
      .png()
      .toBuffer()
      .then(buffer => {
        // Create a basic ICO structure
        // ICO format is complex, but for basic usage, we can create a simple single-icon ICO
        const ico = createIcoFromPng(buffer);
        fs.writeFileSync(icoPath, ico);
        console.log('✅ favicon.ico created successfully using sharp');
      })
      .catch(err => {
        console.log('Sharp not available, using fallback method');
        createFallbackIco(svgPath, icoPath);
      });
  } catch (error) {
    console.log('Sharp not available, using fallback method');
    createFallbackIco(svgPath, icoPath);
  }
}

function createIcoFromPng(pngBuffer) {
  // Create a basic ICO file structure
  // This is a simplified ICO creation - for production, consider using a proper library
  const iconEntry = Buffer.alloc(16);
  const iconHeader = Buffer.alloc(6);

  // ICO header
  iconHeader.writeUInt16LE(0, 0); // Reserved
  iconHeader.writeUInt16LE(1, 2); // Type (1 = icon)
  iconHeader.writeUInt16LE(1, 4); // Number of icons

  // Icon entry
  iconEntry.writeUInt8(32, 0);  // Width
  iconEntry.writeUInt8(32, 1);  // Height
  iconEntry.writeUInt8(0, 2);   // Color palette
  iconEntry.writeUInt8(0, 3);   // Reserved
  iconEntry.writeUInt16LE(1, 4); // Color planes
  iconEntry.writeUInt16LE(32, 6); // Bits per pixel
  iconEntry.writeUInt32LE(pngBuffer.length, 8); // Image size
  iconEntry.writeUInt32LE(22, 12); // Image offset

  return Buffer.concat([iconHeader, iconEntry, pngBuffer]);
}

function createFallbackIco(svgPath, icoPath) {
  // Read the SVG file
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  // Create a minimal ICO file by converting SVG to a base64 data URL
  // and creating a simple ICO structure
  console.log('Creating fallback favicon.ico...');

  // For the fallback, we'll create a simple 16x16 PNG-based ICO
  // This is a very basic implementation
  const icoHeader = Buffer.from([
    0x00, 0x00, // Reserved
    0x01, 0x00, // Type (1 = icon)
    0x01, 0x00  // Number of icons
  ]);

  const iconEntry = Buffer.from([
    0x10, // Width (16)
    0x10, // Height (16)
    0x00, // Color palette entries
    0x00, // Reserved
    0x01, 0x00, // Color planes
    0x20, 0x00, // Bits per pixel (32)
    0x00, 0x00, 0x00, 0x00, // Image size (will be updated)
    0x16, 0x00, 0x00, 0x00  // Image offset
  ]);

  // Create a minimal PNG representation
  // For simplicity, we'll create a basic colored square
  const pngData = createBasicPng();

  // Update image size in icon entry
  iconEntry.writeUInt32LE(pngData.length, 8);

  const icoBuffer = Buffer.concat([icoHeader, iconEntry, pngData]);
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('✅ Basic favicon.ico created');
}

function createBasicPng() {
  // Create a very basic 16x16 PNG with PicForge colors
  // This is a minimal PNG structure for the favicon
  const width = 16;
  const height = 16;

  // PNG signature
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);  // Bit depth
  ihdrData.writeUInt8(2, 9);  // Color type (RGB)
  ihdrData.writeUInt8(0, 10); // Compression
  ihdrData.writeUInt8(0, 11); // Filter
  ihdrData.writeUInt8(0, 12); // Interlace

  const ihdrChunk = createPngChunk('IHDR', ihdrData);

  // Simple IDAT chunk with a colored square
  const imageData = Buffer.alloc(width * height * 3);
  for (let i = 0; i < imageData.length; i += 3) {
    imageData[i] = 0xFF;     // Red
    imageData[i + 1] = 0x63; // Green
    imageData[i + 2] = 0x47; // Blue (approximating PicForge orange/red)
  }

  const idatChunk = createPngChunk('IDAT', imageData);
  const iendChunk = createPngChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
}

function createPngChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type);
  const crc = calculateCRC(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function calculateCRC(data) {
  // Simplified CRC calculation for PNG
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = crc ^ data[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xEDB88320;
      } else {
        crc = crc >>> 1;
      }
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Main execution
const svgPath = path.join(__dirname, '..', 'public', 'icon.svg');
const icoPath = path.join(__dirname, '..', 'public', 'favicon.ico');

if (!fs.existsSync(svgPath)) {
  console.error('❌ icon.svg not found at:', svgPath);
  process.exit(1);
}

console.log('🔄 Generating favicon.ico from icon.svg...');
svgToIco(svgPath, icoPath);
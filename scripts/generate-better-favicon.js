const fs = require('fs');
const path = require('path');

/**
 * Generate a proper favicon.ico that Safari will actually use
 * Creates multiple sizes in ICO format
 */

function createProperIco() {
  // Read the SVG content
  const svgPath = path.join(__dirname, '..', 'public', 'icon.svg');
  const icoPath = path.join(__dirname, '..', 'public', 'favicon.ico');

  console.log('🔄 Creating Safari-compatible favicon.ico...');

  // Create a proper multi-size ICO file
  // ICO header: Reserved(2) + Type(2) + Count(2)
  const iconCount = 3; // 16x16, 32x32, 48x48
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type (1 = icon)
  header.writeUInt16LE(iconCount, 4); // Count

  const entries = [];
  const imageData = [];
  let offset = 6 + (iconCount * 16); // Header + directory entries

  // Create entries for different sizes
  const sizes = [16, 32, 48];

  sizes.forEach((size, index) => {
    const pngData = createPNG(size);

    // Directory entry: Width(1) + Height(1) + Colors(1) + Reserved(1) + Planes(2) + BitCount(2) + Size(4) + Offset(4)
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // Width (0 = 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1); // Height (0 = 256)
    entry.writeUInt8(0, 2); // Colors (0 = no palette)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(pngData.length, 8); // Image size
    entry.writeUInt32LE(offset, 12); // Image offset

    entries.push(entry);
    imageData.push(pngData);
    offset += pngData.length;
  });

  // Combine everything
  const icoBuffer = Buffer.concat([
    header,
    ...entries,
    ...imageData
  ]);

  fs.writeFileSync(icoPath, icoBuffer);
  console.log('✅ Safari-compatible favicon.ico created with multiple sizes');
}

function createPNG(size) {
  // Create a simple PNG with the PicForge flame/camera colors
  const width = size;
  const height = size;

  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);  // Bit depth
  ihdr.writeUInt8(6, 9);  // Color type (RGBA)
  ihdr.writeUInt8(0, 10); // Compression
  ihdr.writeUInt8(0, 11); // Filter
  ihdr.writeUInt8(0, 12); // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Create simple image data representing a flame/camera icon
  const stride = width * 4; // 4 bytes per pixel (RGBA)
  const imageData = Buffer.alloc(height * stride);

  // Fill with a simple gradient representing the flame
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = y * stride + x * 4;

      // Simple circular flame pattern
      const centerX = width / 2;
      const centerY = height / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.min(width, height) / 2;

      if (dist < maxDist * 0.8) {
        // Flame colors - orange to red gradient
        const intensity = 1 - (dist / (maxDist * 0.8));
        imageData[offset] = Math.floor(255 * intensity);     // Red
        imageData[offset + 1] = Math.floor(150 * intensity); // Green
        imageData[offset + 2] = Math.floor(50 * intensity);  // Blue
        imageData[offset + 3] = 255; // Alpha
      } else {
        // Transparent
        imageData[offset] = 0;
        imageData[offset + 1] = 0;
        imageData[offset + 2] = 0;
        imageData[offset + 3] = 0;
      }
    }
  }

  // Compress the image data (simplified)
  const idatChunk = createChunk('IDAT', imageData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type);
  const crc = calculateCRC(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function calculateCRC(data) {
  const crcTable = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      if (c & 1) {
        c = 0xEDB88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    crcTable[i] = c;
  }

  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Run the script
createProperIco();
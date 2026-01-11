const fs = require('fs');
const path = require('path');

// Simple PNG generator for PWA icons
// Creates minimal valid PNG files with the VC logo

function createPNG(width, height) {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);  // bit depth
  ihdrData.writeUInt8(2, 9);  // color type (RGB)
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdr = createChunk('IHDR', ihdrData);

  // Create image data - teal background with white "VC" text simulation
  const rawData = [];
  const teal = [0x2D, 0x5A, 0x4A]; // #2D5A4A
  const white = [0xFF, 0xFF, 0xFF];

  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      // Create a simple circular logo with VC initials
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(width, height) * 0.4;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      // Check if inside circle
      if (dist < r) {
        // Inside circle - check for letter areas
        const relX = (x - cx) / r;
        const relY = (y - cy) / r;

        // Simple V shape on left
        const inV = relX < 0 && relX > -0.6 &&
                   Math.abs(relY) < 0.5 - Math.abs(relX + 0.3) * 0.8;

        // Simple C shape on right
        const inC = relX > 0.1 && relX < 0.5 &&
                   Math.abs(relY) < 0.4 &&
                   !(relX > 0.2 && relX < 0.4 && Math.abs(relY) < 0.25);

        if (inV || inC) {
          rawData.push(...white);
        } else {
          rawData.push(...teal);
        }
      } else {
        // Outside circle - background
        rawData.push(...teal);
      }
    }
  }

  // Compress with zlib (simple deflate)
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));

  const idat = createChunk('IDAT', compressed);

  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);

  const typeBuffer = Buffer.from(type);
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = crc32(crcData);

  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 implementation
function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = makeCRCTable();

  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
  }

  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeCRCTable() {
  const table = new Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

// Generate icons
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
  const png = createPNG(size, size);
  const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
  fs.writeFileSync(filename, png);
  console.log(`Created ${filename}`);
});

// Create screenshot placeholders (simple colored rectangles)
const wideScreenshot = createPNG(1280, 720);
fs.writeFileSync(path.join(iconsDir, 'screenshot-wide.png'), wideScreenshot);
console.log('Created screenshot-wide.png');

const narrowScreenshot = createPNG(720, 1280);
fs.writeFileSync(path.join(iconsDir, 'screenshot-narrow.png'), narrowScreenshot);
console.log('Created screenshot-narrow.png');

// Create favicon
const favicon = createPNG(32, 32);
fs.writeFileSync(path.join(iconsDir, '..', 'favicon.ico'), favicon);
console.log('Created favicon.ico');

// Create apple-touch-icon
const appleTouchIcon = createPNG(180, 180);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleTouchIcon);
console.log('Created apple-touch-icon.png');

console.log('\nAll icons generated successfully!');

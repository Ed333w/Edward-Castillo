// One-off script: generates the PWA icon PNGs from scratch (no image
// dependency) so the app has real, valid manifest icons. Run with:
//   node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0; // filter: none
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function createCanvas(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const set = (x, y, [r, g, b, a]) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    rgba[i] = r;
    rgba[i + 1] = g;
    rgba[i + 2] = b;
    rgba[i + 3] = a;
  };
  const fillRoundedRect = (x0, y0, w, h, r, color) => {
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) {
        const dx = x < x0 + r ? x0 + r - x : x > x0 + w - r ? x - (x0 + w - r) : 0;
        const dy = y < y0 + r ? y0 + r - y : y > y0 + h - r ? y - (y0 + h - r) : 0;
        if (dx > 0 && dy > 0 && dx * dx + dy * dy > r * r) continue;
        set(x, y, color);
      }
    }
  };
  const fillCircle = (cx, cy, r, color) => {
    for (let y = cy - r; y <= cy + r; y++) {
      for (let x = cx - r; x <= cx + r; x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) set(x, y, color);
      }
    }
  };
  return { rgba, fillRoundedRect, fillCircle };
}

function drawIcon(size) {
  const { rgba, fillRoundedRect, fillCircle } = createCanvas(size);
  const primary = [79, 70, 229, 255]; // #4f46e5
  const white = [255, 255, 255, 255];

  // Background fills edge-to-edge so the icon also works as a maskable icon.
  fillRoundedRect(0, 0, size, size, Math.round(size * 0.18), primary);

  // Calendar "header bar" near the top.
  const barY = Math.round(size * 0.24);
  const barH = Math.round(size * 0.1);
  fillRoundedRect(Math.round(size * 0.22), barY, Math.round(size * 0.56), barH, Math.round(barH / 2), white);

  // Two dots representing Edward & Vale sharing the calendar.
  const dotR = Math.round(size * 0.09);
  fillCircle(Math.round(size * 0.38), Math.round(size * 0.62), dotR, white);
  fillCircle(Math.round(size * 0.62), Math.round(size * 0.62), dotR, white);

  return encodePng(size, size, rgba);
}

for (const size of [192, 512]) {
  writeFileSync(join(outDir, `icon-${size}.png`), drawIcon(size));
}
writeFileSync(join(outDir, 'maskable-512.png'), drawIcon(512));

console.log('Icons written to', outDir);

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
mkdirSync(root, { recursive: true });

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const AMBER = [245, 158, 11];
const WHITE = [255, 255, 255];

const N_GLYPH = [
  [1, 0, 0, 0, 1],
  [1, 1, 0, 0, 1],
  [1, 1, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 1, 1],
  [1, 0, 0, 1, 1],
  [1, 0, 0, 0, 1],
];

function inRoundedRect(x, y, x0, y0, w, h, r) {
  if (x < x0 || x >= x0 + w || y < y0 || y >= y0 + h) return false;
  const cx = Math.min(Math.max(x, x0 + r), x0 + w - 1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y0 + h - 1 - r);
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function makeIcon(size, maskable) {
  const pad = maskable ? 0 : Math.round(size * 0.1);
  const inner = size - pad * 2;
  const radius = Math.round(inner * 0.24);
  const px = Buffer.alloc(size * size * 4);

  const scale = Math.max(1, Math.floor((inner * 0.52) / 5));
  const glyphW = 5 * scale;
  const glyphH = 7 * scale;
  const gx0 = Math.floor((size - glyphW) / 2);
  const gy0 = Math.floor((size - glyphH) / 2);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const inCard = maskable || inRoundedRect(x, y, pad, pad, inner, inner, radius);
      let color = AMBER;
      let alpha = 255;
      if (!inCard) {
        color = AMBER;
        alpha = 0;
      }
      if (
        alpha === 255 &&
        x >= gx0 && x < gx0 + glyphW &&
        y >= gy0 && y < gy0 + glyphH
      ) {
        const col = Math.floor((x - gx0) / scale);
        const row = Math.floor((y - gy0) / scale);
        if (N_GLYPH[row][col]) color = WHITE;
      }
      px[i] = color[0];
      px[i + 1] = color[1];
      px[i + 2] = color[2];
      px[i + 3] = alpha;
    }
  }

  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

writeFileSync(join(root, "icon-192.png"), makeIcon(192, false));
writeFileSync(join(root, "icon-512.png"), makeIcon(512, false));
writeFileSync(join(root, "icon-512-maskable.png"), makeIcon(512, true));
writeFileSync(join(root, "apple-touch-icon.png"), makeIcon(180, false));
console.log("Icons geschreven naar public/");

// One-off generator for placeholder toolbar icons (no image-editing tools
// needed). Draws a simple white "T" monogram on the app's accent color and
// writes raw PNGs by hand (IHDR/IDAT/IEND) using only Node's zlib built-in.
// Re-run with `node scripts/generate-icons.mjs` after editing the design;
// replace with real artwork whenever you have it.
import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'icons')

const BG = [0x00, 0x88, 0xb0, 0xff] // accent teal used throughout the popup UI
const FG = [0xff, 0xff, 0xff, 0xff]

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

// Draws a blocky "T" as a fraction of the canvas so it stays legible from
// 16px up to 128px.
function pixelIsForeground(x, y, size) {
  const nx = x / size
  const ny = y / size
  const inTopBar = ny >= 0.18 && ny <= 0.32 && nx >= 0.14 && nx <= 0.86
  const inStem = ny >= 0.18 && ny <= 0.82 && nx >= 0.42 && nx <= 0.58
  return inTopBar || inStem
}

function buildPng(size) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)
  ihdrData.writeUInt32BE(size, 4)
  ihdrData[8] = 8 // bit depth
  ihdrData[9] = 6 // color type: RGBA
  ihdrData[10] = 0
  ihdrData[11] = 0
  ihdrData[12] = 0
  const ihdr = chunk('IHDR', ihdrData)

  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1)
    raw[rowStart] = 0 // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelIsForeground(x, y, size) ? FG : BG
      const px = rowStart + 1 + x * 4
      raw[px] = r
      raw[px + 1] = g
      raw[px + 2] = b
      raw[px + 3] = a
    }
  }
  const idat = chunk('IDAT', deflateSync(raw))
  const iend = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdr, idat, iend])
}

mkdirSync(outDir, { recursive: true })
for (const size of [16, 48, 128]) {
  const file = path.join(outDir, `icon${size}.png`)
  writeFileSync(file, buildPng(size))
  console.log('wrote', file)
}

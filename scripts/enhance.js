/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PRODUCTS_JSON = 'src/data/products.json';
const OUTPUT_PERFUMES_DIR = 'public/images/products/enhanced/perfumes';
const OUTPUT_MAKEUP_DIR = 'public/images/products/enhanced/makeup';

const PERFUME_FILENAMES = [
  'good-girl-blush-elixir.webp',
  'libre-eau-de-parfum.webp',
  'interdit-rouge.webp',
  'burberry-goddess.webp',
  'good-girl-blush.webp',
  'libre-intense.webp',
  'narciso-for-her-intense.webp',
  'prada-paradoxe.webp',
  'valentino-donna-born-in-roma.webp',
  'narciso-pure-musc.webp'
];

const MAKEUP_FILENAMES = [
  'nars-insatiable-liquid-blush.webp',
  'nars-radiant-creamy-concealer-mini.webp',
  'nars-blush-en-poudre.webp',
  'nyx-buttermelt-blush.webp',
  'nyx-fat-oil-lip-drip.webp',
  'it-cosmetics-cc-plus.webp',
  'ysl-make-me-blush.webp',
  'hudabeauty-matte-concealer.webp',
  'hudabeauty-blush-filter-liquid.webp',
  'hudabeauty-blush-filter-palette.webp'
];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function enhanceSingleProduct(inputPath, outputPath, isDarkBgProduct = false) {
  const origStat = fs.statSync(inputPath);
  const origMeta = await sharp(inputPath).metadata();
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });

  const getPixel = (x, y) => {
    const idx = (y * info.width + x) * info.channels;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  const tl = getPixel(4, 4);
  const isDark = isDarkBgProduct || ((tl[0] + tl[1] + tl[2]) / 3 < 80);

  const TARGET_W = 800;
  const TARGET_H = 1000;

  if (isDark) {
    // For dark luxury photos (Good Girl Blush Elixir):
    // Resize the full photograph to fit inside 800x1000 and center on luxury dark background
    const resizedBuf = await sharp(inputPath)
      .resize(760, 920, {
        fit: 'inside',
        kernel: sharp.kernel.lanczos3
      })
      .toBuffer();

    const resizedMeta = await sharp(resizedBuf).metadata();
    const top = Math.round((TARGET_H - resizedMeta.height) / 2);
    const left = Math.round((TARGET_W - resizedMeta.width) / 2);

    const bgColor = { r: 12, g: 12, b: 15 };

    await sharp({
      create: {
        width: TARGET_W,
        height: TARGET_H,
        channels: 3,
        background: bgColor
      }
    })
      .composite([{ input: resizedBuf, top, left }])
      .linear(1.04, -4)
      .sharpen({ sigma: 1.0, flat: 1.0, jagged: 1.4 })
      .webp({ quality: 90, effort: 6 })
      .toFile(outputPath);
  } else {
    // For white background products:
    // 1. Detect non-white content bounding box
    let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * info.channels;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r < 248 || g < 248 || b < 248) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (minX >= maxX || minY >= maxY) {
      minX = 0; maxX = info.width - 1;
      minY = 0; maxY = info.height - 1;
    }

    // Add breathing room margin around the product (20px) to preserve contact shadow & anti-aliasing
    const margin = 20;
    const extLeft = Math.max(0, minX - margin);
    const extTop = Math.max(0, minY - margin);
    const extRight = Math.min(info.width, maxX + margin);
    const extBottom = Math.min(info.height, maxY + margin);
    const extW = extRight - extLeft;
    const extH = extBottom - extTop;

    // Target product dimensions: 75% to 80% of canvas height (760px), max width 680px
    const MAX_TARGET_H = 780;
    const MAX_TARGET_W = 680;

    // Extract product
    const extractedBuf = await sharp(inputPath)
      .extract({ left: extLeft, top: extTop, width: extW, height: extH })
      .resize(MAX_TARGET_W, MAX_TARGET_H, {
        fit: 'inside',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
        kernel: sharp.kernel.lanczos3
      })
      .toBuffer();

    const extractedMeta = await sharp(extractedBuf).metadata();
    const top = Math.round((TARGET_H - extractedMeta.height) / 2);
    const left = Math.round((TARGET_W - extractedMeta.width) / 2);

    await sharp({
      create: {
        width: TARGET_W,
        height: TARGET_H,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    })
      .composite([{ input: extractedBuf, top, left }])
      .linear(1.02, -1) // subtle contrast boost
      .sharpen({ sigma: 0.9, flat: 1.0, jagged: 1.3 })
      .webp({ quality: 90, effort: 6 })
      .toFile(outputPath);
  }

  const enhancedStat = fs.statSync(outputPath);
  const enhancedMeta = await sharp(outputPath).metadata();

  return {
    origPath: inputPath,
    origDims: `${origMeta.width}x${origMeta.height}`,
    origSizeKB: (origStat.size / 1024).toFixed(1),
    enhancedPath: outputPath,
    enhancedDims: `${enhancedMeta.width}x${enhancedMeta.height}`,
    enhancedSizeKB: (enhancedStat.size / 1024).toFixed(1),
    isDark
  };
}

async function createContactSheet(title, items, outputPath) {
  const CARD_W = 860;
  const CARD_H = 620;
  const GAP_X = 40;
  const GAP_Y = 40;
  const HEADER_H = 120;
  const COLS = 2;
  const ROWS = Math.ceil(items.length / COLS);

  const SHEET_W = COLS * CARD_W + (COLS + 1) * GAP_X;
  const SHEET_H = HEADER_H + ROWS * CARD_H + (ROWS + 1) * GAP_Y;

  const composites = [];

  // Header SVG
  const headerSvg = `
    <svg width="${SHEET_W}" height="${HEADER_H}" viewBox="0 0 ${SHEET_W} ${HEADER_H}">
      <rect width="100%" height="100%" fill="#141414"/>
      <text x="${SHEET_W / 2}" y="45" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#CBB281" text-anchor="middle" letter-spacing="4">
        BELVANIA STORE — PRODUCT IMAGE QUALITY CONTROL
      </text>
      <text x="${SHEET_W / 2}" y="80" font-family="Arial, sans-serif" font-size="16" fill="#FAF8F5" text-anchor="middle" letter-spacing="2">
        ${title.toUpperCase()} (10 PRODUITS) — COMPARATIF AVANT / APRÈS (FORMAT 4:5 STUDIO LUXE)
      </text>
    </svg>
  `;
  composites.push({
    input: Buffer.from(headerSvg),
    top: 0,
    left: 0
  });

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const row = Math.floor(i / COLS);
    const col = i % COLS;

    const cardLeft = GAP_X + col * (CARD_W + GAP_X);
    const cardTop = HEADER_H + GAP_Y + row * (CARD_H + GAP_Y);

    const cardSvg = `
      <svg width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}">
        <rect width="${CARD_W}" height="${CARD_H}" fill="#FFFFFF" stroke="#EADFD7" stroke-width="2"/>
        <rect x="0" y="0" width="${CARD_W}" height="40" fill="#FAF8F5"/>
        <text x="20" y="26" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#141414" letter-spacing="1">
          #${i + 1} ${item.name.toUpperCase()} — ${item.brand.toUpperCase()} (${item.price} DH)
        </text>
        <text x="200" y="66" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#8C827A" text-anchor="middle" letter-spacing="1">
          ORIGINAL (${item.origDims} · ${item.origSizeKB} KB)
        </text>
        <text x="${CARD_W - 200}" y="66" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#B79A5E" text-anchor="middle" letter-spacing="1">
          AMÉLIORÉ 4:5 (${item.enhancedDims} · ${item.enhancedSizeKB} KB)
        </text>
        <rect x="20" y="78" width="380" height="475" fill="#F6F2EE" stroke="#DECFC4" stroke-width="1"/>
        <rect x="${CARD_W - 400}" y="78" width="380" height="475" fill="#FFFFFF" stroke="#CBB281" stroke-width="1.5"/>
        <text x="20" y="585" font-family="Arial, sans-serif" font-size="11" fill="#736A63">
          Source : ${item.origPath}
        </text>
        <text x="${CARD_W - 400}" y="585" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#141414">
          Cible : ${path.basename(item.enhancedPath)} (WebP 4:5 centré)
        </text>
      </svg>
    `;

    composites.push({
      input: Buffer.from(cardSvg),
      top: cardTop,
      left: cardLeft
    });

    // Original thumbnail
    const origThumbBuf = await sharp(item.origPath)
      .resize(376, 471, {
        fit: 'contain',
        background: { r: 246, g: 242, b: 238, alpha: 1 }
      })
      .toBuffer();

    composites.push({
      input: origThumbBuf,
      top: cardTop + 80,
      left: cardLeft + 22
    });

    // Enhanced thumbnail
    const enhThumbBuf = await sharp(item.enhancedPath)
      .resize(376, 471, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toBuffer();

    composites.push({
      input: enhThumbBuf,
      top: cardTop + 80,
      left: cardLeft + (CARD_W - 398)
    });
  }

  await sharp({
    create: {
      width: SHEET_W,
      height: SHEET_H,
      channels: 3,
      background: { r: 250, g: 248, b: 245 }
    }
  })
    .composite(composites)
    .jpeg({ quality: 88 })
    .toFile(outputPath);

  console.log(`Contact sheet generated: ${outputPath} (${SHEET_W}x${SHEET_H})`);
}

async function main() {
  console.log('=== BELVANIA STORE — ENHANCEMENT ENGINE STARTED ===');

  await ensureDir(OUTPUT_PERFUMES_DIR);
  await ensureDir(OUTPUT_MAKEUP_DIR);

  const raw = fs.readFileSync(PRODUCTS_JSON, 'utf8');
  const products = JSON.parse(raw);

  const perfumes = products.filter(p => p.category === 'parfum');
  const makeup = products.filter(p => p.category === 'makeup');

  console.log(`Loaded ${perfumes.length} perfumes and ${makeup.length} makeup products.`);

  const perfumeResults = [];
  for (let i = 0; i < perfumes.length; i++) {
    const p = perfumes[i];
    const src = path.join('public', p.images[0].replace(/^\//, ''));
    const targetFilename = PERFUME_FILENAMES[i];
    const dest = path.join(OUTPUT_PERFUMES_DIR, targetFilename);

    console.log(`[${i + 1}/10] Enhancing Perfume: ${p.name} -> ${targetFilename}...`);
    const res = await enhanceSingleProduct(src, dest, p.id === 'parfum_goodgirl_blush_elixir');
    perfumeResults.push({
      ...res,
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price
    });
  }

  const makeupResults = [];
  for (let i = 0; i < makeup.length; i++) {
    const p = makeup[i];
    const src = path.join('public', p.images[0].replace(/^\//, ''));
    const targetFilename = MAKEUP_FILENAMES[i];
    const dest = path.join(OUTPUT_MAKEUP_DIR, targetFilename);

    console.log(`[${i + 1}/10] Enhancing Makeup: ${p.name} -> ${targetFilename}...`);
    const res = await enhanceSingleProduct(src, dest, false);
    makeupResults.push({
      ...res,
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price
    });
  }

  // Generate Contact Sheets
  const perfumesSheetPath = 'public/images/products/enhanced/perfumes-before-after.jpg';
  const makeupSheetPath = 'public/images/products/enhanced/makeup-before-after.jpg';

  console.log('Generating Perfumes Before/After contact sheet...');
  await createContactSheet('Parfums de Luxe', perfumeResults, perfumesSheetPath);

  console.log('Generating Makeup Before/After contact sheet...');
  await createContactSheet('Maquillage Haute Performance', makeupResults, makeupSheetPath);

  // Write results JSON
  fs.writeFileSync(
    'public/images/products/enhanced/results.json',
    JSON.stringify({ perfumes: perfumeResults, makeup: makeupResults }, null, 2)
  );

  console.log('=== ALL 20 PRODUCTS ENHANCED SUCCESSFULLY ===');
}

main().catch(err => {
  console.error('Enhancement error:', err);
  process.exit(1);
});

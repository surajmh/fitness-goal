import { createRequire } from 'node:module';
import { existsSync, renameSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const Jimp = require('jimp-compact');
const root = dirname(dirname(fileURLToPath(import.meta.url)));

const colors = {
  canvas: [7, 10, 16],
  tile: [16, 21, 29],
  outline: [52, 61, 75],
  mint: [148, 232, 209],
  coral: [255, 56, 88],
  lime: [56, 209, 106],
  cyan: [22, 137, 248],
  violet: [180, 92, 242],
};

const gradientStops = [colors.coral, colors.lime, colors.cyan, colors.violet, colors.coral];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const mix = (a, b, t) => a.map((value, index) => Math.round(value + (b[index] - value) * t));

function gradientColor(x, y, center) {
  const t = (Math.atan2(y - center, x - center) + Math.PI) / (Math.PI * 2);
  const position = t * 4;
  const index = Math.min(3, Math.floor(position));
  return mix(gradientStops[index], gradientStops[index + 1], position - index);
}

function distanceToSegment(x, y, [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy), 0, 1);
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
}

function roundedRectDistance(x, y, left, top, right, bottom, radius) {
  const dx = Math.max(left + radius - x, 0, x - right + radius);
  const dy = Math.max(top + radius - y, 0, y - bottom + radius);
  return Math.hypot(dx, dy) - radius;
}

function alphaForDistance(distance, halfWidth = 0) {
  return clamp(0.5 - (distance - halfWidth), 0, 1);
}

function composite(base, overlay, alpha) {
  const sourceAlpha = (overlay[3] ?? 255) / 255 * alpha;
  const baseAlpha = (base[3] ?? 255) / 255;
  const outputAlpha = sourceAlpha + baseAlpha * (1 - sourceAlpha);
  if (outputAlpha === 0) return [0, 0, 0, 0];
  return [
    ...base.slice(0, 3).map((value, index) => Math.round((overlay[index] * sourceAlpha + value * baseAlpha * (1 - sourceAlpha)) / outputAlpha)),
    Math.round(outputAlpha * 255),
  ];
}

function paintLayer(pixel, color, alpha) {
  if (alpha <= 0) return pixel;
  return composite(pixel, [...color, 255], alpha);
}

function render({ background = false, tile = false, markScale = 1 }) {
  const size = 1024;
  const center = size / 2;
  const image = new Jimp(size, size, background ? 0x070a10ff : 0x00000000);
  const segments = [
    [[512, 690], [512, 330]],
    [[512, 470], [408, 394]],
    [[512, 556], [620, 454]],
    [[512, 470], [612, 374]],
  ];
  const nodes = [
    [512, 324, 31, colors.lime],
    [402, 390, 29, colors.coral],
    [624, 450, 29, colors.cyan],
    [616, 370, 29, colors.violet],
  ];

  image.scan(0, 0, size, size, function scan(x, y, index) {
    let pixel = [this.bitmap.data[index], this.bitmap.data[index + 1], this.bitmap.data[index + 2], this.bitmap.data[index + 3]];
    const px = center + (x - center) / markScale;
    const py = center + (y - center) / markScale;

    if (tile) {
      const tileDistance = roundedRectDistance(x, y, 116, 116, 908, 908, 180);
      pixel = paintLayer(pixel, colors.tile, alphaForDistance(tileDistance));
      pixel = paintLayer(pixel, colors.outline, alphaForDistance(Math.abs(tileDistance) - 3));
    }

    const radius = Math.hypot(px - center, py - center);
    pixel = paintLayer(pixel, gradientColor(px, py, center), alphaForDistance(Math.abs(radius - 320), 24));
    pixel = paintLayer(pixel, colors.lime, alphaForDistance(Math.abs(radius - 218), 15) * 0.72);

    for (const [a, b] of segments) {
      pixel = paintLayer(pixel, colors.mint, alphaForDistance(distanceToSegment(px, py, a, b), 14));
    }
    for (const [nx, ny, nodeRadius, color] of nodes) {
      pixel = paintLayer(pixel, color, alphaForDistance(Math.hypot(px - nx, py - ny) - nodeRadius));
    }

    this.bitmap.data[index] = pixel[0];
    this.bitmap.data[index + 1] = pixel[1];
    this.bitmap.data[index + 2] = pixel[2];
    this.bitmap.data[index + 3] = pixel[3];
  });
  return image;
}

async function writePng(image, path, size) {
  await image.clone().resize(size, size, Jimp.RESIZE_BICUBIC).writeAsync(path);
}

function stripAlpha(path) {
  const output = `${path}.rgb.png`;
  const result = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path, '-pix_fmt', 'rgb24', output], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`Failed to strip the alpha channel from ${path}`);
  renameSync(output, path);
}

const imagesDir = join(root, 'apps/mobile/assets/images');
const iosDir = join(root, 'apps/mobile/ios/FitnessGoal/Images.xcassets');
const androidRes = join(root, 'apps/mobile/android/app/src/main/res');
const icon = render({ background: true });
const adaptive = render({ markScale: 0.82 });
const splash = render({ tile: true, markScale: 0.72 });

await writePng(icon, join(imagesDir, 'icon.png'), 1024);
stripAlpha(join(imagesDir, 'icon.png'));
await writePng(adaptive, join(imagesDir, 'adaptive-icon.png'), 1024);
await writePng(splash, join(imagesDir, 'splash-icon.png'), 1024);
await writePng(icon, join(imagesDir, 'favicon.png'), 48);

await writePng(icon, join(iosDir, 'AppIcon.appiconset/App-Icon-1024x1024@1x.png'), 1024);
stripAlpha(join(iosDir, 'AppIcon.appiconset/App-Icon-1024x1024@1x.png'));
await writePng(splash, join(iosDir, 'SplashScreenLogo.imageset/image.png'), 200);
await writePng(splash, join(iosDir, 'SplashScreenLogo.imageset/image@2x.png'), 400);
await writePng(splash, join(iosDir, 'SplashScreenLogo.imageset/image@3x.png'), 600);

const densities = [
  ['mdpi', 48, 108, 288],
  ['hdpi', 72, 162, 432],
  ['xhdpi', 96, 216, 576],
  ['xxhdpi', 144, 324, 864],
  ['xxxhdpi', 192, 432, 1152],
];

for (const [density, legacySize, foregroundSize, splashSize] of densities) {
  const mipmapDir = join(androidRes, `mipmap-${density}`);
  await writePng(icon, join(mipmapDir, 'ic_launcher.png'), legacySize);
  await writePng(icon, join(mipmapDir, 'ic_launcher_round.png'), legacySize);
  await writePng(adaptive, join(mipmapDir, 'ic_launcher_foreground.png'), foregroundSize);
  for (const filename of ['ic_launcher.webp', 'ic_launcher_round.webp', 'ic_launcher_foreground.webp']) {
    const oldPath = join(mipmapDir, filename);
    if (existsSync(oldPath)) unlinkSync(oldPath);
  }
  await writePng(splash, join(androidRes, `drawable-${density}/splashscreen_logo.png`), splashSize);
}

console.log('Generated Fitness Goal logo, launcher, favicon, and splash assets.');

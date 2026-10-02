/**
 * Generates web-optimised copies of the brand photography and logo.
 *
 * - Reads ONLY from ../assets/originals (never writes there).
 * - Operations are limited to crop / resize / re-encode. No retouching.
 * - Writes to ../assets/web and ./public/images.
 *
 * Usage: npm run images
 */
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const originals = path.join(root, "assets", "originals");
const webDir = path.join(root, "assets", "web");
const publicDir = path.resolve(here, "..", "public", "images");

const src = (name) => path.join(originals, name);

/** Logo 09 bounding boxes (measured on the 1254×1254 original, pure black background). */
const LOGO_MARK = { left: 320, top: 268, width: 606, height: 474 };
const LOGO_EMBLEM = { left: 100, top: 268, width: 1072, height: 614 };

const jobs = [
  { out: "hero-desktop.webp", from: "05-saeid-fitologist-gym-horizontal.png", q: 88 },
  { out: "hero-mobile.webp", from: "07-saeid-fitologist-fullbody.jpg", q: 88 },
  // Small avatar for the form intro (§4.10): face crop of the hero portrait (05), crop + resize only.
  { out: "avatar.webp", from: "05-saeid-fitologist-gym-horizontal.png", q: 86, extract: { left: 590, top: 30, width: 300, height: 300 }, resize: { width: 192 } },
  // meet-saeid-cutout.webp (Home "Meet Saeid") is NOT generated here: background removed from 05 with
  // rembg (isnet-general-use + alpha matting), crop (20,30)-(460,470) of a 480px crop at (500,0), 320px webp.
  { out: "about-portrait.webp", from: "saeid-original-01.PNG", q: 88 },
  // Full, uncropped frame (Method section shows it full-height).
  { out: "method-full.webp", from: "04-saeid-gym-back-fitologist.png", q: 88 },
  // Method gallery (professional journey). Full frames, encode only.
  { out: "method-activeiq.webp", from: "01-saeid-activeiq-certification.png", q: 86 },
  { out: "method-mypt.webp", from: "02-saeid-mypt-academy.png", q: 86 },
  { out: "journey-12me.webp", from: "12me.PNG", q: 86 },
  // Landscape brand banner (#10, banner2) — homepage philosophy visual + Method hero. Encode only.
  { out: "brand-banner2.webp", from: "10-fitologist-brand-banner2.PNG", q: 88 },
];

/**
 * Logo crops with the pure-black background converted to transparency.
 * alpha = max(r,g,b); colour is un-premultiplied. Composited over black this is
 * pixel-identical to the original, so the logo design itself is unchanged.
 */
const logoJobs = [
  // Mark + wordmark (tagline omitted: illegible at header size). Header logo.
  { out: "logo-emblem.png", extract: LOGO_EMBLEM, width: 640 },
  { out: "logo-mark.png", extract: LOGO_MARK, width: 606 },
];

async function knockOutBlack({ out, extract, width }) {
  const { data, info } = await sharp(src("09-fitologist-logo-dark-bg.png"))
    .extract(extract)
    .resize({ width })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const a = Math.max(r, g, b);
    const k = a === 0 ? 0 : 255 / a;
    rgba[j] = Math.min(255, Math.round(r * k));
    rgba[j + 1] = Math.min(255, Math.round(g * k));
    rgba[j + 2] = Math.min(255, Math.round(b * k));
    rgba[j + 3] = a;
  }
  const target = path.join(webDir, out);
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(target);
  await copyFile(target, path.join(publicDir, out));
  console.log("✓", out);
}

async function run() {
  await mkdir(webDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  for (const job of jobs) {
    let img = sharp(src(job.from));
    if (job.extract) img = img.extract(job.extract);
    if (job.resize) img = img.resize(job.resize);
    const target = path.join(webDir, job.out);
    await img.webp({ quality: job.q, effort: 6 }).toFile(target);
    await copyFile(target, path.join(publicDir, job.out));
    console.log("✓", job.out);
  }

  for (const job of logoJobs) await knockOutBlack(job);

  // Open Graph image: 1200×630 cover crop of the desktop hero.
  const og = path.join(webDir, "og.jpg");
  await sharp(src("05-saeid-fitologist-gym-horizontal.png"))
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(og);
  await copyFile(og, path.join(publicDir, "og.jpg"));
  console.log("✓ og.jpg");

  // App icons from the logo mark, padded square on the logo's own black background.
  const appDir = path.resolve(here, "..", "app");
  const mark = await sharp(src("09-fitologist-logo-dark-bg.png")).extract(LOGO_MARK).toBuffer();
  const square = (size, pad) =>
    sharp(mark)
      .resize(size - pad * 2, size - pad * 2, { fit: "contain", background: "#000000" })
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: "#000000" });
  await square(512, 48).png().toFile(path.join(appDir, "icon.png"));
  await square(180, 18).png().toFile(path.join(appDir, "apple-icon.png"));
  console.log("✓ app/icon.png, app/apple-icon.png");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

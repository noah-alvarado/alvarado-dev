import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

// Output contract shared with src/components/OptimizedImage.jsx, which emits
// srcSet entries for exactly these widths and formats.
const formats = [
    { ext: 'webp', options: { quality: 80 } },
    { ext: 'png', options: {} },
    { ext: 'jpg', options: { quality: 80 } },
];

const sizes = [400, 800, 1200, 1920];
const MAX_FILES = 1000; // safety limit

const inputDir = 'src/assets';
const outputDir = 'public/optimized';

await fs.mkdir(outputDir, { recursive: true });

const manifestPath = path.join(outputDir, 'optimized-manifest.json');
let manifest = {};
try {
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
} catch {
    // No usable manifest (first run or corrupted): regenerate everything.
    console.log(`Fully regenerating optimized output folder: ${outputDir}`);
    await fs.rm(outputDir, { recursive: true, force: true });
    await fs.mkdir(outputDir, { recursive: true });
}

async function collectImageFiles(dir) {
    const files = [];
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await collectImageFiles(fullPath)));
        } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
            files.push({ name: entry.name, dir });
        }
    }
    return files;
}

const files = await collectImageFiles(inputDir);
if (files.length > MAX_FILES) {
    console.error(`Reached the maximum file limit (${MAX_FILES}). Exiting for safety.`);
    process.exit(1);
}

for (const { name, dir } of files) {
    const inputPath = path.join(dir, name);
    const baseName = name.replace(/\.[^.]+$/, '');
    const relativePath = path.relative(inputDir, dir);
    const stat = await fs.stat(inputPath);
    const manifestKey = path.join(relativePath, name);

    // Track only the source mtime; regenerate whenever it changes or any
    // expected output is missing. Output mtimes are deliberately not tracked —
    // any touch would needlessly invalidate the entry.
    const prev = manifest[manifestKey];
    let needsUpdate = !prev || prev.mtimeMs !== stat.mtimeMs;
    if (!needsUpdate) {
        for (const width of sizes) {
            for (const { ext } of formats) {
                const exists = await fs
                    .stat(path.join(outputDir, relativePath, `${baseName}-${width}.${ext}`))
                    .then(() => true, () => false);
                if (!exists) needsUpdate = true;
            }
        }
    }

    if (!needsUpdate) {
        console.log(`Skipping (unchanged): ${inputPath}`);
        continue;
    }

    for (const width of sizes) {
        for (const { ext, options } of formats) {
            const outputPath = path.join(outputDir, relativePath, `${baseName}-${width}.${ext}`);
            let pipeline = sharp(inputPath).resize({ width });
            if (ext === 'webp') pipeline = pipeline.webp(options);
            else if (ext === 'png') pipeline = pipeline.png(options);
            else if (ext === 'jpg') pipeline = pipeline.jpeg(options);
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await pipeline.toFile(outputPath);
            console.log(`Created: ${outputPath}`);
        }
    }
    manifest[manifestKey] = { mtimeMs: stat.mtimeMs };
}

// Drop manifest entries (and their optimized outputs) whose source is gone.
const currentKeys = new Set(files.map(({ name, dir }) => path.join(path.relative(inputDir, dir), name)));
for (const key of Object.keys(manifest)) {
    if (currentKeys.has(key)) continue;
    const baseName = path.basename(key).replace(/\.[^.]+$/, '');
    for (const width of sizes) {
        for (const { ext } of formats) {
            const outputPath = path.join(outputDir, path.dirname(key), `${baseName}-${width}.${ext}`);
            try {
                await fs.unlink(outputPath);
                console.log(`Deleted optimized file: ${outputPath}`);
            } catch {
                // File may already be gone, ignore
            }
        }
    }
    delete manifest[key];
    console.log(`Removed from manifest (source missing): ${key}`);
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

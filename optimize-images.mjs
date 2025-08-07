import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

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
    const manifestData = await fs.readFile(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestData);
} catch (err) {
    manifest = {};
}

// Remove the entire optimized output folder if no manifest is found (i.e., manifest is empty)
if (Object.keys(manifest).length === 0) {
    console.log(`Fully regenerating optimized output folder: ${outputDir}`);

    // Remove all contents and the folder itself
    async function removeDirRecursive(dir) {
        let entries;
        try {
            entries = await fs.readdir(dir, { withFileTypes: true });
        } catch (err) {
            return;
        }
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await removeDirRecursive(fullPath);
            } else {
                await fs.unlink(fullPath);
            }
        }
        await fs.rmdir(dir);
    }
    await removeDirRecursive(outputDir);
}

async function getImageFilesRecursive(dir, excludeDir, count = { value: 0 }) {
    let results = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (count.value >= MAX_FILES) {
            console.error(`Reached the maximum file limit (${MAX_FILES}). Exiting for safety.`);
            process.exit(1);
        }
        const fullPath = `${dir}/${entry.name}`;
        if (entry.isDirectory()) {
            if (fullPath === excludeDir) continue;
            results = results.concat(await getImageFilesRecursive(fullPath, excludeDir, count));
        } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
            count.value++;
            if (count.value >= MAX_FILES) {
                console.error(`Reached the maximum file limit (${MAX_FILES}). Exiting for safety.`);
                process.exit(1);
            }
            results.push({ name: entry.name, path: dir });
        }
    }
    return results;
}

const files = await getImageFilesRecursive(inputDir, outputDir);

for (const file of files) {
    const inputPath = `${file.path}/${file.name}`;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const relativePath = path.relative(inputDir, file.path);
    const stat = await fs.stat(inputPath);
    const mtimeMs = stat.mtimeMs;
    const manifestKey = path.join(relativePath, file.name);
    const prevEntry = manifest[manifestKey] || {};
    const prevMtime = prevEntry.mtimeMs;
    const prevOutputs = prevEntry.outputs || {};

    // Check if any output file is missing or outdated
    let missingOrOutdatedOutput = false;
    const outputFiles = [];
    for (const width of sizes) {
        for (const { ext } of formats) {
            const outputName = `${baseName}-${width}.${ext}`;
            const outputPath = path.join(outputDir, relativePath, outputName);
            outputFiles.push({ outputName, outputPath });
            try {
                const outStat = await fs.stat(outputPath);
                if (!prevOutputs[outputName] || prevOutputs[outputName] !== outStat.mtimeMs) {
                    missingOrOutdatedOutput = true;
                }
            } catch (err) {
                missingOrOutdatedOutput = true;
            }
        }
    }

    const needsUpdate = prevMtime !== mtimeMs || missingOrOutdatedOutput;
    if (!needsUpdate) {
        console.log(`Skipping (unchanged and all outputs up-to-date): ${inputPath}`);
        continue;
    }
    // Optimize and update manifest outputs
    const outputs = {};
    for (const width of sizes) {
        for (const { ext, options } of formats) {
            const outputName = `${baseName}-${width}.${ext}`;
            const outputPath = path.join(outputDir, relativePath, outputName);
            let pipeline = sharp(inputPath).resize({ width });
            if (ext === 'webp') pipeline = pipeline.webp(options);
            else if (ext === 'png') pipeline = pipeline.png(options);
            else if (ext === 'jpg') pipeline = pipeline.jpeg(options);
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await pipeline.toFile(outputPath);
            const outStat = await fs.stat(outputPath);
            outputs[outputName] = outStat.mtimeMs;
            console.log(`Created: ${outputPath}`);
        }
    }
    // Update manifest
    manifest[manifestKey] = { mtimeMs, outputs };
}

// Save manifest
// Clean up manifest: remove entries for images that no longer exist
const currentKeys = new Set(files.map(file => path.join(path.relative(inputDir, file.path), file.name)));
const removedKeys = [];
for (const key of Object.keys(manifest)) {
    if (!currentKeys.has(key)) {
        // Remove optimized outputs for this key
        const prevOutputs = manifest[key]?.outputs || {};
        for (const outputName in prevOutputs) {
            // Find the relativePath from the manifest key
            const relDir = path.dirname(key);
            const outputPath = path.join(outputDir, relDir, outputName);
            try {
                await fs.unlink(outputPath);
                console.log(`Deleted optimized file: ${outputPath}`);
            } catch (err) {
                // File may already be gone, ignore
            }
        }
        delete manifest[key];
        removedKeys.push(key);
        console.log(`Removed from manifest (source missing): ${key}`);
    }
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

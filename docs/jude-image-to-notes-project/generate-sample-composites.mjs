// One-off generator for SAMPLE placeholder content for the Image-to-Notes composites:
// transparent layer PNGs (via sharp) and minimal note PDFs. Data-driven — add a composite
// to `composites` below to generate its art + notes. Replace the output with real Adobe
// Fresco exports and OneNote PDFs when available.
//
//   node docs/jude-image-to-notes-project/generate-sample-composites.mjs
//   yarn optimize-images
//
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const svg = (W, H, inner) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${inner}</svg>`;

// Minimal single-page PDF with correct byte offsets (ASCII only).
function makePdf(lines) {
    const header = '%PDF-1.4\n';
    const escape = (s) => s.replace(/([()\\])/g, '\\$1');
    let text = 'BT /F1 18 Tf 72 720 Td 22 TL\n';
    for (const line of lines) text += `(${escape(line)}) Tj T*\n`;
    text += 'ET';

    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
        `<< /Length ${text.length} >>\nstream\n${text}\nendstream`,
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ];

    let body = '';
    const offsets = [];
    let pos = header.length;
    objects.forEach((obj, i) => {
        const objStr = `${i + 1} 0 obj\n${obj}\nendobj\n`;
        offsets.push(pos);
        body += objStr;
        pos += objStr.length;
    });

    const xrefStart = header.length + body.length;
    let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (const off of offsets) xref += `${String(off).padStart(10, '0')} 00000 n \n`;
    const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
    return header + body + xref + trailer;
}

const spineVertebrae = Array.from(
    { length: 7 },
    (_, i) => `<circle cx="600" cy="${300 + i * 150}" r="42" fill="#cfc9b6"/>`,
).join('');

const composites = {
    neck: {
        W: 1200,
        H: 1500,
        layers: {
            spine: `<g fill="#d9d4c5" stroke="#b8b09a" stroke-width="4"><rect x="545" y="220" width="110" height="1180" rx="46"/>${spineVertebrae}</g>`,
            hyoid: `<path d="M470 360 q130 90 260 0" fill="none" stroke="#efe9d6" stroke-width="30" stroke-linecap="round"/>`,
            'nerve-cervical': `<g fill="none" stroke="#e6c200" stroke-width="9" stroke-linecap="round"><path d="M540 500 C 420 620, 400 820, 320 1030"/><path d="M540 500 C 480 660, 440 780, 380 940"/><path d="M320 1030 l -46 66"/><path d="M380 940 l 60 40"/></g>`,
            trapezius: `<path d="M650 430 L 980 520 L 1000 1120 L 700 1260 Z" fill="#9b2d2d" fill-opacity="0.85"/>`,
            scm: `<g fill="#c0392b" fill-opacity="0.9"><path d="M470 380 L560 380 L720 1170 L610 1200 Z"/><path d="M560 380 L660 380 L780 980 L700 1010 Z"/></g>`,
            skin: `<path d="M300 200 Q600 120 900 200 L965 1350 Q600 1460 235 1350 Z" fill="#e8b892" fill-opacity="0.72"/>`,
        },
        notes: {
            'scm-oi': ['Sternocleidomastoid (SCM)', 'Origin: manubrium and medial clavicle', 'Insertion: mastoid process', '', 'Sample study note.'],
            'scm-action': ['SCM - Actions & Innervation', 'Action: contralateral rotation and flexion', 'Innervation: accessory nerve (CN XI)'],
            'cervical-plexus': ['Cervical Plexus', 'Formed by ventral rami C1-C4', 'Motor and cutaneous branches'],
            hyoid: ['Hyoid Bone', 'Suspended by suprahyoid and infrahyoid muscles', 'No direct bony articulation'],
            vertebrae: ['Cervical Vertebrae C1-C7', 'Atlas (C1) and Axis (C2)', 'Contain transverse foramina'],
            trapezius: ['Trapezius', 'Regions: descending, transverse, ascending', 'Innervation: accessory nerve (CN XI)'],
        },
    },

    hand: {
        W: 1200,
        H: 1400,
        layers: {
            carpals: `<g fill="#d9d4c5" stroke="#b8b09a" stroke-width="3"><rect x="480" y="1150" width="70" height="70" rx="16"/><rect x="560" y="1150" width="70" height="70" rx="16"/><rect x="640" y="1150" width="70" height="70" rx="16"/><rect x="520" y="1235" width="70" height="70" rx="16"/><rect x="600" y="1235" width="70" height="70" rx="16"/></g>`,
            metacarpals: `<g fill="#cfc9b6" stroke="#b8b09a" stroke-width="3"><rect x="470" y="820" width="34" height="320" rx="16" transform="rotate(-14 487 980)"/><rect x="545" y="800" width="34" height="340" rx="16" transform="rotate(-6 562 970)"/><rect x="620" y="795" width="34" height="345" rx="16"/><rect x="695" y="800" width="34" height="340" rx="16" transform="rotate(7 712 970)"/><rect x="765" y="820" width="34" height="320" rx="16" transform="rotate(15 782 980)"/></g>`,
            'tendon-extensor': `<g fill="none" stroke="#d9a441" stroke-width="9" stroke-linecap="round"><path d="M500 320 L520 900"/><path d="M580 270 L585 900"/><path d="M650 260 L650 900"/><path d="M720 270 L715 900"/><path d="M790 320 L775 900"/></g>`,
            'muscle-thenar': `<path d="M430 900 Q380 1010 430 1120 Q520 1140 545 1015 Q520 915 430 900 Z" fill="#c0392b" fill-opacity="0.85"/>`,
            skin: `<path d="M430 300 Q430 150 500 160 Q520 120 560 160 Q590 120 630 160 Q670 120 700 165 Q760 200 782 320 L820 900 Q820 1250 620 1300 Q420 1250 420 900 Z" fill="#e8b892" fill-opacity="0.72"/>`,
        },
        notes: {
            thenar: ['Thenar Muscles', 'Abductor pollicis brevis, opponens pollicis', 'Flexor pollicis brevis'],
            'extensor-tendons': ['Extensor Tendons', 'Extensor digitorum to the phalanges', 'Run along the dorsal hand'],
            metacarpals: ['Metacarpal Bones', 'Five metacarpals (I-V)', 'Heads form the knuckles'],
            carpals: ['Carpal Bones', 'Two rows of four bones', 'Scaphoid, lunate, triquetrum, pisiform'],
        },
    },
};

for (const [id, def] of Object.entries(composites)) {
    const assetsDir = `src/assets/jude/${id}`;
    const notesDir = `public/jude/${id}/notes`;
    await fs.mkdir(assetsDir, { recursive: true });
    await fs.mkdir(notesDir, { recursive: true });

    for (const [name, inner] of Object.entries(def.layers)) {
        const out = path.join(assetsDir, `${name}.png`);
        await sharp(Buffer.from(svg(def.W, def.H, inner))).png().toFile(out);
        console.log(`layer  -> ${out}`);
    }
    for (const [name, lines] of Object.entries(def.notes)) {
        const out = path.join(notesDir, `${name}.pdf`);
        await fs.writeFile(out, makePdf(lines), 'latin1');
        console.log(`note   -> ${out}`);
    }
}

console.log('Done. Now run: yarn optimize-images');

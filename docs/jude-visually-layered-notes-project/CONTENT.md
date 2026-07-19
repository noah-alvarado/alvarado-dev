# Content guide — Visually Layered Notes

How to produce, edit, and organize the content that drives the Visually Layered Notes viewer:
layer art (PNG), note documents (PDF), and the tags that connect them. For the _shape_ of
these resources and how the application consumes them, see [ARCHITECTURE.md](./ARCHITECTURE.md).

A **composite** (e.g., "neck") is one illustration made of stacked **layers**, where each
layer is a single structure. Each layer and each PDF carries **tags**; a structure's notes
are the PDFs whose tags overlap its own.

## 1. Exporting source files

### 1.1 Layer art from Adobe Fresco (iPad)

Every structure is its own PNG, and all layers share one canvas so they line up when stacked.

1. Draw each structure on its **own layer** (or layer group) in a single Fresco document.
   Keep the canvas size fixed — never crop for an individual layer.
2. Export each layer as a **transparent PNG**:
   - In the layer panel, hide every layer except the one you want (tap the eye icons).
   - Tap **Share → Export as → PNG** and enable **Transparent background**, then export.
   - Repeat for each structure.
   - _Alternative:_ **Share → Export as → PSD** to keep all layers in one file, then export
     each layer to PNG in Photoshop (File → Export → Layers to Files).
3. Name each file with a short, lowercase, hyphenated **id**, e.g. `scm.png`,
   `nerve-cervical.png`, `skin.png`.

Tips

- Export at the full canvas size for **every** layer so they register precisely when stacked.
- Only the drawn (non-transparent) pixels of a layer are clickable in the viewer.

### 1.2 Notes from OneNote (PDF)

1. Open the OneNote page(s) that make up a note.
2. Save the page as a PDF (exact menus vary by platform/version):
   - **Windows:** File → Export → Page (or Section) → **PDF** → Export.
   - **Mac:** File → Print → **PDF ▾ → Save as PDF**.
   - **iPad:** page **⋯ (More) → Print**, then in the preview **Share → Save to Files** as a
     PDF (or **Export Page** if your version offers it).
3. Produce one PDF per note document (a document may span multiple pages).
4. Name each PDF with a short, lowercase, hyphenated **id**, e.g. `scm-origin-insertion.pdf`.

## 2. Editing components and PDFs

These are content edits — none require code changes, only the manifest and the files it
references.

### 2.1 Add a new component (layer) to an existing composite

1. Draw and export the new structure as a transparent PNG (§1.1) at the same canvas size as
   the other layers.
2. Save it to `src/assets/jude/<composite>/<id>.png`.
3. Run `yarn optimize-images` to generate the image variants the viewer uses.
4. Add an entry to `layers[]` in `public/jude/<composite>/manifest.json`:

   ```jsonc
   { "id": "<id>", "name": "Display Name", "image": "jude/<composite>/<id>", "order": 45, "tags": ["muscle", "..."] }
   ```

   - `order` is the z-index: higher numbers sit nearer the viewer (skin is highest).
   - Add any brand-new tags to the top-level `tags` list as well.

5. Reload the app — the structure appears in the layer panel and stacks in place.

### 2.2 Modify the content of a PDF

1. Update the note in OneNote and re-export to PDF (§1.2), or edit the PDF directly.
2. Overwrite `public/jude/<composite>/notes/<id>.pdf`, keeping the **same filename** so the
   manifest reference still resolves.
3. Hard-refresh the browser (PDFs may be cached).

- If you must rename the file, update the matching `notes[].file` URL in the manifest.

### 2.3 Modify the tags of a component and/or PDF

Edit `public/jude/<composite>/manifest.json`:

- **Component tags:** change that layer's `tags` array.
- **PDF tags:** change that note's `tags` array.
- Add any new tag to the top-level `tags` vocabulary so it appears in the tag search.

Effects (no rebuild needed — the manifest is read at runtime):

- A structure's note collection is every PDF sharing at least one tag, ranked by the number
  of shared tags.
- A structure "has notes" only if its tags match at least one PDF. That also decides its
  on-image click: **has notes → clicking opens notes; no notes → clicking hides the layer.**

## 3. How content is structured and where it is stored

### Folder layout (per composite `<id>`)

```text
src/assets/jude/<id>/*.png          # SOURCE layer art you export from Fresco
public/optimized/jude/<id>/*        # GENERATED image variants (do not edit by hand)
public/jude/<id>/manifest.json      # the composite definition (layers, notes, tags)
public/jude/<id>/notes/*.pdf        # note documents, served as-is
```

### Manifest at a glance

```jsonc
{
  "id": "neck",
  "name": "Neck — Neuromuscular System",
  "canvas": { "width": 1200, "height": 1500 },
  "layers": [{ "id": "scm", "name": "Sternocleidomastoid", "image": "jude/neck/scm", "order": 60, "tags": ["muscle", "scm"] }],
  "notes": [{ "id": "scm-oi", "title": "SCM — Origin & Insertion", "file": "/jude/neck/notes/scm-oi.pdf", "tags": ["scm", "muscle"] }],
  "tags": ["muscle", "scm", "bone", "..."],
}
```

Field meanings and how the app uses each one are documented in
[ARCHITECTURE.md](./ARCHITECTURE.md).

### Naming conventions

- Ids are lowercase and hyphenated.
- A layer's `image` is the file base path under `/optimized/` and must match its PNG name.
- A note's `file` is the URL of its PDF under `public/`.

### Registering a whole new composite (subject)

1. Create `src/assets/jude/<id>/` (art), `public/jude/<id>/notes/` (PDFs), and
   `public/jude/<id>/manifest.json`.
2. Add it to `registry` in
   [useComposite.js](../../src/components/visually-layered-notes/useComposite.js):
   `<id>: { url: '/jude/<id>/manifest.json', label: 'Label' }`.
3. It is then reachable at `/visually-layered-notes/<id>` and appears in the on-page composite switcher.

### Storage and sample content

- All content is local to the repository for now (no remote hosting).
- The committed `neck` and `hand` composites are **placeholders**. Regenerate them with
  `node docs/jude-visually-layered-notes-project/generate-sample-composites.mjs && yarn optimize-images`,
  and replace them with real Fresco/OneNote exports for production.

# Visually Layered Notes — Project Requirements

> **Scope of this document:** product purpose, users, concepts, and behavior only.
> Platform, frameworks, and tooling choices are intentionally left out and will be
> decided during technical design.

## 1. Overview

Visually Layered Notes is an interactive web app, hosted at `/visually-layered-notes` and linked from
Jude's page (`/jude`), for exploring a composite illustration built from stacked image
layers. Clicking a layer either reveals the layers behind it or opens a collection of
study notes surfaced for that structure.

The first subject is a hand-drawn, layered sketch of the **neuromuscular system of the
neck** — bones at the base (some with notes), intertwined nerves and muscles above them
(some with notes, some that simply hide), and skin on top (which only hides to reveal
what is beneath).

## 2. Goals

- **Personal study tool** for Jude — tie anatomical structures to relevant notes.
- **Portfolio / showcase piece** on the site.
- **Reusable template** — present other layered subjects later with minimal rework.

## 3. Non-goals (v1)

- No in-app authoring or editing UI (delivered in v2 as a local, dev-only tool — see §9).
- No cloud hosting or sync — local files only for now.
- No sub-region hotspots — each layer is treated as one whole structure.
- No user accounts, sharing, or collaboration features.

## 4. Primary users & use cases

- **Jude (primary):** peels back layers of the neck illustration and reads the notes
  surfaced for each structure while studying.
- **Site visitors (secondary):** explore the concept as a showcase.
- **Future subjects:** the same viewer loaded with a different composite and notes set.

## 5. Core concepts

- **Composite** — a single illustration made of multiple stacked layers
  (e.g., "Neck neuromuscular system").
- **Layer / Structure** — one exported PNG representing exactly one structure (a specific
  muscle, nerve, or bone), stacked in a defined order. Each structure carries a **tag set**.
- **Tag** — a label shared between components and notes; tags are the link between the
  artwork and the notes.
- **Notes collection** — a _derived, ranked_ set of note documents (PDFs) matched to a
  structure by tags. It is computed, not stored as a fixed per-structure link.
- **Selection** — the currently focused structure whose notes are open and to which
  side-panel actions apply.

## 6. Tag-based notes model

Notes are **not** directly attached to individual structures. Instead:

- Each **PDF has a set of tags**.
- Each **PNG component (structure) has a set of tags**.
- Both sets of tags are defined in a **central per-composite manifest**.
- A structure's notes collection is built by **matching its tag set against the PDFs'
  tags**: every PDF that shares **at least one tag** is included, **ranked by the number
  of overlapping tags** (most relevant first).
- A structure "has notes" — which determines whether a click opens notes or hides the
  structure — when its tag set matches **at least one PDF**.
- The notes panel also supports **manual tag search/filter**, letting the user assemble a
  collection by choosing tags directly, independent of the selected structure.

## 7. Functional requirements

### 7.1 Viewing the composite

- On load, show the full composite with all layers visible in their correct stacking order
  (e.g., skin on top, bones at the base).
- Support desktop (mouse) and tablet/touch as first-class inputs.

### 7.2 On-image interaction

- A structure's click behavior is decided purely by whether it has matching notes:
  - **Has matching notes** → select it and open its (ranked) notes collection. Opening
    notes always takes priority when matching notes exist.
  - **No matching notes** → hide it, revealing the layers behind it.
- Hovering a structure highlights/outlines it and shows its name.

### 7.3 Layer panel

- A panel lists every structure in the composite. Each row shows:
  - the structure's name/label,
  - a visibility (show/hide) toggle,
  - an open-notes button (when the structure has matching notes),
  - an indicator that the structure has notes.
- Layers can be toggled independently from the panel — not only by top-down peeling.

### 7.4 Notes

- Notes open in a side panel beside the image and are viewable inline (not download-only).
- The collection for a selected structure is tag-derived and ranked by tag overlap.
- Notes for multiple structures can be open at once (e.g., tabs or stacked) for comparison.
- A **manual tag search** lets the user build a collection by selecting tags directly.

### 7.5 Selected-structure actions

- For the selected structure, side-panel buttons let the user **isolate** it (show only
  that structure) or **hide** it.

### 7.6 Reset & restore

- A global reset button restores all layers to the full composite.
- Individually hidden or toggled layers can also be brought back via their panel toggle.

### 7.7 Discoverability

- Hovering highlights interactive structures.
- A "show all" toggle reveals all interactive structures at once.
- Anatomical names appear on hover and in the layer panel.

## 8. Content & data

- **Images:** PNG layers exported from Adobe Fresco (iPad). Each PNG is one structure and
  shares a common canvas size/registration so layers stack precisely. Each component
  carries a **tag set**.
- **Notes:** PDFs exported from OneNote. Each PDF carries **tags**.
- **Central manifest** (per composite): the single source that drives tag matching. It
  defines layer order, structure names, each component's tag set, and each PDF's tags.
- **Storage:** all images, PDFs, and the manifest are local to the PC for now (no remote
  hosting).

## 9. Scope: v1 vs. v2 vs. future

- **v1:** the neck composite; viewer-only; central manifest maintained by hand; local
  files; desktop and touch.
- **v2 (current):** a local, **dev-only authoring UI** to create composites, upload layer
  PNGs and note PDFs, assign tags, define layer order and names, preview live, and generate a
  validated manifest — no hand-editing required. Composites are data-driven, so adding a
  subject needs no code change. Still local files only; the viewer that ships to production is
  unchanged.
- **Future:** hosted storage/sync; a production (not dev-only) authoring experience; richer
  organization for large tag/layer sets.

## 10. Design decisions

These defaults are adopted for v1 and can be revisited:

1. **Side-panel layout** — a single unified side panel with distinct sections (layer list,
   notes viewer, tag search).
2. **State persistence** — the app always starts fresh at the full composite; hidden
   layers and open notes are not remembered between visits.
3. **Reset scope** — the global reset returns the app to a pristine full composite,
   clearing any isolation/selection and closing open notes.
4. **Manual tag search behavior** — the user picks from the known tag list; selecting
   multiple tags matches **any** of them (union), ranked by overlap, consistent with the
   structure-derived collection.

## 11. Open questions / future considerations

- Whether structure names should be sourced from the manifest or embedded in the artwork.
- How large numbers of layers/tags should be organized in the panel (grouping, search).
- Whether ranked ties in the notes collection need a secondary sort (e.g., document name).
- Migration path from local, dev-only authoring to hosted storage and a production
  authoring experience.

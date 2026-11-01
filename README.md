# World of Enoch 3D Map

Interactive 3D Google-Earth-style map of the flat disc of 1 Enoch / Genesis cosmology. Single static `index.html` (three.js r147, local classic scripts, no build step). Open `index.html` via any static server (`python3 -m http.server`).

## Hard rules (from Levi)
- PHOTOREALISM. No cartoon primitives (cones, boxes, plain cylinders). Sprites/glows/shaders are fine.
- REAL scale only: R = 10 units = 20,015 km (1 unit = 2001.5 km). No relief exaggeration, no relief slider.
- Projection: north-pole azimuthal equidistant. lon 0 points down, +90 right. r = (90 - lat)/180 * R; x = r*sin(lon); z = r*cos(lon).
- One photoreal map for every year (no ancient supercontinent, no Peleg morph). Borders and labels follow the year.
- No glare: ACES tone mapping, exposure ~0.9, roughness 1, no sun specular.
- Moonlit areas dark slightly blue, never pitch black.
- All countries equal: no special Oradea/Romania features.
- Minimal UI, no text selection on iOS, Google Earth touch controls.
- Waters above the firmament (Gen 1:6-8, 1 Enoch 54:7-8); stars only on the dome underside; black void outside.
- Sheol/Hades: dark cavern, dim ember light, no flicker (depthWrite false + renderOrder for glows).
- Google 3D data / REA extraction is off-limits (terms of service).

## Code rules
- Classic scripts only; no ES modules, no unpkg r148+ examples. Inline data or local .js globals, never fetch() local files.
- Streaming tiles: Esri World Imagery + AWS Terrarium elevation (CORS *).
- Floating origin (`anchor`, `world` group), dynamic near/far, mobile profile `MOB`/`PERF`.
- After any edit: `node --check` the extracted script and test on iPhone Safari.

## Backlog
See `edit_queue.md`.

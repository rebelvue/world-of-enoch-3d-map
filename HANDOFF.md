# HANDOFF - for Claude, Grok Bot, or any AI picking this up

You are continuing work on **World of Enoch 3D Map** for Levi (David Daragiu). Hark has been building it; if Hark ran out of limits, start here.

## What this is
A single-file interactive 3D web map (three.js r147, classic scripts, no build step) of the flat disc earth as described in 1 Enoch and Genesis. It works like Google Earth: photoreal, real scale, a timeline from 3382 BC to 2026.
- Main file: `index.html` (~205 KB). Local libs: `three.min.js` and `OrbitControls.js`. Data: `borders_data.js` (window.BORDERS) and the countries files.
- Live (Hark-hosted): https://hark.com/site/c38fa708-62d3-426e-b65f-e825840d47ac
- Feature checklist (done / not done, how to verify each): **`FEATURES.md`**. Read it first.
- Full specs per item: **`edit_queue.md`** (items A-X).

## How to take over
1. Read `edit_queue.md`. Below you'll find the next item and the item order.
2. Make ONE small, focused edit at a time in `index.html`. Open it in a browser (any static server, e.g. `npx serve`) to check it; there's no build step.
3. Commit with the queue letter in the message (e.g. `Q: ice wall + progressive load`). Push to `main`.
4. Mark the item done in `edit_queue.md`.
5. Ask Levi to test on his iPhone and send screenshots. He mostly tests on iOS Safari.

## Status (2026-11-02 02:52 EET)
Done and pushed: vector historical borders, streaming Esri imagery + AWS Terrarium terrain (z19), floating origin, mobile perf profile, Sheol underworld, flame columns in the abyss, waters above the dome, seven prison stars, compass, side buttons, speed chips, selection spotlight (P).
T3 gestures + reset + U search + fineprint removal: DONE (commit after 8115350).

Next, in this order: **Q** ice wall + fast progressive load -> **D** city lights by era -> **M** wars, bombings, fires, nuclear -> **V** eclipses + Joshua 10 + Hezekiah's sundial -> **W** Creation cinematic + pre-Enoch events (4004-3382 BC) -> **C** landmarks rising and falling -> **L** ~300 historical events -> **S** OSM 3D buildings (Overpass: overpass.kumi.systems or overpass.private.coffee) -> **E-K** + **X** (motion blur/shake) atmosphere, clouds, ocean, Milky Way, cinematic mode.

## Hard rules (Levi's)
- **Real scale only.** R = 10 units = 20,015 km. No relief exaggeration.
- **Projection:** north-pole azimuthal equidistant. lon 0 points down, +90 right. r=(90-lat)/180*R, x=r*sin(lon), z=r*cos(lon).
- **Photoreal only.** No cartoon primitives (boxes, cones, plain cylinders, flat trees). **Never box buildings.** Sprites, glows and shaders are OK.
- One photoreal map for every year; borders and labels follow the year.
- Stars only on the dome underside, black void outside, waters above the firmament.
- Moonlit areas are dark blue (~#0b1530), never pitch black. No glare: ACES, exposure ~0.9, no sun specular.
- Sheol is a dark cavern with dim embers, visible only from the side or below.
- A minimal glass UI. No text selection on iOS. Treat all countries equally (no Romania/Oradea specials).
- Don't bake in Google Earth data (terms of service). Free Esri imagery + OSM only.
- Write to Levi in Romanian (no diacritics) or English, casually and briefly. Don't repeat yourself.

## Scripture anchors used
Gen 1:6-8 (waters above), 1 Enoch 18:11-16 (abyss fire, seven stars), 1 Enoch 72-79 (sun/moon gates), 1 Sam 2:8 and Job 9:6 (pillars), Joshua 10:12-14, 2 Kings 20:9-11.

## 2026-11-02 16:10 EET: selection fix + F (selectable cities)
- Fix: country selection was dead on GitHub Pages for two reasons. (1) `polities.json`/`countries_info.json` were loaded via `<script type="application/json" src>`, which browsers never fetch (only Hark's host inlined them), so CI/POL were empty. Now classic `polities.js`/`countries_info.js` (regenerate with `sh tools_jsonjs.sh`). (2) Since 5934fc2 the thin "waters above" shell is visible top-down and caught every tap; background shells (BG) no longer beat land under the finger.
- F: `cities_data.js` (Natural Earth 7.3k places + D's hand-dated founding years), lazy-loaded. `cityTick()` after render: show from founding year (undated towns from AD 1800, `CTY_UNDATED`), below `cityAltMax(min_zoom)`, greedy screen declutter (36 mobile / 80 desktop), 44 px tap box, panel via showCard. Test hooks: `harkDbg.scr/idt/sel/year/cities`.

## L2 — street lamps on real poles (2026-11-02)
- OpenFreeMap (OpenMapTiles schema) carries no `highway=street_lamp` nodes, so lamps are placed deterministically along road centrelines from the same z14 tile (`slBuild`): spacing/width per class in `SLR` (motorway 40 m paired … minor 27 m staggered); service lanes skipped (they run through courtyards/under buildings).
- Each lamp is offset to the road edge (width/2 + 2 m), arm yawed back over the carriageway; rejected if the foot, the head or a 3 m ring falls inside any building footprint of that tile (`inPolys`, 64×64 grid index).
- Geometry: one InstancedMesh per tile (lathe pole + tube arm + lathe head, `POLE`/`POLE_MAT`, real metres via M) visible < 1.5 km; lights are one Points per tile (N heads + N ground pools), `depthTest:true` with log-depth chunks so buildings/terrain occlude them; no depth write.
- LOD: draw range sorted major-roads-first; all lamps drawn below 1.5 km; far tiles thinned (mobile ×0.6). Lights only at night (camera > 3.4 units from the sub-solar point), after the region's electrification year (D).
- Fixes: night test now reads `sun.position` directly and `WU.uSunW` is refreshed in the same frame as the sun move (was a frame stale). `setYear` now updates `lastBI` immediately (tap card no longer says "Borders as of AD 2010" right after a year change). Debug: `harkDbg.sunFor(dDays)`.

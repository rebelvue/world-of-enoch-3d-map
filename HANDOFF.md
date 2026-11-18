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

## V2 traffic (2026-11-02)
- Cars drive the OFM z14 road graph of each street-lamp tile (no extra fetch); tunnels/service lanes skipped, so never through buildings. Lane offset per driving side (LHT bbox list: UK/IE, JP, IN subcontinent, AU/NZ, southern Africa, Indonesia, Thailand etc.; Sweden left until 1967). One-way tags honoured; cars slow into line ends and turn onto a connected road.
- Density curve: 0 before 1886; share(y) = 1/(1+exp(-(y-(ey+55))/10)) where ey = regional electrification year (proxy for development); x rushK(local solar hour): peaks 07-09 and 16-19, sparse 0-5. Caps 70 cars/tile desktop, 28 mobile; tiles in view under ~3 km only.
- Night: white headlights + forward pool, red tails (additive points, depth-tested so buildings occlude). Toggle "Traffic" in the Show menu.
- Fix: trNext counter T.k was uninitialised (NaN index crashed the frame loop on mobile).

### L2 follow-up (2026-11-02)
- Every building ring (outer and courtyard) of the same z14 tile now rejects a lamp (foot, head and a 3 m ring); service lanes get no lamps.
- Verified with `harkDbg.roof()`: vertical rays from 400 m above every 7th lamp head against all loaded building meshes (all tiles, so neighbouring-tile footprints count) -> 0 / 1789 lamps under a roof (Paris 2026). Lamp base = `ground()` terrain height, never roof.
- The "lamps on roofs" look in oblique night views came from oversized point sprites (cores up to 14 px, pools up to 90 px) painting across roofs from lamps just behind roof edges. Cores are now capped at 7 px and pools at 48 px (pool size 1.5), so glows stay street-sized.
- OFM has no street_lamp nodes, so there are no private-ground OSM lamps; all lamps are placed by rule at road edges (within road half-width + 2 m of a centreline).
- Day/night gate: JS > 3.6 subpoint units, same as the shader; `harkDbg.sunFor(dDays)` gives test sun positions.
- Borders card updates in the same frame as the year (lastBI set in setYear).

### V2 traffic (2026-11-02)
- Cars drive the OFM z14 road graph of each street-lamp tile (same fetch). Lane offset by country: left-hand traffic boxes (UK/IE, JP, IN/PK/BD/LK, AU, NZ, ZA region, ID, TH, MY, KE/TZ/UG, ZM/ZW/MW, MZ), Sweden left before 1967; French Channel coast excluded from the UK box. `harkDbg.lht(la, lo, y)`.
- One-way tags honoured; cars slow into line ends and turn onto a connected road; tunnels skipped.
- Density curve: 0 before 1886 (Benz Patent-Motorwagen), then share(y) = 1/(1+exp(-(y-(ey+55))/10)) where ey is the region's electrification year from the city-lights table (London/US earliest). ~1% around 1900-1910 in early regions, ~10% by ~1925-35, half by ~1935-1960, near saturation today. Time of day `rushK(h)`: peaks 07-09 and 16-19 local solar time, sparse 00-05.
- Only tiles in view under ~3 km; caps 28 cars/tile mobile, 70 desktop. Headlights (warm white, forward glow) and red tails at night, depth-tested so buildings occlude them.
- Toggle: menu > Show > Traffic.

### Polity data fix (2026-11-02)
- polities.json held only the 40 largest polities per snapshot, so e.g. France was missing in 1492 and 1914 and a tap in central France returned the Holy Roman Empire. Rebuilt from aourednik/historical-basemaps (all named features, polylabel label points, sorted by area). Labels still draw the 40 largest per snapshot; selection and search use all.

## S — atmospheric sky (Rayleigh/Mie)
- `skyBox`: Preetham model ported from three r147 `Sky.js`, camera-centred BackSide sphere, opaque render list with
  alpha blending (renderOrder -50, no depth) so it always sits behind terrain. Sun elevation for the viewer comes from the
  distance to the sun subpoint: 90° at the subpoint, 0° at the 3.75-unit night edge used by terrain/lamps.
- Fades out between 15 and 400 km altitude (firmament view takes over); stars dim by day (`starU.uDim`). Toggle: Sky.

## V3 — aircraft, contrails, spray-trail variant
- Simulated (never live) from `airports_data.js` (OurAirports, public domain): weighted airport pairs, max range by era
  (900 km <1930, 2500 <1950, 6000 <1960, else 14000), straight lines in AE disc space, there-and-back loops.
- Airborne curve `acCount(y)`: 0 before 1903; 5+2/yr 1903-1918; from 1919 `10500/(1+exp(-(y-1978)/12))` (~80 in 1919,
  ~1000 in 1950, ~1900 in 1960, ~10,300 today). Rendered sample cap 10k desktop / 2.5k mobile; nearest 160/60 instanced.
- Cruise 10-11 km (3-6 km before 1950), linear climb/descent over first/last 180 km. Types by era (`AC_TYPES`).
- Disc scale: points (white by day, red beacon at night) + faint 3-puff contrails. Close: instanced airliner
  (lathe fuselage, extruded swept wings/tail, nacelles), nav lights red port / green starboard / white tail strobe where
  it is night for that aircraft. Persistent contrails only above 7.5 km, ~35% of flights from 1942 (20% before 1960):
  overlapping puffs spreading and fading, sun-coloured (white, warm at the terminator, dim at night).
- "Spray trails (chemtrail account)" toggle (off by default): from 1997, 15% of flights get long, wide, lingering
  trails that cross into grids. Card: "Project chemtrail account: persistent spray trail" + "Official explanation:
  persistent contrails from ice crystals in humid air". Tap: 44 px targets (22 px radius), checked before cities.
- Debug: harkDbg.ac(), acLook(spray, back_m, up_m, night), acScr(), acTime(t). Tests: 1910 (19), 1960 (1915), 2026.

## M events (curated)
- `EV` table in index.html (before `show_traffic`): [category, name, yearFrom, yearTo, lat|track, lon, radius km, fx, card text]. 66 events across 11 categories, each with its own toggle under "Events".
- Sources: AM chronology (Flood 2348 BC), IBTrACS (cyclone tracks; spirals move along the track), NOAA NCEI (tsunamis; expanding fronts), USGS (earthquakes), Smithsonian GVP (eruptions), CTBTO/DOE (nuclear tests), launch records.
- Effects are one shared ShaderMaterial (logdepth) on ground/dome quads: ring, glow, spiral, plume, dome, front, flood. Rockets are growing ascent lines; Apollo 11 curves into the Atlantic, and its card shows the flat-earth account alongside the official record. Starfish Prime/Argus light the dome.
- Caps: 24 active on mobile, 80 on desktop. Tapping within 22 px opens a glass card. `window.__ev` is a debug hook.

## T vegetation
- `vegetation()` (called before `buildings()`): z14 OpenFreeMap tiles; `mvtVeg` reads landcover (wood/forest, scrub/heath), landuse (park, cemetery, garden, recreation) and park polygons.
- Per tile, a 512 px canvas mask: vegetation polygons are filled, then buildings (with a 3 px buffer) and roads (4–6 px) are painted out. Instances are seeded deterministically, capped at 24k per tile on desktop and 7k on mobile.
- veg_atlas.webp: 6 impostor cells rendered offline in three r147 from CC0 Poly Haven scans (tree_small_02, island_tree_01, fir_sapling_medium a/b, wild_rooibos_bush, shrub_02). These are photoreal impostors, not primitives.
- Shader: cylindrical billboard, two-frequency wind sway (scaled by height²), random mirror, night darkening per instance using its distance to the sun subpoint, logdepth.
- LOD: beyond ~2 km instances are thinned in proportion to 1/distance (uLod 1.2 on desktop, 0.6 on mobile). Shown below 5 km altitude. Toggle: "Trees & bushes". Debug hook: `window.__vg`.

## Y cinematic look
- `cinePass()` runs after the main render and the shimmer pass: it copies the frame to a FramebufferTexture and draws one full-screen grade quad.
  - No EffectComposer, so it keeps the existing log-depth canvas path and the shimmer copy.
- What the pass does:
  - Teal/amber split grade.
  - Golden and blue hour emphasis, from the camera's distance to the sun subpoint (3.2–4.0).
  - Vignette and grain.
  - Anamorphic sun streak and glow, gated by the brightness at the sun pixel, so it handles occlusion.
- Desktop only: edge chromatic aberration, 8-tap soft bloom and 14-step god-rays.
- Mobile tier: grade, vignette, grain and a short streak only.
- Toggles: "Cinematic look" (on) and "Letterbox" (off; 2.39:1 on landscape, 60% height on portrait).

## Phase 1 — self-hosted tiles replace NASA (2026-11-18, Hark)
- Tile host: https://rebelvue.github.io/enoch-tiles/ (repo rebelvue/enoch-tiles, GitHub Pages, CORS *). Manifest: `tiles.json`.
  - Imagery: `imagery/{L}/{ty}/{tx}.webp`, 512 px, L0-L7. Sentinel-2 cloudless 2020 by EOX (contains modified Copernicus Sentinel data), CC BY-NC-SA 4.0.
  - Heights: `height/{L}/{ty}/{tx}.png`, 256 px, L0-L6, Terrarium encoding (R*256+G+B/256)-32768 m, real values incl. bathymetry. Copernicus DEM GLO-90 (ESA/DLR/Airbus) on land, GEBCO 2024 at sea.
  - Projection: the map's own north-pole azimuthal equidistant disc. Square [-1,1]^2, level L = 2^L x 2^L tiles, ty counted from the top, lon 0 points down (+y), +90 E right; r=(90-lat)/180, x=r sin(lon), y=r cos(lon). Tiles fully outside the disc 404. Scene: x = x*R, z = y*R.
  - Bake scripts live in Hark's workspace (`/workspace/work/enoch/bake/`, not in this repo). Note: Sentinel-2 has no data at the north pole, so the bake has a small white ice fill there.
- What replaced what:
  - `earth_disc_today_4k.webp` / `_1k.webp`: was NASA Blue Marble; now imagery L3 stitched (8x8 x 512 = 4096), 1k by Lanczos. Same framing (disc fills the square, black outside), checked by coastline overlap with the old file.
  - `height_today.webp`: 2048 greyscale (R channel), land = max(0,h)/8848*255 (box-averaged from L5), sea = 0. The old file had oceans at ~24 (~830 m too high); no code relied on that.
  - `normal_today.webp` / `_1k.webp`: regenerated from the new heights, same convention as before (R = -dh/dx, G = +dh/d(row down), B up; mean ~[128,128,253]).
  - Streaming relief: `elev()` / `elevAtM()` / `load()` / `build()` no longer use `s3.amazonaws.com/elevation-tiles-prod/terrarium` (contained NASA SRTM). Each Esri Web Mercator tile z/x/y now requests the enoch height tiles covering it (`eKeys(t)`: level L = clamp(z-3, 0, 6), dropped until at most 4 tiles cover it). `elevAtM(mx,my)` converts mercator -> lat/lon -> disc and samples the finest loaded enoch tile (L6 down to L0). Cache (EC, 120), priorities (pr-0.5) and the `done` counting (1 + number of height tiles) are unchanged. Water flag `aW = e <= 0` works with GEBCO's negative sea values. Max relief detail is now ~2.4 km/px (L6) instead of AWS z15.
  - Esri World Imagery streaming is unchanged (close-zoom imagery). The enoch imagery is NOT yet a streaming layer.
- Credits: menu fineprint now reads "Imagery: Sentinel-2 cloudless 2020 by EOX (contains modified Copernicus Sentinel data), CC BY-NC-SA 4.0. Elevation: Copernicus DEM GLO-90 (ESA/DLR/Airbus), GEBCO 2024." The Mapzen/AWS Terrarium credit was removed.
- Remaining NASA assets: `night_lights_4k.webp` / `night_lights_8k.webp` + GIBS VIIRS Black Marble streaming tiles (task D, "NASA Black Marble" credit kept for them), the LRO moon texture in the watch app, the eclipse canon spec (NASA/Espenak).

## Phase 2 — Mapterhorn high-res terrain for close zoom (2026-11-18, Hark)
- Source: https://tiles.mapterhorn.com/{z}/{x}/{y}.webp (TileJSON https://tiles.mapterhorn.com/tilejson.json: xyz, terrarium, tileSize 512, no maxzoom field; tiles exist to z17). Web Mercator, same scheme as Esri. Copernicus GLO-30 is served worldwide up to z12; z13-z17 only where a national LiDAR/open DEM exists (elsewhere 404). Attribution list: https://download.mapterhorn.com/attribution.json.
- Code (index.html, after `elev()`): `MTU`, `MC` (Map, LRU, cap `MCAP` 48 desktop / 24 mobile, Float32Array 512x512 = 1 MB each), `MF` (failed keys), `mtKey(t)`, `mtel(z,x,y,pr,cb)`, `mtSample()`, `inIL()`.
  - Each Esri tile with z >= 8 (`MTZ0`) requests ONE Mapterhorn tile at z-3 (capped at 17): it spans 8x8 Esri tiles = 64 height px per Esri tile (PERF.G is 32/24 vertices, so ~2 px per vertex; z-1 would be 8x the downloads for detail the grid can't show). Requested at priority pr-0.6 through the same `req`/`pump` queue; counted in `load()`'s `done`.
  - A 404/failed/tainted tile (`dec(im, 512, true)` returns null) is put in `MF` and the request walks up to the parent zoom, down to z12; if that fails too the tile builds from enoch heights (still always requested).
  - `elevAtM(mx,my)`: finest loaded Mapterhorn tile (MTHI down to z5) unless the point is inside the Israel bbox, else the finest enoch tile (L6..L0). `build()` falls back to the tile's own `t.mt` / `t.el` if the cache evicted them.
  - Camera floor (`gS` in the frame loop) also takes `elevAt()` (raw finest heights) when streaming, if within 300 m of the drawn ground.
  - `dec(im, S, strict)` and `bil(d, px, py, S)` now take the tile size (256 enoch, 512 Mapterhorn).
- NO NASA rule: Mapterhorn's Israel 10 m layer (source isr10) is derived from ASTER GDEM (NASA/METI). Inside lat 29.4-33.4, lon 34.2-35.95 (`ILB`, mercator) Mapterhorn is never sampled, and never requested for Esri tiles wholly inside; enoch Copernicus heights are used there. Keep this guard if you touch elevation.
- Credit (menu fineprint): "Terrain detail: Mapterhorn (Copernicus GLO-30 and national open elevation data, see mapterhorn.com/attribution)".

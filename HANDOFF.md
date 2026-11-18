# HANDOFF - for Claude, Grok Bot, or any AI picking this up

You are continuing work on **World of Enoch 3D Map** for Levi (David Daragiu). Hark has been building it; if Hark ran out of limits, start here.

## What this is
A single-file interactive 3D web map (three.js r147, classic scripts, no build step) of the flat disc earth as described in 1 Enoch and Genesis. It works like Google Earth: photoreal, real scale. Since 2026-11-18 it shows the present day only (2026, today) with a time-of-day scrubber; the 3382 BC-2026 timeline and all history were removed at Levi's request.
- Main file: `index.html` (~307 KB). Local lib: `three.min.js`. Data: `borders_data.js` (window.BORDERS.modern only), `countries_info.js`, `airports_data.js`, `cities_data.js` (lazy), `tz_data.js` (lazy, clock HUD).
- Live (Hark-hosted): https://hark.com/site/c38fa708-62d3-426e-b65f-e825840d47ac
- Feature checklist (done / not done, how to verify each): **`FEATURES.md`**. Read it first.
- Full specs per item: **`edit_queue.md`** (items A-Y; history-dependent ones struck 2026-11-18).

## How to take over
1. Read `edit_queue.md`. Below you'll find the next item and the item order.
2. Make ONE small, focused edit at a time in `index.html`. Open it in a browser (any static server, e.g. `npx serve`) to check it; there's no build step.
3. Commit with the queue letter in the message (e.g. `Q: ice wall + progressive load`). Push to `main`.
4. Mark the item done in `edit_queue.md`.
5. Ask Levi to test on his iPhone and send screenshots. He mostly tests on iOS Safari.

## Status (2026-11-02 02:52 EET)
Done and pushed: vector historical borders, streaming Esri imagery + AWS Terrarium terrain (z19), floating origin, mobile perf profile, Sheol underworld, flame columns in the abyss, waters above the dome, seven prison stars, compass, side buttons, speed chips, selection spotlight (P).
T3 gestures + reset + U search + fineprint removal: DONE (commit after 8115350).

Next (2026-11-18 on, present day only): **E-K** + **X** atmosphere, clouds, ocean, Milky Way/real constellations (H), motion blur/shake. Dropped with the history (do not build): D-by-era, M, V, W, C, L, J.

## Hard rules (Levi's)
- **Real scale only.** R = 10 units = 20,015 km. No relief exaggeration.
- **Projection:** north-pole azimuthal equidistant. lon 0 points down, +90 right. r=(90-lat)/180*R, x=r*sin(lon), z=r*cos(lon).
- **Photoreal only.** No cartoon primitives (boxes, cones, plain cylinders, flat trees). **Never box buildings.** Sprites, glows and shaders are OK.
- Present day only (2026, today): no timeline, no historical borders or events (Levi 2026-11-18). Time of day is the only time control.
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

## L2 / V2 street lamps and traffic: REMOVED 2026-11-18 (Levi). The notes below are history only; the code is gone.

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
- Remaining NASA assets: none in this map since 2026-11-18 (night lights replaced, see below). Outside index.html: the LRO moon texture in the watch app, the eclipse canon spec (NASA/Espenak) for task V.

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

## Night realism, clock HUD, props removed, faster loading, GHSL night lights (2026-11-18, Hark)
- TRUE NIGHT (`NIGHT` chunk, used by the base disc, every streamed tile via `tileOBC`, and the ice wall): `sunElD(d)` = max(-34, (1 - (d/3.75)^4) * 90) deg, the sky's own model. dayL = pow(smoothstep(-18, 8, el), 2.6): ~0.5 at sunset, ~0.12 at -6 (civil), ~0.005 at -12 (nautical), 0 at -18. Night colour: #0b1530 base + imagery luminance (12% colour kept) * cool blue, x(1 + 1.3 moon) where moon = phase illumination (1-cos ph)/2 * moon above the horizon (`uMoonW`, `uMoonP`, set next to the moon in the frame loop), + a small lift below 2 km (`uNF`). Blue-hour tint on the remaining daylight between +2 and -18 deg. The old shader used smoothstep(3, 7) * 0.85 and a 27-44% floor near the ground, which is why daylight imagery showed at night.
- OSM buildings (`OB.mat`) use the same elevation night (full, no 0.92 cap); far-window glow 0.45 -> 0.2.
- Night lights: `night_lights_4k/8k.webp` are now r = sqrt(light intensity) derived from GHSL GHS-BUILT-S R2023A (epoch 2020, EPSG:4326 30 arcsec, European Commission JRC; built-up fraction -> core (f-0.02)/0.30 ^1.3 + soft halos), same disc projection; g = electrification year kept from the previous file (from the D table, not NASA data). Shader: nI = r*r. Streamed detail: `nightTile()` picks enoch-tiles `lights/{L}/{ty}/{tx}.webp` (L6 for Esri z>=10, L5 for z8-9) when the whole Esri tile sits inside one lights tile and the tile exists (`NLB` base64 bitmasks, 256 L5 / 764 L6 tiles stored). `uNLk` = 0.08 + 0.92 * smooth(5, 300, akm): city glow from afar, faint warm street glow close up (modulated by the imagery's paved brightness, `nSt`). GIBS Black Marble streaming removed. Bake scripts: Hark workspace (/tmp/ghsl s1.py/s3.py at bake time; logic described here). enoch-tiles commit f598dfc adds lights/ and the tiles.json layer.
- Clock HUD (`CLK`, `clkTick` every 250 ms, `#clk` in `.x-bottom` so H hides it): shown when the camera is above the disc, inside it and below 3 km. Ground point = toLL(camera x, z). Zone: `tz_data.js` (window.TZ_POLYS, timezone-boundary-builder 2026f incl. territorial waters, simplified 0.006 deg, polyline-encoded x100, ~480 KB), lazy-loaded by script tag on first use; point-in-polygon with holes, a point in a simplification sliver takes the nearest zone within ~6 km, else Etc/GMT+-N by longitude. Civil time: Intl.DateTimeFormat(en-GB, timeZone) of the sky clock (dayT; Live = now; date shown when the sky is not Live). Abbreviation: en-US short name, en-GB when that is only GMT+x. Solar: 12 + (lon - subsolar lon)/15 h (apparent solar time, includes the equation of time).
- Removed: street lamps (SL, POLE, slBuild, streetLights), traffic (TR, CARG, trBuild, traffic(), LHT/leftHand), the Traffic toggle, the instanced 3D airliner (ACG/AC_MESH; aircraft remain dots, nav lights, contrails, tap cards), harkDbg.roof/lht. `mvtRoads` + `SLK` stay (vegetation paints roads out). OpenFreeMap URL now `OFM.url`.
- Loading: preconnect links for the tile hosts; `sw.js` (cache woe-tiles-v1, cache-first for Esri tiles, Mapterhorn, enoch-tiles; trims oldest entries when navigator.storage.estimate() > 300 MB) registered only when the page has a real origin (GitHub Pages). On hark.com/site the page runs in a sandboxed iframe (no allow-same-origin, opaque origin) so service workers cannot run there; registration is skipped silently. The existing queue already requests parents first and screen-centre tiles first, and keeps the parent drawn until all children are built.
- Tests: headless Chromium (Playwright 1.48, swiftshader), tile hosts routed through Node fetch, lights served from the bake: 0 pageerrors.

## 2026-only: history and events removed, time-of-day scrubber with auto-return (2026-11-18, Hark)
Levi: "Focus strictly on 2026, the current day, to lighten the load. Remove history ... keep the 24-hour simulation ... automatic return ... a cool slider to scrub the hour and minute of the day."
- REMOVED: year slider/arrows/play/1-10-100 y/s chips, AM + year readout, EVENTS captions (#verse), setYear/yF/yearN/SN/lastBI, polities.js + polities.json (labels set P, nearPol, selMaskPol, polity search + year jumps, "Not yet established", "Year shown"), historical snapshots in borders_data.js (now `{modern}` only, 39 KB), Events layer M (EV/EVS/evTap/evOpen + the Events menu block), Flood rain + windows of heaven (waterU.uFl stays 0), ancient A/B place labels, LIGHTS table + pre-electric lamp points (cityL/lightsBuild) + towns_data.js + elecYear, the era factor in the night-light shader (nlE = 1, uNLY gone), OSM window glow by era (uEl stays 1), aircraft era curve/types (acCount() = today's ~10,300; modern types; 14,000 km range), city founding filter, Ussher/historical-basemaps credits, "Timeline speed" menu section, "Event captions" label toggle. `var YEAR = 2026` is the only year left.
- ADDED: `.x-ts` panel in `.x-bottom` (where the year slider was): `#ts-t` HH:MM, `#ts-d` date, `#ts-s` status, `#sky-spd` chip, `#ts-now`, `#ts-track` (role=slider) with `#ts-band` day/night gradient, hour ticks, `#ts-nowm`, `#ts-thumb`; altitude readout `#alt` under it. JS after `setInterval(clkTick)`: `TS` state, `tsT(min)`/`tsMin(dayT)` (local-date minutes, DST-safe), `tsUI()` (frame + every 250 ms), `tsBand()` (49 samples of the sky's elevation model `(1-(d/3.75)^4)*90` at `tsRef()`), `tsReturn()`, `tsHold()` (4 s), `window.onSky` hook called by `setSky`.
- Frame sky time: `TS.ret` eases dayT from the scrubbed time to now + w (w = whole days skipped by going the short way round), moon/stars/phase use dayT - w*e so they end exactly on now; `TS.held || TS.drag` freeze dayT; Live = skyNow(); speeds advance and loop within today. `clkTick` uses `tsLive()`.
- Debug: `harkDbg.ts()` -> {live, held, drag, ret, min, now, txt, st, sky}. `harkDbg.year` removed.
- FIXED: aircraft(), vegetation(), buildings() were inside a // comment on the uNLk line since 0052525 (never ran); restored.
- Model note (not changed): the sky's day/night model (day where the disc distance to the sun subpoint < 3.75 units) gives very short northern winter days (e.g. Nov 18 at 25N about 09:15-13:45, at 46N about 12:00-13:30 Bucharest time). The scrubber's band shows exactly that model.
- Weight (index.html + scripts at start): 1,285,359 -> 1,086,333 bytes; plus the auto-loaded set after the first frame (borders, cities, towns): 1,069,151 -> 526,313 bytes. Total 2,354,510 -> 1,612,646 (-31%).
- Tests: node --check on all inline scripts; headless Chromium (Playwright 1.48, swiftshader, port 8768, tile hosts via Node fetch): 0 pageerrors; scrub to 12:00 / 22:00, fine scrub, 4 s auto-return, Now button, play + scrub all verified via harkDbg.ts().

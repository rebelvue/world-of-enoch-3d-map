# FEATURES CHECKLIST - World of Enoch 3D Map

Every feature Levi asked for. Status: [x] done (grep-verified), [~] partly / unverified on device, [ ] not built.
An agent continuing the work: verify each [x]/[~] in `index.html` (grep hint given) and on a phone; build [ ] items in the order given in HANDOFF.md. Full specs: `edit_queue.md` (letter in brackets).
Last updated: 2026-11-18 (Hark: 2026-only - history and events removed, time-of-day scrubber with auto-return).

## Core / world
- [x] Flat disc, north-pole azimuthal equidistant, REAL scale R=10 units=20,015 km, no relief exaggeration
- [x] Present day only (2026, the current day): one photoreal map, today's borders/countries/cities, no timeline (since 2026-11-18)
- [x] Streaming Esri imagery at every altitude, zoom up to 19 + grey-placeholder fallback [R, R2] - grep `19`, `placeholder`
- [x] Streamed relief from self-hosted enoch-tiles heights (Copernicus DEM GLO-90 land + GEBCO 2024 sea, Terrarium PNG, L0-L6 on the disc projection; replaced AWS Terrarium/NASA SRTM 2026-11-18), skirts, no tile duplication / olive band [R] - grep `enoch-tiles`, `eKeys`, `skirt`
- [x] Phase 2 close-zoom relief: Mapterhorn open terrain (tiles.mapterhorn.com, 512 px Terrarium WebP, Copernicus GLO-30 worldwide + national LiDAR/open DEMs to z17) for Esri tiles z>=8 (Mapterhorn z = min(17, z-3), 404 walks up to parent zoom down to z12, enoch fallback); separate LRU cache 48 desktop / 24 mobile; elevAtM returns the finest loaded value (Mapterhorn, then enoch); camera floor also checks raw elevAt. NO NASA: never sampled or requested inside the Israel bbox lat 29.4-33.4, lon 34.2-35.95 (Mapterhorn's isr10 there is ASTER-derived), enoch heights used there. Credit in menu fineprint - grep `tiles.mapterhorn.com`, `inIL`, `mtel`
- [x] Base disc textures rebuilt from own data (2026-11-18): earth_disc_today_4k/1k = Sentinel-2 cloudless 2020 (EOX) imagery L3 stitched; height_today = Copernicus/GEBCO land heights (255 = 8848 m, sea 0); normal_today(_1k) regenerated. No NASA Blue Marble left - grep `Sentinel-2 cloudless`
- [x] Night lights rebuilt without NASA (2026-11-18): night_lights_4k/8k.webp (r = sqrt(light) from GHSL GHS-BUILT-S R2023A 2020 30" built-up, European Commission JRC; g = electrification year kept) + streamed detail tiles enoch-tiles lights/L5-L6 (empty tiles skipped via the NLB bitmask). GIBS Black Marble streaming removed. Credit "Night lights derived from GHSL, European Commission JRC" - grep `NLB`, `ETL`, `GHSL`; grep -i `nasa|gibs|black marble` in index.html = 0
- [ ] Remaining NASA assets elsewhere (not in index.html): LRO moon in the watch app
- [~] Base disc noise, camera floor 20 m, horizon haze [A] - check on device
- [~] Ice wall as real 3D cliff (~60 m edge rising to ~4 km plateau) - unverified
- [x] Ice wall texture/label glitch fix, webp assets, progressive fast load, lazy borders_data.js [Q] - grep `iceBF`, `data-full`, `bs.src`
- [x] Floating origin + dynamic near/far (no jitter close up) - grep `ANC0`
- [x] Mobile perf profile, build queue, culling, idle pause - grep `MOB`, `PERF`
- [x] No box buildings anywhere (NEVER reintroduce) - grep `boxG` = 0
- [ ] Real 3D buildings from OpenStreetMap (Overpass) at close zoom [S]

## Cosmology (1 Enoch / Genesis)
- [x] Firmament dome, stars only on its underside, black void outside
- [x] Waters above the firmament (Gen 1:6-8) - note: texture shows stripes, needs a nicer look
- [x] Seven burning prison stars beyond the abyss (1 Enoch 18:12-16)
- [x] Abyss columns of heavenly fire as photoreal flame/smoke (1 Enoch 18:11) [N]
- [x] Sheol/Hades underworld pass, pillars of the earth (1 Sam 2:8, Job 9:6) [O]
- [~] Sheol vignette + opacity fix [O] - missing / unverified
- [x] Glow markers: gates, portals, mountains, Garden of Eden
- [ ] Milky Way + real constellations on dome, real-size sun/moon, Enoch lunar phases [H]
- [~] Sun/moon through Enoch's gates, moonlit night dark blue (#0b1530), no glare (ACES ~0.9) [A]
- [x] TRUE NIGHT (2026-11-18): ground (base disc, every streamed tile, ice wall) and OSM buildings darken by local sun elevation (same model as the sky: 0 deg at 3.75 units from the subpoint), smooth through civil/nautical/astronomical twilight with a blue-hour tint, to desaturated moonlit #0b1530; brighter under a high full moon (uMoonW/uMoonP), slightly lifted below 2 km (uNF); city lights emissive on top - grep `sunElD`, `TRUE NIGHT`, `uMoonP`
- [x] Clock HUD below 3000 m (2026-11-18; shows the scrubbed time while scrubbing, real time when Live): IANA zone + abbreviation, civil time with live seconds (Intl.DateTimeFormat, follows the sky clock), local apparent solar time from the sun's subpoint (includes equation of time); zones from tz_data.js (timezone-boundary-builder 2026f, ODbL, ~480 KB, lazy), Etc/GMT+-N over open sea; hidden with H - grep `CLK`, `tzAt`, `clk`

## Time of day (2026 only; history removed 2026-11-18)
- [x] REMOVED 2026-11-18 (Levi: "focus strictly on 2026, the current day"): year slider 3382 BC-2026, year play/back + hold arrows, 1/10/100 y/s chips, AM readout, scripture-event captions, historical border snapshots + polity labels/selection/search (polities.js/.json deleted, borders_data.js now modern only, 471 KB -> 39 KB), Flood rain/windows of heaven, Events layer M (66 events, 11 toggles), ancient place-name labels, era city-light/electrification rules (LIGHTS table, towns_data.js deleted, nlE = 1), aircraft era curve (today's ~10,300 airborne), city founding filter. Grep proof: grep -E 'setYear|yearN|EVENTS|evTap|POL_DATA|elecYear|towns_data|uNLY|rainU|Ussher|Year shown' index.html = 0
- [x] Time-of-day scrubber (bottom glass panel): today 00:00-23:59 on the device clock, HH:MM large, date + status (Live / Scrubbing / Back to now in N s / Returning / Paused / Playing), day/night band (sun elevation through today from the sky's own model at the view centre below 4000 km, else the device's zone meridian), hour ticks, green now marker, glowing thumb (gold day / rose twilight / blue night). Drag anywhere (thumb grab never jumps), slide the finger up for fine control, snaps to whole hours and to now (navigator.vibrate where supported), keyboard arrows/PageUp/Home/End; touch-action none, no selection - grep `x-ts`, `tsSet`, `tsBand`
- [x] Auto return: in Live, 4 s after the finger lifts (or on Now) the sky turns back to the real time along the shortest way round the clock in 1.8 s (cubic ease in-out), moon/stars take up a skipped whole day so they land exactly on now, then Live. Camera untouched - grep `tsReturn`, `TS.ret`
- [x] Sky speed chip kept beside Now (Live, 24 min/d, 1 min/d, 10 s/d, Paused): playing loops through today; a scrub while playing sets the time it plays on from; Paused stays where it is put; choosing Live animates back - grep `onSky`
- [ ] Not built and now dropped (history-dependent): Creation cinematic + pre-Enoch events [W], ~300 dated events [L], landmarks rising/falling [C], cities growing [J], conflict/nuclear/fire VFX [M], historical eclipses + Joshua/Hezekiah [V]

## Controls / UI
- [x] Google Earth / Apple Maps gestures: anchored pan + fling, pinch zoom to centroid, twist, 2-finger tilt, double-tap in, 2-finger tap out [T3] - grep `twoTap`, `dblclick`
- [x] Desktop: left drag pan, wheel zoom to cursor, right/ctrl drag rotate+tilt [T3]
- [x] Compass (tap = north) + reset button under it (1.2 s to top-down default) [T3] - grep `viewReset`
- [x] Side buttons both edges (tilt, rotate, altitude, forward/back); joystick removed [T]
- [x] Search: countries, cities, continents; fly-to, select [U] - grep `srch`
- [x] Selection spotlight: chosen country full colour + glow border, rest dimmed (today's countries only) [P]
- [x] Label switches + Aa; countries and cities labels on by default
- [x] Tap ground picks ground (not Sheol) when zoomed in
- [x] "Interpretive model" fineprint removed; only "(c) Esri" in menu - grep = 0
- [x] Minimal glass UI, no text selection on iOS
- [x] Procedural props removed (2026-11-18): street lamps/poles, cars/traffic + headlights, the 3D airliner mesh (aircraft stay as dots, nav lights, contrails); Traffic toggle gone - grep `POLE|CARG|traffic|streetLights|AC_MESH` = 0
- [x] Faster loading (2026-11-18): preconnect to Esri/enoch-tiles/Mapterhorn/OpenFreeMap; tile queue already loads parents first and nearest-to-screen-centre first (pr = (z - root z) * 4 + tile distance from the centre ground point, +40 off-screen), parent stays drawn until all 4 children are built; sw.js tile cache (cache-first, ~300 MB, oldest deleted first) on hosts with a real origin (GitHub Pages); skipped on the Hark-hosted page (sandboxed iframe, opaque origin) - grep `sw.js`, `preconnect`
- [x] Hide/show controls: eye button under reset, H key, menu entry - grep `uiHidden`
- [x] Fix: search icon overlapping menu icon (verified 320/390/1440 px)
- [x] Default load view top-down, disc ~80% of screen; waters above thin when looking straight down - grep `wTop`

## Cinematic / look
- [ ] Atmosphere scattering, soft terminator, AO [E]
- [ ] Volumetric clouds you can fly through, cloud shadows, altitude fog [E]
- [ ] Ocean depth colour, foam, waves, river sheen [F]
- [ ] Detail textures by slope/altitude, snow, seasons, trees close up [G]
- [ ] Bloom, flare, DOF, grain, smooth fly-to, guided tours (Creation, Flood, Babel, Exodus) [I]
- [ ] Motion blur + camera micro-jitter/shake scaled by pinch speed and distance, toggle [X]
- [ ] Desktop high-quality vs mobile light mode [K]
- [ ] Overall cinematic look [Y] (Levi 2026-11-02 03:22): film-style colour grade (filmic LUT, teal/amber split), soft vignette, anamorphic lens feel (subtle chromatic aberration at edges, horizontal flare on sun), golden-hour/blue-hour lighting emphasis, light god-rays through clouds, fine film grain, letterbox option for tours; tasteful, never glare; toggle + mobile-light fallback

## Known bugs fixed
- [x] 2026-11-02 03:00 black screen: `var hv` overwrote heightmap `function hv()` -> renamed to `hvA` (edit -10). Test in headless Chromium: earth renders.

## D: city lights by era - REMOVED 2026-11-18
- Present-day lights only: the GHSL night lights are fully on at night everywhere; the hand-dated LIGHTS table, pre-electric lamp points and towns_data.js are gone.

## Known regression fixed 2026-11-18 (2026-only commit)
- Since 0052525 the per-frame calls aircraft(), vegetation() and buildings() had slipped into a // comment on the uNLk line, so aircraft, trees and OSM buildings never updated. Restored (events() dropped with M).

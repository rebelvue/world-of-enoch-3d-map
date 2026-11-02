# FEATURES CHECKLIST - World of Enoch 3D Map

Every feature Levi asked for. Status: [x] done (grep-verified), [~] partly / unverified on device, [ ] not built.
An agent continuing the work: verify each [x]/[~] in `index.html` (grep hint given) and on a phone; build [ ] items in the order given in HANDOFF.md. Full specs: `edit_queue.md` (letter in brackets).
Last updated: 2026-11-02 03:05 EET.

## Core / world
- [x] Flat disc, north-pole azimuthal equidistant, REAL scale R=10 units=20,015 km, no relief exaggeration
- [x] One photoreal map for every year (no supercontinent morph) [B]
- [x] Streaming Esri imagery at every altitude, zoom up to 19 + grey-placeholder fallback [R, R2] - grep `19`, `placeholder`
- [x] AWS Terrarium terrain, skirts, no tile duplication / olive band [R] - grep `skirt`
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

## Timeline / history
- [x] Year slider 3382 BC -> 2026, play forwards/backwards, hold-to-scrub arrows
- [x] Timeline speed chip (1/10/100 y/s); sky speed chip (Live, 24 min/day, 1 min/day, 10 s/day, Paused) [T+] - recheck chip strings
- [x] Historical vector borders + polity labels per year
- [ ] Creation cinematic Days 1-7 (waters split, dome, land, luminaries, life, rest), scrub both ways [W]
- [ ] Pre-Enoch events 4004-3382 BC: Eden, Fall, Cain/Abel, city of Enoch, Seth, Enosh, Kenan, Mahalalel, Jared + Watchers on Hermon [W]
- [ ] ~300 dated events + facts as cards while scrubbing [L]
- [ ] Landmarks rising/falling with the timeline, oversized, build/destroy animations [C]
- [ ] Cities grow over centuries; animated events (Flood, Sodom, Red Sea) [J]
- [ ] City lights by era: none before ~1880, London/NYC/Paris first, modern by ~1970, on at dusk/off at dawn [D]
- [ ] Conflict VFX: Jericho, Troy, Nineveh 612 BC, Jerusalem 586 BC/AD 70, Carthage 146 BC, Rome 64/410, Baghdad 1258, Constantinople 1453, WWI, Stalingrad, Dresden, Blitz [M]
- [ ] Nuclear: Trinity, Hiroshima, Nagasaki (flash, fireball, mushroom, shockwave); Bikini, Tsar Bomba [M]
- [ ] Great fires: Rome 64, London 1666, Chicago 1871, SF 1906, Hamburg 1943, Tokyo 1945 [M]
- [ ] Eclipses on real historical paths: Ugarit 1223 BC, 763 BC, 585 BC, AD 33 darkness, 1919, 1999, 2017, 2024 [V]
- [ ] Joshua's long day (sun over Gibeon, moon over Aijalon) + Hezekiah's sundial shadow back 10 steps [V]

## Controls / UI
- [x] Google Earth / Apple Maps gestures: anchored pan + fling, pinch zoom to centroid, twist, 2-finger tilt, double-tap in, 2-finger tap out [T3] - grep `twoTap`, `dblclick`
- [x] Desktop: left drag pan, wheel zoom to cursor, right/ctrl drag rotate+tilt [T3]
- [x] Compass (tap = north) + reset button under it (1.2 s to top-down default) [T3] - grep `viewReset`
- [x] Side buttons both edges (tilt, rotate, altitude, forward/back); joystick removed [T]
- [x] Search: countries, cities, continents, polities; fly-to, select, year jump [U] - grep `srch`
- [x] Selection spotlight: chosen area full colour + glow border, rest dimmed; persists through history; "Not yet established" [P]
- [x] Label switches + Aa; countries and cities labels on by default
- [x] Tap ground picks ground (not Sheol) when zoomed in
- [x] "Interpretive model" fineprint removed; only "(c) Esri" in menu - grep = 0
- [x] Minimal glass UI, no text selection on iOS
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

## D: city lights by era (done)
- About 150 hand-dated cities plus 7,300 Natural Earth towns (public domain, towns_data.js loaded lazily) light up the night side as additive points with soft halos.
- Before electricity there are only faint lamps in old cities. Grids come on from each region's electrification year and spread into the suburbs until about 1970. Each light switches on at its own moment as dusk passes.

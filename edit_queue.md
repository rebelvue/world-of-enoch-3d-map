# Edit queue (World of Enoch 3D Map) - Levi approved all, 2026-11-02
A (running): rendering fixes, lighting, sun/moon/stars, ice cliff, Sheol/pillars
B: same photoreal map all years (drop supercontinent/Peleg morph); waters above dome + windows of heaven at Flood; stars only inside dome; 7 prison stars beyond abyss; Google-Earth-style touch controls (1-finger pan, pinch zoom, 2-finger rotate/tilt), joystick optional
C: landmarks rise/fall with timeline, Civ VII oversized, build-up/destruction anims
D (city lights DONE; speed chooser was already there): time controls: timeline speed chooser; sky sim speed: 24h cycle, real system time, faster options; city lights switch on progressively at dusk, off progressively at morning; lights by era: none before ~1880 (oil lamps/fires as faint warm dots only in cities before), electric from 1880s in early cities (London, NYC, Paris), spread by region/era through 20th c., full modern by ~1970
E: atmosphere scattering, volumetric clouds+shadows, soft terminator, moonlit blue night + water reflections, AO
F: ocean depth colour/foam/waves, rivers sheen
G: detail textures by slope/altitude, snow, seasons by sun gates, trees low altitude
H: Milky Way + real constellations on dome, real-size sun/moon, Enoch lunar phases
I: cinematic: subtle bloom, flare, DOF, grain, motion blur, smooth fly-to, guided tours (Creation, Flood, Babel, Exodus)
J: cities grow over centuries; animated events (Flood, Sodom, Red Sea)
K: desktop high-quality mode vs mobile light mode
L: expand event captions into a rich dated event+fact feed (~300 events, biblical + world history, each with 1-line fact), shown as cards while scrubbing/playing; data inlined as JS
M: conflict VFX tied to timeline: fires/smoke at major battles & sacks (Jericho, Troy, Nineveh 612BC, Jerusalem 586BC & AD70, Carthage 146BC, Rome 64/410, Baghdad 1258, Constantinople 1453, WWI fronts, WWII Stalingrad/Dresden/London Blitz), nuclear: Trinity Jul 1945, Hiroshima 6 Aug 1945, Nagasaki 9 Aug 1945 (flash, fireball, mushroom cloud, shockwave ring), plus major test sites (Bikini 1946/54, Novaya Zemlya Tsar Bomba 1961) briefly

N. (Levi 01:25) Abyss "columns of heavenly fire" (1 Enoch 18:11) are plain translucent orange cylinders (fireMat, CylinderGeometry r 0.12-0.3, h 3.5, at r=11.8, y=-2.4) -> look like cartoon red pillars under the earth. Replace with photoreal volumetric fire/ember sprite columns (or remove if Levi prefers). APPROVED (Levi 01:29): photoreal animated flame + smoke columns. Remove cylinders entirely.

O. (Levi 01:40) Cinematic underworld pass: Hades/Sheol/Abyss must look much better and cinematic. Sheol: real cavern (rock walls/ceiling under disc with noise-displaced rock, wet sheen, volumetric dust shafts, low ember-lit fog layers, the 4 hollow places of 1 Enoch 22 as separate chambers, distant ember rivers), stone pillars with weathered texture. Abyss: deep chasm beyond the edge, layered volumetric red mist, falling embers/ash, heat haze, depth falloff into black. Grade: warm/cool contrast, no flicker, no z-fighting. Dispatch right after edit N lands.

P. (Levi 01:42) Selection spotlight: tapping a country/region/area -> only it stays full color with a glowing border; everything else darker + desaturated. Current state: shader dims on base disc only (uSel/uIds, country_ids.png modern countries), fades out below 1500 km (akm>1500 gate), not applied to streaming Esri tiles, not for historical polities. Fix: apply same dim/desat to tile materials (point-in-polygon mask from selected vector border rendered to a small mask texture in disc UV, or stencil), keep at all altitudes, support historical polity of current year (from BORDERS snapshot) and modern country, bright animated outline from vector polyline, tap empty/again to clear.

Q. [DONE 2026-11-02, Grok Bot: webp assets + 1k previews swapped to full, borders_data.js lazy, ice bump fades with distance (moire gone), ice label fades at the wall, unused ancient/borders png dropped] (Levi 01:49) Ice wall "text glitch" + better textures + faster load. Assets ready in /workspace/work/enoch/opt/: ice_cliff.webp (2048x1024 seamless albedo), ice_cliff_n.webp (normal), earth_disc_today_4k.webp (958KB vs 2MB jpg), earth_disc_today_4k_1k.webp (70KB preview), normal_today(_1k).webp, height_today.webp. Plan: progressive load (1k previews first, show scene in <1s, swap to 4k after), lazy-load borders_data.js after first frame, drop unused ancient files, ice wall uses new textures with stochastic/2-scale tiling to hide repeats; fix ice label (iceLabel y 0.004 -> lift and depthTest/occlusion so it doesn't z-fight/flicker on wall). Dispatch BEFORE P.

R. (Levi 01:53, screenshot near Santandrei, alt 1.71 km, AD 2026) Close-zoom tile glitch: imagery "splits up or duplicates" - a wide uniform olive diagonal band (looks like coarse base disc / zoom-2 backdrop texel showing through a crack) and the imagery on either side looks offset/ghosted. Suspects: crack between neighbouring tiles of different zoom (T-junction; skirts too short at true scale), parent+child LOD both visible (tdraw/tshow: parent visibility not reset; z-fight), per-tile elevation mismatch between levels, Mercator->azimuthal mapping only at grid verts. Fix: deep skirts (>= 200 m scaled by tile size) colored by edge texels, enforce neighbour LOD diff <= 1, snap shared edge verts to the coarser neighbour, only one LOD visible per area (hide parent once all 4 kids st 2 regardless of fade; no fade at close zoom), hide base disc + backdrop wherever any tile covers (stencil), use same elevation source per vertex position for all levels. PRIORITY: dispatch first after -4.
R+. (Levi 01:55, screenshot at 0.100 km) Imagery very blurry close up: zoom capped at 17 (line ~1540 Math.min(17,...)). Raise cap to 19 (Esri has z18-19 in most populated areas); if a z18/19 tile returns Esri's grey "Map data not yet available" placeholder (detect by tiny file size or uniform colour), keep the parent. Bias LOD up when tilted (use distance to tile, not altitude only). Fold into R.
S. (Levi 01:57) 3D buildings: APPROVED OpenStreetMap. Overpass API (overpass.kumi.systems / overpass-api.de fallback) fetched live per tile at zoom>=15 near camera, footprints extruded to height (height tag, building:levels*3 m, default 6-9 m by type), roof from roof:shape where simple, facade material procedural (plaster/brick by type) with window rows, roof color sampled from Esri imagery under the footprint, ambient occlusion at base. Trees from natural=tree/landuse=forest as instanced billboards? -> no (no cartoon) skip. Cache in memory only. Dispatch after R.

T. (Levi 01:59) On-screen gesture controls on the screen sides, replacing the Fly mode joystick (remove joystick + Fly mode toggle). Left edge, vertical cluster: tilt up / tilt down, rotate left / rotate right. Right edge: altitude up / down, move forward / backward, (pan left/right optional). Small translucent glass circular buttons with clear SF-style icons, safe-area aware, never over year readout/slider or info card, press-and-hold with smooth ease-in acceleration and inertia on release, speed scaled to altitude, haptic-free, no text selection, auto-dim after 4 s idle. Dispatch after R, before S.
T+. (Levi 02:01) Luminaries speed control (sun/moon/stars): fold into T. A compact control (in the menu or a small chip near the year readout): Real time (current system clock, real sun/moon positions for now), 1 day per 24 min, 1 day per minute, 1 day per 10 s, Pause. Independent from timeline speed (timeline speed: 1, 10, 100 years/s, chip beside play). Persist in memory only.

## R2 (from 88dd9231, 02:07) - close-up sharpness, run right after -6
- Mobile pixel ratio: PERF.prIdle 1.25 -> min(devicePixelRatio,2.5) idle, 1.5 while moving.
- LOD: pick zoom by screen-space texel density (target <=1.5 screen px per texel) so the foreground gets z18-19 at <500 m altitude; raise PERF.tiles / net for close range.
- Keep the parent tile until the child decodes; no blurry interim at close range.
- Close-range night darkening: at alt <2 km raise the moonlit floor so the city is readable.
- Real buildings remain S (OSM).
- (ad6a0757, 02:09) Draw distance far, far longer: at low altitude terrain ends a few km out in a flat grey-brown band. Stream tiles out to the true horizon / hundreds of km with coarser LOD rings (z18 near, falling to z8-10 far), push camera far plane, thin fog to a light atmospheric haze only at the real horizon, base disc must show terrain relief beyond the tiled area (no flat band).
- (7a5b11bd, 02:11) Auto stutter tilt at close zoom. Cause in the frame loop (~line 2117): the 20 m floor clamps only cp.y and leaves controls.target alone, so each push changes the pitch. ground() also jumps as tiles of different LOD load, so the camera bobs every frame. Fix: (1) when the floor lifts the camera, lift controls.target by the same dy (pitch preserved); (2) low-pass the ground estimate (ease over ~0.3 s, plus a 2 m hysteresis), using the height of the currently drawn tile only; (3) keep the target on the surface by ground(target) eased the same way; (4) zero ivel.t / tilt inertia below a small threshold so it always comes to rest.
- (e010cf02, 02:13) At 3,238 km the view is the 4k Blue Marble base disc (~10 km/px, cloud blotches, saturated painted-blue ocean, halo coast glow) = horrible. Fix: Esri tiles stream at EVERY altitude (screen-space LOD, z3-z7 at continent range), so base disc only shows while tiles load; no clouds baked in; ocean shader must not repaint water flat blue or draw the coastline halo over imagery (keep imagery colour, subtle waves/specular-free only when close).

## T2 (24ae2212, 02:27) - new touch scheme, replaces the current gesture set. Dispatch right after R2.
- Remove orbit zoom (dolly-to-target / double-tap zoom / scroll zoom as zoom); it fights forward/back.
- 1 finger slide down = tilt the earth up (camera pitches toward horizon); slide up = tilt earth down (toward top-down). Vertical drag = tilt only.
- 1 finger slide left/right = truck the earth left/right (lateral camera move, speed scaled to altitude). Horizontal drag = truck only. Lock axis after 18 px by dominant direction.
- 2 finger twist left/right = rotate the earth left/right about ONE axis only: the disc's vertical central axis (circumnavigating the flat earth). Pitch unchanged.
- 2 finger pinch out = move forwards along view direction; pinch in = move backwards. Speed scaled to altitude. Mouse wheel = same.
- Twist vs pinch classifier: keep scoring, lock mode per gesture.
- Max zoom-out clamp: the whole disc model must stay >= 25% of screen size (compute from fov and disc radius R incl. ice ring); camera can't go farther.
- Keep inertia, the 20 m floor, side buttons, compass.

## P (updated 02:31, e76b1a20 + 250e0cd8) - next after T2
- Selected country/polity: full colour + glowing border; everything else desaturated+dimmed. Must work at EVERY altitude and over streamed Esri tiles (apply in tile shader via id map / polity polygons, not only base disc), modern and historical polities.
- Countries and Cities label switches ON by default.

## T3 (f69a5bcf, 02:37) - replace T2 with the Google Earth / Apple Maps standard ("see what others do"). Dispatch after P.
- Key: ground-anchored ("grab the earth"): at gesture start raycast the finger(s) to the ground (tiles/terrain, else y=0 plane); every frame solve the camera so that ground point stays exactly under the finger(s). No velocity-based truck.
- 1 finger drag: pan (anchored). Fling = inertia, decays ~0.9s.
- 2 finger pinch: zoom toward the pinch centroid ground point (point stays under fingers). Restores zoom.
- 2 finger twist: rotate heading about the centroid ground point.
- 2 finger parallel vertical drag: tilt (pitch) about the centroid ground point; up = more oblique, down = top-down.
- Pinch/twist/tilt can combine in one gesture (Google Earth), with tilt gated by parallel-movement test.
- Double-tap: zoom in 2x at tapped point (animated). Two-finger tap: zoom out 2x. One-finger double-tap-and-drag up/down: continuous zoom.
- Desktop: left drag pan, wheel zoom to cursor, right drag / ctrl drag = rotate+tilt.
- Compass tap: heading to north, keep tilt. NEW view reset button (glass, under compass): animate 1.2s to default view (top-down, north/lon0 down, whole disc ~80% screen).
- Keep: max zoom-out clamp disc >=25% screen, 20 m floor with target lifted, side buttons, no text selection.

## V - Historical eclipses + Joshua's long day (Levi, 2026-11-02 02:49)
Model: 1 Enoch 72-79 (Book of Luminaries) - sun and moon ride chariots through the 6 eastern / 6 western gates, circling above the disc below the dome. Eclipse = moon passes between sun and viewer; shadow is a local soft umbra/penumbra spot moving over the disc along the REAL historical path (NASA Five Millennium Canon dates/paths, projected to the azimuthal disc). Sky darkens, corona glow, stars appear for viewers inside the path.
Events (timeline markers, tap to play, year slider jumps):
- Ugarit 5 Mar 1223 BC; Assyrian (Bur-Sagale) 15 Jun 763 BC; Thales/Halys 28 May 585 BC; Crucifixion darkness AD 33 (shown as darkness, note: Passover full moon, not a solar eclipse); 1919 Eddington; 11 Aug 1999 Europe; 21 Aug 2017 USA; 8 Apr 2024 USA. More from canon later.
- Joshua 10:12-14 "sun stood still upon Gibeon, moon in the valley of Ajalon": sun halts above Gibeon, moon over Aijalon, ~a whole day; date: traditional c. 1406 BC (alt: proposed eclipse 30 Oct 1207 BC, mention in card). INCLUDED (Levi said yes): Hezekiah sign - shadow on the stairs of Ahaz goes back 10 steps (2 Kings 20:9-11, Isaiah 38:8), c. 701 BC, Jerusalem; sun visibly moves back along its path.
Cards cite the verse/source. Small separate edit after T3.

## M addendum (Levi 2026-11-02 02:51 "don't forget city lights, wars, bombings, fires")
Great fires: Rome AD 64, London 2-6 Sep 1666, Chicago 8-10 Oct 1871, San Francisco 1906, Tokyo firebombing 9-10 Mar 1945, Hamburg 1943. Priority order after T3: Q, D (city lights), M (wars/bombings/fires/nuclear), V (eclipses), C, L, S.

## X - Camera feel (Levi 2026-11-02 02:59)
Motion blur (velocity-based screen-space, mobile-cheap) + subtle camera micro-jitter/shake scaled by pinch speed and zoom distance (Perlin noise, decays ~0.3 s, off when still; never on idle). Toggle in menu. Goes with E (atmosphere) and F (volumetric clouds you can fly through, haze layers, fog by altitude).

## Y - Overall cinematic look (Levi 03:22)
Film colour grade/LUT, vignette, anamorphic flare + edge CA, golden/blue hour emphasis, god-rays, grain, letterbox for tours. Toggle, mobile fallback. Pair with E/I/X.

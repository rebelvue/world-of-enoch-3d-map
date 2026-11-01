# Edit queue (World of Enoch 3D Map) - Levi approved all, 2026-11-02
A (running): rendering fixes, lighting, sun/moon/stars, ice cliff, Sheol/pillars
B: same photoreal map all years (drop supercontinent/Peleg morph); waters above dome + windows of heaven at Flood; stars only inside dome; 7 prison stars beyond abyss; Google-Earth-style touch controls (1-finger pan, pinch zoom, 2-finger rotate/tilt), joystick optional
C: landmarks rise/fall with timeline, Civ VII oversized, build-up/destruction anims
D: time controls: timeline speed chooser; sky sim speed: 24h cycle, real system time, faster options; city lights switch on progressively at dusk, off progressively at morning; lights by era: none before ~1880 (oil lamps/fires as faint warm dots only in cities before), electric from 1880s in early cities (London, NYC, Paris), spread by region/era through 20th c., full modern by ~1970
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

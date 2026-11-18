/* World of Enoch 3D Map: tile cache (service worker).
   Cache-first for map tiles from Esri World Imagery, Mapterhorn terrain and the self-hosted enoch-tiles (GitHub Pages).
   Cap ~300 MB: when the origin's storage estimate passes the cap, the oldest entries are deleted (Cache keys are kept in
   insertion order; a hit is occasionally re-stored so often-used tiles move to the back: LRU-ish). Everything else goes to the network. */
var CACHE = "woe-tiles-v1", CAP = 300 * 1024 * 1024, HOSTS = ["server.arcgisonline.com", "tiles.mapterhorn.com", "rebelvue.github.io"];
var puts = 0, trimming = false;
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf("woe-tiles-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
function isTile(u) {
  if (HOSTS.indexOf(u.hostname) < 0) return false;
  if (u.hostname === "rebelvue.github.io") return u.pathname.indexOf("/enoch-tiles/") === 0 && u.pathname.indexOf("/tiles.json") < 0;
  if (u.hostname === "server.arcgisonline.com") return u.pathname.indexOf("/tile/") > 0;
  return /\.(webp|png)$/.test(u.pathname);
}
function trim() {
  if (trimming || !self.navigator || !navigator.storage || !navigator.storage.estimate) return;
  trimming = true;
  navigator.storage.estimate().then(function (est) {
    if (!est || est.usage < CAP) return;
    return caches.open(CACHE).then(function (c) {
      return c.keys().then(function (ks) {
        var n = Math.max(50, Math.ceil(ks.length * Math.min(0.5, (est.usage - CAP * 0.85) / est.usage)));
        return Promise.all(ks.slice(0, n).map(function (k) { return c.delete(k); }));
      });
    });
  }).catch(function () {}).then(function () { trimming = false; });
}
self.addEventListener("fetch", function (e) {
  var r = e.request; if (r.method !== "GET") return;
  var u; try { u = new URL(r.url); } catch (x) { return; }
  if (!isTile(u)) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(r).then(function (hit) {
      if (hit) { if (Math.random() < 0.125) c.put(r, hit.clone()).catch(function () {}); return hit; }
      return fetch(r).then(function (res) {
        if (res && res.status === 200 && (res.type === "cors" || res.type === "basic")) {
          c.put(r, res.clone()).then(function () { if (++puts % 40 === 0) trim(); }).catch(function () { trim(); });
        }
        return res;
      });
    });
  }));
});

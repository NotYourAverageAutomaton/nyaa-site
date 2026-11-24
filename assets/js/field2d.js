/* The live site's 2D dot field, unchanged; loaded only when the 3D hero falls back. */

(function(){
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  // ---- receipts settle as they scroll in (they are already correct without this) ----
  var vz = [].slice.call(document.querySelectorAll("[data-reveal]"));
  if (reduce || !("IntersectionObserver" in window)) vz.forEach(function(v){ v.classList.add("in"); });
  else { var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); }, {threshold:.25});
         vz.forEach(function(v){ io.observe(v); }); }

  // ---- the field: scattered dots fall into rank; one becomes the ring ----
  var cv = document.getElementById("field"), cx = cv.getContext && cv.getContext("2d");
  if (!cx){ document.documentElement.classList.remove("js"); vz.forEach(function(v){ v.classList.add("in"); }); return; }
  var W = 0, H = 0, D = 1, pts = [], ring = null, t0 = 0, mx = -9999, my = -9999, live = true;
  // touch: a finger moves the field while down and fades out over 0.6 s; with no finger on a touch-only screen a slow ghost point wanders
  var touchDown = false, relT = 0, gs = 0, hoverNone = !!(window.matchMedia && matchMedia("(hover: none)").matches);
  function build(){
    var r = cv.getBoundingClientRect(); D = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height;
    cv.width = Math.round(W * D); cv.height = Math.round(H * D); cx.setTransform(D, 0, 0, D, 0, 0);
    var pitch = W < 600 ? 30 : 38, cols = Math.ceil(W / pitch) + 1, rows = Math.ceil(H / pitch) + 1, ox = (W - (cols - 1) * pitch) / 2, oy = (H - (rows - 1) * pitch) / 2;
    pts = []; var rc = Math.round(cols * (W < 760 ? .78 : .74)), rr = W < 721 ? 2 : Math.max(3, Math.round(rows * .17));
    for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++){
      var s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453, u = s - Math.floor(s), s2 = Math.sin(i * 269.5 + j * 183.3) * 43758.5453, v = s2 - Math.floor(s2);
      var p = {gx: ox + i * pitch, gy: oy + j * pitch, sx: (u - .5) * W * 1.6 + W / 2, sy: (v - .5) * H * 1.6 + H / 2, d: (u * .55 + (i / cols) * .45), ph: v * 6.283};
      if (i === rc && j === rr) ring = p; pts.push(p);
    }
  }
  function ease(x){ return x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3); }
  function draw(now){
    if (!t0) t0 = now; var t = reduce ? 99 : (now - t0) / 1000;
    cx.clearRect(0, 0, W, H);
    var st = 1, px = mx, py = my;
    if (!touchDown && relT){ st = 1 - (now - relT) / 600; if (st <= 0){ st = 0; relT = 0; } }
    if (hoverNone && !touchDown && !relT){
      if (!gs) gs = now;
      px = W * (.5 + .32 * Math.sin(t * .23)); py = H * (.42 + .22 * Math.sin(t * .31 + 1.3)); st = .85 * Math.min(1, (now - gs) / 800);
    } else gs = 0;
    for (var k = 0; k < pts.length; k++){
      var p = pts[k], a = ease((t - p.d * 1.1) / 1.2), x = p.sx + (p.gx - p.sx) * a, y = p.sy + (p.gy - p.sy) * a;
      var dx = x - px, dy = y - py, dist = Math.sqrt(dx * dx + dy * dy), push = (dist < 130 ? (1 - dist / 130) : 0) * st;
      x += dx / (dist || 1) * push * 16; y += dy / (dist || 1) * push * 16;
      if (p === ring){
        var g = ease((t - 2.0) / .9), rad = 3 + g * 15;
        cx.beginPath(); cx.arc(x, y, rad, 0, 6.283); cx.lineWidth = 1.5 + g * 3; cx.strokeStyle = g > 0 ? "#D19A3A" : "#2C3447"; cx.stroke();
        if (g > 0){ cx.beginPath(); cx.arc(x, y, rad + 16 + (reduce ? 0 : Math.sin(t * 1.4) * 4), 0, 6.283); cx.lineWidth = 1; cx.strokeStyle = "rgba(209,154,58," + (.22 * g) + ")"; cx.stroke(); }
        continue;
      }
      var breathe = reduce ? 0 : Math.sin(t * .9 + p.ph) * .12, fade = 1 - .55 * Math.min(1, y / H);   // dimmer toward the text
      cx.globalAlpha = (.35 + .4 * a + breathe + push * .5) * fade; cx.fillStyle = push > .05 ? "#E8EAEE" : "#6A7388";
      cx.beginPath(); cx.arc(x, y, 2.1 + push * 1.6, 0, 6.283); cx.fill(); cx.globalAlpha = 1;
    }
    if (!reduce && live) requestAnimationFrame(draw);
  }
  addEventListener("resize", function(){ build(); if (reduce) requestAnimationFrame(draw); });
  cv.parentNode.addEventListener("pointermove", function(e){ var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; }, {passive:true});
  cv.parentNode.addEventListener("pointerleave", function(){ if (!touchDown) mx = my = -9999; });
  function touchAt(e){ var tc = e.touches && e.touches[0]; if (!tc) return; var r = cv.getBoundingClientRect(); mx = tc.clientX - r.left; my = tc.clientY - r.top; touchDown = true; relT = 0; }
  cv.parentNode.addEventListener("touchstart", touchAt, {passive:true});
  cv.parentNode.addEventListener("touchmove", touchAt, {passive:true});
  function touchUp(){ if (touchDown){ touchDown = false; relT = performance.now(); } }
  cv.parentNode.addEventListener("touchend", touchUp, {passive:true});
  cv.parentNode.addEventListener("touchcancel", touchUp, {passive:true});
  if ("IntersectionObserver" in window && !reduce) new IntersectionObserver(function(es){ var on = es[0].isIntersecting; if (on && !live){ live = true; requestAnimationFrame(draw); } else live = on; }).observe(cv);
  build(); requestAnimationFrame(draw);
})();

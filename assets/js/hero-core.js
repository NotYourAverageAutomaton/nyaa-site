/* NYAA page hero core (presentation only). One renderer, sizing, scroll progress, watchdogs and the 2D fallback,
   shared by every page; each page adds one scene file that calls NYAAHero.scene(build).
   build(THREE, api) runs once with a ready scene and camera and returns {frame: function(t, p, mx, my){...}} where
   t = seconds since start, p = scroll progress 0..1 through the hero (window.__hero.p from motion.js),
   mx, my = pointer offset -0.5..0.5 (mouse only, 0 on touch). api = {scene, camera, renderer, colors, size:{w,h}}.
   A scene draws ideas from its page, never a number or claim that is not in the page text.
   Falls back to the live 2D field (/assets/js/field2d.js) without THREE or WebGL, under reduced motion, with no scene
   registered within 1.5 s, at zero size after retries, on context loss, if a frame throws, or if no frame arrives.
   html[data-hero] names the path running: 3d:running:WxH:raf|timer, or 2d:<reason>. */
/* v4.12 (Niz 20:1x: "not scaled and aligned properly"): the drawing has a box on the grid, set by CSS (grid.css): on a
   wide screen (over 980px) columns 8-12 of the container, top line = the title block's top, a 3:2 box. The canvas no
   longer moves and no geometry is computed here (v4.11 moved it into #heroPin and measured the words around it).
   On a tablet (641-980px) it is a band of its own under the words, the container's width (v4.11 drew it behind
   the title there). Phones (640px and under) are unchanged. __placeHero() only reports the mode (html[data-place] =
   "grid" or "band"; absent on phones and on J-Lens's own phone/tablet band) and returns true when it changed.
   FIT, SETTLE THEN HOLD (kept from v4.11, now scaling and centring instead of pushing right): the scene is drawn in its
   box, then the rendered pixels say where the drawing really is, and one zoom + shift fits it inside the box with a
   7% margin, centred, never clipped. A renderer calls f=__heroFit() once, then f.after(gl,now,W,H,placed) right
   after each render; it returns {x,y,z}: the view shift in px (x right, y down) and the camera zoom to apply.
   From 2 s after the first frame it reads the frame's pixels 8 times, 0.6 s apart. Each reading finds the drawing's
   box: the columns and rows holding its visible colour (premultiplied RGB over 28), trimmed by 1.5% of the bright
   pixels on each side so drifting dust does not count. The union of the 8 boxes is the drawing. If it touches the
   canvas edge (it is clipped, so its true size is unknown), the zoom steps down by 0.75 and it reads again (up to 3
   times). Then zoom = the largest that fits the union in 86% of the box (at most 1.6x), and the shift centres it.
   Then it is FIXED: pixels are not read again until the box size changes. It eases in once. __heroFit.settled /
   .zoom / .shift report it. Unplaced (phones): {0,0,1}. */
(function(){
var D=document.documentElement,last=null;
function place(){var nw=D.classList.contains("narrow"),m=nw?"":innerWidth>980?"grid":innerWidth>640?"band":"";if(m)D.setAttribute("data-place",m);else D.removeAttribute("data-place");
 var ch=m!==last;last=m;return ch;}
window.__placeHero=place;
window.__heroFit=function(){var F=window.__heroFit,st;
 function reset(W,H,z){st={W:W,H:H,z:z,rd:[],next:0,steps:0,done:false,buf:null,t:{x:0,y:0,z:z},cur:st?st.cur:{x:0,y:0,z:1}};F.settled=false;}
 function measure(gl){var w=gl.drawingBufferWidth,h=gl.drawingBufferHeight;if(!w||!h)return null;var n=w*h*4;if(!st.buf||st.buf.length!==n)st.buf=new Uint8Array(n);
  try{gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,st.buf);}catch(e){return null;}
  var b=st.buf,cx=new Uint32Array(w),cy=new Uint32Array(h),tot=0,x,y;
  for(y=0;y<h;y+=2)for(x=0;x<w;x+=2){var q=(y*w+x)*4;if(Math.max(b[q],b[q+1],b[q+2])>28){cx[x]++;cy[h-1-y]++;tot++;}}
  if(tot<12)return null;
  function cut(a,len){var k=tot*.015,s=0,lo=0,hi=len-1;while(lo<len&&(s+=a[lo])<=k)lo++;s=0;while(hi>0&&(s+=a[hi])<=k)hi--;return [lo,hi+1];}
  var X=cut(cx,w),Y=cut(cy,h),kx=st.W/w,ky=st.H/h;return {l:X[0]*kx,r:X[1]*kx,t:Y[0]*ky,b:Y[1]*ky};}
 F.settled=false;F.zoom=1;F.shift=0;
 return {after:function(gl,now,W,H,placed){
  if(!placed||!gl||!W||!H){F.settled=true;F.zoom=1;F.shift=0;return {x:0,y:0,z:1};}
  if(!st||W!==st.W||H!==st.H)reset(W,H,1);
  if(!st.born)st.born=now;
  if(!st.done&&now>=st.next&&now-st.born>=2000){st.next=now+600;
   /* read only a frame drawn at the zoom being tested, with no shift */
   if(st.cur.z===st.z&&!st.cur.x&&!st.cur.y){var m=measure(gl);if(m)st.rd.push(m);}
   if(st.rd.length>=8){var u={l:1e9,r:-1e9,t:1e9,b:-1e9};st.rd.forEach(function(m){u.l=Math.min(u.l,m.l);u.r=Math.max(u.r,m.r);u.t=Math.min(u.t,m.t);u.b=Math.max(u.b,m.b);});
    var e=2,clip=u.l<=e||u.t<=e||u.r>=W-e||u.b>=H-e;
    if(clip&&st.steps<3){st.steps++;st.z*=.75;st.rd=[];st.t={x:0,y:0,z:st.z};}
    else{/* u was measured at zoom st.z about the canvas centre: scale it back to zoom 1, then fit */
     var cx=W/2,cy=H/2,bw=(u.r-u.l)/st.z,bh=(u.b-u.t)/st.z,mx=((u.l+u.r)/2-cx)/st.z,my=((u.t+u.b)/2-cy)/st.z;
     var z=Math.min(.86*W/Math.max(bw,1),.86*H/Math.max(bh,1),1.6);st.t={x:-mx*z,y:-my*z,z:z};st.done=true;st.buf=null;}}}
  var c=st.cur,t=st.t,k=st.done?.08:1;
  c.x+=(t.x-c.x)*k;c.y+=(t.y-c.y)*k;c.z+=(t.z-c.z)*k;
  if(Math.abs(t.x-c.x)<.3&&Math.abs(t.y-c.y)<.3&&Math.abs(t.z-c.z)<.002){c.x=t.x;c.y=t.y;c.z=t.z;}
  F.zoom=c.z;F.shift=c.x;F.shiftY=c.y;F.settled=st.done&&c.x===t.x&&c.y===t.y&&c.z===t.z;
  return {x:c.x,y:c.y,z:c.z};}};};
addEventListener("resize",place,{passive:true});
place();
})();
(function(){
var D=document.documentElement,cv=document.getElementById("hero3d")||document.getElementById("beam3d"),host=cv&&(document.querySelector("#heroPin>.hero")||cv.parentElement),fell=false,build=null;
function why(t){D.setAttribute("data-hero",t);}
function fall(t){if(fell)return;fell=true;why("2d:"+t);D.classList.remove("has3d");if(cv)cv.style.display="none";
 /* Niz 19:09: the fallback is the soft full-bleed CSS dot field behind every hero (motion.css), not the hard ranked grid */}
window.NYAAHero={scene:function(b){if(!build&&!fell){build=b;start();}}};
if(!cv){return;}
if(!window.THREE){fall("nothree");return;}
if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches){fall("motion-off");return;}
setTimeout(function(){if(!build)fall("noscene");},1500);
function start(){
 var R;try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:"low-power"});}catch(e){fall("nowebgl");return;}
 D.classList.add("has3d");why("3d:starting");if(window.__placeHero)window.__placeHero();
 var css=getComputedStyle(D),col=function(n,d){return new THREE.Color((css.getPropertyValue(n)||d).trim()||d);};
 var api={scene:new THREE.Scene(),camera:new THREE.PerspectiveCamera(42,1,.1,500),renderer:R,size:{w:0,h:0},
  colors:{text:col("--text","#E8EAEE"),muted:col("--muted","#A0A7B6"),line:col("--hairline","#2C3447"),panel:col("--panel","#1A2131"),
          brass:col("--brass","#D19A3A"),cyan:col("--cyan","#3FF0FF"),magenta:col("--magenta","#FF4FD8")}};
 var tries=0,mx=0,my=0,t0=0,frames=0,lostAt=0,lastRaf=0,rafOk=false,sc;
 /* v4.12: the drawing fitted into its grid box (__heroFit, above); base = the scene's own view offset after its layout */
 var fit=window.__heroFit?window.__heroFit():null,base={x:0,y:0},fv={x:0,y:0,z:1},gl=R.getContext();
 function view(){var c=api.camera,W=api.size.w,H=api.size.h;if(!W||!H)return;c.zoom=fv.z;if(fv.x||fv.y||base.x||base.y)c.setViewOffset(W,H,base.x-fv.x,base.y-fv.y,W,H);else{if(c.view&&c.view.enabled)c.clearViewOffset();c.updateProjectionMatrix();}}
 function size(){api.placed=!!document.documentElement.getAttribute("data-place"); /* v4.12: the canvas is its own box (grid or band) */var r=(api.placed?cv:host).getBoundingClientRect(),W=Math.round(r.width),H=Math.round(r.height);
  if(W<20||H<20){if(tries++<12)setTimeout(size,250);else fall("nosize");return false;}
  R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));R.setSize(W,H,false);api.camera.aspect=W/H;api.camera.updateProjectionMatrix();api.size.w=W;api.size.h=H;
  if(sc&&sc.resize)sc.resize(W,H);var v=api.camera.view;base=v&&v.enabled?{x:v.offsetX,y:v.offsetY}:{x:0,y:0};view();return true;}
 try{sc=build(THREE,api);}catch(e){fall("scene-error");return;}
 if(!sc||typeof sc.frame!=="function"){fall("scene-error");return;}
 addEventListener("resize",size,{passive:true});window.__heroResized=size;
 addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;mx=e.clientX/(innerWidth||1)-.5;my=e.clientY/(innerHeight||1)-.5;},{passive:true});
 cv.addEventListener("webglcontextlost",function(e){e.preventDefault();lostAt=performance.now();setTimeout(function(){if(lostAt)fall("ctxlost");},1500);});
 cv.addEventListener("webglcontextrestored",function(){lostAt=0;size();});
 function frame(now){if(fell)return;if(!t0)t0=now;var p=((window.__hero||window.__jscroll)||{}).p||0; /* v4 pages set __hero, v10 pages __jscroll */
  try{sc.frame((now-t0)/1000,p,mx,my);R.render(api.scene,api.camera);
   if(fit){var f=fit.after(gl,now,api.size.w,api.size.h,api.placed);if(f.x!==fv.x||f.y!==fv.y||f.z!==fv.z){fv=f;view();}}}catch(e){fall("frame-error");return;}frames++;}
 function viaRaf(now){lastRaf=performance.now();rafOk=true;frame(now);requestAnimationFrame(viaRaf);}
 if(!size())return;requestAnimationFrame(viaRaf);
 setInterval(function(){if(fell||document.hidden)return;if(performance.now()-lastRaf>120)frame(performance.now());},33);
 setTimeout(function(){if(!fell&&!frames&&!lostAt)fall("noframe");},2500);
 setTimeout(function(){if(!fell&&frames)why("3d:running:"+api.size.w+"x"+api.size.h+":"+(rafOk?"raf":"timer"));},3000);}
})();

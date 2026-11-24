/* NYAA page hero core (presentation only). One renderer, sizing, scroll progress, watchdogs and the 2D fallback,
   shared by every page; each page adds one scene file that calls NYAAHero.scene(build).
   build(THREE, api) runs once with a ready scene and camera and returns {frame: function(t, p, mx, my){...}} where
   t = seconds since start, p = scroll progress 0..1 through the hero (window.__hero.p from motion.js),
   mx, my = pointer offset -0.5..0.5 (mouse only, 0 on touch). api = {scene, camera, renderer, colors, size:{w,h}}.
   A scene draws ideas from its page, never a number or claim that is not in the page text.
   Falls back to the live 2D field (/assets/js/field2d.js) without THREE or WebGL, under reduced motion, with no scene
   registered within 1.5 s, at zero size after retries, on context loss, if a frame throws, or if no frame arrives.
   html[data-hero] names the path running: 3d:running:WxH:raf|timer, or 2d:<reason>. */
(function(){
var D=document.documentElement,cv=document.getElementById("hero3d")||document.getElementById("beam3d"),host=cv&&cv.parentElement,fell=false,build=null;
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
 D.classList.add("has3d");why("3d:starting");
 var css=getComputedStyle(D),col=function(n,d){return new THREE.Color((css.getPropertyValue(n)||d).trim()||d);};
 var api={scene:new THREE.Scene(),camera:new THREE.PerspectiveCamera(42,1,.1,500),renderer:R,size:{w:0,h:0},
  colors:{text:col("--text","#E8EAEE"),muted:col("--muted","#A0A7B6"),line:col("--hairline","#2C3447"),panel:col("--panel","#1A2131"),
          brass:col("--brass","#D19A3A"),cyan:col("--cyan","#3FF0FF"),magenta:col("--magenta","#FF4FD8")}};
 var tries=0,mx=0,my=0,t0=0,frames=0,lostAt=0,lastRaf=0,rafOk=false,sc;
 function size(){var r=host.getBoundingClientRect(),W=Math.round(r.width),H=Math.round(r.height);
  if(W<20||H<20){if(tries++<12)setTimeout(size,250);else fall("nosize");return false;}
  R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));R.setSize(W,H,false);api.camera.aspect=W/H;api.camera.updateProjectionMatrix();api.size.w=W;api.size.h=H;
  if(sc&&sc.resize)sc.resize(W,H);return true;}
 try{sc=build(THREE,api);}catch(e){fall("scene-error");return;}
 if(!sc||typeof sc.frame!=="function"){fall("scene-error");return;}
 addEventListener("resize",size,{passive:true});
 addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;mx=e.clientX/(innerWidth||1)-.5;my=e.clientY/(innerHeight||1)-.5;},{passive:true});
 cv.addEventListener("webglcontextlost",function(e){e.preventDefault();lostAt=performance.now();setTimeout(function(){if(lostAt)fall("ctxlost");},1500);});
 cv.addEventListener("webglcontextrestored",function(){lostAt=0;size();});
 function frame(now){if(fell)return;if(!t0)t0=now;var p=((window.__hero||window.__jscroll)||{}).p||0; /* v4 pages set __hero, v10 pages __jscroll */
  try{sc.frame((now-t0)/1000,p,mx,my);R.render(api.scene,api.camera);}catch(e){fall("frame-error");return;}frames++;}
 function viaRaf(now){lastRaf=performance.now();rafOk=true;frame(now);requestAnimationFrame(viaRaf);}
 if(!size())return;requestAnimationFrame(viaRaf);
 setInterval(function(){if(fell||document.hidden)return;if(performance.now()-lastRaf>120)frame(performance.now());},33);
 setTimeout(function(){if(!fell&&!frames&&!lostAt)fall("noframe");},2500);
 setTimeout(function(){if(!fell&&frames)why("3d:running:"+api.size.w+"x"+api.size.h+":"+(rafOk?"raf":"timer"));},3000);}
})();

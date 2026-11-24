/* NYAA soft dot field (presentation only), behind every hero. Niz 19:09: full-bleed, soft edges, gentle drift.
   Niz 20:52: "We lost the spreading effect in the dots when you mouse over them": dots near the pointer push outward,
   brighten and grow, as the live site's field did; a touch drag spreads them too. Pointer events are taken from the
   hero itself, so the 3D canvas and the text above never block them. Under reduced motion: drawn once, still.
   With 3D running on the home page, the 3D scene's own dots carry the spread and this layer hides (motion.css). */
(function(){
var heroes=[].slice.call(document.querySelectorAll(".hero2"));if(!heroes.length)return;
var reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
var css=getComputedStyle(document.documentElement),hex=(css.getPropertyValue("--muted")||"#A0A7B6").trim(),hexT=(css.getPropertyValue("--text")||"#E8EAEE").trim();
function rgb(h){h=h.replace("#","");if(h.length===3)h=h.split("").map(function(c){return c+c;}).join("");var n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255];}
var C0=rgb(hex),C1=rgb(hexT),PITCH=34,R=130,PUSH=22;
heroes.forEach(function(hero){
 var cv=document.createElement("canvas");cv.className="softfield";cv.setAttribute("aria-hidden","true");hero.insertBefore(cv,hero.firstChild);hero.classList.add("has-soft");
 var cx=cv.getContext&&cv.getContext("2d");if(!cx){cv.remove();hero.classList.remove("has-soft");return;}
 var W=0,H=0,D=1,px=-9999,py=-9999,str=0,want=0,t0=0,live=false,raf=0;
 function size(){var r=hero.getBoundingClientRect();D=Math.min(2,window.devicePixelRatio||1);W=r.width;H=r.height;cv.width=Math.round(W*D);cv.height=Math.round(H*D);cx.setTransform(D,0,0,D,0,0);draw(performance.now());}
 function at(e){var r=hero.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top;want=1;kick();}
 hero.addEventListener("pointermove",at,{passive:true});hero.addEventListener("pointerdown",at,{passive:true});
 hero.addEventListener("touchmove",function(e){if(e.touches&&e.touches[0])at(e.touches[0]);},{passive:true});
 hero.addEventListener("pointerleave",function(){want=0;kick();},{passive:true});
 hero.addEventListener("touchend",function(){want=0;kick();},{passive:true});
 function draw(now){if(!t0)t0=now;var t=reduce?0:(now-t0)/1000;cx.clearRect(0,0,W,H);
  str+=(want-str)*(reduce?1:.12);if(str<.002)str=0;
  var ox=(t*.5)%PITCH,oy=(t*1)%PITCH,cxm=W*.55,cym=H*.45,ex=W*.75,ey=H*.8;
  for(var y=-PITCH+oy;y<H+PITCH;y+=PITCH)for(var x=-PITCH+ox;x<W+PITCH;x+=PITCH){
   var nx=(x-cxm)/ex,ny=(y-cym)/ey,edge=1-Math.min(1,Math.max(0,(Math.sqrt(nx*nx+ny*ny)-.3)/.7));if(edge<=0)continue;
   var dx=x-px,dy=y-py,d=Math.sqrt(dx*dx+dy*dy),k=0,X=x,Y=y;
   if(str>0&&d<R){k=(1-d/R);k=k*k*str;if(d>.01){X+=dx/d*PUSH*k;Y+=dy/d*PUSH*k;}}
   var a=(.30+.6*k)*edge,rr=1.3+1.4*k,c0=Math.round(C0[0]+(C1[0]-C0[0])*k),c1=Math.round(C0[1]+(C1[1]-C0[1])*k),c2=Math.round(C0[2]+(C1[2]-C0[2])*k);
   cx.fillStyle="rgba("+c0+","+c1+","+c2+","+a.toFixed(3)+")";cx.beginPath();cx.arc(X,Y,rr,0,6.2832);cx.fill();}}
 function loop(now){raf=0;if(!live||document.hidden)return;draw(now);if(!reduce)raf=requestAnimationFrame(loop);}
 function kick(){if(reduce){draw(performance.now());return;}if(live&&!raf)raf=requestAnimationFrame(loop);}
 if("IntersectionObserver" in window)new IntersectionObserver(function(es){live=es[0].isIntersecting;kick();}).observe(hero);else{live=true;kick();}
 document.addEventListener("visibilitychange",kick);
 if(window.ResizeObserver)new ResizeObserver(size).observe(hero);else addEventListener("resize",size);
 size();
});
})();

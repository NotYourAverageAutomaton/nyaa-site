/* NYAA stage, from Claude's J-Lens v10 kit stage.js 558d8bb6 with only its <script> wrapper removed so it loads as a file. */
/* ===== NYAA stage v1: scroll-driven tile exchange. Self-contained, no dependencies; reuse as is.
   Markup:  <ol data-stage [data-stage-step="0.75"]> <li data-tile>...</li> ... </ol>   (any elements; tiles are direct children)
   When motion is allowed and the tallest tile fits the screen, it wraps the stage in
     .stage-track (its height sets the scroll length)  >  .stage-frame (position:sticky, centred)  >  [data-stage].stage-on + .stage-meter
   stacks the tiles in one grid cell, and maps scroll progress through the track onto them: the current tile swoops out
   with depth (alternating left / right), the next drops in from above with a small overshoot. Each tile rests a moment
   before the next exchange. Scrolling back reverses it exactly: progress comes from the scroll position, never a timer.
   Each tile carries data-tile-state = on | in | out | off for styling.
   Reduced motion, no requestAnimationFrame, or a screen too short for the tallest tile: nothing changes; tiles keep their
   normal layout. All tiles stay in the accessibility tree; focus inside a hidden tile scrolls the stage to it.
   data-stage-step: viewport heights of scroll per exchange (default 0.75). Transform and opacity only; one rAF per frame. */
(function(){
if(!window.requestAnimationFrame||(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches))return;
var cl=function(x){return x<0?0:x>1?1:x;},ease=function(t){return t*t*(3-2*t);},back=function(t){var a=1.5;return 1+(a+1)*Math.pow(t-1,3)+a*Math.pow(t-1,2);};
var all=[].slice.call(document.querySelectorAll("[data-stage]")).map(function(el){
 var tiles=[].slice.call(el.children).filter(function(c){return c.hasAttribute("data-tile");});if(tiles.length<2)return null;
 var track=document.createElement("div"),frame=document.createElement("div"),meter=document.createElement("div");
 track.className="stage-track";frame.className="stage-frame";meter.className="stage-meter";meter.setAttribute("aria-hidden","true");
 meter.innerHTML="<span></span><i><b></b></i>";el.parentNode.insertBefore(track,el);track.appendChild(frame);frame.appendChild(el);frame.appendChild(meter);
 var S={el:el,tiles:tiles,track:track,frame:frame,count:meter.firstChild,bar:meter.querySelector("b"),on:false,s:0,len:0,top:0,lab:""};
 tiles.forEach(function(t,i){t.addEventListener("focusin",function(){if(!S.on)return;var y=track.getBoundingClientRect().top+(window.scrollY||0)+S.len*(i/(tiles.length-1))-S.top+1;window.scrollTo(0,y);});});
 return S;}).filter(Boolean);
if(!all.length)return;
function clear(S){S.tiles.forEach(function(t){t.style.transform="";t.style.opacity="";t.removeAttribute("data-tile-state");});}
function layout(){var vh=window.innerHeight||800;all.forEach(function(S){clear(S);S.el.classList.add("stage-on");S.track.style.height="";
 var fh=S.frame.offsetHeight;if(fh+32>vh){S.el.classList.remove("stage-on");S.track.classList.remove("stage-live");S.frame.style.top="";S.on=false;return;}
 var step=parseFloat(S.el.getAttribute("data-stage-step"))||.75;S.len=Math.round((S.tiles.length-1)*step*vh);S.top=Math.max(16,Math.round((vh-fh)/2));
 S.track.style.height=(fh+S.len)+"px";S.track.classList.add("stage-live");S.frame.style.top=S.top+"px";S.on=true;S.s=goal(S);render(S);});queue();}
function goal(S){var r=S.track.getBoundingClientRect();return cl((S.top-r.top)/Math.max(1,S.len))*(S.tiles.length-1);}
function render(S){var n=S.tiles.length,g=Math.floor(S.s),pos=Math.min(n-1,g+ease(cl((S.s-g-.18)/.64)));
 for(var i=0;i<n;i++){var t=S.tiles[i],d=i-pos,st,tf="",op=1;
  if(d>=1||d<=-1){st="off";op=0;tf=d>0?"translate3d(0,-140px,90px) rotateX(-24deg)":"translate3d("+(i%2?62:-62)+"%,60px,-320px) rotateY("+(i%2?-38:38)+"deg) rotate("+(i%2?7:-7)+"deg)";}
  else if(d>.001){var k=cl((.999-d-.3)/.7);st="in";op=cl(k*1.6);/* lands after the outgoing tile has mostly left */tf="translate3d(0,"+(-140*(1-back(k))).toFixed(1)+"px,"+(90*(1-k)).toFixed(1)+"px) rotateX("+(-24*(1-k)).toFixed(2)+"deg)";}
  else if(d<-.001){var q=cl(-d*1.45),s=i%2?1:-1;st="out";op=cl(1-q*1.15);tf="translate3d("+(s*62*q).toFixed(1)+"%,"+(60*q*q).toFixed(1)+"px,"+(-320*q).toFixed(1)+"px) rotateY("+(-s*38*q).toFixed(2)+"deg) rotate("+(s*7*q).toFixed(2)+"deg)";}
  else st="on";
  t.style.transform=tf;t.style.opacity=op===1?"":op.toFixed(3);if(t.getAttribute("data-tile-state")!==st)t.setAttribute("data-tile-state",st);}
 var lab=("0"+(Math.round(pos)+1)).slice(-2)+" / "+("0"+n).slice(-2);if(lab!==S.lab){S.lab=lab;S.count.textContent=lab;}S.bar.style.transform="scaleX("+(pos/(n-1)).toFixed(4)+")";}
var ticking=false;function queue(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
function update(){ticking=false;if(document.hidden)return;var more=false,vh=window.innerHeight||800;all.forEach(function(S){if(!S.on)return;var r=S.track.getBoundingClientRect(),G=goal(S);
 if(r.bottom<-vh*.5||r.top>vh*1.5){if(S.s!==G){S.s=G;render(S);}return;}
 S.s+=(G-S.s)*.2;if(Math.abs(G-S.s)<.002)S.s=G;else more=true;render(S);});if(more)queue();}
addEventListener("scroll",queue,{passive:true});document.addEventListener("scroll",queue,{passive:true,capture:true});
var rt=0;addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(layout,120);},{passive:true});document.addEventListener("visibilitychange",queue);
layout();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);
})();

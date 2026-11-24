/* NYAA site motion (presentation only), after J-Lens v10's motion language. Scroll drives the hero (window.__hero.p),
   tiles tilt toward the pointer and enter by their place in the row, headings sit at depth, numbers count up to their
   exact original text. Stage tiles ([data-tile]) belong to the stage module. Off entirely under reduced motion. */
(function(){
var D=document.documentElement;window.__hero={p:0,e:0};
if((window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)||!("IntersectionObserver" in window)||!window.requestAnimationFrame)return;
D.classList.add("mo");
var $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s));},cl=function(x){return x<0?0:x>1?1:x;};
var pin=document.getElementById("heroPin"),hero=pin&&pin.querySelector(".hero2"),bar=document.querySelector(".bar2");
var fine=!!(window.matchMedia&&matchMedia("(hover:hover) and (pointer:fine)").matches);
/* 1. hero pin: wide screens with 3D running hold the hero still while the scroll flies the camera in */
var prog=document.createElement("span");prog.className="hero-prog";prog.setAttribute("aria-hidden","true");prog.appendChild(document.createElement("i"));if(hero)hero.appendChild(prog);
var pinD=0,pinned=false,top0=function(){return bar?bar.offsetHeight:0;};
/* Niz 19:09: the pin added hundreds of px of empty space under the hero on the first screen. No pin: the scene is
   still scroll-driven while the hero scrolls away. */
function wantPin(){return false&&!!(hero&&pin)&&D.classList.contains("has3d")&&innerWidth>980&&innerHeight>=560&&hero.offsetHeight<=innerHeight;}
function layoutPin(){var w=wantPin();if(w!==pinned){pinned=w;D.classList.toggle("pinned",w);}
 if(pinned){pinD=Math.round(Math.min(900,Math.max(480,innerHeight*.9)));pin.style.height=(hero.offsetHeight+pinD)+"px";hero.style.top=top0()+"px";}
 else if(pin){pin.style.height="";if(hero)hero.style.top="";}queue();}
if(window.MutationObserver)new MutationObserver(function(){if(D.classList.contains("has3d")!==layoutPin.h){layoutPin.h=D.classList.contains("has3d");layoutPin();}}).observe(D,{attributes:true,attributeFilter:["class"]});
/* 2. entrances: text rises first, tiles after it; left column swoops from the left, right from the right, middle drops, lone tiles rise */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("vin");io.unobserve(e.target);}});},{rootMargin:"0px 0px 8% 0px"});
/* Niz 19:09: anything already on the first screen (or just below it) shows at rest; only what is further down enters */
var seen=function(el){var r=el.getBoundingClientRect();return r.top<(innerHeight||800)*1.08;};
var _obs=io.observe.bind(io);io.observe=function(el){if(seen(el)){el.classList.add("vin");return;}_obs(el);};
function sib(el){var i=0,x=el;while((x=x.previousElementSibling))i++;return i;}
function kind(el){var p=el.parentElement,cs=getComputedStyle(p),cols=cs.display==="grid"?cs.gridTemplateColumns.split(" ").length:1;
 if(cols<2)return "rise";var r=el.getBoundingClientRect(),pr=p.getBoundingClientRect(),c=(r.left+r.width/2-pr.left)/Math.max(1,pr.width);return c<.34?"swoop-l":c>.66?"swoop-r":"drop";}
$$("main .sec,main .block,main.labs").forEach(function(s){$$(".kicker,.h2,.read>*,.more2,:scope>h2.lab,:scope>.say,:scope>h3.lab,:scope>.fig,:scope>pre",s).forEach(function(el,i){el.classList.add("rvt");el.style.setProperty("--d",Math.min(i,4)*70+"ms");io.observe(el);});
 $$(".tile:not([data-tile]),.rules2>li,.timeline>li,.cites>li,.card:not([data-tile])",s).forEach(function(el){el.setAttribute("data-enter",kind(el));el.classList.add("rvc");el.style.setProperty("--d",(80+Math.min(sib(el),5)*90)+"ms");io.observe(el);});});
$$(".footcols .wrap>div").forEach(function(el,i){el.classList.add("rvt");el.style.setProperty("--d",i*80+"ms");io.observe(el);});
/* the hero keeps the live site's own entrance (site.css); hiding it again here would blank the first frame */
/* 3. tilt toward the pointer with a light sheen; mouse and pen only */
if(fine)$$(".tile:not([data-tile]),.rules2>li,.timeline>li,.cites>li,.card:not([data-tile])").forEach(function(el){var sh=document.createElement("span");sh.className="sheen";sh.setAttribute("aria-hidden","true");el.appendChild(sh);el.classList.add("tilt");
 var raf=0,mx=.5,my=.5,inside=false,ok=function(e){return e.pointerType==="mouse"||e.pointerType==="pen";};
 function apply(){raf=0;if(!inside)return;var r=el.getBoundingClientRect();if(!r.width)return;var A=Math.max(1.2,Math.min(7,2100/Math.max(r.width,r.height)));
  el.style.transform="perspective(1000px) rotateX("+((.5-my)*A).toFixed(2)+"deg) rotateY("+((mx-.5)*A).toFixed(2)+"deg) translate3d(0,-4px,0)";sh.style.setProperty("--mx",(mx*100).toFixed(1)+"%");sh.style.setProperty("--my",(my*100).toFixed(1)+"%");}
 el.addEventListener("pointermove",function(e){if(!ok(e))return;var r=el.getBoundingClientRect();mx=cl((e.clientX-r.left)/r.width);my=cl((e.clientY-r.top)/r.height);if(!inside){inside=true;el.classList.add("hot");}if(!raf)raf=requestAnimationFrame(apply);},{passive:true});
 el.addEventListener("pointerleave",function(){inside=false;if(raf){cancelAnimationFrame(raf);raf=0;}el.classList.remove("hot");el.style.transform="";});});
/* 4. numbers count up to their exact original text; anything that is not one plain number is left alone; a timer always restores the true text */
var nums=$$(".num b").map(function(b){var t=b.textContent,m=/^(\D*?)(\d+)(\.\d+)?(\D*)$/.exec(t);if(!m)return null;var f=parseFloat(m[2]+(m[3]||""));if(!(f>0))return null;return {b:b,t:t,pre:m[1],suf:m[4],f:f,dec:m[3]?m[3].length-1:0};}).filter(Boolean);
function done(n){if(n.end)return;n.end=1;n.b.textContent=n.t;n.b.style.minWidth="";}
function count(n){var b=n.b,w=b.getBoundingClientRect().width,dur=900+Math.min(700,n.f*12),wait=260,t0=0;b.style.minWidth=Math.ceil(w)+"px";b.textContent=n.pre+(0).toFixed(n.dec)+n.suf;
 function f(ts){if(n.end)return;if(!t0)t0=ts;var k=cl((ts-t0)/dur),e=1-Math.pow(1-k,4);if(k<1){b.textContent=n.pre+(n.f*e).toFixed(n.dec)+n.suf;requestAnimationFrame(f);}else done(n);}
 setTimeout(function(){requestAnimationFrame(f);},wait);setTimeout(function(){done(n);},wait+dur+400);}
var nio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){nio.unobserve(e.target);count(e.target.__n);}});},{rootMargin:"0px 0px 12% 0px"});
nums.forEach(function(n){n.b.__n=n;nio.observe(n.b);});
/* 5. one scroll frame: hero progress, heading depth */
var secs=$$("main .sec"),vis=[],vio=new IntersectionObserver(function(es){es.forEach(function(e){var i=vis.indexOf(e.target);if(e.isIntersecting&&i<0)vis.push(e.target);else if(!e.isIntersecting&&i>=0)vis.splice(i,1);});queue();},{rootMargin:"15% 0px 15% 0px"});
secs.forEach(function(s){s.__hd=[s.querySelector(".kicker"),s.querySelector(".h2")];vio.observe(s);});
var ticking=false;function queue(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
function update(){ticking=false;if(document.hidden)return;var vh=innerHeight||800,p=0,i;
 if(pin){var top=pin.getBoundingClientRect().top-top0(),hh=hero.offsetHeight;p=pinned?cl(-top/pinD):cl(-top/Math.max(1,hh*.85));}
 window.__hero.p=p;prog.firstChild.style.transform="scaleX("+p.toFixed(4)+")";
 for(i=0;i<vis.length;i++){var b=vis[i].getBoundingClientRect(),y=Math.max(-1,Math.min(1,(b.top+Math.min(b.height,vh)/2-vh/2)/vh)),hd=vis[i].__hd;
  if(hd[0])hd[0].style.translate="0 "+(y*26).toFixed(1)+"px";if(hd[1])hd[1].style.translate="0 "+(y*14).toFixed(1)+"px";}}
addEventListener("scroll",queue,{passive:true});addEventListener("resize",layoutPin,{passive:true});document.addEventListener("visibilitychange",queue);
layoutPin.h=D.classList.contains("has3d");layoutPin();
})();

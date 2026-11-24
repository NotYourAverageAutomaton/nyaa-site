/* J-Lens v10 motion (fe670a2f), byte-identical below this line, loaded as a file by the v10-level pages. */
/* v10 motion (presentation only). Scroll drives the hero scene, tiles tilt toward the pointer and lift in with depth,
   section layers reveal at different depths, numbers count up to their exact original text.
   Off entirely under prefers-reduced-motion: the page stays as written, numbers final, nothing scroll-linked. */
(function(){
var D=document.documentElement;window.__jscroll={p:0,e:0};
var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
if(rm||!("IntersectionObserver" in window)||!window.requestAnimationFrame)return;
D.classList.add("mo");
var $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s));},cl=function(x){return x<0?0:x>1?1:x;};
var hero=document.querySelector(".hero"),pin=document.getElementById("heroPin"),img=hero&&hero.querySelector("img"),hin=hero&&hero.querySelector(".hero-in");
var fine=!!(window.matchMedia&&matchMedia("(hover:hover) and (pointer:fine)").matches);
/* 1. hero pin: on a wide screen with 3D running, the hero holds still while the scroll sends the beam through the drops */
var prog=document.createElement("span");prog.className="hero-prog";prog.setAttribute("aria-hidden","true");prog.appendChild(document.createElement("i"));if(hero)hero.appendChild(prog);var progI=prog.firstChild;
var PIN_TOP=12,pinD=0,pinned=false;
function wantPin(){return !!(hero&&pin&&hin)&&D.classList.contains("has3d")&&!D.classList.contains("narrow")&&innerWidth>980&&innerHeight>=560&&hin.offsetHeight+110<=innerHeight;}
function layoutPin(){var w=wantPin();if(w!==pinned){pinned=w;D.classList.toggle("pinned",w);}
 if(pinned){pinD=Math.round(Math.min(900,Math.max(480,innerHeight*.9)));var h=(hero.offsetHeight+pinD)+"px";if(pin.style.height!==h)pin.style.height=h;}else if(pin&&pin.style.height)pin.style.height="";queue();}
if(window.MutationObserver)new MutationObserver(function(){var h=D.classList.contains("has3d"),n=D.classList.contains("narrow");if(h!==layoutPin.h||n!==layoutPin.n){layoutPin.h=h;layoutPin.n=n;layoutPin();}}).observe(D,{attributes:true,attributeFilter:["class"]});
if(window.ResizeObserver&&hero)new ResizeObserver(function(){layoutPin();}).observe(hero);
/* 2. layers: text rises first, tiles lift in after it, staggered by their place in the row */
var TEXT=":scope>.over,:scope>h2,:scope>.lede-l,:scope>.cap,:scope>.further,:scope>details.more";
var TILE=".card,.step,.rule,.paper,.find,.ups>li,.vcol>h3";
var secs=$$("main section"),io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("vin");io.unobserve(e.target);}});},{rootMargin:"0px 0px -7% 0px"});
function sib(el){var i=0,x=el;while((x=x.previousElementSibling))i++;return i;}
/* each tile enters by its place: left column swoops from the left, right column from the right, middle ones drop,
   lone cards rise; the update list swoops in. data-enter carries the choice to the CSS. Stage tiles ([data-tile]) are the stage's. */
function kind(el){if(el.matches(".ups>li"))return "swoop-l";var p=el.parentElement,cs=getComputedStyle(p),cols=1;
 if(cs.display==="grid")cols=cs.gridTemplateColumns.split(" ").length;else if(cs.display==="flex"&&cs.flexWrap!=="nowrap")cols=2;
 if(cols<2)return el.matches(".card")?"rise":"drop";var r=el.getBoundingClientRect(),pr=p.getBoundingClientRect(),c=(r.left+r.width/2-pr.left)/Math.max(1,pr.width);
 if(r.top-pr.top>8&&cs.display==="flex")return "drop";return c<.34?"swoop-l":c>.66?"swoop-r":"drop";}
var plan=[];secs.forEach(function(s){$$(TEXT,s).forEach(function(el,i){el.classList.add("rvt");el.style.setProperty("--d",Math.min(i,4)*70+"ms");io.observe(el);});
 $$(TILE,s).forEach(function(el){if(el.hasAttribute("data-tile"))return;plan.push([el,kind(el)]);});});
plan.forEach(function(x){var el=x[0];el.setAttribute("data-enter",x[1]);el.classList.add("rvc");el.style.setProperty("--d",(80+Math.min(sib(el),5)*90)+"ms");io.observe(el);});
if(hin){[".tag.st","h1",".q"].forEach(function(q,i){var el=hin.querySelector(":scope>"+q);if(el){el.classList.add("rvt");el.style.setProperty("--d",(60+i*110)+"ms");io.observe(el);}});
 $$(".stats>div",hin).forEach(function(el,i){el.classList.add("rvc");el.setAttribute("data-enter","drop");el.style.setProperty("--d",(380+i*80)+"ms");io.observe(el);});}
/* 3. tilt toward the pointer, with a light sheen; mouse and pen only, never on touch */
if(fine){$$(".stats>div,.step,.rule,.paper,.find,.card").forEach(function(el){if(el.querySelector(".ctable")||el.hasAttribute("data-tile"))return;
 var sh=document.createElement("span");sh.className="sheen";sh.setAttribute("aria-hidden","true");el.appendChild(sh);el.classList.add("tilt");
 var raf=0,mx=.5,my=.5,inside=false,ok=function(e){return e.pointerType==="mouse"||e.pointerType==="pen";};
 function apply(){raf=0;if(!inside)return;var r=el.getBoundingClientRect();if(!r.width)return;var A=Math.max(1.2,Math.min(7,2100/Math.max(r.width,r.height)));
  el.style.transform="perspective(1000px) rotateX("+((.5-my)*A).toFixed(2)+"deg) rotateY("+((mx-.5)*A).toFixed(2)+"deg) translate3d(0,-4px,0)";
  sh.style.setProperty("--mx",(mx*100).toFixed(1)+"%");sh.style.setProperty("--my",(my*100).toFixed(1)+"%");}
 el.addEventListener("pointermove",function(e){if(!ok(e))return;var r=el.getBoundingClientRect();mx=cl((e.clientX-r.left)/r.width);my=cl((e.clientY-r.top)/r.height);if(!inside){inside=true;el.classList.add("hot");}if(!raf)raf=requestAnimationFrame(apply);},{passive:true});
 el.addEventListener("pointerleave",function(){inside=false;if(raf){cancelAnimationFrame(raf);raf=0;}el.classList.remove("hot");el.style.transform="";});});}
/* 4. numbers count up to their exact original text (a date or anything with two numbers in it is left alone).
   The true text stays in the page until a number is just below the screen; a timer always restores it, even if frames stop. */
var nums=$$(".stats b,.fchip b").map(function(b){var t=b.textContent,m=/^(\D*?)(\d+)(\.\d+)?(\D*)$/.exec(t);if(!m)return null;var f=parseFloat(m[2]+(m[3]||""));if(!(f>0))return null;return {b:b,t:t,pre:m[1],suf:m[4],f:f,dec:m[3]?m[3].length-1:0};}).filter(Boolean);
function done(n){if(n.end)return;n.end=1;n.b.textContent=n.t;n.b.style.minWidth="";n.b.style.display="";n.b.classList.remove("cu");}
function count(n){var b=n.b,w=b.getBoundingClientRect().width,dur=900+Math.min(700,n.f*12),wait=hero&&hero.contains(b)?650:260,t0=0;
 b.classList.add("cu");if(getComputedStyle(b).display==="inline")b.style.display="inline-block";b.style.minWidth=Math.ceil(w)+"px";b.textContent=n.pre+(0).toFixed(n.dec)+n.suf;
 function f(ts){if(n.end)return;if(!t0)t0=ts;var k=cl((ts-t0)/dur),e=1-Math.pow(1-k,4);if(k<1){b.textContent=n.pre+(n.f*e).toFixed(n.dec)+n.suf;requestAnimationFrame(f);}else done(n);}
 setTimeout(function(){requestAnimationFrame(f);},wait);setTimeout(function(){done(n);},wait+dur+400);}
var nio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){nio.unobserve(e.target);count(e.target.__n);}});},{rootMargin:"0px 0px 12% 0px"});
nums.forEach(function(n){n.b.__n=n;nio.observe(n.b);});
/* 5. one scroll frame: hero progress and parallax, heading depth in the sections on screen */
var vis=[],vio=new IntersectionObserver(function(es){es.forEach(function(e){var i=vis.indexOf(e.target);if(e.isIntersecting&&i<0)vis.push(e.target);else if(!e.isIntersecting&&i>=0)vis.splice(i,1);});queue();},{rootMargin:"15% 0px 15% 0px"});
secs.forEach(function(s){s.__hd=[s.querySelector(":scope>.over"),s.querySelector(":scope>h2")];vio.observe(s);});
var ticking=false;function queue(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
function update(){ticking=false;if(document.hidden)return;var vh=innerHeight||800,p=0,e=0,hh=0,i,s;
 if(hero){if(pinned){var top=pin.getBoundingClientRect().top;hh=hero.offsetHeight;p=cl((PIN_TOP-top)/pinD);e=cl((PIN_TOP-top-pinD)/Math.max(1,hh));}
  else{/* not pinned (phone, short screens): the beam crosses while the scene itself rises to the top of the screen */
   var pr=pin.getBoundingClientRect(),gone=pin.offsetTop-pr.top,cv=document.getElementById("beam3d"),cr=cv&&cv.getBoundingClientRect();hh=hero.offsetHeight;e=cl(gone/Math.max(1,hh*.85));
   p=cr&&cr.height>0?cl(gone/Math.max(1,pin.offsetTop+(cr.top-pr.top)+cr.height*.6)):e;}}
 var q=[];for(i=0;i<vis.length;i++){var b=vis[i].getBoundingClientRect();q.push((b.top+Math.min(b.height,vh)/2-vh/2)/vh);}
 window.__jscroll.p=p;window.__jscroll.e=e;
 progI.style.transform="scaleX("+p.toFixed(4)+")";
 if(img)img.style.transform="translate3d(0,"+(e*hh*.3).toFixed(1)+"px,0) scale("+(1.06+p*.08).toFixed(4)+")";
 /* the phone band (and its masked canvas) lives inside .hero-in: moving it there left ghost text in the canvas under software compositing */
 if(hin)hin.style.translate=e>0&&!D.classList.contains("narrow")?"0 "+(-e*70).toFixed(1)+"px":"";
 for(i=0;i<vis.length;i++){var hd=vis[i].__hd,y=Math.max(-1,Math.min(1,q[i]));if(hd[0])hd[0].style.translate="0 "+(y*26).toFixed(1)+"px";if(hd[1])hd[1].style.translate="0 "+(y*14).toFixed(1)+"px";}}
addEventListener("scroll",queue,{passive:true});document.addEventListener("scroll",queue,{passive:true,capture:true});addEventListener("resize",layoutPin,{passive:true});document.addEventListener("visibilitychange",queue);
layoutPin.h=D.classList.contains("has3d");layoutPin.n=D.classList.contains("narrow");layoutPin();
})();

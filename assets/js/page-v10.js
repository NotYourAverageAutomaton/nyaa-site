/* v10-level pages: the side rail follows the section on screen, sections slide in as they arrive (content is visible
   at rest), and a link to an update opens it. From J-Lens v10's page script, without its J-Lens beam band. */
(function(){
var root=document.documentElement;root.classList.add("js");
var links=[].slice.call(document.querySelectorAll(".rail a")),secs=links.map(function(a){return document.querySelector(a.getAttribute("href"));});
if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var i=secs.indexOf(e.target);links.forEach(function(a,j){a.classList.toggle("on",i===j);});}});},{rootMargin:"-25% 0px -65% 0px"});secs.forEach(function(s){if(s)io.observe(s);});}
var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var els=[].slice.call(document.querySelectorAll("[data-rv]"));
if(rm||!("IntersectionObserver" in window)){els.forEach(function(e){e.classList.add("in");});}
else{var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");ro.unobserve(e.target);}});},{rootMargin:"0px 0px 8% 0px"});
 els.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<(innerHeight||800)*1.08)e.classList.add("in");else ro.observe(e);});}
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a");if(!a)return;var h=a.getAttribute("href")||"";
 if(h.indexOf("#u-")===0){var li=document.querySelector(h);if(li){var d=li.querySelector("details");if(d)d.open=true;}}});
})();

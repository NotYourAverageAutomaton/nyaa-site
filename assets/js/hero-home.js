/* NYAA home hero in 3D (presentation only). The live site's story, in depth: scattered dots fall into rank and one
   becomes the brass ring of the mark. Scroll flies the camera into the grid toward the ring; scrolling back reverses it.
   No numbers, no claims. Falls back to the live 2D field (/assets/js/field2d.js) without WebGL, under reduced motion,
   at zero size after retries, on context loss, or if frames stop. html[data-hero] says which path is running. */
(function(){
var D=document.documentElement,cv=document.getElementById("hero3d"),host=cv&&cv.parentElement;
function why(t){D.setAttribute("data-hero",t);}
var fell=false;function fall(t){if(fell)return;fell=true;why("2d:"+t);D.classList.remove("has3d");if(cv)cv.style.display="none";
 /* Niz 19:09: the fallback is the soft full-bleed CSS dot field behind every hero (motion.css), not the hard ranked grid */}
if(!cv||!window.THREE){fall("nothree");return;}
if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches){fall("motion-off");return;}
var R;try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:"low-power"});}catch(e){fall("nowebgl");return;}
D.classList.add("has3d");why("3d:starting");
var css=getComputedStyle(D),col=function(n,d){return new THREE.Color((css.getPropertyValue(n)||d).trim()||d);};
var C_DOT=col("--muted","#A0A7B6"),C_BRASS=col("--brass","#D19A3A"),C_DIM=col("--hairline","#2C3447");
var S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(42,1,.1,400);
/* Niz 19:09: the field must be full-bleed and soft, not a boxed grid. So the grid is far wider than the view (its
   edges always off-screen), tilted into depth at rest, and fogged into the page colour with distance. */
S.fog=new THREE.Fog(col("--ground","#121722"),12,44);
var COLS=71,ROWS=41,P=1.0,N=COLS*ROWS,ox=-(COLS-1)*P/2,oy=-(ROWS-1)*P/2,RC=Math.floor(COLS/2)+7,RR=Math.floor(ROWS/2)-3;
function hash(i,j,k){var s=Math.sin(i*127.1+j*311.7+k*74.7)*43758.5453;return s-Math.floor(s);}
var rank=new Float32Array(N*3),scat=new Float32Array(N*3),pos=new Float32Array(N*3),dly=new Float32Array(N),ringI=-1,n=0;
for(var j=0;j<ROWS;j++)for(var i=0;i<COLS;i++){var gx=ox+i*P,gy=-(oy+j*P);
 rank[n*3]=gx;rank[n*3+1]=gy;rank[n*3+2]=0;
 scat[n*3]=(hash(i,j,1)-.5)*COLS*1.5;scat[n*3+1]=(hash(i,j,2)-.5)*ROWS*2.2;scat[n*3+2]=(hash(i,j,3)-.5)*60-12;
 dly[n]=hash(i,j,4)*.55+(i/COLS)*.45;if(i===RC&&j===RR)ringI=n;n++;}
var tex=(function(){var c=document.createElement("canvas");c.width=c.height=64;var x=c.getContext("2d");x.fillStyle="#fff";x.beginPath();x.arc(32,32,26,0,Math.PI*2);x.fill();var t=new THREE.CanvasTexture(c);return t;})();
var G=new THREE.BufferGeometry();G.setAttribute("position",new THREE.BufferAttribute(pos,3));
/* Niz 20:52: the dots spread from the pointer. Per-vertex colour lets a dot near the pointer brighten. */
var vcol=new Float32Array(N*3);G.setAttribute("color",new THREE.BufferAttribute(vcol,3));
var C_HOT=col("--text","#E8EAEE");
var M=new THREE.PointsMaterial({size:.22,map:tex,transparent:true,alphaTest:.4,color:0xffffff,vertexColors:true,sizeAttenuation:true,depthWrite:false,fog:true});
var pts=new THREE.Points(G,M);var grid=new THREE.Group();grid.add(pts);S.add(grid);
/* the ring and its halo are larger so the 3D reads (Niz: "only the small ring right of AVERAGE") */
var ring=new THREE.Mesh(new THREE.TorusGeometry(.62,.12,20,72),new THREE.MeshBasicMaterial({color:C_BRASS,fog:false}));ring.visible=false;grid.add(ring);
var halo=new THREE.Mesh(new THREE.RingGeometry(.95,1.0,72),new THREE.MeshBasicMaterial({color:C_BRASS,transparent:true,opacity:0,fog:false,side:THREE.DoubleSide}));grid.add(halo);
var ease=function(x){return x<0?0:x>1?1:1-Math.pow(1-x,3);},cl=function(x){return x<0?0:x>1?1:x;},lerp=function(a,b,k){return a+(b-a)*k;};
var W=0,H=0,mx=0,my=0,t0=0,last=0,frames=0,lostAt=0,tries=0;
function size(){var r=host.getBoundingClientRect();W=Math.round(r.width);H=Math.round(r.height);
 if(W<20||H<20){if(tries++<12){setTimeout(size,250);}else fall("nosize");return false;}
 R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));R.setSize(W,H,false);cam.aspect=W/H;
 cam.fov=W<700?58:42;cam.updateProjectionMatrix();return true;}
addEventListener("resize",function(){size();},{passive:true});
addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;mx=e.clientX/(innerWidth||1)-.5;my=e.clientY/(innerHeight||1)-.5;},{passive:true});
/* the spread: pointer position in canvas px, taken from the hero (mouse, pen and touch; a drag spreads too) */
var ppx=-9999,ppy=-9999,pwant=0,pstr=0,SPREAD_R=130,hostEl=host.closest?host.closest(".hero2")||host:host;
function pat(e){var r=cv.getBoundingClientRect();ppx=e.clientX-r.left;ppy=e.clientY-r.top;pwant=1;}
hostEl.addEventListener("pointermove",pat,{passive:true});hostEl.addEventListener("pointerdown",pat,{passive:true});
hostEl.addEventListener("touchmove",function(e){if(e.touches&&e.touches[0])pat(e.touches[0]);},{passive:true});
hostEl.addEventListener("pointerleave",function(){pwant=0;},{passive:true});hostEl.addEventListener("touchend",function(){pwant=0;},{passive:true});
var _v=new THREE.Vector3();
cv.addEventListener("webglcontextlost",function(e){e.preventDefault();lostAt=performance.now();setTimeout(function(){if(lostAt)fall("ctxlost");},1500);});
cv.addEventListener("webglcontextrestored",function(){lostAt=0;size();});
var ringP=new THREE.Vector3(rank[ringI*3],rank[ringI*3+1],0);
function frame(now){if(fell)return;if(!t0)t0=now;var t=(now-t0)/1000,sp=(window.__hero&&window.__hero.p)||0;frames++;last=now;
 /* 1. fall into rank (time) */
 for(var k=0;k<N;k++){var a=ease((t-.25-dly[k]*1.6)/1.1),k3=k*3;
  /* at rest the ranked field breathes: a slow wave in depth, so it reads as a surface in space, not a flat print */
  var wv=Math.sin(t*.55+rank[k3]*.32+rank[k3+1]*.21)*.22*a;
  pos[k3]=lerp(scat[k3],rank[k3],a);pos[k3+1]=lerp(scat[k3+1],rank[k3+1],a);pos[k3+2]=lerp(scat[k3+2],rank[k3+2],a)+wv;
  if(k===ringI&&a>=1){pos[k3+2]=-999;}}
 G.attributes.position.needsUpdate=true;
 var ra=ease((t-2.6)/.8);ring.visible=ra>0;ring.position.set(ringP.x,ringP.y,0);ring.scale.setScalar(.6+.4*ra);ring.rotation.z=t*.4;
 halo.position.copy(ring.position);halo.material.opacity=ra*(.25+.2*Math.sin(t*2));halo.scale.setScalar(1+.15*Math.sin(t*2));
 /* 2. scroll: the grid tilts into depth and the camera flies toward the ring */
 var e=ease(sp),tilt=lerp(-.55,-1.1,e);grid.rotation.x=tilt+my*.06;grid.rotation.y=mx*.12+lerp(-.12,-.3,e);
 grid.position.x=Math.sin(t*.05)*.6;   /* gentle drift */
 var dist=lerp(W<700?22:16,4.2,e);cam.position.set(lerp(0,ringP.x*.9,e)+mx*.8,lerp(0,ringP.y*.6+1.6,e)-my*.5,dist);
 cam.lookAt(lerp(0,ringP.x,e),lerp(0,ringP.y*.4,e),0);
 /* 3. the spread (Niz 20:52): project each dot to the screen; within 130px of the pointer it is pushed outward and
    brightens. Colour per vertex: the scroll dim as before, lifted toward the text colour near the pointer. */
 pstr+=(pwant-pstr)*.12;if(pstr<.002)pstr=0;
 cam.updateMatrixWorld();grid.updateMatrixWorld();
 var br=C_DOT.r+(C_DIM.r-C_DOT.r)*e*.55,bg=C_DOT.g+(C_DIM.g-C_DOT.g)*e*.55,bb=C_DOT.b+(C_DIM.b-C_DOT.b)*e*.55;
 for(var q=0;q<N;q++){var q3=q*3,kq=0;
  if(pstr>0){_v.set(pos[q3],pos[q3+1],pos[q3+2]).applyMatrix4(grid.matrixWorld).project(cam);
   var sx=(_v.x*.5+.5)*W-ppx,sy=(-_v.y*.5+.5)*H-ppy,dq=Math.sqrt(sx*sx+sy*sy);
   if(_v.z<1&&dq<SPREAD_R){kq=1-dq/SPREAD_R;kq=kq*kq*pstr;if(dq>.01){pos[q3]+=sx/dq*.7*kq;pos[q3+1]-=sy/dq*.7*kq;}}}
  vcol[q3]=br+(C_HOT.r-br)*kq;vcol[q3+1]=bg+(C_HOT.g-bg)*kq;vcol[q3+2]=bb+(C_HOT.b-bb)*kq;}
 G.attributes.position.needsUpdate=true;G.attributes.color.needsUpdate=true;
 R.render(S,cam);}
var rafOk=false,lastRaf=0;function viaRaf(now){lastRaf=performance.now();rafOk=true;frame(now);requestAnimationFrame(viaRaf);}
if(!size())return;requestAnimationFrame(viaRaf);
setInterval(function(){if(fell||document.hidden)return;if(performance.now()-lastRaf>120)frame(performance.now());},33);
setTimeout(function(){if(!fell&&!frames&&!lostAt)fall("noframe");},2500);
setTimeout(function(){if(!fell&&frames)why("3d:running:"+W+"x"+H+":"+(rafOk?"raf":"timer"));},3000);
})();

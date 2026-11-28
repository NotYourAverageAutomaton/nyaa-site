/* Notebook hero (presentation only). The lab notebook: blank pages laid one on the next, oldest at the back; each new page
   slides in on top and a brass margin line draws down it, the day's entry made. Scroll lifts the camera over the stack.
   Pages are blank: no dates, no words, no numbers. */
NYAAHero.scene(function(THREE, api){
var S=api.scene,cam=api.camera,C=api.colors;
var cl=function(x){return x<0?0:x>1?1:x;},ease=function(x){x=cl(x);return 1-Math.pow(1-x,3);},
    eio=function(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;},lerp=function(a,b,k){return a+(b-a)*k;};
function hash(i,k){var s=Math.sin(i*127.1+k*311.7)*43758.5453;return s-Math.floor(s);}
var A=1.6,OX=0,OY=0;function setA(w,h){A=(w>0&&h>0)?w/h:1.6;if(!(A>0&&isFinite(A)))A=1.6;cam.fov=A<.9?58:42;OX=A>1.1&&!api.placed?.22:0;OY=A<.9?.2:0;
 if(w>0&&h>0)cam.setViewOffset(w,h,-OX*w,-OY*h,w,h);else cam.clearViewOffset();cam.aspect=A;cam.updateProjectionMatrix();}
function fit(hw,hh){var t=Math.tan(cam.fov*Math.PI/360);return Math.max(hh/t,hw/(t*A));}
var root=new THREE.Group();S.add(root);root.rotation.x=-1.05;
var NP=14,PW=2.2,PH=2.9,pages=[],pg=new THREE.PlaneGeometry(PW,PH),pe=new THREE.EdgesGeometry(pg),lineG=new THREE.PlaneGeometry(PW*.72,.012);
for(var i=0;i<NP;i++){var fm=new THREE.MeshBasicMaterial({color:C.panel,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});
 var em=new THREE.LineBasicMaterial({color:C.muted.clone(),transparent:true,opacity:0});
 var g=new THREE.Group();g.add(new THREE.Mesh(pg,fm));g.add(new THREE.LineSegments(pe,em));
 /* faint rules on each page, and a margin line that draws in (brass) when the page lands */
 var rules=[];for(var r=0;r<9;r++){var rm=new THREE.MeshBasicMaterial({color:C.line.clone(),transparent:true,opacity:0,depthWrite:false});
  var rl=new THREE.Mesh(lineG,rm);rl.position.set(PW*.08,PH*.36-r*PH*.085,.002);g.add(rl);rules.push(rm);}
 var mm=new THREE.MeshBasicMaterial({color:C.brass.clone(),transparent:true,opacity:0,depthWrite:false});
 var margin=new THREE.Mesh(new THREE.PlaneGeometry(.018,PH*.86),mm);margin.position.set(-PW*.34,0,.003);g.add(margin);
 g.position.set((hash(i,1)-.5)*.14,(hash(i,2)-.5)*.14,i*.045);g.rotation.z=(hash(i,3)-.5)*.09;root.add(g);
 pages.push({g:g,fm:fm,em:em,rules:rules,mm:mm,margin:margin,z:i*.045,land:.3+i*.42});}
var Q=1,d0=12,tgt=new THREE.Vector3();
function layout(){setA(api.size.w,api.size.h);Q=A<.9?.75:1;d0=fit(OX?4.2/.52:3.4,OY?3.2/.5:3.2)+1.6;}
layout();
return {resize:function(){layout();},
frame:function(t,p,mx,my){
 var e=eio(p),el=lerp(.32,1.0,e),r=lerp(d0,d0*1.08,e);tgt.set(0,.2,0);
 cam.position.set(mx*.6,Math.sin(el)*r*.55-my*.4+.4,Math.cos(el)*r);cam.lookAt(tgt);
 var cyc=NP*.42+3.5,tt=t%cyc;   /* the stack fills, rests, then begins again */
 for(var i=0;i<NP;i++){var P=pages[i],k=eio((tt-P.land)/.9),lift=(1-k);
  P.g.position.z=P.z+lift*1.4;P.g.position.x=lift*-1.6+(hash(i,1)-.5)*.14;
  var top=(i===NP-1)||(tt<pages[i+1].land);var a=k*(tt>cyc-1.2?cl((cyc-tt)/1.2):1);
  P.fm.opacity=Q*a*.8;P.em.opacity=Q*a*(top?.95:.55);
  for(var r=0;r<P.rules.length;r++)P.rules[r].opacity=Q*a*.22;
  var d=ease((tt-P.land-.7)/.8);P.margin.scale.y=Math.max(.001,d);P.margin.position.y=PH*.43*(1-d);P.mm.opacity=Q*a*(top?.95:.35)*cl(d*3);}
}};
});

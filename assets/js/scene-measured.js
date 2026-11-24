/* Labs hero (presentation only). Three experiments as three separate lanes of particles, cyan, brass and magenta,
   each looping through its own small gate ring that it must pass (the pass mark written before the run). Scroll
   tilts the view to show the three run side by side, in parallel, in depth. No numbers, no words, no results. */
NYAAHero.scene(function(THREE, api){
var S=api.scene,cam=api.camera,C=api.colors;
var cl=function(x){return x<0?0:x>1?1:x;},ease=function(x){x=cl(x);return 1-Math.pow(1-x,3);},
    eio=function(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;},lerp=function(a,b,k){return a+(b-a)*k;};
function hash(i,k){var s=Math.sin(i*127.1+k*311.7)*43758.5453;return s-Math.floor(s);}
/* framing: on wide screens the view is offset so the scene sits right of centre (the text is on the left); on
   narrow screens it sits in the lower part of the hero, under the text. Offsets are fractions of the canvas. */
var A=1.6,OX=0,OY=0;function setA(w,h){A=(w>0&&h>0)?w/h:1.6;if(!(A>0&&isFinite(A)))A=1.6;cam.fov=A<.9?58:42;OX=A>1.1?.22:0;OY=A<.9?.2:0;
 if(w>0&&h>0)cam.setViewOffset(w,h,-OX*w,-OY*h,w,h);else cam.clearViewOffset();cam.aspect=A;cam.updateProjectionMatrix();}
function fit(hw,hh){var t=Math.tan(cam.fov*Math.PI/360);return Math.max(hh/t,hw/(t*A));}
var tex=(function(){var c=document.createElement("canvas");c.width=c.height=64;var x=c.getContext("2d");x.fillStyle="#fff";x.beginPath();x.arc(32,32,26,0,Math.PI*2);x.fill();return new THREE.CanvasTexture(c);})();
var root=new THREE.Group(),rig=new THREE.Group();rig.rotation.order="XYZ";root.add(rig);S.add(root);
var RX=3.1,RY=1.45,PER=170,TAU=Math.PI*2;
var LANES=[{c:C.cyan,z:2.6,y:.25,g:.35,v:.16},{c:C.brass,z:0,y:0,g:2.3,v:.13},{c:C.magenta,z:-2.6,y:-.25,g:4.2,v:.15}];
function onLoop(th,L,out){out.x=Math.cos(th)*RX;out.y=Math.sin(th)*RY+L.y;out.z=L.z;return out;}
LANES.forEach(function(L,li){
 L.pos=new Float32Array(PER*3);L.base=new Float32Array(PER);L.j=new Float32Array(PER*2);
 for(var i=0;i<PER;i++){L.base[i]=((i%9)/9)*TAU+(hash(i,li+1)-.5)*.4+li*.21;L.j[i*2]=(hash(i,li+7)-.5);L.j[i*2+1]=(hash(i,li+13)-.5);}
 var G=new THREE.BufferGeometry();G.setAttribute("position",new THREE.BufferAttribute(L.pos,3));L.G=G;
 L.M=new THREE.PointsMaterial({size:.16,map:tex,transparent:true,alphaTest:.4,color:L.c,sizeAttenuation:true,depthWrite:false,opacity:0});
 rig.add(new THREE.Points(G,L.M));
 /* the track: a faint closed loop in the hairline colour */
 var tp=[];for(var k=0;k<=96;k++){var th=k/96*TAU;tp.push(new THREE.Vector3(Math.cos(th)*RX,Math.sin(th)*RY+L.y,L.z));}
 L.trackM=new THREE.LineBasicMaterial({color:C.line,transparent:true,opacity:0});
 rig.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(tp),L.trackM));
 /* the gate: a small ring set across the lane, facing along it */
 var gp=onLoop(L.g,L,new THREE.Vector3()),tg=new THREE.Vector3(-Math.sin(L.g)*RX,Math.cos(L.g)*RY,0).normalize();
 L.gateM=new THREE.MeshBasicMaterial({color:L.c,transparent:true,opacity:0});
 L.gate=new THREE.Mesh(new THREE.TorusGeometry(.26,.022,8,40),L.gateM);L.gate.position.copy(gp);
 L.gate.lookAt(gp.clone().add(tg));rig.add(L.gate);
 L.haloM=new THREE.MeshBasicMaterial({color:L.c,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});
 L.halo=new THREE.Mesh(new THREE.RingGeometry(.36,.38,40),L.haloM);L.halo.position.copy(gp);L.halo.quaternion.copy(L.gate.quaternion);rig.add(L.halo);});
var Q=1,d0=12,tgt=new THREE.Vector3(),v=new THREE.Vector3();
function layout(){setA(api.size.w,api.size.h);Q=A<.9?.75:1;d0=fit(OX?(RX+.6)/.52:RX+.7,OY?(RY+1.4)/.5:RY+1.4)+2.6;}
layout();
/* angular distance, wrapped to -PI..PI */
function wrap(a){a=(a+Math.PI)%TAU;if(a<0)a+=TAU;return a-Math.PI;}
return {resize:function(){layout();},
frame:function(t,p,mx,my){
 var e=eio(p);
 LANES.forEach(function(L,li){var a=ease((t-.2-li*.35)/1.4),near=0;
  for(var i=0;i<PER;i++){var th=L.base[i]+t*L.v*TAU*.25,dg=Math.abs(wrap(th-L.g));
   /* loose in the lane, funnelled to the centre as it passes the gate */
   var sq=cl(dg/.7),sp=(.08+.3*sq*sq)*(.4+.6*a)+(1-a)*1.6;
   var c=Math.cos(th),s=Math.sin(th),i2=i*2,i3=i*3;
   L.pos[i3]=c*(RX+L.j[i2]*sp);L.pos[i3+1]=s*(RY+L.j[i2]*sp)+L.y;L.pos[i3+2]=L.z+L.j[i2+1]*sp;
   if(dg<.12)near++;}
  L.G.attributes.position.needsUpdate=true;
  L.M.opacity=Q*a;L.trackM.opacity=Q*a*.6;L.gateM.opacity=Q*a*.95;
  var pulse=cl(near/5);L.haloM.opacity=Q*a*(.12+.35*pulse);L.halo.scale.setScalar(1+.25*pulse);});
 /* the lanes turn and tilt (scroll only): nearly front-on they stack into one loop, then show three parallel lanes */
 rig.rotation.set(lerp(.1,.55,e)+my*.05,lerp(-.06,-.95,e)+mx*.1,0);
 var yo=0;tgt.set(0,yo,0);
 cam.position.set(mx*.8,yo+lerp(.3,.9,e)-my*.5,lerp(d0,d0*1.12,e));
 cam.lookAt(tgt);}};
});

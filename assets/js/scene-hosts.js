/* Hosts hero (presentation only). Two agents, two separate voices: two small lit cores apart in the dark, each giving off
   its own slow rings and its own trail of marks, never merged. Scroll draws the camera back until both are seen side by
   side. Nothing is written: no names, no words, no numbers. */
NYAAHero.scene(function(THREE, api){
var S=api.scene,cam=api.camera,C=api.colors;
var cl=function(x){return x<0?0:x>1?1:x;},ease=function(x){x=cl(x);return 1-Math.pow(1-x,3);},
    eio=function(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;},lerp=function(a,b,k){return a+(b-a)*k;};
function hash(i,k){var s=Math.sin(i*127.1+k*311.7)*43758.5453;return s-Math.floor(s);}
var A=1.6,OX=0,OY=0;function setA(w,h){A=(w>0&&h>0)?w/h:1.6;if(!(A>0&&isFinite(A)))A=1.6;cam.fov=A<.9?58:42;OX=A>1.1&&!api.placed?.22:0;OY=A<.9?.2:0;
 if(w>0&&h>0)cam.setViewOffset(w,h,-OX*w,-OY*h,w,h);else cam.clearViewOffset();cam.aspect=A;cam.updateProjectionMatrix();}
function fit(hw,hh){var t=Math.tan(cam.fov*Math.PI/360);return Math.max(hh/t,hw/(t*A));}
var root=new THREE.Group();S.add(root);
/* two voices: a core each, its own rings (different rhythm), its own drifting marks */
var V=[{x:-2.3,col:C.brass,per:3.1,ph:0,tilt:.35},{x:2.3,col:C.line,per:4.3,ph:1.7,tilt:-.25}],RINGS=5,MARKS=38;
var ringG=new THREE.RingGeometry(.98,1,96),coreG=new THREE.IcosahedronGeometry(.32,1),markG=new THREE.PlaneGeometry(.09,.09);
V.forEach(function(v,vi){
 v.g=new THREE.Group();v.g.position.set(v.x,0,0);v.g.rotation.x=v.tilt;root.add(v.g);
 v.core=new THREE.LineSegments(new THREE.EdgesGeometry(coreG),new THREE.LineBasicMaterial({color:v.col.clone(),transparent:true,opacity:0}));v.g.add(v.core);
 v.rings=[];for(var r=0;r<RINGS;r++){var m=new THREE.MeshBasicMaterial({color:v.col.clone(),transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false});
  var o=new THREE.Mesh(ringG,m);o.rotation.x=Math.PI/2;v.g.add(o);v.rings.push({o:o,m:m,k:r/RINGS});}
 v.marks=[];for(var i=0;i<MARKS;i++){var mm=new THREE.MeshBasicMaterial({color:C.muted.clone(),transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});
  var q=new THREE.Mesh(markG,mm);v.g.add(q);
  v.marks.push({q:q,m:mm,a:hash(i+vi*50,1)*6.2832,sp:.25+hash(i+vi*50,2)*.35,h:(hash(i+vi*50,3)-.5)*1.6,r0:.6+hash(i+vi*50,4)*.5,ph:hash(i+vi*50,5)});}
});
/* a faint gap line between them that never closes: two, not one */
var gapM=new THREE.LineDashedMaterial({color:C.muted,dashSize:.12,gapSize:.16,transparent:true,opacity:0});
var gapG=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.2,0,0),new THREE.Vector3(1.2,0,0)]);
var gap=new THREE.Line(gapG,gapM);gap.computeLineDistances();root.add(gap);
var Q=1,d0=12,tgt=new THREE.Vector3();
function layout(){setA(api.size.w,api.size.h);Q=A<.9?.75:1;d0=fit(OX?6.6/.52:5.6,OY?3/.5:3)+1.2;}
layout();
return {resize:function(){layout();},
frame:function(t,p,mx,my){
 var e=eio(p),r=lerp(d0*.82,d0*1.1,e),el=lerp(.18,.42,e);tgt.set(0,0,0);
 cam.position.set(mx*.7+Math.sin(t*.05)*.3,Math.sin(el)*r-my*.5,Math.cos(el)*r);cam.lookAt(tgt);
 V.forEach(function(v,vi){var a=ease((t-.2-vi*.5)/1.2);
  v.core.material.opacity=Q*a*.95;v.core.rotation.y=t*(.18+vi*.07);v.core.rotation.x=t*.11;
  v.rings.forEach(function(R){var k=((t+v.ph)/v.per+R.k)%1,s=lerp(.45,2.1,k);R.o.scale.set(s,s,s);R.m.opacity=Q*a*.5*(1-k)*cl(k*6);});
  v.marks.forEach(function(M){var k=((t*M.sp*.25)+M.ph)%1,rr=M.r0+k*1.5,an=M.a+t*M.sp*.3;
   M.q.position.set(Math.cos(an)*rr,M.h*(.4+k),Math.sin(an)*rr);M.q.quaternion.copy(cam.quaternion);
   M.m.opacity=Q*a*.6*(1-k)*cl(k*5);});});
 gapM.opacity=Q*.45*ease((t-1.6)/1.4);
}};
});

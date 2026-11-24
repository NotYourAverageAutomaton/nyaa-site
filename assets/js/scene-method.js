/* About-us hero (presentation only). A path of dots that forks in two in depth, with one brass lamp at the fork:
   the point where the prediction is written down before the run. The path draws itself in order toward the fork;
   scroll walks the camera along the path up to the lamp. No numbers, no words, no results. */
NYAAHero.scene(function(THREE, api){
var S=api.scene,cam=api.camera,C=api.colors;
var cl=function(x){return x<0?0:x>1?1:x;},ease=function(x){x=cl(x);return 1-Math.pow(1-x,3);},
    eio=function(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;},lerp=function(a,b,k){return a+(b-a)*k;};
function hash(i,k){var s=Math.sin(i*127.1+k*311.7)*43758.5453;return s-Math.floor(s);}
/* framing: on wide screens the view is offset so the scene sits right of centre (the text is on the left); on
   narrow screens it sits in the lower part of the hero, under the text. Offsets are fractions of the canvas. */
var A=1.6,OX=0,OY=0;function setA(w,h){A=(w>0&&h>0)?w/h:1.6;if(!(A>0&&isFinite(A)))A=1.6;cam.fov=A<.9?58:42;OX=A>1.1?.22:0;OY=A<.9?.2:0;
 if(w>0&&h>0)cam.setViewOffset(w,h,-OX*w,-OY*h,w,h);else cam.clearViewOffset();cam.aspect=A;cam.updateProjectionMatrix();}
var dot=(function(){var c=document.createElement("canvas");c.width=c.height=64;var x=c.getContext("2d");x.fillStyle="#fff";x.beginPath();x.arc(32,32,26,0,Math.PI*2);x.fill();return new THREE.CanvasTexture(c);})();
var glow=(function(){var c=document.createElement("canvas");c.width=c.height=128;var x=c.getContext("2d"),g=x.createRadialGradient(64,64,0,64,64,64);
 g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.25,"rgba(255,255,255,.35)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);})();
var root=new THREE.Group();S.add(root);
var LAMP=new THREE.Vector3(0,2.5,-.5);
/* the path, in the order it is walked: the trunk toward the fork, then both branches outward together */
var pts=[],ACROSS=[-.34,0,.34];
function trunk(z){return Math.sin(z*.18)*.5;}
for(var z=10;z>.01;z-=.42)ACROSS.forEach(function(o){pts.push([trunk(z)+o,0,z]);});
for(var s=0;s<=1.0001;s+=1/38)[-1,1].forEach(function(sd){
 var bz=-s*16,bx=sd*(Math.pow(s,1.15)*6.2+Math.sin(s*5+sd)*.3),dx=sd*6.2*1.15*Math.pow(Math.max(s,.02),.15)/16;
 var nx=1/Math.sqrt(1+dx*dx),nz=dx*nx;
 ACROSS.forEach(function(o){pts.push([bx+o*nx,0,bz+o*nz]);});});
var NP=pts.length,pPos=new Float32Array(NP*3),pCol=new Float32Array(NP*3),pBase=[],pWarm=new Float32Array(NP);
var tmp=new THREE.Color();
for(var i=0;i<NP;i++){var q=pts[i];pPos[i*3]=q[0];pPos[i*3+1]=q[1];pPos[i*3+2]=q[2];
 var far=cl((-q[2])/16),d2=(q[0]-LAMP.x)*(q[0]-LAMP.x)+(q[2]-LAMP.z)*(q[2]-LAMP.z);
 pBase.push(C.muted.clone().lerp(C.line,far*.7));pWarm[i]=Math.exp(-d2/10);}
var PG=new THREE.BufferGeometry();PG.setAttribute("position",new THREE.BufferAttribute(pPos,3));PG.setAttribute("color",new THREE.BufferAttribute(pCol,3));
var PM=new THREE.PointsMaterial({size:.15,map:dot,transparent:true,alphaTest:.4,vertexColors:true,sizeAttenuation:true,depthWrite:false});
root.add(new THREE.Points(PG,PM));PG.setDrawRange(0,0);
/* the ground either side: a faint scatter in the hairline colour, kept off the path */
function br(z){return Math.pow(cl(-z/16),1.15)*6.2;}
var fp=[];for(var k=0;fp.length<520*3&&k<4000;k++){var fx=(hash(k,1)-.5)*30,fz=12-hash(k,2)*32,
 dd=fz>0?Math.abs(fx-trunk(fz)):Math.min(Math.abs(fx-br(fz)),Math.abs(fx+br(fz)));
 if(dd<1.1)continue;fp.push(fx,(hash(k,3)-.5)*.1,fz);}
var FG=new THREE.BufferGeometry();FG.setAttribute("position",new THREE.Float32BufferAttribute(fp,3));
var FM=new THREE.PointsMaterial({size:.1,map:dot,transparent:true,alphaTest:.4,color:C.line,sizeAttenuation:true,depthWrite:false,opacity:0});
root.add(new THREE.Points(FG,FM));
/* the lamp post at the fork */
var postM=new THREE.MeshBasicMaterial({color:C.line,transparent:true,opacity:0});
var post=new THREE.Mesh(new THREE.CylinderGeometry(.035,.05,LAMP.y,8),postM);post.position.set(LAMP.x,LAMP.y/2,LAMP.z);root.add(post);
var headM=new THREE.MeshBasicMaterial({color:C.brass,transparent:true,opacity:0});
var head=new THREE.Mesh(new THREE.SphereGeometry(.12,16,12),headM);head.position.copy(LAMP);root.add(head);
var capM=new THREE.MeshBasicMaterial({color:C.line,transparent:true,opacity:0});
var cap=new THREE.Mesh(new THREE.ConeGeometry(.2,.16,12),capM);cap.position.set(LAMP.x,LAMP.y+.2,LAMP.z);root.add(cap);
var haloM=new THREE.SpriteMaterial({map:glow,color:C.brass,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});
var halo=new THREE.Sprite(haloM);halo.position.copy(LAMP);halo.scale.set(2.6,2.6,1);root.add(halo);
var pool=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:C.brass,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
pool.position.set(LAMP.x,.05,LAMP.z);pool.scale.set(5,5,1);root.add(pool);
var Q=1,d0=13.5,tgt=new THREE.Vector3();
function layout(){setA(api.size.w,api.size.h);Q=A<.9?.8:1;d0=OY?15.5:13.5;}
layout();
return {resize:function(){layout();},
frame:function(t,p,mx,my){
 var e=eio(p);
 /* the path draws itself, in order, toward the fork and on down both branches */
 PG.setDrawRange(0,Math.floor(NP*cl((t-.2)/3.2)));
 var lit=ease((t-1.4)/1.2),fl=.88+.12*Math.sin(t*1.7)+.04*Math.sin(t*5.3);
 for(var i=0;i<NP;i++){tmp.copy(pBase[i]).lerp(C.brass,cl(pWarm[i]*lit*fl*.9)).multiplyScalar(Q);pCol[i*3]=tmp.r;pCol[i*3+1]=tmp.g;pCol[i*3+2]=tmp.b;}
 PG.attributes.color.needsUpdate=true;
 FM.opacity=Q*.8*ease((t-.1)/1.5);postM.opacity=capM.opacity=Q*ease((t-.8)/1.0);
 headM.opacity=Q*lit;haloM.opacity=Q*lit*.55*fl;pool.material.opacity=Q*lit*.18*fl;
 /* scroll walks the camera along the trunk up to the lamp, looking on past the fork */
 cam.position.set(trunk(6.2)*.6*e+mx*.7,lerp(OY?2.7:3.9,2.5,e)-my*.4,lerp(d0,6.2,e));
 tgt.set(0,lerp(OY?.4:.5,.9,e),lerp(-2,-7,e));cam.lookAt(tgt);}};
});

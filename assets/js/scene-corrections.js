/* Corrections hero (presentation only). A plotted series, a quiet curve of points; a few sit off it, wrong. One by one each
   wrong point moves to where it belongs, leaving a faint ghost where it was and a brass tick at its new place: the record
   kept, the error shown, the fix made. Scroll eases the camera round the series. No axes, no labels, no numbers. */
NYAAHero.scene(function(THREE, api){
var S=api.scene,cam=api.camera,C=api.colors;
var cl=function(x){return x<0?0:x>1?1:x;},ease=function(x){x=cl(x);return 1-Math.pow(1-x,3);},
    eio=function(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;},lerp=function(a,b,k){return a+(b-a)*k;};
function hash(i,k){var s=Math.sin(i*127.1+k*311.7)*43758.5453;return s-Math.floor(s);}
var A=1.6,OX=0,OY=0;function setA(w,h){A=(w>0&&h>0)?w/h:1.6;if(!(A>0&&isFinite(A)))A=1.6;cam.fov=A<.9?58:42;OX=A>1.1?.22:0;OY=A<.9?.2:0;
 if(w>0&&h>0)cam.setViewOffset(w,h,-OX*w,-OY*h,w,h);else cam.clearViewOffset();cam.aspect=A;cam.updateProjectionMatrix();}
function fit(hw,hh){var t=Math.tan(cam.fov*Math.PI/360);return Math.max(hh/t,hw/(t*A));}
var root=new THREE.Group();S.add(root);
var NPT=34,pts=[],dotG=new THREE.CircleGeometry(.075,20),ringG=new THREE.RingGeometry(.1,.125,24),tickG=new THREE.PlaneGeometry(.025,.32);
function curve(x){return Math.sin(x*.55)*.9+x*.12;}
var WRONG=[5,12,19,27],wi={};WRONG.forEach(function(w,k){wi[w]=k;});
for(var i=0;i<NPT;i++){var x=-4.4+i*(8.8/(NPT-1)),y=curve(x),z=(hash(i,1)-.5)*.3,isW=(i in wi);
 var dm=new THREE.MeshBasicMaterial({color:C.line.clone(),transparent:true,opacity:0,depthWrite:false});
 var dot=new THREE.Mesh(dotG,dm);root.add(dot);var P={dot:dot,dm:dm,x:x,y:y,z:z,at:.1+i*.035,w:isW};
 if(isW){var off=(hash(i,2)>.5?1:-1)*(.9+hash(i,3)*.6);P.wy=y+off;
  P.gm=new THREE.MeshBasicMaterial({color:C.muted.clone(),transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});
  P.ghost=new THREE.Mesh(ringG,P.gm);root.add(P.ghost);
  P.tm=new THREE.MeshBasicMaterial({color:C.brass.clone(),transparent:true,opacity:0,depthWrite:false});
  P.tick=new THREE.Mesh(tickG,P.tm);root.add(P.tick);P.fix=1.9+wi[i]*1.15;}
 pts.push(P);}
/* the curve itself, faint, drawn in under the points */
var cp=[];for(var s=0;s<=120;s++){var xx=-4.4+s*(8.8/120);cp.push(new THREE.Vector3(xx,curve(xx),0));}
var CG=new THREE.BufferGeometry().setFromPoints(cp),CM=new THREE.LineBasicMaterial({color:C.muted,transparent:true,opacity:0});
var crv=new THREE.Line(CG,CM);root.add(crv);CG.setDrawRange(0,0);
var Q=1,d0=12,tgt=new THREE.Vector3();
function layout(){setA(api.size.w,api.size.h);Q=A<.9?.75:1;d0=fit(OX?5.4/.52:4.8,OY?2.6/.5:2.6)+1.2;}
layout();
return {resize:function(){layout();},
frame:function(t,p,mx,my){
 var e=eio(p),az=lerp(-.08,.32,e),r=lerp(d0,d0*1.06,e);tgt.set(0,.3,0);
 cam.position.set(Math.sin(az)*r+mx*.6,.5-my*.45+e*.8,Math.cos(az)*r);cam.lookAt(tgt);
 CG.setDrawRange(0,Math.floor(121*ease((t-.4)/1.6)));CM.opacity=Q*.5;
 for(var i=0;i<NPT;i++){var P=pts[i],a=ease((t-P.at)/.6);P.dot.quaternion.copy(cam.quaternion);
  if(!P.w){P.dot.position.set(P.x,P.y,P.z);P.dm.opacity=Q*a*.85;continue;}
  var k=eio((t-P.fix)/.9),y=lerp(P.wy,P.y,k);P.dot.position.set(P.x,y,P.z);
  P.dm.color.copy(C.muted).lerp(C.line,k);P.dm.opacity=Q*a*.95;
  P.ghost.position.set(P.x,P.wy,P.z);P.ghost.quaternion.copy(cam.quaternion);P.gm.opacity=Q*a*(.25+.35*cl(k*2));
  P.tick.position.set(P.x,P.y,P.z-.01);P.tick.quaternion.copy(cam.quaternion);P.tm.opacity=Q*.9*ease((t-P.fix-.8)/.5);}
}};
});

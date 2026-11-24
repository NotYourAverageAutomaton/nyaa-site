/* Contribute hero (presentation only). Three doorways stand on a hairline floor; a stream of points walks up to each
   and through it, and scroll opens them wider and turns the view along the row. No numbers, no words. */
NYAAHero.scene(function(THREE, api){
var S=api.scene,cam=api.camera,C=api.colors;
var cl=function(x){return x<0?0:x>1?1:x;},ease=function(x){x=cl(x);return 1-Math.pow(1-x,3);},
    eio=function(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;},lerp=function(a,b,k){return a+(b-a)*k;};
var A=1.6,OX=0;function setA(w,h){A=(w>0&&h>0)?w/h:1.6;if(!(A>0&&isFinite(A)))A=1.6;cam.fov=A<.9?58:42;OX=(A>1.1&&w>700)?.22:0;
 if(w>0&&h>0&&OX)cam.setViewOffset(w,h,-OX*w,0,w,h);else cam.clearViewOffset();cam.aspect=A;cam.updateProjectionMatrix();}
var root=new THREE.Group();S.add(root);
/* floor: a hairline grid */
var fl=[],FN=12;for(var i=-FN;i<=FN;i++){fl.push(new THREE.Vector3(i*.35,-1,-FN*.35),new THREE.Vector3(i*.35,-1,FN*.35),new THREE.Vector3(-FN*.35,-1,i*.35),new THREE.Vector3(FN*.35,-1,i*.35));}
var floorM=new THREE.LineBasicMaterial({color:C.line,transparent:true,opacity:0});root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(fl),floorM));
/* three doorways: an arch frame each, cyan, brass, magenta */
var cols=[C.cyan,C.brass,C.magenta],doors=[];
for(var d=0;d<3;d++){var pts=[],w=.55,h=1.5;pts.push(new THREE.Vector3(-w,-1,0),new THREE.Vector3(-w,h-1-w,0));
 for(var k=0;k<=24;k++){var a=Math.PI-k/24*Math.PI;pts.push(new THREE.Vector3(Math.cos(a)*w,h-1-w+Math.sin(a)*w,0));}
 pts.push(new THREE.Vector3(w,-1,0));var m=new THREE.LineBasicMaterial({color:cols[d],transparent:true,opacity:0});
 var g=new THREE.Group(),ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),m);g.add(ln);
 var glowM=new THREE.MeshBasicMaterial({color:cols[d],transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false});
 var shape=new THREE.Shape();shape.moveTo(-w,-1);shape.lineTo(-w,h-1-w);shape.absarc(0,h-1-w,w,Math.PI,0,true);shape.lineTo(w,-1);shape.lineTo(-w,-1);
 var glow=new THREE.Mesh(new THREE.ShapeGeometry(shape,24),glowM);g.add(glow);
 g.position.set((d-1)*1.9,0,0);root.add(g);doors.push({g:g,m:m,gm:glowM});}
/* walkers: points that come from the front, pick a door, and pass through it */
var WN=90,wp=new Float32Array(WN*3),wc=new Float32Array(WN*3),wg=new THREE.BufferGeometry();
wg.setAttribute("position",new THREE.BufferAttribute(wp,3));wg.setAttribute("color",new THREE.BufferAttribute(wc,3));
var wm=new THREE.PointsMaterial({size:.07,vertexColors:true,transparent:true,opacity:0,depthWrite:false});root.add(new THREE.Points(wg,wm));
function hash(i,k){var s=Math.sin(i*127.1+k*311.7)*43758.5453;return s-Math.floor(s);}
var Q=1,d0=7,tgt=new THREE.Vector3(),tc=new THREE.Color();
function layout(){setA(api.size.w,api.size.h);Q=A<.9?.75:1;d0=A<.9?9.5:OX?8:6.6;}
layout();
return {resize:function(){layout();},
frame:function(t,p,mx,my){
 var e=eio(p),ap=ease((t-.2)/1.4);floorM.opacity=Q*ap*.5;
 doors.forEach(function(D,i){var a=ease((t-.4-i*.25)/1.1);D.m.opacity=Q*a;D.gm.opacity=Q*a*lerp(.06,.2,e)*(.8+.2*Math.sin(t*1.4+i));
  D.g.scale.set(lerp(1,1.25,e),lerp(1,1.12,e),1);D.g.rotation.y=lerp(0,(i-1)*-.25,e);});
 for(var n=0;n<WN;n++){var door=n%3,sp=.12+hash(n,1)*.08,u=((t*sp)+hash(n,2))%1,x0=(hash(n,3)-.5)*5,x1=(door-1)*1.9+(hash(n,4)-.5)*.6;
  var z=lerp(3.2,-1.4,u),x=lerp(x0,x1,ease(u*1.4)),y=-.95+Math.abs(Math.sin(u*40+n))*.03;
  wp[n*3]=x;wp[n*3+1]=y;wp[n*3+2]=z;var f=u<.1?u/.1:u>.85?(1-u)/.15:1;tc.copy(C.muted).lerp(cols[door],cl(u*1.6));
  wc[n*3]=tc.r*f;wc[n*3+1]=tc.g*f;wc[n*3+2]=tc.b*f;}
 wg.attributes.position.needsUpdate=true;wg.attributes.color.needsUpdate=true;wm.opacity=Q*ap;
 var ang=lerp(.0,-.45,e)+mx*.15,rad=lerp(d0,d0*.85,e);tgt.set(0,lerp(-.1,-.3,e),lerp(0,-.4,e));
 cam.position.set(Math.sin(ang)*rad,lerp(1.4,2.4,e)-my*.4,Math.cos(ang)*rad+tgt.z);cam.lookAt(tgt);}};
});

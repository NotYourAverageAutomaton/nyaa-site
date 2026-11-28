/* AuDioPrism hero (presentation only). A listener at the centre; the music, a ribbon of points, moves around them on
   an orbit, and scroll eases it into a wider drifting path (spatial motion and stereo width). Three bands ring the
   listener and breathe at their own rates (low, mid, high). No numbers, no words, no claims. */
NYAAHero.scene(function(THREE, api){
var S=api.scene,cam=api.camera,C=api.colors;
var cl=function(x){return x<0?0:x>1?1:x;},ease=function(x){x=cl(x);return 1-Math.pow(1-x,3);},
    eio=function(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;},lerp=function(a,b,k){return a+(b-a)*k;};
var A=1.6,OX=0;function setA(w,h){A=(w>0&&h>0)?w/h:1.6;if(!(A>0&&isFinite(A)))A=1.6;cam.fov=A<.9?58:42;OX=(A>1.1&&w>700&&!api.placed)?.22:0;
 if(w>0&&h>0&&OX)cam.setViewOffset(w,h,-OX*w,0,w,h);else cam.clearViewOffset();cam.aspect=A;cam.updateProjectionMatrix();}
var root=new THREE.Group();S.add(root);
/* the listener: a small sphere with two ear points */
var headM=new THREE.MeshBasicMaterial({color:C.panel.clone(),transparent:true,opacity:0});
var head=new THREE.Mesh(new THREE.SphereGeometry(.32,24,16),headM);root.add(head);
var headE=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(.33,1)),new THREE.LineBasicMaterial({color:C.muted,transparent:true,opacity:0}));root.add(headE);
var earM=new THREE.MeshBasicMaterial({color:C.brass,transparent:true,opacity:0}),ears=[-1,1].map(function(s){var e=new THREE.Mesh(new THREE.SphereGeometry(.05,10,8),earM);e.position.set(s*.34,0,0);root.add(e);return e;});
/* three bands: flat rings at three radii, each breathing at its own rate */
var bands=[[.75,C.cyan,.9],[1.15,C.brass,1.6],[1.6,C.muted,2.7]].map(function(b,i){
 var m=new THREE.LineBasicMaterial({color:b[1],transparent:true,opacity:0}),pts=[];
 for(var k=0;k<=96;k++){var a=k/96*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a),0,Math.sin(a)));}
 var g=new THREE.BufferGeometry().setFromPoints(pts),l=new THREE.Line(g,m);l.scale.setScalar(b[0]);root.add(l);
 return {l:l,m:m,r:b[0],rate:b[2],base:pts.map(function(p){return p.clone();}),g:g,i:i};});
/* the music: a ribbon of points that travels the path; the head of the ribbon is bright, the tail fades */
var RN=140,rp=new Float32Array(RN*3),rc=new Float32Array(RN*3),rg=new THREE.BufferGeometry();
rg.setAttribute("position",new THREE.BufferAttribute(rp,3));rg.setAttribute("color",new THREE.BufferAttribute(rc,3));
var rm=new THREE.PointsMaterial({size:.07,vertexColors:true,transparent:true,opacity:0,depthWrite:false});root.add(new THREE.Points(rg,rm));
var lineM=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0});root.add(new THREE.Line(rg,lineM));
/* a second, fainter ribbon mirrored left/right: the stereo image, which scroll widens */
var mp=new Float32Array(RN*3),mg=new THREE.BufferGeometry();mg.setAttribute("position",new THREE.BufferAttribute(mp,3));
var mm=new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0});root.add(new THREE.Line(mg,mm));
function path(s,w){/* s: time along the path; w: 0 orbit .. 1 drift */
 var a=s*1.3,R=lerp(1.9,2.3,w);
 return [Math.cos(a)*R+Math.sin(s*.7)*.6*w, Math.sin(s*.9)*lerp(.25,.75,w), Math.sin(a)*R*lerp(1,.75,w)+Math.cos(s*.5)*.5*w];}
var Q=1,d0=8,tgt=new THREE.Vector3(),tc=new THREE.Color();
function layout(){setA(api.size.w,api.size.h);Q=A<.9?.75:1;d0=A<.9?7.6:OX?6.4:5.2;}
layout();
return {resize:function(){layout();},
frame:function(t,p,mx,my){
 var e=eio(p),ap=ease((t-.2)/1.4);
 headM.opacity=Q*ap*.6;headE.material.opacity=Q*ap*.7;earM.opacity=Q*ap;
 bands.forEach(function(B){var amp=.06+.05*Math.sin(t*B.rate*.7+B.i),pos=B.g.attributes.position;
  for(var k=0;k<=96;k++){var bp=B.base[k],wob=1+amp*Math.sin(k/96*Math.PI*2*(3+B.i*2)+t*B.rate);pos.setXYZ(k,bp.x*wob,0,bp.z*wob);}
  pos.needsUpdate=true;B.l.rotation.x=lerp(0,.35,e);B.m.opacity=Q*ease((t-.4-B.i*.25)/1.2)*lerp(.75,.45,e);});
 var w=e,head_s=t*.9;
 for(var k=0;k<RN;k++){var s=head_s-k*.035,q=path(s,w),f=1-k/RN;
  rp[k*3]=q[0];rp[k*3+1]=q[1];rp[k*3+2]=q[2];
  tc.copy(C.muted).lerp(C.cyan,Math.pow(f,1.5));if(k<4)tc.lerp(C.brass,.6);rc[k*3]=tc.r*f+.02;rc[k*3+1]=tc.g*f+.02;rc[k*3+2]=tc.b*f+.02;
  var sw=lerp(.15,.9,w);mp[k*3]=-q[0]*sw;mp[k*3+1]=q[1]*.6;mp[k*3+2]=q[2]*sw;}
 rg.attributes.position.needsUpdate=true;rg.attributes.color.needsUpdate=true;mg.attributes.position.needsUpdate=true;
 rm.opacity=Q*ap;lineM.opacity=Q*ap*.6;mm.opacity=Q*ap*lerp(.12,.35,w);
 /* the ears glow toward the side the music is on */
 var side=rp[0]>0?1:-1;ears[side>0?1:0].scale.setScalar(1.6);ears[side>0?0:1].scale.setScalar(1);
 var ang=lerp(.15,-.5,e)+mx*.15,rad=lerp(d0,d0*.85,e);
 tgt.set(0,lerp(0,-.1,e),0);cam.position.set(Math.sin(ang)*rad,lerp(2.7,3.6,e)-my*.4,Math.cos(ang)*rad);cam.lookAt(tgt);}};
});

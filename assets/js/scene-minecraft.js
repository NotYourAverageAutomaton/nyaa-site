/* Minecraft body hero (presentation only). A blocky ground with an eight-waypoint course; a small body steers through
   it while its liquid network pulses above (links that change their own speed). Scroll brings the camera down from the
   network to the body; part way a magenta twist knocks its heading off and it corrects, still steering. No numbers,
   no words, no results. */
NYAAHero.scene(function(THREE, api){
var S=api.scene,cam=api.camera,C=api.colors;
var cl=function(x){return x<0?0:x>1?1:x;},ease=function(x){x=cl(x);return 1-Math.pow(1-x,3);},
    eio=function(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;},lerp=function(a,b,k){return a+(b-a)*k;};
function hash(i,k){var s=Math.sin(i*127.1+k*311.7)*43758.5453;return s-Math.floor(s);}
/* framing: beside the text on wide screens; centred in its own band on phones */
var A=1.6,OX=0;function setA(w,h){A=(w>0&&h>0)?w/h:1.6;if(!(A>0&&isFinite(A)))A=1.6;cam.fov=A<.9?58:42;OX=(A>1.1&&w>700)?.22:0;
 if(w>0&&h>0&&OX)cam.setViewOffset(w,h,-OX*w,0,w,h);else cam.clearViewOffset();cam.aspect=A;cam.updateProjectionMatrix();}
var root=new THREE.Group();S.add(root);
/* ground: a field of flat blocks, hairline edges, a few raised */
var GN=11,GS=.62,tileG=new THREE.BoxGeometry(GS*.96,.14,GS*.96),tileE=new THREE.EdgesGeometry(tileG),tiles=[];
for(var gx=0;gx<GN;gx++)for(var gz=0;gz<GN;gz++){var i=gx*GN+gz,h=hash(i,4)>.9?1:0;
 var em=new THREE.LineBasicMaterial({color:C.line.clone(),transparent:true,opacity:0});
 var fm=new THREE.MeshBasicMaterial({color:C.panel.clone(),transparent:true,opacity:0,depthWrite:false});
 var g=new THREE.Group();g.add(new THREE.Mesh(tileG,fm));g.add(new THREE.LineSegments(tileE,em));
 g.position.set((gx-(GN-1)/2)*GS,-1.2+h*.14,(gz-(GN-1)/2)*GS);root.add(g);
 tiles.push({g:g,em:em,fm:fm,at:.1+hash(i,5)*.9,d:Math.hypot(gx-(GN-1)/2,gz-(GN-1)/2)});}
/* the course: eight waypoints on a closed loop, brass rings on short posts */
var WP=[],ringG=new THREE.TorusGeometry(.17,.018,8,32),wps=[];
for(var w=0;w<8;w++){var an=w/8*Math.PI*2,rr=2.1+(hash(w,6)-.5)*.7;WP.push(new THREE.Vector3(Math.cos(an)*rr,-1.02,Math.sin(an)*rr*.8));
 var rm=new THREE.MeshBasicMaterial({color:C.brass,transparent:true,opacity:0});var ring=new THREE.Mesh(ringG,rm);
 ring.position.copy(WP[w]).add(new THREE.Vector3(0,.32,0));root.add(ring);wps.push({m:ring,rm:rm});}
var curve=new THREE.CatmullRomCurve3(WP,true,"catmullrom",.5);
var trailN=60,trailP=new Float32Array(trailN*3),trailGeo=new THREE.BufferGeometry();trailGeo.setAttribute("position",new THREE.BufferAttribute(trailP,3));
var trailM=new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0});root.add(new THREE.Line(trailGeo,trailM));
/* the body: a small cube */
var bodyG=new THREE.BoxGeometry(.26,.26,.26),bodyM=new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,opacity:0});
var body=new THREE.Mesh(bodyG,bodyM),bodyE=new THREE.LineSegments(new THREE.EdgesGeometry(bodyG),new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0}));
body.add(bodyE);root.add(body);
/* the twist: a magenta arc that turns the heading, then fades as the network adapts */
var twM=new THREE.MeshBasicMaterial({color:C.magenta,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false});
var twist=new THREE.Mesh(new THREE.RingGeometry(.34,.37,32,1,0,Math.PI/4),twM);twist.rotation.x=-Math.PI/2;root.add(twist);
/* the network: a dozen nodes in a loose sphere above, each link pulsing at its own changing rate */
var NN=12,nodes=[],nodeG=new THREE.SphereGeometry(.07,10,8),NY=1.35;
for(var n=0;n<NN;n++){var u=hash(n,7)*Math.PI*2,v=Math.acos(2*hash(n,8)-1),r=.75;
 var nm=new THREE.MeshBasicMaterial({color:C.muted.clone(),transparent:true,opacity:0});var s=new THREE.Mesh(nodeG,nm);
 s.position.set(Math.sin(v)*Math.cos(u)*r*1.4,NY+Math.cos(v)*r*.7,Math.sin(v)*Math.sin(u)*r);root.add(s);nodes.push({m:s,nm:nm,ph:hash(n,9)*6.28});}
var links=[],lpos=[];for(var a=0;a<NN;a++)for(var b=a+1;b<NN;b++)if(nodes[a].m.position.distanceTo(nodes[b].m.position)<.95){links.push([a,b,hash(a,b)*6.28,.6+hash(b,a)*1.6]);}
var linkP=new Float32Array(links.length*6),linkC=new Float32Array(links.length*6),linkGeo=new THREE.BufferGeometry();
links.forEach(function(L,k){var A_=nodes[L[0]].m.position,B_=nodes[L[1]].m.position;linkP.set([A_.x,A_.y,A_.z,B_.x,B_.y,B_.z],k*6);});
linkGeo.setAttribute("position",new THREE.BufferAttribute(linkP,3));linkGeo.setAttribute("color",new THREE.BufferAttribute(linkC,3));
var linkM=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0});root.add(new THREE.LineSegments(linkGeo,linkM));
/* a thin thread from the network down to the body: commands flowing each tick */
var thrP=new Float32Array(6),thrGeo=new THREE.BufferGeometry();thrGeo.setAttribute("position",new THREE.BufferAttribute(thrP,3));
var thrM=new THREE.LineDashedMaterial({color:C.cyan,transparent:true,opacity:0,dashSize:.06,gapSize:.06});var thread=new THREE.Line(thrGeo,thrM);root.add(thread);
var Q=1,d0=9,tgt=new THREE.Vector3(),pos=new THREE.Vector3(),tan=new THREE.Vector3(),tc=new THREE.Color(),hist=[];
function layout(){setA(api.size.w,api.size.h);Q=A<.9?.75:1;d0=A<.9?11.5:OX?10:8.6;}
layout();
return {resize:function(){layout();},
frame:function(t,p,mx,my){
 var e=eio(p),appear=ease((t-.2)/1.4);
 tiles.forEach(function(T){var a=ease((t-T.at)/1.1);T.em.opacity=Q*a*lerp(.55,.25,cl(T.d/7));T.fm.opacity=Q*a*.35;T.g.position.y=-1.2-(1-a)*.6+(T.g.position.y>-1.13?0:0);});
 /* steering: progress round the course; the twist (mid scroll) pushes the body off its line, then it pulls back */
 var u=((t*.035)+p*.55)%1,tw=cl((p-.35)/.12)*(1-cl((p-.47)/.22)),off=Math.sin(Math.PI/4)*tw*.55;
 curve.getPointAt(u,pos);curve.getTangentAt(u,tan);
 var side=new THREE.Vector3(-tan.z,0,tan.x).normalize();pos.addScaledVector(side,off);pos.y=-1.0+Math.abs(Math.sin(t*6))*.03;
 body.position.copy(pos);body.rotation.y=Math.atan2(tan.x,tan.z)+tw*Math.PI/4;bodyM.opacity=Q*appear*.55;bodyE.material.opacity=Q*appear;
 hist.unshift(pos.clone());if(hist.length>trailN)hist.pop();
 for(var k=0;k<trailN;k++){var hp=hist[Math.min(k,hist.length-1)];trailP[k*3]=hp.x;trailP[k*3+1]=-1.08;trailP[k*3+2]=hp.z;}
 trailGeo.attributes.position.needsUpdate=true;trailM.opacity=Q*appear*.45;
 wps.forEach(function(W,k){var wu=k/8,dd=Math.abs(((u-wu+1.5)%1)-.5);W.rm.opacity=Q*appear*lerp(.95,.4,cl(dd*6));W.m.rotation.y=t*.8+k;});
 twist.position.set(pos.x,-.98,pos.z);twist.rotation.z=body.rotation.y;twM.opacity=Q*tw*.9;
 /* network: each link brightens and dims at its own rate, and the rate itself drifts (liquid time constants) */
 var na=ease((t-.6)/1.4);
 links.forEach(function(L,k){var rate=L[3]*(1+.5*Math.sin(t*.3+L[2])),b=.35+.65*Math.pow(.5+.5*Math.sin(t*rate+L[2]),3);
  tc.copy(C.muted).lerp(C.cyan,b*(.5+.5*tw+.5*(1-tw)));linkC.set([tc.r,tc.g,tc.b,tc.r,tc.g,tc.b],k*6);});
 linkGeo.attributes.color.needsUpdate=true;linkM.opacity=Q*na*.8;
 nodes.forEach(function(N_,k){var b=.5+.5*Math.sin(t*1.7+N_.ph);N_.nm.color.copy(C.muted).lerp(C.cyan,b);N_.nm.opacity=Q*na;});
 thrP.set([0,NY-.75,0,pos.x,pos.y+.15,pos.z]);thrGeo.attributes.position.needsUpdate=true;thread.computeLineDistances();thrM.opacity=Q*na*.5;
 /* camera: starts on the network, comes down and round to the body on its course */
 var ang=lerp(.25,-.6,e)+mx*.15,rad=lerp(d0,d0*.78,e);
 tgt.set(lerp(0,pos.x*.35,e),lerp(.45,-.85,e),lerp(0,pos.z*.35,e));
 cam.position.set(tgt.x+Math.sin(ang)*rad,lerp(2.2,3.4,e)-my*.4,tgt.z+Math.cos(ang)*rad);cam.lookAt(tgt);}};
});

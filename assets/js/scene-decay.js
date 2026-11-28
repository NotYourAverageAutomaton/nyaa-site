/* Continuous Cognition hero (presentation only). Six rounds of a conversation stream in as slabs; scroll packs them
   into a fixed budget box (cyan, never grows). A few slabs keep a brass glow (kept decisions), the rest fade to the
   hairline colour, and one magenta fleck is cast out and never enters the box. No numbers, no words, no results. */
NYAAHero.scene(function(THREE, api){
var S=api.scene,cam=api.camera,C=api.colors;
var cl=function(x){return x<0?0:x>1?1:x;},ease=function(x){x=cl(x);return 1-Math.pow(1-x,3);},
    eio=function(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;},lerp=function(a,b,k){return a+(b-a)*k;};
function hash(i,k){var s=Math.sin(i*127.1+k*311.7)*43758.5453;return s-Math.floor(s);}
/* framing: on wide screens the view is offset so the scene sits right of centre (the text is on the left); on
   narrow screens it sits in the lower part of the hero, under the text. Offsets are fractions of the canvas. */
var A=1.6,OX=0,OY=0;function setA(w,h){A=(w>0&&h>0)?w/h:1.6;if(!(A>0&&isFinite(A)))A=1.6;cam.fov=A<.9?58:42;OX=A>1.1&&!api.placed?.22:0;OY=A<.9?.2:0;
 if(w>0&&h>0)cam.setViewOffset(w,h,-OX*w,-OY*h,w,h);else cam.clearViewOffset();cam.aspect=A;cam.updateProjectionMatrix();}
function fit(hw,hh){var t=Math.tan(cam.fov*Math.PI/360);return Math.max(hh/t,hw/(t*A));}
var root=new THREE.Group();S.add(root);
/* the budget: one fixed box behind the stream */
var BW=2.8,BH=1.9,BD=1.5,BZ=-3;
var boxM=new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0});
var box=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(BW,BH,BD)),boxM);box.position.z=BZ;root.add(box);
/* the conversation: 6 rounds x 6 slabs */
var R=6,K=6,N=R*K,KEEP={1:1,16:1,20:1,24:1,33:1};
var slabG=new THREE.BoxGeometry(.95,.42,.1),slabE=new THREE.EdgesGeometry(slabG),blocks=[],keptN=0;
for(var r=0;r<R;r++)for(var k=0;k<K;k++){var i=r*K+k,kept=!!KEEP[i];
 var fm=new THREE.MeshBasicMaterial({color:C.panel.clone(),transparent:true,opacity:0,depthWrite:false});
 var em=new THREE.LineBasicMaterial({color:C.muted.clone(),transparent:true,opacity:0});
 var g=new THREE.Group(),m=new THREE.Mesh(slabG,fm),e=new THREE.LineSegments(slabE,em);g.add(m);g.add(e);root.add(g);
 /* slot inside the box: kept slabs take the front layer, the rest fill behind */
 var si=kept?keptN++:0;blocks.push({g:g,fm:fm,em:em,kept:kept,r:r,
  sx:(r-2.5)*1.25,sy:(2.5-k)*.6,sz:(hash(i,1)-.5)*.5,
  at:.3+r*.45+k*.06,rot:(hash(i,2)-.5)*.5,ph:hash(i,3)*6.28,si:si});}
/* 36 slots in the box (4 x 3 x 3): kept slabs take the front top row and one below it, the rest fill what is left */
var FRONT=[[0,2],[1,2],[2,2],[3,2],[1,1]],used={},free=[];
FRONT.forEach(function(f){used[f[0]+","+f[1]+",2"]=1;});
for(var cz=0;cz<3;cz++)for(var cy=2;cy>=0;cy--)for(var cx=0;cx<4;cx++)if(!used[cx+","+cy+","+cz])free.push([cx,cy,cz]);
var fi=0;blocks.forEach(function(b){var c=b.kept?[FRONT[b.si][0],FRONT[b.si][1],2]:free[fi++];
 b.tx=-BW/2+(c[0]+.5)*BW/4;b.ty=-BH/2+(c[1]+.5)*BH/3;b.tz=BZ-BD/2+(c[2]+.5)*BD/3;});
/* the cast-out fleck: planted with round four, leaves upward and right, always above the box */
var flM=new THREE.MeshBasicMaterial({color:C.magenta,transparent:true,opacity:0});
var fleck=new THREE.Mesh(new THREE.OctahedronGeometry(.12,0),flM);root.add(fleck);
var flHalo=new THREE.Mesh(new THREE.RingGeometry(.17,.19,32),new THREE.MeshBasicMaterial({color:C.magenta,transparent:true,opacity:0,depthWrite:false}));root.add(flHalo);
var F0=new THREE.Vector3(.62,2.15,.2),F1=new THREE.Vector3(2.5,1.75,-1.4);
var Q=1,d0=12,tgt=new THREE.Vector3(),tmp=new THREE.Color();
function layout(){setA(api.size.w,api.size.h);Q=A<.9?.7:1;d0=OX?fit(4.4/.52,2.9):OY?fit(4.6,2.9/.5):fit(4.6,3.2);}
layout();
return {resize:function(){layout();},
frame:function(t,p,mx,my){
 var e=eio(p);
 boxM.opacity=Q*ease((t-.2)/1.2)*lerp(.45,.95,e);
 for(var n=0;n<N;n++){var b=blocks[n],a=ease((t-b.at)/1.0);
  /* stream position (time) */
  var x=b.sx+(1-a)*8,y=b.sy+Math.sin(t*.6+b.ph)*.04*a,z=b.sz-(1-a)*6;
  /* compression (scroll only): older rounds go first */
  var c=eio(p*1.35-(b.r/5)*.35),s=lerp(1,b.kept?.6:.45,c);
  b.g.position.set(lerp(x,b.tx,c),lerp(y,b.ty,c)+Math.sin(c*3.1416)*.6,lerp(z,b.tz,c));
  b.g.rotation.set(0,b.rot*(1-c)*.4,b.rot*(1-a)*.6);b.g.scale.setScalar(s);
  var glow=b.kept?lerp(.3,1,c):0;
  if(b.kept){b.em.color.copy(C.muted).lerp(C.brass,glow);b.fm.color.copy(C.panel).lerp(C.brass,.35*glow);}
  else{b.em.color.copy(C.muted).lerp(C.line,c);b.fm.color.copy(C.panel);}
  b.em.opacity=Q*a*(b.kept?1:lerp(.8,.55,c));b.fm.opacity=Q*a*(b.kept?lerp(.5,.75,c):lerp(.5,.3,c));}
 /* the fleck: arrives with round four, then is cast further out as the box fills */
 var fa=ease((t-1.75)/1.0),fc=ease(p*1.2);
 fleck.position.set(lerp(F0.x+(1-fa)*8,F1.x,fc),lerp(F0.y,F1.y,fc)+Math.sin(t*1.3)*.05,lerp(F0.z-(1-fa)*6,F1.z,fc));
 fleck.rotation.set(t*.7,t*1.1,0);flM.opacity=Q*fa;
 flHalo.position.copy(fleck.position);flHalo.lookAt(cam.position);flHalo.material.opacity=Q*fa*(.25+.15*Math.sin(t*2));
 /* camera: front-on, then swings round the box to show it in depth */
 var ang=lerp(0,-.55,e),rad=lerp(d0+.5,d0*.62+2,e),ty=lerp(0,-.4,e);
 tgt.set(0,ty,lerp(-.5,BZ,e));
 cam.position.set(tgt.x+Math.sin(ang)*rad+mx*.7,lerp(.3,2.6,e)-my*.4,tgt.z+Math.cos(ang)*rad);
 cam.lookAt(tgt);}};
});

/* Tools hero (presentation only). An agent's memory as a field of small flat note cards in depth, some joined by
   faint links; over time new brass links draw in between pairs that ought to be joined and were not. Scroll lifts
   the camera to see the whole web from above. Cards are blank: no numbers, no words, no results. */
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
var root=new THREE.Group();S.add(root);
/* the notes: loose clusters spread on a shallow slab, x/z wide, y thin */
var NC=46,cards=[],CL=[[-3.2,-1.6],[.6,-3],[3.4,.4],[-.8,2.2],[-4,1.9]];
var cardG=new THREE.PlaneGeometry(.46,.6),cardE=new THREE.EdgesGeometry(cardG);
for(var i=0;i<NC;i++){var c=CL[i%CL.length],r=Math.sqrt(hash(i,1))*2.1,a=hash(i,2)*6.2832;
 var x=c[0]+Math.cos(a)*r,z=c[1]+Math.sin(a)*r*.9,y=(hash(i,3)-.5)*1.4;
 var fm=new THREE.MeshBasicMaterial({color:C.panel,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});
 var em=new THREE.LineBasicMaterial({color:C.muted.clone(),transparent:true,opacity:0});
 var g=new THREE.Group();g.add(new THREE.Mesh(cardG,fm));g.add(new THREE.LineSegments(cardE,em));
 g.position.set(x,y,z);root.add(g);
 cards.push({g:g,fm:fm,em:em,p:new THREE.Vector3(x,y,z),roll:(hash(i,4)-.5)*.5,ph:hash(i,5)*6.28,at:.15+hash(i,6)*1.3,hot:0});}
/* existing links: each card to its nearest neighbour, plus a second for some */
var linked={},old=[],cand=[];function key(a,b){return a<b?a+"-"+b:b+"-"+a;}
var near=cards.map(function(ca,ai){return cards.map(function(cb,bi){return {i:bi,d:ai===bi?1e9:ca.p.distanceTo(cb.p)};}).sort(function(u,v){return u.d-v.d;});});
for(var ai=0;ai<NC;ai++){var lim=hash(ai,7)<.45?2:1;for(var n=0;n<lim;n++){var b=near[ai][n].i,kk=key(ai,b);if(!linked[kk]){linked[kk]=1;old.push([ai,b]);}}}
/* the missing links: close pairs (third or fourth nearest) not yet joined, spread across the field */
for(ai=0;ai<NC&&cand.length<12;ai+=3){for(n=2;n<5;n++){var bb=near[ai][n].i,k2=key(ai,bb);if(!linked[k2]&&near[ai][n].d<3.2){linked[k2]=1;cand.push([ai,bb]);break;}}}
var oldPos=new Float32Array(old.length*6),OG=new THREE.BufferGeometry();OG.setAttribute("position",new THREE.BufferAttribute(oldPos,3));
var OM=new THREE.LineBasicMaterial({color:C.line,transparent:true,opacity:0});root.add(new THREE.LineSegments(OG,OM));
var newPos=new Float32Array(Math.max(1,cand.length)*6),NG=new THREE.BufferGeometry();NG.setAttribute("position",new THREE.BufferAttribute(newPos,3));
var NM=new THREE.LineBasicMaterial({color:C.brass,transparent:true,opacity:0});root.add(new THREE.LineSegments(NG,NM));
var Q=1,d0=12,lp=[],tmpV=new THREE.Vector3(),tgt=new THREE.Vector3();
function layout(){setA(api.size.w,api.size.h);Q=A<.9?.75:1;d0=fit(OX?6.4/.52:5.4,OY?3.2/.5:3.2)+1.5;}
layout();
function put(arr,o,P0,P1,k){arr[o]=P0.x;arr[o+1]=P0.y;arr[o+2]=P0.z;arr[o+3]=lerp(P0.x,P1.x,k);arr[o+4]=lerp(P0.y,P1.y,k);arr[o+5]=lerp(P0.z,P1.z,k);}
return {resize:function(){layout();},
frame:function(t,p,mx,my){
 var e=eio(p);
 /* scroll lifts the camera from the level of the notes to above the whole web */
 var el=lerp(.12,1.22,e),r=lerp(d0,d0*1.12,e),yo=0;tgt.set(0,yo,lerp(.6,0,e));
 cam.position.set(Math.sin(mx*.25)*r*.15+mx*.6,tgt.y+Math.sin(el)*r-my*.5,tgt.z+Math.cos(el)*r);
 cam.lookAt(tgt);
 /* cards drift a little and turn to face the viewer */
 for(var i=0;i<NC;i++){var c=cards[i],a=ease((t-c.at)/1.0);lp[i]=a;
  c.g.position.set(c.p.x,c.p.y+Math.sin(t*.5+c.ph)*.06,c.p.z);c.g.quaternion.copy(cam.quaternion);c.g.rotateZ(c.roll);
  c.fm.opacity=Q*a*.7;c.hot=0;}
 /* old links fade in once their cards are there */
 for(var j=0;j<old.length;j++){var A0=cards[old[j][0]].g.position,A1=cards[old[j][1]].g.position;put(oldPos,j*6,A0,A1,1);}
 OG.attributes.position.needsUpdate=true;OM.opacity=Q*.85*ease((t-1.3)/1.2);
 /* new links draw in one after another, then stay */
 for(j=0;j<cand.length;j++){var s=2.2+j*.95,k=eio((t-s)/1.1),P0=cards[cand[j][0]].g.position,P1=cards[cand[j][1]].g.position;
  put(newPos,j*6,P0,P1,k);if(k>0){var flash=Math.exp(-Math.max(0,t-s-1.1)*1.2)*cl(k*3);
   cards[cand[j][0]].hot=Math.max(cards[cand[j][0]].hot,cl(k*3)*.5+flash*.5);cards[cand[j][1]].hot=Math.max(cards[cand[j][1]].hot,k*.5+flash*.5);}}
 NG.attributes.position.needsUpdate=true;NM.opacity=Q*.95;
 for(i=0;i<NC;i++){var cc=cards[i];cc.em.color.copy(C.muted).lerp(C.brass,cc.hot);cc.em.opacity=Q*lp[i]*lerp(.75,1,cc.hot);}
}};
});

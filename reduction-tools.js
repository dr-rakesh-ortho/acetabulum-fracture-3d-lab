import * as THREE from './assets/three.module.js';
import {makePhotoClamp} from './photo-clamp.js';
// Schematic instrument families, not measured manufacturer CAD.
export function makeInstrument(group,a,b,opts={}){
 const {type='photo',length=240,roll=0,outward=new THREE.Vector3(-1,.4,0),direction}=opts;
 if(type==='photo')return makePhotoClamp(group,a,b,opts);
 const s=length/240,w=a.clone().sub(b).normalize();if(w.lengthSq()<.01)w.set(0,1,0);
 let u=outward.clone().addScaledVector(w,-outward.dot(w));if(u.lengthSq()<.01)u.set(0,0,1);u.normalize().applyAxisAngle(w,THREE.MathUtils.degToRad(roll));
 const mid=a.clone().add(b).multiplyScalar(.5),p=(x,y)=>mid.clone().addScaledVector(u,x*s).addScaledVector(w,y*s),gap=a.distanceTo(b)/2/s;
 function tube(points,r=2,color=0xc1ccd3){const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),48,r*s,10,false),new THREE.MeshStandardMaterial({color,metalness:.75,roughness:.3}));group.add(m);return m;}
 function ring(c,r,axis=u,other=w){const pts=[];for(let i=0;i<=48;i++){const t=i*Math.PI/24;pts.push(c.clone().addScaledVector(axis,r*s*Math.cos(t)).addScaledVector(other,r*s*Math.sin(t)))}tube(pts,1.7);}
 if(type==='hook'){
  const d=(direction?.lengthSq()?direction.clone():u.clone()).normalize(),side=w.clone().addScaledVector(d,-w.dot(d));if(side.lengthSq()<.01)side.copy(u).addScaledVector(d,-u.dot(d));if(side.lengthSq()<.01)side.set(0,0,1);side.normalize().applyAxisAngle(d,THREE.MathUtils.degToRad(roll));
  const q=(x,y)=>b.clone().addScaledVector(d,x*s).addScaledVector(side,y*s);
  tube([b,q(-5,7),q(1,16),q(14,17),q(28,4),q(104,4)],2.3);const eye=[];for(let i=0;i<=48;i++){const t=i*Math.PI/24;eye.push(q(115+14*Math.cos(t),4+9*Math.sin(t)))}tube(eye,2);tube([q(126,4),q(155,14),q(220,11),q(230,4),q(220,-3),q(155,-6),q(126,4)],3);return;
 }
 // Two short provisional screw posts with raised heads.
 for(const tip of [a,b]){tube([tip,tip.clone().addScaledVector(u,18*s)],2.2,0xd7ae69);ring(tip.clone().addScaledVector(u,18*s),4);}
 // Broad crossed branches, terminal screw eyes and a locking spindle.
 function branch(points,width=7){const curve=new THREE.CatmullRomCurve3(points),n=new THREE.Vector3().crossVectors(u,w).normalize(),vertices=[],indices=[];for(let i=0;i<=36;i++){const c=curve.getPoint(i/36),side=new THREE.Vector3().crossVectors(n,curve.getTangent(i/36)).normalize();for(const [x,z] of [[1,1],[-1,1],[-1,-1],[1,-1]])vertices.push(...c.clone().addScaledVector(side,x*width*s/2).addScaledVector(n,z*2*s).toArray());if(i<36)for(let j=0;j<4;j++){const k=i*4+j,l=i*4+(j+1)%4;indices.push(k,l,l+4,k,l+4,k+4)}}indices.push(0,2,1,0,3,2,144,145,146,144,146,147);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();group.add(new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0xaebcc4,metalness:.75,roughness:.3,side:THREE.DoubleSide})));}
 if(type==='jungbluth'){
  for(const sign of [-1,1]){branch([p(18,sign*gap),p(40,sign*(gap+6)),p(73,0),p(105,-sign*(gap+30)),p(190,-sign*(gap+45))],10);ring(p(18,sign*gap),5);}
  const lo=-gap-55,hi=gap+65;tube([p(105,lo),p(105,hi)],2.3);const n=new THREE.Vector3().crossVectors(u,w).normalize(),helix=[];for(let i=0;i<=600;i++){const t=i/600;helix.push(p(105,lo+(hi-lo)*t).addScaledVector(u,3*s*Math.cos(t*70*Math.PI)).addScaledVector(n,3*s*Math.sin(t*70*Math.PI)))}tube(helix,.65);tube([p(98,hi),p(112,hi)],3);ring(p(73,0),5);
 }else{
  for(const sign of [-1,1]){branch([p(18,sign*gap),p(39,sign*(gap+5)),p(79,0),p(125,-sign*(gap+38)),p(188,-sign*(gap+46))],11);ring(p(18,sign*gap),5);}ring(p(79,0),5);branch([p(188,-gap-46),p(188,gap+46)],5);tube([p(180,gap+46),p(196,gap+46)],3);
 }
}

export function makeSchanz(group,entry,axis,{length=120,roll=0}={}){
 const d=axis.clone().normalize(),side=new THREE.Vector3(0,1,0);side.addScaledVector(d,-side.dot(d));if(side.lengthSq()<.01)side.set(0,0,1);side.normalize().applyAxisAngle(d,THREE.MathUtils.degToRad(roll));const n=new THREE.Vector3().crossVectors(d,side).normalize(),point=x=>entry.clone().addScaledVector(d,x);
 function rod(a,b,r,color){const delta=b.clone().sub(a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),20),new THREE.MeshStandardMaterial({color,metalness:.7,roughness:.3}));o.position.copy(a.clone().add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());group.add(o);}
 rod(point(-12),point(length*.65),2.5,0xc3a861);const pts=[];for(let i=0;i<=200;i++){const t=i/200;pts.push(point(-12+34*t).addScaledVector(side,3*Math.cos(t*24*Math.PI)).addScaledVector(n,3*Math.sin(t*24*Math.PI)))}group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),200,.6,6,false),new THREE.MeshStandardMaterial({color:0xb9a05b,metalness:.7,roughness:.3})));
 rod(point(length*.55),point(length*.77),9,0x8b9ba5);rod(point(length*.77),point(length),4,0xaebcc4);const end=point(length);rod(end.clone().addScaledVector(side,-30),end.clone().addScaledVector(side,30),4,0xaebcc4);
}

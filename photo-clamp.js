import * as THREE from './assets/three.module.js';
const V=a=>new THREE.Vector3(...a);
// Photo-derived silhouette, not a measured manufacturer's CAD model.
export function makePhotoClamp(group,a,b,{length=240,roll=0,outward=new THREE.Vector3(-1,.25,0)}={}){
 const s=length/240,mid=a.clone().add(b).multiplyScalar(.5),gap=Math.max(1,a.distanceTo(b)/2),w=a.clone().sub(b).normalize();
 if(w.lengthSq()<.1)w.set(0,1,0);
 let u=outward.clone().addScaledVector(w,-outward.dot(w));if(u.lengthSq()<.01)u=V([0,0,1]).addScaledVector(w,-w.z);u.normalize().applyAxisAngle(w,THREE.MathUtils.degToRad(roll));
 const n=u.clone().cross(w).normalize(),p=(x,y,z=0)=>mid.clone().addScaledVector(u,x*s).addScaledVector(w,y*s).addScaledVector(n,z*s),g=gap/s,h=-45;
 const metal=()=>new THREE.MeshStandardMaterial({color:0xb9c2c8,metalness:.82,roughness:.26,side:THREE.DoubleSide});
 function mesh(geometry,pos){const o=new THREE.Mesh(geometry,metal());if(pos)o.position.copy(pos);group.add(o);return o}
 function tube(points,r=1.5){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points,false,'centripetal'),points.length>200?384:points.length===2?2:64,r*s,10,false))}
 function cyl(from,to,r1,r2=r1,segments=20){const d=to.clone().sub(from),o=mesh(new THREE.CylinderGeometry(r2*s,r1*s,d.length(),segments),from.clone().add(to).multiplyScalar(.5));o.quaternion.setFromUnitVectors(V([0,1,0]),d.normalize());return o}
 function ribbon(points,width=5,thickness=2.2){const curve=new THREE.CatmullRomCurve3(points,false,'centripetal'),verts=[],indices=[];for(let i=0;i<=50;i++){const t=i/50,c=curve.getPoint(t),tangent=curve.getTangent(t).normalize(),side=n.clone().cross(tangent).normalize();for(const [h,d] of [[1,1],[-1,1],[-1,-1],[1,-1]])verts.push(...c.clone().addScaledVector(side,h*width*s/2).addScaledVector(n,d*thickness*s/2).toArray());if(i<50)for(let j=0;j<4;j++){let k=i*4+j,l=i*4+(j+1)%4;indices.push(k,l,l+4,k,l+4,k+4)}}indices.push(0,2,1,0,3,2,200,201,202,200,202,203);const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();mesh(geo)}
 // Two bowed jaws and a cross-pivot; tips remain on the chosen bone contacts.
 for(const sign of [-1,1]){
  const tip=sign>0?a:b,neck=tip.clone().addScaledVector(u,4*s).addScaledVector(w,sign*1.8*s);
  cyl(tip,neck,.08,1.4,16);mesh(new THREE.SphereGeometry(2.4*s,18,12),neck);
  const jaw=sign>0?[neck,p(7,g+8),p(17,g+13),p(44,-7),p(69,h+20),p(79,h+5),p(91,h,sign*.8)]:[neck,p(7,-g-8),p(17,-g-13),p(44,h-1),p(69,h-7),p(79,h-5),p(91,h,sign*.8)];tube(jaw,1.65);
  ribbon([p(68,h+(sign>0?20:-7)),p(80,h+sign*5),p(91,h,sign*.8),p(111,h-sign*4,sign*.8)],5.6,2.1);
  const handleSpread=20+g*.12;
  ribbon([p(91,h,sign*.8),p(111,h-sign*4,sign*.8),p(151,h-sign*8),p(185,h-sign*12),p(203,h-sign*handleSpread)],4.6,2.3);
  const center=p(221,h-sign*(handleSpread+8));const ring=[];for(let k=0;k<=80;k++){const t=2*Math.PI*k/80;ring.push(center.clone().addScaledVector(u,18*s*Math.cos(t)).addScaledVector(w,21*s*Math.sin(t)))}tube(ring,1.75);
 }
 // Pivot screw, slot, threaded spindle, attachment shoe and knurled thumb nut.
 cyl(p(91,h,-3.3),p(91,h,3.3),4.6,4.6,28);tube([p(88,h-2,3.4),p(94,h+2,3.4)],.3);
 const bottom=h-18-g*.08,top=h+49+g*.08;cyl(p(147,bottom),p(147,top),1.2);
 const helix=[];for(let i=0;i<=480;i++){const t=i/480,y=bottom+(top-bottom)*t,ang=2*Math.PI*22*t;helix.push(p(147+1.6*Math.cos(ang),y,1.6*Math.sin(ang)))}tube(helix,.35);
 cyl(p(147,top),p(147,top+10),6.2,6.2,40);
 for(let k=0;k<28;k++){const ang=2*Math.PI*k/28;const x=147+6.25*Math.cos(ang),z=6.25*Math.sin(ang);tube([p(x,top+.6,z),p(x,top+9.4,z)],.22)}
 cyl(p(147,bottom-2),p(147,bottom+2),3.2);ribbon([p(142,bottom),p(153,bottom)],5,3);
 return {hinge:p(91,h),tipA:a,tipB:b};
}

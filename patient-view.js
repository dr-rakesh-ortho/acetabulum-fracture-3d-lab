// Schematic body/table context around the shared, full-resolution fracture model.
export function createPatientView(T,OrbitControls,$){
 const stage=$('patientStage'),scene=new T.Scene();scene.background=new T.Color(0x101d27);
 const cam=new T.PerspectiveCamera(38,1,1,6000),renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.domElement.style.cssText='display:block;width:100%;height:100%';stage.appendChild(renderer.domElement);
 const controls=new OrbitControls(cam,renderer.domElement);controls.enableDamping=true;cam.up.set(0,0,1);
 scene.add(new T.HemisphereLight(0xffffff,0x42576a,2.5));const light=new T.DirectionalLight(0xffffff,3);light.position.set(500,600,1000);scene.add(light);
 const patient=new T.Group(),bones=new T.Group(),context=new T.Group(),instruments=new T.Group();patient.add(bones,context,instruments);scene.add(patient);
 const bodyMaterial=new T.MeshStandardMaterial({color:0x77b9c4,transparent:true,opacity:.12,depthWrite:false,roughness:.8});
 const boneMaterial=new T.MeshStandardMaterial({color:0xcfc8b6,roughness:.8});
 function ellipsoid(pos,size,mat){const m=new T.Mesh(new T.SphereGeometry(1,24,16),mat);m.position.set(...pos);m.scale.set(...size);patient.add(m);}
 function rod(a,b,r){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av),m=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),12),boneMaterial);m.position.copy(av.add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());patient.add(m);}
 ellipsoid([0,220,0],[135,215,90],bodyMaterial);ellipsoid([0,-15,0],[145,125,95],bodyMaterial);ellipsoid([0,515,0],[72,95,78],bodyMaterial);
 ellipsoid([0,515,0],[53,72,57],boneMaterial);
 rod([0,60,-35],[0,405,-35],13);
 for(const sign of [-1,1]){ellipsoid([sign*85,-285,0],[55,240,62],bodyMaterial);ellipsoid([sign*85,-665,0],[38,180,42],bodyMaterial);ellipsoid([sign*190,215,0],[35,185,40],bodyMaterial);rod([sign*85,-90,0],[sign*85,-480,0],15);rod([sign*85,-490,0],[sign*85,-815,0],10);rod([sign*118,370,0],[sign*194,180,0],10);rod([sign*194,180,0],[sign*205,40,0],8);rod([-115,365,-15],[115,365,-15],9);}
 const table=new T.Mesh(new T.BoxGeometry(470,1660,35),new T.MeshStandardMaterial({color:0x264b58,roughness:.8}));table.position.set(0,-135,-125);scene.add(table);
 const base=new T.Mesh(new T.BoxGeometry(110,400,220),new T.MeshStandardMaterial({color:0x637681,metalness:.4,roughness:.5}));base.position.set(0,-135,-255);scene.add(base);
 function tag(text,pos){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=64;const c=canvas.getContext('2d');c.fillStyle='#d9f4ee';c.font='28px sans-serif';c.textAlign='center';c.fillText(text,128,42);const sprite=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(canvas),depthTest:false}));sprite.position.set(...pos);sprite.scale.set(170,43,1);patient.add(sprite);}
 tag('HEAD',[0,650,0]);tag('FEET',[0,-935,0]);tag('R',[-220,10,0]);tag('L',[220,10,0]);tag('ANTERIOR',[0,15,160]);tag('POSTERIOR',[0,15,-170]);
 // Canonical right hip is +X; screen-side labels follow that anatomy.
 for(const child of patient.children)if(child.isSprite&&child.position.x)child.position.x*=-1;
 
 function copyGroup(source,target,force=false){if(force||source.children.length!==target.children.length||source.children.some((o,i)=>target.userData.sources?.[i]!==o)){target.clear();for(const o of source.children)target.add(o.clone());target.userData.sources=source.children.slice();}source.children.forEach((o,i)=>{const c=target.children[i];c.position.copy(o.position);c.quaternion.copy(o.quaternion);c.scale.copy(o.scale);});}
 function sync(source,sign){copyGroup(source.bones,bones);copyGroup(source.ctx,context);copyGroup(source.clamps,instruments);bones.scale.x=context.scale.x=instruments.scale.x=sign;context.visible=true;for(const c of context.children)c.visible=true;}
 function rotate(){patient.rotation.y=Number($('patientRotation').value)*Math.PI/180;patient.position.z=Math.max(0,220*Math.abs(Math.sin(patient.rotation.y))+95*Math.abs(Math.cos(patient.rotation.y))-95);$('patientAngle').textContent=$('patientRotation').value+'°';}
 function camera(){const mode=$('patientCamera').value;for(const o of patient.children)if(![bones,context,instruments].includes(o))o.visible=mode!=='axial'||!!(o.isSprite&&Math.abs(o.position.y)<200);controls.target.set(0,mode==='overview'?-120:0,patient.position.z);cam.position.set(...(mode==='axial'?[0,700,patient.position.z+1]:mode==='pelvis'?[430,300,540]:[1150,700,1500]));cam.up.set(0,0,1);controls.update();}
 $('patientRotation').oninput=()=>{$('patientPosition').value=$('patientRotation').value;rotate();};$('patientPosition').onchange=()=>{$('patientRotation').value=$('patientPosition').value;rotate();};$('patientCamera').onchange=camera;
 new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}).observe(stage);
 return {sync,camera,render(source,sign){sync(source,sign);rotate();if($('patientCamera').value==='axial'){cam.position.z+=patient.position.z-controls.target.z;controls.target.z=patient.position.z;}controls.update();renderer.render(scene,cam);}};
}

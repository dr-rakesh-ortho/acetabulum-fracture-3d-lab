// Z-Anatomy skeleton context (separate CC BY-SA asset) around the NIH fracture pelvis.
export function createPatientView(T,OrbitControls,$){
 const stage=$('patientStage'),scene=new T.Scene();scene.background=new T.Color(0x101d27);
 const cam=new T.PerspectiveCamera(38,1,1,6000),renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.domElement.style.cssText='display:block;width:100%;height:100%';stage.appendChild(renderer.domElement);
 const controls=new OrbitControls(cam,renderer.domElement);controls.enableDamping=true;cam.up.set(0,0,1);
 scene.add(new T.HemisphereLight(0xffffff,0x42576a,2.5));const light=new T.DirectionalLight(0xffffff,3);light.position.set(500,600,1000);scene.add(light);
 const patient=new T.Group(),bones=new T.Group(),context=new T.Group(),instruments=new T.Group();patient.add(bones,context,instruments);scene.add(patient);
 const skeleton=new T.Group();patient.add(skeleton);
 const boneMaterial=new T.MeshStandardMaterial({color:0xe7ddc2,roughness:.68,side:T.DoubleSide});
 let skeletonLoaded=false;
 async function loadSkeleton(){
  $('skeletonStatus').textContent='Loading Z-Anatomy skeleton…';$('skeletonRetry').hidden=true;
  try{
   const response=await fetch('./assets/z-anatomy-skeleton.json.gz');if(!response.ok)throw Error('HTTP '+response.status);
   const raw=await response.arrayBuffer();const data=JSON.parse(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
   for(const item of data.objects){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(item.positions,3));g.setIndex(item.indices);g.computeVertexNormals();const mesh=new T.Mesh(g,boneMaterial);mesh.name=item.name;skeleton.add(mesh);}
   skeletonLoaded=true;$('skeletonStatus').textContent='Z-Anatomy skeleton loaded · '+data.objects.length+' anatomical bone meshes · NIH fracture pelvis retained';
  }catch(e){$('skeletonStatus').textContent='Skeleton could not load. The fracture pelvis is still available. '+e.message;$('skeletonRetry').hidden=false;}
 }
 $('skeletonRetry').onclick=loadSkeleton;loadSkeleton();
 const table=new T.Mesh(new T.BoxGeometry(650,1850,35),new T.MeshStandardMaterial({color:0x264b58,roughness:.8}));table.position.set(0,-20,-125);scene.add(table);
 const base=new T.Mesh(new T.BoxGeometry(110,400,220),new T.MeshStandardMaterial({color:0x637681,metalness:.4,roughness:.5}));base.position.set(0,-135,-255);scene.add(base);
 function tag(text,pos){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=64;const c=canvas.getContext('2d');c.fillStyle='#d9f4ee';c.font='28px sans-serif';c.textAlign='center';c.fillText(text,128,42);const sprite=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(canvas),depthTest:false}));sprite.position.set(...pos);sprite.scale.set(170,43,1);patient.add(sprite);}
 tag('HEAD',[0,855,0]);tag('FEET',[0,-875,0]);tag('R',[-220,10,0]);tag('L',[220,10,0]);tag('ANTERIOR',[0,15,160]);tag('POSTERIOR',[0,15,-170]);
 // Canonical right hip is +X; screen-side labels follow that anatomy.
 for(const child of patient.children)if(child.isSprite&&child.position.x)child.position.x*=-1;
 
 function copyGroup(source,target,force=false){if(force||source.children.length!==target.children.length||source.children.some((o,i)=>target.userData.sources?.[i]!==o)){target.clear();for(const o of source.children)target.add(o.clone());target.userData.sources=source.children.slice();}source.children.forEach((o,i)=>{const c=target.children[i];c.position.copy(o.position);c.quaternion.copy(o.quaternion);c.scale.copy(o.scale);});}
 function sync(source,sign){copyGroup(source.bones,bones);copyGroup(source.ctx,context);copyGroup(source.clamps,instruments);bones.scale.x=context.scale.x=instruments.scale.x=sign;context.visible=true;for(const c of context.children)c.visible=true;}
 function rotate(){patient.rotation.y=Number($('patientRotation').value)*Math.PI/180;patient.position.z=Math.max(0,310*Math.abs(Math.sin(patient.rotation.y))+95*Math.abs(Math.cos(patient.rotation.y))-95);$('patientAngle').textContent=$('patientRotation').value+'°';}
 function camera(){const mode=$('patientCamera').value;for(const o of patient.children)if(![bones,context,instruments].includes(o))o.visible=mode!=='axial'||!!(o.isSprite&&Math.abs(o.position.y)<200);controls.target.set(0,0,patient.position.z);cam.position.set(...(mode==='axial'?[0,700,patient.position.z+1]:mode==='pelvis'?[430,300,540]:[1200,900,1850]));cam.up.set(0,0,1);controls.update();}
 $('patientRotation').oninput=()=>{$('patientPosition').value=$('patientRotation').value;rotate();};$('patientPosition').onchange=()=>{$('patientRotation').value=$('patientPosition').value;rotate();};$('patientCamera').onchange=camera;
 new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}).observe(stage);
 return {sync,camera,render(source,sign){sync(source,sign);rotate();if($('patientCamera').value==='axial'){cam.position.z+=patient.position.z-controls.target.z;controls.target.z=patient.position.z;}controls.update();renderer.render(scene,cam);}};
}

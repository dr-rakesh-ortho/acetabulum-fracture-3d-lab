"""Blender export of Z-Anatomy bones, retained as a separately licensed asset."""
import bpy,json,gzip,re,pathlib
from mathutils import Vector
root=pathlib.Path(__file__).resolve().parents[1]
items=[]
for o in bpy.data.objects:
 n=o.name
 if o.type!='MESH' or len(o.data.vertices)<=8:continue
 if '.' in n and not n.endswith(('.l','.r')):continue
 if any(t in n.lower() for t in ['muscle','sinus','cartilage']):continue
 if n in ['Hip bone.l','Hip bone.r','Sacrum','Coccyx']:continue
 m=o.data;m.calc_loop_triangles()
 verts=[]
 for v in m.vertices:
  q=o.matrix_world@v.co
  verts.extend([round(-q.x*930,3),round((q.z-.895)*930,3),round(-q.y*930+20,3)])
 faces=[i for t in m.loop_triangles for i in reversed(t.vertices)]
 items.append(dict(name=n,positions=verts,indices=faces))
raw=json.dumps({'source':'Z-Anatomy / BodyParts3D','scale':930,'objects':items},separators=(',',':')).encode()
(root/'assets/z-anatomy-skeleton.json.gz').write_bytes(gzip.compress(raw,compresslevel=9,mtime=0))
(root/'assets/z-anatomy-manifest.json').write_text(json.dumps({'source':'https://github.com/LluisV/Z-Anatomy/blob/PC-Version/Resources/Models/FBX/SkeletalSystem100.fbx','license':'CC BY-SA 4.0','modifications':'Selected bones only; excluded annotation meshes, muscle attachment patches, cartilage, sinus cavities, hips, sacrum and coccyx. Coordinates reflected/reoriented and uniformly scaled to 930 mm per source metre, translated to approximate NIH pelvis context. Winding reversed. No decimation. Not anatomical registration.','objects':[{'name':o['name'],'vertices':len(o['positions'])//3,'triangles':len(o['indices'])//3} for o in items]},indent=2))
print('EXPORTED',len(items),'objects',sum(len(o['indices'])//3 for o in items),'triangles',len(gzip.compress(raw)),'bytes')

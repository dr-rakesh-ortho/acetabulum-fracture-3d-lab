import json,numpy as np,trimesh,manifold3d as md
from pathlib import Path
root=Path(__file__).resolve().parents[1]
d=json.loads((root/'assets/anatomy.json').read_text());results=[]
for p in d['patterns']:
 parts=[]
 for f in p['parts']:
  m=trimesh.Trimesh(vertices=f['mesh']['v'],faces=f['mesh']['f'],process=True)
  mf=md.Manifold(md.Mesh(np.array(m.vertices,dtype=np.float32),np.array(m.faces,dtype=np.uint32)))
  parts.append({'name':f['name'],'watertight':m.is_watertight,'winding_consistent':m.is_winding_consistent,'volume_positive':bool(m.volume>0),'components':len(mf.decompose())})
  assert m.is_watertight and m.is_winding_consistent and m.volume>0 and len(mf.decompose())==1,parts[-1]
 results.append({'pattern':p['name'],'parts':parts})
(root/'geometry-checks.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))

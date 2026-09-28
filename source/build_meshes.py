import trimesh, manifold3d as md,numpy as np,json,pathlib
out=pathlib.Path(__file__).resolve().parents[1]/'assets'
def load(name):
 key={'right-hip':'right','left-hip':'left','sacrum':'sacrum'}[name]
 m=trimesh.load(out/('nih-'+key+'-original.stl'))
 m.update_faces(m.unique_faces());m.update_faces(m.nondegenerate_faces());m.remove_unreferenced_vertices();m.fill_holes()
 m=max(m.split(only_watertight=False),key=lambda part:abs(part.volume))
 assert m.is_watertight
 v=m.vertices.copy()
 # Rigid display placement; no rescaling or smoothing. Context assembly is approximate.
 shifts={'right':(83.24755096,10,0),'left':(-83.6931076,-12,50),'sacrum':(5,-20,-45)}
 x,y,z=shifts[key];m.vertices=np.column_stack([-v[:,0]+x,v[:,2]+y,-v[:,1]+z])
 if m.volume<0:m.invert()
 return m

m=load('right-hip');base=md.Manifold(md.Mesh(np.array(m.vertices,dtype=np.float32),np.array(m.faces,dtype=np.uint32)))
def split(s,n,p):
 n=np.array(n,float);p=np.array(p,float);return s.split_by_plane(n.tolist(),float(np.dot(n/np.linalg.norm(n),p)))
def ac(s):return split(s,[0,.10,1],[0,0,20]) # anterior +, stable -
def pc(s):
 lo,hi=split(s,[0,-1,0],[0,12,0]);post,front=split(lo,[0,-.7,-1],[0,0,-5]);return post,front+hi
wall=md.Manifold.sphere(1,48).scale([23,24,19]).translate([83,-22,-10])
awall=md.Manifold.sphere(1,48).scale([18,17,15]).translate([70,-14,33])
def item(name,s,t=[0,0,0],r=[0,0,0]):return dict(name=name,s=s,t=t,r=r)
patterns=[]
def add(id,name,kind,parts,note):patterns.append(dict(id=id,name=name,kind=kind,parts=parts,note=note))
add('normal','Intact anatomy','Reference',[item('Right hip bone',base)],'Rotate the same anatomical bone from the acetabular surface to the inner table.')
pw=base^wall;rest=base-wall
add('pw','Posterior wall','Elementary',[item('Stable hip bone',rest),item('Posterior wall',pw,[16,0,-12],[0,-12,4])],'A localized posterior rim fragment. The medial view does not directly reveal its articular reduction; the Stoppa window does not expose the posterior wall.')
p,stable=pc(base)
add('pc','Posterior column','Elementary',[item('Stable ilium and anterior column',stable),item('Posterior column',p,[-15,-3,-6],[0,12,0])],'Follow the column separation from the greater sciatic notch region through the acetabulum to the obturator ring.')
aw=base^awall
add('aw','Anterior wall','Elementary',[item('Stable hip bone',base-awall),item('Anterior wall',aw,[-10,0,12],[0,-8,0])],'A localized anterior rim example. This spherical cut is a provisional modeling approximation, not a validated anterior-wall morphology.')
a,stable=ac(base)
add('ac','Anterior column','Elementary',[item('Stable ilium and posterior column',stable),item('Anterior column',a,[-14,-2,10],[0,-8,0])],'Representative high anterior-column split; identify the line across the inner table and pelvic brim. High iliac extension requires a broader view than the Stoppa window alone.')
# Approximate superior/inferior cavity bounds in the lateral reference view: -2 and -43 mm.
# A mid-cavity teaching level, not a universal clinical transverse fracture level.
transverse_y=(-2.0-43.0)/2
transverse_normal=[.4,1,-.2]
transverse_origin=[60,transverse_y,10]
# Oblique medial/anterior inclination leaves the pubic ramus with the inferior fragment.
def transverse(s):
 # A single oblique plane clears the posterior spine and medial pubic ramus.
 return split(s,[.6,1,0],[60,transverse_y,10])
upper,lower=transverse(base)
add('tr','Transverse','Elementary',[item('Stable iliac segment',upper),item('Ischiopubic segment',lower,[-16,-3,0],[0,9,0])],'This representative transverse line crosses the central acetabular cavity and exits anteriorly at the acetabular wall. Its anterior inclination preserves the pubic ramus within the inferior fragment. Posteriorly, the line rises toward the greater sciatic notch above the ischial spine; the spine remains in the inferior fragment. Clinical transverse levels vary. It separates the superior iliac segment from the inferior ischiopubic segment. The obturator ring remains intact.')
p,stable=pc(rest)
add('pcpw','Posterior column + posterior wall','Associated',[item('Stable ilium and anterior column',stable),item('Posterior column',p,[-14,-3,-6],[0,12,0]),item('Posterior wall',pw,[16,0,-12],[0,-12,4])],'The column and posterior wall are separate movable fragments. A reduced medial column contour alone does not demonstrate posterior-wall congruity.')
u,l=transverse(rest)
add('trpw','Transverse + posterior wall','Associated',[item('Stable iliac segment',u),item('Ischiopubic segment',l,[-16,-3,0],[0,9,0]),item('Posterior wall',pw,[16,0,-12],[0,-12,4])],'A transverse split with an additional posterior-wall fragment. Track that wall fragment separately when looking from inside.')
ant,post=split(lower,[0,0,1],[0,0,14])
add('t','T-type','Associated',[item('Stable iliac roof segment',upper),item('Anterior inferior segment',ant,[-13,-3,9],[0,-8,0]),item('Posterior inferior segment',post,[-16,-3,-5],[0,10,0])],'The inferior limb separates the anterior and posterior portions below the transverse line. Part of the acetabular roof remains attached to the stable ilium.')
a,resta=ac(base);u,p=transverse(resta)
add('acpht','Anterior column + posterior hemitransverse','Associated',[item('Stable ilium with retained roof',u),item('Anterior column',a,[-14,-2,10],[0,-8,0]),item('Posterior hemitransverse segment',p,[-12,-2,-5],[0,8,0])],'The anterior-column line meets a posterior hemitransverse component. Unlike both-column fractures, some articular roof remains connected to the stable ilium.')
u,p=split(resta,[0,1,0],[0,8,0])
add('bc','Both columns','Associated',[item('Stable iliac segment',u),item('Anterior column with roof',a,[-16,-2,9],[0,-8,0]),item('Posterior column',p,[-18,-3,-5],[0,10,0])],'Both articular column fragments are detached from the stable proximal ilium. This representative cut preserves that defining relationship; spur morphology needs expert review.')
# Supplementary quadrilateral-surface component; not an eleventh Letournel category.
# The medial separation plane and front/back borders are nearly vertical.
qp,_=split(md.Manifold.cube([600,600,600],True),[-1,.08,.05],[58,0,0])
qp,_=split(qp,[0,1,0],[0,-40,0])
qp,_=split(qp,[0,-1,0],[0,5,0])
qp,_=split(qp,[0,0,1],[0,0,-20])
qp,_=split(qp,[0,0,-1],[0,0,25])
qp_cutter=qp
qp=max((base^qp_cutter).decompose(),key=lambda solid:solid.volume())
for source_id in ['normal','ac','acpht','bc']:
 source=next(p for p in patterns if p['id']==source_id)
 parts=[item(part['name'],max((part['s']-qp_cutter).decompose(),key=lambda solid:solid.volume()),part['t'][:],part['r'][:]) for part in source['parts']]
 parts.append(item('Quadrilateral plate',qp,[-18,0,0],[0,25,8]))
 parts[-1]['role']='quadrilateral'
 title='Quadrilateral plate component study' if source_id=='normal' else source['name']+' + separate quadrilateral plate'
 add(source_id+'_qp',title,'Supplemental',parts,'A representative nearly vertical medial-wall separation with an independently mobile quadrilateral plate. The plate starts displaced medially and rotated. Reduce it laterally and correct its rotation relative to the fixed SI-connected segment. This is a supplemental morphology, not an eleventh Judet–Letournel category.')
 patterns[-1]['baseId']=source_id
 patterns[-1]['quadrilateral']=True
for pat in patterns:
 pat.setdefault('baseId',pat['id'])
 pat.setdefault('quadrilateral',False)
 for i,part in enumerate(pat['parts']):
  part['fixed']=i==0
  part['sacrumConnected']=i==0
  if i==0:part['name']='Fixed SI-connected segment' if pat['id']!='normal' else 'Intact SI-connected hip bone'
# source triangles identify new cut faces using KD distance to original surface triangle centers + normal direction
from scipy.spatial import cKDTree
orig=trimesh.Trimesh(vertices=m.vertices,faces=m.faces,process=False)
# A face from the original mesh lies in an original triangle plane. Closest original triangle centers supply candidates.
tree=cKDTree(orig.triangles_center)
def encode(s):
 mesh=s.to_mesh();v=np.array(mesh.vert_properties)[:,:3];f=np.array(mesh.tri_verts);tm=trimesh.Trimesh(vertices=v,faces=f,process=False)
 _,ids=tree.query(tm.triangles_center,k=12)
 normals=orig.face_normals[ids];dist=np.abs(np.sum((tm.triangles_center[:,None,:]-orig.triangles_center[ids])*normals,axis=2));parallel=np.abs(np.sum(tm.face_normals[:,None,:]*normals,axis=2))>.9999
 cap=~np.any((dist<.015)&parallel,axis=1)
 return {'v':v.tolist(),'f':f.tolist(),'cap':np.where(cap)[0].tolist(),'center':np.round(tm.center_mass,5).tolist(),'volume':round(s.volume(),3)}
records=[]
for pat in patterns:
 volume=sum(x['s'].volume() for x in pat['parts']);assert abs(volume-base.volume())<.05,(pat['id'],volume,base.volume())
 for part in pat['parts']:
  s=part.pop('s');assert s.status()==md.Error.NoError
  part['mesh']=encode(s)
 print(pat['id'],[(p['name'],len(p['mesh']['f'])) for p in pat['parts']])
 records.append(pat)
context=[]
for name in ['left-hip','sacrum']:
 mm=load(name);context.append({'name':name,'v':np.round(mm.vertices,5).tolist(),'f':mm.faces.tolist()})
(out/'anatomy.json').write_text(json.dumps({'patterns':records,'context':context},separators=(',',':')))


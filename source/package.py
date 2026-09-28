"""Create the lossless anatomy payload or standalone offline viewer."""
from pathlib import Path
import base64,gzip,json,sys
root=Path(__file__).resolve().parents[1]
if len(sys.argv)!=2 or sys.argv[1] not in ['pack','standalone']:
 raise SystemExit('Usage: python source/package.py pack|standalone')
if sys.argv[1]=='pack':
 packed=base64.b64encode(gzip.compress((root/'assets/anatomy.json').read_bytes(),compresslevel=9,mtime=0)).decode()
 (root/'assets/anatomy-packed.js').write_text('export default '+json.dumps(packed)+';\n')
else:
 html=(root/'index.html').read_text();js=(root/'app.bundle.js').read_text().replace('</script','<\\/script')
 photo=base64.b64encode((root/'assets/clamp-reference.jpg').read_bytes()).decode()
 html=html.replace('src="assets/clamp-reference.jpg"','src="data:image/jpeg;base64,'+photo+'"')
 html=html.replace('<script src="app.bundle.js"></script>','<!-- Three.js MIT license: '+(root/'assets/THREE-LICENSE.txt').read_text()+' -->\n<script>'+js+'</script>')
 out=root.parent/'pelvis-fracture-lab.html';out.write_text(html);print(out)

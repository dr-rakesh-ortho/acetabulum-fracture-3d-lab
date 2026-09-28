"""Build chunked anatomy modules for static hosting and browser repository upload."""
from pathlib import Path
import gzip,base64,json
root=Path(__file__).resolve().parents[1]
data=base64.b64encode(gzip.compress((root/'assets/anatomy.json').read_bytes(),compresslevel=9,mtime=0)).decode()
imports=[];names=[]
for i,start in enumerate(range(0,len(data),8_000_000)):
 name=f'part{i}';names.append(name);imports.append(f"import {name} from './anatomy-{i}.js';")
 (root/'assets'/f'anatomy-{i}.js').write_text('export default '+json.dumps(data[start:start+8_000_000])+';\n')
(root/'assets/anatomy-packed.js').write_text('\n'.join(imports)+'\nexport default '+' + '.join(names)+';\n')

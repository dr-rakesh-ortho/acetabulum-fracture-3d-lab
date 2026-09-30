# Model provenance and references

Mateo, RB; Brenan, K; Granite, G. “Pelvis Bone Set, Female.” Department of Surgery, Uniformed Services University of the Health Sciences, Bethesda, MD. Uploaded by MakerDoc20852.

NIH 3D accession 3DPX-014841, version 2; published March 6, 2023.
https://3d.nih.gov/entries/14841

License: Creative Commons Attribution–NonCommercial–ShareAlike 4.0.
https://creativecommons.org/licenses/by-nc-sa/4.0/
This anatomical adaptation is distributed under the same license. NIH hosting does not imply endorsement.

Downloaded September 29, 2026. Three input STL surfaces, submission 19464:

- right: https://3d.nih.gov/api/submissions/19464/files/input/422497
  Triangles: 149750; SHA-256: ff59fadd7506527334da5e3f39a644957ffd978b9a2ae874f560ae135140b708

- left: https://3d.nih.gov/api/submissions/19464/files/input/422509
  Triangles: 140364; SHA-256: 79832f3b81b6db08948205fb0dc337be1b34fc9178b1499ec077ed1c0832eefc

- sacrum: https://3d.nih.gov/api/submissions/19464/files/input/422502
  Triangles: 99592; SHA-256: 1c19c8822951f435182c47529c1b935c1f356183c8c405ee5fac442316fff5c4

Version 2 replaces painted fracture traces with Boolean-cut, capped fracture meshes. Original NIH surface shape and scale are retained. No anatomical sculpting, smoothing or decimation. Duplicate/degenerate faces and negligible-volume surface shells are cleaned before Boolean processing; the enclosed internal surface shells are retained. Display transform: x = source x, y = source z + 487, z = 28 - source y. Orientation inferred from anatomy, not verified DICOM metadata.

The source is an adult female pelvis. Lumbar vertebrae and femora are omitted. Fractures are representative geometric constructions, not patient-specific segmentations. Sacral and pelvic fragments are rigid closed meshes. Paired views, independent fragment transforms, fracture surfaces and intact reference follow the presentation approach of the prior Judet–Letournel lab; its acetabular fracture geometries are not reused.

Nakatani uses a 2.2-unit kerf only through the superior ramus, preserving inferior-ramus continuity. These examples have no independently movable ramus fragment. APC and selected Tile examples instead demonstrate joint disruption. Ligament markers remain schematic. No force, collision or soft-tissue model is implemented; reduction restores reference transforms only. No operative clamps are included.

Geometry and browser checks are recorded in geometry-checks.json and browser-checks.json. These are technical checks, not validation of clinical fracture morphology.

## Classification references

- Young–Burgess concepts: https://pmc.ncbi.nlm.nih.gov/articles/PMC4079881/
- Classic Tile / AO 2007 group descriptions: https://pmc.ncbi.nlm.nih.gov/articles/PMC9123096/
- Tile stability concepts: https://pmc.ncbi.nlm.nih.gov/articles/PMC4600881/
- Denis and combined sacral shapes: https://surgeryreference.aofoundation.org/orthopedic-trauma/adult-trauma/pelvic-ring/sacrum/definition
- AO Spine sacral morphology: https://surgeryreference.aofoundation.org/spine/trauma/sacrum/further-reading/aospine-classification
- AO Spine definitions and reliability: https://pmc.ncbi.nlm.nih.gov/articles/PMC7508295/
- Nakatani zones: https://pmc.ncbi.nlm.nih.gov/articles/PMC13433388/

Classification descriptions are teaching summaries. Classic Tile labels are not presented as equivalent to current AO/OTA codes. Neurological grades and modifiers are not assigned. No treatment recommendations are provided.

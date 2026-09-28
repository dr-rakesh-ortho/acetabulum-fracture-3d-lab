# Acetabulum Fracture 3D Lab

An interactive teaching prototype by Dr. Rakesh Kumar for understanding the Judet–Letournel acetabular fracture patterns from simultaneous external and intrapelvic views.

## Open the viewer

This repository is a static website. Serve its root directory with any static web server, for example:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open http://127.0.0.1:8000 in a modern browser with WebGL and DecompressionStream support. The anatomy loads locally from this repository; there is no analytics service or patient-data upload feature.

This repository is intended to remain private. Do not enable public static hosting to satisfy a no-model-download requirement: a browser-rendered static viewer necessarily receives the geometry. A future controlled-access viewer must authenticate viewers and render on the server, streaming images rather than distributing mesh assets. That service is not implemented in this repository.

## Features

- Ten constructed Judet–Letournel fracture examples, plus supplemental quadrilateral plate configurations.
- Simultaneous outside and inside views sharing fragment positions.
- Right anatomy and a labelled mirrored left teaching model.
- Approximate restricted modified Stoppa exposure, with a full medial-view toggle.
- A fixed SI-connected reference fragment; mobile fragments translate and rotate independently.
- Photo-based pointed clamp, schematic Jungbluth and Farabeuf clamps, bone hook, and optional Schanz screw joystick.
- Fragment-specific contact surfaces using the author's teaching rule: posterior wall, posterior column, transverse and hemitransverse components use outside contacts; other components use inside contacts.
- Saved poses, paired-view images, directed translation and guided geometric alignment.

## Suggested workflow

1. Select right or left, then the fracture pattern.
2. Select the mobile fragment. Read its indicated contact surface before placing instruments.
3. Choose an instrument and place fixed and mobile contacts, or use demo placement. Demo placement is a geometric illustration, not a prescribed surgical position.
4. For a Schanz screw, enable the joystick and choose an entry on the target fragment. The screw follows that fragment; rotation controls illustrate derotation.
5. Compare both views as the fragment moves. Remove the Stoppa cover to inspect concealed anatomy.

The transverse example leaves the pubic ramus and ischial spine intact in the inferior fragment. It is one illustrative configuration, not a representation of every clinical transverse fracture level.

## Limits

This is an unvalidated teaching prototype, not a medical device or a patient-specific planning system. Fracture cuts, instrument dimensions and exposure boundaries are constructed approximations. No independent anatomical or educational validation has been completed. It does not simulate surgical force, torque, collision, tissue resistance, cartilage, vessels or nerves. Guided alignment returns fragments to their stored reference poses and may demonstrate movements that are not surgically feasible.

The exposure is a projected visibility mask. The reference images depict the hip bone; they do not validate a sacral S1 exposure. The optional pelvic-ring context is an approximate placement of separately supplied bones. The left fracture model mirrors the right bone rather than using independent left fracture segmentation.

## Anatomy and third-party material

Reference anatomy: **NIH 3D 3DPX-015682, version 2**, *3D Models of the Male Pelvis with L4, L5 Vertebrae and Proximal Femur*, Weissbrod E, Jones E, Mateo RB, Department of Surgery, USUHS, Bethesda, MD. https://3d.nih.gov/entries/3DPX-015682

The source anatomical assets carry **CC BY-NC-SA 4.0**. Preserve attribution and the noncommercial/share-alike conditions for the anatomical assets and adaptations. See `assets/NIH-ATTRIBUTION.txt`. Modifications include topology cleanup, rigid display placement, constructed fracture cuts and mirrored left teaching anatomy. Source scale is retained.

Three.js and OrbitControls retain their MIT notice in `assets/THREE-LICENSE.txt`.

`assets/clamp-reference.jpg` is an author-supplied third-party instrument photograph used for shape comparison; no independent redistribution or sublicensing rights are asserted for that image. AO and journal illustrations supplied during development are not included. No blanket license is granted here over third-party material. No additional code license has been selected by the author.

## Build and checks

Python mesh-building dependencies are listed in `requirements.txt`. From the repository root:

```sh
python source/build_meshes.py
python source/check_meshes.py
python source/pack_web.py
npx esbuild app.js --bundle --format=esm --external:./assets/anatomy-packed.js --outfile=app.bundle.js
node source/check-reduction.mjs
```

The generated anatomy payload is divided into JavaScript modules below 8 MB each. `assets/anatomy.json` is regenerated from the included original STL files and is not committed. Mesh checks verify closed, consistently oriented, positive-volume single-component solids; the generator checks volume conservation. Reduction checks verify the fixed reference and target-only translation. These software checks do not establish anatomical or clinical validity.

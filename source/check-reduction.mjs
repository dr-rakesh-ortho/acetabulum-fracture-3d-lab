import assert from 'node:assert/strict';
import {directedStep,lockReference} from '../reduction-core.mjs';
const p=[{t:[0,0,0],r:[0,0,0]},{t:[-18,0,0],r:[0,25,8]},{t:[3,4,5],r:[1,2,3]}];
let q=p;for(let i=0;i<9;i++)q=directedStep(q,0,1,[1,0,0],2);
assert.deepEqual(q[0],p[0]);assert.deepEqual(q[2],p[2]);assert.deepEqual(q[1].t,[0,0,0]);assert.deepEqual(q[1].r,p[1].r);assert.equal(p[1].t[0],-18);
assert.throws(()=>directedStep(p,1,2,[1,0,0],2));assert.throws(()=>directedStep(p,0,0,[1,0,0],2));assert.throws(()=>directedStep(p,0,1,[0,0,0],2));assert.throws(()=>directedStep(p,0,1,[1,0,0],NaN));
assert.equal(directedStep(p,0,1,[-1,0,0],2)[1].t[0],-20);
assert.deepEqual(lockReference([{t:[1,2,3],r:[4,5,6]}])[0],p[0]);
console.log('PASS: fixed reference, target-only translation, direction, preserved rotation, invalid anchors and steps');

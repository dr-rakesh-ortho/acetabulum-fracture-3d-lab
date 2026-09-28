export function lockReference(poses){poses[0]={t:[0,0,0],r:[0,0,0]};return poses}
export function directedStep(poses,anchor,moving,direction,mm){
 if(anchor!==0||!Number.isInteger(moving)||moving<=0||moving>=poses.length)throw Error('Reduction requires a fixed SI anchor and a mobile target');
 if(!Number.isFinite(mm)||mm<=0||mm>10||direction.length!==3||direction.some(x=>!Number.isFinite(x)))throw Error('Step must be between 0 and 10 mm');
 const length=Math.hypot(...direction);if(length<1e-9)throw Error('Direction is undefined');
 const next=structuredClone(poses);lockReference(next);next[moving].t=next[moving].t.map((x,i)=>x+direction[i]/length*mm);return next;
}

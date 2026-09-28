// Author-specified teaching workflow, not a universal choice-of-approach rule.
export function placementSide(pattern, index) {
 const part=pattern.parts[index];
 if(!part||index===0)return null;
 if(part.role==='quadrilateral')return 'inside';
 if(['tr','trpw'].includes(pattern.baseId||pattern.id))return 'outside';
 return /posterior|hemitransverse/i.test(part.name)?'outside':'inside';
}

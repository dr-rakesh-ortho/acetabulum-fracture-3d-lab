// Approximate medial exposure footprint, mapped from the user's shaded reference.
// Coordinates are on the unchanged NIH model, in mm. Not patient-specific dissection.
export const exposureOutline = [
 [50,8,-35],[49,23,-28],[53,31,-15],[57,33,0],[53,28,16],
 [42,16,32],[29,-2,45],[14,-15,58],[5,-17,66],
 [5,-44,66],[16,-49,54],[28,-45,41],[40,-35,29],
 [48,-34,15],[53,-38,0],[48,-33,-15],[46,-18,-24],[50,-7,-35]
];
export function insideExposure(point,polygon){
 let inside=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j];
  if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }
 return inside;
}
export function maskPath(width,height,polygon){return `M0 0H${width}V${height}H0Z M`+polygon.map(p=>p.join(' ')).join('L')+'Z'}

import { getFishAsset, toAssetState } from './FishAssetRegistry.js';

function drawImageWhenReady(image,draw){
  if(image.complete&&image.naturalWidth){draw();return;}
  image.addEventListener('load',draw,{once:true});
}

export function drawFishCharacter(ctx,{x,y,size,type,direction=1,time=0,status='idle'}){
  const state=toAssetState(status),image=getFishAsset(type,state);
  if(!image.complete||!image.naturalWidth)return false;
  const phase=time*2.2+x*.012;
  const bob=Math.sin(phase)*size*.045;
  const happy=state==='happy',sleeping=state==='sleeping',surprised=state==='surprised',eating=state==='eating';
  const pulse=happy?1+Math.sin(time*7+x*.02)*.045:sleeping?1+Math.sin(time*2.1+x*.02)*.018:eating?1+Math.sin(time*9+x*.03)*.025:1;
  const tilt=surprised?Math.sin(time*18+x*.04)*.035:Math.sin(phase)*.012;
  const display=size*3.18;
  ctx.save();
  try{
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    ctx.translate(x,y+bob);ctx.rotate(tilt);ctx.scale(direction*pulse,pulse);
    ctx.drawImage(image,-display*.5,-display*.5,display,display);
    return true;
  }catch{
    return false;
  }finally{
    ctx.restore();
  }
}

export function drawFishAvatar(canvas,type){
  const ctx=canvas.getContext('2d'),image=getFishAsset(type,'avatar');
  const paint=()=>{const size=Math.min(canvas.width,canvas.height);ctx.clearRect(0,0,canvas.width,canvas.height);const halo=ctx.createRadialGradient(size*.5,size*.4,2,size*.5,size*.5,size*.55);halo.addColorStop(0,'#ffffff');halo.addColorStop(1,'#e8edff');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(size*.5,size*.5,size*.47,0,Math.PI*2);ctx.fill();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(image,0,0,canvas.width,canvas.height);};
  drawImageWhenReady(image,paint);
}

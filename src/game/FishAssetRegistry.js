const speciesIds={
  '小黄鱼':'yellow',
  '小蓝鱼':'blue',
  '小河豚':'puffer',
  '小鳐鱼':'ray',
  '小白鱼':'white'
};

const states=new Set(['idle','happy','surprised','sleeping','eating','avatar']);
const cache=new Map();
const fishAssets=import.meta.glob('../assets/fish/*/*.png',{eager:true,import:'default',query:'?url'});

export function toAssetState(state='idle'){
  return ({surprise:'surprised',sleep:'sleeping',eat:'eating'})[state]||state;
}

export function getFishAsset(type,state='idle'){
  const species=speciesIds[type]||'yellow';
  const frame=states.has(toAssetState(state))?toAssetState(state):'idle';
  const key=`${species}/${frame}`;
  if(!cache.has(key)){
    const image=new Image();
    image.decoding='async';
    image.src=fishAssets[`../assets/fish/${species}/${frame}.png`];
    cache.set(key,image);
  }
  return cache.get(key);
}

export function preloadFishAssets(){
  Object.keys(speciesIds).forEach(type=>['idle','happy','surprised','sleeping','eating','avatar'].forEach(state=>getFishAsset(type,state)));
}

export const fishAssetInfo=Object.freeze({speciesIds,states:['idle','happy','surprised','sleeping','eating','avatar']});

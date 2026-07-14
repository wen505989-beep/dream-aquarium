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

function waitForImage(image){
  if(image.complete)return image.naturalWidth?Promise.resolve():Promise.reject(new Error('Fish image failed to load'));
  return new Promise((resolve,reject)=>{
    image.addEventListener('load',resolve,{once:true});
    image.addEventListener('error',()=>reject(new Error('Fish image failed to load')),{once:true});
  });
}

export function preloadFishAssets(types=Object.keys(speciesIds)){
  const uniqueTypes=[...new Set(types.filter(type=>speciesIds[type]))];
  return Promise.all(uniqueTypes.flatMap(type=>['idle','eating'].map(state=>waitForImage(getFishAsset(type,state)))));
}

export const fishAssetInfo=Object.freeze({speciesIds,states:['idle','happy','surprised','sleeping','eating','avatar']});

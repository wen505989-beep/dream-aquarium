import { SaveManager } from './storage/SaveManager.js';
import { AudioManager } from './audio/AudioManager.js';
import { Aquarium } from './game/Aquarium.js';
import { UIManager } from './ui/UIManager.js';
import { preloadFishAssets } from './game/FishAssetRegistry.js';

const save=new SaveManager();
const state=save.load();
const audio=new AudioManager(state.sound);
const loading=document.querySelector('#loading-screen');
let ui;

async function start(){
  try{
    await preloadFishAssets(state.fish.map(fish=>fish.type));
    const aquarium=new Aquarium(document.querySelector('#aquarium'),state,audio,text=>ui?.notice(text),()=>ui?.persist());
    ui=new UIManager(state,save,audio,aquarium);
    if(state.wasAway)ui.notice('小鱼有点想你，不过它们一直在等你回来。');
    setInterval(()=>ui.persist(),15000);
    window.addEventListener('beforeunload',()=>ui.persist());
    loading.hidden=true;
  }catch{
    loading.querySelector('b').textContent='小鱼准备失败';
    loading.querySelector('small').textContent='请检查网络后刷新页面重试';
  }
}

start();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>{}));

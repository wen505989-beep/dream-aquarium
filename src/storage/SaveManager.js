const KEY = 'dream-aquarium-save-v1';
const fish = (id, type, name, x, y) => ({ id, type, name, x, y, vx:0, vy:0, hunger:76, mood:78, bond:12, energy:85, behavior:'悠闲巡游', target:null, direction:1, pettedAt:0, puff:0 });
export const defaultState = () => ({
  version:1, tankName:'梦光水族箱', background:'coral', light:'day', flow:'low', sound:false, reducedMotion:false,
  decorations:{ redCoral:true, yellowCoral:false, bluePlant:true, greenPlant:false, cave:false, shell:true, star:false, ship:false, crystal:false },
  lastOpen:Date.now(), unlocks:[],
  fish:[fish('sunny','小黄鱼','柚子',.26,.35),fish('mizu','小蓝鱼','小澜',.70,.47),fish('puff','小河豚','泡泡',.50,.62),fish('ray','小鳐鱼','小翼',.36,.82),fish('snow','小白鱼','雪团',.77,.28)]
});
export class SaveManager {
  load() { try { const saved=JSON.parse(localStorage.getItem(KEY)); return saved?.version ? this.applyOffline(saved) : defaultState(); } catch { return defaultState(); } }
  applyOffline(state) { const hours=Math.min(24*30,Math.max(0,(Date.now()-(state.lastOpen||Date.now()))/36e5)); state.fish.forEach(f=>{ f.hunger=Math.max(35,f.hunger-hours*.55); f.mood=Math.max(52,f.mood-hours*.13); f.energy=Math.min(100,f.energy+hours*.5); }); state.wasAway=hours>2; return state; }
  save(state) { try { localStorage.setItem(KEY,JSON.stringify({...state,lastOpen:Date.now(),fish:state.fish.map(f=>f.toSave ? f.toSave():f)})); } catch(e) { console.warn('保存失败',e); } }
  reset() { localStorage.removeItem(KEY); return defaultState(); }
}

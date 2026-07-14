const points = { plant:[.18,.65], coral:[.75,.72], bottom:[.45,.83] };
export function chooseBehavior(fish, world) {
  const roll=Math.random();
  if(fish.type==='小蓝鱼' && roll<.48) return {name:'靠近水草',target:{x:.18+Math.random()*.18,y:.42+Math.random()*.28}};
  if(fish.type==='小鳐鱼') return {name:'贴着沙地滑行',target:{x:.15+Math.random()*.7,y:.72+Math.random()*.16}};
  if(roll<.14) return {name:'短暂休息',target:{x:fish.x,y:fish.y},rest:2+Math.random()*3};
  if(roll<.29) return {name:'靠近珊瑚',target:{x:.62+Math.random()*.2,y:.55+Math.random()*.22}};
  if(roll<.40 && world.fish.length>1) { const mate=world.fish.find(f=>f!==fish); if(mate)return {name:'一起游',target:{x:mate.x+(Math.random()-.5)*.1,y:mate.y+(Math.random()-.5)*.1}}; }
  return {name:'悠闲巡游',target:{x:.12+Math.random()*.76,y:.17+Math.random()*.58}};
}
export function clampTarget(t){return {x:Math.max(.08,Math.min(.92,t.x)),y:Math.max(.13,Math.min(.87,t.y))};}

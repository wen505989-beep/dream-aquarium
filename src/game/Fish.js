import { chooseBehavior, clampTarget } from './FishAI.js';
import { drawFishCharacter } from './FishRenderer.js';
const profiles={
  '小黄鱼':{color:'#ffe66d',accent:'#ffb85d',speed:.13,size:.055,eye:'#28305f'},
  '小蓝鱼':{color:'#72d9ff',accent:'#5478df',speed:.08,size:.052,eye:'#172a65'},
  '小河豚':{color:'#ffd56c',accent:'#f19967',speed:.075,size:.052,eye:'#342758'},
  '小鳐鱼':{color:'#a89af5',accent:'#6760bd',speed:.055,size:.075,eye:'#202052'},
  '小白鱼':{color:'#f5fbff',accent:'#b7c8f7',speed:.115,size:.046,eye:'#344070'}
};
export class Fish {
  constructor(data){Object.assign(this,data);this.profile=profiles[this.type];this.x??=.5;this.y??=.5;this.vx??=0;this.vy??=0;this.direction??=1;this.behavior??='悠闲巡游';this.target=this.target||null;this.decision=0;this.look=0;this.petting=0;this.flee=0;this.puff=this.puff||0;this.puffClicks=[];this.sleep=0;}
  toSave(){return {id:this.id,type:this.type,name:this.name,x:this.x,y:this.y,vx:this.vx,vy:this.vy,hunger:this.hunger,mood:this.mood,bond:this.bond,energy:this.energy,behavior:this.behavior,direction:this.direction,puff:this.puff};}
  get radius(){return this.profile.size*(this.type==='小河豚'?(1+this.puff*.42):1);}
  setTarget(target,name='观察你'){this.target=clampTarget(target);this.behavior=name;this.decision=0;}
  scare(from){const dx=this.x-from.x,dy=this.y-from.y,len=Math.hypot(dx,dy)||1;this.target=clampTarget({x:this.x+dx/len*.28,y:this.y+dy/len*.2});this.behavior='受到惊吓';this.flee=.75;this.decision=0;}
  interact(point,particles){this.look=.8; if(this.type==='小河豚'){this.puffClicks.push(performance.now());this.puffClicks=this.puffClicks.filter(t=>performance.now()-t<950);if(this.puffClicks.length>=2){this.puff=1;this.behavior='鼓成一团';particles.spawn(this.x,this.y,'spark',5);return '泡泡鼓成圆滚滚的样子！';}} if(this.type==='小白鱼'){this.scare(point);return '雪团害羞地躲开了。';} if(this.bond>38){this.setTarget(point,'开心靠近你');particles.spawn(this.x,this.y,'heart',3);return `${this.name} 想靠近你的手指。`;} this.setTarget(point,'好奇地看着你');return `${this.name} 转头看向了你。`;}
  pet(particles){if(this.petting>0)return false;this.petting=.75;this.mood=Math.min(100,this.mood+2);this.bond=Math.min(100,this.bond+.7);this.behavior='享受抚摸';particles.spawn(this.x,this.y,'heart',3);return true;}
  update(dt,world){
    this.decision-=dt; this.look=Math.max(0,this.look-dt);this.petting=Math.max(0,this.petting-dt);this.flee=Math.max(0,this.flee-dt);this.puff=Math.max(0,this.puff-dt*.23);
    const food=world.foods.find(fd=>!fd.dead); if(food && this.hunger<94 && Math.hypot(food.x-this.x,food.y-this.y)<.48){this.target={x:food.x,y:food.y};this.behavior='追逐食物';}
    else if(this.decision<=0 && !this.petting && !this.flee){const choice=chooseBehavior(this,world);this.target=choice.target;this.behavior=choice.name;this.decision=2.3+Math.random()*4;}
    if(!this.target)this.target={x:this.x,y:this.y};
    const dx=this.target.x-this.x,dy=this.target.y-this.y,d=Math.hypot(dx,dy); if(d<.025 && this.behavior!=='追逐食物')this.decision=0;
    let speed=this.profile.speed*(this.behavior==='短暂休息'?.18:1)*(this.flee?2.25:1)*(world.flow===3?1.14:world.flow===2?1.06:1);
    if(this.energy<20)speed*=.68; const ux=d?dx/d:0,uy=d?dy/d:0; const flowPush=(world.flow-1)*.005;
    const desiredX=ux*speed+flowPush,desiredY=uy*speed; const smooth=Math.min(1,dt*2.8);this.vx+=(desiredX-this.vx)*smooth;this.vy+=(desiredY-this.vy)*smooth;
    const margin=this.radius*1.25; if(this.x<margin)this.vx+=dt*.35;if(this.x>1-margin)this.vx-=dt*.35;if(this.y<.11+margin)this.vy+=dt*.35;if(this.y> .9-margin)this.vy-=dt*.35;
    this.x+=this.vx*dt;this.y+=this.vy*dt;this.x=Math.max(margin,Math.min(1-margin,this.x));this.y=Math.max(.12+margin,Math.min(.91-margin,this.y)); if(Math.abs(this.vx)>.002)this.direction=this.vx>=0?1:-1;
    if(food && !food.dead && Math.hypot(food.x-this.x,food.y-this.y)<this.radius*1.75){food.dead=true;this.hunger=Math.min(100,this.hunger+13);this.mood=Math.min(100,this.mood+7);this.energy=Math.min(100,this.energy+3);this.behavior='吃到美味食物';world.onEat(this);}
    this.hunger=Math.max(28,this.hunger-dt*.018);this.mood=Math.max(40,this.mood-dt*.004);this.energy=Math.max(25,Math.min(100,this.energy+(this.behavior==='短暂休息'?dt*.8:-dt*.008)));
  }
  hit(point){return Math.hypot(point.x-this.x,(point.y-this.y)*1.15)<this.radius*1.18;}
  draw(ctx,w,h,time){const x=this.x*w,y=this.y*h,r=this.radius*w,dir=this.direction;const status=this.flee?'surprise':this.petting>0||this.mood>92?'happy':this.behavior?.includes('睡')?'sleep':this.behavior?.includes('吃')?'eat':'idle';if(drawFishCharacter(ctx,{x,y,size:r,type:this.type,direction:dir,time,status,puff:this.puff}))return;ctx.save();ctx.translate(x,y);ctx.scale(dir,1);const wiggle=Math.sin(time*6+this.y*8)*r*.12;
    ctx.save();ctx.globalAlpha=.28;ctx.fillStyle='#101557';ctx.beginPath();ctx.ellipse(-r*.1,r*.68,r*.95,r*.14,0,0,Math.PI*2);ctx.fill();ctx.restore();
    if(this.type==='小鳐鱼'){ctx.fillStyle=this.profile.color;ctx.beginPath();ctx.moveTo(-r*1.05,0);ctx.quadraticCurveTo(-r*.2,-r*.9,r*.9,-r*.35);ctx.quadraticCurveTo(r*1.15,0,r*.9,r*.35);ctx.quadraticCurveTo(-r*.2,r*.9,-r*1.05,0);ctx.fill();ctx.strokeStyle=this.profile.accent;ctx.lineWidth=r*.1;ctx.beginPath();ctx.moveTo(-r*.8,0);ctx.quadraticCurveTo(-r*1.45,Math.sin(time*5)*r*.4,-r*1.65,Math.sin(time*5)*r*.5);ctx.stroke();ctx.fillStyle=this.profile.eye;ctx.beginPath();ctx.arc(r*.35,-r*.08,r*.095,0,7);ctx.arc(r*.64,-r*.08,r*.095,0,7);ctx.fill();ctx.strokeStyle=this.profile.eye;ctx.lineWidth=r*.06;ctx.beginPath();ctx.arc(r*.5,r*.15,r*.16,0,Math.PI);ctx.stroke();ctx.restore();return;}
    ctx.fillStyle=this.profile.accent;ctx.beginPath();ctx.moveTo(-r*.72,0);ctx.lineTo(-r*1.35,-r*.62+wiggle);ctx.lineTo(-r*1.26,r*.62+wiggle);ctx.closePath();ctx.fill();
    ctx.fillStyle=this.profile.color;ctx.beginPath();ctx.ellipse(0,0,r*(this.type==='小河豚'?1:1.12),r*.7,0,0,Math.PI*2);ctx.fill(); if(this.type==='小河豚'&&this.puff>.1){ctx.strokeStyle='#eb965b';ctx.lineWidth=Math.max(1,r*.07);for(let i=0;i<7;i++){const a=i/7*Math.PI*2;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*1.02,Math.sin(a)*r*.62);ctx.lineTo(Math.cos(a)*r*1.28,Math.sin(a)*r*.8);ctx.stroke();}}
    ctx.fillStyle=this.profile.eye;ctx.beginPath();ctx.arc(r*.38,-r*.17,r*.12,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(r*.42,-r*.21,r*.038,0,7);ctx.fill();ctx.strokeStyle=this.profile.eye;ctx.lineWidth=Math.max(1,r*.045);ctx.beginPath();ctx.arc(r*.44,r*.16,r*.17,0,Math.PI);ctx.stroke(); if(this.petting>0){ctx.fillStyle='#ff98b9';ctx.beginPath();ctx.arc(r*.18,r*.2,r*.09,0,7);ctx.fill();}ctx.restore(); }
}

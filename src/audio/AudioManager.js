export class AudioManager {
  constructor(enabled=false){ this.enabled=enabled; this.ctx=null; this.ambientTimer=null; }
  setEnabled(value){ this.enabled=value; if(value){ this.ensure(); this.ambient(); } else this.stopAmbient(); }
  ensure(){ if(!this.ctx) this.ctx=new AudioContext(); if(this.ctx.state==='suspended') this.ctx.resume(); }
  tone(freq=440,duration=.08,type='sine',volume=.025,slide=0){ if(!this.enabled)return; this.ensure(); const o=this.ctx.createOscillator(),g=this.ctx.createGain(); o.type=type;o.frequency.setValueAtTime(freq,this.ctx.currentTime);if(slide)o.frequency.linearRampToValueAtTime(freq+slide,this.ctx.currentTime+duration);g.gain.setValueAtTime(volume,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+duration);o.connect(g).connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+duration); }
  click(){this.tone(620,.05,'triangle',.022,80)} feed(){this.tone(300,.14,'sine',.03,160)} happy(){this.tone(650,.1,'sine',.025,220)} bubble(){this.tone(260,.07,'sine',.012,120)} ripple(){this.tone(175,.13,'sine',.018,95);setTimeout(()=>this.tone(390,.09,'sine',.012,-80),45)}
  ambient(){ this.stopAmbient(); if(!this.enabled)return; this.ambientTimer=setInterval(()=>this.bubble(),4800); }
  stopAmbient(){if(this.ambientTimer)clearInterval(this.ambientTimer);this.ambientTimer=null;}
}

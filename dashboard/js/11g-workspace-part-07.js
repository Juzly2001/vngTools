// ==========================================================================
// SCENE V10 — FINAL ACTIVE EFFECTS PASS
// Canvas-only. Static landscape is cached; only lightweight atmosphere moves.
// ==========================================================================

let v10Fx = [];
let v10SceneName = '';
let v10LastSize = '';
let v10Wind = 0;
let v10Flash = 0;

function v10Rand(min=0,max=1){ return min + Math.random()*(max-min); }
function v10Wrap(v,min,max){ const d=max-min; return ((v-min)%d+d)%d+min; }

function v10ResetFx(){
  if(!canvas) return;
  const w=canvas._cssW||innerWidth, h=canvas._cssH||innerHeight;
  const s=getThemeMeta().scene;
  v10Fx=[];
  v10SceneName=s; v10LastSize=`${w}x${h}`;
  const q=Math.max(.42,FX_QUALITY);

  const add=(n,maker)=>{
    n=Math.max(1,Math.round(n*q));
    for(let i=0;i<n;i++)v10Fx.push(maker(i));
  };

  if(s==='night'||s==='midnight'){
    add(78,()=>({kind:'star',x:v10Rand(0,w),y:v10Rand(0,h*.66),r:v10Rand(.45,1.55),a:v10Rand(.28,.88),tw:v10Rand(.7,2.3),p:v10Rand(0,6.283)}));
    add(3,()=>({kind:'shoot',x:v10Rand(w*.25,w*.95),y:v10Rand(-h*.15,h*.30),vx:v10Rand(-3.2,-1.9),vy:v10Rand(2.0,3.1),life:v10Rand(-180,60),max:95}));
    add(12,()=>({kind:'water',x:v10Rand(w*.55,w*.91),y:v10Rand(h*.76,h*.98),len:v10Rand(14,50),a:v10Rand(.025,.10),p:v10Rand(0,6.283)}));
  } else if(s==='oled'){
    add(42,()=>({kind:'star',x:v10Rand(0,w),y:v10Rand(0,h*.70),r:v10Rand(.35,1.2),a:v10Rand(.16,.62),tw:v10Rand(.6,1.8),p:v10Rand(0,6.283)}));
    add(4,(_,)=>({kind:'aurora',x:v10Rand(-w*.2,w*.9),y:v10Rand(h*.20,h*.60),w:v10Rand(w*.20,w*.42),h:v10Rand(45,105),p:v10Rand(0,6.283),a:v10Rand(.025,.065)}));
  } else if(s==='forest'){
    add(34,()=>({kind:'firefly',x:v10Rand(0,w),y:v10Rand(h*.30,h*.95),r:v10Rand(.8,1.8),a:v10Rand(.26,.78),p:v10Rand(0,6.283),vx:v10Rand(-.10,.10),vy:v10Rand(-.05,.05)}));
    add(6,()=>({kind:'mist',x:v10Rand(-w*.25,w),y:v10Rand(h*.44,h*.75),rx:v10Rand(w*.16,w*.30),ry:v10Rand(18,46),vx:v10Rand(.06,.16),a:v10Rand(.018,.050),p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'leafspeck',x:v10Rand(0,w),y:v10Rand(0,h),r:v10Rand(.4,1.1),a:v10Rand(.03,.10),vx:v10Rand(.02,.08),vy:v10Rand(.02,.07),p:v10Rand(0,6.283)}));
  } else if(s==='ocean'){
    add(24,()=>({kind:'bubble',x:v10Rand(0,w),y:v10Rand(h*.30,h*1.04),r:v10Rand(1.5,6.5),a:v10Rand(.08,.24),vy:v10Rand(-.22,-.08),p:v10Rand(0,6.283)}));
    add(24,(_,)=>({kind:'fish',x:v10Rand(-w*.15,w*1.10),y:v10Rand(h*.24,h*.76),s:v10Rand(.38,.95),dir:Math.random()>.5?1:-1,v:v10Rand(.24,.72),a:v10Rand(.20,.48),p:v10Rand(0,6.283),tone:Math.floor(v10Rand(0,5))}));
    add(5,()=>({kind:'ray',x:v10Rand(-w*.1,w*.9),p:v10Rand(0,6.283),a:v10Rand(.012,.032)}));
  } else if(s==='coffee'){
    add(52,()=>({kind:'rain',x:v10Rand(w*.04,w*.94),y:v10Rand(h*.07,h*.57),len:v10Rand(8,28),v:v10Rand(.45,1.1),a:v10Rand(.035,.12),p:v10Rand(0,6.283)}));
    add(10,()=>({kind:'steam',x:v10Rand(w*.12,w*.90),y:v10Rand(h*.60,h*.90),r:v10Rand(8,18),a:v10Rand(.018,.050),vy:v10Rand(-.05,-.025),p:v10Rand(0,6.283)}));
    add(9,()=>({kind:'lamp',x:v10Rand(.08,.92),p:v10Rand(0,6.283),a:v10Rand(.025,.065)}));
  } else if(s==='sakura'){
    add(32,()=>({kind:'petal',x:v10Rand(-40,w),y:v10Rand(-h*.2,h),r:v10Rand(2.0,4.2),a:v10Rand(.30,.68),vx:v10Rand(.24,.68),vy:v10Rand(.16,.40),rot:v10Rand(0,6.283),vr:v10Rand(-.025,.025),p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'lantern',x:v10Rand(.14,.86),y:v10Rand(.58,.94),p:v10Rand(0,6.283),a:v10Rand(.025,.08)}));
    add(8,()=>({kind:'moonDust',x:v10Rand(0,w),y:v10Rand(0,h*.55),r:v10Rand(.4,1.1),a:v10Rand(.04,.12),p:v10Rand(0,6.283)}));
  } else if(s==='cyber'||s==='terminal'){
    const terminal=s==='terminal';
    add(58,()=>({kind:'window',x:v10Rand(0,w),y:v10Rand(h*.25,h*.74),r:v10Rand(1.1,2.3),a:v10Rand(.12,.46),p:v10Rand(0,6.283),terminal}));
    add(18,()=>({kind:'traffic',x:v10Rand(-w*.1,w*1.1),y:v10Rand(h*.78,h*.97),len:v10Rand(12,50),v:v10Rand(.45,1.3),a:v10Rand(.06,.18),dir:Math.random()>.5?1:-1,terminal,p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'neonDust',x:v10Rand(0,w),y:v10Rand(0,h),r:v10Rand(.5,1.5),a:v10Rand(.04,.13),vy:v10Rand(.01,.05),p:v10Rand(0,6.283),terminal}));
  } else if(s==='grape'){
    add(18,()=>({kind:'duskDust',x:v10Rand(0,w),y:v10Rand(h*.28,h*.90),r:v10Rand(.7,1.8),a:v10Rand(.035,.12),vx:v10Rand(-.025,.04),vy:v10Rand(-.018,.018),p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'fireflyPurple',x:v10Rand(0,w),y:v10Rand(h*.45,h*.92),r:v10Rand(.7,1.4),a:v10Rand(.10,.35),p:v10Rand(0,6.283),vx:v10Rand(-.05,.05),vy:v10Rand(-.025,.025)}));
  } else if(s==='day'||s==='sky'||s==='meadow'||s==='sunset'){
    add(s==='sky'?11:7,()=>({kind:'cloud',x:v10Rand(-180,w),y:v10Rand(30,h*(s==='sunset'?.42:.35)),sc:v10Rand(.55,1.18),a:v10Rand(.09,.22),v:v10Rand(.050,.125),p:v10Rand(0,6.283)}));
    add(10,()=>({kind:'bird',x:v10Rand(-60,w),y:v10Rand(h*.16,h*.50),s:v10Rand(.45,1.0),v:v10Rand(.12,.30),a:v10Rand(.10,.28),p:v10Rand(0,6.283)}));
    if(s==='meadow')add(18,()=>({kind:'pollen',x:v10Rand(0,w),y:v10Rand(h*.48,h*.98),r:v10Rand(.5,1.4),a:v10Rand(.04,.13),vx:v10Rand(.015,.065),vy:v10Rand(-.025,.015),p:v10Rand(0,6.283)}));
    if(s==='sunset')add(14,()=>({kind:'goldDust',x:v10Rand(0,w),y:v10Rand(h*.36,h*.92),r:v10Rand(.6,1.4),a:v10Rand(.03,.10),vx:v10Rand(.01,.045),vy:v10Rand(-.02,.01),p:v10Rand(0,6.283)}));
  }
}

function v10Fish(ctx,p,t){
  const colors=['#b9c9b7','#d4b67d','#8eb7bf','#c88d72','#9dc8c0'];
  const col=colors[p.tone%colors.length];
  const wag=Math.sin(t*3+p.p)*1.7*p.s;
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.dir,1);ctx.globalAlpha=p.a;
  ctx.fillStyle=col;
  ctx.beginPath();ctx.ellipse(0,0,9*p.s,4*p.s,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(-8*p.s,0);ctx.lineTo(-15*p.s,-6*p.s+wag);ctx.lineTo(-14*p.s,6*p.s+wag);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(238,248,248,.65)';ctx.beginPath();ctx.arc(4*p.s,-1*p.s,.7*p.s,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function v10DrawFx(w,h,s,t,dt){
  v10Wind=Math.sin(t*.22)*.5;

  for(const p of v10Fx){
    ctx.save();

    if(p.kind==='star'){
      const tw=.55+.45*Math.sin(t*p.tw+p.p);
      ctx.globalAlpha=p.a*(.52+.48*tw);
      ctx.fillStyle='#eef7ff';ctx.beginPath();ctx.arc(p.x,p.y,p.r*(.85+tw*.15),0,6.283);ctx.fill();
    }
    else if(p.kind==='shoot'){
      p.life+=dt*60;
      if(p.life>p.max){p.life=v10Rand(-240,-30);p.x=v10Rand(w*.25,w*1.05);p.y=v10Rand(-h*.10,h*.25);}
      if(p.life>0){
        const a=Math.sin(Math.min(1,p.life/18)*Math.PI)*.34;
        ctx.globalAlpha=Math.max(.02,a);ctx.strokeStyle='#dcecff';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*13,p.y-p.vy*13);ctx.stroke();
        p.x+=p.vx;p.y+=p.vy;
      }
    }
    else if(p.kind==='water'){
      ctx.globalAlpha=p.a*(.55+.45*Math.sin(t*1.2+p.p));
      ctx.strokeStyle='#bed7ee';ctx.lineWidth=.7;
      ctx.beginPath();ctx.moveTo(p.x-p.len/2,p.y);ctx.lineTo(p.x+p.len/2,p.y);ctx.stroke();
    }
    else if(p.kind==='aurora'){
      const yy=p.y+Math.sin(t*.35+p.p)*12;
      const gr=ctx.createLinearGradient(p.x,yy,p.x+p.w,yy+p.h);
      gr.addColorStop(0,'rgba(0,255,116,0)');
      gr.addColorStop(.5,`rgba(50,255,135,${p.a*(.7+.3*Math.sin(t*.55+p.p))})`);
      gr.addColorStop(1,'rgba(89,100,255,0)');
      ctx.fillStyle=gr;ctx.filter='blur(16px)';
      ctx.beginPath();ctx.ellipse(p.x+p.w*.5,yy,p.w*.5,p.h*.5,.15*Math.sin(t*.2+p.p),0,6.283);ctx.fill();
    }
    else if(p.kind==='firefly'||p.kind==='fireflyPurple'){
      const purple=p.kind==='fireflyPurple';
      const pulse=.45+.55*(.5+.5*Math.sin(t*1.8+p.p));
      ctx.globalAlpha=p.a*pulse;ctx.shadowBlur=10;
      ctx.shadowColor=purple?'#d8b4fe':'#d9f99d';ctx.fillStyle=purple?'#ead8ff':'#edffb8';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
      p.x+=p.vx+Math.sin(t+p.p)*.025;p.y+=p.vy+Math.cos(t*.7+p.p)*.018;
      p.x=v10Wrap(p.x,-10,w+10);p.y=v10Wrap(p.y,h*.28,h*.98);
    }
    else if(p.kind==='mist'){
      p.x+=p.vx;
      if(p.x-p.rx>w)p.x=-p.rx;
      ctx.globalAlpha=p.a*(.78+.22*Math.sin(t*.35+p.p));
      ctx.fillStyle='#dbe7e1';ctx.filter='blur(20px)';
      ctx.beginPath();ctx.ellipse(p.x,p.y+Math.sin(t*.22+p.p)*5,p.rx,p.ry,0,0,6.283);ctx.fill();
    }
    else if(p.kind==='leafspeck'||p.kind==='pollen'||p.kind==='goldDust'||p.kind==='duskDust'){
      const gold=p.kind==='goldDust', purple=p.kind==='duskDust';
      ctx.globalAlpha=p.a*(.65+.35*Math.sin(t+p.p));
      ctx.fillStyle=gold?'#ffd59a':purple?'#e6c6da':'#eef3d4';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
      p.x+=p.vx+v10Wind*.01;p.y+=p.vy+Math.sin(t*.6+p.p)*.01;
      if(p.x>w+5)p.x=-5;if(p.y<-5)p.y=h+5;if(p.y>h+5)p.y=-5;
    }
    else if(p.kind==='bubble'){
      ctx.globalAlpha=p.a;ctx.strokeStyle='#d6fbff';ctx.lineWidth=.8;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.stroke();
      p.y+=p.vy;p.x+=Math.sin(t+p.p)*.025;
      if(p.y<-10){p.y=h+10;p.x=v10Rand(0,w);}
    }
    else if(p.kind==='fish'){
      v10Fish(ctx,p,t);
      p.x+=p.v*p.dir;p.y+=Math.sin(t*.9+p.p)*.035;
      if(p.dir>0&&p.x>w+40)p.x=-45;if(p.dir<0&&p.x<-45)p.x=w+45;
    }
    else if(p.kind==='ray'){
      const xx=p.x+Math.sin(t*.18+p.p)*35;
      ctx.globalAlpha=p.a*(.7+.3*Math.sin(t*.5+p.p));ctx.fillStyle='#d7fbff';
      ctx.beginPath();ctx.moveTo(xx,0);ctx.lineTo(xx+55,0);ctx.lineTo(xx+215,h*.83);ctx.lineTo(xx+110,h*.83);ctx.closePath();ctx.fill();
    }
    else if(p.kind==='rain'){
      p.y+=p.v;
      if(p.y>h*.58){p.y=h*.07;p.x=v10Rand(w*.04,w*.94);}
      ctx.globalAlpha=p.a;ctx.strokeStyle='#d9e7e8';ctx.lineWidth=.65;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-2,p.y+p.len);ctx.stroke();
    }
    else if(p.kind==='steam'){
      p.y+=p.vy;
      if(p.y<h*.52){p.y=v10Rand(h*.68,h*.89);p.x=v10Rand(w*.08,w*.92);}
      ctx.globalAlpha=p.a*(.65+.35*Math.sin(t*.8+p.p));ctx.fillStyle='#fff1df';ctx.filter='blur(7px)';
      ctx.beginPath();ctx.ellipse(p.x+Math.sin(t+p.p)*5,p.y,p.r*.45,p.r,0,0,6.283);ctx.fill();
    }
    else if(p.kind==='lamp'){
      const x=w*p.x;
      const y=h*(.18+(Math.floor(p.x*10)%2)*.025);
      const gr=ctx.createRadialGradient(x,y,2,x,y,80);
      gr.addColorStop(0,`rgba(255,190,105,${p.a*(.72+.28*Math.sin(t*.8+p.p))})`);gr.addColorStop(1,'rgba(255,190,105,0)');
      ctx.fillStyle=gr;ctx.fillRect(x-80,y-80,160,160);
    }
    else if(p.kind==='petal'){
      ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=p.a;ctx.fillStyle='#ec8fa9';
      ctx.beginPath();ctx.ellipse(0,0,p.r*.55,p.r*1.15,0,0,6.283);ctx.fill();
      p.x+=p.vx+Math.sin(t*1.2+p.p)*.08;p.y+=p.vy;p.rot+=p.vr;
      if(p.y>h+15||p.x>w+25){p.y=-15;p.x=v10Rand(-60,w*.75);}
    }
    else if(p.kind==='lantern'){
      const x=w*p.x,y=h*p.y;
      const gr=ctx.createRadialGradient(x,y,1,x,y,34);
      gr.addColorStop(0,`rgba(255,170,85,${p.a*(.65+.35*Math.sin(t*1.4+p.p))})`);gr.addColorStop(1,'rgba(255,170,85,0)');
      ctx.fillStyle=gr;ctx.fillRect(x-35,y-35,70,70);
    }
    else if(p.kind==='moonDust'){
      ctx.globalAlpha=p.a*(.5+.5*Math.sin(t*.8+p.p));ctx.fillStyle='#efe7ff';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
    }
    else if(p.kind==='window'){
      const pulse=.35+.65*(.5+.5*Math.sin(t*v10Rand(.45,.95)+p.p));
      ctx.globalAlpha=p.a*pulse;
      ctx.fillStyle=p.terminal?'#6cff9b':(Math.sin(p.p)>0?'#54e6ff':'#ff63d9');
      ctx.fillRect(p.x,p.y,p.r*1.6,p.r*2.2);
    }
    else if(p.kind==='traffic'){
      p.x+=p.v*p.dir;
      if(p.dir>0&&p.x>w+60)p.x=-60;if(p.dir<0&&p.x<-60)p.x=w+60;
      ctx.globalAlpha=p.a;ctx.strokeStyle=p.terminal?'#46f77d':(Math.sin(p.p)>0?'#4de7ff':'#ff4ecb');
      ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.len*p.dir,p.y+1.5);ctx.stroke();
    }
    else if(p.kind==='neonDust'){
      ctx.globalAlpha=p.a*(.55+.45*Math.sin(t+p.p));ctx.fillStyle=p.terminal?'#66ff9a':'#91efff';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.y+=p.vy;if(p.y>h+5){p.y=-5;p.x=v10Rand(0,w);}
    }
    else if(p.kind==='cloud'){
      cloud(ctx,p.x,p.y,p.sc,p.a,'255,255,255');p.x+=p.v;
      if(p.x>w+180)p.x=-180;
    }
    else if(p.kind==='bird'){
      p.x+=p.v;if(p.x>w+50){p.x=-50;p.y=v10Rand(h*.14,h*.48);}
      const flap=Math.sin(t*4+p.p)*2.2*p.s;
      ctx.globalAlpha=p.a;ctx.strokeStyle=s==='sunset'?'#2c2730':'#48636a';ctx.lineWidth=.8*p.s;
      ctx.beginPath();ctx.moveTo(p.x-5*p.s,p.y+flap);ctx.quadraticCurveTo(p.x,p.y-2*p.s,p.x,p.y);ctx.quadraticCurveTo(p.x,p.y-2*p.s,p.x+5*p.s,p.y+flap);ctx.stroke();
    }

    ctx.restore();
  }
}

drawBackground=function(ts=0){
  if(!canvas||!ctx||!isCanvasEnabled||document.hidden){animationFrameId=null;return;}

  const minDelta=1000/FX_TARGET_FPS;
  if(ts-fxLastFrame<minDelta){animationFrameId=requestAnimationFrame(drawBackground);return;}
  const dt=Math.min(.05,(ts-fxLastFrame||minDelta)/1000);fxLastFrame=ts;

  const w=canvas._cssW||innerWidth,h=canvas._cssH||innerHeight;
  const meta=getThemeMeta(),s=meta.scene;
  themeFxTick+=dt;

  if(v10SceneName!==s||v10LastSize!==`${w}x${h}`)v10ResetFx();

  ctx.clearRect(0,0,w,h);
  ctx.drawImage(getSceneCache(meta,w,h),0,0,w,h);

  // Slow global light breathing makes even static landscapes feel alive.
  const breathe=.5+.5*Math.sin(themeFxTick*.22);
  if(['forest','ocean','sunset','coffee','sakura','cyber','terminal','grape','midnight'].includes(s)){
    const ambient=ctx.createRadialGradient(w*.72,h*.18,10,w*.72,h*.18,w*.60);
    ambient.addColorStop(0, s==='cyber'||s==='terminal'
      ? `rgba(${s==='terminal'?'65,255,126':'72,215,255'},${.010+.010*breathe})`
      : `rgba(255,235,205,${.006+.010*breathe})`);
    ambient.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=ambient;ctx.fillRect(0,0,w,h);
  }

  v10DrawFx(w,h,s,themeFxTick,dt);

  // Gentle vignette only; do not flatten the scene.
  const lightScene=['day','sky','meadow'].includes(s);
  const vg=ctx.createRadialGradient(w*.5,h*.43,Math.min(w,h)*.22,w*.5,h*.47,Math.max(w,h)*.78);
  vg.addColorStop(0,'rgba(255,255,255,0)');
  vg.addColorStop(1,lightScene?'rgba(52,67,71,.035)':'rgba(0,0,0,.105)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);

  animationFrameId=requestAnimationFrame(drawBackground);
};

// V10 uses its own FX pool. Hook theme/resize initialization into the existing flow.
const __v10OldInitBackgroundObjects=initBackgroundObjects;
initBackgroundObjects=function(){
  __v10OldInitBackgroundObjects();
  v10ResetFx();
};

// Descriptions in picker.
Object.assign(THEME_SCENE_LABELS,{
  night:'Moonlit lake · shooting stars',
  day:'Morning landscape · clouds · birds',
  midnight:'Alpine night · stars · moon shimmer',
  oled:'Black horizon · living aurora',
  forest:'Deep forest · drifting mist · fireflies',
  ocean:'Living reef · swimming fish · bubbles',
  sunset:'Golden valley · clouds · birds',
  coffee:'Rainy café · patrons · steam · rain',
  meadow:'Wild meadow · wind · pollen',
  sakura:'Japanese shrine · petals · lantern glow',
  sky:'Sea of clouds · distant birds',
  cyber:'Bright megacity · traffic · neon windows',
  grape:'Vineyard dusk · floating lights',
  terminal:'Terminal megacity · traffic · green glow'
});

// Any user who previously saved a removed theme falls back cleanly.
(function v10MigrateRemovedTheme(){
  const old=localStorage.getItem(THEME_KEY);
  if(['rose','lavender','lemon','peach'].includes(old)){
    localStorage.setItem(THEME_KEY,'dark');
  }
})();

// ============================================================================
// V11.1 — CANVAS-FIRST THEMES (NO POINTER / NO TILT / NO CURSOR PARALLAX)
// ============================================================================
(function initCanvasFirstThemesV11_1(){
  const reduceMotion = matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  function ensureTransitionFlash(){
    let el=document.getElementById('themeTransitionFlash');
    if(!el){
      el=document.createElement('div');
      el.id='themeTransitionFlash';
      el.className='theme-transition-flash';
      document.body.appendChild(el);
    }
    return el;
  }

  // Keep only a cheap theme-change fade. No mouse/pointer tracking is registered.
  const oldApply=applyDashboardTheme;
  applyDashboardTheme=function(themeId,save=true,preserveAuto=false){
    const before=document.body.dataset.theme || getCurrentTheme();
    oldApply(themeId,save,preserveAuto);
    if(!reduceMotion && before!==themeId){
      const flash=ensureTransitionFlash();
      flash.classList.remove('play');
      void flash.offsetWidth;
      flash.classList.add('play');
      flash.addEventListener('animationend',()=>flash.classList.remove('play'),{once:true});
    }
  };

  // Canvas is intentionally fixed. No translate/scale tied to the cursor.
  if(canvas) canvas.style.transform='';

  window.addEventListener('load',()=>{
    ensureThemePicker();
    const small=document.querySelector('#themePickerOverlay .theme-picker-head small');
    if(small)small.textContent='Canvas scenery · stars · wind · clouds · fish · petals · optimized motion.';
  });
})();


// ============================================================================
// V12 UI POLISH — presentation only; no new data model or feature dependency.
// ============================================================================
(function initWorkspaceUIV12(){
    function refreshWorkspaceHero(){
        const now = new Date();
        const greetingEl = document.getElementById('workspaceGreeting');
        const dateEl = document.getElementById('workspaceTodayLabel');

        if (greetingEl) {
            const hour = now.getHours();
            const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
            greetingEl.textContent = `${greeting}. Everything you need is ready here.`;
        }
        if (dateEl) dateEl.textContent = new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).format(now);
    }
    window.refreshWorkspaceHero = refreshWorkspaceHero;
    window.addEventListener('load', refreshWorkspaceHero, {once:true});
})();


// ============================================================================
// V12.1 UI META — lightweight visual metadata only.
// ============================================================================
(function initWorkspaceUIV12_1(){
    function updateWorkspaceSectionMeta(){
        const grid = document.getElementById('groupsGrid');
        const countEl = document.getElementById('workspaceSectionCount');
        const titleEl = document.getElementById('workspaceSectionTitle');
        if (!grid || !countEl) return;

        const cards = Array.from(grid.children).filter(el => el.classList && el.classList.contains('group-card'));
        countEl.textContent = `${cards.length} group${cards.length === 1 ? '' : 's'}`;

        const activeChip = document.querySelector('.tag-chip.active');
        if (titleEl) {
            const label = activeChip?.textContent?.trim();
            titleEl.textContent = label && !/^all$/i.test(label) ? label : 'Your groups';
        }
    }

    window.addEventListener('load', () => {
        updateWorkspaceSectionMeta();
        const grid = document.getElementById('groupsGrid');
        if (grid && 'MutationObserver' in window) {
            new MutationObserver(updateWorkspaceSectionMeta).observe(grid,{childList:true});
        }
        document.addEventListener('click', (e) => {
            if (e.target.closest?.('.tag-chip')) setTimeout(updateWorkspaceSectionMeta,0);
        });
    }, {once:true});
})();

// ============================================================================
// MOBILE PRO 2026 — navigation state hardening
// Keeps the page, drawer and mobile dock from competing for touch/scroll state.
// ============================================================================
(function initMobileProNavigation() {
    const mq = window.matchMedia('(max-width: 768px)');

    function syncMobileSidebarA11y() {
        const open = document.body.classList.contains('sidebar-open');
        const sidebar = document.querySelector('.app-sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        const moreBtn = document.querySelector('.mobile-bottom-nav-v12 button:last-child');

        if (sidebar) {
            sidebar.setAttribute('aria-hidden', open ? 'false' : 'true');
            sidebar.setAttribute('aria-modal', mq.matches && open ? 'true' : 'false');
            if (mq.matches) sidebar.setAttribute('role', 'dialog');
            else {
                sidebar.removeAttribute('role');
                sidebar.removeAttribute('aria-modal');
                sidebar.removeAttribute('aria-hidden');
            }
        }
        if (backdrop) backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
        if (moreBtn) moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    const originalToggleMobileSidebar = window.toggleMobileSidebar;
    window.toggleMobileSidebar = function(force) {
        if (typeof originalToggleMobileSidebar === 'function') {
            originalToggleMobileSidebar(force);
        } else {
            const shouldOpen = typeof force === 'boolean'
                ? force
                : !document.body.classList.contains('sidebar-open');
            document.body.classList.toggle('sidebar-open', shouldOpen);
        }
        syncMobileSidebarA11y();
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
            window.toggleMobileSidebar(false);
        }
    });

    document.addEventListener('click', (event) => {
        if (!mq.matches || !document.body.classList.contains('sidebar-open')) return;
        const sidebar = event.target.closest('.app-sidebar');
        const moreBtn = event.target.closest('.mobile-bottom-nav-v12 button:last-child');
        if (!sidebar && !moreBtn && !event.target.closest('#sidebarBackdrop')) {
            window.toggleMobileSidebar(false);
        }
    }, { passive: true });

    function handleBreakpointChange() {
        if (!mq.matches) document.body.classList.remove('sidebar-open');
        syncMobileSidebarA11y();
    }

    if (mq.addEventListener) mq.addEventListener('change', handleBreakpointChange);
    else mq.addListener(handleBreakpointChange);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncMobileSidebarA11y, { once: true });
    } else {
        syncMobileSidebarA11y();
    }
})();

// ============================================================================
// MOBILE PRO 2026.1 — contextual group menus
// Keeps context menus close to the tap/click while clamping them to the viewport.
// ============================================================================
(function initMobileContextualMenus() {
    const mobileMQ = window.matchMedia('(max-width: 768px)');
    const originalOpenContextMenu = window.openContextMenu;

    if (typeof originalOpenContextMenu !== 'function') return;

    function placeMobileContextMenu(menu, event, isGroupMenu) {
        if (!menu || !mobileMQ.matches) return;

        menu.classList.toggle('mobile-group-context', !!isGroupMenu);
        menu.classList.toggle('mobile-item-context', !isGroupMenu);

        // Let the browser calculate the real menu size before clamping position.
        requestAnimationFrame(() => {
            const vv = window.visualViewport;
            const viewportWidth = vv ? vv.width : window.innerWidth;
            const viewportHeight = vv ? vv.height : window.innerHeight;
            const offsetLeft = vv ? vv.offsetLeft : 0;
            const offsetTop = vv ? vv.offsetTop : 0;
            const gap = 10;
            const dockReserve = 82;
            const rect = menu.getBoundingClientRect();

            // Accept MouseEvent, TouchEvent-like objects and legacy pageX/pageY callers.
            // The menu itself is position:fixed, so all coordinates must end up in the
            // visual viewport/client coordinate space.
            const touchPoint = event?.touches?.[0] || event?.changedTouches?.[0] || null;
            const rawClientX = touchPoint?.clientX ?? event?.clientX;
            const rawClientY = touchPoint?.clientY ?? event?.clientY;
            const rawPageX = touchPoint?.pageX ?? event?.pageX;
            const rawPageY = touchPoint?.pageY ?? event?.pageY;

            const clientX = Number.isFinite(rawClientX)
                ? rawClientX
                : (Number.isFinite(rawPageX) ? rawPageX - window.scrollX : offsetLeft + viewportWidth / 2);
            const clientY = Number.isFinite(rawClientY)
                ? rawClientY
                : (Number.isFinite(rawPageY) ? rawPageY - window.scrollY : offsetTop + viewportHeight / 2);

            let left = clientX + 8;
            if (left + rect.width > offsetLeft + viewportWidth - gap) {
                left = clientX - rect.width - 8;
            }
            left = Math.max(offsetLeft + gap, Math.min(left, offsetLeft + viewportWidth - rect.width - gap));

            let top = clientY + 10;
            const usableBottom = offsetTop + viewportHeight - dockReserve;
            if (top + rect.height > usableBottom) {
                top = clientY - rect.height - 10;
            }
            top = Math.max(offsetTop + gap, Math.min(top, usableBottom - rect.height));

            menu.style.setProperty('--mobile-menu-left', `${Math.round(left)}px`);
            menu.style.setProperty('--mobile-menu-top', `${Math.round(top)}px`);
            menu.style.setProperty('--mobile-menu-origin-x', clientX > viewportWidth / 2 ? '100%' : '0%');
            menu.style.setProperty('--mobile-menu-origin-y', top < clientY ? '100%' : '0%');
        });
    }

    window.openContextMenu = function(event, targetType, groupId, index = null) {
        originalOpenContextMenu.call(this, event, targetType, groupId, index);

        if (!mobileMQ.matches) return;
        const menu = document.getElementById('customContextMenu');
        const isGroupMenu = String(targetType || '').startsWith('group-');
        placeMobileContextMenu(menu, event, isGroupMenu);
    };

    // If the viewport changes while a menu is open, close it rather than leave it stranded.
    const closeFloatingMenu = () => {
        if (!mobileMQ.matches) return;
        const menu = document.getElementById('customContextMenu');
        if (menu && menu.style.display !== 'none') menu.style.display = 'none';
    };

    window.addEventListener('orientationchange', closeFloatingMenu, { passive: true });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', closeFloatingMenu, { passive: true });
    }
})();


// ===== DESKTOP PRO 2026 =====
(function(){
const KEY='dashboardDesktopGroupView', mq=window.matchMedia('(min-width:769px)'); let selected=null;
function meta(t){return({link:['🔗','Links'],note:['📝','Notes'],schedule:['📆','Schedule'],kanban:['📌','Kanban']})[t]||['📁','Group']}
function count(g){if(!g)return 0;if(g.type==='link')return g.links?.length||0;if(g.type==='note')return g.notes?.length||0;if(g.type==='schedule')return g.schedules?.length||0;if(g.type==='kanban')return typeof getKanbanCardCount==='function'?getKanbanCardCount(g):(g.boards||[]).reduce((s,b)=>s+(b.cards?.length||0),0);return 0}
window.setDesktopGroupView=function(mode){mode=mode==='list'?'list':'grid';localStorage.setItem(KEY,mode);document.body.classList.toggle('desktop-list-view',mode==='list');document.getElementById('desktopGridViewBtn')?.classList.toggle('active',mode==='grid');document.getElementById('desktopListViewBtn')?.classList.toggle('active',mode==='list')};
window.openDesktopInspector=function(id){if(!mq.matches)return;const g=getGroup(id),box=document.getElementById('desktopInspectorBody'),title=document.getElementById('desktopInspectorTitle');if(!g||!box||!title)return;selected=id;const m=meta(g.type),tags=Array.isArray(g.tags)?g.tags:[],emoji=g.emoji&&g.emoji!=='NONE'?g.emoji:m[0];title.textContent=`${emoji} ${g.title||'Untitled'}`;box.innerHTML=`<div class="desktop-inspector-type">${m[0]} ${m[1]}</div><div class="desktop-inspector-stats"><div class="desktop-inspector-stat"><small>Items</small><strong>${count(g)}</strong></div><div class="desktop-inspector-stat"><small>Status</small><strong>${g.collapsed?'Collapsed':'Open'}</strong></div><div class="desktop-inspector-stat"><small>Favorite</small><strong>${g.favorite?'Yes':'No'}</strong></div><div class="desktop-inspector-stat"><small>Locked</small><strong>${g.pinKey&&g.isLocked?'Yes':'No'}</strong></div></div><small style="color:var(--text-sub);font-weight:800">TAGS</small><div class="desktop-inspector-tags" style="margin-top:8px">${tags.length?tags.map(x=>`<span class="desktop-inspector-tag">${escapeHTML(String(x))}</span>`).join(''):'<span class="desktop-inspector-tag">No tags</span>'}</div><div class="desktop-inspector-actions"><button class="btn-primary" onclick="openGroupModal('${g.id}','${g.type}')">✏️ Edit</button><button class="btn-secondary" onclick="toggleFavoriteGroup('${g.id}',event);refreshDesktopInspector()">⭐ Favorite</button><button class="btn-secondary wide" onclick="scrollToGroup('${g.id}')">◎ Focus group</button></div>`;document.body.classList.add('desktop-inspector-open');document.getElementById('desktopInspector')?.setAttribute('aria-hidden','false');document.querySelectorAll('.group-card').forEach(c=>c.classList.toggle('desktop-inspected',c.dataset.id===String(id)))};
window.refreshDesktopInspector=function(){if(selected)openDesktopInspector(selected)};
window.closeDesktopInspector=function(){selected=null;document.body.classList.remove('desktop-inspector-open');document.getElementById('desktopInspector')?.setAttribute('aria-hidden','true');document.querySelectorAll('.desktop-inspected').forEach(c=>c.classList.remove('desktop-inspected'))};
function enhance(){if(!mq.matches)return;document.querySelectorAll('#groupsContainer .group-card').forEach(card=>{const a=card.querySelector('.group-header-actions'),id=card.dataset.id;if(!a||!id||a.querySelector('.desktop-inspect-btn'))return;const b=document.createElement('button');b.type='button';b.className='desktop-inspect-btn';b.title='Open inspector';b.innerHTML='⋯';b.onclick=e=>{e.preventDefault();e.stopPropagation();openDesktopInspector(id)};a.insertBefore(b,a.firstChild)});if(selected)document.querySelector(`.group-card[data-id="${CSS.escape(String(selected))}"]`)?.classList.add('desktop-inspected')}
if(typeof renderDashboard==='function'){const old=renderDashboard;renderDashboard=function(){const r=old.apply(this,arguments);enhance();if(selected)refreshDesktopInspector();return r}}
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommandPalette()}else if(e.key==='Escape'&&document.body.classList.contains('desktop-inspector-open'))closeDesktopInspector()});
function sync(){if(!mq.matches){closeDesktopInspector();document.body.classList.remove('desktop-list-view');return}setDesktopGroupView(localStorage.getItem(KEY)||'grid');enhance()}
mq.addEventListener?.('change',sync);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();
// ===== MODAL + QUICK ACTIONS PRO 2026 =====
(function(){
  const compact = new Set(['alertModal','confirmModal','keyModal','calendarDayModal','noteLinkModal','noteTableModal']);
  const medium = new Set(['createGroupTypeModal','groupModal','linkModal','scheduleModal','readModal','todayImportantModal','backupModal']);
  const editor = new Set(['noteModal','noteDeadlineModal','noteIconModal','trashModal','calendarModal','sidebarPanelModal','commandPaletteModal','accountModal','adminUserDetailModal','kanbanCardModal']);
  const workspace = new Set(['adminConsoleModal','kanbanWorkspaceModal']);

  function classifyModal(id){
    const el=document.getElementById(id); if(!el) return;
    el.classList.remove('modal-compact','modal-medium','modal-editor','modal-workspace');
    if(compact.has(id)) el.classList.add('modal-compact');
    else if(workspace.has(id)) el.classList.add('modal-workspace');
    else if(editor.has(id)) el.classList.add('modal-editor');
    else if(medium.has(id)) el.classList.add('modal-medium');
    else el.classList.add('modal-medium');
  }

  if(typeof openModal!=='undefined'){
    const _openModal=openModal;
    openModal=function(id){classifyModal(id);return _openModal(id)};
  }

  document.querySelectorAll('.modal-overlay[id]').forEach(m=>classifyModal(m.id));

  // Add practical hover tools on desktop without changing mobile cards.
  function enhanceHoverTools(){
    if(!window.matchMedia('(min-width:769px)').matches) return;
    document.querySelectorAll('#groupsContainer .group-card').forEach(card=>{
      const id=card.dataset.id, actions=card.querySelector('.group-header-actions');
      if(!id||!actions||actions.querySelector('.desktop-hover-tools')) return;
      const g=typeof getGroup==='function'?getGroup(id):null; if(!g) return;
      const wrap=document.createElement('span'); wrap.className='desktop-hover-tools';
      const add=document.createElement('button'); add.type='button'; add.title='Quick add'; add.textContent='＋';
      add.onclick=e=>{e.preventDefault();e.stopPropagation(); if(g.type==='link') openLinkModal(id); else if(g.type==='note') openNoteModal(id); else if(g.type==='schedule') openScheduleModal(id); else if(g.type==='kanban') addKanbanBoard(id)};
      const edit=document.createElement('button'); edit.type='button'; edit.title='Edit group'; edit.textContent='✎';
      edit.onclick=e=>{e.preventDefault();e.stopPropagation();openGroupModal(id,g.type)};
      wrap.append(add,edit); actions.insertBefore(wrap,actions.firstChild);
    });
  }

  if(typeof renderDashboard==='function'){
    const _render=renderDashboard;
    renderDashboard=function(){const r=_render.apply(this,arguments);enhanceHoverTools();return r};
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enhanceHoverTools,{once:true}); else enhanceHoverTools();

  // Faster creation shortcut: Alt/Option + N.
  document.addEventListener('keydown',e=>{
    const active=document.activeElement;
    const typing=active&&(active.matches?.('input,textarea,select')||active.isContentEditable);
    if(!typing&&e.altKey&&e.key.toLowerCase()==='n'){
      e.preventDefault();
      if(typeof openCreateGroupTypeModal==='function') openCreateGroupTypeModal();
    }
  });

  // Turn existing trash toast into a true Undo toast.
  if(typeof showUndoToast==='function'){
    showUndoToast=function(label){
      const toast=document.getElementById('undoToast'); if(!toast) return;
      toast.innerHTML=`<span>Moved <b>${escapeHTML(label)}</b> to Trash.</span><span class="toast-actions"><button class="btn-primary" onclick="restoreLastTrashItem()">Undo</button><button class="btn-secondary" onclick="openTrashModal()">Trash</button></span>`;
      toast.style.display='flex';
      clearTimeout(window.__undoToastTimer);
      window.__undoToastTimer=setTimeout(()=>{toast.style.display='none'},7000);
    };
  }
})();



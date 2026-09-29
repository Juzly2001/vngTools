// ============================================================================
// MULTI THEME + IMMERSIVE THEME-AWARE SCENES (V3)
// ============================================================================
// MULTI THEME + CINEMATIC ADAPTIVE SCENES (V3)
// ============================================================================
const DASHBOARD_THEMES = [
  {id:'dark',name:'Dark',icon:'🌙',scene:'night'}, {id:'light',name:'Light',icon:'☀️',scene:'day'},
  {id:'midnight',name:'Midnight',icon:'🌌',scene:'midnight'}, {id:'oled',name:'OLED',icon:'⚫',scene:'oled'},
  {id:'forest',name:'Forest',icon:'🌲',scene:'forest'}, {id:'ocean',name:'Ocean',icon:'🌊',scene:'ocean'},
  {id:'sunset',name:'Sunset',icon:'🌇',scene:'sunset'}, {id:'coffee',name:'Coffee',icon:'☕',scene:'coffee'},
  {id:'mint',name:'Mint',icon:'🌿',scene:'meadow'}, {id:'sakura-night',name:'Sakura Night',icon:'🌸',scene:'sakura'},
  {id:'sky',name:'Sky',icon:'☁️',scene:'sky'}, {id:'cyber',name:'Cyber',icon:'⚡',scene:'cyber'},
  {id:'grape',name:'Grape',icon:'🍇',scene:'grape'}, {id:'terminal',name:'Terminal',icon:'💻',scene:'terminal'}
];
const LIGHT_COMPAT_THEMES = new Set(['light','mint','sky']);
const THEME_SCENE_LABELS={night:'Starry night',day:'Soft daylight',midnight:'Moonlit mountains',oled:'Pure black sky',forest:'Forest · mist · fireflies',ocean:'Underwater reef',sunset:'Golden valley',coffee:'Warm café window',meadow:'Fresh meadow',sakura:'Moonlit sakura',sky:'Open blue sky',cyber:'Neon skyline',grape:'Purple nebula',terminal:'Terminal city'};
let themeFxParticles=[], themeFxTick=0, sceneCache=null, sceneCacheCtx=null, sceneCacheKey='', fxLastFrame=0;
const prefersReducedMotion = matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
const FX_QUALITY = (()=>{ const mobile=innerWidth<769; const cores=navigator.hardwareConcurrency||4; const mem=navigator.deviceMemory||4; if(prefersReducedMotion) return .22; if(mobile||cores<=4||mem<=4) return .55; return .9; })();
const FX_TARGET_FPS = FX_QUALITY < .6 ? 30 : 45;

const AUTO_TIME_THEME_KEY = 'dashboardAutoTimeThemeV1';
let autoTimeThemeTimer = null;
let lastAutoTimeThemeSlot = '';

function getCurrentTheme(){ const v=localStorage.getItem(THEME_KEY)||'dark'; return DASHBOARD_THEMES.some(t=>t.id===v)?v:'dark'; }
function getThemeMeta(id=null){
  // Visuals must follow the theme currently applied to the page.
  // Auto by time intentionally does not overwrite THEME_KEY, so reading only
  // localStorage here would keep the old Visuals scene.
  const activeThemeId = id || document.body.dataset.theme || getCurrentTheme();
  return DASHBOARD_THEMES.find(t=>t.id===activeThemeId)||DASHBOARD_THEMES[0];
}
function sceneLabel(scene){return THEME_SCENE_LABELS[scene]||scene;}
function isAutoTimeThemeEnabled(){ return localStorage.getItem(AUTO_TIME_THEME_KEY)==='true'; }
function getAutoTimeThemeInfo(date=new Date()){
  const h=date.getHours();
  if(h>=5 && h<10) return {slot:'morning',label:'Morning',icon:'🌅',theme:'sky',range:'05:00–09:59'};
  if(h>=10 && h<14) return {slot:'noon',label:'Noon',icon:'☀️',theme:'light',range:'10:00–13:59'};
  if(h>=14 && h<18) return {slot:'afternoon',label:'Afternoon',icon:'🌇',theme:'sunset',range:'14:00–17:59'};
  if(h>=18 && h<22) return {slot:'evening',label:'Evening',icon:'☕',theme:'coffee',range:'18:00–21:59'};
  return {slot:'night',label:'Night',icon:'🌙',theme:'midnight',range:'22:00–04:59'};
}
function updateAutoTimeThemeUI(){
  const autoBtn=document.getElementById('autoTimeThemeChoice');
  if(!autoBtn)return;
  const enabled=isAutoTimeThemeEnabled();
  const info=getAutoTimeThemeInfo();
  autoBtn.classList.toggle('active',enabled);
  const check=autoBtn.querySelector('.theme-check'); if(check)check.textContent=enabled?'✓':'';
  const desc=autoBtn.querySelector('.auto-time-description');
  if(desc)desc.textContent=enabled?`${info.icon} ${info.label} now · ${info.range} · ${getThemeMeta(info.theme).name}`:'Automatically changes Morning · Noon · Afternoon · Evening · Night';
}
function applyDashboardTheme(themeId,save=true,preserveAuto=false){
  const meta=getThemeMeta(themeId); document.body.dataset.theme=meta.id; document.body.classList.toggle('light-mode',LIGHT_COMPAT_THEMES.has(meta.id));
  if(save){localStorage.setItem(THEME_KEY,meta.id); if(!preserveAuto)localStorage.setItem(AUTO_TIME_THEME_KEY,'false');}
  const btn=getEl('themeBtn');
  if(btn){
    const auto=isAutoTimeThemeEnabled();
    const info=getAutoTimeThemeInfo();
    btn.innerHTML=`<span class="sidebar-menu-icon">${auto?info.icon:meta.icon}</span><span>${auto?'Auto theme':'Theme'}</span>`;
    btn.title=auto?`Auto by time: ${info.label} (${info.range}) · ${meta.name}`:`Theme: ${meta.name}`;
  }
  document.querySelectorAll('.theme-choice[data-theme]').forEach(el=>{const on=!isAutoTimeThemeEnabled()&&el.dataset.theme===meta.id;el.classList.toggle('active',on);const m=el.querySelector('.theme-check');if(m)m.textContent=on?'✓':'';});
  updateAutoTimeThemeUI();
  invalidateScene(); if(isCanvasEnabled){initBackgroundObjects(); if(!animationFrameId)animationFrameId=requestAnimationFrame(drawBackground);}
}
function applyAutoTimeTheme(force=false){
  if(!isAutoTimeThemeEnabled())return;
  const info=getAutoTimeThemeInfo();
  if(!force && lastAutoTimeThemeSlot===info.slot)return;
  lastAutoTimeThemeSlot=info.slot;
  applyDashboardTheme(info.theme,false,true);
  updateAutoTimeThemeUI();
}
function setAutoTimeTheme(enabled=true){
  localStorage.setItem(AUTO_TIME_THEME_KEY,enabled?'true':'false');
  lastAutoTimeThemeSlot='';
  if(enabled){applyAutoTimeTheme(true); startAutoTimeThemeWatcher();}
  else {stopAutoTimeThemeWatcher(); applyDashboardTheme(getCurrentTheme(),false,true);}
  updateAutoTimeThemeUI();
}
function startAutoTimeThemeWatcher(){
  stopAutoTimeThemeWatcher();
  if(!isAutoTimeThemeEnabled())return;
  autoTimeThemeTimer=setInterval(()=>applyAutoTimeTheme(false),30000);
}
function stopAutoTimeThemeWatcher(){if(autoTimeThemeTimer){clearInterval(autoTimeThemeTimer);autoTimeThemeTimer=null;}}
function toggleTheme(){openThemePicker();}
function ensureThemePicker(){
  if(document.getElementById('themePickerOverlay'))return;
  const o=document.createElement('div');o.id='themePickerOverlay';o.className='theme-picker-overlay';
  o.innerHTML=`<div class="theme-picker-panel" role="dialog" aria-modal="true"><div class="theme-picker-head"><div><h3>🎨 Choose theme</h3><small style="color:var(--text-sub)">Cinematic adaptive scenes — optimized for smoothness.</small></div><button class="theme-picker-close" type="button">✕</button></div><button id="autoTimeThemeChoice" class="theme-choice auto-time-theme-choice" type="button"><span class="theme-check"></span><strong>🕒 Auto by time</strong><small class="auto-time-description">Automatically changes Morning · Noon · Afternoon · Evening · Night</small><span class="auto-time-slots"><span>🌅 Morning</span><span>☀️ Noon</span><span>🌇 Afternoon</span><span>☕ Evening</span><span>🌙 Night</span></span></button><div class="theme-picker-grid">${DASHBOARD_THEMES.map(t=>`<button class="theme-choice" type="button" data-theme="${t.id}"><span class="theme-check"></span><strong>${t.icon} ${t.name}</strong><small>${sceneLabel(t.scene)}</small></button>`).join('')}</div></div>`;
  document.body.appendChild(o);
  o.addEventListener('click',e=>{if(e.target===o)closeThemePicker()});
  o.querySelector('.theme-picker-close')?.addEventListener('click',closeThemePicker);
  o.querySelector('#autoTimeThemeChoice')?.addEventListener('click',()=>{setAutoTimeTheme(!isAutoTimeThemeEnabled());updateAutoTimeThemeUI();});
  o.querySelectorAll('.theme-choice[data-theme]').forEach(b=>b.addEventListener('click',()=>{setAutoTimeTheme(false);applyDashboardTheme(b.dataset.theme,true,false);closeThemePicker();}));
  updateAutoTimeThemeUI();
}
function openThemePicker(){ensureThemePicker();document.getElementById('themePickerOverlay')?.classList.add('active');if(isAutoTimeThemeEnabled())applyAutoTimeTheme(true);else applyDashboardTheme(getCurrentTheme(),false,true);updateAutoTimeThemeUI();}
function closeThemePicker(){document.getElementById('themePickerOverlay')?.classList.remove('active')}
function invalidateScene(){sceneCacheKey='';sceneCache=null;sceneCacheCtx=null;}

function resizeCanvas(){if(!canvas)return;const dpr=Math.min(devicePixelRatio||1,FX_QUALITY<.6?1:1.35);const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);if(canvas._cssW===w&&canvas._cssH===h&&canvas._renderDpr===dpr)return;canvas._renderDpr=dpr;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);canvas._cssW=w;canvas._cssH=h;invalidateScene();if(isCanvasEnabled)initBackgroundObjects();}
function addFx(n,maker){n=Math.max(1,Math.round(n*FX_QUALITY));const w=canvas._cssW||innerWidth,h=canvas._cssH||innerHeight;for(let i=0;i<n;i++)themeFxParticles.push(maker(i,w,h));}
function initBackgroundObjects(){if(!canvas||!ctx)return;themeFxParticles=[];const s=getThemeMeta().scene;const common=()=>({x:Math.random()*(canvas._cssW||innerWidth),y:Math.random()*(canvas._cssH||innerHeight),p:Math.random()*6.283});
  if(['night','midnight','oled'].includes(s))addFx(80,()=>({...common(),r:.35+Math.random()*1.35,a:.25+Math.random()*.65,tw:.7+Math.random()*1.6,shoot:Math.random()<.035,v:1+Math.random()*1.1}));
  if(['day','sky','rose','lavender','meadow','lemon','peach','sunset'].includes(s))addFx(7,()=>({...common(),y:35+Math.random()*220,s:.65+Math.random()*1.15,v:.08+Math.random()*.12,a:.22+Math.random()*.18}));
  if(s==='forest')addFx(42,()=>({...common(),y:(canvas._cssH||innerHeight)*(.35+Math.random()*.58),r:1+Math.random()*1.7,a:.25+Math.random()*.7,vx:(Math.random()-.5)*.08,vy:(Math.random()-.5)*.06}));
  if(['rose','lavender','sakura','peach'].includes(s))addFx(28,()=>({...common(),r:2.5+Math.random()*3.5,a:.25+Math.random()*.5,vx:.13+Math.random()*.28,vy:.08+Math.random()*.23,rot:Math.random()*6.28,vr:(Math.random()-.5)*.025}));
  if(s==='ocean')addFx(34,()=>({...common(),r:2+Math.random()*7,a:.10+Math.random()*.18,vy:-.08-Math.random()*.2}));
  if(s==='coffee')addFx(9,()=>({...common(),x:(canvas._cssW||innerWidth)*(.44+Math.random()*.12),y:(canvas._cssH||innerHeight)*(.6+Math.random()*.2),r:9+Math.random()*12,a:.025+Math.random()*.055,vy:-.035-Math.random()*.06}));
  if(s==='cyber'||s==='terminal')addFx(Math.max(18,Math.floor((canvas._cssW||innerWidth)/36)),()=>({...common(),s:10+Math.random()*5,vy:.35+Math.random()*.8,a:.06+Math.random()*.14,ch:String.fromCharCode(0x30A0+Math.random()*70)}));
  if(s==='grape')addFx(34,()=>({...common(),r:.8+Math.random()*2.4,a:.08+Math.random()*.2,vx:(Math.random()-.5)*.035,vy:(Math.random()-.5)*.035}));
}

function mkOffscreen(w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c;}
function sceneGradient(gctx,w,h,stops){const g=gctx.createLinearGradient(0,0,0,h);stops.forEach(([p,c])=>g.addColorStop(p,c));gctx.fillStyle=g;gctx.fillRect(0,0,w,h);}
function ellipse(g,x,y,rx,ry,fill,a=1,rot=0){g.save();g.globalAlpha=a;g.fillStyle=fill;g.translate(x,y);g.rotate(rot);g.beginPath();g.ellipse(0,0,rx,ry,0,0,6.283);g.fill();g.restore();}
function hill(g,w,h,y,amp,color,phase=0){g.fillStyle=color;g.beginPath();g.moveTo(0,h);for(let x=0;x<=w+30;x+=35)g.lineTo(x,y+Math.sin(x*.008+phase)*amp+Math.sin(x*.021+phase)*amp*.25);g.lineTo(w,h);g.closePath();g.fill();}
function pine(g,x,b,s,c){g.fillStyle='rgba(46,31,20,.8)';g.fillRect(x-2*s,b-42*s,4*s,42*s);g.fillStyle=c;for(let i=0;i<3;i++){const yy=b-(22+i*16)*s;g.beginPath();g.moveTo(x,yy-27*s);g.lineTo(x-18*s,yy+12*s);g.lineTo(x+18*s,yy+12*s);g.closePath();g.fill();}}
function cloud(g,x,y,s,a=.35,t='255,255,255'){g.save();g.globalAlpha=a;g.fillStyle=`rgb(${t})`;g.shadowColor='rgba(255,255,255,.16)';g.shadowBlur=16;[[0,0,27],[29,4,22],[-28,7,19],[5,-17,24]].forEach(([dx,dy,r])=>{g.beginPath();g.arc(x+dx*s,y+dy*s,r*s,0,6.283);g.fill()});g.restore();}
function rose(g,x,y,s,c){g.strokeStyle='rgba(31,99,52,.66)';g.lineWidth=Math.max(.6,s);g.beginPath();g.moveTo(x,y+5*s);g.lineTo(x,y+23*s);g.stroke();for(let i=0;i<5;i++)ellipse(g,x+Math.cos(i*1.256)*3.4*s,y+Math.sin(i*1.256)*2.5*s,3.8*s,2.4*s,c,.94,i*1.256);ellipse(g,x,y,1.7*s,1.7*s,'#ffe4e6');}
function drawStaticScene(g,w,h,meta){const s=meta.scene;
  if(s==='forest'){sceneGradient(g,w,h,[[0,'#102b30'],[.42,'#234d3a'],[.70,'#496b4d'],[1,'#142e1d']]);ellipse(g,w*.72,h*.16,85,40,'#dcebd8',.055);hill(g,w,h,h*.66,18,'#365f46',.5);hill(g,w,h,h*.76,26,'#264f35',1.8);for(let i=0;i<30;i++)pine(g,(i+.15)*w/29,h*.84,.38+(i%5)*.06,i%2?'#214a31':'#2c593b');g.fillStyle='rgba(219,232,222,.055)';g.fillRect(0,h*.48,w,h*.20);for(let i=0;i<18;i++)pine(g,(i+.2)*w/17,h*.97,.72+(i%4)*.08,i%2?'#102f20':'#173925');for(let i=0;i<6;i++)ellipse(g,w*(.06+i*.19),h*(.56+(i%2)*.055),w*.16,16,'#e4eee7',.045);}
  else if(s==='rose'){sceneGradient(g,w,h,[[0,'#f7dfe4'],[.43,'#f8eef0'],[.68,'#cbd9bd'],[1,'#718867']]);ellipse(g,w*.80,h*.15,48,48,'#fff4d3',.48);hill(g,w,h,h*.66,16,'#b8c9aa',.8);hill(g,w,h,h*.75,23,'#93aa82',2.1);g.fillStyle='rgba(255,255,255,.075)';g.fillRect(0,h*.47,w,h*.18);for(let row=0;row<7;row++)for(let i=0;i<Math.ceil(w/27)+3;i++)rose(g,i*27+(row%2)*11,h*(.72+row*.04),.35+row*.075,row%3===0?'#be3455':row%2?'#d95774':'#e87b90');}
  else if(s==='lavender'){sceneGradient(g,w,h,[[0,'#d9d7ff'],[.5,'#f5ecff'],[.72,'#c8dcb1'],[1,'#758c63']]);hill(g,w,h,h*.7,22,'#a5b88b',.5);hill(g,w,h,h*.8,30,'#71825f',2);for(let row=0;row<5;row++){g.strokeStyle='#526b4c';for(let x=10;x<w;x+=20){g.beginPath();g.moveTo(x,h*(.78+row*.045)+18);g.lineTo(x,h*(.78+row*.045));g.stroke();for(let k=0;k<4;k++)ellipse(g,x+(k%2?2:-2),h*(.78+row*.045)-k*4,2.4,4,'#8b5cf6',.75+row*.04)}}}
  else if(s==='ocean'){sceneGradient(g,w,h,[[0,'#0a6c88'],[.45,'#07546d'],[1,'#062e45']]);for(let i=0;i<7;i++){g.save();g.globalAlpha=.06;g.fillStyle='#d7fbff';g.beginPath();g.moveTo(i*w/6-80,0);g.lineTo(i*w/6+120,h*.82);g.lineTo(i*w/6+220,h*.82);g.lineTo(i*w/6+30,0);g.fill();g.restore();}g.fillStyle='#09394b';g.fillRect(0,h*.88,w,h*.12);for(let i=0;i<20;i++){g.strokeStyle=i%2?'#1d806d':'#2f987c';g.lineWidth=3+(i%3);g.beginPath();g.moveTo(i*w/19,h);g.quadraticCurveTo(i*w/19+18,h*.90,i*w/19+Math.sin(i)*12,h*.79);g.stroke();}for(let i=0;i<12;i++)ellipse(g,(i+.4)*w/11,h*.9-(i%3)*10,10+(i%4)*4,5+(i%2)*3,i%2?'#d97757':'#7c8fa3',.55);}
  else if(s==='sunset'){sceneGradient(g,w,h,[[0,'#51236f'],[.37,'#dd6b61'],[.67,'#f6b56b'],[1,'#37324b']]);ellipse(g,w*.76,h*.39,55,55,'#ffd59a',.9);hill(g,w,h,h*.68,52,'#5f4a66',.4);hill(g,w,h,h*.78,40,'#3b4053',2);hill(g,w,h,h*.88,28,'#202c35',4);}
  else if(s==='coffee'){sceneGradient(g,w,h,[[0,'#39241d'],[.6,'#604334'],[1,'#261812']]);g.fillStyle='#1e1511';g.fillRect(0,h*.78,w,h*.22);g.fillStyle='rgba(255,196,130,.08)';g.fillRect(w*.12,h*.12,w*.28,h*.46);g.strokeStyle='rgba(255,220,176,.22)';g.lineWidth=3;g.strokeRect(w*.12,h*.12,w*.28,h*.46);g.beginPath();g.moveTo(w*.26,h*.12);g.lineTo(w*.26,h*.58);g.moveTo(w*.12,h*.35);g.lineTo(w*.4,h*.35);g.stroke();ellipse(g,w*.54,h*.79,90,14,'#e8d6c7');g.fillStyle='#e7d5c7';g.fillRect(w*.5,h*.67,90,63);ellipse(g,w*.5+45,h*.67,45,9,'#efe1d8');ellipse(g,w*.5+45,h*.67,37,6,'#2f1811');g.strokeStyle='#e7d5c7';g.lineWidth=8;g.beginPath();g.arc(w*.5+93,h*.70,18,-1.2,1.2);g.stroke();}
  else if(s==='sakura'){sceneGradient(g,w,h,[[0,'#090d26'],[.54,'#26254f'],[1,'#351f3d']]);ellipse(g,w*.78,h*.19,38,38,'#f9efff',.86);hill(g,w,h,h*.88,20,'#11182c',1);g.strokeStyle='#29171d';g.lineWidth=16;g.beginPath();g.moveTo(-20,h*.73);g.quadraticCurveTo(w*.22,h*.45,w*.43,h*.5);g.stroke();g.lineWidth=7;for(let i=0;i<6;i++){g.beginPath();g.moveTo(w*(.12+i*.055),h*(.57-i*.018));g.lineTo(w*(.06+i*.10),h*(.35-i*.012));g.stroke()}for(let i=0;i<65;i++)ellipse(g,(i*83)%(w*.55),h*.27+((i*47)%220),2.5+(i%3),2,'#fb8ea5',.72,i*.3);}
  else if(['day','sky','meadow','lemon','peach'].includes(s)){const top=s==='sky'?'#7dccf2':s==='lemon'?'#fff3a7':s==='peach'?'#ffd4c7':'#a8dcf6';sceneGradient(g,w,h,[[0,top],[.62,'#effaff'],[.78,'#cce3b6'],[1,'#6e9a60']]);ellipse(g,w*.82,h*.16,34,34,'#fff3b0',.78);hill(g,w,h,h*.78,24,'#a7c994',1.5);hill(g,w,h,h*.88,32,'#6d9a60',3);if(s==='lemon'||s==='peach'){for(let i=0;i<9;i++){const x=(i+.3)*w/8;g.fillStyle='#6c4c2d';g.fillRect(x-4,h*.89-72,8,72);for(const [dx,dy,r] of [[0,-78,27],[-22,-63,22],[23,-63,24],[2,-104,21]])ellipse(g,x+dx,h*.89+dy,r,r,s==='peach'?'#72976d':'#5c974c',.9);for(let j=0;j<5;j++)ellipse(g,x+(j-2)*9,h*.89-78+(j%2)*15,4.5,4.5,s==='peach'?'#f78f73':'#facc15',.95)}}}
  else if(s==='cyber'||s==='terminal'){sceneGradient(g,w,h,s==='cyber'?[[0,'#040816'],[.65,'#101027'],[1,'#05070d']]:[[0,'#010604'],[1,'#00180b']]);const neon=s==='cyber';g.fillStyle=neon?'#080d1b':'#021309';for(let x=0;x<w;x+=38){const bh=55+((x*13)%150);g.fillRect(x,h*.82-bh,28,bh);if(neon){g.fillStyle=x%76?'#10233d':'#1d1235';g.fillRect(x+5,h*.82-bh+8,3,bh-14);g.fillStyle='#080d1b'}}g.save();g.globalAlpha=.13;g.strokeStyle=neon?'#22d3ee':'#22c55e';const horizon=h*.82;for(let y=horizon;y<h;y+=18){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}for(let x=-w;x<w*2;x+=60){g.beginPath();g.moveTo(w*.5,horizon);g.lineTo(x,h);g.stroke()}g.restore();}
  else if(s==='grape'){sceneGradient(g,w,h,[[0,'#100923'],[.55,'#36135d'],[1,'#12071f']]);for(let i=0;i<5;i++){const rg=g.createRadialGradient(w*(.15+i*.18),h*(.25+(i%2)*.2),5,w*(.15+i*.18),h*(.25+(i%2)*.2),170);rg.addColorStop(0,i%2?'rgba(217,70,239,.28)':'rgba(139,92,246,.30)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h)}}
  else {sceneGradient(g,w,h,[[0,s==='oled'?'#000':'#06101f'],[1,s==='oled'?'#000':'#101b34']]);if(s==='midnight'){hill(g,w,h,h*.79,45,'#0b1737',1);hill(g,w,h,h*.9,28,'#071029',3)}}
}
function getSceneCache(meta,w,h){const key=`${meta.id}:${w}x${h}`;if(sceneCacheKey===key&&sceneCache)return sceneCache;sceneCache=mkOffscreen(w,h);sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});drawStaticScene(sceneCacheCtx,w,h,meta);sceneCacheKey=key;return sceneCache;}
function drawCloudDynamic(p,w){cloud(ctx,p.x,p.y,p.s,p.a);p.x+=p.v;if(p.x> w+120)p.x=-120;}
function drawBackground(ts=0){if(!canvas||!ctx||!isCanvasEnabled||document.hidden){animationFrameId=null;return;}const minDelta=1000/FX_TARGET_FPS;if(ts-fxLastFrame<minDelta){animationFrameId=requestAnimationFrame(drawBackground);return;}fxLastFrame=ts;const w=canvas._cssW||innerWidth,h=canvas._cssH||innerHeight,meta=getThemeMeta(),s=meta.scene;themeFxTick+=minDelta/1000;ctx.clearRect(0,0,w,h);ctx.drawImage(getSceneCache(meta,w,h),0,0,w,h);
  if(['day','sky','rose','lavender','meadow','lemon','peach','sunset'].includes(s))themeFxParticles.forEach(p=>drawCloudDynamic(p,w));
  else if(['night','midnight','oled'].includes(s)){themeFxParticles.forEach(p=>{const a=.3+.7*(.5+.5*Math.sin(themeFxTick*p.tw+p.p));ctx.globalAlpha=a;ctx.fillStyle=s==='midnight'?'#b8d8ff':'#fff';if(p.shoot){ctx.strokeStyle=ctx.fillStyle;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-28,p.y+40);ctx.stroke();p.x-=p.v*.6;p.y+=p.v;if(p.y>h+30){p.y=-20;p.x=Math.random()*w}}else{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill()}});ctx.globalAlpha=1;}
  else if(s==='forest'){themeFxParticles.forEach(p=>{const a=.22+.7*(.5+.5*Math.sin(themeFxTick*1.8+p.p));ctx.globalAlpha=a;ctx.shadowColor='#d9f99d';ctx.shadowBlur=10;ctx.fillStyle='#eaffb2';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.x+=p.vx+Math.sin(themeFxTick+p.p)*.035;p.y+=p.vy+Math.cos(themeFxTick*.8+p.p)*.025;if(p.x<0)p.x=w;if(p.x>w)p.x=0});ctx.shadowBlur=0;ctx.globalAlpha=1;}
  else if(['rose','lavender','sakura','peach'].includes(s)){const c=s==='lavender'?'#9f7aea':s==='peach'?'#fb9478':'#fb7185';themeFxParticles.forEach(p=>{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=p.a;ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(0,0,p.r*.6,p.r*1.2,0,0,6.283);ctx.fill();ctx.restore();p.x+=p.vx+Math.sin(themeFxTick*1.2+p.p)*.09;p.y+=p.vy;p.rot+=p.vr;if(p.y>h+15||p.x>w+15){p.y=-10;p.x=Math.random()*w}})}
  else if(s==='ocean'){themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a;ctx.strokeStyle='#d8fbff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.stroke();p.y+=p.vy;p.x+=Math.sin(themeFxTick+p.p)*.02;if(p.y<-12){p.y=h+10;p.x=Math.random()*w}});ctx.globalAlpha=1;}
  else if(s==='coffee'){themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a;ctx.fillStyle='#fff5e8';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.x+=Math.sin(themeFxTick+p.p)*.05;p.y+=p.vy;if(p.y<h*.49){p.y=h*.74;p.x=w*(.48+Math.random()*.08)}});ctx.globalAlpha=1;}
  else if(s==='cyber'||s==='terminal'){const cyber=s==='cyber';themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a;ctx.fillStyle=cyber?(Math.sin(p.p+themeFxTick)>0?'#22d3ee':'#d946ef'):'#22c55e';ctx.font=`${p.s}px ui-monospace,monospace`;ctx.fillText(p.ch,p.x,p.y);p.y+=p.vy;if(p.y>h+20){p.y=-10;p.x=Math.random()*w}});ctx.globalAlpha=1;}
  else if(s==='grape'){themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a*(.65+.35*Math.sin(themeFxTick+p.p));ctx.fillStyle='#e9c8ff';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=w;if(p.x>w)p.x=0});ctx.globalAlpha=1;}
  // Cinematic finishing pass: subtle atmosphere, not a heavy full-screen filter.
  const vg=ctx.createRadialGradient(w*.5,h*.42,Math.min(w,h)*.18,w*.5,h*.45,Math.max(w,h)*.78);
  vg.addColorStop(0,'rgba(255,255,255,0)');
  vg.addColorStop(1, getThemeMeta().scene==='day'||getThemeMeta().scene==='sky'||getThemeMeta().scene==='rose'||getThemeMeta().scene==='lavender'||getThemeMeta().scene==='meadow'||getThemeMeta().scene==='lemon'||getThemeMeta().scene==='peach' ? 'rgba(80,95,110,.055)' : 'rgba(0,0,0,.16)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);
  animationFrameId=requestAnimationFrame(drawBackground);
}
function applyCanvasState(){
  const btn=getEl('themeBtnCanvas');
  if(!canvas)return;

  document.body.classList.toggle('visuals-on', !!isCanvasEnabled);
  document.body.classList.toggle('visuals-off', !isCanvasEnabled);

  if(isCanvasEnabled){
    canvas.style.setProperty('display','block','important');
    canvas.style.setProperty('visibility','visible','important');
    canvas.style.setProperty('opacity','1','important');
    resizeCanvas();
    initBackgroundObjects();
    fxLastFrame=0;
    if(!animationFrameId)animationFrameId=requestAnimationFrame(drawBackground);
    if(btn)btn.innerHTML='<span class="sidebar-menu-icon">✨</span><span>Visuals</span>';
  }else{
    if(animationFrameId){
      cancelAnimationFrame(animationFrameId);
      animationFrameId=null;
    }
    if(ctx){
      ctx.save();
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.restore();
    }
    invalidateScene();
    themeFxParticles.length=0;
    canvas.style.setProperty('display','none','important');
    canvas.style.setProperty('visibility','hidden','important');
    canvas.style.setProperty('opacity','0','important');
    if(btn)btn.innerHTML='<span class="sidebar-menu-icon">🌟</span><span>Visuals</span>';
  }
}
function toggleThemeCanvas(){
  isCanvasEnabled=!isCanvasEnabled;
  localStorage.setItem('canvas-enabled',isCanvasEnabled);

  // When Visuals is turned back on while Auto by time is active,
  // sync the current time slot first so the canvas never revives an old scene.
  if(isCanvasEnabled && isAutoTimeThemeEnabled()){
    applyAutoTimeTheme(true);
  }

  applyCanvasState();
}
window.addEventListener('resize',()=>{clearTimeout(window.__sceneResizeTimer);window.__sceneResizeTimer=setTimeout(resizeCanvas,120)},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(animationFrameId){cancelAnimationFrame(animationFrameId);animationFrameId=null}}else if(isCanvasEnabled&&!animationFrameId){fxLastFrame=0;animationFrameId=requestAnimationFrame(drawBackground)}});
window.addEventListener('load',()=>{ensureThemePicker();applyDashboardTheme(getCurrentTheme(),false);applyCanvasState();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeThemePicker()});


// ==========================================================================
// SCENE V7 — POLISHED CANVAS LANDSCAPES
// Natural density, atmospheric perspective, cached static scenery.
// No photographic backgrounds.
// ==========================================================================

function v7rng(seed){
  let t = seed >>> 0;
  return function(){
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function v7seedFor(scene,w,h){
  let s=2166136261;
  const text=scene+'|'+Math.round(w/20)+'|'+Math.round(h/20);
  for(let i=0;i<text.length;i++){ s^=text.charCodeAt(i); s=Math.imul(s,16777619); }
  return s>>>0;
}
function v7lerp(a,b,t){return a+(b-a)*t;}
function v7mixAlpha(hex,a){
  if(hex.startsWith('#')){
    const h=hex.slice(1); const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
  }
  return hex;
}
function v7softBlob(g,x,y,rx,ry,color,a=1,parts=9,rng=Math.random){
  g.save(); g.globalAlpha=a; g.fillStyle=color;
  for(let i=0;i<parts;i++){
    const ang=rng()*Math.PI*2, rr=.25+rng()*.75;
    const px=x+Math.cos(ang)*rx*.42*rr, py=y+Math.sin(ang)*ry*.35*rr;
    const sx=rx*(.38+rng()*.34), sy=ry*(.34+rng()*.32);
    g.beginPath(); g.ellipse(px,py,sx,sy,rng()*.4,0,Math.PI*2); g.fill();
  }
  g.restore();
}
function v7branch(g,x1,y1,x2,y2,w,color,a=1){
  g.save(); g.globalAlpha=a; g.strokeStyle=color; g.lineWidth=w; g.lineCap='round';
  g.beginPath(); g.moveTo(x1,y1); g.quadraticCurveTo(v7lerp(x1,x2,.52)+(y2-y1)*.08,v7lerp(y1,y2,.52),x2,y2); g.stroke();
  g.restore();
}
function v7leaf(g,x,y,s,color,a=1,rot=0){
  g.save(); g.translate(x,y); g.rotate(rot); g.globalAlpha=a; g.fillStyle=color;
  g.beginPath(); g.ellipse(0,0,s*1.7,s*.72,0,0,Math.PI*2); g.fill(); g.restore();
}
function v7flower(g,x,y,s,petal,center='#f8d9a0',a=1,rot=0){
  g.save(); g.translate(x,y); g.rotate(rot); g.globalAlpha=a;
  for(let i=0;i<7;i++){
    const ang=i*Math.PI*2/7;
    g.fillStyle=petal; g.beginPath(); g.ellipse(Math.cos(ang)*s*.52,Math.sin(ang)*s*.40,s*.50,s*.30,ang,0,Math.PI*2); g.fill();
  }
  g.fillStyle=center; g.beginPath(); g.arc(0,0,s*.28,0,Math.PI*2); g.fill(); g.restore();
}
function v7cloudBank(g,w,h,rng,alpha=.12){
  g.save(); g.filter='blur(9px)'; g.globalAlpha=alpha; g.fillStyle='#fff';
  for(let i=0;i<7;i++){
    const x=(i/6)*w + (rng()-.5)*w*.10;
    const y=h*(.12+rng()*.22);
    v7softBlob(g,x,y,70+rng()*85,24+rng()*26,'#fff',1,6,rng);
  }
  g.restore();
}
function v7mistBand(g,w,y,hgt,a=.08){
  const gr=g.createLinearGradient(0,y-hgt,0,y+hgt);
  gr.addColorStop(0,'rgba(255,255,255,0)');
  gr.addColorStop(.5,`rgba(235,244,240,${a})`);
  gr.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=gr; g.fillRect(0,y-hgt,w,hgt*2);
}
function v7hill(g,w,h,base,amp,color,phase=0,alpha=1){
  g.save(); g.globalAlpha=alpha; g.fillStyle=color; g.beginPath(); g.moveTo(0,h);
  for(let x=0;x<=w+30;x+=24){
    const y=base+Math.sin(x*.006+phase)*amp+Math.sin(x*.014+phase*.7)*amp*.38+Math.sin(x*.027+phase)*amp*.12;
    g.lineTo(x,y);
  }
  g.lineTo(w,h); g.closePath(); g.fill(); g.restore();
}
function v7drawForest(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#183231'],[.38,'#2d4d3c'],[.66,'#39583f'],[1,'#12251b']]);

  // distant canopy and haze
  v7mistBand(g,w,h*.40,h*.13,.065);
  for(let i=0;i<24;i++){
    const x=(i+.2)*w/23 + (rng()-.5)*25;
    const y=h*(.39+rng()*.11);
    v7softBlob(g,x,y,48+rng()*42,28+rng()*28,i%3===0?'#42644a':'#365741',.36,8,rng);
  }

  // distant trunks: thin, pale, softened by atmosphere
  for(let i=0;i<38;i++){
    const x=rng()*w, base=h*(.78+rng()*.08), top=h*(.20+rng()*.22);
    const col=i%3===0?'#324637':'#263a31';
    v7branch(g,x,base,x+(rng()-.5)*24,top,1.2+rng()*2.2,col,.34);
  }

  // mid trunks + dense crown
  for(let i=0;i<18;i++){
    const x=(i+.15)*w/17+(rng()-.5)*36, base=h*(.91+rng()*.04), top=h*(.28+rng()*.20);
    const thick=4+rng()*7;
    v7branch(g,x,base,x+(rng()-.5)*36,top,thick,'#1a2c22',.82);
    for(let b=0;b<3;b++){
      const yy=v7lerp(base,top,.35+b*.17);
      const side=(b%2?1:-1);
      v7branch(g,x+(rng()-.5)*8,yy,x+side*(34+rng()*65),yy-(22+rng()*38),Math.max(1.2,thick*.28),'#20352a',.65);
    }
    const crownY=top+30+rng()*30;
    const crownC=i%3===0?'#1f432e':i%3===1?'#28503a':'#244833';
    v7softBlob(g,x,crownY,78+rng()*55,60+rng()*48,crownC,.90,11,rng);
  }

  // mid-ground foliage belt
  for(let i=0;i<30;i++){
    const x=rng()*w, y=h*(.67+rng()*.17);
    v7softBlob(g,x,y,38+rng()*46,26+rng()*34,rng()>.5?'#244d31':'#1c422d',.90,8,rng);
  }

  // forest floor
  const floor=g.createLinearGradient(0,h*.72,0,h);
  floor.addColorStop(0,'rgba(18,45,28,.12)'); floor.addColorStop(1,'#0b2015');
  g.fillStyle=floor; g.fillRect(0,h*.72,w,h*.28);

  // grasses, ferns, low shrubs
  g.lineCap='round';
  for(let i=0;i<150;i++){
    const x=rng()*w, y=h*(.80+rng()*.20), len=7+rng()*28;
    g.strokeStyle=rng()>.5?'rgba(61,111,69,.42)':'rgba(40,88,56,.50)';
    g.lineWidth=.6+rng()*1.2;
    g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+(rng()-.5)*12,y-len*.55,x+(rng()-.5)*15,y-len); g.stroke();
  }

  // foreground framing trunks/canopy: dark, cropped, gives "inside forest" feeling
  for(let i=0;i<5;i++){
    const left=i<3;
    const x=left ? (-22+i*34) : (w+22-(i-2)*40);
    const base=h*1.04, top=h*(.03+rng()*.25), thick=18+rng()*30;
    v7branch(g,x,base,x+(left?25:-25)+(rng()-.5)*20,top,thick,'#09170f',.93);
    v7softBlob(g,x+(left?45:-45),h*(.15+rng()*.25),110+rng()*85,80+rng()*65,'#0c2516',.92,12,rng);
  }

  // subtle shafts through gaps
  g.save(); g.globalCompositeOperation='screen';
  for(let i=0;i<4;i++){
    const x=w*(.15+rng()*.7);
    const gr=g.createLinearGradient(x,h*.05,x+80,h*.72);
    gr.addColorStop(0,'rgba(242,255,215,.08)'); gr.addColorStop(1,'rgba(242,255,215,0)');
    g.fillStyle=gr; g.beginPath(); g.moveTo(x-25,0); g.lineTo(x+18,0); g.lineTo(x+135,h*.78); g.lineTo(x+40,h*.78); g.closePath(); g.fill();
  }
  g.restore();
  v7mistBand(g,w,h*.61,h*.09,.04);
}
function v7drawFlowerField(g,w,h,rng,kind='rose'){
  const isLav=kind==='lavender';
  sceneGradient(g,w,h,isLav
    ? [[0,'#cfd0e7'],[.38,'#e5ddea'],[.60,'#c8cfba'],[1,'#53684d']]
    : [[0,'#d8d4d2'],[.36,'#efe5e4'],[.59,'#c9d0b5'],[1,'#58694d']]);
  v7cloudBank(g,w,h,rng,isLav?.07:.08);
  v7hill(g,w,h,h*.55,h*.025,isLav?'#a8aa9d':'#aeb29d',.4,.65);
  v7hill(g,w,h,h*.61,h*.035,isLav?'#7c8b77':'#83916f',2.2,.82);
  v7mistBand(g,w,h*.58,h*.055,.075);

  // field base
  const field=g.createLinearGradient(0,h*.58,0,h);
  field.addColorStop(0,isLav?'#7c866f':'#819067');
  field.addColorStop(1,isLav?'#42523e':'#3f5238');
  g.fillStyle=field; g.fillRect(0,h*.58,w,h*.42);

  // Perspective rows: many tiny plants near horizon, larger near viewer.
  const rows=14;
  for(let r=0;r<rows;r++){
    const t=r/(rows-1);
    const depth=t*t;
    const y=v7lerp(h*.595,h*.99,depth);
    const scale=v7lerp(.12,1.15,depth);
    const alpha=v7lerp(.38,.98,depth);
    const spacing=v7lerp(12,42,depth);
    const offset=(r%2)*spacing*.48;
    for(let x=-spacing;x<w+spacing;x+=spacing){
      const px=x+offset+(rng()-.5)*spacing*.45;
      const py=y+(rng()-.5)*v7lerp(2,9,depth);
      const stemH=(isLav?16:13)*scale*(.75+rng()*.55);
      g.strokeStyle=isLav?`rgba(55,88,58,${alpha*.72})`:`rgba(44,91,47,${alpha*.78})`;
      g.lineWidth=Math.max(.45,scale*.95);
      g.beginPath(); g.moveTo(px,py+stemH*.8); g.lineTo(px+(rng()-.5)*2*scale,py-stemH*.45); g.stroke();
      if(isLav){
        const col=rng()>.55?'#7059a8':'#8770ba';
        for(let k=0;k<4;k++){
          const yy=py-stemH*.38+k*3*scale;
          v7leaf(g,px+(k%2?1:-1)*1.5*scale,yy,1.3*scale,col,alpha,.2*(k%2?1:-1));
        }
      }else{
        const cols=['#b83d55','#c54b62','#a8344d','#d05a6d','#9f3348'];
        const col=cols[Math.floor(rng()*cols.length)];
        v7flower(g,px,py-stemH*.5,2.2*scale,col,'#e9c5a0',alpha,rng()*Math.PI);
        if(depth>.35 && rng()>.45){
          v7leaf(g,px-3*scale,py+1*scale,2.1*scale,'#396443',alpha*.75,-.6);
          v7leaf(g,px+3*scale,py+3*scale,2.0*scale,'#426c49',alpha*.70,.6);
        }
      }
    }
  }

  // foreground grasses break the overly neat rows
  for(let i=0;i<90;i++){
    const x=rng()*w,y=h*(.82+rng()*.18),len=10+rng()*34;
    g.strokeStyle=isLav?'rgba(58,75,53,.38)':'rgba(47,77,44,.42)';
    g.lineWidth=.5+rng()*1.2; g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+(rng()-.5)*8,y-len*.55,x+(rng()-.5)*14,y-len); g.stroke();
  }
}
function v7drawOcean(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#16647a'],[.34,'#0c5369'],[.72,'#073b51'],[1,'#062b3d']]);
  // soft overhead glow
  const rg=g.createRadialGradient(w*.54,-20,0,w*.54,-20,w*.58);
  rg.addColorStop(0,'rgba(195,243,247,.25)'); rg.addColorStop(1,'rgba(195,243,247,0)');
  g.fillStyle=rg; g.fillRect(0,0,w,h*.75);

  // light rays
  g.save(); g.globalCompositeOperation='screen'; g.filter='blur(8px)';
  for(let i=0;i<7;i++){
    const x=w*(.05+i*.14)+rng()*30;
    g.fillStyle=`rgba(186,235,241,${.025+rng()*.035})`;
    g.beginPath(); g.moveTo(x,0); g.lineTo(x+45+rng()*80,0); g.lineTo(x+210+rng()*100,h*.88); g.lineTo(x+90+rng()*60,h*.88); g.closePath(); g.fill();
  }
  g.restore();

  // rocky seabed
  g.fillStyle='#082e36'; g.fillRect(0,h*.89,w,h*.11);
  for(let i=0;i<26;i++){
    const x=rng()*w,y=h*(.88+rng()*.13),rx=12+rng()*32,ry=5+rng()*12;
    ellipse(g,x,y,rx,ry,rng()>.5?'#183f42':'#244c4a',.72,rng()*.4);
  }

  // kelp with many overlapping ribbons
  for(let i=0;i<32;i++){
    const x=rng()*w, base=h*(.94+rng()*.06), len=45+rng()*135, sway=(rng()-.5)*45;
    g.strokeStyle=rng()>.5?'rgba(31,111,81,.56)':'rgba(27,91,72,.62)';
    g.lineWidth=2+rng()*5; g.lineCap='round';
    g.beginPath(); g.moveTo(x,base); g.bezierCurveTo(x+sway*.2,base-len*.3,x+sway*.9,base-len*.7,x+sway,base-len); g.stroke();
  }
  v7mistBand(g,w,h*.66,h*.13,.025);
}
function v7drawCyber(g,w,h,rng,terminal=false){
  sceneGradient(g,w,h,terminal?[[0,'#010905'],[.68,'#03160b'],[1,'#010604']]:[[0,'#070b19'],[.44,'#13152b'],[.76,'#16122a'],[1,'#070914']]);
  const horizon=h*.72;

  // atmospheric neon haze instead of loud blocks
  const haze=g.createRadialGradient(w*.50,horizon,0,w*.50,horizon,w*.55);
  haze.addColorStop(0,terminal?'rgba(34,197,94,.075)':'rgba(81,193,230,.105)');
  haze.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=haze; g.fillRect(0,h*.25,w,h*.60);

  // distant skyline, irregular + antennae
  for(let i=0,x=-10;x<w+30;i++){
    const bw=18+rng()*42,bh=45+rng()*150,base=horizon+rng()*10;
    const col=terminal?'#03170b':(rng()>.5?'#10162a':'#16162d');
    g.fillStyle=col; g.fillRect(x,base-bh,bw,bh);
    if(rng()>.72){
      g.strokeStyle=terminal?'rgba(62,212,115,.20)':'rgba(114,202,238,.18)';
      g.lineWidth=1; g.beginPath(); g.moveTo(x+bw*.5,base-bh); g.lineTo(x+bw*.5,base-bh-18-rng()*28); g.stroke();
    }
    // sparse windows
    const win=terminal?'rgba(69,226,126,.18)':(rng()>.5?'rgba(80,220,235,.22)':'rgba(214,87,214,.18)');
    g.fillStyle=win;
    for(let yy=base-bh+10;yy<base-8;yy+=10+rng()*5){
      if(rng()>.45) g.fillRect(x+5+rng()*Math.max(2,bw-12),yy,1.5+rng()*2.5,2);
    }
    x += bw+3+rng()*8;
  }

  // wet ground / faint perspective lines
  const ground=g.createLinearGradient(0,horizon,0,h);
  ground.addColorStop(0,terminal?'rgba(2,24,11,.60)':'rgba(9,13,25,.55)');
  ground.addColorStop(1,terminal?'#010503':'#04060d');
  g.fillStyle=ground; g.fillRect(0,horizon,w,h-horizon);
  g.save(); g.globalAlpha=.10; g.strokeStyle=terminal?'#3bd77a':'#5ccfe8'; g.lineWidth=1;
  for(let i=1;i<8;i++){const yy=horizon+(h-horizon)*Math.pow(i/8,1.7);g.beginPath();g.moveTo(0,yy);g.lineTo(w,yy);g.stroke();}
  for(let i=-8;i<=8;i++){g.beginPath();g.moveTo(w*.5,horizon);g.lineTo(w*.5+i*w*.11,h);g.stroke();}
  g.restore();
}
function v7drawStaticScene(g,w,h,meta){
  const rng=v7rng(v7seedFor(meta.scene,w,h));
  switch(meta.scene){
    case 'forest': v7drawForest(g,w,h,rng); break;
    case 'rose': v7drawFlowerField(g,w,h,rng,'rose'); break;
    case 'lavender': v7drawFlowerField(g,w,h,rng,'lavender'); break;
    case 'ocean': v7drawOcean(g,w,h,rng); break;
    case 'cyber': v7drawCyber(g,w,h,rng,false); break;
    case 'terminal': v7drawCyber(g,w,h,rng,true); break;
    default: drawStaticScene(g,w,h,meta);
  }

  // universal soft atmospheric finish
  const top=g.createLinearGradient(0,0,0,h);
  top.addColorStop(0,'rgba(255,255,255,.018)');
  top.addColorStop(.65,'rgba(255,255,255,0)');
  top.addColorStop(1,'rgba(0,0,0,.07)');
  g.fillStyle=top; g.fillRect(0,0,w,h);
}
function getSceneCache(meta,w,h){
  const key=`v7:${meta.id}:${w}x${h}`;
  if(sceneCacheKey===key&&sceneCache)return sceneCache;
  sceneCache=mkOffscreen(w,h);
  sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});
  v7drawStaticScene(sceneCacheCtx,w,h,meta);
  sceneCacheKey=key;
  return sceneCache;
}

// Reduce moving objects. Dense realism comes from the cached scenery, not noisy particles.
const __v7InitBackgroundObjects = initBackgroundObjects;
initBackgroundObjects = function(){
  __v7InitBackgroundObjects();
  const s=getThemeMeta().scene;
  const limits={forest:26,rose:16,lavender:14,ocean:22,cyber:16,terminal:18,sakura:18,peach:15};
  if(limits[s] && themeFxParticles.length>limits[s]) themeFxParticles.length=limits[s];
};

// Make theme picker describe the new approach.

(function(){
  const oldEnsure=ensureThemePicker;
  ensureThemePicker=function(){
    oldEnsure();
    const small=document.querySelector('#themePickerOverlay .theme-picker-head small');
    if(small)small.textContent='Layered canvas landscapes · subtle motion · optimized cache';
  };
})();


// ==========================================================================
// SCENE V8 — COMPLETE THEME ART PASS
// Every theme now has its own layered procedural composition.
// ==========================================================================

function v8rectRound(g,x,y,w,h,r,fill,alpha=1){
  g.save(); g.globalAlpha=alpha; g.fillStyle=fill;
  g.beginPath();
  g.moveTo(x+r,y); g.lineTo(x+w-r,y); g.quadraticCurveTo(x+w,y,x+w,y+r);
  g.lineTo(x+w,y+h-r); g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  g.lineTo(x+r,y+h); g.quadraticCurveTo(x,y+h,x,y+h-r);
  g.lineTo(x,y+r); g.quadraticCurveTo(x,y,x+r,y); g.closePath(); g.fill(); g.restore();
}
function v8stars(g,w,h,rng,count=70,alpha=.8){
  g.save();
  for(let i=0;i<count;i++){
    const x=rng()*w,y=rng()*h*.66,r=.35+rng()*1.5,a=(.18+rng()*.72)*alpha;
    g.fillStyle=`rgba(240,247,255,${a})`;
    g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.fill();
  }
  g.restore();
}
function v8tree(g,x,base,scale,rng,leaf='#244b31',trunk='#2b2117',alpha=1){
  const top=base-110*scale;
  v7branch(g,x,base,x+(rng()-.5)*16*scale,top,7*scale,trunk,alpha);
  for(let b=0;b<4;b++){
    const yy=base-30*scale-b*18*scale;
    const side=b%2?1:-1;
    v7branch(g,x,yy,x+side*(28+rng()*28)*scale,yy-(15+rng()*18)*scale,2.3*scale,trunk,alpha*.88);
  }
  v7softBlob(g,x,top+20*scale,52*scale,46*scale,leaf,alpha,10,rng);
}
function v8mountain(g,w,h,base,color,alpha,rng,amp=.24){
  g.save(); g.globalAlpha=alpha; g.fillStyle=color; g.beginPath(); g.moveTo(0,h);
  let x=0; g.lineTo(0,base);
  while(x<w){
    const bw=70+rng()*150, peak=base-(55+rng()*h*amp);
    g.lineTo(x+bw*.50,peak); g.lineTo(x+bw,base+(rng()-.5)*20); x+=bw;
  }
  g.lineTo(w,h); g.closePath(); g.fill(); g.restore();
}
function v8drawNight(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#07111e'],[.44,'#101d31'],[.72,'#18273a'],[1,'#081218']]);
  v8stars(g,w,h,rng,110,.85);
  ellipse(g,w*.78,h*.16,28,28,'#eaf3ff',.78);
  const moonGlow=g.createRadialGradient(w*.78,h*.16,15,w*.78,h*.16,110);
  moonGlow.addColorStop(0,'rgba(210,230,255,.12)');moonGlow.addColorStop(1,'rgba(210,230,255,0)');
  g.fillStyle=moonGlow;g.fillRect(0,0,w,h*.5);
  v8mountain(g,w,h,h*.64,'#1a2c3c',.78,rng,.16);
  v8mountain(g,w,h,h*.73,'#10212e',.96,rng,.12);
  const lake=g.createLinearGradient(0,h*.72,0,h);lake.addColorStop(0,'#0d2630');lake.addColorStop(1,'#061217');
  g.fillStyle=lake;g.fillRect(0,h*.72,w,h*.28);
  g.save();g.globalAlpha=.15;g.strokeStyle='#bbd7ef';g.lineWidth=1;
  for(let i=0;i<16;i++){const y=h*.75+i*8+rng()*4;g.beginPath();g.moveTo(w*.62+rng()*80,y);g.lineTo(w*.90-rng()*60,y);g.stroke();}
  g.restore();
  for(let i=0;i<10;i++) v8tree(g,(i+.2)*w/9,h*.94,.45+rng()*.28,rng,'#0d251c','#111914',.9);
}
function v8drawDay(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#8bc9e9'],[.50,'#c8e7f4'],[.68,'#e8efe1'],[1,'#64855b']]);
  ellipse(g,w*.78,h*.14,38,38,'#fff4bf',.84);
  v7cloudBank(g,w,h,rng,.12);
  v7hill(g,w,h,h*.64,20,'#a8c99a',.5,.75);
  v7hill(g,w,h,h*.73,26,'#7ca36f',2,.9);
  const meadow=g.createLinearGradient(0,h*.71,0,h);meadow.addColorStop(0,'#7fa169');meadow.addColorStop(1,'#4f6f45');
  g.fillStyle=meadow;g.fillRect(0,h*.71,w,h*.29);
  for(let i=0;i<120;i++){
    const x=rng()*w,y=h*(.76+rng()*.24),len=8+rng()*22;
    g.strokeStyle=rng()>.5?'rgba(58,94,48,.38)':'rgba(82,112,62,.42)';
    g.lineWidth=.6+rng();g.beginPath();g.moveTo(x,y);g.lineTo(x+(rng()-.5)*8,y-len);g.stroke();
    if(rng()>.86)v7flower(g,x,y-len,1.4+rng()*1.6,rng()>.5?'#f0e7d0':'#d8b7c5','#d7b36a',.65,rng()*6.28);
  }
}
function v8drawMidnight(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#030714'],[.44,'#0e1730'],[.70,'#182343'],[1,'#07101d']]);
  v8stars(g,w,h,rng,95,.72);
  ellipse(g,w*.72,h*.18,44,44,'#dfe8ff',.88);
  v8mountain(g,w,h,h*.58,'#27334f',.52,rng,.23);
  v8mountain(g,w,h,h*.70,'#18243c',.88,rng,.18);
  v8mountain(g,w,h,h*.79,'#0b1628',1,rng,.12);
  const lake=g.createLinearGradient(0,h*.75,0,h);lake.addColorStop(0,'#0a1b2a');lake.addColorStop(1,'#030910');
  g.fillStyle=lake;g.fillRect(0,h*.75,w,h*.25);
  g.save();g.globalCompositeOperation='screen';
  const refl=g.createLinearGradient(w*.72,h*.76,w*.72,h);
  refl.addColorStop(0,'rgba(213,230,255,.18)');refl.addColorStop(1,'rgba(213,230,255,0)');
  g.fillStyle=refl;g.beginPath();g.moveTo(w*.68,h*.76);g.lineTo(w*.76,h*.76);g.lineTo(w*.82,h);g.lineTo(w*.60,h);g.closePath();g.fill();g.restore();
}
function v8drawOLED(g,w,h,rng){
  g.fillStyle='#000';g.fillRect(0,0,w,h);
  v8stars(g,w,h,rng,48,.55);
  const aur=g.createRadialGradient(w*.52,h*.46,0,w*.52,h*.46,w*.56);
  aur.addColorStop(0,'rgba(51,255,143,.055)');aur.addColorStop(.42,'rgba(76,98,255,.025)');aur.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=aur;g.fillRect(0,0,w,h);
  v8mountain(g,w,h,h*.84,'#020604',1,rng,.11);
}
function v8drawSunset(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#4c315e'],[.32,'#ad5d6a'],[.61,'#e89d78'],[.80,'#f3c78b'],[1,'#3c4940']]);
  ellipse(g,w*.72,h*.42,52,52,'#f8d196',.85);
  v8mountain(g,w,h,h*.62,'#7b6372',.52,rng,.17);
  v8mountain(g,w,h,h*.73,'#57566a',.82,rng,.13);
  v7hill(g,w,h,h*.82,24,'#384943',1.4,.95);
  const field=g.createLinearGradient(0,h*.80,0,h);field.addColorStop(0,'#4b5b47');field.addColorStop(1,'#26362d');
  g.fillStyle=field;g.fillRect(0,h*.80,w,h*.20);
  for(let i=0;i<65;i++){
    const x=rng()*w,y=h*(.84+rng()*.16),len=8+rng()*26;
    g.strokeStyle='rgba(45,65,45,.50)';g.lineWidth=.7+rng();g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+5,y-len*.6,x+(rng()-.5)*10,y-len);g.stroke();
  }
}
function v8drawCoffee(g,w,h,rng){
  // Warm rainy café interior
  sceneGradient(g,w,h,[[0,'#19110d'],[.55,'#2d1e16'],[1,'#120c09']]);

  // window glow
  const wx=w*.10, wy=h*.09, ww=w*.44, wh=h*.55;
  v8rectRound(g,wx,wy,ww,wh,10,'#161819',1);
  const glass=g.createLinearGradient(wx,wy,wx,wy+wh);
  glass.addColorStop(0,'#32414a');glass.addColorStop(.55,'#26333a');glass.addColorStop(1,'#171f23');
  v8rectRound(g,wx+8,wy+8,ww-16,wh-16,6,glass,1);
  // distant rainy city bokeh
  for(let i=0;i<34;i++){
    const x=wx+18+rng()*(ww-36), y=wy+18+rng()*(wh-36), r=2+rng()*7;
    const c=rng()>.55?'#d99d61':rng()>.5?'#b76e4b':'#6a9e9b';
    ellipse(g,x,y,r,r,c,.06+rng()*.12);
  }
  g.strokeStyle='rgba(225,191,154,.18)';g.lineWidth=4;
  g.beginPath();g.moveTo(wx+ww*.5,wy+5);g.lineTo(wx+ww*.5,wy+wh-5);g.moveTo(wx+5,wy+wh*.52);g.lineTo(wx+ww-5,wy+wh*.52);g.stroke();

  // rain streaks on glass
  g.save();g.lineCap='round';
  for(let i=0;i<55;i++){
    const x=wx+15+rng()*(ww-30), y=wy+10+rng()*(wh-25), len=8+rng()*28;
    g.strokeStyle=`rgba(211,226,230,${.035+rng()*.065})`;g.lineWidth=.5+rng()*.8;
    g.beginPath();g.moveTo(x,y);g.lineTo(x-2-rng()*3,y+len);g.stroke();
  }
  g.restore();

  // hanging lamp
  g.strokeStyle='#34251c';g.lineWidth=3;g.beginPath();g.moveTo(w*.76,0);g.lineTo(w*.76,h*.17);g.stroke();
  g.fillStyle='#7a5133';g.beginPath();g.moveTo(w*.70,h*.17);g.lineTo(w*.82,h*.17);g.lineTo(w*.79,h*.25);g.lineTo(w*.73,h*.25);g.closePath();g.fill();
  const glow=g.createRadialGradient(w*.76,h*.28,8,w*.76,h*.28,150);
  glow.addColorStop(0,'rgba(255,198,112,.22)');glow.addColorStop(1,'rgba(255,198,112,0)');
  g.fillStyle=glow;g.fillRect(w*.55,h*.10,w*.42,h*.50);

  // table
  g.fillStyle='#3c281b';g.fillRect(0,h*.73,w,h*.27);
  g.fillStyle='rgba(255,218,174,.05)';g.fillRect(0,h*.73,w,3);
  for(let i=0;i<11;i++){g.strokeStyle='rgba(255,225,190,.025)';g.beginPath();g.moveTo(i*w/10,h*.73);g.lineTo((i+.2)*w/10,h);g.stroke();}

  // cup + saucer
  const cx=w*.64, cy=h*.73;
  ellipse(g,cx,cy+52,74,10,'#d8c5b2',.78);
  v8rectRound(g,cx-42,cy-4,84,54,11,'#dbc9b9',1);
  ellipse(g,cx,cy-4,42,8,'#eadfd5',1);
  ellipse(g,cx,cy-3,34,5.5,'#2c170f',1);
  g.strokeStyle='#d8c5b2';g.lineWidth=7;g.beginPath();g.arc(cx+46,cy+20,18,-1.1,1.1);g.stroke();

  // small book / napkin
  v8rectRound(g,w*.77,h*.79,90,16,3,'#5f4331',.9);
  v8rectRound(g,w*.78,h*.775,82,10,2,'#d4c2ab',.35);
}
function v8drawMeadow(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#9fd6df'],[.52,'#dcefe9'],[.69,'#c3d6ad'],[1,'#4e7248']]);
  v7cloudBank(g,w,h,rng,.10);
  v7hill(g,w,h,h*.60,18,'#a6c296',1,.75);
  v7hill(g,w,h,h*.69,24,'#7ea670',2.1,.92);
  const field=g.createLinearGradient(0,h*.68,0,h);field.addColorStop(0,'#79a369');field.addColorStop(1,'#466d45');
  g.fillStyle=field;g.fillRect(0,h*.68,w,h*.32);
  for(let i=0;i<175;i++){
    const x=rng()*w,y=h*(.70+rng()*.30),depth=(y-h*.70)/(h*.30),s=.5+depth*2.3;
    if(rng()>.72)v7flower(g,x,y,1.3*s,rng()>.5?'#f3f1d1':'#d7d7f0','#e2c16d',.52+depth*.38,rng()*6.28);
    else {g.strokeStyle='rgba(52,92,48,.35)';g.lineWidth=.5+s*.2;g.beginPath();g.moveTo(x,y);g.lineTo(x+(rng()-.5)*7,y-(6+rng()*18)*s);g.stroke();}
  }
}
function v8drawSakura(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#070b1b'],[.48,'#171b36'],[.74,'#2c243d'],[1,'#160f1b']]);
  v8stars(g,w,h,rng,45,.42);ellipse(g,w*.78,h*.16,34,34,'#f1e9ff',.80);
  v7hill(g,w,h,h*.74,22,'#20243a',1,.7);v7hill(g,w,h,h*.82,18,'#111725',2.2,.95);

  // pathway
  g.fillStyle='#171517';g.beginPath();g.moveTo(w*.43,h*.60);g.lineTo(w*.57,h*.60);g.lineTo(w*.73,h);g.lineTo(w*.27,h);g.closePath();g.fill();
  // lanterns
  for(let i=0;i<5;i++){
    const t=i/5, y=h*(.68+t*.06), spread=v7lerp(w*.09,w*.26,t), size=v7lerp(3,7,t);
    for(const side of [-1,1]){
      const x=w*.5+side*spread;
      g.fillStyle='#33241e';g.fillRect(x-size*.15,y,size*.3,size*3);
      const gl=g.createRadialGradient(x,y,1,x,y,24*size/6);gl.addColorStop(0,'rgba(255,183,104,.24)');gl.addColorStop(1,'rgba(255,183,104,0)');
      g.fillStyle=gl;g.fillRect(x-25,y-25,50,50);
      v8rectRound(g,x-size*.7,y-size*.2,size*1.4,size,2,'#d18b53',.85);
    }
  }
  // arching sakura branches from both sides
  for(const side of [-1,1]){
    const sx=side<0?-20:w+20, sy=h*.72;
    const ex=w*.5+side*w*.08, ey=h*.28;
    v7branch(g,sx,sy,ex,ey,18,'#25161c',.95);
    for(let b=0;b<8;b++){
      const t=.18+b*.09, bx=v7lerp(sx,ex,t), by=v7lerp(sy,ey,t), dir=side*(b%2?1:-1);
      const tx=bx+dir*(35+rng()*75),ty=by-(20+rng()*55);
      v7branch(g,bx,by,tx,ty,5,'#2c1820',.9);
      for(let k=0;k<8;k++)ellipse(g,tx+(rng()-.5)*50,ty+(rng()-.5)*32,2.2+rng()*3.2,1.8+rng()*2.4,rng()>.5?'#ef9db1':'#d97899',.58+rng()*.25,rng()*6.28);
    }
  }
}
function v8drawSky(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#63b8df'],[.48,'#9bd3eb'],[.78,'#d8edf4'],[1,'#eef6f7']]);
  const sun=g.createRadialGradient(w*.78,h*.12,0,w*.78,h*.12,120);
  sun.addColorStop(0,'rgba(255,249,213,.38)');sun.addColorStop(1,'rgba(255,249,213,0)');
  g.fillStyle=sun;g.fillRect(0,0,w,h*.55);
  // layered sea of clouds
  for(let layer=0;layer<4;layer++){
    const y=h*(.48+layer*.13), a=.16+layer*.10;
    for(let i=0;i<8;i++){
      const x=(i-.4)*w/6+(rng()-.5)*60;
      v7softBlob(g,x,y+(rng()-.5)*25,100+layer*24+rng()*65,38+layer*12+rng()*20,'#ffffff',a,8,rng);
    }
  }
}
function v8drawOrchard(g,w,h,rng,kind){
  const lemon=kind==='lemon';
  sceneGradient(g,w,h,lemon?[[0,'#b7d8cf'],[.49,'#dce8d1'],[.67,'#b6c89a'],[1,'#49603e']]:[[0,'#c9ceda'],[.48,'#eadad8'],[.68,'#c4c6a4'],[1,'#536045']]);
  v7cloudBank(g,w,h,rng,.065);
  v7hill(g,w,h,h*.58,18,'#a7b994',1,.65);
  const ground=g.createLinearGradient(0,h*.60,0,h);ground.addColorStop(0,'#84976f');ground.addColorStop(1,'#4a5f41');
  g.fillStyle=ground;g.fillRect(0,h*.60,w,h*.40);

  // orchard rows converge toward vanishing point
  const vp=w*.5, horizon=h*.59;
  for(let row=-4;row<=4;row++){
    for(let j=0;j<8;j++){
      const t=j/7, depth=t*t;
      const y=v7lerp(horizon+8,h*.98,depth);
      const lane=row*v7lerp(16,92,depth);
      const x=vp+lane;
      const sc=v7lerp(.18,1.05,depth);
      v8tree(g,x,y,sc,rng,lemon?'#426e3e':'#647f58','#5d4430',.48+depth*.48);
      const fruit=lemon?'#e2c839':'#da8c79';
      for(let f=0;f<4;f++){
        const fx=x+(rng()-.5)*36*sc, fy=y-73*sc+(rng()-.5)*34*sc;
        ellipse(g,fx,fy,3.2*sc,3.6*sc,fruit,.42+depth*.45);
      }
    }
  }
  v7mistBand(g,w,h*.60,h*.045,.05);
}
function v8drawGrape(g,w,h,rng){
  // Vineyard at purple dusk, replacing abstract nebula
  sceneGradient(g,w,h,[[0,'#3d3158'],[.42,'#74617b'],[.69,'#b0897d'],[1,'#3c493b']]);
  ellipse(g,w*.76,h*.30,34,34,'#e7c49c',.42);
  v8mountain(g,w,h,h*.58,'#63566d',.42,rng,.13);
  v7hill(g,w,h,h*.67,19,'#58634e',1.4,.72);
  const ground=g.createLinearGradient(0,h*.66,0,h);ground.addColorStop(0,'#526047');ground.addColorStop(1,'#28352a');
  g.fillStyle=ground;g.fillRect(0,h*.66,w,h*.34);

  const vp=w*.5, horizon=h*.65;
  for(let row=-6;row<=6;row++){
    g.strokeStyle='rgba(35,42,29,.48)';g.lineWidth=1;
    g.beginPath();g.moveTo(vp+row*8,horizon);g.lineTo(vp+row*115,h);g.stroke();
    for(let j=0;j<10;j++){
      const t=(j+1)/10,depth=t*t,y=v7lerp(horizon,h*.98,depth),x=vp+row*v7lerp(10,112,depth),sc=v7lerp(.12,.75,depth);
      g.strokeStyle='#463827';g.lineWidth=1+sc*2;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-35*sc);g.stroke();
      v7softBlob(g,x,y-34*sc,22*sc,13*sc,'#334c32',.45+depth*.4,6,rng);
      if(depth>.28 && rng()>.3){
        for(let k=0;k<6;k++)ellipse(g,x+(rng()-.5)*11*sc,y-26*sc+rng()*10*sc,2.0*sc,2.3*sc,rng()>.5?'#4d2d65':'#5f3975',.55+depth*.3);
      }
    }
  }
}
function v8drawPeach(g,w,h,rng){v8drawOrchard(g,w,h,rng,'peach')}
function v8drawLemon(g,w,h,rng){v8drawOrchard(g,w,h,rng,'lemon')}

function v8drawStaticScene(g,w,h,meta){
  const rng=v7rng(v7seedFor('v8-'+meta.scene,w,h));
  switch(meta.scene){
    case 'night':v8drawNight(g,w,h,rng);break;
    case 'day':v8drawDay(g,w,h,rng);break;
    case 'midnight':v8drawMidnight(g,w,h,rng);break;
    case 'oled':v8drawOLED(g,w,h,rng);break;
    case 'forest':v7drawForest(g,w,h,rng);break;
    case 'rose':v7drawFlowerField(g,w,h,rng,'rose');break;
    case 'lavender':v7drawFlowerField(g,w,h,rng,'lavender');break;
    case 'ocean':v7drawOcean(g,w,h,rng);break;
    case 'sunset':v8drawSunset(g,w,h,rng);break;
    case 'coffee':v8drawCoffee(g,w,h,rng);break;
    case 'meadow':v8drawMeadow(g,w,h,rng);break;
    case 'sakura':v8drawSakura(g,w,h,rng);break;
    case 'sky':v8drawSky(g,w,h,rng);break;
    case 'lemon':v8drawLemon(g,w,h,rng);break;
    case 'peach':v8drawPeach(g,w,h,rng);break;
    case 'cyber':v7drawCyber(g,w,h,rng,false);break;
    case 'grape':v8drawGrape(g,w,h,rng);break;
    case 'terminal':v7drawCyber(g,w,h,rng,true);break;
    default:v7drawStaticScene(g,w,h,meta);
  }
  const vign=g.createRadialGradient(w*.50,h*.42,Math.min(w,h)*.18,w*.50,h*.46,Math.max(w,h)*.78);
  const light=['day','rose','lavender','meadow','sky','lemon','peach'].includes(meta.scene);
  vign.addColorStop(0,'rgba(255,255,255,0)');
  vign.addColorStop(1,light?'rgba(55,70,65,.05)':'rgba(0,0,0,.15)');
  g.fillStyle=vign;g.fillRect(0,0,w,h);
}
getSceneCache=function(meta,w,h){
  const key=`v8:${meta.id}:${w}x${h}`;
  if(sceneCacheKey===key&&sceneCache)return sceneCache;
  sceneCache=mkOffscreen(w,h);
  sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});
  v8drawStaticScene(sceneCacheCtx,w,h,meta);
  sceneCacheKey=key;
  return sceneCache;
};

// Refine dynamic particle amount theme by theme.
const __v8InitBackgroundObjects=initBackgroundObjects;
initBackgroundObjects=function(){
  __v8InitBackgroundObjects();
  const s=getThemeMeta().scene;
  const limits={
    night:18,day:8,midnight:18,oled:10,forest:22,rose:14,lavender:13,ocean:18,
    sunset:8,coffee:7,meadow:10,sakura:16,sky:8,lemon:9,peach:13,cyber:12,grape:9,terminal:14
  };
  if(limits[s]!=null && themeFxParticles.length>limits[s])themeFxParticles.length=limits[s];
};

// Updated scene names in picker.
Object.assign(THEME_SCENE_LABELS,{
  night:'Moonlit lake · stars',
  day:'Morning meadow',
  midnight:'Moonlit alpine lake',
  oled:'Black horizon · faint aurora',
  forest:'Deep forest · mist · fireflies',
  rose:'Rose field · perspective rows',
  lavender:'Lavender field · distant hills',
  ocean:'Deep water · rays · kelp',
  sunset:'Warm mountain valley',
  coffee:'Rainy café · warm window',
  meadow:'Wildflower meadow',
  sakura:'Moonlit sakura path',
  sky:'Sea of clouds',
  lemon:'Lemon orchard',
  peach:'Peach orchard',
  cyber:'Neon city · wet grid',
  grape:'Vineyard at purple dusk',
  terminal:'Terminal skyline'
});


// ==========================================================================
// SCENE V9 — REQUESTED REDESIGNS
// Rose = glass conservatory / garden terrace
// Lavender = Provence-style stone courtyard
// Lemon = Mediterranean lemon patio
// Peach = Japanese peach-blossom garden
// Ocean = reef + fish schools
// Sakura = traditional Japanese street / shrine approach
// Cyber / Terminal = clearer luminous architecture
// Coffee = populated café interior
// ==========================================================================

function v9person(g,x,y,s,rng,shirt='#6f5142',alpha=.88){
  g.save();g.globalAlpha=alpha;
  // head/hair
  g.fillStyle='#d2aa8d';g.beginPath();g.arc(x,y-19*s,5.2*s,0,Math.PI*2);g.fill();
  g.fillStyle=rng()>.5?'#251d1a':'#443129';g.beginPath();g.arc(x,y-21*s,5.3*s,Math.PI,Math.PI*2);g.fill();
  // torso
  g.fillStyle=shirt;g.beginPath();g.roundRect(x-7*s,y-14*s,14*s,19*s,4*s);g.fill();
  // arms toward table
  g.strokeStyle='#c89e82';g.lineWidth=2.2*s;g.lineCap='round';
  g.beginPath();g.moveTo(x-5*s,y-9*s);g.lineTo(x-10*s,y-1*s);g.moveTo(x+5*s,y-9*s);g.lineTo(x+10*s,y-1*s);g.stroke();
  g.restore();
}
function v9tableSet(g,x,y,s,rng,people=2){
  // legs
  g.strokeStyle='rgba(55,38,28,.72)';g.lineWidth=3*s;g.beginPath();g.moveTo(x,y+5*s);g.lineTo(x-7*s,y+30*s);g.moveTo(x,y+5*s);g.lineTo(x+7*s,y+30*s);g.stroke();
  // tabletop
  ellipse(g,x,y,30*s,7*s,'#6b4932',.94);
  ellipse(g,x,y-1*s,28*s,5*s,'#8a6143',.62);
  // cups
  for(let i=0;i<people;i++){
    const cx=x+(i-(people-1)/2)*13*s;
    v8rectRound(g,cx-3*s,y-8*s,6*s,6*s,1.5*s,'#d8c7b5',.9);
    ellipse(g,cx,y-8*s,3*s,1*s,'#2a160f',.9);
  }
  const shirts=['#765346','#52616b','#6b5a77','#506650','#8a6650'];
  if(people>=1)v9person(g,x-19*s,y-2*s,s,rng,shirts[Math.floor(rng()*shirts.length)],.82);
  if(people>=2)v9person(g,x+19*s,y-2*s,s,rng,shirts[Math.floor(rng()*shirts.length)],.82);
}
function v9drawCoffee(g,w,h,rng){
  // Deeper café with perspective, multiple tables and patrons.
  sceneGradient(g,w,h,[[0,'#17100c'],[.48,'#2b1c14'],[1,'#0f0a08']]);

  // long rainy windows across the back wall
  const wy=h*.08, wh=h*.48;
  for(let p=0;p<4;p++){
    const wx=w*(.055+p*.225), ww=w*.19;
    v8rectRound(g,wx,wy,ww,wh,7,'#141718',1);
    const glass=g.createLinearGradient(wx,wy,wx,wy+wh);
    glass.addColorStop(0,'#35434a');glass.addColorStop(.62,'#28343a');glass.addColorStop(1,'#171e21');
    v8rectRound(g,wx+6,wy+6,ww-12,wh-12,4,glass,1);
    // blurred outside lights
    for(let i=0;i<10;i++){
      const bx=wx+12+rng()*(ww-24),by=wy+14+rng()*(wh-30),br=2+rng()*5;
      ellipse(g,bx,by,br,br,rng()>.55?'#d99959':'#739a9a',.07+rng()*.09);
    }
    // rain
    g.save();g.lineCap='round';
    for(let i=0;i<18;i++){
      const rx=wx+10+rng()*(ww-20),ry=wy+8+rng()*(wh-20),len=7+rng()*20;
      g.strokeStyle=`rgba(220,232,233,${.025+rng()*.055})`;g.lineWidth=.5+rng()*.7;
      g.beginPath();g.moveTo(rx,ry);g.lineTo(rx-2,ry+len);g.stroke();
    }
    g.restore();
  }

  // ceiling + pendant lamps
  g.fillStyle='#120c09';g.fillRect(0,0,w,h*.10);
  for(let i=0;i<5;i++){
    const lx=w*(.10+i*.20);
    g.strokeStyle='#2d211a';g.lineWidth=2;g.beginPath();g.moveTo(lx,0);g.lineTo(lx,h*(.15+(i%2)*.035));g.stroke();
    const ly=h*(.15+(i%2)*.035);
    g.fillStyle='#7b5234';g.beginPath();g.moveTo(lx-20,ly);g.lineTo(lx+20,ly);g.lineTo(lx+12,ly+22);g.lineTo(lx-12,ly+22);g.closePath();g.fill();
    const glow=g.createRadialGradient(lx,ly+25,2,lx,ly+25,90);
    glow.addColorStop(0,'rgba(255,188,103,.18)');glow.addColorStop(1,'rgba(255,188,103,0)');
    g.fillStyle=glow;g.fillRect(lx-90,ly-30,180,150);
  }

  // floor with perspective boards
  const floor=g.createLinearGradient(0,h*.55,0,h);floor.addColorStop(0,'#39261b');floor.addColorStop(1,'#1b120d');
  g.fillStyle=floor;g.fillRect(0,h*.55,w,h*.45);
  g.save();g.strokeStyle='rgba(232,191,148,.035)';g.lineWidth=1;
  for(let i=-8;i<=8;i++){g.beginPath();g.moveTo(w*.5,h*.55);g.lineTo(w*.5+i*w*.11,h);g.stroke();}
  for(let i=1;i<8;i++){const yy=h*.55+(h*.45)*Math.pow(i/8,1.55);g.beginPath();g.moveTo(0,yy);g.lineTo(w,yy);g.stroke();}
  g.restore();

  // bar counter at one side
  v8rectRound(g,w*.76,h*.45,w*.26,h*.18,5,'#4b3021',.94);
  g.fillStyle='#765038';g.fillRect(w*.75,h*.445,w*.25,8);
  for(let i=0;i<5;i++)ellipse(g,w*(.79+i*.045),h*.43,5,10,'#b18a64',.34);

  // many table groups, perspective scaled
  const sets=[
    [.18,.62,.48,2],[.42,.64,.50,2],[.66,.63,.47,1],
    [.10,.77,.72,2],[.34,.79,.78,2],[.61,.78,.74,2],[.84,.77,.68,2],
    [.22,.94,1.03,2],[.54,.93,1.05,2],[.82,.93,.98,2]
  ];
  for(const [xx,yy,s,p] of sets)v9tableSet(g,w*xx,h*yy,s,rng,p);

  // foreground chair silhouettes for depth
  g.save();g.globalAlpha=.75;g.fillStyle='#17100c';
  for(let i=0;i<4;i++){
    const x=w*(.04+i*.31);v8rectRound(g,x,h*.88,42,70,9,'#17100c',.72);
  }
  g.restore();
}
function v9drawRose(g,w,h,rng){
  // Elegant glass conservatory / rose garden, not a field.
  sceneGradient(g,w,h,[[0,'#c8d4d3'],[.48,'#e6dfd8'],[1,'#6e7d68']]);
  // greenhouse glass roof
  g.save();g.strokeStyle='rgba(66,82,76,.28)';g.lineWidth=3;
  for(let i=0;i<=8;i++){const x=i*w/8;g.beginPath();g.moveTo(w*.5,h*.05);g.lineTo(x,h*.52);g.stroke();}
  g.beginPath();g.moveTo(0,h*.52);g.lineTo(w,h*.52);g.stroke();g.restore();
  // glass light
  const light=g.createLinearGradient(0,0,0,h*.6);light.addColorStop(0,'rgba(255,255,255,.24)');light.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=light;g.fillRect(0,0,w,h*.62);

  // tiled central walkway
  g.fillStyle='#9b9486';g.beginPath();g.moveTo(w*.43,h*.52);g.lineTo(w*.57,h*.52);g.lineTo(w*.72,h);g.lineTo(w*.28,h);g.closePath();g.fill();
  g.save();g.strokeStyle='rgba(69,63,57,.14)';g.lineWidth=1;
  for(let i=1;i<8;i++){const t=i/8,y=v7lerp(h*.53,h,Math.pow(t,1.65));g.beginPath();g.moveTo(w*.43-(y-h*.52)*.31,y);g.lineTo(w*.57+(y-h*.52)*.31,y);g.stroke();}
  g.restore();

  // dense rose bushes on both sides
  for(const side of [-1,1]){
    for(let j=0;j<15;j++){
      const t=j/14, depth=t*t, y=v7lerp(h*.55,h*.98,depth);
      const edge=w*.5+side*v7lerp(w*.10,w*.38,depth);
      const sc=v7lerp(.24,1.15,depth);
      v7softBlob(g,edge+side*(20+rng()*30)*sc,y-18*sc,38*sc,25*sc,rng()>.5?'#365f43':'#2d543b',.68+depth*.25,8,rng);
      for(let k=0;k<5;k++){
        const cols=['#a93850','#c34d64','#d36a78','#8f3046'];
        v7flower(g,edge+(rng()-.5)*55*sc,y-25*sc+(rng()-.5)*30*sc,2.5*sc,cols[Math.floor(rng()*cols.length)],'#d8b38c',.58+depth*.35,rng()*6.28);
      }
    }
  }
  // benches / planters
  for(const side of [-1,1]){
    const x=w*.5+side*w*.29,y=h*.74;
    v8rectRound(g,x-40,y,80,8,2,'#695747',.65);g.fillStyle='#55483c';g.fillRect(x-32,y+8,5,25);g.fillRect(x+27,y+8,5,25);
  }
}
function v9drawLavender(g,w,h,rng){
  // Provence-style stone courtyard, lavender only as landscaping.
  sceneGradient(g,w,h,[[0,'#aebed0'],[.48,'#d9d5cc'],[1,'#777869']]);
  // old stone house
  g.fillStyle='#a89c87';g.fillRect(w*.12,h*.25,w*.52,h*.38);
  g.fillStyle='#74685d';g.beginPath();g.moveTo(w*.08,h*.27);g.lineTo(w*.38,h*.08);g.lineTo(w*.68,h*.27);g.closePath();g.fill();
  // windows + shutters
  for(let i=0;i<3;i++){
    const x=w*(.20+i*.15);
    v8rectRound(g,x,h*.35,46,70,3,'#34424a',.88);
    g.fillStyle='#776d61';g.fillRect(x-13,h*.35,9,70);g.fillRect(x+50,h*.35,9,70);
  }
  // warm doorway
  v8rectRound(g,w*.47,h*.40,58,h*.23,5,'#3e342d',1);
  const dg=g.createRadialGradient(w*.50,h*.49,2,w*.50,h*.49,80);dg.addColorStop(0,'rgba(244,190,116,.18)');dg.addColorStop(1,'rgba(244,190,116,0)');g.fillStyle=dg;g.fillRect(w*.40,h*.36,w*.20,h*.34);

  // stone courtyard
  g.fillStyle='#8f897d';g.fillRect(0,h*.63,w,h*.37);
  for(let i=0;i<45;i++){
    const x=rng()*w,y=h*(.65+rng()*.35),ww=18+rng()*45;
    g.strokeStyle='rgba(61,58,53,.10)';g.strokeRect(x,y,ww,8+rng()*15);
  }
  // lavender planters along courtyard edges
  for(const side of [-1,1]){
    for(let j=0;j<12;j++){
      const t=j/11,depth=t*t,y=v7lerp(h*.61,h*.96,depth),x=w*.5+side*v7lerp(w*.20,w*.44,depth),sc=v7lerp(.22,.95,depth);
      v7softBlob(g,x,y,28*sc,13*sc,'#465a43',.7,6,rng);
      for(let k=0;k<7;k++){
        const px=x+(rng()-.5)*42*sc,py=y-8*sc-rng()*20*sc;
        g.strokeStyle='rgba(61,83,57,.65)';g.lineWidth=Math.max(.5,sc);g.beginPath();g.moveTo(px,y);g.lineTo(px,py);g.stroke();
        for(let q=0;q<3;q++)v7leaf(g,px+(q%2?1:-1)*1.5*sc,py+q*3*sc,1.5*sc,rng()>.5?'#7560a5':'#8b73b5',.72,0);
      }
    }
  }
}
function v9drawLemon(g,w,h,rng){
  // Mediterranean patio under lemon trees.
  sceneGradient(g,w,h,[[0,'#91c9d4'],[.50,'#d7e6d9'],[1,'#66765b']]);
  // stucco wall and arched opening
  g.fillStyle='#d7cfb9';g.fillRect(0,h*.18,w,h*.58);
  g.fillStyle='#667f7e';g.beginPath();g.moveTo(w*.62,h*.30);g.arc(w*.72,h*.30,w*.10,Math.PI,0);g.lineTo(w*.82,h*.67);g.lineTo(w*.62,h*.67);g.closePath();g.fill();
  // blue sea through arch
  g.fillStyle='#6797a4';g.fillRect(w*.63,h*.31,w*.18,h*.36);
  g.fillStyle='#b9d5d5';g.fillRect(w*.63,h*.43,w*.18,h*.03);
  // tiled patio
  g.fillStyle='#a99d82';g.fillRect(0,h*.68,w,h*.32);
  g.save();g.strokeStyle='rgba(74,66,54,.10)';
  for(let i=0;i<12;i++){g.beginPath();g.moveTo(i*w/11,h*.68);g.lineTo(w*.5+(i-5.5)*w*.13,h);g.stroke();}
  for(let i=1;i<6;i++){const y=h*.68+(h*.32)*Math.pow(i/6,1.45);g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
  g.restore();
  // lemon trees framing patio
  for(const side of [-1,1]){
    for(let n=0;n<2;n++){
      const x=side<0?w*(.08+n*.17):w*(.92-n*.18),base=h*(.83+n*.05),sc=.85+n*.12;
      v8tree(g,x,base,sc,rng,'#3f6a3b','#5a4431',.95);
      for(let k=0;k<12;k++)ellipse(g,x+(rng()-.5)*75*sc,base-90*sc+(rng()-.5)*65*sc,4*sc,4.5*sc,'#e3c83e',.75);
    }
  }
  // café-style patio table
  v9tableSet(g,w*.47,h*.82,.82,rng,0);
  v8rectRound(g,w*.43,h*.72,80,8,3,'#d7c8aa',.7);
}
function v9drawPeach(g,w,h,rng){
  // Quiet Japanese peach-blossom garden rather than orchard rows.
  sceneGradient(g,w,h,[[0,'#b8c7d5'],[.50,'#e4d8d6'],[1,'#64705e']]);
  v8mountain(g,w,h,h*.48,'#8b8f93',.25,rng,.10);
  // pond
  const pond=g.createLinearGradient(0,h*.60,0,h);pond.addColorStop(0,'#718b87');pond.addColorStop(1,'#445d5a');
  g.fillStyle=pond;g.fillRect(0,h*.60,w,h*.40);
  // stepping stones
  for(let i=0;i<8;i++){const t=i/7,x=w*.35+t*w*.30+(i%2?18:-10),y=h*(.66+t*.045);ellipse(g,x,y,30+t*4,9+t*1.5,'#7c7b70',.72);}
  // little wooden bridge
  g.strokeStyle='#674838';g.lineWidth=8;g.beginPath();g.arc(w*.68,h*.70,90,Math.PI*1.08,Math.PI*1.92);g.stroke();
  g.lineWidth=2;for(let i=0;i<7;i++){const a=Math.PI*1.1+i*.13,x=w*.68+Math.cos(a)*90,y=h*.70+Math.sin(a)*90;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-22);g.stroke();}
  // peach blossom trees
  for(const side of [-1,1]){
    const x=side<0?w*.10:w*.90,base=h*.82;
    v7branch(g,x,base,w*.5+side*w*.18,h*.23,16,'#4b342f',.9);
    for(let b=0;b<10;b++){
      const bx=x+side*(-1)*(30+b*18),by=h*(.62-b*.035);
      const tx=bx+(rng()-.5)*80,ty=by-(30+rng()*50);
      v7branch(g,bx,by,tx,ty,4,'#523832',.8);
      for(let k=0;k<8;k++)ellipse(g,tx+(rng()-.5)*55,ty+(rng()-.5)*35,2.5+rng()*3,2+rng()*2.5,rng()>.5?'#e996a0':'#f0b0b1',.62+rng()*.22,rng()*6.28);
    }
  }
}
function v9fish(g,x,y,s,color,alpha=1,flip=1){
  g.save();g.translate(x,y);g.scale(flip,1);g.globalAlpha=alpha;g.fillStyle=color;
  g.beginPath();g.ellipse(0,0,9*s,4*s,0,0,Math.PI*2);g.fill();
  g.beginPath();g.moveTo(-8*s,0);g.lineTo(-15*s,-6*s);g.lineTo(-14*s,6*s);g.closePath();g.fill();
  g.fillStyle='rgba(235,245,245,.65)';g.beginPath();g.arc(4*s,-1*s,.8*s,0,Math.PI*2);g.fill();g.restore();
}
function v9drawOcean(g,w,h,rng){
  v7drawOcean(g,w,h,rng);
  // coral/rock accents
  for(let i=0;i<18;i++){
    const x=rng()*w,y=h*(.90+rng()*.10),s=.5+rng()*.9;
    g.strokeStyle=rng()>.5?'rgba(99,112,81,.48)':'rgba(112,77,70,.42)';g.lineWidth=2*s;
    for(let b=0;b<3;b++){g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+(b-1)*8*s,y-14*s,x+(b-1)*12*s,y-25*s);g.stroke();}
  }
  // several schools, kept subtle
  const colors=['#b7c7b7','#d2b47d','#8fb4bd','#c58d72','#9fc7c2'];
  for(let school=0;school<5;school++){
    const cx=w*(.15+rng()*.70),cy=h*(.28+rng()*.45),count=5+Math.floor(rng()*7),dir=rng()>.5?1:-1;
    for(let i=0;i<count;i++){
      const depth=.45+rng()*.75;
      v9fish(g,cx+(rng()-.5)*120,cy+(rng()-.5)*55,depth,colors[Math.floor(rng()*colors.length)],.34+rng()*.32,dir);
    }
  }
  // two larger foreground fish
  v9fish(g,w*.18,h*.52,1.25,'#a5b9a6',.46,1);
  v9fish(g,w*.80,h*.66,1.05,'#c3a574',.42,-1);
}
function v9drawSakura(g,w,h,rng){
  // Traditional Japanese shrine approach.
  sceneGradient(g,w,h,[[0,'#071020'],[.48,'#172039'],[.78,'#30263b'],[1,'#120e17']]);
  v8stars(g,w,h,rng,38,.38);ellipse(g,w*.80,h*.13,34,34,'#efeaff',.78);
  v8mountain(g,w,h,h*.55,'#2c3140',.30,rng,.10);

  // stone path
  g.fillStyle='#343234';g.beginPath();g.moveTo(w*.45,h*.52);g.lineTo(w*.55,h*.52);g.lineTo(w*.72,h);g.lineTo(w*.28,h);g.closePath();g.fill();
  for(let i=0;i<8;i++){const t=i/8,y=v7lerp(h*.56,h*.96,t*t),half=v7lerp(20,135,t*t);g.strokeStyle='rgba(210,204,194,.10)';g.beginPath();g.moveTo(w*.5-half,y);g.lineTo(w*.5+half,y);g.stroke();}

  // Torii gates receding into the path
  for(let j=0;j<4;j++){
    const t=j/3,depth=t*t,cy=v7lerp(h*.54,h*.82,depth),sc=v7lerp(.28,.82,depth),cx=w*.5;
    const red=j===3?'#8f342d':'#77302c';
    g.fillStyle=red;g.fillRect(cx-55*sc,cy-70*sc,8*sc,75*sc);g.fillRect(cx+47*sc,cy-70*sc,8*sc,75*sc);
    g.fillRect(cx-70*sc,cy-73*sc,140*sc,8*sc);g.fillRect(cx-61*sc,cy-61*sc,122*sc,6*sc);
  }
  // stone lanterns
  for(const side of [-1,1])for(let j=0;j<5;j++){
    const t=j/4,depth=t*t,y=v7lerp(h*.61,h*.94,depth),x=w*.5+side*v7lerp(w*.10,w*.34,depth),sc=v7lerp(.25,.72,depth);
    g.fillStyle='#5c5955';g.fillRect(x-3*sc,y-24*sc,6*sc,24*sc);
    v8rectRound(g,x-9*sc,y-34*sc,18*sc,11*sc,2*sc,'#6d6258',.9);
    const gl=g.createRadialGradient(x,y-29*sc,1,x,y-29*sc,25*sc);gl.addColorStop(0,'rgba(255,176,91,.18)');gl.addColorStop(1,'rgba(255,176,91,0)');g.fillStyle=gl;g.fillRect(x-30*sc,y-60*sc,60*sc,60*sc);
  }
  // sakura canopy framing top
  for(const side of [-1,1]){
    const sx=side<0?-20:w+20,sy=h*.42,ex=w*.50+side*w*.08,ey=h*.14;
    v7branch(g,sx,sy,ex,ey,17,'#28171e',.95);
    for(let b=0;b<12;b++){
      const t=.08+b*.07,bx=v7lerp(sx,ex,t),by=v7lerp(sy,ey,t),tx=bx+side*(rng()-.5)*80,ty=by-(20+rng()*45);
      v7branch(g,bx,by,tx,ty,3.8,'#311b24',.82);
      for(let k=0;k<7;k++)ellipse(g,tx+(rng()-.5)*48,ty+(rng()-.5)*30,2+rng()*3,1.8+rng()*2.2,rng()>.5?'#e88ba7':'#c9658b',.50+rng()*.28,rng()*6.28);
    }
  }
}
function v9drawCity(g,w,h,rng,terminal=false){
  const green=terminal;
  sceneGradient(g,w,h,green?[[0,'#010704'],[.52,'#03150b'],[1,'#010403']]:[[0,'#040816'],[.48,'#0c1230'],[.72,'#16132d'],[1,'#050710']]);
  const horizon=h*.75;

  // skyline glow behind buildings
  const glow=g.createRadialGradient(w*.52,horizon,0,w*.52,horizon,w*.58);
  glow.addColorStop(0,green?'rgba(39,255,118,.13)':'rgba(45,210,255,.16)');
  glow.addColorStop(.55,green?'rgba(39,255,118,.025)':'rgba(222,48,210,.035)');
  glow.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=glow;g.fillRect(0,h*.20,w,h*.70);

  // rear towers
  let x=-10;
  while(x<w+20){
    const bw=24+rng()*52,bh=70+rng()*180,base=horizon;
    const body=green?(rng()>.5?'#06170d':'#04120a'):(rng()>.5?'#111a35':'#17162f');
    g.fillStyle=body;g.fillRect(x,base-bh,bw,bh);
    // roof cap/antenna
    if(rng()>.45){g.strokeStyle=green?'rgba(69,255,128,.36)':'rgba(86,224,255,.34)';g.lineWidth=1.2;g.beginPath();g.moveTo(x+bw*.5,base-bh);g.lineTo(x+bw*.5,base-bh-20-rng()*45);g.stroke();}
    // many readable windows
    const cols=green?['rgba(74,255,132,.46)','rgba(157,255,190,.26)']:['rgba(70,225,255,.48)','rgba(255,75,207,.34)','rgba(255,210,101,.30)'];
    for(let yy=base-bh+12;yy<base-10;yy+=10){
      for(let xx=x+7;xx<x+bw-5;xx+=9){
        if(rng()>.30){g.fillStyle=cols[Math.floor(rng()*cols.length)];g.fillRect(xx,yy,3.5,4);}
      }
    }
    // edge neon
    if(rng()>.55){g.strokeStyle=green?'rgba(53,255,117,.24)':'rgba(59,214,255,.25)';g.strokeRect(x+.5,base-bh+.5,bw-1,bh-1);}
    x+=bw+5+rng()*9;
  }

  // foreground landmark towers
  for(let i=0;i<5;i++){
    const cx=w*(.10+i*.20)+(rng()-.5)*35,bw=52+rng()*42,bh=160+rng()*190,base=horizon+8;
    const body=green?'#020d07':'#090d20';
    g.fillStyle=body;g.fillRect(cx-bw/2,base-bh,bw,bh);
    g.strokeStyle=green?'rgba(63,255,122,.42)':(i%2?'rgba(255,57,207,.38)':'rgba(52,220,255,.42)');
    g.lineWidth=1.5;g.strokeRect(cx-bw/2,base-bh,bw,bh);
    for(let yy=base-bh+14;yy<base-12;yy+=12)for(let xx=cx-bw/2+8;xx<cx+bw/2-5;xx+=10){
      if(rng()>.22){g.fillStyle=green?'rgba(79,255,136,.52)':(rng()>.35?'rgba(64,224,255,.54)':'rgba(255,75,211,.42)');g.fillRect(xx,yy,4,5);}
    }
  }

  // wet reflective street/grid
  const grd=g.createLinearGradient(0,horizon,0,h);grd.addColorStop(0,green?'#03150a':'#080d1c');grd.addColorStop(1,'#010204');
  g.fillStyle=grd;g.fillRect(0,horizon,w,h-horizon);
  g.save();g.globalAlpha=.18;g.lineWidth=1;
  for(let i=1;i<9;i++){const yy=horizon+(h-horizon)*Math.pow(i/9,1.6);g.strokeStyle=green?'#35ef75':'#47d9f3';g.beginPath();g.moveTo(0,yy);g.lineTo(w,yy);g.stroke();}
  for(let i=-9;i<=9;i++){g.strokeStyle=green?'#35ef75':(i%2?'#e64bc6':'#47d9f3');g.beginPath();g.moveTo(w*.5,horizon);g.lineTo(w*.5+i*w*.105,h);g.stroke();}
  // vertical reflections
  for(let i=0;i<26;i++){const rx=rng()*w,rw=1+rng()*4,rh=8+rng()*45;g.fillStyle=green?'rgba(50,239,112,.10)':(rng()>.5?'rgba(58,218,244,.11)':'rgba(231,65,198,.08)');g.fillRect(rx,horizon+rng()*(h-horizon),rw,rh);}
  g.restore();
}

// Override V8 scene compositor for requested V9 concepts.
v8drawStaticScene=function(g,w,h,meta){
  const rng=v7rng(v7seedFor('v9-'+meta.scene,w,h));
  switch(meta.scene){
    case 'night':v8drawNight(g,w,h,rng);break;
    case 'day':v8drawDay(g,w,h,rng);break;
    case 'midnight':v8drawMidnight(g,w,h,rng);break;
    case 'oled':v8drawOLED(g,w,h,rng);break;
    case 'forest':v7drawForest(g,w,h,rng);break;
    case 'rose':v9drawRose(g,w,h,rng);break;
    case 'lavender':v9drawLavender(g,w,h,rng);break;
    case 'ocean':v9drawOcean(g,w,h,rng);break;
    case 'sunset':v8drawSunset(g,w,h,rng);break;
    case 'coffee':v9drawCoffee(g,w,h,rng);break;
    case 'meadow':v8drawMeadow(g,w,h,rng);break;
    case 'sakura':v9drawSakura(g,w,h,rng);break;
    case 'sky':v8drawSky(g,w,h,rng);break;
    case 'lemon':v9drawLemon(g,w,h,rng);break;
    case 'peach':v9drawPeach(g,w,h,rng);break;
    case 'cyber':v9drawCity(g,w,h,rng,false);break;
    case 'grape':v8drawGrape(g,w,h,rng);break;
    case 'terminal':v9drawCity(g,w,h,rng,true);break;
    default:v7drawStaticScene(g,w,h,meta);
  }
  const vign=g.createRadialGradient(w*.5,h*.42,Math.min(w,h)*.18,w*.5,h*.46,Math.max(w,h)*.78);
  const light=['day','rose','lavender','meadow','sky','lemon','peach'].includes(meta.scene);
  vign.addColorStop(0,'rgba(255,255,255,0)');
  vign.addColorStop(1,light?'rgba(55,65,60,.045)':'rgba(0,0,0,.13)');
  g.fillStyle=vign;g.fillRect(0,0,w,h);
};
getSceneCache=function(meta,w,h){
  const key=`v9:${meta.id}:${w}x${h}`;
  if(sceneCacheKey===key&&sceneCache)return sceneCache;
  sceneCache=mkOffscreen(w,h);
  sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});
  v8drawStaticScene(sceneCacheCtx,w,h,meta);
  sceneCacheKey=key;
  return sceneCache;
};

Object.assign(THEME_SCENE_LABELS,{
  rose:'Glass rose conservatory',
  lavender:'Provence stone courtyard',
  ocean:'Reef · fish · light rays',
  coffee:'Rainy café · tables · patrons',
  sakura:'Japanese shrine · torii · sakura',
  lemon:'Mediterranean lemon patio',
  peach:'Japanese peach garden · pond',
  cyber:'Bright neon megacity',
  terminal:'Green terminal megacity'
});



/* Display a themed hover card below the header avatar; does not alter click/login behavior. */
(() => {
  'use strict';
  let card, active = false;
  const button = () => document.getElementById('btn-login-google');
  function ensureCard() {
    if (card) return card;
    card = document.createElement('div');
    card.className = 'avatar-hover-card';
    card.setAttribute('role','tooltip');
    card.id = 'avatar-hover-card';
    document.body.appendChild(card);
    return card;
  }
  function show() {
    const btn = button();
    if (!btn || !btn.classList.contains('profile-header-btn-v5')) return;
    btn.removeAttribute('title');
    const name = (typeof effectiveAccountName === 'function' && effectiveAccountName()) || window.googleAccountProfile?.name || 'Current account';
    const email = window.googleAccountProfile?.email || '';
    const avatar = btn.querySelector('.profile-avatar-v5');
    const c = ensureCard();
    c.replaceChildren();
    const top = document.createElement('div'); top.className='avatar-hover-card__top';
    let photo;
    if (avatar?.src) { photo=document.createElement('img'); photo.src=avatar.src; photo.alt=''; }
    else {photo=document.createElement('span'); photo.textContent=String(name).trim().charAt(0).toUpperCase() || 'G';}
    photo.className='avatar-hover-card__photo'; top.appendChild(photo);
    const info=document.createElement('div');info.className='avatar-hover-card__info';
    const n=document.createElement('strong');n.className='avatar-hover-card__name';n.textContent=name;info.appendChild(n);
    if(email){const e=document.createElement('span');e.className='avatar-hover-card__email';e.textContent=email;info.appendChild(e);}
    top.appendChild(info);c.appendChild(top);
    const status=document.createElement('div');status.className='avatar-hover-card__status';
    const dot=document.createElement('span');dot.className='avatar-hover-card__dot';status.appendChild(dot);
    const label=document.createElement('span');label.textContent='Google account connected';status.appendChild(label);c.appendChild(status);
    const rect=btn.getBoundingClientRect();
    c.style.visibility='hidden';c.classList.add('visible');
    const w=c.offsetWidth,h=c.offsetHeight;
    const left=Math.max(12,Math.min(innerWidth-w-12,rect.left+rect.width/2-w/2));
    let topPos=rect.bottom+13;
    if(topPos+h>innerHeight-12) topPos=Math.max(12,rect.top-h-13);
    c.style.left=left+'px';c.style.top=topPos+'px';
    c.style.setProperty('--arrow-x',Math.max(12,Math.min(w-12,rect.left+rect.width/2-left))+'px');
    c.style.visibility='visible';active=true;
  }
  function hide(){active=false;if(card)card.classList.remove('visible');}
  document.addEventListener('mouseover',e=>{if(e.target.closest?.('#btn-login-google'))show();});
  document.addEventListener('mouseout',e=>{const btn=e.target.closest?.('#btn-login-google');if(btn&&!btn.contains(e.relatedTarget))hide();});
  document.addEventListener('focusin',e=>{if(e.target.closest?.('#btn-login-google'))show();});
  document.addEventListener('focusout',e=>{if(e.target.closest?.('#btn-login-google'))hide();});
  document.addEventListener('click',e=>{if(e.target.closest?.('#btn-login-google'))hide();});
  window.addEventListener('scroll',hide,{passive:true});window.addEventListener('resize',hide);
  // A native title can be reintroduced by the base account refresh; remove it without changing its label.
  const observer=new MutationObserver(()=>{const btn=button();if(btn?.hasAttribute('title'))btn.removeAttribute('title');});
  const start=()=>{const btn=button();if(btn){observer.observe(btn,{attributes:true,attributeFilter:['title']});btn.removeAttribute('title');}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

(() => {
  'use strict';

  const PANEL_ID = 'ghtk-tool-center';
  const STYLE_ID = 'ghtk-tool-center-style';
  const STATE_KEY = '__ghtk_tool_center_state_v2__';
  const POS_KEY = '__ghtk_tool_center_position_v1__';

  document.getElementById(PANEL_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  const tools = [
    { id: 'autoClick', icon: '⚡', accent: '#38bdf8' },
    { id: 'delayPicker', icon: '📦', accent: '#10b981' },
    { id: 'miniExcel', icon: '▦', accent: '#8b5cf6' },
    { id: 'giaoDauNgay', icon: '↗', accent: '#f59e0b' },
  ].map(x => ({ ...x, ...GHTKTools.getMeta(x.id) }));

  const saved = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #${PANEL_ID}, #${PANEL_ID} * { box-sizing: border-box; }
    #${PANEL_ID} {
       isolation: isolate;
      position: fixed; top: 78px; right: 0; width: 360px; z-index: 2147483647 !important;
       transform: translateX(100%); transition: transform .24s cubic-bezier(.4,0,.2,1); overflow: visible;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #e5e7eb; background: rgba(11,18,32,.96); border: 1px solid rgba(148,163,184,.18);
      border-radius: 18px 0 0 18px; box-shadow: 0 24px 70px rgba(0,0,0,.45); overflow: visible;
      backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    }
    #${PANEL_ID} .gt-header { display:flex; align-items:center; justify-content:space-between; padding:14px 15px 12px; cursor:move; user-select:none; border-bottom:1px solid rgba(148,163,184,.12); }
    #${PANEL_ID} .gt-brand { display:flex; gap:10px; align-items:center; min-width:0; }
    #${PANEL_ID} .gt-logo { width:34px; height:34px; border-radius:11px; display:grid; place-items:center; background:linear-gradient(145deg,#1d4ed8,#0ea5e9); font-weight:800; box-shadow:0 8px 24px rgba(14,165,233,.24); }
    #${PANEL_ID} .gt-title { font-weight:800; font-size:13px; line-height:1.15; }
    #${PANEL_ID} .gt-sub { margin-top:3px; font-size:10px; color:#8190a5; }
    #${PANEL_ID} .gt-close { width:28px; height:28px; border:0; border-radius:8px; background:transparent; color:#94a3b8; cursor:pointer; font-size:17px; }
    #${PANEL_ID} .gt-close:hover { background:rgba(255,255,255,.07); color:white; }
    #${PANEL_ID} .gt-summary { display:flex; justify-content:space-between; align-items:center; padding:11px 15px; background:rgba(255,255,255,.025); font-size:11px; color:#94a3b8; }
    #${PANEL_ID} .gt-count { font-weight:800; color:#dbeafe; }
    #${PANEL_ID} .gt-list { padding:10px; display:flex; flex-direction:column; gap:8px; }
    #${PANEL_ID} .gt-card { --accent:#38bdf8; display:flex; gap:10px; align-items:center; min-height:68px; padding:10px 11px; border:1px solid rgba(148,163,184,.12); border-radius:13px; background:rgba(30,41,59,.52); transition:.16s ease; }
    #${PANEL_ID} .gt-card:hover { border-color:color-mix(in srgb, var(--accent) 36%, transparent); background:rgba(30,41,59,.72); }
    #${PANEL_ID} .gt-icon { width:38px; height:38px; flex:0 0 38px; border-radius:11px; display:grid; place-items:center; font-size:17px; color:white; background:color-mix(in srgb, var(--accent) 18%, #101827); border:1px solid color-mix(in srgb, var(--accent) 30%, transparent); }
    #${PANEL_ID} .gt-info { min-width:0; flex:1; }
    #${PANEL_ID} .gt-name { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:750; color:#f8fafc; }
    #${PANEL_ID} .gt-dot { width:6px; height:6px; border-radius:50%; background:#64748b; }
    #${PANEL_ID} .gt-card.on .gt-dot { background:#22c55e; box-shadow:0 0 8px rgba(34,197,94,.7); }
    #${PANEL_ID} .gt-desc { margin-top:4px; font-size:10px; color:#8492a6; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    #${PANEL_ID} .gt-switch { position:relative; width:40px; height:22px; flex:0 0 40px; }
    #${PANEL_ID} .gt-switch input { position:absolute; opacity:0; }
    #${PANEL_ID} .gt-slider { position:absolute; inset:0; border-radius:999px; background:#334155; cursor:pointer; transition:.18s ease; }
    #${PANEL_ID} .gt-slider:before { content:""; position:absolute; width:16px; height:16px; left:3px; top:3px; border-radius:50%; background:#fff; transition:.18s ease; box-shadow:0 2px 5px rgba(0,0,0,.35); }
    #${PANEL_ID} input:checked + .gt-slider { background:#2563eb; }
    #${PANEL_ID} input:checked + .gt-slider:before { transform:translateX(18px); }
    #${PANEL_ID} .gt-run { border:1px solid color-mix(in srgb, var(--accent) 28%, transparent); background:color-mix(in srgb, var(--accent) 12%, transparent); color:#e2e8f0; border-radius:9px; padding:7px 11px; font-size:10px; font-weight:800; cursor:pointer; }
    #${PANEL_ID} .gt-run:hover { background:color-mix(in srgb, var(--accent) 20%, transparent); }
    #${PANEL_ID} .gt-footer { display:flex; gap:8px; padding:10px 12px 12px; border-top:1px solid rgba(148,163,184,.10); }
    #${PANEL_ID} .gt-footer button { flex:1; height:34px; border-radius:10px; border:1px solid rgba(148,163,184,.15); background:rgba(255,255,255,.035); color:#cbd5e1; font-size:10px; font-weight:800; cursor:pointer; }
    #${PANEL_ID} .gt-footer button:hover { background:rgba(255,255,255,.07); }
    #${PANEL_ID} .gt-toast { position:absolute; z-index:2147483647; left:50%; bottom:12px; transform:translate(-50%,14px); padding:7px 10px; border-radius:9px; background:#0f172a; border:1px solid rgba(148,163,184,.18); color:#e2e8f0; font-size:10px; opacity:0; pointer-events:none; transition:.2s ease; box-shadow:0 10px 30px rgba(0,0,0,.35); }
    #${PANEL_ID} .gt-toast.show { opacity:1; transform:translate(-50%,0); }

    #${PANEL_ID}.gt-open { transform: translateX(0); }
    #${PANEL_ID} .gt-drawer-handle {
      position:absolute; left:-24px; top:22px; width:24px; height:44px; z-index:2147483647;
      border:1px solid rgba(148,163,184,.16); border-right:0;
      border-radius:9px 0 0 9px;
      background:rgba(11,18,32,.96); color:#94a3b8;
      display:grid; place-items:center; cursor:pointer;
      font-size:17px; line-height:1; font-weight:800;
      box-shadow:-3px 5px 12px rgba(0,0,0,.14);
      backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
      transition:background .16s ease,color .16s ease,box-shadow .16s ease;
    }
    #${PANEL_ID} .gt-drawer-handle:hover { color:#e2e8f0; background:rgba(17,27,45,.98); box-shadow:-4px 6px 14px rgba(0,0,0,.18); }
    #${PANEL_ID}.gt-open .gt-drawer-handle { transform:none; }
    #${PANEL_ID} .gt-shell { overflow:hidden; border-radius:18px 0 0 18px; }
  `;
  document.head.appendChild(style);

  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <button class="gt-drawer-handle" type="button" title="Mở / ẩn GHTK Tool Center" aria-label="Mở / ẩn GHTK Tool Center">‹</button>
    <div class="gt-shell">
      <div class="gt-header">
        <div class="gt-brand"><div class="gt-logo">G</div><div><div class="gt-title">GHTK Tool Center</div><div class="gt-sub">Bộ điều khiển công cụ</div></div></div>
      </div>
      <div class="gt-summary"><span>Tool đang hoạt động</span><span class="gt-count">0 / 3</span></div>
      <div class="gt-list"></div>
      <div class="gt-toast"></div>
    </div>
  `;
  document.body.appendChild(panel);

  const list = panel.querySelector('.gt-list');
  const count = panel.querySelector('.gt-count');
  const toastEl = panel.querySelector('.gt-toast');
  let toastTimer = null;

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1400);
  }

  function save() {
    const state = {};
    tools.filter(t => t.type === 'toggle').forEach(t => state[t.id] = GHTKTools.isEnabled(t.id));
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  function render() {
    list.innerHTML = tools.map(t => {
      const on = t.type === 'toggle' && GHTKTools.isEnabled(t.id);
      return `
        <div class="gt-card ${on ? 'on' : ''}" style="--accent:${t.accent}">
          <div class="gt-icon">${t.icon}</div>
          <div class="gt-info"><div class="gt-name"><span class="gt-dot"></span>${t.name || t.id}</div><div class="gt-desc">${t.description || ''}</div></div>
          ${t.type === 'toggle'
            ? `<label class="gt-switch"><input type="checkbox" data-toggle="${t.id}" ${on ? 'checked' : ''}><span class="gt-slider"></span></label>`
            : `<button class="gt-run" data-run="${t.id}">Chạy</button>`}
        </div>`;
    }).join('');
    const total = tools.filter(t => t.type === 'toggle').length;
    const active = tools.filter(t => t.type === 'toggle' && GHTKTools.isEnabled(t.id)).length;
    count.textContent = `${active} / ${total}`;
  }

  list.addEventListener('change', e => {
    const id = e.target?.dataset?.toggle;
    if (!id) return;
    if (e.target.checked) {
      const ok = GHTKTools.start(id);
      if (!ok) e.target.checked = false;
      toast(ok ? 'Đã bật tool' : 'Tool gặp lỗi');
    } else {
      GHTKTools.stop(id);
      toast('Đã tắt tool');
    }
    save();
    render();
  });

  list.addEventListener('click', e => {
    const id = e.target?.dataset?.run;
    if (!id) return;
    try {
      GHTKTools.run(id);
      e.target.textContent = '✓ Đã chạy';
      setTimeout(() => { if (e.target?.isConnected) e.target.textContent = 'Chạy'; }, 1500);
      toast('Đã chạy tác vụ');
    } catch (err) {
      console.error(err);
      toast('Tác vụ gặp lỗi');
    }
  });

  window.addEventListener('ghtk-tools:change', render);

  // Drawer cố định bên phải: mặc định ẩn, bấm ‹ để mở/đóng.
  const drawerHandle = panel.querySelector('.gt-drawer-handle');
  function toggleDrawer(force) {
    const open = typeof force === 'boolean' ? force : !panel.classList.contains('gt-open');
    panel.classList.toggle('gt-open', open);
    drawerHandle.textContent = open ? '›' : '‹';
    drawerHandle.title = open ? 'Ẩn GHTK Tool Center' : 'Mở GHTK Tool Center';
  }
  drawerHandle.addEventListener('click', () => toggleDrawer());

  // Khôi phục trạng thái tool sau khi reload extension/trang.
  tools.filter(t => t.type === 'toggle').forEach(t => {
    if (saved[t.id]) GHTKTools.start(t.id);
  });
  render();

  // Ctrl+Shift+G: mở / ẩn drawer.
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyG') {
      toggleDrawer();
    }
  });
})();

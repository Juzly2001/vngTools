(() => {
  'use strict';
  GHTKTools.register('miniExcel', {
    name: "Mini GHTK Excel",
    description: "Bảng nhập liệu và tham chiếu nhiều tab",
    type: 'toggle',
    start() {

      (() => {
        const APP_ID = 'mini-multi-tab-excel-tool';
        const STORAGE_KEY = '__mini_multi_tab_excel_tool_v2__';
        const XLSX_URL = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';

        if (document.getElementById(APP_ID)) {
          document.getElementById(APP_ID).remove();
          return;
        }

        const uid = () => 't_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

        const defaultState = {
          activeTabId: 'input_1',
          settingsOpen: false,
          zoom: 100,
          searchOpen: false,
          searchQuery: '',
          searchColumn: 'all',
          tabs: [
            {
              id: 'input_1',
              name: 'Nhập liệu 1',
              type: 'input',
              columns: ['Cột 1', 'Cột 2', 'Cột 3'],
              rows: [['', '', ''], ['', '', ''], ['', '', '']],
              lookupRules: [
                {
                  id: 'rule_1',
                  name: 'Tham chiếu 1',
                  referenceTabId: 'ref_1',
                  sourceCol: 0,
                  refCol: 0,
                  mode: 'exact-normalized',
                  autoLookup: true,
                  outputs: []
                }
              ]
            },
            {
              id: 'ref_1',
              name: 'Tham chiếu 1',
              type: 'reference',
              columns: ['Cột 1', 'Cột 2', 'Cột 3'],
              rows: [['', '', '']]
            }
          ]
        };

        const clone = x => JSON.parse(JSON.stringify(x));

        function loadState() {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return clone(defaultState);
            const s = JSON.parse(raw);
            if (!Array.isArray(s.tabs) || !s.tabs.length) return clone(defaultState);
            return {
              ...clone(defaultState),
              ...s,
              settingsOpen: !!s.settingsOpen,
              zoom: Number(s.zoom) || 100
            };
          } catch {
            return clone(defaultState);
          }
        }

        let state = loadState();

        // Nâng cấp dữ liệu bản cũ: 1 lookup -> nhiều lookupRules.
        state.tabs.forEach(tab => {
          if (tab.type !== 'input') return;

          if (!Array.isArray(tab.lookupRules)) {
            if (tab.lookup) {
              tab.lookupRules = [{
                id: uid(),
                name: 'Tham chiếu 1',
                referenceTabId: tab.lookup.referenceTabId || '',
                sourceCol: Number(tab.lookup.sourceCol) || 0,
                refCol: Number(tab.lookup.refCol) || 0,
                mode: tab.lookup.mode || 'exact-normalized',
                autoLookup: tab.lookup.autoLookup !== false,
                outputs: Array.isArray(tab.lookup.outputs) ? tab.lookup.outputs : []
              }];
            } else {
              const firstRef = state.tabs.find(t => t.type === 'reference');
              tab.lookupRules = firstRef ? [{
                id: uid(),
                name: 'Tham chiếu 1',
                referenceTabId: firstRef.id,
                sourceCol: 0,
                refCol: 0,
                mode: 'exact-normalized',
                autoLookup: true,
                outputs: []
              }] : [];
            }
          }

          delete tab.lookup;
        });
        saveState();

        // Undo / Redo theo từng tab (Ctrl+Z / Ctrl+Y)
        const HISTORY_LIMIT = 80;
        const tabHistory = new Map();
        let historyLocked = false;

        function historySnapshot(tab = getActiveTab()) {
          return tab ? JSON.stringify(tab) : '';
        }

        function getTabHistory(tabId = state.activeTabId) {
          if (!tabHistory.has(tabId)) {
            tabHistory.set(tabId, { undo: [], redo: [] });
          }
          return tabHistory.get(tabId);
        }

        function pushHistory(snapshot = historySnapshot(), tabId = state.activeTabId) {
          if (historyLocked || !snapshot || !tabId) return;
          const h = getTabHistory(tabId);
          const last = h.undo[h.undo.length - 1];
          if (last === snapshot) return;
          h.undo.push(snapshot);
          if (h.undo.length > HISTORY_LIMIT) h.undo.shift();
          h.redo = [];
          updateUndoRedoButtons();
        }

        function restoreHistory(snapshot, tabId = state.activeTabId) {
          const restored = JSON.parse(snapshot);
          const index = state.tabs.findIndex(t => t.id === tabId);
          if (index < 0) return;

          historyLocked = true;
          try {
            state.tabs[index] = restored;
            state.activeTabId = tabId;
            saveState();
            render();
          } finally {
            historyLocked = false;
            updateUndoRedoButtons();
          }
        }

        function undoAction() {
          const tab = getActiveTab();
          if (!tab) return;
          const h = getTabHistory(tab.id);
          if (!h.undo.length) return;

          const current = historySnapshot(tab);
          const previous = h.undo.pop();
          h.redo.push(current);
          restoreHistory(previous, tab.id);
        }

        function redoAction() {
          const tab = getActiveTab();
          if (!tab) return;
          const h = getTabHistory(tab.id);
          if (!h.redo.length) return;

          const current = historySnapshot(tab);
          const next = h.redo.pop();
          h.undo.push(current);
          restoreHistory(next, tab.id);
        }

        function updateUndoRedoButtons() {
          const h = getTabHistory(state.activeTabId);
          const undoBtn = shadow?.querySelector?.('[data-act="undo"]');
          const redoBtn = shadow?.querySelector?.('[data-act="redo"]');
          if (undoBtn) undoBtn.disabled = !h.undo.length;
          if (redoBtn) redoBtn.disabled = !h.redo.length;
        }

        function saveState() {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }

        function esc(s) {
          return String(s ?? '').replace(/[&<>"']/g, c => ({
            '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
          }[c]));
        }

        function normalize(v) {
          return String(v ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
        }

        function matchValue(a, b, mode) {
          const sa = String(a ?? '');
          const sb = String(b ?? '');
          if (mode === 'exact') return sa.trim() === sb.trim();
          if (mode === 'contains') return sa !== '' && sb.includes(sa);
          if (mode === 'contains-normalized') {
            const na = normalize(sa), nb = normalize(sb);
            return !!na && nb.includes(na);
          }
          return normalize(sa) !== '' && normalize(sa) === normalize(sb);
        }

        function getTab(id) {
          return state.tabs.find(t => t.id === id);
        }

        function getActiveTab() {
          return getTab(state.activeTabId) || state.tabs[0];
        }

        function referenceTabs() {
          return state.tabs.filter(t => t.type === 'reference');
        }

        function ensureRect(tab) {
          const n = tab.columns.length;
          tab.rows = (tab.rows || []).map(r => Array.from({ length: n }, (_, i) => r?.[i] ?? ''));
        }

        function ensureBlankRow(tab) {
          ensureRect(tab);
          if (!tab.rows.length || tab.rows[tab.rows.length - 1].some(v => String(v).trim() !== '')) {
            tab.rows.push(Array(tab.columns.length).fill(''));
          }
        }

        state.tabs.forEach(ensureBlankRow);

        const host = document.createElement('div');
        host.id = APP_ID;
        document.body.appendChild(host);
        const shadow = host.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
          <style>
            *{box-sizing:border-box}
            :host{all:initial}
            .wrap{
              position:fixed;z-index: 2147483646;top:24px;left:24px;
              width:min(1180px,calc(100vw - 48px));height:min(780px,calc(100vh - 48px));
              background:#fff;color:#1f2937;border:1px solid #cbd5e1;border-radius:14px;
              box-shadow:0 20px 60px rgba(15,23,42,.25);font:13px/1.4 Arial,sans-serif;
              display:flex;flex-direction:column;overflow:hidden;
              min-width:520px;min-height:360px
            }
            .topbar{
              display:flex;align-items:center;gap:8px;padding:9px 12px;
              background:#0f172a;color:#fff;cursor:move;user-select:none
            }
            .wrap.minimized{
              width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;
              top:auto!important;left:auto!important;right:16px!important;bottom:16px!important;
              border-radius:12px;overflow:visible
            }
            .wrap.minimized .topbar{
              border-radius:12px;padding:8px 10px;cursor:pointer
            }
            .wrap.minimized .topbar > *{display:none!important}
            .wrap.minimized .topbar .mini-restore{
              display:inline-flex!important;align-items:center;gap:7px;
              border:0;border-radius:8px;background:#0f172a;color:#fff;
              padding:7px 10px;cursor:pointer;font-weight:700
            }
            .wrap.minimized .tabsbar,
            .wrap.minimized .body,
            .wrap.minimized .resize-handle{display:none!important}
            .mini-restore{display:none}

            .title{font-weight:700;flex:1;font-size:14px}
            button{font:inherit}
            .btn{border:1px solid #cbd5e1;border-radius:8px;background:#fff;padding:7px 10px;cursor:pointer}
            .btn.primary{background:#2563eb;color:#fff;border-color:#2563eb}
            .btn.danger{background:#fff1f2;color:#be123c;border-color:#fecdd3}
            .topbtn{border:0;border-radius:8px;padding:7px 10px;cursor:pointer;background:#334155;color:#fff}
            .close{background:#b91c1c}
            .tabsbar{
              display:flex;align-items:end;gap:6px;padding:8px 10px 0;background:#f8fafc;
              border-bottom:1px solid #e2e8f0;overflow-x:auto;overflow-y:hidden
            }
            .tab{
              display:flex;align-items:center;gap:6px;border:1px solid #cbd5e1;border-bottom:0;
              background:#e2e8f0;padding:8px 10px;border-radius:8px 8px 0 0;cursor:pointer;
              white-space:nowrap;max-width:220px
            }
            .tab.active{background:#fff;font-weight:700}
            .type-dot{width:8px;height:8px;border-radius:50%;display:inline-block}
            .type-input{background:#2563eb}.type-reference{background:#16a34a}
            .tabname{max-width:150px;overflow:hidden;text-overflow:ellipsis}
            .tabclose{border:0;background:transparent;color:#64748b;cursor:pointer;padding:0 2px}
            .addtab{border:1px dashed #94a3b8;border-bottom:0;background:#fff;padding:8px 12px;border-radius:8px 8px 0 0;cursor:pointer;font-weight:700}
            .body{flex:1;min-height:0;display:flex;flex-direction:column}
            .settings-panel{display:none}
            .settings-panel.open{
              display:block;
              max-height:46%;
              overflow-y:auto;
              overflow-x:hidden;
              flex:0 1 auto;
              scrollbar-gutter:stable;
              padding:0
            }


            .searchbar{
              display:none;align-items:center;gap:8px;padding:9px 12px;
              border-bottom:1px solid #e2e8f0;background:#f8fafc
            }
            .searchbar.open{display:flex}
            .search-input-wrap{position:relative;flex:1;min-width:160px}
            .searchbox{
              width:100%;border:1px solid #cbd5e1;border-radius:8px;
              padding:7px 34px 7px 10px;background:#fff;outline:none
            }
            .searchbox:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.10)}
            .search-clear{
              display:none;position:absolute;right:6px;top:50%;transform:translateY(-50%);
              width:22px;height:22px;border:0;border-radius:50%;background:transparent;
              color:#94a3b8;cursor:pointer;font-size:17px;line-height:20px;padding:0
            }
            .search-clear.show{display:block}
            .search-clear:hover{background:#e2e8f0;color:#475569}
            .search-count{font-size:12px;color:#64748b;white-space:nowrap}
            td.cell.search-hit{background:#fef3c7!important}

            .tab-info{
              display:flex;align-items:center;gap:10px;
              padding:10px 12px;border-bottom:1px solid #e2e8f0;background:#fff;
            }
            .tab-info-main{min-width:0;flex:1}
            .tab-info-title{font-size:16px;font-weight:700;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
            .tab-info-sub{font-size:12px;color:#64748b;margin-top:1px}
            .lookup-toggle{
              border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;
              border-radius:8px;padding:7px 10px;cursor:pointer;font-weight:600
            }
            .lookup-toggle:hover{background:#dbeafe}
            .more-wrap{position:relative}
            .more-btn{
              width:34px;height:34px;border:1px solid #cbd5e1;border-radius:8px;
              background:#fff;cursor:pointer;font-size:18px;color:#475569
            }
            .more-btn:hover{background:#f8fafc}
            .tab-menu{
              position:absolute;right:0;top:39px;z-index:30;width:170px;
              background:#fff;border:1px solid #e2e8f0;border-radius:10px;
              box-shadow:0 12px 30px rgba(15,23,42,.15);padding:5px
            }
            .tab-menu button{
              display:block;width:100%;border:0;background:#fff;text-align:left;
              border-radius:7px;padding:8px 9px;cursor:pointer;color:#334155
            }
            .tab-menu button:hover{background:#f1f5f9}
            .tab-menu button.menu-danger{color:#be123c}

            .toolbar{display:flex;flex-wrap:wrap;gap:8px;padding:10px 12px;border-bottom:1px solid #e2e8f0;background:#fff;align-items:center}
            .table-color-wrap{position:relative}
            .table-color-menu{
              position:absolute;top:calc(100% + 6px);left:0;z-index:55;
              width:190px;padding:9px;background:#fff;border:1px solid #cbd5e1;
              border-radius:10px;box-shadow:0 10px 28px rgba(15,23,42,.18)
            }
            .table-color-title{font-size:11px;font-weight:700;color:#64748b;margin:0 0 7px}
            .table-color-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
            .table-color-option{
              height:34px;border:1px solid #cbd5e1;border-radius:8px;cursor:pointer;
              position:relative;padding:0;background:var(--swatch)
            }
            .table-color-option:hover{transform:translateY(-1px);box-shadow:0 3px 8px rgba(15,23,42,.15)}
            .table-color-option.active:after{
              content:"✓";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
              color:#fff;font-weight:800;font-size:16px;text-shadow:0 1px 3px rgba(0,0,0,.5)
            }

            .panel{padding:10px 12px;border-bottom:1px solid #e2e8f0;background:#f8fafc}
            select,input[type=text]{font:inherit;border:1px solid #cbd5e1;border-radius:7px;padding:6px 8px;background:#fff;min-width:0}
            .rule-grid{display:grid;grid-template-columns:145px minmax(150px,1fr) 145px minmax(150px,1fr);gap:8px;align-items:center}
            .rule-grid label{font-weight:600}

            .rules-head{
              display:flex;align-items:center;justify-content:space-between;gap:10px;
              margin:0;
              padding:10px 12px;
              position:sticky;top:0;z-index:10;
              background:#f8fafc;
              border-bottom:1px solid #e2e8f0;
              box-shadow:0 1px 0 rgba(226,232,240,.9)
            }
            #lookupRules{padding:10px 12px 2px}
            .rules-title{font-size:13px;font-weight:700;color:#334155}
            .rule-card{
              border:1px solid #dbe3ee;border-radius:11px;background:#fff;
              padding:11px;margin-bottom:10px
            }
            .rule-card-head{
              display:flex;align-items:center;gap:8px;margin-bottom:10px
            }
            .rule-no{
              display:flex;align-items:center;justify-content:center;
              min-width:25px;height:25px;padding:0 6px;border-radius:7px;
              background:#eef2ff;color:#4338ca;font-weight:700;font-size:12px
            }
            .rule-name{
              flex:1;min-width:0;border:0;background:transparent;
              font-weight:700;color:#0f172a;padding:4px 2px;outline:none
            }
            .rule-name:focus{background:#f8fafc;border-radius:6px}
            .rule-remove{
              border:0;background:transparent;color:#94a3b8;cursor:pointer;
              width:28px;height:28px;border-radius:7px;font-size:17px
            }
            .rule-remove:hover{background:#fff1f2;color:#e11d48}
            .rule-card .rule-grid{margin-bottom:8px}
            .rule-actions{
              display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px
            }
            .rule-ref-name{
              font-size:11px;color:#64748b;background:#f8fafc;
              padding:3px 7px;border-radius:999px
            }

            .returns{margin-top:8px;display:flex;flex-direction:column;gap:6px}
            .return-row{display:grid;grid-template-columns:minmax(120px,1fr) 28px minmax(120px,1fr) 34px;gap:6px;align-items:center}
            .arrow{text-align:center}
            .gridwrap{flex:1;min-height:0;overflow:auto;background:#fff}
            .zoom-stage{transform-origin:top left;display:inline-block;min-width:100%}
            table{border-collapse:separate;border-spacing:0;min-width:100%;table-layout:fixed}
            th,td{border-right:1px solid #dbeafe;border-bottom:1px solid #dbeafe;height:31px;min-width:130px}
            th{position:sticky;top:0;z-index:2;background:#4472c4;color:#fff;font-weight:700;padding:0}
            th.index,td.index{position:sticky;left:0;z-index:3;min-width:48px;width:48px;text-align:center;background:#f1f5f9;color:#475569}
            th.index{z-index:4;background:#334155;color:#fff}
            .headcell{display:flex;align-items:center;height:100%}
            .headname{flex:1;padding:6px 8px;outline:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
            .col-del{width:26px;border:0;background:transparent;color:#fff;cursor:pointer;font-size:15px}
            td.cell{padding:5px 7px;outline:none;vertical-align:middle;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#fff}
            tr:nth-child(even) td.cell{background:#eef4ff}
            td.cell:focus{outline:2px solid #2563eb;outline-offset:-2px;background:#fff}

            /* Màu bảng - đổi bằng nút 🎨 */
            .gridwrap[data-table-theme="blue"] th{background:#4472c4}
            .gridwrap[data-table-theme="blue"] th.index{background:#334155}
            .gridwrap[data-table-theme="blue"] tr:nth-child(even) td.cell{background:#eef4ff}

            .gridwrap[data-table-theme="green"] th{background:#548235}
            .gridwrap[data-table-theme="green"] th.index{background:#375623}
            .gridwrap[data-table-theme="green"] tr:nth-child(even) td.cell{background:#e2f0d9}

            .gridwrap[data-table-theme="orange"] th{background:#c65911}
            .gridwrap[data-table-theme="orange"] th.index{background:#843c0c}
            .gridwrap[data-table-theme="orange"] tr:nth-child(even) td.cell{background:#fce4d6}

            .gridwrap[data-table-theme="purple"] th{background:#7030a0}
            .gridwrap[data-table-theme="purple"] th.index{background:#4c1f6f}
            .gridwrap[data-table-theme="purple"] tr:nth-child(even) td.cell{background:#e4dfec}

            .gridwrap[data-table-theme="gray"] th{background:#595959}
            .gridwrap[data-table-theme="gray"] th.index{background:#3f3f3f}
            .gridwrap[data-table-theme="gray"] tr:nth-child(even) td.cell{background:#f2f2f2}

            .gridwrap[data-table-theme="teal"] th{background:#0f6b78}
            .gridwrap[data-table-theme="teal"] th.index{background:#084c55}
            .gridwrap[data-table-theme="teal"] tr:nth-child(even) td.cell{background:#e2f0f2}
            .row-del{border:0;background:transparent;color:#be123c;cursor:pointer;font-weight:700}
            .status{padding:7px 12px;border-top:1px solid #e2e8f0;background:#f8fafc;color:#475569;display:flex;gap:12px;align-items:center}
            .pill{display:inline-block;padding:2px 7px;border-radius:999px;background:#e2e8f0}
            .small{font-size:12px;color:#64748b}
            .check{display:inline-flex;align-items:center;gap:5px}
            .hit{background:#ecfdf5!important}.notfound{background:#fff1f2!important;color:#be123c}
            .modal-bg{
              position:absolute;inset:0;z-index:80;
              display:flex;align-items:center;justify-content:center;
              padding:20px;
              background:rgba(15,23,42,.22);
              backdrop-filter:blur(2px);
            }
            .modal{
              width:min(420px,calc(100% - 24px));
              background:#fff;
              border:1px solid #e2e8f0;
              border-radius:12px;
              box-shadow:0 18px 50px rgba(15,23,42,.18);
              overflow:hidden;
              animation:modalIn .16s ease-out;
            }
            @keyframes modalIn{
              from{opacity:0;transform:translateY(6px) scale(.985)}
              to{opacity:1;transform:translateY(0) scale(1)}
            }
            .modal-head{
              display:flex;align-items:center;gap:10px;
              padding:14px 16px 10px;
            }
            .modal-symbol{
              width:28px;height:28px;flex:0 0 28px;
              display:flex;align-items:center;justify-content:center;
              border-radius:8px;
              font-size:14px;font-weight:800;
            }
            .modal-symbol.info{background:#eff6ff;color:#2563eb}
            .modal-symbol.success{background:#ecfdf5;color:#16a34a}
            .modal-symbol.warning{background:#fff7ed;color:#ea580c}
            .modal-symbol.error{background:#fff1f2;color:#e11d48}
            .modal-symbol.question{background:#f8fafc;color:#475569}
            .modal-title{
              margin:0;
              font-size:15px;
              line-height:1.25;
              color:#0f172a;
              font-weight:700;
            }
            .modal-body{
              padding:0 16px 14px 54px;
              color:#475569;
              font-size:13px;
              line-height:1.5;
              white-space:pre-wrap;
            }
            .modal-input{
              display:block;
              width:calc(100% - 32px);
              margin:0 16px 14px;
              border:1px solid #cbd5e1;
              border-radius:8px;
              padding:9px 10px;
              outline:none;
              background:#fff;
              color:#0f172a;
            }
            .modal-input:focus{
              border-color:#3b82f6;
              box-shadow:0 0 0 3px rgba(59,130,246,.12);
            }
            .modal-actions{
              display:flex;justify-content:flex-end;gap:8px;
              padding:10px 16px 14px;
              border-top:1px solid #f1f5f9;
              background:#fff;
            }
            .modal-btn{
              border:1px solid #cbd5e1;
              border-radius:8px;
              padding:7px 12px;
              min-width:72px;
              background:#fff;
              color:#334155;
              cursor:pointer;
              font-weight:600;
            }
            .modal-btn:hover{background:#f8fafc}
            .modal-btn.primary{
              background:#2563eb;
              border-color:#2563eb;
              color:#fff;
            }
            .modal-btn.primary:hover{background:#1d4ed8}
            .modal-btn.danger{
              background:#e11d48;
              border-color:#e11d48;
              color:#fff;
            }
            .modal-btn.danger:hover{background:#be123c}
            .modal-close{
              margin-left:auto;
              width:28px;height:28px;
              border:0;border-radius:7px;
              background:transparent;color:#94a3b8;
              cursor:pointer;font-size:18px;line-height:1;
            }
            .modal-close:hover{background:#f1f5f9;color:#475569}
            .choice{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 16px}
            .choice-card{border:1px solid #e2e8f0;border-radius:10px;padding:12px;cursor:pointer;background:#fff;text-align:left}
            .choice-card.selected{border-color:#3b82f6;background:#eff6ff}
            .choice-card b{display:block;margin-bottom:4px;color:#0f172a}
            .rename{font-weight:700}
            .spacer{flex:1}
            .resize-handle{
              position:absolute;right:0;bottom:0;width:22px;height:22px;
              cursor:nwse-resize;z-index:60
            }
            .resize-handle:before{
              content:"";position:absolute;right:4px;bottom:4px;width:12px;height:12px;
              border-right:2px solid #64748b;border-bottom:2px solid #64748b;
              box-shadow:4px 4px 0 -2px #64748b
            }
    
                        .topbtn:disabled{opacity:.38;cursor:not-allowed;background:#f8fafc}


            .app-tooltip{
              position:fixed;z-index:2147483647;
              max-width:260px;padding:7px 9px;
              border-radius:7px;
              background:#0f172a;color:#f8fafc;
              box-shadow:0 8px 24px rgba(15,23,42,.22);
              font-size:11px;line-height:1.35;font-weight:500;
              pointer-events:none;opacity:0;
              transform:translateY(3px) scale(.98);
              transition:opacity .11s ease,transform .11s ease;
              white-space:normal;
            }
            .app-tooltip.show{opacity:1;transform:translateY(0) scale(1)}
            .app-tooltip-title{font-weight:700;color:#fff}
            .app-tooltip-shortcut{
              display:inline-block;margin-left:6px;padding:1px 5px;
              border:1px solid rgba(255,255,255,.18);border-radius:4px;
              color:#cbd5e1;font-size:10px
            }
            .app-tooltip::after{
              content:"";position:absolute;left:50%;bottom:-5px;transform:translateX(-50%);
              border:5px solid transparent;border-top-color:#0f172a;border-bottom:0
            }
            .app-tooltip.bottom::after{
              top:-5px;bottom:auto;border-top:0;border-bottom:5px solid #0f172a
            }


            .tab-history-actions{display:inline-flex;align-items:center;gap:3px;margin-left:auto;margin-right:4px}
            .tab-history-btn{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #dbe3ee;border-radius:6px;background:#fff;color:#475569;font-size:16px;line-height:1;cursor:pointer;transition:.12s ease}
            .tab-history-btn:hover:not(:disabled){background:#f1f5f9;border-color:#cbd5e1;color:#0f172a}
            .tab-history-btn:active:not(:disabled){transform:translateY(1px)}
            .tab-history-btn:disabled{opacity:.32;cursor:not-allowed;background:#f8fafc}

      
            /* ===== v12: giao diện bảng + thiết lập gọn hơn ===== */
            .tab-info{padding:9px 12px;gap:7px;background:#fff}
            .tab-info-actions{display:flex;align-items:center;gap:6px;flex-wrap:nowrap}
            .tab-action{
              height:32px;display:inline-flex;align-items:center;justify-content:center;gap:6px;
              border:1px solid #dbe3ee;border-radius:8px;background:#fff;color:#334155;
              padding:0 9px;cursor:pointer;font-weight:600;white-space:nowrap
            }
            .tab-action:hover{background:#f8fafc;border-color:#cbd5e1}
            .tab-action.primary{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8}
            .tab-action.icon{width:32px;padding:0;font-size:16px}
            .tab-action:disabled{opacity:.34;cursor:not-allowed;background:#f8fafc}
            .toolbar{padding:7px 12px;gap:6px;background:#f8fafc}
            .toolbar .btn{padding:5px 9px;border-radius:7px;background:#fff}
            .toolbar-note{margin-left:auto;font-size:11px;color:#94a3b8}

            .settings-panel.open{
              display:flex;flex-direction:column;max-height:48%;
              overflow:hidden;padding:0;background:#f8fafc
            }
            .rules-head{
              position:relative;top:auto;flex:0 0 auto;padding:10px 12px;background:#fff;
              box-shadow:none;border-bottom:1px solid #e2e8f0
            }
            #lookupRules{overflow-y:auto;min-height:0;padding:10px 12px 4px}
            .rule-card{padding:0;margin-bottom:9px;overflow:hidden;border-radius:10px;box-shadow:0 1px 2px rgba(15,23,42,.03)}
            .rule-card-head{margin:0;padding:8px 10px;border-bottom:1px solid #eef2f7;background:#fbfdff}
            .rule-no{min-width:22px;height:22px;border-radius:6px}
            .rule-name{font-size:13px}
            .rule-ref-name{background:#eef6ff;color:#2563eb}
            .rule-card .rule-grid{
              margin:0;padding:10px;
              grid-template-columns:repeat(4,minmax(0,1fr));
              gap:8px
            }
            .rule-grid label{
              display:flex;flex-direction:column;gap:4px;font-size:11px;font-weight:600;color:#64748b
            }
            .rule-grid label select{width:100%;color:#1f2937;font-size:12px}
            .returns{margin:0;padding:0 10px 8px}
            .returns-title{font-size:11px;font-weight:700;color:#64748b;margin-bottom:5px}
            .return-row{grid-template-columns:minmax(100px,1fr) 22px minmax(100px,1fr) 28px}
            .return-row select{width:100%;font-size:12px;padding:5px 7px}
            .rule-actions{margin:0;padding:0 10px 10px}
            .rule-actions .btn{padding:5px 8px;font-size:12px}
            @media(max-width:850px){
              .rule-card .rule-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
              .toolbar-note{display:none}
            }

            /* Excel-like range selection */
            td.cell{user-select:none}
            td.cell.range-selected{
              background:#dbeafe!important;
              box-shadow:inset 0 0 0 1px rgba(37,99,235,.16)
            }
            td.cell.range-anchor{outline:2px solid #2563eb!important;outline-offset:-2px}
            td.cell.range-top{border-top:2px solid #2563eb!important}
            td.cell.range-bottom{border-bottom:2px solid #2563eb!important}
            td.cell.range-left{border-left:2px solid #2563eb!important}
            td.cell.range-right{border-right:2px solid #2563eb!important}
            th.index.select-all-corner{cursor:pointer}
            th.index.select-all-corner:hover{background:#1e40af}


            /* ===== v13: Excel interactions + compact lookup rules ===== */
            th[data-col-select],td.index[data-row-select]{cursor:pointer;user-select:none}
            th[data-col-select]:hover,td.index[data-row-select]:hover{filter:brightness(.94)}
            th.col-selected{background:#1d4ed8!important}
            td.index.row-selected{background:#dbeafe!important;color:#1d4ed8;font-weight:700}

            .rule-card.collapsed .rule-card-body{display:none}
            .rule-card-head{cursor:default}
            .rule-collapse{
              width:25px;height:25px;border:0;border-radius:6px;background:transparent;
              color:#64748b;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center
            }
            .rule-collapse:hover{background:#e2e8f0;color:#0f172a}
            .rule-summary{
              min-width:0;flex:1;display:flex;align-items:center;gap:7px;overflow:hidden
            }
            .rule-summary-text{
              min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
              font-size:11px;color:#64748b
            }
            .rule-card:not(.collapsed) .rule-summary-text{display:none}
            .rule-card.collapsed .rule-name{max-width:180px}
            .rule-card-body{background:#fff}

            .sheet-context-menu{
              position:fixed;z-index:2147483647;width:205px;padding:5px;
              background:#fff;border:1px solid #dbe3ee;border-radius:10px;
              box-shadow:0 14px 34px rgba(15,23,42,.18)
            }
            .sheet-context-menu button{
              width:100%;display:flex;align-items:center;justify-content:space-between;
              gap:12px;border:0;border-radius:7px;background:#fff;color:#334155;
              padding:7px 9px;text-align:left;cursor:pointer;font-size:12px
            }
            .sheet-context-menu button:hover{background:#f1f5f9}
            .sheet-context-menu button.danger{color:#be123c}
            .sheet-context-menu .ctx-sep{height:1px;background:#e2e8f0;margin:4px 3px}
            .sheet-context-menu kbd{font:10px Arial;color:#94a3b8}

</style>

          <div class="wrap">
            <div class="topbar">
              <div class="title">Mini Excel - Multi Tab</div>
              <button class="mini-restore" data-act="restore-mini" data-tip="Mở lại bảng">▦ Mini Excel</button>
              <button class="topbtn" data-act="toggle-search" data-tip="Tìm kiếm dữ liệu trong tab hiện tại" data-shortcut="Search">⌕ Search</button>
              <button class="topbtn" data-act="zoom-out" data-tip="Thu nhỏ nội dung bảng">−</button>
              <button class="topbtn" data-act="zoom-reset" data-tip="Đưa tỷ lệ hiển thị về 100%"><span id="zoomLabel">100%</span></button>
              <button class="topbtn" data-act="zoom-in" data-tip="Phóng to nội dung bảng">＋</button>
              <button class="topbtn" data-act="save">Lưu</button>
              <button class="topbtn" data-act="reset">Reset</button>
              <button class="topbtn" data-act="minimize" data-tip="Thu gọn Mini Excel xuống góc phải">▣</button>
              <button class="topbtn close" data-act="close">✕</button>
            </div>
            <div class="tabsbar" id="tabsbar"></div>
            <div class="body" id="content"></div>
            <div id="modalRoot"></div>
            <div id="tooltipRoot"></div>
            <div class="resize-handle" data-tip="Kéo góc này để thay đổi kích thước cửa sổ"></div>
          </div>
        `;

        const $ = s => shadow.querySelector(s);
        const $$ = s => [...shadow.querySelectorAll(s)];

        function optionList(cols, selected) {
          return cols.map((c,i) => `<option value="${i}" ${i===Number(selected)?'selected':''}>${esc(c || `Cột ${i+1}`)}</option>`).join('');
        }

        function renderTabs() {
          $('#tabsbar').innerHTML = state.tabs.map(t => `
            <div class="tab ${t.id===state.activeTabId?'active':''}" data-tab-id="${esc(t.id)}">
              <span class="type-dot ${t.type==='input'?'type-input':'type-reference'}"></span>
              <span class="tabname" title="${esc(t.name)}">${esc(t.name)}</span>
              <button class="tabclose" data-close-tab="${esc(t.id)}" data-tip="Xóa tab">×</button>
            </div>
          `).join('') + `<button class="addtab" data-act="add-tab">＋ Tab</button>`;
        }

        function render() {
          // Mỗi tab có màu bảng riêng. Dữ liệu cũ chưa có tableTheme sẽ dùng xanh dương.
          state.tabs.forEach(t => {
            if (!t.tableTheme) t.tableTheme = 'blue';
          });
          if (!getActiveTab()) state.activeTabId = state.tabs[0]?.id;
          const zl = $('#zoomLabel');
          if (zl) zl.textContent = state.zoom + '%';
          renderTabs();
          const tab = getActiveTab();
          if (!tab) return;
          ensureBlankRow(tab);
          if (tab.type === 'input') renderInputTab(tab);
          else renderReferenceTab(tab);
          updateUndoRedoButtons();
        }


        function searchBarHTML(tab) {
          const colOptions = [
            `<option value="all" ${state.searchColumn === 'all' ? 'selected' : ''}>Tất cả cột</option>`,
            ...tab.columns.map((c, i) =>
              `<option value="${i}" ${String(state.searchColumn) === String(i) ? 'selected' : ''}>${esc(c || `Cột ${i+1}`)}</option>`
            )
          ].join('');

          return `
            <div class="searchbar ${state.searchOpen ? 'open' : ''}" id="searchbar">
              <div class="search-input-wrap">
                <input id="searchInput" class="searchbox" type="text"
                  placeholder="Nhập nội dung cần tìm..." value="${esc(state.searchQuery || '')}">
                <button class="search-clear ${(state.searchQuery || '') ? 'show' : ''}"
                  id="searchClear" type="button" data-tip="Xóa nội dung tìm kiếm">×</button>
              </div>
              <select id="searchColumn">${colOptions}</select>
              <span class="search-count" id="searchCount"></span>
            </div>
          `;
        }

        function tableColorButtonHTML() {
          const current = getActiveTab()?.tableTheme || 'blue';
          const colors = [
            ['blue','#4472c4','Xanh dương'],
            ['green','#548235','Xanh lá'],
            ['orange','#c65911','Cam'],
            ['purple','#7030a0','Tím'],
            ['teal','#0f6b78','Teal'],
            ['gray','#595959','Xám']
          ];
          return `
            <div class="table-color-wrap">
              <button class="btn" data-act="toggle-table-color" data-tip="Chọn màu bảng">🎨 Màu bảng</button>
              <div class="table-color-menu" id="tableColorMenu" style="display:none">
                <div class="table-color-title">CHỌN MÀU BẢNG</div>
                <div class="table-color-grid">
                  ${colors.map(([id,color,name]) => `
                    <button class="table-color-option ${current===id?'active':''}"
                      data-table-color="${id}" style="--swatch:${color}" data-tip="${name}"
                      aria-label="${name}"></button>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        }

        function renderInputTab(tab) {
          const refs = referenceTabs();

          if (!Array.isArray(tab.lookupRules)) tab.lookupRules = [];

          if (!tab.lookupRules.length && refs.length) {
            tab.lookupRules.push({
              id: uid(),
              name: 'Tham chiếu 1',
              referenceTabId: refs[0].id,
              sourceCol: 0,
              refCol: 0,
              mode: 'exact-normalized',
              autoLookup: true,
              outputs: []
            });
          }

          tab.lookupRules.forEach((rule, i) => {
            if (!rule.id) rule.id = uid();
            if (!rule.name) rule.name = `Tham chiếu ${i + 1}`;

            if (!refs.some(r => r.id === rule.referenceTabId)) {
              rule.referenceTabId = refs[0]?.id || '';
              rule.refCol = 0;
              rule.outputs = [];
            }

            rule.sourceCol = Math.min(
              Math.max(Number(rule.sourceCol) || 0, 0),
              Math.max(tab.columns.length - 1, 0)
            );
            rule.outputs = Array.isArray(rule.outputs) ? rule.outputs : [];
          });

          $('#content').innerHTML = `
            ${searchBarHTML(tab)}
            <div class="tab-info">
              <div class="tab-info-main">
                <div class="tab-info-title">${esc(tab.name)}</div>
                <div class="tab-info-sub">Tab nhập liệu</div>
              </div>
              <div class="tab-info-actions">
                <button class="tab-action primary" data-act="toggle-settings" data-tip="Thiết lập tra cứu">${state.settingsOpen ? 'Ẩn tra cứu' : '🔗 Tra cứu'}</button>
                <button class="tab-action" data-act="export-xlsx" data-tip="Xuất riêng tab này ra Excel">⇩ Excel</button>
                <button class="tab-action icon" data-act="undo" data-tip="Hoàn tác trong tab này" data-shortcut="Ctrl + Z" disabled>↶</button>
                <button class="tab-action icon" data-act="redo" data-tip="Làm lại trong tab này" data-shortcut="Ctrl + Y" disabled>↷</button>
              </div>
              <div class="more-wrap">
                <button class="more-btn" data-act="toggle-tab-menu" data-tip="Tùy chọn cho tab hiện tại">⋮</button>
                <div class="tab-menu" id="tabMenu" style="display:none">
                  <button data-act="rename-tab">✏ Đổi tên tab</button>
                  <button data-act="duplicate-tab">▣ Nhân bản tab</button>
                  <button class="menu-danger" data-act="delete-active-tab">🗑 Xóa tab</button>
                </div>
              </div>
            </div>

            <div class="panel settings-panel ${state.settingsOpen ? 'open' : ''}">
              ${refs.length ? `
                <div class="rules-head">
                  <div>
                    <div class="rules-title">Quy tắc tham chiếu</div>
                    <div class="small">Thiết lập nhiều nguồn tham chiếu. Tra cứu được thực hiện tự động khi dữ liệu đầu vào thay đổi.</div>
                  </div>
                  <button class="btn" data-act="add-rule">+ Thêm quy tắc</button>
                </div>

                <div id="lookupRules">
                  ${tab.lookupRules.map((rule, ruleIndex) => {
                    const ref = getTab(rule.referenceTabId);
                    return `
                      <div class="rule-card ${rule.collapsed ? 'collapsed' : ''}" data-rule-id="${esc(rule.id)}">
                        <div class="rule-card-head">
                          <button class="rule-collapse" type="button" data-rule-collapse="${esc(rule.id)}"
                            data-tip="Thu gọn / mở rộng quy tắc">${rule.collapsed ? '▶' : '▼'}</button>
                          <span class="rule-no">${ruleIndex + 1}</span>
                          <div class="rule-summary">
                            <input class="rule-name" type="text"
                              value="${esc(rule.name || `Tham chiếu ${ruleIndex + 1}`)}"
                              data-tip="Bấm vào đây để đổi tên quy tắc">
                            <span class="rule-summary-text">${esc(tab.columns[rule.sourceCol] || `Cột ${rule.sourceCol+1}`)} → ${esc(ref?.columns?.[rule.refCol] || `Cột ${rule.refCol+1}`)} · ${(rule.outputs || []).length} cột trả về</span>
                          </div>
                          <span class="rule-ref-name">${esc(ref?.name || 'Chưa chọn bảng')}</span>
                          <button class="rule-remove" data-act="remove-rule"
                            data-rule-id="${esc(rule.id)}" data-tip="Xóa quy tắc tham chiếu này">×</button>
                        </div>

                        <div class="rule-card-body">
                        <div class="rule-grid">
                          <label><span>Bảng tham chiếu</span>
                            <select class="rule-reference">
                              ${refs.map(r => `<option value="${esc(r.id)}" ${r.id===rule.referenceTabId?'selected':''}>${esc(r.name)}</option>`).join('')}
                            </select>
                          </label>
                          <label><span>Cột cần tìm</span>
                            <select class="rule-source">${optionList(tab.columns, rule.sourceCol)}</select>
                          </label>
                          <label><span>So với cột</span>
                            <select class="rule-ref-col">${optionList(ref?.columns || [], rule.refCol)}</select>
                          </label>
                          <label><span>Kiểu so sánh</span>
                            <select class="rule-mode">
                              <option value="exact-normalized" ${rule.mode==='exact-normalized'?'selected':''}>Chính xác · chuẩn hóa</option>
                              <option value="exact" ${rule.mode==='exact'?'selected':''}>Chính xác · nguyên bản</option>
                              <option value="contains-normalized" ${rule.mode==='contains-normalized'?'selected':''}>Có chứa · chuẩn hóa</option>
                              <option value="contains" ${rule.mode==='contains'?'selected':''}>Có chứa · nguyên bản</option>
                            </select>
                          </label>
                        </div>

                        <div class="returns">
                          <div class="returns-title">CỘT TRẢ VỀ <span style="font-weight:400;color:#94a3b8">· nguồn → cột nhận</span></div>
                          ${(rule.outputs || []).map((o, idx) => `
                            <div class="return-row" data-output="${idx}">
                              <select class="fromCol">${optionList(ref?.columns || [], o.fromCol)}</select>
                              <div class="arrow">→</div>
                              <select class="toCol">${optionList(tab.columns, o.toCol)}</select>
                              <button class="btn danger del-output" type="button">×</button>
                            </div>
                          `).join('')}
                        </div>

                        <div class="rule-actions">
                          <button class="btn" data-act="add-output"
                            data-rule-id="${esc(rule.id)}">+ Thêm cột trả về</button>
                        </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <div style="padding:6px 0">
                  Chưa có <b>Tab tham chiếu</b>. Hãy bấm <b>＋ Tab</b> và tạo tab loại <b>Tham chiếu</b>.
                </div>
              `}
            </div>

            <div class="toolbar">
              <button class="btn" data-act="add-row">+ Thêm dòng</button>
              <button class="btn" data-act="add-col">+ Thêm cột</button>
              ${tableColorButtonHTML()}
              <button class="btn" data-act="clear">Xóa dữ liệu</button>
              <span class="toolbar-note">Kéo để chọn vùng · Ctrl+C để copy · Ctrl+V để dán</span>
            </div>

            ${tableHTML(tab)}
            <div class="status">
              <span class="pill">${tab.rows.length} dòng</span>
              <span class="pill">${tab.columns.length} cột</span>
              <span id="lookupStatus">Sẵn sàng</span>
            </div>
          `;

          bindInputLookup(tab);
          bindSearch(tab);
          bindTable(tab);
          applySearch(tab);
        }

        function renderReferenceTab(tab) {
          $('#content').innerHTML = `
            ${searchBarHTML(tab)}
            <div class="tab-info">
              <div class="tab-info-main">
                <div class="tab-info-title">${esc(tab.name)}</div>
                <div class="tab-info-sub">Tab tham chiếu</div>
              </div>
              <div class="tab-info-actions">
                <button class="tab-action primary" data-act="import-xlsx" data-tip="Nhập dữ liệu Excel vào tab này">⇧ Import</button>
                <button class="tab-action" data-act="export-xlsx" data-tip="Xuất riêng tab này ra Excel">⇩ Excel</button>
                <button class="tab-action icon" data-act="undo" data-tip="Hoàn tác trong tab này" data-shortcut="Ctrl + Z" disabled>↶</button>
                <button class="tab-action icon" data-act="redo" data-tip="Làm lại trong tab này" data-shortcut="Ctrl + Y" disabled>↷</button>
              </div>
              <div class="more-wrap">
                <button class="more-btn" data-act="toggle-tab-menu" data-tip="Tùy chọn cho tab hiện tại">⋮</button>
                <div class="tab-menu" id="tabMenu" style="display:none">
                  <button data-act="rename-tab">✏ Đổi tên tab</button>
                  <button data-act="duplicate-tab">▣ Nhân bản tab</button>
                  <button class="menu-danger" data-act="delete-active-tab">🗑 Xóa tab</button>
                </div>
              </div>
            </div>
            <div class="toolbar">
              <button class="btn" data-act="add-row">+ Thêm dòng</button>
              <button class="btn" data-act="add-col">+ Thêm cột</button>
              ${tableColorButtonHTML()}
              <button class="btn" data-act="clear">Xóa dữ liệu</button>
              <span class="toolbar-note">Kéo để chọn vùng · Ctrl+C để copy · Ctrl+V để dán</span>
              <input id="xlsxInput" type="file" accept=".xlsx,.xls,.csv" style="display:none">
            </div>
            ${tableHTML(tab)}
            <div class="status">
              <span class="pill">${tab.rows.length} dòng</span>
              <span class="pill">${tab.columns.length} cột</span>
            </div>
          `;

          $('#xlsxInput')?.addEventListener('change', e => onImportExcel(tab, e));
          bindSearch(tab);
          bindTable(tab);
          applySearch(tab);
        }

        function tableHTML(tab) {
          return `
            <div class="gridwrap" data-table-theme="${esc(tab.tableTheme || 'blue')}">
              <div class="zoom-stage" style="zoom:${state.zoom / 100}">
              <table data-table-id="${esc(tab.id)}" tabindex="0">
                <thead>
                  <tr>
                    <th class="index select-all-corner" data-select-all="1" data-tip="Chọn toàn bộ bảng">▦</th>
                    ${tab.columns.map((c,ci) => `
                      <th data-col-select="${ci}">
                        <div class="headcell">
                          <div class="headname" contenteditable="true" data-col-name="${ci}">${esc(c)}</div>
                          <button class="col-del" data-del-col="${ci}" data-tip="Xóa cột">×</button>
                        </div>
                      </th>
                    `).join('')}
                    <th class="index">X</th>
                  </tr>
                </thead>
                <tbody>
                  ${tab.rows.map((row,ri) => `
                    <tr>
                      <td class="index" data-row-select="${ri}">${ri+1}</td>
                      ${tab.columns.map((_,ci) => `<td class="cell" contenteditable="true" data-r="${ri}" data-c="${ci}">${esc(row[ci] ?? '')}</td>`).join('')}
                      <td class="index"><button class="row-del" data-del-row="${ri}">×</button></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              </div>
            </div>
          `;
        }

        function bindInputLookup(tab) {
          $$('.rule-card').forEach(card => {
            const ruleId = card.dataset.ruleId;
            const rule = (tab.lookupRules || []).find(r => r.id === ruleId);
            if (!rule) return;

            card.querySelector('[data-rule-collapse]')?.addEventListener('click', () => {
              rule.collapsed = !rule.collapsed;
              saveState();
              render();
            });

            card.querySelector('.rule-name')?.addEventListener('change', e => {
              rule.name = e.target.value.trim() || 'Tham chiếu';
              saveState();
            });

            card.querySelector('.rule-reference')?.addEventListener('change', e => {
              rule.referenceTabId = e.target.value;
              rule.refCol = 0;
              rule.outputs = [];
              saveState();
              render();
            });

            card.querySelector('.rule-source')?.addEventListener('change', e => {
              rule.sourceCol = +e.target.value;
              saveState();
            });

            card.querySelector('.rule-ref-col')?.addEventListener('change', e => {
              rule.refCol = +e.target.value;
              saveState();
            });

            card.querySelector('.rule-mode')?.addEventListener('change', e => {
              rule.mode = e.target.value;
              saveState();
            });

            card.querySelectorAll('.return-row').forEach(row => {
              const idx = +row.dataset.output;

              row.querySelector('.fromCol')?.addEventListener('change', e => {
                rule.outputs[idx].fromCol = +e.target.value;
                saveState();
              });

              row.querySelector('.toCol')?.addEventListener('change', e => {
                rule.outputs[idx].toCol = +e.target.value;
                saveState();
              });

              row.querySelector('.del-output')?.addEventListener('click', () => {
                rule.outputs.splice(idx, 1);
                saveState();
                render();
              });
            });
          });
        }


        function bindSearch(tab) {
          const input = $('#searchInput');
          const select = $('#searchColumn');

          input?.addEventListener('input', e => {
            state.searchQuery = e.target.value;
            $('#searchClear')?.classList.toggle('show', !!state.searchQuery);
            saveState();
            applySearch(tab);
          });

          $('#searchClear')?.addEventListener('click', () => {
            state.searchQuery = '';
            input.value = '';
            $('#searchClear')?.classList.remove('show');
            saveState();
            applySearch(tab);
            input.focus();
          });

          select?.addEventListener('change', e => {
            state.searchColumn = e.target.value;
            saveState();
            applySearch(tab);
          });

          input?.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
              state.searchQuery = '';
              input.value = '';
              $('#searchClear')?.classList.remove('show');
              saveState();
              applySearch(tab);
            }
          });
        }

        function applySearch(tab) {
          const q = normalize(state.searchQuery || '');
          const table = shadow.querySelector(`[data-table-id="${tab.id}"]`);

          const countEl = $('#searchCount');
          if (!table) return;

          table.querySelectorAll('tbody tr').forEach(tr => {
            tr.style.display = '';
            tr.querySelectorAll('.cell').forEach(c => c.classList.remove('search-hit'));
          });

          if (!q) {
            if (countEl) countEl.textContent = '';
            return;
          }

          let hits = 0;
          const col = state.searchColumn;

          table.querySelectorAll('tbody tr').forEach((tr, ri) => {
            const row = tab.rows[ri] || [];
            const indexes = col === 'all'
              ? tab.columns.map((_, i) => i)
              : [Number(col)];

            const matchedCols = indexes.filter(ci => normalize(row[ci] ?? '').includes(q));
            const matched = matchedCols.length > 0;

            tr.style.display = matched ? '' : 'none';

            if (matched) {
              hits++;
              matchedCols.forEach(ci => {
                tr.querySelector(`.cell[data-c="${ci}"]`)?.classList.add('search-hit');
              });
            }
          });

          if (countEl) countEl.textContent = `${hits} kết quả`;
        }

        function bindTable(tab) {
          let editStartSnapshot = null;
          let editStartTabId = null;

          const root = shadow.querySelector(`[data-table-id="${tab.id}"]`);
          if (!root) return;

          // Theo dõi thay đổi khi sửa ô / tên cột để Undo/Redo theo đúng tab.
          root.addEventListener('focusin', e => {
            if (e.target.matches('.cell,[contenteditable="true"]')) {
              editStartSnapshot = historySnapshot(tab);
              editStartTabId = tab.id;
            }
          });

          root.addEventListener('focusout', e => {
            if (editStartSnapshot && e.target.matches('.cell,[contenteditable="true"]')) {
              if (editStartSnapshot !== historySnapshot(tab)) {
                pushHistory(editStartSnapshot, editStartTabId || tab.id);
              }
              editStartSnapshot = null;
              editStartTabId = null;
            }
          });

          // Chọn vùng kiểu Excel: kéo chuột, Shift+click, Ctrl+A, Ctrl+C
          let selecting = false;
          let selStart = null;
          let selEnd = null;
          let selectionKind = 'cells'; // cells | row | col | all
          let ctrlACount = 0;

          const cellAt = (r,c) => root.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);

          function clearRangeVisual() {
            root.querySelectorAll('.range-selected,.range-anchor,.range-top,.range-bottom,.range-left,.range-right')
              .forEach(el => el.classList.remove('range-selected','range-anchor','range-top','range-bottom','range-left','range-right'));
            root.querySelectorAll('.col-selected').forEach(el => el.classList.remove('col-selected'));
            root.querySelectorAll('.row-selected').forEach(el => el.classList.remove('row-selected'));
          }

          function paintRange() {
            clearRangeVisual();
            if (!selStart || !selEnd) return;
            const r1 = Math.min(selStart.r, selEnd.r), r2 = Math.max(selStart.r, selEnd.r);
            const c1 = Math.min(selStart.c, selEnd.c), c2 = Math.max(selStart.c, selEnd.c);
            for (let r=r1; r<=r2; r++) {
              for (let c=c1; c<=c2; c++) {
                const el = cellAt(r,c);
                if (!el) continue;
                el.classList.add('range-selected');
                if (r===r1) el.classList.add('range-top');
                if (r===r2) el.classList.add('range-bottom');
                if (c===c1) el.classList.add('range-left');
                if (c===c2) el.classList.add('range-right');
              }
            }
            cellAt(selStart.r, selStart.c)?.classList.add('range-anchor');
            if (selectionKind === 'row') {
              for (let r=r1; r<=r2; r++) root.querySelector(`[data-row-select="${r}"]`)?.classList.add('row-selected');
            }
            if (selectionKind === 'col') {
              for (let c=c1; c<=c2; c++) root.querySelector(`[data-col-select="${c}"]`)?.classList.add('col-selected');
            }
          }

          function selectAllTable() {
            const lastDataRow = Math.max(0, tab.rows.length - 1);
            selectionKind = 'all';
            selStart = {r:0,c:0};
            selEnd = {r:lastDataRow,c:Math.max(0,tab.columns.length-1)};
            paintRange();
          }

          function selectedTSV() {
            if (!selStart || !selEnd) return '';
            const r1 = Math.min(selStart.r, selEnd.r), r2 = Math.max(selStart.r, selEnd.r);
            const c1 = Math.min(selStart.c, selEnd.c), c2 = Math.max(selStart.c, selEnd.c);
            const lines = [];
            if (selectionKind === 'all' && ctrlACount >= 2) {
              lines.push(tab.columns.slice(c1, c2 + 1).map(v => String(v ?? '')).join('\t'));
            }
            for (let r=r1; r<=r2; r++) {
              const vals = [];
              for (let c=c1; c<=c2; c++) vals.push(String(tab.rows[r]?.[c] ?? ''));
              lines.push(vals.join('\t'));
            }
            return lines.join('\n');
          }

          function closeSheetContextMenu() {
            shadow.querySelector('.sheet-context-menu')?.remove();
          }

          async function copySelection() {
            const text = selectedTSV();
            if (!text) return;
            try {
              await navigator.clipboard.writeText(text);
            } catch {
              const ta = document.createElement('textarea');
              ta.value = text;
              ta.style.position = 'fixed';
              ta.style.opacity = '0';
              shadow.appendChild(ta);
              ta.select();
              document.execCommand('copy');
              ta.remove();
            }
          }

          function clearSelectionData() {
            if (!selStart || !selEnd) return;
            const before = historySnapshot(tab);
            const r1 = Math.min(selStart.r, selEnd.r), r2 = Math.max(selStart.r, selEnd.r);
            const c1 = Math.min(selStart.c, selEnd.c), c2 = Math.max(selStart.c, selEnd.c);
            for (let r=r1; r<=r2; r++) for (let c=c1; c<=c2; c++) {
              if (tab.rows[r]) tab.rows[r][c] = '';
            }
            pushHistory(before, tab.id);
            ensureBlankRow(tab);
            saveState();
            render();
          }

          function insertRowAt(index) {
            const before = historySnapshot(tab);
            tab.rows.splice(Math.max(0,index), 0, Array(tab.columns.length).fill(''));
            pushHistory(before, tab.id);
            ensureBlankRow(tab); saveState(); render();
          }

          function insertColAt(index) {
            const before = historySnapshot(tab);
            const i = Math.max(0, Math.min(index, tab.columns.length));
            tab.columns.splice(i, 0, `Cột ${i+1}`);
            tab.rows.forEach(r => r.splice(i, 0, ''));
            pushHistory(before, tab.id);
            ensureRect(tab); saveState(); render();
          }

          root.addEventListener('contextmenu', e => {
            const cell = e.target.closest('.cell');
            if (!cell) return;
            e.preventDefault();

            const p = {r:+cell.dataset.r,c:+cell.dataset.c};
            const inside = selStart && selEnd &&
              p.r >= Math.min(selStart.r,selEnd.r) && p.r <= Math.max(selStart.r,selEnd.r) &&
              p.c >= Math.min(selStart.c,selEnd.c) && p.c <= Math.max(selStart.c,selEnd.c);

            if (!inside) {
              selectionKind = 'cells'; ctrlACount = 0;
              selStart = p; selEnd = p; paintRange();
            }

            closeSheetContextMenu();
            const menu = document.createElement('div');
            menu.className = 'sheet-context-menu';
            menu.innerHTML = `
              <button data-ctx="copy"><span>Copy</span><kbd>Ctrl+C</kbd></button>
              <button data-ctx="paste"><span>Paste</span><kbd>Ctrl+V</kbd></button>
              <button class="danger" data-ctx="clear"><span>Xóa nội dung</span><kbd>Delete</kbd></button>
              <div class="ctx-sep"></div>
              <button data-ctx="row-above"><span>Thêm dòng phía trên</span></button>
              <button data-ctx="row-below"><span>Thêm dòng phía dưới</span></button>
              <button data-ctx="col-left"><span>Thêm cột bên trái</span></button>
              <button data-ctx="col-right"><span>Thêm cột bên phải</span></button>
            `;
            shadow.appendChild(menu);

            const wrapRect = shadow.querySelector('.wrap').getBoundingClientRect();
            const mw = 205, mh = 260;
            menu.style.left = Math.min(e.clientX, wrapRect.right - mw - 8) + 'px';
            menu.style.top = Math.min(e.clientY, wrapRect.bottom - mh - 8) + 'px';

            menu.addEventListener('click', async ev => {
              const act = ev.target.closest('[data-ctx]')?.dataset.ctx;
              if (!act) return;
              closeSheetContextMenu();

              if (act === 'copy') await copySelection();
              if (act === 'clear') clearSelectionData();
              if (act === 'row-above') insertRowAt(p.r);
              if (act === 'row-below') insertRowAt(p.r + 1);
              if (act === 'col-left') insertColAt(p.c);
              if (act === 'col-right') insertColAt(p.c + 1);

              if (act === 'paste') {
                try {
                  const text = await navigator.clipboard.readText();
                  if (text) pasteGrid(tab, Math.min(selStart.r,selEnd.r), Math.min(selStart.c,selEnd.c), text);
                } catch {
                  notify('Trình duyệt không cho đọc Clipboard trực tiếp. Hãy dùng Ctrl + V.', 'warning', 'Không thể Paste');
                }
              }
            });
          });

          shadow.addEventListener('mousedown', e => {
            if (!e.target.closest('.sheet-context-menu')) closeSheetContextMenu();
          });

          root.addEventListener('mousedown', e => {
            const cell = e.target.closest('.cell');
            if (!cell || e.button !== 0) return;

            const point = {r:+cell.dataset.r,c:+cell.dataset.c};
            selectionKind = 'cells';
            ctrlACount = 0;

            if (e.shiftKey && selStart) {
              selEnd = point;
            } else {
              selStart = point;
              selEnd = point;
            }
            selecting = true;
            paintRange();
            root.focus({preventScroll:true});

            // Giữ khả năng sửa ô bằng double click; click-kéo ưu tiên chọn vùng.
            if (e.detail === 1) e.preventDefault();
          });

          root.addEventListener('mouseover', e => {
            if (!selecting) return;
            const cell = e.target.closest('.cell');
            if (!cell) return;
            selEnd = {r:+cell.dataset.r,c:+cell.dataset.c};
            paintRange();
          });

          window.addEventListener('mouseup', () => { selecting = false; });

          root.querySelectorAll('[data-row-select]').forEach(h => {
            h.addEventListener('click', e => {
              e.preventDefault();
              const r = +h.dataset.rowSelect;
              selectionKind = 'row';
              ctrlACount = 0;
              selStart = {r, c:0};
              selEnd = {r, c:Math.max(0, tab.columns.length-1)};
              paintRange();
              root.focus({preventScroll:true});
            });
          });

          root.querySelectorAll('[data-col-select]').forEach(h => {
            h.addEventListener('click', e => {
              // Không chọn cột nếu người dùng đang thao tác nút xóa/tên cột.
              if (e.target.closest('.col-del,.headname')) return;
              e.preventDefault();
              const c = +h.dataset.colSelect;
              selectionKind = 'col';
              ctrlACount = 0;
              selStart = {r:0, c};
              selEnd = {r:Math.max(0, tab.rows.length-1), c};
              paintRange();
              root.focus({preventScroll:true});
            });
          });

          root.querySelector('[data-select-all]')?.addEventListener('click', e => {
            e.preventDefault();
            ctrlACount = 2;
            selectAllTable();
            root.focus({preventScroll:true});
          });

          root.addEventListener('dblclick', e => {
            const cell = e.target.closest('.cell');
            if (!cell) return;
            cell.focus();
            placeCaretEnd(cell);
          });

          root.addEventListener('keydown', async e => {
            const editingCell = e.target?.matches?.('.cell[contenteditable="true"]') && shadow.activeElement === e.target;

            // Nếu đang trực tiếp sửa nội dung trong ô, để Delete/Backspace hoạt động như text editor:
            // xóa từng ký tự / vùng ký tự đang bôi đen, KHÔNG xóa cả ô/vùng.
            if ((e.key === 'Delete' || e.key === 'Backspace') && editingCell) {
              return;
            }

            // Chỉ khi không ở chế độ edit text mới xóa toàn bộ vùng đang chọn.
            if ((e.key === 'Delete' || e.key === 'Backspace') && selStart && selEnd) {
              e.preventDefault();
              clearSelectionData();
              return;
            }

            const ctrl = e.ctrlKey || e.metaKey;
            if (!ctrl) return;
            const key = e.key.toLowerCase();

            // Khi đang edit text trong một ô, ưu tiên shortcut chuẩn của trình soạn thảo.
            if (editingCell && (key === 'x' || key === 'v')) {
              return;
            }

            if (key === 'a') {
              // Đang sửa một ô -> Ctrl+A chỉ chọn toàn bộ text trong ô đó.
              if (editingCell) {
                e.preventDefault();
                const range = document.createRange();
                range.selectNodeContents(e.target);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                return;
              }

              // Không edit ô -> Ctrl+A chọn toàn bộ bảng như Excel.
              e.preventDefault();
              ctrlACount = selectionKind === 'all' ? Math.min(ctrlACount + 1, 2) : 1;
              selectAllTable();
              return;
            }

            if (key === 'c' && editingCell) {
              return;
            }

            if (key === 'c' && selStart && selEnd) {
              e.preventDefault();
              await copySelection();
            }
          });


          root.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('input', () => {
              const r = +cell.dataset.r, c = +cell.dataset.c;
              tab.rows[r][c] = cell.innerText.replace(/\n/g,' ');

              if (tab.type === 'input' && Array.isArray(tab.lookupRules)) {
                tab.lookupRules
                  .filter(rule => c === rule.sourceCol)
                  .forEach(rule => lookupRowRule(tab, rule, r, true));
              }

              if (r === tab.rows.length - 1 && tab.rows[r].some(v => String(v).trim() !== '')) {
                ensureBlankRow(tab);
                saveState();
                render();
                const next = shadow.querySelector(`[data-table-id="${tab.id}"] .cell[data-r="${r}"][data-c="${c}"]`);
                next?.focus();
                placeCaretEnd(next);
                return;
              }
              saveState();
            });

            cell.addEventListener('keydown', e => {
              const r = +cell.dataset.r, c = +cell.dataset.c;
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                focusCell(tab, r+1, c);
              }
              if (e.key === 'Tab') {
                const dir = e.shiftKey ? -1 : 1;
                let nr = r, nc = c + dir;
                if (nc >= tab.columns.length) { nr++; nc = 0; }
                if (nc < 0) { nr--; nc = tab.columns.length - 1; }
                if (nr >= 0) {
                  e.preventDefault();
                  focusCell(tab, nr, nc);
                }
              }
            });

            cell.addEventListener('paste', e => {
              const text = e.clipboardData?.getData('text/plain');
              if (!text || (!text.includes('\t') && !text.includes('\n'))) return;
              e.preventDefault();
              pasteGrid(tab, +cell.dataset.r, +cell.dataset.c, text);
            });
          });

          root.querySelectorAll('[data-del-row]').forEach(btn => {
            btn.addEventListener('click', () => {
              tab.rows.splice(+btn.dataset.delRow, 1);
              ensureBlankRow(tab); saveState(); render();
            });
          });

          root.querySelectorAll('[data-del-col]').forEach(btn => {
            btn.addEventListener('click', () => {
              const i = +btn.dataset.delCol;
              if (tab.columns.length <= 1) { notify('Phải giữ lại ít nhất 1 cột.', 'warning'); return; }
              tab.columns.splice(i,1);
              tab.rows.forEach(r => r.splice(i,1));
              fixLookupIndexesAfterDelete(tab, i);
              saveState(); render();
            });
          });

          root.querySelectorAll('[data-col-name]').forEach(el => {
            el.addEventListener('blur', () => {
              const i = +el.dataset.colName;
              tab.columns[i] = el.innerText.trim() || `Cột ${i+1}`;
              saveState(); render();
            });
            el.addEventListener('keydown', e => {
              if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
            });
          });
        }

        function fixLookupIndexesAfterDelete(tab, deleted) {
          if (tab.type === 'input' && Array.isArray(tab.lookupRules)) {
            tab.lookupRules.forEach(rule => {
              if (rule.sourceCol === deleted) rule.sourceCol = 0;
              else if (rule.sourceCol > deleted) rule.sourceCol--;

              rule.outputs = (rule.outputs || []).map(o => ({
                ...o,
                toCol: o.toCol === deleted ? 0 : (o.toCol > deleted ? o.toCol - 1 : o.toCol)
              }));
            });
          }

          if (tab.type === 'reference') {
            state.tabs.filter(t => t.type === 'input').forEach(input => {
              (input.lookupRules || [])
                .filter(rule => rule.referenceTabId === tab.id)
                .forEach(rule => {
                  if (rule.refCol === deleted) rule.refCol = 0;
                  else if (rule.refCol > deleted) rule.refCol--;

                  rule.outputs = (rule.outputs || []).map(o => ({
                    ...o,
                    fromCol: o.fromCol === deleted ? 0 : (o.fromCol > deleted ? o.fromCol - 1 : o.fromCol)
                  }));
                });
            });
          }
        }


        function pasteGrid(tab, startR, startC, text) {
          const matrix = text.replace(/\r/g,'').split('\n');
          if (matrix[matrix.length-1] === '') matrix.pop();
          const cells = matrix.map(line => line.split('\t'));
          const neededCols = startC + Math.max(...cells.map(r => r.length));
          while (tab.columns.length < neededCols) {
            tab.columns.push(`Cột ${tab.columns.length+1}`);
            tab.rows.forEach(r => r.push(''));
          }
          while (tab.rows.length < startR + cells.length) {
            tab.rows.push(Array(tab.columns.length).fill(''));
          }
          ensureRect(tab);
          cells.forEach((row,rr) => row.forEach((v,cc) => {
            tab.rows[startR+rr][startC+cc] = v;
          }));

          // Paste nhiều ô không phát sinh event "input" cho từng cell,
          // nên phải chủ động chạy lại lookup cho các dòng vừa dán.
          if (tab.type === 'input' && Array.isArray(tab.lookupRules)) {
            const pastedStartC = startC;
            const pastedEndC = startC + Math.max(...cells.map(r => r.length)) - 1;

            tab.lookupRules.forEach(rule => {
              // Chỉ cần chạy rule nếu vùng paste chạm vào cột nguồn của rule.
              if (rule.sourceCol < pastedStartC || rule.sourceCol > pastedEndC) return;

              for (let rr = 0; rr < cells.length; rr++) {
                lookupRowRule(tab, rule, startR + rr, false);
              }
            });
          }

          ensureBlankRow(tab);
          saveState();
          render();
        }

        function focusCell(tab, r, c) {
          while (tab.rows.length <= r) tab.rows.push(Array(tab.columns.length).fill(''));
          ensureBlankRow(tab); saveState(); render();
          const el = shadow.querySelector(`[data-table-id="${tab.id}"] .cell[data-r="${r}"][data-c="${c}"]`);
          el?.focus(); placeCaretEnd(el);
        }

        function placeCaretEnd(el) {
          if (!el) return;
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(el);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }

        function lookupRowRule(inputTab, rule, rowIndex, updateDOM=false) {
          const ref = getTab(rule?.referenceTabId);
          if (!rule || !ref) return false;

          const row = inputTab.rows[rowIndex];
          const needle = row?.[rule.sourceCol];
          if (String(needle ?? '').trim() === '') return false;

          const refRow = ref.rows.find(r => matchValue(needle, r[rule.refCol], rule.mode));

          if (!refRow) {
            if (updateDOM) markRuleLookup(inputTab, rule, rowIndex, false);
            return false;
          }

          (rule.outputs || []).forEach(o => {
            if (o.toCol < inputTab.columns.length && o.fromCol < ref.columns.length) {
              row[o.toCol] = refRow[o.fromCol] ?? '';
            }
          });

          saveState();

          if (updateDOM) {
            (rule.outputs || []).forEach(o => {
              const cell = shadow.querySelector(
                `[data-table-id="${inputTab.id}"] .cell[data-r="${rowIndex}"][data-c="${o.toCol}"]`
              );
              if (cell) cell.innerText = row[o.toCol] ?? '';
            });
            markRuleLookup(inputTab, rule, rowIndex, true);
          }

          return true;
        }

        function markRuleLookup(tab, rule, rowIndex, found) {
          const cell = shadow.querySelector(
            `[data-table-id="${tab.id}"] .cell[data-r="${rowIndex}"][data-c="${rule.sourceCol}"]`
          );
          cell?.classList.remove('hit', 'notfound');
          cell?.classList.add(found ? 'hit' : 'notfound');
        }

        function runOneRule(tab, rule) {
          let checked = 0;
          let found = 0;

          tab.rows.forEach((row, i) => {
            if (String(row[rule.sourceCol] ?? '').trim() === '') return;
            checked++;
            if (lookupRowRule(tab, rule, i, false)) found++;
          });

          saveState();
          render();

          const s = $('#lookupStatus');
          if (s) s.textContent = `${rule.name || 'Tham chiếu'}: tìm thấy ${found}/${checked} dòng`;
        }

        function lookupAll(tab) {
          const rules = Array.isArray(tab.lookupRules) ? tab.lookupRules : [];
          let checked = 0;
          let found = 0;

          rules.forEach(rule => {
            tab.rows.forEach((row, i) => {
              if (String(row[rule.sourceCol] ?? '').trim() === '') return;
              checked++;
              if (lookupRowRule(tab, rule, i, false)) found++;
            });
          });

          saveState();
          render();

          const s = $('#lookupStatus');
          if (s) s.textContent = `Đã chạy ${rules.length} tham chiếu · tìm thấy ${found}/${checked} lượt`;
        }


        async function loadXLSX() {
          if (window.XLSX) return;
          await new Promise((resolve,reject) => {
            const s = document.createElement('script');
            s.src = XLSX_URL;
            s.onload = resolve;
            s.onerror = () => reject(new Error('Không tải được thư viện XLSX.'));
            document.head.appendChild(s);
          });
        }

        async function onImportExcel(tab, e) {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            await loadXLSX();
            const buf = await file.arrayBuffer();
            const wb = XLSX.read(buf,{type:'array'});
            const ws = wb.Sheets[wb.SheetNames[0]];
            const matrix = XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
            if (!matrix.length) throw new Error('File không có dữ liệu.');

            const maxCols = Math.max(...matrix.map(r => r.length),1);
            tab.columns = Array.from({length:maxCols},(_,i) =>
              String(matrix[0]?.[i] ?? '').trim() || `Cột ${i+1}`
            );
            tab.rows = matrix.slice(1).map(r => Array.from({length:maxCols},(_,i)=>r[i] ?? ''));
            ensureBlankRow(tab);

            state.tabs.filter(t => t.type === 'input').forEach(input => {
              (input.lookupRules || [])
                .filter(rule => rule.referenceTabId === tab.id)
                .forEach(rule => {
                  rule.refCol = Math.min(rule.refCol, tab.columns.length - 1);
                  rule.outputs = (rule.outputs || []).map(o => ({
                    ...o,
                    fromCol: Math.min(o.fromCol, tab.columns.length - 1)
                  }));
                });
            });

            saveState(); render();
            await notify(`Đã import ${matrix.length-1} dòng từ sheet "${wb.SheetNames[0]}".`, 'success', 'Import thành công');
          } catch(err) {
            await notify('Import lỗi: ' + (err?.message || err), 'error', 'Import thất bại');
          } finally {
            e.target.value = '';
          }
        }

        function xmlEsc(v) {
          return String(v ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
        }

        function downloadExcelXml(tab) {
          const rows = [
            tab.columns,
            ...tab.rows.filter(r => r.some(v => String(v).trim() !== ''))
          ];

          const worksheetRows = rows.map((row, ri) => {
            const cells = row.map(v =>
              `<Cell><Data ss:Type="String">${xmlEsc(v)}</Data></Cell>`
            ).join('');
            return `<Row>${cells}</Row>`;
          }).join('');

          const sheetName = (tab.name || 'Data').replace(/[\\/:*?\[\]]/g, '_').slice(0,31) || 'Data';
          const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="${xmlEsc(sheetName)}">
  <Table>
   ${worksheetRows}
  </Table>
 </Worksheet>
</Workbook>`;

          const blob = new Blob(['\ufeff', xml], {
            type: 'application/vnd.ms-excel;charset=utf-8'
          });

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const safe = (tab.name || 'tab').replace(/[\\/:*?"<>|]/g, '_');
          a.href = url;
          a.download = `${safe || 'tab'}.xls`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1500);
        }

        async function exportTab(tab) {
          try {
            // Nếu XLSX đã có sẵn thì xuất .xlsx chuẩn.
            if (window.XLSX) {
              const data = [tab.columns, ...tab.rows.filter(r => r.some(v => String(v).trim() !== ''))];
              const ws = XLSX.utils.aoa_to_sheet(data);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, tab.name.slice(0,31) || 'Data');
              const safe = tab.name.replace(/[\\/:*?"<>|]/g,'_');
              XLSX.writeFile(wb, `${safe || 'tab'}.xlsx`);
              return;
            }

            // Không phụ thuộc CDN: xuất Excel XML .xls trực tiếp.
            downloadExcelXml(tab);
          } catch(err) {
            await notify('Xuất Excel lỗi: ' + (err?.message || err), 'error', 'Xuất Excel thất bại');
          }
        }


        function showModal({
          title='Thông báo',
          message='',
          type='info',
          confirmText='OK',
          cancelText='Hủy',
          showCancel=false,
          inputValue=null,
          danger=false
        } = {}) {
          return new Promise(resolve => {
            const iconMap = {
              info: 'i',
              success: '✓',
              warning: '!',
              error: '×',
              question: '?'
            };

            $('#modalRoot').innerHTML = `
              <div class="modal-bg">
                <div class="modal" role="dialog" aria-modal="true">
                  <div class="modal-head">
                    <div class="modal-symbol ${esc(type)}">${iconMap[type] || 'i'}</div>
                    <h3 class="modal-title">${esc(title)}</h3>
                    <button class="modal-close" data-generic-close data-tip="Đóng">×</button>
                  </div>
                  ${message ? `<div class="modal-body">${esc(message)}</div>` : ''}
                  ${inputValue !== null ? `<input id="genericModalInput" class="modal-input" type="text" value="${esc(inputValue)}">` : ''}
                  <div class="modal-actions">
                    ${showCancel ? `<button class="modal-btn" data-generic-cancel>${esc(cancelText)}</button>` : ''}
                    <button class="modal-btn ${danger ? 'danger' : 'primary'}" data-generic-ok>${esc(confirmText)}</button>
                  </div>
                </div>
              </div>
            `;

            const input = $('#genericModalInput');

            setTimeout(() => {
              if (input) {
                input.focus();
                input.select();
              } else {
                $('#modalRoot [data-generic-ok]')?.focus();
              }
            }, 0);

            const cleanup = value => {
              $('#modalRoot').innerHTML = '';
              resolve(value);
            };

            $('#modalRoot [data-generic-ok]')?.addEventListener('click', () => {
              cleanup(input ? input.value : true);
            });
            $('#modalRoot [data-generic-cancel]')?.addEventListener('click', () => cleanup(false));
            $('#modalRoot [data-generic-close]')?.addEventListener('click', () => cleanup(false));

            $('#modalRoot .modal-bg')?.addEventListener('mousedown', e => {
              if (e.target.classList.contains('modal-bg')) cleanup(false);
            });

            const keyHandler = e => {
              if (!$('#modalRoot .modal')) return;
              if (e.key === 'Escape') cleanup(false);
              if (e.key === 'Enter' && input && document.activeElement === input) cleanup(input.value);
            };
            window.addEventListener('keydown', keyHandler, { once: true });
          });
        }

        function notify(message, type='info', title='Thông báo') {
          return showModal({title, message, type, confirmText:'Đóng'});
        }

        function confirmModal(message, title='Xác nhận') {
          return showModal({
            title,
            message,
            type:'question',
            confirmText:'Xác nhận',
            cancelText:'Hủy',
            showCancel:true,
            danger:true
          });
        }

        function promptModal(message, value='', title='Nhập thông tin') {
          return showModal({
            title,
            message,
            type:'info',
            confirmText:'Lưu',
            cancelText:'Hủy',
            showCancel:true,
            inputValue:value
          });
        }

        function showAddTabModal() {
          let selectedType = 'input';
          $('#modalRoot').innerHTML = `
            <div class="modal-bg">
              <div class="modal">
                <div class="modal-head">
                  <div class="modal-symbol info">＋</div>
                  <h3 class="modal-title">Tạo tab mới</h3>
                  <button class="modal-close" data-modal-cancel data-tip="Đóng">×</button>
                </div>
                <div class="modal-body" style="padding-bottom:8px">Chọn loại tab và đặt tên cho tab mới.</div>
                <input id="newTabName" class="modal-input" type="text" value="Tab mới">
                <div class="choice">
                  <button class="choice-card selected" data-type-choice="input">
                    <b>📝 Tab nhập liệu</b>
                    Dùng để nhập dữ liệu và tra cứu từ tab tham chiếu.
                  </button>
                  <button class="choice-card" data-type-choice="reference">
                    <b>📚 Tab tham chiếu</b>
                    Dùng làm nguồn dữ liệu, có thể Import Excel.
                  </button>
                </div>
                <div class="modal-actions">
                  <button class="modal-btn" data-modal-cancel>Hủy</button>
                  <button class="modal-btn primary" data-modal-create>Tạo tab</button>
                </div>
              </div>
            </div>
          `;

          $$('#modalRoot [data-type-choice]').forEach(btn => {
            btn.addEventListener('click', () => {
              selectedType = btn.dataset.typeChoice;
              $$('#modalRoot [data-type-choice]').forEach(x => x.classList.toggle('selected', x === btn));
            });
          });

          $$('#modalRoot [data-modal-cancel]').forEach(btn => {
            btn.addEventListener('click', () => {
              $('#modalRoot').innerHTML = '';
            });
          });
          $('#modalRoot [data-modal-create]')?.addEventListener('click', () => {
            const name = $('#newTabName').value.trim() || (selectedType === 'input' ? 'Nhập liệu' : 'Tham chiếu');
            createTab(selectedType, name);
            $('#modalRoot').innerHTML = '';
          });

          $('#modalRoot .modal-bg')?.addEventListener('mousedown', e => {
            if (e.target.classList.contains('modal-bg')) {
              $('#modalRoot').innerHTML = '';
            }
          });
        }

        function createTab(type, name) {
          const id = uid();
          if (type === 'reference') {
            state.tabs.push({
              id, name, type:'reference',
              columns:['Cột 1','Cột 2','Cột 3'],
              rows:[['','','']]
            });
          } else {
            const ref = referenceTabs()[0];
            state.tabs.push({
              id, name, type:'input',
              columns:['Cột 1','Cột 2','Cột 3'],
              rows:[['','',''],['','',''],['','','']],
              lookupRules: ref ? [{
                id:uid(),
                name:'Tham chiếu 1',
                referenceTabId:ref.id,
                sourceCol:0,
                refCol:0,
                mode:'exact-normalized',
                autoLookup:true,
                outputs:[]
              }] : []
            });
          }
          state.activeTabId = id;
          saveState(); render();
        }

        async function deleteTab(id) {
          if (state.tabs.length <= 1) { await notify('Phải giữ lại ít nhất 1 tab.', 'warning'); return; }
          const tab = getTab(id);
          if (!tab) return;
          if (!(await confirmModal(`Xóa tab "${tab.name}"?`, 'Xóa tab'))) return;

          tabHistory.delete(id);
          state.tabs = state.tabs.filter(t => t.id !== id);

          if (tab.type === 'reference') {
            const fallbackRef = referenceTabs()[0];
            state.tabs.filter(t => t.type === 'input').forEach(input => {
              (input.lookupRules || []).forEach(rule => {
                if (rule.referenceTabId === id) {
                  rule.referenceTabId = fallbackRef?.id || '';
                  rule.refCol = 0;
                  rule.outputs = [];
                }
              });
            });
          }

          if (state.activeTabId === id) state.activeTabId = state.tabs[0].id;
          saveState(); render();
        }


        function duplicateActiveTab() {
          const tab = getActiveTab();
          if (!tab) return;
          pushHistory();
          const copy = clone(tab);
          copy.id = uid();
          copy.name = tab.name + ' - Bản sao';
          state.tabs.push(copy);
          state.activeTabId = copy.id;
          saveState();
          render();
        }

        async function renameActiveTab() {
          const tab = getActiveTab();
          if (!tab) return;
          const name = await promptModal('Nhập tên mới cho tab:', tab.name, 'Đổi tên tab');
          if (name === false) return;
          const v = String(name).trim();
          if (!v) return;
          tab.name = v;
          saveState(); render();
        }

        function addColumn(tab) {
          tab.columns.push(`Cột ${tab.columns.length+1}`);
          tab.rows.forEach(r => r.push(''));
          saveState(); render();
        }

        function addRow(tab) {
          tab.rows.push(Array(tab.columns.length).fill(''));
          saveState(); render();
        }

        async function clearData(tab) {
          if (!(await confirmModal(`Xóa toàn bộ dữ liệu trong tab "${tab.name}"?
      Tên cột vẫn được giữ.`, 'Xóa dữ liệu'))) return;
          tab.rows = [Array(tab.columns.length).fill('')];
          saveState(); render();
        }


        function setZoom(next) {
          state.zoom = Math.max(50, Math.min(160, next));
          saveState();
          render();
          const label = $('#zoomLabel');
          if (label) label.textContent = state.zoom + '%';
        }

        shadow.addEventListener('click', async e => {
          const closeTabBtn = e.target.closest('[data-close-tab]');
          if (closeTabBtn) {
            e.stopPropagation();
            await deleteTab(closeTabBtn.dataset.closeTab);
            return;
          }

          const tabEl = e.target.closest('[data-tab-id]');
          if (tabEl) {
            state.activeTabId = tabEl.dataset.tabId;
            saveState(); render();
            return;
          }

          const colorOption = e.target.closest('[data-table-color]');
          if (colorOption) {
            const activeTab = getActiveTab();
            if (activeTab) {
              activeTab.tableTheme = colorOption.dataset.tableColor || 'blue';
              saveState();
              render();
            }
            return;
          }

          const act = e.target.closest('[data-act]')?.dataset.act;
          if (!act) return;

          const tab = getActiveTab();

          if (act === 'close') host.remove();
          if (act === 'minimize') {
            $('.wrap')?.classList.add('minimized');
            return;
          }
          if (act === 'restore-mini') {
            $('.wrap')?.classList.remove('minimized');
            return;
          }
          if (act === 'undo') { undoAction(); return; }
          if (act === 'redo') { redoAction(); return; }
          if (act === 'toggle-search') {
            state.searchOpen = !state.searchOpen;
            saveState(); render();
            if (state.searchOpen) setTimeout(() => $('#searchInput')?.focus(), 0);
            return;
          }
          if (act === 'toggle-tab-menu') {
            const menu = $('#tabMenu');
            if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            return;
          }
          if (act === 'toggle-settings') {
            state.settingsOpen = !state.settingsOpen;
            saveState(); render();
          }
          if (act === 'zoom-out') setZoom(state.zoom - 10);
          if (act === 'zoom-reset') setZoom(100);
          if (act === 'zoom-in') setZoom(state.zoom + 10);
          if (act === 'save') { saveState(); await notify('Đã lưu dữ liệu.', 'success', 'Đã lưu'); }
          if (act === 'reset') {
            if (await confirmModal('Reset toàn bộ tool về mặc định?', 'Reset tool')) {
              state = clone(defaultState);
              saveState(); render();
            }
          }
          if (act === 'rename-tab') await renameActiveTab();
          if (act === 'duplicate-tab') duplicateActiveTab();
          if (act === 'delete-active-tab') await deleteTab(tab.id);
          if (act === 'add-tab') showAddTabModal();
          if (act === 'add-row') addRow(tab);
          if (act === 'add-col') addColumn(tab);
          if (act === 'toggle-table-color') {
            const menu = $('#tableColorMenu');
            if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            return;
          }
          if (act === 'clear') await clearData(tab);
          if (act === 'import-xlsx' && tab.type === 'reference') $('#xlsxInput')?.click();
          if (act === 'export-xlsx') exportTab(tab);

          if (act === 'add-rule' && tab.type === 'input') {
            const ref = referenceTabs()[0];
            if (!ref) { await notify('Chưa có tab tham chiếu.', 'warning'); return; }

            pushHistory();
            const n = (tab.lookupRules?.length || 0) + 1;
            tab.lookupRules = tab.lookupRules || [];
            tab.lookupRules.push({
              id:uid(),
              name:`Tham chiếu ${n}`,
              referenceTabId:ref.id,
              sourceCol:0,
              refCol:0,
              mode:'exact-normalized',
              autoLookup:true,
              outputs:[]
            });

            saveState();
            render();
          }

          if (act === 'remove-rule' && tab.type === 'input') {
            const ruleId = e.target.closest('[data-rule-id]')?.dataset.ruleId;
            const rule = (tab.lookupRules || []).find(r => r.id === ruleId);
            if (!rule) return;

            if (!(await confirmModal(`Xóa quy tắc "${rule.name || 'Tham chiếu'}"?`, 'Xóa tham chiếu'))) return;

            pushHistory();
            tab.lookupRules = tab.lookupRules.filter(r => r.id !== ruleId);
            saveState();
            render();
          }

          if (act === 'add-output' && tab.type === 'input') {
            const ruleId = e.target.closest('[data-rule-id]')?.dataset.ruleId;
            const rule = (tab.lookupRules || []).find(r => r.id === ruleId);
            if (!rule) return;

            const ref = getTab(rule.referenceTabId);
            if (!ref) { await notify('Chưa có tab tham chiếu.', 'warning'); return; }

            pushHistory();
            rule.outputs.push({fromCol:0,toCol:0});
            saveState();
            render();
          }
        });


        shadow.addEventListener('mousedown', e => {
          if (!e.target.closest('.table-color-wrap')) {
            const menu = $('#tableColorMenu');
            if (menu) menu.style.display = 'none';
          }
        });

        shadow.addEventListener('dblclick', async e => {
          const tabEl = e.target.closest('[data-tab-id]');
          if (!tabEl || e.target.closest('[data-close-tab]')) return;
          state.activeTabId = tabEl.dataset.tabId;
          saveState();
          await renameActiveTab();
        });



        // Tooltip tùy chỉnh
        let tooltipTimer = null;

        function hideTooltip() {
          clearTimeout(tooltipTimer);
          const root = $('#tooltipRoot');
          if (root) root.innerHTML = '';
        }

        function showTooltip(target) {
          const text = target?.dataset?.tip;
          if (!text || target.disabled) return;

          const shortcut = target.dataset.shortcut || '';
          const root = $('#tooltipRoot');
          if (!root) return;

          root.innerHTML = `
            <div class="app-tooltip">
              <span class="app-tooltip-title">${esc(text)}</span>
              ${shortcut ? `<span class="app-tooltip-shortcut">${esc(shortcut)}</span>` : ''}
            </div>
          `;

          const tip = root.querySelector('.app-tooltip');
          const rect = target.getBoundingClientRect();

          // Measure after insertion.
          const tw = tip.offsetWidth;
          const th = tip.offsetHeight;
          const gap = 8;

          let left = rect.left + rect.width / 2 - tw / 2;
          left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));

          let top = rect.top - th - gap;
          let bottomMode = false;

          if (top < 8) {
            top = rect.bottom + gap;
            bottomMode = true;
          }

          tip.style.left = `${left}px`;
          tip.style.top = `${top}px`;
          tip.classList.toggle('bottom', bottomMode);

          requestAnimationFrame(() => tip.classList.add('show'));
        }

        shadow.addEventListener('mouseover', e => {
          const target = e.target.closest('[data-tip]');
          if (!target) return;
          clearTimeout(tooltipTimer);
          tooltipTimer = setTimeout(() => showTooltip(target), 320);
        });

        shadow.addEventListener('mouseout', e => {
          const target = e.target.closest('[data-tip]');
          if (!target) return;
          hideTooltip();
        });

        shadow.addEventListener('mousedown', hideTooltip);
        shadow.addEventListener('wheel', hideTooltip, {passive:true});

        shadow.addEventListener('keydown', e => {
          const ctrl = e.ctrlKey || e.metaKey;
          if (!ctrl) return;

          const key = e.key.toLowerCase();

          if (key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undoAction();
            return;
          }

          if (key === 'y' || (key === 'z' && e.shiftKey)) {
            e.preventDefault();
            redoAction();
          }
        });

        // Kéo cửa sổ
        (() => {
          const box = $('.wrap');
          const bar = $('.topbar');
          let dragging=false, ox=0, oy=0;

          bar.addEventListener('mousedown', e => {
            if (e.target.closest('button,input,select')) return;
            dragging = true;
            const rect = box.getBoundingClientRect();
            ox = e.clientX - rect.left;
            oy = e.clientY - rect.top;
            e.preventDefault();
          });

          window.addEventListener('mousemove', e => {
            if (!dragging) return;
            const maxX = window.innerWidth - 80;
            const maxY = window.innerHeight - 50;
            box.style.left = Math.max(-box.offsetWidth + 80, Math.min(maxX, e.clientX - ox)) + 'px';
            box.style.top = Math.max(0, Math.min(maxY, e.clientY - oy)) + 'px';
          });

          window.addEventListener('mouseup', () => dragging=false);
        })();


        // Kéo góc phải dưới để thay đổi kích thước cửa sổ chính
        (() => {
          const box = $('.wrap');
          const handle = $('.resize-handle');
          if (!box || !handle) return;

          let resizing = false;
          let startX = 0, startY = 0, startW = 0, startH = 0;

          handle.addEventListener('mousedown', e => {
            resizing = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = box.getBoundingClientRect();
            startW = rect.width;
            startH = rect.height;
            e.preventDefault();
            e.stopPropagation();
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'nwse-resize';
          });

          window.addEventListener('mousemove', e => {
            if (!resizing) return;

            const minW = 520;
            const minH = 360;
            const maxW = Math.max(minW, window.innerWidth - box.getBoundingClientRect().left - 8);
            const maxH = Math.max(minH, window.innerHeight - box.getBoundingClientRect().top - 8);

            const newW = Math.max(minW, Math.min(maxW, startW + (e.clientX - startX)));
            const newH = Math.max(minH, Math.min(maxH, startH + (e.clientY - startY)));

            box.style.width = newW + 'px';
            box.style.height = newH + 'px';
          });

          window.addEventListener('mouseup', () => {
            if (!resizing) return;
            resizing = false;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
          });
        })();

        render();
      })();

    },
    stop() {
      document.querySelector('#mini-multi-tab-excel-tool')?.remove();
    }
  });
})();

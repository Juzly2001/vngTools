(() => {
  'use strict';

  // Compatible with both GHTKTools dashboard and standalone execution.
  const miniExcelTool = {
    name: "Mini GHTK Excel",
    description: "Bảng nhập liệu và tham chiếu nhiều tab (Giao diện thiết kế mới)",
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
              position:fixed;z-index:2147483646;top:24px;left:24px;
              width:min(1240px,calc(100vw - 48px));height:min(800px,calc(100vh - 48px));
              background:#ffffff;color:#0f172a;border:1px solid #e2e8f0;border-radius:16px;
              box-shadow:0 25px 50px -12px rgba(15,23,42,0.25), 0 0 0 1px rgba(15,23,42,0.05);
              font:13px/1.5 Inter, system-ui, -apple-system, sans-serif;
              display:flex;flex-direction:column;overflow:hidden;
              min-width:560px;min-height:380px;backdrop-filter: blur(8px);
            }
            .topbar{
              display:flex;align-items:center;gap:8px;padding:10px 16px;
              background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              color:#fff;cursor:move;user-select:none;border-bottom:1px solid rgba(255,255,255,0.1);
            }
            .wrap.minimized{
              width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;
              top:auto!important;left:auto!important;right:20px!important;bottom:20px!important;
              border-radius:14px;overflow:visible
            }
            .wrap.minimized .topbar{
              border-radius:14px;padding:10px 14px;cursor:pointer
            }
            .wrap.minimized .topbar > *{display:none!important}
            .wrap.minimized .topbar .mini-restore{
              display:inline-flex!important;align-items:center;gap:8px;
              border:0;border-radius:10px;background:#2563eb;color:#fff;
              padding:8px 14px;cursor:pointer;font-weight:600;font-size:13px;
              box-shadow:0 4px 12px rgba(37,99,235,0.3)
            }
            .wrap.minimized .tabsbar,
            .wrap.minimized .body,
            .wrap.minimized .resize-handle{display:none!important}
            .mini-restore{display:none}

            .title{font-weight:700;flex:1;font-size:14px;letter-spacing:-0.01em;display:flex;align-items:center;gap:8px}
            .title::before{content:"";display:inline-block;width:8px;height:8px;background:#38bdf8;border-radius:50%;box-shadow:0 0 8px #38bdf8}
            
            button{font:inherit}
            .btn{border:1px solid #cbd5e1;border-radius:8px;background:#fff;padding:6px 12px;cursor:pointer;font-weight:500;transition:all 0.15s ease}
            .btn:hover{background:#f8fafc;border-color:#94a3b8}
            .btn.primary{background:#2563eb;color:#fff;border-color:#2563eb}
            .btn.primary:hover{background:#1d4ed8}
            .btn.danger{background:#fff1f2;color:#e11d48;border-color:#fecdd3}
            .btn.danger:hover{background:#ffe4e6}
            
            .topbtn{border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:6px 10px;cursor:pointer;background:rgba(255,255,255,0.08);color:#f8fafc;font-size:12px;font-weight:500;transition:all 0.15s ease}
            .topbtn:hover{background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.3)}
            .topbtn.close{background:rgba(239,68,68,0.2);border-color:rgba(239,68,68,0.4);color:#fca5a5}
            .topbtn.close:hover{background:rgba(239,68,68,0.4);color:#fff}

            .tabsbar{
              display:flex;align-items:end;gap:4px;padding:8px 12px 0;background:#f8fafc;
              border-bottom:1px solid #e2e8f0;overflow-x:auto;overflow-y:hidden;
            }
            .tabsbar::-webkit-scrollbar{height:4px}
            .tabsbar::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}

            .tab{
              display:flex;align-items:center;gap:8px;border:1px solid #cbd5e1;border-bottom:0;
              background:#f1f5f9;padding:8px 12px;border-radius:10px 10px 0 0;cursor:pointer;
              white-space:nowrap;max-width:220px;font-size:12px;color:#475569;transition:all 0.15s ease;
            }
            .tab:hover{background:#e2e8f0;color:#1e293b}
            .tab.active{background:#ffffff;color:#0f172a;font-weight:600;border-color:#cbd5e1;border-bottom:2px solid #ffffff;margin-bottom:-1px;box-shadow:0 -2px 6px rgba(0,0,0,0.02)}
            .type-dot{width:7px;height:7px;border-radius:50%;display:inline-block}
            .type-input{background:#2563eb;box-shadow:0 0 6px rgba(37,99,235,0.4)}
            .type-reference{background:#10b981;box-shadow:0 0 6px rgba(16,185,129,0.4)}
            .tabname{max-width:140px;overflow:hidden;text-overflow:ellipsis}
            .tabclose{border:0;background:transparent;color:#94a3b8;cursor:pointer;padding:2px;border-radius:4px;font-size:14px;display:flex;align-items:center;justify-content:center}
            .tabclose:hover{background:#fee2e2;color:#dc2626}
            
            .addtab{border:1px dashed #94a3b8;border-bottom:0;background:transparent;padding:8px 14px;border-radius:10px 10px 0 0;cursor:pointer;font-weight:600;color:#64748b;font-size:12px;transition:all 0.15s ease}
            .addtab:hover{background:#f1f5f9;color:#0f172a;border-color:#64748b}

            .body{flex:1;min-height:0;display:flex;flex-direction:column;background:#ffffff}
            .settings-panel{display:none}
            .settings-panel.open{
              display:block;max-height:48%;overflow-y:auto;overflow-x:hidden;
              flex:0 1 auto;scrollbar-gutter:stable;padding:0;background:#f8fafc;
              border-bottom:1px solid #e2e8f0;
            }

            .searchbar{
              display:none;align-items:center;gap:10px;padding:10px 16px;
              border-bottom:1px solid #e2e8f0;background:#f8fafc
            }
            .searchbar.open{display:flex}
            .search-input-wrap{position:relative;flex:1;min-width:180px}
            .searchbox{
              width:100%;border:1px solid #cbd5e1;border-radius:8px;
              padding:7px 34px 7px 12px;background:#fff;outline:none;font-size:12px;
              transition:all 0.15s ease;
            }
            .searchbox:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.12)}
            .search-clear{
              display:none;position:absolute;right:8px;top:50%;transform:translateY(-50%);
              width:20px;height:20px;border:0;border-radius:50%;background:transparent;
              color:#94a3b8;cursor:pointer;font-size:16px;line-height:18px;padding:0;
              display:flex;align-items:center;justify-content:center;
            }
            .search-clear.show{display:flex}
            .search-clear:hover{background:#e2e8f0;color:#475569}
            .search-count{font-size:12px;font-weight:500;color:#64748b;white-space:nowrap;background:#e2e8f0;padding:3px 8px;border-radius:6px}
            td.cell.search-hit{background:#fef08a!important}

            .tab-info{
              display:flex;align-items:center;gap:12px;
              padding:12px 16px;border-bottom:1px solid #e2e8f0;background:#fff;
            }
            .tab-info-main{min-width:0;flex:1}
            .tab-info-title{font-size:15px;font-weight:700;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.01em}
            .tab-info-sub{font-size:11px;color:#64748b;margin-top:2px;font-weight:500}
            
            .more-wrap{position:relative}
            .more-btn{
              width:34px;height:34px;border:1px solid #cbd5e1;border-radius:8px;
              background:#fff;cursor:pointer;font-size:16px;color:#475569;
              display:flex;align-items:center;justify-content:center;transition:all 0.15s ease;
            }
            .more-btn:hover{background:#f1f5f9;border-color:#94a3b8}
            
            .tab-menu{
              position:absolute;right:0;top:42px;z-index:30;width:180px;
              background:#fff;border:1px solid #e2e8f0;border-radius:12px;
              box-shadow:0 10px 25px -5px rgba(15,23,42,0.1), 0 8px 10px -6px rgba(15,23,42,0.1);
              padding:6px
            }
            .tab-menu button{
              display:block;width:100%;border:0;background:#fff;text-align:left;
              border-radius:8px;padding:8px 10px;cursor:pointer;color:#334155;font-weight:500;font-size:12px;
              transition:background 0.1s ease;
            }
            .tab-menu button:hover{background:#f1f5f9;color:#0f172a}
            .tab-menu button.menu-danger{color:#e11d48}
            .tab-menu button.menu-danger:hover{background:#fff1f2}

            .toolbar{display:flex;flex-wrap:wrap;gap:8px;padding:10px 16px;border-bottom:1px solid #e2e8f0;background:#f8fafc;align-items:center}
            .table-color-wrap{position:relative}
            .table-color-menu{
              position:absolute;top:calc(100% + 6px);left:0;z-index:55;
              width:200px;padding:10px;background:#fff;border:1px solid #cbd5e1;
              border-radius:12px;box-shadow:0 10px 25px -5px rgba(15,23,42,0.15)
            }
            .table-color-title{font-size:11px;font-weight:700;color:#64748b;margin:0 0 8px;letter-spacing:0.03em}
            .table-color-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
            .table-color-option{
              height:32px;border:1px solid #cbd5e1;border-radius:8px;cursor:pointer;
              position:relative;padding:0;background:var(--swatch);transition:transform 0.15s ease;
            }
            .table-color-option:hover{transform:scale(1.05);box-shadow:0 4px 12px rgba(15,23,42,0.15)}
            .table-color-option.active:after{
              content:"✓";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
              color:#fff;font-weight:800;font-size:14px;text-shadow:0 1px 2px rgba(0,0,0,0.4)
            }

            select,input[type=text]{font:inherit;border:1px solid #cbd5e1;border-radius:8px;padding:6px 10px;background:#fff;min-width:0;outline:none;transition:all 0.15s ease}
            select:focus,input[type=text]:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.12)}
            
            .rules-head{
              display:flex;align-items:center;justify-content:space-between;gap:12px;
              margin:0;padding:12px 16px;position:relative;top:auto;flex:0 0 auto;
              background:#fff;border-bottom:1px solid #e2e8f0;
            }
            #lookupRules{overflow-y:auto;min-height:0;padding:12px 16px 6px}
            .rules-title{font-size:13px;font-weight:700;color:#0f172a}
            
            .rule-card{
              border:1px solid #cbd5e1;border-radius:12px;background:#fff;
              padding:0;margin-bottom:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.02);
              transition:all 0.15s ease;
            }
            .rule-card-head{
              display:flex;align-items:center;gap:8px;margin:0;padding:10px 12px;
              border-bottom:1px solid #f1f5f9;background:#f8fafc;cursor:default
            }
            .rule-no{
              display:flex;align-items:center;justify-content:center;
              min-width:24px;height:24px;padding:0;border-radius:6px;
              background:#eff6ff;color:#2563eb;font-weight:700;font-size:11px
            }
            .rule-name{
              flex:1;min-width:0;border:0;background:transparent;
              font-weight:700;color:#0f172a;padding:4px 6px;outline:none;font-size:13px;
              border-radius:6px;transition:background 0.15s ease;
            }
            .rule-name:focus{background:#fff;box-shadow:0 0 0 2px #2563eb}
            .rule-remove{
              border:0;background:transparent;color:#94a3b8;cursor:pointer;
              width:26px;height:26px;border-radius:6px;font-size:16px;
              display:flex;align-items:center;justify-content:center;transition:all 0.15s ease;
            }
            .rule-remove:hover{background:#fee2e2;color:#dc2626}
            
            .rule-card .rule-grid{
              margin:0;padding:12px;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px
            }
            .rule-grid label{
              display:flex;flex-direction:column;gap:4px;font-size:11px;font-weight:600;color:#64748b
            }
            .rule-grid label select{width:100%;color:#1f2937;font-size:12px}
            
            .returns{margin:0;padding:0 12px 10px}
            .returns-title{font-size:11px;font-weight:700;color:#64748b;margin-bottom:6px;letter-spacing:0.02em}
            .return-row{display:grid;grid-template-columns:minmax(110px,1fr) 24px minmax(110px,1fr) 32px;gap:8px;align-items:center}
            .arrow{text-align:center;color:#94a3b8;font-weight:600}
            .return-row select{width:100%;font-size:12px;padding:5px 8px}
            
            .rule-actions{
              display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0;padding:0 12px 12px
            }
            .rule-ref-name{
              font-size:11px;color:#2563eb;background:#eff6ff;
              padding:3px 8px;border-radius:999px;font-weight:500;border:1px solid #bfdbfe
            }

            .gridwrap{flex:1;min-height:0;overflow:auto;background:#fff}
            .zoom-stage{transform-origin:top left;display:inline-block;min-width:100%}
            table{border-collapse:separate;border-spacing:0;min-width:100%;table-layout:fixed}
            th,td{border-right:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;height:32px;min-width:130px}
            th{position:sticky;top:0;z-index:2;background:#4472c4;color:#fff;font-weight:600;padding:0;font-size:12px}
            th.index,td.index{position:sticky;left:0;z-index:3;min-width:48px;width:48px;text-align:center;background:#f8fafc;color:#64748b;font-weight:500;font-size:12px}
            th.index{z-index:4;background:#1e293b;color:#fff}
            .headcell{display:flex;align-items:center;height:100%}
            .headname{flex:1;padding:6px 10px;outline:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
            .col-del{width:26px;border:0;background:transparent;color:rgba(255,255,255,0.7);cursor:pointer;font-size:14px;border-radius:4px;transition:all 0.1s ease}
            .col-del:hover{background:rgba(255,255,255,0.2);color:#fff}
            
            td.cell{padding:6px 10px;outline:none;vertical-align:middle;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#fff;font-size:13px;color:#1e293b}
            tr:nth-child(even) td.cell{background:#f8fafc}
            td.cell:focus{outline:2px solid #2563eb;outline-offset:-2px;background:#fff;box-shadow:inset 0 0 0 1px #2563eb}

            /* Màu bảng - đổi bằng nút 🎨 */
            .gridwrap[data-table-theme="blue"] th{background:#2563eb}
            .gridwrap[data-table-theme="blue"] th.index{background:#0f172a}
            .gridwrap[data-table-theme="blue"] tr:nth-child(even) td.cell{background:#f8fafc}

            .gridwrap[data-table-theme="green"] th{background:#16a34a}
            .gridwrap[data-table-theme="green"] th.index{background:#14532d}
            .gridwrap[data-table-theme="green"] tr:nth-child(even) td.cell{background:#f0fdf4}

            .gridwrap[data-table-theme="orange"] th{background:#ea580c}
            .gridwrap[data-table-theme="orange"] th.index{background:#7c2d12}
            .gridwrap[data-table-theme="orange"] tr:nth-child(even) td.cell{background:#fff7ed}

            .gridwrap[data-table-theme="purple"] th{background:#9333ea}
            .gridwrap[data-table-theme="purple"] th.index{background:#581c87}
            .gridwrap[data-table-theme="purple"] tr:nth-child(even) td.cell{background:#faf5ff}

            .gridwrap[data-table-theme="gray"] th{background:#475569}
            .gridwrap[data-table-theme="gray"] th.index{background:#1e293b}
            .gridwrap[data-table-theme="gray"] tr:nth-child(even) td.cell{background:#f1f5f9}

            .gridwrap[data-table-theme="teal"] th{background:#0d9488}
            .gridwrap[data-table-theme="teal"] th.index{background:#134e4a}
            .gridwrap[data-table-theme="teal"] tr:nth-child(even) td.cell{background:#f0fdfa}

            .row-del{border:0;background:transparent;color:#94a3b8;cursor:pointer;font-weight:700;border-radius:4px;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center}
            .row-del:hover{background:#fee2e2;color:#dc2626}
            
            .status{padding:10px 16px;border-top:1px solid #e2e8f0;background:#f8fafc;color:#64748b;display:flex;gap:12px;align-items:center;font-size:12px;font-weight:500}
            .pill{display:inline-block;padding:3px 10px;border-radius:999px;background:#e2e8f0;color:#334155;font-weight:600}
            
            .modal-bg{
              position:absolute;inset:0;z-index:80;
              display:flex;align-items:center;justify-content:center;
              padding:20px;background:rgba(15,23,42,0.35);
              backdrop-filter:blur(4px);
            }
            .modal{
              width:min(440px,calc(100% - 24px));
              background:#fff;border:1px solid #cbd5e1;border-radius:16px;
              box-shadow:0 25px 50px -12px rgba(15,23,42,0.25);
              overflow:hidden;animation:modalIn .2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes modalIn{
              from{opacity:0;transform:translateY(8px) scale(0.97)}
              to{opacity:1;transform:translateY(0) scale(1)}
            }
            .modal-head{display:flex;align-items:center;gap:12px;padding:18px 20px 12px}
            .modal-symbol{
              width:32px;height:32px;flex:0 0 32px;display:flex;align-items:center;justify-content:center;
              border-radius:10px;font-size:15px;font-weight:800;
            }
            .modal-symbol.info{background:#eff6ff;color:#2563eb}
            .modal-symbol.success{background:#ecfdf5;color:#16a34a}
            .modal-symbol.warning{background:#fff7ed;color:#ea580c}
            .modal-symbol.error{background:#fff1f2;color:#e11d48}
            .modal-symbol.question{background:#f8fafc;color:#475569}
            .modal-title{margin:0;font-size:16px;line-height:1.3;color:#0f172a;font-weight:700}
            .modal-body{padding:0 20px 16px 64px;color:#475569;font-size:13px;line-height:1.6;white-space:pre-wrap}
            .modal-input{
              display:block;width:calc(100% - 40px);margin:0 20px 16px;
              border:1px solid #cbd5e1;border-radius:10px;padding:10px 12px;
              outline:none;background:#fff;color:#0f172a;font-size:13px;
              transition:all 0.15s ease;
            }
            .modal-input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.12)}
            .modal-actions{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px 18px;border-top:1px solid #f1f5f9;background:#f8fafc}
            .modal-btn{
              border:1px solid #cbd5e1;border-radius:8px;padding:8px 16px;min-width:80px;
              background:#fff;color:#334155;cursor:pointer;font-weight:600;font-size:13px;
              transition:all 0.15s ease;
            }
            .modal-btn:hover{background:#f1f5f9;border-color:#94a3b8}
            .modal-btn.primary{background:#2563eb;border-color:#2563eb;color:#fff}
            .modal-btn.primary:hover{background:#1d4ed8}
            .modal-btn.danger{background:#e11d48;border-color:#e11d48;color:#fff}
            .modal-btn.danger:hover{background:#be123c}
            .modal-close{
              margin-left:auto;width:30px;height:30px;border:0;border-radius:8px;
              background:transparent;color:#94a3b8;cursor:pointer;font-size:18px;
              display:flex;align-items:center;justify-content:center;transition:all 0.1s ease;
            }
            .modal-close:hover{background:#f1f5f9;color:#0f172a}
            
            .choice{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 20px}
            .choice-card{border:1px solid #cbd5e1;border-radius:12px;padding:14px;cursor:pointer;background:#fff;text-align:left;transition:all 0.15s ease}
            .choice-card.selected{border-color:#2563eb;background:#eff6ff;box-shadow:0 0 0 2px #2563eb}
            .choice-card b{display:block;margin-bottom:4px;color:#0f172a;font-size:13px}
            
            .resize-handle{position:absolute;right:0;bottom:0;width:24px;height:24px;cursor:nwse-resize;z-index:60}
            .resize-handle:before{
              content:"";position:absolute;right:6px;bottom:6px;width:10px;height:10px;
              border-right:2px solid #94a3b8;border-bottom:2px solid #94a3b8;
            }

            .app-tooltip{
              position:fixed;z-index:2147483647;max-width:260px;padding:8px 12px;
              border-radius:10px;background:#0f172a;color:#f8fafc;
              box-shadow:0 10px 25px -5px rgba(15,23,42,0.3);
              font-size:12px;line-height:1.4;font-weight:500;
              pointer-events:none;opacity:0;transform:translateY(4px) scale(0.98);
              transition:opacity .15s ease,transform .15s ease;
            }
            .app-tooltip.show{opacity:1;transform:translateY(0) scale(1)}
            .app-tooltip-title{font-weight:700;color:#fff;margin-bottom:2px}
            .app-tooltip-shortcut{
              display:inline-block;margin-left:6px;padding:1px 5px;
              border:1px solid rgba(255,255,255,0.2);border-radius:4px;
              color:#cbd5e1;font-size:10px;font-family:monospace
            }

            .tab-history-actions{display:inline-flex;align-items:center;gap:4px;margin-left:auto;margin-right:6px}
            .tab-history-btn{width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#475569;font-size:16px;cursor:pointer;transition:all 0.15s ease}
            .tab-history-btn:hover:not(:disabled){background:#f1f5f9;border-color:#94a3b8;color:#0f172a}
            .tab-history-btn:disabled{opacity:0.35;cursor:not-allowed;background:#f8fafc}

            .tab-actions{display:flex;align-items:center;gap:6px}
            .tab-action{
              height:32px;display:inline-flex;align-items:center;justify-content:center;gap:6px;
              border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#334155;
              padding:0 12px;cursor:pointer;font-weight:600;font-size:12px;white-space:nowrap;transition:all 0.15s ease;
            }
            .tab-action:hover{background:#f8fafc;border-color:#94a3b8;color:#0f172a}
            .tab-action.primary{background:#eff6ff;border-color:#bfdbfe;color:#2563eb}
            .tab-action.primary:hover{background:#dbeafe}
            .tab-action.icon{width:32px;padding:0;font-size:16px}
            .tab-action:disabled{opacity:0.4;cursor:not-allowed;background:#f8fafc}
            
            .toolbar-note{margin-left:auto;font-size:11px;color:#94a3b8;font-weight:500}

            .rule-card.collapsed .rule-card-body{display:none}
            .rule-collapse{
              width:26px;height:26px;border:0;border-radius:6px;background:transparent;
              color:#64748b;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;transition:background 0.1s ease
            }
            .rule-collapse:hover{background:#e2e8f0;color:#0f172a}
            .rule-summary{min-width:0;flex:1;display:flex;align-items:center;gap:8px;overflow:hidden}
            .rule-summary-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:#64748b;font-weight:500}
            .rule-card:not(.collapsed) .rule-summary-text{display:none}
            .rule-card-body{background:#fff;padding:4px 0 0}

            .sheet-context-menu{
              position:fixed;z-index:2147483647;width:210px;padding:6px;
              background:#fff;border:1px solid #cbd5e1;border-radius:12px;
              box-shadow:0 15px 35px -5px rgba(15,23,42,0.18)
            }
            .sheet-context-menu button{
              width:100%;display:flex;align-items:center;justify-content:space-between;
              gap:12px;border:0;border-radius:8px;background:#fff;color:#334155;
              padding:8px 10px;text-align:left;cursor:pointer;font-size:12px;font-weight:500;
              transition:background 0.1s ease;
            }
            .sheet-context-menu button:hover{background:#f1f5f9;color:#0f172a}
            .sheet-context-menu button.danger{color:#e11d48}
            .sheet-context-menu button.danger:hover{background:#fff1f2}
            .sheet-context-menu .ctx-sep{height:1px;background:#e2e8f0;margin:4px 4px}
            .sheet-context-menu kbd{font:10px monospace;color:#94a3b8;background:#f1f5f9;padding:2px 5px;border-radius:4px}

            th[data-col-select],td.index[data-row-select]{cursor:pointer;user-select:none}
            th[data-col-select]:hover,td.index[data-row-select]:hover{filter:brightness(0.92)}
            th.col-selected{background:#1d4ed8!important}
            td.index.row-selected{background:#eff6ff!important;color:#2563eb;font-weight:700}

            td.cell{user-select:none}
            td.cell.range-selected{background:#eff6ff!important;box-shadow:inset 0 0 0 1px rgba(37,99,235,0.2)}
            td.cell.range-anchor{outline:2px solid #2563eb!important;outline-offset:-2px}
            td.cell.range-top{border-top:2px solid #2563eb!important}
            td.cell.range-bottom{border-bottom:2px solid #2563eb!important}
            td.cell.range-left{border-left:2px solid #2563eb!important}
            td.cell.range-right{border-right:2px solid #2563eb!important}
            td.cell.fill-handle-cell{position:relative;overflow:visible!important}
            td.cell.fill-handle-cell::after{
              content:"";position:absolute;width:8px;height:8px;right:-5px;bottom:-5px;
              background:#2563eb;border:1px solid #fff;box-shadow:0 0 0 1px #2563eb;
              cursor:crosshair;z-index:12;pointer-events:auto
            }
            td.cell.fill-preview{background:#dbeafe!important}
            th.index.select-all-corner{cursor:pointer}
            th.index.select-all-corner:hover{background:#0f172a}
          </style>

          <div class="wrap">
            <div class="topbar">
              <div class="title">Mini Excel - Multi Tab</div>
              <button class="mini-restore" data-act="restore-mini" data-tip="Mở lại bảng">▦ Mini Excel</button>
              <button class="topbtn" data-act="toggle-search" data-tip="Tìm kiếm dữ liệu trong tab hiện tại" data-shortcut="Search">⌕ Tìm kiếm</button>
              <button class="topbtn" data-act="zoom-out" data-tip="Thu nhỏ nội dung bảng">−</button>
              <button class="topbtn" data-act="zoom-reset" data-tip="Đưa tỷ lệ hiển thị về 100%"><span id="zoomLabel">100%</span></button>
              <button class="topbtn" data-act="zoom-in" data-tip="Phóng to nội dung bảng">＋</button>
              <button class="topbtn" data-act="save">Lưu</button>
              <button class="topbtn" data-act="reset">Reset</button>
              <button class="topbtn" data-act="minimize" data-tip="Thu gọn Mini Excel xuống góc phải">▣ Thu gọn</button>
              <button class="topbtn close" data-act="close">✕ Đóng</button>
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
          `).join('') + `<button class="addtab" data-act="add-tab">＋ Tab mới</button>`;
        }

        function render() {
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
                  id="searchClear" type="button" data-tip="Xóa tìm kiếm">×</button>
              </div>
              <select id="searchColumn">${colOptions}</select>
              <span class="search-count" id="searchCount"></span>
            </div>
          `;
        }

        function tableColorButtonHTML() {
          const current = getActiveTab()?.tableTheme || 'blue';
          const colors = [
            ['blue','#2563eb','Xanh dương'],
            ['green','#16a34a','Xanh lá'],
            ['orange','#ea580c','Cam'],
            ['purple','#9333ea','Tím'],
            ['teal','#0d9488','Teal'],
            ['gray','#475569','Xám']
          ];
          return `
            <div class="table-color-wrap">
              <button class="btn" data-act="toggle-table-color" data-tip="Chọn màu bảng">🎨 Màu bảng</button>
              <div class="table-color-menu" id="tableColorMenu" style="display:none">
                <div class="table-color-title">CHỌN MÀU BẢNG HIỂN THỊ</div>
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
                <div class="tab-info-sub">Tab nhập liệu dữ liệu</div>
              </div>
              <div class="tab-actions">
                <button class="tab-action primary" data-act="toggle-settings" data-tip="Thiết lập tham chiếu">${state.settingsOpen ? 'Ẩn cài đặt' : '⚙ Cài đặt tra cứu'}</button>
                <button class="tab-action" data-act="export-xlsx" data-tip="Xuất tab này ra Excel">⇩ Xuất Excel</button>
                <button class="tab-action icon" data-act="undo" data-tip="Hoàn tác" data-shortcut="Ctrl + Z" disabled>↶</button>
                <button class="tab-action icon" data-act="redo" data-tip="Làm lại" data-shortcut="Ctrl + Y" disabled>↷</button>
              </div>
              <div class="more-wrap">
                <button class="more-btn" data-act="toggle-tab-menu" data-tip="Tùy chọn tab">⋮</button>
                <div class="tab-menu" id="tabMenu" style="display:none">
                  <button data-act="rename-tab">✏ Đổi tên tab</button>
                  <button data-act="duplicate-tab">▣ Nhân bản tab</button>
                  <button class="menu-danger" data-act="delete-active-tab">🗑 Xóa tab này</button>
                </div>
              </div>
            </div>

            <div class="panel settings-panel ${state.settingsOpen ? 'open' : ''}">
              ${refs.length ? `
                <div class="rules-head">
                  <div>
                    <div class="rules-title">Quy tắc tham chiếu tự động</div>
                    <div style="font-size:11px;color:#64748b;margin-top:2px">Thiết lập nguồn tham chiếu và tự động điền dữ liệu khi thay đổi.</div>
                  </div>
                  <button class="btn primary" data-act="add-rule">+ Thêm quy tắc</button>
                </div>

                <div id="lookupRules">
                  ${tab.lookupRules.map((rule, ruleIndex) => {
                    const ref = getTab(rule.referenceTabId);
                    return `
                      <div class="rule-card ${rule.collapsed ? 'collapsed' : ''}" data-rule-id="${esc(rule.id)}">
                        <div class="rule-card-head">
                          <button class="rule-collapse" type="button" data-rule-collapse="${esc(rule.id)}"
                            data-tip="Thu gọn / mở rộng">${rule.collapsed ? '▶' : '▼'}</button>
                          <span class="rule-no">${ruleIndex + 1}</span>
                          <div class="rule-summary">
                            <input class="rule-name" type="text"
                              value="${esc(rule.name || `Tham chiếu ${ruleIndex + 1}`)}"
                              data-tip="Click để đổi tên quy tắc">
                            <span class="rule-summary-text">${esc(tab.columns[rule.sourceCol] || `Cột ${rule.sourceCol+1}`)} → ${esc(ref?.columns?.[rule.refCol] || `Cột ${rule.refCol+1}`)} · ${(rule.outputs || []).length} kết quả</span>
                          </div>
                          <span class="rule-ref-name">${esc(ref?.name || 'Chưa chọn bảng')}</span>
                          <button class="rule-remove" data-act="remove-rule"
                            data-rule-id="${esc(rule.id)}" data-tip="Xóa quy tắc">×</button>
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
                                <option value="exact-normalized" ${rule.mode==='exact-normalized'?'selected':''}>Chính xác (chuẩn hóa)</option>
                                <option value="exact" ${rule.mode==='exact'?'selected':''}>Chính xác (nguyên bản)</option>
                                <option value="contains-normalized" ${rule.mode==='contains-normalized'?'selected':''}>Có chứa (chuẩn hóa)</option>
                                <option value="contains" ${rule.mode==='contains'?'selected':''}>Có chứa (nguyên bản)</option>
                              </select>
                            </label>
                          </div>

                          <div class="returns">
                            <div class="returns-title">CỘT TRẢ VỀ <span style="font-weight:400;color:#94a3b8">(nguồn → nhận)</span></div>
                            ${(rule.outputs || []).map((o, idx) => `
                              <div class="return-row" data-output="${idx}">
                                <select class="fromCol">${optionList(ref?.columns || [], o.fromCol)}</select>
                                <div class="arrow">→</div>
                                <select class="toCol">${optionList(tab.columns, o.toCol)}</select>
                                <button class="btn danger del-output" type="button" style="padding:4px 8px">×</button>
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
                <div style="padding:16px; text-align:center; color:#64748b">
                  Chưa có <b>Tab tham chiếu</b>. Hãy bấm <b>＋ Tab mới</b> và chọn loại <b>Tham chiếu</b> để thiết lập.
                </div>
              `}
            </div>

            <div class="toolbar">
              <button class="btn primary" data-act="add-row">+ Thêm dòng</button>
              <button class="btn" data-act="add-col">+ Thêm cột</button>
              ${tableColorButtonHTML()}
              <button class="btn danger" data-act="clear">Xóa dữ liệu</button>
              <span class="toolbar-note">Kéo chọn vùng · Ctrl+C copy · Ctrl+A chọn dữ liệu · Kéo chấm góc để bung dữ liệu</span>
            </div>

            ${tableHTML(tab)}
            <div class="status">
              <span class="pill">${tab.rows.length} dòng</span>
              <span class="pill">${tab.columns.length} cột</span>
              <span id="lookupStatus" style="color:#16a34a; font-weight:600">Sẵn sàng</span>
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
                <div class="tab-info-sub">Tab dữ liệu tham chiếu</div>
              </div>
              <div class="tab-actions">
                <button class="tab-action primary" data-act="import-xlsx" data-tip="Nhập file Excel/CSV">⇧ Import Excel</button>
                <button class="tab-action" data-act="export-xlsx" data-tip="Xuất file Excel">⇩ Xuất Excel</button>
                <button class="tab-action icon" data-act="undo" data-tip="Hoàn tác" data-shortcut="Ctrl + Z" disabled>↶</button>
                <button class="tab-action icon" data-act="redo" data-tip="Làm lại" data-shortcut="Ctrl + Y" disabled>↷</button>
              </div>
              <div class="more-wrap">
                <button class="more-btn" data-act="toggle-tab-menu" data-tip="Tùy chọn tab">⋮</button>
                <div class="tab-menu" id="tabMenu" style="display:none">
                  <button data-act="rename-tab">✏ Đổi tên tab</button>
                  <button data-act="duplicate-tab">▣ Nhân bản tab</button>
                  <button class="menu-danger" data-act="delete-active-tab">🗑 Xóa tab này</button>
                </div>
              </div>
            </div>
            <div class="toolbar">
              <button class="btn primary" data-act="add-row">+ Thêm dòng</button>
              <button class="btn" data-act="add-col">+ Thêm cột</button>
              ${tableColorButtonHTML()}
              <button class="btn danger" data-act="clear">Xóa dữ liệu</button>
              <span class="toolbar-note">Kéo chọn vùng · Ctrl+C copy · Ctrl+A chọn dữ liệu · Kéo chấm góc để bung dữ liệu</span>
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

          let selecting = false;
          let selStart = null;
          let selEnd = null;
          let selectionKind = 'cells';
          let ctrlACount = 0;
          let fillDragging = false;
          let fillSource = null;
          let fillTarget = null;

          const cellAt = (r,c) => root.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);

          function clearRangeVisual() {
            root.querySelectorAll('.range-selected,.range-anchor,.range-top,.range-bottom,.range-left,.range-right,.fill-handle-cell,.fill-preview')
              .forEach(el => el.classList.remove('range-selected','range-anchor','range-top','range-bottom','range-left','range-right','fill-handle-cell','fill-preview'));
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
            if (selectionKind === 'cells') cellAt(r2, c2)?.classList.add('fill-handle-cell');
            if (selectionKind === 'row') {
              for (let r=r1; r<=r2; r++) root.querySelector(`[data-row-select="${r}"]`)?.classList.add('row-selected');
            }
            if (selectionKind === 'col') {
              for (let c=c1; c<=c2; c++) root.querySelector(`[data-col-select="${c}"]`)?.classList.add('col-selected');
            }
          }

          function isEditingCell(e) {
            const cell = e.target.closest?.('.cell');
            if (!cell) return false;
            const sel = window.getSelection?.();
            return !!(sel && sel.rangeCount && !sel.isCollapsed && cell.contains(sel.anchorNode));
          }

          function dataBounds() {
            let maxR = 0, maxC = 0, found = false;
            tab.rows.forEach((row, r) => row.forEach((v, c) => {
              if (String(v ?? '').trim() !== '') { found = true; maxR = Math.max(maxR, r); maxC = Math.max(maxC, c); }
            }));
            return found ? {r:maxR,c:maxC} : {r:0,c:0};
          }

          function selectCurrentRegion() {
            const b = dataBounds();
            selectionKind = 'cells';
            selStart = {r:0,c:0}; selEnd = {r:b.r,c:b.c}; paintRange();
          }

          function fillPreview() {
            root.querySelectorAll('.fill-preview').forEach(el => el.classList.remove('fill-preview'));
            if (!fillSource || !fillTarget) return;
            const r1=Math.min(fillSource.r1,fillTarget.r), r2=Math.max(fillSource.r2,fillTarget.r);
            const c1=Math.min(fillSource.c1,fillTarget.c), c2=Math.max(fillSource.c2,fillTarget.c);
            for(let r=r1;r<=r2;r++) for(let c=c1;c<=c2;c++) cellAt(r,c)?.classList.add('fill-preview');
          }

          function applyFill() {
            if (!fillSource || !fillTarget) return;
            const before=historySnapshot(tab);
            const {r1,r2,c1,c2}=fillSource;
            const tr1=Math.min(r1,fillTarget.r), tr2=Math.max(r2,fillTarget.r);
            const tc1=Math.min(c1,fillTarget.c), tc2=Math.max(c2,fillTarget.c);
            const h=r2-r1+1, w=c2-c1+1;
            const pattern=[];
            for(let r=r1;r<=r2;r++) pattern.push(Array.from({length:w},(_,j)=>tab.rows[r]?.[c1+j] ?? ''));
            for(let r=tr1;r<=tr2;r++) for(let c=tc1;c<=tc2;c++) {
              if(r>=r1&&r<=r2&&c>=c1&&c<=c2) continue;
              while(tab.rows.length<=r) tab.rows.push(Array(tab.columns.length).fill(''));
              tab.rows[r][c]=pattern[((r-r1)%h+h)%h][((c-c1)%w+w)%w];
            }
            pushHistory(before,tab.id); ensureBlankRow(tab); saveState();
            selStart={r:tr1,c:tc1}; selEnd={r:tr2,c:tc2}; selectionKind='cells';
            fillDragging=false; fillSource=null; fillTarget=null; render();
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

          root.addEventListener('mousedown', e => {
            closeSheetContextMenu();
            const cell = e.target.closest('.cell');
            if (cell && cell.classList.contains('fill-handle-cell')) {
              const rect = cell.getBoundingClientRect();
              if (e.clientX >= rect.right - 12 && e.clientY >= rect.bottom - 12) {
                const r1=Math.min(selStart.r,selEnd.r), r2=Math.max(selStart.r,selEnd.r);
                const c1=Math.min(selStart.c,selEnd.c), c2=Math.max(selStart.c,selEnd.c);
                fillDragging=true; fillSource={r1,r2,c1,c2}; fillTarget={r:r2,c:c2};
                e.preventDefault(); e.stopPropagation(); return;
              }
            }
            if (cell) {
              selecting = true;
              selectionKind = 'cells';
              ctrlACount = 0;
              const r = +cell.dataset.r;
              const c = +cell.dataset.c;
              if (e.shiftKey && selStart) {
                selEnd = {r,c};
              } else {
                selStart = {r,c};
                selEnd = {r,c};
              }
              paintRange();
            }
          });

          root.addEventListener('mouseover', e => {
            const cell = e.target.closest('.cell');
            if (fillDragging && cell) {
              fillTarget={r:+cell.dataset.r,c:+cell.dataset.c}; fillPreview(); return;
            }
            if (!selecting) return;
            if (cell) {
              selEnd = {r:+cell.dataset.r, c:+cell.dataset.c};
              paintRange();
            }
          });

          window.addEventListener('mouseup', () => {
            selecting = false;
            if (fillDragging) applyFill();
          });

          root.addEventListener('click', e => {
            const rowTh = e.target.closest('[data-row-select]');
            if (rowTh) {
              const ri = +rowTh.dataset.rowSelect;
              selectionKind = 'row';
              selStart = {r:ri, c:0};
              selEnd = {r:ri, c:tab.columns.length-1};
              paintRange();
              return;
            }
            const colTh = e.target.closest('[data-col-select]');
            if (colTh) {
              const ci = +colTh.dataset.colSelect;
              selectionKind = 'col';
              selStart = {r:0, c:ci};
              selEnd = {r:Math.max(0, tab.rows.length-1), c:ci};
              paintRange();
              return;
            }
            const corner = e.target.closest('[data-select-all]');
            if (corner) {
              selectAllTable();
            }
          });

          root.addEventListener('keydown', async e => {
            const editingText = isEditingCell(e);
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
              if (editingText) return;
              e.preventDefault();
              if (!selStart) {
                const cell=e.target.closest('.cell');
                if(cell){ selStart=selEnd={r:+cell.dataset.r,c:+cell.dataset.c}; selectionKind='cells'; paintRange(); }
              }
              await copySelection();
              return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
              e.preventDefault();
              undoAction();
              return;
            }
            if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
              e.preventDefault();
              redoAction();
              return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
              if (editingText) return;
              e.preventDefault();
              ctrlACount++;
              if (ctrlACount === 1) selectCurrentRegion();
              else selectAllTable();
              return;
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
              if (e.target.matches('.cell') && e.target.textContent.trim() === '') {
                clearSelectionData();
              }
            }
          });

          // Cell input change listener & Auto lookup execution
          root.addEventListener('input', e => {
            const cell = e.target.closest('.cell');
            const head = e.target.closest('[data-col-name]');

            if (cell) {
              const r = +cell.dataset.r;
              const c = +cell.dataset.c;
              const val = cell.textContent;
              if (!tab.rows[r]) tab.rows[r] = Array(tab.columns.length).fill('');
              tab.rows[r][c] = val;
              ensureBlankRow(tab);
              saveState();

              if (tab.type === 'input' && Array.isArray(tab.lookupRules)) {
                tab.lookupRules.forEach(rule => {
                  if (rule.sourceCol === c && rule.autoLookup !== false) {
                    executeRuleLookup(tab, rule, r);
                  }
                });
              }
            } else if (head) {
              const ci = +head.dataset.colName;
              tab.columns[ci] = head.textContent;
              saveState();
              renderTabs();
            }
          });

          root.addEventListener('click', e => {
            const delCol = e.target.closest('[data-del-col]');
            if (delCol) {
              const ci = +delCol.dataset.delCol;
              if (tab.columns.length <= 1) {
                showModal('Thông báo', 'Bảng phải có ít nhất 1 cột.', 'warning');
                return;
              }
              const before = historySnapshot(tab);
              tab.columns.splice(ci, 1);
              tab.rows.forEach(r => r.splice(ci, 1));
              pushHistory(before, tab.id);
              ensureRect(tab); saveState(); render();
              return;
            }

            const delRow = e.target.closest('[data-del-row]');
            if (delRow) {
              const ri = +delRow.dataset.delRow;
              if (tab.rows.length <= 1) {
                tab.rows = [Array(tab.columns.length).fill('')];
              } else {
                const before = historySnapshot(tab);
                tab.rows.splice(ri, 1);
                pushHistory(before, tab.id);
              }
              ensureBlankRow(tab); saveState(); render();
              return;
            }
          });
        }

        function executeRuleLookup(inputTab, rule, targetRowIdx) {
          const refTab = getTab(rule.referenceTabId);
          const statusEl = $('#lookupStatus');
          if (!refTab) {
            if (statusEl) statusEl.textContent = 'Lỗi: Không tìm thấy bảng tham chiếu';
            return;
          }

          const sourceVal = inputTab.rows[targetRowIdx]?.[rule.sourceCol];
          if (!sourceVal || String(sourceVal).trim() === '') {
            rule.outputs.forEach(o => {
              if (inputTab.rows[targetRowIdx]) {
                inputTab.rows[targetRowIdx][o.toCol] = '';
              }
            });
            saveState();
            render();
            if (statusEl) statusEl.textContent = 'Đã xóa dữ liệu trống';
            return;
          }

          const foundRow = refTab.rows.find(refRow => matchValue(refRow[rule.refCol], sourceVal, rule.mode));

          if (foundRow) {
            rule.outputs.forEach(o => {
              if (inputTab.rows[targetRowIdx]) {
                inputTab.rows[targetRowIdx][o.toCol] = foundRow[o.fromCol] ?? '';
              }
            });
            ensureBlankRow(inputTab);
            saveState();
            render();
            if (statusEl) {
              statusEl.textContent = `Tra cứu thành công dòng ${targetRowIdx + 1}`;
              statusEl.style.color = '#16a34a';
            }
          } else {
            rule.outputs.forEach(o => {
              if (inputTab.rows[targetRowIdx]) {
                inputTab.rows[targetRowIdx][o.toCol] = '';
              }
            });
            saveState();
            render();
            if (statusEl) {
              statusEl.textContent = `Không tìm thấy kết quả cho dòng ${targetRowIdx + 1}`;
              statusEl.style.color = '#dc2626';
            }
          }
        }

        function showModal(title, message, type = 'info', buttons = [{text: 'Đóng', primary: true}], customBodyHTML = '') {
          const root = $('#modalRoot');
          if (!root) return;

          const symbolMap = { info: 'i', success: '✓', warning: '!', error: '✕', question: '?' };

          root.innerHTML = `
            <div class="modal-bg">
              <div class="modal">
                <div class="modal-head">
                  <div class="modal-symbol ${esc(type)}">${symbolMap[type] || 'i'}</div>
                  <h3 class="modal-title">${esc(title)}</h3>
                  <button class="modal-close" data-modal-close>×</button>
                </div>
                <div class="modal-body">${esc(message)}</div>
                ${customBodyHTML}
                <div class="modal-actions">
                  ${buttons.map((b, i) => `
                    <button class="modal-btn ${b.primary ? 'primary' : ''} ${b.danger ? 'danger' : ''}" data-modal-btn="${i}">${esc(b.text)}</button>
                  `).join('')}
                </div>
              </div>
            </div>
          `;

          const close = () => { root.innerHTML = ''; };
          root.querySelector('[data-modal-close]')?.addEventListener('click', close);
          root.querySelector('.modal-bg')?.addEventListener('click', e => {
            if (e.target.classList.contains('modal-bg')) close();
          });

          buttons.forEach((b, i) => {
            root.querySelector(`[data-modal-btn="${i}"]`)?.addEventListener('click', () => {
              if (b.onClick) b.onClick(root);
              if (b.close !== false) close();
            });
          });
        }

        // Event listeners cho các nút chính ở toàn cục & thanh công cụ
        shadow.addEventListener('click', e => {
          const act = e.target.dataset.act;
          if (!act) return;

          if (act === 'close') {
            host.remove();
          } else if (act === 'minimize') {
            $('.wrap').classList.add('minimized');
          } else if (act === 'restore-mini') {
            $('.wrap').classList.remove('minimized');
          } else if (act === 'toggle-search') {
            state.searchOpen = !state.searchOpen;
            saveState();
            render();
            if (state.searchOpen) $('#searchInput')?.focus();
          } else if (act === 'zoom-in') {
            state.zoom = Math.min(180, state.zoom + 10);
            saveState();
            render();
          } else if (act === 'zoom-out') {
            state.zoom = Math.max(50, state.zoom - 10);
            saveState();
            render();
          } else if (act === 'zoom-reset') {
            state.zoom = 100;
            saveState();
            render();
          } else if (act === 'save') {
            saveState();
            showModal('Thành công', 'Đã lưu toàn bộ dữ liệu vào LocalStorage thành công!', 'success');
          } else if (act === 'reset') {
            showModal('Xác nhận Reset', 'Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu về mặc định không?', 'warning', [
              {text: 'Hủy'},
              {text: 'Xác nhận', danger: true, onClick: () => {
                localStorage.removeItem(STORAGE_KEY);
                state = clone(defaultState);
                tabHistory.clear();
                render();
              }}
            ]);
          } else if (act === 'add-tab') {
            showModal('Tạo tab mới', 'Vui lòng chọn loại tab bạn muốn tạo:', 'question', [], `
              <div class="choice">
                <div class="choice-card selected" data-choice="input">
                  <b>Tab Nhập liệu</b>
                  <div style="font-size:11px;color:#64748b">Cho phép nhập dữ liệu và thiết lập quy tắc tra cứu tự động.</div>
                </div>
                <div class="choice-card" data-choice="reference">
                  <b>Tab Tham chiếu</b>
                  <div style="font-size:11px;color:#64748b">Chứa dữ liệu nguồn để tra cứu hoặc import từ file Excel.</div>
                </div>
              </div>
              <input class="modal-input" id="newTabNameInput" type="text" placeholder="Nhập tên tab..." value="Tab mới">
            `);
            const root = $('#modalRoot');
            let chosenType = 'input';
            root.querySelectorAll('.choice-card').forEach(card => {
              card.addEventListener('click', () => {
                root.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                chosenType = card.dataset.choice;
              });
            });
            const btnWrap = root.querySelector('.modal-actions');
            btnWrap.innerHTML = `
              <button class="modal-btn" id="cancelNewTab">Hủy</button>
              <button class="modal-btn primary" id="confirmNewTab">Tạo tab</button>
            `;
            root.querySelector('#cancelNewTab').addEventListener('click', () => { root.innerHTML = ''; });
            root.querySelector('#confirmNewTab').addEventListener('click', () => {
              const nameInput = root.querySelector('#newTabNameInput');
              const name = nameInput.value.trim() || 'Tab mới';
              const newId = uid();
              state.tabs.push({
                id: newId,
                name,
                type: chosenType,
                columns: ['Cột 1', 'Cột 2', 'Cột 3'],
                rows: [['', '', ''], ['', '', '']],
                ...(chosenType === 'input' ? {
                  lookupRules: [{
                    id: uid(),
                    name: 'Tham chiếu 1',
                    referenceTabId: referenceTabs()[0]?.id || '',
                    sourceCol: 0,
                    refCol: 0,
                    mode: 'exact-normalized',
                    autoLookup: true,
                    outputs: []
                  }]
                } : {})
              });
              state.activeTabId = newId;
              saveState();
              root.innerHTML = '';
              render();
            });
          } else if (act === 'toggle-settings') {
            state.settingsOpen = !state.settingsOpen;
            saveState();
            render();
          } else if (act === 'add-rule') {
            const tab = getActiveTab();
            if (!tab || tab.type !== 'input') return;
            const refs = referenceTabs();
            if (!refs.length) {
              showModal('Thông báo', 'Cần có ít nhất 1 tab tham chiếu để thêm quy tắc.', 'warning');
              return;
            }
            if (!Array.isArray(tab.lookupRules)) tab.lookupRules = [];
            tab.lookupRules.push({
              id: uid(),
              name: `Tham chiếu ${tab.lookupRules.length + 1}`,
              referenceTabId: refs[0].id,
              sourceCol: 0,
              refCol: 0,
              mode: 'exact-normalized',
              autoLookup: true,
              outputs: []
            });
            saveState();
            render();
          } else if (act === 'remove-rule') {
            const ruleId = e.target.dataset.ruleId;
            const tab = getActiveTab();
            if (!tab || !Array.isArray(tab.lookupRules)) return;
            tab.lookupRules = tab.lookupRules.filter(r => r.id !== ruleId);
            saveState();
            render();
          } else if (act === 'add-output') {
            const ruleId = e.target.dataset.ruleId;
            const tab = getActiveTab();
            const rule = tab?.lookupRules?.find(r => r.id === ruleId);
            if (!rule) return;
            if (!Array.isArray(rule.outputs)) rule.outputs = [];
            rule.outputs.push({ fromCol: 0, toCol: 0 });
            saveState();
            render();
          } else if (act === 'add-row') {
            const tab = getActiveTab();
            if (!tab) return;
            const before = historySnapshot(tab);
            tab.rows.push(Array(tab.columns.length).fill(''));
            pushHistory(before, tab.id);
            saveState();
            render();
          } else if (act === 'add-col') {
            const tab = getActiveTab();
            if (!tab) return;
            const before = historySnapshot(tab);
            const idx = tab.columns.length + 1;
            tab.columns.push(`Cột ${idx}`);
            tab.rows.forEach(r => r.push(''));
            pushHistory(before, tab.id);
            saveState();
            render();
          } else if (act === 'clear') {
            const tab = getActiveTab();
            if (!tab) return;
            showModal('Xóa dữ liệu', 'Bạn có muốn xóa toàn bộ dữ liệu trong bảng hiện tại không?', 'warning', [
              {text: 'Hủy'},
              {text: 'Xóa sạch', danger: true, onClick: () => {
                const before = historySnapshot(tab);
                tab.rows = [Array(tab.columns.length).fill('')];
                pushHistory(before, tab.id);
                saveState();
                render();
              }}
            ]);
          } else if (act === 'toggle-table-color') {
            const menu = $('#tableColorMenu');
            if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
          } else if (act === 'export-xlsx') {
            exportTabXlsx(getActiveTab());
          } else if (act === 'import-xlsx') {
            $('#xlsxInput')?.click();
          } else if (act === 'toggle-tab-menu') {
            const menu = $('#tabMenu');
            if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
          } else if (act === 'rename-tab') {
            const tab = getActiveTab();
            if (!tab) return;
            showModal('Đổi tên tab', 'Nhập tên mới cho tab:', 'question', [
              {text: 'Hủy'},
              {text: 'Lưu', primary: true, onClick: root => {
                const val = root.querySelector('#renameInput')?.value?.trim();
                if (val) {
                  tab.name = val;
                  saveState();
                  render();
                }
              }}
            ], `<input class="modal-input" id="renameInput" type="text" value="${esc(tab.name)}">`);
          } else if (act === 'duplicate-tab') {
            const tab = getActiveTab();
            if (!tab) return;
            const cloned = clone(tab);
            cloned.id = uid();
            cloned.name = tab.name + ' (Sao chép)';
            state.tabs.push(cloned);
            state.activeTabId = cloned.id;
            saveState();
            render();
          } else if (act === 'delete-active-tab') {
            const tab = getActiveTab();
            if (!tab) return;
            if (state.tabs.length <= 1) {
              showModal('Không thể xóa', 'Cần giữ lại ít nhất một tab trong bảng.', 'warning');
              return;
            }
            showModal('Xóa tab', `Bạn có chắc chắn muốn xóa tab "${tab.name}" không?`, 'danger', [
              {text: 'Hủy'},
              {text: 'Xóa', danger: true, onClick: () => {
                state.tabs = state.tabs.filter(t => t.id !== tab.id);
                state.activeTabId = state.tabs[0].id;
                saveState();
                render();
              }}
            ]);
          } else if (act === 'undo') {
            undoAction();
          } else if (act === 'redo') {
            redoAction();
          }
        });

        // Click ngoài menu để ẩn
        shadow.addEventListener('click', e => {
          if (!e.target.closest('.table-color-wrap')) {
            const menu = $('#tableColorMenu');
            if (menu) menu.style.display = 'none';
          }
          if (!e.target.closest('.more-wrap')) {
            const menu = $('#tabMenu');
            if (menu) menu.style.display = 'none';
          }
        });

        // Đổi màu bảng
        shadow.addEventListener('click', e => {
          const opt = e.target.closest('[data-table-color]');
          if (!opt) return;
          const theme = opt.dataset.tableColor;
          const tab = getActiveTab();
          if (tab) {
            tab.tableTheme = theme;
            saveState();
            render();
          }
        });

        // Click chuyển tab trên header tabsbar
        $('#tabsbar').addEventListener('click', e => {
          const tabEl = e.target.closest('[data-tab-id]');
          const closeBtn = e.target.closest('[data-close-tab]');
          if (closeBtn) {
            e.stopPropagation();
            const id = closeBtn.dataset.closeTab;
            if (state.tabs.length <= 1) {
              showModal('Không thể xóa', 'Cần giữ lại ít nhất một tab trong bảng.', 'warning');
              return;
            }
            const targetTab = getTab(id);
            showModal('Xóa tab', `Bạn có chắc chắn muốn xóa tab "${targetTab?.name || ''}" không?`, 'danger', [
              {text: 'Hủy'},
              {text: 'Xóa', danger: true, onClick: () => {
                state.tabs = state.tabs.filter(t => t.id !== id);
                if (state.activeTabId === id) state.activeTabId = state.tabs[0].id;
                saveState();
                render();
              }}
            ]);
            return;
          }
          if (tabEl) {
            const id = tabEl.dataset.tabId;
            state.activeTabId = id;
            saveState();
            render();
          }
        });

        // Tooltip hiện đại
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'app-tooltip';
        $('#tooltipRoot').appendChild(tooltipEl);

        let tooltipTimer = null;
        shadow.addEventListener('mouseover', e => {
          const target = e.target.closest('[data-tip]');
          if (!target) return;
          const tipText = target.dataset.tip;
          const shortcut = target.dataset.shortcut;
          if (!tipText) return;

          if (tooltipTimer) clearTimeout(tooltipTimer);
          tooltipTimer = setTimeout(() => {
            tooltipEl.innerHTML = `<div class="app-tooltip-title">${esc(tipText)}</div>${shortcut ? `<span class="app-tooltip-shortcut">${esc(shortcut)}</span>` : ''}`;
            const rect = target.getBoundingClientRect();
            const hostRect = host.getBoundingClientRect();
            let left = rect.left - hostRect.left + rect.width / 2;
            let top = rect.top - hostRect.top - 8;
            tooltipEl.style.left = left + 'px';
            tooltipEl.style.top = top + 'px';
            tooltipEl.style.transform = 'translate(-50%, -100%) scale(1)';
            tooltipEl.classList.add('show');
          }, 200);
        });

        shadow.addEventListener('mouseout', e => {
          if (e.target.closest('[data-tip]')) {
            if (tooltipTimer) clearTimeout(tooltipTimer);
            tooltipEl.classList.remove('show');
          }
        });

        // Kéo thả thay đổi kích thước cửa sổ (Resize)
        const resizeHandle = shadow.querySelector('.resize-handle');
        const wrapEl = shadow.querySelector('.wrap');
        let isResizing = false;
        let startX, startY, startW, startH;

        resizeHandle.addEventListener('mousedown', e => {
          isResizing = true;
          startX = e.clientX;
          startY = e.clientY;
          startW = wrapEl.offsetWidth;
          startH = wrapEl.offsetHeight;
          e.preventDefault();
        });

        window.addEventListener('mousemove', e => {
          if (!isResizing) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          wrapEl.style.width = Math.max(520, startW + dx) + 'px';
          wrapEl.style.height = Math.max(360, startH + dy) + 'px';
        });

        window.addEventListener('mouseup', () => { isResizing = false; });

        // Kéo thả di chuyển cửa sổ (Drag Topbar)
        const topbarEl = shadow.querySelector('.topbar');
        let isDragging = false;
        let dragStartX, dragStartY, wrapStartX, wrapStartY;

        topbarEl.addEventListener('mousedown', e => {
          if (e.target.closest('button')) return;
          isDragging = true;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          const rect = wrapEl.getBoundingClientRect();
          wrapStartX = rect.left;
          wrapStartY = rect.top;
          e.preventDefault();
        });

        window.addEventListener('mousemove', e => {
          if (!isDragging) return;
          const dx = e.clientX - dragStartX;
          const dy = e.clientY - dragStartY;
          wrapEl.style.left = Math.max(10, wrapStartX + dx) + 'px';
          wrapEl.style.top = Math.max(10, wrapStartY + dy) + 'px';
        });

        window.addEventListener('mouseup', () => { isDragging = false; });

        // Import / Export Excel helpers qua thư viện XLSX
        function loadXLSXLibrary(cb) {
          if (window.XLSX) { cb(); return; }
          const script = document.createElement('script');
          script.src = XLSX_URL;
          script.onload = () => cb();
          script.onerror = () => showModal('Lỗi', 'Không thể tải thư viện XLSX từ CDN.', 'error');
          document.head.appendChild(script);
        }

        function exportTabXlsx(tab) {
          if (!tab) return;
          loadXLSXLibrary(() => {
            const data = [tab.columns, ...tab.rows.map(r => tab.columns.map((_, i) => r[i] ?? ''))];
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, tab.name.slice(0, 30));
            XLSX.writeFile(wb, `${tab.name.replace(/\s+/g, '_')}.xlsx`);
          });
        }

        function onImportExcel(tab, e) {
          const file = e.target.files?.[0];
          if (!file) return;
          loadXLSXLibrary(() => {
            const reader = new FileReader();
            reader.onload = ev => {
              try {
                const data = new Uint8Array(ev.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                if (!json.length) return;

                const before = historySnapshot(tab);
                tab.columns = json[0].map(v => String(v ?? 'Cột'));
                tab.rows = json.slice(1).map(row => {
                  return tab.columns.map((_, i) => String(row[i] ?? ''));
                });
                if (!tab.rows.length) tab.rows = [Array(tab.columns.length).fill('')];
                pushHistory(before, tab.id);
                ensureBlankRow(tab);
                saveState();
                render();
                showModal('Thành công', `Đã nhập thành công ${tab.rows.length} dòng dữ liệu từ file Excel!`, 'success');
              } catch (err) {
                showModal('Lỗi đọc file', 'Không thể phân tích định dạng file Excel/CSV này.', 'error');
              }
            };
            reader.readAsArrayBuffer(file);
          });
        }

        render();
      })();

    }
  };

  // Register in the dashboard when available; otherwise run directly.
  try {
    if (window.GHTKTools && typeof window.GHTKTools.register === 'function') {
      window.GHTKTools.register('miniExcel', miniExcelTool);
    } else {
      miniExcelTool.start();
    }
  } catch (err) {
    console.error('[Mini GHTK Excel] Startup error:', err);
    // If registration itself failed, still allow direct use.
    try { miniExcelTool.start(); }
    catch (fallbackErr) { console.error('[Mini GHTK Excel] Standalone startup failed:', fallbackErr); }
  }
})();

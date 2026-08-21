(() => {
    'use strict';

    const STORAGE_KEY = '__shortcut_console_data_v4__';
    let shortcuts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let editingId = null;
    let isEnabled = true;
    let isExecuting = false; // Khóa chống trùng lặp khi đang chạy
    let activeLoopId = null;  // ID của macro đang chạy lặp lại

    /* =========================================================
        STYLE
    ========================================================= */
    const style = document.createElement('style');
    style.textContent = `
        #shortcut-console {
            position: fixed;
            top: 80px;
            right: 30px;
            width: 330px;
            background: rgba(24, 24, 27, 0.95);
            backdrop-filter: blur(12px);
            color: #f4f4f5;
            border: 1px solid rgba(63, 63, 70, 0.6);
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
            z-index: 2147483646;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
            display: block;
        }
        #shortcut-console * { box-sizing: border-box; }
        
        #shortcut-console-header {
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            background: rgba(39, 39, 42, 0.8);
            border-bottom: 1px solid rgba(63, 63, 70, 0.4);
            cursor: move;
            user-select: none;
        }
        #shortcut-console-title { 
            font-size: 13px; 
            font-weight: 700; 
            display: flex; 
            align-items: center; 
            gap: 8px; 
            color: #f4f4f5;
        }
        .sc-header-controls { display: flex; gap: 6px; }
        .sc-header-btn {
            width: 26px;
            height: 26px;
            border: 0;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: #a1a1aa;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .sc-header-btn:hover { 
            background: rgba(255, 255, 255, 0.15); 
            color: #fff;
        }

        #shortcut-console-body { padding: 16px; transition: all 0.2s ease; }
        #shortcut-console-body.collapsed { display: none; }
        
        .sc-toggle-status {
            width: 100%;
            height: 38px;
            border: 1px solid transparent;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s ease;
        }
        .sc-toggle-status.active { 
            background: rgba(22, 163, 74, 0.15); 
            color: #4ade80; 
            border-color: rgba(34, 197, 94, 0.3);
        }
        .sc-toggle-status.disabled { 
            background: rgba(220, 38, 38, 0.15); 
            color: #f87171; 
            border-color: rgba(239, 68, 68, 0.3);
        }

        .sc-stop-btn {
            width: 100%;
            height: 34px;
            border: 1px solid rgba(239, 68, 68, 0.5);
            border-radius: 10px;
            background: rgba(220, 38, 38, 0.25);
            color: #fca5a5;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            margin-bottom: 8px;
            display: none;
            align-items: center;
            justify-content: center;
            gap: 6px;
            animation: sc-pulse 1.5s infinite;
        }
        @keyframes sc-pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        .sc-add-btn {
            width: 100%;
            height: 38px;
            border: 0;
            border-radius: 10px;
            background: #2563eb;
            color: white;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            transition: all 0.2s ease;
        }
        .sc-add-btn:hover { background: #1d4ed8; }

        .sc-shortcut-list {
            margin-top: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 252px;
            overflow-y: auto;
            padding-right: 4px;
        }
        .sc-shortcut-list::-webkit-scrollbar { width: 5px; }
        .sc-shortcut-list::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }

        .sc-shortcut-item {
            height: 36px;
            min-height: 36px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            background: rgba(39, 39, 42, 0.6);
            border: 1px solid rgba(63, 63, 70, 0.4);
            border-radius: 8px;
        }
        .sc-shortcut-key {
            font-size: 12px;
            font-weight: 700;
            color: #60a5fa;
            background: rgba(37, 99, 235, 0.15);
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid rgba(96, 165, 250, 0.2);
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .sc-shortcut-key.macro {
            color: #a855f7;
            background: rgba(168, 85, 247, 0.15);
            border-color: rgba(168, 85, 247, 0.3);
        }
        .sc-actions { display: flex; gap: 6px; }
        .sc-action-btn {
            width: 26px;
            height: 26px;
            border: 0;
            border-radius: 6px;
            cursor: pointer;
            color: #a1a1aa;
            background: rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
        .sc-action-btn:hover { background: #3f3f46; color: #fff; }
        .sc-delete:hover { background: rgba(220, 38, 38, 0.2); color: #f87171; }

        .sc-target-wrapper {
            position: fixed;
            z-index: 2147483645;
            pointer-events: none;
            transition: opacity 0.25s ease;
        }
        .sc-target-wrapper.disabled { opacity: 0.35; }

        .sc-target-crosshair {
            position: absolute;
            left: 0; top: 0;
            width: 20px; height: 20px;
            transform: translate(-50%, -50%);
            border: 2px dashed #f43f5e;
            border-radius: 50%;
            background: rgba(244, 63, 94, 0.15);
            display: none;
            animation: sc-spin 6s linear infinite;
        }
        .sc-target-crosshair::before {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            width: 6px; height: 6px;
            background: #f43f5e;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 8px #f43f5e;
        }

        @keyframes sc-spin {
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .sc-floating-button {
            pointer-events: auto;
            position: absolute;
            left: -42px; top: -19px;
            min-width: 60px;
            height: 38px;
            padding: 0 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(8px);
            color: #38bdf8;
            border-radius: 20px;
            border: 1px solid rgba(56, 189, 248, 0.4);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 12px rgba(56, 189, 248, 0.2);
            cursor: move;
            user-select: none;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sc-floating-button.disabled { 
            background: rgba(39, 39, 42, 0.85) !important;
            color: #71717a !important;
            border-color: rgba(63, 63, 70, 0.5) !important;
            box-shadow: none !important;
        }
        .sc-floating-button:hover { 
            background: rgba(30, 41, 59, 0.95);
            border-color: #38bdf8;
            color: #ffffff;
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5), 0 0 18px rgba(56, 189, 248, 0.4);
        }

        .sc-modal {
            position: fixed;
            inset: 0;
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(4px);
        }
        .sc-modal-box {
            width: 400px;
            background: #18181b;
            border: 1px solid #3f3f46;
            border-radius: 16px;
            padding: 20px;
            color: white;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            max-height: 85vh;
            overflow-y: auto;
        }
        .sc-modal-title { font-size: 15px; font-weight: 700; margin-bottom: 14px; }
        .sc-tab-group { display: flex; gap: 8px; margin-bottom: 14px; }
        .sc-tab-btn {
            flex: 1;
            height: 32px;
            background: #27272a;
            border: 1px solid #3f3f46;
            color: #a1a1aa;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
        }
        .sc-tab-btn.active {
            background: #2563eb;
            color: white;
            border-color: #3b82f6;
        }
        .sc-field { margin-bottom: 12px; }
        .sc-field label { display: block; font-size: 11px; color: #a1a1aa; margin-bottom: 6px; font-weight: 600; }
        .sc-field input, .sc-field select {
            width: 100%;
            height: 38px;
            text-align: center;
            font-weight: 700;
            font-size: 13px;
            border: 1px solid #3f3f46;
            border-radius: 8px;
            outline: none;
            background: #27272a;
            color: #60a5fa;
        }
        .sc-checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            color: #e4e4e7;
        }
        .sc-checkbox-group input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
        }
        .sc-macro-step {
            display: flex;
            gap: 6px;
            margin-bottom: 8px;
            align-items: center;
        }
        .sc-macro-step select { flex: 2; text-align: left; padding: 0 8px; }
        .sc-macro-step input { flex: 1; text-align: center; }
        .sc-btn-del-step {
            width: 32px;
            height: 38px;
            background: rgba(220, 38, 38, 0.2);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            cursor: pointer;
        }
        .sc-btn-add-step {
            width: 100%;
            height: 32px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px dashed #3f3f46;
            color: #a1a1aa;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            margin-top: 4px;
        }
        .sc-btn-add-step:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
        .sc-help { margin-top: 6px; font-size: 11px; color: #a1a1aa; text-align: center; line-height: 1.4; }
        .sc-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
        .sc-btn { height: 36px; padding: 0 14px; border: 0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 12px; }
        .sc-cancel { background: #3f3f46; color: white; }
        .sc-save { background: #2563eb; color: white; }
        .sc-empty { padding: 20px; text-align: center; color: #71717a; font-size: 12px; }

        #sc-toggle {
            position: fixed;
            right: 24px;
            bottom: 24px;
            width: 48px;
            height: 48px;
            border: 0;
            border-radius: 50%;
            background: #2563eb;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 2147483644;
            display: none;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
            transition: all 0.2s ease;
        }
        #sc-toggle:hover { background: #1d4ed8; transform: scale(1.08); }
    `;
    document.head.appendChild(style);

    /* =========================================================
        CONSOLE & TOGGLE
    ========================================================= */
    const consoleEl = document.createElement('div');
    consoleEl.id = 'shortcut-console';
    consoleEl.innerHTML = `
        <div id="shortcut-console-header">
            <div id="shortcut-console-title">⚡ Phím Tắt Tự Động Click</div>
            <div class="sc-header-controls">
                <button class="sc-header-btn" id="sc-collapse-btn" title="Thu nhỏ/Phóng to nội dung">─</button>
                <button class="sc-header-btn" id="shortcut-console-minimize" title="Ẩn bảng điều khiển">✕</button>
            </div>
        </div>
        <div id="shortcut-console-body">
            <button class="sc-toggle-status active" id="sc-status-btn">🟢 ĐANG BẬT (Bấm ESC để Tắt)</button>
            <button class="sc-stop-btn" id="sc-stop-btn">⏹ DỪNG MACRO LẶP LAI (ESC)</button>
            <button class="sc-add-btn" id="sc-add">＋ Thêm phím tắt mới</button>
            <div class="sc-shortcut-list" id="sc-list"></div>
        </div>
    `;
    document.body.appendChild(consoleEl);

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'sc-toggle';
    toggleBtn.innerHTML = '⚡';
    toggleBtn.title = 'Mở lại bảng phím tắt';
    document.body.appendChild(toggleBtn);

    const statusBtn = consoleEl.querySelector('#sc-status-btn');
    const stopBtn = consoleEl.querySelector('#sc-stop-btn');
    const consoleBody = consoleEl.querySelector('#shortcut-console-body');
    const collapseBtn = consoleEl.querySelector('#sc-collapse-btn');

    collapseBtn.onclick = () => {
        const isCollapsed = consoleBody.classList.toggle('collapsed');
        collapseBtn.innerText = isCollapsed ? '▢' : '─';
    };

    function stopActiveLoop() {
        if (activeLoopId) {
            activeLoopId = null;
            stopBtn.style.display = 'none';
        }
    }

    function updateSystemStatus(state) {
        isEnabled = state !== undefined ? state : !isEnabled;
        if (isEnabled) {
            statusBtn.className = 'sc-toggle-status active';
            statusBtn.innerHTML = '🟢 ĐANG BẬT (Bấm ESC để Tắt)';
        } else {
            statusBtn.className = 'sc-toggle-status disabled';
            statusBtn.innerHTML = '🔴 ĐÃ TẮT (Bấm ESC để Bật)';
            stopActiveLoop();
        }
        renderFloatingButtons();
    }

    statusBtn.onclick = () => updateSystemStatus();
    stopBtn.onclick = () => stopActiveLoop();

    document.querySelector('#shortcut-console-minimize').onclick = () => {
        consoleEl.style.display = 'none';
        toggleBtn.style.display = 'flex';
    };

    toggleBtn.onclick = () => {
        consoleEl.style.display = 'block';
        toggleBtn.style.display = 'none';
    };

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
    }

    function normalizeKey(event) {
        const keys = [];
        if (event.ctrlKey) keys.push('Ctrl');
        if (event.altKey) keys.push('Alt');
        if (event.shiftKey) keys.push('Shift');
        if (event.metaKey) keys.push('Meta');

        let key = event.key;
        if (!['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
            if (key === ' ') key = 'Space';
            if (key.length === 1) key = key.toUpperCase();
            keys.push(key);
        }
        return keys.join(' + ');
    }

    /* =========================================================
        MODAL CẤU HÌNH
    ========================================================= */
    function openModal(shortcut = null) {
        editingId = shortcut ? shortcut.id : null;
        let isMacro = shortcut ? !!shortcut.isMacro : false;
        let isLoop = shortcut ? !!shortcut.isLoop : false;
        let loopDelay = shortcut && shortcut.loopDelay !== undefined ? shortcut.loopDelay : 2;
        let macroSteps = shortcut && shortcut.steps ? JSON.parse(JSON.stringify(shortcut.steps)) : [];

        const modal = document.createElement('div');
        modal.className = 'sc-modal';
        
        function renderModalBody() {
            modal.innerHTML = `
                <div class="sc-modal-box">
                    <div class="sc-modal-title">${shortcut ? '✏️ Cấu hình phím tắt' : '＋ Thêm phím tắt mới'}</div>
                    <div class="sc-tab-group">
                        <button class="sc-tab-btn ${!isMacro ? 'active' : ''}" id="sc-tab-single">Click Đơn Nút</button>
                        <button class="sc-tab-btn ${isMacro ? 'active' : ''}" id="sc-tab-macro">🔗 Chuỗi Liên Nút (Macro)</button>
                    </div>

                    <div class="sc-field">
                        <label>Phím Tắt Kích Hoạt</label>
                        <input id="sc-key-input" type="text" placeholder="Gõ phím tắt tại đây..." readonly value="${shortcut ? shortcut.key : ''}">
                    </div>

                    ${!isMacro ? `
                        <div class="sc-help">Ấn phím bất kỳ (VD: 1, 2, Q, Ctrl+1) để gán phím tắt.</div>
                    ` : `
                        <div class="sc-field">
                            <label>Chuỗi Các Bước & Thời Gian Chờ Sau Khi Click (Giây)</label>
                            <div id="sc-macro-container"></div>
                            <button class="sc-btn-add-step" id="sc-add-step">＋ Thêm bước tiếp theo</button>
                        </div>

                        <label class="sc-checkbox-group">
                            <input type="checkbox" id="sc-loop-check" ${isLoop ? 'checked' : ''}>
                            🔄 Lặp lại toàn bộ Chuỗi Macro
                        </label>

                        <div class="sc-field" id="sc-loop-delay-group" style="display: ${isLoop ? 'block' : 'none'};">
                            <label>Thời Gian Chờ Giữa Các Vòng Lặp (Giây)</label>
                            <input type="number" step="0.1" min="0" id="sc-loop-delay" value="${loopDelay}">
                        </div>
                    `}

                    <div class="sc-modal-actions">
                        <button class="sc-btn sc-cancel" id="sc-cancel">Hủy</button>
                        <button class="sc-btn sc-save" id="sc-save">💾 Lưu thay đổi</button>
                    </div>
                </div>
            `;

            modal.querySelector('#sc-tab-single').onclick = () => { isMacro = false; renderModalBody(); };
            modal.querySelector('#sc-tab-macro').onclick = () => { isMacro = true; renderModalBody(); };

            const keyInput = modal.querySelector('#sc-key-input');
            keyInput.addEventListener('keydown', event => {
                event.preventDefault();
                event.stopPropagation();
                const key = normalizeKey(event);
                if (key && !['Ctrl', 'Alt', 'Shift', 'Meta', 'Escape'].includes(key)) {
                    keyInput.value = key;
                }
            });

            if (isMacro) {
                const loopCheck = modal.querySelector('#sc-loop-check');
                const loopDelayGroup = modal.querySelector('#sc-loop-delay-group');

                loopCheck.onchange = () => {
                    isLoop = loopCheck.checked;
                    loopDelayGroup.style.display = isLoop ? 'block' : 'none';
                };

                const container = modal.querySelector('#sc-macro-container');
                const renderSteps = () => {
                    container.innerHTML = '';
                    const availableShortcuts = shortcuts.filter(s => !s.isMacro && s.id !== editingId);

                    if (availableShortcuts.length === 0) {
                        container.innerHTML = `<div class="sc-help" style="color:#f87171;">Tạo ít nhất 1 nút bấm đơn lẻ trước khi tạo chuỗi!</div>`;
                        return;
                    }

                    macroSteps.forEach((step, index) => {
                        const row = document.createElement('div');
                        row.className = 'sc-macro-step';
                        row.innerHTML = `
                            <select class="sc-step-target">
                                ${availableShortcuts.map(s => `<option value="${s.id}" ${step.targetId === s.id ? 'selected' : ''}>Bấm nút: ${s.key}</option>`).join('')}
                            </select>
                            <input type="number" step="0.1" min="0" class="sc-step-delay" value="${step.delay !== undefined ? step.delay : 1}" placeholder="giây" title="Thời gian chờ sang bước kế tiếp (giây)">
                            <button class="sc-btn-del-step">✕</button>
                        `;

                        row.querySelector('.sc-btn-del-step').onclick = () => {
                            macroSteps.splice(index, 1);
                            renderSteps();
                        };
                        container.appendChild(row);
                    });
                };

                renderSteps();

                modal.querySelector('#sc-add-step').onclick = () => {
                    const available = shortcuts.filter(s => !s.isMacro && s.id !== editingId);
                    if (available.length > 0) {
                        macroSteps.push({ targetId: available[0].id, delay: 1 });
                        renderSteps();
                    } else {
                        alert('Bạn cần tạo phím tắt đơn nút trước khi xếp chuỗi.');
                    }
                };
            }

            modal.querySelector('#sc-cancel').onclick = () => modal.remove();
            modal.querySelector('#sc-save').onclick = () => {
                const key = keyInput.value.trim();
                if (!key) {
                    alert('Vui lòng nhập phím tắt.');
                    return;
                }

                let finalSteps = [];
                let loopDelayVal = 2;

                if (isMacro) {
                    const rows = modal.querySelectorAll('.sc-macro-step');
                    rows.forEach(row => {
                        const targetId = row.querySelector('.sc-step-target').value;
                        const delayVal = parseFloat(row.querySelector('.sc-step-delay').value);
                        finalSteps.push({
                            targetId: targetId,
                            delay: isNaN(delayVal) ? 1 : delayVal
                        });
                    });

                    if (finalSteps.length === 0) {
                        alert('Chuỗi liên nút phải chứa ít nhất 1 bước tự động.');
                        return;
                    }

                    const inputDelay = parseFloat(modal.querySelector('#sc-loop-delay')?.value);
                    loopDelayVal = isNaN(inputDelay) ? 2 : inputDelay;
                }

                if (editingId) {
                    const item = shortcuts.find(x => x.id === editingId);
                    if (item) {
                        item.key = key;
                        item.isMacro = isMacro;
                        item.isLoop = isMacro ? isLoop : false;
                        item.loopDelay = isMacro ? loopDelayVal : undefined;
                        item.steps = isMacro ? finalSteps : undefined;
                    }
                } else {
                    shortcuts.push({
                        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
                        key,
                        isMacro,
                        isLoop: isMacro ? isLoop : false,
                        loopDelay: isMacro ? loopDelayVal : undefined,
                        steps: isMacro ? finalSteps : undefined,
                        x: Math.round(window.innerWidth / 2),
                        y: Math.round(window.innerHeight / 2)
                    });
                }

                saveData();
                renderList();
                renderFloatingButtons();
                modal.remove();
            };
        }

        document.body.appendChild(modal);
        renderModalBody();
    }

    /* =========================================================
        RENDER LIST
    ========================================================= */
    function renderList() {
        const list = document.querySelector('#sc-list');
        list.innerHTML = '';

        if (!shortcuts.length) {
            list.innerHTML = `<div class="sc-empty">Chưa có phím tắt nào được tạo.</div>`;
            return;
        }

        shortcuts.forEach(shortcut => {
            const item = document.createElement('div');
            item.className = 'sc-shortcut-item';
            item.innerHTML = `
                <div class="sc-shortcut-key ${shortcut.isMacro ? 'macro' : ''}">
                    ${shortcut.isMacro ? (shortcut.isLoop ? '🔄' : '🔗') : '⚡'} ${shortcut.key}
                </div>
                <div class="sc-actions">
                    <button class="sc-action-btn sc-edit" title="Chỉnh sửa">✏️</button>
                    <button class="sc-action-btn sc-delete" title="Xóa phím tắt">🗑️</button>
                </div>
            `;

            item.querySelector('.sc-edit').onclick = () => openModal(shortcut);
            item.querySelector('.sc-delete').onclick = () => {
                shortcuts = shortcuts.filter(x => x.id !== shortcut.id);
                saveData();
                renderList();
                renderFloatingButtons();
            };

            list.appendChild(item);
        });
    }

    /* =========================================================
        RENDER FLOATING BUTTONS
    ========================================================= */
    function renderFloatingButtons() {
        document.querySelectorAll('.sc-target-wrapper').forEach(el => el.remove());

        shortcuts.forEach(shortcut => {
            if (shortcut.isMacro) return;

            const wrapper = document.createElement('div');
            wrapper.className = `sc-target-wrapper ${!isEnabled ? 'disabled' : ''}`;
            wrapper.style.left = shortcut.x + 'px';
            wrapper.style.top = shortcut.y + 'px';

            const crosshair = document.createElement('div');
            crosshair.className = 'sc-target-crosshair';

            const button = document.createElement('div');
            button.className = `sc-floating-button ${!isEnabled ? 'disabled' : ''}`;
            button.innerText = shortcut.key;

            wrapper.appendChild(crosshair);
            wrapper.appendChild(button);
            document.body.appendChild(wrapper);

            makeDraggable(wrapper, button, crosshair, shortcut);

            button.addEventListener('click', () => {
                if (button.dataset.dragged === 'true') {
                    button.dataset.dragged = 'false';
                    return;
                }
                if (isEnabled) {
                    executeShortcut(shortcut);
                }
            });
        });
    }

    /* =========================================================
        DRAG FLOATING BUTTONS
    ========================================================= */
    function makeDraggable(wrapper, button, crosshair, shortcut) {
        let dragging = false;
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;

        button.addEventListener('mousedown', event => {
            if (event.button !== 0) return;
            dragging = true;
            button.dataset.dragged = 'false';

            startX = event.clientX;
            startY = event.clientY;
            startLeft = parseInt(wrapper.style.left) || 0;
            startTop = parseInt(wrapper.style.top) || 0;

            button.style.cursor = 'grabbing';
            crosshair.style.display = 'block';
            event.preventDefault();
        });

        document.addEventListener('mousemove', event => {
            if (!dragging) return;
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                button.dataset.dragged = 'true';
            }

            let newX = Math.max(0, Math.min(startLeft + dx, window.innerWidth));
            let newY = Math.max(0, Math.min(startTop + dy, window.innerHeight));

            wrapper.style.left = newX + 'px';
            wrapper.style.top = newY + 'px';

            shortcut.x = newX;
            shortcut.y = newY;
        });

        document.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            button.style.cursor = 'move';
            crosshair.style.display = 'none';
            saveData();
        });
    }

    /* =========================================================
        EXECUTE SHORTCUT & MACRO (HỖ TRỢ VÒNG LẶP + DỪNG KHẨN CẤP)
    ========================================================= */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function executeShortcut(shortcut) {
        if (!shortcut || isExecuting) return;

        // Nếu bấm đúng macro đang chạy lặp lại -> Dừng lại
        if (activeLoopId && activeLoopId === shortcut.id) {
            stopActiveLoop();
            return;
        }

        isExecuting = true;

        try {
            if (shortcut.isMacro && shortcut.steps) {
                // Nếu bật Lặp lại, thiết lập ID theo dõi vòng lặp
                if (shortcut.isLoop) {
                    activeLoopId = shortcut.id;
                    stopBtn.style.display = 'flex';
                }

                do {
                    for (let i = 0; i < shortcut.steps.length; i++) {
                        // Kiểm tra nếu vòng lặp đã bị ngắt
                        if (shortcut.isLoop && activeLoopId !== shortcut.id) break;

                        const step = shortcut.steps[i];
                        const targetShortcut = shortcuts.find(s => s.id === step.targetId);
                        
                        if (targetShortcut) {
                            executeSingleClick(targetShortcut);
                        }

                        const delaySec = Number(step.delay) || 0;
                        if (delaySec > 0) {
                            await sleep(Math.round(delaySec * 1000));
                        }
                    }

                    // Nếu có cài lặp lại, chờ hết khoảng thời gian cài đặt giữa các vòng lặp
                    if (shortcut.isLoop && activeLoopId === shortcut.id) {
                        const loopDelaySec = Number(shortcut.loopDelay) || 0;
                        if (loopDelaySec > 0) {
                            await sleep(Math.round(loopDelaySec * 1000));
                        }
                    }

                } while (shortcut.isLoop && activeLoopId === shortcut.id && isEnabled);

            } else {
                executeSingleClick(shortcut);
            }
        } finally {
            isExecuting = false;
            if (!activeLoopId) {
                stopBtn.style.display = 'none';
            }
        }
    }

    function executeSingleClick(shortcut) {
        setTimeout(() => {
            const wrappers = document.querySelectorAll('.sc-target-wrapper');
            wrappers.forEach(w => w.style.display = 'none');

            const element = document.elementFromPoint(shortcut.x, shortcut.y);

            wrappers.forEach(w => w.style.display = 'block');

            if (element) {
                element.click();

                const flash = document.createElement('div');
                flash.style.cssText = `
                    position: fixed;
                    left: ${shortcut.x}px;
                    top: ${shortcut.y}px;
                    width: 10px;
                    height: 10px;
                    transform: translate(-50%, -50%);
                    background: radial-gradient(circle, rgba(56, 189, 248, 0.9) 0%, rgba(37, 99, 235, 0.4) 60%, rgba(0,0,0,0) 100%);
                    border-radius: 50%;
                    border: 2px solid #38bdf8;
                    box-shadow: 0 0 15px #38bdf8;
                    z-index: 2147483647;
                    pointer-events: none;
                    transition: transform 0.35s cubic-bezier(0, 0, 0.2, 1), opacity 0.35s ease;
                `;
                document.body.appendChild(flash);
                requestAnimationFrame(() => {
                    flash.style.transform = 'translate(-50%, -50%) scale(4)';
                    flash.style.opacity = '0';
                });
                setTimeout(() => flash.remove(), 350);
            }
        }, 0);
    }

    /* =========================================================
        GLOBAL KEYBOARD LISTENER
    ========================================================= */
    document.addEventListener('keydown', async event => {
        if (event.key === 'Escape') {
            if (activeLoopId) {
                stopActiveLoop();
                return;
            }
            if (!document.querySelector('.sc-modal')) {
                updateSystemStatus();
                return;
            }
        }

        if (!isEnabled || document.querySelector('.sc-modal') || isExecuting) return;

        const key = normalizeKey(event);
        if (!key) return;

        const shortcut = shortcuts.find(x => x.key === key);
        if (shortcut) {
            event.preventDefault();
            event.stopPropagation();
            await executeShortcut(shortcut);
        }
    }, true);

    document.querySelector('#sc-add').onclick = () => openModal();

    /* =========================================================
        DRAG CONSOLE PANEL
    ========================================================= */
    const header = document.querySelector('#shortcut-console-header');
    let consoleDragging = false;
    let consoleStartX = 0, consoleStartY = 0;
    let consoleStartLeft = 0, consoleStartTop = 0;

    header.addEventListener('mousedown', event => {
        if (event.target.closest('button')) return;
        consoleDragging = true;
        const rect = consoleEl.getBoundingClientRect();
        consoleStartX = event.clientX;
        consoleStartY = event.clientY;
        consoleStartLeft = rect.left;
        consoleStartTop = rect.top;
        event.preventDefault();
    });

    document.addEventListener('mousemove', event => {
        if (!consoleDragging) return;
        const dx = event.clientX - consoleStartX;
        const dy = event.clientY - consoleStartY;

        let x = Math.max(0, Math.min(consoleStartLeft + dx, window.innerWidth - consoleEl.offsetWidth));
        let y = Math.max(0, Math.min(consoleStartTop + dy, window.innerHeight - consoleEl.offsetHeight));

        consoleEl.style.left = x + 'px';
        consoleEl.style.top = y + 'px';
        consoleEl.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
        consoleDragging = false;
    });

    // Khởi tạo hiển thị ban đầu
    renderList();
    renderFloatingButtons();
})();
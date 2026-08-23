(() => {
    'use strict';

    const STORAGE_KEY = '__shortcut_console_data_v17__';
    let shortcuts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let editingId = null;
    let isEnabled = true;
    let isExecuting = false;
    let activeLoopId = null;
    let countdownTimer = null;
    let isRecording = false;
    let lastRecordTime = 0;
    let tempRecordedSteps = [];

    /* =========================================================
        STYLE & DESIGN
    ========================================================= */
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --sc-bg: rgba(15, 23, 42, 0.94);
            --sc-card-bg: rgba(30, 41, 59, 0.75);
            --sc-border: rgba(255, 255, 255, 0.1);
            --sc-accent: #38bdf8;
            --sc-accent-hover: #0ea5e9;
            --sc-success: #22c55e;
            --sc-danger: #ef4444;
            --sc-macro: #c084fc;
            --sc-text-main: #f8fafc;
            --sc-text-muted: #94a3b8;
            --sc-radius: 14px;
        }

        #shortcut-console {
            position: fixed;
            top: 60px;
            right: 24px;
            width: 340px;
            background: var(--sc-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            color: var(--sc-text-main);
            border: 1px solid var(--sc-border);
            border-radius: var(--sc-radius);
            box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.15);
            z-index: 2147483646;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
            transition: transform 0.05s linear, opacity 0.2s ease;
        }

        #shortcut-console * { box-sizing: border-box; }

        #shortcut-console-header {
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 14px;
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid var(--sc-border);
            cursor: move;
            user-select: none;
        }

        #shortcut-console-title {
            font-size: 13px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--sc-text-main);
            letter-spacing: 0.3px;
        }

        .sc-header-controls { display: flex; gap: 4px; }
        .sc-header-btn {
            width: 24px;
            height: 24px;
            border: 0;
            border-radius: 6px;
            background: transparent;
            color: var(--sc-text-muted);
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s ease;
        }
        .sc-header-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }

        #shortcut-console-body { padding: 14px; transition: all 0.2s ease; }
        #shortcut-console-body.collapsed { display: none; }
        
        /* Status Banner */
        .sc-status-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: var(--sc-card-bg);
            border: 1px solid var(--sc-border);
            border-radius: 10px;
            margin-bottom: 10px;
            font-size: 12px;
            font-weight: 500;
        }
        .sc-status-indicator {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .sc-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--sc-text-muted);
        }
        .active .sc-dot { background: var(--sc-success); box-shadow: 0 0 8px var(--sc-success); }
        .disabled .sc-dot { background: var(--sc-danger); }

        .sc-switch {
            position: relative;
            display: inline-block;
            width: 36px;
            height: 20px;
        }
        .sc-switch input { opacity: 0; width: 0; height: 0; }
        .sc-slider {
            position: absolute;
            cursor: pointer;
            inset: 0;
            background-color: #475569;
            transition: .2s;
            border-radius: 20px;
        }
        .sc-slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .2s;
            border-radius: 50%;
        }
        input:checked + .sc-slider { background-color: var(--sc-success); }
        input:checked + .sc-slider:before { transform: translateX(16px); }

        /* Stop Button & Countdown */
        .sc-stop-btn {
            width: 100%;
            height: 38px;
            border: 1px solid rgba(239, 68, 68, 0.4);
            border-radius: 8px;
            background: rgba(239, 68, 68, 0.15);
            color: #fca5a5;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 10px;
            display: none;
            align-items: center;
            justify-content: center;
            gap: 6px;
            animation: sc-pulse 1.5s infinite;
        }
        @keyframes sc-pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        /* Action Controls */
        .sc-add-btn {
            width: 100%;
            height: 36px;
            border: 0;
            border-radius: 8px;
            background: var(--sc-accent);
            color: #0f172a;
            cursor: pointer;
            font-size: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.15s ease;
        }
        .sc-add-btn:hover { background: #7dd3fc; transform: translateY(-1px); }

        /* List UI */
        .sc-shortcut-list {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            max-height: 220px;
            overflow-y: auto;
            padding-right: 2px;
        }
        .sc-shortcut-list::-webkit-scrollbar { width: 4px; }
        .sc-shortcut-list::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }

        .sc-shortcut-item {
            min-height: 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 10px;
            background: var(--sc-card-bg);
            border: 1px solid var(--sc-border);
            border-radius: 8px;
            transition: border-color 0.15s ease;
        }
        .sc-shortcut-item:hover { border-color: rgba(255, 255, 255, 0.2); }

        .sc-shortcut-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            overflow: hidden;
            padding-right: 6px;
        }
        .sc-shortcut-title-row {
            font-size: 12px;
            font-weight: 700;
            color: var(--sc-text-main);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .sc-shortcut-key {
            font-size: 11px;
            font-weight: 600;
            color: var(--sc-accent);
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .sc-shortcut-key.macro { color: var(--sc-macro); }

        .sc-actions { display: flex; gap: 4px; flex-shrink: 0; }
        .sc-action-btn {
            width: 24px;
            height: 24px;
            border: 0;
            border-radius: 6px;
            cursor: pointer;
            color: var(--sc-text-muted);
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            transition: all 0.15s ease;
        }
        .sc-action-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
        .sc-delete:hover { background: rgba(239, 68, 68, 0.2); color: #f87171; }

        /* Target Floating Pointer */
        .sc-target-wrapper {
            position: fixed;
            z-index: 2147483645;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }
        .sc-target-wrapper.disabled { opacity: 0.3; }

        .sc-target-crosshair {
            position: absolute;
            left: 0; top: 0;
            width: 18px; height: 18px;
            transform: translate(-50%, -50%);
            border: 2px dashed #f43f5e;
            border-radius: 50%;
            background: rgba(244, 63, 94, 0.1);
            display: none;
        }

        .sc-floating-button {
            pointer-events: auto;
            position: absolute;
            left: -30px; top: -16px;
            padding: 4px 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(8px);
            color: var(--sc-accent);
            border-radius: 20px;
            border: 1px solid var(--sc-accent);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            cursor: move;
            user-select: none;
            font-size: 11px;
            font-weight: 700;
            transition: all 0.15s ease;
            white-space: nowrap;
        }
        .sc-floating-button.sc-macro-step-btn {
            color: var(--sc-macro);
            border-color: var(--sc-macro);
        }
        .sc-floating-button:hover {
            transform: scale(1.05);
            background: #1e293b;
            color: #fff;
        }
        .sc-floating-button.clicked {
            background: var(--sc-success) !important;
            color: #0f172a !important;
            border-color: #fff !important;
            transform: scale(0.92);
        }

        /* Click Ripple Effect */
        .sc-click-ripple {
            position: fixed;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(56, 189, 248, 0.7);
            border: 2px solid #ffffff;
            transform: translate(-50%, -50%) scale(0.3);
            pointer-events: none;
            z-index: 2147483647;
            animation: sc-ripple-anim 0.4s ease-out forwards;
        }
        @keyframes sc-ripple-anim {
            0% { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }

        /* Modal UI */
        .sc-modal {
            position: fixed;
            inset: 0;
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
        }
        .sc-modal-box {
            width: 440px;
            background: #0f172a;
            border: 1px solid var(--sc-border);
            border-radius: 16px;
            padding: 18px;
            color: var(--sc-text-main);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            max-height: 90vh;
            overflow-y: auto;
        }
        .sc-modal-title { font-size: 14px; font-weight: 700; margin-bottom: 12px; }
        .sc-tab-group { display: flex; gap: 6px; margin-bottom: 12px; background: #1e293b; padding: 3px; border-radius: 8px; }
        .sc-tab-btn {
            flex: 1;
            height: 28px;
            background: transparent;
            border: 0;
            color: var(--sc-text-muted);
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .sc-tab-btn.active { background: var(--sc-accent); color: #0f172a; }

        .sc-field { margin-bottom: 10px; }
        .sc-field label { display: block; font-size: 11px; color: var(--sc-text-muted); margin-bottom: 4px; }
        .sc-field input, .sc-field select {
            width: 100%;
            height: 34px;
            padding: 0 10px;
            font-size: 12px;
            border: 1px solid var(--sc-border);
            border-radius: 6px;
            outline: none;
            background: #1e293b;
            color: #fff;
        }
        
        #sc-key-input {
            text-align: center;
            font-weight: 700;
            font-size: 13px;
            color: var(--sc-accent);
            background: rgba(56, 189, 248, 0.08);
            border-color: rgba(56, 189, 248, 0.3);
            letter-spacing: 0.5px;
        }
        #sc-key-input::placeholder {
            font-weight: 400;
            color: var(--sc-text-muted);
            letter-spacing: normal;
        }

        .sc-field input.error, .sc-field select.error {
            border-color: var(--sc-danger) !important;
            background: rgba(239, 68, 68, 0.08) !important;
        }
        .sc-error-msg {
            font-size: 11px;
            color: var(--sc-danger);
            margin-top: 4px;
            display: none;
        }

        .sc-macro-toolbar {
            display: flex;
            gap: 6px;
            margin-bottom: 8px;
        }
        .sc-btn-record {
            flex: 1;
            height: 34px;
            background: rgba(239, 68, 68, 0.2);
            color: #fca5a5;
            border: 1px solid rgba(239, 68, 68, 0.5);
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .sc-btn-record:hover { background: rgba(239, 68, 68, 0.3); color: #fff; }

        /* Top Global Recording Floating Banner & Overlay */
        #sc-global-rec-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.15);
            z-index: 2147483646;
            cursor: crosshair;
            display: none;
        }

        #sc-global-rec-banner {
            position: fixed;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2147483647;
            background: #ef4444;
            color: #fff;
            padding: 8px 18px;
            border-radius: 24px;
            box-shadow: 0 10px 25px rgba(239, 68, 68, 0.5);
            display: none;
            align-items: center;
            gap: 12px;
            font-size: 12px;
            font-weight: 700;
            font-family: system-ui, sans-serif;
            animation: sc-pulse 1.5s infinite;
            user-select: none;
        }
        #sc-global-rec-stop {
            background: #fff;
            color: #ef4444;
            border: 0;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.1s;
        }
        #sc-global-rec-stop:hover { transform: scale(1.05); }

        .sc-macro-step { display: flex; gap: 6px; margin-bottom: 6px; align-items: center; background: rgba(255,255,255,0.02); padding: 4px; border-radius: 6px; border: 1px solid var(--sc-border); }
        .sc-macro-step input { flex: 1; text-align: center; }
        .sc-step-info { flex: 2; font-size: 11px; color: var(--sc-text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 6px; }
        .sc-btn-del-step {
            width: 30px; height: 30px;
            background: rgba(239, 68, 68, 0.1);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sc-btn-add-step {
            width: 100%; height: 30px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px dashed var(--sc-border);
            color: var(--sc-text-muted);
            border-radius: 6px;
            cursor: pointer;
            font-size: 11px;
        }
        .sc-btn-add-step:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }

        .sc-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
        .sc-btn { height: 32px; padding: 0 12px; border: 0; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 11px; }
        .sc-cancel { background: #334155; color: white; }
        .sc-save { background: var(--sc-accent); color: #0f172a; }
        .sc-empty { padding: 16px; text-align: center; color: var(--sc-text-muted); font-size: 11px; }

        #sc-toggle {
            position: fixed; right: 20px; bottom: 20px;
            width: 42px; height: 42px; border: 0; border-radius: 50%;
            background: var(--sc-accent); color: #0f172a; font-size: 18px;
            cursor: pointer; z-index: 2147483644; display: none;
            align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4);
        }

        /* Opacity Control */
        .sc-opacity-control {
            margin-bottom: 10px;
            padding: 9px 10px;
            background: var(--sc-card-bg);
            border: 1px solid var(--sc-border);
            border-radius: 8px;
        }

        .sc-opacity-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 7px;
            font-size: 11px;
            font-weight: 600;
            color: var(--sc-text-muted);
        }

        #sc-opacity-value {
            color: var(--sc-accent);
            font-weight: 700;
        }

        #sc-opacity-slider {
            width: 100%;
            height: 4px;
            margin: 0;
            padding: 0;
            cursor: pointer;
            accent-color: var(--sc-accent);
        }
    `;
    document.head.appendChild(style);

    /* =========================================================
        CONSOLE INITIALIZATION
    ========================================================= */
    const consoleEl = document.createElement('div');
    consoleEl.id = 'shortcut-console';
    consoleEl.innerHTML = `
        <div id="shortcut-console-header">
            <div id="shortcut-console-title">⚡ Auto Clicker Console</div>
            <div class="sc-header-controls">
                <button class="sc-header-btn" id="sc-collapse-btn" title="Thu nhỏ">─</button>
                <button class="sc-header-btn" id="shortcut-console-minimize" title="Ẩn">✕</button>
            </div>
        </div>
        <div id="shortcut-console-body">
            <div class="sc-status-banner active" id="sc-status-banner">
                <div class="sc-status-indicator">
                    <span class="sc-dot"></span>
                    <span id="sc-status-text">Đang hoạt động</span>
                </div>
                <label class="sc-switch">
                    <input type="checkbox" id="sc-status-toggle" checked>
                    <span class="sc-slider"></span>
                </label>
            </div>
            <button class="sc-stop-btn" id="sc-stop-btn">⏹ DỪNG MACRO (ESC)</button>
            
            <div class="sc-opacity-control">
                <div class="sc-opacity-header">
                    <span>🎚️ Độ mờ nút</span>
                    <span id="sc-opacity-value">100%</span>
                </div>
                <input
                    type="range"
                    id="sc-opacity-slider"
                    min="20"
                    max="100"
                    value="100"
                    step="5"
                >
            </div>

            <button class="sc-add-btn" id="sc-add">＋ Thêm phím tắt mới</button>
            <div class="sc-shortcut-list" id="sc-list"></div>
        </div>
    `;
    document.body.appendChild(consoleEl);

    // Kéo thả console chính
    const consoleHeader = consoleEl.querySelector('#shortcut-console-header');
    let isConsoleDragging = false;
    let consoleStartX = 0, consoleStartY = 0;
    let consoleStartLeft = 0, consoleStartTop = 0;

    consoleHeader.addEventListener('mousedown', (e) => {
        if (e.target.closest('.sc-header-controls')) return;
        isConsoleDragging = true;
        consoleStartX = e.clientX;
        consoleStartY = e.clientY;

        const rect = consoleEl.getBoundingClientRect();
        consoleStartLeft = rect.left;
        consoleStartTop = rect.top;

        consoleEl.style.right = 'auto';
        consoleEl.style.left = consoleStartLeft + 'px';
        consoleEl.style.top = consoleStartTop + 'px';
        
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isConsoleDragging) return;
        let newLeft = consoleStartLeft + (e.clientX - consoleStartX);
        let newTop = consoleStartTop + (e.clientY - consoleStartY);

        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - consoleEl.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 40));

        consoleEl.style.left = newLeft + 'px';
        consoleEl.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', () => { isConsoleDragging = false; });

    const globalRecOverlay = document.createElement('div');
    globalRecOverlay.id = 'sc-global-rec-overlay';
    document.body.appendChild(globalRecOverlay);

    const globalRecBanner = document.createElement('div');
    globalRecBanner.id = 'sc-global-rec-banner';
    globalRecBanner.innerHTML = `
        <span>🔴 Đang khóa web & ghi thao tác macro...</span>
        <button id="sc-global-rec-stop">⏹ Xong & Trở lại</button>
    `;
    document.body.appendChild(globalRecBanner);

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'sc-toggle';
    toggleBtn.innerHTML = '⚡';
    toggleBtn.title = 'Mở lại Console';
    document.body.appendChild(toggleBtn);

    const statusBanner = consoleEl.querySelector('#sc-status-banner');
    const statusToggle = consoleEl.querySelector('#sc-status-toggle');
    const statusText = consoleEl.querySelector('#sc-status-text');
    const stopBtn = consoleEl.querySelector('#sc-stop-btn');
    const consoleBody = consoleEl.querySelector('#shortcut-console-body');
    const collapseBtn = consoleEl.querySelector('#sc-collapse-btn');

    const opacitySlider = consoleEl.querySelector('#sc-opacity-slider');
    const opacityValue = consoleEl.querySelector('#sc-opacity-value');

    opacitySlider.addEventListener('input', () => {
        const opacity = parseInt(opacitySlider.value, 10);

        opacityValue.textContent = `${opacity}%`;

        document.querySelectorAll('.sc-floating-button').forEach(button => {
            button.style.opacity = opacity / 100;
        });
    });

    collapseBtn.onclick = () => {
        const isCollapsed = consoleBody.classList.toggle('collapsed');
        collapseBtn.innerText = isCollapsed ? '▢' : '─';
    };

    function stopActiveLoop() {
        if (activeLoopId) {
            activeLoopId = null;
            if (countdownTimer) {
                clearInterval(countdownTimer);
                countdownTimer = null;
            }
            stopBtn.style.display = 'none';
        }
    }

    function updateSystemStatus(state) {
        isEnabled = state !== undefined ? state : !isEnabled;
        statusToggle.checked = isEnabled;
        if (isEnabled) {
            statusBanner.className = 'sc-status-banner active';
            statusText.innerText = 'Đang hoạt động';
        } else {
            statusBanner.className = 'sc-status-banner disabled';
            statusText.innerText = 'Đã tạm dừng';
            stopActiveLoop();
        }
        renderFloatingButtons();
    }

    statusToggle.onchange = (e) => updateSystemStatus(e.target.checked);
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
        MODAL DIALOG & RECORDING
    ========================================================= */
    let currentActiveModal = null;

    function openModal(shortcut = null) {
        editingId = shortcut ? shortcut.id : null;
        let isMacro = shortcut ? !!shortcut.isMacro : false;
        let isLoop = shortcut ? !!shortcut.isLoop : false;
        let clickType = shortcut && shortcut.clickType ? shortcut.clickType : 'left';
        let loopDelay = shortcut && shortcut.loopDelay !== undefined ? shortcut.loopDelay : 2;
        let macroSteps = shortcut && shortcut.steps ? JSON.parse(JSON.stringify(shortcut.steps)) : [];
        let shortcutName = shortcut && shortcut.name ? shortcut.name : '';
        let posX = shortcut && shortcut.x !== undefined ? shortcut.x : window.innerWidth / 2;
        let posY = shortcut && shortcut.y !== undefined ? shortcut.y : window.innerHeight / 2;

        const modal = document.createElement('div');
        modal.className = 'sc-modal';
        currentActiveModal = modal;

        function syncStepsFromDOM() {
            if (!isMacro) return;
            const rows = modal.querySelectorAll('.sc-macro-step');
            const currentSteps = [];
            rows.forEach(row => {
                const delayInput = row.querySelector('.sc-step-delay');
                const x = parseFloat(row.dataset.x);
                const y = parseFloat(row.dataset.y);
                const cType = row.dataset.clickType || 'left';
                if (!isNaN(x) && !isNaN(y)) {
                    const delayVal = parseFloat(delayInput?.value);
                    currentSteps.push({
                        x: x,
                        y: y,
                        clickType: cType,
                        delay: isNaN(delayVal) ? 0 : delayVal
                    });
                }
            });
            macroSteps = currentSteps;
        }

        function renderModalBody() {
            if (!isMacro) {
                const selectType = modal.querySelector('#sc-click-type');
                if (selectType) clickType = selectType.value;
                const inputX = modal.querySelector('#sc-single-x');
                const inputY = modal.querySelector('#sc-single-y');
                if (inputX) posX = parseFloat(inputX.value) || posX;
                if (inputY) posY = parseFloat(inputY.value) || posY;
            }
            const nameInputEl = modal.querySelector('#sc-name-input');
            if (nameInputEl) shortcutName = nameInputEl.value;

            const singleClickShortcuts = shortcuts.filter(s => !s.isMacro && s.x !== undefined && s.y !== undefined);

            modal.innerHTML = `
                <div class="sc-modal-box">
                    <div class="sc-modal-title">${shortcut ? '✏️ Cấu hình' : '＋ Thêm phím tắt / Macro'}</div>
                    <div class="sc-tab-group">
                        <button class="sc-tab-btn ${!isMacro ? 'active' : ''}" id="sc-tab-single">Click Đơn</button>
                        <button class="sc-tab-btn ${isMacro ? 'active' : ''}" id="sc-tab-macro">Chuỗi Macro (Nhiều bước)</button>
                    </div>
                
                    <div class="sc-field">
                        <label>Tên Gợi Nhớ (Tùy chọn)</label>
                        <input id="sc-name-input" type="text" placeholder="VD: Đăng nhập tự động..." value="${shortcutName}">
                    </div>

                    <div class="sc-field">
                        <label>Phím Tắt Kích Hoạt</label>
                        <input id="sc-key-input" type="text" placeholder="Bấm phím để gán..." readonly value="${shortcut ? shortcut.key : ''}">
                        <div class="sc-error-msg" id="sc-key-error">Vui lòng nhập phím tắt.</div>
                    </div>

                    ${!isMacro ? `
                        <div class="sc-field">
                            <label>Kiểu Click Chuột</label>
                            <select id="sc-click-type">
                                <option value="left" ${clickType === 'left' ? 'selected' : ''}>Click Trái Chuẩn (Left Click)</option>
                                <option value="double" ${clickType === 'double' ? 'selected' : ''}>Click Đúp (Double Click)</option>
                                <option value="right" ${clickType === 'right' ? 'selected' : ''}>Click Phải (Right Click)</option>
                                <option value="ctrl" ${clickType === 'ctrl' ? 'selected' : ''}>Ctrl + Click</option>
                                <option value="shift" ${clickType === 'shift' ? 'selected' : ''}>Shift + Click</option>
                                <option value="alt" ${clickType === 'alt' ? 'selected' : ''}>Alt + Click</option>
                            </select>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <div class="sc-field" style="flex: 1;">
                                <label>Tọa độ X</label>
                                <input id="sc-single-x" type="number" value="${Math.round(posX)}">
                            </div>
                            <div class="sc-field" style="flex: 1;">
                                <label>Tọa độ Y</label>
                                <input id="sc-single-y" type="number" value="${Math.round(posY)}">
                            </div>
                        </div>
                    ` : `
                        <div class="sc-field">
                            <label>Các bước Click trong Macro</label>
                            <div class="sc-macro-toolbar">
                                <button class="sc-btn-record" id="sc-toggle-record">
                                    🔴 Record thao tác trực tiếp trên web
                                </button>
                            </div>

                            ${singleClickShortcuts.length > 0 ? `
                                <div style="display: flex; gap: 6px; margin-bottom: 8px; align-items: center; background: rgba(255,255,255,0.03); padding: 6px; border-radius: 6px; border: 1px solid var(--sc-border);">
                                    <select id="sc-select-existing-single" style="flex: 1; height: 30px; font-size: 11px;">
                                        ${singleClickShortcuts.map(s => `<option value="${s.id}">${s.name || s.key} ([${Math.round(s.x)}, ${Math.round(s.y)}])</option>`).join('')}
                                    </select>
                                    <button type="button" id="sc-btn-add-existing" class="sc-btn" style="background: var(--sc-accent); color: #0f172a; height: 30px; padding: 0 8px; font-size: 11px;">➕ Thêm bước này</button>
                                </div>
                            ` : ''}

                            <div id="sc-macro-container" style="max-height: 150px; overflow-y: auto;"></div>
                            <div class="sc-error-msg" id="sc-macro-error"></div>
                        </div>

                        <div style="display:flex; align-items:center; gap:8px; margin: 10px 0;">
                            <input type="checkbox" id="sc-loop-check" ${isLoop ? 'checked' : ''}>
                            <label for="sc-loop-check" style="font-size:11px; cursor:pointer;">🔄 Lặp lại chuỗi liên tục</label>
                        </div>

                        <div class="sc-field" id="sc-loop-delay-group" style="display: ${isLoop ? 'block' : 'none'};">
                            <label>Thời Gian Nghỉ Giữa Mỗi Vòng (Giây)</label>
                            <input type="number" step="0.1" min="0" id="sc-loop-delay" value="${loopDelay}">
                        </div>
                    `}

                    <div class="sc-modal-actions">
                        <button class="sc-btn sc-cancel" id="sc-cancel">Hủy</button>
                        <button class="sc-btn sc-save" id="sc-save">Lưu cấu hình</button>
                    </div>
                </div>
            `;

            modal.querySelector('#sc-tab-single').onclick = () => { 
                syncStepsFromDOM();
                isMacro = false; 
                renderModalBody(); 
            };
            modal.querySelector('#sc-tab-macro').onclick = () => { 
                syncStepsFromDOM(); 
                isMacro = true; 
                renderModalBody(); 
            };

            const keyInput = modal.querySelector('#sc-key-input');
            const keyError = modal.querySelector('#sc-key-error');

            keyInput.addEventListener('keydown', event => {
                event.preventDefault();
                event.stopPropagation();
                const key = normalizeKey(event);
                if (key && !['Ctrl', 'Alt', 'Shift', 'Meta', 'Escape'].includes(key)) {
                    keyInput.value = key;
                    keyInput.classList.remove('error');
                    keyError.style.display = 'none';
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
                const macroError = modal.querySelector('#sc-macro-error');

                const renderSteps = () => {
                    container.innerHTML = '';
                    if (macroSteps.length === 0) {
                        container.innerHTML = `<div style="font-size:11px; color:var(--sc-text-muted); padding: 8px; text-align:center;">Chưa có bước nào. Bấm record hoặc thêm nhanh từ Click đơn có sẵn!</div>`;
                        return;
                    }

                    macroSteps.forEach((step, index) => {
                        const row = document.createElement('div');
                        row.className = 'sc-macro-step';
                        row.dataset.x = step.x;
                        row.dataset.y = step.y;
                        row.dataset.clickType = step.clickType || 'left';

                        row.innerHTML = `
                            <input type="number" step="0.1" min="0" class="sc-step-delay" value="${step.delay !== undefined ? step.delay : 0}" title="Độ trễ trước bước này (giây)">
                            <div class="sc-step-info" title="Tọa độ: X:${Math.round(step.x)}, Y:${Math.round(step.y)} (${step.clickType || 'left'})">
                                📍 [${Math.round(step.x)}, ${Math.round(step.y)}] (${step.clickType || 'left'})
                            </div>
                            <button class="sc-btn-del-step" title="Xóa bước này">✕</button>
                        `;

                        row.querySelector('.sc-btn-del-step').onclick = () => {
                            syncStepsFromDOM();
                            macroSteps.splice(index, 1);
                            renderSteps();
                        };
                        container.appendChild(row);
                    });
                };

                renderSteps();

                const btnAddExisting = modal.querySelector('#sc-btn-add-existing');
                if (btnAddExisting) {
                    btnAddExisting.onclick = () => {
                        syncStepsFromDOM();
                        const selectEl = modal.querySelector('#sc-select-existing-single');
                        const selectedId = selectEl.value;
                        const found = shortcuts.find(s => s.id === selectedId);
                        if (found) {
                            macroSteps.push({
                                x: found.x,
                                y: found.y,
                                clickType: found.clickType || 'left',
                                delay: 0.5
                            });
                            renderSteps();
                        }
                    };
                }

                modal.querySelector('#sc-toggle-record').onclick = () => {
                    syncStepsFromDOM();

                    tempRecordedSteps = macroSteps;

                    // Reset thời gian mỗi lần bắt đầu Record
                    lastRecordTime = 0;

                    isRecording = true;

                    modal.style.display = 'none'; 
                    globalRecOverlay.style.display = 'block';
                    globalRecBanner.style.display = 'flex'; 
                };
            }

            modal.querySelector('#sc-cancel').onclick = () => {
                isRecording = false;
                globalRecOverlay.style.display = 'none';
                globalRecBanner.style.display = 'none';
                currentActiveModal = null;
                modal.remove();
            };

            modal.querySelector('#sc-save').onclick = () => {
                isRecording = false;
                globalRecOverlay.style.display = 'none';
                globalRecBanner.style.display = 'none';
                if (isMacro) {
                    syncStepsFromDOM();
                } else {
                    const inputX = modal.querySelector('#sc-single-x');
                    const inputY = modal.querySelector('#sc-single-y');
                    if (inputX) posX = parseFloat(inputX.value) || posX;
                    if (inputY) posY = parseFloat(inputY.value) || posY;
                }
                
                const nameVal = modal.querySelector('#sc-name-input').value.trim();
                const key = keyInput.value.trim();
                let hasError = false;

                if (!key) {
                    keyInput.classList.add('error');
                    keyError.style.display = 'block';
                    hasError = true;
                } else {
                    keyInput.classList.remove('error');
                    keyError.style.display = 'none';
                }

                let clickTypeVal = 'left';
                let loopDelayVal = 2;

                if (!isMacro) {
                    clickTypeVal = modal.querySelector('#sc-click-type').value;
                } else {
                    const macroError = modal.querySelector('#sc-macro-error');
                    if (macroSteps.length === 0) {
                        macroError.innerText = 'Chuỗi Macro phải chứa ít nhất 1 bước click.';
                        macroError.style.display = 'block';
                        hasError = true;
                    } else {
                        macroError.style.display = 'none';
                    }
                    // Gán mặc định tọa độ cho các bước trong macro nếu chưa có sẵn vị trí nổi
                    macroSteps.forEach((step, idx) => {
                        if (step.x === undefined || step.y === undefined) {
                            step.x = window.innerWidth / 2 + (idx * 20);
                            step.y = window.innerHeight / 2 + (idx * 20);
                        }
                    });

                    const inputDelay = parseFloat(modal.querySelector('#sc-loop-delay')?.value);
                    loopDelayVal = isNaN(inputDelay) ? 2 : inputDelay;
                }

                if (hasError) return;

                if (editingId) {
                    const item = shortcuts.find(x => x.id === editingId);
                    if (item) {
                        item.name = nameVal;
                        item.key = key;
                        item.isMacro = isMacro;
                        item.clickType = !isMacro ? clickTypeVal : undefined;
                        item.x = !isMacro ? posX : undefined;
                        item.y = !isMacro ? posY : undefined;
                        item.isLoop = isMacro ? isLoop : false;
                        item.loopDelay = isMacro ? loopDelayVal : undefined;
                        item.steps = isMacro ? macroSteps : undefined;
                    }
                } else {
                    shortcuts.push({
                        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
                        name: nameVal,
                        key,
                        isMacro,
                        clickType: !isMacro ? clickTypeVal : undefined,
                        x: !isMacro ? posX : undefined,
                        y: !isMacro ? posY : undefined,
                        isLoop: isMacro ? isLoop : false,
                        loopDelay: isMacro ? loopDelayVal : undefined,
                        steps: isMacro ? macroSteps : undefined
                    });
                }

                saveData();
                renderList();
                renderFloatingButtons();
                currentActiveModal = null;
                modal.remove();
            };
        }

        document.body.appendChild(modal);
        renderModalBody();
    }

    document.querySelector('#sc-add').onclick = () => openModal();

    function stopRecordingAndRestoreModal() {
        isRecording = false;
        lastRecordTime = 0;
        globalRecOverlay.style.display = 'none';
        globalRecBanner.style.display = 'none';
        if (currentActiveModal) {
            currentActiveModal.style.display = 'flex';
            const container = currentActiveModal.querySelector('#sc-macro-container');
            if (container) {
                const macroSteps = tempRecordedSteps;
                container.innerHTML = '';
                if (macroSteps.length === 0) {
                    container.innerHTML = `<div style="font-size:11px; color:var(--sc-text-muted); padding: 8px; text-align:center;">Chưa có bước nào. Bấm record hoặc thêm nhanh từ Click đơn có sẵn!</div>`;
                    return;
                }
                macroSteps.forEach((step, index) => {
                    const row = document.createElement('div');
                    row.className = 'sc-macro-step';
                    row.dataset.x = step.x;
                    row.dataset.y = step.y;
                    row.dataset.clickType = step.clickType || 'left';

                    row.innerHTML = `
                        <input type="number" step="0.1" min="0" class="sc-step-delay" value="${step.delay !== undefined ? step.delay : 0}">
                        <div class="sc-step-info">📍 [${Math.round(step.x)}, ${Math.round(step.y)}] (${step.clickType || 'left'})</div>
                        <button class="sc-btn-del-step" title="Xóa">✕</button>
                    `;
                    row.querySelector('.sc-btn-del-step').onclick = () => {
                        tempRecordedSteps.splice(index, 1);
                        row.remove();
                    };
                    container.appendChild(row);
                });
            }
        }
    }

    document.querySelector('#sc-global-rec-stop').onclick = () => {
        stopRecordingAndRestoreModal();
    };

    /* =========================================================
        RENDER LIST
    ========================================================= */
    const clickTypeLabels = {
        left: 'Click Trái',
        double: 'Click Đúp',
        right: 'Click Phải',
        ctrl: 'Ctrl + Click',
        shift: 'Shift + Click',
        alt: 'Alt + Click'
    };

    function renderList() {
        const list = document.querySelector('#sc-list');
        list.innerHTML = '';

        if (!shortcuts.length) {
            list.innerHTML = `<div class="sc-empty">Chưa có phím tắt hoặc macro nào được tạo.</div>`;
            return;
        }

        shortcuts.forEach(shortcut => {
            const item = document.createElement('div');
            item.className = 'sc-shortcut-item';
            
            let icon = '⚡';
            let desc = '';

            if (shortcut.isMacro) {
                icon = shortcut.isLoop ? '🔄' : '🔗';
                desc = shortcut.isLoop ? `Macro lặp (${shortcut.steps.length} bước)` : `Macro chuỗi (${shortcut.steps.length} bước)`;
            } else {
                icon = '⚡';
                desc = `${clickTypeLabels[shortcut.clickType || 'left']}`;
            }

            const hasName = shortcut.name && shortcut.name.trim() !== '';
            const displayName = hasName ? shortcut.name : shortcut.key;

            item.innerHTML = `
                <div class="sc-shortcut-info">
                    <div class="sc-shortcut-title-row" style="${hasName ? '' : 'display: none'}" title="${displayName}">${displayName}</div>
                    <div class="sc-shortcut-key ${shortcut.isMacro ? 'macro' : ''}">
                        ${icon} ${shortcut.key} - <span style="font-weight:400; color:var(--sc-text-muted);">${desc}</span>
                    </div>
                </div>
                <div class="sc-actions">
                    <button class="sc-action-btn sc-edit" title="Sửa">✏️</button>
                    <button class="sc-action-btn sc-delete" title="Xóa">🗑️</button>
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
            // 1. Render nút cho Click đơn
            if (!shortcut.isMacro && shortcut.x !== undefined && shortcut.y !== undefined) {
                createFloatingElement({
                    x: shortcut.x,
                    y: shortcut.y,
                    label: shortcut.name ? `${shortcut.name} (${shortcut.key})` : shortcut.key,
                    title: shortcut.name || shortcut.key,
                    isMacroStep: false,
                    onUpdatePosition: (newX, newY) => {
                        shortcut.x = newX;
                        shortcut.y = newY;
                        saveData();
                    },
                    onClick: () => {
                        if (isEnabled) executeShortcut(shortcut);
                    }
                });
            }

            // 2. Render nút nổi riêng biệt cho từng bước của Macro
            if (shortcut.isMacro && Array.isArray(shortcut.steps)) {
                shortcut.steps.forEach((step, index) => {
                    if (step.x === undefined || step.y === undefined) {
                        step.x = window.innerWidth / 2 + (index * 15);
                        step.y = window.innerHeight / 2 + (index * 15);
                    }
                    const stepName = shortcut.name ? shortcut.name : shortcut.key;
                    createFloatingElement({
                        x: step.x,
                        y: step.y,
                        label: `B${index + 1}: ${stepName}`,
                        title: `Macro: ${stepName} - Bước ${index + 1}`,
                        isMacroStep: true,
                        onUpdatePosition: (newX, newY) => {
                            step.x = newX;
                            step.y = newY;
                            saveData();
                        },
                        onClick: () => {
                            if (isEnabled) {
                                executePointClick(step.x, step.y, step.clickType);
                            }
                        }
                    });
                });
            }
        });
    }

    function createFloatingElement({ x, y, label, title, isMacroStep, onUpdatePosition, onClick }) {
        const wrapper = document.createElement('div');
        wrapper.className = `sc-target-wrapper ${!isEnabled ? 'disabled' : ''}`;
        wrapper.style.left = x + 'px';
        wrapper.style.top = y + 'px';

        const crosshair = document.createElement('div');
        crosshair.className = 'sc-target-crosshair';

        const button = document.createElement('div');
        button.className = `sc-floating-button ${isMacroStep ? 'sc-macro-step-btn' : ''}`;
        button.innerText = label;
        if (title) button.title = title;

        wrapper.appendChild(crosshair);
        wrapper.appendChild(button);
        document.body.appendChild(wrapper);

        makeDraggable(wrapper, button, crosshair, (newX, newY) => {
            onUpdatePosition(newX, newY);
        });

        button.addEventListener('click', () => {
            if (button.dataset.dragged === 'true') {
                button.dataset.dragged = 'false';
                return;
            }
            onClick();
        });
    }

    /* =========================================================
        DRAG LOGIC FOR TARGETS
    ========================================================= */
    function makeDraggable(wrapper, button, crosshair, onDragEnd) {
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

            onDragEnd(newX, newY);
        });

        document.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            button.style.cursor = 'move';
            crosshair.style.display = 'none';
        });
    }

    /* =========================================================
        VISUAL FEEDBACK HELPERS
    ========================================================= */
    function triggerVisualFeedback(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'sc-click-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 400);
    }

    /* =========================================================
        EXECUTION LOGIC WITH COUNTDOWN
    ========================================================= */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function sleepWithCountdown(seconds, currentLoopId) {
        if (seconds <= 0) return;
        let remaining = seconds;
        stopBtn.innerText = `⏳ Đợi vòng tiếp: ${remaining.toFixed(1)}s (ESC để dừng)`;

        return new Promise(resolve => {
            countdownTimer = setInterval(() => {
                remaining -= 0.1;
                if (activeLoopId !== currentLoopId || remaining <= 0 || !isEnabled) {
                    clearInterval(countdownTimer);
                    countdownTimer = null;
                    resolve();
                } else {
                    stopBtn.innerText = `⏳ Đợi vòng tiếp: ${remaining.toFixed(1)}s (ESC để dừng)`;
                }
            }, 100);
        });
    }

    function executePointClick(x, y, clickType = 'left') {
        if (x === undefined || y === undefined) return;

        triggerVisualFeedback(x, y);

        const elements = document.elementsFromPoint(x, y);
        const targetEl = elements.find(el => !el.closest('#shortcut-console') && !el.closest('.sc-target-wrapper') && !el.closest('.sc-modal') && !el.closest('#sc-global-rec-banner') && !el.closest('#sc-global-rec-overlay'));

        if (targetEl) {
            const type = clickType || 'left';

            if (type === 'right') {
                ['mousedown', 'mouseup', 'contextmenu'].forEach(eventType => {
                    targetEl.dispatchEvent(new MouseEvent(eventType, {
                        view: window, bubbles: true, cancelable: true, button: 2, buttons: 2, clientX: x, clientY: y
                    }));
                });
            } else if (type === 'double') {
                for (let i = 0; i < 2; i++) {
                    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                        targetEl.dispatchEvent(new MouseEvent(eventType, {
                            view: window, bubbles: true, cancelable: true, detail: i + 1, clientX: x, clientY: y
                        }));
                    });
                }
                targetEl.dispatchEvent(new MouseEvent('dblclick', {
                    view: window, bubbles: true, cancelable: true, clientX: x, clientY: y
                }));
            } else if (['ctrl', 'shift', 'alt'].includes(type)) {
                const modKeyMap = {
                    ctrl: { key: 'Control', code: 'ControlLeft', ctrlKey: true, name: 'ctrlKey' },
                    shift: { key: 'Shift', code: 'ShiftLeft', shiftKey: true, name: 'shiftKey' },
                    alt: { key: 'Alt', code: 'AltLeft', altKey: true, name: 'altKey' }
                };
                const m = modKeyMap[type];

                targetEl.dispatchEvent(new KeyboardEvent('keydown', { key: m.key, code: m.code, bubbles: true, cancelable: true, [m.name]: true }));
                ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                    targetEl.dispatchEvent(new MouseEvent(eventType, { view: window, bubbles: true, cancelable: true, clientX: x, clientY: y, ctrlKey: m.ctrlKey || false, shiftKey: m.shiftKey || false, altKey: m.altKey || false }));
                });
                targetEl.dispatchEvent(new KeyboardEvent('keyup', { key: m.key, code: m.code, bubbles: true, cancelable: true }));
            } else {
                ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                    targetEl.dispatchEvent(new MouseEvent(eventType, {
                        view: window, bubbles: true, cancelable: true, clientX: x, clientY: y
                    }));
                });
            }
        }
    }

    async function executeShortcut(shortcut) {
        if (!shortcut || isExecuting) return;
        isExecuting = true;

        if (!shortcut.isMacro) {
            executePointClick(shortcut.x, shortcut.y, shortcut.clickType);
            isExecuting = false;
            return;
        }

        if (shortcut.isLoop) {
            const currentLoopId = Date.now().toString();
            activeLoopId = currentLoopId;
            stopBtn.style.display = 'flex';
            stopBtn.innerText = `⏹ DỪNG MACRO (ESC)`;

            while (activeLoopId === currentLoopId && isEnabled) {
                for (let i = 0; i < shortcut.steps.length; i++) {
                    if (activeLoopId !== currentLoopId || !isEnabled) break;
                    const step = shortcut.steps[i];

                    if (step.delay > 0) {
                        stopBtn.innerText = `⏳ Bước ${i + 1}/${shortcut.steps.length} (Đợi ${step.delay}s)...`;
                        await sleep(step.delay * 1000);
                    }
                    if (activeLoopId !== currentLoopId || !isEnabled) break;

                    executePointClick(step.x, step.y, step.clickType);
                }

                if (activeLoopId !== currentLoopId || !isEnabled) break;
                if (shortcut.loopDelay > 0) {
                    await sleepWithCountdown(shortcut.loopDelay, currentLoopId);
                }
            }

            if (activeLoopId === currentLoopId) {
                stopActiveLoop();
            }
        } else {
            for (let i = 0; i < shortcut.steps.length; i++) {
                if (!isEnabled) break;
                const step = shortcut.steps[i];
                if (step.delay > 0) await sleep(step.delay * 1000);
                if (!isEnabled) break;

                executePointClick(step.x, step.y, step.clickType);
            }
        }

        isExecuting = false;
    }

    /* =========================================================
        GLOBAL EVENT LISTENERS (RECORD MACRO)
    ========================================================= */
    globalRecOverlay.addEventListener('click', event => {
        if (!isRecording) return;
        
        event.preventDefault();
        event.stopPropagation();

        const now = Date.now();
        const delayMs = lastRecordTime === 0 ? 0 : (now - lastRecordTime);
        lastRecordTime = now;
        const delaySec = Math.max(0, parseFloat((delayMs / 1000).toFixed(1)));

        const x = event.clientX;
        const y = event.clientY;

        let detectedClickType = 'left';
        if (event.button === 2) {
            detectedClickType = 'right';
        } else if (event.ctrlKey) {
            detectedClickType = 'ctrl';
        } else if (event.shiftKey) {
            detectedClickType = 'shift';
        } else if (event.altKey) {
            detectedClickType = 'alt';
        }

        triggerVisualFeedback(x, y);

        tempRecordedSteps.push({
            x: x,
            y: y,
            clickType: detectedClickType,
            delay: delaySec
        });

    }, true);

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            if (isRecording) {
                stopRecordingAndRestoreModal();
                return;
            }
            if (activeLoopId) {
                stopActiveLoop();
                return;
            }
            updateSystemStatus(!isEnabled);
            return;
        }

        if (isRecording) return;

        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
            return;
        }

        if (!isEnabled || isExecuting) return;

        const pressedKey = normalizeKey(event);
        const matched = shortcuts.find(s => s.key === pressedKey);
        if (matched) {
            event.preventDefault();
            executeShortcut(matched);
        }
    }, true);

    // Initial Render
    renderList();
    renderFloatingButtons();
})();
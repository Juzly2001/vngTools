(function() {
    // ==========================
    // HÀM HỖ TRỢ & COOLDOWN
    // ==========================
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    let actionLocked = false;
    const ACTION_COOLDOWN = 2000; // 2 giây

    const getDelay = () => {
        const el = document.getElementById("delayInput");
        return Math.max(50, parseInt(el?.value || "200", 10));
    };

    async function selectDropdownChooseFirst(labelText, optionText) {
        const label = [...document.querySelectorAll(".fd-ticket-col label")]
            .find(l => l.innerText.trim().startsWith(labelText));
        if (!label) return false;
        
        const col = label.closest(".fd-ticket-col");
        const trigger = col.querySelector(".ember-basic-dropdown-trigger");
        if (!trigger) return false;

        ["mousedown", "mouseup", "click"].forEach(evt =>
            trigger.dispatchEvent(new MouseEvent(evt, { bubbles: true }))
        );
        await sleep(getDelay());

        const searchInput = document.querySelector(".ember-power-select-search-input");
        if (!searchInput) return false;

        searchInput.focus();
        searchInput.value = optionText || "";
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        await sleep(getDelay());

        const opt = document.querySelector(".ember-power-select-option");
        if (!opt) return false;

        ["mousedown", "mouseup", "click"].forEach(evt =>
            opt.dispatchEvent(new MouseEvent(evt, { bubbles: true }))
        );
        return true;
    }

    // ==========================
    // KHỞI TẠO GIAO DIỆN THEO CODE 2
    // ==========================
    const ID = "mini-excel-tool";
    const OLD = document.getElementById(ID);
    if (OLD) OLD.remove();

    const box = document.createElement("div");
    box.id = ID;
    
    // Khôi phục vị trí đã lưu của container nếu có
    const CONTAINER_POS_KEY = "TICKET_SUPPORT_CONTAINER_POS_V1";
    let savedPos = null;
    try { savedPos = JSON.parse(localStorage.getItem(CONTAINER_POS_KEY)); } catch(_) {}

    let initialCss = "position:fixed;z-index:999999;background:#fff;border:1px solid #d0d7de;box-shadow:0 8px 24px rgba(0,0,0,0.15);border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:13px;width:520px;min-width:440px;overflow:hidden;display:flex;flex-direction:column;";
    if (savedPos && typeof savedPos.left === "string" && typeof savedPos.top === "string") {
        initialCss += `left:${savedPos.left};top:${savedPos.top};`;
    } else {
        initialCss += "top:20px;left:20px;";
    }
    box.style.cssText = initialCss;

    box.innerHTML = `
    <style>
        #mini-excel-tool * { box-sizing: border-box; }
        
        /* Header / Nút Toggle kiểu Code 2 */
        #mini-header {
            width: 100%; padding: 10px 12px; cursor: move; border: none;
            background: linear-gradient(135deg, #0969da, #024ea2); color: #fff;
            font-size: 15px; font-weight: 600; border-top-left-radius: 10px; border-top-right-radius: 10px;
            text-align: left; display: flex; align-items: center; justify-content: space-between;
            user-select: none; position: relative;
        }
        #mini-header .ticket-title { display: flex; align-items: center; gap: 6px; }
        
        .header-actions { display: flex; align-items: center; gap: 6px; }
        .header-actions button {
            height: 28px; padding: 0 8px; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px;
            background: rgba(255,255,255,0.15); color: #fff; font-size: 11px; font-weight: 600;
            cursor: pointer; transition: background 0.15s;
        }
        .header-actions button:hover { background: rgba(255,255,255,0.3); }
        #headerResolve { background: #0284c7 !important; border-color: #38bdf8 !important; }
        #headerResolveAndCreate { background: #1f883d !important; border-color: #2ea043 !important; }
        #ticketSettingsBtn { width: 28px !important; padding: 0 !important; font-size: 14px !important; display: flex; align-items: center; justify-content: center; }

        /* Sheet Bar */
        #ticket-sheetbar {
            padding: 8px 10px; display: flex; align-items: center; gap: 6px;
            border-bottom: 1px solid #d0d7de; background: #f6f8fa;
        }
        #sheetLinkInput {
            height: 34px; flex: 1; min-width: 0; border: 1px solid #d0d7de; border-radius: 6px;
            padding: 0 10px; background: #fff; outline: none; font-size: 13px; color: #24292f;
        }
        #sheetLinkInput:focus { border-color: #0969da; box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.15); }
        #sheetReloadBtn { width: 34px; height: 34px; border: 1px solid #d0d7de; border-radius: 6px; background: #fff; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }

        /* Table Shell & Body */
        #ticket-table-shell { max-height: 55vh; overflow-y: auto; background: #fff; }
        #mini-excel-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        #mini-excel-table col:nth-child(1){ width: 22%; }
        #mini-excel-table col:nth-child(2){ width: 32%; }
        #mini-excel-table col:nth-child(3){ width: 20%; }
        #mini-excel-table col:nth-child(4){ width: 18%; }
        #mini-excel-table col:nth-child(5){ width: 8%; }

        #mini-excel-table thead th {
            position: sticky; top: 0; z-index: 10; height: 34px; padding: 0 8px !important;
            background: #f6f8fa !important; color: #57606a !important; border-bottom: 1px solid #d0d7de !important;
            font-size: 11px !important; font-weight: 700 !important; text-align: left !important;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        #mini-excel-table thead th:nth-child(5) { text-align: center !important; font-size: 13px !important; }
        #mini-excel-table tbody td { height: 38px; padding: 4px 6px !important; border-bottom: 1px solid #d0d7de !important; background: #fff; }
        #mini-excel-table tbody tr:hover td { background: #f6f8fa; }
        #mini-excel-table td input {
            width: 100%; height: 28px; border: 1px solid transparent !important; border-radius: 4px !important;
            padding: 0 6px !important; background: transparent !important; color: #24292f; font-size: 12px; outline: none;
        }
        #mini-excel-table td input:hover { border-color: #d0d7de !important; background: #fff !important; }
        #mini-excel-table td input:focus { border-color: #0969da !important; background: #fff !important; box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.15); }
        
        .doAction {
            width: 26px !important; height: 26px !important; padding: 0 !important; border: 1px solid #cce5ff !important;
            border-radius: 4px !important; background: #ddf4ff !important; color: #0969da !important; font-size: 0 !important; cursor: pointer;
        }
        .doAction::after { content: '▶'; font-size: 11px; font-weight: 700; line-height: 1; }
        .doAction:hover { background: #0969da !important; color: #fff !important; border-color: #0969da !important; }

        /* Footer */
        #ticket-footer {
            height: 42px; display: flex; align-items: center; justify-content: space-between;
            padding: 0 10px; border-top: 1px solid #d0d7de; background: #f6f8fa;
        }
        #addRowBtn {
            height: 28px; padding: 0 10px; border: 1px solid #d0d7de; border-radius: 6px;
            background: #fff; color: #24292f; font-size: 12px; font-weight: 600; cursor: pointer;
        }
        #addRowBtn:hover { background: #f3f4f6; }
        #resolvedBadge {
            display: flex; align-items: center; gap: 4px; height: 26px; padding: 0 8px;
            border-radius: 20px; background: #dafbe1; color: #116329; font-size: 12px; font-weight: 700;
        }
        #resolved { width: 28px !important; border: 0 !important; background: transparent !important; padding: 0 !important; color: inherit !important; font-weight: 700; text-align: left !important; outline: none; }

        /* Context Menu & Settings */
        #ticket-row-menu {
            display: none; position: fixed; z-index: 1000001; min-width: 140px; padding: 4px;
            background: #fff; border: 1px solid #d0d7de; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        #ticket-row-menu.open { display: block; }
        #ticket-row-menu button {
            width: 100%; height: 30px; padding: 0 8px; border: 0; border-radius: 4px;
            background: transparent; color: #cf222e; font-size: 12px; font-weight: 600; text-align: left; cursor: pointer;
        }
        #ticket-row-menu button:hover { background: #ffebe9; }

        #ticket-settings {
            display: none; position: absolute; top: 48px; right: 10px; z-index: 100;
            background: #fff; border: 1px solid #d0d7de; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); padding: 12px; width: 240px;
        }
        #ticket-settings.open { display: block; }
        #ticket-settings .settings-title { font-size: 13px; font-weight: 700; color: #24292f; margin-bottom: 8px; }
        #ticket-settings label { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 6px 0; font-size: 12px; color: #57606a; }
        #ticket-settings input { height: 28px; border: 1px solid #d0d7de; border-radius: 4px; padding: 0 6px; font-size: 12px; outline: none; width: 110px; }
        #ticket-settings .settings-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 10px; padding-top: 8px; border-top: 1px solid #eaeef2; }
        #ticket-settings .settings-actions button { height: 28px; border: 1px solid #d0d7de; border-radius: 4px; background: #f6f8fa; color: #24292f; font-size: 11px; cursor: pointer; }
        #ticket-settings .settings-actions button:hover { background: #f3f4f6; }
        #ticket-resize-handle {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 18px;
            height: 18px;
            cursor: nwse-resize;
            z-index: 1000;
        }

        #ticket-resize-handle::after {
            content: "";
            position: absolute;
            right: 4px;
            bottom: 4px;
            width: 8px;
            height: 8px;
            border-right: 2px solid #8c959f;
            border-bottom: 2px solid #8c959f;
        }
    </style>

    <div id="mini-header">
        <strong class="ticket-title">⚡ Ticket Support</strong>
        <div class="header-actions">
            <button id="headerResolve" title="Ctrl + Q">Resolve</button>
            <button id="headerResolveAndCreate" title="Ctrl + Z">Resolve+Ticket</button>
            <button id="ticketSettingsBtn" title="Cài đặt">⚙</button>
        </div>
    </div>
    <div id="ticket-sheetbar">
        <input id="sheetLinkInput" placeholder="🔗 Dán link Google Sheet công khai...">
        <button id="sheetReloadBtn" title="Tải lại Google Sheet">🔄</button>
    </div>
    <div id="ticket-table-shell">
        <table id="mini-excel-table">
            <colgroup><col><col><col><col><col></colgroup>
            <thead>
                <tr>
                    <th>YÊU CẦU</th><th>CHI TIẾT</th><th>ĐỐI TÁC</th><th>GROUP</th><th>→</th>
                </tr>
            </thead>
            <tbody id="mini-excel-body">
                <tr>
                    <td><input value="Others"></td>
                    <td><input value="No support"></td>
                    <td><input value="None"></td>
                    <td><input value="Fanpage"></td>
                    <td style="text-align:center"><button class="doAction">▶</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div id="ticket-footer">
        <button id="addRowBtn">＋ Thêm dòng</button>
        <div id="resolvedBadge">✓ <input id="resolved" type="number" value="0" readonly></div>
    </div>
    <div id="ticket-row-menu"><button type="button" id="deleteContextRow">🗑 Xóa dòng này</button></div>
    <div id="ticket-settings">
        <div class="settings-title">Cài đặt công cụ</div>
        <label id="subjectWrap"><span>Subject</span><input id="subjectInput" value="PhuongNt32"></label>
        <label id="widthWrap"><span>Width</span><input id="widthInput" type="number" value="520"></label>
        <label id="heightWrap"><span>Height</span><input id="heightInput" type="number" value="444"></label>
        <div style="display:none"><label id="delayWrap">Delay<input id="delayInput" type="number" min="50" value="0"></label></div>
        <div class="settings-actions">
            <button id="importExcelBtn">Nhập Excel</button>
            <button id="resetTableBtn">Đặt lại</button>
        </div>
    </div>
    <div id="ticket-resize-handle" title="Kéo để thay đổi kích thước"></div>
    `;
    document.body.appendChild(box);

    // ==========================
    // XỬ LÝ LƯU TRẠNG THÁI UI & VỊ TRÍ
    // ==========================
    const settingsPanel = document.getElementById("ticket-settings");
    
    document.getElementById("ticketSettingsBtn").addEventListener("click", e => {
        e.stopPropagation();
        settingsPanel.classList.toggle("open");
    });
    document.addEventListener("mousedown", e => {
        if (!settingsPanel.contains(e.target) && !e.target.closest("#ticketSettingsBtn")) {
            settingsPanel.classList.remove("open");
        }
    });

    function saveTicketUIState(){
        const r = box.getBoundingClientRect();
        localStorage.setItem(CONTAINER_POS_KEY, JSON.stringify({
            left: r.left + "px", top: r.top + "px", width: box.offsetWidth, height: box.offsetHeight
        }));
    }

    try {
        const s = JSON.parse(localStorage.getItem(CONTAINER_POS_KEY) || "null");
        if(s){
            if(Number.isFinite(s.width)) box.style.width = Math.max(440, Math.min(s.width, window.innerWidth)) + "px";
            if(Number.isFinite(s.height)) box.style.height = Math.max(300, Math.min(s.height, window.innerHeight)) + "px";
        }
    } catch(_){}

    // ==========================
    // IMPORT EXCEL & GOOGLE SHEETS
    // ==========================
    const excelInput = document.createElement("input");
    excelInput.type = "file";
    excelInput.accept = ".xlsx,.xls";
    excelInput.style.display = "none";
    document.body.appendChild(excelInput);

    document.getElementById("importExcelBtn").onclick = () => excelInput.click();
    excelInput.onchange = async e => {
        const file = e.target.files[0];
        if (!file) return;
        if (!window.XLSX) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js";
            script.onload = () => processExcel(file);
            document.head.appendChild(script);
        } else {
            processExcel(file);
        }
        function processExcel(file) {
            const reader = new FileReader();
            reader.onload = evt => {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                const tbody = document.getElementById("mini-excel-body");
                json.forEach(row => {
                    const [yeuCau, chiTiet, doiTac, group] = row;
                    if (!yeuCau && !chiTiet) return;
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><input value="${yeuCau || ''}"></td>
                        <td><input value="${chiTiet || ''}"></td>
                        <td><input value="${doiTac || ''}"></td>
                        <td><input value="${group || ''}"></td>
                        <td style="text-align:center"><button class="doAction">▶</button></td>
                    `;
                    tbody.appendChild(tr);
                });
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const sheetInput = document.getElementById("sheetLinkInput");
    const reloadBtn = document.getElementById("sheetReloadBtn");

    function setReloadState(state) {
        if (state === "loading") {
            reloadBtn.innerHTML = "⏳"; reloadBtn.disabled = true;
        } else if (state === "success") {
            reloadBtn.innerHTML = "✅"; reloadBtn.disabled = true;
            setTimeout(() => { reloadBtn.innerHTML = "🔄"; reloadBtn.disabled = false; }, 1500);
        } else if (state === "error") {
            reloadBtn.innerHTML = "❌"; reloadBtn.disabled = true;
            setTimeout(() => { reloadBtn.innerHTML = "🔄"; reloadBtn.disabled = false; }, 1500);
        } else {
            reloadBtn.innerHTML = "🔄"; reloadBtn.disabled = false;
        }
    }

    const SHEET_KEY = "__mini_excel_sheet_link_global__";
    const savedLink = window.top.localStorage.getItem(SHEET_KEY);
    if (savedLink) {
        sheetInput.value = savedLink;
        setReloadState("loading");
        loadGoogleSheet(savedLink).then(ok => setReloadState(ok ? "success" : "error"));
    }

    let sheetTimer = null;
    sheetInput.addEventListener("input", () => {
        clearTimeout(sheetTimer);
        sheetTimer = setTimeout(() => {
            const url = sheetInput.value.trim();
            if (!url) {
                window.top.localStorage.removeItem(SHEET_KEY);
                document.getElementById("mini-excel-body").innerHTML = "";
                return;
            }
            window.top.localStorage.setItem(SHEET_KEY, url);
            loadGoogleSheet(url);
        }, 600);
    });

    async function loadGoogleSheet(url) {
        try {
            const match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
            if (!match) throw "Invalid link";
            const sheetId = match[1];
            const gidMatch = url.match(/gid=(\d+)/);
            const gid = gidMatch ? gidMatch[1] : "0";
            const jsonUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?gid=${gid}&tqx=out:json&nocache=${Date.now()}`;
            const res = await fetch(jsonUrl, { cache: "no-store" });
            if (!res.ok) throw "Fetch error";
            const text = await res.text();
            const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));
            const rows = json.table.rows;
            const tbody = document.getElementById("mini-excel-body");
            tbody.innerHTML = "";
            rows.forEach(r => {
                if (!r.c || r.c.length < 4) return;
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><input value="${r.c[0]?.v || ''}"></td>
                    <td><input value="${r.c[1]?.v || ''}"></td>
                    <td><input value="${r.c[2]?.v || ''}"></td>
                    <td><input value="${r.c[3]?.v || ''}"></td>
                    <td style="text-align:center"><button class="doAction">▶</button></td>
                `;
                tbody.appendChild(tr);
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    reloadBtn.addEventListener("click", async () => {
        const url = sheetInput.value.trim();
        if (!url) return;
        setReloadState("loading");
        const ok = await loadGoogleSheet(url);
        setReloadState(ok ? "success" : "error");
    });

    // ==========================
    // KÍCH THƯỚC & SCROLL
    // ==========================


    const resizeHandle = document.getElementById("ticket-resize-handle");

    const widthInput = document.getElementById("widthInput");
    const heightInput = document.getElementById("heightInput");

    function syncSizeInputs() {
        const rect = box.getBoundingClientRect();
        const active = document.activeElement;

        // Không ghi đè khi người dùng đang nhập
        if (active !== widthInput) {
            widthInput.value = Math.round(rect.width);
        }

        if (active !== heightInput) {
            heightInput.value = Math.round(rect.height);
        }
    }

    // Đồng bộ ngay khi mở tool
    syncSizeInputs();

    // Luôn theo dõi kích thước thật
    const sizeObserver = new ResizeObserver(() => {
        syncSizeInputs();
    });

    sizeObserver.observe(box);
    

    const MIN_WIDTH = 445;
    const MIN_HEIGHT = 445;

    // ==========================
    // ÁP DỤNG WIDTH
    // ==========================
    function applyWidth() {
        let width = parseInt(widthInput.value, 10);

        // Nếu để trống / nhập không hợp lệ → lấy size hiện tại
        if (!Number.isFinite(width)) {
            width = Math.round(box.getBoundingClientRect().width);
        }

        // Không cho nhỏ hơn 445
        width = Math.max(MIN_WIDTH, Math.min(width, window.innerWidth));

        box.style.width = width + "px";
        widthInput.value = width;

        saveTicketUIState();
    }

    // ==========================
    // ÁP DỤNG HEIGHT
    // ==========================
    function applyHeight() {
        let height = parseInt(heightInput.value, 10);

        // Nếu để trống / nhập không hợp lệ → lấy size hiện tại
        if (!Number.isFinite(height)) {
            height = Math.round(box.getBoundingClientRect().height);
        }

        // Không cho nhỏ hơn 445
        height = Math.max(MIN_HEIGHT, Math.min(height, window.innerHeight));

        box.style.height = height + "px";
        heightInput.value = height;

        saveTicketUIState();
    }


    // Click ra ngoài → áp dụng
    widthInput.addEventListener("change", applyWidth);
    heightInput.addEventListener("change", applyHeight);


    // Nhấn Enter → áp dụng ngay
    widthInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            applyWidth();
            widthInput.blur();
        }
    });

    heightInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            applyHeight();
            heightInput.blur();
        }
    });
    
    // ==========================
    // RESIZE BẰNG KÉO CHUỘT
    // ==========================

    let isResizing = false;
    let resizeStartX = 0;
    let resizeStartY = 0;
    let resizeStartWidth = 0;
    let resizeStartHeight = 0;

    resizeHandle.addEventListener("mousedown", e => {

        e.preventDefault();
        e.stopPropagation();

        isResizing = true;

        resizeStartX = e.clientX;
        resizeStartY = e.clientY;

        resizeStartWidth = box.offsetWidth;
        resizeStartHeight = box.offsetHeight;

        document.body.style.userSelect = "none";
        document.body.style.cursor = "nwse-resize";
    });


    document.addEventListener("mousemove", e => {

        if (!isResizing) return;

        const rect = box.getBoundingClientRect();

        let newWidth =
            resizeStartWidth + (e.clientX - resizeStartX);

        let newHeight =
            resizeStartHeight + (e.clientY - resizeStartY);

        // Không cho nhỏ quá
        newWidth = Math.max(MIN_WIDTH, newWidth);
        newHeight = Math.max(MIN_HEIGHT, newHeight);

        // Không cho vượt khỏi màn hình
        newWidth = Math.min(
            newWidth,
            window.innerWidth - rect.left
        );

        newHeight = Math.min(
            newHeight,
            window.innerHeight - rect.top
        );

        box.style.width = newWidth + "px";
        box.style.height = newHeight + "px";

        // Đồng bộ Settings
        widthInput.value = Math.round(newWidth);
        heightInput.value = Math.round(newHeight);
    });


    document.addEventListener("mouseup", () => {

        if (!isResizing) return;

        isResizing = false;

        document.body.style.userSelect = "";
        document.body.style.cursor = "";

        saveTicketUIState();
    });


    const miniBody = document.getElementById("mini-excel-body");

    // ==========================
    // THAO TÁC HÀNG & SỰ KIỆN CLICK ▶
    // ==========================
    document.getElementById("addRowBtn").onclick = () => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input placeholder=""></td>
            <td><input placeholder=""></td>
            <td><input placeholder=""></td>
            <td><input placeholder=""></td>
            <td style="text-align:center"><button class="doAction">▶</button></td>
        `;
        miniBody.appendChild(tr);
    };

    box.addEventListener("click", async e => {
        if (e.target.classList.contains("doAction")) {
            if (actionLocked) return;
            actionLocked = true;
            document.querySelectorAll(".doAction").forEach(b => b.disabled = true);
            try {
                await new Promise(resolve => {
                    const btn = document.querySelector('.split-button.resolve-action.custom-split-dropdown[role="button"]');
                    if (!btn) { resolve(); return; }
                    btn.click();
                    const simulateClick = el => ['mousedown', 'mouseup', 'click'].forEach(evt => el.dispatchEvent(new MouseEvent(evt, { bubbles: true })));
                    let tries = 0;
                    const timer = setInterval(() => {
                        tries++;
                        const options = document.querySelectorAll('.ember-power-select-option');
                        for (const opt of options) {
                            if (opt.innerText.replace(/\s+/g, ' ').trim().toLowerCase() === 'resolve and create ticket in freshdesk') {
                                simulateClick(opt);
                                clearInterval(timer);
                                resolve();
                                break;
                            }
                        }
                        if (tries > 50) { clearInterval(timer); resolve(); }
                    }, 200);
                });

                const tr = e.target.closest("tr");
                const yeuCau = tr.children[0].querySelector("input").value.trim();
                const chiTiet = tr.children[1].querySelector("input").value.trim();
                const doiTac = tr.children[2].querySelector("input").value.trim();
                const group = tr.children[3].querySelector("input").value.trim();
                const subjVal = document.getElementById("subjectInput").value.trim();

                const waitForLabel = async (labelText, timeout = 5000) => {
                    let elapsed = 0;
                    while (elapsed < timeout) {
                        const label = [...document.querySelectorAll(".fd-ticket-col label")]
                            .find(l => l.innerText.trim().startsWith(labelText));
                        if (label) return label;
                        await new Promise(r => setTimeout(r, 100));
                        elapsed += 100;
                    }
                    return null;
                };

                await waitForLabel("Yêu cầu");
                await waitForLabel("Chi tiết vấn đề");
                await waitForLabel("Đối tác");
                await waitForLabel("Group");

                const subj = document.querySelector("#Subject");
                if (subj) {
                    subj.value = subjVal;
                    subj.dispatchEvent(new Event("input", { bubbles: true }));
                }

                await selectDropdownChooseFirst("Yêu cầu", yeuCau);
                await selectDropdownChooseFirst("Chi tiết vấn đề", chiTiet);
                await selectDropdownChooseFirst("Đối tác", doiTac);
                await selectDropdownChooseFirst("Group", group);
            } finally {
                setTimeout(() => {
                    actionLocked = false;
                    document.querySelectorAll(".doAction").forEach(b => b.disabled = false);
                }, ACTION_COOLDOWN);
            }
        }
    });

    // Context Menu (Chuột phải xóa dòng)
    const rowMenu = document.getElementById("ticket-row-menu");
    const deleteContextRow = document.getElementById("deleteContextRow");
    let contextRow = null;

    const closeRowMenu = () => { rowMenu.classList.remove("open"); contextRow = null; };

    miniBody.addEventListener("contextmenu", e => {
        const tr = e.target.closest("tr");
        if (!tr || !miniBody.contains(tr)) return;
        e.preventDefault();
        contextRow = tr;
        rowMenu.classList.add("open");
        rowMenu.style.left = Math.min(e.clientX, window.innerWidth - 150) + "px";
        rowMenu.style.top = Math.min(e.clientY, window.innerHeight - 50) + "px";
    });

    deleteContextRow.addEventListener("click", () => {
        if (contextRow) contextRow.remove();
        closeRowMenu();
    });

    document.addEventListener("mousedown", e => { if (!rowMenu.contains(e.target)) closeRowMenu(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeRowMenu(); });

    // Các nút chức năng hệ thống
    if (!window.__resolveBound) {
        window.__resolveBound = true;
        document.addEventListener("click", e => {
            if (e.target.closest("#headerResolve")) {
                const realBtn = document.querySelector(".split-button-resolve");
                if (realBtn) realBtn.click();
            }
        });
    }

    document.getElementById("headerResolveAndCreate").addEventListener("click", () => {
        const targetBtn = document.querySelector('button[aria-label="Resolve and create ticket"]');
        if (targetBtn) targetBtn.click();
    });

    const resolvedInput = document.getElementById('resolved');
    document.addEventListener('click', e => {
        const btn = e.target.closest('button[aria-label="Resolve and create ticket"]');
        if (!btn || !resolvedInput) return;
        setTimeout(() => { resolvedInput.value = (+resolvedInput.value || 0) + 1; }, 0);
    }, true);

    document.getElementById("resetTableBtn").onclick = () => {
        miniBody.innerHTML = `
            <tr>
                <td><input value="Others"></td>
                <td><input value="No support"></td>
                <td><input value="None"></td>
                <td><input value="Fanpage"></td>
                <td style="text-align:center"><button class="doAction">▶</button></td>
            </tr>
        `;
    };

    // Phím tắt toàn cục
    if (window.__ticketToolHotkeyHandler) {
        window.removeEventListener("keydown", window.__ticketToolHotkeyHandler, true);
    }
    window.__ticketToolHotkeyHandler = e => {
        const key = String(e.key || "").toLowerCase();
        if (!(e.ctrlKey || e.metaKey)) return;
        if (key === "x") {
            e.preventDefault();
            const hidden = box.style.display === "none";
            box.style.setProperty("display", hidden ? "flex" : "none", "important");
        }
        if (key === "q") {
            e.preventDefault();
            document.querySelector(".split-button-resolve")?.click();
        }
    };
    window.addEventListener("keydown", window.__ticketToolHotkeyHandler, true);

    document.addEventListener("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
            e.preventDefault();
            document.querySelector('button[aria-label="Resolve and create ticket"]')?.click();
        }
    }, true);

    // Kéo thả cửa sổ (Draggable) chuẩn Code 2
    let isDragging = false, offsetX, offsetY;
    const header = document.getElementById("mini-header");
    
    header.addEventListener("mousedown", (e) => {
        if (e.target.closest("button")) return;
        isDragging = true;
        const rect = box.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = "none";
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            box.style.left = (e.clientX - offsetX) + "px";
            box.style.top = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = "";
            saveTicketUIState();
        }
    });
})();
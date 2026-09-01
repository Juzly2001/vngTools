(() => {
    let positiveMsg = localStorage.getItem("__autoReply_positiveMsg");
    let negativeMsg = localStorage.getItem("__autoReply_negativeMsg");

    const delay = ms => new Promise(r => setTimeout(r, ms));

    function playBeep() {
        if (!soundOn) return;
        const ctx = new(window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 800;
        gain.gain.value = 0.15;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    }

    let repliedCount = 0;
    let replyLimit = 100;
    let limitEnabled = false;

    function formatLimitText() {
        return limitEnabled ? `${repliedCount} / ${replyLimit}` : `${repliedCount} / -`;
    }

    if (!document.getElementById("__sheetSidebar_root")) {
        const STORAGE_KEY_LINK = "gsheet_saved_url";
        const STORAGE_KEY_COL = "gsheet_saved_col";

        const sheetSidebar = document.createElement("div");
        sheetSidebar.id = "__sheetSidebar_root";
        Object.assign(sheetSidebar.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "720px",
            height: "100vh",
            zIndex: 2147483646,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
            boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
            borderRight: "1px solid rgba(0,0,0,0.1)",
            boxSizing: "border-box",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            transform: "translateX(-100%)",
            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "13px"
        });

        const toggleSidebarBtn = document.createElement("div");
        toggleSidebarBtn.innerText = "📊";
        toggleSidebarBtn.title = "Mở bảng Google Sheet";
        Object.assign(toggleSidebarBtn.style, {
            position: "absolute",
            right: "-36px",
            top: "100px",
            width: "36px",
            height: "50px",
            background: "linear-gradient(135deg, #107c41, #1f9a55)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "0 10px 10px 0",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "4px 0 10px rgba(0,0,0,0.15)",
            zIndex: 2147483647
        });

        let isSidebarOpen = false;
        toggleSidebarBtn.onclick = () => {
            isSidebarOpen = !isSidebarOpen;
            sheetSidebar.style.transform = isSidebarOpen ? "translateX(0)" : "translateX(-100%)";
            toggleSidebarBtn.innerText = isSidebarOpen ? "❮" : "📊";
        };
        sheetSidebar.appendChild(toggleSidebarBtn);

        const sbHeader = document.createElement("div");
        sbHeader.style.marginBottom = "12px";
        sbHeader.innerHTML = `<div style="font-size:16px; font-weight:bold; color:#107c41; display:flex; align-items:center; gap:6px;">📊 Google Sheet Import</div>`;
        sheetSidebar.appendChild(sbHeader);

        const inputGroup = document.createElement("div");
        Object.assign(inputGroup.style, { display: "flex", gap: "6px", marginBottom: "8px" });

        const sheetInput = document.createElement("input");
        sheetInput.placeholder = "Dán link Google Sheet công khai...";
        sheetInput.value = localStorage.getItem(STORAGE_KEY_LINK) || "";
        Object.assign(sheetInput.style, {
            flex: "1", padding: "8px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "12px", outline: "none"
        });

        const sheetLoadBtn = document.createElement("button");
        sheetLoadBtn.innerText = "Tải Sheet";
        Object.assign(sheetLoadBtn.style, {
            padding: "8px 12px", background: "#107c41", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600"
        });

        inputGroup.append(sheetInput, sheetLoadBtn);
        sheetSidebar.appendChild(inputGroup);

        const colGroup = document.createElement("div");
        Object.assign(colGroup.style, { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" });

        const colLabel = document.createElement("span");
        colLabel.innerText = "Cột Paste:";
        colLabel.style.fontWeight = "600";

        const columnSelect = document.createElement("select");
        Object.assign(columnSelect.style, {
            flex: "1", padding: "6px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "12px", outline: "none", cursor: "pointer"
        });

        const defaultOpt = document.createElement("option");
        defaultOpt.value = "";
        defaultOpt.textContent = "-- Chọn cột --";
        columnSelect.appendChild(defaultOpt);

        columnSelect.onchange = () => {
            localStorage.setItem(STORAGE_KEY_COL, columnSelect.value);
        };

        colGroup.append(colLabel, columnSelect);
        sheetSidebar.appendChild(colGroup);

        const searchInput = document.createElement("input");
        searchInput.placeholder = "🔍 Tìm kiếm nội dung...";
        Object.assign(searchInput.style, {
            width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "12px", marginBottom: "10px", outline: "none", boxSizing: "border-box"
        });

        searchInput.oninput = () => {
            const keyword = searchInput.value.toLowerCase().trim();
            const rows = sheetTbody.querySelectorAll("tr");
            rows.forEach(tr => {
                const text = tr.textContent.toLowerCase();
                tr.style.display = text.includes(keyword) ? "" : "none";
            });
        };
        sheetSidebar.appendChild(searchInput);

        const sbInfo = document.createElement("div");
        Object.assign(sbInfo.style, { fontSize: "11px", color: "#666", marginBottom: "8px" });
        sbInfo.innerText = "🟢 Sẵn sàng...";
        sheetSidebar.appendChild(sbInfo);

        const tableContainer = document.createElement("div");
        Object.assign(tableContainer.style, {
            flex: "1",
            overflowY: "auto",
            overflowX: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            background: "#fff",
            boxShadow: "inset 0 0 4px rgba(0,0,0,0.03)"
        });

        const sheetTable = document.createElement("table");
        Object.assign(sheetTable.style, {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            tableLayout: "auto"
        });

        const sheetThead = document.createElement("thead");
        const sheetTbody = document.createElement("tbody");
        sheetTable.append(sheetThead, sheetTbody);
        tableContainer.appendChild(sheetTable);
        sheetSidebar.appendChild(tableContainer);

        document.body.appendChild(sheetSidebar);

        function parseCSV(text) {
            return text.split(/\r?\n/).map(row => {
                const cells = [];
                let match, re = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^,\"\r\n]+)|(?<=,|^)(?=,|$))/g;
                while ((match = re.exec(row)) !== null) {
                    if (match.index === re.lastIndex) re.lastIndex++;
                    let val = match[1] ? match[1].replace(/\"\"/g, '"') : match[2] || "";
                    cells.push(val.trim());
                }
                return cells;
            }).filter(row => row.some(cell => cell.length > 0));
        }

        // Đã sửa lại để không sử dụng iframe, tránh vi phạm CSP
        function fetchCSVNoHeaders(url) {
            if (typeof GM_xmlhttpRequest !== "undefined") {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: (res) => resolve(res.responseText),
                        onerror: (err) => reject(err)
                    });
                });
            }

            return fetch(url).then(res => {
                if (!res.ok) throw new Error("HTTP error " + res.status);
                return res.text();
            });
        }

        sheetLoadBtn.onclick = async () => {
            let url = sheetInput.value.trim();
            if (!url) return alert("Vui lòng nhập link Google Sheet!");

            localStorage.setItem(STORAGE_KEY_LINK, url);

            let csvUrl = url;
            if (url.includes("docs.google.com/spreadsheets")) {
                const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (matches && matches[1]) {
                    const sheetId = matches[1];
                    let gid = "0";
                    const gidMatch = url.match(/gid=([0-9]+)/);
                    if (gidMatch) gid = gidMatch[1];
                    csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
                }
            }

            sheetLoadBtn.innerText = "Đang tải...";
            sbInfo.innerText = "⏳ Đang kết nối Google Sheet...";

            try {
                const text = await fetchCSVNoHeaders(csvUrl);
                const rows = parseCSV(text);

                sheetThead.replaceChildren();
                sheetTbody.replaceChildren();
                columnSelect.replaceChildren();

                if (rows.length === 0) {
                    sbInfo.innerText = "⚠️ Sheet rỗng!";
                    sheetLoadBtn.innerText = "Tải Sheet";
                    return;
                }

                const headers = rows[0];
                headers.forEach((colName, idx) => {
                    const opt = document.createElement("option");
                    opt.value = idx;
                    opt.textContent = `Cột ${idx + 1}: ${colName || 'Không tên'}`;
                    columnSelect.appendChild(opt);
                });

                const savedCol = localStorage.getItem(STORAGE_KEY_COL);
                if (savedCol !== null && parseInt(savedCol, 10) < headers.length) {
                    columnSelect.value = savedCol;
                } else {
                    columnSelect.value = headers.length > 1 ? "1" : "0";
                    localStorage.setItem(STORAGE_KEY_COL, columnSelect.value);
                }

                const trHead = document.createElement("tr");
                const thPaste = document.createElement("th");
                thPaste.innerText = "Paste";
                Object.assign(thPaste.style, {
                    padding: "8px",
                    background: "#f3f4f6",
                    borderBottom: "2px solid #d1d5db",
                    width: "42px",
                    textAlign: "center",
                    position: "sticky",
                    top: "0",
                    zIndex: "2"
                });
                trHead.appendChild(thPaste);

                headers.forEach(colText => {
                    const th = document.createElement("th");
                    th.innerText = colText;
                    Object.assign(th.style, {
                        padding: "8px 10px",
                        background: "#f3f4f6",
                        borderBottom: "2px solid #d1d5db",
                        borderLeft: "1px solid #e5e7eb",
                        textAlign: "left",
                        fontWeight: "600",
                        color: "#374151",
                        position: "sticky",
                        top: "0",
                        zIndex: "2",
                        whiteSpace: "nowrap"
                    });
                    trHead.appendChild(th);
                });
                sheetThead.appendChild(trHead);

                for (let i = 1; i < rows.length; i++) {
                    const tr = document.createElement("tr");
                    const rowData = rows[i];

                    tr.onmouseenter = () => tr.style.background = "#f9fafb";
                    tr.onmouseleave = () => tr.style.background = "#fff";

                    const tdPaste = document.createElement("td");
                    Object.assign(tdPaste.style, {
                        textAlign: "center",
                        borderBottom: "1px solid #e5e7eb",
                        padding: "8px 4px",
                        verticalAlign: "top"
                    });

                    const pBtn = document.createElement("button");
                    pBtn.innerText = "📋";
                    pBtn.title = "Dán vào ô phản hồi";
                    Object.assign(pBtn.style, {
                        cursor: "pointer",
                        border: "1px solid #007aff",
                        background: "#f0f7ff",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        transition: "all 0.1s ease"
                    });

                    pBtn.onclick = () => {
                        const selectedColIndex = parseInt(columnSelect.value, 10);
                        const contentToPaste = rowData[selectedColIndex] || "";

                        if (!contentToPaste) {
                            sbInfo.innerText = `⚠️ Dòng ${i} cột đã chọn không có dữ liệu!`;
                            return;
                        }

                        const textarea = document.querySelector("textarea#developerResponse");
                        if (textarea) {
                            textarea.focus();
                            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
                            if (nativeSetter) nativeSetter.call(textarea, contentToPaste);
                            else textarea.value = contentToPaste;

                            textarea.dispatchEvent(new Event("input", { bubbles: true }));
                            sbInfo.innerText = `✅ Đã paste dòng ${i} vào ô trả lời!`;
                        } else {
                            alert("❌ Không tìm thấy ô textarea trả lời (textarea#developerResponse)!");
                        }
                    };

                    tdPaste.appendChild(pBtn);
                    tr.appendChild(tdPaste);

                    rowData.forEach(cellText => {
                        const td = document.createElement("td");
                        td.innerText = cellText;
                        
                        Object.assign(td.style, {
                            padding: "8px 10px",
                            borderBottom: "1px solid #e5e7eb",
                            borderLeft: "1px solid #f3f4f6",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            minWidth: "120px",
                            maxWidth: "280px",
                            lineHeight: "1.45",
                            color: "#1f2937",
                            verticalAlign: "top"
                        });
                        tr.appendChild(td);
                    });

                    sheetTbody.appendChild(tr);
                }

                if (searchInput.value) searchInput.dispatchEvent(new Event("input"));
                sbInfo.innerText = `✅ Đã tải ${rows.length - 1} dòng dữ liệu!`;

            } catch (err) {
                sbInfo.innerText = `❌ Lỗi: ${err.message}`;
            } finally {
                sheetLoadBtn.innerText = "Tải Sheet";
            }
        };

        if (sheetInput.value) sheetLoadBtn.click();
    }

    if (!document.getElementById("__autoReply_root")) {
        const root = document.createElement("div");
        root.id = "__autoReply_root";
        Object.assign(root.style, {
            position: "fixed",
            top: "40px",
            right: "16px",
            zIndex: 2147483647,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: "10px",
            fontFamily: "system-ui, Arial",
            width: "320px",
            boxSizing: "border-box",
        });
        document.body.appendChild(root);

        const toggleBtn = document.createElement("div");
        toggleBtn.innerText = "❮";
        Object.assign(toggleBtn.style, {
            position: "absolute",
            left: "-26px",
            top: "30px",
            width: "26px",
            height: "60px",
            background: "linear-gradient(135deg,#007aff,#00c6ff)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px 0 0 12px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,122,255,0.4)",
            transition: "0.2s"
        });
        root.appendChild(toggleBtn);

        const panel = document.createElement("div");
        Object.assign(panel.style, {
            position: "absolute",
            right: "100%",
            top: "40px",
            width: "600px",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px 0 16px 16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            padding: "14px",
            transform: "translateX(110%)",
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
            opacity: "0",
            border: "1px solid rgba(0,0,0,0.08)"
        });
        root.appendChild(panel);

        panel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div style="font-weight:600;font-size:14px;">⚙️ Config Reply</div>
                <div id="closePanelBtn" style="cursor:pointer;font-size:14px;padding:2px 6px;border-radius:6px;background:#eee;">✖</div>
            </div>

            <label style="font-size:12px;color:#666;">1–3⭐ (Negative)</label>
            <textarea spellcheck="false" id="msg_negative" style="margin-top: 6px;resize:none;width:100%;height:62px;border-radius:10px;border:1px solid #ddd;padding:6px;margin-bottom:10px;font-size:12px;"></textarea>

            <label style="font-size:12px;color:#666;">4–5⭐ (Positive)</label>
            <textarea spellcheck="false" id="msg_positive" style="margin-top: 6px;resize:none;width:100%;height:62px;border-radius:10px;border:1px solid #ddd;padding:6px;font-size:12px;"></textarea>

            <div style="display:flex; justify-content:flex-end;">
                <button id="saveMsgBtn" style="margin-top:12px;padding:10px 16px;width:16%;text-align: center;border:none;border-radius:10px;background:linear-gradient(135deg,#28a745,#20c997);color:#fff;cursor:pointer;font-weight:600;box-shadow:0 4px 10px rgba(40,167,69,0.3);">Save</button>
            </div>
            `;
        
        let panelOpen = false;

        function togglePanel(forceState = null) {
            panelOpen = forceState !== null ? forceState : !panelOpen;
            panel.style.transform = panelOpen ? "translateX(0)" : "translateX(110%)";
            panel.style.opacity = panelOpen ? "1" : "0";
            toggleBtn.style.display = panelOpen ? "none" : "flex";
            card.style.borderRadius = panelOpen ? "14px 14px 14px 0" : "14px";
        }

        toggleBtn.onclick = () => togglePanel();

        const closeBtn = panel.querySelector("#closePanelBtn");
        if (closeBtn) closeBtn.onclick = () => togglePanel(false);

        const negInput = panel.querySelector("#msg_negative");
        const posInput = panel.querySelector("#msg_positive");
        const saveBtn = panel.querySelector("#saveMsgBtn");

        negInput.value = negativeMsg;
        posInput.value = positiveMsg;

        saveBtn.onclick = () => {
            positiveMsg = posInput.value.trim();
            negativeMsg = negInput.value.trim();
            localStorage.setItem("__autoReply_positiveMsg", positiveMsg);
            localStorage.setItem("__autoReply_negativeMsg", negativeMsg);
            alert("✅ Saved");
        };

        const card = document.createElement("div");
        card.id = "__autoReply_card";
        Object.assign(card.style, {
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            borderRadius: "14px",
            border: "1px solid rgba(0,0,0,0.06)",
            padding: "14px 16px",
            color: "#111",
        });
        root.appendChild(card);

        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.style.marginBottom = "10px";
        const title = document.createElement("div");
        title.innerHTML = "<strong>⚡AppStore Support</strong>";
        title.style.fontSize = "15px";
        header.appendChild(title);
        const countText = document.createElement("div");
        countText.id = "__autoReply_countStatus";
        countText.innerText = `✅ Replied: ${formatLimitText()}`;
        Object.assign(countText.style, {
            fontSize: "13px",
            fontWeight: "600",
            color: "#007aff",
        });
        header.appendChild(countText);
        card.appendChild(header);

        const grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "1fr 1fr";
        grid.style.gap = "8px";
        card.appendChild(grid);

        const startBtn = document.createElement("button");
        startBtn.id = "__autoReply_start";
        startBtn.innerText = "🔍 Start reply.";
        Object.assign(startBtn.style, {
            gridColumn: "1 / span 2",
            padding: "10px",
            background: "#007aff",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 4px 10px rgba(0,122,255,0.25)",
        });
        grid.appendChild(startBtn);

        const btnSubmit = document.createElement("button");
        btnSubmit.id = "__autoReply_clickSubmit";
        btnSubmit.innerText = "▶️ Click Submit (Q)";
        Object.assign(btnSubmit.style, {
            padding: "8px", background: "#00b67a", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", cursor: "pointer",
        });
        grid.appendChild(btnSubmit);

        const btnNext = document.createElement("button");
        btnNext.id = "__autoReply_backup";
        btnNext.innerText = "⏭️ Next Review (W)";
        Object.assign(btnNext.style, {
            padding: "8px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", cursor: "pointer",
        });
        grid.appendChild(btnNext);

        const modeRow = document.createElement("div");
        modeRow.style.display = "grid";
        modeRow.style.gridTemplateColumns = "1fr 1fr";
        modeRow.style.gap = "8px";
        modeRow.style.marginTop = "10px";
        card.appendChild(modeRow);

        const autoBtn = document.createElement("button");
        autoBtn.id = "__autoReply_autoMode";
        autoBtn.innerText = "⚪ Auto (E): OFF";
        Object.assign(autoBtn.style, {
            padding: "8px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px",
        });
        modeRow.appendChild(autoBtn);

        const soundBtn = document.createElement("button");
        soundBtn.id = "__autoReply_sound";
        soundBtn.innerText = "🔇 Sound: OFF";
        Object.assign(soundBtn.style, {
            padding: "8px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px",
        });
        modeRow.appendChild(soundBtn);

        const autoSubmitBtn = document.createElement("button");
        autoSubmitBtn.id = "__autoReply_autoSubmit";
        autoSubmitBtn.innerText = "⚪ Auto Submit: OFF";
        Object.assign(autoSubmitBtn.style, {
            padding: "8px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", marginTop: "8px", width: "100%", display: "none"
        });
        card.appendChild(autoSubmitBtn);

        const delayInputEl = document.createElement("input");
        delayInputEl.id = "__autoReply_delayInput";
        delayInputEl.type = "number";
        delayInputEl.min = 1;
        delayInputEl.value = 3;
        delayInputEl.placeholder = "Auto Submit Delay (giây)";
        Object.assign(delayInputEl.style, {
            width: "100%", padding: "8px 6px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", display: "none", marginTop: "8px", marginBottom: "0px",
        });
        card.appendChild(delayInputEl);

        const scheduleWrap = document.createElement("div");
        scheduleWrap.style.display = "flex";
        scheduleWrap.style.gap = "6px";
        scheduleWrap.style.marginTop = "8px";

        const timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.id = "__autoReply_timeInput";
        timeInput.step = 60;

        const now = new Date();
        timeInput.value = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

        Object.assign(timeInput.style, { flex: "1", padding: "8px", marginBottom: "0px", height: "auto", borderRadius: "8px", fontSize: "13px", });

        const scheduleBtn = document.createElement("button");
        scheduleBtn.id = "__autoReply_scheduleBtn";
        scheduleBtn.innerText = "⏰ Schedule";
        Object.assign(scheduleBtn.style, {
            padding: "8px 10px", borderRadius: "8px", fontSize: "13px", border: "none", background: "#ffc107", cursor: "pointer", whiteSpace: "nowrap",
        });

        scheduleWrap.appendChild(timeInput);
        scheduleWrap.appendChild(scheduleBtn);

        const limitToggle = document.createElement("button");
        limitToggle.id = "__autoReply_limitToggle";
        limitToggle.innerText = "⚪ Limit: OFF";
        Object.assign(limitToggle.style, {
            padding: "8px", background: "#6c757d", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", cursor: "pointer", marginTop: "8px", width: "100%",
        });
        card.appendChild(limitToggle);

        const limitInput = document.createElement("input");
        limitInput.id = "__autoReply_limitInput";
        limitInput.type = "number";
        limitInput.min = 1;
        limitInput.value = replyLimit;
        Object.assign(limitInput.style, {
            width: "100%", padding: "8px 6px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "13px", display: "none", marginTop: "8px", marginBottom: "0px",
        });
        card.appendChild(limitInput);

        card.appendChild(scheduleWrap);

        const footer = document.createElement("div");
        footer.style.marginTop = "10px";
        footer.style.textAlign = "center";
        footer.style.fontSize = "12px";
        footer.style.color = "#666";
        footer.innerText = "Ctrl+Space => Show/Hide";
        card.appendChild(footer);
    }

    const startBtnEl = document.getElementById("__autoReply_start");
    const submitHelperEl = document.getElementById("__autoReply_clickSubmit");
    const backupBtnEl = document.getElementById("__autoReply_backup");
    const autoBtnEl = document.getElementById("__autoReply_autoMode");
    const soundBtnEl = document.getElementById("__autoReply_sound");
    const autoSubmitBtnEl = document.getElementById("__autoReply_autoSubmit");
    const countdownTextEl = document.getElementById("__autoReply_countdown");
    const countStatusEl = document.getElementById("__autoReply_countStatus");
    const statusTextEl = document.getElementById("__autoReply_statusText");
    const limitToggleEl = document.getElementById("__autoReply_limitToggle");
    const limitInputEl = document.getElementById("__autoReply_limitInput");
    const timeInputEl = document.getElementById("__autoReply_timeInput");
    const scheduleBtnEl = document.getElementById("__autoReply_scheduleBtn");

    let scheduleTimeout = null;
    let scheduleCountdown = null;
    let scheduledTarget = null;
    let remainingMs = 0;

    function formatTime(ms) {
        const s = Math.max(0, Math.floor(ms / 1000));
        const h = String(Math.floor(s / 3600)).padStart(2, "0");
        const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
        const sec = String(s % 60).padStart(2, "0");
        return `${h}:${m}:${sec}`;
    }

    scheduleBtnEl.onclick = () => {
        if (scheduleTimeout) {
            clearTimeout(scheduleTimeout);
            clearInterval(scheduleCountdown);
            scheduleTimeout = null;
            scheduleCountdown = null;
            scheduledTarget = null;
            remainingMs = 0;
            scheduleBtnEl.innerText = "⏰ Schedule";
            return;
        }

        if (!timeInputEl.value) return alert("⛔ Chưa chọn giờ");
        if (autoMode) return alert("⚠️ Auto đang chạy — hãy OFF trước");

        const [h, m] = timeInputEl.value.split(":").map(Number);
        const now = new Date();
        const target = new Date();
        target.setHours(h, m, 0, 0);

        let diff = target - now;
        if (diff < -60000) {
            target.setDate(target.getDate() + 1);
            diff = target - now;
        }

        if (diff < 1000) {
            runAutoNow();
            return;
        }

        remainingMs = diff;
        scheduledTarget = target;
        scheduleBtnEl.innerText = "❌ Cancel";

        let status = document.getElementById("countdown-status");
        if (!status) {
            status = document.createElement("div");
            status.id = "countdown-status";
            Object.assign(status.style, {
                position: "fixed", bottom: "72px", right: "26px", background: "#111", color: "#0f0", padding: "6px 10px", borderRadius: "8px", fontFamily: "monospace", zIndex: 999999
            });
            document.body.appendChild(status);
        }

        scheduleCountdown = setInterval(() => {
            const remainingMs = scheduledTarget - Date.now();
            if (remainingMs <= 0) {
                clearInterval(scheduleCountdown);
                status.textContent = "✅ Đã tới giờ";
                return;
            }
            status.textContent = `⏳ Auto sau ${formatTime(remainingMs)}`;
        }, 1000);

        scheduleTimeout = setTimeout(runAutoNow, remainingMs);
    };

    function updateCountUI() {
        if (countStatusEl) countStatusEl.innerText = `✅ Replied: ${formatLimitText()}`;
    }

    if (limitInputEl) {
        limitInputEl.addEventListener("input", (e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v > 0) {
                replyLimit = v;
                updateCountUI();
            }
        });
    }

    if (limitToggleEl) {
        limitToggleEl.onclick = () => {
            limitEnabled = !limitEnabled;
            limitToggleEl.innerText = limitEnabled ? "🟢 Limit: ON" : "⚪ Limit: OFF";
            limitToggleEl.style.background = limitEnabled ? "#28a745" : "#6c757d";
            if (limitInputEl) limitInputEl.style.display = limitEnabled ? "block" : "none";
            updateCountUI();
        };
    }

    let autoMode = false;
    let soundOn = false;
    let currentReview = null;
    let submitReadyChecker = null;

    let fallbackTimer = null;
    const FALLBACK_TIMEOUT_MS = 30000; 

    function getSortedReviews() {
        const reviews = [...document.querySelectorAll(".Box-sc-18eybku-0.idyRmo")];
        const withButtons = reviews
            .filter(div => [...div.querySelectorAll("button")].some(btn =>
                /reply|edit response/i.test(btn.innerText)
            ))
            .map(div => ({
                el: div,
                rect: div.getBoundingClientRect(),
                btn: [...div.querySelectorAll("button")].find(b =>
                    /reply|edit response/i.test(b.innerText)
                )
            }));

        withButtons.sort((a, b) => {
            if (Math.abs(a.rect.top - b.rect.top) > 10) return a.rect.top - b.rect.top;
            return a.rect.left - b.rect.left;
        });

        return withButtons;
    }

    function findNextUnreplied() {
        const all = getSortedReviews();
        return all.find(
            r => r.btn && r.btn.innerText.trim().toLowerCase() === "reply"
        );
    }

    function stopAllAuto(reason) {
        autoMode = false;
        if (autoBtnEl) {
            autoBtnEl.innerText = "⚪ Auto (E): OFF";
            autoBtnEl.style.background = "#6c757d";
        }
        autoSubmitOn = false;
        if (autoSubmitBtnEl) {
            autoSubmitBtnEl.innerText = "⚪ Auto Submit: OFF";
            autoSubmitBtnEl.style.background = "#6c757d";
        }
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
        if (pendingTimeout) {
            clearTimeout(pendingTimeout);
            pendingTimeout = null;
        }
        if (countdownTextEl) countdownTextEl.style.display = "none";
        if (fallbackTimer) {
            clearTimeout(fallbackTimer);
            fallbackTimer = null;
        }
        if (submitReadyChecker) {
            clearInterval(submitReadyChecker);
            submitReadyChecker = null;
        }
        currentReview = null;
        const startBtn = document.getElementById("__autoReply_start");
        if (startBtn) startBtn.innerText = "🔍 Start reply.";
        if (reason && typeof reason === "string") alert(reason);
        if (statusTextEl) statusTextEl.innerText = "⏹️ Stop Auto";
        const delayInput = document.getElementById("__autoReply_delayInput");
        if (delayInput) delayInput.style.display = "none";

        updateCountUI();
    }

    const countedReviews = new WeakSet();

    function waitForResponseUpdate(callback) {
        if (!currentReview) return;
        const reviewRef = currentReview;
        // Tăng interval lên 1000ms để giảm tải Event Queue
        const checkInterval = setInterval(() => {
            const reviewBtn = [...reviewRef.el.querySelectorAll("button")].find(b =>
                /reply|edit response/i.test(b.innerText)
            );
            const btnText = reviewBtn?.innerText?.trim().toLowerCase() || "reply";
            if (btnText === "edit response" && !countedReviews.has(reviewRef.el)) {
                countedReviews.add(reviewRef.el);
                clearInterval(checkInterval);
                if (fallbackTimer) {
                    clearTimeout(fallbackTimer);
                    fallbackTimer = null;
                }
                repliedCount++;
                updateCountUI();
                callback?.();
            }
        }, 1000);
    }

    async function fillResponseTextForCurrentReview() {
        const stars = currentReview.el.querySelectorAll('svg[color="title"]').length;
        const textarea = document.querySelector("textarea#developerResponse");
        if (!textarea) return false;

        const message = stars >= 4 ? positiveMsg : negativeMsg;
        const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value"
        ).set;
        nativeSetter.call(textarea, message);
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.value = message + " ";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        await delay(50);
        textarea.value = message;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
    }

    function triggerBackup(skipCurrent = true) {
        try {
            if (fallbackTimer) {
                clearTimeout(fallbackTimer);
                fallbackTimer = null;
            }

            const all = getSortedReviews();
            let target;
            if (skipCurrent && currentReview) {
                target = all.find(r => r.el !== currentReview.el && r.btn && r.btn.innerText.trim().toLowerCase() === "reply");
            } else {
                target = all.find(r => r.btn && r.btn.innerText.trim().toLowerCase() === "reply");
            }
            if (!target) {
                alert("🎉 Không tìm thấy review chưa trả lời để backup — có thể đã hết review.");
                return;
            }
            const startBtn = document.getElementById("__autoReply_start");
            if (startBtn) startBtn.innerText = "➡️ Backup ~ Find next reply.";

            target.el.scrollIntoView({ behavior: "smooth", block: "center" });
            target.btn.click();
            currentReview = target;

            (async () => {
                let textarea;
                for (let i = 0; i < 30; i++) {
                    textarea = document.querySelector("textarea#developerResponse");
                    if (textarea) break;
                    await delay(200);
                }
                if (!textarea) return alert("Không tìm thấy khung trả lời sau khi backup!");
                const ok = await fillResponseTextForCurrentReview();
                if (!ok) return;

                const submitBtn = [...document.querySelectorAll("button")].find(
                    b => b.textContent.trim() === "Submit"
                );
                if (submitBtn) {
                    submitBtn.scrollIntoView({ behavior: "smooth", block: "center" });
                    submitBtn.style.boxShadow = "0 0 8px 2px #0070C9";
                    if (submitReadyChecker) clearInterval(submitReadyChecker);
                    // Tăng interval lên 500ms
                    submitReadyChecker = setInterval(() => {
                        if (!submitBtn.disabled) {
                            clearInterval(submitReadyChecker);
                            playBeep();
                        }
                    }, 500);
                }

                if (fallbackTimer) clearTimeout(fallbackTimer);
                fallbackTimer = setTimeout(() => {
                    const btnText = (currentReview && [...currentReview.el.querySelectorAll("button")].find(b => /reply|edit response/i.test(b.innerText))?.innerText || "").trim().toLowerCase();
                    if (btnText === "reply") triggerBackup(true);
                }, FALLBACK_TIMEOUT_MS);

                waitForResponseUpdate(async () => {
                    if (startBtn) startBtn.innerText = "➡️ Find next reply.";
                    if (autoMode) {
                        await delay(1000);
                        startProcessOnce();
                    }
                });
            })();
        } catch (e) {
            console.error(e);
        }
    }

    async function startProcessOnce() {
        if (limitEnabled && repliedCount >= replyLimit) {
            stopAllAuto(`🎯 Đã đạt giới hạn ${replyLimit} review — Tự động OFF.`);
            return;
        }

        const target = findNextUnreplied();
        if (!target) {
            stopAllAuto("🎉 Tất cả review đã được phản hồi — Tự động OFF.");
            return;
        }
        currentReview = target;
        currentReview.el.scrollIntoView({ behavior: "smooth", block: "center" });
        currentReview.btn.click();

        let textarea;
        for (let i = 0; i < 30; i++) {
            textarea = document.querySelector("textarea#developerResponse");
            if (textarea) break;
            await delay(200);
        }
        if (!textarea) return alert("Không tìm thấy khung trả lời!");

        const ok = await fillResponseTextForCurrentReview();
        if (!ok) return;

        const submitBtn = [...document.querySelectorAll("button")].find(
            b => b.textContent.trim() === "Submit"
        );
        if (submitBtn) {
            submitBtn.scrollIntoView({ behavior: "smooth", block: "center" });
            submitBtn.style.boxShadow = "0 0 8px 2px #0070C9";
            if (submitReadyChecker) clearInterval(submitReadyChecker);
            // Tăng interval lên 500ms
            submitReadyChecker = setInterval(() => {
                if (!submitBtn.disabled) {
                    clearInterval(submitReadyChecker);
                    playBeep();
                }
            }, 500);
        }

        const startBtn = document.getElementById("__autoReply_start");
        if (startBtn) startBtn.innerText = "⏳ Đang đợi phản hồi được lưu...";

        if (fallbackTimer) clearTimeout(fallbackTimer);
        fallbackTimer = setTimeout(() => {
            try {
                const reviewBtn = currentReview && [...currentReview.el.querySelectorAll("button")].find(b => /reply|edit response/i.test(b.innerText));
                const btnText = (reviewBtn?.innerText || "").trim().toLowerCase();
                if (btnText === "reply") {
                    const startBtnEl = document.getElementById("__autoReply_start");
                    if (startBtnEl) startBtnEl.innerText = "⚠️ Timeout 30s — Chạy backup";
                    triggerBackup(true);
                }
            } catch (e) {
                console.error(e);
            }
        }, FALLBACK_TIMEOUT_MS);

        waitForResponseUpdate(async () => {
            if (startBtn) startBtn.innerText = "➡️ Find next reply.";
            if (autoMode) {
                await delay(1000);
                startProcessOnce();
            }
        });
    }

    if (startBtnEl) {
        startBtnEl.onclick = () => {
            if (startBtnEl.innerText.includes("⏳")) return alert("Vui lòng đợi phản hồi được lưu xong");
            startProcessOnce();
        };
    }

    function runAutoNow() {
        localStorage.setItem("__autoReply_runAfterReload", "1");
        playBeep();
        location.reload();
    }

    function clickSubmitAction() {
        const submitBtn = [...document.querySelectorAll("button")].find(
            b => b.textContent.trim() === "Submit"
        );
        if (!submitBtn) return alert("Không tìm thấy nút Submit.");
        if (submitBtn.disabled) return alert("Nút Submit bị vô hiệu hóa.");
        submitBtn.click();
        const startBtn = document.getElementById("__autoReply_start");
        if (startBtn) startBtn.innerText = "⏳ Waiting for reply to be saved...";
    }

    if (submitHelperEl) submitHelperEl.onclick = clickSubmitAction;
    if (backupBtnEl) backupBtnEl.onclick = () => triggerBackup(true);

    let autoSubmitOn = false;
    let checkInterval = null;
    let pendingTimeout = null;
    let countdownTimer = null;

    function enableAutoSubmitProgrammatically() {
        if (!autoSubmitOn) {
            autoSubmitOn = true;
            autoSubmitBtnEl.innerText = "🟢 Auto Submit: ON";
            autoSubmitBtnEl.style.background = "#28a745";
            const delayInput = document.getElementById("__autoReply_delayInput");
            if (delayInput) delayInput.style.display = "block";

            checkInterval = setInterval(() => {
                const submitBtn = [...document.querySelectorAll("button")].find(
                    b => b.textContent.trim() === "Submit"
                );
                if (!submitBtn) return;
                if (!submitBtn.disabled && !pendingTimeout) {
                    const delayInputEl = document.getElementById("__autoReply_delayInput");
                    const maxDelay = Math.max(1, parseInt(delayInputEl?.value) || 10);
                    const randomDelay = Math.random() * maxDelay * 1000;
                    let remain = Math.floor(randomDelay / 1000);

                    if (countdownTextEl) {
                        countdownTextEl.style.display = "block";
                        countdownTextEl.innerText = `🕒 Auto submit sau ${remain}s`;
                    }

                    clearInterval(countdownTimer);
                    countdownTimer = setInterval(() => {
                        remain--;
                        if (remain > 0) {
                            if (countdownTextEl) countdownTextEl.innerText = `🕒 Auto submit sau ${remain}s`;
                        } else {
                            clearInterval(countdownTimer);
                        }
                    }, 1000);

                    pendingTimeout = setTimeout(() => {
                        if (autoSubmitOn && !submitBtn.disabled) {
                            submitBtn.click();
                            playBeep();
                        }
                        pendingTimeout = null;
                        if (countdownTextEl) countdownTextEl.style.display = "none";
                    }, randomDelay);
                }
            }, 1000);
        }
    }

    if (autoBtnEl) {
        autoBtnEl.onclick = () => {
            autoMode = !autoMode;
            autoBtnEl.innerText = autoMode ? "🟢 Auto (E): ON" : "⚪ Auto (E): OFF";
            autoBtnEl.style.background = autoMode ? "#28a745" : "#6c757d";

            if (autoMode && !autoSubmitOn) enableAutoSubmitProgrammatically();

            if (autoMode) {
                if (limitEnabled && repliedCount >= replyLimit) return stopAllAuto(`🎯 Đã đạt giới hạn ${replyLimit} review – Tự động OFF.`);
                startProcessOnce();
            } else {
                autoSubmitOn = false;
                autoSubmitBtnEl.innerText = "⚪ Auto Submit: OFF";
                autoSubmitBtnEl.style.background = "#6c757d";
                const delayInput = document.getElementById("__autoReply_delayInput");
                if (delayInput) delayInput.style.display = "none";
            }
        };
    }

    if (soundBtnEl) {
        soundBtnEl.onclick = () => {
            soundOn = !soundOn;
            soundBtnEl.innerText = soundOn ? "🔊 Sound: ON" : "🔇 Sound: OFF";
            soundBtnEl.style.background = soundOn ? "#17a2b8" : "#6c757d";
            if (soundOn) playBeep();
        };
    }

    if (autoSubmitBtnEl) {
        autoSubmitBtnEl.onclick = () => {
            autoSubmitOn = !autoSubmitOn;
            autoSubmitBtnEl.innerText = autoSubmitOn ? "🟢 Auto Submit: ON" : "⚪ Auto Submit: OFF";
            autoSubmitBtnEl.style.background = autoSubmitOn ? "#28a745" : "#6c757d";

            const delayInput = document.getElementById("__autoReply_delayInput");
            if (delayInput) delayInput.style.display = autoSubmitOn ? "block" : "none";

            if (autoSubmitOn) {
                checkInterval = setInterval(() => {
                    const submitBtn = [...document.querySelectorAll("button")].find(
                        b => b.textContent.trim() === "Submit"
                    );
                    if (!submitBtn) return;
                    if (!submitBtn.disabled && !pendingTimeout) {
                        const delayInputEl = document.getElementById("__autoReply_delayInput");
                        const maxDelay = Math.max(1, parseInt(delayInputEl?.value) || 10);
                        const randomDelay = Math.random() * maxDelay * 1000;
                        let remain = Math.floor(randomDelay / 1000);
                        if (countdownTextEl) {
                            countdownTextEl.style.display = "block";
                            countdownTextEl.innerText = `🕒 Auto submit sau ${remain}s`;
                        }

                        clearInterval(countdownTimer);
                        countdownTimer = setInterval(() => {
                            remain--;
                            if (remain > 0) {
                                if (countdownTextEl) countdownTextEl.innerText = `🕒 Auto submit sau ${remain}s`;
                            } else {
                                clearInterval(countdownTimer);
                            }
                        }, 1000);

                        pendingTimeout = setTimeout(() => {
                            if (autoSubmitOn && !submitBtn.disabled) {
                                submitBtn.click();
                                playBeep();
                            }
                            pendingTimeout = null;
                            if (countdownTextEl) countdownTextEl.style.display = "none";
                        }, randomDelay);
                    }
                }, 1000);
            } else {
                clearInterval(checkInterval);
                clearInterval(countdownTimer);
                if (pendingTimeout) clearTimeout(pendingTimeout);
                if (countdownTextEl) countdownTextEl.style.display = "none";
                pendingTimeout = null;
            }
        };
    }

    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "q") {
            e.preventDefault();
            clickSubmitAction();
        }

        if (e.key.toLowerCase() === "w" || e.key.toLowerCase() === "ư") {
            e.preventDefault();
            triggerBackup(true);
        }

        if (e.key.toLowerCase() === "e") {
            const tag = document.activeElement?.tagName?.toLowerCase();
            if (tag === "input" || tag === "textarea") return;

            e.preventDefault();
            const autoBtn = document.getElementById("__autoReply_autoMode");
            if (autoBtn) autoBtn.click();
        }

        if (e.ctrlKey && e.code === "Space") {
            e.preventDefault();
            const root = document.getElementById("__autoReply_root");
            if (!root) return;
            const isHidden = root.style.display === "none";
            root.style.display = isHidden ? "flex" : "none";
        }
    });

    updateCountUI();

    async function scrollBottomNTimes(times = 8, delayMs = 60000) {
        for (let i = 1; i <= times; i++) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            if (i < times) await new Promise(r => setTimeout(r, delayMs));
        }
    }

    (function autoRunAfterReload() {
        const flag = localStorage.getItem("__autoReply_runAfterReload");
        if (!flag) return;

        localStorage.removeItem("__autoReply_runAfterReload");

        (async () => {
            await new Promise(r => setTimeout(r, 1500));
            if (limitEnabled && repliedCount >= replyLimit) return;
            await scrollBottomNTimes(5, 10000);

            const autoBtn = document.getElementById("__autoReply_autoMode");
            if (autoBtn && autoBtn.innerText.includes("OFF")) autoBtn.click();
        })();
    })();
})();
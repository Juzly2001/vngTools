(() => {
    window.onbeforeunload = () => true;

    function initReviewLinksWidget() {
        const ID = "mini-excel-review-links";
        document.getElementById(ID)?.remove();

        const STORAGE_KEY_LINK = "gsheet_saved_url";
        const STORAGE_KEY_COL = "gsheet_saved_col";

        let currentFocusedTextarea = null;
        document.addEventListener("focusin", (e) => {
            if (e.target && e.target.tagName === "TEXTAREA") {
                currentFocusedTextarea = e.target;
            }
        });

        // -------- BOX --------
        const box = document.createElement("div");
        box.id = ID;
        Object.assign(box.style, {
            position: "fixed",
            top: "70px",
            right: "35px",
            zIndex: 999998,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "12px",
            width: "876px",
            fontSize: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontFamily: "Segoe UI,Roboto,Arial,sans-serif"
        });

        // ---------- HEADER ----------
        const header = document.createElement("div");
        Object.assign(header.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px"
        });

        const title = document.createElement("div");
        title.textContent = "⚡Google Support";
        Object.assign(title.style, {
            fontWeight: "bold",
            fontSize: "24px"
        });

        const btnArea = document.createElement("div");

        function styleBtn(btn, type = "default") {
            Object.assign(btn.style, {
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "14px",
                marginLeft: "6px",
                transition: "0.2s"
            });

            btn.dataset.active = "false";

            btn.onmouseenter = () => {
                if (btn.dataset.active === "true") return;
                btn.style.background = type === "danger" ? "#fee2e2" : "#f3f4f6";
            };

            btn.onmouseleave = () => {
                if (btn.dataset.active === "true") return;
                btn.style.background = "#f9fafb";
            };
        }

        const againBtn = document.createElement("button");
        againBtn.textContent = "Again";
        styleBtn(againBtn);
        
        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "Hide";
        styleBtn(toggleBtn);

        const copyAllBtn = document.createElement("button");
        copyAllBtn.textContent = "Copy Links";
        styleBtn(copyAllBtn);

        const scanBtn = document.createElement("button");
        scanBtn.textContent = "Scan";
        styleBtn(scanBtn);

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Auto Submit";
        styleBtn(submitBtn);

        const pasteAllBtn = document.createElement("button");
        pasteAllBtn.textContent = "Auto Paste";
        styleBtn(pasteAllBtn);

        const prevPageBtn = document.createElement("button");
        prevPageBtn.textContent = "<";
        styleBtn(prevPageBtn);

        const nextPageBtn = document.createElement("button");
        nextPageBtn.textContent = ">";
        styleBtn(nextPageBtn);

        const autoBtn = document.createElement("button");
        autoBtn.textContent = "Auto";
        styleBtn(autoBtn);

        btnArea.append(
            againBtn,
            // autoBtn,
            copyAllBtn,
            scanBtn,
            pasteAllBtn,
            submitBtn,
        );

        header.append(title, btnArea);

        function triggerAngularClick(el) {
            el.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        }

        function getCurrentRangeText() {
            const el = document.querySelector(".selected div");
            if (!el) return "Không rõ";
            return el.textContent.trim();
        }

        async function waitForPageChange(oldRange, timeout = 4000) {
            const start = Date.now();
            while (Date.now() - start < timeout) {
                const newRange = getCurrentRangeText();
                if (newRange && newRange !== oldRange) {
                    return true;
                }
                await sleep(150);
            }
            return false;
        }

        prevPageBtn.onclick = () => {
            const btn = document.querySelector('material-button.prev[aria-disabled="false"]');
            if (btn && !btn.disabled) {
                triggerAngularClick(btn);
            }
        };

        nextPageBtn.onclick = () => {
            const btn = document.querySelector('material-button.next[aria-disabled="false"]');
            if (btn && !btn.disabled) {
                triggerAngularClick(btn);
            }
        };

        // ---------- TABLE 1 ----------
        const table = document.createElement("table");
        Object.assign(table.style, {
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #e5e7eb"
        });

        const thead = document.createElement("thead"),
            headRow = document.createElement("tr");
        ["STT", "Link", "Delete"].forEach(t => {
            const th = document.createElement("th");
            th.textContent = t;
            Object.assign(th.style, {
                border: "1px solid #e5e7eb",
                padding: "8px",
                background: "#f9fafb",
                textAlign: "left",
                fontWeight: "600"
            });
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);

        const tbody = document.createElement("tbody");
        table.append(thead, tbody);

        const scrollWrap = document.createElement("div");
        Object.assign(scrollWrap.style, {
            maxHeight: "160px",
            overflowY: "auto",
            border: "1px solid #e5e7eb"
        });
        scrollWrap.appendChild(table);

        // ---------- INFO PANEL ----------
        const infoPanel = document.createElement("div");
        Object.assign(infoPanel.style, {
            marginTop: "10px",
            padding: "8px 10px",
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "13px",
            whiteSpace: "pre-line"
        });
        infoPanel.textContent = "🟢 Ready...";

        // ==========================================
        // ---------- SECTION GOOGLE SHEETS ----------
        // ==========================================
        const sheetSection = document.createElement("div");
        Object.assign(sheetSection.style, {
            marginTop: "12px",
            paddingTop: "10px",
            borderTop: "2px dashed #e5e7eb"
        });

        const sheetTitle = document.createElement("div");
        sheetTitle.textContent = "📊 Dữ liệu từ Google Sheet";
        Object.assign(sheetTitle.style, {
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "8px"
        });

        const sheetInputGroup = document.createElement("div");
        Object.assign(sheetInputGroup.style, {
            display: "flex",
            gap: "8px",
            alignItems: "center",
            marginBottom: "8px"
        });

        const sheetInput = document.createElement("input");
        sheetInput.placeholder = "Dán link Google Sheet (Công khai)...";
        // Khôi phục URL đã lưu
        sheetInput.value = localStorage.getItem(STORAGE_KEY_LINK) || "";
        Object.assign(sheetInput.style, {
            flex: "1",
            padding: "6px 10px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "13px",
            outline: "none"
        });

        const columnSelectLabel = document.createElement("span");
        columnSelectLabel.textContent = "Cột Paste:";
        columnSelectLabel.style.fontSize = "13px";

        const columnSelect = document.createElement("select");
        Object.assign(columnSelect.style, {
            padding: "6px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "13px",
            outline: "none",
            cursor: "pointer",
            maxWidth: "180px"
        });
        const defaultOpt = document.createElement("option");
        defaultOpt.value = "";
        defaultOpt.textContent = "-- Chọn cột --";
        columnSelect.appendChild(defaultOpt);

        // Khi thay đổi cột -> Tự động lưu vào storage
        columnSelect.onchange = () => {
            localStorage.setItem(STORAGE_KEY_COL, columnSelect.value);
        };

        const sheetLoadBtn = document.createElement("button");
        sheetLoadBtn.textContent = "Tải dữ liệu";
        styleBtn(sheetLoadBtn);

        sheetInputGroup.append(sheetInput, columnSelectLabel, columnSelect, sheetLoadBtn);

        // THÊM DÒNG TÌM KIẾM
        const searchInputGroup = document.createElement("div");
        Object.assign(searchInputGroup.style, {
            display: "flex",
            gap: "8px",
            alignItems: "center",
            marginBottom: "10px"
        });

        const searchInput = document.createElement("input");
        searchInput.placeholder = "🔍 Tìm kiếm nội dung trong bảng...";
        Object.assign(searchInput.style, {
            flex: "1",
            padding: "6px 10px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "13px",
            outline: "none"
        });

        // Xử lý Lọc dữ liệu real-time
        searchInput.oninput = () => {
            const keyword = searchInput.value.toLowerCase().trim();
            const rows = sheetTbody.querySelectorAll("tr");
            rows.forEach(tr => {
                const text = tr.textContent.toLowerCase();
                tr.style.display = text.includes(keyword) ? "" : "none";
            });
        };

        searchInputGroup.appendChild(searchInput);

        // TABLE 2 (SHEET DATA)
        const sheetTable = document.createElement("table");
        Object.assign(sheetTable.style, {
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #e5e7eb"
        });

        const sheetThead = document.createElement("thead");
        const sheetTbody = document.createElement("tbody");
        sheetTable.append(sheetThead, sheetTbody);

        const sheetScrollWrap = document.createElement("div");
        Object.assign(sheetScrollWrap.style, {
            maxHeight: "600px",
            overflowY: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: "6px"
        });
        sheetScrollWrap.appendChild(sheetTable);

        sheetSection.append(sheetTitle, sheetInputGroup, searchInputGroup, sheetScrollWrap);

        box.append(header, scrollWrap, infoPanel, sheetSection);
        document.body.appendChild(box);

        function fillTextarea(textArea, text) {
            if (!textArea) return false;
            textArea.focus();
            const nativeSetter = Object.getOwnPropertyDescriptor(
                HTMLTextAreaElement.prototype,
                "value"
            )?.set;

            if (nativeSetter) {
                nativeSetter.call(textArea, text);
            } else {
                textArea.value = text;
            }

            textArea.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
            textArea.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
        }

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

        sheetLoadBtn.onclick = async () => {
            let url = sheetInput.value.trim();
            if (!url) {
                alert("Vui lòng nhập link Google Sheet!");
                return;
            }

            // Lưu link vào LocalStorage
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

            sheetLoadBtn.textContent = "Đang tải...";
            try {
                const res = await fetch(csvUrl);
                if (!res.ok) throw new Error("Không thể tải link. Hãy đảm bảo Sheet đã được chia sẻ công khai.");
                const text = await res.text();
                const rows = parseCSV(text);

                sheetThead.replaceChildren();
                sheetTbody.replaceChildren();
                columnSelect.replaceChildren();

                if (rows.length === 0) {
                    updateInfo("⚠️ Sheet không có dữ liệu!");
                    sheetLoadBtn.textContent = "Tải dữ liệu";
                    return;
                }

                // Render Cột trong Select Box
                const headers = rows[0];
                headers.forEach((colName, index) => {
                    const opt = document.createElement("option");
                    opt.value = index;
                    opt.textContent = `Cột ${index + 1}: ${colName || 'Không tên'}`;
                    columnSelect.appendChild(opt);
                });

                // Khôi phục Cột đã lưu từ Storage (nếu hợp lệ)
                const savedCol = localStorage.getItem(STORAGE_KEY_COL);
                if (savedCol !== null && parseInt(savedCol, 10) < headers.length) {
                    columnSelect.value = savedCol;
                } else {
                    columnSelect.value = headers.length > 1 ? "1" : "0";
                    localStorage.setItem(STORAGE_KEY_COL, columnSelect.value);
                }

                // Render Header Table
                const trHead = document.createElement("tr");
                const thPaste = document.createElement("th");
                thPaste.textContent = "Paste";
                Object.assign(thPaste.style, {
                    border: "1px solid #e5e7eb",
                    padding: "6px",
                    background: "#f9fafb",
                    width: "55px",
                    textAlign: "center"
                });
                trHead.appendChild(thPaste);

                headers.forEach(colText => {
                    const th = document.createElement("th");
                    th.textContent = colText;
                    Object.assign(th.style, {
                        border: "1px solid #e5e7eb",
                        padding: "6px",
                        background: "#f9fafb",
                        textAlign: "left",
                        fontWeight: "600",
                        whiteSpace: "nowrap"
                    });
                    trHead.appendChild(th);
                });
                sheetThead.appendChild(trHead);

                // Render Body Table
                for (let i = 1; i < rows.length; i++) {
                    const tr = document.createElement("tr");
                    const rowData = rows[i];

                    const tdPaste = document.createElement("td");
                    Object.assign(tdPaste.style, {
                        border: "1px solid #e5e7eb",
                        padding: "4px",
                        textAlign: "center"
                    });

                    const pBtn = document.createElement("button");
                    pBtn.textContent = "📋";
                    pBtn.title = "Dán giá trị của cột đã chọn vào ô textarea";
                    styleBtn(pBtn);
                    pBtn.style.padding = "2px 6px";
                    pBtn.style.marginLeft = "0";

                    pBtn.onclick = () => {
                        const selectedColIndex = parseInt(columnSelect.value, 10);
                        const contentToPaste = rowData[selectedColIndex] || "";

                        if (!contentToPaste) {
                            updateInfo(`⚠️ Cột được chọn tại dòng ${i} không có dữ liệu!`);
                            return;
                        }

                        let targetArea = currentFocusedTextarea;

                        if (!targetArea || !document.body.contains(targetArea)) {
                            targetArea = document.querySelector('textarea[aria-label="Trả lời"], textarea[aria-label="Reply"]');
                        }

                        if (targetArea) {
                            fillTextarea(targetArea, contentToPaste);
                            updateInfo(`✅ Đã paste nội dung dòng ${i} (Cột ${selectedColIndex + 1}) vào textarea!`);
                        } else {
                            alert("❌ Không tìm thấy ô textarea nào đang chọn để paste!");
                        }
                    };

                    tdPaste.appendChild(pBtn);
                    tr.appendChild(tdPaste);

                    rowData.forEach(cellText => {
                        const td = document.createElement("td");
                        td.textContent = cellText;
                        Object.assign(td.style, {
                            border: "1px solid #e5e7eb",
                            padding: "6px",
                            fontSize: "13px"
                        });
                        tr.appendChild(td);
                    });

                    sheetTbody.appendChild(tr);
                }

                // Khôi phục từ khóa tìm kiếm cũ nếu có
                if (searchInput.value) {
                    searchInput.dispatchEvent(new Event("input"));
                }

                updateInfo(`✅ Đã tải thành công ${rows.length - 1} dòng dữ liệu từ Sheet!`);
            } catch (err) {
                alert(err.message);
                updateInfo(`❌ Lỗi: ${err.message}`);
            } finally {
                sheetLoadBtn.textContent = "Tải dữ liệu";
            }
        };

        // Tự động tải Sheet ngay khi khởi chạy nếu đã lưu URL từ trước
        if (sheetInput.value) {
            sheetLoadBtn.click();
        }

        // =============== LOGIC GỐC ===============
        let counter = 0,
            addedLinks = new Set,
            lastClipboardLink = null;

        function updateInfo(msg) {
            infoPanel.textContent = msg;
            console.log(msg);
        }

        function addRow(link) {
            if (addedLinks.has(link)) return;
            addedLinks.add(link);
            counter++;

            const row = document.createElement("tr");

            const td1 = document.createElement("td");
            td1.textContent = counter;
            Object.assign(td1.style, {
                border: "1px solid #e5e7eb",
                padding: "6px",
                width: "40px",
                textAlign: "center"
            });

            const td2 = document.createElement("td");
            Object.assign(td2.style, {
                border: "1px solid #e5e7eb",
                padding: "6px",
                wordBreak: "break-all"
            });

            const a = document.createElement("a");
            a.href = link;
            a.textContent = link;
            a.target = "_blank";
            a.rel = "noopener";

            td2.appendChild(a);

            const td3 = document.createElement("td");
            Object.assign(td3.style, {
                border: "1px solid #e5e7eb",
                padding: "6px",
                textAlign: "center"
            });

            const delBtn = document.createElement("button");
            delBtn.textContent = "❌";
            styleBtn(delBtn, "danger");
            delBtn.onclick = () => {
                tbody.removeChild(row);
                addedLinks.delete(link);
            };
            td3.appendChild(delBtn);

            row.append(td1, td2, td3);
            tbody.appendChild(row);

            setTimeout(() => {
                row.scrollIntoView({
                    behavior: "smooth",
                    block: "end"
                });
            }, 50);
        }

        async function captureClipboardLink(waitForNew = !1, oldLink = null) {
            const maxWait = 2000;
            const start = Date.now();
            let text = null;
            while (Date.now() - start < maxWait) {
                try {
                    text = await navigator.clipboard.readText();
                    if (text && text.startsWith("http") && text !== oldLink) break;
                } catch {}
                await new Promise(r => setTimeout(r, 150));
            }
            if (text && text.startsWith("http") && !addedLinks.has(text)) {
                lastClipboardLink = text;
                addRow(text);
                return text;
            }
            return null;
        }

        async function scanReviewsWithReply() {
            const sleep = ms => new Promise(r => setTimeout(r, ms));

            let waitStart = Date.now();
            while (!document.querySelector('textarea[aria-label="Trả lời"], textarea[aria-label="Reply"]')) {
                if (Date.now() - waitStart > 5000) break;
                await sleep(300);
            }

            let lastCount = 0;
            let stableTime = 0;

            while (stableTime < 1500) {
                const currentCount = document.querySelectorAll("review").length;

                if (currentCount === lastCount) {
                    stableTime += 300;
                } else {
                    stableTime = 0;
                    lastCount = currentCount;
                }

                await sleep(300);
            }

            const reviews = [...document.querySelectorAll("review")].filter(rev => rev.offsetParent !== null);
            let count = 0;
            for (const rev of reviews) {
                const replyBox = rev.querySelector('textarea[aria-label="Trả lời"], textarea[aria-label="Reply"]');
                const shareBtn = rev.querySelector(
                    '[debug-id="link-share-button"] button, button[debug-id="link-share-button"]'
                );
                if (replyBox && shareBtn) {
                    const oldLink = lastClipboardLink;

                    triggerAngularClick(shareBtn);

                    await sleep(250);

                    const popupInput = document.querySelector('input[type="text"][readonly]');

                    let newLink = null;

                    if (popupInput?.value?.startsWith("http")) {
                        newLink = popupInput.value;

                        if (!addedLinks.has(newLink)) {
                            addRow(newLink);
                            lastClipboardLink = newLink;
                        }
                    } else {
                        newLink = await captureClipboardLink(true, oldLink);
                    }
                    if (newLink) count++;
                    await new Promise(r => setTimeout(r, 400));
                }
            }
            updateInfo(`✅ Đã quét xong link ${count} review!`);
            return count;
        }

        async function autoSubmitReplies() {
            const reviews = [...document.querySelectorAll("review")].filter(rev => rev.offsetParent !== null);
            let done = 0;
            for (const rev of reviews) {
                const btn = rev.querySelector('[debug-id="submit-button"] button');
                if (btn && !btn.disabled) {
                    btn.click();
                    done++;
                    await new Promise(r => setTimeout(r, 300));
                }
            }
            updateInfo(`🚀 Đã đăng trả lời cho ${done} review!`);
            return done;
        }

        async function autoPasteAll() {
            const goodText = "Cảm ơn bạn rất nhiều vì đã tin dùng và yêu thích Zalopay. Phản hồi của bạn là động lực để đội ngũ Zalopay tiếp tục hoàn thiện và nâng cao chất lượng sản phẩm. Chúc bạn nhiều giao dịch thuận lợi và đừng ngần ngại cho biết nếu có điều gì Zalopay có thể làm tốt hơn nhé.";
            const badText = "";
            
            const reviews = [...document.querySelectorAll("review")].filter(rev => rev.offsetParent !== null);
            let goodCount = 0,
                badCount = 0;

            for (const rev of reviews) {
                const textArea = rev.querySelector('textarea[aria-label="Trả lời"], textarea[aria-label="Reply"]');
                if (textArea) {
                    const stars = rev.querySelectorAll("material-icon.star-filled").length;
                    const txt = stars > 3 ? goodText : badText;

                    fillTextarea(textArea, txt);

                    if (stars > 3) goodCount++;
                    else badCount++;

                    await new Promise(r => setTimeout(r, 200));
                }
            }

            updateInfo(`✅ Đã dán tự động:
    • ${goodCount} phản hồi Tốt
    • ${badCount} phản hồi Tệ`);

            return goodCount + badCount;
        }

        pasteAllBtn.onclick = autoPasteAll;

        document.querySelectorAll('button[debug-id="link-share-button"]')
            .forEach(btn => {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener("click", () => setTimeout(() => captureClipboardLink(false, lastClipboardLink), 200));
            });

        copyAllBtn.onclick = () => {
            const links = [...tbody.querySelectorAll("tr td:nth-child(2) a")].map(a => a.href);
            if (links.length) {
                navigator.clipboard.writeText(links.join("\n"));
                updateInfo("✅ Đã copy tất cả link!");
            } else updateInfo("⚠️ Không có link nào để copy.");
        };

        againBtn.onclick = () => {
            if (confirm("⚠️ Bạn có chắc muốn làm lại không?")) {
                box.remove();
                initReviewLinksWidget();
            }
        };
        scanBtn.onclick = scanReviewsWithReply;
        submitBtn.onclick = autoSubmitReplies;
        toggleBtn.onclick = () => toggleWidgets();

        const sleep = ms => new Promise(r => setTimeout(r, ms));

        let autoRunning = false;
        let rowsSelected = false;

        async function select50RowsOnce() {
            if (rowsSelected) return true;

            const sleep = ms => new Promise(r => setTimeout(r, ms));

            const labelContainer = [...document.querySelectorAll(".dropdown-label")]
                .find(el => el.textContent.includes("Số bài đánh giá trên mỗi trang"));

            if (!labelContainer) {
                updateInfo("❌ Không tìm thấy label page size");
                return false;
            }

            const container = labelContainer.closest(".dropdown-label-container");
            const button = container.querySelector("dropdown-button .button");

            if (!button) {
                updateInfo("❌ Không tìm thấy nút dropdown");
                return false;
            }

            const currentValue = button.querySelector(".button-text")?.textContent.trim();
            if (currentValue === "50") {
                updateInfo("✅ Bắt đầu chạy");
                rowsSelected = true;
                return true;
            }

            button.click();
            await sleep(800);

            const options = document.querySelectorAll("material-select-dropdown-item");

            let option50 = null;

            options.forEach(opt => {
                const label = opt.querySelector(".label");
                if (label && label.textContent.trim() === "50") {
                    option50 = opt;
                }
            });

            if (!option50) {
                updateInfo("❌ Không tìm thấy option 50");
                return false;
            }

            option50.click();

            rowsSelected = true;

            updateInfo("✅ Đã chuyển sang 50 dòng");

            await sleep(10000);

            return true;
        }

        autoBtn.onclick = async () => {
            if (autoRunning) {
                autoRunning = false;
                autoBtn.textContent = "Auto";
                autoBtn.style.background = "#f9fafb";
                autoBtn.style.color = "#000";
                autoBtn.dataset.active = "false";
                updateInfo("⛔ AUTO STOPPED");
                return;
            }

            autoRunning = true;
            autoBtn.textContent = "Stop";
            autoBtn.style.background = "#dc2626";
            autoBtn.style.color = "#fff";
            autoBtn.dataset.active = "true";

            updateInfo("🟢 AUTO START");
            await select50RowsOnce();

            while (autoRunning) {
                const scanCount = await scanReviewsWithReply();
                if (!autoRunning) break;

                const oldRange = getCurrentRangeText();

                if (scanCount > 0) {
                    updateInfo(`🟢 Đã quét ${scanCount} review`);
                    await sleep(5000);

                    await autoPasteAll();
                    if (!autoRunning) break;

                    await sleep(5000);

                    await autoSubmitReplies();
                    if (!autoRunning) break;

                    await sleep(20000);
                } 
                else {
                    updateInfo(`🔴 Không có review → NEXT [ ${oldRange} ]`);
                }

                nextPageBtn.click();
                if (!autoRunning) break;

                const changed = await waitForPageChange(oldRange);

                if (!changed) {
                    updateInfo("⚠️ Trang không đổi, có thể đã tới cuối.");
                    autoRunning = false;
                    break;
                }

                await sleep(1500);
            }

            autoRunning = false;
            autoBtn.textContent = "Auto";
            autoBtn.style.background = "#f9fafb";
            autoBtn.style.color = "#000";
            autoBtn.dataset.active = "false";
        };

        function toggleWidgets() {
            const el = document.getElementById("mini-excel-review-links");
            if (el) el.style.display = el.style.display === "none" ? "block" : "none";
        }

        function initFloatingToggleBtn() {
            const BTN_ID = "mini-excel-floating-toggle";
            document.getElementById(BTN_ID)?.remove();
            const btn = document.createElement("button");
            btn.id = BTN_ID;
            btn.textContent = "Show";
            Object.assign(btn.style, {
                position: "fixed",
                top: "70px",
                right: "50px",
                zIndex: 100000,
                display: "none",
                background: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                cursor: "pointer",
                fontSize: "16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
            });
            btn.onclick = toggleWidgets;
            document.body.appendChild(btn);
        }

        initFloatingToggleBtn();

        document.addEventListener("keydown", (e) => {
            if (document.activeElement.tagName === "TEXTAREA" || document.activeElement.tagName === "INPUT") return;

            if (e.ctrlKey && e.code === "Space") {
                e.preventDefault();
                toggleWidgets();
            }

            if (e.code === "ArrowLeft") {
                e.preventDefault();
                prevPageBtn.click();
            }

            if (e.code === "ArrowRight") {
                e.preventDefault();
                nextPageBtn.click();
            }
        });
    }

    initReviewLinksWidget();
})();
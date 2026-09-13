(function() {

    // ==========================
    // HÀM HỖ TRỢ
    // ==========================
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const getDelay = () => {
        const el = document.getElementById("delayInput");
        return Math.max(50, parseInt(el?.value || "200", 10));
    };

    async function selectDropdownChooseFirst(labelText, optionText) {
        const label = [...document.querySelectorAll(".fd-ticket-col label")]
            .find(l => l.innerText.trim().startsWith(labelText));
        if (!label) {
            console.warn("❗Không tìm thấy label", labelText);
            return false;
        }
        const col = label.closest(".fd-ticket-col");
        const trigger = col.querySelector(".ember-basic-dropdown-trigger");
        if (!trigger) {
            console.warn("❗Không tìm thấy trigger cho", labelText);
            return false;
        }

        ["mousedown", "mouseup", "click"].forEach(evt =>
            trigger.dispatchEvent(new MouseEvent(evt, {
                bubbles: true
            }))
        );

        await sleep(getDelay());

        const searchInput = document.querySelector(".ember-power-select-search-input");
        if (!searchInput) {
            console.warn("⚠️ Không tìm thấy ô search cho", labelText);
            return false;
        }

        searchInput.focus();
        searchInput.value = optionText || "";
        searchInput.dispatchEvent(new Event("input", {
            bubbles: true
        }));

        await sleep(getDelay());

        const opt = document.querySelector(".ember-power-select-option");
        if (!opt) {
            console.warn(`❗Không tìm thấy option cho "${labelText}"`);
            return false;
        }

        ["mousedown", "mouseup", "click"].forEach(evt =>
            opt.dispatchEvent(new MouseEvent(evt, {
                bubbles: true
            }))
        );
        return true;
    }

    // ==========================
    // TẠO MINI-EXCEL (1 BẢNG)
    // ==========================
    const OLD = document.getElementById("mini-excel-tool");
    if (OLD) OLD.remove();

    const box = document.createElement("div");
    box.id = "mini-excel-tool";
    box.style.cssText = `
    position:fixed;
    top:40px; left:40px;
    z-index:99999;
    background:#fdfdfd;
    border:1px solid #ccc;
    border-radius:10px;
    padding:12px 12px 70px 12px;
    box-shadow:0 6px 18px rgba(0,0,0,0.2);
    font-family:Segoe UI, Arial, sans-serif;
    font-size:13px;
    min-width:400px;
    min-height:340px;
    width:640px;     /* bắt buộc width */
    height:340px;    /* bắt buộc height */
    box-sizing:border-box;  /* ✅ quan trọng */
    transition:all .2s ease;
    resize:both;
    overflow:auto;
`;


    box.innerHTML = `
    <style>
      #mini-excel-table, #mini-excel-table th, #mini-excel-table td, #mini-excel-table input { box-sizing: border-box; }
      #mini-excel-table thead th { position: sticky; top: 0; background: #4285f4; color: #fff; z-index: 10; }
      #mini-excel-table td input { width: 100%; border: 1px solid #bbb; padding: 4px; border-radius: 4px; background: #fff; }
      #mini-excel-scroll { width: 100%; overflow-y: auto; }
    </style>
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <strong style="font-size:15px;">⚡ Ticket Tool ~ Hide/Show (Ctrl + X)</strong>
       <div>
        <button id="importExcelBtn" style="margin-right:6px;padding:2px 8px;border-radius:5px;border:1px solid #999;background:#eee;cursor:pointer;display:none;">Import Excel</button>
        <button id="toggleViewBtn" style="margin-right:6px;padding:2px 8px;border-radius:5px;border:1px solid #999;background:#eee;cursor:pointer;display:none;">Ẩn (Ctrl + X)</button>
        <button id="resetTableBtn" style="margin-right:6px;padding:2px 8px;border-radius:5px;border:1px solid #999;background:#eee;cursor:pointer;display:none;">Reset Table</button>
        <button id="Resolve" style="margin-right:6px;padding:2px 8px;border-radius:5px;border:1px solid #999;background:#eee;cursor:pointer;">Resolve</button>
        <button id="closeMiniExcel" style="background:transparent;border:none;font-size:18px;cursor:pointer;">✖</button>
      </div>
</div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <input
            id="sheetLinkInput"
            placeholder="🔗 Dán link Google Sheets (public)"
            style="width:100%;padding:4px 6px;border:1px solid #bbb;border-radius:5px;font-size:12px;"
        >
    </div>
    

    <div style="border:1px solid #ccc;border-radius:6px;overflow:hidden;">
      <div id="mini-excel-scroll">
        <table id="mini-excel-table" style="width:100%;border-collapse:collapse;table-layout:fixed;">
          <colgroup>
            <col style="width:26%;">
            <col style="width:22%;">
            <col style="width:18%;">
            <col style="width:18%;"> <!-- GROUP -->
            <col style="width:8%;">
            <col style="width:8%;">
          </colgroup>
          <thead>
            <tr>
              <th style="padding:6px;border:1px solid #ccc;text-align:left;">YÊU CẦU</th>
              <th style="padding:6px;border:1px solid #ccc;text-align:left;">CHI TIẾT VẤN ĐỀ</th>
              <th style="padding:6px;border:1px solid #ccc;text-align:left;">ĐỐI TÁC</th>
              <th style="padding:6px;border:1px solid #ccc;text-align:left;">GROUP</th>
              <th style="padding:6px;border:1px solid #ccc;text-align:center;">Do</th>
              <th style="padding:6px;border:1px solid #ccc;text-align:center;">Del</th>
            </tr>
          </thead>
          <tbody id="mini-excel-body">
            <tr>
              <td style="border:1px solid #ccc;padding:4px;"><input value="Others"></td>
              <td style="border:1px solid #ccc;padding:4px;"><input value="No support"></td>
              <td style="border:1px solid #ccc;padding:4px;"><input value="None"></td>
              <td style="border:1px solid #ccc;padding:4px;"><input value="Fanpage"></td>
              <td style="border:1px solid #ccc;text-align:center;"><button class="doAction" style="padding:4px 8px;border-radius:4px;border:1px solid #4285f4;background:#4285f4;color:#fff;cursor:pointer;">▶</button></td>
              <td style="border:1px solid #ccc;text-align:center;"><button class="deleteRow" style="padding:4px 8px;border-radius:4px;border:1px solid #d33;background:#d33;color:#fff;cursor:pointer;">🗑️</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
      <button id="addRowBtn" style="padding:4px 12px;border-radius:5px;border:1px solid #28a745;background:#28a745;color:#fff;cursor:pointer;">+ Add row</button>
      <label>Resolved:
        <input id="resolved" type="number" value="0" style="width:80px;padding:4px;border:1px solid #bbb;border-radius:5px;text-align:right;" readonly>
      </label>
      <label>Delay(ms):
        <input id="delayInput" type="number" min="50" value="0" style="width:80px;padding:4px;border:1px solid #bbb;border-radius:5px;text-align:right;">
      </label>
      <label>Subject:
        <input id="subjectInput" style="width:150px;padding:4px;border:1px solid #bbb;border-radius:5px;" value="PhuongNt32">
      </label>
      <label>Width(px):
        <input id="widthInput" type="number" style="width:80px;padding:4px;border:1px solid #bbb;border-radius:5px;text-align:right;" value="640">
      </label>
      <label>Height(px):
        <input id="heightInput" type="number" style="width:80px;padding:4px;border:1px solid #bbb;border-radius:5px;text-align:right;" value="340">
      </label>
    </div>
  `;

    document.body.appendChild(box);
    // ==========================
    // IMPORT EXCEL XLSX
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

        // Load SheetJS library nếu chưa có
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
                const workbook = XLSX.read(data, {
                    type: "array"
                });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(firstSheet, {
                    header: 1
                });
               const tbody = document.getElementById("mini-excel-body");

            // 🔥 TẮT observer trước khi append nhiều row
            observer.disconnect();
            cachedRowHeight = null;

            json.forEach(row => {
                const [yeuCau, chiTiet, doiTac, group] = row;

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><input value="${yeuCau || ''}"></td>
                    <td><input value="${chiTiet || ''}"></td>
                    <td><input value="${doiTac || ''}"></td>
                    <td><input value="${group || ''}"></td>
                    <td style="text-align:center;"><button class="doAction">▶</button></td>
                    <td style="text-align:center;"><button class="deleteRow">🗑️</button></td>
                `;
                tbody.appendChild(tr);
            });


            // 🔥 BẬT LẠI observer sau khi import xong
            observer.observe(miniBody, { childList: true });
                updateTbodyHeightDebounced();
            };
            reader.readAsArrayBuffer(file);
        }
    };

    // ==========================
    // IMPORT GOOGLE SHEETS (LINK)
    // ==========================
    const sheetInput = document.getElementById("sheetLinkInput");
    const SHEET_KEY = "__mini_excel_sheet_link__";

    // load lại link cũ nếu có
    const savedLink = localStorage.getItem(SHEET_KEY);
    if (savedLink) {
        sheetInput.value = savedLink;
        loadGoogleSheet(savedLink);
    }

    let sheetTimer = null;
    sheetInput.addEventListener("input", () => {
        clearTimeout(sheetTimer);
        sheetTimer = setTimeout(() => {
            const url = sheetInput.value.trim();

            // 🔥 TRƯỜNG HỢP XÓA LINK
            if (!url) {
                localStorage.removeItem(SHEET_KEY);

                observer.disconnect();
                cachedRowHeight = null;

                document.getElementById("mini-excel-body").innerHTML = "";

                observer.observe(miniBody, { childList: true });
                updateTbodyHeightDebounced();
                return;
            }


            // 🔥 CÓ LINK → LOAD
            localStorage.setItem(SHEET_KEY, url);
            loadGoogleSheet(url);

        }, 600);
    });


    async function loadGoogleSheet(url) {
        try {
            const match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
            if (!match) throw "Invalid sheet link";

            const sheetId = match[1];
            const gidMatch = url.match(/gid=(\d+)/);
            const gid = gidMatch ? gidMatch[1] : "0";

            const jsonUrl =
                `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?gid=${gid}&tqx=out:json`;

            const res = await fetch(jsonUrl);
            const text = await res.text();

            const json = JSON.parse(
                text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
            );

            const rows = json.table.rows;
            const tbody = document.getElementById("mini-excel-body");

            // 🔥 TẮT observer trước khi clear + append nhiều row
            observer.disconnect();
            cachedRowHeight = null;

            tbody.innerHTML = ""; // clear cũ


            rows.forEach(r => {
                if (!r.c || r.c.length < 4) return;

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td style="border:1px solid #ccc;padding:4px;"><input value="${r.c[0]?.v || ''}"></td>
                    <td style="border:1px solid #ccc;padding:4px;"><input value="${r.c[1]?.v || ''}"></td>
                    <td style="border:1px solid #ccc;padding:4px;"><input value="${r.c[2]?.v || ''}"></td>
                    <td style="border:1px solid #ccc;padding:4px;"><input value="${r.c[3]?.v || ''}"></td>
                    <td style="border:1px solid #ccc;text-align:center;">
                    <button class="doAction" style="padding:4px 8px;border-radius:4px;border:1px solid #4285f4;background:#4285f4;color:#fff;">▶</button>
                    </td>
                    <td style="border:1px solid #ccc;text-align:center;">
                    <button class="deleteRow" style="padding:4px 8px;border-radius:4px;border:1px solid #d33;background:#d33;color:#fff;">🗑️</button>
                    </td>`;
                tbody.appendChild(tr);
            });
            observer.observe(miniBody, { childList: true });
            updateTbodyHeightDebounced();

        } catch (e) {
            console.error(e);
            alert("❌ Không load được Google Sheet (link sai hoặc chưa public)");
        }
    }



    // ==========================
    // KÍCH THƯỚC BOX
    // ==========================
    const widthInput = document.getElementById("widthInput");
    const heightInput = document.getElementById("heightInput");

    function updateBoxSize() {
        box.style.width = widthInput.value + "px";
        box.style.height = heightInput.value + "px";
        updateTbodyHeightDebounced(); // ✅
    }


    widthInput.addEventListener("input", updateBoxSize);
    heightInput.addEventListener("input", updateBoxSize);

    new ResizeObserver(() => {
        widthInput.value = box.offsetWidth;
        heightInput.value = box.offsetHeight;
        updateTbodyHeightDebounced();
    }).observe(box);

    // ==========================
    // GIỚI HẠN 8 DÒNG (1 TABLE + sticky header)
    // ==========================
    const maxVisibleRows = 8;
    const scrollContainer = document.getElementById("mini-excel-scroll");
    const table = document.getElementById("mini-excel-table");
    const miniBody = document.getElementById("mini-excel-body");
    let cachedRowHeight = null;

    function getRowHeight() {
        if (cachedRowHeight) return cachedRowHeight;
        const row = miniBody.querySelector("tr");
        if (!row) return 24;
        cachedRowHeight = row.getBoundingClientRect().height || 24;
        return cachedRowHeight;
    }


    function updateTbodyHeight() {
        const rows = miniBody.querySelectorAll("tr");
        const rowCount = rows.length;
        if (rowCount === 0) {
            scrollContainer.style.maxHeight = "0px";
            return;
        }

        // đo chiều cao header và 1 hàng thực tế
        const header = table.querySelector("thead");
        const headerRect = header.getBoundingClientRect();
        const headerH = headerRect.height || 0;

        // chọn 1 hàng làm chuẩn (nếu bạn có hàng cao hơn do wrap text, có thể lấy max của vài hàng)
        const rowH = getRowHeight();

        const visibleRows = Math.min(rowCount, maxVisibleRows);
        // tổng chiều cao = header + visibleRows * rowH
        const totalH = Math.round(headerH + visibleRows * rowH);

        scrollContainer.style.maxHeight = totalH + "px";
        scrollContainer.style.overflowY = rowCount > maxVisibleRows ? "auto" : "hidden";
    }

    // 🔥 debounce bằng requestAnimationFrame
    const updateTbodyHeightDebounced = (() => {
        let raf = null;
        return () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = null;
                updateTbodyHeight(); // ✅ CHỈ gọi hàm gốc
            });
        };
    })();



    // observer thay đổi số lượng hàng
    const observer = new MutationObserver(updateTbodyHeightDebounced);
    observer.observe(miniBody, {
        childList: true
    });
    window.addEventListener("resize", updateTbodyHeightDebounced);
    updateTbodyHeightDebounced();

    // ==========================
    // EVENTS: add/delete/click
    // ==========================
    document.getElementById("closeMiniExcel").onclick = () => {
    observer.disconnect();
    window.removeEventListener("resize", updateTbodyHeightDebounced);
    box.remove();
    };  


    const toggleBtn = document.getElementById("toggleViewBtn");
    let hiddenState = false;
    toggleBtn.onclick = () => {
        hiddenState = !hiddenState;
        document.querySelector("#mini-excel-table").style.display = hiddenState ? "none" : "";
        document.getElementById("addRowBtn").style.display = hiddenState ? "none" : "";
        document.getElementById("delayInput").parentElement.style.display = hiddenState ? "none" : "";
        document.getElementById("subjectInput").parentElement.style.display = hiddenState ? "none" : "";
        widthInput.parentElement.style.display = hiddenState ? "none" : "";
        heightInput.parentElement.style.display = hiddenState ? "none" : "";
        toggleBtn.innerText = hiddenState ? "Hiện" : "Ẩn";
    };

    document.getElementById("addRowBtn").onclick = () => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td style="border:1px solid #ccc;padding:4px;"><input placeholder=""></td>
      <td style="border:1px solid #ccc;padding:4px;"><input placeholder=""></td>
      <td style="border:1px solid #ccc;padding:4px;"><input placeholder=""></td>
      <td style="border:1px solid #ccc;padding:4px;"><input placeholder=""></td>
      <td style="border:1px solid #ccc;text-align:center;"><button class="doAction" style="padding:4px 8px;border-radius:4px;border:1px solid #4285f4;background:#4285f4;color:#fff;cursor:pointer;">▶</button></td>
      <td style="border:1px solid #ccc;text-align:center;"><button class="deleteRow" style="padding:4px 8px;border-radius:4px;border:1px solid #d33;background:#d33;color:#fff;cursor:pointer;">🗑️</button></td>
    `;
        miniBody.appendChild(tr);
        updateTbodyHeightDebounced();
    };

    box.addEventListener("click", async e => {
        if (e.target.classList.contains("doAction")) {
            try {
                // ====== Đoạn 1: Click Resolve & Create Ticket In Freshdesk ======
                await new Promise(resolve => {
                    const btn = document.querySelector('.split-button.resolve-action.custom-split-dropdown[role="button"]');
                    if (!btn) {
                        alert('❌ Không tìm thấy nút dropdown Resolve');
                        resolve();
                        return;
                    }

                    btn.click();

                    const simulateClick = (el) => ['mousedown', 'mouseup', 'click'].forEach(evt => {
                        el.dispatchEvent(new MouseEvent(evt, {
                            bubbles: true
                        }));
                    });

                    const trySelect = () => {
                        const options = document.querySelectorAll('.ember-power-select-option');
                        for (const opt of options) {
                            if (opt.innerText.replace(/\s+/g, ' ').trim().toLowerCase() === 'resolve and create ticket in freshdesk') {
                                simulateClick(opt);
                                return true;
                            }
                        }
                        return false;
                    };

                    let tries = 0;
                    const timer = setInterval(() => {
                        tries++;
                        if (trySelect() || tries > 50) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 200);
                });

                // ====== Đoạn 2: Chờ đủ label trước khi chọn dropdown ======
                const tr = e.target.closest("tr");
                const yeuCau = tr.children[0].querySelector("input").value.trim();
                const chiTiet = tr.children[1].querySelector("input").value.trim();
                const doiTac = tr.children[2].querySelector("input").value.trim();
                const group = tr.children[3].querySelector("input").value.trim();
                const subjVal = document.getElementById("subjectInput").value.trim() || "PhuongNt32";

                const waitForLabel = async (labelText, timeout = 5000) => {
                    const interval = 100;
                    let elapsed = 0;
                    while (elapsed < timeout) {
                        const label = [...document.querySelectorAll(".fd-ticket-col label")]
                            .find(l => l.innerText.trim().startsWith(labelText));
                        if (label) return label;
                        await new Promise(r => setTimeout(r, interval));
                        elapsed += interval;
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
                    subj.dispatchEvent(new Event("input", {
                        bubbles: true
                    }));
                }

                await selectDropdownChooseFirst("Yêu cầu", yeuCau);
                await selectDropdownChooseFirst("Chi tiết vấn đề", chiTiet);
                await selectDropdownChooseFirst("Đối tác", doiTac);
                await selectDropdownChooseFirst("Group", group);

            } finally {
                // 💡 Đặt ở đây đảm bảo chỉ clear sau khi xong (kể cả có lỗi vẫn chạy)
                console.clear();
            }
        }

        if (e.target.classList.contains("deleteRow")) {
            e.target.closest("tr").remove();
            updateTbodyHeightDebounced();
        }
    });

    // tránh gắn sự kiện nhiều lần
    if (window.__resolveBound) return;
    window.__resolveBound = true;

    document.addEventListener("click", function(e) {
        if (e.target.closest("#Resolve")) {
            var realBtn = document.querySelector(".split-button-resolve");
            if (realBtn) {
                realBtn.click();
                console.log("Custom Resolve clicked → Real Resolve triggered");
            }
        }
    });

    // Resolved
    const input = document.getElementById('resolved');
    document.addEventListener(
        'mousedown',
        function(e) {
            const btn = e.target.closest(
                'button[aria-label="Resolve and create ticket"]'
            );
            if (!btn || !input) return;

            // delay nhẹ để tránh Ember kill DOM
            setTimeout(() => {
                input.value = (+input.value || 0) + 1;
            }, 0);
        },
        true // 🔥 capture phase (rất quan trọng)
    );




    document.getElementById("resetTableBtn").onclick = () => {
        const tbody = document.getElementById("mini-excel-body");
        observer.disconnect();
        cachedRowHeight = null;

        tbody.innerHTML = ""; // xóa tất cả row hiện tại

        observer.observe(miniBody, { childList: true });
        updateTbodyHeightDebounced();

        // Tạo lại 1 row mặc định nếu muốn
        const tr = document.createElement("tr");
        tr.innerHTML = `
    <td style="border:1px solid #ccc;padding:4px;"><input value="Others"></td>
    <td style="border:1px solid #ccc;padding:4px;"><input value="No support"></td>
    <td style="border:1px solid #ccc;padding:4px;"><input value="None"></td>
    <td style="border:1px solid #ccc;padding:4px;"><input value="Fanpage"></td>
    <td style="border:1px solid #ccc;text-align:center;"><button class="doAction" style="padding:4px 8px;border-radius:4px;border:1px solid #4285f4;background:#4285f4;color:#fff;cursor:pointer;">▶</button></td>
    <td style="border:1px solid #ccc;text-align:center;"><button class="deleteRow" style="padding:4px 8px;border-radius:4px;border:1px solid #d33;background:#d33;color:#fff;cursor:pointer;">🗑️</button></td>
  `;
        tbody.appendChild(tr);

        updateTbodyHeightDebounced(); // cập nhật chiều cao scroll
    };


    document.addEventListener("keydown", e => {
        if (e.ctrlKey && e.key.toLowerCase() === "x") {
            box.style.display = (box.style.display === "none" ? "block" : "none");
        }
    });
    (function enableDrag(el) {
        let offsetX = 0,
            offsetY = 0,
            isDown = false,
            startX = 0,
            startY = 0;

        const header = el.querySelector("div"); // header đầu tiên
        header.style.cursor = "move";

        header.addEventListener("mousedown", e => {
            isDown = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            offsetX = rect.left;
            offsetY = rect.top;
            document.body.style.userSelect = "none";
        });

        document.addEventListener("mouseup", () => {
            isDown = false;
            document.body.style.userSelect = "";
        });

        document.addEventListener("mousemove", e => {
            if (!isDown) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = offsetX + dx + "px";
            el.style.top = offsetY + dy + "px";
            el.style.transform = "";

        });
    })(box);

})();
(() => {
    window.onbeforeunload = () => true;

    function initReviewLinksWidget() {
        const ID = "mini-excel-review-links";
        document.getElementById(ID)?.remove();

        // -------- BOX (KHÔNG SCROLL Ở ĐÂY NỮA) --------
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
            autoBtn,
            // toggleBtn,
            copyAllBtn,
            scanBtn,
            pasteAllBtn,
            submitBtn,
            // prevPageBtn,
            // nextPageBtn
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

                await sleep(150); // polling nhanh hơn
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

        // ---------- TABLE ----------
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

        // ----------- SCROLL WRAPPER (fix vỡ table) ---------
        const scrollWrap = document.createElement("div");
        Object.assign(scrollWrap.style, {
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #e5e7eb"
        });
        scrollWrap.appendChild(table);

        // ---------- INFO PANEL ----------
        const infoPanel = document.createElement("div");
        Object.assign(infoPanel.style, {
            marginTop: "10px",
            padding: "10px",
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            whiteSpace: "pre-line"
        });
        infoPanel.textContent = "🟢 Ready...";

        box.append(header, scrollWrap, infoPanel);

        document.body.appendChild(box);

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

            // Tạo thẻ a
            const a = document.createElement("a");
            a.href = link;
            a.textContent = link;
            a.target = "_blank"; // 🔥 mở tab mới
            a.rel = "noopener"; // an toàn

            td2.appendChild(a);
            Object.assign(td2.style, {
                border: "1px solid #e5e7eb",
                padding: "6px",
                wordBreak: "break-all"
            });

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
                addedLinks.delete(link)
            };
            td3.appendChild(delBtn);

            row.append(td1, td2, td3);
            tbody.appendChild(row);

            // -------- AUTO SCROLL XUỐNG HÀNG MỚI --------
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
                await new Promise(r => setTimeout(r, 150))
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

            // Đợi textarea xuất hiện tối đa 5s
            let waitStart = Date.now();
            while (!document.querySelector('textarea[aria-label="Trả lời"], textarea[aria-label="Reply"]')) {
                if (Date.now() - waitStart > 5000) break;
                await sleep(300);
            }

            // Đợi review render đủ (ổn định 1.5s không thay đổi)
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

                    // Ưu tiên popup link
                    const popupInput = document.querySelector(
                        'input[type="text"][readonly]'
                    );

                    let newLink = null;

                    if (popupInput?.value?.startsWith("http")) {

                        newLink = popupInput.value;

                        if (!addedLinks.has(newLink)) {
                            addRow(newLink);
                            lastClipboardLink = newLink;
                        }

                    } else {

                        newLink = await captureClipboardLink(
                            true,
                            oldLink
                        );
                    }
                    if (newLink) count++;
                    await new Promise(r => setTimeout(r, 400));
                }
            }
            updateInfo(`✅ Đã quét xong link ${count} review!`);
            return count;
        }

        // function hasUnrepliedReviews() {
        //     const reviews = [...document.querySelectorAll("review")].filter(rev => rev.offsetParent !== null);

        //     for (const rev of reviews) {
        //         const textarea = rev.querySelector('textarea[aria-label="Trả lời"], textarea[aria-label="Reply"]');
        //         const submitBtn = rev.querySelector('material-button[debug-id="submit-button"] button');

        //         if (textarea && submitBtn) {
        //             return true; // còn review chưa xử lý
        //         }
        //     }

        //     return false; // không còn review
        // }
        
        async function autoSubmitReplies() {
            const reviews = [...document.querySelectorAll("review")].filter(rev => rev.offsetParent !== null);
            let done = 0;
            for (const rev of reviews) {
                const btn = rev.querySelector('[debug-id="submit-button"] button');
                if (btn && !btn.disabled) {
                    btn.click();
                    done++;
                    await new Promise(r => setTimeout(r, 300))
                };
            }
            updateInfo(`🚀 Đã đăng trả lời cho ${done} review!`);
            return done;
        }

        // AUTO PASTE ALL
        async function autoPasteAll() {

            const goodText = "Cảm ơn bạn đã yêu mến và dành lời khen cho Zalopay. Chúng mình sẽ tiếp tục hoàn thiện và nâng cao chất lượng dịch vụ ngày một tốt hơn!";
            const badText = "Chúng mình rất tiếc vì trải nghiệm không tốt của bạn. Bạn vui lòng vào ứng dụng Zalopay >> chọn 'Tài khoản' >> 'Trung tâm hỗ trợ' và cung cấp thông tin liên quan để có thể được hỗ trợ nhanh nhất nhé!";

            const reviews = [...document.querySelectorAll("review")].filter(rev => rev.offsetParent !== null);
            let goodCount = 0,
                badCount = 0;

            for (const rev of reviews) {

                const textArea = rev.querySelector('textarea[aria-label="Trả lời"], textarea[aria-label="Reply"]');
                if (textArea) {

                    const stars = rev.querySelectorAll("material-icon.star-filled").length;
                    const txt = stars > 3 ? goodText : badText;

                    textArea.focus();

                    const nativeSetter =
                        Object.getOwnPropertyDescriptor(
                            HTMLTextAreaElement.prototype,
                            "value"
                        ).set;

                    nativeSetter.call(textArea, txt);

                    textArea.dispatchEvent(
                        new InputEvent("input", {
                            bubbles: true,
                            inputType: "insertText",
                            data: txt
                        })
                    );

                    textArea.dispatchEvent(
                        new Event("change", {
                            bubbles: true
                        })
                    );

                    if (stars > 3) goodCount++;
                    else badCount++;

                    await new Promise(r => setTimeout(r, 200)); // 🔥 cho Angular kịp render
                }
            }

            updateInfo(`✅ Đã dán tự động:
    • ${goodCount} phản hồi Tốt
    • ${badCount} phản hồi Tệ`);

            return goodCount + badCount;
        }

        pasteAllBtn.onclick = autoPasteAll;


        // GẮN NÚT SHARE
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
                initReviewLinksWidget()
            }
        };
        scanBtn.onclick = scanReviewsWithReply;
        submitBtn.onclick = autoSubmitReplies;
        toggleBtn.onclick = () => toggleWidgets();

        const sleep = ms => new Promise(r => setTimeout(r, ms));

        let autoRunning = false;
        let rowsSelected = false;

        // TÌM PAGE 50 CMT
        async function select50RowsOnce() {

    if (rowsSelected) return true;

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // 1️⃣ Tìm dropdown theo label tiếng Việt (ổn định nhất)
    const labelContainer = [...document.querySelectorAll(".dropdown-label")]
        .find(el => el.textContent.includes("Số bài đánh giá trên mỗi trang"));

    if (!labelContainer) {
        updateInfo("❌ Không tìm thấy label page size");
        return false;
    }

    // 2️⃣ Tìm nút dropdown trong cùng container
    const container = labelContainer.closest(".dropdown-label-container");
    const button = container.querySelector("dropdown-button .button");

    if (!button) {
        updateInfo("❌ Không tìm thấy nút dropdown");
        return false;
    }

    // Nếu đã là 50 thì khỏi chọn
    const currentValue = button.querySelector(".button-text")?.textContent.trim();
    if (currentValue === "50") {
        updateInfo("✅ Bắt đầu chạy");
        rowsSelected = true;
        return true;
    }

    // 3️⃣ Click mở dropdown
    button.click();
    await sleep(800);

    // 4️⃣ Tìm option 50
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

    await sleep(10000); // chờ 10s

    return true;
}


        autoBtn.onclick = async () => {

            // Nếu đang chạy → bấm sẽ STOP
            if (autoRunning) {
                autoRunning = false;
                autoBtn.textContent = "Auto";
                autoBtn.style.background = "#f9fafb";
                autoBtn.style.color = "#000";
                autoBtn.dataset.active = "false";
                updateInfo("⛔ AUTO STOPPED");
                return;
            }

            // Nếu đang dừng → bấm sẽ START
            autoRunning = true;
            autoBtn.textContent = "Stop";
            autoBtn.style.background = "#dc2626";
            autoBtn.style.color = "#fff";
            autoBtn.dataset.active = "true";

            updateInfo("🟢 AUTO START");
            await select50RowsOnce();

           while (autoRunning) {
                // 1️⃣ Scan
                const scanCount = await scanReviewsWithReply();
                if (!autoRunning) break;

                const oldRange = getCurrentRangeText();

                // 2️⃣ Nếu có review → xử lý trước
                if (scanCount > 0) {

                    updateInfo(`🟢 Đã quét ${scanCount} review`);
                    await sleep(5000);

                    // Paste
                    await autoPasteAll();
                    if (!autoRunning) break;

                    await sleep(5000);

                    // Submit
                    await autoSubmitReplies();
                    if (!autoRunning) break;

                    await sleep(20000);
                } 
                else {
                    updateInfo(`🔴 Không có review → NEXT [ ${oldRange} ]`);
                }

                // 3️⃣ NEXT (luôn luôn next)
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




            // Khi vòng lặp kết thúc
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

            // Nếu đang nhập trong textarea thì bỏ qua
            if (document.activeElement.tagName === "TEXTAREA") return;

            if (e.ctrlKey && e.code === "Space") {
                e.preventDefault();
                toggleWidgets();
            }

            // Mũi tên trái → Prev
            if (e.code === "ArrowLeft") {
                e.preventDefault();
                prevPageBtn.click();
            }

            // Mũi tên phải → Next
            if (e.code === "ArrowRight") {
                e.preventDefault();
                nextPageBtn.click();
            }
        });
    }

    initReviewLinksWidget();
})();

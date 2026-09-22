// 8. ĐỌC / XUẤT FILE EXCEL TIÊU CHUẨN
// ==========================================
function triggerExcelImport(groupId) {
    const fileInput = getEl('excelScheduleInput');
    if (fileInput) fileInput.setAttribute('data-target-group-id', groupId);
    state.activeGroupId = groupId;
    
    const huongDanHTML = `
        <p style="color:var(--text-sub);font-size:13px;text-align:left;margin-bottom:15px">Please prepare an Excel file with the following standard column headers:</p>
        <div style="overflow-x:auto;margin-bottom:15px;border:1px solid var(--border-color);border-radius:8px">
            <table style="width:100%;border-collapse:collapse;font-size:11px;text-align:left">
                <thead><tr style="background:var(--schedule-accent);color:white"><th style="padding:6px 8px">Date</th><th style="padding:6px 8px">Time</th><th style="padding:6px 8px">EndDate</th><th style="padding:6px 8px">EndTime</th><th style="padding:6px 8px">Task</th><th style="padding:6px 8px">Important</th><th style="padding:6px 8px">Content</th></tr></thead>
                <tbody><tr><td style="padding:6px 8px;color:var(--text-sub)">2026-06-16</td><td style="padding:6px 8px;color:var(--text-sub)">08:00</td><td style="padding:6px 8px;color:var(--text-sub)">2026-06-16</td><td style="padding:6px 8px;color:var(--text-sub)">12:00</td><td>Core meeting</td><td style="padding:6px 8px;color:var(--text-sub)">TRUE</td><td style="padding:6px 8px;color:var(--text-sub)">Content...</td></tr></tbody>
            </table>
        </div>`;

    const alertBox = getEl('alertModal')?.querySelector('.modal-box');
    if (alertBox) {
        alertBox.style.maxWidth = "600px";
        const titleH3 = alertBox.querySelector('h3');
        if (titleH3) { titleH3.innerHTML = "📊 Standard Schedule Excel Structure"; titleH3.style.color = "var(--text-main)"; }
        getEl('alertMessage').innerHTML = huongDanHTML;
        
        const resetAlertModal = () => {
            if (titleH3) { titleH3.innerHTML = "⚠️ Notice"; titleH3.style.color = "var(--danger-color)"; }
            if (gocBtn) gocBtn.style.display = 'block';
            alertBox.querySelector('.modal-footer-excel')?.remove();
        };

        const closeX = alertBox.querySelector('.close-modal-x');
        if (closeX) closeX.onclick = () => { closeModal('alertModal'); resetAlertModal(); };
        
        let footer = alertBox.querySelector('.modal-footer-excel') || document.createElement('div');
        footer.className = 'modal-footer-excel';
        Object.assign(footer.style, { display:'flex', justifyContent:'center', gap:'12px', marginTop:'20px' });
        getEl('alertMessage').after(footer);
        
        const gocBtn = alertBox.querySelector('.btn-primary');
        if (gocBtn) gocBtn.style.display = 'none';

        footer.innerHTML = `
            <button class="btn-secondary" style="background-color:var(--accent-color);color:#fff!important;padding:10px 16px" onclick="downloadExcelTemplate(this)">📥 Download Template</button>
            <button class="btn-success" style="padding:10px 16px" id="btnConfirmExcelSelect">🎯 Choose Excel File</button>
        `;

        getEl('btnConfirmExcelSelect').onclick = function() { closeModal('alertModal'); resetAlertModal(); setTimeout(() => { getEl('excelScheduleInput')?.click(); }, 200); };
    }
    openModal('alertModal');
}

// Share one in-flight request. A failed load can be retried on the next action.
let excelLibraryPromise = null;
function ensureExcelLibrary() {
    if (typeof XLSX !== 'undefined') return Promise.resolve(XLSX);
    if (excelLibraryPromise) return excelLibraryPromise;
    excelLibraryPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        script.async = true;
        let settled = false;
        const finish = error => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            script.onload = script.onerror = null;
            if (error) {
                script.remove();
                reject(error);
            } else resolve(XLSX);
        };
        const timer = setTimeout(() => finish(new Error('Excel loading timed out. Check your connection and try again.')), 20000);
        script.onload = () => finish(typeof XLSX === 'undefined' ? new Error('Excel could not start. Please try again.') : null);
        script.onerror = () => finish(new Error('Could not load Excel. Check your connection and try again.'));
        document.head.appendChild(script);
    }).catch(error => {
        excelLibraryPromise = null;
        throw error;
    });
    return excelLibraryPromise;
}

async function withExcelLibrary(button, action) {
    if (button?.disabled) return;
    const label = button?.textContent;
    if (button) { button.disabled = true; button.textContent = 'Loading Excel…'; }
    try {
        await ensureExcelLibrary();
        await action();
    } catch (error) {
        alert(error.message || 'Excel could not complete this action. Please try again.');
    } finally {
        if (button) { button.disabled = false; button.textContent = label; }
    }
}

async function downloadExcelTemplate(button) {
    return withExcelLibrary(button, () => {
        const sampleData = [
            { "Date": "2026-06-16", "Time": "18:00", "EndDate": "2026-06-16", "EndTime": "22:00", "Task": "GHTK Evening Shift", "Important": "FALSE", "Content": "Operations shift" },
            { "Date": "2026-06-17", "Time": "08:30", "EndDate": "2026-06-17", "EndTime": "11:30", "Task": "Daily Standup", "Important": "TRUE", "Content": "Progress report" }
        ];
        const ws = XLSX.utils.json_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "LichTrinhMau");
        XLSX.writeFile(wb, "mau_import_lich_trinh_countdown.xlsx");
    });
}

getEl('excelScheduleInput')?.addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const targetGroupId = this.getAttribute('data-target-group-id') || state.activeGroupId;
    const group = getGroup(targetGroupId);
    if (!group) { this.value = ''; return; }
    try {
        this.disabled = true;
        await ensureExcelLibrary();
    } catch (error) {
        this.value = '';
        alert(error.message);
        return;
    } finally {
        this.disabled = false;
    }
    // Do not import into a deleted/replaced group after an asynchronous load.
    if (getGroup(targetGroupId) !== group) { this.value = ''; return; }

    const reader = new FileReader();
    reader.onerror = () => { event.target.value = ''; alert('Could not read this file. Please try again.'); };
    reader.onload = function(e) {
        try {
            if (getGroup(targetGroupId) !== group) return;
            const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
            const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            if (!rawData?.length) return alert("Excel file is empty!");
            
            const parseTime = t => {
                if (!t || String(t).trim() === "undefined") return "00:00";
                let s = String(t).toLowerCase().trim();
                if (!isNaN(s) && parseFloat(s) > 0 && parseFloat(s) < 1) {
                    const sec = Math.round(parseFloat(s) * 86400);
                    return `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor((sec%3600)/60)).padStart(2,'0')}`;
                }
                const pm = s.includes('pm') || s.includes('ch') || s.includes('pm');
                const am = s.includes('am') || s.includes('sa') || s.includes('am');
                s = s.replace(/(am|pm|sa|ch|pm|am)/g, '').trim();
                const p = s.split(':');
                if (p.length >= 2) {
                    let h = parseInt(p[0], 10), m = parseInt(p[1], 10);
                    if (pm && h < 12) h += 12; if (am && h === 12) h = 0;
                    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
                }
                return "00:00";
            };

            const parseDate = d => {
                if (!d || String(d).trim() === "undefined") return "";
                let s = String(d).trim().split(' ')[0];
                if (s.includes('/') || s.includes('-')) {
                    const p = s.split(s.includes('/') ? '/' : '-');
                    if (p.length === 3) {
                        if (p[0].length === 4) return `${p[0]}-${p[1].padStart(2,'0')}-${p[2].padStart(2,'0')}`;
                        let year = p[2].length === 2 ? '20' + p[2] : p[2];
                        return parseInt(p[0],10) > 12 ? `${year}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}` : `${year}-${p[0].padStart(2,'0')}-${p[1].padStart(2,'0')}`;
                    }
                } else if (!isNaN(s) && Number(s) > 0) {
                    const eD = XLSX.SSF.parse_date_code(Number(s));
                    return `${eD.y}-${String(eD.m).padStart(2,'0')}-${String(eD.d).padStart(2,'0')}`;
                }
                return "";
            };

            const newSchedules = rawData.map(row => {
                const title = String(row["Task"] || row["Congviec"] || row["Task"] || row["Task"] || "").trim();
                const content = String(row["Content"] || row["Content"] || "").trim();
                const imp = row["Important"] === true || String(row["Important"]).toLowerCase() === 'true';

                let date = parseDate(row["Date"] || row["Date"]);
                let time = parseTime(row["Time"] || row["Time"]);
                let endDate = parseDate(row["EndDate"] || row["End Date"] || row["Dateketthuc"]) || date;
                let endTime = parseTime(row["EndTime"] || row["End Time"] || row["Timeketthuc"]);
                if (!row["EndTime"] && !row["End Time"]) endTime = time;

                if (new Date(`${endDate}T${endTime}`) < new Date(`${date}T${time}`)) { endDate = date; endTime = time; }

                return { title, date, time, endDate, endTime, content: content === "undefined" ? "" : content, important: imp, emoji: imp ? "⚠️" : "📅" };
            }).filter(item => item.title && item.date);

            if (!newSchedules.length) return alert("❌ No valid schedule milestones found!");
            if (!group.schedules) group.schedules = [];
            group.schedules.push(...newSchedules);
            
            sortSchedulesSmart(group.schedules);
            saveData();
            alert(`📥 Import successful: ${newSchedules.length} schedules.`);
        } catch (err) { alert("Error parsing Excel file!"); }
        finally { event.target.value = ''; }
    };
    reader.readAsArrayBuffer(file);
});

// ==========================================

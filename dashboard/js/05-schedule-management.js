// 7. QUẢN LÝ LỊCH TRÌNH SYSTEM (SCHEDULE & ALERTS ENGINE)
// ==========================================
function addScheduleBlock(data = null) {
    const wrapper = getEl('scheduleBlocksWrapper');
    if (!wrapper) return;

    const blockId = 'sch_block_' + Date.now() + Math.floor(Math.random() * 1000);
    const block = document.createElement('div');
    block.className = 'schedule-block-item';
    block.id = blockId;

    const now = new Date();
    const defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const title = data ? data.title : '';
    const date = data ? data.date : defaultDate;
    const time = data ? data.time : defaultTime;
    const endDate = data ? (data.endDate || data.date) : defaultDate;
    const endTime = data ? (data.endTime || data.time) : defaultTime;
    const content = data ? data.content : '';
    const important = data ? data.important : false;
    const emoji = data ? data.emoji : '📅';

    block.innerHTML = `
        <div class="schedule-block-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <label class="important-checkbox-label" style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;font-weight:600">
                <input type="checkbox" class="sch-important-cb" ${important ? 'checked' : ''}> ⚠️ This milestone is important
            </label>
            ${!state.isEditMode ? `<button type="button" style="color:var(--danger-color);background:none;border:1px solid rgba(239,68,68,0.3);padding:4px 8px;font-size:11px;border-radius:4px;cursor:pointer" onclick="removeScheduleBlock('${blockId}')">Delete this milestone</button>` : ''}
        </div>
        <div class="form-group" style="margin-bottom:12px">
            <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Milestone title:</label>
            <input type="text" class="form-input sch-title-input" placeholder="Example: Team meeting..." value="${title}" required style="width:100%">
        </div>
        <div class="datetime-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Choose start date:</label>
                <input type="date" class="form-input sch-date-input" value="${date}" required style="width:100%">
            </div>
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Choose start time:</label>
                <input type="time" class="form-input sch-time-input" value="${time}" required style="width:100%">
            </div>
        </div>
        <div class="datetime-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Choose end date:</label>
                <input type="date" class="form-input sch-end-date-input" value="${endDate}" required style="width:100%">
            </div>
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Choose end time:</label>
                <input type="time" class="form-input sch-end-time-input" value="${endTime}" required style="width:100%">
            </div>
        </div>
        <div class="form-group" style="margin-bottom:8px">
            <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">📋 Task list:</label>
            <textarea class="form-input sch-content-input" placeholder="Enter task details here..." rows="3" style="width:100%;resize:vertical">${content}</textarea>
        </div>
        <label style="display:block;margin:8px 0 4px;font-size:12px;color:var(--text-sub)">🏷️ Schedule tags:</label>
        <input type="text" class="form-input sch-tags-input" placeholder="Example: meeting, deadline" value="${tagsToString(data ? data.tags : [])}" style="width:100%;margin-bottom:8px">
        <input type="hidden" class="sch-emoji-hidden" value="${emoji}">
    `;

    const dateInp = block.querySelector('.sch-date-input');
    const endDateInp = block.querySelector('.sch-end-date-input');
    dateInp?.addEventListener('change', () => {
        if (!endDateInp.value || new Date(endDateInp.value) < new Date(dateInp.value)) {
            endDateInp.value = dateInp.value;
        }
    });

    wrapper.appendChild(block);
}

function removeScheduleBlock(id) {
    const wrapper = getEl('scheduleBlocksWrapper');
    if (wrapper && wrapper.children.length <= 1 && !state.isEditMode) {
        alert("You must keep at least one schedule block to enter data!");
        return;
    }
    getEl(id)?.remove();
}

function openScheduleModal(groupId, scheduleIndex = false) {
    state.activeGroupId = groupId;
    state.activeIndex = scheduleIndex;
    state.isEditMode = scheduleIndex !== false;
    
    const wrapper = getEl('scheduleBlocksWrapper');
    if (wrapper) wrapper.innerHTML = '';

    if (state.isEditMode) {
        getEl('scheduleModalTitle').innerText = "📝 Edit Schedule Milestone";
        getEl('addScheduleBlockBtn').style.display = 'none';
        const schObj = getGroup(groupId).schedules[scheduleIndex];
        addScheduleBlock(schObj);
    } else {
        getEl('scheduleModalTitle').innerText = "📅 Add Schedule Milestone";
        getEl('addScheduleBlockBtn').style.display = 'inline-flex';
        addScheduleBlock();
    }
    openModal('scheduleModal');
}

function submitScheduleForm() {
    const group = getGroup(state.activeGroupId);
    if (!group) return;

    const blockElements = document.querySelectorAll('#scheduleBlocksWrapper .schedule-block-item');
    let hasError = false;
    let hasTimeError = false;

    const blocksData = Array.from(blockElements).map(block => {
        const title = block.querySelector('.sch-title-input').value.trim();
        const date = block.querySelector('.sch-date-input').value;
        const time = block.querySelector('.sch-time-input').value;
        const endDate = block.querySelector('.sch-end-date-input').value;
        const endTime = block.querySelector('.sch-end-time-input').value;
        const content = block.querySelector('.sch-content-input').value;
        const important = block.querySelector('.sch-important-cb').checked;
        const hiddenEmoji = block.querySelector('.sch-emoji-hidden').value;
        const tags = parseTags(block.querySelector('.sch-tags-input')?.value || '');

        if (!title || !date || !time || !endDate || !endTime) hasError = true;

        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        if (endDateTime < startDateTime) hasTimeError = true;

        return { 
            title, date, time, endDate, endTime, content, important, tags, 
            emoji: state.isEditMode ? hiddenEmoji : (important ? "⚠️" : "📅") 
        };
    });

    if (hasError) {
        alert("Please fill in all start and end time information!");
        return;
    }
    if (hasTimeError) {
        alert("❌ Error: End time cannot be earlier than start time!");
        return;
    }

    if (state.isEditMode) group.schedules[state.activeIndex] = blocksData[0];
    else group.schedules.push(...blocksData);

    sortSchedulesSmart(group.schedules);
    saveData();
    closeModal('scheduleModal');
}

function updateScheduleUI() {
    const now = new Date();
    const rows = document.querySelectorAll('.schedule-table tbody tr');

    rows.forEach(row => {
        // Bỏ qua schedules đang nằm trong group thu gọn/ẩn để mở hết/thu gọn/import không bị khựng.
        if (row.offsetParent === null) return;

        const startStr = row.getAttribute('data-start');
        const endStr = row.getAttribute('data-end');
        const countdownCell = row.querySelector('.schedule-countdown-cell');
        const jobCell = row.querySelector('.schedule-name')?.innerText.trim();

        if (!startStr || !endStr || !countdownCell) return;

        const startTime = new Date(startStr.length === 16 ? startStr + ':00' : startStr);
        const endTime = new Date(endStr.length === 16 ? endStr + ':00' : endStr);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) return;

        const diffToStartMs = startTime - now;
        const diffToEndMs = endTime - now;
        let countdownText = "";
        let badgeColor = "";
        let pulse = false;
        let past = false;
        let running = false;

        if (diffToEndMs < 0) {
            countdownText = "Expired";
            badgeColor = "#ef4444";
            past = true;
        } else if (diffToStartMs <= 0 && diffToEndMs >= 0) {
            countdownText = "Running";
            badgeColor = "#a855f7";
            running = true;
            pulse = Math.floor(diffToEndMs / 60000) <= 30;
        } else {
            const diffMin = Math.floor(diffToStartMs / 60000);
            const diffHour = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHour / 24);

            if (diffDay > 0) {
                countdownText = `Left ${diffDay} days`;
                badgeColor = "#10b981";
            } else if (diffHour > 0) {
                countdownText = `${diffHour}g : ${diffMin % 60}ph`;
                badgeColor = "#f59e0b";
            } else {
                countdownText = `🚨 Left ${diffMin} minutes`;
                badgeColor = "#ef4444";
                pulse = diffMin <= 30;
                if (pulse && Notification.permission === "granted" && !row.dataset.notified) {
                    new Notification("🚨 UPCOMING SCHEDULE!", { body: `Coming up: ${jobCell} (left ${diffMin} minutes).` });
                    row.dataset.notified = "true";
                }
            }
        }

        row.classList.toggle('is-past-schedule', past);
        row.classList.toggle('is-running-schedule', running);
        row.style.textDecoration = past ? "line-through" : "none";
        row.style.borderLeft = running ? "4px solid #a855f7" : "";
        if (pulse) row.setAttribute('data-pulse', 'true');
        else row.removeAttribute('data-pulse');

        const nextCellState = `${past}:${pulse}`;
        if (row.dataset.cellVisualState !== nextCellState) {
            row.dataset.cellVisualState = nextCellState;
            Array.from(row.cells).forEach(cell => {
                cell.style.opacity = past ? "0.45" : "1";
                cell.style.color = past ? "var(--text-sub)" : "";
                if (!pulse) cell.style.backgroundColor = "transparent";
            });
        }

        const nextHTML = `<span style="color:${badgeColor}">${countdownText}</span>`;
        if (countdownCell.innerHTML !== nextHTML) countdownCell.innerHTML = nextHTML;
    });
    initGlobalPulseSystem();
}

function sortSchedulesSmart(schedules) {
    const now = new Date();
    return schedules.sort((a, b) => {
        const finalTimeA = new Date(`${a.endDate || a.date}T${a.endTime || a.time || "00:00"}`);
        const finalTimeB = new Date(`${b.endDate || b.date}T${b.endTime || b.time || "00:00"}`);
        const isPastA = finalTimeA < now;
        const isPastB = finalTimeB < now;

        if (isPastA && !isPastB) return -1;
        if (!isPastA && isPastB) return 1;

        const startA = new Date(`${a.date}T${a.time || "00:00"}`);
        const startB = new Date(`${b.date}T${b.time || "00:00"}`);
        return ((now >= startA && now <= finalTimeA) ? now : startA) - ((now >= startB && now <= finalTimeB) ? now : startB);
    });
}

function showTodayImportantTasks() {
    const localNow = new Date();
    const todayTime = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate()).getTime();

    let processedGroups = [];     

    state.dashboardData.forEach(group => {
        if (group.type !== 'schedule' || !group.schedules) return;
        
        // Lọc ra các schedule diễn ra trong days hôm nay của group này
        const todaySchedules = group.schedules
            .map((item, originalIndex) => ({ ...item, originalIndex })) 
            .filter(item => {
                const [sY, sM, sD] = item.date.split('-').map(Number);
                const [eY, eM, eD] = (item.endDate || item.date).split('-').map(Number);
                return todayTime >= new Date(sY, sM - 1, sD).getTime() && todayTime <= new Date(eY, eM - 1, eD).getTime();
            })
            .sort((a, b) => a.time.localeCompare(b.time));
        
        if (todaySchedules.length > 0) {
            // Khởi tạo các cờ đánh dấu trạng thái cụ thể của từng Schedule trong group
            let hasUpcomingImportant = false; // Upcoming within 30 minutes and important
            let hasUpcomingNormal = false;    // Upcoming within 30 minutes and normal
            let hasImportant = false;         // Has important schedules
            let hasRunning = false;           // Has running schedules

            todaySchedules.forEach(item => {
                const exactStartDT = new Date(`${item.date}T${item.time}:00`);
                const exactEndDT = new Date(`${item.endDate || item.date}T${item.endTime || item.time}:00`);
                
                const diffToStartMs = exactStartDT - localNow;
                const isUpcoming = diffToStartMs > 0 && diffToStartMs <= 30 * 60 * 1000;

                // 1 & 2. Kiểm tra trạng thái SẮP DIỄN RA dưới 30 minutes
                if (isUpcoming) {
                    if (item.important) {
                        hasUpcomingImportant = true;
                    } else {
                        hasUpcomingNormal = true;
                    }
                }
                
                // 3. Kiểm tra schedules QUAN TRỌNG nói chung
                if (item.important) {
                    hasImportant = true;
                }

                // 4. Kiểm tra schedules ĐANG DIỄN RA
                if (localNow >= exactStartDT && localNow <= exactEndDT) {
                    hasRunning = true;
                }
            });

            // 🔥 THIẾT LẬP TRỌNG SỐ ƯU TIÊN CHO NHÓM (Số càng nhỏ càng xếp lên đầu)
            let groupWeight = 5; // Level 5: normal schedules only
            
            if (hasUpcomingImportant) {
                groupWeight = 1; // Level 1: upcoming important schedules
            } else if (hasUpcomingNormal) {
                groupWeight = 2; // Level 2: upcoming normal schedules
            } else if (hasImportant) {
                groupWeight = 3; // Level 3: important schedules
            } else if (hasRunning) {
                groupWeight = 4; // Level 4: running schedules
            }

            processedGroups.push({
                groupObj: group,
                schedules: todaySchedules,
                weight: groupWeight
            });
        }
    });

    if (processedGroups.length === 0) return;

    // Sắp xếp các cụm group dựa trên trọng số weight (1 lên đầu, 5 về cuối)
    processedGroups.sort((a, b) => a.weight - b.weight);

    let html = '';
    const dayLabels = ["Sunday", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Dựng giao diện HTML dựa trên mảng đã được xếp hạng ưu tiên
    processedGroups.forEach(groupData => {
        const group = groupData.groupObj;
        html += `<h3 style="color:var(--accent-color);margin-top:15px;border-bottom:1px solid var(--border-color);padding-bottom:5px">${group.emoji && group.emoji !== "NONE" ? group.emoji : '📅'} ${group.title}</h3>`;
        
        groupData.schedules.forEach(item => {
            const exactStartDT = new Date(`${item.date}T${item.time}:00`);
            const exactEndDT = new Date(`${item.endDate || item.date}T${item.endTime || item.time}:00`);
            const isPassed = localNow > exactEndDT; 
            const isRunning = localNow >= exactStartDT && localNow <= exactEndDT;
            
            const diffToStartMs = exactStartDT - localNow;
            const diffMin = Math.floor(diffToStartMs / 60000);

            const shouldPulse = (diffToStartMs > 0 && diffToStartMs <= 1800000) || ((exactEndDT - localNow) > 0 && (exactEndDT - localNow) <= 1800000);
            let currentType = isRunning ? 'running' : (item.important ? 'important' : 'normal');

            let borderCol = isRunning ? '#a855f7' : (item.important ? '#ef4444' : 'var(--schedule-accent, #10b981)');
            let bgCol = isRunning ? 'rgba(168,85,247,0.08)' : (item.important ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.05)');
            
            if (diffToStartMs > 0 && diffMin <= 30) {
                bgCol = 'rgba(239,68,68,0.12)';
            }

            let itemStyle = `border-left:4px solid ${borderCol};background:${bgCol};transition:all .2s ease;`;

            html += `
            <div class="today-important-item" ${shouldPulse && !isPassed ? 'data-pulse="true"' : ''} data-type="${currentType}" style="${itemStyle}${isPassed ? 'opacity:0.5;' : ''}margin-bottom:10px;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding:10px;border-radius:6px">
                <div style="flex:1">
                    <h4 class="pulse-title" style="${isPassed ? 'text-decoration:line-through;' : ''}margin:0 0 6px 0;color:${isRunning ? '#c084fc' : (item.important ? '#f87171' : 'var(--schedule-accent)')};font-size:14px">
                        ${dayLabels[localNow.getDay()]} - ${item.title} ${diffToStartMs > 0 && diffMin <= 30 ? `(Left ${diffMin} ph)` : ''}
                    </h4>
                    <div style="display:flex;flex-direction:column;gap:2px;margin-bottom:8px;font-size:12px;color:var(--text-sub);${isPassed ? 'text-decoration:line-through;' : ''}">
                        <div>🟢 Start: <b>${item.date.split('-').reverse().join('/')}</b> at <b>${item.time}</b></div>
                        <div>🏁 End: <b>${(item.endDate || item.date).split('-').reverse().join('/')}</b> at <b>${item.endTime || item.time}</b></div>
                    </div>
                    <p style="margin:0;white-space:pre-wrap;font-size:13px;color:var(--text-main)">${item.content || 'No detailed content'}</p>
                </div>
                <button class="btn-secondary" style="padding:4px 8px;font-size:11px;color:var(--danger-color);border-color:rgba(239,68,68,0.2);cursor:pointer" onclick="deleteTaskFromModal('${group.id}', ${item.originalIndex})">❌ Delete</button>
            </div>`;
        });
    });

    const modalTitle = getEl('todayImportantModal')?.querySelector('h3');
    if (modalTitle) modalTitle.innerHTML = `📌 TODAY SCHEDULES (${String(localNow.getDate()).padStart(2, '0')}/${String(localNow.getMonth() + 1).padStart(2, '0')})`;
    
    const contentBox = getEl('todayImportantContent');
    if (contentBox) { contentBox.innerHTML = html; openModal('todayImportantModal'); initGlobalPulseSystem(); }
}

function initGlobalPulseSystem() {
    if (window.globalPulseInterval) return;
    let stateToggle = false;
    
    window.globalPulseInterval = setInterval(() => {
        if (document.hidden) return;
        const pulsingElements = document.querySelectorAll('[data-pulse="true"]');
        document.querySelectorAll('.today-important-item, tbody tr').forEach(el => {
            if (el.getAttribute('data-pulse') !== 'true') {
                if (el.tagName === 'TR') {
                    if (!el.querySelector('.schedule-countdown-cell')?.innerHTML.includes('Running')) {
                        Array.from(el.cells).forEach(c => c.style.backgroundColor = "");
                    }
                } else {
                    el.style.boxShadow = "none";
                    const t = el.getAttribute('data-type');
                    el.style.backgroundColor = t === 'running' ? 'rgba(168,85,247,0.08)' : (t === 'important' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.05)');
                    el.style.borderLeftColor = t === 'running' ? '#a855f7' : (t === 'important' ? '#ef4444' : 'var(--schedule-accent, #10b981)');
                    const h4 = el.querySelector('.pulse-title');
                    if (h4) h4.style.color = t === 'running' ? '#c084fc' : (t === 'important' ? '#f87171' : 'var(--schedule-accent)');
                }
            }
        });

        pulsingElements.forEach(el => {
            if (el.style.opacity === "0.5") return;
            const h4 = el.querySelector('.pulse-title');
            const isRunningType = el.getAttribute('data-type') === 'running' || el.querySelector('.schedule-countdown-cell')?.innerHTML.includes('Running');

            if (stateToggle) {
                if (el.tagName === 'TR') Array.from(el.cells).forEach(c => c.style.backgroundColor = "rgba(239,68,68,0.25)");
                else {
                    el.style.backgroundColor = "rgba(239,68,68,0.3)"; el.style.boxShadow = "0 0 10px rgba(239,68,68,0.35)";
                    if (h4) h4.style.color = "#ff4d4d";
                }
            } else {
                if (el.tagName === 'TR') Array.from(el.cells).forEach(c => c.style.backgroundColor = "rgba(239,68,68,0.05)");
                else {
                    el.style.boxShadow = "none";
                    el.style.backgroundColor = isRunningType ? 'rgba(168,85,247,0.08)' : (el.getAttribute('data-type') === 'important' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.05)');
                    if (h4) h4.style.color = isRunningType ? '#c084fc' : (el.getAttribute('data-type') === 'important' ? '#f87171' : 'var(--schedule-accent)');
                }
            }
        });
        stateToggle = !stateToggle;
    }, 600);
}

function deleteTaskFromModal(groupId, originalIndex) {
    const group = getGroup(groupId);
    if (!group || !group.schedules[originalIndex]) return;

    customConfirm(`Delete schedule milestone "${group.schedules[originalIndex].title}"?`, "⚠️ Confirm deletion").then((confirmed) => {
        if (confirmed) {
            group.schedules.splice(originalIndex, 1);
            saveData(); 
            const localNow = new Date();
            const today = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(localNow.getDate()).padStart(2, '0')}`;
            let remaining = 0;
            state.dashboardData.forEach(g => { if (g.type === 'schedule' && g.schedules) remaining += g.schedules.filter(s => s.date === today).length; });
            if (remaining === 0) closeModal('todayImportantModal'); else showTodayImportantTasks(); 
        }
    });
}

// ==========================================

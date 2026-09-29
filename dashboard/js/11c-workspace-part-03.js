// ==========================================================================
// SCHEDULE HUB + PAST SCHEDULE MANAGER
// Gộp Calendar View + Upcoming + Past milestones vào cùng một modal.
// Tự chuyển mốc schedules đã kết thúc ra khỏi folder sang bảng "Past milestones".
// ==========================================================================
const PAST_SCHEDULE_KEY = 'dashboardPastSchedulesV1';
let activeScheduleHubTab = 'calendar';

function readPastSchedules() {
    return readJSONStore(PAST_SCHEDULE_KEY, []);
}

function writePastSchedules(items) {
    writeJSONStore(PAST_SCHEDULE_KEY, Array.isArray(items) ? items : []);
}

function getScheduleStartDateTimeSafe(sch = {}) {
    return new Date(`${sch.date || ''}T${sch.time || '00:00'}`);
}

function getScheduleEndDateTimeSafe(sch = {}) {
    return new Date(`${sch.endDate || sch.date || ''}T${sch.endTime || sch.time || '23:59'}`);
}

function makePastScheduleId(groupId, sch = {}) {
    return [
        groupId,
        sch.id || '',
        sch.title || '',
        sch.date || '',
        sch.time || '',
        sch.endDate || '',
        sch.endTime || ''
    ].join('|');
}

function migratePastSchedules(options = {}) {
    const now = new Date();
    const past = readPastSchedules();
    const existed = new Set(past.map(item => item._pastKey || makePastScheduleId(item.groupId, item.sch || {})));
    let moved = 0;

    state.dashboardData.forEach(group => {
        if (group.pinKey && group.pinKey !== '' && group.isLocked) return;
        if (!Array.isArray(group.schedules) || !group.schedules.length) return;

        for (let i = group.schedules.length - 1; i >= 0; i--) {
            const sch = group.schedules[i];
            const end = getScheduleEndDateTimeSafe(sch);
            if (isNaN(end) || end >= now) continue;

            const _pastKey = makePastScheduleId(group.id, sch);
            if (!existed.has(_pastKey)) {
                past.unshift({
                    id: 'past_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                    _pastKey,
                    movedAt: Date.now(),
                    groupId: group.id,
                    groupTitle: group.title || 'Untitled',
                    groupEmoji: group.emoji || '',
                    sch: { ...sch }
                });
                existed.add(_pastKey);
            }

            group.schedules.splice(i, 1);
            moved++;
        }
    });

    if (moved) {
        writePastSchedules(past);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
        updateScheduleUI?.();
        renderSmartPanels?.();

        if (!options.skipDrive && gapiInited && gisInited && gapi.client.getToken()) {
            clearTimeout(window.__pastScheduleDriveSyncTimer);
            window.__pastScheduleDriveSyncTimer = setTimeout(() => syncToGoogleDrive(true), 700);
        }
    }

    return moved;
}

function getUpcomingScheduleItems(limit = Infinity) {
    migratePastSchedules({ skipDrive: true });
    const now = new Date();
    const upcoming = [];

    state.dashboardData.forEach(group => {
        if (group.pinKey && group.pinKey !== '' && group.isLocked) return;
        (group.schedules || []).forEach((sch, index) => {
            const d = getScheduleEndDateTimeSafe(sch);
            if (!isNaN(d) && d >= now) upcoming.push({ group, sch, index, d });
        });
    });

    upcoming.sort((a, b) => a.d - b.d);
    return Number.isFinite(limit) ? upcoming.slice(0, limit) : upcoming;
}

function formatScheduleDateRange(sch = {}) {
    const start = [sch.date, sch.time].filter(Boolean).join(' ');
    const end = [sch.endDate, sch.endTime].filter(Boolean).join(' ');
    return end && end !== start ? `${start} → ${end}` : start;
}

function renderUpcomingScheduleHub() {
    const el = getEl('scheduleHubUpcomingList');
    if (!el) return;

    const upcoming = getUpcomingScheduleItems(Infinity);

    if (!upcoming.length) {
        el.className = 'schedule-hub-list empty';
        el.textContent = 'No upcoming schedules.';
        return;
    }

    el.className = 'schedule-hub-list';
    el.innerHTML = upcoming.map(x => `
        <button class="schedule-hub-item ${x.sch.important ? 'important' : ''}" onclick="openCalendarScheduleDetail('${x.group.id}', ${x.index})">
            <span class="schedule-hub-item-icon">${x.sch.important ? '⚠️' : (x.sch.emoji && x.sch.emoji !== 'NONE' ? escapeHTML(x.sch.emoji) : '📅')}</span>
            <span class="schedule-hub-item-main">
                <strong>${escapeHTML(x.sch.title || 'Untitled')}</strong>
                <small>${escapeHTML(x.group.title || '')} · ${escapeHTML(formatScheduleDateRange(x.sch))}</small>
            </span>
        </button>
    `).join('');
}

function renderPastScheduleHub() {
    const el = getEl('pastScheduleList');
    if (!el) return;

    const past = readPastSchedules();

    if (!past.length) {
        el.className = 'schedule-hub-list empty';
        el.textContent = 'No past milestones.';
        return;
    }

    el.className = 'schedule-hub-list';
    el.innerHTML = past.map((item, index) => {
        const sch = item.sch || {};
        return `
            <div class="schedule-hub-item past">
                <button class="schedule-hub-item-view" onclick="openPastScheduleDetail(${index})">
                    <span class="schedule-hub-item-icon">${sch.important ? '⚠️' : (sch.emoji && sch.emoji !== 'NONE' ? escapeHTML(sch.emoji) : '🕘')}</span>
                    <span class="schedule-hub-item-main">
                        <strong>${escapeHTML(sch.title || 'Untitled')}</strong>
                        <small>${escapeHTML(item.groupTitle || '')} · ${escapeHTML(formatScheduleDateRange(sch))}</small>
                    </span>
                </button>
                <button class="smart-icon-btn past-delete-btn" onclick="removePastSchedule(${index})" title="Delete past milestone">✕</button>
            </div>
        `;
    }).join('');
}

function openPastScheduleDetail(index) {
    const item = readPastSchedules()[index];
    if (!item) return;

    const sch = item.sch || {};
    const title = getEl('readModalTitle');
    const body = getEl('readModalBody');

    if (!title || !body) return;

    title.innerHTML = `🕘 ${escapeHTML(sch.title || 'Past milestones')}`;
    body.innerHTML = `
        <div class="single-schedule-detail">
            <h4>${sch.important ? '⚠️ ' : ''}${escapeHTML(sch.title || 'Untitled')}</h4>
            <div class="schedule-info-line">
                📁 ${escapeHTML(item.groupTitle || 'Previous folder')}<br>
                🕒 ${escapeHTML(formatScheduleDateRange(sch))}
            </div>
            <div class="schedule-tasks-list">${linkify(escapeHTML(sch.content || 'No content.'))}</div>
        </div>
    `;

    openModal('readModal');
}

function removePastSchedule(index) {
    const past = readPastSchedules();
    past.splice(index, 1);
    writePastSchedules(past);
    renderPastScheduleHub();
}

function switchScheduleHubTab(tab = 'calendar') {
    activeScheduleHubTab = tab;

    document.querySelectorAll('.schedule-hub-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    document.querySelectorAll('.schedule-hub-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    const paneId = {
        calendar: 'scheduleHubCalendarPane',
        upcoming: 'scheduleHubUpcomingPane',
        past: 'scheduleHubPastPane'
    }[tab] || 'scheduleHubCalendarPane';

    getEl(paneId)?.classList.add('active');

    const title = getEl('scheduleHubTitle');
    if (title) {
        title.textContent = tab === 'calendar' ? '📆 Calendar View'
            : tab === 'upcoming' ? '📅 Upcoming'
            : '🕘 Past milestones';
    }

    if (tab === 'calendar') renderCalendarView();
    if (tab === 'upcoming') renderUpcomingScheduleHub();
    if (tab === 'past') renderPastScheduleHub();
}

function openScheduleHub(tab = 'calendar') {
    migratePastSchedules();
    currentCalendarDate = new Date();
    currentCalendarDate.setDate(1);
    openModal('calendarModal');
    switchScheduleHubTab(tab);
    toggleMobileSidebar(false);
}

// Ghi đè hàm cũ để Calendar View và Upcoming dùng chung modal mới.
openCalendarModal = function() {
    openScheduleHub('calendar');
};

const __scheduleHubOpenSidebarPanel = openSidebarPanel;
openSidebarPanel = function(type) {
    if (type === 'upcoming') {
        openScheduleHub('upcoming');
        return;
    }
    return __scheduleHubOpenSidebarPanel(type);
};

// Ghi đè nội dung Upcoming cũ để đồng bộ với logic tự chuyển mốc đã qua.
const __scheduleHubRenderSidebarPanelContent = renderSidebarPanelContent;
renderSidebarPanelContent = function(type) {
    if (type !== 'upcoming') return __scheduleHubRenderSidebarPanelContent(type);

    const upcoming = getUpcomingScheduleItems(40);
    if (!upcoming.length) return '<div class="smart-list empty">No upcoming schedules.</div>';

    return `<div class="smart-list">${upcoming.map(x => `
        <div class="smart-item" onclick="closeModal('sidebarPanelModal'); openCalendarScheduleDetail('${x.group.id}', ${x.index})">
            <span>${x.sch.important ? '⚠️' : '📅'} ${escapeHTML(x.sch.title || 'Untitled')}</span>
            <small>${escapeHTML(x.group.title || '')} · ${escapeHTML(formatScheduleDateRange(x.sch))}</small>
        </div>
    `).join('')}</div>`;
};

// Chạy migration khi render để folder tự sạch mốc đã qua.
const __scheduleHubRenderDashboard = renderDashboard;
renderDashboard = function() {
    migratePastSchedules({ skipDrive: true });
    __scheduleHubRenderDashboard();
    if (getEl('calendarModal')?.classList.contains('active')) {
        if (activeScheduleHubTab === 'upcoming') renderUpcomingScheduleHub();
        if (activeScheduleHubTab === 'past') renderPastScheduleHub();
    }
};

// Cập nhật payload Drive để lưu cả "Past milestones".
if (typeof buildDrivePayload === 'function') {
    const __scheduleHubBuildDrivePayload = buildDrivePayload;
    buildDrivePayload = function() {
        const payload = __scheduleHubBuildDrivePayload();
        payload.pastSchedules = readPastSchedules();
        return payload;
    };
}

if (typeof applyDrivePayload === 'function') {
    const __scheduleHubApplyDrivePayload = applyDrivePayload;
    applyDrivePayload = function(cloudData) {
        __scheduleHubApplyDrivePayload(cloudData);
        if (cloudData && Array.isArray(cloudData.pastSchedules)) {
            localStorage.setItem(PAST_SCHEDULE_KEY, JSON.stringify(cloudData.pastSchedules));
        }
    };
}

// Nếu store mốc đã qua thay đổi thì sync ngầm lên Drive giống thùng rác/backup.
if (typeof writeJSONStore === 'function') {
    const __scheduleHubWriteJSONStore = writeJSONStore;
    writeJSONStore = function(key, value) {
        __scheduleHubWriteJSONStore(key, value);
        if (key === PAST_SCHEDULE_KEY && gapiInited && gisInited && gapi.client.getToken()) {
            clearTimeout(window.__pastScheduleMetaSyncTimer);
            window.__pastScheduleMetaSyncTimer = setTimeout(() => syncToGoogleDrive(true), 700);
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    migratePastSchedules();
});


// 15. V4 MOBILE WORKSPACE: SIDEBAR, TAG, CALENDAR, BACKUP, CTRL+Z
// ==========================================================================
const BACKUP_KEY = 'dashboardVersionBackupsV1';
let activeTagFilter = '';
let currentCalendarDate = new Date();
let __backupLock = false;

function parseTags(value = '') {
    return [...new Set(String(value || '')
        .split(/[#,，;\n]/)
        .map(x => x.trim().replace(/^#/, '').toLowerCase())
        .filter(Boolean))].slice(0, 12);
}

function tagsToString(tags = []) {
    return Array.isArray(tags) ? tags.join(', ') : '';
}

function getAllDashboardTags() {
    const bag = new Set();
    state.dashboardData.forEach(group => (group.tags || []).forEach(t => bag.add(t)));
    return [...bag].sort((a, b) => a.localeCompare(b, 'vi'));
}

function groupMatchesActiveTag(group) {
    if (!activeTagFilter) return true;
    return (group.tags || []).includes(activeTagFilter);
}

function setActiveTag(tag = '') {
    activeTagFilter = tag;
    renderTagFilterChips();
    renderDashboard();
}

function renderTagFilterChips() {
    const el = getEl('tagFilterChips');
    if (!el) return;
    const tags = getAllDashboardTags();
    const base = `<button class="tag-chip ${!activeTagFilter ? 'active' : ''}" onclick="setActiveTag('')">All</button>`;
    el.innerHTML = base + tags.map(tag => `<button class="tag-chip ${activeTagFilter === tag ? 'active' : ''}" onclick="setActiveTag('${escapeHTML(tag)}')">#${escapeHTML(tag)}</button>`).join('');
}

function renderFolderTags(group = {}) {
    const tags = group.tags || [];
    if (!tags.length) return '';
    const visible = tags.slice(0, 4).map(t => `<span class="folder-tag">#${escapeHTML(t)}</span>`).join('');
    const more = tags.length > 4 ? `<span class="folder-tag more">+${tags.length - 4}</span>` : '';
    return `<span class="folder-tags-inline">${visible}${more}</span>`;
}

function renderItemTags(item = {}) {
    return '';
}

function scrollToSection(section) {
    if (section === 'top') return window.scrollTo({ top: 0, behavior: 'smooth' });
    const el = getEl(section);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function getVisibleSchedules() {
    const out = [];
    state.dashboardData.forEach(group => {
        if (group.pinKey && group.pinKey !== '' && group.isLocked) return;
        (group.schedules || []).forEach((sch, index) => {
            const d = getScheduleEndDateTime(sch);
            if (!isNaN(d)) out.push({ group, sch, index, d });
        });
    });
    return out;
}

function openCalendarModal() {
    currentCalendarDate = new Date();
    currentCalendarDate.setDate(1);
    renderCalendarView();
    openModal('calendarModal');
}

function changeCalendarMonth(offset) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + offset);
    renderCalendarView();
}

// ==========================================================================
// VIETNAMESE CALENDAR EVENTS — V2 TRIAL
// Mixes official public holidays with popular Gregorian observances and
// Vietnamese lunar/traditional festivals. These are display-only and are
// NEVER written into dashboardData / Upcoming / Past / Trash.
// ==========================================================================
const VN_HOLIDAY_CACHE_PREFIX = 'dashboardVnHolidayCacheV2:';
const VN_HOLIDAY_API_BASE = 'https://date.nager.at/api/v3/PublicHolidays';
let vnHolidayRenderToken = 0;

const VN_EVENT_META = {
    public:      { icon: '🇻🇳', label: 'Ngày nghỉ lễ' },
    traditional: { icon: '🏮', label: 'Lễ truyền thống' },
    culture:     { icon: '✨', label: 'Ngày kỷ niệm' },
    love:        { icon: '💝', label: 'Tình yêu' }
};

function makeVnEvent(date, localName, category = 'culture', note = '') {
    return { date, localName, name: note || localName, category, source: 'calendar-v2' };
}

function getVietnamFixedEvents(year) {
    const y = String(year);
    return [
        makeVnEvent(`${y}-01-01`, 'Tết Dương lịch', 'public'),
        makeVnEvent(`${y}-02-14`, 'Lễ Tình nhân · Valentine', 'love'),
        makeVnEvent(`${y}-02-27`, 'Ngày Thầy thuốc Việt Nam', 'culture'),
        makeVnEvent(`${y}-03-08`, 'Quốc tế Phụ nữ', 'culture'),
        makeVnEvent(`${y}-03-26`, 'Ngày thành lập Đoàn TNCS Hồ Chí Minh', 'culture'),
        makeVnEvent(`${y}-04-01`, 'Cá tháng Tư', 'culture'),
        makeVnEvent(`${y}-04-30`, 'Ngày Giải phóng miền Nam', 'public'),
        makeVnEvent(`${y}-05-01`, 'Quốc tế Lao động', 'public'),
        makeVnEvent(`${y}-06-01`, 'Quốc tế Thiếu nhi', 'culture'),
        makeVnEvent(`${y}-06-28`, 'Ngày Gia đình Việt Nam', 'culture'),
        makeVnEvent(`${y}-07-27`, 'Ngày Thương binh - Liệt sĩ', 'culture'),
        makeVnEvent(`${y}-08-19`, 'Cách mạng Tháng Tám', 'culture'),
        makeVnEvent(`${y}-09-02`, 'Quốc khánh Việt Nam', 'public'),
        makeVnEvent(`${y}-10-10`, 'Ngày Giải phóng Thủ đô', 'culture'),
        makeVnEvent(`${y}-10-13`, 'Ngày Doanh nhân Việt Nam', 'culture'),
        makeVnEvent(`${y}-10-20`, 'Ngày Phụ nữ Việt Nam', 'culture'),
        makeVnEvent(`${y}-10-31`, 'Halloween', 'culture'),
        makeVnEvent(`${y}-11-09`, 'Ngày Pháp luật Việt Nam', 'culture'),
        makeVnEvent(`${y}-11-20`, 'Ngày Nhà giáo Việt Nam', 'culture'),
        makeVnEvent(`${y}-12-22`, 'Ngày thành lập QĐND Việt Nam', 'culture'),
        makeVnEvent(`${y}-12-24`, 'Đêm Giáng Sinh', 'culture'),
        makeVnEvent(`${y}-12-25`, 'Giáng Sinh · Christmas', 'culture')
    ];
}

// Lunar -> Gregorian anchors for the V2 trial.
// 2026/2027 are the primary test years; 2028 includes the major movable festivals.
const VN_LUNAR_EVENTS = {
    2026: [
        ['2026-02-10', 'Ông Công Ông Táo · 23/12 ÂL'],
        ['2026-02-17', 'Tết Nguyên Đán · Mùng 1 Tết'],
        ['2026-03-03', 'Tết Nguyên Tiêu · Rằm tháng Giêng'],
        ['2026-04-19', 'Tết Hàn Thực · 3/3 ÂL'],
        ['2026-04-26', 'Giỗ Tổ Hùng Vương · 10/3 ÂL'],
        ['2026-05-31', 'Lễ Phật Đản · Rằm tháng Tư'],
        ['2026-06-19', 'Tết Đoan Ngọ · 5/5 ÂL'],
        ['2026-08-19', 'Thất Tịch · 7/7 ÂL'],
        ['2026-08-27', 'Vu Lan Báo Hiếu · Rằm tháng Bảy'],
        ['2026-09-25', 'Tết Trung Thu · Rằm tháng Tám']
    ],
    2027: [
        ['2027-01-30', 'Ông Công Ông Táo · 23/12 ÂL'],
        ['2027-02-06', 'Tết Nguyên Đán · Mùng 1 Tết'],
        ['2027-02-20', 'Tết Nguyên Tiêu · Rằm tháng Giêng'],
        ['2027-04-09', 'Tết Hàn Thực · 3/3 ÂL'],
        ['2027-04-16', 'Giỗ Tổ Hùng Vương · 10/3 ÂL'],
        ['2027-05-20', 'Lễ Phật Đản · Rằm tháng Tư'],
        ['2027-06-09', 'Tết Đoan Ngọ · 5/5 ÂL'],
        ['2027-08-16', 'Vu Lan Báo Hiếu · Rằm tháng Bảy'],
        ['2027-09-15', 'Tết Trung Thu · Rằm tháng Tám']
    ],
    2028: [
        ['2028-01-19', 'Ông Công Ông Táo · 23/12 ÂL'],
        ['2028-01-26', 'Tết Nguyên Đán · Mùng 1 Tết'],
        ['2028-05-28', 'Tết Đoan Ngọ · 5/5 ÂL'],
        ['2028-09-03', 'Vu Lan Báo Hiếu · Rằm tháng Bảy'],
        ['2028-10-03', 'Tết Trung Thu · Rằm tháng Tám']
    ]
};

function getVietnamLunarEvents(year) {
    return (VN_LUNAR_EVENTS[year] || []).map(([date, name]) => makeVnEvent(date, name, 'traditional'));
}

function normalizeVietnamHoliday(item) {
    if (!item || !/^\d{4}-\d{2}-\d{2}$/.test(String(item.date || ''))) return null;
    return {
        date: String(item.date),
        localName: String(item.localName || item.name || 'Ngày lễ'),
        name: String(item.name || item.localName || 'Public holiday'),
        category: item.category || 'public',
        source: item.source || 'api'
    };
}

function mergeVietnamEvents(...lists) {
    const out = [];
    const seen = new Set();
    lists.flat().forEach(raw => {
        const item = normalizeVietnamHoliday(raw);
        if (!item) return;
        const key = `${item.date}|${item.localName.toLocaleLowerCase('vi')}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push(item);
    });
    return out.sort((a, b) => a.date.localeCompare(b.date) || a.localName.localeCompare(b.localName, 'vi'));
}

async function getVietnamHolidays(year) {
    const fixed = getVietnamFixedEvents(year);
    const lunar = getVietnamLunarEvents(year);
    const key = VN_HOLIDAY_CACHE_PREFIX + year;
    let official = [];

    try {
        const cached = JSON.parse(localStorage.getItem(key) || 'null');
        if (Array.isArray(cached)) official = cached.map(normalizeVietnamHoliday).filter(Boolean);
    } catch (_) {}

    if (!official.length) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`${VN_HOLIDAY_API_BASE}/${year}/VN`, { signal: controller.signal });
            clearTimeout(timer);
            if (!response.ok) throw new Error(`Holiday API ${response.status}`);
            official = (await response.json()).map(x => normalizeVietnamHoliday({ ...x, category: 'public' })).filter(Boolean);
            localStorage.setItem(key, JSON.stringify(official));
        } catch (error) {
            console.warn('Official Vietnam holiday API unavailable; using built-in calendar events:', error);
        }
    }

    return mergeVietnamEvents(official, fixed, lunar);
}

function getVietnamHolidaysForDay(holidays, year, month, day) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return (holidays || []).filter(h => h.date === date);
}

function getVietnamEventMeta(event) {
    return VN_EVENT_META[event?.category] || VN_EVENT_META.culture;
}


function getCalendarItemsForDay(year, month, day) {
    const targetStart = new Date(year, month, day, 0, 0, 0);
    const targetEnd = new Date(year, month, day, 23, 59, 59);
    const items = [];

    getVisibleSchedules().forEach(x => {
        const start = new Date(`${x.sch.date || ''}T${x.sch.time || '00:00'}`);
        const end = new Date(`${x.sch.endDate || x.sch.date || ''}T${x.sch.endTime || x.sch.time || '23:59'}`);
        if (isNaN(start) || isNaN(end)) return;

        if (start <= targetEnd && end >= targetStart) {
            const activeDate = new Date(year, month, day, 0, 0, 0);
            items.push({ ...x, activeDate, start, end });
        }
    });

    return items.sort((a, b) => {
        const ta = a.sch.time || '00:00';
        const tb = b.sch.time || '00:00';
        return ta.localeCompare(tb) || String(a.sch.title || '').localeCompare(String(b.sch.title || ''));
    });
}

async function openCalendarDayModal(year, month, day) {
    const title = getEl('calendarDayTitle');
    const body = getEl('calendarDayBody');
    if (!title || !body) return;

    const items = getCalendarItemsForDay(year, month, day);
    const holidays = getVietnamHolidaysForDay(await getVietnamHolidays(year), year, month, day);
    const dateLabel = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
    title.textContent = `📅 Date ${dateLabel}`;

    const holidayHTML = holidays.length ? `
        <div class="calendar-day-holidays">
            ${holidays.map(h => { const meta = getVietnamEventMeta(h); return `
                <div class="calendar-day-holiday-item category-${h.category}">
                    <span>${meta.icon}</span>
                    <div><strong>${escapeHTML(h.localName)}</strong><small>${escapeHTML(meta.label)}${h.name && h.name !== h.localName ? ' · ' + escapeHTML(h.name) : ''}</small></div>
                </div>`; }).join('')}
        </div>` : '';

    if (!items.length) {
        body.innerHTML = `${holidayHTML}<div class="calendar-day-empty">${holidays.length ? 'No schedules on this day.' : 'No schedules or public holidays on this day.'}</div>`;
    } else {
        body.innerHTML = `
            ${holidayHTML}
            <div class="calendar-day-count">${items.length} schedule milestones on this day</div>
            <div class="calendar-day-timeline">
                ${items.map(x => `
                    <button class="calendar-day-timeline-item ${x.sch.important ? 'important' : ''}" onclick="openCalendarScheduleDetail('${x.group.id}', ${x.index})">
                        <span class="calendar-day-time">${escapeHTML(x.sch.time || '--:--')}</span>
                        <span class="calendar-day-dot"></span>
                        <span class="calendar-day-info">
                            <strong>${x.sch.important ? '⚠️ ' : ''}${escapeHTML(x.sch.title || 'Untitled')}</strong>
                            <small>${escapeHTML(x.group.title || '')}${x.sch.content ? ' · ' + escapeHTML(String(x.sch.content).slice(0, 80)) : ''}</small>
                        </span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    openModal('calendarDayModal');
    const dayModal = getEl('calendarDayModal');
    if (dayModal) dayModal.classList.add('modal-on-top');
}

async function renderCalendarView() {
    const label = getEl('calendarMonthLabel');
    const grid = getEl('calendarGrid');
    if (!label || !grid) return;

    const y = currentCalendarDate.getFullYear();
    const m = currentCalendarDate.getMonth();
    const today = new Date();
    const renderToken = ++vnHolidayRenderToken;

    label.textContent = `Month ${m + 1}/${y}`;
    const holidays = await getVietnamHolidays(y);
    if (renderToken !== vnHolidayRenderToken) return;

    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startDay = first.getDay();

    let html = ['Sun','T2','T3','T4','T5','T6','T7']
        .map(d => `<div class="calendar-weekday">${d}</div>`)
        .join('');

    for (let i = 0; i < startDay; i++) {
        html += `<div class="calendar-cell muted"></div>`;
    }

    for (let day = 1; day <= last.getDate(); day++) {
        const items = getCalendarItemsForDay(y, m, day);
        const dayHolidays = getVietnamHolidaysForDay(holidays, y, m, day);
        const hasEvents = items.length > 0;
        const hasHoliday = dayHolidays.length > 0;
        const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === day;
        const titleParts = [];
        if (dayHolidays.length) titleParts.push(dayHolidays.map(h => h.localName).join(', '));
        if (items.length) titleParts.push(`${items.length} schedules`);

        html += `
            <div class="calendar-cell ${hasEvents ? 'has-events' : ''} ${hasHoliday ? 'has-holiday' : ''} ${isToday ? 'is-today' : ''}"
                 onclick="openCalendarDayModal(${y}, ${m}, ${day})"
                 title="${escapeHTML(titleParts.join(' · ') || 'No schedules')}">
                <div class="calendar-day-number">${day}</div>
                ${hasEvents ? `<span class="calendar-mobile-count">${items.length}</span>` : ''}
                <div class="calendar-events-wrap">
                    ${dayHolidays.map(h => { const meta = getVietnamEventMeta(h); return `
                        <div class="calendar-holiday category-${h.category}" title="${escapeHTML(meta.label + ' · ' + h.localName)}">
                            <span class="calendar-holiday-flag">${meta.icon}</span>
                            <span>${escapeHTML(h.localName)}</span>
                        </div>
                    `; }).join('')}
                    ${items.map(x => `
                        <button class="calendar-event ${x.sch.important ? 'important' : ''}"
                            onclick="event.stopPropagation(); openCalendarScheduleDetail('${x.group.id}', ${x.index})">
                            ${x.sch.important ? '⚠️' : '•'} ${escapeHTML(x.sch.title || 'Untitled')}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    grid.innerHTML = html;
}


function toggleMobileSidebar(force) {
    const shouldOpen = typeof force === 'boolean' ? force : !document.body.classList.contains('sidebar-open');
    document.body.classList.toggle('sidebar-open', shouldOpen);
}

function openSidebarPanel(type) {
    const title = getEl('sidebarPanelTitle');
    const box = getEl('sidebarPanelContent');
    if (!title || !box) return;
    const titles = { favorites: '⭐ Favorites', recent: '🕘 Recent', upcoming: '📅 Upcoming' };
    title.textContent = titles[type] || 'Quick panel';
    box.innerHTML = renderSidebarPanelContent(type);
    openModal('sidebarPanelModal');
    toggleMobileSidebar(false);
}

function renderSidebarPanelContent(type) {
    if (type === 'favorites') {
        const favs = collectFavoriteEntries(30);
        if (!favs.length) return '<div class="smart-list empty">No favorite groups or pinned items yet.</div>';
        return `<div class="smart-list">${favs.map(item => renderFavoriteEntryHTML(item, true)).join('')}</div>`;
    }
    if (type === 'recent') {
        const recent = readJSONStore(RECENT_KEY, []);
        if (!recent.length) return '<div class="smart-list empty">No recent history yet.</div>';
        return `<div class="sidebar-panel-actions"><button class="btn-real-danger" onclick="clearRecentItems(event); openSidebarPanel('recent')">Clear all</button></div><div class="smart-list">${recent.map((r, i) => `
            <div class="smart-item">
                <div class="smart-item-main" onclick="openRecentItem(${i}); closeModal('sidebarPanelModal')">
                    <span>${r.type === 'link' ? '🔗' : r.type === 'note' ? '📝' : '📅'} ${escapeHTML(r.title)}</span>
                    <small>${escapeHTML(r.subtitle || '')}</small>
                </div>
                <div class="smart-item-actions"><button class="smart-icon-btn" onclick="removeRecentItem(${i}, event); openSidebarPanel('recent')" title="Remove from Recent">✕</button></div>
            </div>`).join('')}</div>`;
    }
    if (type === 'upcoming') {
        const now = new Date();
        const upcoming = [];
        state.dashboardData.forEach(group => {
            if (group.pinKey && group.pinKey !== '' && group.isLocked) return;
            (group.schedules || []).forEach((sch, index) => {
                const d = getScheduleEndDateTime(sch);
                if (!isNaN(d) && d >= now) upcoming.push({ group, sch, index, d });
            });
        });
        upcoming.sort((a,b) => a.d - b.d);
        if (!upcoming.length) return '<div class="smart-list empty">No upcoming schedules.</div>';
        return `<div class="smart-list">${upcoming.slice(0, 30).map(x => `<div class="smart-item" onclick="closeModal('sidebarPanelModal'); showContentDetail('${x.group.id}', ${x.index}, 'schedule')"><span>${x.sch.important ? '⚠️' : '📅'} ${escapeHTML(x.sch.title)}</span><small>${escapeHTML(x.group.title)} · ${String(x.sch.endDate || x.sch.date || '').split('-').reverse().join('/')}</small></div>`).join('')}</div>`;
    }
    return '';
}

function openCalendarScheduleDetail(groupId, index) {
    showContentDetail(groupId, index, 'schedule');
    const readModal = getEl('readModal');
    if (readModal) readModal.classList.add('modal-on-top');
}

function readBackups() {
    return readJSONStore(BACKUP_KEY, []);
}

function writeBackups(items) {
    writeJSONStore(BACKUP_KEY, items.slice(0, 10));
}

function createDashboardBackup(reason = 'Automatic') {
    if (__backupLock) return;
    const backups = readBackups();
    const snapshot = JSON.stringify(state.dashboardData);
    if (backups[0]?.snapshot === snapshot) return;
    backups.unshift({ id: 'bk_' + Date.now(), reason, at: Date.now(), snapshot });
    writeBackups(backups);
}

function createManualBackup() {
    createDashboardBackup('Manual');
    renderBackupModal();
}

function openBackupModal() {
    renderBackupModal();
    openModal('backupModal');
}

function renderBackupModal() {
    const el = getEl('backupList');
    if (!el) return;
    const backups = readBackups();
    if (!backups.length) {
        el.className = 'trash-list empty';
        el.textContent = 'No backups yet.';
        return;
    }
    el.className = 'trash-list';
    el.innerHTML = backups.map((bk, index) => `<div class="trash-item"><div><strong>💾 ${escapeHTML(bk.reason || 'Backup')}</strong><small>${formatTrashTime(bk.at)}</small></div><div class="trash-actions"><button class="btn-success" onclick="restoreBackupAt(${index})">Restore</button><button class="btn-real-danger" onclick="removeBackupAt(${index})">Delete</button></div></div>`).join('');
}

function restoreBackupAt(index) {
    const backups = readBackups();
    const bk = backups[index];
    if (!bk) return;
    customConfirm('Restoring this backup will replace the current dashboard data. Do you want to continue?', '💾 Restore backup').then(ok => {
        if (!ok) return;
        try {
            createDashboardBackup('Before restore');
            state.dashboardData = JSON.parse(bk.snapshot);
            saveData();
            renderBackupModal();
            closeModal('backupModal');
        } catch (err) {
            alert('This backup is corrupted or unreadable.');
        }
    });
}

function removeBackupAt(index) {
    const backups = readBackups();
    backups.splice(index, 1);
    writeBackups(backups);
    renderBackupModal();
}

function clearBackups() {
    customConfirm('Delete all version backups?', '💾 Delete backup').then(ok => {
        if (!ok) return;
        writeBackups([]);
        renderBackupModal();
    });
}

const __v4SaveData = saveData;
saveData = function() {
    createDashboardBackup('Automatic');
    return __v4SaveData();
};

const __v4RenderDashboard = renderDashboard;
renderDashboard = function() {
    __v4RenderDashboard();
    renderTagFilterChips();
    document.querySelectorAll('.group-card').forEach(card => {
        const group = getGroup(card.dataset.id);
        const titleEl = card.querySelector('.group-title');
        if (group && titleEl && group.tags?.length && !titleEl.querySelector('.folder-tags-inline')) {
            titleEl.insertAdjacentHTML('beforeend', renderFolderTags(group));
        }
    });
};

const __v4CollectDashboardItems = collectDashboardItems;
collectDashboardItems = function() {
    return __v4CollectDashboardItems().map(item => ({ ...item, subtitle: `${item.subtitle || ''}${item.tags?.length ? ' · #' + item.tags.join(' #') : ''}` }));
};

// Ctrl+Z khôi phục nhanh mục mới xóa gần nhất
const __v4Keydown = function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        const active = document.activeElement;
        const isTyping = active && ['INPUT','TEXTAREA'].includes(active.tagName);
        if (!isTyping) {
            e.preventDefault();
            restoreLastTrashItem();
        }
    }
};
document.addEventListener('keydown', __v4Keydown);

window.addEventListener('load', () => {
    createDashboardBackup('Page open session');
    renderTagFilterChips();
});

// ========================================================================== 
// V6 - UI refinements: compact create group, cleaner modals/recent
// ========================================================================== 
function openCreateGroupTypeModal() {
    openModal('createGroupTypeModal');
}
function chooseCreateGroupType(type) {
    closeModal('createGroupTypeModal');
    openGroupModal(false, type);
}


// ========================================================================== 
// PATCH: CẬP NHẬT COUNTDOWN NGAY SAU KHI RENDER, NHƯNG KHÔNG GÂY GIẬT LAG
// ========================================================================== 
let __scheduleUIRaf = null;
function queueScheduleUIUpdate() {
    if (__scheduleUIRaf) cancelAnimationFrame(__scheduleUIRaf);
    __scheduleUIRaf = requestAnimationFrame(() => {
        __scheduleUIRaf = null;
        updateScheduleUI();
    });
}

const __fastRenderDashboard = renderDashboard;
renderDashboard = function() {
    __fastRenderDashboard();
    queueScheduleUIUpdate();
};

const __fastToggleAllGroups = toggleAllGroups;
toggleAllGroups = function(shouldOpen = true) {
    __fastToggleAllGroups(shouldOpen);
    queueScheduleUIUpdate();
};


// ========================================================================== 
// MOBILE LITE PATCH - GIẢM TẢI RIÊNG CHO ĐIỆN THOẠI, DESKTOP GIỮ NGUYÊN
// ========================================================================== 
const MOBILE_LITE_KEY = 'dashboardMobileLiteAppliedV1';
function isMobileLiteView() {
    return window.matchMedia('(max-width: 768px), (pointer: coarse) and (max-width: 900px)').matches;
}

function applyMobileLiteMode() {
    const mobile = isMobileLiteView();
    document.body.classList.toggle('mobile-lite', mobile);

    // Mobile: tắt hẳn canvas nền để giảm GPU/CPU. Desktop giữ nguyên.
    if (mobile && typeof isCanvasEnabled !== 'undefined') {
        isCanvasEnabled = false;
        localStorage.setItem('canvas-enabled', 'false');
        if (typeof applyCanvasState === 'function') applyCanvasState();
    }

    // Lần đầu vào mobile: thu gọn toàn bộ group để không render quá nhiều bảng/schedules cùng at.
    if (mobile && !sessionStorage.getItem(MOBILE_LITE_KEY)) {
        state.dashboardData.forEach(group => group.collapsed = true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
        sessionStorage.setItem(MOBILE_LITE_KEY, '1');
    }
}

const __mobileLiteToggleCollapseGroup = toggleCollapseGroup;
toggleCollapseGroup = function(groupId) {
    const group = getGroup(groupId);
    const wasCollapsed = !!group?.collapsed;
    __mobileLiteToggleCollapseGroup(groupId);

    // The first render already expands lazy content; only scroll it into view.
    if (isMobileLiteView() && wasCollapsed) {
        queueMicrotask(() => {
            const card = document.querySelector(`.group-card[data-id="${groupId}"]`);
            if (card) card.scrollIntoView({ block: 'nearest' });
        });
    }
};

const __mobileLiteSaveData = saveData;
saveData = function() {
    if (isMobileLiteView()) document.body.classList.add('mobile-lite-saving');
    __mobileLiteSaveData();
    if (isMobileLiteView()) setTimeout(() => document.body.classList.remove('mobile-lite-saving'), 180);
};

window.addEventListener('resize', () => {
    const wasMobile = document.body.classList.contains('mobile-lite');
    applyMobileLiteMode();
    if (wasMobile !== document.body.classList.contains('mobile-lite')) renderDashboard();
}, { passive: true });

window.addEventListener('load', () => {
    applyMobileLiteMode();
    if (isMobileLiteView()) renderDashboard();
});


// ========================================================================== 
// DASHBOARD_MODAL_STACK_MANAGER - click nền/ESC chỉ đóng modal trên cùng
// ========================================================================== 
(function initModalStackManager() {
    if (window.__dashboardModalStackManagerReady) return;
    window.__dashboardModalStackManagerReady = true;

    function getTopActiveModal() {
        const activeModals = [...document.querySelectorAll('.modal-overlay.active')];
        if (!activeModals.length) return null;
        return activeModals.sort((a, b) => (Number(getComputedStyle(a).zIndex) || 0) - (Number(getComputedStyle(b).zIndex) || 0)).at(-1);
    }

    document.addEventListener('mousedown', function(e) {
        const topModal = getTopActiveModal();
        if (!topModal) return;
        if (e.target === topModal) closeModal(topModal.id);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape') return;
        const topModal = getTopActiveModal();
        if (topModal) closeModal(topModal.id);
    });
})();


// ==========================================================================

// ==========================================================================

// ==========================================================================// ==========================================================================

// ==========================================================================

// ==========================================================================
// SIDEBAR PRO MANAGER
// Desktop: rail/sidebar chuyên nghiệp, click nút mở rộng/thu gọn, không tự sinh nhiều nút.
// Mobile: drawer trượt chuẩn; mở drawer thì ẩn nút ☰, không có ghim.
// ==========================================================================
const SIDEBAR_PRO_KEY = "dashboardSidebarProCollapsed";

function isSidebarProDesktop() {
    return window.matchMedia("(min-width: 769px)").matches;
}

function cleanupSidebarExperimentNodes() {
    [
        "desktopSidebarToggle",
        "edgeSidebarHotspot",
        "sidebarV2Hotspot",
        "sidebarV2Rail",
        "sidebarV2PinBtn",
        "sidebarV3Hotspot",
        "sidebarV3Rail",
        "sidebarV3PinBtn",
        "sidebarFinalHotspot",
        "sidebarFinalRail",
        "sidebarFinalPinBtn"
    ].forEach(id => document.getElementById(id)?.remove());

    document.querySelectorAll(
        ".desktop-sidebar-toggle,.edge-sidebar-pin-btn,.sidebar-v2-pin-btn,.sidebar-v3-pin-btn,.sidebar-final-pin-btn"
    ).forEach(el => el.remove());

    document.body.classList.remove(
        "sidebar-collapsed-desktop",
        "edge-sidebar-enabled","edge-sidebar-open","edge-sidebar-pinned",
        "sidebar-v2-enabled","sidebar-v2-open","sidebar-v2-pinned",
        "sidebar-v3-enabled","sidebar-v3-open","sidebar-v3-pinned",
        "sidebar-final-enabled","sidebar-final-open","sidebar-final-pinned"
    );
}

function setSidebarProCollapsed(collapsed) {
    if (!isSidebarProDesktop()) {
        document.body.classList.remove("sidebar-pro-collapsed");
        return;
    }

    document.body.classList.toggle("sidebar-pro-collapsed", Boolean(collapsed));
    localStorage.setItem(SIDEBAR_PRO_KEY, collapsed ? "true" : "false");
    updateSidebarProToggle();
}

function toggleSidebarPro() {
    const collapsed = document.body.classList.contains("sidebar-pro-collapsed");
    setSidebarProCollapsed(!collapsed);
}

function updateSidebarProToggle() {
    const btn = document.getElementById("sidebarProToggle");
    if (!btn) return;

    const collapsed = document.body.classList.contains("sidebar-pro-collapsed");
    btn.innerHTML = collapsed ? "»" : "«";
    btn.title = collapsed ? "Expand sidebar" : "Collapse sidebar";
    btn.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
}

function initSidebarPro() {
    cleanupSidebarExperimentNodes();

    const sidebar = document.querySelector(".app-sidebar");
    if (!sidebar) return;

    // Desktop toggle: chỉ một nút duy nhất, nằm trong sidebar.
    let toggleBtn = document.getElementById("sidebarProToggle");
    if (!toggleBtn) {
        toggleBtn = document.createElement("button");
        toggleBtn.id = "sidebarProToggle";
        toggleBtn.type = "button";
        toggleBtn.className = "sidebar-pro-toggle";
        toggleBtn.onclick = (event) => {
            event.stopPropagation();
            toggleSidebarPro();
        };
        sidebar.appendChild(toggleBtn);
    }

    // Mobile close button: nếu HTML chưa có thì tự thêm.
    if (!sidebar.querySelector(".sidebar-close")) {
        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "sidebar-close";
        closeBtn.innerHTML = "×";
        closeBtn.setAttribute("aria-label", "Close menu");
        closeBtn.onclick = () => toggleMobileSidebar(false);
        const logo = sidebar.querySelector(".sidebar-logo");
        if (logo?.nextSibling) sidebar.insertBefore(closeBtn, logo.nextSibling);
        else sidebar.prepend(closeBtn);
    }

    sidebar.querySelectorAll("button").forEach(btn => {
        if (btn.id === "sidebarProToggle" || btn.classList.contains("sidebar-close")) return;
        const label = btn.querySelector("span")?.textContent?.trim();
        if (label) btn.title = label;
    });

    const apply = () => {
        const desktop = isSidebarProDesktop();
        document.body.classList.toggle("sidebar-pro-enabled", desktop);

        if (!desktop) {
            document.body.classList.remove("sidebar-pro-collapsed");
            updateSidebarProToggle();
            return;
        }

        const savedValue = localStorage.getItem(SIDEBAR_PRO_KEY);
        const savedCollapsed = savedValue === null ? true : savedValue === "true";
        document.body.classList.toggle("sidebar-pro-collapsed", savedCollapsed);
        updateSidebarProToggle();
    };

    window.addEventListener("resize", apply);
    apply();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebarPro);
} else {
    initSidebarPro();
}


// ==========================================================================
// RESTORE DESKTOP BACKGROUND CANVAS
// Desktop luôn giữ hiệu ứng nền/canvas. Mobile vẫn có thể giảm tải.
 // ==========================================================================
function ensureDesktopBackgroundCanvas() {
    const isDesktop = window.matchMedia("(min-width: 769px)").matches;
    const canvasEl = document.getElementById("bgCanvas");

    if (!canvasEl) return;

    if (isDesktop) {
        // Không ép localStorage nếu người dùng tự tắt bằng nút,
        // nhưng nếu đang bị mobile-lite/patch cũ ẩn bằng style thì mở lại.
        if (localStorage.getItem("canvas-enabled") === "true") {
            isCanvasEnabled = true;
            canvasEl.style.display = "block";
            resizeCanvas?.();

            if (!animationFrameId && typeof drawBackground === "function") {
                animationFrameId = requestAnimationFrame(drawBackground);
            }
        } else {
            isCanvasEnabled = false;
            canvasEl.style.display = "none";

            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureDesktopBackgroundCanvas);
} else {
    ensureDesktopBackgroundCanvas();
}
window.addEventListener("resize", ensureDesktopBackgroundCanvas);

// ==========================================================================
// BACKUP PIN + DRIVE FULL SYNC UPGRADE
// Lưu thêm thùng rác + backup lên Google Drive, và backup đã ghim không bị xoá bởi giới hạn.
// ==========================================================================
const BACKUP_MAX_UNPINNED = 20;
const DRIVE_PAYLOAD_SCHEMA = 2;

function normalizeBackupListForLimit(items = []) {
    const seen = new Set();
    const normalized = (Array.isArray(items) ? items : [])
        .filter(Boolean)
        .map(item => ({ ...item, id: item.id || ('bk_' + (item.at || Date.now()) + '_' + Math.random().toString(36).slice(2, 6)) }))
        .filter(item => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
        })
        .sort((a, b) => Number(b.at || 0) - Number(a.at || 0));

    const pinned = normalized.filter(item => item.pinned === true);
    const unpinned = normalized.filter(item => item.pinned !== true).slice(0, BACKUP_MAX_UNPINNED);
    return [...pinned, ...unpinned];
}

// Ghi đè writeBackups cũ: giữ toàn bộ backup đã ghim, chỉ giới hạn 20 backup chưa ghim.
writeBackups = function(items) {
    writeJSONStore(BACKUP_KEY, normalizeBackupListForLimit(items));
};

function toggleBackupPinAt(index) {
    const backups = readBackups();
    const bk = backups[index];
    if (!bk) return;
    bk.pinned = !bk.pinned;
    writeBackups(backups);
    renderBackupModal();
}

// Render lại modal backup có nút ghim.
renderBackupModal = function() {
    const el = getEl('backupList');
    if (!el) return;
    const backups = readBackups();
    if (!backups.length) {
        el.className = 'trash-list empty';
        el.textContent = 'No backups yet.';
        return;
    }

    el.className = 'trash-list backup-list';
    el.innerHTML = backups.map((bk, index) => {
        const isPinned = bk.pinned === true;
        return `
            <div class="trash-item backup-item ${isPinned ? 'backup-pinned' : ''}">
                <div>
                    <strong>${isPinned ? '📌' : '💾'} ${escapeHTML(bk.reason || 'Backup')}</strong>
                    <small>${formatTrashTime(bk.at)}${isPinned ? ' · Pinned' : ''}</small>
                </div>
                <div class="trash-actions backup-actions">
                    <button class="btn-secondary backup-pin-btn ${isPinned ? 'active' : ''}" onclick="toggleBackupPinAt(${index})" title="${isPinned ? 'Unpin backup' : 'Pin backup'}">${isPinned ? '📌' : '📍'}</button>
                    <button class="btn-success" onclick="restoreBackupAt(${index})">Restore</button>
                    <button class="btn-real-danger" onclick="removeBackupAt(${index})">Delete</button>
                </div>
            </div>`;
    }).join('');
};

// Delete backup: nếu backup đang ghim thì hỏi kỹ hơn.
removeBackupAt = function(index) {
    const backups = readBackups();
    const bk = backups[index];
    if (!bk) return;

    const doRemove = () => {
        backups.splice(index, 1);
        writeBackups(backups);
        renderBackupModal();
    };

    if (bk.pinned) {
        customConfirm('This backup is pinned. Do you still want to delete it?', '📌 Delete pinned backup').then(ok => {
            if (ok) doRemove();
        });
    } else {
        doRemove();
    }
};

// Delete backup hàng loạt: giữ backup đã ghim lại để tránh xóa nhầm.
clearBackups = function() {
    customConfirm('Delete all unpinned backups? Pinned backups will be kept.', '💾 Delete backup').then(ok => {
        if (!ok) return;
        const pinned = readBackups().filter(item => item.pinned === true);
        writeBackups(pinned);
        renderBackupModal();
    });
};

function buildDrivePayload() {
    return {
        schema: DRIVE_PAYLOAD_SCHEMA,
        updatedAt: Date.now(),
        dashboardData: state.dashboardData,
        trashItems: readJSONStore(TRASH_KEY, []),
        backups: readBackups()
    };
}

function applyDrivePayload(cloudData) {
    // Tương thích dữ liệu Drive cũ: trước đây file chỉ là mảng dashboardData.
    if (Array.isArray(cloudData)) {
        state.dashboardData = cloudData;
        return;
    }

    if (!cloudData || typeof cloudData !== 'object') return;

    if (Array.isArray(cloudData.dashboardData)) {
        state.dashboardData = cloudData.dashboardData;
    }

    if (Array.isArray(cloudData.trashItems)) {
        localStorage.setItem(TRASH_KEY, JSON.stringify(cloudData.trashItems));
    }

    if (Array.isArray(cloudData.backups)) {
        localStorage.setItem(BACKUP_KEY, JSON.stringify(normalizeBackupListForLimit(cloudData.backups)));
    }
}

// Ghi đè sync Drive cũ: lưu cả dashboard + thùng rác + backup.
syncToGoogleDrive = async function(isSilent = false) {
    if (!gapi.client.getToken()) return isSilent ? null : alert('Google is not connected!');
    const syncBtn = getEl('btn-sync-google');
    if (!isSilent && syncBtn) syncBtn.innerHTML = '⏳ Syncing...';

    const localData = JSON.stringify(buildDrivePayload());

    try {
        if (!googleFileId) {
            const res = await gapi.client.drive.files.list({ q: "name = 'workspace_data.json'", spaces: 'appDataFolder' });
            if (res.result.files?.length > 0) googleFileId = res.result.files[0].id;
        }

        if (googleFileId) {
            await gapi.client.request({
                path: `/upload/drive/v3/files/${googleFileId}`,
                method: 'PATCH',
                params: { uploadType: 'media' },
                body: localData
            });
        } else {
            const metadata = { name: 'workspace_data.json', parents: ['appDataFolder'] };
            const boundary = '314159265358979323846';
            const body = `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${localData}\r\n--${boundary}--`;
            googleFileId = (await gapi.client.request({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: { uploadType: 'multipart' },
                headers: { 'Content-Type': `multipart/related; boundary="${boundary}"` },
                body
            })).result.id;
        }

        if (!isSilent) alert('📤 Drive sync completed!\nSaved Dashboard, Trash, and Backups.');
    } catch (e) {
        if (!isSilent) alert('Sync error: ' + e.message);
    } finally {
        if (syncBtn) syncBtn.innerHTML = '🔄 Sync Drive';
    }
};

// Ghi đè tải Drive cũ: đọc được cả định dạng cũ và định dạng mới.
fetchFileFromGoogleDrive = async function() {
    try {
        const response = await gapi.client.drive.files.list({
            q: "name = 'workspace_data.json'",
            spaces: 'appDataFolder',
            fields: 'files(id, name)'
        });
        const files = response.result.files;

        if (files?.length > 0) {
            googleFileId = files[0].id;
            const cloudData = (await gapi.client.drive.files.get({ fileId: googleFileId, alt: 'media' })).result;

            const isValid = Array.isArray(cloudData) || (cloudData && Array.isArray(cloudData.dashboardData));
            if (isValid) {
                const ok = await customConfirm(
                    'Cloud data is newer than the data on this device. Choose which version you want to keep.\n\nCloud data may include Dashboard + Trash + Backups.',
                    '⚠️ DATA CONFLICT',
                    { confirmLabel: 'Use cloud data', cancelLabel: 'Keep local data', confirmClass: 'btn-primary', cancelClass: 'btn-secondary' }
                );

                if (ok) {
                    applyDrivePayload(cloudData);
                    state.dashboardData.forEach(g => { if (g.pinKey) g.isLocked = true; });
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
                    renderDashboard();
                    updateScheduleUI();
                    renderBackupModal?.();
                    renderTrashModal?.();
                    alert('📥 Data loaded successfully!');
                } else {
                    syncToGoogleDrive(false);
                }
            }
        } else {
            syncToGoogleDrive(true);
        }
    } catch (err) {
        console.error(err);
    }
};

// Nếu thùng rác/backup thay đổi mà đã liên kết Google thì sync ngầm lên Drive.
const __driveFullSyncWriteJSONStore = writeJSONStore;
writeJSONStore = function(key, value) {
    __driveFullSyncWriteJSONStore(key, value);
    if ((key === TRASH_KEY || key === BACKUP_KEY) && gapiInited && gisInited && gapi.client.getToken()) {
        clearTimeout(window.__driveMetaSyncTimer);
        window.__driveMetaSyncTimer = setTimeout(() => syncToGoogleDrive(true), 600);
    }
};


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

// ========================================================================== 
// KANBAN WORKSPACE FIX - modal based board/column/card actions
// ========================================================================== 
let kanbanTextModalResolve = null;

function ensureKanbanTextModal() {
    if (getEl('kanbanTextModal')) return;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'kanbanTextModal';
    modal.innerHTML = `
        <div class="modal-box kanban-text-modal-box" style="max-width:420px;">
            <h3 id="kanbanTextModalTitle">Kanban</h3>
            <label id="kanbanTextModalLabel">Name:</label>
            <input type="text" id="kanbanTextModalInput" autocomplete="off">
            <p id="kanbanTextModalHint" class="kanban-modal-hint"></p>
            <div class="modal-footer">
                <button class="btn-secondary" id="kanbanTextCancelBtn" type="button">Cancel</button>
                <button class="btn-primary" id="kanbanTextConfirmBtn" type="button">Confirm</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const cancel = () => {
        closeModal('kanbanTextModal');
        if (kanbanTextModalResolve) kanbanTextModalResolve(null);
        kanbanTextModalResolve = null;
    };
    const confirm = () => {
        const value = (getEl('kanbanTextModalInput')?.value || '').trim();
        if (!value) {
            getEl('kanbanTextModalHint').textContent = 'Please enter a name.';
            return;
        }
        closeModal('kanbanTextModal');
        if (kanbanTextModalResolve) kanbanTextModalResolve(value);
        kanbanTextModalResolve = null;
    };

    getEl('kanbanTextCancelBtn').onclick = cancel;
    getEl('kanbanTextConfirmBtn').onclick = confirm;
    getEl('kanbanTextModalInput').addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            confirm();
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            cancel();
        }
    });
}

function openKanbanTextModal({ title = 'Kanban', label = 'Name:', value = '', placeholder = '', confirmText = 'Confirm' } = {}) {
    ensureKanbanTextModal();
    getEl('kanbanTextModalTitle').textContent = title;
    getEl('kanbanTextModalLabel').textContent = label;
    getEl('kanbanTextModalInput').value = value || '';
    getEl('kanbanTextModalInput').placeholder = placeholder || '';
    getEl('kanbanTextModalHint').textContent = '';
    getEl('kanbanTextConfirmBtn').textContent = confirmText;
    openModal('kanbanTextModal');
    setTimeout(() => getEl('kanbanTextModalInput')?.focus(), 50);
    return new Promise(resolve => { kanbanTextModalResolve = resolve; });
}

function showKanbanNotice(message, title = '📌 Kanban Notice') {
    const alertModal = getEl('alertModal');
    const alertTitle = getEl('alertModalTitle');
    const alertMsg = getEl('alertMessage');
    if (alertModal && alertMsg) {
        if (alertTitle) alertTitle.textContent = title;
        alertMsg.textContent = message;
        openModal('alertModal');
        return;
    }
    console.warn(message);
}

function refreshKanbanAfterChange(groupId, boardId) {
    saveData();
    if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) {
        kanbanWorkspaceState.groupId = groupId;
        if (boardId) kanbanWorkspaceState.boardId = boardId;
        renderKanbanWorkspaceBody();
    }
}

function ensureKanbanWorkspaceModal() {
    let modal = getEl('kanbanWorkspaceModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-overlay kanban-workspace-overlay';
        modal.id = 'kanbanWorkspaceModal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="kanban-workspace-box">
            <div class="kanban-workspace-head">
                <div>
                    <h3 id="kanbanWorkspaceTitle">📌 Kanban Workspace</h3>
                    <p id="kanbanWorkspaceSubtitle">Boards, columns and cards</p>
                </div>
                <button class="modal-close-soft" onclick="closeModal('kanbanWorkspaceModal')">✕</button>
            </div>
            <div class="kanban-workspace-actions">
                <button class="btn-primary" onclick="addKanbanBoard()">➕ Board</button>
                <button class="btn-primary" onclick="addKanbanColumn()">➕ Column</button>
                <button class="btn-primary" onclick="openKanbanCardModal()">➕ Card</button>
                <button class="btn-secondary" onclick="renameKanbanBoard()">📝 Rename board</button>
                <button class="btn-secondary" id="kanbanLayoutToggleBtn" onclick="toggleKanbanLayoutMode()">⇄ Row view</button>
                <button class="btn-real-danger" onclick="deleteKanbanBoard()">🗑️ Delete board</button>
                <input id="kanbanWorkspaceSearch" type="search" placeholder="Search cards..." oninput="renderKanbanWorkspaceBody()">
            </div>
            <div class="kanban-workspace-layout">
                <aside id="kanbanBoardList" class="kanban-board-list"></aside>
                <main id="kanbanWorkspaceBody" class="kanban-workspace-body"></main>
            </div>
        </div>
    `;
}

function renderKanbanWorkspaceBody() {
    const group = getGroup(kanbanWorkspaceState.groupId);
    if (!group) return;
    const workspace = normalizeKanbanGroup(group);
    const activeBoard = getKanbanBoard(group, kanbanWorkspaceState.boardId);
    kanbanWorkspaceState.boardId = activeBoard.id;
    const keyword = (getEl('kanbanWorkspaceSearch')?.value || '').trim().toLowerCase();
    const layoutMode = kanbanLayoutMode === 'row' ? 'row' : 'column';
    const layoutBtn = getEl('kanbanLayoutToggleBtn');
    if (layoutBtn) layoutBtn.textContent = layoutMode === 'row' ? '▦ Column view' : '⇄ Row view';

    const boardList = getEl('kanbanBoardList');
    if (boardList) {
        boardList.innerHTML = workspace.boards.map(board => `
            <button class="kanban-board-tab ${board.id === activeBoard.id ? 'active' : ''}" onclick="kanbanWorkspaceState.boardId='${board.id}';renderKanbanWorkspaceBody()">
                <span>${escapeHTML(board.title)}</span>
                <small>${getKanbanCardCount(group, board.id)} cards · ${board.columns.length} columns</small>
            </button>
        `).join('') + `
            <button class="kanban-board-tab add" onclick="addKanbanBoard()">＋ New board</button>
        `;
    }

    const body = getEl('kanbanWorkspaceBody');
    if (!body) return;
    const subtitle = getEl('kanbanWorkspaceSubtitle');
    if (subtitle) subtitle.textContent = `${workspace.boards.length} boards · ${getKanbanCardCount(group)} total cards · Active: ${activeBoard.title}`;

    body.innerHTML = `
        <div class="kanban-full-board ${layoutMode === 'row' ? 'kanban-row-mode' : 'kanban-column-mode'}" data-group-id="${group.id}" data-board-id="${activeBoard.id}">
            ${activeBoard.columns.map(col => {
                const filteredCards = keyword
                    ? col.cards.filter(card => [card.title, card.content, card.priority, card.deadline].filter(Boolean).join(' ').toLowerCase().includes(keyword))
                    : col.cards;
                return `
                    <section class="kanban-full-column" data-column-id="${col.id}">
                        <div class="kanban-full-column-head">
                            <strong>${escapeHTML(col.title)}</strong>
                            <span>${filteredCards.length}/${col.cards.length}</span>
                        </div>
                        <div class="kanban-full-column-actions">
                            <button onclick="openKanbanCardModal('${group.id}','${col.id}',null,'${activeBoard.id}')">＋ Card</button>
                            <button onclick="renameKanbanColumn('${group.id}','${col.id}','${activeBoard.id}')">Edit</button>
                            <button onclick="deleteKanbanColumn('${group.id}','${col.id}','${activeBoard.id}')">Delete</button>
                        </div>
                        <div class="kanban-workspace-card-list" data-group-id="${group.id}" data-board-id="${activeBoard.id}" data-column-id="${col.id}">
                            ${filteredCards.map(card => renderKanbanWorkspaceCardHTML(group.id, activeBoard.id, card)).join('')}
                        </div>
                    </section>
                `;
            }).join('')}
            <section class="kanban-full-column add-column" onclick="addKanbanColumn('${group.id}', '${activeBoard.id}')">＋ Add column</section>
        </div>
    `;
    initKanbanWorkspaceDragAndDrop();
}

async function addKanbanBoard(groupId = kanbanWorkspaceState.groupId) {
    const group = getGroup(groupId);
    if (!group) return;
    const title = await openKanbanTextModal({
        title: '➕ Add board',
        label: 'Board name:',
        value: 'New Board',
        placeholder: 'Example: Dashboard Project',
        confirmText: 'Create board'
    });
    if (!title) return;
    const board = createDefaultKanbanBoard(title);
    normalizeKanbanGroup(group).boards.push(board);
    kanbanWorkspaceState = { groupId: group.id, boardId: board.id };
    refreshKanbanAfterChange(group.id, board.id);
}

async function renameKanbanBoard(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const title = await openKanbanTextModal({
        title: '📝 Rename board',
        label: 'Board name:',
        value: board.title,
        placeholder: 'Example: Dashboard Project',
        confirmText: 'Save board'
    });
    if (!title) return;
    board.title = title;
    refreshKanbanAfterChange(group.id, board.id);
}

function deleteKanbanBoard(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const workspace = normalizeKanbanGroup(group);
    if (workspace.boards.length <= 1) {
        showKanbanNotice('Kanban workspace must have at least one board.');
        return;
    }
    const board = getKanbanBoard(group, boardId);
    customConfirm(`Delete board "${escapeHTML(board.title)}" and all cards inside?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        workspace.boards = workspace.boards.filter(item => item.id !== board.id);
        kanbanWorkspaceState.boardId = workspace.boards[0].id;
        refreshKanbanAfterChange(group.id, kanbanWorkspaceState.boardId);
    });
}

async function addKanbanColumn(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const title = await openKanbanTextModal({
        title: '➕ Add column',
        label: 'Column name:',
        value: 'New Column',
        placeholder: 'Example: Waiting, Testing, Done...',
        confirmText: 'Create column'
    });
    if (!title) return;
    board.columns.push({ id: `col_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`, title, cards: [] });
    refreshKanbanAfterChange(group.id, board.id);
}

async function renameKanbanColumn(groupId = kanbanWorkspaceState.groupId, columnId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group || !columnId) return;
    const col = getKanbanColumn(group, columnId, boardId);
    if (!col) return;
    const title = await openKanbanTextModal({
        title: '📝 Rename column',
        label: 'Column name:',
        value: col.title,
        placeholder: 'Example: Review',
        confirmText: 'Save column'
    });
    if (!title) return;
    col.title = title;
    refreshKanbanAfterChange(group.id, boardId);
}

function deleteKanbanColumn(groupId = kanbanWorkspaceState.groupId, columnId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group || !columnId) return;
    const board = getKanbanBoard(group, boardId);
    const col = board.columns.find(c => c.id === columnId);
    if (!col) return;
    if (board.columns.length <= 1) {
        showKanbanNotice('Kanban must have at least one column.');
        return;
    }
    customConfirm(`Delete column "${escapeHTML(col.title)}" and ${col.cards.length} cards inside?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        board.columns = board.columns.filter(c => c.id !== columnId);
        refreshKanbanAfterChange(group.id, board.id);
    });
}

function submitKanbanCardForm() {
    const group = getGroup(kanbanCardEditState.groupId);
    if (!group) return;
    const title = (getEl('kanbanCardTitleInput')?.value || '').trim();
    if (!title) {
        showKanbanNotice('Please enter a card title.');
        return;
    }
    const data = {
        id: kanbanCardEditState.cardId || `card_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
        title,
        priority: getEl('kanbanCardPriorityInput')?.value || 'normal',
        deadline: getEl('kanbanCardDeadlineInput')?.value || '',
        content: getEl('kanbanCardContentInput')?.value || ''
    };
    if (kanbanCardEditState.cardId) {
        const found = findKanbanCard(group, kanbanCardEditState.cardId, kanbanCardEditState.boardId);
        if (found) found.column.cards[found.index] = data;
    } else {
        const column = getKanbanColumn(group, kanbanCardEditState.columnId, kanbanCardEditState.boardId);
        column.cards.push(data);
    }
    closeModal('kanbanCardModal');
    refreshKanbanAfterChange(group.id, kanbanCardEditState.boardId);
}

function deleteKanbanCard(groupId, cardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId);
    if (!found) return;
    customConfirm(`Delete card "${escapeHTML(found.card.title || 'Untitled')}"?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        found.column.cards.splice(found.index, 1);
        refreshKanbanAfterChange(group.id, found.board.id);
    });
}


// ========================================================================== 
// KANBAN FIX PATCH: top modal stacking + delete one card button
// ========================================================================== 
function openKanbanTopModal(id) {
    const modal = getEl(id);
    if (!modal) return;
    modal.classList.add('active');
    modal.classList.add('modal-on-top');
    modal.style.zIndex = '2147483000';
    const box = modal.querySelector('.modal-box');
    if (box) box.style.zIndex = '2147483001';
}

function closeKanbanTopModal(id) {
    const modal = getEl(id);
    if (!modal) return;
    modal.classList.remove('active');
    modal.classList.remove('modal-on-top');
    modal.style.zIndex = '';
    const box = modal.querySelector('.modal-box');
    if (box) box.style.zIndex = '';
}

// Override confirm so confirmation always appears above Kanban fullscreen modal.
function customConfirm(message, title = "❓ Confirm action", options = {}) {
    return new Promise((resolve) => {
        const confirmModal = getEl('confirmModal');
        const confirmTitle = getEl('confirmTitle');
        const confirmMsg = getEl('confirmMessage');
        const confirmBtn = getEl('confirmDeleteBtn');
        const cancelBtn = getEl('confirmCancelBtn');
        if (!confirmModal || !confirmMsg || !confirmBtn || !cancelBtn) {
            resolve(window.confirm(message));
            return;
        }
        if (confirmTitle) confirmTitle.innerText = title;
        confirmMsg.innerHTML = String(message).replace(/\n/g, '<br>');
        applyConfirmActionConfig(confirmBtn, cancelBtn, message, title, options);
        openKanbanTopModal('confirmModal');
        confirmBtn.onclick = function() {
            closeKanbanTopModal('confirmModal');
            resolve(true);
        };
        cancelBtn.onclick = function() {
            closeKanbanTopModal('confirmModal');
            resolve(false);
        };
    });
}

// Override card modal so Edit Card shows a Delete button and modal stays above board.
function openKanbanCardModal(groupId = kanbanWorkspaceState.groupId, columnId = null, cardId = null, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const found = cardId ? findKanbanCard(group, cardId, board.id) : null;
    const firstColumn = board.columns[0];
    kanbanCardEditState = {
        groupId: group.id,
        boardId: found?.board?.id || board.id,
        columnId: found?.column?.id || columnId || firstColumn?.id,
        cardId: found?.card?.id || null
    };
    getEl('kanbanCardModalTitle').innerText = found ? '📝 Edit Kanban Card' : '➕ Add Kanban Card';
    getEl('kanbanCardTitleInput').value = found?.card?.title || '';
    getEl('kanbanCardPriorityInput').value = found?.card?.priority || 'normal';
    getEl('kanbanCardDeadlineInput').value = found?.card?.deadline || '';
    getEl('kanbanCardContentInput').value = found?.card?.content || '';

    let deleteBtn = getEl('kanbanCardDeleteBtn');
    const footer = getEl('kanbanCardModal')?.querySelector('.modal-footer');
    if (!deleteBtn && footer) {
        deleteBtn = document.createElement('button');
        deleteBtn.id = 'kanbanCardDeleteBtn';
        deleteBtn.className = 'btn-real-danger';
        deleteBtn.textContent = 'Delete card';
        deleteBtn.style.marginRight = 'auto';
        deleteBtn.onclick = deleteCurrentKanbanCard;
        footer.prepend(deleteBtn);
    }
    if (deleteBtn) deleteBtn.style.display = found ? 'inline-flex' : 'none';

    openKanbanTopModal('kanbanCardModal');
}

function submitKanbanCardForm() {
    const group = getGroup(kanbanCardEditState.groupId);
    if (!group) return;
    const title = (getEl('kanbanCardTitleInput')?.value || '').trim();
    if (!title) {
        showKanbanNotice('Please enter a card title.');
        return;
    }
    const data = {
        id: kanbanCardEditState.cardId || `card_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
        title,
        priority: getEl('kanbanCardPriorityInput')?.value || 'normal',
        deadline: getEl('kanbanCardDeadlineInput')?.value || '',
        content: getEl('kanbanCardContentInput')?.value || ''
    };
    if (kanbanCardEditState.cardId) {
        const found = findKanbanCard(group, kanbanCardEditState.cardId, kanbanCardEditState.boardId);
        if (found) found.column.cards[found.index] = data;
    } else {
        const column = getKanbanColumn(group, kanbanCardEditState.columnId, kanbanCardEditState.boardId);
        if (!column) return;
        column.cards.push(data);
    }
    closeKanbanTopModal('kanbanCardModal');
    refreshKanbanAfterChange(group.id, kanbanCardEditState.boardId);
}

function deleteCurrentKanbanCard() {
    const { groupId, cardId, boardId } = kanbanCardEditState || {};
    if (!groupId || !cardId) return;
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId, boardId);
    if (!found) return;

    closeSmartModal('kanbanCardModal');

    customConfirm(`Delete card "${escapeHTML(found.card.title || 'Untitled card')}"?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) {
            openKanbanCardModal(groupId, found.column.id, cardId, found.board.id);
            return;
        }
        found.column.cards.splice(found.index, 1);
        refreshKanbanAfterChange(group.id, found.board.id);
    });
}

function deleteKanbanCard(groupId, cardId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId, boardId);
    if (!found) return;
    customConfirm(`Delete card "${escapeHTML(found.card.title || 'Untitled card')}"?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        found.column.cards.splice(found.index, 1);
        refreshKanbanAfterChange(group.id, found.board.id);
    });
}



// ==========================================================================
// GLOBAL MODAL MANAGER
// Opens one modal at a time. If a modal is already open, it is hidden and pushed
// to a stack. Closing the current modal restores the previous one.
// ==========================================================================
const modalStack = window.modalStack || [];
window.modalStack = modalStack;

function getActiveTopModal() {
    const activeModals = Array.from(document.querySelectorAll('.modal-overlay.active:not(.modal-hidden-stack)'));
    return activeModals.length ? activeModals[activeModals.length - 1] : null;
}

function openSmartModal(id) {
    const newModal = getEl ? getEl(id) : document.getElementById(id);
    if (!newModal) return;

    const currentModal = getActiveTopModal();

    if (currentModal && currentModal.id !== id) {
        currentModal.classList.add('modal-hidden-stack');
        currentModal.classList.remove('active');
        if (currentModal.id && modalStack[modalStack.length - 1] !== currentModal.id) {
            modalStack.push(currentModal.id);
        }
    }

    newModal.classList.remove('modal-hidden-stack');
    newModal.classList.add('active');
    newModal.style.zIndex = '';
    const box = newModal.querySelector('.modal-box');
    if (box) box.style.zIndex = '';
}

function closeSmartModal(id) {
    const modal = getEl ? getEl(id) : document.getElementById(id);
    if (!modal) return;

    modal.classList.remove('active');
    modal.classList.remove('modal-hidden-stack');
    modal.style.zIndex = '';
    const box = modal.querySelector('.modal-box');
    if (box) box.style.zIndex = '';

    let previousId = modalStack.pop();
    while (previousId) {
        const previousModal = getEl ? getEl(previousId) : document.getElementById(previousId);
        if (previousModal) {
            previousModal.classList.remove('modal-hidden-stack');
            previousModal.classList.add('active');
            previousModal.style.zIndex = '';
            const previousBox = previousModal.querySelector('.modal-box');
            if (previousBox) previousBox.style.zIndex = '';
            break;
        }
        previousId = modalStack.pop();
    }
}

function closeAllSmartModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active', 'modal-hidden-stack', 'modal-on-top', 'kanban-confirm-top');
        modal.style.zIndex = '';
        const box = modal.querySelector('.modal-box');
        if (box) box.style.zIndex = '';
    });
    modalStack.length = 0;
}

// Override old modal helpers globally so existing buttons/functions use the same manager.
openModal = openSmartModal;
closeModal = closeSmartModal;

function openKanbanTopModal(id) { openSmartModal(id); }
function closeKanbanTopModal(id) { closeSmartModal(id); }
function openKanbanChildModal(id) { openSmartModal(id); }
function closeKanbanChildModal(id) { closeSmartModal(id); }
// ============================================================================
// MULTI THEME + IMMERSIVE THEME-AWARE SCENES (V3)
// ============================================================================
// MULTI THEME + CINEMATIC ADAPTIVE SCENES (V3)
// ============================================================================
const DASHBOARD_THEMES = [
  {id:'dark',name:'Dark',icon:'🌙',scene:'night'}, {id:'light',name:'Light',icon:'☀️',scene:'day'},
  {id:'midnight',name:'Midnight',icon:'🌌',scene:'midnight'}, {id:'oled',name:'OLED',icon:'⚫',scene:'oled'},
  {id:'forest',name:'Forest',icon:'🌲',scene:'forest'}, {id:'ocean',name:'Ocean',icon:'🌊',scene:'ocean'},
  {id:'sunset',name:'Sunset',icon:'🌇',scene:'sunset'}, {id:'coffee',name:'Coffee',icon:'☕',scene:'coffee'},
  {id:'mint',name:'Mint',icon:'🌿',scene:'meadow'}, {id:'sakura-night',name:'Sakura Night',icon:'🌸',scene:'sakura'},
  {id:'sky',name:'Sky',icon:'☁️',scene:'sky'}, {id:'cyber',name:'Cyber',icon:'⚡',scene:'cyber'},
  {id:'grape',name:'Grape',icon:'🍇',scene:'grape'}, {id:'terminal',name:'Terminal',icon:'💻',scene:'terminal'}
];
const LIGHT_COMPAT_THEMES = new Set(['light','mint','sky']);
const THEME_SCENE_LABELS={night:'Starry night',day:'Soft daylight',midnight:'Moonlit mountains',oled:'Pure black sky',forest:'Forest · mist · fireflies',rose:'Rose meadow · wind · clouds',lavender:'Lavender valley',ocean:'Underwater reef',sunset:'Golden valley',coffee:'Warm café window',meadow:'Fresh meadow',sakura:'Moonlit sakura',sky:'Open blue sky',lemon:'Lemon orchard',peach:'Peach orchard',cyber:'Neon skyline',grape:'Purple nebula',terminal:'Terminal city'};
let themeFxParticles=[], themeFxTick=0, sceneCache=null, sceneCacheCtx=null, sceneCacheKey='', fxLastFrame=0;
const prefersReducedMotion = matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
const FX_QUALITY = (()=>{ const mobile=innerWidth<769; const cores=navigator.hardwareConcurrency||4; const mem=navigator.deviceMemory||4; if(prefersReducedMotion) return .22; if(mobile||cores<=4||mem<=4) return .55; return .9; })();
const FX_TARGET_FPS = FX_QUALITY < .6 ? 30 : 45;

const AUTO_TIME_THEME_KEY = 'dashboardAutoTimeThemeV1';
let autoTimeThemeTimer = null;
let lastAutoTimeThemeSlot = '';

function getCurrentTheme(){ const v=localStorage.getItem(THEME_KEY)||'dark'; return DASHBOARD_THEMES.some(t=>t.id===v)?v:'dark'; }
function getThemeMeta(id=null){
  // Visuals must follow the theme currently applied to the page.
  // Auto by time intentionally does not overwrite THEME_KEY, so reading only
  // localStorage here would keep the old Visuals scene.
  const activeThemeId = id || document.body.dataset.theme || getCurrentTheme();
  return DASHBOARD_THEMES.find(t=>t.id===activeThemeId)||DASHBOARD_THEMES[0];
}
function sceneLabel(scene){return THEME_SCENE_LABELS[scene]||scene;}
function isAutoTimeThemeEnabled(){ return localStorage.getItem(AUTO_TIME_THEME_KEY)==='true'; }
function getAutoTimeThemeInfo(date=new Date()){
  const h=date.getHours();
  if(h>=5 && h<10) return {slot:'morning',label:'Morning',icon:'🌅',theme:'sky',range:'05:00–09:59'};
  if(h>=10 && h<14) return {slot:'noon',label:'Noon',icon:'☀️',theme:'light',range:'10:00–13:59'};
  if(h>=14 && h<18) return {slot:'afternoon',label:'Afternoon',icon:'🌇',theme:'sunset',range:'14:00–17:59'};
  if(h>=18 && h<22) return {slot:'evening',label:'Evening',icon:'☕',theme:'coffee',range:'18:00–21:59'};
  return {slot:'night',label:'Night',icon:'🌙',theme:'midnight',range:'22:00–04:59'};
}
function updateAutoTimeThemeUI(){
  const autoBtn=document.getElementById('autoTimeThemeChoice');
  if(!autoBtn)return;
  const enabled=isAutoTimeThemeEnabled();
  const info=getAutoTimeThemeInfo();
  autoBtn.classList.toggle('active',enabled);
  const check=autoBtn.querySelector('.theme-check'); if(check)check.textContent=enabled?'✓':'';
  const desc=autoBtn.querySelector('.auto-time-description');
  if(desc)desc.textContent=enabled?`${info.icon} ${info.label} now · ${info.range} · ${getThemeMeta(info.theme).name}`:'Automatically changes Morning · Noon · Afternoon · Evening · Night';
}
function applyDashboardTheme(themeId,save=true,preserveAuto=false){
  const meta=getThemeMeta(themeId); document.body.dataset.theme=meta.id; document.body.classList.toggle('light-mode',LIGHT_COMPAT_THEMES.has(meta.id));
  if(save){localStorage.setItem(THEME_KEY,meta.id); if(!preserveAuto)localStorage.setItem(AUTO_TIME_THEME_KEY,'false');}
  const btn=getEl('themeBtn');
  if(btn){
    const auto=isAutoTimeThemeEnabled();
    const info=getAutoTimeThemeInfo();
    btn.innerHTML=`<span class="sidebar-menu-icon">${auto?info.icon:meta.icon}</span><span>${auto?'Auto theme':'Theme'}</span>`;
    btn.title=auto?`Auto by time: ${info.label} (${info.range}) · ${meta.name}`:`Theme: ${meta.name}`;
  }
  document.querySelectorAll('.theme-choice[data-theme]').forEach(el=>{const on=!isAutoTimeThemeEnabled()&&el.dataset.theme===meta.id;el.classList.toggle('active',on);const m=el.querySelector('.theme-check');if(m)m.textContent=on?'✓':'';});
  updateAutoTimeThemeUI();
  invalidateScene(); if(isCanvasEnabled){initBackgroundObjects(); if(!animationFrameId)animationFrameId=requestAnimationFrame(drawBackground);}
}
function applyAutoTimeTheme(force=false){
  if(!isAutoTimeThemeEnabled())return;
  const info=getAutoTimeThemeInfo();
  if(!force && lastAutoTimeThemeSlot===info.slot)return;
  lastAutoTimeThemeSlot=info.slot;
  applyDashboardTheme(info.theme,false,true);
  updateAutoTimeThemeUI();
}
function setAutoTimeTheme(enabled=true){
  localStorage.setItem(AUTO_TIME_THEME_KEY,enabled?'true':'false');
  lastAutoTimeThemeSlot='';
  if(enabled){applyAutoTimeTheme(true); startAutoTimeThemeWatcher();}
  else {stopAutoTimeThemeWatcher(); applyDashboardTheme(getCurrentTheme(),false,true);}
  updateAutoTimeThemeUI();
}
function startAutoTimeThemeWatcher(){
  stopAutoTimeThemeWatcher();
  if(!isAutoTimeThemeEnabled())return;
  autoTimeThemeTimer=setInterval(()=>applyAutoTimeTheme(false),30000);
}
function stopAutoTimeThemeWatcher(){if(autoTimeThemeTimer){clearInterval(autoTimeThemeTimer);autoTimeThemeTimer=null;}}
function toggleTheme(){openThemePicker();}
function ensureThemePicker(){
  if(document.getElementById('themePickerOverlay'))return;
  const o=document.createElement('div');o.id='themePickerOverlay';o.className='theme-picker-overlay';
  o.innerHTML=`<div class="theme-picker-panel" role="dialog" aria-modal="true"><div class="theme-picker-head"><div><h3>🎨 Choose theme</h3><small style="color:var(--text-sub)">Cinematic adaptive scenes — optimized for smoothness.</small></div><button class="theme-picker-close" type="button">✕</button></div><button id="autoTimeThemeChoice" class="theme-choice auto-time-theme-choice" type="button"><span class="theme-check"></span><strong>🕒 Auto by time</strong><small class="auto-time-description">Automatically changes Morning · Noon · Afternoon · Evening · Night</small><span class="auto-time-slots"><span>🌅 Morning</span><span>☀️ Noon</span><span>🌇 Afternoon</span><span>☕ Evening</span><span>🌙 Night</span></span></button><div class="theme-picker-grid">${DASHBOARD_THEMES.map(t=>`<button class="theme-choice" type="button" data-theme="${t.id}"><span class="theme-check"></span><strong>${t.icon} ${t.name}</strong><small>${sceneLabel(t.scene)}</small></button>`).join('')}</div></div>`;
  document.body.appendChild(o);
  o.addEventListener('click',e=>{if(e.target===o)closeThemePicker()});
  o.querySelector('.theme-picker-close')?.addEventListener('click',closeThemePicker);
  o.querySelector('#autoTimeThemeChoice')?.addEventListener('click',()=>{setAutoTimeTheme(!isAutoTimeThemeEnabled());updateAutoTimeThemeUI();});
  o.querySelectorAll('.theme-choice[data-theme]').forEach(b=>b.addEventListener('click',()=>{setAutoTimeTheme(false);applyDashboardTheme(b.dataset.theme,true,false);closeThemePicker();}));
  updateAutoTimeThemeUI();
}
function openThemePicker(){ensureThemePicker();document.getElementById('themePickerOverlay')?.classList.add('active');if(isAutoTimeThemeEnabled())applyAutoTimeTheme(true);else applyDashboardTheme(getCurrentTheme(),false,true);updateAutoTimeThemeUI();}
function closeThemePicker(){document.getElementById('themePickerOverlay')?.classList.remove('active')}
function invalidateScene(){sceneCacheKey='';sceneCache=null;sceneCacheCtx=null;}

function resizeCanvas(){if(!canvas)return;const dpr=Math.min(devicePixelRatio||1,FX_QUALITY<.6?1:1.35);const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);if(canvas._cssW===w&&canvas._cssH===h&&canvas._renderDpr===dpr)return;canvas._renderDpr=dpr;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);canvas._cssW=w;canvas._cssH=h;invalidateScene();if(isCanvasEnabled)initBackgroundObjects();}
function addFx(n,maker){n=Math.max(1,Math.round(n*FX_QUALITY));const w=canvas._cssW||innerWidth,h=canvas._cssH||innerHeight;for(let i=0;i<n;i++)themeFxParticles.push(maker(i,w,h));}
function initBackgroundObjects(){if(!canvas||!ctx)return;themeFxParticles=[];const s=getThemeMeta().scene;const common=()=>({x:Math.random()*(canvas._cssW||innerWidth),y:Math.random()*(canvas._cssH||innerHeight),p:Math.random()*6.283});
  if(['night','midnight','oled'].includes(s))addFx(80,()=>({...common(),r:.35+Math.random()*1.35,a:.25+Math.random()*.65,tw:.7+Math.random()*1.6,shoot:Math.random()<.035,v:1+Math.random()*1.1}));
  if(['day','sky','rose','lavender','meadow','lemon','peach','sunset'].includes(s))addFx(7,()=>({...common(),y:35+Math.random()*220,s:.65+Math.random()*1.15,v:.08+Math.random()*.12,a:.22+Math.random()*.18}));
  if(s==='forest')addFx(42,()=>({...common(),y:(canvas._cssH||innerHeight)*(.35+Math.random()*.58),r:1+Math.random()*1.7,a:.25+Math.random()*.7,vx:(Math.random()-.5)*.08,vy:(Math.random()-.5)*.06}));
  if(['rose','lavender','sakura','peach'].includes(s))addFx(28,()=>({...common(),r:2.5+Math.random()*3.5,a:.25+Math.random()*.5,vx:.13+Math.random()*.28,vy:.08+Math.random()*.23,rot:Math.random()*6.28,vr:(Math.random()-.5)*.025}));
  if(s==='ocean')addFx(34,()=>({...common(),r:2+Math.random()*7,a:.10+Math.random()*.18,vy:-.08-Math.random()*.2}));
  if(s==='coffee')addFx(9,()=>({...common(),x:(canvas._cssW||innerWidth)*(.44+Math.random()*.12),y:(canvas._cssH||innerHeight)*(.6+Math.random()*.2),r:9+Math.random()*12,a:.025+Math.random()*.055,vy:-.035-Math.random()*.06}));
  if(s==='cyber'||s==='terminal')addFx(Math.max(18,Math.floor((canvas._cssW||innerWidth)/36)),()=>({...common(),s:10+Math.random()*5,vy:.35+Math.random()*.8,a:.06+Math.random()*.14,ch:String.fromCharCode(0x30A0+Math.random()*70)}));
  if(s==='grape')addFx(34,()=>({...common(),r:.8+Math.random()*2.4,a:.08+Math.random()*.2,vx:(Math.random()-.5)*.035,vy:(Math.random()-.5)*.035}));
}

function mkOffscreen(w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c;}
function sceneGradient(gctx,w,h,stops){const g=gctx.createLinearGradient(0,0,0,h);stops.forEach(([p,c])=>g.addColorStop(p,c));gctx.fillStyle=g;gctx.fillRect(0,0,w,h);}
function ellipse(g,x,y,rx,ry,fill,a=1,rot=0){g.save();g.globalAlpha=a;g.fillStyle=fill;g.translate(x,y);g.rotate(rot);g.beginPath();g.ellipse(0,0,rx,ry,0,0,6.283);g.fill();g.restore();}
function hill(g,w,h,y,amp,color,phase=0){g.fillStyle=color;g.beginPath();g.moveTo(0,h);for(let x=0;x<=w+30;x+=35)g.lineTo(x,y+Math.sin(x*.008+phase)*amp+Math.sin(x*.021+phase)*amp*.25);g.lineTo(w,h);g.closePath();g.fill();}
function pine(g,x,b,s,c){g.fillStyle='rgba(46,31,20,.8)';g.fillRect(x-2*s,b-42*s,4*s,42*s);g.fillStyle=c;for(let i=0;i<3;i++){const yy=b-(22+i*16)*s;g.beginPath();g.moveTo(x,yy-27*s);g.lineTo(x-18*s,yy+12*s);g.lineTo(x+18*s,yy+12*s);g.closePath();g.fill();}}
function cloud(g,x,y,s,a=.35,t='255,255,255'){g.save();g.globalAlpha=a;g.fillStyle=`rgb(${t})`;g.shadowColor='rgba(255,255,255,.16)';g.shadowBlur=16;[[0,0,27],[29,4,22],[-28,7,19],[5,-17,24]].forEach(([dx,dy,r])=>{g.beginPath();g.arc(x+dx*s,y+dy*s,r*s,0,6.283);g.fill()});g.restore();}
function rose(g,x,y,s,c){g.strokeStyle='rgba(31,99,52,.66)';g.lineWidth=Math.max(.6,s);g.beginPath();g.moveTo(x,y+5*s);g.lineTo(x,y+23*s);g.stroke();for(let i=0;i<5;i++)ellipse(g,x+Math.cos(i*1.256)*3.4*s,y+Math.sin(i*1.256)*2.5*s,3.8*s,2.4*s,c,.94,i*1.256);ellipse(g,x,y,1.7*s,1.7*s,'#ffe4e6');}
function drawStaticScene(g,w,h,meta){const s=meta.scene;
  if(s==='forest'){sceneGradient(g,w,h,[[0,'#102b30'],[.42,'#234d3a'],[.70,'#496b4d'],[1,'#142e1d']]);ellipse(g,w*.72,h*.16,85,40,'#dcebd8',.055);hill(g,w,h,h*.66,18,'#365f46',.5);hill(g,w,h,h*.76,26,'#264f35',1.8);for(let i=0;i<30;i++)pine(g,(i+.15)*w/29,h*.84,.38+(i%5)*.06,i%2?'#214a31':'#2c593b');g.fillStyle='rgba(219,232,222,.055)';g.fillRect(0,h*.48,w,h*.20);for(let i=0;i<18;i++)pine(g,(i+.2)*w/17,h*.97,.72+(i%4)*.08,i%2?'#102f20':'#173925');for(let i=0;i<6;i++)ellipse(g,w*(.06+i*.19),h*(.56+(i%2)*.055),w*.16,16,'#e4eee7',.045);}
  else if(s==='rose'){sceneGradient(g,w,h,[[0,'#f7dfe4'],[.43,'#f8eef0'],[.68,'#cbd9bd'],[1,'#718867']]);ellipse(g,w*.80,h*.15,48,48,'#fff4d3',.48);hill(g,w,h,h*.66,16,'#b8c9aa',.8);hill(g,w,h,h*.75,23,'#93aa82',2.1);g.fillStyle='rgba(255,255,255,.075)';g.fillRect(0,h*.47,w,h*.18);for(let row=0;row<7;row++)for(let i=0;i<Math.ceil(w/27)+3;i++)rose(g,i*27+(row%2)*11,h*(.72+row*.04),.35+row*.075,row%3===0?'#be3455':row%2?'#d95774':'#e87b90');}
  else if(s==='lavender'){sceneGradient(g,w,h,[[0,'#d9d7ff'],[.5,'#f5ecff'],[.72,'#c8dcb1'],[1,'#758c63']]);hill(g,w,h,h*.7,22,'#a5b88b',.5);hill(g,w,h,h*.8,30,'#71825f',2);for(let row=0;row<5;row++){g.strokeStyle='#526b4c';for(let x=10;x<w;x+=20){g.beginPath();g.moveTo(x,h*(.78+row*.045)+18);g.lineTo(x,h*(.78+row*.045));g.stroke();for(let k=0;k<4;k++)ellipse(g,x+(k%2?2:-2),h*(.78+row*.045)-k*4,2.4,4,'#8b5cf6',.75+row*.04)}}}
  else if(s==='ocean'){sceneGradient(g,w,h,[[0,'#0a6c88'],[.45,'#07546d'],[1,'#062e45']]);for(let i=0;i<7;i++){g.save();g.globalAlpha=.06;g.fillStyle='#d7fbff';g.beginPath();g.moveTo(i*w/6-80,0);g.lineTo(i*w/6+120,h*.82);g.lineTo(i*w/6+220,h*.82);g.lineTo(i*w/6+30,0);g.fill();g.restore();}g.fillStyle='#09394b';g.fillRect(0,h*.88,w,h*.12);for(let i=0;i<20;i++){g.strokeStyle=i%2?'#1d806d':'#2f987c';g.lineWidth=3+(i%3);g.beginPath();g.moveTo(i*w/19,h);g.quadraticCurveTo(i*w/19+18,h*.90,i*w/19+Math.sin(i)*12,h*.79);g.stroke();}for(let i=0;i<12;i++)ellipse(g,(i+.4)*w/11,h*.9-(i%3)*10,10+(i%4)*4,5+(i%2)*3,i%2?'#d97757':'#7c8fa3',.55);}
  else if(s==='sunset'){sceneGradient(g,w,h,[[0,'#51236f'],[.37,'#dd6b61'],[.67,'#f6b56b'],[1,'#37324b']]);ellipse(g,w*.76,h*.39,55,55,'#ffd59a',.9);hill(g,w,h,h*.68,52,'#5f4a66',.4);hill(g,w,h,h*.78,40,'#3b4053',2);hill(g,w,h,h*.88,28,'#202c35',4);}
  else if(s==='coffee'){sceneGradient(g,w,h,[[0,'#39241d'],[.6,'#604334'],[1,'#261812']]);g.fillStyle='#1e1511';g.fillRect(0,h*.78,w,h*.22);g.fillStyle='rgba(255,196,130,.08)';g.fillRect(w*.12,h*.12,w*.28,h*.46);g.strokeStyle='rgba(255,220,176,.22)';g.lineWidth=3;g.strokeRect(w*.12,h*.12,w*.28,h*.46);g.beginPath();g.moveTo(w*.26,h*.12);g.lineTo(w*.26,h*.58);g.moveTo(w*.12,h*.35);g.lineTo(w*.4,h*.35);g.stroke();ellipse(g,w*.54,h*.79,90,14,'#e8d6c7');g.fillStyle='#e7d5c7';g.fillRect(w*.5,h*.67,90,63);ellipse(g,w*.5+45,h*.67,45,9,'#efe1d8');ellipse(g,w*.5+45,h*.67,37,6,'#2f1811');g.strokeStyle='#e7d5c7';g.lineWidth=8;g.beginPath();g.arc(w*.5+93,h*.70,18,-1.2,1.2);g.stroke();}
  else if(s==='sakura'){sceneGradient(g,w,h,[[0,'#090d26'],[.54,'#26254f'],[1,'#351f3d']]);ellipse(g,w*.78,h*.19,38,38,'#f9efff',.86);hill(g,w,h,h*.88,20,'#11182c',1);g.strokeStyle='#29171d';g.lineWidth=16;g.beginPath();g.moveTo(-20,h*.73);g.quadraticCurveTo(w*.22,h*.45,w*.43,h*.5);g.stroke();g.lineWidth=7;for(let i=0;i<6;i++){g.beginPath();g.moveTo(w*(.12+i*.055),h*(.57-i*.018));g.lineTo(w*(.06+i*.10),h*(.35-i*.012));g.stroke()}for(let i=0;i<65;i++)ellipse(g,(i*83)%(w*.55),h*.27+((i*47)%220),2.5+(i%3),2,'#fb8ea5',.72,i*.3);}
  else if(['day','sky','meadow','lemon','peach'].includes(s)){const top=s==='sky'?'#7dccf2':s==='lemon'?'#fff3a7':s==='peach'?'#ffd4c7':'#a8dcf6';sceneGradient(g,w,h,[[0,top],[.62,'#effaff'],[.78,'#cce3b6'],[1,'#6e9a60']]);ellipse(g,w*.82,h*.16,34,34,'#fff3b0',.78);hill(g,w,h,h*.78,24,'#a7c994',1.5);hill(g,w,h,h*.88,32,'#6d9a60',3);if(s==='lemon'||s==='peach'){for(let i=0;i<9;i++){const x=(i+.3)*w/8;g.fillStyle='#6c4c2d';g.fillRect(x-4,h*.89-72,8,72);for(const [dx,dy,r] of [[0,-78,27],[-22,-63,22],[23,-63,24],[2,-104,21]])ellipse(g,x+dx,h*.89+dy,r,r,s==='peach'?'#72976d':'#5c974c',.9);for(let j=0;j<5;j++)ellipse(g,x+(j-2)*9,h*.89-78+(j%2)*15,4.5,4.5,s==='peach'?'#f78f73':'#facc15',.95)}}}
  else if(s==='cyber'||s==='terminal'){sceneGradient(g,w,h,s==='cyber'?[[0,'#040816'],[.65,'#101027'],[1,'#05070d']]:[[0,'#010604'],[1,'#00180b']]);const neon=s==='cyber';g.fillStyle=neon?'#080d1b':'#021309';for(let x=0;x<w;x+=38){const bh=55+((x*13)%150);g.fillRect(x,h*.82-bh,28,bh);if(neon){g.fillStyle=x%76?'#10233d':'#1d1235';g.fillRect(x+5,h*.82-bh+8,3,bh-14);g.fillStyle='#080d1b'}}g.save();g.globalAlpha=.13;g.strokeStyle=neon?'#22d3ee':'#22c55e';const horizon=h*.82;for(let y=horizon;y<h;y+=18){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}for(let x=-w;x<w*2;x+=60){g.beginPath();g.moveTo(w*.5,horizon);g.lineTo(x,h);g.stroke()}g.restore();}
  else if(s==='grape'){sceneGradient(g,w,h,[[0,'#100923'],[.55,'#36135d'],[1,'#12071f']]);for(let i=0;i<5;i++){const rg=g.createRadialGradient(w*(.15+i*.18),h*(.25+(i%2)*.2),5,w*(.15+i*.18),h*(.25+(i%2)*.2),170);rg.addColorStop(0,i%2?'rgba(217,70,239,.28)':'rgba(139,92,246,.30)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h)}}
  else {sceneGradient(g,w,h,[[0,s==='oled'?'#000':'#06101f'],[1,s==='oled'?'#000':'#101b34']]);if(s==='midnight'){hill(g,w,h,h*.79,45,'#0b1737',1);hill(g,w,h,h*.9,28,'#071029',3)}}
}
function getSceneCache(meta,w,h){const key=`${meta.id}:${w}x${h}`;if(sceneCacheKey===key&&sceneCache)return sceneCache;sceneCache=mkOffscreen(w,h);sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});drawStaticScene(sceneCacheCtx,w,h,meta);sceneCacheKey=key;return sceneCache;}
function drawCloudDynamic(p,w){cloud(ctx,p.x,p.y,p.s,p.a);p.x+=p.v;if(p.x> w+120)p.x=-120;}
function drawBackground(ts=0){if(!canvas||!ctx||!isCanvasEnabled||document.hidden){animationFrameId=null;return;}const minDelta=1000/FX_TARGET_FPS;if(ts-fxLastFrame<minDelta){animationFrameId=requestAnimationFrame(drawBackground);return;}fxLastFrame=ts;const w=canvas._cssW||innerWidth,h=canvas._cssH||innerHeight,meta=getThemeMeta(),s=meta.scene;themeFxTick+=minDelta/1000;ctx.clearRect(0,0,w,h);ctx.drawImage(getSceneCache(meta,w,h),0,0,w,h);
  if(['day','sky','rose','lavender','meadow','lemon','peach','sunset'].includes(s))themeFxParticles.forEach(p=>drawCloudDynamic(p,w));
  else if(['night','midnight','oled'].includes(s)){themeFxParticles.forEach(p=>{const a=.3+.7*(.5+.5*Math.sin(themeFxTick*p.tw+p.p));ctx.globalAlpha=a;ctx.fillStyle=s==='midnight'?'#b8d8ff':'#fff';if(p.shoot){ctx.strokeStyle=ctx.fillStyle;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-28,p.y+40);ctx.stroke();p.x-=p.v*.6;p.y+=p.v;if(p.y>h+30){p.y=-20;p.x=Math.random()*w}}else{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill()}});ctx.globalAlpha=1;}
  else if(s==='forest'){themeFxParticles.forEach(p=>{const a=.22+.7*(.5+.5*Math.sin(themeFxTick*1.8+p.p));ctx.globalAlpha=a;ctx.shadowColor='#d9f99d';ctx.shadowBlur=10;ctx.fillStyle='#eaffb2';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.x+=p.vx+Math.sin(themeFxTick+p.p)*.035;p.y+=p.vy+Math.cos(themeFxTick*.8+p.p)*.025;if(p.x<0)p.x=w;if(p.x>w)p.x=0});ctx.shadowBlur=0;ctx.globalAlpha=1;}
  else if(['rose','lavender','sakura','peach'].includes(s)){const c=s==='lavender'?'#9f7aea':s==='peach'?'#fb9478':'#fb7185';themeFxParticles.forEach(p=>{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=p.a;ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(0,0,p.r*.6,p.r*1.2,0,0,6.283);ctx.fill();ctx.restore();p.x+=p.vx+Math.sin(themeFxTick*1.2+p.p)*.09;p.y+=p.vy;p.rot+=p.vr;if(p.y>h+15||p.x>w+15){p.y=-10;p.x=Math.random()*w}})}
  else if(s==='ocean'){themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a;ctx.strokeStyle='#d8fbff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.stroke();p.y+=p.vy;p.x+=Math.sin(themeFxTick+p.p)*.02;if(p.y<-12){p.y=h+10;p.x=Math.random()*w}});ctx.globalAlpha=1;}
  else if(s==='coffee'){themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a;ctx.fillStyle='#fff5e8';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.x+=Math.sin(themeFxTick+p.p)*.05;p.y+=p.vy;if(p.y<h*.49){p.y=h*.74;p.x=w*(.48+Math.random()*.08)}});ctx.globalAlpha=1;}
  else if(s==='cyber'||s==='terminal'){const cyber=s==='cyber';themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a;ctx.fillStyle=cyber?(Math.sin(p.p+themeFxTick)>0?'#22d3ee':'#d946ef'):'#22c55e';ctx.font=`${p.s}px ui-monospace,monospace`;ctx.fillText(p.ch,p.x,p.y);p.y+=p.vy;if(p.y>h+20){p.y=-10;p.x=Math.random()*w}});ctx.globalAlpha=1;}
  else if(s==='grape'){themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a*(.65+.35*Math.sin(themeFxTick+p.p));ctx.fillStyle='#e9c8ff';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=w;if(p.x>w)p.x=0});ctx.globalAlpha=1;}
  // Cinematic finishing pass: subtle atmosphere, not a heavy full-screen filter.
  const vg=ctx.createRadialGradient(w*.5,h*.42,Math.min(w,h)*.18,w*.5,h*.45,Math.max(w,h)*.78);
  vg.addColorStop(0,'rgba(255,255,255,0)');
  vg.addColorStop(1, getThemeMeta().scene==='day'||getThemeMeta().scene==='sky'||getThemeMeta().scene==='rose'||getThemeMeta().scene==='lavender'||getThemeMeta().scene==='meadow'||getThemeMeta().scene==='lemon'||getThemeMeta().scene==='peach' ? 'rgba(80,95,110,.055)' : 'rgba(0,0,0,.16)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);
  animationFrameId=requestAnimationFrame(drawBackground);
}
function applyCanvasState(){
  const btn=getEl('themeBtnCanvas');
  if(!canvas)return;

  document.body.classList.toggle('visuals-on', !!isCanvasEnabled);
  document.body.classList.toggle('visuals-off', !isCanvasEnabled);

  if(isCanvasEnabled){
    canvas.style.setProperty('display','block','important');
    canvas.style.setProperty('visibility','visible','important');
    canvas.style.setProperty('opacity','1','important');
    resizeCanvas();
    initBackgroundObjects();
    fxLastFrame=0;
    if(!animationFrameId)animationFrameId=requestAnimationFrame(drawBackground);
    if(btn)btn.innerHTML='<span class="sidebar-menu-icon">✨</span><span>Visuals</span>';
  }else{
    if(animationFrameId){
      cancelAnimationFrame(animationFrameId);
      animationFrameId=null;
    }
    if(ctx){
      ctx.save();
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.restore();
    }
    invalidateScene();
    themeFxParticles.length=0;
    canvas.style.setProperty('display','none','important');
    canvas.style.setProperty('visibility','hidden','important');
    canvas.style.setProperty('opacity','0','important');
    if(btn)btn.innerHTML='<span class="sidebar-menu-icon">🌟</span><span>Visuals</span>';
  }
}
function toggleThemeCanvas(){
  isCanvasEnabled=!isCanvasEnabled;
  localStorage.setItem('canvas-enabled',isCanvasEnabled);

  // When Visuals is turned back on while Auto by time is active,
  // sync the current time slot first so the canvas never revives an old scene.
  if(isCanvasEnabled && isAutoTimeThemeEnabled()){
    applyAutoTimeTheme(true);
  }

  applyCanvasState();
}
window.addEventListener('resize',()=>{clearTimeout(window.__sceneResizeTimer);window.__sceneResizeTimer=setTimeout(resizeCanvas,120)},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(animationFrameId){cancelAnimationFrame(animationFrameId);animationFrameId=null}}else if(isCanvasEnabled&&!animationFrameId){fxLastFrame=0;animationFrameId=requestAnimationFrame(drawBackground)}});
window.addEventListener('load',()=>{ensureThemePicker();applyDashboardTheme(getCurrentTheme(),false);applyCanvasState();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeThemePicker()});


// ==========================================================================
// SCENE V7 — POLISHED CANVAS LANDSCAPES
// Natural density, atmospheric perspective, cached static scenery.
// No photographic backgrounds.
// ==========================================================================

function v7rng(seed){
  let t = seed >>> 0;
  return function(){
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function v7seedFor(scene,w,h){
  let s=2166136261;
  const text=scene+'|'+Math.round(w/20)+'|'+Math.round(h/20);
  for(let i=0;i<text.length;i++){ s^=text.charCodeAt(i); s=Math.imul(s,16777619); }
  return s>>>0;
}
function v7lerp(a,b,t){return a+(b-a)*t;}
function v7mixAlpha(hex,a){
  if(hex.startsWith('#')){
    const h=hex.slice(1); const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
  }
  return hex;
}
function v7softBlob(g,x,y,rx,ry,color,a=1,parts=9,rng=Math.random){
  g.save(); g.globalAlpha=a; g.fillStyle=color;
  for(let i=0;i<parts;i++){
    const ang=rng()*Math.PI*2, rr=.25+rng()*.75;
    const px=x+Math.cos(ang)*rx*.42*rr, py=y+Math.sin(ang)*ry*.35*rr;
    const sx=rx*(.38+rng()*.34), sy=ry*(.34+rng()*.32);
    g.beginPath(); g.ellipse(px,py,sx,sy,rng()*.4,0,Math.PI*2); g.fill();
  }
  g.restore();
}
function v7branch(g,x1,y1,x2,y2,w,color,a=1){
  g.save(); g.globalAlpha=a; g.strokeStyle=color; g.lineWidth=w; g.lineCap='round';
  g.beginPath(); g.moveTo(x1,y1); g.quadraticCurveTo(v7lerp(x1,x2,.52)+(y2-y1)*.08,v7lerp(y1,y2,.52),x2,y2); g.stroke();
  g.restore();
}
function v7leaf(g,x,y,s,color,a=1,rot=0){
  g.save(); g.translate(x,y); g.rotate(rot); g.globalAlpha=a; g.fillStyle=color;
  g.beginPath(); g.ellipse(0,0,s*1.7,s*.72,0,0,Math.PI*2); g.fill(); g.restore();
}
function v7flower(g,x,y,s,petal,center='#f8d9a0',a=1,rot=0){
  g.save(); g.translate(x,y); g.rotate(rot); g.globalAlpha=a;
  for(let i=0;i<7;i++){
    const ang=i*Math.PI*2/7;
    g.fillStyle=petal; g.beginPath(); g.ellipse(Math.cos(ang)*s*.52,Math.sin(ang)*s*.40,s*.50,s*.30,ang,0,Math.PI*2); g.fill();
  }
  g.fillStyle=center; g.beginPath(); g.arc(0,0,s*.28,0,Math.PI*2); g.fill(); g.restore();
}
function v7cloudBank(g,w,h,rng,alpha=.12){
  g.save(); g.filter='blur(9px)'; g.globalAlpha=alpha; g.fillStyle='#fff';
  for(let i=0;i<7;i++){
    const x=(i/6)*w + (rng()-.5)*w*.10;
    const y=h*(.12+rng()*.22);
    v7softBlob(g,x,y,70+rng()*85,24+rng()*26,'#fff',1,6,rng);
  }
  g.restore();
}
function v7mistBand(g,w,y,hgt,a=.08){
  const gr=g.createLinearGradient(0,y-hgt,0,y+hgt);
  gr.addColorStop(0,'rgba(255,255,255,0)');
  gr.addColorStop(.5,`rgba(235,244,240,${a})`);
  gr.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=gr; g.fillRect(0,y-hgt,w,hgt*2);
}
function v7hill(g,w,h,base,amp,color,phase=0,alpha=1){
  g.save(); g.globalAlpha=alpha; g.fillStyle=color; g.beginPath(); g.moveTo(0,h);
  for(let x=0;x<=w+30;x+=24){
    const y=base+Math.sin(x*.006+phase)*amp+Math.sin(x*.014+phase*.7)*amp*.38+Math.sin(x*.027+phase)*amp*.12;
    g.lineTo(x,y);
  }
  g.lineTo(w,h); g.closePath(); g.fill(); g.restore();
}
function v7drawForest(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#183231'],[.38,'#2d4d3c'],[.66,'#39583f'],[1,'#12251b']]);

  // distant canopy and haze
  v7mistBand(g,w,h*.40,h*.13,.065);
  for(let i=0;i<24;i++){
    const x=(i+.2)*w/23 + (rng()-.5)*25;
    const y=h*(.39+rng()*.11);
    v7softBlob(g,x,y,48+rng()*42,28+rng()*28,i%3===0?'#42644a':'#365741',.36,8,rng);
  }

  // distant trunks: thin, pale, softened by atmosphere
  for(let i=0;i<38;i++){
    const x=rng()*w, base=h*(.78+rng()*.08), top=h*(.20+rng()*.22);
    const col=i%3===0?'#324637':'#263a31';
    v7branch(g,x,base,x+(rng()-.5)*24,top,1.2+rng()*2.2,col,.34);
  }

  // mid trunks + dense crown
  for(let i=0;i<18;i++){
    const x=(i+.15)*w/17+(rng()-.5)*36, base=h*(.91+rng()*.04), top=h*(.28+rng()*.20);
    const thick=4+rng()*7;
    v7branch(g,x,base,x+(rng()-.5)*36,top,thick,'#1a2c22',.82);
    for(let b=0;b<3;b++){
      const yy=v7lerp(base,top,.35+b*.17);
      const side=(b%2?1:-1);
      v7branch(g,x+(rng()-.5)*8,yy,x+side*(34+rng()*65),yy-(22+rng()*38),Math.max(1.2,thick*.28),'#20352a',.65);
    }
    const crownY=top+30+rng()*30;
    const crownC=i%3===0?'#1f432e':i%3===1?'#28503a':'#244833';
    v7softBlob(g,x,crownY,78+rng()*55,60+rng()*48,crownC,.90,11,rng);
  }

  // mid-ground foliage belt
  for(let i=0;i<30;i++){
    const x=rng()*w, y=h*(.67+rng()*.17);
    v7softBlob(g,x,y,38+rng()*46,26+rng()*34,rng()>.5?'#244d31':'#1c422d',.90,8,rng);
  }

  // forest floor
  const floor=g.createLinearGradient(0,h*.72,0,h);
  floor.addColorStop(0,'rgba(18,45,28,.12)'); floor.addColorStop(1,'#0b2015');
  g.fillStyle=floor; g.fillRect(0,h*.72,w,h*.28);

  // grasses, ferns, low shrubs
  g.lineCap='round';
  for(let i=0;i<150;i++){
    const x=rng()*w, y=h*(.80+rng()*.20), len=7+rng()*28;
    g.strokeStyle=rng()>.5?'rgba(61,111,69,.42)':'rgba(40,88,56,.50)';
    g.lineWidth=.6+rng()*1.2;
    g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+(rng()-.5)*12,y-len*.55,x+(rng()-.5)*15,y-len); g.stroke();
  }

  // foreground framing trunks/canopy: dark, cropped, gives "inside forest" feeling
  for(let i=0;i<5;i++){
    const left=i<3;
    const x=left ? (-22+i*34) : (w+22-(i-2)*40);
    const base=h*1.04, top=h*(.03+rng()*.25), thick=18+rng()*30;
    v7branch(g,x,base,x+(left?25:-25)+(rng()-.5)*20,top,thick,'#09170f',.93);
    v7softBlob(g,x+(left?45:-45),h*(.15+rng()*.25),110+rng()*85,80+rng()*65,'#0c2516',.92,12,rng);
  }

  // subtle shafts through gaps
  g.save(); g.globalCompositeOperation='screen';
  for(let i=0;i<4;i++){
    const x=w*(.15+rng()*.7);
    const gr=g.createLinearGradient(x,h*.05,x+80,h*.72);
    gr.addColorStop(0,'rgba(242,255,215,.08)'); gr.addColorStop(1,'rgba(242,255,215,0)');
    g.fillStyle=gr; g.beginPath(); g.moveTo(x-25,0); g.lineTo(x+18,0); g.lineTo(x+135,h*.78); g.lineTo(x+40,h*.78); g.closePath(); g.fill();
  }
  g.restore();
  v7mistBand(g,w,h*.61,h*.09,.04);
}
function v7drawFlowerField(g,w,h,rng,kind='rose'){
  const isLav=kind==='lavender';
  sceneGradient(g,w,h,isLav
    ? [[0,'#cfd0e7'],[.38,'#e5ddea'],[.60,'#c8cfba'],[1,'#53684d']]
    : [[0,'#d8d4d2'],[.36,'#efe5e4'],[.59,'#c9d0b5'],[1,'#58694d']]);
  v7cloudBank(g,w,h,rng,isLav?.07:.08);
  v7hill(g,w,h,h*.55,h*.025,isLav?'#a8aa9d':'#aeb29d',.4,.65);
  v7hill(g,w,h,h*.61,h*.035,isLav?'#7c8b77':'#83916f',2.2,.82);
  v7mistBand(g,w,h*.58,h*.055,.075);

  // field base
  const field=g.createLinearGradient(0,h*.58,0,h);
  field.addColorStop(0,isLav?'#7c866f':'#819067');
  field.addColorStop(1,isLav?'#42523e':'#3f5238');
  g.fillStyle=field; g.fillRect(0,h*.58,w,h*.42);

  // Perspective rows: many tiny plants near horizon, larger near viewer.
  const rows=14;
  for(let r=0;r<rows;r++){
    const t=r/(rows-1);
    const depth=t*t;
    const y=v7lerp(h*.595,h*.99,depth);
    const scale=v7lerp(.12,1.15,depth);
    const alpha=v7lerp(.38,.98,depth);
    const spacing=v7lerp(12,42,depth);
    const offset=(r%2)*spacing*.48;
    for(let x=-spacing;x<w+spacing;x+=spacing){
      const px=x+offset+(rng()-.5)*spacing*.45;
      const py=y+(rng()-.5)*v7lerp(2,9,depth);
      const stemH=(isLav?16:13)*scale*(.75+rng()*.55);
      g.strokeStyle=isLav?`rgba(55,88,58,${alpha*.72})`:`rgba(44,91,47,${alpha*.78})`;
      g.lineWidth=Math.max(.45,scale*.95);
      g.beginPath(); g.moveTo(px,py+stemH*.8); g.lineTo(px+(rng()-.5)*2*scale,py-stemH*.45); g.stroke();
      if(isLav){
        const col=rng()>.55?'#7059a8':'#8770ba';
        for(let k=0;k<4;k++){
          const yy=py-stemH*.38+k*3*scale;
          v7leaf(g,px+(k%2?1:-1)*1.5*scale,yy,1.3*scale,col,alpha,.2*(k%2?1:-1));
        }
      }else{
        const cols=['#b83d55','#c54b62','#a8344d','#d05a6d','#9f3348'];
        const col=cols[Math.floor(rng()*cols.length)];
        v7flower(g,px,py-stemH*.5,2.2*scale,col,'#e9c5a0',alpha,rng()*Math.PI);
        if(depth>.35 && rng()>.45){
          v7leaf(g,px-3*scale,py+1*scale,2.1*scale,'#396443',alpha*.75,-.6);
          v7leaf(g,px+3*scale,py+3*scale,2.0*scale,'#426c49',alpha*.70,.6);
        }
      }
    }
  }

  // foreground grasses break the overly neat rows
  for(let i=0;i<90;i++){
    const x=rng()*w,y=h*(.82+rng()*.18),len=10+rng()*34;
    g.strokeStyle=isLav?'rgba(58,75,53,.38)':'rgba(47,77,44,.42)';
    g.lineWidth=.5+rng()*1.2; g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+(rng()-.5)*8,y-len*.55,x+(rng()-.5)*14,y-len); g.stroke();
  }
}
function v7drawOcean(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#16647a'],[.34,'#0c5369'],[.72,'#073b51'],[1,'#062b3d']]);
  // soft overhead glow
  const rg=g.createRadialGradient(w*.54,-20,0,w*.54,-20,w*.58);
  rg.addColorStop(0,'rgba(195,243,247,.25)'); rg.addColorStop(1,'rgba(195,243,247,0)');
  g.fillStyle=rg; g.fillRect(0,0,w,h*.75);

  // light rays
  g.save(); g.globalCompositeOperation='screen'; g.filter='blur(8px)';
  for(let i=0;i<7;i++){
    const x=w*(.05+i*.14)+rng()*30;
    g.fillStyle=`rgba(186,235,241,${.025+rng()*.035})`;
    g.beginPath(); g.moveTo(x,0); g.lineTo(x+45+rng()*80,0); g.lineTo(x+210+rng()*100,h*.88); g.lineTo(x+90+rng()*60,h*.88); g.closePath(); g.fill();
  }
  g.restore();

  // rocky seabed
  g.fillStyle='#082e36'; g.fillRect(0,h*.89,w,h*.11);
  for(let i=0;i<26;i++){
    const x=rng()*w,y=h*(.88+rng()*.13),rx=12+rng()*32,ry=5+rng()*12;
    ellipse(g,x,y,rx,ry,rng()>.5?'#183f42':'#244c4a',.72,rng()*.4);
  }

  // kelp with many overlapping ribbons
  for(let i=0;i<32;i++){
    const x=rng()*w, base=h*(.94+rng()*.06), len=45+rng()*135, sway=(rng()-.5)*45;
    g.strokeStyle=rng()>.5?'rgba(31,111,81,.56)':'rgba(27,91,72,.62)';
    g.lineWidth=2+rng()*5; g.lineCap='round';
    g.beginPath(); g.moveTo(x,base); g.bezierCurveTo(x+sway*.2,base-len*.3,x+sway*.9,base-len*.7,x+sway,base-len); g.stroke();
  }
  v7mistBand(g,w,h*.66,h*.13,.025);
}
function v7drawCyber(g,w,h,rng,terminal=false){
  sceneGradient(g,w,h,terminal?[[0,'#010905'],[.68,'#03160b'],[1,'#010604']]:[[0,'#070b19'],[.44,'#13152b'],[.76,'#16122a'],[1,'#070914']]);
  const horizon=h*.72;

  // atmospheric neon haze instead of loud blocks
  const haze=g.createRadialGradient(w*.50,horizon,0,w*.50,horizon,w*.55);
  haze.addColorStop(0,terminal?'rgba(34,197,94,.075)':'rgba(81,193,230,.105)');
  haze.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=haze; g.fillRect(0,h*.25,w,h*.60);

  // distant skyline, irregular + antennae
  for(let i=0,x=-10;x<w+30;i++){
    const bw=18+rng()*42,bh=45+rng()*150,base=horizon+rng()*10;
    const col=terminal?'#03170b':(rng()>.5?'#10162a':'#16162d');
    g.fillStyle=col; g.fillRect(x,base-bh,bw,bh);
    if(rng()>.72){
      g.strokeStyle=terminal?'rgba(62,212,115,.20)':'rgba(114,202,238,.18)';
      g.lineWidth=1; g.beginPath(); g.moveTo(x+bw*.5,base-bh); g.lineTo(x+bw*.5,base-bh-18-rng()*28); g.stroke();
    }
    // sparse windows
    const win=terminal?'rgba(69,226,126,.18)':(rng()>.5?'rgba(80,220,235,.22)':'rgba(214,87,214,.18)');
    g.fillStyle=win;
    for(let yy=base-bh+10;yy<base-8;yy+=10+rng()*5){
      if(rng()>.45) g.fillRect(x+5+rng()*Math.max(2,bw-12),yy,1.5+rng()*2.5,2);
    }
    x += bw+3+rng()*8;
  }

  // wet ground / faint perspective lines
  const ground=g.createLinearGradient(0,horizon,0,h);
  ground.addColorStop(0,terminal?'rgba(2,24,11,.60)':'rgba(9,13,25,.55)');
  ground.addColorStop(1,terminal?'#010503':'#04060d');
  g.fillStyle=ground; g.fillRect(0,horizon,w,h-horizon);
  g.save(); g.globalAlpha=.10; g.strokeStyle=terminal?'#3bd77a':'#5ccfe8'; g.lineWidth=1;
  for(let i=1;i<8;i++){const yy=horizon+(h-horizon)*Math.pow(i/8,1.7);g.beginPath();g.moveTo(0,yy);g.lineTo(w,yy);g.stroke();}
  for(let i=-8;i<=8;i++){g.beginPath();g.moveTo(w*.5,horizon);g.lineTo(w*.5+i*w*.11,h);g.stroke();}
  g.restore();
}
function v7drawStaticScene(g,w,h,meta){
  const rng=v7rng(v7seedFor(meta.scene,w,h));
  switch(meta.scene){
    case 'forest': v7drawForest(g,w,h,rng); break;
    case 'rose': v7drawFlowerField(g,w,h,rng,'rose'); break;
    case 'lavender': v7drawFlowerField(g,w,h,rng,'lavender'); break;
    case 'ocean': v7drawOcean(g,w,h,rng); break;
    case 'cyber': v7drawCyber(g,w,h,rng,false); break;
    case 'terminal': v7drawCyber(g,w,h,rng,true); break;
    default: drawStaticScene(g,w,h,meta);
  }

  // universal soft atmospheric finish
  const top=g.createLinearGradient(0,0,0,h);
  top.addColorStop(0,'rgba(255,255,255,.018)');
  top.addColorStop(.65,'rgba(255,255,255,0)');
  top.addColorStop(1,'rgba(0,0,0,.07)');
  g.fillStyle=top; g.fillRect(0,0,w,h);
}
function getSceneCache(meta,w,h){
  const key=`v7:${meta.id}:${w}x${h}`;
  if(sceneCacheKey===key&&sceneCache)return sceneCache;
  sceneCache=mkOffscreen(w,h);
  sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});
  v7drawStaticScene(sceneCacheCtx,w,h,meta);
  sceneCacheKey=key;
  return sceneCache;
}

// Reduce moving objects. Dense realism comes from the cached scenery, not noisy particles.
const __v7InitBackgroundObjects = initBackgroundObjects;
initBackgroundObjects = function(){
  __v7InitBackgroundObjects();
  const s=getThemeMeta().scene;
  const limits={forest:26,rose:16,lavender:14,ocean:22,cyber:16,terminal:18,sakura:18,peach:15};
  if(limits[s] && themeFxParticles.length>limits[s]) themeFxParticles.length=limits[s];
};

// Make theme picker describe the new approach.
(function(){
  const oldEnsure=ensureThemePicker;
  ensureThemePicker=function(){
    oldEnsure();
    const small=document.querySelector('#themePickerOverlay .theme-picker-head small');
    if(small)small.textContent='Layered canvas landscapes · subtle motion · optimized cache';
  };
})();


// ==========================================================================
// SCENE V8 — COMPLETE THEME ART PASS
// Every theme now has its own layered procedural composition.
// ==========================================================================

function v8rectRound(g,x,y,w,h,r,fill,alpha=1){
  g.save(); g.globalAlpha=alpha; g.fillStyle=fill;
  g.beginPath();
  g.moveTo(x+r,y); g.lineTo(x+w-r,y); g.quadraticCurveTo(x+w,y,x+w,y+r);
  g.lineTo(x+w,y+h-r); g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  g.lineTo(x+r,y+h); g.quadraticCurveTo(x,y+h,x,y+h-r);
  g.lineTo(x,y+r); g.quadraticCurveTo(x,y,x+r,y); g.closePath(); g.fill(); g.restore();
}
function v8stars(g,w,h,rng,count=70,alpha=.8){
  g.save();
  for(let i=0;i<count;i++){
    const x=rng()*w,y=rng()*h*.66,r=.35+rng()*1.5,a=(.18+rng()*.72)*alpha;
    g.fillStyle=`rgba(240,247,255,${a})`;
    g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.fill();
  }
  g.restore();
}
function v8tree(g,x,base,scale,rng,leaf='#244b31',trunk='#2b2117',alpha=1){
  const top=base-110*scale;
  v7branch(g,x,base,x+(rng()-.5)*16*scale,top,7*scale,trunk,alpha);
  for(let b=0;b<4;b++){
    const yy=base-30*scale-b*18*scale;
    const side=b%2?1:-1;
    v7branch(g,x,yy,x+side*(28+rng()*28)*scale,yy-(15+rng()*18)*scale,2.3*scale,trunk,alpha*.88);
  }
  v7softBlob(g,x,top+20*scale,52*scale,46*scale,leaf,alpha,10,rng);
}
function v8mountain(g,w,h,base,color,alpha,rng,amp=.24){
  g.save(); g.globalAlpha=alpha; g.fillStyle=color; g.beginPath(); g.moveTo(0,h);
  let x=0; g.lineTo(0,base);
  while(x<w){
    const bw=70+rng()*150, peak=base-(55+rng()*h*amp);
    g.lineTo(x+bw*.50,peak); g.lineTo(x+bw,base+(rng()-.5)*20); x+=bw;
  }
  g.lineTo(w,h); g.closePath(); g.fill(); g.restore();
}
function v8drawNight(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#07111e'],[.44,'#101d31'],[.72,'#18273a'],[1,'#081218']]);
  v8stars(g,w,h,rng,110,.85);
  ellipse(g,w*.78,h*.16,28,28,'#eaf3ff',.78);
  const moonGlow=g.createRadialGradient(w*.78,h*.16,15,w*.78,h*.16,110);
  moonGlow.addColorStop(0,'rgba(210,230,255,.12)');moonGlow.addColorStop(1,'rgba(210,230,255,0)');
  g.fillStyle=moonGlow;g.fillRect(0,0,w,h*.5);
  v8mountain(g,w,h,h*.64,'#1a2c3c',.78,rng,.16);
  v8mountain(g,w,h,h*.73,'#10212e',.96,rng,.12);
  const lake=g.createLinearGradient(0,h*.72,0,h);lake.addColorStop(0,'#0d2630');lake.addColorStop(1,'#061217');
  g.fillStyle=lake;g.fillRect(0,h*.72,w,h*.28);
  g.save();g.globalAlpha=.15;g.strokeStyle='#bbd7ef';g.lineWidth=1;
  for(let i=0;i<16;i++){const y=h*.75+i*8+rng()*4;g.beginPath();g.moveTo(w*.62+rng()*80,y);g.lineTo(w*.90-rng()*60,y);g.stroke();}
  g.restore();
  for(let i=0;i<10;i++) v8tree(g,(i+.2)*w/9,h*.94,.45+rng()*.28,rng,'#0d251c','#111914',.9);
}
function v8drawDay(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#8bc9e9'],[.50,'#c8e7f4'],[.68,'#e8efe1'],[1,'#64855b']]);
  ellipse(g,w*.78,h*.14,38,38,'#fff4bf',.84);
  v7cloudBank(g,w,h,rng,.12);
  v7hill(g,w,h,h*.64,20,'#a8c99a',.5,.75);
  v7hill(g,w,h,h*.73,26,'#7ca36f',2,.9);
  const meadow=g.createLinearGradient(0,h*.71,0,h);meadow.addColorStop(0,'#7fa169');meadow.addColorStop(1,'#4f6f45');
  g.fillStyle=meadow;g.fillRect(0,h*.71,w,h*.29);
  for(let i=0;i<120;i++){
    const x=rng()*w,y=h*(.76+rng()*.24),len=8+rng()*22;
    g.strokeStyle=rng()>.5?'rgba(58,94,48,.38)':'rgba(82,112,62,.42)';
    g.lineWidth=.6+rng();g.beginPath();g.moveTo(x,y);g.lineTo(x+(rng()-.5)*8,y-len);g.stroke();
    if(rng()>.86)v7flower(g,x,y-len,1.4+rng()*1.6,rng()>.5?'#f0e7d0':'#d8b7c5','#d7b36a',.65,rng()*6.28);
  }
}
function v8drawMidnight(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#030714'],[.44,'#0e1730'],[.70,'#182343'],[1,'#07101d']]);
  v8stars(g,w,h,rng,95,.72);
  ellipse(g,w*.72,h*.18,44,44,'#dfe8ff',.88);
  v8mountain(g,w,h,h*.58,'#27334f',.52,rng,.23);
  v8mountain(g,w,h,h*.70,'#18243c',.88,rng,.18);
  v8mountain(g,w,h,h*.79,'#0b1628',1,rng,.12);
  const lake=g.createLinearGradient(0,h*.75,0,h);lake.addColorStop(0,'#0a1b2a');lake.addColorStop(1,'#030910');
  g.fillStyle=lake;g.fillRect(0,h*.75,w,h*.25);
  g.save();g.globalCompositeOperation='screen';
  const refl=g.createLinearGradient(w*.72,h*.76,w*.72,h);
  refl.addColorStop(0,'rgba(213,230,255,.18)');refl.addColorStop(1,'rgba(213,230,255,0)');
  g.fillStyle=refl;g.beginPath();g.moveTo(w*.68,h*.76);g.lineTo(w*.76,h*.76);g.lineTo(w*.82,h);g.lineTo(w*.60,h);g.closePath();g.fill();g.restore();
}
function v8drawOLED(g,w,h,rng){
  g.fillStyle='#000';g.fillRect(0,0,w,h);
  v8stars(g,w,h,rng,48,.55);
  const aur=g.createRadialGradient(w*.52,h*.46,0,w*.52,h*.46,w*.56);
  aur.addColorStop(0,'rgba(51,255,143,.055)');aur.addColorStop(.42,'rgba(76,98,255,.025)');aur.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=aur;g.fillRect(0,0,w,h);
  v8mountain(g,w,h,h*.84,'#020604',1,rng,.11);
}
function v8drawSunset(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#4c315e'],[.32,'#ad5d6a'],[.61,'#e89d78'],[.80,'#f3c78b'],[1,'#3c4940']]);
  ellipse(g,w*.72,h*.42,52,52,'#f8d196',.85);
  v8mountain(g,w,h,h*.62,'#7b6372',.52,rng,.17);
  v8mountain(g,w,h,h*.73,'#57566a',.82,rng,.13);
  v7hill(g,w,h,h*.82,24,'#384943',1.4,.95);
  const field=g.createLinearGradient(0,h*.80,0,h);field.addColorStop(0,'#4b5b47');field.addColorStop(1,'#26362d');
  g.fillStyle=field;g.fillRect(0,h*.80,w,h*.20);
  for(let i=0;i<65;i++){
    const x=rng()*w,y=h*(.84+rng()*.16),len=8+rng()*26;
    g.strokeStyle='rgba(45,65,45,.50)';g.lineWidth=.7+rng();g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+5,y-len*.6,x+(rng()-.5)*10,y-len);g.stroke();
  }
}
function v8drawCoffee(g,w,h,rng){
  // Warm rainy café interior
  sceneGradient(g,w,h,[[0,'#19110d'],[.55,'#2d1e16'],[1,'#120c09']]);

  // window glow
  const wx=w*.10, wy=h*.09, ww=w*.44, wh=h*.55;
  v8rectRound(g,wx,wy,ww,wh,10,'#161819',1);
  const glass=g.createLinearGradient(wx,wy,wx,wy+wh);
  glass.addColorStop(0,'#32414a');glass.addColorStop(.55,'#26333a');glass.addColorStop(1,'#171f23');
  v8rectRound(g,wx+8,wy+8,ww-16,wh-16,6,glass,1);
  // distant rainy city bokeh
  for(let i=0;i<34;i++){
    const x=wx+18+rng()*(ww-36), y=wy+18+rng()*(wh-36), r=2+rng()*7;
    const c=rng()>.55?'#d99d61':rng()>.5?'#b76e4b':'#6a9e9b';
    ellipse(g,x,y,r,r,c,.06+rng()*.12);
  }
  g.strokeStyle='rgba(225,191,154,.18)';g.lineWidth=4;
  g.beginPath();g.moveTo(wx+ww*.5,wy+5);g.lineTo(wx+ww*.5,wy+wh-5);g.moveTo(wx+5,wy+wh*.52);g.lineTo(wx+ww-5,wy+wh*.52);g.stroke();

  // rain streaks on glass
  g.save();g.lineCap='round';
  for(let i=0;i<55;i++){
    const x=wx+15+rng()*(ww-30), y=wy+10+rng()*(wh-25), len=8+rng()*28;
    g.strokeStyle=`rgba(211,226,230,${.035+rng()*.065})`;g.lineWidth=.5+rng()*.8;
    g.beginPath();g.moveTo(x,y);g.lineTo(x-2-rng()*3,y+len);g.stroke();
  }
  g.restore();

  // hanging lamp
  g.strokeStyle='#34251c';g.lineWidth=3;g.beginPath();g.moveTo(w*.76,0);g.lineTo(w*.76,h*.17);g.stroke();
  g.fillStyle='#7a5133';g.beginPath();g.moveTo(w*.70,h*.17);g.lineTo(w*.82,h*.17);g.lineTo(w*.79,h*.25);g.lineTo(w*.73,h*.25);g.closePath();g.fill();
  const glow=g.createRadialGradient(w*.76,h*.28,8,w*.76,h*.28,150);
  glow.addColorStop(0,'rgba(255,198,112,.22)');glow.addColorStop(1,'rgba(255,198,112,0)');
  g.fillStyle=glow;g.fillRect(w*.55,h*.10,w*.42,h*.50);

  // table
  g.fillStyle='#3c281b';g.fillRect(0,h*.73,w,h*.27);
  g.fillStyle='rgba(255,218,174,.05)';g.fillRect(0,h*.73,w,3);
  for(let i=0;i<11;i++){g.strokeStyle='rgba(255,225,190,.025)';g.beginPath();g.moveTo(i*w/10,h*.73);g.lineTo((i+.2)*w/10,h);g.stroke();}

  // cup + saucer
  const cx=w*.64, cy=h*.73;
  ellipse(g,cx,cy+52,74,10,'#d8c5b2',.78);
  v8rectRound(g,cx-42,cy-4,84,54,11,'#dbc9b9',1);
  ellipse(g,cx,cy-4,42,8,'#eadfd5',1);
  ellipse(g,cx,cy-3,34,5.5,'#2c170f',1);
  g.strokeStyle='#d8c5b2';g.lineWidth=7;g.beginPath();g.arc(cx+46,cy+20,18,-1.1,1.1);g.stroke();

  // small book / napkin
  v8rectRound(g,w*.77,h*.79,90,16,3,'#5f4331',.9);
  v8rectRound(g,w*.78,h*.775,82,10,2,'#d4c2ab',.35);
}
function v8drawMeadow(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#9fd6df'],[.52,'#dcefe9'],[.69,'#c3d6ad'],[1,'#4e7248']]);
  v7cloudBank(g,w,h,rng,.10);
  v7hill(g,w,h,h*.60,18,'#a6c296',1,.75);
  v7hill(g,w,h,h*.69,24,'#7ea670',2.1,.92);
  const field=g.createLinearGradient(0,h*.68,0,h);field.addColorStop(0,'#79a369');field.addColorStop(1,'#466d45');
  g.fillStyle=field;g.fillRect(0,h*.68,w,h*.32);
  for(let i=0;i<175;i++){
    const x=rng()*w,y=h*(.70+rng()*.30),depth=(y-h*.70)/(h*.30),s=.5+depth*2.3;
    if(rng()>.72)v7flower(g,x,y,1.3*s,rng()>.5?'#f3f1d1':'#d7d7f0','#e2c16d',.52+depth*.38,rng()*6.28);
    else {g.strokeStyle='rgba(52,92,48,.35)';g.lineWidth=.5+s*.2;g.beginPath();g.moveTo(x,y);g.lineTo(x+(rng()-.5)*7,y-(6+rng()*18)*s);g.stroke();}
  }
}
function v8drawSakura(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#070b1b'],[.48,'#171b36'],[.74,'#2c243d'],[1,'#160f1b']]);
  v8stars(g,w,h,rng,45,.42);ellipse(g,w*.78,h*.16,34,34,'#f1e9ff',.80);
  v7hill(g,w,h,h*.74,22,'#20243a',1,.7);v7hill(g,w,h,h*.82,18,'#111725',2.2,.95);

  // pathway
  g.fillStyle='#171517';g.beginPath();g.moveTo(w*.43,h*.60);g.lineTo(w*.57,h*.60);g.lineTo(w*.73,h);g.lineTo(w*.27,h);g.closePath();g.fill();
  // lanterns
  for(let i=0;i<5;i++){
    const t=i/5, y=h*(.68+t*.06), spread=v7lerp(w*.09,w*.26,t), size=v7lerp(3,7,t);
    for(const side of [-1,1]){
      const x=w*.5+side*spread;
      g.fillStyle='#33241e';g.fillRect(x-size*.15,y,size*.3,size*3);
      const gl=g.createRadialGradient(x,y,1,x,y,24*size/6);gl.addColorStop(0,'rgba(255,183,104,.24)');gl.addColorStop(1,'rgba(255,183,104,0)');
      g.fillStyle=gl;g.fillRect(x-25,y-25,50,50);
      v8rectRound(g,x-size*.7,y-size*.2,size*1.4,size,2,'#d18b53',.85);
    }
  }
  // arching sakura branches from both sides
  for(const side of [-1,1]){
    const sx=side<0?-20:w+20, sy=h*.72;
    const ex=w*.5+side*w*.08, ey=h*.28;
    v7branch(g,sx,sy,ex,ey,18,'#25161c',.95);
    for(let b=0;b<8;b++){
      const t=.18+b*.09, bx=v7lerp(sx,ex,t), by=v7lerp(sy,ey,t), dir=side*(b%2?1:-1);
      const tx=bx+dir*(35+rng()*75),ty=by-(20+rng()*55);
      v7branch(g,bx,by,tx,ty,5,'#2c1820',.9);
      for(let k=0;k<8;k++)ellipse(g,tx+(rng()-.5)*50,ty+(rng()-.5)*32,2.2+rng()*3.2,1.8+rng()*2.4,rng()>.5?'#ef9db1':'#d97899',.58+rng()*.25,rng()*6.28);
    }
  }
}
function v8drawSky(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#63b8df'],[.48,'#9bd3eb'],[.78,'#d8edf4'],[1,'#eef6f7']]);
  const sun=g.createRadialGradient(w*.78,h*.12,0,w*.78,h*.12,120);
  sun.addColorStop(0,'rgba(255,249,213,.38)');sun.addColorStop(1,'rgba(255,249,213,0)');
  g.fillStyle=sun;g.fillRect(0,0,w,h*.55);
  // layered sea of clouds
  for(let layer=0;layer<4;layer++){
    const y=h*(.48+layer*.13), a=.16+layer*.10;
    for(let i=0;i<8;i++){
      const x=(i-.4)*w/6+(rng()-.5)*60;
      v7softBlob(g,x,y+(rng()-.5)*25,100+layer*24+rng()*65,38+layer*12+rng()*20,'#ffffff',a,8,rng);
    }
  }
}
function v8drawOrchard(g,w,h,rng,kind){
  const lemon=kind==='lemon';
  sceneGradient(g,w,h,lemon?[[0,'#b7d8cf'],[.49,'#dce8d1'],[.67,'#b6c89a'],[1,'#49603e']]:[[0,'#c9ceda'],[.48,'#eadad8'],[.68,'#c4c6a4'],[1,'#536045']]);
  v7cloudBank(g,w,h,rng,.065);
  v7hill(g,w,h,h*.58,18,'#a7b994',1,.65);
  const ground=g.createLinearGradient(0,h*.60,0,h);ground.addColorStop(0,'#84976f');ground.addColorStop(1,'#4a5f41');
  g.fillStyle=ground;g.fillRect(0,h*.60,w,h*.40);

  // orchard rows converge toward vanishing point
  const vp=w*.5, horizon=h*.59;
  for(let row=-4;row<=4;row++){
    for(let j=0;j<8;j++){
      const t=j/7, depth=t*t;
      const y=v7lerp(horizon+8,h*.98,depth);
      const lane=row*v7lerp(16,92,depth);
      const x=vp+lane;
      const sc=v7lerp(.18,1.05,depth);
      v8tree(g,x,y,sc,rng,lemon?'#426e3e':'#647f58','#5d4430',.48+depth*.48);
      const fruit=lemon?'#e2c839':'#da8c79';
      for(let f=0;f<4;f++){
        const fx=x+(rng()-.5)*36*sc, fy=y-73*sc+(rng()-.5)*34*sc;
        ellipse(g,fx,fy,3.2*sc,3.6*sc,fruit,.42+depth*.45);
      }
    }
  }
  v7mistBand(g,w,h*.60,h*.045,.05);
}
function v8drawGrape(g,w,h,rng){
  // Vineyard at purple dusk, replacing abstract nebula
  sceneGradient(g,w,h,[[0,'#3d3158'],[.42,'#74617b'],[.69,'#b0897d'],[1,'#3c493b']]);
  ellipse(g,w*.76,h*.30,34,34,'#e7c49c',.42);
  v8mountain(g,w,h,h*.58,'#63566d',.42,rng,.13);
  v7hill(g,w,h,h*.67,19,'#58634e',1.4,.72);
  const ground=g.createLinearGradient(0,h*.66,0,h);ground.addColorStop(0,'#526047');ground.addColorStop(1,'#28352a');
  g.fillStyle=ground;g.fillRect(0,h*.66,w,h*.34);

  const vp=w*.5, horizon=h*.65;
  for(let row=-6;row<=6;row++){
    g.strokeStyle='rgba(35,42,29,.48)';g.lineWidth=1;
    g.beginPath();g.moveTo(vp+row*8,horizon);g.lineTo(vp+row*115,h);g.stroke();
    for(let j=0;j<10;j++){
      const t=(j+1)/10,depth=t*t,y=v7lerp(horizon,h*.98,depth),x=vp+row*v7lerp(10,112,depth),sc=v7lerp(.12,.75,depth);
      g.strokeStyle='#463827';g.lineWidth=1+sc*2;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-35*sc);g.stroke();
      v7softBlob(g,x,y-34*sc,22*sc,13*sc,'#334c32',.45+depth*.4,6,rng);
      if(depth>.28 && rng()>.3){
        for(let k=0;k<6;k++)ellipse(g,x+(rng()-.5)*11*sc,y-26*sc+rng()*10*sc,2.0*sc,2.3*sc,rng()>.5?'#4d2d65':'#5f3975',.55+depth*.3);
      }
    }
  }
}
function v8drawPeach(g,w,h,rng){v8drawOrchard(g,w,h,rng,'peach')}
function v8drawLemon(g,w,h,rng){v8drawOrchard(g,w,h,rng,'lemon')}

function v8drawStaticScene(g,w,h,meta){
  const rng=v7rng(v7seedFor('v8-'+meta.scene,w,h));
  switch(meta.scene){
    case 'night':v8drawNight(g,w,h,rng);break;
    case 'day':v8drawDay(g,w,h,rng);break;
    case 'midnight':v8drawMidnight(g,w,h,rng);break;
    case 'oled':v8drawOLED(g,w,h,rng);break;
    case 'forest':v7drawForest(g,w,h,rng);break;
    case 'rose':v7drawFlowerField(g,w,h,rng,'rose');break;
    case 'lavender':v7drawFlowerField(g,w,h,rng,'lavender');break;
    case 'ocean':v7drawOcean(g,w,h,rng);break;
    case 'sunset':v8drawSunset(g,w,h,rng);break;
    case 'coffee':v8drawCoffee(g,w,h,rng);break;
    case 'meadow':v8drawMeadow(g,w,h,rng);break;
    case 'sakura':v8drawSakura(g,w,h,rng);break;
    case 'sky':v8drawSky(g,w,h,rng);break;
    case 'lemon':v8drawLemon(g,w,h,rng);break;
    case 'peach':v8drawPeach(g,w,h,rng);break;
    case 'cyber':v7drawCyber(g,w,h,rng,false);break;
    case 'grape':v8drawGrape(g,w,h,rng);break;
    case 'terminal':v7drawCyber(g,w,h,rng,true);break;
    default:v7drawStaticScene(g,w,h,meta);
  }
  const vign=g.createRadialGradient(w*.50,h*.42,Math.min(w,h)*.18,w*.50,h*.46,Math.max(w,h)*.78);
  const light=['day','rose','lavender','meadow','sky','lemon','peach'].includes(meta.scene);
  vign.addColorStop(0,'rgba(255,255,255,0)');
  vign.addColorStop(1,light?'rgba(55,70,65,.05)':'rgba(0,0,0,.15)');
  g.fillStyle=vign;g.fillRect(0,0,w,h);
}
getSceneCache=function(meta,w,h){
  const key=`v8:${meta.id}:${w}x${h}`;
  if(sceneCacheKey===key&&sceneCache)return sceneCache;
  sceneCache=mkOffscreen(w,h);
  sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});
  v8drawStaticScene(sceneCacheCtx,w,h,meta);
  sceneCacheKey=key;
  return sceneCache;
};

// Refine dynamic particle amount theme by theme.
const __v8InitBackgroundObjects=initBackgroundObjects;
initBackgroundObjects=function(){
  __v8InitBackgroundObjects();
  const s=getThemeMeta().scene;
  const limits={
    night:18,day:8,midnight:18,oled:10,forest:22,rose:14,lavender:13,ocean:18,
    sunset:8,coffee:7,meadow:10,sakura:16,sky:8,lemon:9,peach:13,cyber:12,grape:9,terminal:14
  };
  if(limits[s]!=null && themeFxParticles.length>limits[s])themeFxParticles.length=limits[s];
};

// Updated scene names in picker.
Object.assign(THEME_SCENE_LABELS,{
  night:'Moonlit lake · stars',
  day:'Morning meadow',
  midnight:'Moonlit alpine lake',
  oled:'Black horizon · faint aurora',
  forest:'Deep forest · mist · fireflies',
  rose:'Rose field · perspective rows',
  lavender:'Lavender field · distant hills',
  ocean:'Deep water · rays · kelp',
  sunset:'Warm mountain valley',
  coffee:'Rainy café · warm window',
  meadow:'Wildflower meadow',
  sakura:'Moonlit sakura path',
  sky:'Sea of clouds',
  lemon:'Lemon orchard',
  peach:'Peach orchard',
  cyber:'Neon city · wet grid',
  grape:'Vineyard at purple dusk',
  terminal:'Terminal skyline'
});


// ==========================================================================
// SCENE V9 — REQUESTED REDESIGNS
// Rose = glass conservatory / garden terrace
// Lavender = Provence-style stone courtyard
// Lemon = Mediterranean lemon patio
// Peach = Japanese peach-blossom garden
// Ocean = reef + fish schools
// Sakura = traditional Japanese street / shrine approach
// Cyber / Terminal = clearer luminous architecture
// Coffee = populated café interior
// ==========================================================================

function v9person(g,x,y,s,rng,shirt='#6f5142',alpha=.88){
  g.save();g.globalAlpha=alpha;
  // head/hair
  g.fillStyle='#d2aa8d';g.beginPath();g.arc(x,y-19*s,5.2*s,0,Math.PI*2);g.fill();
  g.fillStyle=rng()>.5?'#251d1a':'#443129';g.beginPath();g.arc(x,y-21*s,5.3*s,Math.PI,Math.PI*2);g.fill();
  // torso
  g.fillStyle=shirt;g.beginPath();g.roundRect(x-7*s,y-14*s,14*s,19*s,4*s);g.fill();
  // arms toward table
  g.strokeStyle='#c89e82';g.lineWidth=2.2*s;g.lineCap='round';
  g.beginPath();g.moveTo(x-5*s,y-9*s);g.lineTo(x-10*s,y-1*s);g.moveTo(x+5*s,y-9*s);g.lineTo(x+10*s,y-1*s);g.stroke();
  g.restore();
}
function v9tableSet(g,x,y,s,rng,people=2){
  // legs
  g.strokeStyle='rgba(55,38,28,.72)';g.lineWidth=3*s;g.beginPath();g.moveTo(x,y+5*s);g.lineTo(x-7*s,y+30*s);g.moveTo(x,y+5*s);g.lineTo(x+7*s,y+30*s);g.stroke();
  // tabletop
  ellipse(g,x,y,30*s,7*s,'#6b4932',.94);
  ellipse(g,x,y-1*s,28*s,5*s,'#8a6143',.62);
  // cups
  for(let i=0;i<people;i++){
    const cx=x+(i-(people-1)/2)*13*s;
    v8rectRound(g,cx-3*s,y-8*s,6*s,6*s,1.5*s,'#d8c7b5',.9);
    ellipse(g,cx,y-8*s,3*s,1*s,'#2a160f',.9);
  }
  const shirts=['#765346','#52616b','#6b5a77','#506650','#8a6650'];
  if(people>=1)v9person(g,x-19*s,y-2*s,s,rng,shirts[Math.floor(rng()*shirts.length)],.82);
  if(people>=2)v9person(g,x+19*s,y-2*s,s,rng,shirts[Math.floor(rng()*shirts.length)],.82);
}
function v9drawCoffee(g,w,h,rng){
  // Deeper café with perspective, multiple tables and patrons.
  sceneGradient(g,w,h,[[0,'#17100c'],[.48,'#2b1c14'],[1,'#0f0a08']]);

  // long rainy windows across the back wall
  const wy=h*.08, wh=h*.48;
  for(let p=0;p<4;p++){
    const wx=w*(.055+p*.225), ww=w*.19;
    v8rectRound(g,wx,wy,ww,wh,7,'#141718',1);
    const glass=g.createLinearGradient(wx,wy,wx,wy+wh);
    glass.addColorStop(0,'#35434a');glass.addColorStop(.62,'#28343a');glass.addColorStop(1,'#171e21');
    v8rectRound(g,wx+6,wy+6,ww-12,wh-12,4,glass,1);
    // blurred outside lights
    for(let i=0;i<10;i++){
      const bx=wx+12+rng()*(ww-24),by=wy+14+rng()*(wh-30),br=2+rng()*5;
      ellipse(g,bx,by,br,br,rng()>.55?'#d99959':'#739a9a',.07+rng()*.09);
    }
    // rain
    g.save();g.lineCap='round';
    for(let i=0;i<18;i++){
      const rx=wx+10+rng()*(ww-20),ry=wy+8+rng()*(wh-20),len=7+rng()*20;
      g.strokeStyle=`rgba(220,232,233,${.025+rng()*.055})`;g.lineWidth=.5+rng()*.7;
      g.beginPath();g.moveTo(rx,ry);g.lineTo(rx-2,ry+len);g.stroke();
    }
    g.restore();
  }

  // ceiling + pendant lamps
  g.fillStyle='#120c09';g.fillRect(0,0,w,h*.10);
  for(let i=0;i<5;i++){
    const lx=w*(.10+i*.20);
    g.strokeStyle='#2d211a';g.lineWidth=2;g.beginPath();g.moveTo(lx,0);g.lineTo(lx,h*(.15+(i%2)*.035));g.stroke();
    const ly=h*(.15+(i%2)*.035);
    g.fillStyle='#7b5234';g.beginPath();g.moveTo(lx-20,ly);g.lineTo(lx+20,ly);g.lineTo(lx+12,ly+22);g.lineTo(lx-12,ly+22);g.closePath();g.fill();
    const glow=g.createRadialGradient(lx,ly+25,2,lx,ly+25,90);
    glow.addColorStop(0,'rgba(255,188,103,.18)');glow.addColorStop(1,'rgba(255,188,103,0)');
    g.fillStyle=glow;g.fillRect(lx-90,ly-30,180,150);
  }

  // floor with perspective boards
  const floor=g.createLinearGradient(0,h*.55,0,h);floor.addColorStop(0,'#39261b');floor.addColorStop(1,'#1b120d');
  g.fillStyle=floor;g.fillRect(0,h*.55,w,h*.45);
  g.save();g.strokeStyle='rgba(232,191,148,.035)';g.lineWidth=1;
  for(let i=-8;i<=8;i++){g.beginPath();g.moveTo(w*.5,h*.55);g.lineTo(w*.5+i*w*.11,h);g.stroke();}
  for(let i=1;i<8;i++){const yy=h*.55+(h*.45)*Math.pow(i/8,1.55);g.beginPath();g.moveTo(0,yy);g.lineTo(w,yy);g.stroke();}
  g.restore();

  // bar counter at one side
  v8rectRound(g,w*.76,h*.45,w*.26,h*.18,5,'#4b3021',.94);
  g.fillStyle='#765038';g.fillRect(w*.75,h*.445,w*.25,8);
  for(let i=0;i<5;i++)ellipse(g,w*(.79+i*.045),h*.43,5,10,'#b18a64',.34);

  // many table groups, perspective scaled
  const sets=[
    [.18,.62,.48,2],[.42,.64,.50,2],[.66,.63,.47,1],
    [.10,.77,.72,2],[.34,.79,.78,2],[.61,.78,.74,2],[.84,.77,.68,2],
    [.22,.94,1.03,2],[.54,.93,1.05,2],[.82,.93,.98,2]
  ];
  for(const [xx,yy,s,p] of sets)v9tableSet(g,w*xx,h*yy,s,rng,p);

  // foreground chair silhouettes for depth
  g.save();g.globalAlpha=.75;g.fillStyle='#17100c';
  for(let i=0;i<4;i++){
    const x=w*(.04+i*.31);v8rectRound(g,x,h*.88,42,70,9,'#17100c',.72);
  }
  g.restore();
}
function v9drawRose(g,w,h,rng){
  // Elegant glass conservatory / rose garden, not a field.
  sceneGradient(g,w,h,[[0,'#c8d4d3'],[.48,'#e6dfd8'],[1,'#6e7d68']]);
  // greenhouse glass roof
  g.save();g.strokeStyle='rgba(66,82,76,.28)';g.lineWidth=3;
  for(let i=0;i<=8;i++){const x=i*w/8;g.beginPath();g.moveTo(w*.5,h*.05);g.lineTo(x,h*.52);g.stroke();}
  g.beginPath();g.moveTo(0,h*.52);g.lineTo(w,h*.52);g.stroke();g.restore();
  // glass light
  const light=g.createLinearGradient(0,0,0,h*.6);light.addColorStop(0,'rgba(255,255,255,.24)');light.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=light;g.fillRect(0,0,w,h*.62);

  // tiled central walkway
  g.fillStyle='#9b9486';g.beginPath();g.moveTo(w*.43,h*.52);g.lineTo(w*.57,h*.52);g.lineTo(w*.72,h);g.lineTo(w*.28,h);g.closePath();g.fill();
  g.save();g.strokeStyle='rgba(69,63,57,.14)';g.lineWidth=1;
  for(let i=1;i<8;i++){const t=i/8,y=v7lerp(h*.53,h,Math.pow(t,1.65));g.beginPath();g.moveTo(w*.43-(y-h*.52)*.31,y);g.lineTo(w*.57+(y-h*.52)*.31,y);g.stroke();}
  g.restore();

  // dense rose bushes on both sides
  for(const side of [-1,1]){
    for(let j=0;j<15;j++){
      const t=j/14, depth=t*t, y=v7lerp(h*.55,h*.98,depth);
      const edge=w*.5+side*v7lerp(w*.10,w*.38,depth);
      const sc=v7lerp(.24,1.15,depth);
      v7softBlob(g,edge+side*(20+rng()*30)*sc,y-18*sc,38*sc,25*sc,rng()>.5?'#365f43':'#2d543b',.68+depth*.25,8,rng);
      for(let k=0;k<5;k++){
        const cols=['#a93850','#c34d64','#d36a78','#8f3046'];
        v7flower(g,edge+(rng()-.5)*55*sc,y-25*sc+(rng()-.5)*30*sc,2.5*sc,cols[Math.floor(rng()*cols.length)],'#d8b38c',.58+depth*.35,rng()*6.28);
      }
    }
  }
  // benches / planters
  for(const side of [-1,1]){
    const x=w*.5+side*w*.29,y=h*.74;
    v8rectRound(g,x-40,y,80,8,2,'#695747',.65);g.fillStyle='#55483c';g.fillRect(x-32,y+8,5,25);g.fillRect(x+27,y+8,5,25);
  }
}
function v9drawLavender(g,w,h,rng){
  // Provence-style stone courtyard, lavender only as landscaping.
  sceneGradient(g,w,h,[[0,'#aebed0'],[.48,'#d9d5cc'],[1,'#777869']]);
  // old stone house
  g.fillStyle='#a89c87';g.fillRect(w*.12,h*.25,w*.52,h*.38);
  g.fillStyle='#74685d';g.beginPath();g.moveTo(w*.08,h*.27);g.lineTo(w*.38,h*.08);g.lineTo(w*.68,h*.27);g.closePath();g.fill();
  // windows + shutters
  for(let i=0;i<3;i++){
    const x=w*(.20+i*.15);
    v8rectRound(g,x,h*.35,46,70,3,'#34424a',.88);
    g.fillStyle='#776d61';g.fillRect(x-13,h*.35,9,70);g.fillRect(x+50,h*.35,9,70);
  }
  // warm doorway
  v8rectRound(g,w*.47,h*.40,58,h*.23,5,'#3e342d',1);
  const dg=g.createRadialGradient(w*.50,h*.49,2,w*.50,h*.49,80);dg.addColorStop(0,'rgba(244,190,116,.18)');dg.addColorStop(1,'rgba(244,190,116,0)');g.fillStyle=dg;g.fillRect(w*.40,h*.36,w*.20,h*.34);

  // stone courtyard
  g.fillStyle='#8f897d';g.fillRect(0,h*.63,w,h*.37);
  for(let i=0;i<45;i++){
    const x=rng()*w,y=h*(.65+rng()*.35),ww=18+rng()*45;
    g.strokeStyle='rgba(61,58,53,.10)';g.strokeRect(x,y,ww,8+rng()*15);
  }
  // lavender planters along courtyard edges
  for(const side of [-1,1]){
    for(let j=0;j<12;j++){
      const t=j/11,depth=t*t,y=v7lerp(h*.61,h*.96,depth),x=w*.5+side*v7lerp(w*.20,w*.44,depth),sc=v7lerp(.22,.95,depth);
      v7softBlob(g,x,y,28*sc,13*sc,'#465a43',.7,6,rng);
      for(let k=0;k<7;k++){
        const px=x+(rng()-.5)*42*sc,py=y-8*sc-rng()*20*sc;
        g.strokeStyle='rgba(61,83,57,.65)';g.lineWidth=Math.max(.5,sc);g.beginPath();g.moveTo(px,y);g.lineTo(px,py);g.stroke();
        for(let q=0;q<3;q++)v7leaf(g,px+(q%2?1:-1)*1.5*sc,py+q*3*sc,1.5*sc,rng()>.5?'#7560a5':'#8b73b5',.72,0);
      }
    }
  }
}
function v9drawLemon(g,w,h,rng){
  // Mediterranean patio under lemon trees.
  sceneGradient(g,w,h,[[0,'#91c9d4'],[.50,'#d7e6d9'],[1,'#66765b']]);
  // stucco wall and arched opening
  g.fillStyle='#d7cfb9';g.fillRect(0,h*.18,w,h*.58);
  g.fillStyle='#667f7e';g.beginPath();g.moveTo(w*.62,h*.30);g.arc(w*.72,h*.30,w*.10,Math.PI,0);g.lineTo(w*.82,h*.67);g.lineTo(w*.62,h*.67);g.closePath();g.fill();
  // blue sea through arch
  g.fillStyle='#6797a4';g.fillRect(w*.63,h*.31,w*.18,h*.36);
  g.fillStyle='#b9d5d5';g.fillRect(w*.63,h*.43,w*.18,h*.03);
  // tiled patio
  g.fillStyle='#a99d82';g.fillRect(0,h*.68,w,h*.32);
  g.save();g.strokeStyle='rgba(74,66,54,.10)';
  for(let i=0;i<12;i++){g.beginPath();g.moveTo(i*w/11,h*.68);g.lineTo(w*.5+(i-5.5)*w*.13,h);g.stroke();}
  for(let i=1;i<6;i++){const y=h*.68+(h*.32)*Math.pow(i/6,1.45);g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
  g.restore();
  // lemon trees framing patio
  for(const side of [-1,1]){
    for(let n=0;n<2;n++){
      const x=side<0?w*(.08+n*.17):w*(.92-n*.18),base=h*(.83+n*.05),sc=.85+n*.12;
      v8tree(g,x,base,sc,rng,'#3f6a3b','#5a4431',.95);
      for(let k=0;k<12;k++)ellipse(g,x+(rng()-.5)*75*sc,base-90*sc+(rng()-.5)*65*sc,4*sc,4.5*sc,'#e3c83e',.75);
    }
  }
  // café-style patio table
  v9tableSet(g,w*.47,h*.82,.82,rng,0);
  v8rectRound(g,w*.43,h*.72,80,8,3,'#d7c8aa',.7);
}
function v9drawPeach(g,w,h,rng){
  // Quiet Japanese peach-blossom garden rather than orchard rows.
  sceneGradient(g,w,h,[[0,'#b8c7d5'],[.50,'#e4d8d6'],[1,'#64705e']]);
  v8mountain(g,w,h,h*.48,'#8b8f93',.25,rng,.10);
  // pond
  const pond=g.createLinearGradient(0,h*.60,0,h);pond.addColorStop(0,'#718b87');pond.addColorStop(1,'#445d5a');
  g.fillStyle=pond;g.fillRect(0,h*.60,w,h*.40);
  // stepping stones
  for(let i=0;i<8;i++){const t=i/7,x=w*.35+t*w*.30+(i%2?18:-10),y=h*(.66+t*.045);ellipse(g,x,y,30+t*4,9+t*1.5,'#7c7b70',.72);}
  // little wooden bridge
  g.strokeStyle='#674838';g.lineWidth=8;g.beginPath();g.arc(w*.68,h*.70,90,Math.PI*1.08,Math.PI*1.92);g.stroke();
  g.lineWidth=2;for(let i=0;i<7;i++){const a=Math.PI*1.1+i*.13,x=w*.68+Math.cos(a)*90,y=h*.70+Math.sin(a)*90;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-22);g.stroke();}
  // peach blossom trees
  for(const side of [-1,1]){
    const x=side<0?w*.10:w*.90,base=h*.82;
    v7branch(g,x,base,w*.5+side*w*.18,h*.23,16,'#4b342f',.9);
    for(let b=0;b<10;b++){
      const bx=x+side*(-1)*(30+b*18),by=h*(.62-b*.035);
      const tx=bx+(rng()-.5)*80,ty=by-(30+rng()*50);
      v7branch(g,bx,by,tx,ty,4,'#523832',.8);
      for(let k=0;k<8;k++)ellipse(g,tx+(rng()-.5)*55,ty+(rng()-.5)*35,2.5+rng()*3,2+rng()*2.5,rng()>.5?'#e996a0':'#f0b0b1',.62+rng()*.22,rng()*6.28);
    }
  }
}
function v9fish(g,x,y,s,color,alpha=1,flip=1){
  g.save();g.translate(x,y);g.scale(flip,1);g.globalAlpha=alpha;g.fillStyle=color;
  g.beginPath();g.ellipse(0,0,9*s,4*s,0,0,Math.PI*2);g.fill();
  g.beginPath();g.moveTo(-8*s,0);g.lineTo(-15*s,-6*s);g.lineTo(-14*s,6*s);g.closePath();g.fill();
  g.fillStyle='rgba(235,245,245,.65)';g.beginPath();g.arc(4*s,-1*s,.8*s,0,Math.PI*2);g.fill();g.restore();
}
function v9drawOcean(g,w,h,rng){
  v7drawOcean(g,w,h,rng);
  // coral/rock accents
  for(let i=0;i<18;i++){
    const x=rng()*w,y=h*(.90+rng()*.10),s=.5+rng()*.9;
    g.strokeStyle=rng()>.5?'rgba(99,112,81,.48)':'rgba(112,77,70,.42)';g.lineWidth=2*s;
    for(let b=0;b<3;b++){g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+(b-1)*8*s,y-14*s,x+(b-1)*12*s,y-25*s);g.stroke();}
  }
  // several schools, kept subtle
  const colors=['#b7c7b7','#d2b47d','#8fb4bd','#c58d72','#9fc7c2'];
  for(let school=0;school<5;school++){
    const cx=w*(.15+rng()*.70),cy=h*(.28+rng()*.45),count=5+Math.floor(rng()*7),dir=rng()>.5?1:-1;
    for(let i=0;i<count;i++){
      const depth=.45+rng()*.75;
      v9fish(g,cx+(rng()-.5)*120,cy+(rng()-.5)*55,depth,colors[Math.floor(rng()*colors.length)],.34+rng()*.32,dir);
    }
  }
  // two larger foreground fish
  v9fish(g,w*.18,h*.52,1.25,'#a5b9a6',.46,1);
  v9fish(g,w*.80,h*.66,1.05,'#c3a574',.42,-1);
}
function v9drawSakura(g,w,h,rng){
  // Traditional Japanese shrine approach.
  sceneGradient(g,w,h,[[0,'#071020'],[.48,'#172039'],[.78,'#30263b'],[1,'#120e17']]);
  v8stars(g,w,h,rng,38,.38);ellipse(g,w*.80,h*.13,34,34,'#efeaff',.78);
  v8mountain(g,w,h,h*.55,'#2c3140',.30,rng,.10);

  // stone path
  g.fillStyle='#343234';g.beginPath();g.moveTo(w*.45,h*.52);g.lineTo(w*.55,h*.52);g.lineTo(w*.72,h);g.lineTo(w*.28,h);g.closePath();g.fill();
  for(let i=0;i<8;i++){const t=i/8,y=v7lerp(h*.56,h*.96,t*t),half=v7lerp(20,135,t*t);g.strokeStyle='rgba(210,204,194,.10)';g.beginPath();g.moveTo(w*.5-half,y);g.lineTo(w*.5+half,y);g.stroke();}

  // Torii gates receding into the path
  for(let j=0;j<4;j++){
    const t=j/3,depth=t*t,cy=v7lerp(h*.54,h*.82,depth),sc=v7lerp(.28,.82,depth),cx=w*.5;
    const red=j===3?'#8f342d':'#77302c';
    g.fillStyle=red;g.fillRect(cx-55*sc,cy-70*sc,8*sc,75*sc);g.fillRect(cx+47*sc,cy-70*sc,8*sc,75*sc);
    g.fillRect(cx-70*sc,cy-73*sc,140*sc,8*sc);g.fillRect(cx-61*sc,cy-61*sc,122*sc,6*sc);
  }
  // stone lanterns
  for(const side of [-1,1])for(let j=0;j<5;j++){
    const t=j/4,depth=t*t,y=v7lerp(h*.61,h*.94,depth),x=w*.5+side*v7lerp(w*.10,w*.34,depth),sc=v7lerp(.25,.72,depth);
    g.fillStyle='#5c5955';g.fillRect(x-3*sc,y-24*sc,6*sc,24*sc);
    v8rectRound(g,x-9*sc,y-34*sc,18*sc,11*sc,2*sc,'#6d6258',.9);
    const gl=g.createRadialGradient(x,y-29*sc,1,x,y-29*sc,25*sc);gl.addColorStop(0,'rgba(255,176,91,.18)');gl.addColorStop(1,'rgba(255,176,91,0)');g.fillStyle=gl;g.fillRect(x-30*sc,y-60*sc,60*sc,60*sc);
  }
  // sakura canopy framing top
  for(const side of [-1,1]){
    const sx=side<0?-20:w+20,sy=h*.42,ex=w*.50+side*w*.08,ey=h*.14;
    v7branch(g,sx,sy,ex,ey,17,'#28171e',.95);
    for(let b=0;b<12;b++){
      const t=.08+b*.07,bx=v7lerp(sx,ex,t),by=v7lerp(sy,ey,t),tx=bx+side*(rng()-.5)*80,ty=by-(20+rng()*45);
      v7branch(g,bx,by,tx,ty,3.8,'#311b24',.82);
      for(let k=0;k<7;k++)ellipse(g,tx+(rng()-.5)*48,ty+(rng()-.5)*30,2+rng()*3,1.8+rng()*2.2,rng()>.5?'#e88ba7':'#c9658b',.50+rng()*.28,rng()*6.28);
    }
  }
}
function v9drawCity(g,w,h,rng,terminal=false){
  const green=terminal;
  sceneGradient(g,w,h,green?[[0,'#010704'],[.52,'#03150b'],[1,'#010403']]:[[0,'#040816'],[.48,'#0c1230'],[.72,'#16132d'],[1,'#050710']]);
  const horizon=h*.75;

  // skyline glow behind buildings
  const glow=g.createRadialGradient(w*.52,horizon,0,w*.52,horizon,w*.58);
  glow.addColorStop(0,green?'rgba(39,255,118,.13)':'rgba(45,210,255,.16)');
  glow.addColorStop(.55,green?'rgba(39,255,118,.025)':'rgba(222,48,210,.035)');
  glow.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=glow;g.fillRect(0,h*.20,w,h*.70);

  // rear towers
  let x=-10;
  while(x<w+20){
    const bw=24+rng()*52,bh=70+rng()*180,base=horizon;
    const body=green?(rng()>.5?'#06170d':'#04120a'):(rng()>.5?'#111a35':'#17162f');
    g.fillStyle=body;g.fillRect(x,base-bh,bw,bh);
    // roof cap/antenna
    if(rng()>.45){g.strokeStyle=green?'rgba(69,255,128,.36)':'rgba(86,224,255,.34)';g.lineWidth=1.2;g.beginPath();g.moveTo(x+bw*.5,base-bh);g.lineTo(x+bw*.5,base-bh-20-rng()*45);g.stroke();}
    // many readable windows
    const cols=green?['rgba(74,255,132,.46)','rgba(157,255,190,.26)']:['rgba(70,225,255,.48)','rgba(255,75,207,.34)','rgba(255,210,101,.30)'];
    for(let yy=base-bh+12;yy<base-10;yy+=10){
      for(let xx=x+7;xx<x+bw-5;xx+=9){
        if(rng()>.30){g.fillStyle=cols[Math.floor(rng()*cols.length)];g.fillRect(xx,yy,3.5,4);}
      }
    }
    // edge neon
    if(rng()>.55){g.strokeStyle=green?'rgba(53,255,117,.24)':'rgba(59,214,255,.25)';g.strokeRect(x+.5,base-bh+.5,bw-1,bh-1);}
    x+=bw+5+rng()*9;
  }

  // foreground landmark towers
  for(let i=0;i<5;i++){
    const cx=w*(.10+i*.20)+(rng()-.5)*35,bw=52+rng()*42,bh=160+rng()*190,base=horizon+8;
    const body=green?'#020d07':'#090d20';
    g.fillStyle=body;g.fillRect(cx-bw/2,base-bh,bw,bh);
    g.strokeStyle=green?'rgba(63,255,122,.42)':(i%2?'rgba(255,57,207,.38)':'rgba(52,220,255,.42)');
    g.lineWidth=1.5;g.strokeRect(cx-bw/2,base-bh,bw,bh);
    for(let yy=base-bh+14;yy<base-12;yy+=12)for(let xx=cx-bw/2+8;xx<cx+bw/2-5;xx+=10){
      if(rng()>.22){g.fillStyle=green?'rgba(79,255,136,.52)':(rng()>.35?'rgba(64,224,255,.54)':'rgba(255,75,211,.42)');g.fillRect(xx,yy,4,5);}
    }
  }

  // wet reflective street/grid
  const grd=g.createLinearGradient(0,horizon,0,h);grd.addColorStop(0,green?'#03150a':'#080d1c');grd.addColorStop(1,'#010204');
  g.fillStyle=grd;g.fillRect(0,horizon,w,h-horizon);
  g.save();g.globalAlpha=.18;g.lineWidth=1;
  for(let i=1;i<9;i++){const yy=horizon+(h-horizon)*Math.pow(i/9,1.6);g.strokeStyle=green?'#35ef75':'#47d9f3';g.beginPath();g.moveTo(0,yy);g.lineTo(w,yy);g.stroke();}
  for(let i=-9;i<=9;i++){g.strokeStyle=green?'#35ef75':(i%2?'#e64bc6':'#47d9f3');g.beginPath();g.moveTo(w*.5,horizon);g.lineTo(w*.5+i*w*.105,h);g.stroke();}
  // vertical reflections
  for(let i=0;i<26;i++){const rx=rng()*w,rw=1+rng()*4,rh=8+rng()*45;g.fillStyle=green?'rgba(50,239,112,.10)':(rng()>.5?'rgba(58,218,244,.11)':'rgba(231,65,198,.08)');g.fillRect(rx,horizon+rng()*(h-horizon),rw,rh);}
  g.restore();
}

// Override V8 scene compositor for requested V9 concepts.
v8drawStaticScene=function(g,w,h,meta){
  const rng=v7rng(v7seedFor('v9-'+meta.scene,w,h));
  switch(meta.scene){
    case 'night':v8drawNight(g,w,h,rng);break;
    case 'day':v8drawDay(g,w,h,rng);break;
    case 'midnight':v8drawMidnight(g,w,h,rng);break;
    case 'oled':v8drawOLED(g,w,h,rng);break;
    case 'forest':v7drawForest(g,w,h,rng);break;
    case 'rose':v9drawRose(g,w,h,rng);break;
    case 'lavender':v9drawLavender(g,w,h,rng);break;
    case 'ocean':v9drawOcean(g,w,h,rng);break;
    case 'sunset':v8drawSunset(g,w,h,rng);break;
    case 'coffee':v9drawCoffee(g,w,h,rng);break;
    case 'meadow':v8drawMeadow(g,w,h,rng);break;
    case 'sakura':v9drawSakura(g,w,h,rng);break;
    case 'sky':v8drawSky(g,w,h,rng);break;
    case 'lemon':v9drawLemon(g,w,h,rng);break;
    case 'peach':v9drawPeach(g,w,h,rng);break;
    case 'cyber':v9drawCity(g,w,h,rng,false);break;
    case 'grape':v8drawGrape(g,w,h,rng);break;
    case 'terminal':v9drawCity(g,w,h,rng,true);break;
    default:v7drawStaticScene(g,w,h,meta);
  }
  const vign=g.createRadialGradient(w*.5,h*.42,Math.min(w,h)*.18,w*.5,h*.46,Math.max(w,h)*.78);
  const light=['day','rose','lavender','meadow','sky','lemon','peach'].includes(meta.scene);
  vign.addColorStop(0,'rgba(255,255,255,0)');
  vign.addColorStop(1,light?'rgba(55,65,60,.045)':'rgba(0,0,0,.13)');
  g.fillStyle=vign;g.fillRect(0,0,w,h);
};
getSceneCache=function(meta,w,h){
  const key=`v9:${meta.id}:${w}x${h}`;
  if(sceneCacheKey===key&&sceneCache)return sceneCache;
  sceneCache=mkOffscreen(w,h);
  sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});
  v8drawStaticScene(sceneCacheCtx,w,h,meta);
  sceneCacheKey=key;
  return sceneCache;
};

Object.assign(THEME_SCENE_LABELS,{
  rose:'Glass rose conservatory',
  lavender:'Provence stone courtyard',
  ocean:'Reef · fish · light rays',
  coffee:'Rainy café · tables · patrons',
  sakura:'Japanese shrine · torii · sakura',
  lemon:'Mediterranean lemon patio',
  peach:'Japanese peach garden · pond',
  cyber:'Bright neon megacity',
  terminal:'Green terminal megacity'
});


// ==========================================================================
// SCENE V10 — FINAL ACTIVE EFFECTS PASS
// Canvas-only. Static landscape is cached; only lightweight atmosphere moves.
// ==========================================================================

let v10Fx = [];
let v10SceneName = '';
let v10LastSize = '';
let v10Wind = 0;
let v10Flash = 0;

function v10Rand(min=0,max=1){ return min + Math.random()*(max-min); }
function v10Wrap(v,min,max){ const d=max-min; return ((v-min)%d+d)%d+min; }

function v10ResetFx(){
  if(!canvas) return;
  const w=canvas._cssW||innerWidth, h=canvas._cssH||innerHeight;
  const s=getThemeMeta().scene;
  v10Fx=[];
  v10SceneName=s; v10LastSize=`${w}x${h}`;
  const q=Math.max(.42,FX_QUALITY);

  const add=(n,maker)=>{
    n=Math.max(1,Math.round(n*q));
    for(let i=0;i<n;i++)v10Fx.push(maker(i));
  };

  if(s==='night'||s==='midnight'){
    add(78,()=>({kind:'star',x:v10Rand(0,w),y:v10Rand(0,h*.66),r:v10Rand(.45,1.55),a:v10Rand(.28,.88),tw:v10Rand(.7,2.3),p:v10Rand(0,6.283)}));
    add(3,()=>({kind:'shoot',x:v10Rand(w*.25,w*.95),y:v10Rand(-h*.15,h*.30),vx:v10Rand(-3.2,-1.9),vy:v10Rand(2.0,3.1),life:v10Rand(-180,60),max:95}));
    add(12,()=>({kind:'water',x:v10Rand(w*.55,w*.91),y:v10Rand(h*.76,h*.98),len:v10Rand(14,50),a:v10Rand(.025,.10),p:v10Rand(0,6.283)}));
  } else if(s==='oled'){
    add(42,()=>({kind:'star',x:v10Rand(0,w),y:v10Rand(0,h*.70),r:v10Rand(.35,1.2),a:v10Rand(.16,.62),tw:v10Rand(.6,1.8),p:v10Rand(0,6.283)}));
    add(4,(_,)=>({kind:'aurora',x:v10Rand(-w*.2,w*.9),y:v10Rand(h*.20,h*.60),w:v10Rand(w*.20,w*.42),h:v10Rand(45,105),p:v10Rand(0,6.283),a:v10Rand(.025,.065)}));
  } else if(s==='forest'){
    add(34,()=>({kind:'firefly',x:v10Rand(0,w),y:v10Rand(h*.30,h*.95),r:v10Rand(.8,1.8),a:v10Rand(.26,.78),p:v10Rand(0,6.283),vx:v10Rand(-.10,.10),vy:v10Rand(-.05,.05)}));
    add(6,()=>({kind:'mist',x:v10Rand(-w*.25,w),y:v10Rand(h*.44,h*.75),rx:v10Rand(w*.16,w*.30),ry:v10Rand(18,46),vx:v10Rand(.06,.16),a:v10Rand(.018,.050),p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'leafspeck',x:v10Rand(0,w),y:v10Rand(0,h),r:v10Rand(.4,1.1),a:v10Rand(.03,.10),vx:v10Rand(.02,.08),vy:v10Rand(.02,.07),p:v10Rand(0,6.283)}));
  } else if(s==='ocean'){
    add(24,()=>({kind:'bubble',x:v10Rand(0,w),y:v10Rand(h*.30,h*1.04),r:v10Rand(1.5,6.5),a:v10Rand(.08,.24),vy:v10Rand(-.22,-.08),p:v10Rand(0,6.283)}));
    add(24,(_,)=>({kind:'fish',x:v10Rand(-w*.15,w*1.10),y:v10Rand(h*.24,h*.76),s:v10Rand(.38,.95),dir:Math.random()>.5?1:-1,v:v10Rand(.24,.72),a:v10Rand(.20,.48),p:v10Rand(0,6.283),tone:Math.floor(v10Rand(0,5))}));
    add(5,()=>({kind:'ray',x:v10Rand(-w*.1,w*.9),p:v10Rand(0,6.283),a:v10Rand(.012,.032)}));
  } else if(s==='coffee'){
    add(52,()=>({kind:'rain',x:v10Rand(w*.04,w*.94),y:v10Rand(h*.07,h*.57),len:v10Rand(8,28),v:v10Rand(.45,1.1),a:v10Rand(.035,.12),p:v10Rand(0,6.283)}));
    add(10,()=>({kind:'steam',x:v10Rand(w*.12,w*.90),y:v10Rand(h*.60,h*.90),r:v10Rand(8,18),a:v10Rand(.018,.050),vy:v10Rand(-.05,-.025),p:v10Rand(0,6.283)}));
    add(9,()=>({kind:'lamp',x:v10Rand(.08,.92),p:v10Rand(0,6.283),a:v10Rand(.025,.065)}));
  } else if(s==='sakura'){
    add(32,()=>({kind:'petal',x:v10Rand(-40,w),y:v10Rand(-h*.2,h),r:v10Rand(2.0,4.2),a:v10Rand(.30,.68),vx:v10Rand(.24,.68),vy:v10Rand(.16,.40),rot:v10Rand(0,6.283),vr:v10Rand(-.025,.025),p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'lantern',x:v10Rand(.14,.86),y:v10Rand(.58,.94),p:v10Rand(0,6.283),a:v10Rand(.025,.08)}));
    add(8,()=>({kind:'moonDust',x:v10Rand(0,w),y:v10Rand(0,h*.55),r:v10Rand(.4,1.1),a:v10Rand(.04,.12),p:v10Rand(0,6.283)}));
  } else if(s==='cyber'||s==='terminal'){
    const terminal=s==='terminal';
    add(58,()=>({kind:'window',x:v10Rand(0,w),y:v10Rand(h*.25,h*.74),r:v10Rand(1.1,2.3),a:v10Rand(.12,.46),p:v10Rand(0,6.283),terminal}));
    add(18,()=>({kind:'traffic',x:v10Rand(-w*.1,w*1.1),y:v10Rand(h*.78,h*.97),len:v10Rand(12,50),v:v10Rand(.45,1.3),a:v10Rand(.06,.18),dir:Math.random()>.5?1:-1,terminal,p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'neonDust',x:v10Rand(0,w),y:v10Rand(0,h),r:v10Rand(.5,1.5),a:v10Rand(.04,.13),vy:v10Rand(.01,.05),p:v10Rand(0,6.283),terminal}));
  } else if(s==='grape'){
    add(18,()=>({kind:'duskDust',x:v10Rand(0,w),y:v10Rand(h*.28,h*.90),r:v10Rand(.7,1.8),a:v10Rand(.035,.12),vx:v10Rand(-.025,.04),vy:v10Rand(-.018,.018),p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'fireflyPurple',x:v10Rand(0,w),y:v10Rand(h*.45,h*.92),r:v10Rand(.7,1.4),a:v10Rand(.10,.35),p:v10Rand(0,6.283),vx:v10Rand(-.05,.05),vy:v10Rand(-.025,.025)}));
  } else if(s==='day'||s==='sky'||s==='meadow'||s==='sunset'){
    add(s==='sky'?11:7,()=>({kind:'cloud',x:v10Rand(-180,w),y:v10Rand(30,h*(s==='sunset'?.42:.35)),sc:v10Rand(.55,1.18),a:v10Rand(.09,.22),v:v10Rand(.050,.125),p:v10Rand(0,6.283)}));
    add(10,()=>({kind:'bird',x:v10Rand(-60,w),y:v10Rand(h*.16,h*.50),s:v10Rand(.45,1.0),v:v10Rand(.12,.30),a:v10Rand(.10,.28),p:v10Rand(0,6.283)}));
    if(s==='meadow')add(18,()=>({kind:'pollen',x:v10Rand(0,w),y:v10Rand(h*.48,h*.98),r:v10Rand(.5,1.4),a:v10Rand(.04,.13),vx:v10Rand(.015,.065),vy:v10Rand(-.025,.015),p:v10Rand(0,6.283)}));
    if(s==='sunset')add(14,()=>({kind:'goldDust',x:v10Rand(0,w),y:v10Rand(h*.36,h*.92),r:v10Rand(.6,1.4),a:v10Rand(.03,.10),vx:v10Rand(.01,.045),vy:v10Rand(-.02,.01),p:v10Rand(0,6.283)}));
  }
}

function v10Fish(ctx,p,t){
  const colors=['#b9c9b7','#d4b67d','#8eb7bf','#c88d72','#9dc8c0'];
  const col=colors[p.tone%colors.length];
  const wag=Math.sin(t*3+p.p)*1.7*p.s;
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.dir,1);ctx.globalAlpha=p.a;
  ctx.fillStyle=col;
  ctx.beginPath();ctx.ellipse(0,0,9*p.s,4*p.s,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(-8*p.s,0);ctx.lineTo(-15*p.s,-6*p.s+wag);ctx.lineTo(-14*p.s,6*p.s+wag);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(238,248,248,.65)';ctx.beginPath();ctx.arc(4*p.s,-1*p.s,.7*p.s,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function v10DrawFx(w,h,s,t,dt){
  v10Wind=Math.sin(t*.22)*.5;

  for(const p of v10Fx){
    ctx.save();

    if(p.kind==='star'){
      const tw=.55+.45*Math.sin(t*p.tw+p.p);
      ctx.globalAlpha=p.a*(.52+.48*tw);
      ctx.fillStyle='#eef7ff';ctx.beginPath();ctx.arc(p.x,p.y,p.r*(.85+tw*.15),0,6.283);ctx.fill();
    }
    else if(p.kind==='shoot'){
      p.life+=dt*60;
      if(p.life>p.max){p.life=v10Rand(-240,-30);p.x=v10Rand(w*.25,w*1.05);p.y=v10Rand(-h*.10,h*.25);}
      if(p.life>0){
        const a=Math.sin(Math.min(1,p.life/18)*Math.PI)*.34;
        ctx.globalAlpha=Math.max(.02,a);ctx.strokeStyle='#dcecff';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*13,p.y-p.vy*13);ctx.stroke();
        p.x+=p.vx;p.y+=p.vy;
      }
    }
    else if(p.kind==='water'){
      ctx.globalAlpha=p.a*(.55+.45*Math.sin(t*1.2+p.p));
      ctx.strokeStyle='#bed7ee';ctx.lineWidth=.7;
      ctx.beginPath();ctx.moveTo(p.x-p.len/2,p.y);ctx.lineTo(p.x+p.len/2,p.y);ctx.stroke();
    }
    else if(p.kind==='aurora'){
      const yy=p.y+Math.sin(t*.35+p.p)*12;
      const gr=ctx.createLinearGradient(p.x,yy,p.x+p.w,yy+p.h);
      gr.addColorStop(0,'rgba(0,255,116,0)');
      gr.addColorStop(.5,`rgba(50,255,135,${p.a*(.7+.3*Math.sin(t*.55+p.p))})`);
      gr.addColorStop(1,'rgba(89,100,255,0)');
      ctx.fillStyle=gr;ctx.filter='blur(16px)';
      ctx.beginPath();ctx.ellipse(p.x+p.w*.5,yy,p.w*.5,p.h*.5,.15*Math.sin(t*.2+p.p),0,6.283);ctx.fill();
    }
    else if(p.kind==='firefly'||p.kind==='fireflyPurple'){
      const purple=p.kind==='fireflyPurple';
      const pulse=.45+.55*(.5+.5*Math.sin(t*1.8+p.p));
      ctx.globalAlpha=p.a*pulse;ctx.shadowBlur=10;
      ctx.shadowColor=purple?'#d8b4fe':'#d9f99d';ctx.fillStyle=purple?'#ead8ff':'#edffb8';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
      p.x+=p.vx+Math.sin(t+p.p)*.025;p.y+=p.vy+Math.cos(t*.7+p.p)*.018;
      p.x=v10Wrap(p.x,-10,w+10);p.y=v10Wrap(p.y,h*.28,h*.98);
    }
    else if(p.kind==='mist'){
      p.x+=p.vx;
      if(p.x-p.rx>w)p.x=-p.rx;
      ctx.globalAlpha=p.a*(.78+.22*Math.sin(t*.35+p.p));
      ctx.fillStyle='#dbe7e1';ctx.filter='blur(20px)';
      ctx.beginPath();ctx.ellipse(p.x,p.y+Math.sin(t*.22+p.p)*5,p.rx,p.ry,0,0,6.283);ctx.fill();
    }
    else if(p.kind==='leafspeck'||p.kind==='pollen'||p.kind==='goldDust'||p.kind==='duskDust'){
      const gold=p.kind==='goldDust', purple=p.kind==='duskDust';
      ctx.globalAlpha=p.a*(.65+.35*Math.sin(t+p.p));
      ctx.fillStyle=gold?'#ffd59a':purple?'#e6c6da':'#eef3d4';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
      p.x+=p.vx+v10Wind*.01;p.y+=p.vy+Math.sin(t*.6+p.p)*.01;
      if(p.x>w+5)p.x=-5;if(p.y<-5)p.y=h+5;if(p.y>h+5)p.y=-5;
    }
    else if(p.kind==='bubble'){
      ctx.globalAlpha=p.a;ctx.strokeStyle='#d6fbff';ctx.lineWidth=.8;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.stroke();
      p.y+=p.vy;p.x+=Math.sin(t+p.p)*.025;
      if(p.y<-10){p.y=h+10;p.x=v10Rand(0,w);}
    }
    else if(p.kind==='fish'){
      v10Fish(ctx,p,t);
      p.x+=p.v*p.dir;p.y+=Math.sin(t*.9+p.p)*.035;
      if(p.dir>0&&p.x>w+40)p.x=-45;if(p.dir<0&&p.x<-45)p.x=w+45;
    }
    else if(p.kind==='ray'){
      const xx=p.x+Math.sin(t*.18+p.p)*35;
      ctx.globalAlpha=p.a*(.7+.3*Math.sin(t*.5+p.p));ctx.fillStyle='#d7fbff';
      ctx.beginPath();ctx.moveTo(xx,0);ctx.lineTo(xx+55,0);ctx.lineTo(xx+215,h*.83);ctx.lineTo(xx+110,h*.83);ctx.closePath();ctx.fill();
    }
    else if(p.kind==='rain'){
      p.y+=p.v;
      if(p.y>h*.58){p.y=h*.07;p.x=v10Rand(w*.04,w*.94);}
      ctx.globalAlpha=p.a;ctx.strokeStyle='#d9e7e8';ctx.lineWidth=.65;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-2,p.y+p.len);ctx.stroke();
    }
    else if(p.kind==='steam'){
      p.y+=p.vy;
      if(p.y<h*.52){p.y=v10Rand(h*.68,h*.89);p.x=v10Rand(w*.08,w*.92);}
      ctx.globalAlpha=p.a*(.65+.35*Math.sin(t*.8+p.p));ctx.fillStyle='#fff1df';ctx.filter='blur(7px)';
      ctx.beginPath();ctx.ellipse(p.x+Math.sin(t+p.p)*5,p.y,p.r*.45,p.r,0,0,6.283);ctx.fill();
    }
    else if(p.kind==='lamp'){
      const x=w*p.x;
      const y=h*(.18+(Math.floor(p.x*10)%2)*.025);
      const gr=ctx.createRadialGradient(x,y,2,x,y,80);
      gr.addColorStop(0,`rgba(255,190,105,${p.a*(.72+.28*Math.sin(t*.8+p.p))})`);gr.addColorStop(1,'rgba(255,190,105,0)');
      ctx.fillStyle=gr;ctx.fillRect(x-80,y-80,160,160);
    }
    else if(p.kind==='petal'){
      ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=p.a;ctx.fillStyle='#ec8fa9';
      ctx.beginPath();ctx.ellipse(0,0,p.r*.55,p.r*1.15,0,0,6.283);ctx.fill();
      p.x+=p.vx+Math.sin(t*1.2+p.p)*.08;p.y+=p.vy;p.rot+=p.vr;
      if(p.y>h+15||p.x>w+25){p.y=-15;p.x=v10Rand(-60,w*.75);}
    }
    else if(p.kind==='lantern'){
      const x=w*p.x,y=h*p.y;
      const gr=ctx.createRadialGradient(x,y,1,x,y,34);
      gr.addColorStop(0,`rgba(255,170,85,${p.a*(.65+.35*Math.sin(t*1.4+p.p))})`);gr.addColorStop(1,'rgba(255,170,85,0)');
      ctx.fillStyle=gr;ctx.fillRect(x-35,y-35,70,70);
    }
    else if(p.kind==='moonDust'){
      ctx.globalAlpha=p.a*(.5+.5*Math.sin(t*.8+p.p));ctx.fillStyle='#efe7ff';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
    }
    else if(p.kind==='window'){
      const pulse=.35+.65*(.5+.5*Math.sin(t*v10Rand(.45,.95)+p.p));
      ctx.globalAlpha=p.a*pulse;
      ctx.fillStyle=p.terminal?'#6cff9b':(Math.sin(p.p)>0?'#54e6ff':'#ff63d9');
      ctx.fillRect(p.x,p.y,p.r*1.6,p.r*2.2);
    }
    else if(p.kind==='traffic'){
      p.x+=p.v*p.dir;
      if(p.dir>0&&p.x>w+60)p.x=-60;if(p.dir<0&&p.x<-60)p.x=w+60;
      ctx.globalAlpha=p.a;ctx.strokeStyle=p.terminal?'#46f77d':(Math.sin(p.p)>0?'#4de7ff':'#ff4ecb');
      ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.len*p.dir,p.y+1.5);ctx.stroke();
    }
    else if(p.kind==='neonDust'){
      ctx.globalAlpha=p.a*(.55+.45*Math.sin(t+p.p));ctx.fillStyle=p.terminal?'#66ff9a':'#91efff';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.y+=p.vy;if(p.y>h+5){p.y=-5;p.x=v10Rand(0,w);}
    }
    else if(p.kind==='cloud'){
      cloud(ctx,p.x,p.y,p.sc,p.a,'255,255,255');p.x+=p.v;
      if(p.x>w+180)p.x=-180;
    }
    else if(p.kind==='bird'){
      p.x+=p.v;if(p.x>w+50){p.x=-50;p.y=v10Rand(h*.14,h*.48);}
      const flap=Math.sin(t*4+p.p)*2.2*p.s;
      ctx.globalAlpha=p.a;ctx.strokeStyle=s==='sunset'?'#2c2730':'#48636a';ctx.lineWidth=.8*p.s;
      ctx.beginPath();ctx.moveTo(p.x-5*p.s,p.y+flap);ctx.quadraticCurveTo(p.x,p.y-2*p.s,p.x,p.y);ctx.quadraticCurveTo(p.x,p.y-2*p.s,p.x+5*p.s,p.y+flap);ctx.stroke();
    }

    ctx.restore();
  }
}

drawBackground=function(ts=0){
  if(!canvas||!ctx||!isCanvasEnabled||document.hidden){animationFrameId=null;return;}

  const minDelta=1000/FX_TARGET_FPS;
  if(ts-fxLastFrame<minDelta){animationFrameId=requestAnimationFrame(drawBackground);return;}
  const dt=Math.min(.05,(ts-fxLastFrame||minDelta)/1000);fxLastFrame=ts;

  const w=canvas._cssW||innerWidth,h=canvas._cssH||innerHeight;
  const meta=getThemeMeta(),s=meta.scene;
  themeFxTick+=dt;

  if(v10SceneName!==s||v10LastSize!==`${w}x${h}`)v10ResetFx();

  ctx.clearRect(0,0,w,h);
  ctx.drawImage(getSceneCache(meta,w,h),0,0,w,h);

  // Slow global light breathing makes even static landscapes feel alive.
  const breathe=.5+.5*Math.sin(themeFxTick*.22);
  if(['forest','ocean','sunset','coffee','sakura','cyber','terminal','grape','midnight'].includes(s)){
    const ambient=ctx.createRadialGradient(w*.72,h*.18,10,w*.72,h*.18,w*.60);
    ambient.addColorStop(0, s==='cyber'||s==='terminal'
      ? `rgba(${s==='terminal'?'65,255,126':'72,215,255'},${.010+.010*breathe})`
      : `rgba(255,235,205,${.006+.010*breathe})`);
    ambient.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=ambient;ctx.fillRect(0,0,w,h);
  }

  v10DrawFx(w,h,s,themeFxTick,dt);

  // Gentle vignette only; do not flatten the scene.
  const lightScene=['day','sky','meadow'].includes(s);
  const vg=ctx.createRadialGradient(w*.5,h*.43,Math.min(w,h)*.22,w*.5,h*.47,Math.max(w,h)*.78);
  vg.addColorStop(0,'rgba(255,255,255,0)');
  vg.addColorStop(1,lightScene?'rgba(52,67,71,.035)':'rgba(0,0,0,.105)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);

  animationFrameId=requestAnimationFrame(drawBackground);
};

// V10 uses its own FX pool. Hook theme/resize initialization into the existing flow.
const __v10OldInitBackgroundObjects=initBackgroundObjects;
initBackgroundObjects=function(){
  __v10OldInitBackgroundObjects();
  v10ResetFx();
};

// Descriptions in picker.
Object.assign(THEME_SCENE_LABELS,{
  night:'Moonlit lake · shooting stars',
  day:'Morning landscape · clouds · birds',
  midnight:'Alpine night · stars · moon shimmer',
  oled:'Black horizon · living aurora',
  forest:'Deep forest · drifting mist · fireflies',
  ocean:'Living reef · swimming fish · bubbles',
  sunset:'Golden valley · clouds · birds',
  coffee:'Rainy café · patrons · steam · rain',
  meadow:'Wild meadow · wind · pollen',
  sakura:'Japanese shrine · petals · lantern glow',
  sky:'Sea of clouds · distant birds',
  cyber:'Bright megacity · traffic · neon windows',
  grape:'Vineyard dusk · floating lights',
  terminal:'Terminal megacity · traffic · green glow'
});

// Any user who previously saved a removed theme falls back cleanly.
(function v10MigrateRemovedTheme(){
  const old=localStorage.getItem(THEME_KEY);
  if(['rose','lavender','lemon','peach'].includes(old)){
    localStorage.setItem(THEME_KEY,'dark');
  }
})();

// ============================================================================
// V11.1 — CANVAS-FIRST THEMES (NO POINTER / NO TILT / NO CURSOR PARALLAX)
// ============================================================================
(function initCanvasFirstThemesV11_1(){
  const reduceMotion = matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  function ensureTransitionFlash(){
    let el=document.getElementById('themeTransitionFlash');
    if(!el){
      el=document.createElement('div');
      el.id='themeTransitionFlash';
      el.className='theme-transition-flash';
      document.body.appendChild(el);
    }
    return el;
  }

  // Keep only a cheap theme-change fade. No mouse/pointer tracking is registered.
  const oldApply=applyDashboardTheme;
  applyDashboardTheme=function(themeId,save=true,preserveAuto=false){
    const before=document.body.dataset.theme || getCurrentTheme();
    oldApply(themeId,save,preserveAuto);
    if(!reduceMotion && before!==themeId){
      const flash=ensureTransitionFlash();
      flash.classList.remove('play');
      void flash.offsetWidth;
      flash.classList.add('play');
      flash.addEventListener('animationend',()=>flash.classList.remove('play'),{once:true});
    }
  };

  // Canvas is intentionally fixed. No translate/scale tied to the cursor.
  if(canvas) canvas.style.transform='';

  window.addEventListener('load',()=>{
    ensureThemePicker();
    const small=document.querySelector('#themePickerOverlay .theme-picker-head small');
    if(small)small.textContent='Canvas scenery · stars · wind · clouds · fish · petals · optimized motion.';
  });
})();


// ============================================================================
// V12 UI POLISH — presentation only; no new data model or feature dependency.
// ============================================================================
(function initWorkspaceUIV12(){
    function refreshWorkspaceHero(){
        const now = new Date();
        const greetingEl = document.getElementById('workspaceGreeting');
        const dateEl = document.getElementById('workspaceTodayLabel');

        if (greetingEl) {
            const hour = now.getHours();
            const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
            greetingEl.textContent = `${greeting}. Everything you need is ready here.`;
        }
        if (dateEl) dateEl.textContent = new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).format(now);
    }
    window.refreshWorkspaceHero = refreshWorkspaceHero;
    window.addEventListener('load', refreshWorkspaceHero, {once:true});
})();


// ============================================================================
// V12.1 UI META — lightweight visual metadata only.
// ============================================================================
(function initWorkspaceUIV12_1(){
    function updateWorkspaceSectionMeta(){
        const grid = document.getElementById('groupsGrid');
        const countEl = document.getElementById('workspaceSectionCount');
        const titleEl = document.getElementById('workspaceSectionTitle');
        if (!grid || !countEl) return;

        const cards = Array.from(grid.children).filter(el => el.classList && el.classList.contains('group-card'));
        countEl.textContent = `${cards.length} group${cards.length === 1 ? '' : 's'}`;

        const activeChip = document.querySelector('.tag-chip.active');
        if (titleEl) {
            const label = activeChip?.textContent?.trim();
            titleEl.textContent = label && !/^all$/i.test(label) ? label : 'Your groups';
        }
    }

    window.addEventListener('load', () => {
        updateWorkspaceSectionMeta();
        const grid = document.getElementById('groupsGrid');
        if (grid && 'MutationObserver' in window) {
            new MutationObserver(updateWorkspaceSectionMeta).observe(grid,{childList:true});
        }
        document.addEventListener('click', (e) => {
            if (e.target.closest?.('.tag-chip')) setTimeout(updateWorkspaceSectionMeta,0);
        });
    }, {once:true});
})();

// ============================================================================
// MOBILE PRO 2026 — navigation state hardening
// Keeps the page, drawer and mobile dock from competing for touch/scroll state.
// ============================================================================
(function initMobileProNavigation() {
    const mq = window.matchMedia('(max-width: 768px)');

    function syncMobileSidebarA11y() {
        const open = document.body.classList.contains('sidebar-open');
        const sidebar = document.querySelector('.app-sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        const moreBtn = document.querySelector('.mobile-bottom-nav-v12 button:last-child');

        if (sidebar) {
            sidebar.setAttribute('aria-hidden', open ? 'false' : 'true');
            sidebar.setAttribute('aria-modal', mq.matches && open ? 'true' : 'false');
            if (mq.matches) sidebar.setAttribute('role', 'dialog');
            else {
                sidebar.removeAttribute('role');
                sidebar.removeAttribute('aria-modal');
                sidebar.removeAttribute('aria-hidden');
            }
        }
        if (backdrop) backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
        if (moreBtn) moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    const originalToggleMobileSidebar = window.toggleMobileSidebar;
    window.toggleMobileSidebar = function(force) {
        if (typeof originalToggleMobileSidebar === 'function') {
            originalToggleMobileSidebar(force);
        } else {
            const shouldOpen = typeof force === 'boolean'
                ? force
                : !document.body.classList.contains('sidebar-open');
            document.body.classList.toggle('sidebar-open', shouldOpen);
        }
        syncMobileSidebarA11y();
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
            window.toggleMobileSidebar(false);
        }
    });

    document.addEventListener('click', (event) => {
        if (!mq.matches || !document.body.classList.contains('sidebar-open')) return;
        const sidebar = event.target.closest('.app-sidebar');
        const moreBtn = event.target.closest('.mobile-bottom-nav-v12 button:last-child');
        if (!sidebar && !moreBtn && !event.target.closest('#sidebarBackdrop')) {
            window.toggleMobileSidebar(false);
        }
    }, { passive: true });

    function handleBreakpointChange() {
        if (!mq.matches) document.body.classList.remove('sidebar-open');
        syncMobileSidebarA11y();
    }

    if (mq.addEventListener) mq.addEventListener('change', handleBreakpointChange);
    else mq.addListener(handleBreakpointChange);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncMobileSidebarA11y, { once: true });
    } else {
        syncMobileSidebarA11y();
    }
})();

// ============================================================================
// MOBILE PRO 2026.1 — contextual group menus
// Keeps context menus close to the tap/click while clamping them to the viewport.
// ============================================================================
(function initMobileContextualMenus() {
    const mobileMQ = window.matchMedia('(max-width: 768px)');
    const originalOpenContextMenu = window.openContextMenu;

    if (typeof originalOpenContextMenu !== 'function') return;

    function placeMobileContextMenu(menu, event, isGroupMenu) {
        if (!menu || !mobileMQ.matches) return;

        menu.classList.toggle('mobile-group-context', !!isGroupMenu);
        menu.classList.toggle('mobile-item-context', !isGroupMenu);

        // Let the browser calculate the real menu size before clamping position.
        requestAnimationFrame(() => {
            const vv = window.visualViewport;
            const viewportWidth = vv ? vv.width : window.innerWidth;
            const viewportHeight = vv ? vv.height : window.innerHeight;
            const offsetLeft = vv ? vv.offsetLeft : 0;
            const offsetTop = vv ? vv.offsetTop : 0;
            const gap = 10;
            const dockReserve = 82;
            const rect = menu.getBoundingClientRect();

            // Accept MouseEvent, TouchEvent-like objects and legacy pageX/pageY callers.
            // The menu itself is position:fixed, so all coordinates must end up in the
            // visual viewport/client coordinate space.
            const touchPoint = event?.touches?.[0] || event?.changedTouches?.[0] || null;
            const rawClientX = touchPoint?.clientX ?? event?.clientX;
            const rawClientY = touchPoint?.clientY ?? event?.clientY;
            const rawPageX = touchPoint?.pageX ?? event?.pageX;
            const rawPageY = touchPoint?.pageY ?? event?.pageY;

            const clientX = Number.isFinite(rawClientX)
                ? rawClientX
                : (Number.isFinite(rawPageX) ? rawPageX - window.scrollX : offsetLeft + viewportWidth / 2);
            const clientY = Number.isFinite(rawClientY)
                ? rawClientY
                : (Number.isFinite(rawPageY) ? rawPageY - window.scrollY : offsetTop + viewportHeight / 2);

            let left = clientX + 8;
            if (left + rect.width > offsetLeft + viewportWidth - gap) {
                left = clientX - rect.width - 8;
            }
            left = Math.max(offsetLeft + gap, Math.min(left, offsetLeft + viewportWidth - rect.width - gap));

            let top = clientY + 10;
            const usableBottom = offsetTop + viewportHeight - dockReserve;
            if (top + rect.height > usableBottom) {
                top = clientY - rect.height - 10;
            }
            top = Math.max(offsetTop + gap, Math.min(top, usableBottom - rect.height));

            menu.style.setProperty('--mobile-menu-left', `${Math.round(left)}px`);
            menu.style.setProperty('--mobile-menu-top', `${Math.round(top)}px`);
            menu.style.setProperty('--mobile-menu-origin-x', clientX > viewportWidth / 2 ? '100%' : '0%');
            menu.style.setProperty('--mobile-menu-origin-y', top < clientY ? '100%' : '0%');
        });
    }

    window.openContextMenu = function(event, targetType, groupId, index = null) {
        originalOpenContextMenu.call(this, event, targetType, groupId, index);

        if (!mobileMQ.matches) return;
        const menu = document.getElementById('customContextMenu');
        const isGroupMenu = String(targetType || '').startsWith('group-');
        placeMobileContextMenu(menu, event, isGroupMenu);
    };

    // If the viewport changes while a menu is open, close it rather than leave it stranded.
    const closeFloatingMenu = () => {
        if (!mobileMQ.matches) return;
        const menu = document.getElementById('customContextMenu');
        if (menu && menu.style.display !== 'none') menu.style.display = 'none';
    };

    window.addEventListener('orientationchange', closeFloatingMenu, { passive: true });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', closeFloatingMenu, { passive: true });
    }
})();


// ===== DESKTOP PRO 2026 =====
(function(){
const KEY='dashboardDesktopGroupView', mq=window.matchMedia('(min-width:769px)'); let selected=null;
function meta(t){return({link:['🔗','Links'],note:['📝','Notes'],schedule:['📆','Schedule'],kanban:['📌','Kanban']})[t]||['📁','Group']}
function count(g){if(!g)return 0;if(g.type==='link')return g.links?.length||0;if(g.type==='note')return g.notes?.length||0;if(g.type==='schedule')return g.schedules?.length||0;if(g.type==='kanban')return typeof getKanbanCardCount==='function'?getKanbanCardCount(g):(g.boards||[]).reduce((s,b)=>s+(b.cards?.length||0),0);return 0}
window.setDesktopGroupView=function(mode){mode=mode==='list'?'list':'grid';localStorage.setItem(KEY,mode);document.body.classList.toggle('desktop-list-view',mode==='list');document.getElementById('desktopGridViewBtn')?.classList.toggle('active',mode==='grid');document.getElementById('desktopListViewBtn')?.classList.toggle('active',mode==='list')};
window.openDesktopInspector=function(id){if(!mq.matches)return;const g=getGroup(id),box=document.getElementById('desktopInspectorBody'),title=document.getElementById('desktopInspectorTitle');if(!g||!box||!title)return;selected=id;const m=meta(g.type),tags=Array.isArray(g.tags)?g.tags:[],emoji=g.emoji&&g.emoji!=='NONE'?g.emoji:m[0];title.textContent=`${emoji} ${g.title||'Untitled'}`;box.innerHTML=`<div class="desktop-inspector-type">${m[0]} ${m[1]}</div><div class="desktop-inspector-stats"><div class="desktop-inspector-stat"><small>Items</small><strong>${count(g)}</strong></div><div class="desktop-inspector-stat"><small>Status</small><strong>${g.collapsed?'Collapsed':'Open'}</strong></div><div class="desktop-inspector-stat"><small>Favorite</small><strong>${g.favorite?'Yes':'No'}</strong></div><div class="desktop-inspector-stat"><small>Locked</small><strong>${g.pinKey&&g.isLocked?'Yes':'No'}</strong></div></div><small style="color:var(--text-sub);font-weight:800">TAGS</small><div class="desktop-inspector-tags" style="margin-top:8px">${tags.length?tags.map(x=>`<span class="desktop-inspector-tag">${escapeHTML(String(x))}</span>`).join(''):'<span class="desktop-inspector-tag">No tags</span>'}</div><div class="desktop-inspector-actions"><button class="btn-primary" onclick="openGroupModal('${g.id}','${g.type}')">✏️ Edit</button><button class="btn-secondary" onclick="toggleFavoriteGroup('${g.id}',event);refreshDesktopInspector()">⭐ Favorite</button><button class="btn-secondary wide" onclick="scrollToGroup('${g.id}')">◎ Focus group</button></div>`;document.body.classList.add('desktop-inspector-open');document.getElementById('desktopInspector')?.setAttribute('aria-hidden','false');document.querySelectorAll('.group-card').forEach(c=>c.classList.toggle('desktop-inspected',c.dataset.id===String(id)))};
window.refreshDesktopInspector=function(){if(selected)openDesktopInspector(selected)};
window.closeDesktopInspector=function(){selected=null;document.body.classList.remove('desktop-inspector-open');document.getElementById('desktopInspector')?.setAttribute('aria-hidden','true');document.querySelectorAll('.desktop-inspected').forEach(c=>c.classList.remove('desktop-inspected'))};
function enhance(){if(!mq.matches)return;document.querySelectorAll('#groupsContainer .group-card').forEach(card=>{const a=card.querySelector('.group-header-actions'),id=card.dataset.id;if(!a||!id||a.querySelector('.desktop-inspect-btn'))return;const b=document.createElement('button');b.type='button';b.className='desktop-inspect-btn';b.title='Open inspector';b.innerHTML='⋯';b.onclick=e=>{e.preventDefault();e.stopPropagation();openDesktopInspector(id)};a.insertBefore(b,a.firstChild)});if(selected)document.querySelector(`.group-card[data-id="${CSS.escape(String(selected))}"]`)?.classList.add('desktop-inspected')}
if(typeof renderDashboard==='function'){const old=renderDashboard;renderDashboard=function(){const r=old.apply(this,arguments);enhance();if(selected)refreshDesktopInspector();return r}}
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommandPalette()}else if(e.key==='Escape'&&document.body.classList.contains('desktop-inspector-open'))closeDesktopInspector()});
function sync(){if(!mq.matches){closeDesktopInspector();document.body.classList.remove('desktop-list-view');return}setDesktopGroupView(localStorage.getItem(KEY)||'grid');enhance()}
mq.addEventListener?.('change',sync);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();
// ===== MODAL + QUICK ACTIONS PRO 2026 =====
(function(){
  const compact = new Set(['alertModal','confirmModal','keyModal','calendarDayModal','noteLinkModal','noteTableModal']);
  const medium = new Set(['createGroupTypeModal','groupModal','linkModal','scheduleModal','readModal','todayImportantModal','backupModal']);
  const editor = new Set(['noteModal','noteDeadlineModal','noteIconModal','trashModal','calendarModal','sidebarPanelModal','commandPaletteModal','accountModal','adminUserDetailModal','kanbanCardModal']);
  const workspace = new Set(['adminConsoleModal','kanbanWorkspaceModal']);

  function classifyModal(id){
    const el=document.getElementById(id); if(!el) return;
    el.classList.remove('modal-compact','modal-medium','modal-editor','modal-workspace');
    if(compact.has(id)) el.classList.add('modal-compact');
    else if(workspace.has(id)) el.classList.add('modal-workspace');
    else if(editor.has(id)) el.classList.add('modal-editor');
    else if(medium.has(id)) el.classList.add('modal-medium');
    else el.classList.add('modal-medium');
  }

  if(typeof openModal!=='undefined'){
    const _openModal=openModal;
    openModal=function(id){classifyModal(id);return _openModal(id)};
  }

  document.querySelectorAll('.modal-overlay[id]').forEach(m=>classifyModal(m.id));

  // Add practical hover tools on desktop without changing mobile cards.
  function enhanceHoverTools(){
    if(!window.matchMedia('(min-width:769px)').matches) return;
    document.querySelectorAll('#groupsContainer .group-card').forEach(card=>{
      const id=card.dataset.id, actions=card.querySelector('.group-header-actions');
      if(!id||!actions||actions.querySelector('.desktop-hover-tools')) return;
      const g=typeof getGroup==='function'?getGroup(id):null; if(!g) return;
      const wrap=document.createElement('span'); wrap.className='desktop-hover-tools';
      const add=document.createElement('button'); add.type='button'; add.title='Quick add'; add.textContent='＋';
      add.onclick=e=>{e.preventDefault();e.stopPropagation(); if(g.type==='link') openLinkModal(id); else if(g.type==='note') openNoteModal(id); else if(g.type==='schedule') openScheduleModal(id); else if(g.type==='kanban') addKanbanBoard(id)};
      const edit=document.createElement('button'); edit.type='button'; edit.title='Edit group'; edit.textContent='✎';
      edit.onclick=e=>{e.preventDefault();e.stopPropagation();openGroupModal(id,g.type)};
      wrap.append(add,edit); actions.insertBefore(wrap,actions.firstChild);
    });
  }

  if(typeof renderDashboard==='function'){
    const _render=renderDashboard;
    renderDashboard=function(){const r=_render.apply(this,arguments);enhanceHoverTools();return r};
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enhanceHoverTools,{once:true}); else enhanceHoverTools();

  // Faster creation shortcut: Alt/Option + N.
  document.addEventListener('keydown',e=>{
    const active=document.activeElement;
    const typing=active&&(active.matches?.('input,textarea,select')||active.isContentEditable);
    if(!typing&&e.altKey&&e.key.toLowerCase()==='n'){
      e.preventDefault();
      if(typeof openCreateGroupTypeModal==='function') openCreateGroupTypeModal();
    }
  });

  // Turn existing trash toast into a true Undo toast.
  if(typeof showUndoToast==='function'){
    showUndoToast=function(label){
      const toast=document.getElementById('undoToast'); if(!toast) return;
      toast.innerHTML=`<span>Moved <b>${escapeHTML(label)}</b> to Trash.</span><span class="toast-actions"><button class="btn-primary" onclick="restoreLastTrashItem()">Undo</button><button class="btn-secondary" onclick="openTrashModal()">Trash</button></span>`;
      toast.style.display='flex';
      clearTimeout(window.__undoToastTimer);
      window.__undoToastTimer=setTimeout(()=>{toast.style.display='none'},7000);
    };
  }
})();


// ==========================================================================
// GROUP INSPECTOR PRO 2026
// Rich preview for Links / Notes / Schedule / Kanban
// ==========================================================================
(function initRichDesktopInspector() {
    const mq = window.matchMedia('(min-width: 769px)');
    const MAX_PREVIEW = 8;
    let activeGroupId = null;
    let activeQuery = '';

    function safeText(value) {
        return typeof escapeHTML === 'function' ? escapeHTML(String(value ?? '')) : String(value ?? '');
    }

    function stripHTML(value) {
        const el = document.createElement('div');
        el.innerHTML = value || '';
        return (el.textContent || el.innerText || '').replace(/\s+/g, ' ').trim();
    }

    function norm(value) {
        return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function matchesQuery(parts) {
        if (!activeQuery) return true;
        const haystack = norm(parts.filter(Boolean).join(' '));
        return haystack.includes(norm(activeQuery));
    }

    function getTypeMeta(type) {
        return ({
            link: ['🔗', 'Links'],
            note: ['📝', 'Notes'],
            schedule: ['📆', 'Schedule'],
            kanban: ['📌', 'Kanban']
        })[type] || ['📁', 'Group'];
    }

    function getCount(group) {
        if (!group) return 0;
        if (group.type === 'link') return group.links?.length || 0;
        if (group.type === 'note') return group.notes?.length || 0;
        if (group.type === 'schedule') return group.schedules?.length || 0;
        if (group.type === 'kanban' && typeof getKanbanCardCount === 'function') return getKanbanCardCount(group);
        return 0;
    }

    function hostname(url) {
        try {
            return new URL(url, location.href).hostname.replace(/^www\./, '');
        } catch {
            return String(url || '');
        }
    }

    function notePreview(note) {
        const rich = stripHTML(note?.content_html || '');
        return rich || String(note?.content || '').replace(/\s+/g, ' ').trim() || 'No preview';
    }

    function scheduleMeta(sch) {
        const date = sch?.date || 'No date';
        const time = sch?.time || '';
        const end = sch?.endDate && sch.endDate !== sch.date ? ` → ${sch.endDate}` : '';
        return `${date}${time ? ' · ' + time : ''}${end}`;
    }

    function renderLinkItems(group) {
        const all = (group.links || []).map((item, index) => ({ item, index }))
            .filter(({item}) => matchesQuery([item.name, item.url, ...(item.tags || [])]));
        const shown = all.slice(0, MAX_PREVIEW);

        if (!shown.length) return {
            html: `<div class="inspector-empty">${activeQuery ? 'No links match your search.' : 'This group has no links yet.'}</div>`,
            total: all.length
        };

        return {
            html: `<div class="inspector-content-list">${shown.map(({item, index}) => `
                <button class="inspector-item" type="button" data-inspector-action="open-link" data-index="${index}">
                    <span class="inspector-item-icon">${safeText(item.emoji && item.emoji !== 'NONE' ? item.emoji : '🌐')}</span>
                    <span class="inspector-item-main">
                        <span class="inspector-item-title">${safeText(item.name || 'Untitled link')}</span>
                        <span class="inspector-item-subtitle">${safeText(hostname(item.url))}</span>
                    </span>
                    <span class="inspector-item-arrow">↗</span>
                </button>`).join('')}</div>`,
            total: all.length
        };
    }

    function renderNoteItems(group) {
        const all = (group.notes || []).map((item, index) => ({ item, index }))
            .filter(({item}) => matchesQuery([
                item.title, notePreview(item),
                ...normalizeNoteTags(item),
                ...normalizeNoteTags(item).map(noteTagLabel)
            ]));
        const shown = all.slice(0, MAX_PREVIEW);

        if (!shown.length) return {
            html: `<div class="inspector-empty">${activeQuery ? 'No notes match your search.' : 'This group has no notes yet.'}</div>`,
            total: all.length
        };

        return {
            html: `<div class="inspector-content-list">${shown.map(({item, index}) => `
                <button class="inspector-item" type="button" data-inspector-action="open-note" data-index="${index}">
                    <span class="inspector-item-icon">${safeText(item.emoji && item.emoji !== 'NONE' ? item.emoji : (item.pinned ? '📌' : '📝'))}</span>
                    <span class="inspector-item-main">
                        <span class="inspector-item-title">${safeText(item.title || 'Untitled note')}</span>
                        <span class="inspector-item-subtitle">${safeText(notePreview(item).slice(0, 110))}</span>
                    </span>
                    <span class="inspector-item-arrow">›</span>
                </button>`).join('')}</div>`,
            total: all.length
        };
    }

    function renderScheduleItems(group) {
        const all = (group.schedules || []).map((item, index) => ({ item, index }))
            .filter(({item}) => matchesQuery([item.title, item.content, item.date, item.time, ...(item.tags || [])]));
        const shown = all.slice(0, MAX_PREVIEW);

        if (!shown.length) return {
            html: `<div class="inspector-empty">${activeQuery ? 'No schedules match your search.' : 'This group has no schedules yet.'}</div>`,
            total: all.length
        };

        return {
            html: `<div class="inspector-content-list">${shown.map(({item, index}) => `
                <button class="inspector-item" type="button" data-inspector-action="open-schedule" data-index="${index}">
                    <span class="inspector-item-icon">${item.important ? '⚠️' : '📅'}</span>
                    <span class="inspector-item-main">
                        <span class="inspector-item-title">${safeText(item.title || 'Untitled schedule')}</span>
                        <span class="inspector-item-subtitle">${safeText(scheduleMeta(item))}</span>
                    </span>
                    <span class="inspector-item-arrow">›</span>
                </button>`).join('')}</div>`,
            total: all.length
        };
    }

    function getKanbanWorkspace(group) {
        try {
            if (typeof normalizeKanbanGroup === 'function') return normalizeKanbanGroup(group);
        } catch {}
        if (group?.kanban?.boards) return group.kanban;
        return { boards: [] };
    }

    function renderKanbanItems(group) {
        const workspace = getKanbanWorkspace(group);
        const all = (workspace.boards || []).filter(board => {
            const columns = board.columns || [];
            const cards = columns.flatMap(col => col.cards || []);
            return matchesQuery([
                board.title,
                ...columns.map(c => c.title),
                ...cards.flatMap(card => [card.title, card.content, card.description])
            ]);
        });
        const shown = all.slice(0, 5);

        if (!shown.length) return {
            html: `<div class="inspector-empty">${activeQuery ? 'No Kanban boards match your search.' : 'This Kanban group has no boards yet.'}</div>`,
            total: all.length
        };

        return {
            html: shown.map(board => {
                const columns = board.columns || [];
                const cardCount = columns.reduce((sum, col) => sum + (col.cards?.length || 0), 0);
                return `
                    <div class="inspector-kanban-board" role="button" tabindex="0"
                         data-inspector-action="open-board" data-board-id="${safeText(board.id)}">
                        <div class="inspector-board-head">
                            <span class="inspector-board-title">${safeText(board.title || 'Untitled board')}</span>
                            <span class="inspector-board-count">${cardCount} cards</span>
                        </div>
                        <div class="inspector-board-columns">
                            ${columns.slice(0, 5).map(col =>
                                `<span class="inspector-column-chip">${safeText(col.title || 'Column')} · ${col.cards?.length || 0}</span>`
                            ).join('')}
                            ${columns.length > 5 ? `<span class="inspector-column-chip">+${columns.length - 5} more</span>` : ''}
                        </div>
                    </div>`;
            }).join(''),
            total: all.length
        };
    }

    function getRenderedContent(group) {
        if (group.type === 'link') return renderLinkItems(group);
        if (group.type === 'note') return renderNoteItems(group);
        if (group.type === 'schedule') return renderScheduleItems(group);
        if (group.type === 'kanban') return renderKanbanItems(group);
        return { html: '<div class="inspector-empty">No preview is available for this group type.</div>', total: 0 };
    }

    function addLabel(group) {
        if (group.type === 'link') return '＋ Add link';
        if (group.type === 'note') return '＋ New note';
        if (group.type === 'schedule') return '＋ Add schedule';
        if (group.type === 'kanban') return '📌 Open workspace';
        return '＋ Add item';
    }

    function renderInspector() {
        if (!mq.matches || !activeGroupId) return;
        const group = typeof getGroup === 'function' ? getGroup(activeGroupId) : null;
        const box = document.getElementById('desktopInspectorBody');
        const title = document.getElementById('desktopInspectorTitle');
        if (!group || !box || !title) {
            window.closeDesktopInspector?.();
            return;
        }

        const meta = getTypeMeta(group.type);
        const emoji = group.emoji && group.emoji !== 'NONE' ? group.emoji : meta[0];
        const locked = !!(group.pinKey && group.isLocked);
        const tags = Array.isArray(group.tags) ? group.tags : [];
        const itemCount = getCount(group);

        title.textContent = `${emoji} ${group.title || 'Untitled'}`;

        const content = locked
            ? { html: `<div class="inspector-locked">🔒<br><strong>Content is locked</strong><br>Unlock this group on the dashboard to preview its items.</div>`, total: 0 }
            : getRenderedContent(group);

        box.innerHTML = `
            <div class="inspector-summary">
                <div class="inspector-summary-left">
                    <span class="desktop-inspector-type" style="margin:0">${meta[0]} ${meta[1]}</span>
                    <span class="inspector-count">${itemCount} item${itemCount === 1 ? '' : 's'}</span>
                </div>
                <div style="display:flex;gap:5px">
                    ${group.favorite ? '<span class="inspector-mini-badge">⭐ Favorite</span>' : ''}
                    ${locked ? '<span class="inspector-mini-badge">🔒 Locked</span>' : ''}
                </div>
            </div>

            ${!locked ? `
            <div class="inspector-search-wrap">
                <span class="inspector-search-icon">⌕</span>
                <input id="desktopInspectorSearch" class="inspector-search" type="search"
                       placeholder="Search in this group..." value="${safeText(activeQuery)}" autocomplete="off">
                ${activeQuery ? '<button class="inspector-search-clear" type="button" data-inspector-action="clear-search">✕</button>' : ''}
            </div>` : ''}

            ${tags.length ? `
            <div class="desktop-inspector-tags" style="margin-bottom:14px">
                ${tags.map(tag => `<span class="desktop-inspector-tag">${safeText(tag)}</span>`).join('')}
            </div>` : ''}

            <div class="inspector-section-label">
                <span>Content</span>
                ${!locked && activeQuery ? `<span>${content.total} found</span>` : ''}
            </div>

            <div id="desktopInspectorContent">${content.html}</div>

            ${!locked && content.total > MAX_PREVIEW ? `
                <button class="inspector-view-all" type="button" data-inspector-action="view-all">
                    View all ${content.total} →
                </button>` : ''}

            <div class="inspector-bottom-actions">
                <button class="btn-primary" type="button" data-inspector-action="add">${addLabel(group)}</button>
                <button class="btn-secondary" type="button" data-inspector-action="edit-group">✎ Edit group</button>
                <button class="btn-secondary wide" type="button" data-inspector-action="focus">◎ Focus on dashboard</button>
            </div>
        `;

        const search = document.getElementById('desktopInspectorSearch');
        if (search) {
            search.addEventListener('input', () => {
                activeQuery = search.value;
                renderInspector();
                const next = document.getElementById('desktopInspectorSearch');
                if (next) {
                    next.focus();
                    next.setSelectionRange(next.value.length, next.value.length);
                }
            });
        }

        box.onclick = handleInspectorClick;
        box.onkeydown = (event) => {
            if ((event.key === 'Enter' || event.key === ' ') && event.target?.matches?.('.inspector-kanban-board')) {
                event.preventDefault();
                event.target.click();
            }
        };
    }

    function handleInspectorClick(event) {
        const actionEl = event.target.closest('[data-inspector-action]');
        if (!actionEl) return;

        const group = typeof getGroup === 'function' ? getGroup(activeGroupId) : null;
        if (!group) return;

        const action = actionEl.dataset.inspectorAction;
        const index = Number(actionEl.dataset.index);

        if (action === 'clear-search') {
            activeQuery = '';
            renderInspector();
            document.getElementById('desktopInspectorSearch')?.focus();
            return;
        }

        if (action === 'open-link') {
            const item = group.links?.[index];
            if (item?.url) window.open(item.url, '_blank', 'noopener');
            return;
        }

        if (action === 'open-note') {
            if (typeof showContentDetail === 'function') showContentDetail(group.id, index, 'note');
            return;
        }

        if (action === 'open-schedule') {
            if (typeof showContentDetail === 'function') showContentDetail(group.id, index, 'schedule');
            return;
        }

        if (action === 'open-board') {
            if (typeof openKanbanWorkspace === 'function') {
                openKanbanWorkspace(group.id, actionEl.dataset.boardId || null);
            }
            return;
        }

        if (action === 'add') {
            if (group.type === 'kanban') {
                if (typeof openKanbanWorkspace === 'function') openKanbanWorkspace(group.id);
            } else if (typeof openItemModal === 'function') {
                openItemModal(group.type, group.id, false);
            }
            return;
        }

        if (action === 'edit-group') {
            if (typeof openGroupModal === 'function') openGroupModal(group.id, group.type);
            return;
        }

        if (action === 'focus' || action === 'view-all') {
            if (typeof scrollToGroup === 'function') scrollToGroup(group.id);
            return;
        }
    }

    // Replace the earlier shallow inspector with the rich inspector.
    window.openDesktopInspector = function(groupId) {
        if (!mq.matches) return;
        const group = typeof getGroup === 'function' ? getGroup(groupId) : null;
        if (!group) return;

        if (String(activeGroupId) !== String(groupId)) activeQuery = '';
        activeGroupId = groupId;

        document.body.classList.add('desktop-inspector-open');
        document.getElementById('desktopInspector')?.setAttribute('aria-hidden', 'false');
        document.querySelectorAll('.group-card').forEach(card => {
            card.classList.toggle('desktop-inspected', card.dataset.id === String(groupId));
        });
        renderInspector();
    };

    window.refreshDesktopInspector = function() {
        if (activeGroupId) renderInspector();
    };

    const previousClose = window.closeDesktopInspector;
    window.closeDesktopInspector = function() {
        activeGroupId = null;
        activeQuery = '';
        document.body.classList.remove('desktop-inspector-open');
        document.getElementById('desktopInspector')?.setAttribute('aria-hidden', 'true');
        document.querySelectorAll('.group-card.desktop-inspected').forEach(card => card.classList.remove('desktop-inspected'));
        if (typeof previousClose === 'function') {
            try { previousClose(); } catch {}
        }
    };

    // Refresh the inspector after any dashboard render/data update.
    if (typeof renderDashboard === 'function') {
        const previousRender = renderDashboard;
        renderDashboard = function() {
            const result = previousRender.apply(this, arguments);
            if (activeGroupId) {
                requestAnimationFrame(() => {
                    const exists = typeof getGroup === 'function' && getGroup(activeGroupId);
                    if (exists) {
                        document.querySelector(`.group-card[data-id="${CSS.escape(String(activeGroupId))}"]`)?.classList.add('desktop-inspected');
                        renderInspector();
                    } else {
                        window.closeDesktopInspector();
                    }
                });
            }
            return result;
        };
    }
})();


// ==========================================================================
// GROUP HEADER SOFT 2026 — TITLE TOOLTIP
// ==========================================================================
(function initSoftGroupHeaderTitles() {
    function syncTitles() {
        document.querySelectorAll('#groupsContainer .group-card').forEach(card => {
            const titleEl =
                card.querySelector('.group-title-text') ||
                card.querySelector('.group-name') ||
                card.querySelector('.group-title') ||
                card.querySelector('.group-header h3') ||
                card.querySelector('.group-header h2');

            if (!titleEl) return;
            const full = (titleEl.textContent || '').replace(/\s+/g, ' ').trim();
            if (full) titleEl.setAttribute('title', full);
        });
    }

    if (typeof renderDashboard === 'function') {
        const previous = renderDashboard;
        renderDashboard = function() {
            const result = previous.apply(this, arguments);
            requestAnimationFrame(syncTitles);
            return result;
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncTitles, { once: true });
    } else {
        syncTitles();
    }
})();


// ==========================================================================
// GROUP HEADER CLEAN 2026
// Remove injected Quick Add/Edit controls and normalize group type labels.
// ==========================================================================
(function initCleanGroupHeaders() {
    const typeLabels = {
        link: 'Links',
        note: 'Notes',
        schedule: 'Schedule',
        kanban: 'Kanban',
        folder: 'Folder',
        image: 'Images'
    };

    function humanizeType(value) {
        const raw = String(value || '').trim();
        if (!raw) return 'Group';
        if (typeLabels[raw]) return typeLabels[raw];
        return raw
            .replace(/[-_]+/g, ' ')
            .replace(/\b\w/g, ch => ch.toUpperCase());
    }

    function cleanGroupHeaders() {
        document.querySelectorAll('#groupsContainer .group-card').forEach(card => {
            // Remove the two hover controls injected by the previous workspace enhancement.
            card.querySelectorAll('.desktop-hover-tools').forEach(el => el.remove());

            // Keep and normalize the type badge instead of allowing "undefined".
            const tag = card.querySelector('.group-header-actions .group-tag');
            if (tag) {
                let type = '';
                for (const cls of tag.classList) {
                    if (cls.startsWith('tag-')) {
                        type = cls.slice(4);
                        break;
                    }
                }

                const current = (tag.textContent || '').trim();
                if (!current || /^undefined$/i.test(current) || /^null$/i.test(current)) {
                    tag.textContent = humanizeType(type);
                }
            }
        });
    }

    // Run after all previous render wrappers so injected controls are removed every time.
    if (typeof renderDashboard === 'function') {
        const previousRenderDashboardClean = renderDashboard;
        renderDashboard = function() {
            const result = previousRenderDashboardClean.apply(this, arguments);
            requestAnimationFrame(cleanGroupHeaders);
            return result;
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            requestAnimationFrame(cleanGroupHeaders);
        }, { once: true });
    } else {
        requestAnimationFrame(cleanGroupHeaders);
    }
})();

// ==========================================================================
// AUTO DRIVE SAVE V1
// Drive là nguồn dữ liệu chính sau khi đăng nhập.
// - Không hỏi Keep / Download khi đăng nhập.
// - Có file trên Drive: luôn tải file Drive xuống trước.
// - Chưa có file trên Drive: tạo file từ dữ liệu local hiện tại.
// - Mọi saveData()/Trash/Backup/Past milestone sẽ tự lưu Drive theo debounce.
// - Có hydration gate để local không ghi đè Drive trước khi tải cloud xong.
// ==========================================================================
let __driveAutoSaveTimer = null;
let __driveWriteInFlight = false;
let __driveWritePending = false;
let __driveAutoSyncReady = false;
let __driveHydrationPromise = null;
let __driveHydratedToken = '';
let __driveLastSavedSnapshot = '';

function __getDriveAccessToken() {
    return gapiInited ? (gapi.client.getToken()?.access_token || '') : '';
}

function __buildDriveComparableSnapshot() {
    const payload = buildDrivePayload();
    // updatedAt thay đổi ở mỗi lần build nên bỏ field này khi so sánh.
    const comparable = { ...payload };
    delete comparable.updatedAt;
    return JSON.stringify(comparable);
}

async function __performGoogleDriveWrite({ force = false } = {}) {
    if (!gapiInited || !gisInited || !gapi.client.getToken() || !__driveAutoSyncReady) return null;

    const snapshot = __buildDriveComparableSnapshot();
    if (!force && snapshot === __driveLastSavedSnapshot) return true;

    if (__driveWriteInFlight) {
        __driveWritePending = true;
        return true;
    }

    __driveWriteInFlight = true;
    try {
        if (!googleFileId) {
            const res = await gapi.client.drive.files.list({
                q: "name = 'workspace_data.json'",
                spaces: 'appDataFolder',
                fields: 'files(id, name)'
            });
            if (res.result.files?.length > 0) googleFileId = res.result.files[0].id;
        }

        const localData = JSON.stringify(buildDrivePayload());

        if (googleFileId) {
            await gapi.client.request({
                path: `/upload/drive/v3/files/${googleFileId}`,
                method: 'PATCH',
                params: { uploadType: 'media' },
                body: localData
            });
        } else {
            const metadata = { name: 'workspace_data.json', parents: ['appDataFolder'] };
            const boundary = '314159265358979323846';
            const body =
                `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}` +
                `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${localData}` +
                `\r\n--${boundary}--`;

            googleFileId = (await gapi.client.request({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: { uploadType: 'multipart' },
                headers: { 'Content-Type': `multipart/related; boundary="${boundary}"` },
                body
            })).result.id;
        }

        __driveLastSavedSnapshot = snapshot;
        return true;
    } catch (error) {
        console.error('Automatic Google Drive save failed:', error);
        return false;
    } finally {
        __driveWriteInFlight = false;
        if (__driveWritePending) {
            __driveWritePending = false;
            clearTimeout(__driveAutoSaveTimer);
            __driveAutoSaveTimer = setTimeout(() => __performGoogleDriveWrite(), 350);
        }
    }
}

function queueGoogleDriveAutoSave(delay = 850) {
    if (!__driveAutoSyncReady || !gapiInited || !gisInited || !gapi.client.getToken()) return;
    clearTimeout(__driveAutoSaveTimer);
    __driveAutoSaveTimer = setTimeout(() => __performGoogleDriveWrite(), delay);
}

// Giữ tên hàm cũ để các đoạn code hiện tại vẫn hoạt động,
// nhưng silent sync giờ được debounce thay vì PATCH Drive ngay lập tức.
syncToGoogleDrive = async function(isSilent = false) {
    if (!gapiInited || !gapi.client.getToken()) {
        if (!isSilent) alert('Google is not connected!');
        return null;
    }

    if (isSilent) {
        queueGoogleDriveAutoSave();
        return true;
    }

    // Không còn nút Sync trong UI, nhưng giữ manual API tương thích nếu code khác gọi tới.
    return __performGoogleDriveWrite({ force: true });
};

// Sau đăng nhập: Drive thắng local. Không còn hộp thoại "Keep / Download".
fetchFileFromGoogleDrive = async function() {
    const token = __getDriveAccessToken();
    if (!token) return null;

    // Nếu cùng token đang hydrate thì dùng chung promise, tránh gọi Drive trùng.
    if (__driveHydrationPromise && __driveHydratedToken === token) {
        return __driveHydrationPromise;
    }

    __driveHydratedToken = token;
    __driveAutoSyncReady = false;

    __driveHydrationPromise = (async () => {
        try {
            const response = await gapi.client.drive.files.list({
                q: "name = 'workspace_data.json'",
                spaces: 'appDataFolder',
                fields: 'files(id, name, modifiedTime)'
            });

            const files = response.result.files || [];

            if (files.length > 0) {
                googleFileId = files[0].id;
                const cloudData = (
                    await gapi.client.drive.files.get({
                        fileId: googleFileId,
                        alt: 'media'
                    })
                ).result;

                const isValid =
                    Array.isArray(cloudData) ||
                    (cloudData && typeof cloudData === 'object' && Array.isArray(cloudData.dashboardData));

                if (!isValid) {
                    console.error('workspace_data.json has an unsupported format. Auto-save remains disabled to protect cloud data.');
                    return false;
                }

                // Giữ trạng thái Collapse/Expand hiện tại trước khi Drive ghi dữ liệu xuống
                const collapsedState = new Map(
                    state.dashboardData.map(group => [
                        String(group.id),
                        Boolean(group.collapsed)
                    ])
                );

                applyDrivePayload(cloudData);

                // Khôi phục lại trạng thái Collapse/Expand vừa thao tác
                state.dashboardData.forEach(group => {
                    const id = String(group.id);

                    if (collapsedState.has(id)) {
                        group.collapsed = collapsedState.get(id);
                    }

                    if (group.pinKey) group.isLocked = true;
                });

                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));

                renderDashboard();
                updateScheduleUI();
                renderBackupModal?.();
                renderTrashModal?.();

                __driveLastSavedSnapshot = __buildDriveComparableSnapshot();
                __driveAutoSyncReady = true;

                console.info('Google Drive data loaded. Automatic saving is active.');
                return true;
            }

            // Tài khoản chưa có dữ liệu Drive: local hiện tại trở thành dữ liệu khởi tạo.
            googleFileId = null;
            __driveAutoSyncReady = true;
            __driveLastSavedSnapshot = '';
            await __performGoogleDriveWrite({ force: true });

            console.info('Created workspace_data.json on Google Drive. Automatic saving is active.');
            return true;
        } catch (error) {
            __driveAutoSyncReady = false;
            console.error('Initial Google Drive load failed. Auto-save is paused to avoid overwriting cloud data:', error);
            return false;
        } finally {
            __driveHydrationPromise = null;
        }
    })();

    return __driveHydrationPromise;
};

// Khi token cũ được khôi phục sau F5, tự hydrate Drive.
// Code gốc chỉ restore token + profile, chưa tải workspace_data.json.
const __autoDriveOriginalCheckAuthStates = checkAuthStates;
checkAuthStates = function() {
    const result = __autoDriveOriginalCheckAuthStates.apply(this, arguments);

    if (gapiInited && gisInited && gapi.client.getToken() && hasRequiredGoogleScopes()) {
        const token = __getDriveAccessToken();

        if (token && (__driveHydratedToken !== token || !__driveAutoSyncReady)) {
            Promise.resolve(fetchGoogleAccountProfile())
                .then(() => {
                    if (!currentAccountAccess.blocked && !currentAccountAccess.sessionRevoked) {
                        return fetchFileFromGoogleDrive();
                    }
                })
                .catch(error => console.warn('Automatic Drive initialization failed:', error));
        }
    }

    return result;
};

// Reset gate khi logout / đổi tài khoản.
const __autoDriveOriginalDisconnect = disconnectGoogleAccount;
disconnectGoogleAccount = function(options) {
    __driveAutoSyncReady = false;
    __driveHydrationPromise = null;
    __driveHydratedToken = '';
    __driveLastSavedSnapshot = '';
    clearTimeout(__driveAutoSaveTimer);
    return __autoDriveOriginalDisconnect.call(this, options);
};

const __autoDriveOriginalSwitch = switchGoogleAccount;
switchGoogleAccount = function() {
    __driveAutoSyncReady = false;
    __driveHydrationPromise = null;
    __driveHydratedToken = '';
    __driveLastSavedSnapshot = '';
    clearTimeout(__driveAutoSaveTimer);
    return __autoDriveOriginalSwitch.apply(this, arguments);
};

// Nút Sync đã bị xóa khỏi HTML. Nếu HTML cũ còn cache thì luôn ẩn nó.
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-sync-google')?.remove();
});
// ============================================================================
// AUTO DRIVE SAVE V2
// Stable cloud workspace layer:
// - Drive is the source of truth after sign-in
// - Visible save status
// - Debounced/dirty auto-save
// - Offline queue + reconnect sync
// - Best-effort flush on tab hide/page close
// - Multi-tab/device conflict detection + safe group-level merge
// - Daily snapshots + conflict rescue backups
// - Lightweight cloud polling while the page is visible
// - Compact account toolbar + richer account sync information
// ============================================================================

(function initAutoDriveSaveV2() {
    if (window.__AUTO_DRIVE_SAVE_V2_READY__) return;
    window.__AUTO_DRIVE_SAVE_V2_READY__ = true;

    const DAILY_KEEP = 7;
    const NORMAL_BACKUP_KEEP = 10;
    const DRIVE_POLL_MS = 30000;
    const SAVE_DEBOUNCE_MS = 900;
    const CONFLICT_BACKUP_PREFIX = 'Conflict rescue';
    const DAILY_BACKUP_PREFIX = 'Daily snapshot';

    let knownModifiedTime = '';
    let baseCloudUpdatedAt = 0;
    let baseCloudPayload = null;
    let lastSavedAt = 0;
    let dirty = false;
    let pollTimer = null;
    let statusResetTimer = null;
    let localChangeVersion = 0;
    let lastCommittedLocalVersion = 0;
    let channel = null;

    function deepClone(value) {
        try { return structuredClone(value); }
        catch (_) {
            try { return JSON.parse(JSON.stringify(value)); }
            catch (_) { return value; }
        }
    }

    function payloadComparable(payload) {
        if (!payload || typeof payload !== 'object') return JSON.stringify(payload ?? null);
        const copy = deepClone(payload);
        if (copy && typeof copy === 'object') delete copy.updatedAt;
        return JSON.stringify(copy);
    }

    function currentPayloadComparable() {
        try { return payloadComparable(buildDrivePayload()); }
        catch (e) {
            console.warn('Could not build comparable Drive payload:', e);
            return '';
        }
    }

    function formatClock(ts) {
        if (!ts) return '—';
        try {
            return new Intl.DateTimeFormat(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(new Date(ts));
        } catch (_) {
            return new Date(ts).toLocaleTimeString();
        }
    }

    function injectStyles() {
        if (document.getElementById('autoDriveV2Styles')) return;
        const style = document.createElement('style');
        style.id = 'autoDriveV2Styles';
        style.textContent = `
            #driveAutoSaveIndicator{
                position:fixed;right:18px;bottom:18px;z-index:12000;
                display:flex;align-items:center;gap:8px;
                min-height:34px;padding:7px 11px;border-radius:999px;
                border:1px solid color-mix(in srgb, currentColor 16%, transparent);
                background:color-mix(in srgb, var(--bg-primary, #fff) 92%, transparent);
                color:var(--text-primary, #1f2937);
                box-shadow:0 8px 26px rgba(0,0,0,.12);
                backdrop-filter:blur(12px);
                font-size:12px;font-weight:700;line-height:1;
                opacity:.94;transition:.18s ease;
                pointer-events:none;
            }
            #driveAutoSaveIndicator[data-state="saved"]{opacity:.72}
            #driveAutoSaveIndicator[data-state="saving"] .drive-save-dot{animation:driveSavePulse .8s infinite alternate}
            #driveAutoSaveIndicator[data-state="offline"] .drive-save-dot,
            #driveAutoSaveIndicator[data-state="error"] .drive-save-dot{opacity:.9}
            .drive-save-dot{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.65}
            @keyframes driveSavePulse{from{transform:scale(.75);opacity:.35}to{transform:scale(1.2);opacity:1}}
            .account-toolbar-btn.account-connected-v2{
                display:inline-flex;align-items:center;gap:8px;max-width:210px;
            }
            .account-toolbar-avatar-v2{
                width:24px;height:24px;border-radius:50%;object-fit:cover;flex:0 0 24px;
                border:1px solid color-mix(in srgb, currentColor 16%, transparent);
            }
            .account-toolbar-initial-v2{
                width:24px;height:24px;border-radius:50%;display:inline-grid;place-items:center;
                font-size:11px;font-weight:800;
                background:color-mix(in srgb, currentColor 10%, transparent);
                flex:0 0 24px;
            }
            .account-toolbar-name-v2{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
            .account-sync-detail-v2 small{display:block;margin-top:3px;opacity:.7;font-weight:600}
            @media (max-width:768px){
                #driveAutoSaveIndicator{right:10px;bottom:10px;max-width:calc(100vw - 20px)}
                .account-toolbar-name-v2{max-width:90px}
            }
        `;
        document.head.appendChild(style);
    }

    function ensureStatusIndicator() {
        injectStyles();
        let el = document.getElementById('driveAutoSaveIndicator');
        if (!el) {
            el = document.createElement('div');
            el.id = 'driveAutoSaveIndicator';
            el.dataset.state = 'idle';
            el.innerHTML = `<span class="drive-save-dot"></span><span id="driveAutoSaveIndicatorText">Local cache ready</span>`;
            document.body.appendChild(el);
        }
        return el;
    }

    function updateAccountSyncDetails() {
        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();
        const driveStatus = document.getElementById('accountDriveStatus');
        if (driveStatus) {
            if (!connected) driveStatus.textContent = 'Not connected';
            else if (!navigator.onLine) driveStatus.textContent = 'Offline · queued locally';
            else if (__driveAutoSyncReady) driveStatus.textContent = 'Auto-save active';
            else driveStatus.textContent = 'Connecting…';
        }

        const grid = document.querySelector('#accountModal .account-info-grid');
        if (grid) {
            let lastSavedItem = document.getElementById('accountLastSavedItemV2');
            if (!lastSavedItem) {
                lastSavedItem = document.createElement('div');
                lastSavedItem.className = 'account-info-item account-sync-detail-v2';
                lastSavedItem.id = 'accountLastSavedItemV2';
                lastSavedItem.innerHTML = `<span>✅ Last saved</span><strong id="accountLastSavedStatusV2">—</strong><small>Automatic Google Drive save</small>`;
                grid.appendChild(lastSavedItem);
            }
            const last = document.getElementById('accountLastSavedStatusV2');
            if (last) last.textContent = lastSavedAt ? formatClock(lastSavedAt) : (dirty ? 'Pending' : '—');

            let storageItem = document.getElementById('accountStorageModeItemV2');
            if (!storageItem) {
                storageItem = document.createElement('div');
                storageItem.className = 'account-info-item account-sync-detail-v2';
                storageItem.id = 'accountStorageModeItemV2';
                storageItem.innerHTML = `<span>💾 Storage mode</span><strong>Drive primary</strong><small>localStorage = offline cache</small>`;
                grid.appendChild(storageItem);
            }
        }

        const toolbarBtn = document.getElementById('btn-login-google');
        if (toolbarBtn && connected) {
            const profile = typeof googleAccountProfile !== 'undefined' ? googleAccountProfile : null;
            const label = profile?.name || profile?.email || 'Google';
            toolbarBtn.classList.add('account-connected-v2');
            if (profile?.picture) {
                toolbarBtn.innerHTML = `<img class="account-toolbar-avatar-v2" alt="" src="${escapeHTML(profile.picture)}"><span class="account-toolbar-name-v2">${escapeHTML(label)}</span>`;
            } else {
                const initial = (label || 'G').trim().charAt(0).toUpperCase();
                toolbarBtn.innerHTML = `<span class="account-toolbar-initial-v2">${escapeHTML(initial)}</span><span class="account-toolbar-name-v2">${escapeHTML(label)}</span>`;
            }
        } else if (toolbarBtn) {
            toolbarBtn.classList.remove('account-connected-v2');
        }
    }

    function setSaveStatus(stateName, text, {sticky = false} = {}) {
        const el = ensureStatusIndicator();
        el.dataset.state = stateName;
        const textEl = document.getElementById('driveAutoSaveIndicatorText');
        if (textEl) textEl.textContent = text;
        clearTimeout(statusResetTimer);

        if (!sticky && ['saved', 'merged'].includes(stateName)) {
            statusResetTimer = setTimeout(() => {
                if (!navigator.onLine) {
                    setSaveStatus('offline', 'Offline · changes stay on this device', {sticky:true});
                } else if (__driveAutoSyncReady) {
                    const target = document.getElementById('driveAutoSaveIndicator');
                    const targetText = document.getElementById('driveAutoSaveIndicatorText');
                    if (target) target.dataset.state = 'saved';
                    if (targetText) targetText.textContent = lastSavedAt
                        ? `Saved to Drive ✓ · ${formatClock(lastSavedAt)}`
                        : 'Auto-save active ✓';
                }
            }, 2600);
        }
        updateAccountSyncDetails();
    }

    function markDirty(scope = 'workspace') {
        dirty = true;
        localChangeVersion += 1;
        window.__workspaceDirtyScopesV2 = window.__workspaceDirtyScopesV2 || new Set();
        window.__workspaceDirtyScopesV2.add(scope);

        if (!navigator.onLine) {
            setSaveStatus('offline', 'Offline · changes saved locally', {sticky:true});
        } else if (__driveAutoSyncReady) {
            setSaveStatus('saving', 'Changes queued…', {sticky:true});
        }
    }

    window.persistWorkspaceChange = function(scope = 'workspace') {
        markDirty(scope);
        queueGoogleDriveAutoSave(SAVE_DEBOUNCE_MS);
    };

    function backupKeyForItem(item) {
        return String(item?.id || item?.deletedAt || item?.at || item?.key || JSON.stringify(item));
    }

    function unionByStableKey(remoteItems, localItems) {
        const out = [];
        const seen = new Set();
        [...(remoteItems || []), ...(localItems || [])].forEach(item => {
            const key = backupKeyForItem(item);
            if (seen.has(key)) return;
            seen.add(key);
            out.push(item);
        });
        return out;
    }

    function groupMap(items) {
        const map = new Map();
        (items || []).forEach((g, index) => map.set(String(g?.id ?? `__index_${index}`), g));
        return map;
    }

    function jsonEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    function makeConflictGroup(localGroup) {
        const copy = deepClone(localGroup);
        copy.id = `group_conflict_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        copy.title = `${copy.title || 'Untitled group'} (Local conflict copy)`;
        copy.isLocked = false;
        copy.pinKey = '';
        return copy;
    }

    function mergeDashboardData(baseGroups, remoteGroups, localGroups) {
        const base = groupMap(baseGroups);
        const remote = groupMap(remoteGroups);
        const local = groupMap(localGroups);
        const allKeys = new Set([...base.keys(), ...remote.keys(), ...local.keys()]);
        const merged = [];

        allKeys.forEach(key => {
            const b = base.get(key);
            const r = remote.get(key);
            const l = local.get(key);

            // Newly created on only one side.
            if (!b) {
                if (r && l) {
                    if (jsonEqual(r, l)) merged.push(r);
                    else {
                        merged.push(r);
                        merged.push(makeConflictGroup(l));
                    }
                } else if (r) merged.push(r);
                else if (l) merged.push(l);
                return;
            }

            // Deleted on both sides.
            if (!r && !l) return;

            const remoteChanged = !jsonEqual(r, b);
            const localChanged = !jsonEqual(l, b);

            // Remote deleted it. Keep local only when local was also edited.
            if (!r) {
                if (localChanged && l) merged.push(makeConflictGroup(l));
                return;
            }

            // Local deleted it. Preserve remote only if remote was edited too.
            if (!l) {
                if (remoteChanged) merged.push(r);
                return;
            }

            if (!remoteChanged && localChanged) {
                merged.push(l);
            } else if (remoteChanged && !localChanged) {
                merged.push(r);
            } else if (!remoteChanged && !localChanged) {
                merged.push(r);
            } else if (jsonEqual(r, l)) {
                merged.push(r);
            } else {
                // Both devices changed the same group differently:
                // cloud version stays canonical and the local version is kept as a clearly named copy.
                merged.push(r);
                merged.push(makeConflictGroup(l));
            }
        });

        return merged;
    }

    function mergeConflictingPayload(remotePayload, localPayload) {
        const base = baseCloudPayload || {};
        const merged = {
            ...deepClone(remotePayload),
            ...deepClone(localPayload),
            dashboardData: mergeDashboardData(
                base.dashboardData || [],
                remotePayload?.dashboardData || [],
                localPayload?.dashboardData || []
            ),
            trashItems: unionByStableKey(remotePayload?.trashItems, localPayload?.trashItems),
            backups: unionByStableKey(remotePayload?.backups, localPayload?.backups),
            updatedAt: Date.now()
        };

        if (Array.isArray(remotePayload?.pastSchedules) || Array.isArray(localPayload?.pastSchedules)) {
            merged.pastSchedules = unionByStableKey(remotePayload?.pastSchedules, localPayload?.pastSchedules);
        }

        return merged;
    }

    function writeConflictRescueBackup(reason = 'Remote data changed on another device') {
        try {
            const backups = readBackups();
            const snapshot = JSON.stringify(state.dashboardData);
            backups.unshift({
                id: 'bk_conflict_' + Date.now(),
                reason: `${CONFLICT_BACKUP_PREFIX} · ${reason}`,
                at: Date.now(),
                snapshot
            });
            writeBackups(backups);
        } catch (e) {
            console.warn('Could not create conflict rescue backup:', e);
        }
    }

    function todayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }

    function ensureDailySnapshot() {
        try {
            const key = todayKey();
            const backups = readBackups();
            if (backups.some(b => String(b.reason || '').startsWith(`${DAILY_BACKUP_PREFIX} ${key}`))) return;
            const snapshot = JSON.stringify(state.dashboardData);
            backups.unshift({
                id: 'bk_daily_' + Date.now(),
                reason: `${DAILY_BACKUP_PREFIX} ${key}`,
                at: Date.now(),
                snapshot
            });
            writeBackups(backups);
        } catch (e) {
            console.warn('Daily snapshot could not be created:', e);
        }
    }

    // Keep 7 daily snapshots plus the 10 newest ordinary backups.
    // Pinned backups are always retained.
    const originalWriteBackupsV2 = writeBackups;
    writeBackups = function(items) {
        const normalized = Array.isArray(items) ? items : [];
        const pinned = normalized.filter(x => x?.pinned === true);
        const daily = normalized.filter(x => x?.pinned !== true && String(x?.reason || '').startsWith(DAILY_BACKUP_PREFIX)).slice(0, DAILY_KEEP);
        const normal = normalized.filter(x => x?.pinned !== true && !String(x?.reason || '').startsWith(DAILY_BACKUP_PREFIX)).slice(0, NORMAL_BACKUP_KEEP);
        const merged = [];
        const seen = new Set();
        [...pinned, ...daily, ...normal].forEach(item => {
            const key = backupKeyForItem(item);
            if (seen.has(key)) return;
            seen.add(key);
            merged.push(item);
        });
        // Bypass the old slice(0, 10) cap while preserving the same storage key + sync hook.
        writeJSONStore(BACKUP_KEY, merged);
    };

    async function getRemoteMetadata() {
        if (!googleFileId) return null;
        try {
            const res = await gapi.client.drive.files.get({
                fileId: googleFileId,
                fields: 'id,modifiedTime'
            });
            return res.result || null;
        } catch (e) {
            if (e?.status === 404) {
                googleFileId = null;
                knownModifiedTime = '';
                return null;
            }
            throw e;
        }
    }

    async function getRemotePayload() {
        if (!googleFileId) return null;
        const result = await gapi.client.drive.files.get({
            fileId: googleFileId,
            alt: 'media'
        });
        return result.result;
    }

    async function updateKnownMetadata() {
        const meta = await getRemoteMetadata();
        knownModifiedTime = meta?.modifiedTime || '';
        return meta;
    }

    function applyPayloadToUI(payload) {
        applyDrivePayload(payload);

        state.dashboardData.forEach(group => {
            if (group.pinKey) group.isLocked = true;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));

        try { renderDashboard(); } catch (_) {}
        try { updateScheduleUI(); } catch (_) {}
        try { renderBackupModal?.(); } catch (_) {}
        try { renderTrashModal?.(); } catch (_) {}
        try { renderPastScheduleList?.(); } catch (_) {}
    }

    async function findWorkspaceFile() {
        const response = await gapi.client.drive.files.list({
            q: "name = 'workspace_data.json'",
            spaces: 'appDataFolder',
            fields: 'files(id,name,modifiedTime)',
            orderBy: 'modifiedTime desc'
        });
        const files = response.result.files || [];
        if (!files.length) return null;
        googleFileId = files[0].id;
        knownModifiedTime = files[0].modifiedTime || '';
        return files[0];
    }

    async function createWorkspaceFile(payload) {
        const metadata = { name: 'workspace_data.json', parents: ['appDataFolder'] };
        const boundary = '314159265358979323846';
        const data = JSON.stringify(payload);
        const body =
            `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}` +
            `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${data}` +
            `\r\n--${boundary}--`;

        const response = await gapi.client.request({
            path: '/upload/drive/v3/files',
            method: 'POST',
            params: { uploadType: 'multipart', fields: 'id,modifiedTime' },
            headers: { 'Content-Type': `multipart/related; boundary="${boundary}"` },
            body
        });

        googleFileId = response.result.id;
        knownModifiedTime = response.result.modifiedTime || '';
    }

    async function patchWorkspaceFile(payload) {
        const response = await gapi.client.request({
            path: `/upload/drive/v3/files/${googleFileId}`,
            method: 'PATCH',
            params: { uploadType: 'media', fields: 'id,modifiedTime' },
            body: JSON.stringify(payload)
        });

        if (response?.result?.modifiedTime) knownModifiedTime = response.result.modifiedTime;
        else await updateKnownMetadata();
    }

    async function performWriteV2({force = false} = {}) {
        if (!gapiInited || !gisInited || !gapi.client.getToken() || !__driveAutoSyncReady) return null;

        if (!navigator.onLine) {
            __driveWritePending = true;
            markDirty('offline');
            setSaveStatus('offline', 'Offline · changes saved locally', {sticky:true});
            return false;
        }

        const localVersionAtStart = localChangeVersion;
        const localPayload = buildDrivePayload();
        const localComparable = payloadComparable(localPayload);

        if (!force && !dirty && localComparable === __driveLastSavedSnapshot) {
            setSaveStatus('saved', lastSavedAt ? `Saved to Drive ✓ · ${formatClock(lastSavedAt)}` : 'Auto-save active ✓');
            return true;
        }

        if (__driveWriteInFlight) {
            __driveWritePending = true;
            return true;
        }

        __driveWriteInFlight = true;
        setSaveStatus('saving', 'Saving to Drive…', {sticky:true});

        try {
            ensureDailySnapshot();

            if (!googleFileId) await findWorkspaceFile();

            let payloadToWrite = buildDrivePayload();

            if (googleFileId) {
                // Cheap metadata check first. Only download the remote JSON if the file
                // changed since this tab last loaded/saved it.
                const remoteMeta = await getRemoteMetadata();

                if (remoteMeta?.modifiedTime && knownModifiedTime && remoteMeta.modifiedTime !== knownModifiedTime) {
                    const remotePayload = await getRemotePayload();
                    const remoteComparable = payloadComparable(remotePayload);
                    const baseComparable = payloadComparable(baseCloudPayload);
                    const localNow = buildDrivePayload();
                    const localNowComparable = payloadComparable(localNow);
                    const remoteChangedFromBase = remoteComparable !== baseComparable;
                    const localChangedFromBase = localNowComparable !== baseComparable;

                    if (remoteChangedFromBase) {
                        if (localChangedFromBase) {
                            writeConflictRescueBackup();
                            payloadToWrite = mergeConflictingPayload(remotePayload, localNow);
                            applyPayloadToUI(payloadToWrite);
                            setSaveStatus('merged', 'Changes from another device merged safely…', {sticky:true});
                        } else {
                            // Nothing local to protect; just adopt the newer cloud copy.
                            applyPayloadToUI(remotePayload);
                            baseCloudPayload = deepClone(remotePayload);
                            baseCloudUpdatedAt = Number(remotePayload?.updatedAt || 0);
                            __driveLastSavedSnapshot = remoteComparable;
                            knownModifiedTime = remoteMeta.modifiedTime;
                            dirty = false;
                            lastCommittedLocalVersion = localChangeVersion;
                            lastSavedAt = Date.now();
                            setSaveStatus('saved', 'Updated from Drive ✓');
                            broadcast({type:'cloud-loaded', modifiedTime:knownModifiedTime});
                            return true;
                        }
                    }
                }
            }

            payloadToWrite.updatedAt = Date.now();

            if (googleFileId) await patchWorkspaceFile(payloadToWrite);
            else await createWorkspaceFile(payloadToWrite);

            baseCloudPayload = deepClone(payloadToWrite);
            baseCloudUpdatedAt = Number(payloadToWrite.updatedAt || 0);
            __driveLastSavedSnapshot = payloadComparable(payloadToWrite);
            lastSavedAt = Date.now();
            lastCommittedLocalVersion = localVersionAtStart;

            // If more edits arrived while the request was running, keep dirty=true.
            dirty = localChangeVersion !== localVersionAtStart;
            if (!dirty) {
                window.__workspaceDirtyScopesV2?.clear?.();
            }

            setSaveStatus('saved', `Saved to Drive ✓ · ${formatClock(lastSavedAt)}`);
            broadcast({type:'saved', modifiedTime:knownModifiedTime, updatedAt:baseCloudUpdatedAt});

            return true;
        } catch (error) {
            console.error('Auto Drive V2 save failed:', error);
            dirty = true;

            if (!navigator.onLine || error?.status === 0) {
                setSaveStatus('offline', 'Offline · changes saved locally', {sticky:true});
            } else if (error?.status === 401 || error?.status === 403) {
                __driveAutoSyncReady = false;
                setSaveStatus('error', 'Drive permission expired · reconnect Google', {sticky:true});
            } else {
                setSaveStatus('error', 'Drive save failed · local copy is safe', {sticky:true});
            }
            return false;
        } finally {
            __driveWriteInFlight = false;

            if (__driveWritePending || dirty) {
                __driveWritePending = false;
                clearTimeout(__driveAutoSaveTimer);
                if (navigator.onLine && __driveAutoSyncReady) {
                    __driveAutoSaveTimer = setTimeout(() => performWriteV2(), 450);
                }
            }
        }
    }

    // Replace V1's queue with a centralized dirty/debounce queue.
    queueGoogleDriveAutoSave = function(delay = SAVE_DEBOUNCE_MS) {
        markDirty('workspace');
        if (!__driveAutoSyncReady || !gapiInited || !gisInited || !gapi.client.getToken()) return;
        if (!navigator.onLine) return;

        clearTimeout(__driveAutoSaveTimer);
        __driveAutoSaveTimer = setTimeout(() => performWriteV2(), Math.max(0, delay));
    };

    syncToGoogleDrive = async function(isSilent = false) {
        if (!gapiInited || !gapi.client.getToken()) {
            if (!isSilent) alert('Google is not connected!');
            return null;
        }

        if (isSilent) {
            queueGoogleDriveAutoSave();
            return true;
        }

        markDirty('manual');
        return performWriteV2({force:true});
    };

    fetchFileFromGoogleDrive = async function({forceReload = false} = {}) {
        const token = typeof __getDriveAccessToken === 'function'
            ? __getDriveAccessToken()
            : gapi?.client?.getToken?.()?.access_token;

        if (!token) return null;

        if (__driveHydrationPromise && __driveHydratedToken === token && !forceReload) {
            return __driveHydrationPromise;
        }

        __driveHydratedToken = token;
        __driveAutoSyncReady = false;
        setSaveStatus('saving', 'Loading workspace from Drive…', {sticky:true});

        __driveHydrationPromise = (async () => {
            try {
                if (!navigator.onLine) {
                    dirty = currentPayloadComparable() !== __driveLastSavedSnapshot;
                    setSaveStatus('offline', 'Offline · using local cache', {sticky:true});
                    return false;
                }

                const file = await findWorkspaceFile();

                if (file) {
                    const cloudData = await getRemotePayload();
                    const valid =
                        Array.isArray(cloudData) ||
                        (cloudData && typeof cloudData === 'object' && Array.isArray(cloudData.dashboardData));

                    if (!valid) {
                        setSaveStatus('error', 'Drive file format is unsupported', {sticky:true});
                        console.error('workspace_data.json has an unsupported format.');
                        return false;
                    }

                    applyPayloadToUI(cloudData);

                    const normalizedBase = Array.isArray(cloudData)
                        ? {dashboardData: deepClone(cloudData), updatedAt: 0}
                        : deepClone(cloudData);

                    baseCloudPayload = normalizedBase;
                    baseCloudUpdatedAt = Number(normalizedBase.updatedAt || 0);
                    __driveLastSavedSnapshot = payloadComparable(normalizedBase);
                    knownModifiedTime = file.modifiedTime || knownModifiedTime;
                    __driveAutoSyncReady = true;
                    dirty = false;
                    lastCommittedLocalVersion = localChangeVersion;
                    lastSavedAt = Date.now();

                    setSaveStatus('saved', 'Loaded from Drive ✓');
                    startCloudPolling();
                    broadcast({type:'cloud-loaded', modifiedTime:knownModifiedTime});
                    return true;
                }

                // First use on this Google account: initialize Drive from the local cache.
                googleFileId = null;
                baseCloudPayload = null;
                baseCloudUpdatedAt = 0;
                knownModifiedTime = '';
                __driveAutoSyncReady = true;
                dirty = true;
                ensureDailySnapshot();
                const created = await performWriteV2({force:true});
                startCloudPolling();
                return created;
            } catch (error) {
                console.error('Initial Drive hydration failed:', error);
                __driveAutoSyncReady = false;

                if (!navigator.onLine || error?.status === 0) {
                    setSaveStatus('offline', 'Offline · using local cache', {sticky:true});
                } else {
                    setSaveStatus('error', 'Could not load Drive · local cache protected', {sticky:true});
                }
                return false;
            } finally {
                __driveHydrationPromise = null;
                updateAccountSyncDetails();
            }
        })();

        return __driveHydrationPromise;
    };

    async function checkRemoteForChanges() {
        if (!navigator.onLine || document.visibilityState !== 'visible') return;
        if (!__driveAutoSyncReady || !googleFileId || __driveWriteInFlight) return;
        if (!gapiInited || !gapi.client.getToken()) return;

        try {
            const meta = await getRemoteMetadata();
            if (!meta?.modifiedTime || !knownModifiedTime || meta.modifiedTime === knownModifiedTime) return;

            if (dirty) {
                // Let the normal writer perform conflict-aware merge.
                queueGoogleDriveAutoSave(120);
                return;
            }

            setSaveStatus('saving', 'Newer Drive data found…', {sticky:true});
            const remote = await getRemotePayload();
            applyPayloadToUI(remote);
            baseCloudPayload = deepClone(remote);
            baseCloudUpdatedAt = Number(remote?.updatedAt || 0);
            __driveLastSavedSnapshot = payloadComparable(remote);
            knownModifiedTime = meta.modifiedTime;
            lastSavedAt = Date.now();
            setSaveStatus('saved', 'Updated from another device ✓');
        } catch (e) {
            console.warn('Drive background refresh skipped:', e);
        }
    }

    function startCloudPolling() {
        clearInterval(pollTimer);
        pollTimer = setInterval(checkRemoteForChanges, DRIVE_POLL_MS);
    }

    function stopCloudPolling() {
        clearInterval(pollTimer);
        pollTimer = null;
    }

    function broadcast(message) {
        try {
            channel?.postMessage?.({...message, source: window.name || 'tab', at: Date.now()});
        } catch (_) {}
    }

    try {
        if ('BroadcastChannel' in window) {
            channel = new BroadcastChannel('workspace-drive-sync-v2');
            channel.onmessage = event => {
                const msg = event.data || {};
                if (!['saved', 'cloud-loaded'].includes(msg.type)) return;
                if (document.visibilityState !== 'visible') return;

                if (dirty) {
                    queueGoogleDriveAutoSave(150);
                } else {
                    checkRemoteForChanges();
                }
            };
        }
    } catch (_) {}

    window.addEventListener('online', () => {
        setSaveStatus('saving', dirty ? 'Back online · syncing changes…' : 'Back online · checking Drive…', {sticky:true});
        if (gapiInited && gisInited && gapi.client.getToken()) {
            if (__driveAutoSyncReady) {
                if (dirty) performWriteV2({force:true});
                else checkRemoteForChanges();
            } else {
                fetchFileFromGoogleDrive();
            }
        }
    });

    window.addEventListener('offline', () => {
        setSaveStatus('offline', 'Offline · changes saved locally', {sticky:true});
    });

    // Best effort: local changes are already persisted synchronously by the app.
    // When the tab becomes hidden, start the Drive write immediately instead of waiting
    // for the debounce timer.
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            clearTimeout(__driveAutoSaveTimer);
            if (dirty && navigator.onLine && __driveAutoSyncReady) {
                performWriteV2({force:true});
            }
        } else {
            checkRemoteForChanges();
        }
    });

    window.addEventListener('pagehide', () => {
        clearTimeout(__driveAutoSaveTimer);
        if (dirty && navigator.onLine && __driveAutoSyncReady) {
            performWriteV2({force:true});
        }
    });

    // Backup before importing a dashboard file.
    importData = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (!Array.isArray(data)) throw new Error('Expected an array');

                createDashboardBackup('Before import');
                state.dashboardData = data;
                saveData();
                setSaveStatus('saving', 'Imported · saving to Drive…', {sticky:true});
            } catch (err) {
                alert('Invalid file!');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    // Extend the existing account UI without changing HTML files.
    const originalUpdateGoogleAccountUIV2 = updateGoogleAccountUI;
    updateGoogleAccountUI = function() {
        const result = originalUpdateGoogleAccountUIV2.apply(this, arguments);

        // The old function may try to show a legacy Sync button. Remove it permanently.
        document.getElementById('btn-sync-google')?.remove();

        updateAccountSyncDetails();
        return result;
    };

    const originalOpenAccountPanelV2 = openAccountPanel;
    openAccountPanel = function() {
        const result = originalOpenAccountPanelV2.apply(this, arguments);
        updateAccountSyncDetails();
        return result;
    };

    // Reset V2 state when switching/signing out.
    const originalDisconnectGoogleV2 = disconnectGoogleAccount;
    disconnectGoogleAccount = function(options) {
        dirty = false;
        knownModifiedTime = '';
        baseCloudUpdatedAt = 0;
        baseCloudPayload = null;
        lastSavedAt = 0;
        stopCloudPolling();
        setSaveStatus('offline', 'Google disconnected · local cache only', {sticky:true});
        return originalDisconnectGoogleV2.call(this, options);
    };

    const originalSwitchGoogleV2 = switchGoogleAccount;
    switchGoogleAccount = function() {
        dirty = false;
        knownModifiedTime = '';
        baseCloudUpdatedAt = 0;
        baseCloudPayload = null;
        lastSavedAt = 0;
        stopCloudPolling();
        return originalSwitchGoogleV2.apply(this, arguments);
    };

    // If any other tab modifies the same localStorage cache, mark this tab dirty.
    window.addEventListener('storage', event => {
        if (![STORAGE_KEY, TRASH_KEY, BACKUP_KEY].includes(event.key)) return;
        markDirty('cross-tab-local');
        queueGoogleDriveAutoSave(250);
    });

    document.addEventListener('DOMContentLoaded', () => {
        ensureStatusIndicator();
        document.getElementById('btn-sync-google')?.remove();
        updateAccountSyncDetails();

        if (!navigator.onLine) {
            setSaveStatus('offline', 'Offline · using local cache', {sticky:true});
        } else if (typeof isGoogleConnected === 'function' && isGoogleConnected()) {
            setSaveStatus('saving', 'Connecting to Drive…', {sticky:true});
        } else {
            setSaveStatus('idle', 'Local cache ready · connect Google for auto-save', {sticky:true});
        }
    });

    window.addEventListener('load', () => {
        ensureDailySnapshot();
        updateAccountSyncDetails();

        // checkAuthStates() already restores the saved OAuth token.
        // This fallback ensures Drive hydration also occurs if the surrounding load order changes.
        setTimeout(() => {
            if (gapiInited && gisInited && gapi.client.getToken() && hasRequiredGoogleScopes()) {
                fetchFileFromGoogleDrive();
            }
        }, 500);
    });

    // Expose a tiny diagnostics surface for troubleshooting from DevTools.
    window.workspaceDriveStatus = function() {
        return {
            connected: typeof isGoogleConnected === 'function' ? isGoogleConnected() : false,
            online: navigator.onLine,
            autoSyncReady: __driveAutoSyncReady,
            dirty,
            googleFileId,
            knownModifiedTime,
            baseCloudUpdatedAt,
            lastSavedAt,
            dirtyScopes: [...(window.__workspaceDirtyScopesV2 || [])]
        };
    };
})();
// ============================================================================
// AUTO DRIVE SAVE V3 — CLEAN STATUS + CUSTOM AVATAR + SILENT SESSION RESTORE
// - Hides the floating save badge completely
// - Keeps Ctrl + K Quick Find untouched
// - Save state remains visible inside Current account
// - Custom account avatar upload / reset to Google avatar
// - Avatar is resized before persistence and follows the Drive workspace
// - Attempts silent Google token renewal on startup when the saved token expired
// ============================================================================

(function initAutoDriveSaveV3() {
    if (window.__AUTO_DRIVE_SAVE_V3_READY__) return;
    window.__AUTO_DRIVE_SAVE_V3_READY__ = true;

    const AVATAR_PREF_VERSION = 1;
    const SILENT_REAUTH_COOLDOWN_MS = 5 * 60 * 1000;
    const SILENT_REAUTH_ATTEMPT_KEY = 'workspace_google_silent_reauth_last_attempt_v1';

    function currentAvatarStorageKey() {
        const identity = String(
            googleAccountProfile?.id ||
            googleAccountProfile?.email ||
            'default'
        ).toLowerCase().replace(/[^a-z0-9@._-]/g, '_');

        return `workspace_custom_avatar_v${AVATAR_PREF_VERSION}_${identity}`;
    }

    function getCustomAvatar() {
        try {
            return localStorage.getItem(currentAvatarStorageKey()) || '';
        } catch (_) {
            return '';
        }
    }

    function setCustomAvatar(dataUrl) {
        try {
            const key = currentAvatarStorageKey();
            if (dataUrl) localStorage.setItem(key, dataUrl);
            else localStorage.removeItem(key);
        } catch (e) {
            console.warn('Could not save custom avatar:', e);
        }
    }

    function effectiveAvatar() {
        return getCustomAvatar() || googleAccountProfile?.picture || '';
    }

    function injectV3Styles() {
        if (document.getElementById('autoDriveV3Styles')) return;

        const style = document.createElement('style');
        style.id = 'autoDriveV3Styles';
        style.textContent = `
            /* V2 save badge remains functional internally, but is intentionally invisible. */
            #driveAutoSaveIndicator{
                display:none !important;
            }

            .account-avatar-wrap{
                position:relative;
            }

            .account-avatar-edit-v3{
                position:absolute;
                right:-3px;
                bottom:-3px;
                width:28px;
                height:28px;
                border-radius:50%;
                border:2px solid var(--bg-primary, #fff);
                display:grid;
                place-items:center;
                padding:0;
                cursor:pointer;
                font-size:12px;
                line-height:1;
                background:var(--bg-secondary, #f3f4f6);
                color:var(--text-primary, #111827);
                box-shadow:0 3px 10px rgba(0,0,0,.18);
                transition:.16s ease;
                z-index:3;
            }

            .account-avatar-edit-v3:hover{
                transform:translateY(-1px) scale(1.04);
            }

            .account-avatar-actions-v3{
                display:flex;
                gap:8px;
                flex-wrap:wrap;
                margin-top:12px;
            }

            .account-avatar-actions-v3 button{
                min-height:34px;
            }

            /* Keep avatar actions compact on phones. The Google-photo reset action
               should stay secondary instead of stretching across the modal. */
            @media (max-width: 768px){
                .account-avatar-actions-v3{
                    gap:6px;
                    margin-top:10px;
                    align-items:center;
                }

                #accountAvatarChangeV3,
                #accountAvatarResetV3{
                    flex:0 0 auto !important;
                    width:auto !important;
                    min-width:0 !important;
                    min-height:38px !important;
                    padding:7px 10px !important;
                    margin:0 !important;
                    font-size:12px !important;
                    line-height:1.15 !important;
                    white-space:nowrap !important;
                    border-radius:10px !important;
                }

                #accountAvatarResetV3{
                    max-width:150px !important;
                }

                .account-avatar-note-v3{
                    margin-top:0;
                }
            }

            @media (max-width: 390px){
                #accountAvatarChangeV3,
                #accountAvatarResetV3{
                    min-height:36px !important;
                    padding:6px 8px !important;
                    font-size:11.5px !important;
                }
            }

            .account-avatar-note-v3{
                width:100%;
                margin:2px 0 0;
                font-size:11px;
                opacity:.65;
                line-height:1.45;
            }

            .account-save-state-v3{
                display:inline-flex;
                align-items:center;
                gap:6px;
            }

            .account-save-state-v3::before{
                content:'';
                width:7px;
                height:7px;
                border-radius:50%;
                background:currentColor;
                opacity:.55;
            }
        `;
        document.head.appendChild(style);
    }

    function applyEffectiveAvatarToUI() {
        injectV3Styles();

        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();
        const custom = connected ? getCustomAvatar() : '';
        const avatarUrl = connected ? effectiveAvatar() : '';
        const avatar = document.getElementById('accountAvatar');
        const fallback = document.getElementById('accountAvatarFallback');

        if (avatar && fallback) {
            if (avatarUrl) {
                avatar.src = avatarUrl;
                avatar.style.display = 'block';
                fallback.style.display = 'none';
            } else {
                avatar.removeAttribute('src');
                avatar.style.display = 'none';
                fallback.style.display = 'grid';
                fallback.textContent = connected
                    ? (typeof getAccountInitial === 'function' ? getAccountInitial(googleAccountProfile) : 'G')
                    : '👤';
            }
        }

        const toolbarBtn = document.getElementById('btn-login-google');
        if (toolbarBtn && connected) {
            const label = googleAccountProfile?.name || googleAccountProfile?.email || 'Google';
            if (avatarUrl) {
                toolbarBtn.innerHTML =
                    `<img class="account-toolbar-avatar-v2" alt="" src="${escapeHTML(avatarUrl)}">` +
                    `<span class="account-toolbar-name-v2">${escapeHTML(label)}</span>`;
            }
        }

        const resetBtn = document.getElementById('accountAvatarResetV3');
        if (resetBtn) resetBtn.style.display = custom ? 'inline-flex' : 'none';
    }

    function getCurrentSaveStateText() {
        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();

        if (!connected) return 'Not connected';
        if (!navigator.onLine) return 'Offline · saved locally';
        if (typeof __driveAutoSyncReady !== 'undefined' && !__driveAutoSyncReady) return 'Connecting…';

        // lastSavedAt is created by Auto Drive Save V2.
        if (typeof lastSavedAt !== 'undefined' && lastSavedAt) {
            try {
                return `Saved to Drive ✓ · ${new Intl.DateTimeFormat(undefined, {
                    hour:'2-digit',
                    minute:'2-digit',
                    second:'2-digit'
                }).format(new Date(lastSavedAt))}`;
            } catch (_) {
                return 'Saved to Drive ✓';
            }
        }

        return 'Auto-save active ✓';
    }

    function refreshCurrentAccountSaveState() {
        const driveStatus = document.getElementById('accountDriveStatus');
        if (driveStatus) {
            driveStatus.textContent = getCurrentSaveStateText();
            driveStatus.classList.add('account-save-state-v3');
        }

        const lastSaved = document.getElementById('accountLastSavedStatusV2');
        if (lastSaved && typeof lastSavedAt !== 'undefined') {
            if (lastSavedAt) {
                try {
                    lastSaved.textContent = new Intl.DateTimeFormat(undefined, {
                        hour:'2-digit',
                        minute:'2-digit',
                        second:'2-digit'
                    }).format(new Date(lastSavedAt));
                } catch (_) {
                    lastSaved.textContent = new Date(lastSavedAt).toLocaleTimeString();
                }
            } else {
                lastSaved.textContent = '—';
            }
        }
    }

    async function resizeAvatarFile(file) {
        if (!file || !String(file.type || '').startsWith('image/')) {
            throw new Error('Please choose an image file.');
        }

        if (file.size > 12 * 1024 * 1024) {
            throw new Error('The image is too large. Please choose an image under 12 MB.');
        }

        const objectUrl = URL.createObjectURL(file);

        try {
            const image = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Could not read this image.'));
                img.src = objectUrl;
            });

            const size = 256;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas is unavailable.');

            const srcSize = Math.min(image.naturalWidth, image.naturalHeight);
            const sx = Math.max(0, (image.naturalWidth - srcSize) / 2);
            const sy = Math.max(0, (image.naturalHeight - srcSize) / 2);

            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(
                image,
                sx, sy, srcSize, srcSize,
                0, 0, size, size
            );

            // WebP is compact. Fall back to JPEG if the browser does not support it.
            let dataUrl = canvas.toDataURL('image/webp', 0.84);
            if (!dataUrl.startsWith('data:image/webp')) {
                dataUrl = canvas.toDataURL('image/jpeg', 0.86);
            }

            return dataUrl;
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    }

    async function chooseCustomAvatarV3() {
        if (!(typeof isGoogleConnected === 'function' && isGoogleConnected())) {
            alert('Please connect your Google account first.');
            return;
        }

        let input = document.getElementById('accountAvatarFileV3');
        if (!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.id = 'accountAvatarFileV3';
            input.accept = 'image/png,image/jpeg,image/webp,image/gif,image/avif';
            input.style.display = 'none';
            document.body.appendChild(input);
        }

        input.value = '';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const changeBtn = document.getElementById('accountAvatarChangeV3');
            const oldText = changeBtn?.textContent;

            try {
                if (changeBtn) {
                    changeBtn.disabled = true;
                    changeBtn.textContent = '⏳ Processing…';
                }

                const dataUrl = await resizeAvatarFile(file);
                setCustomAvatar(dataUrl);
                applyEffectiveAvatarToUI();
                refreshCurrentAccountSaveState();

                if (typeof persistWorkspaceChange === 'function') {
                    persistWorkspaceChange('account-avatar');
                } else if (typeof syncToGoogleDrive === 'function') {
                    syncToGoogleDrive(true);
                }
            } catch (error) {
                console.error(error);
                alert(error.message || 'Could not update avatar.');
            } finally {
                if (changeBtn) {
                    changeBtn.disabled = false;
                    changeBtn.textContent = oldText || '✏️ Change avatar';
                }
            }
        };

        input.click();
    }

    function resetCustomAvatarV3() {
        setCustomAvatar('');
        applyEffectiveAvatarToUI();
        refreshCurrentAccountSaveState();

        if (typeof persistWorkspaceChange === 'function') {
            persistWorkspaceChange('account-avatar');
        } else if (typeof syncToGoogleDrive === 'function') {
            syncToGoogleDrive(true);
        }
    }

    function ensureAvatarControlsV3() {
        injectV3Styles();

        const avatar = document.getElementById('accountAvatar');
        const fallback = document.getElementById('accountAvatarFallback');
        if (!avatar && !fallback) return;

        const wrap =
            avatar?.closest('.account-avatar-wrap') ||
            fallback?.closest('.account-avatar-wrap') ||
            avatar?.parentElement ||
            fallback?.parentElement;

        if (!wrap) return;

        if (getComputedStyle(wrap).position === 'static') {
            wrap.style.position = 'relative';
        }
        wrap.classList.add('account-avatar-wrap');

        let editBtn = document.getElementById('accountAvatarEditBubbleV3');
        if (!editBtn) {
            editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.id = 'accountAvatarEditBubbleV3';
            editBtn.className = 'account-avatar-edit-v3';
            editBtn.title = 'Change avatar';
            editBtn.setAttribute('aria-label', 'Change avatar');
            editBtn.textContent = '✎';
            editBtn.onclick = chooseCustomAvatarV3;
            wrap.appendChild(editBtn);
        }

        applyEffectiveAvatarToUI();
    }

    // Persist custom avatar in the same Drive payload so it follows this Google workspace
    // across browsers/devices. It stays optional for backward compatibility.
    const buildDrivePayloadV3 = buildDrivePayload;
    buildDrivePayload = function() {
        const payload = buildDrivePayloadV3.apply(this, arguments);

        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
            payload.accountUiPreferences = {
                ...(payload.accountUiPreferences || {}),
                customAvatar: getCustomAvatar() || ''
            };
        }

        return payload;
    };

    const applyDrivePayloadV3 = applyDrivePayload;
    applyDrivePayload = function(payload) {
        const result = applyDrivePayloadV3.apply(this, arguments);

        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
            const cloudAvatar = payload.accountUiPreferences?.customAvatar;

            if (typeof cloudAvatar === 'string') {
                setCustomAvatar(cloudAvatar);
            }
        }

        setTimeout(() => {
            ensureAvatarControlsV3();
            applyEffectiveAvatarToUI();
            refreshCurrentAccountSaveState();
        }, 0);

        return result;
    };

    // The base UI refresh may restore the Google profile picture; re-apply the selected
    // custom avatar after every account refresh.
    const updateGoogleAccountUIV3 = updateGoogleAccountUI;
    updateGoogleAccountUI = function() {
        const result = updateGoogleAccountUIV3.apply(this, arguments);

        document.getElementById('btn-sync-google')?.remove();
        ensureAvatarControlsV3();
        applyEffectiveAvatarToUI();
        refreshCurrentAccountSaveState();

        return result;
    };

    const openAccountPanelV3 = openAccountPanel;
    openAccountPanel = function() {
        const result = openAccountPanelV3.apply(this, arguments);

        setTimeout(() => {
            ensureAvatarControlsV3();
            applyEffectiveAvatarToUI();
            refreshCurrentAccountSaveState();
        }, 0);

        return result;
    };

    // Keep V2's hidden save-state engine, but mirror every account UI refresh to Current account.
    const originalPersistWorkspaceChangeV3 = window.persistWorkspaceChange;
    if (typeof originalPersistWorkspaceChangeV3 === 'function') {
        window.persistWorkspaceChange = function() {
            const result = originalPersistWorkspaceChangeV3.apply(this, arguments);
            setTimeout(refreshCurrentAccountSaveState, 0);
            return result;
        };
    }

    // ------------------------------------------------------------------------
    // Silent Google session restoration
    //
    // GIS browser access tokens do not provide a permanent refresh token.
    // We therefore:
    // 1) reuse a still-valid saved token immediately;
    // 2) when it is missing/expired, request a token with prompt:'' once;
    // 3) only show normal interactive Google sign-in if Google/browser requires it.
    // ------------------------------------------------------------------------

    function readSavedOAuthTokenV3() {
        try {
            return JSON.parse(localStorage.getItem('google_oauth_token') || 'null');
        } catch (_) {
            return null;
        }
    }

    function tokenExpiryTimestampV3(token) {
        const explicit =
            Number(token?.expires_at || token?.expiry_date || token?.expiresAt || 0);

        if (explicit > 0) return explicit;

        const savedAt = Number(token?.saved_at || token?.savedAt || 0);
        const expiresIn = Number(token?.expires_in || 0);

        if (savedAt > 0 && expiresIn > 0) {
            return savedAt + expiresIn * 1000;
        }

        return 0;
    }

    function tokenLooksUsableV3(token) {
        if (!token?.access_token) return false;

        const expiry = tokenExpiryTimestampV3(token);
        // Legacy saved tokens did not have our timestamp. Let Google verify those.
        if (!expiry) return true;

        return Date.now() < expiry - 60 * 1000;
    }

    function storeCurrentTokenWithExpiryV3() {
        try {
            const token = gapi?.client?.getToken?.();
            if (!token?.access_token) return;

            const stored = {
                ...token,
                saved_at: Date.now()
            };

            if (Number(token.expires_in || 0) > 0) {
                stored.expires_at = Date.now() + Number(token.expires_in) * 1000;
            }

            localStorage.setItem('google_oauth_token', JSON.stringify(stored));
        } catch (e) {
            console.warn('Could not persist Google token metadata:', e);
        }
    }

    async function finishSilentGoogleConnectionV3() {
        storeCurrentTokenWithExpiryV3();

        currentAccountAccess = {
            checked:false,
            role:'user',
            blocked:false,
            sessionRevoked:false
        };

        updateGooglePermissionGate();

        await fetchGoogleAccountProfile();

        if (!currentAccountAccess.blocked && !currentAccountAccess.sessionRevoked) {
            await fetchFileFromGoogleDrive();
        }
    }

    function canAttemptSilentReauthV3() {
        try {
            const last = Number(sessionStorage.getItem(SILENT_REAUTH_ATTEMPT_KEY) || 0);
            return !last || Date.now() - last >= SILENT_REAUTH_COOLDOWN_MS;
        } catch (_) {
            return true;
        }
    }

    function markSilentReauthAttemptV3() {
        try {
            sessionStorage.setItem(SILENT_REAUTH_ATTEMPT_KEY, String(Date.now()));
        } catch (_) {}
    }

    function trySilentGoogleRestoreV3() {
        if (!gapiInited || !gisInited || !tokenClient) return false;

        const existing = gapi.client.getToken();
        if (tokenLooksUsableV3(existing) && hasRequiredGoogleScopes()) {
            finishSilentGoogleConnectionV3().catch(error => {
                console.warn('Saved Google session verification failed:', error);
            });
            return true;
        }

        const saved = readSavedOAuthTokenV3();

        if (!existing && tokenLooksUsableV3(saved)) {
            try {
                gapi.client.setToken(saved);

                if (hasRequiredGoogleScopes()) {
                    finishSilentGoogleConnectionV3().catch(error => {
                        console.warn('Restored Google session verification failed:', error);
                    });
                    return true;
                }
            } catch (e) {
                console.warn('Could not restore saved Google token:', e);
            }
        }

        if (!canAttemptSilentReauthV3()) return false;
        markSilentReauthAttemptV3();

        const previousCallback = tokenClient.callback;

        const silentCallbackV3 = async response => {
            // Restore a safe callback afterward; handleAuthClick sets its own callback
            // before an interactive request anyway.
            setTimeout(() => {
                if (tokenClient.callback === silentCallbackV3) {
                    tokenClient.callback = previousCallback || '';
                }
            }, 0);

            if (response?.error) {
                // interaction_required / login_required / popup_failed_to_open are normal
                // here. Do not show an alert or modal: user can click Account when needed.
                console.info('Silent Google restore was not available:', response.error);
                updateGoogleAccountUI();
                updateGooglePermissionGate();
                return;
            }

            try {
                await finishSilentGoogleConnectionV3();
            } catch (error) {
                console.warn('Silent Google restore completed but workspace load failed:', error);
            }
        };
        tokenClient.callback = silentCallbackV3;

        try {
            tokenClient.requestAccessToken({ prompt:'' });
            return true;
        } catch (error) {
            console.info('Silent Google token request could not start:', error);
            tokenClient.callback = previousCallback || '';
            return false;
        }
    }

    // Make newly interactive-authenticated tokens reusable on subsequent page opens.
    const handleAuthClickV3 = handleAuthClick;
    handleAuthClick = function() {
        const beforeToken = gapi?.client?.getToken?.()?.access_token || '';
        const result = handleAuthClickV3.apply(this, arguments);

        // Original handler stores the token already. This delayed pass adds expiry metadata.
        let tries = 0;
        const timer = setInterval(() => {
            tries++;
            const token = gapi?.client?.getToken?.();
            if (token?.access_token && token.access_token !== beforeToken) {
                clearInterval(timer);
                storeCurrentTokenWithExpiryV3();
            } else if (tries >= 30) {
                clearInterval(timer);
            }
        }, 500);

        return result;
    };

    // V2 can create the hidden status node. Remove any cached/old instance visually and
    // keep it hidden even when older CSS is cached.
    function removeVisibleFloatingSaveBadgeV3() {
        injectV3Styles();
        const badge = document.getElementById('driveAutoSaveIndicator');
        if (badge) {
            badge.style.setProperty('display', 'none', 'important');
            badge.setAttribute('aria-hidden', 'true');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        removeVisibleFloatingSaveBadgeV3();
        ensureAvatarControlsV3();
        applyEffectiveAvatarToUI();
        refreshCurrentAccountSaveState();

        // Leave the existing "Ctrl + K Quick Find" element untouched.
    });

    window.addEventListener('load', () => {
        removeVisibleFloatingSaveBadgeV3();

        // Give Google API/GIS a moment to initialize, then silently recover the session.
        let attempts = 0;
        const restoreTimer = setInterval(() => {
            attempts++;

            if (gapiInited && gisInited && tokenClient) {
                clearInterval(restoreTimer);
                trySilentGoogleRestoreV3();
            } else if (attempts >= 30) {
                clearInterval(restoreTimer);
            }
        }, 250);
    });

    window.addEventListener('online', () => {
        setTimeout(() => {
            removeVisibleFloatingSaveBadgeV3();
            refreshCurrentAccountSaveState();

            if (!isGoogleConnected()) {
                trySilentGoogleRestoreV3();
            }
        }, 100);
    });

    // Public helpers for troubleshooting / optional future buttons.
    window.changeAccountAvatar = chooseCustomAvatarV3;
    window.resetAccountAvatarToGoogle = resetCustomAvatarV3;
    window.trySilentGoogleRestore = trySilentGoogleRestoreV3;
})();
// ============================================================================
// AUTO DRIVE SAVE V4 — AVATAR-ONLY ACCOUNT BUTTON
// - When connected, the toolbar Account button becomes the current avatar itself
// - Custom avatar updates the button immediately
// - Reset to Google photo updates the button immediately
// - Clicking the avatar still opens Current account
// - When disconnected, the original Account button appearance is restored
// ============================================================================

(function initAvatarOnlyAccountButtonV4() {
    if (window.__AVATAR_ONLY_ACCOUNT_BUTTON_V4_READY__) return;
    window.__AVATAR_ONLY_ACCOUNT_BUTTON_V4_READY__ = true;

    function injectAvatarButtonStylesV4() {
        if (document.getElementById('avatarOnlyAccountButtonV4Styles')) return;

        const style = document.createElement('style');
        style.id = 'avatarOnlyAccountButtonV4Styles';
        style.textContent = `
            #btn-login-google.avatar-only-account-v4{
                width:36px !important;
                min-width:36px !important;
                height:36px !important;
                min-height:36px !important;
                padding:0 !important;
                border-radius:50% !important;
                display:inline-grid !important;
                place-items:center !important;
                overflow:hidden !important;
                flex:0 0 36px !important;
                gap:0 !important;
                line-height:1 !important;
            }

            #btn-login-google.avatar-only-account-v4 img{
                width:100% !important;
                height:100% !important;
                object-fit:cover !important;
                border-radius:50% !important;
                display:block !important;
                border:0 !important;
                margin:0 !important;
                padding:0 !important;
            }

            #btn-login-google.avatar-only-account-v4 .account-avatar-fallback-v4{
                width:100%;
                height:100%;
                display:grid;
                place-items:center;
                border-radius:50%;
                font-size:13px;
                font-weight:800;
                background:color-mix(in srgb, currentColor 10%, transparent);
            }

            #btn-login-google.avatar-only-account-v4 .account-toolbar-name-v2,
            #btn-login-google.avatar-only-account-v4 > span:not(.account-avatar-fallback-v4){
                display:none !important;
            }
        `;
        document.head.appendChild(style);
    }

    function getEffectiveToolbarAvatarV4() {
        try {
            if (typeof getCustomAvatar === 'function') {
                const custom = getCustomAvatar();
                if (custom) return custom;
            }
        } catch (_) {}

        return googleAccountProfile?.picture || '';
    }

    function renderAvatarOnlyAccountButtonV4() {
        injectAvatarButtonStylesV4();

        const btn = document.getElementById('btn-login-google');
        if (!btn) return;

        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();

        if (!connected) {
            btn.classList.remove('avatar-only-account-v4');
            return;
        }

        btn.classList.add('avatar-only-account-v4');
        btn.title = googleAccountProfile?.email
            ? `Current account: ${googleAccountProfile.email}`
            : 'Current account';
        btn.setAttribute('aria-label', btn.title);

        const avatarUrl = getEffectiveToolbarAvatarV4();

        if (avatarUrl) {
            btn.innerHTML = `<img src="${escapeHTML(avatarUrl)}" alt="Current account">`;
        } else {
            const label = googleAccountProfile?.name || googleAccountProfile?.email || 'G';
            const initial = String(label).trim().charAt(0).toUpperCase() || 'G';
            btn.innerHTML = `<span class="account-avatar-fallback-v4">${escapeHTML(initial)}</span>`;
        }
    }

    // Re-apply after the base account UI refreshes.
    const updateGoogleAccountUIV4 = updateGoogleAccountUI;
    updateGoogleAccountUI = function() {
        const result = updateGoogleAccountUIV4.apply(this, arguments);
        setTimeout(renderAvatarOnlyAccountButtonV4, 0);
        return result;
    };

    // Re-apply after opening Current account as well.
    const openAccountPanelV4 = openAccountPanel;
    openAccountPanel = function() {
        const result = openAccountPanelV4.apply(this, arguments);
        setTimeout(renderAvatarOnlyAccountButtonV4, 0);
        return result;
    };

    // V3 exposes these helpers. Wrap them so the toolbar avatar changes immediately.
    if (typeof window.changeAccountAvatar === 'function') {
        const changeAvatarV4 = window.changeAccountAvatar;
        window.changeAccountAvatar = async function() {
            const result = await changeAvatarV4.apply(this, arguments);
            setTimeout(renderAvatarOnlyAccountButtonV4, 50);
            return result;
        };
    }

    if (typeof window.resetAccountAvatarToGoogle === 'function') {
        const resetAvatarV4 = window.resetAccountAvatarToGoogle;
        window.resetAccountAvatarToGoogle = function() {
            const result = resetAvatarV4.apply(this, arguments);
            setTimeout(renderAvatarOnlyAccountButtonV4, 0);
            return result;
        };
    }

    // Also watch the avatar shown inside the account modal.
    // When V3 replaces its src after a file is selected, mirror that change to the toolbar.
    function observeAccountAvatarV4() {
        const avatar = document.getElementById('accountAvatar');
        if (!avatar || avatar.__avatarObserverV4) return;

        avatar.__avatarObserverV4 = true;

        const observer = new MutationObserver(() => {
            renderAvatarOnlyAccountButtonV4();
        });

        observer.observe(avatar, {
            attributes:true,
            attributeFilter:['src','style']
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        injectAvatarButtonStylesV4();
        observeAccountAvatarV4();
        setTimeout(renderAvatarOnlyAccountButtonV4, 0);
    });

    window.addEventListener('load', () => {
        let tries = 0;

        const timer = setInterval(() => {
            tries++;
            observeAccountAvatarV4();
            renderAvatarOnlyAccountButtonV4();

            if (
                (typeof isGoogleConnected === 'function' && isGoogleConnected()) ||
                tries >= 40
            ) {
                clearInterval(timer);
            }
        }, 250);
    });

    window.addEventListener('storage', event => {
        if (String(event.key || '').startsWith('workspace_custom_avatar_v')) {
            setTimeout(renderAvatarOnlyAccountButtonV4, 0);
        }
    });

    // Public refresh helper for troubleshooting.
    window.refreshAccountAvatarButton = renderAvatarOnlyAccountButtonV4;
})();
// ============================================================================
// AUTO DRIVE SAVE V5 — PROFESSIONAL HEADER PROFILE BUTTON
// Fixes:
// - Custom avatar on Current account always mirrors to the header button
// - Moves Account out of the Export/Import toolbar into the hero header, beside date
// - Professional circular profile control with status dot + hover/focus states
// - Uses the actually displayed Current account avatar as the first source of truth
// ============================================================================

(function initProfessionalHeaderProfileV5() {
    if (window.__PRO_HEADER_PROFILE_V5_READY__) return;
    window.__PRO_HEADER_PROFILE_V5_READY__ = true;

    const CUSTOM_AVATAR_PREFIX = 'workspace_custom_avatar_v1_';

    function injectProfileHeaderStylesV5() {
        if (document.getElementById('profileHeaderV5Styles')) return;

        const style = document.createElement('style');
        style.id = 'profileHeaderV5Styles';
        style.textContent = `
            .hero-meta-v12.profile-meta-v5{
                display:flex !important;
                align-items:center !important;
                justify-content:flex-end !important;
                gap:12px !important;
            }

            #btn-login-google.profile-header-btn-v5{
                position:relative !important;
                width:40px !important;
                min-width:40px !important;
                height:40px !important;
                min-height:40px !important;
                padding:0 !important;
                margin:0 !important;
                display:grid !important;
                place-items:center !important;
                flex:0 0 40px !important;
                border-radius:50% !important;
                overflow:visible !important;
                border:1px solid color-mix(in srgb, currentColor 14%, transparent) !important;
                background:color-mix(in srgb, var(--bg-primary, #fff) 92%, transparent) !important;
                box-shadow:
                    0 1px 2px rgba(0,0,0,.05),
                    0 4px 14px rgba(0,0,0,.08) !important;
                transition:
                    transform .16s ease,
                    box-shadow .16s ease,
                    border-color .16s ease !important;
                cursor:pointer !important;
            }

            #btn-login-google.profile-header-btn-v5:hover{
                transform:translateY(-1px) !important;
                border-color:color-mix(in srgb, currentColor 24%, transparent) !important;
                box-shadow:
                    0 2px 4px rgba(0,0,0,.06),
                    0 8px 20px rgba(0,0,0,.12) !important;
            }

            #btn-login-google.profile-header-btn-v5:active{
                transform:translateY(0) scale(.97) !important;
            }

            #btn-login-google.profile-header-btn-v5:focus-visible{
                outline:3px solid color-mix(in srgb, currentColor 16%, transparent) !important;
                outline-offset:3px !important;
            }

            #btn-login-google.profile-header-btn-v5 .profile-avatar-v5{
                width:34px !important;
                height:34px !important;
                display:block !important;
                border-radius:50% !important;
                object-fit:cover !important;
                border:0 !important;
                padding:0 !important;
                margin:0 !important;
                pointer-events:none !important;
            }

            #btn-login-google.profile-header-btn-v5 .profile-fallback-v5{
                width:34px !important;
                height:34px !important;
                border-radius:50% !important;
                display:grid !important;
                place-items:center !important;
                font-size:12px !important;
                font-weight:800 !important;
                letter-spacing:.01em !important;
                pointer-events:none !important;
                background:color-mix(in srgb, currentColor 9%, transparent) !important;
            }

            #btn-login-google.profile-header-btn-v5 .profile-status-v5{
                position:absolute !important;
                right:-1px !important;
                bottom:-1px !important;
                width:11px !important;
                height:11px !important;
                border-radius:50% !important;
                border:2px solid var(--bg-primary, #fff) !important;
                background:#22c55e !important;
                box-shadow:0 1px 4px rgba(0,0,0,.18) !important;
                pointer-events:none !important;
            }

            #btn-login-google.profile-header-btn-v5.profile-offline-v5 .profile-status-v5{
                background:#f59e0b !important;
            }

            #btn-login-google.profile-header-btn-v5.profile-disconnected-v5 .profile-status-v5{
                display:none !important;
            }

            /* V4 rules are intentionally superseded here. */
            #btn-login-google.profile-header-btn-v5 .account-toolbar-name-v2,
            #btn-login-google.profile-header-btn-v5 .account-toolbar-avatar-v2,
            #btn-login-google.profile-header-btn-v5 .account-avatar-fallback-v4{
                display:none !important;
            }

            @media (max-width:700px){
                .hero-meta-v12.profile-meta-v5{
                    gap:9px !important;
                }

                #btn-login-google.profile-header-btn-v5{
                    width:38px !important;
                    min-width:38px !important;
                    height:38px !important;
                    min-height:38px !important;
                    flex-basis:38px !important;
                }

                #btn-login-google.profile-header-btn-v5 .profile-avatar-v5,
                #btn-login-google.profile-header-btn-v5 .profile-fallback-v5{
                    width:32px !important;
                    height:32px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function profileIdentityKeyV5() {
        return String(
            googleAccountProfile?.id ||
            googleAccountProfile?.email ||
            'default'
        ).toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
    }

    function readCustomAvatarDirectV5() {
        // Exact key used by V3.
        try {
            const exact = localStorage.getItem(CUSTOM_AVATAR_PREFIX + profileIdentityKeyV5());
            if (exact) return exact;
        } catch (_) {}

        // Fallback for an account profile whose id/email became available later than avatar setup.
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CUSTOM_AVATAR_PREFIX)) keys.push(key);
            }

            if (keys.length === 1) {
                return localStorage.getItem(keys[0]) || '';
            }
        } catch (_) {}

        return '';
    }

    function displayedAccountAvatarV5() {
        const modalAvatar = document.getElementById('accountAvatar');
        if (
            modalAvatar &&
            modalAvatar.style.display !== 'none' &&
            modalAvatar.getAttribute('src')
        ) {
            return modalAvatar.getAttribute('src');
        }

        return '';
    }

    function currentProfileAvatarV5() {
        // 1. Avatar actually rendered in Current account.
        const displayed = displayedAccountAvatarV5();
        if (displayed) return displayed;

        // 2. Custom avatar stored by V3.
        const custom = readCustomAvatarDirectV5();
        if (custom) return custom;

        // 3. Google profile photo.
        return googleAccountProfile?.picture || '';
    }

    function moveAccountButtonToHeaderV5() {
        injectProfileHeaderStylesV5();

        const btn = document.getElementById('btn-login-google');
        const heroMeta = document.querySelector('.hero-meta-v12');
        if (!btn || !heroMeta) return false;

        heroMeta.classList.add('profile-meta-v5');

        // Keep date first, avatar second.
        if (btn.parentElement !== heroMeta) {
            heroMeta.appendChild(btn);
        } else if (heroMeta.lastElementChild !== btn) {
            heroMeta.appendChild(btn);
        }

        btn.classList.remove('avatar-only-account-v4', 'account-connected-v2');
        btn.classList.add('profile-header-btn-v5');

        return true;
    }

    function renderProfessionalProfileV5() {
        if (!moveAccountButtonToHeaderV5()) return;

        const btn = document.getElementById('btn-login-google');
        if (!btn) return;

        const connected =
            typeof isGoogleConnected === 'function' &&
            isGoogleConnected();

        const avatar = connected ? currentProfileAvatarV5() : '';
        const label =
            googleAccountProfile?.name ||
            googleAccountProfile?.email ||
            'Account';

        btn.classList.toggle('profile-offline-v5', connected && !navigator.onLine);
        btn.classList.toggle('profile-disconnected-v5', !connected);

        btn.title = connected
            ? `${label}${googleAccountProfile?.email && googleAccountProfile.email !== label ? ` · ${googleAccountProfile.email}` : ''}`
            : 'Connect Google account';

        btn.setAttribute(
            'aria-label',
            connected ? `Current account: ${label}` : 'Connect Google account'
        );

        if (connected && avatar) {
            btn.innerHTML = `
                <img class="profile-avatar-v5" src="${escapeHTML(avatar)}" alt="">
                <span class="profile-status-v5" aria-hidden="true"></span>
            `;
            return;
        }

        if (connected) {
            const initial = String(label).trim().charAt(0).toUpperCase() || 'G';
            btn.innerHTML = `
                <span class="profile-fallback-v5">${escapeHTML(initial)}</span>
                <span class="profile-status-v5" aria-hidden="true"></span>
            `;
            return;
        }

        btn.innerHTML = `
            <span class="profile-fallback-v5">👤</span>
            <span class="profile-status-v5" aria-hidden="true"></span>
        `;
    }

    function installAvatarMirrorObserverV5() {
        const avatar = document.getElementById('accountAvatar');
        if (!avatar || avatar.__profileMirrorObserverV5) return;

        avatar.__profileMirrorObserverV5 = true;

        const observer = new MutationObserver(() => {
            // MutationObserver runs after V3 has already put the new avatar into Current account.
            // Therefore the header mirrors the exact same src instead of recomputing from Google.
            requestAnimationFrame(renderProfessionalProfileV5);
        });

        observer.observe(avatar, {
            attributes:true,
            attributeFilter:['src', 'style', 'class']
        });
    }

    function installAvatarStorageMirrorV5() {
        window.addEventListener('storage', event => {
            if (!event.key || !event.key.startsWith(CUSTOM_AVATAR_PREFIX)) return;
            requestAnimationFrame(renderProfessionalProfileV5);
        });
    }

    // Base account rendering can overwrite the button repeatedly.
    // V5 always gets the last render.
    const updateGoogleAccountUIV5 = updateGoogleAccountUI;
    updateGoogleAccountUI = function() {
        const result = updateGoogleAccountUIV5.apply(this, arguments);

        setTimeout(() => {
            installAvatarMirrorObserverV5();
            renderProfessionalProfileV5();
        }, 0);

        return result;
    };

    const openAccountPanelV5 = openAccountPanel;
    openAccountPanel = function() {
        const result = openAccountPanelV5.apply(this, arguments);

        setTimeout(() => {
            installAvatarMirrorObserverV5();
            renderProfessionalProfileV5();
        }, 0);

        return result;
    };

    // V3's avatar buttons call local helper functions directly, so wrapping the public helper
    // isn't enough. The observer above catches the actual <img src> mutation. As a second
    // guarantee, watch clicks in the account avatar action area and refresh shortly afterward.
    document.addEventListener('change', event => {
        if (event.target?.id === 'accountAvatarFileV3') {
            setTimeout(renderProfessionalProfileV5, 50);
            setTimeout(renderProfessionalProfileV5, 250);
            setTimeout(renderProfessionalProfileV5, 700);
        }
    });

    document.addEventListener('click', event => {
        const target = event.target?.closest?.(
            '#accountAvatarChangeV3, #accountAvatarEditBubbleV3, #accountAvatarResetV3'
        );

        if (!target) return;

        setTimeout(renderProfessionalProfileV5, 50);
        setTimeout(renderProfessionalProfileV5, 300);
    });

    window.addEventListener('online', () => {
        setTimeout(renderProfessionalProfileV5, 0);
    });

    window.addEventListener('offline', () => {
        setTimeout(renderProfessionalProfileV5, 0);
    });

    document.addEventListener('DOMContentLoaded', () => {
        injectProfileHeaderStylesV5();
        moveAccountButtonToHeaderV5();
        installAvatarMirrorObserverV5();
        renderProfessionalProfileV5();
    });

    window.addEventListener('load', () => {
        let attempts = 0;

        const timer = setInterval(() => {
            attempts++;
            moveAccountButtonToHeaderV5();
            installAvatarMirrorObserverV5();
            renderProfessionalProfileV5();

            if (
                (
                    typeof isGoogleConnected === 'function' &&
                    isGoogleConnected() &&
                    googleAccountProfile
                ) ||
                attempts >= 40
            ) {
                clearInterval(timer);
            }
        }, 250);
    });

    // Public helper for manual testing:
    // refreshHeaderProfileAvatar()
    window.refreshHeaderProfileAvatar = renderProfessionalProfileV5;
})();
// ============================================================================
// UI FIX V6

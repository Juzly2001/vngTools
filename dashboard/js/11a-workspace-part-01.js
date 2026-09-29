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

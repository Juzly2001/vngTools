// 20. SMART WORKSPACE UPGRADE: Favorites, Recent, Command Palette, Trash/Undo
// ========================================================================== 
const RECENT_KEY = 'dashboardRecentItemsV2';
const TRASH_KEY = 'dashboardTrashItemsV2';
const AUTO_SORT_KEY = 'dashboardAutoSortFoldersV1';
let lastTrashSnapshot = null;
let isAutoSortMode = false;

function readJSONStore(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
}
function writeJSONStore(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function normalizeText(value = '') { return String(value || '').toLowerCase(); }

function saveDataOnly() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    if (gapiInited && gisInited && gapi.client.getToken()) syncToGoogleDrive(true);
}

function addRecentItem(item) {
    const recent = readJSONStore(RECENT_KEY, []);
    const key = `${item.type}-${item.groupId}-${item.index ?? item.title}`;
    const next = [{ ...item, key, at: Date.now() }, ...recent.filter(x => x.key !== key)].slice(0, 12);
    writeJSONStore(RECENT_KEY, next);
    renderSmartPanels();
}

function collectDashboardItems() {
    const items = [];
    state.dashboardData.forEach(group => {
        if (group.pinKey && group.pinKey !== '' && group.isLocked) return;
        const gLabel = `${group.emoji && group.emoji !== 'NONE' ? group.emoji + ' ' : ''}${group.title}`;
        items.push({ type:'group', icon:'📁', title:gLabel, subtitle:`Group ${group.type}`, groupId:group.id, action: () => scrollToGroup(group.id) });
        (group.links || []).forEach((link, index) => items.push({ type:'link', icon:'🔗', title:link.name, subtitle:group.title, groupId:group.id, index, url:link.url, action: () => { addRecentItem({type:'link', title:link.name, subtitle:group.title, groupId:group.id, index, url:link.url}); window.open(link.url, '_blank'); } }));
        (group.notes || []).forEach((note, index) => items.push({ type:'note', icon:'📝', title:note.title, subtitle:group.title, groupId:group.id, index, text:note.content, action: () => showContentDetail(group.id, index, 'note') }));
        (group.schedules || []).forEach((sch, index) => items.push({ type:'schedule', icon:'📅', title:sch.title, subtitle:`${group.title} · ${sch.date || ''} ${sch.time || ''}`, groupId:group.id, index, text:sch.content, date:sch.date, action: () => showContentDetail(group.id, index, 'schedule') }));
    });
    return items;
}

function renderSmartPanels() {
    renderSmartFavorites();
    renderSmartRecent();
    renderSmartUpcoming();
}

function collectFavoriteEntries(limit = Infinity) {
    const entries = [];
    state.dashboardData.forEach(group => {
        if (group.favorite) {
            entries.push({
                kind: 'group',
                icon: group.emoji && group.emoji !== 'NONE' ? group.emoji : '⭐',
                title: group.title || 'Untitled group',
                subtitle: `Group · ${group.type || ''}`,
                groupId: group.id
            });
        }

        // Do not expose pinned content from a currently locked group.
        if (group.pinKey && group.pinKey !== '' && group.isLocked) return;

        (group.links || []).forEach((item, index) => {
            if (item?.pinned === true) entries.push({
                kind: 'link', icon: '🔗', title: item.name || item.title || 'Untitled link',
                subtitle: group.title || '', groupId: group.id, index, url: item.url || ''
            });
        });
        (group.notes || []).forEach((item, index) => {
            if (item?.pinned === true) entries.push({
                kind: 'note', icon: '📝', title: item.title || 'Untitled note',
                subtitle: group.title || '', groupId: group.id, index
            });
        });
        (group.schedules || []).forEach((item, index) => {
            if (item?.pinned === true) entries.push({
                kind: 'schedule', icon: '📅', title: item.title || 'Untitled schedule',
                subtitle: group.title || '', groupId: group.id, index
            });
        });
    });
    return entries.slice(0, limit);
}

function openFavoriteEntry(kind, groupId, index = null) {
    if (kind === 'group') {
        scrollToGroup(groupId);
        return;
    }
    if (kind === 'link') {
        const group = getGroup(groupId);
        const item = group?.links?.[index];
        const targetUrl = item?.url || '';
        if (targetUrl) window.open(targetUrl, '_blank');
        return;
    }
    if (kind === 'note' || kind === 'schedule') {
        showContentDetail(groupId, Number(index), kind);
    }
}

function renderFavoriteEntryHTML(entry, closeSidebar = false) {
    const closeCode = closeSidebar ? "closeModal('sidebarPanelModal'); " : '';
    const indexArg = entry.index == null ? 'null' : Number(entry.index);
    return `<div class="smart-item" onclick="${closeCode}openFavoriteEntry('${entry.kind}','${entry.groupId}',${indexArg})"><span>${entry.icon} ${escapeHTML(entry.title)}</span><small>${escapeHTML(entry.subtitle || '')}</small></div>`;
}

function renderSmartFavorites() {
    const el = getEl('smartFavorites'); if (!el) return;
    const favs = collectFavoriteEntries(8);
    if (!favs.length) { el.className = 'smart-list empty'; el.textContent = 'No favorite groups or pinned items yet.'; return; }
    el.className = 'smart-list';
    el.innerHTML = favs.map(item => renderFavoriteEntryHTML(item, false)).join('');
}

function renderSmartRecent() {
    const el = getEl('smartRecent'); if (!el) return;
    const recent = readJSONStore(RECENT_KEY, []).slice(0, 8);
    const panel = el.closest('.smart-panel');
    const title = panel?.querySelector('.panel-title');
    if (title && !title.classList.contains('panel-title-row')) {
        title.classList.add('panel-title-row');
        title.innerHTML = `<span>🕘 Recent</span><button class="btn-secondary panel-mini-btn" onclick="clearRecentItems(event)">Clear all</button>`;
    }
    if (!recent.length) { el.className = 'smart-list empty'; el.textContent = 'No recent history yet.'; return; }
    el.className = 'smart-list';
    el.innerHTML = recent.map((r, i) => `
        <div class="smart-item">
            <div class="smart-item-main" onclick="openRecentItem(${i})">
                <span>${r.type === 'link' ? '🔗' : r.type === 'note' ? '📝' : '📅'} ${escapeHTML(r.title)}</span>
                <small>${escapeHTML(r.subtitle || '')}</small>
            </div>
            <div class="smart-item-actions">
                <button class="smart-icon-btn" onclick="removeRecentItem(${i}, event)" title="Remove from Recent">✕</button>
            </div>
        </div>`).join('');
}

function removeRecentItem(index, event) {
    event?.stopPropagation?.();
    const recent = readJSONStore(RECENT_KEY, []);
    recent.splice(index, 1);
    writeJSONStore(RECENT_KEY, recent);
    renderSmartRecent();
}

function clearRecentItems(event) {
    event?.stopPropagation?.();
    writeJSONStore(RECENT_KEY, []);
    renderSmartRecent();
}

function renderSmartUpcoming() {
    const el = getEl('smartUpcoming'); if (!el) return;
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
    const top = upcoming.slice(0, 8);
    if (!top.length) { el.className = 'smart-list empty'; el.textContent = 'No upcoming schedules.'; return; }
    el.className = 'smart-list';
    el.innerHTML = top.map(x => `<div class="smart-item" onclick="openCalendarScheduleDetail('${x.group.id}', ${x.index})"><span>${x.sch.important ? '⚠️' : '📅'} ${escapeHTML(x.sch.title)}</span><small>${escapeHTML(x.group.title)} · ${String(x.sch.endDate || x.sch.date || '').split('-').reverse().join('/')}</small></div>`).join('');
}

function openRecentItem(index) {
    const r = readJSONStore(RECENT_KEY, [])[index];
    if (!r) return;
    if (r.type === 'link' && r.url) window.open(r.url, '_blank');
    else if (r.type === 'note' || r.type === 'schedule') showContentDetail(r.groupId, r.index, r.type);
}

function scrollToGroup(groupId) {
    const group = getGroup(groupId);
    if (group?.collapsed) group.collapsed = false;
    renderDashboard();
    setTimeout(() => {
        const card = document.querySelector(`.group-card[data-id="${groupId}"]`);
        card?.scrollIntoView({ behavior:'smooth', block:'center' });
        card?.animate?.([{ transform:'scale(1)' }, { transform:'scale(1.025)' }, { transform:'scale(1)' }], { duration: 500 });
    }, 30);
}

function openCommandPalette() {
    openModal('commandPaletteModal');
    const input = getEl('commandInput');
    if (input) { input.value = ''; setTimeout(() => input.focus(), 50); }
    renderCommandPalette();
}

function renderCommandPalette() {
    const box = getEl('commandResults'); if (!box) return;
    const keyword = normalizeText(getEl('commandInput')?.value || '');
    const quickActions = [
        { icon:'⌘', title:'Open Command Palette', subtitle:'Quick actions', action:() => openCommandPalette() },
        { icon:'⚠️', title:'View important tasks today', subtitle:'Dashboard', action:() => { closeModal('commandPaletteModal'); showTodayImportantTasks(); } },
        { icon:'🗑️', title:'Open Trash', subtitle:'Restore deleted items', action:() => { closeModal('commandPaletteModal'); openTrashModal(); } },
        { icon:'📆', title:'Open Calendar View', subtitle:'View schedule by month', action:() => { closeModal('commandPaletteModal'); openCalendarModal(); } },
        { icon:'💾', title:'Open Version Backups', subtitle:'Restore an old backup', action:() => { closeModal('commandPaletteModal'); openBackupModal(); } }
    ];
    const all = [...quickActions, ...collectDashboardItems()];
    const result = all.filter(item => !keyword || normalizeText(`${item.title} ${item.subtitle || ''} ${item.text || ''} ${item.url || ''}`).includes(keyword)).slice(0, 30);
    if (!result.length) { box.innerHTML = '<div class="empty-search-state">No matching results.</div>'; return; }
    window.__commandActions = result;
    box.innerHTML = result.map((item, i) => `<button class="command-result-item" onclick="runCommandAction(${i})"><strong>${item.icon || '•'} ${escapeHTML(item.title)}</strong><small>${escapeHTML(item.subtitle || '')}</small></button>`).join('');
}

function runCommandAction(index) {
    const item = window.__commandActions?.[index];
    if (!item) return;
    closeModal('commandPaletteModal');
    item.action?.();
}

const __originalShowContentDetail = showContentDetail;
showContentDetail = function(groupId, index, type) {
    const group = getGroup(groupId);
    const item = group?.[`${type}s`]?.[index];
    if (item) addRecentItem({ type, title: item.title || item.name || 'Untitled', subtitle: group.title, groupId, index });
    return __originalShowContentDetail(groupId, index, type);
};

const __originalRenderDashboard = renderDashboard;
renderDashboard = function() {
    __originalRenderDashboard();
    renderSmartPanels();
};

const __originalToggleFavoriteGroup = toggleFavoriteGroup;
toggleFavoriteGroup = function(groupId, event) {
    __originalToggleFavoriteGroup(groupId, event);
    renderSmartPanels();
};

const __originalOpenContextMenu = openContextMenu;
openContextMenu = function(e, targetType, groupId, index = null) {
    __originalOpenContextMenu(e, targetType, groupId, index);
    const menuContent = getEl('menuItemsContent');
    if (!menuContent) return;
    if (['link','note','schedule'].includes(targetType)) {
        const group = getGroup(groupId);
        const item = group?.[`${targetType}s`]?.[index];
        const isPinned = item?.pinned === true;
        const pinLabel = isPinned ? '📍 Unpin this item' : '📌 Pin this item';
        menuContent.insertAdjacentHTML('afterbegin', `<div class="context-menu-item ${isPinned ? 'active' : ''}" onclick="favoriteSingleItem('${targetType}','${groupId}',${index})">${pinLabel}</div>`);
    }
};

// Legacy function name kept so existing inline handlers remain compatible.
// Pin state now uses one shared `pinned` property for Link, Note and Schedule.
function favoriteSingleItem(type, groupId, index) {
    const group = getGroup(groupId);
    const item = group?.[`${type}s`]?.[index];
    if (!item) return;

    item.pinned = !item.pinned;
    // Clean up the old incomplete flag from earlier builds if present.
    if (Object.prototype.hasOwnProperty.call(item, 'favorite')) delete item.favorite;

    saveData();
    const menu = getEl('customContextMenu');
    if (menu) menu.style.display = 'none';
    renderDashboard();
}

function showUndoToast(label) {
    const toast = getEl('undoToast'); if (!toast) return;
    toast.innerHTML = `<span>Moved <b>${escapeHTML(label)}</b> to Trash.</span><button class="btn-primary" onclick="openTrashModal()">Open Trash</button>`;
    toast.style.display = 'flex';
    clearTimeout(window.__undoToastTimer);
    window.__undoToastTimer = setTimeout(() => { toast.style.display = 'none'; }, 7000);
}

triggerDelete = function(type) {
    const group = getGroup(state.activeGroupId);
    if (!group) return;
    const typeMap = { Group:'group', Link:'link', Note:'note', Schedule:'schedule' };
    const label = type === 'Group' ? group.title : (group[`${type.toLowerCase()}s`]?.[state.activeIndex]?.title || group[`${type.toLowerCase()}s`]?.[state.activeIndex]?.name || 'this item');
    customConfirm(`Are you sure you want to delete ${typeMap[type] || 'item'} "${label}"?\nData will be moved to Trash and can be restored.`, '🗑️ Confirm deletion').then(ok => {
        if (!ok) return;
        const trash = readJSONStore(TRASH_KEY, []);
        let payload = null;
        if (type === 'Group') {
            const idx = state.dashboardData.findIndex(g => g.id === state.activeGroupId);
            if (idx >= 0) payload = { kind:'Group', index:idx, data: state.dashboardData.splice(idx, 1)[0] };
        } else {
            const key = `${type.toLowerCase()}s`;
            const item = group[key]?.splice(state.activeIndex, 1)[0];
            if (item) payload = { kind:type, groupId: group.id, index: state.activeIndex, data: item };
        }
        if (!payload) return;
        payload.deletedAt = Date.now();
        lastTrashSnapshot = payload;
        trash.unshift(payload);
        writeJSONStore(TRASH_KEY, trash.slice(0, 50));
        saveData();
        showUndoToast(label);
    });
};

function formatTrashTime(ts) {
    try { return new Date(ts).toLocaleString('vi-VN'); }
    catch { return ''; }
}

function getTrashLabel(item) {
    if (!item) return 'Untitled';
    if (item.kind === 'Group') return item.data?.title || 'Untitled group';
    return item.data?.title || item.data?.name || 'Untitled item';
}

function getTrashKindLabel(kind) {
    return { Group:'📁 Group', Link:'🔗 Link', Note:'📝 Note', Schedule:'📅 Schedule' }[kind] || 'Item';
}

function openTrashModal() {
    renderTrashModal();
    openModal('trashModal');
    const toast = getEl('undoToast'); if (toast) toast.style.display = 'none';
}

function renderTrashModal() {
    const el = getEl('trashList'); if (!el) return;
    const trash = readJSONStore(TRASH_KEY, []);
    if (!trash.length) {
        el.className = 'trash-list empty';
        el.textContent = 'Trash is empty.';
        return;
    }
    el.className = 'trash-list';
    el.innerHTML = trash.map((item, index) => `
        <div class="trash-item">
            <div>
                <strong>${getTrashKindLabel(item.kind)} · ${escapeHTML(getTrashLabel(item))}</strong>
                <small>${escapeHTML(item.data?.title || item.data?.name || '')}${item.kind !== 'Group' ? ' · Original group: ' + escapeHTML(getGroup(item.groupId)?.title || 'no longer exists') : ''}<br>Deleted: ${formatTrashTime(item.deletedAt)}</small>
            </div>
            <div class="trash-actions">
                <button class="btn-success" onclick="restoreTrashItemAt(${index})">Restore</button>
                <button class="btn-real-danger" onclick="removeTrashItemAt(${index})">Delete</button>
            </div>
        </div>`).join('');
}

function restoreTrashItemAt(index) {
    const trash = readJSONStore(TRASH_KEY, []);
    const item = trash[index];
    if (!item) return;
    if (item.kind === 'Group') {
        state.dashboardData.splice(Math.min(item.index ?? state.dashboardData.length, state.dashboardData.length), 0, item.data);
    } else {
        const group = getGroup(item.groupId);
        if (!group) return alert('Original group not found. Restore the original group first if it was deleted.');
        const key = `${item.kind.toLowerCase()}s`;
        if (!group[key]) group[key] = [];
        group[key].splice(Math.min(item.index ?? group[key].length, group[key].length), 0, item.data);
    }
    trash.splice(index, 1);
    lastTrashSnapshot = null;
    writeJSONStore(TRASH_KEY, trash);
    saveData();
    renderTrashModal();
}

function removeTrashItemAt(index) {
    const trash = readJSONStore(TRASH_KEY, []);
    trash.splice(index, 1);
    writeJSONStore(TRASH_KEY, trash);
    renderTrashModal();
}

function clearTrashItems() {
    customConfirm('Are you sure you want to clear the entire Trash? This cannot be undone.', '🗑️ Clear Trash').then(ok => {
        if (!ok) return;
        writeJSONStore(TRASH_KEY, []);
        lastTrashSnapshot = null;
        renderTrashModal();
    });
}

function restoreLastTrashItem() {
    const trash = readJSONStore(TRASH_KEY, []);
    if (!trash.length && !lastTrashSnapshot) return alert('There is no data in Trash to restore.');
    const targetIndex = lastTrashSnapshot ? trash.findIndex(x => x.deletedAt === lastTrashSnapshot.deletedAt) : 0;
    restoreTrashItemAt(targetIndex >= 0 ? targetIndex : 0);
    const toast = getEl('undoToast'); if (toast) toast.style.display = 'none';
}

document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); openCommandPalette();
    }
    if (e.key === 'Escape') closeModal('commandPaletteModal');
});

document.addEventListener('click', e => {
    const link = e.target.closest('.link-button');
    if (!link) return;
    const card = link.closest('.group-card');
    const wrapper = link.closest('.item-wrapper');
    const group = getGroup(card?.dataset.id);
    const idx = Number(wrapper?.dataset.index);
    const item = group?.links?.[idx];
    if (item) addRecentItem({ type:'link', title:item.name, subtitle:group.title, groupId:group.id, index:idx, url:item.url });
}, true);

window.addEventListener('load', () => { applyAutoSortUI(); setTimeout(renderSmartPanels, 350); });

// ==========================================================================

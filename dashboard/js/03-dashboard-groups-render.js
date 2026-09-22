// 5. QUẢN LÝ DỮ LIỆU & CORE DASHBOARD RENDERING SYSTEM
// ==========================================================================
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    renderDashboard();
    updateScheduleUI();
    if (gapiInited && gisInited && gapi.client.getToken()) {
        syncToGoogleDrive(true); 
    }
}

const linkify = text => text ? text.replace(/(https?:\/\/[^\s]+)/g, url => `<a href="${url}" target="_blank">${url}</a>`) : "";

function getRecentEmojis() {
    try {
        const recent = JSON.parse(localStorage.getItem(EMOJI_RECENT_KEY) || '[]');
        return Array.isArray(recent) ? recent.filter(icon => EMOJI_LIST.includes(icon)).slice(0, 18) : [];
    } catch (e) {
        return [];
    }
}

function saveRecentEmoji(emoji) {
    if (!emoji || emoji === 'NONE') return;
    const recent = [emoji, ...getRecentEmojis().filter(item => item !== emoji)].slice(0, 18);
    localStorage.setItem(EMOJI_RECENT_KEY, JSON.stringify(recent));
}

function buildEmojiPicker(gridId, preSelectedEmoji = "NONE") {
    const grid = getEl(gridId);
    if (!grid) return;

    state.selectedEmoji = preSelectedEmoji || "NONE";
    const pickerId = `${gridId}_picker`;
    const recentIcons = getRecentEmojis();

    const allGroup = { name: "All", key: "all", icons: EMOJI_LIST };
    const recentGroup = { name: "Recent", key: "recent", icons: recentIcons };
    const normalGroups = EMOJI_GROUPS.filter(group => group.key !== "recent");

    const groups = [
        allGroup,
        ...(recentIcons.length ? [recentGroup] : []),
        ...normalGroups
    ];

    const renderEmojiItems = (icons, keyword = '') => {
        const normalizedKeyword = (keyword || '').trim().toLowerCase();
        const source = normalizedKeyword ? EMOJI_LIST : icons;

        const filtered = source.filter(icon => {
            if (!normalizedKeyword) return true;
            const groupName = (EMOJI_GROUPS.find(group => group.icons.includes(icon))?.name || '').toLowerCase();
            return icon.includes(normalizedKeyword) || groupName.includes(normalizedKeyword);
        });

        return filtered.length
            ? filtered.map(emoji => `
                <button type="button" class="emoji-item ${emoji === state.selectedEmoji ? 'selected' : ''}" data-emoji="${emoji}" title="${emoji === 'NONE' ? 'No icon' : emoji}">
                    ${emoji === "NONE" ? `<span class="emoji-none-label">🚫 None</span>` : emoji}
                </button>
            `).join('')
            : `<div class="emoji-empty">No matching icons found</div>`;
    };

    grid.innerHTML = `
        <div class="emoji-picker-shell" id="${pickerId}">
            <div class="emoji-search-wrap">
                <span>🔎</span>
                <input type="search" class="emoji-search-input" placeholder="Search icons or groups..." autocomplete="off">
            </div>
            <div class="emoji-tabs">
                ${groups.map((group, index) => `<button type="button" class="emoji-tab ${index === 0 ? 'active' : ''}" data-key="${group.key}">${group.name}</button>`).join('')}
            </div>
            <div class="emoji-items">${renderEmojiItems(allGroup.icons)}</div>
        </div>
    `;

    const shell = grid.querySelector(`#${pickerId}`);
    if (!shell) return;

    const searchInput = shell.querySelector('.emoji-search-input');
    const itemsBox = shell.querySelector('.emoji-items');
    const tabsBox = shell.querySelector('.emoji-tabs');
    let activeGroup = allGroup;

    const markSelected = () => {
        itemsBox.querySelectorAll('.emoji-item').forEach(el => {
            el.classList.toggle('selected', el.dataset.emoji === state.selectedEmoji);
        });
    };

    const refresh = () => {
        itemsBox.innerHTML = renderEmojiItems(activeGroup.icons, searchInput.value || '');
        markSelected();
    };

    const chooseEmoji = (emoji) => {
        if (!emoji) return;
        state.selectedEmoji = emoji;
        saveRecentEmoji(emoji);
        markSelected();
    };

    searchInput.addEventListener('input', refresh);

    // Kéo ngang thanh tab icon nhưng không nuốt click.
    let pointerDown = false;
    let didDragTab = false;
    let startX = 0;
    let startScrollLeft = 0;

    tabsBox.addEventListener('pointerdown', event => {
        if (event.button !== undefined && event.button !== 0) return;
        pointerDown = true;
        didDragTab = false;
        startX = event.clientX;
        startScrollLeft = tabsBox.scrollLeft;
    });

    tabsBox.addEventListener('pointermove', event => {
        if (!pointerDown) return;
        const diffX = event.clientX - startX;
        if (Math.abs(diffX) > 8) {
            didDragTab = true;
            tabsBox.classList.add('is-dragging');
            tabsBox.scrollLeft = startScrollLeft - diffX;
        }
    });

    const stopTabPointer = () => {
        pointerDown = false;
        tabsBox.classList.remove('is-dragging');
    };

    tabsBox.addEventListener('pointerup', stopTabPointer);
    tabsBox.addEventListener('pointercancel', stopTabPointer);
    tabsBox.addEventListener('pointerleave', stopTabPointer);

    tabsBox.addEventListener('click', event => {
        if (didDragTab) {
            event.preventDefault();
            event.stopPropagation();
            didDragTab = false;
            return;
        }

        const tab = event.target.closest('.emoji-tab');
        if (!tab) return;

        shell.querySelectorAll('.emoji-tab').forEach(btn => btn.classList.remove('active'));
        tab.classList.add('active');

        activeGroup = groups.find(group => group.key === tab.dataset.key) || allGroup;
        searchInput.value = '';
        refresh();
    });

    itemsBox.addEventListener('click', event => {
        const item = event.target.closest('.emoji-item');
        if (!item) return;
        event.preventDefault();
        chooseEmoji(item.dataset.emoji);
    });

    itemsBox.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const item = event.target.closest('.emoji-item');
        if (!item) return;
        event.preventDefault();
        chooseEmoji(item.dataset.emoji);
    });
}

function getScheduleEndDateTime(sch) {
    return new Date(`${sch.endDate || sch.date || ''}T${sch.endTime || sch.time || '00:00'}`);
}

function isScheduleTodayImportant(sch) {
    if (!sch || !sch.important) return false;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(`${sch.date || ''}T00:00:00`);
    const end = new Date(`${sch.endDate || sch.date || ''}T23:59:59`);
    return !isNaN(start) && !isNaN(end) && today >= start && today <= end;
}

function getDashboardStats() {
    return state.dashboardData.reduce((acc, group) => {
        acc.groups += 1;
        acc.links += group.links?.length || 0;
        acc.notes += group.notes?.length || 0;
        acc.schedules += group.schedules?.length || 0;
        acc.todayImportant += (group.schedules || []).filter(isScheduleTodayImportant).length;
        acc.kanban += Array.isArray(group.kanban)
        ? group.kanban.length : Array.isArray(group.kanban?.boards) ? group.kanban.boards.length : 0;
        
        return acc;
    }, { groups: 0, links: 0, notes: 0, kanban: 0, schedules: 0, todayImportant: 0 });
}

function updateDashboardStats() {
    const stats = getDashboardStats();
    const setText = (id, value) => { const el = getEl(id); if (el) el.textContent = value; };
    setText('statGroups', stats.groups);
    setText('statLinks', stats.links);
    setText('statNotes', stats.notes);
    setText('statKabans', stats.kanban); 
    setText('statTodayImportant', stats.todayImportant);
}

function getDashboardKeyword() {
    return (getEl('globalSearch')?.value || '').trim().toLowerCase();
}

function groupMatchesKeyword(group, keyword) {
    if (!keyword) return true;
    const chunks = [group.title, group.emoji, group.type, ...(group.tags || [])];
    (group.links || []).forEach(item => chunks.push(item.name, item.url, item.emoji, ...(item.tags || [])));
    (group.notes || []).forEach(item => chunks.push(
        item.title, item.content, item.emoji,
        ...normalizeNoteTags(item),
        ...normalizeNoteTags(item).map(noteTagLabel)
    ));
    (group.schedules || []).forEach(item => chunks.push(item.title, item.content, item.date, item.endDate, item.time, item.endTime, item.emoji, ...(item.tags || [])));
    return chunks.filter(Boolean).join(' ').toLowerCase().includes(keyword);
}

let dashboardSearchTimer = null;

function scheduleDashboardSearch(event) {
    clearTimeout(dashboardSearchTimer);
    dashboardSearchTimer = null;
    if (event?.isComposing || event?.type === 'compositionstart') return;
    dashboardSearchTimer = setTimeout(() => {
        dashboardSearchTimer = null;
        renderDashboard();
    }, 150);
}

function clearDashboardSearch() {
    clearTimeout(dashboardSearchTimer);
    dashboardSearchTimer = null;
    const input = getEl('globalSearch');
    if (input) input.value = '';
    renderDashboard();
}

function toggleAllGroups(shouldOpen = true) {
    state.dashboardData.forEach(group => group.collapsed = !shouldOpen);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    renderDashboard();
}

function toggleFavoriteGroup(groupId, event) {
    event?.stopPropagation?.();
    const group = getGroup(groupId);
    if (!group) return;
    group.favorite = !group.favorite;
    saveData();
}

function getGroupCreatedValue(group) {
    const idNumber = String(group?.id || '').match(/\d+/)?.[0];
    return Number(idNumber || 0);
}

function sortGroupsForRender(groups) {
    return [...groups].sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)));
}

// Keep the original array index for every item, but render pinned items first.
// This prevents Edit/Delete/Move/context-menu actions from targeting the wrong item.
function getPinnedItemsForRender(items = []) {
    return (Array.isArray(items) ? items : [])
        .map((item, originalIndex) => ({ item, originalIndex }))
        .sort((a, b) => Number(Boolean(b.item?.pinned)) - Number(Boolean(a.item?.pinned)));
}

function applyAutoSortUI() {
    const grid = getEl('groupsContainer');
    grid?.classList.remove('auto-sort-layout');
}
function toggleAutoSortMode() {
    isAutoSortMode = false;
    localStorage.removeItem(AUTO_SORT_KEY);
    renderDashboard();
}

function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
}

function getGroupContentAreaClass(type) {
    return type === 'kanban' ? 'kanban-area' : `${type}s-area`;
}

// Preserve unchanged link/note cards, including their focus and scroll state.
const dashboardCardSnapshots = new WeakMap();

function disposeDashboardCard(card) {
    if (typeof Sortable !== 'undefined') {
        [card, ...card.querySelectorAll('*')].forEach(element => {
            Sortable.get(element)?.destroy();
        });
    }
    card.remove();
}

function reconcileDashboardCards(container, cards) {
    const retained = new Set(cards);
    Array.from(container.children).forEach(card => {
        if (!retained.has(card)) disposeDashboardCard(card);
    });
    let cursor = container.firstElementChild;
    cards.forEach(card => {
        if (card === cursor) cursor = cursor.nextElementSibling;
        else container.insertBefore(card, cursor);
    });
}

function renderDashboard() {
    const container = getEl('groupsContainer'); 
    if (!container) return;
    updateDashboardStats();
    const previousCards = new Map(Array.from(container.children)
        .filter(card => card.classList.contains('group-card'))
        .map(card => [card.dataset.id, card]));
    const nextCards = [];
    const keyword = getDashboardKeyword();
    const groupsToRender = sortGroupsForRender(
        [...state.dashboardData].filter(group => groupMatchesKeyword(group, keyword) && groupMatchesActiveTag(group))
    );
    applyAutoSortUI();
    
    if (state.dashboardData.length === 0) {
        reconcileDashboardCards(container, []);
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-sub)">No groups yet.</p>`; 
        return;
    }
    if (groupsToRender.length === 0) {
        reconcileDashboardCards(container, []);
        container.innerHTML = `<div class="empty-search-state">🔎 No matching data found.<br><button class="btn-secondary" onclick="clearDashboardSearch()">Clear search</button></div>`;
        return;
    }
    
    groupsToRender.forEach(group => {
        if (group.type === 'schedule' && group.schedules) {
            sortSchedulesSmart(group.schedules);
        }
        if (!group.type) group.type = group.notes ? 'note' : (group.schedules ? 'schedule' : 'link');
        
        // Schedule and Kanban views also depend on time or workspace state.
        // Keep their existing render path; reuse only data-driven link/note cards.
        const canReuse = group.type === 'link' || group.type === 'note';
        const snapshot = canReuse ? JSON.stringify(group) : null;
        const previousCard = previousCards.get(String(group.id));
        if (canReuse && previousCard && dashboardCardSnapshots.get(previousCard) === snapshot) {
            nextCards.push(previousCard);
            return;
        }
        const groupCard = document.createElement('div');
        if (canReuse) dashboardCardSnapshots.set(groupCard, snapshot);
        let cardClassName = `group-card type-${group.type}`;
        let lockOverlayHTML = '';
        const isLockedCheck = group.pinKey && group.pinKey !== "" && group.isLocked;
        
        if (isLockedCheck) {
            cardClassName += ' is-locked-status';
            lockOverlayHTML = `<button class="lock-overlay-btn" onclick="triggerUnlockGroup('${group.id}')">🔒 Click to unlock</button>`;
        }
        
        groupCard.className = cardClassName;
        groupCard.setAttribute('data-id', group.id);
        groupCard.oncontextmenu = (e) => openContextMenu(e, `group-${group.type}`, group.id);

        const gEmoji = (group.emoji && group.emoji !== "NONE") ? `<span>${group.emoji}</span> ` : '';
        const tags = { link: 'Links', note: 'Notes', schedule: 'Schedule', kanban: 'Kanban' };
        const isCollapsed = group.collapsed || false;
        const shouldLazyRenderContent = isCollapsed;
        const safeTitle = escapeHTML(group.title || 'Untitled');
        const areaClass = getGroupContentAreaClass(group.type);

        groupCard.innerHTML = `
            <div class="group-header" onclick="toggleCollapseGroup('${group.id}')">
                <span class="group-title">${gEmoji}${safeTitle}${renderFolderTags(group)}</span>
                <div class="group-header-actions">
                    <button class="favorite-btn ${group.favorite ? 'active' : ''}" onclick="toggleFavoriteGroup('${group.id}', event)" title="Pin favorite group">${group.favorite ? '⭐' : '☆'}</button>
                    <span class="group-tag tag-${group.type}">${tags[group.type]}</span>
                    <span class="arrow-${group.id}" style="font-size: 10px; transition: transform 0.2s; display: inline-block; transform: ${isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'}; color: var(--text-sub);">▼</span>
                </div>
            </div>
            ${lockOverlayHTML}
            <div class="group-content-wrapper">
                <div class="${areaClass}" data-group-id="${group.id}" style="${isCollapsed ? 'display: none;' : ''}"></div>
            </div>
        `;

        const contentArea = groupCard.querySelector(`.${areaClass}`);
        if (isLockedCheck) {
            contentArea.innerHTML = `<span class="no-data-text" style="display:flex; justify-content:center; align-items:center; gap:5px;">🔒 Content hidden</span>`;
            nextCards.push(groupCard);
            return; 
        }

        if (shouldLazyRenderContent) {
            const count = (group.links?.length || 0) + (group.notes?.length || 0) + (group.schedules?.length || 0) + getKanbanCardCount(group);
            contentArea.innerHTML = `<span class="no-data-text mobile-lite-placeholder">${count} items. Expand the group to load content.</span>`;
            nextCards.push(groupCard);
            return;
        }

        if (group.type === 'link') {
            if (!group.links?.length) contentArea.innerHTML = `<span class="no-data-text">Right-click to add a link...</span>`;
            else {
                contentArea.innerHTML = getPinnedItemsForRender(group.links).map(({ item: link, originalIndex: idx }) => {
                    const lEmoji = (link.emoji && link.emoji !== "NONE") ? `<span>${link.emoji}</span> ` : '';
                    return `
                        <div class="item-wrapper ${link.pinned ? 'item-pinned' : ''}" data-index="${idx}">
                            <a href="${escapeHTML(link.url)}" target="_blank" class="link-button" oncontextmenu="openContextMenu(event, 'link', '${group.id}', ${idx})">
                                ${lEmoji}${escapeHTML(link.name)}
                            </a>
                        </div>`;
                }).join('');
            }
        } 
        else if (group.type === 'note') {
            if (!group.notes?.length) contentArea.innerHTML = `<span class="no-data-text">Right-click to add a note...</span>`;
            else {
                getPinnedItemsForRender(group.notes).forEach(({ item: note, originalIndex: idx }) => {
                    const nEmoji = (note.emoji && note.emoji !== "NONE") ? `<span>${note.emoji}</span> ` : '';
                    const item = document.createElement('div');
                    item.className = `item-wrapper ${note.pinned ? 'item-pinned' : ''}`;
                    item.setAttribute('data-index', idx);
                    const noteTags = normalizeNoteTags(note);
                    const tagPreview = noteTags.length
                        ? `<span class="note-button-tags">${noteTags.slice(0, 2).map(tag => `<span class="note-button-tag">${escapeHTML(noteTagLabel(tag))}</span>`).join('')}${noteTags.length > 2 ? `<span class="note-button-tag more">+${noteTags.length - 2}</span>` : ''}</span>`
                        : '';
                    item.innerHTML = `<div class="note-button note-button-with-tags" oncontextmenu="openContextMenu(event, 'note', '${group.id}', ${idx})"><span class="note-button-title">${nEmoji}${escapeHTML(note.title || "Note")}</span>${tagPreview}</div>`;
                    item.querySelector('.note-button').onclick = () => showContentDetail(group.id, idx, 'note');
                    contentArea.appendChild(item);
                });
            }
        } 
        else if (group.type === 'schedule') {
            if (!group.schedules?.length) contentArea.innerHTML = `<span class="no-data-text">Right-click to add a schedule...</span>`;
            else {
                const wrapper = document.createElement('div');
                wrapper.className = 'schedule-table-wrapper';
                const table = document.createElement('table');
                table.className = 'schedule-table';
                table.innerHTML = `<thead><tr><th style="width:20%">Date</th><th style="width:20%">Day</th><th style="width:30%;text-align:center">Deadline</th><th style="width:30%">Task</th></tr></thead><tbody></tbody>`;
                
                const tbody = table.querySelector('tbody');
                const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

                getPinnedItemsForRender(group.schedules).forEach(({ item: sch, originalIndex: idx }) => {
                    const row = document.createElement('tr');
                    const now = new Date();
                    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                    const todayTime = new Date(todayStr + ' 00:00:00');
                    
                    const startDateObj = new Date(sch.date + ' 00:00:00');
                    const endDateObj = new Date((sch.endDate || sch.date) + ' 00:00:00');
                    
                    let activeDateStr = sch.date;
                    if (todayTime > startDateObj && todayTime <= endDateObj) activeDateStr = todayStr;
                    else if (todayTime > endDateObj) activeDateStr = sch.endDate || sch.date;

                    const finalScheduleTime = new Date(`${sch.endDate || sch.date} ${sch.endTime || sch.time || "00:00"}`);
                    row.className = `schedule-row ${sch.pinned ? 'item-pinned' : ''} ${sch.important ? 'important' : ''} ${finalScheduleTime < now ? 'past' : ''}`;
                    row.onclick = () => showContentDetail(group.id, idx, 'schedule');
                    row.oncontextmenu = (e) => openContextMenu(e, 'schedule', group.id, idx);
                    
                    let displayDate = activeDateStr.split('-').reverse().slice(0,2).join('/');
                    let dayOfWeek = "---";
                    const parsedActiveDate = new Date(activeDateStr.replace(/-/g, '/'));
                    if (!isNaN(parsedActiveDate.getTime())) dayOfWeek = dayLabels[parsedActiveDate.getDay()];

                    row.setAttribute('data-start', `${sch.date}T${sch.time || '00:00'}`);
                    row.setAttribute('data-end', `${sch.endDate || sch.date}T${sch.endTime || sch.time || '00:00'}`);

                    row.innerHTML = `
                        <td class="schedule-date">${displayDate}</td>
                        <td class="schedule-date schedule-time" style="color:#38bdf8;font-weight:600">${dayOfWeek}</td>
                        <td class="schedule-countdown-cell" style="text-align:center;font-size:11px;font-weight:bold;font-family:monospace">⏳ Calculating...</td>
                        <td class="schedule-name">${sch.important ? '⚠️ ' : ''}${escapeHTML(sch.title || "")}</td>
                    `;
                    tbody.appendChild(row);
                });
                wrapper.appendChild(table);
                contentArea.appendChild(wrapper);
            }
        }
        else if (group.type === 'kanban') {
            if (!isCollapsed) {
                renderKanbanBoard(group, contentArea);
            }
        }
        nextCards.push(groupCard);
    });
    reconcileDashboardCards(container, nextCards);
    if (typeof initDragAndDrop === 'function') initDragAndDrop();
}

function toggleCollapseGroup(groupId) {
    const group = getGroup(groupId);
    if (!group) return;

    group.collapsed = !group.collapsed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));

    // Kanban và mobile-lite cần render lại khi mở ra vì lúc thu gọn mình không render nội dung để tránh lag.
    // Render lại toàn dashboard giúp đồng bộ arrow, placeholder và Sortable/drag-drop.
    renderDashboard();
}


// ==========================================================================

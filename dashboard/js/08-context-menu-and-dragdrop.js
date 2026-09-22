// 11. HỆ THỐNG CONTEXT MENU & DRAG-DROP (SORTABLE)
// ==========================================
function buildMoveSubMenuHTML(type, currentGroupId, itemIndex) {
    const targets = state.dashboardData.filter(g => g.type === type && g.id !== currentGroupId);
    if (!targets.length) return '';
    return `
        <div class="move-submenu-container" style="position:relative" onmouseenter="this.querySelector('.sub-items').style.display='block'" onmouseleave="this.querySelector('.sub-items').style.display='none'">
            <div class="context-menu-item">🔄 Move group</div>
            <div class="sub-items" style="display:none;position:absolute;left:100%;top:0;background:var(--context-bg);border:1px solid var(--border-color);border-radius:8px;width:180px;box-shadow:var(--shadow-main);z-index:2500">
                ${targets.map(g => `<div class="context-menu-item" onclick="event.stopPropagation();moveItem('${type}','${currentGroupId}',${itemIndex},'${g.id}')">${g.emoji && g.emoji !== 'NONE' ? g.emoji : '📁'} ${g.title}</div>`).join('')}
            </div>
        </div>`;
}

function openContextMenu(e, targetType, groupId, index = null) {
    e.preventDefault(); e.stopPropagation();
    state.activeGroupId = groupId; state.activeIndex = index;

    const menu = getEl('customContextMenu');
    const menuContent = getEl('menuItemsContent');
    if (!menu || !menuContent) return;
    
    menu.style.display = 'none'; menuContent.innerHTML = '';
    const group = getGroup(groupId);
    const hasPin = group?.pinKey && group.pinKey !== "";
    
    const lockMenuHTML = hasPin 
        ? `<div class="context-menu-divider"></div>${!group.isLocked ? `<div class="context-menu-item" onclick="quickLockGroup('${groupId}')">🔒 Lock group again</div>` : ''}<div class="context-menu-item" onclick="handleLockMenuAction('${groupId}')">🔓 Remove PIN</div>`
        : `<div class="context-menu-divider"></div><div class="context-menu-item" onclick="handleLockMenuAction('${groupId}')">🔒 Set PIN</div>`;

    const actions = {
        'group-link': `<div class="context-menu-item" onclick="openLinkModal('${groupId}')">➕ Add link button</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="toggleFavoriteGroup('${groupId}', event)">⭐ Pin / unpin group</div><div class="context-menu-item" onclick="openGroupModal('${groupId}','link')">📝 Edit group name</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Delete entire group</div>${lockMenuHTML}`,
        'group-note': `<div class="context-menu-item" onclick="openNoteModal('${groupId}')">➕ Add note button</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="toggleFavoriteGroup('${groupId}', event)">⭐ Pin / unpin group</div><div class="context-menu-item" onclick="openGroupModal('${groupId}','note')">📝 Edit group name</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Delete entire group</div>${lockMenuHTML}`,
        'group-schedule': `<div class="context-menu-item" onclick="openScheduleModal('${groupId}')">➕ Add schedule milestone</div><div class="context-menu-item" onclick="triggerExcelImport('${groupId}')">📥 Import from Excel</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="toggleFavoriteGroup('${groupId}', event)">⭐ Pin / unpin group</div><div class="context-menu-item" onclick="openGroupModal('${groupId}','schedule')">📝 Edit group name</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Delete entire group</div>${lockMenuHTML}`,
        'group-kanban': `<div class="context-menu-item" onclick="addKanbanBoard('${groupId}')">➕ Add kanban board</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="toggleFavoriteGroup('${groupId}', event)">⭐ Pin / unpin group</div><div class="context-menu-item" onclick="openGroupModal('${groupId}','kanban')">📝 Edit group name</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Delete entire group</div>${lockMenuHTML}`,
        'link': `<div class="context-menu-item" onclick="duplicateItem('link','${groupId}',${index})">✨ Duplicate button</div>${buildMoveSubMenuHTML('link',groupId,index)}<div class="context-menu-item" onclick="openLinkModal('${groupId}',${index})">📝 Edit button</div><div class="context-menu-item delete" onclick="triggerDelete('Link')">❌ Delete this button</div>`,
        'note': `<div class="context-menu-item" onclick="duplicateItem('note','${groupId}',${index})">✨ Duplicate note</div>${buildMoveSubMenuHTML('note',groupId,index)}<div class="context-menu-item" onclick="openNoteModal('${groupId}',${index})">📝 Edit note</div><div class="context-menu-item delete" onclick="triggerDelete('Note')">❌ Delete this note</div>`,
        'schedule': `<div class="context-menu-item" onclick="duplicateItem('schedule','${groupId}',${index})">✨ Duplicate milestone</div>${buildMoveSubMenuHTML('schedule',groupId,index)}<div class="context-menu-item" onclick="openScheduleModal('${groupId}',${index})">📝 Edit milestone</div><div class="context-menu-item delete" onclick="triggerDelete('Schedule')">❌ Delete this schedule milestone</div>`,
        'kanban-card': `<div class="context-menu-item" onclick="duplicateKanbanCard('${groupId}','${index}')">✨ Duplicate card</div><div class="context-menu-item" onclick="openKanbanCardModal('${groupId}',null,'${index}')">📝 Edit card</div><div class="context-menu-item delete" onclick="deleteKanbanCard('${groupId}','${index}')">❌ Delete this card</div>`
    };

    if (actions[targetType]) {
        menuContent.innerHTML = actions[targetType];
        Object.assign(menu.style, { display: 'block', left: `${e.pageX}px`, top: `${e.pageY}px` });
    }
}

function initDragAndDrop() {
    if (typeof Sortable === 'undefined') return;
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    const groupsContainer = getEl('groupsContainer');
    if (groupsContainer) {
        const existingGroupSortable = Sortable.get(groupsContainer);
        if (isAutoSortMode) {
            if (existingGroupSortable) existingGroupSortable.destroy();
        } else if (!existingGroupSortable) {
            Sortable.create(groupsContainer, {
                animation: 200, ghostClass: 'sortable-ghost-group', handle: '.group-title', forceFallback: isMobile, fallbackClass: 'sortable-fallback', fallbackTolerance: isMobile ? 10 : 5,
                onEnd: () => {
                    const order = Array.from(document.querySelectorAll('#groupsContainer .group-card')).map(c => c.getAttribute('data-id'));
                    state.dashboardData.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
                    saveData();
                }
            });
        }
    }

    document.querySelectorAll('.links-area, .notes-area, .schedules-area').forEach(area => {
        const groupId = area.getAttribute('data-group-id');
        const type = area.classList.contains('links-area') ? 'link' : (area.classList.contains('notes-area') ? 'note' : 'schedule');
        if (type === 'schedule') return;

        const existing = Sortable.get(area);
        if (existing && existing.option('forceFallback') === isMobile) return;
        if (existing) existing.destroy();
        Sortable.create(area, {
            animation: 150, ghostClass: 'sortable-ghost-link', delay: isMobile ? 300 : 0, delayOnTouchOnly: true, forceFallback: isMobile, fallbackTolerance: 4,
            onEnd: () => {
                const group = getGroup(groupId); if (!group) return;
                const key = `${type}s`;
                group[key] = Array.from(area.children).map(item => group[key][parseInt(item.getAttribute('data-index'))]).filter(Boolean);
                saveData();
            }
        });
    });
}


// ========================================================================== 
// KANBAN FOLDER MODULE - chạy tốt trên GitHub Pages, không cần backend
// ========================================================================== 
let kanbanModalState = { groupId: null, columnId: null, cardId: null };

function createDefaultKanbanBoard() {
    return {
        columns: [
            { id: 'todo', title: '📋 Todo', cards: [] },
            { id: 'doing', title: '⚙️ Doing', cards: [] },
            { id: 'review', title: '👀 Review', cards: [] },
            { id: 'done', title: '✅ Done', cards: [] }
        ]
    };
}

function normalizeKanbanGroup(group) {
    if (!group) return createDefaultKanbanBoard();
    if (!group.kanban || !Array.isArray(group.kanban.columns)) group.kanban = createDefaultKanbanBoard();
    group.kanban.columns.forEach((col, colIndex) => {
        if (!col.id) col.id = `col_${Date.now()}_${colIndex}`;
        if (!col.title) col.title = `Column ${colIndex + 1}`;
        if (!Array.isArray(col.cards)) col.cards = [];
        col.cards.forEach((card, cardIndex) => {
            if (!card.id) card.id = `card_${Date.now()}_${colIndex}_${cardIndex}`;
            if (!card.priority) card.priority = 'normal';
        });
    });
    return group.kanban;
}

function getKanbanCardCount(group) {
    if (!group || group.type !== 'kanban') return 0;
    const board = normalizeKanbanGroup(group);
    return board.columns.reduce((sum, col) => sum + (col.cards?.length || 0), 0);
}

function getKanbanColumn(group, columnId) {
    const board = normalizeKanbanGroup(group);
    return board.columns.find(col => col.id === columnId) || board.columns[0];
}

function findKanbanCard(group, cardId) {
    const board = normalizeKanbanGroup(group);
    for (const col of board.columns) {
        const index = col.cards.findIndex(card => card.id === cardId);
        if (index >= 0) return { column: col, index, card: col.cards[index] };
    }
    return null;
}

function renderKanbanBoard(group, contentArea) {
    const board = normalizeKanbanGroup(group);
    if (!board.columns.length) board.columns = createDefaultKanbanBoard().columns;

    contentArea.innerHTML = `
        <div class="kanban-toolbar">
            <button class="btn-primary kanban-mini-btn" onclick="event.stopPropagation();openKanbanCardModal('${group.id}')">➕ Card</button>
            <button class="btn-secondary kanban-mini-btn" onclick="event.stopPropagation();addKanbanColumn('${group.id}')">➕ Column</button>
            <span class="kanban-count">${getKanbanCardCount(group)} cards</span>
        </div>
        <div class="kanban-board" data-group-id="${group.id}">
            ${board.columns.map(col => `
                <section class="kanban-column" data-column-id="${col.id}">
                    <div class="kanban-column-head">
                        <strong>${escapeHTML(col.title)}</strong>
                        <span>${col.cards.length}</span>
                    </div>
                    <div class="kanban-column-actions">
                        <button onclick="event.stopPropagation();openKanbanCardModal('${group.id}','${col.id}')">＋ Card</button>
                        <button onclick="event.stopPropagation();renameKanbanColumn('${group.id}','${col.id}')">Edit</button>
                        <button onclick="event.stopPropagation();deleteKanbanColumn('${group.id}','${col.id}')">Delete</button>
                    </div>
                    <div class="kanban-card-list" data-group-id="${group.id}" data-column-id="${col.id}">
                        ${col.cards.map(card => renderKanbanCardHTML(group.id, card)).join('')}
                    </div>
                </section>
            `).join('')}
        </div>
    `;
}

function renderKanbanCardHTML(groupId, card) {
    const priority = card.priority || 'normal';
    const priorityText = priority === 'urgent' ? '🔴 Urgent' : (priority === 'important' ? '🟠 Important' : '🟢 Normal');
    const deadlineHTML = card.deadline ? `<span>📅 ${escapeHTML(card.deadline.split('-').reverse().join('/'))}</span>` : '';
    return `
        <article class="kanban-card priority-${priority}" data-card-id="${card.id}" onclick="openKanbanCardModal('${groupId}',null,'${card.id}')" oncontextmenu="openContextMenu(event, 'kanban-card', '${groupId}', '${card.id}')">
            <div class="kanban-card-title">${escapeHTML(card.title || 'Untitled card')}</div>
            ${card.content ? `<div class="kanban-card-desc">${escapeHTML(card.content).slice(0, 120)}</div>` : ''}
            <div class="kanban-card-meta"><span>${priorityText}</span>${deadlineHTML}</div>
        </article>
    `;
}

function openKanbanCardModal(groupId, columnId = null, cardId = null) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = normalizeKanbanGroup(group);
    const found = cardId ? findKanbanCard(group, cardId) : null;
    const firstColumn = board.columns[0];

    kanbanModalState = {
        groupId,
        columnId: found?.column?.id || columnId || firstColumn?.id,
        cardId: found?.card?.id || null
    };

    getEl('kanbanCardModalTitle').innerText = found ? '📝 Edit Kanban Card' : '➕ Add Kanban Card';
    getEl('kanbanCardTitleInput').value = found?.card?.title || '';
    getEl('kanbanCardPriorityInput').value = found?.card?.priority || 'normal';
    getEl('kanbanCardDeadlineInput').value = found?.card?.deadline || '';
    getEl('kanbanCardContentInput').value = found?.card?.content || '';
    openModal('kanbanCardModal');
}

function submitKanbanCardForm() {
    const group = getGroup(kanbanModalState.groupId);
    if (!group) return;
    const title = getEl('kanbanCardTitleInput')?.value.trim();
    if (!title) return;

    const data = {
        id: kanbanModalState.cardId || `card_${Date.now()}`,
        title,
        priority: getEl('kanbanCardPriorityInput')?.value || 'normal',
        deadline: getEl('kanbanCardDeadlineInput')?.value || '',
        content: getEl('kanbanCardContentInput')?.value || ''
    };

    if (kanbanModalState.cardId) {
        const found = findKanbanCard(group, kanbanModalState.cardId);
        if (found) found.column.cards[found.index] = data;
    } else {
        const column = getKanbanColumn(group, kanbanModalState.columnId);
        column.cards.push(data);
    }
    closeModal('kanbanCardModal');
    saveData();
}

function duplicateKanbanCard(groupId, cardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId);
    if (!found) return;
    const copy = JSON.parse(JSON.stringify(found.card));
    copy.id = `card_${Date.now()}`;
    copy.title = `${copy.title || 'Card'} (Copy)`;
    found.column.cards.splice(found.index + 1, 0, copy);
    saveData();
}

function deleteKanbanCard(groupId, cardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId);
    if (!found) return;
    customConfirm(`Delete card "${escapeHTML(found.card.title || 'Untitled')}"?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        found.column.cards.splice(found.index, 1);
        saveData();
    });
}

function addKanbanColumn(groupId) {
    const group = getGroup(groupId);
    if (!group) return;
    const title = window.prompt('Column name:', 'New Column');
    if (!title || !title.trim()) return;
    normalizeKanbanGroup(group).columns.push({ id: `col_${Date.now()}`, title: title.trim(), cards: [] });
    saveData();
}

function renameKanbanColumn(groupId, columnId) {
    const group = getGroup(groupId);
    const col = getKanbanColumn(group, columnId);
    if (!col) return;
    const title = window.prompt('Column name:', col.title);
    if (!title || !title.trim()) return;
    col.title = title.trim();
    saveData();
}

function deleteKanbanColumn(groupId, columnId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = normalizeKanbanGroup(group);
    const col = board.columns.find(c => c.id === columnId);
    if (!col) return;
    if (board.columns.length <= 1) return alert('Kanban must have at least one column.');
    customConfirm(`Delete column "${escapeHTML(col.title)}" and ${col.cards.length} cards inside?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        board.columns = board.columns.filter(c => c.id !== columnId);
        saveData();
    });
}

function initKanbanDragAndDrop() {
    if (typeof Sortable === 'undefined') return;
    document.querySelectorAll('.kanban-card-list').forEach(list => {
        if (Sortable.get(list)) Sortable.get(list).destroy();
        Sortable.create(list, {
            group: 'dashboard-kanban-cards',
            animation: 150,
            ghostClass: 'sortable-ghost-link',
            delay: window.innerWidth <= 768 ? 250 : 0,
            delayOnTouchOnly: true,
            onEnd: event => {
                const fromGroup = getGroup(event.from.dataset.groupId);
                const toGroup = getGroup(event.to.dataset.groupId);
                if (!fromGroup || !toGroup) return;
                const fromColumn = getKanbanColumn(fromGroup, event.from.dataset.columnId);
                const toColumn = getKanbanColumn(toGroup, event.to.dataset.columnId);
                const [moved] = fromColumn.cards.splice(event.oldIndex, 1);
                if (!moved) return;
                toColumn.cards.splice(event.newIndex, 0, moved);
                saveData();
            }
        });
    });
}

const __kanbanInitDragAndDrop = initDragAndDrop;
initDragAndDrop = function() {
    __kanbanInitDragAndDrop();
    initKanbanDragAndDrop();
};


// ========================================================================== 
// KANBAN WORKSPACE UPGRADE - fullscreen modal + multiple boards per folder
// ========================================================================== 
const KANBAN_LAYOUT_KEY = 'dashboardKanbanLayoutMode';
let kanbanWorkspaceState = { groupId: null, boardId: null };
let kanbanLayoutMode = localStorage.getItem(KANBAN_LAYOUT_KEY) || 'column';
let kanbanCardEditState = { groupId: null, boardId: null, columnId: null, cardId: null };

function createDefaultKanbanBoard(title = 'Main Board') {
    return {
        id: `board_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`,
        title,
        columns: [
            { id: 'todo', title: '📋 Todo', cards: [] },
            { id: 'doing', title: '⚙️ Doing', cards: [] },
            { id: 'review', title: '👀 Review', cards: [] },
            { id: 'done', title: '✅ Done', cards: [] }
        ]
    };
}

function createDefaultKanbanWorkspace() {
    return { boards: [createDefaultKanbanBoard('Main Board')] };
}

function normalizeKanbanGroup(group) {
    if (!group) return createDefaultKanbanWorkspace();
    if (!group.kanban) group.kanban = createDefaultKanbanWorkspace();

    // Convert old single-board structure { columns: [...] } to workspace { boards: [...] }
    if (Array.isArray(group.kanban.columns)) {
        group.kanban = {
            boards: [{
                id: group.kanban.id || `board_${Date.now()}`,
                title: group.kanban.title || 'Main Board',
                columns: group.kanban.columns
            }]
        };
    }

    if (!Array.isArray(group.kanban.boards) || !group.kanban.boards.length) {
        group.kanban.boards = [createDefaultKanbanBoard('Main Board')];
    }

    group.kanban.boards.forEach((board, boardIndex) => {
        if (!board.id) board.id = `board_${Date.now()}_${boardIndex}`;
        if (!board.title) board.title = `Board ${boardIndex + 1}`;
        if (!Array.isArray(board.columns) || !board.columns.length) board.columns = createDefaultKanbanBoard().columns;
        board.columns.forEach((col, colIndex) => {
            if (!col.id) col.id = `col_${Date.now()}_${boardIndex}_${colIndex}`;
            if (!col.title) col.title = `Column ${colIndex + 1}`;
            if (!Array.isArray(col.cards)) col.cards = [];
            col.cards.forEach((card, cardIndex) => {
                if (!card.id) card.id = `card_${Date.now()}_${boardIndex}_${colIndex}_${cardIndex}`;
                if (!card.priority) card.priority = 'normal';
                if (!card.title) card.title = 'Untitled card';
            });
        });
    });
    return group.kanban;
}

function getKanbanBoard(group, boardId = null) {
    const workspace = normalizeKanbanGroup(group);
    return workspace.boards.find(board => board.id === boardId) || workspace.boards[0];
}

function getKanbanCardCount(group, boardId = null) {
    if (!group || group.type !== 'kanban') return 0;
    const workspace = normalizeKanbanGroup(group);
    const boards = boardId ? [getKanbanBoard(group, boardId)] : workspace.boards;
    return boards.reduce((sum, board) => sum + board.columns.reduce((s, col) => s + (col.cards?.length || 0), 0), 0);
}

function getKanbanColumn(group, columnId, boardId = null) {
    const board = getKanbanBoard(group, boardId || kanbanWorkspaceState.boardId);
    return board.columns.find(col => col.id === columnId) || board.columns[0];
}

function findKanbanCard(group, cardId, boardId = null) {
    const workspace = normalizeKanbanGroup(group);
    const boards = boardId ? [getKanbanBoard(group, boardId)] : workspace.boards;
    for (const board of boards) {
        for (const col of board.columns) {
            const index = col.cards.findIndex(card => card.id === cardId);
            if (index >= 0) return { board, column: col, index, card: col.cards[index] };
        }
    }
    return null;
}

function renderKanbanBoard(group, contentArea) {
    const workspace = normalizeKanbanGroup(group);
    const totalCards = getKanbanCardCount(group);
    const boardStats = workspace.boards.map(board => ({
        title: board.title,
        cards: getKanbanCardCount(group, board.id),
        columns: board.columns.length
    }));

    contentArea.innerHTML = `
        <div class="kanban-folder-summary" onclick="event.stopPropagation();openKanbanWorkspace('${group.id}')">
            <div class="kanban-summary-top">
                <div>
                    <strong>📌 Kanban Workspace</strong>
                    <small>${workspace.boards.length} boards · ${totalCards} cards</small>
                </div>
                <button class="btn-primary kanban-open-btn" onclick="event.stopPropagation();openKanbanWorkspace('${group.id}')">Open Board</button>
            </div>
            <div class="kanban-summary-grid">
                ${boardStats.slice(0, 6).map(stat => `
                    <div class="kanban-summary-board">
                        <span>${escapeHTML(stat.title)}</span>
                        <b>${stat.cards}</b>
                        <small>${stat.columns} columns</small>
                    </div>
                `).join('')}
                ${boardStats.length > 6 ? `<div class="kanban-summary-board more"><span>More</span><b>+${boardStats.length - 6}</b><small>boards</small></div>` : ''}
            </div>
        </div>
    `;
}

function ensureKanbanWorkspaceModal() {
    if (getEl('kanbanWorkspaceModal')) return;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay kanban-workspace-overlay';
    modal.id = 'kanbanWorkspaceModal';
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
                <button class="btn-secondary" onclick="renameKanbanBoard()">📝 Rename board</button>
                <button class="btn-secondary" onclick="addKanbanColumn()">➕ Column</button>
                <button class="btn-secondary" id="kanbanLayoutToggleBtn" onclick="toggleKanbanLayoutMode()">⇄ Row view</button>
                <button class="btn-primary" onclick="openKanbanCardModal()">➕ Card</button>
                <input id="kanbanWorkspaceSearch" type="search" placeholder="Search cards..." oninput="renderKanbanWorkspaceBody()">
            </div>
            <div class="kanban-workspace-layout">
                <aside id="kanbanBoardList" class="kanban-board-list"></aside>
                <main id="kanbanWorkspaceBody" class="kanban-workspace-body"></main>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openKanbanWorkspace(groupId, boardId = null) {
    const group = getGroup(groupId);
    if (!group) return;
    const workspace = normalizeKanbanGroup(group);
    kanbanWorkspaceState = { groupId, boardId: boardId || kanbanWorkspaceState.boardId || workspace.boards[0].id };
    if (!workspace.boards.some(board => board.id === kanbanWorkspaceState.boardId)) kanbanWorkspaceState.boardId = workspace.boards[0].id;
    ensureKanbanWorkspaceModal();
    getEl('kanbanWorkspaceTitle').textContent = `${group.emoji && group.emoji !== 'NONE' ? group.emoji + ' ' : '📌 '}${group.title || 'Kanban Workspace'}`;
    renderKanbanWorkspaceBody();
    openModal('kanbanWorkspaceModal');
}


function toggleKanbanLayoutMode() {
    kanbanLayoutMode = kanbanLayoutMode === 'row' ? 'column' : 'row';
    localStorage.setItem(KANBAN_LAYOUT_KEY, kanbanLayoutMode);
    renderKanbanWorkspaceBody();
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
                <small>${getKanbanCardCount(group, board.id)} cards</small>
            </button>
        `).join('') + `
            <button class="kanban-board-tab add" onclick="addKanbanBoard()">＋ New board</button>
        `;
    }

    const body = getEl('kanbanWorkspaceBody');
    if (!body) return;
    getEl('kanbanWorkspaceSubtitle').textContent = `${workspace.boards.length} boards · ${getKanbanCardCount(group)} total cards · Active: ${activeBoard.title}`;

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

function renderKanbanWorkspaceCardHTML(groupId, boardId, card) {
    const priority = card.priority || 'normal';
    const priorityText = priority === 'urgent' ? '🔴 Urgent' : (priority === 'important' ? '🟠 Important' : '🟢 Normal');
    const deadlineHTML = card.deadline ? `<span>📅 ${escapeHTML(card.deadline.split('-').reverse().join('/'))}</span>` : '';
    return `
        <article class="kanban-card priority-${priority}" data-card-id="${card.id}" onclick="openKanbanCardModal('${groupId}',null,'${card.id}','${boardId}')" oncontextmenu="openContextMenu(event, 'kanban-card', '${groupId}', '${card.id}')">
            <div class="kanban-card-title">${escapeHTML(card.title || 'Untitled card')}</div>
            ${card.content ? `<div class="kanban-card-desc">${escapeHTML(card.content).slice(0, 180)}</div>` : ''}
            <div class="kanban-card-meta"><span>${priorityText}</span>${deadlineHTML}</div>
        </article>
    `;
}

function addKanbanBoard(groupId = kanbanWorkspaceState.groupId) {
    const group = getGroup(groupId);
    if (!group) return;
    const title = window.prompt('Board name:', 'New Board');
    if (!title || !title.trim()) return;
    const board = createDefaultKanbanBoard(title.trim());
    normalizeKanbanGroup(group).boards.push(board);
    kanbanWorkspaceState.groupId = group.id;
    kanbanWorkspaceState.boardId = board.id;
    saveData();
    openKanbanWorkspace(group.id, board.id);
}

function renameKanbanBoard(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const title = window.prompt('Board name:', board.title);
    if (!title || !title.trim()) return;
    board.title = title.trim();
    saveData();
    openKanbanWorkspace(group.id, board.id);
}

function deleteKanbanBoard(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const workspace = normalizeKanbanGroup(group);
    if (workspace.boards.length <= 1) return alert('Kanban workspace must have at least one board.');
    const board = getKanbanBoard(group, boardId);
    customConfirm(`Delete board "${escapeHTML(board.title)}" and all cards inside?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        workspace.boards = workspace.boards.filter(item => item.id !== board.id);
        kanbanWorkspaceState.boardId = workspace.boards[0].id;
        saveData();
        openKanbanWorkspace(group.id, kanbanWorkspaceState.boardId);
    });
}

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
    openModal('kanbanCardModal');
}

function submitKanbanCardForm() {
    const group = getGroup(kanbanCardEditState.groupId);
    if (!group) return;
    const title = getEl('kanbanCardTitleInput')?.value.trim();
    if (!title) return;
    const data = {
        id: kanbanCardEditState.cardId || `card_${Date.now()}`,
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
    saveData();
    if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, kanbanCardEditState.boardId);
}

function addKanbanColumn(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const title = window.prompt('Column name:', 'New Column');
    if (!title || !title.trim()) return;
    board.columns.push({ id: `col_${Date.now()}`, title: title.trim(), cards: [] });
    saveData();
    if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, board.id);
}

function renameKanbanColumn(groupId, columnId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    const col = getKanbanColumn(group, columnId, boardId);
    if (!col) return;
    const title = window.prompt('Column name:', col.title);
    if (!title || !title.trim()) return;
    col.title = title.trim();
    saveData();
    if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, boardId);
}

function deleteKanbanColumn(groupId, columnId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const col = board.columns.find(c => c.id === columnId);
    if (!col) return;
    if (board.columns.length <= 1) return alert('Kanban must have at least one column.');
    customConfirm(`Delete column "${escapeHTML(col.title)}" and ${col.cards.length} cards inside?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        board.columns = board.columns.filter(c => c.id !== columnId);
        saveData();
        if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, board.id);
    });
}

function duplicateKanbanCard(groupId, cardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId);
    if (!found) return;
    const copy = JSON.parse(JSON.stringify(found.card));
    copy.id = `card_${Date.now()}`;
    copy.title = `${copy.title || 'Card'} (Copy)`;
    found.column.cards.splice(found.index + 1, 0, copy);
    saveData();
    if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, found.board.id);
}

function deleteKanbanCard(groupId, cardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId);
    if (!found) return;
    customConfirm(`Delete card "${escapeHTML(found.card.title || 'Untitled')}"?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        found.column.cards.splice(found.index, 1);
        saveData();
        if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, found.board.id);
    });
}

function initKanbanWorkspaceDragAndDrop() {
    if (typeof Sortable === 'undefined') return;
    document.querySelectorAll('.kanban-workspace-card-list').forEach(list => {
        if (Sortable.get(list)) Sortable.get(list).destroy();
        Sortable.create(list, {
            group: `kanban-board-${list.dataset.groupId}-${list.dataset.boardId}`,
            animation: 150,
            ghostClass: 'sortable-ghost-link',
            delay: window.innerWidth <= 768 ? 180 : 0,
            delayOnTouchOnly: true,
            onEnd: event => {
                const group = getGroup(event.from.dataset.groupId);
                if (!group) return;
                const boardId = event.from.dataset.boardId;
                const fromColumn = getKanbanColumn(group, event.from.dataset.columnId, boardId);
                const toColumn = getKanbanColumn(group, event.to.dataset.columnId, boardId);
                const [moved] = fromColumn.cards.splice(event.oldIndex, 1);
                if (!moved) return;
                toColumn.cards.splice(event.newIndex, 0, moved);
                saveData();
                renderKanbanWorkspaceBody();
            }
        });
    });
}


const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// ==========================================

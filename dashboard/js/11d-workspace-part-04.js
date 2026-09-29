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

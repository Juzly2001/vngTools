// 6. THAO TÁC FORM NGHIỆP VỤ (THÊM / SỬA / XÓA PHẦN TỬ)
// ==========================================================================
function openGroupModal(editGroupId = false, defaultType = 'link') {
    state.currentGroupType = defaultType;
    state.isEditMode = !!editGroupId;
    state.activeGroupId = editGroupId;

    const titleEl = getEl('groupModalTitle');
    const nameInput = getEl('groupNameInput');
    const submitBtn = getEl('submitGroupBtn');
    if (submitBtn) submitBtn.textContent = state.isEditMode ? 'Save changes' : 'Create group';

    if (state.isEditMode) {
        const group = getGroup(editGroupId);
        if (titleEl) titleEl.innerText = "📝 Edit Group Name/Icon";
        if (nameInput) nameInput.value = group ? group.title : '';
        const tagInput = getEl('groupTagsInput'); if (tagInput) tagInput.value = tagsToString(group?.tags);
        buildEmojiPicker('groupEmojiGrid', group ? (group.emoji || "NONE") : "NONE");
    } else {
        const typeTexts = { link: "Link Group", note: "Note Group", schedule: "Schedule Group", kanban: "Kanban Group" };
        if (titleEl) titleEl.innerText = `📌 Create ${typeTexts[defaultType] || 'Group'} New`;
        if (nameInput) nameInput.value = '';
        const tagInput = getEl('groupTagsInput'); if (tagInput) tagInput.value = '';
        buildEmojiPicker('groupEmojiGrid', "NONE");
    }
    openModal('groupModal');
}

function submitGroupForm() {
    const name = getEl('groupNameInput')?.value.trim();
    const tags = parseTags(getEl('groupTagsInput')?.value || '');
    if (!name) return;

    if (state.isEditMode) {
        const group = getGroup(state.activeGroupId);
        if (group) { group.title = name; group.emoji = state.selectedEmoji; group.tags = tags; }
    } else {
        const newGroup = { id: 'g_' + Date.now(), title: name, emoji: state.selectedEmoji, type: state.currentGroupType, tags };
        if (state.currentGroupType === 'kanban') {
            newGroup.kanban = createDefaultKanbanBoard();
        } else {
            newGroup[`${state.currentGroupType}s`] = [];
        }
        state.dashboardData.push(newGroup);
    }
    saveData(); 
    closeModal('groupModal');
}




// ============================================================================
// NOTE DEADLINE CALENDAR
// ============================================================================
let noteDeadlineCalendarView = new Date();
let noteDeadlineCalendarSelected = null;

function pad2(value) {
    return String(value).padStart(2, '0');
}

function localDateTimeValue(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function parseLocalDateTimeValue(value) {
    if (!value) return null;
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, y, m, d, hh, mm] = match;
    const date = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), 0, 0);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatNoteDeadlineDisplay(value) {
    const date = parseLocalDateTimeValue(value);
    if (!date) return 'No deadline';
    return date.toLocaleString([], {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function updateNoteDeadlineButton() {
    const value = getEl('noteDeadlineInput')?.value || '';
    const display = getEl('noteDeadlineDisplay');
    const button = getEl('noteDeadlineButton');
    if (display) display.textContent = formatNoteDeadlineDisplay(value);
    if (button) button.classList.toggle('has-value', !!value);
}

function populateNoteDeadlineTime() {
    const hour = getEl('noteDeadlineHour');
    const minute = getEl('noteDeadlineMinute');
    if (!hour || !minute || hour.options.length) return;

    hour.innerHTML = Array.from({ length: 24 }, (_, i) =>
        `<option value="${pad2(i)}">${pad2(i)}</option>`
    ).join('');

    minute.innerHTML = ['00','05','10','15','20','25','30','35','40','45','50','55']
        .map(v => `<option value="${v}">${v}</option>`)
        .join('');
}

function openNoteDeadlinePicker() {
    populateNoteDeadlineTime();

    const current = parseLocalDateTimeValue(getEl('noteDeadlineInput')?.value || '');
    const now = new Date();
    const base = current || now;

    noteDeadlineCalendarSelected = current ? new Date(current) : null;
    noteDeadlineCalendarView = new Date(base.getFullYear(), base.getMonth(), 1);

    if (getEl('noteDeadlineHour')) getEl('noteDeadlineHour').value = current ? pad2(current.getHours()) : '18';
    if (getEl('noteDeadlineMinute')) {
        const minute = current ? current.getMinutes() : 0;
        const rounded = Math.round(minute / 5) * 5;
        getEl('noteDeadlineMinute').value = pad2(rounded === 60 ? 55 : rounded);
    }

    renderNoteDeadlineCalendar();
    openModal('noteDeadlineModal');
}

function changeNoteDeadlineMonth(delta) {
    noteDeadlineCalendarView = new Date(
        noteDeadlineCalendarView.getFullYear(),
        noteDeadlineCalendarView.getMonth() + delta,
        1
    );
    renderNoteDeadlineCalendar();
}

function noteDeadlineGoToday() {
    const now = new Date();
    noteDeadlineCalendarView = new Date(now.getFullYear(), now.getMonth(), 1);
    renderNoteDeadlineCalendar();
}

function sameCalendarDay(a, b) {
    return a && b &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function renderNoteDeadlineCalendar() {
    const grid = getEl('noteCalendarGrid');
    const label = getEl('noteCalendarMonthLabel');
    if (!grid || !label) return;

    const year = noteDeadlineCalendarView.getFullYear();
    const month = noteDeadlineCalendarView.getMonth();
    label.textContent = noteDeadlineCalendarView.toLocaleDateString([], { month:'long', year:'numeric' });

    const first = new Date(year, month, 1);
    const mondayIndex = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const today = new Date();

    const cells = [];
    for (let i = 0; i < 42; i++) {
        let date;
        let outside = false;

        if (i < mondayIndex) {
            date = new Date(year, month - 1, daysInPrev - mondayIndex + i + 1);
            outside = true;
        } else if (i >= mondayIndex + daysInMonth) {
            date = new Date(year, month + 1, i - (mondayIndex + daysInMonth) + 1);
            outside = true;
        } else {
            date = new Date(year, month, i - mondayIndex + 1);
        }

        const selected = sameCalendarDay(date, noteDeadlineCalendarSelected);
        const isToday = sameCalendarDay(date, today);
        const timestamp = date.getTime();

        cells.push(`<button type="button"
            class="note-calendar-day ${outside ? 'outside' : ''} ${selected ? 'selected' : ''} ${isToday ? 'today' : ''}"
            onclick="selectNoteDeadlineDay(${timestamp})">
            <span>${date.getDate()}</span>
        </button>`);
    }

    grid.innerHTML = cells.join('');
    updateNoteDeadlineSummary();
}

function selectNoteDeadlineDay(timestamp) {
    const picked = new Date(timestamp);
    const hour = Number(getEl('noteDeadlineHour')?.value || 18);
    const minute = Number(getEl('noteDeadlineMinute')?.value || 0);
    picked.setHours(hour, minute, 0, 0);

    noteDeadlineCalendarSelected = picked;
    noteDeadlineCalendarView = new Date(picked.getFullYear(), picked.getMonth(), 1);
    renderNoteDeadlineCalendar();
}

function noteDeadlineQuick(type) {
    const now = new Date();
    const picked = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0, 0);
    if (type === 'tomorrow') picked.setDate(picked.getDate() + 1);
    if (type === 'week') picked.setDate(picked.getDate() + 7);

    noteDeadlineCalendarSelected = picked;
    noteDeadlineCalendarView = new Date(picked.getFullYear(), picked.getMonth(), 1);

    if (getEl('noteDeadlineHour')) getEl('noteDeadlineHour').value = '18';
    if (getEl('noteDeadlineMinute')) getEl('noteDeadlineMinute').value = '00';
    renderNoteDeadlineCalendar();
}

function updateNoteDeadlineSummary() {
    const summary = getEl('noteDeadlineSelectedSummary');
    if (!summary) return;

    if (!noteDeadlineCalendarSelected) {
        summary.textContent = 'No date selected';
        return;
    }

    const copy = new Date(noteDeadlineCalendarSelected);
    copy.setHours(
        Number(getEl('noteDeadlineHour')?.value || 18),
        Number(getEl('noteDeadlineMinute')?.value || 0),
        0, 0
    );

    summary.textContent = copy.toLocaleString([], {
        weekday:'long',
        day:'2-digit',
        month:'long',
        year:'numeric',
        hour:'2-digit',
        minute:'2-digit'
    });
}

function applyNoteDeadline() {
    if (!noteDeadlineCalendarSelected) {
        clearNoteDeadline();
        return;
    }

    const selected = new Date(noteDeadlineCalendarSelected);
    selected.setHours(
        Number(getEl('noteDeadlineHour')?.value || 18),
        Number(getEl('noteDeadlineMinute')?.value || 0),
        0, 0
    );

    if (getEl('noteDeadlineInput')) {
        getEl('noteDeadlineInput').value = localDateTimeValue(selected);
    }
    updateNoteDeadlineButton();
    closeModal('noteDeadlineModal');
}

function clearNoteDeadline() {
    noteDeadlineCalendarSelected = null;
    if (getEl('noteDeadlineInput')) getEl('noteDeadlineInput').value = '';
    updateNoteDeadlineButton();
    closeModal('noteDeadlineModal');
}

document.addEventListener('change', event => {
    if (event.target?.id === 'noteDeadlineHour' || event.target?.id === 'noteDeadlineMinute') {
        updateNoteDeadlineSummary();
    }
});

// ============================================================================
// NOTE V4 — CLEAN IMPLEMENTATION
// ============================================================================
let richNotePinned = false;
let savedNoteSelection = null;

function showAppNotice(message, title = 'Notice', icon = 'ℹ️') {
    if (getEl('appNoticeTitle')) getEl('appNoticeTitle').textContent = title;
    if (getEl('appNoticeMessage')) getEl('appNoticeMessage').textContent = String(message ?? '');
    if (getEl('appNoticeIcon')) getEl('appNoticeIcon').textContent = icon;
    openModal('appNoticeModal');
}
window.alert = function(message) {
    showAppNotice(message, 'Notice', 'ℹ️');
};

function updateNoteHeaderIcon() {
    const emoji = state.selectedEmoji && state.selectedEmoji !== 'NONE' ? state.selectedEmoji : '📝';
    if (getEl('noteHeaderIcon')) getEl('noteHeaderIcon').textContent = emoji;
    if (getEl('noteIconButtonEmoji')) getEl('noteIconButtonEmoji').textContent = emoji;
}

function toggleRichNotePin() {
    richNotePinned = !richNotePinned;
    getEl('notePinBtn')?.classList.toggle('active', richNotePinned);
    if (getEl('notePinLabel')) getEl('notePinLabel').textContent = richNotePinned ? 'Pinned' : 'Pin';
}

function saveNoteSelection() {
    const editor = getEl('noteRichEditor');
    const selection = window.getSelection();
    if (!editor || !selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
        savedNoteSelection = range.cloneRange();
    }
}

function restoreNoteSelection() {
    if (!savedNoteSelection) return false;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedNoteSelection);
    return true;
}

function noteFormat(command, value = null) {
    restoreNoteSelection();
    getEl('noteRichEditor')?.focus();
    document.execCommand(command, false, value);
    saveNoteSelection();
}

function noteBlock(tag) {
    restoreNoteSelection();
    getEl('noteRichEditor')?.focus();
    document.execCommand('formatBlock', false, tag);
    saveNoteSelection();
}

function openNoteLinkModal() {
    saveNoteSelection();
    if (getEl('noteLinkUrlInput')) getEl('noteLinkUrlInput').value = '';
    openModal('noteLinkModal');
    setTimeout(() => getEl('noteLinkUrlInput')?.focus(), 60);
}

function insertNoteLink() {
    const raw = getEl('noteLinkUrlInput')?.value.trim();
    if (!raw) {
        showAppNotice('Please enter a URL.', 'Insert link', '🔗');
        return;
    }
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    closeModal('noteLinkModal');
    restoreNoteSelection();
    getEl('noteRichEditor')?.focus();
    document.execCommand('createLink', false, url);
    saveNoteSelection();
}

function openNoteTablePicker() {
    saveNoteSelection();
    if (getEl('noteTableRows')) getEl('noteTableRows').value = 3;
    if (getEl('noteTableCols')) getEl('noteTableCols').value = 3;
    openModal('noteTableModal');
}

function insertNoteTable() {
    const rows = Math.min(20, Math.max(1, Number(getEl('noteTableRows')?.value || 3)));
    const cols = Math.min(10, Math.max(1, Number(getEl('noteTableCols')?.value || 3)));

    let table = '<table><tbody>';
    for (let r = 0; r < rows; r++) {
        table += '<tr>';
        for (let c = 0; c < cols; c++) {
            table += r === 0 ? '<th><br></th>' : '<td><br></td>';
        }
        table += '</tr>';
    }
    table += '</tbody></table><p><br></p>';

    closeModal('noteTableModal');
    restoreNoteSelection();
    getEl('noteRichEditor')?.focus();
    document.execCommand('insertHTML', false, table);
    saveNoteSelection();
}

function noteIconSearchText(emoji) {
    const group = EMOJI_GROUPS.find(g => g.icons?.includes(emoji));
    return `${emoji} ${group?.name || ''}`.toLowerCase();
}

function openNoteIconPicker() {
    if (getEl('noteIconSearch')) getEl('noteIconSearch').value = '';
    renderNoteIconPicker();
    openModal('noteIconModal');
    setTimeout(() => getEl('noteIconSearch')?.focus(), 60);
}

function renderNoteIconPicker() {
    const grid = getEl('noteIconGrid');
    if (!grid) return;

    const query = (getEl('noteIconSearch')?.value || '').trim().toLowerCase();
    const icons = EMOJI_LIST.filter(icon => !query || noteIconSearchText(icon).includes(query));

    grid.innerHTML = icons.map(emoji => {
        const selected = emoji === state.selectedEmoji;
        const label = emoji === 'NONE' ? 'None' : emoji;
        return `<button type="button"
            class="note-v4-icon-item ${emoji === 'NONE' ? 'note-v4-icon-none' : ''} ${selected ? 'selected' : ''}"
            onclick="selectNoteIcon('${escapeHTML(emoji)}')"
            title="${emoji === 'NONE' ? 'No icon' : escapeHTML(emoji)}">${emoji === 'NONE' ? 'None' : label}</button>`;
    }).join('');
}

function selectNoteIcon(emoji) {
    state.selectedEmoji = emoji || 'NONE';
    saveRecentEmoji(state.selectedEmoji);
    updateNoteHeaderIcon();
    closeModal('noteIconModal');
}

function noteChecklistRowHTML(item = {}) {
    const id = item.id || (crypto.randomUUID
        ? crypto.randomUUID()
        : `check-${Date.now()}-${Math.random().toString(16).slice(2)}`);

    return `<div class="note-v4-checklist-row" data-item-id="${escapeHTML(id)}">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="updateRichChecklistCount()">
        <input type="text" value="${escapeHTML(item.text || '')}" placeholder="Checklist item"
               oninput="updateRichChecklistCount()">
        <button class="note-v4-checklist-remove" type="button"
                onclick="this.closest('.note-v4-checklist-row').remove(); updateRichChecklistCount();"
                title="Remove">×</button>
    </div>`;
}

function renderRichNoteChecklist(items = []) {
    const wrap = getEl('noteChecklistEditor');
    if (!wrap) return;
    wrap.innerHTML = (Array.isArray(items) ? items : []).map(noteChecklistRowHTML).join('');
    updateRichChecklistCount();
}

function addRichNoteChecklistItem() {
    const wrap = getEl('noteChecklistEditor');
    if (!wrap) return;
    wrap.insertAdjacentHTML('beforeend', noteChecklistRowHTML());
    updateRichChecklistCount();
    wrap.lastElementChild?.querySelector('input[type="text"]')?.focus();
}

function updateRichChecklistCount() {
    const rows = [...document.querySelectorAll('#noteChecklistEditor .note-v4-checklist-row')];
    const done = rows.filter(row => row.querySelector('input[type="checkbox"]')?.checked).length;

    if (getEl('noteChecklistCount')) {
        getEl('noteChecklistCount').textContent =
            `${rows.length} item${rows.length === 1 ? '' : 's'} · ${done} done`;
    }
    if (getEl('noteChecklistEmpty')) {
        getEl('noteChecklistEmpty').style.display = rows.length ? 'none' : 'block';
    }
}

function collectRichChecklist() {
    return [...document.querySelectorAll('#noteChecklistEditor .note-v4-checklist-row')]
        .map(row => ({
            id: row.dataset.itemId || '',
            text: row.querySelector('input[type="text"]')?.value.trim() || '',
            done: !!row.querySelector('input[type="checkbox"]')?.checked
        }))
        .filter(item => item.text);
}

function sanitizeRichNoteHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html || '';

    const allowedTags = new Set([
        'B','STRONG','I','EM','U','S','STRIKE','P','DIV','BR',
        'H2','H3','UL','OL','LI','A','TABLE','TBODY','THEAD','TR','TH','TD'
    ]);

    const walk = node => {
        [...node.children].forEach(child => {
            if (!allowedTags.has(child.tagName)) {
                child.replaceWith(...child.childNodes);
                return;
            }

            [...child.attributes].forEach(attr => {
                const name = attr.name.toLowerCase();
                if (!(child.tagName === 'A' && ['href','target','rel'].includes(name))) {
                    child.removeAttribute(attr.name);
                }
            });

            if (child.tagName === 'A') {
                const href = child.getAttribute('href') || '';
                if (!/^https?:\/\//i.test(href)) {
                    child.removeAttribute('href');
                } else {
                    child.setAttribute('target', '_blank');
                    child.setAttribute('rel', 'noopener noreferrer');
                }
            }
            walk(child);
        });
    };

    walk(template.content);
    return template.innerHTML;
}

function richNotePlainText(html) {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return div.innerText || '';
}

const NOTE_TAG_PRESETS = {
    work: '💼 Work',
    personal: '👤 Personal',
    urgent: '🔥 Urgent',
    idea: '💡 Idea',
    study: '📚 Study',
    reference: '📎 Reference'
};
let noteSelectedTags = [];

function categoryLabel(id) {
    return NOTE_TAG_PRESETS[id] || '';
}

function noteTagLabel(tag) {
    const key = String(tag || '').trim();
    return NOTE_TAG_PRESETS[key] || key;
}

function normalizeNoteTags(note) {
    const tags = Array.isArray(note?.tags) ? note.tags : [];
    const legacy = note?.category ? [note.category] : [];
    return [...new Set([...tags, ...legacy].map(v => String(v || '').trim()).filter(Boolean))];
}

function renderNoteTagsPicker() {
    const presetBox = getEl('noteTagsPresetList');
    const selectedBox = getEl('noteTagsSelected');
    const summary = getEl('noteTagsSummary');
    if (!presetBox || !selectedBox || !summary) return;

    presetBox.innerHTML = Object.entries(NOTE_TAG_PRESETS).map(([key, label]) => {
        const active = noteSelectedTags.includes(key);
        return `<button type="button" class="note-tag-option ${active ? 'active' : ''}" onclick="toggleNoteTag('${key}')"><span>${escapeHTML(label)}</span><b>${active ? '✓' : '+'}</b></button>`;
    }).join('');

    selectedBox.innerHTML = noteSelectedTags.length
        ? noteSelectedTags.map(tag => `<button type="button" class="note-tag-chip" onclick="removeNoteTag('${escapeHTML(String(tag)).replace(/'/g, '&#39;')}')" title="Remove tag"><span>${escapeHTML(noteTagLabel(tag))}</span><b>×</b></button>`).join('')
        : '<span class="note-tags-empty">No tags selected</span>';

    summary.textContent = noteSelectedTags.length
        ? (noteSelectedTags.length === 1 ? noteTagLabel(noteSelectedTags[0]) : `${noteSelectedTags.length} tags selected`)
        : 'Choose tags';
}

function toggleNoteTag(tag) {
    const key = String(tag || '').trim();
    if (!key) return;
    noteSelectedTags = noteSelectedTags.includes(key)
        ? noteSelectedTags.filter(t => t !== key)
        : [...noteSelectedTags, key];
    renderNoteTagsPicker();
}

function removeNoteTag(tag) {
    noteSelectedTags = noteSelectedTags.filter(t => t !== String(tag || ''));
    renderNoteTagsPicker();
}

function addCustomNoteTag() {
    const input = getEl('noteCustomTagInput');
    const raw = String(input?.value || '').trim().replace(/\s+/g, ' ');
    if (!raw) return;
    const duplicate = noteSelectedTags.some(tag => noteTagLabel(tag).toLowerCase() === raw.toLowerCase());
    if (!duplicate) noteSelectedTags.push(raw);
    if (input) input.value = '';
    renderNoteTagsPicker();
}

function toggleNoteTagsPicker(event) {
    event?.stopPropagation?.();
    const picker = getEl('noteTagsPicker');
    const button = getEl('noteTagsButton');
    if (!picker) return;
    const willOpen = picker.hidden;
    picker.hidden = !willOpen;
    button?.classList.toggle('open', willOpen);
    button?.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) renderNoteTagsPicker();
}

document.addEventListener('click', event => {
    const field = event.target?.closest?.('.note-tags-field');
    if (field) return;
    const picker = getEl('noteTagsPicker');
    const button = getEl('noteTagsButton');
    if (picker && !picker.hidden) {
        picker.hidden = true;
        button?.classList.remove('open');
        button?.setAttribute('aria-expanded', 'false');
    }
});

function noteDeadlineLabel(value) {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString();
}

function deleteNoteFromEditor() {
    if (!state.isEditMode) {
        closeModal('noteModal');
        return;
    }

    const group = getGroup(state.activeGroupId);
    const note = group?.notes?.[state.activeIndex];
    if (!note) return;

    customConfirm(`Delete note "${note.title || 'Untitled note'}"?`, '🗑 Delete note')
        .then(ok => {
            if (!ok) return;
            group.notes.splice(state.activeIndex, 1);
            saveData();
            closeModal('noteModal');
        });
}

async function copyCurrentNote(groupId, noteIndex) {
    const group = getGroup(groupId);
    const note = group?.notes?.[noteIndex];
    if (!note) return;

    const body = note.content_html ? richNotePlainText(note.content_html) : (note.content || '');
    const checklist = Array.isArray(note.checklist)
        ? note.checklist.map(i => `${i.done ? '☑' : '☐'} ${i.text || ''}`).join('\n')
        : '';

    const text = [note.title || 'Untitled note', body, checklist ? `Checklist:\n${checklist}` : '']
        .filter(Boolean)
        .join('\n\n');

    try {
        await navigator.clipboard.writeText(text);
        showAppNotice('Note copied to clipboard.', 'Copied', '📋');
    } catch (_) {
        showAppNotice('Could not copy this note.', 'Copy failed', '⚠️');
    }
}

function editNoteFromReader(groupId, noteIndex) {
    closeModal('readModal');
    openItemModal('note', groupId, noteIndex);
}

function toggleNoteChecklistItem(groupId, noteIndex, checklistIndex, checked) {
    const group = getGroup(groupId);
    const note = group?.notes?.[noteIndex];
    if (!note || !Array.isArray(note.checklist) || !note.checklist[checklistIndex]) return;

    note.checklist[checklistIndex].done = !!checked;
    note.updated_at = new Date().toISOString();
    saveData();

    const row = [...document.querySelectorAll('.note-v4-view-check-row')].find(el =>
        el.dataset.noteGroup === String(groupId) &&
        el.dataset.noteIndex === String(noteIndex) &&
        el.dataset.checkIndex === String(checklistIndex)
    );

    if (row) row.classList.toggle('done', !!checked);

    const progress = getEl('noteV4ViewProgress');
    if (progress) {
        const done = note.checklist.filter(i => i.done).length;
        progress.textContent = `${done}/${note.checklist.length} done`;
    }
}

document.addEventListener('selectionchange', () => {
    const editor = getEl('noteRichEditor');
    const selection = window.getSelection();
    if (editor && selection?.rangeCount && editor.contains(selection.anchorNode)) {
        saveNoteSelection();
    }
});

function openItemModal(type, groupId, index = false) {
    state.activeGroupId = groupId;
    state.activeIndex = index;
    state.isEditMode = index !== false;

    const group = getGroup(groupId);
    if (!group) return;

    const item = state.isEditMode ? group[`${type}s`]?.[index] : null;

    if (type === 'link') {
        getEl('linkModalTitle').innerText = state.isEditMode ? "📝 Edit Button" : "➕ Add New Link";
        const submitBtn = getEl('submitLinkBtn');
        if (submitBtn) submitBtn.textContent = state.isEditMode ? 'Save changes' : 'Add link';
        getEl('linkNameInput').value = item ? item.name : '';
        getEl('linkUrlInput').value = item ? item.url : '';
        buildEmojiPicker('linkEmojiGrid', item ? item.emoji : "NONE");
        openModal('linkModal');
        return;
    }

    if (type === 'note') {
        const old = item || {};

        getEl('noteModalTitle').textContent = state.isEditMode ? 'Edit note' : 'New note';
        getEl('noteModalSubtitle').textContent = state.isEditMode
            ? 'Update your note, formatting and checklist.'
            : 'Create a clear, structured note.';

        getEl('noteTitleInput').value = old.title || '';

        const editor = getEl('noteRichEditor');
        if (editor) {
            editor.innerHTML = old.content_html
                ? sanitizeRichNoteHTML(old.content_html)
                : (old.content ? `<p>${escapeHTML(old.content).replace(/\n/g, '<br>')}</p>` : '');
        }

        noteSelectedTags = normalizeNoteTags(old);
        renderNoteTagsPicker();
        const noteTagsPicker = getEl('noteTagsPicker');
        if (noteTagsPicker) noteTagsPicker.hidden = true;
        getEl('noteTagsButton')?.classList.remove('open');
        getEl('noteTagsButton')?.setAttribute('aria-expanded', 'false');
        getEl('noteDeadlineInput').value = old.deadline
            ? localDateTimeValue(new Date(old.deadline))
            : '';
        updateNoteDeadlineButton();

        richNotePinned = !!old.pinned;
        getEl('notePinBtn')?.classList.toggle('active', richNotePinned);
        if (getEl('notePinLabel')) {
            getEl('notePinLabel').textContent = richNotePinned ? 'Pinned' : 'Pin';
        }

        state.selectedEmoji = old.emoji || 'NONE';
        updateNoteHeaderIcon();
        renderRichNoteChecklist(old.checklist || []);

        if (getEl('noteDeleteFromEditorBtn')) {
            getEl('noteDeleteFromEditorBtn').style.display = state.isEditMode ? 'inline-flex' : 'none';
        }

        if (getEl('noteEditorStatus')) {
            getEl('noteEditorStatus').textContent = state.isEditMode && old.updated_at
                ? `Last edited ${new Date(old.updated_at).toLocaleString()}`
                : 'Not saved yet';
        }

        savedNoteSelection = null;
        openModal('noteModal');
        setTimeout(() => getEl('noteTitleInput')?.focus(), 50);
    }
}

function submitItemForm(type) {
    const group = getGroup(state.activeGroupId);
    if (!group) return;

    let targetData = {};

    if (type === 'link') {
        const name = getEl('linkNameInput').value.trim();
        let url = getEl('linkUrlInput').value.trim();
        if (!name || !url) return;
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
        targetData = { name, url, emoji: state.selectedEmoji };
    }

    if (type === 'note') {
        const title = getEl('noteTitleInput')?.value.trim();
        if (!title) {
            showAppNotice('Please enter a note title.', 'Missing title', '📝');
            return;
        }

        const contentHTML = sanitizeRichNoteHTML(getEl('noteRichEditor')?.innerHTML || '');
        const deadlineRaw = getEl('noteDeadlineInput')?.value || '';
        const old = state.isEditMode ? group.notes[state.activeIndex] : null;
        const now = new Date().toISOString();

        targetData = {
            ...(old || {}),
            title,
            content: richNotePlainText(contentHTML),
            content_html: contentHTML,
            emoji: state.selectedEmoji || 'NONE',
            tags: [...noteSelectedTags],
            // Keep one legacy category value for backward compatibility with older saved data/code.
            category: noteSelectedTags.find(tag => Object.prototype.hasOwnProperty.call(NOTE_TAG_PRESETS, tag)) || '',
            deadline: deadlineRaw ? new Date(deadlineRaw).toISOString() : '',
            pinned: richNotePinned,
            checklist: collectRichChecklist(),
            created_at: old?.created_at || now,
            updated_at: now
        };
    }

    if (state.isEditMode) {
        group[`${type}s`][state.activeIndex] = targetData;
    } else {
        group[`${type}s`].push(targetData);
    }

    saveData();
    closeModal(`${type}Modal`);
}


const openLinkModal = (gId, idx) => openItemModal('link', gId, idx);
const openNoteModal = (gId, idx) => openItemModal('note', gId, idx);
const submitLinkForm = () => submitItemForm('link');
const submitNoteForm = () => submitItemForm('note');

function duplicateItem(type, groupId, index) {
    const group = getGroup(groupId);
    if (!group) return;
    
    const arrayKey = `${type}s`;
    const originalItem = group[arrayKey]?.[index];
    if (!originalItem) return;
    
    const newItem = JSON.parse(JSON.stringify(originalItem));
    if (type === 'link') newItem.name += ' (Copy)';
    else newItem.title += ' (Copy)';
    
    group[arrayKey].splice(index + 1, 0, newItem);
    saveData();
}

function moveItem(type, sourceGroupId, index, targetGroupId) {
    const sourceGroup = getGroup(sourceGroupId);
    const targetGroup = getGroup(targetGroupId);
    const arrayKey = `${type}s`;
    if (!sourceGroup || !targetGroup || !sourceGroup[arrayKey]) return;
    
    const [movedItem] = sourceGroup[arrayKey].splice(index, 1);
    if (movedItem) {
        if (!targetGroup[arrayKey]) targetGroup[arrayKey] = [];
        targetGroup[arrayKey].push(movedItem);
        if (type === 'schedule') sortSchedulesSmart(targetGroup.schedules);
        saveData();
    }
}

function triggerDelete(type) {
    const group = getGroup(state.activeGroupId);
    if (!group) return;
    let msg = "";
    
    if (type === 'Group') msg = `Are you sure you want to delete group "${group.title}" and all data inside?`;
    else if (type === 'Link') msg = `Are you sure you want to delete button "${group.links?.[state.activeIndex]?.name}"?`;
    else if (type === 'Note') msg = `Are you sure you want to delete note button "${group.notes?.[state.activeIndex]?.title}"?`;
    else if (type === 'Schedule') msg = `Are you sure you want to delete schedule milestone "${group.schedules?.[state.activeIndex]?.title}"?`;

    customConfirm(msg, "⚠️ Confirm deletion").then((confirmed) => {
        if (confirmed) {
            if (type === 'Group') state.dashboardData = state.dashboardData.filter(g => g.id !== state.activeGroupId);
            else group[`${type.toLowerCase()}s`].splice(state.activeIndex, 1);
            saveData(); 
        }
    });
}


function toggleNoteChecklistItem(groupId, noteIndex, checklistIndex, checked) {
    const group = getGroup(groupId);
    if (!group || !Array.isArray(group.notes)) return;

    const note = group.notes[noteIndex];
    if (!note || !Array.isArray(note.checklist) || !note.checklist[checklistIndex]) return;

    note.checklist[checklistIndex].done = !!checked;
    note.updated_at = new Date().toISOString();
    saveData();

    // Refresh only the visible checklist UI instead of closing/reopening the modal.
    const row = [...document.querySelectorAll('.note-detail-check-row')].find(el =>
        el.dataset.noteGroup === String(groupId) &&
        el.dataset.noteIndex === String(noteIndex) &&
        el.dataset.checkIndex === String(checklistIndex)
    );
    if (row) {
        row.classList.toggle('done', !!checked);
        const cb = row.querySelector('input[type="checkbox"]');
        if (cb) cb.checked = !!checked;
    }

    const progress = getEl('noteDetailChecklistProgress');
    if (progress) {
        const done = note.checklist.filter(i => i.done).length;
        progress.textContent = `${done}/${note.checklist.length} done`;
    }
}

function showContentDetail(groupId, index, type) {
    const group = getGroup(groupId);
    if (!group) return;

    const titleEl = getEl('readModalTitle');
    const bodyEl = getEl('readModalBody');
    const closeBtn = getEl('readModalCloseBtn');
    if (!titleEl || !bodyEl) return;

    getEl('readModal')?.classList.toggle('note-v4-reader', type === 'note');

    if (type === 'note') {
        const noteObj = group.notes[index];
        if (!noteObj) return;

        getEl('readModal')?.classList.add('note-v4-reader');
        if (closeBtn) closeBtn.className = "note-v4-secondary-btn";

        const icon = noteObj.emoji && noteObj.emoji !== 'NONE' ? noteObj.emoji : '📝';
        titleEl.innerHTML = `
            <div class="note-v4-reader-title">
                <span>${escapeHTML(icon)}</span>
                <span>${escapeHTML(noteObj.title || 'Untitled note')}</span>
            </div>
            <div class="note-v4-reader-actions">
                <button class="note-v4-reader-action" onclick="editNoteFromReader('${escapeHTML(String(groupId))}', ${index})">✏️ Edit</button>
                <button class="note-v4-reader-action" onclick="copyCurrentNote('${escapeHTML(String(groupId))}', ${index})">📋 Copy</button>
            </div>`;

        const chips = [];
        if (noteObj.pinned) chips.push('<span class="note-v4-reader-chip">📌 Pinned</span>');
        normalizeNoteTags(noteObj).forEach(tag => chips.push(`<span class="note-v4-reader-chip note-v4-reader-tag">${escapeHTML(noteTagLabel(tag))}</span>`));
        if (noteObj.deadline) chips.push(`<span class="note-v4-reader-chip">📅 ${escapeHTML(noteDeadlineLabel(noteObj.deadline))}</span>`);
        if (noteObj.updated_at) chips.push(`<span class="note-v4-reader-chip">Edited ${escapeHTML(formatAdminLastSeen(noteObj.updated_at))}</span>`);

        const contentHTML = noteObj.content_html
            ? sanitizeRichNoteHTML(noteObj.content_html)
            : linkify(noteObj.content || '');

        const checklist = Array.isArray(noteObj.checklist) ? noteObj.checklist : [];
        const checklistHTML = checklist.length ? `
            <section class="note-v4-view-checklist">
                <div class="note-v4-view-checklist-head">
                    <h4>Checklist</h4>
                    <span class="note-v4-view-progress" id="noteV4ViewProgress">${checklist.filter(i => i.done).length}/${checklist.length} done</span>
                </div>
                ${checklist.map((item, checkIdx) => `
                    <label class="note-v4-view-check-row ${item.done ? 'done' : ''}"
                           data-note-group="${escapeHTML(String(groupId))}"
                           data-note-index="${index}"
                           data-check-index="${checkIdx}">
                        <input type="checkbox" ${item.done ? 'checked' : ''}
                               onchange="toggleNoteChecklistItem('${escapeHTML(String(groupId))}', ${index}, ${checkIdx}, this.checked)">
                        <span class="note-v4-view-check-text">${escapeHTML(item.text || '')}</span>
                    </label>
                `).join('')}
            </section>` : '';

        bodyEl.innerHTML = `
            ${chips.length ? `<div class="note-v4-reader-meta">${chips.join('')}</div>` : ''}
            <div class="note-v4-view-content" id="contentToCopy">${contentHTML}</div>
            ${checklistHTML}`;
    }
    else if (type === 'schedule') {
        titleEl.style.color = "var(--schedule-accent)"; 
        if (closeBtn) closeBtn.className = "btn-success";
        const schObj = group.schedules[index];
        
        const displayStartDate = schObj.date.split('-').reverse().join('/');
        const displayEndDate = (schObj.endDate || schObj.date).split('-').reverse().join('/');

        titleEl.innerHTML = schObj.important ? `⚠️ ${schObj.title}` : `📅 Schedule: ${schObj.title}`;
        bodyEl.innerHTML = `
            <div class="single-schedule-detail">
                <h4>${schObj.title}</h4>
                <div class="schedule-info-line" style="margin-bottom:5px">🟢 Start: <b>${displayStartDate} at ${schObj.time || '00:00'}</b></div>
                <div class="schedule-info-line" style="margin-bottom:12px">🏁 End: <b>${displayEndDate} at ${schObj.endTime || schObj.time || '00:00'}</b></div>
                <label style="display:block;margin-bottom:6px;color:var(--text-sub);font-size:12px">📋 Task details:</label>
                <div class="schedule-tasks-list">${linkify(schObj.content)}</div>
            </div>`;
    }
    openModal('readModal');
}

function copyNoteContent(btnElement) {
    const content = getEl('contentToCopy')?.innerText || "";
    navigator.clipboard.writeText(content).then(() => {
        const originalText = btnElement.innerText;
        btnElement.innerText = "✅ Copied!";
        Object.assign(btnElement.style, { borderColor: "var(--schedule-accent)", color: "var(--schedule-accent)" });
        setTimeout(() => {
            btnElement.innerText = originalText;
            Object.assign(btnElement.style, { borderColor: "var(--border-color)", color: "var(--text-main)" });
        }, 2000);
    }).catch(err => console.error('Copy error: ', err));
}

// ==========================================

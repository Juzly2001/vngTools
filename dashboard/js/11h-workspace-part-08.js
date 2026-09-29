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


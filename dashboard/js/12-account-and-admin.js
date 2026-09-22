// 1) Remove the redundant "Change avatar" button; pencil overlay remains.
// 2) Repair Note checklist layout so checkbox + text stay on one row.
// ============================================================================

(function initWorkspaceUIFixV6() {
    if (window.__WORKSPACE_UI_FIX_V6_READY__) return;
    window.__WORKSPACE_UI_FIX_V6_READY__ = true;

    function injectUIFixV6Styles() {
        if (document.getElementById('workspaceUIFixV6Styles')) return;

        const style = document.createElement('style');
        style.id = 'workspaceUIFixV6Styles';
        style.textContent = `
            /* ---------------------------------------------------------------
               Account avatar
               --------------------------------------------------------------- */
            #accountAvatarChangeV3{
                display:none !important;
            }

            /* With the redundant button removed, keep Reset neatly beside avatar. */
            #accountAvatarActionsV3{
                margin-top:10px !important;
            }

            /* ---------------------------------------------------------------
               Note checklist repair
               The old/global label/input rules can force the checkbox and text
               onto separate lines. These rules intentionally have high specificity.
               --------------------------------------------------------------- */

            .note-checklist,
            .checklist-items,
            .checklist-list,
            [class*="checklist"]{
                box-sizing:border-box;
            }

            .note-checklist .checklist-item,
            .checklist-items .checklist-item,
            .checklist-list .checklist-item,
            .note-checklist-item,
            [class*="checklist"] > label,
            [class*="checklist"] .checklist-row{
                display:flex !important;
                flex-direction:row !important;
                align-items:center !important;
                justify-content:flex-start !important;
                gap:10px !important;
                width:100% !important;
                min-width:0 !important;
                margin:0 !important;
                padding:5px 0 !important;
                line-height:1.35 !important;
                box-sizing:border-box !important;
            }

            .note-checklist input[type="checkbox"],
            .checklist-items input[type="checkbox"],
            .checklist-list input[type="checkbox"],
            .note-checklist-item input[type="checkbox"],
            [class*="checklist"] input[type="checkbox"]{
                appearance:auto !important;
                -webkit-appearance:checkbox !important;
                display:inline-block !important;
                position:static !important;
                float:none !important;
                flex:0 0 auto !important;
                width:17px !important;
                min-width:17px !important;
                max-width:17px !important;
                height:17px !important;
                min-height:17px !important;
                max-height:17px !important;
                margin:0 !important;
                padding:0 !important;
                vertical-align:middle !important;
                transform:none !important;
            }

            .note-checklist .checklist-item span,
            .checklist-items .checklist-item span,
            .checklist-list .checklist-item span,
            .note-checklist-item span,
            [class*="checklist"] .checklist-row span,
            [class*="checklist"] > label > span{
                display:block !important;
                flex:1 1 auto !important;
                min-width:0 !important;
                width:auto !important;
                margin:0 !important;
                padding:0 !important;
                white-space:normal !important;
                overflow-wrap:anywhere !important;
                line-height:1.4 !important;
            }

            /* Common structure: <label><input><span/text></label> */
            [class*="checklist"] label:has(> input[type="checkbox"]){
                display:flex !important;
                flex-direction:row !important;
                align-items:center !important;
                gap:10px !important;
                width:100% !important;
                margin:0 !important;
                padding:5px 0 !important;
            }

            /* Common structure: <div><input><label>Text</label></div> */
            [class*="checklist"] div:has(> input[type="checkbox"]){
                display:flex !important;
                flex-direction:row !important;
                align-items:center !important;
                justify-content:flex-start !important;
                gap:10px !important;
                width:100% !important;
                min-width:0 !important;
            }

            [class*="checklist"] div:has(> input[type="checkbox"]) > label{
                display:block !important;
                flex:1 1 auto !important;
                width:auto !important;
                min-width:0 !important;
                margin:0 !important;
                padding:0 !important;
                line-height:1.4 !important;
            }

            [class*="checklist"] input[type="checkbox"]:checked + span,
            [class*="checklist"] input[type="checkbox"]:checked + label{
                opacity:.62;
                text-decoration:line-through;
            }
        `;

        document.head.appendChild(style);
    }

    function removeRedundantAvatarButtonV6() {
        const button = document.getElementById('accountAvatarChangeV3');
        if (button) button.remove();

        // The pencil overlay is the only control for selecting a new avatar.
        const pencil = document.getElementById('accountAvatarEditBubbleV3');
        if (pencil) {
            pencil.title = 'Change avatar';
            pencil.setAttribute('aria-label', 'Change avatar');
        }
    }

    function repairChecklistDOMV6(root = document) {
        // Normalize checklist rows that were rendered with checkbox/text as block children.
        const checkboxes = root.querySelectorAll?.(
            '.note-checklist input[type="checkbox"], ' +
            '.checklist-items input[type="checkbox"], ' +
            '.checklist-list input[type="checkbox"], ' +
            '.note-checklist-item input[type="checkbox"], ' +
            '[class*="checklist"] input[type="checkbox"]'
        ) || [];

        checkboxes.forEach(cb => {
            const parent = cb.parentElement;
            if (!parent) return;

            // Do not change event handlers or data attributes; only normalize layout.
            parent.style.setProperty('display', 'flex', 'important');
            parent.style.setProperty('flex-direction', 'row', 'important');
            parent.style.setProperty('align-items', 'center', 'important');
            parent.style.setProperty('justify-content', 'flex-start', 'important');
            parent.style.setProperty('gap', '10px', 'important');
            parent.style.setProperty('width', '100%', 'important');
            parent.style.setProperty('min-width', '0', 'important');

            cb.style.setProperty('display', 'inline-block', 'important');
            cb.style.setProperty('position', 'static', 'important');
            cb.style.setProperty('flex', '0 0 17px', 'important');
            cb.style.setProperty('width', '17px', 'important');
            cb.style.setProperty('height', '17px', 'important');
            cb.style.setProperty('margin', '0', 'important');

            // If text is wrapped in a label/span, explicitly prevent the global form CSS
            // from making it full-width below the checkbox.
            Array.from(parent.children).forEach(child => {
                if (child === cb) return;
                if (child.matches?.('label, span, p, div')) {
                    child.style.setProperty('flex', '1 1 auto', 'important');
                    child.style.setProperty('width', 'auto', 'important');
                    child.style.setProperty('min-width', '0', 'important');
                    child.style.setProperty('margin', '0', 'important');
                }
            });
        });
    }

    function applyUIFixesV6(root = document) {
        injectUIFixV6Styles();
        removeRedundantAvatarButtonV6();
        repairChecklistDOMV6(root);
    }

    document.addEventListener('DOMContentLoaded', () => {
        applyUIFixesV6();

        // Notes/checklists can be re-rendered dynamically. Observe only added nodes and
        // normalize them without touching checklist data or click/change handlers.
        const observer = new MutationObserver(mutations => {
            let needsAvatarCleanup = false;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (!(node instanceof Element)) return;

                    if (
                        node.id === 'accountAvatarChangeV3' ||
                        node.querySelector?.('#accountAvatarChangeV3')
                    ) {
                        needsAvatarCleanup = true;
                    }

                    if (
                        node.matches?.('[class*="checklist"], input[type="checkbox"]') ||
                        node.querySelector?.('[class*="checklist"] input[type="checkbox"]')
                    ) {
                        repairChecklistDOMV6(node.matches?.('[class*="checklist"]') ? node : document);
                    }
                });
            });

            if (needsAvatarCleanup) removeRedundantAvatarButtonV6();
        });

        observer.observe(document.body, {
            childList:true,
            subtree:true
        });
    });

    window.addEventListener('load', () => {
        applyUIFixesV6();
        setTimeout(applyUIFixesV6, 250);
        setTimeout(applyUIFixesV6, 800);
    });

    // Account modal may reconstruct its controls whenever opened.
    const openAccountPanelV6 = openAccountPanel;
    openAccountPanel = function() {
        const result = openAccountPanelV6.apply(this, arguments);

        setTimeout(() => {
            removeRedundantAvatarButtonV6();
        }, 0);

        return result;
    };

    // Public helper for debugging.
    window.repairWorkspaceChecklistLayout = repairChecklistDOMV6;
})();


// ============================================================================
// AUTO TIME THEME + LARGE CURRENT ACCOUNT AVATAR VIEWER (V1)
// ============================================================================
(function initAutoTimeThemeAndAvatarViewerV1(){
    function ensureAvatarViewer(){
        if(document.getElementById('accountAvatarViewerV1')) return;
        const viewer=document.createElement('div');
        viewer.id='accountAvatarViewerV1';
        viewer.className='account-avatar-viewer-v1';
        viewer.setAttribute('aria-hidden','true');
        viewer.innerHTML=`
            <div class="account-avatar-viewer-backdrop-v1" data-close-avatar-viewer></div>
            <div class="account-avatar-viewer-dialog-v1" role="dialog" aria-modal="true" aria-label="Account avatar preview">
                <button class="account-avatar-viewer-close-v1" type="button" aria-label="Close avatar preview">✕</button>
                <img id="accountAvatarViewerImageV1" alt="Large account avatar">
                <div class="account-avatar-viewer-caption-v1">
                    <strong id="accountAvatarViewerNameV1">Current account</strong>
                    <span id="accountAvatarViewerEmailV1"></span>
                </div>
            </div>`;
        document.body.appendChild(viewer);
        viewer.querySelector('[data-close-avatar-viewer]')?.addEventListener('click',closeAccountAvatarViewerV1);
        viewer.querySelector('.account-avatar-viewer-close-v1')?.addEventListener('click',closeAccountAvatarViewerV1);
    }

    function getDisplayedAccountAvatarSrc(){
        const img=document.getElementById('accountAvatar');
        if(img?.src && getComputedStyle(img).display!=='none') return img.src;
        try { if(typeof effectiveAvatar==='function') return effectiveAvatar()||''; } catch(_){}
        return googleAccountProfile?.picture||'';
    }

    window.openAccountAvatarViewerV1=function(){
        const src=getDisplayedAccountAvatarSrc();
        if(!src) return;
        ensureAvatarViewer();
        const viewer=document.getElementById('accountAvatarViewerV1');
        const image=document.getElementById('accountAvatarViewerImageV1');
        const name=document.getElementById('accountAvatarViewerNameV1');
        const email=document.getElementById('accountAvatarViewerEmailV1');
        if(image) image.src=src;
        if(name) name.textContent=googleAccountProfile?.name||'Current account';
        if(email) email.textContent=googleAccountProfile?.email||'';
        viewer?.classList.add('active');
        viewer?.setAttribute('aria-hidden','false');
        document.body.classList.add('account-avatar-viewer-open-v1');
    };

    window.closeAccountAvatarViewerV1=function(){
        const viewer=document.getElementById('accountAvatarViewerV1');
        viewer?.classList.remove('active');
        viewer?.setAttribute('aria-hidden','true');
        document.body.classList.remove('account-avatar-viewer-open-v1');
    };

    function bindCurrentAccountAvatar(){
        const img=document.getElementById('accountAvatar');
        if(!img || img.__largeAvatarViewerBoundV1) return;
        img.__largeAvatarViewerBoundV1=true;
        img.classList.add('account-avatar-zoomable-v1');
        img.setAttribute('title','Click to view larger avatar');
        img.setAttribute('tabindex','0');
        img.setAttribute('role','button');
        img.setAttribute('aria-label','View larger account avatar');
        img.addEventListener('click',e=>{e.stopPropagation();openAccountAvatarViewerV1();});
        img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openAccountAvatarViewerV1();}});
    }

    document.addEventListener('keydown',e=>{
        if(e.key==='Escape' && document.getElementById('accountAvatarViewerV1')?.classList.contains('active')) closeAccountAvatarViewerV1();
    });

    document.addEventListener('DOMContentLoaded',()=>{
        bindCurrentAccountAvatar();
        if(isAutoTimeThemeEnabled()){applyAutoTimeTheme(true);startAutoTimeThemeWatcher();}
    });
    window.addEventListener('load',()=>{
        bindCurrentAccountAvatar();
        if(isAutoTimeThemeEnabled()){applyAutoTimeTheme(true);startAutoTimeThemeWatcher();}
    });

    const originalOpenAccountPanelAutoAvatarV1=openAccountPanel;
    openAccountPanel=function(){
        const result=originalOpenAccountPanelAutoAvatarV1.apply(this,arguments);
        setTimeout(bindCurrentAccountAvatar,0);
        return result;
    };

    window.addEventListener('storage',e=>{
        if(e.key===AUTO_TIME_THEME_KEY){
            if(isAutoTimeThemeEnabled()){applyAutoTimeTheme(true);startAutoTimeThemeWatcher();}
            else stopAutoTimeThemeWatcher();
        }
    });
})();

// ============================================================================
// CURRENT ACCOUNT INLINE RENAME V5 — DIRECT EDIT + HERO ACCOUNT LABEL + DRIVE SYNC
// - Click the displayed account name itself to rename; no extra input row
// - Enter / blur saves, Escape cancels
// - Custom name follows the existing Drive workspace payload
// - Hero meta shows date + "Hi, Name" beside the avatar
// ============================================================================
(function initCurrentAccountInlineRenameV4(){
    if (window.__CURRENT_ACCOUNT_INLINE_RENAME_V4_READY__) return;
    window.__CURRENT_ACCOUNT_INLINE_RENAME_V4_READY__ = true;

    const NAME_PREFIX = 'workspace_custom_account_name_v1_';
    let renameOriginalValue = '';
    let renameDraftValue = '';
    let isApplyingHeaderProfile = false;

    function identityKey(){
        return String(
            googleAccountProfile?.id ||
            googleAccountProfile?.email ||
            'default'
        ).toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
    }

    function storageKey(){ return NAME_PREFIX + identityKey(); }

    function getCustomAccountName(){
        try { return (localStorage.getItem(storageKey()) || '').trim(); }
        catch (_) { return ''; }
    }

    function setCustomAccountName(value){
        const clean = String(value || '').trim().replace(/\s+/g, ' ').slice(0, 80);
        try {
            if (clean) localStorage.setItem(storageKey(), clean);
            else localStorage.removeItem(storageKey());
        } catch (_) {}
        return clean;
    }

    function effectiveAccountName(){
        return getCustomAccountName() || googleAccountProfile?.name || googleAccountProfile?.email || 'Google account';
    }

    function injectInlineRenameStyles(){
        if (document.getElementById('currentAccountInlineRenameV4Styles')) return;
        const style = document.createElement('style');
        style.id = 'currentAccountInlineRenameV4Styles';
        style.textContent = `
            #accountModal .account-profile-copy{min-width:0;}
            #accountModal #accountDisplayName{
                position:relative;
                display:inline-flex;
                align-items:center;
                width:100%;
                max-width:100%;
                min-width:28px;
                padding:3px 26px 3px 5px;
                margin-left:-5px;
                border:1px solid transparent;
                border-radius:8px;
                outline:none;
                cursor:text;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
                transition:background .16s ease,border-color .16s ease,box-shadow .16s ease;
            }
            #accountModal #accountDisplayName::after{
                content:'✎';
                position:absolute;
                right:7px;
                top:50%;
                transform:translateY(-50%);
                font-size:11px;
                color:var(--text-sub);
                opacity:0;
                pointer-events:none;
                transition:opacity .16s ease;
            }
            #accountModal #accountDisplayName.account-name-editable-v2:hover{
                background:rgba(255,255,255,.055);
                border-color:var(--border-color);
            }
            #accountModal #accountDisplayName.account-name-editable-v2:hover::after,
            #accountModal #accountDisplayName.account-name-editing-v2::after{opacity:.8;}
            #accountModal #accountDisplayName.account-name-editing-v2{
                overflow-x:auto;
                overflow-y:hidden;
                white-space:nowrap;
                background:var(--inner-bg);
                border-color:var(--accent-color);
                box-shadow:0 0 0 3px color-mix(in srgb, var(--accent-color) 16%, transparent);
            }
            body.light-mode #accountModal #accountDisplayName.account-name-editable-v2:hover{
                background:rgba(15,23,42,.035);
            }

            /* Hero account block: date + greeting on the left, avatar on the right */
            .hero-meta-v12.hero-account-meta-v4{
                display:grid !important;
                grid-template-columns:minmax(0,auto) 42px;
                grid-template-rows:auto auto;
                column-gap:10px;
                row-gap:1px;
                align-items:center;
                justify-content:end;
                text-align:right;
            }
            .hero-meta-v12.hero-account-meta-v4 #workspaceTodayLabel{
                grid-column:1;
                grid-row:1;
                display:block;
                line-height:1.25;
                white-space:nowrap;
            }
            .hero-meta-v12.hero-account-meta-v4 .workspace-account-name-v4{
                grid-column:1;
                grid-row:2;
                display:block;
                min-width:0;
                max-width:220px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
                color:inherit;
                font-size:13px;
                font-weight:750;
                line-height:1.25;
                letter-spacing:.01em;
            }
            .hero-meta-v12.hero-account-meta-v4 #btn-login-google.profile-header-btn-v5{
                grid-column:2;
                grid-row:1 / span 2;
                align-self:center;
                justify-self:end;
                width:42px !important;
                min-width:42px !important;
                height:42px !important;
                min-height:42px !important;
                padding:4px !important;
                border-radius:50% !important;
                display:inline-flex !important;
                align-items:center !important;
                justify-content:center !important;
                overflow:visible !important;
            }
            .hero-meta-v12.hero-account-meta-v4 #btn-login-google .profile-avatar-v5,
            .hero-meta-v12.hero-account-meta-v4 #btn-login-google .profile-fallback-v5{
                width:34px !important;
                min-width:34px !important;
                height:34px !important;
                border-radius:50% !important;
                flex:0 0 34px !important;
            }
            .hero-meta-v12.hero-account-meta-v4 #btn-login-google .profile-status-v5{
                right:1px !important;
                bottom:1px !important;
            }
            .hero-meta-v12.hero-account-meta-v4 #btn-login-google .header-account-name-v2{
                display:none !important;
            }
            @media (max-width:700px){
                .hero-meta-v12.hero-account-meta-v4{
                    grid-template-columns:minmax(0,auto) 38px;
                    column-gap:8px;
                }
                .hero-meta-v12.hero-account-meta-v4 .workspace-account-name-v4{
                    max-width:150px;
                    font-size:12px;
                }
                .hero-meta-v12.hero-account-meta-v4 #btn-login-google.profile-header-btn-v5{
                    width:38px !important;
                    min-width:38px !important;
                    height:38px !important;
                    min-height:38px !important;
                    padding:4px !important;
                }
                .hero-meta-v12.hero-account-meta-v4 #btn-login-google .profile-avatar-v5,
                .hero-meta-v12.hero-account-meta-v4 #btn-login-google .profile-fallback-v5{
                    width:30px !important;
                    min-width:30px !important;
                    height:30px !important;
                    flex-basis:30px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function ensureHeroAccountName(){
        injectInlineRenameStyles();
        const heroMeta = document.querySelector('.hero-meta-v12');
        const dateEl = document.getElementById('workspaceTodayLabel');
        const btn = document.getElementById('btn-login-google');
        if (!heroMeta || !dateEl || !btn) return null;

        heroMeta.classList.add('hero-account-meta-v4');

        let nameEl = document.getElementById('workspaceAccountNameV4');
        if (!nameEl) {
            nameEl = document.createElement('span');
            nameEl.id = 'workspaceAccountNameV4';
            nameEl.className = 'workspace-account-name-v4';
            nameEl.setAttribute('aria-live', 'polite');
        }

        if (nameEl.parentElement !== heroMeta) heroMeta.appendChild(nameEl);
        if (btn.parentElement !== heroMeta) heroMeta.appendChild(btn);

        return nameEl;
    }

    function getHeaderAvatar(){
        const modalAvatar = document.getElementById('accountAvatar');
        if (modalAvatar && modalAvatar.style.display !== 'none' && modalAvatar.getAttribute('src')) {
            return modalAvatar.getAttribute('src');
        }
        try {
            if (typeof effectiveAvatar === 'function') return effectiveAvatar() || '';
        } catch (_) {}
        return googleAccountProfile?.picture || '';
    }

    function renderHeaderAvatar(){
        injectInlineRenameStyles();
        const btn = document.getElementById('btn-login-google');
        if (!btn) return;
        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();
        const nameEl = ensureHeroAccountName();

        if (!connected) {
            if (nameEl) nameEl.textContent = '';
            btn.classList.remove('header-account-pill-v2');
            return;
        }

        const label = effectiveAccountName();
        const avatar = getHeaderAvatar();
        const initial = String(label).trim().charAt(0).toUpperCase() || 'G';
        const title = `${label}${googleAccountProfile?.email && googleAccountProfile.email !== label ? ` · ${googleAccountProfile.email}` : ''}`;

        if (nameEl) {
            nameEl.textContent = `Hi, ${label}`;
            nameEl.title = `Hi, ${label}`;
        }

        btn.classList.add('profile-header-btn-v5');
        btn.classList.remove('header-account-pill-v2');
        btn.title = title;
        btn.setAttribute('aria-label', `Current account: ${label}`);

        const currentAvatar = btn.querySelector('.profile-avatar-v5')?.getAttribute('src') || '';
        const currentInitial = btn.querySelector('.profile-fallback-v5')?.textContent || '';
        if ((avatar && currentAvatar === avatar) || (!avatar && currentInitial === initial)) return;

        isApplyingHeaderProfile = true;
        btn.innerHTML = avatar
            ? `<span style="position:relative;display:inline-flex;flex:0 0 auto;"><img class="profile-avatar-v5" src="${escapeHTML(avatar)}" alt=""><span class="profile-status-v5" aria-hidden="true"></span></span>`
            : `<span style="position:relative;display:inline-flex;flex:0 0 auto;"><span class="profile-fallback-v5">${escapeHTML(initial)}</span><span class="profile-status-v5" aria-hidden="true"></span></span>`;
        isApplyingHeaderProfile = false;
    }

    function applyCustomNameToUI(){
        injectInlineRenameStyles();
        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();
        const display = document.getElementById('accountDisplayName');

        if (display) {
            display.classList.toggle('account-name-editable-v2', connected);
            display.title = connected ? 'Click the name to rename' : '';
            if (!display.classList.contains('account-name-editing-v2')) {
                display.textContent = connected ? effectiveAccountName() : 'Not connected';
            }
        }

        renderHeaderAvatar();

        const viewerName = document.getElementById('accountAvatarViewerNameV1');
        if (viewerName && connected) viewerName.textContent = effectiveAccountName();
    }

    async function persistCurrentName(){
        if (typeof persistWorkspaceChange === 'function') {
            await Promise.resolve(persistWorkspaceChange('account-name'));
        } else if (typeof syncToGoogleDrive === 'function') {
            await Promise.resolve(syncToGoogleDrive(true));
        }
    }

    async function finishInlineRename(save){
        const display = document.getElementById('accountDisplayName');
        if (!display || !display.classList.contains('account-name-editing-v2')) return;

        display.classList.remove('account-name-editing-v2');
        display.removeAttribute('contenteditable');
        display.removeAttribute('spellcheck');

        if (!save) {
            display.textContent = renameOriginalValue || effectiveAccountName();
            return;
        }

        const next = String(renameDraftValue || display.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
        if (!next) {
            display.textContent = renameOriginalValue || effectiveAccountName();
            return;
        }

        setCustomAccountName(next);
        display.textContent = next;
        applyCustomNameToUI();
        try { await persistCurrentName(); }
        catch (error) { console.warn('Could not sync custom account name yet:', error); }
    }

    function beginInlineRename(){
        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();
        const display = document.getElementById('accountDisplayName');
        if (!connected || !display || display.classList.contains('account-name-editing-v2')) return;

        renameOriginalValue = effectiveAccountName();
        renameDraftValue = renameOriginalValue;
        display.textContent = renameOriginalValue;
        display.setAttribute('contenteditable', 'true');
        display.setAttribute('spellcheck', 'false');
        display.classList.add('account-name-editing-v2');
        display.focus();

        try {
            const range = document.createRange();
            range.selectNodeContents(display);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } catch (_) {}
    }

    function bindInlineRename(){
        injectInlineRenameStyles();
        const display = document.getElementById('accountDisplayName');
        if (!display || display.__inlineRenameV4Bound) return;
        display.__inlineRenameV4Bound = true;

        display.addEventListener('click', () => beginInlineRename());
        display.addEventListener('input', () => {
            if (display.classList.contains('account-name-editing-v2')) {
                renameDraftValue = String(display.textContent || '').slice(0, 80);
            }
        });
        display.addEventListener('keydown', e => {
            if (!display.classList.contains('account-name-editing-v2')) return;
            if (e.key === 'Enter') {
                e.preventDefault();
                finishInlineRename(true);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                finishInlineRename(false);
                display.blur();
            }
        });
        display.addEventListener('blur', () => {
            if (display.classList.contains('account-name-editing-v2')) finishInlineRename(true);
        });
        display.addEventListener('paste', e => {
            if (!display.classList.contains('account-name-editing-v2')) return;
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
            document.execCommand('insertText', false, text.replace(/\s+/g, ' '));
        });
    }

    if (typeof buildDrivePayload === 'function') {
        const originalBuildDrivePayload = buildDrivePayload;
        buildDrivePayload = function(){
            const payload = originalBuildDrivePayload.apply(this, arguments);
            if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
                payload.accountUiPreferences = {
                    ...(payload.accountUiPreferences || {}),
                    customAccountName: getCustomAccountName() || ''
                };
            }
            return payload;
        };
    }

    if (typeof applyDrivePayload === 'function') {
        const originalApplyDrivePayload = applyDrivePayload;
        applyDrivePayload = function(payload){
            const result = originalApplyDrivePayload.apply(this, arguments);
            if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
                const cloudName = payload.accountUiPreferences?.customAccountName;
                if (typeof cloudName === 'string') setCustomAccountName(cloudName);
            }
            setTimeout(() => { bindInlineRename(); applyCustomNameToUI(); }, 0);
            return result;
        };
    }

    if (typeof updateGoogleAccountUI === 'function') {
        const originalUpdateGoogleAccountUI = updateGoogleAccountUI;
        updateGoogleAccountUI = function(){
            const result = originalUpdateGoogleAccountUI.apply(this, arguments);
            setTimeout(() => { bindInlineRename(); applyCustomNameToUI(); }, 0);
            return result;
        };
    }

    if (typeof openAccountPanel === 'function') {
        const originalOpenAccountPanel = openAccountPanel;
        openAccountPanel = function(){
            const result = originalOpenAccountPanel.apply(this, arguments);
            setTimeout(() => { bindInlineRename(); applyCustomNameToUI(); }, 0);
            return result;
        };
    }

    function observeHeaderProfile(){
        const btn = document.getElementById('btn-login-google');
        if (!btn || btn.__headerAccountNameV4Observed) return;
        btn.__headerAccountNameV4Observed = true;
        new MutationObserver(() => {
            if (isApplyingHeaderProfile) return;
            requestAnimationFrame(renderHeaderAvatar);
        }).observe(btn, { childList:true, subtree:true, attributes:true, attributeFilter:['src'] });
    }

    window.addEventListener('storage', e => {
        if (e.key && e.key.startsWith(NAME_PREFIX)) setTimeout(applyCustomNameToUI, 0);
    });

    document.addEventListener('DOMContentLoaded', () => {
        bindInlineRename();
        applyCustomNameToUI();
        observeHeaderProfile();
    });
    window.addEventListener('load', () => {
        bindInlineRename();
        applyCustomNameToUI();
        observeHeaderProfile();
        setTimeout(() => { applyCustomNameToUI(); observeHeaderProfile(); }, 300);
    });

    window.renameCurrentAccount = beginInlineRename;
    window.getCurrentAccountDisplayName = effectiveAccountName;
})();


// ============================================================================
// CUSTOM DROPDOWN V4 — stable portal menu, anchored to trigger
// ============================================================================
(function initCustomDropdownV4(){
    const enhanced = new WeakSet();
    let opened = null;
    let rafId = 0;

    const getMenu = wrap => wrap?._customDropdownMenu || null;

    const schedulePosition = () => {
        if (!opened) return;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            rafId = 0;
            positionMenu(opened);
        });
    };

    const close = (wrap) => {
        if (!wrap) return;
        wrap.classList.remove('open');
        const trigger = wrap.querySelector('.custom-select-v3-trigger');
        const menu = getMenu(wrap);
        trigger?.setAttribute('aria-expanded', 'false');
        if (menu) {
            menu.classList.remove('open');
            menu.hidden = true;
            menu.style.visibility = '';
        }
        if (opened === wrap) opened = null;
    };

    const closeAll = (except = null) => {
        document.querySelectorAll('.custom-select-v3.open').forEach(w => {
            if (w !== except) close(w);
        });
    };

    function positionMenu(wrap) {
        if (!wrap || wrap !== opened || !wrap.isConnected) return;
        const trigger = wrap.querySelector('.custom-select-v3-trigger');
        const menu = getMenu(wrap);
        if (!trigger || !menu || menu.hidden) return;

        const r = trigger.getBoundingClientRect();
        if (!r.width || !r.height) { close(wrap); return; }

        const gap = 7;
        const edge = 10;
        const minWidth = 120;
        const width = Math.min(Math.max(r.width, minWidth), window.innerWidth - edge * 2);

        menu.style.width = `${width}px`;
        menu.style.left = `${Math.max(edge, Math.min(r.left, window.innerWidth - width - edge))}px`;
        menu.style.maxHeight = `${Math.min(280, Math.max(140, window.innerHeight * 0.55))}px`;

        // Measure after width/max-height are known.
        const menuHeight = Math.min(menu.scrollHeight, parseFloat(menu.style.maxHeight) || 280);
        const roomBelow = window.innerHeight - r.bottom - gap - edge;
        const roomAbove = r.top - gap - edge;
        const openAbove = roomBelow < Math.min(menuHeight, 170) && roomAbove > roomBelow;

        if (openAbove) {
            const usable = Math.max(80, roomAbove);
            menu.style.maxHeight = `${Math.min(menuHeight, usable)}px`;
            const finalHeight = Math.min(menu.scrollHeight, parseFloat(menu.style.maxHeight));
            menu.style.top = `${Math.max(edge, r.top - finalHeight - gap)}px`;
            menu.dataset.placement = 'top';
        } else {
            const usable = Math.max(80, roomBelow);
            menu.style.maxHeight = `${Math.min(menuHeight, usable)}px`;
            menu.style.top = `${Math.min(window.innerHeight - edge, r.bottom + gap)}px`;
            menu.dataset.placement = 'bottom';
        }

        menu.style.visibility = 'visible';
    }

    const buildOptions = (select, menu) => {
        const frag = document.createDocumentFragment();
        menu.replaceChildren();

        function addOption(opt){
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'custom-select-v3-option';
            btn.textContent = opt.textContent;
            btn.dataset.value = opt.value;
            btn.disabled = opt.disabled;
            btn.setAttribute('role', 'option');
            btn.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
            if (opt.selected) btn.classList.add('is-selected');

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (opt.disabled) return;
                const changed = select.selectedIndex !== opt.index;
                select.selectedIndex = opt.index;
                syncFromNative(select, false);
                if (changed) {
                    select.dispatchEvent(new Event('input', { bubbles: true }));
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                }
                const wrap = select.closest('.custom-select-v3');
                close(wrap);
                wrap?.querySelector('.custom-select-v3-trigger')?.focus({ preventScroll: true });
            });
            frag.appendChild(btn);
        }

        Array.from(select.children).forEach(child => {
            if (child.tagName === 'OPTGROUP') {
                const group = document.createElement('div');
                group.className = 'custom-select-v3-optgroup';
                group.textContent = child.label;
                frag.appendChild(group);
                Array.from(child.children).forEach(addOption);
            } else if (child.tagName === 'OPTION') {
                addOption(child);
            }
        });
        menu.appendChild(frag);
    };

    const syncFromNative = (select, rebuild = true) => {
        const wrap = select.closest('.custom-select-v3');
        if (!wrap) return;
        const label = wrap.querySelector('.custom-select-v3-label');
        const trigger = wrap.querySelector('.custom-select-v3-trigger');
        const menu = getMenu(wrap);
        const option = select.options[select.selectedIndex];

        if (label) label.textContent = option ? option.textContent : '';
        if (trigger) {
            trigger.disabled = !!select.disabled;
            trigger.title = select.title || '';
        }

        if (menu) {
            if (rebuild) {
                buildOptions(select, menu);
            } else {
                const buttons = menu.querySelectorAll('.custom-select-v3-option');
                buttons.forEach((btn, i) => {
                    const selected = i === select.selectedIndex;
                    btn.classList.toggle('is-selected', selected);
                    btn.setAttribute('aria-selected', selected ? 'true' : 'false');
                });
            }
        }
    };

    const enhance = (select) => {
        if (!select || enhanced.has(select) || select.multiple || Number(select.size) > 1) return;
        if (select.closest('.custom-select-v3')) return;
        enhanced.add(select);

        const wrap = document.createElement('div');
        wrap.className = 'custom-select-v3';
        if (select.className) wrap.dataset.nativeClass = select.className;

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'custom-select-v3-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        const label = document.createElement('span');
        label.className = 'custom-select-v3-label';
        const arrow = document.createElement('span');
        arrow.className = 'custom-select-v3-arrow';
        arrow.setAttribute('aria-hidden', 'true');
        trigger.append(label, arrow);

        // IMPORTANT: menu is portaled to <body>, so transformed/modal ancestors
        // can no longer alter fixed-position coordinates.
        const menu = document.createElement('div');
        menu.className = 'custom-select-v3-menu';
        menu.setAttribute('role', 'listbox');
        menu.hidden = true;
        document.body.appendChild(menu);
        wrap._customDropdownMenu = menu;

        select.parentNode.insertBefore(wrap, select);
        wrap.append(select, trigger);
        select.classList.add('custom-select-v3-native');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (select.disabled) return;
            const willOpen = !wrap.classList.contains('open');
            closeAll(wrap);
            if (!willOpen) { close(wrap); return; }

            syncFromNative(select, true);
            wrap.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
            opened = wrap;
            menu.hidden = false;
            menu.classList.add('open');
            menu.style.visibility = 'hidden';

            // Position first, then scroll selected item without moving the page.
            requestAnimationFrame(() => {
                positionMenu(wrap);
                const selected = menu.querySelector('.is-selected');
                if (selected) {
                    const mt = menu.scrollTop;
                    const top = selected.offsetTop;
                    const bottom = top + selected.offsetHeight;
                    if (top < mt) menu.scrollTop = top;
                    else if (bottom > mt + menu.clientHeight) menu.scrollTop = bottom - menu.clientHeight;
                }
            });
        });

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { close(wrap); return; }
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!wrap.classList.contains('open')) trigger.click();
                const buttons = [...menu.querySelectorAll('.custom-select-v3-option:not(:disabled)')];
                if (!buttons.length) return;
                const current = menu.querySelector('.custom-select-v3-option.is-active') || menu.querySelector('.is-selected');
                let i = Math.max(0, buttons.indexOf(current));
                i = e.key === 'ArrowDown' ? Math.min(buttons.length - 1, i + 1) : Math.max(0, i - 1);
                buttons.forEach(b => b.classList.remove('is-active'));
                buttons[i].classList.add('is-active');
                const top = buttons[i].offsetTop;
                const bottom = top + buttons[i].offsetHeight;
                if (top < menu.scrollTop) menu.scrollTop = top;
                else if (bottom > menu.scrollTop + menu.clientHeight) menu.scrollTop = bottom - menu.clientHeight;
            } else if (e.key === 'Enter' && wrap.classList.contains('open')) {
                const active = menu.querySelector('.custom-select-v3-option.is-active');
                if (active) { e.preventDefault(); active.click(); }
            }
        });

        select.addEventListener('change', () => syncFromNative(select, true));

        // Observe only meaningful native select changes. Debounce into one frame.
        let syncRaf = 0;
        const obs = new MutationObserver(() => {
            cancelAnimationFrame(syncRaf);
            syncRaf = requestAnimationFrame(() => {
                syncFromNative(select, true);
                if (opened === wrap) schedulePosition();
            });
        });
        obs.observe(select, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['selected', 'disabled', 'label']
        });
        wrap._customDropdownObserver = obs;
        syncFromNative(select, true);
    };

    const scan = (root = document) => {
        if (root.matches?.('select')) enhance(root);
        root.querySelectorAll?.('select').forEach(enhance);
    };

    document.addEventListener('pointerdown', (e) => {
        if (!opened) return;
        const menu = getMenu(opened);
        if (opened.contains(e.target) || menu?.contains(e.target)) return;
        close(opened);
    }, true);

    // Reposition only when the PAGE/VIEWPORT changes. Scrolling the menu itself
    // must NOT trigger positioning, which was the main source of jitter in V3.
    window.addEventListener('resize', schedulePosition, { passive: true });
    window.addEventListener('scroll', schedulePosition, { passive: true });

    const rootObs = new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(n => {
            if (n.nodeType === 1 && !n.classList?.contains('custom-select-v3-menu')) scan(n);
        }));
    });

    const start = () => {
        scan(document);
        rootObs.observe(document.body, { childList: true, subtree: true });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
})();

// ============================================================================
// CUSTOM DATE / TIME PICKER V5
// Keeps the original input[type=date/time] as the source of truth so all
// existing Schedule create/edit/save logic continues to read the same values.
// ============================================================================
(() => {
    const enhanced = new WeakSet();
    let opened = null;
    let raf = 0;

    const pad = n => String(n).padStart(2, '0');
    const ymd = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    const sameDay = (a,b) => !!a && !!b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
    const parseDate = value => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
        const [y,m,d] = value.split('-').map(Number);
        const out = new Date(y,m-1,d);
        return Number.isNaN(out.getTime()) ? null : out;
    };
    const formatDate = value => {
        const d = parseDate(value);
        if (!d) return 'Choose date';
        try { return new Intl.DateTimeFormat(undefined,{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).format(d); }
        catch (_) { return value; }
    };
    const normalizeTime = value => /^\d{2}:\d{2}/.test(value || '') ? value.slice(0,5) : '';

    function getPanel(wrap){ return wrap?._customDateTimePanel || null; }
    function dispatchNative(input){
        input.dispatchEvent(new Event('input', {bubbles:true}));
        input.dispatchEvent(new Event('change', {bubbles:true}));
    }
    function syncLabel(input){
        const wrap = input.closest('.custom-datetime-v5');
        const label = wrap?.querySelector('.custom-datetime-v5-label');
        if (!label) return;
        label.textContent = input.type === 'date' ? formatDate(input.value) : (normalizeTime(input.value) || 'Choose time');
    }
    function close(wrap = opened){
        if (!wrap) return;
        const panel = getPanel(wrap);
        wrap.classList.remove('open');
        wrap.querySelector('.custom-datetime-v5-trigger')?.setAttribute('aria-expanded','false');
        if (panel) {
            panel.classList.remove('open');
            panel.hidden = true;
        }
        if (opened === wrap) opened = null;
    }
    function closeAll(except){ if (opened && opened !== except) close(opened); }

    function position(wrap){
        if (!wrap?.classList.contains('open')) return;
        const trigger = wrap.querySelector('.custom-datetime-v5-trigger');
        const panel = getPanel(wrap);
        if (!trigger || !panel || panel.hidden) return;
        const r = trigger.getBoundingClientRect();
        const edge = 8, gap = 7;
        const width = Math.min(Math.max(286, r.width), Math.min(330, window.innerWidth - edge*2));
        panel.style.width = `${width}px`;
        panel.style.left = `${Math.max(edge, Math.min(r.left, window.innerWidth - width - edge))}px`;
        panel.style.visibility = 'hidden';
        panel.style.top = '0px';
        const h = panel.offsetHeight || 320;
        const below = window.innerHeight - r.bottom - edge;
        const above = r.top - edge;
        if (below < Math.min(h, 250) && above > below) {
            panel.style.top = `${Math.max(edge, r.top - h - gap)}px`;
            panel.dataset.placement = 'top';
        } else {
            panel.style.top = `${Math.min(window.innerHeight - h - edge, r.bottom + gap)}px`;
            panel.dataset.placement = 'bottom';
        }
        panel.style.visibility = 'visible';
    }
    function schedulePosition(){
        if (!opened) return;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => position(opened));
    }

    function buildDatePanel(input, panel){
        let selected = parseDate(input.value);
        let view = selected ? new Date(selected.getFullYear(), selected.getMonth(), 1) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        panel.innerHTML = `
            <div class="custom-date-v5-head">
                <button type="button" data-act="prev" aria-label="Previous month">‹</button>
                <div class="custom-date-v5-title"></div>
                <button type="button" data-act="next" aria-label="Next month">›</button>
            </div>
            <div class="custom-date-v5-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
            <div class="custom-date-v5-grid"></div>
            <div class="custom-date-v5-foot">
                <button type="button" data-act="clear">Clear</button>
                <button type="button" data-act="today">Today</button>
            </div>`;

        const title = panel.querySelector('.custom-date-v5-title');
        const grid = panel.querySelector('.custom-date-v5-grid');
        const render = () => {
            title.textContent = view.toLocaleDateString([], {month:'long',year:'numeric'});
            grid.replaceChildren();
            const first = new Date(view.getFullYear(), view.getMonth(), 1);
            const start = new Date(first);
            start.setDate(first.getDate() - first.getDay());
            const today = new Date();
            for (let i=0;i<42;i++) {
                const d = new Date(start);
                d.setDate(start.getDate()+i);
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'custom-date-v5-day';
                b.textContent = String(d.getDate());
                if (d.getMonth() !== view.getMonth()) b.classList.add('outside');
                if (sameDay(d,today)) b.classList.add('today');
                if (sameDay(d,selected)) b.classList.add('selected');
                b.addEventListener('click', () => {
                    selected = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                    input.value = ymd(selected);
                    syncLabel(input);
                    dispatchNative(input);
                    close(input.closest('.custom-datetime-v5'));
                    input.closest('.custom-datetime-v5')?.querySelector('.custom-datetime-v5-trigger')?.focus({preventScroll:true});
                });
                grid.appendChild(b);
            }
        };
        panel.querySelector('[data-act="prev"]').onclick = () => { view = new Date(view.getFullYear(), view.getMonth()-1, 1); render(); schedulePosition(); };
        panel.querySelector('[data-act="next"]').onclick = () => { view = new Date(view.getFullYear(), view.getMonth()+1, 1); render(); schedulePosition(); };
        panel.querySelector('[data-act="today"]').onclick = () => {
            const d = new Date();
            input.value = ymd(d);
            syncLabel(input); dispatchNative(input); close(input.closest('.custom-datetime-v5'));
        };
        panel.querySelector('[data-act="clear"]').onclick = () => {
            input.value = '';
            syncLabel(input); dispatchNative(input); close(input.closest('.custom-datetime-v5'));
        };
        render();
    }

    function buildTimePanel(input, panel){
        let current = normalizeTime(input.value) || '09:00';
        let [hour, minute] = current.split(':').map(Number);
        panel.innerHTML = `
            <div class="custom-time-v5-title"><strong>Choose time</strong><span class="custom-time-v5-preview"></span></div>
            <div class="custom-time-v5-columns">
                <div class="custom-time-v5-col custom-time-v5-hours"><small>Hour</small></div>
                <div class="custom-time-v5-col custom-time-v5-minutes"><small>Minute</small></div>
            </div>
            <div class="custom-time-v5-actions">
                <button type="button" data-act="clear">Clear</button>
                <button type="button" class="primary" data-act="apply">Apply</button>
            </div>`;
        const preview = panel.querySelector('.custom-time-v5-preview');
        const hc = panel.querySelector('.custom-time-v5-hours');
        const mc = panel.querySelector('.custom-time-v5-minutes');
        const refresh = () => {
            preview.textContent = `${pad(hour)}:${pad(minute)}`;
            hc.querySelectorAll('.custom-time-v5-option').forEach(b => b.classList.toggle('selected', Number(b.dataset.value)===hour));
            mc.querySelectorAll('.custom-time-v5-option').forEach(b => b.classList.toggle('selected', Number(b.dataset.value)===minute));
        };
        for (let h=0;h<24;h++) {
            const b=document.createElement('button'); b.type='button'; b.className='custom-time-v5-option'; b.dataset.value=h; b.textContent=pad(h);
            b.onclick=()=>{hour=h;refresh();}; hc.appendChild(b);
        }
        // Every minute keeps native time precision while still looking custom.
        for (let m=0;m<60;m++) {
            const b=document.createElement('button'); b.type='button'; b.className='custom-time-v5-option'; b.dataset.value=m; b.textContent=pad(m);
            b.onclick=()=>{minute=m;refresh();}; mc.appendChild(b);
        }
        panel.querySelector('[data-act="apply"]').onclick=()=>{
            input.value=`${pad(hour)}:${pad(minute)}`;
            syncLabel(input); dispatchNative(input); close(input.closest('.custom-datetime-v5'));
        };
        panel.querySelector('[data-act="clear"]').onclick=()=>{
            input.value=''; syncLabel(input); dispatchNative(input); close(input.closest('.custom-datetime-v5'));
        };
        refresh();
        requestAnimationFrame(()=>{
            hc.querySelector('.selected')?.scrollIntoView({block:'center'});
            mc.querySelector('.selected')?.scrollIntoView({block:'center'});
        });
    }

    function enhance(input){
        if (!input || enhanced.has(input) || (input.type !== 'date' && input.type !== 'time')) return;
        if (input.closest('.custom-datetime-v5')) return;
        enhanced.add(input);

        const wrap=document.createElement('div'); wrap.className='custom-datetime-v5';
        const trigger=document.createElement('button'); trigger.type='button'; trigger.className='custom-datetime-v5-trigger';
        trigger.setAttribute('aria-haspopup','dialog'); trigger.setAttribute('aria-expanded','false');
        const icon=document.createElement('span'); icon.className='custom-datetime-v5-icon'; icon.textContent=input.type==='date'?'📅':'🕒';
        const label=document.createElement('span'); label.className='custom-datetime-v5-label';
        const chev=document.createElement('span'); chev.className='custom-datetime-v5-chevron'; chev.setAttribute('aria-hidden','true');
        trigger.append(icon,label,chev);

        const panel=document.createElement('div'); panel.className='custom-datetime-v5-panel'; panel.hidden=true; panel.setAttribute('role','dialog');
        document.body.appendChild(panel); wrap._customDateTimePanel=panel;

        input.parentNode.insertBefore(wrap,input);
        wrap.append(input,trigger);
        input.classList.add('custom-datetime-v5-native');
        syncLabel(input);

        trigger.onclick=(e)=>{
            e.stopPropagation();
            const willOpen=!wrap.classList.contains('open');
            closeAll(wrap);
            if (!willOpen){ close(wrap); return; }
            if (input.type==='date') buildDatePanel(input,panel); else buildTimePanel(input,panel);
            wrap.classList.add('open'); trigger.setAttribute('aria-expanded','true'); opened=wrap;
            panel.hidden=false; panel.classList.add('open'); panel.style.visibility='hidden';
            requestAnimationFrame(()=>position(wrap));
        };
        trigger.onkeydown=(e)=>{ if(e.key==='Escape'){ e.preventDefault(); close(wrap); } };
        input.addEventListener('change',()=>syncLabel(input));
    }

    const scan=(root=document)=>{
        if (root.matches?.('input[type="date"], input[type="time"]')) enhance(root);
        root.querySelectorAll?.('input[type="date"], input[type="time"]').forEach(enhance);
    };
    document.addEventListener('pointerdown',(e)=>{
        if(!opened) return;
        const panel=getPanel(opened);
        if(opened.contains(e.target)||panel?.contains(e.target)) return;
        close(opened);
    },true);
    window.addEventListener('resize',schedulePosition,{passive:true});
    window.addEventListener('scroll',schedulePosition,{passive:true});

    const obs=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType===1 && !n.classList?.contains('custom-datetime-v5-panel')) scan(n); })));
    const start=()=>{ scan(document); obs.observe(document.body,{childList:true,subtree:true}); };
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();

// ============================================================================
// KANBAN UX REFRESH V2 — safer drag/drop + responsive workspace/card editor
// ============================================================================
function ensureKanbanWorkspaceModal() {
    let modal = getEl('kanbanWorkspaceModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-overlay kanban-workspace-overlay';
        modal.id = 'kanbanWorkspaceModal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="kanban-workspace-box" role="dialog" aria-modal="true" aria-labelledby="kanbanWorkspaceTitle">
            <div class="kanban-workspace-head">
                <div>
                    <h3 id="kanbanWorkspaceTitle">📌 Kanban Workspace</h3>
                    <p id="kanbanWorkspaceSubtitle">Boards, columns and cards</p>
                </div>
                <button class="modal-close-soft" type="button" onclick="closeModal('kanbanWorkspaceModal')" aria-label="Close Kanban">✕</button>
            </div>
            <div class="kanban-workspace-actions">
                <div class="kanban-action-group kanban-action-primary">
                    <button class="btn-primary" type="button" onclick="addKanbanBoard()">＋ Board</button>
                    <button class="btn-secondary" type="button" onclick="renameKanbanBoard()" title="Rename active board">✎ Rename</button>
                    <button class="btn-secondary" type="button" id="kanbanLayoutToggleBtn" onclick="toggleKanbanLayoutMode()">⇄ Row view</button>
                    <button class="btn-real-danger" type="button" onclick="deleteKanbanBoard()" title="Delete board">Delete board</button>
                </div>
                <div class="kanban-search-shell">
                    <input id="kanbanWorkspaceSearch" type="search" aria-label="Search cards" oninput="renderKanbanWorkspaceBody()">
                    <button class="kanban-search-clear" type="button" onclick="clearKanbanWorkspaceSearch()" aria-label="Clear search">✕</button>
                </div>
            </div>
            <div class="kanban-workspace-layout">
                <aside id="kanbanBoardList" class="kanban-board-list" aria-label="Kanban boards"></aside>
                <main id="kanbanWorkspaceBody" class="kanban-workspace-body"></main>
            </div>
        </div>
    `;
}

function clearKanbanWorkspaceSearch() {
    const input = getEl('kanbanWorkspaceSearch');
    if (!input) return;
    input.value = '';
    renderKanbanWorkspaceBody();
    input.focus();
}

function renderKanbanWorkspaceBody() {
    const group = getGroup(kanbanWorkspaceState.groupId);
    if (!group) return;
    const workspace = normalizeKanbanGroup(group);
    const activeBoard = getKanbanBoard(group, kanbanWorkspaceState.boardId);
    if (!activeBoard) return;
    kanbanWorkspaceState.boardId = activeBoard.id;

    const keyword = (getEl('kanbanWorkspaceSearch')?.value || '').trim().toLowerCase();
    const isSearching = !!keyword;
    const layoutMode = kanbanLayoutMode === 'row' ? 'row' : 'column';
    const layoutBtn = getEl('kanbanLayoutToggleBtn');
    if (layoutBtn) layoutBtn.textContent = layoutMode === 'row' ? '▦ Columns' : '⇄ Rows';

    const boardList = getEl('kanbanBoardList');
    if (boardList) {
        boardList.innerHTML = `
            <div class="kanban-board-list-head"><span>Boards</span><button class="btn-secondary" type="button" onclick="addKanbanBoard()" title="New board">＋</button></div>
            ${workspace.boards.map(board => `
                <button type="button" class="kanban-board-tab ${board.id === activeBoard.id ? 'active' : ''}" onclick="kanbanWorkspaceState.boardId='${board.id}';renderKanbanWorkspaceBody()" title="${escapeHTML(board.title)}">
                    <span>${escapeHTML(board.title)}</span>
                    <small>${getKanbanCardCount(group, board.id)} cards · ${board.columns.length} cols</small>
                    <i class="kanban-board-dot" aria-hidden="true"></i>
                </button>
            `).join('')}
        `;
    }

    const subtitle = getEl('kanbanWorkspaceSubtitle');
    if (subtitle) subtitle.textContent = `${workspace.boards.length} boards · ${getKanbanCardCount(group)} cards · ${activeBoard.title}`;

    const body = getEl('kanbanWorkspaceBody');
    if (!body) return;
    body.innerHTML = `
        ${isSearching ? '<div class="kanban-search-note">Search is active. Drag & drop is temporarily disabled to protect card order.</div>' : ''}
        <div class="kanban-full-board ${layoutMode === 'row' ? 'kanban-row-mode' : 'kanban-column-mode'} ${isSearching ? 'is-searching' : ''}" data-group-id="${group.id}" data-board-id="${activeBoard.id}">
            ${activeBoard.columns.map(col => {
                const filteredCards = isSearching
                    ? col.cards.filter(card => [card.title, card.content, card.priority, card.deadline].filter(Boolean).join(' ').toLowerCase().includes(keyword))
                    : col.cards;
                return `
                    <section class="kanban-full-column" data-column-id="${col.id}">
                        <div class="kanban-full-column-head">
                            <strong title="${escapeHTML(col.title)}">${escapeHTML(col.title)}</strong>
                            <span>${isSearching ? `${filteredCards.length}/${col.cards.length}` : col.cards.length}</span>
                        </div>
                        <div class="kanban-full-column-actions">
                            <button type="button" onclick="openKanbanCardModal('${group.id}','${col.id}',null,'${activeBoard.id}')">＋ Card</button>
                            <button type="button" onclick="renameKanbanColumn('${group.id}','${col.id}','${activeBoard.id}')">Rename</button>
                            <button type="button" onclick="deleteKanbanColumn('${group.id}','${col.id}','${activeBoard.id}')">Delete</button>
                        </div>
                        <div class="kanban-workspace-card-list" data-group-id="${group.id}" data-board-id="${activeBoard.id}" data-column-id="${col.id}" data-searching="${isSearching ? '1' : '0'}">
                            ${filteredCards.length ? filteredCards.map(card => renderKanbanWorkspaceCardHTML(group.id, activeBoard.id, card)).join('') : `<div class="kanban-empty-column">${isSearching ? 'No matching cards' : 'Drop a card here or add one'}</div>`}
                        </div>
                    </section>
                `;
            }).join('')}
            <button type="button" class="kanban-full-column add-column" onclick="addKanbanColumn('${group.id}', '${activeBoard.id}')">＋ Add column</button>
        </div>
    `;
    initKanbanWorkspaceDragAndDrop();
}

function openKanbanCardModal(groupId = kanbanWorkspaceState.groupId, columnId = null, cardId = null, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    if (!board) return;
    const found = cardId ? findKanbanCard(group, cardId, board.id) : null;
    const firstColumn = board.columns[0];
    kanbanCardEditState = {
        groupId: group.id,
        boardId: found?.board?.id || board.id,
        columnId: found?.column?.id || columnId || firstColumn?.id,
        cardId: found?.card?.id || null
    };

    const titleInput = getEl('kanbanCardTitleInput');
    if (titleInput) {
        titleInput.value = found?.card?.title || '';
        titleInput.classList.remove('kanban-field-error');
        titleInput.removeAttribute('aria-invalid');
    }
    getEl('kanbanCardPriorityInput').value = found?.card?.priority || 'normal';
    getEl('kanbanCardDeadlineInput').value = found?.card?.deadline || '';
    getEl('kanbanCardContentInput').value = found?.card?.content || '';

    const columnSelect = getEl('kanbanCardColumnInput');
    if (columnSelect) {
        columnSelect.innerHTML = board.columns.map(col => `<option value="${col.id}">${escapeHTML(col.title)}</option>`).join('');
        columnSelect.value = kanbanCardEditState.columnId || firstColumn?.id || '';
    }

    const titleEl = getEl('kanbanCardModalTitle');
    const subtitleEl = getEl('kanbanCardModalSubtitle');
    if (titleEl) titleEl.textContent = found ? 'Edit card' : 'New card';
    if (subtitleEl) subtitleEl.textContent = found ? `Update this card in ${board.title}.` : `Create a card in ${board.title}.`;

    const deleteBtn = getEl('kanbanCardDeleteBtn');
    if (deleteBtn) deleteBtn.style.display = found ? 'inline-flex' : 'none';

    openKanbanTopModal('kanbanCardModal');
    setTimeout(() => titleInput?.focus(), 40);
}

function submitKanbanCardForm() {
    const group = getGroup(kanbanCardEditState.groupId);
    if (!group) return;
    const titleInput = getEl('kanbanCardTitleInput');
    const title = (titleInput?.value || '').trim();
    if (!title) {
        titleInput?.classList.add('kanban-field-error');
        titleInput?.setAttribute('aria-invalid', 'true');
        titleInput?.focus();
        return;
    }
    titleInput?.classList.remove('kanban-field-error');
    titleInput?.removeAttribute('aria-invalid');

    const targetColumnId = getEl('kanbanCardColumnInput')?.value || kanbanCardEditState.columnId;
    const data = {
        id: kanbanCardEditState.cardId || `card_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
        title,
        priority: getEl('kanbanCardPriorityInput')?.value || 'normal',
        deadline: getEl('kanbanCardDeadlineInput')?.value || '',
        content: getEl('kanbanCardContentInput')?.value || ''
    };

    if (kanbanCardEditState.cardId) {
        const found = findKanbanCard(group, kanbanCardEditState.cardId, kanbanCardEditState.boardId);
        if (!found) return;
        if (found.column.id === targetColumnId) {
            found.column.cards[found.index] = data;
        } else {
            found.column.cards.splice(found.index, 1);
            const targetColumn = getKanbanColumn(group, targetColumnId, kanbanCardEditState.boardId);
            if (targetColumn) targetColumn.cards.push(data);
            else found.column.cards.splice(found.index, 0, data);
        }
    } else {
        const targetColumn = getKanbanColumn(group, targetColumnId, kanbanCardEditState.boardId);
        if (!targetColumn) return;
        targetColumn.cards.push(data);
    }

    closeKanbanTopModal('kanbanCardModal');
    refreshKanbanAfterChange(group.id, kanbanCardEditState.boardId);
}

function initKanbanWorkspaceDragAndDrop() {
    if (typeof Sortable === 'undefined') return;
    document.querySelectorAll('.kanban-workspace-card-list').forEach(list => {
        const previous = Sortable.get(list);
        if (previous) previous.destroy();
        if (list.dataset.searching === '1') return;

        Sortable.create(list, {
            group: `kanban-board-${list.dataset.groupId}-${list.dataset.boardId}`,
            animation: 170,
            ghostClass: 'sortable-ghost-link',
            chosenClass: 'sortable-chosen',
            draggable: '.kanban-card',
            filter: '.kanban-empty-column',
            delay: window.innerWidth <= 768 ? 220 : 0,
            delayOnTouchOnly: true,
            touchStartThreshold: 5,
            fallbackTolerance: 5,
            forceFallback: window.innerWidth <= 768,
            onEnd: event => {
                const group = getGroup(event.from.dataset.groupId);
                if (!group) return;
                const boardId = event.from.dataset.boardId;
                const cardId = event.item?.dataset?.cardId;
                if (!cardId) return renderKanbanWorkspaceBody();

                const fromColumn = getKanbanColumn(group, event.from.dataset.columnId, boardId);
                const toColumn = getKanbanColumn(group, event.to.dataset.columnId, boardId);
                if (!fromColumn || !toColumn) return renderKanbanWorkspaceBody();

                const sourceIndex = fromColumn.cards.findIndex(card => card.id === cardId);
                if (sourceIndex < 0) return renderKanbanWorkspaceBody();
                const [moved] = fromColumn.cards.splice(sourceIndex, 1);

                const requestedIndex = Number.isInteger(event.newDraggableIndex)
                    ? event.newDraggableIndex
                    : event.newIndex;
                const targetIndex = Math.max(0, Math.min(requestedIndex ?? toColumn.cards.length, toColumn.cards.length));
                toColumn.cards.splice(targetIndex, 0, moved);
                refreshKanbanAfterChange(group.id, boardId);
            }
        });
    });
}

// ============================================================================
// DURABLE GOOGLE SESSION V5 — Vercel backend + refresh token
// Keeps Drive writes locked until the cloud workspace has been hydrated.
// ============================================================================
(() => {
    const BACKUP_KEY = 'workspaceEmergencyBackupsV5';
    const MAX_BACKUPS = 8;
    let durableRestoreStarted = false;

    function emergencyBackup(reason = 'manual') {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const data = raw ? JSON.parse(raw) : state.dashboardData;
            const backups = JSON.parse(localStorage.getItem(BACKUP_KEY) || '[]');
            backups.unshift({ at: new Date().toISOString(), reason, data });
            localStorage.setItem(BACKUP_KEY, JSON.stringify(backups.slice(0, MAX_BACKUPS)));
            return true;
        } catch (e) {
            console.warn('Emergency backup failed:', e);
            return false;
        }
    }

    function lockDriveWritesV5() {
        try {
            if (typeof __driveAutoSyncReady !== 'undefined') __driveAutoSyncReady = false;
            if (typeof __driveAutoSaveTimer !== 'undefined') clearTimeout(__driveAutoSaveTimer);
        } catch (_) {}
    }

    async function getDurableAccessTokenV5() {
        const res = await fetch('/api/auth/token', { credentials: 'same-origin', cache: 'no-store' });
        if (res.status === 401) return null;
        if (!res.ok) throw new Error(`Durable token endpoint failed (${res.status})`);
        return res.json();
    }

    async function restoreDurableGoogleSessionV5() {
        if (durableRestoreStarted) return false;
        durableRestoreStarted = true;
        lockDriveWritesV5();

        try {
            const token = await getDurableAccessTokenV5();
            if (!token?.access_token) return false;

            const expiresIn = Number(token.expires_in || 3600);
            const gapiToken = {
                access_token: token.access_token,
                token_type: token.token_type || 'Bearer',
                expires_in: expiresIn,
                scope: token.scope || SCOPES
            };
            gapi.client.setToken(gapiToken);

            localStorage.setItem('google_oauth_token', JSON.stringify({
                ...gapiToken,
                saved_at: Date.now(),
                expires_at: Date.now() + expiresIn * 1000
            }));

            currentAccountAccess = { checked:false, role:'user', blocked:false, sessionRevoked:false };
            updateGoogleAccountUI();
            updateGooglePermissionGate();

            emergencyBackup('before-durable-cloud-hydration');
            await fetchGoogleAccountProfile();

            if (!currentAccountAccess.blocked && !currentAccountAccess.sessionRevoked) {
                const ok = await fetchFileFromGoogleDrive();
                if (ok === false) lockDriveWritesV5();
            }
            return true;
        } catch (e) {
            lockDriveWritesV5();
            console.warn('Durable Google session restore failed; cloud auto-save stays locked:', e);
            return false;
        }
    }

    // Interactive connect now uses Authorization Code flow on the backend.
    handleAuthClick = function(forceAccountChooser = false, forceConsent = false) {
        emergencyBackup('before-google-connect');
        lockDriveWritesV5();
        const returnTo = location.pathname + location.search + location.hash;
        const qs = new URLSearchParams({ returnTo });
        if (forceAccountChooser) qs.set('selectAccount', '1');
        if (forceConsent) qs.set('forceConsent', '1');
        location.href = `/api/auth/google/start?${qs.toString()}`;
    };

    const oldDisconnectV5 = disconnectGoogleAccount;
    disconnectGoogleAccount = async function(options = {}) {
        emergencyBackup('before-google-disconnect');
        lockDriveWritesV5();
        try { await fetch('/api/auth/logout', { method:'POST', credentials:'same-origin' }); } catch (_) {}

        // IMPORTANT: signing out of this website must NOT revoke the Google OAuth
        // grant. Revoking would also invalidate the backend refresh token and can
        // break the durable Vercel session. We only clear this website's session.
        return oldDisconnectV5.call(this, { ...options, revoke: false });
    };

    switchGoogleAccount = async function() {
        emergencyBackup('before-google-account-switch');
        lockDriveWritesV5();
        try { await fetch('/api/auth/logout', { method:'POST', credentials:'same-origin' }); } catch (_) {}
        try { if (gapiInited) gapi.client.setToken(null); } catch (_) {}
        localStorage.removeItem('google_oauth_token');
        localStorage.removeItem(GOOGLE_ACCOUNT_PROFILE_KEY);
        googleAccountProfile = null;
        googleFileId = null;
        const returnTo = location.pathname + location.search + location.hash;
        location.href = `/api/auth/google/start?selectAccount=1&forceConsent=1&returnTo=${encodeURIComponent(returnTo)}`;
    };

    // Add a final backup immediately before any cloud hydration replaces local state.
    const fetchDriveBeforeDurableWrapV5 = fetchFileFromGoogleDrive;
    fetchFileFromGoogleDrive = async function() {
        emergencyBackup('before-drive-load');
        return fetchDriveBeforeDurableWrapV5.apply(this, arguments);
    };

    function waitForGoogleLibrariesV5() {
        let attempts = 0;
        const timer = setInterval(() => {
            attempts++;
            if (gapiInited && gisInited && tokenClient && gapi?.client) {
                clearInterval(timer);
                restoreDurableGoogleSessionV5();
            } else if (attempts >= 60) {
                clearInterval(timer);
                lockDriveWritesV5();
            }
        }, 200);
    }

    window.addEventListener('load', waitForGoogleLibrariesV5, { once:true });

    window.workspaceRecovery = {
        list() {
            try { return JSON.parse(localStorage.getItem(BACKUP_KEY) || '[]'); }
            catch (_) { return []; }
        },
        backup(reason = 'manual') { return emergencyBackup(reason); },
        restore(index = 0) {
            const item = this.list()[index];
            if (!item || !Array.isArray(item.data)) return false;
            lockDriveWritesV5();
            state.dashboardData = item.data;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(item.data));
            renderDashboard();
            updateScheduleUI?.();
            return true;
        },
        status() {
            return {
                googleConnected: !!gapi?.client?.getToken?.()?.access_token,
                driveAutoSaveReady: typeof __driveAutoSyncReady !== 'undefined' ? __driveAutoSyncReady : false,
                backups: this.list().length
            };
        }
    };
})();

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
            /* Floating sync status is owned by V2; do not hide it here. */

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

    document.addEventListener('DOMContentLoaded', () => {
        ensureAvatarControlsV3();
        applyEffectiveAvatarToUI();
        refreshCurrentAccountSaveState();

        // Leave the existing "Ctrl + K Quick Find" element untouched.
    });

    window.addEventListener('load', () => {

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

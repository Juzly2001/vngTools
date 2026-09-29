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
            /* Edge-mounted sync progress: never overlaps the desktop sidebar. */
            #driveAutoSaveIndicator{
                position:fixed;left:0;right:0;bottom:0;z-index:2400;height:3px;
                width:auto;max-width:none;min-height:0;padding:0;margin:0;border:0;border-radius:0;
                display:block;box-shadow:none;background:transparent;overflow:hidden;pointer-events:none;
                opacity:1;visibility:visible;transform:none;transition:opacity .2s ease;
                --drive-progress-color:var(--accent-color,var(--primary-color,#648dff));
            }
            body.sidebar-pro-enabled #driveAutoSaveIndicator{left:var(--sidebar-expanded-width,226px)}
            body.sidebar-pro-enabled.sidebar-pro-collapsed #driveAutoSaveIndicator{left:var(--sidebar-collapsed-width,72px)}
            #driveAutoSaveIndicator[data-state="idle"],#driveAutoSaveIndicator:not(.drive-toast-visible){opacity:0;visibility:hidden}
            #driveAutoSaveIndicator .drive-save-dot,#driveAutoSaveIndicator .drive-save-content{display:none!important}
            #driveAutoSaveIndicator .drive-save-track{position:absolute;inset:0;height:100%;background:color-mix(in srgb,var(--drive-progress-color) 14%,transparent);overflow:hidden}
            #driveAutoSaveIndicator .drive-save-track::after{content:"";display:block;width:35%;height:100%;background:var(--drive-progress-color);transform:translateX(-110%)}
            #driveAutoSaveIndicator[data-state="saving"] .drive-save-track::after{animation:driveSaveTravel 1.4s ease-in-out infinite}
            #driveAutoSaveIndicator[data-state="saved"] .drive-save-track::after{animation:none;width:100%;transform:none;background:#16a34a}
            #driveAutoSaveIndicator[data-state="error"] .drive-save-track::after,#driveAutoSaveIndicator[data-state="offline"] .drive-save-track::after{animation:none;width:100%;transform:none;background:#e09b32}
            @keyframes driveSaveTravel{from{transform:translateX(-110%)}to{transform:translateX(400%)}}
            @media(prefers-reduced-motion:reduce){#driveAutoSaveIndicator .drive-save-track::after{animation-duration:3s}}
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
                #driveAutoSaveIndicator,body.sidebar-pro-enabled #driveAutoSaveIndicator,body.sidebar-pro-enabled.sidebar-pro-collapsed #driveAutoSaveIndicator{left:0;right:0;bottom:env(safe-area-inset-bottom);width:100%;max-width:none;height:3px}
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
            el.innerHTML = `<span class="drive-save-dot" aria-hidden="true">☁</span><span class="drive-save-content"><span class="drive-save-heading">Google Drive</span><span id="driveAutoSaveIndicatorText">Local cache ready</span></span><span class="drive-save-track" aria-hidden="true"></span>`;
            el.setAttribute('role', 'status');
            el.setAttribute('aria-live', 'polite');
            el.setAttribute('aria-label', 'Google Drive sync status');
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
        clearTimeout(statusResetTimer);
        el.dataset.state = stateName;
        el.classList.toggle('drive-toast-visible', stateName !== 'idle');
        const textEl = document.getElementById('driveAutoSaveIndicatorText');
        if (textEl) textEl.textContent = text;
        const heading = el.querySelector('.drive-save-heading');
        el.setAttribute('aria-label', text || stateName);
        if (heading) heading.textContent = stateName === 'saving' ? 'Đang đồng bộ Google Drive' :
            stateName === 'saved' ? 'Đã đồng bộ Google Drive' :
            stateName === 'error' ? 'Đồng bộ thất bại' :
            stateName === 'offline' ? 'Chưa đồng bộ lên Drive' : 'Google Drive';
        const dot = el.querySelector('.drive-save-dot');
        if (dot) dot.textContent = stateName === 'saved' ? '✓' :
            ['error','offline'].includes(stateName) ? '!' : '☁';
        if (!sticky && ['saved', 'merged'].includes(stateName)) {
            statusResetTimer = setTimeout(() => {
                if (el.dataset.state === stateName && !dirty) {
                    el.classList.remove('drive-toast-visible');
                    el.dataset.state = 'idle';
                }
            }, 3000);
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

            if (dirty) setSaveStatus('saving', 'New changes queued · waiting for next Drive confirmation', {sticky:true});
            else setSaveStatus('saved', `Saved to Drive ✓ · ${formatClock(lastSavedAt)}`);
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

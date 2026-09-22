// 9. LOCAL BACKUP (JSON EXPORT/IMPORT)
// ==========================================
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.dashboardData, null, 2));
    const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "workspace_backup.json");
    document.body.appendChild(a); a.click(); a.remove();
}

function importData(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data)) { state.dashboardData = data; saveData(); }
        } catch (err) { alert("Invalid file!"); }
    };
    reader.readAsText(file); event.target.value = '';
}

// ==========================================
// 10. ĐỒNG BỘ ĐÁM MÂY GOOGLE DRIVE (GAPI)
// ==========================================


function getGrantedGoogleScopes() {
    const scopeText = String(gapiInited ? (gapi.client.getToken()?.scope || '') : '');
    return new Set(scopeText.split(/\s+/).filter(Boolean));
}

function getGooglePermissionState() {
    const granted = getGrantedGoogleScopes();
    const hasAny = aliases => aliases.some(scope => granted.has(scope));
    return {
        profile: hasAny(REQUIRED_GOOGLE_SCOPE_GROUPS.profile),
        email: hasAny(REQUIRED_GOOGLE_SCOPE_GROUPS.email),
        drive: hasAny(REQUIRED_GOOGLE_SCOPE_GROUPS.drive),
        appdata: hasAny(REQUIRED_GOOGLE_SCOPE_GROUPS.appdata),
        openid: hasAny(REQUIRED_GOOGLE_SCOPE_GROUPS.openid)
    };
}

function hasRequiredGoogleScopes() {
    if (!isGoogleConnected()) return false;
    const s = getGooglePermissionState();
    return s.profile && s.email && s.drive && s.appdata && s.openid;
}

function setGooglePermissionGateMessage(message, type = '') {
    const el = getEl('googlePermissionGateMessage');
    if (!el) return;
    el.textContent = message || '';
    el.classList.toggle('is-error', type === 'error');
    el.classList.toggle('is-ok', type === 'ok');
}

function updateGateIdentity() {
    const wrap = getEl('googleGateIdentity');
    if (!wrap) return;
    const connected = isGoogleConnected();
    const profile = googleAccountProfile;
    wrap.style.display = connected && profile ? 'flex' : 'none';

    const avatar = getEl('googleGateAvatar');
    const fallback = getEl('googleGateAvatarFallback');
    if (avatar && fallback) {
        if (profile?.picture) {
            avatar.src = profile.picture;
            avatar.style.display = 'block';
            fallback.style.display = 'none';
        } else {
            avatar.style.display = 'none';
            fallback.style.display = 'grid';
            fallback.textContent = getAccountInitial(profile);
        }
    }
    if (getEl('googleGateName')) getEl('googleGateName').textContent = profile?.name || 'Google account';
    if (getEl('googleGateEmail')) getEl('googleGateEmail').textContent = profile?.email || '—';
    if (getEl('googleGateRole')) {
        const role = currentAccountAccess?.role || 'user';
        getEl('googleGateRole').textContent = currentAccountAccess?.checked
            ? `${role.charAt(0).toUpperCase() + role.slice(1)} access`
            : 'Checking account access…';
    }
}

function updateGooglePermissionGate() {
    const gate = getEl('googlePermissionGate');
    const button = getEl('googlePermissionGateButton');
    const switchBtn = getEl('googlePermissionSwitchButton');
    if (!gate) return false;

    updateGateIdentity();
    const ready = gapiInited && gisInited && !!tokenClient;
    const connected = isGoogleConnected();
    const p = connected ? getGooglePermissionState() : {
        profile:false, email:false, drive:false, appdata:false, openid:false
    };

    gate.querySelectorAll('[data-scope-check]').forEach(row => {
        const granted = !!p[row.dataset.scopeCheck];
        row.classList.toggle('is-granted', granted);
        row.classList.toggle('is-missing', connected && !granted);
        const mark = row.querySelector('.google-permission-scope-status');
        if (mark) mark.textContent = granted ? '✓' : (connected ? '!' : '○');
    });

    gate.classList.toggle('is-blocked', !!currentAccountAccess?.blocked || !!currentAccountAccess?.sessionRevoked);
    if (switchBtn) switchBtn.style.display = connected ? 'inline-flex' : 'none';

    if (!ready) {
        gate.classList.remove('is-hidden');
        if (button) { button.disabled = true; button.style.display = 'inline-flex'; button.textContent = '⏳ Loading Google…'; }
        setGooglePermissionGateMessage('Initializing Google sign-in…');
        return false;
    }

    if (!connected || !hasRequiredGoogleScopes()) {
        gate.classList.remove('is-hidden');
        if (button) {
            button.disabled = false;
            button.style.display = 'inline-flex';
            button.textContent = connected ? '🔑 Grant missing permissions' : '🔑 Sign in with Google & grant permissions';
        }
        if (connected) {
            const missing = [];
            if (!p.profile) missing.push('Profile');
            if (!p.email) missing.push('Email');
            if (!p.drive) missing.push('Google Drive');
            if (!p.appdata) missing.push('Drive App Data');
            if (!p.openid) missing.push('OpenID');
            setGooglePermissionGateMessage(`Missing required permissions: ${missing.join(', ')}. Sign in again and select every requested permission.`, 'error');
        } else {
            setGooglePermissionGateMessage('Sign in and select all requested permissions on Google’s consent screen.');
        }
        return false;
    }

    if (!googleAccountProfile || !currentAccountAccess.checked) {
        gate.classList.remove('is-hidden');
        if (button) { button.disabled = true; button.style.display = 'none'; }
        setGooglePermissionGateMessage('Google permissions are valid. Checking account role and session…');
        return false;
    }

    if (currentAccountAccess.blocked) {
        gate.classList.remove('is-hidden');
        if (button) button.style.display = 'none';
        setGooglePermissionGateMessage('This Google account has been blocked by the Owner. Use another account or contact the Owner.', 'error');
        return false;
    }

    if (currentAccountAccess.sessionRevoked) {
        gate.classList.remove('is-hidden');
        if (button) button.style.display = 'none';
        setGooglePermissionGateMessage('This browser session was revoked by an administrator. Sign in again to create a new session.', 'error');
        return false;
    }

    gate.classList.add('is-hidden');
    if (button) { button.disabled = false; button.style.display = 'inline-flex'; button.textContent = '✓ Access granted'; }
    setGooglePermissionGateMessage('Access granted.', 'ok');
    return true;
}

function clearStoredGoogleOAuthState() {
    if (gapiInited) gapi.client.setToken(null);
    localStorage.removeItem('google_oauth_token');
    localStorage.removeItem(GOOGLE_ACCOUNT_PROFILE_KEY);
    googleAccountProfile = null;
    googleFileId = null;
    stopAccountHeartbeat();
    hasTrackedCurrentSession = false;
    currentAccountAccess = { checked:false, role:'user', blocked:false, sessionRevoked:false };
    adminCurrentUserRole = null;
    registryOwnerInfo = null;
    updateGoogleAccountUI();
}

function rejectPartialGooglePermissionGrant() {
    console.warn('Google permission gate blocked a partial grant. Granted scopes:', gapi.client.getToken()?.scope || '');
    clearStoredGoogleOAuthState();
    updateGooglePermissionGate();
    setGooglePermissionGateMessage('You did not grant all required permissions. Try again and select every requested permission on Google’s screen.', 'error');
}

function handlePermissionGateConnect() {
    if (!gapiInited || !gisInited || !tokenClient) {
        updateGooglePermissionGate();
        return;
    }
    if (isGoogleConnected() && (!hasRequiredGoogleScopes() || currentAccountAccess.blocked || currentAccountAccess.sessionRevoked)) {
        clearStoredGoogleOAuthState();
    }
    handleAuthClick(false, false);
}

function enforceGooglePermissions() {
    return updateGooglePermissionGate();
}

function gapiLoaded() { gapi.load('client', intializeGapiClient); }
async function intializeGapiClient() {
    await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] });
    gapiInited = true;
    checkAuthStates();
    updateGooglePermissionGate();
}
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({ client_id: CLIENT_ID, scope: SCOPES, callback: '' });
    gisInited = true;
    checkAuthStates();
    updateGooglePermissionGate();
}


function isAccountRegistryConfigured() {
    return /^[A-Za-z0-9_-]{10,}$/.test(String(ACCOUNT_REGISTRY_FILE_ID || '').trim());
}

function getBrowserLabel() {
    const ua = navigator.userAgent || '';
    if (/Edg\//.test(ua)) return 'Edge';
    if (/OPR\//.test(ua)) return 'Opera';
    if (/Chrome\//.test(ua)) return 'Chrome';
    if (/Firefox\//.test(ua)) return 'Firefox';
    if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari';
    return 'Browser';
}

function getDeviceLabel() {
    const ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iPhone / iPad';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Device';
}

function normalizeRegistry(raw) {
    const obj = raw && typeof raw === 'object' ? raw : {};
    return {
        schema_version: 3,
        revision: Number(obj.revision || 0),
        updated_at: obj.updated_at || null,
        accounts: Array.isArray(obj.accounts) ? obj.accounts : [],
        audit_log: Array.isArray(obj.audit_log) ? obj.audit_log.slice(0, AUDIT_LOG_LIMIT) : []
    };
}

async function driveFetch(url, options = {}) {
    const token = gapi.client.getToken()?.access_token;
    if (!token) throw new Error('Please connect Google first.');
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    return fetch(url, { ...options, headers });
}

async function readAccountRegistryWithVersion() {
    if (!isAccountRegistryConfigured()) throw new Error('Google Drive registry file ID is not configured.');
    if (!isGoogleConnected()) throw new Error('Please connect Google first.');

    const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(ACCOUNT_REGISTRY_FILE_ID)}?alt=media`;
    const response = await driveFetch(url, { method:'GET', cache:'no-store' });

    if (response.status === 403) throw new Error('Google Drive denied access to web_accounts.json. Check Drive sharing and OAuth Drive scopes.');
    if (response.status === 404) throw new Error('web_accounts.json was not found. Check ACCOUNT_REGISTRY_FILE_ID.');
    if (!response.ok) throw new Error(`Cannot read web_accounts.json (${response.status}).`);

    const etag = response.headers.get('etag') || '';
    const text = await response.text();
    let parsed;
    try { parsed = JSON.parse(text || '{"accounts":[]}'); }
    catch (_) { throw new Error('web_accounts.json contains invalid JSON.'); }
    return { registry:normalizeRegistry(parsed), etag };
}

async function readAccountRegistry() {
    return (await readAccountRegistryWithVersion()).registry;
}

async function writeAccountRegistry(registry, etag = '') {
    const payload = JSON.stringify(normalizeRegistry(registry), null, 2);
    const headers = { 'Content-Type':'application/json; charset=UTF-8' };
    if (etag) headers['If-Match'] = etag;

    const url = `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(ACCOUNT_REGISTRY_FILE_ID)}?uploadType=media`;
    const response = await driveFetch(url, { method:'PATCH', headers, body:payload });

    if (response.status === 412) {
        const err = new Error('REGISTRY_CONFLICT');
        err.code = 'REGISTRY_CONFLICT';
        throw err;
    }
    if (response.status === 403) throw new Error('No write permission for web_accounts.json.');
    if (!response.ok) throw new Error(`Cannot update web_accounts.json (${response.status}).`);
    return true;
}

async function mutateAccountRegistry(mutator, { retries = 6 } = {}) {
    let lastError = null;
    for (let attempt = 0; attempt < retries; attempt++) {
        const { registry, etag } = await readAccountRegistryWithVersion();
        const working = normalizeRegistry(JSON.parse(JSON.stringify(registry)));
        await mutator(working);
        working.revision = Number(registry.revision || 0) + 1;
        working.updated_at = new Date().toISOString();

        try {
            await writeAccountRegistry(working, etag);
            adminRegistryCache = working;
            return working;
        } catch (error) {
            lastError = error;
            if (error?.code !== 'REGISTRY_CONFLICT') throw error;
            await new Promise(r => setTimeout(r, 120 + Math.floor(Math.random()*240) + attempt*90));
        }
    }
    throw lastError || new Error('Registry is busy. Please retry.');
}

async function getRegistryOwnerInfo(force = false) {
    if (registryOwnerInfo && !force) return registryOwnerInfo;
    try {
        const response = await gapi.client.drive.files.get({
            fileId:ACCOUNT_REGISTRY_FILE_ID,
            fields:'id,name,owners(displayName,emailAddress,photoLink,permissionId,me)'
        });
        const owners = Array.isArray(response.result?.owners) ? response.result.owners : [];
        const me = owners.find(o => o.me) || null;
        registryOwnerInfo = {
            is_owner:!!me,
            owner_email:owners[0]?.emailAddress || '',
            owner_name:owners[0]?.displayName || '',
            owner_permission_id:owners[0]?.permissionId || ''
        };
        return registryOwnerInfo;
    } catch (error) {
        console.warn('Could not read registry owner metadata:', error);
        registryOwnerInfo = { is_owner:false, owner_email:'', owner_name:'', owner_permission_id:'' };
        return registryOwnerInfo;
    }
}

function ensureAccountShape(account, now = new Date().toISOString()) {
    if (!account || typeof account !== 'object') account = {};
    account.role = ['owner','admin','user','blocked'].includes(account.role) ? account.role : 'user';
    account.first_seen = account.first_seen || now;
    account.last_seen = account.last_seen || now;
    account.visit_count = Number(account.visit_count || 0);
    account.sessions = Array.isArray(account.sessions) ? account.sessions : [];
    return account;
}

function appendAudit(registry, { action, actor = googleAccountProfile, target = null, detail = '', session_id = dashboardWebSessionId }) {
    registry.audit_log = Array.isArray(registry.audit_log) ? registry.audit_log : [];
    registry.audit_log.unshift({
        id: crypto.randomUUID ? crypto.randomUUID() : `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        at:new Date().toISOString(),
        action:String(action || 'event').slice(0,80),
        actor_id:actor?.id || '',
        actor_email:actor?.email || '',
        actor_name:actor?.name || '',
        target_id:target?.user_id || target?.id || '',
        target_email:target?.email || '',
        detail:String(detail || '').slice(0,500),
        session_id:session_id || ''
    });
    registry.audit_log = registry.audit_log.slice(0, AUDIT_LOG_LIMIT);
}

function findCurrentAccount(registry) {
    const uid = String(googleAccountProfile?.id || '');
    const email = String(googleAccountProfile?.email || '').toLowerCase();
    return registry.accounts.find(a =>
        (uid && String(a.user_id || '') === uid) ||
        (email && String(a.email || '').toLowerCase() === email)
    ) || null;
}

function findCurrentSession(account) {
    return (account?.sessions || []).find(s => s.session_id === dashboardWebSessionId) || null;
}

async function evaluateCurrentAccountAccess({ createIfMissing = true, recordVisit = false } = {}) {
    if (!isGoogleConnected() || !googleAccountProfile?.id || !hasRequiredGoogleScopes()) {
        currentAccountAccess = { checked:false, role:'user', blocked:false, sessionRevoked:false };
        updateGooglePermissionGate();
        return currentAccountAccess;
    }

    const owner = await getRegistryOwnerInfo();

    if (createIfMissing) {
        await mutateAccountRegistry(reg => {
            const now = new Date().toISOString();
            let account = findCurrentAccount(reg);
            const isNewAccount = !account;

            if (!account) {
                account = ensureAccountShape({
                    user_id:String(googleAccountProfile.id),
                    email:googleAccountProfile.email || '',
                    name:googleAccountProfile.name || '',
                    picture:googleAccountProfile.picture || '',
                    first_seen:now,
                    last_seen:now,
                    visit_count:0,
                    role:owner.is_owner ? 'owner' : 'user',
                    sessions:[]
                }, now);
                reg.accounts.push(account);
            } else {
                ensureAccountShape(account, now);
            }

            if (owner.is_owner) account.role = 'owner';
            account.user_id = String(googleAccountProfile.id);
            account.email = googleAccountProfile.email || account.email || '';
            account.name = googleAccountProfile.name || account.name || '';
            account.picture = googleAccountProfile.picture || account.picture || '';

            let session = findCurrentSession(account);
            const newSession = !session;
            if (!session) {
                session = {
                    session_id:dashboardWebSessionId,
                    created_at:now,
                    last_seen:now,
                    browser:getBrowserLabel(),
                    device:getDeviceLabel(),
                    user_agent:(navigator.userAgent || '').slice(0,500),
                    last_page:`${location.pathname}${location.search}`.slice(0,500),
                    revoked:false,
                    revoked_at:null,
                    revoked_by:''
                };
                account.sessions.unshift(session);
            }

            session.last_seen = now;
            session.browser = getBrowserLabel();
            session.device = getDeviceLabel();
            session.user_agent = (navigator.userAgent || '').slice(0,500);
            session.last_page = `${location.pathname}${location.search}`.slice(0,500);

            account.sessions = account.sessions
                .sort((a,b) => new Date(b.last_seen || 0) - new Date(a.last_seen || 0))
                .slice(0,15);

            account.last_seen = now;
            account.last_session_id = dashboardWebSessionId;
            account.browser = session.browser;
            account.user_agent = session.user_agent;
            account.last_page = session.last_page;
            if (recordVisit || isNewAccount || newSession) account.visit_count = Number(account.visit_count || 0) + 1;

            if (newSession) {
                appendAudit(reg, {
                    action:isNewAccount ? 'account_created' : 'session_started',
                    target:account,
                    detail:`${session.device} · ${session.browser}`
                });
            }
        });
    }

    const registry = await readAccountRegistry();
    const account = findCurrentAccount(registry);
    const session = findCurrentSession(account);

    currentAccountAccess = {
        checked:true,
        role:owner.is_owner ? 'owner' : (account?.role || 'user'),
        blocked:!owner.is_owner && account?.role === 'blocked',
        sessionRevoked:!!session?.revoked
    };
    adminCurrentUserRole = currentAccountAccess.role;
    updateGoogleAccountUI();
    updateGooglePermissionGate();
    return currentAccountAccess;
}

async function trackCurrentWebAccount(forceNewSession = false) {
    if (!isAccountRegistryConfigured() || !isGoogleConnected() || !googleAccountProfile?.id || !hasRequiredGoogleScopes()) return;
    try {
        const access = await evaluateCurrentAccountAccess({ createIfMissing:true, recordVisit:forceNewSession || !hasTrackedCurrentSession });
        hasTrackedCurrentSession = true;
        if (access.blocked || access.sessionRevoked) stopAccountHeartbeat();
    } catch (error) {
        console.warn('Google Drive account heartbeat failed:', error);
    }
}

async function checkCurrentAccountAccessOnly() {
    if (!isGoogleConnected() || !googleAccountProfile?.id || !hasRequiredGoogleScopes() || !isAccountRegistryConfigured()) return null;

    try {
        const owner = await getRegistryOwnerInfo();
        const registry = await readAccountRegistry();
        const account = findCurrentAccount(registry);
        const session = findCurrentSession(account);

        currentAccountAccess = {
            checked:true,
            role:owner.is_owner ? 'owner' : (account?.role || 'user'),
            blocked:!owner.is_owner && account?.role === 'blocked',
            sessionRevoked:!!session?.revoked
        };

        adminCurrentUserRole = currentAccountAccess.role;
        updateGoogleAccountUI();
        updateGooglePermissionGate();

        if (currentAccountAccess.blocked || currentAccountAccess.sessionRevoked) {
            stopAccountHeartbeat();
        }

        return currentAccountAccess;
    } catch (error) {
        console.warn('Google Drive account access check failed:', error);
        return null;
    }
}

function startAccountHeartbeat() {
    stopAccountHeartbeat();
    if (!isGoogleConnected() || !googleAccountProfile?.id || !isAccountRegistryConfigured()) return;

    trackCurrentWebAccount(true);

    let lastHeartbeatWrite = Date.now();
    accountHeartbeatTimer = setInterval(async () => {
        if (document.visibilityState !== 'visible') return;

        const access = await checkCurrentAccountAccessOnly();
        if (!access || access.blocked || access.sessionRevoked) return;

        if (Date.now() - lastHeartbeatWrite >= ACCOUNT_HEARTBEAT_MS) {
            lastHeartbeatWrite = Date.now();
            trackCurrentWebAccount(false);
        }
    }, ACCOUNT_ACCESS_CHECK_MS);
}

function stopAccountHeartbeat() {
    if (accountHeartbeatTimer) {
        clearInterval(accountHeartbeatTimer);
        accountHeartbeatTimer = null;
    }
}

function formatAdminLastSeen(value) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    const diff = Date.now() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)} hr ago`;
    return d.toLocaleString();
}

function normalizeAdminAccounts(accounts) {
    const now = Date.now();
    return (Array.isArray(accounts) ? accounts : []).map(raw => {
        const a = ensureAccountShape({ ...raw });
        const sessions = (a.sessions || []).map(s => ({
            ...s,
            is_online:!s.revoked && !!s.last_seen && (now - new Date(s.last_seen).getTime() < 90000)
        }));
        const active = sessions.filter(s => s.is_online);
        return { ...a, sessions, active_session_count:active.length, is_online:active.length > 0 };
    }).sort((a,b) => new Date(b.last_seen || 0) - new Date(a.last_seen || 0));
}

function canCurrentAccountOpenAdmin() {
    return currentAccountAccess?.role === 'owner' || currentAccountAccess?.role === 'admin';
}

function canManageTargetAccount(target) {
    if (!target || target.role === 'owner') return false;
    if (currentAccountAccess?.role === 'owner') return true;
    return currentAccountAccess?.role === 'admin' && target.role === 'user';
}

async function openAdminConsole() {
    openModal('adminConsoleModal');
    if (getEl('adminConfigHint')) getEl('adminConfigHint').textContent = 'Owner is detected automatically from web_accounts.json on Google Drive.';

    if (!isGoogleConnected() || !hasRequiredGoogleScopes()) {
        showAdminLocked('Connect Google and grant all permissions first.');
        return;
    }

    try {
        if (!googleAccountProfile) await fetchGoogleAccountProfile();
        await evaluateCurrentAccountAccess({ createIfMissing:true, recordVisit:false });

        if (!canCurrentAccountOpenAdmin()) {
            showAdminLocked('This Google account is not Owner/Admin.');
            return;
        }

        await refreshAdminAccounts(false);
        showAdminUnlocked();
        try {
            await mutateAccountRegistry(reg => appendAudit(reg, {
                action:'admin_console_opened',
                detail:`Role: ${currentAccountAccess.role}`
            }));
        } catch (_) {}
    } catch (error) {
        showAdminLocked(error.message || 'Unable to verify Admin access.');
    }
}

function showAdminLocked(message = '') {
    if (getEl('adminLockedView')) getEl('adminLockedView').style.display = 'block';
    if (getEl('adminUnlockedView')) getEl('adminUnlockedView').style.display = 'none';
    if (message && getEl('adminAccessMessage')) getEl('adminAccessMessage').textContent = message;
}

function showAdminUnlocked() {
    if (getEl('adminLockedView')) getEl('adminLockedView').style.display = 'none';
    if (getEl('adminUnlockedView')) getEl('adminUnlockedView').style.display = 'block';
    if (getEl('adminIdentityLine')) getEl('adminIdentityLine').textContent =
        `${googleAccountProfile?.email || 'Google account'} · ${String(currentAccountAccess.role || '').toUpperCase()}`;
}

function lockAdminConsole() {
    adminAccountsCache = [];
    adminAuditCache = [];
    adminRegistryCache = null;
    showAdminLocked('Owner or Admin account required.');
}

async function refreshAdminAccounts(showError = false) {
    if (!canCurrentAccountOpenAdmin()) return showAdminLocked('This Google account is not Owner/Admin.');
    try {
        const registry = await readAccountRegistry();
        adminRegistryCache = registry;
        adminAccountsCache = normalizeAdminAccounts(registry.accounts);
        adminAuditCache = Array.isArray(registry.audit_log) ? registry.audit_log.slice(0, AUDIT_LOG_LIMIT) : [];
        renderAdminAccounts();
        renderAdminAuditLog();
        updateAdminSummary();
        showAdminUnlocked();
    } catch (error) {
        if (showError) alert(error.message || 'Admin refresh failed');
        else throw error;
    }
}

function updateAdminSummary() {
    const onlineCount = adminAccountsCache.filter(a => a.is_online).length;
    const adminCount = adminAccountsCache.filter(a => a.role === 'owner' || a.role === 'admin').length;
    const blockedCount = adminAccountsCache.filter(a => a.role === 'blocked').length;
    const sessionCount = adminAccountsCache.reduce((sum,a) => sum + Number(a.active_session_count || 0), 0);
    if (getEl('adminTotalAccounts')) getEl('adminTotalAccounts').textContent = adminAccountsCache.length;
    if (getEl('adminOnlineAccounts')) getEl('adminOnlineAccounts').textContent = onlineCount;
    if (getEl('adminAdminAccounts')) getEl('adminAdminAccounts').textContent = adminCount;
    if (getEl('adminBlockedAccounts')) getEl('adminBlockedAccounts').textContent = blockedCount;
    if (getEl('adminActiveSessions')) getEl('adminActiveSessions').textContent = sessionCount;
    if (getEl('adminLastRefresh')) getEl('adminLastRefresh').textContent = `Updated ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
    if (getEl('adminRegistryRevision')) getEl('adminRegistryRevision').textContent = `Revision ${Number(adminRegistryCache?.revision || 0)}`;
}

function switchAdminTab(tab) {
    adminActiveTab = tab === 'audit' ? 'audit' : 'users';
    if (getEl('adminUsersPane')) getEl('adminUsersPane').style.display = adminActiveTab === 'users' ? 'block' : 'none';
    if (getEl('adminAuditPane')) getEl('adminAuditPane').style.display = adminActiveTab === 'audit' ? 'block' : 'none';
    getEl('adminUsersTabBtn')?.classList.toggle('active', adminActiveTab === 'users');
    getEl('adminAuditTabBtn')?.classList.toggle('active', adminActiveTab === 'audit');
}

function renderAdminAccounts() {
    const tbody = getEl('adminUsersTableBody');
    if (!tbody) return;
    const q = (getEl('adminUserSearch')?.value || '').trim().toLowerCase();
    const roleFilter = getEl('adminRoleFilter')?.value || 'all';
    const statusFilter = getEl('adminStatusFilter')?.value || 'all';

    const rows = adminAccountsCache.filter(a => {
        const searchOk = !q || `${a.name || ''} ${a.email || ''}`.toLowerCase().includes(q);
        const roleOk = roleFilter === 'all' || a.role === roleFilter;
        const statusOk = statusFilter === 'all' || (statusFilter === 'online' ? a.is_online : !a.is_online);
        return searchOk && roleOk && statusOk;
    });

    if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="admin-empty-cell">No matching accounts.</td></tr>';
        return;
    }

    tbody.innerHTML = rows.map(a => {
        const avatar = a.picture
            ? `<img class="admin-user-avatar" src="${escapeHTML(a.picture)}" alt="">`
            : `<div class="admin-user-avatar admin-user-avatar-fallback">${escapeHTML((a.name || a.email || '?').charAt(0).toUpperCase())}</div>`;
        const manageable = canManageTargetAccount(a);
        const roleControl = a.role === 'owner'
            ? `<span class="admin-role-pill owner">Owner</span>`
            : manageable
                ? `<select class="admin-role-select" onchange="adminSetRole('${escapeHTML(String(a.user_id || ''))}', this.value)">
                    <option value="user" ${a.role === 'user' ? 'selected' : ''}>User</option>
                    <option value="admin" ${a.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="blocked" ${a.role === 'blocked' ? 'selected' : ''}>Blocked</option>
                   </select>`
                : `<span class="admin-role-pill ${escapeHTML(a.role)}">${escapeHTML(a.role)}</span>`;

        return `<tr>
            <td><div class="admin-user-cell">${avatar}<div><strong>${escapeHTML(a.name || 'Google account')}</strong><span>${escapeHTML(a.email || '—')}</span></div></div></td>
            <td>${roleControl}</td>
            <td><span class="admin-status-pill ${a.is_online ? 'online' : 'offline'}">${a.is_online ? '● Online' : '● Offline'}</span></td>
            <td><strong>${escapeHTML(formatAdminLastSeen(a.last_seen))}</strong><small>${a.last_seen ? escapeHTML(new Date(a.last_seen).toLocaleString()) : '—'}</small></td>
            <td><div class="admin-session-count"><strong>${Number(a.active_session_count || 0)} active</strong><small>${(a.sessions || []).length} saved</small></div></td>
            <td>${Number(a.visit_count || 0)}</td>
            <td><div class="admin-actions-cell">
                <button class="admin-mini-btn" onclick="openAdminUserDetails('${escapeHTML(String(a.user_id || ''))}')">Devices</button>
                ${a.role !== 'owner' && manageable ? `<button class="admin-mini-btn ${a.role === 'blocked' ? '' : 'danger'}" onclick="adminToggleBlock('${escapeHTML(String(a.user_id || ''))}')">${a.role === 'blocked' ? 'Unblock' : 'Block'}</button>` : ''}
            </div></td>
        </tr>`;
    }).join('');
}

function ensureAdminAuditControls() {
    const pane = getEl('adminAuditPane');
    const wrap = getEl('adminAuditList');
    if (!pane || !wrap) return null;

    const toolbar = pane.querySelector('.admin-toolbar-row');
    if (toolbar && !getEl('adminClearAuditBtn')) {
        const clearBtn = document.createElement('button');
        clearBtn.id = 'adminClearAuditBtn';
        clearBtn.type = 'button';
        clearBtn.className = 'btn-real-danger';
        clearBtn.textContent = '🗑 Clear Audit Log';
        clearBtn.onclick = adminClearAuditLog;
        toolbar.appendChild(clearBtn);
    }

    let pager = getEl('adminAuditPagination');
    if (!pager) {
        pager = document.createElement('div');
        pager.id = 'adminAuditPagination';
        pager.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:12px;padding:8px 2px;color:var(--text-sub);font-size:12px;font-weight:700;';
        wrap.insertAdjacentElement('afterend', pager);
    }
    return pager;
}

function renderAdminAuditPagination(totalRows) {
    const pager = ensureAdminAuditControls();
    if (!pager) return;

    const totalPages = Math.max(1, Math.ceil(totalRows / AUDIT_PAGE_SIZE));
    adminAuditPage = Math.min(Math.max(1, adminAuditPage), totalPages);
    const start = totalRows ? ((adminAuditPage - 1) * AUDIT_PAGE_SIZE) + 1 : 0;
    const end = totalRows ? Math.min(adminAuditPage * AUDIT_PAGE_SIZE, totalRows) : 0;

    pager.innerHTML = `
        <span>${start}–${end} of ${totalRows} logs · max ${AUDIT_LOG_LIMIT}</span>
        <div style="display:flex;align-items:center;gap:7px;">
            <button class="btn-secondary admin-mini-btn" type="button" onclick="changeAdminAuditPage(-1)" ${adminAuditPage <= 1 ? 'disabled' : ''}>← Previous</button>
            <span style="min-width:86px;text-align:center;">Page ${adminAuditPage} / ${totalPages}</span>
            <button class="btn-secondary admin-mini-btn" type="button" onclick="changeAdminAuditPage(1)" ${adminAuditPage >= totalPages ? 'disabled' : ''}>Next →</button>
        </div>`;
}

function changeAdminAuditPage(delta) {
    adminAuditPage = Math.max(1, adminAuditPage + Number(delta || 0));
    renderAdminAuditLog();
}

function renderAdminAuditLog() {
    const wrap = getEl('adminAuditList');
    if (!wrap) return;
    ensureAdminAuditControls();

    const q = (getEl('adminAuditSearch')?.value || '').trim().toLowerCase();
    if (q !== adminAuditLastQuery) {
        adminAuditLastQuery = q;
        adminAuditPage = 1;
    }

    const rows = adminAuditCache.filter(e =>
        !q || `${e.action || ''} ${e.actor_email || ''} ${e.actor_name || ''} ${e.target_email || ''} ${e.detail || ''}`.toLowerCase().includes(q)
    );

    const totalPages = Math.max(1, Math.ceil(rows.length / AUDIT_PAGE_SIZE));
    adminAuditPage = Math.min(Math.max(1, adminAuditPage), totalPages);

    if (!rows.length) {
        wrap.innerHTML = '<div class="admin-empty-cell">No matching audit events.</div>';
        renderAdminAuditPagination(0);
        return;
    }

    const start = (adminAuditPage - 1) * AUDIT_PAGE_SIZE;
    const pageRows = rows.slice(start, start + AUDIT_PAGE_SIZE);

    wrap.innerHTML = pageRows.map(e => `
        <div class="admin-audit-item">
            <time>${escapeHTML(e.at ? new Date(e.at).toLocaleString() : '—')}</time>
            <div class="admin-audit-actor"><strong>${escapeHTML(e.actor_name || e.actor_email || 'System')}</strong><small>${escapeHTML(e.actor_email || '—')}</small></div>
            <div class="admin-audit-event"><strong>${escapeHTML(String(e.action || 'event').replaceAll('_',' '))}</strong><span>${escapeHTML(e.detail || (e.target_email ? `Target: ${e.target_email}` : ''))}</span></div>
            <button
                class="admin-mini-btn danger admin-audit-delete-btn"
                type="button"
                title="Delete this audit log"
                aria-label="Delete this audit log"
                onclick="adminDeleteAuditLog('${escapeHTML(String(e.id || ''))}')"
                ${e.id ? '' : 'disabled'}
            >🗑</button>
        </div>
    `).join('');

    renderAdminAuditPagination(rows.length);
}

async function adminDeleteAuditLog(auditId) {
    if (!canCurrentAccountOpenAdmin()) {
        alert('You do not have permission to delete Audit Log entries.');
        return;
    }

    const id = String(auditId || '');
    if (!id) return;

    const target = adminAuditCache.find(entry => String(entry?.id || '') === id);
    if (!target) {
        alert('This audit log no longer exists. Refreshing Audit Log.');
        return refreshAdminAccounts(true);
    }

    const label = String(target.action || 'event').replaceAll('_', ' ');
    const when = target.at ? new Date(target.at).toLocaleString() : 'Unknown time';
    const ok = await customConfirm(
        `Delete this audit log permanently?\n\n${label} · ${when}`,
        '🗑 Delete Audit Log',
        { confirmLabel: 'Delete Log', cancelLabel: 'Cancel', confirmClass: 'btn-real-danger', cancelClass: 'btn-secondary' }
    );
    if (!ok) return;

    try {
        await mutateAccountRegistry(reg => {
            const list = Array.isArray(reg.audit_log) ? reg.audit_log : [];
            const index = list.findIndex(entry => String(entry?.id || '') === id);
            if (index < 0) throw new Error('This audit log no longer exists.');
            list.splice(index, 1);
            reg.audit_log = list.slice(0, AUDIT_LOG_LIMIT);
            // Intentionally do not append another audit event here.
        });

        await refreshAdminAccounts(true);
    } catch (error) {
        console.error('Could not delete Audit Log entry:', error);
        alert(error?.message || 'Could not delete this Audit Log entry.');
    }
}

async function adminClearAuditLog() {
    if (!canCurrentAccountOpenAdmin()) {
        alert('You do not have permission to clear the Audit Log.');
        return;
    }

    const ok = await customConfirm(
        'This will permanently delete the current audit history. One new event will be kept to record who cleared it.',
        '🗑 Clear Audit Log',
        { confirmLabel: 'Clear Audit Log', cancelLabel: 'Cancel', confirmClass: 'btn-real-danger', cancelClass: 'btn-secondary' }
    );
    if (!ok) return;

    try {
        await mutateAccountRegistry(reg => {
            reg.audit_log = [];
            appendAudit(reg, {
                action: 'audit_log_cleared',
                actor: googleAccountProfile,
                detail: 'Previous audit history was cleared from Admin Console.'
            });
        });
        adminAuditPage = 1;
        adminAuditLastQuery = '';
        if (getEl('adminAuditSearch')) getEl('adminAuditSearch').value = '';
        await refreshAdminAccounts(true);
    } catch (error) {
        console.error('Could not clear Audit Log:', error);
        alert(error?.message || 'Could not clear Audit Log.');
    }
}

async function adminSetRole(userId, role) {
    if (!['admin','user','blocked'].includes(role)) return;
    const target = adminAccountsCache.find(a => String(a.user_id) === String(userId));
    if (!canManageTargetAccount(target)) {
        alert('You do not have permission to change this account.');
        return refreshAdminAccounts(false);
    }
    if (currentAccountAccess.role === 'admin' && role === 'admin') {
        alert('Only the Owner can promote another Admin.');
        return refreshAdminAccounts(false);
    }

    try {
        await mutateAccountRegistry(reg => {
            const account = reg.accounts.find(a => String(a.user_id) === String(userId));
            if (!account || account.role === 'owner') throw new Error('Owner role cannot be changed.');
            const oldRole = account.role || 'user';
            account.role = role;

            if (role === 'blocked') {
                const now = new Date().toISOString();
                (account.sessions || []).forEach(session => {
                    session.revoked = true;
                    session.revoked_at = now;
                    session.revoked_by = googleAccountProfile?.email || googleAccountProfile?.name || 'Admin';
                });
            } else if (oldRole === 'blocked') {
                (account.sessions || []).forEach(session => {
                    session.revoked = false;
                    session.revoked_at = null;
                    session.revoked_by = '';
                });
            }

            appendAudit(reg, { action:'role_changed', target:account, detail:`${oldRole} → ${role}` });
        });
        await refreshAdminAccounts(false);
    } catch (error) {
        alert(error.message || 'Could not update role.');
        await refreshAdminAccounts(false);
    }
}

async function adminToggleBlock(userId) {
    const target = adminAccountsCache.find(a => String(a.user_id) === String(userId));
    if (!canManageTargetAccount(target)) return;
    await adminSetRole(userId, target.role === 'blocked' ? 'user' : 'blocked');
}

function openAdminUserDetails(userId) {
    const a = adminAccountsCache.find(x => String(x.user_id) === String(userId));
    if (!a) return;
    if (getEl('adminUserDetailTitle')) getEl('adminUserDetailTitle').textContent = `👤 ${a.name || a.email || 'User'}`;
    if (getEl('adminUserDetailSubtitle')) getEl('adminUserDetailSubtitle').textContent = `${a.email || '—'} · ${String(a.role || 'user').toUpperCase()}`;

    const avatar = a.picture
        ? `<img src="${escapeHTML(a.picture)}" alt="">`
        : `<div class="admin-detail-avatar">${escapeHTML((a.name || a.email || '?').charAt(0).toUpperCase())}</div>`;
    const sessions = (a.sessions || []).sort((x,y) => new Date(y.last_seen || 0) - new Date(x.last_seen || 0));
    const canManage = canManageTargetAccount(a);

    getEl('adminUserDetailContent').innerHTML = `
        <div class="admin-detail-profile">${avatar}<div>
            <strong>${escapeHTML(a.name || 'Google account')}</strong>
            <span>${escapeHTML(a.email || '—')}</span>
            <small>First seen: ${escapeHTML(a.first_seen ? new Date(a.first_seen).toLocaleString() : '—')} · Visits: ${Number(a.visit_count || 0)}</small>
        </div></div>
        <h4 class="admin-detail-section-title">Sessions / devices</h4>
        <div class="admin-session-list">
            ${sessions.length ? sessions.map(s => `
                <div class="admin-session-card ${s.revoked ? 'revoked' : ''}">
                    <div class="admin-session-meta">
                        <strong>${escapeHTML(s.device || 'Device')} · ${escapeHTML(s.browser || 'Browser')} ${s.is_online ? '●' : ''}</strong>
                        <span>${escapeHTML(formatAdminLastSeen(s.last_seen))} · ${escapeHTML(s.last_page || '')}</span>
                        <small title="${escapeHTML(s.user_agent || '')}">${escapeHTML(s.session_id || '')}${s.revoked ? ' · REVOKED' : ''}</small>
                    </div>
                    ${canManage && !s.revoked ? `<button class="admin-mini-btn danger" onclick="adminRevokeSession('${escapeHTML(String(a.user_id || ''))}','${escapeHTML(String(s.session_id || ''))}')">Revoke</button>` : ''}
                </div>
            `).join('') : '<div class="admin-empty-cell">No saved sessions.</div>'}
        </div>`;
    openModal('adminUserDetailModal');
}

async function adminRevokeSession(userId, sessionId) {
    const target = adminAccountsCache.find(a => String(a.user_id) === String(userId));
    if (!canManageTargetAccount(target)) return;
    try {
        await mutateAccountRegistry(reg => {
            const account = reg.accounts.find(a => String(a.user_id) === String(userId));
            const session = (account?.sessions || []).find(s => s.session_id === sessionId);
            if (!session) throw new Error('Session not found.');
            session.revoked = true;
            session.revoked_at = new Date().toISOString();
            session.revoked_by = googleAccountProfile?.email || '';
            appendAudit(reg, { action:'session_revoked', target:account, detail:`${session.device || 'Device'} · ${session.browser || 'Browser'}` });
        });
        await refreshAdminAccounts(false);
        openAdminUserDetails(userId);
    } catch (error) {
        alert(error.message || 'Could not revoke session.');
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') trackCurrentWebAccount(false);
});

function isGoogleConnected() {
    return !!(gapiInited && gisInited && gapi.client.getToken()?.access_token);
}

function getAccountInitial(profile = googleAccountProfile) {
    const source = (profile?.name || profile?.email || '?').trim();
    return source ? source.charAt(0).toUpperCase() : '?';
}

function updateGoogleAccountUI() {
    const connected = isGoogleConnected();
    const profile = googleAccountProfile;

    const toolbarBtn = getEl('btn-login-google');
    if (toolbarBtn) {
        toolbarBtn.innerHTML = connected
            ? `👤 ${escapeHTML(profile?.name || profile?.email || 'Google connected')}`
            : '👤 Account';
        toolbarBtn.setAttribute('data-tooltip', connected
            ? `Using ${profile?.email || 'Google account'}`
            : 'Manage account');
    }

    const sidebarBtn = getEl('sidebarAccountBtn');
    if (sidebarBtn) {
        sidebarBtn.title = connected && profile?.email ? `Account: ${profile.email}` : 'Account';
    }

    const displayName = getEl('accountDisplayName');
    const email = getEl('accountEmail');
    const connectionText = getEl('accountConnectionText');
    const driveStatus = getEl('accountDriveStatus');
    const avatar = getEl('accountAvatar');
    const fallback = getEl('accountAvatarFallback');
    const dot = getEl('accountOnlineDot');
    const connectBtn = getEl('accountConnectBtn');
    const switchBtn = getEl('accountSwitchBtn');
    const logoutBtn = getEl('accountLogoutBtn');
    const adminBtn = getEl('accountAdminBtn');

    if (displayName && !displayName.classList.contains('account-name-editing-v2')) {
        displayName.textContent = connected ? (profile?.name || 'Google account') : 'Not connected';
    }
    if (email) email.textContent = connected ? (profile?.email || 'Profile information is loading…') : 'Connect Google to identify the account being used.';
    if (connectionText) {
        connectionText.textContent = connected ? '● Connected' : '● Offline';
        connectionText.classList.toggle('connected', connected);
    }
    if (driveStatus) driveStatus.textContent = connected ? 'Connected' : 'Not connected';
    if (dot) dot.classList.toggle('offline', !connected);

    if (avatar && fallback) {
        if (connected && profile?.picture) {
            avatar.src = profile.picture;
            avatar.style.display = 'block';
            fallback.style.display = 'none';
        } else {
            avatar.removeAttribute('src');
            avatar.style.display = 'none';
            fallback.style.display = 'grid';
            fallback.textContent = connected ? getAccountInitial(profile) : '👤';
        }
    }

    if (connectBtn) connectBtn.style.display = connected ? 'none' : 'inline-flex';
    if (switchBtn) switchBtn.style.display = connected ? 'inline-flex' : 'none';
    if (logoutBtn) logoutBtn.style.display = connected ? 'inline-flex' : 'none';
    if (adminBtn) adminBtn.style.display = connected && canCurrentAccountOpenAdmin() ? 'inline-flex' : 'none';

    const syncBtn = getEl('btn-sync-google');
    if (syncBtn) syncBtn.style.display = connected ? 'inline-flex' : 'none';
}

async function fetchGoogleAccountProfile() {
    const accessToken = gapi.client.getToken()?.access_token;
    if (!accessToken) {
        googleAccountProfile = null;
        currentAccountAccess = { checked:false, role:'user', blocked:false, sessionRevoked:false };
        localStorage.removeItem(GOOGLE_ACCOUNT_PROFILE_KEY);
        updateGoogleAccountUI();
        updateGooglePermissionGate();
        return null;
    }

    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers:{ Authorization:`Bearer ${accessToken}` }
        });
        if (!response.ok) throw new Error(`Google profile request failed: ${response.status}`);

        const data = await response.json();
        googleAccountProfile = {
            id:data.id || '',
            name:data.name || '',
            email:data.email || '',
            picture:data.picture || ''
        };
        localStorage.setItem(GOOGLE_ACCOUNT_PROFILE_KEY, JSON.stringify(googleAccountProfile));
        updateGoogleAccountUI();
        updateGooglePermissionGate();

        await evaluateCurrentAccountAccess({ createIfMissing:true, recordVisit:!hasTrackedCurrentSession });

        if (!currentAccountAccess.blocked && !currentAccountAccess.sessionRevoked) startAccountHeartbeat();
        else stopAccountHeartbeat();

        updateGoogleAccountUI();
        updateGooglePermissionGate();
        return googleAccountProfile;
    } catch (error) {
        console.warn('Could not load/verify Google profile:', error);
        currentAccountAccess = { checked:false, role:'user', blocked:false, sessionRevoked:false };
        updateGoogleAccountUI();
        updateGooglePermissionGate();
        setGooglePermissionGateMessage(error.message || 'Could not verify Google account access.', 'error');
        return googleAccountProfile;
    }
}

function openAccountPanel() {
    updateGoogleAccountUI();
    openModal('accountModal');
    if (isGoogleConnected()) fetchGoogleAccountProfile();
}

function checkAuthStates() {
    if (gapiInited && gisInited && !gapi.client.getToken()) {
        const t = localStorage.getItem('google_oauth_token');
        if (t) {
            try { gapi.client.setToken(JSON.parse(t)); }
            catch (e) { localStorage.removeItem('google_oauth_token'); }
        }
    }

    updateGoogleAccountUI();
    updateGooglePermissionGate();

    if (isGoogleConnected() && hasRequiredGoogleScopes()) fetchGoogleAccountProfile();
}

function handleAuthClick(forceAccountChooser = false, forceConsent = false) {
    if (!gapiInited || !gisInited || !tokenClient) {
        alert('Google APIs are still loading. Please try again in a moment.');
        updateGooglePermissionGate();
        return;
    }

    tokenClient.callback = async (resp) => {
        if (resp.error) {
            console.warn('Google sign-in error:', resp);
            setGooglePermissionGateMessage('Google sign-in was not completed. Please try again.', 'error');
            updateGooglePermissionGate();
            return;
        }

        const token = gapi.client.getToken();
        if (!token || !hasRequiredGoogleScopes()) {
            rejectPartialGooglePermissionGrant();
            return;
        }

        localStorage.setItem('google_oauth_token', JSON.stringify(token));
        currentAccountAccess = { checked:false, role:'user', blocked:false, sessionRevoked:false };
        updateGooglePermissionGate();

        await fetchGoogleAccountProfile();

        if (!currentAccountAccess.blocked && !currentAccountAccess.sessionRevoked) {
            try { await fetchFileFromGoogleDrive(); }
            catch (error) { console.warn('Initial Google Drive sync failed:', error); }
        }
    };

    tokenClient.requestAccessToken({
        prompt: forceConsent ? 'consent' : ''
    });
}

function disconnectGoogleAccount({ revoke = true } = {}) {
    const accessToken = gapi.client.getToken()?.access_token;

    const finish = () => {
        if (gapiInited) gapi.client.setToken(null);
        localStorage.removeItem('google_oauth_token');
        localStorage.removeItem(GOOGLE_ACCOUNT_PROFILE_KEY);
        googleAccountProfile = null;
        googleFileId = null;
        stopAccountHeartbeat();
        hasTrackedCurrentSession = false;
        currentAccountAccess = { checked:false, role:'user', blocked:false, sessionRevoked:false };
        adminCurrentUserRole = null;
        registryOwnerInfo = null;
        updateGoogleAccountUI();
        updateGooglePermissionGate();
    };

    if (revoke && accessToken && window.google?.accounts?.oauth2?.revoke) {
        google.accounts.oauth2.revoke(accessToken, finish);
    } else {
        finish();
    }
}

function switchGoogleAccount() {
    const accessToken = gapi.client.getToken()?.access_token;

    const reconnect = () => {
        if (gapiInited) gapi.client.setToken(null);
        localStorage.removeItem('google_oauth_token');
        localStorage.removeItem(GOOGLE_ACCOUNT_PROFILE_KEY);
        googleAccountProfile = null;
        googleFileId = null;
        stopAccountHeartbeat();
        hasTrackedCurrentSession = false;
        currentAccountAccess = { checked:false, role:'user', blocked:false, sessionRevoked:false };
        adminCurrentUserRole = null;
        registryOwnerInfo = null;
        updateGoogleAccountUI();
        updateGooglePermissionGate();
        handleAuthClick(true, true);
    };

    if (accessToken && window.google?.accounts?.oauth2?.revoke) {
        google.accounts.oauth2.revoke(accessToken, reconnect);
    } else {
        reconnect();
    }
}

async function fetchFileFromGoogleDrive() {
    try {
        const response = await gapi.client.drive.files.list({ q: "name = 'workspace_data.json'", spaces: 'appDataFolder', fields: 'files(id, name)' });
        const files = response.result.files;
        if (files?.length > 0) {
            googleFileId = files[0].id;
            const cloudData = (await gapi.client.drive.files.get({ fileId: googleFileId, alt: 'media' })).result;
            if (cloudData && Array.isArray(cloudData)) {
                if (await customConfirm(
                    "Cloud data is newer than the data on this device. Choose which version you want to keep.",
                    "⚠️ DATA CONFLICT",
                    { confirmLabel: 'Use cloud data', cancelLabel: 'Keep local data', confirmClass: 'btn-primary', cancelClass: 'btn-secondary' }
                )) {
                    state.dashboardData = cloudData;
                    state.dashboardData.forEach(g => { if (g.pinKey) g.isLocked = true; });
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
                    renderDashboard(); updateScheduleUI(); alert("📥 Data loaded successfully!");
                } else { syncToGoogleDrive(false); }
            }
        } else { syncToGoogleDrive(true); }
    } catch (err) { console.error(err); }
}

async function syncToGoogleDrive(isSilent = false) {
    if (!gapi.client.getToken()) return isSilent ? null : alert("Google is not connected!");
    const syncBtn = getEl('btn-sync-google');
    if (!isSilent && syncBtn) syncBtn.innerHTML = "⏳ Syncing...";
    const localData = localStorage.getItem(STORAGE_KEY) || JSON.stringify(state.dashboardData);

    try {
        if (!googleFileId) {
            const res = await gapi.client.drive.files.list({ q: "name = 'workspace_data.json'", spaces: 'appDataFolder' });
            if (res.result.files?.length > 0) googleFileId = res.result.files[0].id;
        }
        if (googleFileId) {
            await gapi.client.request({ path: `/upload/drive/v3/files/${googleFileId}`, method: 'PATCH', params: { uploadType: 'media' }, body: localData });
        } else {
            const metadata = { name: 'workspace_data.json', parents: ['appDataFolder'] };
            const boundary = '314159265358979323846';
            const body = `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${localData}\r\n--${boundary}--`;
            googleFileId = (await gapi.client.request({ path: '/upload/drive/v3/files', method: 'POST', params: { uploadType: 'multipart' }, headers: { 'Content-Type': `multipart/related; boundary="${boundary}"` }, body })).result.id;
        }
        if (!isSilent) alert("📤 Drive sync completed!");
    } catch (e) { if (!isSilent) alert("Sync error: " + e.message); }
    finally { if (syncBtn) syncBtn.innerHTML = "🔄 Sync Drive"; }
}

// ==========================================

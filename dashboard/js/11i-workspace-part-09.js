// ==========================================================================
// AUTO DRIVE SAVE V1
// Drive là nguồn dữ liệu chính sau khi đăng nhập.
// - Không hỏi Keep / Download khi đăng nhập.
// - Có file trên Drive: luôn tải file Drive xuống trước.
// - Chưa có file trên Drive: tạo file từ dữ liệu local hiện tại.
// - Mọi saveData()/Trash/Backup/Past milestone sẽ tự lưu Drive theo debounce.
// - Có hydration gate để local không ghi đè Drive trước khi tải cloud xong.
// ==========================================================================
let __driveAutoSaveTimer = null;
let __driveWriteInFlight = false;
let __driveWritePending = false;
let __driveAutoSyncReady = false;
let __driveHydrationPromise = null;
let __driveHydratedToken = '';
let __driveLastSavedSnapshot = '';

function __getDriveAccessToken() {
    return gapiInited ? (gapi.client.getToken()?.access_token || '') : '';
}

function __buildDriveComparableSnapshot() {
    const payload = buildDrivePayload();
    // updatedAt thay đổi ở mỗi lần build nên bỏ field này khi so sánh.
    const comparable = { ...payload };
    delete comparable.updatedAt;
    return JSON.stringify(comparable);
}

async function __performGoogleDriveWrite({ force = false } = {}) {
    if (!gapiInited || !gisInited || !gapi.client.getToken() || !__driveAutoSyncReady) return null;

    const snapshot = __buildDriveComparableSnapshot();
    if (!force && snapshot === __driveLastSavedSnapshot) return true;

    if (__driveWriteInFlight) {
        __driveWritePending = true;
        return true;
    }

    __driveWriteInFlight = true;
    try {
        if (!googleFileId) {
            const res = await gapi.client.drive.files.list({
                q: "name = 'workspace_data.json'",
                spaces: 'appDataFolder',
                fields: 'files(id, name)'
            });
            if (res.result.files?.length > 0) googleFileId = res.result.files[0].id;
        }

        const localData = JSON.stringify(buildDrivePayload());

        if (googleFileId) {
            await gapi.client.request({
                path: `/upload/drive/v3/files/${googleFileId}`,
                method: 'PATCH',
                params: { uploadType: 'media' },
                body: localData
            });
        } else {
            const metadata = { name: 'workspace_data.json', parents: ['appDataFolder'] };
            const boundary = '314159265358979323846';
            const body =
                `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}` +
                `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${localData}` +
                `\r\n--${boundary}--`;

            googleFileId = (await gapi.client.request({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: { uploadType: 'multipart' },
                headers: { 'Content-Type': `multipart/related; boundary="${boundary}"` },
                body
            })).result.id;
        }

        __driveLastSavedSnapshot = snapshot;
        return true;
    } catch (error) {
        console.error('Automatic Google Drive save failed:', error);
        return false;
    } finally {
        __driveWriteInFlight = false;
        if (__driveWritePending) {
            __driveWritePending = false;
            clearTimeout(__driveAutoSaveTimer);
            __driveAutoSaveTimer = setTimeout(() => __performGoogleDriveWrite(), 350);
        }
    }
}

function queueGoogleDriveAutoSave(delay = 850) {
    if (!__driveAutoSyncReady || !gapiInited || !gisInited || !gapi.client.getToken()) return;
    clearTimeout(__driveAutoSaveTimer);
    __driveAutoSaveTimer = setTimeout(() => __performGoogleDriveWrite(), delay);
}

// Giữ tên hàm cũ để các đoạn code hiện tại vẫn hoạt động,
// nhưng silent sync giờ được debounce thay vì PATCH Drive ngay lập tức.
syncToGoogleDrive = async function(isSilent = false) {
    if (!gapiInited || !gapi.client.getToken()) {
        if (!isSilent) alert('Google is not connected!');
        return null;
    }

    if (isSilent) {
        queueGoogleDriveAutoSave();
        return true;
    }

    // Không còn nút Sync trong UI, nhưng giữ manual API tương thích nếu code khác gọi tới.
    return __performGoogleDriveWrite({ force: true });
};

// Sau đăng nhập: Drive thắng local. Không còn hộp thoại "Keep / Download".
fetchFileFromGoogleDrive = async function() {
    const token = __getDriveAccessToken();
    if (!token) return null;

    // Nếu cùng token đang hydrate thì dùng chung promise, tránh gọi Drive trùng.
    if (__driveHydrationPromise && __driveHydratedToken === token) {
        return __driveHydrationPromise;
    }

    __driveHydratedToken = token;
    __driveAutoSyncReady = false;

    __driveHydrationPromise = (async () => {
        try {
            const response = await gapi.client.drive.files.list({
                q: "name = 'workspace_data.json'",
                spaces: 'appDataFolder',
                fields: 'files(id, name, modifiedTime)'
            });

            const files = response.result.files || [];

            if (files.length > 0) {
                googleFileId = files[0].id;
                const cloudData = (
                    await gapi.client.drive.files.get({
                        fileId: googleFileId,
                        alt: 'media'
                    })
                ).result;

                const isValid =
                    Array.isArray(cloudData) ||
                    (cloudData && typeof cloudData === 'object' && Array.isArray(cloudData.dashboardData));

                if (!isValid) {
                    console.error('workspace_data.json has an unsupported format. Auto-save remains disabled to protect cloud data.');
                    return false;
                }

                // Giữ trạng thái Collapse/Expand hiện tại trước khi Drive ghi dữ liệu xuống
                const collapsedState = new Map(
                    state.dashboardData.map(group => [
                        String(group.id),
                        Boolean(group.collapsed)
                    ])
                );

                applyDrivePayload(cloudData);

                // Khôi phục lại trạng thái Collapse/Expand vừa thao tác
                state.dashboardData.forEach(group => {
                    const id = String(group.id);

                    if (collapsedState.has(id)) {
                        group.collapsed = collapsedState.get(id);
                    }

                    if (group.pinKey) group.isLocked = true;
                });

                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));

                renderDashboard();
                updateScheduleUI();
                renderBackupModal?.();
                renderTrashModal?.();

                __driveLastSavedSnapshot = __buildDriveComparableSnapshot();
                __driveAutoSyncReady = true;

                console.info('Google Drive data loaded. Automatic saving is active.');
                return true;
            }

            // Tài khoản chưa có dữ liệu Drive: local hiện tại trở thành dữ liệu khởi tạo.
            googleFileId = null;
            __driveAutoSyncReady = true;
            __driveLastSavedSnapshot = '';
            await __performGoogleDriveWrite({ force: true });

            console.info('Created workspace_data.json on Google Drive. Automatic saving is active.');
            return true;
        } catch (error) {
            __driveAutoSyncReady = false;
            console.error('Initial Google Drive load failed. Auto-save is paused to avoid overwriting cloud data:', error);
            return false;
        } finally {
            __driveHydrationPromise = null;
        }
    })();

    return __driveHydrationPromise;
};

// Khi token cũ được khôi phục sau F5, tự hydrate Drive.
// Code gốc chỉ restore token + profile, chưa tải workspace_data.json.
const __autoDriveOriginalCheckAuthStates = checkAuthStates;
checkAuthStates = function() {
    const result = __autoDriveOriginalCheckAuthStates.apply(this, arguments);

    if (gapiInited && gisInited && gapi.client.getToken() && hasRequiredGoogleScopes()) {
        const token = __getDriveAccessToken();

        if (token && (__driveHydratedToken !== token || !__driveAutoSyncReady)) {
            Promise.resolve(fetchGoogleAccountProfile())
                .then(() => {
                    if (!currentAccountAccess.blocked && !currentAccountAccess.sessionRevoked) {
                        return fetchFileFromGoogleDrive();
                    }
                })
                .catch(error => console.warn('Automatic Drive initialization failed:', error));
        }
    }

    return result;
};

// Reset gate khi logout / đổi tài khoản.
const __autoDriveOriginalDisconnect = disconnectGoogleAccount;
disconnectGoogleAccount = function(options) {
    __driveAutoSyncReady = false;
    __driveHydrationPromise = null;
    __driveHydratedToken = '';
    __driveLastSavedSnapshot = '';
    clearTimeout(__driveAutoSaveTimer);
    return __autoDriveOriginalDisconnect.call(this, options);
};

const __autoDriveOriginalSwitch = switchGoogleAccount;
switchGoogleAccount = function() {
    __driveAutoSyncReady = false;
    __driveHydrationPromise = null;
    __driveHydratedToken = '';
    __driveLastSavedSnapshot = '';
    clearTimeout(__driveAutoSaveTimer);
    return __autoDriveOriginalSwitch.apply(this, arguments);
};

// Nút Sync đã bị xóa khỏi HTML. Nếu HTML cũ còn cache thì luôn ẩn nó.
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-sync-google')?.remove();
});
// ============================================================================
// AUTO DRIVE SAVE V2
// Stable cloud workspace layer:
// - Drive is the source of truth after sign-in
// - Visible save status
// - Debounced/dirty auto-save
// - Offline queue + reconnect sync
// - Best-effort flush on tab hide/page close
// - Multi-tab/device conflict detection + safe group-level merge
// - Daily snapshots + conflict rescue backups
// - Lightweight cloud polling while the page is visible
// - Compact account toolbar + richer account sync information

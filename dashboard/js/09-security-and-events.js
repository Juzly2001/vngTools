// 12. LISTENERS & LOGIC BẢO MẬT KHÓA CHUYÊN SÂU
// ==========================================
let keyModalContext = { action: 'unlock', targetGroupId: null };

function toggleKeyVisibility() {
    const input = getEl('groupKeyInput'); const btn = getEl('toggleKeyVisibility');
    if (!input || !btn) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password'; btn.textContent = isPass ? '🙈' : '👁️';
}

function handleLockMenuAction(groupId) {
    getEl('customContextMenu').style.display = 'none';
    const group = getGroup(groupId); if (!group) return;

    const input = getEl('groupKeyInput'); if (!input) return;
    input.value = ""; clearKeyError();
    input.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); submitKeyForm(); } };
    input.type = 'password'; getEl('toggleKeyVisibility').textContent = '👁️';
    
    keyModalContext.targetGroupId = groupId;
    const hasPin = group.pinKey && group.pinKey !== "";
    keyModalContext.action = hasPin ? 'remove_lock' : 'setup_lock';
    
    getEl('keyModalTitle').textContent = hasPin ? '🔓 Remove group lock' : '🔒 Set New PIN';
    getEl('keyModalDesc').textContent = hasPin ? 'Enter the current PIN to remove protection.' : 'Create a PIN for this group. Settings will sync automatically.';
    const submitBtn = getEl('submitKeyBtn');
    if (submitBtn) submitBtn.textContent = hasPin ? 'Remove lock' : 'Set PIN';
    openModal('keyModal');
}

function triggerUnlockGroup(groupId) {
    keyModalContext.targetGroupId = groupId; keyModalContext.action = 'unlock';
    const input = getEl('groupKeyInput'); if (!input) return;
    input.value = ""; clearKeyError();
    input.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); submitKeyForm(); } };
    input.type = 'password'; getEl('toggleKeyVisibility').textContent = '👁️';
    
    getEl('keyModalTitle').textContent = '🔒 Enter PIN';
    getEl('keyModalDesc').textContent = 'This group is locked. Please verify the PIN to access it.';
    const submitBtn = getEl('submitKeyBtn');
    if (submitBtn) submitBtn.textContent = 'Unlock';
    openModal('keyModal');
}

async function submitKeyForm() {
    clearKeyError();
    const keyInput = getEl('groupKeyInput')?.value.trim();
    if (!keyInput) return showKeyError("Please enter the PIN.");
    
    const hashedKey = btoa(unescape(encodeURIComponent(keyInput)));
    const group = getGroup(keyModalContext.targetGroupId);
    
    if (!group) {
        showKeyError("Group data not found.");
        return;
    }

    // Xử lý logic nghiệp vụ khóa/mở
    if (keyModalContext.action === 'setup_lock') {
        group.pinKey = hashedKey; 
        group.isLocked = true; 
        alert("PIN set successfully!");
    } else if (keyModalContext.action === 'remove_lock') {
        if (group.pinKey === hashedKey) { 
            group.pinKey = ""; 
            group.isLocked = false; 
            alert("PIN removed!"); 
        } else {
            return showKeyError("Incorrect PIN.");
        }
    } else if (keyModalContext.action === 'unlock') {
        if (group.pinKey === hashedKey) {
            group.isLocked = false;
        } else {
            return showKeyError("Wrong PIN. Please try again.");
        }
    }

    // 1. Đóng modal trước để giải phóng giao diện
    closeModal('keyModal');
    
    // 2. Lưu dữ liệu vào LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    
    // 3. Render lại Dashboard (Cập nhật DOM)
    renderDashboard();
    
    // 4. SỬA LỖI MOBILE: Đợi trình duyệt vẽ xong DOM (50ms - 100ms)
    // Sau đó mới kích hoạt tính toán lại bộ đếm thời gian
    setTimeout(() => {
        updateScheduleUI();
        
        // 5. Đồng bộ sau cùng để không gây lag giao diện
        syncToGoogleDrive(true);
    }, 100);
}
function quickLockGroup(groupId) {
    const group = getGroup(groupId);
    if (group?.pinKey) {
        group.isLocked = true; saveData();
        getEl('customContextMenu').style.display = 'none';
    }
}

const showKeyError = msg => { const err = getEl("keyErrorMessage"); if(err) { err.textContent = msg; err.style.display = "block"; } };
const clearKeyError = () => { const err = getEl("keyErrorMessage"); if(err) { err.textContent = ""; err.style.display = "none"; } };

window.addEventListener('scroll', () => {
    const btn = getEl("backToTop"); if (btn) btn.style.display = (document.documentElement.scrollTop > 300 || document.body.scrollTop > 300) ? "block" : "none";
});
window.addEventListener('click', () => { const m = getEl('customContextMenu'); if (m) m.style.display = 'none'; });
window.addEventListener('resize', resizeCanvas);

document.addEventListener('touchstart', e => {
    const target = e.target.closest('.link-button, .note-button, .schedule-button, .schedule-row, .group-card');
    if (!target) return;

    // Snapshot the touch point immediately. Keeping the original TouchEvent around for
    // 500ms is unreliable on mobile browsers and pageX/pageY alone do not work with
    // the fixed-position mobile context menu.
    const touch = e.touches?.[0] || e.changedTouches?.[0];
    if (!touch) return;
    const pressPoint = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        pageX: touch.pageX,
        pageY: touch.pageY
    };

    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => {
        let groupId = null, index = null, targetType = null;
        const card = target.closest('.group-card'); if (!card) return;
        groupId = card.dataset.id;

        if (target.classList.contains('link-button') || target.classList.contains('note-button') || target.classList.contains('schedule-button')) {
            index = parseInt(target.parentElement.dataset.index);
            targetType = target.classList.contains('link-button') ? 'link' : (target.classList.contains('note-button') ? 'note' : 'schedule');
        } else if (target.classList.contains('schedule-row')) {
            index = Array.from(target.parentElement.children).indexOf(target); targetType = 'schedule';
        } else {
            targetType = `group-${getGroup(groupId)?.type}`;
        }

        openContextMenu({
            preventDefault(){},
            stopPropagation(){},
            ...pressPoint
        }, targetType, groupId, index);
    }, 500);
}, { passive: true });

document.addEventListener('touchend', () => clearTimeout(pressTimer));
document.addEventListener('touchmove', () => clearTimeout(pressTimer));

window.addEventListener('load', () => {
    state?.dashboardData?.forEach(g => { if (g.pinKey) g.isLocked = true; });
    if (localStorage.getItem(THEME_KEY) === 'light') document.body.classList.add('light-mode');
    
    applyCanvasState();
    renderDashboard();
    updateScheduleUI();
    
    if (Notification.permission !== "granted" && Notification.permission !== "denied") Notification.requestPermission();
    setInterval(updateScheduleUI, 30000);
    updateGooglePermissionGate();
    setTimeout(() => { checkAuthStates(); enforceGooglePermissions(); }, 500);
    setTimeout(showTodayImportantTasks, 300);
});

// ========================================================================== 

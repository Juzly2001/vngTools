// 3. ĐIỀU KHIỂN GIAO DIỆN (THEME & CONTROL SWITCHES)
// ==========================================================================
function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    const btn = getEl('themeBtn');
    if (btn) btn.innerHTML = `<span class="sidebar-menu-icon" aria-hidden="true">${isLight ? '🌙' : '💡'}</span><span>Light/Dark</span>`;
    if (isCanvasEnabled) initBackgroundObjects();
}

function toggleThemeCanvas() {
    isCanvasEnabled = !isCanvasEnabled;
    localStorage.setItem('canvas-enabled', isCanvasEnabled);
    applyCanvasState();
}

function applyCanvasState() {
    const btn = getEl('themeBtnCanvas');
    if (!canvas) return;
    
    if (isCanvasEnabled) {
        canvas.style.display = 'block';
        resizeCanvas();
        if (!animationFrameId) animationFrameId = requestAnimationFrame(drawBackground);
        if (btn) btn.innerHTML = '<span class="sidebar-menu-icon" aria-hidden="true">⭐</span><span>Visuals</span>';
    } else {
        canvas.style.display = 'none';
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        if (btn) btn.innerHTML = '<span class="sidebar-menu-icon" aria-hidden="true">🌟</span><span>Visuals</span>';
    }
}

// ==========================================================================
// 4. HỆ THỐNG DIALOGS & POPUPS (MODALS & CUSTOM ALERTS)
// ==========================================================================
window.alert.__native__ = window.alert;

window.alert = function(message, title = "⚠️ Notice") {
    const alertModal = getEl('alertModal');
    const alertTitle = getEl('alertModalTitle');
    const alertMsg = getEl('alertMessage');
    
    if (alertModal && alertMsg) {
        if (alertTitle) {
            alertTitle.innerText = title;
            alertTitle.style.color = "var(--danger-color)";
        }
        alertMsg.innerHTML = message.replace(/\n/g, '<br>');
        const gocBtn = alertModal.querySelector('.btn-primary');
        if (gocBtn) gocBtn.style.display = 'block';
        openModal('alertModal');
    } else {
        window.alert.__native__(message);
    }
};

function getConfirmActionConfig(message = '', title = '', options = {}) {
    const text = `${title} ${message}`.toLowerCase();
    let confirmLabel = 'Continue';
    let cancelLabel = 'Cancel';
    let confirmClass = 'btn-primary';
    let cancelClass = 'btn-secondary';

    if (/clear.*trash|trash.*clear/.test(text)) {
        confirmLabel = 'Clear Trash';
        confirmClass = 'btn-real-danger';
    } else if (/delete|deletion/.test(text)) {
        confirmLabel = 'Delete';
        confirmClass = 'btn-real-danger';
    } else if (/restore/.test(text)) {
        confirmLabel = 'Restore backup';
    } else if (/reset/.test(text)) {
        confirmLabel = 'Reset';
        confirmClass = 'btn-real-danger';
    } else if (/sign out|log out|logout/.test(text)) {
        confirmLabel = 'Sign out';
        confirmClass = 'btn-real-danger';
    } else if (/remove/.test(text)) {
        confirmLabel = 'Remove';
        confirmClass = 'btn-real-danger';
    }

    return {
        confirmLabel: options.confirmLabel || confirmLabel,
        cancelLabel: options.cancelLabel || cancelLabel,
        confirmClass: options.confirmClass || confirmClass,
        cancelClass: options.cancelClass || cancelClass
    };
}

function applyConfirmActionConfig(confirmBtn, cancelBtn, message, title, options = {}) {
    const config = getConfirmActionConfig(message, title, options);
    confirmBtn.textContent = config.confirmLabel;
    cancelBtn.textContent = config.cancelLabel;
    confirmBtn.className = config.confirmClass;
    cancelBtn.className = config.cancelClass;
}

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
        openModal('confirmModal');

        confirmBtn.onclick = function() {
            closeModal('confirmModal');
            resolve(true);
        };

        cancelBtn.onclick = function() {
            closeModal('confirmModal');
            resolve(false);
        };
    });
}

let openModal = id => getEl(id)?.classList.add('active');
function closeModal(id) { 
    const modal = getEl(id);
    if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('modal-on-top');
        if (id === 'alertModal') {
            document.querySelector('.modal-footer-excel')?.remove();
        }
    }
}

// ==========================================================================

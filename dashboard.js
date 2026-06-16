// ==========================================================================
// 1. CẤU HÌNH & KHỞI TẠO BIẾN TOÀN CỤC (CONFIG & STATE)
// ==========================================================================
const CLIENT_ID = '109577502358-ifqvdpaumccs5sv6vtr5rphfnq815up0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAc5DuR0oxr7yEdTQnvIIS-PRKGtIfWrro';
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

const EMOJI_LIST = ["NONE", "📅", "⏰", "⏳", "🚀", "🤖", "🔥", "✨", "🌟", "💻", "💼", "📚", "🛠️", "💬", "📌", "✅", "⚠️"];
const STORAGE_KEY = 'myDashboardDataButtonsEdition';
const THEME_KEY = 'dashboardTheme';

let state = {
    selectedEmoji: "",
    isEditMode: false,
    currentGroupType: "link",
    activeGroupId: null,
    activeIndex: null,
    dashboardData: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
        {
            id: "g1", title: "Hệ Thống GHTK", emoji: "🚀", type: "link",
            links: [{ name: "Titan Admin", url: "https://titan-admin.ghtk.vn", emoji: "⚙️" }]
        },
        {
            id: "g2", title: "Lịch Trình Core", emoji: "📅", type: "schedule",
            schedules: [
                { title: "Họp Giao Ban", date: "2026-06-08", time: "08:30", content: "Báo cáo tiến độ hoàn thiện tool phân loại địa chỉ cấp 4 và địa chỉ đặc biệt.", important: true, emoji: "⏰" },
                { title: "Fix bug API", date: "2026-06-08", time: "14:00", content: "Xử lý payload lỗi token hệ thống titan-admin.", important: false, emoji: "💻" }
            ]
        }
    ]
};

let gapiInited = false;
let gisInited = false;
let tokenClient;
let googleFileId = null;
let pressTimer;

// Utilities tối ưu tốc độ truy vấn DOM
const getEl = id => document.getElementById(id);
const getGroup = id => state.dashboardData.find(g => g.id === id);

// ==========================================================================
// 2. BACKGROUND CANVAS ENGINE (HIỆU ỨNG VŨ TRỤ / MÂY BAY THỜI GIAN THỰC)
// ==========================================================================
const canvas = getEl('bgCanvas');
const ctx = canvas?.getContext('2d');
let animationFrameId = null;
let stars = [];        
let backgroundStars = []; 
let clouds = [];
let isCanvasEnabled = localStorage.getItem('canvas-enabled') === 'the-first-time' ? false : (localStorage.getItem('canvas-enabled') !== 'false');

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (isCanvasEnabled) initBackgroundObjects();
}

function initBackgroundObjects() {
    if (!canvas) return;
    const isLightMode = document.body.classList.contains('light-mode');
    stars = [];
    backgroundStars = [];
    clouds = [];

    if (!isLightMode) {
        // Khởi tạo hệ thống sao đêm cho Dark Mode
        for (let i = 0; i < 100; i++) {
            backgroundStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.2 + 0.3,
                opacity: Math.random() * 0.7 + 0.2,
                factor: Math.random() > 0.5 ? 1 : -1,
                speed: Math.random() * 0.02 + 0.005
            });
        }
        for (let i = 0; i < 15; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 30 + 15,
                speed: Math.random() * 1.5 + 1.0,
                opacity: Math.random() * 0.5 + 0.2,
                width: Math.random() * 1 + 0.5
            });
        }
    } else {
        // Khởi tạo hệ thống mây trôi cho Light Mode
        for (let i = 0; i < 8; i++) {
            const baseRadius = Math.random() * 25 + 20; 
            clouds.push({
                x: Math.random() * (canvas.width + 200) - 100,
                y: Math.random() * (canvas.height * 0.45) + 30, 
                radius: baseRadius,
                speed: Math.random() * 0.2 + 0.05, 
                opacity: Math.random() * 0.4 + 0.5, 
                offsets: [
                    { rx: -baseRadius * 0.5, ry: baseRadius * 0.1, r: baseRadius * 0.7 },
                    { rx: baseRadius * 0.5, ry: -baseRadius * 0.2, r: baseRadius * 0.85 },
                    { rx: baseRadius * 1.1, ry: baseRadius * 0.1, r: baseRadius * 0.6 },
                    { rx: baseRadius * -1.0, ry: baseRadius * 0.2, r: baseRadius * 0.5 }
                ]
            });
        }
    }
}

function drawRealisticCloud(cloud) {
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
    cloud.offsets.forEach(offset => {
        ctx.arc(cloud.x + offset.rx, cloud.y + offset.ry, offset.r, 0, Math.PI * 2);
    });
    ctx.fill();
}

function drawBackground() {
    if (!canvas || !ctx || !isCanvasEnabled) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLightMode = document.body.classList.contains('light-mode');

    if (!isLightMode) {
        // Render Sao lấp lánh
        backgroundStars.forEach(bStar => {
            bStar.opacity += bStar.speed * bStar.factor;
            if (bStar.opacity > 0.9 || bStar.opacity < 0.1) bStar.factor *= -1;
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${bStar.opacity})`;
            ctx.arc(bStar.x, bStar.y, bStar.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Render Sao băng rơi mượt mà
        stars.forEach(star => {
            let grad = ctx.createLinearGradient(star.x, star.y, star.x + star.length * 0.6, star.y - star.length * 0.8);
            grad.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = star.width;
            ctx.lineCap = 'round';
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x - star.length * 0.6, star.y + star.length * 0.8);
            ctx.stroke();

            star.y += star.speed * 0.8;
            star.x -= star.speed * 0.6;

            if (star.y > canvas.height || star.x < -star.length) {
                if (Math.random() > 0.5) {
                    star.y = -40;
                    star.x = Math.random() * canvas.width;
                } else {
                    star.x = canvas.width + 40;
                    star.y = Math.random() * (canvas.height * 0.6);
                }
                star.speed = Math.random() * 1.5 + 1.0;
                star.length = Math.random() * 30 + 15;
                star.opacity = Math.random() * 0.5 + 0.2;
            }
        });
    } else {
        // Render Bầu trời & Mây trôi
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGradient.addColorStop(0, '#b3e1ff'); 
        skyGradient.addColorStop(0.6, '#e6f4ff'); 
        skyGradient.addColorStop(1, '#ffffff'); 
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        clouds.forEach(cloud => {
            ctx.globalAlpha = cloud.opacity;
            ctx.shadowColor = "rgba(100, 149, 237, 0.12)";
            ctx.shadowBlur = 12;
            ctx.shadowOffsetY = 6;
            ctx.fillStyle = "rgba(255, 255, 255, 0.95)"; 
            
            drawRealisticCloud(cloud);
            cloud.x += cloud.speed;

            if (cloud.x - cloud.radius * 3 > canvas.width) {
                cloud.x = -cloud.radius * 3;
                cloud.y = Math.random() * (canvas.height * 0.45) + 30;
            }
        });
        ctx.restore();
    }
    ctx.globalAlpha = 1.0; 
    animationFrameId = requestAnimationFrame(drawBackground);
}

// ==========================================================================
// 3. ĐIỀU KHIỂN GIAO DIỆN (THEME & CONTROL SWITCHES)
// ==========================================================================
function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    const btn = getEl('themeBtn');
    if (btn) btn.innerHTML = isLight ? '🌙' : '💡';
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
        if (btn) btn.innerHTML = '⭐';
    } else {
        canvas.style.display = 'none';
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        if (btn) btn.innerHTML = '🌟';
    }
}

// ==========================================================================
// 4. HỆ THỐNG DIALOGS & POPUPS (MODALS & CUSTOM ALERTS)
// ==========================================================================
window.alert.__native__ = window.alert;

window.alert = function(message, title = "⚠️ Thông báo") {
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
        alertModal.classList.add('active');
    } else {
        window.alert.__native__(message);
    }
};

function customConfirm(message, title = "❓ Xác nhận thao tác") {
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
        confirmMsg.innerHTML = message.replace(/\n/g, '<br>');
        confirmModal.classList.add('active');
        
        confirmBtn.onclick = function() {
            confirmModal.classList.remove('active');
            resolve(true);
        };
        
        cancelBtn.onclick = function() {
            confirmModal.classList.remove('active');
            resolve(false);
        };
    });
}

const openModal = id => getEl(id)?.classList.add('active');
function closeModal(id) { 
    const modal = getEl(id);
    if (modal) {
        modal.classList.remove('active');
        if (id === 'alertModal') {
            document.querySelector('.modal-footer-excel')?.remove();
        }
    }
}

// ==========================================================================
// 5. QUẢN LÝ DỮ LIỆU & CORE DASHBOARD RENDERING SYSTEM
// ==========================================================================
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    renderDashboard();
    updateScheduleUI();
    if (gapiInited && gisInited && gapi.client.getToken()) {
        syncToGoogleDrive(true); 
    }
}

const linkify = text => text ? text.replace(/(https?:\/\/[^\s]+)/g, url => `<a href="${url}" target="_blank">${url}</a>`) : "";

function buildEmojiPicker(gridId, preSelectedEmoji = "NONE") {
    const grid = getEl(gridId); 
    if (!grid) return;
    grid.innerHTML = ""; 
    state.selectedEmoji = preSelectedEmoji;

    EMOJI_LIST.forEach(emoji => {
        const item = document.createElement('div');
        item.className = `emoji-item ${emoji === preSelectedEmoji ? 'selected' : ''}`;
        item.innerHTML = emoji === "NONE" ? `<span style="font-size:11px;color:var(--text-sub);font-weight:bold;">🚫 Không</span>` : emoji;
        item.onclick = () => {
            grid.querySelectorAll('.emoji-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected'); 
            state.selectedEmoji = emoji;
        };
        grid.appendChild(item);
    });
}

function renderDashboard() {
    const container = getEl('groupsContainer'); 
    if (!container) return;
    container.innerHTML = '';
    
    if (state.dashboardData.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-sub)">Chưa có nhóm nào cả.</p>`; 
        return;
    }
    
    state.dashboardData.forEach(group => {
        if (group.type === 'schedule' && group.schedules) {
            sortSchedulesSmart(group.schedules);
        }
        if (!group.type) group.type = group.notes ? 'note' : (group.schedules ? 'schedule' : 'link');
        
        const groupCard = document.createElement('div');
        let cardClassName = `group-card type-${group.type}`;
        let lockOverlayHTML = '';
        const isLockedCheck = group.pinKey && group.pinKey !== "" && group.isLocked;
        
        if (isLockedCheck) {
            cardClassName += ' is-locked-status';
            lockOverlayHTML = `<button class="lock-overlay-btn" onclick="triggerUnlockGroup('${group.id}')">🔒 Nhấn để mở khóa</button>`;
        }
        
        groupCard.className = cardClassName;
        groupCard.setAttribute('data-id', group.id);
        groupCard.oncontextmenu = (e) => openContextMenu(e, `group-${group.type}`, group.id);

        const gEmoji = (group.emoji && group.emoji !== "NONE") ? `<span>${group.emoji}</span> ` : '';
        const tags = { link: 'Links', note: 'Notes', schedule: 'Schedule' };
        const isCollapsed = group.collapsed || false;

        groupCard.innerHTML = `
            <div class="group-header" onclick="toggleCollapseGroup('${group.id}')" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                <span class="group-title">${gEmoji}${group.title}</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="group-tag tag-${group.type}">${tags[group.type]}</span>
                    <span class="arrow-${group.id}" style="font-size: 10px; transition: transform 0.2s; display: inline-block; transform: ${isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'}; color: var(--text-sub);">▼</span>
                </div>
            </div>
            ${lockOverlayHTML}
            <div class="group-content-wrapper">
                <div class="${group.type}s-area" data-group-id="${group.id}" style="${isCollapsed ? 'display: none;' : ''}"></div>
            </div>
        `;

        const contentArea = groupCard.querySelector(`.${group.type}s-area`);
        if (isLockedCheck) {
            contentArea.innerHTML = `<span class="no-data-text" style="display:flex; justify-content:center; align-items:center; gap:5px;">🔒 Nội dung đã ẩn</span>`;
            container.appendChild(groupCard);
            return; 
        }

        if (group.type === 'link') {
            if (!group.links?.length) contentArea.innerHTML = `<span class="no-data-text">Chuột phải để thêm liên kết...</span>`;
            else {
                group.links.forEach((link, idx) => {
                    const lEmoji = (link.emoji && link.emoji !== "NONE") ? `<span>${link.emoji}</span> ` : '';
                    contentArea.innerHTML += `
                        <div class="item-wrapper" data-index="${idx}">
                            <a href="${link.url}" target="_blank" class="link-button" oncontextmenu="openContextMenu(event, 'link', '${group.id}', ${idx})">
                                ${lEmoji}${link.name}
                            </a>
                        </div>`;
                });
            }
        } 
        else if (group.type === 'note') {
            if (!group.notes?.length) contentArea.innerHTML = `<span class="no-data-text">Chuột phải để thêm ghi chú...</span>`;
            else {
                group.notes.forEach((note, idx) => {
                    const nEmoji = (note.emoji && note.emoji !== "NONE") ? `<span>${note.emoji}</span> ` : '';
                    const item = document.createElement('div');
                    item.className = 'item-wrapper';
                    item.setAttribute('data-index', idx);
                    item.innerHTML = `<div class="note-button" oncontextmenu="openContextMenu(event, 'note', '${group.id}', ${idx})">${nEmoji}${note.title || "Ghi chú"}</div>`;
                    item.querySelector('.note-button').onclick = () => showContentDetail(group.id, idx, 'note');
                    contentArea.appendChild(item);
                });
            }
        } 
        else if (group.type === 'schedule') {
            if (!group.schedules?.length) contentArea.innerHTML = `<span class="no-data-text">Chuột phải để thêm lịch trình...</span>`;
            else {
                const wrapper = document.createElement('div');
                wrapper.className = 'schedule-table-wrapper';
                const table = document.createElement('table');
                table.className = 'schedule-table';
                table.innerHTML = `<thead><tr><th style="width:20%">Ngày</th><th style="width:20%">Thứ</th><th style="width:30%;text-align:center">Thời hạn</th><th style="width:30%">Công việc</th></tr></thead><tbody></tbody>`;
                
                const tbody = table.querySelector('tbody');
                const dayLabels = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

                group.schedules.forEach((sch, idx) => {
                    const row = document.createElement('tr');
                    const now = new Date();
                    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                    const todayTime = new Date(todayStr + ' 00:00:00');
                    
                    const startDateObj = new Date(sch.date + ' 00:00:00');
                    const endDateObj = new Date((sch.endDate || sch.date) + ' 00:00:00');
                    
                    let activeDateStr = sch.date;
                    if (todayTime > startDateObj && todayTime <= endDateObj) activeDateStr = todayStr;
                    else if (todayTime > endDateObj) activeDateStr = sch.endDate || sch.date;

                    const finalScheduleTime = new Date(`${sch.endDate || sch.date} ${sch.endTime || sch.time || "00:00"}`);
                    row.className = `schedule-row ${sch.important ? 'important' : ''} ${finalScheduleTime < now ? 'past' : ''}`;
                    row.onclick = () => showContentDetail(group.id, idx, 'schedule');
                    row.oncontextmenu = (e) => openContextMenu(e, 'schedule', group.id, idx);
                    
                    let displayDate = activeDateStr.split('-').reverse().slice(0,2).join('/');
                    let dayOfWeek = "---";
                    const parsedActiveDate = new Date(activeDateStr.replace(/-/g, '/'));
                    if (!isNaN(parsedActiveDate.getTime())) dayOfWeek = dayLabels[parsedActiveDate.getDay()];

                    row.setAttribute('data-start', `${sch.date}T${sch.time || '00:00'}`);
                    row.setAttribute('data-end', `${sch.endDate || sch.date}T${sch.endTime || sch.time || '00:00'}`);

                    row.innerHTML = `
                        <td class="schedule-date">${displayDate}</td>
                        <td class="schedule-date schedule-time" style="color:#38bdf8;font-weight:600">${dayOfWeek}</td>
                        <td class="schedule-countdown-cell" style="text-align:center;font-size:11px;font-weight:bold;font-family:monospace">⏳ Tính...</td>
                        <td class="schedule-name">${sch.important ? '⚠️ ' : ''}${sch.title || ""}</td>
                    `;
                    tbody.appendChild(row);
                });
                wrapper.appendChild(table);
                contentArea.appendChild(wrapper);
            }
        }
        container.appendChild(groupCard);
    });
    if (typeof initDragAndDrop === 'function') initDragAndDrop();
}

function toggleCollapseGroup(groupId) {
    const group = getGroup(groupId);
    if (!group) return;

    group.collapsed = !group.collapsed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    
    const card = document.querySelector(`.group-card[data-id="${groupId}"]`);
    if (card) {
        const contentArea = card.querySelector(`.${group.type}s-area`);
        const arrow = card.querySelector(`.arrow-${groupId}`);
        if (contentArea) contentArea.style.display = group.collapsed ? 'none' : '';
        if (arrow) arrow.style.transform = group.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
    }
}

// ==========================================================================
// 6. THAO TÁC FORM NGHIỆP VỤ (THÊM / SỬA / XÓA PHẦN TỬ)
// ==========================================================================
function openGroupModal(editGroupId = false, defaultType = 'link') {
    state.currentGroupType = defaultType;
    state.isEditMode = !!editGroupId;
    state.activeGroupId = editGroupId;

    const titleEl = getEl('groupModalTitle');
    const nameInput = getEl('groupNameInput');

    if (state.isEditMode) {
        const group = getGroup(editGroupId);
        if (titleEl) titleEl.innerText = "📝 Sửa Tên/Icon Nhóm";
        if (nameInput) nameInput.value = group ? group.title : '';
        buildEmojiPicker('groupEmojiGrid', group ? (group.emoji || "NONE") : "NONE");
    } else {
        const typeTexts = { link: "Nhóm Link", note: "Nhóm Ghi Chú", schedule: "Nhóm Lịch Trình" };
        if (titleEl) titleEl.innerText = `📌 Tạo ${typeTexts[defaultType] || 'Nhóm'} Mới`;
        if (nameInput) nameInput.value = '';
        buildEmojiPicker('groupEmojiGrid', "NONE");
    }
    openModal('groupModal');
}

function submitGroupForm() {
    const name = getEl('groupNameInput')?.value.trim();
    if (!name) return;

    if (state.isEditMode) {
        const group = getGroup(state.activeGroupId);
        if (group) { group.title = name; group.emoji = state.selectedEmoji; }
    } else {
        state.dashboardData.push({ 
            id: 'g_' + Date.now(), title: name, emoji: state.selectedEmoji, type: state.currentGroupType,
            [`${state.currentGroupType}s`]: []
        });
    }
    saveData(); 
    closeModal('groupModal');
}

function openItemModal(type, groupId, index = false) {
    state.activeGroupId = groupId;
    state.activeIndex = index;
    state.isEditMode = index !== false;

    const group = getGroup(groupId);
    const item = state.isEditMode ? group[`${type}s`][index] : null;

    if (type === 'link') {
        getEl('linkModalTitle').innerText = state.isEditMode ? "📝 Sửa Nút Bấm" : "➕ Thêm Liên Kết Mới";
        getEl('linkNameInput').value = item ? item.name : '';
        getEl('linkUrlInput').value = item ? item.url : '';
        buildEmojiPicker('linkEmojiGrid', item ? item.emoji : "NONE");
        openModal('linkModal');
    } else if (type === 'note') {
        getEl('noteModalTitle').innerText = state.isEditMode ? "📝 Sửa Nút Ghi Chú" : "➕ Thêm Nút Ghi Chú Mới";
        getEl('noteTitleInput').value = item ? item.title : '';
        getEl('noteContentInput').value = item ? item.content : '';
        buildEmojiPicker('noteEmojiGrid', item ? item.emoji : "NONE");
        openModal('noteModal');
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
    } else if (type === 'note') {
        const title = getEl('noteTitleInput').value.trim();
        const content = getEl('noteContentInput').value;
        if (!title) return;
        targetData = { title, content, emoji: state.selectedEmoji };
    }

    if (state.isEditMode) group[`${type}s`][state.activeIndex] = targetData;
    else group[`${type}s`].push(targetData);
    
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
    
    if (type === 'Group') msg = `Bạn có chắc chắn muốn xóa nhóm "${group.title}" cùng toàn bộ dữ liệu bên trong?`;
    else if (type === 'Link') msg = `Bạn có chắc chắn muốn xóa nút bấm "${group.links?.[state.activeIndex]?.name}"?`;
    else if (type === 'Note') msg = `Bạn có chắc chắn muốn xóa nút ghi chú "${group.notes?.[state.activeIndex]?.title}"?`;
    else if (type === 'Schedule') msg = `Bạn có chắc chắn muốn xóa mốc lịch trình "${group.schedules?.[state.activeIndex]?.title}"?`;

    customConfirm(msg, "⚠️ Xác nhận xóa dữ liệu").then((confirmed) => {
        if (confirmed) {
            if (type === 'Group') state.dashboardData = state.dashboardData.filter(g => g.id !== state.activeGroupId);
            else group[`${type.toLowerCase()}s`].splice(state.activeIndex, 1);
            saveData(); 
        }
    });
}

function showContentDetail(groupId, index, type) {
    const group = getGroup(groupId);
    if (!group) return;

    const titleEl = getEl('readModalTitle');
    const bodyEl = getEl('readModalBody');
    const closeBtn = getEl('readModalCloseBtn');
    if (!titleEl || !bodyEl) return;

    if (type === 'note') {
        titleEl.style.color = "var(--note-accent)"; 
        if (closeBtn) closeBtn.className = "btn-warning";
        const noteObj = group.notes[index];
        const titleText = (noteObj.emoji && noteObj.emoji !== "NONE") ? `${noteObj.emoji} ${noteObj.title}` : `📝 ${noteObj.title}`;
        
        Object.assign(titleEl.style, { display: "flex", justifyContent: "space-between", alignItems: "center" });
        titleEl.innerHTML = `<span>${titleText}</span><button class="btn-secondary" style="font-size:10px;padding:4px 8px" onclick="copyNoteContent(this)">📋 Copy</button>`;
        bodyEl.innerHTML = `<div class="view-note-content" id="contentToCopy">${linkify(noteObj.content)}</div>`;
    } 
    else if (type === 'schedule') {
        titleEl.style.color = "var(--schedule-accent)"; 
        if (closeBtn) closeBtn.className = "btn-success";
        const schObj = group.schedules[index];
        
        const displayStartDate = schObj.date.split('-').reverse().join('/');
        const displayEndDate = (schObj.endDate || schObj.date).split('-').reverse().join('/');

        titleEl.innerHTML = schObj.important ? `⚠️ ${schObj.title}` : `📅 Lịch Trình: ${schObj.title}`;
        bodyEl.innerHTML = `
            <div class="single-schedule-detail">
                <h4>${schObj.title}</h4>
                <div class="schedule-info-line" style="margin-bottom:5px">🟢 Bắt đầu: <b>${displayStartDate} lúc ${schObj.time || '00:00'}</b></div>
                <div class="schedule-info-line" style="margin-bottom:12px">🏁 Kết thúc: <b>${displayEndDate} lúc ${schObj.endTime || schObj.time || '00:00'}</b></div>
                <label style="display:block;margin-bottom:6px;color:var(--text-sub);font-size:12px">📋 Nội dung đầu việc:</label>
                <div class="schedule-tasks-list">${linkify(schObj.content)}</div>
            </div>`;
    }
    openModal('readModal');
}

function copyNoteContent(btnElement) {
    const content = getEl('contentToCopy')?.innerText || "";
    navigator.clipboard.writeText(content).then(() => {
        const originalText = btnElement.innerText;
        btnElement.innerText = "✅ Đã copy!";
        Object.assign(btnElement.style, { borderColor: "var(--schedule-accent)", color: "var(--schedule-accent)" });
        setTimeout(() => {
            btnElement.innerText = originalText;
            Object.assign(btnElement.style, { borderColor: "var(--border-color)", color: "var(--text-main)" });
        }, 2000);
    }).catch(err => console.error('Lỗi sao chép: ', err));
}

// ==========================================
// 7. QUẢN LÝ LỊCH TRÌNH SYSTEM (SCHEDULE & ALERTS ENGINE)
// ==========================================
function addScheduleBlock(data = null) {
    const wrapper = getEl('scheduleBlocksWrapper');
    if (!wrapper) return;

    const blockId = 'sch_block_' + Date.now() + Math.floor(Math.random() * 1000);
    const block = document.createElement('div');
    block.className = 'schedule-block-item';
    block.id = blockId;

    const now = new Date();
    const defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const title = data ? data.title : '';
    const date = data ? data.date : defaultDate;
    const time = data ? data.time : defaultTime;
    const endDate = data ? (data.endDate || data.date) : defaultDate;
    const endTime = data ? (data.endTime || data.time) : defaultTime;
    const content = data ? data.content : '';
    const important = data ? data.important : false;
    const emoji = data ? data.emoji : '📅';

    block.innerHTML = `
        <div class="schedule-block-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <label class="important-checkbox-label" style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;font-weight:600">
                <input type="checkbox" class="sch-important-cb" ${important ? 'checked' : ''}> ⚠️ Mốc lịch này Quan Trọng
            </label>
            ${!state.isEditMode ? `<button type="button" style="color:var(--danger-color);background:none;border:1px solid rgba(239,68,68,0.3);padding:4px 8px;font-size:11px;border-radius:4px;cursor:pointer" onclick="removeScheduleBlock('${blockId}')">Xóa mốc này</button>` : ''}
        </div>
        <div class="form-group" style="margin-bottom:12px">
            <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Tên nút mốc thời gian:</label>
            <input type="text" class="form-input sch-title-input" placeholder="Ví dụ: Họp phòng ban..." value="${title}" required style="width:100%">
        </div>
        <div class="datetime-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Chọn Ngày Bắt Đầu:</label>
                <input type="date" class="form-input sch-date-input" value="${date}" required style="width:100%">
            </div>
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Chọn Giờ Bắt Đầu:</label>
                <input type="time" class="form-input sch-time-input" value="${time}" required style="width:100%">
            </div>
        </div>
        <div class="datetime-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Chọn Ngày Kết Thúc:</label>
                <input type="date" class="form-input sch-end-date-input" value="${endDate}" required style="width:100%">
            </div>
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Chọn Giờ Kết Thúc:</label>
                <input type="time" class="form-input sch-end-time-input" value="${endTime}" required style="width:100%">
            </div>
        </div>
        <div class="form-group" style="margin-bottom:8px">
            <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">📋 Danh sách các đầu việc cần làm:</label>
            <textarea class="form-input sch-content-input" placeholder="Nhập các chi tiết đầu việc tại đây..." rows="3" style="width:100%;resize:vertical">${content}</textarea>
        </div>
        <input type="hidden" class="sch-emoji-hidden" value="${emoji}">
    `;

    const dateInp = block.querySelector('.sch-date-input');
    const endDateInp = block.querySelector('.sch-end-date-input');
    dateInp?.addEventListener('change', () => {
        if (!endDateInp.value || new Date(endDateInp.value) < new Date(dateInp.value)) {
            endDateInp.value = dateInp.value;
        }
    });

    wrapper.appendChild(block);
}

function removeScheduleBlock(id) {
    const wrapper = getEl('scheduleBlocksWrapper');
    if (wrapper && wrapper.children.length <= 1 && !state.isEditMode) {
        alert("Phải giữ lại ít nhất 1 mốc lịch để nhập dữ liệu!");
        return;
    }
    getEl(id)?.remove();
}

function openScheduleModal(groupId, scheduleIndex = false) {
    state.activeGroupId = groupId;
    state.activeIndex = scheduleIndex;
    state.isEditMode = scheduleIndex !== false;
    
    const wrapper = getEl('scheduleBlocksWrapper');
    if (wrapper) wrapper.innerHTML = '';

    if (state.isEditMode) {
        getEl('scheduleModalTitle').innerText = "📝 Chỉnh Sửa Mốc Lịch";
        getEl('addScheduleBlockBtn').style.display = 'none';
        const schObj = getGroup(groupId).schedules[scheduleIndex];
        addScheduleBlock(schObj);
    } else {
        getEl('scheduleModalTitle').innerText = "📅 Thêm Mốc Lịch Trình";
        getEl('addScheduleBlockBtn').style.display = 'inline-flex';
        addScheduleBlock();
    }
    openModal('scheduleModal');
}

function submitScheduleForm() {
    const group = getGroup(state.activeGroupId);
    if (!group) return;

    const blockElements = document.querySelectorAll('#scheduleBlocksWrapper .schedule-block-item');
    let hasError = false;
    let hasTimeError = false;

    const blocksData = Array.from(blockElements).map(block => {
        const title = block.querySelector('.sch-title-input').value.trim();
        const date = block.querySelector('.sch-date-input').value;
        const time = block.querySelector('.sch-time-input').value;
        const endDate = block.querySelector('.sch-end-date-input').value;
        const endTime = block.querySelector('.sch-end-time-input').value;
        const content = block.querySelector('.sch-content-input').value;
        const important = block.querySelector('.sch-important-cb').checked;
        const hiddenEmoji = block.querySelector('.sch-emoji-hidden').value;

        if (!title || !date || !time || !endDate || !endTime) hasError = true;

        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        if (endDateTime < startDateTime) hasTimeError = true;

        return { 
            title, date, time, endDate, endTime, content, important, 
            emoji: state.isEditMode ? hiddenEmoji : (important ? "⚠️" : "📅") 
        };
    });

    if (hasError) {
        alert("Vui lòng điền đầy đủ thông tin thời gian bắt đầu và kết thúc!");
        return;
    }
    if (hasTimeError) {
        alert("❌ Lỗi: Thời gian KẾT THÚC không được nhỏ hơn thời gian BẮT ĐẦU!");
        return;
    }

    if (state.isEditMode) group.schedules[state.activeIndex] = blocksData[0];
    else group.schedules.push(...blocksData);

    sortSchedulesSmart(group.schedules);
    saveData();
    closeModal('scheduleModal');
}

function updateScheduleUI() {
    const now = new Date();
    const rows = document.querySelectorAll('.schedule-table tbody tr');

    rows.forEach(row => {
        let startStr = row.getAttribute('data-start');
        let endStr = row.getAttribute('data-end');
        const countdownCell = row.querySelector('.schedule-countdown-cell');
        const jobCell = row.querySelector('.schedule-name')?.innerText.trim();

        if (!startStr || !endStr || !countdownCell) return;

        startStr = startStr.replace('T', ' ').replace(/-/g, '/');
        endStr = endStr.replace('T', ' ').replace(/-/g, '/');

        const startTime = new Date(startStr);
        const endTime = new Date(endStr);
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) return;

        const diffToStartMs = startTime - now;
        const diffToEndMs = endTime - now;
        
        let countdownText = "";
        let badgeColor = "";

        row.style.display = ""; 
        row.style.textDecoration = "none";
        row.classList.remove('highlight-warning', 'blink-effect');
        row.removeAttribute('data-pulse');
        
        const cells = Array.from(row.cells);

        if (diffToEndMs < 0) {
            countdownText = "Hết hạn";
            badgeColor = "#ef4444";
            row.style.textDecoration = "line-through";
            row.style.borderLeft = ""; 
            cells.forEach(cell => {
                cell.style.opacity = "0.45"; 
                cell.style.color = "var(--text-sub)";
                cell.style.backgroundColor = "transparent";
            });
        } 
        else if (diffToStartMs <= 0 && diffToEndMs >= 0) {
            countdownText = "Đang chạy";
            badgeColor = "#a855f7"; 
            row.style.borderLeft = "4px solid #a855f7";
            cells.forEach(cell => { cell.style.opacity = "1"; cell.style.color = ""; });

            if (Math.floor(diffToEndMs / 60000) <= 30) row.setAttribute('data-pulse', 'true');
        } 
        else {
            row.style.borderLeft = ""; 
            cells.forEach(cell => { cell.style.opacity = "1"; cell.style.color = ""; cell.style.backgroundColor = "transparent"; });

            const diffMin = Math.floor(diffToStartMs / 60000);
            const diffHour = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHour / 24);

            if (diffDay > 0) {
                countdownText = `Còn ${diffDay} ngày`;
                badgeColor = "#10b981"; 
            } else if (diffHour > 0) {
                countdownText = `${diffHour}g : ${diffMin % 60}ph`;
                badgeColor = "#f59e0b"; 
            } else {
                countdownText = `🚨 Còn ${diffMin} phút`;
                badgeColor = "#ef4444"; 
                if (diffMin <= 30) {
                    row.setAttribute('data-pulse', 'true');
                    if (Notification.permission === "granted" && !row.dataset.notified) {
                        new Notification("🚨 SẮP ĐẾN MỐC HẸN!", { body: `Sắp tới giờ: ${jobCell} (còn ${diffMin} phút).` });
                        row.dataset.notified = "true";
                    }
                }
            }
        }
        countdownCell.innerHTML = `<span style="color:${badgeColor}">${countdownText}</span>`;
    });
    initGlobalPulseSystem();
}

function sortSchedulesSmart(schedules) {
    const now = new Date();
    return schedules.sort((a, b) => {
        const finalTimeA = new Date(`${a.endDate || a.date}T${a.endTime || a.time || "00:00"}`);
        const finalTimeB = new Date(`${b.endDate || b.date}T${b.endTime || b.time || "00:00"}`);
        const isPastA = finalTimeA < now;
        const isPastB = finalTimeB < now;

        if (isPastA && !isPastB) return -1;
        if (!isPastA && isPastB) return 1;

        const startA = new Date(`${a.date}T${a.time || "00:00"}`);
        const startB = new Date(`${b.date}T${b.time || "00:00"}`);
        return ((now >= startA && now <= finalTimeA) ? now : startA) - ((now >= startB && now <= finalTimeB) ? now : startB);
    });
}

function showTodayImportantTasks() {
    const localNow = new Date();
    const todayTime = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate()).getTime();

    let processedGroups = [];     

    state.dashboardData.forEach(group => {
        if (group.type !== 'schedule' || !group.schedules) return;
        
        // Lọc ra các lịch trình diễn ra trong ngày hôm nay của nhóm này
        const todaySchedules = group.schedules
            .map((item, originalIndex) => ({ ...item, originalIndex })) 
            .filter(item => {
                const [sY, sM, sD] = item.date.split('-').map(Number);
                const [eY, eM, eD] = (item.endDate || item.date).split('-').map(Number);
                return todayTime >= new Date(sY, sM - 1, sD).getTime() && todayTime <= new Date(eY, eM - 1, eD).getTime();
            })
            .sort((a, b) => a.time.localeCompare(b.time));
        
        if (todaySchedules.length > 0) {
            // Khởi tạo các cờ đánh dấu trạng thái của Nhóm
            let hasUpcomingClose = false; // Sắp diễn ra (trong vòng 30 phút)
            let hasImportant = false;      // Có lịch quan trọng
            let hasRunning = false;        // Có lịch đang chạy

            todaySchedules.forEach(item => {
                const exactStartDT = new Date(`${item.date}T${item.time}:00`);
                const exactEndDT = new Date(`${item.endDate || item.date}T${item.endTime || item.time}:00`);
                
                const diffToStartMs = exactStartDT - localNow;

                // 1. Kiểm tra nếu lịch SẮP DIỄN RA (Chưa bắt đầu & còn dưới hoặc bằng 30 phút)
                if (diffToStartMs > 0 && diffToStartMs <= 30 * 60 * 1000) {
                    hasUpcomingClose = true;
                }
                
                // 2. Kiểm tra lịch QUAN TRỌNG
                if (item.important) {
                    hasImportant = true;
                }

                // 3. Kiểm tra lịch ĐANG DIỄN RA
                if (localNow >= exactStartDT && localNow <= exactEndDT) {
                    hasRunning = true;
                }
            });

            // Thiết lập thứ tự ưu tiên cho cả Nhóm (Số càng nhỏ càng xếp lên đầu bảng)
            // Mức 1: Nhóm có lịch SẮP DIỄN RA (dưới 30p) -> Ưu tiên cao nhất
            // Mức 2: Nhóm có lịch QUAN TRỌNG
            // Mức 3: Nhóm có lịch ĐANG DIỄN RA
            // Mức 4: Nhóm chỉ có lịch bình thường khác
            let groupWeight = 4;
            if (hasUpcomingClose) groupWeight = 1;
            else if (hasImportant) groupWeight = 2;
            else if (hasRunning) groupWeight = 3;

            processedGroups.push({
                groupObj: group,
                schedules: todaySchedules,
                weight: groupWeight
            });
        }
    });

    if (processedGroups.length === 0) return;

    // Sắp xếp các cụm nhóm theo trọng số weight vừa tính
    processedGroups.sort((a, b) => a.weight - b.weight);

    let html = '';
    const dayLabels = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

    // Dựng giao diện HTML theo thứ tự nhóm đã sort
    processedGroups.forEach(groupData => {
        const group = groupData.groupObj;
        html += `<h3 style="color:var(--accent-color);margin-top:15px;border-bottom:1px solid var(--border-color);padding-bottom:5px">${group.emoji && group.emoji !== "NONE" ? group.emoji : '📅'} ${group.title}</h3>`;
        
        groupData.schedules.forEach(item => {
            const exactStartDT = new Date(`${item.date}T${item.time}:00`);
            const exactEndDT = new Date(`${item.endDate || item.date}T${item.endTime || item.time}:00`);
            const isPassed = localNow > exactEndDT; 
            const isRunning = localNow >= exactStartDT && localNow <= exactEndDT;
            
            const diffToStartMs = exactStartDT - localNow;
            const diffMin = Math.floor(diffToStartMs / 60000);

            // Giữ nguyên logic nhấp nháy đỏ khi sắp đến mốc hẹn hoặc kết thúc trong vòng 30 phút
            const shouldPulse = (diffToStartMs > 0 && diffToStartMs <= 1800000) || ((exactEndDT - localNow) > 0 && (exactEndDT - localNow) <= 1800000);
            let currentType = isRunning ? 'running' : (item.important ? 'important' : 'normal');

            let borderCol = isRunning ? '#a855f7' : (item.important ? '#ef4444' : 'var(--schedule-accent, #10b981)');
            let bgCol = isRunning ? 'rgba(168,85,247,0.08)' : (item.important ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.05)');
            
            // Nếu là lịch sắp chạy trong 30p, đổi style nổi bật hơn
            if (diffToStartMs > 0 && diffMin <= 30) {
               // borderCol = '#ef4444'; // Đỏ cảnh báo khẩn cấp
                bgCol = 'rgba(239,68,68,0.12)';
            }

            let itemStyle = `border-left:4px solid ${borderCol};background:${bgCol};transition:all .2s ease;`;

            html += `
            <div class="today-important-item" ${shouldPulse && !isPassed ? 'data-pulse="true"' : ''} data-type="${currentType}" style="${itemStyle}${isPassed ? 'opacity:0.5;' : ''}margin-bottom:10px;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding:10px;border-radius:6px">
                <div style="flex:1">
                    <h4 class="pulse-title" style="${isPassed ? 'text-decoration:line-through;' : ''}margin:0 0 6px 0;color:${isRunning ? '#c084fc' : (item.important ? '#f87171' : 'var(--schedule-accent)')};font-size:14px">
                        ${dayLabels[localNow.getDay()]} - ${item.title} ${diffToStartMs > 0 && diffMin <= 30 ? `(Còn ${diffMin} ph)` : ''}
                    </h4>
                    <div style="display:flex;flex-direction:column;gap:2px;margin-bottom:8px;font-size:12px;color:var(--text-sub);${isPassed ? 'text-decoration:line-through;' : ''}">
                        <div>🟢 Bắt đầu: <b>${item.date.split('-').reverse().join('/')}</b> lúc <b>${item.time}</b></div>
                        <div>🏁 Kết thúc: <b>${(item.endDate || item.date).split('-').reverse().join('/')}</b> lúc <b>${item.endTime || item.time}</b></div>
                    </div>
                    <p style="margin:0;white-space:pre-wrap;font-size:13px;color:var(--text-main)">${item.content || 'Không có nội dung chi tiết'}</p>
                </div>
                <button class="btn-secondary" style="padding:4px 8px;font-size:11px;color:var(--danger-color);border-color:rgba(239,68,68,0.2);cursor:pointer" onclick="deleteTaskFromModal('${group.id}', ${item.originalIndex})">❌ Xóa</button>
            </div>`;
        });
    });

    const modalTitle = getEl('todayImportantModal')?.querySelector('h3');
    if (modalTitle) modalTitle.innerHTML = `📌 ĐẦU LỊCH HÔM NAY (${String(localNow.getDate()).padStart(2, '0')}/${String(localNow.getMonth() + 1).padStart(2, '0')})`;
    
    const contentBox = getEl('todayImportantContent');
    if (contentBox) { contentBox.innerHTML = html; openModal('todayImportantModal'); initGlobalPulseSystem(); }
}

function initGlobalPulseSystem() {
    if (window.globalPulseInterval) return;
    let stateToggle = false;
    
    window.globalPulseInterval = setInterval(() => {
        const pulsingElements = document.querySelectorAll('[data-pulse="true"]');
        document.querySelectorAll('.today-important-item, tbody tr').forEach(el => {
            if (el.getAttribute('data-pulse') !== 'true') {
                if (el.tagName === 'TR') {
                    if (!el.querySelector('.schedule-countdown-cell')?.innerHTML.includes('Đang chạy')) {
                        Array.from(el.cells).forEach(c => c.style.backgroundColor = "");
                    }
                } else {
                    el.style.boxShadow = "none";
                    const t = el.getAttribute('data-type');
                    el.style.backgroundColor = t === 'running' ? 'rgba(168,85,247,0.08)' : (t === 'important' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.05)');
                    el.style.borderLeftColor = t === 'running' ? '#a855f7' : (t === 'important' ? '#ef4444' : 'var(--schedule-accent, #10b981)');
                    const h4 = el.querySelector('.pulse-title');
                    if (h4) h4.style.color = t === 'running' ? '#c084fc' : (t === 'important' ? '#f87171' : 'var(--schedule-accent)');
                }
            }
        });

        pulsingElements.forEach(el => {
            if (el.style.opacity === "0.5") return;
            const h4 = el.querySelector('.pulse-title');
            const isRunningType = el.getAttribute('data-type') === 'running' || el.querySelector('.schedule-countdown-cell')?.innerHTML.includes('Đang chạy');

            if (stateToggle) {
                if (el.tagName === 'TR') Array.from(el.cells).forEach(c => c.style.backgroundColor = "rgba(239,68,68,0.25)");
                else {
                    el.style.backgroundColor = "rgba(239,68,68,0.3)"; el.style.boxShadow = "0 0 10px rgba(239,68,68,0.35)";
                    if (h4) h4.style.color = "#ff4d4d";
                }
            } else {
                if (el.tagName === 'TR') Array.from(el.cells).forEach(c => c.style.backgroundColor = "rgba(239,68,68,0.05)");
                else {
                    el.style.boxShadow = "none";
                    el.style.backgroundColor = isRunningType ? 'rgba(168,85,247,0.08)' : (el.getAttribute('data-type') === 'important' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.05)');
                    if (h4) h4.style.color = isRunningType ? '#c084fc' : (el.getAttribute('data-type') === 'important' ? '#f87171' : 'var(--schedule-accent)');
                }
            }
        });
        stateToggle = !stateToggle;
    }, 600);
}

function deleteTaskFromModal(groupId, originalIndex) {
    const group = getGroup(groupId);
    if (!group || !group.schedules[originalIndex]) return;

    customConfirm(`Xóa mốc lịch trình "${group.schedules[originalIndex].title}"?`, "⚠️ Xác nhận xóa").then((confirmed) => {
        if (confirmed) {
            group.schedules.splice(originalIndex, 1);
            saveData(); 
            const localNow = new Date();
            const today = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(localNow.getDate()).padStart(2, '0')}`;
            let remaining = 0;
            state.dashboardData.forEach(g => { if (g.type === 'schedule' && g.schedules) remaining += g.schedules.filter(s => s.date === today).length; });
            if (remaining === 0) closeModal('todayImportantModal'); else showTodayImportantTasks(); 
        }
    });
}

// ==========================================
// 8. ĐỌC / XUẤT FILE EXCEL TIÊU CHUẨN
// ==========================================
function triggerExcelImport(groupId) {
    const fileInput = getEl('excelScheduleInput');
    if (fileInput) fileInput.setAttribute('data-target-group-id', groupId);
    state.activeGroupId = groupId;
    
    const huongDanHTML = `
        <p style="color:var(--text-sub);font-size:13px;text-align:left;margin-bottom:15px">Vui lòng chuẩn bị file Excel đúng định dạng tiêu đề cột tiêu chuẩn sau:</p>
        <div style="overflow-x:auto;margin-bottom:15px;border:1px solid var(--border-color);border-radius:8px">
            <table style="width:100%;border-collapse:collapse;font-size:11px;text-align:left">
                <thead><tr style="background:var(--schedule-accent);color:white"><th style="padding:6px 8px">Ngay</th><th style="padding:6px 8px">Gio</th><th style="padding:6px 8px">NgayKetThuc</th><th style="padding:6px 8px">GioKetThuc</th><th style="padding:6px 8px">CongViec</th><th style="padding:6px 8px">QuanTrong</th><th style="padding:6px 8px">NoiDung</th></tr></thead>
                <tbody><tr><td style="padding:6px 8px;color:var(--text-sub)">2026-06-16</td><td style="padding:6px 8px;color:var(--text-sub)">08:00</td><td style="padding:6px 8px;color:var(--text-sub)">2026-06-16</td><td style="padding:6px 8px;color:var(--text-sub)">12:00</td><td>Họp Core</td><td style="padding:6px 8px;color:var(--text-sub)">TRUE</td><td style="padding:6px 8px;color:var(--text-sub)">Nội dung...</td></tr></tbody>
            </table>
        </div>`;

    const alertBox = getEl('alertModal')?.querySelector('.modal-box');
    if (alertBox) {
        alertBox.style.maxWidth = "600px";
        const titleH3 = alertBox.querySelector('h3');
        if (titleH3) { titleH3.innerHTML = "📊 Cấu trúc File Excel Đếm Giờ Chuẩn"; titleH3.style.color = "var(--text-main)"; }
        getEl('alertMessage').innerHTML = huongDanHTML;
        
        const resetAlertModal = () => {
            if (titleH3) { titleH3.innerHTML = "⚠️ Thông báo"; titleH3.style.color = "var(--danger-color)"; }
            if (gocBtn) gocBtn.style.display = 'block';
            alertBox.querySelector('.modal-footer-excel')?.remove();
        };

        const closeX = alertBox.querySelector('.close-modal-x');
        if (closeX) closeX.onclick = () => { closeModal('alertModal'); resetAlertModal(); };
        
        let footer = alertBox.querySelector('.modal-footer-excel') || document.createElement('div');
        footer.className = 'modal-footer-excel';
        Object.assign(footer.style, { display:'flex', justifyContent:'center', gap:'12px', marginTop:'20px' });
        getEl('alertMessage').after(footer);
        
        const gocBtn = alertBox.querySelector('.btn-primary');
        if (gocBtn) gocBtn.style.display = 'none';

        footer.innerHTML = `
            <button class="btn-secondary" style="background-color:var(--accent-color);color:#fff!important;padding:10px 16px" onclick="downloadExcelTemplate()">📥 Tải File Mẫu</button>
            <button class="btn-success" style="padding:10px 16px" id="btnConfirmExcelSelect">🎯 Chọn File Excel</button>
        `;

        getEl('btnConfirmExcelSelect').onclick = function() { closeModal('alertModal'); resetAlertModal(); setTimeout(() => { getEl('excelScheduleInput')?.click(); }, 200); };
    }
    openModal('alertModal');
}

function downloadExcelTemplate() {
    try {
        const sampleData = [
            { "Ngay": "2026-06-16", "Gio": "18:00", "NgayKetThuc": "2026-06-16", "GioKetThuc": "22:00", "CongViec": "Ca Tối GHTK", "QuanTrong": "FALSE", "NoiDung": "Trực vận hành" },
            { "Ngay": "2026-06-17", "Gio": "08:30", "NgayKetThuc": "2026-06-17", "GioKetThuc": "11:30", "CongViec": "Họp Giao Ban", "QuanTrong": "TRUE", "NoiDung": "Báo cáo tiến độ" }
        ];
        const ws = XLSX.utils.json_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "LichTrinhMau");
        XLSX.writeFile(wb, "mau_import_lich_trinh_countdown.xlsx");
    } catch (e) { alert("Có lỗi khi tạo file mẫu!"); }
}

getEl('excelScheduleInput')?.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (typeof XLSX === 'undefined') return alert("Thư viện Excel chưa được tải!");

    const group = getGroup(this.getAttribute('data-target-group-id') || state.activeGroupId);
    if (!group) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
            const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            if (!rawData?.length) return alert("File Excel trống!");
            
            const parseTime = t => {
                if (!t || String(t).trim() === "undefined") return "00:00";
                let s = String(t).toLowerCase().trim();
                if (!isNaN(s) && parseFloat(s) > 0 && parseFloat(s) < 1) {
                    const sec = Math.round(parseFloat(s) * 86400);
                    return `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor((sec%3600)/60)).padStart(2,'0')}`;
                }
                const pm = s.includes('pm') || s.includes('ch') || s.includes('chiều');
                const am = s.includes('am') || s.includes('sa') || s.includes('sáng');
                s = s.replace(/(am|pm|sa|ch|chiều|sáng)/g, '').trim();
                const p = s.split(':');
                if (p.length >= 2) {
                    let h = parseInt(p[0], 10), m = parseInt(p[1], 10);
                    if (pm && h < 12) h += 12; if (am && h === 12) h = 0;
                    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
                }
                return "00:00";
            };

            const parseDate = d => {
                if (!d || String(d).trim() === "undefined") return "";
                let s = String(d).trim().split(' ')[0];
                if (s.includes('/') || s.includes('-')) {
                    const p = s.split(s.includes('/') ? '/' : '-');
                    if (p.length === 3) {
                        if (p[0].length === 4) return `${p[0]}-${p[1].padStart(2,'0')}-${p[2].padStart(2,'0')}`;
                        let year = p[2].length === 2 ? '20' + p[2] : p[2];
                        return parseInt(p[0],10) > 12 ? `${year}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}` : `${year}-${p[0].padStart(2,'0')}-${p[1].padStart(2,'0')}`;
                    }
                } else if (!isNaN(s) && Number(s) > 0) {
                    const eD = XLSX.SSF.parse_date_code(Number(s));
                    return `${eD.y}-${String(eD.m).padStart(2,'0')}-${String(eD.d).padStart(2,'0')}`;
                }
                return "";
            };

            const newSchedules = rawData.map(row => {
                const title = String(row["CongViec"] || row["Congviec"] || row["Công Việc"] || row["Công việc"] || "").trim();
                const content = String(row["NoiDung"] || row["Nội Dung"] || "").trim();
                const imp = row["QuanTrong"] === true || String(row["QuanTrong"]).toLowerCase() === 'true';

                let date = parseDate(row["Ngay"] || row["Ngày"]);
                let time = parseTime(row["Gio"] || row["Giờ"]);
                let endDate = parseDate(row["NgayKetThuc"] || row["Ngày Kết Thúc"] || row["Ngayketthuc"]) || date;
                let endTime = parseTime(row["GioKetThuc"] || row["Giờ Kết Thúc"] || row["Gioketthuc"]);
                if (!row["GioKetThuc"] && !row["Giờ Kết Thúc"]) endTime = time;

                if (new Date(`${endDate}T${endTime}`) < new Date(`${date}T${time}`)) { endDate = date; endTime = time; }

                return { title, date, time, endDate, endTime, content: content === "undefined" ? "" : content, important: imp, emoji: imp ? "⚠️" : "📅" };
            }).filter(item => item.title && item.date);

            if (!newSchedules.length) return alert("❌ Không có mốc lịch hợp lệ!");
            if (!group.schedules) group.schedules = [];
            group.schedules.push(...newSchedules);
            
            sortSchedulesSmart(group.schedules);
            saveData();
            renderDashboard();
            alert(`📥 Import thành công ${newSchedules.length} lịch trình.`);
        } catch (err) { alert("Lỗi phân tích file Excel!"); }
        finally { event.target.value = ''; }
    };
    reader.readAsArrayBuffer(file);
});

// ==========================================
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
        } catch (err) { alert("File không hợp lệ!"); }
    };
    reader.readAsText(file); event.target.value = '';
}

// ==========================================
// 10. ĐỒNG BỘ ĐÁM MÂY GOOGLE DRIVE (GAPI)
// ==========================================
function gapiLoaded() { gapi.load('client', intializeGapiClient); }
async function intializeGapiClient() {
    await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] }); gapiInited = true; checkAuthStates();
}
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({ client_id: CLIENT_ID, scope: SCOPES, callback: '' }); gisInited = true; checkAuthStates();
}

function checkAuthStates() {
    if (gapiInited && gisInited && !gapi.client.getToken()) {
        const t = localStorage.getItem('google_oauth_token');
        if (t) { try { gapi.client.setToken(JSON.parse(t)); } catch (e) { localStorage.removeItem('google_oauth_token'); } }
    }
    const hasToken = gapiInited && gisInited && gapi.client.getToken();
    const btn = getEl('btn-login-google');
    if (btn && hasToken) { btn.innerHTML = "🟢 Đã liên kết Google"; btn.setAttribute('data-tooltip', 'Đã liên kết tài khoản Google'); }
    const syncBtn = getEl('btn-sync-google'); if (syncBtn) syncBtn.style.display = hasToken ? "inline-flex" : "none";
}

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) throw (resp);
        const btn = getEl('btn-login-google'); if (btn) { btn.innerHTML = "🟢 Đã liên kết Google"; }
        getEl('btn-sync-google').style.display = "inline-flex";
        const token = gapi.client.getToken(); if (token) localStorage.setItem('google_oauth_token', JSON.stringify(token));
        await fetchFileFromGoogleDrive();
    };
    tokenClient.requestAccessToken({ prompt: gapi.client.getToken() === null ? 'consent' : '' });
}

async function fetchFileFromGoogleDrive() {
    try {
        const response = await gapi.client.drive.files.list({ q: "name = 'workspace_data.json'", spaces: 'appDataFolder', fields: 'files(id, name)' });
        const files = response.result.files;
        if (files?.length > 0) {
            googleFileId = files[0].id;
            const cloudData = (await gapi.client.drive.files.get({ fileId: googleFileId, alt: 'media' })).result;
            if (cloudData && Array.isArray(cloudData)) {
                if (await customConfirm("Tải dữ liệu mới từ Cloud về máy [Đồng ý], hoặc Ghi đè dữ liệu máy lên Cloud [Giữ lại]?", "⚠️ XUNG ĐỘT DỮ LIỆU")) {
                    state.dashboardData = cloudData;
                    state.dashboardData.forEach(g => { if (g.pinKey) g.isLocked = true; });
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
                    renderDashboard(); updateScheduleUI(); alert("📥 Tải dữ liệu thành công!");
                } else { syncToGoogleDrive(false); }
            }
        } else { syncToGoogleDrive(true); }
    } catch (err) { console.error(err); }
}

async function syncToGoogleDrive(isSilent = false) {
    if (!gapi.client.getToken()) return isSilent ? null : alert("Chưa liên kết Google!");
    const syncBtn = getEl('btn-sync-google');
    if (!isSilent && syncBtn) syncBtn.innerHTML = "⏳ Đang sync...";
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
        if (!isSilent) alert("📤 Đồng bộ Drive thành công!");
    } catch (e) { if (!isSilent) alert("Lỗi sync: " + e.message); }
    finally { if (syncBtn) syncBtn.innerHTML = "🔄 Đồng bộ Drive"; }
}

// ==========================================
// 11. HỆ THỐNG CONTEXT MENU & DRAG-DROP (SORTABLE)
// ==========================================
function buildMoveSubMenuHTML(type, currentGroupId, itemIndex) {
    const targets = state.dashboardData.filter(g => g.type === type && g.id !== currentGroupId);
    if (!targets.length) return '';
    return `
        <div class="move-submenu-container" style="position:relative" onmouseenter="this.querySelector('.sub-items').style.display='block'" onmouseleave="this.querySelector('.sub-items').style.display='none'">
            <div class="context-menu-item">🔄 Đổi group</div>
            <div class="sub-items" style="display:none;position:absolute;left:100%;top:0;background:var(--context-bg);border:1px solid var(--border-color);border-radius:8px;width:180px;box-shadow:var(--shadow-main);z-index:2500">
                ${targets.map(g => `<div class="context-menu-item" onclick="event.stopPropagation();moveItem('${type}','${currentGroupId}',${itemIndex},'${g.id}')">${g.emoji && g.emoji !== 'NONE' ? g.emoji : '📁'} ${g.title}</div>`).join('')}
            </div>
        </div>`;
}

function openContextMenu(e, targetType, groupId, index = null) {
    e.preventDefault(); e.stopPropagation();
    state.activeGroupId = groupId; state.activeIndex = index;

    const menu = getEl('customContextMenu');
    const menuContent = getEl('menuItemsContent');
    if (!menu || !menuContent) return;
    
    menu.style.display = 'none'; menuContent.innerHTML = '';
    const group = getGroup(groupId);
    const hasPin = group?.pinKey && group.pinKey !== "";
    
    const lockMenuHTML = hasPin 
        ? `<div class="context-menu-divider"></div>${!group.isLocked ? `<div class="context-menu-item" onclick="quickLockGroup('${groupId}')">🔒 Khóa lại nhóm</div>` : ''}<div class="context-menu-item" onclick="handleLockMenuAction('${groupId}')">🔓 Gỡ bỏ Mã Khóa</div>`
        : `<div class="context-menu-divider"></div><div class="context-menu-item" onclick="handleLockMenuAction('${groupId}')">🔒 Thiết lập Mã Khóa</div>`;

    const actions = {
        'group-link': `<div class="context-menu-item" onclick="openLinkModal('${groupId}')">➕ Thêm nút bấm link</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="openGroupModal('${groupId}','link')">📝 Sửa tên nhóm</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>${lockMenuHTML}`,
        'group-note': `<div class="context-menu-item" onclick="openNoteModal('${groupId}')">➕ Thêm nút ghi chú</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="openGroupModal('${groupId}','note')">📝 Sửa tên nhóm</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>${lockMenuHTML}`,
        'group-schedule': `<div class="context-menu-item" onclick="openScheduleModal('${groupId}')">➕ Thêm mốc lịch trình</div><div class="context-menu-item" onclick="triggerExcelImport('${groupId}')">📥 Import từ Excel</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="openGroupModal('${groupId}','schedule')">📝 Sửa tên nhóm</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>${lockMenuHTML}`,
        'link': `<div class="context-menu-item" onclick="duplicateItem('link','${groupId}',${index})">✨ Nhân bản nút</div>${buildMoveSubMenuHTML('link',groupId,index)}<div class="context-menu-item" onclick="openLinkModal('${groupId}',${index})">📝 Chỉnh sửa nút</div><div class="context-menu-item delete" onclick="triggerDelete('Link')">❌ Xóa nút bấm này</div>`,
        'note': `<div class="context-menu-item" onclick="duplicateItem('note','${groupId}',${index})">✨ Nhân bản ghi chú</div>${buildMoveSubMenuHTML('note',groupId,index)}<div class="context-menu-item" onclick="openNoteModal('${groupId}',${index})">📝 Chỉnh sửa ghi chú</div><div class="context-menu-item delete" onclick="triggerDelete('Note')">❌ Xóa ghi chú này</div>`,
        'schedule': `<div class="context-menu-item" onclick="duplicateItem('schedule','${groupId}',${index})">✨ Nhân bản mốc lịch</div>${buildMoveSubMenuHTML('schedule',groupId,index)}<div class="context-menu-item" onclick="openScheduleModal('${groupId}',${index})">📝 Chỉnh sửa mốc lịch</div><div class="context-menu-item delete" onclick="triggerDelete('Schedule')">❌ Xóa mốc lịch này</div>`
    };

    if (actions[targetType]) {
        menuContent.innerHTML = actions[targetType];
        Object.assign(menu.style, { display: 'block', left: `${e.pageX}px`, top: `${e.pageY}px` });
    }
}

function initDragAndDrop() {
    if (typeof Sortable === 'undefined') return;
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    const groupsContainer = getEl('groupsContainer');
    if (groupsContainer) {
        if (Sortable.get(groupsContainer)) Sortable.get(groupsContainer).destroy();
        Sortable.create(groupsContainer, {
            animation: 200, ghostClass: 'sortable-ghost-group', handle: '.group-title', forceFallback: isMobile, fallbackClass: 'sortable-fallback', fallbackTolerance: isMobile ? 10 : 5,
            onEnd: () => {
                const order = Array.from(document.querySelectorAll('#groupsContainer .group-card')).map(c => c.getAttribute('data-id'));
                state.dashboardData.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
                saveData();
            }
        });
    }

    document.querySelectorAll('.links-area, .notes-area, .schedules-area').forEach(area => {
        const groupId = area.getAttribute('data-group-id');
        const type = area.classList.contains('links-area') ? 'link' : (area.classList.contains('notes-area') ? 'note' : 'schedule');
        if (type === 'schedule') return;

        if (Sortable.get(area)) Sortable.get(area).destroy();
        Sortable.create(area, {
            animation: 150, ghostClass: 'sortable-ghost-link', delay: isMobile ? 300 : 0, delayOnTouchOnly: true, forceFallback: isMobile, fallbackTolerance: 4,
            onEnd: () => {
                const group = getGroup(groupId); if (!group) return;
                const key = `${type}s`;
                group[key] = Array.from(area.children).map(item => group[key][parseInt(item.getAttribute('data-index'))]).filter(Boolean);
                saveData();
            }
        });
    });
}
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// ==========================================
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
    
    getEl('keyModalTitle').textContent = hasPin ? '🔓 Hủy bỏ khóa nhóm' : '🔒 Thiết lập Mã Khóa Mới';
    getEl('keyModalDesc').textContent = hasPin ? 'Nhập mã khóa hiện tại để gỡ bỏ bảo mật.' : 'Tạo mã bảo vệ cho nhóm này. Cấu hình sẽ tự động đồng bộ.';
    openModal('keyModal');
}

function triggerUnlockGroup(groupId) {
    keyModalContext.targetGroupId = groupId; keyModalContext.action = 'unlock';
    const input = getEl('groupKeyInput'); if (!input) return;
    input.value = ""; clearKeyError();
    input.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); submitKeyForm(); } };
    input.type = 'password'; getEl('toggleKeyVisibility').textContent = '👁️';
    
    getEl('keyModalTitle').textContent = '🔒 Nhập Mã Khóa';
    getEl('keyModalDesc').textContent = 'Nhóm này đang khóa. Vui lòng xác thực mã để truy cập.';
    openModal('keyModal');
}

function submitKeyForm() {
    clearKeyError();
    const keyInput = getEl('groupKeyInput')?.value.trim();
    if (!keyInput) return showKeyError("Vui lòng nhập mã khóa.");
    
    const hashedKey = btoa(unescape(encodeURIComponent(keyInput)));
    const group = getGroup(keyModalContext.targetGroupId);
    if (!group) return;

    if (keyModalContext.action === 'setup_lock') {
        group.pinKey = hashedKey; group.isLocked = true; alert("Thiết lập mã khóa thành công!");
    } else if (keyModalContext.action === 'remove_lock') {
        if (group.pinKey === hashedKey) { group.pinKey = ""; group.isLocked = false; alert("Đã gỡ bỏ mã bảo vệ!"); }
        else return showKeyError("Mã khóa không chính xác.");
    } else if (keyModalContext.action === 'unlock') {
        if (group.pinKey === hashedKey) group.isLocked = false;
        else return showKeyError("Mã khóa sai. Vui lòng thử lại.");
    }
    closeModal('keyModal');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    syncToGoogleDrive(true); renderDashboard();
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

        openContextMenu({ preventDefault(){}, stopPropagation(){}, pageX: e.touches[0].pageX, pageY: e.touches[0].pageY }, targetType, groupId, index);
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
    setTimeout(() => { checkAuthStates(); }, 500);
    setTimeout(showTodayImportantTasks, 300);
});
// ==========================================
// 1. CẤU HÌNH & KHỞI TẠO BIẾN TOÀN CỤC (CONFIG & STATE)
// ==========================================
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

// Utilities viết gọn
const getEl = id => document.getElementById(id);
const getGroup = id => state.dashboardData.find(g => g.id === id);

// ==========================================
// 2. BACKGROUND CANVAS (HIỆU ỨNG NỀN VŨ TRỤ / MÂY BAY)
// ==========================================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let animationFrameId;
let stars = [];        
let backgroundStars = []; 
let clouds = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initBackgroundObjects();
}

function initBackgroundObjects() {
    const isLightMode = document.body.classList.contains('light-mode');
    stars = [];
    backgroundStars = [];
    clouds = [];

    if (!isLightMode) {
        // Sao lấp lánh nền
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
        // Sao băng rơi
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
        // Đám mây bay (Light Mode)
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

function drawRealisticCloud(ctx, cloud) {
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
    cloud.offsets.forEach(offset => {
        ctx.arc(cloud.x + offset.rx, cloud.y + offset.ry, offset.r, 0, Math.PI * 2);
    });
    ctx.fill();
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLightMode = document.body.classList.contains('light-mode');

    if (!isLightMode) {
        // Dark Mode: Vẽ Sao Nền
        backgroundStars.forEach(bStar => {
            bStar.opacity += bStar.speed * bStar.factor;
            if (bStar.opacity > 0.9 || bStar.opacity < 0.1) bStar.factor *= -1;
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${bStar.opacity})`;
            ctx.arc(bStar.x, bStar.y, bStar.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Dark Mode: Vẽ Sao Băng
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
        // Light Mode: Vẽ Mây & Sky
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
            
            drawRealisticCloud(ctx, cloud);
            cloud.x += cloud.speed;

            if (cloud.x - cloud.radius * 3 > canvas.width) {
                cloud.x = -cloud.radius * 3;
                cloud.y = Math.random() * (canvas.height * 0.45) + 30;
            }
        });
        ctx.restore();
    }
    ctx.globalAlpha = 1.0; 

    if (isCanvasEnabled) {
        animationFrameId = requestAnimationFrame(drawBackground);
    }
}

// ==========================================
// 3. THAY ĐỔI GIAO DIỆN (THEME SYSTEM)
// ==========================================
function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    const btn = getEl('themeBtn');
    if (btn) btn.innerHTML = isLight ? '🌙' : '💡';
    
    // CHỈ KHỞI TẠO LẠI NẾU CANVAS ĐANG BẬT
    if (isCanvasEnabled) {
        initBackgroundObjects();
    }
}


// ==========================================
// . ON/OF GIAO DIỆN (THEME SYSTEM)
// ==========================================
// Biến kiểm tra trạng thái bật/tắt của Canvas (mặc định là true - bật)
// Thay đổi mặc định thành false nếu chưa có cấu hình trong máy
let isCanvasEnabled = localStorage.getItem('canvas-enabled') === 'the-first-time' ? false : (localStorage.getItem('canvas-enabled') === 'true');

function toggleThemeCanvas() {
    isCanvasEnabled = !isCanvasEnabled;
    // Lưu trạng thái vào localStorage
    localStorage.setItem('canvas-enabled', isCanvasEnabled);
    
    applyCanvasState();
}

function applyCanvasState() {
    const btn = document.getElementById('themeBtnCanvas');
    
    if (isCanvasEnabled) {
        // 1. Hiển thị lại canvas
        canvas.style.display = 'block';
        // 2. Cập nhật lại kích thước và khởi tạo vật thể
        resizeCanvas();
        // 3. Chạy lại hiệu ứng vẽ (nếu chưa chạy)
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(drawBackground);
        }
        // 4. Thay đổi icon nút bấm nếu thích (Ví dụ: ⭐ khi bật)
        if (btn) btn.innerHTML = '⭐';
    } else {
        // 1. Ẩn canvas đi
        canvas.style.display = 'none';
        // 2. Hủy vòng lặp vẽ để tiết kiệm RAM/CPU
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null; // Reset ID
        }
        // 3. Xóa sạch canvas hiện tại
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 4. Thay đổi icon nút bấm khi tắt (Ví dụ: 🌟 hoặc nút xám)
        if (btn) btn.innerHTML = '🌟';
    }
}

// Gọi hàm này ngay khi tải trang để áp dụng cấu hình cũ của người dùng
applyCanvasState();

// ==========================================
// 4. HỆ THỐNG DIALOGS & POPUPS TỰ CHẾ (MODALS & CUSTOM ALERTS)
// ==========================================
window.alert.__native__ = window.alert; // Backup hệ thống gốc

window.alert = function(message, title = "⚠️ Thông báo") {
    const alertModal = document.getElementById('alertModal');
    const alertTitle = document.getElementById('alertModalTitle');
    const alertMsg = document.getElementById('alertMessage');
    
    if (alertModal && alertMsg) {
        if (alertTitle) alertTitle.innerText = title;
        alertMsg.innerHTML = message.replace(/\n/g, '<br>');
        if (alertTitle) alertTitle.style.color = "var(--danger-color)";
        
        const gốcBtn = alertModal.querySelector('.btn-primary');
        if (gốcBtn) gốcBtn.style.display = 'block';
        
        alertModal.classList.add('active');
    } else {
        console.warn("Không tìm thấy cấu trúc alertModal, dùng alert gốc:", message);
        window.alert.__native__(message);
    }
};

function customConfirm(message, title = "❓ Xác nhận thao tác") {
    return new Promise((resolve) => {
        const confirmModal = document.getElementById('confirmModal');
        const confirmTitle = document.getElementById('confirmTitle');
        const confirmMsg = document.getElementById('confirmMessage');
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        const cancelBtn = document.getElementById('confirmCancelBtn');
        
        if (!confirmModal || !confirmMsg || !confirmBtn || !cancelBtn) {
            console.warn("Hệ thống thiếu cấu trúc HTML confirmModal, tự động dùng cơ chế gốc.");
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

function openModal(id) { getEl(id)?.classList.add('active'); }
function closeModal(id) { 
    const modal = getEl(id);
    if (modal) {
        modal.classList.remove('active');
        if(id === 'alertModal') {
            document.querySelector('.modal-footer-excel')?.remove();
        }
    }
}

// ==========================================
// 5. QUẢN LÝ DỮ LIỆU & RENDER DASHBOARD CORE
// ==========================================
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    renderDashboard();
    updateScheduleUI();
    if (gapiInited && gisInited && gapi.client.getToken()) {
        syncToGoogleDrive(true); 
    }
}

function linkify(text) {
    if (!text) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
}

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
        if (!group.type) group.type = group.notes ? 'note' : (group.schedules ? 'schedule' : 'link');
        
        const groupCard = document.createElement('div');
        
        // --- TÍCH HỢP LOGIC KIỂM TRA KHÓA CHO LỚP CARD ---
        let cardClassName = `group-card type-${group.type}`;
        let lockOverlayHTML = '';
        
        if (group.pinKey && group.pinKey !== "" && group.isLocked) {
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
        // ========================================================
        // 📅 KHU VỰC SỬA LỖI HIỂN THỊ CỘT THỨ (SCHEDULE)
        // ========================================================
        // ========================================================
        // 📅 KHU VỰC SỬA ĐỔI: ĐỔI CỘT GIỜ THÀNH ĐẾM NGƯỢC (SCHEDULE)
        // ========================================================
        else if (group.type === 'schedule') {
            if (!group.schedules?.length) contentArea.innerHTML = `<span class="no-data-text">Chuột phải để thêm lịch trình...</span>`;
            else {
                const wrapper = document.createElement('div');
                wrapper.className = 'schedule-table-wrapper';
                const table = document.createElement('table');
                table.className = 'schedule-table';
                
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th style="width: 20%;">Ngày</th>
                            <th style="width: 20%;">Thứ</th>
                            <th style="width: 30%; text-align: center;">Thời hạn</th>
                            <th style="width: 30%;">Công việc</th>
                        </tr>
                    </thead>
                    <tbody></tbody>`;
                
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
                    if (todayTime > startDateObj && todayTime <= endDateObj) {
                        activeDateStr = todayStr;
                    } else if (todayTime > endDateObj) {
                        activeDateStr = sch.endDate || sch.date;
                    }

                    const finalScheduleTime = new Date(`${sch.endDate || sch.date} ${sch.endTime || sch.time || "00:00"}`);
                    const isPast = finalScheduleTime < now;

                    row.className = `schedule-row ${sch.important ? 'important' : ''} ${isPast ? 'past' : ''}`;
                    row.onclick = () => showContentDetail(group.id, idx, 'schedule');
                    row.oncontextmenu = (e) => openContextMenu(e, 'schedule', group.id, idx);
                    
                    let displayDate = activeDateStr.split('-').reverse().slice(0,2).join('/');

                    let dayOfWeek = "---";
                    const parsedActiveDate = new Date(activeDateStr.replace(/-/g, '/'));
                    if (!isNaN(parsedActiveDate.getTime())) {
                        dayOfWeek = dayLabels[parsedActiveDate.getDay()];
                    }

                    // Lưu các mốc thời gian gốc vào thuộc tính data của hàng (Để hàm cập nhật đếm ngược đọc trực tiếp)
                    const fullStartStr = `${sch.date}T${sch.time || '00:00'}`;
                    const fullEndStr = `${sch.endDate || sch.date}T${sch.endTime || sch.time || '00:00'}`;
                    row.setAttribute('data-start', fullStartStr);
                    row.setAttribute('data-end', fullEndStr);

                    row.innerHTML = `
                        <td class="schedule-date">${displayDate}</td>
                        <td class="schedule-date schedule-time" style="color: #38bdf8; font-weight: 600;">${dayOfWeek}</td>
                        <td class="schedule-countdown-cell" style="text-align: center; font-size: 11px; font-weight: bold; font-family: monospace;">⏳ Tính...</td>
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
        
        if (group.collapsed) {
            if (contentArea) contentArea.style.display = 'none';
            if (arrow) arrow.style.transform = 'rotate(-90deg)';
        } else {
            if (contentArea) contentArea.style.display = '';
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
    }
}

// ==========================================
// 6. THAO TÁC FORM (THÊM / SỬA / XÓA NHÓM VÀ PHẦN TỬ)
// ==========================================
function openGroupModal(editGroupId = false, defaultType = 'link') {
    state.currentGroupType = defaultType;
    state.isEditMode = !!editGroupId;
    state.activeGroupId = editGroupId;

    const titleEl = getEl('groupModalTitle');
    const nameInput = getEl('groupNameInput');

    if (state.isEditMode) {
        const group = getGroup(editGroupId);
        if (titleEl) titleEl.innerText = "📝 Sửa Tên/Icon Nhóm";
        if (nameInput) nameInput.value = group.title;
        buildEmojiPicker('groupEmojiGrid', group.emoji || "NONE");
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
        const newGroup = { 
            id: 'g_' + Date.now(), 
            title: name, 
            emoji: state.selectedEmoji, 
            type: state.currentGroupType,
            [`${state.currentGroupType}s`]: []
        };
        state.dashboardData.push(newGroup);
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
    
    const arrayKey = type === 'link' ? 'links' : (type === 'note' ? 'notes' : 'schedules');
    const originalItem = group[arrayKey][index];
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
    if (!sourceGroup || !targetGroup) return;
    
    const arrayKey = type === 'link' ? 'links' : (type === 'note' ? 'notes' : 'schedules');
    const [movedItem] = sourceGroup[arrayKey].splice(index, 1);
    
    if (movedItem) {
        if (!targetGroup[arrayKey]) targetGroup[arrayKey] = [];
        targetGroup[arrayKey].push(movedItem);
        if (type === 'schedule') {
            targetGroup.schedules.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
        }
        saveData();
    }
}

function triggerDelete(type) {
    const group = getGroup(state.activeGroupId);
    let msg = "";
    
    if (type === 'Group') msg = `Bạn có chắc chắn muốn xóa nhóm "${group.title}" cùng toàn bộ dữ liệu bên trong?`;
    else if (type === 'Link') msg = `Bạn có chắc chắn muốn xóa nút bấm "${group.links[state.activeIndex].name}"?`;
    else if (type === 'Note') msg = `Bạn có chắc chắn muốn xóa nút ghi chú "${group.notes[state.activeIndex].title}"?`;
    else if (type === 'Schedule') msg = `Bạn có chắc chắn muốn xóa mốc lịch trình "${group.schedules[state.activeIndex].title}"?`;

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

    if (type === 'note') {
        titleEl.style.color = "var(--note-accent)"; 
        closeBtn.className = "btn-warning";
        const noteObj = group.notes[index];
        const titleText = (noteObj.emoji && noteObj.emoji !== "NONE") ? `${noteObj.emoji} ${noteObj.title}` : `📝 ${noteObj.title}`;
        
        Object.assign(titleEl.style, { display: "flex", justifyContent: "space-between", alignItems: "center" });
        titleEl.innerHTML = `<span>${titleText}</span><button class="btn-secondary" style="font-size:10px; padding:4px 8px;" onclick="copyNoteContent(this)">📋 Copy</button>`;
        bodyEl.innerHTML = `<div class="view-note-content" id="contentToCopy">${linkify(noteObj.content)}</div>`;
    } 
    else if (type === 'schedule') {
        titleEl.style.color = "var(--schedule-accent)"; 
        closeBtn.className = "btn-success";
        const schObj = group.schedules[index];
        
        const displayStartDate = schObj.date.split('-').reverse().join('/');
        const displayEndDate = (schObj.endDate || schObj.date).split('-').reverse().join('/');

        titleEl.innerHTML = schObj.important ? `⚠️ ${schObj.title}` : `📅 Lịch Trình: ${schObj.title}`;
        bodyEl.innerHTML = `
            <div class="single-schedule-detail">
                <h4>${schObj.title}</h4>
                <div class="schedule-info-line" style="margin-bottom: 5px;">
                    🟢 Bắt đầu: <b>${displayStartDate} lúc ${schObj.time || '00:00'}</b>
                </div>
                <div class="schedule-info-line" style="margin-bottom: 12px;">
                    🏁 Kết thúc: <b>${displayEndDate} lúc ${schObj.endTime || schObj.time || '00:00'}</b>
                </div>
                <label style="display:block; margin-bottom:6px; color:var(--text-sub); font-size:12px;">📋 Nội dung đầu việc:</label>
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
    }).catch(err => console.error('Lỗi khi copy: ', err));
}

// ==========================================
// 7. QUẢN LÝ LỊCH TRÌNH (SCHEDULE & ALERTS SYSTEM)
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
        <div class="schedule-block-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <label class="important-checkbox-label" style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                <input type="checkbox" class="sch-important-cb" ${important ? 'checked' : ''}> ⚠️ Mốc lịch này Quan Trọng
            </label>
            ${!state.isEditMode ? `<button type="button" class="btn-remove-block" style="color: var(--danger-color); background: none; border: 1px solid rgba(239, 68, 68, 0.3); padding: 4px 8px; font-size: 11px; border-radius: 4px; cursor: pointer;" onclick="removeScheduleBlock('${blockId}')">Xóa mốc này</button>` : ''}
        </div>
        
        <div class="form-group" style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-sub);">Tên nút mốc thời gian:</label>
            <input type="text" class="form-input sch-title-input" placeholder="Ví dụ: Họp phòng ban, Ca trực..." value="${title}" required style="width: 100%;">
        </div>
        
        <div class="datetime-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div class="form-group" style="margin: 0;">
                <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-sub);">Chọn Ngày Áp Dụng:</label>
                <input type="date" class="form-input sch-date-input" value="${date}" required style="width: 100%;">
            </div>
            <div class="form-group" style="margin: 0;">
                <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-sub);">Chọn Giờ Bắt Đầu:</label>
                <input type="time" class="form-input sch-time-input" value="${time}" required style="width: 100%;">
            </div>
        </div>
        
        <div class="datetime-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div class="form-group" style="margin: 0;">
                <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-sub);">Chọn Ngày Kết Thúc:</label>
                <input type="date" class="form-input sch-end-date-input" value="${endDate}" required style="width: 100%;">
            </div>
            <div class="form-group" style="margin: 0;">
                <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-sub);">Chọn Giờ Kết Thúc:</label>
                <input type="time" class="form-input sch-end-time-input" value="${endTime}" required style="width: 100%;">
            </div>
        </div>
        
        <div class="form-group" style="margin-bottom: 8px;">
            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-sub);">📋 Danh sách các đầu việc cần làm:</label>
            <textarea class="form-input sch-content-input" placeholder="Nhập các chi tiết đầu việc tại đây..." rows="3" style="width: 100%; resize: vertical;">${content}</textarea>
        </div>
        
        <input type="hidden" class="sch-emoji-hidden" value="${emoji}">
    `;

    // LẮNG NGHE ĐỂ TỰ ĐỘNG CẬP NHẬT (Áp dụng cho cả THÊM MỚI và SỬA)
    const dateInp = block.querySelector('.sch-date-input');
    const timeInp = block.querySelector('.sch-time-input');
    const endDateInp = block.querySelector('.sch-end-date-input');
    const endTimeInp = block.querySelector('.sch-end-time-input');
    
    dateInp.addEventListener('change', () => {
        // Nếu ngày kết thúc chưa có hoặc nhỏ hơn ngày bắt đầu vừa chọn -> Cập nhật bằng ngày bắt đầu
        if (!endDateInp.value || new Date(endDateInp.value) < new Date(dateInp.value)) {
            endDateInp.value = dateInp.value;
        }
    });

    wrapper.appendChild(block);
}

function removeScheduleBlock(id) {
    const wrapper = getEl('scheduleBlocksWrapper');
    if (wrapper.children.length <= 1 && !state.isEditMode) {
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
    let hasTimeError = false; // Biến kiểm tra lỗi logic thời gian

    const blocksData = Array.from(blockElements).map(block => {
        const title = block.querySelector('.sch-title-input').value.trim();
        const date = block.querySelector('.sch-date-input').value;
        const time = block.querySelector('.sch-time-input').value;
        const endDate = block.querySelector('.sch-end-date-input').value;
        const endTime = block.querySelector('.sch-end-time-input').value;
        const content = block.querySelector('.sch-content-input').value;
        const important = block.querySelector('.sch-important-cb').checked;
        const hiddenEmoji = block.querySelector('.sch-emoji-hidden').value;

        if (!title || !date || !time || !endDate || !endTime) {
            hasError = true;
        }

        // KIỂM TRA LOGIC: Ngày giờ kết thúc phải >= Ngày giờ bắt đầu
        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        if (endDateTime < startDateTime) {
            hasTimeError = true;
        }

        return { 
            title, 
            date,        
            time,        
            endDate,     
            endTime,     
            content, 
            important, 
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

    if (state.isEditMode) {
        group.schedules[state.activeIndex] = blocksData[0];
    } else {
        group.schedules.push(...blocksData);
    }

    group.schedules.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
    
    saveData();
    closeModal('scheduleModal');
}

function updateScheduleUI() {
    const now = new Date();
    const rows = document.querySelectorAll('.schedule-table tbody tr');

    rows.forEach(row => {
        // Đọc mốc thời gian từ data attributes
        const startStr = row.getAttribute('data-start');
        const endStr = row.getAttribute('data-end');
        const countdownCell = row.querySelector('.schedule-countdown-cell');
        const jobCell = row.querySelector('.schedule-name')?.innerText.trim();

        if (!startStr || !endStr || !countdownCell) return;

        const startTime = new Date(startStr);
        const endTime = new Date(endStr);
        
        const diffToStartMs = startTime - now;
        const diffToEndMs = endTime - now;
        
        let countdownText = "";
        let badgeColor = "";

        // Tháo gỡ các trạng thái style cũ để tính toán lại toàn diện
        row.style.display = ""; 
        row.style.textDecoration = "none";
        row.classList.remove('highlight-warning', 'blink-effect');
        row.removeAttribute('data-pulse');
        
        // Mảng chứa các ô để chỉnh độ mờ/màu sắc
        const cells = Array.from(row.cells);

        if (diffToEndMs < 0) {
            // TRƯỜNG HỢP 1: ĐÃ QUÁ HẠN HOÀN TOÀN
            countdownText = "Hết hạn";
            badgeColor = "#ef4444";
            row.style.textDecoration = "line-through";
            row.style.borderLeft = ""; // Khôi phục viền mặc định
            cells.forEach(cell => {
                cell.style.opacity = "0.45"; 
                cell.style.color = "var(--text-sub)";
                cell.style.backgroundColor = "transparent";
            });
        } 
        else if (diffToStartMs <= 0 && diffToEndMs >= 0) {
            // TRƯỜNG HỢP 2: ĐANG TRONG THỜI GIAN DIỄN RA CÔNG VIỆC
            countdownText = "Đang chạy";
            badgeColor = "#a855f7"; // Màu tím cá tính cho sự kiện đang diễn ra
            
            // 👉 THÊM MỚI: Ép cứng viền trái màu tím cho hàng đang chạy ngoài Dashboard
            row.style.borderLeft = "4px solid #a855f7";

            cells.forEach(cell => {
                cell.style.opacity = "1";
                cell.style.color = "";
            });

            // Nếu sắp hết hạn (còn dưới 30 phút), cho nhấp nháy báo động
            const minutesLeft = Math.floor(diffToEndMs / 60000);
            if (minutesLeft <= 30) {
                row.setAttribute('data-pulse', 'true');
            }
        } 
        else {
            // TRƯỜNG HỢP 3: CHƯA ĐẾN GIỜ (ĐANG ĐẾM NGƯỢC TỚI HẠN BẮT ĐẦU)
            row.style.borderLeft = ""; // Khôi phục viền mặc định
            cells.forEach(cell => {
                cell.style.opacity = "1";
                cell.style.color = ""; 
                cell.style.backgroundColor = "transparent";
            });

            const diffMin = Math.floor(diffToStartMs / 60000);
            const diffHour = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHour / 24);

            if (diffDay > 0) {
                countdownText = `Còn ${diffDay} ngày`;
                badgeColor = "#10b981"; // Màu xanh lá an toàn
            } else if (diffHour > 0) {
                countdownText = `${diffHour}g : ${diffMin % 60}ph`;
                badgeColor = "#f59e0b"; // Màu cam chuẩn bị
            } else {
                countdownText = `🚨 Còn ${diffMin} phút`;
                badgeColor = "#ef4444"; // Màu đỏ khẩn cấp
                
                // Kích hoạt nhấp nháy đồng bộ và thông báo đẩy khi còn dưới 30 phút
                if (diffMin <= 30) {
                    row.setAttribute('data-pulse', 'true');
                    
                    if (Notification.permission === "granted" && !row.dataset.notified) {
                        new Notification("🚨 SẮP ĐẾN MỐC HẸN!", {
                            body: `Sắp tới giờ làm việc: ${jobCell} (còn ${diffMin} phút).`,
                        });
                        row.dataset.notified = "true";
                    }
                }
            }
        }

        // Đổ chữ đếm ngược kèm màu sắc nổi bật vào ô
        countdownCell.innerHTML = `<span style="color: ${badgeColor};">${countdownText}</span>`;
    });

    // Gọi vòng lặp chớp nháy đồng bộ hệ thống của bạn
    initGlobalPulseSystem();
}

// ==========================================================================
// 1. HÀM HIỂN THỊ DANH SÁCH LỊCH TRÌNH TRONG NGÀY
// ==========================================================================
function showTodayImportantTasks() {
    const localNow = new Date();
    
    const currentYear = localNow.getFullYear();
    const currentMonth = localNow.getMonth();
    const currentDate = localNow.getDate();
    
    // Tạo mốc thời gian 00:00:00 của ngày hôm nay để so sánh khoảng ngày chuẩn xác
    const todayTime = new Date(currentYear, currentMonth, currentDate).getTime();

    let count = 0;
    let groupsWithImportant = []; 
    let groupsNormalOnly = [];     

    state.dashboardData.forEach(group => {
        if (group.type !== 'schedule' || !group.schedules) return;
        
        const todaySchedules = group.schedules
            .map((item, originalIndex) => ({ ...item, originalIndex })) 
            .filter(item => {
                const [sY, sM, sD] = item.date.split('-').map(Number);
                const startDate = new Date(sY, sM - 1, sD).getTime();
                
                const [eY, eM, eD] = (item.endDate || item.date).split('-').map(Number);
                const endDate = new Date(eY, eM - 1, eD).getTime();
                
                return todayTime >= startDate && todayTime <= endDate;
            })
            .sort((a, b) => a.time.localeCompare(b.time));
        
        if (todaySchedules.length > 0) {
            count += todaySchedules.length;
            const hasImportant = todaySchedules.some(item => item.important);
            const groupData = { groupObj: group, schedules: todaySchedules };

            if (hasImportant) groupsWithImportant.push(groupData);
            else groupsNormalOnly.push(groupData);
        }
    });

    if (count === 0) return;
    const sortedGroups = [...groupsWithImportant, ...groupsNormalOnly];

    let html = '';
    const dayLabels = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

    sortedGroups.forEach(itemData => {
        const group = itemData.groupObj;
        const gEmoji = (group.emoji && group.emoji !== "NONE") ? `${group.emoji} ` : '📅 ';
        
        html += `<h3 style="color: var(--accent-color); margin-top: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 5px;">${gEmoji}${group.title}</h3>`;
        
        itemData.schedules.forEach(item => {
            const targetTimeStr = item.endTime || item.time || '00:00';

            const exactStartDT = new Date(`${item.date}T${item.time}:00`);
            const exactEndDT = new Date(`${item.endDate || item.date}T${targetTimeStr}:00`);

            const isPassed = localNow > exactEndDT; 
            // 👉 THÊM MỚI: Định nghĩa trạng thái đang chạy thực tế
            const isRunning = localNow >= exactStartDT && localNow <= exactEndDT;
            
            // Kiểm tra mốc 30 phút sát nút
            const isIncomingHot = (exactStartDT - localNow) > 0 && (exactStartDT - localNow) <= 30 * 60 * 1000; 
            const isEndingHot = (exactEndDT - localNow) > 0 && (exactEndDT - localNow) <= 30 * 60 * 1000;

            const shouldPulse = (isIncomingHot || isEndingHot) && !isPassed;

            // Đặt data-pulse rõ ràng kèm type (Đổi thành 'running' nếu lịch đang chạy)
            let currentType = 'normal';
            if (item.important) currentType = 'important';
            if (isRunning) currentType = 'running';

            let pulseAttribute = shouldPulse ? `data-pulse="true" data-type="${currentType}"` : `data-type="${currentType}"`;

            let defaultBorderColor = item.important ? '#ef4444' : 'var(--schedule-accent, #10b981)';
            let defaultBg = item.important ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.05)';

            // 👉 THÊM MỚI: Nếu đang chạy, ghi đè màu viền tím và nền tím nhạt mặc định
            if (isRunning) {
                defaultBorderColor = '#a855f7';
                defaultBg = 'rgba(168, 85, 247, 0.08)';
            }

            let itemStyle = `border-left: 4px solid ${defaultBorderColor}; background: ${defaultBg}; transition: all 0.2s ease;`;
            let textStyle = ''; 

            if (isPassed) {
                itemStyle += ' opacity: 0.5;'; 
                textStyle = 'text-decoration: line-through;'; 
            }

            // 👉 THÊM MỚI: Màu tiêu đề chữ của mốc đang chạy
            let titleColor = item.important ? 'color: #f87171;' : 'color: var(--schedule-accent);';
            if (isRunning) titleColor = 'color: #c084fc;';

            // const prefix = "shouldPulse ? '🚨' :  (isRunning ? '🔥 ' : (item.important ? '⚠️' : '⏰ '))";
            const prefix = '';
            
            let displayDay = dayLabels[localNow.getDay()];
            const displayStartDate = item.date.split('-').reverse().join('/');
            const displayEndDate = (item.endDate || item.date).split('-').reverse().join('/');
            const displayEndTime = item.endTime || item.time || '00:00';

            html += `
            <div class="today-important-item" ${pulseAttribute} style="${itemStyle} margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; padding: 10px; border-radius: 6px;">
                <div style="flex: 1;">
                    <h4 class="pulse-title" style="${textStyle} margin: 0 0 6px 0; ${titleColor} font-size: 14px; transition: color 0.3s ease;">
                        ${prefix} ${displayDay} - ${item.title} 
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px; font-size: 12px; color: var(--text-sub, #aaa); ${textStyle}">
                        <div>🟢 Bắt đầu: <b>${displayStartDate}</b> lúc <b>${item.time}</b></div>
                        <div>🏁 Kết thúc: <b>${displayEndDate}</b> lúc <b>${displayEndTime}</b></div>
                    </div>
                    <p style="margin: 0; white-space: pre-wrap; font-size: 13px; color: var(--text-main);">${item.content || 'Không có nội dung chi tiết'}</p>
                </div>
                <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px; color: var(--danger-color); border-color: rgba(239, 68, 68, 0.2); text-decoration: none; cursor: pointer;" 
                    onclick="deleteTaskFromModal('${group.id}', ${item.originalIndex})">
                    ❌ Xóa
                </button>
            </div>`;
        });
    });

    const modalTitle = getEl('todayImportantModal')?.querySelector('h3');
    if (modalTitle) {
        const d = String(localNow.getDate()).padStart(2, '0');
        const m = String(localNow.getMonth() + 1).padStart(2, '0');
        modalTitle.innerHTML = `📌 ĐẦU LỊCH HÔM NAY (${d}/${m})`;
    }

    const contentBox = getEl('todayImportantContent');
    if (contentBox) { 
        contentBox.innerHTML = html; 
        openModal('todayImportantModal'); 
        initGlobalPulseSystem();
    }
}

// ==========================================================================
// 2. VÒNG LẶP LIÊN TỤC XỬ LÝ CHỚP NHÁY ĐỒNG BỘ TOÀN CỤC (FIX LỖI BẢNG LỊCH CHÍNH)
// ==========================================================================
function initGlobalPulseSystem() {
    if (!window.globalPulseInterval) {
        let stateToggle = false;
        
        window.globalPulseInterval = setInterval(() => {
            // Quét tất cả phần tử đang trong diện được kích hoạt nhấp nháy (cả TR và DIV)
            const pulsingElements = document.querySelectorAll('[data-pulse="true"]');
            
            // 1. KHÔI PHỤC TRẠNG THÁI CHO PHẦN TỬ HẾT HOẶC KHÔNG CÓ DIỆN NHÁY
            const allPossibleItems = document.querySelectorAll('.today-important-item, tbody tr');
            allPossibleItems.forEach(el => {
                if (el.getAttribute('data-pulse') !== 'true') {
                    // Nếu là dòng trong bảng lịch chính (TR)
                    if (el.tagName === 'TR') {
                        // Nếu dòng đó không nháy và không phải dòng đang chạy, xóa màu nền phụ
                        if (!el.querySelector('.schedule-countdown-cell')?.innerHTML.includes('Đang chạy')) {
                            Array.from(el.cells).forEach(cell => {
                                cell.style.backgroundColor = ""; 
                            });
                        }
                    } else {
                        // Nếu là khối div trong Modal
                        el.style.boxShadow = "none";
                        const dataType = el.getAttribute('data-type');
                        
                        // 👉 SỬA ĐỔI LOGIC REVERT MÀU: Phân tách rõ 3 trạng thái của viền và nền
                        if (dataType === 'running') {
                            el.style.backgroundColor = 'rgba(168, 85, 247, 0.08)';
                            el.style.borderLeftColor = '#a855f7';
                            const titleH4 = el.querySelector('.pulse-title');
                            if (titleH4) titleH4.style.color = '#c084fc';
                        } else {
                            const isImp = dataType === 'important' || el.innerHTML.includes('⚠️');
                            el.style.backgroundColor = isImp ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.05)';
                            el.style.borderLeftColor = isImp ? '#ef4444' : 'var(--schedule-accent, #10b981)';
                            const titleH4 = el.querySelector('.pulse-title');
                            if (titleH4) titleH4.style.color = isImp ? '#f87171' : 'var(--schedule-accent)';
                        }
                    }
                }
            });

            // 2. XỬ LÝ HIỆU ỨNG NHÁY ĐỒNG BỘ CHO CÁC DÒNG ĐỦ ĐIỀU KIỆN
            pulsingElements.forEach(el => {
                if (el.style.opacity === "0.5") {
                    if (el.tagName === 'TR') {
                        Array.from(el.cells).forEach(cell => cell.style.backgroundColor = "");
                    } else {
                        el.style.boxShadow = "none";
                    }
                    return; 
                }

                const titleH4 = el.querySelector('.pulse-title');
                const dataType = el.getAttribute('data-type');
                const isImportantType = dataType === 'important' || el.innerHTML.includes('⚠️') || el.classList.contains('important');
                const isRunningType = dataType === 'running' || el.querySelector('.schedule-countdown-cell')?.innerHTML.includes('Đang chạy');

                if (stateToggle) {
                    // --- TRẠNG THÁI BẬT NHÁY ---
                    if (el.tagName === 'TR') {
                        Array.from(el.cells).forEach(cell => {
                            cell.style.backgroundColor = "rgba(239, 68, 68, 0.25)";
                        });
                    } else {
                        el.style.backgroundColor = "rgba(239, 68, 68, 0.3)";
                        el.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.35)";
                        if (titleH4) titleH4.style.color = "#ff4d4d";
                        el.style.borderLeftColor = isRunningType ? '#a855f7' : (isImportantType ? '#ef4444' : 'var(--schedule-accent, #10b981)');
                    }
                } else {
                    // --- TRẠNG THÁI TẮT NHÁY (TRẢ VỀ MÀU NỀN GỐC) ---
                    if (el.tagName === 'TR') {
                        Array.from(el.cells).forEach(cell => {
                            cell.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
                        });
                    } else {
                        // 👉 SỬA ĐỔI: Giữ đúng viền trái màu tím khi tắt chu kỳ nháy đối với mốc đang chạy
                        if (isRunningType) {
                            el.style.backgroundColor = 'rgba(168, 85, 247, 0.08)';
                            el.style.boxShadow = "none";
                            if (titleH4) titleH4.style.color = '#c084fc';
                            el.style.borderLeftColor = '#a855f7';
                        } else {
                            el.style.backgroundColor = isImportantType ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.05)';
                            el.style.boxShadow = "none";
                            if (titleH4) titleH4.style.color = isImportantType ? '#f87171' : 'var(--schedule-accent)';
                            el.style.borderLeftColor = isImportantType ? '#ef4444' : 'var(--schedule-accent, #10b981)';
                        }
                    }
                }
            });
            
            stateToggle = !stateToggle;
        }, 600);
    }
}

function deleteTaskFromModal(groupId, originalIndex) {
    const group = getGroup(groupId);
    if (!group || !group.schedules[originalIndex]) return;

    customConfirm(`Bạn có chắc chắn muốn xóa mốc lịch trình "${group.schedules[originalIndex].title}" trực tiếp khỏi danh sách hôm nay?`, "⚠️ Xác nhận xóa nhanh").then((confirmed) => {
        if (confirmed) {
            group.schedules.splice(originalIndex, 1);
            saveData(); 
            
            const localNow = new Date();
            const today = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(localNow.getDate()).padStart(2, '0')}`;
            let remainingTasks = 0;
            state.dashboardData.forEach(g => {
                if (g.type === 'schedule' && g.schedules) remainingTasks += g.schedules.filter(s => s.date === today).length;
            });

            if (remainingTasks === 0) closeModal('todayImportantModal');
            else showTodayImportantTasks(); 
        }
    });
}

// ==========================================
// 8. ĐỌC / XUẤT FILE EXCEL TIÊU CHUẨN
// ==========================================
// ==========================================
// 8. ĐỌC / XUẤT FILE EXCEL TIÊU CHUẨN (CẬP NHẬT ĐỒNG BỘ BỘ ĐẾM GIỜ)
// ==========================================
function triggerExcelImport(groupId) {
    const fileInput = getEl('excelScheduleInput');
    if (fileInput) fileInput.setAttribute('data-target-group-id', groupId);
    state.activeGroupId = groupId;
    
    const huongDanHTML = `
        <p style="color: var(--text-sub); font-size: 13px; text-align: left; margin-bottom: 15px;">
            Vui lòng chuẩn bị file Excel (.xlsx, .xls, .csv) có cấu trúc các tiêu đề cột (hàng đầu tiên) chính xác như sau để bộ đếm giờ hoạt động:
        </p>
        <div style="overflow-x: auto; margin-bottom: 15px; border: 1px solid var(--border-color); border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
                <thead>
                    <tr style="background: var(--schedule-accent); color: white;">
                        <th style="padding: 6px 8px;">Ngay</th>
                        <th style="padding: 6px 8px;">Gio</th>
                        <th style="padding: 6px 8px;">NgayKetThuc</th>
                        <th style="padding: 6px 8px;">GioKetThuc</th>
                        <th style="padding: 6px 8px;">CongViec</th>
                        <th style="padding: 6px 8px;">QuanTrong</th>
                        <th style="padding: 6px 8px;">NoiDung</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border-color); background: rgba(255,255,255,0.02);">
                        <td style="padding: 6px 8px; color: var(--text-sub);">2026-06-16</td>
                        <td style="padding: 6px 8px; color: var(--text-sub);">08:00</td>
                        <td style="padding: 6px 8px; color: var(--text-sub);">2026-06-16</td>
                        <td style="padding: 6px 8px; color: var(--text-sub);">12:00</td>
                        <td style="padding: 6px 8px;">Họp Core</td>
                        <td style="padding: 6px 8px; color: var(--text-sub);">TRUE</td>
                        <td style="padding: 6px 8px; color: var(--text-sub);">Nội dung...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    const alertBox = getEl('alertModal')?.querySelector('.modal-box');
    if (alertBox) {
        alertBox.style.maxWidth = "600px"; // Tăng nhẹ độ rộng hiển thị đủ các cột mới
        const titleH3 = alertBox.querySelector('h3');
        if (titleH3) {
            titleH3.innerHTML = "📊 Cấu trúc File Excel Đếm Giờ Chuẩn";
            titleH3.style.color = "var(--text-main)";
        }
        
        getEl('alertMessage').innerHTML = huongDanHTML;
        
        const resetAlertModal = () => {
            if (titleH3) {
                titleH3.innerHTML = "⚠️ Thông báo";
                titleH3.style.color = "var(--danger-color)";
            }
            if (gốcBtn) gốcBtn.style.display = 'block';
            alertBox.querySelector('.modal-footer-excel')?.remove();
        };

        const closeX = alertBox.querySelector('.close-modal-x');
        if (closeX) closeX.onclick = () => { closeModal('alertModal'); resetAlertModal(); };
        
        let footer = alertBox.querySelector('.modal-footer-excel');
        if (!footer) {
            footer = document.createElement('div');
            footer.className = 'modal-footer-excel';
            footer.style.display = 'flex';
            footer.style.justifyContent = 'center';
            footer.style.gap = '12px';
            footer.style.marginTop = '20px';
            getEl('alertMessage').after(footer);
        }
        
        const gốcBtn = alertBox.querySelector('.btn-primary');
        if (gốcBtn) gốcBtn.style.display = 'none';

        footer.innerHTML = `
            <button class="btn-secondary" style="background-color: var(--accent-color); color: #fff !important; padding: 10px 16px;" onclick="downloadExcelTemplate()">📥 Tải File Mẫu Mới</button>
            <button class="btn-success" style="padding: 10px 16px;" id="btnConfirmExcelSelect">🎯 Đã hiểu & Chọn File Excel</button>
        `;

        getEl('btnConfirmExcelSelect').onclick = function() {
            closeModal('alertModal');
            resetAlertModal();
            setTimeout(() => { getEl('excelScheduleInput')?.click(); }, 200);
        };
    }
    openModal('alertModal');
}

function downloadExcelTemplate() {
    try {
        // Biểu mẫu cập nhật chuẩn hóa thêm cột thời gian kết thúc phục vụ tính đếm ngược cụ thể
        const sampleData = [
            { 
                "Ngay": "2026-06-16", "Gio": "18:00", 
                "NgayKetThuc": "2026-06-16", "GioKetThuc": "22:00", 
                "CongViec": "Ca Tối GHTK", "QuanTrong": "FALSE", "NoiDung": "Trực vận hành ca tối" 
            },
            { 
                "Ngay": "2026-06-17", "Gio": "08:30", 
                "NgayKetThuc": "2026-06-17", "GioKetThuc": "11:30", 
                "CongViec": "Họp Giao Ban Core", "QuanTrong": "TRUE", "NoiDung": "Báo cáo tiến độ phân loại địa chỉ" 
            }
        ];
        const worksheet = XLSX.utils.json_to_sheet(sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "LichTrinhMau");
        XLSX.writeFile(workbook, "mau_import_lich_trinh_countdown.xlsx");
    } catch (error) {
        console.error(error);
        alert("Có lỗi xảy ra khi tạo file mẫu!");
    }
}

// Lắng nghe sự kiện đổi file excel
getEl('excelScheduleInput')?.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return alert("❌ Chưa chọn được file!");
    if (typeof XLSX === 'undefined') return alert("❌ LỖI HỆ THỐNG: Thư viện đọc Excel chưa được tải!");

    const targetGroupId = this.getAttribute('data-target-group-id') || state.activeGroupId;
    const group = getGroup(targetGroupId);
    if (!group) return alert("❌ Lỗi: Không tìm thấy dữ liệu của nhóm này!");

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: false });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
            const rawData = XLSX.utils.sheet_to_json(firstSheet);
            if (!rawData || rawData.length === 0) return alert("❌ File Excel trống!");
            
            // Hàm helper đồng bộ chuẩn hóa logic parse Giờ trong excel (tránh lặp code)
            const parseExcelTime = (rawTime) => {
                let time = "00:00";
                if (rawTime && String(rawTime).trim() !== "undefined") {
                    let cleanedTime = String(rawTime).toLowerCase().trim();
                    if (!isNaN(cleanedTime) && parseFloat(cleanedTime) > 0 && parseFloat(cleanedTime) < 1) {
                        const totalSeconds = Math.round(parseFloat(cleanedTime) * 24 * 3600);
                        let hours = Math.floor(totalSeconds / 3600);
                        let minutes = Math.floor((totalSeconds % 3600) / 60);
                        time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                    } else {
                        const isPM = cleanedTime.includes('pm') || cleanedTime.includes('ch') || cleanedTime.includes('chiều');
                        const isAM = cleanedTime.includes('am') || cleanedTime.includes('sa') || cleanedTime.includes('sáng');
                        cleanedTime = cleanedTime.replace(/(am|pm|sa|ch|chiều|sáng)/g, '').trim();
                        const timeParts = cleanedTime.split(':');
                        if (timeParts.length >= 2) {
                            let hours = parseInt(timeParts[0], 10);
                            let minutes = parseInt(timeParts[1], 10);
                            if (isPM && hours < 12) hours += 12;
                            if (isAM && hours === 12) hours = 0;
                            time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                        }
                    }
                }
                return time;
            };

            // Hàm helper đồng bộ chuẩn hóa logic parse Ngày trong excel
            const parseExcelDate = (rawDate) => {
                let date = "";
                if (rawDate && String(rawDate).trim() !== "undefined") {
                    let dateStr = String(rawDate).trim().split(' ')[0]; 
                    if (dateStr.includes('/') || dateStr.includes('-')) {
                        const separator = dateStr.includes('/') ? '/' : '-';
                        const parts = dateStr.split(separator);
                        if (parts.length === 3) {
                            if (parts[0].length === 4) {
                                date = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
                            } else {
                                let p0 = parseInt(parts[0], 10);
                                let p1 = parseInt(parts[1], 10);
                                let year = parts[2].length === 2 ? '20' + parts[2] : parts[2]; 
                                if (p0 > 12) { 
                                    date = `${year}-${String(p1).padStart(2, '0')}-${String(p0).padStart(2, '0')}`;
                                } else if (p1 > 12) { 
                                    date = `${year}-${String(p0).padStart(2, '0')}-${String(p1).padStart(2, '0')}`;
                                } else { 
                                    date = `${year}-${String(p1).padStart(2, '0')}-${String(p0).padStart(2, '0')}`;
                                }
                            }
                        }
                    } else if (!isNaN(dateStr) && Number(dateStr) > 0) {
                        const excelDate = XLSX.SSF.parse_date_code(Number(dateStr));
                        date = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`;
                    }
                }
                return date;
            };

            const newSchedules = rawData.map(row => {
                const title = String(row["CongViec"] || row["Congviec"] || row["Công Việc"] || row["Công việc"] || "").trim();
                const content = String(row["NoiDung"] || row["Nội Dung"] || "").trim();
                const rawImportant = row["QuanTrong"] || row["Quan Trọng"];
                const important = rawImportant === true || String(rawImportant).toLowerCase() === 'true';

                // Tiến hành phân tách Đầy đủ Ngày/Giờ Bắt đầu và Ngày/Giờ Kết thúc từ file Excel mới
                let date = parseExcelDate(row["Ngay"] || row["Ngày"]);
                let time = parseExcelTime(row["Gio"] || row["Giờ"]);
                
                let endDate = parseExcelDate(row["NgayKetThuc"] || row["Ngày Kết Thúc"] || row["Ngayketthuc"]);
                let endTime = parseExcelTime(row["GioKetThuc"] || row["Giờ Kết Thúc"] || row["Gioketthuc"]);

                // Fallback nếu người dùng bỏ trống cột ngày bắt đầu
                if (!date) {
                    const d = new Date();
                    date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                }
                // Nếu cột kết thúc bị bỏ trống trong Excel, tự động kế thừa từ mốc bắt đầu
                if (!endDate) endDate = date;
                if (!row["GioKetThuc"] && !row["Giờ Kết Thúc"] && !row["Gioketthuc"]) endTime = time;

                // 👉 SỬA ĐỔI: Tự động chuẩn hóa nếu ngày/giờ kết thúc nhỏ hơn ngày/giờ bắt đầu từ file Excel
                const checkStart = new Date(`${date}T${time}`);
                const checkEnd = new Date(`${endDate}T${endTime}`);
                if (checkEnd < checkStart) {
                    endDate = date;
                    endTime = time;
                }

                const dayLabels = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
                const [y, m, d_part] = date.split('-').map(Number);
                const parsedDate = new Date(y, m - 1, d_part);
                const dayOfWeek = dayLabels[parsedDate.getDay()] || "---";

                return { 
                    title, 
                    date, 
                    time, 
                    endDate, 
                    endTime, 
                    dayOfWeek,
                    content: content === "undefined" ? "" : content, 
                    important, 
                    emoji: important ? "⚠️" : "📅" 
                };
            }).filter(item => item.title && item.date);

            if (newSchedules.length === 0) return alert("❌ Không lọc được mốc lịch hợp lệ!");

            if (!group.schedules) group.schedules = [];
            group.schedules.push(...newSchedules);
            
            group.schedules.sort((a, b) => {
                return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
            });

            saveData();
            if (typeof renderDashboard === 'function') renderDashboard(); else location.reload();
            alert(`📥 Thành công! Đã đồng bộ thêm ${newSchedules.length} lịch có bộ đếm giờ vào hệ thống.`);
        } catch (err) {
            console.error(err);
            alert("Lỗi hệ thống khi phân tích file Excel!");
        } finally {
            event.target.value = ''; 
        }
    };
    reader.readAsArrayBuffer(file);
});

// ==========================================
// 9. LOCAL BACKUP (JSON EXPORT/IMPORT)
// ==========================================
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.dashboardData, null, 2));
    const downloadAnchor = document.createElement('a'); 
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "workspace_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click(); 
    downloadAnchor.remove();
}

function importData(event) {
    const file = event.target.files[0]; 
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) { state.dashboardData = importedData; saveData(); }
        } catch (err) { alert("File không hợp lệ!"); }
    };
    reader.readAsText(file); 
    event.target.value = '';
}

// ==========================================
// 10. ĐỒNG BỘ ĐÁM MÂY GOOGLE DRIVE (GAPI SYSTEM)
// ==========================================
function gapiLoaded() { gapi.load('client', intializeGapiClient); }

async function intializeGapiClient() {
    await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] });
    gapiInited = true;
    checkAuthStates();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({ client_id: CLIENT_ID, scope: SCOPES, callback: '' });
    gisInited = true;
    checkAuthStates();
}

function checkAuthStates() {
    if (gapiInited && gisInited && !gapi.client.getToken()) {
        const savedToken = localStorage.getItem('google_oauth_token');
        if (savedToken) {
            try { gapi.client.setToken(JSON.parse(savedToken)); } catch (e) { localStorage.removeItem('google_oauth_token'); }
        }
    }
    if (gapiInited && gisInited && gapi.client.getToken()) {
        const btnLogin = getEl('btn-login-google');
        if (btnLogin) {
            btnLogin.innerHTML = "🟢 Đã liên kết Google";
            btnLogin.setAttribute('data-tooltip', 'Đã liên kết tài khoản Google / Nhấn lại khi muốn lấy dữ liệu mới');
        }
        getEl('btn-sync-google').style.display = "inline-flex";
    }
}

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) throw (resp);
        const btnLogin = getEl('btn-login-google');
        if (btnLogin) {
            btnLogin.innerHTML = "🟢 Đã liên kết Google";
            btnLogin.setAttribute('data-tooltip', 'Tài khoản Google đã liên kết mượt mà và sẵn sàng!');
        }
        getEl('btn-sync-google').style.display = "inline-flex";
        const token = gapi.client.getToken();
        if (token) localStorage.setItem('google_oauth_token', JSON.stringify(token));
        await fetchFileFromGoogleDrive();
    };
    if (gapi.client.getToken() === null) tokenClient.requestAccessToken({prompt: 'consent'});
    else tokenClient.requestAccessToken({prompt: ''});
}

async function fetchFileFromGoogleDrive() {
    try {
        const response = await gapi.client.drive.files.list({ q: "name = 'workspace_data.json'", spaces: 'appDataFolder', fields: 'files(id, name)' });
        const files = response.result.files;
        if (files && files.length > 0) {
            googleFileId = files[0].id;
            const fileData = await gapi.client.drive.files.get({ fileId: googleFileId, alt: 'media' });
            
            // Lấy dữ liệu trả về từ fileData.result
            const cloudData = fileData.result;

            if (cloudData && Array.isArray(cloudData)) {
                const chotLuaChon = await customConfirm(
                    "Mời bạn lựa chọn phương án xử lý dữ liệu:\n\n👉 Bấm [Đồng ý]: Để tải dữ liệu từ Drive về máy.\n👉 Bấm [Giữ lại]: Để giữ lại dữ liệu máy và lưu đè lên Cloud.", 
                    "⚠️ PHÁT HIỆN XUNG ĐỘT DỮ LIỆU"
                );
                if (chotLuaChon) {
                    state.dashboardData = cloudData;
                    
                    // 👉 ĐOẠN SỬA ĐỔI: Duyệt qua tất cả nhóm, nhóm nào CÓ pinKey thì BẮT BUỘC đặt trạng thái khóa lại ngay lập tức
                    if (Array.isArray(state.dashboardData)) {
                        state.dashboardData.forEach(group => {
                            if (group.pinKey && group.pinKey !== "") {
                                group.isLocked = true; // Luôn luôn khóa khi đồng bộ sang thiết bị mới
                            }
                        });
                    }

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
                    renderDashboard();
                    updateScheduleUI();
                    alert("📥 Tải dữ liệu đám mây thành công!");
                } else {
                    syncToGoogleDrive(false);
                }
            }
        } else {
            syncToGoogleDrive(true);
        }
    } catch (err) { console.error(err); }
}

async function syncToGoogleDrive(isSilent = false) {
    if (!gapi.client.getToken()) return isSilent ? null : alert("Vui lòng liên kết tài khoản Google trước!");
    if(!isSilent) getEl('btn-sync-google').innerHTML = "⏳ Đang sync...";
    const localData = localStorage.getItem(STORAGE_KEY) || JSON.stringify(state.dashboardData);

    try {
        if (!googleFileId) {
            const resList = await gapi.client.drive.files.list({ q: "name = 'workspace_data.json'", spaces: 'appDataFolder' });
            if(resList.result.files?.length > 0) googleFileId = resList.result.files[0].id;
        }
        if (googleFileId) {
            await gapi.client.request({ path: `/upload/drive/v3/files/${googleFileId}`, method: 'PATCH', params: { uploadType: 'media' }, body: localData });
        } else {
            const metadata = { name: 'workspace_data.json', parents: ['appDataFolder'] };
            const boundary = '314159265358979323846';
            const delimiter = `\r\n--${boundary}\r\n`;
            const close_delim = `\r\n--${boundary}--`;
            const multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) + delimiter + 'Content-Type: application/json\r\n\r\n' + localData + close_delim;

            const resCreate = await gapi.client.request({
                path: '/upload/drive/v3/files', method: 'POST', params: { uploadType: 'multipart' },
                headers: { 'Content-Type': `multipart/related; boundary="${boundary}"` }, body: multipartRequestBody
            });
            googleFileId = resCreate.result.id;
        }
        if(!isSilent) alert("📤 Đồng bộ mây Google Drive thành công!");
    } catch (err) {
        if(!isSilent) alert("Lỗi đồng bộ: " + err.message);
    } finally {
        getEl('btn-sync-google').innerHTML = "🔄 Đồng bộ Drive";
    }
}

// ==========================================
// 11. HỆ THỐNG CONTEXT MENU & DRAG-DROP (SORTABLE)
// ==========================================
function buildMoveSubMenuHTML(type, currentGroupId, itemIndex) {
    const targets = state.dashboardData.filter(g => g.type === type && g.id !== currentGroupId);
    if (targets.length === 0) return '';
    return `
        <div class="move-submenu-container" style="position: relative;" 
             onmouseenter="this.querySelector('.sub-items').style.display='block'" 
             onmouseleave="this.querySelector('.sub-items').style.display='none'">
            <div class="context-menu-item">🔄 Đổi group</div>
            <div class="sub-items" style="display: none; position: absolute; left: 100%; top: 0; background: var(--context-bg); border: 1px solid var(--border-color); border-radius: 8px; width: 180px; box-shadow: var(--shadow-main); z-index: 2500;">
                ${targets.map(g => `
                    <div class="context-menu-item" onclick="event.stopPropagation(); moveItem('${type}', '${currentGroupId}', ${itemIndex}, '${g.id}')">
                        ${g.emoji && g.emoji !== 'NONE' ? g.emoji : '📁'} ${g.title}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function openContextMenu(e, targetType, groupId, index = null) {
    e.preventDefault(); 
    e.stopPropagation();
    state.activeGroupId = groupId; 
    state.activeIndex = index;

    const menu = getEl('customContextMenu');
    const menuContent = getEl('menuItemsContent');
    menu.style.display = 'none'; 
    menuContent.innerHTML = '';

    // Lấy thông tin group để kiểm tra trạng thái khóa linh hoạt
    const currentGroup = state.dashboardData.find(g => g.id === groupId);
    const hasPinKey = currentGroup && currentGroup.pinKey && currentGroup.pinKey !== "";
    const isLocked = currentGroup && currentGroup.isLocked;

    let lockMenuHTML = '';
    if (hasPinKey) {
        lockMenuHTML = `
            <div class="context-menu-divider"></div>
            ${!isLocked ? `<div class="context-menu-item" onclick="quickLockGroup('${groupId}')">🔒 Khóa lại nhóm</div>` : ''}
            <div class="context-menu-item" onclick="handleLockMenuAction('${groupId}')">🔓 Gỡ bỏ Mã Khóa</div>
        `;
    } else {
        lockMenuHTML = `
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" onclick="handleLockMenuAction('${groupId}')">🔒 Thiết lập Mã Khóa</div>
        `;
    }

    const actions = {
        'group-link': `
            <div class="context-menu-item" onclick="openLinkModal('${groupId}')">➕ Thêm nút bấm link</div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" onclick="openGroupModal('${groupId}', 'link')">📝 Sửa tên nhóm</div>
            <div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>
            ${lockMenuHTML}`,
        'group-note': `
            <div class="context-menu-item" onclick="openNoteModal('${groupId}')">➕ Thêm nút ghi chú</div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" onclick="openGroupModal('${groupId}', 'note')">📝 Sửa tên nhóm</div>
            <div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>
            ${lockMenuHTML}`,
        'group-schedule': `
            <div class="context-menu-item" onclick="openScheduleModal('${groupId}')">➕ Thêm mốc lịch trình</div>
            <div class="context-menu-item" onclick="triggerExcelImport('${groupId}')">📥 Import từ Excel</div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" onclick="openGroupModal('${groupId}', 'schedule')">📝 Sửa tên nhóm</div>
            <div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>
            ${lockMenuHTML}`,
        'link': `
            <div class="context-menu-item" onclick="duplicateItem('link', '${groupId}', ${index})">✨ Nhân bản nút</div>
            ${buildMoveSubMenuHTML('link', groupId, index)}
            <div class="context-menu-item" onclick="openLinkModal('${groupId}', ${index})">📝 Chỉnh sửa nút</div>
            <div class="context-menu-item delete" onclick="triggerDelete('Link')">❌ Xóa nút bấm này</div>`,
        'note': `
            <div class="context-menu-item" onclick="duplicateItem('note', '${groupId}', ${index})">✨ Nhân bản ghi chú</div>
            ${buildMoveSubMenuHTML('note', groupId, index)}
            <div class="context-menu-item" onclick="openNoteModal('${groupId}', ${index})">📝 Chỉnh sửa ghi chú</div>
            <div class="context-menu-item delete" onclick="triggerDelete('Note')">❌ Xóa ghi chú này</div>`,
        'schedule': `
            <div class="context-menu-item" onclick="duplicateItem('schedule', '${groupId}', ${index})">✨ Nhân bản mốc lịch</div>
            ${buildMoveSubMenuHTML('schedule', groupId, index)}
            <div class="context-menu-item" onclick="openScheduleModal('${groupId}', ${index})">📝 Chỉnh sửa mốc lịch</div>
            <div class="context-menu-item delete" onclick="triggerDelete('Schedule')">❌ Xóa mốc lịch này</div>`
    };

    if (actions[targetType]) {
        menuContent.innerHTML = actions[targetType];
        Object.assign(menu.style, { display: 'block', left: `${e.pageX}px`, top: `${e.pageY}px` });
    }
}

function initDragAndDrop() {
    if (typeof Sortable === 'undefined') return;
    
    // Kiểm tra chính xác thiết bị di động/cảm ứng
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // 1. KÉO THẢ GROUP (Thao tác trên khối nhóm lớn)
    const groupsContainer = getEl('groupsContainer');
    if (groupsContainer) {
        // Hủy Sortable cũ nếu có để tránh trùng lặp sự kiện khi render lại
        if (Sortable.get(groupsContainer)) {
            Sortable.get(groupsContainer).destroy();
        }

        Sortable.create(groupsContainer, {
            animation: 200, 
            ghostClass: 'sortable-ghost-group', 
            handle: '.group-title', // Chỉ cho kéo khi giữ vào tiêu đề nhóm
            forceFallback: isMobile, 
            fallbackClass: 'sortable-fallback', 
            fallbackTolerance: isMobile ? 10 : 5, // Tăng độ trễ di chuyển ngón tay trên mobile để phân biệt với cuộn trang
            onEnd: () => {
                const cardElements = document.querySelectorAll('#groupsContainer .group-card');
                const newOrderIds = Array.from(cardElements).map(card => card.getAttribute('data-id'));
                state.dashboardData.sort((a, b) => newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id));
                saveData(); // Lưu lại và render giao diện mới
            }
        });
    }

    // 2. KÉO THẢ PHẦN TỬ CON (Các đường Link, Ghi chú bên trong Group)
    document.querySelectorAll('.links-area, .notes-area, .schedules-area').forEach(area => {
        const groupId = area.getAttribute('data-group-id');
        const type = area.classList.contains('links-area') ? 'link' : (area.classList.contains('notes-area') ? 'note' : 'schedule');
        
        if (type === 'schedule') return; // Bỏ qua lịch trình nếu bạn không cấu hình kéo thả

        // Hủy Sortable cũ trên vùng area này nếu có
        if (Sortable.get(area)) {
            Sortable.get(area).destroy();
        }

        Sortable.create(area, {
            animation: 150, 
            ghostClass: 'sortable-ghost-link', 
            delay: isMobile ? 300 : 0, // QUAN TRỌNG TRÊN MOBILE: Nhấn giữ 300ms mới cho kéo để người dùng vẫn cuộn trang được
            delayOnTouchOnly: true, 
            forceFallback: isMobile, 
            fallbackTolerance: 4, 
            onEnd: () => {
                const group = getGroup(groupId); 
                if (!group) return;

                // Cách lấy dữ liệu mới an toàn tuyệt đối, không phụ thuộc vào giá trị cũ của 'data-index'
                const items = Array.from(area.children);
                const keyProperty = `${type}s`; // Tạo chuỗi 'links' hoặc 'notes'
                
                // Tạo một mảng tạm thời mới sắp xếp theo thứ tự hiển thị thực tế của HTML
                const newItemsOrdered = items.map(item => {
                    const originalIndex = parseInt(item.getAttribute('data-index'));
                    return group[keyProperty][originalIndex];
                }).filter(Boolean); // Loại bỏ các phần tử lỗi hoặc null nếu có

                // Cập nhật lại mảng gốc của Group
                group[keyProperty] = newItemsOrdered;
                
                saveData(); // Lưu cấu trúc mới, hàm này tự động gọi renderDashboard() để làm mới data-index
            }
        });
    });
}
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ==========================================
// 12. QUẢN LÝ SỰ KIỆN GẮN VÀO WINDOW (LISTENERS & LIFE-CYCLE)
// ==========================================

// Sự kiện Scroll chuột & Đóng Menu ngữ cảnh toàn cục
window.addEventListener('scroll', () => {
    const btn = getEl("backToTop");
    if (btn) btn.style.display = (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) ? "block" : "none";
});

window.addEventListener('click', () => {
    const ctxMenu = getEl('customContextMenu');
    if (ctxMenu) ctxMenu.style.display = 'none';
});

window.addEventListener('resize', resizeCanvas);

// Thiết lập Long Press (Nhấn giữ) trên thiết bị di động
// Thiết lập Long Press (Nhấn giữ) trên thiết bị di động
document.addEventListener('touchstart', e => {
    // SỬA LỖI: Thêm '.schedule-row' vào danh sách kiểm tra phần tử được bấm
    const target = e.target.closest('.link-button, .note-button, .schedule-button, .schedule-row, .group-card');
    if (!target) return;

    pressTimer = setTimeout(() => {
        let groupId = null, index = null, targetType = null;
        const card = target.closest('.group-card');
        if (!card) return;
        groupId = card.dataset.id;

        if (target.classList.contains('link-button')) {
            index = parseInt(target.parentElement.dataset.index); 
            targetType = 'link';
        } else if (target.classList.contains('note-button')) {
            index = parseInt(target.parentElement.dataset.index); 
            targetType = 'note';
        } else if (target.classList.contains('schedule-button')) {
            index = parseInt(target.parentElement.dataset.index); 
            targetType = 'schedule';
        } else if (target.classList.contains('schedule-row')) {
            // SỬA LỖI: Trích xuất chính xác thuộc tính index của hàng lịch trình
            const rows = Array.from(target.parentElement.children);
            index = rows.indexOf(target);
            targetType = 'schedule';
        } else {
            targetType = `group-${getGroup(groupId).type}`;
        }

        // Kích hoạt Menu ngữ cảnh tại vị trí ngón tay chạm
        openContextMenu({
            preventDefault(){}, stopPropagation(){},
            pageX: e.touches[0].pageX, pageY: e.touches[0].pageY
        }, targetType, groupId, index);
    }, 500);
}, { passive: true }); // Tối ưu hiệu năng cuộn trên mobile
document.addEventListener('touchend', () => clearTimeout(pressTimer));
document.addEventListener('touchmove', () => clearTimeout(pressTimer));

// Life-cycle chính kích hoạt khi tải trang hoàn tất
window.addEventListener('load', () => {
    // TỰ ĐỘNG KHÓA LẠI TẤT CẢ CÁC CARD CÓ ĐẶT PIN KEY KHI KHỞI ĐỘNG TRANG ĐỂ BẢO MẬT
    if (state && Array.isArray(state.dashboardData)) {
        state.dashboardData.forEach(group => {
            if (group.pinKey && group.pinKey !== "") {
                group.isLocked = true;
            }
        });
    }

    if (localStorage.getItem(THEME_KEY) === 'light') document.body.classList.add('light-mode');
    
    // Kích hoạt canvas nền
    resizeCanvas();
    drawBackground();
    
    // Khởi tạo hiển thị dữ liệu
    renderDashboard();
    updateScheduleUI();
    
    // Yêu cầu quyền Notification nếu chưa xác nhận
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
    
    // Vòng lặp kiểm tra mốc lịch trình (30 giây một lần)
    setInterval(updateScheduleUI, 30000);
    
    // Hẹn giờ check trạng thái mạng / tài khoản Google & nhắc lịch hôm nay
    setTimeout(() => { checkAuthStates(); }, 500);
    setTimeout(showTodayImportantTasks, 300);
});
// ==========================================================================
// LOGIC BẢO MẬT KHÓA GROUP BẰNG KEY VÀ ĐỒNG BỘ ĐÁM MÂY
// ==========================================================================

let keyModalContext = {
    action: 'unlock', // 'setup_lock', 'remove_lock', 'unlock'
    targetGroupId: null
};

// Hàm ẩn / hiện ký tự khi nhập mã khóa trên Modal
function toggleKeyVisibility() {
    const input = document.getElementById('groupKeyInput');
    const btn = document.getElementById('toggleKeyVisibility');
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

// Hàm mở modal viết riêng theo chuẩn đóng mở modal của bạn
function openKeySystemModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}
function closeKeySystemModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// Xử lý khi bấm chức năng Khóa/Mở từ Context Menu chuột phải
function handleLockMenuAction(groupId) {
    // Ẩn context menu chuột phải theo đúng cách code hiện tại của bạn đang dùng
    document.getElementById('customContextMenu').style.display = 'none';
    
    const group = state.dashboardData.find(g => g.id === groupId);
    if (!group) return;

    const input = document.getElementById('groupKeyInput');
    input.value = "";
    clearKeyError();
    // ngay sau đoạn định nghĩa input.value = "";
    document.getElementById('groupKeyInput').onkeydown = function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitKeyForm();
        }
    };
    input.type = 'password';
    document.getElementById('toggleKeyVisibility').textContent = '👁️';
    
    keyModalContext.targetGroupId = groupId;

    if (group.pinKey && group.pinKey !== "") {
        keyModalContext.action = 'remove_lock';
        document.getElementById('keyModalTitle').textContent = '🔓 Hủy bỏ khóa nhóm';
        document.getElementById('keyModalDesc').textContent = 'Vui lòng nhập mã khóa hiện tại để gỡ bỏ tính năng bảo mật.';
        openKeySystemModal('keyModal');
    } else {
        keyModalContext.action = 'setup_lock';
        document.getElementById('keyModalTitle').textContent = '🔒 Thiết lập Mã Khóa Mới';
        document.getElementById('keyModalDesc').textContent = 'Tạo mã bảo vệ cho nhóm này. Cấu hình sẽ được tự động đồng bộ.';
        openKeySystemModal('keyModal');
    }
}

// Kích hoạt khi click vào nút "Nhấn để mở khóa" phủ trên card bị mờ
function triggerUnlockGroup(groupId) {
    keyModalContext.targetGroupId = groupId;
    keyModalContext.action = 'unlock';
    
    const input = document.getElementById('groupKeyInput');
    input.value = "";
    clearKeyError();
    document.getElementById('groupKeyInput').onkeydown = function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitKeyForm();
        }
    };
    input.type = 'password';
    document.getElementById('toggleKeyVisibility').textContent = '👁️';
    
    document.getElementById('keyModalTitle').textContent = '🔒 Nhập Mã Khóa';
    document.getElementById('keyModalDesc').textContent = 'Nhóm này đang được khóa. Vui lòng xác thực mã để truy cập.';
    openKeySystemModal('keyModal');
}

// Xử lý khi nhấn nút "Xác nhận" trên Modal Key
function submitKeyForm() {
    clearKeyError();
    const keyInput = document.getElementById('groupKeyInput').value.trim();
    if (!keyInput) {
        showKeyError("Vui lòng nhập mã khóa.");
        return;
    }
    
    // Mã hóa Base64 đơn giản nhằm tránh lưu text thô trực quan dưới client máy tính
    const hashedKey = btoa(unescape(encodeURIComponent(keyInput)));
    const group = state.dashboardData.find(g => g.id === keyModalContext.targetGroupId);
    
    if (!group) return;

    if (keyModalContext.action === 'setup_lock') {
        group.pinKey = hashedKey;
        group.isLocked = true; // Thiết lập xong đưa về trạng thái khóa ngay
        alert("Đã thiết lập mã khóa nhóm thành công!");
    } 
    else if (keyModalContext.action === 'remove_lock') {
        if (group.pinKey === hashedKey) {
            group.pinKey = "";
            group.isLocked = false;
            alert("Đã gỡ bỏ mã bảo vệ nhóm!");
        } else {
            showKeyError("Mã khóa không chính xác.");
            return;
        }
    } 
    else if (keyModalContext.action === 'unlock') {
        if (group.pinKey === hashedKey) {
            group.isLocked = false; // Giải phóng khóa tạm thời trên session làm việc hiện tại
        } else {
            showKeyError("Mã khóa sai. Vui lòng thử lại.");
            return;
        }
    }
    clearKeyError();
    closeKeySystemModal('keyModal');
    // Thực hiện lưu trữ đồng bộ chính xác theo cấu trúc gốc của bạn
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    syncToGoogleDrive(true); // Đồng bộ đám mây
    renderDashboard();       // Render cập nhật trạng thái hiển thị
}

// Hàm khóa lại nhóm ngay lập tức mà không cần F5 trang
function quickLockGroup(groupId) {
    const group = state.dashboardData.find(g => g.id === groupId);
    if (group && group.pinKey) {
        group.isLocked = true; // Chuyển trạng thái về khóa
        saveData(); // Lưu lại trạng thái và renderDashboard() tự động làm mờ nội dung
        if (typeof closeContextMenu === 'function') closeContextMenu();
        else document.getElementById('customContextMenu').style.display = 'none';
    }
}

function showKeyError(message) {
    const err = document.getElementById("keyErrorMessage");
    err.textContent = message;
    err.style.display = "block";
}

function clearKeyError() {
    const err = document.getElementById("keyErrorMessage");
    err.textContent = "";
    err.style.display = "none";
}


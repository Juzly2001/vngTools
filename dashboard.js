// ==========================================
// BACKGROUND CANVAS: KHÔNG GIAN NGHỆ THUẬT NÂNG CẤP
// ==========================================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let animationFrameId;
let stars = [];        // Dành cho vệt sao băng (Shooting stars)
let backgroundStars = []; // Dành cho sao nền lấp lánh (Twinkling stars)
let clouds = [];

// Tự động điều chỉnh kích thước Canvas toàn màn hình
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initBackgroundObjects();
}

// Khởi tạo các đối tượng dựa theo theme hiện tại
function initBackgroundObjects() {
    const isLightMode = document.body.classList.contains('light-mode');
    stars = [];
    backgroundStars = [];
    clouds = [];

    if (!isLightMode) {
        // 1. Tạo lớp SAO NỀN LẤP LÁNH (Tạo chiều sâu vũ trụ)
        for (let i = 0; i < 100; i++) {
            backgroundStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.2 + 0.3,
                opacity: Math.random() * 0.7 + 0.2,
                factor: Math.random() > 0.5 ? 1 : -1,
                speed: Math.random() * 0.02 + 0.005 // Tốc độ lấp lánh
            });
        }

        // 2. Tạo lớp SAO BĂNG RƠI NGHỆ THUẬT (Tốc độ vừa phải, thanh mảnh)
        for (let i = 0; i < 15; i++) { // Giảm số lượng để tránh bị rối mắt
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 30 + 15,
                speed: Math.random() * 1.5 + 1.0, // Giảm tốc độ giúp chuyển động mượt màng hơn
                opacity: Math.random() * 0.5 + 0.2,
                width: Math.random() * 1 + 0.5
            });
        }
    } else {
        // NÂNG CẤP: Vẽ nhiều mây hơn (8 đám) và phân lớp ngẫu nhiên nhìn tự nhiên hơn
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

// Hàm vẽ đám mây mềm mại chân thật (Light Mode)
function drawRealisticCloud(ctx, cloud) {
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
    cloud.offsets.forEach(offset => {
        ctx.arc(cloud.x + offset.rx, cloud.y + offset.ry, offset.r, 0, Math.PI * 2);
    });
    ctx.fill();
}

// Hàm vẽ và cập nhật hiệu ứng liên tục (Đã gộp và sửa đổi tối ưu)
function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLightMode = document.body.classList.contains('light-mode');

    if (!isLightMode) {
        // --- NÂNG CẤP NỀN KHÔNG GIAN (DARK MODE) ---
        
        // 1. Vẽ các ngôi sao nền lấp lánh (Twinkling Effect)
        backgroundStars.forEach(bStar => {
            bStar.opacity += bStar.speed * bStar.factor;
            if (bStar.opacity > 0.9 || bStar.opacity < 0.1) {
                bStar.factor *= -1; // Đảo chiều tăng/giảm độ sáng
            }
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${bStar.opacity})`;
            ctx.arc(bStar.x, bStar.y, bStar.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. Vẽ sao băng chuyển động chéo nghệ thuật (Shooting Stars)
        stars.forEach(star => {
            // Tạo hiệu ứng vệt sáng mờ dần (Gradient đuôi sao)
            let grad = ctx.createLinearGradient(
                star.x, star.y, 
                star.x + star.length * 0.6, star.y - star.length * 0.8
            );
            grad.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = star.width;
            ctx.lineCap = 'round';
            ctx.moveTo(star.x, star.y);
            // Hướng vệt nghiêng tự nhiên từ góc trên bên phải xuống góc dưới bên trái
            ctx.lineTo(star.x - star.length * 0.6, star.y + star.length * 0.8);
            ctx.stroke();

            // Cập nhật vị trí mượt mà
            star.y += star.speed * 0.8;
            star.x -= star.speed * 0.6;

            // Xử lý tái sinh thông minh để CHỐNG DỒN BÊN TRÁI
            if (star.y > canvas.height || star.x < -star.length) {
                // Phân bổ 50% xuất hiện ở mép trên, 50% xuất hiện ở mép phải
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
        // --- HIỆU ỨNG MÂY BAY NÂNG CẤP (LIGHT MODE) ---
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
    animationFrameId = requestAnimationFrame(drawBackground);
}

// Gắn bộ lắng nghe sự kiện duy nhất
window.addEventListener('resize', resizeCanvas);

// Kích hoạt khởi chạy hệ thống màn hình nền
resizeCanvas();
drawBackground();

// ĐÃ SỬA: Sao lưu alert gốc của trình duyệt để tránh lặp vô hạn (Call Stack Exceeded)
window.alert.__native__ = window.alert;

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
        // ĐÃ SỬA: Gọi đúng alert gốc đã backup
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

const getEl = id => document.getElementById(id);
const getGroup = id => state.dashboardData.find(g => g.id === id);

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    renderDashboard();
    updateScheduleUI();
    
    if (gapiInited && gisInited && gapi.client.getToken()) {
        syncToGoogleDrive(true); 
    }
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
        if (titleEl) titleEl.innerText = `📂 Tạo ${typeTexts[defaultType] || 'Nhóm'} Mới`;
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

function addScheduleBlock(data = null) {
    const wrapper = getEl('scheduleBlocksWrapper');
    if (!wrapper) return;
    const blockId = `block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const localNow = new Date();
    const currentYear = localNow.getFullYear();
    const currentMonth = String(localNow.getMonth() + 1).padStart(2, '0');
    const currentDay = String(localNow.getDate()).padStart(2, '0');
    
    const defaultDate = `${currentYear}-${currentMonth}-${currentDay}`;
    const defaultTime = `${String(localNow.getHours()).padStart(2, '0')}:${String(localNow.getMinutes()).padStart(2, '0')}`;

    const blockDiv = document.createElement('div');
    blockDiv.className = 'schedule-block-item';
    blockDiv.id = blockId;

    blockDiv.innerHTML = `
        <div class="schedule-block-header">
            <label class="important-checkbox-label">
                <input type="checkbox" class="sch-important-cb" ${data?.important ? 'checked' : ''}> ⚠️ Mốc lịch này Quan Trọng
            </label>
            <button type="button" class="btn-remove-block" onclick="removeScheduleBlock('${blockId}')">Xóa mốc này</button>
        </div>
        <label>Tên nút mốc thời gian:</label>
        <input type="text" class="sch-title-input" placeholder="Ví dụ: Họp phòng ban..." value="${data?.title || ''}">
        <div class="datetime-row">
            <div>
                <label>Chọn Ngày Áp Dụng:</label>
                <input type="date" class="sch-date-input" value="${data?.date || defaultDate}">
            </div>
            <div>
                <label>Chọn Giờ Bắt Đầu:</label>
                <input type="time" class="sch-time-input" value="${data?.time || defaultTime}">
            </div>
        </div>
        <label>📋 Danh sách các đầu việc cần làm:</label>
        <textarea class="sch-content-input" placeholder="Nhập các chi tiết...">${data?.content || ''}</textarea>
        <input type="hidden" class="sch-emoji-hidden" value="${data?.emoji || '📅'}">
    `;
    wrapper.appendChild(blockDiv);
    wrapper.scrollTop = wrapper.scrollHeight;
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

    const blocksData = Array.from(blockElements).map(block => {
        const title = block.querySelector('.sch-title-input').value.trim();
        const date = block.querySelector('.sch-date-input').value;
        const time = block.querySelector('.sch-time-input').value;
        const content = block.querySelector('.sch-content-input').value;
        const important = block.querySelector('.sch-important-cb').checked;
        const hiddenEmoji = block.querySelector('.sch-emoji-hidden').value;

        if (!title || !date || !time) hasError = true;
        return { title, date, time, content, important, emoji: state.isEditMode ? hiddenEmoji : (important ? "⚠️" : "📅") };
    });

    if (hasError) {
        alert("Vui lòng điền đầy đủ: Tiêu đề, Ngày và Giờ!");
        return;
    }

    if (state.isEditMode) {
        group.schedules[state.activeIndex] = blocksData[0];
    } else {
        group.schedules.push(...blocksData);
    }

    group.schedules.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    saveData();
    closeModal('scheduleModal');
}

function updateScheduleUI() {
    const now = new Date();
    const currentYear = now.getFullYear(); 

    const rows = document.querySelectorAll('.schedule-table tbody tr');

    rows.forEach(row => {
        const dateCell = row.cells[0]?.innerText.trim(); 
        const timeCell = row.cells[1]?.innerText.trim(); 
        const jobCell = row.querySelector('.job-title-text')?.innerText.trim() || row.cells[2]?.innerText.trim();  

        if (!dateCell || !timeCell) return;

        const [day, month] = dateCell.split('/').map(Number);
        const [hours, minutes] = timeCell.split(':').map(Number);
        
        const scheduleTime = new Date(currentYear, month - 1, day, hours, minutes);
        const diffMs = scheduleTime - now; 
        const diffMinutes = Math.floor(diffMs / 60000);

        row.style.display = ""; 
        row.style.textDecoration = "none";
        row.classList.remove('highlight-warning', 'blink-effect');
        row.querySelector('.countdown-badge')?.remove();

        if (diffMs < -60000) {
            row.style.textDecoration = "line-through";
            Array.from(row.cells).forEach(cell => {
                cell.style.opacity = "0.45"; 
                cell.style.color = "var(--text-sub)";
            });
        }
        else if (diffMinutes >= -1 && diffMinutes <= 30) {
            row.classList.add('highlight-warning', 'blink-effect'); 
            
            Array.from(row.cells).forEach(cell => {
                cell.style.opacity = "1";
                cell.style.color = ""; 
            });
            
            if (diffMinutes <= 30 && Notification.permission === "granted" && !row.dataset.notified) {
                new Notification("🚨 SẮP ĐẾN MỐC HẸN!", {
                    body: `Lịch: ${jobCell} lúc ${timeCell} hôm nay (${dateCell}).`,
                });
                row.dataset.notified = "true";
            }
        } 
        else {
            Array.from(row.cells).forEach(cell => {
                cell.style.opacity = "1";
                cell.style.color = ""; 
            });
        }
    });
}

if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
}

updateScheduleUI();
setInterval(updateScheduleUI, 30000);

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
        const displayDate = schObj.date.split('-').reverse().join('/');

        titleEl.innerHTML = schObj.important ? `⚠️ [QUAN TRỌNG] ${schObj.title}` : `📅 Lịch Trình: ${schObj.title}`;
        bodyEl.innerHTML = `
            <div class="single-schedule-detail">
                <h4>${schObj.title}</h4>
                <div class="schedule-info-line">⏰ Thời gian: <b>${displayDate} vào lúc ${schObj.time}</b></div>
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

function openContextMenu(e, targetType, groupId, index = null) {
    e.preventDefault(); 
    e.stopPropagation();
    state.activeGroupId = groupId; 
    state.activeIndex = index;

    const menu = getEl('customContextMenu');
    const menuContent = getEl('menuItemsContent');
    menu.style.display = 'none'; 
    menuContent.innerHTML = '';

    const actions = {
        'group-link': `
            <div class="context-menu-item" onclick="openLinkModal('${groupId}')">➕ Thêm nút bấm link</div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" onclick="openGroupModal('${groupId}', 'link')">📝 Sửa tên nhóm</div>
            <div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>`,
        'group-note': `
            <div class="context-menu-item" onclick="openNoteModal('${groupId}')">➕ Thêm nút ghi chú</div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" onclick="openGroupModal('${groupId}', 'note')">📝 Sửa tên nhóm</div>
            <div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>`,
        'group-schedule': `
            <div class="context-menu-item" onclick="openScheduleModal('${groupId}')">➕ Thêm mốc lịch trình</div>
            <div class="context-menu-item" onclick="triggerExcelImport('${groupId}')">📥 Import từ Excel</div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" onclick="openGroupModal('${groupId}', 'schedule')">📝 Sửa tên nhóm</div>
            <div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>`,
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

document.addEventListener('click', () => getEl('customContextMenu').style.display = 'none');

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

function triggerExcelImport(groupId) {
    const fileInput = getEl('excelScheduleInput');
    if (fileInput) {
        fileInput.setAttribute('data-target-group-id', groupId);
    }
    state.activeGroupId = groupId;
    
    const huongDanHTML = `
        <p style="color: var(--text-sub); font-size: 13px; text-align: left; margin-bottom: 15px;">
            Vui lòng chuẩn bị file Excel (.xlsx, .xls, .csv) có các <b>tiêu đề cột ở hàng đầu tiên</b> chính xác như bảng sau:
        </p>
        <div style="overflow-x: auto; margin-bottom: 15px; border: 1px solid var(--border-color); border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
                <thead>
                    <tr style="background: var(--schedule-accent); color: white;">
                        <th style="padding: 6px 8px;">Ngay</th>
                        <th style="padding: 6px 8px;">Gio</th>
                        <th style="padding: 6px 8px;">CongViec</th>
                        <th style="padding: 6px 8px;">QuanTrong</th>
                        <th style="padding: 6px 8px;">NoiDung</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border-color); background: rgba(255,255,255,0.02);">
                        <td style="padding: 6px 8px; color: var(--text-sub);">dd-mm-yyyy<br><small>(hoặc dd/mm/yyyy)</small></td>
                        <td style="padding: 6px 8px; color: var(--text-sub);">17:00</td>
                        <td style="padding: 6px 8px;">Trực Ca</td>
                        <td style="padding: 6px 8px; color: var(--text-sub);">TRUE/FALSE</td>
                        <td style="padding: 6px 8px; color: var(--text-sub);">Trực ca tối</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    const alertBox = getEl('alertModal')?.querySelector('.modal-box');
    if (alertBox) {
        alertBox.style.maxWidth = "550px";
        const titleH3 = alertBox.querySelector('h3');
        if (titleH3) {
            titleH3.innerHTML = "📊 Cấu trúc File Excel Chuẩn";
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
        if (closeX) {
            closeX.onclick = function() {
                closeModal('alertModal');
                resetAlertModal();
            };
        }
        
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
            <button class="btn-secondary" style="background-color: var(--accent-color); color: #fff !important; padding: 10px 16px;" onclick="downloadExcelTemplate()">📥 Tải File Mẫu</button>
            <button class="btn-success" style="padding: 10px 16px;" id="btnConfirmExcelSelect">🎯 Đã hiểu & Chọn File Excel</button>
        `;

        getEl('btnConfirmExcelSelect').onclick = function() {
            closeModal('alertModal');
            resetAlertModal();
            
            setTimeout(() => {
                const fileInput = document.getElementById('excelScheduleInput');
                if (fileInput) {
                    fileInput.click();
                } else {
                    alert("❌ Không tìm thấy thẻ HTML có id='excelScheduleInput'!");
                }
            }, 200);
        };
    }
    
    openModal('alertModal');
}

function downloadExcelTemplate() {
    try {
        const sampleData = [
            { "Ngay": "2026-06-09", "Gio": "17:00", "CongViec": "Trực Ca", "QuanTrong": "FALSE", "NoiDung": "Trực ca tối" },
            { "Ngay": "10/06/2026", "Gio": "07:00", "CongViec": "Đi chơi", "QuanTrong": "TRUE", "NoiDung": "Cuộc hẹn quan trọng" }
        ];

        const worksheet = XLSX.utils.json_to_sheet(sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "LichTrinhMau");

        XLSX.writeFile(workbook, "mau_import_lich_trinh.xlsx");
    } catch (error) {
        console.error("Lỗi khi tải file mẫu:", error);
        alert("Có lỗi xảy ra khi tạo file mẫu!");
    }
}

getEl('excelScheduleInput')?.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("❌ Chưa chọn được file!");
        return;
    }
    
    console.log(">>> Đã nhận file:", file.name);

    if (typeof XLSX === 'undefined') {
        alert("❌ LỖI HỆ THỐNG: Thư viện đọc Excel chưa được tải!");
        return;
    }

    const targetGroupId = this.getAttribute('data-target-group-id') || state.activeGroupId;
    console.log(">>> Target Group ID:", targetGroupId);

    if (!targetGroupId) {
        alert("❌ Lỗi: Không xác định được nhóm lịch cần import!");
        return;
    }

    const group = getGroup(targetGroupId);
    if (!group) {
        alert("❌ Lỗi: Không tìm thấy dữ liệu của nhóm này!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            console.log(">>> FileReader bắt đầu đọc nội dung...");
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rawData = XLSX.utils.sheet_to_json(firstSheet);
            
            console.log(">>> Dữ liệu thô đọc từ Excel:", rawData);

            if (!rawData || rawData.length === 0) {
                alert("❌ File Excel trống hoặc không đúng định dạng!");
                return;
            }
            
            const newSchedules = rawData.map((row, index) => {
                const title = String(row["CongViec"] || row["Congviec"] || row["Công Việc"] || row["Công việc"] || "").trim();
                let rawDate = row["Ngay"] || row["Ngày"];
                const time = String(row["Gio"] || row["Giờ"] || "").trim();
                const content = String(row["NoiDung"] || row["Nội Dung"] || "").trim();
                const rawImportant = row["QuanTrong"] || row["Quan Trọng"];
                const important = rawImportant === true || String(rawImportant).toLowerCase() === 'true';

                let date = "";
                if (rawDate instanceof Date && !isNaN(rawDate)) {
                    const utcDate = new Date(rawDate.getTime() + rawDate.getTimezoneOffset() * 60000);
                    const y = utcDate.getFullYear();
                    const m = String(utcDate.getMonth() + 1).padStart(2, '0');
                    const d = String(utcDate.getDate()).padStart(2, '0');
                    date = `${y}-${m}-${d}`;
                } else {
                    date = String(rawDate || "").trim();
                    if (date.includes('/')) {
                        const parts = date.split('/');
                        if (parts.length === 3) date = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                        else if (parts.length === 2) date = `2026-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                    }
                }

                return { title, date, time, content: content === "undefined" ? "" : content, important, emoji: important ? "⚠️" : "📅" };
            }).filter(item => item.title && item.date && item.date !== "undefined" && item.time);

            console.log(">>> Dữ liệu sau khi lọc chuẩn hóa:", newSchedules);

            if (newSchedules.length === 0) {
                alert("❌ Không lọc được mốc lịch hợp lệ! Hãy kiểm tra lại tên cột (Ngay, Gio, CongViec) trong file.");
                return;
            }

            if (!group.schedules) group.schedules = [];
            group.schedules.push(...newSchedules);
            group.schedules.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

            saveData();
            
            if (typeof renderDashboard === 'function') {
                renderDashboard();
            } else {
                location.reload();
            }

            alert(`📥 Thành công! Đã thêm ${newSchedules.length} lịch vào nhóm "${group.title}".`);

        } catch (err) {
            console.error("❌ Lỗi xử lý file:", err);
            alert("Lỗi hệ thống khi phân tích file Excel!");
        } finally {
            event.target.value = ''; 
        }
    };

    reader.readAsArrayBuffer(file);
});

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
        groupCard.className = `group-card type-${group.type}`;
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
            <div class="${group.type}s-area" data-group-id="${group.id}" style="${isCollapsed ? 'display: none;' : ''}"></div>
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
        else if (group.type === 'schedule') {
            if (!group.schedules?.length) contentArea.innerHTML = `<span class="no-data-text">Chuột phải để thêm lịch trình...</span>`;
            else {
                const wrapper = document.createElement('div');
                wrapper.className = 'schedule-table-wrapper';
                const table = document.createElement('table');
                table.className = 'schedule-table';
                table.innerHTML = `<thead><tr><th>Ngày</th><th>Giờ</th><th>Công việc</th></tr></thead><tbody></tbody>`;
                const tbody = table.querySelector('tbody');

                group.schedules.forEach((sch, idx) => {
                    const row = document.createElement('tr');
                    row.className = `schedule-row ${sch.important ? 'important' : ''}`;
                    row.onclick = () => showContentDetail(group.id, idx, 'schedule');
                    row.oncontextmenu = (e) => openContextMenu(e, 'schedule', group.id, idx);
                    row.innerHTML = `
                        <td class="schedule-date">${sch.date.split('-').reverse().slice(0,2).join('/')}</td>
                        <td class="schedule-date" style="width: 50px;">${sch.time}</td>
                        <td class="schedule-name">${sch.important ? '⚠️ ' : ''}${sch.title}</td>`;
                    tbody.appendChild(row);
                });
                wrapper.appendChild(table);
                contentArea.appendChild(wrapper);
            }
        }
        container.appendChild(groupCard);
    });

    initDragAndDrop();
}

function initDragAndDrop() {
    if (typeof Sortable === 'undefined') return;
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);

    // ĐÃ SỬA: Thêm sự kiện onEnd để lưu vị trí mới của các Group lớn
    Sortable.create(getEl('groupsContainer'), {
        animation: 200, 
        ghostClass: 'sortable-ghost-group',
        handle: '.group-title', 
        forceFallback: isMobile, 
        fallbackClass: 'sortable-fallback',
        fallbackTolerance: 5,     
        onEnd: () => {
            // Lấy ra danh sách các thẻ group-card theo thứ tự mới trên giao diện
            const cardElements = document.querySelectorAll('#groupsContainer .group-card');
            const newOrderIds = Array.from(cardElements).map(card => card.getAttribute('data-id'));
            
            // Sắp xếp lại mảng dữ liệu state gốc theo thứ tự Id mới này
            state.dashboardData.sort((a, b) => {
                return newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id);
            });
            
            // Lưu dữ liệu vào localStorage và đồng bộ (nếu có)
            saveData();
        }
    });

    document.querySelectorAll('.links-area, .notes-area, .schedules-area').forEach(area => {
        const groupId = area.getAttribute('data-group-id');
        const type = area.classList.contains('links-area') ? 'link' : (area.classList.contains('notes-area') ? 'note' : 'schedule');

        if (type === 'schedule') return; 

        Sortable.create(area, {
            animation: 150, 
            ghostClass: 'sortable-ghost-link',
            delay: 100, 
            delayOnTouchOnly: true,
            forceFallback: isMobile,
            fallbackTolerance: 3, 
            
            onEnd: () => {
                const group = getGroup(groupId); 
                if (!group) return;
                const items = Array.from(area.children).filter(item => item.hasAttribute('data-index'));
                const newIndices = items.map(item => parseInt(item.getAttribute('data-index')));
                group[`${type}s`] = newIndices.map(idx => group[`${type}s`][idx]);
                saveData(); 
            }
        });
    });
}

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
            try {
                gapi.client.setToken(JSON.parse(savedToken));
            } catch (e) {
                localStorage.removeItem('google_oauth_token');
            }
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
        if (token) {
            localStorage.setItem('google_oauth_token', JSON.stringify(token));
        }
        
        await fetchFileFromGoogleDrive();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

async function fetchFileFromGoogleDrive() {
    try {
        const response = await gapi.client.drive.files.list({
            q: "name = 'workspace_data.json'",
            spaces: 'appDataFolder',
            fields: 'files(id, name)'
        });
        const files = response.result.files;
        if (files && files.length > 0) {
            googleFileId = files[0].id;
            const fileData = await gapi.client.drive.files.get({ fileId: googleFileId, alt: 'media' });
            
            if (fileData.result && Array.isArray(fileData.result)) {
                const chotLuaChon = await customConfirm(
                    "Mời bạn lựa chọn phương án xử lý dữ liệu:\n\n👉 Bấm [Đồng ý]: Để tải dữ liệu từ Drive về máy (Đè dữ liệu hiện tại).\n👉 Bấm [Giữ lại]: Để giữ lại dữ liệu mới trên máy và đồng bộ đè lên Drive.", 
                    "⚠️ PHÁT HIỆN XUNG ĐỘT DỮ LIỆU CLOUD"
                );

                if (chotLuaChon) {
                    state.dashboardData = fileData.result;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
                    renderDashboard();
                    updateScheduleUI();
                    alert("📥 Đã tải bộ đồng bộ dữ liệu mới nhất từ mây Google Drive thành công!");
                } else {
                    alert("📤 Hệ thống đang tiến hành cập nhật dữ liệu hiện tại của bạn lên Google Drive...");
                    syncToGoogleDrive(false);
                }
            }
        } else {
            syncToGoogleDrive(true);
        }
    } catch (err) {
        console.error("Lỗi đồng bộ Drive:", err);
    }
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
            await gapi.client.request({
                path: `/upload/drive/v3/files/${googleFileId}`,
                method: 'PATCH',
                params: { uploadType: 'media' },
                body: localData
            });
        } else {
            const metadata = { name: 'workspace_data.json', parents: ['appDataFolder'] };
            const boundary = '314159265358979323846';
            const delimiter = `\r\n--${boundary}\r\n`;
            const close_delim = `\r\n--${boundary}--`;
            const multipartRequestBody =
                delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) +
                delimiter + 'Content-Type: application/json\r\n\r\n' + localData + close_delim;

            const resCreate = await gapi.client.request({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: { uploadType: 'multipart' },
                headers: { 'Content-Type': `multipart/related; boundary="${boundary}"` },
                body: multipartRequestBody
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

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

window.onscroll = function() {
    const btn = getEl("backToTop");
    if (btn) btn.style.display = (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) ? "block" : "none";
};

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    const btn = getEl('themeBtn');
    if (btn) btn.innerHTML = isLight ? '🌙' : '💡';
    
    // BỔ SUNG: Khởi tạo lại vật thể nền ngay khi đổi giao diện
    initBackgroundObjects();
}

function showTodayImportantTasks() {
    const localNow = new Date();
    const year = localNow.getFullYear();
    const month = String(localNow.getMonth() + 1).padStart(2, '0');
    const day = String(localNow.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    let count = 0;
    let groupsWithImportant = []; 
    let groupsNormalOnly = [];     

    state.dashboardData.forEach(group => {
        if (group.type !== 'schedule' || !group.schedules) return;
        
        // Lọc các lịch trình của ngày hôm nay
        const todaySchedules = group.schedules
            .map((item, originalIndex) => ({ ...item, originalIndex })) // Lưu lại index gốc để xóa chính xác
            .filter(item => item.date === today)
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
    sortedGroups.forEach(itemData => {
        const group = itemData.groupObj;
        const gEmoji = (group.emoji && group.emoji !== "NONE") ? `${group.emoji} ` : '📅 ';
        
        html += `<h3 style="color: var(--accent-color); margin-top: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 5px;">${gEmoji}${group.title}</h3>`;
        
        itemData.schedules.forEach(item => {
            // Kiểm tra mốc thời gian đã qua chưa
            const [hours, minutes] = item.time.split(':').map(Number);
            const scheduleTime = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate(), hours, minutes);
            const isPassed = (scheduleTime - localNow) < -60000; // Đã qua quá 1 phút

            // Thiết lập Style gạch ngang và mờ nếu đã qua giờ
            let itemStyle = item.important 
                ? 'border-left: 4px solid var(--danger-color); background: rgba(239, 68, 68, 0.08);' 
                : 'border-left: 4px solid var(--schedule-accent); background: rgba(16, 185, 129, 0.05);';

            // Tạo một biến style riêng cho phần text
            let textStyle = ''; 
            if (isPassed) {
                itemStyle += ' opacity: 0.5;'; // Chỉ làm mờ toàn bộ khối khi đã qua giờ
                textStyle = 'text-decoration: line-through;'; // Chỉ gạch ngang chữ
            }

            const titleColor = item.important ? 'color: #f87171;' : 'color: var(--schedule-accent);';
            const prefix = item.important ? '⚠️ [QUAN TRỌNG] ' : '⏰ ';
            
            html += `
            <div class="today-important-item" style="${itemStyle} margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                <div style="flex: 1; ${textStyle}">
                    <h4 style="margin: 0 0 6px 0; ${titleColor}">${prefix}${item.title} (${item.time})</h4>
                    <p style="margin: 0; white-space: pre-wrap; font-size: 13px; color: var(--text-main);">${item.content || 'Không có nội dung chi tiết'}</p>
                </div>
                <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px; color: var(--danger-color); border-color: rgba(239, 68, 68, 0.2); text-decoration: none;" 
                    onclick="deleteTaskFromModal('${group.id}', ${item.originalIndex})">
                    ❌ Xóa
                </button>
            </div>`;
        });
    });

    const modalTitle = getEl('todayImportantModal')?.querySelector('h3');
    if (modalTitle) {
        const ngay = String(localNow.getDate()).padStart(2, '0');
        const thang = String(localNow.getMonth() + 1).padStart(2, '0');
        modalTitle.innerHTML = `📌 ĐẦU LỊCH HÔM NAY (${ngay}/${thang})`;
    }

    const contentBox = getEl('todayImportantContent');
    if (contentBox) { 
        contentBox.innerHTML = html; 
        openModal('todayImportantModal'); 
    }
}

// Hàm bổ trợ xử lý xóa trực tiếp từ Modal đầu việc trong ngày
function deleteTaskFromModal(groupId, originalIndex) {
    const group = getGroup(groupId);
    if (!group || !group.schedules[originalIndex]) return;

    const taskTitle = group.schedules[originalIndex].title;
    
    customConfirm(`Bạn có chắc chắn muốn xóa mốc lịch trình "${taskTitle}" trực tiếp từ danh sách hôm nay không?`, "⚠️ Xác nhận xóa nhanh").then((confirmed) => {
        if (confirmed) {
            // Xóa phần tử khỏi mảng gốc
            group.schedules.splice(originalIndex, 1);
            
            // Lưu và render lại dashboard phía sau
            saveData(); 
            
            // Cập nhật lại chính nội dung modal đầu việc trong ngày hoặc đóng nếu hết việc
            const localNow = new Date();
            const today = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(localNow.getDate()).padStart(2, '0')}`;
            
            let remainingTasks = 0;
            state.dashboardData.forEach(g => {
                if (g.type === 'schedule' && g.schedules) {
                    remainingTasks += g.schedules.filter(s => s.date === today).length;
                }
            });

            if (remainingTasks === 0) {
                closeModal('todayImportantModal');
            } else {
                showTodayImportantTasks(); // Render lại nội dung mới trong modal
            }
        }
    });
}

window.onload = () => {
    if (localStorage.getItem(THEME_KEY) === 'light') document.body.classList.add('light-mode');
    
    // BỔ SUNG DÒNG NÀY ĐỂ FIX LỖI MẤT MÂY KHI F5:
    initBackgroundObjects(); 
    
    renderDashboard();
    updateScheduleUI();
    
    setTimeout(() => { checkAuthStates(); }, 500);
    setTimeout(showTodayImportantTasks, 300);
};

let pressTimer;
document.addEventListener('touchstart', e => {
    const target = e.target.closest('.link-button, .note-button, .schedule-button, .group-card');
    if (!target) return;

    pressTimer = setTimeout(() => {
        let groupId = null, index = null, targetType = null;
        const card = target.closest('.group-card');
        groupId = card.dataset.id;

        if (target.classList.contains('link-button')) {
            index = parseInt(target.parentElement.dataset.index); targetType = 'link';
        } else if (target.classList.contains('note-button')) {
            index = parseInt(target.parentElement.dataset.index); targetType = 'note';
        } else if (target.classList.contains('schedule-button')) {
            index = parseInt(target.parentElement.dataset.index); targetType = 'schedule';
        } else {
            targetType = `group-${getGroup(groupId).type}`;
        }

        openContextMenu({
            preventDefault(){}, stopPropagation(){},
            pageX: e.touches[0].pageX, pageY: e.touches[0].pageY
        }, targetType, groupId, index);
    }, 500);
});
document.addEventListener('touchend', () => clearTimeout(pressTimer));
document.addEventListener('touchmove', () => { clearTimeout(pressTimer); });

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
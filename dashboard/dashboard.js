// ==========================================================================
// 1. CẤU HÌNH & KHỞI TẠO BIẾN TOÀN CỤC (CONFIG & STATE)
// ==========================================================================
const CLIENT_ID = '109577502358-ifqvdpaumccs5sv6vtr5rphfnq815up0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAc5DuR0oxr7yEdTQnvIIS-PRKGtIfWrro';
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

const EMOJI_GROUPS = [
    { name: "Gần đây", key: "recent", icons: [] },
    { name: "Cơ bản", key: "basic", icons: ["NONE","⭐","🌟","✨","🔥","⚡","🚀","🎯","🏆","✅","☑️","✔️","❌","⚠️","🚨","📌","📍","🔔","🔕"] },
    { name: "Thư mục", key: "folder", icons: ["📁","📂","🗂️","🗃️","🗄️","📦","🧺","🧳","🎒","🗑️","📎","🖇️","🧷","✂️"] },
    { name: "Ghi chú", key: "note", icons: ["📝","📋","📑","📄","📃","📜","📰","🗞️","📒","📓","📔","📕","📗","📘","📙","📚","📖","✏️","🖊️","🖋️","✒️","📐","📏"] },
    { name: "Lịch", key: "time", icons: ["📅","🗓️","📆","⏰","⏱️","⏲️","⌛","⏳","🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛","🌅","🌄","🌇","🌆","🌃","🌙","🌞"] },
    { name: "Công nghệ", key: "tech", icons: ["💻","🖥️","🖨️","⌨️","🖱️","🖲️","💾","💿","📀","💽","📱","📲","☎️","📞","📟","📠","📡","📶","🛰️","🌐","🔗","⚙️","🛠️","🔧","🔨","🔩","🧰","🧲","🧪","🔬","🔭","🤖","🧠","💡","🔌","🔋","🪫","📺","📷","📸","🎥","🎬","🎙️","🎤","🎧","📻"] },
    { name: "Công việc", key: "work", icons: ["💼","👔","🧑‍💼","👨‍💼","👩‍💼","🏢","🏬","🏭","🏦","🏪","🏫","🏛️","🏗️","🧾","💳","💰","💵","💶","💷","💴","🪙","💸","🏷️","🛒","🛍️","📊","📈","📉"] },
    { name: "Kho vận", key: "logistics", icons: ["📦","🚚","🚛","🚜","🏭","🏗️","📍","🧭","🗺️","🚢","✈️","🚆","🚄","🚅","🚉","🚲","🏍️","🚗","🚕","🚙","🛵","⛽","🚦","🛣️"] },
    { name: "Bảo mật", key: "security", icons: ["🔒","🔓","🔐","🔑","🗝️","🛡️","⚔️","🚨","🚔","👮","🕵️","🛂","🧬","☢️","☣️","⛔","🚫"] },
    { name: "Liên hệ", key: "contact", icons: ["💬","🗨️","🗯️","📢","📣","📯","📨","📩","✉️","📧","📬","📭","📪","📫","📮","☎️","📞","🤝","👋","🙏"] },
    { name: "Màu & trạng thái", key: "status", icons: ["🔴","🟠","🟡","🟢","🔵","🟣","🟤","⚫","⚪","⭕","🔷","🔶","🔹","🔸","🔺","🔻","💠","♦️","♣️","♠️","♥️","💯"] },
    { name: "Yêu thích", key: "love", icons: ["❤️","🩷","🧡","💛","💚","🩵","💙","💜","🤎","🖤","🤍","💖","💗","💝","💕","💞","💘","💓","💟"] },
    { name: "Thiết kế", key: "design", icons: ["🎨","🖌️","🖍️","🧵","🪡","🎭","🎬","🎼","🎵","🎶","🎤","🎧","📷","📸","🖼️","🧩"] },
    { name: "Nhà cửa", key: "home", icons: ["🏠","🏡","🏢","🛏️","🛋️","🚪","🪟","🪑","🧹","🧽","🧴","🪣","🛁","🚿","🚽","🍽️","🍳","☕","🧋","🥤"] },
    { name: "Ăn uống", key: "food", icons: ["🍔","🍕","🍜","🍚","🍱","🍎","🍉","🍇","🍓","🥑","🥗","🍞","🥐","🥚","🍗","🍖","🍤","🍰","🎂","🍫"] },
    { name: "Con người", key: "people", icons: ["👤","👥","🧑","👨","👩","🧒","👴","👵","🙋","🙆","🙇","👏","👍","👎","👌","✌️","🤞","🤟","🤙","💪","🫡"] },
    { name: "Cảm xúc", key: "face", icons: ["😀","😁","😂","🤣","😊","😇","🙂","😉","😍","😘","😎","🤩","🥳","😴","🤔","🤯","😭","😡","🥶","🥵","😱","🤗","🤭"] },
    { name: "Giải trí", key: "fun", icons: ["🎉","🎊","🎁","🎈","🎂","🍰","🎆","🎇","🎃","🎄","🎅","🎀","🎗️","🎮","🕹️","🎲","♟️","🎯","🎰"] },
    { name: "Thiên nhiên", key: "nature", icons: ["🌱","🌿","🍀","🌴","🌳","🌲","🌵","🌷","🌹","🌺","🌸","🌼","🌻","🍁","🍂","🍃","☀️","⛅","☁️","🌧️","⛈️","❄️","🌈"] },
    { name: "Động vật", key: "animal", icons: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🦅","🦉","🦄","🐝","🦋","🐢","🐬","🐳","🦈","🐙"] }
];
const EMOJI_LIST = [...new Set(EMOJI_GROUPS.flatMap(group => group.icons))];
const EMOJI_RECENT_KEY = 'dashboardRecentEmojis';
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
    if (btn) btn.innerHTML = (isLight ? '🌙' : '💡') + '<span>Sáng/Tối</span>';
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
        if (btn) btn.innerHTML = '⭐<span>Hiệu ứng nền</span>';
    } else {
        canvas.style.display = 'none';
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        if (btn) btn.innerHTML = '🌟<span>Hiệu ứng nền</span>';
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
        modal.classList.remove('modal-on-top');
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

function getRecentEmojis() {
    try {
        const recent = JSON.parse(localStorage.getItem(EMOJI_RECENT_KEY) || '[]');
        return Array.isArray(recent) ? recent.filter(icon => EMOJI_LIST.includes(icon)).slice(0, 18) : [];
    } catch (e) {
        return [];
    }
}

function saveRecentEmoji(emoji) {
    if (!emoji || emoji === 'NONE') return;
    const recent = [emoji, ...getRecentEmojis().filter(item => item !== emoji)].slice(0, 18);
    localStorage.setItem(EMOJI_RECENT_KEY, JSON.stringify(recent));
}

function buildEmojiPicker(gridId, preSelectedEmoji = "NONE") {
    const grid = getEl(gridId);
    if (!grid) return;

    state.selectedEmoji = preSelectedEmoji || "NONE";
    const pickerId = `${gridId}_picker`;
    const recentIcons = getRecentEmojis();

    const allGroup = { name: "Tất cả", key: "all", icons: EMOJI_LIST };
    const recentGroup = { name: "Gần đây", key: "recent", icons: recentIcons };
    const normalGroups = EMOJI_GROUPS.filter(group => group.key !== "recent");

    const groups = [
        allGroup,
        ...(recentIcons.length ? [recentGroup] : []),
        ...normalGroups
    ];

    const renderEmojiItems = (icons, keyword = '') => {
        const normalizedKeyword = (keyword || '').trim().toLowerCase();
        const source = normalizedKeyword ? EMOJI_LIST : icons;

        const filtered = source.filter(icon => {
            if (!normalizedKeyword) return true;
            const groupName = (EMOJI_GROUPS.find(group => group.icons.includes(icon))?.name || '').toLowerCase();
            return icon.includes(normalizedKeyword) || groupName.includes(normalizedKeyword);
        });

        return filtered.length
            ? filtered.map(emoji => `
                <button type="button" class="emoji-item ${emoji === state.selectedEmoji ? 'selected' : ''}" data-emoji="${emoji}" title="${emoji === 'NONE' ? 'Không dùng icon' : emoji}">
                    ${emoji === "NONE" ? `<span class="emoji-none-label">🚫 Không</span>` : emoji}
                </button>
            `).join('')
            : `<div class="emoji-empty">Không tìm thấy icon phù hợp</div>`;
    };

    grid.innerHTML = `
        <div class="emoji-picker-shell" id="${pickerId}">
            <div class="emoji-search-wrap">
                <span>🔎</span>
                <input type="search" class="emoji-search-input" placeholder="Tìm icon hoặc nhóm..." autocomplete="off">
            </div>
            <div class="emoji-tabs">
                ${groups.map((group, index) => `<button type="button" class="emoji-tab ${index === 0 ? 'active' : ''}" data-key="${group.key}">${group.name}</button>`).join('')}
            </div>
            <div class="emoji-items">${renderEmojiItems(allGroup.icons)}</div>
        </div>
    `;

    const shell = grid.querySelector(`#${pickerId}`);
    if (!shell) return;

    const searchInput = shell.querySelector('.emoji-search-input');
    const itemsBox = shell.querySelector('.emoji-items');
    const tabsBox = shell.querySelector('.emoji-tabs');
    let activeGroup = allGroup;

    const markSelected = () => {
        itemsBox.querySelectorAll('.emoji-item').forEach(el => {
            el.classList.toggle('selected', el.dataset.emoji === state.selectedEmoji);
        });
    };

    const refresh = () => {
        itemsBox.innerHTML = renderEmojiItems(activeGroup.icons, searchInput.value || '');
        markSelected();
    };

    const chooseEmoji = (emoji) => {
        if (!emoji) return;
        state.selectedEmoji = emoji;
        saveRecentEmoji(emoji);
        markSelected();
    };

    searchInput.addEventListener('input', refresh);

    // Kéo ngang thanh tab icon nhưng không nuốt click.
    let pointerDown = false;
    let didDragTab = false;
    let startX = 0;
    let startScrollLeft = 0;

    tabsBox.addEventListener('pointerdown', event => {
        if (event.button !== undefined && event.button !== 0) return;
        pointerDown = true;
        didDragTab = false;
        startX = event.clientX;
        startScrollLeft = tabsBox.scrollLeft;
    });

    tabsBox.addEventListener('pointermove', event => {
        if (!pointerDown) return;
        const diffX = event.clientX - startX;
        if (Math.abs(diffX) > 8) {
            didDragTab = true;
            tabsBox.classList.add('is-dragging');
            tabsBox.scrollLeft = startScrollLeft - diffX;
        }
    });

    const stopTabPointer = () => {
        pointerDown = false;
        tabsBox.classList.remove('is-dragging');
    };

    tabsBox.addEventListener('pointerup', stopTabPointer);
    tabsBox.addEventListener('pointercancel', stopTabPointer);
    tabsBox.addEventListener('pointerleave', stopTabPointer);

    tabsBox.addEventListener('click', event => {
        if (didDragTab) {
            event.preventDefault();
            event.stopPropagation();
            didDragTab = false;
            return;
        }

        const tab = event.target.closest('.emoji-tab');
        if (!tab) return;

        shell.querySelectorAll('.emoji-tab').forEach(btn => btn.classList.remove('active'));
        tab.classList.add('active');

        activeGroup = groups.find(group => group.key === tab.dataset.key) || allGroup;
        searchInput.value = '';
        refresh();
    });

    itemsBox.addEventListener('click', event => {
        const item = event.target.closest('.emoji-item');
        if (!item) return;
        event.preventDefault();
        chooseEmoji(item.dataset.emoji);
    });

    itemsBox.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const item = event.target.closest('.emoji-item');
        if (!item) return;
        event.preventDefault();
        chooseEmoji(item.dataset.emoji);
    });
}

function getScheduleEndDateTime(sch) {
    return new Date(`${sch.endDate || sch.date || ''}T${sch.endTime || sch.time || '00:00'}`);
}

function isScheduleTodayImportant(sch) {
    if (!sch || !sch.important) return false;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(`${sch.date || ''}T00:00:00`);
    const end = new Date(`${sch.endDate || sch.date || ''}T23:59:59`);
    return !isNaN(start) && !isNaN(end) && today >= start && today <= end;
}

function getDashboardStats() {
    return state.dashboardData.reduce((acc, group) => {
        acc.groups += 1;
        acc.links += group.links?.length || 0;
        acc.notes += group.notes?.length || 0;
        acc.schedules += group.schedules?.length || 0;
        acc.todayImportant += (group.schedules || []).filter(isScheduleTodayImportant).length;
        return acc;
    }, { groups: 0, links: 0, notes: 0, schedules: 0, todayImportant: 0 });
}

function updateDashboardStats() {
    const stats = getDashboardStats();
    const setText = (id, value) => { const el = getEl(id); if (el) el.textContent = value; };
    setText('statGroups', stats.groups);
    setText('statLinks', stats.links);
    setText('statNotes', stats.notes);
    setText('statTodayImportant', stats.todayImportant);
}

function getDashboardKeyword() {
    return (getEl('globalSearch')?.value || '').trim().toLowerCase();
}

function groupMatchesKeyword(group, keyword) {
    if (!keyword) return true;
    const chunks = [group.title, group.emoji, group.type, ...(group.tags || [])];
    (group.links || []).forEach(item => chunks.push(item.name, item.url, item.emoji, ...(item.tags || [])));
    (group.notes || []).forEach(item => chunks.push(item.title, item.content, item.emoji, ...(item.tags || [])));
    (group.schedules || []).forEach(item => chunks.push(item.title, item.content, item.date, item.endDate, item.time, item.endTime, item.emoji, ...(item.tags || [])));
    return chunks.filter(Boolean).join(' ').toLowerCase().includes(keyword);
}

function clearDashboardSearch() {
    const input = getEl('globalSearch');
    if (input) input.value = '';
    renderDashboard();
}

function toggleAllGroups(shouldOpen = true) {
    state.dashboardData.forEach(group => group.collapsed = !shouldOpen);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    renderDashboard();
}

function toggleFavoriteGroup(groupId, event) {
    event?.stopPropagation?.();
    const group = getGroup(groupId);
    if (!group) return;
    group.favorite = !group.favorite;
    saveData();
}

function getGroupCreatedValue(group) {
    const idNumber = String(group?.id || '').match(/\d+/)?.[0];
    return Number(idNumber || 0);
}

function sortGroupsForRender(groups) {
    return [...groups].sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)));
}

function applyAutoSortUI() {
    const grid = getEl('groupsContainer');
    grid?.classList.remove('auto-sort-layout');
}
function toggleAutoSortMode() {
    isAutoSortMode = false;
    localStorage.removeItem(AUTO_SORT_KEY);
    renderDashboard();
}

function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
}

function renderDashboard() {
    const container = getEl('groupsContainer'); 
    if (!container) return;
    updateDashboardStats();
    container.innerHTML = '';
    const keyword = getDashboardKeyword();
    const groupsToRender = sortGroupsForRender(
        [...state.dashboardData].filter(group => groupMatchesKeyword(group, keyword) && groupMatchesActiveTag(group))
    );
    applyAutoSortUI();
    
    if (state.dashboardData.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-sub)">Chưa có nhóm nào cả.</p>`; 
        return;
    }
    if (groupsToRender.length === 0) {
        container.innerHTML = `<div class="empty-search-state">🔎 Không tìm thấy dữ liệu phù hợp.<br><button class="btn-secondary" onclick="clearDashboardSearch()">Xóa tìm kiếm</button></div>`;
        return;
    }
    
    groupsToRender.forEach(group => {
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
        const mobileLite = typeof isMobileLiteView === 'function' && isMobileLiteView();
        const shouldLazyRenderContent = mobileLite && isCollapsed;
        const safeTitle = escapeHTML(group.title || 'Không tên');

        groupCard.innerHTML = `
            <div class="group-header" onclick="toggleCollapseGroup('${group.id}')">
                <span class="group-title">${gEmoji}${safeTitle}${renderFolderTags(group)}</span>
                <div class="group-header-actions">
                    <button class="favorite-btn ${group.favorite ? 'active' : ''}" onclick="toggleFavoriteGroup('${group.id}', event)" title="Ghim nhóm yêu thích">${group.favorite ? '⭐' : '☆'}</button>
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

        if (shouldLazyRenderContent) {
            const count = (group.links?.length || 0) + (group.notes?.length || 0) + (group.schedules?.length || 0);
            contentArea.innerHTML = `<span class="no-data-text mobile-lite-placeholder">📱 Đã ẩn ${count} mục để giảm tải. Bấm mở nhóm để tải nội dung.</span>`;
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
                            <a href="${escapeHTML(link.url)}" target="_blank" class="link-button" oncontextmenu="openContextMenu(event, 'link', '${group.id}', ${idx})">
                                ${lEmoji}${escapeHTML(link.name)}
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
                    item.innerHTML = `<div class="note-button" oncontextmenu="openContextMenu(event, 'note', '${group.id}', ${idx})">${nEmoji}${escapeHTML(note.title || "Ghi chú")}</div>`;
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
                        <td class="schedule-name">${sch.important ? '⚠️ ' : ''}${escapeHTML(sch.title || "")}</td>
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
        const tagInput = getEl('groupTagsInput'); if (tagInput) tagInput.value = tagsToString(group?.tags);
        buildEmojiPicker('groupEmojiGrid', group ? (group.emoji || "NONE") : "NONE");
    } else {
        const typeTexts = { link: "Nhóm Link", note: "Nhóm Ghi Chú", schedule: "Nhóm Lịch Trình" };
        if (titleEl) titleEl.innerText = `📌 Tạo ${typeTexts[defaultType] || 'Nhóm'} Mới`;
        if (nameInput) nameInput.value = '';
        const tagInput = getEl('groupTagsInput'); if (tagInput) tagInput.value = '';
        buildEmojiPicker('groupEmojiGrid', "NONE");
    }
    openModal('groupModal');
}

function submitGroupForm() {
    const name = getEl('groupNameInput')?.value.trim();
    const tags = parseTags(getEl('groupTagsInput')?.value || '');
    if (!name) return;

    if (state.isEditMode) {
        const group = getGroup(state.activeGroupId);
        if (group) { group.title = name; group.emoji = state.selectedEmoji; group.tags = tags; }
    } else {
        state.dashboardData.push({ 
            id: 'g_' + Date.now(), title: name, emoji: state.selectedEmoji, type: state.currentGroupType, tags,
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
        <label style="display:block;margin:8px 0 4px;font-size:12px;color:var(--text-sub)">🏷️ Tag lịch:</label>
        <input type="text" class="form-input sch-tags-input" placeholder="Ví dụ: họp, deadline" value="${tagsToString(data ? data.tags : [])}" style="width:100%;margin-bottom:8px">
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
        const tags = parseTags(block.querySelector('.sch-tags-input')?.value || '');

        if (!title || !date || !time || !endDate || !endTime) hasError = true;

        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        if (endDateTime < startDateTime) hasTimeError = true;

        return { 
            title, date, time, endDate, endTime, content, important, tags, 
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
        // Bỏ qua lịch đang nằm trong nhóm thu gọn/ẩn để mở hết/thu gọn/import không bị khựng.
        if (row.offsetParent === null) return;

        const startStr = row.getAttribute('data-start');
        const endStr = row.getAttribute('data-end');
        const countdownCell = row.querySelector('.schedule-countdown-cell');
        const jobCell = row.querySelector('.schedule-name')?.innerText.trim();

        if (!startStr || !endStr || !countdownCell) return;

        const startTime = new Date(startStr.length === 16 ? startStr + ':00' : startStr);
        const endTime = new Date(endStr.length === 16 ? endStr + ':00' : endStr);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) return;

        const diffToStartMs = startTime - now;
        const diffToEndMs = endTime - now;
        let countdownText = "";
        let badgeColor = "";
        let pulse = false;
        let past = false;
        let running = false;

        if (diffToEndMs < 0) {
            countdownText = "Hết hạn";
            badgeColor = "#ef4444";
            past = true;
        } else if (diffToStartMs <= 0 && diffToEndMs >= 0) {
            countdownText = "Đang chạy";
            badgeColor = "#a855f7";
            running = true;
            pulse = Math.floor(diffToEndMs / 60000) <= 30;
        } else {
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
                pulse = diffMin <= 30;
                if (pulse && Notification.permission === "granted" && !row.dataset.notified) {
                    new Notification("🚨 SẮP ĐẾN MỐC HẸN!", { body: `Sắp tới giờ: ${jobCell} (còn ${diffMin} phút).` });
                    row.dataset.notified = "true";
                }
            }
        }

        row.classList.toggle('is-past-schedule', past);
        row.classList.toggle('is-running-schedule', running);
        row.style.textDecoration = past ? "line-through" : "none";
        row.style.borderLeft = running ? "4px solid #a855f7" : "";
        if (pulse) row.setAttribute('data-pulse', 'true');
        else row.removeAttribute('data-pulse');

        Array.from(row.cells).forEach(cell => {
            cell.style.opacity = past ? "0.45" : "1";
            cell.style.color = past ? "var(--text-sub)" : "";
            if (!pulse) cell.style.backgroundColor = "transparent";
        });

        const nextHTML = `<span style="color:${badgeColor}">${countdownText}</span>`;
        if (countdownCell.innerHTML !== nextHTML) countdownCell.innerHTML = nextHTML;
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
            // Khởi tạo các cờ đánh dấu trạng thái cụ thể của từng Lịch trình trong nhóm
            let hasUpcomingImportant = false; // Sắp diễn ra (<30p) VÀ Quan trọng
            let hasUpcomingNormal = false;    // Sắp diễn ra (<30p) VÀ Lịch thường
            let hasImportant = false;         // Có lịch quan trọng (nhưng chưa/không sắp diễn ra)
            let hasRunning = false;           // Có lịch đang diễn ra

            todaySchedules.forEach(item => {
                const exactStartDT = new Date(`${item.date}T${item.time}:00`);
                const exactEndDT = new Date(`${item.endDate || item.date}T${item.endTime || item.time}:00`);
                
                const diffToStartMs = exactStartDT - localNow;
                const isUpcoming = diffToStartMs > 0 && diffToStartMs <= 30 * 60 * 1000;

                // 1 & 2. Kiểm tra trạng thái SẮP DIỄN RA dưới 30 phút
                if (isUpcoming) {
                    if (item.important) {
                        hasUpcomingImportant = true;
                    } else {
                        hasUpcomingNormal = true;
                    }
                }
                
                // 3. Kiểm tra lịch QUAN TRỌNG nói chung
                if (item.important) {
                    hasImportant = true;
                }

                // 4. Kiểm tra lịch ĐANG DIỄN RA
                if (localNow >= exactStartDT && localNow <= exactEndDT) {
                    hasRunning = true;
                }
            });

            // 🔥 THIẾT LẬP TRỌNG SỐ ƯU TIÊN CHO NHÓM (Số càng nhỏ càng xếp lên đầu)
            let groupWeight = 5; // Mức 5: Nhóm chỉ có lịch bình thường khác
            
            if (hasUpcomingImportant) {
                groupWeight = 1; // Mức 1: Nhóm có lịch SẮP DIỄN RA (<30p) + QUAN TRỌNG
            } else if (hasUpcomingNormal) {
                groupWeight = 2; // Mức 2: Nhóm có lịch SẮP DIỄN RA (<30p) + LỊCH THƯỜNG
            } else if (hasImportant) {
                groupWeight = 3; // Mức 3: Nhóm có lịch QUAN TRỌNG
            } else if (hasRunning) {
                groupWeight = 4; // Mức 4: Nhóm có lịch ĐANG DIỄN RA
            }

            processedGroups.push({
                groupObj: group,
                schedules: todaySchedules,
                weight: groupWeight
            });
        }
    });

    if (processedGroups.length === 0) return;

    // Sắp xếp các cụm nhóm dựa trên trọng số weight (1 lên đầu, 5 về cuối)
    processedGroups.sort((a, b) => a.weight - b.weight);

    let html = '';
    const dayLabels = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

    // Dựng giao diện HTML dựa trên mảng đã được xếp hạng ưu tiên
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

            const shouldPulse = (diffToStartMs > 0 && diffToStartMs <= 1800000) || ((exactEndDT - localNow) > 0 && (exactEndDT - localNow) <= 1800000);
            let currentType = isRunning ? 'running' : (item.important ? 'important' : 'normal');

            let borderCol = isRunning ? '#a855f7' : (item.important ? '#ef4444' : 'var(--schedule-accent, #10b981)');
            let bgCol = isRunning ? 'rgba(168,85,247,0.08)' : (item.important ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.05)');
            
            if (diffToStartMs > 0 && diffMin <= 30) {
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
        'group-link': `<div class="context-menu-item" onclick="openLinkModal('${groupId}')">➕ Thêm nút bấm link</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="toggleFavoriteGroup('${groupId}', event)">⭐ Ghim / bỏ ghim nhóm</div><div class="context-menu-item" onclick="openGroupModal('${groupId}','link')">📝 Sửa tên nhóm</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>${lockMenuHTML}`,
        'group-note': `<div class="context-menu-item" onclick="openNoteModal('${groupId}')">➕ Thêm nút ghi chú</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="toggleFavoriteGroup('${groupId}', event)">⭐ Ghim / bỏ ghim nhóm</div><div class="context-menu-item" onclick="openGroupModal('${groupId}','note')">📝 Sửa tên nhóm</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>${lockMenuHTML}`,
        'group-schedule': `<div class="context-menu-item" onclick="openScheduleModal('${groupId}')">➕ Thêm mốc lịch trình</div><div class="context-menu-item" onclick="triggerExcelImport('${groupId}')">📥 Import từ Excel</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="toggleFavoriteGroup('${groupId}', event)">⭐ Ghim / bỏ ghim nhóm</div><div class="context-menu-item" onclick="openGroupModal('${groupId}','schedule')">📝 Sửa tên nhóm</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Xóa toàn bộ nhóm</div>${lockMenuHTML}`,
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
        if (!isAutoSortMode) {
            Sortable.create(groupsContainer, {
                animation: 200, ghostClass: 'sortable-ghost-group', handle: '.group-title', forceFallback: isMobile, fallbackClass: 'sortable-fallback', fallbackTolerance: isMobile ? 10 : 5,
                onEnd: () => {
                    const order = Array.from(document.querySelectorAll('#groupsContainer .group-card')).map(c => c.getAttribute('data-id'));
                    state.dashboardData.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
                    saveData();
                }
            });
        }
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

async function submitKeyForm() {
    clearKeyError();
    const keyInput = getEl('groupKeyInput')?.value.trim();
    if (!keyInput) return showKeyError("Vui lòng nhập mã khóa.");
    
    const hashedKey = btoa(unescape(encodeURIComponent(keyInput)));
    const group = getGroup(keyModalContext.targetGroupId);
    
    if (!group) {
        showKeyError("Không tìm thấy dữ liệu nhóm.");
        return;
    }

    // Xử lý logic nghiệp vụ khóa/mở
    if (keyModalContext.action === 'setup_lock') {
        group.pinKey = hashedKey; 
        group.isLocked = true; 
        alert("Thiết lập mã khóa thành công!");
    } else if (keyModalContext.action === 'remove_lock') {
        if (group.pinKey === hashedKey) { 
            group.pinKey = ""; 
            group.isLocked = false; 
            alert("Đã gỡ bỏ mã bảo vệ!"); 
        } else {
            return showKeyError("Mã khóa không chính xác.");
        }
    } else if (keyModalContext.action === 'unlock') {
        if (group.pinKey === hashedKey) {
            group.isLocked = false;
        } else {
            return showKeyError("Mã khóa sai. Vui lòng thử lại.");
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

// ========================================================================== 
// 20. SMART WORKSPACE UPGRADE: Favorites, Recent, Command Palette, Trash/Undo
// ========================================================================== 
const RECENT_KEY = 'dashboardRecentItemsV2';
const TRASH_KEY = 'dashboardTrashItemsV2';
const AUTO_SORT_KEY = 'dashboardAutoSortFoldersV1';
let lastTrashSnapshot = null;
let isAutoSortMode = false;

function readJSONStore(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
}
function writeJSONStore(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function normalizeText(value = '') { return String(value || '').toLowerCase(); }

function saveDataOnly() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
    if (gapiInited && gisInited && gapi.client.getToken()) syncToGoogleDrive(true);
}

function addRecentItem(item) {
    const recent = readJSONStore(RECENT_KEY, []);
    const key = `${item.type}-${item.groupId}-${item.index ?? item.title}`;
    const next = [{ ...item, key, at: Date.now() }, ...recent.filter(x => x.key !== key)].slice(0, 12);
    writeJSONStore(RECENT_KEY, next);
    renderSmartPanels();
}

function collectDashboardItems() {
    const items = [];
    state.dashboardData.forEach(group => {
        if (group.pinKey && group.pinKey !== '' && group.isLocked) return;
        const gLabel = `${group.emoji && group.emoji !== 'NONE' ? group.emoji + ' ' : ''}${group.title}`;
        items.push({ type:'group', icon:'📁', title:gLabel, subtitle:`Nhóm ${group.type}`, groupId:group.id, action: () => scrollToGroup(group.id) });
        (group.links || []).forEach((link, index) => items.push({ type:'link', icon:'🔗', title:link.name, subtitle:group.title, groupId:group.id, index, url:link.url, action: () => { addRecentItem({type:'link', title:link.name, subtitle:group.title, groupId:group.id, index, url:link.url}); window.open(link.url, '_blank'); } }));
        (group.notes || []).forEach((note, index) => items.push({ type:'note', icon:'📝', title:note.title, subtitle:group.title, groupId:group.id, index, text:note.content, action: () => showContentDetail(group.id, index, 'note') }));
        (group.schedules || []).forEach((sch, index) => items.push({ type:'schedule', icon:'📅', title:sch.title, subtitle:`${group.title} · ${sch.date || ''} ${sch.time || ''}`, groupId:group.id, index, text:sch.content, date:sch.date, action: () => showContentDetail(group.id, index, 'schedule') }));
    });
    return items;
}

function renderSmartPanels() {
    renderSmartFavorites();
    renderSmartRecent();
    renderSmartUpcoming();
}

function renderSmartFavorites() {
    const el = getEl('smartFavorites'); if (!el) return;
    const favs = state.dashboardData.filter(g => g.favorite).slice(0, 8);
    if (!favs.length) { el.className = 'smart-list empty'; el.textContent = 'Chưa có nhóm yêu thích.'; return; }
    el.className = 'smart-list';
    el.innerHTML = favs.map(g => `<div class="smart-item" onclick="scrollToGroup('${g.id}')"><span>${g.emoji && g.emoji !== 'NONE' ? g.emoji : '⭐'} ${escapeHTML(g.title)}</span><small>${g.type}</small></div>`).join('');
}

function renderSmartRecent() {
    const el = getEl('smartRecent'); if (!el) return;
    const recent = readJSONStore(RECENT_KEY, []).slice(0, 8);
    const panel = el.closest('.smart-panel');
    const title = panel?.querySelector('.panel-title');
    if (title && !title.classList.contains('panel-title-row')) {
        title.classList.add('panel-title-row');
        title.innerHTML = `<span>🕘 Recent</span><button class="btn-secondary panel-mini-btn" onclick="clearRecentItems(event)">Xóa tất cả</button>`;
    }
    if (!recent.length) { el.className = 'smart-list empty'; el.textContent = 'Chưa có lịch sử mở gần đây.'; return; }
    el.className = 'smart-list';
    el.innerHTML = recent.map((r, i) => `
        <div class="smart-item">
            <div class="smart-item-main" onclick="openRecentItem(${i})">
                <span>${r.type === 'link' ? '🔗' : r.type === 'note' ? '📝' : '📅'} ${escapeHTML(r.title)}</span>
                <small>${escapeHTML(r.subtitle || '')}</small>
            </div>
            <div class="smart-item-actions">
                <button class="smart-icon-btn" onclick="removeRecentItem(${i}, event)" title="Xóa khỏi Recent">✕</button>
            </div>
        </div>`).join('');
}

function removeRecentItem(index, event) {
    event?.stopPropagation?.();
    const recent = readJSONStore(RECENT_KEY, []);
    recent.splice(index, 1);
    writeJSONStore(RECENT_KEY, recent);
    renderSmartRecent();
}

function clearRecentItems(event) {
    event?.stopPropagation?.();
    writeJSONStore(RECENT_KEY, []);
    renderSmartRecent();
}

function renderSmartUpcoming() {
    const el = getEl('smartUpcoming'); if (!el) return;
    const now = new Date();
    const upcoming = [];
    state.dashboardData.forEach(group => {
        if (group.pinKey && group.pinKey !== '' && group.isLocked) return;
        (group.schedules || []).forEach((sch, index) => {
            const d = getScheduleEndDateTime(sch);
            if (!isNaN(d) && d >= now) upcoming.push({ group, sch, index, d });
        });
    });
    upcoming.sort((a,b) => a.d - b.d);
    const top = upcoming.slice(0, 8);
    if (!top.length) { el.className = 'smart-list empty'; el.textContent = 'Chưa có lịch sắp tới.'; return; }
    el.className = 'smart-list';
    el.innerHTML = top.map(x => `<div class="smart-item" onclick="openCalendarScheduleDetail('${x.group.id}', ${x.index})"><span>${x.sch.important ? '⚠️' : '📅'} ${escapeHTML(x.sch.title)}</span><small>${escapeHTML(x.group.title)} · ${String(x.sch.endDate || x.sch.date || '').split('-').reverse().join('/')}</small></div>`).join('');
}

function openRecentItem(index) {
    const r = readJSONStore(RECENT_KEY, [])[index];
    if (!r) return;
    if (r.type === 'link' && r.url) window.open(r.url, '_blank');
    else if (r.type === 'note' || r.type === 'schedule') showContentDetail(r.groupId, r.index, r.type);
}

function scrollToGroup(groupId) {
    const group = getGroup(groupId);
    if (group?.collapsed) group.collapsed = false;
    renderDashboard();
    setTimeout(() => {
        const card = document.querySelector(`.group-card[data-id="${groupId}"]`);
        card?.scrollIntoView({ behavior:'smooth', block:'center' });
        card?.animate?.([{ transform:'scale(1)' }, { transform:'scale(1.025)' }, { transform:'scale(1)' }], { duration: 500 });
    }, 30);
}

function openCommandPalette() {
    openModal('commandPaletteModal');
    const input = getEl('commandInput');
    if (input) { input.value = ''; setTimeout(() => input.focus(), 50); }
    renderCommandPalette();
}

function renderCommandPalette() {
    const box = getEl('commandResults'); if (!box) return;
    const keyword = normalizeText(getEl('commandInput')?.value || '');
    const quickActions = [
        { icon:'⌘', title:'Mở Command Palette', subtitle:'Thao tác nhanh', action:() => openCommandPalette() },
        { icon:'⚠️', title:'Xem việc quan trọng hôm nay', subtitle:'Dashboard', action:() => { closeModal('commandPaletteModal'); showTodayImportantTasks(); } },
        { icon:'🗑️', title:'Mở thùng rác', subtitle:'Khôi phục mục đã xóa', action:() => { closeModal('commandPaletteModal'); openTrashModal(); } },
        { icon:'📆', title:'Mở Calendar View', subtitle:'Xem lịch theo tháng', action:() => { closeModal('commandPaletteModal'); openCalendarModal(); } },
        { icon:'💾', title:'Mở Backup phiên bản', subtitle:'Khôi phục bản lưu cũ', action:() => { closeModal('commandPaletteModal'); openBackupModal(); } }
    ];
    const all = [...quickActions, ...collectDashboardItems()];
    const result = all.filter(item => !keyword || normalizeText(`${item.title} ${item.subtitle || ''} ${item.text || ''} ${item.url || ''}`).includes(keyword)).slice(0, 30);
    if (!result.length) { box.innerHTML = '<div class="empty-search-state">Không có kết quả phù hợp.</div>'; return; }
    window.__commandActions = result;
    box.innerHTML = result.map((item, i) => `<button class="command-result-item" onclick="runCommandAction(${i})"><strong>${item.icon || '•'} ${escapeHTML(item.title)}</strong><small>${escapeHTML(item.subtitle || '')}</small></button>`).join('');
}

function runCommandAction(index) {
    const item = window.__commandActions?.[index];
    if (!item) return;
    closeModal('commandPaletteModal');
    item.action?.();
}

const __originalShowContentDetail = showContentDetail;
showContentDetail = function(groupId, index, type) {
    const group = getGroup(groupId);
    const item = group?.[`${type}s`]?.[index];
    if (item) addRecentItem({ type, title: item.title || item.name || 'Không tên', subtitle: group.title, groupId, index });
    return __originalShowContentDetail(groupId, index, type);
};

const __originalRenderDashboard = renderDashboard;
renderDashboard = function() {
    __originalRenderDashboard();
    renderSmartPanels();
};

const __originalToggleFavoriteGroup = toggleFavoriteGroup;
toggleFavoriteGroup = function(groupId, event) {
    __originalToggleFavoriteGroup(groupId, event);
    renderSmartPanels();
};

const __originalOpenContextMenu = openContextMenu;
openContextMenu = function(e, targetType, groupId, index = null) {
    __originalOpenContextMenu(e, targetType, groupId, index);
    const menuContent = getEl('menuItemsContent');
    if (!menuContent) return;
    if (['link','note','schedule'].includes(targetType)) {
        menuContent.insertAdjacentHTML('afterbegin', `<div class="context-menu-item" onclick="favoriteSingleItem('${targetType}','${groupId}',${index})">⭐ Ghim mục này</div>`);
    }
};

function favoriteSingleItem(type, groupId, index) {
    const group = getGroup(groupId);
    const item = group?.[`${type}s`]?.[index];
    if (!item) return;
    item.favorite = !item.favorite;
    saveData();
    getEl('customContextMenu').style.display = 'none';
}

function showUndoToast(label) {
    const toast = getEl('undoToast'); if (!toast) return;
    toast.innerHTML = `<span>Đã chuyển <b>${escapeHTML(label)}</b> vào thùng rác.</span><button class="btn-primary" onclick="openTrashModal()">Mở thùng rác</button>`;
    toast.style.display = 'flex';
    clearTimeout(window.__undoToastTimer);
    window.__undoToastTimer = setTimeout(() => { toast.style.display = 'none'; }, 7000);
}

triggerDelete = function(type) {
    const group = getGroup(state.activeGroupId);
    if (!group) return;
    const typeMap = { Group:'nhóm', Link:'link', Note:'ghi chú', Schedule:'lịch trình' };
    const label = type === 'Group' ? group.title : (group[`${type.toLowerCase()}s`]?.[state.activeIndex]?.title || group[`${type.toLowerCase()}s`]?.[state.activeIndex]?.name || 'mục này');
    customConfirm(`Bạn có chắc chắn muốn xóa ${typeMap[type] || 'mục'} "${label}"?\nDữ liệu sẽ được chuyển vào thùng rác và có thể khôi phục.`, '🗑️ Xác nhận xóa').then(ok => {
        if (!ok) return;
        const trash = readJSONStore(TRASH_KEY, []);
        let payload = null;
        if (type === 'Group') {
            const idx = state.dashboardData.findIndex(g => g.id === state.activeGroupId);
            if (idx >= 0) payload = { kind:'Group', index:idx, data: state.dashboardData.splice(idx, 1)[0] };
        } else {
            const key = `${type.toLowerCase()}s`;
            const item = group[key]?.splice(state.activeIndex, 1)[0];
            if (item) payload = { kind:type, groupId: group.id, index: state.activeIndex, data: item };
        }
        if (!payload) return;
        payload.deletedAt = Date.now();
        lastTrashSnapshot = payload;
        trash.unshift(payload);
        writeJSONStore(TRASH_KEY, trash.slice(0, 50));
        saveData();
        showUndoToast(label);
    });
};

function formatTrashTime(ts) {
    try { return new Date(ts).toLocaleString('vi-VN'); }
    catch { return ''; }
}

function getTrashLabel(item) {
    if (!item) return 'Không tên';
    if (item.kind === 'Group') return item.data?.title || 'Nhóm không tên';
    return item.data?.title || item.data?.name || 'Mục không tên';
}

function getTrashKindLabel(kind) {
    return { Group:'📁 Nhóm', Link:'🔗 Link', Note:'📝 Ghi chú', Schedule:'📅 Lịch trình' }[kind] || 'Mục';
}

function openTrashModal() {
    renderTrashModal();
    openModal('trashModal');
    const toast = getEl('undoToast'); if (toast) toast.style.display = 'none';
}

function renderTrashModal() {
    const el = getEl('trashList'); if (!el) return;
    const trash = readJSONStore(TRASH_KEY, []);
    if (!trash.length) {
        el.className = 'trash-list empty';
        el.textContent = 'Thùng rác đang trống.';
        return;
    }
    el.className = 'trash-list';
    el.innerHTML = trash.map((item, index) => `
        <div class="trash-item">
            <div>
                <strong>${getTrashKindLabel(item.kind)} · ${escapeHTML(getTrashLabel(item))}</strong>
                <small>${escapeHTML(item.data?.title || item.data?.name || '')}${item.kind !== 'Group' ? ' · Nhóm gốc: ' + escapeHTML(getGroup(item.groupId)?.title || 'không còn tồn tại') : ''}<br>Đã xóa: ${formatTrashTime(item.deletedAt)}</small>
            </div>
            <div class="trash-actions">
                <button class="btn-success" onclick="restoreTrashItemAt(${index})">Khôi phục</button>
                <button class="btn-real-danger" onclick="removeTrashItemAt(${index})">Xóa hẳn</button>
            </div>
        </div>`).join('');
}

function restoreTrashItemAt(index) {
    const trash = readJSONStore(TRASH_KEY, []);
    const item = trash[index];
    if (!item) return;
    if (item.kind === 'Group') {
        state.dashboardData.splice(Math.min(item.index ?? state.dashboardData.length, state.dashboardData.length), 0, item.data);
    } else {
        const group = getGroup(item.groupId);
        if (!group) return alert('Không tìm thấy nhóm gốc để khôi phục mục này. Bạn cần khôi phục nhóm gốc trước nếu nhóm đó đã bị xóa.');
        const key = `${item.kind.toLowerCase()}s`;
        if (!group[key]) group[key] = [];
        group[key].splice(Math.min(item.index ?? group[key].length, group[key].length), 0, item.data);
    }
    trash.splice(index, 1);
    lastTrashSnapshot = null;
    writeJSONStore(TRASH_KEY, trash);
    saveData();
    renderTrashModal();
}

function removeTrashItemAt(index) {
    const trash = readJSONStore(TRASH_KEY, []);
    trash.splice(index, 1);
    writeJSONStore(TRASH_KEY, trash);
    renderTrashModal();
}

function clearTrashItems() {
    customConfirm('Bạn có chắc muốn xóa sạch toàn bộ thùng rác? Thao tác này không thể khôi phục.', '🗑️ Xóa sạch thùng rác').then(ok => {
        if (!ok) return;
        writeJSONStore(TRASH_KEY, []);
        lastTrashSnapshot = null;
        renderTrashModal();
    });
}

function restoreLastTrashItem() {
    const trash = readJSONStore(TRASH_KEY, []);
    if (!trash.length && !lastTrashSnapshot) return alert('Không có dữ liệu nào trong thùng rác để khôi phục.');
    const targetIndex = lastTrashSnapshot ? trash.findIndex(x => x.deletedAt === lastTrashSnapshot.deletedAt) : 0;
    restoreTrashItemAt(targetIndex >= 0 ? targetIndex : 0);
    const toast = getEl('undoToast'); if (toast) toast.style.display = 'none';
}

document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); openCommandPalette();
    }
    if (e.key === 'Escape') closeModal('commandPaletteModal');
});

document.addEventListener('click', e => {
    const link = e.target.closest('.link-button');
    if (!link) return;
    const card = link.closest('.group-card');
    const wrapper = link.closest('.item-wrapper');
    const group = getGroup(card?.dataset.id);
    const idx = Number(wrapper?.dataset.index);
    const item = group?.links?.[idx];
    if (item) addRecentItem({ type:'link', title:item.name, subtitle:group.title, groupId:group.id, index:idx, url:item.url });
}, true);

window.addEventListener('load', () => { applyAutoSortUI(); setTimeout(renderSmartPanels, 350); });

// ==========================================================================
// 15. V4 MOBILE WORKSPACE: SIDEBAR, TAG, CALENDAR, BACKUP, CTRL+Z
// ==========================================================================
const BACKUP_KEY = 'dashboardVersionBackupsV1';
let activeTagFilter = '';
let currentCalendarDate = new Date();
let __backupLock = false;

function parseTags(value = '') {
    return [...new Set(String(value || '')
        .split(/[#,，;\n]/)
        .map(x => x.trim().replace(/^#/, '').toLowerCase())
        .filter(Boolean))].slice(0, 12);
}

function tagsToString(tags = []) {
    return Array.isArray(tags) ? tags.join(', ') : '';
}

function getAllDashboardTags() {
    const bag = new Set();
    state.dashboardData.forEach(group => (group.tags || []).forEach(t => bag.add(t)));
    return [...bag].sort((a, b) => a.localeCompare(b, 'vi'));
}

function groupMatchesActiveTag(group) {
    if (!activeTagFilter) return true;
    return (group.tags || []).includes(activeTagFilter);
}

function setActiveTag(tag = '') {
    activeTagFilter = tag;
    renderTagFilterChips();
    renderDashboard();
}

function renderTagFilterChips() {
    const el = getEl('tagFilterChips');
    if (!el) return;
    const tags = getAllDashboardTags();
    const base = `<button class="tag-chip ${!activeTagFilter ? 'active' : ''}" onclick="setActiveTag('')">Tất cả</button>`;
    el.innerHTML = base + tags.map(tag => `<button class="tag-chip ${activeTagFilter === tag ? 'active' : ''}" onclick="setActiveTag('${escapeHTML(tag)}')">#${escapeHTML(tag)}</button>`).join('');
}

function renderFolderTags(group = {}) {
    const tags = group.tags || [];
    if (!tags.length) return '';
    const visible = tags.slice(0, 4).map(t => `<span class="folder-tag">#${escapeHTML(t)}</span>`).join('');
    const more = tags.length > 4 ? `<span class="folder-tag more">+${tags.length - 4}</span>` : '';
    return `<span class="folder-tags-inline">${visible}${more}</span>`;
}

function renderItemTags(item = {}) {
    return '';
}

function scrollToSection(section) {
    if (section === 'top') return window.scrollTo({ top: 0, behavior: 'smooth' });
    const el = getEl(section);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function getVisibleSchedules() {
    const out = [];
    state.dashboardData.forEach(group => {
        if (group.pinKey && group.pinKey !== '' && group.isLocked) return;
        (group.schedules || []).forEach((sch, index) => {
            const d = getScheduleEndDateTime(sch);
            if (!isNaN(d)) out.push({ group, sch, index, d });
        });
    });
    return out;
}

function openCalendarModal() {
    currentCalendarDate = new Date();
    currentCalendarDate.setDate(1);
    renderCalendarView();
    openModal('calendarModal');
}

function changeCalendarMonth(offset) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + offset);
    renderCalendarView();
}


function getCalendarItemsForDay(year, month, day) {
    const targetStart = new Date(year, month, day, 0, 0, 0);
    const targetEnd = new Date(year, month, day, 23, 59, 59);
    const items = [];

    getVisibleSchedules().forEach(x => {
        const start = new Date(`${x.sch.date || ''}T${x.sch.time || '00:00'}`);
        const end = new Date(`${x.sch.endDate || x.sch.date || ''}T${x.sch.endTime || x.sch.time || '23:59'}`);
        if (isNaN(start) || isNaN(end)) return;

        if (start <= targetEnd && end >= targetStart) {
            const activeDate = new Date(year, month, day, 0, 0, 0);
            items.push({ ...x, activeDate, start, end });
        }
    });

    return items.sort((a, b) => {
        const ta = a.sch.time || '00:00';
        const tb = b.sch.time || '00:00';
        return ta.localeCompare(tb) || String(a.sch.title || '').localeCompare(String(b.sch.title || ''));
    });
}

function openCalendarDayModal(year, month, day) {
    const title = getEl('calendarDayTitle');
    const body = getEl('calendarDayBody');
    if (!title || !body) return;

    const items = getCalendarItemsForDay(year, month, day);
    const dateLabel = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
    title.textContent = `📅 Ngày ${dateLabel}`;

    if (!items.length) {
        body.innerHTML = `<div class="calendar-day-empty">Không có lịch trong ngày này.</div>`;
    } else {
        body.innerHTML = `
            <div class="calendar-day-count">${items.length} mốc lịch trong ngày</div>
            <div class="calendar-day-timeline">
                ${items.map(x => `
                    <button class="calendar-day-timeline-item ${x.sch.important ? 'important' : ''}" onclick="openCalendarScheduleDetail('${x.group.id}', ${x.index})">
                        <span class="calendar-day-time">${escapeHTML(x.sch.time || '--:--')}</span>
                        <span class="calendar-day-dot"></span>
                        <span class="calendar-day-info">
                            <strong>${x.sch.important ? '⚠️ ' : ''}${escapeHTML(x.sch.title || 'Không tên')}</strong>
                            <small>${escapeHTML(x.group.title || '')}${x.sch.content ? ' · ' + escapeHTML(String(x.sch.content).slice(0, 80)) : ''}</small>
                        </span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    openModal('calendarDayModal');
    const dayModal = getEl('calendarDayModal');
    if (dayModal) dayModal.classList.add('modal-on-top');
}

function renderCalendarView() {
    const label = getEl('calendarMonthLabel');
    const grid = getEl('calendarGrid');
    if (!label || !grid) return;

    const y = currentCalendarDate.getFullYear();
    const m = currentCalendarDate.getMonth();
    const today = new Date();

    label.textContent = `Tháng ${m + 1}/${y}`;

    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startDay = first.getDay();

    let html = ['CN','T2','T3','T4','T5','T6','T7']
        .map(d => `<div class="calendar-weekday">${d}</div>`)
        .join('');

    for (let i = 0; i < startDay; i++) {
        html += `<div class="calendar-cell muted"></div>`;
    }

    for (let day = 1; day <= last.getDate(); day++) {
        const items = getCalendarItemsForDay(y, m, day);
        const hasEvents = items.length > 0;
        const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === day;

        html += `
            <div class="calendar-cell ${hasEvents ? 'has-events' : ''} ${isToday ? 'is-today' : ''}"
                 onclick="openCalendarDayModal(${y}, ${m}, ${day})"
                 title="${hasEvents ? `${items.length} lịch` : 'Không có lịch'}">
                <div class="calendar-day-number">${day}</div>
                ${hasEvents ? `<span class="calendar-mobile-count">${items.length}</span>` : ''}
                <div class="calendar-events-wrap">
                    ${items.map(x => `
                        <button class="calendar-event ${x.sch.important ? 'important' : ''}"
                            onclick="event.stopPropagation(); openCalendarScheduleDetail('${x.group.id}', ${x.index})">
                            ${x.sch.important ? '⚠️' : '•'} ${escapeHTML(x.sch.title || 'Không tên')}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    grid.innerHTML = html;
}


function toggleMobileSidebar(force) {
    const shouldOpen = typeof force === 'boolean' ? force : !document.body.classList.contains('sidebar-open');
    document.body.classList.toggle('sidebar-open', shouldOpen);
}

function openSidebarPanel(type) {
    const title = getEl('sidebarPanelTitle');
    const box = getEl('sidebarPanelContent');
    if (!title || !box) return;
    const titles = { favorites: '⭐ Favorites', recent: '🕘 Recent', upcoming: '📅 Sắp tới' };
    title.textContent = titles[type] || 'Bảng nhanh';
    box.innerHTML = renderSidebarPanelContent(type);
    openModal('sidebarPanelModal');
    toggleMobileSidebar(false);
}

function renderSidebarPanelContent(type) {
    if (type === 'favorites') {
        const favs = state.dashboardData.filter(g => g.favorite).slice(0, 30);
        if (!favs.length) return '<div class="smart-list empty">Chưa có nhóm yêu thích.</div>';
        return `<div class="smart-list">${favs.map(g => `<div class="smart-item" onclick="closeModal('sidebarPanelModal'); scrollToGroup('${g.id}')"><span>${g.emoji && g.emoji !== 'NONE' ? g.emoji : '⭐'} ${escapeHTML(g.title)}</span><small>${escapeHTML(g.type || '')}</small></div>`).join('')}</div>`;
    }
    if (type === 'recent') {
        const recent = readJSONStore(RECENT_KEY, []);
        if (!recent.length) return '<div class="smart-list empty">Chưa có lịch sử mở gần đây.</div>';
        return `<div class="sidebar-panel-actions"><button class="btn-real-danger" onclick="clearRecentItems(event); openSidebarPanel('recent')">Xóa tất cả</button></div><div class="smart-list">${recent.map((r, i) => `
            <div class="smart-item">
                <div class="smart-item-main" onclick="openRecentItem(${i}); closeModal('sidebarPanelModal')">
                    <span>${r.type === 'link' ? '🔗' : r.type === 'note' ? '📝' : '📅'} ${escapeHTML(r.title)}</span>
                    <small>${escapeHTML(r.subtitle || '')}</small>
                </div>
                <div class="smart-item-actions"><button class="smart-icon-btn" onclick="removeRecentItem(${i}, event); openSidebarPanel('recent')" title="Xóa khỏi Recent">✕</button></div>
            </div>`).join('')}</div>`;
    }
    if (type === 'upcoming') {
        const now = new Date();
        const upcoming = [];
        state.dashboardData.forEach(group => {
            if (group.pinKey && group.pinKey !== '' && group.isLocked) return;
            (group.schedules || []).forEach((sch, index) => {
                const d = getScheduleEndDateTime(sch);
                if (!isNaN(d) && d >= now) upcoming.push({ group, sch, index, d });
            });
        });
        upcoming.sort((a,b) => a.d - b.d);
        if (!upcoming.length) return '<div class="smart-list empty">Chưa có lịch sắp tới.</div>';
        return `<div class="smart-list">${upcoming.slice(0, 30).map(x => `<div class="smart-item" onclick="closeModal('sidebarPanelModal'); showContentDetail('${x.group.id}', ${x.index}, 'schedule')"><span>${x.sch.important ? '⚠️' : '📅'} ${escapeHTML(x.sch.title)}</span><small>${escapeHTML(x.group.title)} · ${String(x.sch.endDate || x.sch.date || '').split('-').reverse().join('/')}</small></div>`).join('')}</div>`;
    }
    return '';
}

function openCalendarScheduleDetail(groupId, index) {
    showContentDetail(groupId, index, 'schedule');
    const readModal = getEl('readModal');
    if (readModal) readModal.classList.add('modal-on-top');
}

function readBackups() {
    return readJSONStore(BACKUP_KEY, []);
}

function writeBackups(items) {
    writeJSONStore(BACKUP_KEY, items.slice(0, 10));
}

function createDashboardBackup(reason = 'Tự động') {
    if (__backupLock) return;
    const backups = readBackups();
    const snapshot = JSON.stringify(state.dashboardData);
    if (backups[0]?.snapshot === snapshot) return;
    backups.unshift({ id: 'bk_' + Date.now(), reason, at: Date.now(), snapshot });
    writeBackups(backups);
}

function createManualBackup() {
    createDashboardBackup('Thủ công');
    renderBackupModal();
}

function openBackupModal() {
    renderBackupModal();
    openModal('backupModal');
}

function renderBackupModal() {
    const el = getEl('backupList');
    if (!el) return;
    const backups = readBackups();
    if (!backups.length) {
        el.className = 'trash-list empty';
        el.textContent = 'Chưa có backup.';
        return;
    }
    el.className = 'trash-list';
    el.innerHTML = backups.map((bk, index) => `<div class="trash-item"><div><strong>💾 ${escapeHTML(bk.reason || 'Backup')}</strong><small>${formatTrashTime(bk.at)}</small></div><div class="trash-actions"><button class="btn-success" onclick="restoreBackupAt(${index})">Khôi phục</button><button class="btn-real-danger" onclick="removeBackupAt(${index})">Xóa</button></div></div>`).join('');
}

function restoreBackupAt(index) {
    const backups = readBackups();
    const bk = backups[index];
    if (!bk) return;
    customConfirm('Khôi phục backup này sẽ thay thế dữ liệu dashboard hiện tại. Bạn có muốn tiếp tục?', '💾 Khôi phục backup').then(ok => {
        if (!ok) return;
        try {
            createDashboardBackup('Trước khi khôi phục');
            state.dashboardData = JSON.parse(bk.snapshot);
            saveData();
            renderBackupModal();
            closeModal('backupModal');
        } catch (err) {
            alert('Backup này bị lỗi hoặc không đọc được.');
        }
    });
}

function removeBackupAt(index) {
    const backups = readBackups();
    backups.splice(index, 1);
    writeBackups(backups);
    renderBackupModal();
}

function clearBackups() {
    customConfirm('Xóa toàn bộ backup phiên bản?', '💾 Xóa backup').then(ok => {
        if (!ok) return;
        writeBackups([]);
        renderBackupModal();
    });
}

const __v4SaveData = saveData;
saveData = function() {
    createDashboardBackup('Tự động');
    return __v4SaveData();
};

const __v4RenderDashboard = renderDashboard;
renderDashboard = function() {
    __v4RenderDashboard();
    renderTagFilterChips();
    document.querySelectorAll('.group-card').forEach(card => {
        const group = getGroup(card.dataset.id);
        const titleEl = card.querySelector('.group-title');
        if (group && titleEl && group.tags?.length && !titleEl.querySelector('.folder-tags-inline')) {
            titleEl.insertAdjacentHTML('beforeend', renderFolderTags(group));
        }
    });
};

const __v4CollectDashboardItems = collectDashboardItems;
collectDashboardItems = function() {
    return __v4CollectDashboardItems().map(item => ({ ...item, subtitle: `${item.subtitle || ''}${item.tags?.length ? ' · #' + item.tags.join(' #') : ''}` }));
};

// Ctrl+Z khôi phục nhanh mục mới xóa gần nhất
const __v4Keydown = function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        const active = document.activeElement;
        const isTyping = active && ['INPUT','TEXTAREA'].includes(active.tagName);
        if (!isTyping) {
            e.preventDefault();
            restoreLastTrashItem();
        }
    }
};
document.addEventListener('keydown', __v4Keydown);

window.addEventListener('load', () => {
    createDashboardBackup('Phiên mở trang');
    renderTagFilterChips();
});

// ========================================================================== 
// V6 - UI refinements: compact create group, cleaner modals/recent
// ========================================================================== 
function openCreateGroupTypeModal() {
    openModal('createGroupTypeModal');
}
function chooseCreateGroupType(type) {
    closeModal('createGroupTypeModal');
    openGroupModal(false, type);
}


// ========================================================================== 
// PATCH: CẬP NHẬT COUNTDOWN NGAY SAU KHI RENDER, NHƯNG KHÔNG GÂY GIẬT LAG
// ========================================================================== 
let __scheduleUIRaf = null;
function queueScheduleUIUpdate() {
    if (__scheduleUIRaf) cancelAnimationFrame(__scheduleUIRaf);
    __scheduleUIRaf = requestAnimationFrame(() => {
        __scheduleUIRaf = null;
        updateScheduleUI();
    });
}

const __fastRenderDashboard = renderDashboard;
renderDashboard = function() {
    __fastRenderDashboard();
    queueScheduleUIUpdate();
};

const __fastToggleAllGroups = toggleAllGroups;
toggleAllGroups = function(shouldOpen = true) {
    __fastToggleAllGroups(shouldOpen);
    queueScheduleUIUpdate();
};


// ========================================================================== 
// MOBILE LITE PATCH - GIẢM TẢI RIÊNG CHO ĐIỆN THOẠI, DESKTOP GIỮ NGUYÊN
// ========================================================================== 
const MOBILE_LITE_KEY = 'dashboardMobileLiteAppliedV1';
function isMobileLiteView() {
    return window.matchMedia('(max-width: 768px), (pointer: coarse) and (max-width: 900px)').matches;
}

function applyMobileLiteMode() {
    const mobile = isMobileLiteView();
    document.body.classList.toggle('mobile-lite', mobile);

    // Mobile: tắt hẳn canvas nền để giảm GPU/CPU. Desktop giữ nguyên.
    if (mobile && typeof isCanvasEnabled !== 'undefined') {
        isCanvasEnabled = false;
        localStorage.setItem('canvas-enabled', 'false');
        if (typeof applyCanvasState === 'function') applyCanvasState();
    }

    // Lần đầu vào mobile: thu gọn toàn bộ nhóm để không render quá nhiều bảng/lịch cùng lúc.
    if (mobile && !sessionStorage.getItem(MOBILE_LITE_KEY)) {
        state.dashboardData.forEach(group => group.collapsed = true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
        sessionStorage.setItem(MOBILE_LITE_KEY, '1');
    }
}

const __mobileLiteToggleCollapseGroup = toggleCollapseGroup;
toggleCollapseGroup = function(groupId) {
    const group = getGroup(groupId);
    const wasCollapsed = !!group?.collapsed;
    __mobileLiteToggleCollapseGroup(groupId);

    // Nếu mobile đang mở một nhóm đã lazy render, render lại riêng một lần để tạo nội dung thật.
    if (isMobileLiteView() && wasCollapsed) {
        queueMicrotask(() => {
            renderDashboard();
            const card = document.querySelector(`.group-card[data-id="${groupId}"]`);
            if (card) card.scrollIntoView({ block: 'nearest' });
        });
    }
};

const __mobileLiteSaveData = saveData;
saveData = function() {
    if (isMobileLiteView()) document.body.classList.add('mobile-lite-saving');
    __mobileLiteSaveData();
    if (isMobileLiteView()) setTimeout(() => document.body.classList.remove('mobile-lite-saving'), 180);
};

window.addEventListener('resize', () => {
    const wasMobile = document.body.classList.contains('mobile-lite');
    applyMobileLiteMode();
    if (wasMobile !== document.body.classList.contains('mobile-lite')) renderDashboard();
}, { passive: true });

window.addEventListener('load', () => {
    applyMobileLiteMode();
    if (isMobileLiteView()) renderDashboard();
});


// ========================================================================== 
// DASHBOARD_MODAL_STACK_MANAGER - click nền/ESC chỉ đóng modal trên cùng
// ========================================================================== 
(function initModalStackManager() {
    if (window.__dashboardModalStackManagerReady) return;
    window.__dashboardModalStackManagerReady = true;

    function getTopActiveModal() {
        const activeModals = [...document.querySelectorAll('.modal-overlay.active')];
        if (!activeModals.length) return null;
        return activeModals.sort((a, b) => (Number(getComputedStyle(a).zIndex) || 0) - (Number(getComputedStyle(b).zIndex) || 0)).at(-1);
    }

    document.addEventListener('mousedown', function(e) {
        const topModal = getTopActiveModal();
        if (!topModal) return;
        if (e.target === topModal) closeModal(topModal.id);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape') return;
        const topModal = getTopActiveModal();
        if (topModal) closeModal(topModal.id);
    });
})();


// ==========================================================================

// ==========================================================================

// ==========================================================================// ==========================================================================

// ==========================================================================

// ==========================================================================
// SIDEBAR PRO MANAGER
// Desktop: rail/sidebar chuyên nghiệp, click nút mở rộng/thu gọn, không tự sinh nhiều nút.
// Mobile: drawer trượt chuẩn; mở drawer thì ẩn nút ☰, không có ghim.
// ==========================================================================
const SIDEBAR_PRO_KEY = "dashboardSidebarProCollapsed";

function isSidebarProDesktop() {
    return window.matchMedia("(min-width: 769px)").matches;
}

function cleanupSidebarExperimentNodes() {
    [
        "desktopSidebarToggle",
        "edgeSidebarHotspot",
        "sidebarV2Hotspot",
        "sidebarV2Rail",
        "sidebarV2PinBtn",
        "sidebarV3Hotspot",
        "sidebarV3Rail",
        "sidebarV3PinBtn",
        "sidebarFinalHotspot",
        "sidebarFinalRail",
        "sidebarFinalPinBtn"
    ].forEach(id => document.getElementById(id)?.remove());

    document.querySelectorAll(
        ".desktop-sidebar-toggle,.edge-sidebar-pin-btn,.sidebar-v2-pin-btn,.sidebar-v3-pin-btn,.sidebar-final-pin-btn"
    ).forEach(el => el.remove());

    document.body.classList.remove(
        "sidebar-collapsed-desktop",
        "edge-sidebar-enabled","edge-sidebar-open","edge-sidebar-pinned",
        "sidebar-v2-enabled","sidebar-v2-open","sidebar-v2-pinned",
        "sidebar-v3-enabled","sidebar-v3-open","sidebar-v3-pinned",
        "sidebar-final-enabled","sidebar-final-open","sidebar-final-pinned"
    );
}

function setSidebarProCollapsed(collapsed) {
    if (!isSidebarProDesktop()) {
        document.body.classList.remove("sidebar-pro-collapsed");
        return;
    }

    document.body.classList.toggle("sidebar-pro-collapsed", Boolean(collapsed));
    localStorage.setItem(SIDEBAR_PRO_KEY, collapsed ? "true" : "false");
    updateSidebarProToggle();
}

function toggleSidebarPro() {
    const collapsed = document.body.classList.contains("sidebar-pro-collapsed");
    setSidebarProCollapsed(!collapsed);
}

function updateSidebarProToggle() {
    const btn = document.getElementById("sidebarProToggle");
    if (!btn) return;

    const collapsed = document.body.classList.contains("sidebar-pro-collapsed");
    btn.innerHTML = collapsed ? "»" : "«";
    btn.title = collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar";
    btn.setAttribute("aria-label", collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar");
}

function initSidebarPro() {
    cleanupSidebarExperimentNodes();

    const sidebar = document.querySelector(".app-sidebar");
    if (!sidebar) return;

    // Desktop toggle: chỉ một nút duy nhất, nằm trong sidebar.
    let toggleBtn = document.getElementById("sidebarProToggle");
    if (!toggleBtn) {
        toggleBtn = document.createElement("button");
        toggleBtn.id = "sidebarProToggle";
        toggleBtn.type = "button";
        toggleBtn.className = "sidebar-pro-toggle";
        toggleBtn.onclick = (event) => {
            event.stopPropagation();
            toggleSidebarPro();
        };
        sidebar.appendChild(toggleBtn);
    }

    // Mobile close button: nếu HTML chưa có thì tự thêm.
    if (!sidebar.querySelector(".sidebar-close")) {
        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "sidebar-close";
        closeBtn.innerHTML = "×";
        closeBtn.setAttribute("aria-label", "Đóng menu");
        closeBtn.onclick = () => toggleMobileSidebar(false);
        const logo = sidebar.querySelector(".sidebar-logo");
        if (logo?.nextSibling) sidebar.insertBefore(closeBtn, logo.nextSibling);
        else sidebar.prepend(closeBtn);
    }

    sidebar.querySelectorAll("button").forEach(btn => {
        if (btn.id === "sidebarProToggle" || btn.classList.contains("sidebar-close")) return;
        const label = btn.querySelector("span")?.textContent?.trim();
        if (label) btn.title = label;
    });

    const apply = () => {
        const desktop = isSidebarProDesktop();
        document.body.classList.toggle("sidebar-pro-enabled", desktop);

        if (!desktop) {
            document.body.classList.remove("sidebar-pro-collapsed");
            updateSidebarProToggle();
            return;
        }

        const savedValue = localStorage.getItem(SIDEBAR_PRO_KEY);
        const savedCollapsed = savedValue === null ? true : savedValue === "true";
        document.body.classList.toggle("sidebar-pro-collapsed", savedCollapsed);
        updateSidebarProToggle();
    };

    window.addEventListener("resize", apply);
    apply();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebarPro);
} else {
    initSidebarPro();
}


// ==========================================================================
// RESTORE DESKTOP BACKGROUND CANVAS
// Desktop luôn giữ hiệu ứng nền/canvas. Mobile vẫn có thể giảm tải.
 // ==========================================================================
function ensureDesktopBackgroundCanvas() {
    const isDesktop = window.matchMedia("(min-width: 769px)").matches;
    const canvasEl = document.getElementById("bgCanvas");

    if (!canvasEl) return;

    if (isDesktop) {
        // Không ép localStorage nếu người dùng tự tắt bằng nút,
        // nhưng nếu đang bị mobile-lite/patch cũ ẩn bằng style thì mở lại.
        if (localStorage.getItem("canvas-enabled") !== "false") {
            isCanvasEnabled = true;
            canvasEl.style.display = "block";
            resizeCanvas?.();

            if (!animationFrameId && typeof drawBackground === "function") {
                animationFrameId = requestAnimationFrame(drawBackground);
            }
        }
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureDesktopBackgroundCanvas);
} else {
    ensureDesktopBackgroundCanvas();
}
window.addEventListener("resize", ensureDesktopBackgroundCanvas);

// ==========================================================================
// BACKUP PIN + DRIVE FULL SYNC UPGRADE
// Lưu thêm thùng rác + backup lên Google Drive, và backup đã ghim không bị xoá bởi giới hạn.
// ==========================================================================
const BACKUP_MAX_UNPINNED = 20;
const DRIVE_PAYLOAD_SCHEMA = 2;

function normalizeBackupListForLimit(items = []) {
    const seen = new Set();
    const normalized = (Array.isArray(items) ? items : [])
        .filter(Boolean)
        .map(item => ({ ...item, id: item.id || ('bk_' + (item.at || Date.now()) + '_' + Math.random().toString(36).slice(2, 6)) }))
        .filter(item => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
        })
        .sort((a, b) => Number(b.at || 0) - Number(a.at || 0));

    const pinned = normalized.filter(item => item.pinned === true);
    const unpinned = normalized.filter(item => item.pinned !== true).slice(0, BACKUP_MAX_UNPINNED);
    return [...pinned, ...unpinned];
}

// Ghi đè writeBackups cũ: giữ toàn bộ backup đã ghim, chỉ giới hạn 20 backup chưa ghim.
writeBackups = function(items) {
    writeJSONStore(BACKUP_KEY, normalizeBackupListForLimit(items));
};

function toggleBackupPinAt(index) {
    const backups = readBackups();
    const bk = backups[index];
    if (!bk) return;
    bk.pinned = !bk.pinned;
    writeBackups(backups);
    renderBackupModal();
}

// Render lại modal backup có nút ghim.
renderBackupModal = function() {
    const el = getEl('backupList');
    if (!el) return;
    const backups = readBackups();
    if (!backups.length) {
        el.className = 'trash-list empty';
        el.textContent = 'Chưa có backup.';
        return;
    }

    el.className = 'trash-list backup-list';
    el.innerHTML = backups.map((bk, index) => {
        const isPinned = bk.pinned === true;
        return `
            <div class="trash-item backup-item ${isPinned ? 'backup-pinned' : ''}">
                <div>
                    <strong>${isPinned ? '📌' : '💾'} ${escapeHTML(bk.reason || 'Backup')}</strong>
                    <small>${formatTrashTime(bk.at)}${isPinned ? ' · Đã ghim' : ''}</small>
                </div>
                <div class="trash-actions backup-actions">
                    <button class="btn-secondary backup-pin-btn ${isPinned ? 'active' : ''}" onclick="toggleBackupPinAt(${index})" title="${isPinned ? 'Bỏ ghim backup' : 'Ghim backup'}">${isPinned ? '📌' : '📍'}</button>
                    <button class="btn-success" onclick="restoreBackupAt(${index})">Khôi phục</button>
                    <button class="btn-real-danger" onclick="removeBackupAt(${index})">Xóa</button>
                </div>
            </div>`;
    }).join('');
};

// Xóa backup: nếu backup đang ghim thì hỏi kỹ hơn.
removeBackupAt = function(index) {
    const backups = readBackups();
    const bk = backups[index];
    if (!bk) return;

    const doRemove = () => {
        backups.splice(index, 1);
        writeBackups(backups);
        renderBackupModal();
    };

    if (bk.pinned) {
        customConfirm('Backup này đang được ghim. Bạn vẫn muốn xóa nó?', '📌 Xóa backup đã ghim').then(ok => {
            if (ok) doRemove();
        });
    } else {
        doRemove();
    }
};

// Xóa backup hàng loạt: giữ backup đã ghim lại để tránh xóa nhầm.
clearBackups = function() {
    customConfirm('Xóa toàn bộ backup chưa ghim? Backup đã ghim sẽ được giữ lại.', '💾 Xóa backup').then(ok => {
        if (!ok) return;
        const pinned = readBackups().filter(item => item.pinned === true);
        writeBackups(pinned);
        renderBackupModal();
    });
};

function buildDrivePayload() {
    return {
        schema: DRIVE_PAYLOAD_SCHEMA,
        updatedAt: Date.now(),
        dashboardData: state.dashboardData,
        trashItems: readJSONStore(TRASH_KEY, []),
        backups: readBackups()
    };
}

function applyDrivePayload(cloudData) {
    // Tương thích dữ liệu Drive cũ: trước đây file chỉ là mảng dashboardData.
    if (Array.isArray(cloudData)) {
        state.dashboardData = cloudData;
        return;
    }

    if (!cloudData || typeof cloudData !== 'object') return;

    if (Array.isArray(cloudData.dashboardData)) {
        state.dashboardData = cloudData.dashboardData;
    }

    if (Array.isArray(cloudData.trashItems)) {
        localStorage.setItem(TRASH_KEY, JSON.stringify(cloudData.trashItems));
    }

    if (Array.isArray(cloudData.backups)) {
        localStorage.setItem(BACKUP_KEY, JSON.stringify(normalizeBackupListForLimit(cloudData.backups)));
    }
}

// Ghi đè sync Drive cũ: lưu cả dashboard + thùng rác + backup.
syncToGoogleDrive = async function(isSilent = false) {
    if (!gapi.client.getToken()) return isSilent ? null : alert('Chưa liên kết Google!');
    const syncBtn = getEl('btn-sync-google');
    if (!isSilent && syncBtn) syncBtn.innerHTML = '⏳ Đang sync...';

    const localData = JSON.stringify(buildDrivePayload());

    try {
        if (!googleFileId) {
            const res = await gapi.client.drive.files.list({ q: "name = 'workspace_data.json'", spaces: 'appDataFolder' });
            if (res.result.files?.length > 0) googleFileId = res.result.files[0].id;
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
            const body = `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${localData}\r\n--${boundary}--`;
            googleFileId = (await gapi.client.request({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: { uploadType: 'multipart' },
                headers: { 'Content-Type': `multipart/related; boundary="${boundary}"` },
                body
            })).result.id;
        }

        if (!isSilent) alert('📤 Đồng bộ Drive thành công!\nĐã lưu cả Dashboard, Thùng rác và Backup.');
    } catch (e) {
        if (!isSilent) alert('Lỗi sync: ' + e.message);
    } finally {
        if (syncBtn) syncBtn.innerHTML = '🔄 Đồng bộ Drive';
    }
};

// Ghi đè tải Drive cũ: đọc được cả định dạng cũ và định dạng mới.
fetchFileFromGoogleDrive = async function() {
    try {
        const response = await gapi.client.drive.files.list({
            q: "name = 'workspace_data.json'",
            spaces: 'appDataFolder',
            fields: 'files(id, name)'
        });
        const files = response.result.files;

        if (files?.length > 0) {
            googleFileId = files[0].id;
            const cloudData = (await gapi.client.drive.files.get({ fileId: googleFileId, alt: 'media' })).result;

            const isValid = Array.isArray(cloudData) || (cloudData && Array.isArray(cloudData.dashboardData));
            if (isValid) {
                const ok = await customConfirm(
                    'Tải dữ liệu mới từ Cloud về máy [Đồng ý], hoặc Ghi đè dữ liệu máy lên Cloud [Giữ lại]?\n\nDữ liệu Cloud mới có thể gồm Dashboard + Thùng rác + Backup.',
                    '⚠️ XUNG ĐỘT DỮ LIỆU'
                );

                if (ok) {
                    applyDrivePayload(cloudData);
                    state.dashboardData.forEach(g => { if (g.pinKey) g.isLocked = true; });
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
                    renderDashboard();
                    updateScheduleUI();
                    renderBackupModal?.();
                    renderTrashModal?.();
                    alert('📥 Tải dữ liệu thành công!');
                } else {
                    syncToGoogleDrive(false);
                }
            }
        } else {
            syncToGoogleDrive(true);
        }
    } catch (err) {
        console.error(err);
    }
};

// Nếu thùng rác/backup thay đổi mà đã liên kết Google thì sync ngầm lên Drive.
const __driveFullSyncWriteJSONStore = writeJSONStore;
writeJSONStore = function(key, value) {
    __driveFullSyncWriteJSONStore(key, value);
    if ((key === TRASH_KEY || key === BACKUP_KEY) && gapiInited && gisInited && gapi.client.getToken()) {
        clearTimeout(window.__driveMetaSyncTimer);
        window.__driveMetaSyncTimer = setTimeout(() => syncToGoogleDrive(true), 600);
    }
};

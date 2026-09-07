// ==========================================================================
// 1. CẤU HÌNH & KHỞI TẠO BIẾN TOÀN CỤC (CONFIG & STATE)
// ==========================================================================
const CLIENT_ID = '109577502358-ifqvdpaumccs5sv6vtr5rphfnq815up0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAc5DuR0oxr7yEdTQnvIIS-PRKGtIfWrro';
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive openid email profile';

const REQUIRED_GOOGLE_SCOPE_GROUPS = {
    profile: ['https://www.googleapis.com/auth/userinfo.profile', 'profile'],
    email: ['https://www.googleapis.com/auth/userinfo.email', 'email'],
    drive: ['https://www.googleapis.com/auth/drive'],
    appdata: ['https://www.googleapis.com/auth/drive.appdata'],
    openid: ['openid']
};

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Shared account registry stored in one Google Drive JSON file.
const ACCOUNT_REGISTRY_FILE_ID = '1RALrPeij_phHv0xXJ7EYSOdwS4CdbcHp';
const ACCOUNT_HEARTBEAT_MS = 30000;
const WEB_SESSION_ID_KEY = 'dashboardWebSessionId';


const EMOJI_GROUPS = [
    { name: "Recent", key: "recent", icons: [] },
    { name: "Basic", key: "basic", icons: ["NONE","⭐","🌟","✨","🔥","⚡","🚀","🎯","🏆","✅","☑️","✔️","❌","⚠️","🚨","📌","📍","🔔","🔕"] },
    { name: "Folder", key: "folder", icons: ["📁","📂","🗂️","🗃️","🗄️","📦","🧺","🧳","🎒","🗑️","📎","🖇️","🧷","✂️"] },
    { name: "Note", key: "note", icons: ["📝","📋","📑","📄","📃","📜","📰","🗞️","📒","📓","📔","📕","📗","📘","📙","📚","📖","✏️","🖊️","🖋️","✒️","📐","📏"] },
    { name: "Schedule", key: "time", icons: ["📅","🗓️","📆","⏰","⏱️","⏲️","⌛","⏳","🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛","🌅","🌄","🌇","🌆","🌃","🌙","🌞"] },
    { name: "Tech", key: "tech", icons: ["💻","🖥️","🖨️","⌨️","🖱️","🖲️","💾","💿","📀","💽","📱","📲","☎️","📞","📟","📠","📡","📶","🛰️","🌐","🔗","⚙️","🛠️","🔧","🔨","🔩","🧰","🧲","🧪","🔬","🔭","🤖","🧠","💡","🔌","🔋","🪫","📺","📷","📸","🎥","🎬","🎙️","🎤","🎧","📻"] },
    { name: "Task", key: "work", icons: ["💼","👔","🧑‍💼","👨‍💼","👩‍💼","🏢","🏬","🏭","🏦","🏪","🏫","🏛️","🏗️","🧾","💳","💰","💵","💶","💷","💴","🪙","💸","🏷️","🛒","🛍️","📊","📈","📉"] },
    { name: "Logistics", key: "logistics", icons: ["📦","🚚","🚛","🚜","🏭","🏗️","📍","🧭","🗺️","🚢","✈️","🚆","🚄","🚅","🚉","🚲","🏍️","🚗","🚕","🚙","🛵","⛽","🚦","🛣️"] },
    { name: "Security", key: "security", icons: ["🔒","🔓","🔐","🔑","🗝️","🛡️","⚔️","🚨","🚔","👮","🕵️","🛂","🧬","☢️","☣️","⛔","🚫"] },
    { name: "Contact", key: "contact", icons: ["💬","🗨️","🗯️","📢","📣","📯","📨","📩","✉️","📧","📬","📭","📪","📫","📮","☎️","📞","🤝","👋","🙏"] },
    { name: "Colors & status", key: "status", icons: ["🔴","🟠","🟡","🟢","🔵","🟣","🟤","⚫","⚪","⭕","🔷","🔶","🔹","🔸","🔺","🔻","💠","♦️","♣️","♠️","♥️","💯"] },
    { name: "Favorites", key: "love", icons: ["❤️","🩷","🧡","💛","💚","🩵","💙","💜","🤎","🖤","🤍","💖","💗","💝","💕","💞","💘","💓","💟"] },
    { name: "Design", key: "design", icons: ["🎨","🖌️","🖍️","🧵","🪡","🎭","🎬","🎼","🎵","🎶","🎤","🎧","📷","📸","🖼️","🧩"] },
    { name: "Home", key: "home", icons: ["🏠","🏡","🏢","🛏️","🛋️","🚪","🪟","🪑","🧹","🧽","🧴","🪣","🛁","🚿","🚽","🍽️","🍳","☕","🧋","🥤"] },
    { name: "Food", key: "food", icons: ["🍔","🍕","🍜","🍚","🍱","🍎","🍉","🍇","🍓","🥑","🥗","🍞","🥐","🥚","🍗","🍖","🍤","🍰","🎂","🍫"] },
    { name: "People", key: "people", icons: ["👤","👥","🧑","👨","👩","🧒","👴","👵","🙋","🙆","🙇","👏","👍","👎","👌","✌️","🤞","🤟","🤙","💪","🫡"] },
    { name: "Faces", key: "face", icons: ["😀","😁","😂","🤣","😊","😇","🙂","😉","😍","😘","😎","🤩","🥳","😴","🤔","🤯","😭","😡","🥶","🥵","😱","🤗","🤭"] },
    { name: "Fun", key: "fun", icons: ["🎉","🎊","🎁","🎈","🎂","🍰","🎆","🎇","🎃","🎄","🎅","🎀","🎗️","🎮","🕹️","🎲","♟️","🎯","🎰"] },
    { name: "Nature", key: "nature", icons: ["🌱","🌿","🍀","🌴","🌳","🌲","🌵","🌷","🌹","🌺","🌸","🌼","🌻","🍁","🍂","🍃","☀️","⛅","☁️","🌧️","⛈️","❄️","🌈"] },
    { name: "Animals", key: "animal", icons: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🦅","🦉","🦄","🐝","🦋","🐢","🐬","🐳","🦈","🐙"] }
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
            id: "g1", title: "GHTK System", emoji: "🚀", type: "link",
            links: [{ name: "Titan Admin", url: "https://titan-admin.ghtk.vn", emoji: "⚙️" }]
        },
        {
            id: "g2", title: "Core Schedule", emoji: "📅", type: "schedule",
            schedules: [
                { title: "Daily Standup", date: "2026-06-08", time: "08:30", content: "Report progress on the level-4 and special-address classification tool.", important: true, emoji: "⏰" },
                { title: "Fix bug API", date: "2026-06-08", time: "14:00", content: "Fix the token payload issue in the titan-admin system.", important: false, emoji: "💻" }
            ]
        }
    ]
};

let gapiInited = false;
let gisInited = false;
let tokenClient;
let googleFileId = null;
let pressTimer;

const GOOGLE_ACCOUNT_PROFILE_KEY = 'dashboardGoogleAccountProfile';
let googleAccountProfile = (() => {
    try { return JSON.parse(localStorage.getItem(GOOGLE_ACCOUNT_PROFILE_KEY)) || null; }
    catch (_) { return null; }
})();

let adminAccountsCache = [];
let adminAuditCache = [];
let adminRegistryCache = null;
let accountHeartbeatTimer = null;
let hasTrackedCurrentSession = false;
let registryOwnerInfo = null;
let currentAccountAccess = { checked: false, role: 'user', blocked: false, sessionRevoked: false };
let adminCurrentUserRole = null;
let adminActiveTab = 'users';
let dashboardWebSessionId = sessionStorage.getItem(WEB_SESSION_ID_KEY) || (() => {
    const id = (crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    sessionStorage.setItem(WEB_SESSION_ID_KEY, id);
    return id;
})();


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

function customConfirm(message, title = "❓ Confirm action") {
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

    const allGroup = { name: "All", key: "all", icons: EMOJI_LIST };
    const recentGroup = { name: "Recent", key: "recent", icons: recentIcons };
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
                <button type="button" class="emoji-item ${emoji === state.selectedEmoji ? 'selected' : ''}" data-emoji="${emoji}" title="${emoji === 'NONE' ? 'No icon' : emoji}">
                    ${emoji === "NONE" ? `<span class="emoji-none-label">🚫 None</span>` : emoji}
                </button>
            `).join('')
            : `<div class="emoji-empty">No matching icons found</div>`;
    };

    grid.innerHTML = `
        <div class="emoji-picker-shell" id="${pickerId}">
            <div class="emoji-search-wrap">
                <span>🔎</span>
                <input type="search" class="emoji-search-input" placeholder="Search icons or groups..." autocomplete="off">
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
        acc.kanban += Array.isArray(group.kanban)
        ? group.kanban.length : Array.isArray(group.kanban?.boards) ? group.kanban.boards.length : 0;
        
        return acc;
    }, { groups: 0, links: 0, notes: 0, kanban: 0, schedules: 0, todayImportant: 0 });
}

function updateDashboardStats() {
    const stats = getDashboardStats();
    const setText = (id, value) => { const el = getEl(id); if (el) el.textContent = value; };
    setText('statGroups', stats.groups);
    setText('statLinks', stats.links);
    setText('statNotes', stats.notes);
    setText('statKabans', stats.kanban); 
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

function getGroupContentAreaClass(type) {
    return type === 'kanban' ? 'kanban-area' : `${type}s-area`;
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
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-sub)">No groups yet.</p>`; 
        return;
    }
    if (groupsToRender.length === 0) {
        container.innerHTML = `<div class="empty-search-state">🔎 No matching data found.<br><button class="btn-secondary" onclick="clearDashboardSearch()">Clear search</button></div>`;
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
            lockOverlayHTML = `<button class="lock-overlay-btn" onclick="triggerUnlockGroup('${group.id}')">🔒 Click to unlock</button>`;
        }
        
        groupCard.className = cardClassName;
        groupCard.setAttribute('data-id', group.id);
        groupCard.oncontextmenu = (e) => openContextMenu(e, `group-${group.type}`, group.id);

        const gEmoji = (group.emoji && group.emoji !== "NONE") ? `<span>${group.emoji}</span> ` : '';
        const tags = { link: 'Links', note: 'Notes', schedule: 'Schedule', kanban: 'Kanban' };
        const isCollapsed = group.collapsed || false;
        const mobileLite = typeof isMobileLiteView === 'function' && isMobileLiteView();
        const shouldLazyRenderContent = mobileLite && isCollapsed;
        const safeTitle = escapeHTML(group.title || 'Untitled');
        const areaClass = getGroupContentAreaClass(group.type);

        groupCard.innerHTML = `
            <div class="group-header" onclick="toggleCollapseGroup('${group.id}')">
                <span class="group-title">${gEmoji}${safeTitle}${renderFolderTags(group)}</span>
                <div class="group-header-actions">
                    <button class="favorite-btn ${group.favorite ? 'active' : ''}" onclick="toggleFavoriteGroup('${group.id}', event)" title="Pin favorite group">${group.favorite ? '⭐' : '☆'}</button>
                    <span class="group-tag tag-${group.type}">${tags[group.type]}</span>
                    <span class="arrow-${group.id}" style="font-size: 10px; transition: transform 0.2s; display: inline-block; transform: ${isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'}; color: var(--text-sub);">▼</span>
                </div>
            </div>
            ${lockOverlayHTML}
            <div class="group-content-wrapper">
                <div class="${areaClass}" data-group-id="${group.id}" style="${isCollapsed ? 'display: none;' : ''}"></div>
            </div>
        `;

        const contentArea = groupCard.querySelector(`.${areaClass}`);
        if (isLockedCheck) {
            contentArea.innerHTML = `<span class="no-data-text" style="display:flex; justify-content:center; align-items:center; gap:5px;">🔒 Content hidden</span>`;
            container.appendChild(groupCard);
            return; 
        }

        if (shouldLazyRenderContent) {
            const count = (group.links?.length || 0) + (group.notes?.length || 0) + (group.schedules?.length || 0) + getKanbanCardCount(group);
            contentArea.innerHTML = `<span class="no-data-text mobile-lite-placeholder">📱 Hidden ${count} items for better performance. Expand the group to load content.</span>`;
            container.appendChild(groupCard);
            return;
        }

        if (group.type === 'link') {
            if (!group.links?.length) contentArea.innerHTML = `<span class="no-data-text">Right-click to add a link...</span>`;
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
            if (!group.notes?.length) contentArea.innerHTML = `<span class="no-data-text">Right-click to add a note...</span>`;
            else {
                group.notes.forEach((note, idx) => {
                    const nEmoji = (note.emoji && note.emoji !== "NONE") ? `<span>${note.emoji}</span> ` : '';
                    const item = document.createElement('div');
                    item.className = 'item-wrapper';
                    item.setAttribute('data-index', idx);
                    const pinMark = note.pinned ? '📌 ' : '';
                    item.innerHTML = `<div class="note-button" oncontextmenu="openContextMenu(event, 'note', '${group.id}', ${idx})">${pinMark}${nEmoji}${escapeHTML(note.title || "Note")}</div>`;
                    item.querySelector('.note-button').onclick = () => showContentDetail(group.id, idx, 'note');
                    contentArea.appendChild(item);
                });
            }
        } 
        else if (group.type === 'schedule') {
            if (!group.schedules?.length) contentArea.innerHTML = `<span class="no-data-text">Right-click to add a schedule...</span>`;
            else {
                const wrapper = document.createElement('div');
                wrapper.className = 'schedule-table-wrapper';
                const table = document.createElement('table');
                table.className = 'schedule-table';
                table.innerHTML = `<thead><tr><th style="width:20%">Date</th><th style="width:20%">Day</th><th style="width:30%;text-align:center">Deadline</th><th style="width:30%">Task</th></tr></thead><tbody></tbody>`;
                
                const tbody = table.querySelector('tbody');
                const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
                        <td class="schedule-countdown-cell" style="text-align:center;font-size:11px;font-weight:bold;font-family:monospace">⏳ Calculating...</td>
                        <td class="schedule-name">${sch.important ? '⚠️ ' : ''}${escapeHTML(sch.title || "")}</td>
                    `;
                    tbody.appendChild(row);
                });
                wrapper.appendChild(table);
                contentArea.appendChild(wrapper);
            }
        }
        else if (group.type === 'kanban') {
            if (!isCollapsed) {
                renderKanbanBoard(group, contentArea);
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

    // Kanban và mobile-lite cần render lại khi mở ra vì lúc thu gọn mình không render nội dung để tránh lag.
    // Render lại toàn dashboard giúp đồng bộ arrow, placeholder và Sortable/drag-drop.
    renderDashboard();
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
        if (titleEl) titleEl.innerText = "📝 Edit Group Name/Icon";
        if (nameInput) nameInput.value = group ? group.title : '';
        const tagInput = getEl('groupTagsInput'); if (tagInput) tagInput.value = tagsToString(group?.tags);
        buildEmojiPicker('groupEmojiGrid', group ? (group.emoji || "NONE") : "NONE");
    } else {
        const typeTexts = { link: "Link Group", note: "Note Group", schedule: "Schedule Group", kanban: "Kanban Group" };
        if (titleEl) titleEl.innerText = `📌 Create ${typeTexts[defaultType] || 'Group'} New`;
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
        const newGroup = { id: 'g_' + Date.now(), title: name, emoji: state.selectedEmoji, type: state.currentGroupType, tags };
        if (state.currentGroupType === 'kanban') {
            newGroup.kanban = createDefaultKanbanBoard();
        } else {
            newGroup[`${state.currentGroupType}s`] = [];
        }
        state.dashboardData.push(newGroup);
    }
    saveData(); 
    closeModal('groupModal');
}




// ============================================================================
// NOTE DEADLINE CALENDAR
// ============================================================================
let noteDeadlineCalendarView = new Date();
let noteDeadlineCalendarSelected = null;

function pad2(value) {
    return String(value).padStart(2, '0');
}

function localDateTimeValue(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function parseLocalDateTimeValue(value) {
    if (!value) return null;
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, y, m, d, hh, mm] = match;
    const date = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), 0, 0);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatNoteDeadlineDisplay(value) {
    const date = parseLocalDateTimeValue(value);
    if (!date) return 'No deadline';
    return date.toLocaleString([], {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function updateNoteDeadlineButton() {
    const value = getEl('noteDeadlineInput')?.value || '';
    const display = getEl('noteDeadlineDisplay');
    const button = getEl('noteDeadlineButton');
    if (display) display.textContent = formatNoteDeadlineDisplay(value);
    if (button) button.classList.toggle('has-value', !!value);
}

function populateNoteDeadlineTime() {
    const hour = getEl('noteDeadlineHour');
    const minute = getEl('noteDeadlineMinute');
    if (!hour || !minute || hour.options.length) return;

    hour.innerHTML = Array.from({ length: 24 }, (_, i) =>
        `<option value="${pad2(i)}">${pad2(i)}</option>`
    ).join('');

    minute.innerHTML = ['00','05','10','15','20','25','30','35','40','45','50','55']
        .map(v => `<option value="${v}">${v}</option>`)
        .join('');
}

function openNoteDeadlinePicker() {
    populateNoteDeadlineTime();

    const current = parseLocalDateTimeValue(getEl('noteDeadlineInput')?.value || '');
    const now = new Date();
    const base = current || now;

    noteDeadlineCalendarSelected = current ? new Date(current) : null;
    noteDeadlineCalendarView = new Date(base.getFullYear(), base.getMonth(), 1);

    if (getEl('noteDeadlineHour')) getEl('noteDeadlineHour').value = current ? pad2(current.getHours()) : '18';
    if (getEl('noteDeadlineMinute')) {
        const minute = current ? current.getMinutes() : 0;
        const rounded = Math.round(minute / 5) * 5;
        getEl('noteDeadlineMinute').value = pad2(rounded === 60 ? 55 : rounded);
    }

    renderNoteDeadlineCalendar();
    openModal('noteDeadlineModal');
}

function changeNoteDeadlineMonth(delta) {
    noteDeadlineCalendarView = new Date(
        noteDeadlineCalendarView.getFullYear(),
        noteDeadlineCalendarView.getMonth() + delta,
        1
    );
    renderNoteDeadlineCalendar();
}

function noteDeadlineGoToday() {
    const now = new Date();
    noteDeadlineCalendarView = new Date(now.getFullYear(), now.getMonth(), 1);
    renderNoteDeadlineCalendar();
}

function sameCalendarDay(a, b) {
    return a && b &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function renderNoteDeadlineCalendar() {
    const grid = getEl('noteCalendarGrid');
    const label = getEl('noteCalendarMonthLabel');
    if (!grid || !label) return;

    const year = noteDeadlineCalendarView.getFullYear();
    const month = noteDeadlineCalendarView.getMonth();
    label.textContent = noteDeadlineCalendarView.toLocaleDateString([], { month:'long', year:'numeric' });

    const first = new Date(year, month, 1);
    const mondayIndex = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const today = new Date();

    const cells = [];
    for (let i = 0; i < 42; i++) {
        let date;
        let outside = false;

        if (i < mondayIndex) {
            date = new Date(year, month - 1, daysInPrev - mondayIndex + i + 1);
            outside = true;
        } else if (i >= mondayIndex + daysInMonth) {
            date = new Date(year, month + 1, i - (mondayIndex + daysInMonth) + 1);
            outside = true;
        } else {
            date = new Date(year, month, i - mondayIndex + 1);
        }

        const selected = sameCalendarDay(date, noteDeadlineCalendarSelected);
        const isToday = sameCalendarDay(date, today);
        const timestamp = date.getTime();

        cells.push(`<button type="button"
            class="note-calendar-day ${outside ? 'outside' : ''} ${selected ? 'selected' : ''} ${isToday ? 'today' : ''}"
            onclick="selectNoteDeadlineDay(${timestamp})">
            <span>${date.getDate()}</span>
        </button>`);
    }

    grid.innerHTML = cells.join('');
    updateNoteDeadlineSummary();
}

function selectNoteDeadlineDay(timestamp) {
    const picked = new Date(timestamp);
    const hour = Number(getEl('noteDeadlineHour')?.value || 18);
    const minute = Number(getEl('noteDeadlineMinute')?.value || 0);
    picked.setHours(hour, minute, 0, 0);

    noteDeadlineCalendarSelected = picked;
    noteDeadlineCalendarView = new Date(picked.getFullYear(), picked.getMonth(), 1);
    renderNoteDeadlineCalendar();
}

function noteDeadlineQuick(type) {
    const now = new Date();
    const picked = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0, 0);
    if (type === 'tomorrow') picked.setDate(picked.getDate() + 1);
    if (type === 'week') picked.setDate(picked.getDate() + 7);

    noteDeadlineCalendarSelected = picked;
    noteDeadlineCalendarView = new Date(picked.getFullYear(), picked.getMonth(), 1);

    if (getEl('noteDeadlineHour')) getEl('noteDeadlineHour').value = '18';
    if (getEl('noteDeadlineMinute')) getEl('noteDeadlineMinute').value = '00';
    renderNoteDeadlineCalendar();
}

function updateNoteDeadlineSummary() {
    const summary = getEl('noteDeadlineSelectedSummary');
    if (!summary) return;

    if (!noteDeadlineCalendarSelected) {
        summary.textContent = 'No date selected';
        return;
    }

    const copy = new Date(noteDeadlineCalendarSelected);
    copy.setHours(
        Number(getEl('noteDeadlineHour')?.value || 18),
        Number(getEl('noteDeadlineMinute')?.value || 0),
        0, 0
    );

    summary.textContent = copy.toLocaleString([], {
        weekday:'long',
        day:'2-digit',
        month:'long',
        year:'numeric',
        hour:'2-digit',
        minute:'2-digit'
    });
}

function applyNoteDeadline() {
    if (!noteDeadlineCalendarSelected) {
        clearNoteDeadline();
        return;
    }

    const selected = new Date(noteDeadlineCalendarSelected);
    selected.setHours(
        Number(getEl('noteDeadlineHour')?.value || 18),
        Number(getEl('noteDeadlineMinute')?.value || 0),
        0, 0
    );

    if (getEl('noteDeadlineInput')) {
        getEl('noteDeadlineInput').value = localDateTimeValue(selected);
    }
    updateNoteDeadlineButton();
    closeModal('noteDeadlineModal');
}

function clearNoteDeadline() {
    noteDeadlineCalendarSelected = null;
    if (getEl('noteDeadlineInput')) getEl('noteDeadlineInput').value = '';
    updateNoteDeadlineButton();
    closeModal('noteDeadlineModal');
}

document.addEventListener('change', event => {
    if (event.target?.id === 'noteDeadlineHour' || event.target?.id === 'noteDeadlineMinute') {
        updateNoteDeadlineSummary();
    }
});

// ============================================================================
// NOTE V4 — CLEAN IMPLEMENTATION
// ============================================================================
let richNotePinned = false;
let savedNoteSelection = null;

function showAppNotice(message, title = 'Notice', icon = 'ℹ️') {
    if (getEl('appNoticeTitle')) getEl('appNoticeTitle').textContent = title;
    if (getEl('appNoticeMessage')) getEl('appNoticeMessage').textContent = String(message ?? '');
    if (getEl('appNoticeIcon')) getEl('appNoticeIcon').textContent = icon;
    openModal('appNoticeModal');
}
window.alert = function(message) {
    showAppNotice(message, 'Notice', 'ℹ️');
};

function updateNoteHeaderIcon() {
    const emoji = state.selectedEmoji && state.selectedEmoji !== 'NONE' ? state.selectedEmoji : '📝';
    if (getEl('noteHeaderIcon')) getEl('noteHeaderIcon').textContent = emoji;
    if (getEl('noteIconButtonEmoji')) getEl('noteIconButtonEmoji').textContent = emoji;
}

function toggleRichNotePin() {
    richNotePinned = !richNotePinned;
    getEl('notePinBtn')?.classList.toggle('active', richNotePinned);
    if (getEl('notePinLabel')) getEl('notePinLabel').textContent = richNotePinned ? 'Pinned' : 'Pin';
}

function saveNoteSelection() {
    const editor = getEl('noteRichEditor');
    const selection = window.getSelection();
    if (!editor || !selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
        savedNoteSelection = range.cloneRange();
    }
}

function restoreNoteSelection() {
    if (!savedNoteSelection) return false;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedNoteSelection);
    return true;
}

function noteFormat(command, value = null) {
    restoreNoteSelection();
    getEl('noteRichEditor')?.focus();
    document.execCommand(command, false, value);
    saveNoteSelection();
}

function noteBlock(tag) {
    restoreNoteSelection();
    getEl('noteRichEditor')?.focus();
    document.execCommand('formatBlock', false, tag);
    saveNoteSelection();
}

function openNoteLinkModal() {
    saveNoteSelection();
    if (getEl('noteLinkUrlInput')) getEl('noteLinkUrlInput').value = '';
    openModal('noteLinkModal');
    setTimeout(() => getEl('noteLinkUrlInput')?.focus(), 60);
}

function insertNoteLink() {
    const raw = getEl('noteLinkUrlInput')?.value.trim();
    if (!raw) {
        showAppNotice('Please enter a URL.', 'Insert link', '🔗');
        return;
    }
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    closeModal('noteLinkModal');
    restoreNoteSelection();
    getEl('noteRichEditor')?.focus();
    document.execCommand('createLink', false, url);
    saveNoteSelection();
}

function openNoteTablePicker() {
    saveNoteSelection();
    if (getEl('noteTableRows')) getEl('noteTableRows').value = 3;
    if (getEl('noteTableCols')) getEl('noteTableCols').value = 3;
    openModal('noteTableModal');
}

function insertNoteTable() {
    const rows = Math.min(20, Math.max(1, Number(getEl('noteTableRows')?.value || 3)));
    const cols = Math.min(10, Math.max(1, Number(getEl('noteTableCols')?.value || 3)));

    let table = '<table><tbody>';
    for (let r = 0; r < rows; r++) {
        table += '<tr>';
        for (let c = 0; c < cols; c++) {
            table += r === 0 ? '<th><br></th>' : '<td><br></td>';
        }
        table += '</tr>';
    }
    table += '</tbody></table><p><br></p>';

    closeModal('noteTableModal');
    restoreNoteSelection();
    getEl('noteRichEditor')?.focus();
    document.execCommand('insertHTML', false, table);
    saveNoteSelection();
}

function noteIconSearchText(emoji) {
    const group = EMOJI_GROUPS.find(g => g.icons?.includes(emoji));
    return `${emoji} ${group?.name || ''}`.toLowerCase();
}

function openNoteIconPicker() {
    if (getEl('noteIconSearch')) getEl('noteIconSearch').value = '';
    renderNoteIconPicker();
    openModal('noteIconModal');
    setTimeout(() => getEl('noteIconSearch')?.focus(), 60);
}

function renderNoteIconPicker() {
    const grid = getEl('noteIconGrid');
    if (!grid) return;

    const query = (getEl('noteIconSearch')?.value || '').trim().toLowerCase();
    const icons = EMOJI_LIST.filter(icon => !query || noteIconSearchText(icon).includes(query));

    grid.innerHTML = icons.map(emoji => {
        const selected = emoji === state.selectedEmoji;
        const label = emoji === 'NONE' ? 'None' : emoji;
        return `<button type="button"
            class="note-v4-icon-item ${emoji === 'NONE' ? 'note-v4-icon-none' : ''} ${selected ? 'selected' : ''}"
            onclick="selectNoteIcon('${escapeHTML(emoji)}')"
            title="${emoji === 'NONE' ? 'No icon' : escapeHTML(emoji)}">${emoji === 'NONE' ? 'None' : label}</button>`;
    }).join('');
}

function selectNoteIcon(emoji) {
    state.selectedEmoji = emoji || 'NONE';
    saveRecentEmoji(state.selectedEmoji);
    updateNoteHeaderIcon();
    closeModal('noteIconModal');
}

function noteChecklistRowHTML(item = {}) {
    const id = item.id || (crypto.randomUUID
        ? crypto.randomUUID()
        : `check-${Date.now()}-${Math.random().toString(16).slice(2)}`);

    return `<div class="note-v4-checklist-row" data-item-id="${escapeHTML(id)}">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="updateRichChecklistCount()">
        <input type="text" value="${escapeHTML(item.text || '')}" placeholder="Checklist item"
               oninput="updateRichChecklistCount()">
        <button class="note-v4-checklist-remove" type="button"
                onclick="this.closest('.note-v4-checklist-row').remove(); updateRichChecklistCount();"
                title="Remove">×</button>
    </div>`;
}

function renderRichNoteChecklist(items = []) {
    const wrap = getEl('noteChecklistEditor');
    if (!wrap) return;
    wrap.innerHTML = (Array.isArray(items) ? items : []).map(noteChecklistRowHTML).join('');
    updateRichChecklistCount();
}

function addRichNoteChecklistItem() {
    const wrap = getEl('noteChecklistEditor');
    if (!wrap) return;
    wrap.insertAdjacentHTML('beforeend', noteChecklistRowHTML());
    updateRichChecklistCount();
    wrap.lastElementChild?.querySelector('input[type="text"]')?.focus();
}

function updateRichChecklistCount() {
    const rows = [...document.querySelectorAll('#noteChecklistEditor .note-v4-checklist-row')];
    const done = rows.filter(row => row.querySelector('input[type="checkbox"]')?.checked).length;

    if (getEl('noteChecklistCount')) {
        getEl('noteChecklistCount').textContent =
            `${rows.length} item${rows.length === 1 ? '' : 's'} · ${done} done`;
    }
    if (getEl('noteChecklistEmpty')) {
        getEl('noteChecklistEmpty').style.display = rows.length ? 'none' : 'block';
    }
}

function collectRichChecklist() {
    return [...document.querySelectorAll('#noteChecklistEditor .note-v4-checklist-row')]
        .map(row => ({
            id: row.dataset.itemId || '',
            text: row.querySelector('input[type="text"]')?.value.trim() || '',
            done: !!row.querySelector('input[type="checkbox"]')?.checked
        }))
        .filter(item => item.text);
}

function sanitizeRichNoteHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html || '';

    const allowedTags = new Set([
        'B','STRONG','I','EM','U','S','STRIKE','P','DIV','BR',
        'H2','H3','UL','OL','LI','A','TABLE','TBODY','THEAD','TR','TH','TD'
    ]);

    const walk = node => {
        [...node.children].forEach(child => {
            if (!allowedTags.has(child.tagName)) {
                child.replaceWith(...child.childNodes);
                return;
            }

            [...child.attributes].forEach(attr => {
                const name = attr.name.toLowerCase();
                if (!(child.tagName === 'A' && ['href','target','rel'].includes(name))) {
                    child.removeAttribute(attr.name);
                }
            });

            if (child.tagName === 'A') {
                const href = child.getAttribute('href') || '';
                if (!/^https?:\/\//i.test(href)) {
                    child.removeAttribute('href');
                } else {
                    child.setAttribute('target', '_blank');
                    child.setAttribute('rel', 'noopener noreferrer');
                }
            }
            walk(child);
        });
    };

    walk(template.content);
    return template.innerHTML;
}

function richNotePlainText(html) {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return div.innerText || '';
}

function categoryLabel(id) {
    return ({
        work: '💼 Work',
        personal: '👤 Personal',
        urgent: '🔥 Urgent',
        idea: '💡 Idea'
    })[id] || '';
}

function noteDeadlineLabel(value) {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString();
}

function deleteNoteFromEditor() {
    if (!state.isEditMode) {
        closeModal('noteModal');
        return;
    }

    const group = getGroup(state.activeGroupId);
    const note = group?.notes?.[state.activeIndex];
    if (!note) return;

    customConfirm(`Delete note "${note.title || 'Untitled note'}"?`, '🗑 Delete note')
        .then(ok => {
            if (!ok) return;
            group.notes.splice(state.activeIndex, 1);
            saveData();
            closeModal('noteModal');
        });
}

async function copyCurrentNote(groupId, noteIndex) {
    const group = getGroup(groupId);
    const note = group?.notes?.[noteIndex];
    if (!note) return;

    const body = note.content_html ? richNotePlainText(note.content_html) : (note.content || '');
    const checklist = Array.isArray(note.checklist)
        ? note.checklist.map(i => `${i.done ? '☑' : '☐'} ${i.text || ''}`).join('\n')
        : '';

    const text = [note.title || 'Untitled note', body, checklist ? `Checklist:\n${checklist}` : '']
        .filter(Boolean)
        .join('\n\n');

    try {
        await navigator.clipboard.writeText(text);
        showAppNotice('Note copied to clipboard.', 'Copied', '📋');
    } catch (_) {
        showAppNotice('Could not copy this note.', 'Copy failed', '⚠️');
    }
}

function editNoteFromReader(groupId, noteIndex) {
    closeModal('readModal');
    openItemModal('note', groupId, noteIndex);
}

function toggleNoteChecklistItem(groupId, noteIndex, checklistIndex, checked) {
    const group = getGroup(groupId);
    const note = group?.notes?.[noteIndex];
    if (!note || !Array.isArray(note.checklist) || !note.checklist[checklistIndex]) return;

    note.checklist[checklistIndex].done = !!checked;
    note.updated_at = new Date().toISOString();
    saveData();

    const row = [...document.querySelectorAll('.note-v4-view-check-row')].find(el =>
        el.dataset.noteGroup === String(groupId) &&
        el.dataset.noteIndex === String(noteIndex) &&
        el.dataset.checkIndex === String(checklistIndex)
    );

    if (row) row.classList.toggle('done', !!checked);

    const progress = getEl('noteV4ViewProgress');
    if (progress) {
        const done = note.checklist.filter(i => i.done).length;
        progress.textContent = `${done}/${note.checklist.length} done`;
    }
}

document.addEventListener('selectionchange', () => {
    const editor = getEl('noteRichEditor');
    const selection = window.getSelection();
    if (editor && selection?.rangeCount && editor.contains(selection.anchorNode)) {
        saveNoteSelection();
    }
});

function openItemModal(type, groupId, index = false) {
    state.activeGroupId = groupId;
    state.activeIndex = index;
    state.isEditMode = index !== false;

    const group = getGroup(groupId);
    if (!group) return;

    const item = state.isEditMode ? group[`${type}s`]?.[index] : null;

    if (type === 'link') {
        getEl('linkModalTitle').innerText = state.isEditMode ? "📝 Edit Button" : "➕ Add New Link";
        getEl('linkNameInput').value = item ? item.name : '';
        getEl('linkUrlInput').value = item ? item.url : '';
        buildEmojiPicker('linkEmojiGrid', item ? item.emoji : "NONE");
        openModal('linkModal');
        return;
    }

    if (type === 'note') {
        const old = item || {};

        getEl('noteModalTitle').textContent = state.isEditMode ? 'Edit note' : 'New note';
        getEl('noteModalSubtitle').textContent = state.isEditMode
            ? 'Update your note, formatting and checklist.'
            : 'Create a clear, structured note.';

        getEl('noteTitleInput').value = old.title || '';

        const editor = getEl('noteRichEditor');
        if (editor) {
            editor.innerHTML = old.content_html
                ? sanitizeRichNoteHTML(old.content_html)
                : (old.content ? `<p>${escapeHTML(old.content).replace(/\n/g, '<br>')}</p>` : '');
        }

        getEl('noteCategoryInput').value = old.category || '';
        getEl('noteDeadlineInput').value = old.deadline
            ? localDateTimeValue(new Date(old.deadline))
            : '';
        updateNoteDeadlineButton();

        richNotePinned = !!old.pinned;
        getEl('notePinBtn')?.classList.toggle('active', richNotePinned);
        if (getEl('notePinLabel')) {
            getEl('notePinLabel').textContent = richNotePinned ? 'Pinned' : 'Pin';
        }

        state.selectedEmoji = old.emoji || 'NONE';
        updateNoteHeaderIcon();
        renderRichNoteChecklist(old.checklist || []);

        if (getEl('noteDeleteFromEditorBtn')) {
            getEl('noteDeleteFromEditorBtn').style.display = state.isEditMode ? 'inline-flex' : 'none';
        }

        if (getEl('noteEditorStatus')) {
            getEl('noteEditorStatus').textContent = state.isEditMode && old.updated_at
                ? `Last edited ${new Date(old.updated_at).toLocaleString()}`
                : 'Not saved yet';
        }

        savedNoteSelection = null;
        openModal('noteModal');
        setTimeout(() => getEl('noteTitleInput')?.focus(), 50);
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
    }

    if (type === 'note') {
        const title = getEl('noteTitleInput')?.value.trim();
        if (!title) {
            showAppNotice('Please enter a note title.', 'Missing title', '📝');
            return;
        }

        const contentHTML = sanitizeRichNoteHTML(getEl('noteRichEditor')?.innerHTML || '');
        const deadlineRaw = getEl('noteDeadlineInput')?.value || '';
        const old = state.isEditMode ? group.notes[state.activeIndex] : null;
        const now = new Date().toISOString();

        targetData = {
            ...(old || {}),
            title,
            content: richNotePlainText(contentHTML),
            content_html: contentHTML,
            emoji: state.selectedEmoji || 'NONE',
            category: getEl('noteCategoryInput')?.value || '',
            deadline: deadlineRaw ? new Date(deadlineRaw).toISOString() : '',
            pinned: richNotePinned,
            checklist: collectRichChecklist(),
            created_at: old?.created_at || now,
            updated_at: now
        };
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
    
    if (type === 'Group') msg = `Are you sure you want to delete group "${group.title}" and all data inside?`;
    else if (type === 'Link') msg = `Are you sure you want to delete button "${group.links?.[state.activeIndex]?.name}"?`;
    else if (type === 'Note') msg = `Are you sure you want to delete note button "${group.notes?.[state.activeIndex]?.title}"?`;
    else if (type === 'Schedule') msg = `Are you sure you want to delete schedule milestone "${group.schedules?.[state.activeIndex]?.title}"?`;

    customConfirm(msg, "⚠️ Confirm deletion").then((confirmed) => {
        if (confirmed) {
            if (type === 'Group') state.dashboardData = state.dashboardData.filter(g => g.id !== state.activeGroupId);
            else group[`${type.toLowerCase()}s`].splice(state.activeIndex, 1);
            saveData(); 
        }
    });
}


function toggleNoteChecklistItem(groupId, noteIndex, checklistIndex, checked) {
    const group = getGroup(groupId);
    if (!group || !Array.isArray(group.notes)) return;

    const note = group.notes[noteIndex];
    if (!note || !Array.isArray(note.checklist) || !note.checklist[checklistIndex]) return;

    note.checklist[checklistIndex].done = !!checked;
    note.updated_at = new Date().toISOString();
    saveData();

    // Refresh only the visible checklist UI instead of closing/reopening the modal.
    const row = [...document.querySelectorAll('.note-detail-check-row')].find(el =>
        el.dataset.noteGroup === String(groupId) &&
        el.dataset.noteIndex === String(noteIndex) &&
        el.dataset.checkIndex === String(checklistIndex)
    );
    if (row) {
        row.classList.toggle('done', !!checked);
        const cb = row.querySelector('input[type="checkbox"]');
        if (cb) cb.checked = !!checked;
    }

    const progress = getEl('noteDetailChecklistProgress');
    if (progress) {
        const done = note.checklist.filter(i => i.done).length;
        progress.textContent = `${done}/${note.checklist.length} done`;
    }
}

function showContentDetail(groupId, index, type) {
    const group = getGroup(groupId);
    if (!group) return;

    const titleEl = getEl('readModalTitle');
    const bodyEl = getEl('readModalBody');
    const closeBtn = getEl('readModalCloseBtn');
    if (!titleEl || !bodyEl) return;

    getEl('readModal')?.classList.toggle('note-v4-reader', type === 'note');

    if (type === 'note') {
        const noteObj = group.notes[index];
        if (!noteObj) return;

        getEl('readModal')?.classList.add('note-v4-reader');
        if (closeBtn) closeBtn.className = "note-v4-secondary-btn";

        const icon = noteObj.emoji && noteObj.emoji !== 'NONE' ? noteObj.emoji : '📝';
        titleEl.innerHTML = `
            <div class="note-v4-reader-title">
                <span>${escapeHTML(icon)}</span>
                <span>${escapeHTML(noteObj.title || 'Untitled note')}</span>
            </div>
            <div class="note-v4-reader-actions">
                <button class="note-v4-reader-action" onclick="editNoteFromReader('${escapeHTML(String(groupId))}', ${index})">✏️ Edit</button>
                <button class="note-v4-reader-action" onclick="copyCurrentNote('${escapeHTML(String(groupId))}', ${index})">📋 Copy</button>
            </div>`;

        const chips = [];
        if (noteObj.pinned) chips.push('<span class="note-v4-reader-chip">📌 Pinned</span>');
        if (noteObj.category) chips.push(`<span class="note-v4-reader-chip">${escapeHTML(categoryLabel(noteObj.category))}</span>`);
        if (noteObj.deadline) chips.push(`<span class="note-v4-reader-chip">📅 ${escapeHTML(noteDeadlineLabel(noteObj.deadline))}</span>`);
        if (noteObj.updated_at) chips.push(`<span class="note-v4-reader-chip">Edited ${escapeHTML(formatAdminLastSeen(noteObj.updated_at))}</span>`);

        const contentHTML = noteObj.content_html
            ? sanitizeRichNoteHTML(noteObj.content_html)
            : linkify(noteObj.content || '');

        const checklist = Array.isArray(noteObj.checklist) ? noteObj.checklist : [];
        const checklistHTML = checklist.length ? `
            <section class="note-v4-view-checklist">
                <div class="note-v4-view-checklist-head">
                    <h4>Checklist</h4>
                    <span class="note-v4-view-progress" id="noteV4ViewProgress">${checklist.filter(i => i.done).length}/${checklist.length} done</span>
                </div>
                ${checklist.map((item, checkIdx) => `
                    <label class="note-v4-view-check-row ${item.done ? 'done' : ''}"
                           data-note-group="${escapeHTML(String(groupId))}"
                           data-note-index="${index}"
                           data-check-index="${checkIdx}">
                        <input type="checkbox" ${item.done ? 'checked' : ''}
                               onchange="toggleNoteChecklistItem('${escapeHTML(String(groupId))}', ${index}, ${checkIdx}, this.checked)">
                        <span class="note-v4-view-check-text">${escapeHTML(item.text || '')}</span>
                    </label>
                `).join('')}
            </section>` : '';

        bodyEl.innerHTML = `
            ${chips.length ? `<div class="note-v4-reader-meta">${chips.join('')}</div>` : ''}
            <div class="note-v4-view-content" id="contentToCopy">${contentHTML}</div>
            ${checklistHTML}`;
    }
    else if (type === 'schedule') {
        titleEl.style.color = "var(--schedule-accent)"; 
        if (closeBtn) closeBtn.className = "btn-success";
        const schObj = group.schedules[index];
        
        const displayStartDate = schObj.date.split('-').reverse().join('/');
        const displayEndDate = (schObj.endDate || schObj.date).split('-').reverse().join('/');

        titleEl.innerHTML = schObj.important ? `⚠️ ${schObj.title}` : `📅 Schedule: ${schObj.title}`;
        bodyEl.innerHTML = `
            <div class="single-schedule-detail">
                <h4>${schObj.title}</h4>
                <div class="schedule-info-line" style="margin-bottom:5px">🟢 Start: <b>${displayStartDate} at ${schObj.time || '00:00'}</b></div>
                <div class="schedule-info-line" style="margin-bottom:12px">🏁 End: <b>${displayEndDate} at ${schObj.endTime || schObj.time || '00:00'}</b></div>
                <label style="display:block;margin-bottom:6px;color:var(--text-sub);font-size:12px">📋 Task details:</label>
                <div class="schedule-tasks-list">${linkify(schObj.content)}</div>
            </div>`;
    }
    openModal('readModal');
}

function copyNoteContent(btnElement) {
    const content = getEl('contentToCopy')?.innerText || "";
    navigator.clipboard.writeText(content).then(() => {
        const originalText = btnElement.innerText;
        btnElement.innerText = "✅ Copied!";
        Object.assign(btnElement.style, { borderColor: "var(--schedule-accent)", color: "var(--schedule-accent)" });
        setTimeout(() => {
            btnElement.innerText = originalText;
            Object.assign(btnElement.style, { borderColor: "var(--border-color)", color: "var(--text-main)" });
        }, 2000);
    }).catch(err => console.error('Copy error: ', err));
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
                <input type="checkbox" class="sch-important-cb" ${important ? 'checked' : ''}> ⚠️ This milestone is important
            </label>
            ${!state.isEditMode ? `<button type="button" style="color:var(--danger-color);background:none;border:1px solid rgba(239,68,68,0.3);padding:4px 8px;font-size:11px;border-radius:4px;cursor:pointer" onclick="removeScheduleBlock('${blockId}')">Delete this milestone</button>` : ''}
        </div>
        <div class="form-group" style="margin-bottom:12px">
            <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Milestone title:</label>
            <input type="text" class="form-input sch-title-input" placeholder="Example: Team meeting..." value="${title}" required style="width:100%">
        </div>
        <div class="datetime-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Choose start date:</label>
                <input type="date" class="form-input sch-date-input" value="${date}" required style="width:100%">
            </div>
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Choose start time:</label>
                <input type="time" class="form-input sch-time-input" value="${time}" required style="width:100%">
            </div>
        </div>
        <div class="datetime-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Choose end date:</label>
                <input type="date" class="form-input sch-end-date-input" value="${endDate}" required style="width:100%">
            </div>
            <div class="form-group" style="margin:0">
                <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">Choose end time:</label>
                <input type="time" class="form-input sch-end-time-input" value="${endTime}" required style="width:100%">
            </div>
        </div>
        <div class="form-group" style="margin-bottom:8px">
            <label style="display:block;margin-bottom:4px;font-size:12px;color:var(--text-sub)">📋 Task list:</label>
            <textarea class="form-input sch-content-input" placeholder="Enter task details here..." rows="3" style="width:100%;resize:vertical">${content}</textarea>
        </div>
        <label style="display:block;margin:8px 0 4px;font-size:12px;color:var(--text-sub)">🏷️ Schedule tags:</label>
        <input type="text" class="form-input sch-tags-input" placeholder="Example: meeting, deadline" value="${tagsToString(data ? data.tags : [])}" style="width:100%;margin-bottom:8px">
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
        alert("You must keep at least one schedule block to enter data!");
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
        getEl('scheduleModalTitle').innerText = "📝 Edit Schedule Milestone";
        getEl('addScheduleBlockBtn').style.display = 'none';
        const schObj = getGroup(groupId).schedules[scheduleIndex];
        addScheduleBlock(schObj);
    } else {
        getEl('scheduleModalTitle').innerText = "📅 Add Schedule Milestone";
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
        alert("Please fill in all start and end time information!");
        return;
    }
    if (hasTimeError) {
        alert("❌ Error: End time cannot be earlier than start time!");
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
        // Bỏ qua schedules đang nằm trong group thu gọn/ẩn để mở hết/thu gọn/import không bị khựng.
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
            countdownText = "Expired";
            badgeColor = "#ef4444";
            past = true;
        } else if (diffToStartMs <= 0 && diffToEndMs >= 0) {
            countdownText = "Running";
            badgeColor = "#a855f7";
            running = true;
            pulse = Math.floor(diffToEndMs / 60000) <= 30;
        } else {
            const diffMin = Math.floor(diffToStartMs / 60000);
            const diffHour = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHour / 24);

            if (diffDay > 0) {
                countdownText = `Left ${diffDay} days`;
                badgeColor = "#10b981";
            } else if (diffHour > 0) {
                countdownText = `${diffHour}g : ${diffMin % 60}ph`;
                badgeColor = "#f59e0b";
            } else {
                countdownText = `🚨 Left ${diffMin} minutes`;
                badgeColor = "#ef4444";
                pulse = diffMin <= 30;
                if (pulse && Notification.permission === "granted" && !row.dataset.notified) {
                    new Notification("🚨 UPCOMING SCHEDULE!", { body: `Coming up: ${jobCell} (left ${diffMin} minutes).` });
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
        
        // Lọc ra các schedule diễn ra trong days hôm nay của group này
        const todaySchedules = group.schedules
            .map((item, originalIndex) => ({ ...item, originalIndex })) 
            .filter(item => {
                const [sY, sM, sD] = item.date.split('-').map(Number);
                const [eY, eM, eD] = (item.endDate || item.date).split('-').map(Number);
                return todayTime >= new Date(sY, sM - 1, sD).getTime() && todayTime <= new Date(eY, eM - 1, eD).getTime();
            })
            .sort((a, b) => a.time.localeCompare(b.time));
        
        if (todaySchedules.length > 0) {
            // Khởi tạo các cờ đánh dấu trạng thái cụ thể của từng Schedule trong group
            let hasUpcomingImportant = false; // Upcoming within 30 minutes and important
            let hasUpcomingNormal = false;    // Upcoming within 30 minutes and normal
            let hasImportant = false;         // Has important schedules
            let hasRunning = false;           // Has running schedules

            todaySchedules.forEach(item => {
                const exactStartDT = new Date(`${item.date}T${item.time}:00`);
                const exactEndDT = new Date(`${item.endDate || item.date}T${item.endTime || item.time}:00`);
                
                const diffToStartMs = exactStartDT - localNow;
                const isUpcoming = diffToStartMs > 0 && diffToStartMs <= 30 * 60 * 1000;

                // 1 & 2. Kiểm tra trạng thái SẮP DIỄN RA dưới 30 minutes
                if (isUpcoming) {
                    if (item.important) {
                        hasUpcomingImportant = true;
                    } else {
                        hasUpcomingNormal = true;
                    }
                }
                
                // 3. Kiểm tra schedules QUAN TRỌNG nói chung
                if (item.important) {
                    hasImportant = true;
                }

                // 4. Kiểm tra schedules ĐANG DIỄN RA
                if (localNow >= exactStartDT && localNow <= exactEndDT) {
                    hasRunning = true;
                }
            });

            // 🔥 THIẾT LẬP TRỌNG SỐ ƯU TIÊN CHO NHÓM (Số càng nhỏ càng xếp lên đầu)
            let groupWeight = 5; // Level 5: normal schedules only
            
            if (hasUpcomingImportant) {
                groupWeight = 1; // Level 1: upcoming important schedules
            } else if (hasUpcomingNormal) {
                groupWeight = 2; // Level 2: upcoming normal schedules
            } else if (hasImportant) {
                groupWeight = 3; // Level 3: important schedules
            } else if (hasRunning) {
                groupWeight = 4; // Level 4: running schedules
            }

            processedGroups.push({
                groupObj: group,
                schedules: todaySchedules,
                weight: groupWeight
            });
        }
    });

    if (processedGroups.length === 0) return;

    // Sắp xếp các cụm group dựa trên trọng số weight (1 lên đầu, 5 về cuối)
    processedGroups.sort((a, b) => a.weight - b.weight);

    let html = '';
    const dayLabels = ["Sunday", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
                        ${dayLabels[localNow.getDay()]} - ${item.title} ${diffToStartMs > 0 && diffMin <= 30 ? `(Left ${diffMin} ph)` : ''}
                    </h4>
                    <div style="display:flex;flex-direction:column;gap:2px;margin-bottom:8px;font-size:12px;color:var(--text-sub);${isPassed ? 'text-decoration:line-through;' : ''}">
                        <div>🟢 Start: <b>${item.date.split('-').reverse().join('/')}</b> at <b>${item.time}</b></div>
                        <div>🏁 End: <b>${(item.endDate || item.date).split('-').reverse().join('/')}</b> at <b>${item.endTime || item.time}</b></div>
                    </div>
                    <p style="margin:0;white-space:pre-wrap;font-size:13px;color:var(--text-main)">${item.content || 'No detailed content'}</p>
                </div>
                <button class="btn-secondary" style="padding:4px 8px;font-size:11px;color:var(--danger-color);border-color:rgba(239,68,68,0.2);cursor:pointer" onclick="deleteTaskFromModal('${group.id}', ${item.originalIndex})">❌ Delete</button>
            </div>`;
        });
    });

    const modalTitle = getEl('todayImportantModal')?.querySelector('h3');
    if (modalTitle) modalTitle.innerHTML = `📌 TODAY SCHEDULES (${String(localNow.getDate()).padStart(2, '0')}/${String(localNow.getMonth() + 1).padStart(2, '0')})`;
    
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
                    if (!el.querySelector('.schedule-countdown-cell')?.innerHTML.includes('Running')) {
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
            const isRunningType = el.getAttribute('data-type') === 'running' || el.querySelector('.schedule-countdown-cell')?.innerHTML.includes('Running');

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

    customConfirm(`Delete schedule milestone "${group.schedules[originalIndex].title}"?`, "⚠️ Confirm deletion").then((confirmed) => {
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
        <p style="color:var(--text-sub);font-size:13px;text-align:left;margin-bottom:15px">Please prepare an Excel file with the following standard column headers:</p>
        <div style="overflow-x:auto;margin-bottom:15px;border:1px solid var(--border-color);border-radius:8px">
            <table style="width:100%;border-collapse:collapse;font-size:11px;text-align:left">
                <thead><tr style="background:var(--schedule-accent);color:white"><th style="padding:6px 8px">Date</th><th style="padding:6px 8px">Time</th><th style="padding:6px 8px">EndDate</th><th style="padding:6px 8px">EndTime</th><th style="padding:6px 8px">Task</th><th style="padding:6px 8px">Important</th><th style="padding:6px 8px">Content</th></tr></thead>
                <tbody><tr><td style="padding:6px 8px;color:var(--text-sub)">2026-06-16</td><td style="padding:6px 8px;color:var(--text-sub)">08:00</td><td style="padding:6px 8px;color:var(--text-sub)">2026-06-16</td><td style="padding:6px 8px;color:var(--text-sub)">12:00</td><td>Core meeting</td><td style="padding:6px 8px;color:var(--text-sub)">TRUE</td><td style="padding:6px 8px;color:var(--text-sub)">Content...</td></tr></tbody>
            </table>
        </div>`;

    const alertBox = getEl('alertModal')?.querySelector('.modal-box');
    if (alertBox) {
        alertBox.style.maxWidth = "600px";
        const titleH3 = alertBox.querySelector('h3');
        if (titleH3) { titleH3.innerHTML = "📊 Standard Schedule Excel Structure"; titleH3.style.color = "var(--text-main)"; }
        getEl('alertMessage').innerHTML = huongDanHTML;
        
        const resetAlertModal = () => {
            if (titleH3) { titleH3.innerHTML = "⚠️ Notice"; titleH3.style.color = "var(--danger-color)"; }
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
            <button class="btn-secondary" style="background-color:var(--accent-color);color:#fff!important;padding:10px 16px" onclick="downloadExcelTemplate()">📥 Download Template</button>
            <button class="btn-success" style="padding:10px 16px" id="btnConfirmExcelSelect">🎯 Choose Excel File</button>
        `;

        getEl('btnConfirmExcelSelect').onclick = function() { closeModal('alertModal'); resetAlertModal(); setTimeout(() => { getEl('excelScheduleInput')?.click(); }, 200); };
    }
    openModal('alertModal');
}

function downloadExcelTemplate() {
    try {
        const sampleData = [
            { "Date": "2026-06-16", "Time": "18:00", "EndDate": "2026-06-16", "EndTime": "22:00", "Task": "GHTK Evening Shift", "Important": "FALSE", "Content": "Operations shift" },
            { "Date": "2026-06-17", "Time": "08:30", "EndDate": "2026-06-17", "EndTime": "11:30", "Task": "Daily Standup", "Important": "TRUE", "Content": "Progress report" }
        ];
        const ws = XLSX.utils.json_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "LichTrinhMau");
        XLSX.writeFile(wb, "mau_import_lich_trinh_countdown.xlsx");
    } catch (e) { alert("Error creating template file!"); }
}

getEl('excelScheduleInput')?.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (typeof XLSX === 'undefined') return alert("Excel library has not loaded!");

    const group = getGroup(this.getAttribute('data-target-group-id') || state.activeGroupId);
    if (!group) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
            const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            if (!rawData?.length) return alert("Excel file is empty!");
            
            const parseTime = t => {
                if (!t || String(t).trim() === "undefined") return "00:00";
                let s = String(t).toLowerCase().trim();
                if (!isNaN(s) && parseFloat(s) > 0 && parseFloat(s) < 1) {
                    const sec = Math.round(parseFloat(s) * 86400);
                    return `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor((sec%3600)/60)).padStart(2,'0')}`;
                }
                const pm = s.includes('pm') || s.includes('ch') || s.includes('pm');
                const am = s.includes('am') || s.includes('sa') || s.includes('am');
                s = s.replace(/(am|pm|sa|ch|pm|am)/g, '').trim();
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
                const title = String(row["Task"] || row["Congviec"] || row["Task"] || row["Task"] || "").trim();
                const content = String(row["Content"] || row["Content"] || "").trim();
                const imp = row["Important"] === true || String(row["Important"]).toLowerCase() === 'true';

                let date = parseDate(row["Date"] || row["Date"]);
                let time = parseTime(row["Time"] || row["Time"]);
                let endDate = parseDate(row["EndDate"] || row["End Date"] || row["Dateketthuc"]) || date;
                let endTime = parseTime(row["EndTime"] || row["End Time"] || row["Timeketthuc"]);
                if (!row["EndTime"] && !row["End Time"]) endTime = time;

                if (new Date(`${endDate}T${endTime}`) < new Date(`${date}T${time}`)) { endDate = date; endTime = time; }

                return { title, date, time, endDate, endTime, content: content === "undefined" ? "" : content, important: imp, emoji: imp ? "⚠️" : "📅" };
            }).filter(item => item.title && item.date);

            if (!newSchedules.length) return alert("❌ No valid schedule milestones found!");
            if (!group.schedules) group.schedules = [];
            group.schedules.push(...newSchedules);
            
            sortSchedulesSmart(group.schedules);
            saveData();
            renderDashboard();
            alert(`📥 Import successful: ${newSchedules.length} schedules.`);
        } catch (err) { alert("Error parsing Excel file!"); }
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
    handleAuthClick(false, true);
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
        audit_log: Array.isArray(obj.audit_log) ? obj.audit_log : []
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
    registry.audit_log = registry.audit_log.slice(0,600);
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

function startAccountHeartbeat() {
    stopAccountHeartbeat();
    if (!isGoogleConnected() || !googleAccountProfile?.id || !isAccountRegistryConfigured()) return;
    trackCurrentWebAccount(true);
    accountHeartbeatTimer = setInterval(() => {
        if (document.visibilityState === 'visible') trackCurrentWebAccount(false);
    }, ACCOUNT_HEARTBEAT_MS);
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
        adminAuditCache = Array.isArray(registry.audit_log) ? registry.audit_log : [];
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

function renderAdminAuditLog() {
    const wrap = getEl('adminAuditList');
    if (!wrap) return;
    const q = (getEl('adminAuditSearch')?.value || '').trim().toLowerCase();
    const rows = adminAuditCache.filter(e =>
        !q || `${e.action || ''} ${e.actor_email || ''} ${e.actor_name || ''} ${e.target_email || ''} ${e.detail || ''}`.toLowerCase().includes(q)
    );
    if (!rows.length) {
        wrap.innerHTML = '<div class="admin-empty-cell">No matching audit events.</div>';
        return;
    }
    wrap.innerHTML = rows.slice(0,300).map(e => `
        <div class="admin-audit-item">
            <time>${escapeHTML(e.at ? new Date(e.at).toLocaleString() : '—')}</time>
            <div class="admin-audit-actor"><strong>${escapeHTML(e.actor_name || e.actor_email || 'System')}</strong><small>${escapeHTML(e.actor_email || '—')}</small></div>
            <div class="admin-audit-event"><strong>${escapeHTML(String(e.action || 'event').replaceAll('_',' '))}</strong><span>${escapeHTML(e.detail || (e.target_email ? `Target: ${e.target_email}` : ''))}</span></div>
        </div>
    `).join('');
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
        prompt:forceConsent || forceAccountChooser || gapi.client.getToken() === null ? 'consent' : ''
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
                if (await customConfirm("Download newer cloud data to this device [Confirm], or overwrite cloud data with local data [Keep]?", "⚠️ DATA CONFLICT")) {
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
// 11. HỆ THỐNG CONTEXT MENU & DRAG-DROP (SORTABLE)
// ==========================================
function buildMoveSubMenuHTML(type, currentGroupId, itemIndex) {
    const targets = state.dashboardData.filter(g => g.type === type && g.id !== currentGroupId);
    if (!targets.length) return '';
    return `
        <div class="move-submenu-container" style="position:relative" onmouseenter="this.querySelector('.sub-items').style.display='block'" onmouseleave="this.querySelector('.sub-items').style.display='none'">
            <div class="context-menu-item">🔄 Move group</div>
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
        ? `<div class="context-menu-divider"></div>${!group.isLocked ? `<div class="context-menu-item" onclick="quickLockGroup('${groupId}')">🔒 Lock group again</div>` : ''}<div class="context-menu-item" onclick="handleLockMenuAction('${groupId}')">🔓 Remove PIN</div>`
        : `<div class="context-menu-divider"></div><div class="context-menu-item" onclick="handleLockMenuAction('${groupId}')">🔒 Set PIN</div>`;

    const actions = {
        'group-link': `<div class="context-menu-item" onclick="openLinkModal('${groupId}')">➕ Add link button</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="toggleFavoriteGroup('${groupId}', event)">⭐ Pin / unpin group</div><div class="context-menu-item" onclick="openGroupModal('${groupId}','link')">📝 Edit group name</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Delete entire group</div>${lockMenuHTML}`,
        'group-note': `<div class="context-menu-item" onclick="openNoteModal('${groupId}')">➕ Add note button</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="toggleFavoriteGroup('${groupId}', event)">⭐ Pin / unpin group</div><div class="context-menu-item" onclick="openGroupModal('${groupId}','note')">📝 Edit group name</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Delete entire group</div>${lockMenuHTML}`,
        'group-schedule': `<div class="context-menu-item" onclick="openScheduleModal('${groupId}')">➕ Add schedule milestone</div><div class="context-menu-item" onclick="triggerExcelImport('${groupId}')">📥 Import from Excel</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="toggleFavoriteGroup('${groupId}', event)">⭐ Pin / unpin group</div><div class="context-menu-item" onclick="openGroupModal('${groupId}','schedule')">📝 Edit group name</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Delete entire group</div>${lockMenuHTML}`,
        'group-kanban': `<div class="context-menu-item" onclick="addKanbanBoard('${groupId}')">➕ Add kanban board</div><div class="context-menu-divider"></div><div class="context-menu-item" onclick="toggleFavoriteGroup('${groupId}', event)">⭐ Pin / unpin group</div><div class="context-menu-item" onclick="openGroupModal('${groupId}','kanban')">📝 Edit group name</div><div class="context-menu-item delete" onclick="triggerDelete('Group')">❌ Delete entire group</div>${lockMenuHTML}`,
        'link': `<div class="context-menu-item" onclick="duplicateItem('link','${groupId}',${index})">✨ Duplicate button</div>${buildMoveSubMenuHTML('link',groupId,index)}<div class="context-menu-item" onclick="openLinkModal('${groupId}',${index})">📝 Edit button</div><div class="context-menu-item delete" onclick="triggerDelete('Link')">❌ Delete this button</div>`,
        'note': `<div class="context-menu-item" onclick="duplicateItem('note','${groupId}',${index})">✨ Duplicate note</div>${buildMoveSubMenuHTML('note',groupId,index)}<div class="context-menu-item" onclick="openNoteModal('${groupId}',${index})">📝 Edit note</div><div class="context-menu-item delete" onclick="triggerDelete('Note')">❌ Delete this note</div>`,
        'schedule': `<div class="context-menu-item" onclick="duplicateItem('schedule','${groupId}',${index})">✨ Duplicate milestone</div>${buildMoveSubMenuHTML('schedule',groupId,index)}<div class="context-menu-item" onclick="openScheduleModal('${groupId}',${index})">📝 Edit milestone</div><div class="context-menu-item delete" onclick="triggerDelete('Schedule')">❌ Delete this schedule milestone</div>`,
        'kanban-card': `<div class="context-menu-item" onclick="duplicateKanbanCard('${groupId}','${index}')">✨ Duplicate card</div><div class="context-menu-item" onclick="openKanbanCardModal('${groupId}',null,'${index}')">📝 Edit card</div><div class="context-menu-item delete" onclick="deleteKanbanCard('${groupId}','${index}')">❌ Delete this card</div>`
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


// ========================================================================== 
// KANBAN FOLDER MODULE - chạy tốt trên GitHub Pages, không cần backend
// ========================================================================== 
let kanbanModalState = { groupId: null, columnId: null, cardId: null };

function createDefaultKanbanBoard() {
    return {
        columns: [
            { id: 'todo', title: '📋 Todo', cards: [] },
            { id: 'doing', title: '⚙️ Doing', cards: [] },
            { id: 'review', title: '👀 Review', cards: [] },
            { id: 'done', title: '✅ Done', cards: [] }
        ]
    };
}

function normalizeKanbanGroup(group) {
    if (!group) return createDefaultKanbanBoard();
    if (!group.kanban || !Array.isArray(group.kanban.columns)) group.kanban = createDefaultKanbanBoard();
    group.kanban.columns.forEach((col, colIndex) => {
        if (!col.id) col.id = `col_${Date.now()}_${colIndex}`;
        if (!col.title) col.title = `Column ${colIndex + 1}`;
        if (!Array.isArray(col.cards)) col.cards = [];
        col.cards.forEach((card, cardIndex) => {
            if (!card.id) card.id = `card_${Date.now()}_${colIndex}_${cardIndex}`;
            if (!card.priority) card.priority = 'normal';
        });
    });
    return group.kanban;
}

function getKanbanCardCount(group) {
    if (!group || group.type !== 'kanban') return 0;
    const board = normalizeKanbanGroup(group);
    return board.columns.reduce((sum, col) => sum + (col.cards?.length || 0), 0);
}

function getKanbanColumn(group, columnId) {
    const board = normalizeKanbanGroup(group);
    return board.columns.find(col => col.id === columnId) || board.columns[0];
}

function findKanbanCard(group, cardId) {
    const board = normalizeKanbanGroup(group);
    for (const col of board.columns) {
        const index = col.cards.findIndex(card => card.id === cardId);
        if (index >= 0) return { column: col, index, card: col.cards[index] };
    }
    return null;
}

function renderKanbanBoard(group, contentArea) {
    const board = normalizeKanbanGroup(group);
    if (!board.columns.length) board.columns = createDefaultKanbanBoard().columns;

    contentArea.innerHTML = `
        <div class="kanban-toolbar">
            <button class="btn-primary kanban-mini-btn" onclick="event.stopPropagation();openKanbanCardModal('${group.id}')">➕ Card</button>
            <button class="btn-secondary kanban-mini-btn" onclick="event.stopPropagation();addKanbanColumn('${group.id}')">➕ Column</button>
            <span class="kanban-count">${getKanbanCardCount(group)} cards</span>
        </div>
        <div class="kanban-board" data-group-id="${group.id}">
            ${board.columns.map(col => `
                <section class="kanban-column" data-column-id="${col.id}">
                    <div class="kanban-column-head">
                        <strong>${escapeHTML(col.title)}</strong>
                        <span>${col.cards.length}</span>
                    </div>
                    <div class="kanban-column-actions">
                        <button onclick="event.stopPropagation();openKanbanCardModal('${group.id}','${col.id}')">＋ Card</button>
                        <button onclick="event.stopPropagation();renameKanbanColumn('${group.id}','${col.id}')">Edit</button>
                        <button onclick="event.stopPropagation();deleteKanbanColumn('${group.id}','${col.id}')">Delete</button>
                    </div>
                    <div class="kanban-card-list" data-group-id="${group.id}" data-column-id="${col.id}">
                        ${col.cards.map(card => renderKanbanCardHTML(group.id, card)).join('')}
                    </div>
                </section>
            `).join('')}
        </div>
    `;
}

function renderKanbanCardHTML(groupId, card) {
    const priority = card.priority || 'normal';
    const priorityText = priority === 'urgent' ? '🔴 Urgent' : (priority === 'important' ? '🟠 Important' : '🟢 Normal');
    const deadlineHTML = card.deadline ? `<span>📅 ${escapeHTML(card.deadline.split('-').reverse().join('/'))}</span>` : '';
    return `
        <article class="kanban-card priority-${priority}" data-card-id="${card.id}" onclick="openKanbanCardModal('${groupId}',null,'${card.id}')" oncontextmenu="openContextMenu(event, 'kanban-card', '${groupId}', '${card.id}')">
            <div class="kanban-card-title">${escapeHTML(card.title || 'Untitled card')}</div>
            ${card.content ? `<div class="kanban-card-desc">${escapeHTML(card.content).slice(0, 120)}</div>` : ''}
            <div class="kanban-card-meta"><span>${priorityText}</span>${deadlineHTML}</div>
        </article>
    `;
}

function openKanbanCardModal(groupId, columnId = null, cardId = null) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = normalizeKanbanGroup(group);
    const found = cardId ? findKanbanCard(group, cardId) : null;
    const firstColumn = board.columns[0];

    kanbanModalState = {
        groupId,
        columnId: found?.column?.id || columnId || firstColumn?.id,
        cardId: found?.card?.id || null
    };

    getEl('kanbanCardModalTitle').innerText = found ? '📝 Edit Kanban Card' : '➕ Add Kanban Card';
    getEl('kanbanCardTitleInput').value = found?.card?.title || '';
    getEl('kanbanCardPriorityInput').value = found?.card?.priority || 'normal';
    getEl('kanbanCardDeadlineInput').value = found?.card?.deadline || '';
    getEl('kanbanCardContentInput').value = found?.card?.content || '';
    openModal('kanbanCardModal');
}

function submitKanbanCardForm() {
    const group = getGroup(kanbanModalState.groupId);
    if (!group) return;
    const title = getEl('kanbanCardTitleInput')?.value.trim();
    if (!title) return;

    const data = {
        id: kanbanModalState.cardId || `card_${Date.now()}`,
        title,
        priority: getEl('kanbanCardPriorityInput')?.value || 'normal',
        deadline: getEl('kanbanCardDeadlineInput')?.value || '',
        content: getEl('kanbanCardContentInput')?.value || ''
    };

    if (kanbanModalState.cardId) {
        const found = findKanbanCard(group, kanbanModalState.cardId);
        if (found) found.column.cards[found.index] = data;
    } else {
        const column = getKanbanColumn(group, kanbanModalState.columnId);
        column.cards.push(data);
    }
    closeModal('kanbanCardModal');
    saveData();
}

function duplicateKanbanCard(groupId, cardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId);
    if (!found) return;
    const copy = JSON.parse(JSON.stringify(found.card));
    copy.id = `card_${Date.now()}`;
    copy.title = `${copy.title || 'Card'} (Copy)`;
    found.column.cards.splice(found.index + 1, 0, copy);
    saveData();
}

function deleteKanbanCard(groupId, cardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId);
    if (!found) return;
    customConfirm(`Delete card "${escapeHTML(found.card.title || 'Untitled')}"?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        found.column.cards.splice(found.index, 1);
        saveData();
    });
}

function addKanbanColumn(groupId) {
    const group = getGroup(groupId);
    if (!group) return;
    const title = window.prompt('Column name:', 'New Column');
    if (!title || !title.trim()) return;
    normalizeKanbanGroup(group).columns.push({ id: `col_${Date.now()}`, title: title.trim(), cards: [] });
    saveData();
}

function renameKanbanColumn(groupId, columnId) {
    const group = getGroup(groupId);
    const col = getKanbanColumn(group, columnId);
    if (!col) return;
    const title = window.prompt('Column name:', col.title);
    if (!title || !title.trim()) return;
    col.title = title.trim();
    saveData();
}

function deleteKanbanColumn(groupId, columnId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = normalizeKanbanGroup(group);
    const col = board.columns.find(c => c.id === columnId);
    if (!col) return;
    if (board.columns.length <= 1) return alert('Kanban must have at least one column.');
    customConfirm(`Delete column "${escapeHTML(col.title)}" and ${col.cards.length} cards inside?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        board.columns = board.columns.filter(c => c.id !== columnId);
        saveData();
    });
}

function initKanbanDragAndDrop() {
    if (typeof Sortable === 'undefined') return;
    document.querySelectorAll('.kanban-card-list').forEach(list => {
        if (Sortable.get(list)) Sortable.get(list).destroy();
        Sortable.create(list, {
            group: 'dashboard-kanban-cards',
            animation: 150,
            ghostClass: 'sortable-ghost-link',
            delay: window.innerWidth <= 768 ? 250 : 0,
            delayOnTouchOnly: true,
            onEnd: event => {
                const fromGroup = getGroup(event.from.dataset.groupId);
                const toGroup = getGroup(event.to.dataset.groupId);
                if (!fromGroup || !toGroup) return;
                const fromColumn = getKanbanColumn(fromGroup, event.from.dataset.columnId);
                const toColumn = getKanbanColumn(toGroup, event.to.dataset.columnId);
                const [moved] = fromColumn.cards.splice(event.oldIndex, 1);
                if (!moved) return;
                toColumn.cards.splice(event.newIndex, 0, moved);
                saveData();
            }
        });
    });
}

const __kanbanInitDragAndDrop = initDragAndDrop;
initDragAndDrop = function() {
    __kanbanInitDragAndDrop();
    initKanbanDragAndDrop();
};


// ========================================================================== 
// KANBAN WORKSPACE UPGRADE - fullscreen modal + multiple boards per folder
// ========================================================================== 
const KANBAN_LAYOUT_KEY = 'dashboardKanbanLayoutMode';
let kanbanWorkspaceState = { groupId: null, boardId: null };
let kanbanLayoutMode = localStorage.getItem(KANBAN_LAYOUT_KEY) || 'column';
let kanbanCardEditState = { groupId: null, boardId: null, columnId: null, cardId: null };

function createDefaultKanbanBoard(title = 'Main Board') {
    return {
        id: `board_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`,
        title,
        columns: [
            { id: 'todo', title: '📋 Todo', cards: [] },
            { id: 'doing', title: '⚙️ Doing', cards: [] },
            { id: 'review', title: '👀 Review', cards: [] },
            { id: 'done', title: '✅ Done', cards: [] }
        ]
    };
}

function createDefaultKanbanWorkspace() {
    return { boards: [createDefaultKanbanBoard('Main Board')] };
}

function normalizeKanbanGroup(group) {
    if (!group) return createDefaultKanbanWorkspace();
    if (!group.kanban) group.kanban = createDefaultKanbanWorkspace();

    // Convert old single-board structure { columns: [...] } to workspace { boards: [...] }
    if (Array.isArray(group.kanban.columns)) {
        group.kanban = {
            boards: [{
                id: group.kanban.id || `board_${Date.now()}`,
                title: group.kanban.title || 'Main Board',
                columns: group.kanban.columns
            }]
        };
    }

    if (!Array.isArray(group.kanban.boards) || !group.kanban.boards.length) {
        group.kanban.boards = [createDefaultKanbanBoard('Main Board')];
    }

    group.kanban.boards.forEach((board, boardIndex) => {
        if (!board.id) board.id = `board_${Date.now()}_${boardIndex}`;
        if (!board.title) board.title = `Board ${boardIndex + 1}`;
        if (!Array.isArray(board.columns) || !board.columns.length) board.columns = createDefaultKanbanBoard().columns;
        board.columns.forEach((col, colIndex) => {
            if (!col.id) col.id = `col_${Date.now()}_${boardIndex}_${colIndex}`;
            if (!col.title) col.title = `Column ${colIndex + 1}`;
            if (!Array.isArray(col.cards)) col.cards = [];
            col.cards.forEach((card, cardIndex) => {
                if (!card.id) card.id = `card_${Date.now()}_${boardIndex}_${colIndex}_${cardIndex}`;
                if (!card.priority) card.priority = 'normal';
                if (!card.title) card.title = 'Untitled card';
            });
        });
    });
    return group.kanban;
}

function getKanbanBoard(group, boardId = null) {
    const workspace = normalizeKanbanGroup(group);
    return workspace.boards.find(board => board.id === boardId) || workspace.boards[0];
}

function getKanbanCardCount(group, boardId = null) {
    if (!group || group.type !== 'kanban') return 0;
    const workspace = normalizeKanbanGroup(group);
    const boards = boardId ? [getKanbanBoard(group, boardId)] : workspace.boards;
    return boards.reduce((sum, board) => sum + board.columns.reduce((s, col) => s + (col.cards?.length || 0), 0), 0);
}

function getKanbanColumn(group, columnId, boardId = null) {
    const board = getKanbanBoard(group, boardId || kanbanWorkspaceState.boardId);
    return board.columns.find(col => col.id === columnId) || board.columns[0];
}

function findKanbanCard(group, cardId, boardId = null) {
    const workspace = normalizeKanbanGroup(group);
    const boards = boardId ? [getKanbanBoard(group, boardId)] : workspace.boards;
    for (const board of boards) {
        for (const col of board.columns) {
            const index = col.cards.findIndex(card => card.id === cardId);
            if (index >= 0) return { board, column: col, index, card: col.cards[index] };
        }
    }
    return null;
}

function renderKanbanBoard(group, contentArea) {
    const workspace = normalizeKanbanGroup(group);
    const totalCards = getKanbanCardCount(group);
    const boardStats = workspace.boards.map(board => ({
        title: board.title,
        cards: getKanbanCardCount(group, board.id),
        columns: board.columns.length
    }));

    contentArea.innerHTML = `
        <div class="kanban-folder-summary" onclick="event.stopPropagation();openKanbanWorkspace('${group.id}')">
            <div class="kanban-summary-top">
                <div>
                    <strong>📌 Kanban Workspace</strong>
                    <small>${workspace.boards.length} boards · ${totalCards} cards</small>
                </div>
                <button class="btn-primary kanban-open-btn" onclick="event.stopPropagation();openKanbanWorkspace('${group.id}')">Open Board</button>
            </div>
            <div class="kanban-summary-grid">
                ${boardStats.slice(0, 6).map(stat => `
                    <div class="kanban-summary-board">
                        <span>${escapeHTML(stat.title)}</span>
                        <b>${stat.cards}</b>
                        <small>${stat.columns} columns</small>
                    </div>
                `).join('')}
                ${boardStats.length > 6 ? `<div class="kanban-summary-board more"><span>More</span><b>+${boardStats.length - 6}</b><small>boards</small></div>` : ''}
            </div>
        </div>
    `;
}

function ensureKanbanWorkspaceModal() {
    if (getEl('kanbanWorkspaceModal')) return;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay kanban-workspace-overlay';
    modal.id = 'kanbanWorkspaceModal';
    modal.innerHTML = `
        <div class="kanban-workspace-box">
            <div class="kanban-workspace-head">
                <div>
                    <h3 id="kanbanWorkspaceTitle">📌 Kanban Workspace</h3>
                    <p id="kanbanWorkspaceSubtitle">Boards, columns and cards</p>
                </div>
                <button class="modal-close-soft" onclick="closeModal('kanbanWorkspaceModal')">✕</button>
            </div>
            <div class="kanban-workspace-actions">
                <button class="btn-primary" onclick="addKanbanBoard()">➕ Board</button>
                <button class="btn-secondary" onclick="renameKanbanBoard()">📝 Rename board</button>
                <button class="btn-secondary" onclick="addKanbanColumn()">➕ Column</button>
                <button class="btn-secondary" id="kanbanLayoutToggleBtn" onclick="toggleKanbanLayoutMode()">⇄ Row view</button>
                <button class="btn-primary" onclick="openKanbanCardModal()">➕ Card</button>
                <input id="kanbanWorkspaceSearch" type="search" placeholder="Search cards..." oninput="renderKanbanWorkspaceBody()">
            </div>
            <div class="kanban-workspace-layout">
                <aside id="kanbanBoardList" class="kanban-board-list"></aside>
                <main id="kanbanWorkspaceBody" class="kanban-workspace-body"></main>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openKanbanWorkspace(groupId, boardId = null) {
    const group = getGroup(groupId);
    if (!group) return;
    const workspace = normalizeKanbanGroup(group);
    kanbanWorkspaceState = { groupId, boardId: boardId || kanbanWorkspaceState.boardId || workspace.boards[0].id };
    if (!workspace.boards.some(board => board.id === kanbanWorkspaceState.boardId)) kanbanWorkspaceState.boardId = workspace.boards[0].id;
    ensureKanbanWorkspaceModal();
    getEl('kanbanWorkspaceTitle').textContent = `${group.emoji && group.emoji !== 'NONE' ? group.emoji + ' ' : '📌 '}${group.title || 'Kanban Workspace'}`;
    renderKanbanWorkspaceBody();
    openModal('kanbanWorkspaceModal');
}


function toggleKanbanLayoutMode() {
    kanbanLayoutMode = kanbanLayoutMode === 'row' ? 'column' : 'row';
    localStorage.setItem(KANBAN_LAYOUT_KEY, kanbanLayoutMode);
    renderKanbanWorkspaceBody();
}

function renderKanbanWorkspaceBody() {
    const group = getGroup(kanbanWorkspaceState.groupId);
    if (!group) return;
    const workspace = normalizeKanbanGroup(group);
    const activeBoard = getKanbanBoard(group, kanbanWorkspaceState.boardId);
    kanbanWorkspaceState.boardId = activeBoard.id;
    const keyword = (getEl('kanbanWorkspaceSearch')?.value || '').trim().toLowerCase();
    const layoutMode = kanbanLayoutMode === 'row' ? 'row' : 'column';
    const layoutBtn = getEl('kanbanLayoutToggleBtn');
    if (layoutBtn) layoutBtn.textContent = layoutMode === 'row' ? '▦ Column view' : '⇄ Row view';

    const boardList = getEl('kanbanBoardList');
    if (boardList) {
        boardList.innerHTML = workspace.boards.map(board => `
            <button class="kanban-board-tab ${board.id === activeBoard.id ? 'active' : ''}" onclick="kanbanWorkspaceState.boardId='${board.id}';renderKanbanWorkspaceBody()">
                <span>${escapeHTML(board.title)}</span>
                <small>${getKanbanCardCount(group, board.id)} cards</small>
            </button>
        `).join('') + `
            <button class="kanban-board-tab add" onclick="addKanbanBoard()">＋ New board</button>
        `;
    }

    const body = getEl('kanbanWorkspaceBody');
    if (!body) return;
    getEl('kanbanWorkspaceSubtitle').textContent = `${workspace.boards.length} boards · ${getKanbanCardCount(group)} total cards · Active: ${activeBoard.title}`;

    body.innerHTML = `
        <div class="kanban-full-board ${layoutMode === 'row' ? 'kanban-row-mode' : 'kanban-column-mode'}" data-group-id="${group.id}" data-board-id="${activeBoard.id}">
            ${activeBoard.columns.map(col => {
                const filteredCards = keyword
                    ? col.cards.filter(card => [card.title, card.content, card.priority, card.deadline].filter(Boolean).join(' ').toLowerCase().includes(keyword))
                    : col.cards;
                return `
                    <section class="kanban-full-column" data-column-id="${col.id}">
                        <div class="kanban-full-column-head">
                            <strong>${escapeHTML(col.title)}</strong>
                            <span>${filteredCards.length}/${col.cards.length}</span>
                        </div>
                        <div class="kanban-full-column-actions">
                            <button onclick="openKanbanCardModal('${group.id}','${col.id}',null,'${activeBoard.id}')">＋ Card</button>
                            <button onclick="renameKanbanColumn('${group.id}','${col.id}','${activeBoard.id}')">Edit</button>
                            <button onclick="deleteKanbanColumn('${group.id}','${col.id}','${activeBoard.id}')">Delete</button>
                        </div>
                        <div class="kanban-workspace-card-list" data-group-id="${group.id}" data-board-id="${activeBoard.id}" data-column-id="${col.id}">
                            ${filteredCards.map(card => renderKanbanWorkspaceCardHTML(group.id, activeBoard.id, card)).join('')}
                        </div>
                    </section>
                `;
            }).join('')}
            <section class="kanban-full-column add-column" onclick="addKanbanColumn('${group.id}', '${activeBoard.id}')">＋ Add column</section>
        </div>
    `;
    initKanbanWorkspaceDragAndDrop();
}

function renderKanbanWorkspaceCardHTML(groupId, boardId, card) {
    const priority = card.priority || 'normal';
    const priorityText = priority === 'urgent' ? '🔴 Urgent' : (priority === 'important' ? '🟠 Important' : '🟢 Normal');
    const deadlineHTML = card.deadline ? `<span>📅 ${escapeHTML(card.deadline.split('-').reverse().join('/'))}</span>` : '';
    return `
        <article class="kanban-card priority-${priority}" data-card-id="${card.id}" onclick="openKanbanCardModal('${groupId}',null,'${card.id}','${boardId}')" oncontextmenu="openContextMenu(event, 'kanban-card', '${groupId}', '${card.id}')">
            <div class="kanban-card-title">${escapeHTML(card.title || 'Untitled card')}</div>
            ${card.content ? `<div class="kanban-card-desc">${escapeHTML(card.content).slice(0, 180)}</div>` : ''}
            <div class="kanban-card-meta"><span>${priorityText}</span>${deadlineHTML}</div>
        </article>
    `;
}

function addKanbanBoard(groupId = kanbanWorkspaceState.groupId) {
    const group = getGroup(groupId);
    if (!group) return;
    const title = window.prompt('Board name:', 'New Board');
    if (!title || !title.trim()) return;
    const board = createDefaultKanbanBoard(title.trim());
    normalizeKanbanGroup(group).boards.push(board);
    kanbanWorkspaceState.groupId = group.id;
    kanbanWorkspaceState.boardId = board.id;
    saveData();
    openKanbanWorkspace(group.id, board.id);
}

function renameKanbanBoard(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const title = window.prompt('Board name:', board.title);
    if (!title || !title.trim()) return;
    board.title = title.trim();
    saveData();
    openKanbanWorkspace(group.id, board.id);
}

function deleteKanbanBoard(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const workspace = normalizeKanbanGroup(group);
    if (workspace.boards.length <= 1) return alert('Kanban workspace must have at least one board.');
    const board = getKanbanBoard(group, boardId);
    customConfirm(`Delete board "${escapeHTML(board.title)}" and all cards inside?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        workspace.boards = workspace.boards.filter(item => item.id !== board.id);
        kanbanWorkspaceState.boardId = workspace.boards[0].id;
        saveData();
        openKanbanWorkspace(group.id, kanbanWorkspaceState.boardId);
    });
}

function openKanbanCardModal(groupId = kanbanWorkspaceState.groupId, columnId = null, cardId = null, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const found = cardId ? findKanbanCard(group, cardId, board.id) : null;
    const firstColumn = board.columns[0];
    kanbanCardEditState = {
        groupId: group.id,
        boardId: found?.board?.id || board.id,
        columnId: found?.column?.id || columnId || firstColumn?.id,
        cardId: found?.card?.id || null
    };
    getEl('kanbanCardModalTitle').innerText = found ? '📝 Edit Kanban Card' : '➕ Add Kanban Card';
    getEl('kanbanCardTitleInput').value = found?.card?.title || '';
    getEl('kanbanCardPriorityInput').value = found?.card?.priority || 'normal';
    getEl('kanbanCardDeadlineInput').value = found?.card?.deadline || '';
    getEl('kanbanCardContentInput').value = found?.card?.content || '';
    openModal('kanbanCardModal');
}

function submitKanbanCardForm() {
    const group = getGroup(kanbanCardEditState.groupId);
    if (!group) return;
    const title = getEl('kanbanCardTitleInput')?.value.trim();
    if (!title) return;
    const data = {
        id: kanbanCardEditState.cardId || `card_${Date.now()}`,
        title,
        priority: getEl('kanbanCardPriorityInput')?.value || 'normal',
        deadline: getEl('kanbanCardDeadlineInput')?.value || '',
        content: getEl('kanbanCardContentInput')?.value || ''
    };
    if (kanbanCardEditState.cardId) {
        const found = findKanbanCard(group, kanbanCardEditState.cardId, kanbanCardEditState.boardId);
        if (found) found.column.cards[found.index] = data;
    } else {
        const column = getKanbanColumn(group, kanbanCardEditState.columnId, kanbanCardEditState.boardId);
        column.cards.push(data);
    }
    closeModal('kanbanCardModal');
    saveData();
    if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, kanbanCardEditState.boardId);
}

function addKanbanColumn(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const title = window.prompt('Column name:', 'New Column');
    if (!title || !title.trim()) return;
    board.columns.push({ id: `col_${Date.now()}`, title: title.trim(), cards: [] });
    saveData();
    if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, board.id);
}

function renameKanbanColumn(groupId, columnId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    const col = getKanbanColumn(group, columnId, boardId);
    if (!col) return;
    const title = window.prompt('Column name:', col.title);
    if (!title || !title.trim()) return;
    col.title = title.trim();
    saveData();
    if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, boardId);
}

function deleteKanbanColumn(groupId, columnId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const col = board.columns.find(c => c.id === columnId);
    if (!col) return;
    if (board.columns.length <= 1) return alert('Kanban must have at least one column.');
    customConfirm(`Delete column "${escapeHTML(col.title)}" and ${col.cards.length} cards inside?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        board.columns = board.columns.filter(c => c.id !== columnId);
        saveData();
        if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, board.id);
    });
}

function duplicateKanbanCard(groupId, cardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId);
    if (!found) return;
    const copy = JSON.parse(JSON.stringify(found.card));
    copy.id = `card_${Date.now()}`;
    copy.title = `${copy.title || 'Card'} (Copy)`;
    found.column.cards.splice(found.index + 1, 0, copy);
    saveData();
    if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, found.board.id);
}

function deleteKanbanCard(groupId, cardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId);
    if (!found) return;
    customConfirm(`Delete card "${escapeHTML(found.card.title || 'Untitled')}"?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        found.column.cards.splice(found.index, 1);
        saveData();
        if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) openKanbanWorkspace(group.id, found.board.id);
    });
}

function initKanbanWorkspaceDragAndDrop() {
    if (typeof Sortable === 'undefined') return;
    document.querySelectorAll('.kanban-workspace-card-list').forEach(list => {
        if (Sortable.get(list)) Sortable.get(list).destroy();
        Sortable.create(list, {
            group: `kanban-board-${list.dataset.groupId}-${list.dataset.boardId}`,
            animation: 150,
            ghostClass: 'sortable-ghost-link',
            delay: window.innerWidth <= 768 ? 180 : 0,
            delayOnTouchOnly: true,
            onEnd: event => {
                const group = getGroup(event.from.dataset.groupId);
                if (!group) return;
                const boardId = event.from.dataset.boardId;
                const fromColumn = getKanbanColumn(group, event.from.dataset.columnId, boardId);
                const toColumn = getKanbanColumn(group, event.to.dataset.columnId, boardId);
                const [moved] = fromColumn.cards.splice(event.oldIndex, 1);
                if (!moved) return;
                toColumn.cards.splice(event.newIndex, 0, moved);
                saveData();
                renderKanbanWorkspaceBody();
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
    
    getEl('keyModalTitle').textContent = hasPin ? '🔓 Remove group lock' : '🔒 Set New PIN';
    getEl('keyModalDesc').textContent = hasPin ? 'Enter the current PIN to remove protection.' : 'Create a PIN for this group. Settings will sync automatically.';
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
    updateGooglePermissionGate();
    setTimeout(() => { checkAuthStates(); enforceGooglePermissions(); }, 500);
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
        items.push({ type:'group', icon:'📁', title:gLabel, subtitle:`Group ${group.type}`, groupId:group.id, action: () => scrollToGroup(group.id) });
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
    if (!favs.length) { el.className = 'smart-list empty'; el.textContent = 'No favorite groups yet.'; return; }
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
        title.innerHTML = `<span>🕘 Recent</span><button class="btn-secondary panel-mini-btn" onclick="clearRecentItems(event)">Clear all</button>`;
    }
    if (!recent.length) { el.className = 'smart-list empty'; el.textContent = 'No recent history yet.'; return; }
    el.className = 'smart-list';
    el.innerHTML = recent.map((r, i) => `
        <div class="smart-item">
            <div class="smart-item-main" onclick="openRecentItem(${i})">
                <span>${r.type === 'link' ? '🔗' : r.type === 'note' ? '📝' : '📅'} ${escapeHTML(r.title)}</span>
                <small>${escapeHTML(r.subtitle || '')}</small>
            </div>
            <div class="smart-item-actions">
                <button class="smart-icon-btn" onclick="removeRecentItem(${i}, event)" title="Remove from Recent">✕</button>
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
    if (!top.length) { el.className = 'smart-list empty'; el.textContent = 'No upcoming schedules.'; return; }
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
        { icon:'⌘', title:'Open Command Palette', subtitle:'Quick actions', action:() => openCommandPalette() },
        { icon:'⚠️', title:'View important tasks today', subtitle:'Dashboard', action:() => { closeModal('commandPaletteModal'); showTodayImportantTasks(); } },
        { icon:'🗑️', title:'Open Trash', subtitle:'Restore deleted items', action:() => { closeModal('commandPaletteModal'); openTrashModal(); } },
        { icon:'📆', title:'Open Calendar View', subtitle:'View schedule by month', action:() => { closeModal('commandPaletteModal'); openCalendarModal(); } },
        { icon:'💾', title:'Open Version Backups', subtitle:'Restore an old backup', action:() => { closeModal('commandPaletteModal'); openBackupModal(); } }
    ];
    const all = [...quickActions, ...collectDashboardItems()];
    const result = all.filter(item => !keyword || normalizeText(`${item.title} ${item.subtitle || ''} ${item.text || ''} ${item.url || ''}`).includes(keyword)).slice(0, 30);
    if (!result.length) { box.innerHTML = '<div class="empty-search-state">No matching results.</div>'; return; }
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
    if (item) addRecentItem({ type, title: item.title || item.name || 'Untitled', subtitle: group.title, groupId, index });
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
        menuContent.insertAdjacentHTML('afterbegin', `<div class="context-menu-item" onclick="favoriteSingleItem('${targetType}','${groupId}',${index})">⭐ Pin this item</div>`);
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
    toast.innerHTML = `<span>Moved <b>${escapeHTML(label)}</b> to Trash.</span><button class="btn-primary" onclick="openTrashModal()">Open Trash</button>`;
    toast.style.display = 'flex';
    clearTimeout(window.__undoToastTimer);
    window.__undoToastTimer = setTimeout(() => { toast.style.display = 'none'; }, 7000);
}

triggerDelete = function(type) {
    const group = getGroup(state.activeGroupId);
    if (!group) return;
    const typeMap = { Group:'group', Link:'link', Note:'note', Schedule:'schedule' };
    const label = type === 'Group' ? group.title : (group[`${type.toLowerCase()}s`]?.[state.activeIndex]?.title || group[`${type.toLowerCase()}s`]?.[state.activeIndex]?.name || 'this item');
    customConfirm(`Are you sure you want to delete ${typeMap[type] || 'item'} "${label}"?\nData will be moved to Trash and can be restored.`, '🗑️ Confirm deletion').then(ok => {
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
    if (!item) return 'Untitled';
    if (item.kind === 'Group') return item.data?.title || 'Untitled group';
    return item.data?.title || item.data?.name || 'Untitled item';
}

function getTrashKindLabel(kind) {
    return { Group:'📁 Group', Link:'🔗 Link', Note:'📝 Note', Schedule:'📅 Schedule' }[kind] || 'Item';
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
        el.textContent = 'Trash is empty.';
        return;
    }
    el.className = 'trash-list';
    el.innerHTML = trash.map((item, index) => `
        <div class="trash-item">
            <div>
                <strong>${getTrashKindLabel(item.kind)} · ${escapeHTML(getTrashLabel(item))}</strong>
                <small>${escapeHTML(item.data?.title || item.data?.name || '')}${item.kind !== 'Group' ? ' · Original group: ' + escapeHTML(getGroup(item.groupId)?.title || 'no longer exists') : ''}<br>Deleted: ${formatTrashTime(item.deletedAt)}</small>
            </div>
            <div class="trash-actions">
                <button class="btn-success" onclick="restoreTrashItemAt(${index})">Restore</button>
                <button class="btn-real-danger" onclick="removeTrashItemAt(${index})">Delete permanently</button>
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
        if (!group) return alert('Original group not found. Restore the original group first if it was deleted.');
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
    customConfirm('Are you sure you want to clear the entire Trash? This cannot be undone.', '🗑️ Clear Trash').then(ok => {
        if (!ok) return;
        writeJSONStore(TRASH_KEY, []);
        lastTrashSnapshot = null;
        renderTrashModal();
    });
}

function restoreLastTrashItem() {
    const trash = readJSONStore(TRASH_KEY, []);
    if (!trash.length && !lastTrashSnapshot) return alert('There is no data in Trash to restore.');
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
    const base = `<button class="tag-chip ${!activeTagFilter ? 'active' : ''}" onclick="setActiveTag('')">All</button>`;
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
    title.textContent = `📅 Date ${dateLabel}`;

    if (!items.length) {
        body.innerHTML = `<div class="calendar-day-empty">No schedules on this day.</div>`;
    } else {
        body.innerHTML = `
            <div class="calendar-day-count">${items.length} schedule milestones on this day</div>
            <div class="calendar-day-timeline">
                ${items.map(x => `
                    <button class="calendar-day-timeline-item ${x.sch.important ? 'important' : ''}" onclick="openCalendarScheduleDetail('${x.group.id}', ${x.index})">
                        <span class="calendar-day-time">${escapeHTML(x.sch.time || '--:--')}</span>
                        <span class="calendar-day-dot"></span>
                        <span class="calendar-day-info">
                            <strong>${x.sch.important ? '⚠️ ' : ''}${escapeHTML(x.sch.title || 'Untitled')}</strong>
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

    label.textContent = `Month ${m + 1}/${y}`;

    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startDay = first.getDay();

    let html = ['Sun','T2','T3','T4','T5','T6','T7']
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
                 title="${hasEvents ? `${items.length} schedules` : 'No schedules'}">
                <div class="calendar-day-number">${day}</div>
                ${hasEvents ? `<span class="calendar-mobile-count">${items.length}</span>` : ''}
                <div class="calendar-events-wrap">
                    ${items.map(x => `
                        <button class="calendar-event ${x.sch.important ? 'important' : ''}"
                            onclick="event.stopPropagation(); openCalendarScheduleDetail('${x.group.id}', ${x.index})">
                            ${x.sch.important ? '⚠️' : '•'} ${escapeHTML(x.sch.title || 'Untitled')}
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
    const titles = { favorites: '⭐ Favorites', recent: '🕘 Recent', upcoming: '📅 Upcoming' };
    title.textContent = titles[type] || 'Quick panel';
    box.innerHTML = renderSidebarPanelContent(type);
    openModal('sidebarPanelModal');
    toggleMobileSidebar(false);
}

function renderSidebarPanelContent(type) {
    if (type === 'favorites') {
        const favs = state.dashboardData.filter(g => g.favorite).slice(0, 30);
        if (!favs.length) return '<div class="smart-list empty">No favorite groups yet.</div>';
        return `<div class="smart-list">${favs.map(g => `<div class="smart-item" onclick="closeModal('sidebarPanelModal'); scrollToGroup('${g.id}')"><span>${g.emoji && g.emoji !== 'NONE' ? g.emoji : '⭐'} ${escapeHTML(g.title)}</span><small>${escapeHTML(g.type || '')}</small></div>`).join('')}</div>`;
    }
    if (type === 'recent') {
        const recent = readJSONStore(RECENT_KEY, []);
        if (!recent.length) return '<div class="smart-list empty">No recent history yet.</div>';
        return `<div class="sidebar-panel-actions"><button class="btn-real-danger" onclick="clearRecentItems(event); openSidebarPanel('recent')">Clear all</button></div><div class="smart-list">${recent.map((r, i) => `
            <div class="smart-item">
                <div class="smart-item-main" onclick="openRecentItem(${i}); closeModal('sidebarPanelModal')">
                    <span>${r.type === 'link' ? '🔗' : r.type === 'note' ? '📝' : '📅'} ${escapeHTML(r.title)}</span>
                    <small>${escapeHTML(r.subtitle || '')}</small>
                </div>
                <div class="smart-item-actions"><button class="smart-icon-btn" onclick="removeRecentItem(${i}, event); openSidebarPanel('recent')" title="Remove from Recent">✕</button></div>
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
        if (!upcoming.length) return '<div class="smart-list empty">No upcoming schedules.</div>';
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

function createDashboardBackup(reason = 'Automatic') {
    if (__backupLock) return;
    const backups = readBackups();
    const snapshot = JSON.stringify(state.dashboardData);
    if (backups[0]?.snapshot === snapshot) return;
    backups.unshift({ id: 'bk_' + Date.now(), reason, at: Date.now(), snapshot });
    writeBackups(backups);
}

function createManualBackup() {
    createDashboardBackup('Manual');
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
        el.textContent = 'No backups yet.';
        return;
    }
    el.className = 'trash-list';
    el.innerHTML = backups.map((bk, index) => `<div class="trash-item"><div><strong>💾 ${escapeHTML(bk.reason || 'Backup')}</strong><small>${formatTrashTime(bk.at)}</small></div><div class="trash-actions"><button class="btn-success" onclick="restoreBackupAt(${index})">Restore</button><button class="btn-real-danger" onclick="removeBackupAt(${index})">Delete</button></div></div>`).join('');
}

function restoreBackupAt(index) {
    const backups = readBackups();
    const bk = backups[index];
    if (!bk) return;
    customConfirm('Restoring this backup will replace the current dashboard data. Do you want to continue?', '💾 Restore backup').then(ok => {
        if (!ok) return;
        try {
            createDashboardBackup('Before restore');
            state.dashboardData = JSON.parse(bk.snapshot);
            saveData();
            renderBackupModal();
            closeModal('backupModal');
        } catch (err) {
            alert('This backup is corrupted or unreadable.');
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
    customConfirm('Delete all version backups?', '💾 Delete backup').then(ok => {
        if (!ok) return;
        writeBackups([]);
        renderBackupModal();
    });
}

const __v4SaveData = saveData;
saveData = function() {
    createDashboardBackup('Automatic');
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
    createDashboardBackup('Page open session');
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

    // Lần đầu vào mobile: thu gọn toàn bộ group để không render quá nhiều bảng/schedules cùng at.
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

    // Nếu mobile đang mở một group đã lazy render, render lại riêng một lần để tạo nội dung thật.
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
    btn.title = collapsed ? "Expand sidebar" : "Collapse sidebar";
    btn.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
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
        closeBtn.setAttribute("aria-label", "Close menu");
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
        el.textContent = 'No backups yet.';
        return;
    }

    el.className = 'trash-list backup-list';
    el.innerHTML = backups.map((bk, index) => {
        const isPinned = bk.pinned === true;
        return `
            <div class="trash-item backup-item ${isPinned ? 'backup-pinned' : ''}">
                <div>
                    <strong>${isPinned ? '📌' : '💾'} ${escapeHTML(bk.reason || 'Backup')}</strong>
                    <small>${formatTrashTime(bk.at)}${isPinned ? ' · Pinned' : ''}</small>
                </div>
                <div class="trash-actions backup-actions">
                    <button class="btn-secondary backup-pin-btn ${isPinned ? 'active' : ''}" onclick="toggleBackupPinAt(${index})" title="${isPinned ? 'Unpin backup' : 'Pin backup'}">${isPinned ? '📌' : '📍'}</button>
                    <button class="btn-success" onclick="restoreBackupAt(${index})">Restore</button>
                    <button class="btn-real-danger" onclick="removeBackupAt(${index})">Delete</button>
                </div>
            </div>`;
    }).join('');
};

// Delete backup: nếu backup đang ghim thì hỏi kỹ hơn.
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
        customConfirm('This backup is pinned. Do you still want to delete it?', '📌 Delete pinned backup').then(ok => {
            if (ok) doRemove();
        });
    } else {
        doRemove();
    }
};

// Delete backup hàng loạt: giữ backup đã ghim lại để tránh xóa nhầm.
clearBackups = function() {
    customConfirm('Delete all unpinned backups? Pinned backups will be kept.', '💾 Delete backup').then(ok => {
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
    if (!gapi.client.getToken()) return isSilent ? null : alert('Google is not connected!');
    const syncBtn = getEl('btn-sync-google');
    if (!isSilent && syncBtn) syncBtn.innerHTML = '⏳ Syncing...';

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

        if (!isSilent) alert('📤 Drive sync completed!\nSaved Dashboard, Trash, and Backups.');
    } catch (e) {
        if (!isSilent) alert('Sync error: ' + e.message);
    } finally {
        if (syncBtn) syncBtn.innerHTML = '🔄 Sync Drive';
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
                    'Download newer cloud data to this device [Confirm], or overwrite cloud data with local data [Keep]?\n\nNew cloud data may include Dashboard + Trash + Backups.',
                    '⚠️ DATA CONFLICT'
                );

                if (ok) {
                    applyDrivePayload(cloudData);
                    state.dashboardData.forEach(g => { if (g.pinKey) g.isLocked = true; });
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
                    renderDashboard();
                    updateScheduleUI();
                    renderBackupModal?.();
                    renderTrashModal?.();
                    alert('📥 Data loaded successfully!');
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


// ==========================================================================
// SCHEDULE HUB + PAST SCHEDULE MANAGER
// Gộp Calendar View + Upcoming + Past milestones vào cùng một modal.
// Tự chuyển mốc schedules đã kết thúc ra khỏi folder sang bảng "Past milestones".
// ==========================================================================
const PAST_SCHEDULE_KEY = 'dashboardPastSchedulesV1';
let activeScheduleHubTab = 'calendar';

function readPastSchedules() {
    return readJSONStore(PAST_SCHEDULE_KEY, []);
}

function writePastSchedules(items) {
    writeJSONStore(PAST_SCHEDULE_KEY, Array.isArray(items) ? items : []);
}

function getScheduleStartDateTimeSafe(sch = {}) {
    return new Date(`${sch.date || ''}T${sch.time || '00:00'}`);
}

function getScheduleEndDateTimeSafe(sch = {}) {
    return new Date(`${sch.endDate || sch.date || ''}T${sch.endTime || sch.time || '23:59'}`);
}

function makePastScheduleId(groupId, sch = {}) {
    return [
        groupId,
        sch.id || '',
        sch.title || '',
        sch.date || '',
        sch.time || '',
        sch.endDate || '',
        sch.endTime || ''
    ].join('|');
}

function migratePastSchedules(options = {}) {
    const now = new Date();
    const past = readPastSchedules();
    const existed = new Set(past.map(item => item._pastKey || makePastScheduleId(item.groupId, item.sch || {})));
    let moved = 0;

    state.dashboardData.forEach(group => {
        if (group.pinKey && group.pinKey !== '' && group.isLocked) return;
        if (!Array.isArray(group.schedules) || !group.schedules.length) return;

        for (let i = group.schedules.length - 1; i >= 0; i--) {
            const sch = group.schedules[i];
            const end = getScheduleEndDateTimeSafe(sch);
            if (isNaN(end) || end >= now) continue;

            const _pastKey = makePastScheduleId(group.id, sch);
            if (!existed.has(_pastKey)) {
                past.unshift({
                    id: 'past_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                    _pastKey,
                    movedAt: Date.now(),
                    groupId: group.id,
                    groupTitle: group.title || 'Untitled',
                    groupEmoji: group.emoji || '',
                    sch: { ...sch }
                });
                existed.add(_pastKey);
            }

            group.schedules.splice(i, 1);
            moved++;
        }
    });

    if (moved) {
        writePastSchedules(past);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dashboardData));
        updateScheduleUI?.();
        renderSmartPanels?.();

        if (!options.skipDrive && gapiInited && gisInited && gapi.client.getToken()) {
            clearTimeout(window.__pastScheduleDriveSyncTimer);
            window.__pastScheduleDriveSyncTimer = setTimeout(() => syncToGoogleDrive(true), 700);
        }
    }

    return moved;
}

function getUpcomingScheduleItems(limit = Infinity) {
    migratePastSchedules({ skipDrive: true });
    const now = new Date();
    const upcoming = [];

    state.dashboardData.forEach(group => {
        if (group.pinKey && group.pinKey !== '' && group.isLocked) return;
        (group.schedules || []).forEach((sch, index) => {
            const d = getScheduleEndDateTimeSafe(sch);
            if (!isNaN(d) && d >= now) upcoming.push({ group, sch, index, d });
        });
    });

    upcoming.sort((a, b) => a.d - b.d);
    return Number.isFinite(limit) ? upcoming.slice(0, limit) : upcoming;
}

function formatScheduleDateRange(sch = {}) {
    const start = [sch.date, sch.time].filter(Boolean).join(' ');
    const end = [sch.endDate, sch.endTime].filter(Boolean).join(' ');
    return end && end !== start ? `${start} → ${end}` : start;
}

function renderUpcomingScheduleHub() {
    const el = getEl('scheduleHubUpcomingList');
    if (!el) return;

    const upcoming = getUpcomingScheduleItems(Infinity);

    if (!upcoming.length) {
        el.className = 'schedule-hub-list empty';
        el.textContent = 'No upcoming schedules.';
        return;
    }

    el.className = 'schedule-hub-list';
    el.innerHTML = upcoming.map(x => `
        <button class="schedule-hub-item ${x.sch.important ? 'important' : ''}" onclick="openCalendarScheduleDetail('${x.group.id}', ${x.index})">
            <span class="schedule-hub-item-icon">${x.sch.important ? '⚠️' : (x.sch.emoji && x.sch.emoji !== 'NONE' ? escapeHTML(x.sch.emoji) : '📅')}</span>
            <span class="schedule-hub-item-main">
                <strong>${escapeHTML(x.sch.title || 'Untitled')}</strong>
                <small>${escapeHTML(x.group.title || '')} · ${escapeHTML(formatScheduleDateRange(x.sch))}</small>
            </span>
        </button>
    `).join('');
}

function renderPastScheduleHub() {
    const el = getEl('pastScheduleList');
    if (!el) return;

    const past = readPastSchedules();

    if (!past.length) {
        el.className = 'schedule-hub-list empty';
        el.textContent = 'No past milestones.';
        return;
    }

    el.className = 'schedule-hub-list';
    el.innerHTML = past.map((item, index) => {
        const sch = item.sch || {};
        return `
            <div class="schedule-hub-item past">
                <button class="schedule-hub-item-view" onclick="openPastScheduleDetail(${index})">
                    <span class="schedule-hub-item-icon">${sch.important ? '⚠️' : (sch.emoji && sch.emoji !== 'NONE' ? escapeHTML(sch.emoji) : '🕘')}</span>
                    <span class="schedule-hub-item-main">
                        <strong>${escapeHTML(sch.title || 'Untitled')}</strong>
                        <small>${escapeHTML(item.groupTitle || '')} · ${escapeHTML(formatScheduleDateRange(sch))}</small>
                    </span>
                </button>
                <button class="smart-icon-btn past-delete-btn" onclick="removePastSchedule(${index})" title="Delete past milestone">✕</button>
            </div>
        `;
    }).join('');
}

function openPastScheduleDetail(index) {
    const item = readPastSchedules()[index];
    if (!item) return;

    const sch = item.sch || {};
    const title = getEl('readModalTitle');
    const body = getEl('readModalBody');

    if (!title || !body) return;

    title.innerHTML = `🕘 ${escapeHTML(sch.title || 'Past milestones')}`;
    body.innerHTML = `
        <div class="single-schedule-detail">
            <h4>${sch.important ? '⚠️ ' : ''}${escapeHTML(sch.title || 'Untitled')}</h4>
            <div class="schedule-info-line">
                📁 ${escapeHTML(item.groupTitle || 'Previous folder')}<br>
                🕒 ${escapeHTML(formatScheduleDateRange(sch))}
            </div>
            <div class="schedule-tasks-list">${linkify(escapeHTML(sch.content || 'No content.'))}</div>
        </div>
    `;

    openModal('readModal');
}

function removePastSchedule(index) {
    const past = readPastSchedules();
    past.splice(index, 1);
    writePastSchedules(past);
    renderPastScheduleHub();
}

function switchScheduleHubTab(tab = 'calendar') {
    activeScheduleHubTab = tab;

    document.querySelectorAll('.schedule-hub-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    document.querySelectorAll('.schedule-hub-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    const paneId = {
        calendar: 'scheduleHubCalendarPane',
        upcoming: 'scheduleHubUpcomingPane',
        past: 'scheduleHubPastPane'
    }[tab] || 'scheduleHubCalendarPane';

    getEl(paneId)?.classList.add('active');

    const title = getEl('scheduleHubTitle');
    if (title) {
        title.textContent = tab === 'calendar' ? '📆 Calendar View'
            : tab === 'upcoming' ? '📅 Upcoming'
            : '🕘 Past milestones';
    }

    if (tab === 'calendar') renderCalendarView();
    if (tab === 'upcoming') renderUpcomingScheduleHub();
    if (tab === 'past') renderPastScheduleHub();
}

function openScheduleHub(tab = 'calendar') {
    migratePastSchedules();
    currentCalendarDate = new Date();
    currentCalendarDate.setDate(1);
    openModal('calendarModal');
    switchScheduleHubTab(tab);
    toggleMobileSidebar(false);
}

// Ghi đè hàm cũ để Calendar View và Upcoming dùng chung modal mới.
openCalendarModal = function() {
    openScheduleHub('calendar');
};

const __scheduleHubOpenSidebarPanel = openSidebarPanel;
openSidebarPanel = function(type) {
    if (type === 'upcoming') {
        openScheduleHub('upcoming');
        return;
    }
    return __scheduleHubOpenSidebarPanel(type);
};

// Ghi đè nội dung Upcoming cũ để đồng bộ với logic tự chuyển mốc đã qua.
const __scheduleHubRenderSidebarPanelContent = renderSidebarPanelContent;
renderSidebarPanelContent = function(type) {
    if (type !== 'upcoming') return __scheduleHubRenderSidebarPanelContent(type);

    const upcoming = getUpcomingScheduleItems(40);
    if (!upcoming.length) return '<div class="smart-list empty">No upcoming schedules.</div>';

    return `<div class="smart-list">${upcoming.map(x => `
        <div class="smart-item" onclick="closeModal('sidebarPanelModal'); openCalendarScheduleDetail('${x.group.id}', ${x.index})">
            <span>${x.sch.important ? '⚠️' : '📅'} ${escapeHTML(x.sch.title || 'Untitled')}</span>
            <small>${escapeHTML(x.group.title || '')} · ${escapeHTML(formatScheduleDateRange(x.sch))}</small>
        </div>
    `).join('')}</div>`;
};

// Chạy migration khi render để folder tự sạch mốc đã qua.
const __scheduleHubRenderDashboard = renderDashboard;
renderDashboard = function() {
    migratePastSchedules({ skipDrive: true });
    __scheduleHubRenderDashboard();
    if (getEl('calendarModal')?.classList.contains('active')) {
        if (activeScheduleHubTab === 'upcoming') renderUpcomingScheduleHub();
        if (activeScheduleHubTab === 'past') renderPastScheduleHub();
    }
};

// Cập nhật payload Drive để lưu cả "Past milestones".
if (typeof buildDrivePayload === 'function') {
    const __scheduleHubBuildDrivePayload = buildDrivePayload;
    buildDrivePayload = function() {
        const payload = __scheduleHubBuildDrivePayload();
        payload.pastSchedules = readPastSchedules();
        return payload;
    };
}

if (typeof applyDrivePayload === 'function') {
    const __scheduleHubApplyDrivePayload = applyDrivePayload;
    applyDrivePayload = function(cloudData) {
        __scheduleHubApplyDrivePayload(cloudData);
        if (cloudData && Array.isArray(cloudData.pastSchedules)) {
            localStorage.setItem(PAST_SCHEDULE_KEY, JSON.stringify(cloudData.pastSchedules));
        }
    };
}

// Nếu store mốc đã qua thay đổi thì sync ngầm lên Drive giống thùng rác/backup.
if (typeof writeJSONStore === 'function') {
    const __scheduleHubWriteJSONStore = writeJSONStore;
    writeJSONStore = function(key, value) {
        __scheduleHubWriteJSONStore(key, value);
        if (key === PAST_SCHEDULE_KEY && gapiInited && gisInited && gapi.client.getToken()) {
            clearTimeout(window.__pastScheduleMetaSyncTimer);
            window.__pastScheduleMetaSyncTimer = setTimeout(() => syncToGoogleDrive(true), 700);
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    migratePastSchedules();
});

// ========================================================================== 
// KANBAN WORKSPACE FIX - modal based board/column/card actions
// ========================================================================== 
let kanbanTextModalResolve = null;

function ensureKanbanTextModal() {
    if (getEl('kanbanTextModal')) return;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'kanbanTextModal';
    modal.innerHTML = `
        <div class="modal-box kanban-text-modal-box" style="max-width:420px;">
            <h3 id="kanbanTextModalTitle">Kanban</h3>
            <label id="kanbanTextModalLabel">Name:</label>
            <input type="text" id="kanbanTextModalInput" autocomplete="off">
            <p id="kanbanTextModalHint" class="kanban-modal-hint"></p>
            <div class="modal-footer">
                <button class="btn-secondary" id="kanbanTextCancelBtn" type="button">Cancel</button>
                <button class="btn-primary" id="kanbanTextConfirmBtn" type="button">Confirm</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const cancel = () => {
        closeModal('kanbanTextModal');
        if (kanbanTextModalResolve) kanbanTextModalResolve(null);
        kanbanTextModalResolve = null;
    };
    const confirm = () => {
        const value = (getEl('kanbanTextModalInput')?.value || '').trim();
        if (!value) {
            getEl('kanbanTextModalHint').textContent = 'Please enter a name.';
            return;
        }
        closeModal('kanbanTextModal');
        if (kanbanTextModalResolve) kanbanTextModalResolve(value);
        kanbanTextModalResolve = null;
    };

    getEl('kanbanTextCancelBtn').onclick = cancel;
    getEl('kanbanTextConfirmBtn').onclick = confirm;
    getEl('kanbanTextModalInput').addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            confirm();
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            cancel();
        }
    });
}

function openKanbanTextModal({ title = 'Kanban', label = 'Name:', value = '', placeholder = '', confirmText = 'Confirm' } = {}) {
    ensureKanbanTextModal();
    getEl('kanbanTextModalTitle').textContent = title;
    getEl('kanbanTextModalLabel').textContent = label;
    getEl('kanbanTextModalInput').value = value || '';
    getEl('kanbanTextModalInput').placeholder = placeholder || '';
    getEl('kanbanTextModalHint').textContent = '';
    getEl('kanbanTextConfirmBtn').textContent = confirmText;
    openModal('kanbanTextModal');
    setTimeout(() => getEl('kanbanTextModalInput')?.focus(), 50);
    return new Promise(resolve => { kanbanTextModalResolve = resolve; });
}

function showKanbanNotice(message, title = '📌 Kanban Notice') {
    const alertModal = getEl('alertModal');
    const alertTitle = getEl('alertModalTitle');
    const alertMsg = getEl('alertMessage');
    if (alertModal && alertMsg) {
        if (alertTitle) alertTitle.textContent = title;
        alertMsg.textContent = message;
        openModal('alertModal');
        return;
    }
    console.warn(message);
}

function refreshKanbanAfterChange(groupId, boardId) {
    saveData();
    if (getEl('kanbanWorkspaceModal')?.classList.contains('active')) {
        kanbanWorkspaceState.groupId = groupId;
        if (boardId) kanbanWorkspaceState.boardId = boardId;
        renderKanbanWorkspaceBody();
    }
}

function ensureKanbanWorkspaceModal() {
    let modal = getEl('kanbanWorkspaceModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-overlay kanban-workspace-overlay';
        modal.id = 'kanbanWorkspaceModal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="kanban-workspace-box">
            <div class="kanban-workspace-head">
                <div>
                    <h3 id="kanbanWorkspaceTitle">📌 Kanban Workspace</h3>
                    <p id="kanbanWorkspaceSubtitle">Boards, columns and cards</p>
                </div>
                <button class="modal-close-soft" onclick="closeModal('kanbanWorkspaceModal')">✕</button>
            </div>
            <div class="kanban-workspace-actions">
                <button class="btn-primary" onclick="addKanbanBoard()">➕ Board</button>
                <button class="btn-primary" onclick="addKanbanColumn()">➕ Column</button>
                <button class="btn-primary" onclick="openKanbanCardModal()">➕ Card</button>
                <button class="btn-secondary" onclick="renameKanbanBoard()">📝 Rename board</button>
                <button class="btn-secondary" id="kanbanLayoutToggleBtn" onclick="toggleKanbanLayoutMode()">⇄ Row view</button>
                <button class="btn-real-danger" onclick="deleteKanbanBoard()">🗑️ Delete board</button>
                <input id="kanbanWorkspaceSearch" type="search" placeholder="Search cards..." oninput="renderKanbanWorkspaceBody()">
            </div>
            <div class="kanban-workspace-layout">
                <aside id="kanbanBoardList" class="kanban-board-list"></aside>
                <main id="kanbanWorkspaceBody" class="kanban-workspace-body"></main>
            </div>
        </div>
    `;
}

function renderKanbanWorkspaceBody() {
    const group = getGroup(kanbanWorkspaceState.groupId);
    if (!group) return;
    const workspace = normalizeKanbanGroup(group);
    const activeBoard = getKanbanBoard(group, kanbanWorkspaceState.boardId);
    kanbanWorkspaceState.boardId = activeBoard.id;
    const keyword = (getEl('kanbanWorkspaceSearch')?.value || '').trim().toLowerCase();
    const layoutMode = kanbanLayoutMode === 'row' ? 'row' : 'column';
    const layoutBtn = getEl('kanbanLayoutToggleBtn');
    if (layoutBtn) layoutBtn.textContent = layoutMode === 'row' ? '▦ Column view' : '⇄ Row view';

    const boardList = getEl('kanbanBoardList');
    if (boardList) {
        boardList.innerHTML = workspace.boards.map(board => `
            <button class="kanban-board-tab ${board.id === activeBoard.id ? 'active' : ''}" onclick="kanbanWorkspaceState.boardId='${board.id}';renderKanbanWorkspaceBody()">
                <span>${escapeHTML(board.title)}</span>
                <small>${getKanbanCardCount(group, board.id)} cards · ${board.columns.length} columns</small>
            </button>
        `).join('') + `
            <button class="kanban-board-tab add" onclick="addKanbanBoard()">＋ New board</button>
        `;
    }

    const body = getEl('kanbanWorkspaceBody');
    if (!body) return;
    const subtitle = getEl('kanbanWorkspaceSubtitle');
    if (subtitle) subtitle.textContent = `${workspace.boards.length} boards · ${getKanbanCardCount(group)} total cards · Active: ${activeBoard.title}`;

    body.innerHTML = `
        <div class="kanban-full-board ${layoutMode === 'row' ? 'kanban-row-mode' : 'kanban-column-mode'}" data-group-id="${group.id}" data-board-id="${activeBoard.id}">
            ${activeBoard.columns.map(col => {
                const filteredCards = keyword
                    ? col.cards.filter(card => [card.title, card.content, card.priority, card.deadline].filter(Boolean).join(' ').toLowerCase().includes(keyword))
                    : col.cards;
                return `
                    <section class="kanban-full-column" data-column-id="${col.id}">
                        <div class="kanban-full-column-head">
                            <strong>${escapeHTML(col.title)}</strong>
                            <span>${filteredCards.length}/${col.cards.length}</span>
                        </div>
                        <div class="kanban-full-column-actions">
                            <button onclick="openKanbanCardModal('${group.id}','${col.id}',null,'${activeBoard.id}')">＋ Card</button>
                            <button onclick="renameKanbanColumn('${group.id}','${col.id}','${activeBoard.id}')">Edit</button>
                            <button onclick="deleteKanbanColumn('${group.id}','${col.id}','${activeBoard.id}')">Delete</button>
                        </div>
                        <div class="kanban-workspace-card-list" data-group-id="${group.id}" data-board-id="${activeBoard.id}" data-column-id="${col.id}">
                            ${filteredCards.map(card => renderKanbanWorkspaceCardHTML(group.id, activeBoard.id, card)).join('')}
                        </div>
                    </section>
                `;
            }).join('')}
            <section class="kanban-full-column add-column" onclick="addKanbanColumn('${group.id}', '${activeBoard.id}')">＋ Add column</section>
        </div>
    `;
    initKanbanWorkspaceDragAndDrop();
}

async function addKanbanBoard(groupId = kanbanWorkspaceState.groupId) {
    const group = getGroup(groupId);
    if (!group) return;
    const title = await openKanbanTextModal({
        title: '➕ Add board',
        label: 'Board name:',
        value: 'New Board',
        placeholder: 'Example: Dashboard Project',
        confirmText: 'Create board'
    });
    if (!title) return;
    const board = createDefaultKanbanBoard(title);
    normalizeKanbanGroup(group).boards.push(board);
    kanbanWorkspaceState = { groupId: group.id, boardId: board.id };
    refreshKanbanAfterChange(group.id, board.id);
}

async function renameKanbanBoard(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const title = await openKanbanTextModal({
        title: '📝 Rename board',
        label: 'Board name:',
        value: board.title,
        placeholder: 'Example: Dashboard Project',
        confirmText: 'Save board'
    });
    if (!title) return;
    board.title = title;
    refreshKanbanAfterChange(group.id, board.id);
}

function deleteKanbanBoard(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const workspace = normalizeKanbanGroup(group);
    if (workspace.boards.length <= 1) {
        showKanbanNotice('Kanban workspace must have at least one board.');
        return;
    }
    const board = getKanbanBoard(group, boardId);
    customConfirm(`Delete board "${escapeHTML(board.title)}" and all cards inside?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        workspace.boards = workspace.boards.filter(item => item.id !== board.id);
        kanbanWorkspaceState.boardId = workspace.boards[0].id;
        refreshKanbanAfterChange(group.id, kanbanWorkspaceState.boardId);
    });
}

async function addKanbanColumn(groupId = kanbanWorkspaceState.groupId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const title = await openKanbanTextModal({
        title: '➕ Add column',
        label: 'Column name:',
        value: 'New Column',
        placeholder: 'Example: Waiting, Testing, Done...',
        confirmText: 'Create column'
    });
    if (!title) return;
    board.columns.push({ id: `col_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`, title, cards: [] });
    refreshKanbanAfterChange(group.id, board.id);
}

async function renameKanbanColumn(groupId = kanbanWorkspaceState.groupId, columnId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group || !columnId) return;
    const col = getKanbanColumn(group, columnId, boardId);
    if (!col) return;
    const title = await openKanbanTextModal({
        title: '📝 Rename column',
        label: 'Column name:',
        value: col.title,
        placeholder: 'Example: Review',
        confirmText: 'Save column'
    });
    if (!title) return;
    col.title = title;
    refreshKanbanAfterChange(group.id, boardId);
}

function deleteKanbanColumn(groupId = kanbanWorkspaceState.groupId, columnId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group || !columnId) return;
    const board = getKanbanBoard(group, boardId);
    const col = board.columns.find(c => c.id === columnId);
    if (!col) return;
    if (board.columns.length <= 1) {
        showKanbanNotice('Kanban must have at least one column.');
        return;
    }
    customConfirm(`Delete column "${escapeHTML(col.title)}" and ${col.cards.length} cards inside?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        board.columns = board.columns.filter(c => c.id !== columnId);
        refreshKanbanAfterChange(group.id, board.id);
    });
}

function submitKanbanCardForm() {
    const group = getGroup(kanbanCardEditState.groupId);
    if (!group) return;
    const title = (getEl('kanbanCardTitleInput')?.value || '').trim();
    if (!title) {
        showKanbanNotice('Please enter a card title.');
        return;
    }
    const data = {
        id: kanbanCardEditState.cardId || `card_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
        title,
        priority: getEl('kanbanCardPriorityInput')?.value || 'normal',
        deadline: getEl('kanbanCardDeadlineInput')?.value || '',
        content: getEl('kanbanCardContentInput')?.value || ''
    };
    if (kanbanCardEditState.cardId) {
        const found = findKanbanCard(group, kanbanCardEditState.cardId, kanbanCardEditState.boardId);
        if (found) found.column.cards[found.index] = data;
    } else {
        const column = getKanbanColumn(group, kanbanCardEditState.columnId, kanbanCardEditState.boardId);
        column.cards.push(data);
    }
    closeModal('kanbanCardModal');
    refreshKanbanAfterChange(group.id, kanbanCardEditState.boardId);
}

function deleteKanbanCard(groupId, cardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId);
    if (!found) return;
    customConfirm(`Delete card "${escapeHTML(found.card.title || 'Untitled')}"?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        found.column.cards.splice(found.index, 1);
        refreshKanbanAfterChange(group.id, found.board.id);
    });
}


// ========================================================================== 
// KANBAN FIX PATCH: top modal stacking + delete one card button
// ========================================================================== 
function openKanbanTopModal(id) {
    const modal = getEl(id);
    if (!modal) return;
    modal.classList.add('active');
    modal.classList.add('modal-on-top');
    modal.style.zIndex = '2147483000';
    const box = modal.querySelector('.modal-box');
    if (box) box.style.zIndex = '2147483001';
}

function closeKanbanTopModal(id) {
    const modal = getEl(id);
    if (!modal) return;
    modal.classList.remove('active');
    modal.classList.remove('modal-on-top');
    modal.style.zIndex = '';
    const box = modal.querySelector('.modal-box');
    if (box) box.style.zIndex = '';
}

// Override confirm so deletion confirm always appears above Kanban fullscreen modal.
function customConfirm(message, title = "❓ Confirm action") {
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
        openKanbanTopModal('confirmModal');
        confirmBtn.onclick = function() {
            closeKanbanTopModal('confirmModal');
            resolve(true);
        };
        cancelBtn.onclick = function() {
            closeKanbanTopModal('confirmModal');
            resolve(false);
        };
    });
}

// Override card modal so Edit Card shows a Delete button and modal stays above board.
function openKanbanCardModal(groupId = kanbanWorkspaceState.groupId, columnId = null, cardId = null, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    if (!group) return;
    const board = getKanbanBoard(group, boardId);
    const found = cardId ? findKanbanCard(group, cardId, board.id) : null;
    const firstColumn = board.columns[0];
    kanbanCardEditState = {
        groupId: group.id,
        boardId: found?.board?.id || board.id,
        columnId: found?.column?.id || columnId || firstColumn?.id,
        cardId: found?.card?.id || null
    };
    getEl('kanbanCardModalTitle').innerText = found ? '📝 Edit Kanban Card' : '➕ Add Kanban Card';
    getEl('kanbanCardTitleInput').value = found?.card?.title || '';
    getEl('kanbanCardPriorityInput').value = found?.card?.priority || 'normal';
    getEl('kanbanCardDeadlineInput').value = found?.card?.deadline || '';
    getEl('kanbanCardContentInput').value = found?.card?.content || '';

    let deleteBtn = getEl('kanbanCardDeleteBtn');
    const footer = getEl('kanbanCardModal')?.querySelector('.modal-footer');
    if (!deleteBtn && footer) {
        deleteBtn = document.createElement('button');
        deleteBtn.id = 'kanbanCardDeleteBtn';
        deleteBtn.className = 'btn-real-danger';
        deleteBtn.textContent = 'Delete card';
        deleteBtn.style.marginRight = 'auto';
        deleteBtn.onclick = deleteCurrentKanbanCard;
        footer.prepend(deleteBtn);
    }
    if (deleteBtn) deleteBtn.style.display = found ? 'inline-flex' : 'none';

    openKanbanTopModal('kanbanCardModal');
}

function submitKanbanCardForm() {
    const group = getGroup(kanbanCardEditState.groupId);
    if (!group) return;
    const title = (getEl('kanbanCardTitleInput')?.value || '').trim();
    if (!title) {
        showKanbanNotice('Please enter a card title.');
        return;
    }
    const data = {
        id: kanbanCardEditState.cardId || `card_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
        title,
        priority: getEl('kanbanCardPriorityInput')?.value || 'normal',
        deadline: getEl('kanbanCardDeadlineInput')?.value || '',
        content: getEl('kanbanCardContentInput')?.value || ''
    };
    if (kanbanCardEditState.cardId) {
        const found = findKanbanCard(group, kanbanCardEditState.cardId, kanbanCardEditState.boardId);
        if (found) found.column.cards[found.index] = data;
    } else {
        const column = getKanbanColumn(group, kanbanCardEditState.columnId, kanbanCardEditState.boardId);
        if (!column) return;
        column.cards.push(data);
    }
    closeKanbanTopModal('kanbanCardModal');
    refreshKanbanAfterChange(group.id, kanbanCardEditState.boardId);
}

function deleteCurrentKanbanCard() {
    const { groupId, cardId, boardId } = kanbanCardEditState || {};
    if (!groupId || !cardId) return;
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId, boardId);
    if (!found) return;

    closeSmartModal('kanbanCardModal');

    customConfirm(`Delete card "${escapeHTML(found.card.title || 'Untitled card')}"?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) {
            openKanbanCardModal(groupId, found.column.id, cardId, found.board.id);
            return;
        }
        found.column.cards.splice(found.index, 1);
        refreshKanbanAfterChange(group.id, found.board.id);
    });
}

function deleteKanbanCard(groupId, cardId, boardId = kanbanWorkspaceState.boardId) {
    const group = getGroup(groupId);
    const found = findKanbanCard(group, cardId, boardId);
    if (!found) return;
    customConfirm(`Delete card "${escapeHTML(found.card.title || 'Untitled card')}"?`, '⚠️ Confirm deletion').then(ok => {
        if (!ok) return;
        found.column.cards.splice(found.index, 1);
        refreshKanbanAfterChange(group.id, found.board.id);
    });
}



// ==========================================================================
// GLOBAL MODAL MANAGER
// Opens one modal at a time. If a modal is already open, it is hidden and pushed
// to a stack. Closing the current modal restores the previous one.
// ==========================================================================
const modalStack = window.modalStack || [];
window.modalStack = modalStack;

function getActiveTopModal() {
    const activeModals = Array.from(document.querySelectorAll('.modal-overlay.active:not(.modal-hidden-stack)'));
    return activeModals.length ? activeModals[activeModals.length - 1] : null;
}

function openSmartModal(id) {
    const newModal = getEl ? getEl(id) : document.getElementById(id);
    if (!newModal) return;

    const currentModal = getActiveTopModal();

    if (currentModal && currentModal.id !== id) {
        currentModal.classList.add('modal-hidden-stack');
        currentModal.classList.remove('active');
        if (currentModal.id && modalStack[modalStack.length - 1] !== currentModal.id) {
            modalStack.push(currentModal.id);
        }
    }

    newModal.classList.remove('modal-hidden-stack');
    newModal.classList.add('active');
    newModal.style.zIndex = '';
    const box = newModal.querySelector('.modal-box');
    if (box) box.style.zIndex = '';
}

function closeSmartModal(id) {
    const modal = getEl ? getEl(id) : document.getElementById(id);
    if (!modal) return;

    modal.classList.remove('active');
    modal.classList.remove('modal-hidden-stack');
    modal.style.zIndex = '';
    const box = modal.querySelector('.modal-box');
    if (box) box.style.zIndex = '';

    let previousId = modalStack.pop();
    while (previousId) {
        const previousModal = getEl ? getEl(previousId) : document.getElementById(previousId);
        if (previousModal) {
            previousModal.classList.remove('modal-hidden-stack');
            previousModal.classList.add('active');
            previousModal.style.zIndex = '';
            const previousBox = previousModal.querySelector('.modal-box');
            if (previousBox) previousBox.style.zIndex = '';
            break;
        }
        previousId = modalStack.pop();
    }
}

function closeAllSmartModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active', 'modal-hidden-stack', 'modal-on-top', 'kanban-confirm-top');
        modal.style.zIndex = '';
        const box = modal.querySelector('.modal-box');
        if (box) box.style.zIndex = '';
    });
    modalStack.length = 0;
}

// Override old modal helpers globally so existing buttons/functions use the same manager.
openModal = openSmartModal;
closeModal = closeSmartModal;

function openKanbanTopModal(id) { openSmartModal(id); }
function closeKanbanTopModal(id) { closeSmartModal(id); }
function openKanbanChildModal(id) { openSmartModal(id); }
function closeKanbanChildModal(id) { closeSmartModal(id); }
// ============================================================================
// MULTI THEME + IMMERSIVE THEME-AWARE SCENES (V3)
// ============================================================================
// MULTI THEME + CINEMATIC ADAPTIVE SCENES (V3)
// ============================================================================
const DASHBOARD_THEMES = [
  {id:'dark',name:'Dark',icon:'🌙',scene:'night'}, {id:'light',name:'Light',icon:'☀️',scene:'day'},
  {id:'midnight',name:'Midnight',icon:'🌌',scene:'midnight'}, {id:'oled',name:'OLED',icon:'⚫',scene:'oled'},
  {id:'forest',name:'Forest',icon:'🌲',scene:'forest'}, {id:'ocean',name:'Ocean',icon:'🌊',scene:'ocean'},
  {id:'sunset',name:'Sunset',icon:'🌇',scene:'sunset'}, {id:'coffee',name:'Coffee',icon:'☕',scene:'coffee'},
  {id:'mint',name:'Mint',icon:'🌿',scene:'meadow'}, {id:'sakura-night',name:'Sakura Night',icon:'🌸',scene:'sakura'},
  {id:'sky',name:'Sky',icon:'☁️',scene:'sky'}, {id:'cyber',name:'Cyber',icon:'⚡',scene:'cyber'},
  {id:'grape',name:'Grape',icon:'🍇',scene:'grape'}, {id:'terminal',name:'Terminal',icon:'💻',scene:'terminal'}
];
const LIGHT_COMPAT_THEMES = new Set(['light','mint','sky']);
const THEME_SCENE_LABELS={night:'Starry night',day:'Soft daylight',midnight:'Moonlit mountains',oled:'Pure black sky',forest:'Forest · mist · fireflies',rose:'Rose meadow · wind · clouds',lavender:'Lavender valley',ocean:'Underwater reef',sunset:'Golden valley',coffee:'Warm café window',meadow:'Fresh meadow',sakura:'Moonlit sakura',sky:'Open blue sky',lemon:'Lemon orchard',peach:'Peach orchard',cyber:'Neon skyline',grape:'Purple nebula',terminal:'Terminal city'};
let themeFxParticles=[], themeFxTick=0, sceneCache=null, sceneCacheCtx=null, sceneCacheKey='', fxLastFrame=0;
const prefersReducedMotion = matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
const FX_QUALITY = (()=>{ const mobile=innerWidth<769; const cores=navigator.hardwareConcurrency||4; const mem=navigator.deviceMemory||4; if(prefersReducedMotion) return .22; if(mobile||cores<=4||mem<=4) return .55; return .9; })();
const FX_TARGET_FPS = FX_QUALITY < .6 ? 30 : 45;

const AUTO_TIME_THEME_KEY = 'dashboardAutoTimeThemeV1';
let autoTimeThemeTimer = null;
let lastAutoTimeThemeSlot = '';

function getCurrentTheme(){ const v=localStorage.getItem(THEME_KEY)||'dark'; return DASHBOARD_THEMES.some(t=>t.id===v)?v:'dark'; }
function getThemeMeta(id=null){
  // Visuals must follow the theme currently applied to the page.
  // Auto by time intentionally does not overwrite THEME_KEY, so reading only
  // localStorage here would keep the old Visuals scene.
  const activeThemeId = id || document.body.dataset.theme || getCurrentTheme();
  return DASHBOARD_THEMES.find(t=>t.id===activeThemeId)||DASHBOARD_THEMES[0];
}
function sceneLabel(scene){return THEME_SCENE_LABELS[scene]||scene;}
function isAutoTimeThemeEnabled(){ return localStorage.getItem(AUTO_TIME_THEME_KEY)==='true'; }
function getAutoTimeThemeInfo(date=new Date()){
  const h=date.getHours();
  if(h>=5 && h<10) return {slot:'morning',label:'Morning',icon:'🌅',theme:'sky',range:'05:00–09:59'};
  if(h>=10 && h<14) return {slot:'noon',label:'Noon',icon:'☀️',theme:'light',range:'10:00–13:59'};
  if(h>=14 && h<18) return {slot:'afternoon',label:'Afternoon',icon:'🌇',theme:'sunset',range:'14:00–17:59'};
  if(h>=18 && h<22) return {slot:'evening',label:'Evening',icon:'☕',theme:'coffee',range:'18:00–21:59'};
  return {slot:'night',label:'Night',icon:'🌙',theme:'midnight',range:'22:00–04:59'};
}
function updateAutoTimeThemeUI(){
  const autoBtn=document.getElementById('autoTimeThemeChoice');
  if(!autoBtn)return;
  const enabled=isAutoTimeThemeEnabled();
  const info=getAutoTimeThemeInfo();
  autoBtn.classList.toggle('active',enabled);
  const check=autoBtn.querySelector('.theme-check'); if(check)check.textContent=enabled?'✓':'';
  const desc=autoBtn.querySelector('.auto-time-description');
  if(desc)desc.textContent=enabled?`${info.icon} ${info.label} now · ${info.range} · ${getThemeMeta(info.theme).name}`:'Automatically changes Morning · Noon · Afternoon · Evening · Night';
}
function applyDashboardTheme(themeId,save=true,preserveAuto=false){
  const meta=getThemeMeta(themeId); document.body.dataset.theme=meta.id; document.body.classList.toggle('light-mode',LIGHT_COMPAT_THEMES.has(meta.id));
  if(save){localStorage.setItem(THEME_KEY,meta.id); if(!preserveAuto)localStorage.setItem(AUTO_TIME_THEME_KEY,'false');}
  const btn=getEl('themeBtn');
  if(btn){
    const auto=isAutoTimeThemeEnabled();
    const info=getAutoTimeThemeInfo();
    btn.innerHTML=`<span class="sidebar-menu-icon">${auto?info.icon:meta.icon}</span><span>${auto?'Auto theme':'Theme'}</span>`;
    btn.title=auto?`Auto by time: ${info.label} (${info.range}) · ${meta.name}`:`Theme: ${meta.name}`;
  }
  document.querySelectorAll('.theme-choice[data-theme]').forEach(el=>{const on=!isAutoTimeThemeEnabled()&&el.dataset.theme===meta.id;el.classList.toggle('active',on);const m=el.querySelector('.theme-check');if(m)m.textContent=on?'✓':'';});
  updateAutoTimeThemeUI();
  invalidateScene(); if(isCanvasEnabled){initBackgroundObjects(); if(!animationFrameId)animationFrameId=requestAnimationFrame(drawBackground);}
}
function applyAutoTimeTheme(force=false){
  if(!isAutoTimeThemeEnabled())return;
  const info=getAutoTimeThemeInfo();
  if(!force && lastAutoTimeThemeSlot===info.slot)return;
  lastAutoTimeThemeSlot=info.slot;
  applyDashboardTheme(info.theme,false,true);
  updateAutoTimeThemeUI();
}
function setAutoTimeTheme(enabled=true){
  localStorage.setItem(AUTO_TIME_THEME_KEY,enabled?'true':'false');
  lastAutoTimeThemeSlot='';
  if(enabled){applyAutoTimeTheme(true); startAutoTimeThemeWatcher();}
  else {stopAutoTimeThemeWatcher(); applyDashboardTheme(getCurrentTheme(),false,true);}
  updateAutoTimeThemeUI();
}
function startAutoTimeThemeWatcher(){
  stopAutoTimeThemeWatcher();
  if(!isAutoTimeThemeEnabled())return;
  autoTimeThemeTimer=setInterval(()=>applyAutoTimeTheme(false),30000);
}
function stopAutoTimeThemeWatcher(){if(autoTimeThemeTimer){clearInterval(autoTimeThemeTimer);autoTimeThemeTimer=null;}}
function toggleTheme(){openThemePicker();}
function ensureThemePicker(){
  if(document.getElementById('themePickerOverlay'))return;
  const o=document.createElement('div');o.id='themePickerOverlay';o.className='theme-picker-overlay';
  o.innerHTML=`<div class="theme-picker-panel" role="dialog" aria-modal="true"><div class="theme-picker-head"><div><h3>🎨 Choose theme</h3><small style="color:var(--text-sub)">Cinematic adaptive scenes — optimized for smoothness.</small></div><button class="theme-picker-close" type="button">✕</button></div><button id="autoTimeThemeChoice" class="theme-choice auto-time-theme-choice" type="button"><span class="theme-check"></span><strong>🕒 Auto by time</strong><small class="auto-time-description">Automatically changes Morning · Noon · Afternoon · Evening · Night</small><span class="auto-time-slots"><span>🌅 Morning</span><span>☀️ Noon</span><span>🌇 Afternoon</span><span>☕ Evening</span><span>🌙 Night</span></span></button><div class="theme-picker-grid">${DASHBOARD_THEMES.map(t=>`<button class="theme-choice" type="button" data-theme="${t.id}"><span class="theme-check"></span><strong>${t.icon} ${t.name}</strong><small>${sceneLabel(t.scene)}</small></button>`).join('')}</div></div>`;
  document.body.appendChild(o);
  o.addEventListener('click',e=>{if(e.target===o)closeThemePicker()});
  o.querySelector('.theme-picker-close')?.addEventListener('click',closeThemePicker);
  o.querySelector('#autoTimeThemeChoice')?.addEventListener('click',()=>{setAutoTimeTheme(!isAutoTimeThemeEnabled());updateAutoTimeThemeUI();});
  o.querySelectorAll('.theme-choice[data-theme]').forEach(b=>b.addEventListener('click',()=>{setAutoTimeTheme(false);applyDashboardTheme(b.dataset.theme,true,false);closeThemePicker();}));
  updateAutoTimeThemeUI();
}
function openThemePicker(){ensureThemePicker();document.getElementById('themePickerOverlay')?.classList.add('active');if(isAutoTimeThemeEnabled())applyAutoTimeTheme(true);else applyDashboardTheme(getCurrentTheme(),false,true);updateAutoTimeThemeUI();}
function closeThemePicker(){document.getElementById('themePickerOverlay')?.classList.remove('active')}
function invalidateScene(){sceneCacheKey='';sceneCache=null;sceneCacheCtx=null;}

function resizeCanvas(){if(!canvas)return;const dpr=Math.min(devicePixelRatio||1,FX_QUALITY<.6?1:1.35);const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);canvas._cssW=w;canvas._cssH=h;invalidateScene();if(isCanvasEnabled)initBackgroundObjects();}
function addFx(n,maker){n=Math.max(1,Math.round(n*FX_QUALITY));const w=canvas._cssW||innerWidth,h=canvas._cssH||innerHeight;for(let i=0;i<n;i++)themeFxParticles.push(maker(i,w,h));}
function initBackgroundObjects(){if(!canvas||!ctx)return;themeFxParticles=[];const s=getThemeMeta().scene;const common=()=>({x:Math.random()*(canvas._cssW||innerWidth),y:Math.random()*(canvas._cssH||innerHeight),p:Math.random()*6.283});
  if(['night','midnight','oled'].includes(s))addFx(80,()=>({...common(),r:.35+Math.random()*1.35,a:.25+Math.random()*.65,tw:.7+Math.random()*1.6,shoot:Math.random()<.035,v:1+Math.random()*1.1}));
  if(['day','sky','rose','lavender','meadow','lemon','peach','sunset'].includes(s))addFx(7,()=>({...common(),y:35+Math.random()*220,s:.65+Math.random()*1.15,v:.08+Math.random()*.12,a:.22+Math.random()*.18}));
  if(s==='forest')addFx(42,()=>({...common(),y:(canvas._cssH||innerHeight)*(.35+Math.random()*.58),r:1+Math.random()*1.7,a:.25+Math.random()*.7,vx:(Math.random()-.5)*.08,vy:(Math.random()-.5)*.06}));
  if(['rose','lavender','sakura','peach'].includes(s))addFx(28,()=>({...common(),r:2.5+Math.random()*3.5,a:.25+Math.random()*.5,vx:.13+Math.random()*.28,vy:.08+Math.random()*.23,rot:Math.random()*6.28,vr:(Math.random()-.5)*.025}));
  if(s==='ocean')addFx(34,()=>({...common(),r:2+Math.random()*7,a:.10+Math.random()*.18,vy:-.08-Math.random()*.2}));
  if(s==='coffee')addFx(9,()=>({...common(),x:(canvas._cssW||innerWidth)*(.44+Math.random()*.12),y:(canvas._cssH||innerHeight)*(.6+Math.random()*.2),r:9+Math.random()*12,a:.025+Math.random()*.055,vy:-.035-Math.random()*.06}));
  if(s==='cyber'||s==='terminal')addFx(Math.max(18,Math.floor((canvas._cssW||innerWidth)/36)),()=>({...common(),s:10+Math.random()*5,vy:.35+Math.random()*.8,a:.06+Math.random()*.14,ch:String.fromCharCode(0x30A0+Math.random()*70)}));
  if(s==='grape')addFx(34,()=>({...common(),r:.8+Math.random()*2.4,a:.08+Math.random()*.2,vx:(Math.random()-.5)*.035,vy:(Math.random()-.5)*.035}));
}

function mkOffscreen(w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c;}
function sceneGradient(gctx,w,h,stops){const g=gctx.createLinearGradient(0,0,0,h);stops.forEach(([p,c])=>g.addColorStop(p,c));gctx.fillStyle=g;gctx.fillRect(0,0,w,h);}
function ellipse(g,x,y,rx,ry,fill,a=1,rot=0){g.save();g.globalAlpha=a;g.fillStyle=fill;g.translate(x,y);g.rotate(rot);g.beginPath();g.ellipse(0,0,rx,ry,0,0,6.283);g.fill();g.restore();}
function hill(g,w,h,y,amp,color,phase=0){g.fillStyle=color;g.beginPath();g.moveTo(0,h);for(let x=0;x<=w+30;x+=35)g.lineTo(x,y+Math.sin(x*.008+phase)*amp+Math.sin(x*.021+phase)*amp*.25);g.lineTo(w,h);g.closePath();g.fill();}
function pine(g,x,b,s,c){g.fillStyle='rgba(46,31,20,.8)';g.fillRect(x-2*s,b-42*s,4*s,42*s);g.fillStyle=c;for(let i=0;i<3;i++){const yy=b-(22+i*16)*s;g.beginPath();g.moveTo(x,yy-27*s);g.lineTo(x-18*s,yy+12*s);g.lineTo(x+18*s,yy+12*s);g.closePath();g.fill();}}
function cloud(g,x,y,s,a=.35,t='255,255,255'){g.save();g.globalAlpha=a;g.fillStyle=`rgb(${t})`;g.shadowColor='rgba(255,255,255,.16)';g.shadowBlur=16;[[0,0,27],[29,4,22],[-28,7,19],[5,-17,24]].forEach(([dx,dy,r])=>{g.beginPath();g.arc(x+dx*s,y+dy*s,r*s,0,6.283);g.fill()});g.restore();}
function rose(g,x,y,s,c){g.strokeStyle='rgba(31,99,52,.66)';g.lineWidth=Math.max(.6,s);g.beginPath();g.moveTo(x,y+5*s);g.lineTo(x,y+23*s);g.stroke();for(let i=0;i<5;i++)ellipse(g,x+Math.cos(i*1.256)*3.4*s,y+Math.sin(i*1.256)*2.5*s,3.8*s,2.4*s,c,.94,i*1.256);ellipse(g,x,y,1.7*s,1.7*s,'#ffe4e6');}
function drawStaticScene(g,w,h,meta){const s=meta.scene;
  if(s==='forest'){sceneGradient(g,w,h,[[0,'#102b30'],[.42,'#234d3a'],[.70,'#496b4d'],[1,'#142e1d']]);ellipse(g,w*.72,h*.16,85,40,'#dcebd8',.055);hill(g,w,h,h*.66,18,'#365f46',.5);hill(g,w,h,h*.76,26,'#264f35',1.8);for(let i=0;i<30;i++)pine(g,(i+.15)*w/29,h*.84,.38+(i%5)*.06,i%2?'#214a31':'#2c593b');g.fillStyle='rgba(219,232,222,.055)';g.fillRect(0,h*.48,w,h*.20);for(let i=0;i<18;i++)pine(g,(i+.2)*w/17,h*.97,.72+(i%4)*.08,i%2?'#102f20':'#173925');for(let i=0;i<6;i++)ellipse(g,w*(.06+i*.19),h*(.56+(i%2)*.055),w*.16,16,'#e4eee7',.045);}
  else if(s==='rose'){sceneGradient(g,w,h,[[0,'#f7dfe4'],[.43,'#f8eef0'],[.68,'#cbd9bd'],[1,'#718867']]);ellipse(g,w*.80,h*.15,48,48,'#fff4d3',.48);hill(g,w,h,h*.66,16,'#b8c9aa',.8);hill(g,w,h,h*.75,23,'#93aa82',2.1);g.fillStyle='rgba(255,255,255,.075)';g.fillRect(0,h*.47,w,h*.18);for(let row=0;row<7;row++)for(let i=0;i<Math.ceil(w/27)+3;i++)rose(g,i*27+(row%2)*11,h*(.72+row*.04),.35+row*.075,row%3===0?'#be3455':row%2?'#d95774':'#e87b90');}
  else if(s==='lavender'){sceneGradient(g,w,h,[[0,'#d9d7ff'],[.5,'#f5ecff'],[.72,'#c8dcb1'],[1,'#758c63']]);hill(g,w,h,h*.7,22,'#a5b88b',.5);hill(g,w,h,h*.8,30,'#71825f',2);for(let row=0;row<5;row++){g.strokeStyle='#526b4c';for(let x=10;x<w;x+=20){g.beginPath();g.moveTo(x,h*(.78+row*.045)+18);g.lineTo(x,h*(.78+row*.045));g.stroke();for(let k=0;k<4;k++)ellipse(g,x+(k%2?2:-2),h*(.78+row*.045)-k*4,2.4,4,'#8b5cf6',.75+row*.04)}}}
  else if(s==='ocean'){sceneGradient(g,w,h,[[0,'#0a6c88'],[.45,'#07546d'],[1,'#062e45']]);for(let i=0;i<7;i++){g.save();g.globalAlpha=.06;g.fillStyle='#d7fbff';g.beginPath();g.moveTo(i*w/6-80,0);g.lineTo(i*w/6+120,h*.82);g.lineTo(i*w/6+220,h*.82);g.lineTo(i*w/6+30,0);g.fill();g.restore();}g.fillStyle='#09394b';g.fillRect(0,h*.88,w,h*.12);for(let i=0;i<20;i++){g.strokeStyle=i%2?'#1d806d':'#2f987c';g.lineWidth=3+(i%3);g.beginPath();g.moveTo(i*w/19,h);g.quadraticCurveTo(i*w/19+18,h*.90,i*w/19+Math.sin(i)*12,h*.79);g.stroke();}for(let i=0;i<12;i++)ellipse(g,(i+.4)*w/11,h*.9-(i%3)*10,10+(i%4)*4,5+(i%2)*3,i%2?'#d97757':'#7c8fa3',.55);}
  else if(s==='sunset'){sceneGradient(g,w,h,[[0,'#51236f'],[.37,'#dd6b61'],[.67,'#f6b56b'],[1,'#37324b']]);ellipse(g,w*.76,h*.39,55,55,'#ffd59a',.9);hill(g,w,h,h*.68,52,'#5f4a66',.4);hill(g,w,h,h*.78,40,'#3b4053',2);hill(g,w,h,h*.88,28,'#202c35',4);}
  else if(s==='coffee'){sceneGradient(g,w,h,[[0,'#39241d'],[.6,'#604334'],[1,'#261812']]);g.fillStyle='#1e1511';g.fillRect(0,h*.78,w,h*.22);g.fillStyle='rgba(255,196,130,.08)';g.fillRect(w*.12,h*.12,w*.28,h*.46);g.strokeStyle='rgba(255,220,176,.22)';g.lineWidth=3;g.strokeRect(w*.12,h*.12,w*.28,h*.46);g.beginPath();g.moveTo(w*.26,h*.12);g.lineTo(w*.26,h*.58);g.moveTo(w*.12,h*.35);g.lineTo(w*.4,h*.35);g.stroke();ellipse(g,w*.54,h*.79,90,14,'#e8d6c7');g.fillStyle='#e7d5c7';g.fillRect(w*.5,h*.67,90,63);ellipse(g,w*.5+45,h*.67,45,9,'#efe1d8');ellipse(g,w*.5+45,h*.67,37,6,'#2f1811');g.strokeStyle='#e7d5c7';g.lineWidth=8;g.beginPath();g.arc(w*.5+93,h*.70,18,-1.2,1.2);g.stroke();}
  else if(s==='sakura'){sceneGradient(g,w,h,[[0,'#090d26'],[.54,'#26254f'],[1,'#351f3d']]);ellipse(g,w*.78,h*.19,38,38,'#f9efff',.86);hill(g,w,h,h*.88,20,'#11182c',1);g.strokeStyle='#29171d';g.lineWidth=16;g.beginPath();g.moveTo(-20,h*.73);g.quadraticCurveTo(w*.22,h*.45,w*.43,h*.5);g.stroke();g.lineWidth=7;for(let i=0;i<6;i++){g.beginPath();g.moveTo(w*(.12+i*.055),h*(.57-i*.018));g.lineTo(w*(.06+i*.10),h*(.35-i*.012));g.stroke()}for(let i=0;i<65;i++)ellipse(g,(i*83)%(w*.55),h*.27+((i*47)%220),2.5+(i%3),2,'#fb8ea5',.72,i*.3);}
  else if(['day','sky','meadow','lemon','peach'].includes(s)){const top=s==='sky'?'#7dccf2':s==='lemon'?'#fff3a7':s==='peach'?'#ffd4c7':'#a8dcf6';sceneGradient(g,w,h,[[0,top],[.62,'#effaff'],[.78,'#cce3b6'],[1,'#6e9a60']]);ellipse(g,w*.82,h*.16,34,34,'#fff3b0',.78);hill(g,w,h,h*.78,24,'#a7c994',1.5);hill(g,w,h,h*.88,32,'#6d9a60',3);if(s==='lemon'||s==='peach'){for(let i=0;i<9;i++){const x=(i+.3)*w/8;g.fillStyle='#6c4c2d';g.fillRect(x-4,h*.89-72,8,72);for(const [dx,dy,r] of [[0,-78,27],[-22,-63,22],[23,-63,24],[2,-104,21]])ellipse(g,x+dx,h*.89+dy,r,r,s==='peach'?'#72976d':'#5c974c',.9);for(let j=0;j<5;j++)ellipse(g,x+(j-2)*9,h*.89-78+(j%2)*15,4.5,4.5,s==='peach'?'#f78f73':'#facc15',.95)}}}
  else if(s==='cyber'||s==='terminal'){sceneGradient(g,w,h,s==='cyber'?[[0,'#040816'],[.65,'#101027'],[1,'#05070d']]:[[0,'#010604'],[1,'#00180b']]);const neon=s==='cyber';g.fillStyle=neon?'#080d1b':'#021309';for(let x=0;x<w;x+=38){const bh=55+((x*13)%150);g.fillRect(x,h*.82-bh,28,bh);if(neon){g.fillStyle=x%76?'#10233d':'#1d1235';g.fillRect(x+5,h*.82-bh+8,3,bh-14);g.fillStyle='#080d1b'}}g.save();g.globalAlpha=.13;g.strokeStyle=neon?'#22d3ee':'#22c55e';const horizon=h*.82;for(let y=horizon;y<h;y+=18){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}for(let x=-w;x<w*2;x+=60){g.beginPath();g.moveTo(w*.5,horizon);g.lineTo(x,h);g.stroke()}g.restore();}
  else if(s==='grape'){sceneGradient(g,w,h,[[0,'#100923'],[.55,'#36135d'],[1,'#12071f']]);for(let i=0;i<5;i++){const rg=g.createRadialGradient(w*(.15+i*.18),h*(.25+(i%2)*.2),5,w*(.15+i*.18),h*(.25+(i%2)*.2),170);rg.addColorStop(0,i%2?'rgba(217,70,239,.28)':'rgba(139,92,246,.30)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h)}}
  else {sceneGradient(g,w,h,[[0,s==='oled'?'#000':'#06101f'],[1,s==='oled'?'#000':'#101b34']]);if(s==='midnight'){hill(g,w,h,h*.79,45,'#0b1737',1);hill(g,w,h,h*.9,28,'#071029',3)}}
}
function getSceneCache(meta,w,h){const key=`${meta.id}:${w}x${h}`;if(sceneCacheKey===key&&sceneCache)return sceneCache;sceneCache=mkOffscreen(w,h);sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});drawStaticScene(sceneCacheCtx,w,h,meta);sceneCacheKey=key;return sceneCache;}
function drawCloudDynamic(p,w){cloud(ctx,p.x,p.y,p.s,p.a);p.x+=p.v;if(p.x> w+120)p.x=-120;}
function drawBackground(ts=0){if(!canvas||!ctx||!isCanvasEnabled||document.hidden){animationFrameId=null;return;}const minDelta=1000/FX_TARGET_FPS;if(ts-fxLastFrame<minDelta){animationFrameId=requestAnimationFrame(drawBackground);return;}fxLastFrame=ts;const w=canvas._cssW||innerWidth,h=canvas._cssH||innerHeight,meta=getThemeMeta(),s=meta.scene;themeFxTick+=minDelta/1000;ctx.clearRect(0,0,w,h);ctx.drawImage(getSceneCache(meta,w,h),0,0,w,h);
  if(['day','sky','rose','lavender','meadow','lemon','peach','sunset'].includes(s))themeFxParticles.forEach(p=>drawCloudDynamic(p,w));
  else if(['night','midnight','oled'].includes(s)){themeFxParticles.forEach(p=>{const a=.3+.7*(.5+.5*Math.sin(themeFxTick*p.tw+p.p));ctx.globalAlpha=a;ctx.fillStyle=s==='midnight'?'#b8d8ff':'#fff';if(p.shoot){ctx.strokeStyle=ctx.fillStyle;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-28,p.y+40);ctx.stroke();p.x-=p.v*.6;p.y+=p.v;if(p.y>h+30){p.y=-20;p.x=Math.random()*w}}else{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill()}});ctx.globalAlpha=1;}
  else if(s==='forest'){themeFxParticles.forEach(p=>{const a=.22+.7*(.5+.5*Math.sin(themeFxTick*1.8+p.p));ctx.globalAlpha=a;ctx.shadowColor='#d9f99d';ctx.shadowBlur=10;ctx.fillStyle='#eaffb2';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.x+=p.vx+Math.sin(themeFxTick+p.p)*.035;p.y+=p.vy+Math.cos(themeFxTick*.8+p.p)*.025;if(p.x<0)p.x=w;if(p.x>w)p.x=0});ctx.shadowBlur=0;ctx.globalAlpha=1;}
  else if(['rose','lavender','sakura','peach'].includes(s)){const c=s==='lavender'?'#9f7aea':s==='peach'?'#fb9478':'#fb7185';themeFxParticles.forEach(p=>{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=p.a;ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(0,0,p.r*.6,p.r*1.2,0,0,6.283);ctx.fill();ctx.restore();p.x+=p.vx+Math.sin(themeFxTick*1.2+p.p)*.09;p.y+=p.vy;p.rot+=p.vr;if(p.y>h+15||p.x>w+15){p.y=-10;p.x=Math.random()*w}})}
  else if(s==='ocean'){themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a;ctx.strokeStyle='#d8fbff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.stroke();p.y+=p.vy;p.x+=Math.sin(themeFxTick+p.p)*.02;if(p.y<-12){p.y=h+10;p.x=Math.random()*w}});ctx.globalAlpha=1;}
  else if(s==='coffee'){themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a;ctx.fillStyle='#fff5e8';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.x+=Math.sin(themeFxTick+p.p)*.05;p.y+=p.vy;if(p.y<h*.49){p.y=h*.74;p.x=w*(.48+Math.random()*.08)}});ctx.globalAlpha=1;}
  else if(s==='cyber'||s==='terminal'){const cyber=s==='cyber';themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a;ctx.fillStyle=cyber?(Math.sin(p.p+themeFxTick)>0?'#22d3ee':'#d946ef'):'#22c55e';ctx.font=`${p.s}px ui-monospace,monospace`;ctx.fillText(p.ch,p.x,p.y);p.y+=p.vy;if(p.y>h+20){p.y=-10;p.x=Math.random()*w}});ctx.globalAlpha=1;}
  else if(s==='grape'){themeFxParticles.forEach(p=>{ctx.globalAlpha=p.a*(.65+.35*Math.sin(themeFxTick+p.p));ctx.fillStyle='#e9c8ff';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=w;if(p.x>w)p.x=0});ctx.globalAlpha=1;}
  // Cinematic finishing pass: subtle atmosphere, not a heavy full-screen filter.
  const vg=ctx.createRadialGradient(w*.5,h*.42,Math.min(w,h)*.18,w*.5,h*.45,Math.max(w,h)*.78);
  vg.addColorStop(0,'rgba(255,255,255,0)');
  vg.addColorStop(1, getThemeMeta().scene==='day'||getThemeMeta().scene==='sky'||getThemeMeta().scene==='rose'||getThemeMeta().scene==='lavender'||getThemeMeta().scene==='meadow'||getThemeMeta().scene==='lemon'||getThemeMeta().scene==='peach' ? 'rgba(80,95,110,.055)' : 'rgba(0,0,0,.16)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);
  animationFrameId=requestAnimationFrame(drawBackground);
}
function applyCanvasState(){
  const btn=getEl('themeBtnCanvas');
  if(!canvas)return;

  document.body.classList.toggle('visuals-on', !!isCanvasEnabled);
  document.body.classList.toggle('visuals-off', !isCanvasEnabled);

  if(isCanvasEnabled){
    canvas.style.setProperty('display','block','important');
    canvas.style.setProperty('visibility','visible','important');
    canvas.style.setProperty('opacity','1','important');
    resizeCanvas();
    initBackgroundObjects();
    fxLastFrame=0;
    if(!animationFrameId)animationFrameId=requestAnimationFrame(drawBackground);
    if(btn)btn.innerHTML='<span class="sidebar-menu-icon">✨</span><span>Visuals</span>';
  }else{
    if(animationFrameId){
      cancelAnimationFrame(animationFrameId);
      animationFrameId=null;
    }
    if(ctx){
      ctx.save();
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.restore();
    }
    invalidateScene();
    themeFxParticles.length=0;
    canvas.style.setProperty('display','none','important');
    canvas.style.setProperty('visibility','hidden','important');
    canvas.style.setProperty('opacity','0','important');
    if(btn)btn.innerHTML='<span class="sidebar-menu-icon">🌟</span><span>Visuals</span>';
  }
}
function toggleThemeCanvas(){
  isCanvasEnabled=!isCanvasEnabled;
  localStorage.setItem('canvas-enabled',isCanvasEnabled);

  // When Visuals is turned back on while Auto by time is active,
  // sync the current time slot first so the canvas never revives an old scene.
  if(isCanvasEnabled && isAutoTimeThemeEnabled()){
    applyAutoTimeTheme(true);
  }

  applyCanvasState();
}
window.addEventListener('resize',()=>{clearTimeout(window.__sceneResizeTimer);window.__sceneResizeTimer=setTimeout(resizeCanvas,120)},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(animationFrameId){cancelAnimationFrame(animationFrameId);animationFrameId=null}}else if(isCanvasEnabled&&!animationFrameId){fxLastFrame=0;animationFrameId=requestAnimationFrame(drawBackground)}});
window.addEventListener('load',()=>{ensureThemePicker();applyDashboardTheme(getCurrentTheme(),false);applyCanvasState();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeThemePicker()});


// ==========================================================================
// SCENE V7 — POLISHED CANVAS LANDSCAPES
// Natural density, atmospheric perspective, cached static scenery.
// No photographic backgrounds.
// ==========================================================================

function v7rng(seed){
  let t = seed >>> 0;
  return function(){
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function v7seedFor(scene,w,h){
  let s=2166136261;
  const text=scene+'|'+Math.round(w/20)+'|'+Math.round(h/20);
  for(let i=0;i<text.length;i++){ s^=text.charCodeAt(i); s=Math.imul(s,16777619); }
  return s>>>0;
}
function v7lerp(a,b,t){return a+(b-a)*t;}
function v7mixAlpha(hex,a){
  if(hex.startsWith('#')){
    const h=hex.slice(1); const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
  }
  return hex;
}
function v7softBlob(g,x,y,rx,ry,color,a=1,parts=9,rng=Math.random){
  g.save(); g.globalAlpha=a; g.fillStyle=color;
  for(let i=0;i<parts;i++){
    const ang=rng()*Math.PI*2, rr=.25+rng()*.75;
    const px=x+Math.cos(ang)*rx*.42*rr, py=y+Math.sin(ang)*ry*.35*rr;
    const sx=rx*(.38+rng()*.34), sy=ry*(.34+rng()*.32);
    g.beginPath(); g.ellipse(px,py,sx,sy,rng()*.4,0,Math.PI*2); g.fill();
  }
  g.restore();
}
function v7branch(g,x1,y1,x2,y2,w,color,a=1){
  g.save(); g.globalAlpha=a; g.strokeStyle=color; g.lineWidth=w; g.lineCap='round';
  g.beginPath(); g.moveTo(x1,y1); g.quadraticCurveTo(v7lerp(x1,x2,.52)+(y2-y1)*.08,v7lerp(y1,y2,.52),x2,y2); g.stroke();
  g.restore();
}
function v7leaf(g,x,y,s,color,a=1,rot=0){
  g.save(); g.translate(x,y); g.rotate(rot); g.globalAlpha=a; g.fillStyle=color;
  g.beginPath(); g.ellipse(0,0,s*1.7,s*.72,0,0,Math.PI*2); g.fill(); g.restore();
}
function v7flower(g,x,y,s,petal,center='#f8d9a0',a=1,rot=0){
  g.save(); g.translate(x,y); g.rotate(rot); g.globalAlpha=a;
  for(let i=0;i<7;i++){
    const ang=i*Math.PI*2/7;
    g.fillStyle=petal; g.beginPath(); g.ellipse(Math.cos(ang)*s*.52,Math.sin(ang)*s*.40,s*.50,s*.30,ang,0,Math.PI*2); g.fill();
  }
  g.fillStyle=center; g.beginPath(); g.arc(0,0,s*.28,0,Math.PI*2); g.fill(); g.restore();
}
function v7cloudBank(g,w,h,rng,alpha=.12){
  g.save(); g.filter='blur(9px)'; g.globalAlpha=alpha; g.fillStyle='#fff';
  for(let i=0;i<7;i++){
    const x=(i/6)*w + (rng()-.5)*w*.10;
    const y=h*(.12+rng()*.22);
    v7softBlob(g,x,y,70+rng()*85,24+rng()*26,'#fff',1,6,rng);
  }
  g.restore();
}
function v7mistBand(g,w,y,hgt,a=.08){
  const gr=g.createLinearGradient(0,y-hgt,0,y+hgt);
  gr.addColorStop(0,'rgba(255,255,255,0)');
  gr.addColorStop(.5,`rgba(235,244,240,${a})`);
  gr.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=gr; g.fillRect(0,y-hgt,w,hgt*2);
}
function v7hill(g,w,h,base,amp,color,phase=0,alpha=1){
  g.save(); g.globalAlpha=alpha; g.fillStyle=color; g.beginPath(); g.moveTo(0,h);
  for(let x=0;x<=w+30;x+=24){
    const y=base+Math.sin(x*.006+phase)*amp+Math.sin(x*.014+phase*.7)*amp*.38+Math.sin(x*.027+phase)*amp*.12;
    g.lineTo(x,y);
  }
  g.lineTo(w,h); g.closePath(); g.fill(); g.restore();
}
function v7drawForest(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#183231'],[.38,'#2d4d3c'],[.66,'#39583f'],[1,'#12251b']]);

  // distant canopy and haze
  v7mistBand(g,w,h*.40,h*.13,.065);
  for(let i=0;i<24;i++){
    const x=(i+.2)*w/23 + (rng()-.5)*25;
    const y=h*(.39+rng()*.11);
    v7softBlob(g,x,y,48+rng()*42,28+rng()*28,i%3===0?'#42644a':'#365741',.36,8,rng);
  }

  // distant trunks: thin, pale, softened by atmosphere
  for(let i=0;i<38;i++){
    const x=rng()*w, base=h*(.78+rng()*.08), top=h*(.20+rng()*.22);
    const col=i%3===0?'#324637':'#263a31';
    v7branch(g,x,base,x+(rng()-.5)*24,top,1.2+rng()*2.2,col,.34);
  }

  // mid trunks + dense crown
  for(let i=0;i<18;i++){
    const x=(i+.15)*w/17+(rng()-.5)*36, base=h*(.91+rng()*.04), top=h*(.28+rng()*.20);
    const thick=4+rng()*7;
    v7branch(g,x,base,x+(rng()-.5)*36,top,thick,'#1a2c22',.82);
    for(let b=0;b<3;b++){
      const yy=v7lerp(base,top,.35+b*.17);
      const side=(b%2?1:-1);
      v7branch(g,x+(rng()-.5)*8,yy,x+side*(34+rng()*65),yy-(22+rng()*38),Math.max(1.2,thick*.28),'#20352a',.65);
    }
    const crownY=top+30+rng()*30;
    const crownC=i%3===0?'#1f432e':i%3===1?'#28503a':'#244833';
    v7softBlob(g,x,crownY,78+rng()*55,60+rng()*48,crownC,.90,11,rng);
  }

  // mid-ground foliage belt
  for(let i=0;i<30;i++){
    const x=rng()*w, y=h*(.67+rng()*.17);
    v7softBlob(g,x,y,38+rng()*46,26+rng()*34,rng()>.5?'#244d31':'#1c422d',.90,8,rng);
  }

  // forest floor
  const floor=g.createLinearGradient(0,h*.72,0,h);
  floor.addColorStop(0,'rgba(18,45,28,.12)'); floor.addColorStop(1,'#0b2015');
  g.fillStyle=floor; g.fillRect(0,h*.72,w,h*.28);

  // grasses, ferns, low shrubs
  g.lineCap='round';
  for(let i=0;i<150;i++){
    const x=rng()*w, y=h*(.80+rng()*.20), len=7+rng()*28;
    g.strokeStyle=rng()>.5?'rgba(61,111,69,.42)':'rgba(40,88,56,.50)';
    g.lineWidth=.6+rng()*1.2;
    g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+(rng()-.5)*12,y-len*.55,x+(rng()-.5)*15,y-len); g.stroke();
  }

  // foreground framing trunks/canopy: dark, cropped, gives "inside forest" feeling
  for(let i=0;i<5;i++){
    const left=i<3;
    const x=left ? (-22+i*34) : (w+22-(i-2)*40);
    const base=h*1.04, top=h*(.03+rng()*.25), thick=18+rng()*30;
    v7branch(g,x,base,x+(left?25:-25)+(rng()-.5)*20,top,thick,'#09170f',.93);
    v7softBlob(g,x+(left?45:-45),h*(.15+rng()*.25),110+rng()*85,80+rng()*65,'#0c2516',.92,12,rng);
  }

  // subtle shafts through gaps
  g.save(); g.globalCompositeOperation='screen';
  for(let i=0;i<4;i++){
    const x=w*(.15+rng()*.7);
    const gr=g.createLinearGradient(x,h*.05,x+80,h*.72);
    gr.addColorStop(0,'rgba(242,255,215,.08)'); gr.addColorStop(1,'rgba(242,255,215,0)');
    g.fillStyle=gr; g.beginPath(); g.moveTo(x-25,0); g.lineTo(x+18,0); g.lineTo(x+135,h*.78); g.lineTo(x+40,h*.78); g.closePath(); g.fill();
  }
  g.restore();
  v7mistBand(g,w,h*.61,h*.09,.04);
}
function v7drawFlowerField(g,w,h,rng,kind='rose'){
  const isLav=kind==='lavender';
  sceneGradient(g,w,h,isLav
    ? [[0,'#cfd0e7'],[.38,'#e5ddea'],[.60,'#c8cfba'],[1,'#53684d']]
    : [[0,'#d8d4d2'],[.36,'#efe5e4'],[.59,'#c9d0b5'],[1,'#58694d']]);
  v7cloudBank(g,w,h,rng,isLav?.07:.08);
  v7hill(g,w,h,h*.55,h*.025,isLav?'#a8aa9d':'#aeb29d',.4,.65);
  v7hill(g,w,h,h*.61,h*.035,isLav?'#7c8b77':'#83916f',2.2,.82);
  v7mistBand(g,w,h*.58,h*.055,.075);

  // field base
  const field=g.createLinearGradient(0,h*.58,0,h);
  field.addColorStop(0,isLav?'#7c866f':'#819067');
  field.addColorStop(1,isLav?'#42523e':'#3f5238');
  g.fillStyle=field; g.fillRect(0,h*.58,w,h*.42);

  // Perspective rows: many tiny plants near horizon, larger near viewer.
  const rows=14;
  for(let r=0;r<rows;r++){
    const t=r/(rows-1);
    const depth=t*t;
    const y=v7lerp(h*.595,h*.99,depth);
    const scale=v7lerp(.12,1.15,depth);
    const alpha=v7lerp(.38,.98,depth);
    const spacing=v7lerp(12,42,depth);
    const offset=(r%2)*spacing*.48;
    for(let x=-spacing;x<w+spacing;x+=spacing){
      const px=x+offset+(rng()-.5)*spacing*.45;
      const py=y+(rng()-.5)*v7lerp(2,9,depth);
      const stemH=(isLav?16:13)*scale*(.75+rng()*.55);
      g.strokeStyle=isLav?`rgba(55,88,58,${alpha*.72})`:`rgba(44,91,47,${alpha*.78})`;
      g.lineWidth=Math.max(.45,scale*.95);
      g.beginPath(); g.moveTo(px,py+stemH*.8); g.lineTo(px+(rng()-.5)*2*scale,py-stemH*.45); g.stroke();
      if(isLav){
        const col=rng()>.55?'#7059a8':'#8770ba';
        for(let k=0;k<4;k++){
          const yy=py-stemH*.38+k*3*scale;
          v7leaf(g,px+(k%2?1:-1)*1.5*scale,yy,1.3*scale,col,alpha,.2*(k%2?1:-1));
        }
      }else{
        const cols=['#b83d55','#c54b62','#a8344d','#d05a6d','#9f3348'];
        const col=cols[Math.floor(rng()*cols.length)];
        v7flower(g,px,py-stemH*.5,2.2*scale,col,'#e9c5a0',alpha,rng()*Math.PI);
        if(depth>.35 && rng()>.45){
          v7leaf(g,px-3*scale,py+1*scale,2.1*scale,'#396443',alpha*.75,-.6);
          v7leaf(g,px+3*scale,py+3*scale,2.0*scale,'#426c49',alpha*.70,.6);
        }
      }
    }
  }

  // foreground grasses break the overly neat rows
  for(let i=0;i<90;i++){
    const x=rng()*w,y=h*(.82+rng()*.18),len=10+rng()*34;
    g.strokeStyle=isLav?'rgba(58,75,53,.38)':'rgba(47,77,44,.42)';
    g.lineWidth=.5+rng()*1.2; g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+(rng()-.5)*8,y-len*.55,x+(rng()-.5)*14,y-len); g.stroke();
  }
}
function v7drawOcean(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#16647a'],[.34,'#0c5369'],[.72,'#073b51'],[1,'#062b3d']]);
  // soft overhead glow
  const rg=g.createRadialGradient(w*.54,-20,0,w*.54,-20,w*.58);
  rg.addColorStop(0,'rgba(195,243,247,.25)'); rg.addColorStop(1,'rgba(195,243,247,0)');
  g.fillStyle=rg; g.fillRect(0,0,w,h*.75);

  // light rays
  g.save(); g.globalCompositeOperation='screen'; g.filter='blur(8px)';
  for(let i=0;i<7;i++){
    const x=w*(.05+i*.14)+rng()*30;
    g.fillStyle=`rgba(186,235,241,${.025+rng()*.035})`;
    g.beginPath(); g.moveTo(x,0); g.lineTo(x+45+rng()*80,0); g.lineTo(x+210+rng()*100,h*.88); g.lineTo(x+90+rng()*60,h*.88); g.closePath(); g.fill();
  }
  g.restore();

  // rocky seabed
  g.fillStyle='#082e36'; g.fillRect(0,h*.89,w,h*.11);
  for(let i=0;i<26;i++){
    const x=rng()*w,y=h*(.88+rng()*.13),rx=12+rng()*32,ry=5+rng()*12;
    ellipse(g,x,y,rx,ry,rng()>.5?'#183f42':'#244c4a',.72,rng()*.4);
  }

  // kelp with many overlapping ribbons
  for(let i=0;i<32;i++){
    const x=rng()*w, base=h*(.94+rng()*.06), len=45+rng()*135, sway=(rng()-.5)*45;
    g.strokeStyle=rng()>.5?'rgba(31,111,81,.56)':'rgba(27,91,72,.62)';
    g.lineWidth=2+rng()*5; g.lineCap='round';
    g.beginPath(); g.moveTo(x,base); g.bezierCurveTo(x+sway*.2,base-len*.3,x+sway*.9,base-len*.7,x+sway,base-len); g.stroke();
  }
  v7mistBand(g,w,h*.66,h*.13,.025);
}
function v7drawCyber(g,w,h,rng,terminal=false){
  sceneGradient(g,w,h,terminal?[[0,'#010905'],[.68,'#03160b'],[1,'#010604']]:[[0,'#070b19'],[.44,'#13152b'],[.76,'#16122a'],[1,'#070914']]);
  const horizon=h*.72;

  // atmospheric neon haze instead of loud blocks
  const haze=g.createRadialGradient(w*.50,horizon,0,w*.50,horizon,w*.55);
  haze.addColorStop(0,terminal?'rgba(34,197,94,.075)':'rgba(81,193,230,.105)');
  haze.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=haze; g.fillRect(0,h*.25,w,h*.60);

  // distant skyline, irregular + antennae
  for(let i=0,x=-10;x<w+30;i++){
    const bw=18+rng()*42,bh=45+rng()*150,base=horizon+rng()*10;
    const col=terminal?'#03170b':(rng()>.5?'#10162a':'#16162d');
    g.fillStyle=col; g.fillRect(x,base-bh,bw,bh);
    if(rng()>.72){
      g.strokeStyle=terminal?'rgba(62,212,115,.20)':'rgba(114,202,238,.18)';
      g.lineWidth=1; g.beginPath(); g.moveTo(x+bw*.5,base-bh); g.lineTo(x+bw*.5,base-bh-18-rng()*28); g.stroke();
    }
    // sparse windows
    const win=terminal?'rgba(69,226,126,.18)':(rng()>.5?'rgba(80,220,235,.22)':'rgba(214,87,214,.18)');
    g.fillStyle=win;
    for(let yy=base-bh+10;yy<base-8;yy+=10+rng()*5){
      if(rng()>.45) g.fillRect(x+5+rng()*Math.max(2,bw-12),yy,1.5+rng()*2.5,2);
    }
    x += bw+3+rng()*8;
  }

  // wet ground / faint perspective lines
  const ground=g.createLinearGradient(0,horizon,0,h);
  ground.addColorStop(0,terminal?'rgba(2,24,11,.60)':'rgba(9,13,25,.55)');
  ground.addColorStop(1,terminal?'#010503':'#04060d');
  g.fillStyle=ground; g.fillRect(0,horizon,w,h-horizon);
  g.save(); g.globalAlpha=.10; g.strokeStyle=terminal?'#3bd77a':'#5ccfe8'; g.lineWidth=1;
  for(let i=1;i<8;i++){const yy=horizon+(h-horizon)*Math.pow(i/8,1.7);g.beginPath();g.moveTo(0,yy);g.lineTo(w,yy);g.stroke();}
  for(let i=-8;i<=8;i++){g.beginPath();g.moveTo(w*.5,horizon);g.lineTo(w*.5+i*w*.11,h);g.stroke();}
  g.restore();
}
function v7drawStaticScene(g,w,h,meta){
  const rng=v7rng(v7seedFor(meta.scene,w,h));
  switch(meta.scene){
    case 'forest': v7drawForest(g,w,h,rng); break;
    case 'rose': v7drawFlowerField(g,w,h,rng,'rose'); break;
    case 'lavender': v7drawFlowerField(g,w,h,rng,'lavender'); break;
    case 'ocean': v7drawOcean(g,w,h,rng); break;
    case 'cyber': v7drawCyber(g,w,h,rng,false); break;
    case 'terminal': v7drawCyber(g,w,h,rng,true); break;
    default: drawStaticScene(g,w,h,meta);
  }

  // universal soft atmospheric finish
  const top=g.createLinearGradient(0,0,0,h);
  top.addColorStop(0,'rgba(255,255,255,.018)');
  top.addColorStop(.65,'rgba(255,255,255,0)');
  top.addColorStop(1,'rgba(0,0,0,.07)');
  g.fillStyle=top; g.fillRect(0,0,w,h);
}
function getSceneCache(meta,w,h){
  const key=`v7:${meta.id}:${w}x${h}`;
  if(sceneCacheKey===key&&sceneCache)return sceneCache;
  sceneCache=mkOffscreen(w,h);
  sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});
  v7drawStaticScene(sceneCacheCtx,w,h,meta);
  sceneCacheKey=key;
  return sceneCache;
}

// Reduce moving objects. Dense realism comes from the cached scenery, not noisy particles.
const __v7InitBackgroundObjects = initBackgroundObjects;
initBackgroundObjects = function(){
  __v7InitBackgroundObjects();
  const s=getThemeMeta().scene;
  const limits={forest:26,rose:16,lavender:14,ocean:22,cyber:16,terminal:18,sakura:18,peach:15};
  if(limits[s] && themeFxParticles.length>limits[s]) themeFxParticles.length=limits[s];
};

// Make theme picker describe the new approach.
(function(){
  const oldEnsure=ensureThemePicker;
  ensureThemePicker=function(){
    oldEnsure();
    const small=document.querySelector('#themePickerOverlay .theme-picker-head small');
    if(small)small.textContent='Layered canvas landscapes · subtle motion · optimized cache';
  };
})();


// ==========================================================================
// SCENE V8 — COMPLETE THEME ART PASS
// Every theme now has its own layered procedural composition.
// ==========================================================================

function v8rectRound(g,x,y,w,h,r,fill,alpha=1){
  g.save(); g.globalAlpha=alpha; g.fillStyle=fill;
  g.beginPath();
  g.moveTo(x+r,y); g.lineTo(x+w-r,y); g.quadraticCurveTo(x+w,y,x+w,y+r);
  g.lineTo(x+w,y+h-r); g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  g.lineTo(x+r,y+h); g.quadraticCurveTo(x,y+h,x,y+h-r);
  g.lineTo(x,y+r); g.quadraticCurveTo(x,y,x+r,y); g.closePath(); g.fill(); g.restore();
}
function v8stars(g,w,h,rng,count=70,alpha=.8){
  g.save();
  for(let i=0;i<count;i++){
    const x=rng()*w,y=rng()*h*.66,r=.35+rng()*1.5,a=(.18+rng()*.72)*alpha;
    g.fillStyle=`rgba(240,247,255,${a})`;
    g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.fill();
  }
  g.restore();
}
function v8tree(g,x,base,scale,rng,leaf='#244b31',trunk='#2b2117',alpha=1){
  const top=base-110*scale;
  v7branch(g,x,base,x+(rng()-.5)*16*scale,top,7*scale,trunk,alpha);
  for(let b=0;b<4;b++){
    const yy=base-30*scale-b*18*scale;
    const side=b%2?1:-1;
    v7branch(g,x,yy,x+side*(28+rng()*28)*scale,yy-(15+rng()*18)*scale,2.3*scale,trunk,alpha*.88);
  }
  v7softBlob(g,x,top+20*scale,52*scale,46*scale,leaf,alpha,10,rng);
}
function v8mountain(g,w,h,base,color,alpha,rng,amp=.24){
  g.save(); g.globalAlpha=alpha; g.fillStyle=color; g.beginPath(); g.moveTo(0,h);
  let x=0; g.lineTo(0,base);
  while(x<w){
    const bw=70+rng()*150, peak=base-(55+rng()*h*amp);
    g.lineTo(x+bw*.50,peak); g.lineTo(x+bw,base+(rng()-.5)*20); x+=bw;
  }
  g.lineTo(w,h); g.closePath(); g.fill(); g.restore();
}
function v8drawNight(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#07111e'],[.44,'#101d31'],[.72,'#18273a'],[1,'#081218']]);
  v8stars(g,w,h,rng,110,.85);
  ellipse(g,w*.78,h*.16,28,28,'#eaf3ff',.78);
  const moonGlow=g.createRadialGradient(w*.78,h*.16,15,w*.78,h*.16,110);
  moonGlow.addColorStop(0,'rgba(210,230,255,.12)');moonGlow.addColorStop(1,'rgba(210,230,255,0)');
  g.fillStyle=moonGlow;g.fillRect(0,0,w,h*.5);
  v8mountain(g,w,h,h*.64,'#1a2c3c',.78,rng,.16);
  v8mountain(g,w,h,h*.73,'#10212e',.96,rng,.12);
  const lake=g.createLinearGradient(0,h*.72,0,h);lake.addColorStop(0,'#0d2630');lake.addColorStop(1,'#061217');
  g.fillStyle=lake;g.fillRect(0,h*.72,w,h*.28);
  g.save();g.globalAlpha=.15;g.strokeStyle='#bbd7ef';g.lineWidth=1;
  for(let i=0;i<16;i++){const y=h*.75+i*8+rng()*4;g.beginPath();g.moveTo(w*.62+rng()*80,y);g.lineTo(w*.90-rng()*60,y);g.stroke();}
  g.restore();
  for(let i=0;i<10;i++) v8tree(g,(i+.2)*w/9,h*.94,.45+rng()*.28,rng,'#0d251c','#111914',.9);
}
function v8drawDay(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#8bc9e9'],[.50,'#c8e7f4'],[.68,'#e8efe1'],[1,'#64855b']]);
  ellipse(g,w*.78,h*.14,38,38,'#fff4bf',.84);
  v7cloudBank(g,w,h,rng,.12);
  v7hill(g,w,h,h*.64,20,'#a8c99a',.5,.75);
  v7hill(g,w,h,h*.73,26,'#7ca36f',2,.9);
  const meadow=g.createLinearGradient(0,h*.71,0,h);meadow.addColorStop(0,'#7fa169');meadow.addColorStop(1,'#4f6f45');
  g.fillStyle=meadow;g.fillRect(0,h*.71,w,h*.29);
  for(let i=0;i<120;i++){
    const x=rng()*w,y=h*(.76+rng()*.24),len=8+rng()*22;
    g.strokeStyle=rng()>.5?'rgba(58,94,48,.38)':'rgba(82,112,62,.42)';
    g.lineWidth=.6+rng();g.beginPath();g.moveTo(x,y);g.lineTo(x+(rng()-.5)*8,y-len);g.stroke();
    if(rng()>.86)v7flower(g,x,y-len,1.4+rng()*1.6,rng()>.5?'#f0e7d0':'#d8b7c5','#d7b36a',.65,rng()*6.28);
  }
}
function v8drawMidnight(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#030714'],[.44,'#0e1730'],[.70,'#182343'],[1,'#07101d']]);
  v8stars(g,w,h,rng,95,.72);
  ellipse(g,w*.72,h*.18,44,44,'#dfe8ff',.88);
  v8mountain(g,w,h,h*.58,'#27334f',.52,rng,.23);
  v8mountain(g,w,h,h*.70,'#18243c',.88,rng,.18);
  v8mountain(g,w,h,h*.79,'#0b1628',1,rng,.12);
  const lake=g.createLinearGradient(0,h*.75,0,h);lake.addColorStop(0,'#0a1b2a');lake.addColorStop(1,'#030910');
  g.fillStyle=lake;g.fillRect(0,h*.75,w,h*.25);
  g.save();g.globalCompositeOperation='screen';
  const refl=g.createLinearGradient(w*.72,h*.76,w*.72,h);
  refl.addColorStop(0,'rgba(213,230,255,.18)');refl.addColorStop(1,'rgba(213,230,255,0)');
  g.fillStyle=refl;g.beginPath();g.moveTo(w*.68,h*.76);g.lineTo(w*.76,h*.76);g.lineTo(w*.82,h);g.lineTo(w*.60,h);g.closePath();g.fill();g.restore();
}
function v8drawOLED(g,w,h,rng){
  g.fillStyle='#000';g.fillRect(0,0,w,h);
  v8stars(g,w,h,rng,48,.55);
  const aur=g.createRadialGradient(w*.52,h*.46,0,w*.52,h*.46,w*.56);
  aur.addColorStop(0,'rgba(51,255,143,.055)');aur.addColorStop(.42,'rgba(76,98,255,.025)');aur.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=aur;g.fillRect(0,0,w,h);
  v8mountain(g,w,h,h*.84,'#020604',1,rng,.11);
}
function v8drawSunset(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#4c315e'],[.32,'#ad5d6a'],[.61,'#e89d78'],[.80,'#f3c78b'],[1,'#3c4940']]);
  ellipse(g,w*.72,h*.42,52,52,'#f8d196',.85);
  v8mountain(g,w,h,h*.62,'#7b6372',.52,rng,.17);
  v8mountain(g,w,h,h*.73,'#57566a',.82,rng,.13);
  v7hill(g,w,h,h*.82,24,'#384943',1.4,.95);
  const field=g.createLinearGradient(0,h*.80,0,h);field.addColorStop(0,'#4b5b47');field.addColorStop(1,'#26362d');
  g.fillStyle=field;g.fillRect(0,h*.80,w,h*.20);
  for(let i=0;i<65;i++){
    const x=rng()*w,y=h*(.84+rng()*.16),len=8+rng()*26;
    g.strokeStyle='rgba(45,65,45,.50)';g.lineWidth=.7+rng();g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+5,y-len*.6,x+(rng()-.5)*10,y-len);g.stroke();
  }
}
function v8drawCoffee(g,w,h,rng){
  // Warm rainy café interior
  sceneGradient(g,w,h,[[0,'#19110d'],[.55,'#2d1e16'],[1,'#120c09']]);

  // window glow
  const wx=w*.10, wy=h*.09, ww=w*.44, wh=h*.55;
  v8rectRound(g,wx,wy,ww,wh,10,'#161819',1);
  const glass=g.createLinearGradient(wx,wy,wx,wy+wh);
  glass.addColorStop(0,'#32414a');glass.addColorStop(.55,'#26333a');glass.addColorStop(1,'#171f23');
  v8rectRound(g,wx+8,wy+8,ww-16,wh-16,6,glass,1);
  // distant rainy city bokeh
  for(let i=0;i<34;i++){
    const x=wx+18+rng()*(ww-36), y=wy+18+rng()*(wh-36), r=2+rng()*7;
    const c=rng()>.55?'#d99d61':rng()>.5?'#b76e4b':'#6a9e9b';
    ellipse(g,x,y,r,r,c,.06+rng()*.12);
  }
  g.strokeStyle='rgba(225,191,154,.18)';g.lineWidth=4;
  g.beginPath();g.moveTo(wx+ww*.5,wy+5);g.lineTo(wx+ww*.5,wy+wh-5);g.moveTo(wx+5,wy+wh*.52);g.lineTo(wx+ww-5,wy+wh*.52);g.stroke();

  // rain streaks on glass
  g.save();g.lineCap='round';
  for(let i=0;i<55;i++){
    const x=wx+15+rng()*(ww-30), y=wy+10+rng()*(wh-25), len=8+rng()*28;
    g.strokeStyle=`rgba(211,226,230,${.035+rng()*.065})`;g.lineWidth=.5+rng()*.8;
    g.beginPath();g.moveTo(x,y);g.lineTo(x-2-rng()*3,y+len);g.stroke();
  }
  g.restore();

  // hanging lamp
  g.strokeStyle='#34251c';g.lineWidth=3;g.beginPath();g.moveTo(w*.76,0);g.lineTo(w*.76,h*.17);g.stroke();
  g.fillStyle='#7a5133';g.beginPath();g.moveTo(w*.70,h*.17);g.lineTo(w*.82,h*.17);g.lineTo(w*.79,h*.25);g.lineTo(w*.73,h*.25);g.closePath();g.fill();
  const glow=g.createRadialGradient(w*.76,h*.28,8,w*.76,h*.28,150);
  glow.addColorStop(0,'rgba(255,198,112,.22)');glow.addColorStop(1,'rgba(255,198,112,0)');
  g.fillStyle=glow;g.fillRect(w*.55,h*.10,w*.42,h*.50);

  // table
  g.fillStyle='#3c281b';g.fillRect(0,h*.73,w,h*.27);
  g.fillStyle='rgba(255,218,174,.05)';g.fillRect(0,h*.73,w,3);
  for(let i=0;i<11;i++){g.strokeStyle='rgba(255,225,190,.025)';g.beginPath();g.moveTo(i*w/10,h*.73);g.lineTo((i+.2)*w/10,h);g.stroke();}

  // cup + saucer
  const cx=w*.64, cy=h*.73;
  ellipse(g,cx,cy+52,74,10,'#d8c5b2',.78);
  v8rectRound(g,cx-42,cy-4,84,54,11,'#dbc9b9',1);
  ellipse(g,cx,cy-4,42,8,'#eadfd5',1);
  ellipse(g,cx,cy-3,34,5.5,'#2c170f',1);
  g.strokeStyle='#d8c5b2';g.lineWidth=7;g.beginPath();g.arc(cx+46,cy+20,18,-1.1,1.1);g.stroke();

  // small book / napkin
  v8rectRound(g,w*.77,h*.79,90,16,3,'#5f4331',.9);
  v8rectRound(g,w*.78,h*.775,82,10,2,'#d4c2ab',.35);
}
function v8drawMeadow(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#9fd6df'],[.52,'#dcefe9'],[.69,'#c3d6ad'],[1,'#4e7248']]);
  v7cloudBank(g,w,h,rng,.10);
  v7hill(g,w,h,h*.60,18,'#a6c296',1,.75);
  v7hill(g,w,h,h*.69,24,'#7ea670',2.1,.92);
  const field=g.createLinearGradient(0,h*.68,0,h);field.addColorStop(0,'#79a369');field.addColorStop(1,'#466d45');
  g.fillStyle=field;g.fillRect(0,h*.68,w,h*.32);
  for(let i=0;i<175;i++){
    const x=rng()*w,y=h*(.70+rng()*.30),depth=(y-h*.70)/(h*.30),s=.5+depth*2.3;
    if(rng()>.72)v7flower(g,x,y,1.3*s,rng()>.5?'#f3f1d1':'#d7d7f0','#e2c16d',.52+depth*.38,rng()*6.28);
    else {g.strokeStyle='rgba(52,92,48,.35)';g.lineWidth=.5+s*.2;g.beginPath();g.moveTo(x,y);g.lineTo(x+(rng()-.5)*7,y-(6+rng()*18)*s);g.stroke();}
  }
}
function v8drawSakura(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#070b1b'],[.48,'#171b36'],[.74,'#2c243d'],[1,'#160f1b']]);
  v8stars(g,w,h,rng,45,.42);ellipse(g,w*.78,h*.16,34,34,'#f1e9ff',.80);
  v7hill(g,w,h,h*.74,22,'#20243a',1,.7);v7hill(g,w,h,h*.82,18,'#111725',2.2,.95);

  // pathway
  g.fillStyle='#171517';g.beginPath();g.moveTo(w*.43,h*.60);g.lineTo(w*.57,h*.60);g.lineTo(w*.73,h);g.lineTo(w*.27,h);g.closePath();g.fill();
  // lanterns
  for(let i=0;i<5;i++){
    const t=i/5, y=h*(.68+t*.06), spread=v7lerp(w*.09,w*.26,t), size=v7lerp(3,7,t);
    for(const side of [-1,1]){
      const x=w*.5+side*spread;
      g.fillStyle='#33241e';g.fillRect(x-size*.15,y,size*.3,size*3);
      const gl=g.createRadialGradient(x,y,1,x,y,24*size/6);gl.addColorStop(0,'rgba(255,183,104,.24)');gl.addColorStop(1,'rgba(255,183,104,0)');
      g.fillStyle=gl;g.fillRect(x-25,y-25,50,50);
      v8rectRound(g,x-size*.7,y-size*.2,size*1.4,size,2,'#d18b53',.85);
    }
  }
  // arching sakura branches from both sides
  for(const side of [-1,1]){
    const sx=side<0?-20:w+20, sy=h*.72;
    const ex=w*.5+side*w*.08, ey=h*.28;
    v7branch(g,sx,sy,ex,ey,18,'#25161c',.95);
    for(let b=0;b<8;b++){
      const t=.18+b*.09, bx=v7lerp(sx,ex,t), by=v7lerp(sy,ey,t), dir=side*(b%2?1:-1);
      const tx=bx+dir*(35+rng()*75),ty=by-(20+rng()*55);
      v7branch(g,bx,by,tx,ty,5,'#2c1820',.9);
      for(let k=0;k<8;k++)ellipse(g,tx+(rng()-.5)*50,ty+(rng()-.5)*32,2.2+rng()*3.2,1.8+rng()*2.4,rng()>.5?'#ef9db1':'#d97899',.58+rng()*.25,rng()*6.28);
    }
  }
}
function v8drawSky(g,w,h,rng){
  sceneGradient(g,w,h,[[0,'#63b8df'],[.48,'#9bd3eb'],[.78,'#d8edf4'],[1,'#eef6f7']]);
  const sun=g.createRadialGradient(w*.78,h*.12,0,w*.78,h*.12,120);
  sun.addColorStop(0,'rgba(255,249,213,.38)');sun.addColorStop(1,'rgba(255,249,213,0)');
  g.fillStyle=sun;g.fillRect(0,0,w,h*.55);
  // layered sea of clouds
  for(let layer=0;layer<4;layer++){
    const y=h*(.48+layer*.13), a=.16+layer*.10;
    for(let i=0;i<8;i++){
      const x=(i-.4)*w/6+(rng()-.5)*60;
      v7softBlob(g,x,y+(rng()-.5)*25,100+layer*24+rng()*65,38+layer*12+rng()*20,'#ffffff',a,8,rng);
    }
  }
}
function v8drawOrchard(g,w,h,rng,kind){
  const lemon=kind==='lemon';
  sceneGradient(g,w,h,lemon?[[0,'#b7d8cf'],[.49,'#dce8d1'],[.67,'#b6c89a'],[1,'#49603e']]:[[0,'#c9ceda'],[.48,'#eadad8'],[.68,'#c4c6a4'],[1,'#536045']]);
  v7cloudBank(g,w,h,rng,.065);
  v7hill(g,w,h,h*.58,18,'#a7b994',1,.65);
  const ground=g.createLinearGradient(0,h*.60,0,h);ground.addColorStop(0,'#84976f');ground.addColorStop(1,'#4a5f41');
  g.fillStyle=ground;g.fillRect(0,h*.60,w,h*.40);

  // orchard rows converge toward vanishing point
  const vp=w*.5, horizon=h*.59;
  for(let row=-4;row<=4;row++){
    for(let j=0;j<8;j++){
      const t=j/7, depth=t*t;
      const y=v7lerp(horizon+8,h*.98,depth);
      const lane=row*v7lerp(16,92,depth);
      const x=vp+lane;
      const sc=v7lerp(.18,1.05,depth);
      v8tree(g,x,y,sc,rng,lemon?'#426e3e':'#647f58','#5d4430',.48+depth*.48);
      const fruit=lemon?'#e2c839':'#da8c79';
      for(let f=0;f<4;f++){
        const fx=x+(rng()-.5)*36*sc, fy=y-73*sc+(rng()-.5)*34*sc;
        ellipse(g,fx,fy,3.2*sc,3.6*sc,fruit,.42+depth*.45);
      }
    }
  }
  v7mistBand(g,w,h*.60,h*.045,.05);
}
function v8drawGrape(g,w,h,rng){
  // Vineyard at purple dusk, replacing abstract nebula
  sceneGradient(g,w,h,[[0,'#3d3158'],[.42,'#74617b'],[.69,'#b0897d'],[1,'#3c493b']]);
  ellipse(g,w*.76,h*.30,34,34,'#e7c49c',.42);
  v8mountain(g,w,h,h*.58,'#63566d',.42,rng,.13);
  v7hill(g,w,h,h*.67,19,'#58634e',1.4,.72);
  const ground=g.createLinearGradient(0,h*.66,0,h);ground.addColorStop(0,'#526047');ground.addColorStop(1,'#28352a');
  g.fillStyle=ground;g.fillRect(0,h*.66,w,h*.34);

  const vp=w*.5, horizon=h*.65;
  for(let row=-6;row<=6;row++){
    g.strokeStyle='rgba(35,42,29,.48)';g.lineWidth=1;
    g.beginPath();g.moveTo(vp+row*8,horizon);g.lineTo(vp+row*115,h);g.stroke();
    for(let j=0;j<10;j++){
      const t=(j+1)/10,depth=t*t,y=v7lerp(horizon,h*.98,depth),x=vp+row*v7lerp(10,112,depth),sc=v7lerp(.12,.75,depth);
      g.strokeStyle='#463827';g.lineWidth=1+sc*2;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-35*sc);g.stroke();
      v7softBlob(g,x,y-34*sc,22*sc,13*sc,'#334c32',.45+depth*.4,6,rng);
      if(depth>.28 && rng()>.3){
        for(let k=0;k<6;k++)ellipse(g,x+(rng()-.5)*11*sc,y-26*sc+rng()*10*sc,2.0*sc,2.3*sc,rng()>.5?'#4d2d65':'#5f3975',.55+depth*.3);
      }
    }
  }
}
function v8drawPeach(g,w,h,rng){v8drawOrchard(g,w,h,rng,'peach')}
function v8drawLemon(g,w,h,rng){v8drawOrchard(g,w,h,rng,'lemon')}

function v8drawStaticScene(g,w,h,meta){
  const rng=v7rng(v7seedFor('v8-'+meta.scene,w,h));
  switch(meta.scene){
    case 'night':v8drawNight(g,w,h,rng);break;
    case 'day':v8drawDay(g,w,h,rng);break;
    case 'midnight':v8drawMidnight(g,w,h,rng);break;
    case 'oled':v8drawOLED(g,w,h,rng);break;
    case 'forest':v7drawForest(g,w,h,rng);break;
    case 'rose':v7drawFlowerField(g,w,h,rng,'rose');break;
    case 'lavender':v7drawFlowerField(g,w,h,rng,'lavender');break;
    case 'ocean':v7drawOcean(g,w,h,rng);break;
    case 'sunset':v8drawSunset(g,w,h,rng);break;
    case 'coffee':v8drawCoffee(g,w,h,rng);break;
    case 'meadow':v8drawMeadow(g,w,h,rng);break;
    case 'sakura':v8drawSakura(g,w,h,rng);break;
    case 'sky':v8drawSky(g,w,h,rng);break;
    case 'lemon':v8drawLemon(g,w,h,rng);break;
    case 'peach':v8drawPeach(g,w,h,rng);break;
    case 'cyber':v7drawCyber(g,w,h,rng,false);break;
    case 'grape':v8drawGrape(g,w,h,rng);break;
    case 'terminal':v7drawCyber(g,w,h,rng,true);break;
    default:v7drawStaticScene(g,w,h,meta);
  }
  const vign=g.createRadialGradient(w*.50,h*.42,Math.min(w,h)*.18,w*.50,h*.46,Math.max(w,h)*.78);
  const light=['day','rose','lavender','meadow','sky','lemon','peach'].includes(meta.scene);
  vign.addColorStop(0,'rgba(255,255,255,0)');
  vign.addColorStop(1,light?'rgba(55,70,65,.05)':'rgba(0,0,0,.15)');
  g.fillStyle=vign;g.fillRect(0,0,w,h);
}
getSceneCache=function(meta,w,h){
  const key=`v8:${meta.id}:${w}x${h}`;
  if(sceneCacheKey===key&&sceneCache)return sceneCache;
  sceneCache=mkOffscreen(w,h);
  sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});
  v8drawStaticScene(sceneCacheCtx,w,h,meta);
  sceneCacheKey=key;
  return sceneCache;
};

// Refine dynamic particle amount theme by theme.
const __v8InitBackgroundObjects=initBackgroundObjects;
initBackgroundObjects=function(){
  __v8InitBackgroundObjects();
  const s=getThemeMeta().scene;
  const limits={
    night:18,day:8,midnight:18,oled:10,forest:22,rose:14,lavender:13,ocean:18,
    sunset:8,coffee:7,meadow:10,sakura:16,sky:8,lemon:9,peach:13,cyber:12,grape:9,terminal:14
  };
  if(limits[s]!=null && themeFxParticles.length>limits[s])themeFxParticles.length=limits[s];
};

// Updated scene names in picker.
Object.assign(THEME_SCENE_LABELS,{
  night:'Moonlit lake · stars',
  day:'Morning meadow',
  midnight:'Moonlit alpine lake',
  oled:'Black horizon · faint aurora',
  forest:'Deep forest · mist · fireflies',
  rose:'Rose field · perspective rows',
  lavender:'Lavender field · distant hills',
  ocean:'Deep water · rays · kelp',
  sunset:'Warm mountain valley',
  coffee:'Rainy café · warm window',
  meadow:'Wildflower meadow',
  sakura:'Moonlit sakura path',
  sky:'Sea of clouds',
  lemon:'Lemon orchard',
  peach:'Peach orchard',
  cyber:'Neon city · wet grid',
  grape:'Vineyard at purple dusk',
  terminal:'Terminal skyline'
});


// ==========================================================================
// SCENE V9 — REQUESTED REDESIGNS
// Rose = glass conservatory / garden terrace
// Lavender = Provence-style stone courtyard
// Lemon = Mediterranean lemon patio
// Peach = Japanese peach-blossom garden
// Ocean = reef + fish schools
// Sakura = traditional Japanese street / shrine approach
// Cyber / Terminal = clearer luminous architecture
// Coffee = populated café interior
// ==========================================================================

function v9person(g,x,y,s,rng,shirt='#6f5142',alpha=.88){
  g.save();g.globalAlpha=alpha;
  // head/hair
  g.fillStyle='#d2aa8d';g.beginPath();g.arc(x,y-19*s,5.2*s,0,Math.PI*2);g.fill();
  g.fillStyle=rng()>.5?'#251d1a':'#443129';g.beginPath();g.arc(x,y-21*s,5.3*s,Math.PI,Math.PI*2);g.fill();
  // torso
  g.fillStyle=shirt;g.beginPath();g.roundRect(x-7*s,y-14*s,14*s,19*s,4*s);g.fill();
  // arms toward table
  g.strokeStyle='#c89e82';g.lineWidth=2.2*s;g.lineCap='round';
  g.beginPath();g.moveTo(x-5*s,y-9*s);g.lineTo(x-10*s,y-1*s);g.moveTo(x+5*s,y-9*s);g.lineTo(x+10*s,y-1*s);g.stroke();
  g.restore();
}
function v9tableSet(g,x,y,s,rng,people=2){
  // legs
  g.strokeStyle='rgba(55,38,28,.72)';g.lineWidth=3*s;g.beginPath();g.moveTo(x,y+5*s);g.lineTo(x-7*s,y+30*s);g.moveTo(x,y+5*s);g.lineTo(x+7*s,y+30*s);g.stroke();
  // tabletop
  ellipse(g,x,y,30*s,7*s,'#6b4932',.94);
  ellipse(g,x,y-1*s,28*s,5*s,'#8a6143',.62);
  // cups
  for(let i=0;i<people;i++){
    const cx=x+(i-(people-1)/2)*13*s;
    v8rectRound(g,cx-3*s,y-8*s,6*s,6*s,1.5*s,'#d8c7b5',.9);
    ellipse(g,cx,y-8*s,3*s,1*s,'#2a160f',.9);
  }
  const shirts=['#765346','#52616b','#6b5a77','#506650','#8a6650'];
  if(people>=1)v9person(g,x-19*s,y-2*s,s,rng,shirts[Math.floor(rng()*shirts.length)],.82);
  if(people>=2)v9person(g,x+19*s,y-2*s,s,rng,shirts[Math.floor(rng()*shirts.length)],.82);
}
function v9drawCoffee(g,w,h,rng){
  // Deeper café with perspective, multiple tables and patrons.
  sceneGradient(g,w,h,[[0,'#17100c'],[.48,'#2b1c14'],[1,'#0f0a08']]);

  // long rainy windows across the back wall
  const wy=h*.08, wh=h*.48;
  for(let p=0;p<4;p++){
    const wx=w*(.055+p*.225), ww=w*.19;
    v8rectRound(g,wx,wy,ww,wh,7,'#141718',1);
    const glass=g.createLinearGradient(wx,wy,wx,wy+wh);
    glass.addColorStop(0,'#35434a');glass.addColorStop(.62,'#28343a');glass.addColorStop(1,'#171e21');
    v8rectRound(g,wx+6,wy+6,ww-12,wh-12,4,glass,1);
    // blurred outside lights
    for(let i=0;i<10;i++){
      const bx=wx+12+rng()*(ww-24),by=wy+14+rng()*(wh-30),br=2+rng()*5;
      ellipse(g,bx,by,br,br,rng()>.55?'#d99959':'#739a9a',.07+rng()*.09);
    }
    // rain
    g.save();g.lineCap='round';
    for(let i=0;i<18;i++){
      const rx=wx+10+rng()*(ww-20),ry=wy+8+rng()*(wh-20),len=7+rng()*20;
      g.strokeStyle=`rgba(220,232,233,${.025+rng()*.055})`;g.lineWidth=.5+rng()*.7;
      g.beginPath();g.moveTo(rx,ry);g.lineTo(rx-2,ry+len);g.stroke();
    }
    g.restore();
  }

  // ceiling + pendant lamps
  g.fillStyle='#120c09';g.fillRect(0,0,w,h*.10);
  for(let i=0;i<5;i++){
    const lx=w*(.10+i*.20);
    g.strokeStyle='#2d211a';g.lineWidth=2;g.beginPath();g.moveTo(lx,0);g.lineTo(lx,h*(.15+(i%2)*.035));g.stroke();
    const ly=h*(.15+(i%2)*.035);
    g.fillStyle='#7b5234';g.beginPath();g.moveTo(lx-20,ly);g.lineTo(lx+20,ly);g.lineTo(lx+12,ly+22);g.lineTo(lx-12,ly+22);g.closePath();g.fill();
    const glow=g.createRadialGradient(lx,ly+25,2,lx,ly+25,90);
    glow.addColorStop(0,'rgba(255,188,103,.18)');glow.addColorStop(1,'rgba(255,188,103,0)');
    g.fillStyle=glow;g.fillRect(lx-90,ly-30,180,150);
  }

  // floor with perspective boards
  const floor=g.createLinearGradient(0,h*.55,0,h);floor.addColorStop(0,'#39261b');floor.addColorStop(1,'#1b120d');
  g.fillStyle=floor;g.fillRect(0,h*.55,w,h*.45);
  g.save();g.strokeStyle='rgba(232,191,148,.035)';g.lineWidth=1;
  for(let i=-8;i<=8;i++){g.beginPath();g.moveTo(w*.5,h*.55);g.lineTo(w*.5+i*w*.11,h);g.stroke();}
  for(let i=1;i<8;i++){const yy=h*.55+(h*.45)*Math.pow(i/8,1.55);g.beginPath();g.moveTo(0,yy);g.lineTo(w,yy);g.stroke();}
  g.restore();

  // bar counter at one side
  v8rectRound(g,w*.76,h*.45,w*.26,h*.18,5,'#4b3021',.94);
  g.fillStyle='#765038';g.fillRect(w*.75,h*.445,w*.25,8);
  for(let i=0;i<5;i++)ellipse(g,w*(.79+i*.045),h*.43,5,10,'#b18a64',.34);

  // many table groups, perspective scaled
  const sets=[
    [.18,.62,.48,2],[.42,.64,.50,2],[.66,.63,.47,1],
    [.10,.77,.72,2],[.34,.79,.78,2],[.61,.78,.74,2],[.84,.77,.68,2],
    [.22,.94,1.03,2],[.54,.93,1.05,2],[.82,.93,.98,2]
  ];
  for(const [xx,yy,s,p] of sets)v9tableSet(g,w*xx,h*yy,s,rng,p);

  // foreground chair silhouettes for depth
  g.save();g.globalAlpha=.75;g.fillStyle='#17100c';
  for(let i=0;i<4;i++){
    const x=w*(.04+i*.31);v8rectRound(g,x,h*.88,42,70,9,'#17100c',.72);
  }
  g.restore();
}
function v9drawRose(g,w,h,rng){
  // Elegant glass conservatory / rose garden, not a field.
  sceneGradient(g,w,h,[[0,'#c8d4d3'],[.48,'#e6dfd8'],[1,'#6e7d68']]);
  // greenhouse glass roof
  g.save();g.strokeStyle='rgba(66,82,76,.28)';g.lineWidth=3;
  for(let i=0;i<=8;i++){const x=i*w/8;g.beginPath();g.moveTo(w*.5,h*.05);g.lineTo(x,h*.52);g.stroke();}
  g.beginPath();g.moveTo(0,h*.52);g.lineTo(w,h*.52);g.stroke();g.restore();
  // glass light
  const light=g.createLinearGradient(0,0,0,h*.6);light.addColorStop(0,'rgba(255,255,255,.24)');light.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=light;g.fillRect(0,0,w,h*.62);

  // tiled central walkway
  g.fillStyle='#9b9486';g.beginPath();g.moveTo(w*.43,h*.52);g.lineTo(w*.57,h*.52);g.lineTo(w*.72,h);g.lineTo(w*.28,h);g.closePath();g.fill();
  g.save();g.strokeStyle='rgba(69,63,57,.14)';g.lineWidth=1;
  for(let i=1;i<8;i++){const t=i/8,y=v7lerp(h*.53,h,Math.pow(t,1.65));g.beginPath();g.moveTo(w*.43-(y-h*.52)*.31,y);g.lineTo(w*.57+(y-h*.52)*.31,y);g.stroke();}
  g.restore();

  // dense rose bushes on both sides
  for(const side of [-1,1]){
    for(let j=0;j<15;j++){
      const t=j/14, depth=t*t, y=v7lerp(h*.55,h*.98,depth);
      const edge=w*.5+side*v7lerp(w*.10,w*.38,depth);
      const sc=v7lerp(.24,1.15,depth);
      v7softBlob(g,edge+side*(20+rng()*30)*sc,y-18*sc,38*sc,25*sc,rng()>.5?'#365f43':'#2d543b',.68+depth*.25,8,rng);
      for(let k=0;k<5;k++){
        const cols=['#a93850','#c34d64','#d36a78','#8f3046'];
        v7flower(g,edge+(rng()-.5)*55*sc,y-25*sc+(rng()-.5)*30*sc,2.5*sc,cols[Math.floor(rng()*cols.length)],'#d8b38c',.58+depth*.35,rng()*6.28);
      }
    }
  }
  // benches / planters
  for(const side of [-1,1]){
    const x=w*.5+side*w*.29,y=h*.74;
    v8rectRound(g,x-40,y,80,8,2,'#695747',.65);g.fillStyle='#55483c';g.fillRect(x-32,y+8,5,25);g.fillRect(x+27,y+8,5,25);
  }
}
function v9drawLavender(g,w,h,rng){
  // Provence-style stone courtyard, lavender only as landscaping.
  sceneGradient(g,w,h,[[0,'#aebed0'],[.48,'#d9d5cc'],[1,'#777869']]);
  // old stone house
  g.fillStyle='#a89c87';g.fillRect(w*.12,h*.25,w*.52,h*.38);
  g.fillStyle='#74685d';g.beginPath();g.moveTo(w*.08,h*.27);g.lineTo(w*.38,h*.08);g.lineTo(w*.68,h*.27);g.closePath();g.fill();
  // windows + shutters
  for(let i=0;i<3;i++){
    const x=w*(.20+i*.15);
    v8rectRound(g,x,h*.35,46,70,3,'#34424a',.88);
    g.fillStyle='#776d61';g.fillRect(x-13,h*.35,9,70);g.fillRect(x+50,h*.35,9,70);
  }
  // warm doorway
  v8rectRound(g,w*.47,h*.40,58,h*.23,5,'#3e342d',1);
  const dg=g.createRadialGradient(w*.50,h*.49,2,w*.50,h*.49,80);dg.addColorStop(0,'rgba(244,190,116,.18)');dg.addColorStop(1,'rgba(244,190,116,0)');g.fillStyle=dg;g.fillRect(w*.40,h*.36,w*.20,h*.34);

  // stone courtyard
  g.fillStyle='#8f897d';g.fillRect(0,h*.63,w,h*.37);
  for(let i=0;i<45;i++){
    const x=rng()*w,y=h*(.65+rng()*.35),ww=18+rng()*45;
    g.strokeStyle='rgba(61,58,53,.10)';g.strokeRect(x,y,ww,8+rng()*15);
  }
  // lavender planters along courtyard edges
  for(const side of [-1,1]){
    for(let j=0;j<12;j++){
      const t=j/11,depth=t*t,y=v7lerp(h*.61,h*.96,depth),x=w*.5+side*v7lerp(w*.20,w*.44,depth),sc=v7lerp(.22,.95,depth);
      v7softBlob(g,x,y,28*sc,13*sc,'#465a43',.7,6,rng);
      for(let k=0;k<7;k++){
        const px=x+(rng()-.5)*42*sc,py=y-8*sc-rng()*20*sc;
        g.strokeStyle='rgba(61,83,57,.65)';g.lineWidth=Math.max(.5,sc);g.beginPath();g.moveTo(px,y);g.lineTo(px,py);g.stroke();
        for(let q=0;q<3;q++)v7leaf(g,px+(q%2?1:-1)*1.5*sc,py+q*3*sc,1.5*sc,rng()>.5?'#7560a5':'#8b73b5',.72,0);
      }
    }
  }
}
function v9drawLemon(g,w,h,rng){
  // Mediterranean patio under lemon trees.
  sceneGradient(g,w,h,[[0,'#91c9d4'],[.50,'#d7e6d9'],[1,'#66765b']]);
  // stucco wall and arched opening
  g.fillStyle='#d7cfb9';g.fillRect(0,h*.18,w,h*.58);
  g.fillStyle='#667f7e';g.beginPath();g.moveTo(w*.62,h*.30);g.arc(w*.72,h*.30,w*.10,Math.PI,0);g.lineTo(w*.82,h*.67);g.lineTo(w*.62,h*.67);g.closePath();g.fill();
  // blue sea through arch
  g.fillStyle='#6797a4';g.fillRect(w*.63,h*.31,w*.18,h*.36);
  g.fillStyle='#b9d5d5';g.fillRect(w*.63,h*.43,w*.18,h*.03);
  // tiled patio
  g.fillStyle='#a99d82';g.fillRect(0,h*.68,w,h*.32);
  g.save();g.strokeStyle='rgba(74,66,54,.10)';
  for(let i=0;i<12;i++){g.beginPath();g.moveTo(i*w/11,h*.68);g.lineTo(w*.5+(i-5.5)*w*.13,h);g.stroke();}
  for(let i=1;i<6;i++){const y=h*.68+(h*.32)*Math.pow(i/6,1.45);g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
  g.restore();
  // lemon trees framing patio
  for(const side of [-1,1]){
    for(let n=0;n<2;n++){
      const x=side<0?w*(.08+n*.17):w*(.92-n*.18),base=h*(.83+n*.05),sc=.85+n*.12;
      v8tree(g,x,base,sc,rng,'#3f6a3b','#5a4431',.95);
      for(let k=0;k<12;k++)ellipse(g,x+(rng()-.5)*75*sc,base-90*sc+(rng()-.5)*65*sc,4*sc,4.5*sc,'#e3c83e',.75);
    }
  }
  // café-style patio table
  v9tableSet(g,w*.47,h*.82,.82,rng,0);
  v8rectRound(g,w*.43,h*.72,80,8,3,'#d7c8aa',.7);
}
function v9drawPeach(g,w,h,rng){
  // Quiet Japanese peach-blossom garden rather than orchard rows.
  sceneGradient(g,w,h,[[0,'#b8c7d5'],[.50,'#e4d8d6'],[1,'#64705e']]);
  v8mountain(g,w,h,h*.48,'#8b8f93',.25,rng,.10);
  // pond
  const pond=g.createLinearGradient(0,h*.60,0,h);pond.addColorStop(0,'#718b87');pond.addColorStop(1,'#445d5a');
  g.fillStyle=pond;g.fillRect(0,h*.60,w,h*.40);
  // stepping stones
  for(let i=0;i<8;i++){const t=i/7,x=w*.35+t*w*.30+(i%2?18:-10),y=h*(.66+t*.045);ellipse(g,x,y,30+t*4,9+t*1.5,'#7c7b70',.72);}
  // little wooden bridge
  g.strokeStyle='#674838';g.lineWidth=8;g.beginPath();g.arc(w*.68,h*.70,90,Math.PI*1.08,Math.PI*1.92);g.stroke();
  g.lineWidth=2;for(let i=0;i<7;i++){const a=Math.PI*1.1+i*.13,x=w*.68+Math.cos(a)*90,y=h*.70+Math.sin(a)*90;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-22);g.stroke();}
  // peach blossom trees
  for(const side of [-1,1]){
    const x=side<0?w*.10:w*.90,base=h*.82;
    v7branch(g,x,base,w*.5+side*w*.18,h*.23,16,'#4b342f',.9);
    for(let b=0;b<10;b++){
      const bx=x+side*(-1)*(30+b*18),by=h*(.62-b*.035);
      const tx=bx+(rng()-.5)*80,ty=by-(30+rng()*50);
      v7branch(g,bx,by,tx,ty,4,'#523832',.8);
      for(let k=0;k<8;k++)ellipse(g,tx+(rng()-.5)*55,ty+(rng()-.5)*35,2.5+rng()*3,2+rng()*2.5,rng()>.5?'#e996a0':'#f0b0b1',.62+rng()*.22,rng()*6.28);
    }
  }
}
function v9fish(g,x,y,s,color,alpha=1,flip=1){
  g.save();g.translate(x,y);g.scale(flip,1);g.globalAlpha=alpha;g.fillStyle=color;
  g.beginPath();g.ellipse(0,0,9*s,4*s,0,0,Math.PI*2);g.fill();
  g.beginPath();g.moveTo(-8*s,0);g.lineTo(-15*s,-6*s);g.lineTo(-14*s,6*s);g.closePath();g.fill();
  g.fillStyle='rgba(235,245,245,.65)';g.beginPath();g.arc(4*s,-1*s,.8*s,0,Math.PI*2);g.fill();g.restore();
}
function v9drawOcean(g,w,h,rng){
  v7drawOcean(g,w,h,rng);
  // coral/rock accents
  for(let i=0;i<18;i++){
    const x=rng()*w,y=h*(.90+rng()*.10),s=.5+rng()*.9;
    g.strokeStyle=rng()>.5?'rgba(99,112,81,.48)':'rgba(112,77,70,.42)';g.lineWidth=2*s;
    for(let b=0;b<3;b++){g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+(b-1)*8*s,y-14*s,x+(b-1)*12*s,y-25*s);g.stroke();}
  }
  // several schools, kept subtle
  const colors=['#b7c7b7','#d2b47d','#8fb4bd','#c58d72','#9fc7c2'];
  for(let school=0;school<5;school++){
    const cx=w*(.15+rng()*.70),cy=h*(.28+rng()*.45),count=5+Math.floor(rng()*7),dir=rng()>.5?1:-1;
    for(let i=0;i<count;i++){
      const depth=.45+rng()*.75;
      v9fish(g,cx+(rng()-.5)*120,cy+(rng()-.5)*55,depth,colors[Math.floor(rng()*colors.length)],.34+rng()*.32,dir);
    }
  }
  // two larger foreground fish
  v9fish(g,w*.18,h*.52,1.25,'#a5b9a6',.46,1);
  v9fish(g,w*.80,h*.66,1.05,'#c3a574',.42,-1);
}
function v9drawSakura(g,w,h,rng){
  // Traditional Japanese shrine approach.
  sceneGradient(g,w,h,[[0,'#071020'],[.48,'#172039'],[.78,'#30263b'],[1,'#120e17']]);
  v8stars(g,w,h,rng,38,.38);ellipse(g,w*.80,h*.13,34,34,'#efeaff',.78);
  v8mountain(g,w,h,h*.55,'#2c3140',.30,rng,.10);

  // stone path
  g.fillStyle='#343234';g.beginPath();g.moveTo(w*.45,h*.52);g.lineTo(w*.55,h*.52);g.lineTo(w*.72,h);g.lineTo(w*.28,h);g.closePath();g.fill();
  for(let i=0;i<8;i++){const t=i/8,y=v7lerp(h*.56,h*.96,t*t),half=v7lerp(20,135,t*t);g.strokeStyle='rgba(210,204,194,.10)';g.beginPath();g.moveTo(w*.5-half,y);g.lineTo(w*.5+half,y);g.stroke();}

  // Torii gates receding into the path
  for(let j=0;j<4;j++){
    const t=j/3,depth=t*t,cy=v7lerp(h*.54,h*.82,depth),sc=v7lerp(.28,.82,depth),cx=w*.5;
    const red=j===3?'#8f342d':'#77302c';
    g.fillStyle=red;g.fillRect(cx-55*sc,cy-70*sc,8*sc,75*sc);g.fillRect(cx+47*sc,cy-70*sc,8*sc,75*sc);
    g.fillRect(cx-70*sc,cy-73*sc,140*sc,8*sc);g.fillRect(cx-61*sc,cy-61*sc,122*sc,6*sc);
  }
  // stone lanterns
  for(const side of [-1,1])for(let j=0;j<5;j++){
    const t=j/4,depth=t*t,y=v7lerp(h*.61,h*.94,depth),x=w*.5+side*v7lerp(w*.10,w*.34,depth),sc=v7lerp(.25,.72,depth);
    g.fillStyle='#5c5955';g.fillRect(x-3*sc,y-24*sc,6*sc,24*sc);
    v8rectRound(g,x-9*sc,y-34*sc,18*sc,11*sc,2*sc,'#6d6258',.9);
    const gl=g.createRadialGradient(x,y-29*sc,1,x,y-29*sc,25*sc);gl.addColorStop(0,'rgba(255,176,91,.18)');gl.addColorStop(1,'rgba(255,176,91,0)');g.fillStyle=gl;g.fillRect(x-30*sc,y-60*sc,60*sc,60*sc);
  }
  // sakura canopy framing top
  for(const side of [-1,1]){
    const sx=side<0?-20:w+20,sy=h*.42,ex=w*.50+side*w*.08,ey=h*.14;
    v7branch(g,sx,sy,ex,ey,17,'#28171e',.95);
    for(let b=0;b<12;b++){
      const t=.08+b*.07,bx=v7lerp(sx,ex,t),by=v7lerp(sy,ey,t),tx=bx+side*(rng()-.5)*80,ty=by-(20+rng()*45);
      v7branch(g,bx,by,tx,ty,3.8,'#311b24',.82);
      for(let k=0;k<7;k++)ellipse(g,tx+(rng()-.5)*48,ty+(rng()-.5)*30,2+rng()*3,1.8+rng()*2.2,rng()>.5?'#e88ba7':'#c9658b',.50+rng()*.28,rng()*6.28);
    }
  }
}
function v9drawCity(g,w,h,rng,terminal=false){
  const green=terminal;
  sceneGradient(g,w,h,green?[[0,'#010704'],[.52,'#03150b'],[1,'#010403']]:[[0,'#040816'],[.48,'#0c1230'],[.72,'#16132d'],[1,'#050710']]);
  const horizon=h*.75;

  // skyline glow behind buildings
  const glow=g.createRadialGradient(w*.52,horizon,0,w*.52,horizon,w*.58);
  glow.addColorStop(0,green?'rgba(39,255,118,.13)':'rgba(45,210,255,.16)');
  glow.addColorStop(.55,green?'rgba(39,255,118,.025)':'rgba(222,48,210,.035)');
  glow.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=glow;g.fillRect(0,h*.20,w,h*.70);

  // rear towers
  let x=-10;
  while(x<w+20){
    const bw=24+rng()*52,bh=70+rng()*180,base=horizon;
    const body=green?(rng()>.5?'#06170d':'#04120a'):(rng()>.5?'#111a35':'#17162f');
    g.fillStyle=body;g.fillRect(x,base-bh,bw,bh);
    // roof cap/antenna
    if(rng()>.45){g.strokeStyle=green?'rgba(69,255,128,.36)':'rgba(86,224,255,.34)';g.lineWidth=1.2;g.beginPath();g.moveTo(x+bw*.5,base-bh);g.lineTo(x+bw*.5,base-bh-20-rng()*45);g.stroke();}
    // many readable windows
    const cols=green?['rgba(74,255,132,.46)','rgba(157,255,190,.26)']:['rgba(70,225,255,.48)','rgba(255,75,207,.34)','rgba(255,210,101,.30)'];
    for(let yy=base-bh+12;yy<base-10;yy+=10){
      for(let xx=x+7;xx<x+bw-5;xx+=9){
        if(rng()>.30){g.fillStyle=cols[Math.floor(rng()*cols.length)];g.fillRect(xx,yy,3.5,4);}
      }
    }
    // edge neon
    if(rng()>.55){g.strokeStyle=green?'rgba(53,255,117,.24)':'rgba(59,214,255,.25)';g.strokeRect(x+.5,base-bh+.5,bw-1,bh-1);}
    x+=bw+5+rng()*9;
  }

  // foreground landmark towers
  for(let i=0;i<5;i++){
    const cx=w*(.10+i*.20)+(rng()-.5)*35,bw=52+rng()*42,bh=160+rng()*190,base=horizon+8;
    const body=green?'#020d07':'#090d20';
    g.fillStyle=body;g.fillRect(cx-bw/2,base-bh,bw,bh);
    g.strokeStyle=green?'rgba(63,255,122,.42)':(i%2?'rgba(255,57,207,.38)':'rgba(52,220,255,.42)');
    g.lineWidth=1.5;g.strokeRect(cx-bw/2,base-bh,bw,bh);
    for(let yy=base-bh+14;yy<base-12;yy+=12)for(let xx=cx-bw/2+8;xx<cx+bw/2-5;xx+=10){
      if(rng()>.22){g.fillStyle=green?'rgba(79,255,136,.52)':(rng()>.35?'rgba(64,224,255,.54)':'rgba(255,75,211,.42)');g.fillRect(xx,yy,4,5);}
    }
  }

  // wet reflective street/grid
  const grd=g.createLinearGradient(0,horizon,0,h);grd.addColorStop(0,green?'#03150a':'#080d1c');grd.addColorStop(1,'#010204');
  g.fillStyle=grd;g.fillRect(0,horizon,w,h-horizon);
  g.save();g.globalAlpha=.18;g.lineWidth=1;
  for(let i=1;i<9;i++){const yy=horizon+(h-horizon)*Math.pow(i/9,1.6);g.strokeStyle=green?'#35ef75':'#47d9f3';g.beginPath();g.moveTo(0,yy);g.lineTo(w,yy);g.stroke();}
  for(let i=-9;i<=9;i++){g.strokeStyle=green?'#35ef75':(i%2?'#e64bc6':'#47d9f3');g.beginPath();g.moveTo(w*.5,horizon);g.lineTo(w*.5+i*w*.105,h);g.stroke();}
  // vertical reflections
  for(let i=0;i<26;i++){const rx=rng()*w,rw=1+rng()*4,rh=8+rng()*45;g.fillStyle=green?'rgba(50,239,112,.10)':(rng()>.5?'rgba(58,218,244,.11)':'rgba(231,65,198,.08)');g.fillRect(rx,horizon+rng()*(h-horizon),rw,rh);}
  g.restore();
}

// Override V8 scene compositor for requested V9 concepts.
v8drawStaticScene=function(g,w,h,meta){
  const rng=v7rng(v7seedFor('v9-'+meta.scene,w,h));
  switch(meta.scene){
    case 'night':v8drawNight(g,w,h,rng);break;
    case 'day':v8drawDay(g,w,h,rng);break;
    case 'midnight':v8drawMidnight(g,w,h,rng);break;
    case 'oled':v8drawOLED(g,w,h,rng);break;
    case 'forest':v7drawForest(g,w,h,rng);break;
    case 'rose':v9drawRose(g,w,h,rng);break;
    case 'lavender':v9drawLavender(g,w,h,rng);break;
    case 'ocean':v9drawOcean(g,w,h,rng);break;
    case 'sunset':v8drawSunset(g,w,h,rng);break;
    case 'coffee':v9drawCoffee(g,w,h,rng);break;
    case 'meadow':v8drawMeadow(g,w,h,rng);break;
    case 'sakura':v9drawSakura(g,w,h,rng);break;
    case 'sky':v8drawSky(g,w,h,rng);break;
    case 'lemon':v9drawLemon(g,w,h,rng);break;
    case 'peach':v9drawPeach(g,w,h,rng);break;
    case 'cyber':v9drawCity(g,w,h,rng,false);break;
    case 'grape':v8drawGrape(g,w,h,rng);break;
    case 'terminal':v9drawCity(g,w,h,rng,true);break;
    default:v7drawStaticScene(g,w,h,meta);
  }
  const vign=g.createRadialGradient(w*.5,h*.42,Math.min(w,h)*.18,w*.5,h*.46,Math.max(w,h)*.78);
  const light=['day','rose','lavender','meadow','sky','lemon','peach'].includes(meta.scene);
  vign.addColorStop(0,'rgba(255,255,255,0)');
  vign.addColorStop(1,light?'rgba(55,65,60,.045)':'rgba(0,0,0,.13)');
  g.fillStyle=vign;g.fillRect(0,0,w,h);
};
getSceneCache=function(meta,w,h){
  const key=`v9:${meta.id}:${w}x${h}`;
  if(sceneCacheKey===key&&sceneCache)return sceneCache;
  sceneCache=mkOffscreen(w,h);
  sceneCacheCtx=sceneCache.getContext('2d',{alpha:false});
  v8drawStaticScene(sceneCacheCtx,w,h,meta);
  sceneCacheKey=key;
  return sceneCache;
};

Object.assign(THEME_SCENE_LABELS,{
  rose:'Glass rose conservatory',
  lavender:'Provence stone courtyard',
  ocean:'Reef · fish · light rays',
  coffee:'Rainy café · tables · patrons',
  sakura:'Japanese shrine · torii · sakura',
  lemon:'Mediterranean lemon patio',
  peach:'Japanese peach garden · pond',
  cyber:'Bright neon megacity',
  terminal:'Green terminal megacity'
});


// ==========================================================================
// SCENE V10 — FINAL ACTIVE EFFECTS PASS
// Canvas-only. Static landscape is cached; only lightweight atmosphere moves.
// ==========================================================================

let v10Fx = [];
let v10SceneName = '';
let v10LastSize = '';
let v10Wind = 0;
let v10Flash = 0;

function v10Rand(min=0,max=1){ return min + Math.random()*(max-min); }
function v10Wrap(v,min,max){ const d=max-min; return ((v-min)%d+d)%d+min; }

function v10ResetFx(){
  if(!canvas) return;
  const w=canvas._cssW||innerWidth, h=canvas._cssH||innerHeight;
  const s=getThemeMeta().scene;
  v10Fx=[];
  v10SceneName=s; v10LastSize=`${w}x${h}`;
  const q=Math.max(.42,FX_QUALITY);

  const add=(n,maker)=>{
    n=Math.max(1,Math.round(n*q));
    for(let i=0;i<n;i++)v10Fx.push(maker(i));
  };

  if(s==='night'||s==='midnight'){
    add(78,()=>({kind:'star',x:v10Rand(0,w),y:v10Rand(0,h*.66),r:v10Rand(.45,1.55),a:v10Rand(.28,.88),tw:v10Rand(.7,2.3),p:v10Rand(0,6.283)}));
    add(3,()=>({kind:'shoot',x:v10Rand(w*.25,w*.95),y:v10Rand(-h*.15,h*.30),vx:v10Rand(-3.2,-1.9),vy:v10Rand(2.0,3.1),life:v10Rand(-180,60),max:95}));
    add(12,()=>({kind:'water',x:v10Rand(w*.55,w*.91),y:v10Rand(h*.76,h*.98),len:v10Rand(14,50),a:v10Rand(.025,.10),p:v10Rand(0,6.283)}));
  } else if(s==='oled'){
    add(42,()=>({kind:'star',x:v10Rand(0,w),y:v10Rand(0,h*.70),r:v10Rand(.35,1.2),a:v10Rand(.16,.62),tw:v10Rand(.6,1.8),p:v10Rand(0,6.283)}));
    add(4,(_,)=>({kind:'aurora',x:v10Rand(-w*.2,w*.9),y:v10Rand(h*.20,h*.60),w:v10Rand(w*.20,w*.42),h:v10Rand(45,105),p:v10Rand(0,6.283),a:v10Rand(.025,.065)}));
  } else if(s==='forest'){
    add(34,()=>({kind:'firefly',x:v10Rand(0,w),y:v10Rand(h*.30,h*.95),r:v10Rand(.8,1.8),a:v10Rand(.26,.78),p:v10Rand(0,6.283),vx:v10Rand(-.10,.10),vy:v10Rand(-.05,.05)}));
    add(6,()=>({kind:'mist',x:v10Rand(-w*.25,w),y:v10Rand(h*.44,h*.75),rx:v10Rand(w*.16,w*.30),ry:v10Rand(18,46),vx:v10Rand(.06,.16),a:v10Rand(.018,.050),p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'leafspeck',x:v10Rand(0,w),y:v10Rand(0,h),r:v10Rand(.4,1.1),a:v10Rand(.03,.10),vx:v10Rand(.02,.08),vy:v10Rand(.02,.07),p:v10Rand(0,6.283)}));
  } else if(s==='ocean'){
    add(24,()=>({kind:'bubble',x:v10Rand(0,w),y:v10Rand(h*.30,h*1.04),r:v10Rand(1.5,6.5),a:v10Rand(.08,.24),vy:v10Rand(-.22,-.08),p:v10Rand(0,6.283)}));
    add(24,(_,)=>({kind:'fish',x:v10Rand(-w*.15,w*1.10),y:v10Rand(h*.24,h*.76),s:v10Rand(.38,.95),dir:Math.random()>.5?1:-1,v:v10Rand(.24,.72),a:v10Rand(.20,.48),p:v10Rand(0,6.283),tone:Math.floor(v10Rand(0,5))}));
    add(5,()=>({kind:'ray',x:v10Rand(-w*.1,w*.9),p:v10Rand(0,6.283),a:v10Rand(.012,.032)}));
  } else if(s==='coffee'){
    add(52,()=>({kind:'rain',x:v10Rand(w*.04,w*.94),y:v10Rand(h*.07,h*.57),len:v10Rand(8,28),v:v10Rand(.45,1.1),a:v10Rand(.035,.12),p:v10Rand(0,6.283)}));
    add(10,()=>({kind:'steam',x:v10Rand(w*.12,w*.90),y:v10Rand(h*.60,h*.90),r:v10Rand(8,18),a:v10Rand(.018,.050),vy:v10Rand(-.05,-.025),p:v10Rand(0,6.283)}));
    add(9,()=>({kind:'lamp',x:v10Rand(.08,.92),p:v10Rand(0,6.283),a:v10Rand(.025,.065)}));
  } else if(s==='sakura'){
    add(32,()=>({kind:'petal',x:v10Rand(-40,w),y:v10Rand(-h*.2,h),r:v10Rand(2.0,4.2),a:v10Rand(.30,.68),vx:v10Rand(.24,.68),vy:v10Rand(.16,.40),rot:v10Rand(0,6.283),vr:v10Rand(-.025,.025),p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'lantern',x:v10Rand(.14,.86),y:v10Rand(.58,.94),p:v10Rand(0,6.283),a:v10Rand(.025,.08)}));
    add(8,()=>({kind:'moonDust',x:v10Rand(0,w),y:v10Rand(0,h*.55),r:v10Rand(.4,1.1),a:v10Rand(.04,.12),p:v10Rand(0,6.283)}));
  } else if(s==='cyber'||s==='terminal'){
    const terminal=s==='terminal';
    add(58,()=>({kind:'window',x:v10Rand(0,w),y:v10Rand(h*.25,h*.74),r:v10Rand(1.1,2.3),a:v10Rand(.12,.46),p:v10Rand(0,6.283),terminal}));
    add(18,()=>({kind:'traffic',x:v10Rand(-w*.1,w*1.1),y:v10Rand(h*.78,h*.97),len:v10Rand(12,50),v:v10Rand(.45,1.3),a:v10Rand(.06,.18),dir:Math.random()>.5?1:-1,terminal,p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'neonDust',x:v10Rand(0,w),y:v10Rand(0,h),r:v10Rand(.5,1.5),a:v10Rand(.04,.13),vy:v10Rand(.01,.05),p:v10Rand(0,6.283),terminal}));
  } else if(s==='grape'){
    add(18,()=>({kind:'duskDust',x:v10Rand(0,w),y:v10Rand(h*.28,h*.90),r:v10Rand(.7,1.8),a:v10Rand(.035,.12),vx:v10Rand(-.025,.04),vy:v10Rand(-.018,.018),p:v10Rand(0,6.283)}));
    add(12,()=>({kind:'fireflyPurple',x:v10Rand(0,w),y:v10Rand(h*.45,h*.92),r:v10Rand(.7,1.4),a:v10Rand(.10,.35),p:v10Rand(0,6.283),vx:v10Rand(-.05,.05),vy:v10Rand(-.025,.025)}));
  } else if(s==='day'||s==='sky'||s==='meadow'||s==='sunset'){
    add(s==='sky'?11:7,()=>({kind:'cloud',x:v10Rand(-180,w),y:v10Rand(30,h*(s==='sunset'?.42:.35)),sc:v10Rand(.55,1.18),a:v10Rand(.09,.22),v:v10Rand(.050,.125),p:v10Rand(0,6.283)}));
    add(10,()=>({kind:'bird',x:v10Rand(-60,w),y:v10Rand(h*.16,h*.50),s:v10Rand(.45,1.0),v:v10Rand(.12,.30),a:v10Rand(.10,.28),p:v10Rand(0,6.283)}));
    if(s==='meadow')add(18,()=>({kind:'pollen',x:v10Rand(0,w),y:v10Rand(h*.48,h*.98),r:v10Rand(.5,1.4),a:v10Rand(.04,.13),vx:v10Rand(.015,.065),vy:v10Rand(-.025,.015),p:v10Rand(0,6.283)}));
    if(s==='sunset')add(14,()=>({kind:'goldDust',x:v10Rand(0,w),y:v10Rand(h*.36,h*.92),r:v10Rand(.6,1.4),a:v10Rand(.03,.10),vx:v10Rand(.01,.045),vy:v10Rand(-.02,.01),p:v10Rand(0,6.283)}));
  }
}

function v10Fish(ctx,p,t){
  const colors=['#b9c9b7','#d4b67d','#8eb7bf','#c88d72','#9dc8c0'];
  const col=colors[p.tone%colors.length];
  const wag=Math.sin(t*3+p.p)*1.7*p.s;
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.dir,1);ctx.globalAlpha=p.a;
  ctx.fillStyle=col;
  ctx.beginPath();ctx.ellipse(0,0,9*p.s,4*p.s,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(-8*p.s,0);ctx.lineTo(-15*p.s,-6*p.s+wag);ctx.lineTo(-14*p.s,6*p.s+wag);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(238,248,248,.65)';ctx.beginPath();ctx.arc(4*p.s,-1*p.s,.7*p.s,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function v10DrawFx(w,h,s,t,dt){
  v10Wind=Math.sin(t*.22)*.5;

  for(const p of v10Fx){
    ctx.save();

    if(p.kind==='star'){
      const tw=.55+.45*Math.sin(t*p.tw+p.p);
      ctx.globalAlpha=p.a*(.52+.48*tw);
      ctx.fillStyle='#eef7ff';ctx.beginPath();ctx.arc(p.x,p.y,p.r*(.85+tw*.15),0,6.283);ctx.fill();
    }
    else if(p.kind==='shoot'){
      p.life+=dt*60;
      if(p.life>p.max){p.life=v10Rand(-240,-30);p.x=v10Rand(w*.25,w*1.05);p.y=v10Rand(-h*.10,h*.25);}
      if(p.life>0){
        const a=Math.sin(Math.min(1,p.life/18)*Math.PI)*.34;
        ctx.globalAlpha=Math.max(.02,a);ctx.strokeStyle='#dcecff';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*13,p.y-p.vy*13);ctx.stroke();
        p.x+=p.vx;p.y+=p.vy;
      }
    }
    else if(p.kind==='water'){
      ctx.globalAlpha=p.a*(.55+.45*Math.sin(t*1.2+p.p));
      ctx.strokeStyle='#bed7ee';ctx.lineWidth=.7;
      ctx.beginPath();ctx.moveTo(p.x-p.len/2,p.y);ctx.lineTo(p.x+p.len/2,p.y);ctx.stroke();
    }
    else if(p.kind==='aurora'){
      const yy=p.y+Math.sin(t*.35+p.p)*12;
      const gr=ctx.createLinearGradient(p.x,yy,p.x+p.w,yy+p.h);
      gr.addColorStop(0,'rgba(0,255,116,0)');
      gr.addColorStop(.5,`rgba(50,255,135,${p.a*(.7+.3*Math.sin(t*.55+p.p))})`);
      gr.addColorStop(1,'rgba(89,100,255,0)');
      ctx.fillStyle=gr;ctx.filter='blur(16px)';
      ctx.beginPath();ctx.ellipse(p.x+p.w*.5,yy,p.w*.5,p.h*.5,.15*Math.sin(t*.2+p.p),0,6.283);ctx.fill();
    }
    else if(p.kind==='firefly'||p.kind==='fireflyPurple'){
      const purple=p.kind==='fireflyPurple';
      const pulse=.45+.55*(.5+.5*Math.sin(t*1.8+p.p));
      ctx.globalAlpha=p.a*pulse;ctx.shadowBlur=10;
      ctx.shadowColor=purple?'#d8b4fe':'#d9f99d';ctx.fillStyle=purple?'#ead8ff':'#edffb8';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
      p.x+=p.vx+Math.sin(t+p.p)*.025;p.y+=p.vy+Math.cos(t*.7+p.p)*.018;
      p.x=v10Wrap(p.x,-10,w+10);p.y=v10Wrap(p.y,h*.28,h*.98);
    }
    else if(p.kind==='mist'){
      p.x+=p.vx;
      if(p.x-p.rx>w)p.x=-p.rx;
      ctx.globalAlpha=p.a*(.78+.22*Math.sin(t*.35+p.p));
      ctx.fillStyle='#dbe7e1';ctx.filter='blur(20px)';
      ctx.beginPath();ctx.ellipse(p.x,p.y+Math.sin(t*.22+p.p)*5,p.rx,p.ry,0,0,6.283);ctx.fill();
    }
    else if(p.kind==='leafspeck'||p.kind==='pollen'||p.kind==='goldDust'||p.kind==='duskDust'){
      const gold=p.kind==='goldDust', purple=p.kind==='duskDust';
      ctx.globalAlpha=p.a*(.65+.35*Math.sin(t+p.p));
      ctx.fillStyle=gold?'#ffd59a':purple?'#e6c6da':'#eef3d4';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
      p.x+=p.vx+v10Wind*.01;p.y+=p.vy+Math.sin(t*.6+p.p)*.01;
      if(p.x>w+5)p.x=-5;if(p.y<-5)p.y=h+5;if(p.y>h+5)p.y=-5;
    }
    else if(p.kind==='bubble'){
      ctx.globalAlpha=p.a;ctx.strokeStyle='#d6fbff';ctx.lineWidth=.8;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.stroke();
      p.y+=p.vy;p.x+=Math.sin(t+p.p)*.025;
      if(p.y<-10){p.y=h+10;p.x=v10Rand(0,w);}
    }
    else if(p.kind==='fish'){
      v10Fish(ctx,p,t);
      p.x+=p.v*p.dir;p.y+=Math.sin(t*.9+p.p)*.035;
      if(p.dir>0&&p.x>w+40)p.x=-45;if(p.dir<0&&p.x<-45)p.x=w+45;
    }
    else if(p.kind==='ray'){
      const xx=p.x+Math.sin(t*.18+p.p)*35;
      ctx.globalAlpha=p.a*(.7+.3*Math.sin(t*.5+p.p));ctx.fillStyle='#d7fbff';
      ctx.beginPath();ctx.moveTo(xx,0);ctx.lineTo(xx+55,0);ctx.lineTo(xx+215,h*.83);ctx.lineTo(xx+110,h*.83);ctx.closePath();ctx.fill();
    }
    else if(p.kind==='rain'){
      p.y+=p.v;
      if(p.y>h*.58){p.y=h*.07;p.x=v10Rand(w*.04,w*.94);}
      ctx.globalAlpha=p.a;ctx.strokeStyle='#d9e7e8';ctx.lineWidth=.65;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-2,p.y+p.len);ctx.stroke();
    }
    else if(p.kind==='steam'){
      p.y+=p.vy;
      if(p.y<h*.52){p.y=v10Rand(h*.68,h*.89);p.x=v10Rand(w*.08,w*.92);}
      ctx.globalAlpha=p.a*(.65+.35*Math.sin(t*.8+p.p));ctx.fillStyle='#fff1df';ctx.filter='blur(7px)';
      ctx.beginPath();ctx.ellipse(p.x+Math.sin(t+p.p)*5,p.y,p.r*.45,p.r,0,0,6.283);ctx.fill();
    }
    else if(p.kind==='lamp'){
      const x=w*p.x;
      const y=h*(.18+(Math.floor(p.x*10)%2)*.025);
      const gr=ctx.createRadialGradient(x,y,2,x,y,80);
      gr.addColorStop(0,`rgba(255,190,105,${p.a*(.72+.28*Math.sin(t*.8+p.p))})`);gr.addColorStop(1,'rgba(255,190,105,0)');
      ctx.fillStyle=gr;ctx.fillRect(x-80,y-80,160,160);
    }
    else if(p.kind==='petal'){
      ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=p.a;ctx.fillStyle='#ec8fa9';
      ctx.beginPath();ctx.ellipse(0,0,p.r*.55,p.r*1.15,0,0,6.283);ctx.fill();
      p.x+=p.vx+Math.sin(t*1.2+p.p)*.08;p.y+=p.vy;p.rot+=p.vr;
      if(p.y>h+15||p.x>w+25){p.y=-15;p.x=v10Rand(-60,w*.75);}
    }
    else if(p.kind==='lantern'){
      const x=w*p.x,y=h*p.y;
      const gr=ctx.createRadialGradient(x,y,1,x,y,34);
      gr.addColorStop(0,`rgba(255,170,85,${p.a*(.65+.35*Math.sin(t*1.4+p.p))})`);gr.addColorStop(1,'rgba(255,170,85,0)');
      ctx.fillStyle=gr;ctx.fillRect(x-35,y-35,70,70);
    }
    else if(p.kind==='moonDust'){
      ctx.globalAlpha=p.a*(.5+.5*Math.sin(t*.8+p.p));ctx.fillStyle='#efe7ff';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
    }
    else if(p.kind==='window'){
      const pulse=.35+.65*(.5+.5*Math.sin(t*v10Rand(.45,.95)+p.p));
      ctx.globalAlpha=p.a*pulse;
      ctx.fillStyle=p.terminal?'#6cff9b':(Math.sin(p.p)>0?'#54e6ff':'#ff63d9');
      ctx.fillRect(p.x,p.y,p.r*1.6,p.r*2.2);
    }
    else if(p.kind==='traffic'){
      p.x+=p.v*p.dir;
      if(p.dir>0&&p.x>w+60)p.x=-60;if(p.dir<0&&p.x<-60)p.x=w+60;
      ctx.globalAlpha=p.a;ctx.strokeStyle=p.terminal?'#46f77d':(Math.sin(p.p)>0?'#4de7ff':'#ff4ecb');
      ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.len*p.dir,p.y+1.5);ctx.stroke();
    }
    else if(p.kind==='neonDust'){
      ctx.globalAlpha=p.a*(.55+.45*Math.sin(t+p.p));ctx.fillStyle=p.terminal?'#66ff9a':'#91efff';
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();p.y+=p.vy;if(p.y>h+5){p.y=-5;p.x=v10Rand(0,w);}
    }
    else if(p.kind==='cloud'){
      cloud(ctx,p.x,p.y,p.sc,p.a,'255,255,255');p.x+=p.v;
      if(p.x>w+180)p.x=-180;
    }
    else if(p.kind==='bird'){
      p.x+=p.v;if(p.x>w+50){p.x=-50;p.y=v10Rand(h*.14,h*.48);}
      const flap=Math.sin(t*4+p.p)*2.2*p.s;
      ctx.globalAlpha=p.a;ctx.strokeStyle=s==='sunset'?'#2c2730':'#48636a';ctx.lineWidth=.8*p.s;
      ctx.beginPath();ctx.moveTo(p.x-5*p.s,p.y+flap);ctx.quadraticCurveTo(p.x,p.y-2*p.s,p.x,p.y);ctx.quadraticCurveTo(p.x,p.y-2*p.s,p.x+5*p.s,p.y+flap);ctx.stroke();
    }

    ctx.restore();
  }
}

drawBackground=function(ts=0){
  if(!canvas||!ctx||!isCanvasEnabled||document.hidden){animationFrameId=null;return;}

  const minDelta=1000/FX_TARGET_FPS;
  if(ts-fxLastFrame<minDelta){animationFrameId=requestAnimationFrame(drawBackground);return;}
  const dt=Math.min(.05,(ts-fxLastFrame||minDelta)/1000);fxLastFrame=ts;

  const w=canvas._cssW||innerWidth,h=canvas._cssH||innerHeight;
  const meta=getThemeMeta(),s=meta.scene;
  themeFxTick+=dt;

  if(v10SceneName!==s||v10LastSize!==`${w}x${h}`)v10ResetFx();

  ctx.clearRect(0,0,w,h);
  ctx.drawImage(getSceneCache(meta,w,h),0,0,w,h);

  // Slow global light breathing makes even static landscapes feel alive.
  const breathe=.5+.5*Math.sin(themeFxTick*.22);
  if(['forest','ocean','sunset','coffee','sakura','cyber','terminal','grape','midnight'].includes(s)){
    const ambient=ctx.createRadialGradient(w*.72,h*.18,10,w*.72,h*.18,w*.60);
    ambient.addColorStop(0, s==='cyber'||s==='terminal'
      ? `rgba(${s==='terminal'?'65,255,126':'72,215,255'},${.010+.010*breathe})`
      : `rgba(255,235,205,${.006+.010*breathe})`);
    ambient.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=ambient;ctx.fillRect(0,0,w,h);
  }

  v10DrawFx(w,h,s,themeFxTick,dt);

  // Gentle vignette only; do not flatten the scene.
  const lightScene=['day','sky','meadow'].includes(s);
  const vg=ctx.createRadialGradient(w*.5,h*.43,Math.min(w,h)*.22,w*.5,h*.47,Math.max(w,h)*.78);
  vg.addColorStop(0,'rgba(255,255,255,0)');
  vg.addColorStop(1,lightScene?'rgba(52,67,71,.035)':'rgba(0,0,0,.105)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);

  animationFrameId=requestAnimationFrame(drawBackground);
};

// V10 uses its own FX pool. Hook theme/resize initialization into the existing flow.
const __v10OldInitBackgroundObjects=initBackgroundObjects;
initBackgroundObjects=function(){
  __v10OldInitBackgroundObjects();
  v10ResetFx();
};

// Descriptions in picker.
Object.assign(THEME_SCENE_LABELS,{
  night:'Moonlit lake · shooting stars',
  day:'Morning landscape · clouds · birds',
  midnight:'Alpine night · stars · moon shimmer',
  oled:'Black horizon · living aurora',
  forest:'Deep forest · drifting mist · fireflies',
  ocean:'Living reef · swimming fish · bubbles',
  sunset:'Golden valley · clouds · birds',
  coffee:'Rainy café · patrons · steam · rain',
  meadow:'Wild meadow · wind · pollen',
  sakura:'Japanese shrine · petals · lantern glow',
  sky:'Sea of clouds · distant birds',
  cyber:'Bright megacity · traffic · neon windows',
  grape:'Vineyard dusk · floating lights',
  terminal:'Terminal megacity · traffic · green glow'
});

// Any user who previously saved a removed theme falls back cleanly.
(function v10MigrateRemovedTheme(){
  const old=localStorage.getItem(THEME_KEY);
  if(['rose','lavender','lemon','peach'].includes(old)){
    localStorage.setItem(THEME_KEY,'dark');
  }
})();

// ============================================================================
// V11.1 — CANVAS-FIRST THEMES (NO POINTER / NO TILT / NO CURSOR PARALLAX)
// ============================================================================
(function initCanvasFirstThemesV11_1(){
  const reduceMotion = matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  function ensureTransitionFlash(){
    let el=document.getElementById('themeTransitionFlash');
    if(!el){
      el=document.createElement('div');
      el.id='themeTransitionFlash';
      el.className='theme-transition-flash';
      document.body.appendChild(el);
    }
    return el;
  }

  // Keep only a cheap theme-change fade. No mouse/pointer tracking is registered.
  const oldApply=applyDashboardTheme;
  applyDashboardTheme=function(themeId,save=true,preserveAuto=false){
    const before=document.body.dataset.theme || getCurrentTheme();
    oldApply(themeId,save,preserveAuto);
    if(!reduceMotion && before!==themeId){
      const flash=ensureTransitionFlash();
      flash.classList.remove('play');
      void flash.offsetWidth;
      flash.classList.add('play');
      flash.addEventListener('animationend',()=>flash.classList.remove('play'),{once:true});
    }
  };

  // Canvas is intentionally fixed. No translate/scale tied to the cursor.
  if(canvas) canvas.style.transform='';

  window.addEventListener('load',()=>{
    ensureThemePicker();
    const small=document.querySelector('#themePickerOverlay .theme-picker-head small');
    if(small)small.textContent='Canvas scenery · stars · wind · clouds · fish · petals · optimized motion.';
  });
})();


// ============================================================================
// V12 UI POLISH — presentation only; no new data model or feature dependency.
// ============================================================================
(function initWorkspaceUIV12(){
    function refreshWorkspaceHero(){
        const now = new Date();
        const greetingEl = document.getElementById('workspaceGreeting');
        const dateEl = document.getElementById('workspaceTodayLabel');

        if (greetingEl) {
            const hour = now.getHours();
            const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
            greetingEl.textContent = `${greeting}. Everything you need is ready here.`;
        }
        if (dateEl) dateEl.textContent = new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).format(now);
    }
    window.refreshWorkspaceHero = refreshWorkspaceHero;
    window.addEventListener('load', refreshWorkspaceHero, {once:true});
})();


// ============================================================================
// V12.1 UI META — lightweight visual metadata only.
// ============================================================================
(function initWorkspaceUIV12_1(){
    function updateWorkspaceSectionMeta(){
        const grid = document.getElementById('groupsGrid');
        const countEl = document.getElementById('workspaceSectionCount');
        const titleEl = document.getElementById('workspaceSectionTitle');
        if (!grid || !countEl) return;

        const cards = Array.from(grid.children).filter(el => el.classList && el.classList.contains('group-card'));
        countEl.textContent = `${cards.length} group${cards.length === 1 ? '' : 's'}`;

        const activeChip = document.querySelector('.tag-chip.active');
        if (titleEl) {
            const label = activeChip?.textContent?.trim();
            titleEl.textContent = label && !/^all$/i.test(label) ? label : 'Your groups';
        }
    }

    window.addEventListener('load', () => {
        updateWorkspaceSectionMeta();
        const grid = document.getElementById('groupsGrid');
        if (grid && 'MutationObserver' in window) {
            new MutationObserver(updateWorkspaceSectionMeta).observe(grid,{childList:true});
        }
        document.addEventListener('click', (e) => {
            if (e.target.closest?.('.tag-chip')) setTimeout(updateWorkspaceSectionMeta,0);
        });
    }, {once:true});
})();

// ============================================================================
// MOBILE PRO 2026 — navigation state hardening
// Keeps the page, drawer and mobile dock from competing for touch/scroll state.
// ============================================================================
(function initMobileProNavigation() {
    const mq = window.matchMedia('(max-width: 768px)');

    function syncMobileSidebarA11y() {
        const open = document.body.classList.contains('sidebar-open');
        const sidebar = document.querySelector('.app-sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        const moreBtn = document.querySelector('.mobile-bottom-nav-v12 button:last-child');

        if (sidebar) {
            sidebar.setAttribute('aria-hidden', open ? 'false' : 'true');
            sidebar.setAttribute('aria-modal', mq.matches && open ? 'true' : 'false');
            if (mq.matches) sidebar.setAttribute('role', 'dialog');
            else {
                sidebar.removeAttribute('role');
                sidebar.removeAttribute('aria-modal');
                sidebar.removeAttribute('aria-hidden');
            }
        }
        if (backdrop) backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
        if (moreBtn) moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    const originalToggleMobileSidebar = window.toggleMobileSidebar;
    window.toggleMobileSidebar = function(force) {
        if (typeof originalToggleMobileSidebar === 'function') {
            originalToggleMobileSidebar(force);
        } else {
            const shouldOpen = typeof force === 'boolean'
                ? force
                : !document.body.classList.contains('sidebar-open');
            document.body.classList.toggle('sidebar-open', shouldOpen);
        }
        syncMobileSidebarA11y();
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
            window.toggleMobileSidebar(false);
        }
    });

    document.addEventListener('click', (event) => {
        if (!mq.matches || !document.body.classList.contains('sidebar-open')) return;
        const sidebar = event.target.closest('.app-sidebar');
        const moreBtn = event.target.closest('.mobile-bottom-nav-v12 button:last-child');
        if (!sidebar && !moreBtn && !event.target.closest('#sidebarBackdrop')) {
            window.toggleMobileSidebar(false);
        }
    }, { passive: true });

    function handleBreakpointChange() {
        if (!mq.matches) document.body.classList.remove('sidebar-open');
        syncMobileSidebarA11y();
    }

    if (mq.addEventListener) mq.addEventListener('change', handleBreakpointChange);
    else mq.addListener(handleBreakpointChange);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncMobileSidebarA11y, { once: true });
    } else {
        syncMobileSidebarA11y();
    }
})();

// ============================================================================
// MOBILE PRO 2026.1 — contextual group menus
// Keeps context menus close to the tap/click while clamping them to the viewport.
// ============================================================================
(function initMobileContextualMenus() {
    const mobileMQ = window.matchMedia('(max-width: 768px)');
    const originalOpenContextMenu = window.openContextMenu;

    if (typeof originalOpenContextMenu !== 'function') return;

    function placeMobileContextMenu(menu, event, isGroupMenu) {
        if (!menu || !mobileMQ.matches) return;

        menu.classList.toggle('mobile-group-context', !!isGroupMenu);
        menu.classList.toggle('mobile-item-context', !isGroupMenu);

        // Let the browser calculate the real menu size before clamping position.
        requestAnimationFrame(() => {
            const vv = window.visualViewport;
            const viewportWidth = vv ? vv.width : window.innerWidth;
            const viewportHeight = vv ? vv.height : window.innerHeight;
            const offsetLeft = vv ? vv.offsetLeft : 0;
            const offsetTop = vv ? vv.offsetTop : 0;
            const gap = 10;
            const dockReserve = 82;
            const rect = menu.getBoundingClientRect();

            const clientX = Number.isFinite(event?.clientX) ? event.clientX : viewportWidth / 2;
            const clientY = Number.isFinite(event?.clientY) ? event.clientY : viewportHeight / 2;

            let left = clientX + 8;
            if (left + rect.width > offsetLeft + viewportWidth - gap) {
                left = clientX - rect.width - 8;
            }
            left = Math.max(offsetLeft + gap, Math.min(left, offsetLeft + viewportWidth - rect.width - gap));

            let top = clientY + 10;
            const usableBottom = offsetTop + viewportHeight - dockReserve;
            if (top + rect.height > usableBottom) {
                top = clientY - rect.height - 10;
            }
            top = Math.max(offsetTop + gap, Math.min(top, usableBottom - rect.height));

            menu.style.setProperty('--mobile-menu-left', `${Math.round(left)}px`);
            menu.style.setProperty('--mobile-menu-top', `${Math.round(top)}px`);
            menu.style.setProperty('--mobile-menu-origin-x', clientX > viewportWidth / 2 ? '100%' : '0%');
            menu.style.setProperty('--mobile-menu-origin-y', top < clientY ? '100%' : '0%');
        });
    }

    window.openContextMenu = function(event, targetType, groupId, index = null) {
        originalOpenContextMenu.call(this, event, targetType, groupId, index);

        if (!mobileMQ.matches) return;
        const menu = document.getElementById('customContextMenu');
        const isGroupMenu = String(targetType || '').startsWith('group-');
        placeMobileContextMenu(menu, event, isGroupMenu);
    };

    // If the viewport changes while a menu is open, close it rather than leave it stranded.
    const closeFloatingMenu = () => {
        if (!mobileMQ.matches) return;
        const menu = document.getElementById('customContextMenu');
        if (menu && menu.style.display !== 'none') menu.style.display = 'none';
    };

    window.addEventListener('orientationchange', closeFloatingMenu, { passive: true });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', closeFloatingMenu, { passive: true });
    }
})();


// ===== DESKTOP PRO 2026 =====
(function(){
const KEY='dashboardDesktopGroupView', mq=window.matchMedia('(min-width:769px)'); let selected=null;
function meta(t){return({link:['🔗','Links'],note:['📝','Notes'],schedule:['📆','Schedule'],kanban:['📌','Kanban']})[t]||['📁','Group']}
function count(g){if(!g)return 0;if(g.type==='link')return g.links?.length||0;if(g.type==='note')return g.notes?.length||0;if(g.type==='schedule')return g.schedules?.length||0;if(g.type==='kanban')return typeof getKanbanCardCount==='function'?getKanbanCardCount(g):(g.boards||[]).reduce((s,b)=>s+(b.cards?.length||0),0);return 0}
window.setDesktopGroupView=function(mode){mode=mode==='list'?'list':'grid';localStorage.setItem(KEY,mode);document.body.classList.toggle('desktop-list-view',mode==='list');document.getElementById('desktopGridViewBtn')?.classList.toggle('active',mode==='grid');document.getElementById('desktopListViewBtn')?.classList.toggle('active',mode==='list')};
window.openDesktopInspector=function(id){if(!mq.matches)return;const g=getGroup(id),box=document.getElementById('desktopInspectorBody'),title=document.getElementById('desktopInspectorTitle');if(!g||!box||!title)return;selected=id;const m=meta(g.type),tags=Array.isArray(g.tags)?g.tags:[],emoji=g.emoji&&g.emoji!=='NONE'?g.emoji:m[0];title.textContent=`${emoji} ${g.title||'Untitled'}`;box.innerHTML=`<div class="desktop-inspector-type">${m[0]} ${m[1]}</div><div class="desktop-inspector-stats"><div class="desktop-inspector-stat"><small>Items</small><strong>${count(g)}</strong></div><div class="desktop-inspector-stat"><small>Status</small><strong>${g.collapsed?'Collapsed':'Open'}</strong></div><div class="desktop-inspector-stat"><small>Favorite</small><strong>${g.favorite?'Yes':'No'}</strong></div><div class="desktop-inspector-stat"><small>Locked</small><strong>${g.pinKey&&g.isLocked?'Yes':'No'}</strong></div></div><small style="color:var(--text-sub);font-weight:800">TAGS</small><div class="desktop-inspector-tags" style="margin-top:8px">${tags.length?tags.map(x=>`<span class="desktop-inspector-tag">${escapeHTML(String(x))}</span>`).join(''):'<span class="desktop-inspector-tag">No tags</span>'}</div><div class="desktop-inspector-actions"><button class="btn-primary" onclick="openGroupModal('${g.id}','${g.type}')">✏️ Edit</button><button class="btn-secondary" onclick="toggleFavoriteGroup('${g.id}',event);refreshDesktopInspector()">⭐ Favorite</button><button class="btn-secondary wide" onclick="scrollToGroup('${g.id}')">◎ Focus group</button></div>`;document.body.classList.add('desktop-inspector-open');document.getElementById('desktopInspector')?.setAttribute('aria-hidden','false');document.querySelectorAll('.group-card').forEach(c=>c.classList.toggle('desktop-inspected',c.dataset.id===String(id)))};
window.refreshDesktopInspector=function(){if(selected)openDesktopInspector(selected)};
window.closeDesktopInspector=function(){selected=null;document.body.classList.remove('desktop-inspector-open');document.getElementById('desktopInspector')?.setAttribute('aria-hidden','true');document.querySelectorAll('.desktop-inspected').forEach(c=>c.classList.remove('desktop-inspected'))};
function enhance(){if(!mq.matches)return;document.querySelectorAll('#groupsContainer .group-card').forEach(card=>{const a=card.querySelector('.group-header-actions'),id=card.dataset.id;if(!a||!id||a.querySelector('.desktop-inspect-btn'))return;const b=document.createElement('button');b.type='button';b.className='desktop-inspect-btn';b.title='Open inspector';b.innerHTML='⋯';b.onclick=e=>{e.preventDefault();e.stopPropagation();openDesktopInspector(id)};a.insertBefore(b,a.firstChild)});if(selected)document.querySelector(`.group-card[data-id="${CSS.escape(String(selected))}"]`)?.classList.add('desktop-inspected')}
if(typeof renderDashboard==='function'){const old=renderDashboard;renderDashboard=function(){const r=old.apply(this,arguments);enhance();if(selected)refreshDesktopInspector();return r}}
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommandPalette()}else if(e.key==='Escape'&&document.body.classList.contains('desktop-inspector-open'))closeDesktopInspector()});
function sync(){if(!mq.matches){closeDesktopInspector();document.body.classList.remove('desktop-list-view');return}setDesktopGroupView(localStorage.getItem(KEY)||'grid');enhance()}
mq.addEventListener?.('change',sync);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();
// ===== MODAL + QUICK ACTIONS PRO 2026 =====
(function(){
  const compact = new Set(['alertModal','confirmModal','keyModal','calendarDayModal','noteLinkModal','noteTableModal']);
  const medium = new Set(['createGroupTypeModal','groupModal','linkModal','scheduleModal','readModal','todayImportantModal','backupModal']);
  const editor = new Set(['noteModal','noteDeadlineModal','noteIconModal','trashModal','calendarModal','sidebarPanelModal','commandPaletteModal','accountModal','adminUserDetailModal','kanbanCardModal']);
  const workspace = new Set(['adminConsoleModal','kanbanWorkspaceModal']);

  function classifyModal(id){
    const el=document.getElementById(id); if(!el) return;
    el.classList.remove('modal-compact','modal-medium','modal-editor','modal-workspace');
    if(compact.has(id)) el.classList.add('modal-compact');
    else if(workspace.has(id)) el.classList.add('modal-workspace');
    else if(editor.has(id)) el.classList.add('modal-editor');
    else if(medium.has(id)) el.classList.add('modal-medium');
    else el.classList.add('modal-medium');
  }

  if(typeof openModal!=='undefined'){
    const _openModal=openModal;
    openModal=function(id){classifyModal(id);return _openModal(id)};
  }

  document.querySelectorAll('.modal-overlay[id]').forEach(m=>classifyModal(m.id));

  // Add practical hover tools on desktop without changing mobile cards.
  function enhanceHoverTools(){
    if(!window.matchMedia('(min-width:769px)').matches) return;
    document.querySelectorAll('#groupsContainer .group-card').forEach(card=>{
      const id=card.dataset.id, actions=card.querySelector('.group-header-actions');
      if(!id||!actions||actions.querySelector('.desktop-hover-tools')) return;
      const g=typeof getGroup==='function'?getGroup(id):null; if(!g) return;
      const wrap=document.createElement('span'); wrap.className='desktop-hover-tools';
      const add=document.createElement('button'); add.type='button'; add.title='Quick add'; add.textContent='＋';
      add.onclick=e=>{e.preventDefault();e.stopPropagation(); if(g.type==='link') openLinkModal(id); else if(g.type==='note') openNoteModal(id); else if(g.type==='schedule') openScheduleModal(id); else if(g.type==='kanban') addKanbanBoard(id)};
      const edit=document.createElement('button'); edit.type='button'; edit.title='Edit group'; edit.textContent='✎';
      edit.onclick=e=>{e.preventDefault();e.stopPropagation();openGroupModal(id,g.type)};
      wrap.append(add,edit); actions.insertBefore(wrap,actions.firstChild);
    });
  }

  if(typeof renderDashboard==='function'){
    const _render=renderDashboard;
    renderDashboard=function(){const r=_render.apply(this,arguments);enhanceHoverTools();return r};
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enhanceHoverTools,{once:true}); else enhanceHoverTools();

  // Faster creation shortcut: Alt/Option + N.
  document.addEventListener('keydown',e=>{
    const active=document.activeElement;
    const typing=active&&(active.matches?.('input,textarea,select')||active.isContentEditable);
    if(!typing&&e.altKey&&e.key.toLowerCase()==='n'){
      e.preventDefault();
      if(typeof openCreateGroupTypeModal==='function') openCreateGroupTypeModal();
    }
  });

  // Turn existing trash toast into a true Undo toast.
  if(typeof showUndoToast==='function'){
    showUndoToast=function(label){
      const toast=document.getElementById('undoToast'); if(!toast) return;
      toast.innerHTML=`<span>Moved <b>${escapeHTML(label)}</b> to Trash.</span><span class="toast-actions"><button class="btn-primary" onclick="restoreLastTrashItem()">Undo</button><button class="btn-secondary" onclick="openTrashModal()">Trash</button></span>`;
      toast.style.display='flex';
      clearTimeout(window.__undoToastTimer);
      window.__undoToastTimer=setTimeout(()=>{toast.style.display='none'},7000);
    };
  }
})();


// ==========================================================================
// GROUP INSPECTOR PRO 2026
// Rich preview for Links / Notes / Schedule / Kanban
// ==========================================================================
(function initRichDesktopInspector() {
    const mq = window.matchMedia('(min-width: 769px)');
    const MAX_PREVIEW = 8;
    let activeGroupId = null;
    let activeQuery = '';

    function safeText(value) {
        return typeof escapeHTML === 'function' ? escapeHTML(String(value ?? '')) : String(value ?? '');
    }

    function stripHTML(value) {
        const el = document.createElement('div');
        el.innerHTML = value || '';
        return (el.textContent || el.innerText || '').replace(/\s+/g, ' ').trim();
    }

    function norm(value) {
        return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function matchesQuery(parts) {
        if (!activeQuery) return true;
        const haystack = norm(parts.filter(Boolean).join(' '));
        return haystack.includes(norm(activeQuery));
    }

    function getTypeMeta(type) {
        return ({
            link: ['🔗', 'Links'],
            note: ['📝', 'Notes'],
            schedule: ['📆', 'Schedule'],
            kanban: ['📌', 'Kanban']
        })[type] || ['📁', 'Group'];
    }

    function getCount(group) {
        if (!group) return 0;
        if (group.type === 'link') return group.links?.length || 0;
        if (group.type === 'note') return group.notes?.length || 0;
        if (group.type === 'schedule') return group.schedules?.length || 0;
        if (group.type === 'kanban' && typeof getKanbanCardCount === 'function') return getKanbanCardCount(group);
        return 0;
    }

    function hostname(url) {
        try {
            return new URL(url, location.href).hostname.replace(/^www\./, '');
        } catch {
            return String(url || '');
        }
    }

    function notePreview(note) {
        const rich = stripHTML(note?.content_html || '');
        return rich || String(note?.content || '').replace(/\s+/g, ' ').trim() || 'No preview';
    }

    function scheduleMeta(sch) {
        const date = sch?.date || 'No date';
        const time = sch?.time || '';
        const end = sch?.endDate && sch.endDate !== sch.date ? ` → ${sch.endDate}` : '';
        return `${date}${time ? ' · ' + time : ''}${end}`;
    }

    function renderLinkItems(group) {
        const all = (group.links || []).map((item, index) => ({ item, index }))
            .filter(({item}) => matchesQuery([item.name, item.url, ...(item.tags || [])]));
        const shown = all.slice(0, MAX_PREVIEW);

        if (!shown.length) return {
            html: `<div class="inspector-empty">${activeQuery ? 'No links match your search.' : 'This group has no links yet.'}</div>`,
            total: all.length
        };

        return {
            html: `<div class="inspector-content-list">${shown.map(({item, index}) => `
                <button class="inspector-item" type="button" data-inspector-action="open-link" data-index="${index}">
                    <span class="inspector-item-icon">${safeText(item.emoji && item.emoji !== 'NONE' ? item.emoji : '🌐')}</span>
                    <span class="inspector-item-main">
                        <span class="inspector-item-title">${safeText(item.name || 'Untitled link')}</span>
                        <span class="inspector-item-subtitle">${safeText(hostname(item.url))}</span>
                    </span>
                    <span class="inspector-item-arrow">↗</span>
                </button>`).join('')}</div>`,
            total: all.length
        };
    }

    function renderNoteItems(group) {
        const all = (group.notes || []).map((item, index) => ({ item, index }))
            .filter(({item}) => matchesQuery([item.title, notePreview(item), item.category, ...(item.tags || [])]));
        const shown = all.slice(0, MAX_PREVIEW);

        if (!shown.length) return {
            html: `<div class="inspector-empty">${activeQuery ? 'No notes match your search.' : 'This group has no notes yet.'}</div>`,
            total: all.length
        };

        return {
            html: `<div class="inspector-content-list">${shown.map(({item, index}) => `
                <button class="inspector-item" type="button" data-inspector-action="open-note" data-index="${index}">
                    <span class="inspector-item-icon">${safeText(item.emoji && item.emoji !== 'NONE' ? item.emoji : (item.pinned ? '📌' : '📝'))}</span>
                    <span class="inspector-item-main">
                        <span class="inspector-item-title">${safeText(item.title || 'Untitled note')}</span>
                        <span class="inspector-item-subtitle">${safeText(notePreview(item).slice(0, 110))}</span>
                    </span>
                    <span class="inspector-item-arrow">›</span>
                </button>`).join('')}</div>`,
            total: all.length
        };
    }

    function renderScheduleItems(group) {
        const all = (group.schedules || []).map((item, index) => ({ item, index }))
            .filter(({item}) => matchesQuery([item.title, item.content, item.date, item.time, ...(item.tags || [])]));
        const shown = all.slice(0, MAX_PREVIEW);

        if (!shown.length) return {
            html: `<div class="inspector-empty">${activeQuery ? 'No schedules match your search.' : 'This group has no schedules yet.'}</div>`,
            total: all.length
        };

        return {
            html: `<div class="inspector-content-list">${shown.map(({item, index}) => `
                <button class="inspector-item" type="button" data-inspector-action="open-schedule" data-index="${index}">
                    <span class="inspector-item-icon">${item.important ? '⚠️' : '📅'}</span>
                    <span class="inspector-item-main">
                        <span class="inspector-item-title">${safeText(item.title || 'Untitled schedule')}</span>
                        <span class="inspector-item-subtitle">${safeText(scheduleMeta(item))}</span>
                    </span>
                    <span class="inspector-item-arrow">›</span>
                </button>`).join('')}</div>`,
            total: all.length
        };
    }

    function getKanbanWorkspace(group) {
        try {
            if (typeof normalizeKanbanGroup === 'function') return normalizeKanbanGroup(group);
        } catch {}
        if (group?.kanban?.boards) return group.kanban;
        return { boards: [] };
    }

    function renderKanbanItems(group) {
        const workspace = getKanbanWorkspace(group);
        const all = (workspace.boards || []).filter(board => {
            const columns = board.columns || [];
            const cards = columns.flatMap(col => col.cards || []);
            return matchesQuery([
                board.title,
                ...columns.map(c => c.title),
                ...cards.flatMap(card => [card.title, card.content, card.description])
            ]);
        });
        const shown = all.slice(0, 5);

        if (!shown.length) return {
            html: `<div class="inspector-empty">${activeQuery ? 'No Kanban boards match your search.' : 'This Kanban group has no boards yet.'}</div>`,
            total: all.length
        };

        return {
            html: shown.map(board => {
                const columns = board.columns || [];
                const cardCount = columns.reduce((sum, col) => sum + (col.cards?.length || 0), 0);
                return `
                    <div class="inspector-kanban-board" role="button" tabindex="0"
                         data-inspector-action="open-board" data-board-id="${safeText(board.id)}">
                        <div class="inspector-board-head">
                            <span class="inspector-board-title">${safeText(board.title || 'Untitled board')}</span>
                            <span class="inspector-board-count">${cardCount} cards</span>
                        </div>
                        <div class="inspector-board-columns">
                            ${columns.slice(0, 5).map(col =>
                                `<span class="inspector-column-chip">${safeText(col.title || 'Column')} · ${col.cards?.length || 0}</span>`
                            ).join('')}
                            ${columns.length > 5 ? `<span class="inspector-column-chip">+${columns.length - 5} more</span>` : ''}
                        </div>
                    </div>`;
            }).join(''),
            total: all.length
        };
    }

    function getRenderedContent(group) {
        if (group.type === 'link') return renderLinkItems(group);
        if (group.type === 'note') return renderNoteItems(group);
        if (group.type === 'schedule') return renderScheduleItems(group);
        if (group.type === 'kanban') return renderKanbanItems(group);
        return { html: '<div class="inspector-empty">No preview is available for this group type.</div>', total: 0 };
    }

    function addLabel(group) {
        if (group.type === 'link') return '＋ Add link';
        if (group.type === 'note') return '＋ New note';
        if (group.type === 'schedule') return '＋ Add schedule';
        if (group.type === 'kanban') return '📌 Open workspace';
        return '＋ Add item';
    }

    function renderInspector() {
        if (!mq.matches || !activeGroupId) return;
        const group = typeof getGroup === 'function' ? getGroup(activeGroupId) : null;
        const box = document.getElementById('desktopInspectorBody');
        const title = document.getElementById('desktopInspectorTitle');
        if (!group || !box || !title) {
            window.closeDesktopInspector?.();
            return;
        }

        const meta = getTypeMeta(group.type);
        const emoji = group.emoji && group.emoji !== 'NONE' ? group.emoji : meta[0];
        const locked = !!(group.pinKey && group.isLocked);
        const tags = Array.isArray(group.tags) ? group.tags : [];
        const itemCount = getCount(group);

        title.textContent = `${emoji} ${group.title || 'Untitled'}`;

        const content = locked
            ? { html: `<div class="inspector-locked">🔒<br><strong>Content is locked</strong><br>Unlock this group on the dashboard to preview its items.</div>`, total: 0 }
            : getRenderedContent(group);

        box.innerHTML = `
            <div class="inspector-summary">
                <div class="inspector-summary-left">
                    <span class="desktop-inspector-type" style="margin:0">${meta[0]} ${meta[1]}</span>
                    <span class="inspector-count">${itemCount} item${itemCount === 1 ? '' : 's'}</span>
                </div>
                <div style="display:flex;gap:5px">
                    ${group.favorite ? '<span class="inspector-mini-badge">⭐ Favorite</span>' : ''}
                    ${locked ? '<span class="inspector-mini-badge">🔒 Locked</span>' : ''}
                </div>
            </div>

            ${!locked ? `
            <div class="inspector-search-wrap">
                <span class="inspector-search-icon">⌕</span>
                <input id="desktopInspectorSearch" class="inspector-search" type="search"
                       placeholder="Search in this group..." value="${safeText(activeQuery)}" autocomplete="off">
                ${activeQuery ? '<button class="inspector-search-clear" type="button" data-inspector-action="clear-search">✕</button>' : ''}
            </div>` : ''}

            ${tags.length ? `
            <div class="desktop-inspector-tags" style="margin-bottom:14px">
                ${tags.map(tag => `<span class="desktop-inspector-tag">${safeText(tag)}</span>`).join('')}
            </div>` : ''}

            <div class="inspector-section-label">
                <span>Content</span>
                ${!locked && activeQuery ? `<span>${content.total} found</span>` : ''}
            </div>

            <div id="desktopInspectorContent">${content.html}</div>

            ${!locked && content.total > MAX_PREVIEW ? `
                <button class="inspector-view-all" type="button" data-inspector-action="view-all">
                    View all ${content.total} →
                </button>` : ''}

            <div class="inspector-bottom-actions">
                <button class="btn-primary" type="button" data-inspector-action="add">${addLabel(group)}</button>
                <button class="btn-secondary" type="button" data-inspector-action="edit-group">✎ Edit group</button>
                <button class="btn-secondary wide" type="button" data-inspector-action="focus">◎ Focus on dashboard</button>
            </div>
        `;

        const search = document.getElementById('desktopInspectorSearch');
        if (search) {
            search.addEventListener('input', () => {
                activeQuery = search.value;
                renderInspector();
                const next = document.getElementById('desktopInspectorSearch');
                if (next) {
                    next.focus();
                    next.setSelectionRange(next.value.length, next.value.length);
                }
            });
        }

        box.onclick = handleInspectorClick;
        box.onkeydown = (event) => {
            if ((event.key === 'Enter' || event.key === ' ') && event.target?.matches?.('.inspector-kanban-board')) {
                event.preventDefault();
                event.target.click();
            }
        };
    }

    function handleInspectorClick(event) {
        const actionEl = event.target.closest('[data-inspector-action]');
        if (!actionEl) return;

        const group = typeof getGroup === 'function' ? getGroup(activeGroupId) : null;
        if (!group) return;

        const action = actionEl.dataset.inspectorAction;
        const index = Number(actionEl.dataset.index);

        if (action === 'clear-search') {
            activeQuery = '';
            renderInspector();
            document.getElementById('desktopInspectorSearch')?.focus();
            return;
        }

        if (action === 'open-link') {
            const item = group.links?.[index];
            if (item?.url) window.open(item.url, '_blank', 'noopener');
            return;
        }

        if (action === 'open-note') {
            if (typeof showContentDetail === 'function') showContentDetail(group.id, index, 'note');
            return;
        }

        if (action === 'open-schedule') {
            if (typeof showContentDetail === 'function') showContentDetail(group.id, index, 'schedule');
            return;
        }

        if (action === 'open-board') {
            if (typeof openKanbanWorkspace === 'function') {
                openKanbanWorkspace(group.id, actionEl.dataset.boardId || null);
            }
            return;
        }

        if (action === 'add') {
            if (group.type === 'kanban') {
                if (typeof openKanbanWorkspace === 'function') openKanbanWorkspace(group.id);
            } else if (typeof openItemModal === 'function') {
                openItemModal(group.type, group.id, false);
            }
            return;
        }

        if (action === 'edit-group') {
            if (typeof openGroupModal === 'function') openGroupModal(group.id, group.type);
            return;
        }

        if (action === 'focus' || action === 'view-all') {
            if (typeof scrollToGroup === 'function') scrollToGroup(group.id);
            return;
        }
    }

    // Replace the earlier shallow inspector with the rich inspector.
    window.openDesktopInspector = function(groupId) {
        if (!mq.matches) return;
        const group = typeof getGroup === 'function' ? getGroup(groupId) : null;
        if (!group) return;

        if (String(activeGroupId) !== String(groupId)) activeQuery = '';
        activeGroupId = groupId;

        document.body.classList.add('desktop-inspector-open');
        document.getElementById('desktopInspector')?.setAttribute('aria-hidden', 'false');
        document.querySelectorAll('.group-card').forEach(card => {
            card.classList.toggle('desktop-inspected', card.dataset.id === String(groupId));
        });
        renderInspector();
    };

    window.refreshDesktopInspector = function() {
        if (activeGroupId) renderInspector();
    };

    const previousClose = window.closeDesktopInspector;
    window.closeDesktopInspector = function() {
        activeGroupId = null;
        activeQuery = '';
        document.body.classList.remove('desktop-inspector-open');
        document.getElementById('desktopInspector')?.setAttribute('aria-hidden', 'true');
        document.querySelectorAll('.group-card.desktop-inspected').forEach(card => card.classList.remove('desktop-inspected'));
        if (typeof previousClose === 'function') {
            try { previousClose(); } catch {}
        }
    };

    // Refresh the inspector after any dashboard render/data update.
    if (typeof renderDashboard === 'function') {
        const previousRender = renderDashboard;
        renderDashboard = function() {
            const result = previousRender.apply(this, arguments);
            if (activeGroupId) {
                requestAnimationFrame(() => {
                    const exists = typeof getGroup === 'function' && getGroup(activeGroupId);
                    if (exists) {
                        document.querySelector(`.group-card[data-id="${CSS.escape(String(activeGroupId))}"]`)?.classList.add('desktop-inspected');
                        renderInspector();
                    } else {
                        window.closeDesktopInspector();
                    }
                });
            }
            return result;
        };
    }
})();


// ==========================================================================
// GROUP HEADER SOFT 2026 — TITLE TOOLTIP
// ==========================================================================
(function initSoftGroupHeaderTitles() {
    function syncTitles() {
        document.querySelectorAll('#groupsContainer .group-card').forEach(card => {
            const titleEl =
                card.querySelector('.group-title-text') ||
                card.querySelector('.group-name') ||
                card.querySelector('.group-title') ||
                card.querySelector('.group-header h3') ||
                card.querySelector('.group-header h2');

            if (!titleEl) return;
            const full = (titleEl.textContent || '').replace(/\s+/g, ' ').trim();
            if (full) titleEl.setAttribute('title', full);
        });
    }

    if (typeof renderDashboard === 'function') {
        const previous = renderDashboard;
        renderDashboard = function() {
            const result = previous.apply(this, arguments);
            requestAnimationFrame(syncTitles);
            return result;
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncTitles, { once: true });
    } else {
        syncTitles();
    }
})();


// ==========================================================================
// GROUP HEADER CLEAN 2026
// Remove injected Quick Add/Edit controls and normalize group type labels.
// ==========================================================================
(function initCleanGroupHeaders() {
    const typeLabels = {
        link: 'Links',
        note: 'Notes',
        schedule: 'Schedule',
        kanban: 'Kanban',
        folder: 'Folder',
        image: 'Images'
    };

    function humanizeType(value) {
        const raw = String(value || '').trim();
        if (!raw) return 'Group';
        if (typeLabels[raw]) return typeLabels[raw];
        return raw
            .replace(/[-_]+/g, ' ')
            .replace(/\b\w/g, ch => ch.toUpperCase());
    }

    function cleanGroupHeaders() {
        document.querySelectorAll('#groupsContainer .group-card').forEach(card => {
            // Remove the two hover controls injected by the previous workspace enhancement.
            card.querySelectorAll('.desktop-hover-tools').forEach(el => el.remove());

            // Keep and normalize the type badge instead of allowing "undefined".
            const tag = card.querySelector('.group-header-actions .group-tag');
            if (tag) {
                let type = '';
                for (const cls of tag.classList) {
                    if (cls.startsWith('tag-')) {
                        type = cls.slice(4);
                        break;
                    }
                }

                const current = (tag.textContent || '').trim();
                if (!current || /^undefined$/i.test(current) || /^null$/i.test(current)) {
                    tag.textContent = humanizeType(type);
                }
            }
        });
    }

    // Run after all previous render wrappers so injected controls are removed every time.
    if (typeof renderDashboard === 'function') {
        const previousRenderDashboardClean = renderDashboard;
        renderDashboard = function() {
            const result = previousRenderDashboardClean.apply(this, arguments);
            requestAnimationFrame(cleanGroupHeaders);
            return result;
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            requestAnimationFrame(cleanGroupHeaders);
        }, { once: true });
    } else {
        requestAnimationFrame(cleanGroupHeaders);
    }
})();

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

                applyDrivePayload(cloudData);

                state.dashboardData.forEach(group => {
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
            #driveAutoSaveIndicator{
                position:fixed;right:18px;bottom:18px;z-index:12000;
                display:flex;align-items:center;gap:8px;
                min-height:34px;padding:7px 11px;border-radius:999px;
                border:1px solid color-mix(in srgb, currentColor 16%, transparent);
                background:color-mix(in srgb, var(--bg-primary, #fff) 92%, transparent);
                color:var(--text-primary, #1f2937);
                box-shadow:0 8px 26px rgba(0,0,0,.12);
                backdrop-filter:blur(12px);
                font-size:12px;font-weight:700;line-height:1;
                opacity:.94;transition:.18s ease;
                pointer-events:none;
            }
            #driveAutoSaveIndicator[data-state="saved"]{opacity:.72}
            #driveAutoSaveIndicator[data-state="saving"] .drive-save-dot{animation:driveSavePulse .8s infinite alternate}
            #driveAutoSaveIndicator[data-state="offline"] .drive-save-dot,
            #driveAutoSaveIndicator[data-state="error"] .drive-save-dot{opacity:.9}
            .drive-save-dot{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.65}
            @keyframes driveSavePulse{from{transform:scale(.75);opacity:.35}to{transform:scale(1.2);opacity:1}}
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
                #driveAutoSaveIndicator{right:10px;bottom:10px;max-width:calc(100vw - 20px)}
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
            el.innerHTML = `<span class="drive-save-dot"></span><span id="driveAutoSaveIndicatorText">Local cache ready</span>`;
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
        el.dataset.state = stateName;
        const textEl = document.getElementById('driveAutoSaveIndicatorText');
        if (textEl) textEl.textContent = text;
        clearTimeout(statusResetTimer);

        if (!sticky && ['saved', 'merged'].includes(stateName)) {
            statusResetTimer = setTimeout(() => {
                if (!navigator.onLine) {
                    setSaveStatus('offline', 'Offline · changes stay on this device', {sticky:true});
                } else if (__driveAutoSyncReady) {
                    const target = document.getElementById('driveAutoSaveIndicator');
                    const targetText = document.getElementById('driveAutoSaveIndicatorText');
                    if (target) target.dataset.state = 'saved';
                    if (targetText) targetText.textContent = lastSavedAt
                        ? `Saved to Drive ✓ · ${formatClock(lastSavedAt)}`
                        : 'Auto-save active ✓';
                }
            }, 2600);
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

            setSaveStatus('saved', `Saved to Drive ✓ · ${formatClock(lastSavedAt)}`);
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
            /* V2 save badge remains functional internally, but is intentionally invisible. */
            #driveAutoSaveIndicator{
                display:none !important;
            }

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

        let actions = document.getElementById('accountAvatarActionsV3');
        if (!actions) {
            actions = document.createElement('div');
            actions.id = 'accountAvatarActionsV3';
            actions.className = 'account-avatar-actions-v3';
            actions.innerHTML = `
                <button type="button" class="btn-secondary" id="accountAvatarChangeV3">✏️ Change avatar</button>
                <button type="button" class="btn-secondary" id="accountAvatarResetV3">↩ Use Google photo</button>
                <p class="account-avatar-note-v3">Your custom avatar is resized to 256×256 before being saved.</p>
            `;

            const infoArea =
                document.querySelector('#accountModal .account-profile') ||
                document.querySelector('#accountModal .account-identity') ||
                wrap.parentElement;

            if (infoArea) infoArea.appendChild(actions);
            else wrap.insertAdjacentElement('afterend', actions);

            document.getElementById('accountAvatarChangeV3')?.addEventListener('click', chooseCustomAvatarV3);
            document.getElementById('accountAvatarResetV3')?.addEventListener('click', resetCustomAvatarV3);
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

    // V2 can create the hidden status node. Remove any cached/old instance visually and
    // keep it hidden even when older CSS is cached.
    function removeVisibleFloatingSaveBadgeV3() {
        injectV3Styles();
        const badge = document.getElementById('driveAutoSaveIndicator');
        if (badge) {
            badge.style.setProperty('display', 'none', 'important');
            badge.setAttribute('aria-hidden', 'true');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        removeVisibleFloatingSaveBadgeV3();
        ensureAvatarControlsV3();
        applyEffectiveAvatarToUI();
        refreshCurrentAccountSaveState();

        // Leave the existing "Ctrl + K Quick Find" element untouched.
    });

    window.addEventListener('load', () => {
        removeVisibleFloatingSaveBadgeV3();

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
            removeVisibleFloatingSaveBadgeV3();
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
// ============================================================================

(function initAvatarOnlyAccountButtonV4() {
    if (window.__AVATAR_ONLY_ACCOUNT_BUTTON_V4_READY__) return;
    window.__AVATAR_ONLY_ACCOUNT_BUTTON_V4_READY__ = true;

    function injectAvatarButtonStylesV4() {
        if (document.getElementById('avatarOnlyAccountButtonV4Styles')) return;

        const style = document.createElement('style');
        style.id = 'avatarOnlyAccountButtonV4Styles';
        style.textContent = `
            #btn-login-google.avatar-only-account-v4{
                width:36px !important;
                min-width:36px !important;
                height:36px !important;
                min-height:36px !important;
                padding:0 !important;
                border-radius:50% !important;
                display:inline-grid !important;
                place-items:center !important;
                overflow:hidden !important;
                flex:0 0 36px !important;
                gap:0 !important;
                line-height:1 !important;
            }

            #btn-login-google.avatar-only-account-v4 img{
                width:100% !important;
                height:100% !important;
                object-fit:cover !important;
                border-radius:50% !important;
                display:block !important;
                border:0 !important;
                margin:0 !important;
                padding:0 !important;
            }

            #btn-login-google.avatar-only-account-v4 .account-avatar-fallback-v4{
                width:100%;
                height:100%;
                display:grid;
                place-items:center;
                border-radius:50%;
                font-size:13px;
                font-weight:800;
                background:color-mix(in srgb, currentColor 10%, transparent);
            }

            #btn-login-google.avatar-only-account-v4 .account-toolbar-name-v2,
            #btn-login-google.avatar-only-account-v4 > span:not(.account-avatar-fallback-v4){
                display:none !important;
            }
        `;
        document.head.appendChild(style);
    }

    function getEffectiveToolbarAvatarV4() {
        try {
            if (typeof getCustomAvatar === 'function') {
                const custom = getCustomAvatar();
                if (custom) return custom;
            }
        } catch (_) {}

        return googleAccountProfile?.picture || '';
    }

    function renderAvatarOnlyAccountButtonV4() {
        injectAvatarButtonStylesV4();

        const btn = document.getElementById('btn-login-google');
        if (!btn) return;

        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();

        if (!connected) {
            btn.classList.remove('avatar-only-account-v4');
            return;
        }

        btn.classList.add('avatar-only-account-v4');
        btn.title = googleAccountProfile?.email
            ? `Current account: ${googleAccountProfile.email}`
            : 'Current account';
        btn.setAttribute('aria-label', btn.title);

        const avatarUrl = getEffectiveToolbarAvatarV4();

        if (avatarUrl) {
            btn.innerHTML = `<img src="${escapeHTML(avatarUrl)}" alt="Current account">`;
        } else {
            const label = googleAccountProfile?.name || googleAccountProfile?.email || 'G';
            const initial = String(label).trim().charAt(0).toUpperCase() || 'G';
            btn.innerHTML = `<span class="account-avatar-fallback-v4">${escapeHTML(initial)}</span>`;
        }
    }

    // Re-apply after the base account UI refreshes.
    const updateGoogleAccountUIV4 = updateGoogleAccountUI;
    updateGoogleAccountUI = function() {
        const result = updateGoogleAccountUIV4.apply(this, arguments);
        setTimeout(renderAvatarOnlyAccountButtonV4, 0);
        return result;
    };

    // Re-apply after opening Current account as well.
    const openAccountPanelV4 = openAccountPanel;
    openAccountPanel = function() {
        const result = openAccountPanelV4.apply(this, arguments);
        setTimeout(renderAvatarOnlyAccountButtonV4, 0);
        return result;
    };

    // V3 exposes these helpers. Wrap them so the toolbar avatar changes immediately.
    if (typeof window.changeAccountAvatar === 'function') {
        const changeAvatarV4 = window.changeAccountAvatar;
        window.changeAccountAvatar = async function() {
            const result = await changeAvatarV4.apply(this, arguments);
            setTimeout(renderAvatarOnlyAccountButtonV4, 50);
            return result;
        };
    }

    if (typeof window.resetAccountAvatarToGoogle === 'function') {
        const resetAvatarV4 = window.resetAccountAvatarToGoogle;
        window.resetAccountAvatarToGoogle = function() {
            const result = resetAvatarV4.apply(this, arguments);
            setTimeout(renderAvatarOnlyAccountButtonV4, 0);
            return result;
        };
    }

    // Also watch the avatar shown inside the account modal.
    // When V3 replaces its src after a file is selected, mirror that change to the toolbar.
    function observeAccountAvatarV4() {
        const avatar = document.getElementById('accountAvatar');
        if (!avatar || avatar.__avatarObserverV4) return;

        avatar.__avatarObserverV4 = true;

        const observer = new MutationObserver(() => {
            renderAvatarOnlyAccountButtonV4();
        });

        observer.observe(avatar, {
            attributes:true,
            attributeFilter:['src','style']
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        injectAvatarButtonStylesV4();
        observeAccountAvatarV4();
        setTimeout(renderAvatarOnlyAccountButtonV4, 0);
    });

    window.addEventListener('load', () => {
        let tries = 0;

        const timer = setInterval(() => {
            tries++;
            observeAccountAvatarV4();
            renderAvatarOnlyAccountButtonV4();

            if (
                (typeof isGoogleConnected === 'function' && isGoogleConnected()) ||
                tries >= 40
            ) {
                clearInterval(timer);
            }
        }, 250);
    });

    window.addEventListener('storage', event => {
        if (String(event.key || '').startsWith('workspace_custom_avatar_v')) {
            setTimeout(renderAvatarOnlyAccountButtonV4, 0);
        }
    });

    // Public refresh helper for troubleshooting.
    window.refreshAccountAvatarButton = renderAvatarOnlyAccountButtonV4;
})();
// ============================================================================
// AUTO DRIVE SAVE V5 — PROFESSIONAL HEADER PROFILE BUTTON
// Fixes:
// - Custom avatar on Current account always mirrors to the header button
// - Moves Account out of the Export/Import toolbar into the hero header, beside date
// - Professional circular profile control with status dot + hover/focus states
// - Uses the actually displayed Current account avatar as the first source of truth
// ============================================================================

(function initProfessionalHeaderProfileV5() {
    if (window.__PRO_HEADER_PROFILE_V5_READY__) return;
    window.__PRO_HEADER_PROFILE_V5_READY__ = true;

    const CUSTOM_AVATAR_PREFIX = 'workspace_custom_avatar_v1_';

    function injectProfileHeaderStylesV5() {
        if (document.getElementById('profileHeaderV5Styles')) return;

        const style = document.createElement('style');
        style.id = 'profileHeaderV5Styles';
        style.textContent = `
            .hero-meta-v12.profile-meta-v5{
                display:flex !important;
                align-items:center !important;
                justify-content:flex-end !important;
                gap:12px !important;
            }

            #btn-login-google.profile-header-btn-v5{
                position:relative !important;
                width:40px !important;
                min-width:40px !important;
                height:40px !important;
                min-height:40px !important;
                padding:0 !important;
                margin:0 !important;
                display:grid !important;
                place-items:center !important;
                flex:0 0 40px !important;
                border-radius:50% !important;
                overflow:visible !important;
                border:1px solid color-mix(in srgb, currentColor 14%, transparent) !important;
                background:color-mix(in srgb, var(--bg-primary, #fff) 92%, transparent) !important;
                box-shadow:
                    0 1px 2px rgba(0,0,0,.05),
                    0 4px 14px rgba(0,0,0,.08) !important;
                transition:
                    transform .16s ease,
                    box-shadow .16s ease,
                    border-color .16s ease !important;
                cursor:pointer !important;
            }

            #btn-login-google.profile-header-btn-v5:hover{
                transform:translateY(-1px) !important;
                border-color:color-mix(in srgb, currentColor 24%, transparent) !important;
                box-shadow:
                    0 2px 4px rgba(0,0,0,.06),
                    0 8px 20px rgba(0,0,0,.12) !important;
            }

            #btn-login-google.profile-header-btn-v5:active{
                transform:translateY(0) scale(.97) !important;
            }

            #btn-login-google.profile-header-btn-v5:focus-visible{
                outline:3px solid color-mix(in srgb, currentColor 16%, transparent) !important;
                outline-offset:3px !important;
            }

            #btn-login-google.profile-header-btn-v5 .profile-avatar-v5{
                width:34px !important;
                height:34px !important;
                display:block !important;
                border-radius:50% !important;
                object-fit:cover !important;
                border:0 !important;
                padding:0 !important;
                margin:0 !important;
                pointer-events:none !important;
            }

            #btn-login-google.profile-header-btn-v5 .profile-fallback-v5{
                width:34px !important;
                height:34px !important;
                border-radius:50% !important;
                display:grid !important;
                place-items:center !important;
                font-size:12px !important;
                font-weight:800 !important;
                letter-spacing:.01em !important;
                pointer-events:none !important;
                background:color-mix(in srgb, currentColor 9%, transparent) !important;
            }

            #btn-login-google.profile-header-btn-v5 .profile-status-v5{
                position:absolute !important;
                right:-1px !important;
                bottom:-1px !important;
                width:11px !important;
                height:11px !important;
                border-radius:50% !important;
                border:2px solid var(--bg-primary, #fff) !important;
                background:#22c55e !important;
                box-shadow:0 1px 4px rgba(0,0,0,.18) !important;
                pointer-events:none !important;
            }

            #btn-login-google.profile-header-btn-v5.profile-offline-v5 .profile-status-v5{
                background:#f59e0b !important;
            }

            #btn-login-google.profile-header-btn-v5.profile-disconnected-v5 .profile-status-v5{
                display:none !important;
            }

            /* V4 rules are intentionally superseded here. */
            #btn-login-google.profile-header-btn-v5 .account-toolbar-name-v2,
            #btn-login-google.profile-header-btn-v5 .account-toolbar-avatar-v2,
            #btn-login-google.profile-header-btn-v5 .account-avatar-fallback-v4{
                display:none !important;
            }

            @media (max-width:700px){
                .hero-meta-v12.profile-meta-v5{
                    gap:9px !important;
                }

                #btn-login-google.profile-header-btn-v5{
                    width:38px !important;
                    min-width:38px !important;
                    height:38px !important;
                    min-height:38px !important;
                    flex-basis:38px !important;
                }

                #btn-login-google.profile-header-btn-v5 .profile-avatar-v5,
                #btn-login-google.profile-header-btn-v5 .profile-fallback-v5{
                    width:32px !important;
                    height:32px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function profileIdentityKeyV5() {
        return String(
            googleAccountProfile?.id ||
            googleAccountProfile?.email ||
            'default'
        ).toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
    }

    function readCustomAvatarDirectV5() {
        // Exact key used by V3.
        try {
            const exact = localStorage.getItem(CUSTOM_AVATAR_PREFIX + profileIdentityKeyV5());
            if (exact) return exact;
        } catch (_) {}

        // Fallback for an account profile whose id/email became available later than avatar setup.
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CUSTOM_AVATAR_PREFIX)) keys.push(key);
            }

            if (keys.length === 1) {
                return localStorage.getItem(keys[0]) || '';
            }
        } catch (_) {}

        return '';
    }

    function displayedAccountAvatarV5() {
        const modalAvatar = document.getElementById('accountAvatar');
        if (
            modalAvatar &&
            modalAvatar.style.display !== 'none' &&
            modalAvatar.getAttribute('src')
        ) {
            return modalAvatar.getAttribute('src');
        }

        return '';
    }

    function currentProfileAvatarV5() {
        // 1. Avatar actually rendered in Current account.
        const displayed = displayedAccountAvatarV5();
        if (displayed) return displayed;

        // 2. Custom avatar stored by V3.
        const custom = readCustomAvatarDirectV5();
        if (custom) return custom;

        // 3. Google profile photo.
        return googleAccountProfile?.picture || '';
    }

    function moveAccountButtonToHeaderV5() {
        injectProfileHeaderStylesV5();

        const btn = document.getElementById('btn-login-google');
        const heroMeta = document.querySelector('.hero-meta-v12');
        if (!btn || !heroMeta) return false;

        heroMeta.classList.add('profile-meta-v5');

        // Keep date first, avatar second.
        if (btn.parentElement !== heroMeta) {
            heroMeta.appendChild(btn);
        } else if (heroMeta.lastElementChild !== btn) {
            heroMeta.appendChild(btn);
        }

        btn.classList.remove('avatar-only-account-v4', 'account-connected-v2');
        btn.classList.add('profile-header-btn-v5');

        return true;
    }

    function renderProfessionalProfileV5() {
        if (!moveAccountButtonToHeaderV5()) return;

        const btn = document.getElementById('btn-login-google');
        if (!btn) return;

        const connected =
            typeof isGoogleConnected === 'function' &&
            isGoogleConnected();

        const avatar = connected ? currentProfileAvatarV5() : '';
        const label =
            googleAccountProfile?.name ||
            googleAccountProfile?.email ||
            'Account';

        btn.classList.toggle('profile-offline-v5', connected && !navigator.onLine);
        btn.classList.toggle('profile-disconnected-v5', !connected);

        btn.title = connected
            ? `${label}${googleAccountProfile?.email && googleAccountProfile.email !== label ? ` · ${googleAccountProfile.email}` : ''}`
            : 'Connect Google account';

        btn.setAttribute(
            'aria-label',
            connected ? `Current account: ${label}` : 'Connect Google account'
        );

        if (connected && avatar) {
            btn.innerHTML = `
                <img class="profile-avatar-v5" src="${escapeHTML(avatar)}" alt="">
                <span class="profile-status-v5" aria-hidden="true"></span>
            `;
            return;
        }

        if (connected) {
            const initial = String(label).trim().charAt(0).toUpperCase() || 'G';
            btn.innerHTML = `
                <span class="profile-fallback-v5">${escapeHTML(initial)}</span>
                <span class="profile-status-v5" aria-hidden="true"></span>
            `;
            return;
        }

        btn.innerHTML = `
            <span class="profile-fallback-v5">👤</span>
            <span class="profile-status-v5" aria-hidden="true"></span>
        `;
    }

    function installAvatarMirrorObserverV5() {
        const avatar = document.getElementById('accountAvatar');
        if (!avatar || avatar.__profileMirrorObserverV5) return;

        avatar.__profileMirrorObserverV5 = true;

        const observer = new MutationObserver(() => {
            // MutationObserver runs after V3 has already put the new avatar into Current account.
            // Therefore the header mirrors the exact same src instead of recomputing from Google.
            requestAnimationFrame(renderProfessionalProfileV5);
        });

        observer.observe(avatar, {
            attributes:true,
            attributeFilter:['src', 'style', 'class']
        });
    }

    function installAvatarStorageMirrorV5() {
        window.addEventListener('storage', event => {
            if (!event.key || !event.key.startsWith(CUSTOM_AVATAR_PREFIX)) return;
            requestAnimationFrame(renderProfessionalProfileV5);
        });
    }

    // Base account rendering can overwrite the button repeatedly.
    // V5 always gets the last render.
    const updateGoogleAccountUIV5 = updateGoogleAccountUI;
    updateGoogleAccountUI = function() {
        const result = updateGoogleAccountUIV5.apply(this, arguments);

        setTimeout(() => {
            installAvatarMirrorObserverV5();
            renderProfessionalProfileV5();
        }, 0);

        return result;
    };

    const openAccountPanelV5 = openAccountPanel;
    openAccountPanel = function() {
        const result = openAccountPanelV5.apply(this, arguments);

        setTimeout(() => {
            installAvatarMirrorObserverV5();
            renderProfessionalProfileV5();
        }, 0);

        return result;
    };

    // V3's avatar buttons call local helper functions directly, so wrapping the public helper
    // isn't enough. The observer above catches the actual <img src> mutation. As a second
    // guarantee, watch clicks in the account avatar action area and refresh shortly afterward.
    document.addEventListener('change', event => {
        if (event.target?.id === 'accountAvatarFileV3') {
            setTimeout(renderProfessionalProfileV5, 50);
            setTimeout(renderProfessionalProfileV5, 250);
            setTimeout(renderProfessionalProfileV5, 700);
        }
    });

    document.addEventListener('click', event => {
        const target = event.target?.closest?.(
            '#accountAvatarChangeV3, #accountAvatarEditBubbleV3, #accountAvatarResetV3'
        );

        if (!target) return;

        setTimeout(renderProfessionalProfileV5, 50);
        setTimeout(renderProfessionalProfileV5, 300);
    });

    window.addEventListener('online', () => {
        setTimeout(renderProfessionalProfileV5, 0);
    });

    window.addEventListener('offline', () => {
        setTimeout(renderProfessionalProfileV5, 0);
    });

    document.addEventListener('DOMContentLoaded', () => {
        injectProfileHeaderStylesV5();
        moveAccountButtonToHeaderV5();
        installAvatarMirrorObserverV5();
        renderProfessionalProfileV5();
    });

    window.addEventListener('load', () => {
        let attempts = 0;

        const timer = setInterval(() => {
            attempts++;
            moveAccountButtonToHeaderV5();
            installAvatarMirrorObserverV5();
            renderProfessionalProfileV5();

            if (
                (
                    typeof isGoogleConnected === 'function' &&
                    isGoogleConnected() &&
                    googleAccountProfile
                ) ||
                attempts >= 40
            ) {
                clearInterval(timer);
            }
        }, 250);
    });

    // Public helper for manual testing:
    // refreshHeaderProfileAvatar()
    window.refreshHeaderProfileAvatar = renderProfessionalProfileV5;
})();
// ============================================================================
// UI FIX V6
// 1) Remove the redundant "Change avatar" button; pencil overlay remains.
// 2) Repair Note checklist layout so checkbox + text stay on one row.
// ============================================================================

(function initWorkspaceUIFixV6() {
    if (window.__WORKSPACE_UI_FIX_V6_READY__) return;
    window.__WORKSPACE_UI_FIX_V6_READY__ = true;

    function injectUIFixV6Styles() {
        if (document.getElementById('workspaceUIFixV6Styles')) return;

        const style = document.createElement('style');
        style.id = 'workspaceUIFixV6Styles';
        style.textContent = `
            /* ---------------------------------------------------------------
               Account avatar
               --------------------------------------------------------------- */
            #accountAvatarChangeV3{
                display:none !important;
            }

            /* With the redundant button removed, keep Reset neatly beside avatar. */
            #accountAvatarActionsV3{
                margin-top:10px !important;
            }

            /* ---------------------------------------------------------------
               Note checklist repair
               The old/global label/input rules can force the checkbox and text
               onto separate lines. These rules intentionally have high specificity.
               --------------------------------------------------------------- */

            .note-checklist,
            .checklist-items,
            .checklist-list,
            [class*="checklist"]{
                box-sizing:border-box;
            }

            .note-checklist .checklist-item,
            .checklist-items .checklist-item,
            .checklist-list .checklist-item,
            .note-checklist-item,
            [class*="checklist"] > label,
            [class*="checklist"] .checklist-row{
                display:flex !important;
                flex-direction:row !important;
                align-items:center !important;
                justify-content:flex-start !important;
                gap:10px !important;
                width:100% !important;
                min-width:0 !important;
                margin:0 !important;
                padding:5px 0 !important;
                line-height:1.35 !important;
                box-sizing:border-box !important;
            }

            .note-checklist input[type="checkbox"],
            .checklist-items input[type="checkbox"],
            .checklist-list input[type="checkbox"],
            .note-checklist-item input[type="checkbox"],
            [class*="checklist"] input[type="checkbox"]{
                appearance:auto !important;
                -webkit-appearance:checkbox !important;
                display:inline-block !important;
                position:static !important;
                float:none !important;
                flex:0 0 auto !important;
                width:17px !important;
                min-width:17px !important;
                max-width:17px !important;
                height:17px !important;
                min-height:17px !important;
                max-height:17px !important;
                margin:0 !important;
                padding:0 !important;
                vertical-align:middle !important;
                transform:none !important;
            }

            .note-checklist .checklist-item span,
            .checklist-items .checklist-item span,
            .checklist-list .checklist-item span,
            .note-checklist-item span,
            [class*="checklist"] .checklist-row span,
            [class*="checklist"] > label > span{
                display:block !important;
                flex:1 1 auto !important;
                min-width:0 !important;
                width:auto !important;
                margin:0 !important;
                padding:0 !important;
                white-space:normal !important;
                overflow-wrap:anywhere !important;
                line-height:1.4 !important;
            }

            /* Common structure: <label><input><span/text></label> */
            [class*="checklist"] label:has(> input[type="checkbox"]){
                display:flex !important;
                flex-direction:row !important;
                align-items:center !important;
                gap:10px !important;
                width:100% !important;
                margin:0 !important;
                padding:5px 0 !important;
            }

            /* Common structure: <div><input><label>Text</label></div> */
            [class*="checklist"] div:has(> input[type="checkbox"]){
                display:flex !important;
                flex-direction:row !important;
                align-items:center !important;
                justify-content:flex-start !important;
                gap:10px !important;
                width:100% !important;
                min-width:0 !important;
            }

            [class*="checklist"] div:has(> input[type="checkbox"]) > label{
                display:block !important;
                flex:1 1 auto !important;
                width:auto !important;
                min-width:0 !important;
                margin:0 !important;
                padding:0 !important;
                line-height:1.4 !important;
            }

            [class*="checklist"] input[type="checkbox"]:checked + span,
            [class*="checklist"] input[type="checkbox"]:checked + label{
                opacity:.62;
                text-decoration:line-through;
            }
        `;

        document.head.appendChild(style);
    }

    function removeRedundantAvatarButtonV6() {
        const button = document.getElementById('accountAvatarChangeV3');
        if (button) button.remove();

        // The pencil overlay is the only control for selecting a new avatar.
        const pencil = document.getElementById('accountAvatarEditBubbleV3');
        if (pencil) {
            pencil.title = 'Change avatar';
            pencil.setAttribute('aria-label', 'Change avatar');
        }
    }

    function repairChecklistDOMV6(root = document) {
        // Normalize checklist rows that were rendered with checkbox/text as block children.
        const checkboxes = root.querySelectorAll?.(
            '.note-checklist input[type="checkbox"], ' +
            '.checklist-items input[type="checkbox"], ' +
            '.checklist-list input[type="checkbox"], ' +
            '.note-checklist-item input[type="checkbox"], ' +
            '[class*="checklist"] input[type="checkbox"]'
        ) || [];

        checkboxes.forEach(cb => {
            const parent = cb.parentElement;
            if (!parent) return;

            // Do not change event handlers or data attributes; only normalize layout.
            parent.style.setProperty('display', 'flex', 'important');
            parent.style.setProperty('flex-direction', 'row', 'important');
            parent.style.setProperty('align-items', 'center', 'important');
            parent.style.setProperty('justify-content', 'flex-start', 'important');
            parent.style.setProperty('gap', '10px', 'important');
            parent.style.setProperty('width', '100%', 'important');
            parent.style.setProperty('min-width', '0', 'important');

            cb.style.setProperty('display', 'inline-block', 'important');
            cb.style.setProperty('position', 'static', 'important');
            cb.style.setProperty('flex', '0 0 17px', 'important');
            cb.style.setProperty('width', '17px', 'important');
            cb.style.setProperty('height', '17px', 'important');
            cb.style.setProperty('margin', '0', 'important');

            // If text is wrapped in a label/span, explicitly prevent the global form CSS
            // from making it full-width below the checkbox.
            Array.from(parent.children).forEach(child => {
                if (child === cb) return;
                if (child.matches?.('label, span, p, div')) {
                    child.style.setProperty('flex', '1 1 auto', 'important');
                    child.style.setProperty('width', 'auto', 'important');
                    child.style.setProperty('min-width', '0', 'important');
                    child.style.setProperty('margin', '0', 'important');
                }
            });
        });
    }

    function applyUIFixesV6(root = document) {
        injectUIFixV6Styles();
        removeRedundantAvatarButtonV6();
        repairChecklistDOMV6(root);
    }

    document.addEventListener('DOMContentLoaded', () => {
        applyUIFixesV6();

        // Notes/checklists can be re-rendered dynamically. Observe only added nodes and
        // normalize them without touching checklist data or click/change handlers.
        const observer = new MutationObserver(mutations => {
            let needsAvatarCleanup = false;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (!(node instanceof Element)) return;

                    if (
                        node.id === 'accountAvatarChangeV3' ||
                        node.querySelector?.('#accountAvatarChangeV3')
                    ) {
                        needsAvatarCleanup = true;
                    }

                    if (
                        node.matches?.('[class*="checklist"], input[type="checkbox"]') ||
                        node.querySelector?.('[class*="checklist"] input[type="checkbox"]')
                    ) {
                        repairChecklistDOMV6(node.matches?.('[class*="checklist"]') ? node : document);
                    }
                });
            });

            if (needsAvatarCleanup) removeRedundantAvatarButtonV6();
        });

        observer.observe(document.body, {
            childList:true,
            subtree:true
        });
    });

    window.addEventListener('load', () => {
        applyUIFixesV6();
        setTimeout(applyUIFixesV6, 250);
        setTimeout(applyUIFixesV6, 800);
    });

    // Account modal may reconstruct its controls whenever opened.
    const openAccountPanelV6 = openAccountPanel;
    openAccountPanel = function() {
        const result = openAccountPanelV6.apply(this, arguments);

        setTimeout(() => {
            removeRedundantAvatarButtonV6();
        }, 0);

        return result;
    };

    // Public helper for debugging.
    window.repairWorkspaceChecklistLayout = repairChecklistDOMV6;
})();


// ============================================================================
// AUTO TIME THEME + LARGE CURRENT ACCOUNT AVATAR VIEWER (V1)
// ============================================================================
(function initAutoTimeThemeAndAvatarViewerV1(){
    function ensureAvatarViewer(){
        if(document.getElementById('accountAvatarViewerV1')) return;
        const viewer=document.createElement('div');
        viewer.id='accountAvatarViewerV1';
        viewer.className='account-avatar-viewer-v1';
        viewer.setAttribute('aria-hidden','true');
        viewer.innerHTML=`
            <div class="account-avatar-viewer-backdrop-v1" data-close-avatar-viewer></div>
            <div class="account-avatar-viewer-dialog-v1" role="dialog" aria-modal="true" aria-label="Account avatar preview">
                <button class="account-avatar-viewer-close-v1" type="button" aria-label="Close avatar preview">✕</button>
                <img id="accountAvatarViewerImageV1" alt="Large account avatar">
                <div class="account-avatar-viewer-caption-v1">
                    <strong id="accountAvatarViewerNameV1">Current account</strong>
                    <span id="accountAvatarViewerEmailV1"></span>
                </div>
            </div>`;
        document.body.appendChild(viewer);
        viewer.querySelector('[data-close-avatar-viewer]')?.addEventListener('click',closeAccountAvatarViewerV1);
        viewer.querySelector('.account-avatar-viewer-close-v1')?.addEventListener('click',closeAccountAvatarViewerV1);
    }

    function getDisplayedAccountAvatarSrc(){
        const img=document.getElementById('accountAvatar');
        if(img?.src && getComputedStyle(img).display!=='none') return img.src;
        try { if(typeof effectiveAvatar==='function') return effectiveAvatar()||''; } catch(_){}
        return googleAccountProfile?.picture||'';
    }

    window.openAccountAvatarViewerV1=function(){
        const src=getDisplayedAccountAvatarSrc();
        if(!src) return;
        ensureAvatarViewer();
        const viewer=document.getElementById('accountAvatarViewerV1');
        const image=document.getElementById('accountAvatarViewerImageV1');
        const name=document.getElementById('accountAvatarViewerNameV1');
        const email=document.getElementById('accountAvatarViewerEmailV1');
        if(image) image.src=src;
        if(name) name.textContent=googleAccountProfile?.name||'Current account';
        if(email) email.textContent=googleAccountProfile?.email||'';
        viewer?.classList.add('active');
        viewer?.setAttribute('aria-hidden','false');
        document.body.classList.add('account-avatar-viewer-open-v1');
    };

    window.closeAccountAvatarViewerV1=function(){
        const viewer=document.getElementById('accountAvatarViewerV1');
        viewer?.classList.remove('active');
        viewer?.setAttribute('aria-hidden','true');
        document.body.classList.remove('account-avatar-viewer-open-v1');
    };

    function bindCurrentAccountAvatar(){
        const img=document.getElementById('accountAvatar');
        if(!img || img.__largeAvatarViewerBoundV1) return;
        img.__largeAvatarViewerBoundV1=true;
        img.classList.add('account-avatar-zoomable-v1');
        img.setAttribute('title','Click to view larger avatar');
        img.setAttribute('tabindex','0');
        img.setAttribute('role','button');
        img.setAttribute('aria-label','View larger account avatar');
        img.addEventListener('click',e=>{e.stopPropagation();openAccountAvatarViewerV1();});
        img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openAccountAvatarViewerV1();}});
    }

    document.addEventListener('keydown',e=>{
        if(e.key==='Escape' && document.getElementById('accountAvatarViewerV1')?.classList.contains('active')) closeAccountAvatarViewerV1();
    });

    document.addEventListener('DOMContentLoaded',()=>{
        bindCurrentAccountAvatar();
        if(isAutoTimeThemeEnabled()){applyAutoTimeTheme(true);startAutoTimeThemeWatcher();}
    });
    window.addEventListener('load',()=>{
        bindCurrentAccountAvatar();
        if(isAutoTimeThemeEnabled()){applyAutoTimeTheme(true);startAutoTimeThemeWatcher();}
    });

    const originalOpenAccountPanelAutoAvatarV1=openAccountPanel;
    openAccountPanel=function(){
        const result=originalOpenAccountPanelAutoAvatarV1.apply(this,arguments);
        setTimeout(bindCurrentAccountAvatar,0);
        return result;
    };

    window.addEventListener('storage',e=>{
        if(e.key===AUTO_TIME_THEME_KEY){
            if(isAutoTimeThemeEnabled()){applyAutoTimeTheme(true);startAutoTimeThemeWatcher();}
            else stopAutoTimeThemeWatcher();
        }
    });
})();

// ============================================================================
// CURRENT ACCOUNT INLINE RENAME V5 — DIRECT EDIT + HERO ACCOUNT LABEL + DRIVE SYNC
// - Click the displayed account name itself to rename; no extra input row
// - Enter / blur saves, Escape cancels
// - Custom name follows the existing Drive workspace payload
// - Hero meta shows date + "Hi, Name" beside the avatar
// ============================================================================
(function initCurrentAccountInlineRenameV4(){
    if (window.__CURRENT_ACCOUNT_INLINE_RENAME_V4_READY__) return;
    window.__CURRENT_ACCOUNT_INLINE_RENAME_V4_READY__ = true;

    const NAME_PREFIX = 'workspace_custom_account_name_v1_';
    let renameOriginalValue = '';
    let renameDraftValue = '';
    let isApplyingHeaderProfile = false;

    function identityKey(){
        return String(
            googleAccountProfile?.id ||
            googleAccountProfile?.email ||
            'default'
        ).toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
    }

    function storageKey(){ return NAME_PREFIX + identityKey(); }

    function getCustomAccountName(){
        try { return (localStorage.getItem(storageKey()) || '').trim(); }
        catch (_) { return ''; }
    }

    function setCustomAccountName(value){
        const clean = String(value || '').trim().replace(/\s+/g, ' ').slice(0, 80);
        try {
            if (clean) localStorage.setItem(storageKey(), clean);
            else localStorage.removeItem(storageKey());
        } catch (_) {}
        return clean;
    }

    function effectiveAccountName(){
        return getCustomAccountName() || googleAccountProfile?.name || googleAccountProfile?.email || 'Google account';
    }

    function injectInlineRenameStyles(){
        if (document.getElementById('currentAccountInlineRenameV4Styles')) return;
        const style = document.createElement('style');
        style.id = 'currentAccountInlineRenameV4Styles';
        style.textContent = `
            #accountModal .account-profile-copy{min-width:0;}
            #accountModal #accountDisplayName{
                position:relative;
                display:inline-flex;
                align-items:center;
                width:100%;
                max-width:100%;
                min-width:28px;
                padding:3px 26px 3px 5px;
                margin-left:-5px;
                border:1px solid transparent;
                border-radius:8px;
                outline:none;
                cursor:text;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
                transition:background .16s ease,border-color .16s ease,box-shadow .16s ease;
            }
            #accountModal #accountDisplayName::after{
                content:'✎';
                position:absolute;
                right:7px;
                top:50%;
                transform:translateY(-50%);
                font-size:11px;
                color:var(--text-sub);
                opacity:0;
                pointer-events:none;
                transition:opacity .16s ease;
            }
            #accountModal #accountDisplayName.account-name-editable-v2:hover{
                background:rgba(255,255,255,.055);
                border-color:var(--border-color);
            }
            #accountModal #accountDisplayName.account-name-editable-v2:hover::after,
            #accountModal #accountDisplayName.account-name-editing-v2::after{opacity:.8;}
            #accountModal #accountDisplayName.account-name-editing-v2{
                overflow-x:auto;
                overflow-y:hidden;
                white-space:nowrap;
                background:var(--inner-bg);
                border-color:var(--accent-color);
                box-shadow:0 0 0 3px color-mix(in srgb, var(--accent-color) 16%, transparent);
            }
            body.light-mode #accountModal #accountDisplayName.account-name-editable-v2:hover{
                background:rgba(15,23,42,.035);
            }

            /* Hero account block: date + greeting on the left, avatar on the right */
            .hero-meta-v12.hero-account-meta-v4{
                display:grid !important;
                grid-template-columns:minmax(0,auto) 42px;
                grid-template-rows:auto auto;
                column-gap:10px;
                row-gap:1px;
                align-items:center;
                justify-content:end;
                text-align:right;
            }
            .hero-meta-v12.hero-account-meta-v4 #workspaceTodayLabel{
                grid-column:1;
                grid-row:1;
                display:block;
                line-height:1.25;
                white-space:nowrap;
            }
            .hero-meta-v12.hero-account-meta-v4 .workspace-account-name-v4{
                grid-column:1;
                grid-row:2;
                display:block;
                min-width:0;
                max-width:220px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
                color:inherit;
                font-size:13px;
                font-weight:750;
                line-height:1.25;
                letter-spacing:.01em;
            }
            .hero-meta-v12.hero-account-meta-v4 #btn-login-google.profile-header-btn-v5{
                grid-column:2;
                grid-row:1 / span 2;
                align-self:center;
                justify-self:end;
                width:42px !important;
                min-width:42px !important;
                height:42px !important;
                min-height:42px !important;
                padding:4px !important;
                border-radius:50% !important;
                display:inline-flex !important;
                align-items:center !important;
                justify-content:center !important;
                overflow:visible !important;
            }
            .hero-meta-v12.hero-account-meta-v4 #btn-login-google .profile-avatar-v5,
            .hero-meta-v12.hero-account-meta-v4 #btn-login-google .profile-fallback-v5{
                width:34px !important;
                min-width:34px !important;
                height:34px !important;
                border-radius:50% !important;
                flex:0 0 34px !important;
            }
            .hero-meta-v12.hero-account-meta-v4 #btn-login-google .profile-status-v5{
                right:1px !important;
                bottom:1px !important;
            }
            .hero-meta-v12.hero-account-meta-v4 #btn-login-google .header-account-name-v2{
                display:none !important;
            }
            @media (max-width:700px){
                .hero-meta-v12.hero-account-meta-v4{
                    grid-template-columns:minmax(0,auto) 38px;
                    column-gap:8px;
                }
                .hero-meta-v12.hero-account-meta-v4 .workspace-account-name-v4{
                    max-width:150px;
                    font-size:12px;
                }
                .hero-meta-v12.hero-account-meta-v4 #btn-login-google.profile-header-btn-v5{
                    width:38px !important;
                    min-width:38px !important;
                    height:38px !important;
                    min-height:38px !important;
                    padding:4px !important;
                }
                .hero-meta-v12.hero-account-meta-v4 #btn-login-google .profile-avatar-v5,
                .hero-meta-v12.hero-account-meta-v4 #btn-login-google .profile-fallback-v5{
                    width:30px !important;
                    min-width:30px !important;
                    height:30px !important;
                    flex-basis:30px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function ensureHeroAccountName(){
        injectInlineRenameStyles();
        const heroMeta = document.querySelector('.hero-meta-v12');
        const dateEl = document.getElementById('workspaceTodayLabel');
        const btn = document.getElementById('btn-login-google');
        if (!heroMeta || !dateEl || !btn) return null;

        heroMeta.classList.add('hero-account-meta-v4');

        let nameEl = document.getElementById('workspaceAccountNameV4');
        if (!nameEl) {
            nameEl = document.createElement('span');
            nameEl.id = 'workspaceAccountNameV4';
            nameEl.className = 'workspace-account-name-v4';
            nameEl.setAttribute('aria-live', 'polite');
        }

        if (nameEl.parentElement !== heroMeta) heroMeta.appendChild(nameEl);
        if (btn.parentElement !== heroMeta) heroMeta.appendChild(btn);

        return nameEl;
    }

    function getHeaderAvatar(){
        const modalAvatar = document.getElementById('accountAvatar');
        if (modalAvatar && modalAvatar.style.display !== 'none' && modalAvatar.getAttribute('src')) {
            return modalAvatar.getAttribute('src');
        }
        try {
            if (typeof effectiveAvatar === 'function') return effectiveAvatar() || '';
        } catch (_) {}
        return googleAccountProfile?.picture || '';
    }

    function renderHeaderAvatar(){
        injectInlineRenameStyles();
        const btn = document.getElementById('btn-login-google');
        if (!btn) return;
        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();
        const nameEl = ensureHeroAccountName();

        if (!connected) {
            if (nameEl) nameEl.textContent = '';
            btn.classList.remove('header-account-pill-v2');
            return;
        }

        const label = effectiveAccountName();
        const avatar = getHeaderAvatar();
        const initial = String(label).trim().charAt(0).toUpperCase() || 'G';
        const title = `${label}${googleAccountProfile?.email && googleAccountProfile.email !== label ? ` · ${googleAccountProfile.email}` : ''}`;

        if (nameEl) {
            nameEl.textContent = `Hi, ${label}`;
            nameEl.title = `Hi, ${label}`;
        }

        btn.classList.add('profile-header-btn-v5');
        btn.classList.remove('header-account-pill-v2');
        btn.title = title;
        btn.setAttribute('aria-label', `Current account: ${label}`);

        const currentAvatar = btn.querySelector('.profile-avatar-v5')?.getAttribute('src') || '';
        const currentInitial = btn.querySelector('.profile-fallback-v5')?.textContent || '';
        if ((avatar && currentAvatar === avatar) || (!avatar && currentInitial === initial)) return;

        isApplyingHeaderProfile = true;
        btn.innerHTML = avatar
            ? `<span style="position:relative;display:inline-flex;flex:0 0 auto;"><img class="profile-avatar-v5" src="${escapeHTML(avatar)}" alt=""><span class="profile-status-v5" aria-hidden="true"></span></span>`
            : `<span style="position:relative;display:inline-flex;flex:0 0 auto;"><span class="profile-fallback-v5">${escapeHTML(initial)}</span><span class="profile-status-v5" aria-hidden="true"></span></span>`;
        isApplyingHeaderProfile = false;
    }

    function applyCustomNameToUI(){
        injectInlineRenameStyles();
        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();
        const display = document.getElementById('accountDisplayName');

        if (display) {
            display.classList.toggle('account-name-editable-v2', connected);
            display.title = connected ? 'Click the name to rename' : '';
            if (!display.classList.contains('account-name-editing-v2')) {
                display.textContent = connected ? effectiveAccountName() : 'Not connected';
            }
        }

        renderHeaderAvatar();

        const viewerName = document.getElementById('accountAvatarViewerNameV1');
        if (viewerName && connected) viewerName.textContent = effectiveAccountName();
    }

    async function persistCurrentName(){
        if (typeof persistWorkspaceChange === 'function') {
            await Promise.resolve(persistWorkspaceChange('account-name'));
        } else if (typeof syncToGoogleDrive === 'function') {
            await Promise.resolve(syncToGoogleDrive(true));
        }
    }

    async function finishInlineRename(save){
        const display = document.getElementById('accountDisplayName');
        if (!display || !display.classList.contains('account-name-editing-v2')) return;

        display.classList.remove('account-name-editing-v2');
        display.removeAttribute('contenteditable');
        display.removeAttribute('spellcheck');

        if (!save) {
            display.textContent = renameOriginalValue || effectiveAccountName();
            return;
        }

        const next = String(renameDraftValue || display.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
        if (!next) {
            display.textContent = renameOriginalValue || effectiveAccountName();
            return;
        }

        setCustomAccountName(next);
        display.textContent = next;
        applyCustomNameToUI();
        try { await persistCurrentName(); }
        catch (error) { console.warn('Could not sync custom account name yet:', error); }
    }

    function beginInlineRename(){
        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();
        const display = document.getElementById('accountDisplayName');
        if (!connected || !display || display.classList.contains('account-name-editing-v2')) return;

        renameOriginalValue = effectiveAccountName();
        renameDraftValue = renameOriginalValue;
        display.textContent = renameOriginalValue;
        display.setAttribute('contenteditable', 'true');
        display.setAttribute('spellcheck', 'false');
        display.classList.add('account-name-editing-v2');
        display.focus();

        try {
            const range = document.createRange();
            range.selectNodeContents(display);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } catch (_) {}
    }

    function bindInlineRename(){
        injectInlineRenameStyles();
        const display = document.getElementById('accountDisplayName');
        if (!display || display.__inlineRenameV4Bound) return;
        display.__inlineRenameV4Bound = true;

        display.addEventListener('click', () => beginInlineRename());
        display.addEventListener('input', () => {
            if (display.classList.contains('account-name-editing-v2')) {
                renameDraftValue = String(display.textContent || '').slice(0, 80);
            }
        });
        display.addEventListener('keydown', e => {
            if (!display.classList.contains('account-name-editing-v2')) return;
            if (e.key === 'Enter') {
                e.preventDefault();
                finishInlineRename(true);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                finishInlineRename(false);
                display.blur();
            }
        });
        display.addEventListener('blur', () => {
            if (display.classList.contains('account-name-editing-v2')) finishInlineRename(true);
        });
        display.addEventListener('paste', e => {
            if (!display.classList.contains('account-name-editing-v2')) return;
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
            document.execCommand('insertText', false, text.replace(/\s+/g, ' '));
        });
    }

    if (typeof buildDrivePayload === 'function') {
        const originalBuildDrivePayload = buildDrivePayload;
        buildDrivePayload = function(){
            const payload = originalBuildDrivePayload.apply(this, arguments);
            if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
                payload.accountUiPreferences = {
                    ...(payload.accountUiPreferences || {}),
                    customAccountName: getCustomAccountName() || ''
                };
            }
            return payload;
        };
    }

    if (typeof applyDrivePayload === 'function') {
        const originalApplyDrivePayload = applyDrivePayload;
        applyDrivePayload = function(payload){
            const result = originalApplyDrivePayload.apply(this, arguments);
            if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
                const cloudName = payload.accountUiPreferences?.customAccountName;
                if (typeof cloudName === 'string') setCustomAccountName(cloudName);
            }
            setTimeout(() => { bindInlineRename(); applyCustomNameToUI(); }, 0);
            return result;
        };
    }

    if (typeof updateGoogleAccountUI === 'function') {
        const originalUpdateGoogleAccountUI = updateGoogleAccountUI;
        updateGoogleAccountUI = function(){
            const result = originalUpdateGoogleAccountUI.apply(this, arguments);
            setTimeout(() => { bindInlineRename(); applyCustomNameToUI(); }, 0);
            return result;
        };
    }

    if (typeof openAccountPanel === 'function') {
        const originalOpenAccountPanel = openAccountPanel;
        openAccountPanel = function(){
            const result = originalOpenAccountPanel.apply(this, arguments);
            setTimeout(() => { bindInlineRename(); applyCustomNameToUI(); }, 0);
            return result;
        };
    }

    function observeHeaderProfile(){
        const btn = document.getElementById('btn-login-google');
        if (!btn || btn.__headerAccountNameV4Observed) return;
        btn.__headerAccountNameV4Observed = true;
        new MutationObserver(() => {
            if (isApplyingHeaderProfile) return;
            requestAnimationFrame(renderHeaderAvatar);
        }).observe(btn, { childList:true, subtree:true, attributes:true, attributeFilter:['src'] });
    }

    window.addEventListener('storage', e => {
        if (e.key && e.key.startsWith(NAME_PREFIX)) setTimeout(applyCustomNameToUI, 0);
    });

    document.addEventListener('DOMContentLoaded', () => {
        bindInlineRename();
        applyCustomNameToUI();
        observeHeaderProfile();
    });
    window.addEventListener('load', () => {
        bindInlineRename();
        applyCustomNameToUI();
        observeHeaderProfile();
        setTimeout(() => { applyCustomNameToUI(); observeHeaderProfile(); }, 300);
    });

    window.renameCurrentAccount = beginInlineRename;
    window.getCurrentAccountDisplayName = effectiveAccountName;
})();


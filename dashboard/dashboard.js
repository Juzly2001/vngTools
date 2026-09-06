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

    if (displayName) displayName.textContent = connected ? (profile?.name || 'Google account') : 'Not connected';
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
  {id:'forest',name:'Forest',icon:'🌲',scene:'forest'}, {id:'rose',name:'Rose',icon:'🌹',scene:'rose'},
  {id:'lavender',name:'Lavender',icon:'💜',scene:'lavender'}, {id:'ocean',name:'Ocean',icon:'🌊',scene:'ocean'},
  {id:'sunset',name:'Sunset',icon:'🌇',scene:'sunset'}, {id:'coffee',name:'Coffee',icon:'☕',scene:'coffee'},
  {id:'mint',name:'Mint',icon:'🌿',scene:'meadow'}, {id:'sakura-night',name:'Sakura Night',icon:'🌸',scene:'sakura'},
  {id:'sky',name:'Sky',icon:'☁️',scene:'sky'}, {id:'lemon',name:'Lemon',icon:'🍋',scene:'lemon'},
  {id:'peach',name:'Peach',icon:'🍑',scene:'peach'}, {id:'cyber',name:'Cyber',icon:'⚡',scene:'cyber'},
  {id:'grape',name:'Grape',icon:'🍇',scene:'grape'}, {id:'terminal',name:'Terminal',icon:'💻',scene:'terminal'}
];
const LIGHT_COMPAT_THEMES = new Set(['light','rose','lavender','mint','sky','lemon','peach']);
const PHOTO_SCENES = new Set(['forest','rose','lavender','ocean','sunset','sakura','cyber']);
const THEME_SCENE_LABELS={night:'Starry night',day:'Soft daylight',midnight:'Moonlit mountains',oled:'Pure black sky',forest:'Forest · mist · fireflies',rose:'Rose meadow · wind · clouds',lavender:'Lavender valley',ocean:'Underwater reef',sunset:'Golden valley',coffee:'Warm café window',meadow:'Fresh meadow',sakura:'Moonlit sakura',sky:'Open blue sky',lemon:'Lemon orchard',peach:'Peach orchard',cyber:'Neon skyline',grape:'Purple nebula',terminal:'Terminal city'};
let themeFxParticles=[], themeFxTick=0, sceneCache=null, sceneCacheCtx=null, sceneCacheKey='', fxLastFrame=0;
const prefersReducedMotion = matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
const FX_QUALITY = (()=>{ const mobile=innerWidth<769; const cores=navigator.hardwareConcurrency||4; const mem=navigator.deviceMemory||4; if(prefersReducedMotion) return .22; if(mobile||cores<=4||mem<=4) return .55; return .9; })();
const FX_TARGET_FPS = FX_QUALITY < .6 ? 30 : 45;

function getCurrentTheme(){ const v=localStorage.getItem(THEME_KEY)||'dark'; return DASHBOARD_THEMES.some(t=>t.id===v)?v:'dark'; }
function getThemeMeta(id=getCurrentTheme()){ return DASHBOARD_THEMES.find(t=>t.id===id)||DASHBOARD_THEMES[0]; }
function sceneLabel(scene){return THEME_SCENE_LABELS[scene]||scene;}
function applyDashboardTheme(themeId,save=true){
  const meta=getThemeMeta(themeId); document.body.dataset.theme=meta.id; document.body.classList.toggle('light-mode',LIGHT_COMPAT_THEMES.has(meta.id));
  if(save)localStorage.setItem(THEME_KEY,meta.id); const btn=getEl('themeBtn'); if(btn)btn.innerHTML=`<span class="sidebar-menu-icon">${meta.icon}</span><span>Theme</span>`;
  document.querySelectorAll('.theme-choice').forEach(el=>{const on=el.dataset.theme===meta.id;el.classList.toggle('active',on);const m=el.querySelector('.theme-check');if(m)m.textContent=on?'✓':'';});
  invalidateScene(); if(isCanvasEnabled){initBackgroundObjects(); if(!animationFrameId)animationFrameId=requestAnimationFrame(drawBackground);}
}
function toggleTheme(){openThemePicker();}
function ensureThemePicker(){if(document.getElementById('themePickerOverlay'))return;const o=document.createElement('div');o.id='themePickerOverlay';o.className='theme-picker-overlay';o.innerHTML=`<div class="theme-picker-panel" role="dialog" aria-modal="true"><div class="theme-picker-head"><div><h3>🎨 Choose theme</h3><small style="color:var(--text-sub)">Real photo scenes + lightweight live effects.</small></div><button class="theme-picker-close" type="button">✕</button></div><div class="theme-picker-grid">${DASHBOARD_THEMES.map(t=>`<button class="theme-choice" type="button" data-theme="${t.id}"><span class="theme-check"></span><strong>${t.icon} ${t.name}</strong><small>${sceneLabel(t.scene)}</small></button>`).join('')}</div></div>`;document.body.appendChild(o);o.addEventListener('click',e=>{if(e.target===o)closeThemePicker()});o.querySelector('.theme-picker-close')?.addEventListener('click',closeThemePicker);o.querySelectorAll('.theme-choice').forEach(b=>b.addEventListener('click',()=>{applyDashboardTheme(b.dataset.theme);closeThemePicker();}));}
function openThemePicker(){ensureThemePicker();document.getElementById('themePickerOverlay')?.classList.add('active');applyDashboardTheme(getCurrentTheme(),false)}
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
function drawBackground(ts=0){if(!canvas||!ctx||!isCanvasEnabled||document.hidden){animationFrameId=null;return;}const minDelta=1000/FX_TARGET_FPS;if(ts-fxLastFrame<minDelta){animationFrameId=requestAnimationFrame(drawBackground);return;}fxLastFrame=ts;const w=canvas._cssW||innerWidth,h=canvas._cssH||innerHeight,meta=getThemeMeta(),s=meta.scene;themeFxTick+=minDelta/1000;ctx.clearRect(0,0,w,h);if(!PHOTO_SCENES.has(s))ctx.drawImage(getSceneCache(meta,w,h),0,0,w,h);
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
function toggleThemeCanvas(){isCanvasEnabled=!isCanvasEnabled;localStorage.setItem('canvas-enabled',isCanvasEnabled);applyCanvasState();}
window.addEventListener('resize',()=>{clearTimeout(window.__sceneResizeTimer);window.__sceneResizeTimer=setTimeout(resizeCanvas,120)},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(animationFrameId){cancelAnimationFrame(animationFrameId);animationFrameId=null}}else if(isCanvasEnabled&&!animationFrameId){fxLastFrame=0;animationFrameId=requestAnimationFrame(drawBackground)}});
window.addEventListener('load',()=>{ensureThemePicker();applyDashboardTheme(getCurrentTheme(),false);applyCanvasState();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeThemePicker()});


// ==========================================================================
// SCENE V6 — LIVE DEPTH PARALLAX CONTROLLER
// ==========================================================================
(function initLiveDepthScene(){
    const root = document.documentElement;
    const finePointer = window.matchMedia('(pointer:fine)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let raf = 0;

    const render = () => {
        raf = 0;
        currentX += (targetX - currentX) * 0.065;
        currentY += (targetY - currentY) * 0.065;
        root.style.setProperty('--scene-x', currentX.toFixed(2) + 'px');
        root.style.setProperty('--scene-y', currentY.toFixed(2) + 'px');

        if (Math.abs(targetX-currentX) > .05 || Math.abs(targetY-currentY) > .05) {
            raf = requestAnimationFrame(render);
        }
    };

    const wake = () => {
        if (!raf) raf = requestAnimationFrame(render);
    };

    const onPointerMove = (e) => {
        if (!finePointer.matches || reduceMotion.matches || !isCanvasEnabled) return;
        const nx = (e.clientX / Math.max(1, innerWidth) - .5);
        const ny = (e.clientY / Math.max(1, innerHeight) - .5);
        // Very small movement is more realistic than dramatic parallax.
        targetX = nx * -18;
        targetY = ny * -11;
        wake();
    };

    const reset = () => {
        targetX = 0;
        targetY = 0;
        wake();
    };

    window.addEventListener('pointermove', onPointerMove, {passive:true});
    document.addEventListener('mouseleave', reset);
    window.addEventListener('blur', reset);

    // If visuals are turned off, immediately return scene to neutral position.
    const oldToggleThemeCanvasV6 = window.toggleThemeCanvas || toggleThemeCanvas;
    window.toggleThemeCanvas = toggleThemeCanvas = function(){
        oldToggleThemeCanvasV6();
        if (!isCanvasEnabled) reset();
    };
})();

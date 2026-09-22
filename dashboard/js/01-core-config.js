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
const ACCOUNT_ACCESS_CHECK_MS = 5000;
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
const AUDIT_LOG_LIMIT = 500;
const AUDIT_PAGE_SIZE = 50;
let adminAuditPage = 1;
let adminAuditLastQuery = '';
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
let isCanvasEnabled = localStorage.getItem('canvas-enabled') === 'true';

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

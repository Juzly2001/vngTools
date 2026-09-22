javascript:(()=>{ 
const ID="mini-excel-chat-tool-left-tooltip"; 
if(document.getElementById(ID))document.getElementById(ID).remove(); 

const rows=[ 
    {id:"HT - St1",text:"Cảm ơn anh/chị đã liên hệ đến Fanpage chính thức của Zalopay. Em là Phương, xin phép hỗ trợ anh/chị ạ."}, 
    {id:"HT - St2",text:"Em có thể hỗ trợ thông tin gì cho mình ạ?"}, 
    {id:"HT - dva",text:"Dạ vâng ạ"}, 
    {id:"HT - Hỗ trợ thêm",text:"Dạ Anh/chị còn cần em hỗ trợ thêm thông tin gì khác nữa không ạ?"} 
]; 

// Các dòng gửi theo trình tự được lưu riêng, không mất khi tải lại Google Sheets.
const SEQUENCE_KEY = "FRESHCHAT_SEND_SEQUENCES_V1";
let sequences = [];
try { sequences = JSON.parse(localStorage.getItem(SEQUENCE_KEY) || "[]"); if (!Array.isArray(sequences)) sequences = []; } catch (_) { sequences = []; }
const saveSequences = () => localStorage.setItem(SEQUENCE_KEY, JSON.stringify(sequences));
const sequenceText = item => item.steps.map((step, i) => `${i + 1}. ${step.id}\n${step.text}`).join("\n\n");
const PIN_KEY = "FRESHCHAT_PINNED_ROWS_V1";
let pinnedRows = [];
try { pinnedRows = JSON.parse(localStorage.getItem(PIN_KEY) || "[]"); if (!Array.isArray(pinnedRows)) pinnedRows = []; } catch (_) { pinnedRows = []; }
const rowKey = r => (r.sequence ? "sequence:" : "normal:") + r.id;
const savePins = () => localStorage.setItem(PIN_KEY, JSON.stringify(pinnedRows));
// Pinned rows follow the saved order; unpinned rows retain their original order.
const allRows = () => [...rows, ...sequences.map(item => ({id:item.id, text:sequenceText(item), sequence:item}))]
    .sort((a,b) => {
        const ai=pinnedRows.indexOf(rowKey(a)), bi=pinnedRows.indexOf(rowKey(b));
        if(ai !== -1 && bi !== -1) return ai-bi;
        if(ai !== -1) return -1;
        if(bi !== -1) return 1;
        return 0;
    });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let activeSequence = false;
async function sendMessage(text) {
    const input = document.querySelector(".msg-reply-box[contenteditable='true']") || document.querySelector(".msg-reply-box");
    if (!input) throw new Error("Không tìm thấy ô nhập tin nhắn Freshchat.");
    input.focus();
    input.innerHTML = "";
    input.textContent = String(text).replace(/\r\n?/g, "\n");
    input.dispatchEvent(new InputEvent("input", {bubbles:true, cancelable:true}));
    await wait(100);
    const sendBtn = document.querySelector("div[data-test-fc-send-button='root']");
    if (!sendBtn) throw new Error("Không tìm thấy nút gửi Freshchat.");
    sendBtn.dispatchEvent(new MouseEvent("click", {bubbles:true, cancelable:true}));
}
async function runSequence(item, button) {
    if (activeSequence) return;
    activeSequence = true;
    const original = button.textContent;
    button.disabled = true;
    try {
        for (let i = 0; i < item.steps.length; i++) {
            button.textContent = `${i + 1}/${item.steps.length}`;
            await sendMessage(item.steps[i].text);
            if (i < item.steps.length - 1) await wait(item.delay || 1500);
        }
    } catch (error) { alert(error.message + " Các bước còn lại chưa được gửi."); }
    finally { button.textContent = original; button.disabled = false; activeSequence = false; }
}

// =========================
// HÀM THÊM DÒNG
// =========================
function addRow(id, text){ rows.push({id, text}); } 
function clearAllRows(){
    rows.length = 0;
    renderRows();
}


function createFragmentFromText(text){ 
    let t=String(text).replace(/<br\s*\/?>/gi,"\n").replace(/\r\n?/g,"\n"); 
    const lines=t.split("\n"); 
    const frag=document.createDocumentFragment(); 
    lines.forEach((line,idx)=>{ 
        const span=document.createElement("span"); 
        span.textContent=line;
        frag.appendChild(span); 
        if(idx<lines.length-1)frag.appendChild(document.createElement("br")); 
    }); 
    return frag; 
} 

const container=document.createElement("div"); 
container.id=ID; 
container.style.position="fixed"; 
container.style.top="10px"; 
container.style.right="10px"; 
container.style.zIndex=999999; 
container.style.background="#fff"; 
container.style.border="1px solid #ddd"; 
container.style.boxShadow="0 6px 18px rgba(0,0,0,0.12)"; 
container.style.borderRadius="8px"; 
container.style.fontFamily="Segoe UI, Roboto, Arial, sans-serif"; 
container.style.fontSize="13px"; 
container.style.width="420px";
container.style.minWidth="280px";
container.style.minHeight="40px";
container.style.overflow="hidden"; 

const toggleBtn=document.createElement("button"); 
toggleBtn.innerText="⚡FreshChat Support"; 
attachTooltip(toggleBtn, "Ẩn/Hiện FreshChat Tool ((Ctrl hoặc ⌘) + Space)");
toggleBtn.style.width="100%"; 
toggleBtn.style.padding="8px"; 
toggleBtn.style.cursor="pointer"; 
toggleBtn.style.border="none"; 
toggleBtn.style.background="#0b74de"; 
toggleBtn.style.color="#fff"; 
toggleBtn.style.fontSize="16px"; 
toggleBtn.style.fontWeight="600"; 
toggleBtn.style.borderTopLeftRadius="8px"; 
toggleBtn.style.borderTopRightRadius="8px"; 
container.appendChild(toggleBtn); 

const tableWrapper=document.createElement("div"); 
tableWrapper.style.padding="8px"; 
tableWrapper.style.maxHeight="80vh"; 
tableWrapper.style.overflow="auto"; 

const table=document.createElement("table"); 
table.style.borderCollapse="collapse"; 
table.style.width="100%"; 
table.style.tableLayout="fixed"; 

// =========================
// Thanh công cụ Import Excel + Search (đẹp + có bàn phím ẩn hiện)
// =========================
const headerTools = document.createElement("tr");
const thTools = document.createElement("th");
thTools.colSpan = 3;
thTools.style.padding = "6px 10px";
thTools.style.textAlign = "left";
thTools.style.background = "#f8f9fa";
thTools.style.borderBottom = "1px solid #ddd";

// Ô import
const importLabel = document.createElement("label");
importLabel.innerHTML = `
<svg viewBox="0 -1.27 110.037 110.037" xmlns="http://www.w3.org/2000/svg" width="18" height="18" style="vertical-align: middle; margin-right: 6px;">
  <g><path d="M57.55 0h7.425v10c12.513 0 25.025.025 37.537-.038 2.113.087 4.438-.062 6.275 1.2 1.287 1.85 1.138 4.2 1.225 6.325-.062 21.7-.037 43.388-.024 65.075-.062 3.638.337 7.35-.425 10.938-.5 2.6-3.625 2.662-5.713 2.75-12.95.037-25.912-.025-38.875 0v11.25h-7.763c-19.05-3.463-38.138-6.662-57.212-10V10.013C19.188 6.675 38.375 3.388 57.55 0z" fill="#207245"></path><path d="M64.975 13.75h41.25V92.5h-41.25V85h10v-8.75h-10v-5h10V62.5h-10v-5h10v-8.75h-10v-5h10V35h-10v-5h10v-8.75h-10v-7.5z" fill="#ffffff"></path><path d="M79.975 21.25h17.5V30h-17.5v-8.75z" fill="#207245"></path><path d="M37.025 32.962c2.825-.2 5.663-.375 8.5-.512a2607.344 2607.344 0 0 1-10.087 20.487c3.438 7 6.949 13.95 10.399 20.95a716.28 716.28 0 0 1-9.024-.575c-2.125-5.213-4.713-10.25-6.238-15.7-1.699 5.075-4.125 9.862-6.074 14.838-2.738-.038-5.476-.15-8.213-.263C19.5 65.9 22.6 59.562 25.912 53.312c-2.812-6.438-5.9-12.75-8.8-19.15 2.75-.163 5.5-.325 8.25-.475 1.862 4.888 3.899 9.712 5.438 14.725 1.649-5.312 4.112-10.312 6.225-15.45z" fill="#ffffff"></path><path d="M79.975 35h17.5v8.75h-17.5V35zM79.975 48.75h17.5v8.75h-17.5v-8.75zM79.975 62.5h17.5v8.75h-17.5V62.5zM79.975 76.25h17.5V85h-17.5v-8.75z" fill="#207245"></path></g>
</svg>
<span>Import</span>
`;
importLabel.style.background = "#0d6efd";
importLabel.style.color = "#fff";
importLabel.style.padding = "6px 12px";
importLabel.style.borderRadius = "6px";
importLabel.style.cursor = "pointer";
importLabel.style.marginRight = "8px";
importLabel.style.verticalAlign = "middle";
importLabel.style.display = "inline-flex";
importLabel.style.alignItems = "center"; // **giúp thẳng hàng với search**
importLabel.style.height = "36px"; // cùng chiều cao với search
const importInput = document.createElement("input");
importInput.type = "file";
importInput.accept = ".xls,.xlsx";
importInput.style.display = "none";
importInput.addEventListener("change", parseExcel);
importLabel.appendChild(importInput);

// Ô tìm kiếm
const searchContainer = document.createElement("div");
searchContainer.style.display = "inline-flex";
searchContainer.style.alignItems = "center";
searchContainer.style.border = "1px solid #ccc";
searchContainer.style.borderRadius = "6px";
searchContainer.style.padding = "0 8px"; // padding trên/dưới bằng 0
searchContainer.style.height = "36px"; // cùng chiều cao với import
searchContainer.style.background = "#fff";
searchContainer.style.width = "100%";

const searchInput = document.createElement("input");
searchInput.placeholder = "Tìm theo ID...";
searchInput.style.border = "none";
searchInput.style.outline = "none";
searchInput.style.padding = "4px";
searchInput.style.height = "100%"; // chiếm toàn bộ chiều cao container
searchInput.style.width = "100%";
searchInput.addEventListener("input", (e) => {
  renderRows(e.target.value);
});



// Nút xóa input (SVG)
const clearBtn = document.createElement("button");
clearBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
    <path fill="none" stroke="#344054" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6l-12 12"/>
  </svg>`;
clearBtn.style.display = "flex";
clearBtn.style.alignItems = "center";
clearBtn.style.justifyContent = "center";
clearBtn.style.width = "24px";
clearBtn.style.height = "24px";
clearBtn.style.border = "none";
clearBtn.style.background = "transparent";
clearBtn.style.cursor = "pointer";
attachTooltip(clearBtn, "Xóa tìm kiếm");
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("input"));
});

// Nút toggle bàn phím (SVG)
const keyboardToggle = document.createElement("button");
keyboardToggle.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="#344054" stroke-width="2"/>
    <path stroke="#344054" stroke-width="2" stroke-linecap="round" d="M7 9h.01M11 9h.01M15 9h.01M7 13h10M7 17h10"/>
  </svg>`;
keyboardToggle.style.display = "flex";
keyboardToggle.style.alignItems = "center";
keyboardToggle.style.justifyContent = "center";
keyboardToggle.style.width = "24px";
keyboardToggle.style.height = "24px";
keyboardToggle.style.border = "none";
keyboardToggle.style.background = "transparent";
keyboardToggle.style.cursor = "pointer";
attachTooltip(keyboardToggle, "Bật/Tắt phím ảo");

searchContainer.appendChild(searchInput);
searchContainer.appendChild(clearBtn);
// Phím ảo được mở từ menu ⋯, không đặt trong ô tìm kiếm.

// =========================
// HÀM GÕ TIẾNG VIỆT TELEX (giống Unikey cơ bản)
// =========================
function applyVietnameseTelex(str) {
  // Bước 1: xử lý nguyên âm ghép (ưu tiên trước)
  str = str
    .replace(/dd/g, "đ")
    .replace(/aa/g, "â")
    .replace(/aw/g, "ă")
    .replace(/ee/g, "ê")
    .replace(/oo/g, "ô")
    .replace(/ow/g, "ơ")
    .replace(/uw/g, "ư");

  // Bước 2: thêm dấu thanh (s, f, r, x, j)
  str = str
    .replace(/(a|ă|â|e|ê|i|o|ô|ơ|u|ư|y)s/g, (_, m) => ({
      a: "á", ă: "ắ", â: "ấ", e: "é", ê: "ế", i: "í", o: "ó", ô: "ố", ơ: "ớ", u: "ú", ư: "ứ", y: "ý"
    }[m] || m))
    .replace(/(a|ă|â|e|ê|i|o|ô|ơ|u|ư|y)f/g, (_, m) => ({
      a: "à", ă: "ằ", â: "ầ", e: "è", ê: "ề", i: "ì", o: "ò", ô: "ồ", ơ: "ờ", u: "ù", ư: "ừ", y: "ỳ"
    }[m] || m))
    .replace(/(a|ă|â|e|ê|i|o|ô|ơ|u|ư|y)r/g, (_, m) => ({
      a: "ả", ă: "ẳ", â: "ẩ", e: "ẻ", ê: "ể", i: "ỉ", o: "ỏ", ô: "ổ", ơ: "ở", u: "ủ", ư: "ử", y: "ỷ"
    }[m] || m))
    .replace(/(a|ă|â|e|ê|i|o|ô|ơ|u|ư|y)x/g, (_, m) => ({
      a: "ã", ă: "ẵ", â: "ẫ", e: "ẽ", ê: "ễ", i: "ĩ", o: "õ", ô: "ỗ", ơ: "ỡ", u: "ũ", ư: "ữ", y: "ỹ"
    }[m] || m))
    .replace(/(a|ă|â|e|ê|i|o|ô|ơ|u|ư|y)j/g, (_, m) => ({
      a: "ạ", ă: "ặ", â: "ậ", e: "ẹ", ê: "ệ", i: "ị", o: "ọ", ô: "ộ", ơ: "ợ", u: "ụ", ư: "ự", y: "ỵ"
    }[m] || m));

  return str;
}


// Bàn phím ảo
const keyboard = document.createElement("div");
keyboard.style.display = "none";
keyboard.style.marginTop = "8px";
keyboard.style.padding = "8px";
keyboard.style.background = "#fff";
keyboard.style.border = "1px solid #ddd";
keyboard.style.borderRadius = "10px";
keyboard.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
keyboard.style.textAlign = "center";
keyboard.style.transition = "all 0.3s ease";
keyboard.style.fontFamily = "monospace";

const rowsKeys = [
  "Q W E R T Y U I O P",
  "A S D F G H J K L",
  "Z X C V B N M"
];

rowsKeys.forEach((row) => {
  const rowDiv = document.createElement("div");
  rowDiv.style.margin = "4px 0";
  row.split(" ").forEach((key) => {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.style.margin = "2px";
    btn.style.padding = "6px 10px";
    btn.style.border = "1px solid #ccc";
    btn.style.borderRadius = "8px";
    btn.style.cursor = "pointer";
    btn.style.background = "#f9f9f9";
    btn.style.fontWeight = "500";
    btn.addEventListener("click", () => {
    let current = searchInput.value;
    let newText = current + key.toLowerCase(); // nhập thường để ghép Telex
    searchInput.value = applyVietnameseTelex(newText);
    searchInput.dispatchEvent(new Event("input"));
    });
    btn.addEventListener("mousedown", () => (btn.style.background = "#e1e1e1"));
    btn.addEventListener("mouseup", () => (btn.style.background = "#f9f9f9"));
    rowDiv.appendChild(btn);
  });
  keyboard.appendChild(rowDiv);
});

keyboardToggle.addEventListener("click", () => {
  keyboard.style.display = keyboard.style.display === "none" ? "block" : "none";
});

const gsInput = document.createElement("input");
// Nút reload Google Sheet
const reloadBtn = document.createElement("button");
reloadBtn.innerHTML = "🔄";
reloadBtn.style.height = "36px";
reloadBtn.style.width = "44px";
reloadBtn.style.border = "1px solid #ccc";
reloadBtn.style.borderRadius = "6px";
reloadBtn.style.background = "#fff";
reloadBtn.style.cursor = "pointer";
reloadBtn.style.marginLeft = "6px";
reloadBtn.style.fontSize = "16px";
reloadBtn.style.transition = "0.2s";
attachTooltip(reloadBtn, "Reload Google Sheet");

// Hàm set trạng thái nút
function setReloadState(state) {
    if (state === "loading") {
        reloadBtn.innerHTML = "⏳";
        reloadBtn.style.pointerEvents = "none";
    }
    else if (state === "success") {
        reloadBtn.innerHTML = "✅";
        reloadBtn.style.pointerEvents = "none";
        setTimeout(() => {
            reloadBtn.innerHTML = "🔄";
            reloadBtn.style.pointerEvents = "auto";
        }, 1500);
    }
    else if (state === "error") {
        reloadBtn.innerHTML = "❌";
        reloadBtn.style.pointerEvents = "none";
        setTimeout(() => {
            reloadBtn.innerHTML = "🔄";
            reloadBtn.style.pointerEvents = "auto";
        }, 1500);
    }
    else {
        reloadBtn.innerHTML = "🔄";
        reloadBtn.style.pointerEvents = "auto";
    }
}

reloadBtn.addEventListener("click", async () => {
    const url = gsInput.value.trim();
    if (!url) return;

    setReloadState("loading");

    const ok = await importFromGoogleSheetByInput(url);

    if (ok) setReloadState("success");
    else setReloadState("error");
});

gsInput.type = "text";
gsInput.placeholder = "🔗 Dán link Google Sheets (public)";
gsInput.style.height = "36px";
gsInput.style.padding = "0 10px";
gsInput.style.border = "1px solid #ccc";
gsInput.style.borderRadius = "6px";
gsInput.style.outline = "none";
gsInput.style.width = "100%";
// gsInput.style.marginRight = "8px";
gsInput.style.fontSize = "13px";

gsInput.addEventListener("input", (e) => {
    const url = e.target.value.trim();

    // 💾 lưu lại link
    if (url) {
        window.top.localStorage.setItem("GLOBAL_GSHEET_LINK", url);
    } else {
        localStorage.removeItem("GSHEET_LINK");
    }

    importFromGoogleSheetByInput(url);
});


// thTools.appendChild(importLabel);
const gsContainer = document.createElement("div");
gsContainer.style.display = "flex";
gsContainer.style.alignItems = "center";
gsContainer.style.marginBottom = "6px";

gsContainer.appendChild(gsInput);
gsContainer.appendChild(reloadBtn);

thTools.appendChild(gsContainer);
thTools.appendChild(searchContainer);
thTools.appendChild(keyboard);

// ======= Hàng cuối: Xóa, Space =======
const extraRow = document.createElement("div");
extraRow.style.display = "flex";
extraRow.style.gap = "6px";
extraRow.style.justifyContent = "center";
extraRow.style.marginTop = "6px";

// Nút Xóa
const backspaceBtn = document.createElement("button");
backspaceBtn.textContent = "←";
backspaceBtn.style.padding = "8px 12px";
backspaceBtn.style.borderRadius = "8px";
backspaceBtn.style.border = "1px solid #ccc";
backspaceBtn.style.cursor = "pointer";
backspaceBtn.style.fontWeight = "600";
backspaceBtn.style.background = "white";
backspaceBtn.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
backspaceBtn.addEventListener("click", () => {
  searchInput.value = searchInput.value.slice(0, -1);
  searchInput.dispatchEvent(new Event("input")); // 🔥 Cập nhật kết quả ngay
});

// Nút Space
const spaceBtn = document.createElement("button");
spaceBtn.textContent = "Space";
spaceBtn.style.padding = "8px 32px";
spaceBtn.style.borderRadius = "8px";
spaceBtn.style.border = "1px solid #ccc";
spaceBtn.style.cursor = "pointer";
spaceBtn.style.fontWeight = "600";
spaceBtn.style.background = "white";
spaceBtn.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
spaceBtn.addEventListener("click", () => {
  searchInput.value += " ";
  searchInput.dispatchEvent(new Event("input"));
});

extraRow.appendChild(spaceBtn);
extraRow.appendChild(backspaceBtn);
keyboard.appendChild(extraRow);


headerTools.appendChild(thTools);
table.appendChild(headerTools);
// =========================
// KHU VỰC TẠO KEY TẮT (v4 - Popup có import Excel đẹp + tùy chọn bỏ dòng đầu)
// =========================
const shortcutContainer = document.createElement("div");
shortcutContainer.style.display = "flex";
shortcutContainer.style.flexWrap = "wrap";
shortcutContainer.style.gap = "6px";
shortcutContainer.style.marginTop = "8px";
shortcutContainer.style.alignItems = "center";

const addShortcutBtn = document.createElement("button");
// Thay text thành icon
addShortcutBtn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="7" cy="17" r="3"/>
  <line x1="10" y1="14" x2="21" y2="3"/>
  <line x1="17" y1="3" x2="21" y2="7"/>
</svg>
`;
addShortcutBtn.style.display = "flex";
addShortcutBtn.style.alignItems = "center";
addShortcutBtn.style.justifyContent = "center";
addShortcutBtn.style.width = "24px";
addShortcutBtn.style.height = "24px";
addShortcutBtn.style.border = "none";
addShortcutBtn.style.background = "transparent";
addShortcutBtn.style.cursor = "pointer";
// addShortcutBtn.title = "Tạo / Import Key";
attachTooltip(addShortcutBtn, "Tạo / Import Key");
// Tạo / Import Key được mở từ menu ⋯, không đặt trong ô tìm kiếm.

const shortcuts = [ 
    "HT",
    "KT",
    "LH",
    "CC",
    "TK",
    "GD",
    "KM",
    "PAY"
];
const shortcutList = document.createElement("div");
shortcutList.style.display = "flex";
shortcutList.style.flexWrap = "wrap";
shortcutList.style.gap = "6px";
shortcutContainer.appendChild(shortcutList);

// Render danh sách phím tắt
function renderShortcuts() {
  shortcutList.innerHTML = "";
  shortcuts.forEach((key, idx) => {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.style.padding = "6px 10px";
    btn.style.border = "1px solid #ccc";
    btn.style.borderRadius = "6px";
    btn.style.cursor = "pointer";
    btn.style.background = "#fff";
    btn.style.fontWeight = "500";
    btn.style.transition = "0.2s";
    btn.style.userSelect = "none";
    attachTooltip(btn, "(Shift + Click) để xóa key");

    btn.onmouseenter = () => (btn.style.background = "#e9ecef");
    btn.onmouseleave = () => (btn.style.background = "#fff");

    btn.addEventListener("click", (e) => {
      if (e.shiftKey) {
        shortcuts.splice(idx, 1);
        renderShortcuts();
      } else {
        searchInput.value = key;
        searchInput.dispatchEvent(new Event("input"));
      }
    });

    shortcutList.appendChild(btn);
  });
}

// Popup nhập hoặc import key
addShortcutBtn.addEventListener("click", async () => {
  // Tải thư viện XLSX nếu chưa có
  if (typeof XLSX === "undefined") {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Overlay nền tối
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.4)";
  overlay.style.zIndex = 99999999;
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  // Popup
  const popup = document.createElement("div");
  popup.style.background = "#fff";
  popup.style.padding = "20px";
  popup.style.borderRadius = "10px";
  popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  popup.style.width = "320px";
  popup.style.textAlign = "center";
  popup.style.fontFamily = "sans-serif";
  overlay.appendChild(popup);

  // Tiêu đề
  const title = document.createElement("h4");
  title.textContent = "Tạo hoặc import key tắt";
  title.style.marginBottom = "12px";
  title.style.fontSize = "16px";
  title.style.color = "#333";
  popup.appendChild(title);

  // Ô nhập key
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Nhập key (VD: zalo, ht1...)";
  input.style.width = "100%";
  input.style.padding = "8px";
  input.style.marginBottom = "12px";
  input.style.border = "1px solid #ccc";
  input.style.borderRadius = "6px";
  popup.appendChild(input);

  // Khung import đẹp
  const importBox = document.createElement("div");
  importBox.style.border = "2px dashed #ced4da";
  importBox.style.borderRadius = "8px";
  importBox.style.padding = "12px";
  importBox.style.marginBottom = "10px";
  importBox.style.background = "#f8f9fa";
  importBox.style.cursor = "pointer";
  importBox.textContent = "📂 Chọn file Excel để import key";
  importBox.style.transition = "0.2s";
  importBox.onmouseenter = () => (importBox.style.background = "#e9ecef");
  importBox.onmouseleave = () => (importBox.style.background = "#f8f9fa");
  popup.appendChild(importBox);

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".xls,.xlsx";
  fileInput.style.display = "none";
  importBox.appendChild(fileInput);

  // Checkbox: bỏ qua dòng đầu tiên
  const checkboxContainer = document.createElement("label");
  checkboxContainer.style.display = "none";
  checkboxContainer.style.alignItems = "center";
  checkboxContainer.style.gap = "6px";
  checkboxContainer.style.fontSize = "13px";
  checkboxContainer.style.marginBottom = "14px";
  checkboxContainer.style.cursor = "pointer";

  const skipHeader = document.createElement("input");
  skipHeader.type = "checkbox";
  skipHeader.checked = false;
  const cbText = document.createElement("span");
  cbText.textContent = "Bỏ qua dòng đầu tiên (tiêu đề)";
  checkboxContainer.appendChild(skipHeader);
  checkboxContainer.appendChild(cbText);
  popup.appendChild(checkboxContainer);

  // Nút hành động
  const btnRow = document.createElement("div");
  btnRow.style.display = "flex";
  btnRow.style.justifyContent = "center";
  btnRow.style.gap = "8px";
  popup.appendChild(btnRow);

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Tạo";
  submitBtn.style.padding = "8px 14px";
  submitBtn.style.borderRadius = "6px";
  submitBtn.style.border = "none";
  submitBtn.style.background = "#0d6efd";
  submitBtn.style.color = "#fff";
  submitBtn.style.fontWeight = "600";
  submitBtn.style.cursor = "pointer";
  submitBtn.style.transition = "0.2s";
  submitBtn.onmouseenter = () => (submitBtn.style.background = "#0b5ed7");
  submitBtn.onmouseleave = () => (submitBtn.style.background = "#0d6efd");
  btnRow.appendChild(submitBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Hủy";
  cancelBtn.style.padding = "8px 14px";
  cancelBtn.style.borderRadius = "6px";
  cancelBtn.style.border = "none";
  cancelBtn.style.background = "#dee2e6";
  cancelBtn.style.color = "#000";
  cancelBtn.style.fontWeight = "600";
  cancelBtn.style.cursor = "pointer";
  cancelBtn.style.transition = "0.2s";
  cancelBtn.onmouseenter = () => (cancelBtn.style.background = "#ced4da");
  cancelBtn.onmouseleave = () => (cancelBtn.style.background = "#dee2e6");
  btnRow.appendChild(cancelBtn);

  document.body.appendChild(overlay);
  input.focus();

  // Xử lý tạo key thủ công
  function submitKey() {
    const key = input.value.trim();
    if (!key) return alert("Vui lòng nhập tên key!");
    shortcuts.push(key);
    renderShortcuts();
    document.body.removeChild(overlay);
  }

  submitBtn.addEventListener("click", submitKey);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitKey();
  });
  cancelBtn.addEventListener("click", () => document.body.removeChild(overlay));

  // Import Excel
  importBox.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      json.forEach((row, i) => {
        const key = row[0]?.toString().trim();
        if (skipHeader.checked && i === 0) return; // Bỏ dòng đầu nếu được chọn
        if (key && !shortcuts.includes(key)) shortcuts.push(key);
      });

      renderShortcuts();
      document.body.removeChild(overlay);
    };
    reader.readAsArrayBuffer(file);
  });
});

thTools.appendChild(shortcutContainer);
renderShortcuts();



// Tạo và sửa dòng gửi theo trình tự: chọn nội dung trực tiếp từ cột ID và nội dung.
const sequenceAddBtn = document.createElement("button");
sequenceAddBtn.type = "button";
sequenceAddBtn.textContent = "Tạo dòng gửi nhiều tin";
sequenceAddBtn.onclick = () => openSequenceEditor();

const toolMenuBtn = document.createElement("button");
toolMenuBtn.textContent = "⋯";
toolMenuBtn.title = "Tùy chọn";
toolMenuBtn.style.cssText = "position:absolute;right:5px;top:3px;width:28px;height:25px;border:0;border-radius:5px;background:transparent;color:#fff;font-size:21px;line-height:20px;cursor:pointer;z-index:2";
const toolMenu = document.createElement("div");
toolMenu.style.cssText = "display:none;position:absolute;right:5px;top:30px;min-width:205px;padding:5px;background:#fff;border:1px solid #dce4ef;border-radius:8px;box-shadow:0 6px 22px #0003;z-index:10;box-sizing:border-box";
// Mọi mục menu sử dụng cùng chiều cao, khoảng cách, font, màu và hiệu ứng hover.
const toolMenuItemStyle = "display:flex;align-items:center;gap:9px;width:100%;min-height:35px;padding:8px 10px;box-sizing:border-box;border:0;border-radius:5px;background:transparent;color:#24344a;text-align:left;cursor:pointer;font:13px Segoe UI,Arial,sans-serif;line-height:19px";
function styleToolMenuItem(button, icon, label) {
    button.style.cssText = toolMenuItemStyle;
    button.replaceChildren();
    const symbol = document.createElement("span");
    symbol.textContent = icon;
    symbol.style.cssText = "display:inline-flex;align-items:center;justify-content:center;flex:0 0 19px;width:19px;height:19px;font-size:15px;line-height:19px";
    const text = document.createElement("span");
    text.textContent = label;
    button.append(symbol, text);
    button.onmouseenter = () => button.style.background = "#e7f1ff";
    button.onmouseleave = () => button.style.background = "transparent";
    return text;
}
styleToolMenuItem(sequenceAddBtn, "+", "Tạo dòng gửi nhiều tin");
toolMenu.appendChild(sequenceAddBtn);
const keyMenuBtn = document.createElement("button");
keyMenuBtn.type = "button";
styleToolMenuItem(keyMenuBtn, "+", "Tạo / Import Key");
keyMenuBtn.onclick = () => { toolMenu.style.display="none"; addShortcutBtn.click(); };
toolMenu.appendChild(keyMenuBtn);
const keyboardMenuBtn = document.createElement("button");
keyboardMenuBtn.type = "button";
const keyboardMenuLabel = styleToolMenuItem(keyboardMenuBtn, "⌨", "Hiện phím ảo");
keyboardMenuBtn.onclick = () => { toolMenu.style.display="none"; keyboardToggle.click(); keyboardMenuLabel.textContent = keyboard.style.display === "none" ? "Hiện phím ảo" : "Ẩn phím ảo"; };
toolMenu.appendChild(keyboardMenuBtn);
container.style.position = "fixed";
container.append(toolMenuBtn, toolMenu);
toolMenuBtn.onclick = e => {e.stopPropagation();toolMenu.style.display = toolMenu.style.display === "none" ? "block" : "none";};
sequenceAddBtn.addEventListener("click", () => {toolMenu.style.display = "none";});
// Đóng menu ⋯ khi nhấp bất kỳ đâu bên ngoài, kể cả ngoài khung công cụ.
document.addEventListener("pointerdown", e => {
    if (!toolMenu.contains(e.target) && !toolMenuBtn.contains(e.target)) {
        toolMenu.style.display = "none";
    }
}, true);
document.addEventListener("keydown", e => {
    if (e.key === "Escape") toolMenu.style.display = "none";
});
function openSequenceEditor(existing = null) {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;background:#0007;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box";
    const panel = document.createElement("div");
    panel.style.cssText = "width:min(720px,100%);max-height:90vh;overflow:auto;background:white;border-radius:12px;padding:18px;box-sizing:border-box;color:#222;font:13px Segoe UI,Arial,sans-serif;box-shadow:0 12px 40px #0004";
    overlay.appendChild(panel);
    const heading = document.createElement("h3"); heading.textContent = existing ? "Sửa dòng gửi nhiều tin" : "Tạo dòng gửi nhiều tin"; panel.appendChild(heading);
    const label = (text, el) => { const wrap=document.createElement("label");wrap.style.cssText="display:block;margin:10px 0";wrap.append(document.createTextNode(text),el);panel.appendChild(wrap);return el; };
    const name = document.createElement("input"); name.placeholder="Nhập ID hiển thị ở cột 1"; name.value=existing?.id || ""; name.style.cssText="display:block;width:100%;box-sizing:border-box;padding:9px;margin-top:5px;border:1px solid #ccc;border-radius:6px";label("ID của dòng mới",name);
    const delay = document.createElement("input"); delay.type="number";delay.min="300";delay.step="100";delay.value=existing?.delay || 1500;delay.style.cssText=name.style.cssText;label("Thời gian chờ giữa các tin (mili giây)",delay);
    const search = document.createElement("input");search.placeholder="Tìm theo ID hoặc nội dung...";search.style.cssText=name.style.cssText;label("Chọn mẫu câu từ dữ liệu hiện tại",search);
    const choices = document.createElement("div");choices.style.cssText="max-height:190px;overflow:auto;border:1px solid #ddd;border-radius:6px";panel.appendChild(choices);
    const selectedTitle=document.createElement("h4");selectedTitle.textContent="Thứ tự gửi (dùng ↑ ↓ để sắp xếp)";panel.appendChild(selectedTitle);
    const selectedList=document.createElement("div");selectedList.style.cssText="max-height:240px;overflow:auto";panel.appendChild(selectedList);
    let steps = existing ? existing.steps.map(x=>({...x})) : [];
    const makeBtn = (text, fn) => {const b=document.createElement("button");b.textContent=text;b.type="button";b.style.cssText="padding:5px 9px;margin:2px;border:1px solid #ccd4e0;border-radius:5px;background:white;cursor:pointer";b.onclick=fn;return b;};
    function renderSelected() {
        selectedList.replaceChildren();
        steps.forEach((step,i)=>{
            const row=document.createElement("div");row.style.cssText="border-bottom:1px solid #eee;padding:7px 0;display:flex;align-items:flex-start;gap:8px";
            const content=document.createElement("div");content.style.cssText="flex:1;min-width:0;white-space:pre-wrap;overflow-wrap:anywhere";
            const id=document.createElement("b");id.textContent=`${i+1}. ${step.id}`;
            const body=document.createElement("div");body.textContent=step.text;content.append(id,body);row.appendChild(content);
            row.append(makeBtn("↑",()=>{if(i){[steps[i-1],steps[i]]=[steps[i],steps[i-1]];renderSelected();}}),makeBtn("↓",()=>{if(i<steps.length-1){[steps[i+1],steps[i]]=[steps[i],steps[i+1]];renderSelected();}}),makeBtn("×",()=>{steps.splice(i,1);renderSelected();}));selectedList.appendChild(row);
        });
    }
    function renderChoices() {
        choices.replaceChildren();const q=search.value.trim().toLowerCase();
        rows.filter(r=>(r.id+" "+r.text).toLowerCase().includes(q)).forEach(r=>{
            const row=document.createElement("div");row.style.cssText="display:flex;gap:10px;padding:8px;border-bottom:1px solid #eee;align-items:flex-start";
            const info=document.createElement("div");info.style.cssText="flex:1;min-width:0;white-space:pre-wrap;overflow-wrap:anywhere";
            const id=document.createElement("b");id.textContent=r.id;const body=document.createElement("div");body.textContent=r.text;info.append(id,body);
            row.append(info,makeBtn("+ Thêm",()=>{steps.push({id:r.id,text:r.text});renderSelected();}));choices.appendChild(row);
        });
    }
    search.oninput=renderChoices;renderChoices();renderSelected();
    const actions=document.createElement("div");actions.style.cssText="display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px;margin-top:16px";
    actions.appendChild(makeBtn("Hủy",()=>overlay.remove()));
    if(existing) actions.appendChild(makeBtn("Xóa dòng",()=>{if(!confirm("Xóa dòng gửi này?"))return;sequences=sequences.filter(x=>x!==existing);saveSequences();renderRows();overlay.remove();}));
    const save=makeBtn("Lưu",()=>{
        const id=name.value.trim();if(!id){alert("Vui lòng nhập ID.");name.focus();return;}
        if(!steps.length){alert("Vui lòng chọn ít nhất một mẫu câu.");return;}
        if(sequences.some(x=>x!==existing&&x.id.toLowerCase()===id.toLowerCase())){alert("ID này đã được dùng cho một dòng gửi nhiều tin khác.");return;}
        const value={id,delay:Math.max(300,Number(delay.value)||1500),steps};
        if(existing) Object.assign(existing,value);else sequences.push(value);
        saveSequences();renderRows();overlay.remove();
    });save.style.cssText+=";background:#0b74de;color:white";actions.appendChild(save);panel.appendChild(actions);
    document.body.appendChild(overlay);
}

// =========================
// Tooltip
// =========================
const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.background = "#333";
tooltip.style.color = "#fff";
tooltip.style.padding = "6px 10px";
tooltip.style.borderRadius = "6px";
tooltip.style.fontSize = "13px";
tooltip.style.maxWidth = "300px";
tooltip.style.whiteSpace = "pre-wrap";
tooltip.style.zIndex = 9999999;
tooltip.style.opacity = 0;
tooltip.style.transition = "opacity 0.2s, transform 0.2s";

// ✅ Cho phép copy, chọn text, cuộn, tương tác chuột
tooltip.style.pointerEvents = "auto";
tooltip.style.userSelect = "text";
tooltip.style.cursor = "text";
tooltip.style.maxHeight = "200px";
tooltip.style.overflowY = "auto";
tooltip.style.boxSizing = "border-box";

document.body.appendChild(tooltip);

// copy tooltip
const copyBtn = document.createElement("button");
copyBtn.innerText = "Copy";
copyBtn.style.position = "absolute";
copyBtn.style.top = "4px";
copyBtn.style.right = "6px";
copyBtn.style.border = "none";
copyBtn.style.background = "transparent";
copyBtn.style.cursor = "pointer";
copyBtn.style.fontSize = "12px";
copyBtn.style.opacity = "0.7";

copyBtn.onmouseenter = () => copyBtn.style.opacity = "1";
copyBtn.onmouseleave = () => copyBtn.style.opacity = "0.7";

tooltip.appendChild(copyBtn);

// biến lưu nội dung tooltip
let currentTooltipText = "";

// =========================
// Hàm css tooltip
// =========================
function attachTooltip(el, text) {
  // ❌ bỏ tooltip mặc định browser
  el.removeAttribute("title");

  el.addEventListener("mouseenter", () => {
    clearTimeout(hideTooltipTimeout);

    tooltip.textContent = text;
    tooltip.style.paddingTop = "6px"; // hoặc "8px" tùy bạn

    // Hiện trước để lấy offsetWidth đúng
    tooltip.style.opacity = 1;

    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();

      // căn giữa tooltip theo element
      let left =
        rect.left + rect.width / 2 - tooltip.offsetWidth / 2;

      let top =
        rect.bottom + window.scrollY + 8;

      // tránh tràn màn hình trái/phải
      if (left < 8) left = 8;
      if (left + tooltip.offsetWidth > window.innerWidth - 8) {
        left = window.innerWidth - tooltip.offsetWidth - 8;
      }

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    });
  });

  el.addEventListener("mouseleave", () => {
    hideTooltipTimeout = setTimeout(() => {
      tooltip.style.opacity = 0;
    }, 150);
  });
}


// =========================
// Hàm render bảng
// =========================
let hideTooltipTimeout;
// Menu chuột phải: ghim mọi dòng, sửa/xóa riêng dòng gửi nhiều tin.
let draggingPinnedKey = null;
// Gợi ý kéo thả riêng, không dùng title mặc định của trình duyệt.
const pinDragHint = document.createElement("div");
pinDragHint.setAttribute("role", "tooltip");
pinDragHint.style.cssText = "position:fixed;z-index:2147483647;display:none;pointer-events:none;max-width:225px;padding:7px 10px;border:1px solid #bfdbfe;border-radius:8px;background:#f0f7ff;color:#174ea6;box-shadow:0 5px 18px #1e40af24;font:12px/1.45 Segoe UI,Arial,sans-serif;white-space:normal;";
pinDragHint.textContent = "↕ Giữ và kéo để đổi thứ tự dòng đã ghim";
document.body.appendChild(pinDragHint);
let pinHintTimer = null;
function hidePinDragHint(){clearTimeout(pinHintTimer);pinHintTimer=null;pinDragHint.style.display="none";}
function showPinDragHint(event){
    hidePinDragHint();
    if(draggingPinnedKey || event.target.closest("button")) return;
    const x=event.clientX,y=event.clientY;
    pinHintTimer=setTimeout(()=>{
        if(draggingPinnedKey) return;
        pinDragHint.style.display="block";
        pinDragHint.style.left=Math.max(6,Math.min(x+12,innerWidth-pinDragHint.offsetWidth-6))+"px";
        pinDragHint.style.top=Math.max(6,Math.min(y+14,innerHeight-pinDragHint.offsetHeight-6))+"px";
    },420);
}

function movePinnedRow(sourceKey, targetKey, insertAfter) {
    if(sourceKey === targetKey || !pinnedRows.includes(sourceKey) || !pinnedRows.includes(targetKey)) return;
    const next=pinnedRows.filter(k=>k!==sourceKey);
    const targetIndex=next.indexOf(targetKey);
    next.splice(targetIndex+(insertAfter?1:0),0,sourceKey);
    pinnedRows=next;
    savePins();
    renderRows();
}
const rowMenu = document.createElement("div");
rowMenu.style.cssText = "display:none;position:fixed;z-index:2147483646;min-width:170px;padding:5px;background:#fff;border:1px solid #dce4ef;border-radius:8px;box-shadow:0 8px 26px #0003;font:13px Segoe UI,Arial,sans-serif";
document.body.appendChild(rowMenu);
function hideRowMenu(){rowMenu.style.display="none";}
function showRowMenu(event, r) {
    event.preventDefault();event.stopPropagation();hideRowMenu();hidePinDragHint();tooltip.style.opacity=0;
    rowMenu.replaceChildren();
    const action=(label,callback)=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.style.cssText="display:block;width:100%;padding:9px 11px;text-align:left;background:transparent;border:0;border-radius:5px;cursor:pointer;color:#24344a";b.onmouseenter=()=>b.style.background="#e7f1ff";b.onmouseleave=()=>b.style.background="transparent";b.onclick=()=>{hideRowMenu();callback();};rowMenu.appendChild(b);};
    const key=rowKey(r), isPinned=pinnedRows.includes(key);
    action(isPinned ? "Bỏ ghim dòng" : "Ghim dòng lên đầu",()=>{pinnedRows=isPinned?pinnedRows.filter(k=>k!==key):[...pinnedRows.filter(k=>k!==key),key];savePins();renderRows();});
    if(r.sequence){
        action("Sửa dòng gửi nhiều tin",()=>openSequenceEditor(r.sequence));
        action("Xóa dòng gửi nhiều tin",()=>{if(!confirm("Xóa dòng gửi này?"))return;sequences=sequences.filter(x=>x!==r.sequence);pinnedRows=pinnedRows.filter(k=>k!==key);savePins();saveSequences();renderRows();});
    }
    rowMenu.style.display="block";
    const left=Math.max(5,Math.min(event.clientX,innerWidth-rowMenu.offsetWidth-5));
    const top=Math.max(5,Math.min(event.clientY,innerHeight-rowMenu.offsetHeight-5));
    rowMenu.style.left=left+"px";rowMenu.style.top=top+"px";
}
document.addEventListener("click",hideRowMenu);
document.addEventListener("keydown",e=>{if(e.key==="Escape")hideRowMenu();});
window.addEventListener("scroll",hideRowMenu,true);
function renderRows(){ 
    Array.from(table.querySelectorAll("tr[data-row='true']")).forEach(tr=>tr.remove()); 
    allRows().forEach(r=>{ 
        const tr=document.createElement("tr"); 
        tr.setAttribute("data-row","true"); 
        tr.setAttribute("data-id",r.id.toLowerCase());
        if (r.sequence) { tr.style.background = "#e7f1ff"; tr.style.color = "#174ea6"; }
        const pinnedKey=rowKey(r);
        if (pinnedRows.includes(pinnedKey)) {
            tr.style.boxShadow = "inset 3px 0 #e3a008";
            tr.draggable = true;
            tr.removeAttribute("title");
            tr.style.cursor = "grab";
            tr.addEventListener("mouseenter",showPinDragHint);
            tr.addEventListener("mouseleave",hidePinDragHint);
            tr.addEventListener("mousedown",hidePinDragHint);
            tr.addEventListener("dragstart", e => {
                if (e.target.closest && e.target.closest("button")) {e.preventDefault();return;}
                draggingPinnedKey=pinnedKey;
                hidePinDragHint();
                e.dataTransfer.effectAllowed="move";
                e.dataTransfer.setData("text/plain",pinnedKey);
                tr.style.opacity="0.55";
                tooltip.style.opacity=0;
                hideRowMenu();
            });
            tr.addEventListener("dragover", e => {
                if(!draggingPinnedKey || draggingPinnedKey===pinnedKey) return;
                e.preventDefault();
                e.dataTransfer.dropEffect="move";
                const after=e.clientY>tr.getBoundingClientRect().top+tr.getBoundingClientRect().height/2;
                tr.style.outline=after?"2px solid #2563eb":"2px solid #0b74de";
                tr.style.outlineOffset=after?"-2px":"2px";
            });
            tr.addEventListener("dragleave",()=>{tr.style.outline="";tr.style.outlineOffset="";});
            tr.addEventListener("drop",e=>{
                e.preventDefault();
                const after=e.clientY>tr.getBoundingClientRect().top+tr.getBoundingClientRect().height/2;
                tr.style.outline="";tr.style.outlineOffset="";
                const source=draggingPinnedKey;
                draggingPinnedKey=null;
                if(source)movePinnedRow(source,pinnedKey,after);
            });
            tr.addEventListener("dragend",()=>{
                draggingPinnedKey=null;
                tr.style.opacity="";
                tr.style.outline="";
                tr.style.outlineOffset="";
            });
        }
        tr.addEventListener("contextmenu", e => showRowMenu(e,r));

        const td1=document.createElement("td"); 
        td1.innerText=r.id; 
        td1.style.padding="6px"; 
        td1.style.textAlign="left"; 
        td1.style.borderBottom="1px solid #f1f1f1"; 
        tr.appendChild(td1); 

        const td2=document.createElement("td"); 
        td2.textContent = r.text;
        td2.style.whiteSpace = "pre-wrap";
        td2.style.padding="6px 8px"; 
        td2.style.whiteSpace="nowrap"; 
        td2.style.overflow="hidden"; 
        td2.style.textOverflow="ellipsis";
        td2.style.maxHeight = "20px";          // đảm bảo không vượt ô 
        td2.style.borderBottom="1px solid #f1f1f1"; 
        td2.onmouseenter = (e) => {
            clearTimeout(hideTooltipTimeout);
            currentTooltipText = r.text;

            tooltip.innerHTML = "";

            // ✅ chỉ thêm padding khi có nút copy
            tooltip.style.paddingTop = "28px";

            tooltip.appendChild(copyBtn);
            tooltip.appendChild(createFragmentFromText(r.text));

            const rect = td2.getBoundingClientRect();
            tooltip.style.left = Math.max(8, rect.left + window.scrollX - tooltip.offsetWidth - 8) + "px";
            let topPos = rect.top + window.scrollY;
            if (topPos + tooltip.offsetHeight > window.scrollY + window.innerHeight)
                topPos = window.scrollY + window.innerHeight - tooltip.offsetHeight - 8;
            if (topPos < window.scrollY) topPos = window.scrollY + 8;
            tooltip.style.top = topPos + "px";

            tooltip.style.opacity = 1;
            tooltip.style.transform = "translateX(0)";
            tooltip.style.pointerEvents = "auto"; // ✅ Cho phép hover tooltip
            };

            td2.onmouseleave = (e) => {
            hideTooltipTimeout = setTimeout(() => {
                tooltip.style.opacity = 0;
                tooltip.style.transform = "translateX(-8px)";
                tooltip.style.pointerEvents = "none"; // ✅ Ngăn nhận chuột, khử hiệu ứng text-select
            }, 200);
            };

            tooltip.onmouseenter = () => {
            clearTimeout(hideTooltipTimeout);
            };

            tooltip.onmouseleave = () => {
            tooltip.style.opacity = 0;
            tooltip.style.transform = "translateX(-8px)";   
            tooltip.style.pointerEvents = "none"; // ✅ Khử chọn chữ khi ẩn
            };

        tr.appendChild(td2); 

        const td3=document.createElement("td"); 
        td3.style.padding="6px"; 
        td3.style.textAlign="center"; 
        td3.style.borderBottom="1px solid #f1f1f1"; 
        const btn=document.createElement("button"); 
        btn.innerText="Send"; 
        btn.style.padding="6px 10px"; 
        btn.style.cursor="pointer"; 
        btn.style.border="1px solid #2e8b57"; 
        btn.style.borderRadius="6px"; 
        btn.style.background=r.sequence ? "#0b74de" : "#2e8b57"; 
        btn.style.color="#fff"; 
       btn.draggable = false;
       btn.addEventListener("mousedown",e=>e.stopPropagation());
       btn.onclick = () => r.sequence ? runSequence(r.sequence, btn) : sendMessage(r.text).catch(e => alert(e.message));
       td3.appendChild(btn);
        tr.appendChild(td3); 

        table.appendChild(tr); 
    }); 
    const keyword=searchInput.value.toLowerCase();
    Array.from(table.querySelectorAll("tr[data-row='true']")).forEach(tr=>{tr.style.display=!keyword||tr.getAttribute("data-id").includes(keyword)?"":"none";});
    container.style.height = "auto";
} 
renderRows(); 

// =========================
// Search
// =========================
searchInput.addEventListener("input",()=>{ 
    const keyword=searchInput.value.toLowerCase(); 
    Array.from(table.querySelectorAll("tr[data-row='true']")).forEach(tr=>{ 
        const idText=tr.getAttribute("data-id"); 
        tr.style.display=!keyword||idText.includes(keyword)?"":"none"; 
    }); 
}); 

// =========================
// Import Excel
// =========================
importInput.addEventListener("change",async e=>{ 
    const file=e.target.files[0]; 
    if(!file) return; 
    const data=await file.arrayBuffer(); 
    if(!window.XLSX){ 
        const script=document.createElement("script"); 
        script.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; 
        script.onload=()=>parseExcel(data); 
        document.body.appendChild(script); 
    }else parseExcel(data); 
}); 

let gsImportTimer = null;

async function importFromGoogleSheetByInput(url){

    if (!url || !url.trim()) {
        clearAllRows();
        return false;
    }

    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
        clearAllRows();
        return false;
    }

    const sheetId = match[1];
    const jsonUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    try {
        const res = await fetch(jsonUrl);
        if (!res.ok) throw new Error("fetch fail");

        const text = await res.text();

        const json = JSON.parse(
            text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
        );

        clearAllRows();

        json.table.rows.forEach(r => {
            const id = r.c[0]?.v?.toString().trim();
            const value = r.c[1]?.v?.toString() || "";

            if (!id || !value) return;
            if (id.toLowerCase() === "id") return;

            addRow(id, value);
        });

        renderRows();
        return true;

    } catch (e) {
        console.error(e);
        clearAllRows();
        return false;
    }
}

function parseExcel(data){ 
    const wb=XLSX.read(data,{type:"array"}); 
    const sheet=wb.Sheets[wb.SheetNames[0]]; 
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }); 
    json.forEach((row) => { 
        if (!row || row.length < 2) return; 
        const id = row[0]?.toString().trim(); 
        const text = row[1]?.toString().trim(); 
        if (!id || !text) return; 
        if (id.toLowerCase()==="id" || text.toLowerCase()==="text") return; 
        addRow(id, text); 
    }); 
    renderRows(); 
} 

tableWrapper.appendChild(table); 
container.appendChild(tableWrapper); 
document.body.appendChild(container); 
// 🔁 Auto load Google Sheets khi reload trang
const savedSheet = window.top.localStorage.getItem("GLOBAL_GSHEET_LINK");

if (savedSheet) {
    gsInput.value = savedSheet;

    setReloadState("loading");
    importFromGoogleSheetByInput(savedSheet)
        .then(ok => {
            if (ok) setReloadState("success");
            else setReloadState("error");
        });
}

// Cho phép kéo thả container
let isDragging = false;
let offsetX, offsetY;

toggleBtn.style.cursor = "move"; // đổi thành tay kéo khi rê vào header

toggleBtn.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    document.body.style.userSelect = "none"; // tránh bôi đen chữ khi kéo
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        container.style.left = (e.clientX - offsetX) + "px";
        container.style.top = (e.clientY - offsetY) + "px";
        container.style.right = "auto"; // bỏ cố định right
        container.style.bottom = "auto"; // bỏ cố định bottom
        container.style.position = "fixed";
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "auto";
});

copyBtn.addEventListener("click", async () => {
    if (!currentTooltipText) return;

    try {
        await navigator.clipboard.writeText(currentTooltipText);

        copyBtn.innerText = "✓";
        setTimeout(() => {
            copyBtn.innerText = "Copy";
        }, 1000);
    } catch (e) {
        console.error("Copy failed", e);
    }
});

// Thêm nút kéo resize ở góc phải dưới
const resizeHandle = document.createElement("div");
resizeHandle.style.width = "12px";
resizeHandle.style.height = "12px";
resizeHandle.style.background = "rgba(0,0,0,0.3)";
resizeHandle.style.position = "absolute";
resizeHandle.style.right = "2px";
resizeHandle.style.bottom = "2px";
resizeHandle.style.cursor = "nwse-resize";
resizeHandle.style.borderRadius = "2px";
container.appendChild(resizeHandle);

let isResizing = false, startX, startY, startWidth, startHeight;

resizeHandle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = container.offsetWidth;
    startHeight = container.offsetHeight;
    document.body.style.userSelect = "none";
});

document.addEventListener("mousemove", (e) => {
    if (isResizing) {
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        container.style.width = newWidth + "px";
        container.style.height = newHeight + "px";
    }
});

document.addEventListener("mouseup", () => {
    isResizing = false;
    document.body.style.userSelect = "auto";
});

let isVisible = true;


document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.code === "Space") {
        isVisible = !isVisible;
        container.style.display = isVisible ? "block" : "none";
        e.preventDefault();
    }
});

})();
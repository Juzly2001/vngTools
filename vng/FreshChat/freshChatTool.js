javascript:(()=>{ 
const ID="mini-excel-chat-tool-left-tooltip"; 
if(document.getElementById(ID))document.getElementById(ID).remove(); 

const rows=[ 
    {id:"HT - St1",text:"Cảm ơn anh/chị đã liên hệ đến Fanpage chính thức của Zalopay. Em là Phương, xin phép hỗ trợ anh/chị ạ."}, 
    {id:"HT - St2",text:"Em có thể hỗ trợ thông tin gì cho mình ạ?"}, 
    {id:"HT - dva",text:"Dạ vâng ạ"}, 
    {id:"HT - Hỗ trợ thêm",text:"Dạ Anh/chị còn cần em hỗ trợ thêm thông tin gì khác nữa không ạ?"} 
]; 

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

function addRow(id, text){ rows.push({id, text}); } 
function clearAllRows(){ rows.length = 0; renderRows(); }

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

// --- Container Chính & Khôi Phục Vị Trí Đã Lưu ---
const CONTAINER_POS_KEY = "FRESHCHAT_CONTAINER_POS_V1";
let savedPos = null;
try { savedPos = JSON.parse(localStorage.getItem(CONTAINER_POS_KEY)); } catch(_) {}

const container=document.createElement("div"); 
container.id=ID; 
let initialCss = "position:fixed;z-index:999999;background:#fff;border:1px solid #d0d7de;box-shadow:0 8px 24px rgba(0,0,0,0.15);border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:13px;width:420px;min-width:280px;overflow:hidden;display:flex;flex-direction:column;";
if (savedPos && typeof savedPos.left === "string" && typeof savedPos.top === "string") {
    initialCss += `left:${savedPos.left};top:${savedPos.top};`;
} else {
    initialCss += "top:10px;right:10px;";
}
container.style.cssText = initialCss;

// --- Header / Nút Toggle ---
const toggleBtn=document.createElement("button"); 
toggleBtn.innerText="⚡ FreshChat Support"; 
attachTooltip(toggleBtn, "Ẩn/Hiện FreshChat Tool ((Ctrl hoặc ⌘) + Space)");
toggleBtn.style.cssText="width:100%;padding:10px 12px;cursor:move;border:none;background:linear-gradient(135deg, #0969da, #024ea2);color:#fff;font-size:15px;font-weight:600;border-top-left-radius:10px;border-top-right-radius:10px;text-align:left;display:flex;align-items:center;justify-content:space-between;";
container.appendChild(toggleBtn); 

// --- Menu ⋯ ---
const toolMenuBtn = document.createElement("button");
toolMenuBtn.textContent = "⋯";
toolMenuBtn.style.cssText = "position:absolute;right:8px;top:7px;width:30px;height:28px;border:0;border-radius:6px;background:rgba(255,255,255,0.15);color:#fff;font-size:18px;line-height:26px;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;transition:background 0.2s;";
toolMenuBtn.onmouseenter = () => toolMenuBtn.style.background = "rgba(255,255,255,0.3)";
toolMenuBtn.onmouseleave = () => toolMenuBtn.style.background = "rgba(255,255,255,0.15)";

const toolMenu = document.createElement("div");
toolMenu.style.cssText = "display:none;position:absolute;right:8px;top:42px;min-width:210px;padding:6px;background:#fff;border:1px solid #d0d7de;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:10;box-sizing:border-box";

const toolMenuItemStyle = "display:flex;align-items:center;gap:10px;width:100%;min-height:36px;padding:8px 10px;box-sizing:border-box;border:0;border-radius:6px;background:transparent;color:#24292f;text-align:left;cursor:pointer;font:13px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:18px;transition:background 0.15s;";
function styleToolMenuItem(button, icon, label) {
    button.style.cssText = toolMenuItemStyle;
    button.replaceChildren();
    const symbol = document.createElement("span");
    symbol.textContent = icon;
    symbol.style.cssText = "display:inline-flex;align-items:center;justify-content:center;flex:0 0 18px;width:18px;height:18px;font-size:14px;";
    const text = document.createElement("span");
    text.textContent = label;
    button.append(symbol, text);
    button.onmouseenter = () => button.style.background = "#f3f4f6";
    button.onmouseleave = () => button.style.background = "transparent";
    return text;
}

const sequenceAddBtn = document.createElement("button");
sequenceAddBtn.type = "button";
styleToolMenuItem(sequenceAddBtn, "+", "Tạo dòng gửi nhiều tin");
sequenceAddBtn.onclick = () => { toolMenu.style.display="none"; openSequenceEditor(); };
toolMenu.appendChild(sequenceAddBtn);

const keyMenuBtn = document.createElement("button");
keyMenuBtn.type = "button";
styleToolMenuItem(keyMenuBtn, "+", "Tạo / Import Key");
keyMenuBtn.onclick = () => { toolMenu.style.display="none"; openAddKeyModal(); };
toolMenu.appendChild(keyMenuBtn);

const keyboardMenuBtn = document.createElement("button");
keyboardMenuBtn.type = "button";
const keyboardMenuLabel = styleToolMenuItem(keyboardMenuBtn, "⌨", "Hiện phím ảo");
keyboardMenuBtn.onclick = () => { 
    toolMenu.style.display="none"; 
    keyboardToggle.click(); 
    keyboardMenuLabel.textContent = keyboard.style.display === "none" ? "Hiện phím ảo" : "Ẩn phím ảo"; 
};
toolMenu.appendChild(keyboardMenuBtn);
container.append(toolMenuBtn, toolMenu);

toolMenuBtn.onclick = e => { e.stopPropagation(); toolMenu.style.display = toolMenu.style.display === "none" ? "block" : "none"; };
document.addEventListener("pointerdown", e => {
    if (!toolMenu.contains(e.target) && !toolMenuBtn.contains(e.target)) toolMenu.style.display = "none";
}, true);
document.addEventListener("keydown", e => { if (e.key === "Escape") toolMenu.style.display = "none"; });

// --- Vùng Table & Tools ---
const tableWrapper=document.createElement("div"); 
tableWrapper.style.cssText="padding:10px;max-height:75vh;overflow:auto;"; 

const table=document.createElement("table"); 
table.style.cssText="border-collapse:collapse;width:100%;table-layout:fixed;"; 

const headerTools = document.createElement("tr");
const thTools = document.createElement("th");
thTools.colSpan = 3;
thTools.style.cssText = "padding:8px 10px;text-align:left;background:#f6f8fa;border-bottom:1px solid #d0d7de;";

// Google Sheet Input & Reload
const gsContainer = document.createElement("div");
gsContainer.style.cssText = "display:flex;align-items:center;gap:6px;margin-bottom:8px;";

const gsInput = document.createElement("input");
gsInput.type = "text";
gsInput.placeholder = "🔗 Dán link Google Sheets (public)...";
gsInput.style.cssText = "height:34px;padding:0 10px;border:1px solid #d0d7de;border-radius:6px;outline:none;width:100%;font-size:13px;background:#fff;";
gsInput.addEventListener("input", (e) => {
    const url = e.target.value.trim();
    if (url) window.top.localStorage.setItem("GLOBAL_GSHEET_LINK", url);
    else localStorage.removeItem("GLOBAL_GSHEET_LINK");
    importFromGoogleSheetByInput(url);
});

const reloadBtn = document.createElement("button");
reloadBtn.innerHTML = "🔄";
reloadBtn.style.cssText = "height:34px;min-width:36px;border:1px solid #d0d7de;border-radius:6px;background:#fff;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:background 0.2s;";
attachTooltip(reloadBtn, "Reload Google Sheet");
reloadBtn.onmouseenter = () => reloadBtn.style.background = "#f3f4f6";
reloadBtn.onmouseleave = () => reloadBtn.style.background = "#fff";

function setReloadState(state) {
    if (state === "loading") { reloadBtn.innerHTML = "⏳"; reloadBtn.style.pointerEvents = "none"; }
    else if (state === "success") { reloadBtn.innerHTML = "✅"; reloadBtn.style.pointerEvents = "none"; setTimeout(() => { reloadBtn.innerHTML = "🔄"; reloadBtn.style.pointerEvents = "auto"; }, 1500); }
    else if (state === "error") { reloadBtn.innerHTML = "❌"; reloadBtn.style.pointerEvents = "none"; setTimeout(() => { reloadBtn.innerHTML = "🔄"; reloadBtn.style.pointerEvents = "auto"; }, 1500); }
    else { reloadBtn.innerHTML = "🔄"; reloadBtn.style.pointerEvents = "auto"; }
}

reloadBtn.addEventListener("click", async () => {
    const url = gsInput.value.trim();
    if (!url) return;
    setReloadState("loading");
    const ok = await importFromGoogleSheetByInput(url);
    if (ok) setReloadState("success"); else setReloadState("error");
});

gsContainer.appendChild(gsInput);
gsContainer.appendChild(reloadBtn);
thTools.appendChild(gsContainer);

// Ô tìm kiếm & công cụ phụ
const searchContainer = document.createElement("div");
searchContainer.style.cssText = "display:flex;align-items:center;border:1px solid #d0d7de;border-radius:6px;padding:0 8px;height:34px;background:#fff;width:100%;box-sizing:border-box;";

const searchInput = document.createElement("input");
searchInput.placeholder = "Tìm theo ID hoặc nội dung...";
searchInput.style.cssText = "border:none;outline:none;padding:4px;height:100%;width:100%;font-size:13px;background:transparent;";
searchInput.addEventListener("input", (e) => renderRows(e.target.value));

const clearBtn = document.createElement("button");
clearBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15"><path fill="none" stroke="#57606a" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6l-12 12"/></svg>`;
clearBtn.style.cssText = "display:flex;align-items:center;justify-content:center;width:22px;height:22px;border:none;background:transparent;cursor:pointer;padding:0;";
attachTooltip(clearBtn, "Xóa tìm kiếm");
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("input"));
});

const keyboardToggle = document.createElement("button");
keyboardToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="#57606a" stroke-width="2"/><path stroke="#57606a" stroke-width="2" stroke-linecap="round" d="M7 9h.01M11 9h.01M15 9h.01M7 13h10M7 17h10"/></svg>`;
keyboardToggle.style.cssText = "display:none;";

searchContainer.appendChild(searchInput);
searchContainer.appendChild(clearBtn);
thTools.appendChild(searchContainer);

// --- Hàm Telex Tiếng Việt ---
function applyVietnameseTelex(str) {
  str = str.replace(/dd/g, "đ").replace(/aa/g, "â").replace(/aw/g, "ă").replace(/ee/g, "ê").replace(/oo/g, "ô").replace(/ow/g, "ơ").replace(/uw/g, "ư");
  str = str
    .replace(/(a|ă|â|e|ê|i|o|ô|ơ|u|ư|y)s/g, (_, m) => ({a:"á",ă:"ắ",â:"ấ",e:"é",ê:"ế",i:"í",o:"ó",ô:"ố",ơ:"ớ",u:"ú",ư:"ứ",y:"ý"}[m]||m))
    .replace(/(a|ă|â|e|ê|i|o|ô|ơ|u|ư|y)f/g, (_, m) => ({a:"à",ă:"ằ",â:"ầ",e:"è",ê:"ề",i:"ì",o:"ò",ô:"ồ",ơ:"ờ",u:"ù",ư:"ừ",y:"ỳ"}[m]||m))
    .replace(/(a|ă|â|e|ê|i|o|ô|ơ|u|ư|y)r/g, (_, m) => ({a:"ả",ă:"ẳ",â:"ẩ",e:"ẻ",ê:"ể",i:"ỉ",o:"ỏ",ô:"ổ",ơ:"ở",u:"ủ",ư:"ử",y:"ỷ"}[m]||m))
    .replace(/(a|ă|â|e|ê|i|o|ô|ơ|u|ư|y)x/g, (_, m) => ({a:"ã",ă:"ẵ",â:"ẫ",e:"ẽ",ê:"ễ",i:"ĩ",o:"õ",ô:"ỗ",ơ:"ỡ",u:"ũ",ư:"ữ",y:"ỹ"}[m]||m))
    .replace(/(a|ă|â|e|ê|i|o|ô|ơ|u|ư|y)j/g, (_, m) => ({a:"ạ",ă:"ặ",â:"ậ",e:"ẹ",ê:"ệ",i:"ị",o:"ọ",ô:"ộ",ơ:"ợ",u:"ụ",ư:"ự",y:"ỵ"}[m]||m));
  return str;
}

// --- Bàn phím ảo ---
const keyboard = document.createElement("div");
keyboard.style.cssText = "display:none;margin-top:8px;padding:8px;background:#f6f8fa;border:1px solid #d0d7de;border-radius:8px;text-align:center;font-family:monospace;";
const rowsKeys = ["Q W E R T Y U I O P", "A S D F G H J K L", "Z X C V B N M"];

rowsKeys.forEach((row) => {
  const rowDiv = document.createElement("div");
  rowDiv.style.margin = "3px 0";
  row.split(" ").forEach((key) => {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.style.cssText = "margin:2px;padding:5px 9px;border:1px solid #d0d7de;border-radius:6px;cursor:pointer;background:#fff;font-weight:500;font-size:12px;box-shadow:0 1px 2px rgba(0,0,0,0.05);transition:background 0.1s;";
    btn.addEventListener("click", () => {
      let current = searchInput.value;
      searchInput.value = applyVietnameseTelex(current + key.toLowerCase());
      searchInput.dispatchEvent(new Event("input"));
    });
    btn.addEventListener("mousedown", () => (btn.style.background = "#e1e4e8"));
    btn.addEventListener("mouseup", () => (btn.style.background = "#fff"));
    rowDiv.appendChild(btn);
  });
  keyboard.appendChild(rowDiv);
});

keyboardToggle.addEventListener("click", () => {
  keyboard.style.display = keyboard.style.display === "none" ? "block" : "none";
});

const extraRow = document.createElement("div");
extraRow.style.cssText = "display:flex;gap:6px;justify-content:center;margin-top:6px;";

const spaceBtn = document.createElement("button");
spaceBtn.textContent = "Space";
spaceBtn.style.cssText = "padding:5px 24px;border-radius:6px;border:1px solid #d0d7de;cursor:pointer;font-weight:500;background:#fff;font-size:12px;box-shadow:0 1px 2px rgba(0,0,0,0.05);";
spaceBtn.addEventListener("click", () => { searchInput.value += " "; searchInput.dispatchEvent(new Event("input")); });

const backspaceBtn = document.createElement("button");
backspaceBtn.textContent = "←";
backspaceBtn.style.cssText = "padding:5px 12px;border-radius:6px;border:1px solid #d0d7de;cursor:pointer;font-weight:600;background:#fff;font-size:12px;box-shadow:0 1px 2px rgba(0,0,0,0.05);";
backspaceBtn.addEventListener("click", () => { searchInput.value = searchInput.value.slice(0, -1); searchInput.dispatchEvent(new Event("input")); });

extraRow.appendChild(spaceBtn);
extraRow.appendChild(backspaceBtn);
keyboard.appendChild(extraRow);
thTools.appendChild(keyboard);

// --- Phím tắt nhanh (Shortcuts) - Cố định 8 nút trên 1 dòng ---
const shortcutContainer = document.createElement("div");
// Chia tỷ lệ phần trăm flex để ép đúng 8 nút nằm gọn hàng ngang, căn đều khoảng cách
shortcutContainer.style.cssText = "display:flex;gap:3px;margin-top:8px;align-items:center;width:100%;box-sizing:border-box;";

const shortcuts = ["HT", "KT", "LH", "CC", "TK", "GD", "KM", "PAY"];

function renderShortcuts() {
  shortcutContainer.innerHTML = "";
  shortcuts.forEach((key, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = key;
    // Thiết lập flex: 1 1 0 để chia đều 8 nút trên 1 dòng, giảm padding/font chữ để dễ bấm và không bị tràn
    btn.style.cssText = "flex:1 1 0;min-width:0;padding:4px 2px;border:1px solid #d0d7de;border-radius:5px;background:#fff;color:#24292f;font-weight:600;font-size:11px;cursor:pointer;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 1px 2px rgba(0,0,0,0.03);transition:all 0.15s;";
    btn.onmouseenter = () => { btn.style.background = "#0969da"; btn.style.color = "#fff"; btn.style.borderColor = "#0969da"; };
    btn.onmouseleave = () => { btn.style.background = "#fff"; btn.style.color = "#24292f"; btn.style.borderColor = "#d0d7de"; };
    
    btn.addEventListener("click", (e) => {
      if (e.shiftKey) { shortcuts.splice(idx, 1); renderShortcuts(); }
      else { searchInput.value = key; searchInput.dispatchEvent(new Event("input")); }
    });
    
    attachTooltip(btn, `Nhấn để tìm "${key}"\n(Giữ Shift + Click để xóa key)`);
    shortcutContainer.appendChild(btn);
  });
}

function openAddKeyModal() {
  if (typeof XLSX === "undefined") {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    document.head.appendChild(script);
  }

  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999999;display:flex;align-items:center;justify-content:center;";
  
  const popup = document.createElement("div");
  popup.style.cssText = "background:#fff;padding:20px;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,0.15);width:320px;text-align:center;font-family:sans-serif;";
  overlay.appendChild(popup);

  const title = document.createElement("h4");
  title.textContent = "Tạo hoặc import key tắt";
  title.style.cssText = "margin:0 0 12px 0;font-size:15px;color:#24292f;";
  popup.appendChild(title);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Nhập key (VD: zalo, ht1...)";
  input.style.cssText = "width:100%;padding:8px;box-sizing:border-box;margin-bottom:12px;border:1px solid #d0d7de;border-radius:6px;outline:none;";
  popup.appendChild(input);

  const importBox = document.createElement("div");
  importBox.style.cssText = "border:2px dashed #d0d7de;border-radius:8px;padding:12px;margin-bottom:12px;background:#f6f8fa;cursor:pointer;font-size:13px;color:#57606a;";
  importBox.textContent = "📂 Chọn file Excel để import key";
  popup.appendChild(importBox);

  const fileInput = document.createElement("input");
  fileInput.type = "file"; fileInput.accept = ".xls,.xlsx"; fileInput.style.display = "none";
  importBox.appendChild(fileInput);

  const btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex;justify-content:center;gap:8px;";
  popup.appendChild(btnRow);

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Tạo";
  submitBtn.style.cssText = "padding:6px 14px;border-radius:6px;border:none;background:#0969da;color:#fff;font-weight:600;cursor:pointer;";
  btnRow.appendChild(submitBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Hủy";
  cancelBtn.style.cssText = "padding:6px 14px;border-radius:6px;border:none;background:#f3f4f6;color:#24292f;font-weight:600;cursor:pointer;";
  btnRow.appendChild(cancelBtn);

  document.body.appendChild(overlay);
  input.focus();

  const submitKey = () => {
    const key = input.value.trim();
    if (!key) return alert("Vui lòng nhập tên key!");
    shortcuts.push(key);
    renderShortcuts();
    document.body.removeChild(overlay);
  };

  submitBtn.onclick = submitKey;
  input.onkeydown = e => { if (e.key === "Enter") submitKey(); };
  cancelBtn.onclick = () => document.body.removeChild(overlay);
  importBox.onclick = () => fileInput.click();
  fileInput.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const data = new Uint8Array(ev.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      json.forEach(row => {
        const key = row[0]?.toString().trim();
        if (key && !shortcuts.includes(key)) shortcuts.push(key);
      });
      renderShortcuts();
      document.body.removeChild(overlay);
    };
    reader.readAsArrayBuffer(file);
  };
}

thTools.appendChild(shortcutContainer);
renderShortcuts();
headerTools.appendChild(thTools);
table.appendChild(headerTools);

// --- Sequence Editor Modal ---
function openSequenceEditor(existing = null) {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;";
    
    const panel = document.createElement("div");
    panel.style.cssText = "width:min(680px,100%);max-height:85vh;overflow:auto;background:white;border-radius:12px;padding:20px;box-sizing:border-box;color:#24292f;font:13px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 12px 40px rgba(0,0,0,0.2);";
    overlay.appendChild(panel);

    const heading = document.createElement("h3"); 
    heading.textContent = existing ? "Sửa dòng gửi nhiều tin" : "Tạo dòng gửi nhiều tin"; 
    heading.style.cssText = "margin:0 0 12px 0;font-size:16px;";
    panel.appendChild(heading);

    const makeInputLbl = (text, el) => { 
        const wrap=document.createElement("label");
        wrap.style.cssText="display:block;margin-bottom:10px;font-weight:500;";
        wrap.append(document.createTextNode(text),el);
        panel.appendChild(wrap);
        return el; 
    };

    const name = document.createElement("input"); 
    name.placeholder="Nhập ID hiển thị ở cột 1"; 
    name.value=existing?.id || ""; 
    name.style.cssText="display:block;width:100%;box-sizing:border-box;padding:8px;margin-top:4px;border:1px solid #d0d7de;border-radius:6px;outline:none;";
    makeInputLbl("ID của dòng mới", name);

    const delay = document.createElement("input"); 
    delay.type="number"; delay.min="300"; delay.step="100"; delay.value=existing?.delay || 1000;
    delay.style.cssText=name.style.cssText;
    makeInputLbl("Thời gian chờ giữa các tin (ms)", delay);

    const search = document.createElement("input");
    search.placeholder="Tìm mẫu câu để thêm..."; 
    search.style.cssText=name.style.cssText;
    makeInputLbl("Chọn mẫu câu từ dữ liệu hiện tại", search);

    const choices = document.createElement("div");
    choices.style.cssText="max-height:160px;overflow:auto;border:1px solid #d0d7de;border-radius:6px;margin-bottom:12px;";
    panel.appendChild(choices);

    const selectedTitle=document.createElement("h4"); 
    selectedTitle.textContent="Thứ tự gửi (dùng ↑ ↓ để sắp xếp)";
    selectedTitle.style.cssText = "margin:0 0 6px 0;font-size:13px;";
    panel.appendChild(selectedTitle);

    const selectedList=document.createElement("div");
    selectedList.style.cssText="max-height:180px;overflow:auto;border:1px solid #d0d7de;border-radius:6px;padding:4px;";
    panel.appendChild(selectedList);

    let steps = existing ? existing.steps.map(x=>({...x})) : [];
    const makeBtn = (text, fn) => {
        const b=document.createElement("button");
        b.textContent=text; b.type="button";
        b.style.cssText="padding:4px 8px;margin:2px;border:1px solid #d0d7de;border-radius:5px;background:#f6f8fa;cursor:pointer;font-size:12px;";
        b.onclick=fn;
        return b;
    };

    function renderSelected() {
        selectedList.replaceChildren();
        if(steps.length === 0) {
            const empty = document.createElement("div");
            empty.textContent = "Chưa có bước nào được chọn.";
            empty.style.cssText = "padding:10px;text-align:center;color:#57606a;font-style:italic;";
            selectedList.appendChild(empty);
            return;
        }
        steps.forEach((step,i)=>{
            const row=document.createElement("div");
            row.style.cssText="border-bottom:1px solid #eee;padding:6px;display:flex;align-items:flex-start;gap:8px;background:#fff;";
            const content=document.createElement("div");
            content.style.cssText="flex:1;min-width:0;white-space:pre-wrap;overflow-wrap:anywhere;";
            const id=document.createElement("b"); id.textContent=`${i+1}. ${step.id}`;
            const body=document.createElement("div"); body.textContent=step.text;
            content.append(id,body); row.appendChild(content);
            row.append(makeBtn("↑",()=>{if(i){[steps[i-1],steps[i]]=[steps[i],steps[i-1]];renderSelected();}}),
                       makeBtn("↓",()=>{if(i<steps.length-1){[steps[i+1],steps[i]]=[steps[i],steps[i+1]];renderSelected();}}),
                       makeBtn("×",()=>{steps.splice(i,1);renderSelected();}));
            selectedList.appendChild(row);
        });
    }

    function renderChoices() {
        choices.replaceChildren();
        const q=search.value.trim().toLowerCase();
        rows.filter(r=>(r.id+" "+r.text).toLowerCase().includes(q)).forEach(r=>{
            const row=document.createElement("div");
            row.style.cssText="display:flex;gap:10px;padding:6px 8px;border-bottom:1px solid #f1f1f1;align-items:center;background:#fff;";
            const info=document.createElement("div");
            info.style.cssText="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
            const id=document.createElement("b"); id.textContent=r.id + ": ";
            info.append(id, document.createTextNode(r.text));
            row.append(info, makeBtn("+ Thêm",()=>{steps.push({id:r.id,text:r.text});renderSelected();}));
            choices.appendChild(row);
        });
    }

    search.oninput=renderChoices; 
    renderChoices(); 
    renderSelected();

    const actions=document.createElement("div");
    actions.style.cssText="display:flex;justify-content:flex-end;gap:6px;margin-top:16px;";
    
    actions.appendChild(makeBtn("Hủy",()=>overlay.remove()));
    if(existing) actions.appendChild(makeBtn("Xóa dòng",()=>{if(!confirm("Xóa dòng gửi này?"))return;sequences=sequences.filter(x=>x!==existing);saveSequences();renderRows();overlay.remove();}));
    
    const save=makeBtn("Lưu",()=>{
        const id=name.value.trim();
        if(!id){alert("Vui lòng nhập ID.");name.focus();return;}
        if(!steps.length){alert("Vui lòng chọn ít nhất một mẫu câu.");return;}
        const value={id,delay:Math.max(300,Number(delay.value)||1000),steps};
        if(existing) Object.assign(existing,value); else sequences.push(value);
        saveSequences(); renderRows(); overlay.remove();
    });
    save.style.cssText+=";background:#0969da;color:white;border-color:#0969da;";
    actions.appendChild(save);
    
    panel.appendChild(actions);
    document.body.appendChild(overlay);
}

// --- Tooltip Quản Lý ---
const tooltip = document.createElement("div");
tooltip.style.cssText = "position:absolute;background:#24292f;color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;max-width:280px;white-space:pre-wrap;z-index:9999999;opacity:0;transition:opacity 0.15s ease;pointer-events:none;user-select:text;cursor:text;max-height:180px;overflow-y:auto;box-shadow:0 4px 12px rgba(0,0,0,0.15);";
document.body.appendChild(tooltip);

const copyBtn = document.createElement("button");
copyBtn.innerText = "Copy";
copyBtn.style.cssText = "position:absolute;top:4px;right:6px;border:none;background:rgba(255,255,255,0.2);color:#fff;cursor:pointer;font-size:11px;padding:2px 6px;border-radius:4px;opacity:0.8;";
copyBtn.onmouseenter = () => copyBtn.style.opacity = "1";
copyBtn.onmouseleave = () => copyBtn.style.opacity = "0.8";
tooltip.appendChild(copyBtn);

let currentTooltipText = "";
let hideTooltipTimeout;

function handleTooltipEnter(el, text, isRowText = false, getRectFn) {
  clearTimeout(hideTooltipTimeout);
  currentTooltipText = text;
  
  if (isRowText) {
    tooltip.innerHTML = "";
    tooltip.style.paddingTop = "24px";
    tooltip.appendChild(copyBtn);
    tooltip.appendChild(createFragmentFromText(text));
  } else {
    tooltip.textContent = text;
    tooltip.style.paddingTop = "6px";
  }

  tooltip.style.pointerEvents = "auto";
  tooltip.style.opacity = 1;

  requestAnimationFrame(() => {
    const rect = getRectFn();
    let left = isRowText ? Math.max(6, rect.left + window.scrollX - tooltip.offsetWidth - 6) : (rect.left + rect.width / 2 - tooltip.offsetWidth / 2);
    let top = isRowText ? (rect.top + window.scrollY) : (rect.bottom + window.scrollY + 6);
    if (left < 6) left = 6;
    if (left + tooltip.offsetWidth > window.innerWidth - 6) left = window.innerWidth - tooltip.offsetWidth - 6;
    if (top + tooltip.offsetHeight > window.scrollY + window.innerHeight) top = window.scrollY + window.innerHeight - tooltip.offsetHeight - 6;
    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  });
}

function handleTooltipLeave() {
  hideTooltipTimeout = setTimeout(() => {
    if (!tooltip.matches(':hover')) {
      tooltip.style.opacity = 0;
      tooltip.style.pointerEvents = "none";
    }
  }, 200);
}

tooltip.addEventListener("mouseenter", () => clearTimeout(hideTooltipTimeout));
tooltip.addEventListener("mouseleave", () => {
  tooltip.style.opacity = 0;
  tooltip.style.pointerEvents = "none";
});

function attachTooltip(el, text) {
  el.removeAttribute("title");
  el.addEventListener("mouseenter", () => handleTooltipEnter(el, text, false, () => el.getBoundingClientRect()));
  el.addEventListener("mouseleave", handleTooltipLeave);
}

// --- Row Context Menu & Drag Drop ---
let draggingPinnedKey = null;
const pinDragHint = document.createElement("div");
pinDragHint.style.cssText = "position:fixed;z-index:2147483647;display:none;pointer-events:none;padding:5px 8px;border-radius:6px;background:#ddf4ff;color:#0969da;font:11px sans-serif;";
pinDragHint.textContent = "↕ Kéo để sắp xếp ghim";
document.body.appendChild(pinDragHint);
let pinHintTimer = null;

function hidePinDragHint(){ clearTimeout(pinHintTimer); pinHintTimer=null; pinDragHint.style.display="none"; }
function showPinDragHint(event){
    hidePinDragHint();
    if(draggingPinnedKey || event.target.closest("button")) return;
    const x=event.clientX, y=event.clientY;
    pinHintTimer=setTimeout(()=>{
        if(draggingPinnedKey) return;
        pinDragHint.style.display="block";
        pinDragHint.style.left=(x+10)+"px"; pinDragHint.style.top=(y+10)+"px";
    },400);
}

function movePinnedRow(sourceKey, targetKey, insertAfter) {
    if(sourceKey === targetKey || !pinnedRows.includes(sourceKey) || !pinnedRows.includes(targetKey)) return;
    const next=pinnedRows.filter(k=>k!==sourceKey);
    const targetIndex=next.indexOf(targetKey);
    next.splice(targetIndex+(insertAfter?1:0),0,sourceKey);
    pinnedRows=next; savePins(); renderRows();
}

const rowMenu = document.createElement("div");
rowMenu.style.cssText = "display:none;position:fixed;z-index:2147483646;min-width:160px;padding:4px;background:#fff;border:1px solid #d0d7de;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.12);font:12px -apple-system,sans-serif;";
document.body.appendChild(rowMenu);
function hideRowMenu(){ rowMenu.style.display="none"; }

function showRowMenu(event, r) {
    event.preventDefault(); event.stopPropagation(); hideRowMenu(); hidePinDragHint(); tooltip.style.opacity=0;
    rowMenu.replaceChildren();
    const action = (label,callback) => {
        const b=document.createElement("button"); b.type="button"; b.textContent=label;
        b.style.cssText="display:block;width:100%;padding:7px 10px;text-align:left;background:transparent;border:0;border-radius:4px;cursor:pointer;color:#24292f;";
        b.onmouseenter=()=>b.style.background="#f3f4f6"; b.onmouseleave=()=>b.style.background="transparent";
        b.onclick=()=>{ hideRowMenu(); callback(); };
        rowMenu.appendChild(b);
    };
    const key=rowKey(r), isPinned=pinnedRows.includes(key);
    action(isPinned ? "Bỏ ghim dòng" : "Ghim dòng lên đầu",()=>{pinnedRows=isPinned?pinnedRows.filter(k=>k!==key):[...pinnedRows.filter(k=>k!==key),key];savePins();renderRows();});
    if(r.sequence){
        action("Sửa dòng gửi nhiều tin",()=>openSequenceEditor(r.sequence));
        action("Xóa dòng gửi nhiều tin",()=>{if(!confirm("Xóa dòng gửi này?"))return;sequences=sequences.filter(x=>x!==r.sequence);pinnedRows=pinnedRows.filter(k=>k!==key);savePins();saveSequences();renderRows();});
    }
    rowMenu.style.display="block";
    rowMenu.style.left = Math.min(event.clientX, innerWidth - 170) + "px";
    rowMenu.style.top = Math.min(event.clientY, innerHeight - 120) + "px";
}

document.addEventListener("click", hideRowMenu);
document.addEventListener("keydown", e => { if (e.key==="Escape") hideRowMenu(); });
window.addEventListener("scroll", hideRowMenu, true);

// --- Render Bảng ---
function renderRows(){ 
    Array.from(table.querySelectorAll("tr[data-row='true']")).forEach(tr=>tr.remove()); 
    allRows().forEach(r=>{ 
        const tr=document.createElement("tr"); 
        tr.setAttribute("data-row","true"); 
        tr.setAttribute("data-id",r.id.toLowerCase());
        
        if (r.sequence) { tr.style.background = "#ddf4ff"; tr.style.color = "#0550ae"; }
        
        const pinnedKey=rowKey(r);
        if (pinnedRows.includes(pinnedKey)) {
            tr.style.boxShadow = "inset 3px 0 #fb8f00";
            tr.draggable = true;
            tr.style.cursor = "grab";
            tr.addEventListener("mouseenter", showPinDragHint);
            tr.addEventListener("mouseleave", hidePinDragHint);
            tr.addEventListener("dragstart", e => {
                if (e.target.closest && e.target.closest("button")) { e.preventDefault(); return; }
                draggingPinnedKey = pinnedKey;
                hidePinDragHint();
                e.dataTransfer.effectAllowed = "move";
                tr.style.opacity = "0.5";
            });
            tr.addEventListener("dragover", e => {
                if(!draggingPinnedKey || draggingPinnedKey===pinnedKey) return;
                e.preventDefault();
                const after = e.clientY > tr.getBoundingClientRect().top + tr.getBoundingClientRect().height / 2;
                tr.style.outline = after ? "2px solid #0969da" : "2px dashed #0969da";
            });
            tr.addEventListener("dragleave",()=>{ tr.style.outline=""; });
            tr.addEventListener("drop",e=>{
                e.preventDefault();
                const after = e.clientY > tr.getBoundingClientRect().top + tr.getBoundingClientRect().height / 2;
                tr.style.outline = "";
                const source = draggingPinnedKey;
                draggingPinnedKey = null;
                if(source) movePinnedRow(source, pinnedKey, after);
            });
            tr.addEventListener("dragend",()=>{ draggingPinnedKey=null; tr.style.opacity=""; tr.style.outline=""; });
        }
        tr.addEventListener("contextmenu", e => showRowMenu(e,r));

        const td1=document.createElement("td"); 
        td1.innerText=r.id; 
        td1.style.cssText="padding:6px 8px;text-align:left;border-bottom:1px solid #d0d7de;font-weight:600;width:95px;vertical-align:middle;"; 
        tr.appendChild(td1); 

        const td2=document.createElement("td"); 
        td2.textContent = r.text;
        td2.style.cssText="padding:6px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-bottom:1px solid #d0d7de;vertical-align:middle;color:#24292f;"; 
        
        td2.addEventListener("mouseenter", () => handleTooltipEnter(td2, r.text, true, () => td2.getBoundingClientRect()));
        td2.addEventListener("mouseleave", handleTooltipLeave);
        tr.appendChild(td2); 

        const td3=document.createElement("td"); 
        td3.style.cssText="padding:6px 8px;text-align:center;border-bottom:1px solid #d0d7de;width:65px;vertical-align:middle;"; 
        const btn=document.createElement("button"); 
        btn.innerText="Send"; 
        btn.style.cssText=`padding:4px 10px;cursor:pointer;border:1px solid ${r.sequence ? '#0969da' : '#1f883d'};border-radius:6px;background:${r.sequence ? '#0969da' : '#2da44e'};color:#fff;font-weight:600;font-size:12px;box-shadow:0 1px 2px rgba(0,0,0,0.05);transition:opacity 0.1s;`;
        btn.onmouseenter = () => btn.style.opacity = "0.9";
        btn.onmouseleave = () => btn.style.opacity = "1";
        btn.addEventListener("mousedown", e => e.stopPropagation());
        btn.onclick = () => r.sequence ? runSequence(r.sequence, btn) : sendMessage(r.text).catch(e => alert(e.message));
        td3.appendChild(btn);
        tr.appendChild(td3); 

        table.appendChild(tr); 
    }); 
    const keyword = searchInput.value.toLowerCase();
    Array.from(table.querySelectorAll("tr[data-row='true']")).forEach(tr=>{
        tr.style.display = !keyword || tr.getAttribute("data-id").includes(keyword) ? "" : "none";
    });
} 
renderRows(); 

// --- Google Sheet & Excel Logic ---
async function importFromGoogleSheetByInput(url){
    if (!url || !url.trim()) { clearAllRows(); return false; }
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) { clearAllRows(); return false; }
    const sheetId = match[1];
    const jsonUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    try {
        const res = await fetch(jsonUrl);
        if (!res.ok) throw new Error("fetch fail");
        const text = await res.text();
        const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));
        clearAllRows();
        json.table.rows.forEach(r => {
            const id = r.c[0]?.v?.toString().trim();
            const value = r.c[1]?.v?.toString() || "";
            if (!id || !value || id.toLowerCase() === "id") return;
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

tableWrapper.appendChild(table); 
container.appendChild(tableWrapper); 
document.body.appendChild(container); 

const savedSheet = window.top.localStorage.getItem("GLOBAL_GSHEET_LINK");
if (savedSheet) {
    gsInput.value = savedSheet;
    setReloadState("loading");
    importFromGoogleSheetByInput(savedSheet).then(ok => setReloadState(ok ? "success" : "error"));
}

// --- Khôi phục & Kéo thả Container (Draggable + Lưu vị trí localStorage) ---
let isDragging = false, offsetX, offsetY;
toggleBtn.addEventListener("mousedown", (e) => {
    if (e.target === toolMenuBtn || toolMenuBtn.contains(e.target)) return;
    isDragging = true;
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    document.body.style.userSelect = "none";
    e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const newLeft = (e.clientX - offsetX) + "px";
        const newTop = (e.clientY - offsetY) + "px";
        container.style.left = newLeft;
        container.style.top = newTop;
        container.style.right = "auto"; 
        container.style.bottom = "auto";
    }
});

document.addEventListener("mouseup", () => { 
    if (isDragging) {
        isDragging = false; 
        document.body.style.userSelect = "auto";
        const rect = container.getBoundingClientRect();
        localStorage.setItem(CONTAINER_POS_KEY, JSON.stringify({
            left: rect.left + "px",
            top: rect.top + "px"
        }));
    }
});

copyBtn.addEventListener("click", async () => {
    if (!currentTooltipText) return;
    try {
        await navigator.clipboard.writeText(currentTooltipText);
        copyBtn.innerText = "✓";
        setTimeout(() => { copyBtn.innerText = "Copy"; }, 1000);
    } catch (e) { console.error("Copy failed", e); }
});

// --- Resize Handle ---
const resizeHandle = document.createElement("div");
resizeHandle.style.cssText = "width:10px;height:10px;position:absolute;right:2px;bottom:2px;cursor:nwse-resize;";
container.appendChild(resizeHandle);

let isResizing = false, startX, startY, startWidth, startHeight;
resizeHandle.addEventListener("mousedown", (e) => {
    e.preventDefault(); isResizing = true;
    startX = e.clientX; startY = e.clientY;
    startWidth = container.offsetWidth; startHeight = container.offsetHeight;
    document.body.style.userSelect = "none";
});

document.addEventListener("mousemove", (e) => {
    if (isResizing) {
        container.style.width = (startWidth + (e.clientX - startX)) + "px";
        container.style.height = (startHeight + (e.clientY - startY)) + "px";
    }
});

document.addEventListener("mouseup", () => { isResizing = false; document.body.style.userSelect = "auto"; });

let isVisible = true;
document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.code === "Space") {
        isVisible = !isVisible;
        container.style.display = isVisible ? "flex" : "none";
        e.preventDefault();
    }
});

})();
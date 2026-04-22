javascript:(function() {
    const ID_PREFIX = 'ghtk-seo-';
    if (document.getElementById(`${ID_PREFIX}container`)) return;

    // 1. Tạo Container
    const container = document.createElement('div');
    container.id = `${ID_PREFIX}container`;
    container.style.cssText = `
        position: fixed; top: 20px; right: 20px; width: 380px;
        background: #fff; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        z-index: 999999; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        border: 2px solid #00904a; overflow: hidden; display: flex; flex-direction: column;
        animation: slideIn 0.3s ease-out;
    `;

    // 2. Thêm Animation & CSS Table
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        #${ID_PREFIX}display table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        #${ID_PREFIX}display th { background: #f4f4f4; color: #333; text-align: left; padding: 8px; font-size: 12px; border-bottom: 2px solid #00904a; }
        #${ID_PREFIX}display td { padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; color: #444; word-break: break-word; }
        #${ID_PREFIX}select:focus { border-color: #00904a; outline: none; box-shadow: 0 0 5px rgba(0,144,74,0.3); }
        .ghtk-btn { background: #00904a; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: 0.2s; }
        .ghtk-btn:hover { background: #00703a; }
    `;
    document.head.appendChild(style);

    // 3. Layout HTML
    container.innerHTML = `
        <div style="background: #00904a; color: white; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="background:white; color:#00904a; border-radius:4px; padding:2px 6px; font-size:10px;">PRO</span>
                <span>SEO TOOLBOX</span>
            </div>
            <span id="${ID_PREFIX}close" style="cursor:pointer; font-size: 24px; line-height: 1;">&times;</span>
        </div>
        
        <div style="padding: 15px; border-bottom: 1px solid #eee; background: #f9fdfb;">
            <label style="display: block; margin-bottom: 8px; font-size: 11px; font-weight: 700; color: #00904a; text-transform: uppercase;">Chức năng hệ thống</label>
            <select id="${ID_PREFIX}select" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; background: #fff; font-size: 14px; cursor: pointer;">
                <option value="">-- Chọn tác vụ kiểm tra --</option>
                <optgroup label="Label 1">
                    <option value="tonTC">Check tồn TC</option>
                </optgroup>
                <optgroup label="Label None">
                    <option value="images">None</option>
                </optgroup>
            </select>
        </div>

        <div style="padding: 15px; flex-grow: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label style="font-size: 11px; font-weight: 700; color: #666; text-transform: uppercase;">Kết quả chi tiết</label>
                <button class="ghtk-btn" id="${ID_PREFIX}copy">Copy kết quả</button>
            </div>
            <div id="${ID_PREFIX}display" style="min-height: 180px; max-height: 350px; overflow-y: auto; border: 1px inset #fafafa; background: #fff; padding: 5px;">
                <div style="text-align: center; color: #999; margin-top: 60px; font-style: italic;">Vui lòng chọn chức năng để lấy dữ liệu...</div>
            </div>
        </div>
        
        <div style="background: #f4f4f4; padding: 8px 15px; font-size: 10px; color: #888; text-align: center;">
            Design by GHTK Developer Style
        </div>
    `;

    document.body.appendChild(container);

    // 4. Logic Xử lý
    const select = document.getElementById(`${ID_PREFIX}select`);
    const display = document.getElementById(`${ID_PREFIX}display`);

    const actions = {
        meta: () => {
            const d = document.querySelector('meta[name="description"]')?.content || 'N/A';
            const k = document.querySelector('meta[name="keywords"]')?.content || 'N/A';
            return `<table>
                <tr><th>Tiêu chí</th><th>Nội dung</th></tr>
                <tr><td><b>Title</b></td><td>${document.title}</td></tr>
                <tr><td><b>Description</b></td><td>${d}</td></tr>
                <tr><td><b>Keywords</b></td><td>${k}</td></tr>
                <tr><td><b>URL</b></td><td>${window.location.href}</td></tr>
            </table>`;
        },
        headings: () => {
            let html = '<table><tr><th>Thẻ</th><th>Số lượng</th></tr>';
            ['H1', 'H2', 'H3', 'H4', 'H5'].forEach(tag => {
                const count = document.querySelectorAll(tag).length;
                const color = (tag === 'H1' && count !== 1) ? 'red' : 'inherit';
                html += `<tr><td><b>${tag}</b></td><td style="color:${color}">${count}</td></tr>`;
            });
            html += '</table>';
            return html;
        },
        images: () => {
            const imgs = document.querySelectorAll('img');
            const noAlt = Array.from(imgs).filter(i => !i.alt).length;
            return `<table>
                <tr><th>Thông tin</th><th>Kết quả</th></tr>
                <tr><td>Tổng số ảnh</td><td>${imgs.length}</td></tr>
                <tr><td>Thiếu thẻ ALT</td><td style="color:red; font-weight:bold;">${noAlt}</td></tr>
            </table>`;
        },
        links: () => {
            const a = document.querySelectorAll('a');
            const ext = Array.from(a).filter(l => l.hostname && l.hostname !== window.location.hostname).length;
            return `<table>
                <tr><th>Loại link</th><th>Số lượng</th></tr>
                <tr><td>Tổng liên kết</td><td>${a.length}</td></tr>
                <tr><td>Link ra ngoài</td><td>${ext}</td></tr>
                <tr><td>Link nội bộ</td><td>${a.length - ext}</td></tr>
            </table>`;
        }
    };

    select.onchange = (e) => {
        const val = e.target.value;
        display.innerHTML = val ? actions[val]() : '<div style="text-align: center; color: #999; margin-top: 60px;">Vui lòng chọn chức năng...</div>';
    };

    document.getElementById(`${ID_PREFIX}copy`).onclick = () => {
        const text = display.innerText;
        navigator.clipboard.writeText(text).then(() => alert('Đã copy kết quả vào Clipboard!'));
    };

    document.getElementById(`${ID_PREFIX}close`).onclick = () => container.remove();
})();
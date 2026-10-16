(async function () {
    document.getElementById('cod-tool-panel')?.remove();

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    let stopped = false;
    let running = false;

    const panel = document.createElement('div');
    panel.id = 'cod-tool-panel';
    panel.style.cssText = `
        position:fixed;top:20px;right:20px;width:340px;
        padding:18px;background:white;color:#172b4d;
        border:1px solid #dfe1e6;border-radius:12px;
        box-shadow:0 8px 30px #0003;z-index:2147483647;
        font-family:Arial,sans-serif;box-sizing:border-box;
    `;

    panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:15px">
            <b style="font-size:18px">🔎 COD Tool</b>
            <button id="cod-close" style="border:0;background:none;
                font-size:23px;cursor:pointer">×</button>
        </div>

        <label style="font-size:13px">Giá trị tìm kiếm</label>
        <input id="cod-value" type="text"
            placeholder="Nhập tên hoặc số điện thoại..."
            style="width:100%;box-sizing:border-box;margin-top:8px;
            padding:11px;border:1px solid #ccc;border-radius:7px">

        <label style="display:block;margin-top:14px;font-size:13px">
            Số ô cần xử lý (0 = tất cả)
        </label>
        <input id="cod-limit" type="number" min="0" value="1"
            style="width:100%;box-sizing:border-box;margin-top:8px;
            padding:10px;border:1px solid #ccc;border-radius:7px">

        <div style="display:flex;gap:8px;margin-top:15px">
            <button id="cod-run" style="flex:1;padding:12px;
                background:#0052cc;color:white;border:0;
                border-radius:7px;cursor:pointer;font-weight:bold">
                ▶ Chạy
            </button>
            <button id="cod-stop" style="flex:1;padding:12px;
                background:#de350b;color:white;border:0;
                border-radius:7px;cursor:pointer;font-weight:bold">
                ■ Dừng
            </button>
        </div>

        <div id="cod-progress" style="margin-top:14px;font-size:13px">
            Tiến độ: 0/0
        </div>
        <div id="cod-status" style="margin-top:8px;
            font-size:12px;color:#6b778c">Sẵn sàng</div>
    `;

    document.body.appendChild(panel);

    const $ = window.jQuery;
    const input = panel.querySelector('#cod-value');
    const limitInput = panel.querySelector('#cod-limit');
    const status = panel.querySelector('#cod-status');
    const progress = panel.querySelector('#cod-progress');
    const runBtn = panel.querySelector('#cod-run');
    const stopBtn = panel.querySelector('#cod-stop');

    panel.querySelector('#cod-close').onclick = () => {
        stopped = true;
        panel.remove();
    };

    stopBtn.onclick = () => {
        stopped = true;
        status.textContent = '⏹ Đang dừng...';
    };

    function findGroups() {
        return [...document.querySelectorAll('.aui-group')]
            .filter(group => {
                const label = [...group.querySelectorAll('.aui-item b')]
                    .some(b => b.textContent.trim() === 'Trả hàng:');

                return label &&
                    group.querySelector('select[name="pick_cod_id"]');
            });
    }

    async function processOne(group, value) {
        const select = group.querySelector(
            'select[name="pick_cod_id"]'
        );

        if (!select || !$(select).data('select2')) {
            throw Error('Select2 chưa được khởi tạo');
        }

        group.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        $(select).select2('open');
        await sleep(250);

        if (stopped) return false;

        const search = document.querySelector(
            '.select2-container--open .select2-search__field'
        );

        if (!search) {
            throw Error('Không tìm thấy input dropdown');
        }

        search.focus();
        search.value = value;
        $(search).trigger('input');

        // Chờ kết quả hợp lệ, tối đa 10 giây
        let result = null;
        const start = Date.now();

        while (Date.now() - start < 10000 && !stopped) {
            result = document.querySelector(
                '.select2-container--open ' +
                '.select2-results__option[aria-selected="false"]'
            );

            if (result &&
                !result.classList.contains('loading-results') &&
                !result.classList.contains('select2-results__message')) {
                break;
            }

            result = null;
            await sleep(150);
        }

        if (stopped) return false;

        if (!result) {
            throw Error('Không tìm thấy kết quả');
        }

        // Đợi thêm 1 giây
        await sleep(1000);
        if (stopped) return false;

        // Chọn kết quả đầu tiên bằng Select2 API
        const data = $(result).data('data');

        if (!data || data.id == null) {
            throw Error('Không lấy được dữ liệu kết quả');
        }

        const instance = $(select).data('select2');

        instance.trigger('select', { data });

        await sleep(300);

        // Kiểm tra giá trị được chọn
        if (String($(select).val()) !== String(data.id)) {
            throw Error('Không xác nhận được lựa chọn');
        }

        return true;
    }

    runBtn.onclick = async () => {
        if (running) return;

        const value = input.value.trim();

        if (!value) {
            status.textContent = '⚠️ Hãy nhập giá trị!';
            return;
        }

        if (!$?.fn?.select2) {
            status.textContent = '❌ Không tìm thấy Select2!';
            return;
        }

        const groups = findGroups();
        const limit = Math.max(0, Number(limitInput.value) || 0);
        const targets = limit === 0
            ? groups
            : groups.slice(0, limit);

        if (!targets.length) {
            status.textContent = '❌ Không tìm thấy ô Trả hàng!';
            return;
        }

        stopped = false;
        running = true;
        runBtn.disabled = true;

        let success = 0;
        let failed = 0;

        try {
            for (let i = 0; i < targets.length; i++) {
                if (stopped) break;

                progress.textContent =
                    `Tiến độ: ${i + 1}/${targets.length}`;

                status.textContent =
                    `⏳ Đang xử lý ô thứ ${i + 1}...`;

                try {
                    const ok = await processOne(targets[i], value);

                    if (ok) success++;
                    if (stopped) break;

                } catch (err) {
                    failed++;
                    console.error(`Ô ${i + 1}:`, err);

                    // Đóng dropdown trước khi sang ô tiếp
                    const select = targets[i].querySelector(
                        'select[name="pick_cod_id"]'
                    );

                    try {
                        $(select).select2('close');
                    } catch (_) {}
                }

                await sleep(300);
            }

            status.textContent = stopped
                ? `⏹ Đã dừng. Thành công: ${success}, lỗi: ${failed}`
                : `✅ Hoàn tất! Thành công: ${success}, lỗi: ${failed}`;

        } finally {
            running = false;
            runBtn.disabled = false;
        }
    };

    input.focus();
})();
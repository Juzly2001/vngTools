/* QrCode Pro v2 — Vanilla JavaScript, không cần build tool.
   Phụ thuộc: JsBarcode, qrcode và JSZip tải qua CDN trong index.html. */
(() => {
  'use strict';

  const STORAGE_KEY = 'hbp_qrcode_pro_data'; // Đọc được dữ liệu do phiên bản cũ lưu.
  const $ = (id) => document.getElementById(id);
  const state = {
    entries: [],          // { code, sourceIndex } — vị trí trong textarea gốc.
    preview: [],          // Kết quả đã lọc, giữ nguyên sourceIndex.
    renderToken: 0,       // Hủy lần dựng cũ khi người dùng cập nhật nhanh.
    activeIndex: -1,
    menuIndex: -1,
    exportBusy: false,
    lastModalFocus: null,
    inputTimer: 0,
    toastTimer: 0
  };

  function icon(name) {
    return `<svg class="icon" aria-hidden="true"><use href="#ic-${name}"></use></svg>`;
  }

  function showToast(message) {
    const element = $('toast');
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => element.classList.remove('show'), 2800);
  }

  function parseCodes() {
    return $('barcodeInputs').value.split(/[\s,;]+/u).map(s => s.trim()).filter(Boolean);
  }

  function selectedType() {
    return document.querySelector('input[name="code-type"]:checked')?.value || 'barcode';
  }

  function settings() {
    return {
      type: selectedType(),
      showLabel: $('showLabel').checked,
      dedup: $('autoDedup').checked,
      size: $('codeSize').value
    };
  }

  function sizeConfig(size = $('codeSize').value) {
    switch (size) {
      case 'small': return { barcodeWidth: 1.35, barcodeHeight: 65, qrWidth: 112, fontSize: 11 };
      case 'large': return { barcodeWidth: 2.25, barcodeHeight: 104, qrWidth: 190, fontSize: 15 };
      default: return { barcodeWidth: 1.85, barcodeHeight: 86, qrWidth: 158, fontSize: 13 };
    }
  }

  function updateStats(visibleCount = state.preview.length) {
    const codes = parseCodes();
    const unique = new Set(codes).size;
    $('countTotal').textContent = codes.length.toLocaleString('vi-VN');
    $('countUnique').textContent = unique.toLocaleString('vi-VN');
    $('countDuplicate').textContent = (codes.length - unique).toLocaleString('vi-VN');
    $('countPreview').textContent = visibleCount.toLocaleString('vi-VN');
    $('inputCountBadge').textContent = `${codes.length.toLocaleString('vi-VN')} mã`;
  }

  function readStoredData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      $('barcodeInputs').value = typeof data.text === 'string' ? data.text : '';
      $('paperWidth').value = data.width || 40;
      $('paperHeight').value = data.height || 40;
      $('showLabel').checked = data.showLabel !== false;
      $('autoDedup').checked = !!data.autoRemoveDuplicate;
      $('codeSize').value = ['small', 'medium', 'large'].includes(data.codeSize) ? data.codeSize : 'medium';
      $('inputFormat').value = data.inputFormat === 'horizontal' ? 'horizontal' : 'lines';
      const type = data.codeType === 'qrcode' ? 'qrcode' : 'barcode';
      document.querySelector(`input[name="code-type"][value="${type}"]`).checked = true;
      document.documentElement.dataset.theme = data.dark ? 'dark' : 'light';
      updateThemeIcon();
    } catch (error) {
      console.warn('Không thể khôi phục cài đặt cũ', error);
    }
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        text: $('barcodeInputs').value,
        width: $('paperWidth').value,
        height: $('paperHeight').value,
        codeType: selectedType(),
        showLabel: $('showLabel').checked,
        autoRemoveDuplicate: $('autoDedup').checked,
        codeSize: $('codeSize').value,
        inputFormat: $('inputFormat').value,
        dark: document.documentElement.dataset.theme === 'dark'
      }));
    } catch (error) {
      console.warn('Bộ nhớ cục bộ không khả dụng', error);
    }
  }

  function updateThemeIcon() {
    const dark = document.documentElement.dataset.theme === 'dark';
    $('themeIcon').querySelector('use').setAttribute('href', dark ? '#ic-sun' : '#ic-moon');
    $('themeBtn').title = dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';
  }

  function toggleTheme() {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    updateThemeIcon();
    saveData();
  }

  function setSidebar(open) {
    $('sidebar').classList.toggle('is-open', open);
    $('sidebarBackdrop').hidden = !open;
    $('openSidebar').setAttribute('aria-expanded', String(open));
    if (open) $('closeSidebar').focus();
    else $('openSidebar').focus();
  }

  function formatInput(codes) {
    $('barcodeInputs').value = codes.join($('inputFormat').value === 'horizontal' ? ' ' : '\n');
  }

  function presetButtonState() {
    const w = +$('paperWidth').value;
    const h = +$('paperHeight').value;
    document.querySelectorAll('.preset').forEach(button => {
      button.classList.toggle('active', Number(button.dataset.width) === w && Number(button.dataset.height) === h);
    });
  }

  function pageDimension(input) {
    const n = Number(input.value);
    const safe = Number.isFinite(n) ? Math.max(10, Math.min(300, Math.round(n))) : 40;
    input.value = String(safe);
    return safe;
  }

  function updatePaperSize() {
    const width = pageDimension($('paperWidth'));
    const height = pageDimension($('paperHeight'));
    $('dynamicPrintStyle').textContent = `@media print { @page { size: ${width}mm ${height}mm; margin: 0; } }`;
    presetButtonState();
    saveData();
  }

  function showEmpty(title, message, isError = false) {
    const grid = $('previewGrid');
    grid.replaceChildren();
    const wrap = document.createElement('div');
    wrap.className = 'empty-state';
    wrap.innerHTML = `<div class="empty-art">${icon(isError ? 'search' : 'qr')}</div><h3></h3><p></p>`;
    wrap.querySelector('h3').textContent = title;
    wrap.querySelector('p').textContent = message;
    grid.appendChild(wrap);
  }

  function updatePreviewHeader(status = '') {
    const count = state.preview.length;
    $('previewPill').textContent = count.toLocaleString('vi-VN');
    $('previewSummary').textContent = `${count.toLocaleString('vi-VN')} mã`;
    $('previewStatus').textContent = status || (count ? `Hiển thị ${count.toLocaleString('vi-VN')} mã` : 'Sẵn sàng tạo mã');
    $('printBtn').disabled = !count || state.exportBusy;
    $('zipBtn').disabled = !count || state.exportBusy;
    updateStats(count);
  }

  function getDisplayEntries() {
    const codes = parseCodes();
    const options = settings();
    const seen = new Set();
    const entries = [];
    codes.forEach((code, sourceIndex) => {
      if (options.dedup && seen.has(code)) return;
      seen.add(code);
      entries.push({ code, sourceIndex });
    });
    return entries;
  }

  async function drawCode(target, code, options, scale = 'preview') {
    if (options.type === 'barcode') {
      if (typeof JsBarcode !== 'function') throw new Error('Không tải được thư viện tạo mã vạch.');
      const cfg = sizeConfig(options.size);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      target.appendChild(svg);
      JsBarcode(svg, code, {
        format: 'CODE128', lineColor: '#000000', background: '#ffffff',
        height: scale === 'modal' ? 125 : cfg.barcodeHeight,
        width: scale === 'modal' ? 2.15 : cfg.barcodeWidth,
        margin: 5, fontSize: scale === 'modal' ? 17 : cfg.fontSize,
        displayValue: options.showLabel
      });
      return;
    }
    if (typeof QRCode === 'undefined') throw new Error('Không tải được thư viện QR.');
    const wrap = document.createElement('div');
    wrap.className = 'qr-wrap';
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    if (options.showLabel) {
      const text = document.createElement('div');
      text.className = 'qr-text';
      text.textContent = code;
      wrap.appendChild(text);
    }
    target.appendChild(wrap);
    await QRCode.toCanvas(canvas, code, {
      width: scale === 'modal' ? 300 : sizeConfig(options.size).qrWidth,
      errorCorrectionLevel: 'H', margin: 2, color: { dark: '#000000', light: '#ffffff' }
    });
  }

  function createCard(entry, index, options) {
    const card = document.createElement('article');
    card.className = 'code-card';
    const visual = document.createElement('button');
    visual.className = 'code-visual';
    visual.type = 'button';
    visual.title = `Phóng to: ${entry.code}`;
    visual.setAttribute('aria-label', `Phóng to mã ${entry.code}`);
    visual.addEventListener('click', () => openModal(index));
    visual.addEventListener('contextmenu', (event) => showMenu(event, index));
    installLongPress(visual, index);
    const foot = document.createElement('div');
    foot.className = 'code-card-foot';
    const label = document.createElement('div');
    label.className = 'code-card-title';
    const codeText = document.createElement('strong');
    codeText.textContent = entry.code;
    codeText.title = entry.code;
    const sub = document.createElement('small');
    sub.textContent = `${options.type === 'barcode' ? 'CODE128' : 'QR Code'} · Mã #${index + 1}`;
    label.append(codeText, sub);
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'card-more';
    more.title = `Thao tác với mã ${entry.code}`;
    more.setAttribute('aria-label', `Thao tác với mã ${entry.code}`);
    more.innerHTML = icon('more');
    more.addEventListener('click', (event) => showMenu(event, index));
    foot.append(label, more);
    card.append(visual, foot);
    return { card, visual };
  }

  function showCardError(visual, error) {
    visual.replaceChildren();
    const label = document.createElement('span');
    label.className = 'code-error';
    label.textContent = `Không tạo được mã: ${error.message || 'Nội dung không hợp lệ'}`;
    visual.appendChild(label);
  }

  function waitFrame() {
    return new Promise(resolve => requestAnimationFrame(resolve));
  }

  async function generateCodes(notify = false) {
    const token = ++state.renderToken;
    closeMenu();
    closeModal();
    const allEntries = getDisplayEntries();
    state.entries = allEntries;
    const query = $('searchPreview').value.trim().toLocaleLowerCase('vi');
    state.preview = query ? allEntries.filter(entry => entry.code.toLocaleLowerCase('vi').includes(query)) : allEntries;
    updatePreviewHeader(state.preview.length ? 'Đang tạo bản xem trước…' : 'Sẵn sàng tạo mã');
    const grid = $('previewGrid');
    grid.replaceChildren();

    if (!parseCodes().length) {
      showEmpty('Chưa có mã nào', 'Nhập danh sách và nhấn “Tạo mã ngay” để bắt đầu.');
      if (notify) showToast('Hãy nhập ít nhất một mã trước khi tạo.');
      return;
    }
    if (!state.preview.length) {
      showEmpty('Không tìm thấy mã', 'Hãy thử từ khóa khác hoặc xóa nội dung tìm kiếm.', true);
      return;
    }

    const options = settings();
    let failed = 0;
    // Dựng theo từng đợt để trang không bị khóa khi danh sách dài.
    for (let i = 0; i < state.preview.length; i++) {
      if (token !== state.renderToken) return;
      const entry = state.preview[i];
      const { card, visual } = createCard(entry, i, options);
      grid.appendChild(card);
      try {
        await drawCode(visual, entry.code, options);
      } catch (error) {
        failed++;
        console.warn('Không dựng được mã:', entry.code, error);
        showCardError(visual, error);
      }
      if (i % 24 === 23) {
        updatePreviewHeader(`Đang tạo ${i + 1}/${state.preview.length} mã…`);
        await waitFrame();
      }
    }
    if (token !== state.renderToken) return;
    const message = failed ? `Hoàn tất · ${failed} mã lỗi` : `Đã tạo ${state.preview.length.toLocaleString('vi-VN')} mã`;
    updatePreviewHeader(message);
    if (notify) showToast(message);
  }

  function scheduleGenerate(wait = 260) {
    clearTimeout(state.inputTimer);
    state.renderToken++; // Ngừng thao tác cũ ngay, không chờ debounce.
    $('previewStatus').textContent = 'Đang cập nhật…';
    state.inputTimer = setTimeout(() => generateCodes(), wait);
  }

  function removeDuplicates() {
    const codes = parseCodes();
    const unique = [...new Set(codes)];
    if (!codes.length) { showToast('Chưa có mã nào để lọc trùng.'); return; }
    formatInput(unique);
    $('searchPreview').value = '';
    saveData();
    generateCodes();
    showToast(`Đã loại bỏ ${codes.length - unique.length} mã trùng.`);
  }

  function clearAll() {
    if (!parseCodes().length) { showToast('Danh sách đang trống.'); return; }
    if (!window.confirm('Xóa tất cả mã đã nhập? Thao tác này không thể hoàn tác.')) return;
    $('barcodeInputs').value = '';
    $('searchPreview').value = '';
    saveData();
    generateCodes();
    showToast('Đã xóa toàn bộ danh sách.');
  }

  async function copyText(value) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const input = document.createElement('textarea');
        input.value = value;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        const okay = document.execCommand('copy');
        input.remove();
        if (!okay) throw new Error('Không thể sao chép');
      }
      showToast(`Đã sao chép: ${value}`);
    } catch (_) { showToast('Không thể sao chép, hãy kiểm tra quyền clipboard.'); }
  }

  function safeFilename(code, index) {
    const name = code.replace(/[\\/:*?"<>|\x00-\x1f]/g, '_').replace(/[. ]+$/g, '').slice(0, 65) || 'ma';
    return `${String(index + 1).padStart(3, '0')}_${name}.png`;
  }

  function wrapCanvasLabel(context, value, maxWidth) {
    const lines = [];
    let current = '';
    for (const char of value) {
      if (current && context.measureText(current + char).width > maxWidth) {
        lines.push(current); current = char;
      } else current += char;
    }
    if (current) lines.push(current);
    return lines;
  }

  async function createExportCanvas(code, options) {
    let canvas = document.createElement('canvas');
    if (options.type === 'barcode') {
      if (typeof JsBarcode !== 'function') throw new Error('Thiếu thư viện JsBarcode');
      JsBarcode(canvas, code, {
        format: 'CODE128', lineColor: '#000000', background: '#ffffff',
        width: 3, height: 175, displayValue: options.showLabel,
        fontSize: 24, textMargin: 9, margin: 15
      });
    } else {
      if (typeof QRCode === 'undefined') throw new Error('Thiếu thư viện QRCode');
      await QRCode.toCanvas(canvas, code, { width: 520, margin: 3, errorCorrectionLevel: 'H' });
      if (options.showLabel) {
        const ctx = canvas.getContext('2d');
        ctx.font = '22px Arial, sans-serif';
        const lines = wrapCanvasLabel(ctx, code, canvas.width - 38);
        const output = document.createElement('canvas');
        output.width = canvas.width;
        output.height = canvas.height + 18 + lines.length * 30;
        const o = output.getContext('2d');
        o.fillStyle = '#ffffff';
        o.fillRect(0, 0, output.width, output.height);
        o.drawImage(canvas, 0, 0);
        o.fillStyle = '#111111';
        o.font = '22px Arial, sans-serif';
        o.textAlign = 'center';
        o.textBaseline = 'top';
        lines.forEach((line, i) => o.fillText(line, output.width / 2, canvas.height + 8 + i * 30));
        canvas = output;
      }
    }
    return canvas;
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Không thể xuất PNG.')), 'image/png'));
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 45000);
  }

  async function downloadSingle(index) {
    const entry = state.preview[index];
    if (!entry) return;
    try {
      const canvas = await createExportCanvas(entry.code, settings());
      triggerDownload(await canvasToBlob(canvas), safeFilename(entry.code, index));
      showToast(`Đã tạo ảnh PNG cho mã ${entry.code}`);
    } catch (error) { showToast(`Không thể xuất PNG: ${error.message}`); }
  }

  function setExportBusy(busy, message = '') {
    state.exportBusy = busy;
    $('zipBtn').disabled = busy || !state.preview.length;
    $('printBtn').disabled = busy || !state.preview.length;
    $('zipBtn').innerHTML = busy ? `${icon('download')} Đang xử lý…` : `${icon('download')} Tải ZIP`;
    if (message) $('previewStatus').textContent = message;
  }

  async function downloadZip() {
    if (state.exportBusy || !state.preview.length) return;
    if (typeof JSZip === 'undefined') { showToast('Thư viện JSZip chưa tải được. Kiểm tra kết nối mạng.'); return; }
    const snapshot = state.preview.slice();
    const opts = settings();
    setExportBusy(true, 'Đang chuẩn bị ảnh…');
    try {
      const zip = new JSZip();
      let success = 0;
      let failed = 0;
      for (let i = 0; i < snapshot.length; i++) {
        try {
          const canvas = await createExportCanvas(snapshot[i].code, opts);
          const blob = await canvasToBlob(canvas);
          zip.file(safeFilename(snapshot[i].code, i), blob);
          success++;
        } catch (error) { failed++; console.warn('Bỏ qua mã không thể xuất:', snapshot[i].code, error); }
        if (i % 5 === 0) {
          $('previewStatus').textContent = `Đang xuất ${i + 1}/${snapshot.length} mã…`;
          await waitFrame();
        }
      }
      if (!success) throw new Error('Không có mã hợp lệ để xuất.');
      $('previewStatus').textContent = 'Đang đóng gói ZIP…';
      const archive = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
      triggerDownload(archive, `QrCode-Pro_${success}_ma.zip`);
      showToast(`Đã xuất ${success} ảnh PNG${failed ? `, bỏ qua ${failed} mã lỗi` : ''}.`);
    } catch (error) { showToast(`Tạo ZIP thất bại: ${error.message}`); }
    finally { setExportBusy(false, `Hiển thị ${state.preview.length} mã`); }
  }

  async function printCodes() {
    if (state.exportBusy || !state.preview.length) return;
    const snapshot = state.preview.slice();
    const opts = settings();
    const sheet = $('printSheet');
    sheet.replaceChildren();
    setExportBusy(true, 'Đang chuẩn bị trang in…');
    updatePaperSize();
    let success = 0;
    let failed = 0;
    try {
      for (let i = 0; i < snapshot.length; i++) {
        try {
          const canvas = await createExportCanvas(snapshot[i].code, opts);
          const page = document.createElement('div');
          page.className = 'print-label';
          const img = document.createElement('img');
          img.src = canvas.toDataURL('image/png');
          img.alt = snapshot[i].code;
          page.appendChild(img);
          sheet.appendChild(page);
          success++;
        } catch (error) { failed++; console.warn('Không in được mã:', snapshot[i].code, error); }
        if (i % 5 === 0) {
          $('previewStatus').textContent = `Đang chuẩn bị in ${i + 1}/${snapshot.length}…`;
          await waitFrame();
        }
      }
      if (!success) throw new Error('Không có mã hợp lệ để in.');
      await Promise.all([...sheet.querySelectorAll('img')].map(img => img.decode?.().catch(() => {}) || Promise.resolve()));
      await waitFrame();
      if (failed) showToast(`Đã bỏ qua ${failed} mã không hợp lệ khi in.`);
      window.print();
    } catch (error) { showToast(`Không thể chuẩn bị bản in: ${error.message}`); }
    finally { setExportBusy(false, `Hiển thị ${state.preview.length} mã`); }
  }

  function closeMenu() {
    $('contextMenu').hidden = true;
    state.menuIndex = -1;
  }

  function showMenu(event, index) {
    event.preventDefault();
    event.stopPropagation();
    if (!state.preview[index]) return;
    state.menuIndex = index;
    $('contextTitle').textContent = state.preview[index].code;
    const menu = $('contextMenu');
    menu.hidden = false;
    menu.style.visibility = 'hidden';
    const rect = menu.getBoundingClientRect();
    let x = event.clientX;
    let y = event.clientY;
    if ((x == null || y == null || (x === 0 && y === 0)) && event.currentTarget) {
      const buttonRect = event.currentTarget.getBoundingClientRect();
      x = buttonRect.right; y = buttonRect.bottom;
    }
    x = Math.max(8, Math.min(x ?? window.innerWidth / 2, window.innerWidth - rect.width - 8));
    y = Math.max(8, Math.min(y ?? window.innerHeight / 2, window.innerHeight - rect.height - 8));
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.visibility = 'visible';
  }

  function installLongPress(element, index) {
    let timeout, startX, startY, swallow = false;
    const cancel = () => clearTimeout(timeout);
    element.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' || event.button !== 0) return;
      startX = event.clientX; startY = event.clientY; swallow = false;
      cancel();
      timeout = setTimeout(() => {
        swallow = true;
        showMenu({ clientX: startX, clientY: startY, preventDefault() {}, stopPropagation() {} }, index);
      }, 550);
    });
    element.addEventListener('pointermove', event => {
      if (Math.abs(startX - event.clientX) > 12 || Math.abs(startY - event.clientY) > 12) cancel();
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(name => element.addEventListener(name, cancel));
    element.addEventListener('click', event => {
      if (swallow) { event.preventDefault(); event.stopImmediatePropagation(); swallow = false; }
    }, true);
  }

  function deleteEntry(index) {
    const entry = state.preview[index];
    if (!entry) return;
    const codes = parseCodes();
    // Kiểm tra lại để không xóa nhầm nếu ô nhập đã thay đổi.
    if (codes[entry.sourceIndex] !== entry.code) {
      generateCodes();
      showToast('Danh sách đã thay đổi. Hãy chọn lại mã cần xóa.');
      return;
    }
    if (!window.confirm(`Xóa mã “${entry.code}” khỏi danh sách?`)) return;
    codes.splice(entry.sourceIndex, 1);
    formatInput(codes);
    closeMenu();
    closeModal();
    saveData();
    generateCodes();
    showToast(`Đã xóa mã ${entry.code}`);
  }

  function openModal(index) {
    if (!state.preview[index]) return;
    state.lastModalFocus = document.activeElement;
    state.activeIndex = index;
    $('codeModal').hidden = false;
    document.body.style.overflow = 'hidden';
    $('modalClose').focus();
    renderModal();
  }

  function closeModal() {
    if ($('codeModal').hidden) return;
    $('codeModal').hidden = true;
    document.body.style.overflow = '';
    state.activeIndex = -1;
    state.lastModalFocus?.focus?.();
  }

  async function renderModal() {
    const index = state.activeIndex;
    const entry = state.preview[index];
    if (!entry) return;
    const preview = $('modalCodePreview');
    preview.replaceChildren();
    $('modalCodeValue').textContent = entry.code;
    $('modalCodeCounter').textContent = `${index + 1} / ${state.preview.length}`;
    $('modalPrev').disabled = state.preview.length < 2;
    $('modalNext').disabled = state.preview.length < 2;
    try { await drawCode(preview, entry.code, settings(), 'modal'); }
    catch (error) { showCardError(preview, error); }
  }

  function shiftModal(offset) {
    if (state.activeIndex < 0 || !state.preview.length) return;
    state.activeIndex = (state.activeIndex + offset + state.preview.length) % state.preview.length;
    renderModal();
  }

  function wireEvents() {
    $('barcodeInputs').addEventListener('input', () => {
      saveData();
      updateStats();
      scheduleGenerate(320);
    });
    $('searchPreview').addEventListener('input', () => scheduleGenerate(130));
    $('generateBtn').addEventListener('click', () => { clearTimeout(state.inputTimer); generateCodes(true); });
    $('dedupBtn').addEventListener('click', removeDuplicates);
    $('clearBtn').addEventListener('click', clearAll);
    $('sampleBtn').addEventListener('click', () => {
      if (parseCodes().length && !window.confirm('Thay danh sách hiện tại bằng dữ liệu mẫu?')) return;
      $('barcodeInputs').value = 'PKG-000001\nPKG-000002\nPKG-000003\nPKG-000003\nPKG-000004\nPKG-000005';
      $('searchPreview').value = '';
      saveData();
      generateCodes(true);
    });
    document.querySelectorAll('input[name="code-type"],#codeSize,#showLabel,#autoDedup').forEach(el => {
      el.addEventListener('change', () => { saveData(); generateCodes(); });
    });
    $('inputFormat').addEventListener('change', () => {
      formatInput(parseCodes());
      saveData();
      generateCodes();
    });
    [$('paperWidth'), $('paperHeight')].forEach(el => el.addEventListener('change', updatePaperSize));
    document.querySelectorAll('.preset').forEach(button => button.addEventListener('click', () => {
      $('paperWidth').value = button.dataset.width;
      $('paperHeight').value = button.dataset.height;
      updatePaperSize();
      showToast(`Đã chọn khổ tem ${button.dataset.width} × ${button.dataset.height} mm`);
    }));
    $('themeBtn').addEventListener('click', toggleTheme);
    $('openSidebar').addEventListener('click', () => setSidebar(true));
    $('closeSidebar').addEventListener('click', () => setSidebar(false));
    $('sidebarBackdrop').addEventListener('click', () => setSidebar(false));
    window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
      if (event.matches) {
        $('sidebar').classList.remove('is-open');
        $('sidebarBackdrop').hidden = true;
      }
    });
    $('printBtn').addEventListener('click', printCodes);
    $('zipBtn').addEventListener('click', downloadZip);
    $('contextMenu').addEventListener('click', event => {
      const btn = event.target.closest('[data-context-action]');
      if (!btn) return;
      const index = state.menuIndex;
      const entry = state.preview[index];
      closeMenu();
      if (!entry) return;
      switch (btn.dataset.contextAction) {
        case 'copy': copyText(entry.code); break;
        case 'download': downloadSingle(index); break;
        case 'delete': deleteEntry(index); break;
      }
    });
    document.addEventListener('pointerdown', event => {
      if (!event.target.closest('#contextMenu')) closeMenu();
    });
    window.addEventListener('resize', closeMenu);
    $('modalClose').addEventListener('click', closeModal);
    $('codeModal').querySelector('[data-close-modal]').addEventListener('click', closeModal);
    $('modalPrev').addEventListener('click', () => shiftModal(-1));
    $('modalNext').addEventListener('click', () => shiftModal(1));
    $('modalCopy').addEventListener('click', () => {
      const entry = state.preview[state.activeIndex];
      if (entry) copyText(entry.code);
    });
    $('modalDownload').addEventListener('click', () => downloadSingle(state.activeIndex));
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        printCodes();
        return;
      }
      if (event.key === 'Escape') {
        if (!$('contextMenu').hidden) closeMenu();
        else if (!$('codeModal').hidden) closeModal();
        else if ($('sidebar').classList.contains('is-open')) setSidebar(false);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        clearTimeout(state.inputTimer);
        generateCodes(true);
      }
      if (!$('codeModal').hidden && !event.altKey && !event.ctrlKey) {
        if (event.key === 'ArrowLeft') { event.preventDefault(); shiftModal(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); shiftModal(1); }
      }
    });
    window.addEventListener('beforeprint', updatePaperSize);
    window.addEventListener('afterprint', () => $('printSheet').replaceChildren());
  }

  function boot() {
    readStoredData();
    wireEvents();
    updatePaperSize();
    updateStats(0);
    if (parseCodes().length) generateCodes();
  }
  boot();
})();

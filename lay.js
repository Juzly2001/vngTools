(() => {
  const TOOL_ID = "simple-delay-picker-tool";
  const STYLE_ID = "simple-delay-picker-style";
  const SHORTCUT_HANDLER_KEY =
    "__simpleDelayPickerShortcutHandler";

  // Xóa giao diện cũ
  document.getElementById(TOOL_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  // Xóa sự kiện phím tắt của bản cũ nếu có
  if (window[SHORTCUT_HANDLER_KEY]) {
    document.removeEventListener(
      "keydown",
      window[SHORTCUT_HANDLER_KEY],
      true
    );

    delete window[SHORTCUT_HANDLER_KEY];
  }

  const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

  // Chờ phần tử xuất hiện, không dùng MutationObserver
  async function waitFor(
    selector,
    root = document,
    timeout = 5000
  ) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeout) {
      const element = root.querySelector(selector);

      if (element) {
        return element;
      }

      await sleep(100);
    }

    throw new Error(`Không tìm thấy: ${selector}`);
  }

  function isVisible(element) {
    if (!element) {
      return false;
    }

    const style = window.getComputedStyle(element);

    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      element.getClientRects().length > 0
    );
  }

  // Chỉ tìm nút Delay của từng đơn trong tbody
  // Không lấy nút Delay chung phía trên
  function getFirstDelayButton() {
    const buttons = Array.from(
      document.querySelectorAll(
        '#not-reviewed-packages tbody ' +
        'a.mark-as-tmp-delay-picking-package-status.aui-cell-button' +
        '[tmp-picked-package-status="6"]'
      )
    );

    return (
      buttons.find(button => {
        const row = button.closest("tr");

        return (
          row &&
          isVisible(row) &&
          isVisible(button) &&
          button.getAttribute("aria-expanded") !== "true"
        );
      }) || null
    );
  }

  function getTomorrow() {
    const date = new Date();

    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);

    return date;
  }

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(
      2,
      "0"
    );
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function setNativeValue(input, value) {
    const nativeSetter =
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set;

    if (nativeSetter) {
      nativeSetter.call(input, value);
    } else {
      input.value = value;
    }

    input.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    input.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );
  }

  function setTomorrow(input) {
    const tomorrow = getTomorrow();
    const text = formatDate(tomorrow);

    // Trang đang sử dụng jQuery UI Datepicker
    if (
      window.jQuery &&
      typeof window.jQuery.fn?.datepicker === "function"
    ) {
      try {
        window.jQuery(input).datepicker(
          "setDate",
          tomorrow
        );

        window.jQuery(input).trigger("input");
        window.jQuery(input).trigger("change");

        return text;
      } catch (error) {
        console.warn(
          "[Delay Picker] Datepicker thất bại, chuyển sang nhập trực tiếp.",
          error
        );
      }
    }

    input.focus();
    setNativeValue(input, text);
    input.blur();

    return text;
  }

  /*
   * Chỉ dùng cho nút Delay lấy hàng.
   * Mô phỏng đầy đủ chuỗi thao tác chuột để mở bảng AUI.
   */
  async function clickDelayButton(element) {
    if (!element) {
      throw new Error("Không có nút Delay để bấm");
    }

    element.scrollIntoView({
      behavior: "auto",
      block: "center",
      inline: "center"
    });

    await sleep(100);

    const rect = element.getBoundingClientRect();

    const clientX =
      rect.left + rect.width / 2;

    const clientY =
      rect.top + rect.height / 2;

    element.focus({
      preventScroll: true
    });

    const commonOptions = {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      detail: 1,
      screenX: window.screenX + clientX,
      screenY: window.screenY + clientY,
      clientX,
      clientY,
      button: 0
    };

    // Pointer over
    if (typeof PointerEvent === "function") {
      element.dispatchEvent(
        new PointerEvent("pointerover", {
          ...commonOptions,
          pointerId: 1,
          pointerType: "mouse",
          isPrimary: true,
          buttons: 0
        })
      );
    }

    element.dispatchEvent(
      new MouseEvent("mouseover", {
        ...commonOptions,
        buttons: 0
      })
    );

    // Pointer enter
    if (typeof PointerEvent === "function") {
      element.dispatchEvent(
        new PointerEvent("pointerenter", {
          ...commonOptions,
          bubbles: false,
          pointerId: 1,
          pointerType: "mouse",
          isPrimary: true,
          buttons: 0
        })
      );
    }

    element.dispatchEvent(
      new MouseEvent("mouseenter", {
        ...commonOptions,
        bubbles: false,
        buttons: 0
      })
    );

    // Move
    if (typeof PointerEvent === "function") {
      element.dispatchEvent(
        new PointerEvent("pointermove", {
          ...commonOptions,
          pointerId: 1,
          pointerType: "mouse",
          isPrimary: true,
          buttons: 0
        })
      );
    }

    element.dispatchEvent(
      new MouseEvent("mousemove", {
        ...commonOptions,
        buttons: 0
      })
    );

    // Down
    if (typeof PointerEvent === "function") {
      element.dispatchEvent(
        new PointerEvent("pointerdown", {
          ...commonOptions,
          pointerId: 1,
          pointerType: "mouse",
          isPrimary: true,
          buttons: 1,
          pressure: 0.5
        })
      );
    }

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        ...commonOptions,
        buttons: 1
      })
    );

    element.focus({
      preventScroll: true
    });

    await sleep(50);

    // Up
    if (typeof PointerEvent === "function") {
      element.dispatchEvent(
        new PointerEvent("pointerup", {
          ...commonOptions,
          pointerId: 1,
          pointerType: "mouse",
          isPrimary: true,
          buttons: 0,
          pressure: 0
        })
      );
    }

    element.dispatchEvent(
      new MouseEvent("mouseup", {
        ...commonOptions,
        buttons: 0
      })
    );

    // Click
    element.dispatchEvent(
      new MouseEvent("click", {
        ...commonOptions,
        buttons: 0
      })
    );

    await sleep(100);
  }

  // Kiểm tra bảng Delay đã mở hay chưa
  async function waitForDropdownOpen(
    dropdown,
    delayButton,
    timeout = 2000
  ) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeout) {
      const expanded =
        delayButton.getAttribute("aria-expanded") ===
        "true";

      if (expanded || isVisible(dropdown)) {
        return true;
      }

      await sleep(100);
    }

    return false;
  }

  // =========================
  // GIAO DIỆN
  // =========================

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `
    #${TOOL_ID} {
      position: fixed !important;
      top: 15px !important;
      right: 15px !important;
      z-index: 2147483647 !important;
      width: 270px !important;
      padding: 12px !important;
      background: #111827 !important;
      color: #ffffff !important;
      border: 1px solid #4b5563 !important;
      border-radius: 10px !important;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35) !important;
      font-family: Arial, sans-serif !important;
      font-size: 14px !important;
      line-height: 1.4 !important;
    }

    #${TOOL_ID},
    #${TOOL_ID} * {
      box-sizing: border-box !important;
    }

    #${TOOL_ID} .sdp-header {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      margin-bottom: 10px !important;
    }

    #${TOOL_ID} .sdp-title {
      font-weight: 700 !important;
    }

    #${TOOL_ID} .sdp-close {
      width: 26px !important;
      height: 26px !important;
      padding: 0 !important;
      background: #374151 !important;
      color: #ffffff !important;
      border: 0 !important;
      border-radius: 5px !important;
      cursor: pointer !important;
    }

    #${TOOL_ID} .sdp-close:hover {
      background: #4b5563 !important;
    }

    #${TOOL_ID} table {
      width: 100% !important;
      margin-bottom: 10px !important;
      border-collapse: collapse !important;
    }

    #${TOOL_ID} td {
      padding: 5px 3px !important;
      color: #ffffff !important;
      border-bottom: 1px solid #374151 !important;
    }

    #${TOOL_ID} td:first-child {
      width: 75px !important;
      color: #9ca3af !important;
    }

    #${TOOL_ID} .sdp-result {
      word-break: break-word !important;
    }

    #${TOOL_ID} .sdp-status {
      word-break: break-word !important;
      color: #fbbf24 !important;
    }

    #${TOOL_ID} .sdp-status.success {
      color: #4ade80 !important;
    }

    #${TOOL_ID} .sdp-status.error {
      color: #f87171 !important;
    }

    #${TOOL_ID} .sdp-find {
      width: 100% !important;
      min-height: 40px !important;
      padding: 8px !important;
      background: #2563eb !important;
      color: #ffffff !important;
      border: 0 !important;
      border-radius: 7px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
    }

    #${TOOL_ID} .sdp-find:hover {
      background: #1d4ed8 !important;
    }

    #${TOOL_ID} .sdp-find:disabled {
      opacity: 0.55 !important;
      cursor: wait !important;
    }

    #${TOOL_ID} .sdp-shortcut {
      margin-top: 8px !important;
      text-align: center !important;
      color: #9ca3af !important;
      font-size: 12px !important;
    }

    #${TOOL_ID} .sdp-shortcut kbd {
      display: inline-block !important;
      padding: 2px 5px !important;
      background: #374151 !important;
      color: #ffffff !important;
      border: 1px solid #6b7280 !important;
      border-radius: 4px !important;
      font-family: Arial, sans-serif !important;
      font-size: 11px !important;
    }
  `;

  document.head.appendChild(style);

  const panel = document.createElement("div");
  panel.id = TOOL_ID;

  panel.innerHTML = `
    <div class="sdp-header">
      <span class="sdp-title">📦 Delay Picker</span>

      <button
        type="button"
        class="sdp-close"
        title="Đóng công cụ"
      >
        ×
      </button>
    </div>

    <table>
      <tbody>
        <tr>
          <td>Kết quả</td>
          <td class="sdp-result">Chưa tìm</td>
        </tr>

        <tr>
          <td>Trạng thái</td>
          <td class="sdp-status">Sẵn sàng</td>
        </tr>
      </tbody>
    </table>

    <button
      type="button"
      class="sdp-find"
    >
      🔍 Tìm đầu tiên
    </button>

    <div class="sdp-shortcut">
      Phím tắt:
      <kbd>Ctrl</kbd>
      +
      <kbd>X</kbd>
    </div>
  `;

  document.body.appendChild(panel);

  const findButton =
    panel.querySelector(".sdp-find");

  const closeButton =
    panel.querySelector(".sdp-close");

  const resultElement =
    panel.querySelector(".sdp-result");

  const statusElement =
    panel.querySelector(".sdp-status");

  function setStatus(text, type = "") {
    statusElement.textContent = text;
    statusElement.className =
      `sdp-status ${type}`.trim();
  }

  // =========================
  // XỬ LÝ ĐƠN ĐẦU TIÊN
  // =========================

  async function processFirst() {
    if (findButton.disabled) {
      return;
    }

    findButton.disabled = true;
    findButton.textContent = "⏳ Đang xử lý...";

    try {
      setStatus("Đang tìm nút Delay...");

      const delayButton = getFirstDelayButton();

      if (!delayButton) {
        throw new Error(
          "Không tìm thấy đơn Delay đang hiển thị"
        );
      }

      const row = delayButton.closest("tr");
      const rowId = row?.id || "không rõ";

      resultElement.textContent = rowId;

      // Mỗi nút có aria-controls trỏ đúng đến dropdown
      const dropdownId =
        delayButton.getAttribute("aria-controls");

      if (!dropdownId) {
        throw new Error(
          "Nút Delay không có aria-controls"
        );
      }

      const dropdown =
        document.getElementById(dropdownId);

      if (!dropdown) {
        throw new Error(
          `Không tìm thấy bảng Delay: #${dropdownId}`
        );
      }

      setStatus("Đang nhấn nút Delay lấy hàng...");

      // Chỉ nút Delay dùng chuỗi sự kiện chuột
      await clickDelayButton(delayButton);

      const opened = await waitForDropdownOpen(
        dropdown,
        delayButton
      );

      if (!opened) {
        console.warn(
          "[Delay Picker] Chuỗi sự kiện chưa mở bảng, thử click gốc."
        );

        delayButton.click();

        await sleep(300);
      }

      // Chỉ tìm trong dropdown đúng của đơn
      const reasonButton = await waitFor(
        'a.delay-picking-reason[reason-code="104"]',
        dropdown
      );

      setStatus("Đang chọn NCC hẹn ngày lấy...");

      reasonButton.click();

      await sleep(300);

      const morningButton = await waitFor(
        'a.delay-picking-period-to-pick' +
        '[period-to-pick="MORNING"]',
        dropdown
      );

      setStatus("Đang chọn Sáng...");

      morningButton.click();

      await sleep(200);

      const dateInput = await waitFor(
        "input.date-to-pick.hasDatepicker",
        dropdown
      );

      const dateText = setTomorrow(dateInput);

      setStatus(
        `Đã chọn Sáng, ngày ${dateText}`,
        "success"
      );

    } catch (error) {
      console.error(
        "[Delay Picker]",
        error
      );

      setStatus(
        error?.message || "Có lỗi xảy ra",
        "error"
      );
    } finally {
      findButton.disabled = false;
      findButton.textContent =
        "🔍 Tìm đầu tiên";
    }
  }

  // Bấm nút trên bảng
  findButton.addEventListener(
    "click",
    processFirst
  );

  // =========================
  // PHÍM TẮT CTRL + X
  // =========================

  function handleShortcut(event) {
    const isCtrlX =
      event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      event.key.toLowerCase() === "x";

    if (!isCtrlX) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (!findButton.disabled) {
      processFirst();
    }
  }

  window[SHORTCUT_HANDLER_KEY] =
    handleShortcut;

  document.addEventListener(
    "keydown",
    handleShortcut,
    true
  );

  // =========================
  // ĐÓNG CÔNG CỤ
  // =========================

  function closeTool() {
    document.removeEventListener(
      "keydown",
      handleShortcut,
      true
    );

    if (
      window[SHORTCUT_HANDLER_KEY] ===
      handleShortcut
    ) {
      delete window[SHORTCUT_HANDLER_KEY];
    }

    panel.remove();
    style.remove();

  }

  closeButton.addEventListener(
    "click",
    closeTool
  );

})();
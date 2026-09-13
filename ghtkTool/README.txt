GHTK Tool Center - Chrome Extension modular

Cách dùng:
1. Mở chrome://extensions
2. Bật Developer mode
3. Chọn Load unpacked và trỏ tới thư mục này
4. Khi sửa file JS: bấm Reload extension, sau đó reload trang web đang mở

Cấu trúc:
- 00-runtime.js: runtime quản lý lifecycle start/stop, listener, timer, node
- 01-auto-click.js: Auto Clicker
- 02-delay-picker.js: Delay Picker GHTK
- 03-mini-ghtk-excel.js: Mini GHTK Excel
- 04-giao-dau-ngay.js: tác vụ Giao đầu ngày
- 10-master-control.js: giao diện bảng điều khiển
- manifest.json: Chrome Extension Manifest V3

Phím Ctrl+Shift+G: ẩn/hiện bảng điều khiển.

// Chuẩn tool
GHTKTools.register({
    id: "tool-moi",
    name: "Tool Mới",
    description: "Mô tả chức năng",
    icon: "🔧",
    type: "toggle",

    start() {
        // bật tool
    },

    stop() {
        // tắt tool
    }
});
(function initSheetAlarm() {
  const PUSHER_KEY = "5e055a3bcf354463a290";
  const PUSHER_CLUSTER = "ap1";
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/1DAmP5lB77GJQA2OS5o8PKGEpYiujh2Up9zoRMzDQUqU/edit?gid=0#gid=0";
  const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzetzb0y0xqALn7Kbt2tQOUZyYU15Q2_Asll7NvPgPyy2FpRfjVuACVJMF3qM8KAzd_/exec";

  // 1. Style UI: Bổ sung Keyframes hiệu ứng rung lắc cho biểu tượng quả chuông
  if (!document.getElementById('sheet-alarm-style')) {
    const style = document.createElement('style');
    style.id = 'sheet-alarm-style';
    style.innerHTML = `
      .sheet-notification-box {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        background: #0f172a;
        color: #ffffff;
        padding: 16px 22px;
        border-radius: 14px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.2);
        border-left: 5px solid #10b981;
        display: flex;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        max-width: 450px;
        cursor: pointer;
        user-select: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .sheet-notification-box:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.3);
      }
      @keyframes slideIn {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }

      /* Hiệu ứng rung chuông liên tục */
      .bell-ring {
        display: inline-block;
        animation: ring 1.5s infinite ease-in-out;
        transform-origin: top center;
      }
      @keyframes ring {
        0% { transform: rotate(0); }
        5% { transform: rotate(30deg); }
        10% { transform: rotate(-28deg); }
        15% { transform: rotate(34deg); }
        20% { transform: rotate(-32deg); }
        25% { transform: rotate(30deg); }
        30% { transform: rotate(-24deg); }
        35% { transform: rotate(18deg); }
        40% { transform: rotate(-12deg); }
        45% { transform: rotate(6deg); }
        50% { transform: rotate(-2deg); }
        55% { transform: rotate(0); }
        100% { transform: rotate(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // 2. Âm thanh thông báo
  const sheetAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3');
  sheetAudio.loop = true;

  function triggerAlarm(eventTimestamp) {
    if (document.querySelector('.sheet-notification-box')) return;

    sheetAudio.currentTime = 0;
    sheetAudio.play().catch(() => console.log("Click vào trang web để phát âm thanh."));

    const noti = document.createElement('div');
    noti.className = 'sheet-notification-box';
    noti.innerHTML = `
      <div style="flex: 1;">
        <div style="font-weight: 700; color: #10b981; font-size: 15px;">
          <span class="bell-ring">🔔</span> Thu Phương đang muốn mua đồ nè!
        </div>
      </div>
    `;

    noti.onclick = function() {
      sheetAudio.pause();
      sheetAudio.currentTime = 0;
      noti.remove();

      if (eventTimestamp) {
        localStorage.setItem('sheet_last_seen_time', eventTimestamp.toString());
      } else {
        localStorage.setItem('sheet_last_seen_time', Date.now().toString());
      }

      window.open(SHEET_URL, '_blank');
    };

    document.body.appendChild(noti);
  }

  // 3. Kiểm tra thông báo nhỡ
  function checkMissedUpdates() {
    if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("ĐÁN_WEB_APP")) return;

    const lastSeenTime = parseInt(localStorage.getItem('sheet_last_seen_time') || "0");

    fetch(APPS_SCRIPT_WEB_APP_URL)
      .then(res => res.json())
      .then(data => {
        if (data.lastUpdated && data.lastUpdated > lastSeenTime) {
          triggerAlarm(data.lastUpdated);
        }
      })
      .catch(err => console.log("Chưa thể kiểm tra cập nhật nhỡ:", err));
  }

  // 4. Khởi tạo Pusher & Check cập nhật
  if (typeof Pusher !== 'undefined') {
    const pusherClient = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER });
    const channel = pusherClient.subscribe('my-channel');

    channel.bind('my-event', function(data) {
      triggerAlarm(data.timestamp || Date.now());
    });

    checkMissedUpdates();
  }
})();
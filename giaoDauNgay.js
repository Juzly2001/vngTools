// Tìm tất cả các link đơn hàng
const links = document.querySelectorAll('a[href*="admin?alias=S"]');

// Giới hạn số lượng tối đa là 30
const limit = 30;
const count = Math.min(links.length, limit);

for (let i = 0; i < count; i++) {
    // Mở từng link trong tab mới với khoảng trễ
    setTimeout(() => {
        window.open(links[i].href, '_blank', 'noopener,noreferrer');
    }, i * 300); // 300ms/link
}

console.log(`Đã mở ${count} link.`);
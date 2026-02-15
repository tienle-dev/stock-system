# 🚀 Hướng dẫn khởi động nhanh - 5 phút

## Bước 1: Lấy API Keys (2 phút)

### Alpha Vantage API Key
1. Truy cập: https://www.alphavantage.co/support/#api-key
2. Nhập email của bạn
3. Nhận key miễn phí ngay lập tức

### Finnhub API Key
1. Truy cập: https://finnhub.io/register
2. Đăng ký tài khoản miễn phí
3. Copy API key từ dashboard

## Bước 2: Cấu hình (1 phút)

Mở file `backend/.env` và thay thế:

```env
ALPHA_VANTAGE_API_KEY=PASTE_YOUR_KEY_HERE
FINNHUB_API_KEY=PASTE_YOUR_KEY_HERE
```

## Bước 3: Cài đặt & Chạy (2 phút)

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```

Đợi thông báo: `⚡️ REST API server running on http://localhost:3001`

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

Đợi thông báo: `Ready on http://localhost:3000`

## Bước 4: Mở trình duyệt

Truy cập: **http://localhost:3000**

🎉 **Xong!** Bạn đã có trang web theo dõi chứng khoán!

---

## ✨ Thử ngay

1. **Tìm kiếm cổ phiếu**: Gõ "AAPL", "TSLA", hoặc "GOOGL" trong thanh tìm kiếm
2. **Xem biểu đồ**: Click vào card của bất kỳ cổ phiếu nào
3. **Giá real-time**: Xem chấm xanh "Live" ở góc phải trên cùng

---

## ⚠️ Lưu ý quan trọng

### Giới hạn API miễn phí:
- **Alpha Vantage**: 5 requests/phút, 500 requests/ngày
- **Finnhub**: 60 requests/phút

➡️ Nếu thấy lỗi hoặc dữ liệu không load, đợi 1 phút rồi thử lại!

---

## 🐳 Chạy với Docker (Alternative)

Nếu bạn có Docker:

```bash
# Cấu hình API keys trong backend/.env trước
docker-compose up --build
```

Xong! Truy cập http://localhost:3000

---

## 🆘 Gặp vấn đề?

### Backend không chạy?
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend không chạy?
```bash
cd frontend
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

### WebSocket không kết nối?
- Kiểm tra backend đang chạy
- Restart cả frontend và backend
- Clear browser cache và reload

---

## 📚 Tài liệu đầy đủ

Xem [README.md](./README.md) để biết thêm chi tiết về:
- Kiến trúc hệ thống
- API documentation
- Cấu hình nâng cao
- Troubleshooting chi tiết

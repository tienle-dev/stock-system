# 📈 Global Stock Market Tracker

Hệ thống theo dõi chứng khoán quốc tế theo thời gian thực với giao diện hiện đại, biểu đồ tương tác và cập nhật giá trực tiếp qua WebSocket.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

## ✨ Tính năng chính

- 🔄 **Theo dõi thời gian thực**: WebSocket để cập nhật giá chứng khoán tự động
- 📊 **Biểu đồ chuyên nghiệp**: Sử dụng Lightweight Charts của TradingView
- 🌍 **Chỉ số thị trường toàn cầu**: S&P 500, Dow Jones, NASDAQ, FTSE 100, Nikkei 225
- 🔍 **Tìm kiếm thông minh**: Tìm kiếm cổ phiếu nhanh chóng và chính xác
- 📰 **Tin tức tài chính**: Cập nhật tin tức mới nhất về từng cổ phiếu
- 📱 **Responsive Design**: Hoạt động mượt mà trên mọi thiết bị
- 🎨 **Giao diện hiện đại**: Sử dụng Tailwind CSS

## 🏗️ Kiến trúc hệ thống

```
stock-system/
├── frontend/              # Next.js App (React 19)
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   │   ├── stock/       # Stock-related components
│   │   ├── chart/       # Chart components
│   │   └── ui/          # UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # API utilities
│   └── types/           # TypeScript types
│
├── backend/              # Node.js API Server
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── websocket/   # WebSocket server
│   │   ├── types/       # TypeScript types
│   │   └── server.ts    # Main server file
│   └── package.json
│
└── docker-compose.yml    # Docker configuration
```

## 🚀 Bắt đầu nhanh

### Yêu cầu hệ thống

- Node.js 20+
- npm hoặc yarn
- Docker (tùy chọn)

### 1. Cài đặt dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Cấu hình API Keys

Bạn cần đăng ký API keys miễn phí từ:

- **Alpha Vantage**: https://www.alphavantage.co/support/#api-key
- **Finnhub**: https://finnhub.io/register

Sau đó cập nhật file `.env` trong thư mục `backend/`:

```env
ALPHA_VANTAGE_API_KEY=your_actual_key_here
FINNHUB_API_KEY=your_actual_key_here
```

### 3. Chạy ứng dụng

#### Chạy Backend
```bash
cd backend
npm run dev
```

Server sẽ chạy tại:
- REST API: `http://localhost:3001`
- WebSocket: `ws://localhost:3002`

#### Chạy Frontend
```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 4. Sử dụng Docker (Alternative)

```bash
# Build và chạy tất cả services
docker-compose up --build

# Chạy ở chế độ nền
docker-compose up -d

# Dừng services
docker-compose down
```

## 📡 API Endpoints

### Stock APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/stocks/quote/:symbol` | Lấy giá hiện tại của mã chứng khoán |
| GET | `/api/stocks/chart/:symbol?interval=daily` | Lấy dữ liệu biểu đồ |
| GET | `/api/stocks/news/:symbol?limit=10` | Lấy tin tức về cổ phiếu |
| GET | `/api/stocks/indices` | Lấy chỉ số thị trường chính |
| GET | `/api/stocks/search?q=query` | Tìm kiếm mã chứng khoán |

### WebSocket Protocol

Kết nối tới `ws://localhost:3002`

**Subscribe to symbols:**
```json
{
  "type": "subscribe",
  "data": { "symbols": ["AAPL", "GOOGL"] },
  "timestamp": 1234567890
}
```

**Receive price updates:**
```json
{
  "type": "price_update",
  "data": {
    "symbol": "AAPL",
    "price": 178.50,
    "change": 2.30,
    "changePercent": 1.31,
    "timestamp": 1234567890
  },
  "timestamp": 1234567890
}
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS
- **Charts**: Lightweight Charts (TradingView)
- **State Management**: React Hooks
- **Real-time**: WebSocket API

### Backend
- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Framework**: Express.js
- **WebSocket**: ws library
- **HTTP Client**: Axios
- **APIs**: Alpha Vantage, Finnhub

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Development**: Nodemon, ts-node

## 📚 Các components chính

### Frontend Components

- **`SearchBar`**: Tìm kiếm cổ phiếu với autocomplete
- **`StockCard`**: Hiển thị thông tin chi tiết của từng cổ phiếu
- **`MarketIndices`**: Hiển thị các chỉ số thị trường toàn cầu
- **`StockChart`**: Biểu đồ nến (candlestick) tương tác
- **`NewsList`**: Danh sách tin tức về cổ phiếu

### Backend Services

- **`stockService`**: Service xử lý API calls đến Alpha Vantage và Finnhub
- **`WebSocket Server`**: Quản lý kết nối real-time và push giá cập nhật

## 🔧 Cấu hình nâng cao

### Database (PostgreSQL - Aiven)

Nếu bạn muốn lưu trữ watchlist và user data, cập nhật các biến môi trường sau trong `backend/.env`:

```env
DATABASE_HOST=your_aiven_host
DATABASE_PORT=5432
DATABASE_NAME=stock_system
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_SSL=true
```

### Redis Cache

Để cải thiện hiệu suất với Redis cache:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
```

## 📝 Scripts

### Backend
```bash
npm run dev      # Chạy development mode với nodemon
npm run build    # Build TypeScript sang JavaScript
npm start        # Chạy production mode
npm run lint     # Kiểm tra code với ESLint
```

### Frontend
```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm start        # Chạy production server
npm run lint     # Kiểm tra code với ESLint
```

## 🐛 Troubleshooting

### API Keys không hoạt động
- Kiểm tra xem bạn đã đăng ký keys chính thức chưa (không dùng "demo")
- Xác nhận keys được cập nhật đúng trong file `.env`
- Restart backend server sau khi thay đổi `.env`

### WebSocket không kết nối
- Kiểm tra backend đang chạy và lắng nghe trên port 3002
- Kiểm tra firewall không chặn WebSocket connections
- Xem console logs để debugging

### Chart không hiển thị
- Kiểm tra Alpha Vantage API có trả về dữ liệu không
- API miễn phí có giới hạn 5 requests/minute, 500 requests/day
- Thử với symbol khác hoặc đợi vài phút

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo pull request hoặc báo cáo issues.

## 📧 Liên hệ

- GitHub Issues: [Create an issue](https://github.com/tienle-dev/stock-system/issues)

---

**Lưu ý**: Dữ liệu chứng khoán được cung cấp bởi Alpha Vantage và Finnhub API. Vui lòng tuân thủ điều khoản sử dụng của họ.

# 🤝 Đóng góp vào Stock System

Cảm ơn bạn đã quan tâm đến việc đóng góp cho Stock System! Chúng tôi rất trân trọng mọi đóng góp từ cộng đồng.

## 📋 Mục lục
- [Code of Conduct](#code-of-conduct)
- [Cách đóng góp](#cách-đóng-góp)
- [Quy trình phát triển](#quy-trình-phát-triển)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

Dự án này tuân theo Code of Conduct. Bằng cách tham gia, bạn đồng ý tuân thủ các quy tắc này.

### Chúng tôi cam kết:
- Tôn trọng mọi người
- Chấp nhận phản hồi mang tính xây dựng
- Tập trung vào những gì tốt nhất cho cộng đồng
- Thể hiện sự đồng cảm với các thành viên khác

## 🚀 Cách đóng góp

Có nhiều cách để đóng góp cho Stock System:

### 1. Báo cáo lỗi (Bug Reports)
- Kiểm tra xem issue đã tồn tại chưa
- Sử dụng bug report template
- Cung cấp chi tiết:
  - Mô tả rõ ràng về bug
  - Các bước để tái hiện
  - Kết quả mong đợi vs thực tế
  - Screenshots nếu có
  - Môi trường (OS, browser, Node version)

### 2. Đề xuất tính năng (Feature Requests)
- Kiểm tra roadmap và issues hiện có
- Mô tả rõ ràng tính năng
- Giải thích tại sao tính năng này hữu ích
- Cung cấp ví dụ cụ thể

### 3. Code Contributions
- Fork repository
- Tạo branch mới
- Viết code
- Submit pull request

### 4. Documentation
- Cải thiện README
- Viết tutorials
- Thêm code comments
- Dịch documentation

### 5. Testing
- Viết unit tests
- Viết integration tests
- Test trên các browsers khác nhau
- Báo cáo bugs

## 🛠️ Quy trình phát triển

### Setup môi trường

1. **Fork và clone repository**
```bash
git clone https://github.com/YOUR_USERNAME/stock-system.git
cd stock-system
```

2. **Cài đặt dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Tạo branch mới**
```bash
git checkout -b feature/your-feature-name
# hoặc
git checkout -b fix/your-bug-fix
```

4. **Cấu hình environment**
- Copy `.env.example` sang `.env`
- Thêm API keys của bạn

5. **Chạy development server**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Branch Naming Convention

- `feature/` - Tính năng mới (e.g., `feature/add-dark-mode`)
- `fix/` - Sửa bug (e.g., `fix/websocket-reconnect`)
- `docs/` - Documentation (e.g., `docs/update-readme`)
- `refactor/` - Refactoring code (e.g., `refactor/api-service`)
- `test/` - Thêm tests (e.g., `test/add-unit-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

## 📝 Coding Standards

### TypeScript
- Sử dụng TypeScript strict mode
- Định nghĩa types rõ ràng, tránh `any`
- Sử dụng interfaces cho objects
- Export types từ `types/index.ts`

### React/Next.js
- Functional components với hooks
- Sử dụng `'use client'` directive khi cần
- Props typing với TypeScript
- Tách logic phức tạp ra custom hooks

### Formatting
```bash
# Chạy linter
npm run lint

# Format code (nếu có prettier)
npm run format
```

### Naming Conventions
- **Components**: PascalCase (e.g., `StockCard.tsx`)
- **Functions**: camelCase (e.g., `getStockQuote`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: kebab-case cho utils (e.g., `api-client.ts`)

### Code Style
```typescript
// ✅ Good
interface StockQuote {
  symbol: string;
  price: number;
}

async function getQuote(symbol: string): Promise<StockQuote> {
  const response = await fetch(`/api/quote/${symbol}`);
  return response.json();
}

// ❌ Bad
function getQuote(symbol: any): any {
  return fetch(`/api/quote/${symbol}`).then(r => r.json());
}
```

## 💬 Commit Messages

Sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

### Types:
- `feat`: Tính năng mới
- `fix`: Sửa bug
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

### Examples:
```bash
feat(chart): add volume indicator
fix(websocket): resolve reconnection issue
docs(readme): update installation guide
refactor(api): simplify stock service
test(chart): add unit tests for StockChart
chore(deps): update dependencies
```

## 🔄 Pull Request Process

### Trước khi submit PR:

1. **Update từ main branch**
```bash
git checkout main
git pull upstream main
git checkout your-branch
git rebase main
```

2. **Chạy tests**
```bash
npm run test
npm run lint
```

3. **Build thành công**
```bash
npm run build
```

4. **Update documentation** nếu cần

### Tạo Pull Request:

1. Push branch lên fork của bạn
```bash
git push origin your-branch
```

2. Mở PR trên GitHub
3. Điền PR template:
   - Mô tả thay đổi
   - Link đến issue (nếu có)
   - Screenshots (nếu là UI change)
   - Checklist

### PR Template

```markdown
## Mô tả
Mô tả ngắn gọn về thay đổi

## Loại thay đổi
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Đã test như thế nào?
Mô tả các test case

## Checklist:
- [ ] Code tuân thủ coding standards
- [ ] Đã self-review code
- [ ] Đã comment code phức tạp
- [ ] Đã update documentation
- [ ] Không có warning mới
- [ ] Đã thêm tests
- [ ] Tests pass
```

### Review Process:

1. Ít nhất 1 maintainer sẽ review
2. Giải quyết feedback
3. Squash commits nếu cần
4. Maintainer sẽ merge

## 🧪 Testing

### Unit Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
- Aim for >80% coverage
- Test critical paths
- Test edge cases

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)

## 💡 Need Help?

- 📖 Đọc [README.md](./README.md)
- 🚀 Xem [QUICK_START.md](./QUICK_START.md)
- 🗺️ Check [ROADMAP.md](./ROADMAP.md)
- 💬 Tạo [Discussion](https://github.com/tienle-dev/stock-system/discussions)
- 🐛 Tạo [Issue](https://github.com/tienle-dev/stock-system/issues)

## 🎉 Recognition

Tất cả contributors sẽ được credit trong:
- README.md Contributors section
- Release notes
- Project documentation

Cảm ơn bạn đã đóng góp! 🙏

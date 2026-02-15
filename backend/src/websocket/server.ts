import WebSocket from 'ws';
import stockService from '../services/stockService';
import { WSMessage, StockPrice } from '../types';

class WebSocketServer {
  private wss: WebSocket.Server | null = null;
  private subscribers: Map<string, Set<WebSocket>> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private priceCache: Map<string, { price: number; timestamp: number }> = new Map();
  private indicesUpdateInterval: NodeJS.Timeout | null = null;

  init(port: number) {
    this.wss = new WebSocket.Server({ port });

    console.log(`WebSocket server running on port ${port}`);

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New client connected');

      // Gửi thông báo kết nối thành công
      this.sendMessage(ws, {
        type: 'connected',
        data: { message: 'Connected to Stock System WebSocket' },
        timestamp: Date.now()
      });

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error parsing message:', error);
          this.sendMessage(ws, {
            type: 'error',
            data: { message: 'Invalid message format' },
            timestamp: Date.now()
          });
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
        this.unsubscribeAll(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    // Bắt đầu cập nhật giá định kỳ
    this.startPriceUpdates();
    this.startIndicesUpdates();
  }

  private handleMessage(ws: WebSocket, message: WSMessage) {
    switch (message.type) {
      case 'subscribe':
        this.subscribe(ws, message.data.symbols);
        break;
      case 'unsubscribe':
        this.unsubscribe(ws, message.data.symbols);
        break;
      default:
        this.sendMessage(ws, {
          type: 'error',
          data: { message: 'Unknown message type' },
          timestamp: Date.now()
        });
    }
  }

  private subscribe(ws: WebSocket, symbols: string[]) {
    symbols.forEach(symbol => {
      if (!this.subscribers.has(symbol)) {
        this.subscribers.set(symbol, new Set());
      }
      this.subscribers.get(symbol)?.add(ws);
    });

    this.sendMessage(ws, {
      type: 'subscribed',
      data: { symbols },
      timestamp: Date.now()
    });

    console.log(`Client subscribed to: ${symbols.join(', ')}`);
  }

  private unsubscribe(ws: WebSocket, symbols: string[]) {
    symbols.forEach(symbol => {
      this.subscribers.get(symbol)?.delete(ws);
      if (this.subscribers.get(symbol)?.size === 0) {
        this.subscribers.delete(symbol);
        // Clear cache khi không còn ai subscribe
        this.priceCache.delete(symbol);
      }
    });

    this.sendMessage(ws, {
      type: 'unsubscribed',
      data: { symbols },
      timestamp: Date.now()
    });
  }

  private unsubscribeAll(ws: WebSocket) {
    this.subscribers.forEach((clients, symbol) => {
      clients.delete(ws);
      if (clients.size === 0) {
        this.subscribers.delete(symbol);
      }
    });
  }

  private sendMessage(ws: WebSocket, message: WSMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private broadcast(symbol: string, data: any) {
    const clients = this.subscribers.get(symbol);
    if (clients) {
      const message: WSMessage = {
        type: 'price_update',
        data: { symbol, ...data },
        timestamp: Date.now()
      };

      clients.forEach(client => {
        this.sendMessage(client, message);
      });
    }
  }

  private async startPriceUpdates() {
    // Cập nhật giá mỗi 3 giây để tạo cảm giác real-time
    this.updateInterval = setInterval(async () => {
      const symbols = Array.from(this.subscribers.keys());
      
      if (symbols.length === 0) return;

      // Lấy hoặc simulate giá mới cho tất cả symbols đang được subscribe
      for (const symbol of symbols) {
        try {
          let price: number;
          let change: number;
          let changePercent: number;
          
          const cached = this.priceCache.get(symbol);
          const now = Date.now();
          
          // Nếu chưa có cache hoặc cache đã cũ (> 5 phút), fetch từ API
          if (!cached || (now - cached.timestamp) > 300000) {
            const quote = await stockService.getStockQuote(symbol);
            if (!quote) continue;
            
            price = quote.price;
            change = quote.change;
            changePercent = quote.changePercent;
            
            this.priceCache.set(symbol, { price, timestamp: now });
          } else {
            // Simulate real-time price movement (±0.1% to ±0.5%)
            const previousPrice = cached.price;
            const randomChange = (Math.random() - 0.5) * 2; // -1 to +1
            const priceChange = previousPrice * (randomChange * 0.005); // ±0.5%
            
            price = parseFloat((previousPrice + priceChange).toFixed(2));
            change = parseFloat(priceChange.toFixed(2));
            changePercent = parseFloat(((priceChange / previousPrice) * 100).toFixed(2));
            
            // Update cache với giá mới
            this.priceCache.set(symbol, { price, timestamp: now });
          }
          
          this.broadcast(symbol, {
            price,
            change,
            changePercent,
            timestamp: now
          });
        } catch (error) {
          console.error(`Error updating price for ${symbol}:`, error);
        }
      }
    }, 3000); // Update every 3 seconds
  }

  private broadcastToAll(message: WSMessage) {
    if (!this.wss) return;
    
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  private async startIndicesUpdates() {
    // Cập nhật market indices mỗi 30 giây
    this.indicesUpdateInterval = setInterval(async () => {
      try {
        const indices = await stockService.getMarketIndices();
        
        this.broadcastToAll({
          type: 'indices_update',
          data: indices,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Error updating market indices:', error);
      }
    }, 10000); // Update every 10 seconds
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.indicesUpdateInterval) {
      clearInterval(this.indicesUpdateInterval);
    }
    if (this.wss) {
      this.wss.close();
    }
  }
}

export default new WebSocketServer();

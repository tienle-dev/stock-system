import WebSocket from 'ws';
import stockService from '../services/stockService';
import { WSMessage, StockPrice } from '../types';

class WebSocketServer {
  private wss: WebSocket.Server | null = null;
  private subscribers: Map<string, Set<WebSocket>> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

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
    // Cập nhật giá mỗi 5 giây
    this.updateInterval = setInterval(async () => {
      const symbols = Array.from(this.subscribers.keys());
      
      if (symbols.length === 0) return;

      // Lấy giá mới cho tất cả symbols đang được subscribe
      for (const symbol of symbols) {
        try {
          const quote = await stockService.getStockQuote(symbol);
          if (quote) {
            this.broadcast(symbol, {
              price: quote.price,
              change: quote.change,
              changePercent: quote.changePercent,
              timestamp: quote.timestamp
            });
          }
        } catch (error) {
          console.error(`Error updating price for ${symbol}:`, error);
        }
      }
    }, 5000);
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.wss) {
      this.wss.close();
    }
  }
}

export default new WebSocketServer();

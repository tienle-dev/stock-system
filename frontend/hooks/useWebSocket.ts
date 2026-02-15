import { useEffect, useRef, useState, useCallback } from 'react';
import { WSPriceUpdate } from '@/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002';
const MAX_RETRY_ATTEMPTS = 3; // Giới hạn số lần retry

interface UseWebSocketReturn {
  connected: boolean;
  priceUpdates: Map<string, WSPriceUpdate>;
  subscribe: (symbols: string[]) => void;
  unsubscribe: (symbols: string[]) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState<Map<string, WSPriceUpdate>>(new Map());
  const reconnectTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const retryCount = useRef<number>(0);

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        retryCount.current = 0; // Reset retry count on successful connection
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'price_update') {
            setPriceUpdates(prev => {
              const newMap = new Map(prev);
              newMap.set(message.data.symbol, message.data);
              return newMap;
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        
        // Tự động reconnect sau 5 giây, nhưng giới hạn số lần thử
        if (retryCount.current < MAX_RETRY_ATTEMPTS) {
          reconnectTimeout.current = setTimeout(() => {
            retryCount.current += 1;
            console.log(`Attempting to reconnect... (${retryCount.current}/${MAX_RETRY_ATTEMPTS})`);
            connect();
          }, 5000);
        } else {
          console.log('Max retry attempts reached. WebSocket disabled. App will continue without live updates.');
        }
      };

      ws.current.onerror = (error) => {
        console.warn('WebSocket error (non-critical):', error);
        // Don't crash the app, just log the error
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const subscribe = useCallback((symbols: string[]) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'subscribe',
        data: { symbols },
        timestamp: Date.now()
      }));
    }
  }, []);

  const unsubscribe = useCallback((symbols: string[]) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'unsubscribe',
        data: { symbols },
        timestamp: Date.now()
      }));
    }
  }, []);

  return {
    connected,
    priceUpdates,
    subscribe,
    unsubscribe
  };
}

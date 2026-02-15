import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stockRoutes from './routes/stocks';
import wsServer from './websocket/server';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;
const WS_PORT = parseInt(process.env.WS_PORT || '3002');

// Middleware
// Allow all origins in development mode (for Codespaces, local dev, etc.)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : true, // Allow all origins in development
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Stock System API',
    version: '1.0.0',
    endpoints: {
      stocks: '/api/stocks',
      websocket: `ws://localhost:${WS_PORT}`
    }
  });
});

app.use('/api/stocks', stockRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
    timestamp: Date.now()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    timestamp: Date.now()
  });
});

// Start servers
app.listen(PORT, () => {
  console.log(`⚡️ REST API server running on http://localhost:${PORT}`);
});

// Khởi động WebSocket server
wsServer.init(WS_PORT);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  wsServer.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  wsServer.stop();
  process.exit(0);
});

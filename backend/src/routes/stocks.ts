import express, { Request, Response } from 'express';
import stockService from '../services/stockService';
import { APIResponse } from '../types';

const router = express.Router();

// Lấy thông tin quote của một symbol
router.get('/quote/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const quote = await stockService.getStockQuote(symbol.toUpperCase());

    const response: APIResponse<any> = {
      success: !!quote,
      data: quote || undefined,
      error: quote ? undefined : 'Quote not found',
      timestamp: Date.now()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: Date.now()
    });
  }
});

// Lấy dữ liệu biểu đồ
router.get('/chart/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { interval = 'daily' } = req.query;

    const data = await stockService.getChartData(
      symbol.toUpperCase(),
      interval as any
    );

    const response: APIResponse<any> = {
      success: true,
      data,
      timestamp: Date.now()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: Date.now()
    });
  }
});

// Lấy tin tức
router.get('/news/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { limit = '10' } = req.query;

    const news = await stockService.getStockNews(
      symbol.toUpperCase(),
      parseInt(limit as string)
    );

    const response: APIResponse<any> = {
      success: true,
      data: news,
      timestamp: Date.now()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: Date.now()
    });
  }
});

// Lấy chỉ số thị trường
router.get('/indices', async (req: Request, res: Response) => {
  try {
    const indices = await stockService.getMarketIndices();

    const response: APIResponse<any> = {
      success: true,
      data: indices,
      timestamp: Date.now()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: Date.now()
    });
  }
});

// Tìm kiếm symbol
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required',
        timestamp: Date.now()
      });
    }

    const results = await stockService.searchSymbol(q);

    const response: APIResponse<any> = {
      success: true,
      data: results,
      timestamp: Date.now()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: Date.now()
    });
  }
});

// Lấy thông tin công ty (Company Profile)
router.get('/profile/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const profile = await stockService.getCompanyProfile(symbol.toUpperCase());

    const response: APIResponse<any> = {
      success: !!profile,
      data: profile || undefined,
      error: profile ? undefined : 'Profile not found',
      timestamp: Date.now()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: Date.now()
    });
  }
});

// Lấy khuyến nghị của analysts
router.get('/recommendations/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const recommendations = await stockService.getAnalystRecommendations(symbol.toUpperCase());

    const response: APIResponse<any> = {
      success: true,
      data: recommendations,
      timestamp: Date.now()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: Date.now()
    });
  }
});

// Lấy mục tiêu giá
router.get('/price-target/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const priceTarget = await stockService.getPriceTarget(symbol.toUpperCase());

    const response: APIResponse<any> = {
      success: !!priceTarget,
      data: priceTarget || undefined,
      error: priceTarget ? undefined : 'Price target not found',
      timestamp: Date.now()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: Date.now()
    });
  }
});

export default router;

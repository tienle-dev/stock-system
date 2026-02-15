import axios from 'axios';
import dotenv from 'dotenv';
import { StockQuote, MarketIndex, ChartDataPoint, StockNews, CompanyProfile, AnalystRecommendation, PriceTarget } from '../types';

// Load environment variables before instantiation
dotenv.config();

class StockService {
  private alphaVantageKey: string;
  private finnhubKey: string;

  constructor() {
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || '';
    this.finnhubKey = process.env.FINNHUB_API_KEY || '';
    
    // Log API key status for debugging
    console.log('StockService initialized with:', {
      hasAlphaVantageKey: !!this.alphaVantageKey,
      hasFinnhubKey: !!this.finnhubKey,
      finnhubKeyPreview: this.finnhubKey ? `${this.finnhubKey.slice(0, 8)}...` : 'none'
    });
  }

  // Mock data for development/demo
  private getMockQuote(symbol: string): StockQuote {
    const basePrice = 150 + Math.random() * 50;
    const change = (Math.random() - 0.5) * 10;
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol,
      name: symbol,
      exchange: 'US',
      currency: 'USD',
      price: parseFloat(basePrice.toFixed(2)),
      open: parseFloat((basePrice - Math.random() * 5).toFixed(2)),
      high: parseFloat((basePrice + Math.random() * 5).toFixed(2)),
      low: parseFloat((basePrice - Math.random() * 5).toFixed(2)),
      close: parseFloat((basePrice - change).toFixed(2)),
      volume: Math.floor(Math.random() * 10000000),
      previousClose: parseFloat((basePrice - change).toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      timestamp: Date.now()
    };
  }

  // Lấy thông tin giá chứng khoán từ Finnhub
  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    try {
      // Nếu không có API key, trả về mock data
      if (!this.finnhubKey) {
        console.log(`Using mock data for ${symbol} (no API key)`);
        return this.getMockQuote(symbol);
      }

      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.finnhubKey}`,
        { timeout: 5000 }
      );

      const quote = response.data;
      
      // Nếu API không trả về dữ liệu hợp lệ, dùng mock data
      if (!quote || quote.c === 0) {
        console.log(`Using mock data for ${symbol} (invalid API response)`);
        return this.getMockQuote(symbol);
      }
      
      return {
        symbol,
        name: symbol,
        exchange: 'US',
        currency: 'USD',
        price: quote.c,
        open: quote.o,
        high: quote.h,
        low: quote.l,
        close: quote.pc,
        volume: 0,
        previousClose: quote.pc,
        change: quote.d,
        changePercent: quote.dp,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      // Fallback to mock data
      return this.getMockQuote(symbol);
    }
  }

  // Mock chart data
  private getMockChartData(symbol: string, interval: string): ChartDataPoint[] {
    const dataPoints = interval === 'daily' ? 30 : 50;
    const now = Date.now();
    const timeStep = interval === 'daily' ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
    
    let basePrice = 150 + Math.random() * 50;
    const data: ChartDataPoint[] = [];
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const change = (Math.random() - 0.5) * 5;
      basePrice += change;
      
      const open = basePrice;
      const close = basePrice + (Math.random() - 0.5) * 3;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;
      
      data.push({
        time: now - i * timeStep,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000)
      });
      
      basePrice = close;
    }
    
    return data;
  }

  // Lấy dữ liệu lịch sử cho biểu đồ
  async getChartData(
    symbol: string,
    interval: '1min' | '5min' | '15min' | '30min' | '60min' | 'daily' = 'daily'
  ): Promise<ChartDataPoint[]> {
    try {
      // Nếu không có API key, trả về mock data
      if (!this.alphaVantageKey) {
        console.log(`Using mock chart data for ${symbol} (no API key)`);
        return this.getMockChartData(symbol, interval);
      }

      const functionMap: Record<string, string> = {
        '1min': 'TIME_SERIES_INTRADAY',
        '5min': 'TIME_SERIES_INTRADAY',
        '15min': 'TIME_SERIES_INTRADAY',
        '30min': 'TIME_SERIES_INTRADAY',
        '60min': 'TIME_SERIES_INTRADAY',
        'daily': 'TIME_SERIES_DAILY'
      };

      const func = functionMap[interval];
      const url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${this.alphaVantageKey}`;
      
      if (func === 'TIME_SERIES_INTRADAY') {
        const response = await axios.get(`${url}&interval=${interval}`, { timeout: 5000 });
        const timeSeries = response.data[`Time Series (${interval})`];
        
        if (!timeSeries) {
          console.log(`Using mock chart data for ${symbol} (invalid API response)`);
          return this.getMockChartData(symbol, interval);
        }

        return Object.entries(timeSeries).map(([time, data]: [string, any]) => ({
          time: new Date(time).getTime(),
          open: parseFloat(data['1. open']),
          high: parseFloat(data['2. high']),
          low: parseFloat(data['3. low']),
          close: parseFloat(data['4. close']),
          volume: parseInt(data['5. volume'])
        }));
      } else {
        const response = await axios.get(url, { timeout: 5000 });
        const timeSeries = response.data['Time Series (Daily)'];
        
        if (!timeSeries) {
          console.log(`Using mock chart data for ${symbol} (invalid API response)`);
          return this.getMockChartData(symbol, interval);
        }

        return Object.entries(timeSeries)
          .slice(0, 100)
          .map(([time, data]: [string, any]) => ({
            time: new Date(time).getTime(),
            open: parseFloat(data['1. open']),
            high: parseFloat(data['2. high']),
            low: parseFloat(data['3. low']),
            close: parseFloat(data['4. close']),
            volume: parseInt(data['5. volume'])
          }));
      }
    } catch (error) {
      console.error(`Error fetching chart data for ${symbol}:`, error);
      // Fallback to mock data
      return this.getMockChartData(symbol, interval);
    }
  }

  // Mock news data
  private getMockNews(symbol: string, limit: number): StockNews[] {
    const headlines = [
      `${symbol} reports strong quarterly earnings`,
      `Analysts upgrade ${symbol} stock rating`,
      `${symbol} announces new product launch`,
      `Market outlook positive for ${symbol}`,
      `${symbol} stock reaches new milestone`,
      `Investors bullish on ${symbol} future`,
      `${symbol} expands into new markets`,
      `${symbol} CEO discusses growth strategy`,
      `${symbol} beats revenue expectations`,
      `${symbol} stock analysis and forecast`
    ];
    
    const sources = ['Bloomberg', 'Reuters', 'CNBC', 'MarketWatch', 'Yahoo Finance'];
    
    return headlines.slice(0, limit).map((headline, i) => ({
      id: `mock-${symbol}-${i}`,
      symbol,
      headline,
      summary: `This is mock news data for demonstration. ${headline}. Enable API keys in .env for real data.`,
      source: sources[i % sources.length],
      // Tạo URL tìm kiếm Google News để có nguồn tin thật
      url: `https://www.google.com/search?q=${encodeURIComponent(headline)}&tbm=nws`,
      publishedAt: Date.now() - i * 3600000,
      sentiment: Math.random() > 0.5 ? 'positive' : 'neutral'
    }));
  }

  // Lấy tin tức về chứng khoán
  async getStockNews(symbol: string, limit: number = 10): Promise<StockNews[]> {
    try {
      // Nếu không có API key, trả về mock data
      if (!this.finnhubKey) {
        console.log(`Using mock news for ${symbol} (no API key)`);
        return this.getMockNews(symbol, limit);
      }

      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const response = await axios.get(
        `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${lastWeek.toISOString().split('T')[0]}&to=${today.toISOString().split('T')[0]}&token=${this.finnhubKey}`,
        { timeout: 5000 }
      );

      if (!response.data || response.data.length === 0) {
        console.log(`Using mock news for ${symbol} (no API data)`);
        return this.getMockNews(symbol, limit);
      }

      return response.data.slice(0, limit).map((article: any) => ({
        id: article.id.toString(),
        symbol,
        headline: article.headline,
        summary: article.summary,
        source: article.source,
        url: article.url,
        publishedAt: article.datetime * 1000,
        sentiment: article.sentiment || 'neutral'
      }));
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      // Fallback to mock data
      return this.getMockNews(symbol, limit);
    }
  }

  // Mock market indices data (Finnhub free plan doesn't support indices)
  private getMockMarketIndices(): MarketIndex[] {
    const baseValues = {
      '^GSPC': 5200,
      '^DJI': 38500,
      '^IXIC': 16200,
      '^FTSE': 7800,
      '^N225': 38000
    };

    const indices = [
      { symbol: '^GSPC', name: 'S&P 500' },
      { symbol: '^DJI', name: 'Dow Jones' },
      { symbol: '^IXIC', name: 'NASDAQ' },
      { symbol: '^FTSE', name: 'FTSE 100' },
      { symbol: '^N225', name: 'Nikkei 225' }
    ];

    return indices.map(index => {
      const baseValue = baseValues[index.symbol as keyof typeof baseValues];
      const change = (Math.random() - 0.5) * 100;
      const changePercent = (change / baseValue) * 100;

      return {
        symbol: index.symbol,
        name: index.name,
        value: parseFloat((baseValue + change).toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        timestamp: Date.now()
      };
    });
  }

  // Lấy chỉ số thị trường chính
  async getMarketIndices(): Promise<MarketIndex[]> {
    // Note: Finnhub free plan requires subscription for market indices
    // Using mock data for demonstration
    return this.getMockMarketIndices();
  }

  // Mock search results
  private getMockSearchResults(query: string): any[] {
    const popularStocks = [
      { symbol: 'AAPL', description: 'Apple Inc', type: 'Common Stock' },
      { symbol: 'GOOGL', description: 'Alphabet Inc Class A', type: 'Common Stock' },
      { symbol: 'MSFT', description: 'Microsoft Corporation', type: 'Common Stock' },
      { symbol: 'AMZN', description: 'Amazon.com Inc', type: 'Common Stock' },
      { symbol: 'TSLA', description: 'Tesla Inc', type: 'Common Stock' },
      { symbol: 'META', description: 'Meta Platforms Inc', type: 'Common Stock' },
      { symbol: 'NVDA', description: 'NVIDIA Corporation', type: 'Common Stock' },
      { symbol: 'NFLX', description: 'Netflix Inc', type: 'Common Stock' },
      { symbol: 'AMD', description: 'Advanced Micro Devices Inc', type: 'Common Stock' },
      { symbol: 'BABA', description: 'Alibaba Group Holding Ltd', type: 'ADR' }
    ];

    const q = query.toUpperCase();
    return popularStocks
      .filter(stock => 
        stock.symbol.includes(q) || 
        stock.description.toUpperCase().includes(q)
      )
      .slice(0, 10);
  }

  // Tìm kiếm chứng khoán
  async searchSymbol(query: string): Promise<any[]> {
    try {
      // Nếu không có API key, trả về mock data
      if (!this.finnhubKey) {
        console.log(`Using mock search results for "${query}" (no API key)`);
        return this.getMockSearchResults(query);
      }

      const response = await axios.get(
        `https://finnhub.io/api/v1/search?q=${query}&token=${this.finnhubKey}`,
        { timeout: 5000 }
      );

      if (!response.data || !response.data.result || response.data.result.length === 0) {
        console.log(`Using mock search results for "${query}" (no API data)`);
        return this.getMockSearchResults(query);
      }

      return response.data.result.slice(0, 10);
    } catch (error) {
      console.error('Error searching symbols:', error);
      // Fallback to mock data
      return this.getMockSearchResults(query);
    }
  }

  // Mock company profile
  private getMockCompanyProfile(symbol: string): CompanyProfile {
    return {
      symbol,
      name: `${symbol} Inc.`,
      country: 'US',
      currency: 'USD',
      exchange: 'NASDAQ',
      ipo: '2010-01-15',
      marketCapitalization: 2000000 + Math.random() * 1000000,
      phone: '1-800-555-0100',
      shareOutstanding: 1000 + Math.random() * 500,
      ticker: symbol,
      weburl: `https://www.${symbol.toLowerCase()}.com`,
      logo: `https://logo.clearbit.com/${symbol.toLowerCase()}.com`,
      finnhubIndustry: 'Technology'
    };
  }

  // Lấy thông tin công ty
  async getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
    try {
      // Nếu không có API key, trả về mock data
      if (!this.finnhubKey) {
        console.log(`Using mock profile for ${symbol} (no API key)`);
        return this.getMockCompanyProfile(symbol);
      }

      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${this.finnhubKey}`,
        { timeout: 5000 }
      );

      if (!response.data || Object.keys(response.data).length === 0) {
        console.log(`Using mock profile for ${symbol} (no API data)`);
        return this.getMockCompanyProfile(symbol);
      }

      return {
        symbol,
        name: response.data.name,
        country: response.data.country,
        currency: response.data.currency,
        exchange: response.data.exchange,
        ipo: response.data.ipo,
        marketCapitalization: response.data.marketCapitalization,
        phone: response.data.phone,
        shareOutstanding: response.data.shareOutstanding,
        ticker: response.data.ticker,
        weburl: response.data.weburl,
        logo: response.data.logo,
        finnhubIndustry: response.data.finnhubIndustry
      };
    } catch (error) {
      console.error(`Error fetching profile for ${symbol}:`, error);
      return this.getMockCompanyProfile(symbol);
    }
  }

  // Mock analyst recommendations
  private getMockRecommendations(symbol: string): AnalystRecommendation[] {
    return [
      {
        symbol,
        buy: Math.floor(Math.random() * 10) + 5,
        hold: Math.floor(Math.random() * 8) + 3,
        sell: Math.floor(Math.random() * 3),
        strongBuy: Math.floor(Math.random() * 15) + 5,
        strongSell: Math.floor(Math.random() * 2),
        period: new Date().toISOString().slice(0, 7)
      }
    ];
  }

  // Lấy khuyến nghị của analysts
  async getAnalystRecommendations(symbol: string): Promise<AnalystRecommendation[]> {
    try {
      // Nếu không có API key, trả về mock data
      if (!this.finnhubKey) {
        console.log(`Using mock recommendations for ${symbol} (no API key)`);
        return this.getMockRecommendations(symbol);
      }

      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${this.finnhubKey}`,
        { timeout: 5000 }
      );

      if (!response.data || response.data.length === 0) {
        console.log(`Using mock recommendations for ${symbol} (no API data)`);
        return this.getMockRecommendations(symbol);
      }

      return response.data.slice(0, 1).map((rec: any) => ({
        symbol,
        buy: rec.buy,
        hold: rec.hold,
        sell: rec.sell,
        strongBuy: rec.strongBuy,
        strongSell: rec.strongSell,
        period: rec.period
      }));
    } catch (error) {
      console.error(`Error fetching recommendations for ${symbol}:`, error);
      return this.getMockRecommendations(symbol);
    }
  }

  // Mock price target
  private getMockPriceTarget(symbol: string): PriceTarget | null {
    const currentPrice = 150 + Math.random() * 50;
    return {
      symbol,
      targetHigh: parseFloat((currentPrice * 1.3).toFixed(2)),
      targetLow: parseFloat((currentPrice * 0.8).toFixed(2)),
      targetMean: parseFloat((currentPrice * 1.1).toFixed(2)),
      targetMedian: parseFloat((currentPrice * 1.08).toFixed(2)),
      lastUpdated: new Date().toISOString().slice(0, 10)
    };
  }

  // Lấy mục tiêu giá từ analysts
  async getPriceTarget(symbol: string): Promise<PriceTarget | null> {
    try {
      // Nếu không có API key, trả về mock data
      if (!this.finnhubKey) {
        console.log(`Using mock price target for ${symbol} (no API key)`);
        return this.getMockPriceTarget(symbol);
      }

      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${this.finnhubKey}`,
        { timeout: 5000 }
      );

      if (!response.data || Object.keys(response.data).length === 0) {
        console.log(`Using mock price target for ${symbol} (no API data)`);
        return this.getMockPriceTarget(symbol);
      }

      return {
        symbol,
        targetHigh: response.data.targetHigh,
        targetLow: response.data.targetLow,
        targetMean: response.data.targetMean,
        targetMedian: response.data.targetMedian,
        lastUpdated: response.data.lastUpdated
      };
    } catch (error) {
      console.error(`Error fetching price target for ${symbol}:`, error);
      return this.getMockPriceTarget(symbol);
    }
  }
}

export default new StockService();

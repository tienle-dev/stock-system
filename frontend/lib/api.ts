const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

class StockAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/stocks`;
  }

  async getQuote(symbol: string) {
    const response = await fetch(`${this.baseUrl}/quote/${symbol}`);
    const data: APIResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch quote');
    }
    
    return data.data;
  }

  async getChartData(symbol: string, interval: string = 'daily') {
    const response = await fetch(`${this.baseUrl}/chart/${symbol}?interval=${interval}`);
    const data: APIResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch chart data');
    }
    
    return data.data;
  }

  async getNews(symbol: string, limit: number = 10) {
    const response = await fetch(`${this.baseUrl}/news/${symbol}?limit=${limit}`);
    const data: APIResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch news');
    }
    
    return data.data;
  }

  async getMarketIndices() {
    const response = await fetch(`${this.baseUrl}/indices`);
    const data: APIResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch indices');
    }
    
    return data.data;
  }

  async searchSymbol(query: string) {
    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    const data: APIResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to search');
    }
    
    return data.data;
  }

  async getCompanyProfile(symbol: string) {
    const response = await fetch(`${this.baseUrl}/profile/${symbol}`);
    const data: APIResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch profile');
    }
    
    return data.data;
  }

  async getAnalystRecommendations(symbol: string) {
    const response = await fetch(`${this.baseUrl}/recommendations/${symbol}`);
    const data: APIResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch recommendations');
    }
    
    return data.data;
  }

  async getPriceTarget(symbol: string) {
    const response = await fetch(`${this.baseUrl}/price-target/${symbol}`);
    const data: APIResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch price target');
    }
    
    return data.data;
  }
}

export default new StockAPI();

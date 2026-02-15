// Frontend types for stock system

export interface StockQuote {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  previousClose: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockNews {
  id: string;
  symbol: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface CompanyProfile {
  symbol: string;
  name: string;
  country: string;
  currency: string;
  exchange: string;
  ipo?: string;
  marketCapitalization: number;
  phone?: string;
  shareOutstanding: number;
  ticker: string;
  weburl?: string;
  logo?: string;
  finnhubIndustry?: string;
}

export interface AnalystRecommendation {
  symbol: string;
  buy: number;
  hold: number;
  sell: number;
  strongBuy: number;
  strongSell: number;
  period: string;
}

export interface PriceTarget {
  symbol: string;
  targetHigh: number;
  targetLow: number;
  targetMean: number;
  targetMedian: number;
  lastUpdated: string;
}

export interface SearchResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface WSPriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

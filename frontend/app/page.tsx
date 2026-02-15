'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/stock/SearchBar';
import StockCard from '@/components/stock/StockCard';
import MarketIndices from '@/components/stock/MarketIndices';
import StockChart from '@/components/chart/StockChart';
import NewsList from '@/components/stock/NewsList';
import CompanyProfileCard from '@/components/stock/CompanyProfile';
import AnalystRecommendationsCard from '@/components/stock/AnalystRecommendations';
import { useWebSocket } from '@/hooks/useWebSocket';
import stockAPI from '@/lib/api';
import { StockQuote, MarketIndex, ChartDataPoint, StockNews, CompanyProfile, AnalystRecommendation, PriceTarget } from '@/types';

export default function Home() {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['AAPL', 'GOOGL', 'MSFT']);
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [news, setNews] = useState<StockNews[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [recommendations, setRecommendations] = useState<AnalystRecommendation[]>([]);
  const [priceTarget, setPriceTarget] = useState<PriceTarget | null>(null);
  const [selectedChartSymbol, setSelectedChartSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(true);

  const { connected, priceUpdates, subscribe } = useWebSocket();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Subscribe to WebSocket updates
  useEffect(() => {
    if (connected && selectedSymbols.length > 0) {
      subscribe(selectedSymbols);
    }
  }, [connected, selectedSymbols, subscribe]);

  // Load chart data when symbol changes
  useEffect(() => {
    loadChartData(selectedChartSymbol);
    loadNews(selectedChartSymbol);
    loadCompanyProfile(selectedChartSymbol);
    loadRecommendations(selectedChartSymbol);
    loadPriceTarget(selectedChartSymbol);
  }, [selectedChartSymbol]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load market indices
      const indicesData = await stockAPI.getMarketIndices();
      setIndices(indicesData);

      // Load quotes for default symbols
      const quotesMap = new Map<string, StockQuote>();
      for (const symbol of selectedSymbols) {
        const quote = await stockAPI.getQuote(symbol);
        if (quote) {
          quotesMap.set(symbol, quote);
        }
      }
      setQuotes(quotesMap);

      // Load chart data for first symbol
      await loadChartData(selectedSymbols[0]);
      await loadNews(selectedSymbols[0]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async (symbol: string) => {
    try {
      const data = await stockAPI.getChartData(symbol);
      setChartData(data);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  const loadNews = async (symbol: string) => {
    try {
      const newsData = await stockAPI.getNews(symbol);
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    }
  };

  const loadCompanyProfile = async (symbol: string) => {
    try {
      const profile = await stockAPI.getCompanyProfile(symbol);
      setCompanyProfile(profile);
    } catch (error) {
      console.error('Error loading company profile:', error);
    }
  };

  const loadRecommendations = async (symbol: string) => {
    try {
      const recs = await stockAPI.getAnalystRecommendations(symbol);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const loadPriceTarget = async (symbol: string) => {
    try {
      const target = await stockAPI.getPriceTarget(symbol);
      setPriceTarget(target);
    } catch (error) {
      console.error('Error loading price target:', error);
    }
  };

  const handleAddSymbol = async (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      return;
    }

    try {
      const quote = await stockAPI.getQuote(symbol);
      if (quote) {
        setSelectedSymbols(prev => [...prev, symbol]);
        setQuotes(prev => new Map(prev).set(symbol, quote));
        
        if (connected) {
          subscribe([symbol]);
        }
      }
    } catch (error) {
      console.error('Error adding symbol:', error);
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    setSelectedSymbols(prev => prev.filter(s => s !== symbol));
    setQuotes(prev => {
      const newMap = new Map(prev);
      newMap.delete(symbol);
      return newMap;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Global Stock Market</h1>
              <p className="text-gray-600">Real-time tracking of international stock exchanges</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm text-gray-600">
                {connected ? 'Live' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <SearchBar onSelectSymbol={handleAddSymbol} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Market Indices */}
        {indices.length > 0 && <MarketIndices indices={indices} />}

        {/* Stock Cards */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Watchlist</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSymbols.map(symbol => {
              const quote = quotes.get(symbol);
              const liveUpdate = priceUpdates.get(symbol);
              
              if (!quote) return null;
              
              return (
                <div key={symbol} className="relative">
                  <button
                    onClick={() => handleRemoveSymbol(symbol)}
                    className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Remove from watchlist"
                  >
                    ×
                  </button>
                  <div onClick={() => setSelectedChartSymbol(symbol)} className="cursor-pointer">
                    <StockCard quote={quote} liveUpdate={liveUpdate} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <StockChart data={chartData} symbol={selectedChartSymbol} />
        )}

        {/* Company Profile and Analyst Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {companyProfile && (
            <CompanyProfileCard profile={companyProfile} />
          )}
          
          {recommendations.length > 0 && (
            <AnalystRecommendationsCard 
              recommendations={recommendations} 
              priceTarget={priceTarget}
              currentPrice={quotes.get(selectedChartSymbol)?.price || 0}
            />
          )}
        </div>

        {/* News */}
        {news.length > 0 && (
          <NewsList news={news} symbol={selectedChartSymbol} />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">
            Global Stock Market Tracker © 2026 | Data provided by Alpha Vantage & Finnhub
          </p>
        </div>
      </footer>
    </main>
  );
}

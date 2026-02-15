'use client';

import { useState } from 'react';
import { SearchResult } from '@/types';
import stockAPI from '@/lib/api';

interface SearchBarProps {
  onSelectSymbol: (symbol: string) => void;
}

export default function SearchBar({ onSelectSymbol }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    
    if (value.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const data = await stockAPI.searchSymbol(value);
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (symbol: string) => {
    onSelectSymbol(symbol);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search stocks (e.g., AAPL, TSLA, MSFT)..."
          className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {showResults && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            results.map((result) => (
              <button
                key={result.symbol}
                onClick={() => handleSelect(result.symbol)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-b last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{result.displaySymbol}</p>
                    <p className="text-sm text-gray-600">{result.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {result.type}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

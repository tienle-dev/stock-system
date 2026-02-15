'use client';

import { MarketIndex } from '@/types';
import { useState, useEffect } from 'react';

interface MarketIndicesProps {
  indices: MarketIndex[];
}

export default function MarketIndices({ indices }: MarketIndicesProps) {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (indices.length > 0) {
      setLastUpdate(Date.now());
      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 500);
    }
  }, [indices]);

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Major Market Indices</h2>
        <div className="flex items-center gap-2">
          {isUpdating && (
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          )}
          <span className="text-xs text-gray-500">
            Updated: {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {indices.map((index) => {
          const isPositive = (index.change || 0) >= 0;
          const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
          
          return (
            <div 
              key={index.symbol}
              className={`p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all ${isUpdating ? 'ring-2 ring-blue-200' : ''}`}
            >
              <p className="text-sm font-semibold text-gray-700 mb-1">{index.name}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {(index.value || 0).toLocaleString(undefined, { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </p>
              <p className={`text-sm font-semibold ${changeColor}`}>
                {isPositive ? '+' : ''}{(index.change || 0).toFixed(2)} 
                ({isPositive ? '+' : ''}{(index.changePercent || 0).toFixed(2)}%)
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

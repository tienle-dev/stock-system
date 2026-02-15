'use client';

import { MarketIndex } from '@/types';

interface MarketIndicesProps {
  indices: MarketIndex[];
}

export default function MarketIndices({ indices }: MarketIndicesProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Major Market Indices</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {indices.map((index) => {
          const isPositive = index.change >= 0;
          const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
          
          return (
            <div 
              key={index.symbol}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm font-semibold text-gray-700 mb-1">{index.name}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {index.value.toLocaleString(undefined, { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </p>
              <p className={`text-sm font-semibold ${changeColor}`}>
                {isPositive ? '+' : ''}{index.change.toFixed(2)} 
                ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

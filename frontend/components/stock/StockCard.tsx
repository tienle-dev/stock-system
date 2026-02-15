'use client';

import { StockQuote, WSPriceUpdate } from '@/types';
import { useEffect, useState } from 'react';

interface StockCardProps {
  quote: StockQuote;
  liveUpdate?: WSPriceUpdate;
}

export default function StockCard({ quote, liveUpdate }: StockCardProps) {
  const [displayQuote, setDisplayQuote] = useState(quote);
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (liveUpdate) {
      // Determine if price went up or down
      const previousPrice = displayQuote.price;
      const newPrice = liveUpdate.price;
      
      if (newPrice > previousPrice) {
        setPriceFlash('up');
      } else if (newPrice < previousPrice) {
        setPriceFlash('down');
      }
      
      setDisplayQuote(prev => ({
        ...prev,
        price: liveUpdate.price,
        change: liveUpdate.change,
        changePercent: liveUpdate.changePercent,
        timestamp: liveUpdate.timestamp
      }));
      
      // Clear flash after animation
      setTimeout(() => setPriceFlash(null), 500);
    }
  }, [liveUpdate]);

  const isPositive = displayQuote.change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
  
  // Flash animation classes
  const flashClass = priceFlash === 'up' 
    ? 'animate-flash-green' 
    : priceFlash === 'down' 
    ? 'animate-flash-red' 
    : '';

  return (
    <div className={`rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow ${bgColor}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{displayQuote.symbol}</h3>
          <p className="text-sm text-gray-600">{displayQuote.name}</p>
          <p className="text-xs text-gray-500">{displayQuote.exchange}</p>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold text-gray-900 transition-all ${flashClass}`}>
            ${displayQuote.price.toFixed(2)}
          </p>
          <p className={`text-sm font-semibold ${changeColor}`}>
            {isPositive ? '+' : ''}{displayQuote.change.toFixed(2)} 
            ({isPositive ? '+' : ''}{displayQuote.changePercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Open</p>
          <p className="font-semibold">${displayQuote.open.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Previous Close</p>
          <p className="font-semibold">${displayQuote.previousClose.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">High</p>
          <p className="font-semibold">${displayQuote.high.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Low</p>
          <p className="font-semibold">${displayQuote.low.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">
          Last updated: {new Date(displayQuote.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

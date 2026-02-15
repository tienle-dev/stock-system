'use client';

import { StockNews } from '@/types';
import { useState, useEffect } from 'react';

interface NewsListProps {
  news: StockNews[];
  symbol: string;
}

export default function NewsList({ news, symbol }: NewsListProps) {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (news.length > 0) {
      setLastUpdate(Date.now());
      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 500);
    }
  }, [news]);

  if (news.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Latest News - {symbol}</h2>
        <p className="text-gray-500">No news available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Latest News - {symbol}</h2>
        <div className="flex items-center gap-2">
          {isUpdating && (
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          )}
          <span className="text-xs text-gray-500">
            Refreshes every 5 min • Last: {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {news.map((article) => {
          const sentimentColor = 
            article.sentiment === 'positive' ? 'text-green-600 bg-green-50' :
            article.sentiment === 'negative' ? 'text-red-600 bg-red-50' :
            'text-gray-600 bg-gray-50';

          return (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 flex-1">
                  {article.headline}
                </h3>
                {article.sentiment && (
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${sentimentColor}`}>
                    {article.sentiment}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{article.summary}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="font-medium">{article.source}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()} {new Date(article.publishedAt).toLocaleTimeString()}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

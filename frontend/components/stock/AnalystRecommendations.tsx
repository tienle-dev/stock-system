'use client';

import { AnalystRecommendation, PriceTarget } from '@/types';

interface AnalystRecommendationsProps {
  recommendations: AnalystRecommendation[];
  priceTarget: PriceTarget | null;
  currentPrice: number;
}

export default function AnalystRecommendationsCard({ 
  recommendations, 
  priceTarget,
  currentPrice 
}: AnalystRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Analyst Recommendations</h2>
        <p className="text-gray-500">No analyst recommendations available.</p>
      </div>
    );
  }

  const rec = recommendations[0];
  const total = rec.strongBuy + rec.buy + rec.hold + rec.sell + rec.strongSell;

  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1);
  const getWidth = (value: number) => `${(value / total) * 100}%`;

  // Calculate overall sentiment
  const bullishCount = rec.strongBuy + rec.buy;
  const bearishCount = rec.sell + rec.strongSell;
  
  let overallSentiment = 'Neutral';
  let sentimentColor = 'text-gray-600 bg-gray-100';
  
  if (bullishCount > bearishCount + rec.hold) {
    overallSentiment = 'Bullish';
    sentimentColor = 'text-green-600 bg-green-100';
  } else if (bearishCount > bullishCount + rec.hold) {
    overallSentiment = 'Bearish';
    sentimentColor = 'text-red-600 bg-red-100';
  }

  // Calculate potential upside if price target available
  const upside = priceTarget 
    ? (((priceTarget.targetMean - currentPrice) / currentPrice) * 100).toFixed(1)
    : null;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Analyst Recommendations</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${sentimentColor}`}>
          {overallSentiment}
        </span>
      </div>

      {/* Price Target */}
      {priceTarget && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Target Price (Mean)</span>
            <span className="text-2xl font-bold text-blue-600">${priceTarget.targetMean.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Low</span>
              <p className="font-semibold text-gray-900">${priceTarget.targetLow.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-500">Median</span>
              <p className="font-semibold text-gray-900">${priceTarget.targetMedian.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-500">High</span>
              <p className="font-semibold text-gray-900">${priceTarget.targetHigh.toFixed(2)}</p>
            </div>
          </div>
          {upside && (
            <div className="mt-2 pt-2 border-t border-blue-200">
              <span className="text-sm text-gray-600">Potential Upside: </span>
              <span className={`text-sm font-bold ${parseFloat(upside) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {upside}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Recommendations Breakdown */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-24 text-sm font-medium text-gray-700">Strong Buy</span>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: getWidth(rec.strongBuy) }}
            />
          </div>
          <span className="w-16 text-right text-sm font-semibold text-gray-900">
            {rec.strongBuy} ({getPercentage(rec.strongBuy)}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-24 text-sm font-medium text-gray-700">Buy</span>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-400 transition-all duration-300"
              style={{ width: getWidth(rec.buy) }}
            />
          </div>
          <span className="w-16 text-right text-sm font-semibold text-gray-900">
            {rec.buy} ({getPercentage(rec.buy)}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-24 text-sm font-medium text-gray-700">Hold</span>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-300"
              style={{ width: getWidth(rec.hold) }}
            />
          </div>
          <span className="w-16 text-right text-sm font-semibold text-gray-900">
            {rec.hold} ({getPercentage(rec.hold)}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-24 text-sm font-medium text-gray-700">Sell</span>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-400 transition-all duration-300"
              style={{ width: getWidth(rec.sell) }}
            />
          </div>
          <span className="w-16 text-right text-sm font-semibold text-gray-900">
            {rec.sell} ({getPercentage(rec.sell)}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-24 text-sm font-medium text-gray-700">Strong Sell</span>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: getWidth(rec.strongSell) }}
            />
          </div>
          <span className="w-16 text-right text-sm font-semibold text-gray-900">
            {rec.strongSell} ({getPercentage(rec.strongSell)}%)
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center mt-4 pt-4 border-t">
        Based on {total} analyst{total !== 1 ? 's' : ''} • Period: {rec.period}
      </div>
    </div>
  );
}

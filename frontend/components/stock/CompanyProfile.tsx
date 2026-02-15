'use client';

import { CompanyProfile } from '@/types';
import { useState } from 'react';

interface CompanyProfileProps {
  profile: CompanyProfile;
}

export default function CompanyProfileCard({ profile }: CompanyProfileProps) {
  const [imageError, setImageError] = useState(false);

  const formatMarketCap = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}T`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}B`;
    }
    return `$${value.toFixed(2)}M`;
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Company Profile</h2>
      
      <div className="flex items-start gap-6">
        {/* Logo */}
        {profile.logo && !imageError && (
          <div className="w-20 h-20 flex-shrink-0 relative rounded-lg overflow-hidden border bg-gray-50">
            <img
              src={profile.logo}
              alt={`${profile.name} logo`}
              className="w-full h-full object-contain p-2"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        
        {/* Fallback: Show symbol if no logo or error */}
        {(!profile.logo || imageError) && (
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-lg border bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl">
            {profile.ticker.slice(0, 2)}
          </div>
        )}

        {/* Company Info */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Company Name</p>
            <p className="font-semibold text-gray-900">{profile.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Ticker</p>
            <p className="font-semibold text-gray-900">{profile.ticker}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Exchange</p>
            <p className="font-semibold text-gray-900">{profile.exchange}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="font-semibold text-gray-900">{profile.country}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-semibold text-gray-900">{profile.finnhubIndustry || 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Market Cap</p>
            <p className="font-semibold text-gray-900">{formatMarketCap(profile.marketCapitalization)}</p>
          </div>

          {profile.ipo && (
            <div>
              <p className="text-sm text-gray-500">IPO Date</p>
              <p className="font-semibold text-gray-900">{profile.ipo}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">Outstanding Shares</p>
            <p className="font-semibold text-gray-900">{profile.shareOutstanding.toFixed(2)}M</p>
          </div>

          {profile.phone && (
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold text-gray-900">{profile.phone}</p>
            </div>
          )}

          {profile.weburl && (
            <div>
              <p className="text-sm text-gray-500">Website</p>
              <a 
                href={profile.weburl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Visit Website →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

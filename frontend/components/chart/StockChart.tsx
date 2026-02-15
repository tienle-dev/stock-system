'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, CandlestickData } from 'lightweight-charts';
import { ChartDataPoint } from '@/types';

interface StockChartProps {
  data: ChartDataPoint[];
  symbol: string;
}

export default function StockChart({ data, symbol }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Tạo chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Tạo candlestick series  
    // @ts-ignore - lightweight-charts v4 không export đầy đủ types cho addCandlestickSeries
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      // Chuyển đổi data sang format của lightweight-charts
      const chartData: CandlestickData[] = data.map(point => ({
        time: Math.floor(point.time / 1000) as any,
        open: point.open,
        high: point.high,
        low: point.low,
        close: point.close,
      })).sort((a, b) => (a.time as number) - (b.time as number));

      seriesRef.current.setData(chartData);

      // Fit content
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }

      // Update timestamp and show indicator
      setLastUpdate(Date.now());
      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 500);
    }
  }, [data]);

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{symbol} Price Chart</h2>
          <p className="text-sm text-gray-600">Candlestick chart showing historical price data</p>
        </div>
        <div className="flex items-center gap-2">
          {isUpdating && (
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          )}
          <span className="text-xs text-gray-500">
            Auto-refresh: 2 min • Last: {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileOptimizedLayout, MobileCard, MobileGrid } from '@/components/layout/mobile-optimized-layout';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  MapPin, 
  Calendar,
  Cow,
  Sheep,
  Activity,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketPrice {
  animalType: string;
  breed: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  region: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

interface MarketTrend {
  period: string;
  avgPrice: number;
  volume: number;
  demand: 'high' | 'medium' | 'low';
}

// Mock data - in production, this would come from APIs
const mockMarketData: MarketPrice[] = [
  {
    animalType: 'ላም',
    breed: 'ቦራን',
    currentPrice: 45000,
    previousPrice: 42000,
    change: 3000,
    changePercent: 7.1,
    region: 'አዲስ አበባ',
    lastUpdated: '2 ሰዓት በፊት',
    trend: 'up'
  },
  {
    animalType: 'ላም',
    breed: 'ሆልስታይን',
    currentPrice: 85000,
    previousPrice: 88000,
    change: -3000,
    changePercent: -3.4,
    region: 'ባህር ዳር',
    lastUpdated: '1 ሰዓት በፊት',
    trend: 'down'
  },
  {
    animalType: 'በግ',
    breed: 'ሜንዝ',
    currentPrice: 8500,
    previousPrice: 8200,
    change: 300,
    changePercent: 3.7,
    region: 'ሐረር',
    lastUpdated: '3 ሰዓት በፊት',
    trend: 'up'
  },
  {
    animalType: 'ፍየል',
    breed: 'ቦዓር',
    currentPrice: 6200,
    previousPrice: 6200,
    change: 0,
    changePercent: 0,
    region: 'ጅማ',
    lastUpdated: '30 ደቂቃ በፊት',
    trend: 'stable'
  }
];

const mockTrendData: MarketTrend[] = [
  { period: 'ዛሬ', avgPrice: 52000, volume: 145, demand: 'high' },
  { period: 'ትናንት', avgPrice: 49500, volume: 132, demand: 'high' },
  { period: 'ባለፈው ሳምንት', avgPrice: 47800, volume: 890, demand: 'medium' },
  { period: 'ባለፈው ወር', avgPrice: 45200, volume: 3420, demand: 'medium' }
];

export function MarketIntelligenceDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string>('ሁሉም');
  const [selectedAnimalType, setSelectedAnimalType] = useState<string>('ሁሉም');
  const [marketData, setMarketData] = useState<MarketPrice[]>(mockMarketData);
  const [isLoading, setIsLoading] = useState(false);

  const regions = ['ሁሉም', 'አዲስ አበባ', 'ባህር ዳር', 'ሐረር', 'ጅማ', 'መቀሌ', 'ሀዋሳ'];
  const animalTypes = ['ሁሉም', 'ላም', 'በግ', 'ፍየል', 'ዶሮ'];

  const filteredData = marketData.filter(item => {
    const regionMatch = selectedRegion === 'ሁሉም' || item.region === selectedRegion;
    const typeMatch = selectedAnimalType === 'ሁሉም' || item.animalType === selectedAnimalType;
    return regionMatch && typeMatch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('am-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDemandBadgeColor = (demand: string) => {
    switch (demand) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <MobileOptimizedLayout className="bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              የገበያ መረጃ ማዕከል
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              የእንስሳት ዋጋ እና የገበያ ትንተና
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ክልል
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              የእንስሳ ዓይነት
            </label>
            <select
              value={selectedAnimalType}
              onChange={(e) => setSelectedAnimalType(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {animalTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Market Overview Cards */}
      <MobileGrid columns={2} gap="md">
        <MobileCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">አማካይ ዋጋ</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(52000)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600">+5.2%</span>
            <span className="text-sm text-gray-500">ከትናንት</span>
          </div>
        </MobileCard>

        <MobileCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">የዛሬ ግብይት</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">145</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Badge className={getDemandBadgeColor('high')}>
              ከፍተኛ ፍላጎት
            </Badge>
          </div>
        </MobileCard>
      </MobileGrid>

      {/* Current Market Prices */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            የአሁን የገበያ ዋጋዎች
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setIsLoading(true);
              // Simulate API call
              setTimeout(() => setIsLoading(false), 1000);
            }}
            disabled={isLoading}
          >
            {isLoading ? 'በመጫን...' : 'አድስ'}
          </Button>
        </div>

        <div className="space-y-3">
          {filteredData.map((item, index) => (
            <MobileCard key={index} padding="md" className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Cow className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {item.animalType} - {item.breed}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span>{item.region}</span>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>{item.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(item.currentPrice)}
                  </p>
                  <div className={cn(
                    'flex items-center gap-1 text-sm px-2 py-1 rounded-full border',
                    getTrendColor(item.trend)
                  )}>
                    {getTrendIcon(item.trend)}
                    <span>
                      {item.change > 0 ? '+' : ''}{formatPrice(item.change)} 
                      ({item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Market Trends */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          የገበያ አዝማሚያ
        </h2>
        
        <div className="space-y-3">
          {mockTrendData.map((trend, index) => (
            <MobileCard key={index} padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {trend.period}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {trend.volume} ግብይቶች
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(trend.avgPrice)}
                  </p>
                  <Badge className={getDemandBadgeColor(trend.demand)}>
                    {trend.demand === 'high' ? 'ከፍተኛ' : 
                     trend.demand === 'medium' ? 'መካከለኛ' : 'ዝቅተኛ'} ፍላጎት
                  </Badge>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Market Alerts */}
      <MobileCard padding="md" className="border-l-4 border-l-yellow-500">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              የገበያ ማስታወቂያ
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              የቦራን ላሞች ዋጋ በዚህ ሳምንት ውስጥ 7% ጨምሯል። ይህ በዝናብ ወቅት የሳር እጥረት ምክንያት ሊሆን ይችላል።
            </p>
            <Button variant="link" size="sm" className="p-0 h-auto mt-2">
              ተጨማሪ ያንብቡ
            </Button>
          </div>
        </div>
      </MobileCard>
    </MobileOptimizedLayout>
  );
}

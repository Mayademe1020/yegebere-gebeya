import { MarketIntelligenceDashboard } from '@/components/market/market-intelligence-dashboard';
import { EnhancedNavigation } from '@/components/navigation/enhanced-navigation';

export default function MarketIntelligencePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedNavigation />
      <div className="pb-20 lg:pb-0">
        <MarketIntelligenceDashboard />
      </div>
    </div>
  );
}

import { LivestockFinancialServices } from '@/components/financial/livestock-financial-services';
import { EnhancedNavigation } from '@/components/navigation/enhanced-navigation';

export default function FinancialServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedNavigation />
      <div className="pb-20 lg:pb-0">
        <LivestockFinancialServices />
      </div>
    </div>
  );
}

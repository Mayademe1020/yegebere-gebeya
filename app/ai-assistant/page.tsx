import { EthiopianLivestockGPT } from '@/components/ai/ethiopian-livestock-gpt';
import { EnhancedNavigation } from '@/components/navigation/enhanced-navigation';

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedNavigation />
      <div className="pb-20 lg:pb-0">
        <EthiopianLivestockGPT />
      </div>
    </div>
  );
}

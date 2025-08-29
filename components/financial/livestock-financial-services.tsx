"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileOptimizedLayout, MobileCard, MobileGrid, MobileInput } from '@/components/layout/mobile-optimized-layout';
import { 
  Shield, 
  CreditCard, 
  Calculator, 
  TrendingUp, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  Phone,
  User,
  MapPin,
  Cow
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
  rating: number;
  coverage: string[];
  premium: number;
  maxCoverage: number;
  claimSettlement: string;
  features: string[];
}

interface LoanProvider {
  id: string;
  name: string;
  interestRate: number;
  maxAmount: number;
  tenure: string;
  processingFee: number;
  requirements: string[];
  approvalTime: string;
}

// Mock data
const insuranceProviders: InsuranceProvider[] = [
  {
    id: '1',
    name: 'የኢትዮጵያ መድን ኩባንያ',
    logo: '🛡️',
    rating: 4.5,
    coverage: ['ሞት', 'በሽታ', 'ስርቆት', 'የተፈጥሮ አደጋ'],
    premium: 2500,
    maxCoverage: 100000,
    claimSettlement: '15 ቀናት',
    features: ['24/7 ድጋፍ', 'ፈጣን የይገባኛል ሂደት', 'የእንስሳ ሐኪም አገልግሎት']
  },
  {
    id: '2',
    name: 'አዋሽ መድን ኩባንያ',
    logo: '🏢',
    rating: 4.2,
    coverage: ['ሞት', 'በሽታ', 'አደጋ'],
    premium: 2200,
    maxCoverage: 80000,
    claimSettlement: '20 ቀናት',
    features: ['ዝቅተኛ ፕሪሚየም', 'ሰፊ ሽፋን', 'የመስክ ኤጀንት አገልግሎት']
  }
];

const loanProviders: LoanProvider[] = [
  {
    id: '1',
    name: 'የኢትዮጵያ ልማት ባንክ',
    interestRate: 12.5,
    maxAmount: 500000,
    tenure: '1-5 ዓመት',
    processingFee: 2,
    requirements: ['የመታወቂያ ካርድ', 'የመኖሪያ ማረጋገጫ', 'የገቢ ማረጋገጫ'],
    approvalTime: '7-10 ቀናት'
  },
  {
    id: '2',
    name: 'አዋሽ ባንክ',
    interestRate: 13.0,
    maxAmount: 300000,
    tenure: '6 ወር - 3 ዓመት',
    processingFee: 1.5,
    requirements: ['የመታወቂያ ካርድ', 'የንግድ ፈቃድ', 'ዋስትና'],
    approvalTime: '5-7 ቀናት'
  }
];

export function LivestockFinancialServices() {
  const [activeTab, setActiveTab] = useState<'insurance' | 'loans' | 'calculator'>('insurance');
  const [selectedInsurance, setSelectedInsurance] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  
  // Calculator states
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(12.5);
  const [tenure, setTenure] = useState<number>(24);
  
  // Application form states
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    phoneNumber: '',
    region: '',
    animalType: '',
    animalValue: '',
    purpose: ''
  });

  const calculateEMI = () => {
    const monthlyRate = interestRate / 100 / 12;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('am-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderInsuranceTab = () => (
    <div className="space-y-4">
      <div className="text-center py-6">
        <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          የእንስሳት መድን
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          እንስሳዎችዎን ከአደጋ ይጠብቁ
        </p>
      </div>

      <div className="space-y-4">
        {insuranceProviders.map((provider) => (
          <MobileCard 
            key={provider.id} 
            padding="md"
            clickable
            onClick={() => setSelectedInsurance(provider.id)}
            className={cn(
              selectedInsurance === provider.id && 'ring-2 ring-primary border-primary'
            )}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.logo}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {provider.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {provider.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(provider.premium)}/ዓመት
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    እስከ {formatCurrency(provider.maxCoverage)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {provider.coverage.map((item, index) => (
                  <Badge key={index} variant="secondary" className="justify-center">
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">የይገባኛል ጊዜ:</span>
                  <span className="font-medium">{provider.claimSettlement}</span>
                </div>
                {provider.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>

              {selectedInsurance === provider.id && (
                <Button className="w-full" size="lg">
                  አሁን ይመዝገቡ
                </Button>
              )}
            </div>
          </MobileCard>
        ))}
      </div>
    </div>
  );

  const renderLoansTab = () => (
    <div className="space-y-4">
      <div className="text-center py-6">
        <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          የእንስሳት ብድር
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          ለእንስሳት ግዢ እና እርባታ ብድር ያግኙ
        </p>
      </div>

      <div className="space-y-4">
        {loanProviders.map((provider) => (
          <MobileCard 
            key={provider.id} 
            padding="md"
            clickable
            onClick={() => setSelectedLoan(provider.id)}
            className={cn(
              selectedLoan === provider.id && 'ring-2 ring-primary border-primary'
            )}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {provider.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {provider.approvalTime} የማጽደቅ ጊዜ
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {provider.interestRate}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ወለድ
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">ከፍተኛ መጠን:</span>
                  <p className="font-medium">{formatCurrency(provider.maxAmount)}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">የመክፈያ ጊዜ:</span>
                  <p className="font-medium">{provider.tenure}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  የሚያስፈልጉ ሰነዶች:
                </p>
                <div className="space-y-1">
                  {provider.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <FileText className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedLoan === provider.id && (
                <Button className="w-full" size="lg">
                  ብድር ይጠይቁ
                </Button>
              )}
            </div>
          </MobileCard>
        ))}
      </div>
    </div>
  );

  const renderCalculatorTab = () => (
    <div className="space-y-6">
      <div className="text-center py-6">
        <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          የብድር ካልኩሌተር
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          የወርሃዊ ክፍያዎን ያስሉ
        </p>
      </div>

      <MobileCard padding="lg">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              የብድር መጠን (ብር)
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              min="10000"
              max="1000000"
              step="10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ወለድ (%)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              min="5"
              max="25"
              step="0.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              የመክፈያ ጊዜ (ወር)
            </label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              min="6"
              max="60"
              step="6"
            />
          </div>

          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              የወርሃዊ ክፍያ
            </p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(calculateEMI())}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">ጠቅላላ ክፍያ</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(calculateEMI() * tenure)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">ጠቅላላ ወለድ</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency((calculateEMI() * tenure) - loanAmount)}
              </p>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* Quick Application Form */}
      <MobileCard padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          ፈጣን ማመልከቻ
        </h3>
        <div className="space-y-4">
          <MobileInput
            label="ሙሉ ስም"
            value={applicationData.fullName}
            onChange={(e) => setApplicationData({...applicationData, fullName: e.target.value})}
            icon={<User className="h-4 w-4" />}
          />
          <MobileInput
            label="ስልክ ቁጥር"
            value={applicationData.phoneNumber}
            onChange={(e) => setApplicationData({...applicationData, phoneNumber: e.target.value})}
            icon={<Phone className="h-4 w-4" />}
          />
          <MobileInput
            label="ክልል/ከተማ"
            value={applicationData.region}
            onChange={(e) => setApplicationData({...applicationData, region: e.target.value})}
            icon={<MapPin className="h-4 w-4" />}
          />
          <Button className="w-full" size="lg">
            ማመልከቻ ይላኩ
          </Button>
        </div>
      </MobileCard>
    </div>
  );

  return (
    <MobileOptimizedLayout className="bg-gray-50 dark:bg-gray-900">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={activeTab === 'insurance' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('insurance')}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Shield className="h-5 w-5" />
            <span className="text-xs">መድን</span>
          </Button>
          <Button
            variant={activeTab === 'loans' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('loans')}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">ብድር</span>
          </Button>
          <Button
            variant={activeTab === 'calculator' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('calculator')}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Calculator className="h-5 w-5" />
            <span className="text-xs">ካልኩሌተር</span>
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'insurance' && renderInsuranceTab()}
      {activeTab === 'loans' && renderLoansTab()}
      {activeTab === 'calculator' && renderCalculatorTab()}
    </MobileOptimizedLayout>
  );
}

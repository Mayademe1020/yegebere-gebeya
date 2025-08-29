"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter,
  Milk,
  Activity,
  BarChart3,
  Calendar,
  Bell,
  Heart,
  Stethoscope,
  TrendingUp,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ResponsiveNavigation } from '@/components/layout/responsive-navigation';
import { PageLayout, Section, CompactHeader, FilterBar, HorizontalScroll } from '@/components/layout/improved-layout';
import { ImprovedCard, AnimalCard, StatsCard, ResponsiveGrid } from '@/components/layout/improved-cards';
import { DigitalBarnUtils } from '@/lib/digital-barn/utils';
import { Animal } from '@/lib/digital-barn/types';
import { EthiopianCalendar } from '@/lib/ethiopian/calendar';

export default function DigitalBarnPage() {
  const router = useRouter();
  const { user, language } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchAnimals();
    }
  }, [user]);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/animals?userId=${user?.id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch animals');
      }

      setAnimals(result.data || []);
    } catch (error) {
      console.error('Error fetching animals:', error);
      setError(error instanceof Error ? error.message : 'Failed to load animals');
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (amharic: string, english: string, oromo: string) => {
    return DigitalBarnUtils.getLocalizedText(amharic, english, oromo, language);
  };

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = searchQuery === '' || 
      animal.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.animalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || animal.type === selectedType;
    
    // Status filtering would need to be implemented based on calculated status
    const matchesStatus = selectedStatus === 'all'; // Simplified for now
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate dashboard stats
  const totalAnimals = animals.length;
  const milkProducers = animals.filter(animal => 
    (animal.type === 'cattle' || animal.type === 'goat') && 
    animal.sex === 'female'
  ).length;
  const pregnantAnimals = animals.filter(animal => animal.isPregnant).length;
  const healthReminders = 0; // Would be calculated based on health logs

  // Today's milk production (mock data for now)
  const todaysMilk = 12.5;

  if (!user) {
    return (
      <ResponsiveNavigation>
        <PageLayout>
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {getLocalizedText('እባክዎ ይግቡ', 'Please Sign In', 'Maaloo seenaa')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {getLocalizedText('ዲጂታል ጎተራዎን ለማየት መግባት ያስፈልግዎታል', 'You need to sign in to access your digital barn', 'Kotaa dijitaalaa keessan ilaaluuf seenuu qabdu')}
            </p>
            <Button onClick={() => router.push('/')}>
              {getLocalizedText('ወደ ቤት ይመለሱ', 'Go Home', 'Gara manaatti deebi\'aa')}
            </Button>
          </div>
        </PageLayout>
      </ResponsiveNavigation>
    );
  }

  if (loading) {
    return (
      <ResponsiveNavigation>
        <PageLayout>
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {getLocalizedText('እንስሳት በመጫን ላይ...', 'Loading animals...', 'Bineensota fe\'aa jira...')}
            </p>
          </div>
        </PageLayout>
      </ResponsiveNavigation>
    );
  }

  return (
    <ResponsiveNavigation>
      <PageLayout maxWidth="2xl" padding="md">
        {/* Header */}
        <CompactHeader
          title={getLocalizedText('ዲጂታል ጎተራ', 'Digital Barn', 'Kotaa Dijitaalaa')}
          subtitle={`${EthiopianCalendar.formatDate(new Date(), 'long', language)} • ${user.name || 'ገበሬ'}`}
          actions={
            <Button onClick={() => router.push('/digital-barn/add-animal')}>
              <Plus className="h-4 w-4 mr-2" />
              {getLocalizedText('እንስሳ ጨምር', 'Add Animal', 'Bineensa dabali')}
            </Button>
          }
        />

        {/* Dashboard Stats */}
        <Section spacing="lg">
          <ResponsiveGrid cols={{ mobile: 2, tablet: 4, desktop: 4 }} gap="lg">
            <StatsCard
              title={getLocalizedText('ጠቅላላ እንስሳት', 'Total Animals', 'Bineensota Hundaa')}
              value={totalAnimals}
              icon={BarChart3}
              color="bg-blue-500"
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title={getLocalizedText('ወተት አምራቾች', 'Milk Producers', 'Oomishtota Aannan')}
              value={milkProducers}
              icon={Milk}
              color="bg-green-500"
            />
            <StatsCard
              title={getLocalizedText('እርጉዝ', 'Pregnant', 'Ulfaa\'aa')}
              value={pregnantAnimals}
              icon={Heart}
              color="bg-pink-500"
            />
            <StatsCard
              title={getLocalizedText('የጤንነት ማስታወሻ', 'Health Reminders', 'Yaadachiisa Fayyaa')}
              value={healthReminders}
              icon={Bell}
              color="bg-red-500"
            />
          </ResponsiveGrid>
        </Section>

        {/* Today's Highlights */}
        {(todaysMilk > 0 || healthReminders > 0) && (
          <Section spacing="lg">
            <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="lg">
              {todaysMilk > 0 && (
                <ImprovedCard padding="lg" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">
                      {getLocalizedText('የዛሬ ወተት ምርት', 'Today\'s Milk Production', 'Oomisha Aannan Har\'aa')}
                    </h3>
                    <Milk className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {todaysMilk} L
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {getLocalizedText('ከትናንት 15% ጨምሯል', '+15% from yesterday', 'Kaleessa irraa 15% dabaleera')}
                  </p>
                </ImprovedCard>
              )}

              {healthReminders > 0 && (
                <ImprovedCard padding="lg" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-red-900 dark:text-red-100">
                      {getLocalizedText('የጤንነት ማስታወሻዎች', 'Health Reminders', 'Yaadachiisota Fayyaa')}
                    </h3>
                    <Bell className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {healthReminders}
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {getLocalizedText('እንስሳት ክትባት ያስፈልጋቸዋል', 'animals need vaccination', 'bineensonni tallaa barbaadu')}
                  </p>
                </ImprovedCard>
              )}
            </ResponsiveGrid>
          </Section>
        )}

        {/* Search and Filters */}
        <Section spacing="lg">
          <FilterBar>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={getLocalizedText('እንስሳ ይፈልጉ...', 'Search animals...', 'Bineensa barbaadi...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={getLocalizedText('ዓይነት', 'Type', 'Gosa')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getLocalizedText('ሁሉም', 'All', 'Hunda')}</SelectItem>
                <SelectItem value="cattle">{getLocalizedText('ላም', 'Cattle', 'Loon')}</SelectItem>
                <SelectItem value="goat">{getLocalizedText('ፍየል', 'Goat', 'Re\'ee')}</SelectItem>
                <SelectItem value="sheep">{getLocalizedText('በግ', 'Sheep', 'Hoolaa')}</SelectItem>
                <SelectItem value="poultry">{getLocalizedText('ዶሮ', 'Poultry', 'Lukuu')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={getLocalizedText('ሁኔታ', 'Status', 'Haala')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getLocalizedText('ሁሉም', 'All', 'Hunda')}</SelectItem>
                <SelectItem value="healthy">{getLocalizedText('ጤናማ', 'Healthy', 'Fayyaa')}</SelectItem>
                <SelectItem value="pregnant">{getLocalizedText('እርጉዝ', 'Pregnant', 'Ulfaa\'aa')}</SelectItem>
                <SelectItem value="milking">{getLocalizedText('ወተት አምራች', 'Milking', 'Aannan oomishtu')}</SelectItem>
              </SelectContent>
            </Select>
          </FilterBar>
        </Section>

        {/* Quick Actions */}
        <Section spacing="lg">
          <HorizontalScroll>
            <Button 
              variant="outline" 
              className="flex-shrink-0"
              onClick={() => router.push('/digital-barn/log-milk')}
            >
              <Milk className="h-4 w-4 mr-2" />
              {getLocalizedText('ወተት ይመዝግቡ', 'Log Milk', 'Aannan galmeessaa')}
            </Button>
            <Button 
              variant="outline" 
              className="flex-shrink-0"
              onClick={() => router.push('/digital-barn/log-health')}
            >
              <Activity className="h-4 w-4 mr-2" />
              {getLocalizedText('ጤንነት ይመዝግቡ', 'Log Health', 'Fayyaa galmeessaa')}
            </Button>
            <Button 
              variant="outline" 
              className="flex-shrink-0"
              onClick={() => router.push('/digital-barn/reports')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {getLocalizedText('ሪፖርቶች', 'Reports', 'Gabaasota')}
            </Button>
            <Button 
              variant="outline" 
              className="flex-shrink-0"
              onClick={() => router.push('/vet-consultation')}
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              {getLocalizedText('ሐኪም ማማከር', 'Consult Vet', 'Hakiima mariisi')}
            </Button>
          </HorizontalScroll>
        </Section>

        {/* Animals Grid */}
        <Section 
          title={getLocalizedText('የእኔ እንስሳት', 'My Animals', 'Bineensota Koo')}
          subtitle={`${filteredAnimals.length} ${getLocalizedText('እንስሳት', 'animals', 'bineensota')}`}
          spacing="lg"
        >
          {filteredAnimals.length > 0 ? (
            <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
              {filteredAnimals.map((animal) => {
                const status = DigitalBarnUtils.calculateAnimalStatus(animal, language);
                const age = DigitalBarnUtils.formatAnimalAge(animal.ageInMonths || 0, language);
                
                return (
                  <AnimalCard
                    key={animal.id}
                    id={animal.id!}
                    name={animal.name}
                    animalId={animal.animalId}
                    type={animal.type}
                    image={animal.photos?.[0]}
                    age={age}
                    status={status}
                    stats={{
                      milkToday: animal.type === 'cattle' || animal.type === 'goat' ? 5.2 : undefined,
                      pregnant: animal.isPregnant,
                      healthDue: false // Would be calculated from health logs
                    }}
                    onClick={() => router.push(`/digital-barn/animals/${animal.id}`)}
                  />
                );
              })}
            </ResponsiveGrid>
          ) : (
            <ImprovedCard padding="lg" className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {searchQuery || selectedType !== 'all' 
                  ? getLocalizedText('ምንም እንስሳ አልተገኘም', 'No animals found', 'Bineensi tokkollee hin argamne')
                  : getLocalizedText('እንስሳት አልተመዘገቡም', 'No animals registered', 'Bineensi tokkollee hin galmeeffamne')
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedType !== 'all'
                  ? getLocalizedText('የፍለጋ መስፈርቶችዎን ይቀይሩ እና እንደገና ይሞክሩ', 'Try adjusting your search criteria', 'Ulaagaalee barbaacha keessan jijjiiraa')
                  : getLocalizedText('የመጀመሪያ እንስሳዎን ይመዝግቡ እና ዲጂታል ጎተራዎን ይጀምሩ', 'Register your first animal and start your digital barn', 'Bineensa jalqabaa galmeessaatii kotaa dijitaalaa keessan jalqabaa')
                }
              </p>
              <Button onClick={() => router.push('/digital-barn/add-animal')}>
                <Plus className="h-4 w-4 mr-2" />
                {getLocalizedText('እንስሳ ጨምር', 'Add Animal', 'Bineensa dabali')}
              </Button>
            </ImprovedCard>
          )}
        </Section>
      </PageLayout>
    </ResponsiveNavigation>
  );
}

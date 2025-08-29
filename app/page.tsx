"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Heart, 
  Calendar, 
  Beef, 
  Circle, 
  Bird, 
  Wrench, 
  Filter, 
  SlidersHorizontal,
  Star,
  Users,
  CheckCircle,
  BookOpen,
  HelpCircle,
  Stethoscope,
  BarChart3,
  User,
  LogOut,
  Plus,
  TrendingUp,
  Eye,
  ShoppingCart
} from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { LanguageSelector } from '@/components/language-selector';
import { ResponsiveNavigation } from '@/components/layout/responsive-navigation';
import { PageLayout, Section, CompactHeader } from '@/components/layout/improved-layout';
import { ImprovedCard, MarketplaceCard, StatsCard, ResponsiveGrid } from '@/components/layout/improved-cards';
import { EthiopianDataUtils, ANIMAL_CATEGORIES, ETHIOPIAN_REGIONS } from '@/lib/ethiopian/data';
import { EthiopianCalendar } from '@/lib/ethiopian/calendar';
import { useAuth } from '@/contexts/auth-context';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

// Mock data for guest preview with responsive images
const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'ጤናማ ላም ለሽያጭ',
    titleEn: 'Healthy Holstein Cattle',
    price: 45000,
    originalPrice: 50000,
    location: 'አዲስ አበባ',
    locationEn: 'Addis Ababa',
    region: 'addis-ababa',
    category: 'cattle',
    breed: 'Holstein Cross',
    age: 24, // months
    gender: 'female',
    images: [
      'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&h=400&fit=crop&crop=center'
    ],
    isVideoVerified: true,
    seller: {
      name: 'አቶ ተስፋዬ መንግስቱ',
      verified: true,
      rating: 4.8,
      location: 'አዲስ አበባ'
    },
    badges: ['Featured', 'Premium'],
    stats: {
      views: 245,
      likes: 18,
      age: '2 years',
      breed: 'Holstein Cross'
    },
    createdAt: new Date('2024-08-25'),
  },
  {
    id: '2',
    title: 'የቦር ፍየል ጥንድ',
    titleEn: 'Boer Goat Breeding Pair',
    price: 12000,
    location: 'ኦሮሚያ',
    locationEn: 'Oromia',
    region: 'oromia',
    category: 'goat',
    breed: 'Boer',
    age: 18,
    gender: 'mixed',
    images: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop&crop=center'
    ],
    isVideoVerified: true,
    seller: {
      name: 'ወ/ሮ ፋጡማ አሊ',
      verified: true,
      rating: 4.9,
      location: 'ኦሮሚያ'
    },
    badges: ['Breeding Pair'],
    stats: {
      views: 189,
      likes: 23,
      age: '1.5 years',
      breed: 'Boer'
    },
    createdAt: new Date('2024-08-26'),
  },
  {
    id: '3',
    title: 'የተሻሻለ ዶሮ',
    titleEn: 'Improved Layer Chickens',
    price: 800,
    location: 'አማራ',
    locationEn: 'Amhara',
    region: 'amhara',
    category: 'poultry',
    breed: 'Rhode Island Red',
    age: 6,
    gender: 'mixed',
    images: [
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&h=400&fit=crop&crop=center'
    ],
    isVideoVerified: false,
    seller: {
      name: 'አቶ ሙሉጌታ ታደሰ',
      verified: false,
      rating: 4.2,
      location: 'አማራ'
    },
    badges: ['High Production'],
    stats: {
      views: 156,
      likes: 12,
      age: '6 months',
      breed: 'Rhode Island Red'
    },
    createdAt: new Date('2024-08-27'),
  },
  {
    id: '4',
    title: 'የአገር በግ',
    titleEn: 'Local Menz Sheep',
    price: 3500,
    location: 'ትግራይ',
    locationEn: 'Tigray',
    region: 'tigray',
    category: 'sheep',
    breed: 'Menz',
    age: 12,
    gender: 'male',
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop&crop=center'
    ],
    isVideoVerified: true,
    seller: {
      name: 'አቶ ገብረ ሚካኤል',
      verified: true,
      rating: 4.6,
      location: 'ትግራይ'
    },
    badges: ['Local Breed'],
    stats: {
      views: 98,
      likes: 8,
      age: '1 year',
      breed: 'Menz'
    },
    createdAt: new Date('2024-08-24'),
  },
];

// Core features from documentation ONLY
const CORE_FEATURES = [
  {
    id: 'digital-barn',
    title: 'ዲጂታል ጎተራ',
    titleEn: 'Digital Barn',
    description: 'የእንስሳት ምዝገባ እና የጤንነት መከታተያ',
    descriptionEn: 'Animal registration and health tracking',
    icon: <BarChart3 className="h-6 w-6" />,
    href: '/digital-barn',
    color: 'bg-blue-500'
  },
  {
    id: 'knowledge-hub',
    title: 'የእውቀት ማዕከል',
    titleEn: 'Knowledge Hub',
    description: 'ዕለታዊ ምክሮች እና ጥያቄ መልስ',
    descriptionEn: 'Daily tips and Q&A forum',
    icon: <BookOpen className="h-6 w-6" />,
    href: '/knowledge-hub',
    color: 'bg-green-500'
  },
  {
    id: 'vet-consultation',
    title: 'የእንስሳት ሐኪም ማማከር',
    titleEn: 'Vet Consultation',
    description: 'ባለሙያ የእንስሳት ሐኪሞች',
    descriptionEn: 'Professional veterinary consultations',
    icon: <Stethoscope className="h-6 w-6" />,
    href: '/vet-consultation',
    color: 'bg-red-500'
  },
  {
    id: 'community',
    title: 'ማህበረሰብ',
    titleEn: 'Community',
    description: 'የገበሬዎች ማህበረሰብ እና መልዕክት',
    descriptionEn: 'Farmers community and messaging',
    icon: <Users className="h-6 w-6" />,
    href: '/community',
    color: 'bg-purple-500'
  }
];

export default function HomePage() {
  const { user, logout, isLoading, language } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [ageRange, setAgeRange] = useState<number[]>([0, 60]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // Set Ethiopian date
    const ethDate = EthiopianCalendar.getCurrentEthiopianDate();
    const formattedDate = EthiopianCalendar.formatEthiopianDate(ethDate, language === 'english' ? 'en' : 'am');
    setCurrentDate(formattedDate);
  }, [language]);

  const handleAuthAction = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cattle': return <Beef className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'goat': return <Circle className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'sheep': return <Circle className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'poultry': return <Bird className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'equipment': return <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />;
      default: return <Search className="h-4 w-4 sm:h-5 sm:w-5" />;
    }
  };

  const getLocalizedText = (amharic: string, english: string, oromo?: string) => {
    switch (language) {
      case 'amharic': return amharic;
      case 'oromo': return oromo || english;
      case 'english': return english;
      default: return amharic;
    }
  };

  const filteredListings = MOCK_LISTINGS.filter(listing => {
    const matchesSearch = searchQuery === '' || 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.breed.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    const matchesRegion = selectedRegion === 'all' || listing.region === selectedRegion;
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    const matchesGender = selectedGender === 'all' || listing.gender === selectedGender || listing.gender === 'mixed';
    const matchesAge = listing.age >= ageRange[0] && listing.age <= ageRange[1];
    const matchesVerification = !showVerifiedOnly || listing.isVideoVerified;
    
    return matchesSearch && matchesCategory && matchesRegion && matchesPrice && matchesGender && matchesAge && matchesVerification;
  });

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedRegion('all');
    setPriceRange([0, 100000]);
    setSelectedGender('all');
    setAgeRange([0, 60]);
    setShowVerifiedOnly(false);
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Beef className="h-6 w-6 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {getLocalizedText('እየጫነ ነው...', 'Loading...', 'Fe\'aa jira...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveNavigation>
      <PageLayout maxWidth="2xl" padding="md">
        {/* Hero Section */}
        <Section spacing="lg">
          <ImprovedCard className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-0" padding="lg">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mr-4">
                  <Beef className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {getLocalizedText('የገበሬ ገበያ', 'Yegebere Gebeya', 'Gabaa Qonnaa')}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{currentDate}</p>
                </div>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {getLocalizedText(
                  'የኢትዮጵያ የእንስሳት ገበያ',
                  'Ethiopia\'s Livestock Marketplace',
                  'Gabaa Bineensaa Itoophiyaa'
                )}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                {getLocalizedText(
                  'ላም፣ ፍየል፣ በግ እና ዶሮ በቀላሉ ይግዙ እና ይሽጡ። ተመዝግበው የእርስዎን ዲጂታል ጎተራ ይጀምሩ።',
                  'Buy and sell cattle, goats, sheep, and poultry with ease. Register to start your digital barn.',
                  'Loon, re\'ee, hoolaa fi lukuu salphaadhaan bitaatii gurguraa.'
                )}
              </p>

              {!user && (
                <Button size="lg" onClick={handleAuthAction} className="mb-8">
                  <Phone className="h-5 w-5 mr-2" />
                  {getLocalizedText('ዛሬ ይመዝገቡ', 'Register Today', 'Har\'a Galmaa\'aa')}
                </Button>
              )}

              {/* Stats */}
              <ResponsiveGrid cols={{ mobile: 3, tablet: 3, desktop: 3 }} gap="md" className="max-w-2xl mx-auto">
                <StatsCard
                  title={getLocalizedText('ተጠቃሚዎች', 'Users', 'Fayyadamtoota')}
                  value="1,000+"
                  icon={Users}
                  color="bg-blue-500"
                  trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                  title={getLocalizedText('እንስሳት', 'Animals', 'Bineensota')}
                  value="500+"
                  icon={Beef}
                  color="bg-green-500"
                  trend={{ value: 8, isPositive: true }}
                />
                <StatsCard
                  title={getLocalizedText('ከተሞች', 'Cities', 'Magaalota')}
                  value="50+"
                  icon={MapPin}
                  color="bg-purple-500"
                  trend={{ value: 5, isPositive: true }}
                />
              </ResponsiveGrid>
            </div>
          </ImprovedCard>
        </Section>

        {/* Core Features - Only from Documentation */}
        <Section 
          title={getLocalizedText('ዋና አገልግሎቶች', 'Core Services', 'Tajaajila Ijoo')}
          spacing="lg"
        >
          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="lg">
            {CORE_FEATURES.map((feature) => (
              <Link key={feature.id} href={user ? feature.href : '#'} onClick={!user ? handleAuthAction : undefined}>
                <ImprovedCard 
                  padding="lg" 
                  clickable 
                  className="h-full hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 ${feature.color} rounded-xl text-white group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                      </div>
                    </div>
                    <h4 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3">
                      {language === 'english' ? feature.titleEn : feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 flex-1 mb-4">
                      {language === 'english' ? feature.descriptionEn : feature.description}
                    </p>
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                      <span>{getLocalizedText('ይጠቀሙ', 'Access', 'Fayyadami')}</span>
                      <Plus className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                </ImprovedCard>
              </Link>
            ))}
          </ResponsiveGrid>
        </Section>

        {/* Search & Filters */}
        <Section 
          title={getLocalizedText('እንስሳት ይፈልጉ', 'Search Animals', 'Bineensa Barbaadi')}
          spacing="lg"
        >
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={getLocalizedText('እንስሳ ይፈልጉ...', 'Search animals...', 'Bineensa barbaadi...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
            
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg" className="h-14 px-6">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  {getLocalizedText('ማጣሪያ', 'Filter', 'Gingilchaa')}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>{getLocalizedText('ማጣሪያዎች', 'Filters', 'Gingilchaa')}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {getLocalizedText('ዓይነት', 'Category', 'Gosa')}
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{getLocalizedText('ሁሉም', 'All', 'Hunda')}</SelectItem>
                        {ANIMAL_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {EthiopianDataUtils.getLocalizedName(category, language)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {getLocalizedText('የዋጋ ክልል', 'Price Range', 'Hangii Gatii')} ({EthiopianDataUtils.formatETB(priceRange[0])} - {EthiopianDataUtils.formatETB(priceRange[1])})
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={100000}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                  </div>

                  <Button onClick={clearFilters} variant="outline" className="w-full">
                    {getLocalizedText('ማጣሪያዎችን አጽዳ', 'Clear Filters', 'Gingilchaa haqii')}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="lg"
            >
              {getLocalizedText('ሁሉም', 'All', 'Hunda')}
            </Button>
            {ANIMAL_CATEGORIES.slice(0, 4).map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                size="lg"
              >
                {getCategoryIcon(category.id)}
                <span className="ml-2">{EthiopianDataUtils.getLocalizedName(category, language)}</span>
              </Button>
            ))}
          </div>
        </Section>

        {/* Featured Listings */}
        <Section 
          title={getLocalizedText('የቅርብ ጊዜ ዝርዝሮች', 'Featured Listings', 'Tarreeffama Dhiyeenyaa')}
          subtitle={`${filteredListings.length} ${getLocalizedText('ውጤቶች', 'results', 'bu\'aa')}`}
          spacing="lg"
        >
          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {filteredListings.slice(0, 6).map((listing) => (
              <MarketplaceCard
                key={listing.id}
                id={listing.id}
                title={language === 'english' ? listing.titleEn : listing.title}
                price={listing.price}
                originalPrice={listing.originalPrice}
                image={listing.images[0]}
                images={listing.images.slice(1)}
                seller={listing.seller}
                badges={listing.badges}
                stats={listing.stats}
                onLike={() => console.log('Liked:', listing.id)}
                onShare={() => console.log('Shared:', listing.id)}
                onMessage={() => !user ? handleAuthAction() : console.log('Message:', listing.id)}
                onBuy={() => !user ? handleAuthAction() : console.log('Buy:', listing.id)}
              />
            ))}
          </ResponsiveGrid>

          {filteredListings.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                {getLocalizedText('ምንም ውጤት አልተገኘም', 'No results found', 'Bu\'aan hin argamne')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {getLocalizedText('የፍለጋ መስፈርቶችዎን ይቀይሩ እና እንደገና ይሞክሩ', 'Try adjusting your search criteria', 'Ulaagaalee barbaacha keessan jijjiiraa')}
              </p>
              <Button onClick={clearFilters} variant="outline" size="lg">
                {getLocalizedText('ማጣሪያዎችን አጽዳ', 'Clear Filters', 'Gingilchaa haqii')}
              </Button>
            </div>
          )}
        </Section>

        {/* Call to Action */}
        {!user && (
          <Section spacing="lg">
            <ImprovedCard padding="lg" className="bg-gradient-to-r from-primary to-blue-600 text-white text-center border-0">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                {getLocalizedText(
                  'ዛሬ ይመዝገቡ እና የእርስዎን ዲጂታል ጎተራ ይጀምሩ',
                  'Register Today and Start Your Digital Barn',
                  'Har\'a galmaa\'aa fi kotaa dijitaalaa keessan jalqabaa'
                )}
              </h3>
              <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                {getLocalizedText(
                  'የእንስሳቶችዎን ጤንነት ይከታተሉ፣ በገበያ ይሳተፉ እና ከእንስሳት ሐኪሞች ጋር ይማክሩ',
                  'Track your animals\' health, participate in the marketplace, and consult with veterinarians',
                  'Fayyaa bineensota keessanii hordofaa, gabaa keessatti hirmaadhaatii'
                )}
              </p>
              <Button size="lg" variant="secondary" onClick={handleAuthAction} className="text-primary">
                <Phone className="h-5 w-5 mr-2" />
                {getLocalizedText('ዛሬ ይመዝገቡ', 'Register Today', 'Har\'a Galmaa\'aa')}
              </Button>
            </ImprovedCard>
          </Section>
        )}
      </PageLayout>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
      />
    </ResponsiveNavigation>
  );
}

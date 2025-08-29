"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plus,
  Eye,
  Filter,
  TrendingUp,
  Users,
  ShoppingCart,
  Beef,
  Wrench,
  Wheat,
  Stethoscope,
  Package,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ResponsiveNavigation } from '@/components/layout/responsive-navigation';
import { PageLayout, Section, CompactHeader, FilterBar } from '@/components/layout/improved-layout';
import { ImprovedCard, MarketplaceCard, StatsCard, ResponsiveGrid } from '@/components/layout/improved-cards';
import { 
  ListingCategory, 
  CATEGORY_CONFIGS, 
  ListingSearchParams,
  Listing 
} from '@/lib/marketplace/types';
import { listingService } from '@/lib/marketplace/listing-service';

// Enhanced mock data with new categories
const MOCK_LISTINGS = [
  {
    id: '1',
    category: 'livestock' as ListingCategory,
    title: 'ጤናማ ሆልስታይን ላም',
    titleEn: 'Healthy Holstein Cattle',
    price: 45000,
    originalPrice: 50000,
    location: 'አዲስ አበባ',
    region: 'addis-ababa',
    images: [
      'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&h=400&fit=crop&crop=center'
    ],
    verificationTier: 'vet' as const,
    seller: {
      name: 'አቶ ተስፋዬ መንግስቱ',
      verified: true,
      rating: 4.8,
      location: 'አዲስ አበባ'
    },
    badges: ['Featured', 'Vet ✓', 'Premium'],
    stats: {
      views: 245,
      likes: 18,
      age: '2 years',
      breed: 'Holstein Cross'
    },
    attributes: {
      species: 'ላም',
      breed: 'Holstein Cross',
      age: 24,
      gender: 'female'
    },
    createdAt: new Date('2024-08-25'),
  },
  {
    id: '2',
    category: 'livestock' as ListingCategory,
    title: 'የቦር ፍየል ዝርያ ጥንድ',
    titleEn: 'Boer Goat Breeding Pair',
    price: 12000,
    location: 'ኦሮሚያ',
    region: 'oromia',
    images: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop&crop=center'
    ],
    verificationTier: 'video' as const,
    seller: {
      name: 'ወ/ሮ ፋጡማ አሊ',
      verified: true,
      rating: 4.9,
      location: 'ኦሮሚያ'
    },
    badges: ['Breeding Pair', 'Video ✓'],
    stats: {
      views: 189,
      likes: 23,
      age: '1.5 years',
      breed: 'Boer'
    },
    attributes: {
      species: 'ፍየል',
      breed: 'Boer',
      age: 18,
      gender: 'mixed'
    },
    createdAt: new Date('2024-08-26'),
  },
  {
    id: '3',
    category: 'machinery' as ListingCategory,
    title: 'ጃን ዲር ትራክተር',
    titleEn: 'John Deere Tractor',
    price: 850000,
    location: 'አማራ',
    region: 'amhara',
    images: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&crop=center'
    ],
    verificationTier: 'mechanic' as const,
    seller: {
      name: 'አቶ ገብረ ሚካኤል',
      verified: true,
      rating: 4.6,
      location: 'አማራ'
    },
    badges: ['Mechanic ✓', 'Warranty'],
    stats: {
      views: 156,
      likes: 12,
      condition: 'Excellent',
      year: '2020'
    },
    attributes: {
      type: 'ትራክተር',
      brand: 'John Deere',
      model: '5075E',
      condition: 'excellent',
      year: 2020
    },
    createdAt: new Date('2024-08-27'),
  },
  {
    id: '4',
    category: 'feed' as ListingCategory,
    title: 'የላም መኟ - ፕሪሚየም',
    titleEn: 'Premium Cattle Feed',
    price: 1200,
    location: 'ትግራይ',
    region: 'tigray',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop&crop=center'
    ],
    verificationTier: 'lab' as const,
    seller: {
      name: 'አቶ ሙሉጌታ ታደሰ',
      verified: true,
      rating: 4.4,
      location: 'ትግራይ'
    },
    badges: ['Lab ✓', 'Organic'],
    stats: {
      views: 98,
      likes: 8,
      quantity: '50kg',
      expiry: '6 months'
    },
    attributes: {
      feedType: 'የላም መኖ',
      quantity: 50,
      packaging: 'bag',
      organicCertified: true
    },
    createdAt: new Date('2024-08-28'),
  },
  {
    id: '5',
    category: 'vet_supplies' as ListingCategory,
    title: 'የእንስሳት ክትባት',
    titleEn: 'Livestock Vaccine',
    price: 450,
    location: 'ደቡብ',
    region: 'south',
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&crop=center'
    ],
    verificationTier: 'vet' as const,
    seller: {
      name: 'ዶ/ር አበበ ተስፋዬ',
      verified: true,
      rating: 4.9,
      location: 'ደቡብ'
    },
    badges: ['Vet ✓', 'Prescription'],
    stats: {
      views: 67,
      likes: 5,
      quantity: '10 doses',
      expiry: '12 months'
    },
    attributes: {
      supplyType: 'vaccine',
      productName: 'FMD Vaccine',
      quantity: 10,
      unit: 'doses'
    },
    createdAt: new Date('2024-08-29'),
  }
];

export default function MarketplacePage() {
  const router = useRouter();
  const { user, language } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [categoryStats, setCategoryStats] = useState<Record<ListingCategory, number>>({
    livestock: 45,
    machinery: 12,
    equipment: 8,
    feed: 23,
    vet_supplies: 15,
    accessories: 6
  });
  const [isLoading, setIsLoading] = useState(false);

  const getLocalizedText = (amharic: string, english: string, oromo?: string) => {
    switch (language) {
      case 'amharic': return amharic;
      case 'oromo': return oromo || english;
      case 'english': return english;
      default: return amharic;
    }
  };

  // Load category statistics
  useEffect(() => {
    const loadCategoryStats = async () => {
      try {
        const stats = await listingService.getCategoryStats();
        setCategoryStats(stats);
      } catch (error) {
        console.error('Error loading category stats:', error);
        // Use mock data on error
      }
    };
    loadCategoryStats();
  }, []);

  // Search listings
  useEffect(() => {
    const searchListings = async () => {
      setIsLoading(true);
      try {
        const searchParams: ListingSearchParams = {
          query: searchQuery || undefined,
          filters: {
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            region: selectedRegion !== 'all' ? selectedRegion : undefined,
            priceMin: priceRange[0],
            priceMax: priceRange[1]
          },
          sortBy: sortBy as any,
          limit: 20
        };

        // In production: use actual API
        // const result = await listingService.searchListings(searchParams);
        // setListings(result.listings);
        
        // For now, use filtered mock data
        const filtered = MOCK_LISTINGS.filter(listing => {
          const matchesSearch = !searchQuery || 
            listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
          const matchesRegion = selectedRegion === 'all' || listing.region === selectedRegion;
          const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
          
          return matchesSearch && matchesCategory && matchesRegion && matchesPrice;
        });
        
        setListings(filtered);
      } catch (error) {
        console.error('Error searching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchListings, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, selectedRegion, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedRegion('all');
    setPriceRange([0, 1000000]);
    setSearchQuery('');
  };

  const getCategoryIcon = (category: ListingCategory) => {
    const config = CATEGORY_CONFIGS[category];
    switch (config.icon) {
      case 'Beef': return <Beef className="h-6 w-6" />;
      case 'Wrench': return <Wrench className="h-6 w-6" />;
      case 'Settings': return <Settings className="h-6 w-6" />;
      case 'Wheat': return <Wheat className="h-6 w-6" />;
      case 'Stethoscope': return <Stethoscope className="h-6 w-6" />;
      case 'Package': return <Package className="h-6 w-6" />;
      default: return <Package className="h-6 w-6" />;
    }
  };

  return (
    <ResponsiveNavigation>
      <PageLayout maxWidth="2xl" padding="md">
        {/* Header */}
        <CompactHeader
          title={getLocalizedText('ገበያ', 'Marketplace', 'Gabaa')}
          subtitle={getLocalizedText('እንስሳት፣ ማሽነሪ፣ መኖ እና መድሃኒት ይግዙ እና ይሽጡ', 'Buy and sell animals, machinery, feed and medicine', 'Bineensotaa, maashinarii, nyaataa fi qoricha bitaatii gurguraa')}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/marketplace/my-listings')}>
                <Eye className="h-4 w-4 mr-2" />
                {getLocalizedText('የእኔ ዝርዝሮች', 'My Listings', 'Tarreeffamtoota Koo')}
              </Button>
              <Button onClick={() => router.push('/marketplace/create-listing')}>
                <Plus className="h-4 w-4 mr-2" />
                {getLocalizedText('ዝርዝር ይፍጠሩ', 'Create Listing', 'Tarreeffama Uumii')}
              </Button>
            </div>
          }
        />

        {/* Category Stats */}
        <Section spacing="lg">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(CATEGORY_CONFIGS).map(([key, config]) => {
              const category = key as ListingCategory;
              const count = categoryStats[category] || 0;
              return (
                <ImprovedCard 
                  key={category} 
                  padding="md" 
                  clickable 
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'ring-2 ring-primary bg-primary/5' : ''}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{config.emoji}</div>
                    <h3 className="font-bold text-sm">
                      {language === 'english' ? config.nameEn : config.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {count} {getLocalizedText('ዝርዝሮች', 'listings', 'tarreeffamtoota')}
                    </p>
                  </div>
                </ImprovedCard>
              );
            })}
          </div>
        </Section>

        {/* Search and Filters */}
        <Section spacing="lg">
          <FilterBar>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={getLocalizedText('እንስሳ፣ ማሽን፣ መኖ ይፈልጉ...', 'Search animals, machines, feed...', 'Bineensa, maashinii, nyaata barbaadi...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ListingCategory | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={getLocalizedText('ምድብ', 'Category', 'Gosa')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getLocalizedText('ሁሉም', 'All', 'Hunda')}</SelectItem>
                {Object.entries(CATEGORY_CONFIGS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.emoji} {language === 'english' ? config.nameEn : config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={getLocalizedText('ክልል', 'Region', 'Naannoo')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getLocalizedText('ሁሉም', 'All', 'Hunda')}</SelectItem>
                <SelectItem value="addis-ababa">አዲስ አበባ</SelectItem>
                <SelectItem value="oromia">ኦሮሚያ</SelectItem>
                <SelectItem value="amhara">አማራ</SelectItem>
                <SelectItem value="tigray">ትግራይ</SelectItem>
                <SelectItem value="south">ደቡብ</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={getLocalizedText('ደርድር', 'Sort', 'Tartiiba')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{getLocalizedText('አዲስ', 'Newest', 'Haaraa')}</SelectItem>
                <SelectItem value="oldest">{getLocalizedText('ቀድሞ', 'Oldest', 'Durii')}</SelectItem>
                <SelectItem value="price_low">{getLocalizedText('ዋጋ ዝቅተኛ', 'Price Low', 'Gatii Gadi')}</SelectItem>
                <SelectItem value="price_high">{getLocalizedText('ዋጋ ከፍተኛ', 'Price High', 'Gatii Ol')}</SelectItem>
                <SelectItem value="popular">{getLocalizedText('ተወዳጅ', 'Popular', 'Jaallatamaa')}</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={clearFilters} variant="outline">
              {getLocalizedText('አጽዳ', 'Clear', 'Haqii')}
            </Button>
          </FilterBar>
        </Section>

        {/* Listings */}
        <Section 
          title={getLocalizedText('ዝርዝሮች', 'Listings', 'Tarreeffamtoota')}
          subtitle={`${listings.length} ${getLocalizedText('ውጤቶች', 'results', 'bu\'aa')}`}
          spacing="lg"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{getLocalizedText('እየተጫነ...', 'Loading...', 'Fe\'aa jira...')}</p>
            </div>
          ) : listings.length > 0 ? (
            <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
              {listings.map((listing) => (
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
                  category={listing.category}
                  onClick={() => router.push(`/marketplace/listings/${listing.id}`)}
                  onLike={() => console.log('Liked:', listing.id)}
                  onShare={() => console.log('Shared:', listing.id)}
                  onMessage={() => console.log('Message:', listing.id)}
                  onBuy={() => console.log('Buy:', listing.id)}
                />
              ))}
            </ResponsiveGrid>
          ) : (
            <ImprovedCard padding="lg" className="text-center">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {getLocalizedText('ምንም ውጤት አልተገኘም', 'No results found', 'Bu\'aan hin argamne')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {getLocalizedText('የፍለጋ መስፈርቶችዎን ይቀይሩ እና እንደገና ይሞክሩ', 'Try adjusting your search criteria', 'Ulaagaalee barbaacha keessan jijjiiraa')}
              </p>
              <Button onClick={clearFilters} variant="outline" size="lg">
                {getLocalizedText('ማጣሪያዎችን አጽዳ', 'Clear Filters', 'Gingilchaa haqii')}
              </Button>
            </ImprovedCard>
          )}
        </Section>

        {/* Quick Actions */}
        <Section spacing="lg">
          <div className="grid md:grid-cols-2 gap-6">
            <ImprovedCard padding="lg" className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                {getLocalizedText('ዝርዝር ይፍጠሩ', 'Create Listing', 'Tarreeffama Uumii')}
              </h3>
              <p className="text-gray-600 mb-4">
                {getLocalizedText('እንስሳትዎን እና ምርቶችዎን በገበያ ላይ ያስቀምጡ', 'List your animals and products on the marketplace', 'Bineensotaa fi oomishaalee keessan gabaa irratti kaa\'aa')}
              </p>
              <Button onClick={() => router.push('/marketplace/create-listing')}>
                {getLocalizedText('አሁን ይጀምሩ', 'Start Now', 'Amma Jalqabaa')}
              </Button>
            </ImprovedCard>

            <ImprovedCard padding="lg" className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                {getLocalizedText('ከጎተራ ይሽጡ', 'Sell from Barn', 'Gola keessaa Gurguraa')}
              </h3>
              <p className="text-gray-600 mb-4">
                {getLocalizedText('በዲጂታል ጎተራዎ ያሉ እንስሳትን በቀላሉ ወደ ገበያ ያስቀምጡ', 'Easily list animals from your digital barn to marketplace', 'Bineensota gola dijitaalaa keessan keessaa salphaatti gabaa irratti kaa\'aa')}
              </p>
              <Button variant="outline" onClick={() => router.push('/digital-barn')}>
                {getLocalizedText('ጎተራ ይመልከቱ', 'View Barn', 'Gola Ilaali')}
              </Button>
            </ImprovedCard>
          </div>
        </Section>
      </PageLayout>
    </ResponsiveNavigation>
  );
}

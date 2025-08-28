"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, Phone, MessageCircle, Heart, Star, Calendar, Beef, Circle, Bird, Wrench, Filter, SlidersHorizontal } from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { LanguageSelector } from '@/components/language-selector';
import { EthiopianDataUtils, ANIMAL_CATEGORIES, ETHIOPIAN_REGIONS } from '@/lib/ethiopian/data';
import { EthiopianCalendar } from '@/lib/ethiopian/calendar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// Mock data for guest preview with responsive images
const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'ጤናማ ላም ለሽያጭ',
    titleEn: 'Healthy Cattle for Sale',
    price: 45000,
    location: 'አዲስ አበባ',
    locationEn: 'Addis Ababa',
    region: 'addis-ababa',
    category: 'cattle',
    breed: 'Holstein Cross',
    age: 24, // months
    gender: 'female',
    images: ['https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400&h=300&fit=crop&crop=center'],
    isVideoVerified: true,
    seller: 'አቶ ተስፋዬ',
    sellerEn: 'Ato Tesfaye',
    createdAt: new Date('2024-08-25'),
  },
  {
    id: '2',
    title: 'የቦር ፍየል ጥንድ',
    titleEn: 'Boer Goat Pair',
    price: 12000,
    location: 'ኦሮሚያ',
    locationEn: 'Oromia',
    region: 'oromia',
    category: 'goat',
    breed: 'Boer',
    age: 18,
    gender: 'mixed',
    images: ['https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center'],
    isVideoVerified: true,
    seller: 'ወ/ሮ ፋጡማ',
    sellerEn: 'W/ro Fatuma',
    createdAt: new Date('2024-08-26'),
  },
  {
    id: '3',
    title: 'የተሻሻለ ዶሮ',
    titleEn: 'Improved Chickens',
    price: 800,
    location: 'አማራ',
    locationEn: 'Amhara',
    region: 'amhara',
    category: 'poultry',
    breed: 'Rhode Island Red',
    age: 6,
    gender: 'mixed',
    images: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop&crop=center'],
    isVideoVerified: false,
    seller: 'አቶ ሙሉጌታ',
    sellerEn: 'Ato Mulugeta',
    createdAt: new Date('2024-08-27'),
  },
  {
    id: '4',
    title: 'የአገር በግ',
    titleEn: 'Local Sheep',
    price: 3500,
    location: 'ትግራይ',
    locationEn: 'Tigray',
    region: 'tigray',
    category: 'sheep',
    breed: 'Menz',
    age: 12,
    gender: 'male',
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=center'],
    isVideoVerified: true,
    seller: 'አቶ ገብረ',
    sellerEn: 'Ato Gebre',
    createdAt: new Date('2024-08-24'),
  },
];

export default function HomePage() {
  const [language, setLanguage] = useState<'am' | 'or' | 'en'>('am');
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
    const formattedDate = EthiopianCalendar.formatEthiopianDate(ethDate, language === 'en' ? 'en' : 'am');
    setCurrentDate(formattedDate);
  }, [language]);

  const handleAuthAction = () => {
    setIsAuthModalOpen(true);
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
      case 'am': return amharic;
      case 'or': return oromo || english;
      case 'en': return english;
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

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Region Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {getLocalizedText('ክልል', 'Region', 'Naannoo')}
        </label>
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger>
            <SelectValue placeholder={getLocalizedText('ክልል ይምረጡ', 'Select Region', 'Naannoo filadhu')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{getLocalizedText('ሁሉም ክልሎች', 'All Regions', 'Naannolee hunda')}</SelectItem>
            {ETHIOPIAN_REGIONS.map((region) => (
              <SelectItem key={region.id} value={region.id}>
                {EthiopianDataUtils.getLocalizedName(region, language)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium">
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

      {/* Gender Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {getLocalizedText('ጾታ', 'Gender', 'Saala')}
        </label>
        <Select value={selectedGender} onValueChange={setSelectedGender}>
          <SelectTrigger>
            <SelectValue placeholder={getLocalizedText('ጾታ ይምረጡ', 'Select Gender', 'Saala filadhu')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{getLocalizedText('ሁሉም', 'All', 'Hunda')}</SelectItem>
            <SelectItem value="male">{getLocalizedText('ወንድ', 'Male', 'Dhiira')}</SelectItem>
            <SelectItem value="female">{getLocalizedText('ሴት', 'Female', 'Dubartii')}</SelectItem>
            <SelectItem value="mixed">{getLocalizedText('ድቅል', 'Mixed', 'Makaa')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Age Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium">
          {getLocalizedText('የእድሜ ክልል', 'Age Range', 'Hangii Umurii')} ({ageRange[0]} - {ageRange[1]} {getLocalizedText('ወር', 'months', 'ji\'oota')})
        </label>
        <Slider
          value={ageRange}
          onValueChange={setAgeRange}
          max={60}
          min={0}
          step={1}
          className="w-full"
        />
      </div>

      {/* Verification Filter */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="verified"
          checked={showVerifiedOnly}
          onChange={(e) => setShowVerifiedOnly(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="verified" className="text-sm font-medium cursor-pointer">
          {getLocalizedText('ቪዲዮ የተረጋገጠ ብቻ', 'Video Verified Only', 'Video Mirkaneeffame qofa')}
        </label>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        {getLocalizedText('ማጣሪያዎችን አጽዳ', 'Clear Filters', 'Gingilchaa haqii')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Beef className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-xl font-bold text-gray-900">
                    {getLocalizedText('የገበሬ ገበያ', 'Yegebere Gebeya', 'Gabaa Qonnaa')}
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">{currentDate}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
              <Button onClick={handleAuthAction} size="sm" className="bg-green-600 hover:bg-green-700">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">{getLocalizedText('ግባ', 'Sign In', 'Seeni')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            {getLocalizedText(
              'የኢትዮጵያ የእንስሳት ገበያ',
              'Ethiopia\'s Livestock Marketplace',
              'Gabaa Bineensaa Itoophiyaa'
            )}
          </h2>
          <p className="text-sm sm:text-xl text-gray-600 mb-4 sm:mb-8 max-w-3xl mx-auto">
            {getLocalizedText(
              'ላም፣ ፍየል፣ በግ እና ዶሮ በቀላሉ ይግዙ እና ይሽጡ። ተመዝግበው የእርስዎን ዲጂታል ጎተራ ይጀምሩ።',
              'Buy and sell cattle, goats, sheep, and poultry with ease. Register to start your digital barn.',
              'Loon, re\'ee, hoolaa fi lukuu salphaadhaan bitaatii gurguraa. Galmaa\'uudhaan kotaa dijitaalaa keessan jalqabaa.'
            )}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-4 sm:mb-8">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  type="text"
                  placeholder={getLocalizedText('እንስሳ ይፈልጉ...', 'Search animals...', 'Bineensa barbaadi...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-lg"
                />
              </div>
              
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="sm:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>{getLocalizedText('ማጣሪያዎች', 'Filters', 'Gingilchaa')}</SheetTitle>
                    <SheetDescription>
                      {getLocalizedText('ውጤቶችን ያጣሩ', 'Filter results', 'Bu\'aa gingilchii')}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-4 sm:mb-8">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
              className="mb-1 sm:mb-2 text-xs sm:text-sm"
            >
              {getLocalizedText('ሁሉም', 'All', 'Hunda')}
            </Button>
            {ANIMAL_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                size="sm"
                className="mb-1 sm:mb-2 text-xs sm:text-sm"
              >
                {getCategoryIcon(category.id)}
                <span className="ml-1 sm:ml-2">{EthiopianDataUtils.getLocalizedName(category, language)}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                {getLocalizedText('ማጣሪያዎች', 'Filters', 'Gingilchaa')}
              </h3>
              <FilterContent />
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {filteredListings.length} {getLocalizedText('ውጤቶች ተገኝተዋል', 'results found', 'bu\'aa argaman')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleAuthAction}>
                  <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={listing.images[0]}
                        alt={language === 'en' ? listing.titleEn : listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      {listing.isVideoVerified && (
                        <Badge className="bg-green-600 text-white text-xs">
                          {getLocalizedText('ቪዲዮ ተረጋግጧል', 'Video Verified', 'Viidiyoo Mirkaneeffame')}
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 left-2 bg-white/80 hover:bg-white p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAuthAction();
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base sm:text-lg line-clamp-2">
                      {language === 'en' ? listing.titleEn : listing.title}
                    </CardTitle>
                    <CardDescription className="flex items-center text-xs sm:text-sm">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {language === 'en' ? listing.locationEn : listing.location}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg sm:text-2xl font-bold text-green-600">
                        {EthiopianDataUtils.formatETB(listing.price)}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">
                          {EthiopianCalendar.formatEthiopianDate(
                            EthiopianCalendar.gregorianToEthiopian(listing.createdAt),
                            language === 'en' ? 'en' : 'am'
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>{getLocalizedText('ዝርያ:', 'Breed:', 'Gosoota:')}</span>
                        <span>{listing.breed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{getLocalizedText('እድሜ:', 'Age:', 'Umurii:')}</span>
                        <span>{listing.age} {getLocalizedText('ወር', 'months', 'ji\'oota')}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs sm:text-sm text-gray-600 truncate">
                        {getLocalizedText('ሻጭ:', 'Seller:', 'Gurgurtaa:')} {language === 'en' ? listing.sellerEn : listing.seller}
                      </span>
                      <Button size="sm" onClick={handleAuthAction} className="text-xs">
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {getLocalizedText('መልዕክት', 'Message', 'Ergaa')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-base sm:text-lg">
                  {getLocalizedText(
                    'ምንም ውጤት አልተገኘም',
                    'No results found',
                    'Bu\'aan hin argamne'
                  )}
                </p>
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  {getLocalizedText('ማጣሪያዎችን አጽዳ', 'Clear Filters', 'Gingilchaa haqii')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <section className="py-8 sm:py-16 bg-green-600 text-white mt-8 sm:mt-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">
            {getLocalizedText(
              'ዛሬ ይመዝገቡ እና የእርስዎን ዲጂታል ጎተራ ይጀምሩ',
              'Register Today and Start Your Digital Barn',
              'Har\'a galmaa\'aa fi kotaa dijitaalaa keessan jalqabaa'
            )}
          </h3>
          <p className="text-sm sm:text-xl mb-4 sm:mb-8 opacity-90">
            {getLocalizedText(
              'የእንስሳቶችዎን ጤንነት ይከታተሉ፣ በገበያ ይሳተፉ እና ከእንስሳት ሐኪሞች ጋር ይማክሩ',
              'Track your animals\' health, participate in the marketplace, and consult with veterinarians',
              'Fayyaa bineensota keessanii hordofaa, gabaa keessatti hirmaadhaatii fi veterinarian wajjin mariʼadhaa'
            )}
          </p>
          <Button size="lg" variant="secondary" onClick={handleAuthAction} className="text-green-600">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            {getLocalizedText('ዛሬ ይመዝገቡ', 'Register Today', 'Har\'a Galmaa\'aa')}
          </Button>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
      />
    </div>
  );
}

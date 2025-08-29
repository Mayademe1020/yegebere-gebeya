'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Calendar, 
  Star,
  Shield,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Users,
  Clock,
  Package,
  Truck,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ResponsiveNavigation } from '@/components/layout/responsive-navigation';
import { PageLayout, Section } from '@/components/layout/improved-layout';
import { ImprovedCard } from '@/components/layout/improved-cards';
import { 
  Listing, 
  ListingCategory, 
  CATEGORY_CONFIGS, 
  VERIFICATION_CONFIGS,
  LivestockAttributes,
  MachineryAttributes,
  FeedAttributes,
  VetSuppliesAttributes,
  AccessoriesAttributes
} from '@/lib/marketplace/types';
import { listingService } from '@/lib/marketplace/listing-service';

// Mock listing data for demonstration
const MOCK_LISTING: Listing = {
  id: '1',
  userId: 'user_123',
  category: 'livestock',
  title: 'ጤናማ ሆልስታይን ላም',
  description: 'በጣም ጤናማ እና ወተት አምራች ሆልስታይን ላም። ቀን 15-20 ሊትር ወተት ታመርታለች። ሁሉም ክትባቶች ተወስደዋል እና የጤና ምስክር ወረቀት አለው። ለመራባትም ዝግጁ ነች።',
  price: 45000,
  negotiable: true,
  location: 'አዲስ አበባ',
  region: 'አዲስ አበባ',
  media: [
    'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&h=600&fit=crop&crop=center'
  ],
  verificationTier: 'vet',
  attributes: {
    species: 'ላም',
    breed: 'Holstein Cross',
    age: 24,
    gender: 'female',
    weight: 450,
    healthStatus: 'excellent',
    vaccinated: true,
    pregnant: false,
    milkProduction: 18,
    fromBarn: true
  } as LivestockAttributes,
  status: 'active',
  createdAt: new Date('2024-08-25'),
  updatedAt: new Date('2024-08-25')
};

const MOCK_SELLER = {
  name: 'አቶ ተስፋዬ መንግስቱ',
  phone: '+251911123456',
  verified: true,
  rating: 4.8,
  totalListings: 12,
  joinedDate: new Date('2023-05-15'),
  location: 'አዲስ አበባ',
  responseTime: '2 ሰዓት ውስጥ',
  languages: ['አማርኛ', 'English']
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, language } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState(MOCK_SELLER);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(245);

  const listingId = params.listingId as string;

  useEffect(() => {
    const loadListing = async () => {
      try {
        setIsLoading(true);
        // In production: const listing = await listingService.getListingById(listingId);
        // For now, use mock data
        setListing(MOCK_LISTING);
        setViewCount(prev => prev + 1);
      } catch (error) {
        console.error('Error loading listing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (listingId) {
      loadListing();
    }
  }, [listingId]);

  const getLocalizedText = (amharic: string, english: string, oromo?: string) => {
    switch (language) {
      case 'amharic': return amharic;
      case 'oromo': return oromo || english;
      case 'english': return english;
      default: return amharic;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast: "Link copied to clipboard"
    }
  };

  const handleContact = (method: 'phone' | 'message') => {
    if (method === 'phone') {
      window.open(`tel:${seller.phone}`);
    } else {
      // Open messaging interface
      console.log('Open message interface');
    }
  };

  const renderCategorySpecificInfo = () => {
    if (!listing) return null;

    const { category, attributes } = listing;

    switch (category) {
      case 'livestock':
        const livestockAttrs = attributes as LivestockAttributes;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🐄 {getLocalizedText('የእንስሳት መረጃ', 'Animal Information', 'Odeeffannoo Bineensaa')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('ዓይነት', 'Species', 'Gosa')}</span>
                  <p className="font-medium">{livestockAttrs.species}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('ዝርያ', 'Breed', 'Sanyii')}</span>
                  <p className="font-medium">{livestockAttrs.breed}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('እድሜ', 'Age', 'Umurii')}</span>
                  <p className="font-medium">{livestockAttrs.age} {getLocalizedText('ወር', 'months', 'ji\'oota')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('ጾታ', 'Gender', 'Saala')}</span>
                  <p className="font-medium">
                    {livestockAttrs.gender === 'male' ? getLocalizedText('ወንድ', 'Male', 'Korma') : 
                     livestockAttrs.gender === 'female' ? getLocalizedText('ሴት', 'Female', 'Dhalaa') : 
                     getLocalizedText('ድብልቅ', 'Mixed', 'Makaa')}
                  </p>
                </div>
                {livestockAttrs.weight && (
                  <div>
                    <span className="text-sm text-gray-600">{getLocalizedText('ክብደት', 'Weight', 'Ulfaatina')}</span>
                    <p className="font-medium">{livestockAttrs.weight} {getLocalizedText('ኪግ', 'kg', 'kg')}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('የጤና ሁኔታ', 'Health Status', 'Haala Fayyaa')}</span>
                  <p className="font-medium flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {livestockAttrs.healthStatus === 'excellent' ? getLocalizedText('በጣም ጤናማ', 'Excellent', 'Baay\'ee Fayyaa') :
                     livestockAttrs.healthStatus === 'healthy' ? getLocalizedText('ጤናማ', 'Healthy', 'Fayyaa') :
                     getLocalizedText('ጥሩ', 'Good', 'Gaarii')}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {livestockAttrs.vaccinated ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span>{getLocalizedText('ክትባት ተወስዷል', 'Vaccinated', 'Tallaa Fudhatee')}</span>
                </div>
                {livestockAttrs.gender === 'female' && (
                  <div className="flex items-center gap-2">
                    {livestockAttrs.pregnant ? (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <span>{getLocalizedText('እርግዝና', 'Pregnant', 'Ulfaa\'aa')}</span>
                  </div>
                )}
              </div>

              {livestockAttrs.milkProduction && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      {getLocalizedText('የወተት ምርት', 'Milk Production', 'Oomisha Aannan')}
                    </span>
                  </div>
                  <p className="text-blue-800">
                    {livestockAttrs.milkProduction} {getLocalizedText('ሊትር በቀን', 'liters per day', 'liitirii guyyaatti')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'machinery':
      case 'equipment':
        const machineryAttrs = attributes as MachineryAttributes;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚜 {getLocalizedText('የማሽን መረጃ', 'Machine Information', 'Odeeffannoo Maashinii')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('ዓይነት', 'Type', 'Gosa')}</span>
                  <p className="font-medium">{machineryAttrs.type}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('ብራንድ', 'Brand', 'Maqaa')}</span>
                  <p className="font-medium">{machineryAttrs.brand}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('ሞዴል', 'Model', 'Moodeela')}</span>
                  <p className="font-medium">{machineryAttrs.model}</p>
                </div>
                {machineryAttrs.year && (
                  <div>
                    <span className="text-sm text-gray-600">{getLocalizedText('አመት', 'Year', 'Bara')}</span>
                    <p className="font-medium">{machineryAttrs.year}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('ሁኔታ', 'Condition', 'Haala')}</span>
                  <p className="font-medium">
                    {machineryAttrs.condition === 'new' ? getLocalizedText('አዲስ', 'New', 'Haaraa') :
                     machineryAttrs.condition === 'excellent' ? getLocalizedText('በጣም ጥሩ', 'Excellent', 'Baay\'ee Gaarii') :
                     machineryAttrs.condition === 'good' ? getLocalizedText('ጥሩ', 'Good', 'Gaarii') :
                     getLocalizedText('መካከለኛ', 'Fair', 'Giddugaleessa')}
                  </p>
                </div>
                {machineryAttrs.capacity && (
                  <div>
                    <span className="text-sm text-gray-600">{getLocalizedText('አቅም', 'Capacity', 'Dandeettii')}</span>
                    <p className="font-medium">{machineryAttrs.capacity}</p>
                  </div>
                )}
              </div>

              {machineryAttrs.warranty && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">
                      {getLocalizedText('ዋስትና አለው', 'Warranty Available', 'Waadaa Jira')}
                    </span>
                  </div>
                  {machineryAttrs.warrantyPeriod && (
                    <p className="text-green-800">{machineryAttrs.warrantyPeriod}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'feed':
        const feedAttrs = attributes as FeedAttributes;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌾 {getLocalizedText('የመኖ መረጃ', 'Feed Information', 'Odeeffannoo Nyaataa')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('የመኖ ዓይነት', 'Feed Type', 'Gosa Nyaataa')}</span>
                  <p className="font-medium">{feedAttrs.feedType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('መጠን', 'Quantity', 'Hamma')}</span>
                  <p className="font-medium">{feedAttrs.quantity} {getLocalizedText('ኪግ', 'kg', 'kg')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('ማሸጊያ', 'Packaging', 'Maxxansaa')}</span>
                  <p className="font-medium">
                    {feedAttrs.packaging === 'bag' ? getLocalizedText('ከረጢት', 'Bag', 'Korojoo') :
                     feedAttrs.packaging === 'bulk' ? getLocalizedText('በጅምላ', 'Bulk', 'Baay\'inaan') :
                     getLocalizedText('ጥቅል', 'Bale', 'Hidhaa')}
                  </p>
                </div>
                {feedAttrs.expiryDate && (
                  <div>
                    <span className="text-sm text-gray-600">{getLocalizedText('የማለፊያ ቀን', 'Expiry Date', 'Guyyaa Dhumaa')}</span>
                    <p className="font-medium">{new Date(feedAttrs.expiryDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {feedAttrs.organicCertified && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">
                      {getLocalizedText('ኦርጋኒክ የተረጋገጠ', 'Organic Certified', 'Orgaanikii Mirkaneeffame')}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'vet_supplies':
        const vetAttrs = attributes as VetSuppliesAttributes;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💊 {getLocalizedText('የመድሃኒት መረጃ', 'Medicine Information', 'Odeeffannoo Qorichaa')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('ዓይነት', 'Type', 'Gosa')}</span>
                  <p className="font-medium">
                    {vetAttrs.supplyType === 'medicine' ? getLocalizedText('መድሃኒት', 'Medicine', 'Qoricha') :
                     vetAttrs.supplyType === 'vaccine' ? getLocalizedText('ክትባት', 'Vaccine', 'Tallaa') :
                     vetAttrs.supplyType === 'supplement' ? getLocalizedText('ተጨማሪ', 'Supplement', 'Dabalataa') :
                     getLocalizedText('መሳሪያ', 'Equipment', 'Meeshaa')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('የምርት ስም', 'Product Name', 'Maqaa Oomishaa')}</span>
                  <p className="font-medium">{vetAttrs.productName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('መጠን', 'Quantity', 'Hamma')}</span>
                  <p className="font-medium">{vetAttrs.quantity} {vetAttrs.unit}</p>
                </div>
                {vetAttrs.expiryDate && (
                  <div>
                    <span className="text-sm text-gray-600">{getLocalizedText('የማለፊያ ቀን', 'Expiry Date', 'Guyyaa Dhumaa')}</span>
                    <p className="font-medium">{new Date(vetAttrs.expiryDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {vetAttrs.dosageInstructions && (
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('የአጠቃቀም መመሪያ', 'Usage Instructions', 'Qajeelfama Itti Fayyadamuu')}</span>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">{vetAttrs.dosageInstructions}</p>
                </div>
              )}

              {vetAttrs.prescriptionRequired && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">
                      {getLocalizedText('የሐኪም ማዘዣ ያስፈልጋል', 'Prescription Required', 'Ajaja Hakiimaa Barbaachisa')}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'accessories':
        const accessoryAttrs = attributes as AccessoriesAttributes;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📦 {getLocalizedText('የምርት መረጃ', 'Product Information', 'Odeeffannoo Oomishaa')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">{getLocalizedText('የምርት ዓይነት', 'Product Type', 'Gosa Oomishaa')}</span>
                  <p className="font-medium">{accessoryAttrs.productType}</p>
                </div>
                {accessoryAttrs.material && (
                  <div>
                    <span className="text-sm text-gray-600">{getLocalizedText('ቁሳቁስ', 'Material', 'Meeshaa')}</span>
                    <p className="font-medium">{accessoryAttrs.material}</p>
                  </div>
                )}
                {accessoryAttrs.size && (
                  <div>
                    <span className="text-sm text-gray-600">{getLocalizedText('መጠን', 'Size', 'Hamma')}</span>
                    <p className="font-medium">{accessoryAttrs.size}</p>
                  </div>
                )}
                {accessoryAttrs.color && (
                  <div>
                    <span className="text-sm text-gray-600">{getLocalizedText('ቀለም', 'Color', 'Halluu')}</span>
                    <p className="font-medium">{accessoryAttrs.color}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <ResponsiveNavigation>
        <PageLayout maxWidth="4xl" padding="md">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{getLocalizedText('እየተጫነ...', 'Loading...', 'Fe\'aa jira...')}</p>
          </div>
        </PageLayout>
      </ResponsiveNavigation>
    );
  }

  if (!listing) {
    return (
      <ResponsiveNavigation>
        <PageLayout maxWidth="4xl" padding="md">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {getLocalizedText('ዝርዝር አልተገኘም', 'Listing not found', 'Tarreeffamni hin argamne')}
            </h3>
            <Button onClick={() => router.push('/marketplace')}>
              {getLocalizedText('ወደ ገበያ ተመለስ', 'Back to Marketplace', 'Gara Gabaatti Deebi\'i')}
            </Button>
          </div>
        </PageLayout>
      </ResponsiveNavigation>
    );
  }

  const categoryConfig = CATEGORY_CONFIGS[listing.category];
  const verificationConfig = VERIFICATION_CONFIGS[listing.verificationTier];

  return (
    <ResponsiveNavigation>
      <PageLayout maxWidth="6xl" padding="md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {getLocalizedText('ተመለስ', 'Back', 'Deebi\'i')}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryConfig.emoji}</span>
            <Badge variant="outline">{categoryConfig.name}</Badge>
            <Badge variant={verificationConfig.color as any}>
              {verificationConfig.badge}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={listing.media[selectedImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={handleLike}>
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{viewCount}</span>
                  </div>
                </div>
                {listing.media.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {listing.media.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${listing.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Title and Description */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
                
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.location}, {listing.region}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {listing.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category-specific Information */}
            {renderCategorySpecificInfo()}
          </div>

          {/* Right Column - Price and Seller */}
          <div className="space-y-6">
            {/* Price and Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {listing.price.toLocaleString()} ብር
                </div>
                {listing.negotiable && (
                  <p className="text-sm text-gray-500 mb-4">
                    {getLocalizedText('ዋጋ ሊደራደር ይችላል', 'Price negotiable', 'Gatiin mari\'atamuu danda\'a')}
                  </p>
                )}

                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleContact('phone')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {getLocalizedText('ደውል', 'Call Now', 'Amma Bilbili')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleContact('message')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {getLocalizedText('መልዕክት ላክ', 'Send Message', 'Ergaa Ergi')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {getLocalizedText('ሻጭ መረጃ', 'Seller Information', 'Odeeffannoo Gurgurtuu')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{seller.name}</span>
                      {seller.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{seller.rating}</span>
                      <span>•</span>
                      <span>{seller.totalListings} {getLocalizedText('ዝርዝሮች', 'listings', 'tarreeffamtoota')}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{getLocalizedText('አካባቢ', 'Location', 'Bakka')}</span>
                    <span>{seller.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{getLocalizedText('የመልስ ጊዜ', 'Response Time', 'Yeroo Deebii')}</span>
                    <span>{seller.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{getLocalizedText('ተቀላቅሏል', 'Joined', 'Makame')}</span>
                    <span>{seller.joinedDate.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 text-xs">
                  {seller.languages.map(lang => (
                    <Badge key={lang} variant="secondary">{lang}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {getLocalizedText('የደህንነት ምክሮች', 'Safety Tips', 'Gorsa Nageenya')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• {getLocalizedText('በአካል ተገናኝተው ይመልከቱ', 'Meet in person to inspect', 'Bakka tokkotti wal arganii qoradha')}</p>
                <p>• {getLocalizedText('ከመክፈል በፊት ያረጋግጡ', 'Verify before payment', 'Osoo hin kaffalin dura mirkaneessi')}</p>
                <p>• {getLocalizedText('ጥርጣሬ ካለዎት ያሳውቁን', 'Report if suspicious', 'Shakkii yoo qabaattan nutti himaa')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    </ResponsiveNavigation>
  );
}

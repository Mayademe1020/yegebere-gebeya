// Extended marketplace types to support multiple categories

export type ListingCategory = 'livestock' | 'machinery' | 'equipment' | 'feed' | 'vet_supplies' | 'accessories';

export type VerificationTier = 'free' | 'video' | 'vet' | 'dealer' | 'lab' | 'mechanic';

export interface BaseListing {
  id: string;
  userId: string;
  category: ListingCategory;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  location: string;
  region: string;
  media: string[];
  verificationTier: VerificationTier;
  attributes: Record<string, any>;
  status: 'active' | 'sold' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Category-specific attribute interfaces
export interface LivestockAttributes {
  species: string;
  breed: string;
  age: number; // in months
  gender: 'male' | 'female' | 'mixed';
  weight?: number;
  healthStatus: string;
  vaccinated: boolean;
  pregnant?: boolean;
  milkProduction?: number; // liters per day
  fromBarn?: boolean; // if created from digital barn
  animalId?: string; // reference to barn animal
}

export interface MachineryAttributes {
  type: string; // tractor, harvester, etc.
  brand: string;
  model: string;
  year?: number;
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  capacity?: string; // horsepower, capacity, etc.
  warranty?: boolean;
  warrantyPeriod?: string;
  specifications?: Record<string, string>;
}

export interface FeedAttributes {
  feedType: string; // cattle feed, poultry feed, etc.
  quantity: number; // in kg
  packaging: string; // bag, bulk, etc.
  expiryDate?: Date;
  nutritionalInfo?: Record<string, string>;
  organicCertified?: boolean;
}

export interface VetSuppliesAttributes {
  supplyType: 'medicine' | 'vaccine' | 'supplement' | 'equipment';
  productName: string;
  quantity: number;
  unit: string; // ml, tablets, doses, etc.
  expiryDate?: Date;
  dosageInstructions?: string;
  targetAnimals?: string[]; // cattle, goats, etc.
  prescriptionRequired?: boolean;
}

export interface AccessoriesAttributes {
  productType: string;
  material?: string;
  size?: string;
  color?: string;
  specifications?: Record<string, string>;
}

// Union type for all listing types
export type Listing = BaseListing & {
  attributes: LivestockAttributes | MachineryAttributes | FeedAttributes | VetSuppliesAttributes | AccessoriesAttributes;
};

// Form data interfaces for creation
export interface ListingFormData {
  category: ListingCategory;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  location: string;
  region: string;
  media: File[];
  verificationTier: VerificationTier;
  attributes: Record<string, any>;
}

// Search and filter interfaces
export interface ListingFilters {
  category?: ListingCategory;
  region?: string;
  priceMin?: number;
  priceMax?: number;
  verificationTier?: VerificationTier;
  attributes?: Record<string, any>;
}

export interface ListingSearchParams {
  query?: string;
  filters?: ListingFilters;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular';
  page?: number;
  limit?: number;
}

// Category configuration
export interface CategoryConfig {
  id: ListingCategory;
  name: string;
  nameEn: string;
  nameOr: string;
  icon: string;
  emoji: string;
  verificationTiers: VerificationTier[];
  requiredFields: string[];
  optionalFields: string[];
}

export const CATEGORY_CONFIGS: Record<ListingCategory, CategoryConfig> = {
  livestock: {
    id: 'livestock',
    name: 'እንስሳት',
    nameEn: 'Livestock',
    nameOr: 'Bineensota',
    icon: 'Beef',
    emoji: '🐄',
    verificationTiers: ['free', 'video', 'vet'],
    requiredFields: ['species', 'breed', 'age', 'gender', 'healthStatus'],
    optionalFields: ['weight', 'pregnant', 'milkProduction', 'vaccinated']
  },
  machinery: {
    id: 'machinery',
    name: 'ማሽነሪ',
    nameEn: 'Machinery',
    nameOr: 'Maashinarii',
    icon: 'Wrench',
    emoji: '🚜',
    verificationTiers: ['free', 'dealer', 'mechanic'],
    requiredFields: ['type', 'brand', 'model', 'condition'],
    optionalFields: ['year', 'capacity', 'warranty', 'specifications']
  },
  equipment: {
    id: 'equipment',
    name: 'መሳሪያዎች',
    nameEn: 'Equipment',
    nameOr: 'Meeshaalee',
    icon: 'Settings',
    emoji: '🔧',
    verificationTiers: ['free', 'dealer', 'mechanic'],
    requiredFields: ['type', 'brand', 'condition'],
    optionalFields: ['model', 'year', 'warranty', 'specifications']
  },
  feed: {
    id: 'feed',
    name: 'መኖ',
    nameEn: 'Feed & Fodder',
    nameOr: 'Nyaata',
    icon: 'Wheat',
    emoji: '🌾',
    verificationTiers: ['free', 'lab'],
    requiredFields: ['feedType', 'quantity', 'packaging'],
    optionalFields: ['expiryDate', 'nutritionalInfo', 'organicCertified']
  },
  vet_supplies: {
    id: 'vet_supplies',
    name: 'የእንስሳት ሐኪም መድሃኒት',
    nameEn: 'Veterinary Supplies',
    nameOr: 'Qoricha Bineensaa',
    icon: 'Stethoscope',
    emoji: '💊',
    verificationTiers: ['free', 'vet', 'lab'],
    requiredFields: ['supplyType', 'productName', 'quantity', 'unit'],
    optionalFields: ['expiryDate', 'dosageInstructions', 'targetAnimals']
  },
  accessories: {
    id: 'accessories',
    name: 'ተጨማሪ እቃዎች',
    nameEn: 'Accessories & Other',
    nameOr: 'Miidhaagina',
    icon: 'Package',
    emoji: '📦',
    verificationTiers: ['free'],
    requiredFields: ['productType'],
    optionalFields: ['material', 'size', 'color', 'specifications']
  }
};

// Verification tier configurations
export interface VerificationConfig {
  id: VerificationTier;
  name: string;
  nameEn: string;
  nameOr: string;
  description: string;
  descriptionEn: string;
  descriptionOr: string;
  cost: number; // in ETB
  duration: number; // in hours
  requirements: string[];
  badge: string;
  color: string;
}

export const VERIFICATION_CONFIGS: Record<VerificationTier, VerificationConfig> = {
  free: {
    id: 'free',
    name: 'ነፃ',
    nameEn: 'Free',
    nameOr: 'Bilisaa',
    description: 'መሰረታዊ ዝርዝር',
    descriptionEn: 'Basic listing',
    descriptionOr: 'Tarreeffama bu\'uuraa',
    cost: 0,
    duration: 0,
    requirements: [],
    badge: 'Free',
    color: 'gray'
  },
  video: {
    id: 'video',
    name: 'ቪዲዮ የተረጋገጠ',
    nameEn: 'Video Verified',
    nameOr: 'Viidiyoon Mirkaneeffame',
    description: 'የቪዲዮ ማረጋገጫ ያለው',
    descriptionEn: 'Verified with video proof',
    descriptionOr: 'Viidiyoon ragaa qabu',
    cost: 50,
    duration: 24,
    requirements: ['Upload clear video', 'Show animal/product clearly'],
    badge: 'Video ✓',
    color: 'blue'
  },
  vet: {
    id: 'vet',
    name: 'ሐኪም የተረጋገጠ',
    nameEn: 'Vet Verified',
    nameOr: 'Hakiimaan Mirkaneeffame',
    description: 'የእንስሳት ሐኪም ማረጋገጫ',
    descriptionEn: 'Verified by veterinarian',
    descriptionOr: 'Hakiima bineensaatiin mirkaneeffame',
    cost: 200,
    duration: 72,
    requirements: ['Veterinary inspection', 'Health certificate'],
    badge: 'Vet ✓',
    color: 'green'
  },
  dealer: {
    id: 'dealer',
    name: 'ነጋዴ የተረጋገጠ',
    nameEn: 'Dealer Verified',
    nameOr: 'Daldalaan Mirkaneeffame',
    description: 'የተረጋገጠ ነጋዴ',
    descriptionEn: 'Verified dealer/seller',
    descriptionOr: 'Daldalaa mirkaneeffame',
    cost: 100,
    duration: 48,
    requirements: ['Business license', 'Dealer certification'],
    badge: 'Dealer ✓',
    color: 'purple'
  },
  lab: {
    id: 'lab',
    name: 'ላቦራቶሪ የተረጋገጠ',
    nameEn: 'Lab Verified',
    nameOr: 'Laabiin Mirkaneeffame',
    description: 'የላቦራቶሪ ምርመራ',
    descriptionEn: 'Laboratory tested and verified',
    descriptionOr: 'Laabiin qoratamee mirkaneeffame',
    cost: 150,
    duration: 96,
    requirements: ['Lab test results', 'Quality certificate'],
    badge: 'Lab ✓',
    color: 'orange'
  },
  mechanic: {
    id: 'mechanic',
    name: 'ሜካኒክ የተረጋገጠ',
    nameEn: 'Mechanic Verified',
    nameOr: 'Meekaaniikiin Mirkaneeffame',
    description: 'የሜካኒክ ምርመራ',
    descriptionEn: 'Inspected by certified mechanic',
    descriptionOr: 'Meekaaniikii ragaa qabuun qoratame',
    cost: 120,
    duration: 48,
    requirements: ['Mechanical inspection', 'Condition report'],
    badge: 'Mechanic ✓',
    color: 'indigo'
  }
};

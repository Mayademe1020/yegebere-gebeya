// Digital Barn Type Definitions
// Built with mobile-first UX and Ethiopian cultural context in mind

export interface Animal {
  id: string; // Unique animal ID: [UserInitials]-[Type]-[SeqNum]-[EthiopianDate]
  userId: string;
  
  // Mandatory fields
  photos: string[]; // At least one photo required
  type: AnimalType;
  
  // Optional fields
  sex?: 'male' | 'female';
  age?: number; // in months
  breed?: string;
  isPregnant?: boolean; // Only for female animals
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'sold' | 'deceased' | 'transferred';
}

export interface MilkRecord {
  id: string;
  animalId: string;
  userId: string;
  
  // Mandatory fields
  date: Date; // Ethiopian calendar date
  liters: number;
  
  // Optional fields
  priceSold?: number; // in ETB
  notes?: string;
  
  createdAt: Date;
}

export interface HealthRecord {
  id: string;
  animalId: string;
  userId: string;
  
  // Mandatory fields
  recordType: HealthRecordType;
  date: Date; // Ethiopian calendar date
  
  // Optional fields
  notes?: string;
  nextDueDate?: Date; // For reminders
  cost?: number; // in ETB
  veterinarian?: string;
  
  createdAt: Date;
}

export type AnimalType = 'cattle' | 'goat' | 'sheep' | 'poultry';

export type HealthRecordType = 
  | 'vaccination'
  | 'deworming' 
  | 'treatment'
  | 'checkup'
  | 'breeding'
  | 'calving'
  | 'other';

// UI State types for better UX
export interface AnimalCardData {
  id: string;
  animalId: string;
  mainPhoto: string;
  type: AnimalType;
  sex?: 'male' | 'female';
  age?: number;
  status: string; // e.g., "Pregnant", "Milking", "Healthy"
  lastMilkRecord?: {
    date: Date;
    liters: number;
  };
  nextHealthDue?: {
    type: string;
    date: Date;
  };
}

// Form types for better validation
export interface AnimalRegistrationForm {
  photos: File[];
  type: AnimalType;
  sex?: 'male' | 'female';
  age?: number;
  breed?: string;
  isPregnant?: boolean;
}

export interface MilkRecordForm {
  date: Date;
  liters: number;
  priceSold?: number;
  notes?: string;
}

export interface HealthRecordForm {
  recordType: HealthRecordType;
  date: Date;
  notes?: string;
  nextDueDate?: Date;
  cost?: number;
  veterinarian?: string;
}

// Analytics types for farmer insights
export interface AnimalAnalytics {
  totalAnimals: number;
  animalsByType: Record<AnimalType, number>;
  totalMilkThisMonth: number;
  averageDailyMilk: number;
  upcomingHealthReminders: number;
  pregnantAnimals: number;
}

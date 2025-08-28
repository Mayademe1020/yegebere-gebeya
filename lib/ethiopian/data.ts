// Ethiopian Regions, Zones, and Woredas data
export const ETHIOPIAN_REGIONS = [
  { id: 'addis-ababa', name: 'Addis Ababa', nameAmharic: 'አዲስ አበባ', nameOromo: 'Finfinnee' },
  { id: 'afar', name: 'Afar', nameAmharic: 'አፋር', nameOromo: 'Afar' },
  { id: 'amhara', name: 'Amhara', nameAmharic: 'አማራ', nameOromo: 'Amaaraa' },
  { id: 'benishangul-gumuz', name: 'Benishangul-Gumuz', nameAmharic: 'ቤንሻንጉል ጉሙዝ', nameOromo: 'Benishangul-Gumuz' },
  { id: 'dire-dawa', name: 'Dire Dawa', nameAmharic: 'ድሬዳዋ', nameOromo: 'Dire Dhawaa' },
  { id: 'gambela', name: 'Gambela', nameAmharic: 'ጋምቤላ', nameOromo: 'Gambellaa' },
  { id: 'harari', name: 'Harari', nameAmharic: 'ሐረሪ', nameOromo: 'Hararii' },
  { id: 'oromia', name: 'Oromia', nameAmharic: 'ኦሮሚያ', nameOromo: 'Oromiyaa' },
  { id: 'sidama', name: 'Sidama', nameAmharic: 'ሲዳማ', nameOromo: 'Sidaamaa' },
  { id: 'snnp', name: 'SNNP', nameAmharic: 'ደቡብ ብሔሮች', nameOromo: 'SNNP' },
  { id: 'somali', name: 'Somali', nameAmharic: 'ሶማሌ', nameOromo: 'Somaalee' },
  { id: 'tigray', name: 'Tigray', nameAmharic: 'ትግራይ', nameOromo: 'Tigray' },
];

// Common Ethiopian livestock breeds
export const ETHIOPIAN_BREEDS = {
  cattle: [
    { id: 'zebu', name: 'Local Zebu', nameAmharic: 'የአገር ላም', nameOromo: 'Loon Biyyaa' },
    { id: 'boran', name: 'Boran', nameAmharic: 'ቦራን', nameOromo: 'Booranaa' },
    { id: 'horro', name: 'Horro', nameAmharic: 'ሆሮ', nameOromo: 'Horroo' },
    { id: 'holstein', name: 'Holstein Friesian', nameAmharic: 'ሆልስታይን', nameOromo: 'Holstein' },
    { id: 'jersey', name: 'Jersey', nameAmharic: 'ጀርሲ', nameOromo: 'Jersey' },
    { id: 'cross', name: 'Cross Breed', nameAmharic: 'ድቅል', nameOromo: 'Makaa' },
  ],
  goat: [
    { id: 'boer', name: 'Boer', nameAmharic: 'ቦር', nameOromo: 'Boer' },
    { id: 'somali', name: 'Somali', nameAmharic: 'ሶማሌ', nameOromo: 'Somaalee' },
    { id: 'arsi-bale', name: 'Arsi-Bale', nameAmharic: 'አርሲ-ባሌ', nameOromo: 'Arsii-Baalee' },
    { id: 'woyto-guji', name: 'Woyto-Guji', nameAmharic: 'ወይቶ-ጉጂ', nameOromo: 'Woyto-Gujii' },
    { id: 'local', name: 'Local Goat', nameAmharic: 'የአገር ፍየል', nameOromo: 'Re\'ee Biyyaa' },
  ],
  sheep: [
    { id: 'blackhead-somali', name: 'Blackhead Somali', nameAmharic: 'ጥቁር ራስ ሶማሌ', nameOromo: 'Somaalee Mataa Gurraacha' },
    { id: 'afar', name: 'Afar', nameAmharic: 'አፋር', nameOromo: 'Afar' },
    { id: 'arsi-bale', name: 'Arsi-Bale', nameAmharic: 'አርሲ-ባሌ', nameOromo: 'Arsii-Baalee' },
    { id: 'menz', name: 'Menz', nameAmharic: 'መንዝ', nameOromo: 'Menz' },
    { id: 'local', name: 'Local Sheep', nameAmharic: 'የአገር በግ', nameOromo: 'Hoolaa Biyyaa' },
  ],
  poultry: [
    { id: 'local-chicken', name: 'Local Chicken', nameAmharic: 'የአገር ዶሮ', nameOromo: 'Lukuu Biyyaa' },
    { id: 'improved-chicken', name: 'Improved Chicken', nameAmharic: 'የተሻሻለ ዶሮ', nameOromo: 'Lukuu Fooyya\'aa' },
    { id: 'broiler', name: 'Broiler', nameAmharic: 'ብሮይለር', nameOromo: 'Broiler' },
    { id: 'layer', name: 'Layer', nameAmharic: 'እንቁላል ዶሮ', nameOromo: 'Lukuu Hanqaaquu' },
    { id: 'duck', name: 'Duck', nameAmharic: 'ዳክዬ', nameOromo: 'Dakiyyee' },
  ],
};

// Animal categories for marketplace
export const ANIMAL_CATEGORIES = [
  { id: 'cattle', name: 'Cattle', nameAmharic: 'ላም', nameOromo: 'Loon', icon: '🐄' },
  { id: 'goat', name: 'Goat', nameAmharic: 'ፍየል', nameOromo: 'Re\'ee', icon: '🐐' },
  { id: 'sheep', name: 'Sheep', nameAmharic: 'በግ', nameOromo: 'Hoolaa', icon: '🐑' },
  { id: 'poultry', name: 'Poultry', nameAmharic: 'ዶሮ', nameOromo: 'Lukuu', icon: '🐔' },
  { id: 'feed', name: 'Feed', nameAmharic: 'መኖ', nameOromo: 'Nyaata', icon: '🌾' },
  { id: 'equipment', name: 'Equipment', nameAmharic: 'መሳሪያ', nameOromo: 'Meeshaa', icon: '🔧' },
];

// Health log types
export const HEALTH_LOG_TYPES = [
  { id: 'vaccination', name: 'Vaccination', nameAmharic: 'ክትባት', nameOromo: 'Tallaa' },
  { id: 'treatment', name: 'Treatment', nameAmharic: 'ሕክምና', nameOromo: 'Yaalii' },
  { id: 'checkup', name: 'Health Checkup', nameAmharic: 'የጤና ምርመራ', nameOromo: 'Qorannoo Fayyaa' },
  { id: 'feeding', name: 'Feeding', nameAmharic: 'መመገብ', nameOromo: 'Nyaachisuu' },
  { id: 'breeding', name: 'Breeding', nameAmharic: 'መራባት', nameOromo: 'Hormaata' },
  { id: 'deworming', name: 'Deworming', nameAmharic: 'የትል መድሃኒት', nameOromo: 'Qoricha Raammoo' },
];

// Consultation categories
export const CONSULTATION_CATEGORIES = [
  { id: 'health', name: 'Animal Health', nameAmharic: 'የእንስሳት ጤና', nameOromo: 'Fayyaa Bineensaa' },
  { id: 'breeding', name: 'Breeding', nameAmharic: 'መራባት', nameOromo: 'Hormaata' },
  { id: 'feeding', name: 'Feeding & Nutrition', nameAmharic: 'መመገብ እና አመጋገብ', nameOromo: 'Nyaachisuu fi Soorata' },
  { id: 'management', name: 'Farm Management', nameAmharic: 'የእርሻ አስተዳደር', nameOromo: 'Bulchiinsa Qonnaa' },
  { id: 'general', name: 'General Questions', nameAmharic: 'አጠቃላይ ጥያቄዎች', nameOromo: 'Gaaffilee Waliigalaa' },
];

// Daily tip categories
export const TIP_CATEGORIES = [
  { id: 'health', name: 'Health Tips', nameAmharic: 'የጤና ምክሮች', nameOromo: 'Gorsaa Fayyaa' },
  { id: 'feeding', name: 'Feeding Tips', nameAmharic: 'የመመገብ ምክሮች', nameOromo: 'Gorsaa Nyaachisuu' },
  { id: 'breeding', name: 'Breeding Tips', nameAmharic: 'የመራባት ምክሮች', nameOromo: 'Gorsaa Hormaata' },
  { id: 'management', name: 'Management Tips', nameAmharic: 'የአስተዳደር ምክሮች', nameOromo: 'Gorsaa Bulchiinsaa' },
  { id: 'market', name: 'Market Tips', nameAmharic: 'የገበያ ምክሮች', nameOromo: 'Gorsaa Gabaa' },
];

// Utility functions
export class EthiopianDataUtils {
  // Get localized name based on language
  static getLocalizedName(item: any, language: 'am' | 'or' | 'en' = 'am'): string {
    switch (language) {
      case 'am':
        return item.nameAmharic || item.name;
      case 'or':
        return item.nameOromo || item.name;
      default:
        return item.name;
    }
  }

  // Get breeds for a specific animal type
  static getBreedsForType(animalType: string): any[] {
    return ETHIOPIAN_BREEDS[animalType as keyof typeof ETHIOPIAN_BREEDS] || [];
  }

  // Generate user initials from name
  static generateUserInitials(name: string): string {
    if (!name) return 'UN'; // Unknown
    
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
  }

  // Format Ethiopian currency
  static formatETB(amount: number): string {
    return `${amount.toLocaleString()} Br`;
  }

  // Validate Ethiopian phone number formats
  static normalizePhoneInput(input: string): string {
    // Remove all non-digit characters
    let cleaned = input.replace(/\D/g, '');
    
    // Handle different input formats
    if (cleaned.startsWith('251')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('09') || cleaned.startsWith('07')) {
      return `+251${cleaned.substring(1)}`;
    } else if (cleaned.startsWith('9') || cleaned.startsWith('7')) {
      return `+251${cleaned}`;
    } else if (cleaned.length === 9) {
      return `+251${cleaned}`;
    }
    
    return input; // Return as-is if can't normalize
  }

  // Phone number utilities
  static normalizePhoneNumber(phoneNumber: string): string | null {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return null;
    }

    // Remove all non-digits
    let digits = phoneNumber.replace(/\D/g, '');

    // Handle different formats
    if (digits.startsWith('251')) {
      // Already has country code
      digits = digits.substring(3);
    } else if (digits.startsWith('0')) {
      // Remove leading zero
      digits = digits.substring(1);
    }

    // Validate Ethiopian mobile number format
    if (digits.length !== 9) {
      return null;
    }

    // Must start with 9 or 7
    if (!digits.startsWith('9') && !digits.startsWith('7')) {
      return null;
    }

    return `+251${digits}`;
  }

  static validateEthiopianPhone(phoneNumber: string): boolean {
    return this.normalizePhoneNumber(phoneNumber) !== null;
  }
}

import { Animal, AnimalType, HealthRecordType, AnimalCardData } from './types';
import { EthiopianCalendar } from '@/lib/ethiopian/calendar';

/**
 * Digital Barn Utilities
 * Built with Ethiopian cultural context and mobile-first UX
 */

export class DigitalBarnUtils {
  /**
   * Generate unique animal ID following Ethiopian naming conventions
   * Format: [UserInitials]-[Type]-[SeqNum]-[EthiopianDate]
   * Example: "AT-COW-001-2018-12-28"
   */
  static generateAnimalId(
    userName: string, 
    animalType: AnimalType, 
    sequenceNumber: number
  ): string {
    // Extract initials from user name
    const initials = userName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3);
    
    // Get current Ethiopian date
    const ethDate = EthiopianCalendar.getCurrentEthiopianDate();
    const ethDateStr = `${ethDate.year}-${ethDate.month.toString().padStart(2, '0')}-${ethDate.day.toString().padStart(2, '0')}`;
    
    // Format type
    const typeCode = animalType.toUpperCase().substring(0, 3);
    
    // Format sequence number
    const seqStr = sequenceNumber.toString().padStart(3, '0');
    
    return `${initials}-${typeCode}-${seqStr}-${ethDateStr}`;
  }

  /**
   * Get localized animal type name
   */
  static getAnimalTypeName(type: AnimalType, language: 'am' | 'or' | 'en' = 'am'): string {
    const names = {
      cattle: {
        am: 'ላም',
        or: 'Loon',
        en: 'Cattle'
      },
      goat: {
        am: 'ፍየል',
        or: 'Re\'ee',
        en: 'Goat'
      },
      sheep: {
        am: 'በግ',
        or: 'Hoolaa',
        en: 'Sheep'
      },
      poultry: {
        am: 'ዶሮ',
        or: 'Lukuu',
        en: 'Poultry'
      }
    };
    
    return names[type][language];
  }

  /**
   * Get localized health record type name
   */
  static getHealthRecordTypeName(type: HealthRecordType, language: 'am' | 'or' | 'en' = 'am'): string {
    const names = {
      vaccination: {
        am: 'ክትባት',
        or: 'Tallaa',
        en: 'Vaccination'
      },
      deworming: {
        am: 'የትል ማስወገጃ',
        or: 'Qurxummii',
        en: 'Deworming'
      },
      treatment: {
        am: 'ሕክምና',
        or: 'Yaalii',
        en: 'Treatment'
      },
      checkup: {
        am: 'ምርመራ',
        or: 'Qorannoo',
        en: 'Checkup'
      },
      breeding: {
        am: 'መራባት',
        or: 'Hormaata',
        en: 'Breeding'
      },
      calving: {
        am: 'ወሊድ',
        or: 'Dhala',
        en: 'Calving'
      },
      other: {
        am: 'ሌላ',
        or: 'Kan biraa',
        en: 'Other'
      }
    };
    
    return names[type][language];
  }

  /**
   * Get animal status for display (considering pregnancy, milk records, health)
   */
  static getAnimalStatus(
    animal: Animal, 
    lastMilkRecord?: { date: Date; liters: number },
    nextHealthDue?: { type: string; date: Date },
    language: 'am' | 'or' | 'en' = 'am'
  ): string {
    // Priority 1: Health reminders due
    if (nextHealthDue && nextHealthDue.date <= new Date()) {
      const statusNames = {
        am: `${nextHealthDue.type} ይፈለጋል`,
        or: `${nextHealthDue.type} barbaachisa`,
        en: `${nextHealthDue.type} Due`
      };
      return statusNames[language];
    }

    // Priority 2: Pregnancy status
    if (animal.sex === 'female' && animal.isPregnant) {
      const statusNames = {
        am: 'እርጉዝ',
        or: 'Ulfaa\'aa',
        en: 'Pregnant'
      };
      return statusNames[language];
    }

    // Priority 3: Milking status (if dairy animal with recent milk record)
    if (animal.type === 'cattle' && animal.sex === 'female' && lastMilkRecord) {
      const daysSinceLastMilk = Math.floor((new Date().getTime() - lastMilkRecord.date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastMilk <= 1) {
        const statusNames = {
          am: 'ወተት ይሰጣል',
          or: 'Aannan kenna',
          en: 'Milking'
        };
        return statusNames[language];
      }
    }

    // Default: Healthy status
    const statusNames = {
      am: 'ጤናማ',
      or: 'Fayyaa',
      en: 'Healthy'
    };
    return statusNames[language];
  }

  /**
   * Calculate animal age in a user-friendly format
   */
  static formatAnimalAge(ageInMonths: number, language: 'am' | 'or' | 'en' = 'am'): string {
    if (ageInMonths < 12) {
      const monthNames = {
        am: ageInMonths === 1 ? 'ወር' : 'ወራት',
        or: ageInMonths === 1 ? 'ji\'a' : 'ji\'oota',
        en: ageInMonths === 1 ? 'month' : 'months'
      };
      return `${ageInMonths} ${monthNames[language]}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const remainingMonths = ageInMonths % 12;
      
      const yearNames = {
        am: years === 1 ? 'አመት' : 'አመታት',
        or: years === 1 ? 'waggaa' : 'waggaalee',
        en: years === 1 ? 'year' : 'years'
      };
      
      if (remainingMonths === 0) {
        return `${years} ${yearNames[language]}`;
      } else {
        const monthNames = {
          am: remainingMonths === 1 ? 'ወር' : 'ወራት',
          or: remainingMonths === 1 ? 'ji\'a' : 'ji\'oota',
          en: remainingMonths === 1 ? 'month' : 'months'
        };
        return `${years} ${yearNames[language]} ${remainingMonths} ${monthNames[language]}`;
      }
    }
  }

  /**
   * Get animal emoji for visual appeal
   */
  static getAnimalEmoji(type: AnimalType): string {
    const emojis = {
      cattle: '🐄',
      goat: '🐐',
      sheep: '🐑',
      poultry: '🐔'
    };
    return emojis[type];
  }

  /**
   * Get health record type emoji
   */
  static getHealthRecordEmoji(type: HealthRecordType): string {
    const emojis = {
      vaccination: '💉',
      deworming: '💊',
      treatment: '🏥',
      checkup: '🔍',
      breeding: '💕',
      calving: '🍼',
      other: '📝'
    };
    return emojis[type];
  }

  /**
   * Validate animal registration form
   */
  static validateAnimalRegistration(data: {
    photos: File[];
    type: AnimalType;
    sex?: 'male' | 'female';
    age?: number;
    breed?: string;
    isPregnant?: boolean;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate photos
//     if (!data.photos || data.photos.length === 0) {
//       errors.push('At least one photo is required');
//     }

    // Validate type
    if (!data.type) {
      errors.push('Animal type is required');
    }

    // Validate age if provided
    if (data.age !== undefined && (data.age < 0 || data.age > 300)) {
      errors.push('Age must be between 0 and 300 months');
    }

    // Validate pregnancy (only for females)
    if (data.isPregnant && data.sex !== 'female') {
      errors.push('Only female animals can be pregnant');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format milk production for display
   */
  static formatMilkProduction(liters: number, language: 'am' | 'or' | 'en' = 'am'): string {
    const unitNames = {
      am: 'ሊትር',
      or: 'Liitira',
      en: 'L'
    };
    
    return `${liters.toFixed(1)} ${unitNames[language]}`;
  }

  /**
   * Calculate days until next health reminder
   */
  static getDaysUntilHealthReminder(nextDueDate: Date): number {
    const today = new Date();
    const diffTime = nextDueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get priority color for health reminders
   */
  static getHealthReminderPriority(daysUntil: number): 'high' | 'medium' | 'low' {
    if (daysUntil <= 0) return 'high';
    if (daysUntil <= 7) return 'medium';
    return 'low';
  }

  /**
   * Transform animal data for card display (optimized for mobile)
   */
  static transformToCardData(
    animal: Animal,
    lastMilkRecord?: { date: Date; liters: number },
    nextHealthDue?: { type: string; date: Date },
    language: 'am' | 'or' | 'en' = 'am'
  ): AnimalCardData {
    return {
      id: animal.id,
      animalId: animal.id,
      mainPhoto: animal.photos[0] || '/placeholder-animal.jpg',
      type: animal.type,
      sex: animal.sex,
      age: animal.age,
      status: this.getAnimalStatus(animal, lastMilkRecord, nextHealthDue, language),
      lastMilkRecord,
      nextHealthDue
    };
  }
}

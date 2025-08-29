/**
 * Ethiopian Calendar Utilities
 * Handles conversion between Gregorian and Ethiopian calendars
 * Built for cultural authenticity and user trust
 */

export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  dayName: string;
}

export class EthiopianCalendar {
  // Ethiopian month names in Amharic
  private static readonly ETHIOPIAN_MONTHS_AM = [
    'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
    'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
  ];

  // Ethiopian month names in English
  private static readonly ETHIOPIAN_MONTHS_EN = [
    'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
    'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagumen'
  ];

  // Ethiopian day names in Amharic
  private static readonly ETHIOPIAN_DAYS_AM = [
    'እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'
  ];

  // Ethiopian day names in English
  private static readonly ETHIOPIAN_DAYS_EN = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  /**
   * Convert Gregorian date to Ethiopian date
   */
  static gregorianToEthiopian(gregorianDate: Date): EthiopianDate {
    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1; // JavaScript months are 0-indexed
    const day = gregorianDate.getDate();

    // Ethiopian calendar starts on September 11 (or 12 in leap years)
    let ethYear: number;
    let ethMonth: number;
    let ethDay: number;

    // Simplified conversion algorithm
    // Ethiopian New Year starts around September 11
    if (month >= 9 && (month > 9 || day >= 11)) {
      ethYear = year - 7; // Ethiopian calendar is about 7-8 years behind
    } else {
      ethYear = year - 8;
    }

    // Calculate Ethiopian month and day
    const startOfEthYear = new Date(year - (ethYear - year + 7), 8, 11); // Sept 11
    const daysDiff = Math.floor((gregorianDate.getTime() - startOfEthYear.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      // Previous Ethiopian year
      ethYear--;
      const prevYearStart = new Date(year - (ethYear - year + 7), 8, 11);
      const prevYearDiff = Math.floor((gregorianDate.getTime() - prevYearStart.getTime()) / (1000 * 60 * 60 * 24));
      ethMonth = Math.floor(prevYearDiff / 30) + 1;
      ethDay = (prevYearDiff % 30) + 1;
    } else {
      ethMonth = Math.floor(daysDiff / 30) + 1;
      ethDay = (daysDiff % 30) + 1;
    }

    // Handle edge cases
    if (ethMonth > 13) {
      ethMonth = 13;
      ethDay = Math.min(ethDay, 5); // Pagumen has only 5-6 days
    }
    if (ethMonth < 1) ethMonth = 1;
    if (ethDay < 1) ethDay = 1;
    if (ethDay > 30 && ethMonth <= 12) ethDay = 30;

    const monthName = this.ETHIOPIAN_MONTHS_AM[ethMonth - 1] || 'መስከረም';
    const dayName = this.ETHIOPIAN_DAYS_AM[gregorianDate.getDay()];

    return {
      year: ethYear,
      month: ethMonth,
      day: ethDay,
      monthName,
      dayName
    };
  }

  /**
   * Convert Ethiopian date to Gregorian date (approximate)
   */
  static ethiopianToGregorian(ethYear: number, ethMonth: number, ethDay: number): Date {
    // Approximate conversion - Ethiopian New Year is around Sept 11
    const gregorianYear = ethYear + 7; // Add 7-8 years
    const startDate = new Date(gregorianYear, 8, 11); // September 11
    
    const totalDays = (ethMonth - 1) * 30 + (ethDay - 1);
    const resultDate = new Date(startDate);
    resultDate.setDate(startDate.getDate() + totalDays);
    
    return resultDate;
  }

  /**
   * Get current Ethiopian date
   */
  static getCurrentEthiopianDate(): EthiopianDate {
    return this.gregorianToEthiopian(new Date());
  }

  /**
   * Format Ethiopian date for display
   */
  static formatEthiopianDate(
    ethDate: EthiopianDate, 
    language: 'am' | 'en' = 'am',
    format: 'short' | 'long' | 'full' = 'long'
  ): string {
    const months = language === 'am' ? this.ETHIOPIAN_MONTHS_AM : this.ETHIOPIAN_MONTHS_EN;
    const days = language === 'am' ? this.ETHIOPIAN_DAYS_AM : this.ETHIOPIAN_DAYS_EN;

    switch (format) {
      case 'short':
        return `${ethDate.day}/${ethDate.month}/${ethDate.year}`;
      
      case 'long':
        return `${ethDate.day} ${months[ethDate.month - 1]} ${ethDate.year}`;
      
      case 'full':
        return `${days[new Date().getDay()]}, ${ethDate.day} ${months[ethDate.month - 1]} ${ethDate.year}`;
      
      default:
        return `${ethDate.day} ${months[ethDate.month - 1]} ${ethDate.year}`;
    }
  }

  /**
   * Get Ethiopian month name
   */
  static getEthiopianMonthName(month: number, language: 'am' | 'en' = 'am'): string {
    const months = language === 'am' ? this.ETHIOPIAN_MONTHS_AM : this.ETHIOPIAN_MONTHS_EN;
    return months[month - 1] || months[0];
  }

  /**
   * Get Ethiopian day name
   */
  static getEthiopianDayName(dayOfWeek: number, language: 'am' | 'en' = 'am'): string {
    const days = language === 'am' ? this.ETHIOPIAN_DAYS_AM : this.ETHIOPIAN_DAYS_EN;
    return days[dayOfWeek] || days[0];
  }

  /**
   * Check if Ethiopian year is leap year
   */
  static isEthiopianLeapYear(ethYear: number): boolean {
    // Ethiopian leap year cycle is every 4 years, similar to Gregorian
    // but offset by the Ethiopian calendar system
    return (ethYear % 4) === 3;
  }

  /**
   * Get days in Ethiopian month
   */
  static getDaysInEthiopianMonth(ethYear: number, ethMonth: number): number {
    if (ethMonth <= 12) {
      return 30; // First 12 months have 30 days
    } else {
      // Pagumen (13th month)
      return this.isEthiopianLeapYear(ethYear) ? 6 : 5;
    }
  }

  /**
   * Get Ethiopian date input format for HTML date inputs
   */
  static toDateInputValue(ethDate: EthiopianDate): string {
    // Convert to Gregorian for HTML date input
    const gregorianDate = this.ethiopianToGregorian(ethDate.year, ethDate.month, ethDate.day);
    return gregorianDate.toISOString().split('T')[0];
  }

  /**
   * Parse HTML date input to Ethiopian date
   */
  static fromDateInputValue(dateString: string): EthiopianDate {
    const gregorianDate = new Date(dateString);
    return this.gregorianToEthiopian(gregorianDate);
  }

  /**
   * Get relative time in Ethiopian context
   */
  static getRelativeTime(date: Date, language: 'am' | 'en' = 'am'): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (language === 'am') {
      if (diffMinutes < 1) return 'አሁን';
      if (diffMinutes < 60) return `${diffMinutes} ደቂቃ በፊት`;
      if (diffHours < 24) return `${diffHours} ሰዓት በፊት`;
      if (diffDays === 1) return 'ትናንት';
      if (diffDays < 7) return `${diffDays} ቀን በፊት`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} ሳምንት በፊት`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} ወር በፊት`;
      return `${Math.floor(diffDays / 365)} አመት በፊት`;
    } else {
      if (diffMinutes < 1) return 'now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
      return `${Math.floor(diffDays / 365)}y ago`;
    }
  }

  /**
   * Format time for Ethiopian context (12-hour format is common)
   */
  static formatTime(date: Date, language: 'am' | 'en' = 'am'): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    if (language === 'am') {
      const ampmAm = hours >= 12 ? 'ከሰዓት' : 'ጠዋት';
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampmAm}`;
    } else {
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
  }

  /**
   * Get Ethiopian seasons (based on months)
   */
  static getEthiopianSeason(ethMonth: number, language: 'am' | 'en' = 'am'): string {
    if (language === 'am') {
      if (ethMonth >= 1 && ethMonth <= 2) return 'መስከረም'; // Autumn
      if (ethMonth >= 3 && ethMonth <= 5) return 'ክረምት'; // Winter/Dry season
      if (ethMonth >= 6 && ethMonth <= 8) return 'በልግ'; // Spring
      if (ethMonth >= 9 && ethMonth <= 12) return 'ክረምት'; // Summer/Rainy season
      return 'ጳጉሜን'; // Short month
    } else {
      if (ethMonth >= 1 && ethMonth <= 2) return 'Autumn';
      if (ethMonth >= 3 && ethMonth <= 5) return 'Dry Season';
      if (ethMonth >= 6 && ethMonth <= 8) return 'Spring';
      if (ethMonth >= 9 && ethMonth <= 12) return 'Rainy Season';
      return 'Pagumen';
    }
  }
}

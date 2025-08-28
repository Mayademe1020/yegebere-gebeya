// Ethiopian Calendar Utilities
export class EthiopianCalendar {
  private static readonly MONTHS_AM = [
    'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
    'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
  ];

  private static readonly MONTHS_EN = [
    'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
    'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagumen'
  ];

  // Convert Gregorian date to Ethiopian date
  static gregorianToEthiopian(gregorianDate: Date): { year: number; month: number; day: number } {
    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1;
    const day = gregorianDate.getDate();

    // Ethiopian calendar is approximately 7-8 years behind Gregorian
    // This is a simplified conversion - in production, use a proper library
    let ethYear = year - 7;
    let ethMonth = month + 4; // Approximate offset
    let ethDay = day;

    if (ethMonth > 13) {
      ethMonth -= 13;
      ethYear += 1;
    }

    if (ethMonth === 13 && ethDay > 5) {
      ethMonth = 1;
      ethYear += 1;
      ethDay -= 5;
    }

    return { year: ethYear, month: ethMonth, day: ethDay };
  }

  // Format Ethiopian date for display
  static formatEthiopianDate(ethDate: { year: number; month: number; day: number }, language: 'am' | 'en' = 'am'): string {
    const months = language === 'am' ? this.MONTHS_AM : this.MONTHS_EN;
    const monthName = months[ethDate.month - 1] || months[0];
    
    if (language === 'am') {
      return `${ethDate.day} ${monthName} ${ethDate.year}`;
    } else {
      return `${monthName} ${ethDate.day}, ${ethDate.year}`;
    }
  }

  // Generate animal ID with Ethiopian date
  static generateAnimalId(userInitials: string, animalType: string, sequence: number): string {
    const now = new Date();
    const ethDate = this.gregorianToEthiopian(now);
    const typeCode = animalType.substring(0, 2).toUpperCase();
    const seqStr = sequence.toString().padStart(3, '0');
    
    return `${userInitials}${typeCode}${seqStr}${ethDate.year}`;
  }

  // Get current Ethiopian date
  static getCurrentEthiopianDate(): { year: number; month: number; day: number } {
    return this.gregorianToEthiopian(new Date());
  }
}

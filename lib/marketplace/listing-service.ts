// Unified listing service for all marketplace categories

import { 
  Listing, 
  ListingFormData, 
  ListingSearchParams, 
  ListingCategory, 
  VerificationTier,
  CATEGORY_CONFIGS 
} from './types';

export class ListingService {
  private baseUrl = '/api/listings';

  // Create a new listing
  async createListing(data: ListingFormData): Promise<Listing> {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('category', data.category);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('negotiable', data.negotiable.toString());
    formData.append('location', data.location);
    formData.append('region', data.region);
    formData.append('verificationTier', data.verificationTier);
    formData.append('attributes', JSON.stringify(data.attributes));

    // Add media files
    data.media.forEach((file, index) => {
      formData.append(`media_${index}`, file);
    });

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create listing');
    }

    return response.json();
  }

  // Create listing from barn animal
  async createFromBarnAnimal(animalId: string, additionalData: Partial<ListingFormData>): Promise<Listing> {
    const response = await fetch(`${this.baseUrl}/from-barn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        animalId,
        ...additionalData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create listing from barn animal');
    }

    return response.json();
  }

  // Search and filter listings
  async searchListings(params: ListingSearchParams): Promise<{
    listings: Listing[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('query', params.query);
    if (params.filters?.category) searchParams.append('category', params.filters.category);
    if (params.filters?.region) searchParams.append('region', params.filters.region);
    if (params.filters?.priceMin) searchParams.append('priceMin', params.filters.priceMin.toString());
    if (params.filters?.priceMax) searchParams.append('priceMax', params.filters.priceMax.toString());
    if (params.filters?.verificationTier) searchParams.append('verificationTier', params.filters.verificationTier);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    // Add attribute filters
    if (params.filters?.attributes) {
      Object.entries(params.filters.attributes).forEach(([key, value]) => {
        searchParams.append(`attr_${key}`, value.toString());
      });
    }

    const response = await fetch(`${this.baseUrl}/search?${searchParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to search listings');
    }

    return response.json();
  }

  // Get listing by ID
  async getListingById(id: string): Promise<Listing> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to get listing');
    }

    return response.json();
  }

  // Update listing
  async updateListing(id: string, data: Partial<ListingFormData>): Promise<Listing> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update listing');
    }

    return response.json();
  }

  // Delete listing
  async deleteListing(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete listing');
    }
  }

  // Get listings by user
  async getUserListings(userId: string): Promise<Listing[]> {
    const response = await fetch(`${this.baseUrl}/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get user listings');
    }

    return response.json();
  }

  // Get category statistics
  async getCategoryStats(): Promise<Record<ListingCategory, number>> {
    const response = await fetch(`${this.baseUrl}/stats/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to get category stats');
    }

    return response.json();
  }

  // Upload media for listing
  async uploadMedia(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload media');
    }

    const result = await response.json();
    return result.urls;
  }

  // Request verification
  async requestVerification(listingId: string, tier: VerificationTier): Promise<{
    success: boolean;
    cost: number;
    estimatedTime: number;
    requirements: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/${listingId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tier }),
    });

    if (!response.ok) {
      throw new Error('Failed to request verification');
    }

    return response.json();
  }

  // Get verification status
  async getVerificationStatus(listingId: string): Promise<{
    status: 'pending' | 'approved' | 'rejected' | 'none';
    tier: VerificationTier;
    submittedAt?: Date;
    completedAt?: Date;
    notes?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/${listingId}/verification-status`);
    
    if (!response.ok) {
      throw new Error('Failed to get verification status');
    }

    return response.json();
  }

  // Validate listing data based on category
  validateListingData(category: ListingCategory, attributes: Record<string, any>): {
    isValid: boolean;
    errors: string[];
  } {
    const config = CATEGORY_CONFIGS[category];
    const errors: string[] = [];

    // Check required fields
    config.requiredFields.forEach(field => {
      if (!attributes[field] || attributes[field] === '') {
        errors.push(`${field} is required for ${config.name} listings`);
      }
    });

    // Category-specific validations
    switch (category) {
      case 'livestock':
        if (attributes.age && (attributes.age < 0 || attributes.age > 300)) {
          errors.push('Age must be between 0 and 300 months');
        }
        if (attributes.weight && attributes.weight < 0) {
          errors.push('Weight must be positive');
        }
        break;

      case 'machinery':
      case 'equipment':
        if (attributes.year && (attributes.year < 1900 || attributes.year > new Date().getFullYear() + 1)) {
          errors.push('Year must be valid');
        }
        break;

      case 'feed':
        if (attributes.quantity && attributes.quantity <= 0) {
          errors.push('Quantity must be positive');
        }
        if (attributes.expiryDate && new Date(attributes.expiryDate) < new Date()) {
          errors.push('Expiry date cannot be in the past');
        }
        break;

      case 'vet_supplies':
        if (attributes.quantity && attributes.quantity <= 0) {
          errors.push('Quantity must be positive');
        }
        if (attributes.expiryDate && new Date(attributes.expiryDate) < new Date()) {
          errors.push('Expiry date cannot be in the past');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get default attributes for category
  getDefaultAttributes(category: ListingCategory): Record<string, any> {
    switch (category) {
      case 'livestock':
        return {
          species: '',
          breed: '',
          age: 0,
          gender: 'female',
          healthStatus: 'healthy',
          vaccinated: false,
          fromBarn: false
        };

      case 'machinery':
      case 'equipment':
        return {
          type: '',
          brand: '',
          model: '',
          condition: 'good',
          warranty: false
        };

      case 'feed':
        return {
          feedType: '',
          quantity: 0,
          packaging: 'bag',
          organicCertified: false
        };

      case 'vet_supplies':
        return {
          supplyType: 'medicine',
          productName: '',
          quantity: 0,
          unit: 'ml',
          prescriptionRequired: false
        };

      case 'accessories':
        return {
          productType: ''
        };

      default:
        return {};
    }
  }
}

// Export singleton instance
export const listingService = new ListingService();

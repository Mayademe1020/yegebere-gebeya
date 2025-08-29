'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Barn, Plus } from 'lucide-react';
import { ListingForm } from '@/components/marketplace/listing-form';
import { ListingFormData } from '@/lib/marketplace/types';
import { listingService } from '@/lib/marketplace/listing-service';

interface BarnAnimal {
  id: string;
  species: string;
  breed: string;
  age: number;
  photos: string[];
  description: string;
}

export default function CreateListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'choose-path' | 'select-animal' | 'create-form'>('choose-path');
  const [selectedAnimal, setSelectedAnimal] = useState<BarnAnimal | null>(null);
  const [barnAnimals, setBarnAnimals] = useState<BarnAnimal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check if coming from barn with specific animal
  useEffect(() => {
    const animalId = searchParams.get('fromBarn');
    if (animalId) {
      // Load specific animal and go directly to form
      loadBarnAnimal(animalId);
    }
  }, [searchParams]);

  const loadBarnAnimals = async () => {
    try {
      setIsLoading(true);
      // In production: fetch from /api/animals
      // For now, use mock data
      const mockAnimals: BarnAnimal[] = [
        {
          id: '1',
          species: 'ላም',
          breed: 'Holstein Cross',
          age: 24,
          photos: ['/api/placeholder/300/200'],
          description: 'ጤናማ የወተት ላም'
        },
        {
          id: '2',
          species: 'ፍየል',
          breed: 'Boer',
          age: 18,
          photos: ['/api/placeholder/300/200'],
          description: 'የተሻሻለ ዝርያ ፍየል'
        },
        {
          id: '3',
          species: 'በግ',
          breed: 'Menz',
          age: 12,
          photos: ['/api/placeholder/300/200'],
          description: 'የአገር በግ'
        }
      ];
      setBarnAnimals(mockAnimals);
    } catch (error) {
      console.error('Error loading barn animals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBarnAnimal = async (animalId: string) => {
    try {
      // In production: fetch from /api/animals/${animalId}
      const animal = barnAnimals.find(a => a.id === animalId) || {
        id: animalId,
        species: 'ላም',
        breed: 'Holstein Cross',
        age: 24,
        photos: ['/api/placeholder/300/200'],
        description: 'ጤናማ የወተት ላም'
      };
      setSelectedAnimal(animal);
      setStep('create-form');
    } catch (error) {
      console.error('Error loading barn animal:', error);
    }
  };

  const handleSubmitListing = async (data: ListingFormData) => {
    try {
      setIsLoading(true);
      
      let listing;
      if (selectedAnimal) {
        // Create from barn animal
        listing = await listingService.createFromBarnAnimal(selectedAnimal.id, data);
      } else {
        // Create new listing
        listing = await listingService.createListing(data);
      }

      // Redirect to listing detail or marketplace
      router.push(`/marketplace/listings/${listing.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const renderChoosePath = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">ዝርዝር ይፍጠሩ</h1>
        <p className="text-gray-600">እንስሳትዎን እና ምርቶችዎን በገበያ ላይ ያስቀምጡ</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* From My Barn */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          loadBarnAnimals();
          setStep('select-animal');
        }}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Barn className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>ከእኔ ጎተራ</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              በዲጂታል ጎተራዎ ውስጥ ያሉ እንስሳትን በቀላሉ ወደ ገበያ ያስቀምጡ
            </p>
            <Badge variant="secondary">ፈጣን እና ቀላል</Badge>
          </CardContent>
        </Card>

        {/* New Listing */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          setSelectedAnimal(null);
          setStep('create-form');
        }}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>አዲስ ዝርዝር</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              አዲስ እንስሳት፣ ማሽነሪ፣ መኖ ወይም መድሃኒት ዝርዝር ይፍጠሩ
            </p>
            <Badge variant="secondary">ሁሉንም ምድቦች ይደግፋል</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSelectAnimal = () => (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => setStep('choose-path')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          ተመለስ
        </Button>
        <div>
          <h1 className="text-2xl font-bold">ከጎተራ እንስሳ ይምረጡ</h1>
          <p className="text-gray-600">ለሽያጭ የሚያስቀምጡትን እንስሳ ይምረጡ</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">እንስሳት እየተጫኑ...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {barnAnimals.map(animal => (
            <Card 
              key={animal.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedAnimal(animal);
                setStep('create-form');
              }}
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={animal.photos[0] || '/api/placeholder/300/200'}
                  alt={`${animal.breed} ${animal.species}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">
                  {animal.breed} {animal.species}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {animal.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{animal.age} ወር</Badge>
                  <Button size="sm">ይምረጡ</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && barnAnimals.length === 0 && (
        <div className="text-center py-12">
          <Barn className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            በጎተራዎ ውስጥ እንስሳት የሉም
          </h3>
          <p className="text-gray-600 mb-4">
            መጀመሪያ እንስሳትን ወደ ዲጂታል ጎተራዎ ያክሉ
          </p>
          <Button onClick={() => router.push('/digital-barn')}>
            ወደ ዲጂታል ጎተራ ይሂዱ
          </Button>
        </div>
      )}
    </div>
  );

  const renderCreateForm = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => {
          if (selectedAnimal) {
            setStep('select-animal');
          } else {
            setStep('choose-path');
          }
        }}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          ተመለስ
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {selectedAnimal ? `${selectedAnimal.breed} ${selectedAnimal.species} ዝርዝር ይፍጠሩ` : 'አዲስ ዝርዝር ይፍጠሩ'}
          </h1>
          <p className="text-gray-600">
            {selectedAnimal ? 'የእንስሳቱን መረጃ ይሙሉ እና ዋጋ ያስቀምጡ' : 'ሙሉ መረጃ ይሙሉ እና ዝርዝርዎን ይፍጠሩ'}
          </p>
        </div>
      </div>

      <ListingForm
        onSubmit={handleSubmitListing}
        fromBarnAnimal={selectedAnimal ? {
          id: selectedAnimal.id,
          species: selectedAnimal.species,
          breed: selectedAnimal.breed,
          age: selectedAnimal.age,
          photos: selectedAnimal.photos
        } : undefined}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {step === 'choose-path' && renderChoosePath()}
      {step === 'select-animal' && renderSelectAnimal()}
      {step === 'create-form' && renderCreateForm()}
    </div>
  );
}

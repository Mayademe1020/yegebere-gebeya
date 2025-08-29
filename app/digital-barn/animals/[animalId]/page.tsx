"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Share2, 
  ShoppingCart,
  Calendar,
  Weight,
  Palette,
  Heart,
  Milk,
  Activity,
  AlertCircle,
  Camera,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { MobileOptimizedLayout, MobileCard, MobileHeader } from '@/components/layout/mobile-optimized-layout';
import { DigitalBarnUtils } from '@/lib/digital-barn/utils';
import { Animal } from '@/lib/digital-barn/types';
import { EthiopianCalendar } from '@/lib/ethiopian/calendar';

export default function AnimalProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { user, language } = useAuth();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const animalId = params.animalId as string;

  useEffect(() => {
    if (user && animalId) {
      fetchAnimal();
    }
  }, [user, animalId]);

  const fetchAnimal = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/animals/${animalId}?userId=${user?.id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch animal');
      }

      setAnimal(result.data);
    } catch (error) {
      console.error('Error fetching animal:', error);
      setError(error instanceof Error ? error.message : 'Failed to load animal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this animal?')) {
      return;
    }

    try {
      const response = await fetch(`/api/animals/${animalId}?userId=${user?.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete animal');
      }

      router.push('/digital-barn');
    } catch (error) {
      console.error('Error deleting animal:', error);
      alert('Failed to delete animal. Please try again.');
    }
  };

  const getLocalizedText = (amharic: string, english: string, oromo: string) => {
    return DigitalBarnUtils.getLocalizedText(amharic, english, oromo, language);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {getLocalizedText('እንስሳ በመጫን ላይ...', 'Loading animal...', 'Bineensa fe\'aa jira...')}
          </p>
        </div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {getLocalizedText('እንስሳ አልተገኘም', 'Animal Not Found', 'Bineensi hin argamne')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || getLocalizedText('የተጠየቀው እንስሳ አልተገኘም', 'The requested animal was not found', 'Bineensi gaafatame hin argamne')}
          </p>
          <Button onClick={() => router.push('/digital-barn')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {getLocalizedText('ወደ ዲጂታል ጎተራ', 'Back to Digital Barn', 'Gara Gotera Dijitaalaa')}
          </Button>
        </div>
      </div>
    );
  }

  const status = DigitalBarnUtils.calculateAnimalStatus(animal, language);
  const age = DigitalBarnUtils.formatAnimalAge(animal.ageInMonths || 0, language);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileHeader
        title={animal.name || animal.animalId}
        onBack={() => router.push('/digital-barn')}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => router.push(`/digital-barn/animals/${animalId}/edit`)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <MobileOptimizedLayout className="pt-16">
        {/* Animal Header */}
        <MobileCard padding="lg" className="mb-4">
          <div className="flex items-start gap-4">
            {/* Animal Photo */}
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
              {animal.photos && animal.photos.length > 0 ? (
                <img 
                  src={animal.photos[0]} 
                  alt={animal.name || animal.animalId}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="h-8 w-8 text-gray-400" />
              )}
            </div>

            {/* Animal Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {animal.name || animal.animalId}
                </h1>
                <Badge variant={status.variant as any} className="text-xs">
                  {status.text}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="font-medium">ID:</span>
                  <span className="font-mono">{animal.animalId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {getLocalizedText('አይነት:', 'Type:', 'Gosa:')}
                  </span>
                  <span>{DigitalBarnUtils.getAnimalTypeName(animal.type, language)}</span>
                </div>
                {animal.breed && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {getLocalizedText('ዝርያ:', 'Breed:', 'Gosa:')}
                    </span>
                    <span>{animal.breed}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getLocalizedText('እድሜ', 'Age', 'Umurii')}
                </div>
                <div className="font-medium">{age}</div>
              </div>
            </div>
            
            {animal.weight && (
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getLocalizedText('ክብደት', 'Weight', 'Ulfaatina')}
                  </div>
                  <div className="font-medium">{animal.weight} kg</div>
                </div>
              </div>
            )}

            {animal.sex && (
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getLocalizedText('ጾታ', 'Sex', 'Saala')}
                  </div>
                  <div className="font-medium">
                    {animal.sex === 'male' 
                      ? getLocalizedText('ወንድ', 'Male', 'Korma')
                      : getLocalizedText('ሴት', 'Female', 'Dhalaa')
                    }
                  </div>
                </div>
              </div>
            )}

            {animal.color && (
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getLocalizedText('ቀለም', 'Color', 'Halluu')}
                  </div>
                  <div className="font-medium">{animal.color}</div>
                </div>
              </div>
            )}
          </div>
        </MobileCard>

        {/* Quick Actions */}
        <MobileCard padding="md" className="mb-4">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => router.push(`/digital-barn/log-milk?animalId=${animalId}`)}
            >
              <Milk className="h-4 w-4 mr-2" />
              {getLocalizedText('ወተት ይመዝግቡ', 'Log Milk', 'Aannan galmeessaa')}
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => router.push(`/digital-barn/log-health?animalId=${animalId}`)}
            >
              <Activity className="h-4 w-4 mr-2" />
              {getLocalizedText('ጤንነት ይመዝግቡ', 'Log Health', 'Fayyaa galmeessaa')}
            </Button>
          </div>
        </MobileCard>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="details">
              {getLocalizedText('ዝርዝር', 'Details', 'Bal\'ina')}
            </TabsTrigger>
            <TabsTrigger value="milk">
              {getLocalizedText('ወተት', 'Milk', 'Aannan')}
            </TabsTrigger>
            <TabsTrigger value="health">
              {getLocalizedText('ጤንነት', 'Health', 'Fayyaa')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <MobileCard padding="lg">
              <h3 className="font-bold text-lg mb-4">
                {getLocalizedText('የእንስሳ ዝርዝር መረጃ', 'Animal Details', 'Bal\'ina Bineensaa')}
              </h3>
              
              {/* Photos */}
              {animal.photos && animal.photos.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">
                    {getLocalizedText('ፎቶዎች', 'Photos', 'Suuraalee')}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {animal.photos.map((photo, index) => (
                      <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <img 
                          src={photo} 
                          alt={`${animal.name || animal.animalId} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {animal.notes && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">
                    {getLocalizedText('ማስታወሻዎች', 'Notes', 'Yaadachiisa')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {animal.notes}
                  </p>
                </div>
              )}

              {/* Registration Date */}
              <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                {getLocalizedText('የተመዘገበበት ቀን:', 'Registered on:', 'Guyyaa galmeeffame:')} {' '}
                {EthiopianCalendar.formatDate(new Date(animal.createdAt), 'long', language)}
              </div>
            </MobileCard>
          </TabsContent>

          <TabsContent value="milk">
            <MobileCard padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">
                  {getLocalizedText('የወተት ምርት', 'Milk Production', 'Oomisha Aannan')}
                </h3>
                <Button 
                  size="sm" 
                  onClick={() => router.push(`/digital-barn/log-milk?animalId=${animalId}`)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {getLocalizedText('ጨምር', 'Add', 'Dabali')}
                </Button>
              </div>

              {animal.milkRecords && animal.milkRecords.length > 0 ? (
                <div className="space-y-3">
                  {animal.milkRecords.slice(0, 5).map((record: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <div className="font-medium">{record.totalMilk} L</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {EthiopianCalendar.formatDate(new Date(record.date), 'short', language)}
                        </div>
                      </div>
                      {record.totalValue && (
                        <div className="text-right">
                          <div className="font-medium text-green-600">{record.totalValue} ETB</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {record.pricePerLiter} ETB/L
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Milk className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{getLocalizedText('የወተት ምርት መዝገብ የለም', 'No milk production records', 'Galmeen oomisha aannan hin jiru')}</p>
                </div>
              )}
            </MobileCard>
          </TabsContent>

          <TabsContent value="health">
            <MobileCard padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">
                  {getLocalizedText('የጤንነት መዝገብ', 'Health Records', 'Galmee Fayyaa')}
                </h3>
                <Button 
                  size="sm" 
                  onClick={() => router.push(`/digital-barn/log-health?animalId=${animalId}`)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {getLocalizedText('ጨምር', 'Add', 'Dabali')}
                </Button>
              </div>

              {animal.healthLogs && animal.healthLogs.length > 0 ? (
                <div className="space-y-3">
                  {animal.healthLogs.slice(0, 5).map((log: any, index: number) => (
                    <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium capitalize">{log.logType}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {EthiopianCalendar.formatDate(new Date(log.date), 'short', language)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{log.description}</p>
                      {log.cost && (
                        <div className="text-sm font-medium text-green-600 mt-1">
                          {log.cost} ETB
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{getLocalizedText('የጤንነት መዝገብ የለም', 'No health records', 'Galmeen fayyaa hin jiru')}</p>
                </div>
              )}
            </MobileCard>
          </TabsContent>
        </Tabs>
      </MobileOptimizedLayout>
    </div>
  );
}

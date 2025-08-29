'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  ListingCategory, 
  ListingFormData, 
  VerificationTier,
  CATEGORY_CONFIGS,
  VERIFICATION_CONFIGS 
} from '@/lib/marketplace/types';
import { listingService } from '@/lib/marketplace/listing-service';

interface ListingFormProps {
  onSubmit: (data: ListingFormData) => Promise<void>;
  initialData?: Partial<ListingFormData>;
  fromBarnAnimal?: {
    id: string;
    species: string;
    breed: string;
    age: number;
    photos: string[];
  };
}

export function ListingForm({ onSubmit, initialData, fromBarnAnimal }: ListingFormProps) {
  const [formData, setFormData] = useState<ListingFormData>({
    category: initialData?.category || (fromBarnAnimal ? 'livestock' : 'livestock'),
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    negotiable: initialData?.negotiable ?? true,
    location: initialData?.location || '',
    region: initialData?.region || '',
    media: initialData?.media || [],
    verificationTier: initialData?.verificationTier || 'free',
    attributes: initialData?.attributes || {}
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);

  const categoryConfig = CATEGORY_CONFIGS[formData.category];
  const verificationConfig = VERIFICATION_CONFIGS[formData.verificationTier];

  // Initialize form data based on category or barn animal
  useEffect(() => {
    if (fromBarnAnimal) {
      setFormData(prev => ({
        ...prev,
        category: 'livestock',
        title: `${fromBarnAnimal.breed} ${fromBarnAnimal.species} - ${fromBarnAnimal.age} months old`,
        attributes: {
          ...listingService.getDefaultAttributes('livestock'),
          species: fromBarnAnimal.species,
          breed: fromBarnAnimal.breed,
          age: fromBarnAnimal.age,
          fromBarn: true,
          animalId: fromBarnAnimal.id
        }
      }));
      setMediaPreview(fromBarnAnimal.photos);
    } else {
      setFormData(prev => ({
        ...prev,
        attributes: listingService.getDefaultAttributes(prev.category)
      }));
    }
  }, [fromBarnAnimal]);

  // Update attributes when category changes
  useEffect(() => {
    if (!fromBarnAnimal) {
      setFormData(prev => ({
        ...prev,
        attributes: listingService.getDefaultAttributes(prev.category),
        verificationTier: CATEGORY_CONFIGS[prev.category].verificationTiers[0]
      }));
    }
  }, [formData.category, fromBarnAnimal]);

  const handleInputChange = (field: keyof ListingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAttributeChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [field]: value }
    }));
  };

  const handleMediaUpload = (files: FileList) => {
    const newFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...newFiles]
    }));

    // Create preview URLs
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const validation = listingService.validateListingData(formData.category, formData.attributes);
    const newErrors = [...validation.errors];

    if (!formData.title.trim()) newErrors.push('Title is required');
    if (!formData.description.trim()) newErrors.push('Description is required');
    if (formData.price <= 0) newErrors.push('Price must be greater than 0');
    if (!formData.location.trim()) newErrors.push('Location is required');
    if (!formData.region.trim()) newErrors.push('Region is required');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategorySelector = () => (
    <Card>
      <CardHeader>
        <CardTitle>1. የዝርዝር ምድብ ይምረጡ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(CATEGORY_CONFIGS).map(config => (
            <div
              key={config.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                formData.category === config.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('category', config.id)}
            >
              <div className="text-2xl mb-2">{config.emoji}</div>
              <div className="font-medium">{config.name}</div>
              <div className="text-sm text-gray-500">{config.nameEn}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderBasicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>2. መሰረታዊ መረጃ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">ርዕስ *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="የእንስሳት/ምርት ርዕስ"
          />
        </div>

        <div>
          <Label htmlFor="description">መግለጫ *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="ዝርዝር መግለጫ ይጻፉ..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">ዋጋ (ብር) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="flex items-center space-x-2 pt-8">
            <Switch
              checked={formData.negotiable}
              onCheckedChange={(checked) => handleInputChange('negotiable', checked)}
            />
            <Label>ዋጋ ሊደራደር ይችላል</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">አካባቢ *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="ከተማ/ወረዳ"
            />
          </div>
          <div>
            <Label htmlFor="region">ክልል *</Label>
            <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
              <SelectTrigger>
                <SelectValue placeholder="ክልል ይምረጡ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="አዲስ አበባ">አዲስ አበባ</SelectItem>
                <SelectItem value="ኦሮሚያ">ኦሮሚያ</SelectItem>
                <SelectItem value="አማራ">አማራ</SelectItem>
                <SelectItem value="ትግራይ">ትግራይ</SelectItem>
                <SelectItem value="ደቡብ">ደቡብ</SelectItem>
                <SelectItem value="ሲዳማ">ሲዳማ</SelectItem>
                <SelectItem value="አፋር">አፋር</SelectItem>
                <SelectItem value="ሶማሊ">ሶማሊ</SelectItem>
                <SelectItem value="ቤንሻንጉል">ቤንሻንጉል</SelectItem>
                <SelectItem value="ጋምቤላ">ጋምቤላ</SelectItem>
                <SelectItem value="ሐረሪ">ሐረሪ</SelectItem>
                <SelectItem value="ድሬዳዋ">ድሬዳዋ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCategorySpecificFields = () => {
    const { attributes } = formData;

    switch (formData.category) {
      case 'livestock':
        return (
          <Card>
            <CardHeader>
              <CardTitle>3. የእንስሳት መረጃ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>የእንስሳት ዓይነት *</Label>
                  <Select 
                    value={attributes.species || ''} 
                    onValueChange={(value) => handleAttributeChange('species', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ዓይነት ይምረጡ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ላም">ላም</SelectItem>
                      <SelectItem value="ፍየል">ፍየል</SelectItem>
                      <SelectItem value="በግ">በግ</SelectItem>
                      <SelectItem value="ዶሮ">ዶሮ</SelectItem>
                      <SelectItem value="ፈረስ">ፈረስ</SelectItem>
                      <SelectItem value="አህያ">አህያ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>ዝርያ *</Label>
                  <Input
                    value={attributes.breed || ''}
                    onChange={(e) => handleAttributeChange('breed', e.target.value)}
                    placeholder="ዝርያ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>እድሜ (በወር) *</Label>
                  <Input
                    type="number"
                    value={attributes.age || 0}
                    onChange={(e) => handleAttributeChange('age', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>ጾታ *</Label>
                  <Select 
                    value={attributes.gender || 'female'} 
                    onValueChange={(value) => handleAttributeChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ወንድ</SelectItem>
                      <SelectItem value="female">ሴት</SelectItem>
                      <SelectItem value="mixed">ድብልቅ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>ክብደት (ኪግ)</Label>
                  <Input
                    type="number"
                    value={attributes.weight || ''}
                    onChange={(e) => handleAttributeChange('weight', parseFloat(e.target.value) || undefined)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>የጤና ሁኔታ *</Label>
                <Select 
                  value={attributes.healthStatus || 'healthy'} 
                  onValueChange={(value) => handleAttributeChange('healthStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">በጣም ጤናማ</SelectItem>
                    <SelectItem value="healthy">ጤናማ</SelectItem>
                    <SelectItem value="good">ጥሩ</SelectItem>
                    <SelectItem value="fair">መካከለኛ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={attributes.vaccinated || false}
                    onCheckedChange={(checked) => handleAttributeChange('vaccinated', checked)}
                  />
                  <Label>ክትባት ተወስዷል</Label>
                </div>
                {attributes.gender === 'female' && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={attributes.pregnant || false}
                      onCheckedChange={(checked) => handleAttributeChange('pregnant', checked)}
                    />
                    <Label>እርግዝና</Label>
                  </div>
                )}
              </div>

              {attributes.species === 'ላም' && attributes.gender === 'female' && (
                <div>
                  <Label>የወተት ምርት (ሊትር በቀን)</Label>
                  <Input
                    type="number"
                    value={attributes.milkProduction || ''}
                    onChange={(e) => handleAttributeChange('milkProduction', parseFloat(e.target.value) || undefined)}
                    placeholder="0"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'machinery':
      case 'equipment':
        return (
          <Card>
            <CardHeader>
              <CardTitle>3. የማሽን/መሳሪያ መረጃ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ዓይነት *</Label>
                  <Input
                    value={attributes.type || ''}
                    onChange={(e) => handleAttributeChange('type', e.target.value)}
                    placeholder="ትራክተር፣ ማጨድ፣ ወዘተ"
                  />
                </div>
                <div>
                  <Label>ብራንድ *</Label>
                  <Input
                    value={attributes.brand || ''}
                    onChange={(e) => handleAttributeChange('brand', e.target.value)}
                    placeholder="ብራንድ ስም"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ሞዴል *</Label>
                  <Input
                    value={attributes.model || ''}
                    onChange={(e) => handleAttributeChange('model', e.target.value)}
                    placeholder="ሞዴል"
                  />
                </div>
                <div>
                  <Label>አመት</Label>
                  <Input
                    type="number"
                    value={attributes.year || ''}
                    onChange={(e) => handleAttributeChange('year', parseInt(e.target.value) || undefined)}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div>
                <Label>ሁኔታ *</Label>
                <Select 
                  value={attributes.condition || 'good'} 
                  onValueChange={(value) => handleAttributeChange('condition', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">አዲስ</SelectItem>
                    <SelectItem value="excellent">በጣም ጥሩ</SelectItem>
                    <SelectItem value="good">ጥሩ</SelectItem>
                    <SelectItem value="fair">መካከለኛ</SelectItem>
                    <SelectItem value="poor">መጥፎ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>አቅም/ሃይል</Label>
                <Input
                  value={attributes.capacity || ''}
                  onChange={(e) => handleAttributeChange('capacity', e.target.value)}
                  placeholder="ሆርስ ፓወር፣ አቅም፣ ወዘተ"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={attributes.warranty || false}
                  onCheckedChange={(checked) => handleAttributeChange('warranty', checked)}
                />
                <Label>ዋስትና አለው</Label>
              </div>

              {attributes.warranty && (
                <div>
                  <Label>የዋስትና ጊዜ</Label>
                  <Input
                    value={attributes.warrantyPeriod || ''}
                    onChange={(e) => handleAttributeChange('warrantyPeriod', e.target.value)}
                    placeholder="1 አመት፣ 6 ወር፣ ወዘተ"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'feed':
        return (
          <Card>
            <CardHeader>
              <CardTitle>3. የመኖ መረጃ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>የመኖ ዓይነት *</Label>
                <Select 
                  value={attributes.feedType || ''} 
                  onValueChange={(value) => handleAttributeChange('feedType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="መኖ ዓይነት ይምረጡ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="የላም መኖ">የላም መኖ</SelectItem>
                    <SelectItem value="የዶሮ መኖ">የዶሮ መኖ</SelectItem>
                    <SelectItem value="የፍየል መኖ">የፍየል መኖ</SelectItem>
                    <SelectItem value="የበግ መኖ">የበግ መኖ</SelectItem>
                    <SelectItem value="ድብልቅ መኖ">ድብልቅ መኖ</SelectItem>
                    <SelectItem value="ሳር">ሳር</SelectItem>
                    <SelectItem value="ገለባ">ገለባ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>መጠን (ኪግ) *</Label>
                  <Input
                    type="number"
                    value={attributes.quantity || 0}
                    onChange={(e) => handleAttributeChange('quantity', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>ማሸጊያ *</Label>
                  <Select 
                    value={attributes.packaging || 'bag'} 
                    onValueChange={(value) => handleAttributeChange('packaging', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bag">ከረጢት</SelectItem>
                      <SelectItem value="bulk">በጅምላ</SelectItem>
                      <SelectItem value="bale">ጥቅል</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>የማለፊያ ቀን</Label>
                <Input
                  type="date"
                  value={attributes.expiryDate || ''}
                  onChange={(e) => handleAttributeChange('expiryDate', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={attributes.organicCertified || false}
                  onCheckedChange={(checked) => handleAttributeChange('organicCertified', checked)}
                />
                <Label>ኦርጋኒክ የተረጋገጠ</Label>
              </div>
            </CardContent>
          </Card>
        );

      case 'vet_supplies':
        return (
          <Card>
            <CardHeader>
              <CardTitle>3. የእንስሳት ሐኪም መድሃኒት መረጃ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ዓይነት *</Label>
                  <Select 
                    value={attributes.supplyType || 'medicine'} 
                    onValueChange={(value) => handleAttributeChange('supplyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medicine">መድሃኒት</SelectItem>
                      <SelectItem value="vaccine">ክትባት</SelectItem>
                      <SelectItem value="supplement">ተጨማሪ</SelectItem>
                      <SelectItem value="equipment">መሳሪያ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>የምርት ስም *</Label>
                  <Input
                    value={attributes.productName || ''}
                    onChange={(e) => handleAttributeChange('productName', e.target.value)}
                    placeholder="መድሃኒት ስም"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>መጠን *</Label>
                  <Input
                    type="number"
                    value={attributes.quantity || 0}
                    onChange={(e) => handleAttributeChange('quantity', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>አሃድ *</Label>
                  <Select 
                    value={attributes.unit || 'ml'} 
                    onValueChange={(value) => handleAttributeChange('unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ml">ሚሊሊትር</SelectItem>
                      <SelectItem value="tablets">ታብሌት</SelectItem>
                      <SelectItem value="doses">ዶዝ</SelectItem>
                      <SelectItem value="vials">ቫያል</SelectItem>
                      <SelectItem value="bottles">ጠርሙስ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>የማለፊያ ቀን</Label>
                <Input
                  type="date"
                  value={attributes.expiryDate || ''}
                  onChange={(e) => handleAttributeChange('expiryDate', e.target.value)}
                />
              </div>

              <div>
                <Label>የአጠቃቀም መመሪያ</Label>
                <Textarea
                  value={attributes.dosageInstructions || ''}
                  onChange={(e) => handleAttributeChange('dosageInstructions', e.target.value)}
                  placeholder="እንዴት እንደሚጠቀሙ ይግለጹ..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={attributes.prescriptionRequired || false}
                  onCheckedChange={(checked) => handleAttributeChange('prescriptionRequired', checked)}
                />
                <Label>የሐኪም ማዘዣ ያስፈልጋል</Label>
              </div>
            </CardContent>
          </Card>
        );

      case 'accessories':
        return (
          <Card>
            <CardHeader>
              <CardTitle>3. የተጨማሪ እቃ መረጃ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>የምርት ዓይነት *</Label>
                <Input
                  value={attributes.productType || ''}
                  onChange={(e) => handleAttributeChange('productType', e.target.value)}
                  placeholder="የምርት ዓይነት"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>ቁሳቁስ</Label>
                  <Input
                    value={attributes.material || ''}
                    onChange={(e) => handleAttributeChange('material', e.target.value)}
                    placeholder="ቁሳቁስ"
                  />
                </div>
                <div>
                  <Label>መጠን</Label>
                  <Input
                    value={attributes.size || ''}
                    onChange={(e) => handleAttributeChange('size', e.target.value)}
                    placeholder="መጠን"
                  />
                </div>
                <div>
                  <Label>ቀለም</Label>
                  <Input
                    value={attributes.color || ''}
                    onChange={(e) => handleAttributeChange('color', e.target.value)}
                    placeholder="ቀለም"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderMediaUpload = () => (
    <Card>
      <CardHeader>
        <CardTitle>4. ፎቶ እና ቪዲዮ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label htmlFor="media-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500">ፋይል ይምረጡ</span>
                <span className="text-gray-500"> ወይም እዚህ ይጎትቱ</span>
              </label>
              <input
                id="media-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => e.target.files && handleMediaUpload(e.target.files)}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, MP4 እስከ 10MB
            </p>
          </div>

          {mediaPreview.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mediaPreview.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderVerificationTier = () => (
    <Card>
      <CardHeader>
        <CardTitle>5. የማረጋገጫ ደረጃ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryConfig.verificationTiers.map(tier => {
            const config = VERIFICATION_CONFIGS[tier];
            return (
              <div
                key={tier}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.verificationTier === tier 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('verificationTier', tier)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{config.name}</div>
                    <div className="text-sm text-gray-500">{config.description}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={config.color as any}>{config.badge}</Badge>
                    {config.cost > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        {config.cost} ብር
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const renderPreview = () => (
    <Card>
      <CardHeader>
        <CardTitle>6. ቅድመ እይታ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{categoryConfig.emoji}</span>
            <Badge>{categoryConfig.name}</Badge>
            <Badge variant={verificationConfig.color as any}>
              {verificationConfig.badge}
            </Badge>
          </div>
          
          <h3 className="text-lg font-semibold">{formData.title}</h3>
          <p className="text-gray-600">{formData.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">
              {formData.price.toLocaleString()} ብር
              {formData.negotiable && (
                <span className="text-sm text-gray-500 ml-2">ሊደራደር ይችላል</span>
              )}
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            📍 {formData.location}, {formData.region}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">እባክዎ የሚከተሉትን ያስተካክሉ:</span>
            </div>
            <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!fromBarnAnimal && renderCategorySelector()}
      {renderBasicInfo()}
      {renderCategorySpecificFields()}
      {renderMediaUpload()}
      {renderVerificationTier()}
      {renderPreview()}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          ሰርዝ
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'እየተሰራ...' : 'ዝርዝር ይፍጠሩ'}
        </Button>
      </div>
    </form>
  );
}

import { PrismaClient } from '@prisma/client';
import { DigitalBarnUtils } from './utils';
import { Animal, AnimalFormData } from './types';

const prisma = new PrismaClient();

export class AnimalService {
  static async createAnimal(userId: string, formData: AnimalFormData): Promise<Animal> {
    try {
      // Generate unique animal ID
      const animalId = DigitalBarnUtils.generateAnimalId(
        formData.ownerInitials || 'AT', // Default to AT if not provided
        formData.type,
        1 // TODO: Get actual sequence number
      );

      // Calculate total milk if provided
      const totalMilk = formData.morningMilk && formData.eveningMilk 
        ? formData.morningMilk + formData.eveningMilk 
        : undefined;

      // Create animal in database
      const animal = await prisma.animal.create({
        data: {
          animalId,
          name: formData.name,
          type: formData.type,
          breed: formData.breed,
          age: formData.ageInMonths,
          gender: formData.sex,
          weight: formData.weight,
          color: formData.color,
          healthStatus: 'healthy',
          description: formData.notes,
          images: formData.photos || [],
          videos: formData.videos || [],
          isActive: true,
          ownerId: userId,
        },
        include: {
          healthLogs: true,
          milkRecords: true,
          listings: true,
        }
      });

      // If milk production data is provided, create initial milk record
      if (totalMilk && totalMilk > 0) {
        await prisma.milkRecord.create({
          data: {
            animalId: animal.id,
            date: new Date(),
            morningMilk: formData.morningMilk,
            eveningMilk: formData.eveningMilk,
            totalMilk,
            pricePerLiter: formData.milkPricePerLiter,
            totalValue: formData.milkPricePerLiter ? totalMilk * formData.milkPricePerLiter : undefined,
            notes: 'Initial milk production record',
          }
        });
      }

      return this.mapPrismaAnimalToAnimal(animal);
    } catch (error) {
      console.error('Error creating animal:', error);
      throw new Error('Failed to create animal');
    }
  }

  static async getAnimalsByUserId(userId: string): Promise<Animal[]> {
    try {
      const animals = await prisma.animal.findMany({
        where: {
          ownerId: userId,
          isActive: true,
        },
        include: {
          healthLogs: {
            orderBy: { date: 'desc' },
            take: 5, // Get latest 5 health logs
          },
          milkRecords: {
            orderBy: { date: 'desc' },
            take: 7, // Get latest 7 days of milk records
          },
          listings: {
            where: { status: 'active' },
            take: 1,
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return animals.map(this.mapPrismaAnimalToAnimal);
    } catch (error) {
      console.error('Error fetching animals:', error);
      throw new Error('Failed to fetch animals');
    }
  }

  static async getAnimalById(animalId: string, userId: string): Promise<Animal | null> {
    try {
      const animal = await prisma.animal.findFirst({
        where: {
          id: animalId,
          ownerId: userId,
          isActive: true,
        },
        include: {
          healthLogs: {
            orderBy: { date: 'desc' },
          },
          milkRecords: {
            orderBy: { date: 'desc' },
          },
          listings: {
            where: { status: 'active' },
          }
        }
      });

      return animal ? this.mapPrismaAnimalToAnimal(animal) : null;
    } catch (error) {
      console.error('Error fetching animal:', error);
      throw new Error('Failed to fetch animal');
    }
  }

  static async updateAnimal(animalId: string, userId: string, updateData: Partial<AnimalFormData>): Promise<Animal> {
    try {
      const animal = await prisma.animal.update({
        where: {
          id: animalId,
          ownerId: userId,
        },
        data: {
          name: updateData.name,
          breed: updateData.breed,
          age: updateData.ageInMonths,
          weight: updateData.weight,
          color: updateData.color,
          description: updateData.notes,
          images: updateData.photos,
          videos: updateData.videos,
        },
        include: {
          healthLogs: true,
          milkRecords: true,
          listings: true,
        }
      });

      return this.mapPrismaAnimalToAnimal(animal);
    } catch (error) {
      console.error('Error updating animal:', error);
      throw new Error('Failed to update animal');
    }
  }

  static async deleteAnimal(animalId: string, userId: string): Promise<void> {
    try {
      await prisma.animal.update({
        where: {
          id: animalId,
          ownerId: userId,
        },
        data: {
          isActive: false,
        }
      });
    } catch (error) {
      console.error('Error deleting animal:', error);
      throw new Error('Failed to delete animal');
    }
  }

  static async getNextSequenceNumber(userId: string, animalType: string): Promise<number> {
    try {
      const count = await prisma.animal.count({
        where: {
          ownerId: userId,
          type: animalType,
        }
      });
      return count + 1;
    } catch (error) {
      console.error('Error getting sequence number:', error);
      return 1;
    }
  }

  private static mapPrismaAnimalToAnimal(prismaAnimal: any): Animal {
    return {
      id: prismaAnimal.id,
      animalId: prismaAnimal.animalId,
      name: prismaAnimal.name,
      type: prismaAnimal.type,
      breed: prismaAnimal.breed,
      ageInMonths: prismaAnimal.age,
      sex: prismaAnimal.gender,
      weight: prismaAnimal.weight,
      color: prismaAnimal.color,
      healthStatus: prismaAnimal.healthStatus,
      photos: prismaAnimal.images || [],
      videos: prismaAnimal.videos || [],
      notes: prismaAnimal.description,
      isPregnant: false, // TODO: Determine from health logs
      lastMilkDate: prismaAnimal.milkRecords?.[0]?.date,
      totalMilkProduction: prismaAnimal.milkRecords?.reduce((sum: number, record: any) => sum + record.totalMilk, 0) || 0,
      healthLogs: prismaAnimal.healthLogs || [],
      milkRecords: prismaAnimal.milkRecords || [],
      isActive: prismaAnimal.isActive,
      createdAt: prismaAnimal.createdAt,
      updatedAt: prismaAnimal.updatedAt,
    };
  }
}

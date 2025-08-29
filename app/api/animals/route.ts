import { NextRequest, NextResponse } from 'next/server';
import { AnimalService } from '@/lib/digital-barn/animal-service';
import { AnimalFormData } from '@/lib/digital-barn/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...animalData }: { userId: string } & AnimalFormData = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!animalData.type) {
      return NextResponse.json(
        { error: 'Animal type is required' },
        { status: 400 }
      );
    }

    // Get sequence number for animal ID generation
    const sequenceNumber = await AnimalService.getNextSequenceNumber(userId, animalData.type);
    
    // Add sequence number to form data
    const formDataWithSequence = {
      ...animalData,
      sequenceNumber,
    };

    // Create animal
    const animal = await AnimalService.createAnimal(userId, formDataWithSequence);

    return NextResponse.json({
      success: true,
      data: animal,
      message: 'Animal registered successfully'
    });

  } catch (error) {
    console.error('Error in POST /api/animals:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create animal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const animals = await AnimalService.getAnimalsByUserId(userId);

    return NextResponse.json({
      success: true,
      data: animals
    });

  } catch (error) {
    console.error('Error in GET /api/animals:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch animals',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

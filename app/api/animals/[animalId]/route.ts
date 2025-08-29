import { NextRequest, NextResponse } from 'next/server';
import { AnimalService } from '@/lib/digital-barn/animal-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { animalId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const animal = await AnimalService.getAnimalById(params.animalId, userId);

    if (!animal) {
      return NextResponse.json(
        { error: 'Animal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: animal
    });

  } catch (error) {
    console.error('Error in GET /api/animals/[animalId]:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch animal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { animalId: string } }
) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const animal = await AnimalService.updateAnimal(params.animalId, userId, updateData);

    return NextResponse.json({
      success: true,
      data: animal,
      message: 'Animal updated successfully'
    });

  } catch (error) {
    console.error('Error in PUT /api/animals/[animalId]:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update animal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { animalId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await AnimalService.deleteAnimal(params.animalId, userId);

    return NextResponse.json({
      success: true,
      message: 'Animal deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/animals/[animalId]:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete animal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

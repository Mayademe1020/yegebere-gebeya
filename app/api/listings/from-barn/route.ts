// API endpoint to create listing from barn animal

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: 'localhost',
  port: 5432,
  database: process.env.PGDATABASE || 'yegebere_gebeya',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { animalId, price, negotiable = true, verificationTier = 'free', additionalDescription = '' } = body;

    // Get animal data from barn
    const animalResult = await pool.query(
      'SELECT * FROM animals WHERE id = $1',
      [animalId]
    );

    if (animalResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Animal not found in barn' },
        { status: 404 }
      );
    }

    const animal = animalResult.rows[0];
    const userId = animal.user_id;

    // Create listing from animal data
    const title = `${animal.breed} ${animal.species} - ${animal.age} months old`;
    const description = `${animal.description || ''} ${additionalDescription}`.trim();
    
    const attributes = {
      species: animal.species,
      breed: animal.breed,
      age: animal.age_months || 0,
      gender: animal.gender || 'female',
      weight: animal.weight,
      healthStatus: animal.health_status || 'healthy',
      vaccinated: animal.vaccinated || false,
      pregnant: animal.pregnant || false,
      milkProduction: animal.milk_production,
      fromBarn: true,
      animalId: animalId
    };

    const sql = `
      INSERT INTO listings (
        user_id, category, title, description, price, negotiable,
        location, region, media, verification_tier, attributes, status
      ) VALUES ($1, 'livestock', $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active')
      RETURNING *
    `;

    const result = await pool.query(sql, [
      userId,
      title,
      description,
      price,
      negotiable,
      animal.location || '',
      animal.region || '',
      animal.photos || [],
      verificationTier,
      attributes
    ]);

    const listing = result.rows[0];

    // Update animal status to indicate it's listed for sale
    await pool.query(
      'UPDATE animals SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['listed_for_sale', animalId]
    );

    return NextResponse.json({
      id: listing.id,
      userId: listing.user_id,
      category: listing.category,
      title: listing.title,
      description: listing.description,
      price: parseFloat(listing.price),
      negotiable: listing.negotiable,
      location: listing.location,
      region: listing.region,
      media: listing.media || [],
      verificationTier: listing.verification_tier,
      attributes: listing.attributes || {},
      status: listing.status,
      createdAt: listing.created_at,
      updatedAt: listing.updated_at
    });

  } catch (error) {
    console.error('Error creating listing from barn:', error);
    return NextResponse.json(
      { error: 'Failed to create listing from barn animal' },
      { status: 500 }
    );
  }
}

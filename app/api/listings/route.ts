// Unified API endpoint for all marketplace listings

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { ListingCategory, VerificationTier, Listing } from '@/lib/marketplace/types';

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: 'localhost',
  port: 5432,
  database: process.env.PGDATABASE || 'yegebere_gebeya',
});

// GET - Search and filter listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') as ListingCategory;
    const region = searchParams.get('region');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const verificationTier = searchParams.get('verificationTier') as VerificationTier;
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Build dynamic query
    let sql = `
      SELECT 
        l.*,
        u.name as seller_name,
        u.phone as seller_phone,
        u.verified as seller_verified,
        COUNT(*) OVER() as total_count
      FROM listings l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.status = 'active'
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    // Add filters
    if (query) {
      sql += ` AND (l.title ILIKE $${paramIndex} OR l.description ILIKE $${paramIndex})`;
      params.push(`%${query}%`);
      paramIndex++;
    }

    if (category) {
      sql += ` AND l.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (region) {
      sql += ` AND l.region = $${paramIndex}`;
      params.push(region);
      paramIndex++;
    }

    if (priceMin) {
      sql += ` AND l.price >= $${paramIndex}`;
      params.push(parseFloat(priceMin));
      paramIndex++;
    }

    if (priceMax) {
      sql += ` AND l.price <= $${paramIndex}`;
      params.push(parseFloat(priceMax));
      paramIndex++;
    }

    if (verificationTier) {
      sql += ` AND l.verification_tier = $${paramIndex}`;
      params.push(verificationTier);
      paramIndex++;
    }

    // Add attribute filters (dynamic based on category)
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('attr_')) {
        const attrKey = key.replace('attr_', '');
        sql += ` AND l.attributes->>'${attrKey}' = $${paramIndex}`;
        params.push(value);
        paramIndex++;
      }
    }

    // Add sorting
    switch (sortBy) {
      case 'oldest':
        sql += ' ORDER BY l.created_at ASC';
        break;
      case 'price_low':
        sql += ' ORDER BY l.price ASC';
        break;
      case 'price_high':
        sql += ' ORDER BY l.price DESC';
        break;
      case 'popular':
        sql += ' ORDER BY l.views DESC, l.created_at DESC';
        break;
      default:
        sql += ' ORDER BY l.created_at DESC';
    }

    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(sql, params);
    
    const listings = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      category: row.category,
      title: row.title,
      description: row.description,
      price: parseFloat(row.price),
      negotiable: row.negotiable,
      location: row.location,
      region: row.region,
      media: row.media || [],
      verificationTier: row.verification_tier,
      attributes: row.attributes || {},
      status: row.status,
      views: row.views || 0,
      likes: row.likes || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      seller: {
        name: row.seller_name,
        phone: row.seller_phone,
        verified: row.seller_verified
      }
    }));

    const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      listings,
      total,
      page,
      totalPages,
      hasMore: page < totalPages
    });

  } catch (error) {
    console.error('Error searching listings:', error);
    return NextResponse.json(
      { error: 'Failed to search listings' },
      { status: 500 }
    );
  }
}

// POST - Create new listing
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const category = formData.get('category') as ListingCategory;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const negotiable = formData.get('negotiable') === 'true';
    const location = formData.get('location') as string;
    const region = formData.get('region') as string;
    const verificationTier = formData.get('verificationTier') as VerificationTier;
    const attributes = JSON.parse(formData.get('attributes') as string);

    // Handle media uploads (simplified - in production, upload to cloud storage)
    const media: string[] = [];
    let mediaIndex = 0;
    while (formData.get(`media_${mediaIndex}`)) {
      const file = formData.get(`media_${mediaIndex}`) as File;
      // In production: upload to S3/CloudFlare/etc and get URL
      // For now, we'll use placeholder URLs
      media.push(`/uploads/${Date.now()}_${file.name}`);
      mediaIndex++;
    }

    // Get user ID from session (simplified)
    const userId = 'user_123'; // In production: get from JWT/session

    const sql = `
      INSERT INTO listings (
        user_id, category, title, description, price, negotiable,
        location, region, media, verification_tier, attributes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'active')
      RETURNING *
    `;

    const result = await pool.query(sql, [
      userId, category, title, description, price, negotiable,
      location, region, media, verificationTier, attributes
    ]);

    const listing = result.rows[0];

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
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

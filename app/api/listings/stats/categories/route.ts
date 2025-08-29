// API endpoint for category statistics

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { ListingCategory } from '@/lib/marketplace/types';

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: 'localhost',
  port: 5432,
  database: process.env.PGDATABASE || 'yegebere_gebeya',
});

export async function GET(request: NextRequest) {
  try {
    const sql = `
      SELECT 
        category,
        COUNT(*) as count
      FROM listings 
      WHERE status = 'active'
      GROUP BY category
    `;

    const result = await pool.query(sql);
    
    // Initialize all categories with 0
    const stats: Record<ListingCategory, number> = {
      livestock: 0,
      machinery: 0,
      equipment: 0,
      feed: 0,
      vet_supplies: 0,
      accessories: 0
    };

    // Fill in actual counts
    result.rows.forEach(row => {
      stats[row.category as ListingCategory] = parseInt(row.count);
    });

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error getting category stats:', error);
    return NextResponse.json(
      { error: 'Failed to get category statistics' },
      { status: 500 }
    );
  }
}

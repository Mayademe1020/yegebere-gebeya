import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const range = searchParams.get("range") || "30d";

    if (!userId || userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Calculate date range
    const now = new Date();
    const daysBack = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Get overview data
    const [totalAnimals, activeListings, allListings] = await Promise.all([
      prisma.animal.count({
        where: { ownerId: userId, isActive: true }
      }),
      prisma.listing.count({
        where: { sellerId: userId, status: "active" }
      }),
      prisma.listing.findMany({
        where: { 
          sellerId: userId,
          createdAt: { gte: startDate }
        },
        include: {
          messages: true,
          animal: true
        }
      })
    ]);

    // Calculate metrics
    const totalViews = allListings.reduce((sum, listing) => sum + (listing.views || 0), 0);
    const totalInquiries = allListings.reduce((sum, listing) => sum + listing.messages.length, 0);
    const soldListings = allListings.filter(l => l.status === "sold");
    const totalRevenue = soldListings.reduce((sum, listing) => sum + listing.price, 0);
    const averagePrice = soldListings.length > 0 ? totalRevenue / soldListings.length : 0;

    // Calculate trends (compare with previous period)
    const previousStartDate = new Date(startDate.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    const previousListings = await prisma.listing.findMany({
      where: {
        sellerId: userId,
        createdAt: { gte: previousStartDate, lt: startDate }
      },
      include: { messages: true }
    });

    const previousViews = previousListings.reduce((sum, listing) => sum + (listing.views || 0), 0);
    const previousInquiries = previousListings.reduce((sum, listing) => sum + listing.messages.length, 0);
    const previousSoldListings = previousListings.filter(l => l.status === "sold");
    const previousRevenue = previousSoldListings.reduce((sum, listing) => sum + listing.price, 0);

    const viewsChange = previousViews > 0 ? ((totalViews - previousViews) / previousViews) * 100 : 0;
    const inquiriesChange = previousInquiries > 0 ? ((totalInquiries - previousInquiries) / previousInquiries) * 100 : 0;
    const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // Get animal types distribution
    const animalTypes = await prisma.animal.groupBy({
      by: ['type'],
      where: { ownerId: userId, isActive: true },
      _count: { type: true }
    });

    const animalTypesWithPrices = await Promise.all(
      animalTypes.map(async (type) => {
        const listings = await prisma.listing.findMany({
          where: {
            sellerId: userId,
            animal: { type: type.type }
          }
        });
        
        const soldListings = listings.filter(l => l.status === "sold");
        const averagePrice = soldListings.length > 0 
          ? soldListings.reduce((sum, l) => sum + l.price, 0) / soldListings.length 
          : 0;

        return {
          type: type.type,
          count: type._count.type,
          averagePrice,
          totalSold: soldListings.length
        };
      })
    );

    // Get monthly stats
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthListings = await prisma.listing.findMany({
        where: {
          sellerId: userId,
          createdAt: { gte: monthStart, lte: monthEnd }
        }
      });

      const monthSales = monthListings.filter(l => l.status === "sold");
      const monthRevenue = monthSales.reduce((sum, l) => sum + l.price, 0);

      monthlyStats.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        listings: monthListings.length,
        sales: monthSales.length,
        revenue: monthRevenue
      });
    }

    // Get top performing listings
    const topListings = allListings
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10)
      .map(listing => ({
        id: listing.id,
        title: listing.title,
        views: listing.views || 0,
        inquiries: listing.messages.length,
        status: listing.status,
        createdAt: listing.createdAt
      }));

    const dashboardData = {
      overview: {
        totalAnimals,
        activeListings,
        totalViews,
        totalInquiries,
        totalRevenue,
        averagePrice
      },
      trends: {
        viewsChange: Math.round(viewsChange),
        inquiriesChange: Math.round(inquiriesChange),
        revenueChange: Math.round(revenueChange)
      },
      listings: topListings,
      animalTypes: animalTypesWithPrices,
      monthlyStats
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

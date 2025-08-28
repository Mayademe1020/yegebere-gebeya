import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = params;

    // Verify the listing exists and user has access
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true }
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Get messages for this listing where user is either sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        listingId,
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    // Mark messages as read if user is the receiver
    await prisma.message.updateMany({
      where: {
        listingId,
        receiverId: session.user.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching listing messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

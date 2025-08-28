import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, receiverId, content, imageUrl } = await request.json();

    if (!listingId || !receiverId || (!content && !imageUrl)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the listing exists
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

    // Create the message
    const message = await prisma.message.create({
      data: {
        listingId,
        senderId: session.user.id,
        receiverId,
        content: content || "",
        imageUrl,
        timestamp: new Date(),
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            phone: true,
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            phone: true,
          }
        }
      }
    });

    // TODO: Send push notification to receiver
    // TODO: Send Telegram notification if user has Telegram linked

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Get all conversations for the user
    const conversations = await prisma.message.findMany({
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
        },
        listing: {
          select: {
            id: true,
            title: true,
            animalType: true,
          }
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    return NextResponse.json({ messages: conversations });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      veterinarianId, 
      type, 
      date, 
      time, 
      description, 
      urgency 
    } = await request.json();

    if (!veterinarianId || !type || !date || !time || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the consultation booking (simplified for now)
    const consultation = await prisma.vetConsultation.create({
      data: {
        userId: session.user.id,
        question: description,
        category: type,
        urgency,
        status: "pending",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          }
        }
      }
    });

    // TODO: Send confirmation SMS/Telegram to both user and vet
    // TODO: Create calendar event
    // TODO: Send email confirmation if available

    return NextResponse.json({ 
      booking: consultation,
      message: "Consultation booked successfully" 
    });
  } catch (error) {
    console.error("Error booking consultation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

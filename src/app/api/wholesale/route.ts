import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      businessName, 
      contactName, 
      email, 
      phone, 
      businessType, 
      estimatedVolume, 
      message 
    } = body;

    // Basic validation
    if (!businessName || !contactName || !email || !phone || !businessType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.wholesaleInquiry.create({
      data: {
        businessName,
        contactName,
        email,
        phone,
        businessType,
        estimatedVolume,
        message,
      },
    });

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error("Wholesale Inquiry Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const inquiries = await prisma.wholesaleInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Fetch Inquiries Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

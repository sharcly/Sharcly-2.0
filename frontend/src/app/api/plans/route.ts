import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.pricingPlan.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Fetch Plans Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, minOrder, discount, features, featured } = body;

    if (!name || !minOrder || !discount || !features) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const plan = await prisma.pricingPlan.create({
      data: {
        name,
        minOrder,
        discount,
        features,
        featured: !!featured,
      },
    });

    return NextResponse.json({ success: true, data: plan }, { status: 201 });
  } catch (error) {
    console.error("Create Plan Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

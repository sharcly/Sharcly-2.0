import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const testimonialUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  role: z.string().min(1, "Role is required").optional(),
  company: z.string().optional().nullable(),
  message: z.string().min(1, "Message is required").optional(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  image: z.string().optional().nullable(),
  featured: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Fetch Single Testimonial Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = testimonialUpdateSchema.parse(body);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation Error", details: error.errors },
        { status: 400 }
      );
    }
    // Prisma error code for record not found
    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }
    console.error("Update Testimonial Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    // Prisma error code for record not found
    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }
    console.error("Delete Testimonial Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

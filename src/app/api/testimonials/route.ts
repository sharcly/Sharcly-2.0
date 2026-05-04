import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().optional().nullable(),
  message: z.string().min(1, "Message is required"),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  image: z.string().optional().nullable(),
  featured: z.boolean().optional().default(false),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");
    
    // Construct backend URL
    const backendUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8181/api"}/testimonials`);
    if (featured) backendUrl.searchParams.append("featured", featured);
    if (limit) backendUrl.searchParams.append("limit", limit);

    const response = await fetch(backendUrl.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Backend fetch failed");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Fetch Testimonials Proxy Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal Server Error", 
        message: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8181/api"}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Create Testimonial Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

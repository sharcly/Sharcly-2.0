import { apiClient } from "@/lib/api-client";

export async function GET() {
  try {
    const res = await apiClient.get("/seo/sitemap.xml");
    return new Response(res.data, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    return new Response("Sitemap generation failed", { status: 500 });
  }
}

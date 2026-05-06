import { apiClient } from "@/lib/api-client";

export async function GET() {
  try {
    const res = await apiClient.get("/seo/robots.txt");
    return new Response(res.data, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    return new Response("User-agent: *\nAllow: /", { 
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

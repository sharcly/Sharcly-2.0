export const getImageUrl = (image: any): string => {
  const fallback = "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg";
  
  if (!image || image === "undefined" || image === "null") {
    return fallback;
  }

  // Detect environment
  const isProd = process.env.NODE_ENV === "production";
  
  // Resolve Base URLs
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8181/api";
  let baseUrl = apiUrl.split('/api')[0];

  // Case 1: Already a full URL (external)
  if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
    return image;
  }

  // Case 2: Internal API path starting with /api
  if (typeof image === 'string' && image.startsWith('/api')) {
    // If we're in prod but baseUrl is still localhost, try to use relative path
    if (isProd && baseUrl.includes('localhost') && typeof window !== 'undefined') {
       return image; // Browser will resolve relative to current domain
    }
    return `${baseUrl}${image}`;
  }

  // Case 3: Just the filename or UUID string
  if (typeof image === 'string' && !image.includes('/') && !image.includes('http')) {
    return `${apiUrl}/images/${image}`;
  }

  // Case 4: Image object from Prisma (with id)
  if (typeof image === 'object' && image.id) {
    if (image.id === "undefined" || image.id === "null") return fallback;
    return `${apiUrl}/images/${image.id}`;
  }

  // Case 5: Image object from Prisma (with url - legacy/external)
  if (typeof image === 'object' && image.url) {
    return getImageUrl(image.url);
  }

  return fallback;
};

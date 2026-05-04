export const getImageUrl = (image: any): string => {
  if (!image) return "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg";

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0] || "http://localhost:8181";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8181/api";

  // Case 1: Already a full URL (external)
  if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
    return image;
  }

  // Case 2: Internal API path starting with /api
  if (typeof image === 'string' && image.startsWith('/api')) {
    return `${baseUrl}${image}`;
  }

  // Case 3: Just the UUID string
  if (typeof image === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(image)) {
    return `${apiUrl}/images/${image}`;
  }

  // Case 4: Image object from Prisma (with id)
  if (typeof image === 'object' && image.id) {
    return `${apiUrl}/images/${image.id}`;
  }

  // Case 5: Image object from Prisma (with url - legacy/external)
  if (typeof image === 'object' && image.url) {
    return getImageUrl(image.url);
  }

  // Fallback
  return "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg";
};

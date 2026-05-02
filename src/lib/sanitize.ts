import DOMPurify from "dompurify";

/**
 * Sanitizes an HTML string to prevent XSS attacks.
 * Can be used in both client and server (with care) environments.
 */
export const sanitizeHtml = (html: string): string => {
  if (typeof window === "undefined") {
    return html; // Return as is on server-side if not using a JSDOM environment
  }
  return DOMPurify.sanitize(html);
};

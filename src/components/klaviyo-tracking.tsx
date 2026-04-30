"use client";

import { useEffect } from "react";
import { useCart } from "@/context/cart-context";

interface KlaviyoTrackingProps {
  publicApiKey: string;
}

export default function KlaviyoTracking({ publicApiKey }: KlaviyoTrackingProps) {
  const { cart } = useCart();

  useEffect(() => {
    // 1. Inject Klaviyo Object
    if (typeof window !== "undefined" && publicApiKey) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${publicApiKey}`;
      document.head.appendChild(script);

      // Initialize klaviyo object
      (window as any)._learnq = (window as any)._learnq || [];
    }
  }, [publicApiKey]);

  // Track "Added to Cart"
  useEffect(() => {
    if ((window as any)._learnq && cart.length > 0) {
      const lastItem = cart[cart.length - 1];
      
      (window as any)._learnq.push(["track", "Added to Cart", {
        "$value": lastItem.price,
        "ProductName": lastItem.name,
        "ProductID": lastItem.id,
        "ImageURL": lastItem.image,
        "Quantity": lastItem.quantity,
        "ItemNames": cart.map(item => item.name)
      }]);
    }
  }, [cart.length]);

  return null;
}

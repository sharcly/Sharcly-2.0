"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { apiClient } from "@/lib/api-client";
import { useCart } from "@/context/cart-context";

export default function GlobalSeoIntegrator() {
  const { cartItems } = useCart();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchGlobalSeo = async () => {
      try {
        const { data } = await apiClient.get("/seo/global/settings");
        setSettings(data.settings);
      } catch (err) {
        console.warn("Global SEO settings failed to load");
      }
    };

    fetchGlobalSeo();
  }, []);

  // Site Verification (Meta Tag)
  useEffect(() => {
    if (settings?.googleSiteVerification) {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', settings.googleSiteVerification);
    }
  }, [settings]);

  // Track "Added to Cart" behavior
  useEffect(() => {
    if ((window as any)._learnq && cartItems?.length > 0) {
      const lastItem = cartItems[cartItems.length - 1];
      (window as any)._learnq.push(["track", "Added to Cart", {
        "$value": lastItem.price,
        "ProductName": lastItem.name,
        "ProductID": lastItem.id,
        "ImageURL": lastItem.image,
        "Quantity": lastItem.quantity,
        "ItemNames": cartItems.map(item => item.name)
      }]);
    }
  }, [cartItems?.length]);

  if (!settings) return null;

  return (
    <>
      {/* 1. Google Analytics */}
      {settings.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {/* 2. Facebook Pixel */}
      {settings.facebookPixelId && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${settings.facebookPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* 4. Klaviyo Onsite Tracking */}
      {settings.klaviyoPublicKey && (
        <Script
          src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${settings.klaviyoPublicKey}`}
          strategy="lazyOnload"
        />
      )}
    </>
  );
}

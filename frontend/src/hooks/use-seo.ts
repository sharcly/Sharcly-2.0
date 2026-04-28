"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";

interface DefaultSeoData {
  title?: string;
  description?: string;
  ogImage?: string;
}

export function useSeo(pageSlug: string, defaultData?: DefaultSeoData) {
  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const slugToFetch = pageSlug === "/" || pageSlug === "home" ? "home" : pageSlug;
        const { data } = await apiClient.get(`/seo/page/${slugToFetch}`);
        let seo = data.seo;

        // Fallback for "/" if "home" not found
        if (!seo && slugToFetch === "home") {
          const fallbackRes = await apiClient.get(`/seo/page/%2F`); // %2F is /
          seo = fallbackRes.data.seo;
        }

        if (seo) {
          // Update Title
          document.title = seo.title || defaultData?.title || "Scarly 2.0";

          // Update Meta Description
          updateMetaTag('name', 'description', seo.description || defaultData?.description);
          
          // Update Keywords
          updateMetaTag('name', 'keywords', seo.keywords);

          // robots
          updateMetaTag('name', 'robots', seo.robots || "index, follow");
          
          // OG Tags
          updateMetaTag('property', 'og:title', seo.ogTitle || seo.title || defaultData?.title);
          updateMetaTag('property', 'og:description', seo.ogDescription || seo.description || defaultData?.description);
          updateMetaTag('property', 'og:image', seo.ogImage || defaultData?.ogImage);
          updateMetaTag('property', 'og:type', 'website');
          updateMetaTag('property', 'og:url', typeof window !== 'undefined' ? window.location.href : '');

        } else if (defaultData) {
          // Fallback to defaults if no entry in DB
          if (defaultData.title) document.title = defaultData.title;
          updateMetaTag('name', 'description', defaultData.description);
          updateMetaTag('property', 'og:title', defaultData.title);
          updateMetaTag('property', 'og:description', defaultData.description);
          updateMetaTag('property', 'og:image', defaultData.ogImage);
        }
      } catch (err) {
        console.error(`SEO hook failed for ${pageSlug}:`, err);
        if (defaultData?.title) document.title = defaultData.title;
      }
    };

    fetchSeo();
  }, [pageSlug, JSON.stringify(defaultData)]);
}

function updateMetaTag(attrName: string, attrValue: string, content?: string) {
  if (!content) return;
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

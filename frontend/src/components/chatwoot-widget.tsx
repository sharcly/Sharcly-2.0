"use client";

import { useEffect, useCallback, useState } from "react";
import Script from "next/script";
import { useAuth } from "@/context/auth-context";

declare global {
  interface Window {
    chatwootSDK: any;
    $chatwoot: any;
    chatwootSettings: any;
  }
}

const ChatwootWidget = () => {
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || "https://app.chatwoot.com";
  const WEBSITE_TOKEN = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || "BJRbE6R69GvnzbZaarcRKL8a";

  const identifyUser = useCallback(() => {
    if (window.$chatwoot && user) {
      window.$chatwoot.setUser(user.id, {
        email: user.email,
        name: user.name,
      });
    }
  }, [user]);

  useEffect(() => {
    if (isReady) {
      identifyUser();
    }
  }, [isReady, identifyUser]);

  useEffect(() => {
    // Re-identify if user changes (log in/out) after initial load
    if (window.$chatwoot) {
      if (user) {
        identifyUser();
      } else if (typeof window.$chatwoot.reset === "function") {
        window.$chatwoot.reset();
      }
    }
  }, [user, identifyUser]);

  return (
    <Script
      id="chatwoot-script"
      src={BASE_URL + "/packs/js/sdk.js"}
      strategy="afterInteractive"
      onLoad={() => {
        window.chatwootSettings = {
          hideMessageBubble: false,
          position: "right",
          locale: "en",
          type: "standard",
        };
        window.chatwootSDK.run({
          websiteToken: WEBSITE_TOKEN,
          baseUrl: BASE_URL,
        });
        setIsReady(true);
      }}
    />
  );
};

export default ChatwootWidget;

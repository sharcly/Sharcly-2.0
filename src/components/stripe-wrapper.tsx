"use client";

import React, { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useThemeSettings } from "@/components/theme-provider";

export function StripeWrapper({ 
  children, 
  publishableKey 
}: { 
  children: React.ReactNode; 
  publishableKey?: string;
}) {
  const { settings } = useThemeSettings();
  
  // Re-initialize stripePromise dynamically when the publishable key changes
  const stripePromise = useMemo(() => {
    const key = publishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder";
    return loadStripe(key);
  }, [publishableKey]);

  const options = {
    appearance: {
      theme: 'none' as const,
      variables: {
        colorPrimary: settings?.primaryColor || '#062D1B',
        colorBackground: '#ffffff',
        colorText: '#062D1B',
        colorDanger: '#df1b41',
        fontFamily: 'Instrument Sans, sans-serif',
        spacingUnit: '4px',
        borderRadius: '16px',
      },
      rules: {
        '.Input': {
          border: '2px solid rgba(0,0,0,0.03)',
          padding: '16px',
          boxShadow: 'none',
        },
        '.Input:focus': {
          border: '2px solid #062D1B',
          boxShadow: '0 10px 40px -10px rgba(6,45,27,0.1)',
        }
      }
    }
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

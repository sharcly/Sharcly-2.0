"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useThemeSettings } from "@/components/theme-provider";

// Placeholder Publishable Key - Should be in .env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

export function StripeWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useThemeSettings();
  
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
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}

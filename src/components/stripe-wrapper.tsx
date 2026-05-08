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
      theme: 'flat' as const,
      variables: {
        colorPrimary: settings?.primaryColor || '#062D1B',
        colorBackground: '#ffffff',
        colorText: '#062D1B',
        colorDanger: '#df1b41',
        fontFamily: 'Outfit, sans-serif',
        spacingUnit: '4px',
        borderRadius: '12px',
      }
    }
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

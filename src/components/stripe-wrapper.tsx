"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useThemeSettings } from "@/components/theme-provider";

// Placeholder Publishable Key - Should be in .env
const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!STRIPE_KEY) {
  console.warn("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing. Stripe will not initialize correctly.");
}
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

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

  if (!stripePromise) {
    return <>{children}</>;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string | { amount: number; currency_code: string }) {
  if (typeof price === 'object') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency_code || 'USD',
    }).format(price.amount / 100)
  }
  
  const amount = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

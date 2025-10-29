import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, locale: string = 'pt-PT'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function getSpiceLevelIcon(level: number): string {
  const icons = ['', '🌶️', '🌶️🌶️', '🔥'];
  return icons[level] || '';
}

export function getSpiceLevelLabel(
  level: number,
  locale: string = 'pt'
): string {
  const labels = {
    pt: ['Sem Picância', 'Suave', 'Picante', 'Muito Picante'],
    en: ['No Spice', 'Mild', 'Spicy', 'Very Spicy'],
  };
  return labels[locale as 'pt' | 'en'][level] || '';
}
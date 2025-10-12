import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './global.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Rana's Twist - Menu Digital",
  description: 'Culinária Indiana de Autor em São Domingos de Rana',
  keywords: 'restaurante indiano, lisboa, oeiras, rana, menu digital, qr code',
  authors: [{ name: "Rana's Twist" }],
  openGraph: {
    title: "Rana's Twist - Menu Digital",
    description: 'Culinária Indiana de Autor em São Domingos de Rana',
    type: 'website',
    locale: 'pt_PT',
    siteName: "Rana's Twist",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

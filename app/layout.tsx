import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt' suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
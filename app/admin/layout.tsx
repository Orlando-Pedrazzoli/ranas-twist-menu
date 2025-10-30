import { ThemeProvider } from '@/components/providers/theme-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
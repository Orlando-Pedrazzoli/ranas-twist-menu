import { ThemeProvider } from '@/components/providers/theme-provider';
import { getSession } from '@/lib/utils/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || !session.admin) {
    redirect('/admin/login');
  }
  return <ThemeProvider>{children}</ThemeProvider>;
}
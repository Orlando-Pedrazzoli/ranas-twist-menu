'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '@/components/providers/theme-provider';

export function AdminProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar autenticação no cliente
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setIsChecking(false);
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <ThemeProvider>{children}</ThemeProvider>;
}
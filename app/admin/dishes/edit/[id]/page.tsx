'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { DishForm } from '@/components/admin/DishForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditDishPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [dish, setDish] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDish();
  }, []);

  const fetchDish = async () => {
    try {
      const response = await fetch('/api/dishes');
      const data = await response.json();
      
      if (data.success) {
        const foundDish = data.dishes.find((d: any) => d._id === resolvedParams.id);
        setDish(foundDish);
      }
    } catch (error) {
      console.error('Error fetching dish:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/dishes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: resolvedParams.id, ...data }),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        throw new Error('Failed to update dish');
      }
    } catch (error) {
      console.error('Error updating dish:', error);
      alert('Erro ao atualizar prato');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Prato não encontrado</p>
          <Link href="/admin/dashboard">
            <Button className="mt-4">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Editar Prato</h1>
              <p className="text-sm text-muted-foreground">{dish.name.pt}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Prato</CardTitle>
            <CardDescription>Atualize os campos necessários</CardDescription>
          </CardHeader>
          <CardContent>
            <DishForm dish={dish} onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
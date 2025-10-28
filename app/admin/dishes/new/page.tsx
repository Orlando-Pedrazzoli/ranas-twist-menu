'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DishForm } from '@/components/admin/DishForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewDishPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        throw new Error('Failed to create dish');
      }
    } catch (error) {
      console.error('Error creating dish:', error);
      alert('Erro ao criar prato');
    }
  };

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
              <h1 className="text-2xl font-bold">Novo Prato</h1>
              <p className="text-sm text-muted-foreground">Adicione um novo prato ao menu</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Prato</CardTitle>
            <CardDescription>Preencha todos os campos obrigatórios</CardDescription>
          </CardHeader>
          <CardContent>
            <DishForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DishTable } from '@/components/admin/DishTable';
import { Plus, Search, LogOut, Eye } from 'lucide-react';
import Link from 'next/link';

interface Dish {
  _id: string;
  name: { pt: string; en: string };
  description: { pt: string; en: string };
  category: { _id: string; name: { pt: string; en: string } };
  price: number;
  available: boolean;
  images?: Array<{ url: string }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDishes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = dishes.filter(dish =>
        dish.name.pt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.category.name.pt.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDishes(filtered);
    } else {
      setFilteredDishes(dishes);
    }
  }, [searchTerm, dishes]);

  const fetchDishes = async () => {
    try {
      const response = await fetch('/api/dishes');
      const data = await response.json();
      if (data.success) {
        setDishes(data.dishes);
        setFilteredDishes(data.dishes);
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este prato?')) return;

    try {
      const response = await fetch(`/api/dishes?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDishes();
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const stats = {
    total: dishes.length,
    available: dishes.filter(d => d.available).length,
    unavailable: dishes.filter(d => !d.available).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Rana's Twist Admin</h1>
              <p className="text-sm text-muted-foreground">Dashboard de Gestão</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/pt" target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Menu
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Pratos</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Disponíveis</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.available}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Indisponíveis</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.unavailable}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Dishes Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Gestão de Pratos</CardTitle>
                <CardDescription>Adicione, edite ou remova pratos do menu</CardDescription>
              </div>
              <Link href="/admin/dishes/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Prato
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Pesquisar pratos..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Carregando...</p>
              </div>
            ) : (
              <DishTable 
                dishes={filteredDishes} 
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
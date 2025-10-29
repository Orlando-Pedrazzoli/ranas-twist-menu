'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface Category {
  _id: string;
  name: { pt: string; en: string };
}

interface DishFormProps {
  dish?: any;
  onSubmit: (data: any) => void;
}

export function DishForm({ dish, onSubmit }: DishFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: { pt: '', en: '' },
    description: { pt: '', en: '' },
    category: '',
    price: 0,
    images: [] as Array<{ url: string; isPrimary: boolean }>,
    dietaryInfo: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      halal: true,
    },
    spiceLevel: 0,
    available: true,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchCategories();
    if (dish) {
      setFormData({
        name: dish.name,
        description: dish.description,
        category: dish.category._id || dish.category,
        price: dish.price || 0,
        images: dish.images || [],
        dietaryInfo: dish.dietaryInfo || {
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          dairyFree: false,
          halal: true,
        },
        spiceLevel: dish.spiceLevel || 0,
        available: dish.available,
        displayOrder: dish.displayOrder || 0,
      });
    }
  }, [dish]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
        if (!dish && data.categories.length > 0) {
          setFormData(prev => ({ ...prev, category: data.categories[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { url: data.url, isPrimary: prev.images.length === 0 }],
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handlePriceChange = (value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      price: isNaN(numValue) ? 0 : numValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name-pt">Nome (Português) *</Label>
          <Input
            id="name-pt"
            value={formData.name.pt}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              name: { ...prev.name, pt: e.target.value }
            }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name-en">Nome (English) *</Label>
          <Input
            id="name-en"
            value={formData.name.en}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              name: { ...prev.name, en: e.target.value }
            }))}
            required
          />
        </div>
      </div>

      {/* Descrição */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="desc-pt">Descrição (Português) *</Label>
          <textarea
            id="desc-pt"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.description.pt}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              description: { ...prev.description, pt: e.target.value }
            }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desc-en">Descrição (English) *</Label>
          <textarea
            id="desc-en"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.description.en}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              description: { ...prev.description, en: e.target.value }
            }))}
            required
          />
        </div>
      </div>

      {/* Categoria e Preço */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <select
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            required
          >
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name.pt}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Preço (€) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price || ''}
            onChange={(e) => handlePriceChange(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Imagens */}
      <div className="space-y-2">
        <Label>Imagens</Label>
        <div className="flex flex-wrap gap-4">
          {formData.images.map((img, index) => (
            <div key={index} className="relative group">
              <Image
                src={img.url}
                alt="Dish"
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-muted-foreground" />
            )}
          </label>
        </div>
      </div>

      {/* Dietary Info */}
      <div className="space-y-2">
        <Label>Informação Dietética</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.dietaryInfo.vegetarian}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                dietaryInfo: { ...prev.dietaryInfo, vegetarian: e.target.checked }
              }))}
              className="rounded"
            />
            <span className="text-sm">Vegetariano</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.dietaryInfo.vegan}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                dietaryInfo: { ...prev.dietaryInfo, vegan: e.target.checked }
              }))}
              className="rounded"
            />
            <span className="text-sm">Vegano</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.dietaryInfo.glutenFree}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                dietaryInfo: { ...prev.dietaryInfo, glutenFree: e.target.checked }
              }))}
              className="rounded"
            />
            <span className="text-sm">Sem Glúten</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.dietaryInfo.dairyFree}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                dietaryInfo: { ...prev.dietaryInfo, dairyFree: e.target.checked }
              }))}
              className="rounded"
            />
            <span className="text-sm">Sem Lactose</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.dietaryInfo.halal}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                dietaryInfo: { ...prev.dietaryInfo, halal: e.target.checked }
              }))}
              className="rounded"
            />
            <span className="text-sm">Halal</span>
          </label>
        </div>
      </div>

      {/* Spice Level */}
      <div className="space-y-2">
        <Label htmlFor="spiceLevel">Nível de Picância</Label>
        <select
          id="spiceLevel"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.spiceLevel}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            spiceLevel: parseInt(e.target.value) 
          }))}
        >
          <option value="0">Sem Picância</option>
          <option value="1">🌶️ Suave</option>
          <option value="2">🌶️🌶️ Picante</option>
          <option value="3">🔥 Muito Picante</option>
        </select>
      </div>

      {/* Available */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.available}
            onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm font-medium">Disponível no menu</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            dish ? 'Atualizar Prato' : 'Criar Prato'
          )}
        </Button>
      </div>
    </form>
  );
}
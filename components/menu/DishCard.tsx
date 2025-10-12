'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, getSpiceLevelIcon } from '@/lib/utils/cn';
import { Leaf, Wheat, Eye } from 'lucide-react';
import { useLocale } from 'next-intl';

interface DishProps {
  dish: {
    _id: string;
    name: { pt: string; en: string };
    description: { pt: string; en: string };
    price: number;
    compareAtPrice?: number;
    images?: Array<{ url: string; isPrimary?: boolean }>;
    dietaryInfo: {
      vegetarian?: boolean;
      vegan?: boolean;
      glutenFree?: boolean;
    };
    spiceLevel?: number;
    badges?: Array<{ type: string }>;
  };
  onViewDetails?: (dish: any) => void;
}

export function DishCard({ dish, onViewDetails }: DishProps) {
  const locale = useLocale() as 'pt' | 'en';
  const primaryImage = dish.images?.find(img => img.isPrimary) || dish.images?.[0];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {primaryImage && (
        <div className="relative h-48 w-full">
          <Image
            src={primaryImage.url}
            alt={dish.name[locale]}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {dish.compareAtPrice && (
            <Badge className="absolute top-2 right-2" variant="destructive">
              Promoção
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{dish.name[locale]}</CardTitle>
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-primary">
              {formatPrice(dish.price, locale === 'pt' ? 'pt-PT' : 'en-US')}
            </span>
            {dish.compareAtPrice && (
              <span className="text-sm line-through text-muted-foreground">
                {formatPrice(dish.compareAtPrice, locale === 'pt' ? 'pt-PT' : 'en-US')}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="mb-3">{dish.description[locale]}</CardDescription>
        
        {/* Dietary Info and Spice Level */}
        <div className="flex flex-wrap gap-1 mb-3">
          {dish.dietaryInfo.vegetarian && (
            <Badge variant="success" className="gap-1">
              <Leaf className="w-3 h-3" /> Vegetariano
            </Badge>
          )}
          {dish.dietaryInfo.vegan && (
            <Badge variant="success" className="gap-1">
              <Leaf className="w-3 h-3" /> Vegano
            </Badge>
          )}
          {dish.dietaryInfo.glutenFree && (
            <Badge variant="outline" className="gap-1">
              <Wheat className="w-3 h-3" /> Sem Glúten
            </Badge>
          )}
          {dish.spiceLevel && dish.spiceLevel > 0 && (
            <Badge variant="destructive">
              {getSpiceLevelIcon(dish.spiceLevel)}
            </Badge>
          )}
        </div>
        
        {/* Badges */}
        {dish.badges && dish.badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {dish.badges.map((badge, index) => (
              <Badge key={index} variant="warning">
                {badge.type === 'popular' && '🔥 Popular'}
                {badge.type === 'chef-special' && '👨‍🍳 Especial do Chef'}
                {badge.type === 'new' && '✨ Novo'}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      {onViewDetails && (
        <CardFooter>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => onViewDetails(dish)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

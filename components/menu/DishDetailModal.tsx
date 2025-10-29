'use client';

import React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatPrice, getSpiceLevelIcon } from '@/lib/utils/cn';
import { Leaf, Wheat, UtensilsCrossed, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';

interface DishDetailModalProps {
  dish: {
    _id: string;
    name: { pt: string; en: string };
    description: { pt: string; en: string };
    category?: string | { _id: string; name: { pt: string; en: string } };
    price: number;
    images?: Array<{ url: string; isPrimary?: boolean }>;
    dietaryInfo: {
      vegetarian?: boolean;
      vegan?: boolean;
      glutenFree?: boolean;
      dairyFree?: boolean;
      halal?: boolean;
    };
    spiceLevel?: number;
    badges?: Array<{ type: string }>;
    allergens?: string[];
  };
  open: boolean;
  onClose: () => void;
}

export function DishDetailModal({ dish, open, onClose }: DishDetailModalProps) {
  const locale = useLocale() as 'pt' | 'en';
  const primaryImage = dish.images?.find(img => img.isPrimary) || dish.images?.[0];

  const imageUrl = primaryImage?.url?.startsWith('/')
    ? primaryImage.url
    : primaryImage?.url || '/placeholder-food.jpg';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display pr-8">
            {dish.name[locale]}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {locale === 'pt' ? 'Detalhes do prato' : 'Dish details'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagem */}
          {primaryImage && (
            <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
              {imageUrl === '/placeholder-food.jpg' ? (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/20">
                  <span className="text-6xl">🍛</span>
                </div>
              ) : (
                <Image
                  src={imageUrl}
                  alt={dish.name[locale]}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              )}
            </div>
          )}

          {/* Preço e Badges */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {dish.badges && dish.badges.length > 0 && (
                <>
                  {dish.badges.map((badge, index) => (
                    <Badge key={index} variant="warning" className="text-xs">
                      {badge.type === 'popular' &&
                        (locale === 'pt' ? '🔥 Popular' : '🔥 Popular')}
                      {badge.type === 'chef-special' &&
                        (locale === 'pt' ? '👨‍🍳 Especial do Chef' : '👨‍🍳 Chef Special')}
                      {badge.type === 'new' &&
                        (locale === 'pt' ? '✨ Novo' : '✨ New')}
                    </Badge>
                  ))}
                </>
              )}
            </div>
            <div className="text-2xl font-bold text-primary shrink-0">
              {formatPrice(dish.price, locale === 'pt' ? 'pt-PT' : 'en-US')}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <h3 className="font-semibold text-lg mb-2">
              {locale === 'pt' ? 'Descrição' : 'Description'}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {dish.description[locale]}
            </p>
          </div>

          {/* Informação Dietética */}
          <div>
            <h3 className="font-semibold text-lg mb-3">
              {locale === 'pt' ? 'Informação Dietética' : 'Dietary Information'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {dish.dietaryInfo?.vegetarian && (
                <Badge variant="success" className="gap-1">
                  <Leaf className="w-3 h-3" />
                  {locale === 'pt' ? 'Vegetariano' : 'Vegetarian'}
                </Badge>
              )}
              {dish.dietaryInfo?.vegan && (
                <Badge variant="success" className="gap-1">
                  <Leaf className="w-3 h-3" />
                  {locale === 'pt' ? 'Vegano' : 'Vegan'}
                </Badge>
              )}
              {dish.dietaryInfo?.glutenFree && (
                <Badge variant="outline" className="gap-1">
                  <Wheat className="w-3 h-3" />
                  {locale === 'pt' ? 'Sem Glúten' : 'Gluten Free'}
                </Badge>
              )}
              {dish.dietaryInfo?.dairyFree && (
                <Badge variant="outline" className="gap-1">
                  <UtensilsCrossed className="w-3 h-3" />
                  {locale === 'pt' ? 'Sem Lactose' : 'Dairy Free'}
                </Badge>
              )}
              {dish.dietaryInfo?.halal && (
                <Badge variant="outline" className="gap-1">
                  <UtensilsCrossed className="w-3 h-3" />
                  {locale === 'pt' ? 'Halal' : 'Halal'}
                </Badge>
              )}
              {dish.spiceLevel !== undefined && dish.spiceLevel > 0 && (
                <Badge variant="outline" className="bg-white border-red-300 text-red-600">
                  {getSpiceLevelIcon(dish.spiceLevel)}
                  {' '}
                  {locale === 'pt' 
                    ? ['', 'Suave', 'Picante', 'Muito Picante'][dish.spiceLevel]
                    : ['', 'Mild', 'Spicy', 'Very Spicy'][dish.spiceLevel]
                  }
                </Badge>
              )}
            </div>
          </div>

          {/* Alérgenos */}
          {dish.allergens && dish.allergens.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {locale === 'pt' ? 'Alérgenos' : 'Allergens'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {dish.allergens.map((allergen, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botão de fechar no mobile */}
        <div className="flex justify-center pt-4 md:hidden">
          <Button onClick={onClose} variant="outline" className="w-full">
            {locale === 'pt' ? 'Fechar' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
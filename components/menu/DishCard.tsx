'use client';

import React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, getSpiceLevelIcon } from '@/lib/utils/cn';
import { Leaf, Wheat, Eye, UtensilsCrossed } from 'lucide-react';
import { useLocale } from 'next-intl';

interface DishProps {
  dish: {
    _id: string;
    name: { pt: string; en: string };
    description: { pt: string; en: string };
    category?: string | { _id: string; name: { pt: string; en: string } };
    price: number;
    compareAtPrice?: number;
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
  };
  onViewDetails?: (dish: any) => void;
}

export function DishCard({ dish, onViewDetails }: DishProps) {
  const locale = useLocale() as 'pt' | 'en';
  const primaryImage =
    dish.images?.find(img => img.isPrimary) || dish.images?.[0];

  // Check if image is a placeholder or actual URL
  const imageUrl = primaryImage?.url?.startsWith('/')
    ? primaryImage.url
    : primaryImage?.url || '/placeholder-food.jpg';

  return (
    <Card className='overflow-hidden hover:shadow-lg transition-all duration-300 card-hover'>
      {primaryImage && (
        <div className='relative aspect-square w-full bg-gray-100'>
          {imageUrl === '/placeholder-food.jpg' ? (
            <div className='flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/20'>
              <span className='text-4xl'>🍛</span>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={dish.name[locale]}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-food.jpg';
              }}
            />
          )}
          {dish.compareAtPrice && (
            <Badge className='absolute top-2 right-2' variant='destructive'>
              {locale === 'pt' ? 'Promoção' : 'Sale'}
            </Badge>
          )}
        </div>
      )}

      <CardHeader className='pb-3'>
        <div className='flex justify-between items-start gap-2'>
          <CardTitle className='text-lg line-clamp-1'>
            {dish.name[locale]}
          </CardTitle>
          <div className='flex flex-col items-end shrink-0'>
            <span className='text-lg font-bold text-primary'>
              {formatPrice(dish.price, locale === 'pt' ? 'pt-PT' : 'en-US')}
            </span>
            {dish.compareAtPrice && (
              <span className='text-xs line-through text-muted-foreground'>
                {formatPrice(
                  dish.compareAtPrice,
                  locale === 'pt' ? 'pt-PT' : 'en-US'
                )}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        <CardDescription className='mb-3 line-clamp-2'>
          {dish.description[locale]}
        </CardDescription>

        {/* Dietary Info and Spice Level */}
        <div className='flex flex-wrap gap-1 mb-3'>
          {dish.dietaryInfo?.vegetarian && (
            <Badge variant='success' className='gap-1 text-xs'>
              <Leaf className='w-3 h-3' />
              {locale === 'pt' ? 'Vegetariano' : 'Vegetarian'}
            </Badge>
          )}
          {dish.dietaryInfo?.vegan && (
            <Badge variant='success' className='gap-1 text-xs'>
              <Leaf className='w-3 h-3' />
              {locale === 'pt' ? 'Vegano' : 'Vegan'}
            </Badge>
          )}
          {dish.dietaryInfo?.glutenFree && (
            <Badge variant='outline' className='gap-1 text-xs'>
              <Wheat className='w-3 h-3' />
              {locale === 'pt' ? 'Sem Glúten' : 'Gluten Free'}
            </Badge>
          )}
          {dish.dietaryInfo?.dairyFree && (
            <Badge variant='outline' className='gap-1 text-xs'>
              <UtensilsCrossed className='w-3 h-3' />
              {locale === 'pt' ? 'Sem Lactose' : 'Dairy Free'}
            </Badge>
          )}
          {dish.dietaryInfo?.halal && (
            <Badge variant='outline' className='gap-1 text-xs'>
              <UtensilsCrossed className='w-3 h-3' />
              {locale === 'pt' ? 'Halal' : 'Halal'}
            </Badge>
          )}
          {dish.spiceLevel !== undefined && dish.spiceLevel > 0 && (
            <Badge variant='outline' className='text-xs bg-white border-red-300 text-red-600'>
              {getSpiceLevelIcon(dish.spiceLevel)}
            </Badge>
          )}
        </div>

        {/* Badges */}
        {dish.badges && dish.badges.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {dish.badges.map((badge, index) => (
              <Badge key={index} variant='warning' className='text-xs'>
                {badge.type === 'popular' &&
                  (locale === 'pt' ? '🔥 Popular' : '🔥 Popular')}
                {badge.type === 'chef-special' &&
                  (locale === 'pt' ? '👨‍🍳 Especial do Chef' : '👨‍🍳 Chef Special')}
                {badge.type === 'new' &&
                  (locale === 'pt' ? '✨ Novo' : '✨ New')}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {onViewDetails && (
        <CardFooter className='pt-0'>
          <Button
            className='w-full'
            variant='outline'
            size='sm'
            onClick={() => onViewDetails(dish)}
          >
            <Eye className='w-4 h-4 mr-2' />
            {locale === 'pt' ? 'Ver Detalhes' : 'View Details'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
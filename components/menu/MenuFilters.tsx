'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Leaf, Flame, Wheat, UtensilsCrossed } from 'lucide-react';

interface MenuFiltersProps {
  filters: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    halal: boolean;
    dairyFree: boolean;
    spiceLevel: number[];
  };
  onFilterChange: (filters: any) => void;
}

export function MenuFilters({ filters, onFilterChange }: MenuFiltersProps) {
  const t = useTranslations('menu');

  const toggleDietaryFilter = (key: 'vegetarian' | 'vegan' | 'glutenFree' | 'halal' | 'dairyFree') => {
    onFilterChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  const toggleSpiceLevel = (level: number) => {
    const newLevels = filters.spiceLevel.includes(level)
      ? filters.spiceLevel.filter(l => l !== level)
      : [...filters.spiceLevel, level];

    onFilterChange({
      ...filters,
      spiceLevel: newLevels,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      halal: false,
      dairyFree: false,
      spiceLevel: [],
    });
  };

  const activeFiltersCount =
    (filters.vegetarian ? 1 : 0) +
    (filters.vegan ? 1 : 0) +
    (filters.glutenFree ? 1 : 0) +
    (filters.halal ? 1 : 0) +
    (filters.dairyFree ? 1 : 0) +
    filters.spiceLevel.length;

  return (
    <div className='space-y-4 p-4 bg-card rounded-lg border'>
      <div className='flex items-center justify-between'>
        <Label className='text-base font-semibold'>{t('filters')}</Label>
        {activeFiltersCount > 0 && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearFilters}
            className='text-xs'
          >
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Dietary Filters */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium mb-2 block'>Dietary</Label>
        <div className='flex flex-col gap-2'>
          <Button
            variant={filters.vegetarian ? 'default' : 'outline'}
            size='sm'
            onClick={() => toggleDietaryFilter('vegetarian')}
            className='justify-start gap-2'
          >
            <Leaf className='w-4 h-4' />
            {t('vegetarian')}
          </Button>

          <Button
            variant={filters.vegan ? 'default' : 'outline'}
            size='sm'
            onClick={() => toggleDietaryFilter('vegan')}
            className='justify-start gap-2'
          >
            <Leaf className='w-4 h-4' />
            {t('vegan')}
          </Button>

          <Button
            variant={filters.glutenFree ? 'default' : 'outline'}
            size='sm'
            onClick={() => toggleDietaryFilter('glutenFree')}
            className='justify-start gap-2'
          >
            <Wheat className='w-4 h-4' />
            {t('glutenFree')}
          </Button>

          <Button
            variant={filters.halal ? 'default' : 'outline'}
            size='sm'
            onClick={() => toggleDietaryFilter('halal')}
            className='justify-start gap-2'
          >
            <UtensilsCrossed className='w-4 h-4' />
            {t('halal')}
          </Button>

          <Button
            variant={filters.dairyFree ? 'default' : 'outline'}
            size='sm'
            onClick={() => toggleDietaryFilter('dairyFree')}
            className='justify-start gap-2'
          >
            <UtensilsCrossed className='w-4 h-4' />
            {t('dairyFree')}
          </Button>
        </div>
      </div>

      {/* Spice Level Filters */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium mb-2 block'>
          {t('spiceLevel')}
        </Label>
        <div className='grid grid-cols-2 gap-2'>
          {[0, 1, 2, 3, 4].map(level => {
            const labels = {
              0: { icon: '😌', text: t('mild') },
              1: { icon: '🌶️', text: 'Suave' },
              2: { icon: '🌶️🌶️', text: t('medium') },
              3: { icon: '🌶️🌶️🌶️', text: t('hot') },
              4: { icon: '🔥', text: t('veryHot') },
            };

            return (
              <Button
                key={level}
                variant={
                  filters.spiceLevel.includes(level) ? 'default' : 'outline'
                }
                size='sm'
                onClick={() => toggleSpiceLevel(level)}
                className='text-xs'
              >
                <span className='mr-1'>
                  {labels[level as keyof typeof labels].icon}
                </span>
                <span className='truncate'>
                  {labels[level as keyof typeof labels].text}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
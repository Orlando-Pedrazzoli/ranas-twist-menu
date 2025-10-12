'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Leaf, Flame, Wheat } from 'lucide-react';

interface MenuFiltersProps {
  filters: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    spiceLevel: number[];
  };
  onFilterChange: (filters: any) => void;
}

export function MenuFilters({ filters, onFilterChange }: MenuFiltersProps) {
  const t = useTranslations('menu');

  const toggleDietaryFilter = (key: 'vegetarian' | 'vegan' | 'glutenFree') => {
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

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold mb-3 block">{t('filters')}</Label>
        
        {/* Dietary Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={filters.vegetarian ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleDietaryFilter('vegetarian')}
            className="gap-1"
          >
            <Leaf className="w-4 h-4" />
            {t('vegetarian')}
          </Button>
          
          <Button
            variant={filters.vegan ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleDietaryFilter('vegan')}
            className="gap-1"
          >
            <Leaf className="w-4 h-4" />
            {t('vegan')}
          </Button>
          
          <Button
            variant={filters.glutenFree ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleDietaryFilter('glutenFree')}
            className="gap-1"
          >
            <Wheat className="w-4 h-4" />
            {t('glutenFree')}
          </Button>
        </div>
        
        {/* Spice Level Filters */}
        <div>
          <Label className="text-sm font-medium mb-2 block">{t('spiceLevel')}</Label>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4].map(level => (
              <Button
                key={level}
                variant={filters.spiceLevel.includes(level) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSpiceLevel(level)}
                className="gap-1"
              >
                {level === 0 && '😌'}
                {level === 1 && '🌶️'}
                {level === 2 && '🌶️🌶️'}
                {level === 3 && '🌶️🌶️🌶️'}
                {level === 4 && '🔥🔥🔥'}
                {level === 0 && t('mild')}
                {level === 1 && 'Suave'}
                {level === 2 && t('medium')}
                {level === 3 && t('hot')}
                {level === 4 && t('veryHot')}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

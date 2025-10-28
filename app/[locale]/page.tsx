'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Input } from '@/components/ui/input';
import { DishCard } from '@/components/menu/DishCard';
import { MenuFilters } from '@/components/menu/MenuFilters';
import { Button } from '@/components/ui/button';
import { Search, Globe, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Fuse from 'fuse.js';

interface Dish {
  _id: string;
  name: { pt: string; en: string };
  description: { pt: string; en: string };
  category: string | { _id: string; name: { pt: string; en: string } } | null;
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
  allergens?: string[];
  spiceLevel?: number;
  badges?: Array<{ type: string }>;
  searchTags?: string[];
  available: boolean;
}

interface Category {
  _id: string;
  name: { pt: string; en: string };
  slug: string;
  order: number;
  active: boolean;
}

export default function MenuPage() {
  const t = useTranslations();
  const locale = useLocale() as 'pt' | 'en';

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    dairyFree: false,
    spiceLevel: [] as number[],
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/menu');

      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }

      const data = await response.json();
      setDishes(data.dishes || []);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setError('Failed to load menu. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(dishes, {
      keys: [`name.${locale}`, `description.${locale}`, 'searchTags'],
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [dishes, locale]);

  // Filter and search dishes
  const filteredDishes = useMemo(() => {
    let result = dishes;

    // Category filter - FIX: Handle string, object, null, and undefined
    if (selectedCategory !== 'all') {
      result = result.filter(dish => {
        if (!dish.category) return false; // Skip dishes without category
        
        const categoryId = typeof dish.category === 'string' 
          ? dish.category 
          : dish.category._id;
        
        return categoryId === selectedCategory;
      });
    }

    // Dietary filters
    if (filters.vegetarian) {
      result = result.filter(dish => dish.dietaryInfo?.vegetarian);
    }
    if (filters.vegan) {
      result = result.filter(dish => dish.dietaryInfo?.vegan);
    }
    if (filters.glutenFree) {
      result = result.filter(dish => dish.dietaryInfo?.glutenFree);
    }
    if (filters.halal) {
      result = result.filter(dish => dish.dietaryInfo?.halal);
    }
    if (filters.dairyFree) {
      result = result.filter(dish => dish.dietaryInfo?.dairyFree);
    }

    // Spice level filter
    if (filters.spiceLevel.length > 0) {
      result = result.filter(dish =>
        filters.spiceLevel.includes(dish.spiceLevel || 0)
      );
    }

    // Search
    if (searchTerm) {
      const searchResults = fuse.search(searchTerm);
      const searchIds = searchResults.map(r => r.item._id);
      result = result.filter(dish => searchIds.includes(dish._id));
    }

    return result;
  }, [dishes, selectedCategory, filters, searchTerm, fuse]);

  const handleViewDetails = (dish: Dish) => {
    // TODO: Implement modal or navigation to dish details
    console.log('View details:', dish);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>{t('menu.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-primary font-display'>
                {t('restaurant.name')}
              </h1>
              <p className='text-sm text-muted-foreground'>
                {t('restaurant.tagline')}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              {/* Language Switcher */}
              <Link href={locale === 'pt' ? '/en' : '/pt'}>
                <Button variant='ghost' size='sm'>
                  <Globe className='w-4 h-4 mr-2' />
                  {locale === 'pt' ? 'EN' : 'PT'}
                </Button>
              </Link>

              {/* Admin Link */}
              <Link href='/admin'>
                <Button variant='ghost' size='sm'>
                  Admin
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant='ghost'
                size='sm'
                className='lg:hidden'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className='w-5 h-5' />
                ) : (
                  <Menu className='w-5 h-5' />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className='container mx-auto px-4 py-4'>
        <div className='relative max-w-md mx-auto'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4' />
          <Input
            type='search'
            placeholder={t('menu.search')}
            className='pl-10'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className='border-b'>
        <div className='container mx-auto px-4'>
          <div className='flex gap-2 overflow-x-auto py-2 scrollbar-hide'>
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setSelectedCategory('all')}
              className='whitespace-nowrap'
            >
              {locale === 'pt' ? 'Todos' : 'All'}
            </Button>
            {categories.map(category => (
              <Button
                key={category._id}
                variant={
                  selectedCategory === category._id ? 'default' : 'ghost'
                }
                size='sm'
                onClick={() => setSelectedCategory(category._id)}
                className='whitespace-nowrap'
              >
                {category.name[locale]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6'>
        <div className='grid lg:grid-cols-4 gap-6'>
          {/* Filters Sidebar - Desktop */}
          <div
            className={`lg:col-span-1 ${
              mobileMenuOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className='sticky top-24'>
              <MenuFilters filters={filters} onFilterChange={setFilters} />
            </div>
          </div>

          {/* Dishes Grid */}
          <div className='lg:col-span-3'>
            {error && (
              <div className='bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4'>
                {error}
              </div>
            )}

            {filteredDishes.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-muted-foreground'>{t('menu.noResults')}</p>
              </div>
            ) : (
              <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredDishes.map(dish => (
                  <DishCard
                    key={dish._id}
                    dish={dish}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='border-t mt-12'>
        <div className='container mx-auto px-4 py-6'>
          <div className='text-center text-sm text-muted-foreground'>
            <p>{t('restaurant.address')}</p>
            <p>{t('restaurant.city')}</p>
            <p className='mt-2'>{t('restaurant.hours')}</p>
            <p className='mt-4'>{t('footer.copyright')}</p>
            <p className='mt-1'>{t('footer.madeWith')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
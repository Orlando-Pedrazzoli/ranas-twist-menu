import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Dish from '@/models/Dish';
import Category from '@/models/Category';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Buscar todas as categorias ativas
    const categories = await Category.find({ active: true }).sort({ order: 1 });
    
    // Buscar todos os pratos disponíveis com suas categorias populadas
    const dishes = await Dish.find({ available: true })
      .populate('category')
      .sort({ displayOrder: 1, createdAt: -1 });
    
    return NextResponse.json({
      dishes,
      categories,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu', success: false },
      { status: 500 }
    );
  }
}
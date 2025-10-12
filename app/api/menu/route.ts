import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Dish from '@/models/Dish';
import Category from '@/models/Category';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const dishes = await Dish.find({ available: true })
      .populate('category')
      .sort({ displayOrder: 1, createdAt: -1 });
      
    const categories = await Category.find({ active: true })
      .sort({ order: 1 });
    
    return NextResponse.json({ 
      dishes, 
      categories,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const dish = new Dish(body);
    await dish.save();
    
    return NextResponse.json({ 
      dish,
      success: true 
    });
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json(
      { error: 'Failed to create dish', success: false },
      { status: 500 }
    );
  }
}

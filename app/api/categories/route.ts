import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({ active: true }).sort({ order: 1 });
    return NextResponse.json({ categories, success: true });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', success: false },
      { status: 500 }
    );
  }
}
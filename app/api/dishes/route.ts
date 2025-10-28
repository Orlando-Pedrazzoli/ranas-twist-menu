import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Dish from '@/models/Dish';
import Category from '@/models/Category';  // ← ADICIONAR ESTA LINHA
import { isAdmin } from '@/lib/utils/auth';

export async function GET() {
  try {
    await dbConnect();
    const dishes = await Dish.find().populate('category').sort({ displayOrder: 1 });
    return NextResponse.json({ dishes, success: true });
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dishes', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    const dish = await Dish.create(body);
    
    return NextResponse.json({ dish, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json(
      { error: 'Failed to create dish', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { _id, ...data } = await request.json();
    
    const dish = await Dish.findByIdAndUpdate(_id, data, { new: true });
    
    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }
    
    return NextResponse.json({ dish, success: true });
  } catch (error) {
    console.error('Error updating dish:', error);
    return NextResponse.json(
      { error: 'Failed to update dish', success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const dish = await Dish.findByIdAndDelete(id);
    
    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return NextResponse.json(
      { error: 'Failed to delete dish', success: false },
      { status: 500 }
    );
  }
}
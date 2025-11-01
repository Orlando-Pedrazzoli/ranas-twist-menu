import { NextResponse } from 'next/server';
import { getSession } from '@/lib/utils/auth';

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({ 
      authenticated: session?.admin === true 
    });
  } catch (error) {
    return NextResponse.json({ 
      authenticated: false 
    });
  }
}
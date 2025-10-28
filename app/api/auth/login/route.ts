import { NextResponse } from 'next/server';
import { login } from '@/lib/utils/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const result = await login(username, password);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
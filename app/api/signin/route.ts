import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';


export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: 'Email and password are required' },
      { status: 400 }
    );
  }

  try {
    const token = jwt.sign({ email }, process.env.SECRET_KEY!, { expiresIn: '7d' });

    const res = NextResponse.json(
      { success: true, message: 'Sign in successful' },
      { status: 200 }
    );

    res.cookies.set({
      name: 'pulsey-auth-token',
      value: token,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}

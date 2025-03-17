import { fallbackData } from '@/lib/api';
import { verifySession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verify the user is authenticated
    const session = await verifySession();
    if (!session) {
      return new NextResponse(null, { status: 401 });
    }
    return NextResponse.json(fallbackData);
  } catch (error) {
    console.error('Error in player-stats API route:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }

    return NextResponse.json(fallbackData);
  }
}

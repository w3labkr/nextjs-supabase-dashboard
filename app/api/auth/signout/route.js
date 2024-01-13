import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/auth';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  console.log(session);
  return NextResponse.json({
    user: {
      name: 'Rohit Kumar Khatri',
      email: 'er.rohitkumar@outlook.com',
      image: 'https://avatars.githubusercontent.com/u/34018015?v=4',
    },
  });
}

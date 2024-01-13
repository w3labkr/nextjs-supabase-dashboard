import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  return session
    ? new Response('Welcome authenticated user', { status: 200 })
    : new Response('Unauthorized access detected', { status: 401 });
}

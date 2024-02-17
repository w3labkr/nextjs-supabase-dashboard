import { NextResponse, type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({ results })
}

const results = [
  {
    id: 1,
    title: 'Your call has been confirmed.',
    description: '1 hour ago',
  },
  {
    id: 2,
    title: 'You have a new message!',
    description: '1 hour ago',
  },
  {
    id: 3,
    title: 'Your subscription is expiring soon!',
    description: '2 hours ago',
  },
]

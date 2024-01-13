import { NextResponse } from 'next/server';
import jsonData from '@/data/jsonplaceholder.typicode.com/comments.json';

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get('page') * 1;
  const per_page = searchParams.get('per_page') * 1;
  const start_page = (page - 1) * per_page;
  const end_page = start_page + per_page;

  let data = jsonData.slice(start_page, end_page);

  return NextResponse.json(data);
}

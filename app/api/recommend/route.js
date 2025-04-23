import { NextResponse } from 'next/server';
import { extractKeywords } from '@/lib/extractKeywords';
import { searchJobs } from '@/lib/adzuna';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('resume');

  if (!file || typeof file.arrayBuffer !== 'function') {
    return NextResponse.json({ error: 'Invalid file upload' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const text = buffer.toString('utf-8'); // plain text files only

  const keywords = extractKeywords(text);
  const jobs = await searchJobs(keywords.join(' '));

  return NextResponse.json({ jobs });
}

import { NextResponse } from 'next/server';
import { runFullAnalysis } from '../../../lib/analysis';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const audioFile = formData.get('audio') as File | null;


  if (!audioFile) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
  }
  if (!audioFile.name.endsWith('.webm')) {
    return NextResponse.json({ error: 'Only .webm files are allowed' }, { status: 400 });
  }

  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    
    const fileBuffer = Buffer.from(arrayBuffer);
    
    const result = await runFullAnalysis(fileBuffer);
    
    return NextResponse.json({ status: 'completed', data: result });
  } catch (error: any) {
    console.error('Error processing file:', error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}

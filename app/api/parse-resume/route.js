import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export async function POST(request) {
  try {
    // Check if the request contains form data
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Invalid content type. Expected multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    let text = '';
    
    // Handle PDF files
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdfParse(buffer);
      text = data.text;
    } 
    // Handle Word documents
    else if (
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractText({ arrayBuffer });
      text = result.value;
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or Word document' },
        { status: 400 }
      );
    }

    // Simple keyword extraction
    const lines = text.split('\n');
    let position = '';
    let experience = '';

    // Try to extract position (often in first few lines)
    if (lines.length > 0) {
      const firstLines = lines.slice(0, 3).join(' ').toLowerCase();
      if (firstLines.includes('engineer')) position = 'Engineer';
      else if (firstLines.includes('developer')) position = 'Developer';
      else if (firstLines.includes('analyst')) position = 'Analyst';
    }

    // Try to extract experience
    const experienceRegex = /(\d+)\s*(years?|yrs?)/i;
    for (const line of lines) {
      const expMatch = line.match(experienceRegex);
      if (expMatch) {
        experience = expMatch[1];
        break;
      }
    }

    return NextResponse.json({
      success: true,
      text,
      position,
      experience
    });

  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process resume',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
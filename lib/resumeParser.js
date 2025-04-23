// This is now server-side only, so we can keep the original imports
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromResume(buffer) {
  let text = '';

  try {
    // For PDF files
    if (buffer instanceof Buffer) {
      const data = await pdfParse(buffer);
      text = data.text;
    } 
    // For Word files
    else if (buffer instanceof ArrayBuffer) {
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      text = result.value;
    }

    return extractKeywords(text);
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume');
  }
}

// Keep the existing extractKeywords function
// ...

export async function extractKeywords(text) {
  // Simple keyword extraction - you might want to use a more sophisticated NLP approach
  const lines = text.split('\n');
  const skills = [];
  let position = '';
  let experience = '';

  // Common tech skills keywords
  const techKeywords = [
    'javascript', 'react', 'node', 'python', 'java', 'sql', 
    'html', 'css', 'typescript', 'aws', 'docker', 'kubernetes',
    'machine learning', 'ai', 'data analysis', 'frontend', 'backend'
  ];

  // Check for position title (often at the top of resume)
  if (lines.length > 0) {
    const firstLine = lines[0].toLowerCase();
    if (firstLine.includes('engineer')) {
      position = firstLine;
    } else if (firstLine.includes('developer')) {
      position = firstLine;
    } else if (firstLine.includes('analyst')) {
      position = firstLine;
    }
  }

  // Check for experience (looking for patterns like "5 years")
  const experienceRegex = /(\d+)\s*(years?|yrs?)/i;
  for (const line of lines) {
    const expMatch = line.match(experienceRegex);
    if (expMatch) {
      experience = expMatch[1];
      break;
    }
  }

  // Extract skills
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    for (const keyword of techKeywords) {
      if (lowerLine.includes(keyword) && !skills.includes(keyword)) {
        skills.push(keyword);
      }
    }
  }

  return {
    text,
    position,
    experience,
    skills,
  };
}
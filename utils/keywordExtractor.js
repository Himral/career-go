export function extractKeywords(text) {
  const keywordList = [
    'JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'SQL',
    'MongoDB', 'AWS', 'Docker', 'TypeScript', 'Java', 'C++', 'REST API'
  ];
  const found = keywordList.filter((kw) =>
    new RegExp(`\\b${kw}\\b`, 'i').test(text)
  );
  return [...new Set(found.map((kw) => kw.toLowerCase()))];
}

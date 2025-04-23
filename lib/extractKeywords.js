export function extractKeywords(text) {
  const stopwords = ['the', 'and', 'to', 'with', 'a', 'in', 'of', 'for', 'on'];
  const words = text
    .toLowerCase()
    .match(/\b\w+\b/g)
    .filter(word => !stopwords.includes(word) && word.length > 3);

  const freq = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 10).map(([word]) => word);
}

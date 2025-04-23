const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
  throw new Error('Adzuna API credentials are not set in environment variables.');
}
const COUNTRY = 'us';

export async function searchJobs(query) {
  const endpoint = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=10&what=${encodeURIComponent(query)}`;
  const res = await fetch(endpoint);
  const data = await res.json();
  return data.results || [];
}

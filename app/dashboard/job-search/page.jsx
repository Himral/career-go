'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch('/api/recommend', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setJobs(data.jobs || []);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Resume</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <Button className="mt-4" onClick={handleUpload}>Get Job Recommendations</Button>

      <div className="mt-6 space-y-4">
        {jobs.map((job, i) => (
          <Card key={i}>
            <CardContent>
              <h2 className="font-bold text-lg">{job.title}</h2>
              <p>{job.description}</p>
              <a href={job.redirect_url} className="text-blue-500" target="_blank" rel="noreferrer">Apply</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

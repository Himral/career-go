'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud } from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <UploadCloud className="h-5 w-5" />
            Upload Your Resume
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>ATS Score</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={analysis.ats_score} />
              <p className="text-center mt-2 text-lg font-semibold">
                {analysis.ats_score}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyword Match</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={analysis.keyword_match?.score || 0} />
              <p className="mt-2 font-medium">Missing Skills:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {analysis.keyword_match?.missing_skills?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                className="min-h-[150px]"
                value={(analysis.suggestions || []).join('\n')}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

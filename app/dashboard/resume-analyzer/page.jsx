'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModel";

export default function ResumeAnalyzerPage() {
  const [jobDesc, setJobDesc] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDesc) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDesc);

    setLoading(true);
    setAnalysisResult('');

    try {

      const InputPrompt = "Based on the job desciption : "  + jobDesc +  " , and uploaded resume file" + resumeFile + ", act as a proficient ATS score generator , in the form of json give { ATS score, Summarised resume in 100 words, focus of improvement in each field of resume}.  "
      
      const result = await chatSession.sendMessage(InputPrompt);

      const ResumeJsonResp = (result.response.text()).replace('```json','').replace('```','')
      console.log(JSON.parse(ResumeJsonResp));
      setAnalysisResult(ResumeJsonResp);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setAnalysisResult("An error occurred while analyzing the resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-semibold">Upload Resume for Analysis</h2>
          <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />

          <Textarea
            placeholder="Paste the job description here..."
            rows={6}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />

          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? <Loader className="animate-spin h-4 w-4 mr-2" /> : "Analyze Resume"}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Analysis Result</h3>
            <pre className="whitespace-pre-wrap text-sm text-white-500">{analysisResult}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
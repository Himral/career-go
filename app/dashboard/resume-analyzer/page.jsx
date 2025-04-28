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
  setAnalysisResult(null);

  try {
    const InputPrompt = `Based on the job description: ${jobDesc}, and uploaded resume file ${resumeFile.name}, act as a proficient ATS score generator, and return strictly and only JSON with { ATS score, Summarised resume in 100 words, focus of improvement in each field of resume }.`;

    const result = await chatSession.sendMessage(InputPrompt);

    let textResponse = await result.response.text();
    
    // Extract JSON safely
    const jsonMatch = textResponse.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in the response.");
    }

    const parsedResult = JSON.parse(jsonMatch[0]);
    console.log(parsedResult);
    setAnalysisResult(parsedResult);

  } catch (error) {
    console.error("Error analyzing resume:", error);
    setAnalysisResult({ error: "An error occurred while analyzing the resume." });
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
            <h3 className="text-lg font-semibold mb-4">Analysis Result</h3>

            {analysisResult.error ? (
              <p className="text-red-500">{analysisResult.error}</p>
            ) : (
              <div className='flex-col justify-center items-center space-y-4'>
                {/* ATS Score */}
                <div className="bg-green-100 p-4 shadow">
                  <h4 className="text-md font-bold text-green-700">ATS Score</h4>
                  <p className="text-2xl font-extrabold text-green-900">{analysisResult['ATS_score']}%</p>
                </div>

                {/* Resume Summary */}
                <div className="bg-blue-100 p-4 shadow">
                  <h4 className="text-md font-bold text-blue-700">Summarised Resume</h4>
                  <p className="text-gray-700">{analysisResult['Summarised_resume']}</p>
                </div>

                {/* Improvement Focus */}
                <div className="bg-yellow-100 p-4 shadow">
                  <h4 className="text-md font-bold text-yellow-700 mb-2">Focus of Improvement</h4>

        {/* Now loop through improvements */}
        {analysisResult['focus_of_improvement'] && (
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {Object.entries(analysisResult['focus_of_improvement']).map(([key, value]) => (
              <li key={key}>
                <span className="font-semibold">{key}:</span> {value}
              </li>
            ))}
          </ul>
        )}

                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
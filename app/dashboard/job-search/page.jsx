'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModel";

export default function JobRecommenderPage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
  if (!resumeFile) {
    alert("Please upload a resume.");
    return;
  }

  const formData = new FormData();
  formData.append("resume", resumeFile);

  console.log("Uploading file: ", resumeFile.name); // Debugging: Check if file is selected

  setLoading(true);
  setAnalysisResult(null);

  try {
    const InputPrompt = `Based on the uploaded resume file ${resumeFile.name}, act like a proficient, optimized Job Recommender system and analyze what job roles the given candidate should apply to. Give the answer in JSON format like { "job_profile": "Software Engineer" }.`;

    // Ensure the form data is being sent
    const result = await chatSession.sendMessage(InputPrompt, { body: formData });
    const textResponse = await result.response.text();
    
    console.log("Received response: ", textResponse); // Log the full response

    const jsonMatch = textResponse.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in the response.");
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      setAnalysisResult({ error: "Invalid response format." });
      return;
    }

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
          <h2 className="text-xl font-semibold">Upload Resume for Job Recommendation</h2>
          <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />

          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? <Loader className="animate-spin h-4 w-4 mr-2" /> : "Analyze Resume"}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Recommended Job Profile</h3>

            {analysisResult.error ? (
              <p className="text-red-500">{analysisResult.error}</p>
            ) : (
              <div className='flex flex-col items-center justify-center space-y-4'>
                <div className="bg-green-100 p-4 shadow rounded">
                  <h4 className="text-md font-bold text-green-700">Job Profile</h4>
                  <p className="text-2xl font-extrabold text-green-900">{analysisResult['job_profile']}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

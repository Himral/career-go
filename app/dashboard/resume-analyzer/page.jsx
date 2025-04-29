'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModel";

const ToggleSection = ({ title, children, bgColor = 'bg-white' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded shadow ${bgColor}`}>
      <button
        className="w-full text-left text-blue-900 px-4 py-3 font-semibold text-lg hover:bg-opacity-80 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};
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
    // const InputPrompt = `Based on the job description: ${jobDesc}, and uploaded resume file ${resumeFile.name}, act as a proficient ATS score generator, calculate the ATS score of the resume in relevance to the job description , give summary of resume text in 100 words as a candidate introduction, give the focus of improvements in each field of resume in relevance to job description and return strictly and only JSON with fields { ATS score, Summarised resume in 100 words, focus of improvement in each field of resume }.`;

    const InputPrompt = `You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in the tech industry, including but not limited to [insert specific field here, e.g., software engineering, data science, data analysis, big data engineering]. Your primary task is to meticulously evaluate resumes based on the provided job description. Considering the highly competitive job market, your goal is to offer the best possible guidance for enhancing resumes.

        Responsibilities:

        1. Assess resumes with a high degree of accuracy against the job description.
        2. Identify and highlight missing keywords crucial for the role.
        3. Provide a percentage match score reflecting the resume's alignment with the job requirements on the scale of 1-100.
        4. Offer detailed feedback for improvement to help candidates stand out.
        5. Analyze the Resume ${resumeFile.name}, Job description ${jobDesc} and indutry trends and provide personalized suggestions for skils, keywords and acheivements that can enhance the provided resume.
        6. Provide the suggestions for improving the language, tone and clarity of the resume content in resume file ${resumeFile.name}.
        7. Provide users with insights into the performance of thier resumes. Track the metrices such as - a) Application Success rates b) Views c) engagement. offers valuable feedback to improve the candidate's chances in the job market use your trained knowledge of gemini trained data . Provide  a application success rate on the scale of 1-100.

        after everytime whenever a usr refersh a page, if the provided job decription and resume is same, then always give same result. 
        

        Field-Specific Customizations:

        Software Engineering:
        You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in software engineering. Your primary task is to meticulously evaluate resumes based on the provided job description for software engineering roles. Considering the highly competitive job market, your goal is to offer the best possible guidance for enhancing resumes.

        Data Science:
        You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in data science. Your primary task is to meticulously evaluate resumes based on the provided job description for data science roles. Considering the highly competitive job market, your goal is to offer the best possible guidance for enhancing resumes.

        Data Analysis:
        You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in data analysis. Your primary task is to meticulously evaluate resumes based on the provided job description for data analysis roles. Considering the highly competitive job market, your goal is to offer the best possible guidance for enhancing resumes.

        Big Data Engineering:
        You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in big data engineering. Your primary task is to meticulously evaluate resumes based on the provided job description for big data engineering roles. Considering the highly competitive job market, your goal is to offer the best possible guidance for enhancing resumes.

        AI / MLEngineering:
        You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in AI/ML engineering. Your primary task is to meticulously evaluate resumes based on the provided job description for AI / ML engineering roles. Considering the highly competitive job market, your goal is to offer the best possible guidance for enhancing resumes.

        CLoud Engineering:
        You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in cloud engineering. Your primary task is to meticulously evaluate resumes based on the provided job description for cloud engineering roles. Considering the highly competitive job market, your goal is to offer the best possible guidance for enhancing resumes.

        Resume file: ${resumeFile.name}
        Description: ${jobDesc}

        strictly and only JSON with fields:
        • ATS_score: \n\n
        • Missing Keywords: \n\n
        • Resume Summary of Resume file: \n\n
        • Suggestion_for_profile_summary of Resume file in relevance to Description: \n\n
        • Personalized suggestions for each field of Resume file in relevance to Description: \n\n
        • Application Success rates : \n\n`

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
      <CardContent className="p-4 space-y-4">
        <h3 className="text-xl font-bold mb-2">Analysis Result</h3>

        {analysisResult.error ? (
          <p className="text-red-500">{analysisResult.error}</p>
        ) : (
          <div className="flex flex-col space-y-4">
            <ToggleSection title="ATS Score" bgColor="bg-green-100">
              <p className="text-2xl font-extrabold text-green-900">{analysisResult['ATS_score']}%</p>
            </ToggleSection>

            <ToggleSection title="Application Success Rate" bgColor="bg-purple-100">
              <p className="text-2xl font-extrabold text-purple-900">{analysisResult['Application Success rates']}%</p>
            </ToggleSection>

            <ToggleSection title="Missing Keywords" bgColor="bg-red-100">
              {analysisResult['Missing Keywords']?.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {analysisResult['Missing Keywords'].map((keyword, idx) => (
                    <li key={idx}>{keyword}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">No missing keywords!</p>
              )}
            </ToggleSection>

            <ToggleSection title="Resume Summary" bgColor="bg-blue-100">
              <p className="text-gray-700">{analysisResult['Resume Summary of Resume file']}</p>
            </ToggleSection>

            <ToggleSection title="Suggested Profile Summary" bgColor="bg-indigo-100">
              <p className="text-gray-700">
                {analysisResult['Suggestion_for_profile_summary of Resume file in relevance to Description']}
              </p>
            </ToggleSection>

            <ToggleSection title="Personalized Suggestions" bgColor="bg-yellow-100">
              <ul className="space-y-2 text-gray-700">
                {Object.entries(
                  analysisResult['Personalized suggestions for each field of Resume file in relevance to Description']
                ).map(([key, value]) => (
                  <li key={section}>
                    <span className="font-semibold">{section}:</span> {suggestion}
                  </li>
                ))}
              </ul>
            </ToggleSection>

            
          </div>
        )}
      </CardContent>
    </Card>
      )}
    </div>
  );
}
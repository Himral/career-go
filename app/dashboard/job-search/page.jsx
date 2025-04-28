'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModel";
import JobList from "./components/JobList";
const JOB_CATEGORY_MAP = {
  'Data Analyst': 'data',
  'Business Analyst': 'data',
  'Data Scientist': 'data',
  'Market Research Analyst': 'marketing',
  'Financial Analyst': 'finance-legal',
  'Management Consultant': 'sales-business',
  'Operations Analyst': 'project-management',
  'Project Manager': 'project-management',
  'Product Analyst': 'product',
  'Software Developer': 'software-dev',
  'Customer Support': 'customer-support',
  'Designer': 'design',
  'Marketing Specialist': 'marketing',
  'Sales Representative': 'sales-business',
  'Product Manager': 'product',
  'DevOps Engineer': 'devops',
  'HR Specialist': 'hr',
  'QA Engineer': 'qa',
  'Technical Writer': 'writing'
};


export default function RecommendationPage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobPostings, setJobPostings] = useState(null);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const fetchJobPostings = async (categorySlug) => {
    try {
      const response = await fetch(
        `https://remotive.com/api/remote-jobs?category=${categorySlug}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs for category ${categorySlug}`);
      }
      
      const data = await response.json();
      return data.jobs || [];
    } catch (error) {
      console.error(`Error fetching jobs for category ${categorySlug}:`, error);
      return [];
    }
  };


  const handleAnalyze = async () => {
    if (!resumeFile) {
      alert("Please upload a resume");
      return;
    }

    setLoading(true);
    setAnalysisResult(null);
    setJobPostings(null);

    try {
      // Step 1: Get job recommendations from Gemini
      const InputPrompt = `Based on the uploaded resume file ${resumeFile.name}, act as a proficient Job Recommender system and analyze what job roles the given candidate should apply to and return strictly and only JSON with { job_title[] }.`;

      const result = await chatSession.sendMessage(InputPrompt);
      let textResponse = await result.response.text();
      
      const jsonMatch = textResponse.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in the response.");
      }

      const parsedResult = JSON.parse(jsonMatch[0]);
      setAnalysisResult(parsedResult);

      // Step 2: Map recommended titles to Remotive categories
      const uniqueCategories = new Set();
      parsedResult.job_title?.forEach(title => {
        const mappedCategory = JOB_CATEGORY_MAP[title];
        if (mappedCategory) {
          uniqueCategories.add(mappedCategory);
        }
      });

      // Step 3: Fetch job postings for each category
      const postings = {};
      for (const category of Array.from(uniqueCategories)) {
        const jobs = await fetchJobPostings(category);
        if (jobs.length > 0) {
          postings[category] = jobs;
        }
      }

      setJobPostings(postings);
      console.log("Job Postings by Category:", postings);

    } catch (error) {
      console.error("Error analyzing resume:", error);
      setAnalysisResult({ error: "An error occurred while analyzing the resume." });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (slug) => {
    return Object.entries(JOB_CATEGORY_MAP).find(
      ([_, categorySlug]) => categorySlug === slug
    )?.[0] || slug;
  };


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-semibold">Upload Resume for Analysis</h2>
          <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />

          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? <Loader className="animate-spin h-4 w-4 mr-2" /> : "Recommend Jobs"}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardContent className="p-4">
            {/* <h3 className="text-lg font-semibold mb-4">Recommend Jobs</h3>
            {analysisResult.error ? (
              <p className="text-red-500">{analysisResult.error}</p>
            ) : (
              <div>
                <h4 className="font-medium mb-2">Recommended Job Titles:</h4>
                <ul className="list-disc pl-5">
                  {analysisResult.job_title?.map((job, index) => (
                    <li key={index}>{job}</li>
                  ))}
                </ul>
              </div>
            )} */}
            {jobPostings && Object.entries(jobPostings).length > 0 ? (
                  <div className="space-y-8">
                    {Object.entries(jobPostings).map(([categorySlug, jobs]) => (
                      <div key={categorySlug}>
                        <h3 className="text-xl font-semibold mb-4 my-2 mx-2">
                          {getCategoryName(categorySlug)} Jobs
                        </h3>
                        <JobList jobs={jobs} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No job postings found for the recommended categories.</p>
                )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
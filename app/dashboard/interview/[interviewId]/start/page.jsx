"use client"
import React, { use, useEffect , useState } from 'react'
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
function StartInterview({params}) {
    const { interviewId } = use(params);

    const [interviewData, setInterviewData] = useState(null);
    const [MockInterviewQuestions, setMockInterviewQuestions] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    useEffect (() => {
        GetInterviewDetails();
    }
    ,[]);

    const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (result.length > 0) {
        setInterviewData(result[0]);
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        setMockInterviewQuestions(jsonMockResp);
        setInterviewData(result[0]);
        console.log("Interview Data:", result[0]);
        console.log("Mock Interview Questions:", jsonMockResp);
      } else {
        toast.error("Interview details not found");
      }
    } catch (error) {
      toast.error("Error fetching interview details");
      console.error("Interview details fetch error:", error);
    }
  };

  return (
    <div>
        <div className = 'grid grid-cols-1 md:grid-cols-2 gap-10 p-10'>
        <QuestionsSection
            MockInterviewQuestions = {MockInterviewQuestions}
            activeQuestionIndex = {activeQuestionIndex}
        />
        {/* Video Audio Recording */}
        <RecordAnswerSection
        MockInterviewQuestions = {MockInterviewQuestions}
            activeQuestionIndex = {activeQuestionIndex}
            interviewData = {interviewData}
        />
        </div>

        <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && <Button disabled={activeQuestionIndex==0}  onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}

        {activeQuestionIndex !==
          MockInterviewQuestions?.length - 1 && <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}

        {activeQuestionIndex == MockInterviewQuestions?.length - 1 && (
          <Link  href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
          
          <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default StartInterview
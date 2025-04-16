"use client";
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image';
import useSpeechToText from 'react-hook-speech-to-text';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { chatSession } from '@/utils/GeminiAIModel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from "@/utils/db";
import moment from 'moment';

function RecordAnswerSection({ MockInterviewQuestions, activeQuestionIndex, interviewData }) {
  const { user } = useUser();
  const [userAnswer, setUserAnswer] = useState('');
  const [jsonMockResponse, setMockJsonResponse] = useState(null);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) => setUserAnswer((prevAns) => prevAns + result?.transcript));
  }, [results]);

  const SaveUserAnswer = async () => {
  if (isRecording) {
    stopSpeechToText();

    try {
      const feedbackPrompt = `Question: ${MockInterviewQuestions[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on the question and the user answer, provide a JSON response with keys 'rating' , 'userAnswer' and 'feedback' in 3-5 lines max.`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();
      const cleanedText = responseText.replace('```json', '').replace('```', '').trim();

      console.log("Gemini Raw Response:", cleanedText);
      const JsonFeedbackResp = JSON.parse(cleanedText);
      setMockJsonResponse(JsonFeedbackResp);
      
      console.log('User answer before save:', userAnswer);
console.log('Attempting to save to DB with data:', {
  mockIdRef: interviewData?.mockId,
  question: MockInterviewQuestions[activeQuestionIndex]?.question,
          correctAns: MockInterviewQuestions[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback,
          rating: JsonFeedbackResp?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY'),
});
      if (JsonFeedbackResp) {
        const resp = await db.insert(UserAnswer).values({
          mockIdRef: interviewData?.mockId,
          question: MockInterviewQuestions[activeQuestionIndex]?.question,
          correctAns: MockInterviewQuestions[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback,
          rating: JsonFeedbackResp?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY'),
        });

        if (resp) {
          toast.success('User Answer Saved Successfully');
        }
      } else {
        console.error("Invalid JSON response from Gemini");
        toast.error('Failed to process feedback');
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error('Failed to save answer');
    }
  } else {
    setUserAnswer(''); // Reset answer when starting new recording
    startSpeechToText();
  }
};

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col items-center bg-black justify-center rounded-lg p-5 mt-20'>
        <Image
          src='/webcam.png'
          width={200}
          height={200}
          className='absolute'
          alt='Webcam background'
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>

      <Button
        onClick={SaveUserAnswer}
        variant='outline'
        className='bg-blue-700 text-white my-10'
      >
        {isRecording ? (
          <div className='flex items-center gap-2'>
            <Mic /> Recording...
          </div>
        ) : (
          'Record Answer'
        )}
      </Button>

      <Button onClick={() => console.log(userAnswer)}>Show User Answer</Button>

      {jsonMockResponse && (
        <div className='p-4 bg-gray-100 rounded-md mt-4 w-[80%] max-w-xl text-left'>
          <h3 className='font-semibold mb-2 text-lg'>Gemini Feedback</h3>
          <p><strong>Rating:</strong> {jsonMockResponse.rating}</p>
          <p><strong>Feedback:</strong> {jsonMockResponse.feedback}</p>
        </div>
      )}
    </div>
  );
}

export default RecordAnswerSection;

"use client"
import { MockInterview } from '@/utils/schema'
import React, { useEffect, useState } from 'react'
import { eq } from 'drizzle-orm'
import { db } from '@/utils/db'
import Webcam from 'react-webcam'
import { WebcamIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
function Interview({params}) {
    const [interviewData,setInterviewData] = useState();
    const [webCamEnabled,setWebCamEnabled] = useState(false);
    useEffect(()=>{
        console.log(params.interviewId)
        GetInterviewDetails();
    },[])

    const GetInterviewDetails=async()=>{
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId,params.interviewId))
        console.log(result);
        setInterviewData(result[0]);
    }
  return (
    <div className='my-10 flex justify-center flex-col items-center'>
        <h2 className='font-bold text-2xl'> Let's Get Started</h2>
        <div>
            {webCamEnabled? <Webcam
            onUserMedia={()=> setWebCamEnabled(true)}
            onUserMediaError={()=>{setWebCamEnabled(false)}}
            mirrored = {true}
            style = {{
                height : 300,
                width : 300
            }}
            />
           :<>
           <WebcamIcon className = 'h-96 w-full my-7 p-20 bg-secondary rounded-lg border'/> 
           <Button 
           onClick = {() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
           </> 
           }
        </div>
        <div className = 'flex flex-col my-5'>
            <h2 className='text-lg'><strong>Job Role / Job Position</strong></h2>
            <h2 className='text-lg'><strong>Job Role / Job Description</strong></h2>
        </div>
    </div>
  )
}

export default Interview
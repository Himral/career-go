"use client"; 
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";
function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState(""); 
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse,setJsonResponse] = useState([]);
  const {user} = useUser();
  const router = useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log(jobPosition, jobDesc, jobExperience);

        const InputPrompt =
      "Job Position: " +
      jobPosition +
      ", Job Description: " +
      jobDesc +
      ", Years of Experience: " +
      jobExperience +
      ", Based on this information, please give me " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " interview questions with answers in JSON format.";
        const result = await chatSession.sendMessage(InputPrompt);
        const MockJsonResp = (result.response.text()).replace('```json','').replace('```','')
        console.log(JSON.parse(MockJsonResp))
        setJsonResponse(MockJsonResp);

        if(MockJsonResp)
        {
            const resp = await db.insert(MockInterview).values({
            mockId : uuidv4(),
            jsonMockResp : MockJsonResp,
            jobPosition : jobPosition,
            jobDesc : jobDesc,
            jobExperience : jobExperience,
            createdBy : user?.primaryEmailAddress?.emailAddress,
            createdAt : moment().format('DD-MM-yyyy')
              }).returning({mockId : MockInterview.mockId});

              console.log("inserted id : ", resp) 
              router.push('/dashboard/interview/' + resp[0]?.mockId)
        }
        else{
            console.log("ERR")
        }
        
        setLoading(false);

        };


  return (
    <div>
  <div
    className="p-10  relative bg-zinc-900 border border-zinc-700/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 hover:scale-105 hover:shadow-md cursor-pointer transition-all"
    onClick={() => setOpenDialog(true)}
  >
    <h2 className="text-md text-center">➕ Add New Interview</h2>
  </div>

  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Tell us more about the job you are interviewing for</DialogTitle>
        <DialogDescription>
          Add details about your job position, description, and experience.
        </DialogDescription>
      </DialogHeader>
      {/* ✅ Moved form outside DialogDescription */}
      <form onSubmit={onSubmit}>
        <div className="mt-7 my-3">
          <label>Job Role/Job Position (Short)</label>
          <Input
            placeholder="Ex. Full Stack Developer"
            required
            value={jobPosition}
            onChange={(event) => setJobPosition(event.target.value)}
          />
        </div>
        <div className="my-3">
          <label>Job Description/Tech Stack</label>
          <Textarea
            placeholder="Ex. React, Angular, NodeJs"
            required
            value={jobDesc}
            onChange={(event) => setJobDesc(event.target.value)}
          />
        </div>
        <div className="my-3">
          <label>Years Of Experience</label>
          <Input
            type="number"
            max="50"
            placeholder="Ex. 4, 5 etc"
            required
            value={jobExperience}
            onChange={(event) => setJobExperience(event.target.value)}
          />
        </div>
        <div className="flex gap-5 justify-end">
          <Button variant="ghost" type="button" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled = {loading}>
            {loading?
            <>
            <LoaderCircle className="animate-spin"/> 'Generating from AI'
            </>: 'Start Interview'    
        }
            </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</div>

  );
}

export default AddNewInterview;

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,173,255,0.2),transparent)] z-0"></div>

      <Card className="relative bg-zinc-900 border border-zinc-700/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md z-10">
        <CardContent className="flex flex-col items-center text-center">
          <div className="bg-zinc-800 p-4 rounded-full mb-4">
            <Sparkles size={40} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Interview with CareerGo AI</h2>
          <p className="text-sm text-gray-400 mb-6">
            Give a mock interview and learn how CareerGo AI can assist you in your preparation. We also offer AI-based resume analysis to boost your job readiness.
          </p>

          {/* Show different CTA for logged in vs logged out users */}
          <SignedIn>
            <Link href="/dashboard">
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg">
                Go to Dashboard
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in">
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg">
                Try now
              </Button>
            </Link>
          </SignedOut>
        </CardContent>
      </Card>

      <SignedOut>
        <div className="flex justify-center gap-4 mt-8 z-10">
          <Link href="/sign-in">
            <Button variant="outline" className="bg-black text-white hover:bg-white hover:text-black">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-white text-black hover:bg-gray-200">
              Sign Up
            </Button>
          </Link>
        </div>
      </SignedOut>
    </div>
  );
}

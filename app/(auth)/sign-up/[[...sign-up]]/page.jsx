"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <SignUp />
    </div>
  );
}

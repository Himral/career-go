import React from 'react'
import { PostHogProvider } from "./posthog-provider.jsx";

function DashboardLayout({children}) {
  return (
    <div>
         <PostHogProvider>{children}</PostHogProvider>
      
    </div>
  )
}

export default DashboardLayout
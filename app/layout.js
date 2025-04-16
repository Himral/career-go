import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CareerGo",
  description: "AI-powered career preparation platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full flex`}
        >
          <Toaster />
          <SidebarProvider>
            <SignedIn>
              <AppSidebar />
              <main className="flex-1 min-h-screen w-full overflow-auto">
                <SidebarTrigger />
                {children}
              </main>
            </SignedIn>
            <SignedOut>
              <main className="flex-1 min-h-screen w-full overflow-auto">
                {children}
              </main>
            </SignedOut>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

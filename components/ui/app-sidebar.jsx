import { Calendar, Home, Inbox, Settings,FileChartPie, NotebookText, Search, Info} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Question Prep",
    url: "/dashboard/questions",
    icon: NotebookText,
  },
  {
    title: "Resume Analyser",
    url: "/dashboard/resume-analyzer",
    icon: FileChartPie,
  },
  {
    title: "Job Search",
    url: "/dashboard/job-search",
    icon: Search,
  },
  {
    title: "About",
    url: "/dashboard",
    icon: Info,
  },
  {
    title: "Hackathon Board",
    url: "/dashboard/hackathon-finder",
    icon: Info,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>CareerGo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

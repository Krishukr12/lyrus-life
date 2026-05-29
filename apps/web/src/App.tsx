import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "@/pages/Dashboard";
import Meetings from "@/pages/Meetings";
import MeetingDetail from "@/pages/MeetingDetail";
import ScheduleMeeting from "@/pages/ScheduleMeeting";
import CalendarView from "@/pages/CalendarView";
import Tasks from "@/pages/Tasks";
import PlatformInsights from "@/pages/PlatformInsights";
import Login from "@/pages/Login";
import JoinMeeting from "@/pages/JoinMeeting";
import MeetingRoom from "@/pages/MeetingRoom";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/join/:slug" element={<JoinMeeting />} />
            <Route
              path="/meetings/:id/live"
              element={
                <RequireAuth>
                  <MeetingRoom />
                </RequireAuth>
              }
            />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/meetings" element={<Meetings />} />
                      <Route path="/meetings/:id" element={<MeetingDetail />} />
                      <Route path="/schedule" element={<ScheduleMeeting />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/calendar" element={<CalendarView />} />
                      <Route path="/insights" element={<PlatformInsights />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

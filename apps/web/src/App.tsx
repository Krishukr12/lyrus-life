import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireRole } from "@/components/RequireRole";
import { AuthProvider } from "@/contexts/AuthContext";
import OrgDashboardPage from "@/features/org/OrgDashboardPage";
import OrgActivityPage from "@/features/org/OrgActivityPage";
import UserManagementPage from "@/features/org/UserManagementPage";
import AcceptInvitePage from "@/pages/AcceptInvitePage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";
import OrgSettingsPage from "@/features/org/OrgSettingsPage";
import Dashboard from "@/pages/Dashboard";
import Meetings from "@/pages/Meetings";
import MeetingDetail from "@/pages/MeetingDetail";
import ScheduleMeeting from "@/pages/ScheduleMeeting";
import CalendarView from "@/pages/CalendarView";
import Tasks from "@/pages/Tasks";
import PlatformInsights from "@/pages/PlatformInsights";
import Login from "@/pages/Login";
import ImpersonatePage from "@/pages/ImpersonatePage";
import AccountSuspendedPage from "@/pages/AccountSuspendedPage";
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
            <Route path="/auth/accept-invite" element={<AcceptInvitePage />} />
            <Route path="/auth/impersonate" element={<ImpersonatePage />} />
            <Route
              path="/change-password"
              element={
                <RequireAuth>
                  <ChangePasswordPage />
                </RequireAuth>
              }
            />
            <Route path="/account-suspended" element={<AccountSuspendedPage />} />
            <Route path="/org" element={<Navigate to="/organization" replace />} />
            <Route path="/org/users" element={<Navigate to="/organization/users" replace />} />
            <Route path="/org/employees" element={<Navigate to="/organization/users" replace />} />
            <Route path="/org/settings" element={<Navigate to="/organization/settings" replace />} />
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
                      <Route
                        path="/organization"
                        element={
                          <RequireRole allowed={["ORG_ADMIN"]}>
                            <OrgDashboardPage />
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/organization/users"
                        element={
                          <RequireRole allowed={["ORG_ADMIN"]}>
                            <UserManagementPage />
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/organization/settings"
                        element={
                          <RequireRole allowed={["ORG_ADMIN"]}>
                            <OrgSettingsPage />
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/organization/activity"
                        element={
                          <RequireRole allowed={["ORG_ADMIN"]}>
                            <OrgActivityPage />
                          </RequireRole>
                        }
                      />
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

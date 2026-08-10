import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireRole } from "@/components/RequireRole";
import { RequireActiveWorkspace } from "@/components/RequireActiveWorkspace";
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
import MomInbox from "@/pages/MomInbox";
import PlatformInsights from "@/pages/PlatformInsights";
import Login from "@/pages/Login";
import ImpersonatePage from "@/pages/ImpersonatePage";
import AccountSuspendedPage from "@/pages/AccountSuspendedPage";
import JoinMeeting from "@/pages/JoinMeeting";
import MeetingRoom from "@/pages/MeetingRoom";
import IntegrationsPage from "@/pages/IntegrationsPage";
import OAuthIntegrationCallbackBridge from "@/pages/OAuthCallbackMisconfigured";
import TrialExpiredPage from "@/pages/TrialExpiredPage";
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
                  <RequireActiveWorkspace>
                    <MeetingRoom />
                  </RequireActiveWorkspace>
                </RequireAuth>
              }
            />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <AppLayout>
                    <Routes>
                      <Route path="/trial-expired" element={<TrialExpiredPage />} />
                      <Route path="/settings/integrations" element={<IntegrationsPage />} />
                      <Route
                        path="/integrations/:provider/callback"
                        element={<OAuthIntegrationCallbackBridge />}
                      />
                      <Route
                        path="/"
                        element={
                          <RequireActiveWorkspace>
                            <Dashboard />
                          </RequireActiveWorkspace>
                        }
                      />
                      <Route
                        path="/meetings"
                        element={
                          <RequireActiveWorkspace>
                            <Meetings />
                          </RequireActiveWorkspace>
                        }
                      />
                      <Route
                        path="/meetings/:id"
                        element={
                          <RequireActiveWorkspace>
                            <MeetingDetail />
                          </RequireActiveWorkspace>
                        }
                      />
                      <Route
                        path="/schedule"
                        element={
                          <RequireActiveWorkspace>
                            <ScheduleMeeting />
                          </RequireActiveWorkspace>
                        }
                      />
                      <Route
                        path="/tasks"
                        element={
                          <RequireActiveWorkspace>
                            <Tasks />
                          </RequireActiveWorkspace>
                        }
                      />
                      <Route
                        path="/mom"
                        element={
                          <RequireActiveWorkspace>
                            <MomInbox />
                          </RequireActiveWorkspace>
                        }
                      />
                      <Route
                        path="/calendar"
                        element={
                          <RequireActiveWorkspace>
                            <CalendarView />
                          </RequireActiveWorkspace>
                        }
                      />
                      <Route
                        path="/insights"
                        element={
                          <RequireActiveWorkspace>
                            <RequireRole allowed={["ORG_ADMIN"]}>
                              <PlatformInsights />
                            </RequireRole>
                          </RequireActiveWorkspace>
                        }
                      />
                      <Route
                        path="/organization"
                        element={
                          <RequireActiveWorkspace>
                            <RequireRole allowed={["ORG_ADMIN"]}>
                              <OrgDashboardPage />
                            </RequireRole>
                          </RequireActiveWorkspace>
                        }
                      />
                      <Route
                        path="/organization/users"
                        element={
                          <RequireActiveWorkspace>
                            <RequireRole allowed={["ORG_ADMIN"]}>
                              <UserManagementPage />
                            </RequireRole>
                          </RequireActiveWorkspace>
                        }
                      />
                      <Route
                        path="/organization/settings"
                        element={
                          <RequireActiveWorkspace>
                            <RequireRole allowed={["ORG_ADMIN"]}>
                              <OrgSettingsPage />
                            </RequireRole>
                          </RequireActiveWorkspace>
                        }
                      />
                      <Route
                        path="/organization/activity"
                        element={
                          <RequireActiveWorkspace>
                            <RequireRole allowed={["ORG_ADMIN"]}>
                              <OrgActivityPage />
                            </RequireRole>
                          </RequireActiveWorkspace>
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

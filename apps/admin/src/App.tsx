import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import DashboardPage from "@/pages/DashboardPage";
import OrganizationsPage from "@/pages/OrganizationsPage";
import CreateOrganizationPage from "@/pages/CreateOrganizationPage";
import OrganizationDetailPage from "@/pages/OrganizationDetailPage";
import BillingPricingPage from "@/pages/BillingPricingPage";
import ComingSoonPage from "@/pages/ComingSoonPage";
import LoginPage from "@/pages/LoginPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="organizations" element={<OrganizationsPage />} />
              <Route path="organizations/new" element={<CreateOrganizationPage />} />
              <Route path="organizations/:id" element={<OrganizationDetailPage />} />
              <Route path="billing" element={<BillingPricingPage />} />
              <Route
                path="organization-requests"
                element={
                  <ComingSoonPage
                    title="Organization requests"
                    description="Review and approve inbound tenant signup requests."
                  />
                }
              />
              <Route
                path="subscriptions"
                element={
                  <ComingSoonPage
                    title="Subscriptions"
                    description="Manage plans, billing cycles, and revenue across tenants."
                  />
                }
              />
              <Route
                path="users"
                element={
                  <ComingSoonPage
                    title="Users"
                    description="Platform-wide user search and access management."
                  />
                }
              />
              <Route
                path="meetings"
                element={
                  <ComingSoonPage
                    title="Meetings"
                    description="Cross-tenant meeting analytics and usage monitoring."
                  />
                }
              />
              <Route
                path="audit-logs"
                element={
                  <ComingSoonPage
                    title="Audit logs"
                    description="Security and compliance event history."
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <ComingSoonPage
                    title="Settings"
                    description="Platform configuration and admin preferences."
                  />
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

import { Construction } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PageContainer } from "@/components/admin/PageContainer";
import { EmptyState } from "@/components/admin/EmptyState";

export default function ComingSoonPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Roadmap"
        title={title}
        description={description}
      />
      <div className="admin-card">
        <EmptyState
          icon={Construction}
          title="Coming soon"
          description="This section is part of the admin roadmap. Core organization management is available today under Organizations."
        />
      </div>
    </PageContainer>
  );
}

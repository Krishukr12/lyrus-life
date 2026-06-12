import { useQuery } from "@tanstack/react-query";
import { FileText, Layers, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/admin/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { MomTemplatePreset, OnboardingMomTemplateDraft } from "@/lib/mom-template-types";
import {
  createClientId,
  createSectionDraft,
  presetToDraft,
  validateTemplateDraft,
} from "@/lib/mom-template-utils";
import { adminApi } from "@/services/api";
import { ConfiguredTemplatesList } from "./ConfiguredTemplatesList";
import { SectionEditorList } from "./SectionEditorList";
import { TemplatePresetGrid } from "./TemplatePresetGrid";
import { TemplatePreviewDialog } from "./TemplatePreviewDialog";
import { TemplateUploadZone } from "./TemplateUploadZone";

type MeetingNotesConfigStepProps = {
  templates: OnboardingMomTemplateDraft[];
  onChange: (templates: OnboardingMomTemplateDraft[]) => void;
};

export function MeetingNotesConfigStep({ templates, onChange }: MeetingNotesConfigStepProps) {
  const [activeClientId, setActiveClientId] = useState<string | null>(templates[0]?.clientId ?? null);
  const [previewPreset, setPreviewPreset] = useState<MomTemplatePreset | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<OnboardingMomTemplateDraft | null>(null);
  const [mode, setMode] = useState<"presets" | "custom" | "upload">("presets");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "mom-templates", "presets"],
    queryFn: () => adminApi.getMomTemplatePresets(),
  });

  const activeTemplate = useMemo(
    () => templates.find((t) => t.clientId === activeClientId) ?? null,
    [templates, activeClientId],
  );

  function upsertTemplate(draft: OnboardingMomTemplateDraft) {
    const exists = templates.some((t) => t.clientId === draft.clientId);
    const next = exists
      ? templates.map((t) => (t.clientId === draft.clientId ? draft : t))
      : [...templates, draft];
    onChange(next);
    setActiveClientId(draft.clientId);
  }

  function handleSelectPreset(preset: MomTemplatePreset) {
    const draft = presetToDraft(preset, templates.length === 0);
    const error = validateTemplateDraft(draft);
    if (error) {
      toast.error(error);
      return;
    }
    upsertTemplate(draft);
    toast.success(`Added ${preset.name}`);
  }

  function handleCreateCustom() {
    const draft: OnboardingMomTemplateDraft = {
      clientId: createClientId(),
      name: "Custom Template",
      description: "Organization-specific meeting notes structure",
      category: "CUSTOM",
      source: "CUSTOM",
      isDefault: templates.length === 0,
      sections: [
        createSectionDraft({
          title: "Executive Summary",
          aiInstructions: "Generate a concise executive summary.",
        }, 0),
        createSectionDraft({
          title: "Action Items",
          aiInstructions: "Extract tasks, owners, and deadlines.",
        }, 1),
      ],
    };
    upsertTemplate(draft);
    setMode("custom");
    toast.success("Custom template created");
  }

  function handleCreateUploadTemplate(file: File) {
    const draft: OnboardingMomTemplateDraft = {
      clientId: createClientId(),
      name: file.name.replace(/\.[^.]+$/, ""),
      description: "Imported from uploaded MOM document",
      category: "CUSTOM",
      source: "UPLOADED",
      isDefault: templates.length === 0,
      pendingUpload: file,
      sections: [
        createSectionDraft({
          title: "Meeting Overview",
          aiInstructions: "Summarize the meeting purpose and context.",
        }, 0),
      ],
    };
    upsertTemplate(draft);
    setMode("custom");
    toast.success("Upload template added — sections will be extracted after provisioning");
  }

  function updateActiveTemplate(patch: Partial<OnboardingMomTemplateDraft>) {
    if (!activeTemplate) return;
    upsertTemplate({ ...activeTemplate, ...patch });
  }

  function handleSetDefault(clientId: string) {
    onChange(
      templates.map((t) => ({
        ...t,
        isDefault: t.clientId === clientId,
      })),
    );
  }

  function handleDuplicate(clientId: string) {
    const source = templates.find((t) => t.clientId === clientId);
    if (!source) return;
    const copy: OnboardingMomTemplateDraft = {
      ...source,
      clientId: createClientId(),
      name: `${source.name} (Copy)`,
      isDefault: false,
      sections: source.sections.map((s, index) => ({ ...s, id: createClientId(), sortOrder: index })),
    };
    onChange([...templates, copy]);
    setActiveClientId(copy.clientId);
  }

  function handleArchive(clientId: string) {
    onChange(templates.filter((t) => t.clientId !== clientId));
    if (activeClientId === clientId) setActiveClientId(null);
  }

  function handleDelete(clientId: string) {
    handleArchive(clientId);
  }

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-slate-100/80 p-1">
          <TabsTrigger value="presets" className="rounded-xl py-2.5 text-xs sm:text-sm">
            <Layers className="mr-1.5 hidden h-4 w-4 sm:inline" />
            Template library
          </TabsTrigger>
          <TabsTrigger value="custom" className="rounded-xl py-2.5 text-xs sm:text-sm">
            <FileText className="mr-1.5 hidden h-4 w-4 sm:inline" />
            Custom builder
          </TabsTrigger>
          <TabsTrigger value="upload" className="rounded-xl py-2.5 text-xs sm:text-sm">
            <Upload className="mr-1.5 hidden h-4 w-4 sm:inline" />
            Upload template
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="mt-5 space-y-5">
          {isError ? (
            <EmptyState
              icon={FileText}
              title="Unable to load templates"
              description="Check your connection and try again."
            />
          ) : (
            <TemplatePresetGrid
              presets={data?.presets ?? []}
              isLoading={isLoading}
              onPreview={setPreviewPreset}
              onSelect={handleSelectPreset}
            />
          )}
        </TabsContent>

        <TabsContent value="custom" className="mt-5 space-y-5">
          {!activeTemplate ? (
            <EmptyState
              icon={FileText}
              title="No custom template selected"
              description="Create a custom template or select one from your configured list."
              action={
                <Button type="button" className="rounded-xl bg-blue-600 hover:bg-blue-700" onClick={handleCreateCustom}>
                  Create custom template
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
              <div className="space-y-4 rounded-[22px] border border-slate-200/80 bg-slate-50/40 p-5">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Template name</Label>
                  <Input
                    value={activeTemplate.name}
                    onChange={(e) => updateActiveTemplate({ name: e.target.value })}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Description</Label>
                  <textarea
                    value={activeTemplate.description}
                    onChange={(e) => updateActiveTemplate({ description: e.target.value })}
                    className="mt-1 min-h-[72px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => setPreviewTemplate(activeTemplate)}
                >
                  Preview structure
                </Button>
              </div>
              <SectionEditorList
                sections={activeTemplate.sections}
                onChange={(sections) => updateActiveTemplate({ sections })}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="mt-5 space-y-5">
          <TemplateUploadZone
            file={activeTemplate?.pendingUpload}
            onFileSelect={(file) => {
              if (file) handleCreateUploadTemplate(file);
              else if (activeTemplate) updateActiveTemplate({ pendingUpload: null });
            }}
          />
        </TabsContent>
      </Tabs>

      <ConfiguredTemplatesList
        templates={templates}
        activeClientId={activeClientId}
        onSelect={setActiveClientId}
        onPreview={setPreviewTemplate}
        onSetDefault={handleSetDefault}
        onDuplicate={handleDuplicate}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onEdit={(clientId) => {
          setActiveClientId(clientId);
          setMode("custom");
        }}
      />

      {templates.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Configure meeting notes"
          description="Select a professional template, build a custom structure, or upload your existing MOM format. At least one template is required."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button type="button" variant="outline" className="rounded-xl" onClick={handleCreateCustom}>
                Start custom template
              </Button>
            </div>
          }
        />
      ) : null}

      <TemplatePreviewDialog
        open={!!previewPreset}
        onOpenChange={(open) => !open && setPreviewPreset(null)}
        title={previewPreset?.name ?? ""}
        description={previewPreset?.description}
        sections={previewPreset?.sections ?? []}
      />

      <TemplatePreviewDialog
        open={!!previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
        title={previewTemplate?.name ?? ""}
        description={previewTemplate?.description}
        sections={previewTemplate?.sections ?? []}
      />
    </div>
  );
}

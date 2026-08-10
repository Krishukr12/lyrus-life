import { useQuery } from "@tanstack/react-query";
import { FileText, Layers, Plus, Upload } from "lucide-react";
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
import { TemplateUploadZone } from "./TemplateUploadZone";

type MeetingNotesConfigStepProps = {
  templates: OnboardingMomTemplateDraft[];
  onChange: (templates: OnboardingMomTemplateDraft[]) => void;
};

export function MeetingNotesConfigStep({ templates, onChange }: MeetingNotesConfigStepProps) {
  const [activeClientId, setActiveClientId] = useState<string | null>(templates[0]?.clientId ?? null);
  const [mode, setMode] = useState<"presets" | "custom" | "upload">("presets");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "mom-templates", "presets"],
    queryFn: () => adminApi.getMomTemplatePresets(),
  });

  const presets = data?.presets ?? [];

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
    const existing = templates.find((t) => t.presetKey === preset.key);
    if (existing) {
      setActiveClientId(existing.clientId);
      toast.info(`${preset.name} is already added`);
      return;
    }

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
        createSectionDraft(
          {
            title: "Executive Summary",
            aiInstructions: "Extract a concise executive summary only from what was said. Leave empty if unsupported.",
          },
          0,
        ),
        createSectionDraft(
          {
            title: "Action Items",
            aiInstructions: "Extract only stated tasks, owners, and deadlines. Leave empty if none.",
          },
          1,
        ),
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
      description: "Imported from uploaded document",
      category: "CUSTOM",
      source: "UPLOADED",
      isDefault: templates.length === 0,
      pendingUpload: file,
      sections: [
        createSectionDraft(
          {
            title: "Meeting Overview",
            aiInstructions: "Extract meeting purpose and context only if stated. Leave empty if none.",
          },
          0,
        ),
      ],
    };
    upsertTemplate(draft);
    setMode("custom");
    toast.success("Upload added — sections will be extracted after provisioning");
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

  function handleDelete(clientId: string) {
    const next = templates.filter((t) => t.clientId !== clientId);
    onChange(next);
    if (activeClientId === clientId) {
      setActiveClientId(next[0]?.clientId ?? null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-600">
        <span className="font-medium text-slate-800">Meeting notes templates</span> define the
        sections in AI-generated minutes — like Executive Summary, Decisions, and Action Items.
        Pick one below; you&apos;ll preview the final document in the review step.
      </div>

      <ConfiguredTemplatesList
        templates={templates}
        activeClientId={activeClientId}
        onSelect={setActiveClientId}
        onSetDefault={handleSetDefault}
        onDelete={handleDelete}
        onEdit={(clientId) => {
          setActiveClientId(clientId);
          setMode("custom");
        }}
      />

      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList className="inline-flex h-auto w-full max-w-md rounded-xl bg-slate-100/80 p-1">
          <TabsTrigger value="presets" className="flex-1 rounded-lg py-2 text-xs sm:text-sm">
            <Layers className="mr-1.5 hidden h-3.5 w-3.5 sm:inline" />
            Choose template
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex-1 rounded-lg py-2 text-xs sm:text-sm">
            <FileText className="mr-1.5 hidden h-3.5 w-3.5 sm:inline" />
            Customize
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex-1 rounded-lg py-2 text-xs sm:text-sm">
            <Upload className="mr-1.5 hidden h-3.5 w-3.5 sm:inline" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="mt-4 space-y-3">
          <p className="text-xs text-slate-500">Click a template to add it for this organization.</p>
          {isError ? (
            <EmptyState
              icon={FileText}
              title="Unable to load templates"
              description="Check your connection and try again."
            />
          ) : (
            <TemplatePresetGrid
              presets={presets}
              isLoading={isLoading}
              selectedKey={
                activeTemplate?.presetKey ??
                templates.find((t) => t.clientId === activeClientId)?.presetKey ??
                null
              }
              onSelect={handleSelectPreset}
            />
          )}
        </TabsContent>

        <TabsContent value="custom" className="mt-4 space-y-4">
          {!activeTemplate ? (
            <EmptyState
              icon={FileText}
              title="No template to customize"
              description="Choose a template from the library first, or create your own."
              action={
                <Button
                  type="button"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateCustom}
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create custom template
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
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
                  <Input
                    value={activeTemplate.description}
                    onChange={(e) => updateActiveTemplate({ description: e.target.value })}
                    className="mt-1 rounded-xl"
                    placeholder="When to use this template"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-700">Document sections</p>
                <p className="mb-3 text-[11px] text-slate-500">
                  Drag to reorder. Each section becomes a heading in the generated meeting notes.
                </p>
                <SectionEditorList
                  sections={activeTemplate.sections}
                  onChange={(sections) => updateActiveTemplate({ sections })}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="mt-4 space-y-4">
          <p className="text-xs text-slate-500">
            Have an existing minutes format? Upload a DOCX or PDF and we&apos;ll match its
            structure after the organization is created.
          </p>
          <TemplateUploadZone
            file={activeTemplate?.pendingUpload}
            onFileSelect={(file) => {
              if (file) handleCreateUploadTemplate(file);
              else if (activeTemplate) updateActiveTemplate({ pendingUpload: null });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

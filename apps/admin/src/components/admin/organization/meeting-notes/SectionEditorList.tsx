import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MomTemplateSectionDraft } from "@/lib/mom-template-types";
import { createSectionDraft } from "@/lib/mom-template-utils";
import { cn } from "@/lib/utils";

function SortableSectionCard({
  section,
  onChange,
  onRemove,
  canRemove,
}: {
  section: MomTemplateSectionDraft;
  onChange: (section: MomTemplateSectionDraft) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm",
        isDragging && "z-10 opacity-90 shadow-lg ring-2 ring-blue-200",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          className="cursor-grab rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Section {section.sortOrder + 1}
        </p>
        <label className="ml-auto flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={section.isRequired}
            onChange={(e) => onChange({ ...section, isRequired: e.target.checked })}
            className="rounded border-slate-300"
          />
          Required
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600"
          onClick={onRemove}
          disabled={!canRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-3">
        <div>
          <Label className="text-xs font-semibold text-slate-700">Section title</Label>
          <Input
            value={section.title}
            onChange={(e) => onChange({ ...section, title: e.target.value })}
            className="mt-1 rounded-xl"
            placeholder="e.g. Executive Summary"
          />
        </div>
        <div>
          <Label className="text-xs font-semibold text-slate-700">Description</Label>
          <textarea
            value={section.description}
            onChange={(e) => onChange({ ...section, description: e.target.value })}
            className="mt-1 min-h-[60px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            placeholder="What this section captures"
          />
        </div>
        <div>
          <Label className="text-xs font-semibold text-slate-700">
            What should AI write here?
          </Label>
          <textarea
            value={section.aiInstructions}
            onChange={(e) => onChange({ ...section, aiInstructions: e.target.value })}
            className="mt-1 min-h-[60px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            placeholder="e.g. List decisions with owners and deadlines"
          />
        </div>
      </div>
    </div>
  );
}

type SectionEditorListProps = {
  sections: MomTemplateSectionDraft[];
  onChange: (sections: MomTemplateSectionDraft[]) => void;
};

export function SectionEditorList({ sections, onChange }: SectionEditorListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex).map((s, index) => ({
      ...s,
      sortOrder: index,
    }));
    onChange(reordered);
  }

  function updateSection(id: string, updated: MomTemplateSectionDraft) {
    onChange(sections.map((s) => (s.id === id ? updated : s)));
  }

  function removeSection(id: string) {
    onChange(
      sections
        .filter((s) => s.id !== id)
        .map((s, index) => ({ ...s, sortOrder: index })),
    );
  }

  function addSection() {
    onChange([...sections, createSectionDraft({}, sections.length)]);
  }

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section) => (
            <SortableSectionCard
              key={section.id}
              section={section}
              onChange={(updated) => updateSection(section.id, updated)}
              onRemove={() => removeSection(section.id)}
              canRemove={sections.length > 1}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button type="button" variant="outline" className="w-full rounded-xl" onClick={addSection}>
        <Plus className="mr-2 h-4 w-4" />
        Add section
      </Button>
    </div>
  );
}

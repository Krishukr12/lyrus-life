import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type TextareaHTMLAttributes,
} from "react";
import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { editMOM } from "@/lib/api";
import type { ActionItem, MOM } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

type ActionRow = ActionItem & { localId: string };
type SectionDraft = { localId: string; title: string; content: string[] };

export type MomInlineEditorHandle = {
  /** Persist pending edits; returns the saved MOM (or a local snapshot if already clean). */
  flushSave: () => Promise<MOM | null>;
  /** Current editor draft as a MOM shape — use for PDF/export even before React state catches up. */
  getSnapshot: () => MOM;
  isBusy: () => boolean;
};

type MomInlineEditorProps = {
  meetingId: string;
  mom: MOM;
  participantNames: string[];
  onMomSaved: (mom: MOM) => void;
  className?: string;
};

type DraftPayload = {
  keyPoints: string[];
  actionItems: ActionItem[];
  sections: Array<{ title: string; content: string[] }>;
};

function newLocalId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function AutoTextarea({
  className,
  value,
  onChange,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(el.scrollHeight, 36)}px`;
  }, [value]);

  return (
    <Textarea
      {...props}
      ref={ref}
      value={value}
      onChange={onChange}
      rows={1}
      className={cn(
        "min-h-9 resize-none overflow-hidden border-transparent bg-transparent px-2.5 py-2 shadow-none hover:border-border focus-visible:border-ring focus-visible:bg-card",
        className,
      )}
    />
  );
}

function rowsFromMom(actionItems: ActionItem[] | undefined): ActionRow[] {
  const items = Array.isArray(actionItems) ? actionItems : [];
  if (items.length === 0) {
    return [{ localId: newLocalId(), task: "", assignee: "", deadline: "" }];
  }
  return items.map((item) => ({
    localId: newLocalId(),
    task: item.task ?? "",
    assignee: item.assignee ?? "",
    deadline: item.deadline ?? "",
  }));
}

function sectionsFromMom(sections: MOM["sections"]): SectionDraft[] {
  const list = Array.isArray(sections) ? sections : [];
  return list.map((section) => ({
    localId: newLocalId(),
    title: section.title ?? "",
    content:
      Array.isArray(section.content) && section.content.length > 0
        ? [...section.content]
        : [""],
  }));
}

function buildPayload(
  keyPoints: string[],
  rows: ActionRow[],
  sections: SectionDraft[],
): DraftPayload {
  return {
    // Keep whatever the user typed — only drop completely blank lines.
    keyPoints: keyPoints.map((p) => p.trimEnd()).filter((p) => p.trim().length > 0),
    actionItems: rows
      .map(({ task, assignee, deadline }) => ({
        task: task.trimEnd(),
        assignee: assignee.trim(),
        deadline: deadline.trim(),
      }))
      // Keep a row if any field has text so users can progressively fill owner/deadline.
      .filter((item) => item.task.trim().length > 0 || item.assignee || item.deadline)
      .map((item) => ({
        task: item.task.trim() || "(untitled action)",
        assignee: item.assignee,
        deadline: item.deadline,
      })),
    sections: sections.map((section) => ({
      title: section.title.trim() || "Untitled section",
      content: section.content.map((c) => c.trimEnd()).filter((c) => c.trim().length > 0),
    })),
  };
}

function serializePayload(payload: DraftPayload) {
  return JSON.stringify(payload);
}

function snapshotFromDraft(mom: MOM, payload: DraftPayload): MOM {
  return {
    ...mom,
    keyPoints: payload.keyPoints,
    actionItems: payload.actionItems,
    sections: payload.sections,
    lastEditedAt: new Date().toISOString(),
    // Edits always require re-approval
    approved: false,
    shared: false,
  };
}

export const MomInlineEditor = forwardRef<MomInlineEditorHandle, MomInlineEditorProps>(
  function MomInlineEditor(
    { meetingId, mom, participantNames, onMomSaved, className },
    ref,
  ) {
    const listId = useId();
    const [keyPoints, setKeyPoints] = useState<string[]>(() =>
      Array.isArray(mom.keyPoints) && mom.keyPoints.length > 0 ? [...mom.keyPoints] : [""],
    );
    const [rows, setRows] = useState<ActionRow[]>(() => rowsFromMom(mom.actionItems));
    const [sections, setSections] = useState<SectionDraft[]>(() => sectionsFromMom(mom.sections));
    const [saveState, setSaveState] = useState<SaveState>("idle");
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

    const initialPayload = buildPayload(
      Array.isArray(mom.keyPoints) ? mom.keyPoints : [],
      rowsFromMom(mom.actionItems),
      sectionsFromMom(mom.sections),
    );
    const serverKeyRef = useRef(serializePayload(initialPayload));
    const draftRef = useRef(serializePayload(buildPayload(keyPoints, rows, sections)));
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const saveInflightRef = useRef(false);
    const pendingSaveRef = useRef(false);
    const mountedRef = useRef(true);
    const saveStateRef = useRef(saveState);
    saveStateRef.current = saveState;

    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      };
    }, []);

    // Pull remote MOM only when content truly changed and user isn't mid-edit.
    useEffect(() => {
      const nextPayload = buildPayload(
        Array.isArray(mom.keyPoints) ? mom.keyPoints : [],
        rowsFromMom(mom.actionItems),
        sectionsFromMom(mom.sections),
      );
      const nextKey = serializePayload(nextPayload);
      if (nextKey === serverKeyRef.current) return;
      if (saveStateRef.current === "dirty" || saveStateRef.current === "saving") return;

      serverKeyRef.current = nextKey;
      draftRef.current = nextKey;
      setKeyPoints(
        Array.isArray(mom.keyPoints) && mom.keyPoints.length > 0 ? [...mom.keyPoints] : [""],
      );
      setRows(rowsFromMom(mom.actionItems));
      setSections(sectionsFromMom(mom.sections));
      setSaveState("idle");
    }, [mom.keyPoints, mom.actionItems, mom.sections, mom.lastEditedAt]);

    const getSnapshot = useCallback((): MOM => {
      const payload = JSON.parse(draftRef.current) as DraftPayload;
      return snapshotFromDraft(mom, payload);
    }, [mom]);

    const persist = useCallback(async (): Promise<MOM | null> => {
      if (saveInflightRef.current) {
        pendingSaveRef.current = true;
        return getSnapshot();
      }

      if (draftRef.current === serverKeyRef.current) {
        if (mountedRef.current) setSaveState("saved");
        return getSnapshot();
      }

      const payload = JSON.parse(draftRef.current) as DraftPayload;
      saveInflightRef.current = true;
      if (mountedRef.current) setSaveState("saving");

      try {
        const updated = await editMOM(meetingId, {
          keyPoints: payload.keyPoints,
          actionItems: payload.actionItems,
          sections: payload.sections,
        });
        if (!mountedRef.current) return updated;

        const savedKey = serializePayload(
          buildPayload(
            updated.keyPoints ?? [],
            rowsFromMom(updated.actionItems),
            sectionsFromMom(updated.sections),
          ),
        );
        serverKeyRef.current = savedKey;
        setLastSavedAt(new Date());
        setSaveState(draftRef.current === savedKey ? "saved" : "dirty");
        onMomSaved(updated);
        // If user typed while save was in flight, prefer live draft for consumers (PDF).
        return draftRef.current === savedKey ? updated : getSnapshot();
      } catch (err) {
        if (!mountedRef.current) return null;
        setSaveState("error");
        toast.error(err instanceof Error ? err.message : "Failed to save MOM edits");
        // Still return local draft so PDF/export can show what the user typed.
        return getSnapshot();
      } finally {
        saveInflightRef.current = false;
        if (pendingSaveRef.current) {
          pendingSaveRef.current = false;
          void persist();
        }
      }
    }, [getSnapshot, meetingId, onMomSaved]);

    const queueSave = useCallback(
      (nextKeyPoints: string[], nextRows: ActionRow[], nextSections: SectionDraft[]) => {
        const serialized = serializePayload(buildPayload(nextKeyPoints, nextRows, nextSections));
        draftRef.current = serialized;
        if (serialized === serverKeyRef.current) {
          setSaveState((s) => (s === "saving" ? s : "saved"));
          return;
        }
        setSaveState("dirty");
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          void persist();
        }, 650);
      },
      [persist],
    );

    const flushSave = useCallback(async () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      return persist();
    }, [persist]);

    useImperativeHandle(
      ref,
      () => ({
        flushSave,
        getSnapshot,
        isBusy: () => saveStateRef.current === "saving" || saveStateRef.current === "dirty",
      }),
      [flushSave, getSnapshot],
    );

    const updateKeyPoint = (index: number, value: string) => {
      setKeyPoints((prev) => {
        const next = [...prev];
        next[index] = value;
        queueSave(next, rows, sections);
        return next;
      });
    };

    const addKeyPoint = (afterIndex?: number) => {
      setKeyPoints((prev) => {
        const next = [...prev];
        const at = typeof afterIndex === "number" ? afterIndex + 1 : next.length;
        next.splice(at, 0, "");
        queueSave(next, rows, sections);
        return next;
      });
    };

    const removeKeyPoint = (index: number) => {
      setKeyPoints((prev) => {
        const next = prev.length <= 1 ? [""] : prev.filter((_, i) => i !== index);
        queueSave(next, rows, sections);
        return next;
      });
    };

    const updateRow = (localId: string, patch: Partial<ActionItem>) => {
      setRows((prev) => {
        const next = prev.map((row) => (row.localId === localId ? { ...row, ...patch } : row));
        queueSave(keyPoints, next, sections);
        return next;
      });
    };

    const addRow = () => {
      setRows((prev) => {
        const next = [...prev, { localId: newLocalId(), task: "", assignee: "", deadline: "" }];
        queueSave(keyPoints, next, sections);
        return next;
      });
    };

    const removeRow = (localId: string) => {
      setRows((prev) => {
        const next =
          prev.length <= 1
            ? [{ localId: newLocalId(), task: "", assignee: "", deadline: "" }]
            : prev.filter((row) => row.localId !== localId);
        queueSave(keyPoints, next, sections);
        return next;
      });
    };

    const updateSectionTitle = (localId: string, title: string) => {
      setSections((prev) => {
        const next = prev.map((s) => (s.localId === localId ? { ...s, title } : s));
        queueSave(keyPoints, rows, next);
        return next;
      });
    };

    const updateSectionLine = (localId: string, lineIndex: number, value: string) => {
      setSections((prev) => {
        const next = prev.map((s) => {
          if (s.localId !== localId) return s;
          const content = [...s.content];
          content[lineIndex] = value;
          return { ...s, content };
        });
        queueSave(keyPoints, rows, next);
        return next;
      });
    };

    const addSectionLine = (localId: string, afterIndex?: number) => {
      setSections((prev) => {
        const next = prev.map((s) => {
          if (s.localId !== localId) return s;
          const content = [...s.content];
          const at = typeof afterIndex === "number" ? afterIndex + 1 : content.length;
          content.splice(at, 0, "");
          return { ...s, content };
        });
        queueSave(keyPoints, rows, next);
        return next;
      });
    };

    const removeSectionLine = (localId: string, lineIndex: number) => {
      setSections((prev) => {
        const next = prev.map((s) => {
          if (s.localId !== localId) return s;
          const content =
            s.content.length <= 1 ? [""] : s.content.filter((_, i) => i !== lineIndex);
          return { ...s, content };
        });
        queueSave(keyPoints, rows, next);
        return next;
      });
    };

    const addSection = () => {
      setSections((prev) => {
        const next = [
          ...prev,
          { localId: newLocalId(), title: "New section", content: [""] },
        ];
        queueSave(keyPoints, rows, next);
        return next;
      });
    };

    const removeSection = (localId: string) => {
      setSections((prev) => {
        const next = prev.filter((s) => s.localId !== localId);
        queueSave(keyPoints, rows, next);
        return next;
      });
    };

    const ownerOptions = Array.from(
      new Set(
        participantNames
          .map((n) => n.trim())
          .filter(Boolean)
          .concat(["Unassigned"]),
      ),
    );

    const saveLabel =
      saveState === "saving"
        ? "Saving…"
        : saveState === "dirty"
          ? "Unsaved changes"
          : saveState === "error"
            ? "Save failed — keep typing to retry"
            : lastSavedAt
              ? `Saved · ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "All changes saved";

    return (
      <div className={cn("space-y-5", className)}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">
            Edit anything below — text grows as you type and saves automatically.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {saveState === "saving" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            ) : saveState === "saved" || saveState === "idle" ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            ) : null}
            <span
              className={cn(
                saveState === "dirty" && "text-warning",
                saveState === "error" && "text-destructive",
              )}
            >
              {saveLabel}
            </span>
            {(saveState === "dirty" || saveState === "error") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => void flushSave()}
              >
                Save now
              </Button>
            )}
          </div>
        </div>

        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Key discussion points</h3>
            <Button type="button" variant="ghost" size="sm" className="h-8 gap-1" onClick={() => addKeyPoint()}>
              <Plus className="h-3.5 w-3.5" /> Add point
            </Button>
          </div>
          <ul className="space-y-1.5">
            {keyPoints.map((point, index) => (
              <li key={`kp-${index}`} className="group flex items-start gap-2 rounded-lg border border-transparent px-1 hover:border-border/60 hover:bg-muted/20">
                <span className="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden />
                <AutoTextarea
                  value={point}
                  onChange={(e) => updateKeyPoint(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addKeyPoint(index);
                    }
                    if (e.key === "Backspace" && point === "" && keyPoints.length > 1) {
                      e.preventDefault();
                      removeKeyPoint(index);
                    }
                  }}
                  placeholder="Write or fix a discussion point…"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-1 h-8 w-8 shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
                  onClick={() => removeKeyPoint(index)}
                  aria-label="Remove discussion point"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-[11px]">
            Enter adds another point · Shift+Enter for a line break inside a point
          </p>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Action items</h3>
            <Button type="button" variant="ghost" size="sm" className="h-8 gap-1" onClick={addRow}>
              <Plus className="h-3.5 w-3.5" /> Add action
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-2.5 text-left font-medium">Task</th>
                  <th className="w-[20%] p-2.5 text-left font-medium">Owner</th>
                  <th className="w-[18%] p-2.5 text-left font-medium">Deadline</th>
                  <th className="w-10 p-2.5" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.localId} className="group border-t align-top">
                    <td className="p-1">
                      <AutoTextarea
                        value={row.task}
                        onChange={(e) => updateRow(row.localId, { task: e.target.value })}
                        placeholder="Describe the action…"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        list={`${listId}-owners`}
                        value={row.assignee}
                        onChange={(e) => updateRow(row.localId, { assignee: e.target.value })}
                        placeholder="Anyone"
                        className="h-9 border-transparent bg-transparent shadow-none hover:border-border focus-visible:border-ring focus-visible:bg-card"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        value={row.deadline}
                        onChange={(e) => updateRow(row.localId, { deadline: e.target.value })}
                        placeholder="Any date / text"
                        className="h-9 border-transparent bg-transparent shadow-none hover:border-border focus-visible:border-ring focus-visible:bg-card"
                      />
                    </td>
                    <td className="p-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 opacity-60 transition-opacity group-hover:opacity-100"
                        onClick={() => removeRow(row.localId)}
                        aria-label="Remove action item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <datalist id={`${listId}-owners`}>
            {ownerOptions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium">Template sections</h3>
              <p className="text-muted-foreground text-xs">
                Edit section titles and bullets freely — including empty sections from the AI draft.
              </p>
            </div>
            <Button type="button" variant="ghost" size="sm" className="h-8 gap-1" onClick={addSection}>
              <Plus className="h-3.5 w-3.5" /> Add section
            </Button>
          </div>

          {sections.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-center">
              <p className="text-muted-foreground text-sm">No template sections yet.</p>
              <Button type="button" variant="secondary" size="sm" className="mt-3 gap-1" onClick={addSection}>
                <Plus className="h-3.5 w-3.5" /> Create a section
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.localId} className="rounded-xl border bg-muted/15 p-3 md:p-4">
                  <div className="mb-2 flex items-start gap-2">
                    <Input
                      value={section.title}
                      onChange={(e) => updateSectionTitle(section.localId, e.target.value)}
                      placeholder="Section title"
                      className="h-9 border-transparent bg-transparent font-medium shadow-none hover:border-border focus-visible:border-ring focus-visible:bg-card"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0"
                      onClick={() => removeSection(section.localId)}
                      aria-label="Remove section"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <ul className="space-y-1">
                    {section.content.map((line, lineIndex) => (
                      <li key={`${section.localId}-${lineIndex}`} className="group flex items-start gap-2">
                        <span className="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" aria-hidden />
                        <AutoTextarea
                          value={line}
                          onChange={(e) =>
                            updateSectionLine(section.localId, lineIndex, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              addSectionLine(section.localId, lineIndex);
                            }
                            if (
                              e.key === "Backspace" &&
                              line === "" &&
                              section.content.length > 1
                            ) {
                              e.preventDefault();
                              removeSectionLine(section.localId, lineIndex);
                            }
                          }}
                          placeholder="Add or edit a bullet…"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-1 h-8 w-8 shrink-0 opacity-60 group-hover:opacity-100"
                          onClick={() => removeSectionLine(section.localId, lineIndex)}
                          aria-label="Remove bullet"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-8 gap-1"
                    onClick={() => addSectionLine(section.localId)}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add bullet
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  },
);

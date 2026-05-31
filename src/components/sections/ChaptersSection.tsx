import { Plus, Trash2 } from "lucide-react";
import { Project, Chapter } from "@/lib/types";
import { generateId } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Props {
  project: Project;
  onUpdate: (project: Project) => void;
}

const statusStyles: Record<Chapter["status"], string> = {
  planned: "bg-muted text-muted-foreground border-0",
  drafting: "bg-amber-500/20 text-amber-400 border-0",
  complete: "bg-emerald-500/20 text-emerald-400 border-0",
};

const ChaptersSection = ({ project, onUpdate }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addChapter = () => {
    const chapter: Chapter = {
      id: generateId(),
      title: `Chapter ${project.chapters.length + 1}`,
      notes: "",
      status: "planned",
    };
    onUpdate({ ...project, chapters: [...project.chapters, chapter] });
    setExpandedId(chapter.id);
  };

  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    onUpdate({
      ...project,
      chapters: project.chapters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  const deleteChapter = (id: string) => {
    onUpdate({ ...project, chapters: project.chapters.filter((c) => c.id !== id) });
  };

  const cycleStatus = (chapter: Chapter) => {
    const order: Chapter["status"][] = ["planned", "drafting", "complete"];
    const next = order[(order.indexOf(chapter.status) + 1) % order.length];
    updateChapter(chapter.id, { status: next });
  };

  return (
    <div className="space-y-2">
      {project.chapters.map((ch, i) => (
        <div key={ch.id} className="rounded-xl border border-border bg-card overflow-hidden">
          <div
            className="flex cursor-pointer items-center gap-3 p-4"
            onClick={() => setExpandedId(expandedId === ch.id ? null : ch.id)}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-medium text-muted-foreground">
              {i + 1}
            </span>
            <p className="min-w-0 flex-1 truncate font-medium text-foreground">{ch.title}</p>
            <Badge
              className={`${statusStyles[ch.status]} cursor-pointer text-xs`}
              onClick={(e) => {
                e.stopPropagation();
                cycleStatus(ch);
              }}
            >
              {ch.status}
            </Badge>
          </div>

          {expandedId === ch.id && (
            <div className="space-y-3 border-t border-border p-4 animate-fade-in">
              <Input
                value={ch.title}
                onChange={(e) => updateChapter(ch.id, { title: e.target.value })}
                placeholder="Chapter title"
              />
              <Textarea
                value={ch.notes}
                onChange={(e) => updateChapter(ch.id, { notes: e.target.value })}
                placeholder="Chapter notes or draft..."
                rows={6}
              />
              <button
                onClick={() => deleteChapter(ch.id)}
                className="flex items-center gap-1 text-sm text-destructive hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addChapter}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
      >
        <Plus className="h-4 w-4" /> Add Chapter
      </button>
    </div>
  );
};

export default ChaptersSection;

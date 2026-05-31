import { useState } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Project, Note } from "@/lib/types";
import { generateId } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  project: Project;
  onUpdate: (project: Project) => void;
}

const NotesSection = ({ project, onUpdate }: Props) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const addNote = () => {
    const note: Note = {
      id: generateId(),
      title: "Untitled Note",
      content: "",
      updatedAt: new Date().toISOString(),
    };
    onUpdate({ ...project, notes: [note, ...project.notes] });
    setActiveNoteId(note.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    onUpdate({
      ...project,
      notes: project.notes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      ),
    });
  };

  const deleteNote = (id: string) => {
    onUpdate({ ...project, notes: project.notes.filter((n) => n.id !== id) });
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const activeNote = project.notes.find((n) => n.id === activeNoteId);

  if (activeNote) {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => setActiveNoteId(null)}
          className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to notes
        </button>
        <Input
          value={activeNote.title}
          onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
          className="mb-3 border-0 bg-transparent px-0 text-lg font-semibold focus-visible:ring-0"
        />
        <Textarea
          value={activeNote.content}
          onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
          placeholder="Start writing..."
          className="min-h-[50vh] border-0 bg-transparent px-0 text-sm leading-relaxed focus-visible:ring-0"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {project.notes.map((note) => (
        <div
          key={note.id}
          className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
          onClick={() => setActiveNoteId(note.id)}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{note.title}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {note.content.slice(0, 60) || "Empty note"}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNote(note.id);
            }}
            className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <button
        onClick={addNote}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
      >
        <Plus className="h-4 w-4" /> New Note
      </button>
    </div>
  );
};

export default NotesSection;

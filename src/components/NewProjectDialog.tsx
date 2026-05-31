import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (title: string, subtitle: string) => void;
}

const NewProjectDialog = ({ open, onOpenChange, onCreate }: NewProjectDialogProps) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate(title.trim(), subtitle.trim());
    setTitle("");
    setSubtitle("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">New Story Project</DialogTitle>
          <DialogDescription>Give your story a name to get started.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Input
            placeholder="Story title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <Input
            placeholder="Tagline (optional)"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button onClick={handleCreate} disabled={!title.trim()} className="w-full">
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;

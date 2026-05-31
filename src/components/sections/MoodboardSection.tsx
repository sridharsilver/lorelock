import { useState } from "react";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { Project, MoodboardImage } from "@/lib/types";
import { generateId } from "@/lib/storage";
import { Input } from "@/components/ui/input";

interface Props {
  project: Project;
  onUpdate: (project: Project) => void;
}

const MoodboardSection = ({ project, onUpdate }: Props) => {
  const [newUrl, setNewUrl] = useState("");

  const addImage = () => {
    if (!newUrl.trim()) return;
    const img: MoodboardImage = { id: generateId(), url: newUrl.trim(), caption: "" };
    onUpdate({ ...project, moodboard: [...project.moodboard, img] });
    setNewUrl("");
  };

  const deleteImage = (id: string) => {
    onUpdate({ ...project, moodboard: project.moodboard.filter((m) => m.id !== id) });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        const img: MoodboardImage = { id: generateId(), url, caption: file.name };
        onUpdate({ ...project, moodboard: [...project.moodboard, img] });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Paste image URL..."
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addImage()}
          className="flex-1"
        />
        <button
          onClick={addImage}
          disabled={!newUrl.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
        <ImageIcon className="h-4 w-4" /> Upload from device
        <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
      </label>

      {project.moodboard.length > 0 ? (
        <div className="columns-2 gap-2 space-y-2">
          {project.moodboard.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-xl break-inside-avoid">
              <img
                src={img.url}
                alt={img.caption}
                className="w-full rounded-xl object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <button
                onClick={() => deleteImage(img.id)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-background/80 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
          <ImageIcon className="mb-2 h-8 w-8" />
          <p className="text-sm">Add images for visual inspiration</p>
        </div>
      )}
    </div>
  );
};

export default MoodboardSection;

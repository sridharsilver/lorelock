import { Project } from "@/lib/types";
import { Trash2, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onDelete: () => void;
  style?: React.CSSProperties;
}

const ProjectCard = ({ project, onClick, onDelete, style }: ProjectCardProps) => {
  return (
    <div
      className="group relative flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-secondary animate-fade-in"
      style={style}
      onClick={onClick}
    >
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-foreground">{project.title}</h3>
        {project.subtitle && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{project.subtitle}</p>
        )}
        <p className="mt-1.5 text-xs text-muted-foreground">
          Edited {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </div>
  );
};

export default ProjectCard;

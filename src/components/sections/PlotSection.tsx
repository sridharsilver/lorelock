import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Project, PlotPoint } from "@/lib/types";
import { generateId } from "@/lib/storage";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Props {
  project: Project;
  onUpdate: (project: Project) => void;
}

const typeColors: Record<PlotPoint["type"], string> = {
  event: "bg-primary/20 text-primary",
  twist: "bg-amber-500/20 text-amber-400",
  reveal: "bg-emerald-500/20 text-emerald-400",
};

const PlotSection = ({ project, onUpdate }: Props) => {
  const [overview, setOverview] = useState(project.plot.overview);
  const [timeline, setTimeline] = useState(project.plot.timeline);

  const saveOverview = (val: string) => {
    setOverview(val);
    onUpdate({ ...project, plot: { ...project.plot, overview: val } });
  };

  const saveTimeline = (val: string) => {
    setTimeline(val);
    onUpdate({ ...project, plot: { ...project.plot, timeline: val } });
  };

  const addPoint = (type: PlotPoint["type"]) => {
    const point: PlotPoint = { id: generateId(), title: "", description: "", type };
    onUpdate({ ...project, plot: { ...project.plot, points: [...project.plot.points, point] } });
  };

  const updatePoint = (id: string, updates: Partial<PlotPoint>) => {
    onUpdate({
      ...project,
      plot: {
        ...project.plot,
        points: project.plot.points.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      },
    });
  };

  const deletePoint = (id: string) => {
    onUpdate({
      ...project,
      plot: { ...project.plot, points: project.plot.points.filter((p) => p.id !== id) },
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <label className="mb-2 block text-sm font-medium text-foreground">Story Overview</label>
        <Textarea
          placeholder="Describe your main storyline..."
          value={overview}
          onChange={(e) => saveOverview(e.target.value)}
          rows={4}
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <label className="mb-2 block text-sm font-medium text-foreground">Timeline</label>
        <Textarea
          placeholder="Outline the timeline of events..."
          value={timeline}
          onChange={(e) => saveTimeline(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Plot Points</h3>
        <div className="space-y-2">
          {project.plot.points.map((point) => (
            <div key={point.id} className="rounded-xl border border-border bg-card p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={`${typeColors[point.type]} border-0 text-xs`}>{point.type}</Badge>
                <Input
                  value={point.title}
                  onChange={(e) => updatePoint(point.id, { title: e.target.value })}
                  placeholder="Title"
                  className="flex-1 border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0"
                />
                <button onClick={() => deletePoint(point.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Textarea
                value={point.description}
                onChange={(e) => updatePoint(point.id, { description: e.target.value })}
                placeholder="Description..."
                rows={2}
                className="border-0 bg-secondary/50 text-sm"
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          {(["event", "twist", "reveal"] as const).map((type) => (
            <button
              key={type}
              onClick={() => addPoint(type)}
              className="flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Plus className="h-3 w-3" /> {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlotSection;

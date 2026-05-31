import { useState, useRef, useCallback } from "react";
import { Plus, BookOpen } from "lucide-react";
import { Project } from "@/lib/types";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import ProjectCard from "@/components/ProjectCard";
import NewProjectDialog from "@/components/NewProjectDialog";
import ProjectWorkspace from "@/components/ProjectWorkspace";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import SettingsPage from "@/pages/SettingsPage";

const Index = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { profile } = useAuth();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Swipe-right detection from left edge
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = Math.abs(touch.clientY - touchStart.current.y);
    if (touchStart.current.x < 40 && dx > 80 && dy < 100) {
      setShowSettings(true);
    }
    touchStart.current = null;
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;
  const displayName = profile?.display_name || profile?.username || "Writer";

  if (activeProject) {
    return (
      <ProjectWorkspace
        project={activeProject}
        onUpdate={updateProject}
        onBack={() => setActiveProjectId(null)}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background px-4 pb-24 pt-12"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mx-auto max-w-lg">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">LoreLock</h1>
            <p className="text-sm text-muted-foreground">Welcome, {displayName}</p>
          </div>
          {/* Tappable profile avatar opens settings */}
          <button
            onClick={() => setShowSettings(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform hover:scale-105 active:scale-95"
            title="Settings"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-10 w-10 rounded-xl object-cover ring-2 ring-primary/30" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 ring-2 ring-primary/30">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            )}
          </button>
        </div>
        <div className="mb-8" />

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No stories yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first project to begin
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setActiveProjectId(project.id)}
                onDelete={() => deleteProject(project.id)}
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowNewDialog(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95 glow-violet"
      >
        <Plus className="h-6 w-6" />
      </button>

      <NewProjectDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onCreate={(title, subtitle) => {
          const project = addProject(title, subtitle);
          setActiveProjectId(project.id);
          setShowNewDialog(false);
        }}
      />

      {/* Settings Drawer - slides in from left */}
      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent side="left" className="w-full max-w-md overflow-y-auto border-border bg-background p-0">
          <SettingsPage onBack={() => setShowSettings(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;

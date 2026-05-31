import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { Project } from "@/lib/types";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import ProjectCard from "@/components/ProjectCard";
import NewProjectDialog from "@/components/NewProjectDialog";
import ProjectWorkspace from "@/components/ProjectWorkspace";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  const navigate = useNavigate();
  const { projects, favorites, recentProjects, addProject, updateProject, deleteProject, toggleFavorite } = useProjects();
  const { profile } = useAuth();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);

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
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background px-4 pb-24 pt-4">
          <div className="mx-auto max-w-lg">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-muted-foreground" />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">LoreLock</h1>
                  <p className="text-sm text-muted-foreground">Welcome, {displayName}</p>
                </div>
              </div>
              {/* Tappable profile avatar goes to settings */}
              <button
                onClick={() => navigate("/settings")}
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
                    onToggleFavorite={() => toggleFavorite(project.id)}
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Index;

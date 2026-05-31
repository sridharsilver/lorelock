import { useState } from "react";
import { ArrowLeft, Users, Brain, BookText, Palette, StickyNote } from "lucide-react";
import { Project } from "@/lib/types";
import CharactersSection from "@/components/sections/CharactersSection";
import PlotSection from "@/components/sections/PlotSection";
import ChaptersSection from "@/components/sections/ChaptersSection";
import MoodboardSection from "@/components/sections/MoodboardSection";
import NotesSection from "@/components/sections/NotesSection";

interface ProjectWorkspaceProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onBack: () => void;
}

const tabs = [
  { id: "characters", label: "Characters", icon: Users },
  { id: "plot", label: "Plot", icon: Brain },
  { id: "chapters", label: "Chapters", icon: BookText },
  { id: "moodboard", label: "Mood", icon: Palette },
  { id: "notes", label: "Notes", icon: StickyNote },
] as const;

type TabId = (typeof tabs)[number]["id"];

const ProjectWorkspace = ({ project, onUpdate, onBack }: ProjectWorkspaceProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("characters");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold text-foreground">{project.title}</h1>
            {project.subtitle && (
              <p className="truncate text-xs text-muted-foreground">{project.subtitle}</p>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 animate-fade-in" key={activeTab}>
        {activeTab === "characters" && <CharactersSection project={project} onUpdate={onUpdate} />}
        {activeTab === "plot" && <PlotSection project={project} onUpdate={onUpdate} />}
        {activeTab === "chapters" && <ChaptersSection project={project} onUpdate={onUpdate} />}
        {activeTab === "moodboard" && <MoodboardSection project={project} onUpdate={onUpdate} />}
        {activeTab === "notes" && <NotesSection project={project} onUpdate={onUpdate} />}
      </main>
    </div>
  );
};

export default ProjectWorkspace;

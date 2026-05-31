import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import ProjectWorkspace from "@/components/ProjectWorkspace";

const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProject } = useProjects();
  const project = projects.find((p) => p.id === id) || null;

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg font-medium text-foreground">Project not found</p>
        <p className="text-sm text-muted-foreground">
          This project may have been deleted or the link is invalid.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <ProjectWorkspace
      project={project}
      onUpdate={updateProject}
      onBack={() => navigate("/")}
    />
  );
};

export default ProjectPage;

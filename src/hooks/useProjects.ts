import { useState, useCallback, useEffect } from "react";
import { Project } from "@/lib/types";
import { loadProjects, saveProjects, createEmptyProject } from "@/lib/storage";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const save = useCallback((updated: Project[]) => {
    setProjects(updated);
    saveProjects(updated);
  }, []);

  const addProject = useCallback((title: string, subtitle: string) => {
    const project = createEmptyProject(title, subtitle);
    const updated = [project, ...projects];
    save(updated);
    return project;
  }, [projects, save]);

  const updateProject = useCallback((project: Project) => {
    const updated = projects.map((p) =>
      p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p
    );
    save(updated);
  }, [projects, save]);

  const deleteProject = useCallback((id: string) => {
    save(projects.filter((p) => p.id !== id));
  }, [projects, save]);

  const toggleFavorite = useCallback((id: string) => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, favorited: !p.favorited, updatedAt: new Date().toISOString() } : p
    );
    save(updated);
  }, [projects, save]);

  const favorites = projects.filter((p) => p.favorited);
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return { projects, favorites, recentProjects, addProject, updateProject, deleteProject, toggleFavorite };
}

import { Project } from "./types";

const STORAGE_KEY = "lorelock_projects";

export function loadProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function createEmptyProject(title: string, subtitle: string): Project {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title,
    subtitle,
    favorited: false,
    createdAt: now,
    updatedAt: now,
    characters: [],
    plot: { overview: "", timeline: "", points: [] },
    chapters: [],
    moodboard: [],
    notes: [],
  };
}

export interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  backstory: string;
  secrets: string;
  relationships: string;
}

export interface PlotPoint {
  id: string;
  title: string;
  description: string;
  type: "event" | "twist" | "reveal";
}

export interface Chapter {
  id: string;
  title: string;
  notes: string;
  status: "planned" | "drafting" | "complete";
}

export interface MoodboardImage {
  id: string;
  url: string;
  caption: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
  updatedAt: string;
  characters: Character[];
  plot: {
    overview: string;
    timeline: string;
    points: PlotPoint[];
  };
  chapters: Chapter[];
  moodboard: MoodboardImage[];
  notes: Note[];
}

export interface Visualization {
  title: string;
  description: string;
  path: string;
  techStack: string[];
  features: string[];
}

export interface Project {
  title: string;
  description: string;
  path: string;
  topics?: string[];
  techStack?: string[];
  features?: string[];
  subProjects?: Project[];
  isVisualization?: boolean;
}

export interface ProjectCatalog {
  mainProjects: Project[];
}

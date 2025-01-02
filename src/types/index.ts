export interface Project {
  title: string;
  description: string;
  path: string;
  topics: string[];
  techStack: string[];
  features: string[];
  isVisualization: boolean;
  subProjects?: Project[];
}

export interface ProjectCatalog {
  mainProjects: Project[];
}

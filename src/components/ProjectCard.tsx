import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  isSubProject?: boolean;
}

export function ProjectCard({ project, isSubProject = false }: ProjectCardProps) {
  return (
    <div className={`${isSubProject ? 'ml-8 mt-4 border-l-2 border-gray-700 pl-6' : ''}`}>
      <a
        href={project.path}
        className={`block p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors ${
          isSubProject ? 'bg-gray-900' : 'bg-gray-950'
        }`}
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {project.title}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {project.description}
        </p>
        {project.techStack && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs rounded-full bg-gray-800 dark:bg-gray-700 text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        {project.features && (
          <ul className="mt-4 list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}
      </a>
      {project.subProjects && project.subProjects.length > 0 && (
        <div className="space-y-4">
          {project.subProjects.map((subProject) => (
            <ProjectCard
              key={subProject.path}
              project={subProject}
              isSubProject={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  isSubProject?: boolean;
}

export function ProjectCard({ project, isSubProject = false }: ProjectCardProps) {
  return (
    <div className={`${isSubProject ? 'ml-8 mt-4 border-l-2 border-gray-200 pl-6' : ''}`}>
      <a
        href={project.path}
        className={`block p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all ${
          isSubProject ? 'bg-gray-50' : 'bg-white'
        }`}
      >
        <h3 className="text-xl font-semibold text-gray-900">
          {project.title}
        </h3>
        <p className="mt-2 text-gray-600">
          {project.description}
        </p>
        {project.techStack && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        {project.features && (
          <ul className="mt-4 list-disc list-inside text-sm text-gray-600">
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

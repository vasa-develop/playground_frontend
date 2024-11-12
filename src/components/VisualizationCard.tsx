interface VisualizationCardProps {
  title: string;
  description: string;
  path: string;
  techStack: string[];
  features: string[];
}

export function VisualizationCard({ title, description, path, techStack, features }: VisualizationCardProps) {
  return (
    <a
      href={path}
      className="block p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            {tech}
          </span>
        ))}
      </div>
      <ul className="mt-4 list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </a>
  );
}

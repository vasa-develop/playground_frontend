import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { projectCatalog } from '@/data/visualizations';
import { Project } from '@/types';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 max-w-2xl">
        <article className="mx-0">
          <h3 className="mb-6"><em>Main Projects</em></h3>
          <ul className="space-y-3">
            {projectCatalog.mainProjects.map((project: Project) => (
              <li key={project.path} className="flex items-baseline gap-2 font-cmunrm">
                <code className="project-name">
                  <a href={project.path} className="no-underline hover:underline">
                    {project.title.toLowerCase()}:
                  </a>
                </code>
                <span className="font-cmunrm">{project.description}</span>
              </li>
            ))}
          </ul>
        </article>
      </main>
      <Footer />
    </div>
  );
}

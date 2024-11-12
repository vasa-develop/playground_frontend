import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { projectCatalog } from '@/data/visualizations';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-8 py-16 prose prose-slate max-w-3xl">
        <article className="space-y-12">
          <h3 className="font-medium mb-8"><em>Main Projects</em></h3>
          <ul className="list-disc pl-6 space-y-6">
            {projectCatalog.mainProjects.map((project) => (
              <li key={project.path}>
                <div className="flex items-baseline gap-2">
                  <code className="project-name">
                    <a href={project.path} className="no-underline hover:underline">
                      {project.title.toLowerCase()}:
                    </a>
                  </code>
                  <span>{project.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </main>
      <Footer />
    </div>
  );
}

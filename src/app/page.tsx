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
          <ul className="list-none pl-0 space-y-6">
            {projectCatalog.mainProjects.map((project) => (
              <li key={project.path}>
                <div className="flex items-baseline gap-2">
                  <code className="text-sm">
                    <a href={project.path} className="text-[#ff69b4] no-underline hover:underline">
                      {project.title.toLowerCase()}
                    </a>
                  </code>
                  <span>{project.description}</span>
                </div>
                {project.features && (
                  <ul className="list-none pl-4 mt-2 space-y-1">
                    {project.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </article>
      </main>
      <Footer />
    </div>
  );
}

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectCard } from '@/components/ProjectCard';
import { projectCatalog } from '@/data/visualizations';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="space-y-8">
          {projectCatalog.mainProjects.map((project) => (
            <ProjectCard key={project.path} project={project} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

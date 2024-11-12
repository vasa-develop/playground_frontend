import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VisualizationCard } from '@/components/VisualizationCard';
import { visualizations } from '@/data/visualizations';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visualizations.map((viz) => (
            <VisualizationCard key={viz.title} {...viz} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function AlphaCodePage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        heading="AlphaCode Playground"
        text="Experiment with DeepMind's AlphaCode for competitive programming solutions"
      />
      <div className="grid gap-6">
        <Card className="p-6">
          {/* Initial content will go here */}
          <p className="text-sm text-muted-foreground">
            Coming soon: Interactive competitive programming problem solver
          </p>
        </Card>
      </div>
    </div>
  );
}

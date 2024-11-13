import * as React from 'react';

export default function PalmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto">
        {children}
      </main>
    </div>
  );
}

import React from 'react';

export function Header() {
  return (
    <header className="w-full py-8 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Playground
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            A collection of interactive scientific visualizations exploring quantum mechanics and computational physics
          </p>
        </div>
      </div>
    </header>
  );
}

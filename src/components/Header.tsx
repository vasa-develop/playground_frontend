import React from 'react';

export function Header() {
  return (
    <header className="w-full py-6">
      <div className="container mx-auto px-8">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl">
            playground
          </h1>
          <p className="mt-2 text-gray-600">
            A collection of interactive scientific visualizations exploring quantum mechanics and computational physics
          </p>
        </div>
      </div>
    </header>
  );
}

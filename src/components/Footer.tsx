import React from 'react';

export function Footer() {
  return (
    <footer className="w-full py-4 text-sm text-gray-600">
      built with <span className="text-red-500">❤</span> by{" "}
      <a
        href="https://x.com/vasa_develop"
        className="no-underline hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        vasa
      </a>
      {" "}and{" "}
      <a
        href="https://www.cognition.ai/get-started"
        className="no-underline hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        devin ai
      </a>
    </footer>
  );
}

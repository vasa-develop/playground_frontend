import React from 'react';

export function Footer() {
  return (
    <footer className="w-full py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      built with <span className="text-red-500">❤</span> by{" "}
      <a
        href="https://x.com/vasa_develop"
        className="underline hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        vasa
      </a>
      {" "}and{" "}
      <a
        href="https://www.cognition.ai/get-started"
        className="underline hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        devin
      </a>
    </footer>
  );
}

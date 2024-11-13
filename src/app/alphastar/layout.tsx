import React from 'react';
import Script from 'next/script';

export default function AlphaStarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script src="/config.js" strategy="beforeInteractive" />
      {children}
    </>
  );
}

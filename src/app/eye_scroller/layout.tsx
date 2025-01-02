import { getBaseUrl } from '@/lib/utils';
import { Metadata } from 'next';

const baseUrl = getBaseUrl();
const imageUrl = `${baseUrl}/eye-tracking-preview.png`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Eye Scroller. A BCI scroll app.',
  description: 'A BCI scroll app that lets you scroll through content using your eye movements.',
  openGraph: {
    title: 'Eye Scroller. A BCI scroll app.',
    description: 'A BCI scroll app that lets you scroll through content using your eye movements.',
    images: [imageUrl],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eye Scroller. A BCI scroll app.',
    description: 'A BCI scroll app that lets you scroll through content using your eye movements.',
    images: [imageUrl],
  },
  icons: {
    icon: `${baseUrl}/favicon.png`,
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
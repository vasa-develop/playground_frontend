import { getBaseUrl } from '@/utils/url';

const baseUrl = getBaseUrl();
const imageUrl = `${baseUrl}/previews/eye_scroller_preview.png`;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Eye Scroller. A BCI scroll app.',
  description: 'A BCI scroll app that lets you scroll through content using your eye movements.',
  openGraph: {
    title: 'Eye Scroller. A BCI scroll app.',
    description: 'A BCI scroll app that lets you scroll through content using your eye movements.',
    images: [imageUrl],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Eye Scroller. A BCI scroll app.',
    description: 'A BCI scroll app that lets you scroll through content using your eye movements.',
    images: [imageUrl],
  },
  icons: {
    icon: `${baseUrl}/favicon.png`,
  },
}; 
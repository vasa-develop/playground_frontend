'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EyeTrackingPage() {
  const router = useRouter();

  useEffect(() => {
    window.location.href = '/eye-tracking/index.html';
  }, []);

  return null;
}

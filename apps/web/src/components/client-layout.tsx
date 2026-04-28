'use client';

import { useEffect, useState } from 'react';
import { Providers } from '@/components/providers';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [SceneManager, setSceneManager] = useState<React.ComponentType<{ children: React.ReactNode }> | null>(null);

  useEffect(() => {
    // Only load SceneManager on client side
    import('@freelancex/three-scenes').then((mod) => {
      setSceneManager(() => mod.SceneManager);
    }).catch((err) => {
      console.warn('Failed to load SceneManager:', err);
    });
  }, []);

  return (
    <Providers>
      {SceneManager ? (
        <SceneManager>{children}</SceneManager>
      ) : (
        <div style={{ minHeight: '100vh', background: '#03020a', position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      )}
    </Providers>
  );
}
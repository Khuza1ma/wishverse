import { useState, useEffect } from 'react';

export function useWebGLSupport(): boolean {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl && gl instanceof WebGLRenderingContext));
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  return hasWebGL;
}

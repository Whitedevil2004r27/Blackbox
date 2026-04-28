'use client';

import { useState, useEffect } from 'react';

type QualityTier = 'high' | 'medium' | 'low';

interface PostProcessingConfig {
  bloom: boolean;
  bloomStrength: number;
  chromaticAberration: boolean;
  vignette: boolean;
  noise: boolean;
  ssao: boolean;
}

const configs: Record<QualityTier, PostProcessingConfig> = {
  high: {
    bloom: true,
    bloomStrength: 1.5,
    chromaticAberration: true,
    vignette: true,
    noise: true,
    ssao: true,
  },
  medium: {
    bloom: true,
    bloomStrength: 0.8,
    chromaticAberration: false,
    vignette: true,
    noise: true,
    ssao: false,
  },
  low: {
    bloom: false,
    bloomStrength: 0,
    chromaticAberration: false,
    vignette: false,
    noise: false,
    ssao: false,
  },
};

export function usePostProcessing() {
  const [tier, setTier] = useState<QualityTier>('high');
  const [config, setConfig] = useState<PostProcessingConfig>(configs.high);

  useEffect(() => {
    const detectTier = () => {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      
      if (!gl) {
        setTier('low');
        return;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
        
        if (renderer.includes('SwiftShader') || renderer.includes('Software')) {
          setTier('low');
        } else if (
          renderer.includes('Intel') ||
          renderer.includes('Apple') ||
          renderer.includes('Mali-G')
        ) {
          setTier('medium');
        } else {
          setTier('high');
        }
      }

      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      if (maxTextureSize < 4096) {
        setTier('low');
      }
    };

    detectTier();
  }, []);


  useEffect(() => {
    setConfig(configs[tier]);
  }, [tier]);

  return { tier, config };
}

export type { QualityTier, PostProcessingConfig };

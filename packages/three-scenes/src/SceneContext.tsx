import React, { createContext, useContext } from 'react';

export type SceneView =
  | 'explore'
  | 'studio'
  | 'mission'
  | 'network'
  | 'dashboard'
  | 'communications'
  | 'none';

export interface SceneConfig {
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  backgroundColor: string;
  fogDensity: number;
  ambientIntensity: number;
  showStars: boolean;
  showGrid: boolean;
}

export interface SceneContextType {
  config: SceneConfig;
  setConfig: (config: Partial<SceneConfig>) => void;
  transitionTo: (newConfig: Partial<SceneConfig>, duration?: number) => void;
  currentView: SceneView;
  setCurrentView: (view: SceneView) => void;
}

export const viewConfigs: Record<SceneView, Partial<SceneConfig>> = {
  explore: {
    cameraPosition: [0, 5, 15],
    cameraTarget: [0, 0, 0],
    backgroundColor: '#03020a',
    fogDensity: 0.015,
    ambientIntensity: 0.3,
    showStars: true,
    showGrid: false,
  },
  studio: {
    cameraPosition: [3, 2, 8],
    cameraTarget: [0, 1, 0],
    backgroundColor: '#0a0818',
    fogDensity: 0.02,
    ambientIntensity: 0.4,
    showStars: false,
    showGrid: true,
  },
  mission: {
    cameraPosition: [8, 6, 8],
    cameraTarget: [0, 0, 0],
    backgroundColor: '#050510',
    fogDensity: 0.01,
    ambientIntensity: 0.35,
    showStars: true,
    showGrid: true,
  },
  network: {
    cameraPosition: [0, 0, 12],
    cameraTarget: [0, 0, 0],
    backgroundColor: '#02020a',
    fogDensity: 0.025,
    ambientIntensity: 0.25,
    showStars: true,
    showGrid: false,
  },
  dashboard: {
    cameraPosition: [0, 3, 10],
    cameraTarget: [0, 0, 0],
    backgroundColor: '#03020a',
    fogDensity: 0.02,
    ambientIntensity: 0.3,
    showStars: true,
    showGrid: false,
  },
  communications: {
    cameraPosition: [0, 2, 10],
    cameraTarget: [0, 0, 0],
    backgroundColor: '#080618',
    fogDensity: 0.018,
    ambientIntensity: 0.3,
    showStars: false,
    showGrid: false,
  },
  none: {
    cameraPosition: [0, 0, 10],
    cameraTarget: [0, 0, 0],
    backgroundColor: '#03020a',
    fogDensity: 0.02,
    ambientIntensity: 0.3,
    showStars: true,
    showGrid: false,
  },
};

export const defaultConfig: SceneConfig = {
  cameraPosition: [0, 0, 10],
  cameraTarget: [0, 0, 0],
  backgroundColor: '#03020a',
  fogDensity: 0.02,
  ambientIntensity: 0.3,
  showStars: true,
  showGrid: false,
};

export const SceneContext = createContext<SceneContextType | null>(null);

export function useSceneStore() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error('useSceneStore must be used within SceneManager');
  return ctx;
}


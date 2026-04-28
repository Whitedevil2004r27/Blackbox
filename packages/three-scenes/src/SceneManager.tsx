'use client';

import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise, SSAO } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { ExploreSpace } from './views/ExploreSpace';
import { FreelancerStudio } from './views/FreelancerStudio';
import { MissionControl } from './views/MissionControl';
import { NetworkGraph } from './views/NetworkGraph';
import { DashboardHQ } from './views/DashboardHQ';
import { CommunicationsHub } from './views/CommunicationsHub';

export type SceneView =
  | 'explore'
  | 'studio'
  | 'mission'
  | 'network'
  | 'dashboard'
  | 'communications'
  | 'none';

interface SceneConfig {
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  backgroundColor: string;
  fogDensity: number;
  ambientIntensity: number;
  showStars: boolean;
  showGrid: boolean;
}

interface SceneContextType {
  config: SceneConfig;
  setConfig: (config: Partial<SceneConfig>) => void;
  transitionTo: (newConfig: Partial<SceneConfig>, duration?: number) => void;
  currentView: SceneView;
  setCurrentView: (view: SceneView) => void;
}

const viewConfigs: Record<SceneView, Partial<SceneConfig>> = {
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

const defaultConfig: SceneConfig = {
  cameraPosition: [0, 0, 10],
  cameraTarget: [0, 0, 0],
  backgroundColor: '#03020a',
  fogDensity: 0.02,
  ambientIntensity: 0.3,
  showStars: true,
  showGrid: false,
};

const SceneContext = createContext<SceneContextType | null>(null);

export function useSceneStore() {
  const ctx = useContext(SceneContext);
  if (!ctx) {
    return {
      config: defaultConfig,
      setConfig: () => {},
      transitionTo: () => {},
      currentView: 'none' as SceneView,
      setCurrentView: () => {},
    };
  }
  return ctx;
}

function SceneContent({ view }: { view: SceneView }) {
  const { config } = useSceneStore();
  const { scene } = useThree();

  React.useEffect(() => {
    scene.background = new THREE.Color(config.backgroundColor);
    scene.fog = new THREE.FogExp2(config.backgroundColor, config.fogDensity);
  }, [config.backgroundColor, config.fogDensity, scene]);

  return (
    <>
      <ambientLight intensity={config.ambientIntensity} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#7b2fff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f5ff" />
      <pointLight position={[0, 10, -10]} intensity={0.5} color="#ff2fa0" />

      {config.showStars && (
        <Stars radius={100} depth={50} count={5000} factor={7} saturation={0} fade speed={1} />
      )}

      <Physics gravity={[0, -0.5, 0]}>
        {view === 'explore' && <ExploreSpace />}
        {view === 'studio' && (
          <FreelancerStudio
            userId="demo-user"
            name="Demo Freelancer"
            avatarUrl={null}
            bio="Full-stack developer"
            skills={[
              { id: '1', name: 'React', level: 3, connections: [] },
              { id: '2', name: 'Node.js', level: 3, connections: [] },
              { id: '3', name: 'TypeScript', level: 2, connections: [] },
              { id: '4', name: 'Three.js', level: 2, connections: [] },
            ]}
            portfolio={[
              { id: '1', title: 'E-commerce Platform', imageUrl: '', position: [0, 0, 0] },
              { id: '2', title: 'Mobile Banking App', imageUrl: '', position: [0, 0, 0] },
              { id: '3', title: 'SaaS Dashboard', imageUrl: '', position: [0, 0, 0] },
            ]}
            stats={{ totalEarned: 24500, jobsCompleted: 12, rating: 4.9, responseTime: '2h' }}
          />
        )}
        {view === 'mission' && (
          <MissionControl
            projectId="demo-project"
            projectName="Demo Project"
            tasks={[
              { id: '1', title: 'Setup API', status: 'done', position: [0, 0, 0] },
              { id: '2', title: 'Design UI', status: 'in_progress', position: [0, 0, 0] },
              { id: '3', title: 'Implement Auth', status: 'todo', position: [0, 0, 0] },
              { id: '4', title: 'Write Tests', status: 'backlog', position: [0, 0, 0] },
            ]}
            teamMembers={[
              { id: '1', name: 'Alice', role: 'Lead', color: '#00f5ff' },
              { id: '2', name: 'Bob', role: 'Designer', color: '#ff2fa0' },
              { id: '3', name: 'Carol', role: 'Dev', color: '#7b2fff' },
            ]}
            milestones={[
              { id: '1', title: 'MVP', amount: 3000, status: 'paid', position: [0, 0, 0] },
              { id: '2', title: 'Beta', amount: 2000, status: 'pending', position: [0, 0, 0] },
            ]}
            budget={{ total: 10000, spent: 4500 }}
            completion={45}
          />
        )}
        {view === 'network' && <NetworkGraph />}
        {view === 'dashboard' && <DashboardHQ userName="Freelancer" />}
        {view === 'communications' && (
          <CommunicationsHub
            conversations={[
              {
                id: '1',
                name: 'Project Alpha Team',
                lastMessage: 'Great progress on the dashboard!',
                unreadCount: 3,
                isActive: true,
                participants: [
                  { id: '1', name: 'Alice' },
                  { id: '2', name: 'Bob' },
                ],
              },
              {
                id: '2',
                name: 'Sarah Chen',
                lastMessage: 'When can we schedule a call?',
                unreadCount: 0,
                isActive: false,
                participants: [{ id: '3', name: 'Sarah Chen' }],
              },
            ]}
            activeConversationId="1"
          />
        )}
      </Physics>

      <AdaptivePostProcessing />
    </>
  );
}

function AdaptivePostProcessing() {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  React.useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setQuality('low');
      return;
    }
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      if (renderer.includes('Intel') || renderer.includes('Apple')) {
        setQuality('medium');
      }
    }
  }, []);

  if (quality === 'low') return null;

  return (
    <EffectComposer>
      <Bloom
        intensity={quality === 'high' ? 1.5 : 0.8}
        luminanceThreshold={0.4}
        luminanceSmoothing={0.6}
        mipmapBlur
      />
      {quality === 'high' ? (
        <>
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.001, 0.001)}
            radialModulation={false}
            modulationOffset={0}
          />
          <SSAO
            samples={32}
            radius={0.1}
            bias={0.5}
            worldDistanceThreshold={0.3}
            worldDistanceFalloff={0.1}
            worldProximityThreshold={0.05}
            worldProximityFalloff={0.01}
          />
        </>
      ) : <></>}

      <Vignette eskil={false} offset={0.1} darkness={0.5} />
      <Noise opacity={0.08} />
    </EffectComposer>
  );
}

export function SceneManager({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<SceneConfig>(defaultConfig);
  const [currentView, setCurrentViewState] = useState<SceneView>('explore');
  const controlsRef = useRef<CameraControls>(null);

  const setConfig = useCallback((partial: Partial<SceneConfig>) => {
    setConfigState((prev) => ({ ...prev, ...partial }));
  }, []);

  const transitionTo = useCallback((newConfig: Partial<SceneConfig>, duration = 1.2) => {
    setConfigState((prev) => ({ ...prev, ...newConfig }));
    if (controlsRef.current && newConfig.cameraPosition && newConfig.cameraTarget) {
      controlsRef.current.setLookAt(
        ...newConfig.cameraPosition,
        ...newConfig.cameraTarget,
        true
      );
    }
  }, []);

  const setCurrentView = useCallback((view: SceneView) => {
    setCurrentViewState(view);
    const preset = viewConfigs[view];
    if (preset) {
      setConfigState((prev) => ({ ...prev, ...preset }));
      if (controlsRef.current && preset.cameraPosition && preset.cameraTarget) {
        controlsRef.current.setLookAt(
          ...preset.cameraPosition,
          ...preset.cameraTarget,
          true
        );
      }
    }
  }, []);

  return (
    <SceneContext.Provider value={{ config, setConfig, transitionTo, currentView, setCurrentView }}>
      {/* 3D Canvas Background */}
      <Canvas
        camera={{ position: config.cameraPosition, fov: 75 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <CameraControls
          ref={controlsRef}
          makeDefault
          minDistance={2}
          maxDistance={50}
          smoothTime={0.8}
        />
        <SceneContent view={currentView} />
      </Canvas>

      {/* HTML Content Overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </SceneContext.Provider>
  );
}

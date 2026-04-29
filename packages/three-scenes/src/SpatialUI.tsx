'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingPanelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  width?: string;
  children: React.ReactNode;
  billboard?: boolean;
}

export function FloatingPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  width = '300px',
  children,
  billboard = false,
}: FloatingPanelProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Html
        transform
        occlude
        style={{
          width,
          pointerEvents: 'auto',
        }}
        {...(billboard ? { sprite: true } : {})}
      >
        <div
          style={{
            background: 'rgba(7, 5, 26, 0.75)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
            padding: '16px',
            color: '#e8e4ff',
            fontFamily: 'DM Sans, system-ui, sans-serif',
          }}
        >
          {children}
        </div>
      </Html>
    </group>
  );
}

interface HolographicButtonProps {
  position?: [number, number, number];
  onClick?: () => void;
  children: React.ReactNode;
  color?: string;
}

export function HolographicButton({
  position = [0, 0, 0],
  onClick,
  children,
  color = '#00f5ff',
}: HolographicButtonProps) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 0.5, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Html center distanceFactor={10}>
        <div
          style={{
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {children}
        </div>
      </Html>
    </group>
  );
}

export type { FloatingPanelProps, HolographicButtonProps };

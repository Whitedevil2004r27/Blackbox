'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text, Ring } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarSystemProps {
  position?: [number, number, number];
  userId: string;
  name: string;
  isOnline?: boolean;
  avatarUrl?: string | null;
  color?: string;
  size?: number;
}

export function AvatarSystem({
  position = [0, 0, 0],
  userId,
  name,
  isOnline = false,
  avatarUrl,
  color = '#60a5fa',
  size = 1,
}: AvatarSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  // Generate procedural avatar from initials if no URL
  const initials = useMemo(() => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [name]);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle breathing animation
      meshRef.current.scale.setScalar(
        size * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.02)
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main avatar sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Glow ring */}
      <Ring args={[size * 1.2, size * 1.3, 64]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Online indicator */}
      {isOnline && (
        <mesh position={[size * 0.8, size * 0.8, 0]}>
          <sphereGeometry args={[size * 0.15, 16, 16]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      )}

      {/* Name label */}
      <Text
        position={[0, -size * 1.5, 0]}
        fontSize={size * 0.3}
        color="#e8e4ff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>

      {/* Initials overlay (procedural fallback) */}
      {!avatarUrl && (
        <Text
          position={[0, 0, size * 0.9]}
          fontSize={size * 0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {initials}
        </Text>
      )}
    </group>
  );
}

export type { AvatarSystemProps };

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';

interface IslandProps {
  position: [number, number, number];
  category: string;
  color: string;
  projectCount: number;
  onClick?: () => void;
}

function Island({ position, category, color, projectCount, onClick }: IslandProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <RigidBody position={position} colliders="trimesh" type="fixed">
      <group>
        {/* Island base */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <cylinderGeometry args={[2, 2.5, 0.5, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.4 : 0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Category label */}
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.4}
          color="#e8e4ff"
          anchorX="center"
          anchorY="middle"
        >
          {category}
        </Text>

        {/* Project count */}
        <Text
          position={[0, 1, 0]}
          fontSize={0.25}
          color="#9b94c4"
          anchorX="center"
          anchorY="middle"
        >
          {projectCount} projects
        </Text>

        {/* Floating project cards */}
        {Array.from({ length: Math.min(projectCount, 5) }).map((_, i) => (
          <Float
            key={i}
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
            position={[
              Math.cos((i / 5) * Math.PI * 2) * 3,
              0.5 + i * 0.3,
              Math.sin((i / 5) * Math.PI * 2) * 3,
            ]}
          >
            <mesh>
              <planeGeometry args={[0.8, 0.5]} />
              <MeshDistortMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.2}
                distort={0.1}
                speed={2}
                transparent
                opacity={0.8}
              />
            </mesh>
          </Float>
        ))}
      </group>
    </RigidBody>
  );
}

interface ExploreSpaceProps {
  categories?: Array<{
    id: string;
    name: string;
    color: string;
    projectCount: number;
  }>;
  onCategoryClick?: (categoryId: string) => void;
}

export function ExploreSpace({
  categories = [
    { id: '1', name: 'Development', color: '#00f5ff', projectCount: 42 },
    { id: '2', name: 'Design', color: '#ff2fa0', projectCount: 28 },
    { id: '3', name: 'Marketing', color: '#7b2fff', projectCount: 15 },
    { id: '4', name: 'Writing', color: '#00ff88', projectCount: 20 },
    { id: '5', name: 'Video', color: '#ffcc00', projectCount: 12 },
  ],
  onCategoryClick,
}: ExploreSpaceProps) {
  const groupRef = useRef<THREE.Group>(null);

  const islandPositions = useMemo(() => {
    return categories.map((_, i) => {
      const angle = (i / categories.length) * Math.PI * 2;
      const radius = 8;
      return [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius,
      ] as [number, number, number];
    });
  }, [categories]);

  return (
    <group ref={groupRef}>
      {categories.map((category, i) => (
        <Island
          key={category.id}
          position={islandPositions[i]}
          category={category.name}
          color={category.color}
          projectCount={category.projectCount}
          onClick={() => onCategoryClick?.(category.id)}
        />
      ))}

      {/* Central hub */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial
          color="#7b2fff"
          emissive="#7b2fff"
          emissiveIntensity={0.5}
        />
      </mesh>

      <Text
        position={[0, 0.5, 0]}
        fontSize={0.6}
        color="#e8e4ff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Explore
      </Text>
    </group>
  );
}

export type { ExploreSpaceProps };

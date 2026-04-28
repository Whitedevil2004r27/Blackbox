'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html, Ring } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface ProjectPlanetProps {
  position?: [number, number, number];
  title?: string;
  status?: 'open' | 'in_progress' | 'completed';
  budget?: number;
}

export function ProjectPlanet({ 
  position = [0, 0, 0], 
  title = 'New Project',
  status = 'open',
  budget = 5000
}: ProjectPlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);

  const statusColors = {
    open: '#4ade80',
    in_progress: '#fbbf24',
    completed: '#818cf8'
  };

  const color = statusColors[status];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <RigidBody position={position} colliders="ball" restitution={0.3}>
      <group>
        <Sphere
          ref={meshRef}
          args={[1.5, 32, 32]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setSelected(!selected)}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            roughness={0.4}
            metalness={0.6}
          />
        </Sphere>

        <Ring args={[2, 2.1, 64]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </Ring>

        <Sphere args={[1.7, 32, 32]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>

        {selected && (
          <Html distanceFactor={10}>
            <div className="bg-void/90 border border-nebula-400 rounded-lg p-4 min-w-[220px] text-white pointer-events-none">
              <h3 className="font-bold text-lg text-star-gold">{title}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="text-nebula-400">Status:</span>{' '}
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                </p>
                <p className="text-sm">
                  <span className="text-nebula-400">Budget:</span> {'$'}{budget.toLocaleString()}
                </p>
              </div>
            </div>
          </Html>
        )}
      </group>
    </RigidBody>
  );
}

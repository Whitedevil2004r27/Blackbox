'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface FreelancerOrbProps {
  position?: [number, number, number];
  name?: string;
  skills?: string[];
  color?: string;
}

export function FreelancerOrb({ 
  position = [0, 0, 0], 
  name = 'Freelancer',
  skills = ['React', 'Three.js'],
  color = '#60a5fa'
}: FreelancerOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <RigidBody position={position} colliders="ball" restitution={0.5}>
      <group>
        <Sphere
          ref={meshRef}
          args={[1, 32, 32]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setSelected(!selected)}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.8 : 0.3}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
        
        {/* Glow effect */}
        <Sphere args={[1.2, 32, 32]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Label */}
        {selected && (
          <Html distanceFactor={10}>
            <div className="bg-void/90 border border-nebula-400 rounded-lg p-4 min-w-[200px] text-white pointer-events-none">
              <h3 className="font-bold text-lg text-star-gold">{name}</h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {skills.map((skill) => (
                  <span key={skill} className="text-xs bg-nebula-900 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Html>
        )}
      </group>
    </RigidBody>
  );
}

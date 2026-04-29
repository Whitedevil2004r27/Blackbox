'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Image, useTexture, Float } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarSystem } from '../AvatarSystem';
import { FloatingPanel } from '../SpatialUI';

interface SkillNode {
  id: string;
  name: string;
  level: number;
  connections: string[];
}

interface PortfolioItem3D {
  id: string;
  title: string;
  imageUrl: string;
  position: [number, number, number];
}

interface FreelancerStudioProps {
  userId: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string;
  skills?: SkillNode[];
  portfolio?: PortfolioItem3D[];
  stats?: {
    totalEarned: number;
    jobsCompleted: number;
    rating: number;
    responseTime: string;
  };
}

export function FreelancerStudio({
  userId,
  name,
  avatarUrl,
  bio,
  skills = [],
  portfolio = [],
  stats = { totalEarned: 0, jobsCompleted: 0, rating: 0, responseTime: 'N/A' },
}: FreelancerStudioProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Back wall - Portfolio gallery */}
      <group position={[0, 2, -5]}>
        <mesh>
          <planeGeometry args={[12, 6]} />
          <meshStandardMaterial color="#07051a" />
        </mesh>
        
        {portfolio.map((item, i) => (
          <Float key={item.id} speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
            <group position={[(i - portfolio.length / 2) * 2.5, 0, 0.1]}>
              <mesh>
                <planeGeometry args={[2, 1.5]} />
                <meshStandardMaterial color="#0d0a2e" />
              </mesh>
              <Text
                position={[0, -1, 0.1]}
                fontSize={0.2}
                color="#e8e4ff"
                anchorX="center"
              >
                {item.title}
              </Text>
            </group>
          </Float>
        ))}
      </group>

      {/* Left wall - Skills graph */}
      <group position={[-6, 1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <Text position={[0, 3, 0]} fontSize={0.4} color="#00f5ff" anchorX="center">
          Skills
        </Text>
        
        {skills.map((skill, i) => {
          const angle = (i / skills.length) * Math.PI * 2;
          const radius = 2;
          return (
            <group
              key={skill.id}
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
              onClick={() => setSelectedSkill(skill.id)}
            >
              <mesh>
                <sphereGeometry args={[0.3 + skill.level * 0.2, 16, 16]} />
                <meshStandardMaterial
                  color={selectedSkill === skill.id ? '#00f5ff' : '#7b2fff'}
                  emissive={selectedSkill === skill.id ? '#00f5ff' : '#7b2fff'}
                  emissiveIntensity={0.5}
                />
              </mesh>
              <Text position={[0, -0.6, 0]} fontSize={0.15} color="#e8e4ff" anchorX="center">
                {skill.name}
              </Text>
            </group>
          );
        })}
      </group>

      {/* Center - Avatar */}
      <AvatarSystem
        position={[0, 0, 0]}
        userId={userId}
        name={name}
        avatarUrl={avatarUrl}
        color="#00f5ff"
        size={1.2}
      />

      {/* Right panel - Stats */}
      <FloatingPanel position={[5, 1, 0]} width="250px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, color: '#00f5ff', fontSize: '18px' }}>Stats</h3>
          <div>
            <span style={{ color: '#9b94c4' }}>Earned: </span>
            <span style={{ color: '#ffcc00' }}>${stats.totalEarned.toLocaleString()}</span>
          </div>
          <div>
            <span style={{ color: '#9b94c4' }}>Jobs: </span>
            <span style={{ color: '#e8e4ff' }}>{stats.jobsCompleted}</span>
          </div>
          <div>
            <span style={{ color: '#9b94c4' }}>Rating: </span>
            <span style={{ color: '#ffcc00' }}>★ {stats.rating.toFixed(1)}</span>
          </div>
          <div>
            <span style={{ color: '#9b94c4' }}>Response: </span>
            <span style={{ color: '#e8e4ff' }}>{stats.responseTime}</span>
          </div>
        </div>
      </FloatingPanel>

      {/* Floor - Timeline */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#03020a" />
      </mesh>
    </group>
  );
}

export type { FreelancerStudioProps };

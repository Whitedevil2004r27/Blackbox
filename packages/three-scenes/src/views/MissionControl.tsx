'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { FloatingPanel } from '../SpatialUI';
import { AvatarSystem } from '../AvatarSystem';

interface Task3D {
  id: string;
  title: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  assigneeId?: string;
  position: [number, number, number];
}

interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string | null;
  role: string;
  color: string;
}

interface Milestone3D {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'in_review' | 'approved' | 'paid';
  position: [number, number, number];
}

interface MissionControlProps {
  projectId: string;
  projectName: string;
  tasks?: Task3D[];
  teamMembers?: TeamMember[];
  milestones?: Milestone3D[];
  budget?: { total: number; spent: number };
  completion?: number;
  onTaskMove?: (taskId: string, newStatus: string, position: number) => void;
}

const statusColors = {
  backlog: '#5a527a',
  todo: '#00f5ff',
  in_progress: '#ffcc00',
  review: '#ff2fa0',
  done: '#00ff88',
};

const statusPositions: Record<string, [number, number, number]> = {
  backlog: [-6, 0, 0],
  todo: [-3, 0, 0],
  in_progress: [0, 0, 0],
  review: [3, 0, 0],
  done: [6, 0, 0],
};

export function MissionControl({
  projectId,
  projectName,
  tasks = [],
  teamMembers = [],
  milestones = [],
  budget = { total: 0, spent: 0 },
  completion = 0,
  onTaskMove,
}: MissionControlProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Project name */}
      <Text position={[0, 4, 0]} fontSize={0.6} color="#e8e4ff" anchorX="center" fontWeight="bold">
        {projectName}
      </Text>

      {/* Health meter */}
      <group position={[0, 3.2, 0]}>
        <mesh>
          <boxGeometry args={[4, 0.2, 0.1]} />
          <meshStandardMaterial color="#5a527a" />
        </mesh>
        <mesh position={[-2 + (completion / 100) * 2, 0, 0.05]}>
          <boxGeometry args={[(completion / 100) * 4, 0.2, 0.1]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
        </mesh>
        <Text position={[0, -0.4, 0]} fontSize={0.2} color="#9b94c4" anchorX="center">
          {completion}% Complete
        </Text>
      </group>

      {/* Budget display */}
      <FloatingPanel position={[5, 3, 0]} width="200px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ margin: 0, color: '#ffcc00' }}>Budget</h4>
          <div>
            <span style={{ color: '#9b94c4' }}>Total: </span>
            <span style={{ color: '#e8e4ff' }}>${budget.total.toLocaleString()}</span>
          </div>
          <div>
            <span style={{ color: '#9b94c4' }}>Spent: </span>
            <span style={{ color: '#ff2fa0' }}>${budget.spent.toLocaleString()}</span>
          </div>
        </div>
      </FloatingPanel>

      {/* Kanban columns */}
      {Object.entries(statusPositions).map(([status, position]) => (
        <group key={status} position={position}>
          {/* Column header */}
          <Text position={[0, 2.5, 0]} fontSize={0.3} color={statusColors[status as keyof typeof statusColors]} anchorX="center" fontWeight="bold">
            {status.replace('_', ' ').toUpperCase()}
          </Text>

          {/* Column background */}
          <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[2.5, 4]} />
            <meshStandardMaterial
              color={statusColors[status as keyof typeof statusColors]}
              transparent
              opacity={0.05}
            />
          </mesh>

          {/* Tasks in this column */}
          {tasks
            .filter(t => t.status === status)
            .map((task, i) => (
              <RigidBody
                key={task.id}
                position={[0, 1.5 - i * 0.8, 0]}
                colliders="cuboid"
                restitution={0.1}
              >
                <group
                  onPointerOver={() => setHoveredTask(task.id)}
                  onPointerOut={() => setHoveredTask(null)}
                >
                  <mesh>
                    <boxGeometry args={[2, 0.6, 0.1]} />
                    <meshStandardMaterial
                      color={hoveredTask === task.id ? '#e8e4ff' : statusColors[task.status]}
                      emissive={statusColors[task.status]}
                      emissiveIntensity={hoveredTask === task.id ? 0.3 : 0.1}
                    />
                  </mesh>
                  <Text position={[0, 0, 0.06]} fontSize={0.12} color="#e8e4ff" anchorX="center" maxWidth={1.8}>
                    {task.title}
                  </Text>
                </group>
              </RigidBody>
            ))}
        </group>
      ))}

      {/* Team members orbiting */}
      {teamMembers.map((member, i) => {
        const angle = (i / teamMembers.length) * Math.PI * 2;
        const radius = 4;
        return (
          <group
            key={member.id}
            position={[
              Math.cos(angle) * radius,
              -2,
              Math.sin(angle) * radius,
            ]}
          >
            <AvatarSystem
              userId={member.id}
              name={member.name}
              avatarUrl={member.avatarUrl}
              color={member.color}
              size={0.5}
            />
            <Text position={[0, -0.8, 0]} fontSize={0.15} color="#9b94c4" anchorX="center">
              {member.role}
            </Text>
          </group>
        );
      })}

      {/* Milestone timeline */}
      <group position={[0, -3.5, 0]}>
        <Line
          points={[[-5, 0, 0], [5, 0, 0]]}
          color="#7b2fff"
          lineWidth={2}
        />
        {milestones.map((milestone, i) => (
          <group key={milestone.id} position={[-4 + (i / milestones.length) * 8, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial
                color={milestone.status === 'paid' ? '#00ff88' : '#ffcc00'}
                emissive={milestone.status === 'paid' ? '#00ff88' : '#ffcc00'}
                emissiveIntensity={0.5}
              />
            </mesh>
            <Text position={[0, 0.5, 0]} fontSize={0.15} color="#e8e4ff" anchorX="center">
              {milestone.title}
            </Text>
            <Text position={[0, -0.5, 0]} fontSize={0.12} color="#ffcc00" anchorX="center">
              ${milestone.amount.toLocaleString()}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
}

export type { MissionControlProps };

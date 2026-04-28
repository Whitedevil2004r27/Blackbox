'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarSystem } from '../AvatarSystem';

interface NetworkNode {
  id: string;
  name: string;
  avatarUrl?: string | null;
  category: string;
  rating: number;
  experience: number;
  color: string;
  position: [number, number, number];
  connections: string[];
}

interface NetworkGraphProps {
  nodes?: NetworkNode[];
  onNodeClick?: (nodeId: string) => void;
  filter?: string;
}

const categoryColors: Record<string, string> = {
  development: '#00f5ff',
  design: '#ff2fa0',
  marketing: '#7b2fff',
  writing: '#00ff88',
  video: '#ffcc00',
  default: '#9b94c4',
};

export function NetworkGraph({
  nodes = [],
  onNodeClick,
  filter,
}: NetworkGraphProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

  const filteredNodes = useMemo(() => {
    if (!filter) return nodes;
    return nodes.filter(n => 
      n.category.toLowerCase().includes(filter.toLowerCase()) ||
      n.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [nodes, filter]);

  const connections = useMemo(() => {
    const lines: Array<{ from: [number, number, number]; to: [number, number, number]; color: string }> = [];
    filteredNodes.forEach(node => {
      node.connections.forEach(connId => {
        const target = filteredNodes.find(n => n.id === connId);
        if (target) {
          lines.push({
            from: node.position,
            to: target.position,
            color: 'rgba(123, 47, 255, 0.2)',
          });
        }
      });
    });
    return lines;
  }, [filteredNodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      {connections.map((conn, i) => (
        <Line
          key={i}
          points={[conn.from, conn.to]}
          color="#7b2fff"
          lineWidth={1}
          transparent
          opacity={0.2}
        />
      ))}

      {/* Nodes */}
      {filteredNodes.map((node) => {
        const size = 0.5 + (node.rating / 5) * 0.5 + (node.experience / 10) * 0.3;
        const color = categoryColors[node.category.toLowerCase()] || categoryColors.default;

        return (
          <group
            key={node.id}
            position={node.position}
            onClick={() => onNodeClick?.(node.id)}
            onPointerOver={() => setHoveredNode(node.id)}
            onPointerOut={() => setHoveredNode(null)}
          >
            <AvatarSystem
              userId={node.id}
              name={node.name}
              avatarUrl={node.avatarUrl}
              color={color}
              size={size}
            />

            {/* Rating ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[size * 1.4, size * 1.5, 32]} />
              <meshBasicMaterial
                color="#ffcc00"
                transparent
                opacity={node.rating / 5}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Hover info */}
            {hoveredNode === node.id && (
              <group position={[0, size * 2, 0]}>
                <Text fontSize={0.3} color="#e8e4ff" anchorX="center" fontWeight="bold">
                  {node.name}
                </Text>
                <Text position={[0, -0.4, 0]} fontSize={0.2} color="#9b94c4" anchorX="center">
                  {node.category}
                </Text>
                <Text position={[0, -0.7, 0]} fontSize={0.18} color="#ffcc00" anchorX="center">
                  ★ {node.rating.toFixed(1)} • {node.experience}y exp
                </Text>
              </group>
            )}
          </group>
        );
      })}

      {/* Background grid */}
      <gridHelper args={[50, 50, '#1e1b4b', '#0d0a2e']} position={[0, -5, 0]} />
    </group>
  );
}

export type { NetworkGraphProps };

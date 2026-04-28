'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { FloatingPanel } from '../SpatialUI';

interface DashboardMetric {
  label: string;
  value: string | number;
  change?: number;
  color: string;
}

interface DashboardChart {
  title: string;
  data: number[];
  labels: string[];
  color: string;
}

interface DashboardHQProps {
  userName: string;
  metrics?: DashboardMetric[];
  charts?: DashboardChart[];
  activeProjects?: number;
  pendingProposals?: number;
  unreadMessages?: number;
}

export function DashboardHQ({
  userName,
  metrics = [],
  charts = [],
  activeProjects = 0,
  pendingProposals = 0,
  unreadMessages = 0,
}: DashboardHQProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    }
  });

  const barChartData = useMemo(() => {
    return charts[0]?.data || [30, 45, 60, 80, 55, 90, 70];
  }, [charts]);

  return (
    <group ref={groupRef}>
      {/* Welcome text */}
      <Text position={[0, 4, 0]} fontSize={0.5} color="#e8e4ff" anchorX="center" fontWeight="bold">
        Welcome back, {userName}
      </Text>

      {/* Curved displays - Left: Earnings */}
      <group position={[-4, 1, 0]} rotation={[0, 0.3, 0]}>
        <FloatingPanel width="280px">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: 0, color: '#00f5ff', fontSize: '16px' }}>Earnings</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffcc00' }}>
                ${metrics[0]?.value || '0'}
              </span>
              {metrics[0]?.change !== undefined && (
                <span style={{ color: metrics[0].change >= 0 ? '#00ff88' : '#ff2fa0' }}>
                  {metrics[0].change >= 0 ? '+' : ''}{metrics[0].change}%
                </span>
              )}
            </div>
            {/* 3D Bar chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px' }}>
              {barChartData.map((value, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${value}%`,
                    background: `linear-gradient(to top, #00f5ff40, #00f5ff)`,
                    borderRadius: '2px',
                    minHeight: '4px',
                  }}
                />
              ))}
            </div>
          </div>
        </FloatingPanel>
      </group>

      {/* Center: Active Projects */}
      <group position={[0, 1, 2]}>
        <FloatingPanel width="200px">
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#7b2fff', fontSize: '14px' }}>Active Projects</h3>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#e8e4ff' }}>
              {activeProjects}
            </div>
          </div>
        </FloatingPanel>
      </group>

      {/* Right: Pending Proposals */}
      <group position={[4, 1, 0]} rotation={[0, -0.3, 0]}>
        <FloatingPanel width="200px">
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#ff2fa0', fontSize: '14px' }}>Pending Proposals</h3>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#e8e4ff' }}>
              {pendingProposals}
            </div>
          </div>
        </FloatingPanel>
      </group>

      {/* Bottom: Messages */}
      <group position={[0, -2, 0]}>
        <FloatingPanel width="300px">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ff2fa0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              💬
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#e8e4ff' }}>Messages</h4>
              <p style={{ margin: 0, color: '#9b94c4', fontSize: '14px' }}>
                {unreadMessages} unread
              </p>
            </div>
          </div>
        </FloatingPanel>
      </group>

      {/* Holographic calendar */}
      <group position={[0, -1, -3]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2, 2, 0.1, 32]} />
          <meshStandardMaterial
            color="#0d0a2e"
            emissive="#7b2fff"
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
        <Text position={[0, 0.1, 0]} fontSize={0.3} color="#e8e4ff" anchorX="center" rotation={[-Math.PI / 2, 0, 0]}>
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
      </group>

      {/* Floating notification orbs */}
      {unreadMessages > 0 && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[3, 3, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#ff2fa0" />
          </mesh>
        </Float>
      )}
    </group>
  );
}

export type { DashboardHQProps };

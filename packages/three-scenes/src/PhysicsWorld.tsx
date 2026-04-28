'use client';

import React from 'react';
import { Physics } from '@react-three/rapier';

interface PhysicsWorldProps {
  children: React.ReactNode;
  gravity?: [number, number, number];
  paused?: boolean;
}

export function PhysicsWorld({
  children,
  gravity = [0, -0.5, 0],
  paused = false,
}: PhysicsWorldProps) {
  return (
    <Physics gravity={gravity} paused={paused}>
      {children}
    </Physics>
  );
}

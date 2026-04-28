'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

type CameraState = 'idle' | 'flying' | 'focused' | 'orbiting' | 'free';

interface CameraControllerProps {
  defaultPosition?: [number, number, number];
  defaultTarget?: [number, number, number];
  onStateChange?: (state: CameraState) => void;
}

export function CameraController({
  defaultPosition = [0, 0, 10],
  defaultTarget = [0, 0, 0],
  onStateChange,
}: CameraControllerProps) {
  const controlsRef = useRef<CameraControls>(null);
  const { camera } = useThree();
  const stateRef = useRef<CameraState>('idle');
  const idleTimeRef = useRef(0);

  const setState = useCallback((newState: CameraState) => {
    if (stateRef.current !== newState) {
      stateRef.current = newState;
      onStateChange?.(newState);
    }
  }, [onStateChange]);

  const flyTo = useCallback((
    position: [number, number, number],
    target: [number, number, number],
    duration = 1.2
  ) => {
    setState('flying');
    const controls = controlsRef.current;
    if (!controls) return;

    gsap.to(controls, {
      duration,
      ease: 'power3.inOut',
      onUpdate: () => {
        controls.setLookAt(...position, ...target, false);
      },
      onComplete: () => {
        setState('focused');
      },
    });
  }, [setState]);

  const focusOn = useCallback((object: THREE.Object3D, distance = 5, duration = 1.2) => {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const offset = maxDim * 1.5;

    const position: [number, number, number] = [
      center.x + offset,
      center.y + offset * 0.5,
      center.z + distance,
    ];

    flyTo(position, [center.x, center.y, center.z], duration);
  }, [flyTo]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (stateRef.current === 'flying') return;
      const controls = controlsRef.current;
      if (!controls) return;

      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.multiplyScalar(e.deltaY * 0.01);
      controls.truck(forward.x, forward.y, true);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [camera]);

  useFrame((_, delta) => {
    if (stateRef.current === 'idle') {
      idleTimeRef.current += delta;
      if (idleTimeRef.current > 3) {
        const controls = controlsRef.current;
        if (controls) {
          controls.azimuthAngle += delta * 0.05;
        }
      }
    } else {
      idleTimeRef.current = 0;
    }
  });

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={1}
      maxDistance={100}
      smoothTime={0.5}
      draggingSmoothTime={0.2}
      dollyToCursor
    />
  );
}

export type { CameraState };

'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 400;
const BOUNDS = { x: 9, yTop: 5, yBottom: -5, zNear: 1, zFar: -8 };

function GoldDust() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOUNDS.x * 2;
      pos[i * 3 + 1] = Math.random() * (BOUNDS.yTop - BOUNDS.yBottom) + BOUNDS.yBottom;
      pos[i * 3 + 2] = Math.random() * (BOUNDS.zNear - BOUNDS.zFar) + BOUNDS.zFar;
      spd[i] = 0.05 + Math.random() * 0.12;
    }
    return [pos, spd];
  }, []);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useFrame((_, delta) => {
    if (reducedMotion || !pointsRef.current) return;
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      let y = attr.getY(i) + speeds[i] * delta;
      if (y > BOUNDS.yTop) y = BOUNDS.yBottom;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#E8C878"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

export function HeroParticles() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 5], fov: 55 }}
      className="!absolute inset-0"
    >
      <GoldDust />
    </Canvas>
  );
}

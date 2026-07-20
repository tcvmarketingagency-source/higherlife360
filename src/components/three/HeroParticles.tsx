'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 400;
const BOUNDS = { x: 9, yTop: 5, yBottom: -5, zNear: 1, zFar: -8 };

// Three.js's default PointsMaterial sprite is a hard-edged square — this
// procedurally draws a small radial-gradient (opaque center fading to fully
// transparent edge) onto an offscreen canvas and uses it as the point
// sprite's alpha, so each point renders as a soft, feathered circle instead.
// Generated at runtime (not a downloaded asset) so there's no extra network
// request and it stays trivially cheap — one 64x64 canvas, created once.
function createDustSpriteTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const center = size / 2;
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.7)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function GoldDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const dustSprite = useMemo(() => createDustSpriteTexture(), []);

  useEffect(() => {
    return () => {
      dustSprite?.dispose();
    };
  }, [dustSprite]);

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
        color="#F2B85E"
        size={0.045}
        sizeAttenuation
        map={dustSprite ?? undefined}
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

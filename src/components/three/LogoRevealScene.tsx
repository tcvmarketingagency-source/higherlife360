'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { CREST_LOGO_SRC } from '@/lib/brand';
import {
  TOTAL_REVEAL_DURATION_S,
  ROTATION_TURNS,
  ENTRANCE_DURATION_S,
  DISSOLVE_DURATION_S,
} from '@/lib/logo-reveal-timing';

const GOLD = '#E8A33D';
const GOLD_LIGHT = '#F2B85E';
const GOLD_DEEP = '#855708';

// Rotation starts slightly after the entrance begins, so the crest is
// already popping into view before it starts turning.
const ROTATION_DELAY_S = 0.15;
// Starting and resting Y-rotation (radians) — the crest turns from a
// slight angle, through ROTATION_TURNS full turns, to rest just past
// straight-on rather than landing perfectly flat.
const ROTATION_START_RAD = -0.5;
const ROTATION_REST_OFFSET_RAD = 0.05;

// This 3D timeline's own duration is the total reveal time minus the DOM
// cross-fade that happens afterward in LogoReveal.tsx; the rotation phase
// then gets whatever's left after the entrance's own start delay, so it
// runs for essentially the whole sequence.
const SCENE_DURATION_S = TOTAL_REVEAL_DURATION_S - DISSOLVE_DURATION_S;
const ROTATION_DURATION_S = SCENE_DURATION_S - ROTATION_DELAY_S;
const ROTATION_END_RAD =
  ROTATION_START_RAD + ROTATION_TURNS * Math.PI * 2 + ROTATION_REST_OFFSET_RAD;

// The crest artwork, floated just off the medallion's front AND back faces
// as its own transparent planes — keeping it separate from the medallion
// body (rather than a texture on the RoundedBox itself) sidesteps
// multi-material UV mapping on the rounded box entirely.
//
// Both planes share one THREE.MeshStandardMaterial instance so they're
// visually one gold surface (same metalness/roughness/emissive, same
// fade-in), not two independently-lit stickers.
//
// The back plane is positioned behind the medallion AND given its own
// rotation.y = π. Position alone would make it face the wrong way (culled/
// invisible from outside) or, with a naive double-sided material, show the
// SAME UVs mirrored left-right when viewed from behind — like reading the
// front page through the back of the paper. Rotating that plane's own
// geometry 180° about the same axis the whole group turns on flips its UVs
// back the other way, cancelling that mirroring, the same way a coin's
// reverse die is engraved backwards so the minted coin reads correctly.
function CrestEmblem() {
  const texture = useTexture(CREST_LOGO_SRC);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
  }, [texture]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.05,
        metalness: 0.25,
        roughness: 0.4,
        emissive: new THREE.Color(GOLD_DEEP),
        emissiveIntensity: 0.1,
        opacity: 0,
      }),
    [texture]
  );

  useEffect(() => () => material.dispose(), [material]);

  useGSAP(() => {
    gsap.fromTo(
      material,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.25 }
    );
  }, [material]);

  const image = texture.image as { width?: number; height?: number } | undefined;
  const aspect = image?.width && image?.height ? image.width / image.height : 0.8;
  const height = 1.5;
  const width = height * aspect;
  const offset = 0.105;

  return (
    <>
      <mesh position={[0, 0, offset]} material={material}>
        <planeGeometry args={[width, height]} />
      </mesh>
      <mesh position={[0, 0, -offset]} rotation={[0, Math.PI, 0]} material={material}>
        <planeGeometry args={[width, height]} />
      </mesh>
    </>
  );
}

function CrestMedallion({ onSettled }: { onSettled: () => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useGSAP(
    () => {
      const group = groupRef.current;
      if (!group) return;

      gsap.set(group.scale, { x: 0.01, y: 0.01, z: 0.01 });
      gsap.set(group.position, { y: -0.22 });
      gsap.set(group.rotation, { y: ROTATION_START_RAD });

      const tl = gsap.timeline({ onComplete: onSettled });

      tl.to(
        group.scale,
        { x: 1, y: 1, z: 1, duration: ENTRANCE_DURATION_S, ease: 'power3.out' },
        0
      )
        .to(group.position, { y: 0, duration: ENTRANCE_DURATION_S, ease: 'power3.out' }, 0)
        // A single continuous tween (rather than a sweep-then-correct pair)
        // so the turn never reads as mechanical — sine.inOut eases it
        // gently off rest at the start and gently down into the settle at
        // the end, with nothing but smooth motion in between.
        .to(
          group.rotation,
          { y: ROTATION_END_RAD, duration: ROTATION_DURATION_S, ease: 'sine.inOut' },
          ROTATION_DELAY_S
        );

      return () => {
        tl.kill();
      };
    },
    { scope: groupRef }
  );

  return (
    <group ref={groupRef}>
      <RoundedBox args={[1.7, 2.05, 0.19]} radius={0.07} smoothness={4}>
        <meshStandardMaterial
          color={GOLD}
          metalness={0.4}
          roughness={0.38}
          emissive={GOLD_DEEP}
          emissiveIntensity={0.15}
        />
      </RoundedBox>
      <Suspense fallback={null}>
        <CrestEmblem />
      </Suspense>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.85} color="#FFF6E5" />
      <directionalLight position={[2.5, 3, 3]} intensity={2.4} color="#FFE9C2" />
      <directionalLight position={[-3, 1, 2]} intensity={1} color="#8FA6D9" />
      <directionalLight position={[0, -2, 3]} intensity={0.8} color={GOLD_LIGHT} />
    </>
  );
}

export function LogoRevealScene({ onSettled }: { onSettled: () => void }) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Belt-and-braces WebGL cleanup on unmount — R3F already disposes the
  // renderer itself when the Canvas unmounts, but the reveal is explicitly
  // required not to hold GPU memory once it's done, so this forces the
  // context to release immediately rather than waiting on GC.
  useEffect(() => {
    return () => {
      rendererRef.current?.dispose();
      rendererRef.current?.forceContextLoss();
    };
  }, []);

  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 4.4], fov: 40 }}
      className="!absolute inset-0"
      onCreated={({ gl }) => {
        rendererRef.current = gl;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Lights />
      <CrestMedallion onSettled={onSettled} />
    </Canvas>
  );
}

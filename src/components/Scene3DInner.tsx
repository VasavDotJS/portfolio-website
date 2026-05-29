'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function MorphingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Smooth slow rotation
      meshRef.current.rotation.x = time * 0.08;
      meshRef.current.rotation.y = time * 0.12;

      // Morphing scale based on mathematical sine loops to feel organic/fluid
      const scale = 1.3 + Math.sin(time * 1.5) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 2]} />
      <meshBasicMaterial
        color="#ffffff"
        wireframe
        transparent
        opacity={0.06}
      />
    </mesh>
  );
}

function ParticleWeb() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Circular galaxy/cloud distributions
      const r = 2.5 + Math.random() * 7.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      // Rotation and slight wobble simulating floatation
      pointsRef.current.rotation.y = time * 0.02;
      pointsRef.current.rotation.x = Math.sin(time * 0.04) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.22}
      />
    </points>
  );
}

export default function Scene3DInner() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-[#0b0b0c] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <MorphingOrb />
        <ParticleWeb />
      </Canvas>
    </div>
  );
}

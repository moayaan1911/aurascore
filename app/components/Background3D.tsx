"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// Helper function to generate particle data (outside component to avoid render issues)
function generateParticles(count: number) {
  const temp = [];
  for (let i = 0; i < count; i++) {
    const t = Math.random() * 100;
    const factor = 20 + Math.random() * 100;
    const speed = 0.01 + Math.random() / 200;
    const xFactor = -50 + Math.random() * 100;
    const yFactor = -50 + Math.random() * 100;
    const zFactor = -50 + Math.random() * 100;
    temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
  }
  return temp;
}

function FloatingMesh({
  position,
  color,
  speed,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    // Complex rotation
    mesh.current.rotation.x = time * speed * 0.2;
    mesh.current.rotation.y = time * speed * 0.3;
    mesh.current.rotation.z = time * speed * 0.1;
  });

  return (
    <Float
      speed={speed * 2} // Animation speed
      rotationIntensity={1} // Float intensity
      floatIntensity={2} // Up/down float intensity
      position={position}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function FloatingParticles({ count = 100 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => generateParticles(count), [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!mesh.current) return;
    const currentMesh = mesh.current;

    particles.forEach((particle, i) => {
      const { factor, speed, xFactor, yFactor, zFactor } = particle;
      let t = particle.t;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      currentMesh.setMatrixAt(i, dummy.matrix);
    });
    currentMesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshPhongMaterial
        color="#00ff88"
        emissive="#00ff88"
        emissiveIntensity={0.5}
      />
    </instancedMesh>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-[-1] bg-black">
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight
          position={[10, 10, 10]}
          intensity={1}
          color="#00ff88"
        />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#004400"
        />

        {/* Background Stars */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Floating Geometric Shapes - More shapes with faster speeds */}
        <FloatingMesh
          position={[-8, 4, -5]}
          color="#00ff88"
          speed={3.0}
        />
        <FloatingMesh
          position={[8, -4, -5]}
          color="#008844"
          speed={2.5}
        />
        <FloatingMesh
          position={[-5, -6, 0]}
          color="#44ffaa"
          speed={3.5}
        />
        <FloatingMesh
          position={[6, 5, 0]}
          color="#00cc66"
          speed={2.8}
        />
        <FloatingMesh
          position={[0, 8, -8]}
          color="#00ff88"
          speed={3.2}
        />
        <FloatingMesh
          position={[-10, -2, -3]}
          color="#22ff99"
          speed={2.7}
        />
        <FloatingMesh
          position={[10, 2, -6]}
          color="#00dd77"
          speed={3.3}
        />
        <FloatingMesh
          position={[3, -8, -4]}
          color="#33ffaa"
          speed={2.9}
        />

        {/* Particle Cloud */}
        <FloatingParticles count={150} />

        {/* Fog for depth */}
        <fog
          attach="fog"
          args={["#000000", 10, 50]}
        />
      </Canvas>
    </div>
  );
}

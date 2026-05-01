"use client";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// Goroutines visualization: orbiting particles around a core
function ConcurrencyOrb({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (group.current) group.current.rotation.y += dt * 0.4; });
  const goroutines = Array.from({ length: 8 });
  return (
    <group position={position}>
      <mesh><sphereGeometry args={[0.5, 32, 32]} /><meshStandardMaterial color="#00ADD8" emissive="#00ADD8" emissiveIntensity={0.6} /></mesh>
      <group ref={group}>
        {goroutines.map((_, i) => {
          const a = (i / goroutines.length) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 1.4, Math.sin(a * 2) * 0.3, Math.sin(a) * 1.4]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#5DC9E2" emissive="#5DC9E2" emissiveIntensity={0.8} />
            </mesh>
          );
        })}
      </group>
      <Text position={[0, -1.2, 0]} fontSize={0.22} color="white">Go Concurrency</Text>
    </group>
  );
}

// K8s cluster: a 3x3 grid of nodes
function K8sCluster({ position }: { position: [number, number, number] }) {
  const nodes = [];
  for (let x = 0; x < 3; x++) for (let z = 0; z < 3; z++) {
    nodes.push([x * 0.6 - 0.6, 0, z * 0.6 - 0.6] as [number, number, number]);
  }
  return (
    <group position={position}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#326ce5" emissive="#326ce5" emissiveIntensity={0.3} />
        </mesh>
      ))}
      <Text position={[0, -0.8, 0]} fontSize={0.22} color="white">Kubernetes</Text>
    </group>
  );
}

// CI/CD pipeline scroll
function PipelineScroll({ position }: { position: [number, number, number] }) {
  const stages = ["build", "test", "scan", "deploy"];
  return (
    <group position={position}>
      {stages.map((s, i) => (
        <group key={s} position={[i * 0.9 - 1.35, 0, 0]}>
          <mesh><cylinderGeometry args={[0.25, 0.25, 0.1, 16]} /><meshStandardMaterial color="#CE3262" emissive="#CE3262" emissiveIntensity={0.4} /></mesh>
          <Text position={[0, 0.4, 0]} fontSize={0.16} color="white">{s}</Text>
        </group>
      ))}
      <Text position={[0, -0.8, 0]} fontSize={0.22} color="white">CI/CD</Text>
    </group>
  );
}

export function Library() {
  return (
    <group position={[-18, 0, 0]}>
      {/* Floor demarcation */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#2c2440" />
      </mesh>
      <ConcurrencyOrb position={[-4, 1.5, 0]} />
      <K8sCluster position={[0, 0.8, 0]} />
      <PipelineScroll position={[4, 1.2, 0]} />
      <Text position={[0, 4, -6]} fontSize={0.7} color="#FDDD00">THE LIBRARY</Text>
    </group>
  );
}

"use client";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface Portal { label: string; url: string; color: string; pos: [number, number, number]; }

const portals: Portal[] = [
  { label: "GitHub",   url: "https://github.com/yourname",   color: "#ffffff", pos: [-3, 1.5, 0] },
  { label: "LinkedIn", url: "https://linkedin.com/in/yourname", color: "#0A66C2", pos: [0, 1.5, 0] },
  { label: "Twitter",  url: "https://twitter.com/yourname",  color: "#1DA1F2", pos: [3, 1.5, 0] },
];

function PortalRing({ portal }: { portal: Portal }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ringRef.current) ringRef.current.rotation.z += dt * 0.5; });
  return (
    <group position={portal.pos} onClick={() => window.open(portal.url, "_blank")}>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.9, 0.08, 16, 64]} />
        <meshStandardMaterial color={portal.color} emissive={portal.color} emissiveIntensity={0.7} />
      </mesh>
      <Text position={[0, -1.3, 0]} fontSize={0.25} color="white">{portal.label}</Text>
    </group>
  );
}

export function Lookout() {
  return (
    <group position={[18, 0, 0]}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#1a2c40" />
      </mesh>
      {portals.map((p) => <PortalRing key={p.label} portal={p} />)}
      <Text position={[0, 4, -6]} fontSize={0.7} color="#FDDD00">THE LOOKOUT</Text>
    </group>
  );
}

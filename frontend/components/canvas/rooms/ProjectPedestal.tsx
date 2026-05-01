"use client";
import { useBox } from "@react-three/cannon";
import { Html, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useGameStore } from "@/lib/store";

interface Props {
  slug: string;
  title: string;
  position: [number, number, number];
  playerPos: React.MutableRefObject<[number, number, number]>;
}

export function ProjectPedestal({ slug, title, position, playerPos }: Props) {
  const [base] = useBox(() => ({ type: "Static", args: [1.4, 1.2, 1.4], position }));
  const orbRef = useRef<THREE.Mesh>(null);
  const [near, setNear] = useState(false);
  const setNearby = useGameStore((s) => s.setNearbyProject);
  const openProject = useGameStore((s) => s.openProject);

  useFrame((_, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.6;
      orbRef.current.position.y = position[1] + 2 + Math.sin(performance.now() * 0.002) * 0.15;
    }
    const dx = playerPos.current[0] - position[0];
    const dz = playerPos.current[2] - position[2];
    const dist = Math.hypot(dx, dz);
    const isNear = dist < 3;
    if (isNear !== near) {
      setNear(isNear);
      setNearby(isNear ? slug : null);
    }
  });

  useEffect(() => {
    if (!near) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyE") openProject(slug);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [near, slug, openProject]);

  return (
    <group>
      <mesh ref={base as never} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.2, 1.4]} />
        <meshStandardMaterial color="#3b3b52" roughness={0.7} />
      </mesh>
      <mesh ref={orbRef} position={[position[0], position[1] + 2, position[2]]} castShadow>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial
          color={near ? "#FDDD00" : "#00ADD8"}
          emissive={near ? "#FDDD00" : "#00ADD8"}
          emissiveIntensity={near ? 0.8 : 0.3}
        />
      </mesh>
      <Text
        position={[position[0], position[1] + 1.0, position[2]]}
        fontSize={0.22}
        color="white"
        anchorX="center"
      >
        {title}
      </Text>
      {near && (
        <Html position={[position[0], position[1] + 2.8, position[2]]} center>
          <div className="px-3 py-1 rounded bg-black/70 text-white text-xs whitespace-nowrap border border-cyan-400">
            Press [E] to inspect
          </div>
        </Html>
      )}
    </group>
  );
}

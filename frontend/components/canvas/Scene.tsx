"use client";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Sky, Stars, Preload } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { Player } from "./Player";
import { Ground } from "./Ground";
import { Lighting } from "./Lighting";
import { Castle } from "./Castle";

export function Scene() {
  // Shared player position ref for proximity checks
  const playerPos = useRef<[number, number, number]>([0, 1.5, 8]);

  return (
    <Canvas shadows camera={{ position: [0, 8, 16], fov: 55 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <color attach="background" args={["#0b0d1a"]} />
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={150} depth={50} count={3000} factor={4} fade />
        <Lighting />
        <Physics gravity={[0, -20, 0]} defaultContactMaterial={{ friction: 0.2 }}>
          <Ground />
          <Player />
          <Castle playerPos={playerPos} />
        </Physics>
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

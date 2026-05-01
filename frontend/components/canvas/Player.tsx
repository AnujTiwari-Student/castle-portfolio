"use client";
import { useSphere } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useGameStore } from "@/lib/store";

const SPEED = 6;
const JUMP_VELOCITY = 5.5;

export function Player() {
  const controls = useKeyboard();
  const isPaused = useGameStore((s) => s.isPaused);

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 1.5, 8],
    args: [0.6],
    fixedRotation: true,
    linearDamping: 0.9,
  }));

  const velocity = useRef<[number, number, number]>([0, 0, 0]);
  const position = useRef<[number, number, number]>([0, 1.5, 8]);

  useEffect(() => {
    const unsubV = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubP = api.position.subscribe((p) => (position.current = p));
    return () => { unsubV(); unsubP(); };
  }, [api]);

  const { camera } = useThree();
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();

  useFrame(() => {
    if (isPaused) {
      api.velocity.set(0, velocity.current[1], 0);
      return;
    }
    const { forward, backward, left, right, jump } = controls.current;

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED);

    // Rotate movement to camera yaw
    const yaw = Math.atan2(
      camera.position.x - position.current[0],
      camera.position.z - position.current[2]
    );
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw + Math.PI);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], JUMP_VELOCITY, velocity.current[2]);
    }
  });

  return (
    <mesh ref={ref as never} castShadow>
      <sphereGeometry args={[0.6, 24, 24]} />
      <meshStandardMaterial color="#00ADD8" roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

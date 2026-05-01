"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { RefObject } from "react";
import * as THREE from "three";

export function FollowCamera({ targetRef }: { targetRef: RefObject<THREE.Object3D | null> }) {
  const { camera } = useThree();
  const offset = new THREE.Vector3(0, 5, 9);
  const lookAt = new THREE.Vector3();

  useFrame(() => {
    if (!targetRef.current) return;
    const target = targetRef.current.position;
    const desired = target.clone().add(offset);
    camera.position.lerp(desired, 0.08);
    lookAt.copy(target).y += 1;
    camera.lookAt(lookAt);
  });
  return null;
}

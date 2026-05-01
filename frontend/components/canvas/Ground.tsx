"use client";
import { usePlane } from "@react-three/cannon";

export function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));
  return (
    <mesh ref={ref as never} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#2a2d3a" />
    </mesh>
  );
}

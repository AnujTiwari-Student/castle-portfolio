"use client";
import { useBox } from "@react-three/cannon";
import { ProjectPedestal } from "./ProjectPedestal";

const projects = [
  { slug: "go-microservices", title: "Go Microservices", pos: [-6, 0.6, -8] as [number, number, number] },
  { slug: "k8s-platform",     title: "K8s Platform",     pos: [0, 0.6, -10] as [number, number, number] },
  { slug: "realtime-chat",    title: "Realtime Chat",    pos: [6, 0.6, -8] as [number, number, number] },
];

function Walls() {
  const wallProps = (pos: [number, number, number], size: [number, number, number]) =>
    ({ type: "Static" as const, position: pos, args: size });
  const [back] = useBox(() => wallProps([0, 2, -14], [20, 4, 0.5]));
  const [leftW] = useBox(() => wallProps([-10, 2, -8], [0.5, 4, 12]));
  const [rightW] = useBox(() => wallProps([10, 2, -8], [0.5, 4, 12]));
  return (
    <>
      <mesh ref={back as never} receiveShadow><boxGeometry args={[20, 4, 0.5]} /><meshStandardMaterial color="#4a3a2c" /></mesh>
      <mesh ref={leftW as never} receiveShadow><boxGeometry args={[0.5, 4, 12]} /><meshStandardMaterial color="#4a3a2c" /></mesh>
      <mesh ref={rightW as never} receiveShadow><boxGeometry args={[0.5, 4, 12]} /><meshStandardMaterial color="#4a3a2c" /></mesh>
    </>
  );
}

export function Forge({ playerPos }: { playerPos: React.MutableRefObject<[number, number, number]> }) {
  return (
    <group>
      <Walls />
      {projects.map((p) => (
        <ProjectPedestal key={p.slug} slug={p.slug} title={p.title} position={p.pos} playerPos={playerPos} />
      ))}
    </group>
  );
}

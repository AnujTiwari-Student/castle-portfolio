"use client";
import { Forge } from "./rooms/Forge";
import { Library } from "./rooms/Library";
import { Lookout } from "./rooms/Lookout";

export function Castle({ playerPos }: { playerPos: React.MutableRefObject<[number, number, number]> }) {
  return (
    <group>
      <Forge playerPos={playerPos} />
      <Library />
      <Lookout />
    </group>
  );
}

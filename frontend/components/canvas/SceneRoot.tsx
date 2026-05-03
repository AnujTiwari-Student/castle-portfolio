// frontend/components/canvas/SceneRoot.tsx

'use client'

import { useMemo } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { WORLD } from '@/lib/constants'

type MeshProps = ThreeElements['mesh']

interface SceneRootProps {
  showDebugOrigin?: boolean
}

/**
 * Root 3D scene composition component.
 *
 * Keep this file focused on scene composition only.
 * Do not put HUD, modal UI, API fetching, keyboard listeners,
 * player store logic, or backend calls here.
 *
 * This file intentionally avoids importing Lighting, Environment, Ground,
 * or City components until those files exist.
 */
export function SceneRoot({ showDebugOrigin = true }: SceneRootProps) {
  const groundArgs = useMemo<[number, number]>(
    () => [WORLD.groundSize, WORLD.groundSize],
    []
  )

  return (
    <>
      {/* Temporary lighting.
          Replace with <Lighting /> after frontend/components/canvas/Lighting.tsx exists. */}
      <ambientLight intensity={WORLD.ambientIntensity} />

      <directionalLight
        castShadow
        position={[12, 18, 8]}
        intensity={1.4}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Temporary fog.
          Keep aligned with WORLD config. */}
      <fog attach="fog" args={[WORLD.fogColor, WORLD.fogNear, WORLD.fogFar]} />

      {/* Temporary ground.
          Replace with <Ground /> after frontend/components/canvas/Ground.tsx exists. */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <planeGeometry args={groundArgs} />
        <meshStandardMaterial color={WORLD.groundColor} />
      </mesh>

      {/* Temporary city origin marker.
          Replace with <City /> after frontend/components/world/City.tsx exists. */}
      {showDebugOrigin ? <DebugOriginMarker position={[0, 0.5, 0]} /> : null}
    </>
  )
}

function DebugOriginMarker(props: MeshProps) {
  return (
    <group position={props.position}>
      <mesh castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#005EB8" emissive="#002b55" />
      </mesh>

      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color="#ffffff" emissive="#222222" />
      </mesh>
    </group>
  )
}

export default SceneRoot
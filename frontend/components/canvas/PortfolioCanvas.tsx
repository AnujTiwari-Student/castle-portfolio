// frontend/components/canvas/PortfolioCanvas.tsx

'use client'

import { Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { CAMERA } from '@/lib/constants'

interface PortfolioCanvasProps {
  children?: ReactNode
  className?: string
}

/**
 * Main React Three Fiber canvas wrapper.
 *
 * This component should stay focused on Canvas setup only.
 * Do not put HUD, modals, Zustand store setup, or gameplay logic here.
 *
 * Future scene components should be passed as children or mounted from page.tsx.
 */
export function PortfolioCanvas({
  children,
  className = '',
}: PortfolioCanvasProps) {
  return (
    <div className={`relative h-screen w-full overflow-hidden bg-black ${className}`}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{
          position: CAMERA.offset,
          fov: CAMERA.fov,
          near: CAMERA.near,
          far: CAMERA.far,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}

export default PortfolioCanvas
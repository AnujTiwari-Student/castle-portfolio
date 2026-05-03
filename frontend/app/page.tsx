import PortfolioCanvas from '@/components/canvas/PortfolioCanvas'
import SceneRoot from '@/components/canvas/SceneRoot'

export default function HomePage() {
  return (
    <main className="h-screen w-full">
      <PortfolioCanvas>
        <SceneRoot />
      </PortfolioCanvas>
    </main>
  )
}
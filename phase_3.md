Read root readme.md, WORKFLOW.md, DETAILS.md, and the current codebase.

Now implement Phase 2 only: Core Player, Camera, Interaction, HUD, and Map Systems.

Hard constraints:

- Frontend code stays inside frontend/.
- Use frontend/src/.
- Do not create root src/.
- Do not touch backend yet.
- Do not touch Prisma yet.
- Prisma must remain at root/prisma/schema.prisma.

Goal:

Add the core gameplay foundation so Anuj can move around the 3D city, interact with placeholder objects, see HUD prompts, use a minimap, open a full city map, and activate checkpoints.

Implement:

1. Anuj player placeholder
2. Third-person camera follow
3. WASD movement
4. Jump
5. Basic physics using @react-three/rapier
6. Monkey companion placeholder sitting on Anuj’s shoulder
7. Interaction system
8. Interaction prompt UI
9. Minimap scaffold
10. Full city map overlay scaffold
11. Checkpoint system
12. Respawn system placeholder

Add/update files:

frontend/src/components/player/
  AnujPlayer.tsx
  PlayerController.tsx
  ThirdPersonCamera.tsx
  MonkeyCompanion.tsx

frontend/src/components/systems/interaction/
  InteractionProvider.tsx
  useInteraction.ts
  interactableTypes.ts

frontend/src/components/systems/checkpoints/
  Checkpoint.tsx
  checkpointStore.ts

frontend/src/components/systems/map/
  MiniMap.tsx
  CityMapOverlay.tsx
  mapData.ts

frontend/src/components/ui/
  HUD.tsx
  InteractionPrompt.tsx

frontend/src/stores/
  playerStore.ts
  uiStore.ts
  gameStore.ts

frontend/src/hooks/
  useKeyboard.ts

Interaction system requirements:

Create a reusable interaction type:

```ts
export type Interactable = {
  id: string
  label: string
  type:
    | "lever"
    | "terminal"
    | "door"
    | "elevator"
    | "seat"
    | "checkpoint"
    | "resume"
    | "food"
    | "map"
    | "headphones"
    | "cheat-console"
    | "reception"
  position: [number, number, number]
  radius: number
  onInteract: () => void
}
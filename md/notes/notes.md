# NOTES.md — Integration Notes, Pending Fixes, and Implementation Contracts

This file tracks integration details that are not fully implemented yet, but must be respected while building the project one file/component at a time.

The goal is to prevent broken assumptions, duplicated logic, and error-prone wiring.

---

## 1. Current Project Structure Rule

The frontend does **not** use a `src/` directory.

Current frontend structure:

```txt
frontend/
├── app/
├── components/
├── data/
├── hooks/
├── lib/
├── public/
├── stores/
└── types/
```

Important rules:

- Do not create `frontend/src/`.
- Do not place files under `frontend/src/*`.
- Use `frontend/app`, `frontend/components`, `frontend/data`, `frontend/lib`, `frontend/stores`, and `frontend/types`.
- Current type file location:

```txt
frontend/types/index.ts
```

- Current constants file location:

```txt
frontend/lib/constants.ts
```

---

## 2. Existing Generated / Planned Stores

### Existing or Planned Store Files

```txt
frontend/stores/usePlayerStore.ts
frontend/stores/useGameStore.ts
frontend/stores/useExperienceStore.ts
frontend/stores/useSocialStore.ts
frontend/stores/useProjectStore.ts
frontend/stores/useCompanionStore.ts
frontend/stores/useJioCabinStore.ts
```

### Responsibility Boundaries

| Store | Responsibility |
|---|---|
| `usePlayerStore` | Anuj position, rotation, HP, checkpoint, current zone, sitting/coding mode |
| `useGameStore` | Global map, cheat console, active cheats, Resume Citadel unlock/bypass flags |
| `useExperienceStore` | Experience projector, timeline slides, overload state, auto-advance flag |
| `useSocialStore` | Social Tower elevator state, current floor, target floor, roof/parachute state |
| `useProjectStore` | SRE Lab projects, selected project, filters, terminal open state |
| `useCompanionStore` | Monkey location, mood, animation intent, shoulder/monitor transitions |
| `useJioCabinStore` | Jio cabin portal state, focus mode, coding loop, snippet loading |

Do not dump unrelated state into one store.

---

## 3. Anuj Character Rule

Anuj is the main male character from the beginning.

Do not visually represent Anuj as a capsule.

A simplified invisible collider is allowed for physics, but the visual identity must remain:

```txt
Anuj = male 3D character
Monkey = Gopher-style pet companion
```

Correct separation:

```txt
ANUJ_CHARACTER      → visual identity, model path, animation names
PLAYER_PHYSICS      → invisible collider/controller settings
MONKEY_COMPANION    → pet companion config
```

Do not name visual character constants as `capsuleHeight`, `capsuleRadius`, or anything that implies the player is visually a capsule.

---

## 4. Monkey Companion Integration Notes

Monkey should be controlled by:

```txt
frontend/stores/useCompanionStore.ts
```

Expected behavior:

- default location: Anuj’s shoulder
- while roaming: Monkey stays on shoulder
- while Anuj starts coding in Jio Cabin: Monkey moves to monitor
- while coding: Monkey sits on the ultra-wide monitor
- when coding exits: Monkey returns to shoulder

Expected future usage:

```ts
useCompanionStore.getState().enterCodingMode()
```

When Anuj exits coding mode:

```ts
useCompanionStore.getState().exitCodingMode()
```

The actual 3D animation should be handled by future components:

```txt
frontend/components/player/MonkeyCompanion.tsx
frontend/components/zones/reliance-jio/MonkeyMonitorPerch.tsx
```

The store should only describe intended state, not perform mesh animation directly.

---

## 5. Reliance Jio Branding Config

All Reliance Jio cabin branding must come from:

```txt
frontend/app/config/branding.ts
```

Do not hardcode personal details inside React components.

Config should control:

- user name
- role
- company
- employment date
- Jio plaque
- status panels
- tech stack wall
- Grafana-inspired dashboards
- achievement shelf
- custom sections

Future Jio components should import:

```ts
import { brandingConfig } from '@/app/config/branding'
```

Useful helpers from `frontend/lib/utils.ts`:

```ts
import {
  resolveBrandingTemplate,
  getVisibleJioStatusPanels,
  getVisibleJioDashboardPanels,
  getVisibleJioTechStackItems,
  getVisibleJioAchievements,
  getVisibleJioCustomSections,
} from '@/lib/utils'
```

Expected usage:

```ts
const title = resolveBrandingTemplate(
  brandingConfig.jioCabin.plaque.titleTemplate,
  brandingConfig
)
```

Do not manually write:

```tsx
Anuj Tiwari | Software Engineer (Apprentice)
```

inside components.

---

## 6. Jio Cabin Coding Loop Contract

Future file:

```txt
frontend/stores/useJioCabinStore.ts
```

should coordinate Jio cabin state.

When Anuj starts coding inside Jio Cabin:

1. Anuj must already be inside Jio Cabin.
2. Anuj sits on the ergonomic chair.
3. Player mode changes to `focus-coding`.
4. Focus camera activates.
5. Coding loop starts.
6. Dummy code appears on the ultra-wide monitor.
7. Grafana-style dashboards continue animating.
8. Monkey moves from Anuj’s shoulder to monitor.
9. Typing animation starts.

Expected future flow:

```ts
usePlayerStore.getState().setCoding(true)
useCompanionStore.getState().enterCodingMode()
useJioCabinStore.getState().startCodingLoop()
```

When Anuj exits coding mode:

```ts
useJioCabinStore.getState().stopCodingLoop()
usePlayerStore.getState().exitCoding()
useCompanionStore.getState().exitCodingMode()
```

Expected keybinding:

```txt
Esc → exit focus mode
```

Do not put this orchestration inside random UI components. Keep it centralized in `useJioCabinStore` or a dedicated Jio coding component.

---

## 7. Jio Code Snippet Integration

Frontend-first fallback:

- use a local mock string for the code snippet
- typing animation should work even if backend is unavailable

Future backend file:

```txt
backend/public/snippets/jio_work.go
```

Future backend endpoint:

```txt
GET /api/snippets/jio-work
```

Future frontend behavior:

```txt
Try backend snippet
→ if backend fails, use local mock snippet
→ keep typing animation working
```

Do not block the Jio cabin UI if snippet fetching fails.

---

## 8. Social Tower Elevator Flow

Store file:

```txt
frontend/stores/useSocialStore.ts
```

The store owns:

- current floor
- target floor
- elevator status
- elevator open/closed state
- roof access
- parachute state

The store does **not** own mesh animation timing.

Future component:

```txt
frontend/components/zones/social-tower/Elevator.tsx
```

should handle animation timing.

### Required ElevatorStatus Type

Make sure this type includes `doors-closed`:

```ts
export type ElevatorStatus =
  | 'idle'
  | 'doors-opening'
  | 'doors-open'
  | 'doors-closing'
  | 'doors-closed'
  | 'moving'
```

### Correct Elevator Action Usage

Inside future `Elevator.tsx`:

```ts
const {
  startElevatorMove,
  completeFloorMove,
  openElevatorDoors,
} = useSocialStore.getState()

startElevatorMove(targetFloor)

// after animation/transition ends
completeFloorMove()
openElevatorDoors()
```

### Expected Elevator Flow

```txt
startElevatorMove(floor)
→ elevatorStatus = "moving"
→ elevatorMoving = true
→ visual elevator animation runs inside Elevator.tsx
→ completeFloorMove()
→ currentFloor updates
→ elevatorStatus = "doors-opening"
→ openElevatorDoors()
→ elevatorStatus = "doors-open"
```

Do not put `setTimeout`, animation loops, or mesh movement directly inside the store.

The component owns timing.  
The store owns state.

---

## 9. Social Tower Roof + Parachute Contract

Social Tower roof is not a social link floor.

Expected constants:

```txt
SOCIAL_ROOF_FLOOR = SOCIAL_FLOOR_MAX + 1
```

Expected parachute behavior:

```txt
Reach roof
→ parachuteStatus = "ready"
→ jump/deploy trigger
→ parachuteStatus = "deployed"
→ slow descent or fallback teleport
→ land near Central Plaza
→ parachuteStatus = "landed"
```

Future components:

```txt
frontend/components/zones/social-tower/ParachuteJump.tsx
frontend/components/zones/social-tower/SocialTower.tsx
```

---

## 10. Experience Projector Integration Notes

Store file:

```txt
frontend/stores/useExperienceStore.ts
```

This store owns:

- projector active/inactive
- current slide index
- previous slide index
- overload triggered/completed
- auto-advance enabled flag
- auto-advance interval value

It does **not** own:

- lever mesh animation
- projector mesh animation
- glitch VFX
- sound effects
- React timers

Future components should use:

```txt
frontend/components/zones/experience/MassiveLever.tsx
frontend/components/zones/experience/TimelineProjector.tsx
frontend/components/ui/TimelineModal.tsx
```

Auto-advance timer should live in a React component using `useEffect`.

Expected pattern:

```ts
const autoAdvanceEnabled = useExperienceStore(selectAutoAdvanceEnabled)
const autoAdvanceMs = useExperienceStore(selectAutoAdvanceMs)
const nextSlide = useExperienceStore((state) => state.nextSlide)

useEffect(() => {
  if (!autoAdvanceEnabled) return

  const id = window.setInterval(() => {
    nextSlide()
  }, autoAdvanceMs)

  return () => window.clearInterval(id)
}, [autoAdvanceEnabled, autoAdvanceMs, nextSlide])
```

Do not put interval timers inside the Zustand store.

---

## 11. Resume Citadel Cheat Flow

Store file:

```txt
frontend/stores/useGameStore.ts
```

Expected cheat codes:

```txt
SKIPGANGSTERS
ANUJ-RESUME-2026
```

Expected effects:

```txt
SKIPGANGSTERS
→ enemiesDisabled = true
→ citadelCombatBypassed = true

ANUJ-RESUME-2026
→ enemiesDisabled = true
→ resumeVaultUnlocked = true
→ citadelCombatBypassed = true
```

Future Resume Citadel components should use selectors:

```ts
selectEnemiesDisabled
selectResumeVaultUnlocked
selectCitadelCombatBypassed
```

Expected components:

```txt
frontend/components/zones/resume-citadel/ResumeCitadel.tsx
frontend/components/zones/resume-citadel/CheatConsole.tsx
frontend/components/zones/resume-citadel/ResumeRoom.tsx
```

Do not hardcode cheat strings in components. Use the cheat registry from `useGameStore`.

---

## 12. Project Store Integration Notes

Store file:

```txt
frontend/stores/useProjectStore.ts
```

This store owns:

- project list
- selected project id
- category filter
- status filter
- search query
- terminal open/closed state
- loading/error placeholders

It currently reads mock data from:

```txt
frontend/data/projects.ts
```

Future components:

```txt
frontend/components/zones/sre-lab/SRELab.tsx
frontend/components/zones/sre-lab/ProjectBay.tsx
frontend/components/zones/sre-lab/ProjectTerminal.tsx
frontend/components/ui/ProjectOverlay.tsx
```

Future backend replacement:

```txt
GET /api/projects
GET /api/projects/:id
GET /api/github/repo-stats?owner=&repo=
```

Do not remove mock fallback when backend integration starts.

---

## 13. Data Files Are Mock Sources For Now

Current frontend data files:

```txt
frontend/data/experience.ts
frontend/data/projects.ts
frontend/data/social.ts
frontend/data/aiTools.ts
frontend/data/currentJob.ts
```

These are temporary frontend mock sources.

Final flow later:

```txt
frontend mock data
→ Prisma schema
→ PostgreSQL tables
→ Go backend APIs
→ frontend fetches backend
→ optional admin form later
```

Do not build the admin form yet.

Admin/editor UI should come later, after the public portfolio experience works.

---

## 14. Database Direction

Database stack later:

```txt
Prisma = root schema/migrations/seed
PostgreSQL = database
Go backend = pgx + sqlc
```

Rules:

- Prisma stays at root:

```txt
prisma/schema.prisma
```

- Go does not use Prisma Client.
- Go uses `pgx` + `sqlc`.
- Do not create `backend/prisma`.
- Do not create `frontend/prisma`.

---

## 15. Common Anti-Patterns To Avoid

Do not:

- create `frontend/src/`
- visually represent Anuj as a capsule
- hardcode Jio branding inside components
- put animation timers inside Zustand stores
- put mesh animation logic inside stores
- put API fetches directly into random components when a helper/store is planned
- remove mock fallback too early
- hardcode cheat strings in components
- mix Monkey state into `usePlayerStore`
- mix Jio cabin state into `usePlayerStore`
- mix elevator animation timing into `useSocialStore`
- build admin forms before the public portfolio experience works

---

## 16. Next Recommended Store

Next recommended file:

```txt
frontend/stores/useJioCabinStore.ts
```

Purpose:

```txt
Reliance Jio cabin scene state: inside/outside cabin, portal transition, focus mode, coding loop active, snippet loading state, and connection points to usePlayerStore + useCompanionStore.
```

---

## Jio Cabin Store Integration Notes

Store file:

```txt
frontend/stores/useJioCabinStore.ts
```

Purpose:

```txt
Reliance Jio cabin scene state: inside/outside cabin, portal transition, focus mode, coding loop active, snippet loading state, and coordination with player + companion stores.
```

### Responsibilities

`useJioCabinStore` owns:

- whether Anuj is inside the Jio cabin
- whether a portal transition is active
- transition direction:
  - `city-to-cabin`
  - `cabin-to-city`
- transition phase:
  - `idle`
  - `fade-out`
  - `switching-scene`
  - `fade-in`
- Focus Mode state
- coding loop active/inactive state
- Jio code snippet loading/fallback state
- typed character count for monitor typing animation
- cabin spawn point
- city return spawn point

It coordinates with:

```txt
frontend/stores/usePlayerStore.ts
frontend/stores/useCompanionStore.ts
```

It should not directly animate:

- fade overlay
- camera movement
- 3D scene visibility
- monitor typing timer
- Monkey mesh movement
- dashboard visual animation

Components own visuals.  
Store owns state.

---

### Portal Entry Flow

Future component:

```txt
frontend/components/zones/reliance-jio/JioPortal.tsx
```

Expected entry flow:

```ts
useJioCabinStore.getState().beginEnterCabin()

// fade overlay animates in component
// after fade-out completes:
useJioCabinStore.getState().setTransitionPhase('switching-scene')

// after scene switch:
useJioCabinStore.getState().completeEnterCabin()

// fade-in handled by component
```

Expected behavior:

```txt
beginEnterCabin()
→ isTransitioning = true
→ portalDirection = "city-to-cabin"
→ transitionPhase = "fade-out"
→ visual fade runs
→ scene switches
→ completeEnterCabin()
→ isInsideCabin = true
→ Anuj teleports to Jio cabin spawn
→ transition resets
```

Do not put fade timers inside the store.

---

### Portal Exit Flow

Expected exit flow:

```ts
useJioCabinStore.getState().beginExitCabin()

// fade overlay animates in component
// after fade-out completes:
useJioCabinStore.getState().setTransitionPhase('switching-scene')

// after scene switch:
useJioCabinStore.getState().completeExitCabin()
```

Expected behavior:

```txt
beginExitCabin()
→ isTransitioning = true
→ portalDirection = "cabin-to-city"
→ focus/coding mode stops
→ Monkey returns to shoulder
→ visual fade runs
→ scene switches
→ completeExitCabin()
→ isInsideCabin = false
→ Anuj teleports to Jio building exterior spawn
→ transition resets
```

---

### Jio Coding Loop Flow

When Anuj starts coding:

```ts
await useJioCabinStore.getState().startCodingLoop()
```

Expected internal coordination:

```txt
startCodingLoop()
→ enterFocusMode()
→ usePlayerStore.setCoding(true)
→ isFocusMode = true
→ isCodingLoopActive = true
→ useCompanionStore.enterCodingMode()
→ Monkey target location becomes monitor
→ loadSnippet()
→ backend snippet attempted
→ fallback snippet used if backend fails
```

When Anuj exits coding:

```ts
useJioCabinStore.getState().stopCodingLoop()
```

Expected behavior:

```txt
stopCodingLoop()
→ usePlayerStore.exitCoding()
→ useCompanionStore.exitCodingMode()
→ Monkey returns to shoulder
→ focus mode exits
→ coding loop stops
```

---

### Snippet Loading Contract

Future backend endpoint:

```txt
GET /api/snippets/jio-work
```

Future backend file:

```txt
backend/public/snippets/jio_work.go
```

Expected frontend behavior:

```txt
try backend snippet
→ if backend succeeds, use backend code
→ if backend fails, use DEFAULT_JIO_WORK_SNIPPET
→ never break the Jio cabin UI
```

Store fields:

```txt
snippetStatus = "idle" | "loading" | "ready" | "error" | "fallback"
snippetError = string | null
snippet = string
typedCharCount = number
```

Typing animation should be handled in future `CodingLoop.tsx`.

Expected component pattern:

```ts
const incrementTypedCharCount = useJioCabinStore(
  (state) => state.incrementTypedCharCount
)

useEffect(() => {
  const id = window.setInterval(() => {
    incrementTypedCharCount(1)
  }, 24)

  return () => window.clearInterval(id)
}, [incrementTypedCharCount])
```

Do not put typing interval timers inside the store.

---

### Jio Cabin Selectors

Use selectors instead of subscribing to the full store:

```ts
selectIsInsideJioCabin
selectJioCabinTransitioning
selectJioPortalDirection
selectJioTransitionPhase
selectJioFocusMode
selectJioCodingLoopActive
selectJioMonkeyLocation
selectJioSnippetStatus
selectJioSnippet
selectJioTypedSnippet
selectJioTypingProgress
```

This avoids unnecessary rerenders.

---

### Error-Prone Areas

Avoid these mistakes:

- Do not put transition `setTimeout` calls in the store.
- Do not put camera movement in the store.
- Do not duplicate Monkey state in both `useCompanionStore` and `useJioCabinStore`.
- `useJioCabinStore.monkeyLocation` is only high-level cabin intent.
- `useCompanionStore` remains the source for Monkey behavior state.
- Do not block coding loop if snippet fetch fails.
- Do not fetch snippet before backend exists unless fallback is guaranteed.
- Do not hardcode Jio branding in components; use `frontend/app/config/branding.ts`.

---

## UI Store Integration Notes

Store file:

```txt
frontend/stores/useUIStore.ts
```

Purpose:

```txt
Global UI overlay state: timeline modal, resume modal, terminal modal, URL launch modal, music player, city map overlay, toast messages, damage overlay, and interaction prompt state.
```

### Responsibilities

`useUIStore` owns:

- active modal name
- modal stack
- modal payloads
- HUD visibility
- controls overlay visibility
- interaction prompt text
- damage overlay visibility/intensity
- toast messages

It does **not** own gameplay state.

Do not put these in `useUIStore`:

- Anuj HP
- Anuj position
- active cheat codes
- current experience slide
- selected project filtering logic
- Jio coding loop state
- Monkey location
- elevator floor state
- music playback engine state

Use the correct domain stores for those.

---

### Modal Ownership Rules

| UI Feature | UI Store Owns | Domain Store Owns |
|---|---|---|
| Timeline Modal | open/closed + initial payload | current slide, projector state |
| Resume Modal | open/closed + preview/download URLs | vault unlock/combat bypass |
| Project Terminal | open/closed + selected payload | project filtering/selection |
| URL Launch Modal | open/closed + URL payload | social floor/elevator state |
| Music Player | open/closed | playlist/playback state later |
| Cheat Console | open/closed UI | cheat activation/history |
| Jio Coding Overlay | open/closed overlay | coding loop/focus/snippet state |

---

### Common Usage

Open timeline modal:

```ts
useUIStore.getState().openTimelineModal({
  initialSlideIndex: 0,
})
```

Open resume modal:

```ts
useUIStore.getState().openResumeModal({
  title: 'Anuj Resume',
  previewUrl: '/resume/preview',
  downloadUrl: '/resume/download',
})
```

Open external URL confirmation modal:

```ts
useUIStore.getState().openURLLaunchModal({
  label: 'GitHub',
  url: 'https://github.com/anuj-tiwari',
  description: 'Open Anuj’s GitHub profile.',
})
```

Show interaction prompt:

```ts
useUIStore.getState().showInteractionPrompt('Press E to interact')
```

Hide interaction prompt:

```ts
useUIStore.getState().hideInteractionPrompt()
```

Push toast:

```ts
useUIStore.getState().pushToast(
  'Burger consumed. Debug energy restored.',
  {
    variant: 'success',
  }
)
```

Show damage overlay:

```ts
useUIStore.getState().showDamageOverlay('medium')
```

---

### Error-Prone Areas

Avoid these mistakes:

- Do not store gameplay state in `useUIStore`.
- Do not store current player HP in `useUIStore`.
- Do not store selected social floor in `useUIStore`.
- Do not store Monkey location in `useUIStore`.
- Do not store Jio coding loop state in `useUIStore`.
- Do not put timers inside this store for toast auto-dismiss unless there is a clear cleanup strategy.
- UI components should remove expired toasts using `removeToast(id)` after their own timeout.
- Keep modal payloads small and serializable.
- Do not pass JSX/components through modal payloads.
- Do not use `activeModal` as a replacement for route/scene state.

---

## Music Store Integration Notes

Store file:

```txt
frontend/stores/useMusicStore.ts
```

Purpose:

```txt
Music player state for Home Base headphones: playlist, current track, play/pause intent, next/previous, progress, duration, volume, mute state, and backend/static fallback readiness.
```

### Responsibilities

`useMusicStore` owns:

- playlist
- current track id
- playback status
- source mode:
  - `static`
  - `backend`
  - `fallback`
- play/pause intent
- progress seconds
- duration seconds
- volume
- mute state
- loading/error placeholders

It does **not** own:

- actual `HTMLAudioElement`
- audio event listeners
- UI modal open/close state
- backend fetch implementation yet

Future UI modal open/close belongs to:

```txt
frontend/stores/useUIStore.ts
```

Actual playback engine belongs to:

```txt
frontend/components/ui/MusicPlayer.tsx
```

---

### Future MusicPlayer.tsx Contract

Future file:

```txt
frontend/components/ui/MusicPlayer.tsx
```

Expected responsibilities:

- render playlist UI
- render play/pause/next/previous controls
- render volume controls
- own `<audio />` element
- sync audio events into `useMusicStore`
- use `selectCurrentTrackUrl` for audio source

Expected pattern:

```tsx
const audioRef = useRef<HTMLAudioElement | null>(null)

const isPlaying = useMusicStore(selectMusicIsPlaying)
const currentTrackUrl = useMusicStore(selectCurrentTrackUrl)
const setProgress = useMusicStore((state) => state.setProgress)
const setDuration = useMusicStore((state) => state.setDuration)
const markEnded = useMusicStore((state) => state.markEnded)

useEffect(() => {
  const audio = audioRef.current
  if (!audio) return

  if (isPlaying) {
    audio.play().catch(() => {
      useMusicStore.getState().setError('Audio playback failed.')
    })
  } else {
    audio.pause()
  }
}, [isPlaying, currentTrackUrl])
```

Do not create `new Audio()` inside the Zustand store.

---

### Headphones Interaction Flow

Future file:

```txt
frontend/components/zones/home-base/Headphones.tsx
```

Expected interaction:

```ts
useUIStore.getState().openMusicPlayer()
useMusicStore.getState().selectFirstTrack()
```

Optional:

```ts
useMusicStore.getState().play()
```

Expected user flow:

```txt
Anuj approaches headphones
→ Press E to use headphones
→ Music player overlay opens
→ playlist appears
→ user can play/pause
```

---

### Static vs Backend Audio Source

Current frontend-first mode:

```txt
sourceMode = "static"
```

Expected static file path:

```txt
frontend/public/music/<filename>
```

Example:

```txt
frontend/public/music/lofi-debug-loop.mp3
```

Future backend mode:

```txt
sourceMode = "backend"
```

Future backend endpoint:

```txt
GET /api/music/stream/:trackId
```

Expected generated URL:

```txt
/api/music/stream/lofi-debug-loop
```

Do not remove static fallback when backend integration starts.

---

### Error-Prone Areas

Avoid these mistakes:

- Do not create `Audio` objects inside `useMusicStore`.
- Do not put audio event listeners inside the store.
- Do not remove static fallback too early.
- Do not assume backend music endpoint exists in Phase 1.
- Do not hardcode music modal state in Home Base components.
- Do not store playlist UI open/closed state in `useMusicStore`; use `useUIStore`.
- Do not crash if playlist is empty.
- Do not autoplay without user interaction.

---

## Keyboard Hook Integration Notes

Hook file:

```txt
frontend/hooks/useKeyboard.ts
```

Purpose:

```txt
Central keyboard input hook for movement keys, jump, sprint, interact, map toggle, cheat console toggle, Escape/focus exit, and future mode-aware input guards.
```

### Responsibilities

`useKeyboard` owns:

- reading keyboard state
- tracking currently pressed keys
- movement input booleans
- normalized movement vector
- one-shot key callbacks for actions
- ignoring input when typing in editable fields
- clearing key state on window blur

It does **not** own:

- player movement physics
- player position
- camera movement
- interactable detection
- map state
- cheat state
- Jio focus mode state

Those belong to domain stores/components.

---

### Control Mapping Source

The hook reads key mappings from:

```txt
frontend/lib/constants.ts
```

Expected constants:

```ts
export const CONTROLS = {
  moveForward: ['KeyW', 'ArrowUp'],
  moveBackward: ['KeyS', 'ArrowDown'],
  moveLeft: ['KeyA', 'ArrowLeft'],
  moveRight: ['KeyD', 'ArrowRight'],
  jump: ['Space'],
  sprint: ['ShiftLeft', 'ShiftRight'],
  interact: ['KeyE'],
  openMap: ['KeyM'],
  cheatConsole: ['Backquote'],
  exitFocusMode: ['Escape'],
} as const
```

Do not hardcode movement keys inside player components.

---

### Future PlayerController Usage

Future file:

```txt
frontend/components/player/PlayerController.tsx
```

Expected usage:

```ts
const { movementVector, movement } = useKeyboard({
  onInteract: () => {
    // trigger nearest interactable
  },
  onOpenMap: () => {
    useGameStore.getState().toggleMap()
  },
  onToggleCheatConsole: () => {
    useGameStore.getState().toggleCheatConsole()
  },
  onExitFocusMode: () => {
    useJioCabinStore.getState().exitFocusMode()
  },
})
```

Movement vector convention:

```txt
x = -1 left
x = +1 right
z = -1 forward
z = +1 backward
```

Use `movement.sprint` to switch between walk and sprint speed.

Use `movement.jump` or `onJump` to trigger jump behavior.

---

### One-Shot Action Behavior

The hook avoids repeated callbacks for held keys.

Expected behavior:

```txt
Tap E → interact once
Hold E → do not spam interact
Tap M → toggle map once
Hold M → do not spam map toggle
Tap Backquote → toggle cheat console once
Hold Backquote → do not spam console toggle
Tap Escape → exit focus mode once
```

This prevents interaction spam.

---

### Editable Input Guard

The hook ignores game controls while typing inside:

```txt
input
textarea
select
contenteditable
```

This matters for future UI:

- cheat console input
- project search
- terminal commands
- admin forms later
- URL/search fields

Do not remove this guard unless a specific component needs raw key capture.

---

### Window Blur Safety

The hook clears all pressed keys when the browser window loses focus.

This prevents stuck movement keys.

Expected behavior:

```txt
Hold W
Alt-tab away
Release W outside browser
Return to browser
→ Anuj should not keep walking forward
```

---

### Error-Prone Areas

Avoid these mistakes:

- Do not create separate keyboard listeners in every component.
- Do not hardcode WASD directly inside `PlayerController.tsx`.
- Do not fire `onInteract` repeatedly while E is held.
- Do not process movement keys while typing in input fields.
- Do not store player position inside this hook.
- Do not store map open/closed state inside this hook.
- Do not store Jio focus mode inside this hook.
- Keep this hook as input-only.

---

## API Helper Integration Notes

File:

```txt
frontend/lib/api.ts
```

Purpose:

```txt
Typed API helper layer with frontend-first mock fallback support, future backend base URL handling, and placeholder fetch helpers for projects, experience, social links, current job, AI tools, music tracks, resume, GitHub stats, and Jio snippet.
```

### Responsibilities

`frontend/lib/api.ts` owns:

- building backend URLs
- reading `NEXT_PUBLIC_API_BASE_URL`
- typed `GET` helpers
- JSON fetch helpers
- text fetch helpers
- timeout handling
- mock fallback behavior
- future backend endpoint contracts

It does **not** own:

- UI state
- project selected state
- music playback state
- player state
- modal state
- Jio cabin scene state

Stores/components should call this file when backend integration starts.

---

### API Base URL

Environment variable:

```txt
NEXT_PUBLIC_API_BASE_URL
```

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

If no base URL is set, API helpers use relative paths like:

```txt
/api/projects
```

This is useful if the backend is proxied later.

---

### Fallback Rule

Every public helper should gracefully fallback to mock data.

Expected behavior:

```txt
try backend
→ backend succeeds: return backend data
→ backend fails: return frontend mock fallback
→ UI keeps working
```

Do not remove fallback too early.

---

### Expected Result Shape

All fetch helpers return:

```ts
{
  data: T
  source: 'backend' | 'fallback'
  error: string | null
}
```

Example:

```ts
const result = await getProjects()

if (result.source === 'fallback') {
  console.warn(result.error)
}

const projects = result.data
```

---

### Main Helpers

Experience:

```ts
getExperience()
```

Projects:

```ts
getProjects()
getProjectById(id)
getGitHubRepoStats({ owner, repo })
```

Social:

```ts
getSocialLinks()
```

Current job:

```ts
getCurrentJobEntry()
```

AI tools:

```ts
getAITools()
```

Music:

```ts
getMusicTracks()
getMusicStreamUrl(trackId)
```

Resume:

```ts
getResumePreview()
getResumeDownloadUrl()
```

Jio coding snippet:

```ts
getJioWorkSnippet()
```

---

### Resume Contract

Future backend endpoints:

```txt
GET /api/resume/preview
GET /api/resume/download
```

Expected frontend behavior:

```ts
const preview = await getResumePreview()
const downloadUrl = getResumeDownloadUrl()
```

Fallback:

```txt
/resume/anuj-resume.pdf
```

Make sure the file exists later at:

```txt
frontend/public/resume/anuj-resume.pdf
```

or backend serves it in Phase 7+.

---

### Music Contract

Current static fallback path:

```txt
frontend/public/music/<filename>
```

Future backend endpoints:

```txt
GET /api/music/tracks
GET /api/music/stream/:trackId
```

Expected frontend behavior:

```ts
const tracks = await getMusicTracks()
const streamUrl = getMusicStreamUrl(trackId)
```

Do not autoplay music without user interaction.

---

### Jio Snippet Contract

Future backend endpoint:

```txt
GET /api/snippets/jio-work
```

Backend file:

```txt
backend/public/snippets/jio_work.go
```

Expected frontend behavior:

```ts
const result = await getJioWorkSnippet()
useJioCabinStore.getState().setSnippet(result.data)
```

If backend fails:

```txt
JIO_WORK_SNIPPET_FALLBACK is used
coding loop still works
UI does not break
```

---

### Jio Snippet Single Source of Truth Fix

The Jio dummy Go snippet must not be duplicated across multiple files.

Single source of truth:

```txt
frontend/data/snippets.ts
```

Export:

```ts
export const JIO_WORK_SNIPPET_FALLBACK = `...`
```

Use it in:

```txt
frontend/stores/useJioCabinStore.ts
frontend/lib/api.ts
```

Expected imports:

```ts
import { JIO_WORK_SNIPPET_FALLBACK } from '@/data/snippets'
```

In `useJioCabinStore.ts`, preserve backward compatibility with:

```ts
export const DEFAULT_JIO_WORK_SNIPPET = JIO_WORK_SNIPPET_FALLBACK
```

Do **not** keep the long Go snippet string inside both files.

---

### API Config Type Fix

Avoid this:

```ts
export const API_CONFIG = {
  timeoutMs: 8000,
} as const
```

because TypeScript narrows `timeoutMs` to literal type:

```ts
8000
```

Use this instead:

```ts
export interface ApiConfig {
  baseUrl: string
  timeoutMs: number
  fallbackEnabled: boolean
}

export const API_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  timeoutMs: 8000,
  fallbackEnabled: true,
}
```

This prevents errors like:

```txt
Argument of type 'number' is not assignable to parameter of type '8000'.
```

---

### API Helper Rule

`frontend/lib/api.ts` should import fallback data from neutral data files.

Good:

```ts
import { JIO_WORK_SNIPPET_FALLBACK } from '@/data/snippets'
```

Avoid importing stores inside `api.ts`.

Bad:

```ts
import { DEFAULT_JIO_WORK_SNIPPET } from '@/stores/useJioCabinStore'
```

Reason:

```txt
api.ts should stay dependency-light.
Stores can call API helpers.
API helpers should not depend on stores.
```

---

### Browser / Runtime Warning

If `fetchWithTimeout` uses browser-only APIs like:

```ts
window.setTimeout
window.clearTimeout
```

then `frontend/lib/api.ts` is client-side only.

Prefer runtime-safe timers:

```ts
const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
clearTimeout(timeoutId)
```

This makes the helper safer across browser-like and Node-like environments.

Still, do not call these helpers from server components until the usage is reviewed.

---

### Error-Prone Areas

Avoid these mistakes:

- Do not remove mock fallback before backend is stable.
- Do not call API helpers from server components unless timer/runtime behavior is safe.
- Do not hardcode backend URLs inside components.
- Do not duplicate fetch logic inside individual components.
- Do not duplicate the Jio dummy snippet across files.
- Do not make Jio snippet loading block the UI.
- Do not make resume download depend only on frontend static files once backend exists.
- Do not import stores inside `api.ts`; keep it dependency-light.
- Do not make `api.ts` responsible for UI toasts/errors. Components/stores decide how to display errors.

File:

```txt
frontend/lib/api.ts
```

Purpose:

```txt
Typed API helper layer with frontend-first mock fallback support, future backend base URL handling, and placeholder fetch helpers for projects, experience, social links, current job, AI tools, music tracks, resume, GitHub stats, and Jio snippet.
```

### Responsibilities

`frontend/lib/api.ts` owns:

- building backend URLs
- reading `NEXT_PUBLIC_API_BASE_URL`
- typed `GET` helpers
- JSON fetch helpers
- text fetch helpers
- timeout handling
- mock fallback behavior
- future backend endpoint contracts

It does **not** own:

- UI state
- project selected state
- music playback state
- player state
- modal state
- Jio cabin scene state

Stores/components should call this file when backend integration starts.

---

### API Base URL

Environment variable:

```txt
NEXT_PUBLIC_API_BASE_URL
```

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

If no base URL is set, API helpers use relative paths like:

```txt
/api/projects
```

This is useful if the backend is proxied later.

---

### Fallback Rule

Every public helper should gracefully fallback to mock data.

Expected behavior:

```txt
try backend
→ backend succeeds: return backend data
→ backend fails: return frontend mock fallback
→ UI keeps working
```

Do not remove fallback too early.

---

### Main Helpers

Experience:

```ts
getExperience()
```

Projects:

```ts
getProjects()
getProjectById(id)
getGitHubRepoStats({ owner, repo })
```

Social:

```ts
getSocialLinks()
```

Current job:

```ts
getCurrentJobEntry()
```

AI tools:

```ts
getAITools()
```

Music:

```ts
getMusicTracks()
getMusicStreamUrl(trackId)
```

Resume:

```ts
getResumePreview()
getResumeDownloadUrl()
```

Jio coding snippet:

```ts
getJioWorkSnippet()
```

---

### Expected Result Shape

All fetch helpers return:

```ts
{
  data: T
  source: 'backend' | 'fallback'
  error: string | null
}
```

Example:

```ts
const result = await getProjects()

if (result.source === 'fallback') {
  console.warn(result.error)
}

const projects = result.data
```

---

### Jio Snippet Contract

Future backend endpoint:

```txt
GET /api/snippets/jio-work
```

Backend file:

```txt
backend/public/snippets/jio_work.go
```

Expected frontend behavior:

```ts
const result = await getJioWorkSnippet()
useJioCabinStore.getState().setSnippet(result.data)
```

If backend fails:

```txt
JIO_WORK_SNIPPET_FALLBACK is used
coding loop still works
UI does not break
```

---

### Resume Contract

Future backend endpoints:

```txt
GET /api/resume/preview
GET /api/resume/download
```

Expected frontend behavior:

```ts
const preview = await getResumePreview()
const downloadUrl = getResumeDownloadUrl()
```

Fallback:

```txt
/resume/anuj-resume.pdf
```

Make sure the file exists later at:

```txt
frontend/public/resume/anuj-resume.pdf
```

or backend serves it in Phase 7+.

---

### Music Contract

Current static fallback path:

```txt
frontend/public/music/<filename>
```

Future backend endpoint:

```txt
GET /api/music/tracks
GET /api/music/stream/:trackId
```

Expected frontend behavior:

```ts
const tracks = await getMusicTracks()
const streamUrl = getMusicStreamUrl(trackId)
```

Do not autoplay music without user interaction.

---

### Browser-Only Warning

Current `fetchWithTimeout` uses:

```ts
window.setTimeout
window.clearTimeout
```

This means `frontend/lib/api.ts` is currently intended for client-side usage.

Do not call these helpers from server components unless `fetchWithTimeout` is refactored to use runtime-safe timers.

---

### Error-Prone Areas

Avoid these mistakes:

- Do not remove mock fallback before backend is stable.
- Do not call API helpers from server components yet.
- Do not hardcode backend URLs inside components.
- Do not duplicate fetch logic inside individual components.
- Do not make Jio snippet loading block the UI.
- Do not make resume download depend only on frontend static files once backend exists.
- Do not import stores inside `api.ts`; keep it dependency-light.
- Do not make `api.ts` responsible for UI toasts/errors. Components/stores decide how to display errors.
Read root readme.md, WORKFLOW.md, DETAILS.md, and the current codebase.

Now implement Phase 4 only: Non-Combat Zone Interactions.

Hard constraints:

- Frontend code stays inside frontend/.
- Use frontend/src/.
- Do not create root src/.
- Do not implement backend yet.
- Do not touch Prisma yet.
- Do not implement Resume Citadel combat yet.
- Do not implement GitHub API yet.

Goal:

Make the non-combat zones interactive and useful.

Implement:

1. Experience Zone lever and projector timeline
2. System Overload sequence after 2026
3. Social Tower elevator and themed floor interactions
4. Social Tower roof parachute placeholder
5. Burger eating interaction
6. Home Base headphones and music player UI
7. Reliance Jio office interaction panels
8. AI Code Building floor panels
9. URL launch modal
10. Terminal/modal UI improvements

Experience Zone:

- Player interacts with massive lever
- lever animation placeholder
- projector activates
- timeline modal or in-world screen displays 2019 to 2026 slides
- next/previous slide controls
- after 2026 slide, trigger System Overload:
  - glitch state
  - flickering lights
  - sparks placeholder
  - projector crash/explosion placeholder
- use mock experience data

Social Tower:

- working elevator state
- floor selection UI
- smooth elevator movement or simulated transition
- doors open/close placeholder
- floor labels
- reception interaction on every floor
- open URL modal for:
  - LinkedIn
  - GitHub
  - Instagram
  - LeetCode
  - Portfolio Source Code
- each floor should preserve its theme

Parachute:

- roof jump trigger placeholder
- parachute state
- slow descent placeholder or teleport-to-safe-zone fallback
- landing near Central Plaza

Burger Shop:

- interact with burger
- play eating animation placeholder
- restore health using health store
- show UI message:
  "Burger consumed. Debug energy restored."

Home Base:

- interact with headphones
- open music player UI
- play/pause static mock audio placeholder
- show track list from mock data

Reliance Jio Building:
- implement portal fade transition from city to JioCabin
- implement exit portal back to city spawn point
- implement Sit interaction on ergonomic chair
- implement laptop interaction
- implement Focus Mode camera
- render holographic plaque from branding config
- render editable status panels from branding config
- render tech stack wall from branding config
- render achievement shelf from branding config
- render Grafana-inspired SRE dashboards from branding config
- implement coding loop with dummy code typing animation
- make Monkey move from Anuj’s shoulder to the ultra-wide monitor while coding
- return Monkey to Anuj’s shoulder when exiting Focus Mode
- use frontend mock code snippet first

AI Code Building:

- interact with panels on each floor
- show how Anuj uses ChatGPT, Gemini, and Claude
- data comes from frontend/src/data/aiTools.mock.ts

Add/update UI components:

frontend/src/components/ui/
  TimelineModal.tsx
  URLLaunchModal.tsx
  MusicPlayer.tsx
  TerminalModal.tsx
  ToastMessage.tsx

Add/update stores if needed:

frontend/src/stores/
  uiStore.ts
  elevatorStore.ts
  healthStore.ts
  gameStore.ts

Rules:

- Keep all modals outside Canvas.
- Use Zustand for shared UI state.
- Use mock data only.
- External URL opening should be behind a confirmation modal.
- Do not hardcode data deep in components.
- Make interactions functional, even if visuals are placeholders.
- Make sure the app compiles.

After implementation:

- list all created/modified files
- explain how each interaction works
- explain what remains mocked
- update root WORKFLOW.md with Phase 4 completion notes

Stop after Phase 4.
Do not continue to Phase 5.
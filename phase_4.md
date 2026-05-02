
---

# Part 3 — City Zones and Building Interiors

```md
Read root readme.md, WORKFLOW.md, DETAILS.md, and the current codebase.

Now implement Phase 3 only: City Zones and Building/Interior Scaffolds.

Hard constraints:

- Frontend code stays inside frontend/.
- Use frontend/src/.
- Do not create root src/.
- Do not touch backend yet.
- Do not touch Prisma yet.
- Prisma must remain at root/prisma/schema.prisma.

Goal:

Expand the placeholder city into clearly separated interactive zones and building interiors.

Implement basic interiors and interactable placeholders for:

1. Central Plaza
2. Experience Zone
3. Resume Citadel
4. Social Tower
5. SRE Lab
6. Home Base
7. Burger Shop
8. Reliance Jio Building
9. AI Code Building

Central Plaza:

- large Indian flag in the middle
- signs pointing to major zones
- benches/lights/roads placeholder
- map board interactable

Experience Zone:

- massive lever placeholder
- projector placeholder
- timeline screen placeholder
- timeline data loaded from mock file

Resume Citadel:

- fortress-style building shell
- resume room placeholder
- checkpoint markers
- cheat console placeholder
- enemy spawn markers, but no real combat yet

Social Tower:

- 5 floors represented clearly
- elevator shaft placeholder
- roof area placeholder
- each floor has unique theme placeholder:
  - LinkedIn
  - GitHub
  - Instagram
  - LeetCode
  - Portfolio Source Code
- each floor has reception desk placeholder
- each floor has sit/interact placeholder

SRE Lab:

- Iron Man-style lab layout placeholder
- holographic project bays
- central project terminal placeholder

Home Base:

- house shell
- gaming room
- desk
- chair sit placeholder
- headphones interactable placeholder

Burger Shop:

- shop shell
- counter
- burger item interactable
- eating interaction placeholder

Reliance Jio Building:
- create Jio-inspired exterior using brand blue #005EB8
- add semi-transparent glass facade
- add placeholder extruded Jio logo mesh
- add revolving door entrance interaction placeholder
- create interior scaffold named JioCabin
- add Anuj’s SRE Command Center interior placeholder
- add ultra-wide monitor, MacBook vertical stand, RGB keyboard, vertical mouse, ergonomic chair
- add glass wall overlooking city
- add placeholder holographic plaque
- add placeholder Grafana-inspired dashboard wall
- add placeholder tech stack wall
- add placeholder achievement shelf
- source all personal branding content from frontend/src/app/config/branding.ts

AI Code Building:

- 3 floors:
  - Ground Floor: ChatGPT
  - First Floor: Gemini
  - Second Floor: Claude
- each floor has themed panels
- each floor explains how Anuj uses that AI tool using mock data

Add/update files:

frontend/src/components/world/
  CentralPlaza.tsx
  City.tsx
  RoadNetwork.tsx
  CitySign.tsx

frontend/src/components/zones/experience/
  ExperienceZone.tsx
  MassiveLever.tsx
  TimelineProjector.tsx

frontend/src/components/zones/resume-citadel/
  ResumeCitadel.tsx
  ResumeRoom.tsx
  CheatConsole.tsx

frontend/src/components/zones/social-tower/
  SocialTower.tsx
  SocialFloor.tsx
  Elevator.tsx

frontend/src/components/zones/sre-lab/
  SRELab.tsx
  ProjectBay.tsx
  ProjectTerminal.tsx

frontend/src/components/zones/home-base/
  HomeBase.tsx
  GamingRoom.tsx
  Headphones.tsx

frontend/src/components/zones/burger-shop/
  BurgerShop.tsx
  BurgerItem.tsx

frontend/src/components/zones/reliance-jio/
  RelianceJioBuilding.tsx
  OfficeRoom.tsx
  DevSetup.tsx

frontend/src/components/zones/ai-code-building/
  AICodeBuilding.tsx
  AIToolFloor.tsx

Rules:

- Use placeholder geometry only.
- Make each zone visually identifiable.
- Register obvious interactables with the interaction system.
- Use mock data from frontend/src/data.
- Keep components modular.
- Do not cram multiple buildings into one massive file.
- Make sure the app compiles.

After implementation:

- list all created/modified files
- explain how the city is organized
- explain which interactions are placeholders
- update root WORKFLOW.md with Phase 3 completion notes

Stop after Phase 3.
Do not continue to Phase 4.
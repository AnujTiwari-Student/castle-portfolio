Read root readme.md, WORKFLOW.md, DETAILS.md, and the current project structure first.

Now implement Phase 1 only: Frontend Foundation.

Hard constraints:

- Frontend code must live inside frontend/.
- Use frontend/src/ for app code.
- Do not create a root src/ folder.
- Do not touch backend yet.
- Do not touch Prisma yet.
- Prisma must remain at root/prisma/schema.prisma.
- Do not create backend/prisma.
- Do not create frontend/prisma.

Goal:

Create the frontend foundation for the 3D Portfolio City.

Use:

- Next.js 15+
- TypeScript
- React Three Fiber
- Three.js
- @react-three/drei
- @react-three/rapier
- Zustand
- Tailwind CSS

Implement:

1. Next.js app shell
2. React Three Fiber canvas
3. Scene root
4. Lighting
5. Environment placeholder
6. Basic city ground
7. Placeholder buildings for all required zones
8. Basic HUD shell
9. Basic mock data files
10. Clean folder structure

Required zones as placeholder geometry:

- Central Plaza with Indian flag landmark
- Experience Zone
- Resume Citadel
- Social Tower
- SRE Lab
- Home Base
- Burger Shop
- Reliance Jio Building
- AI Code Building

Use simple boxes, planes, cylinders, text labels, and placeholder materials.
Do not wait for final 3D models.

Use this frontend structure:

frontend/
    app/
      page.tsx
      layout.tsx
      globals.css

    components/
      canvas/
        PortfolioCanvas.tsx
        SceneRoot.tsx
        Lighting.tsx
        Environment.tsx

      world/
        City.tsx
        CentralPlaza.tsx
        ZoneMarker.tsx

      zones/
        experience/
          ExperienceZone.tsx

        resume-citadel/
          ResumeCitadel.tsx

        social-tower/
          SocialTower.tsx

        sre-lab/
          SRELab.tsx

        home-base/
          HomeBase.tsx

        burger-shop/
          BurgerShop.tsx

        reliance-jio/
          RelianceJioBuilding.tsx

        ai-code-building/
          AICodeBuilding.tsx

      ui/
        HUD.tsx

    data/
      cityMap.mock.ts
      experience.mock.ts
      projects.mock.ts
      socialLinks.mock.ts
      aiTools.mock.ts
      currentJob.mock.ts

    lib/
      constants.ts

    types/
      index.ts

Rules:

- Use TypeScript.
- Do not create one giant file.
- Keep components small.
- Avoid fake imports.
- If a package is required, include the install command from inside frontend/.
- Use mock data only.
- Make the app compile.
- Use simple placeholder geometry.
- Add labels for buildings so the city is understandable.
- Keep Canvas logic separate from UI logic.
- Keep UI outside Canvas where possible.

After implementation:

- list all created/modified files
- explain how to run frontend from frontend/
- mention what was intentionally left for Phase 2
- update root WORKFLOW.md with Phase 1 completion notes

Stop after Phase 1.
Do not continue to Phase 2.
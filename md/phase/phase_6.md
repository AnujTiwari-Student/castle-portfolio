Read root readme.md, WORKFLOW.md, DETAILS.md, and the current codebase.

Now implement Phase 5 only: Resume Citadel Gameplay.

Hard constraints:

- Frontend code stays inside frontend/.
- Use frontend/src/.
- Do not create root src/.
- Do not implement Go backend yet.
- Do not touch Prisma yet.
- Do not implement final enemy models.
- Do not overbuild advanced AI.

Goal:

Make the Resume Citadel playable with basic combat, health, checkpoints, cheat-code bypass, resume room, and resume preview.

Implement:

1. Recruitment Gangster enemy placeholders
2. Enemy patrol logic
3. Enemy detection radius
4. Pistol projectile placeholder
5. Player health/damage system
6. Death/fail state
7. Respawn at latest checkpoint
8. Citadel checkpoints
9. Cheat-code console
10. Resume room unlock
11. Resume preview modal
12. Mock resume download button

Recruitment Gangsters:

- placeholder enemy geometry
- patrol between points
- detect player within radius
- shoot simple projectile toward player
- projectile damages player
- enemies can be avoided
- defeating enemies can be placeholder or optional

Health system:

- player starts with health
- damage reduces health
- when health reaches zero:
  - show fail message
  - respawn at latest checkpoint
  - restore health
  - optionally reset enemies

Checkpoint system:

- visible checkpoints inside Resume Citadel
- activate on interaction or proximity
- latest checkpoint stored in Zustand
- respawn uses latest checkpoint

Cheat console:

- interact opens cheat code modal
- use config value:
  ANUJ-RESUME-2026
- correct code should:
  - unlock resume room
  - disable or bypass enemies
  - move/teleport Anuj near resume room if movement system supports it
- wrong code shows error message
- cheat code should be stored in constants/config, not buried in UI logic

Resume room:

- locked by default unless player reaches it or uses cheat code
- resume interaction opens preview modal
- preview uses mock resume asset/path first
- download button uses mock frontend URL first
- label backend endpoint for later:
  GET /api/resume/download

Add/update files:

frontend/src/components/zones/resume-citadel/
  ResumeCitadel.tsx
  RecruitmentGangster.tsx
  CitadelCombatManager.tsx
  ResumeRoom.tsx
  CheatConsole.tsx

frontend/src/components/systems/combat/
  EnemyProjectile.tsx
  projectileTypes.ts
  combatStore.ts

frontend/src/components/systems/health/
  healthStore.ts

frontend/src/components/ui/
  CheatCodeModal.tsx
  ResumePreviewModal.tsx
  DamageOverlay.tsx

frontend/src/lib/
  constants.ts

Rules:

- Keep combat simple.
- Do not overengineer enemy AI.
- Use placeholders.
- Keep gameplay functional.
- Do not block the resume behind impossible combat.
- Cheat-code bypass must work.
- Checkpoints must work.
- Make sure the app compiles.

After implementation:

- list all created/modified files
- explain how to test Resume Citadel
- explain cheat-code behavior
- explain checkpoint/respawn behavior
- update root WORKFLOW.md with Phase 5 completion notes

Stop after Phase 5.
Do not continue to Phase 6.
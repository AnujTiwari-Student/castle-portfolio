// frontend/lib/constants.ts

import type { ZoneConfig, ZoneId } from '@/types'

// ─── World ────────────────────────────────────────────────────────────────────

export const WORLD = {
  groundSize: 200,
  groundColor: '#1a1a2e',
  gridColor: '#16213e',
  ambientIntensity: 0.4,
  fogNear: 60,
  fogFar: 150,
  fogColor: '#0f0f1a',
} as const

// ─── Anuj Character ───────────────────────────────────────────────────────────
//
// Important:
// Anuj is NOT intended to be a capsule placeholder.
// He is the main male character from the beginning of the project.
//
// The physics body may still need an invisible simplified collider later,
// but the visual identity must always be Anuj as a male 3D character.

export const ANUJ_CHARACTER = {
  id: 'anuj',
  displayName: 'Anuj',
  characterType: 'male-human',
  role: 'protagonist',

  spawnPosition: [0, 0.05, 0] as [number, number, number],
  spawnRotation: [0, 0, 0] as [number, number, number],

  // Visual character model config.
  // Use a temporary humanoid/male model first if the final GLB is not ready.
  model: {
    enabled: true,
    path: '/models/characters/anuj.glb',
    fallbackPath: '/models/characters/anuj-placeholder.glb',
    fallbackMode: 'humanoid-placeholder',
    scale: 1,
    height: 1.8,
    eyeHeight: 1.62,
    shoulderHeight: 1.45,
  },

  // Animation names expected from the character rig.
  // The Player component should gracefully fallback if an animation is missing.
  animations: {
    idle: 'Idle',
    walk: 'Walk',
    run: 'Run',
    jump: 'Jump',
    sit: 'Sit',
    interact: 'Interact',
    coding: 'Typing',
    falling: 'Falling',
    parachute: 'Parachute',
  },

  movement: {
    walkSpeed: 6,
    sprintSpeed: 11,
    jumpForce: 6,
    rotationLerpFactor: 0.16,
  },

  stats: {
    maxHp: 100,
    respawnHp: 50,
  },

  interaction: {
    radius: 3,
  },
} as const

// ─── Player Physics ───────────────────────────────────────────────────────────
//
// This config is for invisible physics/control behavior only.
// Do not use this to visually represent Anuj.
//
// If using @react-three/rapier, the actual implementation may use a simplified
// character controller collider internally, but the rendered mesh must still be
// the male Anuj character.

export const PLAYER_PHYSICS = {
  controllerType: 'humanoid-character-controller',
  bodyHeight: 1.8,
  bodyRadius: 0.35,
  footOffset: 0.05,
  mass: 70,
  lockRotations: true,
  canSleep: false,
} as const

// Backward-compatible player object.
// Keep this only for shared gameplay values.
// Do not add visual capsule config here.

export const PLAYER = {
  spawnPosition: ANUJ_CHARACTER.spawnPosition,
  walkSpeed: ANUJ_CHARACTER.movement.walkSpeed,
  sprintSpeed: ANUJ_CHARACTER.movement.sprintSpeed,
  jumpForce: ANUJ_CHARACTER.movement.jumpForce,
  maxHp: ANUJ_CHARACTER.stats.maxHp,
  respawnHp: ANUJ_CHARACTER.stats.respawnHp,
  interactionRadius: ANUJ_CHARACTER.interaction.radius,
} as const

// ─── Camera ───────────────────────────────────────────────────────────────────

export const CAMERA = {
  offset: [0, 6, 12] as [number, number, number],
  lookAtOffset: [0, 1.35, 0] as [number, number, number],
  lerpFactor: 0.1,
  fov: 60,
  near: 0.1,
  far: 300,
} as const

export const FOCUS_CAMERA = {
  codingOffset: [1.8, 1.55, 2.4] as [number, number, number],
  codingLookAtOffset: [0, 1.35, -0.8] as [number, number, number],
  lerpFactor: 0.08,
  fov: 50,
} as const

// ─── Monkey Companion ─────────────────────────────────────────────────────────
//
// Monkey is Anuj's Go/Gopher-style pet companion.
// Default behavior: sits on Anuj's shoulder while roaming.
// Special Jio behavior: moves to the ultra-wide monitor while Anuj is coding.

export const MONKEY_COMPANION = {
  id: 'monkey',
  displayName: 'Monkey',
  companionType: 'gopher-pet',
  owner: 'anuj',

  model: {
    enabled: true,
    path: '/models/companions/monkey-gopher.glb',
    fallbackPath: '/models/companions/monkey-gopher-placeholder.glb',
    fallbackMode: 'gopher-placeholder',
    scale: 0.32,
  },

  shoulder: {
    offset: [0.42, 1.42, -0.08] as [number, number, number],
    rotation: [0, -0.35, 0] as [number, number, number],
  },

  monitorPerch: {
    offset: [0, 2.15, -0.35] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
  },

  idle: {
    bobAmplitude: 0.04,
    bobSpeed: 6,
    blinkIntervalMs: 3500,
    headTiltAmount: 0.12,
  },

  animations: {
    idle: 'Idle',
    shoulderIdle: 'ShoulderIdle',
    jumpToMonitor: 'JumpToMonitor',
    monitorIdle: 'MonitorIdle',
    returnToShoulder: 'ReturnToShoulder',
    react: 'React',
  },
} as const

// Backward-compatible alias.
// Prefer MONKEY_COMPANION in new code.

export const MONKEY = MONKEY_COMPANION

// ─── Reliance Jio Building / Jio Cabin ────────────────────────────────────────

export const JIO_BUILDING = {
  brandBlue: '#005EB8',
  glassColor: '#8fd3ff',
  glassOpacity: 0.28,
  emissiveBlue: '#0077ff',

  citySpawnPoint: [55, 0.05, -10] as [number, number, number],
  cabinSpawnPoint: [0, 0.05, 4] as [number, number, number],

  exterior: {
    logoText: 'Jio',
    logoHeight: 7,
    logoDepth: 0.35,
    buildingHeight: 22,
    revolvingDoorPrompt: 'Press E to enter Reliance Jio Building',
  },

  cabin: {
    sceneId: 'jio-cabin',
    exitPrompt: 'Press E to exit Reliance Jio Building',
    sitPrompt: 'Press E to sit',
    codingPrompt: 'Press E to start coding loop',
    exitFocusPrompt: 'Press Esc to exit focus mode',
  },

  snippet: {
    backendEndpoint: '/api/snippets/jio-work',
    backendFilePath: 'backend/public/snippets/jio_work.go',
  },
} as const

// ─── Zone Layout ──────────────────────────────────────────────────────────────
//
// City grid — top-down view:
//
//   [0, 0]    Central Plaza
//   [35, 10]  Experience Zone
//   [-35,35]  Resume Citadel
//   [35, 50]  Social Tower
//   [0, 70]   SRE Lab
//   [-50,0]   Home Base
//   [-50,-25] Burger Shop
//   [55, 0]   Reliance Jio
//   [55, 45]  AI Code Building
//

export const ZONE_CONFIGS: Record<ZoneId, ZoneConfig> = {
  'central-plaza': {
    id: 'central-plaza',
    label: 'Central Plaza',
    position: [0, 0, 0],
    size: [20, 0.2, 20],
    color: '#2d5a27',
    description: 'Spawn point. Indian flag. City hub.',
  },
  'experience-zone': {
    id: 'experience-zone',
    label: 'Experience Zone',
    position: [35, 0, 10],
    size: [18, 14, 16],
    color: '#1e3a5f',
    description: 'Career timeline projector. 2019–2026.',
  },
  'resume-citadel': {
    id: 'resume-citadel',
    label: 'Resume Citadel',
    position: [-35, 0, 35],
    size: [22, 18, 20],
    color: '#4a1942',
    description: 'Guarded by Recruitment Gangsters.',
  },
  'social-tower': {
    id: 'social-tower',
    label: 'Social Tower',
    position: [35, 0, 50],
    size: [12, 40, 12],
    color: '#0a3d62',
    description: '5-floor social platform tower.',
  },
  'sre-lab': {
    id: 'sre-lab',
    label: 'SRE Lab',
    position: [0, 0, 70],
    size: [30, 10, 20],
    color: '#1a472a',
    description: 'Holographic project bays.',
  },
  'home-base': {
    id: 'home-base',
    label: 'Home Base',
    position: [-50, 0, 0],
    size: [18, 10, 16],
    color: '#2c1810',
    description: 'Desk, music, gaming room.',
  },
  'burger-shop': {
    id: 'burger-shop',
    label: 'Burger Shop',
    position: [-50, 0, -25],
    size: [10, 6, 10],
    color: '#7d3c00',
    description: 'Eat a burger. Restore HP.',
  },
  'reliance-jio': {
    id: 'reliance-jio',
    label: 'Reliance Jio',
    position: [55, 0, 0],
    size: [16, 22, 16],
    color: JIO_BUILDING.brandBlue,
    description: 'Current job. SRE command center.',
  },
  'ai-code-building': {
    id: 'ai-code-building',
    label: 'AI Code Building',
    position: [55, 0, 45],
    size: [14, 18, 14],
    color: '#1a1a1a',
    description: 'ChatGPT / Gemini / Claude floors.',
  },
}

export const ZONES = Object.values(ZONE_CONFIGS)

// ─── Zone Colors / Emissive Accents ───────────────────────────────────────────

export const ZONE_ACCENT_COLORS: Record<ZoneId, string> = {
  'central-plaza': '#4caf50',
  'experience-zone': '#2196f3',
  'resume-citadel': '#9c27b0',
  'social-tower': '#03a9f4',
  'sre-lab': '#00e676',
  'home-base': '#ff9800',
  'burger-shop': '#ff5722',
  'reliance-jio': '#1565c0',
  'ai-code-building': '#37474f',
}

// ─── Building Label ───────────────────────────────────────────────────────────

export const LABEL = {
  fontSize: 0.7,
  color: '#ffffff',
  outlineColor: '#000000',
  outlineWidth: 0.04,
  yOffset: 2.2,
} as const

// ─── Indian Flag / Central Plaza ──────────────────────────────────────────────

export const FLAG = {
  polePosition: [0, 0, -6] as [number, number, number],
  poleHeight: 10,
  poleRadius: 0.08,
  poleColor: '#c0c0c0',
  flagWidth: 3,
  flagHeight: 2,
  flagYOffset: 8.5,
  saffronColor: '#FF9933',
  whiteColor: '#FFFFFF',
  greenColor: '#138808',
  chakraColor: '#000080',
} as const

// ─── Physics ──────────────────────────────────────────────────────────────────

export const PHYSICS = {
  gravity: [0, -20, 0] as [number, number, number],
} as const

// ─── HUD ──────────────────────────────────────────────────────────────────────

export const HUD = {
  interactionPromptDefault: '[E] Interact',
  damageFlashDuration: 400,
  mapToggleHint: '[M] Map',
  cheatConsoleHint: '[~] Cheat Console',
} as const

// ─── Controls ─────────────────────────────────────────────────────────────────

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
// frontend/types/index.ts

// ─── Shared Utility Types ─────────────────────────────────────────────────────

export type Vec3 = [number, number, number]

export type Nullable<T> = T | null

// ─── Experience ──────────────────────────────────────────────────────────────

export type ExperienceType = 'education' | 'internship' | 'job' | 'overload'

export interface ExperienceEntry {
  year: number
  title: string
  company: string
  description: string
  tech: string[]
  isSystemOverload?: boolean
  type?: ExperienceType
  dateRange?: string
  location?: string
}

// ─── Projects ────────────────────────────────────────────────────────────────

export type ProjectStatus = 'active' | 'archived' | 'wip'
export type ProjectCategory = 'sre' | 'backend' | 'frontend' | 'fullstack' | 'devops'

export interface ProjectEntry {
  id: string
  name: string
  description: string
  tech: string[]
  githubUrl?: string
  liveUrl?: string
  stars?: number
  forks?: number
  status?: ProjectStatus
  category?: ProjectCategory
  year?: number
}

// ─── Social ───────────────────────────────────────────────────────────────────

export type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'instagram'
  | 'leetcode'
  | 'portfolio'

export interface SocialLink {
  id: string
  platform: SocialPlatform
  label: string
  url: string
  floor: number
  themeColor: string
  description: string
}

// ─── AI Tools ─────────────────────────────────────────────────────────────────

export type AIToolName = 'chatgpt' | 'gemini' | 'claude'

export interface AITool {
  id: string
  name: string
  toolName: AIToolName
  floor: number
  description: string
  url: string
  themeColor: string
  accentColor: string
}

// ─── Job / Career ─────────────────────────────────────────────────────────────

export interface JobEntry {
  id: string
  company: string
  role: string
  dateRange: string
  tech: string[]
  isCurrent: boolean
  description: string
  location?: string
}

// ─── City / World ─────────────────────────────────────────────────────────────

export type ZoneId =
  | 'central-plaza'
  | 'experience-zone'
  | 'resume-citadel'
  | 'social-tower'
  | 'sre-lab'
  | 'home-base'
  | 'burger-shop'
  | 'reliance-jio'
  | 'ai-code-building'

export interface ZoneConfig {
  id: ZoneId
  label: string
  position: Vec3
  size: Vec3
  color: string
  description: string
}

// ─── Anuj Character ───────────────────────────────────────────────────────────

export type CharacterType = 'male-human'

export type CharacterAnimationName =
  | 'Idle'
  | 'Walk'
  | 'Run'
  | 'Jump'
  | 'Sit'
  | 'Interact'
  | 'Typing'
  | 'Falling'
  | 'Parachute'

export interface CharacterModelConfig {
  enabled: boolean
  path: string
  fallbackPath: string
  fallbackMode: string
  scale: number
  height: number
  eyeHeight: number
  shoulderHeight: number
}

export interface AnujCharacterConfig {
  id: 'anuj'
  displayName: 'Anuj'
  characterType: CharacterType
  role: 'protagonist'
  spawnPosition: Vec3
  spawnRotation: Vec3
  model: CharacterModelConfig
  animations: {
    idle: CharacterAnimationName
    walk: CharacterAnimationName
    run: CharacterAnimationName
    jump: CharacterAnimationName
    sit: CharacterAnimationName
    interact: CharacterAnimationName
    coding: CharacterAnimationName
    falling: CharacterAnimationName
    parachute: CharacterAnimationName
  }
  movement: {
    walkSpeed: number
    sprintSpeed: number
    jumpForce: number
    rotationLerpFactor: number
  }
  stats: {
    maxHp: number
    respawnHp: number
  }
  interaction: {
    radius: number
  }
}

// ─── Player Physics ───────────────────────────────────────────────────────────
//
// This is for invisible movement/collider logic only.
// It should not visually define Anuj.

export type PlayerControllerType = 'humanoid-character-controller'

export interface PlayerPhysicsConfig {
  controllerType: PlayerControllerType
  bodyHeight: number
  bodyRadius: number
  footOffset: number
  mass: number
  lockRotations: boolean
  canSleep: boolean
}

// ─── Monkey Companion ─────────────────────────────────────────────────────────

export type CompanionType = 'gopher-pet'

export type MonkeyAnimationName =
  | 'Idle'
  | 'ShoulderIdle'
  | 'JumpToMonitor'
  | 'MonitorIdle'
  | 'ReturnToShoulder'
  | 'React'

export interface MonkeyCompanionConfig {
  id: 'monkey'
  displayName: 'Monkey'
  companionType: CompanionType
  owner: 'anuj'
  model: {
    enabled: boolean
    path: string
    fallbackPath: string
    fallbackMode: string
    scale: number
  }
  shoulder: {
    offset: Vec3
    rotation: Vec3
  }
  monitorPerch: {
    offset: Vec3
    rotation: Vec3
  }
  idle: {
    bobAmplitude: number
    bobSpeed: number
    blinkIntervalMs: number
    headTiltAmount: number
  }
  animations: {
    idle: MonkeyAnimationName
    shoulderIdle: MonkeyAnimationName
    jumpToMonitor: MonkeyAnimationName
    monitorIdle: MonkeyAnimationName
    returnToShoulder: MonkeyAnimationName
    react: MonkeyAnimationName
  }
}

// ─── Player State ─────────────────────────────────────────────────────────────

export type PlayerMode =
  | 'roaming'
  | 'sitting'
  | 'focus-coding'
  | 'parachuting'
  | 'dead'

export interface PlayerState {
  position: Vec3
  rotation: Vec3
  hp: number
  maxHp: number
  lastCheckpoint: Vec3
  isAlive: boolean
  isSitting: boolean
  isCoding: boolean
  currentZone: ZoneId | null
  mode: PlayerMode
}

// ─── Reliance Jio / Jio Cabin ─────────────────────────────────────────────────

export type JioCabinSceneId = 'jio-cabin'

export type JioDashboardTrend = 'up' | 'down' | 'stable'

export type JioStatusVariant = 'info' | 'success' | 'warning' | 'danger'

export interface JioStatusPanel {
  id: string
  label: string
  value: string
  variant: JioStatusVariant
  visible: boolean
}

export interface JioTechStackItem {
  id: string
  label: string
  icon: string
  visible: boolean
  glow?: boolean
}

export interface JioDashboardPanel {
  id: string
  title: string
  metric: string
  value: string
  trend: JioDashboardTrend
  visible: boolean
}

export interface JioAchievement {
  id: string
  title: string
  description: string
  model: 'trophy' | 'badge' | 'cube' | string
  visible: boolean
}

export interface JioCustomSection {
  id: string
  title: string
  type: 'list' | 'timeline' | 'grid' | string
  visible: boolean
  items: string[]
}

export interface BrandingConfig {
  user: {
    name: string
    displayName: string
    currentRole: string
    company: string
    location: string
    employmentDate: string
    tagline: string
  }

  jioCabin: {
    plaque: {
      enabled: boolean
      titleTemplate: string
      subtitle: string
      metaTemplate: string
      style: 'glassmorphism' | string
    }

    statusPanels: JioStatusPanel[]

    techStackWall: {
      enabled: boolean
      items: JioTechStackItem[]
    }

    dashboards: {
      enabled: boolean
      style: 'grafana-inspired' | string
      panels: JioDashboardPanel[]
    }

    achievementShelf: {
      enabled: boolean
      trophies: JioAchievement[]
    }

    customSections: JioCustomSection[]
  }
}

export interface JioBuildingConfig {
  brandBlue: string
  glassColor: string
  glassOpacity: number
  emissiveBlue: string

  citySpawnPoint: Vec3
  cabinSpawnPoint: Vec3

  exterior: {
    logoText: string
    logoHeight: number
    logoDepth: number
    buildingHeight: number
    revolvingDoorPrompt: string
  }

  cabin: {
    sceneId: JioCabinSceneId
    exitPrompt: string
    sitPrompt: string
    codingPrompt: string
    exitFocusPrompt: string
  }

  snippet: {
    backendEndpoint: string
    backendFilePath: string
  }
}

export interface JioCabinState {
  isInsideCabin: boolean
  isTransitioning: boolean
  isFocusMode: boolean
  isCodingLoopActive: boolean
  monkeyLocation: 'shoulder' | 'monitor'
}

// ─── Game ─────────────────────────────────────────────────────────────────────

export type CheatCode = 'SKIPGANGSTERS' | 'ANUJ-RESUME-2026'

export interface GameState {
  cheatsActive: boolean
  enemiesDisabled: boolean
  currentCheat: CheatCode | null
  mapOpen: boolean
  cheatConsoleOpen: boolean
}

// ─── Interaction ──────────────────────────────────────────────────────────────
//
// Keep this aligned with constants and future interaction system.
// This supports both your older interaction labels and the newer reusable
// interactable architecture.

export type InteractionType =
  | 'lever'
  | 'terminal'
  | 'door'
  | 'elevator'
  | 'seat'
  | 'checkpoint'
  | 'resume'
  | 'food'
  | 'map'
  | 'headphones'
  | 'cheat-console'
  | 'reception'
  | 'url'
  | 'sit'
  | 'eat'
  | 'plaque'
  | 'enter-building'
  | 'exit-building'
  | 'parachute'
  | 'download'
  | 'laptop'
  | 'coding-loop'

export interface InteractableConfig {
  id: string
  type: InteractionType
  label: string
  promptText: string
  proximityRadius: number
  position?: Vec3
  zoneId?: ZoneId
}

export interface Interactable {
  id: string
  label: string
  type: InteractionType
  position: Vec3
  radius: number
  promptText?: string
  zoneId?: ZoneId
  onInteract: () => void
}

// ─── Music ────────────────────────────────────────────────────────────────────

export interface Track {
  id: string
  title: string
  filename: string
  duration?: number
}

// ─── HUD ──────────────────────────────────────────────────────────────────────

export interface HUDState {
  showInteractionPrompt: boolean
  interactionPromptText: string
  showDamageFlash: boolean
  zoneName: string
  mapOpen?: boolean
  cheatConsoleOpen?: boolean
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface ApiError {
  message: string
  status?: number
}
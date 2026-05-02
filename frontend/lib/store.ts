import { create } from 'zustand'
import * as THREE from 'three'

export type GameZone = 'spawn' | 'forge' | 'library' | 'lookout' | 'citadel' | 'homebase'

export interface Project {
  id: string
  slug: string
  title: string
  shortDesc: string
  description: string
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  featured: boolean
}

export interface ExperienceEntry {
  year: number
  title: string
  company: string
  description: string
  tech: string[]
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    year: 2019,
    title: 'Diploma in Computer Science (Inception)',
    company: 'HIST',
    description: 'Started technical journey. Mastered Linux CLI environments and wrote initial backend logic in Go.',
    tech: ['Go', 'C', 'Linux', 'Bash']
  },
  {
    year: 2020,
    title: 'Full-Stack Foundations',
    company: 'HIST',
    description: 'Advanced into modern frontend frameworks. Built responsive, state-driven interfaces and modular UI components.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Git']
  },
  {
    year: 2021,
    title: 'Backend Systems & API Design',
    company: 'HIST',
    description: 'Transitioned to server-side architecture. Focused on RESTful API design, middleware logic, and database modeling.',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Postman']
  },
  {
    year: 2022,
    title: 'Diploma Completion (Jun 2022)',
    company: 'HIST',
    description: 'Graduated with a strong foundation in computer engineering and systems deployment.',
    tech: ['Systems Engineering', 'SQL', 'Project Management']
  },
  {
    year: 2022,
    title: 'B.Tech CS - Lateral Entry (Aug 2022)',
    company: 'SRMU',
    description: 'Commenced Undergraduate Degree. Deep-dived into Object-Oriented Programming and memory management.',
    tech: ['Python', 'Java', 'C++', 'Data Structures']
  },
  {
    year: 2023,
    title: 'Advanced Engineering Theory',
    company: 'SRMU',
    description: 'Academic focus on Distributed Systems, OS Architecture, and Database Management Systems (DBMS).',
    tech: ['PostgreSQL', 'System Design', 'Algorithms']
  },
  {
    year: 2024,
    title: 'Core Systems & Cloud Engineering',
    company: 'SRMU',
    description: 'Specializing in containerization and infrastructure. Implementing DevOps practices in academic projects.',
    tech: ['Docker', 'Kubernetes', 'Cloud Computing']
  },
  {
    year: 2024,
    title: 'Software Developer Intern',
    company: 'Synapsesphere Technologies',
    description: 'Optimized backend performance and engineered scalable frontend features using TypeScript (Sep 2024 - Feb 2025).',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Redux']
  },
  {
    year: 2025,
    title: 'B.Tech Graduation (May 2025)',
    company: 'SRMU',
    description: 'Successfully completed Undergraduate degree with honors. Focused on SRE principles and automated pipelines.',
    tech: ['AWS', 'Cloud Architecture', 'Nginx', 'CI/CD']
  },
  {
    year: 2025,
    title: 'Software Developer Intern',
    company: 'Microtex Clothing Pvt Ltd',
    description: 'Redesigned core systems for high-traffic conversions and managed containerized microservices (Oct 2025 - Feb 2026).',
    tech: ['Next.js 15', 'Kubernetes', 'Docker', 'AWS']
  },
  {
    year: 2026,
    title: 'Software Engineer (Apprentice)',
    company: 'Reliance Jio',
    description: 'Building high-scale backend portals. Focusing on Go-based microservices and cloud orchestration (Mar 2026 - Present).',
    tech: ['Go', 'Azure', 'DevOps', 'gRPC', 'PostgreSQL']
  },
  {
    year: 2026,
    title: 'SYSTEM OVERLOAD // ERROR',
    company: '????',
    description: 'CRITICAL: Future state undefined. Seeking high-velocity roles in SRE and Distributed Backend Systems.',
    tech: ['Distributed Systems', 'Advanced Go', 'SRE', 'Infrastructure as Code']
  }
];

export const SOCIAL_LINKS = [
  { floor: 1, label: 'LinkedIn', url: 'https://www.linkedin.com/in/anuj-kumar-tiwari-770a84238/', icon: '🔗', color: '#0077b5' },
  { floor: 2, label: 'GitHub', url: 'https://github.com/AnujTiwari-Student', icon: '🐙', color: '#6e40c9' },
  { floor: 3, label: 'Instagram', url: 'https://www.instagram.com/shc.anuj/', icon: '📸', color: '#e1306c' },
  { floor: 4, label: 'LeetCode', url: 'https://leetcode.com/u/Anuj2901/', icon: '⚡', color: '#ffa116' },
  { floor: 5, label: 'Source Code', url: 'https://github.com/AnujTiwari-Student/castle-portfolio', icon: '🏰', color: '#00ffc8' },
]

interface GameState {
  // Player
  playerPos: THREE.Vector3
  setPlayerPos: (pos: THREE.Vector3) => void

  // Zone
  currentZone: GameZone
  setCurrentZone: (zone: GameZone) => void

  // Projects
  nearbyProject: string | null
  setNearbyProject: (slug: string | null) => void
  activeProject: Project | null
  setActiveProject: (p: Project | null) => void

  // Timeline / Library
  isTimelineActive: boolean
  setTimelineActive: (v: boolean) => void
  timelineSlide: number
  setTimelineSlide: (n: number) => void
  leverPulled: boolean
  setLeverPulled: (v: boolean) => void
  projectorExploded: boolean
  setProjectorExploded: (v: boolean) => void

  // Resume / Citadel
  isResumeOpen: boolean
  setResumeOpen: (v: boolean) => void
  enemiesDefeated: number
  incrementEnemiesDefeated: () => void
  citadelUnlocked: boolean

  // Social Tower
  isSocialTowerOpen: boolean
  setSocialTowerOpen: (v: boolean) => void
  socialFloor: number
  setSocialFloor: (n: number) => void

  // Home / Music
  isMusicPlaying: boolean
  setMusicPlaying: (v: boolean) => void
  currentTrack: number
  setCurrentTrack: (n: number) => void
  isHeadphonesOn: boolean
  setHeadphonesOn: (v: boolean) => void

  // Game
  isPaused: boolean
  setPaused: (v: boolean) => void
  health: number
  setHealth: (n: number) => void
  damagePlayer: (n: number) => void

  // Controls hint
  showControls: boolean
  setShowControls: (v: boolean) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  playerPos: new THREE.Vector3(0, 1, 0),
  setPlayerPos: (pos) => set({ playerPos: pos.clone() }),

  currentZone: 'spawn',
  setCurrentZone: (zone) => set({ currentZone: zone }),

  nearbyProject: null,
  setNearbyProject: (slug) => set({ nearbyProject: slug }),
  activeProject: null,
  setActiveProject: (p) => set({ activeProject: p, isPaused: p !== null }),

  isTimelineActive: false,
  setTimelineActive: (v) => set({ isTimelineActive: v, isPaused: v }),
  timelineSlide: 0,
  setTimelineSlide: (n) => set({ timelineSlide: n }),
  leverPulled: false,
  setLeverPulled: (v) => set({ leverPulled: v }),
  projectorExploded: false,
  setProjectorExploded: (v) => set({ projectorExploded: v }),

  isResumeOpen: false,
  setResumeOpen: (v) => set({ isResumeOpen: v, isPaused: v }),
  enemiesDefeated: 0,
  incrementEnemiesDefeated: () =>
    set((s) => {
      const next = s.enemiesDefeated + 1
      return { enemiesDefeated: next, citadelUnlocked: next >= 3 }
    }),
  citadelUnlocked: false,

  isSocialTowerOpen: false,
  setSocialTowerOpen: (v) => set({ isSocialTowerOpen: v, isPaused: v }),
  socialFloor: 1,
  setSocialFloor: (n) => set({ socialFloor: n }),

  isMusicPlaying: false,
  setMusicPlaying: (v) => set({ isMusicPlaying: v }),
  currentTrack: 0,
  setCurrentTrack: (n) => set({ currentTrack: n }),
  isHeadphonesOn: false,
  setHeadphonesOn: (v) => set({ isHeadphonesOn: v }),

  isPaused: false,
  setPaused: (v) => set({ isPaused: v }),
  health: 100,
  setHealth: (n) => set({ health: Math.max(0, Math.min(100, n)) }),
  damagePlayer: (n) => {
    const { health, setHealth } = get()
    setHealth(health - n)
  },

  showControls: true,
  setShowControls: (v) => set({ showControls: v }),
}))
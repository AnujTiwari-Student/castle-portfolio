// frontend/data/currentJob.ts

import type { JobEntry } from '@/types'

export const RELIANCE_JIO_JOB_ID = 'reliance-jio'

export interface PortfolioJobEntry extends JobEntry {
  order: number
  showcase?: {
    buildingZoneId?: 'reliance-jio'
    cabinSceneId?: 'jio-cabin'
    isJioCommandCenter?: boolean
    plaqueRole?: string
    statusLabel?: string
    focusAreas?: string[]
  }
}

export const JOB_ENTRIES: PortfolioJobEntry[] = [
  {
    id: 'synapsesphere-intern',
    company: 'Synapsesphere Technologies',
    role: 'Software Developer Intern',
    dateRange: 'Sep 2024 – Feb 2025',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Redux'],
    isCurrent: false,
    description:
      'Worked on frontend and backend feature development, improving application structure, UI implementation, and TypeScript-based development workflows.',
    location: 'Lucknow, India',
    order: 1,
  },
  {
    id: 'microtex-intern',
    company: 'Microtex Clothing Pvt Ltd',
    role: 'Software Developer Intern',
    dateRange: 'Oct 2025 – Feb 2026',
    tech: ['Next.js 15', 'Kubernetes', 'Docker', 'AWS'],
    isCurrent: false,
    description:
      'Worked on application development and deployment-focused tasks involving modern frontend systems, containerized workflows, and cloud-oriented infrastructure.',
    location: 'Mumbai, India',
    order: 2,
  },
  {
    id: RELIANCE_JIO_JOB_ID,
    company: 'Reliance Jio',
    role: 'Software Engineer (Apprentice)',
    dateRange: 'Mar 2026 – Present',
    tech: ['Go', 'Azure', 'DevOps', 'gRPC', 'PostgreSQL'],
    isCurrent: true,
    description:
      'Currently working on backend-focused engineering, reliability-oriented workflows, scalable service development, observability-aware systems, and DevOps practices.',
    location: 'Mumbai, India',
    order: 3,
    showcase: {
      buildingZoneId: 'reliance-jio',
      cabinSceneId: 'jio-cabin',
      isJioCommandCenter: true,
      plaqueRole: 'Software Engineer (Apprentice)',
      statusLabel: 'Currently Working Here',
      focusAreas: [
        'Backend reliability',
        'Go service development',
        'gRPC service health',
        'Azure-oriented workflows',
        'DevOps practices',
        'PostgreSQL-backed systems',
        'Observability and monitoring awareness',
      ],
    },
  },
]

// ─── Constants ────────────────────────────────────────────────────────────────

export const JOB_ENTRIES_TOTAL = JOB_ENTRIES.length

export const CURRENT_JOB_ID = RELIANCE_JIO_JOB_ID

export const CURRENT_JOB_TECH_STACK = [
  'Go',
  'Azure',
  'DevOps',
  'gRPC',
  'PostgreSQL',
] as const

export const JOB_COMPANY_LABELS: Record<string, string> = {
  'synapsesphere-intern': 'Synapsesphere Technologies',
  'microtex-intern': 'Microtex Clothing Pvt Ltd',
  [RELIANCE_JIO_JOB_ID]: 'Reliance Jio',
}

// ─── Important Architecture Note ──────────────────────────────────────────────
//
// The full Reliance Jio cabin UI must be rendered from:
//
// frontend/app/config/branding.ts
//
// This file is only career/job data and fallback metadata.
// Do not hardcode Jio cabin plaques, dashboards, achievements,
// tech walls, or status panels inside React components from this file.
// Use branding.ts for the full configurable Jio Command Center.

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Get the current active job entry.
 */
export function getCurrentJob(): PortfolioJobEntry | undefined {
  return JOB_ENTRIES.find((job) => job.isCurrent)
}

/**
 * Get the Reliance Jio job entry directly.
 */
export function getRelianceJioJob(): PortfolioJobEntry | undefined {
  return getJobById(RELIANCE_JIO_JOB_ID)
}

/**
 * Get all previous jobs.
 */
export function getPreviousJobs(): PortfolioJobEntry[] {
  return JOB_ENTRIES.filter((job) => !job.isCurrent)
}

/**
 * Get a job entry by id.
 */
export function getJobById(id: string): PortfolioJobEntry | undefined {
  return JOB_ENTRIES.find((job) => job.id === id)
}

/**
 * Get a job entry by company name.
 */
export function getJobByCompany(company: string): PortfolioJobEntry | undefined {
  return JOB_ENTRIES.find(
    (job) => job.company.toLowerCase() === company.toLowerCase()
  )
}

/**
 * Whether a job entry has a usable location string.
 */
export function hasJobLocation(job: JobEntry): boolean {
  return Boolean(job.location && job.location.trim().length > 0)
}

/**
 * All jobs sorted by explicit order, newest first.
 */
export function getJobsNewestFirst(): PortfolioJobEntry[] {
  return [...JOB_ENTRIES].sort((a, b) => b.order - a.order)
}

/**
 * Previous jobs sorted by explicit order, newest first.
 */
export function getPreviousJobsNewestFirst(): PortfolioJobEntry[] {
  return getPreviousJobs().sort((a, b) => b.order - a.order)
}

/**
 * Summary shape used by job plaques, HUD labels, and fallback UI.
 *
 * For the full Jio cabin, prefer frontend/app/config/branding.ts.
 */
export function getCurrentJobSummary():
  | {
      id: string
      company: string
      role: string
      dateRange: string
      location: string
      statusLabel: string
      tech: string[]
    }
  | undefined {
  const job = getCurrentJob()

  if (!job) {
    return undefined
  }

  return {
    id: job.id,
    company: job.company,
    role: job.role,
    dateRange: job.dateRange,
    location: job.location ?? '',
    statusLabel: job.showcase?.statusLabel ?? 'Current Role',
    tech: job.tech,
  }
}

/**
 * Fallback data for the Jio cabin if branding.ts is unavailable.
 *
 * This should not replace branding.ts.
 * It only prevents the Jio Building from rendering empty content.
 */
export function getJioCabinFallbackSummary():
  | {
      name: string
      role: string
      company: string
      dateRange: string
      location: string
      statusLabel: string
      tech: string[]
      focusAreas: string[]
    }
  | undefined {
  const job = getRelianceJioJob()

  if (!job) {
    return undefined
  }

  return {
    name: 'Anuj Tiwari',
    role: job.showcase?.plaqueRole ?? job.role,
    company: job.company,
    dateRange: job.dateRange,
    location: job.location ?? '',
    statusLabel: job.showcase?.statusLabel ?? 'Currently Working Here',
    tech: job.tech,
    focusAreas: job.showcase?.focusAreas ?? [],
  }
}

/**
 * All unique tech items across all job entries.
 */
export function getAllJobTech(): string[] {
  return Array.from(new Set(JOB_ENTRIES.flatMap((job) => job.tech)))
}

/**
 * Tech items for the current job only.
 */
export function getCurrentJobTech(): string[] {
  return getCurrentJob()?.tech ?? []
}

/**
 * Tech items for the Reliance Jio command center fallback.
 */
export function getJioCommandCenterTech(): string[] {
  return getRelianceJioJob()?.tech ?? [...CURRENT_JOB_TECH_STACK]
}

/**
 * Whether the current job is Reliance Jio.
 */
export function isCurrentJobRelianceJio(): boolean {
  return getCurrentJob()?.id === RELIANCE_JIO_JOB_ID
}

/**
 * Whether a job should have a dedicated city building showcase.
 */
export function hasJobShowcaseBuilding(job: PortfolioJobEntry): boolean {
  return Boolean(job.showcase?.buildingZoneId)
}
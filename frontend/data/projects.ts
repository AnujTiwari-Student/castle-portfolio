// frontend/data/projects.ts

import type { ProjectEntry, ProjectCategory, ProjectStatus } from '@/types'

export const PROJECTS: ProjectEntry[] = [
  {
    id: 'castle-portfolio',
    name: 'Castle Portfolio',
    description:
      'A game-like 3D portfolio city built with Next.js, React Three Fiber, Three.js, and a Go backend. The world showcases experience, projects, resume access, social links, current job context, and interactive zones.',
    tech: ['Next.js', 'TypeScript', 'React Three Fiber', 'Three.js', 'Go'],
    githubUrl: '',
    liveUrl: '',
    status: 'wip',
    category: 'fullstack',
    year: 2026,
  },
  {
    id: 'go-sre-toolkit',
    name: 'Go SRE Toolkit',
    description:
      'A planned Go-based reliability toolkit focused on service health checks, graceful shutdown, structured logging, metrics endpoints, and backend operational patterns.',
    tech: ['Go', 'Prometheus', 'Docker', 'gRPC'],
    githubUrl: '',
    liveUrl: '',
    status: 'wip',
    category: 'sre',
    year: 2026,
  },
  {
    id: 'grpc-health-monitor',
    name: 'gRPC Health Monitor',
    description:
      'A backend-focused project concept for monitoring gRPC service health, request behavior, service availability, and reliability signals across internal services.',
    tech: ['Go', 'gRPC', 'PostgreSQL', 'OpenTelemetry'],
    githubUrl: '',
    liveUrl: '',
    status: 'wip',
    category: 'backend',
    year: 2026,
  },
  {
    id: 'k8s-observability-dashboard',
    name: 'Kubernetes Observability Dashboard',
    description:
      'A DevOps/SRE dashboard concept for visualizing pod health, scaling events, resource usage, deployment status, and basic service-level indicators.',
    tech: ['Kubernetes', 'Docker', 'Azure', 'Go', 'PostgreSQL'],
    githubUrl: '',
    liveUrl: '',
    status: 'wip',
    category: 'devops',
    year: 2026,
  },
  {
    id: 'nextjs-commerce-ui',
    name: 'Next.js Commerce UI',
    description:
      'A frontend-focused commerce interface concept using modern Next.js patterns, reusable UI components, state management, responsive layouts, and performance-minded rendering.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand'],
    githubUrl: '',
    liveUrl: '',
    status: 'archived',
    category: 'frontend',
    year: 2025,
  },
  {
    id: 'devops-pipeline-kit',
    name: 'DevOps Pipeline Kit',
    description:
      'A collection of CI/CD workflow templates and deployment patterns for Go and Node.js projects, including Docker builds, GitHub Actions, environment setup, and release automation concepts.',
    tech: ['GitHub Actions', 'Docker', 'Azure', 'Bash', 'Nginx'],
    githubUrl: '',
    liveUrl: '',
    status: 'wip',
    category: 'devops',
    year: 2025,
  },
]

/**
 * Filter projects by category.
 */
export function getProjectsByCategory(category: ProjectCategory): ProjectEntry[] {
  return PROJECTS.filter((project) => project.category === category)
}

/**
 * Filter projects by status.
 */
export function getProjectsByStatus(status: ProjectStatus): ProjectEntry[] {
  return PROJECTS.filter((project) => project.status === status)
}

/**
 * Get only active projects.
 */
export function getActiveProjects(): ProjectEntry[] {
  return PROJECTS.filter((project) => project.status === 'active')
}

/**
 * Get work-in-progress projects.
 */
export function getWipProjects(): ProjectEntry[] {
  return PROJECTS.filter((project) => project.status === 'wip')
}

/**
 * Get projects that are safe to show as featured in the SRE Lab.
 */
export function getFeaturedProjects(): ProjectEntry[] {
  return PROJECTS.filter((project) =>
    ['castle-portfolio', 'go-sre-toolkit', 'grpc-health-monitor', 'k8s-observability-dashboard'].includes(project.id)
  )
}

/**
 * Get a single project by id. Returns undefined if not found.
 */
export function getProjectById(id: string): ProjectEntry | undefined {
  return PROJECTS.find((project) => project.id === id)
}

/**
 * All unique categories present in the project list.
 * Used by SRE Lab terminal category filter tabs.
 */
export function getProjectCategories(): ProjectCategory[] {
  return Array.from(
    new Set(
      PROJECTS
        .map((project) => project.category)
        .filter((category): category is ProjectCategory => Boolean(category))
    )
  )
}

/**
 * Projects sorted by newest year first.
 */
export function getProjectsByNewestFirst(): ProjectEntry[] {
  return [...PROJECTS].sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
}

/**
 * Whether a project has an external URL worth opening.
 */
export function hasProjectExternalLink(project: ProjectEntry): boolean {
  return Boolean(project.githubUrl || project.liveUrl)
}

/**
 * Total project count.
 */
export const PROJECTS_TOTAL = PROJECTS.length
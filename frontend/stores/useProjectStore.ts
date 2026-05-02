// frontend/stores/useProjectStore.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ProjectCategory, ProjectEntry, ProjectStatus } from '@/types'
import {
  PROJECTS,
  getProjectById,
  getProjectCategories,
  getProjectsByNewestFirst,
} from '@/data/projects'

// ─── Filter Types ─────────────────────────────────────────────────────────────

export type ProjectCategoryFilter = ProjectCategory | 'all'
export type ProjectStatusFilter = ProjectStatus | 'all'

// ─── State Shape ──────────────────────────────────────────────────────────────

export interface ProjectStoreState {
  projects: ProjectEntry[]
  selectedProjectId: string | null

  categoryFilter: ProjectCategoryFilter
  statusFilter: ProjectStatusFilter
  searchQuery: string

  loading: boolean
  error: string | null

  terminalOpen: boolean
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

export interface ProjectStoreActions {
  // Data
  setProjects: (projects: ProjectEntry[]) => void
  resetProjects: () => void

  // Selection
  selectProject: (id: string) => void
  clearSelectedProject: () => void

  // Filters
  setCategoryFilter: (category: ProjectCategoryFilter) => void
  setStatusFilter: (status: ProjectStatusFilter) => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void

  // Terminal UI
  openTerminal: () => void
  closeTerminal: () => void
  toggleTerminal: () => void

  // Loading/error
  setLoading: (value: boolean) => void
  setError: (error: string | null) => void

  // Helpers
  getSelectedProject: () => ProjectEntry | undefined
  getVisibleProjects: () => ProjectEntry[]
  getProjectCategories: () => ProjectCategory[]
  hasProjectExternalLink: (project: ProjectEntry) => boolean

  // Reset
  resetProjectStore: () => void
}

export type ProjectStore = ProjectStoreState & ProjectStoreActions

// ─── Initial State Factory ────────────────────────────────────────────────────

function createInitialProjectState(): ProjectStoreState {
  return {
    projects: getProjectsByNewestFirst(),
    selectedProjectId: null,

    categoryFilter: 'all',
    statusFilter: 'all',
    searchQuery: '',

    loading: false,
    error: null,

    terminalOpen: false,
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase()
}

function projectMatchesSearch(project: ProjectEntry, query: string): boolean {
  const normalizedQuery = normalizeSearch(query)

  if (!normalizedQuery) {
    return true
  }

  const searchableText = [
    project.name,
    project.description,
    project.category,
    project.status,
    project.year?.toString(),
    ...project.tech,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return searchableText.includes(normalizedQuery)
}

function projectHasExternalLink(project: ProjectEntry): boolean {
  return Boolean(project.githubUrl || project.liveUrl)
}

// ─── Architecture Note ────────────────────────────────────────────────────────
//
// This store owns SRE Lab project UI/data state only:
// - project selection
// - filters
// - terminal open/close state
// - loading/error placeholders
//
// It does NOT own:
// - 3D project bay mesh animation
// - modal rendering
// - external URL confirmation modal
// - real GitHub API fetching yet
//
// For now, data comes from frontend/data/projects.ts.
// Later, Phase 8 can replace this with backend API calls while keeping fallback.

// ─── Store ────────────────────────────────────────────────────────────────────

export const useProjectStore = create<ProjectStore>()(
  devtools(
    (set, get) => ({
      ...createInitialProjectState(),

      // ── Data ────────────────────────────────────────────────────────────────

      setProjects: (projects) => {
        set(
          {
            projects,
            error: null,
          },
          false,
          'projects/setProjects'
        )
      },

      resetProjects: () => {
        set(
          {
            projects: getProjectsByNewestFirst(),
            selectedProjectId: null,
            error: null,
          },
          false,
          'projects/resetProjects'
        )
      },

      // ── Selection ───────────────────────────────────────────────────────────

      selectProject: (id) => {
        const exists = get().projects.some((project) => project.id === id)

        set(
          {
            selectedProjectId: exists ? id : null,
            terminalOpen: exists ? true : get().terminalOpen,
            error: exists ? null : `Project not found: ${id}`,
          },
          false,
          'projects/selectProject'
        )
      },

      clearSelectedProject: () => {
        set(
          {
            selectedProjectId: null,
          },
          false,
          'projects/clearSelectedProject'
        )
      },

      // ── Filters ─────────────────────────────────────────────────────────────

      setCategoryFilter: (category) => {
        set(
          {
            categoryFilter: category,
          },
          false,
          'projects/setCategoryFilter'
        )
      },

      setStatusFilter: (status) => {
        set(
          {
            statusFilter: status,
          },
          false,
          'projects/setStatusFilter'
        )
      },

      setSearchQuery: (query) => {
        set(
          {
            searchQuery: query,
          },
          false,
          'projects/setSearchQuery'
        )
      },

      clearFilters: () => {
        set(
          {
            categoryFilter: 'all',
            statusFilter: 'all',
            searchQuery: '',
          },
          false,
          'projects/clearFilters'
        )
      },

      // ── Terminal UI ─────────────────────────────────────────────────────────

      openTerminal: () => {
        set(
          {
            terminalOpen: true,
          },
          false,
          'projects/openTerminal'
        )
      },

      closeTerminal: () => {
        set(
          {
            terminalOpen: false,
          },
          false,
          'projects/closeTerminal'
        )
      },

      toggleTerminal: () => {
        set(
          {
            terminalOpen: !get().terminalOpen,
          },
          false,
          'projects/toggleTerminal'
        )
      },

      // ── Loading/Error ───────────────────────────────────────────────────────

      setLoading: (value) => {
        set(
          {
            loading: value,
          },
          false,
          'projects/setLoading'
        )
      },

      setError: (error) => {
        set(
          {
            error,
          },
          false,
          'projects/setError'
        )
      },

      // ── Helpers ─────────────────────────────────────────────────────────────

      getSelectedProject: () => {
        const selectedId = get().selectedProjectId

        if (!selectedId) {
          return undefined
        }

        return get().projects.find((project) => project.id === selectedId)
      },

      getVisibleProjects: () => {
        const { projects, categoryFilter, statusFilter, searchQuery } = get()

        return projects.filter((project) => {
          const categoryMatch =
            categoryFilter === 'all' || project.category === categoryFilter

          const statusMatch =
            statusFilter === 'all' || project.status === statusFilter

          const searchMatch = projectMatchesSearch(project, searchQuery)

          return categoryMatch && statusMatch && searchMatch
        })
      },

      getProjectCategories: () => {
        return getProjectCategories()
      },

      hasProjectExternalLink: (project) => {
        return projectHasExternalLink(project)
      },

      // ── Reset ───────────────────────────────────────────────────────────────

      resetProjectStore: () => {
        set(createInitialProjectState(), false, 'projects/resetProjectStore')
      },
    }),
    {
      name: 'ProjectStore',
    }
  )
)

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectProjects = (state: ProjectStore) => state.projects

export const selectSelectedProjectId = (state: ProjectStore) =>
  state.selectedProjectId

export const selectSelectedProject = (state: ProjectStore) => {
  if (!state.selectedProjectId) {
    return undefined
  }

  return state.projects.find((project) => project.id === state.selectedProjectId)
}

export const selectProjectCategoryFilter = (state: ProjectStore) =>
  state.categoryFilter

export const selectProjectStatusFilter = (state: ProjectStore) =>
  state.statusFilter

export const selectProjectSearchQuery = (state: ProjectStore) =>
  state.searchQuery

export const selectProjectLoading = (state: ProjectStore) => state.loading

export const selectProjectError = (state: ProjectStore) => state.error

export const selectProjectTerminalOpen = (state: ProjectStore) =>
  state.terminalOpen

export const selectVisibleProjects = (state: ProjectStore) => {
  return state.projects.filter((project) => {
    const categoryMatch =
      state.categoryFilter === 'all' ||
      project.category === state.categoryFilter

    const statusMatch =
      state.statusFilter === 'all' || project.status === state.statusFilter

    const searchMatch = projectMatchesSearch(project, state.searchQuery)

    return categoryMatch && statusMatch && searchMatch
  })
}

export const selectProjectCategories = () => getProjectCategories()

export const selectProjectById = (id: string) => () => getProjectById(id)

export const selectFeaturedProjects = () => {
  return PROJECTS.filter((project) =>
    [
      'castle-portfolio',
      'go-sre-toolkit',
      'grpc-health-monitor',
      'k8s-observability-dashboard',
    ].includes(project.id)
  )
}
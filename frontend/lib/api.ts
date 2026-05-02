// frontend/lib/api.ts

import type {
  AITool,
  ExperienceEntry,
  JobEntry,
  ProjectEntry,
  SocialLink,
  Track,
} from '@/types'
import { AI_TOOLS } from '@/data/aiTools'
import { EXPERIENCE } from '@/data/experience'
import { getCurrentJob, JOB_ENTRIES } from '@/data/currentJob'
import { PROJECTS } from '@/data/projects'
import { SOCIAL_LINKS } from '@/data/social'
import { JIO_WORK_SNIPPET_FALLBACK } from '@/data/snippets'

// ─── API Config ───────────────────────────────────────────────────────────────

export interface ApiConfig {
  baseUrl: string
  timeoutMs: number
  fallbackEnabled: boolean
}

export const API_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  timeoutMs: 8000,
  fallbackEnabled: true,
}

// ─── Resume Defaults ──────────────────────────────────────────────────────────

export interface ResumePreviewResponse {
  title: string
  previewUrl: string
  downloadUrl: string
  updatedAt?: string
}

export const RESUME_FALLBACK: ResumePreviewResponse = {
  title: 'Anuj Resume',
  previewUrl: '/resume/anuj-resume.pdf',
  downloadUrl: '/resume/anuj-resume.pdf',
}

// ─── Music Defaults ───────────────────────────────────────────────────────────

export const MUSIC_TRACKS_FALLBACK: Track[] = [
  {
    id: 'lofi-debug-loop',
    title: 'Lo-Fi Debug Loop',
    filename: 'lofi-debug-loop.mp3',
    duration: 180,
  },
  {
    id: 'night-deploy',
    title: 'Night Deploy',
    filename: 'night-deploy.mp3',
    duration: 210,
  },
  {
    id: 'terminal-rain',
    title: 'Terminal Rain',
    filename: 'terminal-rain.mp3',
    duration: 196,
  },
]

// ─── Snippet Types ────────────────────────────────────────────────────────────

export interface SnippetResponse {
  code: string
}

// ─── Generic API Result ───────────────────────────────────────────────────────

export interface ApiFetchResult<T> {
  data: T
  source: 'backend' | 'fallback'
  error: string | null
}

export interface ApiRequestOptions {
  fallback?: boolean
  timeoutMs?: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getApiBaseUrl(): string {
  return API_CONFIG.baseUrl.replace(/\/$/, '')
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export function buildApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl()
  const normalizedPath = normalizePath(path)

  if (!baseUrl) {
    return normalizedPath
  }

  return `${baseUrl}${normalizedPath}`
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function getErrorMessage(error: unknown): string {
  if (isAbortError(error)) {
    return 'Request timed out.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown API error.'
}

async function fetchWithTimeout(
  url: string,
  options?: RequestInit,
  timeoutMs: number = API_CONFIG.timeoutMs
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

async function fetchJson<T>(
  path: string,
  fallbackData: T,
  options: ApiRequestOptions = {}
): Promise<ApiFetchResult<T>> {
  const fallbackEnabled = options.fallback ?? API_CONFIG.fallbackEnabled
  const timeoutMs = options.timeoutMs ?? API_CONFIG.timeoutMs

  try {
    const response = await fetchWithTimeout(
      buildApiUrl(path),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
      timeoutMs
    )

    if (!response.ok) {
      throw new Error(`GET ${path} failed with status ${response.status}.`)
    }

    const data = (await response.json()) as T

    return {
      data,
      source: 'backend',
      error: null,
    }
  } catch (error) {
    if (!fallbackEnabled) {
      throw error
    }

    return {
      data: fallbackData,
      source: 'fallback',
      error: getErrorMessage(error),
    }
  }
}

async function fetchText(
  path: string,
  fallbackText: string,
  options: ApiRequestOptions = {}
): Promise<ApiFetchResult<string>> {
  const fallbackEnabled = options.fallback ?? API_CONFIG.fallbackEnabled
  const timeoutMs = options.timeoutMs ?? API_CONFIG.timeoutMs

  try {
    const response = await fetchWithTimeout(
      buildApiUrl(path),
      {
        method: 'GET',
        headers: {
          Accept: 'text/plain, application/json',
        },
      },
      timeoutMs
    )

    if (!response.ok) {
      throw new Error(`GET ${path} failed with status ${response.status}.`)
    }

    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      const json = (await response.json()) as Partial<SnippetResponse>

      if (!json.code) {
        throw new Error(`GET ${path} returned JSON without a code field.`)
      }

      return {
        data: json.code,
        source: 'backend',
        error: null,
      }
    }

    return {
      data: await response.text(),
      source: 'backend',
      error: null,
    }
  } catch (error) {
    if (!fallbackEnabled) {
      throw error
    }

    return {
      data: fallbackText,
      source: 'fallback',
      error: getErrorMessage(error),
    }
  }
}

function getCurrentJobFallback(): JobEntry {
  return (
    getCurrentJob() ??
    JOB_ENTRIES[JOB_ENTRIES.length - 1] ?? {
      id: 'reliance-jio',
      company: 'Reliance Jio',
      role: 'Software Engineer (Apprentice)',
      dateRange: 'Mar 2026 – Present',
      tech: ['Go', 'Azure', 'DevOps', 'gRPC', 'PostgreSQL'],
      isCurrent: true,
      description:
        'Currently working on backend-focused engineering, reliability-oriented workflows, and scalable service development.',
      location: 'India',
    }
  )
}

// ─── Health ───────────────────────────────────────────────────────────────────

export interface HealthResponse {
  ok: boolean
  service: string
  timestamp?: string
}

export async function getHealth(): Promise<ApiFetchResult<HealthResponse>> {
  return fetchJson<HealthResponse>('/api/health', {
    ok: false,
    service: 'frontend-fallback',
  })
}

// ─── Experience ───────────────────────────────────────────────────────────────

export async function getExperience(): Promise<
  ApiFetchResult<ExperienceEntry[]>
> {
  return fetchJson<ExperienceEntry[]>('/api/experience', EXPERIENCE)
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<ApiFetchResult<ProjectEntry[]>> {
  return fetchJson<ProjectEntry[]>('/api/projects', PROJECTS)
}

export async function getProjectById(
  id: string
): Promise<ApiFetchResult<ProjectEntry | null>> {
  const fallbackProject = PROJECTS.find((project) => project.id === id) ?? null

  return fetchJson<ProjectEntry | null>(
    `/api/projects/${encodeURIComponent(id)}`,
    fallbackProject
  )
}

// ─── Social Links ─────────────────────────────────────────────────────────────

export async function getSocialLinks(): Promise<ApiFetchResult<SocialLink[]>> {
  return fetchJson<SocialLink[]>('/api/social-links', SOCIAL_LINKS)
}

// ─── Current Job ──────────────────────────────────────────────────────────────

export async function getCurrentJobEntry(): Promise<ApiFetchResult<JobEntry>> {
  return fetchJson<JobEntry>('/api/current-job', getCurrentJobFallback())
}

// ─── AI Tools ─────────────────────────────────────────────────────────────────

export async function getAITools(): Promise<ApiFetchResult<AITool[]>> {
  return fetchJson<AITool[]>('/api/ai-tools', AI_TOOLS)
}

// ─── Music ────────────────────────────────────────────────────────────────────

export async function getMusicTracks(): Promise<ApiFetchResult<Track[]>> {
  return fetchJson<Track[]>('/api/music/tracks', MUSIC_TRACKS_FALLBACK)
}

export function getMusicStreamUrl(trackId: string): string {
  return buildApiUrl(`/api/music/stream/${encodeURIComponent(trackId)}`)
}

// ─── Resume ───────────────────────────────────────────────────────────────────

export async function getResumePreview(): Promise<
  ApiFetchResult<ResumePreviewResponse>
> {
  return fetchJson<ResumePreviewResponse>(
    '/api/resume/preview',
    RESUME_FALLBACK
  )
}

export function getResumeDownloadUrl(): string {
  return buildApiUrl('/api/resume/download')
}

// ─── Jio Snippet ──────────────────────────────────────────────────────────────

export async function getJioWorkSnippet(): Promise<ApiFetchResult<string>> {
  return fetchText('/api/snippets/jio-work', JIO_WORK_SNIPPET_FALLBACK)
}

// ─── GitHub Repo Stats Placeholder ────────────────────────────────────────────

export interface GitHubRepoStats {
  owner: string
  repo: string
  stars: number
  forks: number
  openIssues?: number
}

export async function getGitHubRepoStats(params: {
  owner: string
  repo: string
}): Promise<ApiFetchResult<GitHubRepoStats>> {
  const fallbackStats: GitHubRepoStats = {
    owner: params.owner,
    repo: params.repo,
    stars: 0,
    forks: 0,
    openIssues: 0,
  }

  const query = new URLSearchParams({
    owner: params.owner,
    repo: params.repo,
  })

  return fetchJson<GitHubRepoStats>(
    `/api/github/repo-stats?${query.toString()}`,
    fallbackStats
  )
}
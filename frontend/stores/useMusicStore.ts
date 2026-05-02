// frontend/stores/useMusicStore.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Track } from '@/types'

// ─── Music Source Types ───────────────────────────────────────────────────────

export type MusicSourceMode = 'static' | 'backend' | 'fallback'

export type MusicPlaybackStatus =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error'

// ─── Frontend-First Mock Playlist ─────────────────────────────────────────────
//
// Keep this here until a dedicated frontend/data/music.ts file or backend
// endpoint exists.
//
// Future backend endpoint:
// GET /api/music/tracks
// GET /api/music/stream/:trackId

export const DEFAULT_PLAYLIST: Track[] = [
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

// ─── State Shape ──────────────────────────────────────────────────────────────

export interface MusicStoreState {
  playlist: Track[]
  currentTrackId: string | null

  status: MusicPlaybackStatus
  sourceMode: MusicSourceMode

  isPlaying: boolean
  isMuted: boolean

  progressSeconds: number
  durationSeconds: number
  volume: number

  loading: boolean
  error: string | null

  backendBasePath: string
  staticBasePath: string
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

export interface MusicStoreActions {
  // Playlist
  setPlaylist: (tracks: Track[]) => void
  resetPlaylist: () => void

  // Track selection
  setCurrentTrack: (trackId: string) => void
  clearCurrentTrack: () => void
  selectFirstTrack: () => void

  // Playback intent
  play: () => void
  pause: () => void
  togglePlay: () => void
  stop: () => void

  // Navigation
  nextTrack: () => void
  previousTrack: () => void

  // Progress
  setProgress: (seconds: number) => void
  setDuration: (seconds: number) => void
  markEnded: () => void

  // Volume
  setVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  toggleMute: () => void

  // Source / backend readiness
  setSourceMode: (mode: MusicSourceMode) => void
  setBackendBasePath: (path: string) => void
  setStaticBasePath: (path: string) => void

  // Loading/error
  setLoading: (value: boolean) => void
  setError: (error: string | null) => void

  // Helpers
  getCurrentTrack: () => Track | undefined
  getCurrentTrackIndex: () => number
  getTrackUrl: (track?: Track) => string
  hasTracks: () => boolean

  // Reset
  resetMusicStore: () => void
}

export type MusicStore = MusicStoreState & MusicStoreActions

// ─── Initial State Factory ────────────────────────────────────────────────────

function createInitialMusicState(): MusicStoreState {
  const firstTrack = DEFAULT_PLAYLIST[0]

  return {
    playlist: DEFAULT_PLAYLIST,
    currentTrackId: firstTrack?.id ?? null,

    status: 'idle',
    sourceMode: 'static',

    isPlaying: false,
    isMuted: false,

    progressSeconds: 0,
    durationSeconds: firstTrack?.duration ?? 0,
    volume: 0.75,

    loading: false,
    error: null,

    backendBasePath: '/api/music/stream',
    staticBasePath: '/music',
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function getTrackIndexById(playlist: Track[], trackId: string | null): number {
  if (!trackId) {
    return -1
  }

  return playlist.findIndex((track) => track.id === trackId)
}

function getSafeTrackDuration(track: Track | undefined): number {
  return Math.max(0, track?.duration ?? 0)
}

function ensureLeadingSlash(value: string): string {
  if (!value) {
    return ''
  }

  return value.startsWith('/') ? value : `/${value}`
}

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

// ─── Architecture Note ────────────────────────────────────────────────────────
//
// This store owns music player state only:
// - playlist
// - current track
// - playback intent
// - progress
// - volume
// - source mode
// - loading/error placeholders
//
// It does NOT own:
// - the actual HTMLAudioElement
// - audio event listeners
// - fetching backend music tracks yet
// - music player modal open/closed state
//
// Future MusicPlayer.tsx should own the audio element and call this store when
// audio events fire.

// ─── Store ────────────────────────────────────────────────────────────────────

export const useMusicStore = create<MusicStore>()(
  devtools(
    (set, get) => ({
      ...createInitialMusicState(),

      // ── Playlist ────────────────────────────────────────────────────────────

      setPlaylist: (tracks) => {
        const nextPlaylist = tracks.length > 0 ? tracks : DEFAULT_PLAYLIST
        const currentTrackStillExists = nextPlaylist.some(
          (track) => track.id === get().currentTrackId
        )
        const nextCurrentTrack = currentTrackStillExists
          ? get().currentTrackId
          : nextPlaylist[0]?.id ?? null

        const selectedTrack = nextPlaylist.find(
          (track) => track.id === nextCurrentTrack
        )

        set(
          {
            playlist: nextPlaylist,
            currentTrackId: nextCurrentTrack,
            durationSeconds: getSafeTrackDuration(selectedTrack),
            progressSeconds: 0,
            error: null,
          },
          false,
          'music/setPlaylist'
        )
      },

      resetPlaylist: () => {
        const firstTrack = DEFAULT_PLAYLIST[0]

        set(
          {
            playlist: DEFAULT_PLAYLIST,
            currentTrackId: firstTrack?.id ?? null,
            durationSeconds: firstTrack?.duration ?? 0,
            progressSeconds: 0,
            error: null,
          },
          false,
          'music/resetPlaylist'
        )
      },

      // ── Track Selection ─────────────────────────────────────────────────────

      setCurrentTrack: (trackId) => {
        const track = get().playlist.find((item) => item.id === trackId)

        if (!track) {
          set(
            {
              error: `Track not found: ${trackId}`,
            },
            false,
            'music/setCurrentTrack/notFound'
          )
          return
        }

        set(
          {
            currentTrackId: track.id,
            progressSeconds: 0,
            durationSeconds: getSafeTrackDuration(track),
            status: 'idle',
            isPlaying: false,
            error: null,
          },
          false,
          'music/setCurrentTrack'
        )
      },

      clearCurrentTrack: () => {
        set(
          {
            currentTrackId: null,
            progressSeconds: 0,
            durationSeconds: 0,
            status: 'idle',
            isPlaying: false,
          },
          false,
          'music/clearCurrentTrack'
        )
      },

      selectFirstTrack: () => {
        const firstTrack = get().playlist[0]

        if (!firstTrack) {
          get().clearCurrentTrack()
          return
        }

        get().setCurrentTrack(firstTrack.id)
      },

      // ── Playback Intent ─────────────────────────────────────────────────────

      play: () => {
        if (!get().currentTrackId) {
          get().selectFirstTrack()
        }

        if (!get().currentTrackId) {
          set(
            {
              status: 'error',
              error: 'No track available to play.',
              isPlaying: false,
            },
            false,
            'music/play/noTrack'
          )
          return
        }

        set(
          {
            status: 'playing',
            isPlaying: true,
            error: null,
          },
          false,
          'music/play'
        )
      },

      pause: () => {
        set(
          {
            status: 'paused',
            isPlaying: false,
          },
          false,
          'music/pause'
        )
      },

      togglePlay: () => {
        if (get().isPlaying) {
          get().pause()
          return
        }

        get().play()
      },

      stop: () => {
        set(
          {
            status: 'idle',
            isPlaying: false,
            progressSeconds: 0,
          },
          false,
          'music/stop'
        )
      },

      // ── Navigation ──────────────────────────────────────────────────────────

      nextTrack: () => {
        const { playlist, currentTrackId, isPlaying } = get()

        if (playlist.length === 0) {
          get().clearCurrentTrack()
          return
        }

        const currentIndex = getTrackIndexById(playlist, currentTrackId)
        const nextIndex =
          currentIndex < 0 ? 0 : (currentIndex + 1) % playlist.length

        const nextTrack = playlist[nextIndex]

        set(
          {
            currentTrackId: nextTrack.id,
            progressSeconds: 0,
            durationSeconds: getSafeTrackDuration(nextTrack),
            status: isPlaying ? 'playing' : 'idle',
            error: null,
          },
          false,
          'music/nextTrack'
        )
      },

      previousTrack: () => {
        const { playlist, currentTrackId, isPlaying } = get()

        if (playlist.length === 0) {
          get().clearCurrentTrack()
          return
        }

        const currentIndex = getTrackIndexById(playlist, currentTrackId)
        const previousIndex =
          currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1

        const previousTrack = playlist[previousIndex]

        set(
          {
            currentTrackId: previousTrack.id,
            progressSeconds: 0,
            durationSeconds: getSafeTrackDuration(previousTrack),
            status: isPlaying ? 'playing' : 'idle',
            error: null,
          },
          false,
          'music/previousTrack'
        )
      },

      // ── Progress ────────────────────────────────────────────────────────────

      setProgress: (seconds) => {
        const { durationSeconds } = get()

        set(
          {
            progressSeconds: clamp(seconds, 0, Math.max(0, durationSeconds)),
          },
          false,
          'music/setProgress'
        )
      },

      setDuration: (seconds) => {
        const safeDuration = Math.max(0, seconds)

        set(
          {
            durationSeconds: safeDuration,
            progressSeconds: clamp(get().progressSeconds, 0, safeDuration),
          },
          false,
          'music/setDuration'
        )
      },

      markEnded: () => {
        set(
          {
            status: 'ended',
            isPlaying: false,
            progressSeconds: get().durationSeconds,
          },
          false,
          'music/markEnded'
        )
      },

      // ── Volume ──────────────────────────────────────────────────────────────

      setVolume: (volume) => {
        set(
          {
            volume: clamp(volume, 0, 1),
            isMuted: volume <= 0 ? true : get().isMuted,
          },
          false,
          'music/setVolume'
        )
      },

      mute: () => {
        set(
          {
            isMuted: true,
          },
          false,
          'music/mute'
        )
      },

      unmute: () => {
        set(
          {
            isMuted: false,
            volume: get().volume <= 0 ? 0.75 : get().volume,
          },
          false,
          'music/unmute'
        )
      },

      toggleMute: () => {
        if (get().isMuted) {
          get().unmute()
          return
        }

        get().mute()
      },

      // ── Source / Backend Readiness ──────────────────────────────────────────

      setSourceMode: (mode) => {
        set(
          {
            sourceMode: mode,
          },
          false,
          'music/setSourceMode'
        )
      },

      setBackendBasePath: (path) => {
        set(
          {
            backendBasePath: trimTrailingSlash(ensureLeadingSlash(path)),
          },
          false,
          'music/setBackendBasePath'
        )
      },

      setStaticBasePath: (path) => {
        set(
          {
            staticBasePath: trimTrailingSlash(ensureLeadingSlash(path)),
          },
          false,
          'music/setStaticBasePath'
        )
      },

      // ── Loading/Error ───────────────────────────────────────────────────────

      setLoading: (value) => {
        set(
          {
            loading: value,
            status: value ? 'loading' : get().status,
          },
          false,
          'music/setLoading'
        )
      },

      setError: (error) => {
        set(
          {
            error,
            status: error ? 'error' : get().status,
            loading: false,
          },
          false,
          'music/setError'
        )
      },

      // ── Helpers ─────────────────────────────────────────────────────────────

      getCurrentTrack: () => {
        return get().playlist.find((track) => track.id === get().currentTrackId)
      },

      getCurrentTrackIndex: () => {
        return getTrackIndexById(get().playlist, get().currentTrackId)
      },

      getTrackUrl: (track) => {
        const targetTrack = track ?? get().getCurrentTrack()

        if (!targetTrack) {
          return ''
        }

        const { sourceMode, backendBasePath, staticBasePath } = get()

        if (sourceMode === 'backend') {
          return `${backendBasePath}/${encodeURIComponent(targetTrack.id)}`
        }

        return `${staticBasePath}/${targetTrack.filename}`
      },

      hasTracks: () => {
        return get().playlist.length > 0
      },

      // ── Reset ───────────────────────────────────────────────────────────────

      resetMusicStore: () => {
        set(createInitialMusicState(), false, 'music/resetMusicStore')
      },
    }),
    {
      name: 'MusicStore',
    }
  )
)

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectPlaylist = (state: MusicStore) => state.playlist

export const selectCurrentTrackId = (state: MusicStore) =>
  state.currentTrackId

export const selectCurrentTrack = (state: MusicStore) =>
  state.playlist.find((track) => track.id === state.currentTrackId)

export const selectCurrentTrackIndex = (state: MusicStore) =>
  getTrackIndexById(state.playlist, state.currentTrackId)

export const selectMusicStatus = (state: MusicStore) => state.status

export const selectMusicSourceMode = (state: MusicStore) => state.sourceMode

export const selectMusicIsPlaying = (state: MusicStore) => state.isPlaying

export const selectMusicIsMuted = (state: MusicStore) => state.isMuted

export const selectMusicProgressSeconds = (state: MusicStore) =>
  state.progressSeconds

export const selectMusicDurationSeconds = (state: MusicStore) =>
  state.durationSeconds

export const selectMusicProgressFraction = (state: MusicStore) => {
  if (state.durationSeconds <= 0) {
    return 0
  }

  return clamp(state.progressSeconds / state.durationSeconds, 0, 1)
}

export const selectMusicVolume = (state: MusicStore) => state.volume

export const selectMusicLoading = (state: MusicStore) => state.loading

export const selectMusicError = (state: MusicStore) => state.error

export const selectCurrentTrackUrl = (state: MusicStore) => {
  const track = state.playlist.find((item) => item.id === state.currentTrackId)

  if (!track) {
    return ''
  }

  if (state.sourceMode === 'backend') {
    return `${state.backendBasePath}/${encodeURIComponent(track.id)}`
  }

  return `${state.staticBasePath}/${track.filename}`
}

export const selectHasTracks = (state: MusicStore) => state.playlist.length > 0
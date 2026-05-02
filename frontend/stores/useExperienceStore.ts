// frontend/stores/useExperienceStore.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  EXPERIENCE,
  EXPERIENCE_NORMAL,
  EXPERIENCE_OVERLOAD,
  EXPERIENCE_TOTAL,
} from '@/data/experience'
import type { ExperienceEntry } from '@/types'

// ─── Projector Status ────────────────────────────────────────────────────────

export type ExperienceProjectorStatus =
  | 'idle'
  | 'active'
  | 'overload'
  | 'completed'

// ─── State Shape ──────────────────────────────────────────────────────────────

export interface ExperienceStoreState {
  projectorActive: boolean
  projectorStatus: ExperienceProjectorStatus

  currentSlideIndex: number
  previousSlideIndex: number | null

  overloadTriggered: boolean
  overloadCompleted: boolean

  autoAdvanceEnabled: boolean
  autoAdvanceMs: number

  lastActivatedAt: number | null
  lastSlideChangedAt: number | null
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

export interface ExperienceStoreActions {
  // Projector lifecycle
  activateProjector: () => void
  deactivateProjector: () => void
  resetProjector: () => void

  // Slide navigation
  nextSlide: () => void
  previousSlide: () => void
  goToSlide: (index: number) => void
  goToFirstSlide: () => void
  goToLastSlide: () => void

  // Overload
  triggerOverload: () => void
  completeOverload: () => void
  resetOverload: () => void

  // Auto advance
  enableAutoAdvance: () => void
  disableAutoAdvance: () => void
  setAutoAdvanceMs: (ms: number) => void

  // Helpers
  isCurrentSlideOverload: () => boolean
  getCurrentSlide: () => ExperienceEntry
  getNormalSlides: () => ExperienceEntry[]
  getOverloadSlide: () => ExperienceEntry
}

export type ExperienceStore = ExperienceStoreState & ExperienceStoreActions

// ─── Constants ────────────────────────────────────────────────────────────────

export const DEFAULT_AUTO_ADVANCE_MS = 5000

export const MIN_AUTO_ADVANCE_MS = 1500

export const MAX_AUTO_ADVANCE_MS = 15000

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMaxSlideIndex(): number {
  return Math.max(0, EXPERIENCE_TOTAL - 1)
}

function clampSlideIndex(index: number): number {
  return Math.max(0, Math.min(index, getMaxSlideIndex()))
}

function getSafeSlide(index: number): ExperienceEntry {
  return EXPERIENCE[clampSlideIndex(index)] ?? EXPERIENCE_OVERLOAD
}

function isOverloadSlide(index: number): boolean {
  return Boolean(getSafeSlide(index).isSystemOverload)
}

function getNextProjectorStatus(index: number): ExperienceProjectorStatus {
  return isOverloadSlide(index) ? 'overload' : 'active'
}

function createInitialExperienceState(): ExperienceStoreState {
  return {
    projectorActive: false,
    projectorStatus: 'idle',

    currentSlideIndex: 0,
    previousSlideIndex: null,

    overloadTriggered: false,
    overloadCompleted: false,

    autoAdvanceEnabled: false,
    autoAdvanceMs: DEFAULT_AUTO_ADVANCE_MS,

    lastActivatedAt: null,
    lastSlideChangedAt: null,
  }
}

// ─── Architecture Note ────────────────────────────────────────────────────────
//
// This store owns only Experience Zone projector state.
// It does not own:
// - player movement
// - lever mesh animation
// - camera movement
// - projector VFX
// - sound effects
//
// Components should use this store to decide what the projector should show.
// Visual animations should be handled inside the Experience Zone components.

// ─── Store ────────────────────────────────────────────────────────────────────

export const useExperienceStore = create<ExperienceStore>()(
  devtools(
    (set, get) => ({
      ...createInitialExperienceState(),

      // ── Projector Lifecycle ─────────────────────────────────────────────────

      activateProjector: () => {
        const now = Date.now()

        set(
          {
            projectorActive: true,
            projectorStatus: getNextProjectorStatus(get().currentSlideIndex),
            lastActivatedAt: now,
            lastSlideChangedAt: now,
          },
          false,
          'experience/activateProjector'
        )
      },

      deactivateProjector: () => {
        set(
          {
            projectorActive: false,
            projectorStatus: 'idle',
            autoAdvanceEnabled: false,
          },
          false,
          'experience/deactivateProjector'
        )
      },

      resetProjector: () => {
        set(createInitialExperienceState(), false, 'experience/resetProjector')
      },

      // ── Slide Navigation ────────────────────────────────────────────────────

      nextSlide: () => {
        const { currentSlideIndex } = get()
        const nextIndex = clampSlideIndex(currentSlideIndex + 1)
        const nextSlide = getSafeSlide(nextIndex)
        const overload = Boolean(nextSlide.isSystemOverload)

        set(
          {
            previousSlideIndex: currentSlideIndex,
            currentSlideIndex: nextIndex,
            projectorStatus: getNextProjectorStatus(nextIndex),
            overloadTriggered: overload ? true : get().overloadTriggered,
            lastSlideChangedAt: Date.now(),
          },
          false,
          'experience/nextSlide'
        )
      },

      previousSlide: () => {
        const { currentSlideIndex } = get()
        const nextIndex = clampSlideIndex(currentSlideIndex - 1)

        set(
          {
            previousSlideIndex: currentSlideIndex,
            currentSlideIndex: nextIndex,
            projectorStatus: getNextProjectorStatus(nextIndex),
            lastSlideChangedAt: Date.now(),
          },
          false,
          'experience/previousSlide'
        )
      },

      goToSlide: (index) => {
        const { currentSlideIndex } = get()
        const nextIndex = clampSlideIndex(index)
        const nextSlide = getSafeSlide(nextIndex)
        const overload = Boolean(nextSlide.isSystemOverload)

        set(
          {
            previousSlideIndex: currentSlideIndex,
            currentSlideIndex: nextIndex,
            projectorStatus: getNextProjectorStatus(nextIndex),
            overloadTriggered: overload ? true : get().overloadTriggered,
            lastSlideChangedAt: Date.now(),
          },
          false,
          'experience/goToSlide'
        )
      },

      goToFirstSlide: () => {
        get().goToSlide(0)
      },

      goToLastSlide: () => {
        get().goToSlide(getMaxSlideIndex())
      },

      // ── Overload ────────────────────────────────────────────────────────────

      triggerOverload: () => {
        const overloadIndex = EXPERIENCE.findIndex(
          (entry) => entry.isSystemOverload
        )

        set(
          {
            previousSlideIndex: get().currentSlideIndex,
            currentSlideIndex:
              overloadIndex >= 0 ? overloadIndex : getMaxSlideIndex(),
            projectorActive: true,
            projectorStatus: 'overload',
            overloadTriggered: true,
            overloadCompleted: false,
            autoAdvanceEnabled: false,
            lastSlideChangedAt: Date.now(),
          },
          false,
          'experience/triggerOverload'
        )
      },

      completeOverload: () => {
        set(
          {
            projectorStatus: 'completed',
            overloadCompleted: true,
            autoAdvanceEnabled: false,
          },
          false,
          'experience/completeOverload'
        )
      },

      resetOverload: () => {
        set(
          {
            overloadTriggered: false,
            overloadCompleted: false,
            projectorStatus: get().projectorActive ? 'active' : 'idle',
          },
          false,
          'experience/resetOverload'
        )
      },

      // ── Auto Advance ────────────────────────────────────────────────────────

      enableAutoAdvance: () => {
        set(
          {
            autoAdvanceEnabled: true,
          },
          false,
          'experience/enableAutoAdvance'
        )
      },

      disableAutoAdvance: () => {
        set(
          {
            autoAdvanceEnabled: false,
          },
          false,
          'experience/disableAutoAdvance'
        )
      },

      setAutoAdvanceMs: (ms) => {
        const safeMs = Math.max(
          MIN_AUTO_ADVANCE_MS,
          Math.min(ms, MAX_AUTO_ADVANCE_MS)
        )

        set(
          {
            autoAdvanceMs: safeMs,
          },
          false,
          'experience/setAutoAdvanceMs'
        )
      },

      // ── Helpers ─────────────────────────────────────────────────────────────

      isCurrentSlideOverload: () => {
        return isOverloadSlide(get().currentSlideIndex)
      },

      getCurrentSlide: () => {
        return getSafeSlide(get().currentSlideIndex)
      },

      getNormalSlides: () => {
        return EXPERIENCE_NORMAL
      },

      getOverloadSlide: () => {
        return EXPERIENCE_OVERLOAD
      },
    }),
    {
      name: 'ExperienceStore',
    }
  )
)

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectProjectorActive = (state: ExperienceStore) =>
  state.projectorActive

export const selectProjectorStatus = (state: ExperienceStore) =>
  state.projectorStatus

export const selectCurrentSlideIndex = (state: ExperienceStore) =>
  state.currentSlideIndex

export const selectPreviousSlideIndex = (state: ExperienceStore) =>
  state.previousSlideIndex

export const selectCurrentExperienceSlide = (state: ExperienceStore) =>
  getSafeSlide(state.currentSlideIndex)

export const selectCurrentExperienceSlideNumber = (state: ExperienceStore) =>
  state.currentSlideIndex + 1

export const selectExperienceTotalSlides = () => EXPERIENCE_TOTAL

export const selectExperienceProgress = (state: ExperienceStore) => {
  if (EXPERIENCE_TOTAL <= 1) {
    return 1
  }

  return state.currentSlideIndex / (EXPERIENCE_TOTAL - 1)
}

export const selectOverloadTriggered = (state: ExperienceStore) =>
  state.overloadTriggered

export const selectOverloadCompleted = (state: ExperienceStore) =>
  state.overloadCompleted

export const selectAutoAdvanceEnabled = (state: ExperienceStore) =>
  state.autoAdvanceEnabled

export const selectAutoAdvanceMs = (state: ExperienceStore) =>
  state.autoAdvanceMs

export const selectIsOnFirstSlide = (state: ExperienceStore) =>
  state.currentSlideIndex <= 0

export const selectIsOnLastSlide = (state: ExperienceStore) =>
  state.currentSlideIndex >= getMaxSlideIndex()

export const selectIsOnOverloadSlide = (state: ExperienceStore) =>
  isOverloadSlide(state.currentSlideIndex)

export const selectCanGoNext = (state: ExperienceStore) =>
  state.currentSlideIndex < getMaxSlideIndex()

export const selectCanGoPrevious = (state: ExperienceStore) =>
  state.currentSlideIndex > 0
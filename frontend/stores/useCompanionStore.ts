// frontend/stores/useCompanionStore.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MonkeyAnimationName, Vec3 } from '@/types'
import { MONKEY_COMPANION } from '@/lib/constants'

// ─── Companion Types ──────────────────────────────────────────────────────────

export type CompanionLocation =
  | 'shoulder'
  | 'monitor'
  | 'following'
  | 'hidden'

export type CompanionMood =
  | 'idle'
  | 'curious'
  | 'excited'
  | 'focused'
  | 'alert'

export type CompanionTransition =
  | 'none'
  | 'to-shoulder'
  | 'to-monitor'
  | 'to-following'
  | 'hiding'
  | 'showing'

// ─── State Shape ──────────────────────────────────────────────────────────────

export interface CompanionStoreState {
  companionId: string
  displayName: string

  location: CompanionLocation
  targetLocation: CompanionLocation | null
  transition: CompanionTransition

  visible: boolean
  mood: CompanionMood
  currentAnimation: MonkeyAnimationName

  reactionText: string | null
  lastReactionAt: number | null

  shoulderOffset: Vec3
  monitorPerchOffset: Vec3
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

export interface CompanionStoreActions {
  // Location
  setLocation: (location: CompanionLocation) => void
  moveToShoulder: () => void
  moveToMonitor: () => void
  moveToFollowing: () => void
  hideCompanion: () => void
  showCompanion: () => void

  // Transition lifecycle
  startTransition: (target: CompanionLocation) => void
  completeTransition: () => void
  cancelTransition: () => void

  // Mood / animation
  setMood: (mood: CompanionMood) => void
  setAnimation: (animation: MonkeyAnimationName) => void

  // Reactions
  react: (text: string, mood?: CompanionMood) => void
  clearReaction: () => void

  // Jio-specific helpers
  enterCodingMode: () => void
  exitCodingMode: () => void

  // Reset
  resetCompanion: () => void
}

export type CompanionStore = CompanionStoreState & CompanionStoreActions

// ─── Initial State Factory ────────────────────────────────────────────────────

function createInitialCompanionState(): CompanionStoreState {
  return {
    companionId: MONKEY_COMPANION.id,
    displayName: MONKEY_COMPANION.displayName,

    location: 'shoulder',
    targetLocation: null,
    transition: 'none',

    visible: true,
    mood: 'idle',
    currentAnimation: MONKEY_COMPANION.animations.shoulderIdle,

    reactionText: null,
    lastReactionAt: null,

    shoulderOffset: MONKEY_COMPANION.shoulder.offset,
    monitorPerchOffset: MONKEY_COMPANION.monitorPerch.offset,
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTransitionForTarget(
  target: CompanionLocation
): CompanionTransition {
  switch (target) {
    case 'shoulder':
      return 'to-shoulder'
    case 'monitor':
      return 'to-monitor'
    case 'following':
      return 'to-following'
    case 'hidden':
      return 'hiding'
    default:
      return 'none'
  }
}

function getAnimationForLocation(location: CompanionLocation): MonkeyAnimationName {
  switch (location) {
    case 'shoulder':
      return MONKEY_COMPANION.animations.shoulderIdle
    case 'monitor':
      return MONKEY_COMPANION.animations.monitorIdle
    case 'following':
      return MONKEY_COMPANION.animations.idle
    case 'hidden':
      return MONKEY_COMPANION.animations.idle
    default:
      return MONKEY_COMPANION.animations.idle
  }
}

// ─── Architecture Note ────────────────────────────────────────────────────────
//
// This store owns Monkey's behavior state only:
// - where Monkey should be
// - current mood
// - current animation intent
// - small reactions/emotes
//
// It does NOT own:
// - Anuj player state
// - Jio cabin scene state
// - actual 3D model animation mixer
//
// Components should read this state and visually animate Monkey.

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCompanionStore = create<CompanionStore>()(
  devtools(
    (set, get) => ({
      ...createInitialCompanionState(),

      // ── Location ────────────────────────────────────────────────────────────

      setLocation: (location) => {
        set(
          {
            location,
            targetLocation: null,
            transition: 'none',
            visible: location !== 'hidden',
            currentAnimation: getAnimationForLocation(location),
          },
          false,
          'companion/setLocation'
        )
      },

      moveToShoulder: () => {
        get().startTransition('shoulder')
      },

      moveToMonitor: () => {
        get().startTransition('monitor')
      },

      moveToFollowing: () => {
        get().startTransition('following')
      },

      hideCompanion: () => {
        get().startTransition('hidden')
      },

      showCompanion: () => {
        set(
          {
            visible: true,
            transition: 'showing',
            targetLocation: 'shoulder',
          },
          false,
          'companion/showCompanion'
        )
      },

      // ── Transition Lifecycle ────────────────────────────────────────────────

      startTransition: (target) => {
        set(
          {
            targetLocation: target,
            transition: getTransitionForTarget(target),
            visible: target !== 'hidden',
            currentAnimation:
              target === 'monitor'
                ? MONKEY_COMPANION.animations.jumpToMonitor
                : target === 'shoulder'
                  ? MONKEY_COMPANION.animations.returnToShoulder
                  : getAnimationForLocation(target),
          },
          false,
          'companion/startTransition'
        )
      },

      completeTransition: () => {
        const target = get().targetLocation

        if (!target) {
          set(
            {
              transition: 'none',
            },
            false,
            'companion/completeTransition/noTarget'
          )
          return
        }

        set(
          {
            location: target,
            targetLocation: null,
            transition: 'none',
            visible: target !== 'hidden',
            currentAnimation: getAnimationForLocation(target),
          },
          false,
          'companion/completeTransition'
        )
      },

      cancelTransition: () => {
        set(
          {
            targetLocation: null,
            transition: 'none',
            currentAnimation: getAnimationForLocation(get().location),
          },
          false,
          'companion/cancelTransition'
        )
      },

      // ── Mood / Animation ────────────────────────────────────────────────────

      setMood: (mood) => {
        set({ mood }, false, 'companion/setMood')
      },

      setAnimation: (animation) => {
        set({ currentAnimation: animation }, false, 'companion/setAnimation')
      },

      // ── Reactions ───────────────────────────────────────────────────────────

      react: (text, mood = 'curious') => {
        set(
          {
            reactionText: text,
            mood,
            lastReactionAt: Date.now(),
            currentAnimation: MONKEY_COMPANION.animations.react,
          },
          false,
          'companion/react'
        )
      },

      clearReaction: () => {
        set(
          {
            reactionText: null,
            mood: 'idle',
            currentAnimation: getAnimationForLocation(get().location),
          },
          false,
          'companion/clearReaction'
        )
      },

      // ── Jio-Specific Helpers ────────────────────────────────────────────────

      enterCodingMode: () => {
        set(
          {
            mood: 'focused',
            reactionText: null,
          },
          false,
          'companion/enterCodingMode/prep'
        )

        get().moveToMonitor()
      },

      exitCodingMode: () => {
        set(
          {
            mood: 'idle',
            reactionText: null,
          },
          false,
          'companion/exitCodingMode/prep'
        )

        get().moveToShoulder()
      },

      // ── Reset ───────────────────────────────────────────────────────────────

      resetCompanion: () => {
        set(createInitialCompanionState(), false, 'companion/resetCompanion')
      },
    }),
    {
      name: 'CompanionStore',
    }
  )
)

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCompanionLocation = (state: CompanionStore) =>
  state.location

export const selectCompanionTargetLocation = (state: CompanionStore) =>
  state.targetLocation

export const selectCompanionTransition = (state: CompanionStore) =>
  state.transition

export const selectCompanionVisible = (state: CompanionStore) => state.visible

export const selectCompanionMood = (state: CompanionStore) => state.mood

export const selectCompanionAnimation = (state: CompanionStore) =>
  state.currentAnimation

export const selectCompanionReactionText = (state: CompanionStore) =>
  state.reactionText

export const selectCompanionShoulderOffset = (state: CompanionStore) =>
  state.shoulderOffset

export const selectCompanionMonitorPerchOffset = (state: CompanionStore) =>
  state.monitorPerchOffset

export const selectCompanionIsOnShoulder = (state: CompanionStore) =>
  state.location === 'shoulder'

export const selectCompanionIsOnMonitor = (state: CompanionStore) =>
  state.location === 'monitor'

export const selectCompanionIsTransitioning = (state: CompanionStore) =>
  state.transition !== 'none'
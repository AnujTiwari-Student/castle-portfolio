// frontend/stores/usePlayerStore.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PlayerMode, PlayerState, Vec3, ZoneId } from '@/types'
import { ANUJ_CHARACTER } from '@/lib/constants'
import {
  applyDamage,
  applyHeal,
  cloneVec3,
  getZoneAtPosition,
  isDead,
} from '@/lib/utils'

// ─── Actions Shape ────────────────────────────────────────────────────────────

export interface PlayerStoreActions {
  // Position
  setPosition: (position: Vec3, options?: { syncZone?: boolean }) => void
  setRotation: (rotation: Vec3) => void
  teleportTo: (position: Vec3, options?: { syncZone?: boolean }) => void

  // Zone
  setZone: (zoneId: ZoneId | null) => void
  syncZoneFromPosition: (position?: Vec3) => void

  // HP
  takeDamage: (amount: number, options?: { autoRespawn?: boolean }) => void
  heal: (amount: number) => void
  setHp: (hp: number) => void
  restoreFullHealth: () => void

  // Life state
  kill: () => void
  revive: (hp?: number) => void

  // Checkpoint
  saveCheckpoint: (position: Vec3) => void
  respawn: () => void

  // Mode
  setMode: (mode: PlayerMode) => void
  setSitting: (value: boolean) => void
  setCoding: (value: boolean) => void
  exitSeat: () => void
  exitCoding: () => void

  // Reset
  resetPlayer: () => void
}

export type PlayerStore = PlayerState & PlayerStoreActions

// ─── Initial State Factory ────────────────────────────────────────────────────
//
// Use a factory instead of a shared constant object because Vec3 arrays are
// mutable. This prevents accidental shared references between resets.

function createInitialPlayerState(): PlayerState {
  const spawnPosition = cloneVec3(ANUJ_CHARACTER.spawnPosition)
  const spawnRotation = cloneVec3(ANUJ_CHARACTER.spawnRotation)

  return {
    position: spawnPosition,
    rotation: spawnRotation,
    hp: ANUJ_CHARACTER.stats.maxHp,
    maxHp: ANUJ_CHARACTER.stats.maxHp,
    lastCheckpoint: cloneVec3(spawnPosition),
    isAlive: true,
    isSitting: false,
    isCoding: false,
    currentZone: getZoneAtPosition(spawnPosition),
    mode: 'roaming',
  }
}

// ─── Architecture Note ────────────────────────────────────────────────────────
//
// This store owns Anuj's gameplay state:
// - position
// - rotation
// - HP
// - checkpoint
// - current zone
// - player mode
//
// It does NOT own full Jio cabin state.
// For Jio-specific state like isInsideCabin, isFocusMode, and monkeyLocation,
// use a dedicated Jio cabin store later.

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePlayerStore = create<PlayerStore>()(
  devtools(
    (set, get) => ({
      ...createInitialPlayerState(),

      // ── Position ────────────────────────────────────────────────────────────

      setPosition: (position, options = { syncZone: true }) => {
        const nextPosition = cloneVec3(position)
        const nextZone = options.syncZone
          ? getZoneAtPosition(nextPosition)
          : get().currentZone

        set(
          {
            position: nextPosition,
            currentZone: nextZone,
          },
          false,
          'player/setPosition'
        )
      },

      setRotation: (rotation) => {
        set(
          {
            rotation: cloneVec3(rotation),
          },
          false,
          'player/setRotation'
        )
      },

      teleportTo: (position, options = { syncZone: true }) => {
        const nextPosition = cloneVec3(position)
        const nextZone = options.syncZone
          ? getZoneAtPosition(nextPosition)
          : get().currentZone

        set(
          {
            position: nextPosition,
            currentZone: nextZone,
          },
          false,
          'player/teleportTo'
        )
      },

      // ── Zone ────────────────────────────────────────────────────────────────

      setZone: (zoneId) => {
        set({ currentZone: zoneId }, false, 'player/setZone')
      },

      syncZoneFromPosition: (position) => {
        const targetPosition = position ?? get().position
        const detectedZone = getZoneAtPosition(targetPosition)

        if (detectedZone !== get().currentZone) {
          set({ currentZone: detectedZone }, false, 'player/syncZone')
        }
      },

      // ── HP ──────────────────────────────────────────────────────────────────

      takeDamage: (amount, options = { autoRespawn: false }) => {
        const { hp, maxHp, isAlive } = get()

        if (!isAlive || amount <= 0) {
          return
        }

        const nextHp = applyDamage(hp, amount, maxHp)
        const playerDied = isDead(nextHp)

        set(
          {
            hp: nextHp,
            isAlive: !playerDied,
            isSitting: playerDied ? false : get().isSitting,
            isCoding: playerDied ? false : get().isCoding,
            mode: playerDied ? 'dead' : get().mode,
          },
          false,
          'player/takeDamage'
        )

        if (playerDied && options.autoRespawn) {
          get().respawn()
        }
      },

      heal: (amount) => {
        const { hp, maxHp, isAlive } = get()

        if (!isAlive || amount <= 0) {
          return
        }

        set(
          {
            hp: applyHeal(hp, amount, maxHp),
          },
          false,
          'player/heal'
        )
      },

      setHp: (hp) => {
        const { maxHp } = get()
        const nextHp = Math.max(0, Math.min(hp, maxHp))
        const playerDied = isDead(nextHp)

        set(
          {
            hp: nextHp,
            isAlive: !playerDied,
            isSitting: playerDied ? false : get().isSitting,
            isCoding: playerDied ? false : get().isCoding,
            mode: playerDied ? 'dead' : get().mode,
          },
          false,
          'player/setHp'
        )
      },

      restoreFullHealth: () => {
        set(
          {
            hp: get().maxHp,
            isAlive: true,
          },
          false,
          'player/restoreFullHealth'
        )
      },

      // ── Life State ──────────────────────────────────────────────────────────

      kill: () => {
        set(
          {
            hp: 0,
            isAlive: false,
            isSitting: false,
            isCoding: false,
            mode: 'dead',
          },
          false,
          'player/kill'
        )
      },

      revive: (hp = ANUJ_CHARACTER.stats.respawnHp) => {
        const { maxHp } = get()
        const revivedHp = Math.max(1, Math.min(hp, maxHp))

        set(
          {
            hp: revivedHp,
            isAlive: true,
            mode: 'roaming',
          },
          false,
          'player/revive'
        )
      },

      // ── Checkpoint ──────────────────────────────────────────────────────────

      saveCheckpoint: (position) => {
        set(
          {
            lastCheckpoint: cloneVec3(position),
          },
          false,
          'player/saveCheckpoint'
        )
      },

      respawn: () => {
        const { lastCheckpoint, maxHp } = get()
        const respawnHp = Math.min(ANUJ_CHARACTER.stats.respawnHp, maxHp)
        const respawnPosition = cloneVec3(lastCheckpoint)

        set(
          {
            position: respawnPosition,
            hp: respawnHp,
            isAlive: true,
            isSitting: false,
            isCoding: false,
            currentZone: getZoneAtPosition(respawnPosition),
            mode: 'roaming',
          },
          false,
          'player/respawn'
        )
      },

      // ── Mode ────────────────────────────────────────────────────────────────

      setMode: (mode) => {
        set(
          {
            mode,
            isSitting: mode === 'sitting' || mode === 'focus-coding',
            isCoding: mode === 'focus-coding',
            isAlive: mode === 'dead' ? false : get().isAlive,
          },
          false,
          'player/setMode'
        )
      },

      setSitting: (value) => {
        set(
          {
            isSitting: value,
            isCoding: value ? get().isCoding : false,
            mode: value ? 'sitting' : 'roaming',
          },
          false,
          'player/setSitting'
        )
      },

      setCoding: (value) => {
        set(
          {
            isCoding: value,
            isSitting: value ? true : get().isSitting,
            mode: value ? 'focus-coding' : get().isSitting ? 'sitting' : 'roaming',
          },
          false,
          'player/setCoding'
        )
      },

      exitSeat: () => {
        set(
          {
            isSitting: false,
            isCoding: false,
            mode: 'roaming',
          },
          false,
          'player/exitSeat'
        )
      },

      exitCoding: () => {
        set(
          {
            isCoding: false,
            isSitting: true,
            mode: 'sitting',
          },
          false,
          'player/exitCoding'
        )
      },

      // ── Reset ───────────────────────────────────────────────────────────────

      resetPlayer: () => {
        set(createInitialPlayerState(), false, 'player/reset')
      },
    }),
    {
      name: 'PlayerStore',
    }
  )
)

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectPlayerPosition = (state: PlayerStore) => state.position
export const selectPlayerRotation = (state: PlayerStore) => state.rotation
export const selectPlayerHp = (state: PlayerStore) => state.hp
export const selectPlayerMaxHp = (state: PlayerStore) => state.maxHp
export const selectPlayerIsAlive = (state: PlayerStore) => state.isAlive
export const selectPlayerZone = (state: PlayerStore) => state.currentZone
export const selectPlayerMode = (state: PlayerStore) => state.mode
export const selectPlayerIsSitting = (state: PlayerStore) => state.isSitting
export const selectPlayerIsCoding = (state: PlayerStore) => state.isCoding
export const selectLastCheckpoint = (state: PlayerStore) => state.lastCheckpoint
export const selectPlayerCanMove = (state: PlayerStore) =>
  state.isAlive && state.mode === 'roaming'
export const selectPlayerCanInteract = (state: PlayerStore) =>
  state.isAlive && state.mode !== 'dead'
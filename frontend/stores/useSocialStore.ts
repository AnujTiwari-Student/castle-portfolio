// frontend/stores/useSocialStore.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { SocialLink } from '@/types'
import {
  getSocialLinkByFloor,
  getSocialLinksOrdered,
  isRoofFloor,
  isValidElevatorFloor,
  isValidSocialFloor,
  SOCIAL_FLOOR_MAX,
  SOCIAL_FLOOR_MIN,
  SOCIAL_ROOF_FLOOR,
} from '@/data/social'

// ─── Elevator Types ───────────────────────────────────────────────────────────

export type ElevatorStatus =
  | 'idle'
  | 'doors-opening'
  | 'doors-open'
  | 'doors-closing'
  | 'doors-closed'
  | 'moving'

export type ParachuteStatus =
  | 'idle'
  | 'ready'
  | 'deployed'
  | 'landed'

// ─── State Shape ──────────────────────────────────────────────────────────────

export interface SocialStoreState {
  currentFloor: number
  targetFloor: number | null

  elevatorStatus: ElevatorStatus
  elevatorOpen: boolean
  elevatorMoving: boolean

  roofFloor: number
  roofAccessUnlocked: boolean

  parachuteStatus: ParachuteStatus
  parachuteDeployed: boolean
  parachuteLandingRequested: boolean

  lastVisitedSocialFloor: number
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

export interface SocialStoreActions {
  // Floor
  setCurrentFloor: (floor: number) => void
  setTargetFloor: (floor: number | null) => void
  moveToFloor: (floor: number) => void
  completeFloorMove: () => void

  // Elevator
  openElevatorDoors: () => void
  closeElevatorDoors: () => void
  startElevatorMove: (floor: number) => void
  cancelElevatorMove: () => void
  setElevatorStatus: (status: ElevatorStatus) => void

  // Roof
  goToRoof: () => void
  unlockRoofAccess: () => void
  lockRoofAccess: () => void

  // Parachute
  readyParachute: () => void
  deployParachute: () => void
  requestParachuteLanding: () => void
  completeParachuteLanding: () => void
  resetParachute: () => void

  // Helpers
  getCurrentSocialLink: () => SocialLink | undefined
  getTargetSocialLink: () => SocialLink | undefined
  isCurrentFloorRoof: () => boolean
  isCurrentFloorSocial: () => boolean

  // Reset
  resetSocialTower: () => void
}

export type SocialStore = SocialStoreState & SocialStoreActions

// ─── Initial State Factory ────────────────────────────────────────────────────

function createInitialSocialState(): SocialStoreState {
  return {
    currentFloor: SOCIAL_FLOOR_MIN,
    targetFloor: null,

    elevatorStatus: 'idle',
    elevatorOpen: false,
    elevatorMoving: false,

    roofFloor: SOCIAL_ROOF_FLOOR,
    roofAccessUnlocked: true,

    parachuteStatus: 'idle',
    parachuteDeployed: false,
    parachuteLandingRequested: false,

    lastVisitedSocialFloor: SOCIAL_FLOOR_MIN,
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clampToElevatorFloor(floor: number): number {
  if (isValidElevatorFloor(floor)) {
    return floor
  }

  if (floor < SOCIAL_FLOOR_MIN) {
    return SOCIAL_FLOOR_MIN
  }

  if (floor > SOCIAL_ROOF_FLOOR) {
    return SOCIAL_ROOF_FLOOR
  }

  return SOCIAL_FLOOR_MIN
}

function getSafeSocialFloor(floor: number): number {
  if (isValidSocialFloor(floor)) {
    return floor
  }

  return SOCIAL_FLOOR_MIN
}

// ─── Architecture Note ────────────────────────────────────────────────────────
//
// This store owns Social Tower state only:
// - elevator floor state
// - elevator door state
// - roof access state
// - parachute trigger state
//
// It does NOT own:
// - Anuj's physical position: usePlayerStore
// - actual elevator mesh animation: SocialTower/Elevator component
// - actual parachute physics: Parachute component
// - external URL modal state: future UI/modal store

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSocialStore = create<SocialStore>()(
  devtools(
    (set, get) => ({
      ...createInitialSocialState(),

      // ── Floor ───────────────────────────────────────────────────────────────

      setCurrentFloor: (floor) => {
        const safeFloor = clampToElevatorFloor(floor)

        set(
          {
            currentFloor: safeFloor,
            lastVisitedSocialFloor: isValidSocialFloor(safeFloor)
              ? safeFloor
              : get().lastVisitedSocialFloor,
          },
          false,
          'social/setCurrentFloor'
        )
      },

      setTargetFloor: (floor) => {
        set(
          {
            targetFloor: floor === null ? null : clampToElevatorFloor(floor),
          },
          false,
          'social/setTargetFloor'
        )
      },

      moveToFloor: (floor) => {
        const safeFloor = clampToElevatorFloor(floor)

        if (safeFloor === get().currentFloor) {
          set(
            {
              targetFloor: null,
              elevatorStatus: 'doors-open',
              elevatorOpen: true,
              elevatorMoving: false,
            },
            false,
            'social/moveToSameFloor'
          )
          return
        }

        get().startElevatorMove(safeFloor)
      },

      completeFloorMove: () => {
        const targetFloor = get().targetFloor

        if (targetFloor === null) {
          set(
            {
              elevatorStatus: 'idle',
              elevatorMoving: false,
            },
            false,
            'social/completeFloorMove/noTarget'
          )
          return
        }

        set(
          {
            currentFloor: targetFloor,
            targetFloor: null,
            elevatorStatus: 'doors-opening',
            elevatorMoving: false,
            elevatorOpen: false,
            lastVisitedSocialFloor: isValidSocialFloor(targetFloor)
              ? targetFloor
              : get().lastVisitedSocialFloor,
            parachuteStatus: isRoofFloor(targetFloor) ? 'ready' : get().parachuteStatus,
          },
          false,
          'social/completeFloorMove'
        )
      },

      // ── Elevator ────────────────────────────────────────────────────────────

      openElevatorDoors: () => {
        set(
          {
            elevatorStatus: 'doors-open',
            elevatorOpen: true,
            elevatorMoving: false,
          },
          false,
          'social/openElevatorDoors'
        )
      },

      closeElevatorDoors: () => {
        set(
          {
            elevatorStatus: 'doors-closed' as ElevatorStatus,
            elevatorOpen: false,
          },
          false,
          'social/closeElevatorDoors'
        )
      },

      startElevatorMove: (floor) => {
        const safeFloor = clampToElevatorFloor(floor)

        if (isRoofFloor(safeFloor) && !get().roofAccessUnlocked) {
          return
        }

        set(
          {
            targetFloor: safeFloor,
            elevatorStatus: 'moving',
            elevatorOpen: false,
            elevatorMoving: true,
          },
          false,
          'social/startElevatorMove'
        )
      },

      cancelElevatorMove: () => {
        set(
          {
            targetFloor: null,
            elevatorStatus: 'idle',
            elevatorMoving: false,
          },
          false,
          'social/cancelElevatorMove'
        )
      },

      setElevatorStatus: (status) => {
        set(
          {
            elevatorStatus: status,
            elevatorOpen: status === 'doors-open',
            elevatorMoving: status === 'moving',
          },
          false,
          'social/setElevatorStatus'
        )
      },

      // ── Roof ────────────────────────────────────────────────────────────────

      goToRoof: () => {
        if (!get().roofAccessUnlocked) {
          return
        }

        get().moveToFloor(SOCIAL_ROOF_FLOOR)
      },

      unlockRoofAccess: () => {
        set({ roofAccessUnlocked: true }, false, 'social/unlockRoofAccess')
      },

      lockRoofAccess: () => {
        set({ roofAccessUnlocked: false }, false, 'social/lockRoofAccess')
      },

      // ── Parachute ───────────────────────────────────────────────────────────

      readyParachute: () => {
        if (!isRoofFloor(get().currentFloor)) {
          return
        }

        set(
          {
            parachuteStatus: 'ready',
            parachuteDeployed: false,
            parachuteLandingRequested: false,
          },
          false,
          'social/readyParachute'
        )
      },

      deployParachute: () => {
        if (!isRoofFloor(get().currentFloor)) {
          return
        }

        set(
          {
            parachuteStatus: 'deployed',
            parachuteDeployed: true,
            parachuteLandingRequested: false,
          },
          false,
          'social/deployParachute'
        )
      },

      requestParachuteLanding: () => {
        set(
          {
            parachuteLandingRequested: true,
          },
          false,
          'social/requestParachuteLanding'
        )
      },

      completeParachuteLanding: () => {
        set(
          {
            currentFloor: getSafeSocialFloor(get().lastVisitedSocialFloor),
            targetFloor: null,
            elevatorStatus: 'idle',
            elevatorOpen: false,
            elevatorMoving: false,
            parachuteStatus: 'landed',
            parachuteDeployed: false,
            parachuteLandingRequested: false,
          },
          false,
          'social/completeParachuteLanding'
        )
      },

      resetParachute: () => {
        set(
          {
            parachuteStatus: 'idle',
            parachuteDeployed: false,
            parachuteLandingRequested: false,
          },
          false,
          'social/resetParachute'
        )
      },

      // ── Helpers ─────────────────────────────────────────────────────────────

      getCurrentSocialLink: () => {
        return getSocialLinkByFloor(get().currentFloor)
      },

      getTargetSocialLink: () => {
        const targetFloor = get().targetFloor
        return targetFloor === null ? undefined : getSocialLinkByFloor(targetFloor)
      },

      isCurrentFloorRoof: () => {
        return isRoofFloor(get().currentFloor)
      },

      isCurrentFloorSocial: () => {
        return isValidSocialFloor(get().currentFloor)
      },

      // ── Reset ───────────────────────────────────────────────────────────────

      resetSocialTower: () => {
        set(createInitialSocialState(), false, 'social/resetSocialTower')
      },
    }),
    {
      name: 'SocialStore',
    }
  )
)

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCurrentSocialFloor = (state: SocialStore) =>
  state.currentFloor

export const selectTargetSocialFloor = (state: SocialStore) =>
  state.targetFloor

export const selectElevatorStatus = (state: SocialStore) =>
  state.elevatorStatus

export const selectElevatorOpen = (state: SocialStore) =>
  state.elevatorOpen

export const selectElevatorMoving = (state: SocialStore) =>
  state.elevatorMoving

export const selectRoofFloor = (state: SocialStore) => state.roofFloor

export const selectRoofAccessUnlocked = (state: SocialStore) =>
  state.roofAccessUnlocked

export const selectParachuteStatus = (state: SocialStore) =>
  state.parachuteStatus

export const selectParachuteDeployed = (state: SocialStore) =>
  state.parachuteDeployed

export const selectParachuteLandingRequested = (state: SocialStore) =>
  state.parachuteLandingRequested

export const selectLastVisitedSocialFloor = (state: SocialStore) =>
  state.lastVisitedSocialFloor

export const selectCurrentSocialLink = (state: SocialStore) =>
  getSocialLinkByFloor(state.currentFloor)

export const selectTargetSocialLink = (state: SocialStore) =>
  state.targetFloor === null ? undefined : getSocialLinkByFloor(state.targetFloor)

export const selectSocialLinksOrdered = () => getSocialLinksOrdered()

export const selectIsCurrentFloorRoof = (state: SocialStore) =>
  isRoofFloor(state.currentFloor)

export const selectIsCurrentFloorSocial = (state: SocialStore) =>
  isValidSocialFloor(state.currentFloor)

export const selectCanUseParachute = (state: SocialStore) =>
  isRoofFloor(state.currentFloor) &&
  state.parachuteStatus === 'ready' &&
  !state.parachuteDeployed

export const selectCanMoveElevator = (state: SocialStore) =>
  !state.elevatorMoving && state.elevatorStatus !== 'moving'

export const selectSocialFloorBounds = () => ({
  min: SOCIAL_FLOOR_MIN,
  max: SOCIAL_FLOOR_MAX,
  roof: SOCIAL_ROOF_FLOOR,
})
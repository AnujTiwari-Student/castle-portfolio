// frontend/stores/useGameStore.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { CheatCode, GameState } from '@/types'

// ─── Cheat Registry ───────────────────────────────────────────────────────────
//
// All known cheat codes live here.
// Add new codes to this map only — never hardcode cheat strings in components.

export interface CheatDefinition {
  code: CheatCode
  aliases: string[]
  description: string
  successMessage: string
  effects: {
    disableEnemies?: boolean
    unlockResumeVault?: boolean
    bypassCitadelCombat?: boolean
  }
}

export const CHEAT_REGISTRY: Record<CheatCode, CheatDefinition> = {
  SKIPGANGSTERS: {
    code: 'SKIPGANGSTERS',
    aliases: ['SKIPGANGSTERS', 'SKIP-GANGSTERS', 'SKIP GANGSTERS'],
    description: 'Disable all Recruitment Gangster enemies in the Resume Citadel.',
    successMessage: 'GANGSTERS DISABLED. Resume Citadel combat bypassed.',
    effects: {
      disableEnemies: true,
      bypassCitadelCombat: true,
    },
  },
  'ANUJ-RESUME-2026': {
    code: 'ANUJ-RESUME-2026',
    aliases: ['ANUJ-RESUME-2026', 'RESUME', 'OPEN-RESUME', 'OPEN RESUME'],
    description: 'Unlock the Resume Vault directly without combat.',
    successMessage: 'VAULT ACCESS GRANTED. Resume interaction unlocked.',
    effects: {
      disableEnemies: true,
      unlockResumeVault: true,
      bypassCitadelCombat: true,
    },
  },
}

export const KNOWN_CHEAT_CODES = Object.keys(CHEAT_REGISTRY) as CheatCode[]

export const MAX_CONSOLE_HISTORY = 80

// ─── Console Entry ────────────────────────────────────────────────────────────

export type ConsoleEntryType = 'input' | 'success' | 'error' | 'system'

export interface ConsoleEntry {
  id: string
  type: ConsoleEntryType
  text: string
  timestamp: number
}

// ─── State Shape ──────────────────────────────────────────────────────────────

export interface GameStoreState extends GameState {
  consoleHistory: ConsoleEntry[]
  lastActivatedCheat: CheatCode | null
  activatedCheats: CheatCode[]

  // Resume Citadel global flags
  resumeVaultUnlocked: boolean
  citadelCombatBypassed: boolean
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

export interface GameStoreActions {
  // Cheat console
  openCheatConsole: () => void
  closeCheatConsole: () => void
  toggleCheatConsole: () => void

  // Cheat submission
  submitCheatCode: (input: string) => void
  activateCheat: (code: CheatCode) => void
  isCheatActive: (code: CheatCode) => boolean

  // Resume Citadel flags
  unlockResumeVault: () => void
  lockResumeVault: () => void
  disableEnemies: () => void
  enableEnemies: () => void
  bypassCitadelCombat: () => void

  // Console history
  pushConsoleEntry: (type: ConsoleEntryType, text: string) => void
  clearConsoleHistory: () => void
  resetConsoleBootMessages: () => void

  // Map
  openMap: () => void
  closeMap: () => void
  toggleMap: () => void

  // Reset
  resetGameState: () => void
}

export type GameStore = GameStoreState & GameStoreActions

// ─── Initial State Factory ────────────────────────────────────────────────────

function createBootConsoleHistory(): ConsoleEntry[] {
  const timestamp = Date.now()

  return [
    {
      id: `boot-${timestamp}-0`,
      type: 'system',
      text: 'CASTLE PORTFOLIO v1.0 — cheat terminal ready.',
      timestamp,
    },
    {
      id: `boot-${timestamp}-1`,
      type: 'system',
      text: 'Type a cheat code and press Enter.',
      timestamp,
    },
  ]
}

function createInitialGameState(): GameStoreState {
  return {
    cheatsActive: false,
    enemiesDisabled: false,
    currentCheat: null,
    mapOpen: false,
    cheatConsoleOpen: false,

    consoleHistory: createBootConsoleHistory(),
    lastActivatedCheat: null,
    activatedCheats: [],

    resumeVaultUnlocked: false,
    citadelCombatBypassed: false,
  }
}

// ─── Architecture Note ────────────────────────────────────────────────────────
//
// This store owns global game flags only:
// - cheat console open/close
// - active cheats
// - console history
// - city map overlay toggle
// - global Resume Citadel bypass/unlock flags
//
// It does NOT own:
// - Anuj HP or position: usePlayerStore
// - enemy mesh local animation state: Citadel components
// - Jio cabin state: useJioCabinStore later
// - Monkey location/state: useCompanionStore or useJioCabinStore later
// - experience timeline state: useExperienceStore later
// - social tower floor state: useSocialStore later

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeConsoleEntry(type: ConsoleEntryType, text: string): ConsoleEntry {
  return {
    id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    text,
    timestamp: Date.now(),
  }
}

function normalizeCheatInput(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, ' ')
}

function parseCheatCode(input: string): CheatCode | null {
  const normalizedInput = normalizeCheatInput(input)

  for (const cheat of Object.values(CHEAT_REGISTRY)) {
    const aliases = cheat.aliases.map((alias) => normalizeCheatInput(alias))

    if (aliases.includes(normalizedInput)) {
      return cheat.code
    }
  }

  return null
}

function limitConsoleHistory(history: ConsoleEntry[]): ConsoleEntry[] {
  if (history.length <= MAX_CONSOLE_HISTORY) {
    return history
  }

  return history.slice(history.length - MAX_CONSOLE_HISTORY)
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...createInitialGameState(),

      // ── Cheat Console ───────────────────────────────────────────────────────

      openCheatConsole: () => {
        set(
          {
            cheatConsoleOpen: true,
            mapOpen: false,
          },
          false,
          'game/openCheatConsole'
        )
      },

      closeCheatConsole: () => {
        set({ cheatConsoleOpen: false }, false, 'game/closeCheatConsole')
      },

      toggleCheatConsole: () => {
        const nextOpen = !get().cheatConsoleOpen

        set(
          {
            cheatConsoleOpen: nextOpen,
            mapOpen: nextOpen ? false : get().mapOpen,
          },
          false,
          'game/toggleCheatConsole'
        )
      },

      // ── Cheat Submission ────────────────────────────────────────────────────

      submitCheatCode: (input) => {
        const trimmed = input.trim()

        if (!trimmed) {
          return
        }

        get().pushConsoleEntry('input', `> ${trimmed}`)

        const code = parseCheatCode(trimmed)

        if (!code) {
          get().pushConsoleEntry('error', `Unknown code: "${trimmed}"`)
          return
        }

        if (get().activatedCheats.includes(code)) {
          get().pushConsoleEntry('system', `${code} already active.`)
          return
        }

        get().activateCheat(code)
      },

      activateCheat: (code) => {
        const cheat = CHEAT_REGISTRY[code]

        if (!cheat) {
          get().pushConsoleEntry('error', `Cheat not registered: ${code}`)
          return
        }

        const activatedCheats = Array.from(
          new Set([...get().activatedCheats, code])
        )

        set(
          {
            cheatsActive: true,
            currentCheat: code,
            lastActivatedCheat: code,
            activatedCheats,

            enemiesDisabled: cheat.effects.disableEnemies
              ? true
              : get().enemiesDisabled,

            resumeVaultUnlocked: cheat.effects.unlockResumeVault
              ? true
              : get().resumeVaultUnlocked,

            citadelCombatBypassed: cheat.effects.bypassCitadelCombat
              ? true
              : get().citadelCombatBypassed,
          },
          false,
          'game/activateCheat'
        )

        get().pushConsoleEntry('success', cheat.successMessage)
      },

      isCheatActive: (code) => {
        return get().activatedCheats.includes(code)
      },

      // ── Resume Citadel Flags ────────────────────────────────────────────────

      unlockResumeVault: () => {
        set(
          {
            resumeVaultUnlocked: true,
          },
          false,
          'game/unlockResumeVault'
        )
      },

      lockResumeVault: () => {
        set(
          {
            resumeVaultUnlocked: false,
          },
          false,
          'game/lockResumeVault'
        )
      },

      disableEnemies: () => {
        set(
          {
            enemiesDisabled: true,
          },
          false,
          'game/disableEnemies'
        )
      },

      enableEnemies: () => {
        set(
          {
            enemiesDisabled: false,
          },
          false,
          'game/enableEnemies'
        )
      },

      bypassCitadelCombat: () => {
        set(
          {
            enemiesDisabled: true,
            resumeVaultUnlocked: true,
            citadelCombatBypassed: true,
          },
          false,
          'game/bypassCitadelCombat'
        )
      },

      // ── Console History ─────────────────────────────────────────────────────

      pushConsoleEntry: (type, text) => {
        const entry = makeConsoleEntry(type, text)

        set(
          {
            consoleHistory: limitConsoleHistory([
              ...get().consoleHistory,
              entry,
            ]),
          },
          false,
          'game/pushConsoleEntry'
        )
      },

      clearConsoleHistory: () => {
        set({ consoleHistory: [] }, false, 'game/clearConsoleHistory')
      },

      resetConsoleBootMessages: () => {
        set(
          {
            consoleHistory: createBootConsoleHistory(),
          },
          false,
          'game/resetConsoleBootMessages'
        )
      },

      // ── Map ─────────────────────────────────────────────────────────────────

      openMap: () => {
        set(
          {
            mapOpen: true,
            cheatConsoleOpen: false,
          },
          false,
          'game/openMap'
        )
      },

      closeMap: () => {
        set({ mapOpen: false }, false, 'game/closeMap')
      },

      toggleMap: () => {
        const nextOpen = !get().mapOpen

        set(
          {
            mapOpen: nextOpen,
            cheatConsoleOpen: nextOpen ? false : get().cheatConsoleOpen,
          },
          false,
          'game/toggleMap'
        )
      },

      // ── Reset ───────────────────────────────────────────────────────────────

      resetGameState: () => {
        set(createInitialGameState(), false, 'game/reset')
      },
    }),
    {
      name: 'GameStore',
    }
  )
)

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCheatConsoleOpen = (state: GameStore) =>
  state.cheatConsoleOpen

export const selectMapOpen = (state: GameStore) => state.mapOpen

export const selectCheatsActive = (state: GameStore) => state.cheatsActive

export const selectEnemiesDisabled = (state: GameStore) =>
  state.enemiesDisabled

export const selectResumeVaultUnlocked = (state: GameStore) =>
  state.resumeVaultUnlocked

export const selectCitadelCombatBypassed = (state: GameStore) =>
  state.citadelCombatBypassed

export const selectActivatedCheats = (state: GameStore) =>
  state.activatedCheats

export const selectLastActivatedCheat = (state: GameStore) =>
  state.lastActivatedCheat

export const selectConsoleHistory = (state: GameStore) =>
  state.consoleHistory

export const selectCurrentCheat = (state: GameStore) => state.currentCheat

export const selectIsCheatActive = (code: CheatCode) => (state: GameStore) =>
  state.activatedCheats.includes(code)
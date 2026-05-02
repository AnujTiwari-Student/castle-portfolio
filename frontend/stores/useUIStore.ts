// frontend/stores/useUIStore.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// ─── Modal Types ──────────────────────────────────────────────────────────────

export type UIModalType =
  | 'timeline'
  | 'resume'
  | 'terminal'
  | 'url-launch'
  | 'music-player'
  | 'city-map'
  | 'cheat-console'
  | 'project-terminal'
  | 'jio-coding'
  | 'none'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export type DamageOverlayIntensity = 'light' | 'medium' | 'heavy'

export interface ToastMessage {
  id: string
  variant: ToastVariant
  title?: string
  message: string
  createdAt: number
  durationMs: number
}

export interface URLLaunchPayload {
  label: string
  url: string
  description?: string
}

export interface TerminalPayload {
  title: string
  subtitle?: string
  content?: string
}

export interface ResumeModalPayload {
  previewUrl?: string
  downloadUrl?: string
  title?: string
}

export interface TimelineModalPayload {
  initialSlideIndex?: number
}

export interface ProjectTerminalPayload {
  selectedProjectId?: string
}

export interface UIModalPayloadMap {
  timeline: TimelineModalPayload
  resume: ResumeModalPayload
  terminal: TerminalPayload
  'url-launch': URLLaunchPayload
  'music-player': Record<string, never>
  'city-map': Record<string, never>
  'cheat-console': Record<string, never>
  'project-terminal': ProjectTerminalPayload
  'jio-coding': Record<string, never>
  none: Record<string, never>
}

// ─── State Shape ──────────────────────────────────────────────────────────────

export interface UIStoreState {
  activeModal: UIModalType
  modalStack: UIModalType[]

  timelineModalPayload: TimelineModalPayload | null
  resumeModalPayload: ResumeModalPayload | null
  terminalPayload: TerminalPayload | null
  urlLaunchPayload: URLLaunchPayload | null
  projectTerminalPayload: ProjectTerminalPayload | null

  hudVisible: boolean
  controlsVisible: boolean
  interactionPromptVisible: boolean
  interactionPromptText: string

  damageOverlayVisible: boolean
  damageOverlayIntensity: DamageOverlayIntensity

  toasts: ToastMessage[]
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

export interface UIStoreActions {
  // Generic modal
  openModal: (modal: UIModalType) => void
  closeModal: () => void
  closeAllModals: () => void
  pushModal: (modal: UIModalType) => void
  popModal: () => void

  // Specific modals
  openTimelineModal: (payload?: TimelineModalPayload) => void
  openResumeModal: (payload?: ResumeModalPayload) => void
  openTerminalModal: (payload: TerminalPayload) => void
  openURLLaunchModal: (payload: URLLaunchPayload) => void
  openMusicPlayer: () => void
  openCityMap: () => void
  openCheatConsole: () => void
  openProjectTerminal: (payload?: ProjectTerminalPayload) => void
  openJioCodingOverlay: () => void

  // Payload clear
  clearModalPayloads: () => void

  // HUD
  showHUD: () => void
  hideHUD: () => void
  setHUDVisible: (visible: boolean) => void

  // Controls
  showControls: () => void
  hideControls: () => void
  toggleControls: () => void

  // Interaction prompt
  showInteractionPrompt: (text: string) => void
  hideInteractionPrompt: () => void
  setInteractionPrompt: (text: string) => void

  // Damage overlay
  showDamageOverlay: (intensity?: DamageOverlayIntensity) => void
  hideDamageOverlay: () => void

  // Toasts
  pushToast: (
    message: string,
    options?: {
      title?: string
      variant?: ToastVariant
      durationMs?: number
    }
  ) => void
  removeToast: (id: string) => void
  clearToasts: () => void

  // Reset
  resetUI: () => void
}

export type UIStore = UIStoreState & UIStoreActions

// ─── Constants ────────────────────────────────────────────────────────────────

export const DEFAULT_TOAST_DURATION_MS = 3500

export const MAX_TOASTS = 5

// ─── Initial State Factory ────────────────────────────────────────────────────

function createInitialUIState(): UIStoreState {
  return {
    activeModal: 'none',
    modalStack: [],

    timelineModalPayload: null,
    resumeModalPayload: null,
    terminalPayload: null,
    urlLaunchPayload: null,
    projectTerminalPayload: null,

    hudVisible: true,
    controlsVisible: false,
    interactionPromptVisible: false,
    interactionPromptText: '',

    damageOverlayVisible: false,
    damageOverlayIntensity: 'light',

    toasts: [],
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeToast(
  message: string,
  options?: {
    title?: string
    variant?: ToastVariant
    durationMs?: number
  }
): ToastMessage {
  return {
    id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: options?.title,
    message,
    variant: options?.variant ?? 'info',
    durationMs: options?.durationMs ?? DEFAULT_TOAST_DURATION_MS,
    createdAt: Date.now(),
  }
}

function limitToasts(toasts: ToastMessage[]): ToastMessage[] {
  if (toasts.length <= MAX_TOASTS) {
    return toasts
  }

  return toasts.slice(toasts.length - MAX_TOASTS)
}

// ─── Architecture Note ────────────────────────────────────────────────────────
//
// This store owns UI display state only.
//
// It owns:
// - which modal/overlay is active
// - modal payloads
// - HUD visibility
// - controls overlay visibility
// - interaction prompt text
// - damage overlay state
// - toast messages
//
// It does NOT own:
// - player HP or position
// - cheat activation logic
// - experience timeline state
// - Jio coding loop state
// - project filtering state
// - music playback state
//
// Components should use this store to show/hide UI.
// Gameplay stores should own gameplay state.

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      ...createInitialUIState(),

      // ── Generic Modal ───────────────────────────────────────────────────────

      openModal: (modal) => {
        set(
          {
            activeModal: modal,
          },
          false,
          'ui/openModal'
        )
      },

      closeModal: () => {
        set(
          {
            activeModal: 'none',
          },
          false,
          'ui/closeModal'
        )
      },

      closeAllModals: () => {
        set(
          {
            activeModal: 'none',
            modalStack: [],
          },
          false,
          'ui/closeAllModals'
        )
      },

      pushModal: (modal) => {
        const current = get().activeModal

        set(
          {
            modalStack: current === 'none'
              ? get().modalStack
              : [...get().modalStack, current],
            activeModal: modal,
          },
          false,
          'ui/pushModal'
        )
      },

      popModal: () => {
        const stack = get().modalStack

        if (stack.length === 0) {
          set(
            {
              activeModal: 'none',
            },
            false,
            'ui/popModal/empty'
          )
          return
        }

        const nextStack = stack.slice(0, -1)
        const previousModal = stack[stack.length - 1]

        set(
          {
            activeModal: previousModal,
            modalStack: nextStack,
          },
          false,
          'ui/popModal'
        )
      },

      // ── Specific Modals ─────────────────────────────────────────────────────

      openTimelineModal: (payload = {}) => {
        set(
          {
            activeModal: 'timeline',
            timelineModalPayload: payload,
          },
          false,
          'ui/openTimelineModal'
        )
      },

      openResumeModal: (payload = {}) => {
        set(
          {
            activeModal: 'resume',
            resumeModalPayload: payload,
          },
          false,
          'ui/openResumeModal'
        )
      },

      openTerminalModal: (payload) => {
        set(
          {
            activeModal: 'terminal',
            terminalPayload: payload,
          },
          false,
          'ui/openTerminalModal'
        )
      },

      openURLLaunchModal: (payload) => {
        set(
          {
            activeModal: 'url-launch',
            urlLaunchPayload: payload,
          },
          false,
          'ui/openURLLaunchModal'
        )
      },

      openMusicPlayer: () => {
        set(
          {
            activeModal: 'music-player',
          },
          false,
          'ui/openMusicPlayer'
        )
      },

      openCityMap: () => {
        set(
          {
            activeModal: 'city-map',
          },
          false,
          'ui/openCityMap'
        )
      },

      openCheatConsole: () => {
        set(
          {
            activeModal: 'cheat-console',
          },
          false,
          'ui/openCheatConsole'
        )
      },

      openProjectTerminal: (payload = {}) => {
        set(
          {
            activeModal: 'project-terminal',
            projectTerminalPayload: payload,
          },
          false,
          'ui/openProjectTerminal'
        )
      },

      openJioCodingOverlay: () => {
        set(
          {
            activeModal: 'jio-coding',
          },
          false,
          'ui/openJioCodingOverlay'
        )
      },

      clearModalPayloads: () => {
        set(
          {
            timelineModalPayload: null,
            resumeModalPayload: null,
            terminalPayload: null,
            urlLaunchPayload: null,
            projectTerminalPayload: null,
          },
          false,
          'ui/clearModalPayloads'
        )
      },

      // ── HUD ─────────────────────────────────────────────────────────────────

      showHUD: () => {
        set({ hudVisible: true }, false, 'ui/showHUD')
      },

      hideHUD: () => {
        set({ hudVisible: false }, false, 'ui/hideHUD')
      },

      setHUDVisible: (visible) => {
        set({ hudVisible: visible }, false, 'ui/setHUDVisible')
      },

      // ── Controls ────────────────────────────────────────────────────────────

      showControls: () => {
        set({ controlsVisible: true }, false, 'ui/showControls')
      },

      hideControls: () => {
        set({ controlsVisible: false }, false, 'ui/hideControls')
      },

      toggleControls: () => {
        set(
          {
            controlsVisible: !get().controlsVisible,
          },
          false,
          'ui/toggleControls'
        )
      },

      // ── Interaction Prompt ──────────────────────────────────────────────────

      showInteractionPrompt: (text) => {
        set(
          {
            interactionPromptVisible: true,
            interactionPromptText: text,
          },
          false,
          'ui/showInteractionPrompt'
        )
      },

      hideInteractionPrompt: () => {
        set(
          {
            interactionPromptVisible: false,
            interactionPromptText: '',
          },
          false,
          'ui/hideInteractionPrompt'
        )
      },

      setInteractionPrompt: (text) => {
        set(
          {
            interactionPromptText: text,
            interactionPromptVisible: Boolean(text.trim()),
          },
          false,
          'ui/setInteractionPrompt'
        )
      },

      // ── Damage Overlay ──────────────────────────────────────────────────────

      showDamageOverlay: (intensity = 'light') => {
        set(
          {
            damageOverlayVisible: true,
            damageOverlayIntensity: intensity,
          },
          false,
          'ui/showDamageOverlay'
        )
      },

      hideDamageOverlay: () => {
        set(
          {
            damageOverlayVisible: false,
            damageOverlayIntensity: 'light',
          },
          false,
          'ui/hideDamageOverlay'
        )
      },

      // ── Toasts ──────────────────────────────────────────────────────────────

      pushToast: (message, options) => {
        const toast = makeToast(message, options)

        set(
          {
            toasts: limitToasts([...get().toasts, toast]),
          },
          false,
          'ui/pushToast'
        )
      },

      removeToast: (id) => {
        set(
          {
            toasts: get().toasts.filter((toast) => toast.id !== id),
          },
          false,
          'ui/removeToast'
        )
      },

      clearToasts: () => {
        set({ toasts: [] }, false, 'ui/clearToasts')
      },

      // ── Reset ───────────────────────────────────────────────────────────────

      resetUI: () => {
        set(createInitialUIState(), false, 'ui/resetUI')
      },
    }),
    {
      name: 'UIStore',
    }
  )
)

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectActiveModal = (state: UIStore) => state.activeModal

export const selectModalStack = (state: UIStore) => state.modalStack

export const selectTimelineModalPayload = (state: UIStore) =>
  state.timelineModalPayload

export const selectResumeModalPayload = (state: UIStore) =>
  state.resumeModalPayload

export const selectTerminalPayload = (state: UIStore) => state.terminalPayload

export const selectURLLaunchPayload = (state: UIStore) =>
  state.urlLaunchPayload

export const selectProjectTerminalPayload = (state: UIStore) =>
  state.projectTerminalPayload

export const selectHUDVisible = (state: UIStore) => state.hudVisible

export const selectControlsVisible = (state: UIStore) =>
  state.controlsVisible

export const selectInteractionPromptVisible = (state: UIStore) =>
  state.interactionPromptVisible

export const selectInteractionPromptText = (state: UIStore) =>
  state.interactionPromptText

export const selectDamageOverlayVisible = (state: UIStore) =>
  state.damageOverlayVisible

export const selectDamageOverlayIntensity = (state: UIStore) =>
  state.damageOverlayIntensity

export const selectToasts = (state: UIStore) => state.toasts

export const selectIsModalOpen = (modal: UIModalType) => (state: UIStore) =>
  state.activeModal === modal

export const selectAnyModalOpen = (state: UIStore) =>
  state.activeModal !== 'none'
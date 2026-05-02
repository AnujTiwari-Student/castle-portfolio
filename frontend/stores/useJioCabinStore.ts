// frontend/stores/useJioCabinStore.ts

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { JioCabinState, Vec3 } from "@/types";
import { JIO_BUILDING } from "@/lib/constants";
import { useCompanionStore } from "@/stores/useCompanionStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { JIO_WORK_SNIPPET_FALLBACK } from '@/data/snippets'

// ─── Mock Snippet Fallback ────────────────────────────────────────────────────
//
// Frontend-first fallback.
// Later this should come from:
// GET /api/snippets/jio-work
//
// Backend file:
// backend/public/snippets/jio_work.go

export const DEFAULT_JIO_WORK_SNIPPET = JIO_WORK_SNIPPET_FALLBACK

// ─── Jio Cabin Types ──────────────────────────────────────────────────────────

export type JioPortalDirection = "city-to-cabin" | "cabin-to-city" | null;

export type JioTransitionPhase =
  | "idle"
  | "fade-out"
  | "switching-scene"
  | "fade-in";

export type JioSnippetStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error"
  | "fallback";

export interface JioCabinStoreState extends JioCabinState {
  portalDirection: JioPortalDirection;
  transitionPhase: JioTransitionPhase;

  cityReturnSpawnPoint: Vec3;
  cabinSpawnPoint: Vec3;

  snippetStatus: JioSnippetStatus;
  snippet: string;
  snippetError: string | null;

  typedCharCount: number;
  typingSpeedCharsPerSecond: number;

  focusStartedAt: number | null;
  codingStartedAt: number | null;
  lastTransitionAt: number | null;
}

export interface JioCabinStoreActions {
  // Portal lifecycle
  beginEnterCabin: () => void;
  completeEnterCabin: () => void;
  beginExitCabin: () => void;
  completeExitCabin: () => void;
  setTransitionPhase: (phase: JioTransitionPhase) => void;
  cancelTransition: () => void;

  // Focus mode
  enterFocusMode: () => void;
  exitFocusMode: () => void;

  // Coding loop
  startCodingLoop: () => Promise<void>;
  stopCodingLoop: () => void;

  // Snippet
  loadSnippet: () => Promise<void>;
  setSnippet: (snippet: string) => void;
  useFallbackSnippet: (reason?: string) => void;
  clearSnippetError: () => void;

  // Typing animation state
  setTypedCharCount: (count: number) => void;
  incrementTypedCharCount: (amount?: number) => void;
  resetTyping: () => void;
  completeTyping: () => void;

  // Helpers
  getVisibleSnippet: () => string;
  getTypedSnippet: () => string;
  isSnippetFullyTyped: () => boolean;

  // Reset
  resetJioCabin: () => void;
}

export type JioCabinStore = JioCabinStoreState & JioCabinStoreActions;

// ─── Initial State Factory ────────────────────────────────────────────────────

function createInitialJioCabinState(): JioCabinStoreState {
  return {
    isInsideCabin: false,
    isTransitioning: false,
    isFocusMode: false,
    isCodingLoopActive: false,
    monkeyLocation: "shoulder",

    portalDirection: null,
    transitionPhase: "idle",

    cityReturnSpawnPoint: JIO_BUILDING.citySpawnPoint,
    cabinSpawnPoint: JIO_BUILDING.cabinSpawnPoint,

    snippetStatus: "fallback",
    snippet: DEFAULT_JIO_WORK_SNIPPET,
    snippetError: null,

    typedCharCount: 0,
    typingSpeedCharsPerSecond: 42,

    focusStartedAt: null,
    codingStartedAt: null,
    lastTransitionAt: null,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function clampTypedCharCount(count: number, snippet: string): number {
  return Math.max(0, Math.min(count, snippet.length));
}

async function fetchJioSnippet(): Promise<string> {
  if (!isBrowser()) {
    throw new Error("Snippet fetch is only available in the browser runtime.");
  }

  const response = await fetch(JIO_BUILDING.snippet.backendEndpoint, {
    method: "GET",
    headers: {
      Accept: "text/plain, application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Snippet request failed with status ${response.status}.`);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = (await response.json()) as { code?: string };

    if (!json.code) {
      throw new Error("Snippet JSON response did not include a code field.");
    }

    return json.code;
  }

  return response.text();
}

// ─── Architecture Note ────────────────────────────────────────────────────────
//
// This store coordinates high-level Jio Cabin state only.
//
// It owns:
// - inside/outside cabin state
// - portal transition state
// - Focus Mode state
// - coding loop state
// - snippet loading/fallback state
// - typed character progress
//
// It coordinates with:
// - usePlayerStore for Anuj sitting/coding mode
// - useCompanionStore for Monkey shoulder/monitor behavior
//
// It does NOT own:
// - actual fade overlay rendering
// - 3D scene visibility
// - mesh animation
// - camera interpolation
// - dashboard visual animation
//
// Future components should read this store and perform visuals.

// ─── Store ────────────────────────────────────────────────────────────────────

export const useJioCabinStore = create<JioCabinStore>()(
  devtools(
    (set, get) => ({
      ...createInitialJioCabinState(),

      // ── Portal Lifecycle ────────────────────────────────────────────────────

      beginEnterCabin: () => {
        set(
          {
            isTransitioning: true,
            portalDirection: "city-to-cabin",
            transitionPhase: "fade-out",
            lastTransitionAt: Date.now(),
          },
          false,
          "jioCabin/beginEnterCabin",
        );
      },

      completeEnterCabin: () => {
        const cabinSpawnPoint = get().cabinSpawnPoint;

        usePlayerStore.getState().teleportTo(cabinSpawnPoint);

        set(
          {
            isInsideCabin: true,
            isTransitioning: false,
            portalDirection: null,
            transitionPhase: "idle",
            lastTransitionAt: Date.now(),
          },
          false,
          "jioCabin/completeEnterCabin",
        );
      },

      beginExitCabin: () => {
        set(
          {
            isTransitioning: true,
            portalDirection: "cabin-to-city",
            transitionPhase: "fade-out",
            isFocusMode: false,
            isCodingLoopActive: false,
            lastTransitionAt: Date.now(),
          },
          false,
          "jioCabin/beginExitCabin",
        );

        usePlayerStore.getState().exitSeat();
        useCompanionStore.getState().exitCodingMode();
      },

      completeExitCabin: () => {
        const cityReturnSpawnPoint = get().cityReturnSpawnPoint;

        usePlayerStore.getState().teleportTo(cityReturnSpawnPoint);
        useCompanionStore.getState().moveToShoulder();

        set(
          {
            isInsideCabin: false,
            isTransitioning: false,
            isFocusMode: false,
            isCodingLoopActive: false,
            monkeyLocation: "shoulder",
            portalDirection: null,
            transitionPhase: "idle",
            typedCharCount: 0,
            focusStartedAt: null,
            codingStartedAt: null,
            lastTransitionAt: Date.now(),
          },
          false,
          "jioCabin/completeExitCabin",
        );
      },

      setTransitionPhase: (phase) => {
        set(
          {
            transitionPhase: phase,
            lastTransitionAt: Date.now(),
          },
          false,
          "jioCabin/setTransitionPhase",
        );
      },

      cancelTransition: () => {
        set(
          {
            isTransitioning: false,
            portalDirection: null,
            transitionPhase: "idle",
          },
          false,
          "jioCabin/cancelTransition",
        );
      },

      // ── Focus Mode ──────────────────────────────────────────────────────────

      enterFocusMode: () => {
        if (!get().isInsideCabin) {
          return;
        }

        usePlayerStore.getState().setCoding(true);

        set(
          {
            isFocusMode: true,
            focusStartedAt: Date.now(),
          },
          false,
          "jioCabin/enterFocusMode",
        );
      },

      exitFocusMode: () => {
        usePlayerStore.getState().exitCoding();
        useCompanionStore.getState().exitCodingMode();

        set(
          {
            isFocusMode: false,
            isCodingLoopActive: false,
            monkeyLocation: "shoulder",
            focusStartedAt: null,
            codingStartedAt: null,
          },
          false,
          "jioCabin/exitFocusMode",
        );
      },

      // ── Coding Loop ─────────────────────────────────────────────────────────

      startCodingLoop: async () => {
        if (!get().isInsideCabin) {
          return;
        }

        get().enterFocusMode();

        set(
          {
            isCodingLoopActive: true,
            monkeyLocation: "monitor",
            codingStartedAt: Date.now(),
            typedCharCount: 0,
          },
          false,
          "jioCabin/startCodingLoop",
        );

        useCompanionStore.getState().enterCodingMode();

        await get().loadSnippet();
      },

      stopCodingLoop: () => {
        usePlayerStore.getState().exitCoding();
        useCompanionStore.getState().exitCodingMode();

        set(
          {
            isCodingLoopActive: false,
            isFocusMode: false,
            monkeyLocation: "shoulder",
            codingStartedAt: null,
            focusStartedAt: null,
          },
          false,
          "jioCabin/stopCodingLoop",
        );
      },

      // ── Snippet ─────────────────────────────────────────────────────────────

      loadSnippet: async () => {
        set(
          {
            snippetStatus: "loading",
            snippetError: null,
          },
          false,
          "jioCabin/loadSnippet/start",
        );

        try {
          const snippet = await fetchJioSnippet();

          set(
            {
              snippet,
              snippetStatus: "ready",
              snippetError: null,
              typedCharCount: 0,
            },
            false,
            "jioCabin/loadSnippet/success",
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Unknown snippet loading error.";

          get().useFallbackSnippet(message);
        }
      },

      setSnippet: (snippet) => {
        set(
          {
            snippet,
            snippetStatus: "ready",
            snippetError: null,
            typedCharCount: 0,
          },
          false,
          "jioCabin/setSnippet",
        );
      },

      useFallbackSnippet: (reason = "Backend snippet unavailable.") => {
        set(
          {
            snippet: DEFAULT_JIO_WORK_SNIPPET,
            snippetStatus: "fallback",
            snippetError: reason,
            typedCharCount: 0,
          },
          false,
          "jioCabin/useFallbackSnippet",
        );
      },

      clearSnippetError: () => {
        set(
          {
            snippetError: null,
          },
          false,
          "jioCabin/clearSnippetError",
        );
      },

      // ── Typing Animation State ──────────────────────────────────────────────

      setTypedCharCount: (count) => {
        set(
          {
            typedCharCount: clampTypedCharCount(count, get().snippet),
          },
          false,
          "jioCabin/setTypedCharCount",
        );
      },

      incrementTypedCharCount: (amount = 1) => {
        const nextCount = get().typedCharCount + Math.max(0, amount);

        set(
          {
            typedCharCount: clampTypedCharCount(nextCount, get().snippet),
          },
          false,
          "jioCabin/incrementTypedCharCount",
        );
      },

      resetTyping: () => {
        set(
          {
            typedCharCount: 0,
          },
          false,
          "jioCabin/resetTyping",
        );
      },

      completeTyping: () => {
        set(
          {
            typedCharCount: get().snippet.length,
          },
          false,
          "jioCabin/completeTyping",
        );
      },

      // ── Helpers ─────────────────────────────────────────────────────────────

      getVisibleSnippet: () => {
        return get().snippet;
      },

      getTypedSnippet: () => {
        const { snippet, typedCharCount } = get();
        return snippet.slice(0, clampTypedCharCount(typedCharCount, snippet));
      },

      isSnippetFullyTyped: () => {
        return get().typedCharCount >= get().snippet.length;
      },

      // ── Reset ───────────────────────────────────────────────────────────────

      resetJioCabin: () => {
        useCompanionStore.getState().moveToShoulder();

        set(createInitialJioCabinState(), false, "jioCabin/resetJioCabin");
      },
    }),
    {
      name: "JioCabinStore",
    },
  ),
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectIsInsideJioCabin = (state: JioCabinStore) =>
  state.isInsideCabin;

export const selectJioCabinTransitioning = (state: JioCabinStore) =>
  state.isTransitioning;

export const selectJioPortalDirection = (state: JioCabinStore) =>
  state.portalDirection;

export const selectJioTransitionPhase = (state: JioCabinStore) =>
  state.transitionPhase;

export const selectJioFocusMode = (state: JioCabinStore) => state.isFocusMode;

export const selectJioCodingLoopActive = (state: JioCabinStore) =>
  state.isCodingLoopActive;

export const selectJioMonkeyLocation = (state: JioCabinStore) =>
  state.monkeyLocation;

export const selectJioSnippetStatus = (state: JioCabinStore) =>
  state.snippetStatus;

export const selectJioSnippet = (state: JioCabinStore) => state.snippet;

export const selectJioSnippetError = (state: JioCabinStore) =>
  state.snippetError;

export const selectJioTypedCharCount = (state: JioCabinStore) =>
  state.typedCharCount;

export const selectJioTypedSnippet = (state: JioCabinStore) =>
  state.snippet.slice(0, state.typedCharCount);

export const selectJioTypingProgress = (state: JioCabinStore) => {
  if (state.snippet.length === 0) {
    return 1;
  }

  return Math.min(1, state.typedCharCount / state.snippet.length);
};

export const selectJioSnippetFullyTyped = (state: JioCabinStore) =>
  state.typedCharCount >= state.snippet.length;

export const selectJioCityReturnSpawnPoint = (state: JioCabinStore) =>
  state.cityReturnSpawnPoint;

export const selectJioCabinSpawnPoint = (state: JioCabinStore) =>
  state.cabinSpawnPoint;

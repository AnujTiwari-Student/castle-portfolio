"use client";
import { create } from "zustand";

export type RoomId = "courtyard" | "forge" | "library" | "lookout";

interface GameState {
  currentRoom: RoomId;
  nearbyProject: string | null;
  openedProject: string | null;
  isPaused: boolean;
  setRoom: (r: RoomId) => void;
  setNearbyProject: (slug: string | null) => void;
  openProject: (slug: string | null) => void;
  setPaused: (p: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentRoom: "courtyard",
  nearbyProject: null,
  openedProject: null,
  isPaused: false,
  setRoom: (r) => set({ currentRoom: r }),
  setNearbyProject: (slug) => set({ nearbyProject: slug }),
  openProject: (slug) => set({ openedProject: slug, isPaused: slug !== null }),
  setPaused: (p) => set({ isPaused: p }),
}));

"use client";
import { useEffect, useRef } from "react";

export type Controls = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  interact: boolean;
};

const keyMap: Record<string, keyof Controls> = {
  KeyW: "forward", ArrowUp: "forward",
  KeyS: "backward", ArrowDown: "backward",
  KeyA: "left", ArrowLeft: "left",
  KeyD: "right", ArrowRight: "right",
  Space: "jump",
  KeyE: "interact",
};

export function useKeyboard() {
  const controls = useRef<Controls>({
    forward: false, backward: false, left: false,
    right: false, jump: false, interact: false,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const action = keyMap[e.code];
      if (action) controls.current[action] = true;
    };
    const up = (e: KeyboardEvent) => {
      const action = keyMap[e.code];
      if (action) controls.current[action] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return controls;
}

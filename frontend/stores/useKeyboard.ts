// frontend/hooks/useKeyboard.ts

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CONTROLS } from '@/lib/constants'

// ─── Types ────────────────────────────────────────────────────────────────────

export type KeyboardAction =
  | 'moveForward'
  | 'moveBackward'
  | 'moveLeft'
  | 'moveRight'
  | 'jump'
  | 'sprint'
  | 'interact'
  | 'openMap'
  | 'cheatConsole'
  | 'exitFocusMode'

export interface MovementInput {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  sprint: boolean
  jump: boolean
}

export interface MovementVector {
  x: number
  z: number
}

export interface KeyboardSnapshot {
  pressedKeys: ReadonlySet<string>

  movement: MovementInput
  movementVector: MovementVector

  interactPressed: boolean
  mapPressed: boolean
  cheatConsolePressed: boolean
  exitFocusModePressed: boolean

  isDown: (code: string) => boolean
  isActionDown: (action: KeyboardAction) => boolean
}

export interface UseKeyboardOptions {
  enabled?: boolean
  ignoreEditableTargets?: boolean
  preventDefaultForGameKeys?: boolean

  onInteract?: () => void
  onOpenMap?: () => void
  onToggleCheatConsole?: () => void
  onExitFocusMode?: () => void
  onJump?: () => void
}

type KeyMap = Record<KeyboardAction, readonly string[]>

// ─── Key Map ──────────────────────────────────────────────────────────────────

const KEY_MAP: KeyMap = {
  moveForward: CONTROLS.moveForward,
  moveBackward: CONTROLS.moveBackward,
  moveLeft: CONTROLS.moveLeft,
  moveRight: CONTROLS.moveRight,
  jump: CONTROLS.jump,
  sprint: CONTROLS.sprint,
  interact: CONTROLS.interact,
  openMap: CONTROLS.openMap,
  cheatConsole: CONTROLS.cheatConsole,
  exitFocusMode: CONTROLS.exitFocusMode,
}

const ALL_GAME_KEY_CODES = new Set(
  Object.values(KEY_MAP).flatMap((codes) => [...codes])
)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName.toLowerCase()

  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.isContentEditable
  )
}

function actionMatchesCode(action: KeyboardAction, code: string): boolean {
  return KEY_MAP[action].includes(code)
}

function isAnyActionDown(
  pressedKeys: ReadonlySet<string>,
  action: KeyboardAction
): boolean {
  return KEY_MAP[action].some((code) => pressedKeys.has(code))
}

function createMovementInput(pressedKeys: ReadonlySet<string>): MovementInput {
  return {
    forward: isAnyActionDown(pressedKeys, 'moveForward'),
    backward: isAnyActionDown(pressedKeys, 'moveBackward'),
    left: isAnyActionDown(pressedKeys, 'moveLeft'),
    right: isAnyActionDown(pressedKeys, 'moveRight'),
    sprint: isAnyActionDown(pressedKeys, 'sprint'),
    jump: isAnyActionDown(pressedKeys, 'jump'),
  }
}

function createMovementVector(movement: MovementInput): MovementVector {
  let x = 0
  let z = 0

  if (movement.left) x -= 1
  if (movement.right) x += 1
  if (movement.forward) z -= 1
  if (movement.backward) z += 1

  if (x === 0 && z === 0) {
    return { x: 0, z: 0 }
  }

  const length = Math.sqrt(x * x + z * z)

  return {
    x: x / length,
    z: z / length,
  }
}

function shouldHandleKeyboardEvent(
  event: KeyboardEvent,
  options: Required<
    Pick<
      UseKeyboardOptions,
      'enabled' | 'ignoreEditableTargets' | 'preventDefaultForGameKeys'
    >
  >
): boolean {
  if (!options.enabled) {
    return false
  }

  if (options.ignoreEditableTargets && isEditableTarget(event.target)) {
    return false
  }

  if (options.preventDefaultForGameKeys && ALL_GAME_KEY_CODES.has(event.code)) {
    event.preventDefault()
  }

  return true
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useKeyboard(options: UseKeyboardOptions = {}): KeyboardSnapshot {
  const {
    enabled = true,
    ignoreEditableTargets = true,
    preventDefaultForGameKeys = true,
    onInteract,
    onOpenMap,
    onToggleCheatConsole,
    onExitFocusMode,
    onJump,
  } = options

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(() => new Set())

  const pressedKeysRef = useRef<Set<string>>(new Set())

  const optionsRef = useRef({
    enabled,
    ignoreEditableTargets,
    preventDefaultForGameKeys,
    onInteract,
    onOpenMap,
    onToggleCheatConsole,
    onExitFocusMode,
    onJump,
  })

  useEffect(() => {
    optionsRef.current = {
      enabled,
      ignoreEditableTargets,
      preventDefaultForGameKeys,
      onInteract,
      onOpenMap,
      onToggleCheatConsole,
      onExitFocusMode,
      onJump,
    }
  }, [
    enabled,
    ignoreEditableTargets,
    preventDefaultForGameKeys,
    onInteract,
    onOpenMap,
    onToggleCheatConsole,
    onExitFocusMode,
    onJump,
  ])

  const updatePressedKeys = useCallback((nextKeys: Set<string>) => {
    pressedKeysRef.current = nextKeys
    setPressedKeys(new Set(nextKeys))
  }, [])

  useEffect(() => {
    if (!isBrowser()) {
      return
    }

    function handleKeyDown(event: KeyboardEvent): void {
      const currentOptions = optionsRef.current

      const canHandle = shouldHandleKeyboardEvent(event, {
        enabled: currentOptions.enabled,
        ignoreEditableTargets: currentOptions.ignoreEditableTargets,
        preventDefaultForGameKeys: currentOptions.preventDefaultForGameKeys,
      })

      if (!canHandle) {
        return
      }

      const alreadyPressed = pressedKeysRef.current.has(event.code)
      const nextKeys = new Set(pressedKeysRef.current)
      nextKeys.add(event.code)
      updatePressedKeys(nextKeys)

      if (alreadyPressed || event.repeat) {
        return
      }

      if (actionMatchesCode('interact', event.code)) {
        currentOptions.onInteract?.()
      }

      if (actionMatchesCode('openMap', event.code)) {
        currentOptions.onOpenMap?.()
      }

      if (actionMatchesCode('cheatConsole', event.code)) {
        currentOptions.onToggleCheatConsole?.()
      }

      if (actionMatchesCode('exitFocusMode', event.code)) {
        currentOptions.onExitFocusMode?.()
      }

      if (actionMatchesCode('jump', event.code)) {
        currentOptions.onJump?.()
      }
    }

    function handleKeyUp(event: KeyboardEvent): void {
      const currentOptions = optionsRef.current

      const canHandle = shouldHandleKeyboardEvent(event, {
        enabled: currentOptions.enabled,
        ignoreEditableTargets: currentOptions.ignoreEditableTargets,
        preventDefaultForGameKeys: currentOptions.preventDefaultForGameKeys,
      })

      if (!canHandle) {
        return
      }

      const nextKeys = new Set(pressedKeysRef.current)
      nextKeys.delete(event.code)
      updatePressedKeys(nextKeys)
    }

    function handleWindowBlur(): void {
      updatePressedKeys(new Set())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleWindowBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [updatePressedKeys])

  const isDown = useCallback(
    (code: string): boolean => pressedKeys.has(code),
    [pressedKeys]
  )

  const isActionDown = useCallback(
    (action: KeyboardAction): boolean => isAnyActionDown(pressedKeys, action),
    [pressedKeys]
  )

  const movement = useMemo(
    () => createMovementInput(pressedKeys),
    [pressedKeys]
  )

  const movementVector = useMemo(
    () => createMovementVector(movement),
    [movement]
  )

  return useMemo(
    () => ({
      pressedKeys,

      movement,
      movementVector,

      interactPressed: isActionDown('interact'),
      mapPressed: isActionDown('openMap'),
      cheatConsolePressed: isActionDown('cheatConsole'),
      exitFocusModePressed: isActionDown('exitFocusMode'),

      isDown,
      isActionDown,
    }),
    [pressedKeys, movement, movementVector, isActionDown, isDown]
  )
}
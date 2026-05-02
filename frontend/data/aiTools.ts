// frontend/data/aiTools.ts

import type { AITool, AIToolName } from '@/types'

export const AI_TOOLS: AITool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    toolName: 'chatgpt',
    floor: 0,
    description:
      'Used for architecture planning, debugging, backend design, rapid prototyping, prompt engineering, and exploring implementation options during development.',
    url: 'https://chatgpt.com',
    themeColor: '#202123',
    accentColor: '#10a37f',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    toolName: 'gemini',
    floor: 1,
    description:
      'Used for research assistance, cross-checking technical documentation, multimodal exploration, and comparing alternative implementation approaches.',
    url: 'https://gemini.google.com',
    themeColor: '#1a1a2e',
    accentColor: '#8ab4f8',
  },
  {
    id: 'claude',
    name: 'Claude',
    toolName: 'claude',
    floor: 2,
    description:
      'Used for long-context reasoning, codebase review, refactoring plans, documentation writing, and working through complex backend or SRE system design problems.',
    url: 'https://claude.ai',
    themeColor: '#1a0f0a',
    accentColor: '#cc785c',
  },
]

export const AI_FLOOR_MIN = Math.min(...AI_TOOLS.map((tool) => tool.floor))

export const AI_FLOOR_MAX = Math.max(...AI_TOOLS.map((tool) => tool.floor))

export const AI_TOOLS_TOTAL = AI_TOOLS.length

export const AI_FLOOR_LABELS: Record<number, string> = {
  0: 'Ground Floor',
  1: 'First Floor',
  2: 'Second Floor',
}

/**
 * Get all AI tools sorted by floor number ascending.
 */
export function getAIToolsOrdered(): AITool[] {
  return [...AI_TOOLS].sort((a, b) => a.floor - b.floor)
}

/**
 * Get an AI tool by floor number.
 */
export function getAIToolByFloor(floor: number): AITool | undefined {
  return AI_TOOLS.find((tool) => tool.floor === floor)
}

/**
 * Get an AI tool by tool name.
 */
export function getAIToolByName(toolName: AIToolName): AITool | undefined {
  return AI_TOOLS.find((tool) => tool.toolName === toolName)
}

/**
 * Get an AI tool by id.
 */
export function getAIToolById(id: string): AITool | undefined {
  return AI_TOOLS.find((tool) => tool.id === id)
}

/**
 * Whether a given floor number is a valid AI building floor.
 */
export function isValidAIFloor(floor: number): boolean {
  return AI_TOOLS.some((tool) => tool.floor === floor)
}

/**
 * Whether an AI tool has a usable external URL.
 */
export function hasValidAIToolUrl(tool: AITool): boolean {
  return tool.url.startsWith('https://')
}

/**
 * Get the external URL for a given floor.
 */
export function getAIToolUrlByFloor(floor: number): string | undefined {
  return getAIToolByFloor(floor)?.url
}

/**
 * Get readable floor label.
 */
export function getAIFloorLabel(floor: number): string {
  return AI_FLOOR_LABELS[floor] ?? `Floor ${floor}`
}

/**
 * Floor labels for AI building navigation.
 * Ground floor = 0.
 */
export function getAIFloorLabels(): { floor: number; label: string; tool: string }[] {
  return getAIToolsOrdered().map((tool) => ({
    floor: tool.floor,
    label: getAIFloorLabel(tool.floor),
    tool: tool.name,
  }))
}
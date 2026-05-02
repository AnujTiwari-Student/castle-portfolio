// frontend/data/social.ts

import type { SocialLink, SocialPlatform } from '@/types'

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'linkedin',
    platform: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/anuj-tiwari',
    floor: 1,
    themeColor: '#0A66C2',
    description:
      'Professional profile for Anuj Tiwari. Career timeline, work history, skills, and current role as Software Engineer (Apprentice) at Reliance Jio.',
  },
  {
    id: 'github',
    platform: 'github',
    label: 'GitHub',
    url: 'https://github.com/anuj-tiwari',
    floor: 2,
    themeColor: '#24292e',
    description:
      'Engineering workspace for source code, experiments, backend systems, frontend work, DevOps tooling, and portfolio-related projects.',
  },
  {
    id: 'instagram',
    platform: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/anuj.tiwari',
    floor: 3,
    themeColor: '#E1306C',
    description:
      'Personal profile showing life outside engineering, interests, moments, and non-technical updates.',
  },
  {
    id: 'leetcode',
    platform: 'leetcode',
    label: 'LeetCode',
    url: 'https://leetcode.com/anuj-tiwari',
    floor: 4,
    themeColor: '#FFA116',
    description:
      'Problem-solving profile for data structures, algorithms, interview preparation, and coding practice.',
  },
  {
    id: 'portfolio-source',
    platform: 'portfolio',
    label: 'Portfolio Source Code',
    url: 'https://github.com/anuj-tiwari/castle-portfolio',
    floor: 5,
    themeColor: '#00FF88',
    description:
      'Source code for this interactive 3D portfolio city, built with Next.js, React Three Fiber, Three.js, TypeScript, and a Go backend.',
  },
]

export const SOCIAL_FLOOR_MIN = Math.min(...SOCIAL_LINKS.map((link) => link.floor))

export const SOCIAL_FLOOR_MAX = Math.max(...SOCIAL_LINKS.map((link) => link.floor))

export const SOCIAL_FLOOR_COUNT = SOCIAL_LINKS.length

export const SOCIAL_ROOF_FLOOR = SOCIAL_FLOOR_MAX + 1

/**
 * Get all social links sorted by floor number.
 */
export function getSocialLinksOrdered(): SocialLink[] {
  return [...SOCIAL_LINKS].sort((a, b) => a.floor - b.floor)
}

/**
 * Get a social link by floor number.
 */
export function getSocialLinkByFloor(floor: number): SocialLink | undefined {
  return SOCIAL_LINKS.find((link) => link.floor === floor)
}

/**
 * Get a social link by platform id.
 */
export function getSocialLinkByPlatform(
  platform: SocialPlatform
): SocialLink | undefined {
  return SOCIAL_LINKS.find((link) => link.platform === platform)
}

/**
 * Get a social link by id.
 */
export function getSocialLinkById(id: string): SocialLink | undefined {
  return SOCIAL_LINKS.find((link) => link.id === id)
}

/**
 * Floor labels for elevator panel buttons.
 * Includes social floors and roof access.
 */
export function getElevatorFloorLabels(): { floor: number; label: string }[] {
  return [
    ...getSocialLinksOrdered().map((link) => ({
      floor: link.floor,
      label: link.label,
    })),
    {
      floor: SOCIAL_ROOF_FLOOR,
      label: 'Roof',
    },
  ]
}

/**
 * Whether a given floor number is a valid social floor.
 */
export function isValidSocialFloor(floor: number): boolean {
  return SOCIAL_LINKS.some((link) => link.floor === floor)
}

/**
 * Whether a given floor number is the roof.
 */
export function isRoofFloor(floor: number): boolean {
  return floor === SOCIAL_ROOF_FLOOR
}

/**
 * Whether a given floor can be selected in the elevator.
 */
export function isValidElevatorFloor(floor: number): boolean {
  return isValidSocialFloor(floor) || isRoofFloor(floor)
}

/**
 * Check whether a social link has a usable external URL.
 */
export function hasValidSocialUrl(link: SocialLink): boolean {
  return link.url.startsWith('https://')
}

/**
 * Get the external URL for a floor.
 */
export function getSocialUrlByFloor(floor: number): string | undefined {
  return getSocialLinkByFloor(floor)?.url
}
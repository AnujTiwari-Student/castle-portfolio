// frontend/lib/utils.ts

import type { BrandingConfig, Vec3, ZoneId } from '@/types'
import { ZONE_CONFIGS } from '@/lib/constants'

// ─── Math ─────────────────────────────────────────────────────────────────────

/**
 * Linear interpolation between two numbers.
 * t = 0 → a, t = 1 → b
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Lerp where interpolation factor t is clamped to [0, 1].
 */
export function clampedLerp(a: number, b: number, t: number): number {
  return lerp(a, b, clamp(t, 0, 1))
}

/**
 * Normalize an angle to the range (-PI, PI].
 */
export function normalizeAngle(angle: number): number {
  let normalized = angle % (Math.PI * 2)

  if (normalized > Math.PI) {
    normalized -= Math.PI * 2
  }

  if (normalized < -Math.PI) {
    normalized += Math.PI * 2
  }

  return normalized
}

/**
 * Backward-compatible British spelling alias.
 */
export const normaliseAngle = normalizeAngle

/**
 * Shortest-path lerp between two angles in radians.
 */
export function lerpAngle(a: number, b: number, t: number): number {
  const diff = normalizeAngle(b - a)
  return a + diff * clamp(t, 0, 1)
}

/**
 * Convert degrees to radians.
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Convert radians to degrees.
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI
}

// ─── Vec3 ─────────────────────────────────────────────────────────────────────

/**
 * Clone a Vec3 tuple.
 */
export function cloneVec3(v: Vec3): Vec3 {
  return [v[0], v[1], v[2]]
}

/**
 * Component-wise lerp between two Vec3 tuples.
 */
export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  const safeT = clamp(t, 0, 1)

  return [
    lerp(a[0], b[0], safeT),
    lerp(a[1], b[1], safeT),
    lerp(a[2], b[2], safeT),
  ]
}

/**
 * Add two Vec3 tuples.
 */
export function addVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

/**
 * Subtract b from a.
 */
export function subtractVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

/**
 * Scale a Vec3 by a scalar.
 */
export function scaleVec3(v: Vec3, scalar: number): Vec3 {
  return [v[0] * scalar, v[1] * scalar, v[2] * scalar]
}

/**
 * Euclidean distance between two Vec3 tuples.
 */
export function distanceVec3(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  const dz = a[2] - b[2]

  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Distance on the XZ plane only.
 * Useful for player/interactable proximity checks.
 */
export function distanceXZ(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0]
  const dz = a[2] - b[2]

  return Math.sqrt(dx * dx + dz * dz)
}

/**
 * Length/magnitude of a Vec3.
 */
export function lengthVec3(v: Vec3): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
}

/**
 * Normalize a Vec3.
 * Returns [0, 0, 0] if length is zero.
 */
export function normalizeVec3(v: Vec3): Vec3 {
  const length = lengthVec3(v)

  if (length === 0) {
    return [0, 0, 0]
  }

  return [v[0] / length, v[1] / length, v[2] / length]
}

/**
 * Check if two positions are within radius using full XYZ distance.
 */
export function isWithinRadius(a: Vec3, b: Vec3, radius: number): boolean {
  return distanceVec3(a, b) <= radius
}

/**
 * Check if two positions are within radius on XZ plane.
 */
export function isWithinRadiusXZ(a: Vec3, b: Vec3, radius: number): boolean {
  return distanceXZ(a, b) <= radius
}

/**
 * Convert Vec3 to CSS/debug-friendly string.
 */
export function formatVec3(v: Vec3): string {
  return `[${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)}]`
}

// ─── Zone ─────────────────────────────────────────────────────────────────────

/**
 * Given a world-space Vec3 position, return the ZoneId of the zone
 * the position is currently inside, or null if none.
 *
 * Uses the zone position as center and size as full XZ extents.
 * Y axis is intentionally ignored.
 */
export function getZoneAtPosition(position: Vec3): ZoneId | null {
  for (const zone of Object.values(ZONE_CONFIGS)) {
    const [zoneX, , zoneZ] = zone.position
    const [sizeX, , sizeZ] = zone.size

    const halfWidth = sizeX / 2
    const halfDepth = sizeZ / 2

    const insideX = position[0] >= zoneX - halfWidth && position[0] <= zoneX + halfWidth
    const insideZ = position[2] >= zoneZ - halfDepth && position[2] <= zoneZ + halfDepth

    if (insideX && insideZ) {
      return zone.id
    }
  }

  return null
}

/**
 * Get the human-readable label for a ZoneId.
 */
export function getZoneLabel(zoneId: ZoneId | null): string {
  if (!zoneId) {
    return ''
  }

  return ZONE_CONFIGS[zoneId]?.label ?? ''
}

/**
 * Get the center position for a zone.
 */
export function getZonePosition(zoneId: ZoneId): Vec3 {
  return cloneVec3(ZONE_CONFIGS[zoneId].position)
}

/**
 * Get a safe spawn point near a zone.
 */
export function getZoneSpawnPoint(zoneId: ZoneId, yOffset = 0.05): Vec3 {
  const zone = ZONE_CONFIGS[zoneId]
  const [x, , z] = zone.position
  const [, , depth] = zone.size

  return [x, yOffset, z - depth / 2 - 3]
}

/**
 * Get all zone ids.
 */
export function getZoneIds(): ZoneId[] {
  return Object.keys(ZONE_CONFIGS) as ZoneId[]
}

// ─── HP ───────────────────────────────────────────────────────────────────────

/**
 * Apply damage to current HP.
 */
export function applyDamage(hp: number, damage: number, maxHp: number): number {
  return clamp(hp - Math.max(0, damage), 0, maxHp)
}

/**
 * Apply healing to current HP.
 */
export function applyHeal(hp: number, amount: number, maxHp: number): number {
  return clamp(hp + Math.max(0, amount), 0, maxHp)
}

/**
 * HP fraction [0, 1] for health bar width calculation.
 */
export function hpFraction(hp: number, maxHp: number): number {
  if (maxHp <= 0) {
    return 0
  }

  return clamp(hp / maxHp, 0, 1)
}

/**
 * Whether HP is at or below zero.
 */
export function isDead(hp: number): boolean {
  return hp <= 0
}

// ─── String / Display ─────────────────────────────────────────────────────────

/**
 * Format a tech array into a comma-separated string.
 */
export function formatTechList(tech: string[]): string {
  return tech.join(', ')
}

/**
 * Truncate a string to maxLength and append ellipsis if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (maxLength <= 0) {
    return ''
  }

  if (text.length <= maxLength) {
    return text
  }

  if (maxLength === 1) {
    return '…'
  }

  return `${text.slice(0, maxLength - 1)}…`
}

/**
 * Replace template tokens in a string.
 *
 * Example:
 * resolveTemplate('{USER_NAME} | {CURRENT_ROLE}', {
 *   USER_NAME: 'Anuj',
 *   CURRENT_ROLE: 'Software Engineer'
 * })
 */
export function resolveTemplate(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(/\{([^}]+)\}/g, (_, key: string) => {
    return values[key] ?? `{${key}}`
  })
}

/**
 * Build template values from branding config.
 */
export function getBrandingTemplateValues(config: BrandingConfig): Record<string, string> {
  return {
    USER_NAME: config.user.name,
    DISPLAY_NAME: config.user.displayName,
    CURRENT_ROLE: config.user.currentRole,
    COMPANY: config.user.company,
    LOCATION: config.user.location,
    EMPLOYMENT_DATE: config.user.employmentDate,
    TAGLINE: config.user.tagline,
  }
}

/**
 * Resolve a branding template using frontend/app/config/branding.ts data.
 */
export function resolveBrandingTemplate(
  template: string,
  config: BrandingConfig
): string {
  return resolveTemplate(template, getBrandingTemplateValues(config))
}

/**
 * Convert a string into a basic slug.
 */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── Jio / SRE Display Helpers ────────────────────────────────────────────────

/**
 * Return visible Jio status panels.
 */
export function getVisibleJioStatusPanels(config: BrandingConfig) {
  return config.jioCabin.statusPanels.filter((panel) => panel.visible)
}

/**
 * Return visible Jio tech stack items.
 */
export function getVisibleJioTechStackItems(config: BrandingConfig) {
  if (!config.jioCabin.techStackWall.enabled) {
    return []
  }

  return config.jioCabin.techStackWall.items.filter((item) => item.visible)
}

/**
 * Return visible Jio dashboard panels.
 */
export function getVisibleJioDashboardPanels(config: BrandingConfig) {
  if (!config.jioCabin.dashboards.enabled) {
    return []
  }

  return config.jioCabin.dashboards.panels.filter((panel) => panel.visible)
}

/**
 * Return visible Jio achievements.
 */
export function getVisibleJioAchievements(config: BrandingConfig) {
  if (!config.jioCabin.achievementShelf.enabled) {
    return []
  }

  return config.jioCabin.achievementShelf.trophies.filter((trophy) => trophy.visible)
}

/**
 * Return visible Jio custom sections.
 */
export function getVisibleJioCustomSections(config: BrandingConfig) {
  return config.jioCabin.customSections.filter((section) => section.visible)
}

// ─── Time ─────────────────────────────────────────────────────────────────────

/**
 * Convert seconds to mm:ss display string.
 */
export function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, seconds)
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = Math.floor(safeSeconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Promise-based delay helper for transitions.
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

// ─── Browser / Runtime Guards ─────────────────────────────────────────────────

/**
 * True only in browser runtime.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Safely open an external URL.
 */
export function openExternalUrl(url: string): void {
  if (!isBrowser()) {
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

// ─── Dev / Debug ──────────────────────────────────────────────────────────────

/**
 * Log only in development. No-op in production.
 */
export function devLog(...args: unknown[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[castle-portfolio]', ...args)
  }
}
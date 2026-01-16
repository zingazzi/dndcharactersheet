import type { SpellSlot } from '~/types/character'

/**
 * Paladin spell slot progression table
 * Based on D&D 5.5 Paladin progression
 */
const PALADIN_SPELL_SLOTS: Readonly<Record<number, ReadonlyArray<{ level: number; total: number }>>> = {
  1: [],
  2: [{ level: 1, total: 2 }],
  3: [{ level: 1, total: 3 }],
  4: [{ level: 1, total: 3 }],
  5: [
    { level: 1, total: 4 },
    { level: 2, total: 2 },
  ],
  6: [
    { level: 1, total: 4 },
    { level: 2, total: 2 },
  ],
  7: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
  ],
  8: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
  ],
  9: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 2 },
  ],
  10: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 2 },
  ],
  11: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
  ],
  12: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
  ],
  13: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 1 },
  ],
  14: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 1 },
  ],
  15: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 2 },
  ],
  16: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 2 },
  ],
  17: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 1 },
  ],
  18: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 1 },
  ],
  19: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 2 },
  ],
  20: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 2 },
  ],
}

/**
 * Get spell slots for a Paladin of the given level
 * @param level Paladin level (1-20)
 * @param existingSlots Existing spell slots to preserve 'used' values
 * @returns Array of SpellSlot objects
 */
export function getPaladinSpellSlots(
  level: number,
  existingSlots: SpellSlot[] = [],
): SpellSlot[] {
  if (level < 1 || level > 20) {
    return []
  }

  const slotSpecs = PALADIN_SPELL_SLOTS[level] || []
  const existingByLevel = new Map<number, SpellSlot>()
  existingSlots.forEach(slot => {
    existingByLevel.set(slot.level, slot)
  })

  return slotSpecs.map(spec => {
    const existing = existingByLevel.get(spec.level)
    if (existing) {
      // Preserve used value, but cap it at the new total
      return {
        level: spec.level,
        total: spec.total,
        used: Math.min(existing.used, spec.total),
      }
    }
    return {
      level: spec.level,
      total: spec.total,
      used: 0,
    }
  })
}

/**
 * Get the number of prepared spells for a Paladin of the given level
 * Based on: Paladin level + Charisma modifier (minimum 1)
 * @param level Paladin level
 * @param charismaModifier Charisma ability modifier
 * @returns Number of spells that can be prepared
 */
export function getPaladinPreparedSpellCount(level: number, charismaModifier: number): number {
  if (level < 2) return 0 // No spellcasting before level 2
  return Math.max(1, level + charismaModifier)
}

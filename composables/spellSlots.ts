import type { SpellSlot } from '~/types/character'

/**
 * Paladin spell slot progression table
 * Based on D&D 5.5 Paladin progression
 */
const PALADIN_SPELL_SLOTS: Readonly<Record<number, ReadonlyArray<{ level: number; total: number }>>> = {
  1: [{ level: 1, total: 2 }],
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
 * Paladin prepared spells progression table
 * Based on D&D 5.5 Paladin progression - fixed values per level
 */
const PALADIN_PREPARED_SPELLS: Readonly<Record<number, number>> = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 6,
  7: 7,
  8: 7,
  9: 9,
  10: 9,
  11: 10,
  12: 10,
  13: 11,
  14: 11,
  15: 12,
  16: 12,
  17: 14,
  18: 14,
  19: 15,
  20: 15,
}

/**
 * Get the number of prepared spells for a Paladin of the given level
 * Based on fixed table values per level (not dependent on Charisma modifier)
 * @param level Paladin level (1-20)
 * @param charismaModifier Charisma ability modifier (kept for backward compatibility, not used)
 * @returns Number of spells that can be prepared
 */
export function getPaladinPreparedSpellCount(level: number, charismaModifier: number): number {
  if (level < 1 || level > 20) return 0
  return PALADIN_PREPARED_SPELLS[level] || 0
}

/**
 * Cleric spell slot progression table
 * Based on D&D 5.5 Cleric progression
 */
const CLERIC_SPELL_SLOTS: Readonly<Record<number, ReadonlyArray<{ level: number; total: number }>>> = {
  1: [{ level: 1, total: 2 }],
  2: [{ level: 1, total: 3 }],
  3: [
    { level: 1, total: 4 },
    { level: 2, total: 2 },
  ],
  4: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
  ],
  5: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 2 },
  ],
  6: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
  ],
  7: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 1 },
  ],
  8: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 2 },
  ],
  9: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 1 },
  ],
  10: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 2 },
  ],
  11: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 2 },
    { level: 6, total: 1 },
  ],
  12: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 2 },
    { level: 6, total: 1 },
  ],
  13: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 2 },
    { level: 6, total: 1 },
    { level: 7, total: 1 },
  ],
  14: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 2 },
    { level: 6, total: 1 },
    { level: 7, total: 1 },
  ],
  15: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 2 },
    { level: 6, total: 1 },
    { level: 7, total: 1 },
    { level: 8, total: 1 },
  ],
  16: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 2 },
    { level: 6, total: 1 },
    { level: 7, total: 1 },
    { level: 8, total: 1 },
  ],
  17: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 2 },
    { level: 6, total: 1 },
    { level: 7, total: 1 },
    { level: 8, total: 1 },
    { level: 9, total: 1 },
  ],
  18: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 3 },
    { level: 6, total: 1 },
    { level: 7, total: 1 },
    { level: 8, total: 1 },
    { level: 9, total: 1 },
  ],
  19: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 3 },
    { level: 6, total: 2 },
    { level: 7, total: 1 },
    { level: 8, total: 1 },
    { level: 9, total: 1 },
  ],
  20: [
    { level: 1, total: 4 },
    { level: 2, total: 3 },
    { level: 3, total: 3 },
    { level: 4, total: 3 },
    { level: 5, total: 3 },
    { level: 6, total: 2 },
    { level: 7, total: 2 },
    { level: 8, total: 1 },
    { level: 9, total: 1 },
  ],
}

/**
 * Get spell slots for a Cleric of the given level
 * @param level Cleric level (1-20)
 * @param existingSlots Existing spell slots to preserve 'used' values
 * @returns Array of SpellSlot objects
 */
export function getClericSpellSlots(
  level: number,
  existingSlots: SpellSlot[] = [],
): SpellSlot[] {
  if (level < 1 || level > 20) {
    return []
  }

  const slotSpecs = CLERIC_SPELL_SLOTS[level] || []
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
 * Get the number of cantrips a Cleric knows at the given level
 * Base: 3 at levels 1-3, 4 at levels 4-9, 5 at levels 10-20
 * Thaumaturge: +1 cantrip at level 1
 * @param level Cleric level (1-20)
 * @param divineOrder Divine Order choice: 'Protector', 'Thaumaturge', or null
 * @returns Number of cantrips known
 */
export function getClericCantripCount(
  level: number,
  divineOrder: 'Protector' | 'Thaumaturge' | null = null,
): number {
  if (level < 1 || level > 20) return 0

  let baseCount = 3
  if (level >= 4 && level <= 9) {
    baseCount = 4
  } else if (level >= 10) {
    baseCount = 5
  }

  // Thaumaturge gets +1 cantrip
  if (divineOrder === 'Thaumaturge') {
    return baseCount + 1
  }

  return baseCount
}

/**
 * Get the number of prepared spells for a Cleric of the given level
 * Formula: Cleric level + Wisdom modifier (minimum 1)
 * @param level Cleric level (1-20)
 * @param wisdomModifier Wisdom ability modifier
 * @returns Number of spells that can be prepared
 */
export function getClericPreparedSpellCount(level: number, wisdomModifier: number): number {
  if (level < 1 || level > 20) return 0
  return Math.max(1, level + wisdomModifier)
}

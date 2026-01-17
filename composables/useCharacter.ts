import type { Character, AbilityScore, Skill, Action, Spell, InventoryItem, FeatureTrait, ResourcePool, ClassType, ClassEntry } from '~/types/character'
import { addMissingClassFeatures, canMulticlassInto, computeHpGainOnLevelUp, getMulticlassProficiencies, getResourcesForClassAtLevel, getStartingHpBase, type HpChoice } from '~/composables/classProgression'
import { canLevelUpWithXp, getNextXpMilestoneFromXp } from '~/composables/xpProgression'
import { getPaladinSpellSlots } from '~/composables/spellSlots'
import fightingStylesJson from '~/data/fighting-styles.json'
import paladinSpellsJson from '~/data/spells/Paladin.json'

export interface FightingStyle {
  name: string
  description: string
}

function assertFightingStyles(value: unknown): asserts value is readonly FightingStyle[] {
  if (!Array.isArray(value)) throw new Error('Invalid fighting styles: expected array')
  value.forEach((item, idx) => {
    if (typeof item !== 'object' || item === null) throw new Error(`Invalid fighting styles: item[${idx}] not object`)
    const rec = item as Record<string, unknown>
    if (typeof rec.name !== 'string') throw new Error(`Invalid fighting styles: item[${idx}] missing name`)
    if (typeof rec.description !== 'string') throw new Error(`Invalid fighting styles: item[${idx}] missing description`)
  })
}

export const FIGHTING_STYLES: readonly FightingStyle[] = (() => {
  const raw: unknown = fightingStylesJson
  assertFightingStyles(raw)
  return raw
})()

export interface WeaponMastery {
  name: string
  type: 'Simple' | 'Martial'
  mastery: string
}

export const WEAPON_MASTERY_WEAPONS: WeaponMastery[] = [
  // Simple Melee Weapons
  { name: 'Club', type: 'Simple', mastery: 'Sap' },
  { name: 'Dagger', type: 'Simple', mastery: 'Vex' },
  { name: 'Greatclub', type: 'Simple', mastery: 'Sap' },
  { name: 'Handaxe', type: 'Simple', mastery: 'Vex' },
  { name: 'Javelin', type: 'Simple', mastery: 'Vex' },
  { name: 'Light Hammer', type: 'Simple', mastery: 'Vex' },
  { name: 'Mace', type: 'Simple', mastery: 'Sap' },
  { name: 'Quarterstaff', type: 'Simple', mastery: 'Slow' },
  { name: 'Sickle', type: 'Simple', mastery: 'Vex' },
  { name: 'Spear', type: 'Simple', mastery: 'Vex' },
  { name: 'Unarmed Strike', type: 'Simple', mastery: 'Graze' },

  // Simple Ranged Weapons
  { name: 'Crossbow, Light', type: 'Simple', mastery: 'Slow' },
  { name: 'Dart', type: 'Simple', mastery: 'Vex' },
  { name: 'Shortbow', type: 'Simple', mastery: 'Vex' },
  { name: 'Sling', type: 'Simple', mastery: 'Vex' },

  // Martial Melee Weapons
  { name: 'Battleaxe', type: 'Martial', mastery: 'Graze' },
  { name: 'Flail', type: 'Martial', mastery: 'Slow' },
  { name: 'Glaive', type: 'Martial', mastery: 'Cleave' },
  { name: 'Greataxe', type: 'Martial', mastery: 'Cleave' },
  { name: 'Greatsword', type: 'Martial', mastery: 'Cleave' },
  { name: 'Halberd', type: 'Martial', mastery: 'Cleave' },
  { name: 'Lance', type: 'Martial', mastery: 'Slow' },
  { name: 'Longsword', type: 'Martial', mastery: 'Vex' },
  { name: 'Maul', type: 'Martial', mastery: 'Topple' },
  { name: 'Morningstar', type: 'Martial', mastery: 'Sap' },
  { name: 'Pike', type: 'Martial', mastery: 'Push' },
  { name: 'Rapier', type: 'Martial', mastery: 'Vex' },
  { name: 'Scimitar', type: 'Martial', mastery: 'Vex' },
  { name: 'Shortsword', type: 'Martial', mastery: 'Vex' },
  { name: 'Trident', type: 'Martial', mastery: 'Vex' },
  { name: 'War Pick', type: 'Martial', mastery: 'Graze' },
  { name: 'Warhammer', type: 'Martial', mastery: 'Topple' },
  { name: 'Whip', type: 'Martial', mastery: 'Slow' },

  // Martial Ranged Weapons
  { name: 'Blowgun', type: 'Martial', mastery: 'Vex' },
  { name: 'Crossbow, Hand', type: 'Martial', mastery: 'Vex' },
  { name: 'Crossbow, Heavy', type: 'Martial', mastery: 'Slow' },
  { name: 'Longbow', type: 'Martial', mastery: 'Graze' },
  { name: 'Net', type: 'Martial', mastery: 'Slow' },
]

// Ranged weapons to exclude for Barbarian melee-only weapon mastery
const RANGED_WEAPONS = [
  'Crossbow, Light',
  'Dart',
  'Shortbow',
  'Sling',
  'Blowgun',
  'Crossbow, Hand',
  'Crossbow, Heavy',
  'Longbow',
  'Net',
]

export const getMeleeWeapons = (): WeaponMastery[] => {
  return WEAPON_MASTERY_WEAPONS.filter(weapon => !RANGED_WEAPONS.includes(weapon.name))
}

export const BARBARIAN_SKILLS = [
  'Animal Handling',
  'Athletics',
  'Intimidation',
  'Nature',
  'Perception',
  'Survival',
]

export const ROGUE_SKILLS = [
  'Acrobatics',
  'Athletics',
  'Deception',
  'Insight',
  'Intimidation',
  'Investigation',
  'Perception',
  'Persuasion',
  'Sleight of Hand',
  'Stealth',
]

export const PALADIN_SKILLS = [
  'Athletics',
  'Insight',
  'Intimidation',
  'Medicine',
  'Persuasion',
  'Religion',
]

export interface ArmorData {
  name: string
  type: 'light' | 'medium' | 'heavy' | 'shield'
  baseAC: number
}

export interface WeaponData {
  name: string
  damage: string // e.g., "1d4", "1d6", "1d8"
  damageType: string // e.g., "piercing", "slashing", "bludgeoning"
  range: string // e.g., "5 ft.", "20/60 ft."
  type: 'melee' | 'ranged'
  ability: 'strength' | 'dexterity' | 'finesse' // Which ability modifier to use (finesse = choice of STR or DEX)
}

export interface ItemData {
  name: string
  category: 'weapon' | 'armor' | 'shield' | 'gear' | 'tool' | 'consumable' | 'other'
  weight: number
  cost?: number // in gold pieces
  description?: string
  weaponData?: WeaponData
  armorData?: ArmorData
}

export const ARMOR_DATABASE: ArmorData[] = [
  // Light Armor
  { name: 'Padded', type: 'light', baseAC: 11 },
  { name: 'Leather', type: 'light', baseAC: 11 },
  { name: 'Studded Leather', type: 'light', baseAC: 12 },

  // Medium Armor
  { name: 'Hide', type: 'medium', baseAC: 12 },
  { name: 'Chain Shirt', type: 'medium', baseAC: 13 },
  { name: 'Scale Mail', type: 'medium', baseAC: 14 },
  { name: 'Breastplate', type: 'medium', baseAC: 14 },
  { name: 'Half Plate', type: 'medium', baseAC: 15 },
  { name: 'Chain Mail', type: 'medium', baseAC: 16 },

  // Heavy Armor
  { name: 'Ring Mail', type: 'heavy', baseAC: 14 },
  { name: 'Chain Mail', type: 'heavy', baseAC: 16 },
  { name: 'Splint', type: 'heavy', baseAC: 17 },
  { name: 'Plate', type: 'heavy', baseAC: 18 },

  // Shields
  { name: 'Shield', type: 'shield', baseAC: 2 },
]

export const WEAPON_DATABASE: WeaponData[] = [
  // Simple Melee Weapons
  { name: 'Club', damage: '1d4', damageType: 'bludgeoning', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Dagger', damage: '1d4', damageType: 'piercing', range: '5 ft. (20/60 ft. thrown)', type: 'melee', ability: 'finesse' },
  { name: 'Greatclub', damage: '1d8', damageType: 'bludgeoning', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Handaxe', damage: '1d6', damageType: 'slashing', range: '5 ft. (20/60 ft. thrown)', type: 'melee', ability: 'strength' },
  { name: 'Javelin', damage: '1d6', damageType: 'piercing', range: '5 ft. (30/120 ft. thrown)', type: 'melee', ability: 'strength' },
  { name: 'Light Hammer', damage: '1d4', damageType: 'bludgeoning', range: '5 ft. (20/60 ft. thrown)', type: 'melee', ability: 'strength' },
  { name: 'Mace', damage: '1d6', damageType: 'bludgeoning', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Quarterstaff', damage: '1d6', damageType: 'bludgeoning', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Sickle', damage: '1d4', damageType: 'slashing', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Spear', damage: '1d6', damageType: 'piercing', range: '5 ft. (20/60 ft. thrown)', type: 'melee', ability: 'strength' },
  { name: 'Unarmed Strike', damage: '1', damageType: 'bludgeoning', range: '5 ft.', type: 'melee', ability: 'strength' },

  // Simple Ranged Weapons
  { name: 'Crossbow, Light', damage: '1d8', damageType: 'piercing', range: '80/320 ft.', type: 'ranged', ability: 'dexterity' },
  { name: 'Dart', damage: '1d4', damageType: 'piercing', range: '20/60 ft.', type: 'ranged', ability: 'finesse' },
  { name: 'Shortbow', damage: '1d6', damageType: 'piercing', range: '80/320 ft.', type: 'ranged', ability: 'dexterity' },
  { name: 'Sling', damage: '1d4', damageType: 'bludgeoning', range: '30/120 ft.', type: 'ranged', ability: 'dexterity' },

  // Martial Melee Weapons
  { name: 'Battleaxe', damage: '1d8', damageType: 'slashing', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Flail', damage: '1d8', damageType: 'bludgeoning', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Glaive', damage: '1d10', damageType: 'slashing', range: '10 ft.', type: 'melee', ability: 'strength' },
  { name: 'Greataxe', damage: '1d12', damageType: 'slashing', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Greatsword', damage: '2d6', damageType: 'slashing', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Halberd', damage: '1d10', damageType: 'slashing', range: '10 ft.', type: 'melee', ability: 'strength' },
  { name: 'Lance', damage: '1d12', damageType: 'piercing', range: '10 ft.', type: 'melee', ability: 'strength' },
  { name: 'Longsword', damage: '1d8', damageType: 'slashing', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Maul', damage: '2d6', damageType: 'bludgeoning', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Morningstar', damage: '1d8', damageType: 'piercing', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Pike', damage: '1d10', damageType: 'piercing', range: '10 ft.', type: 'melee', ability: 'strength' },
  { name: 'Rapier', damage: '1d8', damageType: 'piercing', range: '5 ft.', type: 'melee', ability: 'finesse' },
  { name: 'Scimitar', damage: '1d6', damageType: 'slashing', range: '5 ft.', type: 'melee', ability: 'finesse' },
  { name: 'Shortsword', damage: '1d6', damageType: 'piercing', range: '5 ft.', type: 'melee', ability: 'finesse' },
  { name: 'Trident', damage: '1d6', damageType: 'piercing', range: '5 ft. (20/60 ft. thrown)', type: 'melee', ability: 'strength' },
  { name: 'War Pick', damage: '1d8', damageType: 'piercing', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Warhammer', damage: '1d8', damageType: 'bludgeoning', range: '5 ft.', type: 'melee', ability: 'strength' },
  { name: 'Whip', damage: '1d4', damageType: 'slashing', range: '10 ft.', type: 'melee', ability: 'finesse' },

  // Martial Ranged Weapons
  { name: 'Blowgun', damage: '1', damageType: 'piercing', range: '25/100 ft.', type: 'ranged', ability: 'dexterity' },
  { name: 'Crossbow, Hand', damage: '1d6', damageType: 'piercing', range: '30/120 ft.', type: 'ranged', ability: 'dexterity' },
  { name: 'Crossbow, Heavy', damage: '1d10', damageType: 'piercing', range: '100/400 ft.', type: 'ranged', ability: 'dexterity' },
  { name: 'Longbow', damage: '1d8', damageType: 'piercing', range: '150/600 ft.', type: 'ranged', ability: 'dexterity' },
  { name: 'Net', damage: '0', damageType: '', range: '5/15 ft.', type: 'ranged', ability: 'dexterity' },
]

// Weight mappings for weapons and armor (in pounds)
const WEAPON_WEIGHTS: Record<string, number> = {
  'Club': 2, 'Dagger': 1, 'Greatclub': 10, 'Handaxe': 2, 'Javelin': 2, 'Light Hammer': 2,
  'Mace': 4, 'Quarterstaff': 4, 'Sickle': 2, 'Spear': 3, 'Unarmed Strike': 0,
  'Crossbow, Light': 5, 'Dart': 0.25, 'Shortbow': 2, 'Sling': 0,
  'Battleaxe': 4, 'Flail': 2, 'Glaive': 6, 'Greataxe': 7, 'Greatsword': 6, 'Halberd': 6,
  'Lance': 6, 'Longsword': 3, 'Maul': 10, 'Morningstar': 4, 'Pike': 18, 'Rapier': 2,
  'Scimitar': 3, 'Shortsword': 2, 'Trident': 4, 'War Pick': 2, 'Warhammer': 2, 'Whip': 3,
  'Blowgun': 1, 'Crossbow, Hand': 3, 'Crossbow, Heavy': 18, 'Longbow': 2, 'Net': 3,
}

const ARMOR_WEIGHTS: Record<string, number> = {
  'Padded': 8, 'Leather': 10, 'Studded Leather': 13,
  'Hide': 12, 'Chain Shirt': 20, 'Scale Mail': 45, 'Breastplate': 20, 'Half Plate': 40, 'Chain Mail': 55,
  'Ring Mail': 40, 'Splint': 60, 'Plate': 65,
  'Shield': 6,
}

// Comprehensive Item Database combining weapons, armor, and common D&D items
export const ITEM_DATABASE: ItemData[] = [
  // Weapons (from WEAPON_DATABASE)
  ...WEAPON_DATABASE.map(weapon => ({
    name: weapon.name,
    category: 'weapon' as const,
    weight: WEAPON_WEIGHTS[weapon.name] || 2,
    description: `${weapon.type} weapon`,
    weaponData: weapon,
  })),

  // Armor (from ARMOR_DATABASE)
  ...ARMOR_DATABASE.map(armor => ({
    name: armor.name,
    category: armor.type === 'shield' ? 'shield' as const : 'armor' as const,
    weight: ARMOR_WEIGHTS[armor.name] || 10,
    description: `${armor.type} armor`,
    armorData: armor,
  })),

  // Common Adventuring Gear
  { name: 'Backpack', category: 'gear', weight: 5, cost: 2, description: 'A backpack can hold 1 cubic foot/30 pounds of gear.' },
  { name: 'Bedroll', category: 'gear', weight: 7, cost: 1, description: 'A bedroll for sleeping outdoors.' },
  { name: 'Blanket', category: 'gear', weight: 3, cost: 0.5, description: 'A warm blanket.' },
  { name: 'Candle', category: 'gear', weight: 0, cost: 0.01, description: 'A candle that burns for 1 hour.' },
  { name: 'Crowbar', category: 'tool', weight: 5, cost: 2, description: 'Using a crowbar grants advantage to Strength checks where the crowbar\'s leverage can be applied.' },
  { name: 'Grappling Hook', category: 'tool', weight: 4, cost: 2, description: 'A grappling hook attached to rope.' },
  { name: 'Hammer', category: 'tool', weight: 3, cost: 2, description: 'A hammer for construction and repairs.' },
  { name: 'Healer\'s Kit', category: 'tool', weight: 3, cost: 5, description: 'A kit containing bandages, salves, and splints. Using it stabilizes a dying creature.' },
  { name: 'Holy Symbol', category: 'gear', weight: 1, cost: 25, description: 'A holy symbol for spellcasting.' },
  { name: 'Holy Water (flask)', category: 'consumable', weight: 1, cost: 25, description: 'As an action, you can splash the contents of this flask onto a creature within 5 feet of you.' },
  { name: 'Ink (1 ounce bottle)', category: 'gear', weight: 0, cost: 10, description: 'Ink for writing.' },
  { name: 'Ink Pen', category: 'gear', weight: 0, cost: 0.02, description: 'A pen for writing.' },
  { name: 'Lantern, Bullseye', category: 'gear', weight: 2, cost: 10, description: 'A lantern that casts bright light in a 60-foot cone and dim light for an additional 60 feet.' },
  { name: 'Lantern, Hooded', category: 'gear', weight: 2, cost: 5, description: 'A lantern that casts bright light in a 30-foot radius and dim light for an additional 30 feet.' },
  { name: 'Magnifying Glass', category: 'tool', weight: 0, cost: 100, description: 'This lens allows a closer look at small objects.' },
  { name: 'Manacles', category: 'gear', weight: 6, cost: 2, description: 'Manacles can bind a Small or Medium creature.' },
  { name: 'Mess Kit', category: 'gear', weight: 1, cost: 0.2, description: 'A tin box containing a cup and simple cutlery.' },
  { name: 'Oil (flask)', category: 'consumable', weight: 1, cost: 0.1, description: 'Oil usually comes in a clay flask that holds 1 pint.' },
  { name: 'Parchment (one sheet)', category: 'gear', weight: 0, cost: 0.1, description: 'A sheet of parchment for writing.' },
  { name: 'Perfume (vial)', category: 'gear', weight: 0, cost: 5, description: 'A vial of perfume.' },
  { name: 'Piton', category: 'gear', weight: 0.25, cost: 0.05, description: 'A piton for climbing.' },
  { name: 'Pouch', category: 'gear', weight: 1, cost: 0.5, description: 'A leather pouch that can hold up to 20 sling bullets or 50 blowgun needles.' },
  { name: 'Rations (1 day)', category: 'consumable', weight: 2, cost: 0.5, description: 'Rations consist of dry foods suitable for extended travel.' },
  { name: 'Rope, Hempen (50 feet)', category: 'gear', weight: 10, cost: 1, description: 'Rope, whether made of hemp or silk, has 2 hit points and can be burst with a DC 17 Strength check.' },
  { name: 'Rope, Silk (50 feet)', category: 'gear', weight: 5, cost: 10, description: 'Rope, whether made of hemp or silk, has 2 hit points and can be burst with a DC 17 Strength check.' },
  { name: 'Sack', category: 'gear', weight: 0.5, cost: 0.1, description: 'A sack can hold 1 cubic foot/30 pounds of gear.' },
  { name: 'Scale, Merchant\'s', category: 'tool', weight: 3, cost: 5, description: 'A scale includes a small balance, pans, and a suitable assortment of weights.' },
  { name: 'Sealing Wax', category: 'gear', weight: 0, cost: 0.5, description: 'Wax for sealing letters.' },
  { name: 'Shovel', category: 'tool', weight: 5, cost: 2, description: 'A shovel for digging.' },
  { name: 'Signal Whistle', category: 'gear', weight: 0, cost: 0.05, description: 'A whistle that can be heard up to 500 feet away.' },
  { name: 'Signet Ring', category: 'gear', weight: 0, cost: 5, description: 'A ring bearing a seal or symbol.' },
  { name: 'Soap', category: 'gear', weight: 0, cost: 0.02, description: 'A bar of soap.' },
  { name: 'Spellbook', category: 'gear', weight: 3, cost: 50, description: 'Essential for wizards, a spellbook is a leather-bound tome with 100 blank vellum pages suitable for recording spells.' },
  { name: 'Spyglass', category: 'tool', weight: 1, cost: 1000, description: 'Objects viewed through a spyglass are magnified to twice their size.' },
  { name: 'Tinderbox', category: 'gear', weight: 1, cost: 0.5, description: 'This small container holds flint, fire steel, and tinder (usually dry cloth soaked in light oil) used to kindle a fire.' },
  { name: 'Torch', category: 'gear', weight: 1, cost: 0.01, description: 'A torch burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet.' },
  { name: 'Vial', category: 'gear', weight: 0, cost: 1, description: 'A glass vial that can hold up to 4 ounces of liquid.' },
  { name: 'Waterskin', category: 'gear', weight: 5, cost: 0.2, description: 'A waterskin can hold up to 4 pints of liquid.' },
  { name: 'Whetstone', category: 'tool', weight: 1, cost: 0.01, description: 'A stone for sharpening blades.' },

  // Tools
  { name: 'Alchemist\'s Supplies', category: 'tool', weight: 8, cost: 50, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Brewer\'s Supplies', category: 'tool', weight: 9, cost: 20, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Calligrapher\'s Supplies', category: 'tool', weight: 5, cost: 10, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Carpenter\'s Tools', category: 'tool', weight: 6, cost: 8, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Cartographer\'s Tools', category: 'tool', weight: 6, cost: 15, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Cobbler\'s Tools', category: 'tool', weight: 5, cost: 5, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Cook\'s Utensils', category: 'tool', weight: 8, cost: 1, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Glassblower\'s Tools', category: 'tool', weight: 5, cost: 30, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Jeweler\'s Tools', category: 'tool', weight: 2, cost: 25, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Leatherworker\'s Tools', category: 'tool', weight: 5, cost: 5, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Mason\'s Tools', category: 'tool', weight: 8, cost: 10, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Painter\'s Supplies', category: 'tool', weight: 5, cost: 10, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Potter\'s Tools', category: 'tool', weight: 3, cost: 10, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Smith\'s Tools', category: 'tool', weight: 8, cost: 20, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Tinker\'s Tools', category: 'tool', weight: 10, cost: 50, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Weaver\'s Tools', category: 'tool', weight: 5, cost: 1, description: 'These special tools include the items needed to pursue a craft or trade.' },
  { name: 'Woodcarver\'s Tools', category: 'tool', weight: 5, cost: 1, description: 'These special tools include the items needed to pursue a craft or trade.' },

  // Musical Instruments
  { name: 'Bagpipes', category: 'tool', weight: 6, cost: 30, description: 'A musical instrument.' },
  { name: 'Drum', category: 'tool', weight: 3, cost: 6, description: 'A musical instrument.' },
  { name: 'Dulcimer', category: 'tool', weight: 10, cost: 25, description: 'A musical instrument.' },
  { name: 'Flute', category: 'tool', weight: 1, cost: 2, description: 'A musical instrument.' },
  { name: 'Lute', category: 'tool', weight: 2, cost: 35, description: 'A musical instrument.' },
  { name: 'Lyre', category: 'tool', weight: 2, cost: 30, description: 'A musical instrument.' },
  { name: 'Horn', category: 'tool', weight: 2, cost: 3, description: 'A musical instrument.' },
  { name: 'Pan Flute', category: 'tool', weight: 2, cost: 12, description: 'A musical instrument.' },
  { name: 'Shawm', category: 'tool', weight: 1, cost: 2, description: 'A musical instrument.' },
  { name: 'Viol', category: 'tool', weight: 1, cost: 30, description: 'A musical instrument.' },
]

const DND_SKILLS: Array<{ name: string; ability: keyof Character['abilities'] }> = [
  { name: 'Acrobatics', ability: 'dexterity' },
  { name: 'Animal Handling', ability: 'wisdom' },
  { name: 'Arcana', ability: 'intelligence' },
  { name: 'Athletics', ability: 'strength' },
  { name: 'Deception', ability: 'charisma' },
  { name: 'History', ability: 'intelligence' },
  { name: 'Insight', ability: 'wisdom' },
  { name: 'Intimidation', ability: 'charisma' },
  { name: 'Investigation', ability: 'intelligence' },
  { name: 'Medicine', ability: 'wisdom' },
  { name: 'Nature', ability: 'intelligence' },
  { name: 'Perception', ability: 'wisdom' },
  { name: 'Performance', ability: 'charisma' },
  { name: 'Persuasion', ability: 'charisma' },
  { name: 'Religion', ability: 'intelligence' },
  { name: 'Sleight of Hand', ability: 'dexterity' },
  { name: 'Stealth', ability: 'dexterity' },
  { name: 'Survival', ability: 'wisdom' },
]

function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

function calculateProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1
}

function getSneakAttackDice(rogueLevel: number): number {
  // Sneak Attack dice progression: 1-2 → 1d6, 3-4 → 2d6, 5-6 → 3d6, etc.
  return Math.ceil(rogueLevel / 2)
}

function calculateAC(dexModifier: number, baseAC: number = 10, character?: Character): number {
  if (!character) {
    return baseAC + dexModifier
  }

  const equippedArmor = getEquippedArmor(character)
  const equippedShield = getEquippedShield(character)
  let shieldBonus = 0

  // Calculate shield bonus
  if (equippedShield) {
    shieldBonus = equippedShield.baseAC || 2 // Default shield is +2
  }

  // If no armor equipped
  if (!equippedArmor) {
    let unarmoredAC = 10 + dexModifier

    // Barbarian Unarmored Defense: 10 + DEX + CON
    const hasBarbarian = (character.classes ?? []).some(c => c.classType === 'Barbarian')
    if (hasBarbarian && !character.wearingArmor) {
      const conModifier = character.abilities.constitution.modifier
      unarmoredAC = 10 + dexModifier + conModifier
    }

    return unarmoredAC + shieldBonus
  }

  // Get armor data (from database or item's own data)
  const armorData = equippedArmor.baseAC !== undefined
    ? { type: equippedArmor.armorType!, baseAC: equippedArmor.baseAC }
    : getArmorData(equippedArmor.name)

  if (!armorData) {
    // Fallback: if armor not in database and no baseAC, use default
    return 10 + dexModifier + shieldBonus
  }

  let ac = armorData.baseAC

  // Apply DEX modifier based on armor type
  if (armorData.type === 'light') {
    // Light Armor: base AC + full DEX modifier
    ac += dexModifier
  } else if (armorData.type === 'medium') {
    // Medium Armor: base AC + DEX modifier (max +2)
    ac += Math.min(dexModifier, 2)
  } else if (armorData.type === 'heavy') {
    // Heavy Armor: base AC only (no DEX bonus)
    // ac remains as baseAC
  }

  // Add shield bonus
  ac += shieldBonus

  // Fighter Fighting Style: Defense (+1 AC while wearing armor)
  if (character.fightingStyle === 'Defense') {
    ac += 1
  }

  return ac
}

function calculateInitiative(dexModifier: number): number {
  return dexModifier
}

function getArmorData(armorName: string): ArmorData | null {
  return ARMOR_DATABASE.find(armor => armor.name.toLowerCase() === armorName.toLowerCase()) || null
}

function getEquippedArmor(character: Character): InventoryItem | null {
  return character.inventory.find(item =>
    item.equipped &&
    item.armorType &&
    ['light', 'medium', 'heavy'].includes(item.armorType)
  ) || null
}

function getEquippedShield(character: Character): InventoryItem | null {
  return character.inventory.find(item =>
    item.equipped &&
    item.armorType === 'shield'
  ) || null
}

function getWeaponData(weaponName: string): WeaponData | null {
  return WEAPON_DATABASE.find(weapon => weapon.name.toLowerCase() === weaponName.toLowerCase()) || null
}

function getEquippedWeapons(character: Character): InventoryItem[] {
  return character.inventory.filter(item =>
    item.equipped &&
    !item.armorType && // Not armor or shield
    getWeaponData(item.name) !== null // Is a weapon
  )
}

function generateAttackFromWeapon(weapon: InventoryItem, character: Character): Action {
  const weaponData = getWeaponData(weapon.name)
  if (!weaponData) {
    // Fallback if weapon not found
    return {
      id: crypto.randomUUID(),
      name: weapon.name,
      type: 'Melee Weapon Attack',
      range: '5 ft.',
      toHit: '+0',
      damage: '1d4',
      description: '',
      isBasicAttack: true,
    }
  }

  // Get ability modifier based on weapon type
  const strModifier = character.abilities.strength.modifier
  const dexModifier = character.abilities.dexterity.modifier
  let abilityModifier = 0

  if (weaponData.ability === 'strength') {
    abilityModifier = strModifier
  } else if (weaponData.ability === 'dexterity') {
    abilityModifier = dexModifier
  } else if (weaponData.ability === 'finesse') {
    // For finesse weapons, use the higher of STR or DEX
    abilityModifier = Math.max(strModifier, dexModifier)
  }

  const proficiencyBonus = character.proficiencyBonus
  let toHitModifier = abilityModifier + proficiencyBonus

  // Apply Archery fighting style bonus (+2 to attack rolls with ranged weapons)
  if (character.fightingStyle === 'Archery' && weaponData.type === 'ranged') {
    toHitModifier += 2
  }

  const toHitString = toHitModifier >= 0 ? `+${toHitModifier}` : `${toHitModifier}`

  // Calculate damage (weapon damage + ability modifier)
  // Always include ability modifier in damage, even if it's 0 or negative
  let damageString = weaponData.damage
  if (abilityModifier > 0) {
    damageString += ` + ${abilityModifier}`
  } else if (abilityModifier < 0) {
    damageString += ` ${abilityModifier}` // Negative numbers already have the minus sign
  } else {
    // For ability modifier of 0, still show it for clarity (optional, but helps with consistency)
    damageString += ` + 0`
  }
  damageString += ` ${weaponData.damageType}`

  // Add rage damage bonus for Barbarian (only for STR-based attacks)
  const hasBarbarian = (character.classes ?? []).some(c => c.classType === 'Barbarian')
  const usingStrength = weaponData.ability === 'strength' ||
    (weaponData.ability === 'finesse' && strModifier >= dexModifier)
  if (hasBarbarian && character.rage?.active && usingStrength) {
    damageString += ` + ${character.rage.damageBonus} (rage)`
  }

  return {
    id: crypto.randomUUID(),
    name: weapon.name,
    type: weaponData.type === 'melee' ? 'Melee Weapon Attack' : 'Ranged Weapon Attack',
    range: weaponData.range,
    toHit: toHitString,
    damage: damageString,
    description: '',
    isBasicAttack: true,
  }
}

function generateUnarmedStrike(character: Character): Action {
  const strModifier = character.abilities.strength.modifier
  const proficiencyBonus = character.proficiencyBonus
  const toHitModifier = strModifier + proficiencyBonus
  const toHitString = toHitModifier >= 0 ? `+${toHitModifier}` : `${toHitModifier}`

  let damageString = '1'
  if (strModifier !== 0) {
    damageString += strModifier >= 0 ? ` + ${strModifier}` : ` ${strModifier}`
  }
  damageString += ' bludgeoning'

  // Add rage damage bonus for Barbarian
  const hasBarbarian = (character.classes ?? []).some(c => c.classType === 'Barbarian')
  if (hasBarbarian && character.rage?.active) {
    damageString += ` + ${character.rage.damageBonus} (rage)`
  }

  return {
    id: crypto.randomUUID(),
    name: 'Unarmed Strike',
    type: 'Melee Weapon Attack',
    range: '5 ft.',
    toHit: toHitString,
    damage: damageString,
    description: '',
    isBasicAttack: true,
  }
}

function generateSneakAttack(character: Character): Action | null {
  const rogueClass = (character.classes ?? []).find(c => c.classType === 'Rogue')
  if (!rogueClass) return null

  const sneakAttackDice = getSneakAttackDice(rogueClass.level)
  const damageString = `${sneakAttackDice}d6`

  return {
    id: crypto.randomUUID(),
    name: 'Sneak Attack',
    type: 'Special',
    range: '-',
    toHit: '-',
    damage: damageString,
    description: 'Once per turn, when you hit with a Finesse or Ranged weapon, you can add this damage if you have Advantage or an ally is within 5 feet of the target.',
    isBasicAttack: true,
  }
}

function generateDashBonusAction(character: Character): Action {
  return {
    id: crypto.randomUUID(),
    name: 'Dash (Bonus)',
    type: 'Bonus Action',
    range: 'Self',
    toHit: '-',
    damage: '-',
    description: 'When you take the Dash action, you gain extra movement for the current turn. The increase equals your speed, after applying any modifiers. With a speed of 30 feet, for example, you can move up to 60 feet on your turn if you dash.',
    isBonusAction: true,
  }
}

function generateDisengageBonusAction(character: Character): Action {
  return {
    id: crypto.randomUUID(),
    name: 'Disengage (Bonus)',
    type: 'Bonus Action',
    range: 'Self',
    toHit: '-',
    damage: '-',
    description: 'If you take the Disengage action, your movement doesn\'t provoke opportunity attacks for the rest of the turn.',
    isBonusAction: true,
  }
}

function generateHideBonusAction(character: Character): Action {
  return {
    id: crypto.randomUUID(),
    name: 'Hide (Bonus)',
    type: 'Bonus Action',
    range: 'Self',
    toHit: '-',
    damage: '-',
    description: 'When you take the Hide action, you make a Dexterity (Stealth) check in an attempt to hide, following the rules for hiding. If you succeed, you gain certain benefits, as described in the "Unseen Attackers and Targets" section later in this chapter.',
    isBonusAction: true,
  }
}

function generateLayOnHandsAction(character: Character): Action {
  const paladinClass = (character.classes ?? []).find(c => c.classType === 'Paladin')
  if (!paladinClass) return null as any

  const layOnHandsPool = character.resources?.layOnHands
  const poolInfo = layOnHandsPool
    ? ` (${layOnHandsPool.current} / ${layOnHandsPool.max} HP remaining)`
    : ''

  return {
    id: crypto.randomUUID(),
    name: 'Lay on Hands',
    type: 'Action',
    range: 'Touch',
    toHit: '-',
    damage: '-',
    description: `You have a pool of healing power that replenishes when you take a Long Rest. With that pool, you can restore a total number of Hit Points equal to your Paladin level × 5. As an action, you can touch a creature and draw power from the pool to restore a number of Hit Points to that creature, up to the maximum amount remaining in your pool. Alternatively, you can expend 5 Hit Points from the pool of healing to cure the target of one disease or neutralize one poison affecting it.${poolInfo}`,
    isBasicAttack: true,
  }
}

let isUpdatingBasicAttacks = false

function updateBasicAttacks(character: Character): void {
  // Guard against recursive calls
  if (isUpdatingBasicAttacks) return
  isUpdatingBasicAttacks = true

  try {
    // Collect what we need to add
    const actionsToAdd: Action[] = []

    // Generate unarmed strike (always available) - but check if it was manually converted
    const existingUnarmed = character.actions.find(a => a.name === 'Unarmed Strike' && !a.isBasicAttack)
    if (!existingUnarmed) {
      actionsToAdd.push(generateUnarmedStrike(character))
    }

    // Generate attacks for equipped weapons (but skip if manually converted)
    const equippedWeapons = getEquippedWeapons(character)
    equippedWeapons.forEach(weapon => {
      // Check if this weapon's attack was manually converted
      const existingWeaponAttack = character.actions.find(
        a => a.name === weapon.name && !a.isBasicAttack
      )
      if (!existingWeaponAttack) {
        actionsToAdd.push(generateAttackFromWeapon(weapon, character))
      }
    })

    // Generate Sneak Attack for Rogues (but skip if manually converted)
    const existingSneakAttack = character.actions.find(a => a.name === 'Sneak Attack' && !a.isBasicAttack)
    const rogueClass = (character.classes ?? []).find(c => c.classType === 'Rogue')
    if (rogueClass) {
      const expectedDice = getSneakAttackDice(rogueClass.level)
      const expectedDamage = `${expectedDice}d6`

      // Check if Sneak Attack exists and has correct dice count
      const existingBasicSneakAttack = character.actions.find(a => a.name === 'Sneak Attack' && a.isBasicAttack)
      if (!existingBasicSneakAttack || existingBasicSneakAttack.damage !== expectedDamage) {
        // Will remove old one below, then add new one
        const sneakAttack = generateSneakAttack(character)
        if (sneakAttack) {
          actionsToAdd.push(sneakAttack)
        }
      }

      // Generate Cunning Action bonus actions for Rogue level 2+ (but skip if manually converted)
      if (rogueClass.level >= 2) {
        const bonusActionNames = ['Dash (Bonus)', 'Disengage (Bonus)', 'Hide (Bonus)']
        bonusActionNames.forEach(actionName => {
          const existingBonusAction = character.actions.find(
            a => a.name === actionName && !a.isBonusAction
          )
          if (!existingBonusAction) {
            if (actionName === 'Dash (Bonus)') {
              actionsToAdd.push(generateDashBonusAction(character))
            } else if (actionName === 'Disengage (Bonus)') {
              actionsToAdd.push(generateDisengageBonusAction(character))
            } else if (actionName === 'Hide (Bonus)') {
              actionsToAdd.push(generateHideBonusAction(character))
            }
          }
        })
      }
    }

    // Generate Lay on Hands for Paladins (but skip if manually converted)
    const paladinClass = (character.classes ?? []).find(c => c.classType === 'Paladin')
    if (paladinClass && paladinClass.level >= 1) {
      const existingLayOnHands = character.actions.find(a => a.name === 'Lay on Hands' && !a.isBasicAttack)
      if (!existingLayOnHands) {
        const layOnHands = generateLayOnHandsAction(character)
        if (layOnHands) {
          actionsToAdd.push(layOnHands)
        }
      }
    }

    // Check if we need to remove Sneak Attack when Rogue is removed
    const hasSneakAttack = character.actions.some(a => a.name === 'Sneak Attack' && a.isBasicAttack)
    const needsSneakAttackRemoval = !rogueClass && hasSneakAttack

    // Check if we need to remove bonus actions when Rogue level < 2 or Rogue is removed
    const hasBonusActions = character.actions.some(a => a.isBonusAction)
    const needsBonusActionRemoval = (!rogueClass || (rogueClass && rogueClass.level < 2)) && hasBonusActions

    // Check if we need to remove Lay on Hands when Paladin is removed
    const hasLayOnHands = character.actions.some(a => a.name === 'Lay on Hands' && a.isBasicAttack)
    const needsLayOnHandsRemoval = (!paladinClass || (paladinClass && paladinClass.level < 1)) && hasLayOnHands

    // Check if there are any changes needed
    const basicAttackNames = new Set(actionsToAdd.map(a => a.name))

    // Helper function to check if a weapon attack needs updating
    const checkWeaponAttackNeedsUpdate = (action: Action, weapon: InventoryItem): boolean => {
      const weaponData = getWeaponData(weapon.name)
      if (!weaponData) return false

      // Generate expected attack to compare
      const expectedAttack = generateAttackFromWeapon(weapon, character)

      // Compare to-hit modifiers
      if (action.toHit !== expectedAttack.toHit) return true

      // Compare damage (but ignore rage bonus which is dynamic)
      const actionDamageBase = action.damage.replace(/\s*\+\s*\d+\s*\(rage\)/g, '').trim()
      const expectedDamageBase = expectedAttack.damage.replace(/\s*\+\s*\d+\s*\(rage\)/g, '').trim()
      if (actionDamageBase !== expectedDamageBase) return true

      return false
    }

    const hasChanges = character.actions.some(action => {
      if (!action.isBasicAttack && !action.isBonusAction) return false
      // Check if we need to update this basic attack
      if (action.name === 'Sneak Attack') {
        if (!rogueClass) return true // Should be removed
        const expectedDice = getSneakAttackDice(rogueClass.level)
        return action.damage !== `${expectedDice}d6`
      }
      // Check Unarmed Strike
      if (action.name === 'Unarmed Strike') {
        const expectedUnarmed = generateUnarmedStrike(character)
        if (action.toHit !== expectedUnarmed.toHit || action.damage !== expectedUnarmed.damage) {
          return true
        }
      }
      // Check weapon attacks - compare with expected values
      const equippedWeapons = getEquippedWeapons(character)
      for (const weapon of equippedWeapons) {
        if (action.name === weapon.name && action.isBasicAttack) {
          if (checkWeaponAttackNeedsUpdate(action, weapon)) {
            return true
          }
        }
      }
      // Check bonus actions
      if (action.isBonusAction) {
        if (!rogueClass || rogueClass.level < 2) return true // Should be removed
        return !basicAttackNames.has(action.name) // Should be removed if not in our list
      }
      return !basicAttackNames.has(action.name) // Should be removed if not in our list
    })

    if (!hasChanges && actionsToAdd.length === 0 && !needsSneakAttackRemoval && !needsBonusActionRemoval && !needsLayOnHandsRemoval) {
      return // No changes needed
    }

    // Remove existing basic attacks and bonus actions (but preserve manually converted ones)
    // Only remove actions that are still marked as basic attacks or bonus actions
    character.actions = character.actions.filter(action => !action.isBasicAttack && !action.isBonusAction)

    // Add all new basic attacks
    character.actions.push(...actionsToAdd)
  } finally {
    isUpdatingBasicAttacks = false
  }
}

function createAbilityScore(score: number = 10, saveProficient: boolean = false, proficiencyBonus: number = 0, customModifier: number = 0): AbilityScore {
  // Final score is base score + custom modifier
  const finalScore = score + customModifier
  // Modifier is calculated from the final score
  const modifier = calculateModifier(finalScore)
  return {
    score,
    modifier,
    customModifier,
    saveProficient,
    saveModifier: modifier + (saveProficient ? proficiencyBonus : 0),
  }
}

function createEmptyCharacter(): Character {
  const level = 1
  const proficiencyBonus = calculateProficiencyBonus(level)
  const emptyAbilities = {
    strength: createAbilityScore(10, false, proficiencyBonus, 0),
    dexterity: createAbilityScore(10, false, proficiencyBonus, 0),
    constitution: createAbilityScore(10, false, proficiencyBonus, 0),
    intelligence: createAbilityScore(10, false, proficiencyBonus, 0),
    wisdom: createAbilityScore(10, false, proficiencyBonus, 0),
    charisma: createAbilityScore(10, false, proficiencyBonus, 0),
  }

  const emptySkills = DND_SKILLS.map(skill => {
    const abilityKey = skill.ability as keyof typeof emptyAbilities
    const abilityModifier = calculateModifier(emptyAbilities[abilityKey].score)
    return {
      name: skill.name,
      ability: skill.ability,
      proficient: false,
      modifier: abilityModifier,
    }
  })

  return {
    name: '',
    classLevel: '',
    level: level,
    experiencePoints: {
      current: 0,
      nextLevel: 300, // XP needed for level 2
    },
    ac: 10, // Will be recalculated
    hitPoints: {
      current: 0,
      maximum: 0,
      temporary: 0,
    },
    initiative: 0, // Will be recalculated
    proficiencyBonus,
    inspiration: false,
    abilities: emptyAbilities,
    senses: {
      passivePerception: 0,
      passiveInvestigation: 0,
      passiveInsight: 0,
    },
    skills: emptySkills,
    actions: [],
    spellSlots: [],
    spells: [],
    inventory: [],
    featuresTraits: [],
    classes: [],
    classType: undefined,
    fightingStyle: undefined,
    weaponMastery: [],
    wearingArmor: false,
    background: {
      name: '',
      personalityTraits: '',
      ideals: '',
      bonds: '',
      flaws: '',
      backstory: '',
    },
  }
}

function applyFighterLevel1(character: Character, selectedSkills: string[], selectedFightingStyle: string, selectedWeaponMasteries: string[]): void {
  const level = 1
  const proficiencyBonus = calculateProficiencyBonus(level)

  // Set hit points (starting HP from class progression spec)
  const conModifier = character.abilities.constitution.modifier
  const startingHp = getStartingHpBase('Fighter', conModifier)
  character.hitPoints.maximum = startingHp
  character.hitPoints.current = startingHp

  // Set classes array (multiclass support)
  character.classes = [{ classType: 'Fighter', level: 1 }]
  character.classLevel = 'Fighter 1'
  character.classType = 'Fighter' // Keep for migration compatibility
  character.level = level
  character.proficiencyBonus = proficiencyBonus

  // Set saving throw proficiencies: Strength and Constitution
  character.abilities.strength.saveProficient = true
  character.abilities.strength.saveModifier = character.abilities.strength.modifier + proficiencyBonus
  character.abilities.constitution.saveProficient = true
  character.abilities.constitution.saveModifier = character.abilities.constitution.modifier + proficiencyBonus

  // Apply skill proficiencies (2 selected skills)
  character.skills.forEach(skill => {
    if (selectedSkills.includes(skill.name)) {
      skill.proficient = true
      skill.modifier = skill.modifier + proficiencyBonus
    }
  })

  // Set Fighting Style
  character.fightingStyle = selectedFightingStyle
  const fightingStyleData = FIGHTING_STYLES.find(style => style.name === selectedFightingStyle)
  if (fightingStyleData) {
    character.featuresTraits.push({
      id: crypto.randomUUID(),
      name: `Fighting Style: ${selectedFightingStyle}`,
      description: fightingStyleData.description,
      source: 'Class',
    })
  }

  // Set Weapon Mastery
  character.weaponMastery = selectedWeaponMasteries
  const weaponMasteryDescriptions = selectedWeaponMasteries.map(weaponName => {
    const weapon = WEAPON_MASTERY_WEAPONS.find(w => w.name === weaponName)
    return weapon ? `${weapon.name} (${weapon.mastery})` : weaponName
  }).join(', ')
  character.featuresTraits.push({
    id: crypto.randomUUID(),
    name: 'Weapon Mastery',
    description: `You can use the Mastery property of the following weapons: ${weaponMasteryDescriptions}.`,
    source: 'Class',
  })

  // Add weapon and armor proficiencies as features/traits
  const proficiencies: FeatureTrait[] = [
    {
      id: crypto.randomUUID(),
      name: 'Weapon Proficiency: Simple Weapons',
      description: 'Proficient with all simple weapons.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Weapon Proficiency: Martial Weapons',
      description: 'Proficient with all martial weapons.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Light Armor',
      description: 'Proficient with light armor.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Medium Armor',
      description: 'Proficient with medium armor.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Heavy Armor',
      description: 'Proficient with heavy armor.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Shields',
      description: 'Proficient with shields.',
      source: 'Class',
    },
  ]

  character.featuresTraits = [...character.featuresTraits, ...proficiencies]

  // Add class features from spec (level 1)
  character.featuresTraits = addMissingClassFeatures(character.featuresTraits, 'Fighter', 1)

  // Recalculate AC and Initiative
  const dexModifier = character.abilities.dexterity.modifier
  character.ac = calculateAC(dexModifier, 10, character)
  character.initiative = calculateInitiative(dexModifier)
}

function applyBarbarianLevel1(character: Character, selectedSkills: string[], selectedWeaponMasteries: string[]): void {
  const level = 1
  const proficiencyBonus = calculateProficiencyBonus(level)
  const conModifier = character.abilities.constitution.modifier

  // Set hit points (starting HP from class progression spec)
  const startingHp = getStartingHpBase('Barbarian', conModifier)
  character.hitPoints.maximum = startingHp
  character.hitPoints.current = startingHp

  // Set classes array (multiclass support)
  character.classes = [{ classType: 'Barbarian', level: 1 }]
  character.classLevel = 'Barbarian 1'
  character.classType = 'Barbarian' // Keep for migration compatibility
  character.level = level
  character.proficiencyBonus = proficiencyBonus

  // Set saving throw proficiencies: Strength and Constitution
  character.abilities.strength.saveProficient = true
  character.abilities.strength.saveModifier = character.abilities.strength.modifier + proficiencyBonus
  character.abilities.constitution.saveProficient = true
  character.abilities.constitution.saveModifier = character.abilities.constitution.modifier + proficiencyBonus

  // Apply skill proficiencies (2 selected skills)
  character.skills.forEach(skill => {
    if (selectedSkills.includes(skill.name)) {
      skill.proficient = true
      skill.modifier = skill.modifier + proficiencyBonus
    }
  })

  // Set Weapon Mastery (2 melee weapons)
  character.weaponMastery = selectedWeaponMasteries
  const weaponMasteryDescriptions = selectedWeaponMasteries.map(weaponName => {
    const weapon = WEAPON_MASTERY_WEAPONS.find(w => w.name === weaponName)
    return weapon ? `${weapon.name} (${weapon.mastery})` : weaponName
  }).join(', ')
  character.featuresTraits.push({
    id: crypto.randomUUID(),
    name: 'Weapon Mastery',
    description: `You can use the Mastery property of the following weapons: ${weaponMasteryDescriptions}.`,
    source: 'Class',
  })

  // Add Rage resources (class feature text comes from spec)
  character.rage = {
    active: false,
    usesAvailable: 2,
    usesMax: 2,
    damageBonus: 2,
  }
  character.featuresTraits = addMissingClassFeatures(character.featuresTraits, 'Barbarian', 1)

  // Add weapon and armor proficiencies as features/traits
  const proficiencies: FeatureTrait[] = [
    {
      id: crypto.randomUUID(),
      name: 'Weapon Proficiency: Simple Weapons',
      description: 'Proficient with all simple weapons.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Weapon Proficiency: Martial Weapons',
      description: 'Proficient with all martial weapons.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Light Armor',
      description: 'Proficient with light armor.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Medium Armor',
      description: 'Proficient with medium armor.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Shields',
      description: 'Proficient with shields.',
      source: 'Class',
    },
  ]

  character.featuresTraits = [...character.featuresTraits, ...proficiencies]

  // Set wearingArmor to false by default (for Unarmored Defense)
  character.wearingArmor = false

  // Recalculate AC and Initiative
  const dexModifier = character.abilities.dexterity.modifier
  // Unarmored Defense: 10 + DEX + CON
  character.ac = calculateAC(dexModifier, 10, character)
  character.initiative = calculateInitiative(dexModifier)
}

function createNewCharacter(characterClass: string, selectedSkills: string[], selectedFightingStyle: string | undefined, selectedWeaponMasteries: string[], selectedExpertise?: string[]): Character {
  const character = createEmptyCharacter()

  if (characterClass === 'Fighter') {
    if (!selectedFightingStyle) {
      throw new Error('Fighting Style is required for Fighter')
    }
    applyFighterLevel1(character, selectedSkills, selectedFightingStyle, selectedWeaponMasteries)
  } else if (characterClass === 'Barbarian') {
    applyBarbarianLevel1(character, selectedSkills, selectedWeaponMasteries)
  } else if (characterClass === 'Rogue') {
    if (!selectedExpertise || selectedExpertise.length !== 2) {
      throw new Error('Expertise selection is required for Rogue (2 skills)')
    }
    applyRogueLevel1(character, selectedSkills, selectedExpertise, selectedWeaponMasteries)
  } else if (characterClass === 'Paladin') {
    // Paladin gets fighting style at level 2, not level 1
    applyPaladinLevel1(character, selectedSkills, selectedFightingStyle || undefined, selectedWeaponMasteries)
  }

  // Initialize basic attacks (unarmed strike)
  updateBasicAttacks(character)

  return character
}

function applyRogueLevel1(character: Character, selectedSkills: string[], selectedExpertise: string[], selectedWeaponMasteries: string[]): void {
  const level = 1
  const proficiencyBonus = calculateProficiencyBonus(level)
  const conModifier = character.abilities.constitution.modifier

  // Set hit points (starting HP from class progression spec)
  const startingHp = getStartingHpBase('Rogue', conModifier)
  character.hitPoints.maximum = startingHp
  character.hitPoints.current = startingHp

  // Set classes array (multiclass support)
  character.classes = [{ classType: 'Rogue', level: 1 }]
  character.classLevel = 'Rogue 1'
  character.classType = 'Rogue' // Keep for migration compatibility
  character.level = level
  character.proficiencyBonus = proficiencyBonus

  // Set saving throw proficiencies: Dexterity and Intelligence
  character.abilities.dexterity.saveProficient = true
  character.abilities.dexterity.saveModifier = character.abilities.dexterity.modifier + proficiencyBonus
  character.abilities.intelligence.saveProficient = true
  character.abilities.intelligence.saveModifier = character.abilities.intelligence.modifier + proficiencyBonus

  // Apply skill proficiencies (4 selected skills)
  character.skills.forEach(skill => {
    if (selectedSkills.includes(skill.name)) {
      skill.proficient = true
    }
  })

  // Apply Expertise to 2 selected skills
  character.skills.forEach(skill => {
    if (selectedExpertise.includes(skill.name)) {
      skill.expertise = true
    }
  })

  // Recalculate skill modifiers to include proficiency and expertise bonuses
  character.skills.forEach(skill => {
    const ability = character.abilities[skill.ability]
    const finalScore = ability.score + (ability.customModifier || 0)
    const abilityModifier = calculateModifier(finalScore)
    const expertiseBonus = skill.expertise ? proficiencyBonus : 0
    skill.modifier = abilityModifier + (skill.proficient ? proficiencyBonus : 0) + expertiseBonus
  })

  // Set Weapon Mastery (2 weapons)
  character.weaponMastery = selectedWeaponMasteries
  const weaponMasteryDescriptions = selectedWeaponMasteries.map(weaponName => {
    const weapon = WEAPON_MASTERY_WEAPONS.find(w => w.name === weaponName)
    return weapon ? `${weapon.name} (${weapon.mastery})` : weaponName
  }).join(', ')
  character.featuresTraits.push({
    id: crypto.randomUUID(),
    name: 'Weapon Mastery',
    description: `You can use the Mastery property of the following weapons: ${weaponMasteryDescriptions}.`,
    source: 'Class',
  })

  // Add class features from spec (level 1)
  character.featuresTraits = addMissingClassFeatures(character.featuresTraits, 'Rogue', 1)

  // Add weapon and armor proficiencies as features/traits
  const proficiencies: FeatureTrait[] = [
    {
      id: crypto.randomUUID(),
      name: 'Weapon Proficiency: Simple Weapons',
      description: 'Proficient with all simple weapons.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Weapon Proficiency: Martial Weapons (Finesse)',
      description: 'Proficient with martial weapons that have the Finesse property.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Tool Proficiency: Thieves\' Tools',
      description: 'Proficient with Thieves\' Tools.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Light Armor',
      description: 'Proficient with light armor.',
      source: 'Class',
    },
  ]

  character.featuresTraits = [...character.featuresTraits, ...proficiencies]

  // Recalculate AC and Initiative
  const dexModifier = character.abilities.dexterity.modifier
  character.ac = calculateAC(dexModifier, 10, character)
  character.initiative = calculateInitiative(dexModifier)
}

function applyPaladinLevel1(character: Character, selectedSkills: string[], selectedFightingStyle: string | undefined, selectedWeaponMasteries: string[]): void {
  const level = 1
  const proficiencyBonus = calculateProficiencyBonus(level)
  const conModifier = character.abilities.constitution.modifier

  // Set hit points (starting HP: 10 + CON)
  const startingHp = 10 + conModifier
  character.hitPoints.maximum = startingHp
  character.hitPoints.current = startingHp

  // Set classes array (multiclass support)
  character.classes = [{ classType: 'Paladin', level: 1 }]
  character.classLevel = 'Paladin 1'
  character.classType = 'Paladin' // Keep for migration compatibility
  character.level = level
  character.proficiencyBonus = proficiencyBonus

  // Set saving throw proficiencies: Wisdom and Charisma
  character.abilities.wisdom.saveProficient = true
  character.abilities.wisdom.saveModifier = character.abilities.wisdom.modifier + proficiencyBonus
  character.abilities.charisma.saveProficient = true
  character.abilities.charisma.saveModifier = character.abilities.charisma.modifier + proficiencyBonus

  // Apply skill proficiencies (2 selected skills)
  character.skills.forEach(skill => {
    if (selectedSkills.includes(skill.name)) {
      skill.proficient = true
    }
  })

  // Recalculate skill modifiers to include proficiency bonus
  character.skills.forEach(skill => {
    const ability = character.abilities[skill.ability]
    const finalScore = ability.score + (ability.customModifier || 0)
    const abilityModifier = calculateModifier(finalScore)
    skill.modifier = abilityModifier + (skill.proficient ? proficiencyBonus : 0)
  })

  // Set Fighting Style (only if provided - Paladin gets it at level 2, not level 1)
  if (selectedFightingStyle) {
    character.fightingStyle = selectedFightingStyle
    const fightingStyleData = FIGHTING_STYLES.find(style => style.name === selectedFightingStyle)
    if (fightingStyleData) {
      character.featuresTraits.push({
        id: crypto.randomUUID(),
        name: `Fighting Style: ${selectedFightingStyle}`,
        description: fightingStyleData.description,
        source: 'Class',
      })
    }
  }

  // Set Weapon Mastery (2 weapons)
  character.weaponMastery = selectedWeaponMasteries
  const weaponMasteryDescriptions = selectedWeaponMasteries.map(weaponName => {
    const weapon = WEAPON_MASTERY_WEAPONS.find(w => w.name === weaponName)
    return weapon ? `${weapon.name} (${weapon.mastery})` : weaponName
  }).join(', ')
  character.featuresTraits.push({
    id: crypto.randomUUID(),
    name: 'Weapon Mastery',
    description: `You can use the Mastery property of the following weapons: ${weaponMasteryDescriptions}.`,
    source: 'Class',
  })

  // Add level 1 features (Divine Sense, Lay on Hands, Weapon Mastery)
  character.featuresTraits = addMissingClassFeatures(character.featuresTraits, 'Paladin', 1)

  // Add weapon and armor proficiencies as features/traits
  const proficiencies: FeatureTrait[] = [
    {
      id: crypto.randomUUID(),
      name: 'Weapon Proficiency: Simple Weapons',
      description: 'Proficient with all simple weapons.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Weapon Proficiency: Martial Weapons',
      description: 'Proficient with all martial weapons.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Light Armor',
      description: 'Proficient with light armor.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Medium Armor',
      description: 'Proficient with medium armor.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Heavy Armor',
      description: 'Proficient with heavy armor.',
      source: 'Class',
    },
    {
      id: crypto.randomUUID(),
      name: 'Armor Proficiency: Shields',
      description: 'Proficient with shields.',
      source: 'Class',
    },
  ]

  character.featuresTraits = [...character.featuresTraits, ...proficiencies]

  // Initialize spell slots (empty at level 1, will be added at level 2)
  character.spellSlots = []

  // Recalculate AC and Initiative
  const dexModifier = character.abilities.dexterity.modifier
  character.ac = calculateAC(dexModifier, 10, character)
  character.initiative = calculateInitiative(dexModifier)
}

export const useCharacter = () => {
  const parseClassTypeFromClassLevel = (classLevel: string): ClassType | undefined => {
    const firstToken = classLevel.trim().split(/\s+/)[0]
    const validTypes: readonly ClassType[] = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard']
    return validTypes.includes(firstToken as ClassType) ? (firstToken as ClassType) : undefined
  }

  const formatClassLevelString = (classes: ClassEntry[]): string => {
    if (classes.length === 0) return 'No Class'
    if (classes.length === 1) return `${classes[0].classType} ${classes[0].level}`
    return classes.map(c => `${c.classType} ${c.level}`).join(' / ')
  }

  const getTotalLevel = (classes: ClassEntry[]): number => {
    return classes.reduce((sum, c) => sum + c.level, 0)
  }

  const getClassLevel = (classes: ClassEntry[], classType: ClassType): number => {
    const entry = classes.find(c => c.classType === classType)
    return entry?.level ?? 0
  }

  const getAllClasses = (): ClassEntry[] => {
    return character.value.classes ?? []
  }

  // Migration: convert old single-class model to new multiclass model
  const migrateToMulticlass = (): void => {
    if (character.value.classes && character.value.classes.length > 0) return

    if (character.value.classType) {
      const level = character.value.level || 1
      character.value.classes = [{ classType: character.value.classType, level }]
      character.value.classLevel = formatClassLevelString(character.value.classes)
    } else {
      character.value.classes = []
      character.value.classLevel = 'No Class'
    }
  }

  const proficiencyBonus = 3
  const initialAbilities = {
    strength: createAbilityScore(16, true, proficiencyBonus, 0), // Fighter with STR save
    dexterity: createAbilityScore(14, false, proficiencyBonus, 0),
    constitution: createAbilityScore(15, true, proficiencyBonus, 0), // Fighter with CON save
    intelligence: createAbilityScore(10, false, proficiencyBonus, 0),
    wisdom: createAbilityScore(12, false, proficiencyBonus, 0),
    charisma: createAbilityScore(8, false, proficiencyBonus, 0),
  }

  const character = useState<Character>('character', () => ({
    name: 'Thorin Ironforge',
    classes: [{ classType: 'Fighter', level: 5 }],
    classLevel: 'Fighter 5',
    level: 5,
    experiencePoints: {
      current: 14000,
      nextLevel: 28000, // XP needed for level 6
    },
    ac: 18,
    hitPoints: {
      current: 45,
      maximum: 52,
      temporary: 0,
    },
    initiative: 2,
    proficiencyBonus,
    inspiration: false,
    abilities: initialAbilities,
    senses: {
      passivePerception: 0,
      passiveInvestigation: 0,
      passiveInsight: 0,
    },
    // Class-specific
    classType: 'Fighter',
    fightingStyle: 'Defense',
    weaponMastery: ['Longsword', 'Greatsword', 'Warhammer'],
    skills: DND_SKILLS.map(skill => {
      const abilityKey = skill.ability as keyof typeof initialAbilities
      const abilityModifier = calculateModifier(initialAbilities[abilityKey].score)
      // Mark some skills as proficient (Athletics, Perception, Survival for a Fighter)
      const proficientSkills = ['Athletics', 'Perception', 'Survival', 'Intimidation']
      const proficient = proficientSkills.includes(skill.name)
      return {
        name: skill.name,
        ability: skill.ability,
        proficient,
        modifier: abilityModifier + (proficient ? proficiencyBonus : 0),
      }
    }),
    actions: [
      {
        id: crypto.randomUUID(),
        name: 'Longsword',
        type: 'Melee Weapon Attack',
        range: '5 ft.',
        toHit: '+7',
        damage: '1d8 + 3 slashing',
        description: 'Versatile (1d10)',
      },
      {
        id: crypto.randomUUID(),
        name: 'Shield Bash',
        type: 'Melee Weapon Attack',
        range: '5 ft.',
        toHit: '+7',
        damage: '1d4 + 3 bludgeoning',
        description: 'Bonus action after attacking with a weapon',
      },
    ],
    spellSlots: [
      { level: 1, total: 0, used: 0 },
      { level: 2, total: 0, used: 0 },
    ],
    spells: [],
    inventory: [
      {
        id: crypto.randomUUID(),
        name: 'Longsword',
        quantity: 1,
        weight: 3,
        description: 'A well-crafted longsword with a leather-wrapped hilt',
      },
      {
        id: crypto.randomUUID(),
        name: 'Shield',
        quantity: 1,
        weight: 6,
        description: 'Steel shield with the symbol of a hammer',
      },
      {
        id: crypto.randomUUID(),
        name: 'Chain Mail',
        quantity: 1,
        weight: 55,
        description: 'Heavy armor providing excellent protection',
      },
      {
        id: crypto.randomUUID(),
        name: 'Backpack',
        quantity: 1,
        weight: 5,
        description: 'Contains rations, waterskin, and basic supplies',
      },
      {
        id: crypto.randomUUID(),
        name: 'Rations',
        quantity: 10,
        weight: 20,
        description: 'Dried food and preserved meat',
      },
    ],
    featuresTraits: [
      {
        id: crypto.randomUUID(),
        name: 'Fighting Style: Defense',
        description: 'While you are wearing armor, you gain a +1 bonus to AC.',
        source: 'Class',
      },
      {
        id: crypto.randomUUID(),
        name: 'Second Wind',
        description: 'On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.',
        source: 'Class',
      },
      {
        id: crypto.randomUUID(),
        name: 'Action Surge',
        description: 'On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before you can use it again.',
        source: 'Class',
      },
      {
        id: crypto.randomUUID(),
        name: 'Extra Attack',
        description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
        source: 'Class',
      },
      {
        id: crypto.randomUUID(),
        name: 'Darkvision',
        description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.',
        source: 'Race',
      },
    ],
    background: {
      name: 'Soldier',
      personalityTraits: 'I can stare down a hellhound without flinching. I enjoy being strong and like breaking things.',
      ideals: 'Greater Good. Our lot is to lay down our lives in defense of others. (Good)',
      bonds: 'I would still lay down my life for the people I served with.',
      flaws: 'I have little respect for anyone who is not a proven warrior.',
      backstory: 'Thorin served in the royal guard for ten years before becoming an adventurer. He left after growing tired of the political games and bureaucracy. Now he seeks to make a real difference in the world by protecting those who cannot protect themselves.',
    },
  }))

  const updateAbilityScore = (ability: keyof Character['abilities'], score: number) => {
    const proficiencyBonus = character.value.proficiencyBonus
    const saveProficient = character.value.abilities[ability].saveProficient
    const customModifier = character.value.abilities[ability].customModifier
    character.value.abilities[ability] = createAbilityScore(score, saveProficient, proficiencyBonus, customModifier)
    updateSkillModifiers()
    // Update basic attacks since ability scores affect attack bonuses and damage
    updateBasicAttacks(character.value)
  }

  const updateCustomModifier = (ability: keyof Character['abilities'], customModifier: number) => {
    const proficiencyBonus = character.value.proficiencyBonus
    const saveProficient = character.value.abilities[ability].saveProficient
    const score = character.value.abilities[ability].score
    character.value.abilities[ability] = createAbilityScore(score, saveProficient, proficiencyBonus, customModifier)
    updateSkillModifiers()
    // Update basic attacks since ability scores affect attack bonuses and damage
    updateBasicAttacks(character.value)
  }

  const setAbilityScores = (scores: Partial<Record<keyof Character['abilities'], number>>) => {
    Object.keys(scores).forEach(key => {
      const ability = key as keyof Character['abilities']
      const score = scores[ability]
      if (score !== undefined) {
        updateAbilityScore(ability, score)
      }
    })
  }

  const updateSaveProficiency = (ability: keyof Character['abilities'], proficient: boolean) => {
    character.value.abilities[ability].saveProficient = proficient
    const modifier = character.value.abilities[ability].modifier
    const proficiencyBonus = character.value.proficiencyBonus
    character.value.abilities[ability].saveModifier = modifier + (proficient ? proficiencyBonus : 0)
  }

  const updateSkillProficiency = (skillName: string, proficient: boolean) => {
    const skill = character.value.skills.find((s: Skill) => s.name === skillName)
    if (skill) {
      skill.proficient = proficient
      updateSkillModifier(skill)
    }
  }

  const updateProficiencyBonus = (bonus: number) => {
    character.value.proficiencyBonus = bonus
    // Update all save modifiers
    Object.keys(character.value.abilities).forEach(key => {
      const ability = key as keyof Character['abilities']
      const modifier = character.value.abilities[ability].modifier
      const saveProficient = character.value.abilities[ability].saveProficient
      character.value.abilities[ability].saveModifier = modifier + (saveProficient ? bonus : 0)
    })
    // Update all skill modifiers
    updateSkillModifiers()
    // Update basic attacks since proficiency bonus affects to-hit
    updateBasicAttacks(character.value)
  }

  const updateSkillModifiers = () => {
    character.value.skills.forEach((skill: Skill) => {
      updateSkillModifier(skill)
    })
  }

  const updateSkillModifier = (skill: Skill) => {
    const ability = character.value.abilities[skill.ability]
    // Calculate modifier from final score (base score + custom modifier)
    const finalScore = ability.score + (ability.customModifier || 0)
    const abilityModifier = calculateModifier(finalScore)
    const proficiencyBonus = character.value.proficiencyBonus
    // Expertise doubles the proficiency bonus
    const expertiseBonus = skill.expertise ? proficiencyBonus : 0
    skill.modifier = abilityModifier + (skill.proficient ? proficiencyBonus : 0) + expertiseBonus
  }

  const addAction = (action: Omit<Action, 'id'>) => {
    character.value.actions.push({
      ...action,
      id: crypto.randomUUID(),
    })
  }

  const removeAction = (id: string) => {
    const index = character.value.actions.findIndex((a: Action) => a.id === id)
    if (index !== -1) {
      character.value.actions.splice(index, 1)
    }
  }

  const convertToManualAttack = (id: string) => {
    const action = character.value.actions.find((a: Action) => a.id === id)
    if (action && action.isBasicAttack) {
      action.isBasicAttack = false
    }
  }

  const addSpell = (spell: Omit<Spell, 'id'>) => {
    // Check if spell already exists to avoid duplicates
    const exists = character.value.spells.some(s => s.name === spell.name)
    if (exists) return

    character.value.spells.push({
      ...spell,
      id: crypto.randomUUID(),
    })
  }

  let isEnsuringPaladinSpells = false

  /**
   * Ensure all Paladin spells are in the character's spellbook
   * Adds any missing Paladin spells (with prepared: false)
   * Does not remove existing spells
   */
  function ensurePaladinSpells(): void {
    // Guard against recursive calls
    if (isEnsuringPaladinSpells) return
    isEnsuringPaladinSpells = true

    try {
      const paladinClass = (character.value.classes ?? []).find(c => c.classType === 'Paladin')
      if (!paladinClass || paladinClass.level < 1) {
        isEnsuringPaladinSpells = false
        return
      }

      const paladinSpells = (paladinSpellsJson as { spells: Array<{
        name: string
        level: number
        school: string
        castingTime: string
        range: string
        components: string
        duration: string
        description: string
      }> }).spells

      const existingSpellNames = new Set(character.value.spells.map(s => s.name))
      const spellsToAdd: Omit<Spell, 'id'>[] = []

      paladinSpells.forEach(spellData => {
        if (!existingSpellNames.has(spellData.name)) {
          spellsToAdd.push({
            name: spellData.name,
            level: spellData.level,
            school: spellData.school,
            castingTime: spellData.castingTime,
            range: spellData.range,
            components: spellData.components,
            duration: spellData.duration,
            description: spellData.description,
            prepared: false,
          })
        }
      })

      // Add all spells at once to minimize reactive triggers
      if (spellsToAdd.length > 0) {
        spellsToAdd.forEach(spell => {
          character.value.spells.push({
            ...spell,
            id: crypto.randomUUID(),
          })
        })
      }
    } finally {
      isEnsuringPaladinSpells = false
    }
  }

  const removeSpell = (id: string) => {
    const index = character.value.spells.findIndex((s: Spell) => s.id === id)
    if (index !== -1) {
      const spell = character.value.spells[index]
      character.value.spells.splice(index, 1)
      // Remove corresponding action if spell was prepared
      if (spell.prepared) {
        syncSpellActions()
      }
    }
  }

  /**
   * Parse casting time string to determine if spell is action or bonus action
   * @param castingTime The casting time string (e.g., "1 action", "1 bonus action")
   * @returns Object with isAction and isBonusAction flags
   */
  function parseCastingTime(castingTime: string): { isAction: boolean; isBonusAction: boolean } {
    const normalized = castingTime.toLowerCase().trim()
    if (normalized.includes('bonus action')) {
      return { isAction: false, isBonusAction: true }
    }
    if (normalized.includes('action') && !normalized.includes('bonus')) {
      return { isAction: true, isBonusAction: false }
    }
    // For other casting times (1 minute, 10 minutes, Special, etc.), don't create actions
    return { isAction: false, isBonusAction: false }
  }

  /**
   * Sync prepared spells with actions/bonus actions
   * Creates actions for prepared spells with "1 action" or "1 bonus action" casting time
   * Removes actions for unprepared spells
   */
  function syncSpellActions(): void {
    const preparedSpells = character.value.spells.filter(s => s.prepared)

    // Create a set of spell names that should have actions
    const spellNamesNeedingActions = new Set<string>()

    preparedSpells.forEach(spell => {
      const { isAction, isBonusAction } = parseCastingTime(spell.castingTime)
      if (isAction || isBonusAction) {
        spellNamesNeedingActions.add(spell.name)
      }
    })

    // Remove actions that correspond to unprepared spells or spells with non-action casting times
    character.value.actions = character.value.actions.filter(action => {
      // Keep actions that are not spell-based (basic attacks, manually added, etc.)
      if (!action.name || action.isBasicAttack) {
        return true
      }

      // Check if this action corresponds to a prepared spell
      const correspondingSpell = preparedSpells.find(s => s.name === action.name)
      if (!correspondingSpell) {
        // No prepared spell with this name, remove the action
        return false
      }

      // Verify the casting time matches
      const { isAction, isBonusAction } = parseCastingTime(correspondingSpell.castingTime)
      const shouldBeBonusAction = isBonusAction

      // If the action's bonus action flag doesn't match, remove it (will be recreated below)
      if (action.isBonusAction !== shouldBeBonusAction) {
        return false
      }

      return true
    })

    // Create actions for prepared spells that need them
    preparedSpells.forEach(spell => {
      const { isAction, isBonusAction } = parseCastingTime(spell.castingTime)

      if (!isAction && !isBonusAction) {
        return // Skip spells with non-action casting times
      }

      // Check if action already exists
      const existingAction = character.value.actions.find(
        a => a.name === spell.name && a.isBonusAction === isBonusAction
      )

      if (!existingAction) {
        // Create new action for this spell
        const newAction: Action = {
          id: crypto.randomUUID(),
          name: spell.name,
          type: isBonusAction ? 'Bonus Action' : 'Spell',
          range: spell.range,
          toHit: '-',
          damage: '-',
          description: spell.description,
          isBonusAction: isBonusAction,
        }
        character.value.actions.push(newAction)
      } else {
        // Update existing action to ensure it has correct properties
        existingAction.type = isBonusAction ? 'Bonus Action' : 'Spell'
        existingAction.range = spell.range
        existingAction.description = spell.description
        existingAction.isBonusAction = isBonusAction
      }
    })
  }

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    character.value.inventory.push({
      ...item,
      id: crypto.randomUUID(),
    })
  }

  const removeInventoryItem = (id: string) => {
    const index = character.value.inventory.findIndex((i: InventoryItem) => i.id === id)
    if (index !== -1) {
      const item = character.value.inventory[index]
      character.value.inventory.splice(index, 1)
      // If a weapon was removed, update basic attacks
      if (getWeaponData(item.name) !== null) {
        updateBasicAttacks(character.value)
      }
    }
  }

  const toggleEquipItem = (id: string) => {
    const item = character.value.inventory.find((i: InventoryItem) => i.id === id)
    if (!item) return

    const isEquipping = !item.equipped

    // If equipping armor, unequip other armor of the same type
    if (isEquipping && item.armorType) {
      if (item.armorType === 'shield') {
        // Only one shield can be equipped
        character.value.inventory.forEach((i: InventoryItem) => {
          if (i.id !== id && i.armorType === 'shield') {
            i.equipped = false
          }
        })
      } else {
        // Only one armor can be equipped (light, medium, or heavy)
        character.value.inventory.forEach((i: InventoryItem) => {
          if (i.id !== id && i.armorType && ['light', 'medium', 'heavy'].includes(i.armorType)) {
            i.equipped = false
          }
        })
      }
    }

    // Toggle equipped status
    item.equipped = isEquipping

    // Auto-detect armor type and baseAC from database if not set
    if (isEquipping && item.armorType === undefined) {
      const armorData = getArmorData(item.name)
      if (armorData) {
        item.armorType = armorData.type
        item.baseAC = armorData.baseAC
      }
    }

    // Update wearingArmor flag for Barbarian
    const hasBarbarian = (character.value.classes ?? []).some(c => c.classType === 'Barbarian')
    if (hasBarbarian) {
      const equippedArmor = getEquippedArmor(character.value)
      character.value.wearingArmor = equippedArmor !== null
    }

    // Recalculate AC
    const dexModifier = character.value.abilities.dexterity.modifier
    character.value.ac = calculateAC(dexModifier, 10, character.value)

    // Update basic attacks if weapon was equipped/unequipped
    updateBasicAttacks(character.value)
  }

  const addFeatureTrait = (feature: Omit<FeatureTrait, 'id'>) => {
    character.value.featuresTraits.push({
      ...feature,
      id: crypto.randomUUID(),
    })
  }

  const removeFeatureTrait = (id: string) => {
    const index = character.value.featuresTraits.findIndex((f: FeatureTrait) => f.id === id)
    if (index !== -1) {
      character.value.featuresTraits.splice(index, 1)
    }
  }

  const updateFightingStyle = (fightingStyle: string) => {
    // Remove old fighting style feature
    const oldIndex = character.value.featuresTraits.findIndex(f => f.name.startsWith('Fighting Style:'))
    if (oldIndex !== -1) {
      character.value.featuresTraits.splice(oldIndex, 1)
    }

    // Update character fighting style
    character.value.fightingStyle = fightingStyle

    // Add new fighting style feature
    const fightingStyleData = FIGHTING_STYLES.find(style => style.name === fightingStyle)
    if (fightingStyleData) {
      character.value.featuresTraits.push({
        id: crypto.randomUUID(),
        name: `Fighting Style: ${fightingStyle}`,
        description: fightingStyleData.description,
        source: 'Class',
      })
    }
  }

  const updateWeaponMastery = (weaponMasteries: string[]) => {
    // Remove old weapon mastery feature
    const oldIndex = character.value.featuresTraits.findIndex(f => f.name === 'Weapon Mastery')
    if (oldIndex !== -1) {
      character.value.featuresTraits.splice(oldIndex, 1)
    }

    // Ensure weaponMastery exists
    if (!character.value.weaponMastery) {
      character.value.weaponMastery = []
    }

    // Update character weapon mastery
    character.value.weaponMastery = weaponMasteries

    // Add new weapon mastery feature
    if (weaponMasteries.length > 0) {
      const weaponMasteryDescriptions = weaponMasteries.map(weaponName => {
        const weapon = WEAPON_MASTERY_WEAPONS.find(w => w.name === weaponName)
        return weapon ? `${weapon.name} (${weapon.mastery})` : weaponName
      }).join(', ')
      character.value.featuresTraits.push({
        id: crypto.randomUUID(),
        name: 'Weapon Mastery',
        description: `You can use the Mastery property of the following weapons: ${weaponMasteryDescriptions}.`,
        source: 'Class',
      })
    }
  }

  // Rage Management Functions
  const activateRage = () => {
    const pool = character.value.resources?.rage
    if (!pool) return false
    if (pool.active) return false
    return toggleResourceActive('rage')
  }

  const deactivateRage = () => {
    const pool = character.value.resources?.rage
    if (!pool) return
    if (!pool.active) return
    pool.active = false
    syncLegacyRageFromResources()
    updateBasicAttacks(character.value)
  }

  const extendRage = () => {
    const pool = character.value.resources?.rage
    if (!pool) return false
    return !!pool.active
  }

  const resetRageUses = (shortRest: boolean = false) => {
    const pool = character.value.resources?.rage
    if (!pool) return
    if (shortRest) return
    pool.current = pool.max
    pool.active = false
    syncLegacyRageFromResources()
  }

  // Initialize skill modifiers on creation
  updateSkillModifiers()

  // Watch for ability score changes to update skills
  watch(() => character.value.abilities, () => {
    updateSkillModifiers()
  }, { deep: true })

  // Watch for proficiency bonus changes - but don't call updateProficiencyBonus to avoid loop
  watch(() => character.value.proficiencyBonus, () => {
    // Update all save modifiers
    Object.keys(character.value.abilities).forEach(key => {
      const ability = key as keyof Character['abilities']
      const modifier = character.value.abilities[ability].modifier
      const saveProficient = character.value.abilities[ability].saveProficient
      character.value.abilities[ability].saveModifier = modifier + (saveProficient ? character.value.proficiencyBonus : 0)
    })
    // Update all skill modifiers
    updateSkillModifiers()
  })

  // Computed values for AC, Initiative, Proficiency Bonus
  const calculatedAC = computed(() => {
    const dexModifier = character.value.abilities.dexterity.modifier
    return calculateAC(dexModifier, 10, character.value)
  })

  const calculatedInitiative = computed(() => {
    const dexModifier = character.value.abilities.dexterity.modifier
    return calculateInitiative(dexModifier)
  })

  const calculatedProficiencyBonus = computed(() => {
    return calculateProficiencyBonus(character.value.level || 1)
  })

  // Watch for changes and update calculated values
  watchEffect(() => {
    character.value.ac = calculatedAC.value
    character.value.initiative = calculatedInitiative.value
    character.value.proficiencyBonus = calculatedProficiencyBonus.value
  })

  // Migration: convert old single-class to multiclass model
  watchEffect(() => {
    migrateToMulticlass()
  })

  // Keep classLevel display string and total level in sync with classes array
  watchEffect(() => {
    const classes = character.value.classes ?? []
    const total = getTotalLevel(classes)
    const display = formatClassLevelString(classes)

    if (character.value.level !== total) character.value.level = total
    if (character.value.classLevel !== display) character.value.classLevel = display
  })

  // Keep nextLevel XP synced to the XP table (e.g., 300 -> 900 -> 2700 ...)
  watchEffect(() => {
    const currentXp = character.value.experiencePoints.current
    const nextMilestone = getNextXpMilestoneFromXp(currentXp)
    if (character.value.experiencePoints.nextLevel === nextMilestone) return
    character.value.experiencePoints.nextLevel = nextMilestone
  })

  // Auto-calculate Paladin spell slots based on Paladin level
  watchEffect(() => {
    const classes = character.value.classes ?? []
    const paladinClass = classes.find(c => c.classType === 'Paladin')
    if (!paladinClass) return

    const newSlots = getPaladinSpellSlots(paladinClass.level, character.value.spellSlots)

    // Only update if slots have changed
    const currentSlots = character.value.spellSlots
    if (currentSlots.length !== newSlots.length) {
      character.value.spellSlots = newSlots
      return
    }

    const hasChanges = currentSlots.some((slot, idx) => {
      const newSlot = newSlots[idx]
      return !newSlot || slot.level !== newSlot.level || slot.total !== newSlot.total
    })

    if (hasChanges) {
      character.value.spellSlots = newSlots
    }
  })

  function ensureResourcesForAllClasses(): void {
    if (!character.value.resources) character.value.resources = {}
    const classes = character.value.classes ?? []

    classes.forEach(classEntry => {
      const pools = getResourcesForClassAtLevel(classEntry.classType, classEntry.level)
      pools.forEach(pool => {
        const existing = character.value.resources?.[pool.id]
        if (!existing) {
          character.value.resources![pool.id] = {
            id: pool.id,
            label: pool.label,
            description: pool.description,
            reset: pool.reset,
            current: pool.max,
            max: pool.max,
            active: pool.trackActive ? false : undefined,
          }
          return
        }

        const newMax = pool.max
        const oldMax = existing.max
        const gained = Math.max(0, newMax - oldMax)

        // Only update if values actually changed to prevent unnecessary reactive triggers
        if (existing.label !== pool.label) existing.label = pool.label
        if (existing.description !== pool.description) existing.description = pool.description
        if (existing.reset !== pool.reset) existing.reset = pool.reset
        if (existing.max !== Math.max(existing.max, newMax)) {
          existing.max = Math.max(existing.max, newMax)
          existing.current = Math.min(existing.max, existing.current + gained)
        }
        if (pool.trackActive && existing.active === undefined) {
          existing.active = false
        }
        if (!pool.trackActive && existing.active !== undefined) {
          delete existing.active
        }
      })
    })
  }

  function syncLegacyRageFromResources(): void {
    const pool = character.value.resources?.rage
    if (!pool) return

    // Keep old rage object for existing logic (damage bonus, etc.)
    // IMPORTANT: avoid reassigning on every reactive run (infinite loop).
    const existing = character.value.rage
    const next = {
      active: !!pool.active,
      usesAvailable: pool.current,
      usesMax: pool.max,
      damageBonus: existing?.damageBonus ?? 2,
    }

    if (
      existing
      && existing.active === next.active
      && existing.usesAvailable === next.usesAvailable
      && existing.usesMax === next.usesMax
      && existing.damageBonus === next.damageBonus
    ) {
      return
    }

    character.value.rage = next
  }

  const spendResource = (resourceId: string): boolean => {
    const pool = character.value.resources?.[resourceId]
    if (!pool) return false
    if (pool.current <= 0) return false
    pool.current -= 1
    syncLegacyRageFromResources()
    return true
  }

  const restoreResource = (resourceId: string): boolean => {
    const pool = character.value.resources?.[resourceId]
    if (!pool) return false
    if (pool.current >= pool.max) return false
    pool.current += 1
    syncLegacyRageFromResources()
    return true
  }

  const toggleResourceActive = (resourceId: string): boolean => {
    const pool = character.value.resources?.[resourceId]
    if (!pool) return false
    if (pool.active === undefined) return false

    if (pool.active) {
      pool.active = false
      syncLegacyRageFromResources()
      updateBasicAttacks(character.value)
      return true
    }

    if (pool.current <= 0) return false
    pool.active = true
    pool.current -= 1
    syncLegacyRageFromResources()
    updateBasicAttacks(character.value)
    return true
  }

  const shortRest = (): void => {
    const pools = character.value.resources
    if (!pools) return
    Object.values(pools).forEach(pool => {
      if (pool.reset !== 'shortRest') return
      pool.current = pool.max
      if (pool.active !== undefined) pool.active = false
    })
    syncLegacyRageFromResources()
    updateBasicAttacks(character.value)
  }

  const longRest = (): void => {
    const pools = character.value.resources
    if (!pools) return
    Object.values(pools).forEach(pool => {
      // Long Rest resets everything (including short-rest and daily resources)
      pool.current = pool.max
      if (pool.active !== undefined) pool.active = false
    })
    // Reset all spell slots on long rest
    character.value.spellSlots.forEach(slot => {
      slot.used = 0
    })
    syncLegacyRageFromResources()
    updateBasicAttacks(character.value)
  }

  // Initialize resources for all classes and migrate legacy rage if needed
  watchEffect(() => {
    ensureResourcesForAllClasses()

    // One-way migration: if legacy rage exists but resource pool doesn't, initialize it
    if (character.value.rage && !character.value.resources?.rage) {
      if (!character.value.resources) character.value.resources = {}
      character.value.resources.rage = {
        id: 'rage',
        label: 'Rage',
        reset: 'longRest',
        current: character.value.rage.usesAvailable,
        max: character.value.rage.usesMax,
        active: character.value.rage.active,
      }
    }

    syncLegacyRageFromResources()
  })

  // Ensure class features from progression exist for all classes and levels
  watchEffect(() => {
    const classes = character.value.classes ?? []
    if (classes.length === 0) return

    const original = character.value.featuresTraits
    let updated = original

    classes.forEach(classEntry => {
      for (let lvl = 1; lvl <= classEntry.level; lvl += 1) {
        updated = addMissingClassFeatures(updated, classEntry.classType, lvl)
      }
    })

    if (updated.length === original.length) return
    character.value.featuresTraits = updated
  })

  // Ensure all Paladin spells are in spellbook when Paladin level changes
  // Use watch to only trigger on class changes, not all reactive updates
  let lastPaladinLevel = 0
  watch(() => {
    const paladinClass = (character.value.classes ?? []).find(c => c.classType === 'Paladin')
    return paladinClass ? paladinClass.level : 0
  }, (newLevel) => {
    // Only call if level actually changed and is >= 1
    if (newLevel >= 1 && newLevel !== lastPaladinLevel) {
      lastPaladinLevel = newLevel
      ensurePaladinSpells()
    } else if (newLevel === 0) {
      lastPaladinLevel = 0
    }
  }, { immediate: true })

  // Auto-sync spell actions when spells are prepared/unprepared
  // Watch only the prepared status to avoid unnecessary syncing
  let isSyncingSpellActions = false
  let lastSpellPreparedState = ''
  watch(() => {
    // Create a stable string representation of prepared spells state
    return character.value.spells
      .filter(s => s.prepared)
      .map(s => `${s.id}:${s.name}:${s.prepared}`)
      .sort()
      .join('|')
  }, (newState) => {
    if (isSyncingSpellActions || isEnsuringPaladinSpells) return
    if (newState === lastSpellPreparedState) return // No change in prepared state

    lastSpellPreparedState = newState
    isSyncingSpellActions = true
    try {
      syncSpellActions()
    } finally {
      // Use nextTick to ensure the sync completes before allowing another sync
      setTimeout(() => {
        isSyncingSpellActions = false
      }, 0)
    }
  })

  // HP Management functions
  const addHP = (amount: number) => {
    const newCurrent = Math.min(character.value.hitPoints.current + amount, character.value.hitPoints.maximum)
    character.value.hitPoints.current = newCurrent
  }

  const removeHP = (amount: number) => {
    // First remove from temporary HP if available
    if (character.value.hitPoints.temporary && character.value.hitPoints.temporary > 0) {
      const tempReduction = Math.min(character.value.hitPoints.temporary, amount)
      character.value.hitPoints.temporary -= tempReduction
      amount -= tempReduction
    }
    // Then remove from current HP
    character.value.hitPoints.current = Math.max(0, character.value.hitPoints.current - amount)
  }

  const addTemporaryHP = (amount: number) => {
    character.value.hitPoints.temporary = (character.value.hitPoints.temporary || 0) + amount
  }

  const setMaximumHP = (amount: number) => {
    character.value.hitPoints.maximum = amount
    // Ensure current HP doesn't exceed maximum
    if (character.value.hitPoints.current > amount) {
      character.value.hitPoints.current = amount
    }
  }

  const updateCharacterName = (name: string) => {
    character.value.name = name
  }

  const updateCharacterImage = (image: string) => {
    character.value.image = image
  }

  const updateClassLevel = (classLevel: string) => {
    character.value.classLevel = classLevel
    const inferred = parseClassTypeFromClassLevel(classLevel)
    if (inferred) {
      character.value.classType = inferred
    }
    // Try to extract level from classLevel string (e.g., "Fighter 5" -> 5)
    const levelMatch = classLevel.match(/\d+/)
    if (levelMatch) {
      character.value.level = parseInt(levelMatch[0], 10)
    }
  }

  // XP Management functions
  const addXP = (amount: number) => {
    character.value.experiencePoints.current += amount
    // Ensure current XP doesn't go negative
    if (character.value.experiencePoints.current < 0) {
      character.value.experiencePoints.current = 0
    }
  }

  const removeXP = (amount: number) => {
    character.value.experiencePoints.current = Math.max(0, character.value.experiencePoints.current - amount)
  }

  const setCurrentXP = (amount: number) => {
    character.value.experiencePoints.current = Math.max(0, amount)
  }

  const setNextLevelXP = (amount: number) => {
    // nextLevel is managed automatically from the XP table
    character.value.experiencePoints.nextLevel = getNextXpMilestoneFromXp(character.value.experiencePoints.current)
  }

  const levelUpToNext = (
    selectedClass: ClassType,
    choice: HpChoice,
    classChoices?: {
      selectedSkills?: string[]
      selectedFightingStyle?: string
      selectedWeaponMasteries?: string[]
      selectedExpertise?: string[]
      selectedSpells?: string[]
    },
  ): number => {
    const classes = character.value.classes ?? []
    const currentTotalLevel = getTotalLevel(classes)

    // Gate leveling by XP threshold for the *next level* (based on current total level)
    if (!canLevelUpWithXp(currentTotalLevel, character.value.experiencePoints.current)) return 0

    // Find existing class entry or create new one
    let classEntry = classes.find(c => c.classType === selectedClass)
    const isNewClass = !classEntry

    if (isNewClass) {
      // Check multiclass requirements
      if (!canMulticlassInto(selectedClass, character.value.abilities)) return 0

      classEntry = { classType: selectedClass, level: 0 }
      character.value.classes = [...classes, classEntry]
    }

    // Increment this class's level
    classEntry.level += 1
    const newClassLevel = classEntry.level

    // Recalculate total level
    const newTotalLevel = getTotalLevel(character.value.classes)
    character.value.level = newTotalLevel
    character.value.classLevel = formatClassLevelString(character.value.classes)

    // Apply HP gain using selected class's hit die
    const conModifier = character.value.abilities.constitution.modifier
    const hpGain = computeHpGainOnLevelUp(selectedClass, conModifier, choice)
    character.value.hitPoints.maximum += hpGain
    character.value.hitPoints.current += hpGain

    // If first level of a new class, apply class choices and grant multiclass proficiencies
    if (isNewClass && newClassLevel === 1 && classChoices) {
      const proficiencyBonus = calculateProficiencyBonus(newTotalLevel)

      // Apply skill proficiencies
      if (classChoices.selectedSkills && classChoices.selectedSkills.length > 0) {
        character.value.skills.forEach(skill => {
          if (classChoices.selectedSkills!.includes(skill.name) && !skill.proficient) {
            skill.proficient = true
          }
        })
        // Recalculate skill modifiers to include proficiency bonus
        updateSkillModifiers()
      }

      // Apply Expertise (Rogue only)
      if (selectedClass === 'Rogue' && classChoices.selectedExpertise && classChoices.selectedExpertise.length > 0) {
        character.value.skills.forEach(skill => {
          if (classChoices.selectedExpertise!.includes(skill.name)) {
            skill.expertise = true
          }
        })
        // Recalculate skill modifiers to include expertise bonus
        updateSkillModifiers()
      }

      // Apply Fighting Style (Fighter and Paladin)
      if ((selectedClass === 'Fighter' || selectedClass === 'Paladin') && classChoices.selectedFightingStyle) {
        character.value.fightingStyle = classChoices.selectedFightingStyle
        const fightingStyleData = FIGHTING_STYLES.find(style => style.name === classChoices.selectedFightingStyle)
        if (fightingStyleData) {
          character.value.featuresTraits.push({
            id: crypto.randomUUID(),
            name: `Fighting Style: ${classChoices.selectedFightingStyle}`,
            description: fightingStyleData.description,
            source: 'Class',
          })
        }
      }

      // Apply Weapon Mastery
      if (classChoices.selectedWeaponMasteries && classChoices.selectedWeaponMasteries.length > 0) {
        const existingMasteries = character.value.weaponMastery ?? []
        character.value.weaponMastery = [...existingMasteries, ...classChoices.selectedWeaponMasteries]
        const weaponMasteryDescriptions = classChoices.selectedWeaponMasteries.map(weaponName => {
          const weapon = WEAPON_MASTERY_WEAPONS.find(w => w.name === weaponName)
          return weapon ? `${weapon.name} (${weapon.mastery})` : weaponName
        }).join(', ')
        character.value.featuresTraits.push({
          id: crypto.randomUUID(),
          name: 'Weapon Mastery',
          description: `You can use the Mastery property of the following weapons: ${weaponMasteryDescriptions}.`,
          source: 'Class',
        })
      }

      // Grant multiclass proficiencies
      const multiclassProfs = getMulticlassProficiencies(selectedClass)
      if (multiclassProfs) {
        if (!character.value.multiclassProficiencies) character.value.multiclassProficiencies = []

        const newProfs: string[] = []
        if (multiclassProfs.proficiencies) {
          multiclassProfs.proficiencies.forEach(prof => {
            if (!character.value.multiclassProficiencies!.includes(prof)) {
              character.value.multiclassProficiencies!.push(prof)
              newProfs.push(prof)
            }
          })
        }
        if (multiclassProfs.armorTraining) {
          multiclassProfs.armorTraining.forEach(armor => {
            const profName = `Armor Proficiency: ${armor}`
            if (!character.value.multiclassProficiencies!.includes(profName)) {
              character.value.multiclassProficiencies!.push(profName)
              newProfs.push(profName)
            }
          })
        }

        // Add proficiency features
        newProfs.forEach(profName => {
          character.value.featuresTraits.push({
            id: crypto.randomUUID(),
            name: profName.includes('Armor') ? profName : `Weapon Proficiency: ${profName}`,
            description: profName.includes('Armor') ? `Proficient with ${profName.replace('Armor Proficiency: ', '')}.` : `Proficient with ${profName}.`,
            source: 'Class',
          })
        })
      }
    }

    // Handle fighting style selection for Paladin level 2 (if not already have one)
    if (selectedClass === 'Paladin' && newClassLevel === 2 && classChoices?.selectedFightingStyle && !character.value.fightingStyle) {
      character.value.fightingStyle = classChoices.selectedFightingStyle
      const fightingStyleData = FIGHTING_STYLES.find(style => style.name === classChoices.selectedFightingStyle)
      if (fightingStyleData) {
        character.value.featuresTraits.push({
          id: crypto.randomUUID(),
          name: `Fighting Style: ${classChoices.selectedFightingStyle}`,
          description: fightingStyleData.description,
          source: 'Class',
        })
      }
    }

    // Handle spell selection for Paladin level 2
    if (selectedClass === 'Paladin' && newClassLevel === 2 && classChoices?.selectedSpells && classChoices.selectedSpells.length > 0) {
      const paladinSpells = (paladinSpellsJson as { spells: Array<{
        name: string
        level: number
        school: string
        castingTime: string
        range: string
        components: string
        duration: string
        description: string
      }> }).spells

      classChoices.selectedSpells.forEach(spellName => {
        const spellData = paladinSpells.find(s => s.name === spellName)
        if (spellData) {
          const spell: Omit<Spell, 'id'> = {
            name: spellData.name,
            level: spellData.level,
            school: spellData.school,
            castingTime: spellData.castingTime,
            range: spellData.range,
            components: spellData.components,
            duration: spellData.duration,
            description: spellData.description,
            prepared: true, // Initial spells are prepared
          }
          character.value.spells.push({
            ...spell,
            id: crypto.randomUUID(),
          })
        }
      })
    }

    // Add features for the new level of this class
    character.value.featuresTraits = addMissingClassFeatures(character.value.featuresTraits, selectedClass, newClassLevel)

    // Ensure nextLevel XP reflects the next milestone after current XP
    character.value.experiencePoints.nextLevel = getNextXpMilestoneFromXp(character.value.experiencePoints.current)

    // Update basic attacks (this will add/update bonus actions for Rogues at level 2+)
    updateBasicAttacks(character.value)

    return hpGain
  }

  const resetCharacter = (newCharacter: Character) => {
    character.value = newCharacter
    // Recalculate all computed values
    updateSkillModifiers()
    // Update calculated values
    const dexModifier = character.value.abilities.dexterity.modifier
    character.value.ac = calculateAC(dexModifier, 10, character.value)
    character.value.initiative = calculateInitiative(dexModifier)
    character.value.proficiencyBonus = calculateProficiencyBonus(character.value.level || 1)
    // Update passive senses (they will be recalculated by watchEffect, but we can trigger it)
    // The watchEffect in AbilitiesSection will handle this automatically
  }

  return {
    character,
    updateAbilityScore,
    updateCustomModifier,
    setAbilityScores,
    updateSaveProficiency,
    updateSkillProficiency,
    updateProficiencyBonus,
    addAction,
    removeAction,
    convertToManualAttack,
    addSpell,
    removeSpell,
    syncSpellActions,
    ensurePaladinSpells,
    addInventoryItem,
    removeInventoryItem,
    toggleEquipItem,
    getArmorData,
    getWeaponData,
    getEquippedArmor,
    getEquippedShield,
    addFeatureTrait,
    removeFeatureTrait,
    updateFightingStyle,
    updateWeaponMastery,
    addHP,
    removeHP,
    addTemporaryHP,
    setMaximumHP,
    updateCharacterName,
    updateCharacterImage,
    updateClassLevel,
    addXP,
    removeXP,
    setCurrentXP,
    setNextLevelXP,
    levelUpToNext,
    spendResource,
    restoreResource,
    toggleResourceActive,
    shortRest,
    longRest,
    createEmptyCharacter,
    applyFighterLevel1,
    applyBarbarianLevel1,
    applyRogueLevel1,
    createNewCharacter,
    resetCharacter,
    activateRage,
    deactivateRage,
    extendRage,
    resetRageUses,
    getTotalLevel: () => getTotalLevel(character.value.classes ?? []),
    getClassLevel: (classType: ClassType) => getClassLevel(character.value.classes ?? [], classType),
    getAllClasses,
    hasClass: (classType: ClassType) => getClassLevel(character.value.classes ?? [], classType) > 0,
    formatClassLevelString: () => formatClassLevelString(character.value.classes ?? []),
    FIGHTING_STYLES,
    WEAPON_MASTERY_WEAPONS,
    getMeleeWeapons,
    BARBARIAN_SKILLS,
    ROGUE_SKILLS,
    getSneakAttackDice,
  }
}

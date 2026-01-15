import type { Character, AbilityScore, Skill, Action, Spell, InventoryItem, FeatureTrait } from '~/types/character'
import { addMissingClassFeatures, computeHpGainOnLevelUp, getStartingHpBase, type HpChoice } from '~/composables/classProgression'
import { canLevelUpWithXp, getNextXpMilestoneFromXp, getXpForLevel } from '~/composables/xpProgression'

export interface FightingStyle {
  name: string
  description: string
}

export interface WeaponMastery {
  name: string
  type: 'Simple' | 'Martial'
  mastery: string
}

export const FIGHTING_STYLES: FightingStyle[] = [
  {
    name: 'Archery',
    description: 'You gain a +2 bonus to attack rolls you make with ranged weapons.',
  },
  {
    name: 'Defense',
    description: 'While you are wearing armor, you gain a +1 bonus to AC.',
  },
  {
    name: 'Dueling',
    description: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
  },
  {
    name: 'Great Weapon Fighting',
    description: 'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2.',
  },
  {
    name: 'Protection',
    description: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.',
  },
  {
    name: 'Two-Weapon Fighting',
    description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.',
  },
]

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
    if (character.classType === 'Barbarian' && !character.wearingArmor) {
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
  const toHitModifier = abilityModifier + proficiencyBonus
  const toHitString = toHitModifier >= 0 ? `+${toHitModifier}` : `${toHitModifier}`

  // Calculate damage (weapon damage + ability modifier)
  let damageString = weaponData.damage
  if (abilityModifier !== 0) {
    damageString += abilityModifier >= 0 ? ` + ${abilityModifier}` : ` ${abilityModifier}`
  }
  damageString += ` ${weaponData.damageType}`

  // Add rage damage bonus for Barbarian (only for STR-based attacks)
  const usingStrength = weaponData.ability === 'strength' ||
    (weaponData.ability === 'finesse' && strModifier >= dexModifier)
  if (character.classType === 'Barbarian' && character.rage?.active && usingStrength) {
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
  if (character.classType === 'Barbarian' && character.rage?.active) {
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

function updateBasicAttacks(character: Character): void {
  // Remove existing basic attacks (but preserve manually converted ones)
  // Only remove actions that are still marked as basic attacks
  character.actions = character.actions.filter(action => !action.isBasicAttack)

  // Add unarmed strike (always available) - but check if it was manually converted
  const existingUnarmed = character.actions.find(a => a.name === 'Unarmed Strike' && !a.isBasicAttack)
  if (!existingUnarmed) {
    character.actions.push(generateUnarmedStrike(character))
  }

  // Add attacks for equipped weapons (but skip if manually converted)
  const equippedWeapons = getEquippedWeapons(character)
  equippedWeapons.forEach(weapon => {
    // Check if this weapon's attack was manually converted
    const existingWeaponAttack = character.actions.find(
      a => a.name === weapon.name && !a.isBasicAttack
    )
    if (!existingWeaponAttack) {
      character.actions.push(generateAttackFromWeapon(weapon, character))
    }
  })
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

  // Set class level and type
  character.classLevel = 'Fighter 1'
  character.classType = 'Fighter'
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

  // Set class level and type
  character.classLevel = 'Barbarian 1'
  character.classType = 'Barbarian'
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

function createNewCharacter(characterClass: string, selectedSkills: string[], selectedFightingStyle: string | undefined, selectedWeaponMasteries: string[]): Character {
  const character = createEmptyCharacter()

  if (characterClass === 'Fighter') {
    if (!selectedFightingStyle) {
      throw new Error('Fighting Style is required for Fighter')
    }
    applyFighterLevel1(character, selectedSkills, selectedFightingStyle, selectedWeaponMasteries)
  } else if (characterClass === 'Barbarian') {
    applyBarbarianLevel1(character, selectedSkills, selectedWeaponMasteries)
  }

  // Initialize basic attacks (unarmed strike)
  updateBasicAttacks(character)

  return character
}

export const useCharacter = () => {
  const CLASS_TYPES = [
    'Barbarian',
    'Bard',
    'Cleric',
    'Druid',
    'Fighter',
    'Monk',
    'Paladin',
    'Ranger',
    'Rogue',
    'Sorcerer',
    'Warlock',
    'Wizard',
  ] as const satisfies readonly NonNullable<Character['classType']>[]

  type ClassType = typeof CLASS_TYPES[number]

  const parseClassTypeFromClassLevel = (classLevel: string): ClassType | undefined => {
    const firstToken = classLevel.trim().split(/\s+/)[0]
    const isKnown = (CLASS_TYPES as readonly string[]).includes(firstToken)
    return isKnown ? (firstToken as ClassType) : undefined
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
    skill.modifier = abilityModifier + (skill.proficient ? proficiencyBonus : 0)
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
    character.value.spells.push({
      ...spell,
      id: crypto.randomUUID(),
    })
  }

  const removeSpell = (id: string) => {
    const index = character.value.spells.findIndex((s: Spell) => s.id === id)
    if (index !== -1) {
      character.value.spells.splice(index, 1)
    }
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
    if (character.value.classType === 'Barbarian') {
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
    if (!character.value.rage) return false
    if (character.value.rage.usesAvailable <= 0) return false
    if (character.value.rage.active) return false

    character.value.rage.active = true
    character.value.rage.usesAvailable -= 1
    // Update basic attacks to include rage damage bonus
    updateBasicAttacks(character.value)
    return true
  }

  const deactivateRage = () => {
    if (!character.value.rage) return
    character.value.rage.active = false
    // Update basic attacks to remove rage damage bonus
    updateBasicAttacks(character.value)
  }

  const extendRage = () => {
    if (!character.value.rage) return false
    if (!character.value.rage.active) return false
    // Rage is extended by the action itself, just return true
    return true
  }

  const resetRageUses = (shortRest: boolean = false) => {
    if (!character.value.rage) return
    if (shortRest) {
      // Regain 1 use on short rest
      character.value.rage.usesAvailable = Math.min(character.value.rage.usesAvailable + 1, character.value.rage.usesMax)
    } else {
      // Regain all uses on long rest
      character.value.rage.usesAvailable = character.value.rage.usesMax
      character.value.rage.active = false
    }
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

  // Ensure classType is present when classLevel is set (e.g., sample character data)
  watchEffect(() => {
    if (character.value.classType) return
    const inferred = parseClassTypeFromClassLevel(character.value.classLevel || '')
    if (!inferred) return
    character.value.classType = inferred
  })

  // Keep nextLevel XP synced to the XP table (e.g., 300 -> 900 -> 2700 ...)
  watchEffect(() => {
    const currentXp = character.value.experiencePoints.current
    const nextMilestone = getNextXpMilestoneFromXp(currentXp)
    if (character.value.experiencePoints.nextLevel === nextMilestone) return
    character.value.experiencePoints.nextLevel = nextMilestone
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

  const levelUpToNext = (choice: HpChoice): number => {
    if (!character.value.classType) return 0
    const currentLevel = character.value.level || 1
    const targetLevel = currentLevel + 1

    // Gate leveling by XP threshold for the *next level* (based on current level)
    if (!canLevelUpWithXp(currentLevel, character.value.experiencePoints.current)) return 0

    const conModifier = character.value.abilities.constitution.modifier
    const hpGain = computeHpGainOnLevelUp(character.value.classType, conModifier, choice)

    character.value.hitPoints.maximum += hpGain
    character.value.hitPoints.current += hpGain

    character.value.level = targetLevel
    character.value.classLevel = `${character.value.classType} ${targetLevel}`
    character.value.featuresTraits = addMissingClassFeatures(character.value.featuresTraits, character.value.classType, targetLevel)

    // Ensure nextLevel XP reflects the next milestone after current XP
    character.value.experiencePoints.nextLevel = getNextXpMilestoneFromXp(character.value.experiencePoints.current)

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
    createEmptyCharacter,
    applyFighterLevel1,
    applyBarbarianLevel1,
    createNewCharacter,
    resetCharacter,
    activateRage,
    deactivateRage,
    extendRage,
    resetRageUses,
    FIGHTING_STYLES,
    WEAPON_MASTERY_WEAPONS,
    getMeleeWeapons,
    BARBARIAN_SKILLS,
  }
}

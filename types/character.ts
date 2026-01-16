export interface AbilityScore {
  score: number
  modifier: number
  customModifier: number // Additional custom modifier (e.g., from magic items)
  saveProficient: boolean
  saveModifier: number
}

export interface AbilityScores {
  strength: AbilityScore
  dexterity: AbilityScore
  constitution: AbilityScore
  intelligence: AbilityScore
  wisdom: AbilityScore
  charisma: AbilityScore
}

export interface Skill {
  name: string
  ability: keyof AbilityScores
  proficient: boolean
  expertise?: boolean
  modifier: number
}

export interface Action {
  id: string
  name: string
  type: string
  range: string
  toHit: string
  damage: string
  description?: string
  isBasicAttack?: boolean // True for auto-generated attacks (unarmed strike, equipped weapons)
}

export interface SpellSlot {
  level: number
  total: number
  used: number
}

export interface Spell {
  id: string
  name: string
  level: number
  school: string
  castingTime: string
  range: string
  components: string
  duration: string
  description: string
  prepared?: boolean
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  weight: number
  description?: string
  equipped?: boolean
  armorType?: 'light' | 'medium' | 'heavy' | 'shield'
  baseAC?: number
}

export interface FeatureTrait {
  id: string
  name: string
  description: string
  source?: string // e.g., "Class", "Race", "Feat"
}

export type ResourceReset = 'shortRest' | 'longRest' | 'daily'

export interface ResourcePool {
  id: string
  label: string
  description?: string
  reset: ResourceReset
  current: number
  max: number
  active?: boolean
}

export type ClassType = 'Barbarian' | 'Bard' | 'Cleric' | 'Druid' | 'Fighter' | 'Monk' | 'Paladin' | 'Ranger' | 'Rogue' | 'Sorcerer' | 'Warlock' | 'Wizard'

export interface ClassEntry {
  classType: ClassType
  level: number
}

export interface Character {
  // Header
  name: string
  classLevel: string // Display string: "Fighter 5" or "Barbarian 3 / Fighter 2" (computed from classes)
  classes: ClassEntry[] // Multiclass support: [{ classType: "Barbarian", level: 3 }, { classType: "Fighter", level: 2 }]
  experiencePoints: {
    current: number
    nextLevel: number // XP needed for next level
  }
  ac: number // Calculated: 10 + Dex modifier + armor bonus (for now: 10 + Dex)
  hitPoints: {
    current: number
    maximum: number
    temporary?: number // Temporary HP
  }
  initiative: number // Calculated: Dex modifier
  proficiencyBonus: number // Calculated: based on level
  level: number // Character level for proficiency calculation
  image?: string
  inspiration?: boolean // Inspiration flag

  // Abilities
  abilities: AbilityScores
  senses: {
    passivePerception: number
    passiveInvestigation: number
    passiveInsight: number
  }

  // Skills
  skills: Skill[]

  // Actions
  actions: Action[]

  // Spells
  spellSlots: SpellSlot[]
  spells: Spell[]

  // Inventory
  inventory: InventoryItem[]

  // Features & Traits
  featuresTraits: FeatureTrait[]

  // Class-specific
  classType?: ClassType // DEPRECATED: kept for migration, use classes array instead
  resources?: Record<string, ResourcePool>
  multiclassProficiencies?: string[] // Proficiencies granted from multiclassing (e.g., "Martial Weapons", "Shields")
  fightingStyle?: string // Fighter-specific (applies to any Fighter level)
  weaponMastery: string[] // Array of weapon names with mastery
  rage?: {
    active: boolean
    usesAvailable: number
    usesMax: number
    damageBonus: number
  }
  wearingArmor?: boolean // Track if wearing armor for AC calculation

  // Background
  background: {
    name: string
    personalityTraits: string
    ideals: string
    bonds: string
    flaws: string
    backstory: string
  }
}

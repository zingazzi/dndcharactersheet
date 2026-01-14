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
}

export interface FeatureTrait {
  id: string
  name: string
  description: string
  source?: string // e.g., "Class", "Race", "Feat"
}

export interface Character {
  // Header
  name: string
  classLevel: string // e.g., "Fighter 5"
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

  // Fighter-specific
  fightingStyle?: string
  weaponMastery: string[] // Array of weapon names with mastery

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

import type { Character, AbilityScore, Skill, Action, Spell, InventoryItem, FeatureTrait } from '~/types/character'

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

  // Set hit points (1d10 maximum = 10)
  character.hitPoints.maximum = 10
  character.hitPoints.current = 10

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

  // Recalculate AC and Initiative
  const dexModifier = character.abilities.dexterity.modifier
  character.ac = calculateAC(dexModifier, 10, character)
  character.initiative = calculateInitiative(dexModifier)
}

function applyBarbarianLevel1(character: Character, selectedSkills: string[], selectedWeaponMasteries: string[]): void {
  const level = 1
  const proficiencyBonus = calculateProficiencyBonus(level)
  const conModifier = calculateModifier(character.abilities.constitution.score)

  // Set hit points (1d12 = 12 + CON modifier)
  character.hitPoints.maximum = 12 + conModifier
  character.hitPoints.current = 12 + conModifier

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

  // Add Rage feature
  character.rage = {
    active: false,
    usesAvailable: 2,
    usesMax: 2,
    damageBonus: 2,
  }
  character.featuresTraits.push({
    id: crypto.randomUUID(),
    name: 'Rage',
    description: 'You can enter a Rage as a Bonus Action. While raging, you have resistance to bludgeoning, piercing, and slashing damage, gain a +2 bonus to damage rolls with Strength-based attacks, and have advantage on Strength checks and saving throws. You cannot maintain Concentration or cast spells while raging. Rage lasts until the end of your next turn and can be extended.',
    source: 'Class',
  })

  // Add Unarmored Defense feature
  character.featuresTraits.push({
    id: crypto.randomUUID(),
    name: 'Unarmored Defense',
    description: 'While you aren\'t wearing any armor, your base Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a Shield and still gain this benefit.',
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

  return character
}

export const useCharacter = () => {
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
  }

  const updateCustomModifier = (ability: keyof Character['abilities'], customModifier: number) => {
    const proficiencyBonus = character.value.proficiencyBonus
    const saveProficient = character.value.abilities[ability].saveProficient
    const score = character.value.abilities[ability].score
    character.value.abilities[ability] = createAbilityScore(score, saveProficient, proficiencyBonus, customModifier)
    updateSkillModifiers()
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
      character.value.inventory.splice(index, 1)
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
    return true
  }

  const deactivateRage = () => {
    if (!character.value.rage) return
    character.value.rage.active = false
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
    character.value.experiencePoints.nextLevel = Math.max(1, amount)
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
    addSpell,
    removeSpell,
    addInventoryItem,
    removeInventoryItem,
    toggleEquipItem,
    getArmorData,
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

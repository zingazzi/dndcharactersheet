import type { Character, AbilityScore, Skill, Action, Spell, InventoryItem, FeatureTrait } from '~/types/character'

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

function createAbilityScore(score: number = 10, saveProficient: boolean = false, proficiencyBonus: number = 0): AbilityScore {
  const modifier = calculateModifier(score)
  return {
    score,
    modifier,
    saveProficient,
    saveModifier: modifier + (saveProficient ? proficiencyBonus : 0),
  }
}

export const useCharacter = () => {
  const proficiencyBonus = 3
  const initialAbilities = {
    strength: createAbilityScore(16, true, proficiencyBonus), // Fighter with STR save
    dexterity: createAbilityScore(14, false, proficiencyBonus),
    constitution: createAbilityScore(15, true, proficiencyBonus), // Fighter with CON save
    intelligence: createAbilityScore(10, false, proficiencyBonus),
    wisdom: createAbilityScore(12, false, proficiencyBonus),
    charisma: createAbilityScore(8, false, proficiencyBonus),
  }

  const character = useState<Character>('character', () => ({
    name: 'Thorin Ironforge',
    classLevel: 'Fighter 5',
    ac: 18,
    hitPoints: {
      current: 45,
      maximum: 52,
    },
    initiative: 2,
    proficiencyBonus,
    abilities: initialAbilities,
    senses: 'Passive Perception 13, Darkvision 60 ft.',
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
    character.value.abilities[ability] = createAbilityScore(score, saveProficient, proficiencyBonus)
    updateSkillModifiers()
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
    const abilityModifier = character.value.abilities[skill.ability].modifier
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

  return {
    character,
    updateAbilityScore,
    updateSaveProficiency,
    updateSkillProficiency,
    updateProficiencyBonus,
    addAction,
    removeAction,
    addSpell,
    removeSpell,
    addInventoryItem,
    removeInventoryItem,
    addFeatureTrait,
    removeFeatureTrait,
  }
}

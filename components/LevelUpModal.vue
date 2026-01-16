<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="m-0 text-base font-cinzel font-semibold text-[var(--color-text-secondary)]">Level Up</h2>
        <button
          @click="close"
          class="bg-transparent border-none text-xl text-[var(--color-accent-primary)] cursor-pointer w-6 h-6 flex items-center justify-center rounded transition-all duration-200 hover:bg-[var(--color-accent-primary)]/20 leading-none"
        >
          ×
        </button>
      </div>

      <div class="modal-body">
        <div class="card-compact mb-2">
          <div class="text-xs text-[var(--color-text-secondary)]">
            <span class="font-semibold">Current:</span> Level {{ currentLevel }}
            <span class="text-[var(--color-text-tertiary)] font-bold">→</span>
            <span class="font-semibold">Next:</span> Level {{ nextLevel }}
          </div>
          <div class="text-xs text-[var(--color-text-tertiary)] italic">
            Available when XP {{ character.experiencePoints.current.toLocaleString() }} ≥ {{ getXpForLevel(nextLevel).toLocaleString() }}.
          </div>
        </div>

        <div class="mb-2">
          <label class="block mb-1 text-xs font-semibold text-[var(--color-text-secondary)] font-cinzel">Choose Class to Level</label>
          <div class="flex flex-col gap-1 max-h-[200px] overflow-y-auto border border-[var(--color-border-primary)] rounded p-1.5">
            <label
              v-for="option in availableClasses"
              :key="option.classType"
              class="flex items-center gap-2 p-1.5 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] transition-colors text-sm"
              :class="{
                'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)] cursor-pointer': selectedClass === option.classType && option.canTake,
                'cursor-pointer': option.canTake && selectedClass !== option.classType,
                'opacity-50 cursor-not-allowed': !option.canTake,
              }"
            >
              <input
                v-model="selectedClass"
                type="radio"
                :value="option.classType"
                :disabled="!option.canTake"
                class="mr-1"
              />
              <div class="flex-1">
                <div class="font-semibold text-[var(--color-text-primary)]">
                  {{ option.classType }}
                  <span v-if="option.currentLevel > 0" class="text-xs text-[var(--color-text-tertiary)]">(Level {{ option.currentLevel }})</span>
                  <span v-else class="text-xs text-[var(--color-text-tertiary)]">(New class)</span>
                </div>
                <div v-if="option.requirementText" class="text-xs" :class="option.canTake ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'">
                  Requires: {{ option.requirementText }} {{ option.canTake ? '✓' : '✗' }}
                </div>
              </div>
            </label>
          </div>
          <div v-if="selectedClass" class="text-xs text-[var(--color-text-tertiary)] italic mt-1">
            {{ selectedClassOption?.currentLevel > 0 ? `Leveling ${selectedClass} to level ${selectedClassOption.currentLevel + 1}` : `Taking first level of ${selectedClass}` }}
          </div>
        </div>

        <!-- Class Choices (only for first level of new class) -->
        <div v-if="selectedClassOption?.currentLevel === 0" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Class Choices</h3>
          
          <!-- Skill Selection -->
          <div class="mb-2">
            <h4 class="text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Choose {{ skillCount }} Skills</h4>
            <div v-if="availableSkills.length === 0" class="text-xs text-[var(--color-text-tertiary)] italic mb-1">
              All available skills are already proficient.
            </div>
            <div v-else class="grid grid-cols-2 gap-1 mb-1">
              <label
                v-for="skill in availableSkills"
                :key="skill"
                class="flex items-center p-1 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer transition-colors text-xs"
                :class="{ 
                  'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedSkills.includes(skill), 
                  'opacity-50 cursor-not-allowed': !selectedSkills.includes(skill) && selectedSkills.length >= skillCount 
                }"
              >
                <input
                  type="checkbox"
                  :value="skill"
                  v-model="selectedSkills"
                  :disabled="!selectedSkills.includes(skill) && selectedSkills.length >= skillCount"
                  class="mr-1 w-3 h-3"
                />
                <span class="text-[var(--color-text-primary)]">{{ skill }}</span>
              </label>
            </div>
            <div class="text-center text-xs" :class="{ 'text-[var(--color-success)]': selectedSkills.length === skillCount, 'text-[var(--color-danger)]': selectedSkills.length !== skillCount }">
              Selected: {{ selectedSkills.length }} / {{ skillCount }} skills
            </div>
          </div>

          <!-- Expertise Selection (Rogue only) -->
          <div v-if="selectedClass === 'Rogue'" class="mb-2">
            <h4 class="text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Choose 2 Skills for Expertise</h4>
            <div v-if="selectedSkills.length < skillCount" class="text-xs text-[var(--color-text-tertiary)] italic mb-1">
              Select {{ skillCount }} skills first.
            </div>
            <div v-else-if="availableExpertiseSkills.length === 0" class="text-xs text-[var(--color-text-tertiary)] italic mb-1">
              No skills available for Expertise.
            </div>
            <div v-else class="grid grid-cols-2 gap-1 mb-1">
              <label
                v-for="skill in availableExpertiseSkills"
                :key="skill"
                class="flex items-center p-1 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer transition-colors text-xs"
                :class="{ 
                  'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedExpertise.includes(skill), 
                  'opacity-50 cursor-not-allowed': !selectedExpertise.includes(skill) && selectedExpertise.length >= 2 
                }"
              >
                <input
                  type="checkbox"
                  :value="skill"
                  v-model="selectedExpertise"
                  :disabled="!selectedExpertise.includes(skill) && selectedExpertise.length >= 2"
                  class="mr-1 w-3 h-3"
                />
                <span class="text-[var(--color-text-primary)]">{{ skill }}</span>
              </label>
            </div>
            <div class="text-center text-xs" :class="{ 'text-[var(--color-success)]': selectedExpertise.length === 2, 'text-[var(--color-danger)]': selectedExpertise.length !== 2 }">
              Selected: {{ selectedExpertise.length }} / 2 expertise skills
            </div>
          </div>

          <!-- Fighting Style Selection (Fighter only) -->
          <div v-if="selectedClass === 'Fighter'" class="mb-2">
            <h4 class="text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Choose Fighting Style</h4>
            <div v-if="fightingStyles.length === 0" class="text-xs text-[var(--color-text-tertiary)] italic mb-1">
              You already have a fighting style selected.
            </div>
            <div v-else class="flex flex-col gap-1">
              <label
                v-for="style in fightingStyles"
                :key="style.name"
                class="flex items-start p-1 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer transition-colors text-xs"
                :class="{ 'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedFightingStyle === style.name }"
              >
                <input
                  v-model="selectedFightingStyle"
                  type="radio"
                  :value="style.name"
                  class="mt-0.5 mr-1 w-3 h-3"
                />
                <div class="flex-1">
                  <div class="font-semibold text-[var(--color-text-primary)]">{{ style.name }}</div>
                  <div class="text-[0.65rem] text-[var(--color-text-tertiary)] mt-0.5">{{ style.description }}</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Weapon Mastery Selection -->
          <div class="mb-2">
            <h4 class="text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
              Choose {{ weaponMasteryCount }} {{ selectedClass === 'Barbarian' ? 'Melee' : '' }} Weapons for Weapon Mastery
            </h4>
            <div v-if="weaponMasteryWeapons.length === 0" class="text-xs text-[var(--color-text-tertiary)] italic mb-1">
              All available weapons already have mastery.
            </div>
            <div v-else class="max-h-[150px] overflow-y-auto border border-[var(--color-border-primary)] rounded p-1 mb-1">
              <div class="grid grid-cols-1 gap-1">
                <label
                  v-for="weapon in weaponMasteryWeapons"
                  :key="weapon.name"
                  class="flex items-center p-1 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer transition-colors text-xs"
                  :class="{ 
                    'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedWeaponMasteries.includes(weapon.name), 
                    'opacity-50 cursor-not-allowed': !selectedWeaponMasteries.includes(weapon.name) && selectedWeaponMasteries.length >= weaponMasteryCount 
                  }"
                >
                  <input
                    type="checkbox"
                    :value="weapon.name"
                    v-model="selectedWeaponMasteries"
                    :disabled="!selectedWeaponMasteries.includes(weapon.name) && selectedWeaponMasteries.length >= weaponMasteryCount"
                    class="mr-1 w-3 h-3"
                  />
                  <div class="flex-1">
                    <span class="font-semibold text-[var(--color-text-primary)]">{{ weapon.name }}</span>
                    <span class="text-[0.65rem] text-[var(--color-text-tertiary)] ml-1">({{ weapon.type }}, {{ weapon.mastery }})</span>
                  </div>
                </label>
              </div>
            </div>
            <div class="text-center text-xs" :class="{ 'text-[var(--color-success)]': selectedWeaponMasteries.length === weaponMasteryCount, 'text-[var(--color-danger)]': selectedWeaponMasteries.length !== weaponMasteryCount }">
              Selected: {{ selectedWeaponMasteries.length }} / {{ weaponMasteryCount }} weapons
            </div>
          </div>
        </div>

        <div class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Hit Points</h3>

          <div class="text-xs text-[var(--color-text-tertiary)] italic mb-1">
            Choose average or roll for your hit die, then add your CON modifier.
          </div>

          <div class="flex flex-wrap items-center gap-2 mb-1">
            <label class="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] cursor-pointer">
              <input v-model="hpMethod" type="radio" value="average" />
              Average ({{ averageGain }})
            </label>
            <label class="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] cursor-pointer">
              <input v-model="hpMethod" type="radio" value="roll" />
              Roll d{{ hitDie }}
            </label>
          </div>

          <div v-if="hpMethod === 'roll'" class="grid grid-cols-[1fr_auto] gap-1 mb-1">
            <input
              v-model.number="manualRoll"
              type="number"
              :min="1"
              :max="hitDie"
              class="input text-sm py-1 px-1.5"
              placeholder="Rolled value"
            />
            <button @click="rollNow" class="btn btn-secondary text-xs px-2 py-1">Roll</button>
          </div>

          <div class="text-xs text-[var(--color-text-secondary)] mb-1">
            <span class="font-semibold">Preview:</span>
            +{{ previewHpGain }} HP (base {{ baseGainPreview }} + CON {{ conModifier >= 0 ? `+${conModifier}` : conModifier }})
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="close" class="btn btn-secondary text-sm">Cancel</button>
        <button @click="applyLevelUp" class="btn btn-primary text-sm" :disabled="!canApply">
          Apply Level {{ nextLevel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { canMulticlassInto, computeHpGainOnLevelUp, getAllClassTypes, getAverageHpGainOnLevelUp, getHitDie, getMulticlassRequirements, type ClassType } from '~/composables/classProgression'
import { canLevelUpWithXp, getXpForLevel } from '~/composables/xpProgression'
import { BARBARIAN_SKILLS, FIGHTING_STYLES, ROGUE_SKILLS, WEAPON_MASTERY_WEAPONS, getMeleeWeapons } from '~/composables/useCharacter'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { character, getAllClasses, getClassLevel, levelUpToNext } = useCharacter()

const fighterSkills = [
  'Acrobatics',
  'Animal Handling',
  'Athletics',
  'History',
  'Insight',
  'Intimidation',
  'Perception',
  'Persuasion',
  'Survival',
]

const currentLevel = computed(() => character.value.level || 1)
const nextLevel = computed(() => currentLevel.value + 1)

interface ClassOption {
  classType: ClassType
  currentLevel: number
  canTake: boolean
  requirementText: string
}

const availableClasses = computed<readonly ClassOption[]>(() => {
  const currentClasses = getAllClasses()
  const allTypes = getAllClassTypes()

  return allTypes.map(classType => {
    const current = getClassLevel(classType)
    const req = getMulticlassRequirements(classType)
    let canTake = true
    let requirementText = ''

    if (req) {
      const minScore = req.minScore
      if (req.primaryAbility) {
        const ability = character.value.abilities[req.primaryAbility as keyof typeof character.value.abilities]
        canTake = ability?.score >= minScore
        requirementText = `${req.primaryAbility.toUpperCase()} ${minScore}+`
      } else if (req.primaryAbilities && req.primaryAbilities.length > 0) {
        canTake = req.primaryAbilities.some(abilityName => {
          const ability = character.value.abilities[abilityName as keyof typeof character.value.abilities]
          return ability?.score >= minScore
        })
        requirementText = `${req.primaryAbilities.map(a => a.toUpperCase()).join(' or ')} ${minScore}+`
      }
    }

    return {
      classType,
      currentLevel: current,
      canTake: current > 0 || canTake, // Can take if already have it OR meet requirements
      requirementText,
    }
  })
})

const selectedClass = ref<ClassType | null>(null)
const hpMethod = ref<'average' | 'roll'>('average')
const manualRoll = ref<number | null>(null)
const selectedSkills = ref<string[]>([])
const selectedFightingStyle = ref<string>('')
const selectedWeaponMasteries = ref<string[]>([])
const selectedExpertise = ref<string[]>([])

const availableSkills = computed(() => {
  if (!selectedClass.value) return []
  let allSkills: string[] = []
  if (selectedClass.value === 'Fighter') {
    allSkills = fighterSkills
  } else if (selectedClass.value === 'Barbarian') {
    allSkills = BARBARIAN_SKILLS
  } else if (selectedClass.value === 'Rogue') {
    allSkills = ROGUE_SKILLS
  }
  // Filter out skills that are already proficient
  return allSkills.filter(skillName => {
    const skill = character.value.skills.find(s => s.name === skillName)
    return !skill || !skill.proficient
  })
})

const skillCount = computed(() => {
  if (selectedClass.value === 'Rogue') return 4
  return 2
})

const availableExpertiseSkills = computed(() => {
  // Expertise can only be applied to skills that are selected and proficient
  return selectedSkills.value.filter(skillName => {
    const skill = character.value.skills.find(s => s.name === skillName)
    return skill && skill.proficient
  })
})

const fightingStyles = computed(() => {
  // Filter out fighting style if already selected
  const currentStyle = character.value.fightingStyle
  if (!currentStyle) return FIGHTING_STYLES
  return FIGHTING_STYLES.filter(style => style.name !== currentStyle)
})

const weaponMasteryWeapons = computed(() => {
  const allWeapons = selectedClass.value === 'Barbarian' ? getMeleeWeapons() : WEAPON_MASTERY_WEAPONS
  const existingMasteries = character.value.weaponMastery ?? []
  // Filter out weapons that are already in weaponMastery
  return allWeapons.filter(weapon => !existingMasteries.includes(weapon.name))
})
const weaponMasteryCount = computed(() => {
  if (selectedClass.value === 'Fighter') return 3
  if (selectedClass.value === 'Barbarian') return 2
  if (selectedClass.value === 'Rogue') return 2
  return 0
})

watch(() => props.isOpen, (open) => {
  if (!open) return
  const firstAvailable = availableClasses.value.find(opt => opt.canTake)
  selectedClass.value = firstAvailable?.classType ?? null
  hpMethod.value = 'average'
  manualRoll.value = null
  selectedSkills.value = []
  selectedFightingStyle.value = ''
  selectedWeaponMasteries.value = []
  selectedExpertise.value = []
})

watch(selectedClass, (newClass) => {
  // Reset choices when class changes
  selectedSkills.value = []
  selectedFightingStyle.value = ''
  selectedWeaponMasteries.value = []
  selectedExpertise.value = []
  
  // If switching to a class that doesn't meet requirements, clear selection
  if (newClass) {
    const option = availableClasses.value.find(opt => opt.classType === newClass)
    if (option && !option.canTake) {
      selectedClass.value = null
    }
  }
})

const hitDie = computed(() => selectedClass.value ? getHitDie(selectedClass.value) : 8)
const averageGain = computed(() => selectedClass.value ? getAverageHpGainOnLevelUp(selectedClass.value) : 0)
const conModifier = computed(() => character.value.abilities.constitution.modifier)

const baseGainPreview = computed(() => {
  if (hpMethod.value === 'average') return averageGain.value
  return manualRoll.value ?? 0
})

const previewHpGain = computed(() => {
  if (!selectedClass.value) return 0
  return computeHpGainOnLevelUp(selectedClass.value, conModifier.value, {
    method: hpMethod.value,
    roll: hpMethod.value === 'roll' ? (manualRoll.value ?? undefined) : undefined,
  })
})

const hasEnoughXp = computed(() => {
  const level = currentLevel.value
  return canLevelUpWithXp(level, character.value.experiencePoints.current)
})

const selectedClassOption = computed(() => {
  return availableClasses.value.find(opt => opt.classType === selectedClass.value)
})

const canApply = computed(() => {
  if (!hasEnoughXp.value) return false
  if (!selectedClass.value) return false
  const option = selectedClassOption.value
  if (!option || !option.canTake) return false

  // If taking first level of new class, check class choices
  if (option.currentLevel === 0) {
    // Check if there are enough available skills
    if (availableSkills.value.length < skillCount.value) return false
    if (selectedSkills.value.length !== skillCount.value) return false
    
    if (selectedClass.value === 'Fighter') {
      // Check if there are available fighting styles
      if (fightingStyles.value.length === 0) return false
      if (!selectedFightingStyle.value) return false
      // Check if there are enough available weapons
      if (weaponMasteryWeapons.value.length < 3) return false
      if (selectedWeaponMasteries.value.length !== 3) return false
    } else if (selectedClass.value === 'Barbarian') {
      // Check if there are enough available weapons
      if (weaponMasteryWeapons.value.length < 2) return false
      if (selectedWeaponMasteries.value.length !== 2) return false
    } else if (selectedClass.value === 'Rogue') {
      // Check Expertise selection
      if (selectedExpertise.value.length !== 2) return false
      // Check if there are enough available weapons
      if (weaponMasteryWeapons.value.length < 2) return false
      if (selectedWeaponMasteries.value.length !== 2) return false
    }
  }

  // HP choice validation
  if (hpMethod.value === 'average') return true
  if (manualRoll.value === null) return false
  return manualRoll.value >= 1 && manualRoll.value <= hitDie.value
})

const rollNow = (): void => {
  manualRoll.value = Math.floor(Math.random() * hitDie.value) + 1
}

const applyLevelUp = (): void => {
  if (!canApply.value || !selectedClass.value) return
  
  const isNewClass = selectedClassOption.value?.currentLevel === 0
  const classChoices = isNewClass ? {
    selectedSkills: selectedSkills.value,
    selectedFightingStyle: selectedClass.value === 'Fighter' ? selectedFightingStyle.value : undefined,
    selectedWeaponMasteries: selectedWeaponMasteries.value,
    selectedExpertise: selectedClass.value === 'Rogue' ? selectedExpertise.value : undefined,
  } : undefined

  if (hpMethod.value === 'average') {
    levelUpToNext(selectedClass.value, { method: 'average' }, classChoices)
    close()
    return
  }
  levelUpToNext(selectedClass.value, { method: 'roll', roll: manualRoll.value ?? undefined }, classChoices)
  close()
}

const close = (): void => {
  emit('close')
}
</script>


<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="m-0 text-base font-cinzel font-semibold text-[var(--color-text-secondary)]">Create New Character</h2>
        <button
          @click="close"
          class="bg-transparent border-none text-xl text-[var(--color-accent-primary)] cursor-pointer w-6 h-6 flex items-center justify-center rounded transition-all duration-200 hover:bg-[var(--color-accent-primary)]/20 leading-none"
        >
          ×
        </button>
      </div>
      <div class="modal-body">
        <!-- Step 1: Class Selection -->
        <div v-if="currentStep === 1" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Step 1: Choose Your Class</h3>
          <div class="mb-1.5 flex flex-col gap-1">
            <label class="flex items-center p-2 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer hover:bg-[var(--color-bg-primary)] transition-colors"
              :class="{ 'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedClass === 'Fighter' }">
              <input
                v-model="selectedClass"
                type="radio"
                value="Fighter"
                class="mr-2"
              />
              <div class="flex-1">
                <span class="text-sm font-cinzel text-[var(--color-text-primary)]">Fighter</span>
                <p class="text-[0.65rem] text-[var(--color-text-tertiary)] italic mt-0.5">A master of martial combat, skilled with a variety of weapons and armor.</p>
              </div>
            </label>
            <label class="flex items-center p-2 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer hover:bg-[var(--color-bg-primary)] transition-colors"
              :class="{ 'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedClass === 'Barbarian' }">
              <input
                v-model="selectedClass"
                type="radio"
                value="Barbarian"
                class="mr-2"
              />
              <div class="flex-1">
                <span class="text-sm font-cinzel text-[var(--color-text-primary)]">Barbarian</span>
                <p class="text-[0.65rem] text-[var(--color-text-tertiary)] italic mt-0.5">A fierce warrior of primitive background who can enter a battle rage.</p>
              </div>
            </label>
            <label class="flex items-center p-2 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer hover:bg-[var(--color-bg-primary)] transition-colors"
              :class="{ 'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedClass === 'Rogue' }">
              <input
                v-model="selectedClass"
                type="radio"
                value="Rogue"
                class="mr-2"
              />
              <div class="flex-1">
                <span class="text-sm font-cinzel text-[var(--color-text-primary)]">Rogue</span>
                <p class="text-[0.65rem] text-[var(--color-text-tertiary)] italic mt-0.5">A scoundrel who uses stealth and trickery to overcome obstacles and enemies.</p>
              </div>
            </label>
            <label class="flex items-center p-2 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer hover:bg-[var(--color-bg-primary)] transition-colors"
              :class="{ 'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedClass === 'Paladin' }">
              <input
                v-model="selectedClass"
                type="radio"
                value="Paladin"
                class="mr-2"
              />
              <div class="flex-1">
                <span class="text-sm font-cinzel text-[var(--color-text-primary)]">Paladin</span>
                <p class="text-[0.65rem] text-[var(--color-text-tertiary)] italic mt-0.5">A holy warrior bound to a sacred oath who wields divine magic.</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 2: Ability Scores (handled by AbilitiesEditModal) -->

        <!-- Step 3: Skill Selection -->
        <div v-if="currentStep === 3 && selectedClass" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Step 2: Choose {{ skillCount }} Skills</h3>
          <div class="grid grid-cols-2 gap-1 mb-1.5">
            <label
              v-for="skill in availableSkills"
              :key="skill"
              class="flex items-center p-1.5 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer transition-colors text-sm"
              :class="{ 'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedSkills.includes(skill), 'opacity-50 cursor-not-allowed': !selectedSkills.includes(skill) && selectedSkills.length >= skillCount }"
            >
              <input
                type="checkbox"
                :value="skill"
                v-model="selectedSkills"
                :disabled="!selectedSkills.includes(skill) && selectedSkills.length >= skillCount"
                class="mr-1.5 w-3 h-3"
              />
              <span class="text-[var(--color-text-primary)]">{{ skill }}</span>
            </label>
          </div>
          <div class="text-center text-sm" :class="{ 'text-[var(--color-success)]': selectedSkills.length === skillCount, 'text-[var(--color-danger)]': selectedSkills.length !== skillCount }">
            Selected: {{ selectedSkills.length }} / {{ skillCount }} skills
          </div>
        </div>

        <!-- Step 3.5: Expertise Selection (for Rogue) -->
        <div v-if="currentStep === 3 && selectedClass === 'Rogue'" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Step 2.5: Choose 2 Skills for Expertise</h3>
          <div v-if="selectedSkills.length < skillCount" class="text-xs text-[var(--color-text-tertiary)] italic mb-1.5">
            Select {{ skillCount }} skills first.
          </div>
          <div v-else class="grid grid-cols-2 gap-1 mb-1.5">
            <label
              v-for="skill in selectedSkills"
              :key="skill"
              class="flex items-center p-1.5 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer transition-colors text-sm"
              :class="{ 'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedExpertise.includes(skill), 'opacity-50 cursor-not-allowed': !selectedExpertise.includes(skill) && selectedExpertise.length >= 2 }"
            >
              <input
                type="checkbox"
                :value="skill"
                v-model="selectedExpertise"
                :disabled="!selectedExpertise.includes(skill) && selectedExpertise.length >= 2"
                class="mr-1.5 w-3 h-3"
              />
              <span class="text-[var(--color-text-primary)]">{{ skill }}</span>
            </label>
          </div>
          <div class="text-center text-sm" :class="{ 'text-[var(--color-success)]': selectedExpertise.length === 2, 'text-[var(--color-danger)]': selectedExpertise.length !== 2 }">
            Selected: {{ selectedExpertise.length }} / 2 expertise skills
          </div>
        </div>

        <!-- Step 4: Fighting Style Selection (for Fighter and Paladin) -->
        <div v-if="currentStep === 3 && (selectedClass === 'Fighter' || selectedClass === 'Paladin')" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Step 4: Choose a Fighting Style</h3>
          <div class="flex flex-col gap-1 mb-1.5">
            <label
              v-for="style in fightingStyles"
              :key="style.name"
              class="flex items-start p-1.5 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer transition-colors text-sm"
              :class="{ 'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedFightingStyle === style.name }"
            >
              <input
                v-model="selectedFightingStyle"
                type="radio"
                :value="style.name"
                class="mt-0.5 mr-1.5 w-3 h-3"
              />
              <div class="flex-1">
                <div class="font-semibold text-[var(--color-text-primary)]">{{ style.name }}</div>
                <div class="text-xs text-[var(--color-text-tertiary)] mt-0.5">{{ style.description }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 5: Weapon Mastery Selection (for Barbarian, Rogue, and Paladin) -->
        <div v-if="currentStep === 3 && (selectedClass === 'Barbarian' || selectedClass === 'Rogue' || selectedClass === 'Paladin')" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">
            Step 5: Choose 2 {{ selectedClass === 'Barbarian' ? 'Melee ' : '' }}Weapons for Weapon Mastery
          </h3>
          <p class="text-xs text-[var(--color-text-tertiary)] mb-1.5">Select 2 melee weapons from Simple or Martial weapons:</p>
          <div class="max-h-[200px] overflow-y-auto border border-[var(--color-border-primary)] rounded p-1.5 mb-1.5">
            <div class="grid grid-cols-1 gap-1">
              <label
                v-for="weapon in weaponMasteryWeapons"
                :key="weapon.name"
                class="flex items-center p-1.5 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer transition-colors text-sm"
                :class="{ 'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedWeaponMasteries.includes(weapon.name), 'opacity-50 cursor-not-allowed': !selectedWeaponMasteries.includes(weapon.name) && selectedWeaponMasteries.length >= 2 }"
              >
                <input
                  type="checkbox"
                  :value="weapon.name"
                  v-model="selectedWeaponMasteries"
                  :disabled="!selectedWeaponMasteries.includes(weapon.name) && selectedWeaponMasteries.length >= 2"
                  class="mr-1.5 w-3 h-3"
                />
                <div class="flex-1">
                  <span class="font-semibold text-[var(--color-text-primary)]">{{ weapon.name }}</span>
                  <span class="text-xs text-[var(--color-text-tertiary)] ml-1">({{ weapon.type }}, {{ weapon.mastery }})</span>
                </div>
              </label>
            </div>
          </div>
          <div class="text-center text-sm" :class="{ 'text-[var(--color-success)]': selectedWeaponMasteries.length === 2, 'text-[var(--color-danger)]': selectedWeaponMasteries.length !== 2 }">
            Selected: {{ selectedWeaponMasteries.length }} / 2 weapons
          </div>
        </div>

        <!-- Step 5: Weapon Mastery Selection (for Fighter) -->
        <div v-if="currentStep === 3 && selectedClass === 'Fighter'" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Step 5: Choose 3 Weapons for Weapon Mastery</h3>
          <p class="text-xs text-[var(--color-text-tertiary)] mb-1.5">Select 3 weapons from Simple or Martial weapons:</p>
          <div class="max-h-[200px] overflow-y-auto border border-[var(--color-border-primary)] rounded p-1.5 mb-1.5">
            <div class="grid grid-cols-1 gap-1">
              <label
                v-for="weapon in weaponMasteryWeapons"
                :key="weapon.name"
                class="flex items-center p-1.5 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer transition-colors text-sm"
                :class="{ 'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedWeaponMasteries.includes(weapon.name), 'opacity-50 cursor-not-allowed': !selectedWeaponMasteries.includes(weapon.name) && selectedWeaponMasteries.length >= 3 }"
              >
                <input
                  type="checkbox"
                  :value="weapon.name"
                  v-model="selectedWeaponMasteries"
                  :disabled="!selectedWeaponMasteries.includes(weapon.name) && selectedWeaponMasteries.length >= 3"
                  class="mr-1.5 w-3 h-3"
                />
                <div class="flex-1">
                  <span class="font-semibold text-[var(--color-text-primary)]">{{ weapon.name }}</span>
                  <span class="text-xs text-[var(--color-text-tertiary)] ml-1">({{ weapon.type }}, {{ weapon.mastery }})</span>
                </div>
              </label>
            </div>
          </div>
          <div class="text-center text-sm" :class="{ 'text-[var(--color-success)]': selectedWeaponMasteries.length === 3, 'text-[var(--color-danger)]': selectedWeaponMasteries.length !== 3 }">
            Selected: {{ selectedWeaponMasteries.length }} / 3 weapons
          </div>
        </div>

        <!-- Step 4: Origin Selection (Last Step) -->
        <div v-if="currentStep === 4" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Step 4: Select Origins</h3>
          <p class="text-xs text-[var(--color-text-tertiary)] mb-1.5">Select one or more origins. Each origin grants ability score increases, proficiencies, features, and an origin feat.</p>
          <button @click="openOriginModal" class="btn btn-primary text-sm mb-2">Select Origins</button>
          <div v-if="selectedOrigins.length > 0" class="flex flex-col gap-1 mb-2">
            <div
              v-for="originId in selectedOrigins"
              :key="originId"
              class="card-compact p-1.5 flex items-center justify-between"
            >
              <span class="text-sm font-semibold">{{ getOriginName(originId) }}</span>
              <button @click="removeOrigin(originId)" class="btn btn-danger text-xs px-1.5 py-0.5">×</button>
            </div>
          </div>
          <div v-else class="text-center py-4 text-[var(--color-text-muted)] italic text-sm mb-2">
            No origins selected. Click "Select Origins" to choose.
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="btn btn-secondary text-sm">Cancel</button>
        <button
          v-if="currentStep === 1"
          @click="goToAbilityScores"
          class="btn btn-primary text-sm"
          :disabled="!selectedClass"
        >
          Next
        </button>
        <button
          v-else-if="currentStep === 3"
          @click="goToOrigins"
          class="btn btn-primary text-sm"
          :disabled="!canProceedToStep4"
        >
          Next
        </button>
        <button
          v-else-if="currentStep === 4"
          @click="createCharacter"
          class="btn btn-primary text-sm"
          :disabled="!canCreate"
        >
          Create Character
        </button>
      </div>
    </div>

    <!-- Abilities Edit Modal for Step 2 -->
    <AbilitiesEditModal
      :is-open="isAbilitiesModalOpen"
      @close="closeAbilitiesModal"
      @save="handleAbilitiesSave"
    />

    <!-- Origin Selection Modal -->
    <OriginSelectionModal
      v-if="isOriginModalOpen"
      :is-open="isOriginModalOpen"
      :selected-origins="selectedOrigins"
      @close="isOriginModalOpen = false"
      @select="handleOriginSelect"
    />

  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import type { Character } from '~/types/character'
import { FIGHTING_STYLES, WEAPON_MASTERY_WEAPONS, BARBARIAN_SKILLS, ROGUE_SKILLS, PALADIN_SKILLS, getMeleeWeapons } from '~/composables/useCharacter'
import AbilitiesEditModal from './AbilitiesEditModal.vue'
import OriginSelectionModal from './OriginSelectionModal.vue'
import originsJson from '~/data/origins.json'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  create: [charClass: string, selectedSkills: string[], selectedFightingStyle: string | undefined, selectedWeaponMasteries: string[], selectedExpertise?: string[], abilityScores?: Character['abilities'], origins?: string[]]
}>()

const currentStep = ref(1) // 1 = class, 2 = ability scores, 3 = skills/fighting style/weapon mastery, 4 = origins (last step)
const selectedClass = ref<'Fighter' | 'Barbarian' | 'Rogue' | 'Paladin'>('Fighter')
const selectedSkills = ref<string[]>([])
const selectedFightingStyle = ref('')
const selectedWeaponMasteries = ref<string[]>([])
const selectedExpertise = ref<string[]>([])
const selectedOrigins = ref<string[]>([])
const isAbilitiesModalOpen = ref(false)
const isOriginModalOpen = ref(false)
const savedAbilityScores = ref<Character['abilities'] | null>(null)

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

const barbarianSkills = BARBARIAN_SKILLS
const rogueSkills = ROGUE_SKILLS
const paladinSkills = PALADIN_SKILLS
const fightingStyles = FIGHTING_STYLES

const availableSkills = computed(() => {
  if (selectedClass.value === 'Fighter') return fighterSkills
  if (selectedClass.value === 'Barbarian') return barbarianSkills
  if (selectedClass.value === 'Rogue') return rogueSkills
  if (selectedClass.value === 'Paladin') return paladinSkills
  return []
})

const skillCount = computed(() => {
  if (selectedClass.value === 'Rogue') return 4
  return 2
})

const weaponMasteryWeapons = computed(() => selectedClass.value === 'Barbarian' ? getMeleeWeapons() : WEAPON_MASTERY_WEAPONS)
const weaponMasteryCount = computed(() => selectedClass.value === 'Fighter' ? 3 : 2)

const canProceedToStep4 = computed(() => {
  if (currentStep.value !== 3) return false
  if (!selectedClass.value || !savedAbilityScores.value || selectedSkills.value.length !== skillCount.value) return false
  if (selectedClass.value === 'Fighter') {
    return selectedFightingStyle.value !== '' && selectedWeaponMasteries.value.length === 3
  } else if (selectedClass.value === 'Barbarian') {
    return selectedWeaponMasteries.value.length === 2
  } else if (selectedClass.value === 'Rogue') {
    return selectedExpertise.value.length === 2 && selectedWeaponMasteries.value.length === 2
  } else if (selectedClass.value === 'Paladin') {
    // Paladin gets fighting style at level 2, not level 1, so it's optional at creation
    return selectedWeaponMasteries.value.length === 2
  }
  return false
})

const canCreate = computed(() => {
  // Must be on step 4 (origins step) and have completed all previous steps
  // Since we're on step 4, we know step 3 was already validated (canProceedToStep4 was true)
  // Origins are optional, so we just need basic requirements
  return currentStep.value === 4 && selectedClass.value !== null && savedAbilityScores.value !== null
})

const toggleSkill = (skill: string) => {
  const index = selectedSkills.value.indexOf(skill)
  if (index > -1) {
    selectedSkills.value.splice(index, 1)
  } else if (selectedSkills.value.length < 2) {
    selectedSkills.value.push(skill)
  }
}

const goToAbilityScores = () => {
  if (selectedClass.value) {
    const { character } = useCharacter()

    // Clear properties that trigger watchers to avoid recursive updates
    // Do this carefully without triggering full character reset
    if (character.value.classes && character.value.classes.length > 0) {
      character.value.classes = []
    }
    if (character.value.spells && character.value.spells.length > 0) {
      character.value.spells = []
    }
    if (character.value.actions && character.value.actions.length > 0) {
      character.value.actions = []
    }
    if (character.value.spellSlots && character.value.spellSlots.length > 0) {
      character.value.spellSlots = []
    }
    if (character.value.resources && Object.keys(character.value.resources).length > 0) {
      character.value.resources = {}
    }

    // Ensure abilities exist with default values
    if (!character.value.abilities || Object.keys(character.value.abilities).length === 0) {
      const defaultAbilities = {
        strength: { score: 10, modifier: 0, saveProficient: false, saveModifier: 0, customModifier: 0 },
        dexterity: { score: 10, modifier: 0, saveProficient: false, saveModifier: 0, customModifier: 0 },
        constitution: { score: 10, modifier: 0, saveProficient: false, saveModifier: 0, customModifier: 0 },
        intelligence: { score: 10, modifier: 0, saveProficient: false, saveModifier: 0, customModifier: 0 },
        wisdom: { score: 10, modifier: 0, saveProficient: false, saveModifier: 0, customModifier: 0 },
        charisma: { score: 10, modifier: 0, saveProficient: false, saveModifier: 0, customModifier: 0 },
      }
      character.value.abilities = defaultAbilities
    }

    // Use nextTick to defer opening the modal, allowing watchers to settle
    nextTick(() => {
      isAbilitiesModalOpen.value = true
    })
  }
}

const closeAbilitiesModal = () => {
  isAbilitiesModalOpen.value = false
  // If user cancels, stay on step 1
  if (!savedAbilityScores.value) {
    currentStep.value = 1
  }
}

const handleAbilitiesSave = (abilities: Character['abilities']) => {
  savedAbilityScores.value = abilities
  isAbilitiesModalOpen.value = false
  currentStep.value = 3 // Move to rest of creation
}

const goToOrigins = () => {
  currentStep.value = 4
}

const openOriginModal = () => {
  isOriginModalOpen.value = true
}

const handleOriginSelect = (originIds: string[]) => {
  selectedOrigins.value = originIds
  isOriginModalOpen.value = false
}

const removeOrigin = (originId: string) => {
  const index = selectedOrigins.value.indexOf(originId)
  if (index !== -1) {
    selectedOrigins.value.splice(index, 1)
  }
}

const getOriginName = (originId: string): string => {
  const originsData = originsJson as { origins: any[] }
  const origin = originsData.origins.find(o => o.id === originId)
  return origin?.name || originId
}

const createCharacter = () => {
  if (canCreate.value && savedAbilityScores.value) {
    // Fighter gets fighting style at level 1, Paladin can select it at creation (applied at level 2)
    const fightingStyle = (selectedClass.value === 'Fighter' || selectedClass.value === 'Paladin')
      ? selectedFightingStyle.value
      : undefined
    const expertise = selectedClass.value === 'Rogue' ? selectedExpertise.value : undefined
    emit('create', selectedClass.value, selectedSkills.value, fightingStyle, selectedWeaponMasteries.value, expertise, savedAbilityScores.value, selectedOrigins.value)
    // Reset state
    currentStep.value = 1
    selectedClass.value = 'Fighter'
    selectedSkills.value = []
    selectedFightingStyle.value = ''
    selectedWeaponMasteries.value = []
    selectedExpertise.value = []
    selectedOrigins.value = []
    savedAbilityScores.value = null
  }
}

// Reset selections when class changes
watch(selectedClass, () => {
  selectedSkills.value = []
  selectedFightingStyle.value = ''
  selectedWeaponMasteries.value = []
  selectedExpertise.value = []
})

// Reset step when modal opens/closes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    currentStep.value = 1
    savedAbilityScores.value = null
  }
})

const close = () => {
  currentStep.value = 1
  savedAbilityScores.value = null
  emit('close')
}
</script>

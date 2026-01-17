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
        <div class="mb-2">
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

        <!-- Step 2: Skill Selection -->
        <div v-if="selectedClass" class="mb-2">
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

        <!-- Step 2.5: Expertise Selection (for Rogue) -->
        <div v-if="selectedClass === 'Rogue'" class="mb-2">
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

        <!-- Step 3: Fighting Style Selection (for Fighter only) -->
        <div v-if="selectedClass === 'Fighter'" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Step 3: Choose Fighting Style</h3>
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

        <!-- Step 3: Fighting Style Selection (for Fighter and Paladin) -->
        <div v-if="selectedClass === 'Fighter' || selectedClass === 'Paladin'" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Step 3: Choose a Fighting Style</h3>
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

        <!-- Step 4: Weapon Mastery Selection (for Barbarian, Rogue, and Paladin) -->
        <div v-if="selectedClass === 'Barbarian' || selectedClass === 'Rogue' || selectedClass === 'Paladin'" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">
            Step {{ selectedClass === 'Rogue' ? '3' : selectedClass === 'Paladin' ? '4' : '3' }}: Choose 2 {{ selectedClass === 'Barbarian' ? 'Melee ' : '' }}Weapons for Weapon Mastery
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

        <!-- Step 4: Weapon Mastery Selection (for Fighter) -->
        <div v-if="selectedClass === 'Fighter'" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Step 4: Choose 3 Weapons for Weapon Mastery</h3>
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
      </div>
      <div class="modal-footer">
        <button @click="close" class="btn btn-secondary text-sm">Cancel</button>
        <button
          @click="createCharacter"
          class="btn btn-primary text-sm"
          :disabled="!canCreate"
        >
          Create Character
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FIGHTING_STYLES, WEAPON_MASTERY_WEAPONS, BARBARIAN_SKILLS, ROGUE_SKILLS, PALADIN_SKILLS, getMeleeWeapons } from '~/composables/useCharacter'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  create: [charClass: string, selectedSkills: string[], selectedFightingStyle: string | undefined, selectedWeaponMasteries: string[], selectedExpertise?: string[]]
}>()

const selectedClass = ref<'Fighter' | 'Barbarian' | 'Rogue' | 'Paladin'>('Fighter')
const selectedSkills = ref<string[]>([])
const selectedFightingStyle = ref('')
const selectedWeaponMasteries = ref<string[]>([])
const selectedExpertise = ref<string[]>([])

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

const canCreate = computed(() => {
  if (!selectedClass.value || selectedSkills.value.length !== skillCount.value) return false
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

const toggleSkill = (skill: string) => {
  const index = selectedSkills.value.indexOf(skill)
  if (index > -1) {
    selectedSkills.value.splice(index, 1)
  } else if (selectedSkills.value.length < 2) {
    selectedSkills.value.push(skill)
  }
}

const createCharacter = () => {
  if (canCreate.value) {
    // Fighter gets fighting style at level 1, Paladin can select it at creation (applied at level 2)
    const fightingStyle = (selectedClass.value === 'Fighter' || selectedClass.value === 'Paladin')
      ? selectedFightingStyle.value
      : undefined
    const expertise = selectedClass.value === 'Rogue' ? selectedExpertise.value : undefined
    emit('create', selectedClass.value, selectedSkills.value, fightingStyle, selectedWeaponMasteries.value, expertise)
    selectedClass.value = 'Fighter'
    selectedSkills.value = []
    selectedFightingStyle.value = ''
    selectedWeaponMasteries.value = []
    selectedExpertise.value = []
  }
}

// Reset selections when class changes
watch(selectedClass, () => {
  selectedSkills.value = []
  selectedFightingStyle.value = ''
  selectedWeaponMasteries.value = []
  selectedExpertise.value = []
})

const close = () => {
  emit('close')
}
</script>

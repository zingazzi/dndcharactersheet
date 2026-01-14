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
          <div class="mb-1.5">
            <label class="flex items-center p-2 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer hover:bg-[var(--color-bg-primary)] transition-colors">
              <input
                v-model="selectedClass"
                type="radio"
                value="Fighter"
                checked
                disabled
                class="mr-2"
              />
              <span class="text-sm font-cinzel text-[var(--color-text-primary)]">Fighter (Only class available)</span>
            </label>
          </div>
          <p class="text-[0.65rem] text-[var(--color-text-tertiary)] italic">
            A master of martial combat, skilled with a variety of weapons and armor.
          </p>
        </div>

        <!-- Step 2: Skill Selection (for Fighter) -->
        <div v-if="selectedClass === 'Fighter'" class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Step 2: Choose 2 Skills</h3>
          <div class="grid grid-cols-2 gap-1 mb-1.5">
            <label
              v-for="skill in fighterSkills"
              :key="skill"
              class="flex items-center p-1.5 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] cursor-pointer transition-colors text-sm"
              :class="{ 'bg-[var(--color-bg-primary)] border-[var(--color-accent-primary)]': selectedSkills.includes(skill), 'opacity-50 cursor-not-allowed': !selectedSkills.includes(skill) && selectedSkills.length >= 2 }"
            >
              <input
                type="checkbox"
                :value="skill"
                v-model="selectedSkills"
                :disabled="!selectedSkills.includes(skill) && selectedSkills.length >= 2"
                class="mr-1.5 w-3 h-3"
              />
              <span class="text-[var(--color-text-primary)]">{{ skill }}</span>
            </label>
          </div>
          <div class="text-center text-sm" :class="{ 'text-[var(--color-success)]': selectedSkills.length === 2, 'text-[var(--color-danger)]': selectedSkills.length !== 2 }">
            Selected: {{ selectedSkills.length }} / 2 skills
          </div>
        </div>

        <!-- Step 3: Fighting Style Selection (for Fighter) -->
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
import { FIGHTING_STYLES, WEAPON_MASTERY_WEAPONS } from '~/composables/useCharacter'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  create: [charClass: string, selectedSkills: string[], selectedFightingStyle: string, selectedWeaponMasteries: string[]]
}>()

const selectedClass = ref('Fighter')
const selectedSkills = ref<string[]>([])
const selectedFightingStyle = ref('')
const selectedWeaponMasteries = ref<string[]>([])

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

const fightingStyles = FIGHTING_STYLES
const weaponMasteryWeapons = WEAPON_MASTERY_WEAPONS

const canCreate = computed(() => {
  return selectedClass.value && 
         selectedSkills.value.length === 2 && 
         selectedFightingStyle.value !== '' && 
         selectedWeaponMasteries.value.length === 3
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
    emit('create', selectedClass.value, selectedSkills.value, selectedFightingStyle.value, selectedWeaponMasteries.value)
    selectedClass.value = 'Fighter'
    selectedSkills.value = []
    selectedFightingStyle.value = ''
    selectedWeaponMasteries.value = []
  }
}

const close = () => {
  emit('close')
}
</script>

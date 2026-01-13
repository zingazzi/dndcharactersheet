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
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  create: [charClass: string, selectedSkills: string[]]
}>()

const selectedClass = ref('Fighter')
const selectedSkills = ref<string[]>([])

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

const canCreate = computed(() => {
  return selectedClass.value && selectedSkills.value.length === 2
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
    emit('create', selectedClass.value, selectedSkills.value)
    selectedClass.value = 'Fighter'
    selectedSkills.value = []
  }
}

const close = () => {
  emit('close')
}
</script>

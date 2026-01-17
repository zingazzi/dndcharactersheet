<template>
  <div class="flex items-center gap-0 py-1 px-3 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-primary)] shadow-sm relative z-[100]">
    <div class="relative py-1 px-2 cursor-pointer select-none transition-colors duration-200 hover:bg-[var(--color-accent-primary)]/10" @mouseenter="handleFileMenuEnter" @mouseleave="handleFileMenuLeave">
      <span class="font-cinzel font-medium text-xs text-[var(--color-text-secondary)] tracking-wide">File</span>
      <div
        v-if="showFileMenu"
        class="absolute top-full left-0 min-w-[160px] bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded shadow-lg mt-0.5 z-[1000]"
        @mouseenter="handleFileMenuEnter"
        @mouseleave="handleFileMenuLeave"
      >
        <div class="py-1.5 px-3 cursor-pointer transition-colors duration-200 font-cinzel text-xs text-[var(--color-text-primary)] border-b border-[var(--color-border-divider)] hover:bg-[var(--color-accent-primary)]/15" @click="openNewCharacter">
          <span>New Character</span>
        </div>
        <div class="py-1.5 px-3 opacity-50 cursor-not-allowed font-cinzel text-xs text-[var(--color-text-tertiary)] border-b border-[var(--color-border-divider)]">
          <span>Load Character</span>
        </div>
        <div class="py-1.5 px-3 opacity-50 cursor-not-allowed font-cinzel text-xs text-[var(--color-text-tertiary)]">
          <span>Save Character</span>
        </div>
      </div>
    </div>
    <div class="relative py-1 px-2 cursor-pointer select-none transition-colors duration-200 hover:bg-[var(--color-accent-primary)]/10" @mouseenter="handleOptionsMenuEnter" @mouseleave="handleOptionsMenuLeave">
      <span class="font-cinzel font-medium text-xs text-[var(--color-text-secondary)] tracking-wide">Options</span>
      <div
        v-if="showOptionsMenu"
        class="absolute top-full left-0 min-w-[160px] bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded shadow-lg mt-0.5 z-[1000]"
        @mouseenter="handleOptionsMenuEnter"
        @mouseleave="handleOptionsMenuLeave"
      >
        <div class="py-1.5 px-3 opacity-50 cursor-not-allowed font-cinzel text-xs text-[var(--color-text-tertiary)] border-b border-[var(--color-border-divider)]">
          <span>Settings</span>
        </div>
        <div class="py-1.5 px-3 opacity-50 cursor-not-allowed font-cinzel text-xs text-[var(--color-text-tertiary)]">
          <span>Color Scheme</span>
        </div>
      </div>
    </div>
    <NewCharacterModal
      :is-open="isNewCharacterModalOpen"
      @close="closeNewCharacterModal"
      @create="handleCreateCharacter"
    />
  </div>
</template>

<script setup lang="ts">
import type { Character } from '~/types/character'

const showFileMenu = ref(false)
const showOptionsMenu = ref(false)
const isNewCharacterModalOpen = ref(false)

let fileMenuTimeout: ReturnType<typeof setTimeout> | null = null
let optionsMenuTimeout: ReturnType<typeof setTimeout> | null = null

const handleFileMenuEnter = () => {
  if (fileMenuTimeout) {
    clearTimeout(fileMenuTimeout)
    fileMenuTimeout = null
  }
  showFileMenu.value = true
}

const handleFileMenuLeave = () => {
  fileMenuTimeout = setTimeout(() => {
    showFileMenu.value = false
    fileMenuTimeout = null
  }, 250) // 250ms delay
}

const handleOptionsMenuEnter = () => {
  if (optionsMenuTimeout) {
    clearTimeout(optionsMenuTimeout)
    optionsMenuTimeout = null
  }
  showOptionsMenu.value = true
}

const handleOptionsMenuLeave = () => {
  optionsMenuTimeout = setTimeout(() => {
    showOptionsMenu.value = false
    optionsMenuTimeout = null
  }, 250) // 250ms delay
}

const openNewCharacter = () => {
  isNewCharacterModalOpen.value = true
  if (fileMenuTimeout) {
    clearTimeout(fileMenuTimeout)
    fileMenuTimeout = null
  }
  showFileMenu.value = false
}

const closeNewCharacterModal = () => {
  isNewCharacterModalOpen.value = false
}

const handleCreateCharacter = (characterClass: string, selectedSkills: string[], selectedFightingStyle: string | undefined, selectedWeaponMasteries: string[], selectedExpertise?: string[], abilityScores?: Character['abilities']) => {
  const { createNewCharacter, resetCharacter } = useCharacter()
  const newCharacter = createNewCharacter(characterClass, selectedSkills, selectedFightingStyle, selectedWeaponMasteries, selectedExpertise)

  // Apply custom ability scores if provided
  if (abilityScores) {
    Object.keys(abilityScores).forEach(key => {
      const abilityKey = key as keyof Character['abilities']
      const ability = abilityScores[abilityKey]
      newCharacter.abilities[abilityKey].score = ability.score
      newCharacter.abilities[abilityKey].customModifier = ability.customModifier || 0
    })
    // Recalculate modifiers
    Object.keys(newCharacter.abilities).forEach(key => {
      const abilityKey = key as keyof Character['abilities']
      const ability = newCharacter.abilities[abilityKey]
      const finalScore = ability.score + (ability.customModifier || 0)
      ability.modifier = Math.floor((finalScore - 10) / 2)
    })
  }

  resetCharacter(newCharacter)
  closeNewCharacterModal()
}
</script>

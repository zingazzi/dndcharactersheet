<template>
  <div class="flex items-center gap-0 py-1 px-3 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-primary)] shadow-sm relative z-[100]">
    <div class="relative py-1 px-2 cursor-pointer select-none transition-colors duration-200 hover:bg-[var(--color-accent-primary)]/10" @mouseenter="showFileMenu = true" @mouseleave="showFileMenu = false">
      <span class="font-cinzel font-medium text-xs text-[var(--color-text-secondary)] tracking-wide">File</span>
      <div
        v-if="showFileMenu"
        class="absolute top-full left-0 min-w-[160px] bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded shadow-lg mt-0.5 z-[1000]"
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
    <div class="relative py-1 px-2 cursor-pointer select-none transition-colors duration-200 hover:bg-[var(--color-accent-primary)]/10" @mouseenter="showOptionsMenu = true" @mouseleave="showOptionsMenu = false">
      <span class="font-cinzel font-medium text-xs text-[var(--color-text-secondary)] tracking-wide">Options</span>
      <div
        v-if="showOptionsMenu"
        class="absolute top-full left-0 min-w-[160px] bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded shadow-lg mt-0.5 z-[1000]"
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
const showFileMenu = ref(false)
const showOptionsMenu = ref(false)
const isNewCharacterModalOpen = ref(false)

const openNewCharacter = () => {
  isNewCharacterModalOpen.value = true
  showFileMenu.value = false
}

const closeNewCharacterModal = () => {
  isNewCharacterModalOpen.value = false
}

const handleCreateCharacter = (characterClass: string, selectedSkills: string[], selectedFightingStyle: string | undefined, selectedWeaponMasteries: string[], selectedExpertise?: string[]) => {
  const { createNewCharacter, resetCharacter } = useCharacter()
  const newCharacter = createNewCharacter(characterClass, selectedSkills, selectedFightingStyle, selectedWeaponMasteries, selectedExpertise)
  resetCharacter(newCharacter)
  closeNewCharacterModal()
}
</script>

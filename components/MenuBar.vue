<template>
  <div class="flex items-center gap-0 py-2 px-4 bg-gradient-to-b from-parchment/90 to-parchment-dark/80 border-b-2 border-brown shadow-md relative z-[100]">
    <div class="relative py-2 px-4 cursor-pointer select-none transition-colors duration-200 hover:bg-brown/10" @mouseenter="showFileMenu = true" @mouseleave="showFileMenu = false">
      <span class="font-cinzel font-semibold text-sm text-text-brown tracking-wide">File</span>
      <div
        v-if="showFileMenu"
        class="absolute top-full left-0 min-w-[180px] bg-gradient-to-b from-parchment to-parchment-dark border-2 border-brown rounded shadow-dnd-lg mt-1 z-[1000]"
      >
        <div class="py-3 px-4 cursor-pointer transition-colors duration-200 font-cinzel text-sm text-text-dark border-b border-brown/20 hover:bg-brown/15" @click="openNewCharacter">
          <span>New Character</span>
        </div>
        <div class="py-3 px-4 opacity-50 cursor-not-allowed font-cinzel text-sm text-gray-600 border-b border-brown/20">
          <span>Load Character</span>
        </div>
        <div class="py-3 px-4 opacity-50 cursor-not-allowed font-cinzel text-sm text-gray-600">
          <span>Save Character</span>
        </div>
      </div>
    </div>
    <div class="relative py-2 px-4 cursor-pointer select-none transition-colors duration-200 hover:bg-brown/10" @mouseenter="showOptionsMenu = true" @mouseleave="showOptionsMenu = false">
      <span class="font-cinzel font-semibold text-sm text-text-brown tracking-wide">Options</span>
      <div
        v-if="showOptionsMenu"
        class="absolute top-full left-0 min-w-[180px] bg-gradient-to-b from-parchment to-parchment-dark border-2 border-brown rounded shadow-dnd-lg mt-1 z-[1000]"
      >
        <div class="py-3 px-4 opacity-50 cursor-not-allowed font-cinzel text-sm text-gray-600 border-b border-brown/20">
          <span>Settings</span>
        </div>
        <div class="py-3 px-4 opacity-50 cursor-not-allowed font-cinzel text-sm text-gray-600">
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

const handleCreateCharacter = (characterClass: string, selectedSkills: string[]) => {
  const { createNewCharacter, resetCharacter } = useCharacter()
  const newCharacter = createNewCharacter(characterClass, selectedSkills)
  resetCharacter(newCharacter)
  closeNewCharacterModal()
}
</script>


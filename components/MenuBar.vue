<template>
  <div class="menu-bar">
    <div class="menu-item" @mouseenter="showFileMenu = true" @mouseleave="showFileMenu = false">
      <span class="menu-label">File</span>
      <div v-if="showFileMenu" class="dropdown-menu">
        <div class="menu-option" @click="openNewCharacter">
          <span>New Character</span>
        </div>
        <div class="menu-option disabled">
          <span>Load Character</span>
        </div>
        <div class="menu-option disabled">
          <span>Save Character</span>
        </div>
      </div>
    </div>
    <div class="menu-item" @mouseenter="showOptionsMenu = true" @mouseleave="showOptionsMenu = false">
      <span class="menu-label">Options</span>
      <div v-if="showOptionsMenu" class="dropdown-menu">
        <div class="menu-option disabled">
          <span>Settings</span>
        </div>
        <div class="menu-option disabled">
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

<style scoped>
.menu-bar {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0.5rem 1rem;
  background: linear-gradient(180deg, rgba(244, 232, 208, 0.9) 0%, rgba(232, 212, 184, 0.8) 100%);
  border-bottom: 2px solid #8b4513;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.menu-item {
  position: relative;
  padding: 0.5rem 1rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background: rgba(139, 69, 19, 0.1);
}

.menu-label {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 0.95rem;
  color: #5c3a21;
  letter-spacing: 0.05em;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;
  background: linear-gradient(180deg, #f4e8d0 0%, #e8d4b8 100%);
  border: 2px solid #8b4513;
  border-radius: 4px;
  box-shadow: 
    0 0 0 1px #d4a574,
    0 4px 12px rgba(0, 0, 0, 0.3);
  margin-top: 0.25rem;
  z-index: 1000;
}

.menu-option {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  color: #2c1810;
  border-bottom: 1px solid rgba(139, 69, 19, 0.2);
}

.menu-option:last-child {
  border-bottom: none;
}

.menu-option:not(.disabled):hover {
  background: rgba(139, 69, 19, 0.15);
}

.menu-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #666;
}
</style>

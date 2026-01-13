<template>
  <div class="p-2 border-b border-[var(--color-border-primary)] mb-2 bg-[var(--color-bg-primary)]">
    <div class="flex items-center gap-3 flex-wrap">
      <!-- Character Image -->
      <div class="relative w-16 h-16 border border-[var(--color-border-primary)] rounded overflow-hidden shrink-0">
        <img v-if="character.image" :src="character.image" alt="Character" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 text-[0.65rem]">Img</div>
      </div>

      <!-- Character Info -->
      <div class="flex items-center gap-3 flex-wrap flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-bold font-cinzel-decorative text-[var(--color-text-primary)] tracking-wide m-0">{{ character.name || 'Unnamed Character' }}</h1>
          <button
            @click="openEditModal"
            class="btn btn-primary text-sm px-2 py-1"
            title="Edit Character"
          >
            ✎
          </button>
        </div>

        <div class="flex items-center gap-2 text-sm">
          <span class="font-medium text-[var(--color-text-secondary)]">{{ character.classLevel || 'No Class' }}</span>
          <span class="text-[var(--color-text-tertiary)]">•</span>
          <span class="text-[var(--color-text-tertiary)]">Level {{ character.level || 1 }}</span>
        </div>

        <div
          class="clickable-text flex items-center gap-1 text-sm"
          @click="openXPModal"
          title="Click to manage XP"
        >
          <span class="font-semibold text-[var(--color-text-secondary)]">XP:</span>
          <span class="font-bold text-[var(--color-text-primary)]">{{ character.experiencePoints.current.toLocaleString() }}</span>
          <span class="text-[var(--color-text-tertiary)]">/</span>
          <span class="font-semibold text-[var(--color-accent-primary-dark)]">{{ character.experiencePoints.nextLevel.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Utility Button -->
      <button
        @click="openHistoryModal"
        class="btn btn-primary text-sm px-2 py-1"
        title="Dice History"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
          <path d="M21 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
          <path d="M3 12c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"/>
        </svg>
      </button>
    </div>

    <!-- Modals -->
    <CharacterEditModal
      :is-open="isEditModalOpen"
      @close="closeEditModal"
      @save="handleSaveCharacter"
    />
    <XPEditModal
      :is-open="isXPModalOpen"
      @close="closeXPModal"
    />
    <DiceHistoryModal
      :is-open="isHistoryModalOpen"
      @close="closeHistoryModal"
    />
  </div>
</template>

<script setup lang="ts">
const { character, updateCharacterName, updateCharacterImage } = useCharacter()

const isHistoryModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isXPModalOpen = ref(false)

const openHistoryModal = () => {
  isHistoryModalOpen.value = true
}

const closeHistoryModal = () => {
  isHistoryModalOpen.value = false
}

const openEditModal = () => {
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const openXPModal = () => {
  isXPModalOpen.value = true
}

const closeXPModal = () => {
  isXPModalOpen.value = false
}

const handleSaveCharacter = (name: string, image: string) => {
  updateCharacterName(name)
  updateCharacterImage(image)
}
</script>

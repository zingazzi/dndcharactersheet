<template>
  <div class="grid grid-cols-[1fr_auto] gap-4 p-3 border-b-2 border-[var(--color-border-primary)] mb-3 bg-[var(--color-bg-primary)] rounded relative">
    <!-- Left Section: Character Identity -->
    <div class="flex items-center gap-3">
      <div class="relative w-20 h-20 border-2 border-[var(--color-border-primary)] rounded overflow-hidden shrink-0 shadow-sm">
        <img v-if="character.image" :src="character.image" alt="Character" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 text-xs">Image</div>
      </div>
      <div class="flex flex-col gap-1 flex-1">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold font-cinzel-decorative text-[var(--color-text-primary)] tracking-wide m-0 flex-1">{{ character.name || 'Unnamed Character' }}</h1>
          <button
            @click="openEditModal"
            class="btn btn-primary text-sm px-2 py-1"
            title="Edit Character"
          >
            ✎
          </button>
        </div>
        <p class="text-base italic font-cinzel font-medium text-[var(--color-text-secondary)] tracking-wide">{{ character.classLevel || 'No Class' }}</p>
        <div
          class="clickable-text flex items-center gap-1 text-xs"
          @click="openXPModal"
          title="Click to manage XP"
        >
          <span class="font-semibold text-[var(--color-text-secondary)] uppercase">XP:</span>
          <span class="font-bold font-medieval text-[var(--color-text-primary)]">{{ character.experiencePoints.current.toLocaleString() }}</span>
          <span class="text-[var(--color-text-tertiary)] font-bold">/</span>
          <span class="font-semibold text-[var(--color-accent-primary-dark)]">{{ character.experiencePoints.nextLevel.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Right Section: Combat Stats -->
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 flex-nowrap">
        <!-- AC - Square with Shield Icon -->
        <div class="card p-2 min-w-[70px] text-center">
          <div class="text-[var(--color-accent-primary)] flex items-center justify-center w-5 h-5 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <label class="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] font-cinzel uppercase tracking-wide block mb-0.5">AC</label>
          <div class="text-xl font-bold font-medieval text-[var(--color-text-primary)]">{{ character.ac }}</div>
        </div>

        <!-- HP - Clickable -->
        <div
          class="clickable-card card p-2 min-w-[100px] text-center"
          @click="openHPModal"
          title="Click to manage HP"
        >
          <label class="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] font-cinzel uppercase tracking-wide block mb-1">
            Hit Points
            <span class="text-[0.6rem] text-[var(--color-success)] font-normal italic normal-case ml-0.5">(Click)</span>
          </label>
          <div class="flex items-center justify-center gap-1 p-1.5 bg-white border border-[var(--color-success)] rounded text-sm">
            <span class="font-bold font-medieval text-[var(--color-success-dark)]">{{ character.hitPoints.current }}</span>
            <span class="font-bold text-[var(--color-text-tertiary)]">/</span>
            <span class="font-bold font-medieval text-[var(--color-success-dark)]">{{ character.hitPoints.maximum }}</span>
            <span
              v-if="character.hitPoints.temporary && character.hitPoints.temporary > 0"
              class="text-xs font-bold font-medieval text-[var(--color-accent-primary-dark)] px-1 py-0.5 bg-[var(--color-accent-primary)]/25 border border-[var(--color-accent-primary-light)] rounded"
            >
              +{{ character.hitPoints.temporary }}
            </span>
          </div>
        </div>

        <!-- Initiative - Square with Icon, Clickable -->
        <div
          class="clickable-card card p-2 min-w-[70px] text-center"
          @click="rollInitiative"
          title="Click to roll initiative"
        >
          <div class="text-[var(--color-accent-primary)] flex items-center justify-center w-5 h-5 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
      </div>
          <label class="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] font-cinzel uppercase tracking-wide block mb-0.5">Initiative</label>
          <div class="text-xl font-bold font-medieval text-[var(--color-text-primary)]">{{ formatModifier(character.initiative) }}</div>
        </div>

        <!-- Proficiency Bonus - Square with Icon -->
        <div class="card p-2 min-w-[70px] text-center">
          <div class="text-[var(--color-accent-primary)] flex items-center justify-center w-5 h-5 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
      </div>
          <label class="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] font-cinzel uppercase tracking-wide block mb-0.5">Proficiency</label>
          <div class="text-xl font-bold font-medieval text-[var(--color-text-primary)]">{{ formatModifier(character.proficiencyBonus) }}</div>
      </div>
      </div>

      <!-- Utility Button -->
      <button
        @click="openHistoryModal"
        class="btn btn-primary text-sm px-2 py-1"
        title="Dice History"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
    <HPEditModal
      :is-open="isHPModalOpen"
      @close="closeHPModal"
    />
    <XPEditModal
      :is-open="isXPModalOpen"
      @close="closeXPModal"
    />
    <DiceHistoryModal
      :is-open="isHistoryModalOpen"
      @close="closeHistoryModal"
    />
    <Toast
      :is-visible="isToastVisible"
      :title="toast.title"
      :roll="toast.roll"
      :modifier="toast.modifier"
      :total="toast.total"
      @close="closeToast"
    />
  </div>
</template>

<script setup lang="ts">
const { character, updateCharacterName, updateCharacterImage, updateClassLevel } = useCharacter()
const { addRoll } = useDiceHistory()

const isHistoryModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isHPModalOpen = ref(false)
const isXPModalOpen = ref(false)
const isToastVisible = ref(false)

const toast = ref({
  title: '',
  roll: 0,
  modifier: 0,
  total: 0,
})

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

const openHPModal = () => {
  isHPModalOpen.value = true
}

const closeHPModal = () => {
  isHPModalOpen.value = false
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

const formatModifier = (value: number): string => {
  return value >= 0 ? `+${value}` : `${value}`
}

const rollD20 = (): number => {
  return Math.floor(Math.random() * 20) + 1
}

const rollInitiative = () => {
  const roll = rollD20()
  const modifier = character.value.initiative
  const total = roll + modifier
  const title = 'Initiative Roll'
  
  toast.value = {
    title,
    roll,
    modifier,
    total,
  }
  
  isToastVisible.value = true
  addRoll(title, roll, modifier)
  
  // Auto-hide toast after 3 seconds
  setTimeout(() => {
    isToastVisible.value = false
  }, 3000)
}

const closeToast = () => {
  isToastVisible.value = false
}
</script>

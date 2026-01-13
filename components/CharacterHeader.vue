<template>
  <div class="grid grid-cols-[1fr_auto] gap-8 p-6 border-b-[3px] border-double border-brown mb-6 bg-gradient-to-b from-white/30 to-parchment/10 rounded relative">
    <!-- Left Section: Character Identity -->
    <div class="flex items-center gap-5">
      <div class="relative w-[100px] h-[100px] border-[3px] border-brown rounded-md overflow-hidden shrink-0 shadow-[0_0_0_2px_#d4a574,0_2px_8px_rgba(0,0,0,0.3)]">
        <img v-if="character.image" :src="character.image" alt="Character" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 text-xs">Image</div>
      </div>
      <div class="flex flex-col gap-2 flex-1">
        <div class="flex items-center gap-2">
          <h1 class="text-3xl font-bold font-cinzel-decorative text-text-dark tracking-wide m-0 flex-1">{{ character.name || 'Unnamed Character' }}</h1>
          <button
            @click="openEditModal"
            class="bg-gradient-to-b from-brown to-brown-dark text-parchment border-2 border-brown-border rounded px-2.5 py-1.5 cursor-pointer text-base transition-all duration-200 shadow-dnd shrink-0 hover:from-brown-light hover:to-brown hover:-translate-y-0.5 hover:shadow-dnd-lg"
            title="Edit Character"
          >
            ✎
          </button>
        </div>
        <p class="text-xl italic font-cinzel font-medium text-text-brown tracking-wide mt-1 mb-0">{{ character.classLevel || 'No Class' }}</p>
        <div
          class="flex items-center gap-1.5 mt-2 px-2 py-1.5 bg-white/40 border-2 border-brown rounded font-cinzel transition-all duration-200 cursor-pointer hover:bg-white/60 hover:border-brown-dark hover:-translate-y-0.5 hover:shadow-md"
          @click="openXPModal"
          title="Click to manage XP"
        >
          <span class="text-[0.7rem] font-semibold text-text-brown uppercase tracking-wide">XP:</span>
          <span class="text-sm font-bold font-medieval text-text-dark">{{ character.experiencePoints.current.toLocaleString() }}</span>
          <span class="text-xs text-gray-600 font-bold">/</span>
          <span class="text-sm font-semibold text-brown-dark font-cinzel">{{ character.experiencePoints.nextLevel.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Right Section: Combat Stats -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-4 flex-nowrap">
        <!-- AC - Square with Shield Icon -->
        <div class="stat-square">
          <div class="text-brown flex items-center justify-center w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <label class="text-[0.7rem] font-semibold text-text-brown font-cinzel uppercase tracking-wide text-center">AC</label>
          <div class="text-2xl font-bold font-medieval text-text-dark text-shadow-dnd">{{ character.ac }}</div>
        </div>

        <!-- HP - Clickable -->
        <div
          class="hp-card stat-card clickable"
          @click="openHPModal"
          title="Click to manage HP"
        >
          <label class="text-xs font-semibold text-text-brown font-cinzel uppercase tracking-wide text-center">
            Hit Points
            <span class="text-[0.65rem] text-green-hp font-normal italic normal-case tracking-normal ml-1">(Click)</span>
          </label>
          <div class="flex items-center justify-center gap-2 p-3 bg-white/90 border-2 border-green-hp rounded shadow-dnd-inner">
            <span class="text-xl font-bold font-medieval text-green-hp-dark">{{ character.hitPoints.current }}</span>
            <span class="text-lg font-bold text-gray-600">/</span>
            <span class="text-xl font-bold font-medieval text-green-hp-dark">{{ character.hitPoints.maximum }}</span>
            <span
              v-if="character.hitPoints.temporary && character.hitPoints.temporary > 0"
              class="text-sm font-bold font-medieval text-brown-dark px-2 py-1 bg-brown/25 border border-brown-light rounded"
            >
              +{{ character.hitPoints.temporary }}
            </span>
          </div>
        </div>

        <!-- Initiative - Square with Icon, Clickable -->
        <div
          class="stat-square clickable"
          @click="rollInitiative"
          title="Click to roll initiative"
        >
          <div class="text-brown flex items-center justify-center w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <label class="text-[0.7rem] font-semibold text-text-brown font-cinzel uppercase tracking-wide text-center">Initiative</label>
          <div class="text-2xl font-bold font-medieval text-text-dark text-shadow-dnd">{{ formatModifier(character.initiative) }}</div>
        </div>

        <!-- Proficiency Bonus - Square with Icon -->
        <div class="stat-square">
          <div class="text-brown flex items-center justify-center w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <label class="text-[0.7rem] font-semibold text-text-brown font-cinzel uppercase tracking-wide text-center">Proficiency</label>
          <div class="text-2xl font-bold font-medieval text-text-dark text-shadow-dnd">{{ formatModifier(character.proficiencyBonus) }}</div>
        </div>
      </div>

      <!-- Utility Button -->
      <button
        @click="openHistoryModal"
        class="bg-gradient-to-b from-brown to-brown-dark text-parchment border-2 border-brown-border rounded-md p-3 cursor-pointer flex items-center justify-center transition-all duration-200 shadow-dnd shrink-0 hover:from-brown-light hover:to-brown hover:-translate-y-0.5 hover:shadow-dnd-lg"
        title="Dice History"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

<style scoped>
.stat-square {
  @apply flex flex-col items-center justify-center gap-2 w-[90px] h-[90px] p-3 bg-gradient-to-b from-white/60 to-parchment/40 border-[3px] border-brown rounded-md shadow-[0_0_0_1px_#d4a574,inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200;
}

.stat-square:hover {
  @apply -translate-y-0.5 shadow-[0_0_0_1px_#d4a574,inset_0_1px_0_rgba(255,255,255,0.4),0_4px_8px_rgba(0,0,0,0.15)];
}

.stat-square.clickable {
  @apply cursor-pointer;
}

.stat-square.clickable:hover {
  @apply bg-gradient-to-b from-white/80 to-parchment/60 border-brown-dark -translate-y-1 scale-105 shadow-[0_0_0_1px_#d4a574,inset_0_1px_0_rgba(255,255,255,0.4),0_6px_12px_rgba(0,0,0,0.2)];
}

.stat-card {
  @apply flex flex-col gap-2 p-3 min-w-[140px] bg-gradient-to-b from-white/60 to-parchment/40 border-2 border-brown rounded-md shadow-[0_0_0_1px_#d4a574,inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200;
}

.stat-card:hover {
  @apply -translate-y-0.5 shadow-[0_0_0_1px_#d4a574,inset_0_1px_0_rgba(255,255,255,0.4),0_4px_8px_rgba(0,0,0,0.15)];
}

.hp-card {
  @apply cursor-pointer bg-gradient-to-b from-green-hp/15 to-parchment/40 border-green-hp border-[3px] relative;
}

.hp-card::before {
  content: '';
  @apply absolute -top-0.5 -left-0.5 -right-0.5 -bottom-0.5 border-2 border-dashed border-green-hp/50 rounded-md pointer-events-none;
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.hp-card:hover {
  @apply bg-gradient-to-b from-green-hp/25 to-parchment/50 border-green-hp-dark -translate-y-1 scale-[1.02] shadow-[0_0_0_1px_#4caf50,inset_0_1px_0_rgba(255,255,255,0.4),0_6px_12px_rgba(46,125,50,0.3)];
}
</style>

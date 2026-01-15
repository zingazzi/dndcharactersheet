<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="m-0 text-base font-cinzel font-semibold text-[var(--color-text-secondary)]">Manage Experience Points</h2>
        <button
          @click="close"
          class="bg-transparent border-none text-xl text-[var(--color-accent-primary)] cursor-pointer w-6 h-6 flex items-center justify-center rounded transition-all duration-200 hover:bg-[var(--color-accent-primary)]/20 leading-none"
        >
          ×
        </button>
      </div>
      <div class="modal-body">
        <!-- XP Status Section -->
        <div class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Current Status</h3>
          <div class="grid grid-cols-3 gap-1.5">
            <div class="card-compact text-center">
              <label class="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] uppercase">Current XP</label>
              <div class="text-base font-bold font-medieval text-[var(--color-success-dark)] mt-0.5">{{ character.experiencePoints.current.toLocaleString() }}</div>
            </div>
            <div class="card-compact text-center">
              <label class="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] uppercase">Next Level</label>
              <div class="text-base font-bold font-medieval text-[var(--color-text-primary)] mt-0.5">{{ character.experiencePoints.nextLevel.toLocaleString() }}</div>
            </div>
            <div class="card-compact text-center bg-[var(--color-accent-primary)]/10 border-2 border-[var(--color-accent-primary)]">
              <label class="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] uppercase">Remaining</label>
              <div class="text-base font-bold font-medieval text-[var(--color-accent-primary-dark)] mt-0.5">{{ xpRemaining.toLocaleString() }}</div>
            </div>
          </div>
        </div>

        <!-- XP Actions Section -->
        <div>
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Manage Experience Points</h3>
          <div class="grid grid-cols-2 gap-1.5">
            <div class="card-compact">
              <div class="mb-1">
                <h4 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-0.5">Add XP</h4>
                <span class="text-[0.65rem] text-[var(--color-text-tertiary)] italic">Gain experience</span>
              </div>
              <div class="flex gap-1">
                <input
                  v-model.number="addAmount"
                  type="number"
                  min="1"
                  class="input text-sm py-1 px-1.5 flex-1"
                  placeholder="Amount"
                />
                <button @click="handleAddXP" class="btn btn-success text-xs px-2 py-1">+</button>
              </div>
            </div>

            <div class="card-compact">
              <div class="mb-1">
                <h4 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-0.5">Remove XP</h4>
                <span class="text-[0.65rem] text-[var(--color-text-tertiary)] italic">Lose experience</span>
              </div>
              <div class="flex gap-1">
                <input
                  v-model.number="removeAmount"
                  type="number"
                  min="1"
                  class="input text-sm py-1 px-1.5 flex-1"
                  placeholder="Amount"
                />
                <button @click="handleRemoveXP" class="btn btn-danger text-xs px-2 py-1">-</button>
              </div>
            </div>

            <div class="card-compact">
              <div class="mb-1">
                <h4 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-0.5">Set Current XP</h4>
                <span class="text-[0.65rem] text-[var(--color-text-tertiary)] italic">Set exact value</span>
              </div>
              <div class="flex gap-1">
                <input
                  v-model.number="currentXP"
                  type="number"
                  min="0"
                  class="input text-sm py-1 px-1.5 flex-1"
                  placeholder="Current XP"
                />
                <button @click="handleSetCurrentXP" class="btn btn-primary text-xs px-2 py-1">Set</button>
              </div>
            </div>

            <div class="card-compact opacity-75">
              <div class="mb-1">
                <h4 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-0.5">Next Level XP</h4>
                <span class="text-[0.65rem] text-[var(--color-text-tertiary)] italic">Automatically calculated</span>
              </div>
              <div class="text-sm font-bold font-medieval text-[var(--color-text-primary)]">
                {{ character.experiencePoints.nextLevel.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="btn btn-primary text-sm">Close</button>
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
}>()

const { character, addXP, removeXP, setCurrentXP } = useCharacter()

const addAmount = ref(100)
const removeAmount = ref(100)
const currentXP = ref(character.value.experiencePoints.current)
const nextLevelXP = ref(character.value.experiencePoints.nextLevel)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    currentXP.value = character.value.experiencePoints.current
    nextLevelXP.value = character.value.experiencePoints.nextLevel
  }
})

const xpRemaining = computed(() => {
  const remaining = character.value.experiencePoints.nextLevel - character.value.experiencePoints.current
  return Math.max(0, remaining)
})

const handleAddXP = () => {
  if (addAmount.value && addAmount.value > 0) {
    addXP(addAmount.value)
    addAmount.value = 100
  }
}

const handleRemoveXP = () => {
  if (removeAmount.value && removeAmount.value > 0) {
    removeXP(removeAmount.value)
    removeAmount.value = 100
  }
}

const handleSetCurrentXP = () => {
  if (currentXP.value !== null && currentXP.value >= 0) {
    setCurrentXP(currentXP.value)
  }
}

// nextLevel XP is derived from the XP table and can’t be manually edited

const close = () => {
  emit('close')
}
</script>

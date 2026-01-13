<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="m-0 text-base font-cinzel font-semibold text-[var(--color-text-secondary)]">Manage Hit Points</h2>
        <button
          @click="close"
          class="bg-transparent border-none text-xl text-[var(--color-accent-primary)] cursor-pointer w-6 h-6 flex items-center justify-center rounded transition-all duration-200 hover:bg-[var(--color-accent-primary)]/20 leading-none"
        >
          ×
        </button>
      </div>
      <div class="modal-body">
        <!-- HP Status Section -->
        <div class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Current Status</h3>
          <div class="grid grid-cols-2 gap-1.5">
            <div class="card-compact text-center">
              <label class="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] uppercase">Current HP</label>
              <div class="text-lg font-bold font-medieval text-[var(--color-success-dark)] mt-0.5">{{ character.hitPoints.current }}</div>
            </div>
            <div class="card-compact text-center">
              <label class="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] uppercase">Maximum HP</label>
              <div class="text-lg font-bold font-medieval text-[var(--color-text-primary)] mt-0.5">{{ character.hitPoints.maximum }}</div>
            </div>
            <div v-if="character.hitPoints.temporary && character.hitPoints.temporary > 0" class="card-compact text-center">
              <label class="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] uppercase">Temporary HP</label>
              <div class="text-lg font-bold font-medieval text-[var(--color-accent-primary-dark)] mt-0.5">{{ character.hitPoints.temporary }}</div>
            </div>
            <div class="card-compact text-center bg-[var(--color-accent-primary)]/10 border-2 border-[var(--color-accent-primary)]">
              <label class="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] uppercase">Total HP</label>
              <div class="text-xl font-bold font-medieval text-[var(--color-accent-primary-dark)] mt-0.5">{{ totalHP }}</div>
            </div>
          </div>
        </div>

        <!-- HP Actions Section -->
        <div>
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Manage Hit Points</h3>
          <div class="grid grid-cols-2 gap-1.5">
            <div class="card-compact">
              <div class="mb-1">
                <h4 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-0.5">Add HP</h4>
                <span class="text-[0.65rem] text-[var(--color-text-tertiary)] italic">Restore hit points</span>
              </div>
              <div class="flex gap-1">
                <input
                  v-model.number="addAmount"
                  type="number"
                  min="1"
                  class="input text-sm py-1 px-1.5 flex-1"
                  placeholder="Amount"
                />
                <button @click="handleAddHP" class="btn btn-success text-xs px-2 py-1">+</button>
              </div>
            </div>

            <div class="card-compact">
              <div class="mb-1">
                <h4 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-0.5">Remove HP</h4>
                <span class="text-[0.65rem] text-[var(--color-text-tertiary)] italic">Take damage</span>
              </div>
              <div class="flex gap-1">
                <input
                  v-model.number="removeAmount"
                  type="number"
                  min="1"
                  class="input text-sm py-1 px-1.5 flex-1"
                  placeholder="Amount"
                />
                <button @click="handleRemoveHP" class="btn btn-danger text-xs px-2 py-1">-</button>
              </div>
            </div>

            <div class="card-compact">
              <div class="mb-1">
                <h4 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-0.5">Temporary HP</h4>
                <span class="text-[0.65rem] text-[var(--color-text-tertiary)] italic">Add temporary</span>
              </div>
              <div class="flex gap-1">
                <input
                  v-model.number="tempAmount"
                  type="number"
                  min="1"
                  class="input text-sm py-1 px-1.5 flex-1"
                  placeholder="Amount"
                />
                <button @click="handleAddTempHP" class="btn btn-primary text-xs px-2 py-1">+</button>
              </div>
            </div>

            <div class="card-compact">
              <div class="mb-1">
                <h4 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-0.5">Set Maximum</h4>
                <span class="text-[0.65rem] text-[var(--color-text-tertiary)] italic">Change max HP</span>
              </div>
              <div class="flex gap-1">
                <input
                  v-model.number="maxHP"
                  type="number"
                  min="1"
                  class="input text-sm py-1 px-1.5 flex-1"
                  placeholder="Maximum"
                />
                <button @click="handleSetMaxHP" class="btn btn-primary text-xs px-2 py-1">Set</button>
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

const { character, addHP, removeHP, addTemporaryHP, setMaximumHP } = useCharacter()

const addAmount = ref(1)
const removeAmount = ref(1)
const tempAmount = ref(1)
const maxHP = ref(character.value.hitPoints.maximum)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    maxHP.value = character.value.hitPoints.maximum
  }
})

const totalHP = computed(() => {
  const current = character.value.hitPoints.current
  const temp = character.value.hitPoints.temporary || 0
  return current + temp
})

const handleAddHP = () => {
  if (addAmount.value && addAmount.value > 0) {
    addHP(addAmount.value)
    addAmount.value = 1
  }
}

const handleRemoveHP = () => {
  if (removeAmount.value && removeAmount.value > 0) {
    removeHP(removeAmount.value)
    removeAmount.value = 1
  }
}

const handleAddTempHP = () => {
  if (tempAmount.value && tempAmount.value > 0) {
    addTemporaryHP(tempAmount.value)
    tempAmount.value = 1
  }
}

const handleSetMaxHP = () => {
  if (maxHP.value && maxHP.value > 0) {
    setMaximumHP(maxHP.value)
  }
}

const close = () => {
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="m-0 text-base font-cinzel font-semibold text-[var(--color-text-secondary)]">Dice History</h2>
        <div class="flex gap-1 items-center">
          <button
            v-if="recentRolls.length > 0"
            @click="clearHistory"
            class="btn btn-danger text-sm px-2 py-1"
          >
            Clear
          </button>
          <button
            @click="close"
            class="bg-transparent border-none text-xl text-[var(--color-accent-primary)] cursor-pointer w-6 h-6 flex items-center justify-center rounded transition-all duration-200 hover:bg-[var(--color-accent-primary)]/20 leading-none"
          >
            ×
          </button>
        </div>
      </div>
      
      <div class="modal-body">
        <div v-if="recentRolls.length === 0" class="text-center py-8 text-[var(--color-text-muted)] italic text-sm">
          No dice rolls yet. Roll some dice to see them here!
        </div>
        <div v-else class="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto">
          <div
            v-for="roll in recentRolls"
            :key="roll.id"
            class="card-compact p-1.5"
          >
            <div class="flex justify-between items-center mb-1">
              <span class="font-semibold text-[var(--color-text-primary)] text-sm">{{ roll.title }}</span>
              <span class="text-xs text-[var(--color-text-muted)]">{{ formatTime(roll.timestamp) }}</span>
            </div>
            <div class="flex items-center gap-1 text-sm">
              <span class="px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded">{{ roll.roll }}</span>
              <span class="font-semibold text-[var(--color-text-tertiary)]">+</span>
              <span class="px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded">{{ formatModifier(roll.modifier) }}</span>
              <span class="font-semibold text-[var(--color-text-tertiary)]">=</span>
              <span class="px-2 py-1 bg-[var(--color-info)] text-white rounded font-bold text-sm min-w-[40px] text-center">
                {{ roll.total }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { getRecentRolls, clearHistory: clearHistoryStore } = useDiceHistory()

const recentRolls = computed(() => getRecentRolls())

const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

const formatTime = (timestamp: Date): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)

  if (diffSecs < 60) {
    return `${diffSecs}s ago`
  } else if (diffMins < 60) {
    return `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

const close = () => {
  emit('close')
}

const clearHistory = () => {
  if (confirm('Are you sure you want to clear all dice history?')) {
    clearHistoryStore()
  }
}
</script>

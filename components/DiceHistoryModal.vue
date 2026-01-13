<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="m-0 text-2xl font-cinzel font-semibold text-text-brown tracking-wide">Dice History</h2>
        <div class="flex gap-2 items-center">
          <button
            v-if="recentRolls.length > 0"
            @click="clearHistory"
            class="btn-dnd-danger text-sm"
          >
            Clear
          </button>
          <button
            @click="close"
            class="btn-dnd-primary w-8 h-8 p-0 text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>
      
      <div class="modal-body">
        <div v-if="recentRolls.length === 0" class="text-center py-12 px-4 text-gray-500 italic">
          No dice rolls yet. Roll some dice to see them here!
        </div>
        <div v-else class="flex flex-col gap-4">
          <div
            v-for="roll in recentRolls"
            :key="roll.id"
            class="p-4 border border-gray-300 rounded bg-gray-50"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold text-gray-800 text-sm">{{ roll.title }}</span>
              <span class="text-xs text-gray-500">{{ formatTime(roll.timestamp) }}</span>
            </div>
            <div class="flex items-center gap-2 text-base">
              <span class="px-2 py-1 bg-gray-100 rounded">{{ roll.roll }}</span>
              <span class="font-semibold text-gray-600">+</span>
              <span class="px-2 py-1 bg-gray-100 rounded">{{ formatModifier(roll.modifier) }}</span>
              <span class="font-semibold text-gray-600">=</span>
              <span class="px-3 py-2 bg-blue-500 text-white rounded font-bold text-lg min-w-[50px] text-center">
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

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Dice History</h2>
        <div class="header-actions">
          <button @click="clearHistory" class="btn-clear" v-if="recentRolls.length > 0">Clear</button>
          <button @click="close" class="close-btn">×</button>
        </div>
      </div>
      
      <div class="modal-body">
        <div v-if="recentRolls.length === 0" class="empty-state">
          No dice rolls yet. Roll some dice to see them here!
        </div>
        <div v-else class="history-list">
          <div
            v-for="roll in recentRolls"
            :key="roll.id"
            class="history-item"
          >
            <div class="history-header">
              <span class="roll-title">{{ roll.title }}</span>
              <span class="roll-time">{{ formatTime(roll.timestamp) }}</span>
            </div>
            <div class="roll-breakdown">
              <span class="roll-part">{{ roll.roll }}</span>
              <span class="roll-separator">+</span>
              <span class="roll-part">{{ formatModifier(roll.modifier) }}</span>
              <span class="roll-separator">=</span>
              <span class="roll-result">{{ roll.total }}</span>
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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #ddd;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #000;
}

.btn-clear {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-clear:hover {
  background: #c0392b;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
  font-style: italic;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #fafafa;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.roll-title {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.roll-time {
  font-size: 0.8rem;
  color: #999;
}

.roll-breakdown {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.roll-part {
  padding: 0.25rem 0.5rem;
  background: #f0f0f0;
  border-radius: 4px;
}

.roll-separator {
  font-weight: 600;
  color: #666;
}

.roll-result {
  padding: 0.5rem 0.75rem;
  background: #4a90e2;
  color: white;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.1rem;
  min-width: 50px;
  text-align: center;
}
</style>

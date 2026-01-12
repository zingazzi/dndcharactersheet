<template>
  <Transition name="toast">
    <div v-if="isVisible" class="toast" :class="type">
      <div class="toast-content">
        <div class="toast-header">
          <span class="toast-title">{{ title }}</span>
          <button @click="close" class="toast-close">×</button>
        </div>
        <div class="toast-body">
          <div class="roll-breakdown">
            <span class="roll-part">{{ roll }}</span>
            <span class="roll-separator">+</span>
            <span class="roll-part">{{ formatModifier(modifier) }}</span>
            <span class="roll-separator">=</span>
            <span class="roll-result">{{ total }}</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean
  title: string
  roll: number
  modifier: number
  total: number
  type?: 'success' | 'info' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
})

const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}

const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

// Auto-close after 5 seconds
watch(() => props.isVisible, (visible) => {
  if (visible) {
    setTimeout(() => {
      close()
    }, 5000)
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 400px;
  z-index: 10000;
  border-left: 4px solid #4a90e2;
}

.toast.success {
  border-left-color: #27ae60;
}

.toast.info {
  border-left-color: #4a90e2;
}

.toast.warning {
  border-left-color: #f39c12;
}

.toast.error {
  border-left-color: #e74c3c;
}

.toast-content {
  padding: 1rem;
}

.toast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.toast-title {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: #000;
}

.toast-body {
  font-size: 0.9rem;
}

.roll-breakdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
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
  padding: 0.5rem 1rem;
  background: #4a90e2;
  color: white;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.3rem;
  min-width: 60px;
  text-align: center;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>

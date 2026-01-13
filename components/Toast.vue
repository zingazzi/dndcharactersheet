<template>
  <Transition name="toast">
    <div
      v-if="isVisible"
      class="fixed top-5 right-5 min-w-[300px] max-w-[400px] z-[10000] rounded-lg shadow-dnd-lg border-l-4"
      style="background: var(--gradient-parchment); border: 1px solid var(--color-border-primary);"
      :class="{
        'border-l-[var(--color-success)]': type === 'success',
        'border-l-[var(--color-info)]': type === 'info',
        'border-l-[var(--color-warning)]': type === 'warning',
        'border-l-[var(--color-danger)]': type === 'error',
        'border-l-[var(--color-border-primary)]': !type || type === 'info'
      }"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-3">
          <span class="font-semibold text-lg text-[var(--color-text-primary)]">{{ title }}</span>
          <button
            @click="close"
            class="bg-gradient-to-b from-brown to-brown-dark border-2 border-brown-border text-parchment text-2xl leading-none p-0 w-7 h-7 flex items-center justify-center rounded shadow-dnd transition-all duration-200 hover:from-brown-light hover:to-brown hover:-translate-y-0.5 hover:shadow-dnd-lg"
          >
            ×
          </button>
        </div>
        <div class="text-base">
          <div class="flex items-center justify-center gap-3 text-xl">
            <span class="px-3 py-1.5 bg-[var(--color-bg-secondary)] rounded text-lg font-bold">{{ roll }}</span>
            <span class="font-semibold text-[var(--color-text-secondary)] text-lg">+</span>
            <span class="px-3 py-1.5 bg-[var(--color-bg-secondary)] rounded text-lg font-bold">{{ formatModifier(modifier) }}</span>
            <span class="font-semibold text-[var(--color-text-secondary)] text-lg">=</span>
            <span class="px-5 py-3 bg-gradient-to-b from-brown to-brown-dark text-parchment border-2 border-brown-border rounded font-bold text-2xl min-w-[70px] text-center shadow-dnd">
              {{ total }}
            </span>
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

<template>
  <Transition name="toast">
    <div
      v-if="isVisible"
      class="fixed top-5 right-5 min-w-[300px] max-w-[400px] z-[10000] bg-gradient-parchment border-dnd border-brown rounded-lg shadow-dnd-lg border-l-4"
      :class="{
        'border-l-green-600': type === 'success',
        'border-l-blue-500': type === 'info',
        'border-l-yellow-500': type === 'warning',
        'border-l-red-500': type === 'error',
        'border-l-brown': !type || type === 'info'
      }"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-3">
          <span class="font-semibold text-base text-gray-800">{{ title }}</span>
          <button
            @click="close"
            class="bg-gradient-to-b from-brown to-brown-dark border-2 border-brown-border text-parchment text-xl leading-none p-0 w-6 h-6 flex items-center justify-center rounded shadow-dnd transition-all duration-200 hover:from-brown-light hover:to-brown hover:-translate-y-0.5 hover:shadow-dnd-lg"
          >
            ×
          </button>
        </div>
        <div class="text-sm">
          <div class="flex items-center justify-center gap-2 text-lg">
            <span class="px-2 py-1 bg-gray-100 rounded">{{ roll }}</span>
            <span class="font-semibold text-gray-600">+</span>
            <span class="px-2 py-1 bg-gray-100 rounded">{{ formatModifier(modifier) }}</span>
            <span class="font-semibold text-gray-600">=</span>
            <span class="px-4 py-2 bg-gradient-to-b from-brown to-brown-dark text-parchment border-2 border-brown-border rounded font-bold text-xl min-w-[60px] text-center shadow-dnd">
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

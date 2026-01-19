<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="modal-overlay"
      @click.self="handleCancel"
    >
      <div class="modal-content max-w-md">
        <div class="modal-header">
          <h2 class="modal-title">Choose Feat Options</h2>
          <button @click="handleCancel" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="mb-4">
            <h3 class="text-base font-semibold mb-2">{{ featName }}</h3>
            <p class="text-sm text-[var(--color-text-secondary)] mb-4">{{ featDescription }}</p>
          </div>

          <div
            v-for="(choice, choiceKey) in featChoices"
            :key="choiceKey"
            class="mb-4"
          >
            <label class="block text-sm font-semibold mb-2">
              {{ choice.description || `Choose ${choiceKey}:` }}
            </label>
            <div v-if="choice.type === 'ability'" class="flex flex-col gap-2">
              <button
                v-for="option in choice.options"
                :key="option"
                @click="selectChoice(choiceKey, option)"
                :class="[
                  'btn text-sm',
                  selectedChoices[choiceKey] === option ? 'btn-primary' : 'btn-secondary'
                ]"
              >
                {{ formatAbilityName(option) }}
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="handleCancel" class="btn btn-secondary text-sm">Cancel</button>
          <button
            @click="handleConfirm"
            class="btn btn-primary text-sm"
            :disabled="!canConfirm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import featsJson from '~/data/feats.json'

interface Props {
  isOpen: boolean
  featId: string | null
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm', choices: Record<string, any>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedChoices = ref<Record<string, any>>({})

const featData = computed(() => {
  if (!props.featId) return null
  const featsData = featsJson as { feats: any[] }
  return featsData.feats.find(f => f.id === props.featId) || null
})

const featName = computed(() => featData.value?.name || '')
const featDescription = computed(() => featData.value?.description || '')
const featChoices = computed(() => featData.value?.choices || {})

const canConfirm = computed(() => {
  // Check if all required choices have been made
  const choices = featChoices.value
  if (!choices || Object.keys(choices).length === 0) return true

  return Object.keys(choices).every(key => selectedChoices.value[key] !== undefined)
})

const formatAbilityName = (ability: string): string => {
  const names: Record<string, string> = {
    strength: 'Strength',
    dexterity: 'Dexterity',
    constitution: 'Constitution',
    intelligence: 'Intelligence',
    wisdom: 'Wisdom',
    charisma: 'Charisma',
  }
  return names[ability] || ability.charAt(0).toUpperCase() + ability.slice(1)
}

const selectChoice = (choiceKey: string, value: any) => {
  selectedChoices.value[choiceKey] = value
}

const handleConfirm = () => {
  if (canConfirm.value) {
    emit('confirm', { ...selectedChoices.value })
    selectedChoices.value = {}
  }
}

const handleCancel = () => {
  selectedChoices.value = {}
  emit('close')
}

// Reset choices when modal opens/closes or feat changes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    selectedChoices.value = {}
  }
})

watch(() => props.featId, () => {
  selectedChoices.value = {}
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-divider);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border-divider);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.modal-close:hover {
  background: var(--color-bg-secondary);
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--color-border-divider);
}
</style>

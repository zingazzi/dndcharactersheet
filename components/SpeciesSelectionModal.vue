<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <div class="modal-header">
        <h2 class="modal-title">Select Species</h2>
        <button @click="close" class="btn btn-ghost text-xl px-2 py-1">×</button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <div class="flex flex-col gap-3">
          <div
            v-for="species in speciesList"
            :key="species.id"
            class="card cursor-pointer"
            :class="{ 'ring-2 ring-[var(--color-accent-primary)]': selectedSpeciesId === species.id }"
            @click="selectSpecies(species.id)"
          >
            <div class="flex items-start gap-3">
              <input
                type="radio"
                :checked="selectedSpeciesId === species.id"
                @change="selectSpecies(species.id)"
                @click.stop
                class="mt-1"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-bold">{{ species.name }}</h3>
                  <span class="text-xs text-[var(--color-text-tertiary)] px-2 py-1 bg-[var(--color-bg-secondary)] rounded">Species</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">{{ species.description }}</p>
                <div class="space-y-2 text-sm">
                  <div>
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Size: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ species.size }}</span>
                  </div>
                  <div>
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Speed: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ species.speed }} ft.</span>
                  </div>
                  <div v-if="species.darkvision > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Darkvision: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ species.darkvision }} ft.</span>
                  </div>
                  <div v-if="species.skillProficiencies && species.skillProficiencies.length > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Skill Proficiencies: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ species.skillProficiencies.join(', ') }}</span>
                  </div>
                  <div v-if="species.languages && species.languages.length > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Languages: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ species.languages.join(', ') }}</span>
                  </div>
                  <div v-if="species.features && species.features.length > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Features: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ species.features.map((f: any) => f.name).join(', ') }}</span>
                  </div>
                  <div v-if="species.choices && Object.keys(species.choices).length > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Requires Choice: </span>
                    <span class="text-[var(--color-text-secondary)]">Yes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="btn btn-secondary">Cancel</button>
        <button @click="confirmSelection" class="btn btn-primary" :disabled="!selectedSpeciesId">Confirm Selection</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import speciesJson from '~/data/species.json'

const props = defineProps<{
  isOpen: boolean
  selectedSpecies: string | undefined
}>()

const emit = defineEmits<{
  close: []
  select: [speciesId: string | null]
}>()

const speciesList = computed(() => {
  const data = speciesJson as { species: any[] }
  return data.species || []
})

const selectedSpeciesId = ref<string | null>(null)

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedSpeciesId.value = props.selectedSpecies || null
  }
})

const selectSpecies = (speciesId: string) => {
  if (selectedSpeciesId.value === speciesId) {
    selectedSpeciesId.value = null
  } else {
    selectedSpeciesId.value = speciesId
  }
}

const confirmSelection = () => {
  emit('select', selectedSpeciesId.value)
}

const close = () => {
  emit('close')
}
</script>

<template>
  <div class="section">
    <div class="section-header">
      <h3 class="section-title">Species</h3>
      <button
        v-if="character.species"
        @click="openSelectionModal"
        class="btn btn-primary text-xs"
      >
        Change Species
      </button>
      <button
        v-else
        @click="openSelectionModal"
        class="btn btn-primary text-xs"
      >
        + Add Species
      </button>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-if="character.species"
        class="card"
      >
        <div class="flex justify-between items-center mb-1.5">
          <div class="flex items-center gap-2">
            <span class="text-base font-bold">{{ getSpeciesName(character.species) }}</span>
            <span class="text-xs text-[var(--color-text-tertiary)] px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded">Species</span>
          </div>
          <button
            @click="removeSpecies"
            class="btn btn-danger text-xs px-2 py-1"
          >
            ×
          </button>
        </div>
        <div class="pt-1.5 border-t border-[var(--color-border-divider)]">
          <p class="text-sm text-[var(--color-text-secondary)] mb-2">{{ getSpeciesDescription(character.species) }}</p>
          <div class="text-xs text-[var(--color-text-tertiary)] space-y-1">
            <div v-if="getSpeciesSize(character.species)">
              <span class="font-semibold">Size: </span>{{ getSpeciesSize(character.species) }}
            </div>
            <div v-if="getSpeciesSpeed(character.species)">
              <span class="font-semibold">Speed: </span>{{ getSpeciesSpeed(character.species) }} ft.
            </div>
            <div v-if="getSpeciesDarkvision(character.species)">
              <span class="font-semibold">Darkvision: </span>{{ getSpeciesDarkvision(character.species) }} ft.
            </div>
            <div v-if="getSpeciesLineage(character.species)">
              <span class="font-semibold">Lineage: </span>{{ getSpeciesLineage(character.species) }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-6 text-[var(--color-text-muted)] italic text-sm">
        No species selected. Click "+ Add Species" to get started.
      </div>
    </div>
    <SpeciesSelectionModal
      v-if="showModal"
      :is-open="showModal"
      :selected-species="character.species"
      @close="showModal = false"
      @select="handleSpeciesSelect"
    />
    <SpeciesChoiceModal
      v-if="showChoiceModal"
      :is-open="showChoiceModal"
      :species-id="pendingSpeciesId"
      @close="showChoiceModal = false"
      @confirm="handleSpeciesChoiceConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Character } from '~/types/character'
import speciesJson from '~/data/species.json'

const { character, setSpecies, removeSpecies, speciesRequiresChoices } = useCharacter()

const showModal = ref(false)
const showChoiceModal = ref(false)
const pendingSpeciesId = ref<string | null>(null)

const openSelectionModal = () => {
  showModal.value = true
}

const handleSpeciesSelect = async (speciesId: string | null) => {
  if (!speciesId) {
    showModal.value = false
    return
  }

  // Check if species requires choices
  if (speciesRequiresChoices(speciesId)) {
    pendingSpeciesId.value = speciesId
    showModal.value = false
    await nextTick()
    showChoiceModal.value = true
  } else {
    // No choices needed, set species directly
    setSpecies(speciesId)
    showModal.value = false
  }
}

const handleSpeciesChoiceConfirm = (choices: Record<string, any>) => {
  if (pendingSpeciesId.value) {
    setSpecies(pendingSpeciesId.value, choices)
    pendingSpeciesId.value = null
  }
  showChoiceModal.value = false
}

const removeSpeciesHandler = () => {
  removeSpecies()
}

const getSpeciesName = (speciesId: string): string => {
  const speciesData = speciesJson as { species: any[] }
  const species = speciesData.species.find(s => s.id === speciesId)
  return species?.name || speciesId
}

const getSpeciesDescription = (speciesId: string): string => {
  const speciesData = speciesJson as { species: any[] }
  const species = speciesData.species.find(s => s.id === speciesId)
  return species?.description || ''
}

const getSpeciesSize = (speciesId: string): string => {
  const speciesData = speciesJson as { species: any[] }
  const species = speciesData.species.find(s => s.id === speciesId)
  return species?.size || ''
}

const getSpeciesSpeed = (speciesId: string): number => {
  const speciesData = speciesJson as { species: any[] }
  const species = speciesData.species.find(s => s.id === speciesId)
  return species?.speed || 0
}

const getSpeciesDarkvision = (speciesId: string): number => {
  const speciesData = speciesJson as { species: any[] }
  const species = speciesData.species.find(s => s.id === speciesId)
  return species?.darkvision || 0
}

const getSpeciesLineage = (speciesId: string): string => {
  if (!character.value.speciesChoices) return ''
  const speciesData = speciesJson as { species: any[] }
  const species = speciesData.species.find(s => s.id === speciesId)
  if (!species || !species.lineages) return ''

  const lineageId = character.value.speciesChoices.lineage || character.value.speciesChoices.legacy
  if (!lineageId) return ''

  const lineage = species.lineages[lineageId]
  return lineage?.name || ''
}
</script>

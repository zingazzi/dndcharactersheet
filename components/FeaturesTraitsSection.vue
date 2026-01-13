<template>
  <div class="section">
    <div class="section-header">
      <h3 class="section-title">Features & Traits</h3>
      <button
        @click="showAddForm = !showAddForm"
        class="btn btn-primary text-xs"
      >
        {{ showAddForm ? 'Cancel' : '+ Add Feature/Trait' }}
      </button>
    </div>
    <div v-if="showAddForm" class="p-3 bg-[var(--color-bg-secondary)] rounded mb-3">
      <div class="flex gap-1.5 mb-1.5">
        <input
          v-model="newFeature.name"
          type="text"
          placeholder="Feature/Trait Name"
          class="input flex-1"
        />
        <select
          v-model="newFeature.source"
          class="input-select"
        >
          <option value="">No Source</option>
          <option value="Class">Class</option>
          <option value="Race">Race</option>
          <option value="Feat">Feat</option>
          <option value="Background">Background</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <textarea
        v-model="newFeature.description"
        placeholder="Description"
        rows="3"
        class="input-textarea w-full mb-1.5"
      />
      <button @click="handleAddFeature" class="btn btn-primary text-xs">Save</button>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="feature in character.featuresTraits"
        :key="feature.id"
        class="card"
      >
        <div class="flex justify-between items-center mb-1.5">
          <div class="flex items-center gap-2">
            <span class="text-base font-bold">{{ feature.name }}</span>
            <span v-if="feature.source" class="text-xs text-[var(--color-text-tertiary)] px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded">{{ feature.source }}</span>
          </div>
          <button
            @click="removeFeatureTrait(feature.id)"
            class="btn btn-danger text-xs px-2 py-1"
          >
            ×
          </button>
        </div>
        <div class="pt-1.5 border-t border-[var(--color-border-divider)]">
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[60px]">Name:</label>
            <input
              v-model="feature.name"
              type="text"
              class="input flex-1 text-xs py-1 px-1.5"
            />
            <label class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[50px]">Source:</label>
            <select
              v-model="feature.source"
              class="input-select text-xs"
            >
              <option value="">No Source</option>
              <option value="Class">Class</option>
              <option value="Race">Race</option>
              <option value="Feat">Feat</option>
              <option value="Background">Background</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="flex items-center gap-1.5">
            <label class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[60px]">Description:</label>
            <textarea
              v-model="feature.description"
              rows="2"
              class="input-textarea flex-1 text-xs"
            />
          </div>
        </div>
      </div>
      <div v-if="character.featuresTraits.length === 0" class="text-center py-6 text-[var(--color-text-muted)] italic text-sm">
        No features or traits added yet. Click "+ Add Feature/Trait" to get started.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeatureTrait } from '~/types/character'

const { character, addFeatureTrait, removeFeatureTrait } = useCharacter()

const showAddForm = ref(false)
const newFeature = ref<Omit<FeatureTrait, 'id'>>({
  name: '',
  description: '',
  source: '',
})

const handleAddFeature = () => {
  if (newFeature.value.name.trim()) {
    addFeatureTrait(newFeature.value)
    newFeature.value = {
      name: '',
      description: '',
      source: '',
    }
    showAddForm.value = false
  }
}
</script>

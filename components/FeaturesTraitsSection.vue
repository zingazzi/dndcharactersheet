<template>
  <div class="p-6 border-2 border-brown rounded-md mb-6 bg-white/40 shadow-[0_0_0_1px_#d4a574,0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]">
    <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
      <h3 class="m-0 text-xl font-cinzel font-semibold text-text-brown text-shadow-dnd tracking-wide uppercase">Features & Traits</h3>
      <button
        @click="showAddForm = !showAddForm"
        class="btn-dnd-primary"
      >
        {{ showAddForm ? 'Cancel' : '+ Add Feature/Trait' }}
      </button>
    </div>
    <div v-if="showAddForm" class="p-4 bg-gray-50 rounded-md mb-4">
      <div class="flex gap-2 mb-2">
        <input
          v-model="newFeature.name"
          type="text"
          placeholder="Feature/Trait Name"
          class="input-dnd flex-1"
        />
        <select
          v-model="newFeature.source"
          class="input-dnd-select"
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
        rows="4"
        class="input-dnd-textarea w-full mb-2"
      />
      <button @click="handleAddFeature" class="btn-dnd-primary">Save</button>
    </div>
    <div class="flex flex-col gap-4">
      <div
        v-for="feature in character.featuresTraits"
        :key="feature.id"
        class="p-4 border border-gray-300 rounded bg-gray-50"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold">{{ feature.name }}</span>
            <span v-if="feature.source" class="text-xs text-gray-600 px-2 py-1 bg-gray-200 rounded">{{ feature.source }}</span>
          </div>
          <button
            @click="removeFeatureTrait(feature.id)"
            class="bg-red-600 text-white border-none rounded-full w-6 h-6 cursor-pointer text-xl leading-none flex items-center justify-center hover:bg-red-700"
          >
            ×
          </button>
        </div>
        <div class="mt-2 pt-2 border-t border-gray-300">
          <div class="flex items-center gap-2 mb-2">
            <label class="text-xs font-semibold text-gray-700 min-w-[80px]">Name:</label>
            <input
              v-model="feature.name"
              type="text"
              class="input-dnd flex-1 text-sm py-1 px-2"
            />
            <label class="text-xs font-semibold text-gray-700 min-w-[60px]">Source:</label>
            <select
              v-model="feature.source"
              class="input-dnd-select text-sm"
            >
              <option value="">No Source</option>
              <option value="Class">Class</option>
              <option value="Race">Race</option>
              <option value="Feat">Feat</option>
              <option value="Background">Background</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-xs font-semibold text-gray-700 min-w-[80px]">Description:</label>
            <textarea
              v-model="feature.description"
              rows="3"
              class="input-dnd-textarea flex-1 text-sm"
            />
          </div>
        </div>
      </div>
      <div v-if="character.featuresTraits.length === 0" class="text-center py-8 text-gray-500 italic">
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

<template>
  <div class="section">
    <div class="section-header">
      <h3 class="section-title">Feats</h3>
      <button
        @click="openSelectionModal"
        class="btn btn-primary text-xs"
      >
        + Add Feat
      </button>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="featId in character.feats"
        :key="featId"
        class="card"
      >
        <div class="flex justify-between items-center mb-1.5">
          <div class="flex items-center gap-2">
            <span class="text-base font-bold">{{ getFeatName(featId) }}</span>
            <span class="text-xs text-[var(--color-text-tertiary)] px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded">{{ getFeatType(featId) }}</span>
          </div>
          <button
            @click="removeFeat(featId)"
            class="btn btn-danger text-xs px-2 py-1"
          >
            ×
          </button>
        </div>
        <div class="pt-1.5 border-t border-[var(--color-border-divider)]">
          <p class="text-sm text-[var(--color-text-secondary)]">{{ getFeatDescription(featId) }}</p>
        </div>
      </div>
      <div v-if="character.feats.length === 0" class="text-center py-6 text-[var(--color-text-muted)] italic text-sm">
        No feats added yet. Click "+ Add Feat" to get started.
      </div>
    </div>
    <FeatSelectionModal
      v-if="showModal"
      :is-open="showModal"
      :selected-feats="character.feats"
      @close="showModal = false"
      @select="handleFeatSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import featsJson from '~/data/feats.json'

const { character, addFeat, removeFeat } = useCharacter()

const showModal = ref(false)

const openSelectionModal = () => {
  showModal.value = true
}

const handleFeatSelect = (featIds: string[]) => {
  // Remove feats that are no longer selected
  character.value.feats.forEach(featId => {
    if (!featIds.includes(featId)) {
      removeFeat(featId)
    }
  })

  // Add newly selected feats
  featIds.forEach(featId => {
    if (!character.value.feats.includes(featId)) {
      addFeat(featId)
    }
  })

  showModal.value = false
}

const getFeatName = (featId: string): string => {
  const featsData = featsJson as { feats: any[] }
  const feat = featsData.feats.find(f => f.id === featId)
  return feat?.name || featId
}

const getFeatDescription = (featId: string): string => {
  const featsData = featsJson as { feats: any[] }
  const feat = featsData.feats.find(f => f.id === featId)
  return feat?.description || ''
}

const getFeatType = (featId: string): string => {
  const featsData = featsJson as { feats: any[] }
  const feat = featsData.feats.find(f => f.id === featId)
  if (feat?.type === 'origin') return 'Origin Feat'
  if (feat?.type === 'general') return 'General Feat'
  return 'Feat'
}
</script>

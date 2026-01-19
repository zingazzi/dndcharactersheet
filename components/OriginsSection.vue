<template>
  <div class="section">
    <div class="section-header">
      <h3 class="section-title">Origins</h3>
      <button
        @click="openSelectionModal"
        class="btn btn-primary text-xs"
      >
        + Add Origin
      </button>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="originId in character.origins"
        :key="originId"
        class="card"
      >
        <div class="flex justify-between items-center mb-1.5">
          <div class="flex items-center gap-2">
            <span class="text-base font-bold">{{ getOriginName(originId) }}</span>
            <span class="text-xs text-[var(--color-text-tertiary)] px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded">Origin</span>
          </div>
          <button
            @click="removeOrigin(originId)"
            class="btn btn-danger text-xs px-2 py-1"
          >
            ×
          </button>
        </div>
        <div class="pt-1.5 border-t border-[var(--color-border-divider)]">
          <p class="text-sm text-[var(--color-text-secondary)]">{{ getOriginDescription(originId) }}</p>
        </div>
      </div>
      <div v-if="character.origins.length === 0" class="text-center py-6 text-[var(--color-text-muted)] italic text-sm">
        No origins added yet. Click "+ Add Origin" to get started.
      </div>
    </div>
    <OriginSelectionModal
      v-if="showModal"
      :is-open="showModal"
      :selected-origins="character.origins"
      @close="showModal = false"
      @select="handleOriginSelect"
    />
    <FeatChoiceModal
      v-if="showChoiceModal"
      :is-open="showChoiceModal"
      :feat-id="pendingFeatId"
      @close="showChoiceModal = false"
      @confirm="handleFeatChoiceConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Character } from '~/types/character'
import originsJson from '~/data/origins.json'
import featsJson from '~/data/feats.json'

const { character, addOrigin, removeOrigin, addFeat, featRequiresChoices } = useCharacter()

const showModal = ref(false)
const showChoiceModal = ref(false)
const pendingFeatId = ref<string | null>(null)

const openSelectionModal = () => {
  showModal.value = true
}

const handleOriginSelect = async (originIds: string[]) => {
  // Remove origins that are no longer selected
  character.value.origins.forEach(originId => {
    if (!originIds.includes(originId)) {
      removeOrigin(originId)
    }
  })

  // Add newly selected origins and check for feat choices
  for (const originId of originIds) {
    if (!character.value.origins.includes(originId)) {
      addOrigin(originId)

      // Check if the origin grants a feat that requires choices
      const originsData = originsJson as { origins: any[] }
      const origin = originsData.origins.find(o => o.id === originId)
      if (origin?.originFeat && featRequiresChoices(origin.originFeat)) {
        // Wait for the origin to be added, then prompt for choices
        await nextTick()
        pendingFeatId.value = origin.originFeat
        showChoiceModal.value = true
        break // Only handle one feat choice at a time
      }
    }
  }

  showModal.value = false
}

const handleFeatChoiceConfirm = (choices: Record<string, any>) => {
  if (pendingFeatId.value) {
    // The feat was already added by addOrigin, but we need to apply advantages with choices
    // addFeat will handle storing choices and applying advantages even if feat already exists
    addFeat(pendingFeatId.value, choices)
    pendingFeatId.value = null
  }
  showChoiceModal.value = false
}

const getOriginName = (originId: string): string => {
  const originsData = originsJson as { origins: any[] }
  const origin = originsData.origins.find(o => o.id === originId)
  return origin?.name || originId
}

const getOriginDescription = (originId: string): string => {
  const originsData = originsJson as { origins: any[] }
  const origin = originsData.origins.find(o => o.id === originId)
  return origin?.description || ''
}
</script>

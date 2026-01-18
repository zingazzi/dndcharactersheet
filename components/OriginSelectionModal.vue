<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <div class="modal-header">
        <h2 class="modal-title">Select Origins</h2>
        <button @click="close" class="btn btn-ghost text-xl px-2 py-1">×</button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <div class="flex flex-col gap-3">
          <div
            v-for="origin in origins"
            :key="origin.id"
            class="card cursor-pointer"
            :class="{ 'ring-2 ring-[var(--color-accent-primary)]': selectedOriginIds.includes(origin.id) }"
            @click="toggleOrigin(origin.id)"
          >
            <div class="flex items-start gap-3">
              <input
                type="checkbox"
                :checked="selectedOriginIds.includes(origin.id)"
                @change="toggleOrigin(origin.id)"
                @click.stop
                class="mt-1"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-bold">{{ origin.name }}</h3>
                  <span class="text-xs text-[var(--color-text-tertiary)] px-2 py-1 bg-[var(--color-bg-secondary)] rounded">Origin</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">{{ origin.description }}</p>
                <div class="space-y-2 text-sm">
                  <div v-if="origin.abilityScoreIncreases">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Ability Score Increases: </span>
                    <span class="text-[var(--color-text-secondary)]">
                      {{ formatAbilityScoreIncreases(origin.abilityScoreIncreases) }}
                    </span>
                  </div>
                  <div v-if="origin.skillProficiencies && origin.skillProficiencies.length > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Skill Proficiencies: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ origin.skillProficiencies.join(', ') }}</span>
                  </div>
                  <div v-if="origin.toolProficiencies && origin.toolProficiencies.length > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Tool Proficiencies: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ origin.toolProficiencies.join(', ') }}</span>
                  </div>
                  <div v-if="origin.originFeat">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Origin Feat: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ getFeatName(origin.originFeat) }}</span>
                  </div>
                  <div v-if="origin.features && origin.features.length > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Features: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ origin.features.map((f: any) => f.name).join(', ') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="btn btn-secondary">Cancel</button>
        <button @click="confirmSelection" class="btn btn-primary">Confirm Selection</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import originsJson from '~/data/origins.json'
import featsJson from '~/data/feats.json'

const props = defineProps<{
  isOpen: boolean
  selectedOrigins: string[]
}>()

const emit = defineEmits<{
  close: []
  select: [originIds: string[]]
}>()

const origins = computed(() => {
  const data = originsJson as { origins: any[] }
  return data.origins || []
})

const selectedOriginIds = ref<string[]>([])

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedOriginIds.value = [...props.selectedOrigins]
  }
})

const toggleOrigin = (originId: string) => {
  const index = selectedOriginIds.value.indexOf(originId)
  if (index === -1) {
    selectedOriginIds.value.push(originId)
  } else {
    selectedOriginIds.value.splice(index, 1)
  }
}

const confirmSelection = () => {
  emit('select', selectedOriginIds.value)
}

const close = () => {
  emit('close')
}

const formatAbilityScoreIncreases = (increases: any): string => {
  const parts: string[] = []
  Object.keys(increases).forEach(key => {
    const value = increases[key]
    if (value > 0) {
      const abilityName = key.charAt(0).toUpperCase() + key.slice(1)
      parts.push(`${abilityName} +${value}`)
    }
  })
  return parts.join(', ') || 'None'
}

const getFeatName = (featId: string): string => {
  const featsData = featsJson as { feats: any[] }
  const feat = featsData.feats.find(f => f.id === featId)
  return feat?.name || featId
}
</script>

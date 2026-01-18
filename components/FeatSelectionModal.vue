<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <div class="modal-header">
        <h2 class="modal-title">Select Feats</h2>
        <button @click="close" class="btn btn-ghost text-xl px-2 py-1">×</button>
      </div>
      <div class="p-4 border-b border-[var(--color-border-divider)]">
        <div class="flex gap-2 items-center">
          <label class="text-sm font-semibold">Filter:</label>
          <select v-model="filterType" class="input-select text-sm">
            <option value="all">All Feats</option>
            <option value="origin">Origin Feats</option>
            <option value="general">General Feats</option>
          </select>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search feats..."
            class="input flex-1 text-sm"
          />
        </div>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <div class="flex flex-col gap-3">
          <div
            v-for="feat in filteredFeats"
            :key="feat.id"
            class="card cursor-pointer"
            :class="{
              'ring-2 ring-[var(--color-accent-primary)]': selectedFeatIds.includes(feat.id),
              'opacity-50': !canTakeFeat(feat.id)
            }"
            @click="toggleFeat(feat.id)"
          >
            <div class="flex items-start gap-3">
              <input
                type="checkbox"
                :checked="selectedFeatIds.includes(feat.id)"
                :disabled="!canTakeFeat(feat.id)"
                @change="toggleFeat(feat.id)"
                @click.stop
                class="mt-1"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-bold">{{ feat.name }}</h3>
                  <span class="text-xs text-[var(--color-text-tertiary)] px-2 py-1 bg-[var(--color-bg-secondary)] rounded">
                    {{ feat.type === 'origin' ? 'Origin Feat' : 'General Feat' }}
                  </span>
                  <span v-if="!canTakeFeat(feat.id)" class="text-xs text-red-500">(Prerequisites not met)</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">{{ feat.description }}</p>
                <div class="space-y-2 text-sm">
                  <div v-if="feat.prerequisites && feat.prerequisites.length > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Prerequisites: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ formatPrerequisites(feat.prerequisites) }}</span>
                  </div>
                  <div v-if="feat.abilityScoreIncreases">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Ability Score Increases: </span>
                    <span class="text-[var(--color-text-secondary)]">
                      {{ formatAbilityScoreIncreases(feat.abilityScoreIncreases) }}
                    </span>
                  </div>
                  <div v-if="feat.skillProficiencies && feat.skillProficiencies.length > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Skill Proficiencies: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ feat.skillProficiencies.join(', ') }}</span>
                  </div>
                  <div v-if="feat.features && feat.features.length > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Features: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ feat.features.map((f: any) => f.name).join(', ') }}</span>
                  </div>
                  <div v-if="feat.spells && feat.spells.length > 0">
                    <span class="font-semibold text-[var(--color-text-tertiary)]">Spells: </span>
                    <span class="text-[var(--color-text-secondary)]">{{ feat.spells.map((s: any) => s.name).join(', ') }}</span>
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
import featsJson from '~/data/feats.json'

const props = defineProps<{
  isOpen: boolean
  selectedFeats: string[]
}>()

const emit = defineEmits<{
  close: []
  select: [featIds: string[]]
}>()

const { canTakeFeat } = useCharacter()

const feats = computed(() => {
  const data = featsJson as { feats: any[] }
  return data.feats || []
})

const filterType = ref<'all' | 'origin' | 'general'>('all')
const searchQuery = ref('')
const selectedFeatIds = ref<string[]>([])

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedFeatIds.value = [...props.selectedFeats]
  }
})

const filteredFeats = computed(() => {
  let filtered = feats.value

  // Filter by type
  if (filterType.value !== 'all') {
    filtered = filtered.filter(f => f.type === filterType.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(f =>
      f.name.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

const toggleFeat = (featId: string) => {
  if (!canTakeFeat(featId)) return
  const index = selectedFeatIds.value.indexOf(featId)
  if (index === -1) {
    selectedFeatIds.value.push(featId)
  } else {
    selectedFeatIds.value.splice(index, 1)
  }
}

const confirmSelection = () => {
  emit('select', selectedFeatIds.value)
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

const formatPrerequisites = (prerequisites: any[]): string => {
  if (!prerequisites || prerequisites.length === 0) return 'None'
  return prerequisites.map((p: any) => {
    if (typeof p === 'string') return p
    return JSON.stringify(p)
  }).join(', ')
}
</script>

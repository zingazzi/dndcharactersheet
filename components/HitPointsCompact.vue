<template>
  <div class="section">
    <h3 class="section-title mb-1.5">Hit Points</h3>
    <div
      class="clickable-card card-compact text-center"
      @click="openHPModal"
      title="Click to manage HP"
    >
      <div class="flex items-center justify-center gap-1 mb-1">
        <span class="text-2xl font-bold font-medieval text-[var(--color-success-dark)]">{{ character.hitPoints.current }}</span>
        <span class="text-base font-bold text-[var(--color-text-tertiary)]">/</span>
        <span class="text-2xl font-bold font-medieval text-[var(--color-success-dark)]">{{ character.hitPoints.maximum }}</span>
        <span
          v-if="character.hitPoints.temporary && character.hitPoints.temporary > 0"
          class="text-sm font-bold text-[var(--color-accent-primary-dark)] px-1.5 py-0.5 bg-[var(--color-accent-primary)]/25 border border-[var(--color-accent-primary-light)] rounded"
        >
          +{{ character.hitPoints.temporary }}
        </span>
      </div>
      <div class="text-sm text-[var(--color-text-tertiary)]">
        Max: {{ character.hitPoints.maximum }}
        <span v-if="character.hitPoints.temporary && character.hitPoints.temporary > 0">
          | Temp: +{{ character.hitPoints.temporary }}
        </span>
      </div>
    </div>
    <HPEditModal
      :is-open="isHPModalOpen"
      @close="closeHPModal"
    />
  </div>
</template>

<script setup lang="ts">
const { character } = useCharacter()

const isHPModalOpen = ref(false)

const openHPModal = () => {
  isHPModalOpen.value = true
}

const closeHPModal = () => {
  isHPModalOpen.value = false
}
</script>

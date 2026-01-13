<template>
  <div class="section">
    <h3 class="section-title mb-1.5">Hit Dice</h3>
    <div class="flex items-center justify-center gap-2">
      <div class="text-center">
        <div class="text-sm text-[var(--color-text-tertiary)] mb-0.5">Total</div>
        <div class="text-lg font-bold font-medieval text-[var(--color-text-primary)]">{{ hitDiceTotal }}</div>
      </div>
      <span class="text-[var(--color-text-tertiary)]">/</span>
      <div class="text-center">
        <div class="text-sm text-[var(--color-text-tertiary)] mb-0.5">Available</div>
        <div class="text-lg font-bold font-medieval text-[var(--color-text-primary)]">{{ hitDiceAvailable }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { character } = useCharacter()

// Calculate hit dice based on level (simplified - assumes d10 for Fighter)
const hitDiceTotal = computed(() => {
  return character.value.level || 1
})

const hitDiceAvailable = computed(() => {
  // For now, return total. In future, track used hit dice
  return hitDiceTotal.value
})
</script>

<template>
  <div class="w-full p-2 min-h-[200px] bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg shadow-sm">
    <CharacterInfoHeader />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
      <div class="left-column">
        <AbilitiesColumn />
      </div>
      <div class="middle-column">
        <CombatColumn />
      </div>
      <div class="right-column">
        <PersonalityColumn />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Initialize character composable to ensure state is ready
const { character } = useCharacter()

// Debug: log character state
onMounted(() => {
  console.log('Character sheet mounted', character.value)
})
</script>

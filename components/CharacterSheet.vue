<template>
  <div class="character-sheet">
    <CharacterHeader />
    <div class="second-row">
      <div class="left-column">
        <AbilitiesSection />
      </div>
      <div class="right-column">
        <SkillsSection />
      </div>
    </div>
    <ActionsSection />
    <SpellsSection />
    <InventorySection />
    <FeaturesTraitsSection />
    <BackgroundSection />
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

<style scoped>
.character-sheet {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 200px;
}

.error-message {
  padding: 2rem;
  background: #fee;
  border: 2px solid #f00;
  border-radius: 4px;
  color: #c00;
  font-weight: bold;
  text-align: center;
}

.second-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
}

@media (max-width: 1200px) {
  .second-row {
    grid-template-columns: 1fr;
  }
}
</style>

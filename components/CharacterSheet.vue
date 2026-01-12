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
  padding: 2rem;
  min-height: 200px;
  background: 
    linear-gradient(90deg, rgba(139, 69, 19, 0.1) 0%, transparent 50%, rgba(139, 69, 19, 0.1) 100%),
    url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='parchment' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23d4a574' opacity='0.1'/%3E%3Ccircle cx='80' cy='40' r='1.5' fill='%23b8956a' opacity='0.1'/%3E%3Ccircle cx='40' cy='80' r='1' fill='%239d7f5a' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23parchment)'/%3E%3C/svg%3E");
  background-color: #f4e8d0;
  border: 3px solid #8b4513;
  border-radius: 8px;
  box-shadow: 
    0 0 0 2px #d4a574,
    0 4px 20px rgba(0, 0, 0, 0.3),
    inset 0 0 50px rgba(139, 69, 19, 0.1);
  position: relative;
}

.character-sheet::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(212, 165, 116, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(184, 149, 106, 0.2) 0%, transparent 50%);
  pointer-events: none;
  border-radius: 8px;
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
  gap: 1.5rem;
  margin-bottom: 1.5rem;
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

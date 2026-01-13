<template>
  <div class="container">
    <MenuBar />
    <div v-if="error" style="background: #fee; color: #c00; border-radius: 4px;">
      <h2>Error loading character sheet</h2>
      <p>{{ error }}</p>
    </div>
    <CharacterSheet v-else />
  </div>
</template>

<script setup lang="ts">
const error = ref<string | null>(null)

onMounted(() => {
  try {
    // Test if composable is available
    const test = useCharacter()
    console.log('Composable loaded successfully', test)
  } catch (e) {
    error.value = `Failed to load composable: ${e}`
    console.error('Error:', e)
  }
})
</script>

<style scoped>
.container {
  min-height: 100vh;
 
}
</style>

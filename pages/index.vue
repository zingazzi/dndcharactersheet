<template>
  <div class="w-full min-h-screen">
    <MenuBar />
    <div v-if="error" class="p-4 bg-red-100 text-red-800 rounded">
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

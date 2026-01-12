<template>
  <div class="container">
    <div style="background: red; color: white; padding: 2rem; margin-bottom: 2rem; font-size: 2rem; text-align: center;">
      TEST: If you see this red box, the page is loading!
    </div>
    <CharacterSheet />
  </div>
</template>

<script setup lang="ts">
// Main character sheet page
console.log('Index page loaded')
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 1rem;
}
</style>

<template>
  <div class="layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Default layout for the D&D character sheet app
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background: #f5f5f5;
}

input,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
}

button {
  font-family: inherit;
  font-size: inherit;
}

.layout {
  width: 100%;
  min-height: 100vh;
}
</style>

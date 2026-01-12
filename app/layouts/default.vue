<template>
  <div class="layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Default layout for the D&D character sheet app
useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=MedievalSharp&family=Uncial+Antiqua&display=swap',
    },
  ],
})
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Cinzel', 'Georgia', 'Times New Roman', serif;
  font-size: 14px;
  line-height: 1.6;
  color: #2c1810;
  background: linear-gradient(135deg, #d4a574 0%, #b8956a 50%, #9d7f5a 100%);
  background-attachment: fixed;
  min-height: 100vh;
}

input,
textarea,
select {
  font-family: 'Cinzel', 'Georgia', 'Times New Roman', serif;
  font-size: inherit;
}

button {
  font-family: 'Cinzel', 'Georgia', 'Times New Roman', serif;
  font-size: inherit;
}

.layout {
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
}
</style>

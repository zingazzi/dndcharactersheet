<template>
  <div class="w-full min-h-screen">
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

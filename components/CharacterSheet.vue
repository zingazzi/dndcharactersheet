<template>
  <div class="w-full p-8 min-h-[200px] bg-parchment border-[3px] border-brown rounded-lg shadow-[0_0_0_2px_#d4a574,0_4px_20px_rgba(0,0,0,0.3),inset_0_0_50px_rgba(139,69,19,0.1)] relative bg-parchment-pattern"
    style="background-image: linear-gradient(90deg, rgba(139, 69, 19, 0.1) 0%, transparent 50%, rgba(139, 69, 19, 0.1) 100%), url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'parchment\' x=\'0\' y=\'0\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1\' fill=\'%23d4a574\' opacity=\'0.1\'/%3E%3Ccircle cx=\'80\' cy=\'40\' r=\'1.5\' fill=\'%23b8956a\' opacity=\'0.1\'/%3E%3Ccircle cx=\'40\' cy=\'80\' r=\'1\' fill=\'%239d7f5a\' opacity=\'0.1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23parchment)\'/%3E%3C/svg%3E');"
  >
    <div class="absolute inset-0 pointer-events-none rounded-lg"
      style="background: radial-gradient(circle at 20% 30%, rgba(212, 165, 116, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(184, 149, 106, 0.2) 0%, transparent 50%);"
    ></div>
    <CharacterHeader />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="flex flex-col">
        <AbilitiesSection />
      </div>
      <div class="flex flex-col">
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

<template>
  <div class="p-6 border-2 border-brown rounded-md mb-6 bg-white/40 shadow-[0_0_0_1px_#d4a574,0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]">
    <h3 class="m-0 mb-4 text-xl font-cinzel font-semibold text-text-brown border-b-2 border-brown pb-2 text-shadow-dnd tracking-wide uppercase">Background</h3>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label class="font-semibold text-gray-700 text-sm">Background Name</label>
        <input
          v-model="character.background.name"
          type="text"
          placeholder="e.g., Acolyte, Criminal, Folk Hero"
          class="input-dnd"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-semibold text-gray-700 text-sm">Personality Traits</label>
        <textarea
          v-model="character.background.personalityTraits"
          placeholder="Describe your character's personality traits..."
          rows="3"
          class="input-dnd-textarea min-h-[80px]"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-semibold text-gray-700 text-sm">Ideals</label>
        <textarea
          v-model="character.background.ideals"
          placeholder="What ideals drive your character?"
          rows="3"
          class="input-dnd-textarea min-h-[80px]"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-semibold text-gray-700 text-sm">Bonds</label>
        <textarea
          v-model="character.background.bonds"
          placeholder="What bonds connect your character to people, places, or events?"
          rows="3"
          class="input-dnd-textarea min-h-[80px]"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-semibold text-gray-700 text-sm">Flaws</label>
        <textarea
          v-model="character.background.flaws"
          placeholder="What flaws or weaknesses does your character have?"
          rows="3"
          class="input-dnd-textarea min-h-[80px]"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-semibold text-gray-700 text-sm">Backstory</label>
        <textarea
          v-model="character.background.backstory"
          placeholder="Tell the story of your character's past..."
          rows="6"
          class="input-dnd-textarea min-h-[80px]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { character } = useCharacter()
</script>

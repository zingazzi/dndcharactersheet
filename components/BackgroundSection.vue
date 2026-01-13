<template>
  <div class="section">
    <h3 class="section-title mb-3">Background</h3>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[var(--color-text-secondary)]">Background Name</label>
        <input
          v-model="character.background.name"
          type="text"
          placeholder="e.g., Acolyte, Criminal, Folk Hero"
          class="input"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[var(--color-text-secondary)]">Personality Traits</label>
        <textarea
          v-model="character.background.personalityTraits"
          placeholder="Describe your character's personality traits..."
          rows="2"
          class="input-textarea"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[var(--color-text-secondary)]">Ideals</label>
        <textarea
          v-model="character.background.ideals"
          placeholder="What ideals drive your character?"
          rows="2"
          class="input-textarea"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[var(--color-text-secondary)]">Bonds</label>
        <textarea
          v-model="character.background.bonds"
          placeholder="What bonds connect your character to people, places, or events?"
          rows="2"
          class="input-textarea"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[var(--color-text-secondary)]">Flaws</label>
        <textarea
          v-model="character.background.flaws"
          placeholder="What flaws or weaknesses does your character have?"
          rows="2"
          class="input-textarea"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[var(--color-text-secondary)]">Backstory</label>
        <textarea
          v-model="character.background.backstory"
          placeholder="Tell the story of your character's past..."
          rows="4"
          class="input-textarea"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { character } = useCharacter()
</script>

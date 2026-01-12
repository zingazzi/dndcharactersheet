<template>
  <div class="background-section">
    <h3>Background</h3>
    <div class="background-content">
      <div class="background-field">
        <label>Background Name</label>
        <input
          v-model="character.background.name"
          type="text"
          placeholder="e.g., Acolyte, Criminal, Folk Hero"
          class="background-input"
        />
      </div>
      <div class="background-field">
        <label>Personality Traits</label>
        <textarea
          v-model="character.background.personalityTraits"
          placeholder="Describe your character's personality traits..."
          rows="3"
          class="background-textarea"
        />
      </div>
      <div class="background-field">
        <label>Ideals</label>
        <textarea
          v-model="character.background.ideals"
          placeholder="What ideals drive your character?"
          rows="3"
          class="background-textarea"
        />
      </div>
      <div class="background-field">
        <label>Bonds</label>
        <textarea
          v-model="character.background.bonds"
          placeholder="What bonds connect your character to people, places, or events?"
          rows="3"
          class="background-textarea"
        />
      </div>
      <div class="background-field">
        <label>Flaws</label>
        <textarea
          v-model="character.background.flaws"
          placeholder="What flaws or weaknesses does your character have?"
          rows="3"
          class="background-textarea"
        />
      </div>
      <div class="background-field">
        <label>Backstory</label>
        <textarea
          v-model="character.background.backstory"
          placeholder="Tell the story of your character's past..."
          rows="6"
          class="background-textarea"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { character } = useCharacter()
</script>

<style scoped>
.background-section {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.background-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.background-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.background-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.background-field label {
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.background-input,
.background-textarea {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
}

.background-input:focus,
.background-textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.background-textarea {
  min-height: 80px;
}
</style>

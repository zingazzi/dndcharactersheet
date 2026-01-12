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
  padding: 1.5rem;
  border: 2px solid #8b4513;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 0 0 1px #d4a574,
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.background-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.4rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #5c3a21;
  border-bottom: 2px solid #8b4513;
  padding-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
  text-transform: uppercase;
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
  border: 2px solid #8b4513;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  background: rgba(255, 255, 255, 0.8);
  color: #2c1810;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.background-input:focus,
.background-textarea:focus {
  outline: none;
  border-color: #6b3410;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 0 0 3px rgba(139, 69, 19, 0.2);
}

.background-textarea {
  min-height: 80px;
}
</style>

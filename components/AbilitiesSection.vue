<template>
  <div class="abilities-section">
    <h3>Abilities & Saves</h3>
    <div class="abilities-grid">
      <div
        v-for="(ability, key) in character.abilities"
        :key="key"
        class="ability-card"
      >
        <div class="ability-name">{{ getAbilityName(key) }}</div>
        <div class="ability-abbrev">{{ getAbilityAbbrev(key) }}</div>
        <div class="ability-score">
          <input
            :value="ability.score"
            @input="updateAbilityScore(key, +($event.target as HTMLInputElement).value)"
            type="number"
            class="score-input"
            min="1"
            max="30"
          />
        </div>
        <div class="ability-modifier">
          {{ formatModifier(ability.modifier) }}
        </div>
        <div class="save-throw">
          <label>
            <input
              type="checkbox"
              :checked="ability.saveProficient"
              @change="updateSaveProficiency(key, ($event.target as HTMLInputElement).checked)"
            />
            <span>Save</span>
          </label>
          <span class="save-modifier">{{ formatModifier(ability.saveModifier) }}</span>
        </div>
      </div>
    </div>
    <div class="senses-section">
      <label>Senses</label>
      <textarea
        v-model="character.senses"
        placeholder="e.g., Passive Perception 15, Darkvision 60 ft."
        rows="2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character } from '~/types/character'

const { character, updateAbilityScore, updateSaveProficiency } = useCharacter()

const getAbilityName = (key: keyof Character['abilities']): string => {
  const names: Record<keyof Character['abilities'], string> = {
    strength: 'Strength',
    dexterity: 'Dexterity',
    constitution: 'Constitution',
    intelligence: 'Intelligence',
    wisdom: 'Wisdom',
    charisma: 'Charisma',
  }
  return names[key]
}

const getAbilityAbbrev = (key: keyof Character['abilities']): string => {
  const abbrevs: Record<keyof Character['abilities'], string> = {
    strength: 'STR',
    dexterity: 'DEX',
    constitution: 'CON',
    intelligence: 'INT',
    wisdom: 'WIS',
    charisma: 'CHA',
  }
  return abbrevs[key]
}

const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}
</script>

<style scoped>
.abilities-section {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.abilities-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.abilities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.ability-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f9f9f9;
}

.ability-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.ability-abbrev {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.ability-score {
  margin-bottom: 0.5rem;
}

.score-input {
  width: 60px;
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
}

.ability-modifier {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.save-throw {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.save-throw label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}

.save-modifier {
  font-weight: bold;
  color: #555;
}

.senses-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
}

.senses-section label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.senses-section textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  resize: vertical;
}
</style>

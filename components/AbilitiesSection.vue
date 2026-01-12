<template>
  <div class="abilities-section">
    <div class="section-header">
      <h3>Abilities & Saves</h3>
      <button @click="openEditModal" class="edit-btn">Edit</button>
    </div>
    <div class="abilities-grid">
      <div
        v-for="(ability, key) in character.abilities"
        :key="key"
        class="ability-card"
      >
        <div class="ability-name">{{ getAbilityName(key) }}</div>
        <div class="ability-abbrev">{{ getAbilityAbbrev(key) }}</div>
        <div class="ability-score">
          <span class="score-display">{{ finalScore(key) }}</span>
        </div>
        <div class="ability-modifier clickable" @click="rollAbilityCheck(key)">
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
          <span class="save-modifier clickable" @click="rollSavingThrow(key)">{{ formatModifier(ability.saveModifier) }}</span>
        </div>
      </div>
    </div>
    <div class="senses-section">
      <h4>Senses</h4>
      <div class="senses-grid">
        <div class="sense-item">
          <label>Passive Perception</label>
          <div class="sense-value">{{ calculatePassivePerception() }}</div>
        </div>
        <div class="sense-item">
          <label>Passive Investigation</label>
          <div class="sense-value">{{ calculatePassiveInvestigation() }}</div>
        </div>
        <div class="sense-item">
          <label>Passive Insight</label>
          <div class="sense-value">{{ calculatePassiveInsight() }}</div>
        </div>
      </div>
    </div>
    <AbilitiesEditModal
      :is-open="isEditModalOpen"
      @close="closeEditModal"
      @save="handleSaveAbilities"
    />
    <Toast
      :is-visible="toast.isVisible"
      :title="toast.title"
      :roll="toast.roll"
      :modifier="toast.modifier"
      :total="toast.total"
      @close="closeToast"
    />
  </div>
</template>

<script setup lang="ts">
import type { Character } from '~/types/character'

const { character, updateSaveProficiency, setAbilityScores, updateCustomModifier } = useCharacter()

const isEditModalOpen = ref(false)

const openEditModal = () => {
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const handleSaveAbilities = (newAbilities: Character['abilities']) => {
  // Update all ability scores and custom modifiers
  Object.keys(newAbilities).forEach(key => {
    const abilityKey = key as keyof Character['abilities']
    const newAbility = newAbilities[abilityKey]
    const oldAbility = character.value.abilities[abilityKey]
    
    // Update score if changed
    if (newAbility.score !== oldAbility.score) {
      setAbilityScores({ [abilityKey]: newAbility.score })
    }
    
    // Update custom modifier if changed
    if (newAbility.customModifier !== oldAbility.customModifier) {
      updateCustomModifier(abilityKey, newAbility.customModifier)
    }
  })
  
  closeEditModal()
}

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

const finalScore = (key: keyof Character['abilities']): number => {
  const ability = character.value.abilities[key]
  return ability.score + (ability.customModifier || 0)
}

const calculatePassivePerception = (): number => {
  const wisdomModifier = character.value.abilities.wisdom.modifier
  const perceptionSkill = character.value.skills.find(s => s.name === 'Perception')
  const proficiencyBonus = character.value.proficiencyBonus
  const base = 10 + wisdomModifier
  return perceptionSkill?.proficient ? base + proficiencyBonus : base
}

const calculatePassiveInvestigation = (): number => {
  const intelligenceModifier = character.value.abilities.intelligence.modifier
  const investigationSkill = character.value.skills.find(s => s.name === 'Investigation')
  const proficiencyBonus = character.value.proficiencyBonus
  const base = 10 + intelligenceModifier
  return investigationSkill?.proficient ? base + proficiencyBonus : base
}

const calculatePassiveInsight = (): number => {
  const wisdomModifier = character.value.abilities.wisdom.modifier
  const insightSkill = character.value.skills.find(s => s.name === 'Insight')
  const proficiencyBonus = character.value.proficiencyBonus
  const base = 10 + wisdomModifier
  return insightSkill?.proficient ? base + proficiencyBonus : base
}

const toast = ref({
  isVisible: false,
  title: '',
  roll: 0,
  modifier: 0,
  total: 0,
})

const rollD20 = (): number => {
  return Math.floor(Math.random() * 20) + 1
}

const showToast = (title: string, roll: number, modifier: number) => {
  const total = roll + modifier
  toast.value = {
    isVisible: true,
    title,
    roll,
    modifier,
    total,
  }
}

const closeToast = () => {
  toast.value.isVisible = false
}

const { addRoll } = useDiceHistory()

const rollAbilityCheck = (key: keyof Character['abilities']) => {
  const ability = character.value.abilities[key]
  const roll = rollD20()
  const abilityName = getAbilityName(key)
  const title = `${abilityName} Check`
  showToast(title, roll, ability.modifier)
  addRoll(title, roll, ability.modifier)
}

const rollSavingThrow = (key: keyof Character['abilities']) => {
  const ability = character.value.abilities[key]
  const roll = rollD20()
  const abilityName = getAbilityName(key)
  const title = `${abilityName} Saving Throw`
  showToast(title, roll, ability.saveModifier)
  addRoll(title, roll, ability.saveModifier)
}
</script>

<style scoped>
.abilities-section {
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.abilities-section h3 {
  margin: 0;
  font-size: 1.4rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #5c3a21;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.edit-btn {
  padding: 0.5rem 1.25rem;
  background: linear-gradient(180deg, #8b4513 0%, #6b3410 100%);
  color: #f4e8d0;
  border: 2px solid #5c3a21;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: linear-gradient(180deg, #9d5520 0%, #7b4415 100%);
  transform: translateY(-1px);
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
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
  padding: 1rem;
  border: 2px solid #8b4513;
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(244, 232, 208, 0.4) 100%);
  box-shadow: 
    0 0 0 1px #d4a574,
    0 2px 4px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ability-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 0 0 1px #d4a574,
    0 4px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.ability-name {
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'Cinzel', serif;
  margin-bottom: 0.25rem;
  letter-spacing: 0.05em;
}

.ability-abbrev {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.ability-score {
  margin-bottom: 0.5rem;
}

.score-display {
  font-size: 1.5rem;
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  color: #333;
}

.ability-modifier {
  font-size: 1.1rem;
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  color: #333;
  margin-bottom: 0.5rem;
}

.clickable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.clickable:hover {
  background: rgba(212, 165, 116, 0.3);
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
  font-family: 'MedievalSharp', 'Cinzel', serif;
  color: #555;
}

.senses-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #8b4513;
}

.senses-section h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #5c3a21;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.05em;
}

.senses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.sense-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sense-item label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
}

.sense-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c1810;
  padding: 0.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(244, 232, 208, 0.4) 100%);
  border: 2px solid #8b4513;
  border-radius: 4px;
  text-align: center;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>

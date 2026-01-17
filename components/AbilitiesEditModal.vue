<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content-large">
      <div class="modal-header">
        <h2 class="m-0 text-base font-cinzel font-semibold text-[var(--color-text-secondary)]">Edit Ability Scores</h2>
        <button
          @click="close"
          class="bg-transparent border-none text-xl text-[var(--color-accent-primary)] cursor-pointer w-6 h-6 flex items-center justify-center rounded transition-all duration-200 hover:bg-[var(--color-accent-primary)]/20 leading-none"
        >
          ×
        </button>
      </div>

      <div class="modal-body">
        <div class="mb-2">
          <label class="text-xs font-semibold text-[var(--color-text-secondary)] mr-2">Method:</label>
          <select v-model="selectedMethod" class="input-select text-xs w-auto inline-block">
            <option value="pointbuy">Point Buy</option>
            <option value="standard">Standard Array</option>
            <option value="roll">Roll Dice (4d6 drop lowest)</option>
            <option value="custom">Custom Values</option>
          </select>
        </div>

        <!-- Point Buy -->
        <div v-if="selectedMethod === 'pointbuy'" class="point-buy-section">
          <div class="point-buy-info">
            <p>Available Points: <strong>{{ availablePoints }}</strong></p>
            <p>Base: 8, Cost: 8-13 (1pt), 14-15 (2pts), 16-17 (3pts), 18 (4pts)</p>
          </div>
          <div class="abilities-edit-grid">
            <div
              v-for="(ability, key) in editingAbilities"
              :key="key"
              class="ability-edit-item"
            >
              <label>{{ getAbilityName(key) }}</label>
              <div v-if="hasCurrentValue(key)" class="current-value-display">
                Current: {{ getCurrentValue(key) }}
              </div>
              <input
                v-model.number="editingAbilities[key].score"
                type="number"
                min="8"
                max="18"
                class="score-edit-input"
                @input="updatePointBuyCost(key)"
              />
              <span class="cost-display">Cost: {{ pointBuyCosts[key] }}</span>
            </div>
          </div>
        </div>

        <!-- Standard Array -->
        <div v-if="selectedMethod === 'standard'" class="standard-array-section">
          <p>Standard Array: 15, 14, 13, 12, 10, 8</p>
          <div class="abilities-edit-grid">
            <div
              v-for="(ability, key) in editingAbilities"
              :key="key"
              class="ability-edit-item"
            >
              <label>{{ getAbilityName(key) }}</label>
              <div v-if="hasCurrentValue(key)" class="current-value-display">
                Current: {{ getCurrentValue(key) }}
              </div>
              <select
                v-model.number="editingAbilities[key].score"
                class="score-select"
                @change="handleStandardArrayChange(key)"
              >
                <option :value="null" disabled>Select value...</option>
                <option
                  v-for="value in standardArrayValues"
                  :key="value"
                  :value="value"
                >
                  {{ value }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Roll Dice -->
        <div v-if="selectedMethod === 'roll'" class="roll-dice-section">
          <button @click="rollAllAbilities" class="roll-btn">Roll All Abilities</button>
          <div class="abilities-edit-grid">
            <div
              v-for="(ability, key) in editingAbilities"
              :key="key"
              class="ability-edit-item"
            >
              <label>{{ getAbilityName(key) }}</label>
              <div v-if="hasCurrentValue(key)" class="current-value-display">
                Current: {{ getCurrentValue(key) }}
              </div>
              <div class="roll-controls">
                <input
                  v-model.number="editingAbilities[key].score"
                  type="number"
                  min="3"
                  max="18"
                  class="score-edit-input"
                />
                <button @click="rollAbility(key)" class="roll-single-btn">Roll</button>
              </div>
              <span v-if="lastRolls[key]" class="roll-result">{{ lastRolls[key] }}</span>
            </div>
          </div>
        </div>

        <!-- Custom Values -->
        <div v-if="selectedMethod === 'custom'" class="custom-values-section">
          <div class="abilities-edit-grid">
            <div
              v-for="(ability, key) in editingAbilities"
              :key="key"
              class="ability-edit-item"
            >
              <label>{{ getAbilityName(key) }}</label>
              <div v-if="hasCurrentValue(key)" class="current-value-display">
                Current: {{ getCurrentValue(key) }}
              </div>
              <input
                v-model.number="editingAbilities[key].score"
                type="number"
                min="1"
                max="30"
                class="score-edit-input"
              />
            </div>
          </div>
        </div>

        <!-- Custom Modifiers -->
        <div class="custom-modifiers-section">
          <h3>Custom Modifiers</h3>
          <p class="help-text">Add custom modifiers (e.g., from magic items, racial bonuses)</p>
          <div class="abilities-edit-grid">
            <div
              v-for="(ability, key) in editingAbilities"
              :key="key"
              class="ability-edit-item"
            >
              <label>{{ getAbilityName(key) }}</label>
              <input
                v-model.number="editingAbilities[key].customModifier"
                type="number"
                class="modifier-input"
                placeholder="+0"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="close" class="btn-cancel">Cancel</button>
        <button @click="save" class="btn-save">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character, AbilityScore } from '~/types/character'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', abilities: Character['abilities']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { character } = useCharacter()

const selectedMethod = ref<'pointbuy' | 'standard' | 'roll' | 'custom'>('pointbuy')
const editingAbilities = ref<Record<keyof Character['abilities'], { score: number; customModifier: number }>>({} as any)
const pointBuyCosts = ref<Record<keyof Character['abilities'], number>>({} as any)
const lastRolls = ref<Record<keyof Character['abilities'], string>>({} as any)

const standardArrayValues = [15, 14, 13, 12, 10, 8]

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

const hasCurrentValue = (key: keyof Character['abilities']): boolean => {
  const currentAbility = character.value.abilities[key]
  return currentAbility.score !== 10 || (currentAbility.customModifier || 0) !== 0
}

const getCurrentValue = (key: keyof Character['abilities']): string => {
  const currentAbility = character.value.abilities[key]
  const finalScore = currentAbility.score + (currentAbility.customModifier || 0)
  if (currentAbility.customModifier && currentAbility.customModifier !== 0) {
    return `${currentAbility.score}${currentAbility.customModifier >= 0 ? '+' : ''}${currentAbility.customModifier} = ${finalScore}`
  }
  return `${finalScore}`
}

const calculatePointBuyCost = (score: number): number => {
  if (score <= 13) return Math.max(0, score - 8)
  if (score === 14 || score === 15) return (score - 13) * 2 + 5
  if (score === 16 || score === 17) return (score - 15) * 3 + 9
  if (score === 18) return 15
  return 0
}

const availablePoints = computed(() => {
  const total = Object.values(pointBuyCosts.value).reduce((sum, cost) => sum + cost, 0)
  return 27 - total
})

const handleStandardArrayChange = (changedKey: keyof Character['abilities']) => {
  const newValue = editingAbilities.value[changedKey].score

  // If a value was selected, check if it's already assigned to another ability
  if (newValue) {
    Object.keys(editingAbilities.value).forEach(key => {
      const abilityKey = key as keyof Character['abilities']
      // If this is a different ability with the same value, unassign it
      if (abilityKey !== changedKey && editingAbilities.value[abilityKey].score === newValue) {
        editingAbilities.value[abilityKey].score = null as any
      }
    })
  }
}

const updatePointBuyCost = (key: keyof Character['abilities']) => {
  pointBuyCosts.value[key] = calculatePointBuyCost(editingAbilities.value[key].score)
}

const roll4d6 = (): number => {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
  rolls.sort((a, b) => b - a)
  return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0)
}

const rollAbility = (key: keyof Character['abilities']) => {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
  const sorted = [...rolls].sort((a, b) => b - a)
  const sum = sorted.slice(0, 3).reduce((s, r) => s + r, 0)
  editingAbilities.value[key].score = sum
  lastRolls.value[key] = `[${rolls.join(', ')}] → ${sorted.slice(0, 3).join(' + ')} = ${sum}`
}

const rollAllAbilities = () => {
  Object.keys(editingAbilities.value).forEach(key => {
    rollAbility(key as keyof Character['abilities'])
  })
}

const initializeEditing = () => {
  const abilities = character.value.abilities
  Object.keys(abilities).forEach(key => {
    const abilityKey = key as keyof Character['abilities']
    editingAbilities.value[abilityKey] = {
      score: abilities[abilityKey].score,
      customModifier: abilities[abilityKey].customModifier || 0,
    }
    pointBuyCosts.value[abilityKey] = calculatePointBuyCost(abilities[abilityKey].score)
  })

  // If opening in standard array mode, reset to empty values
  if (selectedMethod.value === 'standard') {
    Object.keys(editingAbilities.value).forEach(key => {
      const abilityKey = key as keyof Character['abilities']
      editingAbilities.value[abilityKey].score = null as any
    })
  }
}

// Re-initialize when method changes
watch(selectedMethod, (newMethod) => {
  if (newMethod === 'standard') {
    // Reset to empty values for standard array
    Object.keys(editingAbilities.value).forEach(key => {
      const abilityKey = key as keyof Character['abilities']
      editingAbilities.value[abilityKey].score = null as any
    })
  } else {
    // Load current values for other methods
    const abilities = character.value.abilities
    Object.keys(abilities).forEach(key => {
      const abilityKey = key as keyof Character['abilities']
      editingAbilities.value[abilityKey].score = abilities[abilityKey].score
      if (newMethod === 'pointbuy') {
        pointBuyCosts.value[abilityKey] = calculatePointBuyCost(abilities[abilityKey].score)
      }
    })
  }
})

const close = () => {
  emit('close')
}

const save = () => {
  // Validate that all abilities have values assigned in standard array mode
  if (selectedMethod.value === 'standard') {
    const hasUnassigned = Object.values(editingAbilities.value).some(ability => !ability.score)
    if (hasUnassigned) {
      alert('Please assign a value to all abilities before saving.')
      return
    }
  }

  const newAbilities = {} as Character['abilities']
  Object.keys(editingAbilities.value).forEach(key => {
    const abilityKey = key as keyof Character['abilities']
    const editing = editingAbilities.value[abilityKey]
    newAbilities[abilityKey] = {
      ...character.value.abilities[abilityKey],
      score: editing.score || 10, // Default to 10 if somehow null
      customModifier: editing.customModifier,
    }
  })
  emit('save', newAbilities)
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    initializeEditing()
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #f4e8d0 0%, #e8d4b8 100%);
  border: 3px solid #8b4513;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 0 0 2px #d4a574,
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 0 50px rgba(139, 69, 19, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #ddd;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #5c3a21;
  letter-spacing: 0.05em;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #000;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.method-selector {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.method-selector label {
  font-weight: 600;
}

.method-select {
  padding: 0.5rem;
  border: 2px solid #8b4513;
  border-radius: 4px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  color: #2c1810;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.abilities-edit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.ability-edit-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ability-edit-item label {
  font-weight: 600;
  font-size: 0.9rem;
}

.score-edit-input,
.score-select,
.modifier-input {
  padding: 0.5rem;
  border: 2px solid #8b4513;
  border-radius: 4px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  color: #2c1810;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.point-buy-info {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.point-buy-info p {
  margin: 0.25rem 0;
}

.cost-display {
  font-size: 0.85rem;
  color: #666;
}

.current-value-display {
  font-size: 0.8rem;
  color: #8b4513;
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-style: italic;
}

.roll-btn,
.roll-single-btn {
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

.roll-btn:hover,
.roll-single-btn:hover {
  background: linear-gradient(180deg, #9d5520 0%, #7b4415 100%);
  transform: translateY(-1px);
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.roll-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.roll-result {
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}

.custom-modifiers-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #ddd;
}

.custom-modifiers-section h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.help-text {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #ddd;
}

.btn-cancel,
.btn-save {
  padding: 0.75rem 1.5rem;
  border: 2px solid #5c3a21;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-cancel {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(244, 232, 208, 0.4) 100%);
  color: #5c3a21;
  border-color: #8b4513;
}

.btn-cancel:hover {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(244, 232, 208, 0.6) 100%);
  transform: translateY(-1px);
}

.btn-save {
  background: linear-gradient(180deg, #8b4513 0%, #6b3410 100%);
  color: #f4e8d0;
}

.btn-save:hover {
  background: linear-gradient(180deg, #9d5520 0%, #7b4415 100%);
  transform: translateY(-1px);
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
</style>

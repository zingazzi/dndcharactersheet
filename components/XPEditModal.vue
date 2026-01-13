<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Manage Experience Points</h2>
        <button @click="close" class="close-btn">×</button>
      </div>
      <div class="modal-body">
        <!-- XP Status Section -->
        <div class="xp-status-section">
          <h3 class="section-title">Current Status</h3>
          <div class="xp-display-grid">
            <div class="xp-stat-card">
              <label>Current XP</label>
              <div class="xp-value primary">{{ character.experiencePoints.current.toLocaleString() }}</div>
            </div>
            <div class="xp-stat-card">
              <label>XP for Next Level</label>
              <div class="xp-value">{{ character.experiencePoints.nextLevel.toLocaleString() }}</div>
            </div>
            <div class="xp-stat-card total-card">
              <label>XP Remaining</label>
              <div class="xp-value total">
                {{ xpRemaining.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>

        <!-- XP Actions Section -->
        <div class="xp-actions-section">
          <h3 class="section-title">Manage Experience Points</h3>
          
          <div class="actions-grid">
            <div class="action-card">
              <div class="action-header">
                <h4>Add XP</h4>
                <span class="action-description">Gain experience</span>
              </div>
              <div class="input-group">
                <input
                  v-model.number="addAmount"
                  type="number"
                  min="1"
                  class="xp-input"
                  placeholder="Amount"
                />
                <button @click="handleAddXP" class="action-btn add">+ Add</button>
              </div>
            </div>

            <div class="action-card">
              <div class="action-header">
                <h4>Remove XP</h4>
                <span class="action-description">Lose experience</span>
              </div>
              <div class="input-group">
                <input
                  v-model.number="removeAmount"
                  type="number"
                  min="1"
                  class="xp-input"
                  placeholder="Amount"
                />
                <button @click="handleRemoveXP" class="action-btn remove">- Remove</button>
              </div>
            </div>

            <div class="action-card">
              <div class="action-header">
                <h4>Set Current XP</h4>
                <span class="action-description">Set exact value</span>
              </div>
              <div class="input-group">
                <input
                  v-model.number="currentXP"
                  type="number"
                  min="0"
                  class="xp-input"
                  placeholder="Current XP"
                />
                <button @click="handleSetCurrentXP" class="action-btn max">Set</button>
              </div>
            </div>

            <div class="action-card">
              <div class="action-header">
                <h4>Set Next Level XP</h4>
                <span class="action-description">Change requirement</span>
              </div>
              <div class="input-group">
                <input
                  v-model.number="nextLevelXP"
                  type="number"
                  min="1"
                  class="xp-input"
                  placeholder="Next Level XP"
                />
                <button @click="handleSetNextLevelXP" class="action-btn max">Set</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="btn-close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { character, addXP, removeXP, setCurrentXP, setNextLevelXP } = useCharacter()

const addAmount = ref(100)
const removeAmount = ref(100)
const currentXP = ref(character.value.experiencePoints.current)
const nextLevelXP = ref(character.value.experiencePoints.nextLevel)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    currentXP.value = character.value.experiencePoints.current
    nextLevelXP.value = character.value.experiencePoints.nextLevel
  }
})

const xpRemaining = computed(() => {
  const remaining = character.value.experiencePoints.nextLevel - character.value.experiencePoints.current
  return Math.max(0, remaining)
})

const handleAddXP = () => {
  if (addAmount.value && addAmount.value > 0) {
    addXP(addAmount.value)
    addAmount.value = 100
  }
}

const handleRemoveXP = () => {
  if (removeAmount.value && removeAmount.value > 0) {
    removeXP(removeAmount.value)
    removeAmount.value = 100
  }
}

const handleSetCurrentXP = () => {
  if (currentXP.value !== null && currentXP.value >= 0) {
    setCurrentXP(currentXP.value)
  }
}

const handleSetNextLevelXP = () => {
  if (nextLevelXP.value && nextLevelXP.value > 0) {
    setNextLevelXP(nextLevelXP.value)
  }
}

const close = () => {
  emit('close')
}
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
  backdrop-filter: blur(2px);
}

.modal-content {
  background: linear-gradient(180deg, #f4e8d0 0%, #e8d4b8 100%);
  border: 4px double #8b4513;
  border-radius: 8px;
  box-shadow: 
    0 0 0 2px #d4a574,
    0 8px 32px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #8b4513;
  background: linear-gradient(180deg, rgba(139, 69, 19, 0.1) 0%, transparent 100%);
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
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #8b4513;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(139, 69, 19, 0.2);
  transform: scale(1.1);
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #5c3a21;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #8b4513;
  padding-bottom: 0.5rem;
}

/* XP Status Section */
.xp-status-section {
  padding: 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(244, 232, 208, 0.3) 100%);
  border: 3px double #8b4513;
  border-radius: 8px;
  box-shadow: 
    0 0 0 1px #d4a574,
    inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.xp-display-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.xp-stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid #8b4513;
  border-radius: 6px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.xp-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.15);
}

.xp-stat-card.total-card {
  grid-column: 1 / -1;
  background: linear-gradient(180deg, rgba(139, 69, 19, 0.15) 0%, rgba(139, 69, 19, 0.25) 100%);
  border-width: 3px;
}

.xp-stat-card label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #5c3a21;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.xp-value {
  font-size: 1.8rem;
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  color: #2c1810;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #8b4513;
  border-radius: 4px;
  min-width: 100px;
  text-align: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.xp-value.primary {
  background: linear-gradient(180deg, rgba(46, 125, 50, 0.2) 0%, rgba(46, 125, 50, 0.1) 100%);
  border-color: #2e7d32;
  color: #1b5e20;
}

.xp-value.total {
  color: #8b4513;
  font-size: 2rem;
  background: linear-gradient(180deg, rgba(139, 69, 19, 0.3) 0%, rgba(139, 69, 19, 0.4) 100%);
  border-width: 3px;
  border-color: #6b3410;
  font-weight: 700;
}

/* XP Actions Section */
.xp-actions-section {
  padding: 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(244, 232, 208, 0.2) 100%);
  border: 2px solid #8b4513;
  border-radius: 8px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.action-card {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid #8b4513;
  border-radius: 6px;
  box-shadow: 
    0 0 0 1px #d4a574,
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: all 0.2s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 0 0 1px #d4a574,
    0 4px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.action-header {
  margin-bottom: 1rem;
}

.action-header h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #5c3a21;
}

.action-description {
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.xp-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #8b4513;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  color: #2c1810;
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  text-align: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.xp-input:focus {
  outline: none;
  border-color: #6b3410;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 0 0 3px rgba(139, 69, 19, 0.2);
  background: rgba(255, 255, 255, 1);
}

.action-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #8b4513;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  color: #f4e8d0;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.action-btn.add {
  background: linear-gradient(180deg, #2d5016 0%, #1f350f 100%);
}

.action-btn.add:hover {
  background: linear-gradient(180deg, #3a6b1e 0%, #2a4d14 100%);
  transform: translateY(-1px);
}

.action-btn.remove {
  background: linear-gradient(180deg, #8b1a1a 0%, #6b1414 100%);
}

.action-btn.remove:hover {
  background: linear-gradient(180deg, #a02020 0%, #7b1a1a 100%);
  transform: translateY(-1px);
}

.action-btn.max {
  background: linear-gradient(180deg, #8b4513 0%, #6b3410 100%);
}

.action-btn.max:hover {
  background: linear-gradient(180deg, #9d5520 0%, #7b4415 100%);
  transform: translateY(-1px);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 2px solid #8b4513;
  background: linear-gradient(180deg, transparent 0%, rgba(139, 69, 19, 0.1) 100%);
}

.btn-close {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(180deg, #8b4513 0%, #6b3410 100%);
  color: #f4e8d0;
  border: 2px solid #5c3a21;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-close:hover {
  background: linear-gradient(180deg, #9d5520 0%, #7b4415 100%);
  transform: translateY(-1px);
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
</style>

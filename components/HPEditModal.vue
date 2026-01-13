<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Manage Hit Points</h2>
        <button @click="close" class="close-btn">×</button>
      </div>
      <div class="modal-body">
        <!-- HP Status Section -->
        <div class="hp-status-section">
          <h3 class="section-title">Current Status</h3>
          <div class="hp-display-grid">
            <div class="hp-stat-card">
              <label>Current HP</label>
              <div class="hp-value primary">{{ character.hitPoints.current }}</div>
            </div>
            <div class="hp-stat-card">
              <label>Maximum HP</label>
              <div class="hp-value">{{ character.hitPoints.maximum }}</div>
            </div>
            <div class="hp-stat-card" v-if="character.hitPoints.temporary && character.hitPoints.temporary > 0">
              <label>Temporary HP</label>
              <div class="hp-value temp">{{ character.hitPoints.temporary }}</div>
            </div>
            <div class="hp-stat-card total-card">
              <label>Total HP</label>
              <div class="hp-value total">
                {{ totalHP }}
              </div>
            </div>
          </div>
        </div>

        <!-- HP Actions Section -->
        <div class="hp-actions-section">
          <h3 class="section-title">Manage Hit Points</h3>
          
          <div class="actions-grid">
            <div class="action-card">
              <div class="action-header">
                <h4>Add HP</h4>
                <span class="action-description">Restore hit points</span>
              </div>
              <div class="input-group">
                <input
                  v-model.number="addAmount"
                  type="number"
                  min="1"
                  class="hp-input"
                  placeholder="Amount"
                />
                <button @click="handleAddHP" class="action-btn add">+ Add</button>
              </div>
            </div>

            <div class="action-card">
              <div class="action-header">
                <h4>Remove HP</h4>
                <span class="action-description">Take damage</span>
              </div>
              <div class="input-group">
                <input
                  v-model.number="removeAmount"
                  type="number"
                  min="1"
                  class="hp-input"
                  placeholder="Amount"
                />
                <button @click="handleRemoveHP" class="action-btn remove">- Remove</button>
              </div>
            </div>

            <div class="action-card">
              <div class="action-header">
                <h4>Temporary HP</h4>
                <span class="action-description">Add temporary hit points</span>
              </div>
              <div class="input-group">
                <input
                  v-model.number="tempAmount"
                  type="number"
                  min="1"
                  class="hp-input"
                  placeholder="Amount"
                />
                <button @click="handleAddTempHP" class="action-btn temp">+ Add Temp</button>
              </div>
            </div>

            <div class="action-card">
              <div class="action-header">
                <h4>Set Maximum</h4>
                <span class="action-description">Change max HP</span>
              </div>
              <div class="input-group">
                <input
                  v-model.number="maxHP"
                  type="number"
                  min="1"
                  class="hp-input"
                  placeholder="Maximum"
                />
                <button @click="handleSetMaxHP" class="action-btn max">Set Max</button>
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

const { character, addHP, removeHP, addTemporaryHP, setMaximumHP } = useCharacter()

const addAmount = ref(1)
const removeAmount = ref(1)
const tempAmount = ref(1)
const maxHP = ref(character.value.hitPoints.maximum)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    maxHP.value = character.value.hitPoints.maximum
  }
})

const totalHP = computed(() => {
  const current = character.value.hitPoints.current
  const temp = character.value.hitPoints.temporary || 0
  return current + temp
})

const handleAddHP = () => {
  if (addAmount.value && addAmount.value > 0) {
    addHP(addAmount.value)
    addAmount.value = 1
  }
}

const handleRemoveHP = () => {
  if (removeAmount.value && removeAmount.value > 0) {
    removeHP(removeAmount.value)
    removeAmount.value = 1
  }
}

const handleAddTempHP = () => {
  if (tempAmount.value && tempAmount.value > 0) {
    addTemporaryHP(tempAmount.value)
    tempAmount.value = 1
  }
}

const handleSetMaxHP = () => {
  if (maxHP.value && maxHP.value > 0) {
    setMaximumHP(maxHP.value)
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

/* HP Status Section */
.hp-status-section {
  padding: 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(244, 232, 208, 0.3) 100%);
  border: 3px double #8b4513;
  border-radius: 8px;
  box-shadow: 
    0 0 0 1px #d4a574,
    inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hp-display-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.hp-stat-card {
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

.hp-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.15);
}

.hp-stat-card.total-card {
  grid-column: 1 / -1;
  background: linear-gradient(180deg, rgba(139, 69, 19, 0.15) 0%, rgba(139, 69, 19, 0.25) 100%);
  border-width: 3px;
}

.hp-stat-card label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #5c3a21;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hp-value {
  font-size: 2rem;
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  color: #2c1810;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #8b4513;
  border-radius: 6px;
  min-width: 100px;
  text-align: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hp-value.primary {
  background: linear-gradient(180deg, rgba(46, 125, 50, 0.2) 0%, rgba(46, 125, 50, 0.1) 100%);
  border-color: #2e7d32;
  color: #1b5e20;
}

.hp-value.temp {
  color: #6b3410;
  border-color: #9d5520;
  background: linear-gradient(180deg, rgba(139, 69, 19, 0.2) 0%, rgba(139, 69, 19, 0.1) 100%);
}

.hp-value.total {
  color: #8b4513;
  font-size: 2.5rem;
  background: linear-gradient(180deg, rgba(139, 69, 19, 0.3) 0%, rgba(139, 69, 19, 0.4) 100%);
  border-width: 3px;
  border-color: #6b3410;
  font-weight: 700;
}

/* HP Actions Section */
.hp-actions-section {
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

.hp-input {
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

.hp-input:focus {
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

.action-btn.temp {
  background: linear-gradient(180deg, #6b3410 0%, #4d2508 100%);
}

.action-btn.temp:hover {
  background: linear-gradient(180deg, #7b4415 0%, #5d2f0a 100%);
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

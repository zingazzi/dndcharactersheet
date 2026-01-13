<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Create New Character</h2>
        <button @click="close" class="close-btn">×</button>
      </div>
      <div class="modal-body">
        <!-- Step 1: Class Selection -->
        <div class="step-section">
          <h3 class="step-title">Step 1: Choose Your Class</h3>
          <div class="class-selection">
            <label class="class-option">
              <input
                v-model="selectedClass"
                type="radio"
                value="Fighter"
                class="class-radio"
              />
              <div class="class-card">
                <div class="class-name">Fighter</div>
                <div class="class-description">
                  A master of martial combat, skilled with a variety of weapons and armor.
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 2: Skill Selection (for Fighter) -->
        <div v-if="selectedClass === 'Fighter'" class="step-section">
          <h3 class="step-title">Step 2: Choose Skill Proficiencies</h3>
          <p class="step-description">Select 2 skills from the following list:</p>
          <div class="skills-grid">
            <label
              v-for="skill in fighterSkills"
              :key="skill"
              class="skill-option"
              :class="{ 'selected': selectedSkills.includes(skill) }"
            >
              <input
                type="checkbox"
                :value="skill"
                :checked="selectedSkills.includes(skill)"
                @change="toggleSkill(skill)"
                :disabled="!selectedSkills.includes(skill) && selectedSkills.length >= 2"
                class="skill-checkbox"
              />
              <span class="skill-name">{{ skill }}</span>
            </label>
          </div>
          <div class="selection-feedback">
            <span v-if="selectedSkills.length < 2" class="feedback-text">
              Select {{ 2 - selectedSkills.length }} more skill{{ 2 - selectedSkills.length === 1 ? '' : 's' }}
            </span>
            <span v-else class="feedback-text success">
              ✓ 2 skills selected
            </span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="btn-cancel">Cancel</button>
        <button
          @click="createCharacter"
          class="btn-create"
          :disabled="!canCreate"
        >
          Create Character
        </button>
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
  create: [characterClass: string, selectedSkills: string[]]
}>()

const selectedClass = ref('Fighter')
const selectedSkills = ref<string[]>([])

const fighterSkills = [
  'Acrobatics',
  'Animal Handling',
  'Athletics',
  'History',
  'Insight',
  'Intimidation',
  'Persuasion',
  'Perception',
  'Survival',
]

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    selectedClass.value = 'Fighter'
    selectedSkills.value = []
  }
})

const toggleSkill = (skill: string) => {
  const index = selectedSkills.value.indexOf(skill)
  if (index > -1) {
    selectedSkills.value.splice(index, 1)
  } else if (selectedSkills.value.length < 2) {
    selectedSkills.value.push(skill)
  }
}

const canCreate = computed(() => {
  return selectedClass.value === 'Fighter' && selectedSkills.value.length === 2
})

const close = () => {
  emit('close')
}

const createCharacter = () => {
  if (canCreate.value) {
    emit('create', selectedClass.value, selectedSkills.value)
  }
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
}

.step-section {
  margin-bottom: 2rem;
}

.step-section:last-child {
  margin-bottom: 0;
}

.step-title {
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

.step-description {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: #5c3a21;
  font-style: italic;
}

.class-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.class-option {
  display: block;
  cursor: pointer;
}

.class-radio {
  display: none;
}

.class-card {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid #8b4513;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-shadow: 
    0 0 0 1px #d4a574,
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.class-option:hover .class-card {
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
  box-shadow: 
    0 0 0 1px #d4a574,
    0 4px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.class-radio:checked + .class-card {
  background: linear-gradient(180deg, rgba(46, 125, 50, 0.2) 0%, rgba(255, 255, 255, 0.5) 100%);
  border-color: #2e7d32;
  border-width: 3px;
}

.class-name {
  font-size: 1.3rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #2c1810;
  margin-bottom: 0.5rem;
}

.class-description {
  font-size: 0.95rem;
  color: #5c3a21;
  line-height: 1.5;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.skill-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.4);
  border: 2px solid #8b4513;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-option:hover:not(.selected) {
  background: rgba(255, 255, 255, 0.6);
  border-color: #6b3410;
}

.skill-option.selected {
  background: linear-gradient(180deg, rgba(46, 125, 50, 0.2) 0%, rgba(255, 255, 255, 0.4) 100%);
  border-color: #2e7d32;
  border-width: 3px;
}

.skill-option:has(input:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

.skill-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #2e7d32;
}

.skill-checkbox:disabled {
  cursor: not-allowed;
}

.skill-name {
  font-family: 'Cinzel', serif;
  font-size: 0.95rem;
  color: #2c1810;
  font-weight: 500;
}

.selection-feedback {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.4);
  border: 2px solid #8b4513;
  border-radius: 4px;
  text-align: center;
}

.feedback-text {
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  color: #5c3a21;
}

.feedback-text.success {
  color: #2e7d32;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 2px solid #8b4513;
  background: linear-gradient(180deg, transparent 0%, rgba(139, 69, 19, 0.1) 100%);
}

.btn-cancel,
.btn-create {
  padding: 0.75rem 1.5rem;
  border: 2px solid #8b4513;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.6);
  color: #5c3a21;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

.btn-create {
  background: linear-gradient(180deg, #8b4513 0%, #6b3410 100%);
  color: #f4e8d0;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-create:hover:not(:disabled) {
  background: linear-gradient(180deg, #9d5520 0%, #7b4415 100%);
  transform: translateY(-1px);
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.btn-create:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>

<template>
  <div class="skills-section">
    <h3>Skills</h3>
    <div class="skills-list">
      <div
        v-for="skill in character.skills"
        :key="skill.name"
        class="skill-item"
      >
        <label class="skill-checkbox">
          <input
            type="checkbox"
            :checked="skill.proficient"
            @change="updateSkillProficiency(skill.name, ($event.target as HTMLInputElement).checked)"
          />
          <span class="skill-name">{{ skill.name }}</span>
        </label>
        <span class="skill-modifier clickable" @click="rollSkillCheck(skill)">{{ formatModifier(skill.modifier) }}</span>
      </div>
    </div>
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
import type { Skill } from '~/types/character'

const { character, updateSkillProficiency } = useCharacter()

const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
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

const rollSkillCheck = (skill: Skill) => {
  const roll = rollD20()
  const title = `${skill.name} Check`
  showToast(title, roll, skill.modifier)
  addRoll(title, roll, skill.modifier)
}
</script>

<style scoped>
.skills-section {
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

.skills-section h3 {
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

.skills-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #d4a574;
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(244, 232, 208, 0.3) 100%);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.skill-item:hover {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(244, 232, 208, 0.5) 100%);
  border-color: #8b4513;
}

.skill-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  flex: 1;
}

.skill-checkbox input[type="checkbox"] {
  cursor: pointer;
}

.skill-name {
  font-size: 0.9rem;
  font-family: 'Cinzel', serif;
  letter-spacing: 0.02em;
}

.skill-modifier {
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  min-width: 40px;
  text-align: right;
  color: #333;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.clickable {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.clickable:hover {
  background: rgba(212, 165, 116, 0.3);
}
</style>

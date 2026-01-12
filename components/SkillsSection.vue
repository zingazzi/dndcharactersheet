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
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.skills-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
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
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 4px;
  background: #fafafa;
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
}

.skill-modifier {
  font-weight: bold;
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
  background: #e3f2fd;
  transform: scale(1.05);
}
</style>

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
        <span class="skill-modifier">{{ formatModifier(skill.modifier) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { character, updateSkillProficiency } = useCharacter()

const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
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
}
</style>

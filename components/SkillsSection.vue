<template>
  <div class="section">
    <h3 class="section-title mb-3">Skills</h3>
    <div class="grid grid-cols-2 gap-1.5">
      <div
        v-for="skill in character.skills"
        :key="skill.name"
        class="flex justify-between items-center p-2 border border-[var(--color-border-light)] rounded bg-[var(--color-bg-primary)] shadow-sm transition-all duration-200 hover:border-[var(--color-border-primary)]"
      >
        <label class="flex items-center gap-1.5 cursor-pointer flex-1">
          <input
            type="checkbox"
            :checked="skill.proficient"
            @change="updateSkillProficiency(skill.name, ($event.target as HTMLInputElement).checked)"
            class="cursor-pointer"
          />
          <span class="text-xs font-cinzel tracking-wide">{{ skill.name }}</span>
          <span v-if="skill.expertise" class="text-xs text-[var(--color-accent-primary)]" title="Expertise (double proficiency bonus)">★</span>
        </label>
        <span
          class="clickable-text font-bold font-medieval min-w-[35px] text-right text-[var(--color-text-primary)]"
          @click="rollSkillCheck(skill)"
        >
          {{ formatModifier(skill.modifier) }}
        </span>
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

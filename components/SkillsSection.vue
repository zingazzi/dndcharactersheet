<template>
  <div class="p-6 border-2 border-brown rounded-md mb-6 bg-white/40 shadow-[0_0_0_1px_#d4a574,0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]">
    <h3 class="m-0 mb-4 text-xl font-cinzel font-semibold text-text-brown border-b-2 border-brown pb-2 text-shadow-dnd tracking-wide uppercase">Skills</h3>
    <div class="grid grid-cols-2 gap-2">
      <div
        v-for="skill in character.skills"
        :key="skill.name"
        class="flex justify-between items-center p-3 border border-gold rounded bg-gradient-to-b from-white/50 to-parchment/30 shadow-dnd-inner transition-all duration-200 hover:from-white/70 hover:to-parchment/50 hover:border-brown"
      >
        <label class="flex items-center gap-2 cursor-pointer flex-1">
          <input
            type="checkbox"
            :checked="skill.proficient"
            @change="updateSkillProficiency(skill.name, ($event.target as HTMLInputElement).checked)"
            class="cursor-pointer"
          />
          <span class="text-sm font-cinzel tracking-wide">{{ skill.name }}</span>
        </label>
        <span
          class="font-bold font-medieval min-w-[40px] text-right text-gray-800 cursor-pointer select-none transition-colors duration-200 px-2 py-1 rounded hover:bg-gold/30"
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

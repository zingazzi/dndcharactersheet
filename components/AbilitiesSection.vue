<template>
  <div class="p-6 border-2 border-brown rounded-md mb-6 bg-white/40 shadow-[0_0_0_1px_#d4a574,0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]">
    <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
      <h3 class="m-0 text-xl font-cinzel font-semibold text-text-brown text-shadow-dnd tracking-wide uppercase">Abilities & Saves</h3>
      <button
        @click="openEditModal"
        class="px-5 py-2 bg-gradient-to-b from-brown to-brown-dark text-parchment border-2 border-brown-border rounded cursor-pointer text-sm font-semibold shadow-dnd transition-all duration-200 hover:from-brown-light hover:to-brown hover:-translate-y-0.5 hover:shadow-dnd-lg"
      >
        Edit
      </button>
    </div>
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div
        v-for="(ability, key) in character.abilities"
        :key="key"
        class="flex flex-col items-center p-4 border-2 border-brown rounded-md bg-gradient-to-b from-white/60 to-parchment/40 shadow-[0_0_0_1px_#d4a574,0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_#d4a574,0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.4)]"
      >
        <div class="text-sm font-semibold font-cinzel mb-1 tracking-wide">{{ getAbilityName(key) }}</div>
        <div class="text-xs text-gray-600 mb-2">{{ getAbilityAbbrev(key) }}</div>
        <div class="mb-2">
          <span class="text-2xl font-bold font-medieval text-gray-800">{{ finalScore(key) }}</span>
        </div>
        <div
          class="text-lg font-bold font-medieval text-gray-800 mb-2 cursor-pointer select-none transition-colors duration-200 px-2 py-1 rounded hover:bg-gold/30"
          @click="rollAbilityCheck(key)"
        >
          {{ formatModifier(ability.modifier) }}
        </div>
        <div class="flex items-center gap-2 text-sm">
          <label class="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              :checked="ability.saveProficient"
              @change="updateSaveProficiency(key, ($event.target as HTMLInputElement).checked)"
            />
            <span>Save</span>
          </label>
          <span
            class="font-bold font-medieval text-gray-700 cursor-pointer select-none transition-colors duration-200 px-2 py-1 rounded hover:bg-gold/30"
            @click="rollSavingThrow(key)"
          >
            {{ formatModifier(ability.saveModifier) }}
          </span>
        </div>
      </div>
    </div>
    <div class="mt-4 pt-4 border-t-2 border-brown">
      <h4 class="m-0 mb-3 text-lg font-cinzel font-semibold text-text-brown text-shadow-dnd tracking-wide">Senses</h4>
      <div class="grid grid-cols-3 gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-semibold text-gray-600">Passive Perception</label>
          <div class="text-lg font-bold text-text-dark p-2 bg-gradient-to-b from-white/60 to-parchment/40 border-2 border-brown rounded text-center shadow-dnd-inner">
            {{ calculatePassivePerception() }}
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-semibold text-gray-600">Passive Investigation</label>
          <div class="text-lg font-bold text-text-dark p-2 bg-gradient-to-b from-white/60 to-parchment/40 border-2 border-brown rounded text-center shadow-dnd-inner">
            {{ calculatePassiveInvestigation() }}
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-semibold text-gray-600">Passive Insight</label>
          <div class="text-lg font-bold text-text-dark p-2 bg-gradient-to-b from-white/60 to-parchment/40 border-2 border-brown rounded text-center shadow-dnd-inner">
            {{ calculatePassiveInsight() }}
          </div>
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

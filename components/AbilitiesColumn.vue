<template>
  <div class="flex flex-col gap-2">
    <!-- Ability Scores - Large Vertical Stack -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Abilities</h3>
        <button @click="openEditModal" class="btn btn-primary text-sm px-2 py-1">Edit</button>
      </div>
      <div class="flex flex-col gap-1.5">
        <div
          v-for="(ability, key) in character.abilities"
          :key="key"
          class="card-compact flex items-center gap-2"
        >
          <div class="flex flex-col items-center justify-center min-w-[60px]">
            <div class="text-3xl font-bold font-medieval text-[var(--color-text-primary)]">{{ finalScore(key) }}</div>
            <div class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase">{{ getAbilityAbbrev(key) }}</div>
          </div>
          <div class="flex-1">
            <div class="text-sm font-semibold font-cinzel text-[var(--color-text-secondary)] mb-0.5">{{ getAbilityName(key) }}</div>
            <div class="flex items-center gap-2">
              <span
                class="clickable-text text-base font-bold font-medieval text-[var(--color-text-primary)]"
                @click="rollAbilityCheck(key)"
              >
                {{ formatModifier(ability.modifier) }}
              </span>
              <label class="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  :checked="ability.saveProficient"
                  @change="updateSaveProficiency(key, ($event.target as HTMLInputElement).checked)"
                  class="w-4 h-4"
                />
                <span class="text-[var(--color-text-tertiary)]">Save</span>
              </label>
              <span
                class="clickable-text text-sm font-bold font-medieval text-[var(--color-text-secondary)]"
                @click="rollSavingThrow(key)"
              >
                {{ formatModifier(ability.saveModifier) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Inspiration & Proficiency -->
    <div class="section">
      <div class="flex items-center gap-2 mb-1.5">
        <label class="flex items-center gap-1.5 text-sm cursor-pointer">
          <input type="checkbox" class="w-4 h-4" />
          <span class="font-semibold text-[var(--color-text-secondary)]">Inspiration</span>
        </label>
        <div class="flex-1"></div>
        <div class="text-sm">
          <span class="font-semibold text-[var(--color-text-secondary)]">Proficiency:</span>
          <span class="font-bold text-[var(--color-text-primary)] ml-1">{{ formatModifier(character.proficiencyBonus) }}</span>
        </div>
      </div>
    </div>

    <!-- Saving Throws -->
    <div class="section">
      <h3 class="section-title mb-1.5">Saving Throws</h3>
      <div class="flex flex-col gap-1">
        <div
          v-for="(ability, key) in character.abilities"
          :key="key"
          class="flex items-center justify-between text-sm"
        >
          <label class="flex items-center gap-1.5 cursor-pointer flex-1">
            <input
              type="checkbox"
              :checked="ability.saveProficient"
              @change="updateSaveProficiency(key, ($event.target as HTMLInputElement).checked)"
              class="w-4 h-4"
            />
            <span class="text-[var(--color-text-secondary)]">{{ getAbilityAbbrev(key) }}</span>
          </label>
          <span
            class="clickable-text font-bold font-medieval text-[var(--color-text-primary)] min-w-[35px] text-right"
            @click="rollSavingThrow(key)"
          >
            {{ formatModifier(ability.saveModifier) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Passive Senses -->
    <div class="section">
      <h3 class="section-title mb-1.5">Passive Perception</h3>
      <div class="text-center">
        <div class="text-2xl font-bold font-medieval text-[var(--color-text-primary)]">{{ calculatePassivePerception() }}</div>
      </div>
      <div class="mt-1.5 pt-1.5 border-t border-[var(--color-border-divider)] grid grid-cols-2 gap-1 text-sm">
        <div>
          <span class="text-[var(--color-text-tertiary)]">Investigation:</span>
          <span class="font-bold text-[var(--color-text-primary)] ml-1">{{ calculatePassiveInvestigation() }}</span>
        </div>
        <div>
          <span class="text-[var(--color-text-tertiary)]">Insight:</span>
          <span class="font-bold text-[var(--color-text-primary)] ml-1">{{ calculatePassiveInsight() }}</span>
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

const { character, updateSaveProficiency, setAbilityScores, updateCustomModifier, updateAbilityScore } = useCharacter()
const { addRoll } = useDiceHistory()

const isEditModalOpen = ref(false)

const openEditModal = () => {
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const handleSaveAbilities = (newAbilities: Character['abilities']) => {
  Object.keys(newAbilities).forEach(key => {
    const abilityKey = key as keyof Character['abilities']
    const newAbility = newAbilities[abilityKey]
    const oldAbility = character.value.abilities[abilityKey]
    
    if (newAbility.score !== oldAbility.score) {
      setAbilityScores({ [abilityKey]: newAbility.score })
    }
    
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

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="m-0 text-base font-cinzel font-semibold text-[var(--color-text-secondary)]">Level Up</h2>
        <button
          @click="close"
          class="bg-transparent border-none text-xl text-[var(--color-accent-primary)] cursor-pointer w-6 h-6 flex items-center justify-center rounded transition-all duration-200 hover:bg-[var(--color-accent-primary)]/20 leading-none"
        >
          ×
        </button>
      </div>

      <div class="modal-body">
        <div class="card-compact mb-2">
          <div class="text-xs text-[var(--color-text-secondary)]">
            <span class="font-semibold">Current:</span> Level {{ currentLevel }}
            <span class="text-[var(--color-text-tertiary)] font-bold">→</span>
            <span class="font-semibold">Next:</span> Level {{ nextLevel }}
          </div>
          <div class="text-xs text-[var(--color-text-tertiary)] italic">
            Available when XP {{ character.experiencePoints.current.toLocaleString() }} ≥ {{ getXpForLevel(nextLevel).toLocaleString() }}.
          </div>
        </div>

        <div class="mb-2">
          <label class="block mb-1 text-xs font-semibold text-[var(--color-text-secondary)] font-cinzel">Class</label>
          <select v-model="selectedClass" class="input text-sm">
            <option v-for="cls in availableClasses" :key="cls" :value="cls">{{ cls }}</option>
          </select>
        </div>

        <div class="mb-2">
          <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 pb-1 border-b border-[var(--color-border-divider)]">Hit Points</h3>

          <div class="text-xs text-[var(--color-text-tertiary)] italic mb-1">
            Choose average or roll for your hit die, then add your CON modifier.
          </div>

          <div class="flex flex-wrap items-center gap-2 mb-1">
            <label class="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] cursor-pointer">
              <input v-model="hpMethod" type="radio" value="average" />
              Average ({{ averageGain }})
            </label>
            <label class="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] cursor-pointer">
              <input v-model="hpMethod" type="radio" value="roll" />
              Roll d{{ hitDie }}
            </label>
          </div>

          <div v-if="hpMethod === 'roll'" class="grid grid-cols-[1fr_auto] gap-1 mb-1">
            <input
              v-model.number="manualRoll"
              type="number"
              :min="1"
              :max="hitDie"
              class="input text-sm py-1 px-1.5"
              placeholder="Rolled value"
            />
            <button @click="rollNow" class="btn btn-secondary text-xs px-2 py-1">Roll</button>
          </div>

          <div class="text-xs text-[var(--color-text-secondary)] mb-1">
            <span class="font-semibold">Preview:</span>
            +{{ previewHpGain }} HP (base {{ baseGainPreview }} + CON {{ conModifier >= 0 ? `+${conModifier}` : conModifier }})
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="close" class="btn btn-secondary text-sm">Cancel</button>
        <button @click="applyLevelUp" class="btn btn-primary text-sm" :disabled="!canApply">
          Apply Level {{ nextLevel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computeHpGainOnLevelUp, getAllClassTypes, getAverageHpGainOnLevelUp, getHitDie, type ClassType } from '~/composables/classProgression'
import { canLevelUpWithXp, getXpForLevel } from '~/composables/xpProgression'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { character, levelUpToNext } = useCharacter()

const currentLevel = computed(() => character.value.level || 1)
const nextLevel = computed(() => currentLevel.value + 1)

const availableClasses = computed<readonly ClassType[]>(() => {
  return character.value.classType ? [character.value.classType] : getAllClassTypes()
})

const selectedClass = ref<ClassType | null>(character.value.classType ?? null)
const hpMethod = ref<'average' | 'roll'>('average')
const manualRoll = ref<number | null>(null)

watch(() => props.isOpen, (open) => {
  if (!open) return
  const preferred = character.value.classType ?? null
  selectedClass.value = preferred ?? (availableClasses.value[0] ?? null)
  hpMethod.value = 'average'
  manualRoll.value = null
})

const hitDie = computed(() => selectedClass.value ? getHitDie(selectedClass.value) : 8)
const averageGain = computed(() => selectedClass.value ? getAverageHpGainOnLevelUp(selectedClass.value) : 0)
const conModifier = computed(() => character.value.abilities.constitution.modifier)

const baseGainPreview = computed(() => {
  if (hpMethod.value === 'average') return averageGain.value
  return manualRoll.value ?? 0
})

const previewHpGain = computed(() => {
  if (!selectedClass.value) return 0
  return computeHpGainOnLevelUp(selectedClass.value, conModifier.value, {
    method: hpMethod.value,
    roll: hpMethod.value === 'roll' ? (manualRoll.value ?? undefined) : undefined,
  })
})

const hasEnoughXp = computed(() => {
  const level = currentLevel.value
  return canLevelUpWithXp(level, character.value.experiencePoints.current)
})

const canApply = computed(() => {
  if (!hasEnoughXp.value) return false
  if (!selectedClass.value) return false
  if (hpMethod.value === 'average') return true
  if (manualRoll.value === null) return false
  return manualRoll.value >= 1 && manualRoll.value <= hitDie.value
})

const rollNow = (): void => {
  manualRoll.value = Math.floor(Math.random() * hitDie.value) + 1
}

const applyLevelUp = (): void => {
  if (!canApply.value) return
  if (hpMethod.value === 'average') {
    levelUpToNext({ method: 'average' })
    close()
    return
  }
  levelUpToNext({ method: 'roll', roll: manualRoll.value ?? undefined })
  close()
}

const close = (): void => {
  emit('close')
}
</script>


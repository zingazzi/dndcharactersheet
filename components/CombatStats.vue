<template>
  <div class="section">
    <h3 class="section-title mb-1.5">Combat</h3>
    <div class="grid grid-cols-3 gap-1.5">
      <!-- AC -->
      <div class="card-compact text-center">
        <div class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-0.5">AC</div>
        <div class="text-xl font-bold font-medieval text-[var(--color-text-primary)]">{{ character.ac }}</div>
      </div>

      <!-- Initiative -->
      <div
        class="clickable-card card-compact text-center"
        @click="rollInitiative"
        title="Click to roll initiative"
      >
        <div class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-0.5">Initiative</div>
        <div class="text-xl font-bold font-medieval text-[var(--color-text-primary)]">{{ formatModifier(character.initiative) }}</div>
      </div>

      <!-- Speed -->
      <div class="card-compact text-center">
        <div class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase mb-0.5">Speed</div>
        <div class="text-xl font-bold font-medieval text-[var(--color-text-primary)]">30</div>
      </div>
    </div>
    <Toast
      :is-visible="isToastVisible"
      :title="toast.title"
      :roll="toast.roll"
      :modifier="toast.modifier"
      :total="toast.total"
      @close="closeToast"
    />
  </div>
</template>

<script setup lang="ts">
const { character } = useCharacter()
const { addRoll } = useDiceHistory()

const isToastVisible = ref(false)
const toast = ref({
  title: '',
  roll: 0,
  modifier: 0,
  total: 0,
})

const formatModifier = (value: number): string => {
  return value >= 0 ? `+${value}` : `${value}`
}

const rollD20 = (): number => {
  return Math.floor(Math.random() * 20) + 1
}

const rollInitiative = () => {
  const roll = rollD20()
  const modifier = character.value.initiative
  const total = roll + modifier
  const title = 'Initiative Roll'
  
  toast.value = {
    title,
    roll,
    modifier,
    total,
  }
  
  isToastVisible.value = true
  addRoll(title, roll, modifier)
  
  setTimeout(() => {
    isToastVisible.value = false
  }, 3000)
}

const closeToast = () => {
  isToastVisible.value = false
}
</script>

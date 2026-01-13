<template>
  <div class="section">
    <h3 class="section-title mb-1.5">Death Saves</h3>
    <div class="flex flex-col gap-1.5">
      <div>
        <div class="text-sm text-[var(--color-text-tertiary)] mb-1">Successes</div>
        <div class="flex gap-1">
          <div
            v-for="i in 3"
            :key="`success-${i}`"
            class="w-6 h-6 rounded-full border-2 border-[var(--color-border-primary)] cursor-pointer transition-colors"
            :class="deathSaves.successes >= i ? 'bg-[var(--color-success)] border-[var(--color-success-dark)]' : 'bg-[var(--color-bg-primary)]'"
            @click="toggleDeathSave('successes', i)"
          ></div>
        </div>
      </div>
      <div>
        <div class="text-sm text-[var(--color-text-tertiary)] mb-1">Failures</div>
        <div class="flex gap-1">
          <div
            v-for="i in 3"
            :key="`failure-${i}`"
            class="w-6 h-6 rounded-full border-2 border-[var(--color-border-primary)] cursor-pointer transition-colors"
            :class="deathSaves.failures >= i ? 'bg-[var(--color-danger)] border-[var(--color-danger-dark)]' : 'bg-[var(--color-bg-primary)]'"
            @click="toggleDeathSave('failures', i)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const deathSaves = ref({
  successes: 0,
  failures: 0,
})

const toggleDeathSave = (type: 'successes' | 'failures', index: number) => {
  if (type === 'successes') {
    if (deathSaves.value.successes === index) {
      deathSaves.value.successes = index - 1
    } else {
      deathSaves.value.successes = index
    }
    // Reset failures if successes change
    if (deathSaves.value.successes === 3) {
      deathSaves.value.failures = 0
    }
  } else {
    if (deathSaves.value.failures === index) {
      deathSaves.value.failures = index - 1
    } else {
      deathSaves.value.failures = index
    }
    // Reset successes if failures change
    if (deathSaves.value.failures === 3) {
      deathSaves.value.successes = 0
    }
  }
}
</script>

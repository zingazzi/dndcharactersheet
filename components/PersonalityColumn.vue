<template>
  <div class="flex flex-col gap-2">
    <!-- Skills -->
    <div class="section">
      <h3 class="section-title mb-1.5">Skills</h3>
      <div class="flex flex-col gap-0.5">
        <div
          v-for="skill in character.skills"
          :key="skill.name"
          class="flex items-center justify-between text-sm py-0.5"
        >
          <label class="flex items-center gap-1.5 cursor-pointer flex-1">
            <input
              type="checkbox"
              :checked="skill.proficient"
              @change="updateSkillProficiency(skill.name, ($event.target as HTMLInputElement).checked)"
              class="w-4 h-4"
            />
            <span class="text-[var(--color-text-secondary)]">{{ skill.name }}</span>
          </label>
          <span
            class="clickable-text font-bold font-medieval text-[var(--color-text-primary)] min-w-[35px] text-right"
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

    <!-- Personality Traits -->
    <div class="section">
      <h3 class="section-title mb-1.5">Personality Traits</h3>
      <textarea
        v-model="character.background.personalityTraits"
        placeholder="Describe your character's personality traits..."
        rows="3"
        class="input-textarea text-sm"
      />
    </div>

    <!-- Ideals -->
    <div class="section">
      <h3 class="section-title mb-1.5">Ideals</h3>
      <textarea
        v-model="character.background.ideals"
        placeholder="What ideals drive your character?"
        rows="2"
        class="input-textarea text-sm"
      />
    </div>

    <!-- Bonds -->
    <div class="section">
      <h3 class="section-title mb-1.5">Bonds</h3>
      <textarea
        v-model="character.background.bonds"
        placeholder="What bonds connect your character to people, places, or events?"
        rows="2"
        class="input-textarea text-sm"
      />
    </div>

    <!-- Flaws -->
    <div class="section">
      <h3 class="section-title mb-1.5">Flaws</h3>
      <textarea
        v-model="character.background.flaws"
        placeholder="What flaws or weaknesses does your character have?"
        rows="2"
        class="input-textarea text-sm"
      />
    </div>

    <!-- Features & Traits -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Features & Traits</h3>
        <button
          @click="showAddForm = !showAddForm"
          class="btn btn-primary text-sm px-2 py-1"
        >
          {{ showAddForm ? 'Cancel' : '+' }}
        </button>
      </div>
      <div v-if="showAddForm" class="p-2 bg-[var(--color-bg-secondary)] rounded mb-2">
        <input
          v-model="newFeature.name"
          type="text"
          placeholder="Feature/Trait Name"
          class="input text-sm py-1 px-1.5 mb-1 w-full"
        />
        <textarea
          v-model="newFeature.description"
          placeholder="Description"
          rows="2"
          class="input-textarea text-sm mb-1"
        />
        <select
          v-model="newFeature.source"
          class="input-select text-sm py-1 px-1.5 mb-1 w-full"
        >
          <option value="">No Source</option>
          <option value="Class">Class</option>
          <option value="Race">Race</option>
          <option value="Feat">Feat</option>
          <option value="Background">Background</option>
          <option value="Other">Other</option>
        </select>
        <button @click="handleAddFeature" class="btn btn-primary text-sm px-2 py-1 w-full">Add</button>
      </div>
      <div class="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
        <div
          v-for="feature in character.featuresTraits"
          :key="feature.id"
          class="card-compact p-1.5"
        >
          <div class="flex items-start justify-between gap-1 mb-0.5">
            <div class="flex-1 min-w-0">
              <div class="text-sm font-bold">{{ feature.name }}</div>
              <div v-if="feature.source" class="text-xs text-[var(--color-text-tertiary)]">{{ feature.source }}</div>
            </div>
            <button
              @click="removeFeatureTrait(feature.id)"
              class="btn btn-danger text-sm px-1.5 py-0.5 shrink-0"
            >
              ×
            </button>
          </div>
          <div class="text-sm text-[var(--color-text-secondary)]">{{ feature.description }}</div>
        </div>
        <div v-if="character.featuresTraits.length === 0" class="text-center py-2 text-[var(--color-text-muted)] italic text-sm">
          No features
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeatureTrait, Skill } from '~/types/character'

const { character, addFeatureTrait, removeFeatureTrait, updateSkillProficiency } = useCharacter()
const { addRoll } = useDiceHistory()

const toast = ref({
  isVisible: false,
  title: '',
  roll: 0,
  modifier: 0,
  total: 0,
})

const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

const rollD20 = (): number => {
  return Math.floor(Math.random() * 20) + 1
}

const rollSkillCheck = (skill: Skill) => {
  const roll = rollD20()
  const title = `${skill.name} Check`
  showToast(title, roll, skill.modifier)
  addRoll(title, roll, skill.modifier)
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

const showAddForm = ref(false)
const newFeature = ref<Omit<FeatureTrait, 'id'>>({
  name: '',
  description: '',
  source: '',
})

const handleAddFeature = () => {
  if (newFeature.value.name.trim()) {
    addFeatureTrait(newFeature.value)
    newFeature.value = {
      name: '',
      description: '',
      source: '',
    }
    showAddForm.value = false
  }
}
</script>

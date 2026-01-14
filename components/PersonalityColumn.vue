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

    <!-- Fighting Style -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Fighting Style</h3>
        <button
          @click="showFightingStyleForm = !showFightingStyleForm"
          class="btn btn-primary text-sm px-1.5 py-0.5"
        >
          {{ showFightingStyleForm ? 'Cancel' : character.fightingStyle ? 'Edit' : 'Add' }}
        </button>
      </div>
      <div v-if="showFightingStyleForm" class="p-2 bg-[var(--color-bg-secondary)] rounded mb-2">
        <div class="flex flex-col gap-1 mb-1.5">
          <label
            v-for="style in fightingStyles"
            :key="style.name"
            class="flex items-start p-1.5 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-primary)] cursor-pointer transition-colors text-sm"
            :class="{ 'border-[var(--color-accent-primary)]': selectedFightingStyle === style.name }"
          >
            <input
              v-model="selectedFightingStyle"
              type="radio"
              :value="style.name"
              class="mt-0.5 mr-1.5 w-3 h-3"
            />
            <div class="flex-1">
              <div class="font-semibold text-[var(--color-text-primary)]">{{ style.name }}</div>
              <div class="text-xs text-[var(--color-text-tertiary)] mt-0.5">{{ style.description }}</div>
            </div>
          </label>
        </div>
        <button @click="handleUpdateFightingStyle" class="btn btn-primary text-sm px-1.5 py-0.5 w-full">Save</button>
      </div>
      <div v-else-if="character.fightingStyle" class="card-compact p-1.5">
        <div class="text-sm font-bold text-[var(--color-text-primary)]">{{ character.fightingStyle }}</div>
        <div class="text-xs text-[var(--color-text-secondary)] mt-0.5">{{ currentFightingStyleDescription }}</div>
      </div>
      <div v-else class="text-center py-2 text-[var(--color-text-muted)] italic text-sm">
        No fighting style selected
      </div>
    </div>

    <!-- Weapon Mastery -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Weapon Mastery</h3>
        <button
          @click="showWeaponMasteryForm = !showWeaponMasteryForm"
          class="btn btn-primary text-sm px-1.5 py-0.5"
        >
          {{ showWeaponMasteryForm ? 'Cancel' : 'Edit' }}
        </button>
      </div>
      <div v-if="showWeaponMasteryForm" class="p-2 bg-[var(--color-bg-secondary)] rounded mb-2">
        <p class="text-xs text-[var(--color-text-tertiary)] mb-1.5">Select weapons (you can change one after a Long Rest):</p>
        <div class="max-h-[200px] overflow-y-auto border border-[var(--color-border-primary)] rounded p-1.5 mb-1.5">
          <div class="grid grid-cols-1 gap-1">
            <label
              v-for="weapon in weaponMasteryWeapons"
              :key="weapon.name"
              class="flex items-center p-1.5 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-primary)] cursor-pointer transition-colors text-sm"
              :class="{ 'border-[var(--color-accent-primary)]': selectedWeaponMasteries.includes(weapon.name) }"
            >
              <input
                type="checkbox"
                :value="weapon.name"
                v-model="selectedWeaponMasteries"
                class="mr-1.5 w-3 h-3"
              />
              <div class="flex-1">
                <span class="font-semibold text-[var(--color-text-primary)]">{{ weapon.name }}</span>
                <span class="text-xs text-[var(--color-text-tertiary)] ml-1">({{ weapon.type }}, {{ weapon.mastery }})</span>
              </div>
            </label>
          </div>
        </div>
        <div class="text-center text-sm mb-1.5" :class="{ 'text-[var(--color-success)]': selectedWeaponMasteries.length > 0, 'text-[var(--color-danger)]': selectedWeaponMasteries.length === 0 }">
          Selected: {{ selectedWeaponMasteries.length }} weapon{{ selectedWeaponMasteries.length !== 1 ? 's' : '' }}
        </div>
        <button @click="handleUpdateWeaponMastery" class="btn btn-primary text-sm px-1.5 py-0.5 w-full">Save</button>
      </div>
      <div v-else class="flex flex-col gap-1">
        <div
          v-for="weaponName in weaponMasteryList"
          :key="weaponName"
          class="card-compact p-1.5 flex items-center justify-between"
        >
          <div class="flex-1">
            <div class="text-sm font-bold text-[var(--color-text-primary)]">{{ weaponName }}</div>
            <div class="text-xs text-[var(--color-text-tertiary)]">{{ getWeaponMasteryInfo(weaponName) }}</div>
          </div>
          <button
            @click="handleRemoveWeaponMastery(weaponName)"
            class="btn btn-danger text-sm px-1 py-0.5 shrink-0"
          >
            ×
          </button>
        </div>
        <div v-if="weaponMasteryList.length === 0" class="text-center py-2 text-[var(--color-text-muted)] italic text-sm">
          No weapons with mastery
        </div>
      </div>
    </div>

    <!-- Features & Traits -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Features & Traits</h3>
        <button
          @click="showAddForm = !showAddForm"
          class="btn btn-primary text-sm px-1.5 py-0.5"
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
        <button @click="handleAddFeature" class="btn btn-primary text-sm px-1.5 py-0.5 w-full">Add</button>
      </div>
      <div class="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
        <div
          v-for="feature in otherFeaturesTraits"
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
        <div v-if="otherFeaturesTraits.length === 0" class="text-center py-2 text-[var(--color-text-muted)] italic text-sm">
          No features
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeatureTrait, Skill } from '~/types/character'
import { FIGHTING_STYLES, WEAPON_MASTERY_WEAPONS } from '~/composables/useCharacter'

const { character, addFeatureTrait, removeFeatureTrait, updateSkillProficiency, updateFightingStyle, updateWeaponMastery } = useCharacter()
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
const showFightingStyleForm = ref(false)
const showWeaponMasteryForm = ref(false)
const selectedFightingStyle = ref('')
const selectedWeaponMasteries = ref<string[]>([])

const fightingStyles = FIGHTING_STYLES
const weaponMasteryWeapons = WEAPON_MASTERY_WEAPONS

const newFeature = ref<Omit<FeatureTrait, 'id'>>({
  name: '',
  description: '',
  source: '',
})

// Filter out Fighting Style and Weapon Mastery from featuresTraits
const otherFeaturesTraits = computed(() => {
  return character.value.featuresTraits.filter(feature => 
    !feature.name.startsWith('Fighting Style:') && 
    feature.name !== 'Weapon Mastery'
  )
})

// Get current fighting style description
const currentFightingStyleDescription = computed(() => {
  if (!character.value.fightingStyle) return ''
  const style = FIGHTING_STYLES.find(s => s.name === character.value.fightingStyle)
  return style?.description || ''
})

// Get weapon mastery info
const getWeaponMasteryInfo = (weaponName: string): string => {
  const weapon = WEAPON_MASTERY_WEAPONS.find(w => w.name === weaponName)
  return weapon ? `${weapon.type}, ${weapon.mastery}` : ''
}

// Initialize forms when opening
watch(showFightingStyleForm, (isOpen) => {
  if (isOpen) {
    selectedFightingStyle.value = character.value.fightingStyle || ''
  }
})

// Computed property for weapon mastery list with fallback
const weaponMasteryList = computed(() => {
  return character.value.weaponMastery || []
})

watch(showWeaponMasteryForm, (isOpen) => {
  if (isOpen) {
    selectedWeaponMasteries.value = [...weaponMasteryList.value]
  }
})

const handleUpdateFightingStyle = () => {
  if (selectedFightingStyle.value) {
    updateFightingStyle(selectedFightingStyle.value)
    showFightingStyleForm.value = false
  }
}

const handleUpdateWeaponMastery = () => {
  updateWeaponMastery(selectedWeaponMasteries.value)
  showWeaponMasteryForm.value = false
}

const handleRemoveWeaponMastery = (weaponName: string) => {
  const updated = weaponMasteryList.value.filter(w => w !== weaponName)
  updateWeaponMastery(updated)
}

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

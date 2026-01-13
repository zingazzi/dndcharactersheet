<template>
  <div class="section">
    <div class="section-header">
      <h3 class="section-title">Spells</h3>
      <button
        @click="showAddForm = !showAddForm"
        class="btn btn-primary text-xs"
      >
        {{ showAddForm ? 'Cancel' : '+ Add Spell' }}
      </button>
    </div>
    <div class="mb-3 pb-3 border-b border-[var(--color-border-divider)]">
      <h4 class="m-0 mb-2 text-sm text-[var(--color-text-secondary)]">Spell Slots</h4>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2 mb-2">
        <div
          v-for="slot in character.spellSlots"
          :key="slot.level"
          class="flex flex-col gap-0.5"
        >
          <label class="text-xs font-semibold text-[var(--color-text-secondary)]">Level {{ slot.level }}</label>
          <div class="flex items-center gap-1">
            <input
              v-model.number="slot.used"
              type="number"
              :max="slot.total"
              min="0"
              class="input text-center w-12 py-1"
            />
            <span>/</span>
            <input
              v-model.number="slot.total"
              type="number"
              min="0"
              class="input text-center w-12 py-1"
            />
          </div>
        </div>
      </div>
      <button @click="addSpellSlot" class="btn btn-secondary text-xs">+ Add Spell Slot Level</button>
    </div>
    <div v-if="showAddForm" class="p-3 bg-[var(--color-bg-secondary)] rounded mb-3">
      <div class="flex gap-1.5 mb-1.5">
        <input
          v-model="newSpell.name"
          type="text"
          placeholder="Spell Name"
          class="input flex-1"
        />
        <input
          v-model.number="newSpell.level"
          type="number"
          placeholder="Level"
          min="0"
          max="9"
          class="input w-20"
        />
        <input
          v-model="newSpell.school"
          type="text"
          placeholder="School"
          class="input flex-1"
        />
      </div>
      <div class="flex gap-1.5 mb-1.5">
        <input
          v-model="newSpell.castingTime"
          type="text"
          placeholder="Casting Time"
          class="input flex-1"
        />
        <input
          v-model="newSpell.range"
          type="text"
          placeholder="Range"
          class="input flex-1"
        />
        <input
          v-model="newSpell.components"
          type="text"
          placeholder="Components"
          class="input flex-1"
        />
      </div>
      <div class="flex gap-1.5 mb-1.5">
        <input
          v-model="newSpell.duration"
          type="text"
          placeholder="Duration"
          class="input flex-1"
        />
        <label class="flex items-center gap-1.5 cursor-pointer text-xs">
          <input
            v-model="newSpell.prepared"
            type="checkbox"
          />
          Prepared
        </label>
      </div>
      <textarea
        v-model="newSpell.description"
        placeholder="Description"
        rows="3"
        class="input-textarea w-full mb-1.5"
      />
      <button @click="handleAddSpell" class="btn btn-primary text-xs">Save</button>
    </div>
    <div class="flex flex-col gap-2">
      <h4 class="m-0 mb-1 text-sm text-[var(--color-text-secondary)]">Known Spells</h4>
      <div
        v-for="spell in character.spells"
        :key="spell.id"
        class="card"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-2">
            <span class="text-base font-bold">{{ spell.name }}</span>
            <span class="text-xs text-[var(--color-text-tertiary)] px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded">Level {{ spell.level }}</span>
            <span v-if="spell.prepared" class="text-xs text-[var(--color-success)] bg-[var(--color-success)]/20 px-1.5 py-0.5 rounded font-semibold">Prepared</span>
          </div>
          <button
            @click="removeSpell(spell.id)"
            class="btn btn-danger text-xs px-2 py-1"
          >
            ×
          </button>
        </div>
        <div class="grid grid-cols-2 gap-1.5 mb-1.5">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[80px]">School:</span>
            <input
              v-model="spell.school"
              type="text"
              class="input flex-1 text-xs py-1 px-1.5"
            />
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[80px]">Casting Time:</span>
            <input
              v-model="spell.castingTime"
              type="text"
              class="input flex-1 text-xs py-1 px-1.5"
            />
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[80px]">Range:</span>
            <input
              v-model="spell.range"
              type="text"
              class="input flex-1 text-xs py-1 px-1.5"
            />
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[80px]">Components:</span>
            <input
              v-model="spell.components"
              type="text"
              class="input flex-1 text-xs py-1 px-1.5"
            />
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[80px]">Duration:</span>
            <input
              v-model="spell.duration"
              type="text"
              class="input flex-1 text-xs py-1 px-1.5"
            />
          </div>
          <label class="flex items-center gap-1.5 cursor-pointer text-xs">
            <input
              v-model="spell.prepared"
              type="checkbox"
            />
            Prepared
          </label>
        </div>
        <textarea
          v-model="spell.description"
          placeholder="Description"
          rows="2"
          class="input-textarea w-full text-xs"
        />
      </div>
      <div v-if="character.spells.length === 0" class="text-center py-6 text-[var(--color-text-muted)] italic text-sm">
        No spells added yet. Click "+ Add Spell" to get started.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Spell, SpellSlot } from '~/types/character'

const { character, addSpell, removeSpell } = useCharacter()

const showAddForm = ref(false)
const newSpell = ref<Omit<Spell, 'id'>>({
  name: '',
  level: 1,
  school: '',
  castingTime: '',
  range: '',
  components: '',
  duration: '',
  description: '',
  prepared: false,
})

const handleAddSpell = () => {
  if (newSpell.value.name.trim()) {
    addSpell(newSpell.value)
    newSpell.value = {
      name: '',
      level: 1,
      school: '',
      castingTime: '',
      range: '',
      components: '',
      duration: '',
      description: '',
      prepared: false,
    }
    showAddForm.value = false
  }
}

const addSpellSlot = () => {
  const maxLevel = character.value.spellSlots.length > 0
    ? Math.max(...character.value.spellSlots.map(s => s.level))
    : 0
  character.value.spellSlots.push({
    level: maxLevel + 1,
    total: 0,
    used: 0,
  })
}
</script>

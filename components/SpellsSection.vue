<template>
  <div class="p-6 border-2 border-brown rounded-md mb-6 bg-white/40 shadow-[0_0_0_1px_#d4a574,0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]">
    <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
      <h3 class="m-0 text-xl font-cinzel font-semibold text-text-brown text-shadow-dnd tracking-wide uppercase">Spells</h3>
      <button
        @click="showAddForm = !showAddForm"
        class="btn-dnd-primary"
      >
        {{ showAddForm ? 'Cancel' : '+ Add Spell' }}
      </button>
    </div>
    <div class="mb-6 pb-4 border-b border-gray-300">
      <h4 class="m-0 mb-3 text-base text-gray-700">Spell Slots</h4>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 mb-3">
        <div
          v-for="slot in character.spellSlots"
          :key="slot.level"
          class="flex flex-col gap-1"
        >
          <label class="text-sm font-semibold text-gray-700">Level {{ slot.level }}</label>
          <div class="flex items-center gap-1">
            <input
              v-model.number="slot.used"
              type="number"
              :max="slot.total"
              min="0"
              class="input-dnd-number w-[50px] text-center py-1"
            />
            <span>/</span>
            <input
              v-model.number="slot.total"
              type="number"
              min="0"
              class="input-dnd-number w-[50px] text-center py-1"
            />
          </div>
        </div>
      </div>
      <button @click="addSpellSlot" class="btn-dnd-secondary text-sm">+ Add Spell Slot Level</button>
    </div>
    <div v-if="showAddForm" class="p-4 bg-gray-50 rounded-md mb-4">
      <div class="flex gap-2 mb-2">
        <input
          v-model="newSpell.name"
          type="text"
          placeholder="Spell Name"
          class="input-dnd flex-1"
        />
        <input
          v-model.number="newSpell.level"
          type="number"
          placeholder="Level"
          min="0"
          max="9"
          class="input-dnd w-[100px]"
        />
        <input
          v-model="newSpell.school"
          type="text"
          placeholder="School"
          class="input-dnd flex-1"
        />
      </div>
      <div class="flex gap-2 mb-2">
        <input
          v-model="newSpell.castingTime"
          type="text"
          placeholder="Casting Time"
          class="input-dnd flex-1"
        />
        <input
          v-model="newSpell.range"
          type="text"
          placeholder="Range"
          class="input-dnd flex-1"
        />
        <input
          v-model="newSpell.components"
          type="text"
          placeholder="Components"
          class="input-dnd flex-1"
        />
      </div>
      <div class="flex gap-2 mb-2">
        <input
          v-model="newSpell.duration"
          type="text"
          placeholder="Duration"
          class="input-dnd flex-1"
        />
        <label class="flex items-center gap-2 cursor-pointer text-sm">
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
        rows="4"
        class="input-dnd-textarea w-full mb-2"
      />
      <button @click="handleAddSpell" class="btn-dnd-primary">Save</button>
    </div>
    <div class="flex flex-col gap-4">
      <h4 class="m-0 mb-1 text-base text-gray-700">Known Spells</h4>
      <div
        v-for="spell in character.spells"
        :key="spell.id"
        class="p-4 border border-gray-300 rounded bg-gray-50"
      >
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center gap-3">
            <span class="text-lg font-bold">{{ spell.name }}</span>
            <span class="text-sm text-gray-600 px-2 py-1 bg-gray-200 rounded">Level {{ spell.level }}</span>
            <span v-if="spell.prepared" class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded font-semibold">Prepared</span>
          </div>
          <button
            @click="removeSpell(spell.id)"
            class="bg-red-600 text-white border-none rounded-full w-6 h-6 cursor-pointer text-xl leading-none flex items-center justify-center hover:bg-red-700"
          >
            ×
          </button>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700 min-w-[100px]">School:</span>
            <input
              v-model="spell.school"
              type="text"
              class="input-dnd flex-1 text-sm py-1 px-2"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700 min-w-[100px]">Casting Time:</span>
            <input
              v-model="spell.castingTime"
              type="text"
              class="input-dnd flex-1 text-sm py-1 px-2"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700 min-w-[100px]">Range:</span>
            <input
              v-model="spell.range"
              type="text"
              class="input-dnd flex-1 text-sm py-1 px-2"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700 min-w-[100px]">Components:</span>
            <input
              v-model="spell.components"
              type="text"
              class="input-dnd flex-1 text-sm py-1 px-2"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700 min-w-[100px]">Duration:</span>
            <input
              v-model="spell.duration"
              type="text"
              class="input-dnd flex-1 text-sm py-1 px-2"
            />
          </div>
          <label class="flex items-center gap-2 cursor-pointer text-sm">
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
          rows="3"
          class="input-dnd-textarea w-full text-sm"
        />
      </div>
      <div v-if="character.spells.length === 0" class="text-center py-8 text-gray-500 italic">
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

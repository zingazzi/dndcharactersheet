<template>
  <div class="p-6 border-2 border-brown rounded-md mb-6 bg-white/40 shadow-[0_0_0_1px_#d4a574,0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]">
    <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
      <h3 class="m-0 text-xl font-cinzel font-semibold text-text-brown text-shadow-dnd tracking-wide uppercase">Actions</h3>
      <button
        @click="showAddForm = !showAddForm"
        class="btn-dnd-primary"
      >
        {{ showAddForm ? 'Cancel' : '+ Add Action' }}
      </button>
    </div>
    <div v-if="showAddForm" class="p-4 bg-white/50 border-2 border-gold rounded-md mb-4 shadow-dnd-inner">
      <div class="flex gap-2 mb-2">
        <input
          v-model="newAction.name"
          type="text"
          placeholder="Action Name"
          class="input-dnd flex-1"
        />
        <input
          v-model="newAction.type"
          type="text"
          placeholder="Type"
          class="input-dnd flex-1"
        />
        <input
          v-model="newAction.range"
          type="text"
          placeholder="Range"
          class="input-dnd flex-1"
        />
      </div>
      <div class="flex gap-2 mb-2">
        <input
          v-model="newAction.toHit"
          type="text"
          placeholder="To Hit"
          class="input-dnd flex-1"
        />
        <input
          v-model="newAction.damage"
          type="text"
          placeholder="Damage"
          class="input-dnd flex-1"
        />
      </div>
      <textarea
        v-model="newAction.description"
        placeholder="Description (optional)"
        rows="2"
        class="input-dnd-textarea w-full mb-2"
      />
      <button @click="handleAddAction" class="btn-dnd-primary">Save</button>
    </div>
    <div class="flex flex-col gap-4">
      <div
        v-for="action in character.actions"
        :key="action.id"
        class="p-4 border-2 border-gold rounded-md bg-gradient-to-b from-white/50 to-parchment/30 shadow-dnd-inner"
      >
        <div class="flex justify-between items-center mb-3">
          <div class="text-lg font-bold">{{ action.name }}</div>
          <button
            @click="removeAction(action.id)"
            class="bg-red-600 text-white border-none rounded-full w-6 h-6 cursor-pointer text-xl leading-none flex items-center justify-center hover:bg-red-700"
          >
            ×
          </button>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700 min-w-[60px]">Type:</span>
            <input
              v-model="action.type"
              type="text"
              class="input-dnd flex-1 text-sm py-1 px-2"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700 min-w-[60px]">Range:</span>
            <input
              v-model="action.range"
              type="text"
              class="input-dnd flex-1 text-sm py-1 px-2"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700 min-w-[60px]">To Hit:</span>
            <input
              v-model="action.toHit"
              type="text"
              class="input-dnd flex-1 text-sm py-1 px-2"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700 min-w-[60px]">Damage:</span>
            <input
              v-model="action.damage"
              type="text"
              class="input-dnd flex-1 text-sm py-1 px-2"
            />
          </div>
        </div>
        <textarea
          v-if="action.description"
          v-model="action.description"
          placeholder="Description"
          rows="2"
          class="input-dnd-textarea w-full text-sm"
        />
      </div>
      <div v-if="character.actions.length === 0" class="text-center py-8 text-gray-500 italic">
        No actions added yet. Click "+ Add Action" to get started.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Action } from '~/types/character'

const { character, addAction, removeAction } = useCharacter()

const showAddForm = ref(false)
const newAction = ref<Omit<Action, 'id'>>({
  name: '',
  type: '',
  range: '',
  toHit: '',
  damage: '',
  description: '',
})

const handleAddAction = () => {
  if (newAction.value.name.trim()) {
    addAction(newAction.value)
    newAction.value = {
      name: '',
      type: '',
      range: '',
      toHit: '',
      damage: '',
      description: '',
    }
    showAddForm.value = false
  }
}
</script>

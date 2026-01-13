<template>
  <div class="section">
    <div class="section-header">
      <h3 class="section-title">Actions</h3>
      <button
        @click="showAddForm = !showAddForm"
        class="btn btn-primary text-xs"
      >
        {{ showAddForm ? 'Cancel' : '+ Add Action' }}
      </button>
    </div>
    <div v-if="showAddForm" class="p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] rounded mb-3">
      <div class="flex gap-1.5 mb-1.5">
        <input
          v-model="newAction.name"
          type="text"
          placeholder="Action Name"
          class="input flex-1"
        />
        <input
          v-model="newAction.type"
          type="text"
          placeholder="Type"
          class="input flex-1"
        />
        <input
          v-model="newAction.range"
          type="text"
          placeholder="Range"
          class="input flex-1"
        />
      </div>
      <div class="flex gap-1.5 mb-1.5">
        <input
          v-model="newAction.toHit"
          type="text"
          placeholder="To Hit"
          class="input flex-1"
        />
        <input
          v-model="newAction.damage"
          type="text"
          placeholder="Damage"
          class="input flex-1"
        />
      </div>
      <textarea
        v-model="newAction.description"
        placeholder="Description (optional)"
        rows="2"
        class="input-textarea w-full mb-1.5"
      />
      <button @click="handleAddAction" class="btn btn-primary text-xs">Save</button>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="action in character.actions"
        :key="action.id"
        class="card"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="text-base font-bold">{{ action.name }}</div>
          <button
            @click="removeAction(action.id)"
            class="btn btn-danger text-xs px-2 py-1"
          >
            ×
          </button>
        </div>
        <div class="grid grid-cols-2 gap-1.5 mb-1.5">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[50px]">Type:</span>
            <input
              v-model="action.type"
              type="text"
              class="input flex-1 text-xs py-1 px-1.5"
            />
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[50px]">Range:</span>
            <input
              v-model="action.range"
              type="text"
              class="input flex-1 text-xs py-1 px-1.5"
            />
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[50px]">To Hit:</span>
            <input
              v-model="action.toHit"
              type="text"
              class="input flex-1 text-xs py-1 px-1.5"
            />
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[50px]">Damage:</span>
            <input
              v-model="action.damage"
              type="text"
              class="input flex-1 text-xs py-1 px-1.5"
            />
          </div>
        </div>
        <textarea
          v-if="action.description"
          v-model="action.description"
          placeholder="Description"
          rows="2"
          class="input-textarea w-full text-xs"
        />
      </div>
      <div v-if="character.actions.length === 0" class="text-center py-6 text-[var(--color-text-muted)] italic text-sm">
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

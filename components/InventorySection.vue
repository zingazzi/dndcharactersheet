<template>
  <div class="section">
    <div class="section-header">
      <h3 class="section-title">Inventory</h3>
      <button
        @click="showAddForm = !showAddForm"
        class="btn btn-primary text-xs"
      >
        {{ showAddForm ? 'Cancel' : '+ Add Item' }}
      </button>
    </div>
    <div v-if="showAddForm" class="p-3 bg-[var(--color-bg-secondary)] rounded mb-3">
      <div class="flex gap-1.5 mb-1.5">
        <input
          v-model="newItem.name"
          type="text"
          placeholder="Item Name"
          class="input flex-1"
        />
        <input
          v-model.number="newItem.quantity"
          type="number"
          placeholder="Quantity"
          min="1"
          class="input w-24"
        />
        <input
          v-model.number="newItem.weight"
          type="number"
          placeholder="Weight (lbs)"
          min="0"
          step="0.1"
          class="input w-24"
        />
      </div>
      <textarea
        v-model="newItem.description"
        placeholder="Description (optional)"
        rows="2"
        class="input-textarea w-full mb-1.5"
      />
      <button @click="handleAddItem" class="btn btn-primary text-xs">Save</button>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="item in character.inventory"
        :key="item.id"
        class="card"
      >
        <div class="flex justify-between items-center mb-1.5">
          <div class="flex items-center gap-2">
            <span class="text-base font-bold">{{ item.name }}</span>
            <span class="text-xs text-[var(--color-text-tertiary)]">×{{ item.quantity }}</span>
            <span class="text-xs text-[var(--color-text-muted)] px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded">{{ item.weight }} lbs</span>
          </div>
          <button
            @click="removeInventoryItem(item.id)"
            class="btn btn-danger text-xs px-2 py-1"
          >
            ×
          </button>
        </div>
        <div v-if="item.description" class="mb-1.5 p-1.5 bg-[var(--color-bg-secondary)] rounded text-xs text-[var(--color-text-secondary)]">
          {{ item.description }}
        </div>
        <div class="pt-1.5 border-t border-[var(--color-border-divider)]">
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[60px]">Name:</label>
            <input
              v-model="item.name"
              type="text"
              class="input flex-1 text-xs py-1 px-1.5"
            />
          </div>
          <div class="flex items-center gap-1.5 mb-1.5">
            <label class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[60px]">Quantity:</label>
            <input
              v-model.number="item.quantity"
              type="number"
              min="1"
              class="input w-20 text-xs py-1 px-1.5"
            />
            <label class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[50px]">Weight:</label>
            <input
              v-model.number="item.weight"
              type="number"
              min="0"
              step="0.1"
              class="input w-20 text-xs py-1 px-1.5"
            />
          </div>
          <div class="flex items-center gap-1.5">
            <label class="text-xs font-semibold text-[var(--color-text-tertiary)] min-w-[60px]">Description:</label>
            <textarea
              v-model="item.description"
              rows="2"
              class="input-textarea flex-1 text-xs"
            />
          </div>
        </div>
      </div>
      <div v-if="character.inventory.length === 0" class="text-center py-6 text-[var(--color-text-muted)] italic text-sm">
        No items in inventory. Click "+ Add Item" to get started.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InventoryItem } from '~/types/character'

const { character, addInventoryItem, removeInventoryItem } = useCharacter()

const showAddForm = ref(false)
const newItem = ref<Omit<InventoryItem, 'id'>>({
  name: '',
  quantity: 1,
  weight: 0,
  description: '',
})

const handleAddItem = () => {
  if (newItem.value.name.trim()) {
    addInventoryItem(newItem.value)
    newItem.value = {
      name: '',
      quantity: 1,
      weight: 0,
      description: '',
    }
    showAddForm.value = false
  }
}
</script>

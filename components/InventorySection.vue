<template>
  <div class="p-6 border-2 border-brown rounded-md mb-6 bg-white/40 shadow-[0_0_0_1px_#d4a574,0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]">
    <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
      <h3 class="m-0 text-xl font-cinzel font-semibold text-text-brown text-shadow-dnd tracking-wide uppercase">Inventory</h3>
      <button
        @click="showAddForm = !showAddForm"
        class="btn-dnd-primary"
      >
        {{ showAddForm ? 'Cancel' : '+ Add Item' }}
      </button>
    </div>
    <div v-if="showAddForm" class="p-4 bg-gray-50 rounded-md mb-4">
      <div class="flex gap-2 mb-2">
        <input
          v-model="newItem.name"
          type="text"
          placeholder="Item Name"
          class="input-dnd flex-1"
        />
        <input
          v-model.number="newItem.quantity"
          type="number"
          placeholder="Quantity"
          min="1"
          class="input-dnd w-[120px]"
        />
        <input
          v-model.number="newItem.weight"
          type="number"
          placeholder="Weight (lbs)"
          min="0"
          step="0.1"
          class="input-dnd w-[120px]"
        />
      </div>
      <textarea
        v-model="newItem.description"
        placeholder="Description (optional)"
        rows="2"
        class="input-dnd-textarea w-full mb-2"
      />
      <button @click="handleAddItem" class="btn-dnd-primary">Save</button>
    </div>
    <div class="flex flex-col gap-4">
      <div
        v-for="item in character.inventory"
        :key="item.id"
        class="p-4 border border-gray-300 rounded bg-gray-50"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-3">
            <span class="text-lg font-bold">{{ item.name }}</span>
            <span class="text-sm text-gray-600">×{{ item.quantity }}</span>
            <span class="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded">{{ item.weight }} lbs</span>
          </div>
          <button
            @click="removeInventoryItem(item.id)"
            class="bg-red-600 text-white border-none rounded-full w-6 h-6 cursor-pointer text-xl leading-none flex items-center justify-center hover:bg-red-700"
          >
            ×
          </button>
        </div>
        <div v-if="item.description" class="mb-2 p-2 bg-gray-100 rounded text-sm text-gray-700">
          {{ item.description }}
        </div>
        <div class="mt-2 pt-2 border-t border-gray-300">
          <div class="flex items-center gap-2 mb-2">
            <label class="text-xs font-semibold text-gray-700 min-w-[80px]">Name:</label>
            <input
              v-model="item.name"
              type="text"
              class="input-dnd flex-1 text-sm py-1 px-2"
            />
          </div>
          <div class="flex items-center gap-2 mb-2">
            <label class="text-xs font-semibold text-gray-700 min-w-[80px]">Quantity:</label>
            <input
              v-model.number="item.quantity"
              type="number"
              min="1"
              class="input-dnd w-[100px] text-sm py-1 px-2"
            />
            <label class="text-xs font-semibold text-gray-700 min-w-[60px]">Weight:</label>
            <input
              v-model.number="item.weight"
              type="number"
              min="0"
              step="0.1"
              class="input-dnd w-[100px] text-sm py-1 px-2"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-xs font-semibold text-gray-700 min-w-[80px]">Description:</label>
            <textarea
              v-model="item.description"
              rows="2"
              class="input-dnd-textarea flex-1 text-sm"
            />
          </div>
        </div>
      </div>
      <div v-if="character.inventory.length === 0" class="text-center py-8 text-gray-500 italic">
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

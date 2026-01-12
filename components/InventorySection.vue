<template>
  <div class="inventory-section">
    <div class="section-header">
      <h3>Inventory</h3>
      <button @click="showAddForm = !showAddForm" class="btn-add">
        {{ showAddForm ? 'Cancel' : '+ Add Item' }}
      </button>
    </div>
    <div v-if="showAddForm" class="add-item-form">
      <div class="form-row">
        <input
          v-model="newItem.name"
          type="text"
          placeholder="Item Name"
          class="form-input"
        />
        <input
          v-model.number="newItem.quantity"
          type="number"
          placeholder="Quantity"
          min="1"
          class="form-input small"
        />
        <input
          v-model.number="newItem.weight"
          type="number"
          placeholder="Weight (lbs)"
          min="0"
          step="0.1"
          class="form-input small"
        />
      </div>
      <textarea
        v-model="newItem.description"
        placeholder="Description (optional)"
        rows="2"
        class="form-textarea"
      />
      <button @click="handleAddItem" class="btn-save">Save</button>
    </div>
    <div class="inventory-list">
      <div
        v-for="item in character.inventory"
        :key="item.id"
        class="inventory-item"
      >
        <div class="item-header">
          <div class="item-name-quantity">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-quantity">×{{ item.quantity }}</span>
            <span class="item-weight">{{ item.weight }} lbs</span>
          </div>
          <button @click="removeInventoryItem(item.id)" class="btn-remove">×</button>
        </div>
        <div v-if="item.description" class="item-description">
          {{ item.description }}
        </div>
        <div class="item-edit">
          <div class="edit-row">
            <label>Name:</label>
            <input
              v-model="item.name"
              type="text"
              class="edit-input"
            />
          </div>
          <div class="edit-row">
            <label>Quantity:</label>
            <input
              v-model.number="item.quantity"
              type="number"
              min="1"
              class="edit-input small"
            />
            <label>Weight:</label>
            <input
              v-model.number="item.weight"
              type="number"
              min="0"
              step="0.1"
              class="edit-input small"
            />
          </div>
          <div class="edit-row">
            <label>Description:</label>
            <textarea
              v-model="item.description"
              rows="2"
              class="edit-textarea"
            />
          </div>
        </div>
      </div>
      <div v-if="character.inventory.length === 0" class="empty-state">
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

<style scoped>
.inventory-section {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.btn-add,
.btn-save {
  padding: 0.5rem 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-add:hover,
.btn-save:hover {
  background: #357abd;
}

.add-item-form {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}

.form-input {
  flex: 1;
}

.form-input.small {
  width: 120px;
}

.form-textarea {
  width: 100%;
  resize: vertical;
  margin-bottom: 0.5rem;
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.inventory-item {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.item-name-quantity {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.item-quantity {
  font-size: 0.9rem;
  color: #666;
}

.item-weight {
  font-size: 0.85rem;
  color: #888;
  padding: 0.25rem 0.5rem;
  background: #e9e9e9;
  border-radius: 4px;
}

.btn-remove {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #c0392b;
}

.item-description {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #555;
}

.item-edit {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #ddd;
}

.edit-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.edit-row label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  min-width: 80px;
}

.edit-input,
.edit-textarea {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
}

.edit-input {
  flex: 1;
}

.edit-input.small {
  width: 100px;
}

.edit-textarea {
  flex: 1;
  resize: vertical;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
}
</style>

<template>
  <div class="actions-section">
    <div class="section-header">
      <h3>Actions</h3>
      <button @click="showAddForm = !showAddForm" class="btn-add">
        {{ showAddForm ? 'Cancel' : '+ Add Action' }}
      </button>
    </div>
    <div v-if="showAddForm" class="add-action-form">
      <div class="form-row">
        <input
          v-model="newAction.name"
          type="text"
          placeholder="Action Name"
          class="form-input"
        />
        <input
          v-model="newAction.type"
          type="text"
          placeholder="Type"
          class="form-input"
        />
        <input
          v-model="newAction.range"
          type="text"
          placeholder="Range"
          class="form-input"
        />
      </div>
      <div class="form-row">
        <input
          v-model="newAction.toHit"
          type="text"
          placeholder="To Hit"
          class="form-input"
        />
        <input
          v-model="newAction.damage"
          type="text"
          placeholder="Damage"
          class="form-input"
        />
      </div>
      <textarea
        v-model="newAction.description"
        placeholder="Description (optional)"
        rows="2"
        class="form-textarea"
      />
      <button @click="handleAddAction" class="btn-save">Save</button>
    </div>
    <div class="actions-list">
      <div
        v-for="action in character.actions"
        :key="action.id"
        class="action-item"
      >
        <div class="action-header">
          <div class="action-name">{{ action.name }}</div>
          <button @click="removeAction(action.id)" class="btn-remove">×</button>
        </div>
        <div class="action-details">
          <div class="detail-item">
            <span class="detail-label">Type:</span>
            <input
              v-model="action.type"
              type="text"
              class="detail-input"
            />
          </div>
          <div class="detail-item">
            <span class="detail-label">Range:</span>
            <input
              v-model="action.range"
              type="text"
              class="detail-input"
            />
          </div>
          <div class="detail-item">
            <span class="detail-label">To Hit:</span>
            <input
              v-model="action.toHit"
              type="text"
              class="detail-input"
            />
          </div>
          <div class="detail-item">
            <span class="detail-label">Damage:</span>
            <input
              v-model="action.damage"
              type="text"
              class="detail-input"
            />
          </div>
        </div>
        <textarea
          v-if="action.description"
          v-model="action.description"
          placeholder="Description"
          rows="2"
          class="action-description"
        />
      </div>
      <div v-if="character.actions.length === 0" class="empty-state">
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

<style scoped>
.actions-section {
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

.add-action-form {
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

.form-textarea {
  width: 100%;
  resize: vertical;
  margin-bottom: 0.5rem;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-item {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.action-name {
  font-size: 1.1rem;
  font-weight: bold;
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

.action-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  min-width: 60px;
}

.detail-input {
  flex: 1;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}

.action-description {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
}
</style>

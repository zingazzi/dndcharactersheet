<template>
  <div class="features-traits-section">
    <div class="section-header">
      <h3>Features & Traits</h3>
      <button @click="showAddForm = !showAddForm" class="btn-add">
        {{ showAddForm ? 'Cancel' : '+ Add Feature/Trait' }}
      </button>
    </div>
    <div v-if="showAddForm" class="add-feature-form">
      <div class="form-row">
        <input
          v-model="newFeature.name"
          type="text"
          placeholder="Feature/Trait Name"
          class="form-input"
        />
        <select
          v-model="newFeature.source"
          class="form-select"
        >
          <option value="">No Source</option>
          <option value="Class">Class</option>
          <option value="Race">Race</option>
          <option value="Feat">Feat</option>
          <option value="Background">Background</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <textarea
        v-model="newFeature.description"
        placeholder="Description"
        rows="4"
        class="form-textarea"
      />
      <button @click="handleAddFeature" class="btn-save">Save</button>
    </div>
    <div class="features-list">
      <div
        v-for="feature in character.featuresTraits"
        :key="feature.id"
        class="feature-item"
      >
        <div class="feature-header">
          <div class="feature-name-source">
            <span class="feature-name">{{ feature.name }}</span>
            <span v-if="feature.source" class="feature-source">{{ feature.source }}</span>
          </div>
          <button @click="removeFeatureTrait(feature.id)" class="btn-remove">×</button>
        </div>
        <div class="feature-edit">
          <div class="edit-row">
            <label>Name:</label>
            <input
              v-model="feature.name"
              type="text"
              class="edit-input"
            />
            <label>Source:</label>
            <select
              v-model="feature.source"
              class="edit-select"
            >
              <option value="">No Source</option>
              <option value="Class">Class</option>
              <option value="Race">Race</option>
              <option value="Feat">Feat</option>
              <option value="Background">Background</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="edit-row">
            <label>Description:</label>
            <textarea
              v-model="feature.description"
              rows="3"
              class="edit-textarea"
            />
          </div>
        </div>
      </div>
      <div v-if="character.featuresTraits.length === 0" class="empty-state">
        No features or traits added yet. Click "+ Add Feature/Trait" to get started.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeatureTrait } from '~/types/character'

const { character, addFeatureTrait, removeFeatureTrait } = useCharacter()

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

<style scoped>
.features-traits-section {
  padding: 1.5rem;
  border: 2px solid #8b4513;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 0 0 1px #d4a574,
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
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
  font-size: 1.4rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #5c3a21;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
  text-transform: uppercase;
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

.add-feature-form {
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
.form-select,
.form-textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}

.form-input {
  flex: 1;
}

.form-select {
  width: 150px;
}

.form-textarea {
  width: 100%;
  resize: vertical;
  margin-bottom: 0.5rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.feature-name-source {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.feature-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.feature-source {
  font-size: 0.75rem;
  color: #666;
  background: #e9e9e9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
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

.feature-edit {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #ddd;
}

.edit-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.edit-row label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  min-width: 80px;
  padding-top: 0.25rem;
}

.edit-input,
.edit-select,
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

.edit-select {
  width: 150px;
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

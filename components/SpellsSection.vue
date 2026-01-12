<template>
  <div class="spells-section">
    <div class="section-header">
      <h3>Spells</h3>
      <button @click="showAddForm = !showAddForm" class="btn-add">
        {{ showAddForm ? 'Cancel' : '+ Add Spell' }}
      </button>
    </div>
    <div class="spell-slots">
      <h4>Spell Slots</h4>
      <div class="slots-grid">
        <div
          v-for="slot in character.spellSlots"
          :key="slot.level"
          class="slot-item"
        >
          <label>Level {{ slot.level }}</label>
          <div class="slot-controls">
            <input
              v-model.number="slot.used"
              type="number"
              :max="slot.total"
              min="0"
              class="slot-input"
            />
            <span>/</span>
            <input
              v-model.number="slot.total"
              type="number"
              min="0"
              class="slot-input"
            />
          </div>
        </div>
      </div>
      <button @click="addSpellSlot" class="btn-add-slot">+ Add Spell Slot Level</button>
    </div>
    <div v-if="showAddForm" class="add-spell-form">
      <div class="form-row">
        <input
          v-model="newSpell.name"
          type="text"
          placeholder="Spell Name"
          class="form-input"
        />
        <input
          v-model.number="newSpell.level"
          type="number"
          placeholder="Level"
          min="0"
          max="9"
          class="form-input small"
        />
        <input
          v-model="newSpell.school"
          type="text"
          placeholder="School"
          class="form-input"
        />
      </div>
      <div class="form-row">
        <input
          v-model="newSpell.castingTime"
          type="text"
          placeholder="Casting Time"
          class="form-input"
        />
        <input
          v-model="newSpell.range"
          type="text"
          placeholder="Range"
          class="form-input"
        />
        <input
          v-model="newSpell.components"
          type="text"
          placeholder="Components"
          class="form-input"
        />
      </div>
      <div class="form-row">
        <input
          v-model="newSpell.duration"
          type="text"
          placeholder="Duration"
          class="form-input"
        />
        <label class="checkbox-label">
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
        class="form-textarea"
      />
      <button @click="handleAddSpell" class="btn-save">Save</button>
    </div>
    <div class="spells-list">
      <h4>Known Spells</h4>
      <div
        v-for="spell in character.spells"
        :key="spell.id"
        class="spell-item"
      >
        <div class="spell-header">
          <div class="spell-name-level">
            <span class="spell-name">{{ spell.name }}</span>
            <span class="spell-level">Level {{ spell.level }}</span>
            <span v-if="spell.prepared" class="prepared-badge">Prepared</span>
          </div>
          <button @click="removeSpell(spell.id)" class="btn-remove">×</button>
        </div>
        <div class="spell-details">
          <div class="spell-detail-row">
            <span class="detail-label">School:</span>
            <input
              v-model="spell.school"
              type="text"
              class="detail-input"
            />
          </div>
          <div class="spell-detail-row">
            <span class="detail-label">Casting Time:</span>
            <input
              v-model="spell.castingTime"
              type="text"
              class="detail-input"
            />
          </div>
          <div class="spell-detail-row">
            <span class="detail-label">Range:</span>
            <input
              v-model="spell.range"
              type="text"
              class="detail-input"
            />
          </div>
          <div class="spell-detail-row">
            <span class="detail-label">Components:</span>
            <input
              v-model="spell.components"
              type="text"
              class="detail-input"
            />
          </div>
          <div class="spell-detail-row">
            <span class="detail-label">Duration:</span>
            <input
              v-model="spell.duration"
              type="text"
              class="detail-input"
            />
          </div>
          <label class="checkbox-label">
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
          class="spell-description"
        />
      </div>
      <div v-if="character.spells.length === 0" class="empty-state">
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

<style scoped>
.spells-section {
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
.btn-save,
.btn-add-slot {
  padding: 0.5rem 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-add:hover,
.btn-save:hover,
.btn-add-slot:hover {
  background: #357abd;
}

.spell-slots {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;
}

.spell-slots h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: #555;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.slot-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.slot-item label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
}

.slot-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.slot-input {
  width: 50px;
  padding: 0.25rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-spell-form {
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
  width: 100px;
}

.form-textarea {
  width: 100%;
  resize: vertical;
  margin-bottom: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.spells-list h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #555;
}

.spells-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.spell-item {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
}

.spell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.spell-name-level {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spell-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.spell-level {
  font-size: 0.85rem;
  color: #666;
  padding: 0.25rem 0.5rem;
  background: #e9e9e9;
  border-radius: 4px;
}

.prepared-badge {
  font-size: 0.75rem;
  color: #27ae60;
  background: #d5f4e6;
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

.spell-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.spell-detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  min-width: 100px;
}

.detail-input {
  flex: 1;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}

.spell-description {
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

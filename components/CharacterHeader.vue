<template>
  <div class="character-header">
    <div class="header-left">
      <div class="character-image">
        <img v-if="character.image" :src="character.image" alt="Character" />
        <div v-else class="image-placeholder">Image</div>
        <input
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          class="image-upload"
        />
      </div>
      <div class="character-info">
        <input
          v-model="character.name"
          type="text"
          placeholder="Character Name"
          class="character-name"
        />
        <input
          v-model="character.classLevel"
          type="text"
          placeholder="Class + Level (e.g., Fighter 5)"
          class="class-level"
        />
      </div>
    </div>
    <div class="header-stats">
      <button @click="openHistoryModal" class="history-btn" title="Dice History">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
          <path d="M21 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
          <path d="M3 12c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"/>
        </svg>
      </button>
      <div class="stat">
        <label>AC</label>
        <input
          v-model.number="character.ac"
          type="number"
          class="stat-input"
        />
      </div>
      <div class="stat">
        <label>PF</label>
        <div class="hp-inputs">
          <input
            v-model.number="character.hitPoints.current"
            type="number"
            class="stat-input small"
          />
          <span>/</span>
          <input
            v-model.number="character.hitPoints.maximum"
            type="number"
            class="stat-input small"
          />
        </div>
      </div>
      <div class="stat">
        <label>Initiative</label>
        <input
          v-model.number="character.initiative"
          type="number"
          class="stat-input"
        />
      </div>
      <div class="stat">
        <label>Proficiency Bonus</label>
        <input
          v-model.number="character.proficiencyBonus"
          type="number"
          class="stat-input"
        />
      </div>
    </div>
    <DiceHistoryModal
      :is-open="isHistoryModalOpen"
      @close="closeHistoryModal"
    />
  </div>
</template>

<script setup lang="ts">
import type { Character } from '~/types/character'

const { character } = useCharacter()

const isHistoryModalOpen = ref(false)

const openHistoryModal = () => {
  isHistoryModalOpen.value = true
}

const closeHistoryModal = () => {
  isHistoryModalOpen.value = false
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      character.value.image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
.character-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 3px double #8b4513;
  margin-bottom: 1.5rem;
  gap: 2rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(244, 232, 208, 0.1) 100%);
  border-radius: 4px;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.character-image {
  position: relative;
  width: 80px;
  height: 80px;
  border: 3px solid #8b4513;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 
    0 0 0 2px #d4a574,
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.character-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #666;
  font-size: 0.8rem;
}

.image-upload {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.character-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.character-name {
  font-size: 1.8rem;
  font-weight: 700;
  font-family: 'Cinzel Decorative', 'Cinzel', serif;
  padding: 0.5rem;
  border: 2px solid #8b4513;
  border-radius: 4px;
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  color: #2c1810;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.05em;
}

.class-level {
  font-size: 1.1rem;
  font-style: italic;
  font-family: 'Cinzel', serif;
  font-weight: 500;
  padding: 0.5rem;
  border: 2px solid #8b4513;
  border-radius: 4px;
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  color: #5c3a21;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.03em;
}

.header-stats {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.history-btn {
  background: linear-gradient(180deg, #8b4513 0%, #6b3410 100%);
  color: #f4e8d0;
  border: 2px solid #5c3a21;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.history-btn:hover {
  background: linear-gradient(180deg, #9d5520 0%, #7b4415 100%);
  transform: translateY(-1px);
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
}

.stat-input {
  width: 60px;
  padding: 0.5rem;
  text-align: center;
  border: 2px solid #8b4513;
  border-radius: 4px;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.8);
  color: #2c1810;
  font-weight: bold;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-input.small {
  width: 50px;
}

.hp-inputs {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.hp-inputs span {
  font-size: 1.1rem;
  font-weight: bold;
}
</style>

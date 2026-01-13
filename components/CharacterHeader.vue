<template>
  <div class="character-header">
    <div class="header-left">
      <div class="character-image">
        <img v-if="character.image" :src="character.image" alt="Character" />
        <div v-else class="image-placeholder">Image</div>
      </div>
      <div class="character-info">
        <div class="name-row">
          <span class="character-name-display">{{ character.name }}</span>
          <button @click="openEditModal" class="edit-btn-small" title="Edit Character">✎</button>
        </div>
        <span class="class-level-display">{{ character.classLevel }}</span>
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
        <div class="stat-display">{{ character.ac }}</div>
      </div>
      <div class="stat clickable-hp" @click="openHPModal">
        <label>HP</label>
        <div class="hp-display">
          <span class="hp-current">{{ character.hitPoints.current }}</span>
          <span class="hp-separator">/</span>
          <span class="hp-max">{{ character.hitPoints.maximum }}</span>
          <span v-if="character.hitPoints.temporary && character.hitPoints.temporary > 0" class="hp-temp">
            +{{ character.hitPoints.temporary }}
          </span>
        </div>
      </div>
      <div class="stat">
        <label>Initiative</label>
        <div class="stat-display">{{ formatModifier(character.initiative) }}</div>
      </div>
      <div class="stat">
        <label>Proficiency</label>
        <div class="stat-display">{{ formatModifier(character.proficiencyBonus) }}</div>
      </div>
    </div>
    <CharacterEditModal
      :is-open="isEditModalOpen"
      @close="closeEditModal"
      @save="handleSaveCharacter"
    />
    <HPEditModal
      :is-open="isHPModalOpen"
      @close="closeHPModal"
    />
    <DiceHistoryModal
      :is-open="isHistoryModalOpen"
      @close="closeHistoryModal"
    />
  </div>
</template>

<script setup lang="ts">
const { character, updateCharacterName, updateCharacterImage, updateClassLevel } = useCharacter()

const isHistoryModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isHPModalOpen = ref(false)

const openHistoryModal = () => {
  isHistoryModalOpen.value = true
}

const closeHistoryModal = () => {
  isHistoryModalOpen.value = false
}

const openEditModal = () => {
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const openHPModal = () => {
  isHPModalOpen.value = true
}

const closeHPModal = () => {
  isHPModalOpen.value = false
}

const handleSaveCharacter = (name: string, classLevel: string, image: string) => {
  updateCharacterName(name)
  updateClassLevel(classLevel)
  updateCharacterImage(image)
}

const formatModifier = (value: number): string => {
  return value >= 0 ? `+${value}` : `${value}`
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

.name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.character-name-display {
  font-size: 1.8rem;
  font-weight: 700;
  font-family: 'Cinzel Decorative', 'Cinzel', serif;
  color: #2c1810;
  letter-spacing: 0.05em;
  flex: 1;
}

.edit-btn-small {
  background: linear-gradient(180deg, #8b4513 0%, #6b3410 100%);
  color: #f4e8d0;
  border: 2px solid #5c3a21;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.edit-btn-small:hover {
  background: linear-gradient(180deg, #9d5520 0%, #7b4415 100%);
  transform: translateY(-1px);
}

.class-level-display {
  font-size: 1.1rem;
  font-style: italic;
  font-family: 'Cinzel', serif;
  font-weight: 500;
  color: #5c3a21;
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

.stat-display {
  width: 60px;
  padding: 0.5rem;
  text-align: center;
  border: 2px solid #8b4513;
  border-radius: 4px;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.8);
  color: #2c1810;
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.clickable-hp {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable-hp:hover {
  transform: translateY(-2px);
}

.hp-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 2px solid #8b4513;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.hp-current,
.hp-max {
  font-size: 1.1rem;
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  color: #2c1810;
}

.hp-separator {
  font-size: 1.1rem;
  font-weight: bold;
  color: #666;
}

.hp-temp {
  font-size: 0.9rem;
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  color: #6b3410;
  margin-left: 0.25rem;
  padding: 0.125rem 0.375rem;
  background: rgba(139, 69, 19, 0.2);
  border-radius: 3px;
}
</style>

<template>
  <div class="character-header">
    <!-- Left Section: Character Identity -->
    <div class="header-left">
      <div class="character-image">
        <img v-if="character.image" :src="character.image" alt="Character" />
        <div v-else class="image-placeholder">Image</div>
      </div>
      <div class="character-info">
        <div class="name-row">
          <h1 class="character-name-display">{{ character.name }}</h1>
          <button @click="openEditModal" class="edit-btn-small" title="Edit Character">✎</button>
        </div>
        <p class="class-level-display">{{ character.classLevel }}</p>
        <div class="xp-display clickable" @click="openXPModal" title="Click to manage XP">
          <span class="xp-label">XP:</span>
          <span class="xp-current">{{ character.experiencePoints.current.toLocaleString() }}</span>
          <span class="xp-separator">/</span>
          <span class="xp-next">{{ character.experiencePoints.nextLevel.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Right Section: Combat Stats -->
    <div class="header-right">
      <div class="stats-row">
        <!-- AC - Square with Shield Icon -->
        <div class="stat-square">
          <div class="square-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <label class="square-label">AC</label>
          <div class="square-value">{{ character.ac }}</div>
        </div>

        <!-- HP - Clickable -->
        <div class="stat-card hp-card clickable" @click="openHPModal" title="Click to manage HP">
          <label class="stat-label">
            Hit Points
            <span class="click-hint">(Click)</span>
          </label>
          <div class="hp-display">
            <span class="hp-current">{{ character.hitPoints.current }}</span>
            <span class="hp-separator">/</span>
            <span class="hp-max">{{ character.hitPoints.maximum }}</span>
            <span v-if="character.hitPoints.temporary && character.hitPoints.temporary > 0" class="hp-temp">
              +{{ character.hitPoints.temporary }}
            </span>
          </div>
        </div>

        <!-- Initiative - Square with Icon, Clickable -->
        <div class="stat-square clickable" @click="rollInitiative" title="Click to roll initiative">
          <div class="square-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <label class="square-label">Initiative</label>
          <div class="square-value">{{ formatModifier(character.initiative) }}</div>
        </div>

        <!-- Proficiency Bonus - Square with Icon -->
        <div class="stat-square">
          <div class="square-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <label class="square-label">Proficiency</label>
          <div class="square-value">{{ formatModifier(character.proficiencyBonus) }}</div>
        </div>
      </div>

      <!-- Utility Button -->
      <button @click="openHistoryModal" class="history-btn" title="Dice History">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
          <path d="M21 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
          <path d="M3 12c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"/>
        </svg>
      </button>
    </div>

    <!-- Modals -->
    <CharacterEditModal
      :is-open="isEditModalOpen"
      @close="closeEditModal"
      @save="handleSaveCharacter"
    />
    <HPEditModal
      :is-open="isHPModalOpen"
      @close="closeHPModal"
    />
    <XPEditModal
      :is-open="isXPModalOpen"
      @close="closeXPModal"
    />
    <DiceHistoryModal
      :is-open="isHistoryModalOpen"
      @close="closeHistoryModal"
    />
    <Toast
      :is-visible="isToastVisible"
      :title="toast.title"
      :roll="toast.roll"
      :modifier="toast.modifier"
      :total="toast.total"
      @close="closeToast"
    />
  </div>
</template>

<script setup lang="ts">
const { character, updateCharacterName, updateCharacterImage, updateClassLevel } = useCharacter()
const { addRoll } = useDiceHistory()

const isHistoryModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isHPModalOpen = ref(false)
const isXPModalOpen = ref(false)
const isToastVisible = ref(false)

const toast = ref({
  title: '',
  roll: 0,
  modifier: 0,
  total: 0,
})

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

const openXPModal = () => {
  isXPModalOpen.value = true
}

const closeXPModal = () => {
  isXPModalOpen.value = false
}

const handleSaveCharacter = (name: string, image: string) => {
  updateCharacterName(name)
  updateCharacterImage(image)
}

const formatModifier = (value: number): string => {
  return value >= 0 ? `+${value}` : `${value}`
}

const rollD20 = (): number => {
  return Math.floor(Math.random() * 20) + 1
}

const rollInitiative = () => {
  const roll = rollD20()
  const modifier = character.value.initiative
  const total = roll + modifier
  const title = 'Initiative Roll'
  
  toast.value = {
    title,
    roll,
    modifier,
    total,
  }
  
  isToastVisible.value = true
  addRoll(title, roll, modifier)
  
  // Auto-hide toast after 3 seconds
  setTimeout(() => {
    isToastVisible.value = false
  }, 3000)
}

const closeToast = () => {
  isToastVisible.value = false
}
</script>

<style scoped>
.character-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  padding: 1.5rem;
  border-bottom: 3px double #8b4513;
  margin-bottom: 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(244, 232, 208, 0.1) 100%);
  border-radius: 4px;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.character-image {
  position: relative;
  width: 100px;
  height: 100px;
  border: 3px solid #8b4513;
  border-radius: 6px;
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
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Cinzel Decorative', 'Cinzel', serif;
  color: #2c1810;
  letter-spacing: 0.05em;
  margin: 0;
  flex: 1;
}

.edit-btn-small {
  background: linear-gradient(180deg, #8b4513 0%, #6b3410 100%);
  color: #f4e8d0;
  border: 2px solid #5c3a21;
  border-radius: 4px;
  padding: 0.375rem 0.625rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.edit-btn-small:hover {
  background: linear-gradient(180deg, #9d5520 0%, #7b4415 100%);
  transform: translateY(-1px);
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.class-level-display {
  font-size: 1.2rem;
  font-style: italic;
  font-family: 'Cinzel', serif;
  font-weight: 500;
  color: #5c3a21;
  letter-spacing: 0.03em;
  margin: 0.25rem 0 0 0;
}

.xp-display {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  padding: 0.375rem 0.5rem;
  background: rgba(255, 255, 255, 0.4);
  border: 2px solid #8b4513;
  border-radius: 4px;
  font-family: 'Cinzel', serif;
  transition: all 0.2s ease;
}

.xp-display.clickable {
  cursor: pointer;
}

.xp-display.clickable:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: #6b3410;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.xp-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #5c3a21;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.xp-current {
  font-size: 0.85rem;
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  color: #2c1810;
}

.xp-separator {
  font-size: 0.75rem;
  color: #666;
  font-weight: bold;
}

.xp-next {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b3410;
  font-family: 'Cinzel', serif;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: nowrap;
}

/* Square Stats with Icons */
.stat-square {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 90px;
  height: 90px;
  padding: 0.75rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(244, 232, 208, 0.4) 100%);
  border: 3px solid #8b4513;
  border-radius: 6px;
  box-shadow: 
    0 0 0 1px #d4a574,
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.stat-square.clickable {
  cursor: pointer;
}

.stat-square:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 0 0 1px #d4a574,
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.15);
}

.stat-square.clickable:hover {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(244, 232, 208, 0.6) 100%);
  border-color: #6b3410;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 0 0 1px #d4a574,
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 6px 12px rgba(0, 0, 0, 0.2);
}

.square-icon {
  color: #8b4513;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.square-icon svg {
  width: 100%;
  height: 100%;
}

.square-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #5c3a21;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

.square-value {
  font-size: 1.5rem;
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  color: #2c1810;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
}

/* HP Card */
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  min-width: 140px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(244, 232, 208, 0.4) 100%);
  border: 2px solid #8b4513;
  border-radius: 6px;
  box-shadow: 
    0 0 0 1px #d4a574,
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 0 0 1px #d4a574,
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.15);
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #5c3a21;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

/* HP Card - Special Styling */
.hp-card {
  cursor: pointer;
  background: linear-gradient(180deg, rgba(46, 125, 50, 0.15) 0%, rgba(244, 232, 208, 0.4) 100%);
  border-color: #2e7d32;
  border-width: 3px;
  position: relative;
}

.hp-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px dashed rgba(46, 125, 50, 0.5);
  border-radius: 6px;
  pointer-events: none;
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.hp-card:hover {
  background: linear-gradient(180deg, rgba(46, 125, 50, 0.25) 0%, rgba(244, 232, 208, 0.5) 100%);
  border-color: #1b5e20;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 0 0 1px #4caf50,
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 6px 12px rgba(46, 125, 50, 0.3);
}

.click-hint {
  font-size: 0.65rem;
  color: #2e7d32;
  font-weight: 400;
  font-style: italic;
  text-transform: none;
  letter-spacing: 0;
  margin-left: 0.25rem;
}

.hp-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #2e7d32;
  border-radius: 4px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hp-current,
.hp-max {
  font-size: 1.3rem;
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  color: #1b5e20;
}

.hp-separator {
  font-size: 1.2rem;
  font-weight: bold;
  color: #666;
}

.hp-temp {
  font-size: 0.85rem;
  font-weight: bold;
  font-family: 'MedievalSharp', 'Cinzel', serif;
  color: #6b3410;
  padding: 0.25rem 0.5rem;
  background: rgba(139, 69, 19, 0.25);
  border: 1px solid #9d5520;
  border-radius: 4px;
}

.history-btn {
  background: linear-gradient(180deg, #8b4513 0%, #6b3410 100%);
  color: #f4e8d0;
  border: 2px solid #5c3a21;
  border-radius: 6px;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.history-btn:hover {
  background: linear-gradient(180deg, #9d5520 0%, #7b4415 100%);
  transform: translateY(-2px);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
</style>

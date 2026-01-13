<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Character</h2>
        <button @click="close" class="close-btn">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="character-name">Character Name</label>
          <input
            id="character-name"
            v-model="editingName"
            type="text"
            class="form-input"
            placeholder="Enter character name"
          />
        </div>
        <div class="form-group">
          <label for="character-class">Class + Level</label>
          <input
            id="character-class"
            v-model="editingClassLevel"
            type="text"
            class="form-input"
            placeholder="e.g., Fighter 5"
          />
        </div>
        <div class="form-group">
          <label for="character-image">Character Image</label>
          <div class="image-preview">
            <img v-if="previewImage" :src="previewImage" alt="Preview" />
            <div v-else class="image-placeholder">No image</div>
          </div>
          <input
            id="character-image"
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="file-input"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="btn-cancel">Cancel</button>
        <button @click="save" class="btn-save">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [name: string, classLevel: string, image: string]
}>()

const { character } = useCharacter()

const editingName = ref(character.value.name)
const editingClassLevel = ref(character.value.classLevel)
const previewImage = ref(character.value.image || '')

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    editingName.value = character.value.name
    editingClassLevel.value = character.value.classLevel
    previewImage.value = character.value.image || ''
  }
})

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const close = () => {
  emit('close')
}

const save = () => {
  emit('save', editingName.value, editingClassLevel.value, previewImage.value)
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: linear-gradient(180deg, #f4e8d0 0%, #e8d4b8 100%);
  border: 4px double #8b4513;
  border-radius: 8px;
  box-shadow: 
    0 0 0 2px #d4a574,
    0 8px 32px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #8b4513;
  background: linear-gradient(180deg, rgba(139, 69, 19, 0.1) 0%, transparent 100%);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #5c3a21;
  letter-spacing: 0.05em;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #8b4513;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(139, 69, 19, 0.2);
  transform: scale(1.1);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #5c3a21;
  font-family: 'Cinzel', serif;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #8b4513;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.8);
  color: #2c1810;
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-input:focus {
  outline: none;
  border-color: #6b3410;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 0 0 3px rgba(139, 69, 19, 0.2);
}

.image-preview {
  width: 100%;
  height: 200px;
  border: 2px solid #8b4513;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  color: #666;
  font-style: italic;
}

.file-input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #8b4513;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.8);
  font-family: 'Cinzel', serif;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 2px solid #8b4513;
  background: linear-gradient(180deg, transparent 0%, rgba(139, 69, 19, 0.1) 100%);
}

.btn-cancel,
.btn-save {
  padding: 0.75rem 1.5rem;
  border: 2px solid #8b4513;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.6);
  color: #5c3a21;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

.btn-save {
  background: linear-gradient(180deg, #8b4513 0%, #6b3410 100%);
  color: #f4e8d0;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-save:hover {
  background: linear-gradient(180deg, #9d5520 0%, #7b4415 100%);
  transform: translateY(-1px);
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
</style>

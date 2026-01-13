<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="m-0 text-base font-cinzel font-semibold text-[var(--color-text-secondary)] tracking-wide">Edit Character</h2>
        <button
          @click="close"
          class="bg-transparent border-none text-xl text-[var(--color-accent-primary)] cursor-pointer w-6 h-6 flex items-center justify-center rounded transition-all duration-200 hover:bg-[var(--color-accent-primary)]/20 leading-none"
        >
          ×
        </button>
      </div>
      <div class="modal-body">
        <div class="mb-2">
          <label for="character-name" class="block mb-1 text-xs font-semibold text-[var(--color-text-secondary)] font-cinzel">Character Name</label>
          <input
            id="character-name"
            v-model="editingName"
            type="text"
            class="input text-sm"
            placeholder="Enter character name"
          />
        </div>
        <div class="mb-2">
          <label for="character-image" class="block mb-1 text-xs font-semibold text-[var(--color-text-secondary)] font-cinzel">Character Image</label>
          <div class="w-full h-32 border border-[var(--color-border-primary)] rounded overflow-hidden mb-1 bg-gray-100 flex items-center justify-center">
            <img v-if="previewImage" :src="previewImage" alt="Preview" class="w-full h-full object-cover" />
            <div v-else class="text-gray-600 italic text-sm">No image</div>
          </div>
          <input
            id="character-image"
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="input text-sm cursor-pointer"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="btn btn-secondary text-sm">Cancel</button>
        <button @click="save" class="btn btn-primary text-sm">Save</button>
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
  save: [name: string, image: string]
}>()

const { character } = useCharacter()

const editingName = ref(character.value.name)
const previewImage = ref(character.value.image || '')

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    editingName.value = character.value.name
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
  emit('save', editingName.value, previewImage.value)
  close()
}
</script>

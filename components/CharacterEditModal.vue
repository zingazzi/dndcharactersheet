<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="m-0 text-2xl font-cinzel font-semibold text-text-brown tracking-wide">Edit Character</h2>
        <button
          @click="close"
          class="bg-transparent border-none text-3xl text-brown cursor-pointer w-8 h-8 flex items-center justify-center rounded transition-all duration-200 hover:bg-brown/20 hover:scale-110 leading-none"
        >
          ×
        </button>
      </div>
      <div class="modal-body">
        <div class="mb-6">
          <label for="character-name" class="block mb-2 font-semibold text-text-brown font-cinzel">Character Name</label>
          <input
            id="character-name"
            v-model="editingName"
            type="text"
            class="input-dnd"
            placeholder="Enter character name"
          />
        </div>
        <div class="mb-6">
          <label for="character-image" class="block mb-2 font-semibold text-text-brown font-cinzel">Character Image</label>
          <div class="w-full h-[200px] border-2 border-brown rounded overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
            <img v-if="previewImage" :src="previewImage" alt="Preview" class="w-full h-full object-cover" />
            <div v-else class="text-gray-600 italic">No image</div>
          </div>
          <input
            id="character-image"
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="input-dnd cursor-pointer"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="btn-dnd-secondary">Cancel</button>
        <button @click="save" class="btn-dnd-primary">Save</button>
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

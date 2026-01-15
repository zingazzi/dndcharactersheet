<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <div class="modal-header">
        <h2 class="m-0 text-base font-cinzel font-semibold text-[var(--color-text-secondary)]">Manage Equipment</h2>
        <button
          @click="close"
          class="bg-transparent border-none text-xl text-[var(--color-accent-primary)] cursor-pointer w-6 h-6 flex items-center justify-center rounded transition-all duration-200 hover:bg-[var(--color-accent-primary)]/20 leading-none"
        >
          ×
        </button>
      </div>
      <div class="modal-body flex-1 overflow-hidden flex flex-col">
        <!-- Search and Filters -->
        <div class="mb-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search items..."
            class="input w-full mb-1.5"
          />
          <div class="flex gap-1 flex-wrap">
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = selectedCategory === category ? 'all' : category"
              :class="[
                'btn text-xs px-2 py-1',
                selectedCategory === category ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1) }}
            </button>
          </div>
        </div>

        <!-- Item List -->
        <div class="flex-1 overflow-y-auto">
          <div class="grid grid-cols-1 gap-1.5">
            <div
              v-for="item in filteredItems"
              :key="item.name"
              class="card-compact p-2"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-sm font-bold text-[var(--color-text-primary)] m-0">{{ item.name }}</h3>
                    <span class="text-xs px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded text-[var(--color-text-tertiary)]">
                      {{ item.category }}
                    </span>
                    <span class="text-xs text-[var(--color-text-tertiary)]">{{ item.weight }} lbs</span>
                    <span v-if="item.cost" class="text-xs text-[var(--color-text-tertiary)]">{{ item.cost }} gp</span>
                  </div>
                  <p v-if="item.description" class="text-xs text-[var(--color-text-secondary)] mb-1">{{ item.description }}</p>
                  <div v-if="item.weaponData" class="text-xs text-[var(--color-text-tertiary)]">
                    <span>{{ item.weaponData.damage }} {{ item.weaponData.damageType }}</span>
                    <span class="mx-1">•</span>
                    <span>{{ item.weaponData.range }}</span>
                  </div>
                  <div v-if="item.armorData" class="text-xs text-[var(--color-text-tertiary)]">
                    <span>{{ item.armorData.type }} armor</span>
                    <span class="mx-1">•</span>
                    <span>AC {{ item.armorData.baseAC }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <input
                    v-model.number="itemQuantities[item.name]"
                    type="number"
                    min="1"
                    class="input text-xs w-16 py-1 px-1 text-center"
                    placeholder="Qty"
                  />
                  <button
                    @click="addItemToInventory(item)"
                    class="btn btn-primary text-xs px-2 py-1"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div v-if="filteredItems.length === 0" class="text-center py-4 text-[var(--color-text-muted)] italic text-sm">
              No items found
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-[var(--color-accent-primary)] text-white px-4 py-2 rounded shadow-lg z-[1001] animate-fade-in"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ItemData, InventoryItem } from '~/types/character'
import { ITEM_DATABASE } from '~/composables/useCharacter'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { character, addInventoryItem } = useCharacter()

const searchQuery = ref('')
const selectedCategory = ref<'all' | ItemData['category']>('all')
const itemQuantities = ref<Record<string, number>>({})
const showToast = ref(false)
const toastMessage = ref('')

const categories: Array<'all' | ItemData['category']> = [
  'all',
  'weapon',
  'armor',
  'shield',
  'gear',
  'tool',
  'consumable',
  'other',
]

const filteredItems = computed(() => {
  let items = ITEM_DATABASE

  // Filter by category
  if (selectedCategory.value !== 'all') {
    items = items.filter(item => item.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }

  return items
})

const addItemToInventory = (itemData: ItemData) => {
  const quantity = itemQuantities.value[itemData.name] || 1
  
  const inventoryItem: Omit<InventoryItem, 'id'> = {
    name: itemData.name,
    quantity,
    weight: itemData.weight,
    description: itemData.description,
    equipped: false,
  }

  // Auto-detect armor/weapon properties
  if (itemData.armorData) {
    inventoryItem.armorType = itemData.armorData.type === 'shield' ? 'shield' : itemData.armorData.type
    inventoryItem.baseAC = itemData.armorData.baseAC
  } else if (itemData.weaponData) {
    // Weapons don't need special properties, but we could add them if needed
  }

  addInventoryItem(inventoryItem)
  
  // Show toast notification
  toastMessage.value = `Added ${quantity}x ${itemData.name} to inventory`
  showToast.value = true
  
  // Auto-hide toast after 3 seconds
  setTimeout(() => {
    showToast.value = false
  }, 3000)
  
  // Reset quantity for this item
  itemQuantities.value[itemData.name] = 1
}

const close = () => {
  emit('close')
}

// Initialize quantities
onMounted(() => {
  ITEM_DATABASE.forEach(item => {
    itemQuantities.value[item.name] = 1
  })
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <CombatStats />
    <HitPointsCompact />

    <!-- Attacks & Spells -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Attacks & Spells</h3>
        <button
          @click="showAddForm = !showAddForm"
          class="btn btn-primary text-sm px-2 py-1"
        >
          {{ showAddForm ? 'Cancel' : '+' }}
        </button>
      </div>
      <div v-if="showAddForm" class="p-2 bg-[var(--color-bg-secondary)] rounded mb-2">
        <div class="flex gap-1 mb-1">
          <input
            v-model="newAction.name"
            type="text"
            placeholder="Name"
            class="input text-sm py-1 px-1.5 flex-1"
          />
          <input
            v-model="newAction.toHit"
            type="text"
            placeholder="To Hit"
            class="input text-sm py-1 px-1.5 w-20"
          />
          <input
            v-model="newAction.damage"
            type="text"
            placeholder="Damage"
            class="input text-sm py-1 px-1.5 flex-1"
          />
        </div>
        <button @click="handleAddAction" class="btn btn-primary text-sm px-2 py-1 w-full">Add</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-[var(--color-border-divider)]">
              <th class="text-left py-1 px-1 font-semibold text-[var(--color-text-secondary)]">Name</th>
              <th class="text-center py-1 px-1 font-semibold text-[var(--color-text-secondary)]">To Hit</th>
              <th class="text-left py-1 px-1 font-semibold text-[var(--color-text-secondary)]">Damage/Type</th>
              <th class="w-6"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="action in character.actions"
              :key="action.id"
              class="table-row"
            >
              <td class="py-1 px-1">
                <input
                  v-model="action.name"
                  type="text"
                  class="input text-sm py-0.5 px-1 w-full"
                />
              </td>
              <td class="py-1 px-1">
                <input
                  v-model="action.toHit"
                  type="text"
                  class="input text-sm py-0.5 px-1 w-full text-center"
                />
              </td>
              <td class="py-1 px-1">
                <input
                  v-model="action.damage"
                  type="text"
                  class="input text-sm py-0.5 px-1 w-full"
                />
              </td>
              <td class="py-1 px-1 text-center">
                <button
                  @click="removeAction(action.id)"
                  class="btn btn-danger text-sm px-1.5 py-0.5"
                >
                  ×
                </button>
              </td>
            </tr>
            <tr v-if="character.actions.length === 0">
              <td colspan="4" class="py-2 text-center text-[var(--color-text-muted)] italic text-sm">
                No attacks added
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Spells -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Spells</h3>
        <button
          @click="showSpellForm = !showSpellForm"
          class="btn btn-primary text-sm px-2 py-1"
        >
          {{ showSpellForm ? 'Cancel' : '+' }}
        </button>
      </div>
      <!-- Spell Slots -->
      <div class="mb-2 pb-2 border-b border-[var(--color-border-divider)]">
        <div class="text-sm text-[var(--color-text-tertiary)] mb-1">Spell Slots</div>
        <div class="grid grid-cols-4 gap-1">
          <div
            v-for="slot in character.spellSlots.slice(0, 4)"
            :key="slot.level"
            class="text-center"
          >
            <div class="text-xs text-[var(--color-text-tertiary)]">L{{ slot.level }}</div>
            <div class="flex items-center justify-center gap-0.5">
              <input
                v-model.number="slot.used"
                type="number"
                :max="slot.total"
                min="0"
                class="input text-sm py-0.5 px-1 w-8 text-center"
              />
              <span class="text-[var(--color-text-tertiary)]">/</span>
              <input
                v-model.number="slot.total"
                type="number"
                min="0"
                class="input text-sm py-0.5 px-1 w-8 text-center"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Spell List -->
      <div v-if="showSpellForm" class="p-2 bg-[var(--color-bg-secondary)] rounded mb-2">
        <input
          v-model="newSpell.name"
          type="text"
          placeholder="Spell Name"
          class="input text-sm py-1 px-1.5 mb-1 w-full"
        />
        <div class="flex gap-1 mb-1">
          <input
            v-model.number="newSpell.level"
            type="number"
            placeholder="Lvl"
            min="0"
            max="9"
            class="input text-sm py-1 px-1.5 w-16"
          />
          <input
            v-model="newSpell.school"
            type="text"
            placeholder="School"
            class="input text-sm py-1 px-1.5 flex-1"
          />
        </div>
        <button @click="handleAddSpell" class="btn btn-primary text-xs px-1.5 py-0.5 w-full">Add</button>
      </div>
      <div class="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
        <div
          v-for="spell in character.spells"
          :key="spell.id"
          class="card-compact p-1.5"
        >
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-1">
              <span class="text-sm font-bold">{{ spell.name }}</span>
              <span class="text-xs text-[var(--color-text-tertiary)] px-1 py-0.5 bg-[var(--color-bg-secondary)] rounded">L{{ spell.level }}</span>
              <span v-if="spell.prepared" class="text-xs text-[var(--color-success)] bg-[var(--color-success)]/20 px-1 py-0.5 rounded">P</span>
            </div>
            <button
              @click="removeSpell(spell.id)"
              class="btn btn-danger text-sm px-1.5 py-0.5"
            >
              ×
            </button>
          </div>
          <div class="text-xs text-[var(--color-text-tertiary)]">{{ spell.school }} • {{ spell.castingTime }}</div>
        </div>
        <div v-if="character.spells.length === 0" class="text-center py-2 text-[var(--color-text-muted)] italic text-sm">
          No spells
        </div>
      </div>
    </div>

    <!-- Equipment -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Equipment</h3>
        <button
          @click="showItemForm = !showItemForm"
          class="btn btn-primary text-sm px-2 py-1"
        >
          {{ showItemForm ? 'Cancel' : '+' }}
        </button>
      </div>
      <div v-if="showItemForm" class="p-2 bg-[var(--color-bg-secondary)] rounded mb-2">
        <input
          v-model="newItem.name"
          type="text"
          placeholder="Item Name"
          class="input text-sm py-1 px-1.5 mb-1 w-full"
        />
        <div class="flex gap-1 mb-1">
          <input
            v-model.number="newItem.quantity"
            type="number"
            placeholder="Qty"
            min="1"
            class="input text-sm py-1 px-1.5 w-16"
          />
          <input
            v-model.number="newItem.weight"
            type="number"
            placeholder="Weight"
            min="0"
            step="0.1"
            class="input text-sm py-1 px-1.5 w-20"
          />
        </div>
        <button @click="handleAddItem" class="btn btn-primary text-xs px-1.5 py-0.5 w-full">Add</button>
      </div>
      <div class="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
        <div
          v-for="item in character.inventory"
          :key="item.id"
          class="card-compact p-1.5"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1 flex-1 min-w-0">
              <span class="text-sm font-semibold truncate">{{ item.name }}</span>
              <span class="text-xs text-[var(--color-text-tertiary)]">×{{ item.quantity }}</span>
              <span class="text-xs text-[var(--color-text-muted)]">{{ item.weight }}lbs</span>
            </div>
            <button
              @click="removeInventoryItem(item.id)"
              class="btn btn-danger text-xs px-1 py-0.5 shrink-0"
            >
              ×
            </button>
          </div>
        </div>
        <div v-if="character.inventory.length === 0" class="text-center py-2 text-[var(--color-text-muted)] italic text-sm">
          No items
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Action, Spell, InventoryItem } from '~/types/character'

const { character, addAction, removeAction, addSpell, removeSpell, addInventoryItem, removeInventoryItem } = useCharacter()

const showAddForm = ref(false)
const showSpellForm = ref(false)
const showItemForm = ref(false)

const newAction = ref<Omit<Action, 'id'>>({
  name: '',
  type: '',
  range: '',
  toHit: '',
  damage: '',
  description: '',
})

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

const newItem = ref<Omit<InventoryItem, 'id'>>({
  name: '',
  quantity: 1,
  weight: 0,
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
    showSpellForm.value = false
  }
}

const handleAddItem = () => {
  if (newItem.value.name.trim()) {
    addInventoryItem(newItem.value)
    newItem.value = {
      name: '',
      quantity: 1,
      weight: 0,
      description: '',
    }
    showItemForm.value = false
  }
}
</script>

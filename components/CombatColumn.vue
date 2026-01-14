<template>
  <div class="flex flex-col gap-2">
    <CombatStats />
    <HitPointsCompact />

    <!-- Rage (Barbarian only) -->
    <div v-if="character.classType === 'Barbarian' && character.rage" class="section">
      <div class="section-header">
        <h3 class="section-title">Rage</h3>
        <div class="flex items-center gap-1">
          <span
            v-if="character.rage.active"
            class="text-xs font-semibold text-[var(--color-danger)] bg-[var(--color-danger)]/20 px-1.5 py-0.5 rounded"
          >
            ACTIVE
          </span>
          <span class="text-xs text-[var(--color-text-tertiary)]">
            {{ character.rage.usesAvailable }} / {{ character.rage.usesMax }}
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <div class="card-compact flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-[var(--color-text-secondary)]">Damage Bonus</div>
            <div class="text-base font-bold font-medieval text-[var(--color-text-primary)]">+{{ character.rage.damageBonus }}</div>
          </div>
          <div class="flex gap-1">
            <button
              v-if="!character.rage.active"
              @click="handleActivateRage"
              :disabled="character.rage.usesAvailable <= 0"
              class="btn btn-primary text-sm px-2 py-1"
            >
              Activate
            </button>
            <button
              v-else
              @click="handleDeactivateRage"
              class="btn btn-danger text-sm px-2 py-1"
            >
              End Rage
            </button>
            <button
              v-if="character.rage.active"
              @click="handleExtendRage"
              class="btn btn-success text-sm px-2 py-1"
            >
              Extend
            </button>
          </div>
        </div>
        <div v-if="character.rage.active" class="text-xs text-[var(--color-text-tertiary)] italic">
          Resistance to B/P/S damage • Advantage on STR checks/saves • +{{ character.rage.damageBonus }} damage
        </div>
      </div>
    </div>

    <!-- Attacks & Spells -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Attacks</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-[var(--color-border-divider)]">
              <th class="text-left py-1 px-1 font-semibold text-[var(--color-text-secondary)]">Name</th>
              <th class="text-center py-1 px-1 font-semibold text-[var(--color-text-secondary)]">To Hit</th>
              <th class="text-left py-1 px-1 font-semibold text-[var(--color-text-secondary)]">Damage/Type</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="action in character.actions"
              :key="action.id"
              class="border-b border-[var(--color-border-divider)] hover:bg-[var(--color-bg-secondary)]/50"
            >
              <td class="py-1 px-1">
                <span class="text-sm font-semibold text-[var(--color-text-primary)]">{{ action.name }}</span>
              </td>
              <td class="py-1 px-1 text-center">
                <button
                  @click="rollAttack(action)"
                  class="clickable-text text-sm font-bold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-dark)] transition-colors"
                  title="Click to roll attack"
                >
                  {{ action.toHit }}
                </button>
              </td>
              <td class="py-1 px-1">
                <button
                  @click="rollDamage(action)"
                  class="clickable-text text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors text-left w-full"
                  title="Click to roll damage"
                >
                  {{ action.damage }}
                </button>
              </td>
            </tr>
            <tr v-if="character.actions.length === 0">
              <td colspan="3" class="py-2 text-center text-[var(--color-text-muted)] italic text-sm">
                No attacks (equip weapons to add attacks)
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
          @click="showEquipmentModal = true"
          class="btn btn-primary text-sm px-2 py-1"
        >
          Manage
        </button>
      </div>
      <div class="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
        <div
          v-for="item in character.inventory"
          :key="item.id"
          class="card-compact p-1.5"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1 flex-1 min-w-0">
              <span class="text-sm font-semibold truncate" :class="{ 'text-[var(--color-accent-primary)]': item.equipped }">{{ item.name }}</span>
              <span v-if="item.equipped" class="text-xs px-1 py-0.5 bg-[var(--color-accent-primary)] text-white rounded font-semibold shrink-0">EQ</span>
              <span class="text-xs text-[var(--color-text-tertiary)]">×{{ item.quantity }}</span>
              <span class="text-xs text-[var(--color-text-muted)]">{{ item.weight }}lbs</span>
            </div>
            <div class="flex items-center gap-0.5 shrink-0">
              <button
                v-if="isArmorOrShield(item)"
                @click="toggleEquipItem(item.id)"
                :class="[
                  'btn text-xs px-1 py-0.5',
                  item.equipped ? 'btn-secondary' : 'btn-primary'
                ]"
                :title="item.equipped ? 'Unequip' : 'Equip'"
              >
                {{ item.equipped ? '✓' : '⚔' }}
              </button>
              <button
                @click="removeInventoryItem(item.id)"
                class="btn btn-danger text-xs px-1 py-0.5"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        <div v-if="character.inventory.length === 0" class="text-center py-2 text-[var(--color-text-muted)] italic text-sm">
          No items
        </div>
      </div>
    </div>

    <!-- Equipment Modal -->
    <EquipmentModal
      :is-open="showEquipmentModal"
      @close="showEquipmentModal = false"
    />

    <!-- Toast for dice rolls -->
    <Toast
      :is-visible="isToastVisible"
      :title="toast.title"
      :roll="toast.roll"
      :modifier="toast.modifier"
      :total="toast.total"
      @close="isToastVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { Action, Spell, InventoryItem } from '~/types/character'

const { character, addAction, removeAction, convertToManualAttack, addSpell, removeSpell, addInventoryItem, removeInventoryItem, toggleEquipItem, getArmorData, activateRage, deactivateRage, extendRage } = useCharacter()
const { addRoll } = useDiceHistory()

const showAddForm = ref(false)
const showSpellForm = ref(false)
const showEquipmentModal = ref(false)

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

const isArmorOrShield = (item: InventoryItem): boolean => {
  // Check if item has armorType set
  if (item.armorType) return true
  // Check if item name matches armor database
  const armorData = getArmorData(item.name)
  return armorData !== null
}

const handleActivateRage = () => {
  activateRage()
}

const handleDeactivateRage = () => {
  deactivateRage()
}

const handleExtendRage = () => {
  extendRage()
}

// Dice rolling functionality
const isToastVisible = ref(false)
const toast = ref({
  title: '',
  roll: 0,
  modifier: 0,
  total: 0,
})

const rollD20 = (): number => {
  return Math.floor(Math.random() * 20) + 1
}

const rollDice = (diceString: string): number => {
  // Parse dice string like "1d8" or "2d6"
  const match = diceString.match(/(\d+)d(\d+)/)
  if (!match) return 0
  
  const numDice = parseInt(match[1])
  const sides = parseInt(match[2])
  let total = 0
  
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * sides) + 1
  }
  
  return total
}

const rollAttack = (action: Action) => {
  const roll = rollD20()
  
  // Parse modifier from toHit (e.g., "+7" or "-2")
  const modifierMatch = action.toHit.match(/([+-]?\d+)/)
  const modifier = modifierMatch ? parseInt(modifierMatch[1]) : 0
  
  const total = roll + modifier
  const title = `${action.name} - Attack Roll`
  
  toast.value = {
    title,
    roll,
    modifier,
    total,
  }
  
  isToastVisible.value = true
  addRoll(title, roll, modifier)
  
  setTimeout(() => {
    isToastVisible.value = false
  }, 3000)
}

const rollDamage = (action: Action) => {
  // Parse damage string like "1d8 + 3 slashing"
  const damageString = action.damage
  
  // Extract dice (e.g., "1d8", "2d6")
  const diceMatch = damageString.match(/(\d+d\d+)/)
  const diceRoll = diceMatch ? rollDice(diceMatch[1]) : 0
  
  // Extract modifier (e.g., "+ 3" or "- 2")
  const modifierMatch = damageString.match(/([+-]\s*\d+)/)
  const modifier = modifierMatch ? parseInt(modifierMatch[1].replace(/\s/g, '')) : 0
  
  const total = diceRoll + modifier
  const title = `${action.name} - Damage`
  
  toast.value = {
    title,
    roll: diceRoll,
    modifier,
    total,
  }
  
  isToastVisible.value = true
  addRoll(title, diceRoll, modifier)
  
  setTimeout(() => {
    isToastVisible.value = false
  }, 3000)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <CombatStats />
    <HitPointsCompact />

    <!-- Resources (limited-use features) -->
    <div v-if="resourceList.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Resources</h3>
        <div class="flex gap-1">
          <button @click="shortRest" class="btn btn-secondary text-xs px-2 py-1" title="Reset short-rest resources">
            Short Rest
          </button>
          <button @click="longRest" class="btn btn-primary text-xs px-2 py-1" title="Reset all resources">
            Long Rest
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <div
          v-for="pool in resourceList"
          :key="pool.id"
          class="card-compact flex items-center justify-between gap-2"
        >
          <div class="min-w-0">
            <div class="flex items-center gap-1 min-w-0">
              <div class="text-sm font-semibold text-[var(--color-text-secondary)] truncate">{{ pool.label }}</div>
              <button
                v-if="pool.description"
                @click="toggleResourceHelp(pool.id)"
                class="bg-transparent border border-[var(--color-border-primary)] rounded px-1 text-[0.7rem] leading-none text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors shrink-0"
                title="Show description"
                aria-label="Show resource description"
              >
                ?
              </button>
            </div>
            <div class="text-xs text-[var(--color-text-tertiary)]">
              {{ pool.current }} / {{ pool.max }}
              <span class="text-[var(--color-text-tertiary)]">•</span>
              <span class="italic">{{ formatReset(pool.reset) }}</span>
            </div>
            <div
              v-if="isHelpOpen(pool.id) && pool.description"
              class="text-xs text-[var(--color-text-tertiary)] italic mt-1"
            >
              {{ pool.description }}
            </div>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <label v-if="pool.active !== undefined" class="flex items-center gap-1 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                :checked="pool.active"
                :disabled="!pool.active && pool.current <= 0"
                @change="toggleResourceActive(pool.id)"
              />
              <span :class="pool.active ? 'text-[var(--color-danger)] font-semibold' : 'text-[var(--color-text-tertiary)]'">
                Active
              </span>
            </label>
            <button
              @click="spendResource(pool.id)"
              class="btn btn-danger text-xs px-2 py-1"
              :disabled="pool.current <= 0"
              title="Spend use"
            >
              -
            </button>
            <button
              @click="restoreResource(pool.id)"
              class="btn btn-success text-xs px-2 py-1"
              :disabled="pool.current >= pool.max"
              title="Restore use"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Action</h3>
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
              v-for="action in regularActions"
              :key="action.id"
              class="border-b border-[var(--color-border-divider)] hover:bg-[var(--color-bg-secondary)]/50"
            >
              <td class="py-1 px-1">
                <span class="text-sm font-semibold text-[var(--color-text-primary)]">{{ action.name }}</span>
              </td>
              <td class="py-1 px-1 text-center">
                <button
                  v-if="action.toHit !== '-'"
                  @click="rollAttack(action)"
                  class="clickable-text text-sm font-bold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-dark)] transition-colors"
                  title="Click to roll attack"
                >
                  {{ action.toHit }}
                </button>
                <span v-else class="text-sm text-[var(--color-text-tertiary)]">-</span>
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
            <tr v-if="regularActions.length === 0">
              <td colspan="3" class="py-2 text-center text-[var(--color-text-muted)] italic text-sm">
                No attacks (equip weapons to add attacks)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bonus Actions -->
    <div v-if="bonusActions.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Bonus Actions</h3>
      </div>
      <div class="flex flex-col gap-1.5">
        <div
          v-for="action in bonusActions"
          :key="action.id"
          class="card-compact p-2"
        >
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-sm font-semibold text-[var(--color-text-primary)]">{{ action.name }}</span>
            <div class="flex items-center gap-2 shrink-0">
              <span v-if="action.toHit !== '-'" class="text-xs text-[var(--color-text-tertiary)]">
                To Hit: 
                <button
                  @click="rollAttack(action)"
                  class="clickable-text text-sm font-bold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-dark)] transition-colors"
                  title="Click to roll attack"
                >
                  {{ action.toHit }}
                </button>
              </span>
              <button
                v-if="action.damage !== '-'"
                @click="rollDamage(action)"
                class="clickable-text text-xs text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors"
                title="Click to roll damage"
              >
                {{ action.damage }}
              </button>
            </div>
          </div>
          <div v-if="action.description" class="text-xs text-[var(--color-text-tertiary)] italic">
            {{ action.description }}
          </div>
        </div>
      </div>
    </div>

    <!-- Bonus Actions -->
    <div  class="section">
      <div class="section-header">
        <h3 class="section-title">Bonus action</h3>
      </div>
      <div class="flex flex-col gap-1">
        <div
          v-for="action in bonusActions"
          :key="action.id"
          class="flex items-center justify-between py-1 px-1 border-b border-[var(--color-border-divider)] last:border-b-0 hover:bg-[var(--color-bg-secondary)]/50"
        >
          <span class="text-sm font-semibold text-[var(--color-text-primary)]">{{ action.name }}</span>
          <div class="flex items-center gap-2 shrink-0">
            <span v-if="action.toHit !== '-'" class="text-xs text-[var(--color-text-tertiary)]">
              <button
                @click="rollAttack(action)"
                class="clickable-text text-sm font-bold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-dark)] transition-colors"
                title="Click to roll attack"
              >
                {{ action.toHit }}
              </button>
            </span>
            <button
              v-if="action.damage !== '-'"
              @click="rollDamage(action)"
              class="clickable-text text-xs text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors"
              title="Click to roll damage"
            >
              {{ action.damage }}
            </button>
          </div>
        </div>
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
                v-if="isEquippable(item)"
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
import type { Action, Spell, InventoryItem, ResourcePool } from '~/types/character'

const { character, addAction, removeAction, convertToManualAttack, addSpell, removeSpell, addInventoryItem, removeInventoryItem, toggleEquipItem, getArmorData, getWeaponData, spendResource, restoreResource, toggleResourceActive, shortRest, longRest } = useCharacter()
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

const isEquippable = (item: InventoryItem): boolean => {
  // Check if item is a weapon
  if (getWeaponData(item.name)) return true
  // Check if item has armorType set
  if (item.armorType) return true
  // Check if item name matches armor database
  const armorData = getArmorData(item.name)
  return armorData !== null
}

const resourceList = computed(() => {
  const pools = character.value.resources
  if (!pools) return [] as ResourcePool[]
  return Object.values(pools).sort((a, b) => a.label.localeCompare(b.label))
})

const regularActions = computed(() => {
  return character.value.actions.filter(action => !action.isBonusAction)
})

const bonusActions = computed(() => {
  return character.value.actions.filter(action => action.isBonusAction)
})

const openHelpFor = ref<Set<string>>(new Set())

const isHelpOpen = (resourceId: string): boolean => {
  return openHelpFor.value.has(resourceId)
}

const toggleResourceHelp = (resourceId: string): void => {
  const next = new Set(openHelpFor.value)
  if (next.has(resourceId)) {
    next.delete(resourceId)
  } else {
    next.add(resourceId)
  }
  openHelpFor.value = next
}

const formatReset = (reset: ResourcePool['reset']): string => {
  if (reset === 'shortRest') return 'Short Rest'
  if (reset === 'longRest') return 'Long Rest'
  return 'Daily'
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
  
  // Recalculate to-hit modifier based on weapon type
  let modifier = 0
  
  // Check if this is a weapon from the database
  const weaponData = getWeaponData(action.name)
  
  if (weaponData) {
    // Get the appropriate ability modifier
    const strModifier = character.value.abilities.strength.modifier
    const dexModifier = character.value.abilities.dexterity.modifier
    const proficiencyBonus = character.value.proficiencyBonus
    
    // Determine which modifier to use based on weapon ability
    let abilityModifier = 0
    if (weaponData.ability === 'strength') {
      abilityModifier = strModifier
    } else if (weaponData.ability === 'dexterity') {
      abilityModifier = dexModifier
    } else if (weaponData.ability === 'finesse') {
      // For finesse weapons, use the higher of STR or DEX
      abilityModifier = Math.max(strModifier, dexModifier)
    }
    
    modifier = abilityModifier + proficiencyBonus
  } else if (action.name === 'Unarmed Strike') {
    // Unarmed Strike uses STR + proficiency
    modifier = character.value.abilities.strength.modifier + character.value.proficiencyBonus
  } else {
    // For custom/manual attacks, parse modifier from toHit string
    const modifierMatch = action.toHit.match(/([+-]?\d+)/)
    modifier = modifierMatch ? parseInt(modifierMatch[1]) : 0
  }
  
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
  // Parse damage string like "1d8 + 3 slashing" or "1d8 + 3 slashing + 2 (rage)" or "1d8 + 3 slashing + 1d6 (sneak attack)"
  const damageString = action.damage
  
  // Extract main weapon dice (e.g., "1d8", "2d6")
  const diceMatch = damageString.match(/(\d+d\d+)/)
  const diceRoll = diceMatch ? rollDice(diceMatch[1]) : 0
  
  // Handle Sneak Attack separately (it's its own action)
  if (action.name === 'Sneak Attack') {
    const diceRoll = rollDice(damageString)
    const title = `${action.name} - Damage`
    
    toast.value = {
      title,
      roll: diceRoll,
      modifier: 0,
      total: diceRoll,
    }
    
    isToastVisible.value = true
    addRoll(title, diceRoll, 0)
    
    setTimeout(() => {
      isToastVisible.value = false
    }, 3000)
    return
  }
  
  // Recalculate modifier based on weapon type
  let modifier = 0
  let rageBonus = 0
  
  // Check if this is a weapon from the database
  const weaponData = getWeaponData(action.name)
  
  if (weaponData) {
    // Get the appropriate ability modifier
    const strModifier = character.value.abilities.strength.modifier
    const dexModifier = character.value.abilities.dexterity.modifier
    
    // Determine which modifier to use based on weapon ability
    if (weaponData.ability === 'strength') {
      modifier = strModifier
    } else if (weaponData.ability === 'dexterity') {
      modifier = dexModifier
    } else if (weaponData.ability === 'finesse') {
      // For finesse weapons, use the higher of STR or DEX
      modifier = Math.max(strModifier, dexModifier)
    }
    
    // Add rage bonus if Barbarian is raging and using STR
    const hasBarbarian = (character.value.classes ?? []).some(c => c.classType === 'Barbarian')
    if (hasBarbarian && 
        character.value.rage?.active && 
        (weaponData.ability === 'strength' || 
         (weaponData.ability === 'finesse' && strModifier >= dexModifier))) {
      rageBonus = character.value.rage.damageBonus
    }
  } else if (action.name === 'Unarmed Strike') {
    // Unarmed Strike uses STR
    modifier = character.value.abilities.strength.modifier
    
    // Add rage bonus for Barbarian
    const hasBarbarian = (character.value.classes ?? []).some(c => c.classType === 'Barbarian')
    if (hasBarbarian && character.value.rage?.active) {
      rageBonus = character.value.rage.damageBonus
    }
  } else {
    // For custom/manual attacks, try to extract modifier from the damage string
    const modifierMatch = damageString.match(/([+-]\s*\d+)/)
    modifier = modifierMatch ? parseInt(modifierMatch[1].replace(/\s/g, '')) : 0
    
    // Try to extract rage bonus if present
    const rageMatch = damageString.match(/\+\s*(\d+)\s*\(rage\)/)
    if (rageMatch) {
      rageBonus = parseInt(rageMatch[1])
    }
  }
  
  const totalModifier = modifier + rageBonus
  const total = diceRoll + totalModifier
  const title = `${action.name} - Damage`
  
  toast.value = {
    title,
    roll: diceRoll,
    modifier: totalModifier,
    total,
  }
  
  isToastVisible.value = true
  addRoll(title, diceRoll, totalModifier)
  
  setTimeout(() => {
    isToastVisible.value = false
  }, 3000)
}
</script>

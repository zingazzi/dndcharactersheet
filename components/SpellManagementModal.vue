<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <div class="modal-header">
        <h2 class="m-0 text-base font-cinzel font-semibold text-[var(--color-text-secondary)]">Manage Spells</h2>
        <button
          @click="close"
          class="bg-transparent border-none text-xl text-[var(--color-accent-primary)] cursor-pointer w-6 h-6 flex items-center justify-center rounded transition-all duration-200 hover:bg-[var(--color-accent-primary)]/20 leading-none"
        >
          ×
        </button>
      </div>
      <div class="modal-body flex-1 overflow-hidden flex flex-col">
        <!-- Spell Preparation Limits -->
        <div v-if="isPaladin" class="mb-2 p-2 bg-[var(--color-bg-secondary)] rounded border border-[var(--color-border-light)]">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-semibold text-[var(--color-text-secondary)]">Prepared Spells:</span>
            <span :class="[
              'text-xs font-bold',
              preparedCount >= maxPreparedSpells ? 'text-[var(--color-warning)]' : 'text-[var(--color-text-primary)]'
            ]">
              {{ preparedCount }} / {{ maxPreparedSpells }}
            </span>
          </div>
          <div v-if="preparedCount >= maxPreparedSpells" class="text-xs text-[var(--color-warning)] mb-1">
            ⚠️ Preparation limit reached
          </div>
          <div class="text-xs text-[var(--color-text-tertiary)]">
            Spell Slots:
            <span v-for="(slot, idx) in spellSlotsByLevel" :key="slot.level">
              Level {{ slot.level }}: {{ slot.total }}<span v-if="idx < spellSlotsByLevel.length - 1">, </span>
            </span>
            <span v-if="spellSlotsByLevel.length === 0">None</span>
          </div>
        </div>
        <!-- Search and Filters -->
        <div class="mb-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search spells..."
            class="input w-full mb-1.5"
          />
          <div class="flex gap-1 flex-wrap">
            <button
              v-for="level in spellLevels"
              :key="level"
              @click="selectedLevel = selectedLevel === level ? 'all' : level"
              :class="[
                'btn text-xs px-2 py-1',
                selectedLevel === level ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ level === 'all' ? 'All Levels' : `Level ${level}` }}
            </button>
          </div>
        </div>

        <!-- Spell List -->
        <div class="flex-1 overflow-y-auto">
          <!-- Prepared Spells Section -->
          <div v-if="preparedSpellsList.length > 0" class="mb-4">
            <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5">Prepared Spells</h3>
            <div class="grid grid-cols-1 gap-1.5 mb-3">
              <div
                v-for="spell in preparedSpellsList"
                :key="spell.name"
                class="card-compact p-2 border-l-2 border-[var(--color-success)]"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="text-sm font-bold text-[var(--color-text-primary)] m-0">{{ spell.name }}</h3>
                      <span class="text-xs px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded text-[var(--color-text-tertiary)]">
                        {{ spell.school }}
                      </span>
                      <span class="text-xs text-[var(--color-text-tertiary)]">{{ spell.castingTime }}</span>
                      <span class="text-xs px-1.5 py-0.5 bg-[var(--color-success)]/20 text-[var(--color-success)] rounded font-semibold">Prepared</span>
                    </div>
                    <p v-if="spell.description" class="text-xs text-[var(--color-text-secondary)] mb-1 line-clamp-2">{{ spell.description }}</p>
                    <div class="text-xs text-[var(--color-text-tertiary)]">
                      <span>{{ spell.range }}</span>
                      <span class="mx-1">•</span>
                      <span>{{ spell.components }}</span>
                      <span class="mx-1">•</span>
                      <span>{{ spell.duration }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1 shrink-0">
                    <button
                      @click="togglePrepared(spell.name)"
                      class="btn btn-success text-xs px-2 py-1"
                      title="Unprepare spell"
                    >
                      ✓ Prepared
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Unprepared Spells Section -->
          <div>
            <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5" :class="preparedSpellsList.length > 0 ? 'mt-4' : 'mt-0'">Available Spells</h3>
            <div
              v-for="level in [1, 2, 3, 4, 5]"
              :key="level"
              v-show="selectedLevel === 'all' || selectedLevel === level"
            >
              <h4 class="text-xs font-semibold text-[var(--color-text-tertiary)] mb-1.5 mt-2 first:mt-0">Level {{ level }} Spells</h4>
              <div class="grid grid-cols-1 gap-1.5 mb-3">
                <div
                  v-for="spell in getUnpreparedSpellsByLevel(level)"
                  :key="spell.name"
                  class="card-compact p-2"
                >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="text-sm font-bold text-[var(--color-text-primary)] m-0">{{ spell.name }}</h3>
                      <span class="text-xs px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded text-[var(--color-text-tertiary)]">
                        {{ spell.school }}
                      </span>
                      <span class="text-xs text-[var(--color-text-tertiary)]">{{ spell.castingTime }}</span>
                    </div>
                    <p v-if="spell.description" class="text-xs text-[var(--color-text-secondary)] mb-1 line-clamp-2">{{ spell.description }}</p>
                    <div class="text-xs text-[var(--color-text-tertiary)]">
                      <span>{{ spell.range }}</span>
                      <span class="mx-1">•</span>
                      <span>{{ spell.components }}</span>
                      <span class="mx-1">•</span>
                      <span>{{ spell.duration }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1 shrink-0">
                    <button
                      @click="togglePrepared(spell.name)"
                      :class="[
                        'btn text-xs px-2 py-1',
                        isPrepared(spell.name) ? 'btn-success' : 'btn-secondary',
                        canPrepareSpell(spell) ? '' : 'opacity-50 cursor-not-allowed'
                      ]"
                      :disabled="!canPrepareSpell(spell) && !isPrepared(spell.name)"
                      :title="getPrepareButtonTitle(spell)"
                    >
                      {{ isPrepared(spell.name) ? '✓ Prepared' : '○ Unprepared' }}
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="preparedSpellsList.length === 0 && getUnpreparedSpellsByLevel(1).length === 0 && getUnpreparedSpellsByLevel(2).length === 0 && getUnpreparedSpellsByLevel(3).length === 0 && getUnpreparedSpellsByLevel(4).length === 0 && getUnpreparedSpellsByLevel(5).length === 0" class="text-center py-4 text-[var(--color-text-muted)] italic text-sm">
            No spells found
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Spell } from '~/types/character'
import paladinSpellsData from '~/data/spells/Paladin.json'
import { getPaladinPreparedSpellCount } from '~/composables/spellSlots'

interface SpellData {
  name: string
  level: number
  school: string
  castingTime: string
  range: string
  components: string
  duration: string
  description: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { character, addSpell, removeSpell, syncSpellActions, getClassLevel, ensurePaladinSpells } = useCharacter()

const searchQuery = ref('')
const selectedLevel = ref<'all' | 1 | 2 | 3 | 4 | 5>('all')

// Check if character is a Paladin
const isPaladin = computed(() => {
  return getClassLevel('Paladin') > 0
})

// Get Paladin level
const paladinLevel = computed(() => {
  return getClassLevel('Paladin')
})

// Calculate max prepared spells for Paladin
const maxPreparedSpells = computed(() => {
  if (!isPaladin.value || paladinLevel.value < 1) return 0
  const charismaModifier = character.value.abilities.charisma.modifier
  return getPaladinPreparedSpellCount(paladinLevel.value, charismaModifier)
})

// Count currently prepared spells
const preparedCount = computed(() => {
  return character.value.spells.filter(s => s.prepared).length
})

// Get spell slots by level
const spellSlotsByLevel = computed(() => {
  return character.value.spellSlots.filter(slot => slot.total > 0)
})

// Check if a spell can be prepared
const canPrepareSpell = (spell: SpellData): boolean => {
  // If already prepared, can always unprepare
  if (isPrepared(spell.name)) return true

  // Check if preparation limit is reached
  if (preparedCount.value >= maxPreparedSpells.value && maxPreparedSpells.value > 0) {
    return false
  }

  // Check if spell level has available slots
  const slotForLevel = character.value.spellSlots.find(s => s.level === spell.level)
  if (!slotForLevel || slotForLevel.total === 0) {
    return false
  }

  return true
}

// Get tooltip text for prepare button
const getPrepareButtonTitle = (spell: SpellData): string => {
  if (isPrepared(spell.name)) {
    return 'Unprepare spell'
  }

  if (!canPrepareSpell(spell)) {
    if (preparedCount.value >= maxPreparedSpells.value && maxPreparedSpells.value > 0) {
      return 'Preparation limit reached'
    }
    const slotForLevel = character.value.spellSlots.find(s => s.level === spell.level)
    if (!slotForLevel || slotForLevel.total === 0) {
      return `No spell slots available for level ${spell.level}`
    }
  }

  return 'Prepare spell'
}

const paladinSpells = (paladinSpellsData as { spells: SpellData[] }).spells

const spellLevels = ['all', 1, 2, 3, 4, 5] as const

const filteredSpells = computed(() => {
  let spells = paladinSpells

  if (selectedLevel.value !== 'all') {
    spells = spells.filter(s => s.level === selectedLevel.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    spells = spells.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.school.toLowerCase().includes(query)
    )
  }

  return spells
})

const getSpellsByLevel = (level: number): SpellData[] => {
  return filteredSpells.value.filter(s => s.level === level)
}

// Get prepared spells list
const preparedSpellsList = computed(() => {
  return paladinSpells
    .filter(spell => isPrepared(spell.name))
    .filter(spell => {
      // Apply search filter if active
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        return spell.name.toLowerCase().includes(query) ||
          spell.description.toLowerCase().includes(query) ||
          spell.school.toLowerCase().includes(query)
      }
      return true
    })
    .filter(spell => {
      // Apply level filter if active
      if (selectedLevel.value !== 'all') {
        return spell.level === selectedLevel.value
      }
      return true
    })
})

// Get unprepared spells by level (only show spells of levels with available spell slots)
const getUnpreparedSpellsByLevel = (level: number): SpellData[] => {
  // Check if this spell level has available slots
  const slotForLevel = character.value.spellSlots.find(s => s.level === level)
  if (!slotForLevel || slotForLevel.total === 0) {
    return [] // Don't show spells for levels without slots
  }

  return filteredSpells.value
    .filter(s => s.level === level)
    .filter(s => !isPrepared(s.name))
}

const hasSpell = (spellName: string): boolean => {
  return character.value.spells.some(s => s.name === spellName)
}

const isPrepared = (spellName: string): boolean => {
  const spell = character.value.spells.find(s => s.name === spellName)
  return spell?.prepared ?? false
}

const togglePrepared = (spellName: string): void => {
  let spell = character.value.spells.find(s => s.name === spellName)

  // If spell doesn't exist in character's spellbook, add it first
  if (!spell) {
    const spellData = paladinSpells.find(s => s.name === spellName)
    if (!spellData) return

    const newSpell: Omit<Spell, 'id'> = {
      name: spellData.name,
      level: spellData.level,
      school: spellData.school,
      castingTime: spellData.castingTime,
      range: spellData.range,
      components: spellData.components,
      duration: spellData.duration,
      description: spellData.description,
      prepared: false,
    }
    addSpell(newSpell)
    spell = character.value.spells.find(s => s.name === spellName)
  }

  if (spell) {
    // Check if we can prepare (allow unpreparing always)
    if (!spell.prepared) {
      // Find the spell data to check preparation limits
      const spellData = paladinSpells.find(s => s.name === spellName)
      if (spellData && !canPrepareSpell(spellData)) {
        return // Don't prepare if limit reached or no slots
      }
    }

    spell.prepared = !spell.prepared
    // Sync actions after preparation status changes
    syncSpellActions()
  }
}

const close = () => {
  emit('close')
}
</script>

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
          <div
            v-for="level in [1, 2, 3, 4, 5]"
            :key="level"
            v-show="selectedLevel === 'all' || selectedLevel === level"
          >
            <h3 class="text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5 mt-2 first:mt-0">Level {{ level }} Spells</h3>
            <div class="grid grid-cols-1 gap-1.5 mb-3">
              <div
                v-for="spell in getSpellsByLevel(level)"
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
                      v-if="hasSpell(spell.name)"
                      @click="removeSpellFromCharacter(spell.name)"
                      class="btn btn-danger text-xs px-2 py-1"
                      title="Remove spell"
                    >
                      Remove
                    </button>
                    <button
                      v-else
                      @click="addSpellToCharacter(spell)"
                      class="btn btn-primary text-xs px-2 py-1"
                      title="Add spell"
                    >
                      Add
                    </button>
                    <button
                      v-if="hasSpell(spell.name)"
                      @click="togglePrepared(spell.name)"
                      :class="[
                        'btn text-xs px-2 py-1',
                        isPrepared(spell.name) ? 'btn-success' : 'btn-secondary'
                      ]"
                      :title="isPrepared(spell.name) ? 'Unprepare spell' : 'Prepare spell'"
                    >
                      {{ isPrepared(spell.name) ? '✓' : '○' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="filteredSpells.length === 0" class="text-center py-4 text-[var(--color-text-muted)] italic text-sm">
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

const { character, addSpell, removeSpell } = useCharacter()

const searchQuery = ref('')
const selectedLevel = ref<'all' | 1 | 2 | 3 | 4 | 5>('all')

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

const hasSpell = (spellName: string): boolean => {
  return character.value.spells.some(s => s.name === spellName)
}

const isPrepared = (spellName: string): boolean => {
  const spell = character.value.spells.find(s => s.name === spellName)
  return spell?.prepared ?? false
}

const addSpellToCharacter = (spellData: SpellData): void => {
  const spell: Omit<Spell, 'id'> = {
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
  addSpell(spell)
}

const removeSpellFromCharacter = (spellName: string): void => {
  const spell = character.value.spells.find(s => s.name === spellName)
  if (spell) {
    removeSpell(spell.id)
  }
}

const togglePrepared = (spellName: string): void => {
  const spell = character.value.spells.find(s => s.name === spellName)
  if (spell) {
    spell.prepared = !spell.prepared
  }
}

const close = () => {
  emit('close')
}
</script>

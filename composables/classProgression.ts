import type { Character, FeatureTrait } from '~/types/character'
import progressionJson from '~/data/class-progression.json'

export type ClassType = NonNullable<Character['classType']>

export interface FeatureSpec {
  readonly name: string
  readonly description: string
}

export interface StartingHpRule {
  readonly base: 'maxHitDie'
  readonly addCon: boolean
}

export interface LevelUpHpRule {
  readonly average: 'halfHitDieFloor'
  readonly addCon: boolean
  readonly minGain: number
}

export interface ClassHpRules {
  readonly starting: StartingHpRule
  readonly levelUp: LevelUpHpRule
}

export interface ClassLevelSpec {
  readonly features?: readonly FeatureSpec[]
}

export interface ClassProgressionSpec {
  readonly hitDie: number
  readonly hp: ClassHpRules
  readonly levels: Readonly<Record<string, ClassLevelSpec>>
}

export interface ClassProgressionFile {
  readonly version: number
  readonly classes: Readonly<Record<string, ClassProgressionSpec>>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function assertProgressionFile(value: unknown): asserts value is ClassProgressionFile {
  if (!isRecord(value)) throw new Error('Invalid class progression: expected object')
  if (!isNumber(value.version)) throw new Error('Invalid class progression: missing version')
  if (!isRecord(value.classes)) throw new Error('Invalid class progression: missing classes')

  Object.entries(value.classes).forEach(([className, classValue]) => {
    if (!isRecord(classValue)) throw new Error(`Invalid class progression: class ${className} is not an object`)
    if (!isNumber(classValue.hitDie)) throw new Error(`Invalid class progression: class ${className} missing hitDie`)
    if (!isRecord(classValue.hp)) throw new Error(`Invalid class progression: class ${className} missing hp`)

    const hp = classValue.hp
    if (!isRecord(hp.starting)) throw new Error(`Invalid class progression: class ${className} missing hp.starting`)
    if (!isRecord(hp.levelUp)) throw new Error(`Invalid class progression: class ${className} missing hp.levelUp`)

    if (hp.starting.base !== 'maxHitDie') throw new Error(`Invalid class progression: class ${className} hp.starting.base`)
    if (typeof hp.starting.addCon !== 'boolean') throw new Error(`Invalid class progression: class ${className} hp.starting.addCon`)

    if (hp.levelUp.average !== 'halfHitDieFloor') throw new Error(`Invalid class progression: class ${className} hp.levelUp.average`)
    if (typeof hp.levelUp.addCon !== 'boolean') throw new Error(`Invalid class progression: class ${className} hp.levelUp.addCon`)
    if (!isNumber(hp.levelUp.minGain)) throw new Error(`Invalid class progression: class ${className} hp.levelUp.minGain`)

    if (!isRecord(classValue.levels)) throw new Error(`Invalid class progression: class ${className} levels is not an object`)
    Object.entries(classValue.levels).forEach(([levelKey, levelValue]) => {
      if (!isRecord(levelValue)) throw new Error(`Invalid class progression: class ${className} level ${levelKey} is not an object`)
      if (levelValue.features === undefined) return
      if (!Array.isArray(levelValue.features)) throw new Error(`Invalid class progression: class ${className} level ${levelKey} features is not an array`)
      levelValue.features.forEach((feature, idx) => {
        if (!isRecord(feature)) throw new Error(`Invalid class progression: class ${className} level ${levelKey} feature[${idx}] not object`)
        if (!isString(feature.name)) throw new Error(`Invalid class progression: class ${className} level ${levelKey} feature[${idx}] missing name`)
        if (!isString(feature.description)) throw new Error(`Invalid class progression: class ${className} level ${levelKey} feature[${idx}] missing description`)
      })
    })
  })
}

const progression: ClassProgressionFile = (() => {
  const raw: unknown = progressionJson
  assertProgressionFile(raw)
  return raw
})()

export function getAllClassTypes(): readonly ClassType[] {
  return Object.keys(progression.classes) as readonly ClassType[]
}

function getClassSpec(classType: ClassType): ClassProgressionSpec {
  const spec = progression.classes[classType]
  if (!spec) {
    throw new Error(`Missing class progression spec for ${classType}`)
  }
  return spec
}

export function getHitDie(classType: ClassType): number {
  return getClassSpec(classType).hitDie
}

export function getStartingHpBase(classType: ClassType, conModifier: number): number {
  const spec = getClassSpec(classType)
  const base = spec.hp.starting.base === 'maxHitDie' ? spec.hitDie : spec.hitDie
  return base + (spec.hp.starting.addCon ? conModifier : 0)
}

export function getAverageHpGainOnLevelUp(classType: ClassType): number {
  const spec = getClassSpec(classType)
  if (spec.hp.levelUp.average === 'halfHitDieFloor') {
    // Per user request: d10 average => 5 (floor of half the die)
    return Math.floor(spec.hitDie / 2)
  }
  return Math.floor(spec.hitDie / 2)
}

export interface HpChoice {
  readonly method: 'average' | 'roll'
  readonly roll?: number
}

export function computeHpGainOnLevelUp(classType: ClassType, conModifier: number, choice: HpChoice): number {
  const spec = getClassSpec(classType)
  const baseGain = choice.method === 'average'
    ? getAverageHpGainOnLevelUp(classType)
    : (choice.roll ?? rollDie(spec.hitDie))

  const gained = baseGain + (spec.hp.levelUp.addCon ? conModifier : 0)
  return Math.max(spec.hp.levelUp.minGain, gained)
}

export function getClassFeaturesForLevel(classType: ClassType, level: number): readonly FeatureSpec[] {
  const spec = getClassSpec(classType)
  const levelSpec = spec.levels[String(level)]
  return levelSpec?.features ?? []
}

export function addMissingClassFeatures(
  featuresTraits: FeatureTrait[],
  classType: ClassType,
  level: number,
): FeatureTrait[] {
  const featuresToAdd = getClassFeaturesForLevel(classType, level)
    .filter(feature => !featuresTraits.some(existing => existing.source === 'Class' && existing.name === feature.name))
    .map(feature => ({
      id: crypto.randomUUID(),
      name: feature.name,
      description: feature.description,
      source: 'Class' as const,
    }))

  if (featuresToAdd.length === 0) return featuresTraits
  return [...featuresTraits, ...featuresToAdd]
}

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}


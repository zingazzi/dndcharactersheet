import type { ClassProgressionFile, ClassProgressionSpec } from '~/composables/classProgression'

import Barbarian from './Barbarian.json'
import Bard from './Bard.json'
import Cleric from './Cleric.json'
import Druid from './Druid.json'
import Fighter from './Fighter.json'
import Monk from './Monk.json'
import Paladin from './Paladin.json'
import Ranger from './Ranger.json'
import Rogue from './Rogue.json'
import Sorcerer from './Sorcerer.json'
import Warlock from './Warlock.json'
import Wizard from './Wizard.json'

const classes: Readonly<Record<string, ClassProgressionSpec>> = {
  Barbarian: Barbarian as ClassProgressionSpec,
  Bard: Bard as ClassProgressionSpec,
  Cleric: Cleric as ClassProgressionSpec,
  Druid: Druid as ClassProgressionSpec,
  Fighter: Fighter as ClassProgressionSpec,
  Monk: Monk as ClassProgressionSpec,
  Paladin: Paladin as ClassProgressionSpec,
  Ranger: Ranger as ClassProgressionSpec,
  Rogue: Rogue as ClassProgressionSpec,
  Sorcerer: Sorcerer as ClassProgressionSpec,
  Warlock: Warlock as ClassProgressionSpec,
  Wizard: Wizard as ClassProgressionSpec,
}

const progression: ClassProgressionFile = {
  version: 1,
  classes,
}

export default progression


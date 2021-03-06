import * as types from 'aer-types'
import shortid from 'shortid'
import { selectors } from 'Redux/Store'
import { getMageIdsFromSimpleArray } from 'Redux/Store/Expeditions/Expeditions/sideEffects/helpers'
import { determineUsedExpansions } from 'Redux/Store/Expeditions/Expeditions/sideEffects/createSettingsSnapshot/determineUsedExpansions'
import { RootState } from 'Redux/Store'
import { getLatestMigrationVersion } from 'Redux/Store/Expeditions/Expeditions/migrations'

export const convertExpeditionFromConfig = (
  config: types.ExpeditionConfig,
  state: RootState
): types.Expedition => {
  const expeditionId = shortid.generate()
  const seed = {
    seed: config.seedConfig || shortid.generate(),
    supplyState: true,
    nemesisState: true,
  }
  const allMages = selectors.Settings.Expansions.Mages.content.getContent(state)
    .ENG
  const mageArray = Object.keys(allMages).map(function (id) {
    let mage = allMages[id]
    return mage
  })
  if (config.initialBarracksConfig) {
    config.initialBarracksConfig.mageIds = getMageIdsFromSimpleArray({
      mage: config.initialBarracksConfig.mageIds,
      seed,
      stillAvailableMageIds: mageArray.map(({ id }) => id),
    }).result
  }
  console.log(allMages)
  console.log(mageArray.map(({ id }) => id))
  const expedition = {
    id: expeditionId,
    name: config.name,
    bigPocketVariant: config.bigPocketVariantConfig,
    score: 0,
    seed: seed,
    barracks: {
      supplyIds: config.initialBarracksConfig?.supplyIds || [],
      mageIds: config.initialBarracksConfig?.mageIds || [],
      treasureIds: config.initialBarracksConfig?.treasureIds || [],
    },
    banished: [],
    finished: false,
    upgradedBasicNemesisCards: config.initialUBNCardsConfig || [],
    settingsSnapshot: {
      ...config.settingsSnapshotConfig,
      usedExpansions: determineUsedExpansions(
        state,
        config.settingsSnapshotConfig,
        config.sequenceConfig.branches,
        config.initialBarracksConfig
      ),
    },
    sequence: {
      firstBranchId: config.sequenceConfig.firstBranchId,
      branches: Object.keys(config.sequenceConfig.branches)
        .map((key) => {
          const branch = {
            ...config.sequenceConfig.branches[key],
            id: key,
            expeditionId,
            status:
              key === config.sequenceConfig.firstBranchId
                ? 'unlocked'
                : 'locked',
            ...(config.sequenceConfig.branches[key].type === 'battle'
              ? { tries: 0 }
              : {}),
          }

          return branch
        })
        .reduce(
          (acc, branch) => ({
            ...acc,
            [branch.id]: branch,
          }),
          {}
        ),
    },
    migrationVersion: getLatestMigrationVersion(),
  }

  return expedition
}

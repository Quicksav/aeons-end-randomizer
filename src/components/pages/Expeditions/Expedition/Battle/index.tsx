import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import { RootState, actions, selectors } from 'Redux/Store'
import * as types from 'types'

import { useStateModals } from './useStateModals'
import { handleBattleClick } from './handleBattleClick'
import BattleWrapper from './BattleWrapper'
import BattleTile from './BattleTile'
import BeforeBattle from './BeforeBattle'
import BattleStarted from './BattleStarted'
import BattleWon from './BattleWon'
import BattleLost from './BattleLost'
import ExpeditionFinished from './ExpeditionFinished'

type OwnProps = {
  battle: types.Battle
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const nemesisId = ownProps.battle.nemesisId
  const nemesis = nemesisId
    ? selectors.Settings.Expansions.SelectedNemeses.getNemesisById(state, {
        id: nemesisId,
      })
    : null

  return {
    nemesis,
    expeditionIsFinished: selectors.Expeditions.Expeditions.getExpeditionIsFinished(
      state,
      { expeditionId: ownProps.battle.expeditionId }
    ),
  }
}

const mapDispatchToProps = {
  rollBattle: actions.Expeditions.Expeditions.rollBattle,
}

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  OwnProps

const Battle = ({
  battle,
  expeditionIsFinished,
  nemesis,
  rollBattle,
}: Props) => {
  const {
    beforeBattle,
    battleStarted,
    battleLost,
    battleWon,
    expeditionComplete,
  } = useStateModals()

  const clickHandlerConfig = {
    expeditionIsFinished,
    expeditionComplete,
    battle,
    beforeBattle,
    battleStarted,
    battleLost,
    battleWon,
    rollBattle,
  }

  const handleClick = useCallback(() => handleBattleClick(clickHandlerConfig), [
    clickHandlerConfig,
  ])

  const battleWonCallback = useCallback(
    expeditionIsFinished => {
      if (expeditionIsFinished) {
        expeditionComplete.show()
      } else {
        battleWon.show()
      }
    },
    [battleWon, expeditionComplete]
  )

  return (
    <div>
      <BattleWrapper
        disabled={battle.status === 'locked' || battle.status === 'finished'}
        onClick={handleClick}
      >
        <BattleTile battle={battle} nemesis={nemesis ? nemesis.name : '?'} />
      </BattleWrapper>

      <beforeBattle.RenderModal titleColor="#333" titleLabel="Before Fight">
        <BeforeBattle
          hide={beforeBattle.hide}
          battle={battle}
          nemesis={nemesis ? nemesis : undefined}
          showNext={battleStarted.show}
        />
      </beforeBattle.RenderModal>

      <battleStarted.RenderModal titleColor="#333" titleLabel="Resolve battle">
        <BattleStarted
          hide={battleStarted.hide}
          battle={battle}
          showNextOnWin={battleWonCallback}
          showNextOnLoss={battleLost.show}
        />
      </battleStarted.RenderModal>

      <battleLost.RenderModal titleColor="#333" titleLabel="Battle lost">
        <BattleLost
          hide={battleLost.hide}
          battle={battle}
          showNext={beforeBattle.show}
        />
      </battleLost.RenderModal>

      <battleWon.RenderModal titleColor="#333" titleLabel="Rewards">
        <BattleWon hide={battleWon.hide} battle={battle} />
      </battleWon.RenderModal>

      <expeditionComplete.RenderModal
        titleColor="#333"
        titleLabel="Congratulations"
      >
        <ExpeditionFinished battle={battle} hide={expeditionComplete.hide} />
      </expeditionComplete.RenderModal>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Battle))
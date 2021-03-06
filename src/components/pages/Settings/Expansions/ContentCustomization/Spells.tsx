import React from 'react'
import { connect } from 'react-redux'

import { RootState, selectors, actions } from 'Redux/Store'

import CardListItem from './CardListItem'

const mapStateToProps = (state: RootState, props: { expansionId: string }) => ({
  selectedSpells: selectors.Settings.Expansions.Cards.getSpellsByExpansionId(
    state,
    props
  ),
})

const mapDispatchToProps = {
  handleSpellChange: actions.Settings.Expansions.Cards.selected.toggleCard,
}

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    expansionId: string
  }

const Spells = ({ selectedSpells, handleSpellChange }: Props) => (
  <CardListItem
    entities={selectedSpells}
    handleCheckboxChange={handleSpellChange}
    label="Spells"
  />
)

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Spells))

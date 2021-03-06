import React from 'react'
import { withTheme } from 'styled-components/macro'

import { connect } from 'react-redux'
import * as types from 'aer-types'

import { RootState, selectors } from '../../../Redux/Store'

import { RenderModalType } from '../../../hooks/useModal'

import ModalBodyWrapper from '../../atoms/ModalBodyWrapper'

import Body from '../SupplyCardInformation'

export type CardProperties = {
  type: types.CardType
  name: string
  expansion: string
  cost: number
  keywords: string[]
  effect: string
  selected: boolean
}

const mapStateToProps = (state: RootState, _: any) => ({
  expansions: selectors.Settings.Expansions.Expansions.content.getContent(
    state
  ),
})

type Props = ReturnType<typeof mapStateToProps> & {
  card: CardProperties
  theme: any
  RenderModal: RenderModalType
}

const SupplyModal = ({ card, expansions, theme, RenderModal }: Props) => {
  const titleColor = card
    ? theme.colors.cards[card.type.toLowerCase()].color
    : theme.colors.text
  const titleLabel = card ? card.name : ''
  const body = card ? (
    <Body
      card={card}
      expansionName={expansions.ENG[card.expansion].name || ''}
    />
  ) : (
    'No content'
  )

  return (
    <RenderModal titleColor={titleColor} titleLabel={titleLabel}>
      <ModalBodyWrapper>{body}</ModalBodyWrapper>
    </RenderModal>
  )
}

export default withTheme(
  connect(mapStateToProps, null)(React.memo(SupplyModal))
)

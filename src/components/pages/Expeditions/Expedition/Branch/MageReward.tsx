import React from 'react'

import * as types from 'types'

import SectionHeadline from 'components/atoms/SectionHeadline'
import MageList from 'components/molecules/MageList'

type Props = {
  mages: types.Mage[]
}

const MageReward = ({ mages }: Props) => {
  return (
    <>
      {mages.length > 0 && <SectionHeadline>New Mages</SectionHeadline>}
      {mages.length > 0 && <MageList mages={mages} />}
    </>
  )
}

export default React.memo(MageReward)
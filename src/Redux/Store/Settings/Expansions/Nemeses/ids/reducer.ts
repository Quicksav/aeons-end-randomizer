import { LoopReducer } from 'redux-loop'

import AERData from 'aer-data'

import { Action, State } from './types'

export const initialState: State = AERData.normalizedData.ENG.nemesisIds

export const Reducer: LoopReducer<State, Action> = (
  state: State = initialState,
  action: Action
) => {
  switch (action.type) {
    default: {
      return state
    }
  }
}

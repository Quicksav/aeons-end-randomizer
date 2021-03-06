import { combineReducers } from 'redux-loop'
import { createSelector } from 'reselect'
import { selectors as LanguageSelectors } from '../Languages'

import * as Content from './content'
import * as Selected from './selected'
import * as Ids from './ids'
import {
  getEntitiesByIdListWithLanguageFallback,
  getContentByIdWithLanguageFallback,
} from '../helpers'

///////////
// STATE //
///////////

export type State = {
  selected: Selected.State
  ids: Ids.State
  content: Content.State
}

export const initialState: State = {
  selected: Selected.initialState,
  ids: Ids.initialState,
  content: Content.initialState,
}

/////////////
// ACTIONS //
/////////////

export type Action = Selected.Action

export const actions = {
  selected: Selected.actions,
  ids: Ids.actions,
  content: Content.actions,
}

/////////////
// REDUCER //
/////////////

export const Reducer = combineReducers({
  selected: Selected.Reducer,
  ids: Ids.Reducer,
  content: Content.Reducer,
})

///////////////
// SELECTORS //
///////////////

// Primitive

const getExpansionId = (_: unknown, props: { expansionId: string }) =>
  props.expansionId

// Memoized

const getMageIdsByExpansionId = createSelector(
  [Content.selectors.getContent, Ids.selectors.getIds, getExpansionId],
  (content, ids, expansionId) =>
    ids.filter(id => content.ENG[id].expansion === expansionId)
)

const getMagesByExpansionId = createSelector(
  [
    Content.selectors.getContent,
    getMageIdsByExpansionId,
    LanguageSelectors.getSelectedLanguageByExpansionId,
  ],
  getEntitiesByIdListWithLanguageFallback
)

const getSelectedMages = createSelector(
  [
    Content.selectors.getContent,
    Selected.selectors.getSelected,
    LanguageSelectors.getLanguagesByExpansion,
  ],
  (content, selectedIds, languages) =>
    selectedIds.map(id =>
      getContentByIdWithLanguageFallback(languages, content, id)
    )
)

export const selectors = {
  selected: Selected.selectors,
  ids: Ids.selectors,
  content: Content.selectors,
  getMagesByExpansionId,
  getSelectedMages,
}

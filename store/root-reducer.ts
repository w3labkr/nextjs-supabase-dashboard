import { combineReducers } from '@reduxjs/toolkit'

import i18nReducer from './features/i18n-slice'

// Nested Persists
const rootReducer = combineReducers({
  i18n: i18nReducer,
})

export default rootReducer
